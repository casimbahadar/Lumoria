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
Universally recognized mythological beings. Mythical-exempt (no cap): dragon-mythic, kitsune, tanuki, leshy, snowman, sea-fairy queen, mermaid, kraken, void/cosmic, golem, faerie sprite, will-o-wisp, slime/blob, crystalline-prism, kirin, insect-swarm, phoenix/solar-being, primordial-titan, warden/boundary-sentinel. **Capped (NOT exempt):** treant → cap-3; cetacean → cap-3; wraith → split into distinct spectral sub-archetypes. See `docs/mythical-archetype-policy.md` for the LOCKED policy.

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

- `[3] Solkin→Pyrevix→Calderaeth | Fire/Draconic | dragon-mythic` (sub: fire-dragon-fox/kitsune-dragon hybrid)
- `[6] Aquatter→Cobaleap→Banksnout | Aquatic/Dark | otter (mustelid)`
- `[9] Verdkin→Barknell→Garlawarden | Nature/Fairy | saurian` (sub: bark-dinosaur with petals — borderline treant-saurian hybrid)
- `[12] Scorchlarva→Heliocoon→Pyromoth | Fire/Wind | moth (Lepidoptera)`
- `[15] Taurcin→Molteroth→Pyroclasm | Fire/Earth | bull-titan / minotaur` (mythical sub: volcanic bull-titan, bipedal final)
- `[18] Cindercula→Searburn→Quetzember | Fire/Wind | feathered-serpent` (sub: plumed fire-serpent / Quetzalcoatl; base #16 stays mono-Fire)
- `[21] Magmaurin→Ignirhino→Terravore | Fire/Earth | rhinoceros` (de-saurianed 2026-06-13 — magma-rhino line, calf→great charging magma-rhino; fixes old mole→lizard→dino incoherence)
- `[24] Hallucigaze→Pyraxis→Ignitheon | Fire/Mental | lion` (final is true lion)
- `[27] Reefnip→Aquidon→Tidalossus | Aquatic/Earth | kraken / sea-titan crustacean` (mythical-exempt)
- `[30] Corelin→Coralisk→Nepturix | Aquatic | fish` (deep-sea fish)
- `[33] Toxaquil→Noxaquith→Septanemone | Aquatic/Poison | cephalopod` (sub: anemone-bloomed cephalopod)
- `[36] Pearlmaid→Undirael→Thalassira | Aquatic/Fairy | sea-fairy queen / mermaid` (mythical-exempt; flagship)
- `[38] Coralossus→Titanariel | Aquatic/Metal | coral-titan humanoid` (mythical sub)
- `[40] Gossafin→Marevanos | Aquatic/Wind | manta-ray` (winged manta — relabeled out of cetacean per cap-3 policy)
- `[41] Titanomare | Aquatic/Metal | cetacean` (steel-whale titan; standalone)
- `[44] Cryonik→Boreon→Nagislither | Ice/Aquatic | seal / pinniped`
- `[46] Slatis→Frostmere | Ice/Electric | seal / pinniped` (jellyfish-to-seal — second seal family)
- `[49] Hexaprowl→Hailgorge→Hailwolf | Ice | wolf`
- `[52] Tundram→Bergyak→Aurochill | Ice/Normal | bovid` (auroch/ram chain)
- `[54] Mistwhirl→Arcturex | Ice/Wind | owl`
- `[56] Rimeling→Deepfreeze | Ice/Fighting | armored-warrior` (bipedal armor-warrior; retyped Ice/Metal→Ice/Fighting for diversity)
- `[58] Glinteye→Irisarael | Ice/Fairy | faerie sprite` (winged fairy)
- `[60] Lunaveris→Boreadrake | Ice/Draconic | dragon-mythic` (sub: ice-dragon)
- `[62] Gelspike→Gelquill | Ice/Poison | hedgehog / porcupine`
- `[65] Sporix→Myceloth→Plaguecap | Nature/Poison | mushroom / fungus`
- `[68] Viridix→Loamvin→Bonsailoth | Nature/Earth | snail / mollusk`
- `[71] Germix→Verdurus→Groveguard | Nature/Fighting | seed-pod / walking-garden` (added Fighting 2026-06-12 — grove-guardian bruisers that ram/grapple/smash; Nature mono→pristine Nature/Fighting; archetype unchanged)
- `[74] Floralin→Faelomis→Faevernal | Fairy/Nature | faerie sprite` (flower-fairy variant)
- `[77] Sylvolt→Sparkwood→Thorncharge | Nature/Electric | stag / elk / deer (cervid)`
- `[80] Sylvnox→Morraveth→Morralyn | Nature/Dark | leshy / forest-spirit` (pristine mythical, just claimed)
- `[83] Joltan→Galvanos→Voltanox | Electric | horse / equine`
- `[86] Electrix→Shockharpe→Galvaglide | Electric/Nature | dragonfly` (currently inconsistent: stages mix beetle/mosquito/dragonfly — on BREAKING list; final lore says "Zapoveth" name-leak)
- `[89] Amperix→Sparkrel→Dynameel | Electric/Aquatic | electric eel`
- `[91] Zephyrel→Vortexathos | Electric/Wind | eagle` (storm-eagle, 4 m wingspan; subdivided out of the generic "bird-of-prey/raptor" bucket 2026-06-13)
- `[94] Arcspine→Stonebolt→Basaltback | Electric/Earth | echidna`
- `[97] Dustkin→Seismith→Quakehide | Earth/Electric | rhino`
- `[100] Aridix→Toxivenoth→Craterlurk | Earth/Poison | scorpion` (**name leak in #100: "Venomvast"**)
- `[103] Limoux→Dunoloth→Calciderm | Earth/Aquatic | crocodilian` (**name leak in #103: "Crustvast"**)
- `[105] Arenikin→Dravanas | Normal/Earth | hyena` (de-lioned 2026-06-13 — completes the long-flagged canid pivot; already a desert-hyena line in lore/desc/variant, only the archetype label was stale)
- `[107] Geoclad→Quakeon | Earth/Metal | glyptodon` (sub: armoured mammal)
- `[110] Silvergust→Siroccomane→Aeolarch | Wind/Electric | lion` (wind-lion)
- `[113] Aeolin→Swirlavel→Cyclondor | Wind | condor / vulture` (high-altitude condor; subdivided out of "bird-of-prey/raptor" 2026-06-13)
- `[115] Nimbusel→Aetherworn | Wind/Dark | cloud-fairy / wraith-fairy`
- `[117] Zephyrin→Pneumathos | Wind/Mental | wind-elemental` (just claimed pristine)
- `[120] Eclipsehound→Dreadmaw→Nightwolf | Dark | wolf` (**name leak in #120: "Noctovast"**)
- `[122] Spiraloom→Caveshroud | Dark/Wind | bat` (**name leak in #122: "Umbraveth"**)
- `[125] Nocturil→Phantorvex→Venotitan | Dark/Poison | serpent` (**name leak in #125: "Phantomvast"**)
- `[127] Impefurr→Wraithfox | Dark/Mental | kitsune` (mythical, just claimed)
- `[129] Cranivade→Cerebraith | Mental/Spectral | void / cosmic abstract being` (mythical)
- `[131] Necralia→Necrothon | Dark/Nature | treant / walking-tree spirit` (mythical)
- `[133] Volcascale→Monolithox | Earth/Dark | gargoyle` (de-saurianed 2026-06-13 — obsidian gargoyle, winged dark-stone guardian / god of night)
- `[136] Aeronyx→Steelvex→Metalibat | Metal/Dark | bat` (**name leak in #136: "Ferrovast"**)
- `[139] Goldefluff→Aetherael→Lumiarch | Fairy | fairy-hound` (canine-fairy mythical)
- `[141] Faedust→Iridesoar | Fairy/Wind | butterfly` (**name leak in #141: "Prisoveth"**)
- `[144] Dawnirel→Lunarael→Moonseraph | Fairy/Mental | star / celestial cosmic` (mythical)
- `[146] Faerrin→Shinarith | Fairy/Metal | armor-suit` (fairy-armored guardian)
- `[149] Scrapsapien→Stoicguard→Eternarmor | Metal | metal-golem` (**name leak in #149: "Adamovast"**)
- `[151] Voltcrawl→Voltipede | Metal/Electric | centipede` (de-golemed 2026-06-13 from automaton — armored electric myriapod; renamed from Gearon/Alloytron)
- `[152] Imperion | Metal/Earth | tortoise` (standalone, current types odd — described as steel-rock tortoise)
- `[154] Dentshaft→Terragolem | Metal/Earth | metal-golem` (**name leak in #154: "Titanolith"**)
- `[156] Toxirin→Venekon | Poison/Aquatic | frog / toad`
- `[159] Acidelix→Corrodisc→Dissotoad | Poison/Earth | frog / toad` (**name leak in #159: "Acidovast"** — second toad family)
- `[161] Miasmafly→Mistbane | Poison/Vapor | insect-swarm collective` (mythical, just claimed)
- `[163] Marlix→Blightalis | Nature/Toxin | corrupted flower / plant-humanoid`
- `[165] Blightmite→Venowarn | Poison/Wind | moth` (poison-wind moth — caterpillar→cocoon→toxic-scaled moth, reclassified off butterfly 2026-06-13; learnset already carries cocoon_burst. **name leak in #165: "Noxoveth"**)
- `[167] Projectery→Psymastiff | Mental | dog (non-wolf canine)`
- `[169] Gemseer→Aurarael | Mental/Mineral | crystalline-prism` (mythical)
- `[170] Oneiron | Dark/Dream | dream-entity / wisp` (formless, standalone; nightmare-feeder — Dark/Dream restored 2026-06-12 to differentiate from Dreamweald #378's Mental/Dream)
- `[171] Nagaseer | Mental/Poison | naga` (sub: oracle-serpent, standalone)
- `[174] Scalurin→Cobravyrm→Chromedrake | Draconic/Metal | dragon-mythic` (sub: steel-dragon)

### Batch 2 (families 71-105)

- `[175] Biolumal | Aquatic/Dark | shark` (re-archetyped from water-dragon 2026-06-10; bioluminescent deep-sea shark)
- `[176] Raijolt | Electric/Dark | raiju` (sub: thunder-beast, standalone)
- `[177] Sapphier | Ice/Mineral | basilisk` (re-archetyped from ice-dragon 2026-06-10; crystal-ice serpent-king basilisk)
- `[179] Fluffen→Velvetine | Normal | cat` (housecat)
- `[181] Leapbun→Racehare | Normal | rabbit / hare` (**name leak in #181: "Boundrix"**)
- `[184] Rotunden→Glutoros→Ursamight | Normal/Fighting | bear` (titanic bruiser-bear — added Fighting 2026-06-12; Normal mono→pristine Normal/Fighting)
- `[186] Hoverrow→Continemic | Normal/Wind | bird` (albatross — **name leak in #186: "Airovast"**)
- `[188] Norindel→Plentorus | Normal | boar / pig`
- `[190] Woolcalm→Aetherflock | Normal/Mental | sheep / bovid` (psychic sheep — second bovid family alongside Tundram line)
- `[192] Pebblet→Boulderoll | Earth | pillbug` (de-golemed 2026-06-13 from earth-golem — rock roly-poly that curls into a boulder and rolls)
- `[194] Rugothon→Lithomere | Aquatic/Mineral | crab / crustacean` (rock-water crab)
- `[196] Icequartz→Frigolith | Ice/Mineral | rock-monolith / standing stone` (boulder partially submerged in permafrost)
- `[199] Photoworm→Chrysalix→Aeridaleth | Nature/Wind | butterfly` (Lepidoptera — third butterfly/moth family)
- `[201] Iridibeetle→Scarabion | Nature/Metal | beetle / scarab`
- `[203] Sculptweave→Arachnalis | Nature/Fairy | spider`
- `[205] Muddite→Quarrix | Nature/Earth | beetle` (second beetle family — Quarrix + Iridibeetle line)
- `[208] Venomscale→Venodrak→Wyrmvenom | Poison/Draconic | dragon-mythic` (sub: plague-dragon — sympathetic/misunderstood: innately & involuntarily toxic but gentle, sociable & isolated by fear; NOT an active disease-spreader, no miasma/blight)
- `[210] Boltfur→Thundermane | Normal/Electric | rabbit / hare` (giant maned hare — second hare alongside Leapbun line)
- `[213] Cinderfrost→Frostscorch→Infriglace | Fire/Ice | fire-ice titan` (dual-element titan, unique body plan — flag as unique mythical)
- `[214] Petrwave | Aquatic/Earth | crab / crustacean` (coral-fortress crab, standalone — second crab alongside Rugothon line)
- `[217] Veilwisp→Mindrift→Distorsion | Mental/Vapor | psychic-elemental` (formless psychic mist/fog — added Vapor 2026-06-12; Mental mono→pristine Mental/Vapor, claims one of Mental's two missing low pairings. Stale "Mentovast" leak verified absent.)
- `[219] Duskmist→Nightmont | Dark | dark-elemental / formless mountain` (3m formless darkness with red-pinpoint eyes — sole dark-elemental candidate)
- `[221] Umbrajest→Shadowveil | Dark/Vapor | wraith` (cloaked humanoid shadow)
- `[224] Mindpuff→Recallum→Psytheon | Mental/Fairy | faerie sprite` (winged psychic-fairy humanoid with crystal wings)
- `[225] Crealight | Fairy/Mineral | will-o-wisp / faerie sprite` (small glowing creative-energy fairy; standalone — **name leak: "Glimmerkin"**)
- `[227] Spectroo→Spectrace | Fire/Mental | kangaroo (marsupial)` (fire-marsupial branch of Spectroo evolution tree)
- `[228] Lunaroon | Nature/Mental | kangaroo (marsupial)` (moonlight branch of Spectroo line — second marsupial family + alt Spectroo branch)
- `[229] Radiafish | Electric/Mental | kangaroo (marsupial)` (electric branch of Spectroo line — third marsupial / alt Spectroo branch)
- `[231] Kappamaru→Sumokappa | Aquatic/Fighting | kappa` (sub: river-yokai wrestler)
- `[234] Serphaxon→Serpenthorn→Wyvernak | Draconic/Earth | dragon-mythic` (sub: ground-dragon — now the sole ground-dragon line; the former Geodrak line was re-archetyped to glyptodon)
- `[235] Glintscale | Aquatic/Fairy | koi` (re-archetyped from water-dragon 2026-06-10; mystical boundary-swimming koi)
- `[237] Frostick→Icevault | Ice/Earth | ice-stone vault / fortress structure` (small architectural creature — unique sub-archetype)
- `[240] Snowble→Blizzariel→Tundrafox | Ice/Dark | snowman (folkloric)` (mythical, just claimed)
- `[241] Shardlix | Ice/Mental | crystalline-prism` (bipedal ice crystal humanoid, standalone — second crystalline-prism alongside Gemseer line)
- `[243] Pulseglow→Stuntrap | Electric/Sonic→Dream/Sonic | dragonfly` (firefly→dragonfly; Stuntrap remade 2026-06-12 to pristine Dream/Sonic hypnotic-drone stun-trapper; Pulseglow now Electric/Sonic — its light-and-sound swarm pulse bridges to Stuntrap's sonic drone (shared Sonic). Differentiates from Galvaglide's Electric/Nature.)

### Batch 3 (families 106-139)

- `[246] Staticclaw→Thundravex→Megavolt | Electric | wolverine (mustelid)`
- `[247] Sparkeen | Electric/Dream | butterfly` (standalone Lepidoptera — dream-light flutterer. Kept as butterfly rather than a 3rd will-o-wisp, since Crealight #225 & Willowisp #368 already fill that slot; butterfly sits at cap-3 with Iridesoar/Aeridaleth once Venowarn→moth. Pristine Electric/Dream.)
- `[250] Pebblard→Boulderax→Megalith | Earth | rock-monolith / standing stone` (second rock-monolith alongside Icequartz line)
- `[252] Crumblite→Stonegrip | Metal/Mineral | lobster` (de-golemed 2026-06-13 from metal-golem — armored rock-crustacean with crushing stone-claws)
- `[253] Ashrock | Fire/Mineral | rock-elemental` (formless basalt with magma veins, standalone — could equally be fire-elemental; lean rock-elemental since body is rock)
- `[255] Bubblepuff→Psychotide | Aquatic/Mental | water-elemental` (wave humanoid, formless water — sole water-elemental candidate; **name leak in #255: "Wavrix"**)
- `[258] Scolphin→Narwhirl→Torrentox | Aquatic/Ice | cetacean` (orca/calf — second cetacean alongside Gossafin line + Titanomare standalone + Tidephant)
- `[259] Lumejell | Aquatic/Mental | jellyfish / cnidarian` (psychic-jellyfish, standalone — second jelly alongside Slatis-line origin)
- `[261] Sproutix→Hypnostag | Nature/Dream | stag / deer (cervid)` (faun — Hypnostag rewritten 2026-06-12 to a dream-bloom deer, Nature mono→Nature/Dream pristine; ties to Sproutix's drowsing pollen)
- `[264] Transluceed→Tendrilisk→Impenezard | Fighting/Toxin | cactus / thorn-warrior` (relabeled off treant 2026-06-13 — lore is cactus sapling→cactus warrior→cactus-plate carapace throughout, a succulent thorn-warrior, not a tree-spirit. **name leak in #264: "Thornvast"**)
- `[265] Mosshop | Nature/Wind | grasshopper` (moss-cloaked grasshopper, standalone — pristine Orthoptera archetype, re-archetyped off moth 2026-06-13; keeps Nature/Wind. Learnset swapped cocoon_guard/metamorphosis → fortify/locust_fury/swarm_strike to fit)
- `[268] Shadowcub→Nightclaw→Darkfang | Dark/Sonic → Dark/Spectral | panther` (de-wolfed 2026-06-13 — shadow-panther line, light-drinking cub → apex shadow-panther whose roar reaches the dead; renamed Shadowpup→Shadowcub)
- `[270] Grimshade→Eclipsoon | Dark/Fairy | tanuki` (mythical, just claimed)
- `[271] Murkrat | Dark/Normal | rat (rodent)` (standalone)
- `[273] Embrix→Blazeon | Fire/Spectral | phoenix` (sub: firebird; base #272 mono-Fire)
- `[276] Cindling→Infernox→Magmaw | Fire/Mineral | saurian` (igneous lizard with rock plates — second fire-saurian alongside Magmaurin/Terravore line)
- `[277] Magmite | Fire | fire-elemental` (lava droplet, formless walking magma — sole fire-elemental candidate, standalone)
- `[279] Ironpix→Steelhorn | Metal/Fairy | unicorn / single-horn fairy-equine` (fairy-forged steel steed with a single straight horn; lore/noun retuned off "humanoid knight" 2026-06-13 to match the equine archetype — the armored-knight concept is already covered by #56 Deepfreeze, #146 Shinarith, #332 Glacicore, #407 Voidwarden)
- `[282] Gearbit→Cogvex→Mechabrute | Metal/Fighting | automaton`
- `[283] Rustpike | Metal/Poison | fish` (rusting-iron pike, standalone — second fish family alongside Corelin line; could also classify as steel-elemental?)
- `[285] Fluffkin→Cloudrift | Normal/Wind | cloud-elemental / wisp` (compact cloud with face — formless cloud being; under cap, but flag — could be wind-elemental too)
- `[288] Fuzzlet→Cuddrix→Majesticore | Draconic/Fairy | kirin` (mythical, just claimed)
- `[289] Bouncyblob | Normal/Vapor | slime / blob` (mythical, standalone; added Vapor 2026-06-12 — a warm condensed-vapor gel blob; Normal mono→pristine Normal/Vapor)
- `[290] Guisecat | Normal/Dark | cat` (mimic-cat — second cat alongside Fluffen line + Cinderpaw + Emberveil)
- `[292] Breezekin→Galehorn | Wind/Sonic | antelope` (pristine archetype)
- `[295] Gustpuff→Stormwing→Cyclonax | Electric/Draconic | dragon-mythic` (sub: wind-dragon)
- `[298] Plaguefly→Pestquito→Plagueoth | Poison/Toxin | mosquito` (Diptera — relabeled off moth 2026-06-13; emoji 🦟 + desc/lore "plague mosquito" across all 3 stages. Resolves the old BREAKING-list moth/butterfly flag)
- `[300] Stinglet→Nettlebarb | Toxin/Sonic | bee (Hymenoptera)` (currently inconsistent — bee→scorpion-bee hybrid on BREAKING list)
- `[301] Emberveil | Fire/Spectral | cat` (smouldering ghost-cat, standalone — third cat; retyped Fire/Dark→Fire/Spectral for diversity)
- `[303] Lightpuff→Lumivane | Fairy/Mental | starlight-orb` (luminous starlight sphere with non-severing light-limbs that archives astronomical data — NOT a faerie-sprite humanoid; archetype relabeled to resolve the false collision with Psytheon, which keeps the faerie-sprite slot. Stays Fairy/Mental.)
- `[306] Frostpelt→Snowmaw→Yetigrand | Earth/Ice | yeti` (de-monolithed 2026-06-13 from rock-monolith — frozen-mountain snow-beast line; renamed from Icethorn/Geoshard/Crystallon)
- `[307] Cinderpaw | Fire/Dark | cat` (fire-dark cat, standalone — fourth cat)
- `[309] Seafraith→Tidephant | Aquatic/Spectral | pinniped` (spectral elephant-seal — relabeled out of cetacean per cap-3 policy; resolves the fish→cetacean BREAKING flag as fish→pinniped)
- `[311] Mudpump→Marshix | Aquatic/Nature | hippo` (pristine archetype)

### Batch 4 (families 140-173)

- `[313] Dunecrawl→Sandrix | Earth/Dark | armadillo` (pristine archetype, just claimed)
- `[314] Skybreaker | Wind/Sonic | dog (non-wolf canine)` (greyhound, standalone)
- `[315] Ashvanus | Fire/Earth | volcanic-vent creature` (unique — "volcanic vent that has grown a body" with magma core; borderline rock-elemental vs unique. Standalone)
- `[316] Abyssovex | Aquatic/Dark | cephalopod` (deep-sea squid leviathan, standalone — second cephalopod alongside Toxaquil line)
- `[317] Temporith | Mental/Draconic | dragon-mythic` (sub: psychic-dragon — now the sole psychic-dragon; the former Drakorius was re-archetyped to naga)
- `[318] Gaiagant | Earth/Nature | earth-golem` (4m titan with living forest canopy — variant golem; could double as treant — flag)
- `[319] Voidraxis | Dark/Stellar | void / cosmic abstract being` (mythical — second void/cosmic alongside Cerebraith)
- `[320] Galvathon | Metal/Electric | automaton` (mechanical titan)
- `[321] Dragemian | Draconic/Fire | dragon-mythic` (sub: fire-dragon — alongside Calderaeth)
- `[322] Venomwraith | Poison/Spectral | plague-spectre` (split out of wraith bucket per policy)
- `[323] Toxicore | Poison/Fire | unique vessel-creature` (living flask/chemistry-vessel with internal acid; distinct from elemental; flag as unique)
- `[324] Chittering | Nature/Dark | mantis / blade-limbed insect` (sleek dark insect with 6 blade-limbs; pristine sub-archetype)
- `[325] Dunespike | Earth/Poison | mole-rat / rodent` (armored mole-rat — second rodent alongside Murkrat)
- `[326] Nectartrap | Nature/Poison | carnivorous-plant` (already a carnivorous marsh-plant in data — relabeled out of treant per mythical-archetype-policy cap-3; treant now Necrothon/Impenezard/Thornspire)
- `[327] Quarrex (→Graviton→Abyssforge) | Earth | earth-golem` (base of the earth/gravity-golem line; see [377])
- `[328] Smogveil | Poison/Vapor | poison-elemental` (amorphous yellow-green storm cloud, formless, sole poison-elemental; retyped Wind→Vapor 2026-06-10 — sentient smog/gas cloud, lore "smog"/"choking vapour"/"poisoned fog")
- `[329] Skullmite | Nature/Mineral | trilobite` (de-beetled 2026-06-13 — living-fossil trilobite with a helmet-shaped head-shield over a segmented fossil carapace; keeps Nature/Mineral, zero cap impact. Pristine archetype; trims beetle to cap)
- `[330] Blistermaw | Aquatic/Poison | crocodilian` (acid-weeping croc — second crocodilian alongside Limoux line)
- `[331] Thornmoth | Nature/Sonic | moth` (Nature mono→Nature/Sonic pristine 2026-06-12 — its wing-beat resonance strips bark; sixth Lepidoptera)
- `[332] Glacicore | Ice/Metal | armor-suit` (ice-steel humanoid armor — second armor-suit alongside Deepfreeze)
- `[333] Voltfang | Electric/Dark | electric-eel` (de-wolfed 2026-06-13 — dark electric eel; was redundant with Raijolt's Electric/Dark thunder-beast)
- `[334] Voltbrawler | Electric/Fighting | automaton` (sub: battlebot / combat-automaton; re-themed 2026-06-12 from Metal/Fighting metal-brawler → pristine Electric/Fighting battlebot, adding a new type pairing to the golem roster)
- `[335] Frostprowl | Ice/Wind | feline (snow-leopard / cheetah)` (ice-wind feline — distinct from cat/lion; pristine snow-cat sub-archetype)
- `[336] Coilstrike | Electric/Poison | serpent (non-dragon)` (electric-poison snake)
- `[337] Ashgolem (→Embersteel #347) | Fire/Mineral | forge-golem` (base of the forge-golem line; see [347])
- `[338] Rimehawk | Ice | hawk` (ice-hawk that nests on storm-capped peaks; subdivided out of "bird-of-prey/raptor" 2026-06-13)
- `[339] Voltbeetle | Electric/Sonic | beetle` (fifth beetle)
- `[340] Cryoshard | Ice/Sonic | resonant-crystal` (resonant crystal-prism; retyped Ice/Mental→Ice/Sonic to break the Ice/Mental crystalline-prism clash with Shardlix — Shardlix keeps the crystalline-prism slot, Cryoshard pivots to a sound-resonance identity)
- `[341] Mirestone (→Chronolith #388) | Earth/Mental | rock-monolith` (base of the monolith line; see [388])
- `[342] Wraithking (→Shadowreave #343) | Dark/Spectral | wraith` (base — bound crowned wraith; see [343])
- `[343] Wraithking→Shadowreave | Dark/Spectral | wraith` (2-member line merged 2026-06-12 — crowned wraith sheds crown/form into the formless living-shadow apex; resolves the wraith×Dark/Spectral collision into one family)
- `[344] Glimmeritch | Fairy/Spectral | spectral-faerie` (folded into faerie-sprite per policy)
- `[346] Astralwing | Mental/Wind | psychic-elemental` (winged humanoid of solidified psychic energy — second psychic-elemental alongside Veilwisp/Distorsion)

### Batch 5 (families 174-209)

Legendary tier (`ngPlusTier`) confirmed for: #379, #380, #389, #392, #394, #395, #398, #400, #401, #402-407 (Umbrapup pseudolegendary line). Tagged `[LEGEND tN]` where applicable below.

- `[347] Ashgolem→Embersteel | Metal/Fire | forge-golem` (sub: forge-golem / smith-construct; merged 2026-06-12 from 2 NG+ golem standalones via Metal Coat — Fire/Mineral ash-golem → Metal/Fire forged-steel guardian)
- `[348] Galeswift | Wind/Sonic | swift` (re-archetyped from wind-dragon 2026-06-10; never-landing storm-swift; renamed from Galedrake)
- `[349] Crystavault (→Cryoseer→Permafrost) | Ice/Mineral | ice-golem` (base of the ice-golem line; see [385])
- `[350] Forewrath | Nature/Mineral | iguana` (re-archetyped from grass-dragon 2026-06-10; bark-scaled forest iguana)
- `[351] Spectravore | Mental/Mineral | rainbow / prismatic being` (iridescent humanoid silhouette with all-colour aura — unique sub)
- `[352] Voidlord | Mental/Spectral | void / cosmic abstract being` (mythical — third void/cosmic alongside Cerebraith/Voidraxis)
- `[353] Infernotitan | Fire/Toxin | salamander` (re-archetyped from fire-dragon 2026-06-10; toxic-skinned volcanic salamander; pristine combo)
- `[354] Riftwhale | Aquatic/Mental | cetacean` (psychic-whale, 12m — fifth cetacean)
- `[355] Gloommaw | Aquatic/Toxin | eel` (armoured eel — second eel alongside Dynameel)
- `[357] Thornspire | Nature/Metal | treant` (8m steel-branched tree — fourth treant)
- `[358] Pyrocrown | Fire/Mental | phoenix / solar bird` (mythical-exempt — sole phoenix family)
- `[359] Cryoseer (→Permafrost) | Ice/Mental | ice-golem` (mid of the ice-golem line; see [385])
- `[360] Duskmantle | Dark/Mental | duality being` (half-fairy half-shadow; unique sub-archetype)
- `[361] Tectoshell | Earth/Nature | zaratan / island-turtle` (re-archetyped from ground-dragon 2026-06-10; living-landscape shell)
- `[362] Lunaspectre | Mental/Spectral | moonlight-spectre` (split out of wraith bucket per policy; Spectral is pre-Forgotten-allowed — stale Ghost flag cleared)
- `[363] Chromaton | Normal/Mental | colour-shifting being` (smooth ovoid cycling all colours — unique sub)
- `[364] Deepcrawler | Aquatic/Metal | crustacean` (deep-sea armored crab — third crustacean alongside Tidalossus/Petrwave/Lithomere)
- `[365] Cinderking | Fire/Dark | royal humanoid being` (regal bipedal with crown of black fire — unique royal sub; close to wraith)
- `[366] Starlance | Mental/Metal | weapon-creature` (telekinetic lance-shaped entity — unique sub)
- `[367] Bouldertide | Aquatic/Mineral | rock-monolith / sea-stack` (walking sea-stack — fifth rock-monolith)
- `[368] Willowisp | Fire/Spectral | will-o-wisp` (mythical sole)
- `[369] Graviton (→Abyssforge) | Earth/Mineral | earth-golem` (mid of the earth-golem line — gravity by sheer mineral density; see [377])
- `[370] Cyclotron | Electric/Sonic | thunderstorm-disaster` (over cap with Tempestborn/Nullstorm)
- `[371] Nullform | Dark/Normal | shapeshifter / mimic` (matte-black form-shifter — second mimic alongside Guisecat)
- `[372] Prismancer | Mental/Mineral | chameleon` (re-archetyped from psychic/mineral-dragon 2026-06-10; prismatic colour-shift reptile)
- `[373] Voidrend | Dark/Spectral | void / cosmic` (reality-tearing dark-ghost — fourth void/cosmic. **⚠ Pre-408 with Ghost typing**)
- `[375] Fluxserpent | Electric/Mental | electric-elemental serpent` (current-loop serpent — sole electric-elemental candidate; or could classify as serpent variant)
- `[376] Solarwrath | Fire/Fairy | phoenix / solar-being` (solar plasma — second solar archetype with Pyrocrown)
- `[377] Quarrex→Graviton→Abyssforge | Earth/Mineral | earth-golem` (sub: earth-golem; merged 2026-06-12 from 3 NG+ golem standalones — granite golem → dense gravity golem → ultra-dense core-titan. Consistent Earth→Earth/Mineral→Earth/Mineral; Earth/Mineral count 2)
- `[378] Dreamweald | Mental/Dream | dream-entity` (visible only to half-asleep; second dream-entity alongside Oneiron)
- `[379] Riftmane | Aquatic/Spectral | kelpie` (re-archetyped from spectral-dragon 2026-06-10; phasing otherworld water-horse; renamed from Riftscale)
- `[380] Tempestborn | Electric/Wind | thunderstorm-disaster [LEGEND t2]` (over cap)
- `[381] Crystalmind | Mental/Metal | crystalline-prism` (geometric polyhedron — fourth crystalline-prism)
- `[382] Voidcoil→Oblivionwing | Dark/Wind | raven / corvid` (re-archetyped from dark-dragons 2026-06-10; NG+ 2-stage void-raven; duskstone evolution)

### Batch 6 (families 210-243)

- `[383] Apexblade | Metal/Aquatic | swordfish` (re-archetyped from steel-dragon 2026-06-10; living-blade sea predator)
- `[384] Solarcrown | Fire/Stellar | phoenix / solar-being` (third solar archetype with Pyrocrown/Solarwrath)
- `[385] Crystavault→Cryoseer→Permafrost | Ice/Earth | ice-golem` (sub: ice-golem; merged 2026-06-12 from 3 NG+ golem standalones — young crystal-ice construct → awakened ice-sovereign → ancient earth-fused glacial titan; secondary type shifts Mineral→Mental→Earth, no cap impact)
- `[386] Wraithstorm | Electric/Spectral | storm-wraith` (split out of wraith bucket per policy)
- `[387] Deepvoid | Dark/Aquatic | void / cosmic abstract being` (sub: aquatic void — fifth void/cosmic)
- `[388] Mirestone→Chronolith | Earth/Mental | rock-monolith` (sub: rune-monolith → time-stone; merged 2026-06-12 from 2 NG+ standalones — IS the Earth/Mental pairing, count 2)
- `[389] Stormlord→Stormcrown | Electric/Sonic | thunderbird` (re-archetyped from electric-dragon 2026-06-10; NG+ 2-stage storm-raptor)
- `[390] Voidgarden | Nature/Poison | plant-humanoid / fairy-flower-being` (luminous flowers + dark thorned vines humanoid; sub of corrupted-flower archetype with Blightalis)
- `[391] Titanfang | Normal/Earth | behemoth` (re-archetyped from normal-dragon 2026-06-10; primordial mega-beast)
- `[392] Eonyx | Mental | sphinx` (re-archetyped from psychic-dragon 2026-06-10; ancient oracle sphinx; renamed from Eondrake; signature Time Fracture retyped Draconic→Mental)
- `[393] Nullstorm | Dark/Electric | thunderstorm-disaster` (over cap)
- `[394] Heliogriff | Fire/Stellar | griffin` (re-archetyped from solar-dragon 2026-06-10; solar eagle-lion; Stellar kept under legendary+intrinsic exception)
- `[395] Auroratusk→Glacierend | Ice/Normal | walrus` (re-archetyped from ice-dragons 2026-06-10; NG+ 2-stage aurora→glacier walrus; Auroradrake renamed Auroratusk)
- `[396] Thunderpeak | Electric/Metal | electric-elemental / lightning-bolt being` (lightning-bolt-shaped living metal — sole electric-elemental candidate alongside Fluxserpent — flag for trim)
- `[397] Abyssalord | Aquatic/Spectral | spectral-leviathan` (split out of wraith bucket per policy)
- `[398] Voidcrown | Dark/Fairy | void / cosmic abstract being [LEGEND t4]` (sixth void/cosmic; flagship for archetype)
- `[399] Stonekeeper | Earth/Spectral | mountain-spirit / genius-loci` (split out of wraith bucket per policy)
- `[400] Primordiax | Fire/Primal | primordial titan [LEGEND t4]` (cooling lava + deep rock titan; pristine primordial-titan archetype)
- `[401] Cosmoveil | Stellar/Mental | void / cosmic abstract being [LEGEND t4]` (seventh void/cosmic — starlight-cosmic variant; flagship)
- `[404] Scalit→Dracomind→Veildrak | Draconic/Mental | dragon-mythic [LEGEND t1 pseudo]` (sub: psychic-dragon pseudolegendary — fifth psychic-dragon)
- `[407] Umbrapup→Umbrasteel→Voidwarden | Dark/Metal | bipedal warden / boundary-sentinel [LEGEND t1 pseudo]` (just claimed pristine mythical-exempt)

### NG+ families (ids 408–461) — UNIFIED classification

The 22 NG+-exclusive families added in the dex-to-500 expansion (#57). Regular dex members — they **DO** count toward caps (per the fixed `oversaturated_combos.py` threshold = 462). Each carries a designer intent comment in `js/data.js` (`// --- Fn: ... ---`). Classified one family per approval during the UNIFIED walk.

- `[410] Glimmerling→Facetite→Prismdome | Crystal / Crystal-Fairy | tortoise (gem-shelled)` (LEGENDARY line, F1. 2nd tortoise alongside Imperion #152 — within animal cap-3. Crystal is legacy pre-462: **KEPT** under the legendary+intrinsic-prism-lore exception — all 3 stages legendary; prism/rainbow coding throughout the line; Mineral would lose the light-refraction identity. emoji/desc/lore clean, no name leaks.)
- `[413] Thrumquill→Echostride→Resonadon | Sonic / Draconic-Sonic | ratite (cassowary)` (F2; flightless booming bird — buzz-quill chick → scaled draconic runner → casqued infrasound giant. PRISTINE ratite slot, distinct from albatross/owl/raptor. Both types pre-462-allowed; good Sonic distribution. emoji/desc/lore clean, no leaks.)
- `[416] Grublurk→Tunnelmaw→Sandscourge | Toxin / Earth-Toxin | sandworm (annelid)` (F3; detoxifying soil-grub → mineral-toothed borer → colossal dune-leviathan. PRISTINE sandworm slot, distinct from serpent. Both types pre-462-allowed; good Toxin distribution. emoji/desc/lore clean, no leaks.)
- `[419] Glacigeist→Frostmarion→Pallidoll | Spectral / Ice-Spectral | haunted-doll (marionette)` (F4; houseless spirit → frost-lacquered marionette → life-size haunted doll. This is the **haunted-doll** spectral sub-archetype already named in the LOCKED wraith-split policy (Pallidoll). Both types pre-462-allowed. desc/lore clean, no leaks; 418 emoji ❄️ kept as the Ice-onset stage (minor — 🎎 would be more body-literal).)
- `[422] Steamkit→Geyserook→Tempesteam | Vapor / Fire-Vapor | capybara (rodent)` (F5; placid hot-spring line — downy spring-pup → thermal-vent beast → steam-cloaked behemoth. PRISTINE capybara slot, per-species read (distinct from rat #271 / mole-rat #325; rodent is NOT an umbrella cap). Both types pre-462-allowed; good Vapor distribution. emoji ♨️ codes habitat not body but consistent. clean.)
- `[425] Pebblite→Geodon→Stragolin | Mineral / Metal-Mineral | pangolin` (F6; mineral ball-roller → metal-veined armor → strata-scaled digging titan. PRISTINE pangolin, distinct from hedgehog/echidna/armadillo/mole-rat. Good Mineral distribution. emoji theme-coded 🪨/🦔/⛏️, kept. clean.)
- `[428] Pummelo→Brawlmonk→Zenkaiser | Fighting / Fighting-Mental | mantis` (F7; martial-mantis duelist line. 2nd mantis alongside Chittering #324 — within animal cap-3. Good Fighting+Mental distribution. 🦗 cricket stand-in kept (no mantis emoji). clean.)
- `[431] Lullasnout→Drowsetapir→Nocturnbaku | Dream / Dark-Dream | tapir (baku)` (F8; dream-eater line — snouted cub → nightmare-eating tapir → dreamscape-walking baku. PRISTINE tapir, animal-first read (baku folkloric flavor), NOT a formless dream-entity. Good Dream distribution. 🌙 theme-emoji kept. clean.)
- `[434] Tusklet→Verdantusk→Primammoth | Primal / Nature-Primal | mammoth (proboscidean)` (LEGENDARY line, F9. PRISTINE mammoth, animal-first (NOT primordial-titan despite "living mountain" language). Primal is reserved post-game: **KEPT** under legendary+intrinsic-primeval-lore exception — all 3 legendary; "elder world / first forest / before names" coding throughout; no pre-462 type captures primeval (Nature covers the moss half). clean.)
- `[437] Knucklite→Cragfist→Goliathon | Mineral / Fighting-Mineral | gorilla (ape)` (F10; stone-fist gorilla line. PRISTINE primate (first ape in dex). Good Mineral+Fighting distribution. 🦍 exact. clean.)
- `[439] Chimelet→Seraphene | Sonic / Fairy-Sonic | cicada (bard-fae)` (F11, 2-stage; glass-winged cicada-fae. PRISTINE cicada, animal-first read (faerie-sprite is the flavor alternative — cap-neutral either way). Good Sonic distribution. 🎐 apt (wings ring like windchime). clean.)
- `[441] Rustmite→Corrodon | Toxin / Electric-Toxin | centipede (myriapod)` (F12, 2-stage; metal-rusting grub → acid+charge armored centipede. PRISTINE centipede. Good Toxin+Electric distribution. 🐛 stand-in kept. clean.)
- `[443] Bloatleech→Miasmire | Vapor / Poison-Vapor | leech (annelid)` (F13, 2-stage; fog-venting bog leech → mist-dragging bog-horror. PRISTINE leech, distinct body plan from F3 sandworm (per-species, NOT an annelid umbrella). Good Vapor+Poison distribution. 🩸 thematic, kept. clean.)
- `[445] Squeaklet→Sentrike | Sonic / Normal-Sonic | meerkat (mongoose family)` (F14, 2-stage; sentinel-colony line. PRISTINE meerkat — NOT a rodent, so no rodent-cap interaction (resolves the earlier F5 "squirrel" worry). Good Sonic distribution. 🐿️ stand-in kept (no meerkat emoji). clean.)
- `[447] Sporelet→Fumycet | Vapor / Nature-Vapor | mushroom (fungus)` (F15, 2-stage; drowsy-spore sprout → walking spore-fog myconid. 2nd mushroom alongside Plaguecap #65 — within cap-3. Good Vapor distribution. 🍄 exact. clean.)
- `[449] Cobblepup→Oredigger | Mineral / Dark-Mineral | mole (Talpidae)` (F16, 2-stage; blind burrowing mole → ambush tunneler. PRISTINE mole, per-species (distinct from mole-rat #325 / badger). Good Mineral distribution. 🦡 stand-in kept (no mole emoji). clean.)
- `[451] Jabshell→Smashclaw | Fighting / Fighting-Fire | mantis shrimp (stomatopod)` (F17, 2-stage; cavitation-strike reef brawler. PRISTINE stomatopod, per-species — does NOT add to the crab/crustacean over-cap bucket (mantis shrimp ≠ crab). Good Fighting distribution; Fire = the steam-flash cavitation. clean.)
- `[453] Dozit→Lullavoir | Dream / Dream-Fairy | sloth` (F18, 2-stage; daydreaming sloth → dream-spinning sloth-fae. PRISTINE sloth (animal-first). Good Dream distribution. 🦥 exact. clean.)
- `[455] Tollwisp→Knellgeist | Spectral / Metal-Spectral | bell-spirit` (F19, 2-stage; haunted handbell → dread tower-bell. The bell-spirit spectral sub-archetype already named in the LOCKED wraith-split policy. 🔔 exact. clean.)
- `[457] Mistgill→Vaporlotl | Vapor / Aquatic-Vapor | axolotl (amphibian)` (F20, 2-stage; misty-gilled regenerating spring-amphibian. PRISTINE axolotl, per-species (distinct from frog/toad #156/#159). Good Vapor distribution. 🦎 stand-in kept (no axolotl emoji). clean.)
- `[459] Tengko→Tengrath | Fighting / Fighting-Wind | tengu (mythical)` (F21, 2-stage; mountain martial-spirit — imp drilling fist-forms → whirlwind tengu master. Singular pristine tengu (not on exempt list but cap-neutral — only one; could join exempt list if more appear). Good Fighting+Wind distribution. 👺 exact. clean.)
- `[461] Chimebowl→Resonethe | Sonic / Mental-Sonic | singing-bowl construct (animate instrument)` (F22, 2-stage; resonance-animated votive bowl → thought-tuning nested-bowl construct. PRISTINE unique sub, distinct from golem (humanoid) and bell-spirit F19 (haunted/Spectral) — self-willed via meditative resonance, Sonic/Mental not Spectral. Good Sonic+Mental distribution. clean.)

**✅ NG+ 408–461 block COMPLETE — all 22 families (F1–F22) classified.** Hard prerequisite for cap tallies done. Typings all kept (no `data.js` changes); legacy Crystal 408–410 and Primal 432–434 kept under the legendary exception.

##### Type-combo flagship policy — LOCKED 2026-06-10

Re-decided "up front" under the 26-type chart against the complete 461-Lumori tally (`scripts/oversaturated_combos.py`). The old 4-combo flagship list is **RETIRED**. New policy (rule-based, not a named list):
- **Monos = auto-flagship (12-ID cap).** Unchanged.
- **Duals = ordinary 6-ID cap.** A dual gets flagship (12) status **only by explicit per-combo justification** when a genuinely-fitting 7th member actually arises — decided case-by-case during the walk, never preemptively. Every at-6 dual is treated as full/locked.
- **Nature mono @ 13 IDs:** ACCEPTED as a justified soft-over (+1 over the flagship-12 mono cap; all 13 are legitimately grass-bodied — starters, fungi, seed-pods, moths). No retype. This is the only over-cap combo in the pre-462 dex.

The script already implements this (mono cap 12 / dual cap 6), so no code change is required.

#### Forgotten / post-game (id ≥ 462)

These are all post-game legendary-tier, mostly with cryptic short lore. Classifications are best-guess based on type/emoji/name; flag any that need fuller body-plan reframing later. All are exempt from pre-408 typing restrictions (Aether/Fighting/Crystal/Primal/Ghost allowed).

> **Forgotten audit (2026-06-08):** the 39 Forgotten (data.js ids 462–500; old taxonomy ids 408–446, offset −54) were fully re-typed and re-archetyped per the per-wielder theme pass — the `| types | archetype |` fields below are **current**, but the trailing parenthetical notes are **stale historical breadcrumbs** from the original best-guess pass. Note the 486↔488 (Psydrak↔Dreamaith) identity swap. Canonical archetypes + appearance briefs live in `docs/forgotten-art-prompts.md`.

- `[462] Forgotten Auravian | Aether/Primal | aether-divine messenger` (winged divine messenger — pristine aether-elemental candidate)
- `[463] Forgotten Lumarix | Crystal/Stellar | constellation-being` (light-refracting body — variant crystalline-prism + fairy hybrid)
- `[464] Forgotten Celestrix | Aether/Crystal | seraph` (pristine post-game angelic archetype)
- `[465] Forgotten Nyxviper | Dark/Chrono | temporal-assassin` (collective-nightmare manifestation; bat emoji)
- `[466] Forgotten Morrath | Dark/Primal | darkfire elemental` (paradoxical fire-that-darkens-rooms — unique sub)
- `[467] Forgotten Duskmourn | Crystal/Chrono | stopped-clock being` (spider emoji; post-game spider)
- `[468] Forgotten Electrak | Electric/Crystal | tesla-coil being` (likely dragon based on scales)
- `[469] Forgotten Arcvolt | Electric/Chrono | fulgurite / petrified-lightning being` (scales form geological strata over time)
- `[470] Forgotten Fulgureis | Electric/Primal | typhon` (tornado emoji + Bug/Water — borderline)
- `[471] Forgotten Rootborn | Poison/Primal | mandragora` (fifth treant)
- `[472] Forgotten Tellurak | Crystal/Primal | geode-being` (mountain-golem)
- `[473] Forgotten Gaiasurge | Primal/Fighting | atlas` (volcano emoji; Fighting type — post-game allowed)
- `[474] Forgotten Pelagor | Aquatic/Chrono | oracle-seer` (sixth cetacean — post-game)

### Batch 7 (families 244-269) — Forgotten / post-game continued

Same caveat: Forgotten lores are narrative-focused; classifications are best-guess from type/emoji/name and need user-led body-plan reframing later if precision matters.

- `[475] Forgotten Bathykor | Aquatic/Stellar | anglerfish` (toxin causes paralysis; sharkemoji)
- `[476] Forgotten Tidecrest | Aquatic/Primal | leviathan` (post-game; "ocean flowed around it" — flagship sub)
- `[477] Forgotten Aetherveil | Aether | wind-chime being` (post-game; butterfly-like wings of air-and-light)
- `[478] Forgotten Zephyrak | Wind/Crystal | harpy` (eagle with steel-feathers — fifth raptor, post-game)
- `[479] Forgotten Skydrak | Wind/Stellar | roc` (sub: ghost-dragon — post-game; -drak suffix)
- `[480] Forgotten Pyraeon | Fire/Crystal | nemean-lion` (Dravek's lion — post-game lion)
- `[481] Forgotten Emberon | Fire/Chrono | sabertooth / smilodon` (post-game tiger — pristine sub for tiger)
- `[482] Forgotten Dracofire | Draconic/Primal | primal-dragon` (sub: plague-dragon, palm-sized hatchling — second plague-dragon alongside Wyrmvenom)
- `[483] Forgotten Frigalum | Ice/Crystal | arctic-fox` (post-game fox — second kitsune alongside Wraithfox; Forgotten = mythical-exempt)
- `[484] Forgotten Cryvorn | Ice/Chrono | fenrir` (post-game wolf — fifth wolf)
- `[485] Forgotten Frostdrax | Ice/Primal | ymir / frost-giant` (sub: ghost-fairy-dragon — post-game; -drax suffix)
- `[488] Forgotten Dreamaith | Dream/Aether | sandman` (post-game owl — second owl alongside Arcturex)
- `[487] Forgotten Luneveth | Stellar/Dream | moonlight-fairy` (post-game moonlight water-fairy)
- `[486] Forgotten Psydrak | Dream/Chrono | dream-dragon` (sub: psychic-dragon — sixth psychic-dragon)
- `[489] Forgotten Carapax | Metal/Crystal | ankylosaurus` (post-game robotic-golem)
- `[490] Forgotten Forgerak | Metal/Aether | smith / forge-spirit` (Rax's smith — unique forge-being archetype)
- `[491] Forgotten Alloydrax | Metal/Chrono | talos` (sub: steel-alloy dragon — third steel-dragon)
- `[492] Forgotten Volteon | Chrono | clockwork-being` (predictive-model running mechanical entity)
- `[493] Forgotten Sparkeis | Aether/Chrono | hourglass-being` (electric crystal — fifth crystalline-prism)
- `[494] Forgotten Thunderax | Chrono/Primal | chronos / father-time` (lightning emoji + wind/grass — post-game)
- `[495] Forgotten Nihilax | Stellar/Spectral | silence-being` (eighth void/cosmic; void emoji)
- `[496] Forgotten Vantarix | Chrono/Stellar | silhouette-being` (cosmic emoji + bug; unique sub)
- `[497] Forgotten Abysdrak | Primal/Stellar | apophis` (sub: wind-dragon — fourth wind-dragon)
- `[498] Forgotten Cosmolith | Aether/Stellar | celestial-globe / star-chart being` (ninth void/cosmic; cosmic emoji + scale-patterns)
- `[499] Forgotten Stardrax | Stellar/Sonic | supernova-being` (sub: star-dragon — seventh fire-dragon)
- `[500] Forgotten Stellarion | Stellar | star-spirit` (telescope emoji + named "wonder"; unique observatory archetype, last in the dex)

### Audit complete — 269 families classified.

---

## Archetype tallies — over-cap groupings flagged

(Compiled from all 269 family classifications above. Caps: animals = 3 families, elementals = 1 family + 1 standalone per element, disaster subtypes = 1 family + 1 standalone per disaster, mythical-exempt = no cap.)

> **Forgotten = ids 462–500** (excluded from these caps; "-postgame" members below are Forgotten and do NOT count). The legacy 408+ Forgotten numbering is retired. The **54 NG+ families (408–461)** are regular dex members that DO count but are **not yet classified** — full classification deferred to UNIFIED. Mythical-exempt policy + borderline resolutions are **locked** in `docs/mythical-archetype-policy.md`.

### Over-cap (needs trim)

| Archetype | Count | Cap | Trim | Notes |
|---|---|---|---|---|
| **dragon-mythic** | ~30 | exempt | — | Mythical-exempt; sub-flavor diversity is high. No trim. |
| **wraith / spectre** | 11+ | **split** | re-arch | **LOCKED:** split the over-broad bucket. Core wraith ≤3 (Shadowveil, Wraithking, Shadowreave); split the rest into spectral-leviathan (Abyssalord), mountain-spirit (Stonekeeper), storm-wraith (Wraithstorm), plague-spectre (Venomwraith), moonlight-spectre (Lunaspectre), haunted-doll (Pallidoll), bell-spirit (Tollwisp/Knellgeist), faerie-sprite (Glimmeritch). All stay Spectral-typed. See policy doc. |
| **golem** | 11 | **exempt** | — | **LOCKED mythical-exempt** — universal mythological construct (same footing as dragon). No trim. |
| **wolf** | 3 | 3 | at cap | Hailwolf, Nightwolf, + Forgotten Cryvorn. (Darkfang→panther, Voltfang→electric-eel 2026-06-13; Umbrapup/Morraveth earlier.) |
| **fire-dragon** (sub) | 7 | n/a (under dragon-mythic) | discuss | If sub-caps applied: way over. |
| **psychic-dragon** (sub) | 6 | n/a | discuss | Same. |
| **lion** | 2 pre-462 (+Pyraeon postgame) | 3 | under cap | Ignitheon (fire-oracle), Aeolarch (storm) lines. Dravanas→hyena done 2026-06-13. |
| **cetacean** | 5 | 3 | trim 2 | **LOCKED common cap-3.** Keep Torrentox (orca), Riftwhale (psychic-whale), Titanomare (steel-whale titan); re-archetype Marevanos #40→manta-ray, Tidephant #309→pinniped. (Pelagor is Forgotten 462+, excluded.) |
| **moth** | 3 | 3 | at cap | Pyromoth (#12), Venowarn (#165), Thornmoth (#331). Split out of the old "Lepidoptera" bucket 2026-06-13; Mosshop #265→grasshopper, Venowarn reclassified butterfly→moth. |
| **grasshopper (Orthoptera)** | 1 | 3 | under cap | Mosshop (#265). Pristine archetype, re-archetyped off moth 2026-06-13. |
| **butterfly** | 3 | 3 | at cap | Iridesoar (#141), Aeridaleth (#199), Sparkeen (#247). Split out of Lepidoptera 2026-06-13; Venowarn #165→moth and Plagueoth #298→mosquito left the bucket. |
| **beetle** | 3 | 3 | at cap | Scarabion (#201, scarab beetle), Quarrix (#205), Voltbeetle (#339). Skullmite #329→trilobite 2026-06-13; Sparkeen had been miscounted here (it's a will-o-wisp). |
| **rock-monolith / standing stone** | 4 | 3 | trim 1 | Frigolith, Megalith, Bouldertide, Mirestone→Chronolith. (Crystallon→yeti 2026-06-13) |
| **crystalline-prism** | 3 | exempt | — | **Mythical-exempt** (CLAUDE.md) — resolves the old exempt-vs-trim contradiction. Aurarael #169 (orbiting 7-shard cluster + face), Shardlix #241 (ice-crystal humanoid), Crystalmind #381 (geometric polyhedron) — three distinct forms, no redundant look-alikes to cull. Old "5/trim 2" was stale: Cryoshard #340 already pivoted to resonant-crystal, Sparkeis #493 is post-game. Spectravore #351 is a separate "prismatic being". No cull. |
| **eagle** | 1 | 3 | under cap | Vortexathos (#91). Subdivided out of "bird-of-prey/raptor" 2026-06-13. |
| **condor / vulture** | 1 | 3 | under cap | Cyclondor (#113). Subdivided 2026-06-13. |
| **hawk** | 1 | 3 | under cap | Rimehawk (#338). Subdivided 2026-06-13. |
| _(raptor superfamily, already distinct)_ | — | — | — | thunderbird Stormcrown (#389), griffin Heliogriff (#394), harpy Zephyrak (#478, post-game). The old "bird-of-prey/raptor: 5, trim 2" bucket dissolved by subdivision — each raptor type now sits at 1, no cull needed. |
| **treant / walking-tree** | 4 | 3 | trim 1 | **LOCKED capped (not exempt).** Keep Necrothon, Impenezard, Thornspire; re-archetype Nectartrap #326→carnivorous-plant. (Rootborn is Forgotten 462+, excluded.) |
| **void / cosmic abstract** | 9 | exempt | — | Cerebraith, Voidraxis, Voidlord, Voidrend, Deepvoid, Voidcrown, Cosmoveil, Nihilax, Cosmolith. Mythical-exempt. |
| **cat (housecat / non-lion)** | 4 | 3 | trim 1 | Velvetine, Guisecat, Emberveil, Cinderpaw. |
| **thunderstorm-disaster** | 3 | 1+1 | trim 1-2 | Cyclotron, Tempestborn, Nullstorm. (See storm-elemental TODO entry.) |
| **fire-dragon legendary cluster** | 1 (Dragemian; Infernotitan→salamander, Heliogriff→griffin, Bahamber→feathered-serpent, Blazeon→phoenix re-archetyped out) + chain finals (Calderaeth, Stardrax) | n/a | discuss | All under dragon-mythic exempt but sub-flavor crowded. |

### At cap (no action)

- bear: 3 (Hailwolf, Aurochill, Rotunden line)
- saurian/dinosaur: 3 (Verdkin/Garlawarden, Magmaurin/Terravore, Cindling/Magmaw). Plus Volcascale/Monolithox = 4 — **trim 1 candidate.**
- frog/toad: 2 (Toxirin, Acidelix lines)
- crocodilian: 2 (Limoux line, Blistermaw)
- hare/rabbit: 2 (Leapbun, Boltfur lines)
- bovid: 3 (Tundram, Aetherflock-sheep, Pyroclasm-bull-titan?)
- crustacean: 4 (Tidalossus, Lithomere, Petrwave, Deepcrawler) — **trim 1.**
- dragonfly: 2 (Galvaglide, Stuntrap)
- mustelid: 3 (Banksnout-otter, Megavolt-wolverine — pristine 2; need a 3rd consideration)

### Pristine slots (1 family or 1 family + 1 standalone)

**Real animal pristine (single family):** boar (Plentorus), horse (Voltanox), antelope (Galehorn), echidna (Basaltback), hippo (Marshix), armadillo (Sandrix), rhino (Quakehide), spider (Arachnalis + Duskmourn-postgame), scorpion (Craterlurk), snail (Bonsailoth), hedgehog (Gelquill), mushroom (Plaguecap), shark (Bathykor-postgame), tiger (Emberon-postgame), tortoise (Imperion).

**Mythical pristine:** snowman (Tundrafox), kitsune (Wraithfox + Frigalum-postgame), tanuki (Eclipsoon), leshy (Morralyn), kirin (Majesticore), insect-swarm (Mistbane), sea-fairy queen (Thalassira), coral-titan (Titanariel), kraken (Tidalossus — could expand), seed-pod / walking-garden (Groveguard), phoenix/solar-being (Pyrocrown, Solarwrath, Solarcrown — already 3, at-cap or just over).

### Elementals (cap = 1 family + 1 standalone per element)

| Element | Family | Standalone | Status |
|---|---|---|---|
| wind-elemental | Pneumathos line | — | At cap (1) |
| psychic-elemental | Veilwisp/Distorsion | Astralwing, Graviton | **Over cap (1+2)** |
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
| thunderstorm | — | Cyclotron, Tempestborn, Nullstorm | **Over cap (0+3)** — trim to 1 standalone |
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
