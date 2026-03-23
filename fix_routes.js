/**
 * fix_routes.js — comprehensive WORLD_DATA and encounter table fix:
 *  1. Move legendary Dragemian (174) to ID 213 (end of dex)
 *  2. Fix all encounter tables: game-wide evo ordering + max 2 per chain per area
 *  3. Add 4 new routes: toxic_bog, tremor_summit, gale_peak, forge_ruins
 *  4. Update connections for new areas
 *  5. Remove Voidraxis wild encounter from void_rift; make it a quest event
 *  6. Update q106 location to void_rift
 */
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'js', 'data.js');
let c = fs.readFileSync(filePath, 'utf8');

// ===========================================================
// STEP 1: MOVE DRAGEMIAN 174 → 213 (two-pass to avoid collisions)
// ===========================================================
function safeRename(content, oldId, newId) {
  const tmp = oldId + 5000;
  const patterns = [
    [`\n  ${oldId}: { id:${oldId},`, `\n  ${newId}: { id:${newId},`],
    [`{id:${oldId},`, `{id:${newId},`],
    [`monsterId:${oldId},`, `monsterId:${newId},`],
    [`monsterId: ${oldId},`, `monsterId: ${newId},`],
    [`evolveTo:${oldId},`, `evolveTo:${newId},`],
    [` ${oldId}: { id:${oldId}, `, ` ${newId}: { id:${newId}, `],
  ];
  // Pass 1: old → temp
  for (const [from, _] of patterns) {
    const tmpPat = from.replace(new RegExp(String(oldId), 'g'), String(tmp));
    content = content.split(from).join(tmpPat);
  }
  // Pass 2: temp → new
  for (const [from, to] of patterns) {
    const tmpFrom = from.replace(new RegExp(String(oldId), 'g'), String(tmp));
    content = content.split(tmpFrom).join(to);
  }
  return content;
}
c = safeRename(c, 174, 213);

// ===========================================================
// STEP 2: REWRITE ENCOUNTER TABLES for all routes between gyms 8-15
// Target state (verified against global evo ordering + max-2-per-chain):
// ===========================================================

function replaceWild(content, areaId, newWild) {
  // Match the wildMonsters block for this area and replace it
  const re = new RegExp(
    '(  ' + areaId + ': \\{[\\s\\S]*?wildMonsters:\\[)[\\s\\S]*?(\\],' +
    '\\s*\\n\\s*has(?:Gym|gym))',
    'm'
  );
  const m = content.match(re);
  if (!m) { console.error('MISS: ' + areaId); return content; }
  return content.replace(re, (full, pre, post) => pre + '\n' + newWild + '\n    ' + post.trim());
}

// ROUTE 10  (reqBadges:9)  — base poison types + one mid pair
c = replaceWild(c, 'route10', [
  '      {id:155, minLv:57, maxLv:62, rate:20},  // Toxirin (base)',
  '      {id:157, minLv:57, maxLv:62, rate:20},  // Acidelix (base)',
  '      {id:160, minLv:58, maxLv:63, rate:20},  // Miasoveth (base)',
  '      {id:161, minLv:59, maxLv:64, rate:15},  // Toxivane (mid → after base ✓)',
  '      {id:162, minLv:58, maxLv:63, rate:15},  // Marlix (base)',
  '      {id:163, minLv:59, maxLv:64, rate:10}   // Venomalis (mid → after base ✓)',
].join('\n'));

// MURK_CROSSING (reqBadges:9) — mid/final poison, introduce 164
c = replaceWild(c, 'murk_crossing', [
  '      {id:155, minLv:57, maxLv:62, rate:15},  // Toxirin (base)',
  '      {id:156, minLv:58, maxLv:63, rate:20},  // Venekon (mid → after base ✓)',
  '      {id:158, minLv:58, maxLv:63, rate:20},  // Toxoloth (mid, base Acidelix on route10 ✓)',
  '      {id:159, minLv:60, maxLv:65, rate:20},  // Acidovast (final → after 158 ✓)',
  '      {id:164, minLv:58, maxLv:63, rate:15},  // Venomite (base, new)',
  '      {id:165, minLv:59, maxLv:64, rate:10}   // Noxoveth (mid → after 164 ✓)',
].join('\n'));

