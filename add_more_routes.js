#!/usr/bin/env node
// Add 12 new areas between gyms 9-16 + update connections + add new Lumos to encounter tables
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');

// =============================
// STEP 1: Update connections in existing areas
// =============================

// toxic_bog: insert mire_depths between toxic_bog and miasmacity
src = src.replace(
  'id:"toxic_bog", name:"Toxic Bog"',
  'id:"toxic_bog", name:"Toxic Bog"'
);
// Update toxic_bog connections
src = src.replace(
  'connections:["murk_crossing","miasmacity"],\n    wildMonsters:[\n      {id:156, minLv:58',
  'connections:["murk_crossing","mire_depths"],\n    wildMonsters:[\n      {id:156, minLv:58'
);

// quake_foothills: insert magma_vent before tremor_summit
src = src.replace(
  'connections:["route11","tremor_summit"],\n    wildMonsters:[\n      {id:95,',
  'connections:["route11","magma_vent"],\n    wildMonsters:[\n      {id:95,'
);

// route12: insert fungal_cavern before cobweb_gully
src = src.replace(
  'connections:["terravault","cobweb_gully"],',
  'connections:["terravault","fungal_cavern"],'
);

// cobweb_gully: insert fungal_cavern before and ancient_grove after
src = src.replace(
  'connections:["route12","silkwood"],\n    wildMonsters:[\n      {id:198',
  'connections:["fungal_cavern","ancient_grove"],\n    wildMonsters:[\n      {id:198'
);

// silkwood: update from cobweb_gully to ancient_grove
src = src.replace(
  'connections:["cobweb_gully","route13"],',
  'connections:["ancient_grove","route13"],'
);

// route13: insert wind_hollow before gale_peak
src = src.replace(
  'connections:["silkwood","gale_peak"],',
  'connections:["silkwood","wind_hollow"],'
);

// gale_peak: update from route13 to wind_hollow
src = src.replace(
  'connections:["route13","gale_ridge_east"],',
  'connections:["wind_hollow","gale_ridge_east"],'
);

// gale_ridge_east: insert tempest_cliffs before gusthaven
src = src.replace(
  'connections:["gale_peak","gusthaven"],',
  'connections:["gale_peak","tempest_cliffs"],'
);

// gusthaven: update from gale_ridge_east to tempest_cliffs
src = src.replace(
  'connections:["gale_ridge_east","route14"],',
  'connections:["tempest_cliffs","route14"],'
);

// route14: insert ash_fields before forge_ruins
src = src.replace(
  'connections:["gusthaven","forge_ruins"],',
  'connections:["gusthaven","ash_fields"],'
);

// forge_ruins: update from route14 to ash_fields, insert smelter_pass after
src = src.replace(
  'connections:["route14","forge_approach"],',
  'connections:["ash_fields","smelter_pass"],'
);

// forge_approach: update from forge_ruins to smelter_pass
src = src.replace(
  'connections:["forge_ruins","ironforge"],',
  'connections:["smelter_pass","ironforge"],'
);

// route15: insert granite_tunnels before stone_plateau
src = src.replace(
  'connections:["ironforge","stone_plateau"],',
  'connections:["ironforge","granite_tunnels"],'
);

// stone_plateau: update from route15 to granite_tunnels, insert crystal_mine after
src = src.replace(
  'connections:["route15","quarryville"],',
  'connections:["granite_tunnels","crystal_mine"],'
);

// quarryville: update from stone_plateau to crystal_mine
src = src.replace(
  'connections:["stone_plateau","route16"],',
  'connections:["crystal_mine","route16"],'
);

// route16: insert nebula_gorge before cosmic_cavern
src = src.replace(
  'connections:["quarryville","cosmic_cavern"],',
  'connections:["quarryville","nebula_gorge"],'
);

// cosmic_cavern: update from route16 to nebula_gorge, insert astral_plateau after
src = src.replace(
  'connections:["route16","starbloom"],',
  'connections:["nebula_gorge","astral_plateau"],'
);

