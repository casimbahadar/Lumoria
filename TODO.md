# TODO - Lumoria Bugs & Feature Requests

## 📊 STATUS OVERVIEW — reconciled against `main` (PvP PR #60 now merged; #52 launch still draft)

_At-a-glance status of every section below. Legend: ✅ done · 🚧 in progress · ⏳ not started · 📎 reference/parking. Section headers carry the same tag inline._

> **Status = the TODO task, not the PR.** The only **open (unmerged) PR** is **#52 (launch plan)** — a draft. **#60 (Online PvP) is now merged** (code-complete, but ⏳ **unverified** — needs a real-Firebase playtest, see #13's verification checklist). Every other PR (incl. #63) is **already merged**; a 🚧/⏳ next to a merged-PR row means the *task* is partly/not done, not that the PR is open.

| Area | Status | Evidence |
|---|---|---|
| Bugs #1–4, Features #5–10 | ✅ done | early PRs |
| #11 Variant + shiny system | ✅ done | PR #59 |
| #12 Variant content (lore/desc/behaviour/learnset) | ✅ done | PR #61 |
| #13 Online PvP | ✅ code · ⏳ verify | PR #60 **merged**; all modes built, needs Firebase playtest (checklist in #13) |
| Phase-1 coherence (archetype brainstorm, borderline triage, bridge lore) | ✅ done | PRs #38–46, #47, #48 |
| 🔧 BREAKING + 🪛 MINOR family fixes | ✅ done | PRs #36/#47/#55 |
| 🔍 Solo desc/lore/emoji audit | ✅ done | PR #49 |
| 🦄 Creature inventory + exemptions | ✅ done | PRs #38–46 |
| 🔀 Typing-system overhaul (26-type chart + moves) | ✅ done | PR #51 |
| 🧪 Type-combination (over-cap) audit | ✅ done | PRs #50, #55 |
| Multi-status battle system | ✅ done | PR #54 |
| Dex expansion to 500 (+54 NG+ families, Forgotten renumber, placement) | ✅ done | PR #57 |
| 🎲 Encounter-rate audit | ✅ done | PR #58 |
| 🎯 Obtainability audit (474/500) | ✅ done | PR #62 |
| 🎮 NG+/Forgotten gating + legendary encounters | ✅ done | PR #53 |
| 🎯 Archetype × type-combo diversity **audit** | ✅ analysis shipped · ⏳ full audit pending | PR #63 **merged** (matrix doc only); full pass folded into 🕯 UNIFIED |
| 🕯 UNIFIED per-Lumori audit | ⏳ not started | next major phase |
| 📉 Standalone count reduction | ⏳ not started | — |
| 🏷️ Luminex renaming + final lore | ⏳ partial/paused | PRs #34–35; resumes after UNIFIED |
| 🔮 Mythical archetype flags | ⏳ not started | end-of-task |
| 🎯 Moveset utilization audit | ✅ done | PR #68 — Phase 1 orphan-clearing + key rename + Phase 2 STAB-completeness |
| 🌑 Forgotten Lumori dedicated audit | ⏳ not started | before stat-spread review |
| 📊 Final stat-spread review | ⏳ not started | RUN LAST |
| 🧬 Abilities feature | ⏳ not started | after stat review |
| 🤝 Inter-Lumori interactions (dedicated pass) | ⏳ not started | after abilities (bridge sweep done, PR #48) |
| 13 wielder cutscenes (Forgotten legendaries) | ⏳ not started | after stat review |
| 🚀 Pre-launch / release process | 🚧 in progress | launch draft PR #52 |

---


## Bugs

### ~~1. Wild Lumos persists when starting a quest~~ ✅ FIXED
- Fixed: startQuestBattle now properly initializes battle state

### ~~2. Shop not opening from town menu~~ ✅ FIXED
- Fixed: Added click event listener for area shop button

### ~~3. Route and town name overlapping on map~~ ✅ FIXED (mobile)
- Fixed: Route labels hidden on tablet/phone screens to prevent overlap
- Desktop layout unaffected

### ~~4. Revive cost is wrong after losing~~ ✅ FIXED (previously)
- Was already fixed: 100% HP restore, 5% money cost on blackout

## Feature Requests

### ~~5. Healing at towns and cities~~ ✅ DONE
- Heal button appears at all towns and cities
- Fully restores team HP for free

### ~~6. Natures system~~ ✅ DONE
- 25 Lumoria-themed natures (20 stat-affecting + 5 neutral)
- Each nature boosts one stat +10% and lowers another -10%
- Displayed on team detail screen with color-coded stat bars
- Nature assigned randomly on catch/create, migrated for old saves

### ~~7. Individual Values (IVs)~~ ✅ DONE
- 0-31 IV per stat affects stat calculation
- Shown on battle screen for wild encounters (to evaluate catches)
- Shown on team detail screen
- Gym/boss mons get perfect 31 IVs
- Migrated for old saves

### ~~8. Double and triple battle functionality~~ ✅ DONE
- Double battle mode (2v2): Ferro, Boulder, Seraphina gyms
- Triple battle mode (3v3): Champion Lumian
- Per-mon move selection with target picking
- Speed-ordered turn resolution, auto-replacement of fainted mons

### ~~9. AI-generated sprites~~ ✅ DONE
- Procedural SVG trainer sprite generator (chibi style)
- 5 hair styles, 6 skin tones, 7 eye colors, type-themed outfits
- Trainer sprites shown in gym leader panel and battle intro
- 2 new monster archetypes: Insectoid and Amorphous (7 total body types)

### ~~10. Music and battle themes~~ ✅ DONE
- Procedural chiptune music engine using Web Audio API
- 7 tracks: overworld, wild battle, gym battle, champion battle,
  rival battle, umbra battle, elite battle
- Music auto-switches between overworld and battle contexts
- Toggle mute via nav bar music button
- No external audio files needed (all synthesized in-browser)

### 11. Procedural variant system + shiny showcase ✅ DONE (PR #59, merged)
**Full design: `docs/variant-system-spec.md`.** Variants are now a *procedural per-instance* system, not hand-authored forms:
- **Variant roll:** 1/200 per-mon in **every** battle type (either side). Each variant rolls and persists `variantTypes`, `variantBase`, `variantImmune`.
- **`variantTypes`:** 85% random 2-distinct / 10% mono / 5% original combo; pool = 24 types (never Aether/Chrono); Crystal/Primal/Stellar each 1/500. (Rewrite the stale legacy-type `getVariantTypes`.)
- **`variantBase`:** permute the 6 base values, then 3 independent gates (Large 20% / Medium 20% / Small 40%; fail-all ≈ 38.4% = no drift); Large → 1 stat ≤15%, Medium → 0/1/2 at 30/50/20 ≤10%, Small → each leftover stat 40% ≤5%; `±ceil(stat×rand1..cap%)`, 50/50 up/down, uniform stat picks. BST drifts.
- **`variantImmune`:** 1 random of the 24 types, 0× damage; shown in team detail post-catch.
- **Shiny:** 1/2048 (×4 NG+, × time/event); now rolls in **all** battle types; +10% stats. All 500 shiny-capable. **Variant + shiny stack** for the 474 catchable.
- **Tracker:** Luminex 🔀 tab logging every **encountered** variant (caught / seen / uncatchable enemy) per species — stat distributions, typings, immunities. Plus ✨ shiny showcase (seen/caught).
- **Save:** add `shinySeen/shinyCaught/variantSeen/variantCaught` sets + migration.
- **Online:** variants **and** shinies both usable (trades; future PvP).

### 12. Variant content / deeper randomization layer ✅ DONE (PR #61, merged — procedural lore/desc/behaviour + learnset, 500 anchors, dormant Route-1 LLM)
- The variant *mechanic* (stats/typing/immunity randomization) is handled in #11. #12 is the **content** layer on top: per-Lumori variant **lore, descriptions, movesets** and any deeper randomization.
- **Batch** the authoring like the NG+ families; validate move keys/types per batch.

### 13. Online PvP battle system ✅ CODE-COMPLETE (PR #60 merged to `main`) · ⏳ UNVERIFIED (needs Firebase playtest)
**Full design: `docs/pvp-spec.md`.** Two player-chosen modes on the existing Firebase RTDB layer:
- **Async** — battle a snapshot of another player's team locally vs the AI (reuses the battle engine). **Real-time** — host-authoritative live turn-sync between two online players.
- **Lv 50 cap** for all PvP mons (IVs 31; variant fields preserved).
- **Matchmaking:** browsable board + one-tap random/rating queue + **passcode rooms** (private by default, flippable to public spectating — Showdown-style).
- Variants **and** shinies both allowed. Rating → `/leaderboards/pvp`.
- ⚠️ Untestable here (placeholder `FIREBASE_CONFIG`, no browser/2nd client) — write correct-by-inspection, playtest after real credentials.
- **Phase A ✅ (done, unverified):** Lv-50 normalization in `buildBattleMon` (force Lv 50 + perfect IVs + full HP when `battleContext.isPvP`); `startPvpBattle()` plays the opponent's snapshot for real vs the AI (single mode, snapshots/restores party HP so PvP neither damages nor heals); `endBattle` PvP branch → `recordPvpResult()`; `quickMatch()` (near-rating pick) + browsable board now launch real battles; full team serialization (`pvpSerializeMon`: moves/nature/held/shiny/variant); Quick Match button; fixed a latent crash (`GYM_LEADERS[undefined]`) for multi-mon opponents. Retired the old power-score `simulatePvPBattle`.
- **Rating ✅ (done, unverified):** Elo with **amplified upsets** (two-K: `PVP_K_UPSET=56` / `PVP_K_EXPECTED=24`, base 1000) → `pvp_rating` leaderboard; no XP/blackout/gym rewards. PvP screen shows a rating banner (`renderPvpRatingBanner`: "Your rating: ⭐ N · W–L"). Acceptor-only for now; challenger mailbox deferred.
- **Phase B ✅ (done, unverified):** **Gauntlet** + challenger rating **mailbox** (`/pvpMailbox/{uid}`) landed earlier. Async **Doubles (2v2 vs AI snapshot)** now complete via the existing `startMultiBattle("double")` engine — Units A–E:
  - **A** — `startPvpBattle(meta.doubles)` routes through the double engine vs the AI-piloted snapshot; plugged the doubles XP leak (`handleMultiFaintedMons` now PvP-guarded).
  - **B** — independent Doubles **ladder**: `PVP_MODES` field map, mode-aware `recordPvpResult(won,mode)` + `drainPvpMailbox` (notes carry `format`), new `pvp_doubles_rating` board.
  - **C** — format-tagged post/accept/quick-match, each routed to the right ladder.
  - **D** — Singles/Doubles toggle on the PvP screen, dual-ladder rating banner, format tags on challenge cards.
  - **E** — **up-to-6 saved teams per format** (active PvP loadouts, posted **and** battled with via a `G.team` temp-swap; party untouched) + builder UI screen. Also **fixed a real bug**: `pvpSerializeMon` mapped `mv.id` on string-array slot moves → posted teams had `[undefined]` moves (why Phase A was unverified-broken). Now handles both move shapes.
- **Phase C ✅ (done, unverified):** async **FFA Royale** — isolated N-side engine (`startFfaBattle`/`#screen-ffa`), 3-4 sides, full teams (1 active + bench), true royale (everyone targets anyone, last standing). Pulls 2-3 open posted teams as AI sides; self-contained 👑 `pvp_ffa_rating` ladder. Reuses `calcDamage`/`applyMoveEffect`; never touches the proven 2-side engine.
- **Phase D ✅ (done, unverified):** real-time. **D1** — type-aware live damage, passcode + public rooms, public spectating, per-client zero-sum rating (replaced coins-only/host-only). **D2** — **live 2v2 + live FFA** via a unified host-authoritative N-seat engine (`createMultiLiveRoom`/`resolveMultiLiveTurn`): one human per seat, alliances per mode, missing-move AI fill + resolve guard; 2v2→doubles ladder, FFA→ffa ladder.
- **Post-D polish ✅ (done, unverified):** 60s **turn timer** (auto-pick on expiry) across every PvP/online mode + host-side disconnect safety net; **live mechanical parity** (live now runs the real `calcDamage`); **FFA polish** (battle music, hit/faint animations) + **FFA depth** (residual `tickStatus`, switch menu). **Bag items disabled in all PvP/online modes.** ⚠️ Live 2v2/FFA still need multiple simultaneous real clients to verify; see `docs/pvp-spec.md` "Known limitations".
- See `docs/pvp-spec.md` for the rating formula + full modes roadmap.

#### 🔥 Firebase verification checklist — DO THIS to confirm PvP works (everything above is correct-by-inspection only; never run against a live DB / 2nd client)
> Why: this session had a **placeholder `FIREBASE_CONFIG`** and no browser, so nothing online was exercised. Run the steps below with real credentials before flipping #13 to ✅ verified. Tick boxes + date as you go.

**Setup (once):**
- [ ] Real `FIREBASE_CONFIG` wired (see `js/firebase-config*.js` / `initOnline` in `js/online.js`); Realtime Database enabled.
- [ ] RTDB **security rules** allow the signed-in user to read/write the PvP paths below (challenges readable by all, mailbox writable cross-user, live rooms read/write for participants).
- [ ] **2 accounts** in separate browsers/incognito (devices ideal). Live **2v2 needs 4**, live **FFA needs 2–4**; async **FFA quick-match needs ≥2 other posted teams** on the board.
- [ ] `🌐 ONLINE` connects (`#hud-online-status`), PvP screen opens, rating banner renders (`renderPvpRatingBanner`).

**RTDB paths to watch in the console** (confirms writes land correctly):
- `battles/{id}` — async challenges (status open→completed; team JSON has **real move ids, not `[undefined]`**).
- `pvpMailbox/{uid}` — async result notes for the offline challenger.
- `pvp_live/{code}` — live rooms (1v1 fields + `seats[]`/`moves` for multi).
- `leaderboards/pvp_rating` · `pvp_doubles_rating` · `pvp_ffa_rating` · `pvp_gauntlet`.

**Async Singles 1v1:**
- [ ] Post Singles challenge (live party or saved loadout) → `battles/` open entry with correct serialized team; party HP unchanged afterward.
- [ ] Acct B Quick Match / accept → real battle vs AI snapshot at **Lv 50**; result → ratings move by the gap curve; `pvp_rating` board updates; challenge marked completed.
- [ ] Mailbox note deposited; on the challenger's next login `drainPvpMailbox` mirrors the result **zero-sum** (their Δ = −acceptor's), then clears the note.

**Async Doubles (2v2):**
- [ ] Toggle Doubles → post/accept → 2v2 vs snapshot; `pvp_doubles_rating` moves **independently** of singles; format tag shown on cards; saved Doubles loadout posts/battles with real party untouched.

**Gauntlet:**
- [ ] Back-to-back snapshot battles; survival streak → `pvp_gauntlet` (best only); rating **not** affected.

**Async FFA Royale (👑):**
- [ ] With ≥2 other posted teams → 3–4 sides; everyone can target anyone; last side standing wins; `pvp_ffa_rating` moves vs avg opponent; **switch** works; **no bag**; residual burn/poison ticks at end of turn.

**Live 1v1:**
- [ ] Create room (try **passcode** + **public** toggle) → public room appears in the list; Acct B joins (passcode enforced) → battle starts.
- [ ] Damage uses real `calcDamage` (log shows crit / super-effective / resisted); on a faint the bench sends out; on KO both players' `pvp_rating` update **zero-sum** once each.
- [ ] Acct C **spectates** a public in-progress room read-only (no controls).

**Live 2v2:**
- [ ] 4 clients join → alliances A/B (join order); each controls **1 active**; **can't target allies**; alliance is out when both its seats fall; battle ends at ≤1 alliance; `pvp_doubles_rating` updates per client.

**Live FFA:**
- [ ] 2–4 clients; host **Start** enabled once ≥2 in; everyone targets anyone; last seat standing; `pvp_ffa_rating` updates.

**Turn timer & disconnect (every mode):**
- [ ] Idle 60s → countdown shows, turns red ≤10 s, **auto-picks** a move (live auto-submits).
- [ ] Close a live client mid-turn → host **force-resolves ~65 s** later with AI-fill (no permanent stall).

**Bag-disable & integrity:**
- [ ] Bag is blocked in every PvP mode (greyed button / "🚫 disabled" notice); items **not** consumed; catch disabled.
- [ ] Forfeit/leave sets the room `abandoned`; result rating applied **exactly once** (no double-count on repeated `done` events).

**Known risk areas to scrutinize first** (most likely to bite): multi-seat `seats[]`/`moves` sync & alliance win-check; zero-sum rating mirroring (async mailbox + live per-client); RTDB rules blocking cross-user mailbox writes; the host disconnect timer firing on the right turn key.

**TODO #13 PvP: all phases A–D + timer/parity/polish implemented & merged (PR #60). Status = code-complete, ⏳ UNVERIFIED — run the Firebase checklist above to validate, then mark ✅.**

---

# 📋 ACTIVE WORK — Phase 1 Coherence Pass  `[✅ DONE — archetype brainstorm PRs #38–46, borderline triage, bridge sweep PR #48]`

## Reference docs

- [x] **`archetype-session-notes.md`** — cross-session framing decisions, multi-silhouette format spec, deferred/open items list, cluster completion log. **Read this at the start of any Phase 1 archetype session.**

