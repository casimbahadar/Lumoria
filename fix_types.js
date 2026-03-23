#!/usr/bin/env node
// Fix: Remove Fighting/Ghost types, fix evolution chain 172→173→174, make Dragemian standalone
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');

// ============================================================
// PART 1: Replace IDs 206-214 (Fighting types → new types)
// ============================================================

// Replace entire block: IDs 206-214
// New Lumos:
// 206-208: Poison/Dragon 3-stage (Venomscale → Toxidrak → Dragovenom)
// 209-210: Normal/Electric 2-stage (Boltfur → Thundermane)
// 211-213: Fire/Ice 3-stage (Cinderfrost → Glaciblaze → Pyroglacier)
// 214: Water/Rock standalone (Coralstone)

const oldBlock206_214 = `  // ===== BATCH 1: FIGHTING TYPES (IDs 206-214) =====

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
    desc:"A bear-like bruiser with natural armor skin. Roams the highlands looking for worthy challengers." },`;

const newBlock206_214 = `  // ===== BATCH 1: POISON/DRAGON, ELECTRIC, FIRE/ICE (IDs 206-214) =====

  // 3-stage Poison/Dragon chain: Venomscale → Toxidrak → Dragovenom
  206: { id:206, name:"Venomscale", emoji:"🐍", types:["Poison","Dragon"],
    base:{hp:50,atk:62,def:50,spa:68,spd:52,spe:65},
    learnset:[[1,"poison_sting"],[1,"dragon_breath"],[12,"sludge_bomb"],[22,"dragon_claw"],[32,"toxic"],[42,"dragon_pulse"],[52,"venom_lance"],[62,"hyper_beam"]],
    evolveTo:207, evolveLevel:26, catchRate:180, expYield:72, rarity:"common",
    desc:"A small serpent whose venom has a faint draconic energy. Its fangs drip with corrosive toxin." },

  207: { id:207, name:"Toxidrak", emoji:"🐉", types:["Poison","Dragon"],
    base:{hp:75,atk:90,def:68,spa:98,spd:72,spe:80},
    learnset:[[1,"sludge_bomb"],[1,"dragon_claw"],[20,"toxic"],[28,"dragon_pulse"],[36,"venom_lance"],[44,"outrage"],[52,"sludge_wave"],[60,"hyper_beam"]],
    evolveTo:208, evolveLevel:46, catchRate:90, expYield:148, rarity:"uncommon",
    desc:"A dragon-serpent that breathes venomous mist. Its flight path traces poisonous trails through the sky." },

  208: { id:208, name:"Dragovenom", emoji:"🐲", types:["Poison","Dragon"],
    base:{hp:102,atk:120,def:92,spa:130,spd:100,spe:88},
    learnset:[[1,"venom_lance"],[1,"outrage"],[30,"sludge_wave"],[38,"dragon_pulse"],[46,"dragon_dance"],[54,"corrosion_fang"],[62,"ancient_breath"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:28, expYield:262, rarity:"rare",
    desc:"A venomous wyvern of terrible power. Its mere presence poisons the ground for miles around." },

  // 2-stage Normal/Electric chain: Boltfur → Thundermane (level 30)
  209: { id:209, name:"Boltfur", emoji:"🐇", types:["Normal","Electric"],
    base:{hp:58,atk:52,def:48,spa:65,spd:58,spe:88},
    learnset:[[1,"thunder_shock"],[1,"tackle"],[12,"spark"],[22,"thunderbolt"],[32,"discharge"],[42,"volt_surge"],[52,"ball_lightning"],[60,"hyper_beam"]],
    evolveTo:210, evolveLevel:30, catchRate:155, expYield:82, rarity:"common",
    desc:"A rabbit-like creature whose fur stands permanently on end from static electricity. Leaves sparks wherever it hops." },

  210: { id:210, name:"Thundermane", emoji:"🦁", types:["Normal","Electric"],
    base:{hp:92,atk:88,def:78,spa:108,spd:90,spe:112},
    learnset:[[1,"thunderbolt"],[1,"body_slam"],[24,"discharge"],[32,"volt_surge"],[40,"thunder"],[48,"ball_lightning"],[56,"plasma_strike"],[64,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:42, expYield:222, rarity:"uncommon",
    desc:"An electric lion whose mane generates constant lightning storms. The pride leader of its herd." },

  // 3-stage Fire/Ice chain: Cinderfrost → Glaciblaze → Pyroglacier
  211: { id:211, name:"Cinderfrost", emoji:"🔥", types:["Fire","Ice"],
    base:{hp:48,atk:58,def:45,spa:72,spd:55,spe:68},
    learnset:[[1,"ember"],[1,"powder_snow"],[12,"flamethrower"],[22,"ice_beam"],[32,"fire_blast"],[42,"blizzard"],[52,"overheat"],[62,"hyper_beam"]],
    evolveTo:212, evolveLevel:28, catchRate:175, expYield:72, rarity:"common",
    desc:"A creature born where volcanic vents meet glacial ice. Its body perpetually cycles between fire and frost." },

  212: { id:212, name:"Glaciblaze", emoji:"🌡️", types:["Fire","Ice"],
    base:{hp:74,atk:82,def:68,spa:108,spd:88,spe:88},
    learnset:[[1,"flamethrower"],[1,"ice_beam"],[22,"fire_blast"],[30,"blizzard"],[38,"frost_breath"],[46,"overheat"],[54,"glacial_tomb"],[62,"hyper_beam"]],
    evolveTo:213, evolveLevel:46, catchRate:88, expYield:155, rarity:"uncommon",
    desc:"A dual-natured creature of perfect thermal balance. Its left side blazes while its right side freezes." },

  213: { id:213, name:"Pyroglacier", emoji:"🌋", types:["Fire","Ice"],
    base:{hp:105,atk:108,def:95,spa:140,spd:110,spe:85},
    learnset:[[1,"fire_blast"],[1,"blizzard"],[32,"overheat"],[40,"glacial_tomb"],[48,"heat_wave"],[56,"icicle_crash"],[64,"caldera_meltdown"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:268, rarity:"rare",
    desc:"A cataclysmic being that collapses the boundary between fire and ice. Superheated geysers and flash-freezes occur in its wake." },

  // Standalone Water/Rock: Coralstone
  214: { id:214, name:"Coralstone", emoji:"🪸", types:["Water","Rock"],
    base:{hp:102,atk:98,def:118,spa:85,spd:100,spe:55},
    learnset:[[1,"water_gun"],[1,"rock_throw"],[18,"surf"],[28,"stone_edge"],[38,"hydro_pump"],[48,"rock_slide"],[58,"bedrock_slam"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:48, expYield:212, rarity:"uncommon",
    desc:"A living coral fortress. Anchors itself to seafloor rocks and grows for centuries, becoming near-indestructible." },`;