// starbloom: update from cosmic_cavern to astral_plateau
src = src.replace(
  'connections:["cosmic_cavern","victoryroad","void_rift"],',
  'connections:["astral_plateau","victoryroad","void_rift"],'
);

// =============================
// STEP 2: Add new Lumos to existing route encounter tables
// =============================

// Add new Lumos to route10 (req 9) - Fighting base, Dark base
src = src.replace(
  '    wildMonsters:[\n      {id:155, minLv:57, maxLv:62, rate:20},  // Toxirin (base)\n      {id:157, minLv:57, maxLv:62, rate:20},  // Acidelix (base)\n      {id:160, minLv:58, maxLv:63, rate:20},  // Miasoveth (base)\n      {id:161, minLv:59, maxLv:64, rate:15},  // Toxivane (mid → after base ✓)\n      {id:162, minLv:58, maxLv:63, rate:15},  // Marlix (base)\n      {id:163, minLv:59, maxLv:64, rate:10}   // Venomalis (mid → after base ✓)\n    ],\n    hasGym:false, requiredBadges:9, mapPos:{x:48, y:60}',
  '    wildMonsters:[\n      {id:155, minLv:57, maxLv:62, rate:15},  // Toxirin (base)\n      {id:157, minLv:57, maxLv:62, rate:15},  // Acidelix (base)\n      {id:160, minLv:58, maxLv:63, rate:15},  // Miasoveth (base)\n      {id:161, minLv:59, maxLv:64, rate:10},  // Toxivane (mid → after base ✓)\n      {id:162, minLv:58, maxLv:63, rate:10},  // Marlix (base)\n      {id:163, minLv:59, maxLv:64, rate:10},  // Venomalis (mid → after base ✓)\n      {id:206, minLv:57, maxLv:62, rate:10},  // Cuffkin (base Fighting)\n      {id:266, minLv:57, maxLv:62, rate:10},  // Shadowpup (base Dark)\n      {id:299, minLv:57, maxLv:62, rate:5}    // Stinglet (base Bug/Poi)\n    ],\n    hasGym:false, requiredBadges:9, mapPos:{x:48, y:60}'
);

// Add new Lumos to route11 (req 10) - Ice base, Electric base
src = src.replace(
  '      {id:106, minLv:60, maxLv:65, rate:10}   // Geodrak (base)\n    ],\n    hasGym:false, requiredBadges:10, mapPos:{x:35, y:72}',
  '      {id:106, minLv:60, maxLv:65, rate:10},  // Geodrak (base)\n      {id:236, minLv:59, maxLv:64, rate:10},  // Frostick (base Ice)\n      {id:248, minLv:59, maxLv:64, rate:10}   // Pebblard (base Rock)\n    ],\n    hasGym:false, requiredBadges:10, mapPos:{x:35, y:72}'
);

// Add new Lumos to route12 (req 11) - Ghost base, Seedling base
src = src.replace(
  '      {id:204, minLv:63, maxLv:68, rate:20}   // Terramite (base)\n    ],\n    hasGym:false, requiredBadges:11, mapPos:{x:22, y:82}',
  '      {id:204, minLv:63, maxLv:68, rate:15},  // Terramite (base)\n      {id:215, minLv:62, maxLv:67, rate:10},  // Spiritch (base Ghost)\n      {id:262, minLv:62, maxLv:67, rate:10}   // Seedling (base Grass/Poi)\n    ],\n    hasGym:false, requiredBadges:11, mapPos:{x:22, y:82}'
);

