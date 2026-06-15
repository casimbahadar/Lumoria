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

## Phase 2 — method wiring + variety re-audit (DONE, green)
Wired lore-supported alternative methods onto 25 plain-level-up lines (method on the
pre-evo line; existing `evolveLevel` kept as a floor). Cleaned up the dangling/inconsistent
evo data. Approved full-set, applied via exact single-match line replacements.

- **time:night (6):** #143 Astrelle, #59 Lunaveris, #118 Eclipsehound, #98 Aridix,
  #312 Dunecrawl, #266 Shadowcub.
- **time:day (3):** #142 Dawnirel, #75 Sylvolt, #66 Viridix (Dawnirel→Astrelle now reads
  dawn→night across one family).
- **location (7):** #14 Molteroth, #20 Ignirhino → `volcano_core`; #168 Gemseer,
  #195 Icequartz → `crystal_depths`; #124 Phantorvex → `haunted_grove`;
  #50 Tundram → `frostpeak`; #29 Coralisk → `coral_reef`.
- **held metalCoat (6):** #134 Aeronyx, #147 Scrapsapien, #280 Gearbit, #153 Dentshaft,
  #106 Geoclad, #424 Geodon.
- **friendship (3):** #286 Downyfawn, #182 Rotunden, #206 Forlix.
- **Cleanup:** stripped dangling `evolveMethod`/`evolveLocation` from #241/#253/#277/#290
  → clean single-stage finals; set #337 Ashgolem `evolveLevel:null`.

### Re-audit tally (219 evolvers) — 2 → 7 functioning methods
| Method | Count | % |
|--------|-------|---|
| level | 185 | 84.5% |
| item (stone) | 9 | 4.1% |
| location | 7 | 3.2% |
| time:night | 6 | 2.7% |
| held | 6 | 2.7% |
| time:day | 3 | 1.4% |
| friendship | 3 | 1.4% |

Verification: `validate.js` green (G6 no longer reports dangling lines); resolver re-tested
11/11 against the edited data (each converted mon evolves only under its real condition).

### Deferred from Phase 2
- **`move` method:** unused so far — needs a learnset cross-check (Lane C data). Small
  follow-up pass if we want an 8th method.
- **Location area-level reachability:** the 7 location lines get their final reachability
  confirmation during Phase D (each area reachable around its floor level).

## Phase 2b — extra engine methods (DONE, green)
Added `teammate` (evolveWith species in party) and `battles` (evolveBattles wins) resolver
cases; `move` was already supported; `dawn`/`dusk` are free exact-segment matches.
- battle.js: cases for teammate/battles. game.js: `battlesWon` slot counter (+1 per won
  battle), post-victory participant evolution re-check, `describeEvolution()` helper rendering
  every method in the dex panel. validate.js G6 covers teammate/battles.
- `teammate` is implemented but currently unused in data (no strong cross-species lore pairing).

## Phase 2c — deepen diversification to ≤65% level (DONE, green)
43 more conversions to bring plain level-up to the user's 60–65% ceiling. Object-based
evolutions use the **use-on-Lumori stone** mechanic; two new lore items created and
**scattered** across thematic shops (not all in one place).

