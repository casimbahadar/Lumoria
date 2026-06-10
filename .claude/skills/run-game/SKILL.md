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