// MIASMACITY (gym 9, reqBadges:9)
c = replaceWild(c, 'miasmacity', [
  '      {id:156, minLv:58, maxLv:63, rate:25},  // Venekon (mid)',
  '      {id:159, minLv:60, maxLv:65, rate:25},  // Acidovast (final, 158 on murk_crossing ✓)',
  '      {id:163, minLv:59, maxLv:64, rate:25},  // Venomalis (mid, 162 on route10 ✓)',
  '      {id:165, minLv:59, maxLv:64, rate:25}   // Noxoveth (mid, 164 on murk_crossing ✓)',
].join('\n'));

// ROUTE 11 (reqBadges:10) — ground bases, no 3rd-stage finals
c = replaceWild(c, 'route11', [
  '      {id:95,  minLv:59, maxLv:64, rate:20},  // Terrakin (base)',
  '      {id:98,  minLv:59, maxLv:64, rate:20},  // Aridix (base)',
  '      {id:101, minLv:59, maxLv:64, rate:20},  // Limoux (base)',
  '      {id:104, minLv:60, maxLv:65, rate:20},  // Arenikin (base)',
  '      {id:105, minLv:61, maxLv:66, rate:10},  // Dravanas (mid → after 104 ✓)',
  '      {id:106, minLv:60, maxLv:65, rate:10}   // Geodrak (base)'
].join('\n'));

// QUAKE_FOOTHILLS (reqBadges:10) — base+mid pairs, introduce 3 chains
c = replaceWild(c, 'quake_foothills', [
  '      {id:95,  minLv:59, maxLv:64, rate:15},  // Terrakin (base)',
  '      {id:96,  minLv:60, maxLv:65, rate:20},  // Seismith (mid → after 95 ✓)',
  '      {id:98,  minLv:59, maxLv:64, rate:15},  // Aridix (base)',
  '      {id:99,  minLv:60, maxLv:65, rate:20},  // Geovenoth (mid → after 98 ✓)',
  '      {id:101, minLv:59, maxLv:64, rate:15},  // Limoux (base)',
  '      {id:102, minLv:60, maxLv:65, rate:15}   // Geoloth (mid → after 101 ✓)'
].join('\n'));

// TERRAVAULT (gym 10, reqBadges:10) — all ground chain finals
c = replaceWild(c, 'terravault', [
  '      {id:97,  minLv:61, maxLv:66, rate:25},  // Tectonvast (final, 96 on quake_foothills ✓)',
  '      {id:100, minLv:61, maxLv:66, rate:25},  // Geovenomvast (final, 99 on quake_foothills ✓)',
  '      {id:103, minLv:61, maxLv:66, rate:25},  // Geovast (final, 102 on quake_foothills ✓)',
  '      {id:105, minLv:61, maxLv:66, rate:15},  // Dravanas (final, 104 on route11 ✓)',
  '      {id:107, minLv:62, maxLv:67, rate:10}   // Terraquon (final, 106 on route11 ✓)'
].join('\n'));

// ROUTE 12 (reqBadges:11) — bug bases + max 2 per chain (remove Aeridaleth)
c = replaceWild(c, 'route12', [
  '      {id:197, minLv:61, maxLv:66, rate:20},  // Vermelin (base)',
  '      {id:198, minLv:62, maxLv:67, rate:20},  // Chrysalix (mid → after 197 ✓)',
  '      {id:200, minLv:61, maxLv:66, rate:20},  // Colerix (base)',
  '      {id:202, minLv:62, maxLv:67, rate:20},  // Sericrix (base)',
  '      {id:204, minLv:63, maxLv:68, rate:20}   // Terramite (base)'
].join('\n'));

