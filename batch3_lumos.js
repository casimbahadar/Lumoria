#!/usr/bin/env node
// Add Lumos batch 3: IDs 236-250 (Ice/Electric/Rock types)
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');

const newLumos = `
  // ===== BATCH 3: ICE / ELECTRIC / ROCK (IDs 236-250) =====

  // 2-stage Ice chain: Frostick → Glacicore (level 30)
  236: { id:236, name:"Frostick", emoji:"🧊", types:["Ice"],
    base:{hp:50,atk:58,def:52,spa:68,spd:55,spe:62},
    learnset:[[1,"powder_snow"],[1,"tackle"],[12,"frost_breath"],[22,"ice_beam"],[32,"blizzard"],[42,"cryo_lance"],[52,"icicle_crash"],[60,"hyper_beam"]],
    evolveTo:237, evolveLevel:30, catchRate:170, expYield:78, rarity:"common",
    desc:"A porcupine of solid ice. Its quills are natural ice needles that regenerate after use." },

  237: { id:237, name:"Glacicore", emoji:"❄️", types:["Ice","Rock"],
    base:{hp:92,atk:102,def:112,spa:78,spd:88,spe:48},
    learnset:[[1,"ice_beam"],[1,"rock_slide"],[24,"blizzard"],[32,"stone_edge"],[40,"cryo_lance"],[48,"icicle_crash"],[56,"avalanche_drive"],[64,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:215, rarity:"uncommon",
    desc:"A glacier golem of living ice and stone. So cold that even fire moves slowly near it." },

  // 3-stage Ice/Wind chain: Snowble → Blizzavane → Permafrix
  238: { id:238, name:"Snowble", emoji:"☃️", types:["Ice","Wind"],
    base:{hp:44,atk:42,def:45,spa:65,spd:52,spe:68},
    learnset:[[1,"powder_snow"],[1,"gust"],[10,"frost_breath"],[18,"air_slash"],[26,"ice_beam"],[36,"blizzard"],[46,"hurricane"],[56,"hyper_beam"]],
    evolveTo:239, evolveLevel:28, catchRate:175, expYield:72, rarity:"common",
    desc:"A snowball that rides wind currents to travel. Gets bigger and angrier in blizzards." },

  239: { id:239, name:"Blizzavane", emoji:"🌨️", types:["Ice","Wind"],
    base:{hp:68,atk:62,def:65,spa:100,spd:82,spe:90},
    learnset:[[1,"air_slash"],[1,"ice_beam"],[22,"blizzard"],[30,"hurricane"],[38,"cryo_lance"],[46,"icicle_crash"],[54,"avalanche_drive"],[62,"hyper_beam"]],
    evolveTo:240, evolveLevel:44, catchRate:90, expYield:148, rarity:"uncommon",
    desc:"A blizzard spirit that travels on storm winds. Turns clear skies into whiteout conditions." },

  240: { id:240, name:"Permafrix", emoji:"🌀", types:["Ice","Wind"],
    base:{hp:92,atk:85,def:88,spa:130,spd:108,spe:102},
    learnset:[[1,"blizzard"],[1,"hurricane"],[32,"cryo_lance"],[40,"icicle_crash"],[48,"avalanche_drive"],[56,"glacial_tomb"],[64,"sleet_barrage"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:28, expYield:265, rarity:"rare",
    desc:"A permanent blizzard given form. The cold zone around it stretches for miles in every direction." },

  // Standalone Ice/Crystal evolves in cold area: Crystalix
  241: { id:241, name:"Crystalix", emoji:"💠", types:["Ice","Psychic"],
    base:{hp:78,atk:75,def:105,spa:115,spd:100,spe:72},
    learnset:[[1,"ice_beam"],[1,"psychic_move"],[20,"cryo_lance"],[30,"psybeam"],[40,"blizzard"],[50,"psystrike"],[60,"glacial_tomb"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"cosmic_cavern", evolveMethod:"location", catchRate:50, expYield:215, rarity:"uncommon",
    desc:"A crystal lattice of ice and psychic power. Forms only in caves where cosmic energy freezes space itself." },

  // 2-stage Electric/Bug chain: Zappling → Voltrix (level 30)
  242: { id:242, name:"Zappling", emoji:"🐞", types:["Electric","Bug"],
    base:{hp:46,atk:55,def:42,spa:68,spd:50,spe:78},
    learnset:[[1,"thunder_shock"],[1,"bug_buzz"],[12,"spark"],[22,"thunderbolt"],[32,"discharge"],[42,"x_scissor"],[52,"thunder"],[60,"hyper_beam"]],
    evolveTo:243, evolveLevel:30, catchRate:170, expYield:75, rarity:"common",
    desc:"A ladybug-like creature that stores electricity in its shell spots. Releases it when threatened." },

  243: { id:243, name:"Voltrixa", emoji:"🪲", types:["Electric","Bug"],
    base:{hp:72,atk:82,def:68,spa:110,spd:78,spe:98},
    learnset:[[1,"thunderbolt"],[1,"x_scissor"],[24,"discharge"],[32,"bug_buzz"],[40,"thunder"],[48,"volt_surge"],[56,"ball_lightning"],[64,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:215, rarity:"uncommon",
    desc:"An electrified beetle warrior. Its wing-cases generate static as it flies, creating lightning storms." },

  // 3-stage Electric/Fighting chain: Staticlaw → Thundravex → Megavolt
  244: { id:244, name:"Staticlaw", emoji:"🦁", types:["Electric","Fighting"],
    base:{hp:55,atk:72,def:52,spa:58,spd:50,spe:70},
    learnset:[[1,"thunder_shock"],[1,"headbutt"],[12,"spark"],[20,"iron_press"],[30,"thunderbolt"],[38,"reckless_charge"],[46,"battle_cry"],[54,"thunder"]],
    evolveTo:245, evolveLevel:28, catchRate:160, expYield:80, rarity:"common",
    desc:"A lion pup whose mane crackles with electricity. Each battle makes its mane larger and brighter." },

  245: { id:245, name:"Thundravex", emoji:"⚡", types:["Electric","Fighting"],
    base:{hp:80,atk:100,def:72,spa:85,spd:72,spe:90},
    learnset:[[1,"thunderbolt"],[1,"reckless_charge"],[22,"battle_cry"],[30,"iron_press"],[38,"thunder"],[46,"heavy_slam"],[54,"discharge"],[62,"hyper_beam"]],
    evolveTo:246, evolveLevel:48, catchRate:75, expYield:165, rarity:"uncommon",
    desc:"A thunder lion that calls down lightning with its roar. Its mane is a living Tesla coil." },

  246: { id:246, name:"Megavolt", emoji:"🦁", types:["Electric","Fighting"],
    base:{hp:105,atk:130,def:90,spa:108,spd:88,spe:102},
    learnset:[[1,"thunder"],[1,"heavy_slam"],[32,"discharge"],[40,"ball_lightning"],[48,"battle_cry"],[56,"iron_press"],[64,"plasma_strike"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:270, rarity:"rare",
    desc:"A king of thunder whose roar is heard across continents. Lightning bends to its will." },

  // Standalone Electric/Bug: Sparkeen
  247: { id:247, name:"Sparkeen", emoji:"🦋", types:["Electric","Bug"],
    base:{hp:72,atk:68,def:65,spa:102,spd:88,spe:115},
    learnset:[[1,"thunderbolt"],[1,"bug_buzz"],[18,"discharge"],[28,"x_scissor"],[38,"thunder"],[48,"volt_surge"],[58,"ball_lightning"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:210, rarity:"uncommon",
    desc:"An electric butterfly that flickers between flower fields and storm clouds. Its wings spark with each flap." },

  // 3-stage Rock/Ground chain: Pebblard → Boulderax → Megalith
  248: { id:248, name:"Pebblard", emoji:"🪨", types:["Rock"],
    base:{hp:52,atk:60,def:72,spa:38,spd:52,spe:42},
    learnset:[[1,"rock_throw"],[1,"tackle"],[12,"rock_slide"],[22,"earth_power"],[32,"stone_edge"],[42,"earthquake"],[52,"bedrock_slam"],[60,"hyper_beam"]],
    evolveTo:249, evolveLevel:28, catchRate:175, expYield:72, rarity:"common",
    desc:"A living pebble with stubby limbs. Rolls into enemies to deal surprisingly heavy blows." },

  249: { id:249, name:"Boulderax", emoji:"⛰️", types:["Rock","Ground"],
    base:{hp:80,atk:95,def:108,spa:52,spd:70,spe:52},
    learnset:[[1,"rock_slide"],[1,"earth_power"],[22,"stone_edge"],[30,"earthquake"],[38,"bedrock_slam"],[46,"mud_shot"],[54,"clay_armor"],[62,"hyper_beam"]],
    evolveTo:250, evolveLevel:46, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A boulder-bodied titan that rolls through terrain like a wrecking ball. Nothing stops its charge." },

  250: { id:250, name:"Megalith", emoji:"🗿", types:["Rock","Ground"],
    base:{hp:115,atk:125,def:140,spa:58,spd:92,spe:45},
    learnset:[[1,"stone_edge"],[1,"earthquake"],[32,"bedrock_slam"],[40,"clay_armor"],[48,"earth_power"],[56,"rock_slide"],[64,"worldseed_quake"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:20, expYield:280, rarity:"rare",
    desc:"An ancient monolith that walks. Archaeological markings on its body predate all known civilizations." },

`;

const marker = '  // ===== LEGENDARIES (IDs 314-321) =====';
if (!src.includes(marker)) {
  console.error('ERROR: Could not find insertion marker!');
  process.exit(1);
}
src = src.replace(marker, newLumos + '\n' + marker);
fs.writeFileSync(dataPath, src, 'utf8');

const ids = [236,237,238,239,240,241,242,243,244,245,246,247,248,249,250];
const lines = src.split('\n');
let ok = true;
for (const id of ids) {
  const found = lines.some(l => l.match(new RegExp(`^  ${id}: \\{ id:${id},`)));
  if (!found) { console.log(`MISSING ID ${id}`); ok = false; }
}
if (ok) console.log('All IDs 236-250 added successfully!');
