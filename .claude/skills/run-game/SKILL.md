---
name: run-game
description: Launch and drive the Lumoria browser game (the static HTML/JS app) in a headless browser to render screens, drive battles, and capture screenshots. Use when asked to run/open the game, screenshot a screen (title, dex/Luminex entry, battle), or verify a gameplay change visually.
---

# Running Lumoria (browser game)

Lumoria is a **static** client-side game: `index.html` + `js/*.js` + `css/style.css`,
no build step. "Running it" = serve the folder + drive a headless Chromium against it.

## 1. Serve the folder

Run in the background (use the Bash tool's `run_in_background: true`, NOT a trailing
`&` — a backgrounded `&` job gets signalled when the call ends, exit 144):

```
python3 -m http.server 8099 --bind 127.0.0.1
```

Wait for it, then drive: `until curl -sf http://127.0.0.1:8099/index.html >/dev/null; do sleep 0.3; done`

## 2. Headless Chromium

A Chromium is **pre-installed** (the Playwright CDN is blocked, so don't
`npx playwright install`). Use the global Playwright module + the pre-installed binary:

- module: `/opt/node22/lib/node_modules/playwright`
- binary: `/opt/pw-browsers/chromium-*/chrome-linux/chrome`
- env: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`, launch args `['--no-sandbox']`

```js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', // glob the actual dir
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 520, height: 900 }, deviceScaleFactor: 2 });
await page.goto('http://localhost:8099/index.html', { waitUntil: 'load' });
await page.waitForFunction(() => typeof showScreen === 'function'); // app globals ready
```

## 3. Critical gotchas (these will bite)

- **Globals are NOT on `window`.** The scripts are classic `<script>`s using top-level
  `const`/`let`, which create global *lexical* bindings, not `window.*` properties. In
  `page.evaluate`, reference them **bare** (`showDexDetail(7)`, `MONSTERS_DATA`), never
  `window.showDexDetail`. `function`-declared names (e.g. `startWildBattle`) are also on
  `window`, but staying bare is consistent.
- **`G` (game state) starts `null`** and is a lexical `let`. Reassign it with a **bare
  assignment** inside evaluate: `G = newGameState('Tester', 7)`. `window.G = …` will NOT
  be seen by game code.
- **Benign console noise:** `online.js` (Firebase) throws `ERR_CERT_AUTHORITY_INVALID`,
  a `404`, and one `PAGEERR: Cannot read properties of undefined (reading 'length')`.
  These are network/offline artifacts and do not affect rendering or battles — filter them.

## 4. Useful entry points

| Goal | Call (inside `page.evaluate`) |
|------|-------------------------------|
| Render a dex/Luminex entry | `G = { caughtMonsters: new Set([id]) }; document.querySelectorAll('.screen.active').forEach(s=>s.classList.remove('active')); document.getElementById('screen-dex').classList.add('active'); showDexDetail(id);` |
| Start a fresh game (party = starter) | `G = newGameState('Tester', starterId)` — e.g. `7` = Verdkin |
| Build a party member | `createPartySlot(monsterId, level)` |
| Start a wild battle | `startWildBattle(buildWildMon(monsterId, level))` — e.g. fight Photoworm `197` |
| Jump to any screen | `showScreen('screen-main' | 'screen-battle' | …)` |

**Drive a battle (e.g. Verdkin vs Photoworm):**
```js
await page.evaluate(() => {
  G = newGameState('Tester', 7);   // Verdkin Lv5 in team
  startWildBattle(buildWildMon(197, 5));  // wild Photoworm Lv5
});
await page.waitForSelector('#screen-battle.active');
// Controls: click #btn-fight -> the moves panel (#battle-moves-panel) un-hides ->
// click a #battle-moves-grid .move-btn. The panel ANIMATES, so after clicking
// #btn-fight wait ~500ms, then click the move with { force: true }. Between turns
// wait for #battle-main-actions to lose .hidden before clicking #btn-fight again.
// Read the log from #battle-log; status badges are #player-status-badge / #enemy-status-badge.
```

## 5. Stop the server

`pkill -f 'http.server 8099'` when done (don't leave it running across tasks).

## Notes
- Screenshot a specific element with `page.locator(sel).screenshot({path})` (e.g.
  `.pokedex-screen`, `#dex-detail`, `#screen-battle`).