// COBWEB_GULLY (reqBadges:11) — mid/final bug, 197 already seen
c = replaceWild(c, 'cobweb_gully', [
  '      {id:198, minLv:62, maxLv:67, rate:15},  // Chrysalix (mid, 197 on route12 ✓)',
  '      {id:199, minLv:63, maxLv:68, rate:15},  // Aeridaleth (final → after 198 ✓)',
  '      {id:200, minLv:61, maxLv:66, rate:15},  // Colerix (base)',
  '      {id:201, minLv:62, maxLv:67, rate:20},  // Scarabion (mid → after 200 ✓)',
  '      {id:204, minLv:63, maxLv:68, rate:15},  // Terramite (base)',
  '      {id:205, minLv:64, maxLv:69, rate:20}   // Geodrix (mid → after 204 ✓)'
].join('\n'));

// SILKWOOD (gym 11) — finals only, all bases seen on earlier routes ✓
c = replaceWild(c, 'silkwood', [
  '      {id:199, minLv:63, maxLv:68, rate:25},  // Aeridaleth (final)',
  '      {id:201, minLv:62, maxLv:67, rate:25},  // Scarabion (mid)',
  '      {id:203, minLv:63, maxLv:68, rate:25},  // Arachnalis (mid, 202 on route12 ✓)',
  '      {id:205, minLv:64, maxLv:69, rate:25}   // Geodrix (mid)'
].join('\n'));

// ROUTE 13 (reqBadges:12) — wind bases + one mid pair
c = replaceWild(c, 'route13', [
  '      {id:108, minLv:63, maxLv:68, rate:20},  // Zephyrkin (base)',
  '      {id:109, minLv:64, maxLv:69, rate:20},  // Aeolomane (mid → after 108 ✓)',
  '      {id:111, minLv:63, maxLv:68, rate:20},  // Aeolin (base)',
  '      {id:114, minLv:64, maxLv:69, rate:15},  // Nimbusel (base)',
  '      {id:116, minLv:64, maxLv:69, rate:15},  // Zephyrin (base)',
  '      {id:61,  minLv:65, maxLv:70, rate:10}   // wind-type standalone'
].join('\n'));

// GALE_RIDGE_EAST (reqBadges:12) — mid+final wind pairs
c = replaceWild(c, 'gale_ridge_east', [
  '      {id:109, minLv:64, maxLv:69, rate:15},  // Aeolomane (mid, 108 on route13 ✓)',
  '      {id:110, minLv:65, maxLv:70, rate:20},  // Aeolarch (final → after 109 ✓)',
  '      {id:112, minLv:64, maxLv:69, rate:15},  // Cyclavel (mid, 111 on route13 ✓)',
  '      {id:113, minLv:65, maxLv:70, rate:20},  // Cyclavorn (final → after 112 ✓)',
  '      {id:115, minLv:65, maxLv:70, rate:15},  // Aetherworn (mid, 114 on route13 ✓)',
  '      {id:117, minLv:65, maxLv:70, rate:15}   // Pneumathos (mid, 116 on route13 ✓)'
].join('\n'));

// GUSTHAVEN (gym 12) — wind finals
c = replaceWild(c, 'gusthaven', [
  '      {id:110, minLv:65, maxLv:70, rate:25},  // Aeolarch (final)',
  '      {id:113, minLv:65, maxLv:70, rate:25},  // Cyclavorn (final)',
  '      {id:115, minLv:65, maxLv:70, rate:20},  // Aetherworn (mid)',
  '      {id:117, minLv:65, maxLv:70, rate:20},  // Pneumathos (mid)',
  '      {id:62,  minLv:66, maxLv:70, rate:10}   // standalone'
].join('\n'));

// ROUTE 14 (reqBadges:13) — steel bases + one mid pair
c = replaceWild(c, 'route14', [
  '      {id:147, minLv:65, maxLv:70, rate:20},  // Ferrokin (base)',
  '      {id:148, minLv:66, maxLv:71, rate:20},  // Adamavast (mid → after 147 ✓)',
  '      {id:150, minLv:65, maxLv:70, rate:20},  // Gearon (base)',
  '      {id:134, minLv:66, maxLv:71, rate:20},  // Aeronyx (base)',
  '      {id:153, minLv:66, maxLv:71, rate:10},  // Forgekin (base)',
  '      {id:55,  minLv:67, maxLv:72, rate:10}   // standalone steel'
].join('\n'));