if (!src.includes(oldBlock206_214.slice(0, 100))) {
  console.error('Could not find old 206-214 block!');
  // Try a shorter match
  const shortMatch = '  // ===== BATCH 1: FIGHTING TYPES (IDs 206-214) =====';
  if (!src.includes(shortMatch)) {
    console.error('FATAL: Cannot find 206-214 block at all');
    process.exit(1);
  }
}
src = src.replace(oldBlock206_214, newBlock206_214);

// ============================================================
// PART 2: Convert Ghost types to Psychic/Dark (IDs 215-221)
// ============================================================

// 215: Ghost → Psychic (Spiritch → Psywisp)
src = src.replace(
  '  215: { id:215, name:"Spiritch", emoji:"👻", types:["Ghost"],\n    base:{hp:40,atk:45,def:30,spa:62,spd:48,spe:68},\n    learnset:[[1,"shadow_ball"],[1,"confusion"],[12,"psybeam"],[20,"phantom_claw"],[28,"eclipse_shroud"],[36,"psychic_move"],[44,"soul_rend"],[52,"shadow_ball"]],\n    evolveTo:216, evolveLevel:26, catchRate:175, expYield:68, rarity:"common",\n    desc:"A wisp of pure spirit energy. Phases through walls and whispers half-remembered secrets." },',
  '  215: { id:215, name:"Psywisp", emoji:"🌀", types:["Psychic"],\n    base:{hp:40,atk:42,def:30,spa:68,spd:52,spe:72},\n    learnset:[[1,"confusion"],[1,"psybeam"],[12,"calm_mind"],[20,"psychic_move"],[28,"moonblast"],[36,"psystrike"],[44,"neural_storm"],[52,"astral_rend"]],\n    evolveTo:216, evolveLevel:26, catchRate:175, expYield:68, rarity:"common",\n    desc:"A wisp of pure psychic energy. Drifts through reality reading the thoughts of every living thing nearby." },'
);