// Add new Lumos to route13 (req 12) - Breezekin, Mindpuff bases
src = src.replace(
  '      {id:61,  minLv:65, maxLv:70, rate:10}   // wind-type standalone\n    ],\n    hasGym:false, requiredBadges:12, mapPos:{x:10, y:92}',
  '      {id:61,  minLv:65, maxLv:70, rate:10},  // wind-type standalone\n      {id:291, minLv:63, maxLv:68, rate:10},  // Breezekin (base Wind)\n      {id:222, minLv:63, maxLv:68, rate:10},  // Mindpuff (base Psychic)\n      {id:220, minLv:63, maxLv:68, rate:5}    // Hauntrix (base Ghost/Normal)\n    ],\n    hasGym:false, requiredBadges:12, mapPos:{x:10, y:92}'
);

// Add new Lumos to route14 (req 13) - Ironling base, Staticlaw base
src = src.replace(
  '      {id:55,  minLv:67, maxLv:72, rate:10}   // standalone steel\n    ],\n    hasGym:false, requiredBadges:13, mapPos:{x:28, y:92}',
  '      {id:55,  minLv:67, maxLv:72, rate:10},  // standalone steel\n      {id:278, minLv:65, maxLv:70, rate:10},  // Ironling (base Steel/Fairy)\n      {id:244, minLv:65, maxLv:70, rate:10},  // Staticlaw (base Elec/Fgt)\n      {id:280, minLv:65, maxLv:70, rate:5}    // Gearbit (base Steel/Ground)\n    ],\n    hasGym:false, requiredBadges:13, mapPos:{x:28, y:92}'
);

// Add new Lumos to route15 (req 14) - Crumblite, Crysthorn
src = src.replace(
  '      {id:93,  minLv:69, maxLv:74, rate:10}   // standalone rock\n    ],\n    hasGym:false, requiredBadges:14, mapPos:{x:48, y:85}',
  '      {id:93,  minLv:69, maxLv:74, rate:10},  // standalone rock\n      {id:251, minLv:67, maxLv:72, rate:10},  // Crumblite (base Rock/Steel)\n      {id:304, minLv:67, maxLv:72, rate:10},  // Crysthorn (base Rock/Ice)\n      {id:232, minLv:67, maxLv:72, rate:5}    // Draxon (base Dragon/Ground)\n    ],\n    hasGym:false, requiredBadges:14, mapPos:{x:48, y:85}'
);

// Add new Lumos to route16 (req 15) - Glimmerkin, Prismoo, Aquapuff, Lightpuff, Dunecrawl base
src = src.replace(
  '      {id:145, minLv:70, maxLv:75, rate:20}   // Faerrin (base)\n    ],\n    hasGym:false, requiredBadges:15, mapPos:{x:62, y:78}',
  '      {id:145, minLv:70, maxLv:75, rate:15},  // Faerrin (base)\n      {id:225, minLv:69, maxLv:74, rate:10},  // Glimmerkin (standalone Psy/Fairy)\n      {id:226, minLv:69, maxLv:74, rate:10},  // Prismoo (base split-evo)\n      {id:254, minLv:69, maxLv:74, rate:10},  // Aquapuff (base Water/Psy)\n      {id:302, minLv:69, maxLv:74, rate:5}    // Lightpuff (base Fairy, item evo)\n    ],\n    hasGym:false, requiredBadges:15, mapPos:{x:62, y:78}'
);

// Update cosmic_cavern - add Spiritch line, Psytheon (requires 223 in wind_hollow later)
src = src.replace(
  '      {id:119, minLv:70, maxLv:74, rate:15}   // Nighthound (Dark/Umbra)\n    ],\n    hasGym:false, requiredBadges:15, mapPos:{x:68, y:78}',
  '      {id:119, minLv:70, maxLv:74, rate:10},  // Nighthound (Dark/Umbra)\n      {id:222, minLv:70, maxLv:74, rate:10},  // Mindpuff (base, for Psytheon chain)\n      {id:223, minLv:70, maxLv:74, rate:10},  // Cerebrix (mid → after 222 ✓)\n      {id:255, minLv:71, maxLv:75, rate:10}   // Wavrix (mid → Aquapuff on route16 ✓)\n    ],\n    hasGym:false, requiredBadges:15, mapPos:{x:68, y:78}'
);

