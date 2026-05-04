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

## Walkthrough cursor

**Currently paused at #13 Taurcin** (Fire bull) — pending user decision once BREAKING family fixes wrap up.

Last presented: #13 Taurcin (recommendation: KEEP). Awaiting user response.

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

- [ ] **#226→229 Spectroo → Radiafish** — kangaroo of light → fish (S3 via stone evolution). Fix: rewrite **Radiafish** as marsupial-of-light/plasma quadruped, dropping the fish framing.
- [ ] **#238-240 Snowble → Blizzariel → Tundrafox** — ball → humanoid → quadruped fox (two body-plan resets). Fix: rewrite **Tundrafox** as a larger blizzard-titan humanoid.
- [ ] **#244-246 Staticlaw → Thundravex → Megavolt** — weasel → weasel-cat → lion (mustelid → felid; emoji/lore mismatch on stage 1). Fix: rewrite **Staticlaw** + **Thundravex** as cubs of the lion (rebuild line as feline throughout).
- [ ] **#269-270 Grimshade → Eclipsoon** — panther → raccoon (60% size regression + order shift). Fix: rewrite **Eclipsoon** as a 1.3 m moonlit panther-fairy with eclipse markings.
- [ ] **#286-288 Fuzzlet → Cuddrix → Majesticore** — fluff → bear-cub → lion (Ursidae → Felidae across final). Fix: rewrite **Majesticore** as a regal bear-king with a flaring psychic mane along its spine.
- [ ] **#291-292 Breezekin → Galehorn** — cat → ram (felid → bovid). Fix: rewrite **Galehorn** as a larger wind-cat with a single spiralling horn.
- [ ] **#293-295 Gustpuff → Stormwing → Cyclonax** — dandelion-puff → 3 m raptor → wind-dragon (formless plant → solid bird at S1→S2). Fix: rewrite **Gustpuff** as a fledgling raptor-chick with dandelion-fluff down trailing as wind-filaments.
- [ ] **#310-311 Mudpump → Marshix** — mudskipper (fish) → hippo (mammal). Fix: rewrite **Marshix** as a 1.5 m broad-jawed swamp-newt-saurian, OR rewrite Mudpump as a hippo-calf form.
- [ ] **#312-313 Dunecrawl → Sandrix** — armadillo (mammal) → limbless serpent (reptile). Fix: rewrite **Sandrix** as a long-bodied legged sand-saurian with retained dorsal armour plates.
- [ ] **#405-407 Mirkling → Umbrasteel → Voidwarden** — quadruped wolf → bipedal humanoid warden. Fix: rewrite **Voidwarden** as a 3 m apex shadow-wolf in interlocking steel armour-plate (quadruped, may rear bipedal in combat).

## Newly identified by direct manual audit of all 118 multi-stage families (12 families)

- [x] **#34-36 Pearlith → Undirael → Thalassira** — full mermaid line (Option A). Pearlith (#34) rewritten as 12 cm pearl-mermaid fry curled inside a 20 cm oyster shell (shell as nursery/shelter, snaps shut when threatened). Undirael (#35) kept as the 1.5 m mermaid mid-stage. Thalassira (#36) reframed as a 4 m regal sea-fairy queen — humanoid torso, long sweeping fin-tail, two pairs of translucent fairy wings, pearl-fragment crown callback to Pearlith. Body plan now coherent: pearl-fry-in-shell → mermaid → sea-fairy queen. Emoji 🧜 → 👑 for Thalassira (Pearlith 🐚 + Undirael 🧜 unchanged). Stats/learnset unchanged. Fairy-dragon flavor moved to concept parking. *(Uncommitted, batched.)*
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
- [ ] **#160-161 Miasmafly → Mistbane** — insect (crane-fly) → formless haze. Fix: rewrite **Mistbane** as a larger swarm-form or corrupted blight-fly with bloated abdomen — preserve insect silhouette.

# 🪛 MINOR family tweaks (one-line lore edits)