// 216: Ghost/Psychic → Psychic (Phantorge → Psychdrift)
src = src.replace(
  '  216: { id:216, name:"Phantorge", emoji:"🌫️", types:["Ghost","Psychic"],\n    base:{hp:65,atk:70,def:52,spa:96,spd:75,spe:80},\n    learnset:[[1,"phantom_claw"],[1,"psybeam"],[20,"eclipse_shroud"],[28,"psychic_move"],[36,"shadow_ball"],[44,"soul_rend"],[52,"dark_pulse"],[60,"hyper_beam"]],\n    evolveTo:217, evolveLevel:44, catchRate:90, expYield:145, rarity:"uncommon",\n    desc:"A specter of swirling psychic mist. Haunts ancient tombs and siphons residual memories." },',
  '  216: { id:216, name:"Psychdrift", emoji:"🌫️", types:["Psychic"],\n    base:{hp:65,atk:65,def:52,spa:102,spd:80,spe:88},\n    learnset:[[1,"psybeam"],[1,"calm_mind"],[20,"psychic_move"],[28,"moonblast"],[36,"psystrike"],[44,"neural_storm"],[52,"astral_rend"],[60,"hyper_beam"]],\n    evolveTo:217, evolveLevel:44, catchRate:90, expYield:145, rarity:"uncommon",\n    desc:"A drifting psychic entity that bridges the conscious and unconscious mind. Its form shifts like fog." },'
);

// 217: Ghost/Psychic → Psychic (Spectraith → Mentovast)
src = src.replace(
  '  217: { id:217, name:"Spectraith", emoji:"💀", types:["Ghost","Psychic"],\n    base:{hp:88,atk:82,def:70,spa:135,spd:105,spe:90},\n    learnset:[[1,"eclipse_shroud"],[1,"psychic_move"],[30,"shadow_ball"],[38,"soul_rend"],[46,"dark_pulse"],[54,"phantom_claw"],[62,"astral_rend"],[70,"hyper_beam"]],\n    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",\n    desc:"A ghost of transcendent power. Peers into the minds of the living and shows them their greatest fears." },',
  '  217: { id:217, name:"Mentovast", emoji:"🔮", types:["Psychic"],\n    base:{hp:88,atk:75,def:72,spa:140,spd:112,spe:98},\n    learnset:[[1,"psychic_move"],[1,"moonblast"],[30,"psystrike"],[38,"neural_storm"],[46,"astral_rend"],[54,"psybeam"],[62,"calm_mind"],[70,"hyper_beam"]],\n    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",\n    desc:"A vast psychic intelligence that defies physical form. Peers into the deepest layers of consciousness." },'
);

