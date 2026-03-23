#!/usr/bin/env node
// Add Lumos batch 1: IDs 206-220 (Fighting + Ghost types)
// Insert before "// ===== LEGENDARIES (IDs 314-321) =====" section
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');

const newLumos = `
  // ===== BATCH 1: FIGHTING TYPES (IDs 206-214) =====

  // 3-stage Fighting chain: Cuffkin → Knuxavore → Titanfist
  206: { id:206, name:"Cuffkin", emoji:"🥊", types:["Fighting"],
    base:{hp:50,atk:65,def:45,spa:30,spd:40,spe:58},
    learnset:[[1,"tackle"],[1,"headbutt"],[10,"body_slam"],[18,"iron_press"],[28,"reckless_charge"],[38,"battle_cry"],[48,"heavy_slam"],[58,"ignition_kick"]],
    evolveTo:207, evolveLevel:26, catchRate:180, expYield:72, rarity:"common",
    desc:"A scrappy little brawler that wraps its tiny fists in leaf fibers. Never backs down from a fight." },

  207: { id:207, name:"Knuxavore", emoji:"🤜", types:["Fighting"],
    base:{hp:75,atk:95,def:68,spa:50,spd:60,spe:75},
    learnset:[[1,"headbutt"],[1,"body_slam"],[20,"iron_press"],[28,"reckless_charge"],[36,"battle_cry"],[44,"heavy_slam"],[52,"ignition_kick"],[60,"hyper_beam"]],
    evolveTo:208, evolveLevel:48, catchRate:90, expYield:145, rarity:"uncommon",
    desc:"A powerful brawler whose fists are hardened to stone-like density. Its punches shatter solid rock." },

  208: { id:208, name:"Titanfist", emoji:"💪", types:["Fighting","Rock"],
    base:{hp:100,atk:140,def:95,spa:60,spd:85,spe:65},
    learnset:[[1,"heavy_slam"],[1,"battle_cry"],[30,"reckless_charge"],[38,"iron_press"],[46,"earthquake"],[54,"stone_edge"],[62,"ignition_kick"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:245, rarity:"rare",
    desc:"A titan whose body has become part mountain. Its fists leave craters when they strike the ground." },

  // 2-stage Fighting/Psychic chain: Grapplix → Combathorn
  209: { id:209, name:"Grapplix", emoji:"🦴", types:["Fighting","Psychic"],
    base:{hp:55,atk:72,def:52,spa:65,spd:55,spe:62},
    learnset:[[1,"tackle"],[1,"confusion"],[12,"body_slam"],[22,"iron_press"],[30,"psybeam"],[40,"reckless_charge"],[50,"psychic_move"],[60,"battle_cry"]],
    evolveTo:210, evolveLevel:32, catchRate:150, expYield:88, rarity:"common",
    desc:"A fighting type that channels psychic power into its strikes. Studies opponents before attacking." },

  210: { id:210, name:"Combathorn", emoji:"🦏", types:["Fighting","Psychic"],
    base:{hp:85,atk:112,def:75,spa:95,spd:78,spe:70},
    learnset:[[1,"headbutt"],[1,"psybeam"],[26,"iron_press"],[34,"reckless_charge"],[42,"psychic_move"],[50,"heavy_slam"],[58,"battle_cry"],[66,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:215, rarity:"uncommon",
    desc:"A warrior blessed with psychic sight. Reads its foe's next move before it is made." },

  // 3-stage Fighting/Dark chain: Punchling → Brawlvex → Grapplethon
  211: { id:211, name:"Punchling", emoji:"👊", types:["Fighting","Dark"],
    base:{hp:48,atk:68,def:42,spa:35,spd:38,spe:70},
    learnset:[[1,"tackle"],[1,"bite"],[10,"headbutt"],[20,"night_slash"],[28,"body_slam"],[38,"dark_pulse"],[46,"reckless_charge"],[54,"heavy_slam"]],
    evolveTo:212, evolveLevel:28, catchRate:175, expYield:70, rarity:"common",
    desc:"A sly street fighter that uses underhanded tricks to win. Quick and hard to pin down." },

  212: { id:212, name:"Brawlvex", emoji:"🥷", types:["Fighting","Dark"],
    base:{hp:72,atk:96,def:65,spa:58,spd:60,spe:88},
    learnset:[[1,"bite"],[1,"headbutt"],[22,"night_slash"],[30,"dark_pulse"],[38,"body_slam"],[46,"reckless_charge"],[54,"heavy_slam"],[62,"battle_cry"]],
    evolveTo:213, evolveLevel:46, catchRate:90, expYield:150, rarity:"uncommon",
    desc:"A martial arts master of shadow techniques. Fights dirty and hits hard." },

  213: { id:213, name:"Grapplethon", emoji:"🏋️", types:["Fighting","Dark"],
    base:{hp:102,atk:138,def:88,spa:72,spd:84,spe:90},
    learnset:[[1,"dark_pulse"],[1,"reckless_charge"],[32,"night_slash"],[40,"heavy_slam"],[48,"battle_cry"],[56,"eclipse_shroud"],[64,"soul_rend"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"The ultimate shadow warrior. Its punches are cloaked in dark energy that disrupt the soul." },

  // Standalone Fighting/Normal: Skuffin
  214: { id:214, name:"Skuffin", emoji:"🐾", types:["Fighting","Normal"],
    base:{hp:100,atk:110,def:88,spa:55,spd:75,spe:72},
    learnset:[[1,"tackle"],[1,"headbutt"],[15,"body_slam"],[25,"reckless_charge"],[35,"iron_press"],[45,"battle_cry"],[55,"heavy_slam"],[65,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A bear-like bruiser with natural armor skin. Roams the highlands looking for worthy challengers." },

  // ===== BATCH 1: GHOST TYPES (IDs 215-220) =====

  // 3-stage Ghost/Psychic chain: Spiritch → Phantorge → Spectraith
  215: { id:215, name:"Spiritch", emoji:"👻", types:["Ghost"],
    base:{hp:40,atk:45,def:30,spa:62,spd:48,spe:68},
    learnset:[[1,"shadow_ball"],[1,"confusion"],[12,"psybeam"],[20,"phantom_claw"],[28,"eclipse_shroud"],[36,"psychic_move"],[44,"soul_rend"],[52,"shadow_ball"]],
    evolveTo:216, evolveLevel:26, catchRate:175, expYield:68, rarity:"common",
    desc:"A wisp of pure spirit energy. Phases through walls and whispers half-remembered secrets." },

  216: { id:216, name:"Phantorge", emoji:"🌫️", types:["Ghost","Psychic"],
    base:{hp:65,atk:70,def:52,spa:96,spd:75,spe:80},
    learnset:[[1,"phantom_claw"],[1,"psybeam"],[20,"eclipse_shroud"],[28,"psychic_move"],[36,"shadow_ball"],[44,"soul_rend"],[52,"dark_pulse"],[60,"hyper_beam"]],
    evolveTo:217, evolveLevel:44, catchRate:90, expYield:145, rarity:"uncommon",
    desc:"A specter of swirling psychic mist. Haunts ancient tombs and siphons residual memories." },

  217: { id:217, name:"Spectraith", emoji:"💀", types:["Ghost","Psychic"],
    base:{hp:88,atk:82,def:70,spa:135,spd:105,spe:90},
    learnset:[[1,"eclipse_shroud"],[1,"psychic_move"],[30,"shadow_ball"],[38,"soul_rend"],[46,"dark_pulse"],[54,"phantom_claw"],[62,"astral_rend"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A ghost of transcendent power. Peers into the minds of the living and shows them their greatest fears." },

  // 2-stage Ghost/Dark chain: Mistwraith → Shademont (item evo: Dusk Stone)
  218: { id:218, name:"Mistwraith", emoji:"🌑", types:["Ghost","Dark"],
    base:{hp:52,atk:60,def:45,spa:82,spd:65,spe:72},
    learnset:[[1,"shadow_ball"],[1,"bite"],[14,"dark_pulse"],[24,"night_slash"],[34,"eclipse_shroud"],[44,"phantom_claw"],[54,"soul_rend"],[60,"hyper_beam"]],
    evolveTo:219, evolveLevel:null, evolveItem:"duskStone", evolveMethod:"item", catchRate:130, expYield:102, rarity:"common",
    desc:"A dark mist that stalks prey from the shadows. Drains warmth and light from its surroundings." },

  219: { id:219, name:"Shademont", emoji:"🖤", types:["Ghost","Dark"],
    base:{hp:82,atk:88,def:72,spa:125,spd:100,spe:85},
    learnset:[[1,"dark_pulse"],[1,"eclipse_shroud"],[28,"night_slash"],[36,"phantom_claw"],[44,"soul_rend"],[52,"shadow_ball"],[60,"dread_howl"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:225, rarity:"rare",
    desc:"A mountain of living shadow. Absorbs all light within a wide radius, creating total darkness." },

  // 2-stage Ghost/Normal chain: Hauntrix → Grimveil (level 34)
  220: { id:220, name:"Hauntrix", emoji:"🎭", types:["Ghost","Normal"],
    base:{hp:60,atk:55,def:55,spa:75,spd:60,spe:78},
    learnset:[[1,"tackle"],[1,"shadow_ball"],[12,"psybeam"],[22,"phantom_claw"],[32,"eclipse_shroud"],[42,"soul_rend"],[52,"shadow_ball"],[60,"hyper_beam"]],
    evolveTo:221, evolveLevel:34, catchRate:145, expYield:92, rarity:"common",
    desc:"A trickster spirit in a jester's mask. Entertains itself by scaring travelers at night." },

`;

// Insert before the LEGENDARIES section
const marker = '  // ===== LEGENDARIES (IDs 314-321) =====';
if (!src.includes(marker)) {
  console.error('ERROR: Could not find insertion marker!');
  process.exit(1);
}
src = src.replace(marker, newLumos + '\n' + marker);
fs.writeFileSync(dataPath, src, 'utf8');

// Verify
const ids = [206,207,208,209,210,211,212,213,214,215,216,217,218,219,220];
const lines = src.split('\n');
let ok = true;
for (const id of ids) {
  const found = lines.some(l => l.match(new RegExp(`^  ${id}: \\{ id:${id},`)));
  if (!found) { console.log(`MISSING ID ${id}`); ok = false; }
}
if (ok) console.log('All IDs 206-220 added successfully!');