// FORGE_APPROACH (reqBadges:13) — steel mid pairs
c = replaceWild(c, 'forge_approach', [
  '      {id:148, minLv:66, maxLv:71, rate:20},  // Adamavast (mid)',
  '      {id:149, minLv:67, maxLv:72, rate:15},  // Adamovast (final → after 148 ✓)',
  '      {id:150, minLv:65, maxLv:70, rate:15},  // Gearon (base)',
  '      {id:151, minLv:66, maxLv:71, rate:20},  // Ferrotron (mid → after 150 ✓)',
  '      {id:153, minLv:66, maxLv:71, rate:15},  // Forgekin (base)',
  '      {id:154, minLv:67, maxLv:72, rate:15}   // Ferrolith (mid → after 153 ✓)'
].join('\n'));

// IRONFORGE (gym 13) — steel finals
c = replaceWild(c, 'ironforge', [
  '      {id:149, minLv:67, maxLv:72, rate:25},  // Adamovast (final)',
  '      {id:151, minLv:66, maxLv:71, rate:20},  // Ferrotron (mid)',
  '      {id:152, minLv:67, maxLv:72, rate:20},  // Imperion (Steel/Rock)',
  '      {id:135, minLv:67, maxLv:72, rate:20},  // Ferrovex (mid, 134 on route14 ✓)',
  '      {id:136, minLv:68, maxLv:73, rate:15}   // Ferrovast (final → after 135 ✓)'
].join('\n'));

// ROUTE 15 (reqBadges:14) — rock bases + one mid pair
c = replaceWild(c, 'route15', [
  '      {id:191, minLv:67, maxLv:72, rate:20},  // Petrikin (base)',
  '      {id:192, minLv:68, maxLv:73, rate:20},  // Lithavast (mid → after 191 ✓)',
  '      {id:193, minLv:67, maxLv:72, rate:20},  // Rugothon (base)',
  '      {id:132, minLv:68, maxLv:73, rate:20},  // Obsidrix (base)',
  '      {id:133, minLv:69, maxLv:74, rate:10},  // Monolithox (mid → after 132 ✓)',
  '      {id:93,  minLv:69, maxLv:74, rate:10}   // standalone rock'
].join('\n'));

// STONE_PLATEAU (reqBadges:14) — rock mid+final, introduce 195/196
c = replaceWild(c, 'stone_plateau', [
  '      {id:192, minLv:68, maxLv:73, rate:20},  // Lithavast (mid, 191 on route15 ✓)',
  '      {id:193, minLv:67, maxLv:72, rate:15},  // Rugothon (base)',
  '      {id:194, minLv:68, maxLv:73, rate:20},  // Lithomere (mid → after 193 ✓)',
  '      {id:133, minLv:69, maxLv:74, rate:20},  // Monolithox (mid)',
  '      {id:195, minLv:69, maxLv:74, rate:15},  // Prismolith (base, new)',
  '      {id:196, minLv:70, maxLv:75, rate:10}   // Frigolith (mid → after 195 ✓)'
].join('\n'));

// QUARRYVILLE (gym 14)
c = replaceWild(c, 'quarryville', [
  '      {id:192, minLv:68, maxLv:73, rate:20},  // Lithavast (mid)',
  '      {id:195, minLv:69, maxLv:74, rate:20},  // Prismolith (195 on stone_plateau ✓)',
  '      {id:196, minLv:70, maxLv:75, rate:20},  // Frigolith (mid → after 195 ✓)',
  '      {id:133, minLv:69, maxLv:74, rate:25},  // Monolithox (mid)',
  '      {id:92,  minLv:70, maxLv:74, rate:15}   // standalone'
].join('\n'));

