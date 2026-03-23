#!/usr/bin/env node
// Add Lumos batch 7: IDs 296-313 (Poison/Bug/mixed fills to complete 108)
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');

const newLumos = `
  // ===== BATCH 7: POISON / BUG / MIXED FILLS (IDs 296-313) =====

  // 3-stage Poison/Bug chain: Toxifly → Venomwing → Plagueoth (lv26, lv44)
  296: { id:296, name:"Toxifly", emoji:"🦟", types:["Poison","Bug"],
    base:{hp:44,atk:52,def:40,spa:68,spd:52,spe:80},
    learnset:[[1,"poison_sting"],[1,"bug_buzz"],[10,"sludge_bomb"],[20,"x_scissor"],[30,"toxic"],[40,"venoshock"],[50,"venom_lance"],[60,"hyper_beam"]],
    evolveTo:297, evolveLevel:26, catchRate:178, expYield:70, rarity:"common",
    desc:"A mosquito-like creature with toxic saliva. A single bite can poison most Lumos instantly." },

  297: { id:297, name:"Venomwing", emoji:"🦋", types:["Poison","Bug"],
    base:{hp:68,atk:78,def:62,spa:98,spd:78,spe:100},
    learnset:[[1,"x_scissor"],[1,"sludge_bomb"],[20,"toxic"],[28,"venoshock"],[36,"bug_buzz"],[44,"venom_lance"],[52,"sludge_wave"],[60,"hyper_beam"]],
    evolveTo:298, evolveLevel:44, catchRate:85, expYield:148, rarity:"uncommon",
    desc:"A poison butterfly whose wing scales are deadly toxins. A single wing-flap spreads enough venom to fell a herd." },

  298: { id:298, name:"Plagueoth", emoji:"🦠", types:["Poison","Bug"],
    base:{hp:92,atk:98,def:82,spa:128,spd:105,spe:105},
    learnset:[[1,"venom_lance"],[1,"bug_buzz"],[30,"sludge_wave"],[38,"toxic"],[46,"venoshock"],[54,"mycelia_net"],[62,"corrosion_fang"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:268, rarity:"rare",
    desc:"The plague moth. Ancient texts describe its awakening as an omen of great pestilence. Its touch corrupts." },

  // 2-stage Bug/Poison chain: Stinglet → Nettleclaw (level 28)
  299: { id:299, name:"Stinglet", emoji:"🐝", types:["Bug","Poison"],
    base:{hp:50,atk:65,def:52,spa:58,spd:55,spe:78},
    learnset:[[1,"bug_buzz"],[1,"poison_sting"],[12,"x_scissor"],[22,"sludge_bomb"],[32,"toxic"],[42,"venoshock"],[52,"venom_lance"],[60,"hyper_beam"]],
    evolveTo:300, evolveLevel:28, catchRate:162, expYield:78, rarity:"common",
    desc:"A bee-like stinger creature with a massive venomous barb. Builds hives from toxic resin." },

  300: { id:300, name:"Nettleclaw", emoji:"🦂", types:["Bug","Poison"],
    base:{hp:80,atk:105,def:80,spa:88,spd:80,spe:95},
    learnset:[[1,"x_scissor"],[1,"venom_lance"],[22,"toxic"],[30,"venoshock"],[38,"sludge_bomb"],[46,"bug_buzz"],[54,"sludge_wave"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:42, expYield:218, rarity:"uncommon",
    desc:"A scorpion-bug hybrid of lethal venom. Its claws inject a toxin that dissolves steel over time." },

  // Standalone Fire/Ghost: Emberveil
  301: { id:301, name:"Emberveil", emoji:"👻", types:["Fire","Ghost"],
    base:{hp:78,atk:82,def:72,spa:118,spd:95,spe:102},
    learnset:[[1,"ember"],[1,"shadow_ball"],[18,"flamethrower"],[28,"phantom_claw"],[38,"fire_blast"],[48,"eclipse_shroud"],[58,"soul_rend"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:48, expYield:215, rarity:"uncommon",
    desc:"A fire specter born from the embers of burned-down haunted houses. Leaves smoldering phantom footprints." },

  // 2-stage Fairy chain: Lightpuff → Lumivane (Moon Stone item)
  302: { id:302, name:"Lightpuff", emoji:"🌟", types:["Fairy"],
    base:{hp:55,atk:48,def:55,spa:78,spd:68,spe:70},
    learnset:[[1,"fairy_wind"],[1,"dazzling_gleam"],[14,"moonblast"],[24,"celestial_wave"],[34,"glitter_storm"],[44,"fae_requiem"],[54,"moonveil"],[60,"hyper_beam"]],
    evolveTo:303, evolveLevel:null, evolveItem:"moonStone", evolveMethod:"item", catchRate:138, expYield:96, rarity:"common",
    desc:"A star-dust fairy of gentle light. Absorbs moonlight to build its energy toward a magnificent transformation." },

  303: { id:303, name:"Lumivane", emoji:"🌠", types:["Fairy","Psychic"],
    base:{hp:88,atk:75,def:85,spa:132,spd:118,spe:100},
    learnset:[[1,"moonblast"],[1,"psychic_move"],[28,"celestial_wave"],[36,"psystrike"],[44,"glitter_storm"],[52,"neural_storm"],[60,"fae_requiem"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:230, rarity:"rare",
    desc:"The comet fairy, born from moonstone energy and starlight. Crosses the sky in streaks of prismatic light." },

  // 3-stage Rock/Ice chain: Crysthorn → Geoshard → Crystallon (location: cold area, lv28, lv48)
  304: { id:304, name:"Crysthorn", emoji:"💎", types:["Rock","Ice"],
    base:{hp:52,atk:62,def:75,spa:58,spd:60,spe:50},
    learnset:[[1,"rock_throw"],[1,"powder_snow"],[12,"rock_slide"],[22,"ice_beam"],[32,"stone_edge"],[42,"cryo_lance"],[52,"blizzard"],[60,"hyper_beam"]],
    evolveTo:305, evolveLevel:28, catchRate:162, expYield:78, rarity:"common",
    desc:"A crystal thorn creature that grows in frozen caves. Its crystalline spines shatter on impact then regrow." },

  305: { id:305, name:"Geoshard", emoji:"🗻", types:["Rock","Ice"],
    base:{hp:78,atk:92,def:105,spa:78,spd:82,spe:58},
    learnset:[[1,"ice_beam"],[1,"stone_edge"],[22,"cryo_lance"],[30,"blizzard"],[38,"bedrock_slam"],[46,"icicle_crash"],[54,"avalanche_drive"],[62,"hyper_beam"]],
    evolveTo:306, evolveLevel:48, catchRate:75, expYield:158, rarity:"uncommon",
    desc:"A rock and ice giant with shard weapons. Lives on the highest frozen peaks of the Lumoria mountain range." },

  306: { id:306, name:"Crystallon", emoji:"🏔️", types:["Rock","Ice"],
    base:{hp:110,atk:118,def:128,spa:92,spd:100,spe:55},
    learnset:[[1,"blizzard"],[1,"bedrock_slam"],[32,"avalanche_drive"],[40,"icicle_crash"],[48,"stone_edge"],[56,"glacial_tomb"],[64,"worldseed_quake"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:18, expYield:275, rarity:"rare",
    desc:"The frozen mountain titan. Glaciers form around it spontaneously. Worshipped by ancient mountain peoples." },

  // Standalone Fire/Dark: Cinderpaw
  307: { id:307, name:"Cinderpaw", emoji:"🐈", types:["Fire","Dark"],
    base:{hp:88,atk:105,def:75,spa:100,spd:82,spe:115},
    learnset:[[1,"ember"],[1,"bite"],[18,"flamethrower"],[28,"night_slash"],[38,"fire_blast"],[48,"dark_pulse"],[58,"eclipse_shroud"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:52, expYield:212, rarity:"uncommon",
    desc:"A dark flame cat that stalks targets silently before unleashing explosive fire attacks. Unpredictable and cunning." },

  // 2-stage Water/Ghost chain: Tidewraith → Aquaphant (Water Stone item)
  308: { id:308, name:"Tidewraith", emoji:"🌊", types:["Water","Ghost"],
    base:{hp:58,atk:62,def:58,spa:88,spd:75,spe:80},
    learnset:[[1,"water_gun"],[1,"shadow_ball"],[14,"surf"],[24,"phantom_claw"],[34,"hydro_pump"],[44,"eclipse_shroud"],[54,"soul_rend"],[60,"hyper_beam"]],
    evolveTo:309, evolveLevel:null, evolveItem:"waterStone", evolveMethod:"item", catchRate:135, expYield:98, rarity:"common",
    desc:"A ghost that drowned and merged with ocean tides. Haunts coastal routes, pulling travelers into the surf." },

  309: { id:309, name:"Aquaphant", emoji:"🐋", types:["Water","Ghost"],
    base:{hp:100,atk:88,def:92,spa:120,spd:108,spe:78},
    learnset:[[1,"hydro_pump"],[1,"eclipse_shroud"],[28,"soul_rend"],[36,"phantom_claw"],[44,"geyser_burst"],[52,"shadow_ball"],[60,"dark_pulse"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:232, rarity:"rare",
    desc:"A spectral sea leviathan that capsizes ships. Half water, half ghost—completely terrifying." },

  // 2-stage Ground/Water chain: Mudpump → Marshix (level 28)
  310: { id:310, name:"Mudpump", emoji:"🐊", types:["Ground","Water"],
    base:{hp:58,atk:68,def:62,spa:58,spd:55,spe:55},
    learnset:[[1,"mud_shot"],[1,"water_gun"],[12,"earth_power"],[22,"surf"],[32,"earthquake"],[42,"hydro_pump"],[52,"clay_armor"],[60,"hyper_beam"]],
    evolveTo:311, evolveLevel:28, catchRate:155, expYield:80, rarity:"common",
    desc:"A muddy crocodile creature that wallows in swamps. Its mud coating provides natural camouflage and armor." },

  311: { id:311, name:"Marshix", emoji:"🦛", types:["Ground","Water"],
    base:{hp:105,atk:118,def:100,spa:78,spd:82,spe:62},
    learnset:[[1,"earthquake"],[1,"surf"],[22,"earth_power"],[30,"hydro_pump"],[38,"clay_armor"],[46,"bedrock_slam"],[54,"aqua_tail"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:42, expYield:222, rarity:"uncommon",
    desc:"A hippo-like swamp titan that commands both mud and water. Creates marshy terrain wherever it settles." },

  // 2-stage Ground/Dark chain: Dunecrawl → Sandrix (level 32)
  312: { id:312, name:"Dunecrawl", emoji:"🦂", types:["Ground","Dark"],
    base:{hp:55,atk:72,def:60,spa:52,spd:55,spe:70},
    learnset:[[1,"mud_shot"],[1,"bite"],[14,"earth_power"],[24,"night_slash"],[34,"earthquake"],[44,"dark_pulse"],[54,"eclipse_shroud"],[60,"hyper_beam"]],
    evolveTo:313, evolveLevel:32, catchRate:148, expYield:85, rarity:"common",
    desc:"A scorpion-like creature that burrows under desert sands. Strikes from below with venomous ambushes." },

  313: { id:313, name:"Sandrix", emoji:"🐍", types:["Ground","Dark"],
    base:{hp:88,atk:112,def:88,spa:75,spd:80,spe:98},
    learnset:[[1,"earthquake"],[1,"dark_pulse"],[26,"night_slash"],[34,"earth_power"],[42,"eclipse_shroud"],[50,"bedrock_slam"],[58,"soul_rend"],[66,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:225, rarity:"uncommon",
    desc:"A sand serpent of deadly cunning. Camouflages perfectly in desert terrain and strikes without warning." },

`;

const marker = '  // ===== LEGENDARIES (IDs 314-321) =====';
if (!src.includes(marker)) {
  console.error('ERROR: Could not find insertion marker!');
  process.exit(1);
}
src = src.replace(marker, newLumos + '\n' + marker);
fs.writeFileSync(dataPath, src, 'utf8');

const ids = [296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313];
const lines = src.split('\n');
let ok = true;
for (const id of ids) {
  const found = lines.some(l => l.match(new RegExp(`^  ${id}: \\{ id:${id},`)));
  if (!found) { console.log(`MISSING ID ${id}`); ok = false; }
}
if (ok) console.log(`All IDs 296-313 added successfully! (${ids.length} new Lumos)`);
// Verify total
const allIds = src.match(/^  \d+: \{ id:\d+,/gm);
console.log(`Total monster definitions in file: ${allIds ? allIds.length : 'unknown'}`);
