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
- `[56] Rimeling→Deepfreeze | Ice/Fighting | armored-warrior` (bipedal armor-warrior; retyped Ice/Metal→Ice/Fighting for diversity)
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

### Batch 3 (families 106-139)

- `[246] Staticlaw→Thundravex→Megavolt | Electric | wolverine (mustelid)`
- `[247] Sparkeen | Electric/Bug | beetle` (small electric beetle, standalone — third beetle alongside Iridibeetle and Quarrix lines; emoji butterfly is mismatch — flag)
- `[250] Pebblard→Boulderax→Megalith | Rock/Ground | rock-monolith / standing stone` (second rock-monolith alongside Prismolith line)
- `[252] Crumblite→Stonegrip | Metal/Mineral | golem` (metal-mineral humanoid; retyped Earth/Metal→Metal/Mineral for diversity)
- `[253] Ashrock | Rock/Fire | rock-elemental` (formless basalt with magma veins, standalone — could equally be fire-elemental; lean rock-elemental since body is rock)
- `[255] Bubblepuff→Psychotide | Water/Psychic | water-elemental` (wave humanoid, formless water — sole water-elemental candidate; **name leak in #255: "Wavrix"**)
- `[258] Scolphin→Reefhorn→Torrentox | Water/Ice | cetacean` (orca/calf — second cetacean alongside Gossafin line + Titanomare standalone + Tidephant)
- `[259] Lumejell | Water/Psychic | jellyfish / cnidarian` (psychic-jellyfish, standalone — second jelly alongside Slatis-line origin)
- `[261] Sproutix→Leafhorn | Grass/Fairy | stag / deer (cervid)` (faun — second cervid alongside Sylvolt line)
- `[264] Transluceed→Tendrilisk→Impenezard | Grass/Poison | treant / walking-tree spirit` (walking thorn-bush — **name leak in #264: "Thornvast"**; second treant alongside Necralia line)
- `[265] Mosswing | Nature/Wind | moth` (moss-winged moth, standalone — third Lepidoptera alongside Inferarch and Aeridaleth lines; retyped Nature→Nature/Wind for diversity + flight)
- `[268] Shadowpup→Nightclaw→Darkfang | Dark/Sonic → Dark/Spectral | wolf` (dark-wolf — third wolf alongside Hexaprowl and Eclipsehound lines; type-shift on final evo: pups are Dark/Sonic "howl resonates / echolocation", Darkfang matures into Dark/Spectral "heard in the land of the dead")
- `[270] Grimshade→Eclipsoon | Dark/Fairy | tanuki` (mythical, just claimed)
- `[271] Murkrat | Dark/Normal | rat (rodent)` (standalone)
- `[273] Embrix→Blazeon | Fire/Dragon | dragon-mythic` (sub: small fire-dragon — third fire-dragon alongside Calderaeth and Bahamber lines)
- `[276] Cindling→Infernox→Scorchvast | Fire/Rock | saurian` (igneous lizard with rock plates — second fire-saurian alongside Magmaurin/Terravore line)
- `[277] Magmite | Fire/Ground | fire-elemental` (lava droplet, formless walking magma — sole fire-elemental candidate, standalone)
- `[279] Ironling→Steelhorn | Steel/Fairy | unicorn / single-horn fairy-equine` (single-horned humanoid — borderline; could be golem variant or pristine unicorn slot)
- `[282] Gearbit→Cogvex→Mechavast | Steel/Ground | golem / industrial automaton`
- `[283] Rustpike | Steel/Poison | fish` (rusting-iron pike, standalone — second fish family alongside Corelin line; could also classify as steel-elemental?)
- `[285] Fluffkin→Cloudrift | Normal/Wind | cloud-elemental / wisp` (compact cloud with face — formless cloud being; under cap, but flag — could be wind-elemental too)
- `[288] Fuzzlet→Cuddrix→Majesticore | Dragon/Fairy | kirin` (mythical, just claimed)
- `[289] Bouncyblob | Normal | slime / blob` (mythical, standalone)
- `[290] Mimiclaw | Normal/Dark | cat` (mimic-cat — second cat alongside Fluffen line + Cinderpaw + Emberveil)
- `[292] Breezekin→Galehorn | Wind/Electric | antelope` (pristine archetype)
- `[295] Gustpuff→Stormwing→Cyclonax | Wind/Dragon | dragon-mythic` (sub: wind-dragon)
- `[298] Plaguefly→Blightwing→Plagueoth | Poison/Bug | moth` (Lepidoptera — currently inconsistent stages, on BREAKING list — fourth moth/butterfly family)
- `[300] Stinglet→Nettleclaw | Bug/Poison | bee (Hymenoptera)` (currently inconsistent — bee→scorpion-bee hybrid on BREAKING list)
- `[301] Emberveil | Fire/Spectral | cat` (smouldering ghost-cat, standalone — third cat; retyped Fire/Dark→Fire/Spectral for diversity)
- `[303] Lightpuff→Lumivane | Fairy/Mental | starlight-orb` (luminous starlight sphere with non-severing light-limbs that archives astronomical data — NOT a faerie-sprite humanoid; archetype relabeled to resolve the false collision with Psytheon, which keeps the faerie-sprite slot. Stays Fairy/Mental.)
- `[306] Icethorn→Geoshard→Crystallon | Rock/Ice | rock-monolith / standing stone` (third rock-monolith alongside Prismolith and Pebblard lines)
- `[307] Cinderpaw | Fire/Dark | cat` (fire-dark cat, standalone — fourth cat)
- `[309] Seafraith→Tidephant | Water/Dark | cetacean` (whale — fourth cetacean alongside Gossafin/Titanomare/Scolphin lines; on BREAKING list — fish→cetacean class jump)
- `[311] Mudpump→Marshix | Ground/Water | hippo` (pristine archetype)

### Batch 4 (families 140-173)

- `[313] Dunecrawl→Sandrix | Ground/Dark | armadillo` (pristine archetype, just claimed)
- `[314] Galeaxis | Wind/Electric | dog (non-wolf canine)` (greyhound, standalone)
- `[315] Ashvanus | Fire/Rock | volcanic-vent creature` (unique — "volcanic vent that has grown a body" with magma core; borderline rock-elemental vs unique. Standalone)
- `[316] Abyssovex | Water/Dark | cephalopod` (deep-sea squid leviathan, standalone — second cephalopod alongside Toxaquil line)
- `[317] Temporith | Psychic/Dragon | dragon-mythic` (sub: psychic-dragon — second psychic-dragon alongside Drakorius)
- `[318] Gaiavorn | Ground/Grass | golem / earth-titan` (4m titan with living forest canopy — variant golem; could double as treant — flag)
- `[319] Voidraxis | Dark/Fairy | void / cosmic abstract being` (mythical — second void/cosmic alongside Voidaxis)
- `[320] Galvathon | Steel/Electric | golem` (mechanical titan)
- `[321] Dragemian | Dragon/Fire | dragon-mythic` (sub: fire-dragon — fourth fire-dragon alongside Calderaeth/Bahamber/Blazeon)
- `[322] Venomwraith | Poison/Ghost | wraith` (translucent spectral being — fourth wraith alongside Shadowveil/Wraithking/Shadowreave)
- `[323] Toxicore | Poison/Fire | unique vessel-creature` (living flask/chemistry-vessel with internal acid; distinct from elemental; flag as unique)
- `[324] Chittering | Bug/Dark | mantis / blade-limbed insect` (sleek dark insect with 6 blade-limbs; pristine sub-archetype)
- `[325] Dunespike | Ground/Poison | mole-rat / rodent` (armored mole-rat — second rodent alongside Murkrat)
- `[326] Silthorn | Grass/Poison | treant / walking-plant` (third treant alongside Necralia and Impenezard lines)
- `[327] Quarrex | Rock/Ground | rock-monolith / golem hybrid` (interlocked granite slabs; could double-classify)
- `[328] Smogveil | Poison/Wind | poison-elemental` (amorphous yellow-green storm cloud, formless, sole poison-elemental)
- `[329] Skullmite | Bug/Rock | beetle` (helmet-shaped carapace — fourth beetle alongside Iridibeetle/Quarrix/Sparkeen/Voltbeetle)
- `[330] Blistermaw | Water/Poison | crocodilian` (acid-weeping croc — second crocodilian alongside Limoux line)
- `[331] Thornmoth | Bug/Grass | moth` (bug-grass moth — sixth Lepidoptera)
- `[332] Glacicore | Ice/Steel | golem` (ice-steel humanoid armor — second armor-suit alongside Deepfreeze)
- `[333] Voltfang | Electric/Dark | wolf` (electric-dark wolf — fourth wolf alongside Hexaprowl/Eclipsehound/Shadowpup)
- `[334] Ferrocrush | Metal/Fighting | golem` (metal brawler golem; retyped Metal/Fire→Metal/Fighting for diversity)
- `[335] Frostprowl | Ice/Wind | feline (snow-leopard / cheetah)` (ice-wind feline — distinct from cat/lion; pristine snow-cat sub-archetype)
- `[336] Coilstrike | Electric/Poison | serpent (non-dragon)` (electric-poison snake)
- `[337] Ashgolem | Fire/Rock | golem` (fire-rock golem — explicitly named)
- `[338] Rimeclaw | Ice/Wind | bird-of-prey` (raptor — fourth raptor alongside Vortexathos/Cyclavorn/Zephyrak)
- `[339] Voltbeetle | Bug/Electric | beetle` (fifth beetle)
- `[340] Cryoshard | Ice/Sonic | resonant-crystal` (resonant crystal-prism; retyped Ice/Mental→Ice/Sonic to break the Ice/Mental crystalline-prism clash with Shardlix — Shardlix keeps the crystalline-prism slot, Cryoshard pivots to a sound-resonance identity)
- `[341] Mirestone | Rock/Psychic | rock-monolith / standing stone` (fourth rock-monolith)
- `[342] Wraithking | Ghost/Dark | wraith` (fifth wraith)
- `[343] Shadowreave | Dark/Psychic | wraith / shadow-being` (sixth wraith)
- `[344] Glimmeritch | Fairy/Ghost | wraith / spectral fairy hybrid` (seventh wraith — borderline faerie-sprite)
- `[345] Voidcoil | Dark/Dragon | dragon-mythic` (sub: dark-dragon serpent)
- `[346] Astralwing | Psychic/Wind | psychic-elemental` (winged humanoid of solidified psychic energy — second psychic-elemental alongside Veilwisp/Distorsion)

### Batch 5 (families 174-209)

Legendary tier (`ngPlusTier`) confirmed for: #379, #380, #389, #392, #394, #395, #398, #400, #401, #402-407 (Mirkling pseudolegendary line). Tagged `[LEGEND tN]` where applicable below.

- `[347] Embersteel | Steel/Fire | golem` (superheated steel guardian-automaton — third+ steel golem)
- `[348] Galedrake | Dragon/Wind | dragon-mythic` (sub: wind-dragon — second wind-dragon alongside Cyclonax)
- `[349] Crystavault | Ice/Rock | golem / fortress-tower` (layered ice/granite tower; borderline rock-monolith)
- `[350] Fernwrath | Grass/Dragon | dragon-mythic` (sub: grass-dragon, sole)
- `[351] Spectravore | Fairy/Psychic | rainbow / prismatic being` (iridescent humanoid silhouette with all-colour aura — unique sub)
- `[352] Voidlord | Dark/Psychic | void / cosmic abstract being` (mythical — third void/cosmic alongside Voidaxis/Voidraxis)
- `[353] Infernotitan | Fire/Dragon | dragon-mythic` (sub: fire-dragon — fifth fire-dragon)
- `[354] Riftwhale | Water/Psychic | cetacean` (psychic-whale, 12m — fifth cetacean)
- `[355] Abyssalith | Water/Dark | eel` (armoured eel — second eel alongside Surgolith)
- `[356] Stormlord | Electric/Dragon | dragon-mythic` (sub: electric-dragon — second electric-dragon alongside Chromena)
- `[357] Thornspire | Grass/Steel | treant` (8m steel-branched tree — fourth treant)
- `[358] Pyrocrown | Fire/Psychic | phoenix / solar bird` (mythical-exempt — sole phoenix family)
- `[359] Glaciarch | Ice/Psychic | golem` (idealised ice humanoid)
- `[360] Duskmantle | Dark/Fairy | duality being` (half-fairy half-shadow; unique sub-archetype)
- `[361] Tectolith | Ground/Dragon | dragon-mythic` (sub: ground-dragon — third ground-dragon)
- `[362] Lunaspectre | Psychic/Ghost | wraith` (moonlight humanoid silhouette — eighth wraith. **⚠ Pre-408 with Ghost typing — flag per CLAUDE.md**)
- `[363] Chromavast | Normal/Psychic | colour-shifting being` (smooth ovoid cycling all colours — unique sub)
- `[364] Deepcrawler | Water/Steel | crustacean` (deep-sea armored crab — third crustacean alongside Tidalossus/Petrwave/Lithomere)
- `[365] Cinderking | Fire/Dark | royal humanoid being` (regal bipedal with crown of black fire — unique royal sub; close to wraith)
- `[366] Starlance | Psychic/Steel | weapon-creature` (telekinetic lance-shaped entity — unique sub)
- `[367] Bouldertide | Water/Rock | rock-monolith / sea-stack` (walking sea-stack — fifth rock-monolith)
- `[368] Willowisp | Ghost/Fire | will-o-wisp` (mythical sole)
- `[369] Gravithorn | Psychic/Ground | psychic-elemental / golem` (compressed-stone humanoid with gravity inversion)
- `[370] Vortexwing | Wind/Electric | thunderstorm-disaster` (over cap with Tempestborn/Nullstorm)
- `[371] Nullform | Dark/Normal | shapeshifter / mimic` (matte-black form-shifter — second mimic alongside Mimiclaw)
- `[372] Prismancer | Psychic/Dragon | dragon-mythic` (sub: psychic-dragon — third psychic-dragon)
- `[373] Voidrend | Dark/Ghost | void / cosmic` (reality-tearing dark-ghost — fourth void/cosmic. **⚠ Pre-408 with Ghost typing**)
- `[374] Auroradrake | Ice/Dragon | dragon-mythic` (sub: ice-dragon — third ice-dragon)
- `[375] Fluxserpent | Electric/Psychic | electric-elemental serpent` (current-loop serpent — sole electric-elemental candidate; or could classify as serpent variant)
- `[376] Solarwrath | Fire/Fairy | phoenix / solar-being` (solar plasma — second solar archetype with Pyrocrown)
- `[377] Abyssforge | Earth/Mineral | golem` (planetary-core-pressure alloy; retyped Earth/Metal→Earth/Mineral for diversity)
- `[378] Dreamweald | Psychic/Fairy | dream-entity` (visible only to half-asleep; second dream-entity alongside Oneiron)
- `[379] Riftscale | Wind/Dragon | dragon-mythic [LEGEND t2]` (sub: wind-dragon — third wind-dragon alongside Cyclonax/Galedrake)
- `[380] Tempestborn | Electric/Wind | thunderstorm-disaster [LEGEND t2]` (over cap)
- `[381] Crystalmind | Psychic/Steel | crystalline-prism` (geometric polyhedron — fourth crystalline-prism)
- `[382] Oblivionwing | Dark/Dragon | dragon-mythic` (sub: dark-dragon — second dark-dragon alongside Voidcoil)

### Batch 6 (families 210-243)

- `[383] Apexblade | Steel/Dragon | dragon-mythic` (sub: steel-dragon — second steel-dragon alongside Scalevorn)
- `[384] Solarcrown | Fire/Psychic | phoenix / solar-being` (third solar archetype with Pyrocrown/Solarwrath)
- `[385] Permafrost | Ice/Ground | golem` (glacial boulder humanoid)
- `[386] Wraithstorm | Ghost/Electric | wraith` (translucent humanoid in lightning bolts — ninth wraith)
- `[387] Deepvoid | Dark/Water | void / cosmic abstract being` (sub: aquatic void — fifth void/cosmic)
- `[388] Chronolith | Rock/Psychic | rock-monolith` (psychic-stone with frozen moments — sixth rock-monolith)
- `[389] Stormcrown | Electric/Dragon | dragon-mythic [LEGEND t2]` (sub: electric-dragon — third electric-dragon)
- `[390] Voidgarden | Fairy/Dark | plant-humanoid / fairy-flower-being` (luminous flowers + dark thorned vines humanoid; sub of corrupted-flower archetype with Blightalis)
- `[391] Titanfang | Normal/Dragon | dragon-mythic` (sub: normal-dragon, ancient apex predator scale)
- `[392] Eondrake | Dragon/Psychic | dragon-mythic [LEGEND t3]` (sub: time-dragon — fourth psychic-dragon)
- `[393] Nullstorm | Dark/Electric | thunderstorm-disaster` (over cap)
- `[394] Solarvast | Fire/Dragon | dragon-mythic [LEGEND t3]` (sub: solar-dragon / fire-dragon — sixth fire-dragon)
- `[395] Glacierend | Ice/Dragon | dragon-mythic [LEGEND t4]` (sub: ice-dragon — fourth ice-dragon)
- `[396] Thunderpeak | Electric/Steel | electric-elemental / lightning-bolt being` (lightning-bolt-shaped living metal — sole electric-elemental candidate alongside Fluxserpent — flag for trim)
- `[397] Abyssalord | Water/Ghost | wraith / spectral leviathan` (tenth wraith — spectral-cetacean variant)
- `[398] Voidcrown | Dark/Fairy | void / cosmic abstract being [LEGEND t4]` (sixth void/cosmic; flagship for archetype)
- `[399] Stonekeeper | Rock/Ghost | wraith / mountain-spirit` (eleventh wraith — mountain-peak ghost)
- `[400] Primordiax | Fire/Ground | primordial titan [LEGEND t4]` (cooling lava + deep rock titan; pristine primordial-titan archetype)
- `[401] Cosmoveil | Psychic/Fairy | void / cosmic abstract being [LEGEND t4]` (seventh void/cosmic — starlight-cosmic variant; flagship)
- `[404] Scalit→Dracomind→Veildrak | Dragon/Psychic | dragon-mythic [LEGEND t1 pseudo]` (sub: psychic-dragon pseudolegendary — fifth psychic-dragon)
- `[407] Mirkling→Umbrasteel→Voidwarden | Dark/Steel | bipedal warden / boundary-sentinel [LEGEND t1 pseudo]` (just claimed pristine mythical-exempt)

#### Forgotten / post-game (id ≥ 408)

These are all post-game legendary-tier, mostly with cryptic short lore. Classifications are best-guess based on type/emoji/name; flag any that need fuller body-plan reframing later. All are exempt from pre-408 typing restrictions (Aether/Fighting/Crystal/Primal/Ghost allowed).

> **Forgotten audit (2026-06-08):** the 39 Forgotten (data.js ids 462–500; old taxonomy ids 408–446, offset −54) were fully re-typed and re-archetyped per the per-wielder theme pass — the `| types | archetype |` fields below are **current**, but the trailing parenthetical notes are **stale historical breadcrumbs** from the original best-guess pass. Note the 486↔488 (Psydrak↔Dreamaith) identity swap. Canonical archetypes + appearance briefs live in `docs/forgotten-art-prompts.md`.

- `[408] Forgotten Auravian | Aether/Primal | aether-divine messenger` (winged divine messenger — pristine aether-elemental candidate)
- `[409] Forgotten Lumarix | Crystal/Stellar | constellation-being` (light-refracting body — variant crystalline-prism + fairy hybrid)
- `[410] Forgotten Celestrix | Aether/Crystal | seraph` (pristine post-game angelic archetype)
- `[411] Forgotten Nyxviper | Dark/Chrono | temporal-assassin` (collective-nightmare manifestation; bat emoji)
- `[412] Forgotten Morrath | Dark/Primal | darkfire elemental` (paradoxical fire-that-darkens-rooms — unique sub)
- `[413] Forgotten Duskmourn | Crystal/Chrono | stopped-clock being` (spider emoji; post-game spider)
- `[414] Forgotten Electrak | Electric/Crystal | tesla-coil being` (likely dragon based on scales)
- `[415] Forgotten Arcvolt | Electric/Chrono | fulgurite / petrified-lightning being` (scales form geological strata over time)
- `[416] Forgotten Fulgureis | Electric/Primal | typhon` (tornado emoji + Bug/Water — borderline)
- `[417] Forgotten Rootborn | Poison/Primal | mandragora` (fifth treant)
- `[418] Forgotten Tellurak | Crystal/Primal | geode-being` (mountain-golem)
- `[419] Forgotten Gaiasurge | Primal/Fighting | atlas` (volcano emoji; Fighting type — post-game allowed)
- `[420] Forgotten Pelagor | Aquatic/Chrono | oracle-seer` (sixth cetacean — post-game)

### Batch 7 (families 244-269) — Forgotten / post-game continued

Same caveat: Forgotten lores are narrative-focused; classifications are best-guess from type/emoji/name and need user-led body-plan reframing later if precision matters.

- `[421] Forgotten Bathykor | Aquatic/Stellar | anglerfish` (toxin causes paralysis; sharkemoji)
- `[422] Forgotten Tidecrest | Aquatic/Primal | leviathan` (post-game; "ocean flowed around it" — flagship sub)
- `[423] Forgotten Aetherveil | Aether | wind-chime being` (post-game; butterfly-like wings of air-and-light)
- `[424] Forgotten Zephyrak | Wind/Crystal | harpy` (eagle with steel-feathers — fifth raptor, post-game)
- `[425] Forgotten Skydrak | Wind/Stellar | roc` (sub: ghost-dragon — post-game; -drak suffix)
- `[426] Forgotten Pyraeon | Fire/Crystal | nemean-lion` (Dravek's lion — post-game lion)
- `[427] Forgotten Emberon | Fire/Chrono | sabertooth / smilodon` (post-game tiger — pristine sub for tiger)
- `[428] Forgotten Dracofire | Draconic/Primal | primal-dragon` (sub: poison-dragon, palm-sized hatchling — second poison-dragon alongside Wyrmvenom)
- `[429] Forgotten Frigalum | Ice/Crystal | arctic-fox` (post-game fox — second kitsune alongside Specraxis; Forgotten = mythical-exempt)
- `[430] Forgotten Cryvorn | Ice/Chrono | fenrir` (post-game wolf — fifth wolf)
- `[431] Forgotten Frostdrax | Ice/Primal | ymir / frost-giant` (sub: ghost-fairy-dragon — post-game; -drax suffix)
- `[432] Forgotten Dreamaith | Dream/Aether | sandman` (post-game owl — second owl alongside Arcturex)
- `[433] Forgotten Luneveth | Stellar/Dream | moonlight-fairy` (post-game moonlight water-fairy)
- `[434] Forgotten Psydrak | Dream/Chrono | dream-dragon` (sub: psychic-dragon — sixth psychic-dragon)
- `[435] Forgotten Ironvast | Metal/Crystal | ankylosaurus` (post-game robotic-golem)
- `[436] Forgotten Forgerak | Metal/Aether | smith / forge-spirit` (Rax's smith — unique forge-being archetype)
- `[437] Forgotten Alloydrax | Metal/Chrono | talos` (sub: steel-alloy dragon — third steel-dragon)
- `[438] Forgotten Volteon | Chrono | clockwork-being` (predictive-model running mechanical entity)
- `[439] Forgotten Sparkeis | Aether/Chrono | hourglass-being` (electric crystal — fifth crystalline-prism)
- `[440] Forgotten Thunderax | Chrono/Primal | chronos / father-time` (lightning emoji + wind/grass — post-game)
- `[441] Forgotten Nihilax | Stellar/Spectral | silence-being` (eighth void/cosmic; void emoji)
- `[442] Forgotten Vantarix | Chrono/Stellar | silhouette-being` (cosmic emoji + bug; unique sub)
- `[443] Forgotten Abysdrak | Primal/Stellar | apophis` (sub: wind-dragon — fourth wind-dragon)
- `[444] Forgotten Cosmolith | Aether/Stellar | celestial-globe / star-chart being` (ninth void/cosmic; cosmic emoji + scale-patterns)
- `[445] Forgotten Stardrax | Stellar/Sonic | supernova-being` (sub: star-dragon — seventh fire-dragon)
- `[446] Forgotten Stellarion | Stellar | star-spirit` (telescope emoji + named "wonder"; unique observatory archetype, last in the dex)

### Audit complete — 269 families classified.

---

## Archetype tallies — over-cap groupings flagged

(Compiled from all 269 family classifications above. Caps: animals = 3 families, elementals = 1 family + 1 standalone per element, disaster subtypes = 1 family + 1 standalone per disaster, mythical-exempt = no cap.)

### Over-cap (needs trim)

| Archetype | Count | Cap | Trim | Notes |
|---|---|---|---|---|
| **dragon-mythic** | ~30 | exempt | — | Mythical-exempt; sub-flavor diversity is high. No trim. |
| **wraith / spectre** | 11 | exempt | — | Mythical-exempt. Sub-types vary (humanoid wraith, leviathan, mountain-spirit, etc.). |
| **golem** | 11+ | exempt or 3 | trim ~5-8 | If treated as mythical-exempt: keep all. If common archetype: trim hard. **Decision needed.** |
| **wolf** | 5 (post pivots) | 3 | trim 2 | Hexaprowl, Eclipsehound, Shadowpup, Voltfang, Cryvorn. (Mirkling/Morraveth lines already pivoted.) |
| **fire-dragon** (sub) | 7 | n/a (under dragon-mythic) | discuss | If sub-caps applied: way over. |
| **psychic-dragon** (sub) | 6 | n/a | discuss | Same. |
| **lion** | 3 (post Dravanas pivot) | 3 | at cap | Siroccomane, Ignitheon, Pyraeon-postgame. Dravanas planned for canid pivot. |
| **cetacean** | 6 | 3 | trim 3 | Marevanos, Titanomare, Torrentox, Riftwhale, Tidephant, Pelagor-postgame. |
| **moth/butterfly (Lepidoptera)** | 6 | 3 | trim 3 | Inferarch, Aeridaleth, Venowarn, Mosswing, Thornmoth, Plagueoth. |
| **beetle** | 5 | 3 | trim 2 | Iridibeetle, Quarrix, Sparkeen, Skullmite, Voltbeetle. |
| **rock-monolith / standing stone** | 6 | 3 | trim 3 | Frigolith, Megalith, Crystallon, Mirestone, Bouldertide, Chronolith. |
| **crystalline-prism** | 5 | 3 | trim 2 | Aurarael, Shardlix, Cryoshard, Crystalmind, Sparkeis-postgame. |
| **bird-of-prey / raptor** | 5 | 3 | trim 2 | Vortexathos, Cyclavorn, Rimeclaw, Zephyrak-postgame, plus eagle-flavor on others. |
| **treant / walking-tree** | 5 | exempt | — | Necralia, Impenezard, Thornspire, Silthorn, Rootborn-postgame. Treant is mythical-exempt. |
| **void / cosmic abstract** | 9 | exempt | — | Voidaxis, Voidraxis, Voidlord, Voidrend, Deepvoid, Voidcrown, Cosmoveil, Nihilax, Cosmolith. Mythical-exempt. |
| **cat (housecat / non-lion)** | 4 | 3 | trim 1 | Velvetine, Mimiclaw, Emberveil, Cinderpaw. |
| **thunderstorm-disaster** | 3 | 1+1 | trim 1-2 | Vortexwing, Tempestborn, Nullstorm. (See storm-elemental TODO entry.) |
| **fire-dragon legendary cluster** | 3 (Dragemian, Infernotitan, Solarvast) + chain finals (Calderaeth, Bahamber, Blazeon, Stardrax) | n/a | discuss | All under dragon-mythic exempt but sub-flavor crowded. |

### At cap (no action)

- bear: 3 (Frigidvorn, Permavast, Rotunden line)
- saurian/dinosaur: 3 (Verdkin/Garlawarden, Magmaurin/Terravore, Cindling/Scorchvast). Plus Volcascale/Monolithox = 4 — **trim 1 candidate.**
- frog/toad: 2 (Toxirin, Acidelix lines)
- crocodilian: 2 (Limoux line, Blistermaw)
- hare/rabbit: 2 (Leapbun, Boltfur lines)
- bovid: 3 (Tundram, Aetherflock-sheep, Pyroclasm-bull-titan?)
- crustacean: 4 (Tidalossus, Lithomere, Petrwave, Deepcrawler) — **trim 1.**
- dragonfly: 2 (Galvaglide, Stuntrap)
- mustelid: 3 (Banksnout-otter, Megavolt-wolverine — pristine 2; need a 3rd consideration)

### Pristine slots (1 family or 1 family + 1 standalone)

**Real animal pristine (single family):** boar (Plentorus), horse (Voltanox), antelope (Galehorn), echidna (Petrovast), hippo (Marshix), armadillo (Sandrix), rhino (Tectonvast), spider (Arachnalis + Duskmourn-postgame), scorpion (Craterlurk), snail (Rootvorn), hedgehog (Gelwing), mushroom (Mycovast), shark (Bathykor-postgame), tiger (Emberon-postgame), tortoise (Imperion).

**Mythical pristine:** snowman (Tundrafox), kitsune (Specraxis + Frigalum-postgame), tanuki (Eclipsoon), leshy (Morralyn), kirin (Majesticore), insect-swarm (Mistbane), sea-fairy queen (Thalassira), coral-titan (Titanariel), kraken (Tidalossus — could expand), seed-pod / walking-garden (Verdovast), phoenix/solar-being (Pyrocrown, Solarwrath, Solarcrown — already 3, at-cap or just over).

### Elementals (cap = 1 family + 1 standalone per element)

| Element | Family | Standalone | Status |
|---|---|---|---|
| wind-elemental | Pneumathos line | — | At cap (1) |
| psychic-elemental | Veilwisp/Distorsion | Astralwing, Gravithorn | **Over cap (1+2)** |
| dark-elemental | Nightmont line | — | At cap (1) |
| fire-elemental | — | Magmite | At cap (0+1) |
| poison-elemental | — | Smogveil | At cap (0+1) |
| rock-elemental | — | Ashrock, Ashvanus | **Over cap (0+2)** — pick 1 |
| electric-elemental | — | Thunderpeak, Fluxserpent | **Over cap (0+2)** — pick 1 |
| water-elemental | Bubblepuff/Psychotide | — | At cap (1) |
| aether-elemental | — | Aetherveil-postgame | At cap (0+1) |
| Other 10 elements | — | — | All slots open |

### Natural-disaster-inspired (cap = 1 family + 1 standalone per disaster)

| Disaster | Family | Standalone | Status |
|---|---|---|---|
| thunderstorm | — | Vortexwing, Tempestborn, Nullstorm | **Over cap (0+3)** — trim to 1 standalone |
| tornado | — | (none classified — Pneumathos is wind-elemental) | Open |
| tsunami | — | Tidecrest-postgame | At cap (0+1) |
| wildfire / eruption | — | Ashvanus (volcanic vent) | borderline; could be eruption-disaster instead of rock-elemental |
| earthquake / blizzard / flood / etc. | — | — | All slots open |

### Pre-408 Ghost-typing flags (per CLAUDE.md, surface for user discussion)

- `#362 Lunaspectre | Psychic/Ghost`
- `#373 Voidrend | Dark/Ghost`
- (Others to be cross-checked.)

---

## Name leaks compiled (for mass-fix queue)

From all 7 batches:

- #17 Searburn → "Pyroveth"
- #100 Craterlurk → "Venomvast"
- #103 Calciderm → "Crustvast"
- #120 Nightwolf → "Noctovast"
- #122 Caveshroud → "Umbraveth"
- #125 Venotitan → "Phantomvast"
- #136 Metalibat → "Ferrovast"
- #141 Iridesoar → "Prisoveth"
- #149 Eternarmor → "Adamovast"
- #154 Terragolem → "Titanolith"
- #159 Dissotoad → "Acidovast"
- #165 Venowarn → "Noxoveth"
- #175 Biolumal → "Neruveth"
- #176 Chromena → "Tempyroth"
- #177 Sapphier → "Glaciroth"
- #181 Racehare → "Boundrix"
- #186 Continemic → "Airovast"
- #192 Boulderoll → "Lithavast"
- #217 Distorsion → "Mentovast"
- #225 Crealight → "Glimmerkin"
- #255 Psychotide → "Wavrix"
- #264 Impenezard → "Thornvast"

22 leaks visible just in the family-final lores. (Many more likely in intermediate stages — needs separate per-stage scan.)

---

## Open questions for user

1. **Golem cap policy:** Treat as mythical-exempt (current TODO) or as a common cappable archetype (cap 3)? Current count is ~11+ families.
2. **Dragon sub-flavor caps:** With dragon-mythic exempt overall, do you want sub-cap policy (e.g. cap 3 fire-dragons, cap 3 ice-dragons, cap 3 psychic-dragons)? Currently fire-dragon = 7, psychic-dragon = 6.
3. **Cetacean (whale)** — over cap at 6. Is this a common-animal cap-3 case or borderline mythical (sea-leviathan)?
4. **Wraith** — currently treated as mythical-exempt (~11 families). Confirm or apply cap.
5. **Treant** — currently mythical-exempt (5 families). Confirm.
6. **Pre-408 Ghost-typing** mons (#362 Lunaspectre, #373 Voidrend) — surface for retyping discussion.
7. **Forgotten 408+ classifications** — many are best-guess from emoji/type. Want me to flag specific ones for fuller body-plan rewrites?

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
