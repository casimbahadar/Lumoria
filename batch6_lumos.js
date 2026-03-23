#!/usr/bin/env node
// Add Lumos batch 6: IDs 281-295 (Steel/Normal/Wind/Poison/Bug)
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');

const newLumos = `
  // ===== BATCH 6: STEEL / NORMAL / WIND / POISON / BUG (IDs 281-295) =====

  // Cogvex and Mechavast (continuing Gearbit chain from 280)
  281: { id:281, name:"Cogvex", emoji:"⚙️", types:["Steel","Ground"],
    base:{hp:78,atk:98,def:108,spa:58,spd:75,spe:60},
    learnset:[[1,"flash_cannon"],[1,"earth_power"],[22,"iron_tail"],[30,"earthquake"],[38,"forge_strike"],[46,"bedrock_slam"],[54,"heavy_slam"],[62,"hyper_beam"]],
    evolveTo:282, evolveLevel:46, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A complex gear-machine creature that absorbs underground minerals to repair itself." },

  282: { id:282, name:"Mechavast", emoji:"🤖", types:["Steel","Ground"],
    base:{hp:112,atk:130,def:132,spa:68,spd:90,spe:55},
    learnset:[[1,"forge_strike"],[1,"earthquake"],[32,"heavy_slam"],[40,"bedrock_slam"],[48,"iron_tail"],[56,"earth_power"],[64,"flash_cannon"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:18, expYield:278, rarity:"rare",
    desc:"The ultimate mechanical titan. Its body is a perfect fusion of steel and compressed earth." },

  // Standalone Steel/Ground: Rustpike
  283: { id:283, name:"Rustpike", emoji:"🗡️", types:["Steel","Poison"],
    base:{hp:85,atk:112,def:90,spa:72,spd:78,spe:78},
    learnset:[[1,"metal_claw"],[1,"poison_sting"],[18,"iron_tail"],[28,"sludge_bomb"],[38,"forge_strike"],[48,"toxic"],[58,"flash_cannon"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:48, expYield:212, rarity:"uncommon",
    desc:"A rusted iron spike creature coated in toxins. Its corroded exterior makes it harder to damage than pristine steel." },

  // 2-stage Normal/Wind chain: Fluffkin → Cloudvane (level 26)
  284: { id:284, name:"Fluffkin", emoji:"☁️", types:["Normal","Wind"],
    base:{hp:55,atk:48,def:50,spa:62,spd:58,spe:72},
    learnset:[[1,"tackle"],[1,"gust"],[12,"air_slash"],[22,"body_slam"],[32,"hurricane"],[42,"downdraft"],[52,"gale_cannon"],[60,"hyper_beam"]],
    evolveTo:285, evolveLevel:26, catchRate:170, expYield:72, rarity:"common",
    desc:"A fluffy cloud puff with tiny wings. Drifts on thermals and sheds soft white fur that becomes rain clouds." },

  285: { id:285, name:"Cloudvane", emoji:"🌤️", types:["Normal","Wind"],
    base:{hp:88,atk:78,def:78,spa:95,spd:90,spe:100},
    learnset:[[1,"air_slash"],[1,"body_slam"],[20,"hurricane"],[28,"gale_cannon"],[36,"downdraft"],[44,"squall_slash"],[52,"tempest_wrath"],[60,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:218, rarity:"uncommon",
    desc:"A cloud-form creature that rides jet streams. Creates weather patterns across entire regions as it travels." },

  // 3-stage Normal chain: Fuzzlet → Cuddrix → Majesticore (lv24, lv44)
  286: { id:286, name:"Fuzzlet", emoji:"🐾", types:["Normal"],
    base:{hp:50,atk:55,def:50,spa:45,spd:48,spe:65},
    learnset:[[1,"tackle"],[1,"headbutt"],[10,"body_slam"],[20,"reckless_charge"],[30,"battle_cry"],[40,"heavy_slam"],[50,"hyper_beam"]],
    evolveTo:287, evolveLevel:24, catchRate:185, expYield:65, rarity:"common",
    desc:"An extremely fluffy creature with boundless energy. Rolls into threats and bounces off harmlessly, then tries again." },

  287: { id:287, name:"Cuddrix", emoji:"🐻", types:["Normal"],
    base:{hp:78,atk:82,def:72,spa:62,spd:68,spe:78},
    learnset:[[1,"body_slam"],[1,"reckless_charge"],[18,"battle_cry"],[28,"heavy_slam"],[38,"headbutt"],[48,"iron_press"],[58,"hyper_beam"]],
    evolveTo:288, evolveLevel:44, catchRate:90, expYield:140, rarity:"uncommon",
    desc:"A bear-like powerhouse with soft fur hiding tremendous muscle. Known for unexpectedly strong hugs." },

  288: { id:288, name:"Majesticore", emoji:"🦁", types:["Normal","Psychic"],
    base:{hp:108,atk:108,def:95,spa:108,spd:108,spe:82},
    learnset:[[1,"heavy_slam"],[1,"psychic_move"],[30,"battle_cry"],[38,"reckless_charge"],[46,"psystrike"],[54,"neural_storm"],[62,"hyper_beam"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:265, rarity:"rare",
    desc:"A majestic being that has awakened psychic powers. Perfectly balanced in all attributes, a ruler among Lumos." },

  // Standalone Normal: Bouncyblob
  289: { id:289, name:"Bouncyblob", emoji:"🎱", types:["Normal"],
    base:{hp:110,atk:85,def:85,spa:85,spd:85,spe:85},
    learnset:[[1,"tackle"],[1,"body_slam"],[18,"headbutt"],[28,"reckless_charge"],[38,"heavy_slam"],[48,"battle_cry"],[58,"iron_press"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:200, rarity:"uncommon",
    desc:"A perfectly spherical blob of pure vitality. Its round body absorbs physical impacts with zero damage." },

  // Standalone Normal/Ghost: Mimiclaw (evolves in gloomy location)
  290: { id:290, name:"Mimiclaw", emoji:"🎭", types:["Normal","Ghost"],
    base:{hp:82,atk:90,def:78,spa:95,spd:85,spe:102},
    learnset:[[1,"tackle"],[1,"shadow_ball"],[15,"phantom_claw"],[25,"eclipse_shroud"],[35,"body_slam"],[45,"soul_rend"],[55,"shadow_ball"],[65,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"cobweb_gully", evolveMethod:"location", catchRate:52, expYield:212, rarity:"uncommon",
    desc:"An unsettling mimic that copies the appearance of other Lumos. Found deep in haunted gullies and ruins." },

  // 2-stage Wind chain: Breezekin → Galehorn (level 28)
  291: { id:291, name:"Breezekin", emoji:"🌬️", types:["Wind"],
    base:{hp:48,atk:52,def:45,spa:68,spd:58,spe:85},
    learnset:[[1,"gust"],[1,"air_slash"],[12,"downdraft"],[22,"hurricane"],[32,"gale_cannon"],[42,"squall_slash"],[52,"tempest_wrath"],[60,"hyper_beam"]],
    evolveTo:292, evolveLevel:28, catchRate:168, expYield:74, rarity:"common",
    desc:"A gentle breeze spirit that grows stronger in storms. Races other flying Lumos for fun." },

  292: { id:292, name:"Galehorn", emoji:"🌪️", types:["Wind","Electric"],
    base:{hp:78,atk:85,def:70,spa:108,spd:88,spe:115},
    learnset:[[1,"air_slash"],[1,"thunderbolt"],[22,"hurricane"],[30,"thunder"],[38,"tempest_wrath"],[46,"gale_cannon"],[54,"squall_slash"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A wind horn creature that channels storms. Its horn generates tornadic electrical vortexes." },

  // 3-stage Wind chain: Zephyrpuff → Stormwing → Cyclonax
  293: { id:293, name:"Zephyrpuff", emoji:"💨", types:["Wind"],
    base:{hp:42,atk:45,def:38,spa:65,spd:55,spe:90},
    learnset:[[1,"gust"],[1,"tackle"],[10,"air_slash"],[20,"downdraft"],[30,"hurricane"],[40,"gale_cannon"],[50,"squall_slash"],[60,"hyper_beam"]],
    evolveTo:294, evolveLevel:26, catchRate:175, expYield:68, rarity:"common",
    desc:"A puff of magical wind given form. Spins in circles when excited, creating tiny dust devils." },

  294: { id:294, name:"Stormwing", emoji:"🦅", types:["Wind","Dragon"],
    base:{hp:70,atk:88,def:68,spa:98,spd:80,spe:108},
    learnset:[[1,"air_slash"],[1,"dragon_breath"],[20,"hurricane"],[28,"dragon_claw"],[36,"gale_cannon"],[44,"dragon_pulse"],[52,"tempest_wrath"],[60,"hyper_beam"]],
    evolveTo:295, evolveLevel:44, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A storm-drake hybrid of wind and dragon power. Rides cyclones across entire mountain ranges." },

  295: { id:295, name:"Cyclonax", emoji:"🌀", types:["Wind","Dragon"],
    base:{hp:95,atk:108,def:90,spa:130,spd:102,spe:115},
    learnset:[[1,"hurricane"],[1,"dragon_pulse"],[30,"tempest_wrath"],[38,"dragon_dance"],[46,"gale_cannon"],[54,"outrage"],[62,"ancient_breath"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:20, expYield:272, rarity:"rare",
    desc:"A hurricane dragon of unimaginable velocity. When it flies, it creates permanent weather anomalies." },

`;

const marker = '  // ===== LEGENDARIES (IDs 314-321) =====';
if (!src.includes(marker)) {
  console.error('ERROR: Could not find insertion marker!');
  process.exit(1);
}
src = src.replace(marker, newLumos + '\n' + marker);
fs.writeFileSync(dataPath, src, 'utf8');

const ids = [281,282,283,284,285,286,287,288,289,290,291,292,293,294,295];
const lines = src.split('\n');
let ok = true;
for (const id of ids) {
  const found = lines.some(l => l.match(new RegExp(`^  ${id}: \\{ id:${id},`)));
  if (!found) { console.log(`MISSING ID ${id}`); ok = false; }
}
if (ok) console.log('All IDs 281-295 added successfully!');
