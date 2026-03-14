// ============================================================
// MONSTERIA - Game Data
// ============================================================

// TYPE EFFECTIVENESS CHART
// [attackType][defenseType] = multiplier
const TYPE_CHART = {
  Fire:     { Fire:0.5, Water:0.5, Grass:2, Electric:1, Ground:1, Wind:1, Ice:2, Dark:1, Fairy:1, Steel:2, Poison:1, Psychic:1, Dragon:0.5, Normal:1, Rock:0.5, Bug:2 },
  Water:    { Fire:2, Water:0.5, Grass:0.5, Electric:1, Ground:2, Wind:1, Ice:1, Dark:1, Fairy:1, Steel:1, Poison:1, Psychic:1, Dragon:0.5, Normal:1, Rock:2, Bug:1 },
  Grass:    { Fire:0.5, Water:2, Grass:0.5, Electric:1, Ground:2, Wind:0.5, Ice:0.5, Dark:1, Fairy:1, Steel:0.5, Poison:0.5, Psychic:1, Dragon:0.5, Normal:1, Rock:2, Bug:0.5 },
  Electric: { Fire:1, Water:2, Grass:0.5, Electric:0.5, Ground:0, Wind:2, Ice:1, Dark:1, Fairy:1, Steel:1, Poison:1, Psychic:1, Dragon:0.5, Normal:1, Rock:1, Bug:1 },
  Ground:   { Fire:2, Water:1, Grass:0.5, Electric:2, Ground:1, Wind:0, Ice:1, Dark:1, Fairy:1, Steel:2, Poison:2, Psychic:1, Dragon:1, Normal:1, Rock:2, Bug:0.5 },
  Wind:     { Fire:1, Water:1, Grass:2, Electric:0.5, Ground:1, Wind:1, Ice:1, Dark:1, Fairy:1, Steel:0.5, Poison:1, Psychic:1, Dragon:1, Normal:1, Rock:0.5, Bug:2 },
  Ice:      { Fire:0.5, Water:0.5, Grass:2, Electric:1, Ground:2, Wind:2, Ice:0.5, Dark:1, Fairy:1, Steel:0.5, Poison:1, Psychic:1, Dragon:2, Normal:1, Rock:1, Bug:1 },
  Dark:     { Fire:1, Water:1, Grass:1, Electric:1, Ground:1, Wind:1, Ice:1, Dark:0.5, Fairy:0.5, Steel:1, Poison:1, Psychic:2, Dragon:1, Normal:1, Rock:1, Bug:1 },
  Fairy:    { Fire:1, Water:1, Grass:1, Electric:1, Ground:1, Wind:1, Ice:1, Dark:2, Fairy:1, Steel:0.5, Poison:0.5, Psychic:1, Dragon:2, Normal:1, Rock:1, Bug:1 },
  Steel:    { Fire:0.5, Water:1, Grass:1, Electric:1, Ground:1, Wind:1, Ice:2, Dark:1, Fairy:2, Steel:0.5, Poison:1, Psychic:1, Dragon:1, Normal:1, Rock:2, Bug:1 },
  Poison:   { Fire:1, Water:1, Grass:2, Electric:1, Ground:0.5, Wind:1, Ice:1, Dark:1, Fairy:2, Steel:0, Poison:0.5, Psychic:1, Dragon:1, Normal:1, Rock:0.5, Bug:1 },
  Psychic:  { Fire:1, Water:1, Grass:1, Electric:1, Ground:1, Wind:1, Ice:1, Dark:0, Fairy:1, Steel:1, Poison:2, Psychic:0.5, Dragon:1, Normal:1, Rock:1, Bug:0.5 },
  Dragon:   { Fire:1, Water:1, Grass:1, Electric:1, Ground:1, Wind:1, Ice:1, Dark:1, Fairy:0, Steel:0.5, Poison:1, Psychic:1, Dragon:2, Normal:1, Rock:1, Bug:1 },
  Normal:   { Fire:1, Water:1, Grass:1, Electric:1, Ground:1, Wind:1, Ice:1, Dark:1, Fairy:1, Steel:0.5, Poison:1, Psychic:1, Dragon:1, Normal:1, Rock:0.5, Bug:1 },
  Rock:     { Fire:2, Water:0.5, Grass:1, Electric:1, Ground:0.5, Wind:2, Ice:2, Dark:1, Fairy:1, Steel:0.5, Poison:1, Psychic:1, Dragon:1, Normal:1, Rock:1, Bug:2 },
  Bug:      { Fire:0.5, Water:1, Grass:2, Electric:1, Ground:0.5, Wind:0.5, Ice:1, Dark:2, Fairy:0.5, Steel:0.5, Poison:0.5, Psychic:2, Dragon:1, Normal:1, Rock:1, Bug:1 }
};

function getTypeEffectiveness(moveType, defenderTypes) {
  let mult = 1;
  for (const dt of defenderTypes) {
    if (TYPE_CHART[moveType] && TYPE_CHART[moveType][dt] !== undefined) {
      mult *= TYPE_CHART[moveType][dt];
    }
  }
  return mult;
}

