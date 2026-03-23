#!/usr/bin/env node
// Add Lumos batch 5: IDs 266-280 (Dark/Fire/Steel/Normal)
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');

const newLumos = `
  // ===== BATCH 5: DARK / FIRE / STEEL / NORMAL (IDs 266-280) =====

  // 3-stage Dark chain: Shadowpup → Nightclaw → Darkfang
  266: { id:266, name:"Shadowpup", emoji:"🐺", types:["Dark"],
    base:{hp:48,atk:62,def:45,spa:50,spd:48,spe:72},
    learnset:[[1,"bite"],[1,"tackle"],[10,"night_slash"],[20,"dark_pulse"],[30,"crunch"],[40,"eclipse_shroud"],[50,"soul_rend"],[60,"hyper_beam"]],
    evolveTo:267, evolveLevel:26, catchRate:180, expYield:70, rarity:"common",
    desc:"A shadow wolf pup that feeds on ambient light. Eyes glow in pitch darkness where nothing should glow." },

  267: { id:267, name:"Nightclaw", emoji:"🐾", types:["Dark","Ghost"],
    base:{hp:72,atk:95,def:65,spa:75,spd:68,spe:90},
    learnset:[[1,"night_slash"],[1,"phantom_claw"],[20,"dark_pulse"],[28,"eclipse_shroud"],[36,"crunch"],[44,"soul_rend"],[52,"shadow_ball"],[60,"hyper_beam"]],
    evolveTo:268, evolveLevel:44, catchRate:85, expYield:150, rarity:"uncommon",
    desc:"A ghost-dark wolf that phases through shadows. Its claws can strike from a different dimension." },

  268: { id:268, name:"Darkfang", emoji:"🐕", types:["Dark","Ghost"],
    base:{hp:98,atk:130,def:88,spa:95,spd:88,spe:108},
    learnset:[[1,"eclipse_shroud"],[1,"soul_rend"],[30,"dark_pulse"],[38,"shadow_ball"],[46,"night_slash"],[54,"phantom_claw"],[62,"dread_howl"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:268, rarity:"rare",
    desc:"The apex shadow predator. Its howl resonates across dimensions and can be heard in the land of the dead." },

  // 2-stage Dark split: Grimshade → Eclipsoon (Moon Stone item)
  269: { id:269, name:"Grimshade", emoji:"🦇", types:["Dark"],
    base:{hp:55,atk:65,def:52,spa:78,spd:65,spe:82},
    learnset:[[1,"bite"],[1,"dark_pulse"],[14,"night_slash"],[24,"eclipse_shroud"],[34,"crunch"],[44,"soul_rend"],[54,"dread_howl"],[60,"hyper_beam"]],
    evolveTo:270, evolveLevel:null, evolveItem:"moonStone", evolveMethod:"item", catchRate:130, expYield:102, rarity:"common",
    desc:"A twilight bat that thrives between day and night. Its fur absorbs moonlight and stores it as dark energy." },

  270: { id:270, name:"Eclipsoon", emoji:"🌑", types:["Dark","Fairy"],
    base:{hp:88,atk:92,def:80,spa:120,spd:105,spe:95},
    learnset:[[1,"dark_pulse"],[1,"moonblast"],[28,"eclipse_shroud"],[36,"soul_rend"],[44,"dread_howl"],[52,"fae_requiem"],[60,"shadow_ball"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:38, expYield:228, rarity:"rare",
    desc:"The eclipse bat, born when moon stone energy meets absolute darkness. Its wings block out the stars." },

  // Standalone Dark/Normal: Duskrat
  271: { id:271, name:"Duskrat", emoji:"🐀", types:["Dark","Normal"],
    base:{hp:95,atk:100,def:82,spa:68,spd:75,spe:105},
    learnset:[[1,"bite"],[1,"tackle"],[18,"night_slash"],[28,"dark_pulse"],[38,"body_slam"],[48,"crunch"],[58,"eclipse_shroud"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:205, rarity:"uncommon",
    desc:"A cunning dark rodent that steals anything shiny. Surprisingly tough for its size and always escapes." },

  // 2-stage Fire/Dragon chain: Embrix → Blazeon (level 28)
  272: { id:272, name:"Embrix", emoji:"🦎", types:["Fire","Dragon"],
    base:{hp:50,atk:68,def:52,spa:65,spd:50,spe:72},
    learnset:[[1,"ember"],[1,"dragon_breath"],[12,"flamethrower"],[22,"dragon_claw"],[32,"fire_blast"],[42,"dragon_pulse"],[52,"outrage"],[62,"hyper_beam"]],
    evolveTo:273, evolveLevel:34, catchRate:155, expYield:82, rarity:"common",
    desc:"A fire lizard with nascent draconic power. Breathes embers in spiraling dragon-shaped patterns." },

  273: { id:273, name:"Blazeon", emoji:"🔥", types:["Fire","Dragon"],
    base:{hp:88,atk:112,def:78,spa:115,spd:80,spe:92},
    learnset:[[1,"flamethrower"],[1,"dragon_claw"],[26,"fire_blast"],[34,"dragon_pulse"],[42,"outrage"],[50,"dragon_dance"],[58,"caldera_meltdown"],[66,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:228, rarity:"uncommon",
    desc:"A fire dragon of pure scorching flame. Dances in lava rivers to power up its abilities further." },

  // 3-stage Fire/Rock chain: Cindling → Infernox → Pyrovast
  274: { id:274, name:"Cindling", emoji:"🪨", types:["Fire","Rock"],
    base:{hp:46,atk:60,def:65,spa:55,spd:50,spe:52},
    learnset:[[1,"ember"],[1,"rock_throw"],[10,"rock_slide"],[20,"flamethrower"],[30,"stone_edge"],[40,"fire_blast"],[50,"magma_rock"],[60,"hyper_beam"]],
    evolveTo:275, evolveLevel:28, catchRate:170, expYield:74, rarity:"common",
    desc:"A coal-like creature that ignites when rolling downhill. Leaves scorch marks on stone paths." },

  275: { id:275, name:"Infernox", emoji:"🌋", types:["Fire","Rock"],
    base:{hp:72,atk:92,def:95,spa:82,spd:68,spe:62},
    learnset:[[1,"flamethrower"],[1,"stone_edge"],[22,"fire_blast"],[30,"magma_rock"],[38,"rock_slide"],[46,"earthquake"],[54,"caldera_meltdown"],[62,"hyper_beam"]],
    evolveTo:276, evolveLevel:46, catchRate:75, expYield:158, rarity:"uncommon",
    desc:"A volcanic rock beast that erupts periodically. Carries magma inside its carapace like a pressure cooker." },

  276: { id:276, name:"Pyrovast", emoji:"🏔️", types:["Fire","Rock"],
    base:{hp:110,atk:128,def:118,spa:98,spd:85,spe:58},
    learnset:[[1,"fire_blast"],[1,"magma_rock"],[32,"caldera_meltdown"],[40,"earthquake"],[48,"stone_edge"],[56,"bedrock_slam"],[64,"ashfall"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:18, expYield:272, rarity:"rare",
    desc:"A living volcano of immense destructive power. When it battles, the sky fills with ash and the earth splits." },

  // Standalone Fire/Ground: Magmite (location evo near forge area)
  277: { id:277, name:"Magmite", emoji:"🌶️", types:["Fire","Ground"],
    base:{hp:92,atk:110,def:96,spa:98,spd:80,spe:62},
    learnset:[[1,"ember"],[1,"mud_shot"],[18,"flamethrower"],[28,"earth_power"],[38,"fire_blast"],[48,"earthquake"],[58,"magma_surge"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"ironforge", evolveMethod:"location", catchRate:50, expYield:215, rarity:"uncommon",
    desc:"Found only in volcanic forge areas where earth meets fire. Its body is half-molten rock, half-flame." },

  // 2-stage Steel/Fairy chain: Ironling → Steelhorn (Metal Coat item)
  278: { id:278, name:"Ironling", emoji:"⚙️", types:["Steel","Fairy"],
    base:{hp:52,atk:65,def:78,spa:60,spd:58,spe:55},
    learnset:[[1,"metal_claw"],[1,"fairy_wind"],[14,"flash_cannon"],[24,"moonblast"],[34,"iron_tail"],[44,"dazzling_gleam"],[54,"forge_strike"],[60,"hyper_beam"]],
    evolveTo:279, evolveLevel:null, evolveItem:"metalCoat", evolveMethod:"item", catchRate:145, expYield:92, rarity:"common",
    desc:"A small fairy forged of living iron. Works tirelessly in ancient forges, seeking purpose and strength." },

  279: { id:279, name:"Steelhorn", emoji:"🦌", types:["Steel","Fairy"],
    base:{hp:88,atk:98,def:115,spa:85,spd:98,spe:72},
    learnset:[[1,"flash_cannon"],[1,"moonblast"],[28,"iron_tail"],[36,"dazzling_gleam"],[44,"forge_strike"],[52,"heavy_slam"],[60,"celestial_wave"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:38, expYield:228, rarity:"rare",
    desc:"A horned steel fairy of regal bearing. Its horn channels both fairy magic and forged steel energy." },

  // 3-stage Steel/Ground chain: Gearbit → Cogvex → Mechavast
  280: { id:280, name:"Gearbit", emoji:"🔩", types:["Steel","Ground"],
    base:{hp:50,atk:62,def:72,spa:40,spd:52,spe:48},
    learnset:[[1,"metal_claw"],[1,"mud_shot"],[12,"flash_cannon"],[22,"earth_power"],[32,"iron_tail"],[42,"earthquake"],[52,"forge_strike"],[60,"hyper_beam"]],
    evolveTo:281, evolveLevel:28, catchRate:165, expYield:76, rarity:"common",
    desc:"A mechanical gear creature that burrows through ore deposits. Powered by geothermal energy." },

`;

const marker = '  // ===== LEGENDARIES (IDs 314-321) =====';
if (!src.includes(marker)) {
  console.error('ERROR: Could not find insertion marker!');
  process.exit(1);
}
src = src.replace(marker, newLumos + '\n' + marker);
fs.writeFileSync(dataPath, src, 'utf8');

const ids = [266,267,268,269,270,271,272,273,274,275,276,277,278,279,280];
const lines = src.split('\n');
let ok = true;
for (const id of ids) {
  const found = lines.some(l => l.match(new RegExp(`^  ${id}: \\{ id:${id},`)));
  if (!found) { console.log(`MISSING ID ${id}`); ok = false; }
}
if (ok) console.log('All IDs 266-280 added successfully!');
