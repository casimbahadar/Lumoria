# Lumori Rename Queue

## Goal
Resolve all name conflicts so that no more than **2 Lumori share any single
prefix or single suffix** across the entire roster.

## Source of truth
`js/data.js`. Re-analysis run via `python3 scripts/analyze_current.py` —
this script reads only what's on disk (no APPROVED_RENAMES override),
applies CAP=2 to all groups, and emits the full flagged list.

> Note: the older `scripts/reanalysis_post54.py` had an `APPROVED_RENAMES` dict
> that was out of sync with data.js (e.g. it claimed #264 was renamed to
> "Impenezard" but data.js actually has "Thornvast"). That script's count of
> 133 is unreliable. Real number is 191.

## Remaining: 191 candidates (id-ascending)

By bucket:
- exact duplicates: 2 (#10 Embrix ↔ #272 Embrix)
- near-duplicates (≥0.88): 2 (#319 Voidraxis↔#129 Voidaxis, #407 Voidwarden↔#390 Voidgarden)
- over-cap suffix/prefix groups: ~155
- Forgotten midfix conflicts: 32

## Entry format

```
#N/TOTAL — #ID CurrentName <emoji> Type1/Type2
<stage> (Pre1 → Pre2 → Name)
<lore: physical description, behavior, ecology>
Flagged: <reason from reanalysis>

Prefixes: Aaa, Bbb, Ccc, Ddd, Eee, Fff, Ggg, Hhh, Iii, Jjj
Suffixes: -aaa, -bbb, -ccc, -ddd, -eee, -fff, -ggg, -hhh, -iii, -jjj
```

- Prefixes/suffixes are independent pools — mix freely or pick one combo.
- All suggestions exclude over-cap groups so they don't push another stem
  past the cap-of-2 rule.

## Over-cap groups to avoid in suggestions

**Suffixes (do NOT suggest as ending):**
`-vast, -rix, -kin, -ling, -lith, -veth, -oth, -wing, -axis, -horn, -vorn,
-veil, -crown, -ith (non-lith), -eth (non-veth), -orn (other), -lin,
-ing (non-ling)`

**Prefix stems (do NOT suggest as starting):**
`frost-, spark-, volt-, thunder-, abyss-, luna-, infer-, pyro-, cinder-,
titan-, deep-, zephyr-, stone-, aether-, serp-, dusk-, spectr-, ember-,
glaci-, void-, shadow-`

## Midfix rule (Forgotten X mons)
For "Forgotten X" mons, the midfix (first 3+ chars of X) must NOT match the
prefix of any regular mon's name. e.g. "Forgotten Lumarix" — the midfix
`Lum` collides with Lumkin, Lumiarch, Lumejell, Lumivane, so the rename
must avoid any 3-char start that already prefixes a regular mon.

## Workflow
- Batches of 10, id-ascending.
- For each batch: user picks a name (combo from the 10 prefixes + 10 suffixes,
  or supplies their own). Then we commit the chosen names into `js/data.js`.
- All work on branch `claude/complete-name-renaming-H6XEY`.

---

## Batch 1/20 — Candidates 1–10

### #1/191 — #10 Embrix 🐛 Fire/Bug
Base stage (Embrix → Helioveth → Inferarch)
20cm chubby flame-patterned caterpillar, body segments alternating vivid
orange and smoky black, two antennae glowing orange at the tips. Feeds on
dried bark near volcanic soil; its silk threads are heat-resistant enough
to be woven into flame-proof cloth.
Flagged: exact duplicate of #272 Embrix (Fire/Dragon)

Prefixes: Char, Scorch, Blaze, Flare, Igni, Ignit, Hearth, Magma, Smolder, Lava
Suffixes: -grub, -crawler, -worm, -larva, -bug, -spark, -burn, -singe, -ember, -smolder

### #2/191 — #33 Noxarith 🪸 Water/Poison
Final stage (Toxaquil → Noxaquith → Noxarith)
40cm bright-red anemone-like creature, tentacles tipped in venomous barbs.
Anchors to rocky outcroppings in poison-saturated waters; releases drifting
stinging cells to stun plankton drawn by its vivid colouration.
Flagged: overused -ith (non-lith) group

Prefixes: Brine, Coral, Reef, Tide, Venom, Toxic, Miasm, Marine, Anemo, Septic
Suffixes: -barb, -bloom, -fang, -coil, -drift, -shard, -spike, -plume, -crest, -shroud

### #3/191 — #39 Depthveth 🐬 Water/Wind
Base stage (Depthveth → Marevanos)
3m manta-ray-like creature with gossamer trailing fins, midnight-blue above
and pale silver beneath. Glides silently through cold deep-water channels,
guided by a keen sense of electromagnetic fields.
Flagged: overused -veth group

Prefixes: Mant, Aero, Pelag, Marine, Brine, Cyclo, Squall, Saline, Mirage, Gale
Suffixes: -glide, -drift, -ray, -fin, -pulse, -soar, -plume, -crest, -fang, -coil

### #4/191 — #44 Polarveth 🧊 Ice/Water
Final stage (Cryonik → Boreon → Polarveth)
3m serpentine ice-water creature with translucent blue-white scales and broad
front flippers. Hunts beneath pack ice, surfacing through cracks to ambush
prey at the frozen edge.
Flagged: overused -veth group

Prefixes: Boreal, Hoar, Rime, Polar, Tundra, Floe, Brine, Pack, Algid, Chill
Suffixes: -coil, -fang, -maw, -drift, -surge, -plume, -fin, -talon, -shard, -ridge

### #5/191 — #47 Sleetkin 🐺 Ice
Base stage (Sleetkin → Hailgorge → Frigidvorn)
70cm wolf-like creature with short grey-white fur overlaid by a constantly-
renewing shell of ice crystals. Paws leave hexagonal imprints. Hunts in
packs across tundra, using coordinated flanking to drive prey toward
waiting ambushers.
Flagged: overused -kin group

Prefixes: Sleet, Hoar, Rime, Floe, Tundra, Boreal, Hail, Cryo, Algid, Chill
Suffixes: -fang, -claw, -paw, -howl, -nip, -pup, -cub, -snap, -track, -fur

### #6/191 — #50 Nivelin 🐏 Ice/Normal
Base stage (Nivelin → Shiverling → Permavast)
Stocky ram-like creature with thick white wool and curling horns layered in
old ice. A pale blue tinge runs along its spine. Grazes on frost-covered
highland moss and climbs sheer glacier faces using grip-adapted hooves.
Flagged: overused -lin group

Prefixes: Nive, Floe, Rime, Hoar, Tundra, Boreal, Pack, Algid, Chill, Cryo
Suffixes: -fleece, -wool, -hoof, -ram, -ewe, -tuft, -ridge, -crag, -peak, -mantle

### #7/191 — #55 Rimeling 🗡️ Ice/Crystal
Base stage (Rimeling → Deepfreeze)
1.2m humanoid of layered ice and dark tempered steel, body jointed like
ice-forged armour. Blue veins of compressed frost show through plate gaps.
Stands motionless in blizzards for days, absorbing ambient cold to
reinforce its body.
Flagged: overused -ling group

Prefixes: Rime, Hoar, Quartz, Prism, Lattice, Geode, Beryl, Algid, Boreal, Floe
Suffixes: -plate, -shard, -blade, -edge, -helm, -mantle, -spike, -hilt, -guard, -ward

### #8/191 — #63 Sporix 🍄 Grass/Poison
Base stage (Sporix → Myceloth → Mycovast)
20cm mushroom-topped creature with soft spongy white body and broad
purple-spotted cap. Releases clouds of glittering green spores when
disturbed. Grows in dense clusters on dark damp forest floors; spore clouds
serve as a danger-signal between neighbouring clusters.
Flagged: overused -rix group

Prefixes: Spore, Myco, Mycel, Hyph, Truffle, Mush, Sapro, Toad, Cap, Fungi
Suffixes: -puff, -cap, -dot, -spore, -bud, -frill, -tuft, -shroud, -plume, -spritz

### #9/191 — #64 Myceloth 🍄 Grass/Poison
Mid stage (2/3) (Sporix → Myceloth → Mycovast)
80cm humanoid fungal creature; body a mass of interwoven mycelium threads
under a translucent membrane, flat cap on rounded head. Walks slowly through
forest undergrowth, trailing filaments tied to the underground fungal
network.
Flagged: overused -oth group

Prefixes: Myco, Spore, Mycel, Hyph, Truffle, Mush, Sapro, Fungi, Miasm, Toxic
Suffixes: -cap, -bloom, -shroud, -spore, -plume, -shred, -drift, -tuft, -crest, -frill

### #10/191 — #71 Verdovast 🐻 Grass
Final stage (Germix → Verdurus → Verdovast)
2.5m grass bear, body fully encrusted in thick bark-like growth and
flowering vines. Trees and shrubs spontaneously germinate on its back;
older individuals resemble walking ecosystems. Rarely moves fast but is
nearly impossible to injure through dense living armour.
Flagged: overused -vast group

Prefixes: Verdant, Bramble, Sylv, Briar, Bark, Grove, Canopy, Mossback, Heart, Ancient
Suffixes: -bear, -hide, -pelt, -bough, -trunk, -mantle, -wald, -bulwark, -giant, -behemoth

---

## Pending batches (id-ascending, batches of 10)

- Batch 2/20: #72 Floralin … #94 Petrovast
- Batch 3/20: #95 Dustkin … #119 Shadowvast
- Batch 4/20: #128 Cranivast … #146 Shinarith
- Batch 5/20: #155 Adamavast … #195 Prismolith
- Batch 6/20: #196 Frigolith … #233 Serpenthorn
- Batch 7/20: #234 Permafrix … #272 Embrix
- Batch 8/20: #274 Cindling … #297 Blightwing
- Batch 9/20: #298 Plagueoth … #322 Venomwraith
- Batch 10/20: #324 Chittering … #346 Astralwing
- Batch 11/20: #351 Spectravore … #370 Vortexwing
- Batch 12/20: #373 Voidrend … #395 Glacierend
- Batch 13/20: #397 Abyssalord … #408 Forgotten Auravian
- Batch 14/20: #409 Forgotten Lumarix … #420 Forgotten Pelagor
- Batch 15/20: #422 Forgotten Tidecrest … #432 Forgotten Dreamaith
- Batch 16/20: #433 Forgotten Luneveth … #446 Forgotten Stellarion
