#!/usr/bin/env node
// Add Lumos batch 2: IDs 221-235 (Ghost/Psychic split-evo + Dragon)
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');

const newLumos = `
  // ===== BATCH 2: GHOST/PSYCHIC/DRAGON (IDs 221-235) =====

  // Grimveil (evolves from Hauntrix 220)
  221: { id:221, name:"Grimveil", emoji:"🎪", types:["Ghost","Normal"],
    base:{hp:90,atk:80,def:78,spa:105,spd:88,spe:92},
    learnset:[[1,"shadow_ball"],[1,"tackle"],[26,"phantom_claw"],[34,"eclipse_shroud"],[42,"soul_rend"],[50,"dread_howl"],[58,"moonblast"],[66,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:220, rarity:"uncommon",
    desc:"A master of illusions that wears a haunted clown mask. Its performances end in vanishing acts—permanently." },

  // 3-stage Psychic chain: Mindpuff → Cerebrix → Psytheon
  222: { id:222, name:"Mindpuff", emoji:"🫧", types:["Psychic"],
    base:{hp:42,atk:35,def:38,spa:70,spd:58,spe:65},
    learnset:[[1,"confusion"],[1,"psybeam"],[10,"calm_mind"],[20,"psychic_move"],[30,"moonblast"],[40,"psystrike"],[50,"neural_storm"],[60,"hyper_beam"]],
    evolveTo:223, evolveLevel:24, catchRate:190, expYield:65, rarity:"common",
    desc:"A floating blob of pure thought-energy. Its mood is contagious to nearby Lumos." },

  223: { id:223, name:"Cerebrix", emoji:"🧠", types:["Psychic"],
    base:{hp:64,atk:52,def:58,spa:105,spd:88,spe:82},
    learnset:[[1,"psybeam"],[1,"calm_mind"],[18,"psychic_move"],[28,"moonblast"],[38,"psystrike"],[48,"neural_storm"],[56,"astral_rend"],[64,"hyper_beam"]],
    evolveTo:224, evolveLevel:42, catchRate:90, expYield:145, rarity:"uncommon",
    desc:"An evolved brain-creature with exponential intelligence. Solves complex equations for fun." },

  224: { id:224, name:"Psytheon", emoji:"🔮", types:["Psychic","Fairy"],
    base:{hp:88,atk:68,def:80,spa:140,spd:120,spe:94},
    learnset:[[1,"psychic_move"],[1,"moonblast"],[32,"psystrike"],[40,"neural_storm"],[48,"astral_rend"],[56,"dazzling_gleam"],[64,"celestial_wave"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:265, rarity:"rare",
    desc:"The apex psychic being. Its thoughts reshape reality in its immediate vicinity." },

  // Standalone Psychic/Fairy: Glimmerkin
  225: { id:225, name:"Glimmerkin", emoji:"✨", types:["Psychic","Fairy"],
    base:{hp:82,atk:60,def:72,spa:115,spd:105,spe:88},
    learnset:[[1,"fairy_wind"],[1,"confusion"],[15,"dazzling_gleam"],[25,"moonblast"],[35,"psybeam"],[45,"psychic_move"],[55,"celestial_wave"],[65,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:210, rarity:"uncommon",
    desc:"A crystalline fairy of pure mental energy. Its body refracts light into impossible colors." },

  // Split evolution family: Prismoo → 3 forms via stones
  // Prismoo (base, Normal/Psychic) → Prismace (Fire Stone), Prismoon (Moon Stone), Prismolt (Thunder Stone)
  226: { id:226, name:"Prismoo", emoji:"🌈", types:["Normal","Psychic"],
    base:{hp:60,atk:55,def:55,spa:68,spd:60,spe:62},
    learnset:[[1,"tackle"],[1,"confusion"],[14,"psybeam"],[22,"fairy_wind"],[30,"moonblast"],[40,"psychic_move"],[50,"hyper_beam"]],
    evolveTo:227, evolveLevel:null, evolveItem:"firestone", evolveMethod:"item", catchRate:140, expYield:88, rarity:"common",
    desc:"A prism-shaped creature full of untapped potential. Exposure to different energies changes its form entirely." },

  // Prismace: Fire Stone evolution (Fire/Psychic)
  227: { id:227, name:"Prismace", emoji:"🔥", types:["Fire","Psychic"],
    base:{hp:78,atk:95,def:65,spa:118,spd:72,spe:92},
    learnset:[[1,"flamethrower"],[1,"psychic_move"],[28,"fire_blast"],[36,"psystrike"],[44,"astral_rend"],[52,"overheat"],[60,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:225, rarity:"rare",
    desc:"A blazing prism warrior. Its psychic fire burns away illusions and exposes hidden truths." },

  // Prismoon: Moon Stone evolution (Ice/Psychic)
  228: { id:228, name:"Prismoon", emoji:"🌙", types:["Ice","Psychic"],
    base:{hp:82,atk:72,def:88,spa:122,spd:108,spe:78},
    learnset:[[1,"ice_beam"],[1,"psychic_move"],[28,"blizzard"],[36,"psystrike"],[44,"astral_rend"],[52,"frost_breath"],[60,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:225, rarity:"rare",
    desc:"A moonlit prism draped in eternal winter. Its gaze freezes time momentarily." },

  // Prismolt: Thunder Stone evolution (Electric/Psychic)
  229: { id:229, name:"Prismolt", emoji:"⚡", types:["Electric","Psychic"],
    base:{hp:72,atk:88,def:62,spa:130,spd:78,spe:110},
    learnset:[[1,"thunderbolt"],[1,"psychic_move"],[28,"thunder"],[36,"psystrike"],[44,"astral_rend"],[52,"discharge"],[60,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:225, rarity:"rare",
    desc:"A thunderstruck prism crackling with psychic lightning. Thoughts become electrical impulses at its speed." },

  // ===== DRAGON TYPES (IDs 230-235) =====

  // 2-stage Dragon chain: Scaleling → Wyvaxis
  230: { id:230, name:"Scaleling", emoji:"🐊", types:["Dragon"],
    base:{hp:58,atk:72,def:62,spa:60,spd:55,spe:58},
    learnset:[[1,"tackle"],[1,"dragon_breath"],[16,"dragon_claw"],[26,"dragon_pulse"],[36,"dragon_dance"],[46,"outrage"],[56,"hyper_beam"]],
    evolveTo:231, evolveLevel:36, catchRate:150, expYield:90, rarity:"common",
    desc:"A young river drake with scales that shimmer like gemstones. Fierce despite its small size." },

  231: { id:231, name:"Wyvaxis", emoji:"🐲", types:["Dragon","Water"],
    base:{hp:92,atk:110,def:85,spa:95,spd:80,spe:95},
    learnset:[[1,"dragon_claw"],[1,"surf"],[30,"dragon_pulse"],[38,"dragon_dance"],[46,"hydro_pump"],[54,"outrage"],[62,"ancient_breath"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A river drake that has mastered both land and water. Controls currents with its dragon energy." },

  // 3-stage Dragon/Ground chain: Draxon → Serpenthorn → Wyvernak
  232: { id:232, name:"Draxon", emoji:"🦎", types:["Dragon","Ground"],
    base:{hp:52,atk:68,def:65,spa:45,spd:50,spe:55},
    learnset:[[1,"tackle"],[1,"mud_shot"],[14,"dragon_breath"],[24,"earthquake"],[34,"dragon_claw"],[44,"dragon_pulse"],[54,"outrage"],[64,"hyper_beam"]],
    evolveTo:233, evolveLevel:32, catchRate:160, expYield:82, rarity:"common",
    desc:"A ground-burrowing dragon hatchling. Its thick hide absorbs punishment like bedrock." },

  233: { id:233, name:"Serpenthorn", emoji:"🐍", types:["Dragon","Ground"],
    base:{hp:78,atk:98,def:90,spa:65,spd:72,spe:68},
    learnset:[[1,"dragon_claw"],[1,"earthquake"],[26,"earth_power"],[34,"dragon_pulse"],[42,"dragon_dance"],[50,"outrage"],[58,"bedrock_slam"],[66,"hyper_beam"]],
    evolveTo:234, evolveLevel:52, catchRate:75, expYield:165, rarity:"uncommon",
    desc:"A horned serpent that tunnels through mountain roots. Its charge creates fissures in bedrock." },

  234: { id:234, name:"Wyvernak", emoji:"🐉", types:["Dragon","Ground"],
    base:{hp:108,atk:135,def:112,spa:78,spd:90,spe:72},
    learnset:[[1,"outrage"],[1,"earthquake"],[36,"dragon_dance"],[44,"earth_power"],[52,"dragon_pulse"],[60,"bedrock_slam"],[68,"ancient_breath"],[76,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:20, expYield:275, rarity:"rare",
    desc:"An ancient wyvern that has merged with the earth. Mountain ranges shift when it stirs in its sleep." },

  // Standalone Dragon/Water: Glintscale
  235: { id:235, name:"Glintscale", emoji:"🐟", types:["Dragon","Water"],
    base:{hp:95,atk:105,def:88,spa:108,spd:92,spe:102},
    learnset:[[1,"dragon_claw"],[1,"surf"],[20,"dragon_pulse"],[30,"hydro_pump"],[40,"dragon_dance"],[50,"outrage"],[60,"geyser_burst"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:215, rarity:"uncommon",
    desc:"A dragon-koi of iridescent scales. Legends say it swims the boundary between worlds." },

`;

const marker = '  // ===== LEGENDARIES (IDs 314-321) =====';
if (!src.includes(marker)) {
  console.error('ERROR: Could not find insertion marker!');
  process.exit(1);
}
src = src.replace(marker, newLumos + '\n' + marker);
fs.writeFileSync(dataPath, src, 'utf8');

const ids = [221,222,223,224,225,226,227,228,229,230,231,232,233,234,235];
const lines = src.split('\n');
let ok = true;
for (const id of ids) {
  const found = lines.some(l => l.match(new RegExp(`^  ${id}: \\{ id:${id},`)));
  if (!found) { console.log(`MISSING ID ${id}`); ok = false; }
}
if (ok) console.log('All IDs 221-235 added successfully!');