- **New items:** `auspiciousPlate` (Auspicious Plate 🛡️ → #148 Stoicguard, sold at Ironforge
  Metallurgy) and `tidePearl` (Tide Pearl 🦪 → #34 Pearlmaid, sold at Tidewatch Market).
  Also wired the previously-unused `dragonScale`/`steelCoating` stones (already in Seedvale).
- **item/use-stone (9):** dragons #232/#233/#173 (Wyrm Scale); steel #145/#135/#37/#95
  (Metal Coating); #148 (Auspicious Plate); #34 (Tide Pearl).
- **held (6):** #19/#405/#460 (Metal Coat), #55/#61 (Eternal Ice), #275 (Crag Shard).
- **battles (11):** #262 #263 #281 #426 #427 #436 #450 #458 #43 #70 #85.
- **location (6):** #132→volcano_core, #157→fungal_cavern, #45→mirror_lake,
  #47/#236/#304→frostpeak.
- **time (6):** dusk #108/#121/#438, dawn #202, night #78/#79.
- **friendship (1):** #293. **move (4):** #16 #88 #82 #26 (signature moves).
- Removed the 3 weak teammate pairings from the draft proposal; corrected a double-count
  (Cuddrix/Sorrowlix are evolved stages of already-friendship families).

### Final tally (219 evolvers, 8 distinct methods)
| Method | Count | % |
|--------|------|---|
| level | 142 | **64.8%** |
| item (≈11 stones) | 18 | 8.2% |
| location | 13 | 5.9% |
| held | 12 | 5.5% |
| battles | 11 | 5.0% |
| time (night 8·day 3·dusk 3·dawn 1) | 15 | 6.8% |
| friendship | 4 | 1.8% |
| move | 4 | 1.8% |

Verification: validate.js green; resolver re-tested 12/12 vs edited data; headless boot clean,
dex renders each method's requirement.

## Next phase (TODO)
- **Phase D — encounter audit (DATA):** every area/route/zone for obtainability, level curve,
  rarity coherence, NG+/Forgotten gating. 93 areas (90 wild, 59 NG+ overlays), 352 distinct
  wild-obtainable ids at baseline. Also confirm the location-evo areas (volcano_core,
  fungal_cavern, mirror_lake, frostpeak, crystal_depths, coral_reef, haunted_grove) are
  reachable near each line's evolve-floor level, and that the new evo items are obtainable
  in time.

### Per-id-band completion tracker (data phases — update id-ascending)
- [ ] 1–50
- [ ] 51–100
- [ ] 101–200
- [ ] 201–321 (base dex)
- [ ] 322–461 (NG+)
- [ ] 462–500 (Forgotten — light re-verify)

---

# 24-Gym Region Expansion (new directive, in progress)

Scope expansion approved by user: grow from 16 → **24 gyms** (interleaved 1–24), add
specialists for the 8 missing qualifying types, new cities/routes/trainers/quests, expand
the map, and rescale the whole curve to end **under 150** (gentle, ~130 ceiling).

**Type rule applied:** new gyms for Fighting, Mineral, Sonic, Toxin, Vapor, Spectral, Dream,
Crystal (>6 obtainable). Excluded: Stellar 6, Primal 6 (≤6); Aether 3, Chrono 4 (Forgotten).

**Interleaved order (badge = gym#−1) + gentle curve (gym max level):**
1 Normal/Rex 10 · 2 Aquatic/Marina 14 · 3 Fire/Pyros 18 · **4 Fighting/Kano 22** ·
5 Electric/Zara 26 · 6 Ice/Glacier 30 · **7 Mineral/Marl 34** · 8 Dark/Nyx 38 ·
**9 Sonic/Echo 42** · 10 Mental/Oracle 46 · 11 Draconic/Drake 50 · 12 Nature/Thorne 54 ·
**13 Toxin/Acrid 58** · 14 Poison/Viper 62 · 15 Earth/Atlas 66 · 16 Nature-Bug/Mantis 70 ·
**17 Vapor/Steam 74** · 18 Wind/Zephyra 78 · 19 Metal/Ferro 82 · **20 Spectral/Mortis 86** ·
21 Earth-Geode/Boulder 90 · **22 Dream/Somna 94** · 23 Fairy/Seraphina 98 · **24 Crystal/Prisma 102**.
Vanguard 106/108/110/112 · Champion 116 · post-game/legendaries ~118–130.

**Team re-theming (user):** Thorne = grassy/non-bug Nature · Mantis = bug-themed Nature ·
Atlas = ground Earth · Boulder = rock/geode Earth (stays 24 gyms).

## Build phases
- [x] **Phase A — 8 new gym leaders** (GYM_LEADERS): Kano/Marl/Echo/Acrid/Steam/Mortis/Somna/
      Prisma with type-themed single/double/triple teams at curve levels. validate green; boots clean.
- [ ] Phase B — 8 new cities + connecting routes + map expansion (mapPos re-space, biomes) + encounter tables.
- [ ] Phase C — re-gate all areas' requiredBadges to the new 1–24 order.
- [ ] Phase D — trainers + quests in new areas.
- [ ] Phase E — full level rescale (existing 16 gyms, Elite, Champion, all wild/trainer/legendary tables) + team re-theming (Thorne/Mantis/Atlas/Boulder).
- [ ] Phase F — game.js integration (badge count 16→24, Elite/Champion gates, title text, GYM_HELD_REWARDS, badge story hooks).