// ROUTE 16 (reqBadges:15) — fairy bases, introduce 142
c = replaceWild(c, 'route16', [
  '      {id:137, minLv:69, maxLv:74, rate:20},  // Lumkin (base)',
  '      {id:72,  minLv:69, maxLv:74, rate:20},  // fairy-type (base)',
  '      {id:73,  minLv:70, maxLv:75, rate:20},  // fairy-type (evo → after 72 ✓)',
  '      {id:142, minLv:69, maxLv:74, rate:20},  // Dawnirel (base, new)',
  '      {id:145, minLv:70, maxLv:75, rate:20}   // Faerrin (base)'
].join('\n'));

// COSMIC_CAVERN (reqBadges:15) — fairy mid/final, max 2 per chain
c = replaceWild(c, 'cosmic_cavern', [
  '      {id:137, minLv:69, maxLv:74, rate:15},  // Lumkin (base)',
  '      {id:138, minLv:70, maxLv:75, rate:20},  // Aetherael (mid → after 137 ✓)',
  '      {id:143, minLv:70, maxLv:75, rate:15},  // Lunarael (mid, 142 on route16 ✓)',
  '      {id:144, minLv:71, maxLv:76, rate:20},  // Celestarch (final → after 143 ✓)',
  '      {id:145, minLv:70, maxLv:75, rate:15},  // Faerrin (base)',
  '      {id:119, minLv:70, maxLv:74, rate:15}   // Nighthound (Dark/Umbra)'
].join('\n'));

// STARBLOOM (gym 15) — fairy finals
c = replaceWild(c, 'starbloom', [
  '      {id:138, minLv:70, maxLv:75, rate:20},  // Aetherael (mid)',
  '      {id:139, minLv:71, maxLv:76, rate:15},  // Lumiarch (final → after 138 ✓)',
  '      {id:143, minLv:70, maxLv:75, rate:20},  // Lunarael (mid)',
  '      {id:144, minLv:71, maxLv:76, rate:15},  // Celestarch (final → after 143 ✓)',
  '      {id:146, minLv:71, maxLv:76, rate:20},  // Shinarith (mid, 145 on route16 ✓)',
  '      {id:203, minLv:72, maxLv:76, rate:10}   // Arachnalis (mid)'
].join('\n'));

// VOID_RIFT — remove Voidraxis wild encounter (it becomes a quest event)
c = replaceWild(c, 'void_rift', [
  '      {id:119, minLv:72, maxLv:77, rate:30},  // Nighthound (Dark)',
  '      {id:122, minLv:72, maxLv:77, rate:30},  // Spectrewing (Dark)',
  '      {id:120, minLv:73, maxLv:78, rate:25},  // dark-type',
  '      {id:131, minLv:73, maxLv:78, rate:15}   // Necrothon (Dark/Grass)'
].join('\n'));

// ===========================================================
// STEP 3: UPDATE q106 LOCATION to void_rift
// ===========================================================
c = c.split('location:"dark_canyon", type:"boss", requiredBadges:14,\n    boss:{monsterId:211,')
     .join('location:"void_rift", type:"boss", requiredBadges:15,\n    boss:{monsterId:211,');

// ===========================================================
// STEP 4: ADD 4 NEW AREAS before the closing }; of WORLD_DATA
// ===========================================================

