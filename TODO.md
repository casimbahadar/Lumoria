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

Per audit (Part 1 of evolution-line coherence audit). Tackle one-by-one, get user approval per family before applying.

- [x] **#5 Cobaleap** — rewritten as 2 m long-bodied mustelid (cobalt fur, turquoise stripe, raised guard-hair ruff, leaping behaviour preserved). Emoji 🐍 → 🦦. Otter line now coherent: Aquatter (otter starter) → Cobaleap (sleek mustelid mid) → Banksnout (heavy amphibious otter final).
- [x] **#22-24 Hallucigaze → Pyraxis → Ignitheon** — Pyraxis (#23) rewritten as bipedal saurian with proto-mane (feathered ruff) bridging the snake-headed lizard base to the leonine final. Emoji 🧠 → 🦎. Stats/learnset unchanged. *(Uncommitted, batched with rest of BREAKING.)*
- [x] **#31-33 Toxaquil → Noxaquith → Septanemone** — Septanemone (#33) rewritten as 3.5 m bloomed cephalopod with anemone-petal frills around the mantle and seven venom-tipped tentacles. Active swimmer (no longer sessile). Phylum now coherent: octopus → squid → bloomed cephalopod. Emoji 🪸 → 🦑. Lore opener "Noxarith…" fixed to "Septanemone…". *(Uncommitted, batched.)*
- [x] **#45-46 Slatis → Frostmere** — Frostmere (#46) rewritten as a 1.5 m gelatinous deep-ocean creature condensed into a seal-shaped silhouette. Frost-crystal layer mimics fur; trailing tendrils from base form preserved behind the flippers; whole body acts as a resonant sensor for ice vibrations. Emoji 🦭 kept (pinniped silhouette retained). *(Uncommitted, batched.)*
- [x] **#50-52 Tundram → Shiverling → Permavast** — full bovid line (Option A). Tundram (ram, pinned) kept; Shiverling (#51) rewritten as woolly frost-yak with growing ice-slab shoulders, type Ice → Ice/Normal, emoji 💎 → 🦬; Permavast (#52) reframed as colossal mountain auroch with curled horns and ice-slab armor, emoji 🐻‍❄️ → 🐃. Lore opener for Tundram fixed ("Nivelin" → "Tundram"). *(Uncommitted, batched.)*
- [x] **#57-58 Speculith → Irisarael** — Speculith (#57) rewritten as a 40 cm floating ice-fairy sprite with a translucent lens-face, crystalline spines around the lens, and stubby iridescent wing-buds foreshadowing Irisarael's full wings. Fixes prior desc/lore contradiction (desc said "fish" while lore said "lens"). Emoji 🐟 → ✨. *(Uncommitted, batched.)*
- [x] **#95-97 Dustkin → Seismith → Tectonvast** — full rhino line, retyped to **Ground/Electric** (mid + final). Dustkin (#95) reframed as 50 cm rhino calf with budding horn; Seismith (#96) as 1 m mid-rhino with conductive iron-veined plates and static-arc footfalls; Tectonvast (#97) as 2 m rhino-titan with lightning-following hide and storm-drawn ozone aura. Emojis 🐶/🐕/🦏 → 🦏 throughout. Learnset swaps (partial — kept some Rock/Crystal for variety): Seismith — stalactite_drop → spark, stone_edge → wild_charge (rock_slide and crystal_lance kept). Tectonvast — rock_slide → thunderbolt, stalactite_drop → ball_lightning, quarry_crush → overcharge (stone_edge and crystal_lance kept). *(Uncommitted, batched.)*
- [x] **#168-169 Espelith → Aurarael** — Aurarael (#169) rewritten as a 60 cm levitating psychic core with seven orbiting prism shards held by a visible blue-violet mind-field; humanoid face from base stage preserved on the central core shard. Type expanded Psychic → Psychic/Fairy (now matches Espelith). Emoji 🌀 → 💫. *(Uncommitted, batched.)*
- [ ] **#187-188 Norindel → Plentorus** — pig → hedgehog. Fix: rewrite **Plentorus** as quill-bristled boar.
- [x] **#209-210 Boltfur → Thundermane** — Thundermane (#210) rewritten as a 1.2 m maned storm-hare. Lagomorph silhouette preserved (long hind legs, upright ears) with the lion-mane visual reframed as a stiff fur mane crackling with static around the ears and neck. Pride-leader stalking → territory by hopping; roars → thunderclap mane-flares. Emoji 🦁 → 🐰. Stats/learnset already Electric-aligned, no swaps. *(Uncommitted, batched.)*

# 🪛 MINOR family tweaks (one-line lore edits)

Batch these together once BREAKING is done. Each fix is a single-sentence wording change.

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
- [ ] **#226-227** Spectroo → **Spectrace**: tweak Spectrace to "kangaroo-silhouette of streaking flame whose hindquarters trail off into fire."
- [ ] **#232-234** Serphaxon → **Serpenthorn** → Wyvernak: tweak Serpenthorn to "long-bodied four-legged ground-dragon that drags its belly low, almost serpentine."

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

---

## How to resume in a new session

1. `git checkout claude/complete-task-FkreZ` (or current working branch)
2. Read this section ("ACTIVE WORK") to see what's checked off
3. Continue from "Walkthrough cursor" or pick up the next unchecked BREAKING family
4. Run `python3 scripts/analyze_current.py` after each change to confirm cap-2 stays clean
5. Commit + push each change with `https://claude.ai/code/session_…` footer