Batch these together once BREAKING is done. Each fix is a single-sentence wording change.

## From original audit (12)

- [ ] **#7-9** Verdkin → tweak lore to mention "stubby leg-roots and a small reptilian tail" (foreshadows Barknell's saurian shape).
- [ ] **#13-15** Taurcin → Molteroth → **Pyroclasm**: tweak Pyroclasm to "bipedal volcanic bull-titan that has reared up onto two legs."
- [ ] **#16-18** Cindercula → Searburn → **Bahamber**: tweak Bahamber to mention "vast wings folded along its serpentine length."
- [ ] **#19-21** **Magmaurin** → tweak to "bear-sized stocky **saurian**" (one-word fix bridges to lizard mid-stage).
- [ ] **#39-40** Gossafin → **Marevanos**: tweak to "winged cetacean whose flat broad head and pectoral wings retain the manta silhouette."
- [ ] **#47-49** Hexaprowl → Hailgorge → **Frigidvorn**: tweak to "heavy-shouldered, shaggy ice-wolf 2 m at the shoulder" (avoid switching to bear).
- [ ] **#84-86** Electrix → **Shockharpe** → Galvaglide: rewrite Shockharpe as winged beetle (not mosquito) to keep coleopteran lineage.
- [ ] **#123-125** Nocturil → **Phantorvex** → Venotitan: tweak Phantorvex to "long-bodied legless serpent-lizard with vestigial limb-stubs."
- [ ] **#132-133** Volcascale → **Monolithox**: tweak to "hulking obsidian saurian whose back has fused into a towering monolithic plate-shell."
- [ ] **#157-159** Acidelix → **Corrodisc** → Dissotoad: tweak Corrodisc to "flattened toad-tadpole shape."
- [ ] **#226-227** Spectroo → **Spectrace**: tweak Spectrace to "kangaroo-silhouette of streaking flame whose hindquarters trail off into fire." *(Note: covers the Spectrace branch only; the Radiafish branch is BREAKING above.)*
- [ ] **#232-234** Serphaxon → **Serpenthorn** → Wyvernak: tweak Serpenthorn to "long-bodied four-legged ground-dragon that drags its belly low, almost serpentine."

## Newly identified by strict re-audit of ids 210-446 (11 families)

- [ ] **#222-224** Mindpuff → **Recallum** → Psytheon — cloud-puff → limbed brain → winged humanoid. Fix: tweak Recallum lore to "limbs first manifest as condensed psychic energy and only later harden into matter."
- [ ] **#230-231** Scaleling → **Wyvaxis** — copper-red dragon hatchling → aqua-blue water-dragon (element/colour swap). Fix: tweak #230 lore to "its scales redden when basking but darken to aqua-blue once it learns to swim."
- [ ] **#236-237** Frostick → **Icevault** — small icicle critter → architectural fortress tower. Fix: tweak #237 lore to "Icevault forms when a Frostick fuses with cave bedrock, its body lattice expanding into a tower-like silhouette."
- [ ] **#242-243** Pulseglow → **Stuntrap** — firefly (Coleoptera) → dragonfly (Odonata). Fix: tweak #243 lore to "Stuntrap moults from its firefly carapace into an elongated dragonfly form, the abdominal light-organs becoming wing-edge arcs."
- [ ] **#260-261** Sproutix → **Leafhorn** — bipedal sapling → quadruped deer-faun. Fix: tweak #261 lore to "as it matures, its trunk-body splits into four leaf-clad limbs and its head-leaves harden into antlers."
- [ ] **#262-264** Transluceed → **Tendrilisk** → Impenezard — seed-walker → vine-wrapped lizard → walking thorn-bush. Fix: tweak #263 Tendrilisk lore to "its vine-tendrils still wrap a seed-core body — the lizard silhouette is camouflage from outside, all plant within."
- [ ] **#296-298** Plaguefly → **Blightwing** → Plagueoth — mosquito (Diptera) → butterfly → moth (Lepidoptera) crosses orders. Fix: tweak #297 Blightwing lore to "after pupation its proboscis shortens and its wings sprout lepidopteran scales, completing the toxic-imago transition."
- [ ] **#299-300** Stinglet → **Nettleclaw** — bee → scorpion-bee hybrid. Fix: tweak #300 lore to "its rear segments elongate into a scorpion-like tail, parallel-evolved from the bee's stinger rather than a true arachnid feature."
- [ ] **#302-303** Lightpuff → **Lumivane** — luminous orb → graceful humanoid. Fix: tweak #303 lore to "the moonstone causes its orb-body to elongate and bifurcate into limbs, retaining the original glow at the chest core."
- [ ] **#308-309** Seafraith → **Tidephant** — deep-sea fish → cetacean (class jump). Fix: tweak #309 lore to "as it matures, its fins broaden into flippers and its skeleton calcifies into a whale-like frame — a fish-to-leviathan apotheosis."
- [ ] **#404-407** *(see BREAKING #405-407 above; no separate MINOR needed.)*

