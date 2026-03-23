#!/usr/bin/env node
// Add Lumos batch 4: IDs 251-265 (Rock/Water/Grass/Dark)
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');

const newLumos = `
  // ===== BATCH 4: ROCK / WATER / GRASS / DARK (IDs 251-265) =====

  // 2-stage Rock/Steel chain: Crumblite → Stonegrip (Metal Coat item)
  251: { id:251, name:"Crumblite", emoji:"🪨", types:["Rock","Steel"],
    base:{hp:60,atk:75,def:85,spa:42,spd:60,spe:45},
    learnset:[[1,"rock_throw"],[1,"metal_claw"],[14,"rock_slide"],[24,"flash_cannon"],[34,"stone_edge"],[44,"iron_tail"],[54,"forge_strike"],[60,"hyper_beam"]],
    evolveTo:252, evolveLevel:null, evolveItem:"metalCoat", evolveMethod:"item", catchRate:140, expYield:98, rarity:"common",
    desc:"A ore-encrusted creature that upgrades itself by absorbing metallic minerals from cave walls." },

  252: { id:252, name:"Stonegrip", emoji:"🛡️", types:["Rock","Steel"],
    base:{hp:95,atk:110,def:135,spa:58,spd:88,spe:52},
    learnset:[[1,"stone_edge"],[1,"flash_cannon"],[28,"iron_tail"],[36,"forge_strike"],[44,"earthquake"],[52,"bedrock_slam"],[60,"heavy_slam"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:235, rarity:"rare",
    desc:"An iron-clad rock titan. Its exterior is half-rock, half-steel, forming impenetrable natural armor." },

  // Standalone Rock/Fire: Ashrock (location evo near volcano area)
  253: { id:253, name:"Ashrock", emoji:"🌋", types:["Rock","Fire"],
    base:{hp:90,atk:105,def:100,spa:88,spd:75,spe:55},
    learnset:[[1,"rock_throw"],[1,"ember"],[18,"rock_slide"],[28,"flamethrower"],[38,"stone_edge"],[48,"magma_rock"],[58,"fire_blast"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"forge_ruins", evolveMethod:"location", catchRate:55, expYield:215, rarity:"uncommon",
    desc:"Volcanic rock infused with fire. Found only near ancient forge sites where magma once flowed freely." },

  // 2-stage Water/Psychic chain: Aquapuff → Wavrix (level 28)
  254: { id:254, name:"Aquapuff", emoji:"🫧", types:["Water","Psychic"],
    base:{hp:50,atk:45,def:48,spa:72,spd:62,spe:68},
    learnset:[[1,"water_gun"],[1,"confusion"],[10,"bubble_beam"],[20,"psybeam"],[30,"surf"],[40,"psychic_move"],[50,"hydro_pump"],[60,"hyper_beam"]],
    evolveTo:255, evolveLevel:28, catchRate:165, expYield:76, rarity:"common",
    desc:"A bubble of water with psychic intelligence. Floats using mental energy as much as buoyancy." },

  255: { id:255, name:"Wavrix", emoji:"🌊", types:["Water","Psychic"],
    base:{hp:82,atk:70,def:78,spa:120,spd:102,spe:92},
    learnset:[[1,"surf"],[1,"psychic_move"],[22,"hydro_pump"],[30,"psystrike"],[38,"aqua_tail"],[46,"neural_storm"],[54,"geyser_burst"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A psychic wave entity. Predicts tides and currents with perfect accuracy millennia in advance." },

  // 3-stage Water/Ice chain: Tideling → Coralhorn → Torrentox
  256: { id:256, name:"Tideling", emoji:"🦀", types:["Water","Ice"],
    base:{hp:48,atk:52,def:58,spa:65,spd:55,spe:52},
    learnset:[[1,"water_gun"],[1,"powder_snow"],[12,"bubble_beam"],[22,"ice_beam"],[32,"surf"],[42,"blizzard"],[52,"hydro_pump"],[60,"hyper_beam"]],
    evolveTo:257, evolveLevel:26, catchRate:170, expYield:74, rarity:"common",
    desc:"A crab-like creature with frozen shell. Moves between sea and frozen tundra with ease." },

  257: { id:257, name:"Coralhorn", emoji:"🦞", types:["Water","Ice"],
    base:{hp:72,atk:80,def:88,spa:90,spd:78,spe:65},
    learnset:[[1,"ice_beam"],[1,"surf"],[20,"blizzard"],[28,"aqua_tail"],[36,"cryo_lance"],[44,"hydro_pump"],[52,"icicle_crash"],[60,"hyper_beam"]],
    evolveTo:258, evolveLevel:44, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A horned sea creature made partly of frozen coral. Its horns channel water and ice attacks with precision." },

  258: { id:258, name:"Torrentox", emoji:"🐙", types:["Water","Ice"],
    base:{hp:100,atk:95,def:102,spa:130,spd:108,spe:70},
    learnset:[[1,"hydro_pump"],[1,"blizzard"],[30,"aqua_tail"],[38,"cryo_lance"],[46,"icicle_crash"],[54,"glacial_tomb"],[62,"geyser_burst"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:268, rarity:"rare",
    desc:"An ancient sea kraken of ice. Controls ocean currents and freezes sea lanes solid in winter." },

  // Standalone Water/Psychic: Lumejell
  259: { id:259, name:"Lumejell", emoji:"🪼", types:["Water","Psychic"],
    base:{hp:88,atk:65,def:80,spa:118,spd:105,spe:95},
    learnset:[[1,"water_gun"],[1,"psybeam"],[18,"surf"],[28,"psychic_move"],[38,"hydro_pump"],[48,"psystrike"],[58,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:215, rarity:"uncommon",
    desc:"A luminescent jellyfish with psychic tentacles. Its bioluminescence communicates complex thoughts." },

  // 2-stage Grass/Fairy chain: Sproutix → Leafhorn (level 26)
  260: { id:260, name:"Sproutix", emoji:"🌱", types:["Grass","Fairy"],
    base:{hp:48,atk:50,def:48,spa:72,spd:58,spe:65},
    learnset:[[1,"vine_whip"],[1,"fairy_wind"],[12,"razor_leaf"],[22,"moonblast"],[32,"energy_ball"],[42,"petal_blitz"],[52,"dazzling_gleam"],[60,"hyper_beam"]],
    evolveTo:261, evolveLevel:26, catchRate:175, expYield:72, rarity:"common",
    desc:"A fairy sprout that blooms with magical flowers. Its pollen causes drowsiness in those it trusts." },

  261: { id:261, name:"Leafhorn", emoji:"🌺", types:["Grass","Fairy"],
    base:{hp:82,atk:78,def:75,spa:115,spd:100,spe:88},
    learnset:[[1,"moonblast"],[1,"energy_ball"],[20,"petal_blitz"],[28,"dazzling_gleam"],[36,"grove_wrath"],[44,"celestial_wave"],[52,"briar_lash"],[60,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:218, rarity:"uncommon",
    desc:"A horned bloom fairy of tremendous grace. Its horn concentrates solar and lunar energy into beam attacks." },

  // 3-stage Grass/Poison chain: Seedling → Vinrix → Thornvast
  262: { id:262, name:"Seedling", emoji:"🌿", types:["Grass","Poison"],
    base:{hp:46,atk:52,def:45,spa:65,spd:55,spe:60},
    learnset:[[1,"vine_whip"],[1,"poison_sting"],[10,"razor_leaf"],[20,"sludge_bomb"],[30,"energy_ball"],[40,"toxic"],[50,"petal_blitz"],[60,"hyper_beam"]],
    evolveTo:263, evolveLevel:24, catchRate:180, expYield:68, rarity:"common",
    desc:"A seed creature wrapped in poisoned vines. It plants itself to absorb nutrients then walks away." },

  263: { id:263, name:"Vinrix", emoji:"🌵", types:["Grass","Poison"],
    base:{hp:70,atk:80,def:68,spa:98,spd:80,spe:72},
    learnset:[[1,"razor_leaf"],[1,"sludge_bomb"],[18,"energy_ball"],[28,"toxic"],[36,"petal_blitz"],[44,"venom_lance"],[52,"grove_wrath"],[60,"hyper_beam"]],
    evolveTo:264, evolveLevel:42, catchRate:90, expYield:145, rarity:"uncommon",
    desc:"A cactus warrior of venomous thorns. Its spines can inject toxins from up to three meters away." },

  264: { id:264, name:"Thornvast", emoji:"🌳", types:["Grass","Poison"],
    base:{hp:102,atk:108,def:92,spa:118,spd:100,spe:68},
    learnset:[[1,"petal_blitz"],[1,"venom_lance"],[30,"grove_wrath"],[38,"toxic"],[46,"energy_ball"],[54,"sludge_wave"],[62,"briar_lash"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:260, rarity:"rare",
    desc:"An enormous toxic thorn tree. Its roots poison groundwater for miles, making it a territorial nightmare." },

  // Standalone Grass/Bug: Mosswing
  265: { id:265, name:"Mosswing", emoji:"🦗", types:["Grass","Bug"],
    base:{hp:78,atk:82,def:70,spa:95,spd:88,spe:108},
    learnset:[[1,"bug_buzz"],[1,"vine_whip"],[18,"x_scissor"],[28,"energy_ball"],[38,"razor_leaf"],[48,"petal_blitz"],[58,"bug_buzz"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:210, rarity:"uncommon",
    desc:"A mossy grasshopper that blends perfectly into overgrown forest floors. Its wings buzz with plant pollen." },

`;

const marker = '  // ===== LEGENDARIES (IDs 314-321) =====';
if (!src.includes(marker)) {
  console.error('ERROR: Could not find insertion marker!');
  process.exit(1);
}
src = src.replace(marker, newLumos + '\n' + marker);
fs.writeFileSync(dataPath, src, 'utf8');

const ids = [251,252,253,254,255,256,257,258,259,260,261,262,263,264,265];
const lines = src.split('\n');
let ok = true;
for (const id of ids) {
  const found = lines.some(l => l.match(new RegExp(`^  ${id}: \\{ id:${id},`)));
  if (!found) { console.log(`MISSING ID ${id}`); ok = false; }
}
if (ok) console.log('All IDs 251-265 added successfully!');