- [x] **`archetype-subtypes.md`** — transcription + brainstorm pass through all 15 existing sections complete (Mammals → Cosmological/Energy). Dragon renames + dog-breed additions + Mythical Batches A & B applied. PR #38 (transcription) merged; PR #39 (brainstorm pass) merged. **Phase 1 new-top-level-category roadmap locked at 33 batches (32 firm + INSTRUMENTS confirmed-pending-entries)** (35 − RIVER − URBAN − BANNER all permanently dropped, +INSTRUMENTS confirmed). **45 categories committed** (post-consolidation + dedup + multi-pass deferral-review 2026-05-15). 5 consolidations applied (Combines A-D + 5A); 12 cross-cluster dedup cases applied (A1-A12); A11 Option A follow-up (prophet-being added); 6 N1-N51 dedup cases applied (N1, N15, N16, N20, N27, N28, N49); 7 likely-duplicate cases (N18, N21, N22, N23, N34, N33, N42); 3 structural-issue cases (N25, N37, N43); 2 drops + 3 cross-flags (N3, N48, N7, N39, M5); cross-cluster pending-review pass: 3 entries landed (cauldron, atlas, magic-wand → MYTHICAL CREATURES) + 6 entries dropped; deferral-candidate sweep pass 1+2: +1 landed (magma-being → THERMAL EXTREMES), ~81 candidates dropped from session-notes deferral blocks across multiple clusters (hydrothermal-vent, steel-being, molten-metal, ink-pot, mineshaft, 7 ARCHITECTURE, rowboat/canoe + sled/sleigh, 13 TOY pass-1 + model-train pass-2 = 14 TOY, ~20 GAME-PIECE, 10 JEWELRY pass-2, 18 CONTAINER pass-2, 16 TOOL pass-2, arcade-cabinet + roulette-wheel from APPLIANCE). deferral-sweep pass 3: +3 landed (rainbow-hologram, ghost-projection/phantom-image, sky-projection/cloud-projection → OPTICAL IMAGING Sci-fi/technological projections sub-group), ~80 more candidates dropped (17 APPLIANCE, 19 STATUE, 8 ROBOTIC, ~36 OPTICAL IMAGING camera+hologram-side). deferral-sweep pass 5 (2026-05-16): +1 landed (rainbow-pool / prismatic-spring → THERMAL EXTREMES Geothermal/hot sub-group), ~17 candidates dropped (16 WEATHER drops + kelp-forest cross-cluster drop). deferral-sweep pass 6 (2026-05-16): **+48 landings across 15 clusters** — "anything not previously dropped = land" final sweep per user resolution. Landings: MICROORGANISMS +1 (cell), ARCHITECTURE +3 (bridge, watchtower, geodesic-dome), VEHICLE +5 (sailboat/yacht, bicycle, hot-air-balloon, blimp/dirigible, hovercraft/hovercar), TOY +1 (toy-robot; action-figure variants absorbed into existing descriptor), GAME-PIECE +1 (game-controller), JEWELRY +15 (talisman, locket, signet-ring, gem-encrusted-ring, hoop-earring, bracelet, bangle, charm-bracelet, anklet, armlet, diadem, brooch, coin-generic, gold-coin, pearl-necklace), CONTAINER +3 (vase, wine-bottle, jewelry-box), TOOL +1 (shield), APPLIANCE +3 (blender, TV, chainsaw), STATUE +2 (buddha-statue, gargoyle-statue), ROBOTIC +1 (mech-suit-pilot-pair), INSTRUMENTS +3 (saxophone, clarinet, sitar), PERFUME +3 (floral-aroma, petrichor/after-rain, air-freshener), WEATHER +5 (freezing-rain, drizzle, whirlwind/dust-devil, zephyr, ball-lightning), CRYSTALLINE/GEM +1 (crystal-ball/orb). New sub-groups opened: ARCHITECTURE Infrastructure; JEWELRY Wrist/arm/ankle + Body/decorative + Gem/pearl; APPLIANCE Entertainment electronics; STATUE Religious + Architectural/Gothic; ROBOTIC Paired/Piloted; WEATHER Lightning/electrical. Drops in this pass: rice-cooker, microscope (across TOOL + APPLIANCE + OPTICAL IMAGING lists), vesicle + blood-cell. File-wide entry total: 1,129 → 1,177 (+53 cumulative landings across all passes; 1,200 with dragons). **PHASE 1 CATEGORY ROADMAP STILL COMPLETE.**

*Pending after roadmap closure: **cross-cluster deferral-review pass** — consolidated review of all `### From X cluster (Y deferrals)` blocks in `archetype-session-notes.md` plus candidates noted in category intros within `archetype-subtypes.md`. Goal: decide which items to permanently drop from files vs. keep as future-densification candidates. May span multiple sessions depending on volume. PR/branch decision deferred until review-pass session begins.*

*Note: 2026-05-13 session also retro-added `thermometer-being` to TOOL section (new `**Measurement / precision**` sub-group) via separate commit per CAMERA cross-section redirect — does not bump category counter (TOOL already counted) but expands TOOL entry count.* See `archetype-session-notes.md` for full framing decisions and deferred-items log. Each batch follows propose → letter-picks → write → commit → push.

## Walkthrough cursor

**Borderline triage complete.** All 19 borderline cases resolved as MINOR (decision: MINOR tweaks sufficient, no BREAKING pivots needed). Cases 1-7 done in prior session; 8-19 resolved as follows:

