# TODO - Lumoria Bugs & Feature Requests

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

---

# 📋 ACTIVE WORK — Luminex Rename & Coherence Pass

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

## Reference docs

- [x] **`archetype-session-notes.md`** — cross-session framing decisions, multi-silhouette format spec, deferred/open items list, cluster completion log. **Read this at the start of any Phase 1 archetype session.**

- [x] **`archetype-subtypes.md`** — transcription + brainstorm pass through all 15 existing sections complete (Mammals → Cosmological/Energy). Dragon renames + dog-breed additions + Mythical Batches A & B applied. PR #38 (transcription) merged; PR #39 (brainstorm pass) merged. **Phase 1 new-top-level-category roadmap locked at 33 batches (32 firm + INSTRUMENTS confirmed-pending-entries)** (35 − RIVER − URBAN − BANNER all permanently dropped, +INSTRUMENTS confirmed). **45 categories committed so far** (35 original roadmap + 10 extension): full list in archetype-subtypes.md. Latest additions 2026-05-15 from brainstorm batches 1+2+3 user picks. **Bio cluster done (5/5). Habitat cluster done (4/4, RIVER + URBAN both dropped). Materials cluster done (4/4). Manmade cluster DONE 13/13. Phenomena cluster DONE 7/7. BANNER permanently dropped 2026-05-12. PHASE 1 CATEGORY ROADMAP COMPLETE at 35/35 (33 firm + 2 bonus PLANTS/FUNGI). Phase 1 extension batches (post-roadmap-closure) IN PROGRESS 10/? (FURNITURE + ANATOMY + MATHEMATICS + CANDY/SWEETS + DANCE/MOVEMENT + CAREERS/PROFESSIONS + RELIGIOUS/SPIRITUAL + MEDICAL + MOON PHASES + SPORTS landed 2026-05-15).**

*Pending after roadmap closure: **cross-cluster deferral-review pass** — consolidated review of all `### From X cluster (Y deferrals)` blocks in `archetype-session-notes.md` plus candidates noted in category intros within `archetype-subtypes.md`. Goal: decide which items to permanently drop from files vs. keep as future-densification candidates. May span multiple sessions depending on volume. PR/branch decision deferred until review-pass session begins.*

*Note: 2026-05-13 session also retro-added `thermometer-being` to TOOL section (new `**Measurement / precision**` sub-group) via separate commit per CAMERA cross-section redirect — does not bump category counter (TOOL already counted) but expands TOOL entry count.* See `archetype-session-notes.md` for full framing decisions and deferred-items log. Each batch follows propose → letter-picks → write → commit → push.

## Walkthrough cursor