// 218: Ghost/Dark → Dark (Mistwraith → Duskmist)
src = src.replace(
  '  218: { id:218, name:"Mistwraith", emoji:"🌑", types:["Ghost","Dark"],\n    base:{hp:52,atk:60,def:45,spa:82,spd:65,spe:72},\n    learnset:[[1,"shadow_ball"],[1,"bite"],[14,"dark_pulse"],[24,"night_slash"],[34,"eclipse_shroud"],[44,"phantom_claw"],[54,"soul_rend"],[60,"hyper_beam"]],\n    evolveTo:219, evolveLevel:null, evolveItem:"duskStone", evolveMethod:"item", catchRate:130, expYield:102, rarity:"common",\n    desc:"A dark mist that stalks prey from the shadows. Drains warmth and light from its surroundings." },',
  '  218: { id:218, name:"Duskmist", emoji:"🌑", types:["Dark"],\n    base:{hp:55,atk:62,def:48,spa:85,spd:68,spe:75},\n    learnset:[[1,"bite"],[1,"dark_pulse"],[14,"night_slash"],[24,"eclipse_shroud"],[34,"crunch"],[44,"soul_rend"],[54,"dread_howl"],[60,"hyper_beam"]],\n    evolveTo:219, evolveLevel:null, evolveItem:"duskStone", evolveMethod:"item", catchRate:130, expYield:102, rarity:"common",\n    desc:"A dark mist that drains ambient light and warmth. Those who walk through it feel inexplicable despair." },'
);

// 219: Ghost/Dark → Dark (Shademont → Nightmont)
src = src.replace(
  '  219: { id:219, name:"Shademont", emoji:"🖤", types:["Ghost","Dark"],\n    base:{hp:82,atk:88,def:72,spa:125,spd:100,spe:85},\n    learnset:[[1,"dark_pulse"],[1,"eclipse_shroud"],[28,"night_slash"],[36,"phantom_claw"],[44,"soul_rend"],[52,"shadow_ball"],[60,"dread_howl"],[68,"hyper_beam"]],\n    evolveTo:null, evolveLevel:null, catchRate:40, expYield:225, rarity:"rare",\n    desc:"A mountain of living shadow. Absorbs all light within a wide radius, creating total darkness." },',
  '  219: { id:219, name:"Nightmont", emoji:"🖤", types:["Dark"],\n    base:{hp:85,atk:92,def:78,spa:128,spd:105,spe:90},\n    learnset:[[1,"dark_pulse"],[1,"eclipse_shroud"],[28,"night_slash"],[36,"crunch"],[44,"soul_rend"],[52,"dread_howl"],[60,"dark_pulse"],[68,"hyper_beam"]],\n    evolveTo:null, evolveLevel:null, catchRate:40, expYield:225, rarity:"rare",\n    desc:"A mountain of absolute darkness. Creates a shadow zone where no light can penetrate for hundreds of meters." },'
);

// 220: Ghost/Normal → Dark/Psychic (Hauntrix → Duskjest)
src = src.replace(
  '  220: { id:220, name:"Hauntrix", emoji:"🎭", types:["Ghost","Normal"],\n    base:{hp:60,atk:55,def:55,spa:75,spd:60,spe:78},\n    learnset:[[1,"tackle"],[1,"shadow_ball"],[12,"psybeam"],[22,"phantom_claw"],[32,"eclipse_shroud"],[42,"soul_rend"],[52,"shadow_ball"],[60,"hyper_beam"]],\n    evolveTo:221, evolveLevel:34, catchRate:145, expYield:92, rarity:"common",\n    desc:"A trickster spirit in a jester\'s mask. Entertains itself by scaring travelers at night." },',
  '  220: { id:220, name:"Duskjest", emoji:"🎭", types:["Dark","Psychic"],\n    base:{hp:62,atk:58,def:55,spa:78,spd:62,spe:82},\n    learnset:[[1,"bite"],[1,"confusion"],[12,"dark_pulse"],[22,"psybeam"],[32,"night_slash"],[42,"psychic_move"],[52,"eclipse_shroud"],[60,"hyper_beam"]],\n    evolveTo:221, evolveLevel:34, catchRate:145, expYield:92, rarity:"common",\n    desc:"A trickster in a dark jester\'s mask. Uses psychic illusions and dark energy to confuse and terrify." },'
);

