/**
 * add_routes.js
 * Adds new areas/routes between gyms 9-16, updates connections,
 * adds 3rd-stage Lumos to encounter tables, and fixes evo ordering.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'data.js');
let content = fs.readFileSync(filePath, 'utf8');

// ============================================================
// STEP 1: UPDATE CONNECTIONS IN EXISTING AREAS
// ============================================================

// route10: bloomhaven → murk_crossing (insert murk_crossing between them)
content = content.split('connections:["bloomhaven","miasmacity"]').join('connections:["bloomhaven","murk_crossing"]');

// miasmacity: route10 → murk_crossing
content = content.split('connections:["route10","route11"]').join('connections:["murk_crossing","route11"]');

// route11: terravault → quake_foothills
content = content.split('connections:["miasmacity","terravault"]').join('connections:["miasmacity","quake_foothills"]');

// terravault: route11 → quake_foothills
content = content.split('connections:["route11","route12"]').join('connections:["quake_foothills","route12"]');

// route12: silkwood → cobweb_gully
content = content.split('connections:["terravault","silkwood"]').join('connections:["terravault","cobweb_gully"]');

// silkwood: route12 → cobweb_gully
content = content.split('connections:["route12","route13"]').join('connections:["cobweb_gully","route13"]');

// route13: gusthaven → gale_ridge_east (direction-change split)
content = content.split('connections:["silkwood","gusthaven"]').join('connections:["silkwood","gale_ridge_east"]');

// gusthaven: route13 → gale_ridge_east
content = content.split('connections:["route13","route14"]').join('connections:["gale_ridge_east","route14"]');

// route14: ironforge → forge_approach
content = content.split('connections:["gusthaven","ironforge"]').join('connections:["gusthaven","forge_approach"]');

// ironforge: route14 → forge_approach
content = content.split('connections:["route14","route15"]').join('connections:["forge_approach","route15"]');

// route15: quarryville → stone_plateau
content = content.split('connections:["ironforge","quarryville"]').join('connections:["ironforge","stone_plateau"]');

// quarryville: route15 → stone_plateau
content = content.split('connections:["route15","route16"]').join('connections:["stone_plateau","route16"]');

// route16: starbloom → cosmic_cavern
content = content.split('connections:["quarryville","starbloom"]').join('connections:["quarryville","cosmic_cavern"]');

// starbloom: route16 → cosmic_cavern, add void_rift branch
content = content.split('connections:["route16","victoryroad"]').join('connections:["cosmic_cavern","victoryroad","void_rift"]');

// ============================================================
// STEP 2: UPDATE ENCOUNTER TABLES - add 3rd-stage Lumos + fix ordering
// ============================================================

// --- route10: add Acidovast (159) as rare 3rd-stage poison ---
content = content.split(
`  route10: {
    id:"route10", name:"Route 10 - Toxic Passage", icon:"☠️", type:"route",
    desc:"A murky swamp path where poisonous fumes rise from the ground.",
    connections:["bloomhaven","murk_crossing"],
    wildMonsters:[
      {id:155, minLv:57, maxLv:62, rate:25},
      {id:157, minLv:57, maxLv:62, rate:25},
      {id:160, minLv:58, maxLv:63, rate:25},
      {id:163, minLv:59, maxLv:63, rate:15},
      {id:164, minLv:58, maxLv:63, rate:10}
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:48, y:60}
  },`
).join(
`  route10: {
    id:"route10", name:"Route 10 - Toxic Passage", icon:"☠️", type:"route",
    desc:"A murky swamp path where poisonous fumes rise from the ground.",
    connections:["bloomhaven","murk_crossing"],
    wildMonsters:[
      {id:155, minLv:57, maxLv:62, rate:20},   // Toxirin (base)
      {id:157, minLv:57, maxLv:62, rate:20},   // Acidelix (base)
      {id:160, minLv:58, maxLv:63, rate:20},   // Miasoveth (base)
      {id:162, minLv:58, maxLv:63, rate:15},   // Marlix (base, pre-evo of Venomalis)
      {id:163, minLv:59, maxLv:63, rate:15},   // Venomalis (evo of Marlix)
      {id:159, minLv:60, maxLv:65, rate:10}    // Acidovast (3rd-stage, rare)
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:48, y:60}
  },`
);

// --- route11: add Tectonvast (97) as rare 3rd-stage ground ---
content = content.split(
`  route11: {
    id:"route11", name:"Route 11 - Tremor Pass", icon:"🏔️", type:"route",
    desc:"A rumbling mountain pass where the ground never stops shaking.",
    connections:["miasmacity","quake_foothills"],
    wildMonsters:[
      {id:95, minLv:59, maxLv:64, rate:25},
      {id:101, minLv:59, maxLv:64, rate:25},
      {id:104, minLv:60, maxLv:65, rate:25},
      {id:106, minLv:60, maxLv:65, rate:15},
      {id:105, minLv:61, maxLv:66, rate:10}
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:35, y:72}
  },`
).join(
`  route11: {
    id:"route11", name:"Route 11 - Tremor Pass", icon:"🏔️", type:"route",
    desc:"A rumbling mountain pass where the ground never stops shaking.",
    connections:["miasmacity","quake_foothills"],
    wildMonsters:[
      {id:95, minLv:59, maxLv:64, rate:20},   // Terrakin (base)
      {id:101, minLv:59, maxLv:64, rate:20},  // Limoux (base)
      {id:104, minLv:60, maxLv:65, rate:20},  // Arenikin (base, pre-evo of Dravanas)
      {id:105, minLv:61, maxLv:66, rate:15},  // Dravanas (evo of Arenikin) — after base ✓
      {id:106, minLv:60, maxLv:65, rate:15},  // Geodrak (base)
      {id:97,  minLv:62, maxLv:67, rate:10}   // Tectonvast (3rd-stage, rare)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:35, y:72}
  },`
);

// --- route12: add Aeridaleth (199) as rare 3rd-stage bug ---
content = content.split(
`  route12: {
    id:"route12", name:"Route 12 - Silk Road", icon:"🕸️", type:"route",
    desc:"A path threaded with giant webs. Bug types ambush travelers at every turn.",
    connections:["terravault","cobweb_gully"],
    wildMonsters:[
      {id:197, minLv:61, maxLv:66, rate:25},
      {id:198, minLv:61, maxLv:66, rate:25},
      {id:200, minLv:62, maxLv:67, rate:25},
      {id:202, minLv:62, maxLv:67, rate:15},
      {id:204, minLv:63, maxLv:68, rate:10}
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:22, y:82}
  },`
).join(
`  route12: {
    id:"route12", name:"Route 12 - Silk Road", icon:"🕸️", type:"route",
    desc:"A path threaded with giant webs. Bug types ambush travelers at every turn.",
    connections:["terravault","cobweb_gully"],
    wildMonsters:[
      {id:197, minLv:61, maxLv:66, rate:20},  // Vermelin (base)
      {id:198, minLv:62, maxLv:67, rate:20},  // Chrysalix (mid, evo of Vermelin) — after base ✓
      {id:199, minLv:63, maxLv:68, rate:10},  // Aeridaleth (3rd-stage, rare) — after mid ✓
      {id:200, minLv:61, maxLv:66, rate:20},  // Colerix (base)
      {id:202, minLv:62, maxLv:67, rate:20},  // Sericrix (base)
      {id:204, minLv:63, maxLv:68, rate:10}   // Terramite (base)
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:22, y:82}
  },`
);

// --- route13: add Aeolarch (110) as rare 3rd-stage wind ---
content = content.split(
`  route13: {
    id:"route13", name:"Route 13 - Gale Ridge", icon:"🌬️", type:"route",
    desc:"A windswept ridge where powerful gusts knock down the unprepared.",
    connections:["silkwood","gale_ridge_east"],
    wildMonsters:[
      {id:108, minLv:63, maxLv:68, rate:25},
      {id:111, minLv:63, maxLv:68, rate:25},
      {id:114, minLv:64, maxLv:69, rate:25},
      {id:116, minLv:64, maxLv:69, rate:15},
      {id:61, minLv:65, maxLv:70, rate:10}
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:10, y:92}
  },`
).join(
`  route13: {
    id:"route13", name:"Route 13 - Gale Ridge West", icon:"🌬️", type:"route",
    desc:"The western arm of Gale Ridge, where howling winds funnel through a narrow canyon toward the furthest point of the region.",
    connections:["silkwood","gale_ridge_east"],
    wildMonsters:[
      {id:108, minLv:63, maxLv:68, rate:20},  // Zephyrkin (base)
      {id:111, minLv:63, maxLv:68, rate:20},  // Aeolin (base)
      {id:114, minLv:64, maxLv:69, rate:20},  // Nimbusel (base)
      {id:116, minLv:64, maxLv:69, rate:20},  // Zephyrin (base)
      {id:61,  minLv:65, maxLv:70, rate:10},  // wind-type
      {id:110, minLv:65, maxLv:70, rate:10}   // Aeolarch (3rd-stage, rare)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:10, y:92}
  },`
);

// --- route14: add Adamovast (149) as rare 3rd-stage steel ---
content = content.split(
`  route14: {
    id:"route14", name:"Route 14 - Ironwork Path", icon:"⚙️", type:"route",
    desc:"A path lined with abandoned machinery. Steel types have claimed the ruins as their territory.",
    connections:["gusthaven","forge_approach"],
    wildMonsters:[
      {id:147, minLv:65, maxLv:70, rate:25},
      {id:150, minLv:65, maxLv:70, rate:25},
      {id:134, minLv:66, maxLv:71, rate:25},
      {id:153, minLv:66, maxLv:71, rate:15},
      {id:55, minLv:67, maxLv:72, rate:10}
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:28, y:92}
  },`
).join(
`  route14: {
    id:"route14", name:"Route 14 - Ironwork Path", icon:"⚙️", type:"route",
    desc:"A path lined with abandoned machinery. Steel types have claimed the ruins as their territory.",
    connections:["gusthaven","forge_approach"],
    wildMonsters:[
      {id:147, minLv:65, maxLv:70, rate:20},  // Ferrokin (base)
      {id:150, minLv:65, maxLv:70, rate:20},  // Gearon (base)
      {id:134, minLv:66, maxLv:71, rate:20},  // Aeronyx (base)
      {id:153, minLv:66, maxLv:71, rate:15},  // Forgekin (base)
      {id:55,  minLv:67, maxLv:72, rate:15},  // steel-type
      {id:149, minLv:67, maxLv:72, rate:10}   // Adamovast (3rd-stage, rare)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:28, y:92}
  },`
);

// --- route15: add Frigolith (196) as rare 3rd-stage rock ---
content = content.split(
`  route15: {
    id:"route15", name:"Route 15 - Granite Pass", icon:"🪨", type:"route",
    desc:"A narrow mountain pass strewn with boulders. Rock types dominate.",
    connections:["ironforge","stone_plateau"],
    wildMonsters:[
      {id:191, minLv:67, maxLv:72, rate:25},
      {id:193, minLv:67, maxLv:72, rate:25},
      {id:200, minLv:68, maxLv:73, rate:25},
      {id:132, minLv:68, maxLv:73, rate:15},
      {id:93, minLv:69, maxLv:74, rate:10}
    ],
    hasGym:false, requiredBadges:14, mapPos:{x:48, y:85}
  },`
).join(
`  route15: {
    id:"route15", name:"Route 15 - Granite Pass", icon:"🪨", type:"route",
    desc:"A narrow mountain pass strewn with boulders. Rock types dominate.",
    connections:["ironforge","stone_plateau"],
    wildMonsters:[
      {id:191, minLv:67, maxLv:72, rate:20},  // Petrikin (base)
      {id:193, minLv:67, maxLv:72, rate:20},  // Rugothon (base)
      {id:132, minLv:68, maxLv:73, rate:20},  // Obsidrix (base, pre-evo of Monolithox)
      {id:133, minLv:69, maxLv:74, rate:15},  // Monolithox (evo of Obsidrix) — after base ✓
      {id:93,  minLv:69, maxLv:74, rate:15},  // rock-type
      {id:196, minLv:70, maxLv:75, rate:10}   // Frigolith (3rd-stage, rare)
    ],
    hasGym:false, requiredBadges:14, mapPos:{x:48, y:85}
  },`
);

// --- route16: add Celestarch (144) as rare 3rd-stage fairy; fix 72/73 ordering ---
content = content.split(
`  route16: {
    id:"route16", name:"Route 16 - Starlit Path", icon:"✨", type:"route",
    desc:"A magical path where starlight dances on every surface. Fairy types float among the luminescent flowers.",
    connections:["quarryville","cosmic_cavern"],
    wildMonsters:[
      {id:137, minLv:69, maxLv:74, rate:25},
      {id:72, minLv:69, maxLv:74, rate:25},
      {id:34, minLv:70, maxLv:75, rate:25},
      {id:145, minLv:70, maxLv:75, rate:15},
      {id:73, minLv:71, maxLv:76, rate:10}
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:62, y:78}
  },`
).join(
`  route16: {
    id:"route16", name:"Route 16 - Starlit Path", icon:"✨", type:"route",
    desc:"A magical path where starlight dances on every surface. Fairy types float among the luminescent flowers.",
    connections:["quarryville","cosmic_cavern"],
    wildMonsters:[
      {id:137, minLv:69, maxLv:74, rate:20},  // Lumkin (base)
      {id:72,  minLv:69, maxLv:74, rate:20},  // fairy-type (base)
      {id:73,  minLv:70, maxLv:75, rate:20},  // fairy-type (evo, after base ✓)
      {id:34,  minLv:70, maxLv:75, rate:15},  // fairy-type
      {id:145, minLv:70, maxLv:75, rate:15},  // Faerrin (base)
      {id:144, minLv:71, maxLv:76, rate:10}   // Celestarch (3rd-stage, rare)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:62, y:78}
  },`
);

// --- miasmacity: add Acidovast (159) as rare ---
content = content.split(
`  miasmacity: {
    id:"miasmacity", name:"Miasma City", icon:"🏭", type:"city",
    desc:"An industrial city shrouded in toxic mist. Home to Gym Leader Viper, master of Poison types.",
    connections:["murk_crossing","route11"],
    wildMonsters:[
      {id:156, minLv:58, maxLv:63, rate:30},
      {id:158, minLv:58, maxLv:63, rate:25},
      {id:32, minLv:59, maxLv:64, rate:25},
      {id:165, minLv:60, maxLv:64, rate:20}
    ],
    hasGym:true, gymLeader:"viper", requiredBadges:9, mapPos:{x:42, y:65}
  },`
).join(
`  miasmacity: {
    id:"miasmacity", name:"Miasma City", icon:"🏭", type:"city",
    desc:"An industrial city shrouded in toxic mist. Home to Gym Leader Viper, master of Poison types.",
    connections:["murk_crossing","route11"],
    wildMonsters:[
      {id:156, minLv:58, maxLv:63, rate:25},  // Venekon (mid)
      {id:158, minLv:58, maxLv:63, rate:25},  // Toxoloth (mid)
      {id:32,  minLv:59, maxLv:64, rate:20},
      {id:165, minLv:60, maxLv:64, rate:20},  // Noxoveth (mid)
      {id:159, minLv:61, maxLv:65, rate:10}   // Acidovast (3rd-stage, rare)
    ],
    hasGym:true, gymLeader:"viper", requiredBadges:9, mapPos:{x:42, y:65}
  },`
);

// --- terravault: add Tectonvast (97) and Geovast (103) as rare ground finals ---
content = content.split(
`  terravault: {
    id:"terravault", name:"Terravault City", icon:"⛏️", type:"city",
    desc:"A city carved into a mountainside, rich with mineral deposits. Home to Gym Leader Atlas.",
    connections:["quake_foothills","route12"],
    wildMonsters:[
      {id:96, minLv:60, maxLv:65, rate:30},
      {id:102, minLv:60, maxLv:65, rate:25},
      {id:107, minLv:61, maxLv:66, rate:25},
      {id:154, minLv:62, maxLv:66, rate:20}
    ],
    hasGym:true, gymLeader:"atlas", requiredBadges:10, mapPos:{x:28, y:78}
  },`
).join(
`  terravault: {
    id:"terravault", name:"Terravault City", icon:"⛏️", type:"city",
    desc:"A city carved into a mountainside, rich with mineral deposits. Home to Gym Leader Atlas.",
    connections:["quake_foothills","route12"],
    wildMonsters:[
      {id:96,  minLv:60, maxLv:65, rate:25},  // Seismith (mid, pre-evo of Tectonvast)
      {id:97,  minLv:61, maxLv:66, rate:15},  // Tectonvast (3rd-stage) — after mid ✓
      {id:102, minLv:60, maxLv:65, rate:25},  // Geoloth (mid, pre-evo of Geovast)
      {id:107, minLv:61, maxLv:66, rate:20},  // Terraquon (final)
      {id:154, minLv:62, maxLv:66, rate:15}   // Ferrolith (mid)
    ],
    hasGym:true, gymLeader:"atlas", requiredBadges:10, mapPos:{x:28, y:78}
  },`
);

// --- gusthaven: add Aeolarch (110) and Cyclavorn (113) ---
content = content.split(
`  gusthaven: {
    id:"gusthaven", name:"Gusthaven Town", icon:"🌀", type:"city",
    desc:"A town of windmills and airships. Home to Gym Leader Zephyra, master of Wind types.",
    connections:["gale_ridge_east","route14"],
    wildMonsters:[
      {id:109, minLv:64, maxLv:69, rate:30},
      {id:112, minLv:64, maxLv:69, rate:25},
      {id:115, minLv:65, maxLv:70, rate:25},
      {id:62, minLv:66, maxLv:70, rate:20}
    ],
    hasGym:true, gymLeader:"zephyra", requiredBadges:12, mapPos:{x:18, y:95}
  },`
).join(
`  gusthaven: {
    id:"gusthaven", name:"Gusthaven Town", icon:"🌀", type:"city",
    desc:"A town of windmills and airships. Home to Gym Leader Zephyra, master of Wind types.",
    connections:["gale_ridge_east","route14"],
    wildMonsters:[
      {id:109, minLv:64, maxLv:69, rate:20},  // Aeolomane (mid, pre-evo of Aeolarch)
      {id:110, minLv:65, maxLv:70, rate:15},  // Aeolarch (3rd-stage) — after mid ✓
      {id:112, minLv:64, maxLv:69, rate:20},  // Cyclavel (mid, pre-evo of Cyclavorn)
      {id:113, minLv:65, maxLv:70, rate:15},  // Cyclavorn (3rd-stage) — after mid ✓
      {id:115, minLv:65, maxLv:70, rate:20},  // Aetherworn (final)
      {id:62,  minLv:66, maxLv:70, rate:10}
    ],
    hasGym:true, gymLeader:"zephyra", requiredBadges:12, mapPos:{x:18, y:95}
  },`
);

// --- ironforge: add Adamovast (149) ---
content = content.split(
`  ironforge: {
    id:"ironforge", name:"Ironforge City", icon:"🔨", type:"city",
    desc:"A city of foundries and forges. Home to Gym Leader Ferro, master of Steel types.",
    connections:["forge_approach","route15"],
    wildMonsters:[
      {id:148, minLv:66, maxLv:71, rate:30},
      {id:151, minLv:66, maxLv:71, rate:25},
      {id:152, minLv:67, maxLv:72, rate:25},
      {id:146, minLv:68, maxLv:72, rate:20}
    ],
    hasGym:true, gymLeader:"ferro", requiredBadges:13, mapPos:{x:38, y:88}
  },`
).join(
`  ironforge: {
    id:"ironforge", name:"Ironforge City", icon:"🔨", type:"city",
    desc:"A city of foundries and forges. Home to Gym Leader Ferro, master of Steel types.",
    connections:["forge_approach","route15"],
    wildMonsters:[
      {id:148, minLv:66, maxLv:71, rate:25},  // Adamavast (mid, pre-evo of Adamovast)
      {id:149, minLv:67, maxLv:72, rate:15},  // Adamovast (3rd-stage) — after mid ✓
      {id:151, minLv:66, maxLv:71, rate:25},  // Ferrotron (mid)
      {id:152, minLv:67, maxLv:72, rate:20},  // Imperion (Steel/Rock)
      {id:146, minLv:68, maxLv:72, rate:15}   // Shinarith (Fairy/Steel final)
    ],
    hasGym:true, gymLeader:"ferro", requiredBadges:13, mapPos:{x:38, y:88}
  },`
);

// --- quarryville: add Frigolith (196) ---
content = content.split(
`  quarryville: {
    id:"quarryville", name:"Quarryville Town", icon:"🏗️", type:"city",
    desc:"A mining town carved from solid rock. Home to Gym Leader Boulder, master of Rock types.",
    connections:["stone_plateau","route16"],
    wildMonsters:[
      {id:192, minLv:68, maxLv:73, rate:30},
      {id:195, minLv:68, maxLv:73, rate:25},
      {id:133, minLv:69, maxLv:74, rate:25},
      {id:92, minLv:70, maxLv:74, rate:20}
    ],
    hasGym:true, gymLeader:"boulder", requiredBadges:14, mapPos:{x:55, y:82}
  },`
).join(
`  quarryville: {
    id:"quarryville", name:"Quarryville Town", icon:"🏗️", type:"city",
    desc:"A mining town carved from solid rock. Home to Gym Leader Boulder, master of Rock types.",
    connections:["stone_plateau","route16"],
    wildMonsters:[
      {id:192, minLv:68, maxLv:73, rate:25},  // Lithavast (mid)
      {id:195, minLv:68, maxLv:73, rate:20},  // Prismolith (mid, pre-evo of Frigolith)
      {id:196, minLv:69, maxLv:74, rate:15},  // Frigolith (3rd-stage) — after mid ✓
      {id:133, minLv:69, maxLv:74, rate:25},  // Monolithox (final)
      {id:92,  minLv:70, maxLv:74, rate:15}
    ],
    hasGym:true, gymLeader:"boulder", requiredBadges:14, mapPos:{x:55, y:82}
  },`
);

// --- starbloom: add Celestarch (144) and Lumiarch (139) ---
content = content.split(
`  starbloom: {
    id:"starbloom", name:"Starbloom City", icon:"🌟", type:"city",
    desc:"A radiant city that glows with fairy magic. Home to Gym Leader Seraphina, the last gym before the Elite Four.",
    connections:["cosmic_cavern","victoryroad","void_rift"],
    wildMonsters:[
      {id:138, minLv:70, maxLv:75, rate:30},
      {id:143, minLv:70, maxLv:75, rate:25},
      {id:146, minLv:71, maxLv:76, rate:25},
      {id:203, minLv:72, maxLv:76, rate:20}
    ],
    hasGym:true, gymLeader:"seraphina", requiredBadges:15, mapPos:{x:68, y:72}
  }`
).join(
`  starbloom: {
    id:"starbloom", name:"Starbloom City", icon:"🌟", type:"city",
    desc:"A radiant city that glows with fairy magic. Home to Gym Leader Seraphina, the last gym before the Elite Four.",
    connections:["cosmic_cavern","victoryroad","void_rift"],
    wildMonsters:[
      {id:138, minLv:70, maxLv:75, rate:20},  // Aetherael (mid, pre-evo of Lumiarch)
      {id:139, minLv:71, maxLv:76, rate:15},  // Lumiarch (3rd-stage) — after mid ✓
      {id:143, minLv:70, maxLv:75, rate:20},  // Lunarael (mid, pre-evo of Celestarch)
      {id:144, minLv:71, maxLv:76, rate:15},  // Celestarch (3rd-stage) — after mid ✓
      {id:146, minLv:71, maxLv:76, rate:20},  // Shinarith (final)
      {id:203, minLv:72, maxLv:76, rate:10}   // Arachnalis (final)
    ],
    hasGym:true, gymLeader:"seraphina", requiredBadges:15, mapPos:{x:68, y:72}
  }`
);

// ============================================================
// STEP 3: INSERT NEW AREA DEFINITIONS before closing `};` of WORLD_DATA
// ============================================================

const NEW_AREAS = `
  // ---- ADDITIONAL ROUTES (direction-change splits & mid-gym connectors) ----
  murk_crossing: {
    id:"murk_crossing", name:"Murk Crossing", icon:"🌫️", type:"route",
    desc:"A bog-choked crossing where the path turns south through fetid marshland. Toxic vapors hang low and Poison types lurk in every murky puddle.",
    connections:["route10","miasmacity"],
    wildMonsters:[
      {id:155, minLv:57, maxLv:62, rate:20},  // Toxirin (base)
      {id:156, minLv:58, maxLv:63, rate:25},  // Venekon (mid) — after base ✓
      {id:157, minLv:57, maxLv:62, rate:20},  // Acidelix (base)
      {id:158, minLv:58, maxLv:63, rate:25},  // Toxoloth (mid) — after base ✓
      {id:159, minLv:60, maxLv:65, rate:10}   // Acidovast (3rd-stage, rare)
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:42, y:60}
  },
  quake_foothills: {
    id:"quake_foothills", name:"Quake Foothills", icon:"🌋", type:"route",
    desc:"Rolling foothills rocked by constant tremors where Terravault's mountain range begins. Ground-type Lumos burrow through the cracked and heaving earth.",
    connections:["route11","terravault"],
    wildMonsters:[
      {id:95,  minLv:59, maxLv:64, rate:20},  // Terrakin (base)
      {id:96,  minLv:60, maxLv:65, rate:25},  // Seismith (mid) — after base ✓
      {id:101, minLv:59, maxLv:64, rate:20},  // Limoux (base)
      {id:102, minLv:60, maxLv:65, rate:25},  // Geoloth (mid) — after base ✓
      {id:97,  minLv:62, maxLv:67, rate:10}   // Tectonvast (3rd-stage, rare)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:28, y:72}
  },
  cobweb_gully: {
    id:"cobweb_gully", name:"Cobweb Gully", icon:"🕸️", type:"route",
    desc:"A sunken gully thick with silken threads where every tree and boulder is wrapped in webs. Bug types in every stage of evolution compete for territory.",
    connections:["route12","silkwood"],
    wildMonsters:[
      {id:197, minLv:61, maxLv:66, rate:20},  // Vermelin (base)
      {id:198, minLv:62, maxLv:67, rate:20},  // Chrysalix (mid) — after base ✓
      {id:199, minLv:63, maxLv:68, rate:10},  // Aeridaleth (3rd-stage, rare) — after mid ✓
      {id:200, minLv:61, maxLv:66, rate:20},  // Colerix (base)
      {id:204, minLv:62, maxLv:67, rate:20},  // Terramite (base)
      {id:205, minLv:63, maxLv:68, rate:10}   // Geodrix (mid) — after base ✓
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:15, y:82}
  },
  gale_ridge_east: {
    id:"gale_ridge_east", name:"Gale Ridge East", icon:"🌪️", type:"route",
    desc:"Where Gale Ridge curves sharply eastward, the winds reverse direction entirely. This turn is notorious for sending unprepared trainers stumbling backward toward Silkwood.",
    connections:["route13","gusthaven"],
    wildMonsters:[
      {id:108, minLv:63, maxLv:68, rate:15},  // Zephyrkin (base)
      {id:109, minLv:64, maxLv:69, rate:20},  // Aeolomane (mid) — after base ✓
      {id:111, minLv:63, maxLv:68, rate:15},  // Aeolin (base)
      {id:112, minLv:64, maxLv:69, rate:20},  // Cyclavel (mid) — after base ✓
      {id:110, minLv:65, maxLv:70, rate:15},  // Aeolarch (3rd-stage) — after mid ✓
      {id:113, minLv:65, maxLv:70, rate:15}   // Cyclavorn (3rd-stage) — after mid ✓
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:14, y:95}
  },
  forge_approach: {
    id:"forge_approach", name:"Forge Approach", icon:"🔩", type:"route",
    desc:"The rusted outer edge of Ironforge's industrial sprawl. Abandoned conveyor lines and slag heaps attract Steel-type Lumos who claim the metal as their own.",
    connections:["route14","ironforge"],
    wildMonsters:[
      {id:147, minLv:65, maxLv:70, rate:20},  // Ferrokin (base)
      {id:148, minLv:66, maxLv:71, rate:25},  // Adamavast (mid) — after base ✓
      {id:150, minLv:65, maxLv:70, rate:20},  // Gearon (base)
      {id:151, minLv:66, maxLv:71, rate:20},  // Ferrotron (mid) — after base ✓
      {id:149, minLv:67, maxLv:72, rate:10},  // Adamovast (3rd-stage, rare) — after mid ✓
      {id:153, minLv:66, maxLv:71, rate:5}    // Forgekin (base)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:38, y:92}
  },
  stone_plateau: {
    id:"stone_plateau", name:"Stone Plateau", icon:"🏜️", type:"route",
    desc:"A windswept expanse of exposed bedrock leading into Quarryville. Ancient monoliths dot the plateau and Rock and Dark types claim each one as territory.",
    connections:["route15","quarryville"],
    wildMonsters:[
      {id:191, minLv:67, maxLv:72, rate:20},  // Petrikin (base)
      {id:192, minLv:68, maxLv:73, rate:25},  // Lithavast (mid) — after base ✓
      {id:193, minLv:67, maxLv:72, rate:20},  // Rugothon (base)
      {id:132, minLv:68, maxLv:73, rate:15},  // Obsidrix (base, Rock/Dark)
      {id:133, minLv:69, maxLv:74, rate:10},  // Monolithox (mid) — after base ✓
      {id:196, minLv:70, maxLv:75, rate:10}   // Frigolith (3rd-stage, rare)
    ],
    hasGym:false, requiredBadges:14, mapPos:{x:48, y:82}
  },
  cosmic_cavern: {
    id:"cosmic_cavern", name:"Cosmic Cavern", icon:"🌌", type:"route",
    desc:"A glittering cavern lit by bioluminescent crystals on the approach to Starbloom. Fairy types dance in the starlight, but dark shadows hint at lurking Umbra agents.",
    connections:["route16","starbloom"],
    wildMonsters:[
      {id:137, minLv:69, maxLv:74, rate:20},  // Lumkin (base)
      {id:138, minLv:70, maxLv:75, rate:20},  // Aetherael (mid) — after base ✓
      {id:142, minLv:69, maxLv:74, rate:20},  // Dawnirel (base)
      {id:143, minLv:70, maxLv:75, rate:20},  // Lunarael (mid) — after base ✓
      {id:144, minLv:71, maxLv:76, rate:10},  // Celestarch (3rd-stage, rare) — after mid ✓
      {id:119, minLv:70, maxLv:74, rate:10}   // Nighthound (Dark, Umbra-linked)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:68, y:78}
  },
  void_rift: {
    id:"void_rift", name:"The Void Rift", icon:"🌀", type:"special",
    desc:"A tear in reality pulsing with dark energy near Route 16. Team Umbra's experiments cracked open this rift, and within its swirling darkness, Voidraxis — the Void Star — awaits any trainer bold enough to enter.",
    connections:["starbloom"],
    wildMonsters:[
      {id:119, minLv:72, maxLv:77, rate:25},  // Nighthound (Dark)
      {id:122, minLv:72, maxLv:77, rate:25},  // Spectrewing (Dark)
      {id:120, minLv:73, maxLv:78, rate:20},  // dark-type
      {id:131, minLv:73, maxLv:78, rate:15},  // Necrothon (Dark/Grass)
      {id:211, minLv:75, maxLv:80, rate:5}    // Voidraxis (Legendary, very rare)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:75, y:72}
  }`;

// Insert new areas before the closing `};` of WORLD_DATA
// The WORLD_DATA ends with:  starbloom: {...}\n};
// After our starbloom edit it ends with ...mapPos:{x:68, y:72}\n  }\n};
content = content.replace(
  /(\s+hasGym:true, gymLeader:"seraphina", requiredBadges:15, mapPos:\{x:68, y:72\}\s*\}\s*\n\};)/,
  (match) => {
    return match.replace('\n};', NEW_AREAS + '\n};');
  }
);

// ============================================================
// STEP 4: WRITE FILE
// ============================================================
fs.writeFileSync(filePath, content, 'utf8');
console.log('Done! Verifying...');

// Quick verification
const newContent = fs.readFileSync(filePath, 'utf8');
const checks = [
  ['murk_crossing defined', newContent.includes('id:"murk_crossing"')],
  ['quake_foothills defined', newContent.includes('id:"quake_foothills"')],
  ['cobweb_gully defined', newContent.includes('id:"cobweb_gully"')],
  ['gale_ridge_east defined', newContent.includes('id:"gale_ridge_east"')],
  ['forge_approach defined', newContent.includes('id:"forge_approach"')],
  ['stone_plateau defined', newContent.includes('id:"stone_plateau"')],
  ['cosmic_cavern defined', newContent.includes('id:"cosmic_cavern"')],
  ['void_rift defined', newContent.includes('id:"void_rift"')],
  ['route10→murk_crossing connection', newContent.includes('connections:["bloomhaven","murk_crossing"]')],
  ['miasmacity←murk_crossing', newContent.includes('connections:["murk_crossing","route11"]')],
  ['route13 renamed West', newContent.includes('Gale Ridge West')],
  ['gale_ridge_east→gusthaven', newContent.includes('connections:["route13","gale_ridge_east"]')],
  ['starbloom has void_rift', newContent.includes('"void_rift"') && newContent.includes('"cosmic_cavern","victoryroad","void_rift"')],
  ['Acidovast 159 on route10', newContent.includes('{id:159, minLv:60, maxLv:65, rate:10}')],
  ['Tectonvast 97 on route11', newContent.includes('{id:97,  minLv:62, maxLv:67, rate:10}')],
  ['Aeridaleth 199 on route12', newContent.includes('{id:199, minLv:63, maxLv:68, rate:10}')],
  ['Adamovast 149 on route14', newContent.includes('{id:149, minLv:67, maxLv:72, rate:10}')],
  ['Frigolith 196 on route15', newContent.includes('{id:196, minLv:70, maxLv:75, rate:10}')],
  ['Celestarch 144 on route16', newContent.includes('{id:144, minLv:71, maxLv:76, rate:10}')],
  ['Voidraxis 211 in void_rift', newContent.includes('{id:211, minLv:75, maxLv:80, rate:5}')],
  ['Lumiarch 139 in starbloom', newContent.includes('{id:139, minLv:71, maxLv:76, rate:15}')],
  ['Celestarch 144 in starbloom', newContent.includes('{id:144, minLv:71, maxLv:76, rate:15}')],
];

let pass = 0, fail = 0;
for (const [name, result] of checks) {
  const mark = result ? '✓' : '✗';
  console.log(`  ${mark} ${name}`);
  result ? pass++ : fail++;
}
console.log(`\n${pass}/${pass+fail} checks passed${fail > 0 ? ' — FAILURES ABOVE' : ' — all good!'}`);
