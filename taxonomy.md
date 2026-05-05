# Lumoria archetype taxonomy audit

**Goal:** Classify every family (multi-stage) and standalone into its accurate archetype using the new taxonomy. Surface over-cap groupings and pristine slots.

## Taxonomy rules (per user direction)

**Elemental archetypes (cap = 1 family + 1 standalone per element):**
One per type — 19 elementals total (all 21 types except Fighting and Primal). An "elemental" is a *formless being literally made of an element* (e.g. orb of fire = fire-elemental). Possible: aether-, bug-, crystal-, dark-, dragon-, electric-, fairy-, fire-, ghost-, grass-, ground-, ice-, normal-, poison-, psychic-, rock-, steel-, water-, wind-elemental.

**Natural-disaster-inspired (cap = 1 family + 1 standalone per disaster subtype):**
Single umbrella archetype with per-disaster subtypes. Each subtype cap = 1 family + 1 standalone. Subtypes: thunderstorm, tornado, tsunami, wildfire, earthquake, blizzard, eruption, flood, avalanche, drought, etc.

**Animal archetypes (cap = 3 families per common animal):**
Real-world animal body plans. E.g. wolf, lion, eagle, snake, fish, etc. Mythical exemptions apply for some (dragon, kitsune, tanuki, leshy, etc.).

**Mythical/folkloric archetypes:**
Universally recognized mythological beings. Some are mythical-exempt (no cap): dragon-mythic, kitsune, tanuki, leshy, snowman, sea-fairy queen, mermaid, kraken, wraith, void/cosmic, treant, golem, faerie sprite, will-o-wisp, slime/blob, crystalline-prism, kirin, insect-swarm.

**Classification priority:**
1. If body plan is a real animal → animal archetype
2. If body plan is a recognized mythical creature → mythical archetype
3. If body is formless and made of one element → that element's elemental archetype
4. If body is shaped like a natural disaster (e.g. spinning storm cloud) → natural-disaster subtype
5. Otherwise → flag for unique/other

---

## Per-family classifications

Format: `[final_id] family_name | types | archetype | notes`

### Batch 1 (families 1-70)

