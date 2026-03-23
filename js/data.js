// ============================================================
// LUMORIA - Game Data
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
  wild_tumble:  { name:"Wild Tumble",   type:"Normal",   power:60,  acc:100, pp:20, cat:"physical", effect:"flinch",    ec:20,  desc:"Tumbles into the foe wildly with reckless abandon." },
  battle_cry:   { name:"Battle Cry",    type:"Normal",   power:0,   acc:100, pp:20, cat:"status",   effect:"atkup2",    ec:100, desc:"Lets out a ferocious cry that fires up the user's fighting spirit." },
  momentum_rush:{ name:"Momentum Rush", type:"Normal",   power:75,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Builds momentum across the field and crashes into the foe at full speed." },
  vital_pulse:  { name:"Vital Pulse",   type:"Normal",   power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Focuses life energy inward to restore the user's vitality." },
  instinct_slash:{ name:"Instinct Slash",type:"Normal",  power:70,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes by pure instinct, always finding a critical spot to exploit." },
  // --- Fire ---
  ember:        { name:"Ember",         type:"Fire",     power:40,  acc:100, pp:25, cat:"special",  effect:"burn",      ec:10,  desc:"A weak fire attack that may burn." },
  flame_fang:   { name:"Flame Fang",    type:"Fire",     power:65,  acc:95,  pp:15, cat:"physical", effect:"burn",      ec:10,  desc:"Bites with flaming fangs. May burn." },
  flamethrower: { name:"Flamethrower",  type:"Fire",     power:90,  acc:100, pp:15, cat:"special",  effect:"burn",      ec:10,  desc:"Shoots a stream of intense fire. May burn." },
  fire_blast:   { name:"Fire Blast",    type:"Fire",     power:110, acc:85,  pp:5,  cat:"special",  effect:"burn",      ec:10,  desc:"A massive fireball. May burn the target." },
  heat_wave:    { name:"Heat Wave",     type:"Fire",     power:95,  acc:90,  pp:10, cat:"special",  effect:"burn",      ec:10,  desc:"Exhales a wave of scorching heat." },
  inferno:      { name:"Inferno",       type:"Fire",     power:100, acc:85,  pp:5,  cat:"special",  effect:"burn",      ec:100, desc:"A raging inferno that always burns." },
  cinderwhirl:  { name:"Cinderwhirl",   type:"Fire",     power:85,  acc:90,  pp:10, cat:"special",  effect:"burn",      ec:20,  desc:"Unleashes a spinning tornado of cinders that scorches everything in its path." },
  scorch_veil:  { name:"Scorch Veil",   type:"Fire",     power:0,   acc:100, pp:15, cat:"status",   effect:"burn",      ec:100, desc:"Wraps the user in a veil of burning ash that singes any foe that makes contact." },
  magma_surge:  { name:"Magma Surge",   type:"Fire",     power:90,  acc:85,  pp:10, cat:"special",  effect:"burn",      ec:30,  desc:"Erupts scalding magma from the ground beneath the foe." },
  embercloak:   { name:"Embercloak",    type:"Fire",     power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Cloaks the user in a shell of compressed flame that hardens the body." },
  blazing_rush: { name:"Blazing Rush",  type:"Fire",     power:60,  acc:100, pp:15, cat:"physical", effect:"priority",  ec:0,   desc:"Charges the foe at incredible speed, body engulfed in roaring flames." },
  solar_flare:  { name:"Solar Flare",   type:"Fire",     power:120, acc:80,  pp:5,  cat:"special",  effect:"burn",      ec:50,  desc:"Focuses the heat of the sun into a devastating concentrated beam." },
  char_dance:   { name:"Char Dance",    type:"Fire",     power:0,   acc:100, pp:10, cat:"status",   effect:"dragondance",ec:100,desc:"A fiery war dance that emboldens the user, raising Attack and Speed." },
  // --- Water ---
  water_gun:    { name:"Water Gun",     type:"Water",    power:40,  acc:100, pp:25, cat:"special",  effect:null,        ec:0,   desc:"Squirts water at the foe." },
  aqua_tail:    { name:"Aqua Tail",     type:"Water",    power:90,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Attacks with a powerful water tail." },
  surf:         { name:"Surf",          type:"Water",    power:90,  acc:100, pp:15, cat:"special",  effect:null,        ec:0,   desc:"A powerful wave crashes over the foe." },
  hydro_pump:   { name:"Hydro Pump",    type:"Water",    power:110, acc:80,  pp:5,  cat:"special",  effect:null,        ec:0,   desc:"Blasts the foe with a powerful water jet." },
  bubble_beam:  { name:"Bubble Beam",   type:"Water",    power:65,  acc:100, pp:20, cat:"special",  effect:"spedown",   ec:10,  desc:"Shoots bubbles that may reduce Speed." },
  tidal_crush:  { name:"Tidal Crush",   type:"Water",    power:100, acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Slams the foe with a crushing wall of tide water." },
  whirlpool_dive:{ name:"Whirlpool Dive",type:"Water",   power:80,  acc:95,  pp:15, cat:"physical", effect:"confuse",   ec:20,  desc:"Dives into a churning whirlpool and emerges to slam the foe." },
  frost_current:{ name:"Frost Current", type:"Water",    power:70,  acc:100, pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Fires a current of near-freezing water that slows the target." },
  abyssal_jet:  { name:"Abyssal Jet",   type:"Water",    power:55,  acc:100, pp:20, cat:"special",  effect:"priority",  ec:0,   desc:"Blasts a jet of deep-ocean water at blinding speed." },
  coral_barrage:{ name:"Coral Barrage", type:"Water",    power:75,  acc:90,  pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Hurls a barrage of razor-sharp coral fragments at the foe." },
  sea_serpent_strike:{ name:"Sea Serpent Strike",type:"Water",power:95,acc:90,pp:10,cat:"physical",effect:null,        ec:0,   desc:"A coiling strike mimicking the legendary sea serpent's lethal lunge." },
  tidecaller:   { name:"Tidecaller",    type:"Water",    power:0,   acc:100, pp:15, cat:"status",   effect:"calmup",    ec:100, desc:"Calls upon the tides to bolster the user's special power and resilience." },
  // --- Grass ---
  vine_whip:    { name:"Vine Whip",     type:"Grass",    power:45,  acc:100, pp:25, cat:"physical", effect:null,        ec:0,   desc:"Strikes with long, slender vines." },
  razor_leaf:   { name:"Razor Leaf",    type:"Grass",    power:55,  acc:95,  pp:25, cat:"physical", effect:"crit",      ec:100, desc:"Slices with razor-edged leaves. High crit." },
  seed_bomb:    { name:"Seed Bomb",     type:"Grass",    power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Drops a giant seed bomb on the foe." },
  energy_ball:  { name:"Energy Ball",   type:"Grass",    power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"A ball of energy drawn from nature." },
  petal_blitz:  { name:"Petal Blitz",   type:"Grass",    power:100, acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Strikes with a furious petal storm." },
  sleep_powder: { name:"Sleep Powder",  type:"Grass",    power:0,   acc:75,  pp:15, cat:"status",   effect:"sleep",     ec:100, desc:"Scatters a powder that induces sleep." },
  root_lance:   { name:"Root Lance",    type:"Grass",    power:85,  acc:95,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Drives an enormous root spear through the ground and up into the foe." },
  canopy_crash: { name:"Canopy Crash",  type:"Grass",    power:90,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Drops a massive section of forest canopy onto the opponent." },
  spore_burst:  { name:"Spore Burst",   type:"Grass",    power:0,   acc:80,  pp:15, cat:"status",   effect:"sleep",     ec:100, desc:"Releases an explosive burst of sleep-inducing spores." },
  thornwall:    { name:"Thornwall",     type:"Grass",    power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Grows a wall of thorns around the user, raising its Defense." },
  verdant_surge:{ name:"Verdant Surge", type:"Grass",    power:110, acc:85,  pp:5,  cat:"special",  effect:null,        ec:0,   desc:"Surges with the full power of living nature in a devastating burst." },
  photon_leaf:  { name:"Photon Leaf",   type:"Grass",    power:70,  acc:100, pp:15, cat:"special",  effect:"crit",      ec:100, desc:"A leaf sharpened by concentrated sunlight that always finds weak points." },
  // --- Electric ---
  thunder_shock:{ name:"Thunder Shock", type:"Electric", power:40,  acc:100, pp:30, cat:"special",  effect:"paralyze",  ec:10,  desc:"A jolt of electricity. May paralyze." },
  thunderbolt:  { name:"Thunderbolt",   type:"Electric", power:90,  acc:100, pp:15, cat:"special",  effect:"paralyze",  ec:10,  desc:"A strong thunderbolt. May paralyze." },
  thunder:      { name:"Thunder",       type:"Electric", power:110, acc:70,  pp:10, cat:"special",  effect:"paralyze",  ec:30,  desc:"A massive thunderstrike. May paralyze." },
  thunder_wave: { name:"Thunder Wave",  type:"Electric", power:0,   acc:90,  pp:20, cat:"status",   effect:"paralyze",  ec:100, desc:"A weak electrical charge that paralyzes." },
  spark:        { name:"Spark",         type:"Electric", power:65,  acc:100, pp:20, cat:"physical", effect:"paralyze",  ec:30,  desc:"Electric tackle. May paralyze." },
  volt_surge:   { name:"Volt Surge",    type:"Electric", power:85,  acc:95,  pp:10, cat:"special",  effect:"paralyze",  ec:20,  desc:"A surging wave of voltage that overloads the foe's nervous system." },
  arc_flash:    { name:"Arc Flash",     type:"Electric", power:75,  acc:100, pp:15, cat:"special",  effect:"flinch",    ec:30,  desc:"Produces a blinding flash of electric arcing that may startle the foe." },
  static_cage:  { name:"Static Cage",   type:"Electric", power:0,   acc:90,  pp:15, cat:"status",   effect:"paralyze",  ec:100, desc:"Wraps the foe in a cage of crackling static electricity." },
  overcharge:   { name:"Overcharge",    type:"Electric", power:120, acc:85,  pp:5,  cat:"special",  effect:"recharge",  ec:100, desc:"Releases a catastrophic overcharge of electricity, requiring rest afterward." },
  plasma_strike:{ name:"Plasma Strike", type:"Electric", power:80,  acc:100, pp:10, cat:"physical", effect:"paralyze",  ec:30,  desc:"Surrounds the user's fist in superheated plasma for a shocking punch." },
  charge_burst: { name:"Charge Burst",  type:"Electric", power:0,   acc:100, pp:20, cat:"status",   effect:"atkup",     ec:100, desc:"Charges the body with electric potential, raising the next physical hit's power." },
  // --- Ground ---
  mud_shot:     { name:"Mud Shot",      type:"Ground",   power:55,  acc:95,  pp:15, cat:"special",  effect:"spedown",   ec:100, desc:"Hurls mud at the foe, lowering Speed." },
  earthquake:   { name:"Earthquake",    type:"Ground",   power:100, acc:100, pp:10, cat:"physical", effect:null,        ec:0,   desc:"A massive earthquake rattles the field." },
  earth_power:  { name:"Earth Power",   type:"Ground",   power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"The ground heaves beneath the foe." },
  sandstrike:   { name:"Sandstrike",    type:"Ground",   power:60,  acc:100, pp:20, cat:"physical", effect:"spedown",   ec:30,  desc:"Hurls a concentrated blast of cutting sand that slows the foe." },
  fissure_slam: { name:"Fissure Slam",  type:"Ground",   power:100, acc:85,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Slams the ground so hard it opens a fissure beneath the foe." },
  terra_spike:  { name:"Terra Spike",   type:"Ground",   power:80,  acc:95,  pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Drives a spike of compressed earth up through the ground at the foe." },
  dust_veil:    { name:"Dust Veil",     type:"Ground",   power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Surrounds the user in swirling dust that deflects incoming blows." },
  boulder_roll: { name:"Boulder Roll",  type:"Ground",   power:75,  acc:90,  pp:15, cat:"physical", effect:"flinch",    ec:30,  desc:"Curls into a ball and rolls into the foe with terrifying momentum." },
  quicksand_pull:{ name:"Quicksand Pull",type:"Ground",  power:65,  acc:90,  pp:15, cat:"special",  effect:"spedown2",  ec:100, desc:"Conjures a patch of quicksand that drags the foe's legs down." },
  // --- Wind ---
  gust:         { name:"Gust",          type:"Wind",     power:40,  acc:100, pp:35, cat:"special",  effect:null,        ec:0,   desc:"Blows the foe with a gust of wind." },
  air_slash:    { name:"Air Slash",     type:"Wind",     power:75,  acc:95,  pp:15, cat:"special",  effect:"flinch",    ec:30,  desc:"Slices with a blade of air. May flinch." },
  hurricane:    { name:"Hurricane",     type:"Wind",     power:110, acc:70,  pp:10, cat:"special",  effect:"confuse",   ec:30,  desc:"Slams the foe into a violent hurricane." },
  wing_attack:  { name:"Wing Attack",   type:"Wind",     power:60,  acc:100, pp:35, cat:"physical", effect:null,        ec:0,   desc:"Strikes with powerful wings." },
  jetstream:    { name:"Jetstream",     type:"Wind",     power:80,  acc:95,  pp:15, cat:"special",  effect:"spedown",   ec:20,  desc:"Fires a focused stream of high-speed air that batters the foe's footing." },
  skyfall:      { name:"Skyfall",       type:"Wind",     power:90,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Ascends to great height and plummets with crushing momentum." },
  cyclone_blade:{ name:"Cyclone Blade", type:"Wind",     power:85,  acc:95,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Spins to form a blade of compressed air and slashes the foe." },
  mistveil:     { name:"Mistveil",      type:"Wind",     power:0,   acc:100, pp:20, cat:"status",   effect:"spedown",   ec:100, desc:"Releases a mist that slows everything caught within it." },
  tailwind_strike:{ name:"Tailwind Strike",type:"Wind",  power:55,  acc:100, pp:20, cat:"physical", effect:"priority",  ec:0,   desc:"Rides a tailwind to smash into the foe before they can react." },
  zephyr_dance: { name:"Zephyr Dance",  type:"Wind",     power:0,   acc:100, pp:15, cat:"status",   effect:"dragondance",ec:100,desc:"A graceful aerial dance that raises Attack and Speed on the wind currents." },
  // --- Ice ---
  powder_snow:  { name:"Powder Snow",   type:"Ice",      power:40,  acc:100, pp:25, cat:"special",  effect:"freeze",    ec:10,  desc:"Pelts the foe with a hail of snow." },
  ice_beam:     { name:"Ice Beam",      type:"Ice",      power:90,  acc:100, pp:10, cat:"special",  effect:"freeze",    ec:10,  desc:"Fires a beam of ice. May freeze." },
  blizzard:     { name:"Blizzard",      type:"Ice",      power:110, acc:70,  pp:5,  cat:"special",  effect:"freeze",    ec:10,  desc:"A howling blizzard. May freeze." },
  ice_punch:    { name:"Ice Punch",     type:"Ice",      power:75,  acc:100, pp:15, cat:"physical", effect:"freeze",    ec:10,  desc:"A punch with an icy fist. May freeze." },
  icicle_crash: { name:"Icicle Crash",  type:"Ice",      power:85,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Drops icicles on the foe. May flinch." },
  glacial_shard:{ name:"Glacial Shard", type:"Ice",      power:65,  acc:100, pp:20, cat:"physical", effect:"freeze",    ec:15,  desc:"Fires a razor-sharp shard of glacial ice that may freeze the target." },
  frost_breath: { name:"Frost Breath",  type:"Ice",      power:60,  acc:90,  pp:15, cat:"special",  effect:"freeze",    ec:100, desc:"Exhales a breath of supercooled air that always freezes the foe." },
  permafrost:   { name:"Permafrost",    type:"Ice",      power:0,   acc:100, pp:15, cat:"status",   effect:"spedown2",  ec:100, desc:"Encases the foe's feet in permafrost, drastically reducing Speed." },
  avalanche_drive:{ name:"Avalanche Drive",type:"Ice",   power:95,  acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Surges forward with the full weight of a collapsing avalanche." },
  cryo_lance:   { name:"Cryo Lance",    type:"Ice",      power:80,  acc:95,  pp:15, cat:"special",  effect:"freeze",    ec:10,  desc:"Conjures a lance of pure ice crystal and hurls it at the opponent." },
  winter_shroud:{ name:"Winter Shroud", type:"Ice",      power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Wraps the user in a hardened shroud of ice that bolsters its defenses." },
  // --- Dark ---
  bite:         { name:"Bite",          type:"Dark",     power:60,  acc:100, pp:25, cat:"physical", effect:"flinch",    ec:30,  desc:"Bites with dark power. May cause flinching." },
  crunch:       { name:"Crunch",        type:"Dark",     power:80,  acc:100, pp:15, cat:"physical", effect:"defdown",   ec:20,  desc:"Crunches with dark fangs. May lower Defense." },
  shadow_ball:  { name:"Shadow Ball",   type:"Dark",     power:80,  acc:100, pp:15, cat:"special",  effect:"spdefdown", ec:20,  desc:"Hurls a shadowy blob. May lower Sp.Def." },
  night_slash:  { name:"Night Slash",   type:"Dark",     power:70,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes in the dark. High critical rate." },
  dark_pulse:   { name:"Dark Pulse",    type:"Dark",     power:80,  acc:100, pp:15, cat:"special",  effect:"flinch",    ec:20,  desc:"Fires pulses of dark energy." },
  void_rend:    { name:"Void Rend",     type:"Dark",     power:95,  acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Tears through the foe with a claw infused with the emptiness of the void." },
  shadowstep:   { name:"Shadowstep",    type:"Dark",     power:60,  acc:100, pp:20, cat:"physical", effect:"priority",  ec:0,   desc:"Steps through shadows to strike the foe before they can see it coming." },
  nightmare_pulse:{ name:"Nightmare Pulse",type:"Dark",  power:85,  acc:90,  pp:10, cat:"special",  effect:"confuse",   ec:30,  desc:"Bombards the foe's mind with terrifying nightmare imagery." },
  eclipse_shroud:{ name:"Eclipse Shroud",type:"Dark",    power:0,   acc:100, pp:15, cat:"status",   effect:"atkup2",    ec:100, desc:"Shrouds the user in absolute darkness, sharpening its predatory instincts." },
  obsidian_fang:{ name:"Obsidian Fang", type:"Dark",     power:75,  acc:100, pp:15, cat:"physical", effect:"poison",    ec:20,  desc:"Bites with fangs of living obsidian, may leave a dark toxin behind." },
  // --- Fairy ---
  fairy_wind:   { name:"Fairy Wind",    type:"Fairy",    power:40,  acc:100, pp:30, cat:"special",  effect:null,        ec:0,   desc:"Stirs up a fairy wind to strike." },
  moonblast:    { name:"Moonblast",     type:"Fairy",    power:95,  acc:100, pp:15, cat:"special",  effect:"spatkdown", ec:30,  desc:"Attacks using moonlight. May lower Sp.Atk." },
  dazzling_gleam:{ name:"Dazzling Gleam",type:"Fairy",  power:80,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Emits a powerful flash of light." },
  sweet_kiss:   { name:"Sweet Kiss",    type:"Fairy",    power:0,   acc:75,  pp:10, cat:"status",   effect:"confuse",   ec:100, desc:"An angel's kiss that confuses the foe." },
  stardust_veil:{ name:"Stardust Veil", type:"Fairy",    power:0,   acc:100, pp:20, cat:"status",   effect:"calmup",    ec:100, desc:"Wraps the user in drifting stardust that enhances special power and resilience." },
  pixie_bolt:   { name:"Pixie Bolt",    type:"Fairy",    power:75,  acc:100, pp:15, cat:"special",  effect:"confuse",   ec:20,  desc:"Fires a bolt of concentrated pixie energy that scrambles the foe's mind." },
  charm_bloom:  { name:"Charm Bloom",   type:"Fairy",    power:0,   acc:90,  pp:20, cat:"status",   effect:"atkdown",   ec:100, desc:"Releases a bloom of irresistible charm that weakens the foe's will to attack." },
  celestial_wave:{ name:"Celestial Wave",type:"Fairy",   power:90,  acc:95,  pp:10, cat:"special",  effect:"spatkdown", ec:20,  desc:"Channels the light of distant stars into a sweeping radiant wave." },
  wish_spark:   { name:"Wish Spark",    type:"Fairy",    power:55,  acc:100, pp:25, cat:"special",  effect:null,        ec:0,   desc:"A spark of pure wish-energy that banishes negative feelings and harms the foe." },
  moonveil:     { name:"Moonveil",      type:"Fairy",    power:85,  acc:90,  pp:10, cat:"physical", effect:"spdefdown", ec:20,  desc:"Slashes with a blade woven from moonlight, cutting through special defenses." },
  // --- Steel ---
  steel_wing:   { name:"Steel Wing",    type:"Steel",    power:70,  acc:90,  pp:25, cat:"physical", effect:"defup",     ec:10,  desc:"Strikes with steel wings. May raise Defense." },
  iron_tail:    { name:"Iron Tail",     type:"Steel",    power:100, acc:75,  pp:15, cat:"physical", effect:"defdown",   ec:30,  desc:"Slams with a steel-hard tail. May lower Defense." },
  flash_cannon: { name:"Flash Cannon",  type:"Steel",    power:80,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"Fires a flash of steel-colored light." },
  metal_claw:   { name:"Metal Claw",    type:"Steel",    power:50,  acc:95,  pp:35, cat:"physical", effect:"atkup",     ec:10,  desc:"Slashes with steel claws. May raise Attack." },
  forge_strike: { name:"Forge Strike",  type:"Steel",    power:90,  acc:95,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Strikes with a blow as powerful as a forge hammer, denting armor." },
  tungsten_ram: { name:"Tungsten Ram",  type:"Steel",    power:110, acc:85,  pp:5,  cat:"physical", effect:"recharge",  ec:100, desc:"Charges with the density of tungsten in a devastating ram that needs recovery." },
  magnetize:    { name:"Magnetize",     type:"Steel",    power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Polarizes the user's body magnetically to repel incoming metal-based attacks." },
  shrapnel_burst:{ name:"Shrapnel Burst",type:"Steel",   power:75,  acc:90,  pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Explodes fragments of sharp metal in all directions to damage the foe." },
  alloy_edge:   { name:"Alloy Edge",    type:"Steel",    power:65,  acc:100, pp:20, cat:"physical", effect:"crit",      ec:100, desc:"Slices with a blade of impossibly sharp layered alloy, always finding weak spots." },
  ironskin:     { name:"Ironskin",      type:"Steel",    power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Hardens the surface of the body to the density of pure iron." },
  // --- Poison ---
  poison_sting: { name:"Poison Sting",  type:"Poison",   power:15,  acc:100, pp:35, cat:"physical", effect:"poison",    ec:30,  desc:"Stings with a poisonous stinger." },
  sludge_bomb:  { name:"Sludge Bomb",   type:"Poison",   power:90,  acc:100, pp:10, cat:"special",  effect:"poison",    ec:30,  desc:"Hurls a sludge bomb. May poison." },
  toxic:        { name:"Toxic",         type:"Poison",   power:0,   acc:90,  pp:10, cat:"status",   effect:"badpoison", ec:100, desc:"Badly poisons the foe. Damage worsens each turn." },
  venoshock:    { name:"Venoshock",     type:"Poison",   power:65,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Doubles damage if target is poisoned." },
  miasma_cloud: { name:"Miasma Cloud",  type:"Poison",   power:70,  acc:90,  pp:15, cat:"special",  effect:"badpoison", ec:30,  desc:"Releases a dense toxic cloud that seeps into wounds and worsens over time." },
  acid_rain:    { name:"Acid Rain",     type:"Poison",   power:80,  acc:90,  pp:10, cat:"special",  effect:"poison",    ec:50,  desc:"Summons a rain of burning acid that corrodes the foe's body." },
  venom_lance:  { name:"Venom Lance",   type:"Poison",   power:85,  acc:95,  pp:10, cat:"physical", effect:"badpoison", ec:20,  desc:"Drives a concentrated venom spike deep into the foe." },
  toxic_surge:  { name:"Toxic Surge",   type:"Poison",   power:0,   acc:100, pp:15, cat:"status",   effect:"badpoison", ec:100, desc:"Surges venom through the battlefield, severely poisoning the target." },
  sludge_wave:  { name:"Sludge Wave",   type:"Poison",   power:95,  acc:95,  pp:10, cat:"special",  effect:"poison",    ec:30,  desc:"Unleashes a tidal wave of thick corrosive sludge." },
  putrid_pulse: { name:"Putrid Pulse",  type:"Poison",   power:75,  acc:100, pp:15, cat:"special",  effect:"confuse",   ec:20,  desc:"Emits a nauseating pulse of putrid energy that may disorient the foe." },
  // --- Psychic ---
  confusion:    { name:"Confusion",     type:"Psychic",  power:50,  acc:100, pp:25, cat:"special",  effect:"confuse",   ec:10,  desc:"A telekinetic attack. May confuse." },
  psybeam:      { name:"Psybeam",       type:"Psychic",  power:65,  acc:100, pp:20, cat:"special",  effect:"confuse",   ec:10,  desc:"Shoots a peculiar ray. May confuse." },
  psychic_move: { name:"Psychic",       type:"Psychic",  power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"A powerful psychic wave. May lower Sp.Def." },
  psystrike:    { name:"Psystrike",     type:"Psychic",  power:100, acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Materializes psychic power to attack." },
  calm_mind:    { name:"Calm Mind",     type:"Psychic",  power:0,   acc:100, pp:20, cat:"status",   effect:"calmup",    ec:100, desc:"Raises Sp.Atk and Sp.Def by 1 stage." },
  mind_shatter: { name:"Mind Shatter",  type:"Psychic",  power:100, acc:90,  pp:10, cat:"special",  effect:"spdefdown", ec:30,  desc:"Shatters the foe's mental fortitude with a concentrated psychic burst." },
  telepathic_slam:{ name:"Telepathic Slam",type:"Psychic",power:85, acc:95,  pp:10, cat:"special",  effect:"confuse",   ec:30,  desc:"Reads the foe's thoughts and strikes using their own fear against them." },
  future_echo:  { name:"Future Echo",   type:"Psychic",  power:80,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Sends an echo of future energy that strikes the foe one turn ahead of time." },
  insight_flare:{ name:"Insight Flare", type:"Psychic",  power:75,  acc:100, pp:15, cat:"special",  effect:"crit",      ec:100, desc:"Flares with intense mental insight, always finding the critical point." },
  thought_crush:{ name:"Thought Crush", type:"Psychic",  power:90,  acc:85,  pp:10, cat:"special",  effect:"spdefdown", ec:20,  desc:"Crushes the foe's mind with overwhelming psychokinetic force." },
  // --- Dragon ---
  dragon_breath:{ name:"Dragon Breath", type:"Dragon",   power:60,  acc:100, pp:20, cat:"special",  effect:"paralyze",  ec:30,  desc:"Exhales a dragon's breath. May paralyze." },
  dragon_claw:  { name:"Dragon Claw",   type:"Dragon",   power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Slashes with razor-sharp dragon claws." },
  dragon_pulse: { name:"Dragon Pulse",  type:"Dragon",   power:85,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Fires a shockwave of dragon energy." },
  outrage:      { name:"Outrage",       type:"Dragon",   power:120, acc:100, pp:10, cat:"physical", effect:"confuse",   ec:100, desc:"A 2-3 turn rampage. Confuses user after." },
  dragon_dance: { name:"Dragon Dance",  type:"Dragon",   power:0,   acc:100, pp:20, cat:"status",   effect:"dragondance",ec:100,desc:"A ritualistic dance that raises Atk and Speed." },
  wyrm_strike:  { name:"Wyrm Strike",   type:"Dragon",   power:90,  acc:95,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Strikes with the coiled force of an ancient wyrm's tail." },
  draconic_roar:{ name:"Draconic Roar", type:"Dragon",   power:0,   acc:100, pp:15, cat:"status",   effect:"atkdown",   ec:100, desc:"Unleashes a terrifying draconic roar that withers the foe's fighting spirit." },
  scale_storm:  { name:"Scale Storm",   type:"Dragon",   power:95,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Whips a storm of razor-edged dragon scales across the battlefield." },
  ancient_breath:{ name:"Ancient Breath",type:"Dragon",  power:110, acc:85,  pp:5,  cat:"special",  effect:"burn",      ec:30,  desc:"Exhales flame from the lungs of an ancient dragon lineage." },
  eon_crash:    { name:"Eon Crash",     type:"Dragon",   power:100, acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Crashes down with the timeless weight of dragonkind." },
  // --- Rock ---
  rock_throw:   { name:"Rock Throw",    type:"Rock",     power:50,  acc:90,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Hurls a small rock at the foe." },
  rock_slide:   { name:"Rock Slide",    type:"Rock",     power:75,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Large boulders fall on the foe. May flinch." },
  stone_edge:   { name:"Stone Edge",    type:"Rock",     power:100, acc:80,  pp:5,  cat:"physical", effect:"crit",      ec:100, desc:"Stabs with sharp stones. High critical." },
  obsidian_crash:{ name:"Obsidian Crash",type:"Rock",    power:85,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Crashes an enormous slab of obsidian onto the foe." },
  geode_burst:  { name:"Geode Burst",   type:"Rock",     power:80,  acc:95,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Hurls a hollow geode that shatters on impact, scattering crystal shards." },
  crystal_lance:{ name:"Crystal Lance", type:"Rock",     power:90,  acc:90,  pp:10, cat:"physical", effect:"crit",      ec:100, desc:"Drives a lance of perfectly formed crystal at the foe with perfect accuracy." },
  granite_wall: { name:"Granite Wall",  type:"Rock",     power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Erects a wall of granite around the user, massively raising Defense." },
  landslide:    { name:"Landslide",     type:"Rock",     power:95,  acc:85,  pp:10, cat:"physical", effect:"spedown",   ec:100, desc:"Triggers a devastating landslide that buries the foe under rubble." },
  // --- Bug ---
  bug_bite:     { name:"Bug Bite",      type:"Bug",      power:60,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"Bites the foe with bug mandibles." },
  bug_buzz:     { name:"Bug Buzz",      type:"Bug",      power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"Emits a harsh buzzing sound." },
  x_scissor:    { name:"X-Scissor",     type:"Bug",      power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Slashes the foe in an X shape." },
  string_shot:  { name:"String Shot",   type:"Bug",      power:0,   acc:95,  pp:40, cat:"status",   effect:"spedown2",  ec:100, desc:"Binds the foe with string, slowing them." },
  silk_bind:    { name:"Silk Bind",     type:"Bug",      power:55,  acc:95,  pp:20, cat:"physical", effect:"spedown",   ec:100, desc:"Wraps the foe in strong silk threads that bind and slow their movement." },
  mandible_crush:{ name:"Mandible Crush",type:"Bug",     power:85,  acc:95,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Crushes the foe between massive mandibles with bone-cracking force." },
  swarm_dive:   { name:"Swarm Dive",    type:"Bug",      power:80,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Dives into the foe alongside a swarm of allies in a coordinated assault." },
  venom_drool:  { name:"Venom Drool",   type:"Bug",      power:65,  acc:100, pp:15, cat:"special",  effect:"poison",    ec:30,  desc:"Drools corrosive bug venom that seeps through the foe's defenses." },
  chitin_guard: { name:"Chitin Guard",  type:"Bug",      power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Hardens the chitin exoskeleton to deflect incoming attacks." },
  sonic_buzz:   { name:"Sonic Buzz",    type:"Bug",      power:75,  acc:100, pp:15, cat:"special",  effect:"confuse",   ec:20,  desc:"Produces a disorienting high-frequency buzz that rattles the foe's mind." },

  // --- NEW: Fire (2 more → 15) ---
  ashfall:      { name:"Ashfall",       type:"Fire",     power:70,  acc:100, pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Rains superheated volcanic ash that chokes and slows the target." },
  pyre_fang:    { name:"Pyre Fang",     type:"Fire",     power:85,  acc:95,  pp:10, cat:"physical", effect:"burn",      ec:20,  desc:"Sinks incandescent fangs deep into the foe, leaving smoldering wounds." },

  // --- NEW: Water (3 more → 15) ---
  riptide_slam: { name:"Riptide Slam",  type:"Water",    power:85,  acc:95,  pp:10, cat:"physical", effect:"spedown",   ec:30,  desc:"Catches the foe in a violent riptide and slams them into the seabed." },
  geyser_burst: { name:"Geyser Burst",  type:"Water",    power:110, acc:80,  pp:5,  cat:"special",  effect:"burn",      ec:20,  desc:"Erupts a scalding geyser from deep underground that may scald the foe." },
  deepwater_hymn:{ name:"Deepwater Hymn",type:"Water",   power:0,   acc:100, pp:15, cat:"status",   effect:"calmup",    ec:100, desc:"Sings the ancient song of the ocean depths to bolster special power." },

  // --- NEW: Grass (3 more → 15) ---
  briar_lash:   { name:"Briar Lash",    type:"Grass",    power:75,  acc:100, pp:15, cat:"physical", effect:"poison",    ec:20,  desc:"Lashes the foe with thorny briars coated in natural toxin." },
  mycelia_net:  { name:"Mycelia Net",   type:"Grass",    power:0,   acc:90,  pp:15, cat:"status",   effect:"spedown2",  ec:100, desc:"Spreads a web of fungal threads that entangles and drastically slows the target." },
  grove_wrath:  { name:"Grove Wrath",   type:"Grass",    power:100, acc:85,  pp:5,  cat:"physical", effect:"flinch",    ec:30,  desc:"Channels the fury of an ancient forest into a devastating trunk-shattering strike." },

  // --- NEW: Electric (4 more → 15) ---
  dynamo_whip:  { name:"Dynamo Whip",   type:"Electric", power:70,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Cracks a whip of concentrated lightning across the opponent." },
  surge_field:  { name:"Surge Field",   type:"Electric", power:0,   acc:100, pp:15, cat:"status",   effect:"speup",     ec:100, desc:"Charges the ground with electricity, accelerating the user's movements." },
  voltaic_fang: { name:"Voltaic Fang",  type:"Electric", power:85,  acc:95,  pp:10, cat:"physical", effect:"paralyze",  ec:20,  desc:"Bites with electrified fangs that discharge thousands of volts." },
  ball_lightning:{ name:"Ball Lightning",type:"Electric", power:95,  acc:90,  pp:10, cat:"special",  effect:"paralyze",  ec:20,  desc:"Conjures a sphere of rogue lightning that drifts toward the foe and detonates." },

  // --- NEW: Ground (6 more → 15) ---
  sinkhole_maw: { name:"Sinkhole Maw",  type:"Ground",   power:85,  acc:90,  pp:10, cat:"physical", effect:"spedown",   ec:30,  desc:"Opens a gaping sinkhole beneath the foe that swallows them briefly." },
  tremor_stomp: { name:"Tremor Stomp",  type:"Ground",   power:70,  acc:100, pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Stomps the earth with enough force to send shockwaves through the foe's bones." },
  clay_armor:   { name:"Clay Armor",    type:"Ground",   power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Packs the body in layers of hardened clay, sharply raising Defense." },
  sand_geyser:  { name:"Sand Geyser",   type:"Ground",   power:80,  acc:95,  pp:10, cat:"special",  effect:"confuse",   ec:20,  desc:"Blasts the foe with a high-pressure jet of superheated sand." },
  tectonic_slam:{ name:"Tectonic Slam", type:"Ground",   power:110, acc:85,  pp:5,  cat:"physical", effect:"defdown",   ec:20,  desc:"Shifts the tectonic plates beneath the foe with catastrophic force." },
  loam_leech:   { name:"Loam Leech",    type:"Ground",   power:60,  acc:100, pp:15, cat:"special",  effect:"drain",     ec:100, desc:"Drains the foe's energy through the soil, restoring the user's vitality." },

  // --- NEW: Wind (5 more → 15) ---
  downdraft:    { name:"Downdraft",     type:"Wind",     power:65,  acc:100, pp:20, cat:"special",  effect:"spedown",   ec:30,  desc:"Forces a column of heavy air down on the foe, crushing their momentum." },
  thermal_dive: { name:"Thermal Dive",  type:"Wind",     power:90,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Rides a thermal updraft to extreme height, then dives with devastating force." },
  squall_slash: { name:"Squall Slash",  type:"Wind",     power:80,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with wind-hardened feathers during a sudden squall. High crit rate." },
  vortex_trap:  { name:"Vortex Trap",   type:"Wind",     power:0,   acc:85,  pp:15, cat:"status",   effect:"confuse",   ec:100, desc:"Traps the foe in a disorienting vortex that scrambles their senses." },
  gale_cannon:  { name:"Gale Cannon",   type:"Wind",     power:110, acc:80,  pp:5,  cat:"special",  effect:"flinch",    ec:30,  desc:"Compresses air into a devastating lance of wind and fires it at the foe." },

  // --- NEW: Ice (4 more → 15) ---
  hoarfrost_bite:{ name:"Hoarfrost Bite",type:"Ice",     power:70,  acc:100, pp:15, cat:"physical", effect:"freeze",    ec:15,  desc:"Bites with jaws rimed in hoarfrost that may flash-freeze the wound." },
  sleet_barrage:{ name:"Sleet Barrage", type:"Ice",      power:60,  acc:90,  pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Pelts the foe with a rapid barrage of razor-sharp sleet shards." },
  glacial_tomb: { name:"Glacial Tomb",  type:"Ice",      power:95,  acc:85,  pp:10, cat:"special",  effect:"freeze",    ec:20,  desc:"Encases the foe in a tomb of glacial ice that may leave them frozen." },
  frostfire_veil:{ name:"Frostfire Veil",type:"Ice",     power:0,   acc:100, pp:15, cat:"status",   effect:"calmup",    ec:100, desc:"Wraps the user in a paradoxical veil of freezing flame that sharpens the mind." },

  // --- NEW: Dark (5 more → 15) ---
  umbral_claw:  { name:"Umbral Claw",   type:"Dark",     power:80,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Rakes the foe with claws forged from living shadow. High crit rate." },
  dread_howl:   { name:"Dread Howl",    type:"Dark",     power:0,   acc:100, pp:15, cat:"status",   effect:"spatkdown", ec:100, desc:"Emits a howl of pure dread that saps the foe's will to use special attacks." },
  abyssal_snare:{ name:"Abyssal Snare", type:"Dark",     power:70,  acc:95,  pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Tendrils of darkness coil around the foe, dragging them into sluggishness." },
  blackout_bomb:{ name:"Blackout Bomb",  type:"Dark",     power:90,  acc:90,  pp:10, cat:"special",  effect:"confuse",   ec:30,  desc:"Detonates a sphere of absolute darkness that disorients everything nearby." },
  soul_rend:    { name:"Soul Rend",     type:"Dark",     power:100, acc:85,  pp:5,  cat:"special",  effect:"spdefdown", ec:30,  desc:"Tears at the foe's spiritual essence, shredding their mental resilience." },

  // --- NEW: Fairy (5 more → 15) ---
  gossamer_lance:{ name:"Gossamer Lance",type:"Fairy",   power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Drives a lance of crystallized fairy light through the foe." },
  aurora_veil:  { name:"Aurora Veil",   type:"Fairy",    power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Wraps the user in shimmering aurora light that deflects attacks." },
  dream_eater:  { name:"Dream Eater",   type:"Fairy",    power:75,  acc:100, pp:15, cat:"special",  effect:"drain",     ec:100, desc:"Devours the foe's pleasant dreams, restoring the user's health." },
  glitter_storm:{ name:"Glitter Storm", type:"Fairy",    power:95,  acc:90,  pp:10, cat:"special",  effect:"spatkdown", ec:20,  desc:"Unleashes a storm of razor-sharp glitter that dazzles and cuts." },
  fae_requiem:  { name:"Fae Requiem",   type:"Fairy",    power:110, acc:80,  pp:5,  cat:"special",  effect:"confuse",   ec:30,  desc:"Sings an ancient fairy requiem that overwhelms the foe's mind." },

  // --- NEW: Steel (5 more → 15) ---
  rivet_barrage:{ name:"Rivet Barrage", type:"Steel",    power:70,  acc:90,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Fires a hail of white-hot rivets from the body at the foe." },
  smelt_crush:  { name:"Smelt Crush",   type:"Steel",    power:95,  acc:90,  pp:10, cat:"physical", effect:"burn",      ec:20,  desc:"Crushes the foe with superheated molten metal arms." },
  temper_edge:  { name:"Temper Edge",   type:"Steel",    power:80,  acc:100, pp:10, cat:"physical", effect:"atkup",     ec:20,  desc:"Strikes with a perfectly tempered blade that hones the user's edge." },
  slag_shield:  { name:"Slag Shield",   type:"Steel",    power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Coats the body in cooling slag that hardens into impenetrable armor." },
  anvil_drop:   { name:"Anvil Drop",    type:"Steel",    power:120, acc:80,  pp:5,  cat:"physical", effect:"flinch",    ec:30,  desc:"Drops from above with the devastating weight of a falling anvil." },

  // --- NEW: Poison (5 more → 15) ---
  blight_mist:  { name:"Blight Mist",   type:"Poison",   power:60,  acc:100, pp:20, cat:"special",  effect:"poison",    ec:50,  desc:"Exhales a sickly green mist that infects the foe with creeping blight." },
  corrosion_fang:{ name:"Corrosion Fang",type:"Poison",  power:80,  acc:95,  pp:15, cat:"physical", effect:"defdown",   ec:30,  desc:"Bites with fangs dripping in armor-dissolving corrosive venom." },
  toxin_bloom:  { name:"Toxin Bloom",   type:"Poison",   power:0,   acc:100, pp:10, cat:"status",   effect:"atkup2",    ec:100, desc:"Absorbs ambient toxins to stimulate the body's aggressive potential." },
  nerve_agent:  { name:"Nerve Agent",   type:"Poison",   power:55,  acc:100, pp:20, cat:"special",  effect:"paralyze",  ec:30,  desc:"Releases a fast-acting nerve toxin that locks up the foe's muscles." },
  plague_burst: { name:"Plague Burst",  type:"Poison",   power:100, acc:85,  pp:5,  cat:"special",  effect:"badpoison", ec:50,  desc:"Detonates a concentrated mass of plague spores in a devastating blast." },

  // --- NEW: Psychic (5 more → 15) ---
  dreamweave:   { name:"Dreamweave",    type:"Psychic",  power:70,  acc:100, pp:15, cat:"special",  effect:"sleep",     ec:20,  desc:"Weaves a psychic web of drowsy imagery that may lull the foe to sleep." },
  cortex_spike: { name:"Cortex Spike",  type:"Psychic",  power:85,  acc:95,  pp:10, cat:"special",  effect:"crit",      ec:100, desc:"Drives a spike of psychic force into the foe's cortex. High crit rate." },
  prism_ward:   { name:"Prism Ward",    type:"Psychic",  power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Projects a shimmering psychic prism that refracts incoming attacks." },
  neural_storm: { name:"Neural Storm",  type:"Psychic",  power:100, acc:85,  pp:5,  cat:"special",  effect:"confuse",   ec:50,  desc:"Unleashes a chaotic storm of psychic impulses that overwhelms the foe's brain." },
  astral_rend:  { name:"Astral Rend",   type:"Psychic",  power:90,  acc:95,  pp:10, cat:"special",  effect:"spdefdown", ec:20,  desc:"Tears the foe's astral form loose, exposing their mental defenses." },

  // --- NEW: Dragon (5 more → 15) ---
  draco_fang:   { name:"Draco Fang",    type:"Dragon",   power:75,  acc:100, pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Sinks draconic fangs infused with primal power into the foe." },
  wyvern_gust:  { name:"Wyvern Gust",   type:"Dragon",   power:65,  acc:100, pp:20, cat:"special",  effect:"spedown",   ec:30,  desc:"Beats wings with dragonfire to blast the foe with scorching wind." },
  primordial_roar:{ name:"Primordial Roar",type:"Dragon", power:0,   acc:100, pp:10, cat:"status",   effect:"atkup2",    ec:100, desc:"Roars with the voice of the first dragon, surging with primal battle fury." },
  drake_rush:   { name:"Drake Rush",    type:"Dragon",   power:90,  acc:95,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Charges forward with draconic speed and slams the foe with full momentum." },
  cataclysm_breath:{ name:"Cataclysm Breath",type:"Dragon",power:130,acc:75, pp:5,  cat:"special",  effect:"burn",      ec:20,  desc:"Exhales a breath of world-ending dragonfire that incinerates everything." },

  // --- NEW: Rock (7 more → 15) ---
  stalactite_drop:{ name:"Stalactite Drop",type:"Rock",   power:70,  acc:95,  pp:15, cat:"physical", effect:"flinch",    ec:30,  desc:"Drops massive stalactites from above that crash down on the foe." },
  fossil_rush:  { name:"Fossil Rush",   type:"Rock",     power:80,  acc:100, pp:10, cat:"physical", effect:null,        ec:0,   desc:"Charges with the hardened force of an ancient fossil embedded in the body." },
  gem_scatter:  { name:"Gem Scatter",   type:"Rock",     power:65,  acc:90,  pp:15, cat:"special",  effect:"spdefdown", ec:20,  desc:"Shatters gemstones and scatters razor-sharp fragments at the foe." },
  bedrock_slam: { name:"Bedrock Slam",  type:"Rock",     power:110, acc:80,  pp:5,  cat:"physical", effect:"recharge",  ec:100, desc:"Slams with the weight of pure bedrock. Must recharge afterward." },
  petrify_gaze: { name:"Petrify Gaze",  type:"Rock",     power:0,   acc:80,  pp:15, cat:"status",   effect:"paralyze",  ec:100, desc:"Fixes the foe with a stony gaze that locks their body in place." },
  sandstone_rush:{ name:"Sandstone Rush",type:"Rock",     power:75,  acc:95,  pp:15, cat:"physical", effect:"spedown",   ec:30,  desc:"Grinds through the foe with a body hardened into rough sandstone." },
  magma_rock:   { name:"Magma Rock",    type:"Rock",     power:85,  acc:90,  pp:10, cat:"special",  effect:"burn",      ec:20,  desc:"Hurls a boulder of still-molten magma rock that scorches on impact." },

  // --- NEW: Bug (5 more → 15) ---
  compound_glare:{ name:"Compound Glare",type:"Bug",     power:0,   acc:100, pp:20, cat:"status",   effect:"spatkdown", ec:100, desc:"Fixes the foe with thousands of compound eyes, unnerving their focus." },
  pheromone_rush:{ name:"Pheromone Rush",type:"Bug",      power:60,  acc:100, pp:20, cat:"physical", effect:"priority",  ec:0,   desc:"Releases attack pheromones and charges with insectile speed." },
  cocoon_burst: { name:"Cocoon Burst",  type:"Bug",      power:85,  acc:95,  pp:10, cat:"special",  effect:null,        ec:0,   desc:"Shatters its cocoon in an explosive burst of metamorphic energy." },
  stinger_volley:{ name:"Stinger Volley",type:"Bug",     power:90,  acc:85,  pp:10, cat:"physical", effect:"poison",    ec:30,  desc:"Fires a volley of venomous stingers in rapid succession." },
  moth_dust:    { name:"Moth Dust",     type:"Bug",      power:0,   acc:85,  pp:15, cat:"status",   effect:"sleep",     ec:100, desc:"Scatters iridescent scales from moth wings that induce deep sleep." },

  // --- SIGNATURE MOVES for remaining legendaries ---
  tempest_wrath:{ name:"Tempest Wrath", type:"Wind",     power:120, acc:85,  pp:5,  cat:"special",  effect:"confuse",   ec:50,  desc:"Signature move of Tempestia. Unleashes the fury of a divine storm that shatters the foe's composure." },
  caldera_meltdown:{ name:"Caldera Meltdown",type:"Fire", power:130, acc:80, pp:5,  cat:"special",  effect:"burn",      ec:100, desc:"Signature move of Volcanox. Triggers a volcanic caldera collapse of apocalyptic heat." },
  temporal_rift:{ name:"Temporal Rift",  type:"Psychic",  power:110, acc:90,  pp:5,  cat:"special",  effect:"confuse",   ec:50,  desc:"Signature move of Chronoveil. Tears a rift in time that disorients the foe completely." },
  worldseed_quake:{ name:"Worldseed Quake",type:"Ground", power:120, acc:85, pp:5,  cat:"physical", effect:"defdown",   ec:50,  desc:"Signature move of Terranova. Cracks the earth with the force of a continental seed germinating." },

  // --- ROUND 3: Expanding all types to 22 ---

  // Normal (+5 → 22)
  double_strike: { name:"Double Strike", type:"Normal",   power:50,  acc:95,  pp:20, cat:"physical", effect:null,        ec:0,   desc:"Hits twice in rapid succession with blinding speed." },
  focus_roar:    { name:"Focus Roar",    type:"Normal",   power:0,   acc:100, pp:15, cat:"status",   effect:"spatkup",   ec:100, desc:"Roars with focused intent, sharpening the user's special attack." },
  reckless_charge:{ name:"Reckless Charge",type:"Normal", power:120, acc:100, pp:15, cat:"physical", effect:"recoil",    ec:100, desc:"A reckless full-body charge that also damages the user." },
  endure_pulse:  { name:"Endure Pulse",  type:"Normal",   power:0,   acc:100, pp:10, cat:"status",   effect:"defup",     ec:100, desc:"Pulses with survival energy, steeling the body for the next blow." },
  feral_swipe:   { name:"Feral Swipe",   type:"Normal",   power:65,  acc:100, pp:20, cat:"physical", effect:"atkup",     ec:20,  desc:"A savage swipe driven by primal instinct that may power up the user." },

  // Fire (+6 → 22)
  flash_fire:    { name:"Flash Fire",    type:"Fire",     power:50,  acc:100, pp:25, cat:"special",  effect:null,        ec:0,   desc:"A quick burst of concentrated flame." },
  lava_plume:    { name:"Lava Plume",    type:"Fire",     power:80,  acc:100, pp:15, cat:"special",  effect:"burn",      ec:30,  desc:"Erupts lava in all directions, likely to burn." },
  smolder_trap:  { name:"Smolder Trap",  type:"Fire",     power:0,   acc:90,  pp:15, cat:"status",   effect:"burn",      ec:100, desc:"Lays a trap of smoldering coals that burns the foe." },
  ignition_kick: { name:"Ignition Kick", type:"Fire",     power:90,  acc:95,  pp:10, cat:"physical", effect:"burn",      ec:20,  desc:"Delivers a combustion-powered kick wreathed in ignited air." },
  wildfire_surge:{ name:"Wildfire Surge",type:"Fire",     power:95,  acc:85,  pp:10, cat:"special",  effect:"burn",      ec:30,  desc:"Unleashes an uncontrollable wildfire that sweeps across the field." },
  cinder_lance:  { name:"Cinder Lance",  type:"Fire",     power:75,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Thrusts a lance of compressed cinder at a vital point. High crit rate." },

  // Water (+7 → 22)
  aqua_jet:      { name:"Aqua Jet",      type:"Water",    power:40,  acc:100, pp:20, cat:"physical", effect:"priority",  ec:0,   desc:"Strikes first by surrounding the body in water and charging." },
  rain_dance:    { name:"Rain Dance",    type:"Water",    power:0,   acc:100, pp:10, cat:"status",   effect:"spatkup",   ec:100, desc:"Calls down rain to boost the user's special attack." },
  torrent_fang:  { name:"Torrent Fang",  type:"Water",    power:80,  acc:95,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Bites with fangs sheathed in pressurized water." },
  whirlpool:     { name:"Whirlpool",     type:"Water",    power:70,  acc:85,  pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Traps the foe in a churning whirlpool that slows their escape." },
  ocean_tempest: { name:"Ocean Tempest", type:"Water",    power:100, acc:80,  pp:5,  cat:"special",  effect:"confuse",   ec:30,  desc:"Summons a furious ocean tempest that batters and confuses." },
  brine_slash:   { name:"Brine Slash",   type:"Water",    power:65,  acc:100, pp:20, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with a blade of crystallized brine. High crit rate." },
  tidal_blessing:{ name:"Tidal Blessing",type:"Water",    power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Draws on the ocean's grace to restore the user's vitality." },

  // Grass (+7 → 22)
  leaf_blade:    { name:"Leaf Blade",    type:"Grass",    power:90,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with a blade-sharp leaf. High crit rate." },
  synthesis:     { name:"Synthesis",     type:"Grass",    power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Absorbs sunlight to restore the user's health." },
  thorn_barrage: { name:"Thorn Barrage", type:"Grass",    power:70,  acc:95,  pp:15, cat:"physical", effect:"poison",    ec:20,  desc:"Fires a barrage of poisoned thorns at the target." },
  jungle_hammer: { name:"Jungle Hammer",type:"Grass",    power:110, acc:90,  pp:5,  cat:"physical", effect:"recoil",    ec:100, desc:"Slams with a massive jungle root. The impact recoils on the user." },
  pollen_storm:  { name:"Pollen Storm",  type:"Grass",    power:85,  acc:90,  pp:10, cat:"special",  effect:"sleep",     ec:20,  desc:"Whips up a storm of sleep-inducing pollen." },
  root_drain:    { name:"Root Drain",    type:"Grass",    power:75,  acc:100, pp:15, cat:"special",  effect:"drain",     ec:100, desc:"Sends roots into the foe to drain their energy and heal the user." },
  bark_shield:   { name:"Bark Shield",   type:"Grass",    power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Grows a thick bark shield that raises the user's defense." },

  // Electric (+7 → 22)
  wild_charge:   { name:"Wild Charge",   type:"Electric", power:90,  acc:100, pp:15, cat:"physical", effect:"recoil",    ec:100, desc:"An electrified reckless tackle that also hurts the user." },
  shock_wave:    { name:"Shock Wave",    type:"Electric", power:60,  acc:100, pp:20, cat:"special",  effect:null,        ec:0,   desc:"A wave of electricity that never misses." },
  magnet_rise:   { name:"Magnet Rise",   type:"Electric", power:0,   acc:100, pp:15, cat:"status",   effect:"speup",     ec:100, desc:"Levitates using electromagnetic force, boosting speed." },
  ion_cannon:    { name:"Ion Cannon",    type:"Electric", power:100, acc:85,  pp:5,  cat:"special",  effect:"spdefdown", ec:30,  desc:"Fires a concentrated beam of ions that shreds special defense." },
  chain_spark:   { name:"Chain Spark",   type:"Electric", power:70,  acc:95,  pp:15, cat:"special",  effect:"paralyze",  ec:20,  desc:"Sparks that chain between targets, likely to paralyze." },
  volt_fang:     { name:"Volt Fang",     type:"Electric", power:75,  acc:95,  pp:15, cat:"physical", effect:"paralyze",  ec:20,  desc:"Bites with electrically charged fangs." },
  discharge:     { name:"Discharge",     type:"Electric", power:80,  acc:100, pp:15, cat:"special",  effect:"paralyze",  ec:30,  desc:"Releases a massive electrical discharge in all directions." },

  // Ground (+6 → 22)
  drill_run:     { name:"Drill Run",     type:"Ground",   power:80,  acc:95,  pp:10, cat:"physical", effect:"crit",      ec:100, desc:"Spins like a drill and crashes into the foe. High crit rate." },
  mud_bomb:      { name:"Mud Bomb",      type:"Ground",   power:65,  acc:85,  pp:10, cat:"special",  effect:"spdefdown", ec:30,  desc:"Hurls a large ball of mud that may lower accuracy." },
  scorched_earth:{ name:"Scorched Earth",type:"Ground",   power:90,  acc:90,  pp:10, cat:"special",  effect:"burn",      ec:20,  desc:"Superheats the ground beneath the foe until it scorches." },
  magnitude:     { name:"Magnitude",     type:"Ground",   power:85,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Shakes the ground with varying intensity." },
  sand_tomb:     { name:"Sand Tomb",     type:"Ground",   power:55,  acc:85,  pp:15, cat:"physical", effect:"spedown",   ec:100, desc:"Traps the foe in a swirling sand tomb." },
  earthen_wall:  { name:"Earthen Wall",  type:"Ground",   power:0,   acc:100, pp:10, cat:"status",   effect:"defup",     ec:100, desc:"Raises a massive wall of packed earth to shield the user." },

  // Wind (+6 → 22)
  razor_wind:    { name:"Razor Wind",    type:"Wind",     power:80,  acc:100, pp:10, cat:"special",  effect:"crit",      ec:100, desc:"Fires blades of razor-sharp wind. High crit rate." },
  aerial_ace:    { name:"Aerial Ace",    type:"Wind",     power:60,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"A swift aerial strike that never misses." },
  storm_surge:   { name:"Storm Surge",   type:"Wind",     power:95,  acc:90,  pp:10, cat:"special",  effect:"spedown",   ec:30,  desc:"Unleashes a concentrated surge of storm energy." },
  feather_dance: { name:"Feather Dance", type:"Wind",     power:0,   acc:100, pp:15, cat:"status",   effect:"atkdown",   ec:100, desc:"Scatters feathers that distract and weaken the foe's attacks." },
  slipstream:    { name:"Slipstream",    type:"Wind",     power:0,   acc:100, pp:15, cat:"status",   effect:"speup",     ec:100, desc:"Rides the slipstream to dramatically boost speed." },
  tornado_slam:  { name:"Tornado Slam",  type:"Wind",     power:100, acc:85,  pp:5,  cat:"physical", effect:"confuse",   ec:30,  desc:"Catches the foe in a tornado and slams them into the ground." },

  // Ice (+7 → 22)
  ice_shard:     { name:"Ice Shard",     type:"Ice",      power:40,  acc:100, pp:30, cat:"physical", effect:"priority",  ec:0,   desc:"Throws shards of ice that strike first." },
  aurora_beam:   { name:"Aurora Beam",   type:"Ice",      power:65,  acc:100, pp:20, cat:"special",  effect:"atkdown",   ec:10,  desc:"Fires a rainbow-colored beam that may lower Attack." },
  freeze_dry:    { name:"Freeze Dry",    type:"Ice",      power:70,  acc:100, pp:20, cat:"special",  effect:"freeze",    ec:10,  desc:"Flash-freezes the moisture around the foe." },
  hail_storm:    { name:"Hail Storm",    type:"Ice",      power:80,  acc:90,  pp:10, cat:"special",  effect:"flinch",    ec:30,  desc:"Summons a brutal hailstorm that batters the foe." },
  icicle_spear:  { name:"Icicle Spear",  type:"Ice",      power:75,  acc:95,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Drives a sharp icicle spear into the foe." },
  subzero_slash: { name:"Subzero Slash", type:"Ice",      power:90,  acc:90,  pp:10, cat:"physical", effect:"freeze",    ec:15,  desc:"Slashes with claws cooled to absolute zero." },
  crystal_veil:  { name:"Crystal Veil",  type:"Ice",      power:0,   acc:100, pp:10, cat:"status",   effect:"calmup",    ec:100, desc:"Coats the user in crystal ice that sharpens focus and resilience." },

  // Dark (+7 → 22)
  sucker_punch:  { name:"Sucker Punch",  type:"Dark",     power:70,  acc:100, pp:5,  cat:"physical", effect:"priority",  ec:0,   desc:"Strikes first with a sneaky sucker punch." },
  feint_attack:  { name:"Feint Attack",  type:"Dark",     power:60,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"Approaches the foe disarmingly, then strikes without warning." },
  shadow_sneak:  { name:"Shadow Sneak",  type:"Dark",     power:40,  acc:100, pp:30, cat:"physical", effect:"priority",  ec:0,   desc:"Extends shadow to strike the foe before they react." },
  malice_beam:   { name:"Malice Beam",   type:"Dark",     power:85,  acc:95,  pp:10, cat:"special",  effect:"spdefdown", ec:20,  desc:"Fires a beam of concentrated malice that erodes mental barriers." },
  dark_shroud:   { name:"Dark Shroud",   type:"Dark",     power:0,   acc:100, pp:15, cat:"status",   effect:"speup",     ec:100, desc:"Cloaks the user in darkness, boosting evasion and speed." },
  phantom_claw:  { name:"Phantom Claw",  type:"Dark",     power:75,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with ghostly claws that find vital points. High crit rate." },
  wicked_blow:   { name:"Wicked Blow",   type:"Dark",     power:95,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Delivers a single devastating blow with wicked intent." },

  // Fairy (+7 → 22)
  draining_kiss: { name:"Draining Kiss",  type:"Fairy",   power:50,  acc:100, pp:10, cat:"special",  effect:"drain",     ec:100, desc:"Steals the foe's energy with an enchanted kiss." },
  play_rough:    { name:"Play Rough",    type:"Fairy",    power:90,  acc:90,  pp:10, cat:"physical", effect:"atkdown",   ec:10,  desc:"Plays rough with the foe, lowering their Attack." },
  misty_terrain: { name:"Misty Terrain", type:"Fairy",    power:0,   acc:100, pp:10, cat:"status",   effect:"spdefup",   ec:100, desc:"Covers the field in protective mist that raises special defense." },
  starfall:      { name:"Starfall",      type:"Fairy",    power:80,  acc:95,  pp:15, cat:"special",  effect:null,        ec:0,   desc:"Calls down a shower of starlight that crashes into the foe." },
  enchanted_edge:{ name:"Enchanted Edge",type:"Fairy",    power:70,  acc:100, pp:15, cat:"physical", effect:"spatkdown", ec:20,  desc:"Strikes with a blade imbued with fairy enchantment." },
  radiant_burst: { name:"Radiant Burst", type:"Fairy",    power:100, acc:85,  pp:5,  cat:"special",  effect:"spatkdown", ec:30,  desc:"Releases a devastating burst of pure fairy radiance." },
  sylvan_song:   { name:"Sylvan Song",   type:"Fairy",    power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Sings an ancient sylvan melody that restores the user's health." },

  // Steel (+7 → 22)
  bullet_punch:  { name:"Bullet Punch",  type:"Steel",    power:40,  acc:100, pp:30, cat:"physical", effect:"priority",  ec:0,   desc:"Strikes with a steel fist at blinding speed." },
  gyro_ball:     { name:"Gyro Ball",     type:"Steel",    power:85,  acc:100, pp:5,  cat:"physical", effect:null,        ec:0,   desc:"Spins and slams into the foe with metallic force." },
  heavy_slam:    { name:"Heavy Slam",    type:"Steel",    power:100, acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Slams into the foe with a heavy metal body." },
  mirror_coat:   { name:"Mirror Coat",   type:"Steel",    power:0,   acc:100, pp:15, cat:"status",   effect:"spdefup",   ec:100, desc:"Polishes the body to a mirror shine, raising special defense." },
  metal_burst:   { name:"Metal Burst",   type:"Steel",    power:80,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Fires shrapnel of stored metallic energy at the foe." },
  iron_press:    { name:"Iron Press",    type:"Steel",    power:85,  acc:95,  pp:10, cat:"physical", effect:"defdown",   ec:30,  desc:"Presses down on the foe with crushing metallic weight." },
  chrome_slash:  { name:"Chrome Slash",  type:"Steel",    power:70,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with chrome-plated claws. High crit rate." },

  // Poison (+7 → 22)
  acid_spray:    { name:"Acid Spray",    type:"Poison",   power:40,  acc:100, pp:20, cat:"special",  effect:"spdefdown", ec:100, desc:"Sprays a corrosive acid that sharply lowers special defense." },
  cross_poison:  { name:"Cross Poison",  type:"Poison",   power:70,  acc:100, pp:20, cat:"physical", effect:"poison",    ec:10,  desc:"Slashes with a poisonous blade in a cross pattern." },
  poison_jab:    { name:"Poison Jab",    type:"Poison",   power:80,  acc:100, pp:20, cat:"physical", effect:"poison",    ec:30,  desc:"Jabs with a toxin-coated appendage." },
  toxic_spikes:  { name:"Toxic Spikes",  type:"Poison",   power:0,   acc:100, pp:15, cat:"status",   effect:"poison",    ec:100, desc:"Lays a trap of toxic spikes that poisons on contact." },
  gunk_shot:     { name:"Gunk Shot",     type:"Poison",   power:120, acc:80,  pp:5,  cat:"physical", effect:"poison",    ec:30,  desc:"Hurls a massive blob of toxic gunk at the foe." },
  venom_shock:   { name:"Venom Shock",   type:"Poison",   power:65,  acc:100, pp:15, cat:"special",  effect:"paralyze",  ec:20,  desc:"Shocks the foe with venomous electricity." },
  noxious_gas:   { name:"Noxious Gas",   type:"Poison",   power:0,   acc:85,  pp:15, cat:"status",   effect:"badpoison", ec:100, desc:"Releases a cloud of noxious gas that severely poisons." },

  // Psychic (+6 → 22)
  zen_headbutt:  { name:"Zen Headbutt",  type:"Psychic",  power:80,  acc:90,  pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Focuses psychic energy into the forehead and rams the foe." },
  psycho_cut:    { name:"Psycho Cut",    type:"Psychic",  power:70,  acc:100, pp:20, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with psychically sharpened blades. High crit rate." },
  mind_reader:   { name:"Mind Reader",   type:"Psychic",  power:0,   acc:100, pp:10, cat:"status",   effect:"spatkup",   ec:100, desc:"Reads the foe's mind to sharpen the user's special attack." },
  hypnosis:      { name:"Hypnosis",      type:"Psychic",  power:0,   acc:60,  pp:20, cat:"status",   effect:"sleep",     ec:100, desc:"Puts the foe to sleep with hypnotic suggestion." },
  psywave:       { name:"Psywave",       type:"Psychic",  power:75,  acc:100, pp:15, cat:"special",  effect:null,        ec:0,   desc:"Attacks with a telekinetic wave of force." },
  extrasensory:  { name:"Extrasensory",  type:"Psychic",  power:80,  acc:100, pp:20, cat:"special",  effect:"flinch",    ec:10,  desc:"Attacks with an odd psychic power that may cause flinching." },

  // Dragon (+7 → 22)
  dragon_tail:   { name:"Dragon Tail",   type:"Dragon",   power:60,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Slaps the foe with a powerful dragon tail." },
  draco_meteor:  { name:"Draco Meteor",  type:"Dragon",   power:130, acc:90,  pp:5,  cat:"special",  effect:"spatkdown", ec:100, desc:"Calls down meteors with draconic power. Lowers user's Sp.Atk." },
  dragon_rush:   { name:"Dragon Rush",   type:"Dragon",   power:100, acc:75,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Charges the foe with menacing draconic energy." },
  twister:       { name:"Twister",       type:"Dragon",   power:40,  acc:100, pp:20, cat:"special",  effect:"flinch",    ec:20,  desc:"Whips up a vicious twister of draconic wind." },
  dragon_rage:   { name:"Dragon Rage",   type:"Dragon",   power:55,  acc:100, pp:15, cat:"special",  effect:null,        ec:0,   desc:"Blasts the foe with an ancient draconic fury." },
  serpent_coil:  { name:"Serpent Coil",   type:"Dragon",   power:0,   acc:100, pp:15, cat:"status",   effect:"atkup",     ec:100, desc:"Coils like a dragon serpent, building power for the next strike." },
  wyrm_breath:   { name:"Wyrm Breath",   type:"Dragon",   power:80,  acc:95,  pp:15, cat:"special",  effect:"paralyze",  ec:20,  desc:"Breathes the ancient miasma of a primordial wyrm." },

  // Rock (+7 → 22)
  ancient_power: { name:"Ancient Power",  type:"Rock",    power:60,  acc:100, pp:5,  cat:"special",  effect:"atkup",     ec:10,  desc:"Attacks with prehistoric power that may raise all stats." },
  power_gem:     { name:"Power Gem",     type:"Rock",     power:80,  acc:100, pp:20, cat:"special",  effect:null,        ec:0,   desc:"Fires a ray of light formed from gemstones." },
  rock_blast:    { name:"Rock Blast",    type:"Rock",     power:70,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Hurls multiple rocks at the foe in rapid succession." },
  smack_down:    { name:"Smack Down",    type:"Rock",     power:50,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Hurls a stone to knock the foe down to earth." },
  diamond_storm: { name:"Diamond Storm", type:"Rock",     power:100, acc:95,  pp:5,  cat:"physical", effect:"defup",     ec:50,  desc:"Whips up a storm of diamonds that may raise Defense." },
  erosion_wave:  { name:"Erosion Wave",  type:"Rock",     power:75,  acc:95,  pp:10, cat:"special",  effect:"defdown",   ec:30,  desc:"Sends a wave of eroding stone particles that wear down defenses." },
  quarry_crush:  { name:"Quarry Crush",  type:"Rock",     power:90,  acc:85,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Crushes the foe with the force of a collapsing quarry." },

  // Bug (+7 → 22)
  fury_cutter:   { name:"Fury Cutter",   type:"Bug",      power:40,  acc:95,  pp:20, cat:"physical", effect:null,        ec:0,   desc:"Slashes with scythe-like claws in a fury." },
  signal_beam:   { name:"Signal Beam",   type:"Bug",      power:75,  acc:100, pp:15, cat:"special",  effect:"confuse",   ec:10,  desc:"Fires a peculiar signal beam that confuses." },
  leech_life:    { name:"Leech Life",    type:"Bug",      power:80,  acc:100, pp:10, cat:"physical", effect:"drain",     ec:100, desc:"Drains the foe's blood to restore the user's HP." },
  pin_missile:   { name:"Pin Missile",   type:"Bug",      power:55,  acc:95,  pp:20, cat:"physical", effect:null,        ec:0,   desc:"Fires sharp pins at the foe in rapid succession." },
  lunge:         { name:"Lunge",         type:"Bug",      power:80,  acc:100, pp:15, cat:"physical", effect:"atkdown",   ec:100, desc:"Lunges at the foe, lowering their Attack on contact." },
  infestation:   { name:"Infestation",   type:"Bug",      power:50,  acc:100, pp:20, cat:"special",  effect:"spedown",   ec:30,  desc:"Infests the foe with parasitic bugs that slow them down." },
  metamorphosis: { name:"Metamorphosis", type:"Bug",      power:0,   acc:100, pp:10, cat:"status",   effect:"calmup",    ec:100, desc:"Undergoes a transformation that sharpens special power and resilience." }
};


// ============================================================
// MONSTERS DATA (107 Monsters)
// ============================================================
const MONSTERS_DATA = {
  // ===== FIRE STARTERS + FIRE LINE =====
  1: { id:1, name:"Solkin",    emoji:"🦊", types:["Fire"],
    base:{hp:35,atk:48,def:40,spa:64,spd:47,spe:91},
    learnset:[[1,"tackle",[20,"cinderwhirl"]],[1,"growl"],[4,"ember"],[8,"quick_attack"],[13,"flame_fang"],[19,"swords_dance"],[27,"flamethrower"],[38,"fire_blast",[5,"scorch_veil"]]],
    evolveTo:2, evolveLevel:16, catchRate:45, expYield:62, rarity:"starter",
    desc:"A fire fox cub. Its tail flame glows brighter when its spirit is high." },

  2: { id:2, name:"Pyrevix",    emoji:"🦊", types:["Fire"],
    base:{hp:52,atk:59,def:62,spa:74,spd:57,spe:105},
    learnset:[[1,"tackle"],[2,"ember"],[3,"quick_attack"],[4,"flame_fang"],[5,"scorch_veil"],[24,"flamethrower"],[25,"blazing_rush"],[34,"heat_wave"],[35,"fire_blast"],[43,"inferno"],[6,"embercloak"],[32,"recover"]],
    evolveTo:3, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A blazing fox with a fiery mane. Rivals fear its flaming charge." },

  3: { id:3, name:"Ignaraeth",  emoji:"🐲", types:["Fire","Dragon"],
    base:{hp:70,atk:88,def:80,spa:105,spd:79,spe:105},
    learnset:[[1,"flame_fang"],[2,"flamethrower"],[3,"heat_wave"],[4,"scorch_veil"],[37,"fire_blast"],[40,"swords_dance"],[44,"dragon_breath"],[47,"inferno"],[48,"dragon_claw"],[52,"dragon_pulse"],[56,"solar_flare"],[60,"outrage"],[5,"embercloak"],[36,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"A terrifying dragon-fox hybrid. Its volcanic roar can be heard for miles." },

  // Water Starters
  4: { id:4, name:"Aquilin",     emoji:"💧", types:["Water"],
    base:{hp:45,atk:52,def:69,spa:45,spd:66,spe:46},
    learnset:[[1,"tackle",[20,"frost_current"]],[1,"tail_whip"],[4,"water_gun"],[8,"bubble_beam"],[13,"aqua_tail"],[19,"recover"],[27,"surf"],[38,"hydro_pump",[5,"tidecaller"]]],
    evolveTo:5, evolveLevel:16, catchRate:45, expYield:59, rarity:"starter",
    desc:"A water sprite that lives near ponds. Its skin is always cool and moist." },

  5: { id:5, name:"Nerilis",    emoji:"🐍", types:["Water"],
    base:{hp:60,atk:66,def:79,spa:64,spd:85,spe:64},
    learnset:[[1,"water_gun"],[2,"tail_whip"],[3,"bubble_beam"],[4,"aqua_tail"],[5,"tidecaller"],[16,"recover"],[24,"surf"],[30,"harden"],[35,"hydro_pump"],[44,"tidal_crush"],[6,"deepwater_hymn"],[33,"swords_dance"]],
    evolveTo:6, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A serpentine water Lumo. Glides through water with incredible grace." },

  6: { id:6, name:"Pelagroth",    emoji:"🐲", types:["Water","Dragon"],
    base:{hp:72,atk:90,def:97,spa:89,spd:105,spe:75},
    learnset:[[1,"surf"],[2,"aqua_tail"],[3,"harden"],[4,"tidecaller"],[37,"hydro_pump"],[40,"abyssal_jet"],[44,"dragon_breath"],[48,"coral_barrage"],[52,"dragon_claw"],[56,"dragon_pulse"],[60,"eon_crash"],[64,"outrage"],[5,"deepwater_hymn"],[39,"ocean_tempest"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"An oceanic behemoth said to rule the seas. Its roar causes tidal waves." },

  // Grass Starters
  7: { id:7, name:"Verdkin",  emoji:"🌱", types:["Grass"],
    base:{hp:49,atk:42,def:55,spa:61,spd:70,spe:47},
    learnset:[[1,"tackle",[20,"root_lance"]],[1,"growl"],[4,"vine_whip"],[8,"razor_leaf"],[13,"seed_bomb"],[19,"swords_dance"],[27,"energy_ball"],[38,"petal_blitz",[5,"sleep_powder"]]],
    evolveTo:8, evolveLevel:16, catchRate:45, expYield:64, rarity:"starter",
    desc:"A little plant seedling that walks on root-legs. Very curious and brave." },

  8: { id:8, name:"Barknell",   emoji:"🦕", types:["Grass"],
    base:{hp:57,atk:68,def:63,spa:75,spd:74,spe:70},
    learnset:[[1,"vine_whip"],[2,"razor_leaf"],[3,"seed_bomb"],[4,"tackle"],[5,"sleep_powder"],[16,"swords_dance"],[24,"energy_ball"],[30,"canopy_crash"],[35,"petal_blitz"],[44,"verdant_surge"],[6,"spore_burst"],[33,"recover"]],
    evolveTo:9, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A thorny dinosaur with bark-like skin. Each spine is razor sharp." },

  9: { id:9, name:"Floraith",   emoji:"🌸", types:["Grass","Fairy"],
    base:{hp:82,atk:75,def:80,spa:101,spd:110,spe:84},
    learnset:[[1,"seed_bomb"],[2,"energy_ball"],[3,"vine_whip"],[4,"sleep_powder"],[40,"verdant_surge"],[41,"tail_whip"],[44,"fairy_wind"],[47,"petal_blitz"],[48,"scratch"],[52,"dazzling_gleam"],[56,"root_lance"],[60,"moonblast"],[5,"spore_burst"],[36,"celestial_wave"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"A majestic flower guardian. Its petals shimmer with magical energy." },

  // ===== ADDITIONAL FIRE =====
  10: { id:10, name:"Embrix",  emoji:"🐛", types:["Fire","Bug"],
    base:{hp:54,atk:68,def:37,spa:43,spd:43,spe:48},
    learnset:[[1,"tackle",[20,"cinderwhirl"]],[1,"ember"],[8,"bug_bite"],[15,"flame_fang"],[17,"swords_dance"],[22,"x_scissor",[5,"scorch_veil"]],[29,"venom_drool"],[39,"stinger_volley"]],
    evolveTo:11, evolveLevel:18, catchRate:255, expYield:56, rarity:"common",
    desc:"A fire beetle larva. Leaves scorch marks wherever it walks." },

  11: { id:11, name:"Helioveth",  emoji:"🦋", types:["Fire","Wind"],
    base:{hp:65,atk:91,def:52,spa:80,spd:60,spe:128},
    learnset:[[1,"ember"],[2,"bug_bite"],[3,"flame_fang"],[4,"scorch_veil"],[23,"battle_cry"],[28,"blazing_rush"],[33,"wing_attack"],[38,"downdraft"],[43,"air_slash"],[48,"magma_surge"],[53,"heat_wave"],[58,"tempest_wrath"],[5,"embercloak"],[39,"inferno"]],
    evolveTo:12, evolveLevel:40, catchRate:75, expYield:158, rarity:"uncommon",
    desc:"A blazing moth that flies at incredible speed. Its wings radiate fierce heat." },

  13: { id:13, name:"Taurcin",    emoji:"🐂", types:["Fire"],
    base:{hp:67,atk:69,def:56,spa:52,spd:37,spe:43},
    learnset:[[1,"tackle",[22,"magma_surge"]],[1,"ember"],[12,"headbutt"],[19,"swords_dance"],[20,"flamethrower"],[30,"body_slam"],[35,"heat_wave"],[40,"fire_blast",[5,"scorch_veil"]],[3,"embercloak"],[31,"tail_whip"]],
    evolveTo:14, evolveLevel:22, catchRate:120, expYield:112, rarity:"common",
    desc:"A powerful bull with lava dripping from its hooves. Incredibly stubborn." },

  14: { id:14, name:"Molteroth",    emoji:"🐃", types:["Fire","Rock"],
    base:{hp:94,atk:111,def:97,spa:78,spd:64,spe:63},
    learnset:[[1,"headbutt"],[2,"magma_surge"],[3,"ember"],[4,"flamethrower"],[5,"scorch_veil"],[30,"battle_cry"],[32,"heat_wave"],[37,"fire_blast"],[38,"stalactite_drop"],[46,"rock_slide"],[54,"stone_edge"],[62,"inferno"],[6,"embercloak"],[42,"quarry_crush"]],
    evolveTo:15, evolveLevel:42, catchRate:45, expYield:235, rarity:"uncommon",
    desc:"A volcanic beast covered in hardened magma. Nothing can stop its charge." },

  16: { id:16, name:"Ignicula",   emoji:"🐍", types:["Fire"],
    base:{hp:41,atk:53,def:46,spa:59,spd:45,spe:47},
    learnset:[[1,"tackle",[20,"cinderwhirl"]],[1,"ember"],[9,"quick_attack"],[14,"leer"],[17,"flamethrower",[5,"scorch_veil"]],[24,"vital_pulse"],[32,"ashfall"],[40,"fire_blast"],[3,"embercloak"],[31,"tail_whip"]],
    evolveTo:17, evolveLevel:20, catchRate:200, expYield:65, rarity:"common",
    desc:"A small worm that breathes tiny flames. Very shy and avoids conflict." },

  17: { id:17, name:"Pyroveth",   emoji:"🐉", types:["Fire","Dragon"],
    base:{hp:78,atk:97,def:61,spa:101,spd:75,spe:92},
    learnset:[[1,"ember"],[2,"flamethrower"],[3,"cinderwhirl"],[4,"scorch_veil"],[21,"vital_pulse"],[26,"char_dance"],[32,"dragon_breath"],[38,"dragon_claw"],[44,"heat_wave"],[50,"inferno"],[56,"outrage"],[62,"solar_flare"],[5,"embercloak"],[41,"dragon_rush"]],
    evolveTo:18, evolveLevel:42, catchRate:45, expYield:198, rarity:"uncommon",
    desc:"A serpentine fire dragon. Coils around prey before unleashing flame." },

  // ===== ADDITIONAL WATER =====
  25: { id:25, name:"Coralix",  emoji:"🦀", types:["Water"],
    base:{hp:59,atk:66,def:78,spa:43,spd:63,spe:34},
    learnset:[[1,"scratch",[22,"coral_barrage"]],[1,"water_gun"],[10,"bubble_beam"],[18,"harden"],[20,"vital_pulse"],[26,"aqua_tail"],[34,"surf",[5,"tidecaller"]],[36,"hydro_pump"],[3,"deepwater_hymn"],[31,"leer"]],
    evolveTo:26, evolveLevel:20, catchRate:190, expYield:71, rarity:"common",
    desc:"A crab that blows iridescent bubbles. Very territorial near shorelines." },

  26: { id:26, name:"Aquidon",    emoji:"🦞", types:["Water","Rock"],
    base:{hp:75,atk:102,def:110,spa:59,spd:68,spe:81},
    learnset:[[1,"scratch"],[2,"water_gun"],[3,"tidecaller"],[23,"aqua_tail"],[27,"swords_dance"],[31,"surf"],[33,"hydro_pump"],[34,"stalactite_drop"],[41,"rock_slide"],[48,"crystal_lance"],[55,"tidal_crush"],[62,"stone_edge"],[4,"deepwater_hymn"],[42,"quarry_crush"]],
    evolveTo:27, evolveLevel:44, catchRate:60, expYield:188, rarity:"uncommon",
    desc:"A massive sea claw with rock-hard shell. Few can match its raw strength." },

  42: { id:42, name:"Cryonik",    emoji:"🦭", types:["Ice","Water"],
    base:{hp:54,atk:56,def:64,spa:73,spd:75,spe:31},
    learnset:[[1,"tackle",[22,"frost_current"]],[1,"powder_snow"],[10,"water_gun"],[18,"ice_beam"],[20,"leer"],[26,"aqua_tail"],[34,"blizzard",[5,"permafrost"]],[36,"cryo_lance"],[3,"winter_shroud"],[31,"surf"]],
    evolveTo:43, evolveLevel:28, catchRate:120, expYield:91, rarity:"common",
    desc:"An adorable ice seal. Its smooth skin can withstand arctic temperatures." },

  43: { id:43, name:"Boreon",  emoji:"🦭", types:["Ice","Water"],
    base:{hp:82,atk:60,def:80,spa:103,spd:97,spe:81},
    learnset:[[1,"powder_snow"],[2,"water_gun"],[3,"ice_beam"],[4,"permafrost"],[31,"blizzard"],[33,"harden"],[38,"abyssal_jet"],[43,"hoarfrost_bite"],[48,"icicle_crash"],[53,"surf"],[58,"glacial_tomb"],[63,"hydro_pump"],[5,"winter_shroud"],[41,"aqua_tail"]],
    evolveTo:44, evolveLevel:44, catchRate:40, expYield:217, rarity:"uncommon",
    desc:"A regal glacial seal. It can freeze oceans with a single breath." },

  28: { id:28, name:"Corelin",   emoji:"🐠", types:["Water"],
    base:{hp:49,atk:34,def:58,spa:59,spd:52,spe:62},
    learnset:[[1,"tackle",[22,"coral_barrage"]],[1,"water_gun"],[9,"bubble_beam"],[16,"tail_whip"],[17,"sweet_kiss"],[25,"surf",[5,"tidecaller"]],[29,"vital_pulse"],[39,"aqua_tail"],[3,"deepwater_hymn"],[32,"leer"]],
    evolveTo:29, evolveLevel:25, catchRate:220, expYield:72, rarity:"common",
    desc:"A dazzling coral fish with rainbow fins. Lures prey with its bright colors." },

  29: { id:29, name:"Neraxis",    emoji:"🐡", types:["Water"],
    base:{hp:76,atk:69,def:64,spa:114,spd:99,spe:74},
    learnset:[[1,"water_gun"],[2,"bubble_beam"],[3,"surf"],[4,"tidecaller"],[30,"growl"],[35,"harden"],[40,"quick_attack"],[45,"dazzling_gleam"],[50,"whirlpool_dive"],[55,"sea_serpent_strike"],[60,"moonblast"],[65,"hydro_pump"],[5,"deepwater_hymn"],[42,"recover"]],
    evolveTo:30, evolveLevel:42, catchRate:70, expYield:184, rarity:"uncommon",
    desc:"A majestic reef king with jewel-like scales. Commands schools of fish." },

  // ===== ADDITIONAL GRASS =====
  63: { id:63, name:"Sporix",    emoji:"🍄", types:["Grass","Poison"],
    base:{hp:60,atk:58,def:57,spa:66,spd:70,spe:38},
    learnset:[[1,"tackle"],[1,"vine_whip"],[8,"poison_sting"],[16,"energy_ball"],[20,"leer"],[22,"spore_burst"],[24,"sludge_bomb"],[32,"sleep_powder",[5,"thornwall"]],[36,"seed_bomb"],[3,"mycelia_net"],[31,"leaf_blade"]],
    evolveTo:64, evolveLevel:25, catchRate:135, expYield:98, rarity:"common",
    desc:"A mushroom Lumo that releases paralyzing spores when threatened." },

  64: { id:64, name:"Myceloth",   emoji:"🍄", types:["Grass","Poison"],
    base:{hp:77,atk:87,def:85,spa:93,spd:73,spe:69},
    learnset:[[1,"energy_ball"],[2,"sludge_bomb"],[29,"sleep_powder"],[30,"tail_whip"],[33,"seed_bomb"],[35,"toxic"],[40,"scratch"],[45,"razor_leaf"],[50,"venoshock"],[55,"corrosion_fang"],[60,"petal_blitz"],[65,"verdant_surge"],[3,"spore_burst"],[42,"canopy_crash"]],
    evolveTo:65, evolveLevel:42, catchRate:45, expYield:317, rarity:"uncommon",
    desc:"A spore king that commands an army of fungal creatures. Reeks of poison." },

  66: { id:66, name:"Viridix",    emoji:"🌿", types:["Grass"],
    base:{hp:39,atk:60,def:39,spa:52,spd:40,spe:86},
    learnset:[[1,"vine_whip",[20,"photon_leaf"]],[1,"leer"],[8,"razor_leaf"],[16,"seed_bomb"],[17,"recover"],[24,"energy_ball",[5,"sleep_powder"]],[29,"scratch"],[39,"canopy_crash"],[3,"spore_burst"],[32,"swords_dance"]],
    evolveTo:67, evolveLevel:22, catchRate:180, expYield:78, rarity:"common",
    desc:"A quick, vine-like snake that lashes with razor-edged leaves." },

  67: { id:67, name:"Terravin", emoji:"🌳", types:["Grass","Ground"],
    base:{hp:83,atk:93,def:80,spa:80,spd:75,spe:76},
    learnset:[[1,"razor_leaf"],[2,"seed_bomb"],[3,"sleep_powder"],[22,"energy_ball"],[27,"growl"],[32,"tackle"],[37,"sandstrike"],[42,"sand_geyser"],[47,"root_lance"],[52,"earth_power"],[57,"earthquake"],[62,"petal_blitz"],[4,"spore_burst"],[40,"scorched_earth"]],
    evolveTo:68, evolveLevel:42, catchRate:55, expYield:195, rarity:"uncommon",
    desc:"A root elemental that walks on massive tree roots. Ancient and powerful." },

  69: { id:69, name:"Germix",     emoji:"🫘", types:["Grass"],
    base:{hp:38,atk:41,def:49,spa:62,spd:55,spe:52},
    learnset:[[1,"tackle",[22,"spore_burst"]],[1,"vine_whip"],[10,"energy_ball"],[16,"leer"],[18,"sleep_powder"],[26,"seed_bomb",[5,"thornwall"]],[29,"scratch"],[39,"canopy_crash"]],
    evolveTo:70, evolveLevel:18, catchRate:255, expYield:58, rarity:"common",
    desc:"A living seed pod that rolls around. Harmless but quick to flee." },

  70: { id:70, name:"Verdurus",    emoji:"🐻", types:["Grass"],
    base:{hp:90,atk:102,def:71,spa:95,spd:73,spe:61},
    learnset:[[1,"tackle"],[2,"vine_whip"],[3,"leer"],[4,"energy_ball"],[5,"sleep_powder"],[23,"seed_bomb"],[27,"swords_dance"],[36,"canopy_crash"],[37,"quick_attack"],[45,"briar_lash"],[54,"body_slam"],[63,"petal_blitz"],[6,"spore_burst"],[43,"tail_whip"]],
    evolveTo:71, evolveLevel:40, catchRate:75, expYield:186, rarity:"uncommon",
    desc:"A bear covered in living vegetation. Gentle unless its forest is threatened." },

  // ===== ELECTRIC =====
  81: { id:81, name:"Joltan",    emoji:"🐭", types:["Electric"],
    base:{hp:43,atk:47,def:36,spa:51,spd:39,spe:100},
    learnset:[[1,"scratch",[20,"volt_surge"]],[1,"thunder_shock"],[8,"quick_attack"],[16,"spark"],[22,"thunderbolt"],[29,"recover"],[30,"thunder_wave"],[38,"thunder",[5,"static_cage"]],[3,"charge_burst"],[32,"leer"]],
    evolveTo:82, evolveLevel:20, catchRate:190, expYield:82, rarity:"common",
    desc:"An electric mouse that crackles with static. Can shock with a touch." },

  82: { id:82, name:"Galvanos",    emoji:"🐴", types:["Electric"],
    base:{hp:59,atk:88,def:58,spa:89,spd:60,spe:141},
    learnset:[[1,"thunder_shock"],[2,"quick_attack"],[3,"spark"],[20,"thunderbolt"],[27,"thunder_wave"],[28,"growl"],[34,"harden"],[35,"thunder"],[41,"wild_tumble"],[48,"arc_flash"],[55,"plasma_strike"],[62,"body_slam"],[4,"static_cage"],[42,"leer"]],
    evolveTo:83, evolveLevel:44, catchRate:60, expYield:200, rarity:"uncommon",
    desc:"An electric horse that gallops faster than lightning. Its mane crackles." },

  84: { id:84, name:"Electrix",      emoji:"🐞", types:["Electric","Bug"],
    base:{hp:34,atk:48,def:43,spa:50,spd:43,spe:94},
    learnset:[[1,"bug_bite",[22,"arc_flash"]],[1,"thunder_shock"],[10,"spark"],[18,"string_shot"],[20,"recover"],[26,"thunderbolt"],[34,"bug_buzz",[5,"thunder_wave"]],[36,"x_scissor"],[3,"static_cage"],[31,"cocoon_burst"]],
    evolveTo:85, evolveLevel:22, catchRate:200, expYield:74, rarity:"common",
    desc:"An electric beetle that emits charged buzzing sounds. Very energetic." },

  85: { id:85, name:"Voltharpe",  emoji:"🦟", types:["Electric","Bug"],
    base:{hp:81,atk:68,def:53,spa:107,spd:67,spe:101},
    learnset:[[1,"thunder_shock"],[2,"bug_bite"],[3,"thunder_wave"],[23,"thunderbolt"],[29,"tail_whip"],[31,"bug_buzz"],[33,"x_scissor"],[36,"scratch"],[43,"silk_bind"],[50,"swarm_dive"],[57,"volt_surge"],[64,"thunder"],[4,"static_cage"],[42,"mandible_crush"]],
    evolveTo:86, evolveLevel:42, catchRate:75, expYield:180, rarity:"uncommon",
    desc:"A dragonfly of electricity. Moves so fast it leaves lightning trails behind." },

  87: { id:87, name:"Amperix",     emoji:"🐟", types:["Electric","Water"],
    base:{hp:48,atk:59,def:51,spa:74,spd:57,spe:63},
    learnset:[[1,"water_gun",[22,"arc_flash"]],[1,"thunder_shock"],[12,"spark"],[19,"recover"],[20,"bubble_beam"],[28,"thunderbolt"],[35,"voltaic_fang"],[36,"surf",[5,"thunder_wave"]],[3,"static_cage"],[31,"ion_cannon"]],
    evolveTo:88, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"An electric fish that shocks prey in shallow water. Glows when excited." },

  88: { id:88, name:"Volterel",    emoji:"🐡", types:["Electric","Water"],
    base:{hp:78,atk:61,def:64,spa:113,spd:85,spe:100},
    learnset:[[1,"thunder_shock"],[2,"water_gun"],[3,"thunderbolt"],[4,"bubble_beam"],[5,"thunder_wave"],[32,"voltaic_fang"],[33,"surf"],[35,"tail_whip"],[42,"scratch"],[49,"thunder"],[56,"hydro_pump"],[63,"overcharge"],[6,"static_cage"],[43,"aqua_tail"]],
    evolveTo:89, evolveLevel:42, catchRate:50, expYield:205, rarity:"uncommon",
    desc:"A massive electric eel that can power a city with its discharge." },

  90: { id:90, name:"Zephyrel",  emoji:"🐦", types:["Electric","Wind"],
    base:{hp:50,atk:44,def:39,spa:52,spd:55,spe:93},
    learnset:[[1,"gust",[20,"volt_surge"]],[1,"thunder_shock"],[10,"wing_attack"],[14,"growl"],[18,"thunderbolt"],[24,"tackle"],[26,"air_slash"],[33,"spark"],[34,"thunder",[5,"thunder_wave"]],[42,"cyclone_blade"],[3,"static_cage"],[32,"storm_surge"]],
    evolveTo:91, evolveLevel:28, catchRate:160, expYield:78, rarity:"common",
    desc:"A little bird of storms. Rides thunderclouds and harnesses lightning." },

  // ===== GROUND =====
  95: { id:95, name:"Terrakin",     emoji:"🐶", types:["Ground"],
    base:{hp:61,atk:71,def:58,spa:40,spd:40,spe:68},
    learnset:[[1,"scratch",[22,"sandstrike"]],[1,"growl"],[8,"mud_shot"],[16,"headbutt"],[24,"earthquake"],[29,"tail_whip"],[32,"earth_power"],[40,"body_slam",[5,"dust_veil"]],[3,"clay_armor"],[31,"leer"]],
    evolveTo:96, evolveLevel:25, catchRate:160, expYield:88, rarity:"common",
    desc:"An earth puppy that loves to dig. Its powerful paws can tunnel through rock." },

  96: { id:96, name:"Seismith",  emoji:"🐕", types:["Ground","Rock"],
    base:{hp:104,atk:114,def:97,spa:53,spd:64,spe:70},
    learnset:[[1,"mud_shot"],[2,"headbutt"],[3,"earthquake"],[4,"dust_veil"],[29,"earth_power"],[31,"harden"],[37,"body_slam"],[38,"stalactite_drop"],[43,"rock_slide"],[49,"crystal_lance"],[55,"fissure_slam"],[61,"stone_edge"],[5,"clay_armor"],[41,"magma_rock"]],
    evolveTo:97, evolveLevel:44, catchRate:50, expYield:218, rarity:"uncommon",
    desc:"A terrifying earth hound. Its bark triggers small tremors." },

  98: { id:98, name:"Aridix",   emoji:"🦂", types:["Ground","Poison"],
    base:{hp:53,atk:56,def:60,spa:57,spd:47,spe:76},
    learnset:[[1,"scratch",[22,"terra_spike"]],[1,"poison_sting"],[10,"mud_shot"],[18,"venoshock"],[26,"earthquake"],[30,"fissure_slam"],[34,"sludge_bomb"],[42,"toxic",[5,"dust_veil"]],[3,"clay_armor"],[32,"earth_power"]],
    evolveTo:99, evolveLevel:30, catchRate:100, expYield:95, rarity:"common",
    desc:"A desert scorpion with a venomous stinger. Buries itself in sand to ambush." },

  99: { id:99, name:"Geovenoth",  emoji:"🦂", types:["Ground","Poison"],
    base:{hp:64,atk:90,def:71,spa:77,spd:85,spe:88},
    learnset:[[1,"poison_sting"],[2,"fissure_slam"],[3,"mud_shot"],[4,"earthquake"],[5,"venoshock"],[6,"dust_veil"],[31,"sludge_bomb"],[38,"vital_pulse"],[39,"toxic"],[46,"miasma_cloud"],[54,"earth_power"],[62,"plague_burst"],[7,"clay_armor"],[42,"venom_lance"]],
    evolveTo:100, evolveLevel:42, catchRate:35, expYield:321, rarity:"uncommon",
    desc:"A great venom scorpion. Its tail sting causes hallucinations in victims." },

  101: { id:101, name:"Limoux",     emoji:"🐊", types:["Ground","Water"],
    base:{hp:69,atk:60,def:59,spa:48,spd:52,spe:42},
    learnset:[[1,"scratch",[22,"sandstrike"]],[1,"mud_shot"],[10,"water_gun"],[18,"bubble_beam"],[20,"tail_whip"],[26,"earthquake"],[34,"surf",[5,"dust_veil"]],[36,"whirlpool_dive"],[3,"clay_armor"],[31,"sea_serpent_strike"]],
    evolveTo:102, evolveLevel:22, catchRate:140, expYield:88, rarity:"common",
    desc:"A mud-crawling amphibian. Slides through swamps with ease." },

  102: { id:102, name:"Geoloth",   emoji:"🐊", types:["Ground","Water"],
    base:{hp:93,atk:97,def:77,spa:91,spd:78,spe:66},
    learnset:[[1,"mud_shot"],[2,"water_gun"],[3,"dust_veil"],[23,"earthquake"],[28,"battle_cry"],[31,"surf"],[34,"frost_current"],[40,"boulder_roll"],[46,"body_slam"],[52,"earth_power"],[58,"tidal_crush"],[64,"hydro_pump"],[4,"clay_armor"],[42,"aqua_tail"]],
    evolveTo:103, evolveLevel:44, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A massive silt beast that haunts murky river deltas. Ancient and powerful." },

  // ===== WIND =====
  108: { id:108, name:"Zephyrkin",   emoji:"🐱", types:["Wind"],
    base:{hp:46,atk:43,def:37,spa:56,spd:45,spe:81},
    learnset:[[1,"scratch",[20,"cyclone_blade"]],[1,"gust"],[8,"quick_attack"],[16,"wing_attack"],[21,"harden"],[24,"air_slash"],[32,"hurricane",[5,"mistveil"]],[36,"thermal_dive"],[3,"zephyr_dance"],[31,"leer"]],
    evolveTo:109, evolveLevel:22, catchRate:200, expYield:70, rarity:"common",
    desc:"A light-footed wind kitten. Jumps and glides on invisible air currents." },

  109: { id:109, name:"Aeolomane",    emoji:"🦁", types:["Wind","Electric"],
    base:{hp:70,atk:98,def:57,spa:68,spd:74,spe:119},
    learnset:[[1,"gust"],[2,"wing_attack"],[3,"mistveil"],[22,"air_slash"],[28,"zephyr_dance"],[29,"hurricane"],[34,"vital_pulse"],[40,"thunder_shock"],[46,"arc_flash"],[52,"thunderbolt"],[58,"gale_cannon"],[64,"thunder"],[4,"vortex_trap"],[42,"storm_surge"]],
    evolveTo:110, evolveLevel:44, catchRate:55, expYield:318, rarity:"uncommon",
    desc:"A majestic wind lion whose mane crackles with electric charge during storms." },

  111: { id:111, name:"Aeolin",  emoji:"🐦", types:["Wind","Normal"],
    base:{hp:50,atk:48,def:35,spa:50,spd:36,spe:87},
    learnset:[[1,"tackle",[20,"jetstream"]],[1,"gust"],[8,"quick_attack"],[16,"wing_attack"],[21,"harden"],[24,"air_slash"],[32,"body_slam",[5,"mistveil"]],[36,"instinct_slash"],[3,"zephyr_dance"],[31,"wild_tumble"]],
    evolveTo:112, evolveLevel:20, catchRate:230, expYield:65, rarity:"common",
    desc:"A common draft finch that rides air currents effortlessly." },

  112: { id:112, name:"Cyclavel",   emoji:"🦅", types:["Wind"],
    base:{hp:61,atk:90,def:58,spa:85,spd:61,spe:130},
    learnset:[[1,"gust"],[2,"wing_attack"],[3,"jetstream"],[4,"mistveil"],[21,"air_slash"],[27,"swords_dance"],[29,"body_slam"],[34,"scratch"],[41,"steel_wing"],[48,"skyfall"],[55,"hurricane"],[62,"tempest_wrath"],[5,"zephyr_dance"],[42,"leer"]],
    evolveTo:113, evolveLevel:42, catchRate:65, expYield:195, rarity:"uncommon",
    desc:"A great cyclone eagle. Causes miniature tornadoes with each wingbeat." },

  114: { id:114, name:"Nimbusel",   emoji:"☁️", types:["Wind","Fairy"],
    base:{hp:54,atk:32,def:33,spa:76,spd:71,spe:67},
    learnset:[[1,"tackle",[22,"mistveil"]],[1,"gust"],[9,"fairy_wind"],[17,"sweet_kiss"],[20,"tail_whip"],[25,"air_slash"],[33,"moonblast",[5,"zephyr_dance"]],[36,"dazzling_gleam"],[3,"vortex_trap"],[31,"storm_surge"]],
    evolveTo:115, evolveLevel:25, catchRate:150, expYield:80, rarity:"common",
    desc:"A fluffy cloud puffball. It floats serenely but fights with surprising force." },

  115: { id:115, name:"Aetherworn",  emoji:"👻", types:["Wind","Dark"],
    base:{hp:80,atk:60,def:64,spa:107,spd:85,spe:94},
    learnset:[[1,"gust"],[2,"air_slash"],[3,"tackle"],[4,"mistveil"],[30,"growl"],[35,"shadowstep"],[40,"night_slash"],[45,"dark_pulse"],[50,"shadow_ball"],[55,"cyclone_blade"],[60,"nightmare_pulse"],[65,"hurricane"],[5,"zephyr_dance"],[42,"storm_surge"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:195, rarity:"uncommon",
    desc:"A ghost of mist that drifts at night. Its touch drains life energy." },

  // ===== ICE =====
  47: { id:47, name:"Cryokin",    emoji:"🐺", types:["Ice"],
    base:{hp:49,atk:54,def:51,spa:63,spd:47,spe:73},
    learnset:[[1,"scratch",[22,"glacial_shard"]],[1,"powder_snow"],[8,"quick_attack"],[16,"icicle_crash"],[24,"ice_beam"],[29,"recover"],[32,"ice_punch"],[40,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[31,"leer"]],
    evolveTo:48, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"An ice wolf pup with fur as white as fresh snow. Very loyal and fierce." },

  48: { id:48, name:"Boreovast",emoji:"🐺", types:["Ice"],
    base:{hp:89,atk:85,def:55,spa:81,spd:76,spe:94},
    learnset:[[1,"powder_snow"],[2,"quick_attack"],[3,"ice_beam"],[4,"icicle_crash"],[5,"scratch"],[6,"permafrost"],[28,"recover"],[29,"ice_punch"],[37,"blizzard"],[40,"hoarfrost_bite"],[52,"body_slam"],[64,"avalanche_drive"],[7,"winter_shroud"],[44,"leer"]],
    evolveTo:49, evolveLevel:44, catchRate:40, expYield:220, rarity:"uncommon",
    desc:"A blizzard hound that howls to summon snowstorms. Fearsome and fast." },

  50: { id:50, name:"Nivelin",   emoji:"🐏", types:["Ice","Normal"],
    base:{hp:49,atk:49,def:55,spa:52,spd:64,spe:54},
    learnset:[[1,"tackle",[22,"permafrost"]],[1,"powder_snow"],[10,"harden"],[18,"ice_beam"],[20,"vital_pulse"],[26,"body_slam"],[34,"blizzard",[5,"winter_shroud"]],[36,"headbutt"],[3,"frostfire_veil"],[31,"glacial_shard"]],
    evolveTo:51, evolveLevel:24, catchRate:180, expYield:77, rarity:"common",
    desc:"A fluffy snow sheep. Its wool absorbs cold air and condenses it to ice." },

  51: { id:51, name:"Glacivern",  emoji:"💎", types:["Ice"],
    base:{hp:76,atk:67,def:93,spa:106,spd:91,spe:56},
    learnset:[[1,"powder_snow"],[2,"winter_shroud"],[3,"harden"],[4,"vital_pulse"],[5,"ice_beam"],[6,"permafrost"],[31,"blizzard"],[33,"headbutt"],[34,"growl"],[44,"recover"],[54,"hoarfrost_bite"],[64,"icicle_crash"],[7,"frostfire_veil"],[43,"leer"]],
    evolveTo:52, evolveLevel:42, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A crystalline ice being of pure frozen beauty. It never melts." },

  53: { id:53, name:"Cryovane",  emoji:"🦢", types:["Ice","Wind"],
    base:{hp:54,atk:40,def:41,spa:68,spd:55,spe:98},
    learnset:[[1,"powder_snow",[22,"cryo_lance"]],[1,"gust"],[12,"wing_attack"],[20,"ice_beam"],[28,"air_slash"],[31,"glacial_tomb"],[36,"blizzard"],[44,"hurricane",[5,"permafrost"]],[3,"winter_shroud"],[33,"thermal_dive"]],
    evolveTo:54, evolveLevel:30, catchRate:100, expYield:95, rarity:"common",
    desc:"A graceful bird with ice-crystal wings. Leaves frost trails in the sky." },

  54: { id:54, name:"Arcturex",     emoji:"🐻‍❄️", types:["Ice","Ground"],
    base:{hp:92,atk:101,def:89,spa:66,spd:79,spe:61},
    learnset:[[1,"powder_snow"],[2,"ice_beam"],[3,"permafrost"],[30,"glacial_tomb"],[33,"blizzard"],[35,"battle_cry"],[40,"scratch"],[45,"glacial_shard"],[50,"icicle_crash"],[55,"earth_power"],[60,"avalanche_drive"],[65,"earthquake"],[4,"winter_shroud"],[42,"sinkhole_maw"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:228, rarity:"uncommon",
    desc:"A massive polar bear Lumo. Can freeze the ground solid with its roar." },

  45: { id:45, name:"Slatis",   emoji:"🌨️", types:["Ice","Water"],
    base:{hp:51,atk:39,def:49,spa:74,spd:64,spe:45},
    learnset:[[1,"tackle",[20,"frost_breath"]],[1,"water_gun"],[9,"powder_snow"],[14,"growl"],[17,"ice_beam"],[24,"scratch"],[25,"surf"],[33,"blizzard",[5,"permafrost"]],[34,"bubble_beam"],[42,"riptide_slam"],[3,"winter_shroud"],[32,"aqua_tail"]],
    evolveTo:46, evolveLevel:32, catchRate:130, expYield:82, rarity:"common",
    desc:"A sleet sprite that lives in cold mountain streams. Chills the air around it." },

  // ===== DARK =====
  118: { id:118, name:"Umbrakin",   emoji:"🐕", types:["Dark"],
    base:{hp:39,atk:56,def:44,spa:62,spd:39,spe:88},
    learnset:[[1,"scratch",[22,"shadowstep"]],[1,"bite"],[8,"quick_attack"],[16,"night_slash"],[24,"crunch"],[29,"recover"],[32,"dark_pulse"],[40,"shadow_ball",[5,"eclipse_shroud"]],[3,"dread_howl"],[31,"leer"]],
    evolveTo:119, evolveLevel:25, catchRate:150, expYield:88, rarity:"common",
    desc:"A shadow puppy that hides in darkness. Its eyes glow red at night." },

  119: { id:119, name:"Noctivast",  emoji:"🐕", types:["Dark"],
    base:{hp:81,atk:90,def:57,spa:83,spd:77,spe:92},
    learnset:[[1,"bite"],[2,"quick_attack"],[3,"crunch"],[4,"night_slash"],[5,"scratch"],[6,"eclipse_shroud"],[26,"recover"],[29,"dark_pulse"],[37,"shadow_ball"],[38,"nightmare_pulse"],[51,"body_slam"],[64,"void_rend"],[7,"dread_howl"],[44,"leer"]],
    evolveTo:120, evolveLevel:44, catchRate:45, expYield:316, rarity:"uncommon",
    desc:"A hound of the night. Moves silently and strikes from blind spots." },

  121: { id:121, name:"Noxalin",     emoji:"🦇", types:["Dark","Wind"],
    base:{hp:52,atk:47,def:34,spa:57,spd:51,spe:106},
    learnset:[[1,"bite",[22,"shadowstep"]],[1,"gust"],[9,"wing_attack"],[17,"dark_pulse"],[25,"air_slash"],[29,"soul_rend"],[33,"shadow_ball"],[41,"hurricane",[5,"eclipse_shroud"]],[3,"dread_howl"],[32,"void_rend"]],
    evolveTo:122, evolveLevel:28, catchRate:130, expYield:85, rarity:"common",
    desc:"A dark bat that absorbs light. Creates zones of absolute darkness." },

  122: { id:122, name:"Umbraveth", emoji:"🦇", types:["Dark","Wind"],
    base:{hp:63,atk:78,def:48,spa:116,spd:78,spe:119},
    learnset:[[1,"dark_pulse"],[2,"wing_attack"],[3,"air_slash"],[4,"shadowstep"],[5,"eclipse_shroud"],[30,"shadow_ball"],[35,"growl"],[38,"hurricane"],[42,"tackle"],[49,"night_slash"],[56,"nightmare_pulse"],[63,"cyclone_blade"],[6,"dread_howl"],[43,"void_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A spectral wing beast. Its mere passing through an area chills it completely." },

  123: { id:123, name:"Nocturil", emoji:"🦎", types:["Dark","Poison"],
    base:{hp:51,atk:60,def:50,spa:60,spd:48,spe:62},
    learnset:[[1,"scratch",[22,"obsidian_fang"]],[1,"bite"],[10,"poison_sting"],[18,"night_slash"],[26,"sludge_bomb"],[34,"crunch"],[42,"dark_pulse"],[50,"toxic",[5,"eclipse_shroud"]],[3,"dread_howl"],[36,"blackout_bomb"]],
    evolveTo:124, evolveLevel:32, catchRate:90, expYield:98, rarity:"common",
    desc:"A dark lizard with venomous bite. Camouflages perfectly in shadows." },

  124: { id:124, name:"Phantorvex", emoji:"🐍", types:["Dark","Poison"],
    base:{hp:76,atk:95,def:72,spa:89,spd:73,spe:81},
    learnset:[[1,"bite"],[2,"eclipse_shroud"],[3,"poison_sting"],[4,"obsidian_fang"],[5,"sludge_bomb"],[32,"crunch"],[39,"dark_pulse"],[40,"harden"],[47,"toxic"],[48,"dread_howl"],[56,"venoshock"],[64,"void_rend"],[6,"dark_shroud"],[42,"blackout_bomb"]],
    evolveTo:125, evolveLevel:44, catchRate:35, expYield:218, rarity:"uncommon",
    desc:"A phantom serpent of darkness and venom. Said to haunt ancient ruins." },

  // ===== FAIRY =====
  137: { id:137, name:"Lumkin",     emoji:"🐶", types:["Fairy"],
    base:{hp:42,atk:35,def:50,spa:52,spd:57,spe:76},
    learnset:[[1,"tackle",[22,"pixie_bolt"]],[1,"fairy_wind"],[8,"sweet_kiss"],[16,"dazzling_gleam"],[20,"vital_pulse"],[24,"moonblast"],[32,"recover",[5,"stardust_veil"]],[36,"glitter_storm"],[3,"charm_bloom"],[31,"leer"]],
    evolveTo:138, evolveLevel:25, catchRate:190, expYield:78, rarity:"common",
    desc:"A glowing puppy surrounded by fairy light. Brings luck wherever it goes." },

  138: { id:138, name:"Aetherael", emoji:"🐕", types:["Fairy"],
    base:{hp:71,atk:67,def:68,spa:100,spd:90,spe:77},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"moonblast"],[4,"sweet_kiss"],[29,"recover"],[30,"tail_whip"],[35,"battle_cry"],[40,"quick_attack"],[45,"wish_spark"],[50,"moonveil"],[55,"celestial_wave"],[60,"psystrike"],[5,"stardust_veil"],[39,"leer"]],
    evolveTo:139, evolveLevel:44, catchRate:50, expYield:205, rarity:"uncommon",
    desc:"A luminous hound of fairy power. Its radiance can banish dark spirits." },

  140: { id:140, name:"Faeling",    emoji:"🦋", types:["Fairy","Bug"],
    base:{hp:35,atk:44,def:33,spa:79,spd:71,spe:78},
    learnset:[[1,"fairy_wind",[22,"wish_spark"]],[1,"bug_bite"],[10,"sweet_kiss"],[18,"dazzling_gleam"],[20,"recover"],[26,"moonblast"],[34,"bug_buzz",[5,"stardust_veil"]],[36,"gossamer_lance"],[3,"charm_bloom"],[31,"cocoon_burst"]],
    evolveTo:141, evolveLevel:22, catchRate:160, expYield:82, rarity:"common",
    desc:"A prismatic butterfly that scatters rainbow dust. Hard to catch." },

  141: { id:141, name:"Prisoveth",  emoji:"🦋", types:["Fairy","Wind"],
    base:{hp:83,atk:55,def:60,spa:110,spd:95,spe:88},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"recover"],[4,"sweet_kiss"],[23,"moonblast"],[29,"gust"],[33,"gossamer_lance"],[36,"quick_attack"],[43,"air_slash"],[50,"moonveil"],[57,"glitter_storm"],[64,"hurricane"],[5,"stardust_veil"],[42,"thermal_dive"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:200, rarity:"uncommon",
    desc:"A radiant butterfly of pure fairy energy. Its wings shimmer with all colors." },

  142: { id:142, name:"Dawnirel",  emoji:"✨", types:["Fairy","Psychic"],
    base:{hp:50,atk:48,def:54,spa:74,spd:61,spe:63},
    learnset:[[1,"fairy_wind",[22,"stardust_veil"]],[1,"confusion"],[10,"sweet_kiss"],[18,"psybeam"],[26,"dazzling_gleam"],[30,"neural_storm"],[34,"psychic_move"],[42,"moonblast",[5,"charm_bloom"]],[3,"aurora_veil"],[32,"glitter_storm"]],
    evolveTo:143, evolveLevel:32, catchRate:100, expYield:96, rarity:"common",
    desc:"A dawn spirit that appears at sunrise. Its psychic energy is immense." },

  143: { id:143, name:"Lunarael",   emoji:"🌟", types:["Fairy","Psychic"],
    base:{hp:79,atk:66,def:79,spa:131,spd:105,spe:74},
    learnset:[[1,"dazzling_gleam"],[2,"sweet_kiss"],[32,"psychic_move"],[36,"recover"],[39,"moonblast"],[40,"calm_mind"],[44,"quick_attack"],[48,"wish_spark"],[52,"future_echo"],[56,"celestial_wave"],[60,"psystrike"],[64,"mind_shatter"],[3,"stardust_veil"],[38,"thought_crush"]],
    evolveTo:144, evolveLevel:46, catchRate:25, expYield:248, rarity:"rare",
    desc:"A celestial being of fairy and psychic power. Claims to have come from the stars." },

  // ===== STEEL =====
  147: { id:147, name:"Ferrokin",     emoji:"🤖", types:["Steel"],
    base:{hp:47,atk:60,def:72,spa:37,spd:45,spe:54},
    learnset:[[1,"scratch",[22,"alloy_edge"]],[1,"metal_claw"],[9,"harden"],[17,"flash_cannon"],[25,"steel_wing"],[29,"leer"],[33,"iron_tail"],[41,"body_slam",[5,"magnetize"]],[3,"ironskin"],[32,"tail_whip"]],
    evolveTo:148, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"A puppy encased in iron armor. Slow but incredibly tough." },

  148: { id:148, name:"Adamavast",  emoji:"🦾", types:["Steel"],
    base:{hp:90,atk:107,def:111,spa:65,spd:83,spe:37},
    learnset:[[1,"metal_claw"],[2,"flash_cannon"],[3,"steel_wing"],[4,"magnetize"],[28,"leer"],[30,"iron_tail"],[35,"battle_cry"],[38,"body_slam"],[42,"quick_attack"],[49,"rivet_barrage"],[56,"forge_strike"],[63,"tungsten_ram"],[5,"ironskin"],[43,"recover"]],
    evolveTo:149, evolveLevel:46, catchRate:40, expYield:225, rarity:"uncommon",
    desc:"A steel hound with titanium claws. Almost nothing can break its armor." },

  150: { id:150, name:"Gearon",     emoji:"⚙️", types:["Steel","Electric"],
    base:{hp:48,atk:50,def:67,spa:52,spd:57,spe:54},
    learnset:[[1,"metal_claw",[22,"shrapnel_burst"]],[1,"thunder_shock"],[10,"flash_cannon"],[18,"spark"],[21,"recover"],[26,"thunderbolt"],[34,"flash_cannon"],[38,"plasma_strike"],[42,"thunder",[5,"magnetize"]],[3,"ironskin"],[32,"ball_lightning"]],
    evolveTo:151, evolveLevel:28, catchRate:100, expYield:95, rarity:"common",
    desc:"A mechanical gear-bot that runs on electric power. Loves to tinker." },

  151: { id:151, name:"Ferrotron",    emoji:"🦿", types:["Steel","Electric"],
    base:{hp:77,atk:72,def:92,spa:108,spd:75,spe:66},
    learnset:[[1,"thunderbolt"],[2,"magnetize"],[31,"flash_cannon"],[32,"surge_field"],[36,"harden"],[39,"thunder"],[40,"rivet_barrage"],[44,"volt_surge"],[48,"iron_tail"],[52,"tungsten_ram"],[56,"overcharge"],[60,"hyper_beam"],[3,"ironskin"],[37,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:235, rarity:"uncommon",
    desc:"A mechanical warrior powered by electric cores. Feared on every battlefield." },

  152: { id:152, name:"Imperion",  emoji:"🐢", types:["Steel","Rock"],
    base:{hp:108,atk:61,def:138,spa:59,spd:105,spe:30},
    learnset:[[1,"tackle",[25,"ironskin"]],[1,"rock_throw"],[12,"harden"],[20,"flash_cannon"],[24,"growl"],[28,"rock_slide"],[36,"iron_tail"],[44,"stone_edge"],[45,"temper_edge"],[52,"body_slam",[5,"magnetize"]],[3,"slag_shield"],[37,"crystal_lance"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:318, rarity:"uncommon",
    desc:"A colossal steel-rock turtle. Nigh indestructible but very slow." },

  // ===== POISON =====
  155: { id:155, name:"Toxirin",    emoji:"🐸", types:["Poison"],
    base:{hp:67,atk:56,def:58,spa:71,spd:50,spe:49},
    learnset:[[1,"tackle",[22,"miasma_cloud"]],[1,"poison_sting"],[9,"bubble_beam"],[17,"sludge_bomb"],[20,"battle_cry"],[25,"toxic"],[33,"venoshock"],[36,"sludge_wave"],[41,"sludge_bomb",[5,"toxic_surge"]],[3,"toxin_bloom"],[31,"leer"]],
    evolveTo:156, evolveLevel:24, catchRate:150, expYield:88, rarity:"common",
    desc:"A toxic toad that drips with powerful venom. Warty and repulsive but deadly." },

  156: { id:156, name:"Venekon",   emoji:"🐸", types:["Poison","Water"],
    base:{hp:98,atk:72,def:65,spa:113,spd:87,spe:56},
    learnset:[[1,"poison_sting"],[2,"bubble_beam"],[3,"toxic_surge"],[24,"toxic"],[30,"venoshock"],[32,"tail_whip"],[33,"sludge_wave"],[38,"sludge_bomb"],[40,"scratch"],[48,"venom_lance"],[56,"surf"],[64,"hydro_pump"],[4,"toxin_bloom"],[43,"aqua_tail"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A venom toad of enormous size. Its croaking alone can poison the air." },

  157: { id:157, name:"Acidelix",    emoji:"🫧", types:["Poison"],
    base:{hp:61,atk:47,def:47,spa:75,spd:59,spe:43},
    learnset:[[1,"tackle",[22,"putrid_pulse"]],[1,"poison_sting"],[10,"sludge_bomb"],[18,"toxic"],[21,"vital_pulse"],[26,"venoshock"],[34,"recover"],[38,"sludge_wave"],[42,"sludge_bomb",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"leer"]],
    evolveTo:158, evolveLevel:26, catchRate:130, expYield:95, rarity:"common",
    desc:"A blob of acid that oozes across the ground. Dissolves things with its body." },

  158: { id:158, name:"Toxoloth",  emoji:"🫧", types:["Poison","Ground"],
    base:{hp:98,atk:70,def:86,spa:110,spd:86,spe:30},
    learnset:[[1,"toxic"],[2,"tackle"],[3,"venoshock"],[4,"toxic_surge"],[32,"growl"],[35,"sludge_wave"],[38,"mud_shot"],[39,"sludge_bomb"],[44,"loam_leech"],[50,"terra_spike"],[56,"earth_power"],[62,"earthquake"],[5,"toxin_bloom"],[41,"magnitude"]],
    evolveTo:159, evolveLevel:44, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A sludge behemoth that poisons everything it touches. Its territory reeks." },

  160: { id:160, name:"Miasoveth",   emoji:"🦟", types:["Poison","Wind"],
    base:{hp:49,atk:53,def:30,spa:78,spd:64,spe:77},
    learnset:[[1,"poison_sting",[22,"acid_rain"]],[1,"gust"],[10,"sludge_bomb"],[16,"vital_pulse"],[18,"air_slash"],[26,"toxic"],[29,"miasma_cloud"],[34,"hurricane"],[40,"plague_burst"],[42,"venoshock",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"sludge_wave"]],
    evolveTo:161, evolveLevel:30, catchRate:140, expYield:88, rarity:"common",
    desc:"A miasma fly that leaves toxic trails in its wake. Spreads pestilence." },

  // ===== PSYCHIC =====
  166: { id:166, name:"Mentakin",     emoji:"🐩", types:["Psychic"],
    base:{hp:50,atk:34,def:39,spa:74,spd:72,spe:72},
    learnset:[[1,"tackle",[22,"mind_shatter"]],[1,"confusion"],[8,"quick_attack"],[16,"psybeam"],[24,"psychic_move"],[29,"leer"],[32,"calm_mind"],[40,"psystrike",[5,"prism_ward"]],[3,"mind_reader"],[31,"recover"]],
    evolveTo:167, evolveLevel:25, catchRate:165, expYield:86, rarity:"common",
    desc:"A psychic puppy that reads minds. Can predict attacks before they happen." },

  167: { id:167, name:"Psychovast",   emoji:"🐩", types:["Psychic"],
    base:{hp:78,atk:58,def:54,spa:108,spd:100,spe:107},
    learnset:[[1,"confusion"],[2,"psybeam"],[3,"psychic_move"],[4,"prism_ward"],[29,"calm_mind"],[31,"growl"],[37,"psystrike"],[38,"battle_cry"],[43,"recover"],[49,"wild_tumble"],[55,"telepathic_slam"],[61,"thought_crush"],[5,"mind_reader"],[41,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:318, rarity:"uncommon",
    desc:"A psychic hound whose mind burns with power. Can levitate small objects." },

  168: { id:168, name:"Espelith",     emoji:"🔮", types:["Psychic","Fairy"],
    base:{hp:46,atk:51,def:57,spa:80,spd:79,spe:62},
    learnset:[[1,"confusion",[22,"insight_flare"]],[1,"fairy_wind"],[10,"psybeam"],[18,"dazzling_gleam"],[26,"psychic_move"],[34,"moonblast"],[42,"calm_mind"],[50,"psystrike",[5,"prism_ward"]],[3,"mind_reader"],[36,"glitter_storm"]],
    evolveTo:169, evolveLevel:32, catchRate:90, expYield:100, rarity:"common",
    desc:"A mystical esper being. Bridges the worlds of psychic and fairy magic." },

  169: { id:169, name:"Mentarael",   emoji:"🌀", types:["Psychic"],
    base:{hp:83,atk:62,def:59,spa:119,spd:98,spe:104},
    learnset:[[1,"psybeam"],[2,"psychic_move"],[3,"prism_ward"],[36,"harden"],[39,"calm_mind"],[40,"recover"],[44,"quick_attack"],[47,"psystrike"],[48,"telepathic_slam"],[52,"thought_crush"],[56,"temporal_rift"],[60,"hyper_beam"],[4,"mind_reader"],[35,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:245, rarity:"rare",
    desc:"A being of pure psychic energy. Communicates only by telepathy." },

  170: { id:170, name:"Oneiron",   emoji:"💫", types:["Psychic","Dark"],
    base:{hp:75,atk:69,def:52,spa:125,spd:94,spe:84},
    learnset:[[1,"confusion",[25,"future_echo"]],[1,"bite"],[11,"psybeam"],[19,"dark_pulse"],[23,"swords_dance"],[27,"psychic_move"],[35,"shadow_ball"],[42,"nightmare_pulse"],[43,"night_slash"],[51,"psystrike",[5,"calm_mind"]],[3,"prism_ward"],[37,"void_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:70, expYield:185, rarity:"uncommon",
    desc:"A dreamrift that exists between sleep and waking. It draws power from nightmares." },

  171: { id:171, name:"Drakorius",    emoji:"🐲", types:["Psychic","Dragon"],
    base:{hp:75,atk:88,def:74,spa:112,spd:82,spe:90},
    learnset:[[1,"dragon_breath",[28,"mind_shatter"]],[1,"confusion"],[13,"psybeam"],[21,"dragon_claw"],[24,"swords_dance"],[29,"psychic_move"],[37,"dragon_pulse"],[44,"astral_rend"],[45,"psystrike"],[53,"outrage",[5,"calm_mind"]],[3,"prism_ward"],[38,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A psychic dragon that manipulates reality with its mind. Ancient and mysterious." },

  // ===== DRAGON =====
  172: { id:172, name:"Drakurin",    emoji:"🐣", types:["Dragon"],
    base:{hp:47,atk:73,def:53,spa:63,spd:60,spe:30},
    learnset:[[1,"scratch",[22,"wyrm_strike"]],[1,"dragon_breath"],[12,"dragon_claw"],[20,"vital_pulse"],[22,"dragon_pulse"],[30,"dragon_dance"],[36,"cataclysm_breath"],[40,"outrage",[5,"draconic_roar"]],[3,"primordial_roar"],[31,"recover"]],
    evolveTo:173, evolveLevel:30, catchRate:45, expYield:91, rarity:"uncommon",
    desc:"A baby dragon hatchling. Clumsy but full of fiery determination." },

  173: { id:173, name:"Serpenthos",    emoji:"🐲", types:["Dragon"],
    base:{hp:71,atk:102,def:72,spa:79,spd:65,spe:67},
    learnset:[[1,"dragon_breath"],[2,"dragon_claw"],[3,"dragon_pulse"],[4,"dragon_dance"],[5,"draconic_roar"],[33,"tail_whip"],[36,"battle_cry"],[37,"outrage"],[39,"wild_tumble"],[42,"drake_rush"],[45,"scale_storm"],[46,"hyper_beam"],[6,"primordial_roar"],[30,"recover"]],
    evolveTo:321, evolveLevel:55, catchRate:15, expYield:170, rarity:"rare",
    desc:"A powerful wyrm with tremendous strength. Known to destroy mountains." },

  174: { id:174, name:"Scalevorn", emoji:"🦕", types:["Dragon","Steel"],
    base:{hp:88,atk:115,def:118,spa:75,spd:85,spe:62},
    learnset:[[1,"dragon_claw"],[1,"metal_claw"],[20,"dragon_pulse"],[30,"flash_cannon"],[40,"iron_tail"],[50,"outrage"],[60,"forge_strike"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:38, expYield:218, rarity:"uncommon",
    desc:"An armored dragon whose scales have fused into a steel shell over millennia. Lives deep in metallic caverns." },

  321: { id:321, name:"Dragemian",  emoji:"🐉", types:["Dragon","Fire"],
    base:{hp:86,atk:149,def:101,spa:101,spd:94,spe:66},
    learnset:[[1,"outrage"],[2,"dragon_pulse"],[3,"scale_storm"],[4,"hyper_beam"],[5,"dragon_dance"],[58,"char_dance"],[61,"growl"],[64,"harden"],[65,"flame_fang"],[66,"pyre_fang"],[67,"heat_wave"],[68,"inferno"],[69,"ancient_breath"],[70,"fire_blast"]],
    evolveTo:null, evolveLevel:null, catchRate:5, expYield:340, rarity:"legendary",
    desc:"The lord of all dragons. Its fire is hot enough to melt any metal." },

  175: { id:175, name:"Neruveth",    emoji:"🦭", types:["Water","Dragon"],
    base:{hp:71,atk:104,def:76,spa:98,spd:92,spe:88},
    learnset:[[1,"water_gun",[28,"eon_crash"]],[1,"dragon_breath"],[14,"surf"],[17,"harden"],[22,"dragon_claw"],[30,"hydro_pump"],[31,"coral_barrage"],[38,"dragon_pulse"],[43,"tidal_crush"],[46,"outrage",[5,"tidecaller"]],[3,"deepwater_hymn"],[34,"ocean_tempest"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A sea dragon that rules the ocean floor. Massive and aquatic." },

  176: { id:176, name:"Tempyroth",   emoji:"⚡", types:["Electric","Dragon"],
    base:{hp:68,atk:82,def:62,spa:117,spd:78,spe:113},
    learnset:[[1,"thunder_shock",[28,"wyrm_strike"]],[1,"dragon_breath"],[12,"thunderbolt"],[17,"harden"],[20,"dragon_claw"],[28,"thunder"],[30,"dynamo_whip"],[36,"dragon_pulse"],[42,"eon_crash"],[44,"outrage",[5,"thunder_wave"]],[3,"static_cage"],[33,"ion_cannon"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A dragon of lightning storms. Calls down thunder with each roar." },

  177: { id:177, name:"Glaciroth",emoji:"💠", types:["Ice","Dragon"],
    base:{hp:73,atk:96,def:79,spa:115,spd:100,spe:74},
    learnset:[[1,"powder_snow",[28,"scale_storm"]],[1,"dragon_breath"],[13,"ice_beam"],[21,"dragon_claw"],[24,"recover"],[29,"blizzard"],[37,"dragon_pulse"],[44,"cryo_lance"],[45,"outrage"],[53,"ice_punch",[5,"permafrost"]],[3,"winter_shroud"],[38,"glacial_tomb"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A crystal dragon of ice. Its scales deflect nearly any attack." },

  // ===== NORMAL =====
  178: { id:178, name:"Fluffen",     emoji:"🐱", types:["Normal"],
    base:{hp:64,atk:55,def:43,spa:41,spd:48,spe:54},
    learnset:[[1,"tackle",[20,"momentum_rush"]],[1,"growl"],[8,"scratch"],[16,"quick_attack"],[24,"body_slam"],[29,"harden"],[32,"headbutt"],[40,"hyper_beam",[5,"tail_whip"]],[3,"leer"],[31,"endure_pulse"]],
    evolveTo:179, evolveLevel:20, catchRate:220, expYield:68, rarity:"common",
    desc:"An adorable fur ball. Incredibly soft but surprisingly tough in a fight." },

  179: { id:179, name:"Velvetine",    emoji:"🐈", types:["Normal"],
    base:{hp:83,atk:91,def:82,spa:55,spd:66,spe:100},
    learnset:[[1,"scratch"],[2,"quick_attack"],[3,"growl"],[21,"body_slam"],[26,"harden"],[29,"headbutt"],[30,"leer"],[37,"hyper_beam"],[38,"swords_dance"],[47,"vital_pulse"],[56,"instinct_slash"],[65,"night_slash"],[4,"tail_whip"],[44,"tackle"]],
    evolveTo:null, evolveLevel:null, catchRate:80, expYield:180, rarity:"common",
    desc:"A graceful cat with retractable steel-like claws. Nimble and quick." },

  180: { id:180, name:"Lopikin",     emoji:"🐰", types:["Normal"],
    base:{hp:43,atk:44,def:38,spa:38,spd:38,spe:78},
    learnset:[[1,"tackle",[20,"wild_tumble"]],[1,"tail_whip"],[8,"quick_attack"],[16,"headbutt"],[17,"recover"],[24,"body_slam",[5,"growl"]],[29,"harden"],[39,"vital_pulse"]],
    evolveTo:181, evolveLevel:18, catchRate:255, expYield:55, rarity:"common",
    desc:"A swift rabbit with huge ears. Can hear predators from far away." },

  181: { id:181, name:"Boundrix",  emoji:"🐇", types:["Normal"],
    base:{hp:88,atk:74,def:49,spa:71,spd:59,spe:117},
    learnset:[[1,"quick_attack"],[2,"headbutt"],[3,"tackle"],[4,"recover"],[5,"growl"],[18,"wild_tumble"],[21,"body_slam"],[27,"leer"],[36,"battle_cry"],[45,"swords_dance"],[54,"momentum_rush"],[63,"hyper_beam"],[6,"tail_whip"],[43,"scratch"]],
    evolveTo:null, evolveLevel:null, catchRate:100, expYield:165, rarity:"common",
    desc:"A super-quick bouncing rabbit. Few can outrun this energetic creature." },

  182: { id:182, name:"Rotunden",   emoji:"🐻", types:["Normal"],
    base:{hp:81,atk:67,def:62,spa:52,spd:41,spe:48},
    learnset:[[1,"tackle",[22,"battle_cry"]],[1,"growl"],[10,"headbutt"],[18,"body_slam"],[26,"swords_dance"],[30,"scratch"],[34,"hyper_beam"],[42,"recover",[5,"tail_whip"]],[3,"leer"],[32,"double_strike"]],
    evolveTo:183, evolveLevel:25, catchRate:140, expYield:98, rarity:"common",
    desc:"A roly-poly bear. Loves honey and naps. Surprisingly strong when angry." },

  183: { id:183, name:"Glutoros",    emoji:"🐻", types:["Normal"],
    base:{hp:113,atk:93,def:79,spa:75,spd:66,spe:58},
    learnset:[[1,"headbutt"],[2,"battle_cry"],[3,"body_slam"],[4,"tail_whip"],[5,"growl"],[6,"tackle"],[25,"swords_dance"],[31,"hyper_beam"],[38,"leer"],[39,"recover"],[51,"harden"],[64,"vital_pulse"],[7,"focus_roar"],[44,"wild_tumble"]],
    evolveTo:184, evolveLevel:44, catchRate:50, expYield:220, rarity:"uncommon",
    desc:"A tubby great bear of enormous power. Its hugs can crush boulders." },

  185: { id:185, name:"Airellin",   emoji:"🐦", types:["Normal","Wind"],
    base:{hp:60,atk:43,def:31,spa:54,spd:50,spe:64},
    learnset:[[1,"tackle",[22,"wild_tumble"]],[1,"gust"],[8,"quick_attack"],[14,"harden"],[16,"wing_attack"],[24,"air_slash"],[25,"vortex_trap"],[32,"body_slam",[5,"growl"]],[34,"instinct_slash"],[42,"skyfall"],[3,"tail_whip"],[33,"feral_swipe"]],
    evolveTo:186, evolveLevel:28, catchRate:180, expYield:72, rarity:"common",
    desc:"A pudgy bird that barely fits in trees. Better at fighting than flying." },

  187: { id:187, name:"Norindel",     emoji:"🐷", types:["Normal"],
    base:{hp:65,atk:66,def:62,spa:42,spd:44,spe:30},
    learnset:[[1,"tackle",[22,"momentum_rush"]],[1,"growl"],[10,"headbutt"],[14,"recover"],[20,"body_slam"],[24,"battle_cry"],[30,"swords_dance"],[33,"scratch"],[40,"hyper_beam",[5,"tail_whip"]],[42,"wild_tumble"],[3,"leer"],[32,"quick_attack"]],
    evolveTo:188, evolveLevel:30, catchRate:170, expYield:80, rarity:"common",
    desc:"A snuffling pig Lumo that loves digging for truffles. Stubborn and cute." },

  // ===== ROCK =====
  191: { id:191, name:"Petrikin",   emoji:"🪨", types:["Rock"],
    base:{hp:60,atk:63,def:73,spa:46,spd:31,spe:45},
    learnset:[[1,"tackle",[22,"obsidian_crash"]],[1,"rock_throw"],[8,"harden"],[16,"headbutt"],[24,"rock_slide"],[29,"tail_whip"],[32,"stone_edge"],[40,"body_slam",[5,"granite_wall"]],[3,"petrify_gaze"],[31,"growl"]],
    evolveTo:192, evolveLevel:25, catchRate:160, expYield:88, rarity:"common",
    desc:"A rock puppy with pebble-studded fur. Loves rolling into a ball." },

  192: { id:192, name:"Lithavast",emoji:"🪨", types:["Rock","Ground"],
    base:{hp:82,atk:108,def:112,spa:50,spd:57,spe:69},
    learnset:[[1,"rock_throw"],[2,"headbutt"],[3,"harden"],[4,"rock_slide"],[5,"granite_wall"],[29,"stone_edge"],[33,"tremor_stomp"],[37,"body_slam"],[41,"earth_power"],[49,"crystal_lance"],[57,"landslide"],[65,"earthquake"],[6,"petrify_gaze"],[44,"magnitude"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:222, rarity:"uncommon",
    desc:"A boulder hound encrusted with stones. Can cause landslides by running." },

  193: { id:193, name:"Rugothon",    emoji:"🦞", types:["Rock","Water"],
    base:{hp:71,atk:78,def:89,spa:52,spd:63,spe:68},
    learnset:[[1,"scratch",[25,"geode_burst"]],[1,"rock_throw"],[11,"water_gun"],[16,"swords_dance"],[19,"rock_slide"],[27,"aqua_tail"],[29,"sandstone_rush"],[35,"stone_edge"],[40,"sea_serpent_strike"],[43,"surf",[5,"granite_wall"]],[3,"petrify_gaze"],[33,"landslide"]],
    evolveTo:194, evolveLevel:38, catchRate:75, expYield:168, rarity:"uncommon",
    desc:"A crag claw crab that lives on rocky sea cliffs. Fiercely territorial." },

  195: { id:195, name:"Prismolith",  emoji:"💎", types:["Rock","Ice"],
    base:{hp:70,atk:66,def:101,spa:77,spd:87,spe:38},
    learnset:[[1,"rock_throw",[25,"crystal_lance"]],[1,"powder_snow"],[12,"harden"],[17,"swords_dance"],[20,"rock_slide"],[28,"ice_beam"],[31,"stalactite_drop"],[36,"stone_edge"],[43,"icicle_crash"],[44,"blizzard",[5,"granite_wall"]],[3,"petrify_gaze"],[33,"quarry_crush"]],
    evolveTo:196, evolveLevel:40, catchRate:70, expYield:172, rarity:"uncommon",
    desc:"A crystal of ice and stone. Formed under tremendous pressure underground." },

  // ===== BUG =====
  197: { id:197, name:"Vermelin",   emoji:"🐛", types:["Bug"],
    base:{hp:42,atk:30,def:35,spa:30,spd:30,spe:39},
    learnset:[[1,"tackle",[5,"silk_bind"]],[1,"string_shot"],[5,"bug_bite",[6,"chitin_guard"]],[13,"growl"],[20,"swords_dance"],[27,"scratch"],[34,"venom_drool"],[41,"mandible_crush"]],
    evolveTo:198, evolveLevel:7, catchRate:255, expYield:39, rarity:"common",
    desc:"A cute caterpillar. Harmless and curious, though it spins strong silk." },

  198: { id:198, name:"Chrysalix",  emoji:"🫙", types:["Bug"],
    base:{hp:46,atk:30,def:58,spa:30,spd:30,spe:30},
    learnset:[[17,"harden"]],
    evolveTo:199, evolveLevel:10, catchRate:120, expYield:72, rarity:"common",
    desc:"A shimmering cocoon. Inside, something remarkable is taking shape." },

  199: { id:199, name:"Aeridaleth",emoji:"🦋", types:["Bug","Wind"],
    base:{hp:73,atk:39,def:53,spa:104,spd:85,spe:93},
    learnset:[[14,"leer"],[18,"string_shot"],[22,"gust"],[26,"scratch"],[30,"silk_bind"],[34,"sonic_buzz"],[38,"air_slash"],[42,"dazzling_gleam"],[46,"x_scissor"],[50,"bug_buzz"],[54,"stinger_volley"],[58,"hurricane"],[3,"chitin_guard"],[39,"cocoon_burst"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:170, rarity:"uncommon",
    desc:"A glorious butterfly of wind and beauty. Its wing patterns mesmerize foes." },

  200: { id:200, name:"Colerix",  emoji:"🪲", types:["Bug","Rock"],
    base:{hp:61,atk:73,def:71,spa:43,spd:51,spe:30},
    learnset:[[1,"bug_bite",[22,"mandible_crush"]],[1,"rock_throw"],[10,"headbutt"],[18,"x_scissor"],[20,"leer"],[26,"rock_slide"],[34,"stone_edge",[5,"string_shot"]],[36,"swarm_dive"],[3,"chitin_guard"],[31,"magma_rock"]],
    evolveTo:201, evolveLevel:25, catchRate:130, expYield:95, rarity:"common",
    desc:"A heavily armored beetle. Its rock-hard shell is practically indestructible." },

  201: { id:201, name:"Scarabion",  emoji:"🪲", types:["Bug","Steel"],
    base:{hp:88,atk:124,def:94,spa:64,spd:69,spe:46},
    learnset:[[1,"x_scissor"],[2,"string_shot"],[25,"rock_slide"],[30,"harden"],[31,"stone_edge"],[33,"swarm_dive"],[35,"pheromone_rush"],[40,"flash_cannon"],[45,"bug_buzz"],[50,"stinger_volley"],[55,"iron_tail"],[60,"hyper_beam"],[3,"chitin_guard"],[39,"cocoon_burst"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A steel beetle of terrifying might. Its mandibles can cut through iron." },


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


  // ===== LEGENDARIES (IDs 314-321) =====
  314: { id:314, name:"Aeolaxis",  emoji:"🌪️", types:["Wind","Electric"],
    base:{hp:102,atk:84,def:93,spa:125,spd:96,spe:100},
    learnset:[[1,"air_slash"],[1,"thunder_shock"],[7,"gust"],[14,"spark"],[21,"zephyr_dance"],[28,"thunderbolt"],[35,"downdraft"],[42,"hurricane"],[49,"squall_slash"],[56,"overcharge"],[63,"tempest_wrath"],[70,"gale_cannon"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Storm Bird. Said to control all weather in Lumoria." },

  315: { id:315, name:"Pyrovanus",   emoji:"🌋", types:["Fire","Rock"],
    base:{hp:113,atk:145,def:111,spa:102,spd:89,spe:50},
    learnset:[[1,"ember"],[1,"rock_throw"],[7,"flame_fang"],[14,"rock_slide"],[21,"magma_surge"],[28,"stone_edge"],[35,"ashfall"],[42,"flamethrower"],[49,"magma_rock"],[56,"fire_blast"],[63,"caldera_meltdown"],[70,"bedrock_slam"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Volcano Titan. Eruptions across Lumoria mark its awakening." },

  316: { id:316, name:"Thalassovex", emoji:"🌊", types:["Water","Dark"],
    base:{hp:99,atk:102,def:85,spa:130,spd:92,spe:82},
    learnset:[[1,"water_gun"],[1,"bite"],[7,"bubble_beam"],[14,"crunch"],[21,"abyssal_jet"],[28,"dark_pulse"],[35,"surf"],[42,"abyssal_snare"],[49,"dragon_pulse"],[56,"soul_rend"],[63,"hydro_pump"],[70,"geyser_burst"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Abyss Drake. Lurks in the deepest ocean trenches." },

  // ===== NEW LUMOS IDs 108-167 =====

  // ===== ELECTRIC/ROCK =====
  92: { id:92, name:"Voltrix", emoji:"⚡", types:["Electric","Rock"],
    base:{hp:62,atk:68,def:75,spa:48,spd:55,spe:41},
    learnset:[[1,"rock_throw",[22,"arc_flash"]],[1,"thunder_shock"],[10,"spark"],[18,"rock_slide"],[20,"recover"],[26,"thunderbolt"],[34,"stone_edge",[5,"thunder_wave"]],[36,"volt_surge"],[3,"static_cage"],[31,"ball_lightning"]],
    evolveTo:93, evolveLevel:30, catchRate:130, expYield:96, rarity:"common",
    desc:"A rocky beetle crackling with stored lightning. Its shell acts as a living battery." },

  // ===== STEEL/DARK =====
  134: { id:134, name:"Aeronyx", emoji:"🦇", types:["Steel","Dark"],
    base:{hp:49,atk:51,def:69,spa:45,spd:57,spe:66},
    learnset:[[1,"bite",[20,"shadowstep"]],[1,"metal_claw"],[9,"wing_attack"],[17,"dark_pulse"],[21,"leer"],[25,"flash_cannon"],[33,"crunch",[5,"magnetize"]],[36,"shadow_ball"],[3,"ironskin"],[31,"smelt_crush"]],
    evolveTo:135, evolveLevel:28, catchRate:140, expYield:88, rarity:"common",
    desc:"A small bat with scrap-metal wings that screech on the wind. Lives in old ruins." },

  // ===== FIRE/GROUND =====
  19: { id:19, name:"Magmaurin", emoji:"🐾", types:["Fire","Ground"],
    base:{hp:68,atk:70,def:59,spa:51,spd:43,spe:49},
    learnset:[[1,"ember",[22,"magma_surge"]],[1,"scratch"],[9,"mud_shot"],[17,"flame_fang"],[20,"leer"],[25,"earthquake"],[33,"flamethrower",[5,"scorch_veil"]],[36,"cinderwhirl"],[3,"embercloak"],[31,"wildfire_surge"]],
    evolveTo:20, evolveLevel:26, catchRate:150, expYield:92, rarity:"common",
    desc:"A fire mole that tunnels through volcanic rock. Its claws glow orange with heat." },

  // ===== FAIRY/GRASS =====
  72: { id:72, name:"Floralin", emoji:"🌸", types:["Fairy","Grass"],
    base:{hp:39,atk:35,def:40,spa:63,spd:65,spe:59},
    learnset:[[1,"tackle",[20,"stardust_veil"]],[1,"fairy_wind"],[8,"vine_whip"],[16,"dazzling_gleam"],[21,"leer"],[24,"razor_leaf"],[32,"moonblast",[5,"sweet_kiss"]],[36,"seed_bomb"],[3,"charm_bloom"],[31,"leaf_blade"]],
    evolveTo:73, evolveLevel:20, catchRate:220, expYield:70, rarity:"common",
    desc:"A puff of fairy pollen given form. It drifts wherever the breeze takes it." },

  // ===== NORMAL/GROUND =====
  104: { id:104, name:"Arenikin", emoji:"🐾", types:["Normal","Ground"],
    base:{hp:47,atk:63,def:55,spa:46,spd:32,spe:64},
    learnset:[[1,"tackle",[22,"sandstrike"]],[1,"growl"],[8,"mud_shot"],[16,"quick_attack"],[20,"clay_armor"],[24,"headbutt"],[32,"earthquake",[5,"tail_whip"]],[36,"boulder_roll"],[3,"leer"],[31,"mud_bomb"]],
    evolveTo:105, evolveLevel:22, catchRate:180, expYield:78, rarity:"common",
    desc:"A sandy-furred critter that kicks up dust clouds when startled. Very skittish." },

  // ===== WATER/POISON =====
  31: { id:31, name:"Toxaquil", emoji:"🐙", types:["Water","Poison"],
    base:{hp:52,atk:50,def:55,spa:57,spd:52,spe:51},
    learnset:[[1,"water_gun",[22,"putrid_pulse"]],[1,"poison_sting"],[10,"bubble_beam"],[18,"sludge_bomb"],[20,"recover"],[26,"surf"],[34,"toxic",[5,"tidecaller"]],[36,"corrosion_fang"],[3,"deepwater_hymn"],[31,"sludge_wave"]],
    evolveTo:32, evolveLevel:28, catchRate:130, expYield:90, rarity:"common",
    desc:"A polypoid sea creature that releases clouds of inky venom to escape predators." },

  // ===== WATER/STEEL =====
  37: { id:37, name:"Coralossus", emoji:"🪸", types:["Water","Steel"],
    base:{hp:88,atk:83,def:118,spa:71,spd:90,spe:30},
    learnset:[[1,"water_gun",[25,"ironskin"]],[1,"metal_claw"],[11,"harden"],[16,"swords_dance"],[19,"aqua_tail"],[27,"flash_cannon"],[29,"rivet_barrage"],[35,"surf"],[40,"tidal_crush"],[43,"iron_tail",[5,"tidecaller"]],[3,"deepwater_hymn"],[33,"smelt_crush"]],
    evolveTo:38, evolveLevel:44, catchRate:55, expYield:188, rarity:"uncommon",
    desc:"A golem formed from centuries of compressed coral and sunken steel. Nearly indestructible." },

  // ===== WATER/WIND =====
  39: { id:39, name:"Thalveth", emoji:"🐬", types:["Water","Wind"],
    base:{hp:73,atk:74,def:69,spa:86,spd:72,spe:84},
    learnset:[[1,"water_gun",[24,"tidal_crush"]],[1,"gust"],[12,"bubble_beam"],[20,"wing_attack"],[25,"swords_dance"],[28,"surf"],[36,"air_slash"],[44,"hydro_pump"],[45,"riptide_slam"],[52,"hurricane",[5,"tidecaller"]],[3,"deepwater_hymn"],[37,"storm_surge"]],
    evolveTo:40, evolveLevel:42, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A dolphin that leaps between ocean waves and sea winds. Its song calms storms." },

  // ===== WIND/PSYCHIC =====
  116: { id:116, name:"Zephyrin", emoji:"🌀", types:["Wind","Psychic"],
    base:{hp:43,atk:32,def:35,spa:69,spd:54,spe:95},
    learnset:[[1,"gust",[22,"mind_shatter"]],[1,"confusion"],[9,"quick_attack"],[17,"air_slash"],[25,"psybeam"],[29,"psystrike"],[33,"hurricane"],[41,"psychic_move",[5,"mistveil"]],[3,"zephyr_dance"],[32,"astral_rend"]],
    evolveTo:117, evolveLevel:32, catchRate:110, expYield:90, rarity:"common",
    desc:"A wisp of wind given a curious mind. Follows trainers to observe how they think." },

  // ===== WATER/FAIRY =====
  34: { id:34, name:"Pearlith", emoji:"🐚", types:["Water","Fairy"],
    base:{hp:36,atk:37,def:52,spa:69,spd:62,spe:57},
    learnset:[[1,"tackle",[22,"wish_spark"]],[1,"water_gun"],[8,"fairy_wind"],[16,"bubble_beam"],[20,"leer"],[24,"dazzling_gleam"],[32,"surf",[5,"tidecaller"]],[36,"riptide_slam"],[3,"deepwater_hymn"],[31,"moonblast"]],
    evolveTo:35, evolveLevel:24, catchRate:200, expYield:74, rarity:"common",
    desc:"A tiny shellfish encasing a fairy-touched pearl. Shimmers with a gentle inner light." },

  // ===== GRASS/DARK =====
  78: { id:78, name:"Sylvnox", emoji:"🌿", types:["Grass","Dark"],
    base:{hp:61,atk:62,def:48,spa:59,spd:54,spe:69},
    learnset:[[1,"vine_whip",[22,"root_lance"]],[1,"bite"],[10,"razor_leaf"],[18,"night_slash"],[26,"energy_ball"],[30,"grove_wrath"],[34,"crunch"],[42,"dark_pulse",[5,"sleep_powder"]],[3,"spore_burst"],[32,"void_rend"]],
    evolveTo:79, evolveLevel:30, catchRate:110, expYield:98, rarity:"common",
    desc:"A shadowy plant sprite that hides in dark undergrowth. Its thorns drip with shadow energy." },

  // ===== POISON/GRASS =====
  162: { id:162, name:"Marlix", emoji:"🌾", types:["Poison","Grass"],
    base:{hp:55,atk:56,def:53,spa:59,spd:48,spe:66},
    learnset:[[1,"poison_sting",[22,"miasma_cloud"]],[1,"vine_whip"],[10,"sludge_bomb"],[18,"razor_leaf"],[26,"toxic"],[30,"petal_blitz"],[34,"energy_ball"],[42,"venoshock",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"sludge_wave"]],
    evolveTo:163, evolveLevel:28, catchRate:120, expYield:94, rarity:"common",
    desc:"A bog plant with razor-edged thorns dripping toxic sap. Thrives in poisoned swamps." },

  // ===== DARK =====
  126: { id:126, name:"Vexakin", emoji:"👻", types:["Dark"],
    base:{hp:30,atk:38,def:31,spa:56,spd:59,spe:79},
    learnset:[[1,"bite"],[1,"leer"],[8,"quick_attack"],[16,"dark_pulse"],[20,"shadowstep"],[21,"vital_pulse"],[24,"crunch"],[32,"shadow_ball",[5,"eclipse_shroud"]],[36,"void_rend"],[3,"dread_howl"],[31,"recover"]],
    evolveTo:127, evolveLevel:26, catchRate:160, expYield:80, rarity:"common",
    desc:"A faint wraith of shadow energy. Haunts dark places and feeds on fearful emotions." },

  // ===== PSYCHIC/DARK =====
  128: { id:128, name:"Mentarix", emoji:"🔮", types:["Psychic","Dark"],
    base:{hp:41,atk:50,def:49,spa:78,spd:69,spe:61},
    learnset:[[1,"confusion",[22,"telepathic_slam"]],[1,"bite"],[10,"psybeam"],[18,"dark_pulse"],[26,"psychic_move"],[30,"neural_storm"],[34,"shadow_ball"],[42,"psystrike",[5,"calm_mind"]],[3,"prism_ward"],[32,"blackout_bomb"]],
    evolveTo:129, evolveLevel:34, catchRate:90, expYield:100, rarity:"common",
    desc:"A shade of psychic darkness. It exists half in reality and half in the mind's eye." },

  // ===== DARK/GRASS =====
  130: { id:130, name:"Necralia", emoji:"🌿", types:["Dark","Grass"],
    base:{hp:76,atk:72,def:79,spa:86,spd:74,spe:63},
    learnset:[[1,"bite",[24,"obsidian_fang"]],[1,"vine_whip"],[11,"night_slash"],[19,"razor_leaf"],[23,"recover"],[27,"crunch"],[35,"energy_ball"],[42,"nightmare_pulse"],[43,"dark_pulse"],[51,"shadow_ball",[5,"eclipse_shroud"]],[3,"dread_howl"],[37,"wicked_blow"]],
    evolveTo:131, evolveLevel:40, catchRate:65, expYield:178, rarity:"uncommon",
    desc:"An ancient mossy boulder animated by dark energy. Feeds on the light of living things." },

  // ===== BUG/FAIRY =====
  202: { id:202, name:"Sericrix", emoji:"🕷️", types:["Bug","Fairy"],
    base:{hp:34,atk:52,def:63,spa:58,spd:49,spe:85},
    learnset:[[1,"string_shot",[22,"silk_bind"]],[1,"fairy_wind"],[9,"bug_bite"],[17,"dazzling_gleam"],[20,"recover"],[25,"x_scissor"],[33,"moonblast",[5,"chitin_guard"]],[36,"swarm_dive"],[3,"compound_glare"],[31,"bug_buzz"]],
    evolveTo:203, evolveLevel:26, catchRate:160, expYield:84, rarity:"common",
    desc:"A spider that weaves silk infused with fairy dust. Its webs shimmer like spun moonlight." },

  // ===== ICE/STEEL =====
  55: { id:55, name:"Glacirin", emoji:"🗡️", types:["Ice","Steel"],
    base:{hp:46,atk:73,def:66,spa:56,spd:52,spe:76},
    learnset:[[1,"powder_snow",[25,"cryo_lance"]],[1,"metal_claw"],[11,"ice_punch"],[19,"flash_cannon"],[27,"icicle_crash"],[30,"smelt_crush"],[35,"iron_tail"],[43,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[33,"forge_strike"]],
    evolveTo:56, evolveLevel:36, catchRate:90, expYield:110, rarity:"uncommon",
    desc:"A blade of living ice and metal. Keeps its edge forever sharp in the coldest conditions." },

  // ===== ICE/FAIRY =====
  57: { id:57, name:"Speculith", emoji:"🐟", types:["Ice","Fairy"],
    base:{hp:51,atk:37,def:62,spa:73,spd:68,spe:51},
    learnset:[[1,"tackle",[22,"pixie_bolt"]],[1,"powder_snow"],[8,"fairy_wind"],[16,"ice_beam"],[24,"dazzling_gleam"],[29,"avalanche_drive"],[32,"moonblast"],[40,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[31,"subzero_slash"]],
    evolveTo:58, evolveLevel:28, catchRate:150, expYield:85, rarity:"common",
    desc:"A fish with scales like mirror-polished ice. Reflects attacks with its shimmering body." },

  // ===== ICE/DRAGON =====
  59: { id:59, name:"Lunaveris", emoji:"🌙", types:["Ice","Dragon"],
    base:{hp:63,atk:65,def:69,spa:79,spd:64,spe:59},
    learnset:[[1,"powder_snow",[24,"wyrm_strike"]],[1,"dragon_breath"],[12,"ice_beam"],[20,"dragon_claw"],[28,"icicle_crash"],[36,"dragon_pulse"],[44,"blizzard"],[52,"outrage",[5,"permafrost"]],[3,"winter_shroud"],[37,"scale_storm"]],
    evolveTo:60, evolveLevel:40, catchRate:60, expYield:115, rarity:"uncommon",
    desc:"A moonlit dragon of frost. Its scales glimmer with cold starlight on winter nights." },

  // ===== WATER/STEEL =====
  41: { id:41, name:"Titanomare", emoji:"🐋", types:["Water","Steel"],
    base:{hp:124,atk:104,def:119,spa:93,spd:100,spe:64},
    learnset:[[1,"surf",[1,"sea_serpent_strike"]],[1,"iron_tail"],[1,"aqua_tail"],[1,"flash_cannon"],[18,"growl"],[31,"tackle"],[44,"bubble_beam"],[55,"hydro_pump"],[58,"temper_edge"],[65,"hyper_beam",[5,"tidecaller"]],[3,"deepwater_hymn"],[41,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:15, expYield:280, rarity:"rare",
    desc:"A leviathan armored in barnacle-covered steel. Said to be older than the ocean floor itself." },

  // ===== EVOLUTIONS (108+ referenced above) =====

  93: { id:93, name:"Petravolt", emoji:"🪨", types:["Electric","Rock"],
    base:{hp:81,atk:98,def:92,spa:69,spd:57,spe:83},
    learnset:[[1,"rock_slide"],[2,"thunderbolt"],[3,"spark"],[4,"thunder_wave"],[31,"stone_edge"],[33,"volt_surge"],[35,"vital_pulse"],[40,"geode_burst"],[45,"earthquake"],[50,"thunder"],[55,"overcharge"],[60,"hyper_beam"],[5,"static_cage"],[39,"wild_charge"]],
    evolveTo:94, evolveLevel:44, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A towering boulder monster wreathed in crackling lightning. Its stomps cause earthquakes." },

  135: { id:135, name:"Ferrovex", emoji:"🦇", types:["Steel","Dark"],
    base:{hp:82,atk:102,def:94,spa:59,spd:73,spe:78},
    learnset:[[1,"flash_cannon"],[2,"dark_pulse"],[3,"magnetize"],[30,"crunch"],[33,"shadow_ball"],[34,"harden"],[38,"rivet_barrage"],[43,"steel_wing"],[48,"night_slash"],[53,"forge_strike"],[58,"void_rend"],[63,"iron_tail"],[4,"ironskin"],[41,"smelt_crush"]],
    evolveTo:136, evolveLevel:44, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"An iron-clad wraith bat. Its metallic screech disorients enemies from great distances." },

  20: { id:20, name:"Pyroterrath", emoji:"🦔", types:["Fire","Ground"],
    base:{hp:97,atk:121,def:76,spa:69,spd:62,spe:64},
    learnset:[[1,"flame_fang"],[2,"mud_shot"],[3,"earthquake"],[4,"scorch_veil"],[30,"flamethrower"],[31,"battle_cry"],[36,"ashfall"],[41,"earth_power"],[46,"fissure_slam"],[51,"inferno"],[56,"fire_blast"],[61,"tectonic_slam"],[5,"embercloak"],[40,"scorched_earth"]],
    evolveTo:21, evolveLevel:44, catchRate:45, expYield:218, rarity:"uncommon",
    desc:"A lava-boring behemoth that carves tunnels with molten precision. Its spines erupt flame." },

  73: { id:73, name:"Faelomis", emoji:"🌺", types:["Fairy","Grass"],
    base:{hp:78,atk:60,def:65,spa:115,spd:89,spe:93},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"vine_whip"],[4,"sweet_kiss"],[21,"razor_leaf"],[27,"tail_whip"],[29,"moonblast"],[34,"scratch"],[41,"moonveil"],[48,"celestial_wave"],[55,"energy_ball"],[62,"petal_blitz"],[5,"stardust_veil"],[42,"leaf_blade"]],
    evolveTo:74, evolveLevel:44, catchRate:60, expYield:195, rarity:"uncommon",
    desc:"A bloom fairy of extraordinary grace. Its petals carry healing magic on the breeze." },

  105: { id:105, name:"Dravanas", emoji:"🦁", types:["Normal","Ground"],
    base:{hp:91,atk:108,def:71,spa:50,spd:62,spe:112},
    learnset:[[1,"mud_shot"],[2,"growl"],[22,"headbutt"],[28,"vital_pulse"],[29,"earthquake"],[33,"boulder_roll"],[34,"swords_dance"],[40,"wild_tumble"],[46,"momentum_rush"],[52,"body_slam"],[58,"earth_power"],[64,"hyper_beam"],[3,"tail_whip"],[42,"loam_leech"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:200, rarity:"uncommon",
    desc:"A sand lion with a mane of hardened earth. Commands the desert winds." },

  32: { id:32, name:"Noxaquith", emoji:"🦑", types:["Water","Poison"],
    base:{hp:77,atk:80,def:76,spa:108,spd:83,spe:53},
    learnset:[[1,"sludge_bomb"],[2,"surf"],[3,"tidecaller"],[31,"toxic"],[33,"corrosion_fang"],[34,"growl"],[38,"tackle"],[43,"blight_mist"],[48,"venoshock"],[53,"dark_pulse"],[58,"sludge_wave"],[63,"hydro_pump"],[4,"deepwater_hymn"],[41,"venom_lance"]],
    evolveTo:33, evolveLevel:44, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A venomous sea predator with eight toxic-tipped tentacles. Feared by all ocean life." },

  117: { id:117, name:"Pneumathos", emoji:"🌪️", types:["Wind","Psychic"],
    base:{hp:66,atk:57,def:69,spa:114,spd:88,spe:110},
    learnset:[[1,"air_slash"],[2,"psybeam"],[3,"psystrike"],[4,"mind_shatter"],[5,"mistveil"],[32,"hurricane"],[38,"psychic_move"],[39,"harden"],[44,"calm_mind"],[50,"insight_flare"],[56,"thought_crush"],[62,"hyper_beam"],[6,"zephyr_dance"],[41,"astral_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:240, rarity:"rare",
    desc:"A cyclone of pure psychic wind. Its thoughts create miniature tornadoes around it." },

  35: { id:35, name:"Undirael", emoji:"🧜", types:["Water","Fairy"],
    base:{hp:65,atk:62,def:63,spa:110,spd:87,spe:103},
    learnset:[[1,"water_gun"],[2,"fairy_wind"],[3,"bubble_beam"],[4,"dazzling_gleam"],[5,"tidecaller"],[29,"surf"],[30,"tail_whip"],[36,"scratch"],[42,"moonveil"],[48,"aqua_tail"],[54,"moonblast"],[60,"hydro_pump"],[6,"deepwater_hymn"],[40,"sea_serpent_strike"]],
    evolveTo:36, evolveLevel:46, catchRate:40, expYield:222, rarity:"rare",
    desc:"A sea nymph radiating both water and fairy energy. Said to protect lost sailors." },

  79: { id:79, name:"Morraveth", emoji:"🌑", types:["Grass","Dark"],
    base:{hp:84,atk:101,def:80,spa:100,spd:72,spe:67},
    learnset:[[1,"razor_leaf"],[2,"energy_ball"],[3,"night_slash"],[4,"sleep_powder"],[31,"crunch"],[35,"harden"],[39,"dark_pulse"],[40,"photon_leaf"],[45,"shadow_ball"],[50,"blackout_bomb"],[55,"void_rend"],[60,"petal_blitz"],[5,"spore_burst"],[38,"leaf_blade"]],
    evolveTo:80, evolveLevel:44, catchRate:40, expYield:218, rarity:"uncommon",
    desc:"A dark vine predator that ensnares prey in shadow-infused tendrils. Ancient and cunning." },

  163: { id:163, name:"Venomalis", emoji:"🪷", types:["Poison","Grass"],
    base:{hp:88,atk:80,def:60,spa:116,spd:83,spe:58},
    learnset:[[1,"sludge_bomb"],[2,"toxic"],[3,"poison_sting"],[4,"toxic_surge"],[28,"petal_blitz"],[31,"energy_ball"],[35,"growl"],[39,"venoshock"],[42,"battle_cry"],[49,"photon_leaf"],[56,"venom_lance"],[63,"root_lance"],[5,"toxin_bloom"],[43,"leaf_blade"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:215, rarity:"uncommon",
    desc:"A carnivorous flower of potent venom. Its blooms lure in prey before injecting toxins." },

  127: { id:127, name:"Specraxis", emoji:"👻", types:["Dark","Psychic"],
    base:{hp:78,atk:68,def:54,spa:107,spd:90,spe:91},
    learnset:[[1,"dark_pulse"],[2,"eclipse_shroud"],[29,"shadow_ball"],[30,"growl"],[34,"tackle"],[38,"confusion"],[42,"dreamweave"],[46,"night_slash"],[50,"nightmare_pulse"],[54,"psychic_move"],[58,"blackout_bomb"],[62,"psystrike"],[3,"dread_howl"],[39,"astral_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A phantom born from dark and psychic energies. Can read minds and project nightmares." },

  129: { id:129, name:"Voidaxis", emoji:"🌀", types:["Psychic","Dark"],
    base:{hp:83,atk:77,def:72,spa:107,spd:89,spe:75},
    learnset:[[1,"psybeam"],[2,"dark_pulse"],[3,"psychic_move"],[4,"shadow_ball"],[5,"calm_mind"],[39,"psystrike"],[40,"battle_cry"],[44,"prism_ward"],[49,"obsidian_fang"],[54,"void_rend"],[59,"mind_shatter"],[64,"hyper_beam"],[6,"mind_reader"],[41,"thought_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:248, rarity:"rare",
    desc:"A void being of psychic and dark power. Consumes light and thought with equal ease." },

  203: { id:203, name:"Arachnalis", emoji:"🕸️", types:["Bug","Fairy"],
    base:{hp:76,atk:64,def:73,spa:101,spd:89,spe:74},
    learnset:[[1,"dazzling_gleam"],[2,"x_scissor"],[3,"string_shot"],[30,"moonblast"],[31,"charm_bloom"],[34,"harden"],[38,"pheromone_rush"],[42,"wild_tumble"],[46,"gossamer_lance"],[50,"moonveil"],[54,"bug_buzz"],[58,"fae_requiem"],[4,"chitin_guard"],[37,"mandible_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:318, rarity:"uncommon",
    desc:"A radiant spider archon that spins webs that trap bad dreams. Revered as a good omen." },

  56: { id:56, name:"Cryovast", emoji:"⚔️", types:["Ice","Steel"],
    base:{hp:69,atk:122,def:105,spa:78,spd:83,spe:79},
    learnset:[[1,"ice_punch"],[2,"flash_cannon"],[3,"icicle_crash"],[4,"iron_tail"],[5,"permafrost"],[40,"blizzard"],[41,"winter_shroud"],[44,"swords_dance"],[48,"glacial_shard"],[52,"steel_wing"],[56,"avalanche_drive"],[60,"hyper_beam"],[6,"frostfire_veil"],[37,"subzero_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:260, rarity:"rare",
    desc:"A legendary blade forged from glacier ice and pure ore. Its strikes freeze what they cut." },

  58: { id:58, name:"Irisarael", emoji:"💠", types:["Ice","Fairy"],
    base:{hp:73,atk:69,def:92,spa:95,spd:100,spe:67},
    learnset:[[1,"ice_beam"],[2,"dazzling_gleam"],[3,"tackle"],[4,"permafrost"],[29,"moonblast"],[34,"stardust_veil"],[37,"blizzard"],[40,"growl"],[46,"wish_spark"],[52,"cryo_lance"],[58,"icicle_crash"],[64,"hyper_beam"],[5,"winter_shroud"],[42,"subzero_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:218, rarity:"rare",
    desc:"A prismatic ice being of refined fairy power. Its crystalline body bends light into rainbows." },

  60: { id:60, name:"Boreadrake", emoji:"🐉", types:["Ice","Dragon"],
    base:{hp:86,atk:106,def:96,spa:112,spd:85,spe:78},
    learnset:[[1,"ice_beam"],[2,"dragon_pulse"],[3,"icicle_crash"],[4,"permafrost"],[41,"blizzard"],[44,"swords_dance"],[48,"dragon_dance"],[49,"outrage"],[52,"glacial_shard"],[56,"avalanche_drive"],[60,"ancient_breath"],[64,"hyper_beam"],[5,"winter_shroud"],[38,"drake_rush"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:285, rarity:"rare",
    desc:"A dragon cloaked in the aurora. Its roar scatters ribbons of colored ice across the sky." },

  // ===== ADDITIONAL COMMON/UNCOMMON/RARE LUMOS =====

  // ===== FIRE/PSYCHIC =====
  22: { id:22, name:"Ignorin", emoji:"🔥", types:["Fire","Psychic"],
    base:{hp:35,atk:41,def:37,spa:58,spd:56,spe:68},
    learnset:[[1,"ember",[20,"cinderwhirl"]],[1,"confusion"],[9,"psybeam"],[17,"flamethrower"],[21,"recover"],[25,"psychic_move"],[33,"fire_blast",[5,"scorch_veil"]],[36,"magma_surge"],[3,"embercloak"],[31,"inferno"]],
    evolveTo:23, evolveLevel:28, catchRate:150, expYield:88, rarity:"common",
    desc:"A psychic flame sprite. Its fire burns hotter when it concentrates its mind." },

  23: { id:23, name:"Pyraxis", emoji:"🧠", types:["Fire","Psychic"],
    base:{hp:68,atk:64,def:68,spa:103,spd:81,spe:98},
    learnset:[[1,"flamethrower"],[2,"psychic_move"],[3,"scorch_veil"],[30,"fire_blast"],[32,"battle_cry"],[36,"calm_mind"],[40,"dreamweave"],[44,"heat_wave"],[48,"psystrike"],[52,"mind_shatter"],[56,"inferno"],[60,"solar_flare"],[4,"embercloak"],[38,"thought_crush"]],
    evolveTo:24, evolveLevel:44, catchRate:35, expYield:235, rarity:"rare",
    desc:"A psychic fire sage. Projects visions of infernos to terrify foes before striking." },

  // ===== GRASS/ELECTRIC =====
  75: { id:75, name:"Sylvolt", emoji:"🌱", types:["Grass","Electric"],
    base:{hp:40,atk:63,def:39,spa:60,spd:54,spe:59},
    learnset:[[1,"vine_whip",[22,"volt_surge"]],[1,"thunder_shock"],[8,"razor_leaf"],[16,"spark"],[20,"recover"],[24,"energy_ball"],[32,"thunderbolt",[5,"sleep_powder"]],[36,"plasma_strike"],[3,"spore_burst"],[31,"petal_blitz"]],
    evolveTo:76, evolveLevel:22, catchRate:190, expYield:78, rarity:"common",
    desc:"A sprout crackling with static electricity. Charges itself by photosynthesizing lightning." },

  76: { id:76, name:"Arborvolt", emoji:"🌳", types:["Grass","Electric"],
    base:{hp:81,atk:78,def:68,spa:111,spd:84,spe:68},
    learnset:[[1,"razor_leaf"],[2,"recover"],[3,"vine_whip"],[4,"volt_surge"],[5,"sleep_powder"],[22,"energy_ball"],[29,"thunderbolt"],[30,"swords_dance"],[38,"petal_blitz"],[46,"verdant_surge"],[54,"thunder"],[62,"hyper_beam"],[6,"spore_burst"],[42,"canopy_crash"]],
    evolveTo:77, evolveLevel:44, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"An ancient tree monster that stores electric charge in every leaf. Touch it and be zapped." },

  // ===== ROCK/DARK =====
  132: { id:132, name:"Obsidrix", emoji:"🪨", types:["Rock","Dark"],
    base:{hp:73,atk:69,def:75,spa:48,spd:62,spe:32},
    learnset:[[1,"rock_throw",[22,"obsidian_crash"]],[1,"bite"],[10,"headbutt"],[18,"crunch"],[26,"rock_slide"],[30,"landslide"],[34,"dark_pulse"],[42,"stone_edge",[5,"granite_wall"]],[3,"petrify_gaze"],[32,"quarry_crush"]],
    evolveTo:133, evolveLevel:30, catchRate:130, expYield:97, rarity:"common",
    desc:"A rock monster that absorbs shadow energy. Moves imperceptibly slow but hits with shattering force." },

  133: { id:133, name:"Monolithox", emoji:"🗿", types:["Rock","Dark"],
    base:{hp:102,atk:114,def:103,spa:62,spd:70,spe:39},
    learnset:[[1,"rock_slide"],[2,"landslide"],[3,"crunch"],[4,"granite_wall"],[31,"dark_pulse"],[35,"battle_cry"],[39,"stone_edge"],[40,"abyssal_snare"],[45,"shadow_ball"],[50,"blackout_bomb"],[55,"earthquake"],[60,"hyper_beam"],[5,"petrify_gaze"],[38,"malice_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:230, rarity:"uncommon",
    desc:"A living monolith of darkened stone. Ancient civilizations worshipped it as a god of night." },

  // ===== POISON/BUG =====
  164: { id:164, name:"Venomite", emoji:"🐛", types:["Poison","Bug"],
    base:{hp:56,atk:37,def:55,spa:65,spd:52,spe:30},
    learnset:[[1,"poison_sting",[20,"venom_lance"]],[1,"string_shot"],[8,"bug_bite"],[16,"sludge_bomb"],[21,"recover"],[24,"x_scissor"],[32,"toxic",[5,"toxic_surge"]],[36,"sonic_buzz"],[3,"toxin_bloom"],[31,"mandible_crush"]],
    evolveTo:165, evolveLevel:20, catchRate:220, expYield:65, rarity:"common",
    desc:"A larva coated in toxic slime. Leaves a trail of venom wherever it crawls." },

  165: { id:165, name:"Noxoveth", emoji:"🦋", types:["Poison","Bug"],
    base:{hp:77,atk:69,def:57,spa:106,spd:84,spe:92},
    learnset:[[1,"sludge_bomb"],[2,"toxic_surge"],[20,"recover"],[25,"quick_attack"],[29,"toxic"],[30,"nerve_agent"],[35,"venoshock"],[40,"air_slash"],[45,"putrid_pulse"],[50,"acid_rain"],[55,"cocoon_burst"],[60,"bug_buzz"],[3,"toxin_bloom"],[39,"leech_life"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A venomous moth that releases toxic scales on the wind. A cloud of them can fell a Lumos quickly." },

  // ===== STEEL/GROUND =====
  153: { id:153, name:"Forgekin", emoji:"⚙️", types:["Steel","Ground"],
    base:{hp:60,atk:63,def:85,spa:30,spd:50,spe:35},
    learnset:[[1,"metal_claw",[22,"forge_strike"]],[1,"mud_shot"],[9,"harden"],[17,"flash_cannon"],[20,"tail_whip"],[25,"earthquake"],[33,"iron_tail",[5,"magnetize"]],[36,"boulder_roll"],[3,"ironskin"],[31,"scorched_earth"]],
    evolveTo:154, evolveLevel:26, catchRate:160, expYield:90, rarity:"common",
    desc:"A small ore elemental born in deep mine shafts. Tough as iron and twice as stubborn." },

  154: { id:154, name:"Ferrolith", emoji:"🤖", types:["Steel","Ground"],
    base:{hp:95,atk:108,def:116,spa:52,spd:79,spe:30},
    learnset:[[1,"flash_cannon"],[2,"earthquake"],[3,"magnetize"],[30,"iron_tail"],[31,"battle_cry"],[34,"loam_leech"],[38,"rock_slide"],[42,"temper_edge"],[46,"body_slam"],[50,"earth_power"],[54,"tungsten_ram"],[58,"anvil_drop"],[4,"ironskin"],[37,"magnitude"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:222, rarity:"uncommon",
    desc:"A forged golem of steel and compressed earth. Was created to guard ancient mines." },

  // ===== DRAGON/GROUND =====
  106: { id:106, name:"Geodrak", emoji:"🐣", types:["Dragon","Ground"],
    base:{hp:40,atk:59,def:63,spa:57,spd:42,spe:64},
    learnset:[[1,"scratch",[22,"terra_spike"]],[1,"dragon_breath"],[10,"mud_shot"],[18,"dragon_claw"],[20,"tail_whip"],[26,"earthquake"],[34,"dragon_pulse",[5,"dragon_dance"]],[36,"sinkhole_maw"],[3,"draconic_roar"],[31,"dragon_rush"]],
    evolveTo:107, evolveLevel:32, catchRate:80, expYield:94, rarity:"uncommon",
    desc:"A burrowing dragon hatchling. Digs deep tunnels and breathes sand-laden gusts." },

  107: { id:107, name:"Terraquon", emoji:"🐲", types:["Dragon","Ground"],
    base:{hp:86,atk:108,def:96,spa:94,spd:64,spe:69},
    learnset:[[1,"dragon_claw"],[2,"earthquake"],[3,"dragon_dance"],[32,"dragon_pulse"],[36,"battle_cry"],[40,"draconic_roar"],[44,"tremor_stomp"],[48,"earth_power"],[52,"eon_crash"],[56,"ancient_breath"],[60,"outrage"],[64,"hyper_beam"],[4,"primordial_roar"],[39,"scale_storm"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:260, rarity:"rare",
    desc:"A subterranean dragon that causes quakes with each step. Rules the deep underground." },

  // ===== NORMAL/PSYCHIC =====
  189: { id:189, name:"Quirelin", emoji:"🐑", types:["Normal","Psychic"],
    base:{hp:49,atk:43,def:42,spa:63,spd:68,spe:58},
    learnset:[[1,"tackle",[22,"future_echo"]],[1,"confusion"],[9,"growl"],[17,"psybeam"],[25,"recover"],[29,"dreamweave"],[33,"psychic_move"],[41,"calm_mind",[5,"tail_whip"]],[3,"leer"],[32,"psycho_cut"]],
    evolveTo:190, evolveLevel:24, catchRate:180, expYield:78, rarity:"common",
    desc:"A woolly psychic creature that reads emotional auras. Very empathetic and gentle." },

  190: { id:190, name:"Aetherflock", emoji:"🐏", types:["Normal","Psychic"],
    base:{hp:88,atk:57,def:67,spa:110,spd:103,spe:75},
    learnset:[[1,"psybeam"],[2,"future_echo"],[3,"growl"],[24,"recover"],[30,"psychic_move"],[31,"vital_pulse"],[36,"wild_tumble"],[38,"calm_mind"],[42,"body_slam"],[48,"thought_crush"],[54,"psystrike"],[60,"hyper_beam"],[4,"tail_whip"],[40,"headbutt"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:200, rarity:"uncommon",
    desc:"A dreaming flock manifestation. Said to appear to sleeping trainers before a great trial." },

  // ===== BUG/GROUND =====
  204: { id:204, name:"Terramite", emoji:"🪲", types:["Bug","Ground"],
    base:{hp:62,atk:68,def:73,spa:34,spd:35,spe:45},
    learnset:[[1,"bug_bite",[22,"chitin_guard"]],[1,"mud_shot"],[10,"string_shot"],[18,"x_scissor"],[20,"leer"],[26,"earthquake"],[34,"bug_buzz",[5,"compound_glare"]],[36,"swarm_dive"],[3,"moth_dust"],[31,"magnitude"]],
    evolveTo:205, evolveLevel:24, catchRate:170, expYield:88, rarity:"common",
    desc:"A burrowing beetle that lives in dry earth. Its mandibles can crack solid rock." },

  205: { id:205, name:"Geodrix", emoji:"🪲", types:["Bug","Ground"],
    base:{hp:90,atk:108,def:93,spa:68,spd:58,spe:65},
    learnset:[[1,"x_scissor"],[2,"string_shot"],[24,"earthquake"],[29,"swords_dance"],[31,"bug_buzz"],[34,"sandstrike"],[39,"rock_slide"],[44,"mandible_crush"],[49,"cocoon_burst"],[54,"earth_power"],[59,"stone_edge"],[64,"hyper_beam"],[3,"chitin_guard"],[41,"drill_run"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"An armored ground beetle of incredible toughness. Plows through solid bedrock with ease." },

  // ===== WIND/ICE =====
  61: { id:61, name:"Borix", emoji:"🌬️", types:["Wind","Ice"],
    base:{hp:34,atk:45,def:36,spa:64,spd:47,spe:93},
    learnset:[[1,"gust"],[1,"powder_snow"],[8,"wing_attack"],[16,"permafrost"],[22,"cryo_lance"],[24,"air_slash"],[29,"gale_cannon"],[32,"ice_beam"],[40,"hurricane",[5,"mistveil"]],[3,"zephyr_dance"],[31,"storm_surge"]],
    evolveTo:62, evolveLevel:26, catchRate:180, expYield:78, rarity:"common",
    desc:"A gust of frozen air given form. Howls through mountain passes on the coldest nights." },

  62: { id:62, name:"Boreovane", emoji:"🦅", types:["Wind","Ice"],
    base:{hp:74,atk:66,def:61,spa:106,spd:78,spe:92},
    learnset:[[1,"wing_attack"],[2,"air_slash"],[3,"mistveil"],[29,"ice_beam"],[31,"battle_cry"],[36,"sleet_barrage"],[37,"hurricane"],[41,"cyclone_blade"],[46,"icicle_crash"],[51,"avalanche_drive"],[56,"blizzard"],[61,"hyper_beam"],[4,"zephyr_dance"],[40,"thermal_dive"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:215, rarity:"uncommon",
    desc:"A raptor of blizzards. Summons snowstorms with each powerful wingbeat." },

  // ===== FAIRY/STEEL =====
  145: { id:145, name:"Faerrin", emoji:"📌", types:["Fairy","Steel"],
    base:{hp:35,atk:46,def:71,spa:68,spd:52,spe:51},
    learnset:[[1,"fairy_wind",[22,"ironskin"]],[1,"metal_claw"],[9,"dazzling_gleam"],[17,"flash_cannon"],[20,"recover"],[25,"moonblast"],[33,"iron_tail",[5,"sweet_kiss"]],[36,"gossamer_lance"],[3,"stardust_veil"],[31,"glitter_storm"]],
    evolveTo:146, evolveLevel:26, catchRate:170, expYield:82, rarity:"common",
    desc:"A tiny fairy-knight made of living silver. Fiercely guards those it bonds with." },

  146: { id:146, name:"Shinarith", emoji:"🛡️", types:["Fairy","Steel"],
    base:{hp:70,atk:67,def:107,spa:87,spd:95,spe:54},
    learnset:[[1,"dazzling_gleam"],[2,"flash_cannon"],[3,"moonblast"],[4,"metal_claw"],[5,"sweet_kiss"],[30,"iron_tail"],[32,"growl"],[38,"tackle"],[44,"steel_wing"],[50,"temper_edge"],[56,"moonveil"],[62,"hyper_beam"],[6,"stardust_veil"],[41,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:230, rarity:"rare",
    desc:"An armored fairy sentinel that never abandons its post. Its shield can repel any curse." },

  317: { id:317, name:"Temporith", emoji:"⏳", types:["Psychic","Dragon"],
    base:{hp:97,atk:100,def:99,spa:132,spd:107,spe:83},
    learnset:[[1,"confusion"],[1,"dragon_breath"],[7,"psybeam"],[14,"calm_mind"],[21,"dragon_claw"],[28,"psychic_move"],[35,"dragon_pulse"],[42,"prism_ward"],[49,"astral_rend"],[56,"ancient_breath"],[63,"temporal_rift"],[70,"neural_storm"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Veil of Time. Said to exist at the crossing point of past and future." },

  318: { id:318, name:"Gaiavorn", emoji:"🌍", types:["Ground","Grass"],
    base:{hp:103,atk:125,def:104,spa:92,spd:89,spe:75},
    learnset:[[1,"mud_shot"],[1,"vine_whip"],[7,"sandstrike"],[14,"razor_leaf"],[21,"earth_power"],[28,"seed_bomb"],[35,"clay_armor"],[42,"briar_lash"],[49,"earthquake"],[56,"grove_wrath"],[63,"worldseed_quake"],[70,"verdant_surge"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Spirit of the Land. Every continent in Lumoria trembles at its footfall." },

  319: { id:319, name:"Voidraxis", emoji:"🌌", types:["Dark","Fairy"],
    base:{hp:95,atk:93,def:89,spa:131,spd:113,spe:88},
    learnset:[[1,"fairy_wind"],[1,"bite"],[7,"dark_pulse"],[14,"dazzling_gleam"],[21,"eclipse_shroud"],[28,"moonblast"],[35,"abyssal_snare"],[42,"shadow_ball"],[49,"dread_howl"],[56,"glitter_storm"],[63,"soul_rend"],[70,"fae_requiem"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Void Star. A being of absolute darkness ringed by fairy light. Where it passes, stars blink out." },

  320: { id:320, name:"Ferrothon", emoji:"⚡", types:["Steel","Electric"],
    base:{hp:91,atk:120,def:108,spa:103,spd:84,spe:93},
    learnset:[[1,"metal_claw"],[1,"thunder_shock"],[7,"spark"],[14,"steel_wing"],[21,"magnetize"],[28,"thunderbolt"],[35,"flash_cannon"],[42,"forge_strike"],[49,"iron_tail"],[56,"ball_lightning"],[63,"anvil_drop"],[70,"thunder"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Stormforged. Born in the heart of the greatest storm ever recorded. Lightning is its heartbeat." },

  // ===== NEW EVOLUTIONS (IDs 168-177) =====

  91: { id:91, name:"Cyclomathos", emoji:"🦅", types:["Electric","Wind"],
    base:{hp:65,atk:78,def:55,spa:96,spd:73,spe:120},
    learnset:[[1,"thunder_shock"],[1,"downdraft"],[2,"thunderbolt"],[3,"air_slash"],[4,"static_cage"],[30,"arc_flash"],[35,"tempest_wrath"],[40,"thunder"],[45,"volt_surge"],[50,"hurricane"],[55,"plasma_strike"],[60,"ball_lightning"],[6,"charge_burst"],[42,"wing_attack"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:198, rarity:"uncommon",
    desc:"An electrified storm raptor that rides cyclones. Its wingspan crackles with constant discharge." },

  46: { id:46, name:"Boreoveth", emoji:"🦭", types:["Ice","Water"],
    base:{hp:90,atk:65,def:90,spa:109,spd:92,spe:59},
    learnset:[[1,"powder_snow"],[1,"water_gun"],[2,"ice_beam"],[3,"permafrost"],[4,"winter_shroud"],[33,"blizzard"],[38,"aqua_tail"],[42,"hoarfrost_bite"],[46,"icicle_crash"],[50,"hydro_pump"],[54,"glacial_tomb"],[58,"surf"],[5,"cryo_lance"],[43,"harden"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"An ancient ice behemoth that rests in glacial caves. Its breath can freeze the ocean surface." },

  161: { id:161, name:"Toxivane", emoji:"🦠", types:["Poison","Wind"],
    base:{hp:70,atk:75,def:54,spa:102,spd:80,spe:105},
    learnset:[[1,"poison_sting"],[1,"downdraft"],[2,"sludge_bomb"],[3,"air_slash"],[4,"mycelia_net"],[31,"toxic"],[36,"venoshock"],[40,"tempest_wrath"],[45,"corrosion_fang"],[50,"hurricane"],[55,"venom_lance"],[60,"sludge_wave"],[5,"miasma_cloud"],[43,"wing_attack"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:195, rarity:"uncommon",
    desc:"A miasmic wind wraith draped in toxic cloud. Its wingbeats scatter poisonous spores across entire valleys." },

  186: { id:186, name:"Airovast", emoji:"🕊️", types:["Normal","Wind"],
    base:{hp:88,atk:73,def:55,spa:83,spd:70,spe:111},
    learnset:[[1,"tackle"],[1,"downdraft"],[2,"quick_attack"],[3,"air_slash"],[4,"body_slam"],[29,"wing_attack"],[34,"wild_tumble"],[38,"momentum_rush"],[43,"hurricane"],[48,"battle_cry"],[53,"hyper_beam"],[58,"gale_cannon"],[5,"zephyr_dance"],[41,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:185, rarity:"uncommon",
    desc:"A free-spirited wind wanderer that soars over continents in a single day, carried effortlessly on warm thermals." },

  188: { id:188, name:"Plentorus", emoji:"🦔", types:["Normal"],
    base:{hp:105,atk:94,def:89,spa:60,spd:70,spe:62},
    learnset:[[1,"tackle"],[1,"growl"],[2,"headbutt"],[3,"body_slam"],[4,"harden"],[31,"swords_dance"],[35,"wild_tumble"],[39,"recover"],[43,"momentum_rush"],[48,"body_slam"],[53,"instinct_slash"],[58,"hyper_beam"],[5,"battle_cry"],[40,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:188, rarity:"uncommon",
    desc:"A round and robust Lumo of immense endurance. Unshakable and steadfast, it weathers any storm with quiet dignity." },

  194: { id:194, name:"Lithomere", emoji:"🦀", types:["Rock","Water"],
    base:{hp:95,atk:100,def:115,spa:72,spd:85,spe:75},
    learnset:[[1,"scratch"],[1,"water_gun"],[2,"aqua_tail"],[3,"stalactite_drop"],[4,"harden"],[39,"rock_slide"],[43,"hydro_pump"],[47,"stone_edge"],[52,"tidal_crush"],[56,"crystal_lance"],[60,"sea_serpent_strike"],[64,"quarry_crush"],[5,"tidecaller"],[42,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:248, rarity:"rare",
    desc:"A colossal ancient shore titan. Its shell is older than recorded history, layered with oceanic minerals." },

  196: { id:196, name:"Frigolith", emoji:"💎", types:["Rock","Ice"],
    base:{hp:90,atk:80,def:130,spa:105,spd:110,spe:50},
    learnset:[[1,"powder_snow"],[1,"stalactite_drop"],[2,"ice_beam"],[3,"rock_slide"],[4,"harden"],[41,"blizzard"],[45,"stone_edge"],[49,"crystal_lance"],[53,"icicle_crash"],[57,"glacial_tomb"],[61,"quarry_crush"],[65,"cryo_lance"],[5,"permafrost"],[43,"harden"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:258, rarity:"rare",
    desc:"A titanic crystal colossus forged from eons of glacial pressure. Its body refracts light into blinding aurora beams." },

  40: { id:40, name:"Marevanos", emoji:"🐋", types:["Water","Wind"],
    base:{hp:88,atk:90,def:84,spa:112,spd:93,spe:104},
    learnset:[[1,"surf"],[1,"downdraft"],[2,"aqua_tail"],[3,"air_slash"],[4,"tidecaller"],[43,"hydro_pump"],[47,"hurricane"],[51,"tidal_crush"],[55,"tempest_wrath"],[59,"sea_serpent_strike"],[63,"ocean_tempest"],[67,"whirlpool_dive"],[5,"deepwater_hymn"],[48,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A sovereign of sky and sea. It breaches into storm clouds and dives into ocean trenches with equal majesty." },

  131: { id:131, name:"Necrothon", emoji:"🌑", types:["Dark","Grass"],
    base:{hp:100,atk:95,def:105,spa:110,spd:97,spe:80},
    learnset:[[1,"bite"],[1,"vine_whip"],[2,"dark_pulse"],[3,"seed_bomb"],[4,"eclipse_shroud"],[41,"shadow_ball"],[45,"petal_blitz"],[49,"night_slash"],[53,"verdant_surge"],[57,"abyssal_snare"],[61,"soul_rend"],[65,"dread_howl"],[5,"mycelia_net"],[46,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:262, rarity:"rare",
    desc:"An ancient funerary grove made manifest. Moonless nights draw out its full power; forests bow as it passes." },

  38: { id:38, name:"Titanariel", emoji:"🦑", types:["Water","Steel"],
    base:{hp:100,atk:95,def:140,spa:85,spd:110,spe:35},
    learnset:[[1,"scratch"],[1,"water_gun"],[2,"aqua_tail"],[3,"flash_cannon"],[4,"harden"],[45,"hydro_pump"],[49,"iron_tail"],[53,"tidal_crush"],[57,"magnetize"],[61,"sea_serpent_strike"],[65,"forge_strike"],[69,"anvil_drop"],[5,"tidecaller"],[50,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:275, rarity:"rare",
    desc:"A mythic armored leviathan said to have dragged whole ships to the ocean floor. Its shell is impenetrable." },

  // ===== 3RD STAGE EVOLUTIONS (IDs 178-212) =====

  // 178: Inferarch - Fire/Dragon (Embrix→Helioveth→Inferarch)
  12: { id:12, name:"Inferarch", emoji:"🔥", types:["Fire","Dragon"],
    base:{hp:85,atk:110,def:80,spa:120,spd:85,spe:75},
    learnset:[[1,"ember"],[1,"flamethrower"],[2,"dragon_breath"],[3,"heat_wave"],[4,"scorch_veil"],[38,"fire_blast"],[43,"dragon_claw"],[48,"solar_flare"],[52,"outrage"],[57,"inferno"],[62,"dragon_pulse"],[67,"char_dance"],[5,"embercloak"],[44,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:265, rarity:"rare",
    desc:"A sovereign of flame and ancient dragon lineage. Its wingbeats ignite the air itself into roaring curtains of fire." },

  // 179: Pyroclasm - Fire/Rock (Taurcin→Molteroth→Pyroclasm)
  15: { id:15, name:"Pyroclasm", emoji:"🌋", types:["Fire","Rock"],
    base:{hp:105,atk:130,def:110,spa:90,spd:75,spe:60},
    learnset:[[1,"headbutt"],[1,"magma_surge"],[2,"flamethrower"],[3,"scorch_veil"],[4,"rock_slide"],[38,"heat_wave"],[42,"stone_edge"],[46,"fire_blast"],[50,"stalactite_drop"],[54,"inferno"],[58,"quarry_crush"],[62,"solar_flare"],[5,"embercloak"],[44,"ashfall"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"A living caldera given form. When it charges, the ground splits and magma fountains in its wake." },

  // 180: Helixareth - Fire/Dragon (Ignicula→Pyroveth→Helixareth)
  18: { id:18, name:"Helixareth", emoji:"🐉", types:["Fire","Dragon"],
    base:{hp:90,atk:115,def:75,spa:125,spd:85,spe:80},
    learnset:[[1,"ember"],[1,"flamethrower"],[2,"dragon_breath"],[3,"cinderwhirl"],[4,"scorch_veil"],[38,"dragon_claw"],[42,"heat_wave"],[46,"fire_blast"],[50,"dragon_pulse"],[54,"solar_flare"],[58,"outrage"],[62,"inferno"],[5,"embercloak"],[44,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"An ancient serpent of celestial fire that coils around mountaintops. Legends say its breath forged the first volcanoes." },

  // 181: Terravore - Fire/Ground (Magmaurin→Pyroterrath→Terravore)
  21: { id:21, name:"Terravore", emoji:"🦎", types:["Fire","Ground"],
    base:{hp:100,atk:135,def:90,spa:80,spd:75,spe:75},
    learnset:[[1,"flame_fang"],[1,"earthquake"],[2,"magma_surge"],[3,"scorched_earth"],[4,"scorch_veil"],[38,"flamethrower"],[42,"earth_power"],[46,"fire_blast"],[50,"ashfall"],[54,"inferno"],[58,"sand_geyser"],[62,"solar_flare"],[5,"embercloak"],[44,"blazing_rush"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:260, rarity:"rare",
    desc:"A predator born from the magma deep within the earth. It tunnels through bedrock and erupts beneath its prey." },

  // 182: Ignitheon - Fire/Psychic (Ignorin→Pyraxis→Ignitheon)
  24: { id:24, name:"Ignitheon", emoji:"🔮", types:["Fire","Psychic"],
    base:{hp:85,atk:80,def:80,spa:135,spd:100,spe:90},
    learnset:[[1,"flamethrower"],[1,"psychic_move"],[2,"scorch_veil"],[3,"psystrike"],[4,"heat_wave"],[38,"fire_blast"],[42,"calm_mind"],[46,"solar_flare"],[50,"thought_crush"],[54,"inferno"],[58,"mind_shatter"],[62,"neural_storm"],[5,"embercloak"],[44,"astral_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"An oracle of living flame. It reads the minds of its foes and burns their deepest fears into reality." },

  // 183: Tidalossus - Water/Rock (Coralix→Aquidon→Tidalossus)
  27: { id:27, name:"Tidalossus", emoji:"🦞", types:["Water","Rock"],
    base:{hp:95,atk:125,def:130,spa:70,spd:85,spe:65},
    learnset:[[1,"scratch"],[1,"surf"],[2,"tidecaller"],[3,"stalactite_drop"],[4,"rock_slide"],[38,"aqua_tail"],[42,"stone_edge"],[46,"tidal_crush"],[50,"crystal_lance"],[54,"hydro_pump"],[58,"quarry_crush"],[62,"sea_serpent_strike"],[5,"deepwater_hymn"],[44,"coral_barrage"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"A colossus of tide and stone that rules coastal shallows. Its claws can shear cliff faces clean through." },

  // 184: Polarveth - Ice/Water (Cryonik→Boreon→Polarveth)
  44: { id:44, name:"Polarveth", emoji:"🧊", types:["Ice","Water"],
    base:{hp:100,atk:75,def:100,spa:125,spd:105,spe:60},
    learnset:[[1,"powder_snow"],[1,"surf"],[2,"ice_beam"],[3,"permafrost"],[4,"winter_shroud"],[38,"blizzard"],[42,"hoarfrost_bite"],[46,"icicle_crash"],[50,"hydro_pump"],[54,"glacial_tomb"],[58,"cryo_lance"],[62,"abyssal_jet"],[5,"tidecaller"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A titan of polar seas whose body is half glacier and half deep ocean. Its roar shatters icebergs for miles around." },

  // 185: Nepturix - Water (Corelin→Neraxis→Nepturix)
  30: { id:30, name:"Nepturix", emoji:"🐟", types:["Water"],
    base:{hp:95,atk:85,def:80,spa:140,spd:110,spe:60},
    learnset:[[1,"water_gun"],[1,"surf"],[2,"bubble_beam"],[3,"tidecaller"],[4,"whirlpool_dive"],[38,"hydro_pump"],[42,"tidal_crush"],[46,"sea_serpent_strike"],[50,"coral_barrage"],[54,"abyssal_jet"],[58,"ocean_tempest"],[62,"dazzling_gleam"],[5,"deepwater_hymn"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"A leviathan of the reef that commands all ocean life with a single glance. Its scales scatter light like a shattered prism." },

  // 186: Noxarith - Water/Poison (Toxaquil→Noxaquith→Noxarith)
  33: { id:33, name:"Noxarith", emoji:"🪸", types:["Water","Poison"],
    base:{hp:95,atk:100,def:90,spa:130,spd:100,spe:50},
    learnset:[[1,"sludge_bomb"],[1,"surf"],[2,"tidecaller"],[3,"toxic"],[4,"corrosion_fang"],[38,"venom_lance"],[42,"sludge_wave"],[46,"hydro_pump"],[50,"acid_rain"],[54,"venoshock"],[58,"putrid_pulse"],[62,"stinger_volley"],[5,"deepwater_hymn"],[44,"miasma_cloud"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A dread titan of poisoned tides. Its very presence turns the sea around it a sickly green and chokes all nearby life." },

  // 187: Thalassira - Water/Fairy (Pearlith→Undirael→Thalassira)
  36: { id:36, name:"Thalassira", emoji:"🧜", types:["Water","Fairy"],
    base:{hp:95,atk:80,def:85,spa:145,spd:110,spe:60},
    learnset:[[1,"water_gun"],[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"tidecaller"],[4,"moonblast"],[38,"celestial_wave"],[42,"surf"],[46,"glitter_storm"],[50,"hydro_pump"],[54,"fae_requiem"],[58,"sea_serpent_strike"],[62,"moonveil"],[5,"deepwater_hymn"],[44,"sweet_kiss"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:275, rarity:"rare",
    desc:"The radiant sovereign of the world's oceans. Sailors who see it are said to be blessed with eternal safe passage." },

  // 188: Mycovast - Grass/Poison (Sporix→Myceloth→Mycovast)
  65: { id:65, name:"Mycovast", emoji:"🍄", types:["Grass","Poison"],
    base:{hp:100,atk:110,def:105,spa:110,spd:90,spe:45},
    learnset:[[1,"energy_ball"],[1,"sludge_bomb"],[2,"spore_burst"],[3,"toxic"],[4,"sleep_powder"],[38,"petal_blitz"],[42,"venom_lance"],[46,"verdant_surge"],[50,"sludge_wave"],[54,"venoshock"],[58,"canopy_crash"],[62,"acid_rain"],[5,"mycelia_net"],[44,"corrosion_fang"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A fungal colossus whose spores drift on the wind for hundreds of miles, corrupting forests in days. It is the rot at the heart of every plagued wood." },

  // 189: Rootvorn - Grass/Ground (Viridix→Terravin→Rootvorn)
  68: { id:68, name:"Rootvorn", emoji:"🌳", types:["Grass","Ground"],
    base:{hp:100,atk:120,def:105,spa:95,spd:90,spe:50},
    learnset:[[1,"razor_leaf"],[1,"earthquake"],[2,"seed_bomb"],[3,"root_lance"],[4,"sleep_powder"],[38,"energy_ball"],[42,"earth_power"],[46,"petal_blitz"],[50,"verdant_surge"],[54,"sand_geyser"],[58,"canopy_crash"],[62,"scorched_earth"],[5,"spore_burst"],[44,"briar_lash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"An enormous ancient root-walker that reshapes the earth as it moves. Valleys and gullies form in its wake over centuries." },

  // 190: Verdovast - Grass (Germix→Verdurus→Verdovast)
  71: { id:71, name:"Verdovast", emoji:"🐻", types:["Grass"],
    base:{hp:110,atk:125,def:90,spa:115,spd:90,spe:30},
    learnset:[[1,"tackle"],[1,"vine_whip"],[2,"energy_ball"],[3,"sleep_powder"],[4,"seed_bomb"],[38,"petal_blitz"],[42,"swords_dance"],[46,"canopy_crash"],[50,"verdant_surge"],[54,"body_slam"],[58,"briar_lash"],[62,"photon_leaf"],[5,"spore_burst"],[44,"root_lance"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A titanic forest guardian born of the oldest living wood. No axe or flame has ever felled it; those who try are swallowed by the undergrowth." },

  // 191: Morralyn - Grass/Dark (Sylvnox→Morraveth→Morralyn)
  80: { id:80, name:"Morralyn", emoji:"🌑", types:["Grass","Dark"],
    base:{hp:100,atk:125,def:100,spa:120,spd:90,spe:30},
    learnset:[[1,"razor_leaf"],[1,"night_slash"],[2,"energy_ball"],[3,"dark_pulse"],[4,"sleep_powder"],[38,"petal_blitz"],[42,"shadow_ball"],[46,"void_rend"],[50,"verdant_surge"],[54,"soul_rend"],[58,"canopy_crash"],[62,"eclipse_shroud"],[5,"spore_burst"],[44,"abyssal_snare"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A wraith of shadow and thorn that stalks moonless forests. The trees it passes through wither and grow dark, feeding it endlessly." },

  // 192: Faevernal - Fairy/Grass (Floralin→Faelomis→Faevernal)
  74: { id:74, name:"Faevernal", emoji:"🌸", types:["Fairy","Grass"],
    base:{hp:95,atk:80,def:85,spa:140,spd:110,spe:55},
    learnset:[[1,"fairy_wind"],[1,"vine_whip"],[2,"dazzling_gleam"],[3,"moonblast"],[4,"sweet_kiss"],[38,"celestial_wave"],[42,"petal_blitz"],[46,"glitter_storm"],[50,"verdant_surge"],[54,"fae_requiem"],[58,"energy_ball"],[62,"moonveil"],[5,"stardust_veil"],[44,"sleep_powder"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A being of pure spring magic. Where it dances, flowers bloom overnight and the air fills with the scent of a thousand blossoms." },

  // 193: Junglevolt - Grass/Electric (Sylvolt→Arborvolt→Junglevolt)
  77: { id:77, name:"Junglevolt", emoji:"⚡", types:["Grass","Electric"],
    base:{hp:95,atk:100,def:85,spa:135,spd:100,spe:50},
    learnset:[[1,"razor_leaf"],[1,"thunderbolt"],[2,"energy_ball"],[3,"volt_surge"],[4,"sleep_powder"],[38,"thunder"],[42,"petal_blitz"],[46,"verdant_surge"],[50,"plasma_strike"],[54,"canopy_crash"],[58,"ion_cannon"],[62,"arc_flash"],[5,"spore_burst"],[44,"charge_burst"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"An ancient living battery tree that stores decades of lightning within its rings. Its roots conduct electricity through entire forests." },

  // 194: Voltanox - Electric (Joltan→Galvanos→Voltanox)
  83: { id:83, name:"Voltanox", emoji:"⚡", types:["Electric"],
    base:{hp:85,atk:115,def:75,spa:120,spd:80,spe:100},
    learnset:[[1,"thunder_shock"],[1,"thunderbolt"],[2,"spark"],[3,"thunder_wave"],[4,"quick_attack"],[38,"thunder"],[42,"arc_flash"],[46,"plasma_strike"],[50,"volt_surge"],[54,"ion_cannon"],[58,"charge_burst"],[62,"voltaic_fang"],[5,"static_cage"],[44,"wild_charge"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:275, rarity:"rare",
    desc:"A creature of living electricity whose gallop shakes the heavens. Cities it runs through are briefly lit as bright as day." },

  // 195: Zapoveth - Electric/Bug (Electrix→Voltharpe→Zapoveth)
  86: { id:86, name:"Zapoveth", emoji:"🦟", types:["Electric","Bug"],
    base:{hp:85,atk:90,def:70,spa:130,spd:85,spe:95},
    learnset:[[1,"thunder_shock"],[1,"bug_buzz"],[2,"thunderbolt"],[3,"x_scissor"],[4,"thunder_wave"],[38,"thunder"],[42,"volt_surge"],[46,"swarm_dive"],[50,"plasma_strike"],[54,"mandible_crush"],[58,"ion_cannon"],[62,"stinger_volley"],[5,"static_cage"],[44,"silk_bind"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A dragonfly of pure lightning. Its body discharges with every wingbeat; to be caught in its swarm is to stand in a thunderstorm." },

  // 196: Surgolith - Electric/Water (Amperix→Volterel→Surgolith)
  89: { id:89, name:"Surgolith", emoji:"🐙", types:["Electric","Water"],
    base:{hp:95,atk:80,def:85,spa:140,spd:105,spe:60},
    learnset:[[1,"thunder_shock"],[1,"surf"],[2,"thunderbolt"],[3,"water_gun"],[4,"thunder_wave"],[38,"thunder"],[42,"hydro_pump"],[46,"voltaic_fang"],[50,"tidal_crush"],[54,"ion_cannon"],[58,"abyssal_jet"],[62,"overcharge"],[5,"static_cage"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A deep-sea colossus of crackling electricity. It powers itself by siphoning ocean currents and discharges columns of electrified water at will." },

  // 197: Petrovast - Electric/Rock (Voltrix→Petravolt→Petrovast)
  94: { id:94, name:"Petrovast", emoji:"⛰️", types:["Electric","Rock"],
    base:{hp:100,atk:120,def:115,spa:85,spd:75,spe:70},
    learnset:[[1,"rock_slide"],[1,"thunderbolt"],[2,"spark"],[3,"stone_edge"],[4,"thunder_wave"],[38,"thunder"],[42,"earthquake"],[46,"volt_surge"],[50,"crystal_lance"],[54,"stalactite_drop"],[58,"ion_cannon"],[62,"quarry_crush"],[5,"static_cage"],[44,"temper_edge"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A mountain that walks, crackling with perpetual storm energy. Lightning cascades across its stony hide at all times." },

  // 198: Tectonvast - Ground/Rock (Terrakin→Seismith→Tectonvast)
  97: { id:97, name:"Tectonvast", emoji:"🦏", types:["Ground","Rock"],
    base:{hp:115,atk:140,def:120,spa:60,spd:75,spe:60},
    learnset:[[1,"earthquake"],[1,"rock_slide"],[2,"headbutt"],[3,"earth_power"],[4,"stone_edge"],[38,"stalactite_drop"],[42,"crystal_lance"],[46,"sand_geyser"],[50,"quarry_crush"],[54,"scorched_earth"],[58,"fissure_slam"],[62,"body_slam"],[5,"clay_armor"],[44,"temper_edge"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"A living tectonic plate. Every step it takes registers as a minor earthquake. Civilizations have risen and fallen on the choices of where it walks." },

  // 199: Geovenomvast - Ground/Poison (Aridix→Geovenoth→Geovenomvast)
  100: { id:100, name:"Geovenomvast", emoji:"🦂", types:["Ground","Poison"],
    base:{hp:90,atk:120,def:90,spa:105,spd:100,spe:50},
    learnset:[[1,"poison_sting"],[1,"earthquake"],[2,"venom_lance"],[3,"earth_power"],[4,"toxic"],[38,"sludge_wave"],[42,"miasma_cloud"],[46,"scorched_earth"],[50,"acid_rain"],[54,"sand_geyser"],[58,"stinger_volley"],[62,"toxic_surge"],[5,"clay_armor"],[44,"corrosion_fang"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A scorpion tyrant of the poisoned badlands. Its stinger contains enough venom to wilt an entire forest, and its tail leaves craters in the earth." },

  // 200: Geovast - Ground/Water (Limoux→Geoloth→Geovast)
  103: { id:103, name:"Geovast", emoji:"🐊", types:["Ground","Water"],
    base:{hp:110,atk:120,def:100,spa:105,spd:85,spe:40},
    learnset:[[1,"earthquake"],[1,"surf"],[2,"earth_power"],[3,"tidal_crush"],[4,"mud_shot"],[38,"hydro_pump"],[42,"sand_geyser"],[46,"aqua_tail"],[50,"scorched_earth"],[54,"sea_serpent_strike"],[58,"boulder_roll"],[62,"abyssal_jet"],[5,"clay_armor"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:260, rarity:"rare",
    desc:"A delta titan that merges the force of river and rock. River mouths form around it; whole new coastlines appear where it settles." },

  // 201: Aeolarch - Wind/Electric (Zephyrkin→Aeolomane→Aeolarch)
  110: { id:110, name:"Aeolarch", emoji:"🦁", types:["Wind","Electric"],
    base:{hp:95,atk:125,def:75,spa:90,spd:90,spe:90},
    learnset:[[1,"gust"],[1,"thunderbolt"],[2,"air_slash"],[3,"zephyr_dance"],[4,"arc_flash"],[38,"hurricane"],[42,"thunder"],[46,"gale_cannon"],[50,"plasma_strike"],[54,"volt_surge"],[58,"tempest_wrath"],[62,"ion_cannon"],[5,"vortex_trap"],[44,"squall_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A storm sovereign whose mane is a permanent tempest. When it roars, thunder rolls across the land for days." },

  // 202: Cyclavorn - Wind (Aeolin→Cyclavel→Cyclavorn)
  113: { id:113, name:"Cyclavorn", emoji:"🦅", types:["Wind"],
    base:{hp:90,atk:115,def:75,spa:110,spd:80,spe:85},
    learnset:[[1,"gust"],[1,"wing_attack"],[2,"air_slash"],[3,"jetstream"],[4,"mistveil"],[38,"hurricane"],[42,"skyfall"],[46,"squall_slash"],[50,"thermal_dive"],[54,"gale_cannon"],[58,"tempest_wrath"],[62,"downdraft"],[5,"zephyr_dance"],[44,"vortex_trap"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A hurricane made flesh. It circles the highest peaks and its passage creates new storm systems that endure for years." },

  // 203: Frigidvorn - Ice (Cryokin→Boreovast→Frigidvorn)
  49: { id:49, name:"Frigidvorn", emoji:"🐺", types:["Ice"],
    base:{hp:100,atk:110,def:80,spa:105,spd:95,spe:75},
    learnset:[[1,"powder_snow"],[1,"ice_beam"],[2,"icicle_crash"],[3,"blizzard"],[4,"permafrost"],[38,"hoarfrost_bite"],[42,"cryo_lance"],[46,"glacial_tomb"],[50,"avalanche_drive"],[54,"winter_shroud"],[58,"body_slam"],[62,"quick_attack"],[5,"frostfire_veil"],[44,"instinct_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A wolf of absolute zero whose howl flash-freezes the air for miles. Entire mountain valleys have become permanent glacier fields where it hunts." },

  // 204: Glaciovast - Ice/Normal (Nivelin→Glacivern→Glaciovast)
  52: { id:52, name:"Glaciovast", emoji:"🐻‍❄️", types:["Ice","Normal"],
    base:{hp:110,atk:90,def:120,spa:115,spd:105,spe:20},
    learnset:[[1,"powder_snow"],[1,"body_slam"],[2,"ice_beam"],[3,"harden"],[4,"blizzard"],[38,"headbutt"],[42,"hoarfrost_bite"],[46,"icicle_crash"],[50,"glacial_tomb"],[54,"recover"],[58,"cryo_lance"],[62,"hyper_beam"],[5,"winter_shroud"],[44,"vital_pulse"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:260, rarity:"rare",
    desc:"An immovable glacier bear of legendary endurance. It has slept for centuries at a time; when it wakes, the ice age returns." },

  // 205: Noctovast - Dark (Umbrakin→Noctivast→Noctovast)
  120: { id:120, name:"Noctovast", emoji:"🐕", types:["Dark"],
    base:{hp:100,atk:120,def:80,spa:110,spd:90,spe:65},
    learnset:[[1,"bite"],[1,"crunch"],[2,"night_slash"],[3,"dark_pulse"],[4,"eclipse_shroud"],[38,"shadow_ball"],[42,"void_rend"],[46,"soul_rend"],[50,"abyssal_snare"],[54,"dread_howl"],[58,"body_slam"],[62,"quick_attack"],[5,"shadowstep"],[44,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A hound of the perpetual midnight. Darkness pools around it wherever it goes; even torch-flames gutter and die in its presence." },

  // 206: Phantomvast - Dark/Poison (Nocturil→Phantorvex→Phantomvast)
  125: { id:125, name:"Phantomvast", emoji:"🦎", types:["Dark","Poison"],
    base:{hp:95,atk:125,def:90,spa:115,spd:90,spe:55},
    learnset:[[1,"bite"],[1,"venom_lance"],[2,"dark_pulse"],[3,"sludge_wave"],[4,"eclipse_shroud"],[38,"void_rend"],[42,"acid_rain"],[46,"shadow_ball"],[50,"soul_rend"],[54,"toxic_surge"],[58,"corrosion_fang"],[62,"dread_howl"],[5,"shadowstep"],[44,"abyssal_snare"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"A venom phantom of ancient ruin sites. It haunts deep in shadow, and those bitten by it suffer visions of oblivion they never escape." },

  // 207: Lumiarch - Fairy (Lumkin→Aetherael→Lumiarch)
  139: { id:139, name:"Lumiarch", emoji:"🌟", types:["Fairy"],
    base:{hp:100,atk:90,def:90,spa:135,spd:110,spe:45},
    learnset:[[1,"fairy_wind"],[1,"dazzling_gleam"],[2,"moonblast"],[3,"sweet_kiss"],[4,"stardust_veil"],[38,"celestial_wave"],[42,"glitter_storm"],[46,"fae_requiem"],[50,"moonveil"],[54,"recover"],[58,"wish_spark"],[62,"hyper_beam"],[5,"charm_bloom"],[44,"vital_pulse"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"The sovereign of fairy light. Its radiance can banish every shadow from a city; dark spirits flee the land at its mere approach." },

  // 208: Celestarch - Fairy/Psychic (Dawnirel→Lunarael→Celestarch)
  144: { id:144, name:"Celestarch", emoji:"🌙", types:["Fairy","Psychic"],
    base:{hp:100,atk:80,def:95,spa:155,spd:120,spe:30},
    learnset:[[1,"dazzling_gleam"],[1,"psychic_move"],[2,"moonblast"],[3,"calm_mind"],[4,"stardust_veil"],[38,"celestial_wave"],[42,"psystrike"],[46,"fae_requiem"],[50,"thought_crush"],[54,"glitter_storm"],[58,"mind_shatter"],[62,"prism_ward"],[5,"sweet_kiss"],[44,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:280, rarity:"rare",
    desc:"A celestial archon said to be the personification of the moon's light and the night sky's oldest thoughts. Stars bow when it rises." },

  // 209: Adamovast - Steel (Ferrokin→Adamavast→Adamovast)
  149: { id:149, name:"Adamovast", emoji:"🐩", types:["Steel"],
    base:{hp:105,atk:135,def:140,spa:75,spd:95,spe:25},
    learnset:[[1,"metal_claw"],[1,"flash_cannon"],[2,"iron_tail"],[3,"magnetize"],[4,"forge_strike"],[38,"anvil_drop"],[42,"iron_press"],[46,"slag_shield"],[50,"temper_edge"],[54,"steel_wing"],[58,"body_slam"],[62,"hyper_beam"],[5,"ironskin"],[44,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:275, rarity:"rare",
    desc:"A steel titan of absolute indomitability. Every surface of its body is a different legendary alloy; no recorded force has ever cracked its hide." },

  // 210: Ferrovast - Steel/Dark (Aeronyx→Ferrovex→Ferrovast)
  136: { id:136, name:"Ferrovast", emoji:"🦇", types:["Steel","Dark"],
    base:{hp:95,atk:130,def:115,spa:75,spd:90,spe:60},
    learnset:[[1,"metal_claw"],[1,"dark_pulse"],[2,"flash_cannon"],[3,"crunch"],[4,"magnetize"],[38,"forge_strike"],[42,"void_rend"],[46,"iron_tail"],[50,"shadow_ball"],[54,"anvil_drop"],[58,"night_slash"],[62,"soul_rend"],[5,"ironskin"],[44,"eclipse_shroud"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A wraith of living iron that hunts in total darkness. Its metallic screech can shatter stone and its wings cut like blades." },

  // 211: Acidovast - Poison/Ground (Acidelix→Toxoloth→Acidovast)
  159: { id:159, name:"Acidovast", emoji:"🐸", types:["Poison","Ground"],
    base:{hp:115,atk:90,def:105,spa:140,spd:100,spe:20},
    learnset:[[1,"toxic"],[1,"earthquake"],[2,"sludge_wave"],[3,"earth_power"],[4,"toxic_surge"],[38,"acid_rain"],[42,"venom_lance"],[46,"sand_geyser"],[50,"sludge_bomb"],[54,"venoshock"],[58,"scorched_earth"],[62,"putrid_pulse"],[5,"miasma_cloud"],[44,"corrosion_fang"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"A colossal acid behemoth that dissolves the ground wherever it treads. Entire cave systems have been created by its acidic ooze eating through the earth." },

  // 212: Behemovast - Normal (Rotunden→Glutoros→Behemovast)
  184: { id:184, name:"Behemovast", emoji:"🐻", types:["Normal"],
    base:{hp:145,atk:120,def:100,spa:80,spd:80,spe:45},
    learnset:[[1,"headbutt"],[1,"body_slam"],[2,"battle_cry"],[3,"swords_dance"],[4,"recover"],[38,"hyper_beam"],[42,"wild_tumble"],[46,"momentum_rush"],[50,"vital_pulse"],[54,"instinct_slash"],[58,"harden"],[62,"tackle"],[5,"focus_roar"],[44,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"The greatest bear that has ever walked Lumoria. When it stands fully upright, it blots out the sun. Its roar has been mistaken for natural disasters." }
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
    desc:"A gentle grassy path with mild wild Lumos. Perfect for beginners.",
    connections:["seedvale","ashford"],
    wildMonsters:[
      {id:178, minLv:2, maxLv:4, rate:25},  // Furball
      {id:180, minLv:2, maxLv:4, rate:25},  // Longear
      {id:197, minLv:2, maxLv:5, rate:30}, // Caterpet
      {id:185, minLv:3, maxLv:5, rate:20}   // Pudgeling
    ],
    hasGym:false, requiredBadges:0, mapPos:{x:25, y:68}
  },
  ashford: {
    id:"ashford", name:"Ashford City", icon:"🏙️", type:"city",
    desc:"The first city of the journey. Home to Gym Leader Rex who specializes in Normal types.",
    connections:["route1","route2"],
    wildMonsters:[
      {id:178, minLv:4, maxLv:7, rate:30},
      {id:187, minLv:4, maxLv:7, rate:30},
      {id:69, minLv:4, maxLv:6, rate:20},
      {id:180, minLv:5, maxLv:7, rate:20}
    ],
    hasGym:true, gymLeader:"rex", requiredBadges:0, mapPos:{x:38, y:62}
  },
  route2: {
    id:"route2", name:"Route 2 - Greenwood Forest", icon:"🌲", type:"route",
    desc:"A dense forest teeming with Bug and Grass type Lumos.",
    connections:["ashford","tidewatch","lumoria_jungle"],
    wildMonsters:[
      {id:197, minLv:6, maxLv:9, rate:25}, // Caterpet
      {id:200, minLv:6, maxLv:9, rate:20}, // Beetleback
      {id:66, minLv:6, maxLv:9, rate:25},  // Fernwhip
      {id:69, minLv:6, maxLv:9, rate:20},  // Seedpod
      {id:84, minLv:7, maxLv:9, rate:10}   // Zapbug
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:50, y:58}
  },
  tidewatch: {
    id:"tidewatch", name:"Tidewatch Port", icon:"⛵", type:"city",
    desc:"A bustling port city on the coast. Gym Leader Marina commands the waves.",
    connections:["route2","route3","deep_trench"],
    wildMonsters:[
      {id:25, minLv:10, maxLv:13, rate:30}, // Bubblecrab
      {id:28, minLv:10, maxLv:13, rate:30}, // Coralfish
      {id:87, minLv:10, maxLv:12, rate:20}, // Voltfin
      {id:42, minLv:11, maxLv:13, rate:20}  // Frosteel
    ],
    hasGym:true, gymLeader:"marina", requiredBadges:1, mapPos:{x:62, y:52}
  },
  route3: {
    id:"route3", name:"Route 3 - Coastal Shore", icon:"🏖️", type:"route",
    desc:"A rocky shoreline where Water types thrive.",
    connections:["tidewatch","emberveil"],
    wildMonsters:[
      {id:25, minLv:14, maxLv:17, rate:25},
      {id:28, minLv:14, maxLv:17, rate:25},
      {id:101, minLv:14, maxLv:16, rate:25},
      {id:42, minLv:15, maxLv:17, rate:25}
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:70, y:45}
  },
  emberveil: {
    id:"emberveil", name:"Emberveil City", icon:"🌋", type:"city",
    desc:"Built near an active volcano. The fiery Gym Leader Pyros waits within.",
    connections:["route3","route4","volcano_core"],
    wildMonsters:[
      {id:16, minLv:18, maxLv:22, rate:30}, // Emberworm
      {id:13, minLv:18, maxLv:22, rate:25}, // Lavabull
      {id:10, minLv:18, maxLv:21, rate:25}, // Cinderling
      {id:191, minLv:19, maxLv:22, rate:20}  // Pebblepup
    ],
    hasGym:true, gymLeader:"pyros", requiredBadges:2, mapPos:{x:75, y:35}
  },
  route4: {
    id:"route4", name:"Route 4 - Volcanic Wastes", icon:"🔥", type:"route",
    desc:"A harsh volcanic wasteland. Fire and Rock types are common here.",
    connections:["emberveil","sparkmoor"],
    wildMonsters:[
      {id:16, minLv:22, maxLv:26, rate:25},
      {id:13, minLv:22, maxLv:26, rate:25},
      {id:191, minLv:23, maxLv:26, rate:25},
      {id:98, minLv:23, maxLv:26, rate:25}
    ],
    hasGym:false, requiredBadges:3, mapPos:{x:65, y:28}
  },
  sparkmoor: {
    id:"sparkmoor", name:"Sparkmoor Town", icon:"⚡", type:"city",
    desc:"A town on the electric plains. Gym Leader Zara harnesses lightning power.",
    connections:["route4","route5","storm_plateau"],
    wildMonsters:[
      {id:81, minLv:26, maxLv:30, rate:30}, // Sparklet
      {id:84, minLv:26, maxLv:30, rate:25}, // Zapbug
      {id:90, minLv:27, maxLv:30, rate:25}, // Stormchick
      {id:87, minLv:27, maxLv:30, rate:20}  // Voltfin
    ],
    hasGym:true, gymLeader:"zara", requiredBadges:3, mapPos:{x:52, y:25}
  },
  route5: {
    id:"route5", name:"Route 5 - Thunder Plains", icon:"🌩️", type:"route",
    desc:"A wide open plain where storms are constant and Electric types roam freely.",
    connections:["sparkmoor","frostpeak"],
    wildMonsters:[
      {id:81, minLv:30, maxLv:34, rate:25},
      {id:90, minLv:30, maxLv:34, rate:25},
      {id:111, minLv:31, maxLv:34, rate:25}, // Draftfinch
      {id:182, minLv:31, maxLv:34, rate:25}  // Roundbear
    ],
    hasGym:false, requiredBadges:4, mapPos:{x:42, y:22}
  },
  frostpeak: {
    id:"frostpeak", name:"Frostpeak Village", icon:"❄️", type:"city",
    desc:"A snow-covered village atop a frozen mountain. Ice Gym Leader Glacier awaits.",
    connections:["route5","route6","storm_plateau","crystal_depths"],
    wildMonsters:[
      {id:47, minLv:34, maxLv:38, rate:30}, // Frostpup
      {id:50, minLv:34, maxLv:38, rate:25}, // Snowfluff
      {id:45, minLv:35, maxLv:38, rate:25}, // Sleetling
      {id:53, minLv:35, maxLv:38, rate:20}  // Glaciawing
    ],
    hasGym:true, gymLeader:"glacier", requiredBadges:4, mapPos:{x:32, y:18}
  },
  route6: {
    id:"route6", name:"Route 6 - Crystal Caverns", icon:"💎", type:"route",
    desc:"An icy cave system glittering with crystals. Ice and Rock types dwell here.",
    connections:["frostpeak","shadowmere"],
    wildMonsters:[
      {id:47, minLv:38, maxLv:42, rate:25},
      {id:51, minLv:38, maxLv:42, rate:25}, // Icecrystal
      {id:195, minLv:39, maxLv:42, rate:25}, // Crystalrock
      {id:53, minLv:39, maxLv:42, rate:25}
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:22, y:25}
  },
  shadowmere: {
    id:"shadowmere", name:"Shadowmere City", icon:"🌑", type:"city",
    desc:"A city forever shrouded in shadow. Dark Gym Leader Nyx commands the night.",
    connections:["route6","route7","crystal_depths"],
    wildMonsters:[
      {id:118, minLv:42, maxLv:46, rate:30}, // Shadowpup
      {id:121, minLv:42, maxLv:46, rate:25}, // Voidbat
      {id:123, minLv:43, maxLv:46, rate:25}, // Umbralisard
      {id:170, minLv:43, maxLv:46, rate:20}  // Dreamrift
    ],
    hasGym:true, gymLeader:"nyx", requiredBadges:5, mapPos:{x:15, y:35}
  },
  route7: {
    id:"route7", name:"Route 7 - Poison Marshes", icon:"☠️", type:"route",
    desc:"A fetid swamp full of poison. Dark and Poison types are found in abundance.",
    connections:["shadowmere","skyvault","mystic_forest"],
    wildMonsters:[
      {id:157, minLv:46, maxLv:50, rate:25}, // Acidblob
      {id:155, minLv:46, maxLv:50, rate:25}, // Toxitoad
      {id:160, minLv:47, maxLv:50, rate:25}, // Miasmafly
      {id:121, minLv:47, maxLv:50, rate:25}  // Voidbat
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:20, y:48}
  },
  skyvault: {
    id:"skyvault", name:"Skyvault City", icon:"🏰", type:"city",
    desc:"A city floating on clouds. Psychic Gym Leader Oracle sees all futures.",
    connections:["route7","route8","mystic_forest"],
    wildMonsters:[
      {id:166, minLv:50, maxLv:54, rate:30}, // Mindpup
      {id:142, minLv:50, maxLv:54, rate:25}, // Dawnsprite
      {id:114, minLv:51, maxLv:54, rate:25}, // Cloudpuff
      {id:168, minLv:51, maxLv:54, rate:20}  // Esperia
    ],
    hasGym:true, gymLeader:"oracle", requiredBadges:6, mapPos:{x:30, y:55}
  },
  route8: {
    id:"route8", name:"Route 8 - Sky Corridors", icon:"🌤️", type:"route",
    desc:"Aerial paths between floating islands. Wind and Psychic types soar here.",
    connections:["skyvault","dragonspire"],
    wildMonsters:[
      {id:108, minLv:54, maxLv:58, rate:25}, // Breezekit
      {id:112, minLv:54, maxLv:58, rate:25}, // Cyclobird
      {id:171, minLv:55, maxLv:58, rate:25}, // Psydrake
      {id:177, minLv:55, maxLv:58, rate:25}  // Crystaldrake
    ],
    hasGym:false, requiredBadges:7, mapPos:{x:42, y:50}
  },
  dragonspire: {
    id:"dragonspire", name:"Dragonspire Peak", icon:"🐉", type:"city",
    desc:"The highest peak in Lumoria. Dragon Gym Leader Drake commands ancient power.",
    connections:["route8","route9"],
    wildMonsters:[
      {id:172, minLv:58, maxLv:62, rate:30}, // Drakling
      {id:175, minLv:58, maxLv:62, rate:25}, // Seadrake
      {id:176, minLv:59, maxLv:62, rate:25}, // Stormwyrm
      {id:177, minLv:59, maxLv:62, rate:20}  // Crystaldrake
    ],
    hasGym:true, gymLeader:"drake", requiredBadges:7, mapPos:{x:55, y:42}
  },
  victoryroad: {
    id:"victoryroad", name:"Victory Road", icon:"⚔️", type:"route",
    desc:"The final gauntlet. Only trainers with all 16 badges may pass.",
    connections:["starbloom","summit"],
    wildMonsters:[
      {id:173, minLv:62, maxLv:66, rate:25}, // Wyrmsire
      {id:124, minLv:62, maxLv:66, rate:25}, // Phantomfang
      {id:143, minLv:62, maxLv:66, rate:25}, // Celestara
      {id:151, minLv:63, maxLv:66, rate:25}  // Mecharon
    ],
    hasGym:false, requiredBadges:16, mapPos:{x:62, y:35}
  },
  summit: {
    id:"summit", name:"Victory Summit", icon:"👑", type:"special",
    desc:"The seat of the Lumoria Champion. Only the greatest trainers reach this place.",
    connections:["victoryroad"],
    wildMonsters:[], hasGym:false, isChampion:true, requiredBadges:16,
    mapPos:{x:72, y:30}
  },

  // ===== EXTRA AREAS =====
  lumoria_jungle: {
    id:"lumoria_jungle", name:"Lumoria Jungle", icon:"🌴", type:"route",
    desc:"A dense, humid jungle teeming with Grass, Poison and Bug types. Ancient ruins peek through the canopy.",
    connections:["route2","ancient_ruins"],
    wildMonsters:[
      {id:63, minLv:8, maxLv:12, rate:25},   // Mushrump
      {id:66, minLv:8, maxLv:12, rate:25},   // Fernwhip
      {id:140, minLv:9, maxLv:12, rate:20},   // Prismfly
      {id:155, minLv:9, maxLv:13, rate:20},   // Toxitoad
      {id:160, minLv:10, maxLv:13, rate:10}   // Miasmafly
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:56, y:68}
  },
  ancient_ruins: {
    id:"ancient_ruins", name:"Ancient Ruins", icon:"🏛️", type:"route",
    desc:"Crumbling temples from a forgotten civilization. Psychic and Dark energies fill the air. Team Umbra has been spotted here.",
    connections:["lumoria_jungle"],
    wildMonsters:[
      {id:142, minLv:12, maxLv:16, rate:25},  // Dawnsprite
      {id:170, minLv:12, maxLv:16, rate:25},  // Dreamrift
      {id:124, minLv:13, maxLv:17, rate:20},  // Phantomfang
      {id:168, minLv:14, maxLv:17, rate:20},  // Esperia
      {id:166, minLv:14, maxLv:17, rate:10}   // Mindpup
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:64, y:76},
    storyLocation:true
  },
  deep_trench: {
    id:"deep_trench", name:"Abyssal Trench", icon:"🌊", type:"route",
    desc:"The deepest part of Lumoria's ocean. Water and Dragon types of terrifying power lurk here. Team Umbra seeks something ancient in these depths.",
    connections:["tidewatch"],
    wildMonsters:[
      {id:175, minLv:18, maxLv:24, rate:25},  // Seadrake
      {id:88, minLv:18, maxLv:24, rate:25},  // Surgeeel
      {id:43, minLv:19, maxLv:24, rate:25},  // Glaciaseal
      {id:26, minLv:20, maxLv:25, rate:15},  // Waveclaw
      {id:316, minLv:30, maxLv:35, rate:10}  // Abyssdrake (rare!)
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:78, y:60},
    storyLocation:true
  },
  volcano_core: {
    id:"volcano_core", name:"Volcano Core", icon:"🌋", type:"route",
    desc:"The scorching heart of the volcano beneath Emberveil. Only the most fearless trainers descend here. Legendary energies stir within.",
    connections:["emberveil"],
    wildMonsters:[
      {id:17, minLv:22, maxLv:28, rate:25},  // Flamewyrm
      {id:14, minLv:22, maxLv:28, rate:25},  // Magmacow
      {id:99, minLv:23, maxLv:28, rate:20},  // Venomscorp
      {id:192, minLv:24, maxLv:29, rate:20},  // Boulderhound
      {id:315, minLv:35, maxLv:40, rate:10}  // Volcanox (rare!)
    ],
    hasGym:false, requiredBadges:3, mapPos:{x:82, y:42},
    storyLocation:true
  },
  storm_plateau: {
    id:"storm_plateau", name:"Storm Plateau", icon:"⛈️", type:"route",
    desc:"A high plateau perpetually wracked by storms. Electric and Dragon types are drawn to its crackling energy.",
    connections:["sparkmoor","frostpeak"],
    wildMonsters:[
      {id:176, minLv:28, maxLv:34, rate:25},  // Stormwyrm
      {id:109, minLv:28, maxLv:34, rate:25},  // Galemane
      {id:85, minLv:29, maxLv:34, rate:25},  // Thunderfly
      {id:112, minLv:29, maxLv:34, rate:15},  // Cyclobird
      {id:314, minLv:40, maxLv:45, rate:10}  // Tempestia (rare!)
    ],
    hasGym:false, requiredBadges:4, mapPos:{x:36, y:12},
    storyLocation:true
  },
  crystal_depths: {
    id:"crystal_depths", name:"Crystal Depths", icon:"💠", type:"route",
    desc:"An underground crystal cavern with walls of pure ice and steel. Rare mineral-type Lumos call this glittering place home.",
    connections:["frostpeak","shadowmere"],
    wildMonsters:[
      {id:177, minLv:34, maxLv:40, rate:25},  // Crystaldrake
      {id:195, minLv:34, maxLv:40, rate:25},  // Crystalrock
      {id:152, minLv:35, maxLv:40, rate:20},  // Titanshell
      {id:201, minLv:36, maxLv:41, rate:20}, // Hardbeetle
      {id:54, minLv:36, maxLv:41, rate:10}   // Polarex
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:10, y:28}
  },
  mystic_forest: {
    id:"mystic_forest", name:"Mystic Forest", icon:"🌌", type:"route",
    desc:"A forest where the boundary between worlds is thin. Fairy and Psychic creatures drift between the trees. Team Umbra's hideout is rumoured to be nearby.",
    connections:["route7","skyvault"],
    wildMonsters:[
      {id:143, minLv:46, maxLv:52, rate:25},  // Celestara
      {id:141, minLv:46, maxLv:52, rate:25},  // Radiantfly
      {id:169, minLv:47, maxLv:52, rate:20},  // Telepathy
      {id:115, minLv:48, maxLv:52, rate:20},  // Mistwalker
      {id:122, minLv:48, maxLv:52, rate:10}   // Spectrewing
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:25, y:62},
    storyLocation:true
  },
  umbra_base: {
    id:"umbra_base", name:"Team Umbra Base", icon:"☠️", type:"special",
    desc:"The hidden fortress of Team Umbra. Their leader, Commander Shade, awaits you here. This is your chance to stop their plan to awaken the three Legendaries.",
    connections:["mystic_forest"],
    wildMonsters:[
      {id:119, minLv:50, maxLv:55, rate:25},  // Nighthound
      {id:124, minLv:50, maxLv:55, rate:25},  // Phantomfang
      {id:122, minLv:51, maxLv:55, rate:25},  // Spectrewing
      {id:158, minLv:51, maxLv:55, rate:25}   // Sludgebeast
    ],
    hasGym:false, requiredBadges:6,
    hasUmbraBase:true,
    mapPos:{x:12, y:58}
  },

  // ===== NEW AREAS =====
  coral_reef: {
    id:"coral_reef", name:"Coral Reef", icon:"🪸", type:"route",
    desc:"A stunning underwater coral garden teeming with colorful Water and Poison types. Sunlight filters through the shimmering water above.",
    connections:["deep_trench","reef_ruins","sunken_temple"],
    wildMonsters:[
      {id:28, minLv:22, maxLv:28, rate:25},   // Coralfish
      {id:25, minLv:22, maxLv:28, rate:25},   // Bubblecrab
      {id:31, minLv:23, maxLv:28, rate:20},  // Polykling
      {id:155, minLv:24, maxLv:29, rate:20},   // Toxitoad
      {id:39, minLv:25, maxLv:30, rate:10}   // Tidalwing
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:84, y:72}
  },
  haunted_grove: {
    id:"haunted_grove", name:"Haunted Grove", icon:"👻", type:"route",
    desc:"A twisted forest where ancient trees whisper in the dark. Ghost-like shadows drift between the gnarled branches.",
    connections:["shadowmere","spirit_canyon"],
    wildMonsters:[
      {id:118, minLv:42, maxLv:47, rate:25},   // Shadowpup
      {id:121, minLv:42, maxLv:47, rate:25},   // Voidbat
      {id:126, minLv:43, maxLv:48, rate:20},  // Wraithling
      {id:123, minLv:44, maxLv:48, rate:20},   // Umbralisard
      {id:130, minLv:45, maxLv:50, rate:10}   // Gravemoss
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:8, y:42}
  },
  sky_harbor: {
    id:"sky_harbor", name:"Sky Harbor", icon:"⛵", type:"town",
    desc:"A floating dock tethered to the clouds. Wind traders and Psychic navigators pass through this breezy waystation.",
    connections:["skyvault","mystic_forest"],
    wildMonsters:[
      {id:108, minLv:48, maxLv:53, rate:25},   // Breezekit
      {id:114, minLv:48, maxLv:53, rate:25},   // Cloudpuff
      {id:116, minLv:49, maxLv:54, rate:20},  // Zephyrling
      {id:141, minLv:50, maxLv:54, rate:20},   // Radiantfly
      {id:111, minLv:49, maxLv:53, rate:10}    // Draftfinch
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:18, y:62}
  },
  thunder_cliffs: {
    id:"thunder_cliffs", name:"Thunder Cliffs", icon:"⚡", type:"route",
    desc:"Sheer cliff faces perpetually struck by lightning. Electric energy crackles through every rock and stone here.",
    connections:["sparkmoor","storm_plateau"],
    wildMonsters:[
      {id:81, minLv:28, maxLv:34, rate:25},   // Sparklet
      {id:90, minLv:28, maxLv:34, rate:25},   // Stormchick
      {id:92, minLv:29, maxLv:34, rate:20},  // Thunderock
      {id:85, minLv:30, maxLv:35, rate:20},   // Thunderfly
      {id:176, minLv:31, maxLv:36, rate:10}    // Stormwyrm
    ],
    hasGym:false, requiredBadges:4, mapPos:{x:60, y:16}
  },
  poison_swamp: {
    id:"poison_swamp", name:"Poison Swamp", icon:"🌿", type:"route",
    desc:"A festering bogland where toxic fumes hang low over the murky water. The air itself is thick with purple miasma.",
    connections:["route7","lumoria_jungle"],
    wildMonsters:[
      {id:155, minLv:44, maxLv:50, rate:25},   // Toxitoad
      {id:157, minLv:44, maxLv:50, rate:25},   // Acidblob
      {id:160, minLv:45, maxLv:50, rate:20},   // Miasmafly
      {id:162, minLv:46, maxLv:51, rate:20},  // Bogthorn
      {id:158, minLv:47, maxLv:52, rate:10}    // Sludgebeast
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:30, y:70}
  },
  sunken_temple: {
    id:"sunken_temple", name:"Sunken Temple", icon:"🏛️", type:"special",
    desc:"An ancient temple half-submerged beneath the ocean. Psychic inscriptions glow on the walls. Something powerful sleeps in the inner sanctum.",
    connections:["deep_trench","coral_reef"],
    wildMonsters:[
      {id:175, minLv:25, maxLv:32, rate:25},   // Seadrake
      {id:166, minLv:25, maxLv:32, rate:25},   // Mindpup
      {id:37, minLv:26, maxLv:33, rate:20},  // Coralgolem
      {id:168, minLv:27, maxLv:33, rate:15},   // Esperia
      {id:169, minLv:35, maxLv:40, rate:10}    // Telepathy (rare!)
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:88, y:52},
    storyLocation:true
  },
  iron_canyon: {
    id:"iron_canyon", name:"Iron Canyon", icon:"⛏️", type:"route",
    desc:"A deep canyon carved by centuries of volcanic flow. The walls glint with veins of metal ore. Steel and Ground types dominate this harsh terrain.",
    connections:["volcano_core","emberveil","lava_fields"],
    wildMonsters:[
      {id:147, minLv:25, maxLv:31, rate:25},   // Ironpup
      {id:191, minLv:25, maxLv:31, rate:25},   // Pebblepup
      {id:134, minLv:26, maxLv:32, rate:20},  // Scrapbat
      {id:150, minLv:27, maxLv:32, rate:20},   // Gearbot
      {id:152, minLv:28, maxLv:33, rate:10}    // Titanshell
    ],
    hasGym:false, requiredBadges:3, mapPos:{x:88, y:30}
  },
  fairy_meadow: {
    id:"fairy_meadow", name:"Fairy Meadow", icon:"🌸", type:"route",
    desc:"A gentle field carpeted in flowers where sunlight always shines. Fairy and Grass types play in the warm breeze.",
    connections:["seedvale","route7"],
    wildMonsters:[
      {id:137, minLv:4, maxLv:8, rate:25},     // Glowpup
      {id:69, minLv:4, maxLv:8, rate:25},     // Seedpod
      {id:140, minLv:5, maxLv:9, rate:25},     // Prismfly
      {id:72, minLv:5, maxLv:9, rate:25}     // Petalpuff
    ],
    hasGym:false, requiredBadges:0, mapPos:{x:8, y:68}
  },
  lunar_peak: {
    id:"lunar_peak", name:"Lunar Peak", icon:"🌙", type:"route",
    desc:"A remote mountain summit bathed in perpetual moonlight. Ice and Dragon types roam freely under the silver glow.",
    connections:["frostpeak","storm_plateau","crystal_spire"],
    wildMonsters:[
      {id:47, minLv:36, maxLv:42, rate:25},   // Frostpup
      {id:177, minLv:36, maxLv:42, rate:25},   // Crystaldrake
      {id:53, minLv:37, maxLv:43, rate:20},   // Glaciawing
      {id:59, minLv:38, maxLv:44, rate:20},  // Lunaveil
      {id:54, minLv:40, maxLv:46, rate:10}    // Polarex
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:20, y:10}
  },
  bug_forest: {
    id:"bug_forest", name:"Bug Forest", icon:"🐛", type:"route",
    desc:"A sprawling woodland where insect Lumos swarm in the undergrowth. The canopy buzzes with the sound of a thousand wings.",
    connections:["lumoria_jungle","ancient_ruins"],
    wildMonsters:[
      {id:197, minLv:10, maxLv:16, rate:25},  // Caterpet
      {id:200, minLv:10, maxLv:16, rate:25},  // Beetleback
      {id:84, minLv:11, maxLv:16, rate:20},   // Zapbug
      {id:202, minLv:12, maxLv:17, rate:20},  // Silkweaver
      {id:10, minLv:13, maxLv:18, rate:10}    // Cinderling
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:44, y:74}
  },
  mirror_lake: {
    id:"mirror_lake", name:"Mirror Lake", icon:"🪞", type:"route",
    desc:"A perfectly still alpine lake with a surface like polished glass. The reflected sky makes it impossible to tell up from down.",
    connections:["route5","storm_plateau"],
    wildMonsters:[
      {id:45, minLv:30, maxLv:36, rate:25},   // Sleetling
      {id:50, minLv:30, maxLv:36, rate:25},   // Snowfluff
      {id:137, minLv:31, maxLv:36, rate:20},   // Glowpup
      {id:57, minLv:32, maxLv:38, rate:20},  // Mirrorfish
      {id:43, minLv:34, maxLv:39, rate:10}    // Glaciaseal
    ],
    hasGym:false, requiredBadges:4, mapPos:{x:48, y:14}
  },
  lava_fields: {
    id:"lava_fields", name:"Lava Fields", icon:"🌋", type:"route",
    desc:"A smoldering expanse of hardened lava and glowing fissures. The ground cracks underfoot and fire vents belch superheated air.",
    connections:["volcano_core","iron_canyon"],
    wildMonsters:[
      {id:13, minLv:26, maxLv:32, rate:25},   // Lavabull
      {id:17, minLv:26, maxLv:32, rate:25},   // Flamewyrm
      {id:19, minLv:27, maxLv:33, rate:20},  // Cindermole
      {id:14, minLv:28, maxLv:34, rate:20},   // Magmacow
      {id:192, minLv:29, maxLv:34, rate:10}    // Boulderhound
    ],
    hasGym:false, requiredBadges:3, mapPos:{x:82, y:26}
  },
  spirit_canyon: {
    id:"spirit_canyon", name:"Spirit Canyon", icon:"🌀", type:"route",
    desc:"A deep chasm where psychic resonance amplifies every thought and memory. The walls seem to shift and breathe.",
    connections:["haunted_grove","fairy_meadow"],
    wildMonsters:[
      {id:166, minLv:44, maxLv:50, rate:25},   // Mindpup
      {id:170, minLv:44, maxLv:50, rate:25},   // Dreamrift
      {id:128, minLv:45, maxLv:51, rate:20},  // Psyshade
      {id:123, minLv:46, maxLv:51, rate:20},   // Umbralisard
      {id:167, minLv:47, maxLv:52, rate:10}    // Psychound
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:6, y:52}
  },
  reef_ruins: {
    id:"reef_ruins", name:"Reef Ruins", icon:"🏛️", type:"special",
    desc:"Ancient steel structures submerged beneath the sea, overgrown with coral. A forgotten civilization once thrived here beneath the waves.",
    connections:["coral_reef","ancient_ruins"],
    wildMonsters:[
      {id:26, minLv:28, maxLv:35, rate:25},   // Waveclaw
      {id:193, minLv:28, maxLv:35, rate:25},   // Cragclaw
      {id:37, minLv:29, maxLv:36, rate:20},  // Coralgolem
      {id:152, minLv:30, maxLv:36, rate:20},   // Titanshell
      {id:41, minLv:35, maxLv:42, rate:10}   // Rustleviathan
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:76, y:76},
    storyLocation:true
  },
  wind_bridge: {
    id:"wind_bridge", name:"Wind Bridge", icon:"🌬️", type:"route",
    desc:"A series of ancient stone arches bridging floating islands in the sky. Powerful updrafts make travel treacherous but the view is breathtaking.",
    connections:["route7","route8","skyvault"],
    wildMonsters:[
      {id:111, minLv:48, maxLv:54, rate:25},   // Draftfinch
      {id:108, minLv:48, maxLv:54, rate:25},   // Breezekit
      {id:112, minLv:49, maxLv:55, rate:20},   // Cyclobird
      {id:116, minLv:50, maxLv:55, rate:20},  // Zephyrling
      {id:109, minLv:51, maxLv:56, rate:10}    // Galemane
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:36, y:40}
  },
  crystal_spire: {
    id:"crystal_spire", name:"Crystal Spire", icon:"💎", type:"special",
    desc:"A towering spire of pure crystal ice and steel that catches the moonlight. Few trainers have ever climbed to its pinnacle.",
    connections:["crystal_depths","lunar_peak"],
    wildMonsters:[
      {id:51, minLv:38, maxLv:45, rate:25},   // Icecrystal
      {id:195, minLv:38, maxLv:45, rate:25},   // Crystalrock
      {id:148, minLv:39, maxLv:46, rate:20},   // Steelhound
      {id:55, minLv:40, maxLv:47, rate:20},  // Frostblade
      {id:201, minLv:42, maxLv:48, rate:10}   // Hardbeetle
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:16, y:18},
    storyLocation:true
  },
  dark_canyon: {
    id:"dark_canyon", name:"Dark Canyon", icon:"🌑", type:"route",
    desc:"A pitch-black gorge where no light penetrates. Dark type Lumos have claimed every shadowed corner, and even the rocks seem to absorb light.",
    connections:["spirit_canyon","umbra_base"],
    wildMonsters:[
      {id:119, minLv:50, maxLv:56, rate:25},   // Nighthound
      {id:122, minLv:50, maxLv:56, rate:25},   // Spectrewing
      {id:126, minLv:51, maxLv:57, rate:20},  // Wraithling
      {id:124, minLv:52, maxLv:57, rate:20},   // Phantomfang
      {id:130, minLv:53, maxLv:58, rate:10}   // Gravemoss
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:4, y:60}
  },
  // ---- NEW ROUTES & GYM CITIES (badges 8-15) ----
  route9: {
    id:"route9", name:"Route 9 - Verdant Trail", icon:"🌿", type:"route",
    desc:"A lush overgrown trail leading south from Dragonspire. Grass and Bug types thrive here.",
    connections:["dragonspire","bloomhaven"],
    wildMonsters:[
      {id:7, minLv:55, maxLv:60, rate:25},
      {id:66, minLv:55, maxLv:60, rate:25},
      {id:197, minLv:55, maxLv:60, rate:25},
      {id:72, minLv:56, maxLv:61, rate:15},
      {id:73, minLv:57, maxLv:62, rate:10}
    ],
    hasGym:false, requiredBadges:8, mapPos:{x:60, y:48}
  },
  bloomhaven: {
    id:"bloomhaven", name:"Bloomhaven City", icon:"🌸", type:"city",
    desc:"A city built around an ancient greenhouse. Home to Gym Leader Thorne, master of Grass types.",
    connections:["route9","route10"],
    wildMonsters:[
      {id:8, minLv:56, maxLv:60, rate:30},
      {id:70, minLv:56, maxLv:60, rate:30},
      {id:73, minLv:57, maxLv:61, rate:20},
      {id:75, minLv:58, maxLv:62, rate:20}
    ],
    hasGym:true, gymLeader:"thorne", requiredBadges:8, mapPos:{x:55, y:55}
  },
  route10: {
    id:"route10", name:"Route 10 - Toxic Passage", icon:"☠️", type:"route",
    desc:"A murky swamp path where poisonous fumes rise from the ground.",
    connections:["bloomhaven","murk_crossing"],
    wildMonsters:[
      {id:155, minLv:57, maxLv:62, rate:20},  // Toxirin (base)
      {id:157, minLv:57, maxLv:62, rate:20},  // Acidelix (base)
      {id:160, minLv:58, maxLv:63, rate:20},  // Miasoveth (base)
      {id:161, minLv:59, maxLv:64, rate:15},  // Toxivane (mid → after base ✓)
      {id:162, minLv:58, maxLv:63, rate:15},  // Marlix (base)
      {id:163, minLv:59, maxLv:64, rate:10}   // Venomalis (mid → after base ✓)
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:48, y:60}
  },
  miasmacity: {
    id:"miasmacity", name:"Miasma City", icon:"🏭", type:"city",
    desc:"An industrial city shrouded in toxic mist. Home to Gym Leader Viper, master of Poison types.",
    connections:["toxic_bog","route11"],
    wildMonsters:[
      {id:156, minLv:58, maxLv:63, rate:25},  // Venekon (mid)
      {id:159, minLv:60, maxLv:65, rate:25},  // Acidovast (final, 158 on murk_crossing ✓)
      {id:163, minLv:59, maxLv:64, rate:25},  // Venomalis (mid, 162 on route10 ✓)
      {id:165, minLv:59, maxLv:64, rate:25}   // Noxoveth (mid, 164 on murk_crossing ✓)
    ],
    hasGym:true, gymLeader:"viper", requiredBadges:9, mapPos:{x:42, y:65}
  },
  route11: {
    id:"route11", name:"Route 11 - Tremor Pass", icon:"🏔️", type:"route",
    desc:"A rumbling mountain pass where the ground never stops shaking.",
    connections:["miasmacity","quake_foothills"],
    wildMonsters:[
      {id:95,  minLv:59, maxLv:64, rate:20},  // Terrakin (base)
      {id:98,  minLv:59, maxLv:64, rate:20},  // Aridix (base)
      {id:101, minLv:59, maxLv:64, rate:20},  // Limoux (base)
      {id:104, minLv:60, maxLv:65, rate:20},  // Arenikin (base)
      {id:105, minLv:61, maxLv:66, rate:10},  // Dravanas (mid → after 104 ✓)
      {id:106, minLv:60, maxLv:65, rate:10}   // Geodrak (base)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:35, y:72}
  },
  terravault: {
    id:"terravault", name:"Terravault City", icon:"⛏️", type:"city",
    desc:"A city carved into a mountainside, rich with mineral deposits. Home to Gym Leader Atlas.",
    connections:["tremor_summit","route12"],
    wildMonsters:[
      {id:97,  minLv:61, maxLv:66, rate:25},  // Tectonvast (final, 96 on quake_foothills ✓)
      {id:100, minLv:61, maxLv:66, rate:25},  // Geovenomvast (final, 99 on quake_foothills ✓)
      {id:103, minLv:61, maxLv:66, rate:25},  // Geovast (final, 102 on quake_foothills ✓)
      {id:105, minLv:61, maxLv:66, rate:15},  // Dravanas (final, 104 on route11 ✓)
      {id:107, minLv:62, maxLv:67, rate:10}   // Terraquon (final, 106 on route11 ✓)
    ],
    hasGym:true, gymLeader:"atlas", requiredBadges:10, mapPos:{x:28, y:78}
  },
  route12: {
    id:"route12", name:"Route 12 - Silk Road", icon:"🕸️", type:"route",
    desc:"A path threaded with giant webs. Bug types ambush travelers at every turn.",
    connections:["terravault","cobweb_gully"],
    wildMonsters:[
      {id:197, minLv:61, maxLv:66, rate:20},  // Vermelin (base)
      {id:198, minLv:62, maxLv:67, rate:20},  // Chrysalix (mid → after 197 ✓)
      {id:200, minLv:61, maxLv:66, rate:20},  // Colerix (base)
      {id:202, minLv:62, maxLv:67, rate:20},  // Sericrix (base)
      {id:204, minLv:63, maxLv:68, rate:20}   // Terramite (base)
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:22, y:82}
  },
  silkwood: {
    id:"silkwood", name:"Silkwood Village", icon:"🌲", type:"city",
    desc:"A village nestled in an ancient forest where Bug types are revered. Home to Gym Leader Mantis.",
    connections:["cobweb_gully","route13"],
    wildMonsters:[
      {id:199, minLv:63, maxLv:68, rate:25},  // Aeridaleth (final)
      {id:201, minLv:62, maxLv:67, rate:25},  // Scarabion (mid)
      {id:203, minLv:63, maxLv:68, rate:25},  // Arachnalis (mid, 202 on route12 ✓)
      {id:205, minLv:64, maxLv:69, rate:25}   // Geodrix (mid)
    ],
    hasGym:true, gymLeader:"mantis", requiredBadges:11, mapPos:{x:15, y:88}
  },
  route13: {
    id:"route13", name:"Route 13 - Gale Ridge West", icon:"🌬️", type:"route",
    desc:"The western arm of Gale Ridge, where howling winds funnel through a narrow canyon toward the furthest point of the region.",
    connections:["silkwood","gale_peak"],
    wildMonsters:[
      {id:108, minLv:63, maxLv:68, rate:20},  // Zephyrkin (base)
      {id:109, minLv:64, maxLv:69, rate:20},  // Aeolomane (mid → after 108 ✓)
      {id:111, minLv:63, maxLv:68, rate:20},  // Aeolin (base)
      {id:114, minLv:64, maxLv:69, rate:15},  // Nimbusel (base)
      {id:116, minLv:64, maxLv:69, rate:15},  // Zephyrin (base)
      {id:61,  minLv:65, maxLv:70, rate:10}   // wind-type standalone
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:10, y:92}
  },
  gusthaven: {
    id:"gusthaven", name:"Gusthaven Town", icon:"🌀", type:"city",
    desc:"A town of windmills and airships. Home to Gym Leader Zephyra, master of Wind types.",
    connections:["gale_ridge_east","route14"],
    wildMonsters:[
      {id:110, minLv:65, maxLv:70, rate:25},  // Aeolarch (final)
      {id:113, minLv:65, maxLv:70, rate:25},  // Cyclavorn (final)
      {id:115, minLv:65, maxLv:70, rate:20},  // Aetherworn (mid)
      {id:117, minLv:65, maxLv:70, rate:20},  // Pneumathos (mid)
      {id:62,  minLv:66, maxLv:70, rate:10}   // standalone
    ],
    hasGym:true, gymLeader:"zephyra", requiredBadges:12, mapPos:{x:18, y:95}
  },
  route14: {
    id:"route14", name:"Route 14 - Ironwork Path", icon:"⚙️", type:"route",
    desc:"A path lined with abandoned machinery. Steel types have claimed the ruins as their territory.",
    connections:["gusthaven","forge_ruins"],
    wildMonsters:[
      {id:147, minLv:65, maxLv:70, rate:20},  // Ferrokin (base)
      {id:148, minLv:66, maxLv:71, rate:20},  // Adamavast (mid → after 147 ✓)
      {id:150, minLv:65, maxLv:70, rate:20},  // Gearon (base)
      {id:134, minLv:66, maxLv:71, rate:20},  // Aeronyx (base)
      {id:153, minLv:66, maxLv:71, rate:10},  // Forgekin (base)
      {id:55,  minLv:67, maxLv:72, rate:10}   // standalone steel
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:28, y:92}
  },
  ironforge: {
    id:"ironforge", name:"Ironforge City", icon:"🔨", type:"city",
    desc:"A city of foundries and forges. Home to Gym Leader Ferro, master of Steel types.",
    connections:["forge_approach","route15"],
    wildMonsters:[
      {id:149, minLv:67, maxLv:72, rate:25},  // Adamovast (final)
      {id:151, minLv:66, maxLv:71, rate:20},  // Ferrotron (mid)
      {id:152, minLv:67, maxLv:72, rate:20},  // Imperion (Steel/Rock)
      {id:135, minLv:67, maxLv:72, rate:20},  // Ferrovex (mid, 134 on route14 ✓)
      {id:136, minLv:68, maxLv:73, rate:15}   // Ferrovast (final → after 135 ✓)
    ],
    hasGym:true, gymLeader:"ferro", requiredBadges:13, mapPos:{x:38, y:88}
  },
  route15: {
    id:"route15", name:"Route 15 - Granite Pass", icon:"🪨", type:"route",
    desc:"A narrow mountain pass strewn with boulders. Rock types dominate.",
    connections:["ironforge","stone_plateau"],
    wildMonsters:[
      {id:191, minLv:67, maxLv:72, rate:20},  // Petrikin (base)
      {id:192, minLv:68, maxLv:73, rate:20},  // Lithavast (mid → after 191 ✓)
      {id:193, minLv:67, maxLv:72, rate:20},  // Rugothon (base)
      {id:132, minLv:68, maxLv:73, rate:20},  // Obsidrix (base)
      {id:133, minLv:69, maxLv:74, rate:10},  // Monolithox (mid → after 132 ✓)
      {id:93,  minLv:69, maxLv:74, rate:10}   // standalone rock
    ],
    hasGym:false, requiredBadges:14, mapPos:{x:48, y:85}
  },
  quarryville: {
    id:"quarryville", name:"Quarryville Town", icon:"🏗️", type:"city",
    desc:"A mining town carved from solid rock. Home to Gym Leader Boulder, master of Rock types.",
    connections:["stone_plateau","route16"],
    wildMonsters:[
      {id:192, minLv:68, maxLv:73, rate:20},  // Lithavast (mid)
      {id:195, minLv:69, maxLv:74, rate:20},  // Prismolith (195 on stone_plateau ✓)
      {id:196, minLv:70, maxLv:75, rate:20},  // Frigolith (mid → after 195 ✓)
      {id:133, minLv:69, maxLv:74, rate:25},  // Monolithox (mid)
      {id:92,  minLv:70, maxLv:74, rate:15}   // standalone
    ],
    hasGym:true, gymLeader:"boulder", requiredBadges:14, mapPos:{x:55, y:82}
  },
  route16: {
    id:"route16", name:"Route 16 - Starlit Path", icon:"✨", type:"route",
    desc:"A magical path where starlight dances on every surface. Fairy types float among the luminescent flowers.",
    connections:["quarryville","cosmic_cavern"],
    wildMonsters:[
      {id:137, minLv:69, maxLv:74, rate:20},  // Lumkin (base)
      {id:72,  minLv:69, maxLv:74, rate:20},  // fairy-type (base)
      {id:73,  minLv:70, maxLv:75, rate:20},  // fairy-type (evo → after 72 ✓)
      {id:142, minLv:69, maxLv:74, rate:20},  // Dawnirel (base, new)
      {id:145, minLv:70, maxLv:75, rate:20}   // Faerrin (base)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:62, y:78}
  },
  starbloom: {
    id:"starbloom", name:"Starbloom City", icon:"🌟", type:"city",
    desc:"A radiant city that glows with fairy magic. Home to Gym Leader Seraphina, the last gym before the Elite Four.",
    connections:["cosmic_cavern","victoryroad","void_rift"],
    wildMonsters:[
      {id:138, minLv:70, maxLv:75, rate:20},  // Aetherael (mid)
      {id:139, minLv:71, maxLv:76, rate:15},  // Lumiarch (final → after 138 ✓)
      {id:143, minLv:70, maxLv:75, rate:20},  // Lunarael (mid)
      {id:144, minLv:71, maxLv:76, rate:15},  // Celestarch (final → after 143 ✓)
      {id:146, minLv:71, maxLv:76, rate:20},  // Shinarith (mid, 145 on route16 ✓)
      {id:203, minLv:72, maxLv:76, rate:10}   // Arachnalis (mid)
    ],
    hasGym:true, gymLeader:"seraphina", requiredBadges:15, mapPos:{x:68, y:72}
  }
  // ---- ADDITIONAL ROUTES (direction-change splits & mid-gym connectors) ----
  murk_crossing: {
    id:"murk_crossing", name:"Murk Crossing", icon:"🌫️", type:"route",
    desc:"A bog-choked crossing where the path turns south through fetid marshland. Toxic vapors hang low and Poison types lurk in every murky puddle.",
    connections:["route10","toxic_bog"],
    wildMonsters:[
      {id:155, minLv:57, maxLv:62, rate:15},  // Toxirin (base)
      {id:156, minLv:58, maxLv:63, rate:20},  // Venekon (mid → after base ✓)
      {id:158, minLv:58, maxLv:63, rate:20},  // Toxoloth (mid, base Acidelix on route10 ✓)
      {id:159, minLv:60, maxLv:65, rate:20},  // Acidovast (final → after 158 ✓)
      {id:164, minLv:58, maxLv:63, rate:15},  // Venomite (base, new)
      {id:165, minLv:59, maxLv:64, rate:10}   // Noxoveth (mid → after 164 ✓)
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:42, y:60}
  },
  quake_foothills: {
    id:"quake_foothills", name:"Quake Foothills", icon:"🌋", type:"route",
    desc:"Rolling foothills rocked by constant tremors where Terravault's mountain range begins. Ground-type Lumos burrow through the cracked and heaving earth.",
    connections:["route11","tremor_summit"],
    wildMonsters:[
      {id:95,  minLv:59, maxLv:64, rate:15},  // Terrakin (base)
      {id:96,  minLv:60, maxLv:65, rate:20},  // Seismith (mid → after 95 ✓)
      {id:98,  minLv:59, maxLv:64, rate:15},  // Aridix (base)
      {id:99,  minLv:60, maxLv:65, rate:20},  // Geovenoth (mid → after 98 ✓)
      {id:101, minLv:59, maxLv:64, rate:15},  // Limoux (base)
      {id:102, minLv:60, maxLv:65, rate:15}   // Geoloth (mid → after 101 ✓)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:28, y:72}
  },
  cobweb_gully: {
    id:"cobweb_gully", name:"Cobweb Gully", icon:"🕸️", type:"route",
    desc:"A sunken gully thick with silken threads where every tree and boulder is wrapped in webs. Bug types in every stage of evolution compete for territory.",
    connections:["route12","silkwood"],
    wildMonsters:[
      {id:198, minLv:62, maxLv:67, rate:15},  // Chrysalix (mid, 197 on route12 ✓)
      {id:199, minLv:63, maxLv:68, rate:15},  // Aeridaleth (final → after 198 ✓)
      {id:200, minLv:61, maxLv:66, rate:15},  // Colerix (base)
      {id:201, minLv:62, maxLv:67, rate:20},  // Scarabion (mid → after 200 ✓)
      {id:204, minLv:63, maxLv:68, rate:15},  // Terramite (base)
      {id:205, minLv:64, maxLv:69, rate:20}   // Geodrix (mid → after 204 ✓)
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:15, y:82}
  },
  gale_ridge_east: {
    id:"gale_ridge_east", name:"Gale Ridge East", icon:"🌪️", type:"route",
    desc:"Where Gale Ridge curves sharply eastward, the winds reverse direction entirely. This turn is notorious for sending unprepared trainers stumbling backward toward Silkwood.",
    connections:["gale_peak","gusthaven"],
    wildMonsters:[
      {id:109, minLv:64, maxLv:69, rate:15},  // Aeolomane (mid, 108 on route13 ✓)
      {id:110, minLv:65, maxLv:70, rate:20},  // Aeolarch (final → after 109 ✓)
      {id:112, minLv:64, maxLv:69, rate:15},  // Cyclavel (mid, 111 on route13 ✓)
      {id:113, minLv:65, maxLv:70, rate:20},  // Cyclavorn (final → after 112 ✓)
      {id:115, minLv:65, maxLv:70, rate:15},  // Aetherworn (mid, 114 on route13 ✓)
      {id:117, minLv:65, maxLv:70, rate:15}   // Pneumathos (mid, 116 on route13 ✓)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:14, y:95}
  },
  forge_approach: {
    id:"forge_approach", name:"Forge Approach", icon:"🔩", type:"route",
    desc:"The rusted outer edge of Ironforge's industrial sprawl. Abandoned conveyor lines and slag heaps attract Steel-type Lumos who claim the metal as their own.",
    connections:["forge_ruins","ironforge"],
    wildMonsters:[
      {id:148, minLv:66, maxLv:71, rate:20},  // Adamavast (mid)
      {id:149, minLv:67, maxLv:72, rate:15},  // Adamovast (final → after 148 ✓)
      {id:150, minLv:65, maxLv:70, rate:15},  // Gearon (base)
      {id:151, minLv:66, maxLv:71, rate:20},  // Ferrotron (mid → after 150 ✓)
      {id:153, minLv:66, maxLv:71, rate:15},  // Forgekin (base)
      {id:154, minLv:67, maxLv:72, rate:15}   // Ferrolith (mid → after 153 ✓)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:38, y:92}
  },
  stone_plateau: {
    id:"stone_plateau", name:"Stone Plateau", icon:"🏜️", type:"route",
    desc:"A windswept expanse of exposed bedrock leading into Quarryville. Ancient monoliths dot the plateau and Rock and Dark types claim each one as territory.",
    connections:["route15","quarryville"],
    wildMonsters:[
      {id:192, minLv:68, maxLv:73, rate:20},  // Lithavast (mid, 191 on route15 ✓)
      {id:193, minLv:67, maxLv:72, rate:15},  // Rugothon (base)
      {id:194, minLv:68, maxLv:73, rate:20},  // Lithomere (mid → after 193 ✓)
      {id:133, minLv:69, maxLv:74, rate:20},  // Monolithox (mid)
      {id:195, minLv:69, maxLv:74, rate:15},  // Prismolith (base, new)
      {id:196, minLv:70, maxLv:75, rate:10}   // Frigolith (mid → after 195 ✓)
    ],
    hasGym:false, requiredBadges:14, mapPos:{x:48, y:82}
  },
  cosmic_cavern: {
    id:"cosmic_cavern", name:"Cosmic Cavern", icon:"🌌", type:"route",
    desc:"A glittering cavern lit by bioluminescent crystals on the approach to Starbloom. Fairy types dance in the starlight, but dark shadows hint at lurking Umbra agents.",
    connections:["route16","starbloom"],
    wildMonsters:[
      {id:137, minLv:69, maxLv:74, rate:15},  // Lumkin (base)
      {id:138, minLv:70, maxLv:75, rate:20},  // Aetherael (mid → after 137 ✓)
      {id:143, minLv:70, maxLv:75, rate:15},  // Lunarael (mid, 142 on route16 ✓)
      {id:144, minLv:71, maxLv:76, rate:20},  // Celestarch (final → after 143 ✓)
      {id:145, minLv:70, maxLv:75, rate:15},  // Faerrin (base)
      {id:119, minLv:70, maxLv:74, rate:15}   // Nighthound (Dark/Umbra)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:68, y:78}
  },
  void_rift: {
    id:"void_rift", name:"The Void Rift", icon:"🌀", type:"special",
    desc:"A tear in reality pulsing with dark energy near Route 16. Team Umbra's experiments cracked open this rift, and within its swirling darkness, Voidraxis — the Void Star — awaits any trainer bold enough to enter.",
    connections:["starbloom"],
    wildMonsters:[
      {id:119, minLv:72, maxLv:77, rate:30},  // Nighthound (Dark)
      {id:122, minLv:72, maxLv:77, rate:30},  // Spectrewing (Dark)
      {id:120, minLv:73, maxLv:78, rate:25},  // dark-type
      {id:131, minLv:73, maxLv:78, rate:15}   // Necrothon (Dark/Grass)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:75, y:72}
  }
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
  }
};

// ============================================================
// GYM LEADERS & CHAMPION
// ============================================================
const GYM_LEADERS = {
  rex: {
    id:"rex", name:"Leader Rex", emoji:"💪", type:"Normal",
    badge:"Foundation Badge", badgeEmoji:"🧱",
    quote:"You think you have what it takes? Let's see how normal you really are!",
    winQuote:"Not bad! Here, take the Foundation Badge. You've earned it.",
    team:[
      {monsterId:178, level:10, moves:["tackle","headbutt","growl","quick_attack"]},
      {monsterId:180, level:12, moves:["tackle","quick_attack","tail_whip","headbutt"]},
      {monsterId:183, level:14, moves:["headbutt","body_slam","growl","tackle"]}
    ]
  },
  marina: {
    id:"marina", name:"Leader Marina", emoji:"🌊", type:"Water",
    badge:"Wave Badge", badgeEmoji:"🌊",
    quote:"The ocean is vast and powerful. Feel the force of its tides!",
    winQuote:"You truly understand the ocean's power. The Wave Badge is yours.",
    team:[
      {monsterId:28, level:18, moves:["water_gun","bubble_beam","sweet_kiss","quick_attack"]},
      {monsterId:25, level:20, moves:["water_gun","bubble_beam","harden","aqua_tail"]},
      {monsterId:5,  level:22, moves:["water_gun","aqua_tail","surf","recover"]}
    ]
  },
  pyros: {
    id:"pyros", name:"Leader Pyros", emoji:"🔥", type:"Fire",
    badge:"Forge Badge", badgeEmoji:"🔥",
    quote:"My fire burns hotter than any volcano! Can you withstand the heat?",
    winQuote:"Your strength is as intense as a raging wildfire. The Forge Badge is yours!",
    team:[
      {monsterId:16, level:25, moves:["ember","quick_attack","flamethrower","tackle"]},
      {monsterId:10, level:26, moves:["ember","bug_bite","flame_fang","x_scissor"]},
      {monsterId:13, level:28, moves:["ember","headbutt","flamethrower","body_slam"]}
    ]
  },
  zara: {
    id:"zara", name:"Leader Zara", emoji:"⚡", type:"Electric",
    badge:"Current Badge", badgeEmoji:"⚡",
    quote:"I'll shock you senseless! Electric types are unstoppable!",
    winQuote:"You're truly electrifying! The Current Badge is yours.",
    team:[
      {monsterId:84, level:32, moves:["thunder_shock","spark","bug_bite","string_shot"]},
      {monsterId:90, level:33, moves:["thunder_shock","wing_attack","spark","thunderbolt"]},
      {monsterId:82, level:35, moves:["thunderbolt","spark","body_slam","thunder_wave"]}
    ]
  },
  glacier: {
    id:"glacier", name:"Leader Glacier", emoji:"❄️", type:"Ice",
    badge:"Frost Badge", badgeEmoji:"❄️",
    quote:"The cold never bothered me! But it will certainly bother you!",
    winQuote:"Your warmth has melted even my icy heart. The Frost Badge is yours.",
    team:[
      {monsterId:45, level:38, moves:["powder_snow","water_gun","ice_beam","surf"]},
      {monsterId:47, level:39, moves:["powder_snow","quick_attack","ice_beam","icicle_crash"]},
      {monsterId:50, level:42, moves:["powder_snow","harden","ice_beam","blizzard"]}
    ]
  },
  nyx: {
    id:"nyx", name:"Leader Nyx", emoji:"🌑", type:"Dark",
    badge:"Dusk Badge", badgeEmoji:"🌑",
    quote:"Light cannot penetrate my darkness. Surrender to the shadow!",
    winQuote:"A light that cannot be extinguished... The Dusk Badge is yours.",
    team:[
      {monsterId:121, level:44, moves:["bite","gust","dark_pulse","wing_attack"]},
      {monsterId:118, level:45, moves:["bite","quick_attack","crunch","night_slash"]},
      {monsterId:123, level:48, moves:["bite","poison_sting","crunch","shadow_ball"]}
    ]
  },
  oracle: {
    id:"oracle", name:"Leader Oracle", emoji:"🔮", type:"Psychic",
    badge:"Foresight Badge", badgeEmoji:"🔮",
    quote:"I have foreseen your defeat. The future is already written.",
    winQuote:"Incredible. You have rewritten what I thought was fate. The Foresight Badge is yours.",
    team:[
      {monsterId:166, level:50, moves:["confusion","quick_attack","psybeam","recover"]},
      {monsterId:142, level:51, moves:["confusion","fairy_wind","psybeam","dazzling_gleam"]},
      {monsterId:168, level:54, moves:["psybeam","dazzling_gleam","psychic_move","calm_mind"]}
    ]
  },
  drake: {
    id:"drake", name:"Leader Drake", emoji:"🐉", type:"Dragon",
    badge:"Wyrm Badge", badgeEmoji:"🐉",
    quote:"Dragons are the apex of all Lumos. You cannot defeat their ancient power!",
    winQuote:"You have shown the heart of a true dragon master. The Wyrm Badge is yours!",
    team:[
      {monsterId:172, level:56, moves:["dragon_breath","dragon_claw","headbutt","dragon_dance"]},
      {monsterId:176, level:57, moves:["thunder_shock","dragon_breath","thunderbolt","dragon_claw"]},
      {monsterId:175, level:59, moves:["water_gun","dragon_breath","surf","dragon_claw"]},
      {monsterId:173, level:62, moves:["dragon_claw","dragon_pulse","dragon_dance","outrage"]}
    ]
  },
  // ---- 8 NEW GYM LEADERS (badges 8-15) ----
  thorne: {
    id:"thorne", name:"Leader Thorne", emoji:"🌿", type:"Grass",
    badge:"Canopy Badge", badgeEmoji:"🌿",
    quote:"The forest speaks to me. Let its vines entangle your hopes!",
    winQuote:"Your spirit is as resilient as ancient oak. The Canopy Badge is yours.",
    team:[
      {monsterId:8, level:58, moves:["razor_leaf","vine_whip","seed_bomb","energy_ball"]},
      {monsterId:67, level:59, moves:["earthquake","razor_leaf","energy_ball","mud_shot"]},
      {monsterId:163, level:60, moves:["sludge_bomb","energy_ball","petal_blitz","toxic"]},
      {monsterId:9, level:62, moves:["petal_blitz","energy_ball","moonblast","canopy_crash"]}
    ]
  },
  viper: {
    id:"viper", name:"Leader Viper", emoji:"☠️", type:"Poison",
    badge:"Venom Badge", badgeEmoji:"☠️",
    quote:"One drop is all it takes. My Lumos are lethal to the touch!",
    winQuote:"You survived my venom... impressive. The Venom Badge is yours.",
    team:[
      {monsterId:156, level:60, moves:["sludge_bomb","venoshock","toxic","acid_rain"]},
      {monsterId:160, level:61, moves:["sludge_bomb","air_slash","miasma_cloud","toxic"]},
      {monsterId:32, level:62, moves:["venom_lance","x_scissor","bug_buzz","toxic_surge"]},
      {monsterId:158, level:64, moves:["sludge_wave","earthquake","acid_rain","toxic"]}
    ]
  },
  atlas: {
    id:"atlas", name:"Leader Atlas", emoji:"🏔️", type:"Ground",
    badge:"Tectonic Badge", badgeEmoji:"🏔️",
    quote:"I am the earth itself. Unshakable. Unyielding. Unstoppable!",
    winQuote:"The ground trembles in respect. The Tectonic Badge is yours.",
    team:[
      {monsterId:96, level:62, moves:["earthquake","rock_slide","mud_shot","stone_edge"]},
      {monsterId:102, level:63, moves:["earthquake","earth_power","body_slam","fissure_slam"]},
      {monsterId:107, level:64, moves:["earthquake","earth_power","fissure_slam","terra_spike"]},
      {monsterId:54, level:66, moves:["earthquake","blizzard","ice_beam","earth_power"]}
    ]
  },
  mantis: {
    id:"mantis", name:"Leader Mantis", emoji:"🦗", type:"Bug",
    badge:"Chitin Badge", badgeEmoji:"🦗",
    quote:"Bugs are nature's perfect warriors. Swift, sharp, and relentless!",
    winQuote:"Your reflexes rival even my bugs. The Chitin Badge is yours!",
    team:[
      {monsterId:201, level:64, moves:["x_scissor","bug_buzz","iron_tail","mandible_crush"]},
      {monsterId:165, level:65, moves:["bug_buzz","sludge_bomb","venoshock","x_scissor"]},
      {monsterId:205, level:66, moves:["bug_buzz","earthquake","x_scissor","mandible_crush"]},
      {monsterId:203, level:68, moves:["bug_buzz","moonblast","x_scissor","dazzling_gleam"]}
    ]
  },
  zephyra: {
    id:"zephyra", name:"Leader Zephyra", emoji:"🌪️", type:"Wind",
    badge:"Tempest Badge", badgeEmoji:"🌪️",
    quote:"The winds obey my command! Can you stand against the storm?",
    winQuote:"You've weathered the fiercest gale. The Tempest Badge is yours.",
    team:[
      {monsterId:112, level:66, moves:["hurricane","air_slash","cyclone_blade","jetstream"]},
      {monsterId:115, level:67, moves:["hurricane","cyclone_blade","skyfall","air_slash"]},
      {monsterId:62, level:68, moves:["blizzard","hurricane","ice_beam","air_slash"]},
      {monsterId:314, level:70, moves:["hurricane","thunderbolt","tempest_wrath","gale_cannon"]}
    ]
  },
  ferro: {
    id:"ferro", name:"Leader Ferro", emoji:"⚙️", type:"Steel",
    badge:"Alloy Badge", badgeEmoji:"⚙️",
    quote:"Steel is perfection. No weakness, no flaw, no mercy!",
    winQuote:"Even steel bends before your will. The Alloy Badge is yours.",
    team:[
      {monsterId:148, level:68, moves:["iron_tail","forge_strike","flash_cannon","crunch"]},
      {monsterId:152, level:69, moves:["tungsten_ram","stone_edge","iron_tail","flash_cannon"]},
      {monsterId:135, level:70, moves:["shadow_ball","flash_cannon","dark_pulse","forge_strike"]},
      {monsterId:151, level:72, moves:["tungsten_ram","flash_cannon","thunder","iron_tail"]}
    ]
  },
  boulder: {
    id:"boulder", name:"Leader Boulder", emoji:"🪨", type:"Rock",
    badge:"Geode Badge", badgeEmoji:"🪨",
    quote:"Solid as stone, heavy as mountains. My Lumos are unbreakable!",
    winQuote:"You've shattered my defenses. The Geode Badge is yours.",
    team:[
      {monsterId:192, level:70, moves:["earthquake","stone_edge","rock_slide","landslide"]},
      {monsterId:195, level:71, moves:["crystal_lance","stone_edge","landslide","geode_burst"]},
      {monsterId:133, level:72, moves:["dark_pulse","stone_edge","shadow_ball","landslide"]},
      {monsterId:152, level:74, moves:["tungsten_ram","stone_edge","iron_tail","landslide"]}
    ]
  },
  seraphina: {
    id:"seraphina", name:"Leader Seraphina", emoji:"🧚", type:"Fairy",
    badge:"Aurora Badge", badgeEmoji:"🧚",
    quote:"Fairy magic is the most beautiful and the most deadly force in Lumoria!",
    winQuote:"Your heart shines brighter than any fairy light. The Aurora Badge is yours!",
    team:[
      {monsterId:138, level:72, moves:["moonblast","dazzling_gleam","fairy_wind","celestial_wave"]},
      {monsterId:73, level:73, moves:["moonblast","energy_ball","dazzling_gleam","fairy_wind"]},
      {monsterId:146, level:74, moves:["moonblast","flash_cannon","celestial_wave","dazzling_gleam"]},
      {monsterId:143, level:76, moves:["moonblast","psychic_move","celestial_wave","calm_mind"]}
    ]
  },
  champion: {
    id:"champion", name:"Champion Lumian", emoji:"👑", type:"Mixed",
    badge:null, badgeEmoji:"🏆",
    quote:"I am Champion Lumian, master of all types and all strategies. Many have tried... none have succeeded. Show me your resolve, young trainer!",
    winQuote:"Astounding! You have defeated the Champion of Lumoria! Your name will echo through the ages! You are the new Lumoria Champion!",
    team:[
      {monsterId:3,  level:75, moves:["flamethrower","dragon_claw","heat_wave","outrage"]},
      {monsterId:54, level:76, moves:["blizzard","earthquake","ice_beam","earth_power"]},
      {monsterId:320, level:77, moves:["thunderbolt","tungsten_ram","flash_cannon","forge_strike"]},
      {monsterId:143, level:78, moves:["moonblast","psychic_move","celestial_wave","calm_mind"]},
      {monsterId:321, level:79, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]},
      {monsterId:171, level:80, moves:["psychic_move","dragon_pulse","temporal_rift","outrage"]}
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
  revive:     { name:"Revive",      emoji:"💫", desc:"Revives a fainted monster to 50% HP.", catchMult:0, healAmt:0, type:"revive" },
  rareCandy:  { name:"Rare Candy",  emoji:"🍬", desc:"Instantly raises a Lumo by 1 level.", catchMult:0, healAmt:0, type:"candy" },
  // Held items
  powerBand:     { name:"Power Band",     emoji:"💪", desc:"Boosts Attack by 20% when held.",           type:"held", held:{ stat:"atk", mult:1.2 } },
  guardCloak:    { name:"Guard Cloak",    emoji:"🛡️", desc:"Boosts Defense by 20% when held.",          type:"held", held:{ stat:"def", mult:1.2 } },
  wisdomLens:    { name:"Wisdom Lens",    emoji:"🔮", desc:"Boosts Sp.Atk by 20% when held.",           type:"held", held:{ stat:"spa", mult:1.2 } },
  spiritVeil:    { name:"Spirit Veil",    emoji:"🌀", desc:"Boosts Sp.Def by 20% when held.",           type:"held", held:{ stat:"spd", mult:1.2 } },
  swiftFeather:  { name:"Swift Feather",  emoji:"🪶", desc:"Boosts Speed by 20% when held.",            type:"held", held:{ stat:"spe", mult:1.2 } },
  vitalSeed:     { name:"Vital Seed",     emoji:"🌱", desc:"Boosts max HP by 15% when held.",           type:"held", held:{ stat:"hp",  mult:1.15 } },
  charcoal:      { name:"Charcoal",       emoji:"🔥", desc:"Powers up Fire-type moves by 20%.",         type:"held", held:{ typeBoost:"Fire", mult:1.2 } },
  mysticDew:     { name:"Mystic Dew",     emoji:"💧", desc:"Powers up Water-type moves by 20%.",        type:"held", held:{ typeBoost:"Water", mult:1.2 } },
  miracleSeed:   { name:"Miracle Seed",   emoji:"🌿", desc:"Powers up Grass-type moves by 20%.",        type:"held", held:{ typeBoost:"Grass", mult:1.2 } },
  magnet:        { name:"Magnet",         emoji:"🧲", desc:"Powers up Electric-type moves by 20%.",     type:"held", held:{ typeBoost:"Electric", mult:1.2 } },
  blackBelt:     { name:"Black Belt",     emoji:"🥋", desc:"Powers up physical moves by 10%.",           type:"held", held:{ catBoost:"physical", mult:1.1 } },
  wiseGlasses:   { name:"Wise Glasses",   emoji:"👓", desc:"Powers up special moves by 10%.",            type:"held", held:{ catBoost:"special", mult:1.1 } },
  focusSash:     { name:"Focus Sash",     emoji:"🎗️", desc:"Survive a fatal hit with 1 HP once per battle.", type:"held", held:{ effect:"focusSash" } },
  leftovers:     { name:"Leftovers",      emoji:"🍎", desc:"Restores 1/16 max HP each turn.",            type:"held", held:{ effect:"leftovers" } },
  scopeLens:     { name:"Scope Lens",     emoji:"🔭", desc:"Increases critical hit rate.",                type:"held", held:{ effect:"critUp" } },
  quickClaw:     { name:"Quick Claw",     emoji:"⚡", desc:"30% chance to move first each turn.",        type:"held", held:{ effect:"quickClaw" } },
  // Battle items
  xAttack:       { name:"X-Attack",      emoji:"⚔️", desc:"Raises Attack in battle.", catchMult:0, healAmt:0, type:"battle", battleEffect:{ stat:"atk", stages:1 } },
  xDefense:      { name:"X-Defense",     emoji:"🛡️", desc:"Raises Defense in battle.", catchMult:0, healAmt:0, type:"battle", battleEffect:{ stat:"def", stages:1 } },
  xSpeed:        { name:"X-Speed",       emoji:"💨", desc:"Raises Speed in battle.", catchMult:0, healAmt:0, type:"battle", battleEffect:{ stat:"spd", stages:1 } },
  // Additional held items
  poisonBarb:    { name:"Poison Barb",   emoji:"🗡️", desc:"Boosts Poison-type moves by 20% when held.", type:"held", held:{ typeBoost:"Poison", mult:1.2 } },
  softSand:      { name:"Soft Sand",     emoji:"🏖️", desc:"Boosts Ground-type moves by 20% when held.", type:"held", held:{ typeBoost:"Ground", mult:1.2 } },
  silverPowder:  { name:"Silver Powder", emoji:"✨", desc:"Boosts Bug-type moves by 20% when held.", type:"held", held:{ typeBoost:"Bug", mult:1.2 } },
  metalCoat:     { name:"Metal Coat",    emoji:"🔩", desc:"Boosts Steel-type moves by 20% when held.", type:"held", held:{ typeBoost:"Steel", mult:1.2 } },
  hardStone:     { name:"Hard Stone",    emoji:"🪨", desc:"Boosts Rock-type moves by 20% when held.", type:"held", held:{ typeBoost:"Rock", mult:1.2 } },
  pixieDust:     { name:"Pixie Dust",    emoji:"🧚", desc:"Boosts Fairy-type moves by 20% when held.", type:"held", held:{ typeBoost:"Fairy", mult:1.2 } },
  blackGlasses:  { name:"Black Glasses", emoji:"🕶️", desc:"Boosts Dark-type moves by 20% when held.", type:"held", held:{ typeBoost:"Dark", mult:1.2 } },
  neverMeltIce:  { name:"Never-Melt Ice",emoji:"🧊", desc:"Boosts Ice-type moves by 20% when held.", type:"held", held:{ typeBoost:"Ice", mult:1.2 } },
  dragonFang:    { name:"Dragon Fang",   emoji:"🐲", desc:"Boosts Dragon-type moves by 20% when held.", type:"held", held:{ typeBoost:"Dragon", mult:1.2 } },
  shellBell:     { name:"Shell Bell",    emoji:"🔔", desc:"Restores HP equal to 1/8 of damage dealt.", type:"held", held:{ effect:"shellBell" } },
  mysticWater:   { name:"Mystic Water",  emoji:"💧", desc:"Boosts Water-type moves by 20% when held.", type:"held", held:{ typeBoost:"Water", mult:1.2 } }
};

const STARTING_BAG = {
  basicOrb: 10,
  greatOrb: 0,
  ultraOrb: 0,
  masterOrb: 0,
  potion: 5,
  superPotion: 2,
  maxPotion: 0,
  revive: 1,
  rareCandy: 999,
  powerBand: 1,
  guardCloak: 0,
  wisdomLens: 0,
  spiritVeil: 0,
  swiftFeather: 0,
  vitalSeed: 0,
  charcoal: 0,
  mysticDew: 0,
  miracleSeed: 0,
  magnet: 0,
  blackBelt: 0,
  wiseGlasses: 0,
  focusSash: 0,
  leftovers: 0,
  scopeLens: 0,
  quickClaw: 0,
  xAttack: 0,
  xDefense: 0,
  xSpeed: 0,
  poisonBarb: 0,
  softSand: 0,
  silverPowder: 0,
  metalCoat: 0,
  hardStone: 0,
  pixieDust: 0,
  blackGlasses: 0,
  neverMeltIce: 0,
  dragonFang: 0,
  shellBell: 0,
  mysticWater: 0
};

const STARTER_IDS = [1, 4, 7]; // Emberpaw, Dewdrop, Sproutling

// ============================================================
// TEAM UMBRA STORYLINE DATA
// ============================================================

// Rival Marcus - challenges you at key milestones
const RIVAL_BATTLES = {
  rival_1: {
    id:"rival_1", name:"Rival Marcus", emoji:"🧒",
    quote:"You got lucky with that starter. Let me show you how a REAL trainer fights!",
    winQuote:"H-how?! I trained all week... Fine. Just you wait, I'll be stronger next time.",
    triggerBadges:1,
    team:[
      {monsterId:81, level:13, moves:["thunder_shock","quick_attack","scratch","growl"]},
      {monsterId:187, level:15, moves:["tackle","headbutt","growl","body_slam"]}
    ]
  },
  rival_2: {
    id:"rival_2", name:"Rival Marcus", emoji:"🧒",
    quote:"I heard about Team Umbra messing with the Ruins... but that's not my problem. MY problem is beating YOU!",
    winQuote:"Ugh! I need to train harder. Hey... be careful with Team Umbra. They're dangerous.",
    triggerBadges:3,
    team:[
      {monsterId:82, level:30, moves:["thunderbolt","spark","body_slam","thunder_wave"]},
      {monsterId:109, level:31, moves:["thunderbolt","wing_attack","air_slash","thunder"]},
      {monsterId:95, level:33, moves:["mud_shot","headbutt","earthquake","body_slam"]}
    ]
  },
  rival_3: {
    id:"rival_3", name:"Rival Marcus", emoji:"🧒",
    quote:"Team Umbra tried to recruit me, can you believe that? I told them to get lost. Now I'm going to prove my strength on YOU!",
    winQuote:"You're incredible. Look... I found this near the Umbra Base. Take it - you'll need it more than me. Stop them!",
    triggerBadges:6,
    reward:{ ultraOrb:3, superPotion:3 },
    team:[
      {monsterId:82, level:50, moves:["thunder","thunderbolt","dragon_dance","body_slam"]},
      {monsterId:171, level:51, moves:["psychic_move","dragon_pulse","confusion","psystrike"]},
      {monsterId:67, level:52, moves:["earthquake","energy_ball","petal_blitz","earth_power"]},
      {monsterId:151, level:54, moves:["flash_cannon","thunder","iron_tail","flash_cannon"]}
    ]
  },
  rival_4: {
    id:"rival_4", name:"Rival Marcus", emoji:"🧒",
    quote:"I heard a rumour — a new Umbra faction is operating in the southern routes. They've been capturing evolved Lumos. This doesn't sit right with me... but first, I need to settle things with YOU!",
    winQuote:"Incredible as always... I'll investigate those Umbra sightings. Watch your back on Routes 12 onward — something's off.",
    triggerBadges:9,
    team:[
      {monsterId:82, level:62, moves:["thunder","dragon_dance","body_slam","thunderbolt"]},
      {monsterId:171, level:63, moves:["psychic_move","dragon_pulse","psystrike","calm_mind"]},
      {monsterId:97, level:64, moves:["earthquake","stone_edge","rock_slide","earth_power"]},
      {monsterId:151, level:65, moves:["flash_cannon","thunder","forge_strike","iron_tail"]},
      {monsterId:65, level:66, moves:["petal_blitz","energy_ball","verdant_surge","canopy_crash"]}
    ]
  },
  rival_5: {
    id:"rival_5", name:"Rival Marcus", emoji:"🧒",
    quote:"I found what Team Umbra is after — Voidraxis, the Void Star legendary! They've opened a Void Rift near Route 16. This is serious. If you can't beat ME, you have no chance against what's waiting there!",
    winQuote:"You're ready. I've been tracking Commander Phantom — she's at the Void Rift with Voidraxis. Hurry, before they complete the ritual! Take this — you'll need it.",
    triggerBadges:14,
    reward:{ masterOrb:1, maxPotion:5 },
    team:[
      {monsterId:82, level:70, moves:["thunder","dragon_dance","arc_flash","overcharge"]},
      {monsterId:171, level:71, moves:["psystrike","dragon_pulse","temporal_rift","calm_mind"]},
      {monsterId:97, level:72, moves:["earthquake","stone_edge","tectonic_slam","earth_power"]},
      {monsterId:151, level:73, moves:["flash_cannon","thunder","tungsten_ram","anvil_drop"]},
      {monsterId:65, level:74, moves:["petal_blitz","verdant_surge","moonblast","canopy_crash"]},
      {monsterId:321, level:75, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]}
    ]
  }
};

// Team Umbra Commanders - encountered at key story locations
const UMBRA_BATTLES = {
  umbra_grunt_1: {
    id:"umbra_grunt_1", name:"Umbra Grunt Vex", emoji:"🕶️",
    quote:"Halt! Team Umbra's research must not be interrupted! The three Legendaries will be ours!",
    winQuote:"This isn't over... Commander Shade will hear about you!",
    team:[
      {monsterId:118, level:14, moves:["bite","quick_attack","night_slash","scratch"]},
      {monsterId:121, level:16, moves:["bite","gust","dark_pulse","wing_attack"]}
    ]
  },
  umbra_grunt_2: {
    id:"umbra_grunt_2", name:"Umbra Grunt Morta", emoji:"🕶️",
    quote:"You dare enter the Abyssal Trench? Commander Shade has claimed these waters for Team Umbra!",
    winQuote:"The Abyssdrake... you won't stop us from finding it!",
    team:[
      {monsterId:122, level:22, moves:["dark_pulse","wing_attack","air_slash","shadow_ball"]},
      {monsterId:157, level:23, moves:["sludge_bomb","toxic","venoshock","recover"]},
      {monsterId:119, level:25, moves:["crunch","night_slash","dark_pulse","body_slam"]}
    ]
  },
  umbra_commander_kira: {
    id:"umbra_commander_kira", name:"Commander Kira", emoji:"😈",
    quote:"A child? Oh how entertaining. I am Kira, first commander of Team Umbra. The volcano's power will be OURS. Stand aside or be crushed!",
    winQuote:"Impossible... I was trained by Shade himself! How can a child... Our plan is bigger than you know. Volcanox WILL awaken!",
    team:[
      {monsterId:17, level:32, moves:["flamethrower","dragon_claw","heat_wave","dragon_breath"]},
      {monsterId:99, level:33, moves:["sludge_bomb","earthquake","toxic","venoshock"]},
      {monsterId:14, level:36, moves:["flamethrower","rock_slide","fire_blast","body_slam"]},
      {monsterId:192, level:38, moves:["earthquake","rock_slide","stone_edge","body_slam"]}
    ]
  },
  umbra_commander_rex_shadow: {
    id:"umbra_commander_rex_shadow", name:"Commander Vorn", emoji:"⚡",
    quote:"I am Vorn, second commander of Team Umbra. We have awakened Tempestia from the Storm Plateau. Nothing can stop our plan now!",
    winQuote:"You're more powerful than our intelligence suggested... But Commander Shade is still ahead of you. And Tempestia has been released!",
    team:[
      {monsterId:176, level:44, moves:["thunder","dragon_claw","dragon_pulse","dragon_breath"]},
      {monsterId:109, level:45, moves:["hurricane","thunderbolt","air_slash","thunder"]},
      {monsterId:122, level:47, moves:["shadow_ball","air_slash","hurricane","dark_pulse"]},
      {monsterId:151, level:49, moves:["flash_cannon","thunder","iron_tail","body_slam"]}
    ]
  },
  umbra_shade: {
    id:"umbra_shade", name:"Commander Shade", emoji:"🌑",
    quote:"So... you are the trainer who dismantled my commanders' plans. Impressive. But it ends HERE. I have awakened all three Legendaries — Tempestia, Volcanox, and Abyssdrake. With their power, Team Umbra will control all of Lumoria! You are too late, child!",
    winQuote:"Defeated... by a trainer so young... Perhaps I misjudged the power of a trainer's bond with their Lumos. The Legendaries have retreated. Lumoria is safe... for now. You have my... grudging respect.",
    reward:{ masterOrb:1, maxPotion:5 },
    team:[
      {monsterId:169, level:58, moves:["psystrike","psychic_move","calm_mind","recover"]},
      {monsterId:124, level:59, moves:["crunch","dark_pulse","toxic","venoshock"]},
      {monsterId:143, level:60, moves:["moonblast","psychic_move","dazzling_gleam","calm_mind"]},
      {monsterId:321, level:61, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]},
      {monsterId:314, level:62, moves:["hurricane","thunder","air_slash","dragon_dance"]},
      {monsterId:316, level:65, moves:["hydro_pump","dark_pulse","dragon_pulse","crunch"]}
    ]
  },

  // ---- POST-GYM-15 VOIDRAXIS STORYLINE ----
  umbra_phantom_grunt: {
    id:"umbra_phantom_grunt", name:"Umbra Agent Riven", emoji:"🕶️",
    quote:"Turn back, trainer! Commander Phantom has reclaimed these routes for Team Umbra's new operation. The Void Star awakens — and its power over dark and fairy energy will be OURS!",
    winQuote:"You're stronger than I expected... but the Commander won't be stopped so easily. The Void Rift is already open!",
    team:[
      {monsterId:119, level:65, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
      {monsterId:122, level:66, moves:["dark_pulse","wing_attack","hurricane","shadow_ball"]},
      {monsterId:125, level:68, moves:["dark_pulse","sludge_bomb","venoshock","night_slash"]}
    ]
  },
  umbra_commander_phantom: {
    id:"umbra_commander_phantom", name:"Commander Phantom", emoji:"🌌",
    quote:"A child again? How tiresome. I am Phantom, Commander of Team Umbra's Void Division. While you were playing gym challenger, WE discovered the Void Star — Voidraxis — slumbering in the rift between light and darkness. With its power over both Dark AND Fairy energy, no one in Lumoria can resist us. Stand aside!",
    winQuote:"Impossible... Voidraxis should have responded to my call... The bond between trainer and Lumo really IS stronger than raw power. I— retreat! This isn't over, trainer. Voidraxis is still free. Find it before Umbra does!",
    team:[
      {monsterId:120, level:68, moves:["crunch","dark_pulse","night_slash","void_rend"]},
      {monsterId:131, level:69, moves:["dark_pulse","energy_ball","vine_whip","shadow_ball"]},
      {monsterId:133, level:70, moves:["crunch","stone_edge","shadow_ball","dark_pulse"]},
      {monsterId:136, level:72, moves:["flash_cannon","dark_pulse","forge_strike","void_rend"]},
      {monsterId:319, level:74, moves:["dark_pulse","moonblast","shadow_ball","soul_rend"]}
    ]
  }
};

// Story event text shown at key moments
const STORY_EVENTS = {
  intro: [
    "Professor Arbor: Welcome, young trainer! The Lumoria Region is a beautiful land... but dark times approach.",
    "Professor Arbor: A shadowy organization called TEAM UMBRA has been spotted near ancient sites across the region.",
    "Professor Arbor: They seek to awaken the three Legendary Lumos — Tempestia, Volcanox, and Abyssdrake.",
    "Professor Arbor: If awakened and controlled, these creatures could destroy Lumoria. You must become strong enough to stop them!",
    "Professor Arbor: Collect all 8 Gym Badges, and the power you build along the way will be your greatest weapon. Good luck!"
  ],
  after_badge_1: [
    "📰 News Flash: Strange hooded figures have been sighted near the Lumoria Jungle. Citizens are advised to be cautious.",
    "Your Rival Marcus rushes up: 'Hey! Did you hear about Team Umbra? They were spotted at the Ancient Ruins! Be careful out there.'"
  ],
  after_badge_2: [
    "Professor Arbor calls: 'Trainer! Team Umbra has been diving into the Abyssal Trench near Tidewatch Port. They're looking for Abyssdrake's resting place. Stop them!'"
  ],
  after_badge_3: [
    "📰 Breaking News: Tremors reported near Emberveil! Experts fear Team Umbra is attempting to wake Volcanox in the Volcano Core.",
    "A wounded explorer stumbles to you: 'Team Umbra... their commander Kira... she's in the Volcano Core... you must stop her!'"
  ],
  after_badge_4: [
    "Storm clouds gather unusually above the Storm Plateau...",
    "Professor Arbor: 'The storm patterns are abnormal — Team Umbra may be attempting to awaken Tempestia! Reach the Storm Plateau before it's too late!'"
  ],
  after_badge_5: [
    "Marcus: 'Two Legendaries nearly awakened... I tried to follow Team Umbra but they disappeared into the Mystic Forest. Their base must be there!'",
    "Professor Arbor: 'I've heard rumours of a hidden Umbra Base in the forest beyond Route 7. You must infiltrate it and confront Commander Shade!'"
  ],
  after_badge_6: [
    "Professor Arbor: 'You defeated Commander Shade! The Legendaries have retreated. But... Shade escaped. Stay vigilant.'",
    "Professor Arbor: 'The path to the Champion is now clear. Earn your final badges and face Champion Lumian. You've proven yourself a true hero of Lumoria!'"
  ],
  after_badge_9: [
    "Marcus: 'Hey! I've been seeing suspicious black-cloaked figures on the southern routes. Different from the Umbra grunts we fought before. Something new is brewing...'",
    "📰 News Flash: Trainers report unusual void-like disturbances near Route 12. Scientists are baffled by readings of overlapping Dark and Fairy energy signatures."
  ],
  after_badge_14: [
    "📰 BREAKING: A mysterious 'Void Rift' has opened near Starbloom City! Dark and Fairy energy readings are off the charts. Citizens warned to stay away from Route 16.",
    "Marcus rushes up, breathless: 'It's Team Umbra — a new commander called Phantom! They've been working in secret since Shade was defeated. They found a new legendary, Voidraxis the Void Star, and they're trying to control it!'",
    "Professor Arbor: 'The Void Star — Voidraxis — is a legendary being of absolute dark and fairy power. If Team Umbra binds it to their will, all of Lumoria's dark and fairy Lumos will fall under their control. You MUST stop Commander Phantom!'"
  ],
  after_badge_15: [
    "You've defeated Commander Phantom! But she escaped... and Voidraxis roams free, unbound.",
    "Marcus: 'The Void Rift is still active near Route 16. Voidraxis is unsettled — if you can face it and earn its respect, it won't be a threat anymore. It's now or never.'",
    "Professor Arbor: 'An untamed Voidraxis could destabilize the balance of dark and fairy energy across Lumoria. Face it in the Void Rift — not to destroy it, but to challenge it. A true bond can calm even the most powerful legendary!'"
  ],
  champion_defeated: [
    "🏆 CONGRATULATIONS! You have defeated Champion Lumian and become the NEW LUMORIA CHAMPION!",
    "Your deeds protecting Lumoria from Team Umbra — twice! — will be remembered forever.",
    "Professor Arbor: 'You are extraordinary. Not just a Champion in battle, but a Champion of heart. Lumoria is safe because of you — and because of the bond you share with your Lumos!'"
  ]
};


// ============================================================
// SHOPS DATA
// ============================================================
const SHOPS_DATA = {
  seedvale: {
    name: "Seedvale Mart",
    items: [
      { itemId: "basicOrb", price: 100 },
      { itemId: "potion", price: 50 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  ashford: {
    name: "Ashford Supply Co.",
    items: [
      { itemId: "basicOrb", price: 100 },
      { itemId: "greatOrb", price: 300 },
      { itemId: "potion", price: 50 },
      { itemId: "superPotion", price: 150 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  tidewatch: {
    name: "Tidewatch Market",
    items: [
      { itemId: "basicOrb", price: 100 },
      { itemId: "greatOrb", price: 300 },
      { itemId: "potion", price: 50 },
      { itemId: "superPotion", price: 150 },
      { itemId: "revive", price: 500 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  emberveil: {
    name: "Emberveil Emporium",
    items: [
      { itemId: "greatOrb", price: 300 },
      { itemId: "ultraOrb", price: 600 },
      { itemId: "superPotion", price: 150 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  sparkmoor: {
    name: "Sparkmoor Electronics",
    items: [
      { itemId: "greatOrb", price: 300 },
      { itemId: "ultraOrb", price: 600 },
      { itemId: "superPotion", price: 150 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 }
    ]
  },
  frostpeak: {
    name: "Frostpeak Provisions",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "xAttack", price: 250 },
      { itemId: "xDefense", price: 250 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  shadowmere: {
    name: "Shadowmere Black Market",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "xAttack", price: 250 },
      { itemId: "xDefense", price: 250 },
      { itemId: "xSpeed", price: 250 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  skyvault: {
    name: "Skyvault Boutique",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "xAttack", price: 250 },
      { itemId: "xDefense", price: 250 },
      { itemId: "xSpeed", price: 250 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  dragonspire: {
    name: "Dragonspire Forge",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "masterOrb", price: 50000 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "xAttack", price: 250 },
      { itemId: "xDefense", price: 250 },
      { itemId: "xSpeed", price: 250 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  bloomhaven: {
    name: "Bloomhaven Greenhouse",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "miracleSeed", price: 3000 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  miasmacity: {
    name: "Miasma City Apothecary",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "poisonBarb", price: 3000 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  terravault: {
    name: "Terravault Mining Supply",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "softSand", price: 3000 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  silkwood: {
    name: "Silkwood Nature Shop",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "silverPowder", price: 3000 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  gusthaven: {
    name: "Gusthaven Windmill Market",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "swiftFeather", price: 3000 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  ironforge: {
    name: "Ironforge Metallurgy",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "masterOrb", price: 50000 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "metalCoat", price: 3000 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  quarryville: {
    name: "Quarryville Stone Works",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "hardStone", price: 3000 },
      { itemId: "rareCandy", price: 1 }
    ]
  },
  starbloom: {
    name: "Starbloom Enchantments",
    items: [
      { itemId: "ultraOrb", price: 600 },
      { itemId: "masterOrb", price: 50000 },
      { itemId: "maxPotion", price: 500 },
      { itemId: "revive", price: 500 },
      { itemId: "rareCandy", price: 1 }
    ]
  }
};

// ============================================================
// ELITE FOUR (themed, NOT monotype)
// ============================================================
const ELITE_FOUR = [
  {
    id: "aria", name: "Elite Aria", emoji: "🎵", theme: "Graceful Offense",
    quote: "My Lumos dance through battle like a symphony. Can you keep up with the tempo?",
    winQuote: "A beautiful performance... You've earned my respect.",
    team: [
      { monsterId: 143, level: 72, moves: ["moonblast", "psychic_move", "dazzling_gleam", "calm_mind"] },
      { monsterId: 109, level: 71, moves: ["hurricane", "air_slash", "moonblast", "jetstream"] },
      { monsterId: 9, level: 72, moves: ["petal_blitz", "energy_ball", "moonblast", "sleep_powder"] },
      { monsterId: 39, level: 73, moves: ["surf", "hurricane", "ice_beam", "aqua_tail"] },
      { monsterId: 117, level: 74, moves: ["psychic_move", "hurricane", "cyclone_blade", "calm_mind"] }
    ]
  },
  {
    id: "grimshaw", name: "Elite Grimshaw", emoji: "💀", theme: "Brutal Power",
    quote: "I don't do finesse. I crush. I break. I win.",
    winQuote: "Tch... You hit harder than I expected. Fine, you pass.",
    team: [
      { monsterId: 123, level: 73, moves: ["crunch", "sludge_bomb", "dark_pulse", "poison_sting"] },
      { monsterId: 102, level: 72, moves: ["earthquake", "earth_power", "body_slam", "mud_shot"] },
      { monsterId: 158, level: 73, moves: ["sludge_wave", "earthquake", "acid_rain", "toxic"] },
      { monsterId: 148, level: 74, moves: ["iron_tail", "crunch", "flash_cannon", "forge_strike"] },
      { monsterId: 213, level: 75, moves: ["outrage", "dragon_pulse", "fire_blast", "dragon_dance"] }
    ]
  },
  {
    id: "celeste", name: "Elite Celeste", emoji: "✨", theme: "Cosmic Balance",
    quote: "The stars have aligned for this battle. Let us see what fate decrees.",
    winQuote: "The cosmos acknowledges your strength. Proceed, champion-to-be.",
    team: [
      { monsterId: 168, level: 74, moves: ["psychic_move", "dazzling_gleam", "moonblast", "calm_mind"] },
      { monsterId: 48, level: 73, moves: ["blizzard", "ice_beam", "surf", "icicle_crash"] },
      { monsterId: 151, level: 74, moves: ["flash_cannon", "thunderbolt", "tungsten_ram", "hyper_beam"] },
      { monsterId: 3, level: 75, moves: ["flamethrower", "dragon_claw", "heat_wave", "outrage"] },
      { monsterId: 211, level: 76, moves: ["dark_pulse", "moonblast", "psychic_move", "shadow_ball"] }
    ]
  },
  {
    id: "titan", name: "Elite Titan", emoji: "🏔️", theme: "Immovable Fortress",
    quote: "I am the mountain. I am the wall. You shall not pass.",
    winQuote: "The mountain crumbles... You have the strength of a titan yourself.",
    team: [
      { monsterId: 195, level: 74, moves: ["stone_edge", "crystal_lance", "landslide", "rock_slide"] },
      { monsterId: 152, level: 75, moves: ["tungsten_ram", "stone_edge", "iron_tail", "flash_cannon"] },
      { monsterId: 54, level: 74, moves: ["blizzard", "earthquake", "ice_beam", "earth_power"] },
      { monsterId: 41, level: 75, moves: ["flash_cannon", "surf", "tungsten_ram", "hydro_pump"] },
      { monsterId: 173, level: 76, moves: ["outrage", "dragon_pulse", "dragon_dance", "hyper_beam"] }
    ]
  }
];

// ============================================================
// LEVEL CAPS - Player team levels are capped in major battles
// ============================================================
const LEVEL_CAPS = {
  // Gym Leaders: cap = highest team member level + 2
  rex: 16, marina: 24, pyros: 30, zara: 37,
  glacier: 44, nyx: 50, oracle: 56, drake: 64,
  thorne: 64, viper: 66, atlas: 68, mantis: 70,
  zephyra: 72, ferro: 74, boulder: 76, seraphina: 78,
  // Elite Four
  aria: 78, grimshaw: 78, celeste: 78, titan: 78,
  // Champion
  champion: 82,
  // Rival battles
  rival_1: 17, rival_2: 35, rival_3: 56,
  rival_4: 68, rival_5: 77,
  // Team Umbra bosses
  umbra_grunt_1: 18, umbra_grunt_2: 27,
  umbra_phantom_grunt: 70, umbra_commander_phantom: 76,
  umbra_commander_kira: 40, umbra_commander_rex_shadow: 51,
  umbra_shade: 67
};

// ============================================================
// QUESTS DATA (100+ side quests)
// ============================================================
const QUESTS_DATA = [
  // ---- SEEDVALE & EARLY ROUTES (1-10) ----
  { id:"q1", title:"First Steps", desc:"Defeat 3 wild Lumos on Route 1 to prove your mettle.", location:"route1", type:"boss", requiredBadges:0,
    boss:{monsterId:181, level:8, moves:["tackle","headbutt","growl","quick_attack"]},
    reward:{type:"item", itemId:"potion", qty:5}, rewardText:"5 Potions" },
  { id:"q2", title:"Seedvale's Lost Pet", desc:"A child in Seedvale lost their Pudgeling. Find and defeat the wild one on Route 1.", location:"route1", type:"boss", requiredBadges:0,
    boss:{monsterId:185, level:7, moves:["tackle","gust","growl","wing_attack"]},
    reward:{type:"item", itemId:"greatOrb", qty:3}, rewardText:"3 Great Orbs" },
  { id:"q3", title:"Bug Catcher's Challenge", desc:"A bug catcher on Route 1 challenges you to battle his prized Caterpet!", location:"route1", type:"boss", requiredBadges:0,
    boss:{monsterId:198, level:10, moves:["bug_bite","string_shot","tackle","harden"]},
    reward:{type:"money", amount:500}, rewardText:"500 coins" },
  { id:"q4", title:"Meadow Guardian", desc:"A powerful Bushbear guards the meadow clearing. Defeat it!", location:"route1", type:"boss", requiredBadges:0,
    boss:{monsterId:70, level:12, moves:["vine_whip","tackle","razor_leaf","growl"]},
    reward:{type:"item", itemId:"miracleSeed", qty:1}, rewardText:"Miracle Seed" },
  { id:"q5", title:"Professor's Errand", desc:"Visit Ashford City to deliver a package for Professor Arbor.", location:"ashford", type:"visit", requiredBadges:0,
    reward:{type:"money", amount:300}, rewardText:"300 coins" },
  { id:"q6", title:"Night Prowler", desc:"A mysterious dark Lumos has been spotted on Route 1 at night. Defeat it!", location:"route1", type:"boss", requiredBadges:1,
    boss:{monsterId:118, level:15, moves:["bite","quick_attack","night_slash","growl"]},
    reward:{type:"item", itemId:"blackGlasses", qty:1}, rewardText:"Black Glasses" },
  { id:"q7", title:"Fairy Ring Mystery", desc:"Strange lights glow in Fairy Meadow. Investigate by defeating the guardian.", location:"fairy_meadow", type:"boss", requiredBadges:0,
    boss:{monsterId:137, level:10, moves:["fairy_wind","tackle","sweet_kiss","quick_attack"]},
    reward:{type:"item", itemId:"pixieDust", qty:1}, rewardText:"Pixie Dust" },
  { id:"q8", title:"The Stubborn Sproutling", desc:"A giant Sproutling blocks the path! Battle it to clear the way.", location:"route1", type:"boss", requiredBadges:0,
    boss:{monsterId:7, level:11, moves:["vine_whip","tackle","razor_leaf","sleep_powder"]},
    reward:{type:"item", itemId:"potion", qty:3}, rewardText:"3 Potions" },
  { id:"q9", title:"Route 1 Champion", desc:"Become the undisputed champion of Route 1 by defeating the alpha!", location:"route1", type:"boss", requiredBadges:1,
    boss:{monsterId:179, level:18, moves:["headbutt","body_slam","quick_attack","hyper_beam"]},
    reward:{type:"money", amount:1000}, rewardText:"1000 coins" },
  { id:"q10", title:"Ashford Arena Amateur", desc:"Win the Ashford amateur tournament!", location:"ashford", type:"boss", requiredBadges:1,
    boss:{monsterId:183, level:16, moves:["body_slam","headbutt","quick_attack","hyper_beam"]},
    reward:{type:"item", itemId:"superPotion", qty:3}, rewardText:"3 Super Potions" },

  // ---- TIDEWATCH & WATER AREAS (11-20) ----
  { id:"q11", title:"Tidewatch Fisherman", desc:"A fisherman challenges you with his strongest Water Lumos!", location:"tidewatch", type:"boss", requiredBadges:1,
    boss:{monsterId:25, level:22, moves:["surf","aqua_tail","bubble_beam","harden"]},
    reward:{type:"money", amount:800}, rewardText:"800 coins" },
  { id:"q12", title:"Coral Reef Explorer", desc:"Explore the Coral Reef and defeat its guardian.", location:"coral_reef", type:"boss", requiredBadges:2,
    boss:{monsterId:37, level:28, moves:["surf","flash_cannon","rock_slide","harden"]},
    reward:{type:"item", itemId:"mysticWater", qty:1}, rewardText:"Mystic Water" },
  { id:"q13", title:"Sunken Treasure", desc:"Dive deep in the Sunken Temple to find legendary treasure.", location:"sunken_temple", type:"boss", requiredBadges:2,
    boss:{monsterId:42, level:30, moves:["hydro_pump","aqua_tail","ice_beam","surf"]},
    reward:{type:"money", amount:3000}, rewardText:"3000 coins" },
  { id:"q14", title:"Reef Ruins Riddle", desc:"Solve the puzzle of the Reef Ruins by defeating the ancient guardian.", location:"reef_ruins", type:"boss", requiredBadges:2,
    boss:{monsterId:35, level:30, moves:["surf","moonblast","ice_beam","dazzling_gleam"]},
    reward:{type:"item", itemId:"shellBell", qty:1}, rewardText:"Shell Bell" },
  { id:"q15", title:"The Lurking Depth", desc:"Something massive lurks in the Deep Trench. Defeat it!", location:"deep_trench", type:"boss", requiredBadges:2,
    boss:{monsterId:41, level:35, moves:["flash_cannon","surf","tungsten_ram","hydro_pump"]},
    reward:{type:"item", itemId:"ultraOrb", qty:5}, rewardText:"5 Ultra Orbs" },
  { id:"q16", title:"Jungle Expedition", desc:"Navigate the Lumoria Jungle and defeat the territorial alpha.", location:"lumoria_jungle", type:"boss", requiredBadges:1,
    boss:{monsterId:67, level:20, moves:["vine_whip","mud_shot","razor_leaf","earthquake"]},
    reward:{type:"item", itemId:"greatOrb", qty:5}, rewardText:"5 Great Orbs" },
  { id:"q17", title:"Ancient Ruins Scholar", desc:"A scholar needs help clearing Lumos from the Ancient Ruins.", location:"ancient_ruins", type:"boss", requiredBadges:1,
    boss:{monsterId:166, level:22, moves:["confusion","psybeam","quick_attack","recover"]},
    reward:{type:"money", amount:1200}, rewardText:"1200 coins" },
  { id:"q18", title:"Tidal Wave Warning", desc:"A rogue Water Lumos threatens Tidewatch harbor!", location:"tidewatch", type:"boss", requiredBadges:2,
    boss:{monsterId:39, level:28, moves:["surf","hurricane","aqua_tail","wing_attack"]},
    reward:{type:"item", itemId:"revive", qty:3}, rewardText:"3 Revives" },
  { id:"q19", title:"Pearl Diver", desc:"Dive for pearls in the Coral Reef, but beware the guardian!", location:"coral_reef", type:"boss", requiredBadges:2,
    boss:{monsterId:34, level:26, moves:["dazzling_gleam","surf","fairy_wind","bubble_beam"]},
    reward:{type:"money", amount:2000}, rewardText:"2000 coins" },
  { id:"q20", title:"Route 2 Ranger", desc:"The Route 2 ranger needs help with an aggressive wild Lumos.", location:"route2", type:"boss", requiredBadges:1,
    boss:{monsterId:8, level:18, moves:["razor_leaf","vine_whip","poison_sting","body_slam"]},
    reward:{type:"item", itemId:"superPotion", qty:5}, rewardText:"5 Super Potions" },

  // ---- EMBERVEIL & FIRE AREAS (21-30) ----
  { id:"q21", title:"Volcanic Challenge", desc:"Brave the Volcano Core and defeat its fiery guardian!", location:"volcano_core", type:"boss", requiredBadges:3,
    boss:{monsterId:20, level:35, moves:["flamethrower","earthquake","fire_blast","earth_power"]},
    reward:{type:"item", itemId:"charcoal", qty:1}, rewardText:"Charcoal" },
  { id:"q22", title:"Lava Fields Survivor", desc:"Cross the Lava Fields and defeat the alpha fire Lumos.", location:"lava_fields", type:"boss", requiredBadges:3,
    boss:{monsterId:13, level:34, moves:["flamethrower","body_slam","heat_wave","fire_blast"]},
    reward:{type:"money", amount:2500}, rewardText:"2500 coins" },
  { id:"q23", title:"Emberveil Forge Master", desc:"The Forge Master tests trainers with his strongest Lumos.", location:"emberveil", type:"boss", requiredBadges:2,
    boss:{monsterId:16, level:30, moves:["flamethrower","quick_attack","heat_wave","fire_blast"]},
    reward:{type:"item", itemId:"maxPotion", qty:3}, rewardText:"3 Max Potions" },
  { id:"q24", title:"Cinder Mole Hunt", desc:"A rare Cindermole has been spotted in the Lava Fields!", location:"lava_fields", type:"boss", requiredBadges:3,
    boss:{monsterId:19, level:32, moves:["flamethrower","earthquake","mud_shot","ember"]},
    reward:{type:"item", itemId:"softSand", qty:1}, rewardText:"Soft Sand" },
  { id:"q25", title:"Iron Canyon Explorer", desc:"Explore the treacherous Iron Canyon and defeat its sentinel.", location:"iron_canyon", type:"boss", requiredBadges:3,
    boss:{monsterId:148, level:34, moves:["iron_tail","crunch","flash_cannon","metal_claw"]},
    reward:{type:"item", itemId:"metalCoat", qty:1}, rewardText:"Metal Coat" },
  { id:"q26", title:"Route 3 Gauntlet", desc:"Run the Route 3 trainer gauntlet and face the final boss!", location:"route3", type:"boss", requiredBadges:2,
    boss:{monsterId:26, level:26, moves:["surf","rock_slide","aqua_tail","headbutt"]},
    reward:{type:"money", amount:1500}, rewardText:"1500 coins" },
  { id:"q27", title:"Fire Dance Festival", desc:"Win the Emberveil Fire Dance Festival battle tournament!", location:"emberveil", type:"boss", requiredBadges:3,
    boss:{monsterId:11, level:32, moves:["flamethrower","wing_attack","air_slash","heat_wave"]},
    reward:{type:"item", itemId:"xAttack", qty:5}, rewardText:"5 X-Attacks" },
  { id:"q28", title:"Molten Core Mystery", desc:"Strange energy readings in the Volcano Core need investigation.", location:"volcano_core", type:"boss", requiredBadges:3,
    boss:{monsterId:14, level:36, moves:["flamethrower","rock_slide","earthquake","fire_blast"]},
    reward:{type:"money", amount:3000}, rewardText:"3000 coins" },
  { id:"q29", title:"The Scorched Path", desc:"Clear the scorched path through Route 4 from aggressive Lumos.", location:"route4", type:"boss", requiredBadges:3,
    boss:{monsterId:99, level:34, moves:["earthquake","poison_sting","venoshock","mud_shot"]},
    reward:{type:"item", itemId:"revive", qty:3}, rewardText:"3 Revives" },
  { id:"q30", title:"Ember Guardian", desc:"The legendary ember guardian protects Emberveil's sacred flame.", location:"emberveil", type:"boss", requiredBadges:3,
    boss:{monsterId:3, level:38, moves:["flamethrower","dragon_claw","heat_wave","outrage"]},
    reward:{type:"item", itemId:"dragonFang", qty:1}, rewardText:"Dragon Fang" },

  // ---- SPARKMOOR & ELECTRIC AREAS (31-40) ----
  { id:"q31", title:"Static Shock", desc:"A dangerously charged Lumos terrorizes Sparkmoor. Stop it!", location:"sparkmoor", type:"boss", requiredBadges:3,
    boss:{monsterId:82, level:36, moves:["thunderbolt","spark","thunder_wave","body_slam"]},
    reward:{type:"item", itemId:"magnet", qty:1}, rewardText:"Magnet" },
  { id:"q32", title:"Thunder Cliffs Dare", desc:"Scale the Thunder Cliffs and face the storm beast!", location:"thunder_cliffs", type:"boss", requiredBadges:4,
    boss:{monsterId:92, level:40, moves:["thunderbolt","rock_slide","stone_edge","spark"]},
    reward:{type:"money", amount:3500}, rewardText:"3500 coins" },
  { id:"q33", title:"Power Plant Breach", desc:"Wild Electric Lumos have breached the Sparkmoor power plant!", location:"sparkmoor", type:"boss", requiredBadges:3,
    boss:{monsterId:85, level:35, moves:["thunderbolt","bug_buzz","spark","x_scissor"]},
    reward:{type:"item", itemId:"ultraOrb", qty:3}, rewardText:"3 Ultra Orbs" },
  { id:"q34", title:"Route 4 Blockade", desc:"A stubborn Ground Lumos blocks Route 4. Move it!", location:"route4", type:"boss", requiredBadges:3,
    boss:{monsterId:96, level:33, moves:["earthquake","rock_slide","mud_shot","headbutt"]},
    reward:{type:"item", itemId:"maxPotion", qty:2}, rewardText:"2 Max Potions" },
  { id:"q35", title:"Storm Chaser", desc:"Chase down and battle the legendary storm bird on Storm Plateau!", location:"storm_plateau", type:"boss", requiredBadges:4,
    boss:{monsterId:90, level:42, moves:["thunderbolt","hurricane","spark","wing_attack"]},
    reward:{type:"item", itemId:"swiftFeather", qty:1}, rewardText:"Swift Feather" },
  { id:"q36", title:"Mirror Lake Enigma", desc:"The Mirror Lake's surface shimmers with psychic energy. Investigate!", location:"mirror_lake", type:"boss", requiredBadges:4,
    boss:{monsterId:58, level:40, moves:["ice_beam","dazzling_gleam","psychic_move","fairy_wind"]},
    reward:{type:"item", itemId:"wiseGlasses", qty:1}, rewardText:"Wise Glasses" },
  { id:"q37", title:"Sparkmoor Circuit", desc:"Win the Sparkmoor Circuit racing tournament!", location:"sparkmoor", type:"boss", requiredBadges:3,
    boss:{monsterId:75, level:35, moves:["thunderbolt","vine_whip","spark","energy_ball"]},
    reward:{type:"money", amount:2500}, rewardText:"2500 coins" },
  { id:"q38", title:"Lightning Rod", desc:"Capture the wild electricity surging through Route 5.", location:"route5", type:"boss", requiredBadges:4,
    boss:{monsterId:93, level:40, moves:["thunderbolt","stone_edge","rock_slide","spark"]},
    reward:{type:"item", itemId:"xSpeed", qty:5}, rewardText:"5 X-Speeds" },
  { id:"q39", title:"Voltforest Protector", desc:"The Voltforest needs a champion to defeat the invasive alpha.", location:"bug_forest", type:"boss", requiredBadges:1,
    boss:{monsterId:76, level:20, moves:["thunderbolt","vine_whip","spark","razor_leaf"]},
    reward:{type:"item", itemId:"silverPowder", qty:1}, rewardText:"Silver Powder" },
  { id:"q40", title:"The Magnetic Anomaly", desc:"A strange magnetic field disrupts Sparkmoor. Find the source!", location:"sparkmoor", type:"boss", requiredBadges:4,
    boss:{monsterId:151, level:42, moves:["flash_cannon","thunderbolt","iron_tail","hyper_beam"]},
    reward:{type:"money", amount:4000}, rewardText:"4000 coins" },

  // ---- FROSTPEAK & ICE AREAS (41-50) ----
  { id:"q41", title:"Blizzard Warning", desc:"A massive blizzard Lumos rampages near Frostpeak!", location:"frostpeak", type:"boss", requiredBadges:4,
    boss:{monsterId:50, level:44, moves:["blizzard","ice_beam","icicle_crash","harden"]},
    reward:{type:"item", itemId:"neverMeltIce", qty:1}, rewardText:"Never-Melt Ice" },
  { id:"q42", title:"Frozen Lake Monster", desc:"Break through the ice and battle the creature beneath!", location:"mirror_lake", type:"boss", requiredBadges:4,
    boss:{monsterId:45, level:42, moves:["blizzard","surf","ice_beam","hydro_pump"]},
    reward:{type:"money", amount:4000}, rewardText:"4000 coins" },
  { id:"q43", title:"Avalanche Alert", desc:"Stop the Lumos causing avalanches on Route 5!", location:"route5", type:"boss", requiredBadges:4,
    boss:{monsterId:56, level:43, moves:["blizzard","flash_cannon","ice_beam","iron_tail"]},
    reward:{type:"item", itemId:"revive", qty:5}, rewardText:"5 Revives" },
  { id:"q44", title:"Crystal Depths Expedition", desc:"Delve into the Crystal Depths and claim the crystal prize.", location:"crystal_depths", type:"boss", requiredBadges:5,
    boss:{monsterId:195, level:48, moves:["crystal_lance","stone_edge","rock_slide","landslide"]},
    reward:{type:"item", itemId:"hardStone", qty:1}, rewardText:"Hard Stone" },
  { id:"q45", title:"Frostpeak Ski Challenge", desc:"Win the Frostpeak ski challenge battle tournament!", location:"frostpeak", type:"boss", requiredBadges:4,
    boss:{monsterId:47, level:42, moves:["ice_beam","icicle_crash","quick_attack","blizzard"]},
    reward:{type:"money", amount:3000}, rewardText:"3000 coins" },
  { id:"q46", title:"Ice Sculptor's Request", desc:"An ice sculptor needs rare ice crystals. Defeat the Lumos guarding them.", location:"frostpeak", type:"boss", requiredBadges:4,
    boss:{monsterId:55, level:44, moves:["ice_beam","flash_cannon","iron_tail","blizzard"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Max Potions" },
  { id:"q47", title:"Polar Expedition", desc:"Join the polar expedition and face the apex predator!", location:"route5", type:"boss", requiredBadges:4,
    boss:{monsterId:54, level:45, moves:["blizzard","earthquake","ice_beam","earth_power"]},
    reward:{type:"item", itemId:"xDefense", qty:5}, rewardText:"5 X-Defenses" },
  { id:"q48", title:"The Frozen Guardian", desc:"Awaken and battle the legendary frozen guardian of Frostpeak.", location:"frostpeak", type:"boss", requiredBadges:5,
    boss:{monsterId:48, level:50, moves:["blizzard","ice_beam","surf","icicle_crash"]},
    reward:{type:"item", itemId:"ultraOrb", qty:10}, rewardText:"10 Ultra Orbs" },
  { id:"q49", title:"Glacial Passage", desc:"Clear the glacial passage for travelers by defeating the blockade.", location:"crystal_depths", type:"boss", requiredBadges:5,
    boss:{monsterId:61, level:46, moves:["blizzard","gust","ice_beam","hurricane"]},
    reward:{type:"money", amount:3500}, rewardText:"3500 coins" },
  { id:"q50", title:"Chillgust Chase", desc:"A rare Chillgust has been spotted! Track it down!", location:"storm_plateau", type:"boss", requiredBadges:4,
    boss:{monsterId:62, level:45, moves:["blizzard","hurricane","ice_beam","air_slash"]},
    reward:{type:"item", itemId:"swiftFeather", qty:1}, rewardText:"Swift Feather" },

  // ---- SHADOWMERE & DARK AREAS (51-60) ----
  { id:"q51", title:"Shadow Stalker", desc:"A shadow stalks Shadowmere at night. Put it to rest.", location:"shadowmere", type:"boss", requiredBadges:5,
    boss:{monsterId:119, level:48, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
    reward:{type:"item", itemId:"blackGlasses", qty:1}, rewardText:"Black Glasses" },
  { id:"q52", title:"Haunted Grove Terror", desc:"The Haunted Grove has become more dangerous. Investigate!", location:"haunted_grove", type:"boss", requiredBadges:5,
    boss:{monsterId:124, level:48, moves:["shadow_ball","dark_pulse","crunch","poison_sting"]},
    reward:{type:"money", amount:4500}, rewardText:"4500 coins" },
  { id:"q53", title:"Lunar Peak Ascent", desc:"Climb Lunar Peak and face the moonlit guardian!", location:"lunar_peak", type:"boss", requiredBadges:5,
    boss:{monsterId:143, level:50, moves:["moonblast","psychic_move","dazzling_gleam","calm_mind"]},
    reward:{type:"item", itemId:"pixieDust", qty:1}, rewardText:"Pixie Dust" },
  { id:"q54", title:"Spirit Canyon Crossing", desc:"Cross Spirit Canyon by defeating the ghostly guardians.", location:"spirit_canyon", type:"boss", requiredBadges:5,
    boss:{monsterId:135, level:48, moves:["shadow_ball","flash_cannon","dark_pulse","iron_tail"]},
    reward:{type:"item", itemId:"spiritVeil", qty:1}, rewardText:"Spirit Veil" },
  { id:"q55", title:"Crystal Spire Mystery", desc:"Unlock the Crystal Spire's secrets by defeating its protector.", location:"crystal_spire", type:"boss", requiredBadges:5,
    boss:{monsterId:58, level:48, moves:["ice_beam","dazzling_gleam","psychic_move","blizzard"]},
    reward:{type:"money", amount:5000}, rewardText:"5000 coins" },
  { id:"q56", title:"Dark Canyon Depths", desc:"Venture into the Dark Canyon and face what lurks within.", location:"dark_canyon", type:"boss", requiredBadges:6,
    boss:{monsterId:133, level:52, moves:["dark_pulse","stone_edge","shadow_ball","crunch"]},
    reward:{type:"item", itemId:"ultraOrb", qty:5}, rewardText:"5 Ultra Orbs" },
  { id:"q57", title:"Shadowmere Underworld", desc:"The underworld beneath Shadowmere holds a powerful foe.", location:"shadowmere", type:"boss", requiredBadges:5,
    boss:{monsterId:79, level:48, moves:["dark_pulse","energy_ball","vine_whip","shadow_ball"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Max Potions" },
  { id:"q58", title:"Grave Moss Collector", desc:"Collect rare grave moss by defeating its parasitic host.", location:"haunted_grove", type:"boss", requiredBadges:5,
    boss:{monsterId:130, level:46, moves:["shadow_ball","energy_ball","dark_pulse","razor_leaf"]},
    reward:{type:"money", amount:3500}, rewardText:"3500 coins" },
  { id:"q59", title:"The Umbravine", desc:"A monstrous Umbravine has rooted in Route 6. Remove it!", location:"route6", type:"boss", requiredBadges:5,
    boss:{monsterId:79, level:50, moves:["dark_pulse","energy_ball","seed_bomb","shadow_ball"]},
    reward:{type:"item", itemId:"miracleSeed", qty:1}, rewardText:"Miracle Seed" },
  { id:"q60", title:"Nightfall Reckoning", desc:"Face the most powerful dark Lumos in all of Shadowmere.", location:"shadowmere", type:"boss", requiredBadges:6,
    boss:{monsterId:123, level:55, moves:["crunch","sludge_bomb","dark_pulse","shadow_ball"]},
    reward:{type:"item", itemId:"xAttack", qty:5}, rewardText:"5 X-Attacks" },

  // ---- SKYVAULT & PSYCHIC AREAS (61-70) ----
  { id:"q61", title:"Mind Over Matter", desc:"A psychic barrier blocks Skyvault. Shatter it by defeating the guardian.", location:"skyvault", type:"boss", requiredBadges:6,
    boss:{monsterId:168, level:54, moves:["psychic_move","dazzling_gleam","psybeam","calm_mind"]},
    reward:{type:"item", itemId:"wiseGlasses", qty:1}, rewardText:"Wise Glasses" },
  { id:"q62", title:"Mystic Forest Patrol", desc:"Patrol the Mystic Forest and defeat rogue Lumos.", location:"mystic_forest", type:"boss", requiredBadges:6,
    boss:{monsterId:78, level:50, moves:["shadow_ball","razor_leaf","dark_pulse","energy_ball"]},
    reward:{type:"money", amount:4000}, rewardText:"4000 coins" },
  { id:"q63", title:"Sky Harbor Defense", desc:"Sky Harbor is under attack! Defend it from the invader!", location:"sky_harbor", type:"boss", requiredBadges:6,
    boss:{monsterId:112, level:52, moves:["hurricane","air_slash","wing_attack","jetstream"]},
    reward:{type:"item", itemId:"revive", qty:5}, rewardText:"5 Revives" },
  { id:"q64", title:"Poison Swamp Cleanup", desc:"Clear the toxic Lumos polluting the Poison Swamp.", location:"poison_swamp", type:"boss", requiredBadges:6,
    boss:{monsterId:158, level:52, moves:["sludge_wave","earthquake","acid_rain","toxic"]},
    reward:{type:"item", itemId:"poisonBarb", qty:1}, rewardText:"Poison Barb" },
  { id:"q65", title:"Wind Bridge Battle", desc:"A wind elemental guards the Wind Bridge. Cross by defeating it!", location:"wind_bridge", type:"boss", requiredBadges:6,
    boss:{monsterId:115, level:52, moves:["hurricane","air_slash","cyclone_blade","jetstream"]},
    reward:{type:"money", amount:4500}, rewardText:"4500 coins" },
  { id:"q66", title:"Umbra Base Infiltrator", desc:"Infiltrate the abandoned Umbra Base and clear remaining forces.", location:"umbra_base", type:"boss", requiredBadges:6,
    boss:{monsterId:122, level:54, moves:["dark_pulse","wing_attack","hurricane","crunch"]},
    reward:{type:"item", itemId:"ultraOrb", qty:5}, rewardText:"5 Ultra Orbs" },
  { id:"q67", title:"Psychic Duel", desc:"Oracle's apprentice challenges you to a psychic duel!", location:"skyvault", type:"boss", requiredBadges:6,
    boss:{monsterId:117, level:54, moves:["psychic_move","hurricane","cyclone_blade","calm_mind"]},
    reward:{type:"money", amount:5000}, rewardText:"5000 coins" },
  { id:"q68", title:"Route 7 Guardian", desc:"The ancient guardian of Route 7 awakens. Defeat it!", location:"route7", type:"boss", requiredBadges:6,
    boss:{monsterId:9, level:52, moves:["petal_blitz","moonblast","energy_ball","sleep_powder"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Max Potions" },
  { id:"q69", title:"Skyvault Observatory", desc:"The observatory telescope reveals a hidden Lumos. Battle it!", location:"skyvault", type:"boss", requiredBadges:6,
    boss:{monsterId:319, level:56, moves:["dark_pulse","moonblast","psychic_move","shadow_ball"]},
    reward:{type:"item", itemId:"spiritVeil", qty:1}, rewardText:"Spirit Veil" },
  { id:"q70", title:"Dreamweaver", desc:"A Lumos weaves dreams into reality. Snap out of it by fighting!", location:"mystic_forest", type:"boss", requiredBadges:6,
    boss:{monsterId:142, level:52, moves:["dazzling_gleam","fairy_wind","psychic_move","moonblast"]},
    reward:{type:"item", itemId:"pixieDust", qty:1}, rewardText:"Pixie Dust" },

  // ---- DRAGONSPIRE & LATE GAME (71-80) ----
  { id:"q71", title:"Dragon's Trial", desc:"Pass the Dragon's Trial at Dragonspire to prove your worth.", location:"dragonspire", type:"boss", requiredBadges:7,
    boss:{monsterId:173, level:60, moves:["outrage","dragon_pulse","dragon_dance","hyper_beam"]},
    reward:{type:"money", amount:8000}, rewardText:"8000 coins" },
  { id:"q72", title:"Route 8 Warden", desc:"The Route 8 warden tests all who pass.", location:"route8", type:"boss", requiredBadges:7,
    boss:{monsterId:321, level:58, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]},
    reward:{type:"item", itemId:"dragonFang", qty:1}, rewardText:"Dragon Fang" },
  { id:"q73", title:"Victory Road Preview", desc:"Get a taste of Victory Road by defeating its gatekeeper!", location:"victoryroad", type:"boss", requiredBadges:8,
    boss:{monsterId:152, level:60, moves:["tungsten_ram","stone_edge","iron_tail","flash_cannon"]},
    reward:{type:"item", itemId:"xAttack", qty:5}, rewardText:"5 X-Attacks" },
  { id:"q74", title:"Dragon Egg Protector", desc:"Protect the dragon eggs from poachers by defeating their leader!", location:"dragonspire", type:"boss", requiredBadges:7,
    boss:{monsterId:172, level:56, moves:["dragon_claw","dragon_breath","body_slam","dragon_dance"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Max Potions" },
  { id:"q75", title:"The Dragon Sage", desc:"An ancient dragon sage challenges worthy trainers.", location:"dragonspire", type:"boss", requiredBadges:8,
    boss:{monsterId:175, level:62, moves:["surf","dragon_pulse","hydro_pump","dragon_claw"]},
    reward:{type:"money", amount:10000}, rewardText:"10000 coins" },
  { id:"q76", title:"Stormforged Encounter", desc:"A rare Stormforged has been spotted near Thunder Cliffs!", location:"thunder_cliffs", type:"boss", requiredBadges:4,
    boss:{monsterId:320, level:45, moves:["thunderbolt","flash_cannon","forge_strike","spark"]},
    reward:{type:"item", itemId:"metalCoat", qty:1}, rewardText:"Metal Coat" },
  { id:"q77", title:"Route 8 Ambush", desc:"Bandits ambush travelers on Route 8. Stop them!", location:"route8", type:"boss", requiredBadges:7,
    boss:{monsterId:119, level:56, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
    reward:{type:"item", itemId:"revive", qty:5}, rewardText:"5 Revives" },
  { id:"q78", title:"The Apex Hunter", desc:"Track down the apex predator of Dragonspire.", location:"dragonspire", type:"boss", requiredBadges:8,
    boss:{monsterId:176, level:60, moves:["thunderbolt","dragon_pulse","thunder","dragon_claw"]},
    reward:{type:"item", itemId:"dragonFang", qty:1}, rewardText:"Dragon Fang" },
  { id:"q79", title:"Legends Awakening", desc:"The ancient legends stir. Face a lesser dragon to prove readiness.", location:"dragonspire", type:"boss", requiredBadges:8,
    boss:{monsterId:171, level:62, moves:["psychic_move","dragon_pulse","psystrike","outrage"]},
    reward:{type:"money", amount:12000}, rewardText:"12000 coins" },
  { id:"q80", title:"Summit Sentinel", desc:"The Summit's sentinel bars entry to the unworthy.", location:"summit", type:"boss", requiredBadges:8,
    boss:{monsterId:151, level:62, moves:["flash_cannon","thunder","tungsten_ram","hyper_beam"]},
    reward:{type:"item", itemId:"masterOrb", qty:1}, rewardText:"Master Orb" },

  // ---- NEW AREAS - BLOOMHAVEN TO STARBLOOM (81-100) ----
  { id:"q81", title:"Bloomhaven Blossom Festival", desc:"Win the annual Blossom Festival tournament!", location:"bloomhaven", type:"boss", requiredBadges:8,
    boss:{monsterId:9, level:58, moves:["petal_blitz","energy_ball","moonblast","canopy_crash"]},
    reward:{type:"money", amount:6000}, rewardText:"6000 coins" },
  { id:"q82", title:"Toxic Waste Crisis", desc:"Miasma City's toxic waste has spawned a dangerous Lumos!", location:"miasmacity", type:"boss", requiredBadges:9,
    boss:{monsterId:158, level:60, moves:["sludge_wave","earthquake","acid_rain","toxic"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Max Potions" },
  { id:"q83", title:"Terravault Excavation", desc:"Join the excavation and battle what you unearth!", location:"terravault", type:"boss", requiredBadges:10,
    boss:{monsterId:107, level:62, moves:["earthquake","earth_power","fissure_slam","mud_shot"]},
    reward:{type:"item", itemId:"softSand", qty:1}, rewardText:"Soft Sand" },
  { id:"q84", title:"Silkwood Cocoon Crisis", desc:"Giant cocoons are hatching dangerous Lumos in Silkwood!", location:"silkwood", type:"boss", requiredBadges:11,
    boss:{monsterId:201, level:64, moves:["x_scissor","bug_buzz","iron_tail","mandible_crush"]},
    reward:{type:"item", itemId:"silverPowder", qty:1}, rewardText:"Silver Powder" },
  { id:"q85", title:"Gusthaven Wind Trial", desc:"Pass the Wind Trial to earn the respect of Gusthaven.", location:"gusthaven", type:"boss", requiredBadges:12,
    boss:{monsterId:109, level:66, moves:["hurricane","moonblast","air_slash","cyclone_blade"]},
    reward:{type:"money", amount:7000}, rewardText:"7000 coins" },
  { id:"q86", title:"Ironforge Masterwork", desc:"Defeat the Ironforge champion's ultimate creation!", location:"ironforge", type:"boss", requiredBadges:13,
    boss:{monsterId:151, level:68, moves:["tungsten_ram","flash_cannon","thunder","iron_tail"]},
    reward:{type:"item", itemId:"metalCoat", qty:1}, rewardText:"Metal Coat" },
  { id:"q87", title:"Quarryville Fossil Hunt", desc:"A rare fossil Lumos has been revived! Battle it!", location:"quarryville", type:"boss", requiredBadges:14,
    boss:{monsterId:195, level:68, moves:["crystal_lance","stone_edge","landslide","geode_burst"]},
    reward:{type:"item", itemId:"hardStone", qty:1}, rewardText:"Hard Stone" },
  { id:"q88", title:"Starbloom Celestial Trial", desc:"The Celestial Trial awaits at Starbloom. Are you worthy?", location:"starbloom", type:"boss", requiredBadges:15,
    boss:{monsterId:143, level:70, moves:["moonblast","psychic_move","celestial_wave","dazzling_gleam"]},
    reward:{type:"item", itemId:"pixieDust", qty:1}, rewardText:"Pixie Dust" },
  { id:"q89", title:"Route 9 Pioneer", desc:"Be the first to explore the new Route 9!", location:"route9", type:"boss", requiredBadges:8,
    boss:{monsterId:8, level:55, moves:["petal_blitz","razor_leaf","seed_bomb","energy_ball"]},
    reward:{type:"money", amount:5000}, rewardText:"5000 coins" },
  { id:"q90", title:"Route 10 Toxin", desc:"Clear the toxic Lumos blocking Route 10.", location:"route10", type:"boss", requiredBadges:9,
    boss:{monsterId:156, level:58, moves:["sludge_bomb","venoshock","toxic","acid_rain"]},
    reward:{type:"item", itemId:"superPotion", qty:10}, rewardText:"10 Super Potions" },
  { id:"q91", title:"Route 11 Tremors", desc:"Investigate the tremors shaking Route 11.", location:"route11", type:"boss", requiredBadges:10,
    boss:{monsterId:102, level:60, moves:["earthquake","earth_power","body_slam","fissure_slam"]},
    reward:{type:"money", amount:6000}, rewardText:"6000 coins" },
  { id:"q92", title:"Route 12 Swarm", desc:"A massive bug swarm threatens Route 12!", location:"route12", type:"boss", requiredBadges:11,
    boss:{monsterId:203, level:62, moves:["bug_buzz","moonblast","x_scissor","dazzling_gleam"]},
    reward:{type:"item", itemId:"revive", qty:5}, rewardText:"5 Revives" },
  { id:"q93", title:"Route 13 Gale", desc:"Navigate through the gale on Route 13.", location:"route13", type:"boss", requiredBadges:12,
    boss:{monsterId:112, level:64, moves:["hurricane","air_slash","cyclone_blade","skyfall"]},
    reward:{type:"item", itemId:"xSpeed", qty:5}, rewardText:"5 X-Speeds" },
  { id:"q94", title:"Route 14 Forge", desc:"Cross through the active forge on Route 14.", location:"route14", type:"boss", requiredBadges:13,
    boss:{monsterId:148, level:66, moves:["forge_strike","iron_tail","flash_cannon","crunch"]},
    reward:{type:"money", amount:7000}, rewardText:"7000 coins" },
  { id:"q95", title:"Route 15 Rockslide", desc:"Clear the massive rockslide on Route 15.", location:"route15", type:"boss", requiredBadges:14,
    boss:{monsterId:192, level:66, moves:["earthquake","stone_edge","rock_slide","landslide"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Max Potions" },
  { id:"q96", title:"Route 16 Enchantment", desc:"Break through the fairy enchantment on Route 16.", location:"route16", type:"boss", requiredBadges:15,
    boss:{monsterId:146, level:68, moves:["moonblast","flash_cannon","dazzling_gleam","celestial_wave"]},
    reward:{type:"item", itemId:"ultraOrb", qty:10}, rewardText:"10 Ultra Orbs" },
  { id:"q97", title:"Bloomhaven Herb Garden", desc:"The herb garden has been overrun! Reclaim it!", location:"bloomhaven", type:"boss", requiredBadges:8,
    boss:{monsterId:64, level:56, moves:["sludge_bomb","seed_bomb","spore_burst","energy_ball"]},
    reward:{type:"item", itemId:"miracleSeed", qty:1}, rewardText:"Miracle Seed" },
  { id:"q98", title:"Miasma Underbelly", desc:"Explore the toxic underbelly of Miasma City.", location:"miasmacity", type:"boss", requiredBadges:9,
    boss:{monsterId:165, level:60, moves:["bug_buzz","sludge_bomb","venoshock","x_scissor"]},
    reward:{type:"money", amount:6000}, rewardText:"6000 coins" },
  { id:"q99", title:"Terravault Deep Mine", desc:"Delve into the deepest mine shaft of Terravault.", location:"terravault", type:"boss", requiredBadges:10,
    boss:{monsterId:154, level:62, moves:["earthquake","forge_strike","flash_cannon","earth_power"]},
    reward:{type:"item", itemId:"xDefense", qty:5}, rewardText:"5 X-Defenses" },
  { id:"q100", title:"The Great Silkwood Tree", desc:"The Great Tree's guardian challenges all who approach!", location:"silkwood", type:"boss", requiredBadges:11,
    boss:{monsterId:202, level:62, moves:["bug_buzz","moonblast","silk_bind","dazzling_gleam"]},
    reward:{type:"money", amount:7000}, rewardText:"7000 coins" },

  // ---- BONUS/ENDGAME QUESTS (101-110) ----
  { id:"q101", title:"Legendary Tempest", desc:"Tempestia stirs atop the Storm Plateau. Face its wrath!", location:"storm_plateau", type:"boss", requiredBadges:12,
    boss:{monsterId:314, level:70, moves:["hurricane","thunderbolt","tempest_wrath","gale_cannon"]},
    reward:{type:"item", itemId:"masterOrb", qty:1}, rewardText:"Master Orb" },
  { id:"q102", title:"Volcanic Awakening", desc:"Volcanox rumbles in the Volcano Core. Calm it by battle!", location:"volcano_core", type:"boss", requiredBadges:10,
    boss:{monsterId:315, level:70, moves:["fire_blast","stone_edge","caldera_meltdown","earthquake"]},
    reward:{type:"item", itemId:"masterOrb", qty:1}, rewardText:"Master Orb" },
  { id:"q103", title:"Abyssal Dragon", desc:"Abyssdrake lurks in the Deep Trench. Challenge the abyss!", location:"deep_trench", type:"boss", requiredBadges:8,
    boss:{monsterId:316, level:70, moves:["hydro_pump","dragon_pulse","outrage","surf"]},
    reward:{type:"item", itemId:"masterOrb", qty:1}, rewardText:"Master Orb" },
  { id:"q104", title:"Temporal Rift", desc:"Chronoseer appears in the Crystal Spire. Face time itself!", location:"crystal_spire", type:"boss", requiredBadges:14,
    boss:{monsterId:317, level:70, moves:["psychic_move","temporal_rift","psystrike","calm_mind"]},
    reward:{type:"item", itemId:"masterOrb", qty:1}, rewardText:"Master Orb" },
  { id:"q105", title:"World Seed", desc:"Terranova awakens in the Ancient Ruins. Face nature's fury!", location:"ancient_ruins", type:"boss", requiredBadges:14,
    boss:{monsterId:318, level:70, moves:["earthquake","energy_ball","worldseed_quake","petal_blitz"]},
    reward:{type:"item", itemId:"masterOrb", qty:1}, rewardText:"Master Orb" },
  { id:"q106", title:"Void Star Rising", desc:"Voidstar manifests in the Dark Canyon. Face the void!", location:"void_rift", type:"boss", requiredBadges:15,
    boss:{monsterId:319, level:70, moves:["dark_pulse","moonblast","shadow_ball","psychic_move"]},
    reward:{type:"item", itemId:"masterOrb", qty:1}, rewardText:"Master Orb" },
  { id:"q107", title:"Storm Forged Legend", desc:"The legendary Stormforged descends on Iron Canyon!", location:"iron_canyon", type:"boss", requiredBadges:13,
    boss:{monsterId:320, level:70, moves:["thunderbolt","tungsten_ram","flash_cannon","forge_strike"]},
    reward:{type:"item", itemId:"masterOrb", qty:1}, rewardText:"Master Orb" },
  { id:"q108", title:"Champion's Rematch", desc:"Champion Lumian offers a rematch at full power!", location:"summit", type:"boss", requiredBadges:16,
    boss:{monsterId:321, level:80, moves:["outrage","dragon_pulse","fire_blast","dragon_dance"]},
    reward:{type:"money", amount:25000}, rewardText:"25000 coins" },
  { id:"q109", title:"Ultimate Trial", desc:"Face the ultimate trial: a gauntlet of the strongest wild Lumos!", location:"victoryroad", type:"boss", requiredBadges:16,
    boss:{monsterId:173, level:78, moves:["outrage","dragon_pulse","dragon_dance","hyper_beam"]},
    reward:{type:"money", amount:20000}, rewardText:"20000 coins" },
  { id:"q110", title:"The Final Quest", desc:"Complete every challenge Lumoria has to offer.", location:"summit", type:"boss", requiredBadges:16,
    boss:{monsterId:171, level:80, moves:["psychic_move","dragon_pulse","temporal_rift","outrage"]},
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },

  // ---- TRAINER BATTLES BETWEEN GYMS 8-16 (q111-q130) ----
  // Route 9 - Verdant Trail (post Gym 8, Grass/Bug focus)
  { id:"q111", title:"Verdant Trail Ranger", desc:"A veteran ranger patrols Route 9 and tests every trainer who passes.", location:"route9", type:"boss", requiredBadges:8,
    boss:{monsterId:74, level:57, moves:["celestial_wave","petal_blitz","moonblast","energy_ball"]},
    reward:{type:"money", amount:6000}, rewardText:"6000 coins" },
  { id:"q112", title:"Evolved Vine Colossus", desc:"A fully evolved Grass titan has made Route 9 its territory. Claim it!", location:"route9", type:"boss", requiredBadges:8,
    boss:{monsterId:68, level:58, moves:["earthquake","energy_ball","root_lance","petal_blitz"]},
    reward:{type:"item", itemId:"miracleSeed", qty:1}, rewardText:"Miracle Seed" },
  { id:"q113", title:"Bloomhaven Bug Wrangler", desc:"The local bug wrangler challenges you with his prized evolved insects.", location:"bloomhaven", type:"boss", requiredBadges:8,
    boss:{monsterId:203, level:57, moves:["moonblast","bug_buzz","dazzling_gleam","silk_bind"]},
    reward:{type:"item", itemId:"silverPowder", qty:1}, rewardText:"Silver Powder" },

  // Route 10 - Toxic Passage (Poison focus)
  { id:"q114", title:"Toxic Passage Brawler", desc:"A battle-hardened Poison trainer blocks the toxic passage.", location:"route10", type:"boss", requiredBadges:9,
    boss:{monsterId:159, level:60, moves:["acid_rain","sludge_wave","venom_lance","earth_power"]},
    reward:{type:"money", amount:6500}, rewardText:"6500 coins" },
  { id:"q115", title:"Miasma City Chemist", desc:"A Miasma City chemist tests trainers with toxic-type experiments.", location:"miasmacity", type:"boss", requiredBadges:9,
    boss:{monsterId:163, level:61, moves:["sludge_wave","venoshock","venom_lance","toxic"]},
    reward:{type:"item", itemId:"poisonBarb", qty:1}, rewardText:"Poison Barb" },
  { id:"q116", title:"Evolved Wind Venom", desc:"A Toxivane has evolved and taken root on Route 10. Clear it out!", location:"route10", type:"boss", requiredBadges:9,
    boss:{monsterId:161, level:60, moves:["hurricane","sludge_wave","air_slash","venom_lance"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Max Potions" },

  // Route 11 - Tremor Pass (Ground focus)
  { id:"q117", title:"Tremor Pass Demolitions", desc:"A demolitions expert challenges you at the rockiest point of Route 11.", location:"route11", type:"boss", requiredBadges:10,
    boss:{monsterId:97, level:63, moves:["earthquake","tectonic_slam","earth_power","stone_edge"]},
    reward:{type:"money", amount:7000}, rewardText:"7000 coins" },
  { id:"q118", title:"Desert Dragon Duel", desc:"A legendary desert dragon has been spotted at Route 11. Challenge it!", location:"route11", type:"boss", requiredBadges:10,
    boss:{monsterId:107, level:64, moves:["dragon_claw","earthquake","earth_power","outrage"]},
    reward:{type:"item", itemId:"softSand", qty:1}, rewardText:"Soft Sand" },
  { id:"q119", title:"Terravault Iron Giant", desc:"An ancient iron giant guards the entrance to Terravault's mines.", location:"terravault", type:"boss", requiredBadges:10,
    boss:{monsterId:103, level:63, moves:["earthquake","surf","earth_power","tidal_crush"]},
    reward:{type:"item", itemId:"xDefense", qty:5}, rewardText:"5 X-Defenses" },

  // Route 12 - Silk Road (Bug focus)
  { id:"q120", title:"Silk Road Weaver", desc:"The legendary Silk Road Weaver challenges trainers who disturb its web.", location:"route12", type:"boss", requiredBadges:11,
    boss:{monsterId:202, level:65, moves:["moonblast","bug_buzz","silk_bind","dazzling_gleam"]},
    reward:{type:"money", amount:7500}, rewardText:"7500 coins" },
  { id:"q121", title:"Silkwood Ancient Beetle", desc:"An ancient evolved beetle protects the Great Silkwood Tree's roots.", location:"silkwood", type:"boss", requiredBadges:11,
    boss:{monsterId:201, level:65, moves:["x_scissor","iron_tail","flash_cannon","mandible_crush"]},
    reward:{type:"item", itemId:"silverPowder", qty:1}, rewardText:"Silver Powder" },
  { id:"q122", title:"Rock Beetle King", desc:"The Rock Beetle King rules the Silk Road tunnels deep below.", location:"route12", type:"boss", requiredBadges:11,
    boss:{monsterId:205, level:65, moves:["bug_buzz","earthquake","stone_edge","mandible_crush"]},
    reward:{type:"item", itemId:"hardStone", qty:1}, rewardText:"Hard Stone" },

  // Route 13 - Gale Ridge (Wind focus)
  { id:"q123", title:"Gale Ridge Storm Rider", desc:"A storm rider has trained her Wind Lumos to hurricane strength.", location:"route13", type:"boss", requiredBadges:12,
    boss:{monsterId:113, level:67, moves:["hurricane","tempest_wrath","cyclone_blade","air_slash"]},
    reward:{type:"money", amount:8000}, rewardText:"8000 coins" },
  { id:"q124", title:"Gusthaven Wind Sage", desc:"The ancient Wind Sage challenges only the strongest trainers.", location:"gusthaven", type:"boss", requiredBadges:12,
    boss:{monsterId:117, level:67, moves:["hurricane","psychic_move","cyclone_blade","astral_rend"]},
    reward:{type:"item", itemId:"swiftFeather", qty:1}, rewardText:"Swift Feather" },
  { id:"q125", title:"Cyclavorn Chase", desc:"A Cyclavorn has run amok through Gale Ridge! Calm it with battle.", location:"route13", type:"boss", requiredBadges:12,
    boss:{monsterId:110, level:66, moves:["hurricane","thunderbolt","cyclone_blade","storm_surge"]},
    reward:{type:"item", itemId:"xSpeed", qty:5}, rewardText:"5 X-Speeds" },

  // Route 14 - Ironwork Path (Steel focus)
  { id:"q126", title:"Ironwork Sentinel", desc:"The Ironwork Path's mechanical sentinel bars all unworthy trainers.", location:"route14", type:"boss", requiredBadges:13,
    boss:{monsterId:149, level:69, moves:["tungsten_ram","flash_cannon","iron_tail","forge_strike"]},
    reward:{type:"money", amount:8500}, rewardText:"8500 coins" },
  { id:"q127", title:"Ironforge Champion Smith", desc:"The master blacksmith of Ironforge forged his Lumos as hard as steel.", location:"ironforge", type:"boss", requiredBadges:13,
    boss:{monsterId:154, level:69, moves:["flash_cannon","earthquake","tungsten_ram","anvil_drop"]},
    reward:{type:"item", itemId:"metalCoat", qty:1}, rewardText:"Metal Coat" },

  // Route 15 - Granite Pass / Team Umbra Resurgence
  { id:"q128", title:"Granite Pass Guardian", desc:"A Rock master guards the narrowest point of Granite Pass.", location:"route15", type:"boss", requiredBadges:14,
    boss:{monsterId:196, level:71, moves:["stone_edge","icicle_crash","blizzard","crystal_lance"]},
    reward:{type:"money", amount:9000}, rewardText:"9000 coins" },
  { id:"q129", title:"Umbra Void Patrol", desc:"Team Umbra agents have set up a checkpoint on Route 15! Clear them out!", location:"route15", type:"boss", requiredBadges:14,
    boss:{monsterId:119, level:67, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
    reward:{type:"item", itemId:"ultraOrb", qty:10}, rewardText:"10 Ultra Orbs",
    umbra:true },

  // Route 16 - Starlit Path / Voidraxis Storyline
  { id:"q130", title:"Void Rift Encounter", desc:"The Void Rift on Route 16 pulses with dark and fairy energy. Investigate and face the manifestation within!", location:"route16", type:"boss", requiredBadges:15,
    boss:{monsterId:319, level:72, moves:["dark_pulse","moonblast","soul_rend","fae_requiem"]},
    reward:{type:"item", itemId:"masterOrb", qty:1}, rewardText:"Master Orb" },
  { id:"q131", title:"Starbloom Fairy Guardian", desc:"A radiant fairy guardian challenges all who approach Starbloom's gates.", location:"starbloom", type:"boss", requiredBadges:15,
    boss:{monsterId:144, level:71, moves:["moonblast","psychic_move","celestial_wave","dazzling_gleam"]},
    reward:{type:"money", amount:10000}, rewardText:"10000 coins" },
  { id:"q132", title:"Commander Phantom's Last Stand", desc:"Commander Phantom has regrouped on Route 16! Stop Team Umbra before they re-open the Void Rift!", location:"route16", type:"boss", requiredBadges:15,
    boss:{monsterId:120, level:70, moves:["crunch","dark_pulse","void_rend","night_slash"]},
    reward:{type:"item", itemId:"maxPotion", qty:10}, rewardText:"10 Max Potions",
    umbra:true }
];
