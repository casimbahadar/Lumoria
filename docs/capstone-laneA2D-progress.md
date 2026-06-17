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

> **⚠️ SUPERSEDED (2026-06-15):** the single interleaved-24 curve below is replaced by the
> **two-version progression spec** at the bottom of this file
> ("## AUTHORITATIVE two-version progression"). The new model splits into a 20-gym Non-NG+
> world and a 24-gym NG+ world (Sonic/Spectral/Dream/Crystal gyms are NG+-exclusive), per the
> legendary/NG+ team rule. Keep this section for historical context only.

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

## Team-building rule (user, applies to all gym/trainer/rescale phases)
**Legendaries may only appear on an NPC team if the player can already access that
legendary at that point in progression** (and only to fill toward a 6-mon minimum).
Practically: no legendaries on gyms 1–24 (all pre-Champion). Extends in spirit to
NG+-exclusive (ids 322–461) and Forgotten (≥462) mons — not obtainable on a first run.

### Phase A legendary audit + fixes
- Fixed: Echo (Sonic) ace #314 Skybreaker → #292 Galehorn; Mortis (Spectral) ace
  #379 Riftmane → #268 Darkfang. No legendaries remain on those gyms.
- **BLOCKER — Crystal gym (Prisma):** Crystal has **0 non-legendary** Lumori (all 7
  Crystal mons are legendary/NG+). A no-legendary Crystal gym is impossible as-is —
  needs a user decision (sanctioned exception / drop gym / make a Crystal mon accessible).
- **Open question:** does the rule also bar NG+-only mons (322–461) on gyms? Several
  late gyms (Echo/Acrid/Steam/Mortis/Somna) currently use a few; the base-dex roster for
  niche types thins out at high levels. Resolve before Phase E rescale.

---

# AUTHORITATIVE two-version progression (2026-06-15, user-confirmed)

Supersedes the inline-24 curve above. Two world-map versions, gated on NG+ state
(`requiresNGPlus` mechanism, as already used by prismatic_rift/apex_summit):

- **Non-NG+ run:** 20 gyms. The Sonic/Spectral/Dream/Crystal gym cities + their routes are
  hidden.
- **NG+ run:** 24 gyms — the 4 niche-type gyms (Echo/Mortis/Somna/Prisma) + connecting
  areas appear as gyms 21–24, post-Champion.

**Team rule (unchanged):** no legendaries/NG+/Forgotten mons on any team the player can't yet
access. Crystal gym (Prisma) is the sanctioned legendary exception (Crystal has 0 non-legendary
mons) — NG+-only, so allowed there.

## Non-NG+ version (20 gyms, ceiling ~122)
Gyms keep the confirmed anchors (Kano 22 · Marl 34 · Acrid 58 · Steam 74). Three +8 gaps
(Nyx 38→Oracle 46, Ferro 82→Boulder 90, Boulder 90→Seraphina 98) are **intentionally kept** —
each has well-above-typical content between the gyms (Oracle region = town + Umbra base + 7
areas; forge complex = 4 routes; Seraphina region = void_rift + 5 areas).

| b | gym (type) | L | b | gym (type) | L |
|---|---|---|---|---|---|
| 1 | Rex (Normal) | 10 | 11 | Thorne (Nature) | 54 |
| 2 | Marina (Aquatic) | 14 | 12 | Acrid (Toxin) | 58 |
| 3 | Pyros (Fire) | 18 | 13 | Viper (Poison) | 62 |
| 4 | Kano (Fighting) | 22 | 14 | Atlas (Earth) | 66 |
| 5 | Zara (Electric) | 26 | 15 | Mantis (Nature-bug) | 70 |
| 6 | Glacier (Ice) | 30 | 16 | Steam (Vapor) | 74 |
| 7 | Marl (Mineral) | 34 | 17 | Zephyra (Wind) | 78 |
| 8 | Nyx (Dark) | 38 | 18 | Ferro (Metal) | 82 |
| 9 | Oracle (Mental) | 46 | 19 | Boulder (Earth-geode) | 90 |
| 10 | Drake (Draconic) | 50 | 20 | Seraphina (Fairy) | 98 |