// 221: Ghost/Normal → Dark/Psychic (Grimveil → Shadowveil)
src = src.replace(
  '  221: { id:221, name:"Grimveil", emoji:"🎪", types:["Ghost","Normal"],\n    base:{hp:90,atk:80,def:78,spa:105,spd:88,spe:92},\n    learnset:[[1,"shadow_ball"],[1,"tackle"],[26,"phantom_claw"],[34,"eclipse_shroud"],[42,"soul_rend"],[50,"dread_howl"],[58,"moonblast"],[66,"hyper_beam"]],\n    evolveTo:null, evolveLevel:null, catchRate:40, expYield:220, rarity:"uncommon",\n    desc:"A master of illusions that wears a haunted clown mask. Its performances end in vanishing acts—permanently." },',
  '  221: { id:221, name:"Shadowveil", emoji:"🎪", types:["Dark","Psychic"],\n    base:{hp:92,atk:85,def:80,spa:110,spd:92,spe:98},\n    learnset:[[1,"dark_pulse"],[1,"psychic_move"],[26,"night_slash"],[34,"eclipse_shroud"],[42,"soul_rend"],[50,"dread_howl"],[58,"moonblast"],[66,"hyper_beam"]],\n    evolveTo:null, evolveLevel:null, catchRate:40, expYield:220, rarity:"uncommon",\n    desc:"A master of dark illusions. Those who witness its act lose themselves in psychic nightmares for days." },'
);

// ============================================================
// PART 3: Fix Electric/Fighting 244-246 → pure Electric
// ============================================================
src = src.replace(
  'types:["Electric","Fighting"],\n    base:{hp:55,atk:72,def:52,spa:58,spd:50,spe:70},\n    learnset:[[1,"thunder_shock"],[1,"headbutt"],[12,"spark"],[20,"iron_press"],[30,"thunderbolt"],[38,"reckless_charge"],[46,"battle_cry"],[54,"thunder"]],',
  'types:["Electric"],\n    base:{hp:58,atk:68,def:52,spa:72,spd:55,spe:88},\n    learnset:[[1,"thunder_shock"],[1,"spark"],[12,"thunderbolt"],[20,"discharge"],[30,"arc_flash"],[38,"ball_lightning"],[46,"thunder"],[54,"plasma_strike"]],'
);

src = src.replace(
  '  245: { id:245, name:"Thundravex", emoji:"⚡", types:["Electric","Fighting"],\n    base:{hp:80,atk:100,def:72,spa:85,spd:72,spe:90},\n    learnset:[[1,"thunderbolt"],[1,"reckless_charge"],[22,"battle_cry"],[30,"iron_press"],[38,"thunder"],[46,"heavy_slam"],[54,"discharge"],[62,"hyper_beam"]],',
  '  245: { id:245, name:"Thundravex", emoji:"⚡", types:["Electric"],\n    base:{hp:82,atk:90,def:72,spa:110,spd:80,spe:108},\n    learnset:[[1,"thunderbolt"],[1,"discharge"],[22,"ball_lightning"],[30,"arc_flash"],[38,"thunder"],[46,"volt_surge"],[54,"plasma_strike"],[62,"hyper_beam"]],'
);

src = src.replace(
  '  246: { id:246, name:"Megavolt", emoji:"🦁", types:["Electric","Fighting"],\n    base:{hp:105,atk:130,def:90,spa:108,spd:88,spe:102},\n    learnset:[[1,"thunder"],[1,"heavy_slam"],[32,"discharge"],[40,"ball_lightning"],[48,"battle_cry"],[56,"iron_press"],[64,"plasma_strike"],[72,"hyper_beam"]],',
  '  246: { id:246, name:"Megavolt", emoji:"🦁", types:["Electric"],\n    base:{hp:105,atk:110,def:90,spa:130,spd:95,spe:118},\n    learnset:[[1,"thunder"],[1,"discharge"],[32,"ball_lightning"],[40,"plasma_strike"],[48,"arc_flash"],[56,"volt_surge"],[64,"overcharge"],[72,"hyper_beam"]],'
);

