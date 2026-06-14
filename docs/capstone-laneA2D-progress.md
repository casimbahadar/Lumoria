# Lane A.2 + D — progress log (Evolution + Encounters)

Branch: `claude/capstone-laneA2D-evo-encounters` · draft PR #99 to `main`.
Scope: the `evolveTo/evolveLevel/evolveItem/evolveMethod/evolveLocation/catchRate/
expYield/rarity` line + `WORLD_DATA` encounter tables in `js/data.js`. Engine work
(`js/game.js`, `js/battle.js`, `js/online.js`, `scripts/validate.js`) was added by
explicit user direction so the alternative evolution methods actually function before
the variety audit is re-run.

## Baseline evolution-method tally (before any change)
500 entries · **219 evolving lines** · 281 finals/standalone.

| Method | Count | % of evolvers |
|--------|-------|---------------|
| Plain level-up | 210 | 95.9% |
| Item (stone/coat) | 9 | 4.1% |
| Location / friendship / time / move | 0 functioning | 0% |

By band: base = 166 level + 7 item · NG+ = 44 level + 2 item · Forgotten = 0 evolvers.

The 9 item evolutions: #218 Duskmist, #226 Spectroo, #251 Crumblite, #269 Grimshade,
#278 Ironpix, #302 Lightpuff, #308 Seafraith, #337 Ashgolem, #345 Sablecrow.

### Integrity findings
- **4 dangling location lines** — #241 Shardlix (cosmic_cavern), #253 Ashrock
  (forge_ruins), #277 Magmote (ironforge), #290 Guisecat (cobweb_gully): have
  `evolveMethod:"location"` + a real `evolveLocation`, but **`evolveTo:null`** and (pre-engine)
  no location trigger. Surfaced by validate G6 as informational. Resolution deferred to
  the data phase (give targets or strip).
- **#337 Ashgolem** had `evolveLevel:undefined` (cosmetic) — to address in data phase.

## Phase 1 — Evolution engines (DONE, green)
Unified resolver so the data line is the single source of truth; five new methods added
to the two that already worked (level, stone-item).

- `js/battle.js`
  - `resolveEvolution(slot, trigger)` — switches on `evolveMethod`
    (`level` default, `item`, `location`, `held`, `friendship`, `time`, `move`).
    `trigger` ∈ {`"level"`, `"area"`, `"item:<id>"`}.
  - `evoTimeSegment()` — day/night via online.js `getTimeSegment()` (fallback inline).
  - `FRIENDSHIP_EVO_THRESHOLD = 160`; `checkEvolution` → wrapper over `resolveEvolution(_, "level")`.
  - `evolveMonster(slot, explicitTarget?)` — accepts an explicit target for area/item paths.
  - `giveXP`: **+8 friendship per level gained** (cap 255).
- `js/game.js`
  - `friendship:70` on `createPartySlot` and `createCaughtSlot`.
  - `checkAreaEvolutions()` — post-travel sweep for location evolutions (chains via overlay cb);
    wired into `travelTo`.
  - `useEvoItem` guards out `evolveMethod==="held"` (held mons evolve by holding through a
    level-up, not by using the item).
  - `useItemOnMon` heal branch: **+3 friendship** (care builds bond).
- `js/online.js`
  - `getTimeSegment()` — canonical Night 21–05 / Dawn 05–10 / Day 10–17 / Dusk 17–21.
- `scripts/validate.js`
  - **G6 evolution-integrity** gate: every `evolveTo` resolves; each method carries its
    required field (`location`→`evolveLocation`∈WORLD_DATA, `item`/`held`→`evolveItem`∈ITEMS_DATA,
    `time`→`evolveTime`∈{day,night,dawn,dusk}, `move`→`evolveMove`∈MOVES_DATA, `level`→`evolveLevel`).
    Dangling lines reported informationally (non-blocking). VM epilogue now exposes
    `WORLD_DATA` + `ITEMS_DATA`.

### Data schema (evo line — added fields)
- `evolveMethod`: `"level"|"item"|"location"|"held"|"friendship"|"time"|"move"`.
- `evolveTime`: `"day"|"night"|"dawn"|"dusk"` (method `time`).
- `evolveMove`: move key (method `move`).
- optional `evolveFriendship`: per-species threshold override (default 160).
- existing reused: `evolveTo`, `evolveLevel`, `evolveItem`, `evolveLocation`.

### Verification
- `node scripts/validate.js` → green (G6 added; 4 dangling lines reported as info).
- Resolver smoke test → 14/14 across all methods (positive + negative cases).
- Headless boot → all globals present, starter `friendship:70`, `getTimeSegment()` works,
  no real console errors, title renders.

## Next phases (TODO)
- **Phase 2 — method wiring + variety re-audit (DATA):** convert a lore-supported subset of
  plain level-up lines to location/held/friendship/time/move; resolve the 4 dangling lines;
  fix #337 `evolveLevel`. Re-run the tally for a healthy spread. Propose → approve → apply.
- **Phase D — encounter audit (DATA):** every area/route/zone for obtainability, level curve,
  rarity coherence, NG+/Forgotten gating. 93 areas (90 wild, 59 NG+ overlays), 352 distinct
  wild-obtainable ids at baseline.

### Per-id-band completion tracker (data phases — update id-ascending)
- [ ] 1–50
- [ ] 51–100
- [ ] 101–200
- [ ] 201–321 (base dex)
- [ ] 322–461 (NG+)
- [ ] 462–500 (Forgotten — light re-verify)