const NEW_AREAS_2 = `
  // ---- ADDITIONAL MID-GYM ROUTES (phase 2) ----
  toxic_bog: {
    id:"toxic_bog", name:"Toxic Bog", icon:"🐸", type:"route",
    desc:"A stagnant bog where the path turns south toward Miasma City. Foul gas bubbles up through the mud and Poison types lurk beneath the surface.",
    connections:["murk_crossing","miasmacity"],
    wildMonsters:[
      {id:156, minLv:58, maxLv:63, rate:20},  // Venekon (mid)
      {id:158, minLv:58, maxLv:63, rate:20},  // Toxoloth (mid)
      {id:159, minLv:60, maxLv:65, rate:20},  // Acidovast (final)
      {id:164, minLv:58, maxLv:63, rate:20},  // Venomite (base)
      {id:165, minLv:59, maxLv:64, rate:20}   // Noxoveth (mid → after 164 ✓)
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:42, y:63}
  },
  tremor_summit: {
    id:"tremor_summit", name:"Tremor Summit", icon:"⛰️", type:"route",
    desc:"The crest of the quake-ridden foothills where the shaking is strongest. Only final-stage Ground-type Lumos can hold their footing here.",
    connections:["quake_foothills","terravault"],
    wildMonsters:[
      {id:97,  minLv:62, maxLv:67, rate:25},  // Tectonvast (final, 96 on quake_foothills ✓)
      {id:100, minLv:62, maxLv:67, rate:25},  // Geovenomvast (final, 99 on quake_foothills ✓)
      {id:103, minLv:62, maxLv:67, rate:25},  // Geovast (final, 102 on quake_foothills ✓)
      {id:105, minLv:63, maxLv:68, rate:15},  // Dravanas (final, 104 on route11 ✓)
      {id:107, minLv:63, maxLv:68, rate:10}   // Terraquon (final, 106 on route11 ✓)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:28, y:75}
  },
  gale_peak: {
    id:"gale_peak", name:"Gale Peak", icon:"🌀", type:"route",
    desc:"The westernmost tip of the region — where Gale Ridge reaches its farthest point before turning sharply east. The wind here changes direction mid-step.",
    connections:["route13","gale_ridge_east"],
    wildMonsters:[
      {id:108, minLv:63, maxLv:68, rate:15},  // Zephyrkin (base)
      {id:109, minLv:64, maxLv:69, rate:20},  // Aeolomane (mid → after 108 ✓)
      {id:111, minLv:63, maxLv:68, rate:15},  // Aeolin (base)
      {id:112, minLv:64, maxLv:69, rate:20},  // Cyclavel (mid → after 111 ✓)
      {id:116, minLv:64, maxLv:69, rate:15},  // Zephyrin (base)
      {id:117, minLv:65, maxLv:70, rate:15}   // Pneumathos (mid → after 116 ✓)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:7, y:96}
  },
  forge_ruins: {
    id:"forge_ruins", name:"Forge Ruins", icon:"🏚️", type:"route",
    desc:"Collapsed factory halls stretching east from the old Ironwork Path. Steel-type Lumos nest in the rusted machinery, and mid-stage chains are common sightings.",
    connections:["route14","forge_approach"],
    wildMonsters:[
      {id:147, minLv:65, maxLv:70, rate:15},  // Ferrokin (base)
      {id:148, minLv:66, maxLv:71, rate:20},  // Adamavast (mid → after 147 ✓)
      {id:150, minLv:65, maxLv:70, rate:15},  // Gearon (base)
      {id:151, minLv:66, maxLv:71, rate:20},  // Ferrotron (mid → after 150 ✓)
      {id:134, minLv:66, maxLv:71, rate:15},  // Aeronyx (base)
      {id:135, minLv:67, maxLv:72, rate:15}   // Ferrovex (mid → after 134 ✓)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:33, y:92}
  }`;

// Insert before final closing `};` of WORLD_DATA (after void_rift)
c = c.replace(
  /(hasGym:false, requiredBadges:15, mapPos:\{x:75, y:72\}\s*\}\s*\n\};)/,
  (m) => m.replace('\n};', NEW_AREAS_2 + '\n};')
);

// ===========================================================
// STEP 5: UPDATE CONNECTIONS for new areas
// ===========================================================

// murk_crossing → toxic_bog (remove direct murk→miasmacity)
c = c.split('connections:["route10","miasmacity"]').join('connections:["route10","murk_crossing"]'); // already done but safety
// murk_crossing needs to connect to toxic_bog not miasmacity
c = c.replace(
  /id:"murk_crossing"[^}]+?connections:\["route10","miasmacity"\]/,
  (m) => m.replace('"route10","miasmacity"', '"route10","toxic_bog"')
);
// miasmacity now connects from toxic_bog
c = c.replace(
  /id:"miasmacity"[^}]+?connections:\["murk_crossing","route11"\]/,
  (m) => m.replace('"murk_crossing","route11"', '"toxic_bog","route11"')
);