// ============================================================
// PART 4: Fix Dark/Ghost → Dark (267-268)
// ============================================================
src = src.replace(
  "types:[\"Dark\",\"Ghost\"],\n    base:{hp:72,atk:95,def:65,spa:75,spd:68,spe:90},",
  "types:[\"Dark\"],\n    base:{hp:72,atk:95,def:65,spa:75,spd:68,spe:90},"
);
src = src.replace(
  "types:[\"Dark\",\"Ghost\"],\n    base:{hp:98,atk:130,def:88,spa:95,spd:88,spe:108},",
  "types:[\"Dark\"],\n    base:{hp:98,atk:130,def:88,spa:95,spd:88,spe:108},"
);

// ============================================================
// PART 5: Fix Normal/Ghost → Normal/Dark (290)
// ============================================================
src = src.replace(
  'types:["Normal","Ghost"],\n    base:{hp:82,atk:90,def:78,spa:95,spd:85,spe:102},',
  'types:["Normal","Dark"],\n    base:{hp:82,atk:90,def:78,spa:95,spd:85,spe:102},'
);

// ============================================================
// PART 6: Fix Fire/Ghost → Fire/Dark (301)
// ============================================================
src = src.replace(
  '  301: { id:301, name:"Emberveil", emoji:"👻", types:["Fire","Ghost"],',
  '  301: { id:301, name:"Emberveil", emoji:"🔥", types:["Fire","Dark"],'
);

// ============================================================
// PART 7: Fix Water/Ghost → Water/Dark (308-309)
// ============================================================
src = src.replace(
  'types:["Water","Ghost"],\n    base:{hp:58,atk:62,def:58,spa:88,spd:75,spe:80},',
  'types:["Water","Dark"],\n    base:{hp:58,atk:62,def:58,spa:88,spd:75,spe:80},'
);
src = src.replace(
  'types:["Water","Ghost"],\n    base:{hp:100,atk:88,def:92,spa:120,spd:108,spe:78},',
  'types:["Water","Dark"],\n    base:{hp:100,atk:88,def:92,spa:120,spd:108,spe:78},'
);

// ============================================================
// PART 8: Fix 172→173→174 chain + standalone Dragemian
// ============================================================
// Change 173's evolveTo from 321 to 174
src = src.replace(
  '    evolveTo:321, evolveLevel:55, catchRate:15, expYield:170, rarity:"rare",\n    desc:"A powerful wyrm with tremendous strength. Known to destroy mountains." },',
  '    evolveTo:174, evolveLevel:55, catchRate:15, expYield:175, rarity:"rare",\n    desc:"A powerful wyrm with tremendous strength. Known to destroy mountains. Legends say it will one day don armor of living steel." },'
);

// Update 174 Scalevorn: make it a final evolution (update catchRate/expYield, it already has reasonable stats)
src = src.replace(
  '    evolveTo:null, evolveLevel:null, catchRate:38, expYield:218, rarity:"uncommon",\n    desc:"An armored dragon whose scales have fused into a steel shell over millennia. Lives deep in metallic caverns." },',
  '    evolveTo:null, evolveLevel:null, catchRate:22, expYield:275, rarity:"rare",\n    desc:"The final form of the ancient dragon lineage. Its scales have fused into living steel over millennia of battle, creating impenetrable natural armor." },'
);

// Make 321 Dragemian standalone legendary (it already has no evolveTo, but let's ensure the desc reflects it's standalone)
// Dragemian doesn't need to be changed much since it was already a legendary, just make sure nothing points to it as an evolution
// (173 now points to 174 instead of 321, so we're good)

// Also update the section comment for IDs 215-221
src = src.replace(
  '  // ===== BATCH 1: GHOST TYPES (IDs 215-220) =====',
  '  // ===== BATCH 1: PSYCHIC/DARK TYPES (IDs 215-221) ====='
);