- There is **no build/lint to run** for UI; `node scripts/validate.js` covers data integrity.
- Heads-up: this container is ephemeral and the local checkout can roll back a commit
  between turns — **untracked files get wiped**, so commit anything you want to keep.

## How to use this skill (capacity & best practice)

The point of this skill is **ground truth**: it runs the actual shipped game code, so it
answers "does X really work?" in a way that reading code or reasoning cannot. Use it
whenever there's a *factual* question about game behavior — **run it, don't reason about it.**

### Two modes of power

1. **Visual / UI driving** — *"does it look right / does the screen work?"*
   Render any of the ~23 screens, click through flows, screenshot, do before/after diffs.
   Best for: layout, styling, text wrapping, sprite rendering, "show me entry #316".

2. **Deterministic internal probing** — *"does this mechanic compute correctly?"* (the
   more reliable mode). Call the engine's own functions live in the page —
   `calcDamage(atk, def, move)`, `getMonTraits(mon)`, `addStatus(...)`,
   `buildWildMon(id, lvl)`, `applyOnHitReflect(...)`, `applyOnIncomingHit(...)`, and read
   `playerActiveMon` / `enemyActiveMon` state directly. This **bypasses the UI**, which
   matters because the battle UI's markup/timing differs across branches and is brittle to
   click-drive. When a click-driven turn won't resolve, drop to the function call.

### Recipe for a mechanic test (the reliable pattern)
```js
await page.evaluate(() => {
  G = newGameState('Tester', 7);          // player party
  startWildBattle(buildWildMon(197, 5));  // enemy
  // construct the exact condition:
  playerActiveMon.currentHP = Math.floor(playerActiveMon.maxHP / 2);
  // probe the mechanic deterministically (no UI):
  const move = MOVES_DATA.silk_bind;
  return { traits: getMonTraits(playerActiveMon), dmg: calcDamage(enemyActiveMon, playerActiveMon, move) };
});
```
Read the returned numbers / log lines as the verdict. `calcDamage` returns
`{damage, effectiveness, crit}`; trait recoil/heal hooks mutate `attacker.currentHP` /
`defender.currentHP`; full-turn flow is `doAttack(atk, def, moveId, isPlayer)` but it needs
real battle context and can throw (`missMsgs is not iterable`) under a synthetic setup —
prefer the lower-level calls when that happens.

### To get the sharpest answer, tell me:
- **The branch** if not the current one — I spin up a throwaway `git worktree` off the
  remote ref (e.g. `git worktree add --detach /tmp/wt origin/<branch>`), serve from there,
  then `git worktree remove --force` after. Trait/ability code lives on
  `claude/abilities-feature`, not `main`.
- **The exact condition** — level, HP, status, which move (and physical vs special).
- **What "working" looks like** — HP should go *up*, a specific log line should appear,
  damage should be ~N. Gives a clear pass/fail.

### What it's great at / can't do
- ✅ Objective mechanic verification, screenshots, constructing exact edge-case states,
  comparing behavior across branches.
- ⚠️ Can't simulate enemy-AI move *choice* through the UI — to test "enemy uses move Y",
  call the move function directly. Click-driving multi-turn battles is brittle across
  branches. It measures what the code computes, not subjective fun/balance.

### Worked examples from real use
- **Visual:** rendered Luminex dex entries to verify the lore line-wrap fix (before/after).
- **Mechanic, passing:** `getMonTraits(Photoworm)` → `["thorned"]`; a physical hit ran
  `attacker 18→16` with `"🌹 Thorned: … 2 recoil damage"`; a special hit correctly did 0.
- **Mechanic, bug caught:** `mossy` returns `incomingDmgMod = -1` (intends heal) but
  `calcDamage` clamps with `Math.max(1, dmg)` → it deals **1 damage instead of healing**.
  Pure code-reading wouldn't have settled it; running it did.