**Currently in Borderline triage of MINOR-vs-BREAKING upgrades.** Borderline cases 1-7 done. Next up: **Borderline 8 (#128-129 Cranivade → Voidaxis)**.

Remaining borderline cases: 8 (#128-129), 9 (#142-144), 10 (#157-159), 11 (#162-163), 12 (#172-174), 13 (#220-221), 14 (#222-224), 15 (#236-237), 16 (#242-243), 17 (#260-261), 18 (#262-264), 19 (#308-309).

After borderline triage: 5 NEW BREAKING items (#84-86, #104-105, #296-298, #299-300, #302-303) → bulk name-leak fix (22+ identified in taxonomy.md) → resume MINOR tweaks → Solo audit → typing audit → archetype trim → renaming → stat review.

The original walkthrough through ids 7-446 (paused at #13 Taurcin "keep" decision) is on hold until all the audit phases above complete.

---

# 🔧 BREAKING family fixes (priority queue)

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
- [ ] **#296-298 Plaguefly → Blightwing → Plagueoth** — mosquito (Diptera) → butterfly → moth (Lepidoptera). Order change. Fix: pivot to Lepidoptera throughout — rewrite **Plaguefly** as a blight-larva or large blight-caterpillar (drops mosquito), keep Blightwing (butterfly) and Plagueoth (moth).
- [ ] **#299-300 Stinglet → Nettleclaw** — bee (Hymenoptera) → "scorpion-bee hybrid" (Hymenoptera + Arachnida). Cross-phylum hybrid. Fix: drop "scorpion" framing — rewrite **Nettleclaw** as a large bee with elongated tail-stinger that arches scorpion-like over its back (true Hymenoptera throughout).
- [ ] **#302-303 Lightpuff → Lumivane** — luminous orb (formless) → graceful humanoid (bipedal). Body-plan reset. Fix: pick one body plan — likely rewrite **Lumivane** as a larger luminous orb-creature with rudimentary limb-extensions emerging from its sphere (orb at core throughout).
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

# 🪛 MINOR family tweaks (one-line lore edits)

Batch these together once BREAKING is done. Each fix is a single-sentence wording change.

## From original audit (12)

- [x] **#7-9** Verdkin → tweak lore to mention "stubby leg-roots and a small reptilian tail" (foreshadows Barknell's saurian shape).
- [x] **#13-15** Taurcin → Molteroth → **Pyroclasm**: tweak Pyroclasm to "bipedal volcanic bull-titan that has reared up onto two legs."
- [x] **#16-18** Cindercula → Searburn → **Bahamber**: tweak Bahamber to mention "vast wings folded along its serpentine length."
- [x] **#19-21** **Magmaurin** → tweak to "bear-sized stocky **saurian**" (one-word fix bridges to lizard mid-stage).
- [x] **#39-40** Gossafin → **Marevanos**: tweak to "winged cetacean whose flat broad head and pectoral wings retain the manta silhouette."
- [x] **#47-49** Hexaprowl → Hailgorge → **Frigidvorn**: tweak to "heavy-shouldered, shaggy ice-wolf 2 m at the shoulder" (avoid switching to bear).
- [ ] **#84-86** Electrix → **Shockharpe** → Galvaglide: rewrite Shockharpe as winged beetle (not mosquito) to keep coleopteran lineage.
- [x] **#123-125** Nocturil → **Phantorvex** → Venotitan: tweak Phantorvex to "long-bodied legless serpent-lizard with vestigial limb-stubs."
- [x] **#132-133** Volcascale → **Monolithox**: tweak to "hulking obsidian saurian whose back has fused into a towering monolithic plate-shell."
- [x] **#157-159** Acidelix → **Corrodisc** → Dissotoad: tweak Corrodisc to "flattened toad-tadpole shape."
- [ ] **#226-227** Spectroo → **Spectrace**: tweak Spectrace to "kangaroo-silhouette of streaking flame whose hindquarters trail off into fire." *(Note: covers the Spectrace branch only; the Radiafish branch is BREAKING above.)*
- [x] **#232-234** Serphaxon → **Serpenthorn** → Wyvernak: tweak Serpenthorn to "long-bodied four-legged ground-dragon that drags its belly low, almost serpentine."

## Newly identified by strict re-audit of ids 210-446 (11 families)

- [x] **#222-224** Mindpuff → **Recallum** → Psytheon — cloud-puff → limbed brain → winged humanoid. Fix: tweak Recallum lore to "limbs first manifest as condensed psychic energy and only later harden into matter."
- [x] **#230-231** Scaleling → **Wyvaxis** — copper-red dragon hatchling → aqua-blue water-dragon (element/colour swap). Fix: tweak #230 lore to "its scales redden when basking but darken to aqua-blue once it learns to swim."
- [x] **#236-237** Frostick → **Icevault** — small icicle critter → architectural fortress tower. Fix: tweak #237 lore to "Icevault forms when a Frostick fuses with cave bedrock, its body lattice expanding into a tower-like silhouette."
- [x] **#242-243** Pulseglow → **Stuntrap** — firefly (Coleoptera) → dragonfly (Odonata). Fix: tweak #243 lore to "Stuntrap moults from its firefly carapace into an elongated dragonfly form, the abdominal light-organs becoming wing-edge arcs."
- [x] **#260-261** Sproutix → **Leafhorn** — bipedal sapling → quadruped deer-faun. Fix: tweak #261 lore to "as it matures, its trunk-body splits into four leaf-clad limbs and its head-leaves harden into antlers."
- [ ] **#262-264** Transluceed → **Tendrilisk** → Impenezard — seed-walker → vine-wrapped lizard → walking thorn-bush. Fix: tweak #263 Tendrilisk lore to "its vine-tendrils still wrap a seed-core body — the lizard silhouette is camouflage from outside, all plant within."
- [ ] **#296-298** Plaguefly → **Blightwing** → Plagueoth — mosquito (Diptera) → butterfly → moth (Lepidoptera) crosses orders. Fix: tweak #297 Blightwing lore to "after pupation its proboscis shortens and its wings sprout lepidopteran scales, completing the toxic-imago transition."
- [ ] **#299-300** Stinglet → **Nettleclaw** — bee → scorpion-bee hybrid. Fix: tweak #300 lore to "its rear segments elongate into a scorpion-like tail, parallel-evolved from the bee's stinger rather than a true arachnid feature."
- [ ] **#302-303** Lightpuff → **Lumivane** — luminous orb → graceful humanoid. Fix: tweak #303 lore to "the moonstone causes its orb-body to elongate and bifurcate into limbs, retaining the original glow at the chest core."
- [ ] **#308-309** Seafraith → **Tidephant** — deep-sea fish → cetacean (class jump). Fix: tweak #309 lore to "as it matures, its fins broaden into flippers and its skeleton calcifies into a whale-like frame — a fish-to-leviathan apotheosis."
- [ ] **#404-407** *(see BREAKING #405-407 above; no separate MINOR needed.)*

## Newly identified by direct manual audit of all 118 multi-stage families (11 families)

- [ ] **#42-44** Cryonik → Boreon → **Nagislither** — seal → seal → serpentine flippered creature. Fix: tweak Nagislither lore to "elongated mature seal-form, pinniped lineage retained in flippered limbs and whiskered face."
- [x] **#69-71** Germix → Verdurus → Verdovast — **upgraded MINOR → BREAKING** (only seed-pod family in luminex; better to keep seed-pod identity than absorb into over-cap bear archetype). Germix (#69) kept as 30 cm seed. Verdurus (#70) reframed as 1.5 m walking seed-pod with split husk, moss-covered core, curling leaf-tendrils, drops fresh seeds in its trail; emoji 🐻 → 🌱. Verdovast (#71) reframed as 2.5 m colossal ancient seed-pod with surface so overgrown with saplings/vines/blossoms it resembles a walking garden; trees grow from its shoulders, fruit ripens among branches, creatures nest in its foliage; drops fertile seeds with each step, leaves grove ecosystems in its wake; emoji 🐻 → 🌳. Names, types Grass, learnsets all preserved. Side benefits: bear archetype drops 3 → 2 (relieves pressure); pristine seed-pod / walking-garden archetype claimed. *(Uncommitted, batched.)*
- [x] **#78-80** Sylvnox → Morraveth → Morralyn — **upgraded MINOR → BREAKING** (pivoted whole line to Leshy / forest-spirit archetype to relieve over-cap wolf pressure and reframe Morralyn's "bear-wolf hybrid" as a coherent folkloric forest-spirit final). Sylvnox (#78) reframed as 60 cm bark-skinned forest-imp/sprite with leaf-cloak fringe, twig-horns, amber eyes glowing through foliage-hood (was 65 cm fox); emoji 🌿 kept. Morraveth (#79) reframed as 1 m mid-stage leshy with bark-plated shoulders, branching antler-buds, midnight leaf-cloak (was 90 cm wolf); emoji 🌑 → 🌳. Morralyn (#80) reframed as 1.8 m ancient leshy-lord with full antler-crown, vine-beard with hollow seedpods, bark-armour body, decay-aura (was 1.5 m bear-wolf hybrid); emoji 🌑 → 🪵. Names, types Grass/Dark, stats, learnsets all preserved (all moves fit a corrupted-forest-spirit just as well as a canine). Side benefits: wolf archetype drops 6 → 5 (helps trim target); "fairy chimera/composite" slot drops 2 → 1; pristine Leshy / forest-spirit lineage claimed as new mythical-exempt archetype. *(Uncommitted, batched.)*
- [ ] **#104-105** Arenikin → **Dravanas** — sandy dog → lion-sized creature with mane. Fix: tweak Dravanas lore to "large jackal-pack-leader" or "great desert wolf" — keep canid, drop "lion-sized".
- [x] **#108-110** **Silvergust** → Siroccomane → Aeolarch — cat → lion → lion. Fix: tweak Silvergust lore to "lion-cub-sized wind-felid" (drops "cat-like" framing) — felid throughout. Also fixed name leak: lore opener "Gustkin is..." → "Silvergust is...". Stages #109 and #110 untouched. *(Uncommitted, batched.)*
- [x] **#116-117** Zephyrin → **Pneumathos** — serpentine wind creature → humanoid-cored vortex. **Pivoted Zephyrin to vortex-throughout** (rather than the original audit's "serpentine inside vortex" tweak) to relieve over-cap serpent archetype. Zephyrin (#116) reframed as 1.5 m small wind-psychic vortex (translucent teal-blue swirling column with faint psychic glow at centre, ribbons of wind trailing from periphery); drops "serpentine" / "scales" / "fins" framing. Pneumathos (#117) untouched. Names, types Wind/Psychic, emojis 🌀/🌪️, stats, learnsets all preserved. Side benefit: serpent (non-dragon) archetype drops 4 → 3 (at cap). **Note:** family lands in storm-elemental/lightning-vortex archetype which is now capped at 1-2 (no longer mythical-exempt) — see archetype trim list. *(Uncommitted, batched.)*
- [x] **#128-129** Cranivade → **Voidaxis** — psychic biped → blurred shifting entity. Applied: Voidaxis lore extended to keep biped silhouette at form's centre with edges dissolving into half-dimensional shadow; Cranivade lore opener "Mentarix is..." → "Cranivade is..." (name-leak fix). Both stages now coherent — biped persists inside void aura. *(Uncommitted, batched.)*
- [ ] **#142-144** Dawnirel → **Lunarael** → Celestarch — star-shape → crescent-shape → many-pointed star. Fix: tweak Lunarael lore to "pointed arms curve inward, briefly crescent-like, before blooming back to full star at its final stage."
- [ ] **#162-163** Marlix → **Blightalis** — humanoid reed → corrupted flower. Fix: tweak Blightalis lore to "the reed-stalk body has bloomed into a flower-headed humanoid."
- [ ] **#220-221** Umbrajest → **Shadowveil** — smoke trickster → cloaked humanoid shadow. Fix: tweak Shadowveil lore to "the trickster's smoke-body has solidified into a cloaked humanoid form."
- [ ] **#226-229** Spectroo's stone-evolution branches (#228 Lunaroon, #229 Radiafish) need separate examination — current parser caught only #226→227 linear chain.

# 🔍 Solo desc/lore/emoji consistency audit — RUN AFTER MINOR

Goal: every standalone (single-stage) mon currently has no body-plan-coherence audit because solos can't have multi-stage breaks. But solos can have other internal inconsistencies — descriptions that contradict lore, emojis that fight body plans, name leaks, stat profiles that mismatch creature framing.

## What to scan for (across all 200+ standalone mons + each stage of multi-stage families that wasn't already touched)

- [ ] **Emoji vs body plan mismatches** — e.g. Grimshade had 🦇 bat emoji + lore saying panther.
- [ ] **Desc vs lore contradictions** — e.g. Sparkrel's desc said "electric eel" while lore said "pufferfish"; Staticlaw's desc said "lion pup" while lore said "weasel"; Megavolt's desc said "thunder lion" while lore matched.
- [ ] **Name leaks in lore opener** — e.g. "Vexakin is..." for Impefurr; "Permafrix is..." for Tundrafox; "Miasoveth is..." for Miasmafly. Any stage whose lore opens with a different name than `name:` field.
- [ ] **Stat profiles that fight body plan** — e.g. a heavy tank with Spe 120, a fast bird with Spe 30. (Note: full stat audit is the very last task — solo audit just flags obvious cases.)
- [ ] **Same-archetype × typing-combo collisions** — solos may overlap with each other or with multi-stage families on the strict per-archetype rule.
- [ ] **Pre-408 creatures with post-game typings** (Aether, Fighting, Crystal, Primal, Ghost) — flag for user discussion per CLAUDE.md (e.g. Lunaspectre #362 has Ghost on a pre-408 mon).

## Approach

- Walk every standalone mon (about 200 in the dex, especially the Forgotten 408+ range and the 314-404 mid-range).
- For multi-stage families touched in BREAKING/MINOR, spot-check the unmodified stages for the same issues.
- Output: a list per category (emoji-mismatch, desc-vs-lore, name-leak, stat-mismatch, archetype-typing-collision, pre-408-postgame-type).
- For each finding, propose a single-line fix.
- Apply fixes batched and committed once user approves the batch.

**Run order:** BREAKING → MINOR → **solo desc/lore/emoji audit (this section)** → typing-combination audit → archetype trim → renaming → stat spread review.

# 🦄 Creature inventory + mythological exemptions — RUN BEFORE archetype trim

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
Many are Forgotten/postgame (id ≥ 408) with abstract/legendary names that don't match real-creature keywords. Some pre-408 lines also need manual review (e.g. Pyroclasm, Tundrafox now snowman, Nimbusel-Aetherworn cloud-fairy). **Recommended**: do a manual classification pass before running the archetype trim.

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

*(Storm-elemental / lightning-vortex moved out of mythical-exempt — see archetype trim list, capped at 1-2 families.)*

### Borderline (could go either way)
- **Echidna** (1, Arcspine line) — real animal, but rare in dex/folklore both. Keep cap-3 unless trim forces.
- **Owl** (1, Mistwhirl line) — real animal but folkloric (wisdom, watcher). Borderline cap-3.

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

- [ ] **Manual classification pass** on the 108 unclassified families (especially Forgotten/postgame mons) — assign each to an archetype.
- [ ] **Verify (b) exemption list** with user once full inventory is clean.
- [ ] **Pair (c) candidates** with specific over-cap common-archetype members to pivot during the renaming phase.
- [ ] **Output the final cap-trim list** reflecting (a)+(b)+(c). This becomes the input to the existing "Archetype oversaturation" section below.

**Run order placement:** before the existing "Archetype oversaturation — common animals" trim section below. The inventory + exemption list **defines** what counts toward the trim, then the trim runs against that updated list.

# 🧪 Type-combination audit — RUN AFTER BREAKING + MINOR, BEFORE THE RENAMING PART

After all coherence fixes are committed, run a type-combination audit of the full roster:

- [ ] Tally how many Lumori use each `[type1, type2]` (unordered) combination across the dex.
- [ ] Devise a cap (e.g. 3-5 per combination) for "ordinary" typing pairs.
- [ ] Flag any combo over the cap for redistribution OR mark as **"interesting / special typing combo"** if it's a deliberate flagship pairing (e.g. starter dual-types, signature legendary pairs, narratively distinctive combinations like Aether/Crystal).
- [ ] Output: list of over-cap combos with member ids, plus a separate "special / preserve" list for user review.
- [ ] Adjust types on selected mons to bring ordinary combos under cap, leaving the special ones intact.

**Run order:** BREAKING fixes → MINOR fixes → this typing audit → archetype trim → renaming queue resumes.

# 🐺 Archetype oversaturation — common animals (cap = 3 families)

Address after BREAKING + MINOR. Plan: rebuild a few standalone or weaker family-final lores into different creature types.

- [ ] **wolf** — 5 families (Hexaprowl, Eclipsehound, Shadowpup, Voltfang, Cryvorn). Trim ~2. *(Mirkling line → bipedal warden via Voidwarden #405-407; Morraveth line → leshy #78-80.)*
- [ ] **lion / big-cat** — 6 families (Siroccomane, Dravanas, Ignitheon, Thundermane, Megavolt, Majesticore). Trim ~3.
- [ ] **dog (non-wolf canine)** — 5 families (Dustkin, Goldefluff, Arenikin, Projectery, Galeaxis). Trim ~2.
- [ ] **bear** — 3 families (Frigidvorn, Permavast, Rotunden). At cap. *(Verdurus → seed-pod #69-71; Cuddrix-line → kirin #286-288; Arcturex → owl #53-54.)*
- [ ] **bird-of-prey** — 5 families (Vortexathos, Swirlavel, Gelwing, Rimeclaw, Zephyrak). Trim ~2.
- [ ] **golem (humanoid metal/stone)** — 10+ families. Trim to 3.
- [ ] **crystalline / gem creature** — 8 families. Trim to 3.
- [ ] **rock-monolith / standing-stone** — 5 families. Trim to 3.

## Elementals (cap = 1 family + 1 standalone per element)

One per type, 19 elementals total (all 21 types except Fighting and Primal). An "elemental" is a formless being literally made of an element. Each cap = 1 family + 1 standalone.

- [ ] **wind-elemental** — 1 family (Pneumathos line #116-117 "swirling pillar of concentrated air with humanoid core"). At cap.
- [ ] *(Other 18 elemental archetypes — full audit pending; see below.)*

## Natural-disaster-inspired (cap = 1 family + 1 standalone per disaster subtype)

Umbrella archetype with per-disaster subtypes (thunderstorm, tornado, tsunami, wildfire, earthquake, blizzard, eruption, flood, etc.). A natural-disaster-inspired creature is shaped like / themed after the disaster regardless of element. Each subtype cap = 1 family + 1 standalone.

- [ ] **thunderstorm** — 3 families (Vortexwing #370, Tempestborn #380, Nullstorm #393 — all formless lightning-vortex with electromagnetic nucleus). Cap 1+1. Trim ~1-2. Tempestborn explicitly "tracked as both a storm and a living creature" — strongest disaster framing, prime keep candidate.
- [ ] *(Other disaster subtypes — full audit pending.)*

*(Wraithstorm #386 reclassified out of storm group → wraith archetype: "translucent humanoid wraith inside lightning bolts". Galeaxis/Vortexathos/Stormcrown stay in their animal archetypes.)*

# 📉 Standalone count reduction — RUN BEFORE the renaming queue resumes

**Current state:** 269 families total — **118 multi-stage + 151 single-stage**. Solo ratio is **56.1%** which is high; most established Pokémon-style dexes target 60-70% multi-stage families. Goal: significantly reduce the solo count by absorbing many standalone mons into multi-stage evolution chains, or by retiring/merging redundant solos.

## Approach

- [ ] **Inventory the 151 solos.** Group by archetype (cross-reference the creature inventory above) and by typing combo. Surface any solos that visually/thematically match an existing multi-stage family (could become a 4th stage, mega/branch evolution, or starter-pre-stage).
- [ ] **Identify reduction targets.** For each over-represented archetype (lion, dog, bear, raptor, golem, etc.) and each over-cap typing combo, find which solos could be absorbed into existing chains as new stages or branches, vs. which solos are unique-mythical (exempt-list) and should remain standalone.
- [ ] **Define merger candidates.** Pair a solo with an existing chain (e.g. an unattached lion-coded solo could be retitled as a branched evolution of an existing felid line). Decide stage placement (pre-evolution, mid, late-evolution, mega/awakened form).
- [ ] **Identify retirement candidates.** Some solos may be redundant in role/typing/archetype with existing families and could be dropped from the dex entirely (or repurposed as variants).
- [ ] **Target ratio.** Aim for ~70-75 solos remaining (down from 151), with the remainder absorbed/retired. Approximate target: 75 multi-stage + 70 solo = ~145 families, more comparable to mainline Pokémon density.
- [ ] **Output:** a merger plan with **(a)** solos to absorb (with target chain + stage placement), **(b)** solos to retire (with replacement coverage if needed), **(c)** solos kept standalone (mythical-exempt or unique-niche).

**Run order:** after BREAKING + MINOR + solo desc/lore audit + creature inventory + typing audits, **but before the renaming queue resumes** — because consolidating solos into chains affects names (new evolution-name relationships) and the rename pass should work on the post-consolidation roster.

# 🎯 Per-archetype typing-combo diversity audit — RUN BEFORE STAT REVIEW

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

# 💡 Concept parking — future family ideas to use later

- **"Whirlpool of light" — Water/Psychic family.** The original Aurarael flavor (a flowing psychic entity that resembles a whirlpool of blue-violet light given form, no solid body, continuously cycling vortex, inhabits locations of high psychic resonance, absorbs ambient thought energy) is being preserved here. Reuse for a new Water/Psychic family — possibly a deep-ocean meditation-shrine guardian, or a tidal-current spirit. Keep in mind during the renaming/typing pass.
- **"Fairy-dragon" — Water/Fairy or Dragon/Fairy family.** The original Thalassira flavor (a grand aquatic fairy-dragon 5 metres long, combining the sinuous body of a sea serpent with translucent fairy wings that function as fins, iridescent ocean-blue and silver scales, guarding hidden underwater groves where rare magical plants grow undisturbed) is being preserved here. Reuse for a new family — possibly a flagship legendary fairy-dragon line, or as the final stage of a new aquatic dragon family during the renaming pass.
- **"Nautilus metallic humanoid" — Water/Steel family.** The original Titanariel flavor (a 7-metre armoured sea-titan resembling a colossal nautilus with steel-hard shell and metallic-plated tentacles, propelled by high-pressure water jets, capsizing ships by wrapping tentacles around the hull) is being preserved. User specifically liked the **nautilus metallic humanoid** read — likely intent is a humanoid creature with a nautilus-shell carapace and metal-plated tentacle-arms (rather than a pure mollusk). Reuse for a new Water/Steel family — possibly a flagship deep-sea armored legendary or final stage of a new aquatic mollusk-knight line.

# 🔮 Mythical/rare archetype flags — END-OF-TASK USER DISCUSSION

Per user instruction: leave these for late discussion before any consolidation.

- [ ] **dragon (true dragon)** — 20+ families. Massive over-saturation. Discuss approach.
- [ ] **ghost / wraith / spectral** — 7+ families.
- [ ] **void / cosmic / abstract** — 8+ families.
- [ ] **storm-elemental / lightning-vortex** — 5+ families.
- [ ] **humanoid (non-armoured elemental)** — 6+ families.
- [ ] **phoenix / solar-bird** — 3-4 families (borderline).

# 📊 Final-pass stat spread review — RUN LAST (after all renaming complete)

After every coherence fix, type adjustment, and rename is committed, do a final pass over **every Lumori's base stat spread** across the whole dex. This is the last item in the entire workflow.

- [ ] Walk every mon (or every family) and check the BST + stat distribution against:
  - Stage tier (base / mid / final) — BSTs should grow uniformly along an evolution chain
  - Body plan / role (fast hunter, tank, magical caster, balanced bruiser, glass cannon)
  - Cross-family parity (similar-tier mons should have similar BSTs)
  - Stat distribution coherence (e.g. high-Atk physical attackers have at least decent Spe; tanks have HP/Def synergy; SpA-leaning casters have SpD bulk)
- [ ] Flag any mon whose stats fight its body plan (e.g. a fast bird with Speed 30, a heavy tank with Def 40)
- [ ] Adjust to bring outliers in line, preserving overall power balance
- [ ] Re-verify trainer encounters / wild-area difficulty curves still feel correct after stat adjustments

**Run order:** BREAKING fixes → MINOR fixes → typing audit → archetype trim → renaming queue → **stat spread review (this section, last)**.

---

## How to resume in a new session

1. `git checkout claude/complete-task-FkreZ` (or current working branch)
2. Read this section ("ACTIVE WORK") to see what's checked off
3. Continue from "Walkthrough cursor" or pick up the next unchecked BREAKING family
4. Run `python3 scripts/analyze_current.py` after each change to confirm cap-2 stays clean
5. Commit + push each change with `https://claude.ai/code/session_…` footer