// ============================================================
// PART 9: Update encounter tables - remove Fighting refs, update Ghost comments
// ============================================================
// Remove Cuffkin (206) from route10 - replace with Venomscale
src = src.replace(
  '      {id:206, minLv:57, maxLv:62, rate:10},  // Cuffkin (base Fighting)',
  '      {id:206, minLv:57, maxLv:62, rate:10},  // Venomscale (base Poison/Dragon)'
);

// Update ash_fields - Staticlaw is now pure Electric (no more Fighting)
src = src.replace(
  '      {id:244, minLv:65, maxLv:70, rate:10},  // Staticlaw (base Elec/Fgt)',
  '      {id:244, minLv:65, maxLv:70, rate:10},  // Staticlaw (base Electric)'
);
src = src.replace(
  '      {id:245, minLv:66, maxLv:71, rate:25},  // Thundravex (mid → 244 on route14 ✓)',
  '      {id:245, minLv:66, maxLv:71, rate:25},  // Thundravex (mid Electric → 244 ✓)'
);

// Update Ghost type comments in encounter tables
src = src.replace(/\/\/ Spiritch \(base Ghost\)/g, '// Psywisp (base Psychic)');
src = src.replace(/\/\/ Phantorge \(mid → (?:215|after 215) ✓\)/g, '// Psychdrift (mid → Psywisp 215 ✓)');
src = src.replace(/\/\/ Spectraith \(final(?:.*?)\)/g, '// Mentovast (final Psychic)');
src = src.replace(/\/\/ Hauntrix \(base Ghost\/Normal\)/g, '// Duskjest (base Dark/Psychic)');
src = src.replace(/\/\/ Grimveil \(mid → (?:220|Hauntrix) ✓\)/g, '// Shadowveil (mid → Duskjest 220 ✓)');
src = src.replace(/\/\/ Mistwraith \(base Ghost\/Dark\)/g, '// Duskmist (base Dark)');
src = src.replace(/\/\/ Shademont/g, '// Nightmont');
src = src.replace(/\/\/ Tidewraith \(base Water\/Ghost\)/g, '// Tidewraith (base Water/Dark)');
src = src.replace(/\/\/ Aquaphant \(Water Stone evo.*?\)/g, '// Aquaphant (Water Stone evo, base 308 → Water/Dark)');
src = src.replace(/\/\/ Nightclaw \(mid → 266 ✓\)/g, '// Nightclaw (mid Dark → after 266 ✓)');
src = src.replace(/\/\/ Darkfang \(final → 267 on ash_fields ✓\)/g, '// Darkfang (final Dark → 267 ✓)');

// Save
fs.writeFileSync(dataPath, src, 'utf8');

// Verify no remaining Ghost or Fighting types
const lines = src.split('\n');
let ghostFightingFound = false;
for (const line of lines) {
  if (line.includes('"Ghost"') && line.includes('types:')) {
    console.log(`  STILL HAS GHOST: ${line.trim()}`);
    ghostFightingFound = true;
  }
  if (line.includes('"Fighting"') && line.includes('types:')) {
    console.log(`  STILL HAS FIGHTING: ${line.trim()}`);
    ghostFightingFound = true;
  }
}
if (!ghostFightingFound) console.log('All Ghost/Fighting types removed successfully!');

// Verify 172→173→174 chain
const chain = ['evolveTo:173', 'evolveTo:174'];
for (const c of chain) {
  console.log(`  ${c}: ${src.includes(c) ? 'OK' : 'MISSING'}`);
}
console.log(`  173 no longer points to 321: ${!src.includes('evolveTo:321') ? 'OK' : 'STILL POINTS TO 321'}`);

// Verify 206-208 are now Poison/Dragon
console.log(`  206 Venomscale: ${src.includes('"Venomscale"') ? 'OK' : 'MISSING'}`);
console.log(`  207 Toxidrak: ${src.includes('"Toxidrak"') ? 'OK' : 'MISSING'}`);
console.log(`  208 Dragovenom: ${src.includes('"Dragovenom"') ? 'OK' : 'MISSING'}`);