## Newly identified by direct manual audit of all 118 multi-stage families (11 families)

- [ ] **#42-44** Cryonik → Boreon → **Nagislither** — seal → seal → serpentine flippered creature. Fix: tweak Nagislither lore to "elongated mature seal-form, pinniped lineage retained in flippered limbs and whiskered face."
- [ ] **#69-71** Germix → Verdurus → Verdovast — seed-creature → grass-bear → grass-bear. Fix: tweak Germix lore to "the seed sprouts furred limbs and a small bear-cub silhouette as it matures."
- [ ] **#78-80** Sylvnox → Morraveth → **Morralyn** — fox → wolf → "bear-wolf hybrid". Fix: tweak Morralyn lore to "heavy-shouldered dire-wolf with bear-like build" — drop the bear-hybrid framing, keep canid.
- [ ] **#104-105** Arenikin → **Dravanas** — sandy dog → lion-sized creature with mane. Fix: tweak Dravanas lore to "large jackal-pack-leader" or "great desert wolf" — keep canid, drop "lion-sized".
- [ ] **#108-110** **Silvergust** → Siroccomane → Aeolarch — cat → lion → lion. Fix: tweak Silvergust lore to "lion-cub-sized small felid" — felid throughout.
- [ ] **#116-117** Zephyrin → **Pneumathos** — serpentine wind creature → humanoid-cored vortex. Fix: tweak Pneumathos lore to "serpentine core remains visible inside the swirling vortex."
- [ ] **#128-129** Cranivade → **Voidaxis** — psychic biped → blurred shifting entity. Fix: tweak Voidaxis lore to "the biped silhouette persists at the form's centre, edges blurring outward."
- [ ] **#142-144** Dawnirel → **Lunarael** → Celestarch — star-shape → crescent-shape → many-pointed star. Fix: tweak Lunarael lore to "pointed arms curve inward, briefly crescent-like, before blooming back to full star at its final stage."
- [ ] **#162-163** Marlix → **Blightalis** — humanoid reed → corrupted flower. Fix: tweak Blightalis lore to "the reed-stalk body has bloomed into a flower-headed humanoid."
- [ ] **#220-221** Umbrajest → **Shadowveil** — smoke trickster → cloaked humanoid shadow. Fix: tweak Shadowveil lore to "the trickster's smoke-body has solidified into a cloaked humanoid form."
- [ ] **#226-229** Spectroo's stone-evolution branches (#228 Lunaroon, #229 Radiafish) need separate examination — current parser caught only #226→227 linear chain.

# 🐺 Archetype oversaturation — common animals (cap = 3 families)

Address after BREAKING + MINOR. Plan: rebuild a few standalone or weaker family-final lores into different creature types.