// quake_foothills → tremor_summit (remove direct quake→terravault)
c = c.replace(
  /id:"quake_foothills"[^}]+?connections:\["route11","terravault"\]/,
  (m) => m.replace('"route11","terravault"', '"route11","tremor_summit"')
);
// terravault connects from tremor_summit
c = c.replace(
  /id:"terravault"[^}]+?connections:\["quake_foothills","route12"\]/,
  (m) => m.replace('"quake_foothills","route12"', '"tremor_summit","route12"')
);

// route13 → gale_peak (remove direct route13→gale_ridge_east)
c = c.replace(
  /id:"route13"[^}]+?connections:\["silkwood","gale_ridge_east"\]/,
  (m) => m.replace('"silkwood","gale_ridge_east"', '"silkwood","gale_peak"')
);
// gale_ridge_east connects from gale_peak
c = c.replace(
  /id:"gale_ridge_east"[^}]+?connections:\["route13","gusthaven"\]/,
  (m) => m.replace('"route13","gusthaven"', '"gale_peak","gusthaven"')
);

// route14 → forge_ruins (remove direct route14→forge_approach)
c = c.replace(
  /id:"route14"[^}]+?connections:\["gusthaven","forge_approach"\]/,
  (m) => m.replace('"gusthaven","forge_approach"', '"gusthaven","forge_ruins"')
);
// forge_approach connects from forge_ruins
c = c.replace(
  /id:"forge_approach"[^}]+?connections:\["route14","ironforge"\]/,
  (m) => m.replace('"route14","ironforge"', '"forge_ruins","ironforge"')
);

// ===========================================================
// STEP 6: WRITE AND VERIFY
// ===========================================================
fs.writeFileSync(filePath, c, 'utf8');
console.log('Written. Verifying...');

const v = fs.readFileSync(filePath, 'utf8');
const checks = [
  // Dragemian renamed
  ['Dragemian is ID 213', v.includes('213: { id:213, name:"Dragemian"')],
  ['No Dragemian at 174', !v.includes('174: { id:174,')],
  // New areas exist
  ['toxic_bog defined', v.includes('id:"toxic_bog"')],
  ['tremor_summit defined', v.includes('id:"tremor_summit"')],
  ['gale_peak defined', v.includes('id:"gale_peak"')],
  ['forge_ruins defined', v.includes('id:"forge_ruins"')],
  // Connection chain
  ['murk→toxic_bog', v.includes('"route10","toxic_bog"')],
  ['toxic_bog→miasmacity', v.includes('"toxic_bog","route11"')],
  ['quake→tremor_summit', v.includes('"route11","tremor_summit"')],
  ['tremor→terravault', v.includes('"tremor_summit","route12"')],
  ['route13→gale_peak', v.includes('"silkwood","gale_peak"')],
  ['gale_peak→gale_ridge_east', v.includes('"gale_peak","gusthaven"')],
  ['route14→forge_ruins', v.includes('"gusthaven","forge_ruins"')],
  ['forge_ruins→forge_approach', v.includes('"forge_ruins","ironforge"')],
  // Voidraxis not in wildMonsters of void_rift
  ['Voidraxis NOT wild in void_rift', !v.includes('{id:211, minLv:75')],
  // q106 points to void_rift
  ['q106 location=void_rift', v.includes('location:"void_rift"')],
  // Key evo ordering checks (base before evo in game progression)
  ['162 before 163 on route10', v.indexOf('"route10"') < v.indexOf('{id:163,') &&
      v.indexOf('{id:162,') < v.indexOf('{id:163,')],
  ['Voidraxis still in quest q106', v.includes('monsterId:211')],
];

let pass=0, fail=0;
for (const [name, ok] of checks) {
  console.log((ok?'✓':'✗')+' '+name);
  ok?pass++:fail++;
}
console.log(`\n${pass}/${pass+fail} checks passed${fail?' — FAILURES ABOVE':' — all good!'}`);