- Case 8 (#128-129 Cranivade→Voidaxis) — MINOR applied in PR #47.
- Case 9 (#142-144 Dawnirel→Lunarael→Celestarch) — MINOR applied in PR #47.
- Case 10 (#157-159 Acidelix→Corrodisc→Dissotoad) — MINOR applied in PR #47.
- Case 11 (#162-163 Marlix→Blightalis) — MINOR applied in PR #47.
- Case 12 (#172-174 Scalurin→Serpenthos→Scalevorn) — resolved by PR #48 bridge work (Scalevorn←Serpenthos in Batch 5; Serpenthos←Scalurin in IMPLICIT sub-batch 3).
- Case 13 (#220-221 Umbrajest→Shadowveil) — MINOR applied in PR #47.
- Case 14 (#222-224 Mindpuff→Recallum→Psytheon) — MINOR applied in PR #47.
- Case 15 (#236-237 Frostick→Icevault) — MINOR applied in PR #47.
- Case 16 (#242-243 Pulseglow→Stuntrap) — MINOR applied in PR #47.
- Case 17 (#260-261 Sproutix→Leafhorn) — MINOR applied in PR #47.
- Case 18 (#262-264 Transluceed→Tendrilisk→Impenezard) — MINOR applied in PR #47 + reinforced by PR #48 bridges.
- Case 19 (#308-309 Seafraith→Tidephant) — MINOR applied in PR #47.

**Pipeline status (post PR #47 + PR #48):**
- ✅ Borderline triage (all 19 cases)
- ✅ 5 NEW BREAKING items (#84-86, #104-105 done in earlier sessions; #296-298, #299-300, #302-303 done in PR #47)
- ✅ MINOR tweaks (PR #47)
- ✅ Bridge-lore sweep (PR #48: 98 BRIDGE_NEEDED bridges + 33 foreshadows + 61 IMPLICIT polish + 29 name-leak fixes; comprehensive name-leak scan confirmed 0 leaks remain)

**Next up:** 🕯 UNIFIED audit (solo desc/lore/emoji + typing + archetype trim merged into per-Lumori workflow) → renaming → stat review.

The original walkthrough through ids 7-446 (paused at #13 Taurcin "keep" decision) is on hold until all the audit phases above complete.

---

# 🔧 BREAKING family fixes (priority queue)  `[✅ DONE — PRs #36/#47/#55, all items [x]]`

Per audit (Part 1 of evolution-line coherence audit) **plus** the strict re-audit of ids 210-446. Tackle one-by-one, get user approval per family before applying.

## Originally identified (9 done)

- [x] **#5 Cobaleap** — rewritten as 2 m long-bodied mustelid (cobalt fur, turquoise stripe, raised guard-hair ruff, leaping behaviour preserved). Emoji 🐍 → 🦦. Otter line now coherent: Aquatter (otter starter) → Cobaleap (sleek mustelid mid) → Banksnout (heavy amphibious otter final).
- [x] **#22-24 Hallucigaze → Pyraxis → Ignitheon** — Pyraxis (#23) rewritten as bipedal saurian with proto-mane (feathered ruff) bridging the snake-headed lizard base to the leonine final. Emoji 🧠 → 🦎. Stats/learnset unchanged.
- [x] **#31-33 Toxaquil → Noxaquith → Septanemone** — Septanemone (#33) rewritten as 3.5 m bloomed cephalopod with anemone-petal frills around the mantle and seven venom-tipped tentacles. Active swimmer (no longer sessile). Phylum now coherent: octopus → squid → bloomed cephalopod. Emoji 🪸 → 🦑. Lore opener "Noxarith…" fixed to "Septanemone…".
- [x] **#45-46 Slatis → Frostmere** — Frostmere (#46) rewritten as a 1.5 m gelatinous deep-ocean creature condensed into a seal-shaped silhouette. Frost-crystal layer mimics fur; trailing tendrils from base form preserved behind the flippers. **Retyped Ice/Water → Ice/Electric** to resolve pinniped × Ice+Water collision with Cryonik line; "resonant sensor for ice vibrations" reframed as "conductive sensor reading electric fields / prey heartbeats" (electroreception); bioluminescent pulses through gel-body added. 4 learnset swaps (water_gun → thunder_shock, aqua_tail → voltaic_fang, hydro_pump → ion_cannon, surf → ball_lightning). Emoji 🦭 kept.
- [x] **#50-52 Tundram → Shiverling → Permavast** — full bovid line (Option A). Tundram (ram, pinned) kept; Shiverling (#51) rewritten as woolly frost-yak with growing ice-slab shoulders, type Ice → Ice/Normal, emoji 💎 → 🦬; Permavast (#52) reframed as colossal mountain auroch with curled horns and ice-slab armor, emoji 🐻‍❄️ → 🐃. Lore opener for Tundram fixed ("Nivelin" → "Tundram").
- [x] **#57-58 Speculith → Irisarael** — Speculith (#57) rewritten as a 40 cm floating ice-fairy sprite with a translucent lens-face, crystalline spines around the lens, and stubby iridescent wing-buds foreshadowing Irisarael's full wings. Fixes prior desc/lore contradiction (desc said "fish" while lore said "lens"). Emoji 🐟 → ✨.
- [x] **#95-97 Dustkin → Seismith → Tectonvast** — full rhino line, retyped to **Ground/Electric** (mid + final). Dustkin (#95) reframed as 50 cm rhino calf with budding horn; Seismith (#96) as 1 m mid-rhino with conductive iron-veined plates and static-arc footfalls; Tectonvast (#97) as 2 m rhino-titan with lightning-following hide and storm-drawn ozone aura. Emojis 🐶/🐕/🦏 → 🦏 throughout. Learnset swaps (partial — kept some Rock/Crystal for variety): Seismith — stalactite_drop → spark, stone_edge → wild_charge (rock_slide and crystal_lance kept). Tectonvast — rock_slide → thunderbolt, stalactite_drop → ball_lightning, quarry_crush → overcharge (stone_edge and crystal_lance kept).
- [x] **#168-169 Espelith → Aurarael** — Aurarael (#169) rewritten as a 60 cm levitating psychic core with seven orbiting prism shards held by a visible blue-violet mind-field; humanoid face from base stage preserved on the central core shard. Type expanded Psychic → Psychic/Fairy (now matches Espelith). Emoji 🌀 → 💫.
- [x] **#209-210 Boltfur → Thundermane** — Thundermane (#210) rewritten as a 1.2 m maned storm-hare. Lagomorph silhouette preserved (long hind legs, upright ears) with the lion-mane visual reframed as a stiff fur mane crackling with static around the ears and neck. Pride-leader stalking → territory by hopping; roars → thunderclap mane-flares. Emoji 🦁 → 🐰. Stats/learnset already Electric-aligned, no swaps.
- [x] **#187-188 Norindel → Plentorus** — Plentorus (#188) rewritten as a 90 cm heavyset wild boar (Suidae throughout the line). Hedgehog quills preserved as a defensive ridge of stiffened bristles along its spine/shoulders/rump; pale-brown + cream-tip coloration retained; juvenile pink hide → mature coarse brown; foraging/winter-cache/accidental-planting behavior all kept. Emoji 🦔 → 🐗. *(Uncommitted, batched.)*

## Newly identified by strict re-audit of ids 210-446 (10 families)

- [x] **#226→229 Spectroo split-evo** — full kangaroo-silhouette across all four branches (Spectroo Normal/Psychic, Spectrace Fire/Psychic, Lunaroon Grass/Psychic, Radiafish Electric/Psychic). Spectrace (#227) MINOR tweak — flame-trail reframed as "kangaroo-silhouette of streaking flame". Lunaroon (#228) **retyped Ice/Psychic → Grass/Psychic** (pristine combo) — reframed as moonlit kangaroo whose body grows night-blooming silver flora; 3 learnset swaps (ice_beam → energy_ball, blizzard → petal_blitz, frost_breath → spore_burst). Radiafish (#229) BREAKING fix — fish → kangaroo-silhouette of electric plasma; lore opener "Prismolt is..." → "Radiafish is..." (name-leak fix); types Electric/Psychic kept; emoji ⚡ kept; learnset preserved. **Radiafish name flagged for renaming phase** (still contains "-fish" suffix that doesn't match new kangaroo body plan). Side benefit: Ice/Psychic combo drops 5 → 4 (still over cap but improving). Same-archetype peer check: kangaroo across 4 cells, all sole. *(Uncommitted, batches with next checkpoint at 26/32.)*
- [x] **#238-240 Snowble → Blizzariel → Tundrafox** — full snowman line with dark-corruption final (Ice → Ice → Ice/Dark). Snowble (#238) reframed as 20 cm self-rolling snowball with proto-snowman features (coal-eyes, hidden stick-limbs/carrot-nose); Blizzariel (#239) reframed as 60 cm adolescent three-tier walking snowman (dense crystal core preserved); Tundrafox (#240) reframed as 3 m malevolent snow-titan whose core crystal cooled past threshold during polar dark months and developed malice — corruption mechanism explicit in lore. Types Ice/Wind → Ice (base/mid) and Ice/Wind → Ice/Dark (final). Pristine pre-408 Ice/Dark slot claimed. Emojis ☃️/🌨️/🌀 → ☃️ throughout. Lore opener "Permafrix is..." → "Tundrafox is..." (name-leak fix). 7 learnset swaps total to drop Wind STAB and add Dark STAB to final. Side benefit: Ice/Wind combo drops 4 → 3 (relieves over-cap). Same-archetype peer check: snowman = pristine archetype. **Tundrafox name flagged for renaming phase** (still contains "fox" which no longer fits). *(Uncommitted, batches with next checkpoint.)*
- [x] **#244-246 Staticlaw → Thundravex → Megavolt** — full mustelid line (Option B; drops over-cap lion archetype by 1 instead of audit's lion-throughout idea). Staticlaw (#244) reframed as 30 cm electric weasel-kit (drops desc/lore "lion pup" mismatch). Thundravex (#245) reframed as 60 cm adolescent thunder-weasel/marten (drops "weasel-cat hybrid"). Megavolt (#246) reframed as 1 m massive thunder-wolverine; mane preserved as "thick collar of crackling electric coils mistaken at distance for a felid mane". Names, types Electric mono, learnsets all preserved. Emojis 🦁/⚡/🦁 → 🦡/⚡/🦡. Same-archetype peer check: mustelid×Electric mono = sole. Side benefit: lion archetype drops 6 → 5; mustelid goes 1 → 2 (under cap of 3). *(Uncommitted, batches with next checkpoint at 26/32.)*
- [x] **#269-270 Grimshade → Eclipsoon** — full tanuki / magical raccoon-dog line (Option C; pristine archetype claimed). Grimshade (#269) reframed as 50 cm tanuki cub with developing eclipse-magic shadow-trickery; emoji 🦇 → 🦝. Eclipsoon (#270) reframed as 70 cm eclipse-tanuki with fairy-pink luminescent patches and folkloric illusion-magic that peaks under eclipse shadow; emoji 🌑 kept. Resolves all four prior desc/lore/emoji mismatches and the size-regression. Names, types Dark / Dark+Fairy, learnsets all preserved. Same-archetype peer check: tanuki = pristine archetype. Moonstone evolution method now thematically perfect for tanuki magic. *(Uncommitted, batches with 26/32 checkpoint.)*
- [x] **#286-288 Fuzzlet → Cuddrix → Majesticore** — full kirin / qilin line, retyped Fairy / Fairy / Dragon+Fairy (pristine mythical-exempt archetype + pristine Dragon/Fairy combo claimed). Fuzzlet (#286) reframed as 15 cm fluffy fairy-glowing kirin-fawn; emoji 🐾 → 🦌; types Normal → Fairy; 4 learnset swaps to Fairy STAB. Cuddrix (#287) reframed as 35 cm adolescent kirin-calf with golden antler-glow + fairy-aura calming; emoji 🐻 → 🦌; types Normal → Fairy; 5 learnset swaps. Majesticore (#288) reframed as regal dragon-kirin (qilin "dragon-horse" mythology) 1.2 m at the shoulder with antlers wreathed in dragonfire-light, fine pale-gold scales beneath the fur, gentle-rain-calling; emoji 🦁 → 🌟; types Normal/Psychic → Dragon/Fairy; 6 learnset swaps + duplicate hyper_beam fix → outrage. Side benefits: lion archetype 4 → 3 (at cap); Normal/Psychic combo 3 → 2; Dragon/Fairy pristine combo claimed; kirin claimed as new mythical-exempt archetype. *(Uncommitted, batches with final 32/32 checkpoint.)*
- [x] **#291-292 Breezekin → Galehorn** — full wind-antelope line (Option C; pristine antelope archetype claimed). Breezekin (#291) reframed as 35 cm wind-antelope fawn with streaming mane. Galehorn (#292) reframed as 1.2 m adult wind-antelope with spiralling piezoelectric horns. Names, types Wind / Wind+Electric, emojis 🌬️/🌪️, learnsets all preserved (Wind/Electric moves fit antelope as well as ram). Same-archetype peer check: antelope = pristine archetype (sole). Side benefit: avoids reinforcing over-cap cat archetype that audit's lion-throughout idea would have caused. *(Uncommitted, batches with final 32/32 checkpoint.)*
- [x] **#293-295 Gustpuff → Stormwing → Cyclonax** — full wind-dragon line (Option A; body-plan fix only, Wind/Dragon typing kept). Gustpuff (#293) reframed as small wind-dragon hatchling with floating scale-husks (mistaken for dandelion-down) — bridges plant-puff → dragon by reframing the puff as shed scale-husks. Stormwing (#294) emoji 🦅 → 🐉 (was inconsistent with dragon lore). Cyclonax (#295) kept. Names, types Wind / Wind+Dragon, learnsets all preserved. **Note:** Dragon × Wind/Dragon strict-rule collision (3 pre-408 dragon families share this cell — Gustpuff, Galedrake, Riftscale) deferred to typing audit phase. *(Uncommitted, batches with final 32/32 checkpoint.)*
- [x] **#310-311 Mudpump → Marshix** — full hippo line (Option A). Mudpump (#310) reframed as 50 cm mud-coated hippo calf (resolves all 3 prior internal mismatches: emoji 🐊 + desc "muddy crocodile" + lore "mudskipper-fish" → all unified as hippo). Marshix (#311) kept. Emoji 🐊 → 🦛. Names, types Ground/Water, learnsets all preserved. Same-archetype peer check: hippo = sole family. Side benefit: cleans up multi-way internal contradiction. *(Uncommitted, batches with final 32/32 checkpoint.)*
- [x] **#312-313 Dunecrawl → Sandrix** — full desert armadillo line (Option A; pristine armadillo archetype). Dunecrawl (#312) kept as armadillo (lore was correct), desc + emoji fixed (resolves the 3-way mismatch: emoji 🦂 + desc "scorpion-like" + lore "armadillo" → all unified as armadillo). Sandrix (#313) reframed as 1.5 m massive desert armadillo with shadow-absorbing plates and burrow-and-erupt ambush hunting (drops serpent body plan); roll-into-sphere defense expanded for final form. Emojis 🦂/🐍 → 🪨 (rolled-armor-ball signal). Names, types Ground/Dark, learnsets all preserved. Side benefits: pristine armadillo archetype claimed; serpent count drops 4 → 3 (relieves over-cap). *(Uncommitted, batches with final 32/32 checkpoint.)*
- [x] **#405-407 Mirkling → Umbrasteel → Voidwarden** — corruption-arc fix (Option F; same pattern as Tundrafox snowman line). Mirkling (#405) and Umbrasteel (#406) kept entirely as shadow-canines. Voidwarden (#407) lore expanded to **explicitly explain the transformation**: when an Umbrasteel proves worthy of guarding the boundary between worlds, its canine body reforges itself upright — four legs reconstituting as two hindlimbs and two long steel-claw-tipped arms, shadow-filaments re-weaving into humanoid silhouette to better wield darkness and steel as tools. Pseudolegendary status, all names, types Dark/Steel, learnsets, emojis 🐾/🐺/⚔️ all preserved. Same-archetype peer check: warden archetype (final stage) = sole; canine intermediates explained as transformation-cocoon stages. Side benefit: wolf archetype drops 4-5 → 3-4 (this family's primary archetype now classified as bipedal warden, not wolf). Pristine mythical-exempt "void-warden / boundary-sentinel" archetype claimed. *(Uncommitted, will batch with final 32/32 checkpoint commit.)*

## Newly identified by direct manual audit of all 118 multi-stage families (12 families)

- [x] **#34-36 Pearlith → Undirael → Thalassira** — full mermaid line (Option A). Pearlith (#34) rewritten as 12 cm pearl-mermaid fry curled inside a 20 cm oyster shell (shell as nursery/shelter, snaps shut when threatened). Undirael (#35) kept as the 1.5 m mermaid mid-stage. Thalassira (#36) reframed as a 4 m regal sea-fairy queen — humanoid torso, long sweeping fin-tail, two pairs of translucent fairy wings, pearl-fragment crown callback to Pearlith. Body plan now coherent: pearl-fry-in-shell → mermaid → sea-fairy queen. Emoji 🧜 → 👑 for Thalassira (Pearlith 🐚 + Undirael 🧜 unchanged). Stats/learnset unchanged. Fairy-dragon flavor moved to concept parking. *(Uncommitted, batched.)*

## Newly identified by strict re-audit (post-32/32) — 5 families flagged as genuine creature changes

These are NEW BREAKING items surfaced when the audit was rerun strictly. Each is a real creature-archetype change between stages that no lore tweak can plausibly bridge. Tackle as full rewrites (proposal-and-approve flow).

- [x] **#84-86 Electrix → Shockharpe → Galvaglide** — full Odonata/dragonfly line (Option A; drops over-cap beetle archetype 5→4). Electrix (#84) reframed as 8 cm aquatic dragonfly nymph (gilled, predatory mandibles, rudimentary wing-buds); emoji 🐞 → 🐛. Shockharpe (#85) reframed as 15 cm late-instar dragonfly with newly emerged wings (drops mosquito framing, keeps disorientation hum + predatory mandibles); emoji 🦟 → 🪰. Galvaglide (#86) lore opener "Zapoveth is..." → "Galvaglide is..." (name-leak fix); emoji 🦟 → 🪰. Names, types Electric/Bug, stats, learnsets all preserved. Body plan now coherent: nymph → emerging dragonfly → adult dragonfly. *(Uncommitted, batched.)*
- [x] **#104-105 Arenikin → Dravanas** — full sand-hyena line (Option A; pristine archetype claimed; lion archetype stays at exactly cap of 3). Arenikin (#104) reframed as 35 cm sandy-furred hyena-pup (drops "dog" framing); emoji 🐾 kept. Dravanas (#105) reframed as 1.2 m great desert hyena with shoulder-and-back crest-mane of compressed soil and pebbles (preserves the mane element naturally — hyenas have prominent dorsal manes); emoji 🦁 → 🐾. Description "sand lion" → "great desert hyena"; "roar" → "low whooping cackle". Names, types Normal/Ground, stats, learnsets all preserved. Side benefits: pristine hyena (Hyaenidae) archetype claimed; lion stays at exactly cap of 3 (Siroccomane, Ignitheon, Pyraeon-postgame). *(Uncommitted, batched.)*
- [x] **#296-298 Plaguefly → Blightwing → Plagueoth** — full mosquito line (Option B variant: mosquito appearance throughout, not generic fly). Plaguefly (#296) kept as-is (already mosquito). Blightwing (#297) reframed as 40 cm-wingspan blight-mosquito with elongated proboscis that pierces bark to drain plant sap (drops butterfly framing); emoji 🦋 → 🦟. Plagueoth (#298) reframed as 60 cm great plague-mosquito with needle-proboscis as long as its body, bloated venom-sac abdomen, 1.5 m ragged dark wingspan (drops moth framing); emoji 🦠 → 🦟. Names, types Poison/Bug, stats, learnsets all preserved. Side benefits: Lepidoptera 6→5 (helps trim over-cap); mosquito stays sole/pristine. **Plagueoth name flagged for renaming phase** (`-oth` suffix is moth-evocative and no longer fits mosquito final).
- [x] **#299-300 Stinglet → Nettleclaw** — full bee line (Option A; pristine bee×Bug/Poison archetype claimed). Stinglet (#299) kept as-is (already bee). Nettleclaw (#300) reframed as 25 cm great bee with bee-striped yellow-and-black body, four membranous wings, and an elongated segmented stinger-tail that arches scorpion-like over its back — explicitly framed as parallel evolution of the bee's standard sting, not arachnid heritage. Drops "scorpion-bee hybrid" framing entirely. Emoji 🦂 → 🐝. Names, types Bug/Poison, stats, learnsets all preserved. Same-archetype peer: bee×Bug/Poison = sole. Pristine.
- [x] **#302-303 Lightpuff → Lumivane** — full orb line (Option A; orb-archetype exempt so no cap pressure; pristine "comet/streaking-light orb" sub-flavor claimed). Lightpuff (#302) kept as-is (already orb). Lumivane (#303) reframed as 50 cm-across brilliant luminous orb haloed by rudimentary limb-extensions of condensed light — translucent arm-rays and trailing tendril-legs that emerge from the central sphere but do not sever from it. Astronomical-archive psychic memory relocated to the core of its orb-body. Drops "graceful humanoid composed of starlight" framing. Emoji 🌠 kept (fits comet-rayed orb). Names, types Fairy/Psychic, stats, learnsets all preserved. Name "Lumivane" fits orb-throughout (`-vane` = sail/blade/ray, evokes the rayed extensions).
- [x] **#37-38 Coralossus → Titanariel** — humanoid coral-titan throughout (Option A). Coralossus (#37) kept as 4 m hulking humanoid. Titanariel (#38) reframed as 7 m armored coral-titan humanoid; nautilus shell + tentacles dropped in favor of "two enormous arms thick as ships' masts" with grasping claws (preserves ship-capsizing behavior). Steel-and-coral armor, deep-ocean-floor habitat, storm-surface ship-drag behavior all preserved. Emoji 🦑 → 🗿. Stats/learnset unchanged. Nautilus-metallic-humanoid flavor moved to concept parking. *(Uncommitted, batched.)*
- [x] **#53-54 Mistwhirl → Arcturex** — full owl line (Option C, picked over swan/bear/reindeer to avoid reinforcing the over-cap bear archetype). Mistwhirl (#53) reframed as a 30 cm fluffy snowy owlet with mist-trailing feathers. Arcturex (#54) reframed as a 1.2 m great snowy owl with 2.5 m wingspan, silent flight, Boötes-watcher namesake preserved. Both now Ice/Wind (was Ice/Wind + Ice/Ground). Emojis 🦢/🐻‍❄️ → 🦉. Stats redistributed for line coherence: Mistwhirl 54/40/41/68/55/98 → 52/60/32/45/70/98 (BST 357); Arcturex 92/101/89/66/79/61 → 80/101/52/57/87/113 (BST 490). Owl identity = fast physical hunter with high SpD and low Def. 3 learnset swaps on Arcturex: sinkhole_maw → cyclone_blade, earth_power → storm_surge, earthquake → hurricane. *(Uncommitted, batched.)*
- [x] **#61-62 Gelspike → Gelwing** — full ice-porcupine line, retyped Wind/Ice → **Ice/Poison** (pristine combo). Gelspike (#61) reframed as 60 cm hedgehog with venom-tipped ice quills + numbing chill-mist. Gelwing (#62) reframed as 1.2 m ice-porcupine launching envenomed quill volleys, wind-borne rolling-ball travel preserved with toxic-mist trail. Emojis 🌬️/🦅 → 🦔. 12 learnset swaps total to align Wind moves with Poison STAB. Stats unchanged. **Gelwing rename deferred to renaming phase** (`-wing` suffix is over-cap; candidates: Hailspike, Mirespike, Coldbristle, Quillrime, Rimebristle). *(Uncommitted, batched.)*
- [x] **#66-68 Viridix → Loamvin → Rootvorn** — full forest-snail line (Option C, snail/mollusk archetype — pristine slot; avoids reinforcing both over-cap saurian AND over-cap tree archetypes). Viridix (#66) reframed as 30 cm leaf-shell snail with fern-pattern shell. Loamvin (#67) reframed as 1 m forest snail with bark/moss/vine-encrusted shell. Rootvorn (#68) reframed as 3 m ancient snail whose shell has become a rooted bonsai forest with full canopy and tree-roots gripping the spiral. Names, types, emoji 🌿/🌳/🌳 → 🐌, learnsets all preserved. Rootvorn's "uproot at night, reorganise forests over decades" lore preserved verbatim in spirit. *(Uncommitted, batched.)*
- [x] **#75-77 Sylvolt → Sparkwood → Thorncharge** — full electric-stag/elk line (Option B; pivots from over-cap saurian + tree archetypes into deer archetype, currently 2 lines, brings to 3 at cap). Sylvolt (#75) reframed as 70 cm fawn with leaf-tipped electric antler-buds, emoji 🌱 → 🦌. Sparkwood (#76) reframed as 1.3 m adolescent stag with bark-covered branching antlers acting as roaming lightning rod, emoji 🌳 kept (bark-antlers visually tree-like). Thorncharge (#77) reframed as 1.5 m armored elk with thorn-antler crown discharging lightning on impact, emoji ⚡ kept (electric output). Names, types Grass/Electric, learnsets all preserved. *(Uncommitted, batched.)*
- [x] **#81-83 Joltan → Galvanos → Voltanox** — full equine line (Option A; pristine equine archetype claimed). Joltan (#81) reframed as 50 cm miniature electric pony-foal, emoji 🐭 → 🐎. Galvanos (#82) kept as horse (no changes). Voltanox (#83) reframed as 1.6 m electric destrier-stallion (clydesdale-sized warhorse), emoji ⚡ → 🐎; "two short horns" → "two forward-curving forehead-spurs" preserving capacitor function. Names, types Electric, learnsets all preserved. Same-archetype peer check: equine = sole family. *(Uncommitted, batched.)*
- [x] **#87-89 Amperix → Sparkrel → Surgolith** — full fish/eel line (Option A; phylum coherence + resolves prior desc/lore contradiction on Sparkrel that called it "electric eel" while lore said "pufferfish"). Amperix kept (tropical fish). Sparkrel (#88) reframed as 60 cm developing electric eel, emoji 🐡 → 🐟. Surgolith (#89) reframed as 4 m electric eel-leviathan with whisker-electroreceptors and full-body capacitor banks; deep-sea thermal-vent perch + electric-water-column discharge preserved; emoji 🐙 → 🐍. Names, types Electric/Water, learnsets all preserved. Side benefit: cephalopod archetype drops from 3 to 2 families. *(Uncommitted, batched.)*
- [x] **#92-94 Arcspine → Stonebolt → Petrovast** — full rock-echidna line (Option D; pristine echidna archetype claimed; avoids reinforcing over-cap saurian or creating 2nd rhino line). Arcspine (#92) reframed as 80 cm spiny rock-echidna with crystal-tipped quills, curls into spiked ball; lore opener "Arcrix" → "Arcspine" fixes name leak. Stonebolt (#93) reframed as 1.3 m heavyset rock-echidna with paired forehead-spurs discharging directional bolts. Petrovast (#94) reframed as 2 m colossal ancient rock-echidna in basalt-plate fortress. Names, types Electric/Rock, emojis ⚡/🪨/⛰️, learnsets all preserved. Same-archetype peer check: echidna = sole family. *(Uncommitted, batched.)*
- [x] **#114-115 Nimbusel → Aetherworn** — full cloud-fairy line (Option B; pristine cloud-fairy archetype). Nimbusel (#114) kept entirely. Aetherworn (#115) reframed from bat to 80 cm tattered shadow-cloud-fairy whose gossamer wings have frayed into trailing tatters of dark cloud-matter; "body shifts between solid and smoke" preserved verbatim, pale grey eyes preserved. Names, types Wind/Fairy → Wind/Dark, emojis ☁️/👻, learnsets all preserved (Dark moves still fit on a wraith-fairy). Same-archetype peer check: cloud-fairy = sole family. Side benefit: bat archetype drops from 3 to 2 families. *(Uncommitted, batched.)*
- [x] **#126-127 Impefurr → Specraxis** — full fox/kitsune line (Option A). Impefurr (#126) lore opener "Vexakin is..." → "Impefurr is..." (name-leak fix); emoji 👻 → 🦊. Specraxis (#127) reframed as 70 cm kitsune-like fox-spirit with shadow-tails, deep-set violet eyes glowing through fringes of shadow-fur, floats 10 cm above ground; mind-reading + thought-broadcasting confusion preserved verbatim. Names, types Dark / Dark+Psychic, learnsets all preserved. Same-archetype peer check: fox×Dark/Psychic = sole. *(Uncommitted, batched.)*
- [x] **#160-161 Miasmafly → Mistbane** — insect-swarm-as-cloud line (Option C; pristine swarm archetype). Miasmafly (#160) kept; lore opener "Miasoveth is..." → "Miasmafly is..." (name-leak fix). Mistbane (#161) reframed as 1 m cloud-swarm of microscopic miasma-flies bound by shared chemical signals into a single drifting collective; queen-fly at centre directs the swarm. "No fixed outline" / "shifting cloud" / "olive-green haze" / bog habitat / vitality-sapping all preserved verbatim. Names, types Poison/Wind, emojis 🦟/🦠, learnsets all preserved. Same-archetype peer check: insect-swarm sole. *(Uncommitted, batches with next checkpoint at 26/32.)*

# 🪛 MINOR family tweaks (one-line lore edits)  `[✅ DONE — PR #47]`

Batch these together once BREAKING is done. Each fix is a single-sentence wording change.

## From original audit (12)

- [x] **#7-9** Verdkin → tweak lore to mention "stubby leg-roots and a small reptilian tail" (foreshadows Barknell's saurian shape).
- [x] **#13-15** Taurcin → Molteroth → **Pyroclasm**: tweak Pyroclasm to "bipedal volcanic bull-titan that has reared up onto two legs."
- [x] **#16-18** Cindercula → Searburn → **Bahamber**: tweak Bahamber to mention "vast wings folded along its serpentine length."
- [x] **#19-21** **Magmaurin** → tweak to "bear-sized stocky **saurian**" (one-word fix bridges to lizard mid-stage).
- [x] **#39-40** Gossafin → **Marevanos**: tweak to "winged cetacean whose flat broad head and pectoral wings retain the manta silhouette."
- [x] **#47-49** Hexaprowl → Hailgorge → **Frigidvorn**: tweak to "heavy-shouldered, shaggy ice-wolf 2 m at the shoulder" (avoid switching to bear).
- [x] **#84-86** *(resolved by BREAKING #84-86 — line pivoted to full dragonfly/Odonata, not beetle; MINOR moot.)*
- [x] **#123-125** Nocturil → **Phantorvex** → Venotitan: tweak Phantorvex to "long-bodied legless serpent-lizard with vestigial limb-stubs."
- [x] **#132-133** Volcascale → **Monolithox**: tweak to "hulking obsidian saurian whose back has fused into a towering monolithic plate-shell."
- [x] **#157-159** Acidelix → **Corrodisc** → Dissotoad: tweak Corrodisc to "flattened toad-tadpole shape."
- [x] **#226-227** *(applied during BREAKING #226-229 split-evo work — Spectrace lore already reads "kangaroo-silhouette of streaking flame whose hindquarters trail off into fire".)*
- [x] **#232-234** Serphaxon → **Serpenthorn** → Wyvernak: tweak Serpenthorn to "long-bodied four-legged ground-dragon that drags its belly low, almost serpentine."

## Newly identified by strict re-audit of ids 210-446 (11 families)

- [x] **#222-224** Mindpuff → **Recallum** → Psytheon — cloud-puff → limbed brain → winged humanoid. Fix: tweak Recallum lore to "limbs first manifest as condensed psychic energy and only later harden into matter."
- [x] **#230-231** Scaleling → **Wyvaxis** — copper-red dragon hatchling → aqua-blue water-dragon (element/colour swap). Fix: tweak #230 lore to "its scales redden when basking but darken to aqua-blue once it learns to swim."
- [x] **#236-237** Frostick → **Icevault** — small icicle critter → architectural fortress tower. Fix: tweak #237 lore to "Icevault forms when a Frostick fuses with cave bedrock, its body lattice expanding into a tower-like silhouette."
- [x] **#242-243** Pulseglow → **Stuntrap** — firefly (Coleoptera) → dragonfly (Odonata). Fix: tweak #243 lore to "Stuntrap moults from its firefly carapace into an elongated dragonfly form, the abdominal light-organs becoming wing-edge arcs."
- [x] **#260-261** Sproutix → **Leafhorn** — bipedal sapling → quadruped deer-faun. Fix: tweak #261 lore to "as it matures, its trunk-body splits into four leaf-clad limbs and its head-leaves harden into antlers."
- [x] **#262-264** *(already applied in current Tendrilisk lore: "vine-tendrils still wrap a seed-core body — the lizard silhouette is camouflage from outside, all plant within".)*
- [x] **#296-298** *(resolved by BREAKING #296-298 above — full mosquito pivot; no separate MINOR needed.)*
- [x] **#299-300** *(resolved by BREAKING #299-300 above — full bee pivot with parallel-evolved whip-stinger framing baked into Nettleclaw's lore; no separate MINOR needed.)*
- [x] **#302-303** *(resolved by BREAKING #302-303 above — full orb pivot; no separate MINOR needed.)*
- [x] **#308-309** *(already applied in current Tidephant lore: "As it matured from Seafraith, its fins broadened into flippers and its skeleton calcified into a whale-like frame — a fish-to-leviathan apotheosis".)*
- [x] **#404-407** *(resolved by BREAKING #405-407 Voidwarden corruption-arc fix above; no separate MINOR needed.)*

## Newly identified by direct manual audit of all 118 multi-stage families (11 families)

- [x] **#42-44** *(already applied in current Nagislither lore: "elongated mature seal-form 3 metres long … long pinniped body and broad front flippers. Its whiskered face …".)*
- [x] **#69-71** Germix → Verdurus → Verdovast — **upgraded MINOR → BREAKING** (only seed-pod family in luminex; better to keep seed-pod identity than absorb into over-cap bear archetype). Germix (#69) kept as 30 cm seed. Verdurus (#70) reframed as 1.5 m walking seed-pod with split husk, moss-covered core, curling leaf-tendrils, drops fresh seeds in its trail; emoji 🐻 → 🌱. Verdovast (#71) reframed as 2.5 m colossal ancient seed-pod with surface so overgrown with saplings/vines/blossoms it resembles a walking garden; trees grow from its shoulders, fruit ripens among branches, creatures nest in its foliage; drops fertile seeds with each step, leaves grove ecosystems in its wake; emoji 🐻 → 🌳. Names, types Grass, learnsets all preserved. Side benefits: bear archetype drops 3 → 2 (relieves pressure); pristine seed-pod / walking-garden archetype claimed. *(Uncommitted, batched.)*
- [x] **#78-80** Sylvnox → Morraveth → Morralyn — **upgraded MINOR → BREAKING** (pivoted whole line to Leshy / forest-spirit archetype to relieve over-cap wolf pressure and reframe Morralyn's "bear-wolf hybrid" as a coherent folkloric forest-spirit final). Sylvnox (#78) reframed as 60 cm bark-skinned forest-imp/sprite with leaf-cloak fringe, twig-horns, amber eyes glowing through foliage-hood (was 65 cm fox); emoji 🌿 kept. Morraveth (#79) reframed as 1 m mid-stage leshy with bark-plated shoulders, branching antler-buds, midnight leaf-cloak (was 90 cm wolf); emoji 🌑 → 🌳. Morralyn (#80) reframed as 1.8 m ancient leshy-lord with full antler-crown, vine-beard with hollow seedpods, bark-armour body, decay-aura (was 1.5 m bear-wolf hybrid); emoji 🌑 → 🪵. Names, types Grass/Dark, stats, learnsets all preserved (all moves fit a corrupted-forest-spirit just as well as a canine). Side benefits: wolf archetype drops 6 → 5 (helps trim target); "fairy chimera/composite" slot drops 2 → 1; pristine Leshy / forest-spirit lineage claimed as new mythical-exempt archetype. *(Uncommitted, batched.)*
- [x] **#104-105** *(resolved by BREAKING #104-105 — line pivoted to full hyena; "lion-sized" framing already dropped, mane reframed as compressed-soil hyena dorsal crest.)*
- [x] **#108-110** **Silvergust** → Siroccomane → Aeolarch — cat → lion → lion. Fix: tweak Silvergust lore to "lion-cub-sized wind-felid" (drops "cat-like" framing) — felid throughout. Also fixed name leak: lore opener "Gustkin is..." → "Silvergust is...". Stages #109 and #110 untouched. *(Uncommitted, batched.)*
- [x] **#116-117** Zephyrin → **Pneumathos** — serpentine wind creature → humanoid-cored vortex. **Pivoted Zephyrin to vortex-throughout** (rather than the original audit's "serpentine inside vortex" tweak) to relieve over-cap serpent archetype. Zephyrin (#116) reframed as 1.5 m small wind-psychic vortex (translucent teal-blue swirling column with faint psychic glow at centre, ribbons of wind trailing from periphery); drops "serpentine" / "scales" / "fins" framing. Pneumathos (#117) untouched. Names, types Wind/Psychic, emojis 🌀/🌪️, stats, learnsets all preserved. Side benefit: serpent (non-dragon) archetype drops 4 → 3 (at cap). **Note:** family lands in storm-elemental/lightning-vortex archetype which is now capped at 1-2 (no longer mythical-exempt) — see archetype trim list. *(Uncommitted, batched.)*
- [x] **#128-129** Cranivade → **Voidaxis** — psychic biped → blurred shifting entity. Applied: Voidaxis lore extended to keep biped silhouette at form's centre with edges dissolving into half-dimensional shadow; Cranivade lore opener "Mentarix is..." → "Cranivade is..." (name-leak fix). Both stages now coherent — biped persists inside void aura. *(Uncommitted, batched.)*
- [x] **#142-144** Lunarael (#143) lore opener extended with "Dawnirel's pointed arms have curved inward, briefly crescent-like, before they bloom back to a full many-pointed star at its final stage" — bridges the star → crescent → many-pointed-star body-plan progression.
- [x] **#162-163** Blightalis (#163) lore opener reframed: "resembling a large corrupted flower" → "whose reed-stalk body has bloomed into a flower-headed humanoid" + "wilting bloom around its head" — bridges the humanoid-reed → flower-headed-humanoid evolution.
- [x] **#220-221** Shadowveil (#221) lore opener extended with "Umbrajest's wispy smoke-body has solidified into a cloaked humanoid form" — bridges the smoke-trickster → cloaked-humanoid silhouette shift (tangibility unchanged: hands still pass through its shadow-substance).
- [x] **#226-229** *(resolved by BREAKING #226-229 split-evo work — both #228 Lunaroon (retyped Grass/Psychic moonlit-kangaroo) and #229 Radiafish (kangaroo-pivot from fish) handled.)*

# 🔍 Solo desc/lore/emoji consistency audit — MERGED INTO 🕯 UNIFIED AUDIT  `[✅ DONE standalone (PR #49); workflow now lives in 🕯 UNIFIED]`

Workflow merged into the per-Lumori UNIFIED audit (Step 2). The original scan categories — emoji vs body plan, desc vs lore, name leaks, stat-vs-body conflicts, same-archetype × typing-combo collisions, pre-408 post-game typings — are surfaced per Lumori as the audit walks the dex. See "🕯 Per-Lumori lore + desc + archetype + cap audit (UNIFIED)" below.

# 🦄 Creature inventory + mythological exemptions — RUN BEFORE archetype trim  `[✅ DONE — inventory/classification PRs #38–46; archetype TRIM happens in 🕯 UNIFIED]`

Goal: complete inventory of every creature/animal/thing represented in the dex (with family counts), and curated lists of "special / mythological / unique" archetypes exempt from the cap-of-3 rule, plus mythological creatures NOT yet in dex for potential diversification.

## (a) Inventory — current state (auto-classified by lore-keyword sweep; needs manual cleanup)

**269 multi-stage + standalone families total. ~161 keyword-classified; ~108 unclassified (mostly Forgotten/postgame mons with abstract names — need manual archetype assignment).**

### Over cap (>3 families) — common archetypes (regular-animal, will get trimmed):
- **lion/big-cat**: 5 (Hallucigaze line, Arenikin/Dravanas, Silvergust line, Boltfur (now hare; counted as lion in keyword), Cuddrix line) — most contestable; some entries may have moved out
- **cat (small felid)**: 5 (Fluffen, Staticlaw line (now mustelid), Mimiclaw, Emberveil, Cinderpaw)
- **cetacean**: 5 (Gossafin/Marevanos, Titanomare, Scolphin line, Seafraith line, Riftwhale)
- **butterfly/moth (imago)**: 6 (Scorchlarva line, Faeling, Blightmite, Photoworm line, Mosswing, Plaguefly line)
- **beetle**: 4 (Iridibeetle, Muddite, Sparkeen, Voltbeetle)
- **crab/lobster**: 4 (Reefling line, Rugothon, Petrwave, Deepcrawler)
- **serpent (non-dragon)**: 3 (Nocturil line, Coilstrike, Fluxserpent) *(Dunecrawl line → armadillo #312-313; Zephyrin line pivoted to vortex #116-117)*

### Over cap (>3) — mythical/exempt candidates (see (b) below):
- **dragon-mythic**: 34 — exempt (mythical)
- **faerie sprite / winged-fairy**: 9 — exempt (mythical)
- **shadow/wraith/ghost-spectral**: 9 — exempt (mythical)
- **crystalline-prism**: 6 — exempt (mythical)
- **golem (humanoid metal/stone)**: 5 — exempt (mythical)
- **void/cosmic/abstract**: 5 — exempt (mythical)
- **orb/wisp/cloud-formless**: 4 — exempt (mythical/elemental)

### At cap (3 families):
- **bear**: 2 (Hexaprowl ice, Rotunden line) *(Verdurus line converted to seed-pod #69-71)*
- **eagle/raptor**: 3 (Zephyrel, Aeolin line, Rimeclaw)
- **fish (non-dragon/eel)**: 3 (Corelin line, Toxirin frog, Rustpike)
- **lizard/saurian (non-dragon)**: 3 (Verdkin line, Cindling line, Blistermaw)

### Under cap (≤2):
- **bat**: 2 (Spiraloom line, Aeronyx line)
- **bovid**: 2 (Tundram line, Breezekin line)
- **cephalopod**: 2 (Toxaquil/Septanemone, Abyssovex)
- **dragonfly**: 2 (Electrix line, Pulseglow line)
- **fairy chimera/composite**: 1 (Stinglet line) *(Sylvnox line → leshy #78-80)*
- **jellyfish/cnidarian**: 2 (Slatis/Frostmere, Lumejell)
- **kangaroo/marsupial**: 2 (Lunaroon, Radiafish — both stone-evos of Spectroo line)
- **mouse/rat (rodent)**: 2 (Murkrat, Dunespike)
- **shark/eel**: 2 (Amperix line, Abyssalith)
- 1-family slots: bird, boar/pig, coral-titan, crocodilian, dog (non-wolf), echidna, frog/toad, hedgehog/porcupine, hippo, horse/equine, insect-swarm, **kitsune**, mushroom/fungus, mustelid, owl, plant-sapling, rabbit/hare, rhino, scorpion, sea-fairy queen, **seed-pod / walking-garden**, slime/blob, snail/mollusk, spider, stag/elk/deer, **tanuki**, wolf

### Unclassified (108) — manual classification needed
Many are Forgotten/postgame (id ≥ 408) with abstract/legendary names that don't match real-keyword. Some pre-408 lines also need manual review (e.g. Pyroclasm, Tundrafox now snowman, Nimbusel-Aetherworn cloud-fairy). **Recommended**: do a manual classification pass before running the archetype trim.

### Classified this session (batch 1 of 3: 27 ambiguous resolved 2026-05-24)

Resolves the 27 ambiguous-keyword-match pre-408 families surfaced by `scripts/classify_pre408_archetypes.py`. Newly-assigned archetypes below are authoritative; they override any stale (a) auto-keyword tally above where conflicts exist. Unclassified count reduces: 108 → 81.

**Existing archetypes +N (assignments from lore reading):**
- otter/mustelid +1: Banksnout #6
- lion / big-cat +1: Ignitheon #24
- fish (non-eel) +1: Nepturix #30
- cephalopod +1: Septanemone #33 *(supersedes auto "fish" keyword hit)*
- cetacean +2: Marevanos #40, Tidephant #309
- seal/pinniped +1: Frostmere #46 *(supersedes (a) "jellyfish/cnidarian" — gelatinous seal-silhouette per BREAKING #46)*
- dragonfly +2: Galvaglide #86, Stuntrap #243
- shark/eel +1: Surgolith #89
- bird-of-prey +1: Cyclavorn #113
- bat +1: Caveshroud #122
- serpent (non-dragon) +1: Venotitan #125
- golem (humanoid metal/stone) +2: Alloytron #151, Boulderoll #192
- frog/toad +2: Venekon #156, Dissotoad #159
- rabbit/hare +2: Racehare #181, Thundermane #210 *(Thundermane was auto-listed as lion in (a); corrected per BREAKING #209-210 maned-storm-hare lore)*
- kangaroo/marsupial +1: Spectrace #227 *(per BREAKING #226-229 split-evo)*
- crystalline-prism/gem +1: Shardlix #241
- beetle +1: Sparkeen #247
- cat (small felid) +2: Emberveil #301, Frostprowl #335
- orb/wisp/will-o-wisp +1: Willowisp #368 *(confirms (b) listing)*
- void/cosmic/abstract +1: Voidrend #373 *(confirms (b); resolves dual-listing with wraith)*

**New pristine mythical-exempt archetype claimed:**
- void-warden / boundary-sentinel +1: Voidwarden #407 *(per BREAKING #405-407 — corrupted-canine final-stage transforms into bipedal warden; pristine archetype already noted in (b))*

### Classified this session (batch 2 of 3: 38 unclassified→fits-existing 2026-05-24)

Resolves the unclassified-keyword-match pre-408 families that fit existing archetypes from (a) or (b). Each assignment grounded in the final-stage's lore. Unclassified count reduces: 81 → 43.

**Common-animal additions:**
- lizard/saurian +2: Garlawarden #9, Terravore #21 *("quadrupedal reptile" / "dinosaur-like creature")*
- crocodilian +1: Calciderm #103 *("massive freshwater crocodilian")*
- bovid (sheep variant) +1: Aetherflock #190 *("medium psychic sheep" — bovid taxonomic family)*

**Mythical-exempt additions:**
- treant/ent +3: Necrothon #131 *(confirms (b))*, Silthorn #326, Thornspire #357
- faerie sprite / winged-fairy humanoid +1: Blightalis #163 *("flower-headed humanoid" — flora-fae)*
- shadow/wraith/ghost-spectral +2: Shadowveil #221, Shadowreave #343
- crystalline-prism/gem (ice-statue variant) +1: Glaciarch #359 *("humanoid carved entirely from deep blue glacial ice")*
- orb/wisp/cloud-formless +2: Cloudrift #285 *("compact cloud with face")*, Chromavast #363 *("ovoid body cycling colors")*
- void/cosmic/abstract +2: Nullform #371 *("matte black, no light reflects")*, Deepvoid #387 *("featureless absolute black")*
- golem (humanoid metal/stone) +5: Eternarmor #149, Stonegrip #252, Galvathon #320, Ashgolem #337, Abyssforge #377 *(over cap — flagged below for UNIFIED step 3 subdivision)*
- phoenix/solar-bird +1: Solarcrown #384 *(confirms (b))*
- seed-pod / walking-garden +1: Verdovast #71 *(confirms (b) pristine per BREAKING #69-71)*

**Elemental subsection additions (cap = 1 family + 1 standalone per element):**
- wind-elemental: Pneumathos #117 *(confirms (a) — already counted; no new tally)*
- water-elemental +1 (NEW slot): Psychotide #255 *("flowing water-psychic creature... uncoiled and stretched")*
- fire-elemental +1 (NEW slot): Magmite #277 *("lava droplet that has cooled enough to walk")*

**Natural-disaster subsection additions:**
- storm-elemental / thunderstorm +3: Vortexwing #370, Tempestborn #380, Nullstorm #393 *(matches the 3-family enumeration already in the 🐺 Natural-disaster subsection — confirming, not adding new)*

**Rock/architectural additions (over cap; flagged for UNIFIED step 3 subdivision):**
- rock-monolith / standing-stone +9: Megalith #250, Ashrock #253, Ashvanus #315, Quarrex #327, Mirestone #341 *(reassign from (b) crystalline)*, Bouldertide #367, Gravithorn #369, Permafrost #385 *(ice-monolith variant)*, Chronolith #388 *(reassign from (b) crystalline)*

**Confirmations (already classified elsewhere — no new tally):**
- mosquito: Plagueoth #298 *(per BREAKING #296-298; whole Plaguefly line)*
- armadillo: Sandrix #313 *(per BREAKING #312-313; pristine, whole Dunecrawl line)*

**Over-cap flags surfacing in this batch (UNIFIED step 3 to resolve):**
- **golem** at ~13+ after batch 1+2 — needs subdivision (mech vs stone-construct vs alloy-humanoid) or trim
- **rock-monolith / standing-stone** at ~10+ — needs subdivision (volcanic vs ice vs ancient-megalith) or trim; also affects (b) crystalline tally (Mirestone + Chronolith moving out)
- **void/cosmic/abstract** at ~7+ — borderline; may need subdivision (matte-black variant vs space-bending variant)
- **shadow/wraith/ghost-spectral** at ~11+ — borderline; mythical-exempt but expanding

### Classified this session (batch 3 of 3: 11 unclassified→new-archetype-slots 2026-05-24)

Resolves the final 11 unclassified pre-408 families that don't fit any existing (a) common-animal or (b) mythical-exempt archetype. Each opens a new archetype slot (mostly mythical-exempt; one common-animal pristine). UNIFIED audit will revisit folding/consolidating these in its per-Lumori pass. Unclassified count reduces: 43 → 32 *(the remaining 32 = 6 auto-collapsed mono from Phase B + 11 PR #49 forced retypes + ~15 multi-stage families whose final stage was already classified but whose mid-stage classifications haven't been written here yet — all of those are pre-classified or get reviewed in UNIFIED)*.

**New mythical-exempt archetype slots (8):**
- **elemental titan / geological-colossus** +2: Infriglace #213 *("colossal fire-ice titan")*, Primordiax #400 *("primordial titan of cooling lava and deep rock; 500-million-year footprints")*
- **disembodied psychic intelligence** +1 (pristine): Distorsion #217 *("vast psychic intelligence that lacks a physical body... shimmering distortion in the air")*
- **alchemical flask-being / living vessel** +1 (pristine): Toxicore #323 *("living flask of boiling acid... core chamber glows violent orange-green")*
- **astral humanoid / psychic-wing being** +1: Astralwing #346 *("luminous humanoid shape with feathers made of thought-light")* — UNIFIED may fold into 🔮 humanoid late-discussion bucket
- **architectural / fortified tower** +2: Crystavault #349 *("fortified tower of layered glacial ice and granite; ancient siege equipment bent and broken")*, Icevault *(already classified per BREAKING #236-237 — tower-like silhouette via Frostick + cave bedrock fusion)*
- **demon-king / regal flame-ruler** +1 (pristine): Cinderking #365 *("regal bipedal form with crown of black fire. Rules fire-type territory through dominance displays")* — UNIFIED may fold into 🔮 humanoid late-discussion bucket
- **weapon-being / animate-construct** +2: Starlance #366 *("elongated lance of alien metal... moves by telekinesis")*, Thunderpeak #396 *("stylised lightning bolt in living metal; near-perfect conductor")*

**New common-animal pristine slot (1; cap 3):**
- **mantis / blade-insect** +1: Chittering #324 *("sleek dark-coloured insect with six blade-like limbs and multi-faceted crimson eyes")*

**Flagged for UNIFIED step 3 subdivision (not a new slot):**
- Nightmont #219 — "perfectly black mountain, absolute darkness" — assigned to rock-monolith as the **dark-shadow variant**. UNIFIED's rock-monolith subdivision (volcanic / ice / ancient-megalith / dark-shadow) will decide the final split.

### Classification pass complete — handoff to UNIFIED audit

After batches 1-3, all 77 pre-408 ambiguous + unclassified families have a preliminary archetype assignment. The UNIFIED per-Lumori audit (next workflow) will:
1. Revisit each Lumori in context of its full lore + desc + emoji + typing
2. Confirm or revise the archetype assignment proposed here
3. Apply the cap rules from 🐺 / 🧪 / 🦄 at decision time
4. Resolve any of the new slots that should fold into existing buckets

This batch's purpose was to give UNIFIED useful pre-classified data so per-Lumori decisions go faster — not to lock in final archetypes. Treat all batch-1/2/3 assignments as **defaults the UNIFIED audit can override**.

## (b) Mythological / special / unique exemptions currently in dex (exempt from cap-of-3)

These archetypes have strong folkloric / mythical / unique status and warrant > 3 families. The cap-of-3 should NOT apply.

### Definite mythical exemptions
- **Dragon** (34) — universal mythological pillar; many sub-flavors (wyvern, drake, wyrm) historically distinct
- **Phoenix / solar bird** (Pyrocrown, Solarcrown, Solarwrath, Solarvast — 3-4 families)
- **Kitsune / fox-spirit** (Specraxis line, just added) — Japanese folkloric magical fox
- **Tanuki / magical raccoon-dog** (Eclipsoon line, just added) — Japanese folkloric trickster spirit
- **Mermaid / sirenian** (Pearlith line) — universal mythical sea-being
- **Sea-fairy queen** (Thalassira) — flagship legendary; ocean sovereign
- **Coral-titan / colossus humanoid** (Titanariel) — flagship mythical sea-titan
- **Kraken / sea-titan crustacean** (Tidalossus, Titanomare overlap) — universal sea-monster
- **Wraith / ghost / spectre** (~9 families: Wraithking, Voidrend, Lunaspectre, Glimmeritch, Willowisp, Wraithstorm, Abyssalord, Stonekeeper, Venomwraith) — universal undead-spirit archetype
- **Void / cosmic / abstract being** (~5 families: Voidlord, Cosmoveil, Voidcrown, Mirkling/Voidwarden, Shadowpup line) — abstract-elemental; flagship
- **Slime / blob / amorphous** (Bouncyblob; should expand) — classic JRPG-mythic
- **Crystalline-prism / gem-being** (~6 families: Espelith line, Megalith line, Volcascale/Monolithox, Icethorn line, Mirestone, Chronolith) — flagship mineral-elementals
- **Treant / ent / walking-tree spirit** (Necralia/Necrothon, Transluceed-Tendrilisk-Impenezard line) — folkloric forest-guardian
- **Golem (humanoid metal/stone construct)** (~5 families: Scrapsapien line, Dentshaft/Terragolem, Gearbit/Mechavast, Ferrocrush, Embersteel) — universal mythical-construct
- **Faerie sprite / winged-fairy humanoid** (~9 families: Speculith line, Floralin line, Goldefluff line, Mindpuff line, Crealight, Sproutix line, Ironling line, Voidraxis, Solarwrath) — universal fae-mythic
- **Will-o-wisp / ghostly orb** (Veilwisp line, Willowisp) — folkloric marsh-spirit
- **Snowman (folkloric)** (Snowble line, just added) — Western seasonal-folkloric figure
- **Leshy / forest-spirit (Slavic folkloric)** (Sylvnox line, just added) — bark-skinned forest-guardian/trickster spirit
- **Insect-swarm collective** (Mistbane line, just added) — quasi-mythical (Pokémon's Vespiquen-style)

### New exemptions confirmed 2026-05-24 (classification batches 1-3)
- **Void-warden / boundary-sentinel** (Voidwarden #405-407, pristine) — folkloric guardian of dimensional boundaries; corrupted-canine final-stage transforms into upright warden per BREAKING #405-407
- **Elemental titan / geological-colossus** (Infriglace #213, Primordiax #400) — titan-tier dual-element/geological beings; "primordial titan", "500-million-year footprints"
- **Disembodied psychic intelligence** (Distorsion #217, pristine) — abstract being lacking physical body; "shimmering distortion in the air"
- **Alchemical flask-being / living vessel** (Toxicore #323, pristine) — homunculus/alchemical-vessel archetype; "living flask of boiling acid"
- **Architectural / fortified tower** (Crystavault #349, Icevault #237) — folkloric "living-fortress" archetype (Pokemon Stakataka analog); both explicitly tower-silhouette in lore
- **Weapon-being / animate-construct** (Starlance #366, Thunderpeak #396) — animate-weapon archetype (Pokemon Honedge analog); distinct from golem (weapons not bodies)

*(Storm-elemental / lightning-vortex moved out of mythical-exempt — see archetype trim list, capped at 1-2 families.)*

### Borderline resolved 2026-05-24 (kept as common cap-3, not exempt)
- **Echidna** (1, Arcspine line) — real animal, rare in dex/folklore both. **Resolution: common cap-3.**
- **Owl** (1, Mistwhirl line) — real animal, folkloric (wisdom/watcher) but not mythical-creature tier. **Resolution: common cap-3.**

### Folded into 🔮 humanoid late-discussion bucket
- **Astral humanoid / psychic-wing being** (Astralwing #346) — "luminous humanoid shape with feathers of thought-light" → tracked with other humanoids
- **Demon-king / regal flame-ruler** (Cinderking #365) — "regal bipedal form" → tracked with other humanoids

## (c) Mythological creatures NOT yet in dex (diversification candidates for renaming phase)

For each over-cap common archetype, we can convert some members into one of these to dilute the count. Organized by mythological tradition:

### Greek/Roman
- **Griffin** (eagle + lion) — could absorb a raptor or lion line
- **Hippogriff** (horse + eagle) — could absorb a horse or raptor line
- **Manticore** (lion + scorpion-tail) — lion-archetype absorber
- **Pegasus** (winged horse) — horse-archetype absorber
- **Centaur** (human + horse) — humanoid + equine
- **Satyr / faun** (human + goat)
- **Minotaur** (human + bull)
- **Sphinx** (lion + winged + face)
- **Hydra** (multi-headed serpent)
- **Cerberus** (3-headed dog)
- **Gorgon** (snake-haired humanoid)
- **Harpy** (woman + bird) — bird-of-prey absorber
- **Medusa-like petrifiers**
- **Cyclops** (one-eyed giant)
- **Nymph / dryad** (forest-spirit) — already adjacent to faerie sprites

### East Asian
- **Qilin / kirin** (Chinese deer-unicorn) — deer-archetype absorber
- **Tengu** (crow-human mountain spirit)
- **Oni** (demon) — humanoid horror absorber
- **Kappa** (water imp/turtle)
- **Bake-neko / nekomata** (cat-spirit) — cat-archetype absorber
- **Ningyo** (Japanese mermaid variant)
- **Shisa** (lion-dog guardian) — lion absorber
- **Raiju** (thunder-beast) — generic thunder-coded absorber
- **Inugami** (dog-spirit)

### Norse / Germanic
- **Jormungandr** (world-serpent) — serpent absorber
- **Valkyrie** (winged warrior-spirit) — bird absorber
- **Fenrir / dire-wolf-mythic** (giant wolf) — wolf absorber
- **Sleipnir** (8-legged horse)
- **Nidhogg** (root-dragon)

### European folklore / cryptids
- **Kelpie** (water horse) — horse absorber
- **Selkie** (seal-shapeshifter) — pinniped absorber
- **Wendigo** (cold spirit) — already adjacent
- **Yeti / Sasquatch** (cryptid ape)
- **Mothman** (moth + humanoid) — moth absorber
- **Jackalope** (rabbit + antlers) — rabbit absorber
- **Drop-bear** (Australian cryptid)
- **Banshee** (wailing female spirit)
- **Gargoyle** (stone gargoyle)

### Middle Eastern
- **Ifrit / djinn** (fire-spirit)
- **Roc** (giant bird) — raptor absorber
- **Manticore** (already listed)

### Generic mythical / RPG-traditional
- **Salamander (mythical fire-lizard)** — saurian + fire
- **Basilisk** (king of serpents) — serpent absorber
- **Cockatrice** (rooster-serpent hybrid)
- **Unicorn** — already adjacent to horse/deer
- **Lamia** (snake-woman) — snake absorber
- **Naga** (snake-being)
- **Homunculus** (alchemical humanoid)
- **Doppelganger** (shapeshifter mimic)
- **Werewolf** (could leverage wolf overcap as a "human-form-bound-to-wolf" archetype)
- **Lich / undead skeleton** — adjacent to wraith
- **Vampire-bat** — bat-archetype mythical absorber
- **Bunyip** (Australian water-cryptid)

## (d) Tasks remaining

- [x] **Manual classification pass** on the 108 unclassified families (especially Forgotten/postgame mons) — assign each to an archetype. *(pre-408 portion done 2026-05-24 in 3 batches: 27 ambiguous + 38 unclassified-fits-existing + 11 unclassified-new-slots = 77 families. Forgotten/postgame (id ≥ 408) portion (~31 families) deferred to UNIFIED audit since those have inline LORE-AUDIT FLAGs from Step 4 and will get per-Lumori attention there. See "Classified this session (batches 1-3)" subsections in (a) above.)*
- [x] **Verify (b) exemption list** with user once full inventory is clean. *(done 2026-05-24 — 19 established exemptions confirmed authoritative; 6 new exemptions added from this session's batches 1+3 (void-warden, elemental-titan, disembodied-psychic-intelligence, alchemical-flask-being, architectural/fortified-tower, weapon-being); 2 borderlines (echidna, owl) resolved as common cap-3; 2 new entries (Astralwing, Cinderking) folded into 🔮 humanoid late-discussion bucket rather than getting standalone exempt slots. See "(b) → New exemptions confirmed" / "Borderline resolved" / "Folded into 🔮 humanoid" subsections above.)*
- [~] **Pair (c) candidates** with specific over-cap common-archetype members to pivot during the renaming phase. *(deferred to UNIFIED step 3 — pairings are per-Lumori design decisions and need to happen alongside lore/desc review, not in isolation. The cap-trim list at `cap_trim_list.txt` enumerates the 11 over-cap common archetypes that UNIFIED will pair against (c) candidates as it walks the dex.)*
- [x] **Output the final cap-trim list** reflecting (a)+(b)+(c). This becomes the input to the existing "Archetype oversaturation" section below. *(done 2026-05-24 — saved as `cap_trim_list.txt` at repo root, generated by `scripts/output_cap_trim_list.py`. Combines keyword auto-classification + manual overrides from this session's batches 1-3. Aggregates all 230 pre-408 final-stage families across 71 archetypes. Surfaces 11 over-cap common archetypes: rock-monolith (11 → trim 8), butterfly/moth (6→3), lizard/saurian (5→2), cetacean (5→2), cat (5→2), beetle (5→2), bovid/crab/wolf/bird-of-prey/kangaroo (4→1 each). Mythical-exempt over-counts (dragon 35, faerie 20, golem 13) flagged for 🔮 late-discussion. Regenerate by re-running the script after future BREAKING fixes.)*

**Run order placement:** before the existing "Archetype oversaturation — common animals" trim section below. The inventory + exemption list **defines** what counts toward the trim, then the trim runs against that updated list.

# 🔀 Typing system overhaul — RUN BEFORE the type-combination audit cap re-analysis  `[✅ DONE — PR #51: 26-type TYPE_CHART + 556 new moves + Step-4 flags; Step 5 → 🕯 UNIFIED]`

Active work as of 2026-05-21: differentiate Lumoria's typing system from Pokemon's, then re-tally combo caps under the new types.

## Pre-step decisions (locked 2026-05-21)

**Type renames (single → single):**
- Water → Aquatic
- Psychic → Mental
- Dragon → Draconic
- Steel → Metal
- Ghost → Spectral

**Type fusions (two → one):**
- Grass + Bug → Nature
- Rock + Ground → Earth

**Rule change:** Fighting moves from post-game (id ≥ 408) to pre-408 available. CLAUDE.md post-408 restricted list shrinks to: Aether, Crystal, Primal. (Ghost is renamed Spectral; Fighting becomes general roster.)

Net type count: 21 → 19 (six renames + two fusions).

## Step plan (from handwritten note, 2026-05-21)

- [x] Setup: lock renames + fusions + Fighting rule-change (above).
- [~] **Step 1:** Suggest additional unique Lumoria-distinctive typings.
  - Round 1 (20 candidates) presented; user picked: Sonic (general), Vapor (general), Mineral (general), Toxin (general), Chrono (408+), Stellar (408+).
  - Round 2 (30 candidates) presented; user picks TBD.
  - Further rounds possible if user wants more candidates.
- [ ] **Step 2:** Create new type-effectiveness chart with surprise twists — needs approval before applying.
  - **Phase A (done 2026-05-21):** label rename in `js/data.js` only (A1 scope) — Water→Aquatic, Psychic→Mental, Dragon→Draconic, Steel→Metal, Ghost→Spectral. 519 line changes; verified zero bareword stragglers.
  - **Phase B (done 2026-05-21):** Grass+Bug→Nature and Rock+Ground→Earth fusions applied. Per-row B1/B2/custom decisions collected via 4 interactive sub-phases. TYPE_CHART rebuilt as 19-type structure; `type:"X"` fields in MOVES_DATA and `types:[...]` arrays in MONSTERS_DATA relabeled; 6 dual-fused Lumori auto-collapsed to mono (#192 Boulderoll, #249 Boulderax, #250 Megalith, #327 Quarrex → mono Earth; #265 Mosswing, #331 Thornmoth → mono Nature) — **flagged for Step 4 review** to optionally re-dual with a lore-justified second type. Move display names like "Bug Bite"/"Rock Slide" deliberately untouched (Step 3). Area descriptions referencing old types untouched (Step 4 cleanup).
  - **Phase C (done 2026-05-21):** added 7 new types (Sonic, Vapor, Mineral, Toxin, Chrono, Stellar, Dream) — each with full attacking row + defending column designed interactively per-cell. Chart now 26 types (19 + 7); locked Phase D twists baked in (Sonic 2× vs Crystal/Mineral, Dream 2× vs Spectral, Toxin 0× vs Metal, Stellar 2× vs Aether). JS syntax validated. `type:` field in MOVES_DATA and `types:[]` arrays in MONSTERS_DATA do not yet use the new types — Lumori retypes to use new typings happens in Step 4.
  - **Phase D (done 2026-05-21):** surprise twists applied. Locked Phase D twists baked into Phase C: Sonic 2× vs Crystal+Mineral, Dream 2× vs Spectral, Toxin 0× vs Metal, Stellar 2× vs Aether. Phase D twist #1: Aether 2× vs Spectral (committed 9c3ca3b). Bulk user tweaks from handwritten notes: 54 cell edits across Fire/Aquatic/Nature/Electric/Wind/Ice/Dark/Fairy/Metal/Poison/Mental/Draconic/Normal/Spectral/Fighting/Aether (Primal repositioned as major pivot type — many types now 2× weak to Primal). Plus 1 conservative balance fix: Sonic→Mental 2 → 1 (dialed back Mental's fragility from 10 to 9 weaknesses). **Dropped:** Chrono super-defensive resistance (per earlier session).
  - **Phase E (done 2026-05-21):** strength audit complete. 13 types read as balanced (4-7/4-7/4-7 profile). Outliers Chrono/Stellar/Dream/Spectral/Normal all narratively-justified. Mental had 10 weaknesses initially → dialed down via three twists (Sonic→Mental:2→1, Ice→Mental:2→1, Crystal→Mental:1→0.5), landing at 8 weaknesses + 4 resists — still fragile but acceptable. Chart deemed shippable.
- [ ] **Step 3:** Adjust moves + move names to reflect typing changes.
- [x] **Step 4 (flag-only, 2026-05-24):** Pre-408 rule violations = 0 (Phase A/B/C/D + PR #49 already migrated cleanly). Per-Lumori retypes deferred to the upcoming lore/description → typing audit; this step instead places inline `LORE-AUDIT FLAG (Step 4)` comments on 46 entries so the audit catches them. See "Step 4 deferred — lore audit follow-ups" below.
- [ ] **Step 5 (merged with upcoming lore/desc/archetype audit, 2026-05-24):** The type-combo cap re-analysis under the new 26-type chart no longer runs as a separate pass. Instead, it happens **per-Lumori inside the lore/desc/archetype audit**: once each Lumori's lore + desc + archetype is locked, the cap-tally check happens at that point and the type may be adjusted in the same approval. See "🕯 Per-Lumori lore + desc + archetype + cap audit (UNIFIED)" below for the workflow, and "🧪 Type-combination audit" below that for cap rules + counting rules (still authoritative).

## Step 4 deferred — lore audit follow-ups (added 2026-05-24)

Inline `LORE-AUDIT FLAG (Step 4)` comments placed above 46 Lumori entries in `js/data.js`. The future lore/description → typing audit must address each. Grep `LORE-AUDIT FLAG (Step 4)` to locate.

- **29 forgotten Lumori (id ≥ 408) missing a 408+-only type** — Aether/Crystal/Primal/Chrono/Stellar are reserved for 408+ but currently used by only 10/39 forgotten. Notably **Chrono and Stellar have 0 dex-wide usage**. IDs: 409, 411-421, 424-426, 428, 430-434, 436-438, 440, 442-443, 445-446.
- **6 auto-collapsed mono (Phase B)** — possibly re-dual with a lore-justified 2nd type, or keep mono if lore supports: 192 Boulderoll, 249 Boulderax, 250 Megalith, 265 Mosswing, 327 Quarrex, 331 Thornmoth.
- **11 PR #49 forced retypes** — 9 lost Ghost (now renamed Spectral, available pre-408); audit may restore Spectral on lore-fit names like "Wraith*"/"Willowisp". 2 lost Crystal (still 408+-restricted, stay as-is): 55, 152, 322, 342, 344, 362, 368, 373, 386, 397, 399.
- **7 currently-unused pre-408 types** — Sonic, Vapor, Mineral, Toxin, Dream, Fighting, Spectral. Pre-408 usage count = 0 for each. Audit should distribute these onto lore-fit Lumori during the typing pass. (Not tied to specific ids — no inline flag.)
  - **2026-05-30 update (PR #54 + #55):** all 7 now have meaningful pre-408 representation. Battle-side via PR #54 `STATUS_REGISTRY` immunity rules (Sonic-immune to Smothered/Sluggish/Tinnitus-style, Vapor-immune to Drenched/Soaked, Mineral-immune to Petrify/Statue/Muted/Deafen, Toxin-immune to Tainted/Necrosis/Plague, Spectral-immune to Bleed/Severe Bleed/Faded/Hexed/multiple others, Fighting general-roster, Dream featured in offense-amp combos and evolved Type-Shattered mechanics). Dex-side via PR #55 over-cap audit retypes landed concrete examples (Fighting/Toxin for cactus-warrior cluster, Electric/Draconic for Gustpuff family, plus Mineral and Sonic and Spectral retypes via multi-cluster trim). Re-tally with `scripts/oversaturated_combos.py` to confirm pre-408 usage > 0 for all 7.

## Notes

- The existing `🧪 Type-combination audit` section's "Cap rules & progress" subsection (tentative-flagship draft) is superseded by Step 5 and will be rewritten after Step 5 completes.
- **Step 4/5 process rule:** when proposing per-Lumori typing adjustments, ground each recommendation in the Lumori's existing lore/desc so the new typing makes narrative sense.
- Branch: `claude/typing-combo-audit-2-JUGMH` (PR #51 — re-titled + re-described to reflect new scope on next commit).

# 🕯 Per-Lumori lore + desc + archetype + cap audit (UNIFIED) — added 2026-05-24  `[⏳ NOT STARTED — the next major phase; scoping Qs open + diversity-matrix findings queued]`

Single per-Lumori audit pass that merges what were previously four separate workflows:
- Step 5 of the typing-system overhaul (type-combo cap re-analysis under the new 26-type chart)
- 🧪 Type-combination audit (below — kept for cap rules + counting rules reference only)
- 🔍 Solo desc/lore/emoji consistency audit (line ~202)
- 🐺 Archetype oversaturation — common animals (line ~476)

## Why merge

Doing these as separate passes meant a Lumori could be re-typed for cap reasons, then re-archetyped for trim reasons, then re-lore'd for consistency — three touches and three reviews. Merging means one decision per Lumori: lock the lore + desc + archetype + types together, in one approval, in one commit batch.

## Per-Lumori workflow

For each Lumori (walking the dex in some order TBD):
1. **Read** current `name`, `types`, `desc`, `lore`, `emoji`, and any inline `LORE-AUDIT FLAG` comment.
2. **Audit lore/desc/emoji consistency** — surface emoji-vs-body mismatches, desc-vs-lore contradictions, name leaks, stat-vs-body conflicts (flag-only for stats; full stat pass is later).
3. **Decide archetype** — confirm or change body plan; if change, follow the cap rules from `🐺 Archetype oversaturation`.
4. **Decide typing** — confirm or change types; if change, run cap tally under new 26-type chart + cap rules in `🧪 Type-combination audit`.
5. **Resolve any `LORE-AUDIT FLAG (Step 4)`** comment on this entry (29 forgotten + 6 auto-collapsed + 11 PR #49 — remove flag once addressed).
6. **Propose** the full change set in writing — present a table row with before/after. Wait for approval.
7. **Apply** + `node --check js/data.js` + commit (batch multiple Lumori per commit at user's discretion).

## Cap-tally tracking

After each batch of approvals, re-tally the dex-wide type-combo counts to confirm no batch lands the same combo into a new over-cap state. Use the script pattern from `scripts/full_collision_check.py` / `scripts/full_analysis.py`.

## Cross-references

- **Cap rules + counting rules:** see `🧪 Type-combination audit` § Cap rules & progress (line ~446). The flagship-typing list there is **stale** under the new 26-type chart — re-decide flagship combos during this audit.
- **Archetype caps + mythical exemptions:** see `🦄 Creature inventory + mythological exemptions` (line ~225) and `🐺 Archetype oversaturation` (line ~476).
- **The 46 inline flags** from Step 4 (ids listed in `## Step 4 deferred — lore audit follow-ups` above) are the highest-priority entries to address.
- **7 currently-unused pre-408 types** (Sonic/Vapor/Mineral/Toxin/Dream/Fighting/Spectral) — distribute during this pass where lore fits.

## Pre-surfaced findings (from the archetype × type-combo diversity matrix, 2026-06)

Reference doc: `docs/archetype-diversity-matrix.md` (291 families; archetype tokens are anchor-noun-derived and **must be cross-checked against each Lumori's `desc`/`lore`** during the walk — several flagged "collisions" turned out to be false positives once body-plan was verified). Surface these when the relevant Lumori come up:

- [ ] **Genuine archetype × type-combo collisions to resolve** (cap-verified safe; resolve by pivoting one family's typing to an empty cell, ≤6 non-flagship / ≤12 flagship):
  - **canine × Dark** — Nightwolf (#118-120) vs Darkfang (#266-268). Proposed: pivot **Darkfang apex (#268) → Dark/Spectral** (lore: "howl resonates across dimensions / heard in the land of the dead"); Dark/Spectral 4→5 species. + Spectral-STAB learnset swap.
  - **cat × Fire/Dark** — Emberveil (#301) vs Cinderpaw (#307). Proposed: pivot **Emberveil → Fire/Spectral** (lore: "fire **specter**... phantom footprints"); Fire/Spectral 1→2. + Spectral-STAB swap.
- [ ] **desc↔lore body-plan inconsistencies to reconcile** (found via the matrix + the data-integrity sweep; pick one side per Lumori):
  - **#84 Electrix** — desc "electric **beetle**" vs lore "**dragonfly nymph**" (stale desc; the BREAKING #84-86 reframe made this a dragonfly line — desc likely just needs updating to dragonfly nymph).
  - **#243 Stuntrap** — desc "beetle warrior" vs lore "moulted into an elongated **dragonfly** form". (desc=beetle differentiates it from Galvaglide's dragonfly line — likely the intent.)
  - **#265 Mosswing** — desc "mossy **grasshopper**" vs lore "resembling a **moth**". (grasshopper avoids a lepidopteran×Nature collision with Thornmoth #331.)
  - **#316 Abyssovex** — desc "The Legendary Abyss **Drake**" vs lore "enormous deep-sea **squid** leviathan". Pick one (squid matches the cephalopod body in lore).
  - *(#18 Bahamber, #233 Serpenthorn flagged by the heuristic but are valid serpent-dragons — no action.)*

## Open scoping questions (to decide before starting)

- [ ] Walk order: by id ascending? by archetype cluster? by flagged-first (the 46) then rest?
- [ ] Batch size: 1 Lumori per approval (slow but safe) or N per approval (faster, table-based)?
- [ ] Flagship typing list (4 combos pre-overhaul, stale) — re-decide before or during the walk?

# 🧪 Type-combination audit — REFERENCE ONLY (workflow merged into 🕯 UNIFIED AUDIT)  `[✅ over-cap retypes DONE (PRs #50/#55); now 📎 REFERENCE for cap rules]`

Workflow merged into the per-Lumori UNIFIED audit (Step 4). Cap-tally checks happen per-Lumori at the moment each Lumori's lore + desc + archetype is finalized. The cap rules + counting rules + progress state below remain authoritative reference.

## Cap rules & counting (updated 2026-05-30 — see commit history for full context)

**Counting rule (ID-tally — current):**
- For each type combo, count **every Lumori in the dex** whose `types` array matches that combo, regardless of evolution stage. All pre-stages, mid-stages, finals, and standalones count.
- A pre-stage with a *different* `types` array counts for its own combo, not the final's. Example: Mindpuff (mono Mental) → Recallum (mono Mental) → Psytheon (Mental/Fairy): Mental/Fairy gets **1 ID** (just Psytheon), mono Mental gets **+2** from the pre-stages.
- Two-stage chains where both members share the same combo contribute 2 IDs (e.g. Crumblite + Stonegrip both Earth/Metal = 2 IDs in Earth/Metal).

*Earlier "family + standalone" tally rule from prior sessions has been superseded by ID-tally — see commit history.*

**Cap rules (user-decided):**
- **Ordinary dual combos:** soft cap of **6 IDs**
- **Flagship dual combos:** soft cap of **12 IDs** (double ordinary)
- **All mono-type combos:** automatic flagship status (12-ID cap)
- **Forgotten range (id ≥ 408):** included in cap (no exemption)
- **Soft-cap policy:** Caps are guidelines, not hard limits. Drift above cap is acceptable when justified by all of:
  1. All combo members have intrinsic lore-fit (no comparable pre-408 alternative typing)
  2. The combo is not defensively broken-strong (avoid immunity-stacking)
  3. Drift is per-Lumori justified, not blanket

**Flagship designation:** Implicit for monos. For duals, flagship is per-cluster on case-by-case basis — surfaced during the per-combo audit when warranted. Stale tentative list ("Fairy/Psychic, Dragon/Fire, Dragon/Psychic, mono Normal" from PR #50) no longer applies — the new ID-tally + soft-cap framework supersedes it.

**Progress state (under ID-tally as of 2026-05-30):**
- Pre-408 dex: **407 Lumori across 113 occupied type combos** (out of 351 possible, 121 pre-408-eligible duals still pristine).
- **Distribution:** 21 combos at 1 ID, 22 at 2, 25 at 3, 12 at 4, 12 at 5, 5 at 6, 12 at 7-8, 2 at 9-10, 2 at 11+.
- **Over ordinary cap (7+ IDs):** 14 dual combos + 5 monos (monos auto-flagship-OK).
- Dual over-cap dual combos to address: Electric/Nature (9), Draconic/Earth (8), Fairy/Nature (8), Nature/Poison (8), Aquatic/Earth (7), Aquatic/Ice (7), Dark/Metal (7), Earth/Nature (7).

**Process notes:**
- Run a fresh ID-tally before each cluster decision so retype impact is accurate.
- Validate combo counts post-batch — a retype that lands in another over-cap combo doesn't help.
- Commit per batch, present full table for user approval before next batch.

## Accepted cap-drift exceptions (re-evaluated 2026-05-30 under ID-tally)

Under the updated ID-tally + 6/12 soft-cap rules, **most prior drift exceptions auto-resolved** (combos that were "over" under family-tally are now within ordinary 6-ID cap). The few that remain over and need either further trim or formal drift acceptance:

- **Nature/Poison: 8 IDs (+2 over).** Voidgarden was added during the Dark/Fairy trim as best-fit (corrupted poisonous garden). Original cluster trim left 2F+2S=4 entries family-tally = 8 IDs because the Tendrilisk and Plaguefly chains both pre-stage in Nature/Poison. **Still over under new tally — pending re-evaluation in the redo pass.**
- **Draconic/Earth: 8 IDs (+2 over).** Bahamber line ("forged the first volcanoes") added during Draconic/Fire trim. Both Searburn and Bahamber count under ID-tally. **Pending re-evaluation.**
- **Fairy/Nature: 8 IDs (+2 over).** Garlawarden/Faevernal/Arachnalis chains all multi-stage with shared typing. Locked-in starter (Garlawarden) plus apex spring-fairy (Faevernal) plus unique spider-fairy (Arachnalis). **Pending re-evaluation in the redo pass.**

**Auto-resolved under ID-tally (no longer drifts):** Mental/Spectral (4 IDs ✓), Mental/Fairy (5 ✓), Aquatic/Dark (2 ✓), Mental/Draconic (5 ✓), Draconic/Mineral (2 ✓).

### New drifts surfaced under ID-tally:

- **mono Nature: 14 IDs (+2 over flagship cap 12).** Largest plant-creature category in the dex. Members are all genuinely plant/fungus/insect-aligned: Verdkin + Barknell (Nature starter pre-stages), Germix→Verdurus, Photoworm→Chrysalix, Viridix, Sporix→Myceloth (former Nature/Poison pre-stages moved during ID-tally redo), Sproutix (former Fairy/Nature pre-stage moved during ID-tally redo), Leafhorn (moved during Fairy/Nature trim), Mosswing, Verdovast, Thornmoth. Drift accepted under soft-cap rule — peer cohesion is genuine, no forced inclusions, +2 over flagship is minimal.

## Starter triad — RESOLVED (2026-05-31, type-triangle effectiveness analysis)

All 3 starter-line FINAL evolutions are now locked. Triangle rebalanced from
score 14.00 (near-broken) → 2.00 (clean 2:1 ratios in each matchup) via the
Banksnout adjustment.

- ~~**#3 Calderaeth** (Fire starter)~~ — **LOCKED Fire/Draconic** (kept current; dragon-fox lore intact).
- ~~**#6 Banksnout** (Aquatic starter)~~ — **LOCKED Aquatic/Dark** (changed from Aquatic/Earth; the type-triangle analysis identified Aquatic/Dark as best balance + lore-honest; existing predator-ambush body language was already Dark-adjacent, minor lore touch added "dusk and dawn" + "silent stalk" hooks).
- ~~**#9 Garlawarden** (Nature starter)~~ — **LOCKED Nature/Fairy** (locked during Fairy/Nature cluster trim).

Final triad: **Fire/Draconic + Aquatic/Dark + Nature/Fairy.** All 3 matchups are clean 2:1 ratios; no more 4x/0.25x extremes.

# 🐺 Archetype oversaturation — REFERENCE TALLIES (workflow merged into 🕯 UNIFIED AUDIT)  `[📎 REFERENCE tallies]`

Per-archetype trim decisions happen per-Lumori inside the UNIFIED audit (Step 3 "Decide archetype"). The cap rules + current family counts below remain authoritative reference.

**Common-animal cap = 3 families per archetype.** Current counts of over-cap archetypes:

- **wolf** — 5 families (Hexaprowl, Eclipsehound, Shadowpup, Voltfang, Cryvorn). Over cap by 2. *(Mirkling line → bipedal warden via Voidwarden #405-407; Morraveth line → leshy #78-80.)*
- **lion / big-cat** — 6 families (Siroccomane, Dravanas, Ignitheon, Thundermane, Megavolt, Majesticore). Over cap by 3.
- **dog (non-wolf canine)** — 5 families (Dustkin, Goldefluff, Arenikin, Projectery, Galeaxis). Over cap by 2.
- **bear** — 3 families (Frigidvorn, Permavast, Rotunden). At cap. *(Verdurus → seed-pod #69-71; Cuddrix-line → kirin #286-288; Arcturex → owl #53-54.)*
- **bird-of-prey** — 5 families (Vortexathos, Swirlavel, Gelwing, Rimeclaw, Zephyrak). Over cap by 2.
- **golem (humanoid metal/stone)** — 10+ families. Over cap.
- **crystalline / gem creature** — 8 families. Over cap.
- **rock-monolith / standing-stone** — 5 families. Over cap by 2.

## Elementals (cap = 1 family + 1 standalone per element)

One per type, 19 elementals total (all 21 types except Fighting and Primal). An "elemental" is a formless being literally made of an element. Each cap = 1 family + 1 standalone.

- **wind-elemental** — 1 family (Pneumathos line #116-117 "swirling pillar of concentrated air with humanoid core"). At cap.
- *(Other 18 elemental archetypes — tallies pending; surface during UNIFIED audit.)*

## Natural-disaster-inspired (cap = 1 family + 1 standalone per disaster subtype)

Umbrella archetype with per-disaster subtypes (thunderstorm, tornado, tsunami, wildfire, earthquake, blizzard, eruption, flood, etc.). A natural-disaster-inspired creature is shaped like / themed after the disaster regardless of element. Each subtype cap = 1 family + 1 standalone.

- **thunderstorm** — 3 families (Vortexwing #370, Tempestborn #380, Nullstorm #393 — all formless lightning-vortex with electromagnetic nucleus). Cap 1+1. Over cap by 1-2. Tempestborn explicitly "tracked as both a storm and a living creature" — strongest disaster framing, prime keep candidate.
- *(Other disaster subtypes — tallies pending; surface during UNIFIED audit.)*

*(Wraithstorm #386 reclassified out of storm group → wraith archetype: "translucent humanoid wraith inside lightning bolts". Galeaxis/Vortexathos/Stormcrown stay in their animal archetypes.)*

# 📉 Standalone count reduction — RUN BEFORE the renaming queue resumes  `[⏳ NOT STARTED]`

**Current state:** 269 families total — **118 multi-stage + 151 single-stage**. Solo ratio is **56.1%** which is high; most established Pokémon-style dexes target 60-70% multi-stage families. Goal: significantly reduce the solo count by absorbing many standalone mons into multi-stage evolution chains, or by retiring/merging redundant solos.

## Approach

- [ ] **Inventory the 151 solos.** Group by archetype (cross-reference the creature inventory above) and by typing combo. Surface any solos that visually/thematically match an existing multi-stage family (could become a 4th stage, mega/branch evolution, or starter-pre-stage).
- [ ] **Identify reduction targets.** For each over-represented archetype (lion, dog, bear, raptor, golem, etc.) and each over-cap typing combo, find which solos could be absorbed into existing chains as new stages or branches, vs. which solos are unique-mythical (exempt-list) and should remain standalone.
- [ ] **Define merger candidates.** Pair a solo with an existing chain (e.g. an unattached lion-coded solo could be retitled as a branched evolution of an existing felid line). Decide stage placement (pre-evolution, mid, late-evolution, mega/awakened form).
- [ ] **Identify retirement candidates.** Some solos may be redundant in role/typing/archetype with existing families and could be dropped from the dex entirely (or repurposed as variants).
- [ ] **Target ratio.** Aim for ~70-75 solos remaining (down from 151), with the remainder absorbed/retired. Approximate target: 75 multi-stage + 70 solo = ~145 families, more comparable to mainline Pokémon density.
- [ ] **Output:** a merger plan with **(a)** solos to absorb (with target chain + stage placement), **(b)** solos to retire (with replacement coverage if needed), **(c)** solos kept standalone (mythical-exempt or unique-niche).

**Run order:** after BREAKING + MINOR + creature inventory + 🕯 UNIFIED audit (which now contains the merged solo desc/lore + typing + archetype-trim workflow), **but before the renaming queue resumes** — because consolidating solos into chains affects names (new evolution-name relationships) and the rename pass should work on the post-consolidation roster.

# 🎯 Per-archetype typing-combo diversity audit — RUN BEFORE STAT REVIEW  `[🚧 PARTIAL — prelim matrix done (PR #63, docs/archetype-diversity-matrix.md); full pass folded into 🕯 UNIFIED]`

**Goal: max 1 family per archetype × typing-combo cell.** No two families that share an archetype (otter, lion, owl, beetle, tree-elemental, etc.) should also share the same typing combo. Different combos within the same archetype are fine (e.g. one Ground/Electric rhino + one Steel/Rock rhino is OK, but two Ground/Rock rhinos is not).

This is distinct from:
- The earlier **type-combination audit** (counts combos across the dex regardless of archetype)
- The **archetype oversaturation** trim (caps total families per archetype at 3)

This audit specifically catches the cross-product: same creature **and** same typing.

## How to run

- [ ] For every family (multi-stage and single-stage), assign a **primary archetype** (otter, owl, snail, lion, dragon, etc.) — use lore body-plan keywords as starting point, with manual review for ambiguity.
- [ ] Build the matrix `[archetype] × [type-combo]` and tally families per cell.
- [ ] List every cell with **≥2 families** as a violation.
- [ ] For each violation, pick which family changes typing. Prefer keeping the typing on the family that names/anchors the archetype most strongly; reassign the others to currently-empty cells under that archetype.
- [ ] Verify each reassignment doesn't create a new collision elsewhere (especially in over-cap general typing combos from the type-combination audit).
- [ ] Dragon archetype is **mythical** — flagged for separate end-of-task discussion before any consolidation. Skip during this audit.

## Known collisions at time of writing (re-verify when this runs)

**Introduced by recent BREAKING fixes:**
- pinniped × Ice+Water — #44 Cryonik/Boreon/Nagislither + #46 Frostmere
- titan/colossus × Steel+Water — #38 Coralossus/Titanariel + #41 Titanomare

**Pre-existing (sample; not exhaustive):**
- humanoid × Fairy+Psychic (4 families)
- crab/lobster × Rock+Water (3)
- humanoid × Ground+Steel (3)
- bat × Dark+Wind (2)
- beetle × Bug+Electric (2)
- butterfly/moth × Bug+Poison (2)
- crystalline-prism × Psychic+Rock (2)
- dragonfly × Bug+Electric (2)
- fairy-sprite × Dark+Fairy (2)
- fairy-sprite × Fairy+Psychic (2)
- humanoid × Ice+Steel (2)
- humanoid × Psychic+Wind (2)
- shadow/wraith × Dark+Ghost (2)
- wolf × Dark (2)
- (plus 9 dragon-archetype cells deferred as mythical)

**Run order:** BREAKING fixes → MINOR fixes → type-combination audit → archetype trim → renaming queue → **per-archetype typing-combo diversity audit (this section)** → stat spread review (last).

## Per-proposal hook

For every BREAKING/MINOR proposal going forward, include a **same-archetype peer typings** section so we catch new collisions before they go in. Format: list other families with the same archetype and their typing combos, flag any cell-collision the proposal would create.

# 🎲 Encounter rate audit — RUN AFTER over-cap audit completes  `[✅ DONE — PR #58]`

After the over-cap pre-408 type-combo audit lands (PR #55, branch `claude/lumoria-overcap-audit-2kkDV`), walk every encounter zone in `js/data.js` and audit `rate:` distributions.

- [x] Verify every zone's `wildMonsters[].rate` values sum to 100. *(all 90 non-empty base zones now sum to 100; 31 drifted zones fixed — PR #58)*
- [x] Check rates against BST tiers — weaker mons should be more common (higher rate), stronger/rarer mons less common. Some zones currently have arbitrary uniform rates ignoring BST gaps. *(65 BST-inversion zones rebalanced to monotonic weakest→strongest curve via Spirit-Canyon 35/30/25/10 templates; pinned rares preserved; endgame mega-zones scaled to 100 keeping curve. PR #58)*
- [x] **Route 8 — Sky Corridors specifically:** Silvergust (BST 308), Swirlavel (485), Drakorius (521), Sapphier (537) all at or near rate 25 despite 230-BST spread. Doesn't follow a clean weakest-to-strongest curve. Rebalance using the Spirit Canyon pattern (35/30/25/10 weakest-to-strongest) or similar, while preserving Cranivade's rate 3 from the over-cap retype. *(→ 34/29/24/10, Cranivade pinned at 3. PR #58)*
- [x] Stale encounter-table comments: Spirit Canyon and Route 8 cleaned inline during the Cranivade retype, but the rest of the dex likely has more stale names (pattern: old rename targets — e.g. "Psyshade" was an earlier name for Cranivade). Sweep with `grep` against current `MONSTERS_DATA[id].name`. *(214 stale name comments fixed across base wildMonsters tables. NG+ `ngPlusWildMonsters` overlays audited separately — freshly authored, correctly named, left as-is. PR #58)*

**Run order:** after 🕯 UNIFIED audit / over-cap PR lands, before stat spread review. ✅ **DONE — PR #58.**

# 🎯 Lumori obtainability audit — RUN AFTER over-cap audit completes  `[✅ DONE — PR #62, 474/500 verified]`

After the over-cap pre-408 type-combo audit lands (PR #55, branch `claude/lumoria-overcap-audit-2kkDV`), walk every Lumori in `MONSTERS_DATA` and verify each has at least one obtainability path. Acceptable paths: wild area encounter, NG+ rotation, one-off static encounter, quest reward, in-game trade, evolution from another obtainable Lumori, special event, etc.

- [x] Cross-reference every `MONSTERS_DATA[id]` against:
  - All `wildMonsters[]` and `ngPlusWildMonsters[]` arrays in `WORLD_DATA`
  - All `legendaryEncounter`, story-encounter, quest-reward references
  - Evolution chain (`evolveTo` from another obtainable Lumori)
  *(Built full obtainability graph: starters + all wild/NG+ encounters + 13 legendaryEncounters + 13 Forgotten wielder-team[0] legendaries, closed over evolveTo/evolveAlt. Result: **474/500 obtainable**, matching the 500-dex placement pass. PR for this audit.)*
- [x] Flag any Lumori with zero obtainability paths. Decide for each:
  - Add to a suitable wild area or static encounter
  - Designate as quest-only and add the quest
  - Confirm intentionally unobtainable (only valid for the **26 Forgotten Lumori** explicitly designated as such — verify against the canonical list)
  *(**0 real gaps.** The 26 unobtainable = exactly the encounter-only Forgotten (wielder team[1]/team[2]); verified they carry `uncatchable:true` and have no encounter/evo path.)*
- [x] **Known cases from over-cap audit:**
  - #362 Lunaspectre — has no encounter entries dex-wide (surfaced during Dark/Mental retype). Needs assignment. *(RESOLVED — now obtainable via the Starbloom NG+ overlay.)*
- [x] **Latent data-hygiene fixes (found during this audit):** the 13 catchable Forgotten (wielder team[0]) had `catchRate:0` (only "worked" via the `(catchRate || 45)` fallback) and a misleading `uncatchable:true`. → set them to legendary `catchRate:3` and removed `uncatchable:true`; the 26 encounter-only Forgotten keep both. `uncatchable` is otherwise unused by code (display gating uses `foreignRegion`).

**Run order:** after 🕯 UNIFIED audit / over-cap PR lands, parallel with 🎲 Encounter rate audit, before stat spread review. ✅ **DONE.**

# 💡 Concept parking — future family ideas to use later  `[📎 PARKING — not a task]`

- **"Whirlpool of light" — Water/Psychic family.** The original Aurarael flavor (a flowing psychic entity that resembles a whirlpool of blue-violet light given form, no solid body, continuously cycling vortex, inhabits locations of high psychic resonance, absorbs ambient thought energy) is being preserved here. Reuse for a new Water/Psychic family — possibly a deep-ocean meditation-shrine guardian, or a tidal-current spirit. Keep in mind during the renaming/typing pass.
- **"Fairy-dragon" — Water/Fairy or Dragon/Fairy family.** The original Thalassira flavor (a grand aquatic fairy-dragon 5 metres long, combining the sinuous body of a sea serpent with translucent fairy wings that function as fins, iridescent ocean-blue and silver scales, guarding hidden underwater groves where rare magical plants grow undisturbed) is being preserved here. Reuse for a new family — possibly a flagship legendary fairy-dragon line, or as the final stage of a new aquatic dragon family during the renaming pass.
- **"Nautilus metallic humanoid" — Water/Steel family.** The original Titanariel flavor (a 7-metre armoured sea-titan resembling a colossal nautilus with steel-hard shell and metallic-plated tentacles, propelled by high-pressure water jets, capsizing ships by wrapping tentacles around the hull) is being preserved. User specifically liked the **nautilus metallic humanoid** read — likely intent is a humanoid creature with a nautilus-shell carapace and metal-plated tentacle-arms (rather than a pure mollusk). Reuse for a new Water/Steel family — possibly a flagship deep-sea armored legendary or final stage of a new aquatic mollusk-knight line.

# 🔮 Mythical/rare archetype flags — END-OF-TASK USER DISCUSSION  `[⏳ NOT STARTED — end-of-task discussion]`

Per user instruction: leave these for late discussion before any consolidation.

- [ ] **dragon (true dragon)** — 20+ families. Massive over-saturation. Discuss approach.
- [ ] **ghost / wraith / spectral** — 7+ families.
- [ ] **void / cosmic / abstract** — 8+ families.
- [ ] **storm-elemental / lightning-vortex** — 5+ families.
- [ ] **humanoid (non-armoured elemental)** — 6+ families.
- [ ] **phoenix / solar-bird** — 3-4 families (borderline).

# 🏷️ Luminex Renaming + Final Lore/Description Adjustments/Audit  `[⏳ PARTIAL/PAUSED — some renames applied (PRs #34–35); full final pass runs after 🕯 UNIFIED]`

**Working branch:** `claude/complete-task-FkreZ` (PR: https://github.com/casimbahadar/Lumoria/pull/35 — draft)

**Source of truth:** `js/data.js` (`MONSTERS_DATA` block, ~line 828 to end)

**Reference docs:**
- `rename_lumori.md` — naming rules, cap-2 suffix/prefix avoid lists, midfix rule
- `scripts/analyze_current.py` — cap-2 validator (run after every rename to confirm no new flags)
- `scripts/queue_with_pinned.py` — `PINNED_IDS` set for "already-decided" mons (skip during walkthrough)

## Workflow rules

1. Walking ids 7-446 sequentially. **Skip any id in `PINNED_IDS`** (those are already decided).
2. For each id: present current name, types, emoji, lore summary, flag status, and a recommendation. **Wait for user "keep" or rename instruction before moving on.**
3. After each rename: validate via `python3 scripts/analyze_current.py` (Total flagged should not increase). Add the new id to `PINNED_IDS`. Commit + push.
4. When the user provides new lore details, update `desc` and `lore` fields. The `lore` opener should reference the new name, not the old one.
5. Defer mythical/rare archetype oversaturation (dragon/void/ghost/etc.) for end-of-task discussion.

## Current pinned (already-decided) IDs

`{3, 4, 5, 6, 9, 10, 11, 12, 17, 18, 22, 33, 39, 44, 47, 50, 86, 92, 100, 103, 108, 118, 119, 120, 121, 122, 125, 126, 128, 132, 136, 137, 141, 147, 148, 149, 153, 154, 158, 159, 160, 165, 166, 175, 176, 177, 180, 181, 185, 186, 189, 191, 192, 197, 200, 202, 217, 223, 225, 229, 240, 242, 243, 255, 256, 262, 263, 264}`

## Recently confirmed in this branch

- [x] **#3** Ignaraeth → **Calderaeth** (Fire/Dragon)
- [x] **#4** Aquilin → **Aquatter** (Water; otter starter)
- [x] **#5** Nerilis → **Cobaleap** (Water; needs lore body-plan fix — see BREAKING below)
- [x] **#6** Pelagroth → **Banksnout** (Water/Ground; full retype + lore + Ground learnset for amphibious otter)
- [x] **#9** Floraith → **Garlawarden** (Grass/Fairy; lore refit to bark-armored reptile)
- [x] **#11** Helioveth → **Heliocoon** (Fire/Wind; chrysalis lore, defensive stats, 🥚 emoji)
- [x] **#12** Inferarch (kept name, retyped Fire/Dragon → Fire/Wind, butterfly lore + 🦋 emoji + 5 dragon moves swapped for Wind/Bug)

# 🎯 Moveset utilization audit — RUN BEFORE stat spread review  `[🚧 IN PROGRESS — PR #68, branch claude/move-utilization-audit-2kkDV]`

For each of the 26 types, calculate the ratio of moves actually assigned to at least one Lumori vs total move count of that type. Identify **orphan moves** (0 current learners — many such moves exist; Fire alone has 13+ orphans like Lava Plume, Cinder Lance, Smolder Trap, Eruption, Will-O-Wisp, etc.). For each orphan: decide whether to (a) **assign** to specific Lumori via learnset additions, (b) **promote** to `rarity:"exclusive"` and earmark for a future legendary, or (c) **remove** from MOVES_DATA as dead code. Also identify **near-orphan moves** (1-2 learners) and decide if those moves are intentionally signature/exclusive (mark them) or should have wider distribution. Goal: every move in MOVES_DATA serves a clear purpose, and no Lumori is missing access to type-appropriate moves it should reasonably have.

## Discovery + batching

Discovery script: `scripts/move_utilization.py` — read-only stats tool, parses MOVES_DATA + every learnset + trainer-hardcoded moves:[]. Baseline report committed at `docs/move-utilization-report.md`.

**Baseline (2026-06-03):** 1093 moves / 26 types / **641 orphans (59%)** / 172 near-orphans / 41% used.

**Sharing rule (locked Batch 2):** any move (orphan or used) can be added to multiple Lumori; goal is each Lumori has a healthy STAB pool for its type(s).

**Grouped batch plan (8 batches):**
- [x] **Batch 1 — Stellar.** 16 assigned across 4 Stellar Lumori (4 each) + 17 newly `rarity:"exclusive"` (20 total reserved). 33 Chrono deferred to end of audit.
- [x] **Batch 2 — Aether + Vapor.** Aether: 19 generic orphans distributed across 4 Forgotten Aether Lumori (32 inserts, sharing); 3 stay exclusive. Vapor: 31 generic orphans distributed across 11 Vapor Lumori (53 orphan inserts + 5 used-pool top-ups on Umbrajest/Shadowveil = 58 inserts); 3 stay exclusive. Utilization Aether 21%→89%, Vapor 24%→93%.
- [x] **Batch 3 — Toxin, Crystal, Mineral, Primal.** 72 generic orphans cleared via ~80 learnset inserts across 47 Lumori. Toxin 22%→93%, Crystal 39%→94%, Mineral 33%→89%, Primal 48%→89%. 12 already-exclusive moves (3 per type) stay reserved.
- [x] **Batch 4 — Fire, Ice, Wind.** 73 generic orphans cleared via ~160 learnset inserts across 37 Lumori (sharing rule). Fire 47%→94%, Ice 43%→94%, Wind 45%→94%. 9 already-exclusive (3/type) stay reserved.
- [x] **Batch 5 — Earth, Nature.** 58 generic orphans cleared via ~120 learnset inserts across 28 Lumori. Earth 58%→96%, Nature 52%→96%. 6 already-exclusive (3/type) stay reserved.
- [x] **Batch 6 — Dark, Spectral, Dream.** 60 generic orphans cleared via ~130 learnset inserts across 39 Lumori. Dark 47%→94%, Spectral 52%→89%, Dream 29%→95%. 9 already-exclusive (3/type) stay reserved.
- [x] **Batch 7 — Electric, Metal, Mental.** 68 generic orphans cleared via ~155 learnset inserts across 41 Lumori. Electric 44%→93%, Metal 47%→94%, Mental 49%→94%. 9 already-exclusive (3/type) stay reserved.
- [x] **Batch 8 — Normal + Aquatic + Fairy + Draconic + Fighting + Poison + Sonic.** 125 generic orphans cleared via ~245 learnset inserts across 75+ Lumori. Normal 56%→93%, Aquatic 58%→**100%**, Fairy 37%→93%, Draconic 47%→94%, Fighting 33%→93%, Poison 47%→92%, Sonic 69%→92%. 17 already-exclusive stay reserved (Aquatic has 0 — that's why it hit 100%).
- [x] **Move-key rename pass.** 372 keys aligned to renamed display names (365 clean + 7 collision-disambiguated with `_2` suffix). Atomic apply via `scripts/move_key_rename_apply.py`. 0 dangling refs post-sweep.
- [x] **Phase 2: STAB-completeness audit.** 40 new moves added to thin types (Spectral/Mineral/Sonic +15/15/10) with unique mechanics (dualType, breakerVs, alwaysCrit, hits:2, priority, dual-stat combos). ~210 inserts across 6 sub-batches (P2-prep + P2-1 through P2-6). Flagged 163 → 6 (96% cleared). The 6 remaining are 5 deferred Stellar/Primal Lumori → revisit in the Forgotten Lumori audit (next section).
- [ ] End-of-audit revisit: Aether + Chrono post-game-restricted moves (any final tagging once Forgotten/Stellar/Aether/Chrono roster expands) — rolled into Forgotten Lumori audit below.

# 🌑 Forgotten Lumori dedicated audit — RUN BEFORE STAT-SPREAD REVIEW  `[⏳ NOT STARTED]`

The 39 Forgotten Lumori (ids 462-500) are gameplay-gated content designed as post-game encounters. Several open threads converge on them; a dedicated audit pass before the final stat-spread review is cleaner than handling each scattered.

- [ ] **Typing review** — 29 Forgotten still lack any 408+-restricted type (Aether/Crystal/Primal/Chrono/Stellar). Decide which Forgotten should carry the rare typings; rebalance the 5-type roster.
- [ ] **Moveset finalization** — apply the deferred Phase 2 STAB-completeness cases for Stellar/Primal Lumori (5 currently at 4/5 STAB: #319 Voidraxis, #384 Solarcrown, #394 Solarvast, #401 Cosmoveil, #400 Primordiax). Once typing review determines which Forgotten gain rare types, assign their moves; may un-reserve some Stellar/Aether/Chrono exclusives that are no longer needed in the pool.
- [ ] **Stat-spread (Forgotten subset)** — verify BST-720/750/800 tiers are internally consistent and stat distributions match each Lumori's role (legendary tank vs sweeper vs balanced). Runs as a focused subset before the dex-wide stat-spread review.
- [ ] **Archetype classification** — finish the manual classification pass for ~31 unclassified Forgotten families (deferred from the UNIFIED audit phase).
- [ ] **Lore audit** — resolve all inline `LORE-AUDIT FLAG (Step 4)` comments on Forgotten entries.
- [ ] **Variant content** — verify `js/variant-content.js` identity anchors for 462-500 are coherent post-typing-changes.
- [ ] **Abilities** — once the abilities feature is implemented, assign Forgotten-specific signature abilities (probably more impactful than regular Lumori).
- [ ] **13 wielder cutscenes** — already deferred in the NG+/Forgotten gating section; rolls into this audit naturally.

**Run order:** after Phase 2 STAB-completeness (done) → **Forgotten audit (this section)** → final stat-spread review (next section).

# 📊 Final-pass stat spread review — RUN LAST (after Forgotten audit complete)  `[⏳ NOT STARTED — RUN LAST]`

After every coherence fix, type adjustment, rename, AND the Forgotten Lumori dedicated audit is committed, do a final pass over **every Lumori's base stat spread** across the whole dex. This is the last content-balance item in the workflow.

- [ ] Walk every mon (or every family) and check the BST + stat distribution against:
  - Stage tier (base / mid / final) — BSTs should grow uniformly along an evolution chain
  - Body plan / role (fast hunter, tank, magical caster, balanced bruiser, glass cannon)
  - Cross-family parity (similar-tier mons should have similar BSTs)
  - Stat distribution coherence (e.g. high-Atk physical attackers have at least decent Spe; tanks have HP/Def synergy; SpA-leaning casters have SpD bulk)
- [ ] Flag any mon whose stats fight its body plan (e.g. a fast bird with Speed 30, a heavy tank with Def 40)
- [ ] Adjust to bring outliers in line, preserving overall power balance
- [ ] Re-verify trainer encounters / wild-area difficulty curves still feel correct after stat adjustments

**Run order:** BREAKING fixes → MINOR fixes → typing audit → archetype trim → renaming queue → **stat spread review (this section, last)**.

# 🧬 Abilities feature (or similar legal-safe name) — RUN AFTER STAT REVIEW  `[⏳ NOT STARTED]`

Add a per-Lumori passive-ability system. Feature name must avoid legal risk (Pokémon's "Abilities" trademark) — candidate alternates: Traits / Aptitudes / Quirks / Knacks / Innate / Talents (final naming TBD).

- [ ] Pick a non-infringing feature name
- [ ] Design system scope (ability-pool size, per-creature count, hidden-ability slot)
- [ ] Curate ability list (passive battle effects, stat modifiers, type resistances, weather triggers, etc.)
- [ ] Assign abilities per Lumori (cross-reference body-plan + archetype)
- [ ] Integrate into battle engine + UI (team detail, battle log)
- [ ] Migration logic for existing saves

# 🤝 Inter-Lumori interactions in lore/desc — RUN AFTER ABILITIES  `[⏳ NOT STARTED — note: bridge-lore sweep already done (PR #48); this is the dedicated interaction pass]`

Add cross-references between Lumori in lore/description text to give the world ecological depth — predator/prey, ancestral rivalries, symbioses, territorial competition, parasite/host relationships, item-stealing behaviours, etc.

**Reference examples (Pokémon, for shape only):**
- Seviper × Zangoose — ancestral rivalry called out in both species' Pokédex entries.
- Heracross × Pinsir — territorial competition for the same forest sap-trees.
- Tinkaton × Corviknight — Tinkaton hunts Corviknight to harvest its feathers into its hammer (active predation referenced in Tinkaton's entry).

**Lumoria approach:**
- [ ] Identify candidate groupings — pairs, trios, or larger ensembles (over-cap archetypes butting heads, opposing-type rivalries, shared-habitat competition, parasite/host, mimicry-target, item-source predation, etc.). Co-location is NOT required — Lumori travel widely and can plausibly meet anywhere across the world.
- [ ] Per grouping, decide which side(s) get the lore reference and what shape it takes (one-line behavioural reference vs. embedded ecological note).
- [ ] Draft + apply edits in batches (propose-and-approve per batch, batched commits).
- [ ] Audit for confusing circular references (avoid A→B→C→A loops unless thematically intentional).

# 🎮 NG+ / Forgotten gating separation — RUN BEFORE LUMINEX REORDER  `[✅ DONE — gating + legendary encounters (PR #53); only the 13 wielder cutscenes remain (deferred to after stat review)]`

`js/data.js` currently classifies ids 322-421 as NG+-exclusive and ids 408-446 as Forgotten Lumori, creating an unintended dual-classification at ids 408-421. **These two ranges must be separate.**

**Decision:**
- **NG+ range stops before 408.** NG+-available Lumori are ids 322-407 only.
- **Forgotten Lumori (ids 408-446) are NOT included in the NG+ available roster.** They do not spawn in NG+ encounter tables, even as rare encounters, until a separate condition is met.
- **Forgotten Lumori unlock** only after the player has completed the Forgotten Lumori quest line and a corresponding gameplay flag is set. Once unlocked, they appear in secret/late-game post-quest locations distinct from NG+ encounter zones.

**Implementation tasks:**
- [x] Update `js/data.js` NG+-EXCLUSIVE comment from "(IDs 322–421)" to "(IDs 322–407)". *(commit a925c4a)*
- [x] Verify no id in 408-446 appears in any NG+ encounter table, wild-spawn list, or trainer team reachable in standard NG+. *(audit confirmed 0 refs outside VAELDRIS_WIELDERS)*
- [x] Add a "forgotten_quests_complete" gameplay flag to save data (or repurpose an existing milestone flag if one fits). *(no new flag needed — derived from existing `defeatedWielders` via `isForgottenUnlocked()`; commit 787c872)*
- [x] Gate spawn-eligibility of ids 408-446 behind that flag — they appear only after the flag is set, in dedicated post-quest secret locations. *(scope narrowed: only the 13 BST-720 forgotten Lumori become catchable, via one-time legendary-style encounters; 26 BST-750/800 stay encounter-only via the wielder battles. Batch 4a)*
- [x] Design secret-location placements for the 39 Forgotten Lumori (which routes/areas they appear in post-flag). *(derived from existing `VAELDRIS_WIELDERS[w].location` — each wielder's location hosts that wielder's BST-720 Lumori; Batch 4a `getForgottenLegendaryForArea`)*
- [x] Audit any existing encounter tables / wild-spawn lists for accidental 408-446 entries reachable before flag. *(none — Batch 1 audit clean)*
- [x] Update README / player-facing documentation to mention NG+ ends at 407 and Forgotten quest is the gate to 408-446. *(Batch 5 — README Post-Game + NG+ sections updated with player-facing copy; no internal id numbers leaked)*

**Forgotten legendary cutscenes (deferred — run after stat-spread review):**
- [ ] Draft 13 hand-authored wielder cutscenes (one per BST-720 Forgotten Lumori) to replace the templated placeholder dialogue. Each cutscene should reference the wielder's `lumoriLore` / `vaeldrisLore` and the catchable Lumori's lore. Add as a new `forgottenLegendaryCutscene:["line1", "line2", ...]` field on each VAELDRIS_WIELDERS entry; `triggerForgottenLegendaryEncounter()` reads this field when present and falls back to the templated lines otherwise. Runs after `📊 Final-pass stat spread review` because some BST-720 stats may shift during stat balancing and the cutscenes can speak to the final stat identity.

This work should run BEFORE the Luminex reorder (renumber pass) so that the reorder respects the new NG+/Forgotten boundary at id 407/408.

# 🚀 Pre-launch features, assets, and release process  `[🚧 IN PROGRESS — launch plan draft (PR #52); most items pending]`

Higher-level work remaining beyond the lore / typing / stats audits.

- [ ] Check what each Lumori is creature wise so can make adjustments if needed.
- [ ] Analyze and adjust the UI/appearance of the game screens, etc as much as possible.
- [ ] Brainstorm and code in what different typings and differences in lore/description the Variants of each Lumori will be.
- [ ] Add sprites or models for each Lumori (variant and radiant also) from sources.
- [ ] Generate or find quality music for battles, map, online, other features and aspects.
- [x] **Multi-status battle system — ✅ DONE in PR #54 (commits 231859c → 002ce5d).** Summary: 47 statuses registered (6 existing + 19 TODO-named + 16 brainstorm-new + 3 dual-pool + 9 evolved-only), 12 evolution rules wired (3 from spec + 9 newly designed), multi-status stacking live (single-status guard removed), all sub-task flags functional (`target:single/wide/self`, `dualType`, `breakerVs`, `alwaysCrit`, compound `_and_` tag dispatcher, multi-effect via compound tags, `recharge`), multi-battle hooks active (wide-spread 0.75× modifier, Plague intra-team spread, Bonded ally-share), accuracy stages added as bonus deferral-close (`stages.acc`/`eva` + accup/accdown/accup2/accdown2/evup/evdown), 41 new `.status-*` CSS color classes, data-driven hooks for all persistent passive effects (statMod, incomingDmgMod, outgoingPowerMod, accuracyMod, forceHit, healMod, effectivenessOverride, opponentCritBonus, blocksMove, blocksOutgoingMove, blocksSwitch, switchCost, onApply, onHitReflect, onMoveAttempt, interceptMove, tickEffect). Original spec text preserved below:

  Multi-status battle system: implement the new status conditions added during Step 3b of the typing-system overhaul (initial set of 19: Deafen, Petrify, Bleed, Drenched, Weighed Down, Crystallize, Echolocation, Smothered, Marked, Burnt-out, Faded, Strained, Sluggish, Soaked, Brittle, Tainted, Hexed, Severe Bleed, Statue — list may grow) with their gameplay mechanics; allow multiple persistent statuses on a single Lumori at once (unlike Pokemon's single-major rule); add UI status tags to show all active statuses on the battle info panel. Move data already references these effect strings; battle/UI code needs implementation to make them functional. ALSO support evolving statuses (initial pairs: Drenched→Soaked at 2 turns, Bleed→Severe Bleed at 3 turns, Petrify→Statue at 2 turns) where evolution REPLACES the original status. **Sub-task:** support new `target` field on moves (single / wide / self) for double/triple battle targeting — wide moves hit all opposing Lumori; self moves only affect user. Default for moves without a target field is single. **Sub-task:** support unique move mechanics introduced in Step 3b: `dualType:["X","Y"]` (move's effectiveness = product of both type multipliers — Pokemon Flying Press style; max 2 per type, all >60 power); `breakerVs:"TypeName"` (move treats one defending type as 2× regardless of chart — Freeze-Dry style; no power minimum); `alwaysCrit:true` (guaranteed critical hit — Frost Breath / Storm Throw style; no power minimum). **Sub-task:** multi-effect schema — replace/extend the single `effect` string field with an array form `effects:[{effect:"X", ec:Y}, {effect:"Z", ec:W}]` so a move can apply multiple secondary effects on a single hit (e.g. priority + atkup self, or echolocation + deafen). For now, multi-effect moves use a combined string tag (e.g. "echolocation_and_deafen") with battle code handling the combination; future schema migration replaces those tags with the array form.
- [x] **Consider additional evolving status pairs — ✅ DONE in PR #54 (commit 4e070c7).** 9 new evolved pairs approved + implemented on top of the 3 from spec: Burnt-out→Crippled (2), Tainted→Corroded (3), Tangled→Bound (2), Tethered→Anchored (2), Disoriented→Comatose (3), Marked→Hunted (2), Strained→Exhausted (3), Migraine→Concussion (2), Type Distorted→Type Shattered (3). Two of the spec's example candidates (Crystallize→Encased, Frostbite→Frozen-Stiff) deferred — Crystallize's parent stays uncondensed-into-evolved; Frostbite not in the locked status pool. Original spec text preserved below:

  Consider additional evolving status pairs beyond Drenched→Soaked, Bleed→Severe Bleed, Petrify→Statue. Examples to discuss: Crystallize→Encased, Burnt-out→Crippled, Frostbite→Frozen-stiff, Tainted→Corroded, etc. Each pair: initial status persists N turns, then auto-evolves to a more severe variant that replaces the original. Add approved new pairs to the multi-status battle system. Runs BEFORE the full move audit so any new conditions can be folded into the audit.
- [ ] Full move audit — review each of the 596 moves in MOVES_DATA: present current info (name, type, power, accuracy, PP, category, effect, description) and decide per move whether to rename (if Pokemon-derived: Tackle, Scratch, Hyper Beam, etc.), rebalance (power/acc/PP/effect), reflavor (description), or keep as-is. Run in batches with per-move approval. Goal: differentiate Lumoria's move catalogue from Pokemon's while ensuring balance, clarity, and per-type variety. Runs after Step 3 of the typing-system overhaul. **Sub-task:** audit move names for similar prefixes and suffixes (e.g. multiple moves starting with "Frost-", "Storm-", or ending in "-Strike", "-Blast") and rename for variety so players can distinguish moves at a glance.
- [ ] Develop the process or steps to successfully launch the game.
- [ ] Final code review — joint user + Claude review of all important code files (js/data.js, game logic, UI, etc.). Assess whether code is optimal, effective, and as simple as possible while still functional. Look for opportunities to apply good programming practices (more use of classes, objects, modular structure, separation of concerns, etc.) and refactor where it improves maintainability and clarity. Also catch syntax errors, broken references, dangling old-type names. **Last task before release.**

---

## How to resume in a new session

1. `git checkout claude/complete-task-FkreZ` (or current working branch)
2. Read this section ("ACTIVE WORK") to see what's checked off
3. Continue from "Walkthrough cursor" or pick up the next unchecked BREAKING family
4. Run `python3 scripts/analyze_current.py` after each change to confirm cap-2 stays clean
5. Commit + push each change with `https://claude.ai/code/session_…` footer

# 🧹 Data-integrity backlog (from the extended sweep, 2026-06)  `[⏳ NOT STARTED — bounded cleanup; no broken refs, lower severity]`

Surfaced by the reference/hygiene sweep (the broken-reference bugs — 14 dangling move keys + Spectroo fireStone — are already FIXED in PRs #65/#66). Remaining lower-severity items:

- [ ] **One-way area connections (4)** — verify each is intentional or add the reverse edge: `miasmacity -> toxic_bog`, `tremor_summit -> quake_foothills`, `mire_depths -> miasmacity`, `magma_vent -> tremor_summit` (the area lists the neighbor in `connections` but the neighbor does not list it back).
- [ ] **Learnset internal duplicate moves (21 families)** — the same move key appears twice in one learnset (dedup, keep earliest level): #11, #150, #155, #157, #188, #196, #219, #239, #265, #290, #324, #325, #327, #344, #351, #376, #388, #398, #399, #400, #401.
- [ ] **No level-1 move (2)** — #198 Chrysalix, #199 Aeridaleth (currently fall back to `tackle`; consider an explicit Lv1 move).
- [ ] **(Tooling note)** a proper move-effect validity check must parse compound effects (split on `_and_`) and cross-reference battle.js effect handlers — the naive literal-match heuristic gives false positives.
- [ ] **Variant-rate help-text mismatch** — the intro/help text (`js/game.js` ~line 4849) says variants are **1/100**, but `rollVariant` (`js/battle.js`) rolls **1/200** (the spec value). Reconcile to one rate.