// ============================================================
// MOVES DATA
// ============================================================
const MOVES_DATA = {
  // --- Normal ---
  tackle:       { name:"Tackle",        type:"Normal",   power:40,  acc:100, pp:35, cat:"physical", effect:null,        ec:0,   desc:"A basic tackle attack." },
  scratch:      { name:"Scratch",       type:"Normal",   power:40,  acc:100, pp:35, cat:"physical", effect:null,        ec:0,   desc:"Scratches the foe with sharp claws." },
  headbutt:     { name:"Headbutt",      type:"Normal",   power:70,  acc:100, pp:15, cat:"physical", effect:"flinch",    ec:30,  desc:"A forceful headbutt that may cause flinching." },
  body_slam:    { name:"Body Slam",     type:"Normal",   power:85,  acc:100, pp:15, cat:"physical", effect:"paralyze",  ec:30,  desc:"Slams the foe with a massive body. May paralyze." },
  hyper_beam:   { name:"Hyper Beam",    type:"Normal",   power:150, acc:90,  pp:5,  cat:"special",  effect:"recharge",  ec:100, desc:"A powerful beam. Must recharge next turn." },
  quick_attack: { name:"Quick Attack",  type:"Normal",   power:40,  acc:100, pp:30, cat:"physical", effect:"priority",  ec:0,   desc:"Attacks first with blinding speed." },
  growl:        { name:"Growl",         type:"Normal",   power:0,   acc:100, pp:40, cat:"status",   effect:"atkdown",   ec:100, desc:"Lowers the foe's Attack." },
  tail_whip:    { name:"Tail Whip",     type:"Normal",   power:0,   acc:100, pp:30, cat:"status",   effect:"defdown",   ec:100, desc:"Lowers the foe's Defense." },
  leer:         { name:"Leer",          type:"Normal",   power:0,   acc:100, pp:30, cat:"status",   effect:"defdown",   ec:100, desc:"Menacing glare lowers the foe's Defense." },
  recover:      { name:"Recover",       type:"Normal",   power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Restores up to half the user's max HP." },
  swords_dance: { name:"Swords Dance",  type:"Normal",   power:0,   acc:100, pp:20, cat:"status",   effect:"atkup2",    ec:100, desc:"Raises the user's Attack by 2 stages." },
  harden:       { name:"Harden",        type:"Normal",   power:0,   acc:100, pp:30, cat:"status",   effect:"defup",     ec:100, desc:"Stiffens the body to raise Defense." },
  // --- Fire ---
  ember:        { name:"Ember",         type:"Fire",     power:40,  acc:100, pp:25, cat:"special",  effect:"burn",      ec:10,  desc:"A weak fire attack that may burn." },
  flame_fang:   { name:"Flame Fang",    type:"Fire",     power:65,  acc:95,  pp:15, cat:"physical", effect:"burn",      ec:10,  desc:"Bites with flaming fangs. May burn." },
  flamethrower: { name:"Flamethrower",  type:"Fire",     power:90,  acc:100, pp:15, cat:"special",  effect:"burn",      ec:10,  desc:"Shoots a stream of intense fire. May burn." },
  fire_blast:   { name:"Fire Blast",    type:"Fire",     power:110, acc:85,  pp:5,  cat:"special",  effect:"burn",      ec:10,  desc:"A massive fireball. May burn the target." },
  heat_wave:    { name:"Heat Wave",     type:"Fire",     power:95,  acc:90,  pp:10, cat:"special",  effect:"burn",      ec:10,  desc:"Exhales a wave of scorching heat." },
  inferno:      { name:"Inferno",       type:"Fire",     power:100, acc:85,  pp:5,  cat:"special",  effect:"burn",      ec:100, desc:"A raging inferno that always burns." },
  // --- Water ---
  water_gun:    { name:"Water Gun",     type:"Water",    power:40,  acc:100, pp:25, cat:"special",  effect:null,        ec:0,   desc:"Squirts water at the foe." },
  aqua_tail:    { name:"Aqua Tail",     type:"Water",    power:90,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Attacks with a powerful water tail." },
  surf:         { name:"Surf",          type:"Water",    power:90,  acc:100, pp:15, cat:"special",  effect:null,        ec:0,   desc:"A powerful wave crashes over the foe." },
  hydro_pump:   { name:"Hydro Pump",    type:"Water",    power:110, acc:80,  pp:5,  cat:"special",  effect:null,        ec:0,   desc:"Blasts the foe with a powerful water jet." },
  bubble_beam:  { name:"Bubble Beam",   type:"Water",    power:65,  acc:100, pp:20, cat:"special",  effect:"spedown",   ec:10,  desc:"Shoots bubbles that may reduce Speed." },
  // --- Grass ---
  vine_whip:    { name:"Vine Whip",     type:"Grass",    power:45,  acc:100, pp:25, cat:"physical", effect:null,        ec:0,   desc:"Strikes with long, slender vines." },
  razor_leaf:   { name:"Razor Leaf",    type:"Grass",    power:55,  acc:95,  pp:25, cat:"physical", effect:"crit",      ec:100, desc:"Slices with razor-edged leaves. High crit." },
  seed_bomb:    { name:"Seed Bomb",     type:"Grass",    power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Drops a giant seed bomb on the foe." },
  energy_ball:  { name:"Energy Ball",   type:"Grass",    power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"A ball of energy drawn from nature." },
  petal_blitz:  { name:"Petal Blitz",   type:"Grass",    power:100, acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Strikes with a furious petal storm." },
  sleep_powder: { name:"Sleep Powder",  type:"Grass",    power:0,   acc:75,  pp:15, cat:"status",   effect:"sleep",     ec:100, desc:"Scatters a powder that induces sleep." },
  // --- Electric ---
  thunder_shock:{ name:"Thunder Shock", type:"Electric", power:40,  acc:100, pp:30, cat:"special",  effect:"paralyze",  ec:10,  desc:"A jolt of electricity. May paralyze." },
  thunderbolt:  { name:"Thunderbolt",   type:"Electric", power:90,  acc:100, pp:15, cat:"special",  effect:"paralyze",  ec:10,  desc:"A strong thunderbolt. May paralyze." },
  thunder:      { name:"Thunder",       type:"Electric", power:110, acc:70,  pp:10, cat:"special",  effect:"paralyze",  ec:30,  desc:"A massive thunderstrike. May paralyze." },
  thunder_wave: { name:"Thunder Wave",  type:"Electric", power:0,   acc:90,  pp:20, cat:"status",   effect:"paralyze",  ec:100, desc:"A weak electrical charge that paralyzes." },
  spark:        { name:"Spark",         type:"Electric", power:65,  acc:100, pp:20, cat:"physical", effect:"paralyze",  ec:30,  desc:"Electric tackle. May paralyze." },
  // --- Ground ---
  mud_shot:     { name:"Mud Shot",      type:"Ground",   power:55,  acc:95,  pp:15, cat:"special",  effect:"spedown",   ec:100, desc:"Hurls mud at the foe, lowering Speed." },
  earthquake:   { name:"Earthquake",    type:"Ground",   power:100, acc:100, pp:10, cat:"physical", effect:null,        ec:0,   desc:"A massive earthquake rattles the field." },
  earth_power:  { name:"Earth Power",   type:"Ground",   power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"The ground heaves beneath the foe." },
  // --- Wind ---
  gust:         { name:"Gust",          type:"Wind",     power:40,  acc:100, pp:35, cat:"special",  effect:null,        ec:0,   desc:"Blows the foe with a gust of wind." },
  air_slash:    { name:"Air Slash",     type:"Wind",     power:75,  acc:95,  pp:15, cat:"special",  effect:"flinch",    ec:30,  desc:"Slices with a blade of air. May flinch." },
  hurricane:    { name:"Hurricane",     type:"Wind",     power:110, acc:70,  pp:10, cat:"special",  effect:"confuse",   ec:30,  desc:"Slams the foe into a violent hurricane." },
  wing_attack:  { name:"Wing Attack",   type:"Wind",     power:60,  acc:100, pp:35, cat:"physical", effect:null,        ec:0,   desc:"Strikes with powerful wings." },
  // --- Ice ---
  powder_snow:  { name:"Powder Snow",   type:"Ice",      power:40,  acc:100, pp:25, cat:"special",  effect:"freeze",    ec:10,  desc:"Pelts the foe with a hail of snow." },
  ice_beam:     { name:"Ice Beam",      type:"Ice",      power:90,  acc:100, pp:10, cat:"special",  effect:"freeze",    ec:10,  desc:"Fires a beam of ice. May freeze." },
  blizzard:     { name:"Blizzard",      type:"Ice",      power:110, acc:70,  pp:5,  cat:"special",  effect:"freeze",    ec:10,  desc:"A howling blizzard. May freeze." },
  ice_punch:    { name:"Ice Punch",     type:"Ice",      power:75,  acc:100, pp:15, cat:"physical", effect:"freeze",    ec:10,  desc:"A punch with an icy fist. May freeze." },
  icicle_crash: { name:"Icicle Crash",  type:"Ice",      power:85,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Drops icicles on the foe. May flinch." },
  // --- Dark ---
  bite:         { name:"Bite",          type:"Dark",     power:60,  acc:100, pp:25, cat:"physical", effect:"flinch",    ec:30,  desc:"Bites with dark power. May cause flinching." },
  crunch:       { name:"Crunch",        type:"Dark",     power:80,  acc:100, pp:15, cat:"physical", effect:"defdown",   ec:20,  desc:"Crunches with dark fangs. May lower Defense." },
  shadow_ball:  { name:"Shadow Ball",   type:"Dark",     power:80,  acc:100, pp:15, cat:"special",  effect:"spdefdown", ec:20,  desc:"Hurls a shadowy blob. May lower Sp.Def." },
  night_slash:  { name:"Night Slash",   type:"Dark",     power:70,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes in the dark. High critical rate." },
  dark_pulse:   { name:"Dark Pulse",    type:"Dark",     power:80,  acc:100, pp:15, cat:"special",  effect:"flinch",    ec:20,  desc:"Fires pulses of dark energy." },
  // --- Fairy ---
  fairy_wind:   { name:"Fairy Wind",    type:"Fairy",    power:40,  acc:100, pp:30, cat:"special",  effect:null,        ec:0,   desc:"Stirs up a fairy wind to strike." },
  moonblast:    { name:"Moonblast",     type:"Fairy",    power:95,  acc:100, pp:15, cat:"special",  effect:"spatkdown", ec:30,  desc:"Attacks using moonlight. May lower Sp.Atk." },
  dazzling_gleam:{ name:"Dazzling Gleam",type:"Fairy",  power:80,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Emits a powerful flash of light." },
  sweet_kiss:   { name:"Sweet Kiss",    type:"Fairy",    power:0,   acc:75,  pp:10, cat:"status",   effect:"confuse",   ec:100, desc:"An angel's kiss that confuses the foe." },
  // --- Steel ---
  steel_wing:   { name:"Steel Wing",    type:"Steel",    power:70,  acc:90,  pp:25, cat:"physical", effect:"defup",     ec:10,  desc:"Strikes with steel wings. May raise Defense." },
  iron_tail:    { name:"Iron Tail",     type:"Steel",    power:100, acc:75,  pp:15, cat:"physical", effect:"defdown",   ec:30,  desc:"Slams with a steel-hard tail. May lower Defense." },
  flash_cannon: { name:"Flash Cannon",  type:"Steel",    power:80,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"Fires a flash of steel-colored light." },
  metal_claw:   { name:"Metal Claw",    type:"Steel",    power:50,  acc:95,  pp:35, cat:"physical", effect:"atkup",     ec:10,  desc:"Slashes with steel claws. May raise Attack." },
  // --- Poison ---
  poison_sting: { name:"Poison Sting",  type:"Poison",   power:15,  acc:100, pp:35, cat:"physical", effect:"poison",    ec:30,  desc:"Stings with a poisonous stinger." },
  sludge_bomb:  { name:"Sludge Bomb",   type:"Poison",   power:90,  acc:100, pp:10, cat:"special",  effect:"poison",    ec:30,  desc:"Hurls a sludge bomb. May poison." },
  toxic:        { name:"Toxic",         type:"Poison",   power:0,   acc:90,  pp:10, cat:"status",   effect:"badpoison", ec:100, desc:"Badly poisons the foe. Damage worsens each turn." },
  venoshock:    { name:"Venoshock",     type:"Poison",   power:65,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Doubles damage if target is poisoned." },
  // --- Psychic ---
  confusion:    { name:"Confusion",     type:"Psychic",  power:50,  acc:100, pp:25, cat:"special",  effect:"confuse",   ec:10,  desc:"A telekinetic attack. May confuse." },
  psybeam:      { name:"Psybeam",       type:"Psychic",  power:65,  acc:100, pp:20, cat:"special",  effect:"confuse",   ec:10,  desc:"Shoots a peculiar ray. May confuse." },
  psychic_move: { name:"Psychic",       type:"Psychic",  power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"A powerful psychic wave. May lower Sp.Def." },
  psystrike:    { name:"Psystrike",     type:"Psychic",  power:100, acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Materializes psychic power to attack." },
  calm_mind:    { name:"Calm Mind",     type:"Psychic",  power:0,   acc:100, pp:20, cat:"status",   effect:"calmup",    ec:100, desc:"Raises Sp.Atk and Sp.Def by 1 stage." },
  // --- Dragon ---
  dragon_breath:{ name:"Dragon Breath", type:"Dragon",   power:60,  acc:100, pp:20, cat:"special",  effect:"paralyze",  ec:30,  desc:"Exhales a dragon's breath. May paralyze." },
  dragon_claw:  { name:"Dragon Claw",   type:"Dragon",   power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Slashes with razor-sharp dragon claws." },
  dragon_pulse: { name:"Dragon Pulse",  type:"Dragon",   power:85,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Fires a shockwave of dragon energy." },
  outrage:      { name:"Outrage",       type:"Dragon",   power:120, acc:100, pp:10, cat:"physical", effect:"confuse",   ec:100, desc:"A 2-3 turn rampage. Confuses user after." },
  dragon_dance: { name:"Dragon Dance",  type:"Dragon",   power:0,   acc:100, pp:20, cat:"status",   effect:"dragondance",ec:100,desc:"A ritualistic dance that raises Atk and Speed." },
  // --- Rock ---
  rock_throw:   { name:"Rock Throw",    type:"Rock",     power:50,  acc:90,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Hurls a small rock at the foe." },
  rock_slide:   { name:"Rock Slide",    type:"Rock",     power:75,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Large boulders fall on the foe. May flinch." },
  stone_edge:   { name:"Stone Edge",    type:"Rock",     power:100, acc:80,  pp:5,  cat:"physical", effect:"crit",      ec:100, desc:"Stabs with sharp stones. High critical." },
  // --- Bug ---
  bug_bite:     { name:"Bug Bite",      type:"Bug",      power:60,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"Bites the foe with bug mandibles." },
  bug_buzz:     { name:"Bug Buzz",      type:"Bug",      power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"Emits a harsh buzzing sound." },
  x_scissor:    { name:"X-Scissor",     type:"Bug",      power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Slashes the foe in an X shape." },
  string_shot:  { name:"String Shot",   type:"Bug",      power:0,   acc:95,  pp:40, cat:"status",   effect:"spedown2",  ec:100, desc:"Binds the foe with string, slowing them." }
};


// ============================================================
// MONSTERS DATA (107 Monsters)
// ============================================================
const MONSTERS_DATA = {
  // ===== FIRE STARTERS + FIRE LINE =====
  1: { id:1, name:"Emberpaw",    emoji:"🦊", types:["Fire"],
    base:{hp:45,atk:52,def:43,spa:60,spd:50,spe:65},
    learnset:[[1,"tackle"],[1,"growl"],[4,"ember"],[8,"quick_attack"],[13,"flame_fang"],[19,"swords_dance"],[27,"flamethrower"],[38,"fire_blast"]],
    evolveTo:2, evolveLevel:16, catchRate:45, expYield:62, rarity:"starter",
    desc:"A fire fox cub. Its tail flame glows brighter when its spirit is high." },

  2: { id:2, name:"Foxblaze",    emoji:"🦊", types:["Fire"],
    base:{hp:58,atk:64,def:58,spa:80,spd:65,spe:80},
    learnset:[[1,"tackle"],[1,"ember"],[1,"quick_attack"],[16,"flame_fang"],[22,"flamethrower"],[30,"heat_wave"],[40,"fire_blast"],[50,"inferno"]],
    evolveTo:3, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A blazing fox with a fiery mane. Rivals fear its flaming charge." },

  3: { id:3, name:"Infernovix",  emoji:"🐲", types:["Fire","Dragon"],
    base:{hp:78,atk:84,def:78,spa:109,spd:85,spe:100},
    learnset:[[1,"flame_fang"],[1,"flamethrower"],[1,"dragon_breath"],[36,"heat_wave"],[45,"dragon_claw"],[55,"fire_blast"],[65,"outrage"],[75,"inferno"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"A terrifying dragon-fox hybrid. Its volcanic roar can be heard for miles." },

  // Water Starters
  4: { id:4, name:"Dewdrop",     emoji:"💧", types:["Water"],
    base:{hp:44,atk:48,def:65,spa:50,spd:64,spe:43},
    learnset:[[1,"tackle"],[1,"tail_whip"],[4,"water_gun"],[8,"bubble_beam"],[13,"aqua_tail"],[19,"recover"],[27,"surf"],[38,"hydro_pump"]],
    evolveTo:5, evolveLevel:16, catchRate:45, expYield:59, rarity:"starter",
    desc:"A water sprite that lives near ponds. Its skin is always cool and moist." },

  5: { id:5, name:"Tidaling",    emoji:"🐍", types:["Water"],
    base:{hp:59,atk:63,def:80,spa:65,spd:80,spe:58},
    learnset:[[1,"water_gun"],[1,"tail_whip"],[16,"bubble_beam"],[22,"surf"],[30,"aqua_tail"],[40,"hydro_pump"],[50,"recover"]],
    evolveTo:6, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A serpentine water monster. Glides through water with incredible grace." },

  6: { id:6, name:"Oceanoth",    emoji:"🐲", types:["Water","Dragon"],
    base:{hp:79,atk:83,def:100,spa:85,spd:105,spe:78},
    learnset:[[1,"surf"],[1,"aqua_tail"],[1,"dragon_breath"],[36,"hydro_pump"],[45,"dragon_claw"],[55,"dragon_pulse"],[65,"outrage"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"An oceanic behemoth said to rule the seas. Its roar causes tidal waves." },

  // Grass Starters
  7: { id:7, name:"Sproutling",  emoji:"🌱", types:["Grass"],
    base:{hp:45,atk:49,def:49,spa:65,spd:65,spe:45},
    learnset:[[1,"tackle"],[1,"growl"],[4,"vine_whip"],[8,"razor_leaf"],[13,"seed_bomb"],[19,"swords_dance"],[27,"energy_ball"],[38,"petal_blitz"]],
    evolveTo:8, evolveLevel:16, catchRate:45, expYield:64, rarity:"starter",
    desc:"A little plant seedling that walks on root-legs. Very curious and brave." },

  8: { id:8, name:"Thornback",   emoji:"🦕", types:["Grass"],
    base:{hp:60,atk:62,def:63,spa:80,spd:80,spe:60},
    learnset:[[1,"vine_whip"],[1,"razor_leaf"],[16,"seed_bomb"],[22,"energy_ball"],[30,"petal_blitz"],[40,"swords_dance"],[50,"petal_blitz"]],
    evolveTo:9, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A thorny dinosaur with bark-like skin. Each spine is razor sharp." },

  9: { id:9, name:"Bloomlord",   emoji:"🌸", types:["Grass","Fairy"],
    base:{hp:80,atk:82,def:83,spa:100,spd:100,spe:80},
    learnset:[[1,"seed_bomb"],[1,"energy_ball"],[1,"fairy_wind"],[36,"petal_blitz"],[45,"moonblast"],[55,"dazzling_gleam"],[65,"petal_blitz"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"A majestic flower guardian. Its petals shimmer with magical energy." },

  // ===== ADDITIONAL FIRE =====
  10: { id:10, name:"Cinderling",  emoji:"🐛", types:["Fire","Bug"],
    base:{hp:45,atk:60,def:40,spa:40,spd:35,spe:55},
    learnset:[[1,"tackle"],[1,"ember"],[8,"bug_bite"],[15,"flame_fang"],[22,"x_scissor"]],
    evolveTo:11, evolveLevel:18, catchRate:255, expYield:56, rarity:"common",
    desc:"A fire beetle larva. Leaves scorch marks wherever it walks." },

  11: { id:11, name:"Scorchwing",  emoji:"🦋", types:["Fire","Wind"],
    base:{hp:60,atk:90,def:55,spa:70,spd:60,spe:100},
    learnset:[[1,"ember"],[1,"bug_bite"],[18,"wing_attack"],[26,"flame_fang"],[34,"heat_wave"],[42,"air_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:75, expYield:158, rarity:"uncommon",
    desc:"A blazing moth that flies at incredible speed. Its wings radiate fierce heat." },

  12: { id:12, name:"Lavabull",    emoji:"🐂", types:["Fire"],
    base:{hp:80,atk:85,def:70,spa:60,spd:55,spe:45},
    learnset:[[1,"tackle"],[1,"ember"],[12,"headbutt"],[20,"flamethrower"],[30,"body_slam"],[40,"fire_blast"]],
    evolveTo:13, evolveLevel:22, catchRate:120, expYield:112, rarity:"common",
    desc:"A powerful bull with lava dripping from its hooves. Incredibly stubborn." },

  13: { id:13, name:"Magmacow",    emoji:"🐃", types:["Fire","Rock"],
    base:{hp:105,atk:110,def:95,spa:80,spd:75,spe:50},
    learnset:[[1,"headbutt"],[1,"ember"],[22,"flamethrower"],[32,"rock_slide"],[42,"fire_blast"],[52,"stone_edge"],[60,"heat_wave"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:235, rarity:"uncommon",
    desc:"A volcanic beast covered in hardened magma. Nothing can stop its charge." },

  14: { id:14, name:"Emberworm",   emoji:"🐍", types:["Fire"],
    base:{hp:40,atk:50,def:38,spa:55,spd:42,spe:60},
    learnset:[[1,"tackle"],[1,"ember"],[9,"quick_attack"],[17,"flamethrower"]],
    evolveTo:15, evolveLevel:20, catchRate:200, expYield:65, rarity:"common",
    desc:"A small worm that breathes tiny flames. Very shy and avoids conflict." },

  15: { id:15, name:"Flamewyrm",   emoji:"🐉", types:["Fire","Dragon"],
    base:{hp:72,atk:92,def:65,spa:90,spd:70,spe:85},
    learnset:[[1,"ember"],[1,"dragon_breath"],[20,"flamethrower"],[28,"dragon_claw"],[38,"heat_wave"],[48,"outrage"],[56,"inferno"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:198, rarity:"uncommon",
    desc:"A serpentine fire dragon. Coils around prey before unleashing flame." },

  // ===== ADDITIONAL WATER =====
  16: { id:16, name:"Bubblecrab",  emoji:"🦀", types:["Water"],
    base:{hp:55,atk:64,def:80,spa:45,spd:55,spe:40},
    learnset:[[1,"scratch"],[1,"water_gun"],[10,"bubble_beam"],[18,"harden"],[26,"aqua_tail"],[34,"surf"]],
    evolveTo:17, evolveLevel:20, catchRate:190, expYield:71, rarity:"common",
    desc:"A crab that blows iridescent bubbles. Very territorial near shorelines." },

  17: { id:17, name:"Waveclaw",    emoji:"🦞", types:["Water","Rock"],
    base:{hp:75,atk:95,def:110,spa:60,spd:70,spe:45},
    learnset:[[1,"scratch"],[1,"water_gun"],[20,"aqua_tail"],[28,"rock_slide"],[36,"surf"],[44,"stone_edge"],[52,"hydro_pump"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:188, rarity:"uncommon",
    desc:"A massive sea claw with rock-hard shell. Few can match its raw strength." },

  18: { id:18, name:"Frosteel",    emoji:"🦭", types:["Ice","Water"],
    base:{hp:65,atk:55,def:60,spa:65,spd:70,spe:45},
    learnset:[[1,"tackle"],[1,"powder_snow"],[10,"water_gun"],[18,"ice_beam"],[26,"aqua_tail"],[34,"blizzard"]],
    evolveTo:19, evolveLevel:28, catchRate:120, expYield:91, rarity:"common",
    desc:"An adorable ice seal. Its smooth skin can withstand arctic temperatures." },

  19: { id:19, name:"Glaciaseal",  emoji:"🦭", types:["Ice","Water"],
    base:{hp:90,atk:75,def:90,spa:95,spd:105,spe:65},
    learnset:[[1,"powder_snow"],[1,"water_gun"],[28,"ice_beam"],[36,"surf"],[44,"blizzard"],[52,"hydro_pump"],[60,"icicle_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:217, rarity:"uncommon",
    desc:"A regal glacial seal. It can freeze oceans with a single breath." },

  20: { id:20, name:"Coralfish",   emoji:"🐠", types:["Water"],
    base:{hp:45,atk:40,def:50,spa:65,spd:55,spe:60},
    learnset:[[1,"tackle"],[1,"water_gun"],[9,"bubble_beam"],[17,"sweet_kiss"],[25,"surf"]],
    evolveTo:21, evolveLevel:25, catchRate:220, expYield:72, rarity:"common",
    desc:"A dazzling coral fish with rainbow fins. Lures prey with its bright colors." },

  21: { id:21, name:"Reefking",    emoji:"🐡", types:["Water"],
    base:{hp:65,atk:60,def:70,spa:95,spd:85,spe:75},
    learnset:[[1,"water_gun"],[1,"bubble_beam"],[25,"surf"],[33,"hydro_pump"],[41,"dazzling_gleam"],[49,"moonblast"]],
    evolveTo:null, evolveLevel:null, catchRate:70, expYield:184, rarity:"uncommon",
    desc:"A majestic reef king with jewel-like scales. Commands schools of fish." },

  // ===== ADDITIONAL GRASS =====
  22: { id:22, name:"Mushrump",    emoji:"🍄", types:["Grass","Poison"],
    base:{hp:60,atk:62,def:55,spa:70,spd:60,spe:35},
    learnset:[[1,"tackle"],[1,"vine_whip"],[8,"poison_sting"],[16,"energy_ball"],[24,"sludge_bomb"],[32,"spore_blast"]],
    evolveTo:23, evolveLevel:25, catchRate:135, expYield:98, rarity:"common",
    desc:"A mushroom monster that releases paralyzing spores when threatened." },

  23: { id:23, name:"Sporeking",   emoji:"🍄", types:["Grass","Poison"],
    base:{hp:85,atk:85,def:75,spa:100,spd:80,spe:50},
    learnset:[[1,"energy_ball"],[1,"sludge_bomb"],[25,"petal_blitz"],[33,"toxic"],[41,"venoshock"],[49,"seed_bomb"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:209, rarity:"uncommon",
    desc:"A spore king that commands an army of fungal creatures. Reeks of poison." },

  24: { id:24, name:"Fernwhip",    emoji:"🌿", types:["Grass"],
    base:{hp:40,atk:60,def:45,spa:50,spd:45,spe:70},
    learnset:[[1,"vine_whip"],[1,"leer"],[8,"razor_leaf"],[16,"seed_bomb"],[24,"energy_ball"]],
    evolveTo:25, evolveLevel:22, catchRate:180, expYield:78, rarity:"common",
    desc:"A quick, vine-like snake that lashes with razor-edged leaves." },

  25: { id:25, name:"Rootstrider", emoji:"🌳", types:["Grass","Ground"],
    base:{hp:70,atk:90,def:80,spa:75,spd:70,spe:60},
    learnset:[[1,"razor_leaf"],[1,"seed_bomb"],[22,"energy_ball"],[30,"earthquake"],[38,"petal_blitz"],[46,"earth_power"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:195, rarity:"uncommon",
    desc:"A root elemental that walks on massive tree roots. Ancient and powerful." },

  26: { id:26, name:"Seedpod",     emoji:"🫘", types:["Grass"],
    base:{hp:40,atk:35,def:35,spa:50,spd:55,spe:50},
    learnset:[[1,"tackle"],[1,"vine_whip"],[10,"energy_ball"],[18,"sleep_powder"],[26,"seed_bomb"]],
    evolveTo:27, evolveLevel:18, catchRate:255, expYield:58, rarity:"common",
    desc:"A living seed pod that rolls around. Harmless but quick to flee." },

  27: { id:27, name:"Bushbear",    emoji:"🐻", types:["Grass"],
    base:{hp:80,atk:85,def:65,spa:75,spd:65,spe:55},
    learnset:[[1,"tackle"],[1,"vine_whip"],[18,"seed_bomb"],[26,"energy_ball"],[34,"petal_blitz"],[42,"body_slam"],[50,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:75, expYield:186, rarity:"uncommon",
    desc:"A bear covered in living vegetation. Gentle unless its forest is threatened." },

  // ===== ELECTRIC =====
  28: { id:28, name:"Sparklet",    emoji:"🐭", types:["Electric"],
    base:{hp:35,atk:55,def:40,spa:50,spd:50,spe:90},
    learnset:[[1,"scratch"],[1,"thunder_shock"],[8,"quick_attack"],[16,"spark"],[22,"thunderbolt"],[30,"thunder_wave"],[38,"thunder"]],
    evolveTo:29, evolveLevel:20, catchRate:190, expYield:82, rarity:"common",
    desc:"An electric mouse that crackles with static. Can shock with a touch." },

  29: { id:29, name:"Boltmane",    emoji:"🐴", types:["Electric"],
    base:{hp:65,atk:85,def:60,spa:90,spd:70,spe:110},
    learnset:[[1,"thunder_shock"],[1,"quick_attack"],[20,"spark"],[28,"thunderbolt"],[36,"thunder"],[44,"body_slam"],[52,"thunder"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:200, rarity:"uncommon",
    desc:"An electric horse that gallops faster than lightning. Its mane crackles." },

  30: { id:30, name:"Zapbug",      emoji:"🐞", types:["Electric","Bug"],
    base:{hp:40,atk:45,def:45,spa:55,spd:40,spe:65},
    learnset:[[1,"bug_bite"],[1,"thunder_shock"],[10,"spark"],[18,"string_shot"],[26,"thunderbolt"],[34,"bug_buzz"]],
    evolveTo:31, evolveLevel:22, catchRate:200, expYield:74, rarity:"common",
    desc:"An electric beetle that emits charged buzzing sounds. Very energetic." },

  31: { id:31, name:"Thunderfly",  emoji:"🦟", types:["Electric","Bug"],
    base:{hp:60,atk:70,def:55,spa:85,spd:65,spe:105},
    learnset:[[1,"thunder_shock"],[1,"bug_bite"],[22,"thunderbolt"],[30,"bug_buzz"],[38,"thunder"],[46,"x_scissor"]],
    evolveTo:null, evolveLevel:null, catchRate:75, expYield:180, rarity:"uncommon",
    desc:"A dragonfly of electricity. Moves so fast it leaves lightning trails behind." },

  32: { id:32, name:"Voltfin",     emoji:"🐟", types:["Electric","Water"],
    base:{hp:55,atk:50,def:50,spa:65,spd:55,spe:75},
    learnset:[[1,"water_gun"],[1,"thunder_shock"],[12,"spark"],[20,"bubble_beam"],[28,"thunderbolt"],[36,"surf"]],
    evolveTo:33, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"An electric fish that shocks prey in shallow water. Glows when excited." },

  33: { id:33, name:"Surgeeel",    emoji:"🐡", types:["Electric","Water"],
    base:{hp:75,atk:70,def:65,spa:95,spd:80,spe:100},
    learnset:[[1,"thunder_shock"],[1,"water_gun"],[28,"thunderbolt"],[36,"surf"],[44,"thunder"],[52,"hydro_pump"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:205, rarity:"uncommon",
    desc:"A massive electric eel that can power a city with its discharge." },

  34: { id:34, name:"Stormchick",  emoji:"🐦", types:["Electric","Wind"],
    base:{hp:45,atk:50,def:45,spa:60,spd:50,spe:80},
    learnset:[[1,"gust"],[1,"thunder_shock"],[10,"wing_attack"],[18,"thunderbolt"],[26,"air_slash"],[34,"thunder"]],
    evolveTo:null, evolveLevel:null, catchRate:150, expYield:100, rarity:"common",
    desc:"A little bird of storms. Rides thunderclouds and harnesses lightning." },

  // ===== GROUND =====
  35: { id:35, name:"Dirtpup",     emoji:"🐶", types:["Ground"],
    base:{hp:55,atk:70,def:55,spa:40,spd:40,spe:50},
    learnset:[[1,"scratch"],[1,"growl"],[8,"mud_shot"],[16,"headbutt"],[24,"earthquake"],[32,"earth_power"],[40,"body_slam"]],
    evolveTo:36, evolveLevel:25, catchRate:160, expYield:88, rarity:"common",
    desc:"An earth puppy that loves to dig. Its powerful paws can tunnel through rock." },

  36: { id:36, name:"Terrahound",  emoji:"🐕", types:["Ground","Rock"],
    base:{hp:85,atk:100,def:85,spa:55,spd:65,spe:65},
    learnset:[[1,"mud_shot"],[1,"headbutt"],[25,"earthquake"],[33,"rock_slide"],[41,"earth_power"],[49,"stone_edge"],[57,"body_slam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:218, rarity:"uncommon",
    desc:"A terrifying earth hound. Its bark triggers small tremors." },

  37: { id:37, name:"Sandscorp",   emoji:"🦂", types:["Ground","Poison"],
    base:{hp:50,atk:65,def:50,spa:55,spd:55,spe:60},
    learnset:[[1,"scratch"],[1,"poison_sting"],[10,"mud_shot"],[18,"venoshock"],[26,"earthquake"],[34,"sludge_bomb"],[42,"toxic"]],
    evolveTo:38, evolveLevel:30, catchRate:100, expYield:95, rarity:"common",
    desc:"A desert scorpion with a venomous stinger. Buries itself in sand to ambush." },

  38: { id:38, name:"Venomscorp",  emoji:"🦂", types:["Ground","Poison"],
    base:{hp:70,atk:95,def:70,spa:80,spd:80,spe:75},
    learnset:[[1,"poison_sting"],[1,"mud_shot"],[30,"sludge_bomb"],[38,"earthquake"],[46,"toxic"],[54,"venoshock"],[62,"earth_power"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:213, rarity:"uncommon",
    desc:"A great venom scorpion. Its tail sting causes hallucinations in victims." },

  39: { id:39, name:"Mudrake",     emoji:"🐊", types:["Ground","Water"],
    base:{hp:60,atk:60,def:55,spa:55,spd:50,spe:40},
    learnset:[[1,"scratch"],[1,"mud_shot"],[10,"water_gun"],[18,"bubble_beam"],[26,"earthquake"],[34,"surf"]],
    evolveTo:40, evolveLevel:22, catchRate:140, expYield:88, rarity:"common",
    desc:"A mud-crawling amphibian. Slides through swamps with ease." },

  40: { id:40, name:"Siltbeast",   emoji:"🐊", types:["Ground","Water"],
    base:{hp:90,atk:85,def:80,spa:75,spd:80,spe:55},
    learnset:[[1,"mud_shot"],[1,"water_gun"],[22,"earthquake"],[30,"surf"],[38,"earth_power"],[46,"hydro_pump"],[54,"body_slam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A massive silt beast that haunts murky river deltas. Ancient and powerful." },

  // ===== WIND =====
  41: { id:41, name:"Breezekit",   emoji:"🐱", types:["Wind"],
    base:{hp:40,atk:45,def:40,spa:55,spd:45,spe:75},
    learnset:[[1,"scratch"],[1,"gust"],[8,"quick_attack"],[16,"wing_attack"],[24,"air_slash"],[32,"hurricane"]],
    evolveTo:42, evolveLevel:22, catchRate:200, expYield:70, rarity:"common",
    desc:"A light-footed wind kitten. Jumps and glides on invisible air currents." },

  42: { id:42, name:"Galemane",    emoji:"🦁", types:["Wind","Electric"],
    base:{hp:70,atk:85,def:65,spa:80,spd:70,spe:100},
    learnset:[[1,"gust"],[1,"thunder_shock"],[22,"wing_attack"],[30,"thunderbolt"],[38,"air_slash"],[46,"hurricane"],[54,"thunder"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:210, rarity:"uncommon",
    desc:"A majestic wind lion whose mane crackles with electric charge during storms." },

  43: { id:43, name:"Draftfinch",  emoji:"🐦", types:["Wind","Normal"],
    base:{hp:40,atk:45,def:40,spa:40,spd:40,spe:70},
    learnset:[[1,"tackle"],[1,"gust"],[8,"quick_attack"],[16,"wing_attack"],[24,"air_slash"],[32,"body_slam"]],
    evolveTo:44, evolveLevel:20, catchRate:230, expYield:65, rarity:"common",
    desc:"A common draft finch that rides air currents effortlessly." },

  44: { id:44, name:"Cyclobird",   emoji:"🦅", types:["Wind"],
    base:{hp:65,atk:90,def:65,spa:75,spd:70,spe:110},
    learnset:[[1,"gust"],[1,"wing_attack"],[20,"air_slash"],[28,"hurricane"],[36,"steel_wing"],[44,"body_slam"]],
    evolveTo:null, evolveLevel:null, catchRate:65, expYield:195, rarity:"uncommon",
    desc:"A great cyclone eagle. Causes miniature tornadoes with each wingbeat." },

  45: { id:45, name:"Cloudpuff",   emoji:"☁️", types:["Wind","Fairy"],
    base:{hp:50,atk:40,def:40,spa:65,spd:55,spe:60},
    learnset:[[1,"tackle"],[1,"gust"],[9,"fairy_wind"],[17,"sweet_kiss"],[25,"air_slash"],[33,"moonblast"]],
    evolveTo:46, evolveLevel:25, catchRate:150, expYield:80, rarity:"common",
    desc:"A fluffy cloud puffball. It floats serenely but fights with surprising force." },

  46: { id:46, name:"Mistwalker",  emoji:"👻", types:["Wind","Dark"],
    base:{hp:70,atk:65,def:60,spa:90,spd:80,spe:85},
    learnset:[[1,"gust"],[1,"night_slash"],[25,"air_slash"],[33,"dark_pulse"],[41,"hurricane"],[49,"shadow_ball"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:195, rarity:"uncommon",
    desc:"A ghost of mist that drifts at night. Its touch drains life energy." },

  // ===== ICE =====
  47: { id:47, name:"Frostpup",    emoji:"🐺", types:["Ice"],
    base:{hp:50,atk:55,def:45,spa:60,spd:50,spe:65},
    learnset:[[1,"scratch"],[1,"powder_snow"],[8,"quick_attack"],[16,"icicle_crash"],[24,"ice_beam"],[32,"ice_punch"],[40,"blizzard"]],
    evolveTo:48, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"An ice wolf pup with fur as white as fresh snow. Very loyal and fierce." },

  48: { id:48, name:"Blizzarhound",emoji:"🐺", types:["Ice"],
    base:{hp:80,atk:95,def:70,spa:85,spd:80,spe:90},
    learnset:[[1,"powder_snow"],[1,"quick_attack"],[28,"ice_beam"],[36,"icicle_crash"],[44,"ice_punch"],[52,"blizzard"],[60,"body_slam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:220, rarity:"uncommon",
    desc:"A blizzard hound that howls to summon snowstorms. Fearsome and fast." },

  49: { id:49, name:"Snowfluff",   emoji:"🐏", types:["Ice","Normal"],
    base:{hp:55,atk:45,def:60,spa:50,spd:60,spe:45},
    learnset:[[1,"tackle"],[1,"powder_snow"],[10,"harden"],[18,"ice_beam"],[26,"body_slam"],[34,"blizzard"]],
    evolveTo:50, evolveLevel:24, catchRate:180, expYield:77, rarity:"common",
    desc:"A fluffy snow sheep. Its wool absorbs cold air and condenses it to ice." },

  50: { id:50, name:"Icecrystal",  emoji:"💎", types:["Ice"],
    base:{hp:70,atk:60,def:90,spa:80,spd:90,spe:55},
    learnset:[[1,"powder_snow"],[1,"harden"],[24,"ice_beam"],[32,"icicle_crash"],[40,"blizzard"],[48,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A crystalline ice being of pure frozen beauty. It never melts." },

  51: { id:51, name:"Glaciawing",  emoji:"🦢", types:["Ice","Wind"],
    base:{hp:55,atk:50,def:50,spa:70,spd:65,spe:85},
    learnset:[[1,"powder_snow"],[1,"gust"],[12,"wing_attack"],[20,"ice_beam"],[28,"air_slash"],[36,"blizzard"],[44,"hurricane"]],
    evolveTo:52, evolveLevel:30, catchRate:100, expYield:95, rarity:"common",
    desc:"A graceful bird with ice-crystal wings. Leaves frost trails in the sky." },

  52: { id:52, name:"Polarex",     emoji:"🐻‍❄️", types:["Ice","Ground"],
    base:{hp:95,atk:100,def:90,spa:65,spd:75,spe:50},
    learnset:[[1,"powder_snow"],[1,"scratch"],[30,"ice_beam"],[38,"earthquake"],[46,"blizzard"],[54,"icicle_crash"],[62,"earth_power"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:228, rarity:"uncommon",
    desc:"A massive polar bear monster. Can freeze the ground solid with its roar." },

  53: { id:53, name:"Sleetling",   emoji:"🌨️", types:["Ice","Water"],
    base:{hp:45,atk:40,def:45,spa:60,spd:55,spe:55},
    learnset:[[1,"tackle"],[1,"water_gun"],[9,"powder_snow"],[17,"ice_beam"],[25,"surf"],[33,"blizzard"]],
    evolveTo:null, evolveLevel:null, catchRate:180, expYield:78, rarity:"common",
    desc:"A sleet sprite that lives in cold mountain streams. Chills the air around it." },

  // ===== DARK =====
  54: { id:54, name:"Shadowpup",   emoji:"🐕", types:["Dark"],
    base:{hp:50,atk:60,def:40,spa:60,spd:50,spe:65},
    learnset:[[1,"scratch"],[1,"bite"],[8,"quick_attack"],[16,"night_slash"],[24,"crunch"],[32,"dark_pulse"],[40,"shadow_ball"]],
    evolveTo:55, evolveLevel:25, catchRate:150, expYield:88, rarity:"common",
    desc:"A shadow puppy that hides in darkness. Its eyes glow red at night." },

  55: { id:55, name:"Nighthound",  emoji:"🐕", types:["Dark"],
    base:{hp:75,atk:90,def:65,spa:85,spd:75,spe:85},
    learnset:[[1,"bite"],[1,"quick_attack"],[25,"crunch"],[33,"night_slash"],[41,"dark_pulse"],[49,"shadow_ball"],[57,"body_slam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:208, rarity:"uncommon",
    desc:"A hound of the night. Moves silently and strikes from blind spots." },

  56: { id:56, name:"Voidbat",     emoji:"🦇", types:["Dark","Wind"],
    base:{hp:45,atk:50,def:40,spa:60,spd:55,spe:80},
    learnset:[[1,"bite"],[1,"gust"],[9,"wing_attack"],[17,"dark_pulse"],[25,"air_slash"],[33,"shadow_ball"],[41,"hurricane"]],
    evolveTo:57, evolveLevel:28, catchRate:130, expYield:85, rarity:"common",
    desc:"A dark bat that absorbs light. Creates zones of absolute darkness." },

  57: { id:57, name:"Spectrewing", emoji:"🦇", types:["Dark","Wind"],
    base:{hp:65,atk:75,def:60,spa:95,spd:80,spe:105},
    learnset:[[1,"dark_pulse"],[1,"wing_attack"],[28,"shadow_ball"],[36,"air_slash"],[44,"hurricane"],[52,"night_slash"],[60,"dark_pulse"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A spectral wing beast. Its mere passing through an area chills it completely." },

  58: { id:58, name:"Umbralisard", emoji:"🦎", types:["Dark","Poison"],
    base:{hp:55,atk:65,def:60,spa:65,spd:55,spe:60},
    learnset:[[1,"scratch"],[1,"bite"],[10,"poison_sting"],[18,"night_slash"],[26,"sludge_bomb"],[34,"crunch"],[42,"dark_pulse"],[50,"toxic"]],
    evolveTo:59, evolveLevel:32, catchRate:90, expYield:98, rarity:"common",
    desc:"A dark lizard with venomous bite. Camouflages perfectly in shadows." },

  59: { id:59, name:"Phantomfang", emoji:"🐍", types:["Dark","Poison"],
    base:{hp:75,atk:95,def:70,spa:85,spd:80,spe:80},
    learnset:[[1,"bite"],[1,"poison_sting"],[32,"crunch"],[40,"sludge_bomb"],[48,"dark_pulse"],[56,"toxic"],[64,"venoshock"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:218, rarity:"uncommon",
    desc:"A phantom serpent of darkness and venom. Said to haunt ancient ruins." },

  // ===== FAIRY =====
  60: { id:60, name:"Glowpup",     emoji:"🐶", types:["Fairy"],
    base:{hp:45,atk:40,def:45,spa:60,spd:55,spe:60},
    learnset:[[1,"tackle"],[1,"fairy_wind"],[8,"sweet_kiss"],[16,"dazzling_gleam"],[24,"moonblast"],[32,"recover"]],
    evolveTo:61, evolveLevel:25, catchRate:190, expYield:78, rarity:"common",
    desc:"A glowing puppy surrounded by fairy light. Brings luck wherever it goes." },

  61: { id:61, name:"Luminehound", emoji:"🐕", types:["Fairy"],
    base:{hp:70,atk:60,def:70,spa:100,spd:90,spe:80},
    learnset:[[1,"fairy_wind"],[1,"dazzling_gleam"],[25,"moonblast"],[33,"recover"],[41,"dazzling_gleam"],[49,"moonblast"],[57,"psystrike"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:205, rarity:"uncommon",
    desc:"A luminous hound of fairy power. Its radiance can banish dark spirits." },

  62: { id:62, name:"Prismfly",    emoji:"🦋", types:["Fairy","Bug"],
    base:{hp:40,atk:35,def:40,spa:70,spd:65,spe:65},
    learnset:[[1,"fairy_wind"],[1,"bug_bite"],[10,"sweet_kiss"],[18,"dazzling_gleam"],[26,"moonblast"],[34,"bug_buzz"]],
    evolveTo:63, evolveLevel:22, catchRate:160, expYield:82, rarity:"common",
    desc:"A prismatic butterfly that scatters rainbow dust. Hard to catch." },

  63: { id:63, name:"Radiantfly",  emoji:"🦋", types:["Fairy","Wind"],
    base:{hp:65,atk:55,def:60,spa:100,spd:90,spe:90},
    learnset:[[1,"fairy_wind"],[1,"dazzling_gleam"],[22,"moonblast"],[30,"air_slash"],[38,"hurricane"],[46,"dazzling_gleam"],[54,"moonblast"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:200, rarity:"uncommon",
    desc:"A radiant butterfly of pure fairy energy. Its wings shimmer with all colors." },

  64: { id:64, name:"Dawnsprite",  emoji:"✨", types:["Fairy","Psychic"],
    base:{hp:50,atk:45,def:50,spa:75,spd:70,spe:65},
    learnset:[[1,"fairy_wind"],[1,"confusion"],[10,"sweet_kiss"],[18,"psybeam"],[26,"dazzling_gleam"],[34,"psychic_move"],[42,"moonblast"]],
    evolveTo:65, evolveLevel:32, catchRate:100, expYield:96, rarity:"common",
    desc:"A dawn spirit that appears at sunrise. Its psychic energy is immense." },

  65: { id:65, name:"Celestara",   emoji:"🌟", types:["Fairy","Psychic"],
    base:{hp:75,atk:65,def:70,spa:120,spd:105,spe:85},
    learnset:[[1,"dazzling_gleam"],[1,"psychic_move"],[32,"moonblast"],[40,"psystrike"],[48,"calm_mind"],[56,"dazzling_gleam"],[64,"moonblast"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:248, rarity:"rare",
    desc:"A celestial being of fairy and psychic power. Claims to have come from the stars." },

  // ===== STEEL =====
  66: { id:66, name:"Ironpup",     emoji:"🤖", types:["Steel"],
    base:{hp:55,atk:65,def:75,spa:40,spd:50,spe:40},
    learnset:[[1,"scratch"],[1,"metal_claw"],[9,"harden"],[17,"flash_cannon"],[25,"steel_wing"],[33,"iron_tail"],[41,"body_slam"]],
    evolveTo:67, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"A puppy encased in iron armor. Slow but incredibly tough." },

  67: { id:67, name:"Steelhound",  emoji:"🦾", types:["Steel"],
    base:{hp:80,atk:95,def:110,spa:65,spd:80,spe:55},
    learnset:[[1,"metal_claw"],[1,"flash_cannon"],[28,"iron_tail"],[36,"steel_wing"],[44,"body_slam"],[52,"flash_cannon"],[60,"iron_tail"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:225, rarity:"uncommon",
    desc:"A steel hound with titanium claws. Almost nothing can break its armor." },

  68: { id:68, name:"Gearbot",     emoji:"⚙️", types:["Steel","Electric"],
    base:{hp:45,atk:55,def:70,spa:60,spd:50,spe:50},
    learnset:[[1,"metal_claw"],[1,"thunder_shock"],[10,"flash_cannon"],[18,"spark"],[26,"thunderbolt"],[34,"flash_cannon"],[42,"thunder"]],
    evolveTo:69, evolveLevel:28, catchRate:100, expYield:95, rarity:"common",
    desc:"A mechanical gear-bot that runs on electric power. Loves to tinker." },

  69: { id:69, name:"Mecharon",    emoji:"🦿", types:["Steel","Electric"],
    base:{hp:65,atk:80,def:95,spa:95,spd:80,spe:75},
    learnset:[[1,"flash_cannon"],[1,"thunderbolt"],[28,"iron_tail"],[36,"thunder"],[44,"flash_cannon"],[52,"thunder"],[60,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:235, rarity:"uncommon",
    desc:"A mechanical warrior powered by electric cores. Feared on every battlefield." },

  70: { id:70, name:"Titanshell",  emoji:"🐢", types:["Steel","Rock"],
    base:{hp:100,atk:70,def:130,spa:60,spd:100,spe:30},
    learnset:[[1,"tackle"],[1,"rock_throw"],[12,"harden"],[20,"flash_cannon"],[28,"rock_slide"],[36,"iron_tail"],[44,"stone_edge"],[52,"body_slam"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:210, rarity:"uncommon",
    desc:"A colossal steel-rock turtle. Nigh indestructible but very slow." },

  // ===== POISON =====
  71: { id:71, name:"Toxitoad",    emoji:"🐸", types:["Poison"],
    base:{hp:60,atk:55,def:50,spa:65,spd:55,spe:50},
    learnset:[[1,"tackle"],[1,"poison_sting"],[9,"bubble_beam"],[17,"sludge_bomb"],[25,"toxic"],[33,"venoshock"],[41,"sludge_bomb"]],
    evolveTo:72, evolveLevel:24, catchRate:150, expYield:88, rarity:"common",
    desc:"A toxic toad that drips with powerful venom. Warty and repulsive but deadly." },

  72: { id:72, name:"Venomtoad",   emoji:"🐸", types:["Poison","Water"],
    base:{hp:85,atk:75,def:70,spa:100,spd:80,spe:60},
    learnset:[[1,"poison_sting"],[1,"sludge_bomb"],[24,"surf"],[32,"toxic"],[40,"venoshock"],[48,"hydro_pump"],[56,"sludge_bomb"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A venom toad of enormous size. Its croaking alone can poison the air." },

  73: { id:73, name:"Acidblob",    emoji:"🫧", types:["Poison"],
    base:{hp:65,atk:50,def:45,spa:75,spd:50,spe:40},
    learnset:[[1,"tackle"],[1,"poison_sting"],[10,"sludge_bomb"],[18,"toxic"],[26,"venoshock"],[34,"recover"],[42,"sludge_bomb"]],
    evolveTo:74, evolveLevel:26, catchRate:130, expYield:95, rarity:"common",
    desc:"A blob of acid that oozes across the ground. Dissolves things with its body." },

  74: { id:74, name:"Sludgebeast",  emoji:"🫧", types:["Poison","Ground"],
    base:{hp:90,atk:65,def:80,spa:100,spd:85,spe:45},
    learnset:[[1,"sludge_bomb"],[1,"mud_shot"],[26,"toxic"],[34,"venoshock"],[42,"earthquake"],[50,"sludge_bomb"],[58,"earth_power"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:210, rarity:"uncommon",
    desc:"A sludge behemoth that poisons everything it touches. Its territory reeks." },

  75: { id:75, name:"Miasmafly",   emoji:"🦟", types:["Poison","Wind"],
    base:{hp:50,atk:60,def:40,spa:80,spd:60,spe:90},
    learnset:[[1,"poison_sting"],[1,"gust"],[10,"sludge_bomb"],[18,"air_slash"],[26,"toxic"],[34,"hurricane"],[42,"venoshock"]],
    evolveTo:null, evolveLevel:null, catchRate:100, expYield:130, rarity:"common",
    desc:"A miasma fly that leaves toxic trails in its wake. Spreads pestilence." },

  // ===== PSYCHIC =====
  76: { id:76, name:"Mindpup",     emoji:"🐩", types:["Psychic"],
    base:{hp:45,atk:40,def:40,spa:70,spd:65,spe:60},
    learnset:[[1,"tackle"],[1,"confusion"],[8,"quick_attack"],[16,"psybeam"],[24,"psychic_move"],[32,"calm_mind"],[40,"psystrike"]],
    evolveTo:77, evolveLevel:25, catchRate:165, expYield:86, rarity:"common",
    desc:"A psychic puppy that reads minds. Can predict attacks before they happen." },

  77: { id:77, name:"Psychound",   emoji:"🐩", types:["Psychic"],
    base:{hp:70,atk:60,def:60,spa:100,spd:90,spe:80},
    learnset:[[1,"confusion"],[1,"psybeam"],[25,"psychic_move"],[33,"psystrike"],[41,"calm_mind"],[49,"recover"],[57,"psystrike"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:210, rarity:"uncommon",
    desc:"A psychic hound whose mind burns with power. Can levitate small objects." },

  78: { id:78, name:"Esperia",     emoji:"🔮", types:["Psychic","Fairy"],
    base:{hp:55,atk:45,def:50,spa:85,spd:75,spe:70},
    learnset:[[1,"confusion"],[1,"fairy_wind"],[10,"psybeam"],[18,"dazzling_gleam"],[26,"psychic_move"],[34,"moonblast"],[42,"calm_mind"],[50,"psystrike"]],
    evolveTo:79, evolveLevel:32, catchRate:90, expYield:100, rarity:"common",
    desc:"A mystical esper being. Bridges the worlds of psychic and fairy magic." },

  79: { id:79, name:"Telepathy",   emoji:"🌀", types:["Psychic"],
    base:{hp:75,atk:65,def:65,spa:120,spd:100,spe:90},
    learnset:[[1,"psybeam"],[1,"psychic_move"],[32,"psystrike"],[40,"calm_mind"],[48,"recover"],[56,"psystrike"],[64,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:245, rarity:"rare",
    desc:"A being of pure psychic energy. Communicates only by telepathy." },

  80: { id:80, name:"Dreamrift",   emoji:"💫", types:["Psychic","Dark"],
    base:{hp:65,atk:70,def:55,spa:100,spd:75,spe:85},
    learnset:[[1,"confusion"],[1,"bite"],[11,"psybeam"],[19,"dark_pulse"],[27,"psychic_move"],[35,"shadow_ball"],[43,"night_slash"],[51,"psystrike"]],
    evolveTo:null, evolveLevel:null, catchRate:70, expYield:185, rarity:"uncommon",
    desc:"A dreamrift that exists between sleep and waking. It draws power from nightmares." },

  81: { id:81, name:"Psydrake",    emoji:"🐲", types:["Psychic","Dragon"],
    base:{hp:75,atk:85,def:70,spa:110,spd:80,spe:85},
    learnset:[[1,"dragon_breath"],[1,"confusion"],[13,"psybeam"],[21,"dragon_claw"],[29,"psychic_move"],[37,"dragon_pulse"],[45,"psystrike"],[53,"outrage"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A psychic dragon that manipulates reality with its mind. Ancient and mysterious." },

  // ===== DRAGON =====
  82: { id:82, name:"Drakling",    emoji:"🐣", types:["Dragon"],
    base:{hp:41,atk:64,def:45,spa:50,spd:50,spe:50},
    learnset:[[1,"scratch"],[1,"dragon_breath"],[12,"dragon_claw"],[22,"dragon_pulse"],[30,"dragon_dance"],[40,"outrage"]],
    evolveTo:83, evolveLevel:30, catchRate:45, expYield:91, rarity:"uncommon",
    desc:"A baby dragon hatchling. Clumsy but full of fiery determination." },

  83: { id:83, name:"Wyrmsire",    emoji:"🐲", types:["Dragon"],
    base:{hp:65,atk:94,def:65,spa:70,spd:65,spe:80},
    learnset:[[1,"dragon_breath"],[1,"dragon_claw"],[30,"dragon_pulse"],[38,"dragon_dance"],[46,"outrage"],[54,"hyper_beam"]],
    evolveTo:84, evolveLevel:55, catchRate:15, expYield:170, rarity:"rare",
    desc:"A powerful wyrm with tremendous strength. Known to destroy mountains." },

  84: { id:84, name:"Dragonlord",  emoji:"🐉", types:["Dragon","Fire"],
    base:{hp:91,atk:134,def:95,spa:100,spd:100,spe:80},
    learnset:[[1,"outrage"],[1,"fire_blast"],[55,"dragon_pulse"],[63,"heat_wave"],[70,"inferno"],[78,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:5, expYield:340, rarity:"legendary",
    desc:"The lord of all dragons. Its fire is hot enough to melt any metal." },

  85: { id:85, name:"Seadrake",    emoji:"🦭", types:["Water","Dragon"],
    base:{hp:80,atk:90,def:80,spa:95,spd:85,spe:80},
    learnset:[[1,"water_gun"],[1,"dragon_breath"],[14,"surf"],[22,"dragon_claw"],[30,"hydro_pump"],[38,"dragon_pulse"],[46,"outrage"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:210, rarity:"uncommon",
    desc:"A sea dragon that rules the ocean floor. Massive and aquatic." },

  86: { id:86, name:"Stormwyrm",   emoji:"⚡", types:["Electric","Dragon"],
    base:{hp:75,atk:85,def:70,spa:105,spd:80,spe:95},
    learnset:[[1,"thunder_shock"],[1,"dragon_breath"],[12,"thunderbolt"],[20,"dragon_claw"],[28,"thunder"],[36,"dragon_pulse"],[44,"outrage"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A dragon of lightning storms. Calls down thunder with each roar." },

  87: { id:87, name:"Crystaldrake",emoji:"💠", types:["Ice","Dragon"],
    base:{hp:80,atk:90,def:85,spa:100,spd:90,spe:75},
    learnset:[[1,"powder_snow"],[1,"dragon_breath"],[13,"ice_beam"],[21,"dragon_claw"],[29,"blizzard"],[37,"dragon_pulse"],[45,"outrage"],[53,"ice_punch"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A crystal dragon of ice. Its scales deflect nearly any attack." },

  // ===== NORMAL =====
  88: { id:88, name:"Furball",     emoji:"🐱", types:["Normal"],
    base:{hp:55,atk:50,def:50,spa:45,spd:45,spe:55},
    learnset:[[1,"tackle"],[1,"growl"],[8,"scratch"],[16,"quick_attack"],[24,"body_slam"],[32,"headbutt"],[40,"hyper_beam"]],
    evolveTo:89, evolveLevel:20, catchRate:220, expYield:68, rarity:"common",
    desc:"An adorable fur ball. Incredibly soft but surprisingly tough in a fight." },

  89: { id:89, name:"Softpaws",    emoji:"🐈", types:["Normal"],
    base:{hp:75,atk:70,def:70,spa:65,spd:65,spe:80},
    learnset:[[1,"scratch"],[1,"quick_attack"],[20,"body_slam"],[28,"night_slash"],[36,"headbutt"],[44,"swords_dance"],[52,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:80, expYield:180, rarity:"common",
    desc:"A graceful cat with retractable steel-like claws. Nimble and quick." },

  90: { id:90, name:"Longear",     emoji:"🐰", types:["Normal"],
    base:{hp:40,atk:35,def:35,spa:30,spd:40,spe:80},
    learnset:[[1,"tackle"],[1,"tail_whip"],[8,"quick_attack"],[16,"headbutt"],[24,"body_slam"]],
    evolveTo:91, evolveLevel:18, catchRate:255, expYield:55, rarity:"common",
    desc:"A swift rabbit with huge ears. Can hear predators from far away." },

  91: { id:91, name:"Longbounce",  emoji:"🐇", types:["Normal"],
    base:{hp:65,atk:55,def:55,spa:50,spd:55,spe:100},
    learnset:[[1,"quick_attack"],[1,"headbutt"],[18,"body_slam"],[26,"swords_dance"],[34,"hyper_beam"],[42,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:100, expYield:165, rarity:"common",
    desc:"A super-quick bouncing rabbit. Few can outrun this energetic creature." },

  92: { id:92, name:"Roundbear",   emoji:"🐻", types:["Normal"],
    base:{hp:75,atk:70,def:55,spa:55,spd:50,spe:40},
    learnset:[[1,"tackle"],[1,"growl"],[10,"headbutt"],[18,"body_slam"],[26,"swords_dance"],[34,"hyper_beam"],[42,"recover"]],
    evolveTo:93, evolveLevel:25, catchRate:140, expYield:98, rarity:"common",
    desc:"A roly-poly bear. Loves honey and naps. Surprisingly strong when angry." },

  93: { id:93, name:"Tubebear",    emoji:"🐻", types:["Normal"],
    base:{hp:110,atk:100,def:85,spa:70,spd:70,spe:45},
    learnset:[[1,"headbutt"],[1,"body_slam"],[25,"swords_dance"],[33,"recover"],[41,"hyper_beam"],[49,"body_slam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:220, rarity:"uncommon",
    desc:"A tubby great bear of enormous power. Its hugs can crush boulders." },

  94: { id:94, name:"Pudgeling",   emoji:"🐦", types:["Normal","Wind"],
    base:{hp:50,atk:45,def:40,spa:50,spd:45,spe:55},
    learnset:[[1,"tackle"],[1,"gust"],[8,"quick_attack"],[16,"wing_attack"],[24,"air_slash"],[32,"body_slam"]],
    evolveTo:null, evolveLevel:null, catchRate:200, expYield:74, rarity:"common",
    desc:"A pudgy bird that barely fits in trees. Better at fighting than flying." },

  95: { id:95, name:"Snuffle",     emoji:"🐷", types:["Normal"],
    base:{hp:65,atk:60,def:60,spa:40,spd:40,spe:30},
    learnset:[[1,"tackle"],[1,"growl"],[10,"headbutt"],[20,"body_slam"],[30,"swords_dance"],[40,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:180, expYield:80, rarity:"common",
    desc:"A snuffling pig monster that loves digging for truffles. Stubborn and cute." },

  // ===== ROCK =====
  96: { id:96, name:"Pebblepup",   emoji:"🪨", types:["Rock"],
    base:{hp:55,atk:65,def:75,spa:40,spd:40,spe:35},
    learnset:[[1,"tackle"],[1,"rock_throw"],[8,"harden"],[16,"headbutt"],[24,"rock_slide"],[32,"stone_edge"],[40,"body_slam"]],
    evolveTo:97, evolveLevel:25, catchRate:160, expYield:88, rarity:"common",
    desc:"A rock puppy with pebble-studded fur. Loves rolling into a ball." },

  97: { id:97, name:"Boulderhound",emoji:"🪨", types:["Rock","Ground"],
    base:{hp:85,atk:100,def:110,spa:55,spd:65,spe:45},
    learnset:[[1,"rock_throw"],[1,"headbutt"],[25,"rock_slide"],[33,"earthquake"],[41,"stone_edge"],[49,"earth_power"],[57,"body_slam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:222, rarity:"uncommon",
    desc:"A boulder hound encrusted with stones. Can cause landslides by running." },

  98: { id:98, name:"Cragclaw",    emoji:"🦞", types:["Rock","Water"],
    base:{hp:70,atk:80,def:95,spa:55,spd:65,spe:45},
    learnset:[[1,"scratch"],[1,"rock_throw"],[11,"water_gun"],[19,"rock_slide"],[27,"aqua_tail"],[35,"stone_edge"],[43,"surf"]],
    evolveTo:null, evolveLevel:null, catchRate:75, expYield:178, rarity:"uncommon",
    desc:"A crag claw crab that lives on rocky sea cliffs. Fiercely territorial." },

  99: { id:99, name:"Crystalrock",  emoji:"💎", types:["Rock","Ice"],
    base:{hp:65,atk:75,def:100,spa:70,spd:85,spe:40},
    learnset:[[1,"rock_throw"],[1,"powder_snow"],[12,"harden"],[20,"rock_slide"],[28,"ice_beam"],[36,"stone_edge"],[44,"blizzard"]],
    evolveTo:null, evolveLevel:null, catchRate:80, expYield:185, rarity:"uncommon",
    desc:"A crystal of ice and stone. Formed under tremendous pressure underground." },

  // ===== BUG =====
  100: { id:100, name:"Caterpet",   emoji:"🐛", types:["Bug"],
    base:{hp:45,atk:30,def:35,spa:25,spd:20,spe:45},
    learnset:[[1,"tackle"],[1,"string_shot"],[5,"bug_bite"]],
    evolveTo:101, evolveLevel:7, catchRate:255, expYield:39, rarity:"common",
    desc:"A cute caterpillar. Harmless and curious, though it spins strong silk." },

  101: { id:101, name:"Cocooning",  emoji:"🫙", types:["Bug"],
    base:{hp:50,atk:25,def:50,spa:25,spd:25,spe:15},
    learnset:[[1,"harden"]],
    evolveTo:102, evolveLevel:10, catchRate:120, expYield:72, rarity:"common",
    desc:"A shimmering cocoon. Inside, something remarkable is taking shape." },

  102: { id:102, name:"Butterflight",emoji:"🦋", types:["Bug","Wind"],
    base:{hp:60,atk:45,def:50,spa:90,spd:80,spe:70},
    learnset:[[1,"gust"],[1,"bug_buzz"],[10,"air_slash"],[18,"dazzling_gleam"],[26,"hurricane"],[34,"bug_buzz"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:170, rarity:"uncommon",
    desc:"A glorious butterfly of wind and beauty. Its wing patterns mesmerize foes." },

  103: { id:103, name:"Beetleback",  emoji:"🪲", types:["Bug","Rock"],
    base:{hp:60,atk:75,def:85,spa:40,spd:55,spe:40},
    learnset:[[1,"bug_bite"],[1,"rock_throw"],[10,"headbutt"],[18,"x_scissor"],[26,"rock_slide"],[34,"stone_edge"]],
    evolveTo:104, evolveLevel:25, catchRate:130, expYield:95, rarity:"common",
    desc:"A heavily armored beetle. Its rock-hard shell is practically indestructible." },

  104: { id:104, name:"Hardbeetle",  emoji:"🪲", types:["Bug","Steel"],
    base:{hp:80,atk:110,def:105,spa:60,spd:70,spe:50},
    learnset:[[1,"x_scissor"],[1,"iron_tail"],[25,"rock_slide"],[33,"flash_cannon"],[41,"stone_edge"],[49,"bug_buzz"],[57,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A steel beetle of terrifying might. Its mandibles can cut through iron." },

  // ===== LEGENDARIES =====
  105: { id:105, name:"Tempestia",  emoji:"🌪️", types:["Wind","Electric"],
    base:{hp:91,atk:90,def:85,spa:125,spd:90,spe:110},
    learnset:[[1,"hurricane"],[1,"thunder"],[1,"air_slash"],[1,"dragon_dance"],[60,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Storm Bird. Said to control all weather in Lumoria." },

  106: { id:106, name:"Volcanox",   emoji:"🌋", types:["Fire","Rock"],
    base:{hp:110,atk:130,def:100,spa:95,spd:90,spe:60},
    learnset:[[1,"fire_blast"],[1,"stone_edge"],[1,"earthquake"],[1,"inferno"],[60,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Volcano Titan. Eruptions across Lumoria mark its awakening." },

  107: { id:107, name:"Abyssdrake", emoji:"🌊", types:["Water","Dark"],
    base:{hp:100,atk:110,def:90,spa:120,spd:100,spe:75},
    learnset:[[1,"hydro_pump"],[1,"dark_pulse"],[1,"dragon_pulse"],[1,"crunch"],[60,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Abyss Drake. Lurks in the deepest ocean trenches." }
};


// ============================================================
// WORLD DATA - Lumoria Region
// ============================================================
const WORLD_DATA = {
  seedvale: {
    id:"seedvale", name:"Seedvale Town", icon:"🏡", type:"town",
    desc:"A peaceful starter town nestled in a valley. Professor Arbor's lab is here.",
    connections:["route1"],
    wildMonsters:[], hasGym:false, requiredBadges:0,
    mapPos:{x:15, y:75}
  },
  route1: {
    id:"route1", name:"Route 1 - Meadow Path", icon:"🌿", type:"route",
    desc:"A gentle grassy path with mild wild monsters. Perfect for beginners.",
    connections:["seedvale","ashford"],
    wildMonsters:[
      {id:88, minLv:2, maxLv:4, rate:25},  // Furball
      {id:90, minLv:2, maxLv:4, rate:25},  // Longear
      {id:100, minLv:2, maxLv:5, rate:30}, // Caterpet
      {id:94, minLv:3, maxLv:5, rate:20}   // Pudgeling
    ],
    hasGym:false, requiredBadges:0, mapPos:{x:25, y:68}
  },
  ashford: {
    id:"ashford", name:"Ashford City", icon:"🏙️", type:"city",
    desc:"The first city of the journey. Home to Gym Leader Rex who specializes in Normal types.",
    connections:["route1","route2"],
    wildMonsters:[
      {id:88, minLv:4, maxLv:7, rate:30},
      {id:95, minLv:4, maxLv:7, rate:30},
      {id:26, minLv:4, maxLv:6, rate:20},
      {id:90, minLv:5, maxLv:7, rate:20}
    ],
    hasGym:true, gymLeader:"rex", requiredBadges:0, mapPos:{x:38, y:62}
  },
  route2: {
    id:"route2", name:"Route 2 - Greenwood Forest", icon:"🌲", type:"route",
    desc:"A dense forest teeming with Bug and Grass type monsters.",
    connections:["ashford","tidewatch"],
    wildMonsters:[
      {id:100, minLv:6, maxLv:9, rate:25}, // Caterpet
      {id:103, minLv:6, maxLv:9, rate:20}, // Beetleback
      {id:24, minLv:6, maxLv:9, rate:25},  // Fernwhip
      {id:26, minLv:6, maxLv:9, rate:20},  // Seedpod
      {id:30, minLv:7, maxLv:9, rate:10}   // Zapbug
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:50, y:58}
  },
  tidewatch: {
    id:"tidewatch", name:"Tidewatch Port", icon:"⛵", type:"city",
    desc:"A bustling port city on the coast. Gym Leader Marina commands the waves.",
    connections:["route2","route3"],
    wildMonsters:[
      {id:16, minLv:10, maxLv:13, rate:30}, // Bubblecrab
      {id:20, minLv:10, maxLv:13, rate:30}, // Coralfish
      {id:32, minLv:10, maxLv:12, rate:20}, // Voltfin
      {id:18, minLv:11, maxLv:13, rate:20}  // Frosteel
    ],
    hasGym:true, gymLeader:"marina", requiredBadges:1, mapPos:{x:62, y:52}
  },
  route3: {
    id:"route3", name:"Route 3 - Coastal Shore", icon:"🏖️", type:"route",
    desc:"A rocky shoreline where Water types thrive.",
    connections:["tidewatch","emberveil"],
    wildMonsters:[
      {id:16, minLv:14, maxLv:17, rate:25},
      {id:20, minLv:14, maxLv:17, rate:25},
      {id:39, minLv:14, maxLv:16, rate:25},
      {id:18, minLv:15, maxLv:17, rate:25}
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:70, y:45}
  },
  emberveil: {
    id:"emberveil", name:"Emberveil City", icon:"🌋", type:"city",
    desc:"Built near an active volcano. The fiery Gym Leader Pyros waits within.",
    connections:["route3","route4"],
    wildMonsters:[
      {id:14, minLv:18, maxLv:22, rate:30}, // Emberworm
      {id:12, minLv:18, maxLv:22, rate:25}, // Lavabull
      {id:10, minLv:18, maxLv:21, rate:25}, // Cinderling
      {id:96, minLv:19, maxLv:22, rate:20}  // Pebblepup
    ],
    hasGym:true, gymLeader:"pyros", requiredBadges:2, mapPos:{x:75, y:35}
  },
  route4: {
    id:"route4", name:"Route 4 - Volcanic Wastes", icon:"🔥", type:"route",
    desc:"A harsh volcanic wasteland. Fire and Rock types are common here.",
    connections:["emberveil","sparkmoor"],
    wildMonsters:[
      {id:14, minLv:22, maxLv:26, rate:25},
      {id:12, minLv:22, maxLv:26, rate:25},
      {id:96, minLv:23, maxLv:26, rate:25},
      {id:37, minLv:23, maxLv:26, rate:25}
    ],
    hasGym:false, requiredBadges:3, mapPos:{x:65, y:28}
  },
  sparkmoor: {
    id:"sparkmoor", name:"Sparkmoor Town", icon:"⚡", type:"city",
    desc:"A town on the electric plains. Gym Leader Zara harnesses lightning power.",
    connections:["route4","route5"],
    wildMonsters:[
      {id:28, minLv:26, maxLv:30, rate:30}, // Sparklet
      {id:30, minLv:26, maxLv:30, rate:25}, // Zapbug
      {id:34, minLv:27, maxLv:30, rate:25}, // Stormchick
      {id:32, minLv:27, maxLv:30, rate:20}  // Voltfin
    ],
    hasGym:true, gymLeader:"zara", requiredBadges:3, mapPos:{x:52, y:25}
  },
  route5: {
    id:"route5", name:"Route 5 - Thunder Plains", icon:"🌩️", type:"route",
    desc:"A wide open plain where storms are constant and Electric types roam freely.",
    connections:["sparkmoor","frostpeak"],
    wildMonsters:[
      {id:28, minLv:30, maxLv:34, rate:25},
      {id:34, minLv:30, maxLv:34, rate:25},
      {id:43, minLv:31, maxLv:34, rate:25}, // Draftfinch
      {id:92, minLv:31, maxLv:34, rate:25}  // Roundbear
    ],
    hasGym:false, requiredBadges:4, mapPos:{x:42, y:22}
  },
  frostpeak: {
    id:"frostpeak", name:"Frostpeak Village", icon:"❄️", type:"city",
    desc:"A snow-covered village atop a frozen mountain. Ice Gym Leader Glacier awaits.",
    connections:["route5","route6"],
    wildMonsters:[
      {id:47, minLv:34, maxLv:38, rate:30}, // Frostpup
      {id:49, minLv:34, maxLv:38, rate:25}, // Snowfluff
      {id:53, minLv:35, maxLv:38, rate:25}, // Sleetling
      {id:51, minLv:35, maxLv:38, rate:20}  // Glaciawing
    ],
    hasGym:true, gymLeader:"glacier", requiredBadges:4, mapPos:{x:32, y:18}
  },
  route6: {
    id:"route6", name:"Route 6 - Crystal Caverns", icon:"💎", type:"route",
    desc:"An icy cave system glittering with crystals. Ice and Rock types dwell here.",
    connections:["frostpeak","shadowmere"],
    wildMonsters:[
      {id:47, minLv:38, maxLv:42, rate:25},
      {id:50, minLv:38, maxLv:42, rate:25}, // Icecrystal
      {id:99, minLv:39, maxLv:42, rate:25}, // Crystalrock
      {id:51, minLv:39, maxLv:42, rate:25}
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:22, y:25}
  },
  shadowmere: {
    id:"shadowmere", name:"Shadowmere City", icon:"🌑", type:"city",
    desc:"A city forever shrouded in shadow. Dark Gym Leader Nyx commands the night.",
    connections:["route6","route7"],
    wildMonsters:[
      {id:54, minLv:42, maxLv:46, rate:30}, // Shadowpup
      {id:56, minLv:42, maxLv:46, rate:25}, // Voidbat
      {id:58, minLv:43, maxLv:46, rate:25}, // Umbralisard
      {id:80, minLv:43, maxLv:46, rate:20}  // Dreamrift
    ],
    hasGym:true, gymLeader:"nyx", requiredBadges:5, mapPos:{x:15, y:35}
  },
  route7: {
    id:"route7", name:"Route 7 - Poison Marshes", icon:"☠️", type:"route",
    desc:"A fetid swamp full of poison. Dark and Poison types are found in abundance.",
    connections:["shadowmere","skyvault"],
    wildMonsters:[
      {id:73, minLv:46, maxLv:50, rate:25}, // Acidblob
      {id:71, minLv:46, maxLv:50, rate:25}, // Toxitoad
      {id:75, minLv:47, maxLv:50, rate:25}, // Miasmafly
      {id:56, minLv:47, maxLv:50, rate:25}  // Voidbat
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:20, y:48}
  },
  skyvault: {
    id:"skyvault", name:"Skyvault City", icon:"🏰", type:"city",
    desc:"A city floating on clouds. Psychic Gym Leader Oracle sees all futures.",
    connections:["route7","route8"],
    wildMonsters:[
      {id:76, minLv:50, maxLv:54, rate:30}, // Mindpup
      {id:64, minLv:50, maxLv:54, rate:25}, // Dawnsprite
      {id:45, minLv:51, maxLv:54, rate:25}, // Cloudpuff
      {id:78, minLv:51, maxLv:54, rate:20}  // Esperia
    ],
    hasGym:true, gymLeader:"oracle", requiredBadges:6, mapPos:{x:30, y:55}
  },
  route8: {
    id:"route8", name:"Route 8 - Sky Corridors", icon:"🌤️", type:"route",
    desc:"Aerial paths between floating islands. Wind and Psychic types soar here.",
    connections:["skyvault","dragonspire"],
    wildMonsters:[
      {id:41, minLv:54, maxLv:58, rate:25}, // Breezekit
      {id:44, minLv:54, maxLv:58, rate:25}, // Cyclobird
      {id:81, minLv:55, maxLv:58, rate:25}, // Psydrake
      {id:87, minLv:55, maxLv:58, rate:25}  // Crystaldrake
    ],
    hasGym:false, requiredBadges:7, mapPos:{x:42, y:50}
  },
  dragonspire: {
    id:"dragonspire", name:"Dragonspire Peak", icon:"🐉", type:"city",
    desc:"The highest peak in Lumoria. Dragon Gym Leader Drake commands ancient power.",
    connections:["route8","victoryroad"],
    wildMonsters:[
      {id:82, minLv:58, maxLv:62, rate:30}, // Drakling
      {id:85, minLv:58, maxLv:62, rate:25}, // Seadrake
      {id:86, minLv:59, maxLv:62, rate:25}, // Stormwyrm
      {id:87, minLv:59, maxLv:62, rate:20}  // Crystaldrake
    ],
    hasGym:true, gymLeader:"drake", requiredBadges:7, mapPos:{x:55, y:42}
  },
  victoryroad: {
    id:"victoryroad", name:"Victory Road", icon:"⚔️", type:"route",
    desc:"The final gauntlet. Only trainers with all 8 badges may pass.",
    connections:["dragonspire","summit"],
    wildMonsters:[
      {id:83, minLv:62, maxLv:66, rate:25}, // Wyrmsire
      {id:59, minLv:62, maxLv:66, rate:25}, // Phantomfang
      {id:65, minLv:62, maxLv:66, rate:25}, // Celestara
      {id:69, minLv:63, maxLv:66, rate:25}  // Mecharon
    ],
    hasGym:false, requiredBadges:8, mapPos:{x:62, y:35}
  },
  summit: {
    id:"summit", name:"Victory Summit", icon:"👑", type:"special",
    desc:"The seat of the Lumoria Champion. Only the greatest trainers reach this place.",
    connections:["victoryroad"],
    wildMonsters:[], hasGym:false, isChampion:true, requiredBadges:8,
    mapPos:{x:72, y:30}
  }
};

// ============================================================
// GYM LEADERS & CHAMPION
// ============================================================
const GYM_LEADERS = {
  rex: {
    id:"rex", name:"Leader Rex", emoji:"💪", type:"Normal",
    badge:"Stone Badge", badgeEmoji:"🪨",
    quote:"You think you have what it takes? Let's see how normal you really are!",
    winQuote:"Not bad! Here, take the Stone Badge. You've earned it.",
    team:[
      {monsterId:88, level:10, moves:["tackle","headbutt","growl","quick_attack"]},
      {monsterId:90, level:12, moves:["tackle","quick_attack","tail_whip","headbutt"]},
      {monsterId:93, level:14, moves:["headbutt","body_slam","growl","tackle"]}
    ]
  },
  marina: {
    id:"marina", name:"Leader Marina", emoji:"🌊", type:"Water",
    badge:"Wave Badge", badgeEmoji:"🌊",
    quote:"The ocean is vast and powerful. Feel the force of its tides!",
    winQuote:"You truly understand the ocean's power. The Wave Badge is yours.",
    team:[
      {monsterId:20, level:18, moves:["water_gun","bubble_beam","sweet_kiss","quick_attack"]},
      {monsterId:16, level:20, moves:["water_gun","bubble_beam","harden","aqua_tail"]},
      {monsterId:5,  level:22, moves:["water_gun","aqua_tail","surf","recover"]}
    ]
  },
  pyros: {
    id:"pyros", name:"Leader Pyros", emoji:"🔥", type:"Fire",
    badge:"Flame Badge", badgeEmoji:"🔥",
    quote:"My fire burns hotter than any volcano! Can you withstand the heat?",
    winQuote:"Your strength is as intense as a raging wildfire. The Flame Badge is yours!",
    team:[
      {monsterId:14, level:25, moves:["ember","quick_attack","flamethrower","tackle"]},
      {monsterId:10, level:26, moves:["ember","bug_bite","flame_fang","x_scissor"]},
      {monsterId:12, level:28, moves:["ember","headbutt","flamethrower","body_slam"]}
    ]
  },
  zara: {
    id:"zara", name:"Leader Zara", emoji:"⚡", type:"Electric",
    badge:"Bolt Badge", badgeEmoji:"⚡",
    quote:"I'll shock you senseless! Electric types are unstoppable!",
    winQuote:"You're truly electrifying! The Bolt Badge is yours.",
    team:[
      {monsterId:30, level:32, moves:["thunder_shock","spark","bug_bite","string_shot"]},
      {monsterId:34, level:33, moves:["thunder_shock","wing_attack","spark","thunderbolt"]},
      {monsterId:29, level:35, moves:["thunderbolt","spark","body_slam","thunder_wave"]}
    ]
  },
  glacier: {
    id:"glacier", name:"Leader Glacier", emoji:"❄️", type:"Ice",
    badge:"Frost Badge", badgeEmoji:"❄️",
    quote:"The cold never bothered me! But it will certainly bother you!",
    winQuote:"Your warmth has melted even my icy heart. The Frost Badge is yours.",
    team:[
      {monsterId:53, level:38, moves:["powder_snow","water_gun","ice_beam","surf"]},
      {monsterId:47, level:39, moves:["powder_snow","quick_attack","ice_beam","icicle_crash"]},
      {monsterId:49, level:42, moves:["powder_snow","harden","ice_beam","blizzard"]}
    ]
  },
  nyx: {
    id:"nyx", name:"Leader Nyx", emoji:"🌑", type:"Dark",
    badge:"Dusk Badge", badgeEmoji:"🌑",
    quote:"Light cannot penetrate my darkness. Surrender to the shadow!",
    winQuote:"A light that cannot be extinguished... The Dusk Badge is yours.",
    team:[
      {monsterId:56, level:44, moves:["bite","gust","dark_pulse","wing_attack"]},
      {monsterId:54, level:45, moves:["bite","quick_attack","crunch","night_slash"]},
      {monsterId:58, level:48, moves:["bite","poison_sting","crunch","shadow_ball"]}
    ]
  },
  oracle: {
    id:"oracle", name:"Leader Oracle", emoji:"🔮", type:"Psychic",
    badge:"Mind Badge", badgeEmoji:"🔮",
    quote:"I have foreseen your defeat. The future is already written.",
    winQuote:"Incredible. You have rewritten what I thought was fate. The Mind Badge is yours.",
    team:[
      {monsterId:76, level:50, moves:["confusion","quick_attack","psybeam","recover"]},
      {monsterId:64, level:51, moves:["confusion","fairy_wind","psybeam","dazzling_gleam"]},
      {monsterId:78, level:54, moves:["psybeam","dazzling_gleam","psychic_move","calm_mind"]}
    ]
  },
  drake: {
    id:"drake", name:"Leader Drake", emoji:"🐉", type:"Dragon",
    badge:"Dragon Badge", badgeEmoji:"🐉",
    quote:"Dragons are the apex of all monsters. You cannot defeat their ancient power!",
    winQuote:"You have shown the heart of a true dragon master. The Dragon Badge is yours!",
    team:[
      {monsterId:82, level:56, moves:["dragon_breath","dragon_claw","headbutt","dragon_dance"]},
      {monsterId:86, level:57, moves:["thunder_shock","dragon_breath","thunderbolt","dragon_claw"]},
      {monsterId:85, level:59, moves:["water_gun","dragon_breath","surf","dragon_claw"]},
      {monsterId:83, level:62, moves:["dragon_claw","dragon_pulse","dragon_dance","outrage"]}
    ]
  },
  champion: {
    id:"champion", name:"Champion Lumian", emoji:"👑", type:"Mixed",
    badge:null, badgeEmoji:"🏆",
    quote:"I am Champion Lumian, master of all types and all strategies. Many have tried... none have succeeded. Show me your resolve, young trainer!",
    winQuote:"Astounding! You have defeated the Champion of Lumoria! Your name will echo through the ages! You are the new Lumoria Champion!",
    team:[
      {monsterId:48, level:65, moves:["blizzard","ice_beam","icicle_crash","body_slam"]},
      {monsterId:3,  level:66, moves:["flamethrower","dragon_claw","heat_wave","outrage"]},
      {monsterId:84, level:67, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]},
      {monsterId:65, level:68, moves:["moonblast","psychic_move","dazzling_gleam","calm_mind"]},
      {monsterId:81, level:69, moves:["psychic_move","dragon_pulse","psystrike","outrage"]},
      {monsterId:69, level:72, moves:["flash_cannon","thunder","iron_tail","hyper_beam"]}
    ]
  }
};

// ============================================================
// ITEMS DATA
// ============================================================
const ITEMS_DATA = {
  basicOrb:   { name:"Basic Orb",   emoji:"🔵", desc:"A basic capture orb.", catchMult:1,   healAmt:0, type:"ball" },
  greatOrb:   { name:"Great Orb",   emoji:"🔶", desc:"A better capture orb.", catchMult:1.5, healAmt:0, type:"ball" },
  ultraOrb:   { name:"Ultra Orb",   emoji:"⚫", desc:"A high-quality orb.", catchMult:2,   healAmt:0, type:"ball" },
  masterOrb:  { name:"Master Orb",  emoji:"🌟", desc:"Always catches!", catchMult:255, healAmt:0, type:"ball" },
  potion:     { name:"Potion",      emoji:"🧪", desc:"Heals 20 HP.", catchMult:0, healAmt:20,  type:"heal" },
  superPotion:{ name:"Super Potion",emoji:"💊", desc:"Heals 50 HP.", catchMult:0, healAmt:50,  type:"heal" },
  maxPotion:  { name:"Max Potion",  emoji:"💉", desc:"Fully heals HP.", catchMult:0, healAmt:999, type:"heal" },
  revive:     { name:"Revive",      emoji:"💫", desc:"Revives a fainted monster to 50% HP.", catchMult:0, healAmt:0, type:"revive" }
};

const STARTING_BAG = {
  basicOrb: 10,
  greatOrb: 0,
  ultraOrb: 0,
  masterOrb: 0,
  potion: 5,
  superPotion: 2,
  maxPotion: 0,
  revive: 1
};

const STARTER_IDS = [1, 4, 7]; // Emberpaw, Dewdrop, Sproutling