// Update starbloom - add final evo new Lumos
src = src.replace(
  '      {id:203, minLv:72, maxLv:76, rate:10}   // Arachnalis (mid)\n    ],\n    hasGym:true, gymLeader:"seraphina"',
  '      {id:203, minLv:72, maxLv:76, rate:10},  // Arachnalis (mid)\n      {id:224, minLv:72, maxLv:76, rate:10},  // Psytheon (final → 223 on cosmic_cavern ✓)\n      {id:217, minLv:73, maxLv:77, rate:5}    // Spectraith (final Ghost/Psy)\n    ],\n    hasGym:true, gymLeader:"seraphina"'
);

// =============================
// STEP 3: Append new areas before closing }; of WORLD_DATA
// =============================

const newAreas = `
  // ---- NEW AREAS: GYMS 9-16 EXPANSION ----

  mire_depths: {
    id:"mire_depths", name:"Mire Depths", icon:"🐸", type:"route",
    desc:"A labyrinthine deep-swamp sector south of Toxic Bog. Venomous Lumos that have shed their pre-evolutions stalk the murky waterways. Umbra scouts use the miasma as cover.",
    connections:["toxic_bog","miasmacity"],
    wildMonsters:[
      {id:156, minLv:59, maxLv:64, rate:20},  // Venekon (mid, base 155 on route10 ✓)
      {id:297, minLv:58, maxLv:63, rate:20},  // Venomwing (mid → 296 Toxifly on route10 ✓) WAIT - base needs earlier
      {id:165, minLv:59, maxLv:64, rate:20},  // Noxoveth (mid, 164 on murk_crossing ✓)
      {id:296, minLv:58, maxLv:63, rate:20},  // Toxifly (base Poi/Bug)
      {id:299, minLv:58, maxLv:63, rate:10},  // Stinglet (base Bug/Poi, also on route10)
      {id:218, minLv:59, maxLv:64, rate:10}   // Mistwraith (base Ghost/Dark, item evo)
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:41, y:67}
  },
  magma_vent: {
    id:"magma_vent", name:"Magma Vent", icon:"🌋", type:"route",
    desc:"A superheated gorge where magma seeps through rock fissures between the foothills and Tremor Summit. Ground and Fire types bask in the thermal heat.",
    connections:["quake_foothills","tremor_summit"],
    wildMonsters:[
      {id:96,  minLv:61, maxLv:66, rate:20},  // Seismith (mid, 95 on quake_foothills ✓)
      {id:99,  minLv:61, maxLv:66, rate:20},  // Geovenoth (mid, 98 on quake_foothills ✓)
      {id:102, minLv:61, maxLv:66, rate:20},  // Geoloth (mid, 101 on quake_foothills ✓)
      {id:248, minLv:60, maxLv:65, rate:15},  // Pebblard (base Rock, also on route11)
      {id:274, minLv:60, maxLv:65, rate:15},  // Cindling (base Fire/Rock)
      {id:312, minLv:60, maxLv:65, rate:10}   // Dunecrawl (base Ground/Dark)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:28, y:74}
  },
  fungal_cavern: {
    id:"fungal_cavern", name:"Fungal Cavern", icon:"🍄", type:"route",
    desc:"An underground cavern lit by bioluminescent fungi on the route to Cobweb Gully. Grass and Bug types thrive in the moist, glowing dark.",
    connections:["route12","cobweb_gully"],
    wildMonsters:[
      {id:197, minLv:62, maxLv:67, rate:15},  // Vermelin (base Bug)
      {id:215, minLv:62, maxLv:67, rate:20},  // Spiritch (base Ghost)
      {id:216, minLv:63, maxLv:68, rate:15},  // Phantorge (mid → after 215 ✓)
      {id:262, minLv:62, maxLv:67, rate:20},  // Seedling (base Grass/Poi)
      {id:263, minLv:63, maxLv:68, rate:15},  // Vinrix (mid → after 262 ✓)
      {id:272, minLv:62, maxLv:67, rate:15}   // Embrix (base Fire/Dragon)
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:20, y:83}
  },
  ancient_grove: {
    id:"ancient_grove", name:"Ancient Grove", icon:"🌳", type:"route",
    desc:"A sacred forest grove of thousand-year-old trees. The air hums with ancient energy. Grass types here have evolved beyond their usual forms.",
    connections:["cobweb_gully","silkwood"],
    wildMonsters:[
      {id:221, minLv:64, maxLv:69, rate:20},  // Grimveil (mid → Hauntrix 220 on route13 ✓)
      {id:264, minLv:64, maxLv:69, rate:20},  // Thornvast (final → Vinrix 263 on fungal_cavern ✓)
      {id:199, minLv:63, maxLv:68, rate:20},  // Aeridaleth (final Bug)
      {id:265, minLv:63, maxLv:68, rate:20},  // Mosswing (standalone Grass/Bug)
      {id:273, minLv:63, maxLv:68, rate:10},  // Blazeon (mid → Embrix 272 on fungal_cavern ✓)
      {id:290, minLv:63, maxLv:68, rate:10}   // Mimiclaw (location evo cobweb_gully nearby)
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:14, y:86}
  },
  wind_hollow: {
    id:"wind_hollow", name:"Wind Hollow", icon:"🌬️", type:"route",
    desc:"A sheltered bowl between cliff faces that creates a perfect wind tunnel. Rookie Wind-type Lumos train here before ascending Gale Ridge.",
    connections:["route13","gale_peak"],
    wildMonsters:[
      {id:292, minLv:64, maxLv:69, rate:25},  // Galehorn (mid → 291 Breezekin on route13 ✓)
      {id:293, minLv:63, maxLv:68, rate:20},  // Zephyrpuff (base Wind)
      {id:222, minLv:63, maxLv:68, rate:20},  // Mindpuff (base Psychic)
      {id:223, minLv:64, maxLv:69, rate:15},  // Cerebrix (mid → after 222 ✓)
      {id:238, minLv:63, maxLv:68, rate:10},  // Snowble (base Ice/Wind)
      {id:284, minLv:63, maxLv:68, rate:10}   // Fluffkin (base Normal/Wind)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:8, y:93}
  },
  tempest_cliffs: {
    id:"tempest_cliffs", name:"Tempest Cliffs", icon:"⛰️", type:"route",
    desc:"Sheer cliff faces battered by perpetual gales where Gale Ridge meets Gusthaven. Only the most powerful Wind types cling to the rockface here.",
    connections:["gale_ridge_east","gusthaven"],
    wildMonsters:[
      {id:294, minLv:65, maxLv:70, rate:25},  // Stormwing (mid → 293 on gale_peak ✓)
      {id:295, minLv:66, maxLv:71, rate:15},  // Cyclonax (final → after 294 ✓)
      {id:239, minLv:65, maxLv:70, rate:20},  // Blizzavane (mid → 238 on gale_peak ✓)
      {id:240, minLv:66, maxLv:71, rate:15},  // Permafrix (final → after 239 ✓)
      {id:285, minLv:65, maxLv:70, rate:15},  // Cloudvane (mid → Fluffkin on wind_hollow ✓)
      {id:174, minLv:65, maxLv:70, rate:10}   // Scalevorn (standalone Dragon/Steel)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:16, y:97}
  },
  ash_fields: {
    id:"ash_fields", name:"Ash Fields", icon:"🏜️", type:"route",
    desc:"A barren expanse of volcanic ash fields between Gusthaven and the Forge Ruins. Fire types scorch the ashen ground, and Steel types scavenge the slag.",
    connections:["route14","forge_ruins"],
    wildMonsters:[
      {id:245, minLv:66, maxLv:71, rate:25},  // Thundravex (mid → 244 on route14 ✓)
      {id:275, minLv:66, maxLv:71, rate:25},  // Infernox (mid → 274 Cindling on magma_vent ✓)
      {id:266, minLv:65, maxLv:70, rate:20},  // Shadowpup (base Dark, also route10)
      {id:267, minLv:66, maxLv:71, rate:15},  // Nightclaw (mid → after 266 ✓)
      {id:278, minLv:65, maxLv:70, rate:10},  // Ironling (base, also route14)
      {id:312, minLv:65, maxLv:70, rate:5}    // Dunecrawl (base, also magma_vent)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:30, y:90}
  },
  smelter_pass: {
    id:"smelter_pass", name:"Smelter Pass", icon:"🔥", type:"route",
    desc:"A narrow gorge between forge ruin walls where steel smelting still occurs. Metal vapors attract Steel/Fire hybrids and battle-hardened mid-evolutions.",
    connections:["forge_ruins","forge_approach"],
    wildMonsters:[
      {id:281, minLv:67, maxLv:72, rate:25},  // Cogvex (mid → 280 Gearbit on route14 ✓)
      {id:276, minLv:67, maxLv:72, rate:20},  // Pyrovast (final → Infernox on ash_fields ✓)
      {id:283, minLv:66, maxLv:71, rate:20},  // Rustpike (standalone Steel/Poi)
      {id:246, minLv:67, maxLv:72, rate:15},  // Megavolt (final → 245 on ash_fields ✓)
      {id:268, minLv:67, maxLv:72, rate:10},  // Darkfang (final → 267 on ash_fields ✓)
      {id:307, minLv:66, maxLv:71, rate:10}   // Cinderpaw (standalone Fire/Dark)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:36, y:91}
  },
  granite_tunnels: {
    id:"granite_tunnels", name:"Granite Tunnels", icon:"⛏️", type:"route",
    desc:"Underground tunnels bored through solid granite linking Ironforge to the Stone Plateau. Rock and Dragon types nest in the crystalline formations.",
    connections:["route15","stone_plateau"],
    wildMonsters:[
      {id:249, minLv:68, maxLv:73, rate:25},  // Boulderax (mid → 248 on route11/magma_vent ✓)
      {id:305, minLv:68, maxLv:73, rate:20},  // Geoshard (mid → 304 Crysthorn on route15 ✓)
      {id:233, minLv:68, maxLv:73, rate:20},  // Serpenthorn (mid → 232 Draxon on route15 ✓)
      {id:174, minLv:68, maxLv:73, rate:15},  // Scalevorn (standalone Dragon/Steel)
      {id:251, minLv:67, maxLv:72, rate:10},  // Crumblite (base Rock/Steel, also route15)
      {id:282, minLv:68, maxLv:73, rate:10}   // Mechavast (final → Cogvex on smelter_pass ✓)
    ],
    hasGym:false, requiredBadges:14, mapPos:{x:46, y:84}
  },
  crystal_mine: {
    id:"crystal_mine", name:"Crystal Mine", icon:"💎", type:"route",
    desc:"An exhausted gem mine between Stone Plateau and Quarryville where crystalline Rock types have colonized the abandoned shafts.",
    connections:["stone_plateau","quarryville"],
    wildMonsters:[
      {id:250, minLv:70, maxLv:75, rate:20},  // Megalith (final → 249 on granite_tunnels ✓)
      {id:306, minLv:70, maxLv:75, rate:20},  // Crystallon (final → 305 on granite_tunnels ✓)
      {id:234, minLv:70, maxLv:75, rate:20},  // Wyvernak (final → 233 on granite_tunnels ✓)
      {id:237, minLv:69, maxLv:74, rate:15},  // Glacicore (mid → 236 Frostick on route11 ✓)
      {id:313, minLv:69, maxLv:74, rate:15},  // Sandrix (mid → 312 Dunecrawl on magma_vent ✓)
      {id:241, minLv:70, maxLv:75, rate:10}   // Crystalix (location evo from cosmic_cavern energy)
    ],
    hasGym:false, requiredBadges:14, mapPos:{x:53, y:83}
  },
  nebula_gorge: {
    id:"nebula_gorge", name:"Nebula Gorge", icon:"🌠", type:"route",
    desc:"A star-dusted gorge where cosmic energy from nearby Starbloom saturates the air. Psychic and Fairy types commune with the starlight here.",
    connections:["route16","cosmic_cavern"],
    wildMonsters:[
      {id:254, minLv:70, maxLv:75, rate:20},  // Aquapuff (base, also on route16)
      {id:255, minLv:71, maxLv:76, rate:20},  // Wavrix (mid → after 254 ✓)
      {id:215, minLv:70, maxLv:75, rate:15},  // Spiritch (base Ghost)
      {id:216, minLv:71, maxLv:76, rate:15},  // Phantorge (mid → after 215 ✓)
      {id:259, minLv:70, maxLv:75, rate:15},  // Lumejell (standalone Water/Psy)
      {id:269, minLv:70, maxLv:75, rate:10},  // Grimshade (base Dark, item evo)
      {id:271, minLv:70, maxLv:75, rate:5}    // Duskrat (standalone Dark/Normal)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:64, y:76}
  },
  astral_plateau: {
    id:"astral_plateau", name:"Astral Plateau", icon:"⭐", type:"route",
    desc:"A high plateau above Cosmic Cavern where the sky seems close enough to touch. Rare Lumos shaped by cosmic energy appear here in the hours around midnight.",
    connections:["cosmic_cavern","starbloom"],
    wildMonsters:[
      {id:217, minLv:72, maxLv:77, rate:20},  // Spectraith (final → 216 on nebula_gorge ✓)
      {id:224, minLv:72, maxLv:77, rate:20},  // Psytheon (final → 223 on cosmic_cavern ✓)
      {id:303, minLv:72, maxLv:77, rate:15},  // Lumivane (Moon Stone evo, base 302 on route16 ✓)
      {id:229, minLv:72, maxLv:77, rate:15},  // Prismolt (Thunder Stone evo, base 226 on route16 ✓)
      {id:228, minLv:72, maxLv:77, rate:10},  // Prismoon (Moon Stone evo, base 226 on route16 ✓)
      {id:309, minLv:72, maxLv:77, rate:10},  // Aquaphant (Water Stone evo, base 308 nearby)
      {id:308, minLv:71, maxLv:76, rate:10}   // Tidewraith (base Water/Ghost)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:67, y:74}
  },

`;