- `[3] Solkin→Pyrevix→Calderaeth | Fire/Dragon | dragon-mythic` (sub: fire-dragon-fox/kitsune-dragon hybrid)
- `[6] Aquatter→Cobaleap→Banksnout | Water/Ground | otter (mustelid)`
- `[9] Verdkin→Barknell→Garlawarden | Grass/Fairy | saurian` (sub: bark-dinosaur with petals — borderline treant-saurian hybrid)
- `[12] Scorchlarva→Heliocoon→Inferarch | Fire/Wind | moth (Lepidoptera)`
- `[15] Taurcin→Molteroth→Pyroclasm | Fire/Rock | bull-titan / minotaur` (mythical sub: volcanic bull-titan, bipedal final)
- `[18] Cindercula→Searburn→Bahamber | Fire/Dragon | dragon-mythic` (sub: fire-dragon-serpentine; **name leak in #17: "Pyroveth"**)
- `[21] Magmaurin→Embrath→Terravore | Fire/Ground | saurian / dinosaur`
- `[24] Hallucigaze→Pyraxis→Ignitheon | Fire/Psychic | lion` (final is true lion)
- `[27] Reefling→Aquidon→Tidalossus | Water/Rock | kraken / sea-titan crustacean` (mythical-exempt)
- `[30] Corelin→Neraxis→Nepturix | Water | fish` (deep-sea fish)
- `[33] Toxaquil→Noxaquith→Septanemone | Water/Poison | cephalopod` (sub: anemone-bloomed cephalopod)
- `[36] Pearlith→Undirael→Thalassira | Water/Fairy | sea-fairy queen / mermaid` (mythical-exempt; flagship)
- `[38] Coralossus→Titanariel | Water/Steel | coral-titan humanoid` (mythical sub)
- `[40] Gossafin→Marevanos | Water/Wind | cetacean` (winged whale/manta)
- `[41] Titanomare | Water/Steel | cetacean` (steel-whale titan; standalone)
- `[44] Cryonik→Boreon→Nagislither | Ice/Water | seal / pinniped`
- `[46] Slatis→Frostmere | Ice/Electric | seal / pinniped` (jellyfish-to-seal — second seal family)
- `[49] Hexaprowl→Hailgorge→Frigidvorn | Ice | wolf`
- `[52] Tundram→Shiverling→Permavast | Ice/Normal | bovid` (auroch/ram chain)
- `[54] Mistwhirl→Arcturex | Ice/Wind | owl`
- `[56] Rimeling→Deepfreeze | Ice/Steel | golem` (bipedal armor-warrior)
- `[58] Speculith→Irisarael | Ice/Fairy | faerie sprite` (winged fairy)
- `[60] Lunaveris→Boreadrake | Ice/Dragon | dragon-mythic` (sub: ice-dragon)
- `[62] Gelspike→Gelwing | Ice/Poison | hedgehog / porcupine`
- `[65] Sporix→Myceloth→Mycovast | Grass/Poison | mushroom / fungus`
- `[68] Viridix→Loamvin→Rootvorn | Grass/Ground | snail / mollusk`
- `[71] Germix→Verdurus→Verdovast | Grass | seed-pod / walking-garden` (pristine, just claimed)
- `[74] Floralin→Faelomis→Faevernal | Fairy/Grass | faerie sprite` (flower-fairy variant)
- `[77] Sylvolt→Sparkwood→Thorncharge | Grass/Electric | stag / elk / deer (cervid)`
- `[80] Sylvnox→Morraveth→Morralyn | Grass/Dark | leshy / forest-spirit` (pristine mythical, just claimed)
- `[83] Joltan→Galvanos→Voltanox | Electric | horse / equine`
- `[86] Electrix→Shockharpe→Galvaglide | Electric/Bug | dragonfly` (currently inconsistent: stages mix beetle/mosquito/dragonfly — on BREAKING list; final lore says "Zapoveth" name-leak)
- `[89] Amperix→Sparkrel→Surgolith | Electric/Water | electric eel`
- `[91] Zephyrel→Vortexathos | Electric/Wind | bird-of-prey` (eagle)
- `[94] Arcspine→Stonebolt→Petrovast | Electric/Rock | echidna`
- `[97] Dustkin→Seismith→Tectonvast | Ground/Electric | rhino`
- `[100] Aridix→Toxivenoth→Craterlurk | Ground/Poison | scorpion` (**name leak in #100: "Venomvast"**)
- `[103] Limoux→Dunoloth→Calciderm | Ground/Water | crocodilian` (**name leak in #103: "Crustvast"**)
- `[105] Arenikin→Dravanas | Normal/Ground | lion` (currently; on BREAKING list to pivot to canid)
- `[107] Geodrak→Quakeon | Dragon/Ground | dragon-mythic` (sub: ground-dragon)
- `[110] Silvergust→Siroccomane→Aeolarch | Wind/Electric | lion` (wind-lion)
- `[113] Aeolin→Swirlavel→Cyclavorn | Wind | bird-of-prey` (condor)
- `[115] Nimbusel→Aetherworn | Wind/Dark | cloud-fairy / wraith-fairy`
- `[117] Zephyrin→Pneumathos | Wind/Psychic | wind-elemental` (just claimed pristine)
- `[120] Eclipsehound→Dreadmaw→Nightwolf | Dark | wolf` (**name leak in #120: "Noctovast"**)
- `[122] Spiraloom→Caveshroud | Dark/Wind | bat` (**name leak in #122: "Umbraveth"**)
- `[125] Nocturil→Phantorvex→Venotitan | Dark/Poison | serpent` (**name leak in #125: "Phantomvast"**)
- `[127] Impefurr→Specraxis | Dark/Psychic | kitsune` (mythical, just claimed)
- `[129] Cranivade→Voidaxis | Psychic/Dark | void / cosmic abstract being` (mythical)
- `[131] Necralia→Necrothon | Dark/Grass | treant / walking-tree spirit` (mythical)
- `[133] Volcascale→Monolithox | Rock/Dark | saurian` (with rock-monolith plate-shell — could double-classify as rock-monolith)
- `[136] Aeronyx→Steelvex→Metalibat | Steel/Dark | bat` (**name leak in #136: "Ferrovast"**)
- `[139] Goldefluff→Aetherael→Lumiarch | Fairy | fairy-hound` (canine-fairy mythical)
- `[141] Faeling→Iridesoar | Fairy/Wind | butterfly` (**name leak in #141: "Prisoveth"**)
- `[144] Dawnirel→Lunarael→Celestarch | Fairy/Psychic | star / celestial cosmic` (mythical)
- `[146] Faerrin→Shinarith | Fairy/Steel | golem` (fairy-armored guardian)
- `[149] Scrapsapien→Stoicguard→Eternarmor | Steel | golem` (**name leak in #149: "Adamovast"**)
- `[151] Gearon→Alloytron | Steel/Electric | golem / automaton` (electric-mechanical)
- `[152] Imperion | Crystal/Rock | tortoise` (standalone, current types odd — described as steel-rock tortoise)
- `[154] Dentshaft→Terragolem | Steel/Ground | golem` (**name leak in #154: "Titanolith"**)
- `[156] Toxirin→Venekon | Poison/Water | frog / toad`
- `[159] Acidelix→Corrodisc→Dissotoad | Poison/Ground | frog / toad` (**name leak in #159: "Acidovast"** — second toad family)
- `[161] Miasmafly→Mistbane | Poison/Wind | insect-swarm collective` (mythical, just claimed)
- `[163] Marlix→Blightalis | Poison/Grass | corrupted flower / plant-humanoid`
- `[165] Blightmite→Venowarn | Poison/Bug | butterfly` (**name leak in #165: "Noxoveth"** — second butterfly family)
- `[167] Projectery→Psychovast | Psychic | dog (non-wolf canine)`
- `[169] Espelith→Aurarael | Psychic/Fairy | crystalline-prism` (mythical)
- `[170] Oneiron | Psychic/Dark | dream-entity / wisp` (formless, standalone)
- `[171] Drakorius | Psychic/Dragon | dragon-mythic` (sub: psychic-dragon, standalone)
- `[174] Scalurin→Serpenthos→Scalevorn | Dragon/Steel | dragon-mythic` (sub: steel-dragon)

### Batch 2 (families 71-105)

- `[175] Biolumal | Water/Dragon | dragon-mythic` (sub: water-dragon, standalone; **name leak: "Neruveth"**)
- `[176] Chromena | Electric/Dragon | dragon-mythic` (sub: electric-dragon, standalone; **name leak: "Tempyroth"**)
- `[177] Sapphier | Ice/Dragon | dragon-mythic` (sub: ice-dragon, standalone; **name leak: "Glaciroth"**)
- `[179] Fluffen→Velvetine | Normal | cat` (housecat)
- `[181] Leapbun→Racehare | Normal | rabbit / hare` (**name leak in #181: "Boundrix"**)
- `[184] Rotunden→Glutoros→Behemovast | Normal | bear` (titanic bear)
- `[186] Hoverrow→Continemic | Normal/Wind | bird` (albatross — **name leak in #186: "Airovast"**)
- `[188] Norindel→Plentorus | Normal | boar / pig`
- `[190] Woolcalm→Aetherflock | Normal/Psychic | sheep / bovid` (psychic sheep — second bovid family alongside Tundram line)
- `[192] Pebblet→Boulderoll | Rock/Ground | golem` (boulder humanoid; **name leak in #192: "Lithavast"**)
- `[194] Rugothon→Lithomere | Rock/Water | crab / crustacean` (rock-water crab)
- `[196] Prismolith→Frigolith | Rock/Ice | rock-monolith / standing stone` (boulder partially submerged in permafrost)
- `[199] Photoworm→Chrysalix→Aeridaleth | Bug/Wind | butterfly` (Lepidoptera — third butterfly/moth family)
- `[201] Iridibeetle→Scarabion | Bug/Steel | beetle / scarab`
- `[203] Sculptweave→Arachnalis | Bug/Fairy | spider`
- `[205] Muddite→Quarrix | Bug/Ground | beetle` (second beetle family — Quarrix + Iridibeetle line)
- `[208] Venomscale→Venodrak→Wyrmvenom | Poison/Dragon | dragon-mythic` (sub: poison-dragon)
- `[210] Boltfur→Thundermane | Normal/Electric | rabbit / hare` (giant maned hare — second hare alongside Leapbun line)
- `[213] Cinderfrost→Frostscorch→Infriglace | Fire/Ice | fire-ice titan` (dual-element titan, unique body plan — flag as unique mythical)
- `[214] Petrwave | Water/Rock | crab / crustacean` (coral-fortress crab, standalone — second crab alongside Rugothon line)
- `[217] Veilwisp→Mindrift→Distorsion | Psychic | psychic-elemental` (formless distortion in air — **name leak: "Mentovast"**; sole psychic-elemental)
- `[219] Duskmist→Nightmont | Dark | dark-elemental / formless mountain` (3m formless darkness with red-pinpoint eyes — sole dark-elemental candidate)
- `[221] Umbrajest→Shadowveil | Dark/Psychic | wraith` (cloaked humanoid shadow)
- `[224] Mindpuff→Recallum→Psytheon | Psychic/Fairy | faerie sprite` (winged psychic-fairy humanoid with crystal wings)
- `[225] Crealight | Psychic/Fairy | will-o-wisp / faerie sprite` (small glowing creative-energy fairy; standalone — **name leak: "Glimmerkin"**)
- `[227] Spectroo→Spectrace | Fire/Psychic | kangaroo (marsupial)` (fire-marsupial branch of Spectroo evolution tree)
- `[228] Lunaroon | Grass/Psychic | kangaroo (marsupial)` (moonlight branch of Spectroo line — second marsupial family + alt Spectroo branch)
- `[229] Radiafish | Electric/Psychic | kangaroo (marsupial)` (electric branch of Spectroo line — third marsupial / alt Spectroo branch)
- `[231] Scaleling→Wyvaxis | Dragon/Water | dragon-mythic` (sub: water-dragon — second water-dragon alongside Biolumal)
- `[234] Serphaxon→Serpenthorn→Wyvernak | Dragon/Ground | dragon-mythic` (sub: ground-dragon — second ground-dragon alongside Geodrak line)
- `[235] Glintscale | Dragon/Water | dragon-mythic` (sub: water-dragon, standalone — third water-dragon)
- `[237] Frostick→Icevault | Ice/Rock | ice-stone vault / fortress structure` (small architectural creature — unique sub-archetype)
- `[240] Snowble→Blizzariel→Tundrafox | Ice/Dark | snowman (folkloric)` (mythical, just claimed)
- `[241] Shardlix | Ice/Psychic | crystalline-prism` (bipedal ice crystal humanoid, standalone — second crystalline-prism alongside Espelith line)
- `[243] Pulseglow→Stuntrap | Electric/Bug | dragonfly` (firefly→dragonfly — second dragonfly alongside Electrix line)

### Batch 3 (families 106-139) — IN PROGRESS

(Continuing in next pass.)

---

## Name leaks identified during audit (for mass-fix phase)

These are stages where the lore opens with an old/different name than the `name:` field. Adding to the existing 33-name-leak mass-fix task.

From batch 1:
- #17 Searburn → lore says "Pyroveth"
- #100 Craterlurk → lore says "Venomvast"
- #103 Calciderm → lore says "Crustvast"
- #120 Nightwolf → lore says "Noctovast"
- #122 Caveshroud → lore says "Umbraveth"
- #125 Venotitan → lore says "Phantomvast"
- #136 Metalibat → lore says "Ferrovast"
- #141 Iridesoar → lore says "Prisoveth"
- #149 Eternarmor → lore says "Adamovast"
- #154 Terragolem → lore says "Titanolith"
- #159 Dissotoad → lore says "Acidovast"
- #165 Venowarn → lore says "Noxoveth"

(Continuing in further batches.)

---

## Archetype tallies (running)

Will be compiled at end of audit. Pristine slots and over-cap groupings flagged here for trim.
