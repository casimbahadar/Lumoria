# Lumoria — QA & Testing-Readiness Report

**Date:** 2026-06-06
**Trigger:** Pre-Forgotten-audit readiness pass + live playtesting findings.
**Method:** Five parallel read-only code analyses (Forgotten data, battle engine, gating/encounters, online/PvP parity, validation tooling) + direct VM-load integrity verification to reconcile conflicting agent claims. All findings below were re-checked against source; conflicts are noted and resolved.

**Severity legend:** 🔴 **NEED** (broken / blocking / data-loss risk) · 🟡 **SHOULD** (correctness/balance/coherence risk) · 🟢 **NICE** (polish / robustness).

> **Reconciliation notes (don't re-litigate):** Authoritative VM-load checks confirm **0 orphan moves** (every learnset reference resolves to a defined `MOVES_DATA` key), **1133 move defs**, **500 monsters**, **type chart complete (26×26)**. Earlier "Forgotten signature moves are orphans" / "#465 Nyxviper has no Spectral STAB" claims were **false** (grep artifacts): `aether_jab`, `time_fracture` (Draconic, used), `nyx_fang` (Dark, used), etc. are all defined. The real moveset issue is the **opposite** — 128 *defined-but-unused* moves (see §E).

---

## A. Confirmed bugs from playtesting (user-reported) — all root-caused

### A1. 🔴 Mobile back/✕ buttons below tappable size
- **Root cause:** the 44px minimum-touch-target rule (`css/style.css:1695–1698`) enumerates specific classes but **omits `.btn-back`, `.btn-back-menu`, `.back-btn`**. `.btn-back` is ~30px tall (`padding:.4rem .8rem; font-size:.85rem`, `:162`), `.btn-back-menu` (the ✕) is icon-only with `padding:.25rem .5rem` (`:176`).
- **Affects:** every "← BACK" / "✕" across team, bag, dex, box, shop, quests, online, PvP, achievements screens.
- **Fix:** add `.btn-back, .btn-back-menu, .back-btn` to the `min-height:44px` rule; give `.btn-back-menu` a `min-width:44px` and center its glyph.
- **Test:** on a ≤480px viewport, tap every back/✕ button; confirm a 44×44 hit area (DevTools device mode / real phone).

### A2. 🔴 Type-color squares render grey (Nature etc.) — systemic, not just Nature
- **Root cause:** the 26-type rename was never propagated to the color maps. `getTypeColor()` (`js/game.js:1477–1485`) only maps the **16 legacy names** (Fire/Water/Grass/Electric/Ground/Wind/Ice/Dark/Fairy/Steel/Poison/Psychic/Dragon/Normal/Rock/Bug) and returns grey `#666` otherwise. The CSS `.type-*` classes (`css/style.css:26–41`) have the identical legacy-only list.
- **Affects ~18 of 26 types** → grey: Nature, Aquatic, Earth, Metal, Mental, Draconic, Mineral, Dream, Vapor, Fighting, Toxin, Spectral, Sonic, Stellar, Chrono, Crystal, Aether, Primal. Only the 8 coincidentally-unchanged names color correctly (Fire, Electric, Ice, Dark, Fairy, Poison, Normal, Wind) — which is why only *some* squares look grey.
- **Fix:** rewrite `getTypeColor`'s map to all 26 current type names with distinct colors, and mirror in the CSS `.type-*` classes. Single source of truth preferred (drive CSS from JS or vice-versa).
- **Test:** open move-info / move buttons / type badges for a mon of each of the 26 types; confirm every square is colored, none grey (unless grey is a deliberate type color).

### A3. 🔴 "Online features unavailable" popup on every successful catch
- **Root cause:** `onLumoriCaught()` (`js/online.js:2047`) fires on each catch and calls `submitLeaderboardScore()` ×2–3; each calls the **notifying** guard `requireOnline()` (`js/online.js:45`) which `showNotification(...)`s when `!onlineReady`. Offline ⇒ popup every catch (game.js call site `:1617`).
- **Fix:** passive/background submits must fail **silently** — guard with a bare `if (!onlineReady) return;` (no notification). Reserve `requireOnline()` (which notifies) for **user-initiated** actions only. Either split into `requireOnline()` vs `isOnline()`, or add a `silent` param.
- **Test:** with Firebase unconfigured (default), catch a wild Lumori; confirm **no** popup. Then open Leaderboards manually; confirm the "unavailable" notice still appears (intended for explicit actions).

### A4. 🟡 Solo-playable online modes are undiscoverable / hard-gated offline
- **Root cause:** `showPvPScreen()` (`js/online.js:894`) opens with `if (!requireOnline()) return;`, so an offline player is bounced with a popup and never sees the menu. The async **"🤖 Simulated"** modes — Quick Match, Gauntlet, FFA Royale (`index.html:730–734`) — are exactly the **AI-snapshot battles a single player can use**, but they require Firebase to fetch posted teams and are buried under "PvP" framing.
- **Gap:** there is **no offline/solo AI-battle entry point**, and the modes that *are* effectively single-player aren't surfaced as such.
- **Fix options (product decision):** (a) let the PvP screen render offline with a clear "online required to fetch opponents" inline state instead of a hard bounce; (b) relabel/booth the Simulated modes as "Solo vs AI teams"; (c) add a true offline AI-battle mode seeded from local/cached snapshots. **Recommend confirming desired direction before building.**
- **Test:** offline, tap Online ▸ PvP; observe the bounce. Decide intended behavior.

---

## B. Battle engine — new mechanics (`bonusVsStatus`, variable multi-hit) edge cases

> Both mechanics shipped in PR #74 and are correct on the happy path (verified: 2.0× on status match, 1.0× off-match; multi-hit `[2,5]` weighting 35/35/15/15, avg ~3.1, per-hit power preserved). The items below are edge cases.

- **B1. 🔴 `Math.max(1,dmg)` vs 0× immunity contradiction (amplified by `soul_lance "any"`).** For an ordinary 0× type matchup, `dmg*eff=0` → `floor(0*2)=0` → `return Math.max(1,dmg)=1`. The log prints **"It had no effect!"** *and* **"took 1 damage!"** (`js/game.js:~1947–1952`), and the target chips 1 HP through an immunity. Pre-existing, but `soul_lance` (wide, `"any"`) hits immune targets far more often. **Fix:** return 0 (and skip the damage line) when `eff===0`. **Test:** `soul_lance` into a Spectral-immune type that carries a status.
- **B2. 🟡 `"Hit N times!"` over-counts when the defender faints mid-loop.** Loop `break`s on `defender.fainted` (`game.js:~1901`) but the message uses the rolled `hitCount` (`:~1944`). Faint on hit 1 of a rolled-5 ⇒ "Hit 5 times!". **Fix:** report the actual delivered-hit counter `h`, not `hitCount`. **Test:** `basalt_volley`/`bone_barrage` vs a near-dead defender.
- **B3. 🟡 Crit message reflects only the *last* hit.** `lastResult` is the final iteration (`:~1946–1950`); an early-hit crit is never announced and a non-crit final hit suppresses the crit banner even when total damage included a crit. **Fix:** OR-accumulate crit across hits for messaging. **Test:** `double_smash` where hit 1 crits, hit 2 doesn't.
- **B4. 🟡 Secondary effect applies to an already-fainted defender.** `applyMoveEffect` runs once after the loop regardless of faint (`:~1980`); status/stat-down can be rolled and logged ("was poisoned!") *after* the faint. `addStatus` doesn't check `fainted`. **Fix:** skip post-loop effect if `defender.fainted`. **Test:** a 2-hit move with a status rider that KOs on hit 1.
- **B5. 🟡 `speup2` is an unhandled effect token (silent no-op).** `STAGE_FX` has `atkup2/defup2/spaup2/spdefup2/accup2` but **no `speup2`** (`js/battle.js:1170–1194`). Used by `aevum_speed` (Chrono) and `sky_dominion` (Wind, exclusive `speup2_and_atkup_self`). Both currently unused, so it's latent — but `sky_dominion` is an `exclusive` signature and could be wired in. **Fix:** add `speup2` to `STAGE_FX`. **Test:** assign `sky_dominion` to a test mon; confirm +2 Speed actually applies.
- **B6. 🟢 Latent crash: a `hits` range with `min<1`.** Non-`[2,5]` ranges roll `mn+floor(rand*(mx-mn+1))`; `[0,n]` could yield 0 hits ⇒ `lastResult` stays `null` ⇒ `lastResult.effectiveness` throws (`:~1947`). No live move does this; **add a `min>=1` author guard** (see §G).
- **B7. 🟢 Per-type status immunity makes some `bonusVsStatus` dead in mirrors.** `coil_strike` (Electric) can never get its 2× vs an Electric defender (Electric can't be paralyzed). Logically fine; documented so it isn't "fixed" by mistake.
- **B8. 🟢 `bonusVsStatus:"any"` breadth.** `"any"` doubles vs *any* non-empty `statuses[]` entry. If buff-style conditions are ever stored in `statuses[]`, `soul_lance` would double vs a non-afflicted target. Confirm the registry never stores buffs there. **Files:** `js/battle.js` (`calcDamage` 1103–1164, effect dispatch 1217–1314, `hasStatus` 525), `js/game.js` (multi-hit loop ~1881–1983).

---

## C. Online / PvP parity — recent changes introduced live-mode regressions

> **Architecture:** Async PvP (Singles/Doubles challenges, Quick Match, Gauntlet, FFA-vs-snapshots) **reuses the real engine** (`startPvpBattle`→`applyMove`) → full parity. **Live PvP** (1v1/2v2/FFA over Firebase) **forks** damage in `liveRealDamage` (`js/online.js:1202–1211`) and bypasses `applyMove`.

- **C1. 🔴 Multi-hit ignored in Live PvP — regression from PR #74.** `liveRealDamage` calls `calcDamage` **once** and never loops `move.hits`. Because PR #74 *lowered* per-hit power for `basalt_volley` (20) and `bone_barrage` (20) assuming 2–5 hits, they now deal ~⅕–⅓ of intended damage in live 1v1/2v2/FFA. Any future multi-hit move has the same defect. **Fix:** port the `move.hits` loop into `liveRealDamage` (small, localized). **Test:** live 1v1, fire `basalt_volley`; compare vs the same matchup in an async Singles challenge.
- **C2. 🔴 `bonusVsStatus` can never trigger in Live PvP.** `liveCalcMon` hardcodes `statuses:[]` each turn (`online.js:~1190–1197`) — live doesn't persist statuses — so the 2× condition is structurally unreachable. `virulent_surge`/`coil_strike`/`soul_lance` silently lose their payoff live. **Fix (decide):** persist statuses in live, or flag these moves as live-degraded. **Test:** apply a status in live (if possible) and confirm no 2×; confirm it *does* work async.
- **C3. 🟡 Live 2v2 / FFA share the same fork** (`resolveMultiLiveTurn`→`liveRealDamage`, `online.js:~1759/1792`) → same C1/C2 defects. **Test:** repeat C1/C2 in 2v2 and FFA.
- **C4. 🟡 Version skew governs live damage.** Live resolves on the **host** using the host's local `MOVES_DATA` (`:1206`). Old-host vs new-host produce different numbers for the same move; an unknown move id ⇒ 0 damage (`:1204`). **Test:** one client on pre-#74 code as host vs an updated guest; field a changed move.
- **C5. 🟢 No cross-client RNG desync.** Host is authoritative (`liveIsHost` gates resolution, `:1346–1348/1723`); guests render broadcast state. Multi-hit/crit RNG runs once on host. Host disconnect likely **stalls** rather than desyncs.
- **C6. 🟢 Serialization is by-key (good).** Teams/loadouts store move **ids** (`pvpSerializeMon :474–493`, `buildLiveTeam :1165–1184`), resolved against the resolver's local `MOVES_DATA` — new fields like `bonusVsStatus`/array `hits` are looked up fresh, never stale-snapshotted. Stats are snapshotted by value; moves are not.
- **C7. 🟢 Live ignores move priority** (speed-only ordering, `:1395`) — pre-existing; any priority added to a changed move won't apply live.

---

## D. Forgotten Lumori content (dex 462–500)

- **D1. 🔴 Forgotten legendary soft-lock — permanent species loss.** The 13 catchable Forgotten (`team[0]`, `catchRate:3`) appear as **one-time** post-quest wild encounters. `endBattle` pushes the id into `G.forgottenLegendaryAttempted` and `saveGame()`s **unconditionally, before the won/lost/ran branches** (`js/game.js:2082–2090`). So **KO, flee, blackout, or successful catch all consume it permanently** — accidentally KO'ing the Lv98–100 legendary (catchRate:3 ⇒ catches routinely fail) loses the species on that save with no retry. Only mitigation: Azura's 2 Master Orbs (`catchMult:255`) for 13 targets. **Fix (decide):** consume only on `caught`/`ran`; or cap player damage so it can't be KO'd; or make it re-triggerable; at minimum a warning prompt. **Test:** beat all 13 wielders, trigger the encounter, (a) KO it, (b) flee, (c) faint — confirm permanent loss each time.
- **D2. 🟡 29 Forgotten carry no post-game type despite 29 `LORE-AUDIT FLAG ... needs a 408+-only type per lore` markers** (the 10 rare-type carriers have no flag — tracking is internally consistent). **Chrono and Stellar appear in *zero* Forgotten.** Resolve each flag during the typing review (Chrono/Stellar are obvious candidate types, and their move pools are already defined — see E2). **Files:** entries `data.js:5030–5384`.
- **D3. 🟡 5 pre-408 legendaries carry legacy reserved types** (`Stellar`/`Primal`): #319 Voidraxis (Dark/Stellar), #384 Solarcrown (Fire/Stellar), #394 Solarvast (Draconic/Stellar), #400 Primordiax (Fire/Primal), #401 Cosmoveil (Stellar/Mental). Per `CLAUDE.md`: **surface for user decision, do not auto-strip** (legendary + lore-demand test). These are *not* a STAB deficit — each has abundant STAB on both types.
- **D4. 🟢 Schema/stats/lore PASS.** All 39 entries have the full canonical field set, `rarity:"legendary"`, `foreignRegion:true`; BST cleanly 13×720 / 13×750 / 13×800; no empty/placeholder/duplicate desc or lore; `variant-content.js` ANCHORS cover all 39. Cosmetic: emoji collisions 🌩️ (468 & 494), ⚡ (469 & 493).
- **D5. 🟢 Uncatchable design holds.** 26 Forgotten (`team[1]/[2]`, `catchRate:0` + `uncatchable:true`) are unobtainable by design (= the 474/500 obtainability figure). Double-guarded: data flags + `buildGymMon` forces `catchRate:0` and `isWild:false` ⇒ `playerUseBall` rejects (`game.js:1595`). **Latent:** `attemptCapture` uses `wildMon.catchRate || 45` (`battle.js:1441`) — a `catchRate:0` mon entering a *wild* path would become catchable; unreachable today, but change to `?? 45`.

---

## E. Move / data integrity (authoritative VM-load numbers)

- **E1. ✅ 0 orphans, schema clean, type chart complete.** Every learnset move resolves; no missing required fields; all `hits` arrays well-formed (`[min,max]`, min≤max, 26 multi-hit moves); type chart 26×26 fully square incl. all 5 rare types as attacker+defender; all 8 JS files parse; **0 cross-file top-level `const` collisions** (important — all load into one global scope).
- **E2. 🟡 128 defined-but-unused ("dead") moves** — never assigned to any learnset. Dominated by the **entire Chrono pool (33/33)** and **20 of 36 Stellar**; smaller clusters Spectral 7, Mineral 5, Fairy/Metal 4. These are mostly post-game "apocalypse/judgement"-tier signatures. **This is the real Forgotten-moveset story:** when the typing review assigns Chrono/Stellar to Forgotten, there is a ready-made pool to wire in. Not a bug, but should be triaged (assign or prune) — and is the natural home for the deferred post-game move-identity / `bonusVsStatus`-extension work logged in TODO.
- **E3. 🟢 Systemic move churn risk.** `buildMoveArr` does `MOVES_DATA[mid].pp` with **no undefined guard** (`battle.js:808`); a future move-key rename/removal would crash battle-build for any save holding the old key. The rebalance PR series is doing heavy `MOVES_DATA` edits — add a guard before any key removal.

---

## F. Save / migration — LOW risk

- **F1. ✅ Migration-safe.** No save version number, but `loadGame` defaults every field (`game.js:106–141`); old saves get defaults for new fields. **Moves are stored as string keys** and resolved live (catch stores `moves.map(m=>m.id)` `:1665`); stats are not persisted. PR #74 changed **definitions only** (key count 1126→1133 across the series, **0 removed/renamed**), so saved teams auto-pick-up new power/effects/multi-hit with no migration.
- **F2. 🟡 No save round-trip test.** Recommend a fixture that serializes → deserializes a team holding a rebalanced/multi-hit move and enters battle (guards against future schema moves, e.g. the planned `effect`→`effects:[]` refactor noted at `battle.js:1214`).

---

## G. Automation / tooling gaps (no CI exists today)

No `package.json` test, no `.github` CI, no JS test suite. The `scripts/*.py` validators scrape `data.js` with **brittle regexes** (sensitive to field reordering). Recommended lightweight gates (all <1s, deterministic):

- **G1. 🔴 Orphan-move-key guard** — VM-walk learnset strings vs `MOVES_DATA` membership; fail on any orphan. (0 today; nothing prevents a future typo silently fizzling a move.)
- **G2. 🔴 Effect-token handler-coverage check** — decompose every `move.effect` (split `_and_`, strip `_self/_target`) and assert each base token resolves to `STAGE_FX`/`MULTI_STAGE_FX`/`STATUS_REGISTRY`/switch. **This is what surfaced `speup2` (B5).**
- **G3. 🔴 Syntax + global-collision gate** — `new Function(readFileSync(f))` per JS file + cross-file top-level-`const` scan (a dup `const` throws at page load and bricks the whole game).
- **G4. 🟡 `hits` / `bonusVsStatus` schema lint** — `hits` int≥2 or `[min,max]` with min≥1; `bonusVsStatus` ∈ {known status, array of them, `"any"`}.
- **G5. 🟡 Dead-move drift report** — warn on net-new dead moves per commit (stops the 128 pool growing silently / flags accidental orphaning of a live move).
- **G6. 🟢 Port validators to a shared VM-load `load_data.js`** instead of regex scraping; wire `stab_completeness.py` + `move_utilization.py` as non-blocking CI reports.

---

## H. Master prioritized checklist

### 🔴 NEED (do before shipping more / before the Forgotten audit relies on this)
1. **Live-PvP multi-hit regression** (C1) — `basalt_volley`/`bone_barrage` deal ⅕–⅓ damage in live; port `move.hits` loop to `liveRealDamage`.
2. **Forgotten legendary soft-lock** (D1) — permanent species loss on KO/flee/faint; gate the consume on outcome.
3. **Catch popup spam** (A3) — silent guard for passive leaderboard submits.
4. **Type-color regression** (A2) — grey squares for ~18/26 types.
5. **Mobile back/✕ tap targets** (A1) — add to 44px rule.
6. **`bonusVsStatus` dead in live PvP** (C2) — decide persist-statuses vs flag.
7. **0× immunity vs `Math.max(1,dmg)` contradiction** (B1).
8. **CI guards** (G1–G3) — orphan / effect-coverage / syntax+collision.

### 🟡 SHOULD
- Multi-hit `Hit N times!` over-count (B2), last-hit-only crit message (B3), effect-on-fainted (B4), add `speup2` to STAGE_FX (B5).
- Live 2v2/FFA same fork (C3), version-skew behavior (C4).
- Resolve 29 Forgotten missing post-game types + 44 LORE flags (D2); surface 5 pre-408 legacy reserved-type legendaries (D3).
- Triage 128 dead moves / whole Chrono pool (E2); `buildMoveArr` undefined guard (E3); save round-trip test (F2); schema lint + dead-move drift (G4–G5).
- PvP solo-mode discoverability decision (A4).

### 🟢 NICE
- `hits` min<1 author guard (B6); document `coil_strike`/`"any"` semantics (B7–B8).
- catchRate `?? 45` fix (D5); emoji collisions (D4); validator hardening + CI reports (G6).

---

### Appendix — analysis provenance & corrected claims
- 5 parallel agents + direct VM verification (`/tmp/integrity.js`).
- **Corrected:** "Forgotten signature moves are orphans" and "#465 Nyxviper has no Spectral STAB" were **false** — 0 orphans confirmed; `nyx_fang` is Dark & defined, `time_fracture` is Draconic & used. The genuine moveset finding is the 128 *unused* (defined) moves in §E2.