- [ ] **wolf** — 6 families (Hexaprowl, Eclipsehound, Shadowpup, Mirkling, Voltfang, Cryvorn). Trim ~2.
- [ ] **lion / big-cat** — 6 families (Siroccomane, Dravanas, Ignitheon, Thundermane, Megavolt, Majesticore). Trim ~3.
- [ ] **dog (non-wolf canine)** — 5 families (Dustkin, Goldefluff, Arenikin, Projectery, Galeaxis). Trim ~2.
- [ ] **bear** — 5 families (Verdurus, Frigidvorn, Permavast, Rotunden, Cuddrix-line, Arcturex). Trim ~2.
- [ ] **bird-of-prey** — 5 families (Vortexathos, Swirlavel, Gelwing, Rimeclaw, Zephyrak). Trim ~2.
- [ ] **golem (humanoid metal/stone)** — 10+ families. Trim to 3.
- [ ] **crystalline / gem creature** — 8 families. Trim to 3.
- [ ] **rock-monolith / standing-stone** — 5 families. Trim to 3.

# 💡 Concept parking — future family ideas to use later

- **"Whirlpool of light" — Water/Psychic family.** The original Aurarael flavor (a flowing psychic entity that resembles a whirlpool of blue-violet light given form, no solid body, continuously cycling vortex, inhabits locations of high psychic resonance, absorbs ambient thought energy) is being preserved here. Reuse for a new Water/Psychic family — possibly a deep-ocean meditation-shrine guardian, or a tidal-current spirit. Keep in mind during the renaming/typing pass.
- **"Fairy-dragon" — Water/Fairy or Dragon/Fairy family.** The original Thalassira flavor (a grand aquatic fairy-dragon 5 metres long, combining the sinuous body of a sea serpent with translucent fairy wings that function as fins, iridescent ocean-blue and silver scales, guarding hidden underwater groves where rare magical plants grow undisturbed) is being preserved here. Reuse for a new family — possibly a flagship legendary fairy-dragon line, or as the final stage of a new aquatic dragon family during the renaming pass.
- **"Nautilus metallic humanoid" — Water/Steel family.** The original Titanariel flavor (a 7-metre armoured sea-titan resembling a colossal nautilus with steel-hard shell and metallic-plated tentacles, propelled by high-pressure water jets, capsizing ships by wrapping tentacles around the hull) is being preserved. User specifically liked the **nautilus metallic humanoid** read — likely intent is a humanoid creature with a nautilus-shell carapace and metal-plated tentacle-arms (rather than a pure mollusk). Reuse for a new Water/Steel family — possibly a flagship deep-sea armored legendary or final stage of a new aquatic mollusk-knight line.

# 🧪 Type-combination audit — RUN AFTER BREAKING + MINOR, BEFORE THE RENAMING PART

After all coherence fixes are committed, run a type-combination audit of the full roster:

- [ ] Tally how many Lumori use each `[type1, type2]` (unordered) combination across the dex.
- [ ] Devise a cap (e.g. 3-5 per combination) for "ordinary" typing pairs.
- [ ] Flag any combo over the cap for redistribution OR mark as **"interesting / special typing combo"** if it's a deliberate flagship pairing (e.g. starter dual-types, signature legendary pairs, narratively distinctive combinations like Aether/Crystal).
- [ ] Output: list of over-cap combos with member ids, plus a separate "special / preserve" list for user review.
- [ ] Adjust types on selected mons to bring ordinary combos under cap, leaving the special ones intact.

**Run order:** BREAKING fixes → MINOR fixes → this typing audit → archetype trim → renaming queue resumes.

# 🔮 Mythical/rare archetype flags — END-OF-TASK USER DISCUSSION

Per user instruction: leave these for late discussion before any consolidation.

- [ ] **dragon (true dragon)** — 20+ families. Massive over-saturation. Discuss approach.
- [ ] **ghost / wraith / spectral** — 7+ families.
- [ ] **void / cosmic / abstract** — 8+ families.
- [ ] **storm-elemental / lightning-vortex** — 5+ families.
- [ ] **humanoid (non-armoured elemental)** — 6+ families.
- [ ] **phoenix / solar-bird** — 3-4 families (borderline).

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