// Insert before the closing }; of WORLD_DATA
const closingMarker = '};\n\n// ============================================================\n// GYM LEADERS';
if (!src.includes(closingMarker)) {
  console.error('ERROR: Could not find WORLD_DATA closing marker!');
  // Try to find it differently
  const idx = src.indexOf('};\n\n// ============================================================');
  if (idx === -1) {
    console.error('FATAL: Cannot find closing of WORLD_DATA');
    process.exit(1);
  }
}
src = src.replace(closingMarker, newAreas + closingMarker);

fs.writeFileSync(dataPath, src, 'utf8');

// Verify new areas
const newAreaIds = ['mire_depths','magma_vent','fungal_cavern','ancient_grove',
  'wind_hollow','tempest_cliffs','ash_fields','smelter_pass',
  'granite_tunnels','crystal_mine','nebula_gorge','astral_plateau'];
let ok = true;
for (const areaId of newAreaIds) {
  if (!src.includes(`id:"${areaId}"`)) {
    console.log(`MISSING area: ${areaId}`);
    ok = false;
  }
}
if (ok) console.log(`All ${newAreaIds.length} new areas added successfully!`);

// Count total areas
const areaCount = (src.match(/id:"[a-z_]+"[,\s]/g) || []).length;
console.log(`Approximate area entries: ${areaCount}`);