Endgame: Vanguard (Elite Four) **100–105** → Champion **108** → Forgotten Lumori
(13 Vaeldris wielders) **110–122**.
Rival: 13 · 28 · 50 · 70 · 96.
Umbra Order: Vex 16 · Morta 28 · Kira 40 · Vorn 52 · **Director Shade 64** → post-game
remnants 110–118.

## NG+ version (24 gyms, ceiling 150)
Gym ace level = **12 + 5×(badge−1)** → 127 at gym 24.

| b | gym | L | b | gym | L | b | gym | L |
|---|---|---|---|---|---|---|---|---|
| 1 | Rex | 12 | 9 | Oracle | 52 | 17 | Zephyra | 92 |
| 2 | Marina | 17 | 10 | Drake | 57 | 18 | Ferro | 97 |
| 3 | Pyros | 22 | 11 | Thorne | 62 | 19 | Boulder | 102 |
| 4 | Kano | 27 | 12 | Acrid | 67 | 20 | Seraphina | 107 |
| 5 | Zara | 32 | 13 | Viper | 72 | 21 | ★Echo (Sonic) | 112 |
| 6 | Glacier | 37 | 14 | Atlas | 77 | 22 | ★Mortis (Spectral) | 117 |
| 7 | Marl | 42 | 15 | Mantis | 82 | 23 | ★Somna (Dream) | 122 |
| 8 | Nyx | 47 | 16 | Steam | 87 | 24 | ★Prisma (Crystal) | 127 |

★ = NG+-exclusive gym (hidden non-NG+; appears post-Champion).
Endgame ladder: Vanguard **128–132** → Champion **134** → Forgotten Lumori **135–140** →
apex **145** → **Vanguard rematch 146–148** → **Champion rematch (all L150)**.
Rival: 17 · 52 · 82 · 112 · 127.
Umbra Order: Vex 22 · Morta 47 · Kira 72 · Vorn 97 · **Director Shade 122** → post-game
Void Council / Shade Final Form **140–150**.

## Implementation phases (this spec)
- [x] **B1 — base gym teams base-dex-only:** Acrid/Steam swapped NG+ mons for base-dex
      Toxin/Vapor at confirmed L58/L74. Kano/Marl already clean. (commit 29b7348)
- [x] B2 — base-map: remapped requiredBadges to the 20-gym order (champion→rb20); added 4 new
      gym cities (Dauntridge/Lodehollow/Corroden/Mistmoor) + 3 connector routes. (commit dd0fe1c)
- [x] C — NG+ region: C1 re-leveled Echo/Mortis/Somna/Prisma to 112/117/122/127 (commit
      4750330); C2 added NG+-exclusive cities (Clarion/Gravecourt/Reverie Vale/Gleamcrest, rb20-23,
      requiresNGPlus) + 5 routes, chained Starbloom→…→The Gauntlet.
- [~] D — **mostly done.** ✅ map-graph fix (commit cdb5999); ✅ non-NG+ rescale: gyms 10-98,
      Vanguard 100-105, Champion 108 + LEVEL_CAPS (5586428); ✅ NG+ level model: NG_OFFSETS,
      explicit NG+ levels (gyms 12+5/badge, Vanguard 128-132, Champion 134), L150 ceiling,
      cap-aware ngPlusScale + scale-down caps extended to NG+ (24d6803, verified live).
      ⏳ **D3 remaining:** post-apex Vanguard rematch (146-148) + Champion rematch (L150) — upgraded
      rosters (NG+/legendary allowed, NO Forgotten), fought at the summit, gated on an "apex
      cleared" milestone (see open question).
- [ ] E — Rival + Umbra Order re-level per curve (both versions); Forgotten/Vaeldris wielder
      re-level (110–122 non-NG+ / 135–148 NG+).
- [ ] F — full base-gym + wild/trainer/legendary level rescale to the curves; team re-theming
      (Thorne/Mantis/Atlas/Boulder).
- [ ] G — game.js integration (badge count, gates, title text, GYM_HELD_REWARDS).
- [ ] **H — NG+-exclusive moves (new, user-requested):** with the cap raised to L150, add a
      variety of new NG+-only moves for each type for Lumori to learn (post-game movepool depth).
      NG+-gated learnset entries; one fitting new move (or a few) per type. Define moves in
      MOVES_DATA, gate availability to NG+, wire into learnsets.
