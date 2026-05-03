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

- [ ] **#5 Cobaleap** — currently described as cobalt sea-serpent; line is otter→serpent→otter. **Proposal under user review** (rewrite as long-bodied mustelid, preserve cobalt color/turquoise stripe/leaping behaviour, change emoji 🐍 → 🦦).
- [ ] **#22-24 Hallucigaze → Pyraxis → Ignitheon** — reptile → mantis → lion. Fix: rewrite **Pyraxis** as bipedal lizard-sphinx.
- [ ] **#31-33 Toxaquil → Noxaquith → Septanemone** — octopus → squid → sessile anemone. Fix: rewrite **Septanemone** as bloomed cephalopod with anemone-petal mantle (#33 already in PINNED_IDS as "Septanemone").
- [ ] **#45-46 Slatis → Frostmere** — jellyfish → ice-seal. Fix: rewrite **Frostmere** as gelatinous-pinniped form.
- [ ] **#50-52 Tundram → Shiverling → Permavast** — ram → crystal → bear. Fix: swap or remove **Shiverling** from line; OR rebuild as yak/musk-ox.
- [ ] **#57-58 Speculith → Irisarael** — floating lens → winged fairy. Fix: rewrite **Speculith** as crystalline imp with wing-buds.
- [ ] **#95-97 Dustkin → Seismith → Tectonvast** — dog → rock-dog → rhino. Fix: rewrite **Tectonvast** as stone-armoured mastiff/boarhound.
- [ ] **#168-169 Espelith → Aurarael** — solid prism → formless light. Fix: rewrite **Aurarael** as orbiting prism shards.
- [ ] **#187-188 Norindel → Plentorus** — pig → hedgehog. Fix: rewrite **Plentorus** as quill-bristled boar.
- [ ] **#209-210 Boltfur → Thundermane** — rabbit → lion. Fix: rewrite **Thundermane** as maned hare.

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
