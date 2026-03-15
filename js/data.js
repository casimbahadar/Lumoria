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
  1: { id:1, name:"Emberpaw",    emoji:"🦊", types:["Fire"],
    base:{hp:35,atk:48,def:40,spa:64,spd:47,spe:91},
    learnset:[[1,"tackle",[20,"cinderwhirl"]],[1,"growl"],[4,"ember"],[8,"quick_attack"],[13,"flame_fang"],[19,"swords_dance"],[27,"flamethrower"],[38,"fire_blast",[5,"scorch_veil"]]],
    evolveTo:2, evolveLevel:16, catchRate:45, expYield:62, rarity:"starter",
    desc:"A fire fox cub. Its tail flame glows brighter when its spirit is high." },

  2: { id:2, name:"Foxblaze",    emoji:"🦊", types:["Fire"],
    base:{hp:52,atk:59,def:62,spa:74,spd:57,spe:105},
    learnset:[[1,"tackle"],[2,"ember"],[3,"quick_attack"],[4,"flame_fang"],[5,"scorch_veil"],[24,"flamethrower"],[25,"blazing_rush"],[34,"heat_wave"],[35,"fire_blast"],[43,"inferno"],[6,"embercloak"],[32,"recover"]],
    evolveTo:3, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A blazing fox with a fiery mane. Rivals fear its flaming charge." },

  3: { id:3, name:"Infernovix",  emoji:"🐲", types:["Fire","Dragon"],
    base:{hp:70,atk:88,def:80,spa:105,spd:79,spe:105},
    learnset:[[1,"flame_fang"],[2,"flamethrower"],[3,"heat_wave"],[4,"scorch_veil"],[37,"fire_blast"],[40,"swords_dance"],[44,"dragon_breath"],[47,"inferno"],[48,"dragon_claw"],[52,"dragon_pulse"],[56,"solar_flare"],[60,"outrage"],[5,"embercloak"],[36,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"A terrifying dragon-fox hybrid. Its volcanic roar can be heard for miles." },

  // Water Starters
  4: { id:4, name:"Dewdrop",     emoji:"💧", types:["Water"],
    base:{hp:45,atk:52,def:69,spa:45,spd:66,spe:46},
    learnset:[[1,"tackle",[20,"frost_current"]],[1,"tail_whip"],[4,"water_gun"],[8,"bubble_beam"],[13,"aqua_tail"],[19,"recover"],[27,"surf"],[38,"hydro_pump",[5,"tidecaller"]]],
    evolveTo:5, evolveLevel:16, catchRate:45, expYield:59, rarity:"starter",
    desc:"A water sprite that lives near ponds. Its skin is always cool and moist." },

  5: { id:5, name:"Tidaling",    emoji:"🐍", types:["Water"],
    base:{hp:60,atk:66,def:79,spa:64,spd:85,spe:64},
    learnset:[[1,"water_gun"],[2,"tail_whip"],[3,"bubble_beam"],[4,"aqua_tail"],[5,"tidecaller"],[16,"recover"],[24,"surf"],[30,"harden"],[35,"hydro_pump"],[44,"tidal_crush"],[6,"deepwater_hymn"],[33,"swords_dance"]],
    evolveTo:6, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A serpentine water Lumo. Glides through water with incredible grace." },

  6: { id:6, name:"Oceanoth",    emoji:"🐲", types:["Water","Dragon"],
    base:{hp:72,atk:90,def:97,spa:89,spd:105,spe:75},
    learnset:[[1,"surf"],[2,"aqua_tail"],[3,"harden"],[4,"tidecaller"],[37,"hydro_pump"],[40,"abyssal_jet"],[44,"dragon_breath"],[48,"coral_barrage"],[52,"dragon_claw"],[56,"dragon_pulse"],[60,"eon_crash"],[64,"outrage"],[5,"deepwater_hymn"],[39,"ocean_tempest"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"An oceanic behemoth said to rule the seas. Its roar causes tidal waves." },

  // Grass Starters
  7: { id:7, name:"Sproutling",  emoji:"🌱", types:["Grass"],
    base:{hp:49,atk:42,def:55,spa:61,spd:70,spe:47},
    learnset:[[1,"tackle",[20,"root_lance"]],[1,"growl"],[4,"vine_whip"],[8,"razor_leaf"],[13,"seed_bomb"],[19,"swords_dance"],[27,"energy_ball"],[38,"petal_blitz",[5,"sleep_powder"]]],
    evolveTo:8, evolveLevel:16, catchRate:45, expYield:64, rarity:"starter",
    desc:"A little plant seedling that walks on root-legs. Very curious and brave." },

  8: { id:8, name:"Thornback",   emoji:"🦕", types:["Grass"],
    base:{hp:57,atk:68,def:63,spa:75,spd:74,spe:70},
    learnset:[[1,"vine_whip"],[2,"razor_leaf"],[3,"seed_bomb"],[4,"tackle"],[5,"sleep_powder"],[16,"swords_dance"],[24,"energy_ball"],[30,"canopy_crash"],[35,"petal_blitz"],[44,"verdant_surge"],[6,"spore_burst"],[33,"recover"]],
    evolveTo:9, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A thorny dinosaur with bark-like skin. Each spine is razor sharp." },

  9: { id:9, name:"Bloomlord",   emoji:"🌸", types:["Grass","Fairy"],
    base:{hp:82,atk:75,def:80,spa:101,spd:110,spe:84},
    learnset:[[1,"seed_bomb"],[2,"energy_ball"],[3,"vine_whip"],[4,"sleep_powder"],[40,"verdant_surge"],[41,"tail_whip"],[44,"fairy_wind"],[47,"petal_blitz"],[48,"scratch"],[52,"dazzling_gleam"],[56,"root_lance"],[60,"moonblast"],[5,"spore_burst"],[36,"celestial_wave"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"A majestic flower guardian. Its petals shimmer with magical energy." },

  // ===== ADDITIONAL FIRE =====
  10: { id:10, name:"Cinderling",  emoji:"🐛", types:["Fire","Bug"],
    base:{hp:54,atk:68,def:37,spa:43,spd:43,spe:48},
    learnset:[[1,"tackle",[20,"cinderwhirl"]],[1,"ember"],[8,"bug_bite"],[15,"flame_fang"],[17,"swords_dance"],[22,"x_scissor",[5,"scorch_veil"]],[29,"venom_drool"],[39,"stinger_volley"]],
    evolveTo:11, evolveLevel:18, catchRate:255, expYield:56, rarity:"common",
    desc:"A fire beetle larva. Leaves scorch marks wherever it walks." },

  11: { id:11, name:"Scorchwing",  emoji:"🦋", types:["Fire","Wind"],
    base:{hp:55,atk:81,def:52,spa:70,spd:60,spe:118},
    learnset:[[1,"ember"],[2,"bug_bite"],[3,"flame_fang"],[4,"scorch_veil"],[23,"battle_cry"],[28,"blazing_rush"],[33,"wing_attack"],[38,"downdraft"],[43,"air_slash"],[48,"magma_surge"],[53,"heat_wave"],[58,"tempest_wrath"],[5,"embercloak"],[39,"inferno"]],
    evolveTo:null, evolveLevel:null, catchRate:75, expYield:158, rarity:"uncommon",
    desc:"A blazing moth that flies at incredible speed. Its wings radiate fierce heat." },

  12: { id:12, name:"Lavabull",    emoji:"🐂", types:["Fire"],
    base:{hp:67,atk:69,def:56,spa:52,spd:37,spe:43},
    learnset:[[1,"tackle",[22,"magma_surge"]],[1,"ember"],[12,"headbutt"],[19,"swords_dance"],[20,"flamethrower"],[30,"body_slam"],[35,"heat_wave"],[40,"fire_blast",[5,"scorch_veil"]],[3,"embercloak"],[31,"tail_whip"]],
    evolveTo:13, evolveLevel:22, catchRate:120, expYield:112, rarity:"common",
    desc:"A powerful bull with lava dripping from its hooves. Incredibly stubborn." },

  13: { id:13, name:"Magmacow",    emoji:"🐃", types:["Fire","Rock"],
    base:{hp:94,atk:111,def:97,spa:78,spd:64,spe:63},
    learnset:[[1,"headbutt"],[2,"magma_surge"],[3,"ember"],[4,"flamethrower"],[5,"scorch_veil"],[30,"battle_cry"],[32,"heat_wave"],[37,"fire_blast"],[38,"stalactite_drop"],[46,"rock_slide"],[54,"stone_edge"],[62,"inferno"],[6,"embercloak"],[42,"quarry_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:235, rarity:"uncommon",
    desc:"A volcanic beast covered in hardened magma. Nothing can stop its charge." },

  14: { id:14, name:"Emberworm",   emoji:"🐍", types:["Fire"],
    base:{hp:41,atk:53,def:46,spa:59,spd:45,spe:47},
    learnset:[[1,"tackle",[20,"cinderwhirl"]],[1,"ember"],[9,"quick_attack"],[14,"leer"],[17,"flamethrower",[5,"scorch_veil"]],[24,"vital_pulse"],[32,"ashfall"],[40,"fire_blast"],[3,"embercloak"],[31,"tail_whip"]],
    evolveTo:15, evolveLevel:20, catchRate:200, expYield:65, rarity:"common",
    desc:"A small worm that breathes tiny flames. Very shy and avoids conflict." },

  15: { id:15, name:"Flamewyrm",   emoji:"🐉", types:["Fire","Dragon"],
    base:{hp:70,atk:89,def:61,spa:93,spd:75,spe:81},
    learnset:[[1,"ember"],[2,"flamethrower"],[3,"cinderwhirl"],[4,"scorch_veil"],[21,"vital_pulse"],[26,"char_dance"],[32,"dragon_breath"],[38,"dragon_claw"],[44,"heat_wave"],[50,"inferno"],[56,"outrage"],[62,"solar_flare"],[5,"embercloak"],[41,"dragon_rush"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:198, rarity:"uncommon",
    desc:"A serpentine fire dragon. Coils around prey before unleashing flame." },

  // ===== ADDITIONAL WATER =====
  16: { id:16, name:"Bubblecrab",  emoji:"🦀", types:["Water"],
    base:{hp:59,atk:66,def:78,spa:43,spd:63,spe:34},
    learnset:[[1,"scratch",[22,"coral_barrage"]],[1,"water_gun"],[10,"bubble_beam"],[18,"harden"],[20,"vital_pulse"],[26,"aqua_tail"],[34,"surf",[5,"tidecaller"]],[36,"hydro_pump"],[3,"deepwater_hymn"],[31,"leer"]],
    evolveTo:17, evolveLevel:20, catchRate:190, expYield:71, rarity:"common",
    desc:"A crab that blows iridescent bubbles. Very territorial near shorelines." },

  17: { id:17, name:"Waveclaw",    emoji:"🦞", types:["Water","Rock"],
    base:{hp:65,atk:88,def:106,spa:59,spd:68,spe:74},
    learnset:[[1,"scratch"],[2,"water_gun"],[3,"tidecaller"],[23,"aqua_tail"],[27,"swords_dance"],[31,"surf"],[33,"hydro_pump"],[34,"stalactite_drop"],[41,"rock_slide"],[48,"crystal_lance"],[55,"tidal_crush"],[62,"stone_edge"],[4,"deepwater_hymn"],[42,"quarry_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:188, rarity:"uncommon",
    desc:"A massive sea claw with rock-hard shell. Few can match its raw strength." },

  18: { id:18, name:"Frosteel",    emoji:"🦭", types:["Ice","Water"],
    base:{hp:54,atk:56,def:64,spa:73,spd:75,spe:31},
    learnset:[[1,"tackle",[22,"frost_current"]],[1,"powder_snow"],[10,"water_gun"],[18,"ice_beam"],[20,"leer"],[26,"aqua_tail"],[34,"blizzard",[5,"permafrost"]],[36,"cryo_lance"],[3,"winter_shroud"],[31,"surf"]],
    evolveTo:19, evolveLevel:28, catchRate:120, expYield:91, rarity:"common",
    desc:"An adorable ice seal. Its smooth skin can withstand arctic temperatures." },

  19: { id:19, name:"Glaciaseal",  emoji:"🦭", types:["Ice","Water"],
    base:{hp:72,atk:60,def:80,spa:89,spd:90,spe:77},
    learnset:[[1,"powder_snow"],[2,"water_gun"],[3,"ice_beam"],[4,"permafrost"],[31,"blizzard"],[33,"harden"],[38,"abyssal_jet"],[43,"hoarfrost_bite"],[48,"icicle_crash"],[53,"surf"],[58,"glacial_tomb"],[63,"hydro_pump"],[5,"winter_shroud"],[41,"aqua_tail"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:217, rarity:"uncommon",
    desc:"A regal glacial seal. It can freeze oceans with a single breath." },

  20: { id:20, name:"Coralfish",   emoji:"🐠", types:["Water"],
    base:{hp:49,atk:34,def:58,spa:59,spd:52,spe:62},
    learnset:[[1,"tackle",[22,"coral_barrage"]],[1,"water_gun"],[9,"bubble_beam"],[16,"tail_whip"],[17,"sweet_kiss"],[25,"surf",[5,"tidecaller"]],[29,"vital_pulse"],[39,"aqua_tail"],[3,"deepwater_hymn"],[32,"leer"]],
    evolveTo:21, evolveLevel:25, catchRate:220, expYield:72, rarity:"common",
    desc:"A dazzling coral fish with rainbow fins. Lures prey with its bright colors." },

  21: { id:21, name:"Reefking",    emoji:"🐡", types:["Water"],
    base:{hp:66,atk:69,def:64,spa:100,spd:92,spe:70},
    learnset:[[1,"water_gun"],[2,"bubble_beam"],[3,"surf"],[4,"tidecaller"],[30,"growl"],[35,"harden"],[40,"quick_attack"],[45,"dazzling_gleam"],[50,"whirlpool_dive"],[55,"sea_serpent_strike"],[60,"moonblast"],[65,"hydro_pump"],[5,"deepwater_hymn"],[42,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:70, expYield:184, rarity:"uncommon",
    desc:"A majestic reef king with jewel-like scales. Commands schools of fish." },

  // ===== ADDITIONAL GRASS =====
  22: { id:22, name:"Mushrump",    emoji:"🍄", types:["Grass","Poison"],
    base:{hp:60,atk:58,def:57,spa:66,spd:70,spe:38},
    learnset:[[1,"tackle"],[1,"vine_whip"],[8,"poison_sting"],[16,"energy_ball"],[20,"leer"],[22,"spore_burst"],[24,"sludge_bomb"],[32,"sleep_powder",[5,"thornwall"]],[36,"seed_bomb"],[3,"mycelia_net"],[31,"leaf_blade"]],
    evolveTo:23, evolveLevel:25, catchRate:135, expYield:98, rarity:"common",
    desc:"A mushroom Lumo that releases paralyzing spores when threatened." },

  23: { id:23, name:"Sporeking",   emoji:"🍄", types:["Grass","Poison"],
    base:{hp:77,atk:87,def:85,spa:93,spd:73,spe:69},
    learnset:[[1,"energy_ball"],[2,"sludge_bomb"],[29,"sleep_powder"],[30,"tail_whip"],[33,"seed_bomb"],[35,"toxic"],[40,"scratch"],[45,"razor_leaf"],[50,"venoshock"],[55,"corrosion_fang"],[60,"petal_blitz"],[65,"verdant_surge"],[3,"spore_burst"],[42,"canopy_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:209, rarity:"uncommon",
    desc:"A spore king that commands an army of fungal creatures. Reeks of poison." },

  24: { id:24, name:"Fernwhip",    emoji:"🌿", types:["Grass"],
    base:{hp:39,atk:60,def:39,spa:52,spd:40,spe:86},
    learnset:[[1,"vine_whip",[20,"photon_leaf"]],[1,"leer"],[8,"razor_leaf"],[16,"seed_bomb"],[17,"recover"],[24,"energy_ball",[5,"sleep_powder"]],[29,"scratch"],[39,"canopy_crash"],[3,"spore_burst"],[32,"swords_dance"]],
    evolveTo:25, evolveLevel:22, catchRate:180, expYield:78, rarity:"common",
    desc:"A quick, vine-like snake that lashes with razor-edged leaves." },

  25: { id:25, name:"Rootstrider", emoji:"🌳", types:["Grass","Ground"],
    base:{hp:75,atk:85,def:80,spa:72,spd:75,spe:65},
    learnset:[[1,"razor_leaf"],[2,"seed_bomb"],[3,"sleep_powder"],[22,"energy_ball"],[27,"growl"],[32,"tackle"],[37,"sandstrike"],[42,"sand_geyser"],[47,"root_lance"],[52,"earth_power"],[57,"earthquake"],[62,"petal_blitz"],[4,"spore_burst"],[40,"scorched_earth"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:195, rarity:"uncommon",
    desc:"A root elemental that walks on massive tree roots. Ancient and powerful." },

  26: { id:26, name:"Seedpod",     emoji:"🫘", types:["Grass"],
    base:{hp:38,atk:41,def:49,spa:62,spd:55,spe:52},
    learnset:[[1,"tackle",[22,"spore_burst"]],[1,"vine_whip"],[10,"energy_ball"],[16,"leer"],[18,"sleep_powder"],[26,"seed_bomb",[5,"thornwall"]],[29,"scratch"],[39,"canopy_crash"]],
    evolveTo:27, evolveLevel:18, catchRate:255, expYield:58, rarity:"common",
    desc:"A living seed pod that rolls around. Harmless but quick to flee." },

  27: { id:27, name:"Bushbear",    emoji:"🐻", types:["Grass"],
    base:{hp:82,atk:94,def:71,spa:87,spd:73,spe:50},
    learnset:[[1,"tackle"],[2,"vine_whip"],[3,"leer"],[4,"energy_ball"],[5,"sleep_powder"],[23,"seed_bomb"],[27,"swords_dance"],[36,"canopy_crash"],[37,"quick_attack"],[45,"briar_lash"],[54,"body_slam"],[63,"petal_blitz"],[6,"spore_burst"],[43,"tail_whip"]],
    evolveTo:null, evolveLevel:null, catchRate:75, expYield:186, rarity:"uncommon",
    desc:"A bear covered in living vegetation. Gentle unless its forest is threatened." },

  // ===== ELECTRIC =====
  28: { id:28, name:"Sparklet",    emoji:"🐭", types:["Electric"],
    base:{hp:43,atk:47,def:36,spa:51,spd:39,spe:100},
    learnset:[[1,"scratch",[20,"volt_surge"]],[1,"thunder_shock"],[8,"quick_attack"],[16,"spark"],[22,"thunderbolt"],[29,"recover"],[30,"thunder_wave"],[38,"thunder",[5,"static_cage"]],[3,"charge_burst"],[32,"leer"]],
    evolveTo:29, evolveLevel:20, catchRate:190, expYield:82, rarity:"common",
    desc:"An electric mouse that crackles with static. Can shock with a touch." },

  29: { id:29, name:"Boltmane",    emoji:"🐴", types:["Electric"],
    base:{hp:51,atk:80,def:58,spa:81,spd:60,spe:130},
    learnset:[[1,"thunder_shock"],[2,"quick_attack"],[3,"spark"],[20,"thunderbolt"],[27,"thunder_wave"],[28,"growl"],[34,"harden"],[35,"thunder"],[41,"wild_tumble"],[48,"arc_flash"],[55,"plasma_strike"],[62,"body_slam"],[4,"static_cage"],[42,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:200, rarity:"uncommon",
    desc:"An electric horse that gallops faster than lightning. Its mane crackles." },

  30: { id:30, name:"Zapbug",      emoji:"🐞", types:["Electric","Bug"],
    base:{hp:34,atk:48,def:43,spa:50,spd:43,spe:94},
    learnset:[[1,"bug_bite",[22,"arc_flash"]],[1,"thunder_shock"],[10,"spark"],[18,"string_shot"],[20,"recover"],[26,"thunderbolt"],[34,"bug_buzz",[5,"thunder_wave"]],[36,"x_scissor"],[3,"static_cage"],[31,"cocoon_burst"]],
    evolveTo:31, evolveLevel:22, catchRate:200, expYield:74, rarity:"common",
    desc:"An electric beetle that emits charged buzzing sounds. Very energetic." },

  31: { id:31, name:"Thunderfly",  emoji:"🦟", types:["Electric","Bug"],
    base:{hp:69,atk:68,def:53,spa:91,spd:59,spe:97},
    learnset:[[1,"thunder_shock"],[2,"bug_bite"],[3,"thunder_wave"],[23,"thunderbolt"],[29,"tail_whip"],[31,"bug_buzz"],[33,"x_scissor"],[36,"scratch"],[43,"silk_bind"],[50,"swarm_dive"],[57,"volt_surge"],[64,"thunder"],[4,"static_cage"],[42,"mandible_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:75, expYield:180, rarity:"uncommon",
    desc:"A dragonfly of electricity. Moves so fast it leaves lightning trails behind." },

  32: { id:32, name:"Voltfin",     emoji:"🐟", types:["Electric","Water"],
    base:{hp:48,atk:59,def:51,spa:74,spd:57,spe:63},
    learnset:[[1,"water_gun",[22,"arc_flash"]],[1,"thunder_shock"],[12,"spark"],[19,"recover"],[20,"bubble_beam"],[28,"thunderbolt"],[35,"voltaic_fang"],[36,"surf",[5,"thunder_wave"]],[3,"static_cage"],[31,"ion_cannon"]],
    evolveTo:33, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"An electric fish that shocks prey in shallow water. Glows when excited." },

  33: { id:33, name:"Surgeeel",    emoji:"🐡", types:["Electric","Water"],
    base:{hp:68,atk:61,def:64,spa:99,spd:78,spe:96},
    learnset:[[1,"thunder_shock"],[2,"water_gun"],[3,"thunderbolt"],[4,"bubble_beam"],[5,"thunder_wave"],[32,"voltaic_fang"],[33,"surf"],[35,"tail_whip"],[42,"scratch"],[49,"thunder"],[56,"hydro_pump"],[63,"overcharge"],[6,"static_cage"],[43,"aqua_tail"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:205, rarity:"uncommon",
    desc:"A massive electric eel that can power a city with its discharge." },

  34: { id:34, name:"Stormchick",  emoji:"🐦", types:["Electric","Wind"],
    base:{hp:50,atk:44,def:39,spa:52,spd:55,spe:93},
    learnset:[[1,"gust",[20,"volt_surge"]],[1,"thunder_shock"],[10,"wing_attack"],[14,"growl"],[18,"thunderbolt"],[24,"tackle"],[26,"air_slash"],[33,"spark"],[34,"thunder",[5,"thunder_wave"]],[42,"cyclone_blade"],[3,"static_cage"],[32,"storm_surge"]],
    evolveTo:null, evolveLevel:null, catchRate:150, expYield:100, rarity:"common",
    desc:"A little bird of storms. Rides thunderclouds and harnesses lightning." },

  // ===== GROUND =====
  35: { id:35, name:"Dirtpup",     emoji:"🐶", types:["Ground"],
    base:{hp:61,atk:71,def:58,spa:40,spd:40,spe:68},
    learnset:[[1,"scratch",[22,"sandstrike"]],[1,"growl"],[8,"mud_shot"],[16,"headbutt"],[24,"earthquake"],[29,"tail_whip"],[32,"earth_power"],[40,"body_slam",[5,"dust_veil"]],[3,"clay_armor"],[31,"leer"]],
    evolveTo:36, evolveLevel:25, catchRate:160, expYield:88, rarity:"common",
    desc:"An earth puppy that loves to dig. Its powerful paws can tunnel through rock." },

  36: { id:36, name:"Terrahound",  emoji:"🐕", types:["Ground","Rock"],
    base:{hp:94,atk:100,def:93,spa:53,spd:64,spe:63},
    learnset:[[1,"mud_shot"],[2,"headbutt"],[3,"earthquake"],[4,"dust_veil"],[29,"earth_power"],[31,"harden"],[37,"body_slam"],[38,"stalactite_drop"],[43,"rock_slide"],[49,"crystal_lance"],[55,"fissure_slam"],[61,"stone_edge"],[5,"clay_armor"],[41,"magma_rock"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:218, rarity:"uncommon",
    desc:"A terrifying earth hound. Its bark triggers small tremors." },

  37: { id:37, name:"Sandscorp",   emoji:"🦂", types:["Ground","Poison"],
    base:{hp:53,atk:56,def:60,spa:57,spd:47,spe:76},
    learnset:[[1,"scratch",[22,"terra_spike"]],[1,"poison_sting"],[10,"mud_shot"],[18,"venoshock"],[26,"earthquake"],[30,"fissure_slam"],[34,"sludge_bomb"],[42,"toxic",[5,"dust_veil"]],[3,"clay_armor"],[32,"earth_power"]],
    evolveTo:38, evolveLevel:30, catchRate:100, expYield:95, rarity:"common",
    desc:"A desert scorpion with a venomous stinger. Buries itself in sand to ambush." },

  38: { id:38, name:"Venomscorp",  emoji:"🦂", types:["Ground","Poison"],
    base:{hp:64,atk:90,def:71,spa:77,spd:85,spe:88},
    learnset:[[1,"poison_sting"],[2,"fissure_slam"],[3,"mud_shot"],[4,"earthquake"],[5,"venoshock"],[6,"dust_veil"],[31,"sludge_bomb"],[38,"vital_pulse"],[39,"toxic"],[46,"miasma_cloud"],[54,"earth_power"],[62,"plague_burst"],[7,"clay_armor"],[42,"venom_lance"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:213, rarity:"uncommon",
    desc:"A great venom scorpion. Its tail sting causes hallucinations in victims." },

  39: { id:39, name:"Mudrake",     emoji:"🐊", types:["Ground","Water"],
    base:{hp:69,atk:60,def:59,spa:48,spd:52,spe:42},
    learnset:[[1,"scratch",[22,"sandstrike"]],[1,"mud_shot"],[10,"water_gun"],[18,"bubble_beam"],[20,"tail_whip"],[26,"earthquake"],[34,"surf",[5,"dust_veil"]],[36,"whirlpool_dive"],[3,"clay_armor"],[31,"sea_serpent_strike"]],
    evolveTo:40, evolveLevel:22, catchRate:140, expYield:88, rarity:"common",
    desc:"A mud-crawling amphibian. Slides through swamps with ease." },

  40: { id:40, name:"Siltbeast",   emoji:"🐊", types:["Ground","Water"],
    base:{hp:85,atk:89,def:77,spa:83,spd:78,spe:55},
    learnset:[[1,"mud_shot"],[2,"water_gun"],[3,"dust_veil"],[23,"earthquake"],[28,"battle_cry"],[31,"surf"],[34,"frost_current"],[40,"boulder_roll"],[46,"body_slam"],[52,"earth_power"],[58,"tidal_crush"],[64,"hydro_pump"],[4,"clay_armor"],[42,"aqua_tail"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A massive silt beast that haunts murky river deltas. Ancient and powerful." },

  // ===== WIND =====
  41: { id:41, name:"Breezekit",   emoji:"🐱", types:["Wind"],
    base:{hp:46,atk:43,def:37,spa:56,spd:45,spe:81},
    learnset:[[1,"scratch",[20,"cyclone_blade"]],[1,"gust"],[8,"quick_attack"],[16,"wing_attack"],[21,"harden"],[24,"air_slash"],[32,"hurricane",[5,"mistveil"]],[36,"thermal_dive"],[3,"zephyr_dance"],[31,"leer"]],
    evolveTo:42, evolveLevel:22, catchRate:200, expYield:70, rarity:"common",
    desc:"A light-footed wind kitten. Jumps and glides on invisible air currents." },

  42: { id:42, name:"Galemane",    emoji:"🦁", types:["Wind","Electric"],
    base:{hp:60,atk:84,def:53,spa:68,spd:74,spe:112},
    learnset:[[1,"gust"],[2,"wing_attack"],[3,"mistveil"],[22,"air_slash"],[28,"zephyr_dance"],[29,"hurricane"],[34,"vital_pulse"],[40,"thunder_shock"],[46,"arc_flash"],[52,"thunderbolt"],[58,"gale_cannon"],[64,"thunder"],[4,"vortex_trap"],[42,"storm_surge"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:210, rarity:"uncommon",
    desc:"A majestic wind lion whose mane crackles with electric charge during storms." },

  43: { id:43, name:"Draftfinch",  emoji:"🐦", types:["Wind","Normal"],
    base:{hp:50,atk:48,def:35,spa:50,spd:36,spe:87},
    learnset:[[1,"tackle",[20,"jetstream"]],[1,"gust"],[8,"quick_attack"],[16,"wing_attack"],[21,"harden"],[24,"air_slash"],[32,"body_slam",[5,"mistveil"]],[36,"instinct_slash"],[3,"zephyr_dance"],[31,"wild_tumble"]],
    evolveTo:44, evolveLevel:20, catchRate:230, expYield:65, rarity:"common",
    desc:"A common draft finch that rides air currents effortlessly." },

  44: { id:44, name:"Cyclobird",   emoji:"🦅", types:["Wind"],
    base:{hp:53,atk:82,def:58,spa:77,spd:61,spe:119},
    learnset:[[1,"gust"],[2,"wing_attack"],[3,"jetstream"],[4,"mistveil"],[21,"air_slash"],[27,"swords_dance"],[29,"body_slam"],[34,"scratch"],[41,"steel_wing"],[48,"skyfall"],[55,"hurricane"],[62,"tempest_wrath"],[5,"zephyr_dance"],[42,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:65, expYield:195, rarity:"uncommon",
    desc:"A great cyclone eagle. Causes miniature tornadoes with each wingbeat." },

  45: { id:45, name:"Cloudpuff",   emoji:"☁️", types:["Wind","Fairy"],
    base:{hp:54,atk:32,def:33,spa:76,spd:71,spe:67},
    learnset:[[1,"tackle",[22,"mistveil"]],[1,"gust"],[9,"fairy_wind"],[17,"sweet_kiss"],[20,"tail_whip"],[25,"air_slash"],[33,"moonblast",[5,"zephyr_dance"]],[36,"dazzling_gleam"],[3,"vortex_trap"],[31,"storm_surge"]],
    evolveTo:46, evolveLevel:25, catchRate:150, expYield:80, rarity:"common",
    desc:"A fluffy cloud puffball. It floats serenely but fights with surprising force." },

  46: { id:46, name:"Mistwalker",  emoji:"👻", types:["Wind","Dark"],
    base:{hp:70,atk:60,def:64,spa:93,spd:78,spe:90},
    learnset:[[1,"gust"],[2,"air_slash"],[3,"tackle"],[4,"mistveil"],[30,"growl"],[35,"shadowstep"],[40,"night_slash"],[45,"dark_pulse"],[50,"shadow_ball"],[55,"cyclone_blade"],[60,"nightmare_pulse"],[65,"hurricane"],[5,"zephyr_dance"],[42,"storm_surge"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:195, rarity:"uncommon",
    desc:"A ghost of mist that drifts at night. Its touch drains life energy." },

  // ===== ICE =====
  47: { id:47, name:"Frostpup",    emoji:"🐺", types:["Ice"],
    base:{hp:49,atk:54,def:51,spa:63,spd:47,spe:73},
    learnset:[[1,"scratch",[22,"glacial_shard"]],[1,"powder_snow"],[8,"quick_attack"],[16,"icicle_crash"],[24,"ice_beam"],[29,"recover"],[32,"ice_punch"],[40,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[31,"leer"]],
    evolveTo:48, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"An ice wolf pup with fur as white as fresh snow. Very loyal and fierce." },

  48: { id:48, name:"Blizzarhound",emoji:"🐺", types:["Ice"],
    base:{hp:81,atk:77,def:55,spa:73,spd:76,spe:83},
    learnset:[[1,"powder_snow"],[2,"quick_attack"],[3,"ice_beam"],[4,"icicle_crash"],[5,"scratch"],[6,"permafrost"],[28,"recover"],[29,"ice_punch"],[37,"blizzard"],[40,"hoarfrost_bite"],[52,"body_slam"],[64,"avalanche_drive"],[7,"winter_shroud"],[44,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:220, rarity:"uncommon",
    desc:"A blizzard hound that howls to summon snowstorms. Fearsome and fast." },

  49: { id:49, name:"Snowfluff",   emoji:"🐏", types:["Ice","Normal"],
    base:{hp:49,atk:49,def:55,spa:52,spd:64,spe:54},
    learnset:[[1,"tackle",[22,"permafrost"]],[1,"powder_snow"],[10,"harden"],[18,"ice_beam"],[20,"vital_pulse"],[26,"body_slam"],[34,"blizzard",[5,"winter_shroud"]],[36,"headbutt"],[3,"frostfire_veil"],[31,"glacial_shard"]],
    evolveTo:50, evolveLevel:24, catchRate:180, expYield:77, rarity:"common",
    desc:"A fluffy snow sheep. Its wool absorbs cold air and condenses it to ice." },

  50: { id:50, name:"Icecrystal",  emoji:"💎", types:["Ice"],
    base:{hp:66,atk:67,def:93,spa:92,spd:84,spe:52},
    learnset:[[1,"powder_snow"],[2,"winter_shroud"],[3,"harden"],[4,"vital_pulse"],[5,"ice_beam"],[6,"permafrost"],[31,"blizzard"],[33,"headbutt"],[34,"growl"],[44,"recover"],[54,"hoarfrost_bite"],[64,"icicle_crash"],[7,"frostfire_veil"],[43,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A crystalline ice being of pure frozen beauty. It never melts." },

  51: { id:51, name:"Glaciawing",  emoji:"🦢", types:["Ice","Wind"],
    base:{hp:54,atk:40,def:41,spa:68,spd:55,spe:98},
    learnset:[[1,"powder_snow",[22,"cryo_lance"]],[1,"gust"],[12,"wing_attack"],[20,"ice_beam"],[28,"air_slash"],[31,"glacial_tomb"],[36,"blizzard"],[44,"hurricane",[5,"permafrost"]],[3,"winter_shroud"],[33,"thermal_dive"]],
    evolveTo:52, evolveLevel:30, catchRate:100, expYield:95, rarity:"common",
    desc:"A graceful bird with ice-crystal wings. Leaves frost trails in the sky." },

  52: { id:52, name:"Polarex",     emoji:"🐻‍❄️", types:["Ice","Ground"],
    base:{hp:92,atk:101,def:89,spa:66,spd:79,spe:61},
    learnset:[[1,"powder_snow"],[2,"ice_beam"],[3,"permafrost"],[30,"glacial_tomb"],[33,"blizzard"],[35,"battle_cry"],[40,"scratch"],[45,"glacial_shard"],[50,"icicle_crash"],[55,"earth_power"],[60,"avalanche_drive"],[65,"earthquake"],[4,"winter_shroud"],[42,"sinkhole_maw"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:228, rarity:"uncommon",
    desc:"A massive polar bear Lumo. Can freeze the ground solid with its roar." },

  53: { id:53, name:"Sleetling",   emoji:"🌨️", types:["Ice","Water"],
    base:{hp:51,atk:39,def:49,spa:74,spd:64,spe:45},
    learnset:[[1,"tackle",[20,"frost_breath"]],[1,"water_gun"],[9,"powder_snow"],[14,"growl"],[17,"ice_beam"],[24,"scratch"],[25,"surf"],[33,"blizzard",[5,"permafrost"]],[34,"bubble_beam"],[42,"riptide_slam"],[3,"winter_shroud"],[32,"aqua_tail"]],
    evolveTo:null, evolveLevel:null, catchRate:180, expYield:78, rarity:"common",
    desc:"A sleet sprite that lives in cold mountain streams. Chills the air around it." },

  // ===== DARK =====
  54: { id:54, name:"Shadowpup",   emoji:"🐕", types:["Dark"],
    base:{hp:39,atk:56,def:44,spa:62,spd:39,spe:88},
    learnset:[[1,"scratch",[22,"shadowstep"]],[1,"bite"],[8,"quick_attack"],[16,"night_slash"],[24,"crunch"],[29,"recover"],[32,"dark_pulse"],[40,"shadow_ball",[5,"eclipse_shroud"]],[3,"dread_howl"],[31,"leer"]],
    evolveTo:55, evolveLevel:25, catchRate:150, expYield:88, rarity:"common",
    desc:"A shadow puppy that hides in darkness. Its eyes glow red at night." },

  55: { id:55, name:"Nighthound",  emoji:"🐕", types:["Dark"],
    base:{hp:73,atk:82,def:57,spa:75,spd:77,spe:81},
    learnset:[[1,"bite"],[2,"quick_attack"],[3,"crunch"],[4,"night_slash"],[5,"scratch"],[6,"eclipse_shroud"],[26,"recover"],[29,"dark_pulse"],[37,"shadow_ball"],[38,"nightmare_pulse"],[51,"body_slam"],[64,"void_rend"],[7,"dread_howl"],[44,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:208, rarity:"uncommon",
    desc:"A hound of the night. Moves silently and strikes from blind spots." },

  56: { id:56, name:"Voidbat",     emoji:"🦇", types:["Dark","Wind"],
    base:{hp:52,atk:47,def:34,spa:57,spd:51,spe:106},
    learnset:[[1,"bite",[22,"shadowstep"]],[1,"gust"],[9,"wing_attack"],[17,"dark_pulse"],[25,"air_slash"],[29,"soul_rend"],[33,"shadow_ball"],[41,"hurricane",[5,"eclipse_shroud"]],[3,"dread_howl"],[32,"void_rend"]],
    evolveTo:57, evolveLevel:28, catchRate:130, expYield:85, rarity:"common",
    desc:"A dark bat that absorbs light. Creates zones of absolute darkness." },

  57: { id:57, name:"Spectrewing", emoji:"🦇", types:["Dark","Wind"],
    base:{hp:53,atk:78,def:48,spa:102,spd:71,spe:115},
    learnset:[[1,"dark_pulse"],[2,"wing_attack"],[3,"air_slash"],[4,"shadowstep"],[5,"eclipse_shroud"],[30,"shadow_ball"],[35,"growl"],[38,"hurricane"],[42,"tackle"],[49,"night_slash"],[56,"nightmare_pulse"],[63,"cyclone_blade"],[6,"dread_howl"],[43,"void_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A spectral wing beast. Its mere passing through an area chills it completely." },

  58: { id:58, name:"Umbralisard", emoji:"🦎", types:["Dark","Poison"],
    base:{hp:51,atk:60,def:50,spa:60,spd:48,spe:62},
    learnset:[[1,"scratch",[22,"obsidian_fang"]],[1,"bite"],[10,"poison_sting"],[18,"night_slash"],[26,"sludge_bomb"],[34,"crunch"],[42,"dark_pulse"],[50,"toxic",[5,"eclipse_shroud"]],[3,"dread_howl"],[36,"blackout_bomb"]],
    evolveTo:59, evolveLevel:32, catchRate:90, expYield:98, rarity:"common",
    desc:"A dark lizard with venomous bite. Camouflages perfectly in shadows." },

  59: { id:59, name:"Phantomfang", emoji:"🐍", types:["Dark","Poison"],
    base:{hp:76,atk:95,def:72,spa:89,spd:73,spe:81},
    learnset:[[1,"bite"],[2,"eclipse_shroud"],[3,"poison_sting"],[4,"obsidian_fang"],[5,"sludge_bomb"],[32,"crunch"],[39,"dark_pulse"],[40,"harden"],[47,"toxic"],[48,"dread_howl"],[56,"venoshock"],[64,"void_rend"],[6,"dark_shroud"],[42,"blackout_bomb"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:218, rarity:"uncommon",
    desc:"A phantom serpent of darkness and venom. Said to haunt ancient ruins." },

  // ===== FAIRY =====
  60: { id:60, name:"Glowpup",     emoji:"🐶", types:["Fairy"],
    base:{hp:42,atk:35,def:50,spa:52,spd:57,spe:76},
    learnset:[[1,"tackle",[22,"pixie_bolt"]],[1,"fairy_wind"],[8,"sweet_kiss"],[16,"dazzling_gleam"],[20,"vital_pulse"],[24,"moonblast"],[32,"recover",[5,"stardust_veil"]],[36,"glitter_storm"],[3,"charm_bloom"],[31,"leer"]],
    evolveTo:61, evolveLevel:25, catchRate:190, expYield:78, rarity:"common",
    desc:"A glowing puppy surrounded by fairy light. Brings luck wherever it goes." },

  61: { id:61, name:"Luminehound", emoji:"🐕", types:["Fairy"],
    base:{hp:71,atk:67,def:68,spa:100,spd:90,spe:77},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"moonblast"],[4,"sweet_kiss"],[29,"recover"],[30,"tail_whip"],[35,"battle_cry"],[40,"quick_attack"],[45,"wish_spark"],[50,"moonveil"],[55,"celestial_wave"],[60,"psystrike"],[5,"stardust_veil"],[39,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:205, rarity:"uncommon",
    desc:"A luminous hound of fairy power. Its radiance can banish dark spirits." },

  62: { id:62, name:"Prismfly",    emoji:"🦋", types:["Fairy","Bug"],
    base:{hp:35,atk:44,def:33,spa:79,spd:71,spe:78},
    learnset:[[1,"fairy_wind",[22,"wish_spark"]],[1,"bug_bite"],[10,"sweet_kiss"],[18,"dazzling_gleam"],[20,"recover"],[26,"moonblast"],[34,"bug_buzz",[5,"stardust_veil"]],[36,"gossamer_lance"],[3,"charm_bloom"],[31,"cocoon_burst"]],
    evolveTo:63, evolveLevel:22, catchRate:160, expYield:82, rarity:"common",
    desc:"A prismatic butterfly that scatters rainbow dust. Hard to catch." },

  63: { id:63, name:"Radiantfly",  emoji:"🦋", types:["Fairy","Wind"],
    base:{hp:73,atk:55,def:60,spa:96,spd:88,spe:84},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"recover"],[4,"sweet_kiss"],[23,"moonblast"],[29,"gust"],[33,"gossamer_lance"],[36,"quick_attack"],[43,"air_slash"],[50,"moonveil"],[57,"glitter_storm"],[64,"hurricane"],[5,"stardust_veil"],[42,"thermal_dive"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:200, rarity:"uncommon",
    desc:"A radiant butterfly of pure fairy energy. Its wings shimmer with all colors." },

  64: { id:64, name:"Dawnsprite",  emoji:"✨", types:["Fairy","Psychic"],
    base:{hp:50,atk:48,def:54,spa:74,spd:61,spe:63},
    learnset:[[1,"fairy_wind",[22,"stardust_veil"]],[1,"confusion"],[10,"sweet_kiss"],[18,"psybeam"],[26,"dazzling_gleam"],[30,"neural_storm"],[34,"psychic_move"],[42,"moonblast",[5,"charm_bloom"]],[3,"aurora_veil"],[32,"glitter_storm"]],
    evolveTo:65, evolveLevel:32, catchRate:100, expYield:96, rarity:"common",
    desc:"A dawn spirit that appears at sunrise. Its psychic energy is immense." },

  65: { id:65, name:"Celestara",   emoji:"🌟", types:["Fairy","Psychic"],
    base:{hp:79,atk:66,def:79,spa:131,spd:105,spe:74},
    learnset:[[1,"dazzling_gleam"],[2,"sweet_kiss"],[32,"psychic_move"],[36,"recover"],[39,"moonblast"],[40,"calm_mind"],[44,"quick_attack"],[48,"wish_spark"],[52,"future_echo"],[56,"celestial_wave"],[60,"psystrike"],[64,"mind_shatter"],[3,"stardust_veil"],[38,"thought_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:248, rarity:"rare",
    desc:"A celestial being of fairy and psychic power. Claims to have come from the stars." },

  // ===== STEEL =====
  66: { id:66, name:"Ironpup",     emoji:"🤖", types:["Steel"],
    base:{hp:47,atk:60,def:72,spa:37,spd:45,spe:54},
    learnset:[[1,"scratch",[22,"alloy_edge"]],[1,"metal_claw"],[9,"harden"],[17,"flash_cannon"],[25,"steel_wing"],[29,"leer"],[33,"iron_tail"],[41,"body_slam",[5,"magnetize"]],[3,"ironskin"],[32,"tail_whip"]],
    evolveTo:67, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"A puppy encased in iron armor. Slow but incredibly tough." },

  67: { id:67, name:"Steelhound",  emoji:"🦾", types:["Steel"],
    base:{hp:80,atk:93,def:107,spa:65,spd:83,spe:30},
    learnset:[[1,"metal_claw"],[2,"flash_cannon"],[3,"steel_wing"],[4,"magnetize"],[28,"leer"],[30,"iron_tail"],[35,"battle_cry"],[38,"body_slam"],[42,"quick_attack"],[49,"rivet_barrage"],[56,"forge_strike"],[63,"tungsten_ram"],[5,"ironskin"],[43,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:225, rarity:"uncommon",
    desc:"A steel hound with titanium claws. Almost nothing can break its armor." },

  68: { id:68, name:"Gearbot",     emoji:"⚙️", types:["Steel","Electric"],
    base:{hp:48,atk:50,def:67,spa:52,spd:57,spe:54},
    learnset:[[1,"metal_claw",[22,"shrapnel_burst"]],[1,"thunder_shock"],[10,"flash_cannon"],[18,"spark"],[21,"recover"],[26,"thunderbolt"],[34,"flash_cannon"],[38,"plasma_strike"],[42,"thunder",[5,"magnetize"]],[3,"ironskin"],[32,"ball_lightning"]],
    evolveTo:69, evolveLevel:28, catchRate:100, expYield:95, rarity:"common",
    desc:"A mechanical gear-bot that runs on electric power. Loves to tinker." },

  69: { id:69, name:"Mecharon",    emoji:"🦿", types:["Steel","Electric"],
    base:{hp:67,atk:72,def:92,spa:94,spd:68,spe:62},
    learnset:[[1,"thunderbolt"],[2,"magnetize"],[31,"flash_cannon"],[32,"surge_field"],[36,"harden"],[39,"thunder"],[40,"rivet_barrage"],[44,"volt_surge"],[48,"iron_tail"],[52,"tungsten_ram"],[56,"overcharge"],[60,"hyper_beam"],[3,"ironskin"],[37,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:235, rarity:"uncommon",
    desc:"A mechanical warrior powered by electric cores. Feared on every battlefield." },

  70: { id:70, name:"Titanshell",  emoji:"🐢", types:["Steel","Rock"],
    base:{hp:98,atk:61,def:126,spa:59,spd:97,spe:30},
    learnset:[[1,"tackle",[25,"ironskin"]],[1,"rock_throw"],[12,"harden"],[20,"flash_cannon"],[24,"growl"],[28,"rock_slide"],[36,"iron_tail"],[44,"stone_edge"],[45,"temper_edge"],[52,"body_slam",[5,"magnetize"]],[3,"slag_shield"],[37,"crystal_lance"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:210, rarity:"uncommon",
    desc:"A colossal steel-rock turtle. Nigh indestructible but very slow." },

  // ===== POISON =====
  71: { id:71, name:"Toxitoad",    emoji:"🐸", types:["Poison"],
    base:{hp:67,atk:56,def:58,spa:71,spd:50,spe:49},
    learnset:[[1,"tackle",[22,"miasma_cloud"]],[1,"poison_sting"],[9,"bubble_beam"],[17,"sludge_bomb"],[20,"battle_cry"],[25,"toxic"],[33,"venoshock"],[36,"sludge_wave"],[41,"sludge_bomb",[5,"toxic_surge"]],[3,"toxin_bloom"],[31,"leer"]],
    evolveTo:72, evolveLevel:24, catchRate:150, expYield:88, rarity:"common",
    desc:"A toxic toad that drips with powerful venom. Warty and repulsive but deadly." },

  72: { id:72, name:"Venomtoad",   emoji:"🐸", types:["Poison","Water"],
    base:{hp:88,atk:72,def:65,spa:99,spd:80,spe:52},
    learnset:[[1,"poison_sting"],[2,"bubble_beam"],[3,"toxic_surge"],[24,"toxic"],[30,"venoshock"],[32,"tail_whip"],[33,"sludge_wave"],[38,"sludge_bomb"],[40,"scratch"],[48,"venom_lance"],[56,"surf"],[64,"hydro_pump"],[4,"toxin_bloom"],[43,"aqua_tail"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A venom toad of enormous size. Its croaking alone can poison the air." },

  73: { id:73, name:"Acidblob",    emoji:"🫧", types:["Poison"],
    base:{hp:61,atk:47,def:47,spa:75,spd:59,spe:43},
    learnset:[[1,"tackle",[22,"putrid_pulse"]],[1,"poison_sting"],[10,"sludge_bomb"],[18,"toxic"],[21,"vital_pulse"],[26,"venoshock"],[34,"recover"],[38,"sludge_wave"],[42,"sludge_bomb",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"leer"]],
    evolveTo:74, evolveLevel:26, catchRate:130, expYield:95, rarity:"common",
    desc:"A blob of acid that oozes across the ground. Dissolves things with its body." },

  74: { id:74, name:"Sludgebeast",  emoji:"🫧", types:["Poison","Ground"],
    base:{hp:98,atk:70,def:86,spa:110,spd:86,spe:30},
    learnset:[[1,"toxic"],[2,"tackle"],[3,"venoshock"],[4,"toxic_surge"],[32,"growl"],[35,"sludge_wave"],[38,"mud_shot"],[39,"sludge_bomb"],[44,"loam_leech"],[50,"terra_spike"],[56,"earth_power"],[62,"earthquake"],[5,"toxin_bloom"],[41,"magnitude"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:210, rarity:"uncommon",
    desc:"A sludge behemoth that poisons everything it touches. Its territory reeks." },

  75: { id:75, name:"Miasmafly",   emoji:"🦟", types:["Poison","Wind"],
    base:{hp:49,atk:53,def:30,spa:78,spd:64,spe:77},
    learnset:[[1,"poison_sting",[22,"acid_rain"]],[1,"gust"],[10,"sludge_bomb"],[16,"vital_pulse"],[18,"air_slash"],[26,"toxic"],[29,"miasma_cloud"],[34,"hurricane"],[40,"plague_burst"],[42,"venoshock",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"sludge_wave"]],
    evolveTo:null, evolveLevel:null, catchRate:100, expYield:130, rarity:"common",
    desc:"A miasma fly that leaves toxic trails in its wake. Spreads pestilence." },

  // ===== PSYCHIC =====
  76: { id:76, name:"Mindpup",     emoji:"🐩", types:["Psychic"],
    base:{hp:50,atk:34,def:39,spa:74,spd:72,spe:72},
    learnset:[[1,"tackle",[22,"mind_shatter"]],[1,"confusion"],[8,"quick_attack"],[16,"psybeam"],[24,"psychic_move"],[29,"leer"],[32,"calm_mind"],[40,"psystrike",[5,"prism_ward"]],[3,"mind_reader"],[31,"recover"]],
    evolveTo:77, evolveLevel:25, catchRate:165, expYield:86, rarity:"common",
    desc:"A psychic puppy that reads minds. Can predict attacks before they happen." },

  77: { id:77, name:"Psychound",   emoji:"🐩", types:["Psychic"],
    base:{hp:68,atk:58,def:54,spa:94,spd:93,spe:103},
    learnset:[[1,"confusion"],[2,"psybeam"],[3,"psychic_move"],[4,"prism_ward"],[29,"calm_mind"],[31,"growl"],[37,"psystrike"],[38,"battle_cry"],[43,"recover"],[49,"wild_tumble"],[55,"telepathic_slam"],[61,"thought_crush"],[5,"mind_reader"],[41,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:210, rarity:"uncommon",
    desc:"A psychic hound whose mind burns with power. Can levitate small objects." },

  78: { id:78, name:"Esperia",     emoji:"🔮", types:["Psychic","Fairy"],
    base:{hp:46,atk:51,def:57,spa:80,spd:79,spe:62},
    learnset:[[1,"confusion",[22,"insight_flare"]],[1,"fairy_wind"],[10,"psybeam"],[18,"dazzling_gleam"],[26,"psychic_move"],[34,"moonblast"],[42,"calm_mind"],[50,"psystrike",[5,"prism_ward"]],[3,"mind_reader"],[36,"glitter_storm"]],
    evolveTo:79, evolveLevel:32, catchRate:90, expYield:100, rarity:"common",
    desc:"A mystical esper being. Bridges the worlds of psychic and fairy magic." },

  79: { id:79, name:"Telepathy",   emoji:"🌀", types:["Psychic"],
    base:{hp:83,atk:62,def:59,spa:119,spd:98,spe:104},
    learnset:[[1,"psybeam"],[2,"psychic_move"],[3,"prism_ward"],[36,"harden"],[39,"calm_mind"],[40,"recover"],[44,"quick_attack"],[47,"psystrike"],[48,"telepathic_slam"],[52,"thought_crush"],[56,"temporal_rift"],[60,"hyper_beam"],[4,"mind_reader"],[35,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:245, rarity:"rare",
    desc:"A being of pure psychic energy. Communicates only by telepathy." },

  80: { id:80, name:"Dreamrift",   emoji:"💫", types:["Psychic","Dark"],
    base:{hp:75,atk:69,def:52,spa:110,spd:84,spe:74},
    learnset:[[1,"confusion",[25,"future_echo"]],[1,"bite"],[11,"psybeam"],[19,"dark_pulse"],[23,"swords_dance"],[27,"psychic_move"],[35,"shadow_ball"],[42,"nightmare_pulse"],[43,"night_slash"],[51,"psystrike",[5,"calm_mind"]],[3,"prism_ward"],[37,"void_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:70, expYield:185, rarity:"uncommon",
    desc:"A dreamrift that exists between sleep and waking. It draws power from nightmares." },

  81: { id:81, name:"Psydrake",    emoji:"🐲", types:["Psychic","Dragon"],
    base:{hp:75,atk:78,def:74,spa:102,spd:82,spe:85},
    learnset:[[1,"dragon_breath",[28,"mind_shatter"]],[1,"confusion"],[13,"psybeam"],[21,"dragon_claw"],[24,"swords_dance"],[29,"psychic_move"],[37,"dragon_pulse"],[44,"astral_rend"],[45,"psystrike"],[53,"outrage",[5,"calm_mind"]],[3,"prism_ward"],[38,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A psychic dragon that manipulates reality with its mind. Ancient and mysterious." },

  // ===== DRAGON =====
  82: { id:82, name:"Drakling",    emoji:"🐣", types:["Dragon"],
    base:{hp:47,atk:73,def:53,spa:63,spd:60,spe:30},
    learnset:[[1,"scratch",[22,"wyrm_strike"]],[1,"dragon_breath"],[12,"dragon_claw"],[20,"vital_pulse"],[22,"dragon_pulse"],[30,"dragon_dance"],[36,"cataclysm_breath"],[40,"outrage",[5,"draconic_roar"]],[3,"primordial_roar"],[31,"recover"]],
    evolveTo:83, evolveLevel:30, catchRate:45, expYield:91, rarity:"uncommon",
    desc:"A baby dragon hatchling. Clumsy but full of fiery determination." },

  83: { id:83, name:"Wyrmsire",    emoji:"🐲", types:["Dragon"],
    base:{hp:71,atk:102,def:72,spa:79,spd:65,spe:67},
    learnset:[[1,"dragon_breath"],[2,"dragon_claw"],[3,"dragon_pulse"],[4,"dragon_dance"],[5,"draconic_roar"],[33,"tail_whip"],[36,"battle_cry"],[37,"outrage"],[39,"wild_tumble"],[42,"drake_rush"],[45,"scale_storm"],[46,"hyper_beam"],[6,"primordial_roar"],[30,"recover"]],
    evolveTo:84, evolveLevel:55, catchRate:15, expYield:170, rarity:"rare",
    desc:"A powerful wyrm with tremendous strength. Known to destroy mountains." },

  84: { id:84, name:"Dragonlord",  emoji:"🐉", types:["Dragon","Fire"],
    base:{hp:86,atk:149,def:101,spa:101,spd:94,spe:66},
    learnset:[[1,"outrage"],[2,"dragon_pulse"],[3,"scale_storm"],[4,"hyper_beam"],[5,"dragon_dance"],[58,"char_dance"],[61,"growl"],[64,"harden"],[65,"flame_fang"],[66,"pyre_fang"],[67,"heat_wave"],[68,"inferno"],[69,"ancient_breath"],[70,"fire_blast"]],
    evolveTo:null, evolveLevel:null, catchRate:5, expYield:340, rarity:"legendary",
    desc:"The lord of all dragons. Its fire is hot enough to melt any metal." },

  85: { id:85, name:"Seadrake",    emoji:"🦭", types:["Water","Dragon"],
    base:{hp:71,atk:94,def:76,spa:93,spd:87,spe:83},
    learnset:[[1,"water_gun",[28,"eon_crash"]],[1,"dragon_breath"],[14,"surf"],[17,"harden"],[22,"dragon_claw"],[30,"hydro_pump"],[31,"coral_barrage"],[38,"dragon_pulse"],[43,"tidal_crush"],[46,"outrage",[5,"tidecaller"]],[3,"deepwater_hymn"],[34,"ocean_tempest"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:210, rarity:"uncommon",
    desc:"A sea dragon that rules the ocean floor. Massive and aquatic." },

  86: { id:86, name:"Stormwyrm",   emoji:"⚡", types:["Electric","Dragon"],
    base:{hp:68,atk:77,def:62,spa:102,spd:78,spe:103},
    learnset:[[1,"thunder_shock",[28,"wyrm_strike"]],[1,"dragon_breath"],[12,"thunderbolt"],[17,"harden"],[20,"dragon_claw"],[28,"thunder"],[30,"dynamo_whip"],[36,"dragon_pulse"],[42,"eon_crash"],[44,"outrage",[5,"thunder_wave"]],[3,"static_cage"],[33,"ion_cannon"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A dragon of lightning storms. Calls down thunder with each roar." },

  87: { id:87, name:"Crystaldrake",emoji:"💠", types:["Ice","Dragon"],
    base:{hp:73,atk:91,def:79,spa:105,spd:90,spe:74},
    learnset:[[1,"powder_snow",[28,"scale_storm"]],[1,"dragon_breath"],[13,"ice_beam"],[21,"dragon_claw"],[24,"recover"],[29,"blizzard"],[37,"dragon_pulse"],[44,"cryo_lance"],[45,"outrage"],[53,"ice_punch",[5,"permafrost"]],[3,"winter_shroud"],[38,"glacial_tomb"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A crystal dragon of ice. Its scales deflect nearly any attack." },

  // ===== NORMAL =====
  88: { id:88, name:"Furball",     emoji:"🐱", types:["Normal"],
    base:{hp:64,atk:55,def:43,spa:41,spd:48,spe:54},
    learnset:[[1,"tackle",[20,"momentum_rush"]],[1,"growl"],[8,"scratch"],[16,"quick_attack"],[24,"body_slam"],[29,"harden"],[32,"headbutt"],[40,"hyper_beam",[5,"tail_whip"]],[3,"leer"],[31,"endure_pulse"]],
    evolveTo:89, evolveLevel:20, catchRate:220, expYield:68, rarity:"common",
    desc:"An adorable fur ball. Incredibly soft but surprisingly tough in a fight." },

  89: { id:89, name:"Softpaws",    emoji:"🐈", types:["Normal"],
    base:{hp:71,atk:75,def:78,spa:55,spd:66,spe:92},
    learnset:[[1,"scratch"],[2,"quick_attack"],[3,"growl"],[21,"body_slam"],[26,"harden"],[29,"headbutt"],[30,"leer"],[37,"hyper_beam"],[38,"swords_dance"],[47,"vital_pulse"],[56,"instinct_slash"],[65,"night_slash"],[4,"tail_whip"],[44,"tackle"]],
    evolveTo:null, evolveLevel:null, catchRate:80, expYield:180, rarity:"common",
    desc:"A graceful cat with retractable steel-like claws. Nimble and quick." },

  90: { id:90, name:"Longear",     emoji:"🐰", types:["Normal"],
    base:{hp:43,atk:44,def:38,spa:38,spd:38,spe:78},
    learnset:[[1,"tackle",[20,"wild_tumble"]],[1,"tail_whip"],[8,"quick_attack"],[16,"headbutt"],[17,"recover"],[24,"body_slam",[5,"growl"]],[29,"harden"],[39,"vital_pulse"]],
    evolveTo:91, evolveLevel:18, catchRate:255, expYield:55, rarity:"common",
    desc:"A swift rabbit with huge ears. Can hear predators from far away." },

  91: { id:91, name:"Longbounce",  emoji:"🐇", types:["Normal"],
    base:{hp:78,atk:64,def:49,spa:61,spd:59,spe:107},
    learnset:[[1,"quick_attack"],[2,"headbutt"],[3,"tackle"],[4,"recover"],[5,"growl"],[18,"wild_tumble"],[21,"body_slam"],[27,"leer"],[36,"battle_cry"],[45,"swords_dance"],[54,"momentum_rush"],[63,"hyper_beam"],[6,"tail_whip"],[43,"scratch"]],
    evolveTo:null, evolveLevel:null, catchRate:100, expYield:165, rarity:"common",
    desc:"A super-quick bouncing rabbit. Few can outrun this energetic creature." },

  92: { id:92, name:"Roundbear",   emoji:"🐻", types:["Normal"],
    base:{hp:81,atk:67,def:62,spa:52,spd:41,spe:48},
    learnset:[[1,"tackle",[22,"battle_cry"]],[1,"growl"],[10,"headbutt"],[18,"body_slam"],[26,"swords_dance"],[30,"scratch"],[34,"hyper_beam"],[42,"recover",[5,"tail_whip"]],[3,"leer"],[32,"double_strike"]],
    evolveTo:93, evolveLevel:25, catchRate:140, expYield:98, rarity:"common",
    desc:"A roly-poly bear. Loves honey and naps. Surprisingly strong when angry." },

  93: { id:93, name:"Tubebear",    emoji:"🐻", types:["Normal"],
    base:{hp:113,atk:93,def:79,spa:75,spd:66,spe:58},
    learnset:[[1,"headbutt"],[2,"battle_cry"],[3,"body_slam"],[4,"tail_whip"],[5,"growl"],[6,"tackle"],[25,"swords_dance"],[31,"hyper_beam"],[38,"leer"],[39,"recover"],[51,"harden"],[64,"vital_pulse"],[7,"focus_roar"],[44,"wild_tumble"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:220, rarity:"uncommon",
    desc:"A tubby great bear of enormous power. Its hugs can crush boulders." },

  94: { id:94, name:"Pudgeling",   emoji:"🐦", types:["Normal","Wind"],
    base:{hp:60,atk:43,def:31,spa:54,spd:50,spe:64},
    learnset:[[1,"tackle",[22,"wild_tumble"]],[1,"gust"],[8,"quick_attack"],[14,"harden"],[16,"wing_attack"],[24,"air_slash"],[25,"vortex_trap"],[32,"body_slam",[5,"growl"]],[34,"instinct_slash"],[42,"skyfall"],[3,"tail_whip"],[33,"feral_swipe"]],
    evolveTo:null, evolveLevel:null, catchRate:200, expYield:74, rarity:"common",
    desc:"A pudgy bird that barely fits in trees. Better at fighting than flying." },

  95: { id:95, name:"Snuffle",     emoji:"🐷", types:["Normal"],
    base:{hp:65,atk:66,def:62,spa:42,spd:44,spe:30},
    learnset:[[1,"tackle",[22,"momentum_rush"]],[1,"growl"],[10,"headbutt"],[14,"recover"],[20,"body_slam"],[24,"battle_cry"],[30,"swords_dance"],[33,"scratch"],[40,"hyper_beam",[5,"tail_whip"]],[42,"wild_tumble"],[3,"leer"],[32,"quick_attack"]],
    evolveTo:null, evolveLevel:null, catchRate:180, expYield:80, rarity:"common",
    desc:"A snuffling pig Lumo that loves digging for truffles. Stubborn and cute." },

  // ===== ROCK =====
  96: { id:96, name:"Pebblepup",   emoji:"🪨", types:["Rock"],
    base:{hp:60,atk:63,def:73,spa:46,spd:31,spe:45},
    learnset:[[1,"tackle",[22,"obsidian_crash"]],[1,"rock_throw"],[8,"harden"],[16,"headbutt"],[24,"rock_slide"],[29,"tail_whip"],[32,"stone_edge"],[40,"body_slam",[5,"granite_wall"]],[3,"petrify_gaze"],[31,"growl"]],
    evolveTo:97, evolveLevel:25, catchRate:160, expYield:88, rarity:"common",
    desc:"A rock puppy with pebble-studded fur. Loves rolling into a ball." },

  97: { id:97, name:"Boulderhound",emoji:"🪨", types:["Rock","Ground"],
    base:{hp:82,atk:108,def:112,spa:50,spd:57,spe:69},
    learnset:[[1,"rock_throw"],[2,"headbutt"],[3,"harden"],[4,"rock_slide"],[5,"granite_wall"],[29,"stone_edge"],[33,"tremor_stomp"],[37,"body_slam"],[41,"earth_power"],[49,"crystal_lance"],[57,"landslide"],[65,"earthquake"],[6,"petrify_gaze"],[44,"magnitude"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:222, rarity:"uncommon",
    desc:"A boulder hound encrusted with stones. Can cause landslides by running." },

  98: { id:98, name:"Cragclaw",    emoji:"🦞", types:["Rock","Water"],
    base:{hp:71,atk:78,def:89,spa:52,spd:63,spe:68},
    learnset:[[1,"scratch",[25,"geode_burst"]],[1,"rock_throw"],[11,"water_gun"],[16,"swords_dance"],[19,"rock_slide"],[27,"aqua_tail"],[29,"sandstone_rush"],[35,"stone_edge"],[40,"sea_serpent_strike"],[43,"surf",[5,"granite_wall"]],[3,"petrify_gaze"],[33,"landslide"]],
    evolveTo:null, evolveLevel:null, catchRate:75, expYield:178, rarity:"uncommon",
    desc:"A crag claw crab that lives on rocky sea cliffs. Fiercely territorial." },

  99: { id:99, name:"Crystalrock",  emoji:"💎", types:["Rock","Ice"],
    base:{hp:70,atk:66,def:101,spa:77,spd:87,spe:38},
    learnset:[[1,"rock_throw",[25,"crystal_lance"]],[1,"powder_snow"],[12,"harden"],[17,"swords_dance"],[20,"rock_slide"],[28,"ice_beam"],[31,"stalactite_drop"],[36,"stone_edge"],[43,"icicle_crash"],[44,"blizzard",[5,"granite_wall"]],[3,"petrify_gaze"],[33,"quarry_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:80, expYield:185, rarity:"uncommon",
    desc:"A crystal of ice and stone. Formed under tremendous pressure underground." },

  // ===== BUG =====
  100: { id:100, name:"Caterpet",   emoji:"🐛", types:["Bug"],
    base:{hp:42,atk:30,def:35,spa:30,spd:30,spe:39},
    learnset:[[1,"tackle",[5,"silk_bind"]],[1,"string_shot"],[5,"bug_bite",[6,"chitin_guard"]],[13,"growl"],[20,"swords_dance"],[27,"scratch"],[34,"venom_drool"],[41,"mandible_crush"]],
    evolveTo:101, evolveLevel:7, catchRate:255, expYield:39, rarity:"common",
    desc:"A cute caterpillar. Harmless and curious, though it spins strong silk." },

  101: { id:101, name:"Cocooning",  emoji:"🫙", types:["Bug"],
    base:{hp:46,atk:30,def:58,spa:30,spd:30,spe:30},
    learnset:[[17,"harden"]],
    evolveTo:102, evolveLevel:10, catchRate:120, expYield:72, rarity:"common",
    desc:"A shimmering cocoon. Inside, something remarkable is taking shape." },

  102: { id:102, name:"Butterflight",emoji:"🦋", types:["Bug","Wind"],
    base:{hp:58,atk:39,def:53,spa:84,spd:75,spe:88},
    learnset:[[14,"leer"],[18,"string_shot"],[22,"gust"],[26,"scratch"],[30,"silk_bind"],[34,"sonic_buzz"],[38,"air_slash"],[42,"dazzling_gleam"],[46,"x_scissor"],[50,"bug_buzz"],[54,"stinger_volley"],[58,"hurricane"],[3,"chitin_guard"],[39,"cocoon_burst"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:170, rarity:"uncommon",
    desc:"A glorious butterfly of wind and beauty. Its wing patterns mesmerize foes." },

  103: { id:103, name:"Beetleback",  emoji:"🪲", types:["Bug","Rock"],
    base:{hp:61,atk:73,def:71,spa:43,spd:51,spe:30},
    learnset:[[1,"bug_bite",[22,"mandible_crush"]],[1,"rock_throw"],[10,"headbutt"],[18,"x_scissor"],[20,"leer"],[26,"rock_slide"],[34,"stone_edge",[5,"string_shot"]],[36,"swarm_dive"],[3,"chitin_guard"],[31,"magma_rock"]],
    evolveTo:104, evolveLevel:25, catchRate:130, expYield:95, rarity:"common",
    desc:"A heavily armored beetle. Its rock-hard shell is practically indestructible." },

  104: { id:104, name:"Hardbeetle",  emoji:"🪲", types:["Bug","Steel"],
    base:{hp:78,atk:110,def:90,spa:64,spd:69,spe:39},
    learnset:[[1,"x_scissor"],[2,"string_shot"],[25,"rock_slide"],[30,"harden"],[31,"stone_edge"],[33,"swarm_dive"],[35,"pheromone_rush"],[40,"flash_cannon"],[45,"bug_buzz"],[50,"stinger_volley"],[55,"iron_tail"],[60,"hyper_beam"],[3,"chitin_guard"],[39,"cocoon_burst"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A steel beetle of terrifying might. Its mandibles can cut through iron." },

  // ===== LEGENDARIES =====
  105: { id:105, name:"Tempestia",  emoji:"🌪️", types:["Wind","Electric"],
    base:{hp:102,atk:84,def:93,spa:125,spd:96,spe:100},
    learnset:[[1,"air_slash"],[1,"thunder_shock"],[7,"gust"],[14,"spark"],[21,"zephyr_dance"],[28,"thunderbolt"],[35,"downdraft"],[42,"hurricane"],[49,"squall_slash"],[56,"overcharge"],[63,"tempest_wrath"],[70,"gale_cannon"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Storm Bird. Said to control all weather in Lumoria." },

  106: { id:106, name:"Volcanox",   emoji:"🌋", types:["Fire","Rock"],
    base:{hp:113,atk:145,def:111,spa:102,spd:89,spe:50},
    learnset:[[1,"ember"],[1,"rock_throw"],[7,"flame_fang"],[14,"rock_slide"],[21,"magma_surge"],[28,"stone_edge"],[35,"ashfall"],[42,"flamethrower"],[49,"magma_rock"],[56,"fire_blast"],[63,"caldera_meltdown"],[70,"bedrock_slam"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Volcano Titan. Eruptions across Lumoria mark its awakening." },

  107: { id:107, name:"Abyssdrake", emoji:"🌊", types:["Water","Dark"],
    base:{hp:99,atk:102,def:85,spa:130,spd:92,spe:82},
    learnset:[[1,"water_gun"],[1,"bite"],[7,"bubble_beam"],[14,"crunch"],[21,"abyssal_jet"],[28,"dark_pulse"],[35,"surf"],[42,"abyssal_snare"],[49,"dragon_pulse"],[56,"soul_rend"],[63,"hydro_pump"],[70,"geyser_burst"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Abyss Drake. Lurks in the deepest ocean trenches." },

  // ===== NEW LUMOS IDs 108-167 =====

  // ===== ELECTRIC/ROCK =====
  108: { id:108, name:"Thunderock", emoji:"⚡", types:["Electric","Rock"],
    base:{hp:62,atk:68,def:75,spa:48,spd:55,spe:41},
    learnset:[[1,"rock_throw",[22,"arc_flash"]],[1,"thunder_shock"],[10,"spark"],[18,"rock_slide"],[20,"recover"],[26,"thunderbolt"],[34,"stone_edge",[5,"thunder_wave"]],[36,"volt_surge"],[3,"static_cage"],[31,"ball_lightning"]],
    evolveTo:128, evolveLevel:30, catchRate:130, expYield:96, rarity:"common",
    desc:"A rocky beetle crackling with stored lightning. Its shell acts as a living battery." },

  // ===== STEEL/DARK =====
  109: { id:109, name:"Scrapbat", emoji:"🦇", types:["Steel","Dark"],
    base:{hp:49,atk:51,def:69,spa:45,spd:57,spe:66},
    learnset:[[1,"bite",[20,"shadowstep"]],[1,"metal_claw"],[9,"wing_attack"],[17,"dark_pulse"],[21,"leer"],[25,"flash_cannon"],[33,"crunch",[5,"magnetize"]],[36,"shadow_ball"],[3,"ironskin"],[31,"smelt_crush"]],
    evolveTo:129, evolveLevel:28, catchRate:140, expYield:88, rarity:"common",
    desc:"A small bat with scrap-metal wings that screech on the wind. Lives in old ruins." },

  // ===== FIRE/GROUND =====
  110: { id:110, name:"Cindermole", emoji:"🐾", types:["Fire","Ground"],
    base:{hp:68,atk:70,def:59,spa:51,spd:43,spe:49},
    learnset:[[1,"ember",[22,"magma_surge"]],[1,"scratch"],[9,"mud_shot"],[17,"flame_fang"],[20,"leer"],[25,"earthquake"],[33,"flamethrower",[5,"scorch_veil"]],[36,"cinderwhirl"],[3,"embercloak"],[31,"wildfire_surge"]],
    evolveTo:130, evolveLevel:26, catchRate:150, expYield:92, rarity:"common",
    desc:"A fire mole that tunnels through volcanic rock. Its claws glow orange with heat." },

  // ===== FAIRY/GRASS =====
  111: { id:111, name:"Petalpuff", emoji:"🌸", types:["Fairy","Grass"],
    base:{hp:39,atk:35,def:40,spa:63,spd:65,spe:59},
    learnset:[[1,"tackle",[20,"stardust_veil"]],[1,"fairy_wind"],[8,"vine_whip"],[16,"dazzling_gleam"],[21,"leer"],[24,"razor_leaf"],[32,"moonblast",[5,"sweet_kiss"]],[36,"seed_bomb"],[3,"charm_bloom"],[31,"leaf_blade"]],
    evolveTo:131, evolveLevel:20, catchRate:220, expYield:70, rarity:"common",
    desc:"A puff of fairy pollen given form. It drifts wherever the breeze takes it." },

  // ===== NORMAL/GROUND =====
  112: { id:112, name:"Dustpaw", emoji:"🐾", types:["Normal","Ground"],
    base:{hp:47,atk:63,def:55,spa:46,spd:32,spe:64},
    learnset:[[1,"tackle",[22,"sandstrike"]],[1,"growl"],[8,"mud_shot"],[16,"quick_attack"],[20,"clay_armor"],[24,"headbutt"],[32,"earthquake",[5,"tail_whip"]],[36,"boulder_roll"],[3,"leer"],[31,"mud_bomb"]],
    evolveTo:132, evolveLevel:22, catchRate:180, expYield:78, rarity:"common",
    desc:"A sandy-furred critter that kicks up dust clouds when startled. Very skittish." },

  // ===== WATER/POISON =====
  113: { id:113, name:"Polykling", emoji:"🐙", types:["Water","Poison"],
    base:{hp:52,atk:50,def:55,spa:57,spd:52,spe:51},
    learnset:[[1,"water_gun",[22,"putrid_pulse"]],[1,"poison_sting"],[10,"bubble_beam"],[18,"sludge_bomb"],[20,"recover"],[26,"surf"],[34,"toxic",[5,"tidecaller"]],[36,"corrosion_fang"],[3,"deepwater_hymn"],[31,"sludge_wave"]],
    evolveTo:133, evolveLevel:28, catchRate:130, expYield:90, rarity:"common",
    desc:"A polypoid sea creature that releases clouds of inky venom to escape predators." },

  // ===== WATER/STEEL =====
  114: { id:114, name:"Coralgolem", emoji:"🪸", types:["Water","Steel"],
    base:{hp:88,atk:83,def:118,spa:71,spd:90,spe:30},
    learnset:[[1,"water_gun",[25,"ironskin"]],[1,"metal_claw"],[11,"harden"],[16,"swords_dance"],[19,"aqua_tail"],[27,"flash_cannon"],[29,"rivet_barrage"],[35,"surf"],[40,"tidal_crush"],[43,"iron_tail",[5,"tidecaller"]],[3,"deepwater_hymn"],[33,"smelt_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:80, expYield:185, rarity:"uncommon",
    desc:"A golem formed from centuries of compressed coral and sunken steel. Nearly indestructible." },

  // ===== WATER/WIND =====
  115: { id:115, name:"Tidalwing", emoji:"🐬", types:["Water","Wind"],
    base:{hp:73,atk:74,def:69,spa:86,spd:72,spe:84},
    learnset:[[1,"water_gun",[24,"tidal_crush"]],[1,"gust"],[12,"bubble_beam"],[20,"wing_attack"],[25,"swords_dance"],[28,"surf"],[36,"air_slash"],[44,"hydro_pump"],[45,"riptide_slam"],[52,"hurricane",[5,"tidecaller"]],[3,"deepwater_hymn"],[37,"storm_surge"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:192, rarity:"uncommon",
    desc:"A dolphin that leaps between ocean waves and sea winds. Its song calms storms." },

  // ===== WIND/PSYCHIC =====
  116: { id:116, name:"Zephyrling", emoji:"🌀", types:["Wind","Psychic"],
    base:{hp:43,atk:32,def:35,spa:69,spd:54,spe:95},
    learnset:[[1,"gust",[22,"mind_shatter"]],[1,"confusion"],[9,"quick_attack"],[17,"air_slash"],[25,"psybeam"],[29,"psystrike"],[33,"hurricane"],[41,"psychic_move",[5,"mistveil"]],[3,"zephyr_dance"],[32,"astral_rend"]],
    evolveTo:134, evolveLevel:32, catchRate:110, expYield:90, rarity:"common",
    desc:"A wisp of wind given a curious mind. Follows trainers to observe how they think." },

  // ===== WATER/FAIRY =====
  117: { id:117, name:"Pearlet", emoji:"🐚", types:["Water","Fairy"],
    base:{hp:36,atk:37,def:52,spa:69,spd:62,spe:57},
    learnset:[[1,"tackle",[22,"wish_spark"]],[1,"water_gun"],[8,"fairy_wind"],[16,"bubble_beam"],[20,"leer"],[24,"dazzling_gleam"],[32,"surf",[5,"tidecaller"]],[36,"riptide_slam"],[3,"deepwater_hymn"],[31,"moonblast"]],
    evolveTo:135, evolveLevel:24, catchRate:200, expYield:74, rarity:"common",
    desc:"A tiny shellfish encasing a fairy-touched pearl. Shimmers with a gentle inner light." },

  // ===== GRASS/DARK =====
  118: { id:118, name:"Thicketshade", emoji:"🌿", types:["Grass","Dark"],
    base:{hp:61,atk:62,def:48,spa:59,spd:54,spe:69},
    learnset:[[1,"vine_whip",[22,"root_lance"]],[1,"bite"],[10,"razor_leaf"],[18,"night_slash"],[26,"energy_ball"],[30,"grove_wrath"],[34,"crunch"],[42,"dark_pulse",[5,"sleep_powder"]],[3,"spore_burst"],[32,"void_rend"]],
    evolveTo:136, evolveLevel:30, catchRate:110, expYield:98, rarity:"common",
    desc:"A shadowy plant sprite that hides in dark undergrowth. Its thorns drip with shadow energy." },

  // ===== POISON/GRASS =====
  119: { id:119, name:"Bogthorn", emoji:"🌾", types:["Poison","Grass"],
    base:{hp:55,atk:56,def:53,spa:59,spd:48,spe:66},
    learnset:[[1,"poison_sting",[22,"miasma_cloud"]],[1,"vine_whip"],[10,"sludge_bomb"],[18,"razor_leaf"],[26,"toxic"],[30,"petal_blitz"],[34,"energy_ball"],[42,"venoshock",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"sludge_wave"]],
    evolveTo:137, evolveLevel:28, catchRate:120, expYield:94, rarity:"common",
    desc:"A bog plant with razor-edged thorns dripping toxic sap. Thrives in poisoned swamps." },

  // ===== DARK =====
  120: { id:120, name:"Wraithling", emoji:"👻", types:["Dark"],
    base:{hp:30,atk:38,def:31,spa:56,spd:59,spe:79},
    learnset:[[1,"bite"],[1,"leer"],[8,"quick_attack"],[16,"dark_pulse"],[20,"shadowstep"],[21,"vital_pulse"],[24,"crunch"],[32,"shadow_ball",[5,"eclipse_shroud"]],[36,"void_rend"],[3,"dread_howl"],[31,"recover"]],
    evolveTo:138, evolveLevel:26, catchRate:160, expYield:80, rarity:"common",
    desc:"A faint wraith of shadow energy. Haunts dark places and feeds on fearful emotions." },

  // ===== PSYCHIC/DARK =====
  121: { id:121, name:"Psyshade", emoji:"🔮", types:["Psychic","Dark"],
    base:{hp:41,atk:50,def:49,spa:78,spd:69,spe:61},
    learnset:[[1,"confusion",[22,"telepathic_slam"]],[1,"bite"],[10,"psybeam"],[18,"dark_pulse"],[26,"psychic_move"],[30,"neural_storm"],[34,"shadow_ball"],[42,"psystrike",[5,"calm_mind"]],[3,"prism_ward"],[32,"blackout_bomb"]],
    evolveTo:139, evolveLevel:34, catchRate:90, expYield:100, rarity:"common",
    desc:"A shade of psychic darkness. It exists half in reality and half in the mind's eye." },

  // ===== DARK/GRASS =====
  122: { id:122, name:"Gravemoss", emoji:"🌿", types:["Dark","Grass"],
    base:{hp:76,atk:72,def:79,spa:86,spd:74,spe:63},
    learnset:[[1,"bite",[24,"obsidian_fang"]],[1,"vine_whip"],[11,"night_slash"],[19,"razor_leaf"],[23,"recover"],[27,"crunch"],[35,"energy_ball"],[42,"nightmare_pulse"],[43,"dark_pulse"],[51,"shadow_ball",[5,"eclipse_shroud"]],[3,"dread_howl"],[37,"wicked_blow"]],
    evolveTo:null, evolveLevel:null, catchRate:75, expYield:175, rarity:"uncommon",
    desc:"An ancient mossy boulder animated by dark energy. Feeds on the light of living things." },

  // ===== BUG/FAIRY =====
  123: { id:123, name:"Silkweaver", emoji:"🕷️", types:["Bug","Fairy"],
    base:{hp:34,atk:52,def:63,spa:58,spd:49,spe:85},
    learnset:[[1,"string_shot",[22,"silk_bind"]],[1,"fairy_wind"],[9,"bug_bite"],[17,"dazzling_gleam"],[20,"recover"],[25,"x_scissor"],[33,"moonblast",[5,"chitin_guard"]],[36,"swarm_dive"],[3,"compound_glare"],[31,"bug_buzz"]],
    evolveTo:140, evolveLevel:26, catchRate:160, expYield:84, rarity:"common",
    desc:"A spider that weaves silk infused with fairy dust. Its webs shimmer like spun moonlight." },

  // ===== ICE/STEEL =====
  124: { id:124, name:"Frostblade", emoji:"🗡️", types:["Ice","Steel"],
    base:{hp:46,atk:73,def:66,spa:56,spd:52,spe:76},
    learnset:[[1,"powder_snow",[25,"cryo_lance"]],[1,"metal_claw"],[11,"ice_punch"],[19,"flash_cannon"],[27,"icicle_crash"],[30,"smelt_crush"],[35,"iron_tail"],[43,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[33,"forge_strike"]],
    evolveTo:141, evolveLevel:36, catchRate:90, expYield:110, rarity:"uncommon",
    desc:"A blade of living ice and metal. Keeps its edge forever sharp in the coldest conditions." },

  // ===== ICE/FAIRY =====
  125: { id:125, name:"Mirrorfish", emoji:"🐟", types:["Ice","Fairy"],
    base:{hp:51,atk:37,def:62,spa:73,spd:68,spe:51},
    learnset:[[1,"tackle",[22,"pixie_bolt"]],[1,"powder_snow"],[8,"fairy_wind"],[16,"ice_beam"],[24,"dazzling_gleam"],[29,"avalanche_drive"],[32,"moonblast"],[40,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[31,"subzero_slash"]],
    evolveTo:142, evolveLevel:28, catchRate:150, expYield:85, rarity:"common",
    desc:"A fish with scales like mirror-polished ice. Reflects attacks with its shimmering body." },

  // ===== ICE/DRAGON =====
  126: { id:126, name:"Lunaveil", emoji:"🌙", types:["Ice","Dragon"],
    base:{hp:63,atk:65,def:69,spa:79,spd:64,spe:59},
    learnset:[[1,"powder_snow",[24,"wyrm_strike"]],[1,"dragon_breath"],[12,"ice_beam"],[20,"dragon_claw"],[28,"icicle_crash"],[36,"dragon_pulse"],[44,"blizzard"],[52,"outrage",[5,"permafrost"]],[3,"winter_shroud"],[37,"scale_storm"]],
    evolveTo:143, evolveLevel:40, catchRate:60, expYield:115, rarity:"uncommon",
    desc:"A moonlit dragon of frost. Its scales glimmer with cold starlight on winter nights." },

  // ===== WATER/STEEL =====
  127: { id:127, name:"Rustleviathan", emoji:"🐋", types:["Water","Steel"],
    base:{hp:119,atk:99,def:114,spa:93,spd:95,spe:64},
    learnset:[[1,"surf",[1,"sea_serpent_strike"]],[1,"iron_tail"],[1,"aqua_tail"],[1,"flash_cannon"],[18,"growl"],[31,"tackle"],[44,"bubble_beam"],[55,"hydro_pump"],[58,"temper_edge"],[65,"hyper_beam",[5,"tidecaller"]],[3,"deepwater_hymn"],[41,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:15, expYield:280, rarity:"rare",
    desc:"A leviathan armored in barnacle-covered steel. Said to be older than the ocean floor itself." },

  // ===== EVOLUTIONS (108+ referenced above) =====

  128: { id:128, name:"Boltcrag", emoji:"🪨", types:["Electric","Rock"],
    base:{hp:71,atk:84,def:88,spa:69,spd:57,spe:76},
    learnset:[[1,"rock_slide"],[2,"thunderbolt"],[3,"spark"],[4,"thunder_wave"],[31,"stone_edge"],[33,"volt_surge"],[35,"vital_pulse"],[40,"geode_burst"],[45,"earthquake"],[50,"thunder"],[55,"overcharge"],[60,"hyper_beam"],[5,"static_cage"],[39,"wild_charge"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A towering boulder monster wreathed in crackling lightning. Its stomps cause earthquakes." },

  129: { id:129, name:"Ironwraith", emoji:"🦇", types:["Steel","Dark"],
    base:{hp:72,atk:88,def:90,spa:59,spd:73,spe:71},
    learnset:[[1,"flash_cannon"],[2,"dark_pulse"],[3,"magnetize"],[30,"crunch"],[33,"shadow_ball"],[34,"harden"],[38,"rivet_barrage"],[43,"steel_wing"],[48,"night_slash"],[53,"forge_strike"],[58,"void_rend"],[63,"iron_tail"],[4,"ironskin"],[41,"smelt_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"An iron-clad wraith bat. Its metallic screech disorients enemies from great distances." },

  130: { id:130, name:"Magmaborer", emoji:"🦔", types:["Fire","Ground"],
    base:{hp:87,atk:107,def:72,spa:69,spd:62,spe:57},
    learnset:[[1,"flame_fang"],[2,"mud_shot"],[3,"earthquake"],[4,"scorch_veil"],[30,"flamethrower"],[31,"battle_cry"],[36,"ashfall"],[41,"earth_power"],[46,"fissure_slam"],[51,"inferno"],[56,"fire_blast"],[61,"tectonic_slam"],[5,"embercloak"],[40,"scorched_earth"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:218, rarity:"uncommon",
    desc:"A lava-boring behemoth that carves tunnels with molten precision. Its spines erupt flame." },

  131: { id:131, name:"Bloomfae", emoji:"🌺", types:["Fairy","Grass"],
    base:{hp:68,atk:60,def:65,spa:101,spd:82,spe:89},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"vine_whip"],[4,"sweet_kiss"],[21,"razor_leaf"],[27,"tail_whip"],[29,"moonblast"],[34,"scratch"],[41,"moonveil"],[48,"celestial_wave"],[55,"energy_ball"],[62,"petal_blitz"],[5,"stardust_veil"],[42,"leaf_blade"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:195, rarity:"uncommon",
    desc:"A bloom fairy of extraordinary grace. Its petals carry healing magic on the breeze." },

  132: { id:132, name:"Sandmane", emoji:"🦁", types:["Normal","Ground"],
    base:{hp:81,atk:94,def:67,spa:50,spd:62,spe:105},
    learnset:[[1,"mud_shot"],[2,"growl"],[22,"headbutt"],[28,"vital_pulse"],[29,"earthquake"],[33,"boulder_roll"],[34,"swords_dance"],[40,"wild_tumble"],[46,"momentum_rush"],[52,"body_slam"],[58,"earth_power"],[64,"hyper_beam"],[3,"tail_whip"],[42,"loam_leech"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:200, rarity:"uncommon",
    desc:"A sand lion with a mane of hardened earth. Commands the desert winds." },

  133: { id:133, name:"Venomantis", emoji:"🦑", types:["Water","Poison"],
    base:{hp:77,atk:80,def:76,spa:108,spd:83,spe:53},
    learnset:[[1,"sludge_bomb"],[2,"surf"],[3,"tidecaller"],[31,"toxic"],[33,"corrosion_fang"],[34,"growl"],[38,"tackle"],[43,"blight_mist"],[48,"venoshock"],[53,"dark_pulse"],[58,"sludge_wave"],[63,"hydro_pump"],[4,"deepwater_hymn"],[41,"venom_lance"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:210, rarity:"uncommon",
    desc:"A venomous sea predator with eight toxic-tipped tentacles. Feared by all ocean life." },

  134: { id:134, name:"Cyclomind", emoji:"🌪️", types:["Wind","Psychic"],
    base:{hp:66,atk:57,def:69,spa:114,spd:88,spe:110},
    learnset:[[1,"air_slash"],[2,"psybeam"],[3,"psystrike"],[4,"mind_shatter"],[5,"mistveil"],[32,"hurricane"],[38,"psychic_move"],[39,"harden"],[44,"calm_mind"],[50,"insight_flare"],[56,"thought_crush"],[62,"hyper_beam"],[6,"zephyr_dance"],[41,"astral_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:240, rarity:"rare",
    desc:"A cyclone of pure psychic wind. Its thoughts create miniature tornadoes around it." },

  135: { id:135, name:"Naiadess", emoji:"🧜", types:["Water","Fairy"],
    base:{hp:65,atk:62,def:63,spa:110,spd:87,spe:103},
    learnset:[[1,"water_gun"],[2,"fairy_wind"],[3,"bubble_beam"],[4,"dazzling_gleam"],[5,"tidecaller"],[29,"surf"],[30,"tail_whip"],[36,"scratch"],[42,"moonveil"],[48,"aqua_tail"],[54,"moonblast"],[60,"hydro_pump"],[6,"deepwater_hymn"],[40,"sea_serpent_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:222, rarity:"rare",
    desc:"A sea nymph radiating both water and fairy energy. Said to protect lost sailors." },

  136: { id:136, name:"Umbravine", emoji:"🌑", types:["Grass","Dark"],
    base:{hp:76,atk:93,def:80,spa:92,spd:72,spe:56},
    learnset:[[1,"razor_leaf"],[2,"energy_ball"],[3,"night_slash"],[4,"sleep_powder"],[31,"crunch"],[35,"harden"],[39,"dark_pulse"],[40,"photon_leaf"],[45,"shadow_ball"],[50,"blackout_bomb"],[55,"void_rend"],[60,"petal_blitz"],[5,"spore_burst"],[38,"leaf_blade"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:218, rarity:"uncommon",
    desc:"A dark vine predator that ensnares prey in shadow-infused tendrils. Ancient and cunning." },

  137: { id:137, name:"Toxiflora", emoji:"🪷", types:["Poison","Grass"],
    base:{hp:78,atk:80,def:60,spa:102,spd:76,spe:54},
    learnset:[[1,"sludge_bomb"],[2,"toxic"],[3,"poison_sting"],[4,"toxic_surge"],[28,"petal_blitz"],[31,"energy_ball"],[35,"growl"],[39,"venoshock"],[42,"battle_cry"],[49,"photon_leaf"],[56,"venom_lance"],[63,"root_lance"],[5,"toxin_bloom"],[43,"leaf_blade"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:215, rarity:"uncommon",
    desc:"A carnivorous flower of potent venom. Its blooms lure in prey before injecting toxins." },

  138: { id:138, name:"Phantomere", emoji:"👻", types:["Dark","Psychic"],
    base:{hp:68,atk:68,def:54,spa:93,spd:83,spe:87},
    learnset:[[1,"dark_pulse"],[2,"eclipse_shroud"],[29,"shadow_ball"],[30,"growl"],[34,"tackle"],[38,"confusion"],[42,"dreamweave"],[46,"night_slash"],[50,"nightmare_pulse"],[54,"psychic_move"],[58,"blackout_bomb"],[62,"psystrike"],[3,"dread_howl"],[39,"astral_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:210, rarity:"uncommon",
    desc:"A phantom born from dark and psychic energies. Can read minds and project nightmares." },

  139: { id:139, name:"Voidmind", emoji:"🌀", types:["Psychic","Dark"],
    base:{hp:83,atk:77,def:72,spa:107,spd:89,spe:75},
    learnset:[[1,"psybeam"],[2,"dark_pulse"],[3,"psychic_move"],[4,"shadow_ball"],[5,"calm_mind"],[39,"psystrike"],[40,"battle_cry"],[44,"prism_ward"],[49,"obsidian_fang"],[54,"void_rend"],[59,"mind_shatter"],[64,"hyper_beam"],[6,"mind_reader"],[41,"thought_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:248, rarity:"rare",
    desc:"A void being of psychic and dark power. Consumes light and thought with equal ease." },

  140: { id:140, name:"Gossamerarch", emoji:"🕸️", types:["Bug","Fairy"],
    base:{hp:66,atk:64,def:73,spa:87,spd:82,spe:70},
    learnset:[[1,"dazzling_gleam"],[2,"x_scissor"],[3,"string_shot"],[30,"moonblast"],[31,"charm_bloom"],[34,"harden"],[38,"pheromone_rush"],[42,"wild_tumble"],[46,"gossamer_lance"],[50,"moonveil"],[54,"bug_buzz"],[58,"fae_requiem"],[4,"chitin_guard"],[37,"mandible_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:210, rarity:"uncommon",
    desc:"A radiant spider archon that spins webs that trap bad dreams. Revered as a good omen." },

  141: { id:141, name:"Glaciablade", emoji:"⚔️", types:["Ice","Steel"],
    base:{hp:69,atk:122,def:105,spa:78,spd:83,spe:79},
    learnset:[[1,"ice_punch"],[2,"flash_cannon"],[3,"icicle_crash"],[4,"iron_tail"],[5,"permafrost"],[40,"blizzard"],[41,"winter_shroud"],[44,"swords_dance"],[48,"glacial_shard"],[52,"steel_wing"],[56,"avalanche_drive"],[60,"hyper_beam"],[6,"frostfire_veil"],[37,"subzero_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:260, rarity:"rare",
    desc:"A legendary blade forged from glacier ice and pure ore. Its strikes freeze what they cut." },

  142: { id:142, name:"Prismice", emoji:"💠", types:["Ice","Fairy"],
    base:{hp:73,atk:69,def:92,spa:95,spd:100,spe:67},
    learnset:[[1,"ice_beam"],[2,"dazzling_gleam"],[3,"tackle"],[4,"permafrost"],[29,"moonblast"],[34,"stardust_veil"],[37,"blizzard"],[40,"growl"],[46,"wish_spark"],[52,"cryo_lance"],[58,"icicle_crash"],[64,"hyper_beam"],[5,"winter_shroud"],[42,"subzero_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:218, rarity:"rare",
    desc:"A prismatic ice being of refined fairy power. Its crystalline body bends light into rainbows." },

  143: { id:143, name:"Aurordrake", emoji:"🐉", types:["Ice","Dragon"],
    base:{hp:86,atk:106,def:96,spa:112,spd:85,spe:78},
    learnset:[[1,"ice_beam"],[2,"dragon_pulse"],[3,"icicle_crash"],[4,"permafrost"],[41,"blizzard"],[44,"swords_dance"],[48,"dragon_dance"],[49,"outrage"],[52,"glacial_shard"],[56,"avalanche_drive"],[60,"ancient_breath"],[64,"hyper_beam"],[5,"winter_shroud"],[38,"drake_rush"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:285, rarity:"rare",
    desc:"A dragon cloaked in the aurora. Its roar scatters ribbons of colored ice across the sky." },

  // ===== ADDITIONAL COMMON/UNCOMMON/RARE LUMOS =====

  // ===== FIRE/PSYCHIC =====
  144: { id:144, name:"Embermind", emoji:"🔥", types:["Fire","Psychic"],
    base:{hp:35,atk:41,def:37,spa:58,spd:56,spe:68},
    learnset:[[1,"ember",[20,"cinderwhirl"]],[1,"confusion"],[9,"psybeam"],[17,"flamethrower"],[21,"recover"],[25,"psychic_move"],[33,"fire_blast",[5,"scorch_veil"]],[36,"magma_surge"],[3,"embercloak"],[31,"inferno"]],
    evolveTo:145, evolveLevel:28, catchRate:150, expYield:88, rarity:"common",
    desc:"A psychic flame sprite. Its fire burns hotter when it concentrates its mind." },

  145: { id:145, name:"Pyraxion", emoji:"🧠", types:["Fire","Psychic"],
    base:{hp:68,atk:64,def:68,spa:103,spd:81,spe:98},
    learnset:[[1,"flamethrower"],[2,"psychic_move"],[3,"scorch_veil"],[30,"fire_blast"],[32,"battle_cry"],[36,"calm_mind"],[40,"dreamweave"],[44,"heat_wave"],[48,"psystrike"],[52,"mind_shatter"],[56,"inferno"],[60,"solar_flare"],[4,"embercloak"],[38,"thought_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:235, rarity:"rare",
    desc:"A psychic fire sage. Projects visions of infernos to terrify foes before striking." },

  // ===== GRASS/ELECTRIC =====
  146: { id:146, name:"Sprigvolt", emoji:"🌱", types:["Grass","Electric"],
    base:{hp:40,atk:63,def:39,spa:60,spd:54,spe:59},
    learnset:[[1,"vine_whip",[22,"volt_surge"]],[1,"thunder_shock"],[8,"razor_leaf"],[16,"spark"],[20,"recover"],[24,"energy_ball"],[32,"thunderbolt",[5,"sleep_powder"]],[36,"plasma_strike"],[3,"spore_burst"],[31,"petal_blitz"]],
    evolveTo:147, evolveLevel:22, catchRate:190, expYield:78, rarity:"common",
    desc:"A sprout crackling with static electricity. Charges itself by photosynthesizing lightning." },

  147: { id:147, name:"Voltforest", emoji:"🌳", types:["Grass","Electric"],
    base:{hp:71,atk:78,def:68,spa:97,spd:77,spe:64},
    learnset:[[1,"razor_leaf"],[2,"recover"],[3,"vine_whip"],[4,"volt_surge"],[5,"sleep_powder"],[22,"energy_ball"],[29,"thunderbolt"],[30,"swords_dance"],[38,"petal_blitz"],[46,"verdant_surge"],[54,"thunder"],[62,"hyper_beam"],[6,"spore_burst"],[42,"canopy_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:210, rarity:"uncommon",
    desc:"An ancient tree monster that stores electric charge in every leaf. Touch it and be zapped." },

  // ===== ROCK/DARK =====
  148: { id:148, name:"Shadowstone", emoji:"🪨", types:["Rock","Dark"],
    base:{hp:73,atk:69,def:75,spa:48,spd:62,spe:32},
    learnset:[[1,"rock_throw",[22,"obsidian_crash"]],[1,"bite"],[10,"headbutt"],[18,"crunch"],[26,"rock_slide"],[30,"landslide"],[34,"dark_pulse"],[42,"stone_edge",[5,"granite_wall"]],[3,"petrify_gaze"],[32,"quarry_crush"]],
    evolveTo:149, evolveLevel:30, catchRate:130, expYield:97, rarity:"common",
    desc:"A rock monster that absorbs shadow energy. Moves imperceptibly slow but hits with shattering force." },

  149: { id:149, name:"Darkmonolith", emoji:"🗿", types:["Rock","Dark"],
    base:{hp:92,atk:100,def:99,spa:62,spd:70,spe:32},
    learnset:[[1,"rock_slide"],[2,"landslide"],[3,"crunch"],[4,"granite_wall"],[31,"dark_pulse"],[35,"battle_cry"],[39,"stone_edge"],[40,"abyssal_snare"],[45,"shadow_ball"],[50,"blackout_bomb"],[55,"earthquake"],[60,"hyper_beam"],[5,"petrify_gaze"],[38,"malice_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:230, rarity:"uncommon",
    desc:"A living monolith of darkened stone. Ancient civilizations worshipped it as a god of night." },

  // ===== POISON/BUG =====
  150: { id:150, name:"Toxigrub", emoji:"🐛", types:["Poison","Bug"],
    base:{hp:56,atk:37,def:55,spa:65,spd:52,spe:30},
    learnset:[[1,"poison_sting",[20,"venom_lance"]],[1,"string_shot"],[8,"bug_bite"],[16,"sludge_bomb"],[21,"recover"],[24,"x_scissor"],[32,"toxic",[5,"toxic_surge"]],[36,"sonic_buzz"],[3,"toxin_bloom"],[31,"mandible_crush"]],
    evolveTo:151, evolveLevel:20, catchRate:220, expYield:65, rarity:"common",
    desc:"A larva coated in toxic slime. Leaves a trail of venom wherever it crawls." },

  151: { id:151, name:"Venomoth", emoji:"🦋", types:["Poison","Bug"],
    base:{hp:67,atk:69,def:57,spa:92,spd:77,spe:88},
    learnset:[[1,"sludge_bomb"],[2,"toxic_surge"],[20,"recover"],[25,"quick_attack"],[29,"toxic"],[30,"nerve_agent"],[35,"venoshock"],[40,"air_slash"],[45,"putrid_pulse"],[50,"acid_rain"],[55,"cocoon_burst"],[60,"bug_buzz"],[3,"toxin_bloom"],[39,"leech_life"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A venomous moth that releases toxic scales on the wind. A cloud of them can fell a Lumos quickly." },

  // ===== STEEL/GROUND =====
  152: { id:152, name:"Orekit", emoji:"⚙️", types:["Steel","Ground"],
    base:{hp:60,atk:63,def:85,spa:30,spd:50,spe:35},
    learnset:[[1,"metal_claw",[22,"forge_strike"]],[1,"mud_shot"],[9,"harden"],[17,"flash_cannon"],[20,"tail_whip"],[25,"earthquake"],[33,"iron_tail",[5,"magnetize"]],[36,"boulder_roll"],[3,"ironskin"],[31,"scorched_earth"]],
    evolveTo:153, evolveLevel:26, catchRate:160, expYield:90, rarity:"common",
    desc:"A small ore elemental born in deep mine shafts. Tough as iron and twice as stubborn." },

  153: { id:153, name:"Forgebound", emoji:"🤖", types:["Steel","Ground"],
    base:{hp:95,atk:108,def:116,spa:52,spd:79,spe:30},
    learnset:[[1,"flash_cannon"],[2,"earthquake"],[3,"magnetize"],[30,"iron_tail"],[31,"battle_cry"],[34,"loam_leech"],[38,"rock_slide"],[42,"temper_edge"],[46,"body_slam"],[50,"earth_power"],[54,"tungsten_ram"],[58,"anvil_drop"],[4,"ironskin"],[37,"magnitude"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:222, rarity:"uncommon",
    desc:"A forged golem of steel and compressed earth. Was created to guard ancient mines." },

  // ===== DRAGON/GROUND =====
  154: { id:154, name:"Terraling", emoji:"🐣", types:["Dragon","Ground"],
    base:{hp:40,atk:59,def:63,spa:57,spd:42,spe:64},
    learnset:[[1,"scratch",[22,"terra_spike"]],[1,"dragon_breath"],[10,"mud_shot"],[18,"dragon_claw"],[20,"tail_whip"],[26,"earthquake"],[34,"dragon_pulse",[5,"dragon_dance"]],[36,"sinkhole_maw"],[3,"draconic_roar"],[31,"dragon_rush"]],
    evolveTo:155, evolveLevel:32, catchRate:80, expYield:94, rarity:"uncommon",
    desc:"A burrowing dragon hatchling. Digs deep tunnels and breathes sand-laden gusts." },

  155: { id:155, name:"Groundrake", emoji:"🐲", types:["Dragon","Ground"],
    base:{hp:86,atk:108,def:96,spa:94,spd:64,spe:69},
    learnset:[[1,"dragon_claw"],[2,"earthquake"],[3,"dragon_dance"],[32,"dragon_pulse"],[36,"battle_cry"],[40,"draconic_roar"],[44,"tremor_stomp"],[48,"earth_power"],[52,"eon_crash"],[56,"ancient_breath"],[60,"outrage"],[64,"hyper_beam"],[4,"primordial_roar"],[39,"scale_storm"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:260, rarity:"rare",
    desc:"A subterranean dragon that causes quakes with each step. Rules the deep underground." },

  // ===== NORMAL/PSYCHIC =====
  156: { id:156, name:"Oddpuff", emoji:"🐑", types:["Normal","Psychic"],
    base:{hp:49,atk:43,def:42,spa:63,spd:68,spe:58},
    learnset:[[1,"tackle",[22,"future_echo"]],[1,"confusion"],[9,"growl"],[17,"psybeam"],[25,"recover"],[29,"dreamweave"],[33,"psychic_move"],[41,"calm_mind",[5,"tail_whip"]],[3,"leer"],[32,"psycho_cut"]],
    evolveTo:157, evolveLevel:24, catchRate:180, expYield:78, rarity:"common",
    desc:"A woolly psychic creature that reads emotional auras. Very empathetic and gentle." },

  157: { id:157, name:"Dreamflock", emoji:"🐏", types:["Normal","Psychic"],
    base:{hp:78,atk:57,def:67,spa:96,spd:96,spe:71},
    learnset:[[1,"psybeam"],[2,"future_echo"],[3,"growl"],[24,"recover"],[30,"psychic_move"],[31,"vital_pulse"],[36,"wild_tumble"],[38,"calm_mind"],[42,"body_slam"],[48,"thought_crush"],[54,"psystrike"],[60,"hyper_beam"],[4,"tail_whip"],[40,"headbutt"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:200, rarity:"uncommon",
    desc:"A dreaming flock manifestation. Said to appear to sleeping trainers before a great trial." },

  // ===== BUG/GROUND =====
  158: { id:158, name:"Burrgrub", emoji:"🪲", types:["Bug","Ground"],
    base:{hp:62,atk:68,def:73,spa:34,spd:35,spe:45},
    learnset:[[1,"bug_bite",[22,"chitin_guard"]],[1,"mud_shot"],[10,"string_shot"],[18,"x_scissor"],[20,"leer"],[26,"earthquake"],[34,"bug_buzz",[5,"compound_glare"]],[36,"swarm_dive"],[3,"moth_dust"],[31,"magnitude"]],
    evolveTo:159, evolveLevel:24, catchRate:170, expYield:88, rarity:"common",
    desc:"A burrowing beetle that lives in dry earth. Its mandibles can crack solid rock." },

  159: { id:159, name:"Terrabeetle", emoji:"🪲", types:["Bug","Ground"],
    base:{hp:80,atk:94,def:89,spa:68,spd:58,spe:58},
    learnset:[[1,"x_scissor"],[2,"string_shot"],[24,"earthquake"],[29,"swords_dance"],[31,"bug_buzz"],[34,"sandstrike"],[39,"rock_slide"],[44,"mandible_crush"],[49,"cocoon_burst"],[54,"earth_power"],[59,"stone_edge"],[64,"hyper_beam"],[3,"chitin_guard"],[41,"drill_run"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"An armored ground beetle of incredible toughness. Plows through solid bedrock with ease." },

  // ===== WIND/ICE =====
  160: { id:160, name:"Chillgust", emoji:"🌬️", types:["Wind","Ice"],
    base:{hp:34,atk:45,def:36,spa:64,spd:47,spe:93},
    learnset:[[1,"gust"],[1,"powder_snow"],[8,"wing_attack"],[16,"permafrost"],[22,"cryo_lance"],[24,"air_slash"],[29,"gale_cannon"],[32,"ice_beam"],[40,"hurricane",[5,"mistveil"]],[3,"zephyr_dance"],[31,"storm_surge"]],
    evolveTo:161, evolveLevel:26, catchRate:180, expYield:78, rarity:"common",
    desc:"A gust of frozen air given form. Howls through mountain passes on the coldest nights." },

  161: { id:161, name:"Blizzardwing", emoji:"🦅", types:["Wind","Ice"],
    base:{hp:62,atk:66,def:61,spa:90,spd:70,spe:88},
    learnset:[[1,"wing_attack"],[2,"air_slash"],[3,"mistveil"],[29,"ice_beam"],[31,"battle_cry"],[36,"sleet_barrage"],[37,"hurricane"],[41,"cyclone_blade"],[46,"icicle_crash"],[51,"avalanche_drive"],[56,"blizzard"],[61,"hyper_beam"],[4,"zephyr_dance"],[40,"thermal_dive"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:215, rarity:"uncommon",
    desc:"A raptor of blizzards. Summons snowstorms with each powerful wingbeat." },

  // ===== FAIRY/STEEL =====
  162: { id:162, name:"Shimmerpin", emoji:"📌", types:["Fairy","Steel"],
    base:{hp:35,atk:46,def:71,spa:68,spd:52,spe:51},
    learnset:[[1,"fairy_wind",[22,"ironskin"]],[1,"metal_claw"],[9,"dazzling_gleam"],[17,"flash_cannon"],[20,"recover"],[25,"moonblast"],[33,"iron_tail",[5,"sweet_kiss"]],[36,"gossamer_lance"],[3,"stardust_veil"],[31,"glitter_storm"]],
    evolveTo:163, evolveLevel:26, catchRate:170, expYield:82, rarity:"common",
    desc:"A tiny fairy-knight made of living silver. Fiercely guards those it bonds with." },

  163: { id:163, name:"Gleamguard", emoji:"🛡️", types:["Fairy","Steel"],
    base:{hp:70,atk:67,def:107,spa:87,spd:95,spe:54},
    learnset:[[1,"dazzling_gleam"],[2,"flash_cannon"],[3,"moonblast"],[4,"metal_claw"],[5,"sweet_kiss"],[30,"iron_tail"],[32,"growl"],[38,"tackle"],[44,"steel_wing"],[50,"temper_edge"],[56,"moonveil"],[62,"hyper_beam"],[6,"stardust_veil"],[41,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:230, rarity:"rare",
    desc:"An armored fairy sentinel that never abandons its post. Its shield can repel any curse." },

  // ===== NEW LEGENDARIES =====
  164: { id:164, name:"Chronoveil", emoji:"⏳", types:["Psychic","Dragon"],
    base:{hp:97,atk:100,def:99,spa:132,spd:107,spe:83},
    learnset:[[1,"confusion"],[1,"dragon_breath"],[7,"psybeam"],[14,"calm_mind"],[21,"dragon_claw"],[28,"psychic_move"],[35,"dragon_pulse"],[42,"prism_ward"],[49,"astral_rend"],[56,"ancient_breath"],[63,"temporal_rift"],[70,"neural_storm"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Veil of Time. Said to exist at the crossing point of past and future." },

  165: { id:165, name:"Terranova", emoji:"🌍", types:["Ground","Grass"],
    base:{hp:103,atk:125,def:104,spa:92,spd:89,spe:75},
    learnset:[[1,"mud_shot"],[1,"vine_whip"],[7,"sandstrike"],[14,"razor_leaf"],[21,"earth_power"],[28,"seed_bomb"],[35,"clay_armor"],[42,"briar_lash"],[49,"earthquake"],[56,"grove_wrath"],[63,"worldseed_quake"],[70,"verdant_surge"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Spirit of the Land. Every continent in Lumoria trembles at its footfall." },

  166: { id:166, name:"Voidstar", emoji:"🌌", types:["Dark","Fairy"],
    base:{hp:95,atk:93,def:89,spa:131,spd:113,spe:88},
    learnset:[[1,"fairy_wind"],[1,"bite"],[7,"dark_pulse"],[14,"dazzling_gleam"],[21,"eclipse_shroud"],[28,"moonblast"],[35,"abyssal_snare"],[42,"shadow_ball"],[49,"dread_howl"],[56,"glitter_storm"],[63,"soul_rend"],[70,"fae_requiem"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Void Star. A being of absolute darkness ringed by fairy light. Where it passes, stars blink out." },

  167: { id:167, name:"Stormforged", emoji:"⚡", types:["Steel","Electric"],
    base:{hp:91,atk:120,def:108,spa:103,spd:84,spe:93},
    learnset:[[1,"metal_claw"],[1,"thunder_shock"],[7,"spark"],[14,"steel_wing"],[21,"magnetize"],[28,"thunderbolt"],[35,"flash_cannon"],[42,"forge_strike"],[49,"iron_tail"],[56,"ball_lightning"],[63,"anvil_drop"],[70,"thunder"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Stormforged. Born in the heart of the greatest storm ever recorded. Lightning is its heartbeat." }
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
    desc:"A dense forest teeming with Bug and Grass type Lumos.",
    connections:["ashford","tidewatch","lumoria_jungle"],
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
    connections:["route2","route3","deep_trench"],
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
    connections:["route3","route4","volcano_core"],
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
    connections:["route4","route5","storm_plateau"],
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
    connections:["route5","route6","storm_plateau","crystal_depths"],
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
    connections:["route6","route7","crystal_depths"],
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
    connections:["shadowmere","skyvault","mystic_forest"],
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
    connections:["route7","route8","mystic_forest"],
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
  },

  // ===== EXTRA AREAS =====
  lumoria_jungle: {
    id:"lumoria_jungle", name:"Lumoria Jungle", icon:"🌴", type:"route",
    desc:"A dense, humid jungle teeming with Grass, Poison and Bug types. Ancient ruins peek through the canopy.",
    connections:["route2","ancient_ruins"],
    wildMonsters:[
      {id:22, minLv:8, maxLv:12, rate:25},   // Mushrump
      {id:24, minLv:8, maxLv:12, rate:25},   // Fernwhip
      {id:62, minLv:9, maxLv:12, rate:20},   // Prismfly
      {id:71, minLv:9, maxLv:13, rate:20},   // Toxitoad
      {id:75, minLv:10, maxLv:13, rate:10}   // Miasmafly
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:56, y:68}
  },
  ancient_ruins: {
    id:"ancient_ruins", name:"Ancient Ruins", icon:"🏛️", type:"route",
    desc:"Crumbling temples from a forgotten civilization. Psychic and Dark energies fill the air. Team Umbra has been spotted here.",
    connections:["lumoria_jungle"],
    wildMonsters:[
      {id:64, minLv:12, maxLv:16, rate:25},  // Dawnsprite
      {id:80, minLv:12, maxLv:16, rate:25},  // Dreamrift
      {id:59, minLv:13, maxLv:17, rate:20},  // Phantomfang
      {id:78, minLv:14, maxLv:17, rate:20},  // Esperia
      {id:76, minLv:14, maxLv:17, rate:10}   // Mindpup
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:64, y:76},
    storyLocation:true
  },
  deep_trench: {
    id:"deep_trench", name:"Abyssal Trench", icon:"🌊", type:"route",
    desc:"The deepest part of Lumoria's ocean. Water and Dragon types of terrifying power lurk here. Team Umbra seeks something ancient in these depths.",
    connections:["tidewatch"],
    wildMonsters:[
      {id:85, minLv:18, maxLv:24, rate:25},  // Seadrake
      {id:33, minLv:18, maxLv:24, rate:25},  // Surgeeel
      {id:19, minLv:19, maxLv:24, rate:25},  // Glaciaseal
      {id:17, minLv:20, maxLv:25, rate:15},  // Waveclaw
      {id:107, minLv:30, maxLv:35, rate:10}  // Abyssdrake (rare!)
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:78, y:60},
    storyLocation:true
  },
  volcano_core: {
    id:"volcano_core", name:"Volcano Core", icon:"🌋", type:"route",
    desc:"The scorching heart of the volcano beneath Emberveil. Only the most fearless trainers descend here. Legendary energies stir within.",
    connections:["emberveil"],
    wildMonsters:[
      {id:15, minLv:22, maxLv:28, rate:25},  // Flamewyrm
      {id:13, minLv:22, maxLv:28, rate:25},  // Magmacow
      {id:38, minLv:23, maxLv:28, rate:20},  // Venomscorp
      {id:97, minLv:24, maxLv:29, rate:20},  // Boulderhound
      {id:106, minLv:35, maxLv:40, rate:10}  // Volcanox (rare!)
    ],
    hasGym:false, requiredBadges:3, mapPos:{x:82, y:42},
    storyLocation:true
  },
  storm_plateau: {
    id:"storm_plateau", name:"Storm Plateau", icon:"⛈️", type:"route",
    desc:"A high plateau perpetually wracked by storms. Electric and Dragon types are drawn to its crackling energy.",
    connections:["sparkmoor","frostpeak"],
    wildMonsters:[
      {id:86, minLv:28, maxLv:34, rate:25},  // Stormwyrm
      {id:42, minLv:28, maxLv:34, rate:25},  // Galemane
      {id:31, minLv:29, maxLv:34, rate:25},  // Thunderfly
      {id:44, minLv:29, maxLv:34, rate:15},  // Cyclobird
      {id:105, minLv:40, maxLv:45, rate:10}  // Tempestia (rare!)
    ],
    hasGym:false, requiredBadges:4, mapPos:{x:36, y:12},
    storyLocation:true
  },
  crystal_depths: {
    id:"crystal_depths", name:"Crystal Depths", icon:"💠", type:"route",
    desc:"An underground crystal cavern with walls of pure ice and steel. Rare mineral-type Lumos call this glittering place home.",
    connections:["frostpeak","shadowmere"],
    wildMonsters:[
      {id:87, minLv:34, maxLv:40, rate:25},  // Crystaldrake
      {id:99, minLv:34, maxLv:40, rate:25},  // Crystalrock
      {id:70, minLv:35, maxLv:40, rate:20},  // Titanshell
      {id:104, minLv:36, maxLv:41, rate:20}, // Hardbeetle
      {id:52, minLv:36, maxLv:41, rate:10}   // Polarex
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:10, y:28}
  },
  mystic_forest: {
    id:"mystic_forest", name:"Mystic Forest", icon:"🌌", type:"route",
    desc:"A forest where the boundary between worlds is thin. Fairy and Psychic creatures drift between the trees. Team Umbra's hideout is rumoured to be nearby.",
    connections:["route7","skyvault"],
    wildMonsters:[
      {id:65, minLv:46, maxLv:52, rate:25},  // Celestara
      {id:63, minLv:46, maxLv:52, rate:25},  // Radiantfly
      {id:79, minLv:47, maxLv:52, rate:20},  // Telepathy
      {id:46, minLv:48, maxLv:52, rate:20},  // Mistwalker
      {id:57, minLv:48, maxLv:52, rate:10}   // Spectrewing
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:25, y:62},
    storyLocation:true
  },
  umbra_base: {
    id:"umbra_base", name:"Team Umbra Base", icon:"☠️", type:"special",
    desc:"The hidden fortress of Team Umbra. Their leader, Commander Shade, awaits you here. This is your chance to stop their plan to awaken the three Legendaries.",
    connections:["mystic_forest"],
    wildMonsters:[
      {id:55, minLv:50, maxLv:55, rate:25},  // Nighthound
      {id:59, minLv:50, maxLv:55, rate:25},  // Phantomfang
      {id:57, minLv:51, maxLv:55, rate:25},  // Spectrewing
      {id:74, minLv:51, maxLv:55, rate:25}   // Sludgebeast
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
      {id:20, minLv:22, maxLv:28, rate:25},   // Coralfish
      {id:16, minLv:22, maxLv:28, rate:25},   // Bubblecrab
      {id:113, minLv:23, maxLv:28, rate:20},  // Polykling
      {id:71, minLv:24, maxLv:29, rate:20},   // Toxitoad
      {id:115, minLv:25, maxLv:30, rate:10}   // Tidalwing
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:84, y:72}
  },
  haunted_grove: {
    id:"haunted_grove", name:"Haunted Grove", icon:"👻", type:"route",
    desc:"A twisted forest where ancient trees whisper in the dark. Ghost-like shadows drift between the gnarled branches.",
    connections:["shadowmere","spirit_canyon"],
    wildMonsters:[
      {id:54, minLv:42, maxLv:47, rate:25},   // Shadowpup
      {id:56, minLv:42, maxLv:47, rate:25},   // Voidbat
      {id:120, minLv:43, maxLv:48, rate:20},  // Wraithling
      {id:58, minLv:44, maxLv:48, rate:20},   // Umbralisard
      {id:122, minLv:45, maxLv:50, rate:10}   // Gravemoss
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:8, y:42}
  },
  sky_harbor: {
    id:"sky_harbor", name:"Sky Harbor", icon:"⛵", type:"town",
    desc:"A floating dock tethered to the clouds. Wind traders and Psychic navigators pass through this breezy waystation.",
    connections:["skyvault","mystic_forest"],
    wildMonsters:[
      {id:41, minLv:48, maxLv:53, rate:25},   // Breezekit
      {id:45, minLv:48, maxLv:53, rate:25},   // Cloudpuff
      {id:116, minLv:49, maxLv:54, rate:20},  // Zephyrling
      {id:63, minLv:50, maxLv:54, rate:20},   // Radiantfly
      {id:43, minLv:49, maxLv:53, rate:10}    // Draftfinch
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:18, y:62}
  },
  thunder_cliffs: {
    id:"thunder_cliffs", name:"Thunder Cliffs", icon:"⚡", type:"route",
    desc:"Sheer cliff faces perpetually struck by lightning. Electric energy crackles through every rock and stone here.",
    connections:["sparkmoor","storm_plateau"],
    wildMonsters:[
      {id:28, minLv:28, maxLv:34, rate:25},   // Sparklet
      {id:34, minLv:28, maxLv:34, rate:25},   // Stormchick
      {id:108, minLv:29, maxLv:34, rate:20},  // Thunderock
      {id:31, minLv:30, maxLv:35, rate:20},   // Thunderfly
      {id:86, minLv:31, maxLv:36, rate:10}    // Stormwyrm
    ],
    hasGym:false, requiredBadges:4, mapPos:{x:60, y:16}
  },
  poison_swamp: {
    id:"poison_swamp", name:"Poison Swamp", icon:"🌿", type:"route",
    desc:"A festering bogland where toxic fumes hang low over the murky water. The air itself is thick with purple miasma.",
    connections:["route7","lumoria_jungle"],
    wildMonsters:[
      {id:71, minLv:44, maxLv:50, rate:25},   // Toxitoad
      {id:73, minLv:44, maxLv:50, rate:25},   // Acidblob
      {id:75, minLv:45, maxLv:50, rate:20},   // Miasmafly
      {id:119, minLv:46, maxLv:51, rate:20},  // Bogthorn
      {id:74, minLv:47, maxLv:52, rate:10}    // Sludgebeast
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:30, y:70}
  },
  sunken_temple: {
    id:"sunken_temple", name:"Sunken Temple", icon:"🏛️", type:"special",
    desc:"An ancient temple half-submerged beneath the ocean. Psychic inscriptions glow on the walls. Something powerful sleeps in the inner sanctum.",
    connections:["deep_trench","coral_reef"],
    wildMonsters:[
      {id:85, minLv:25, maxLv:32, rate:25},   // Seadrake
      {id:76, minLv:25, maxLv:32, rate:25},   // Mindpup
      {id:114, minLv:26, maxLv:33, rate:20},  // Coralgolem
      {id:78, minLv:27, maxLv:33, rate:15},   // Esperia
      {id:79, minLv:35, maxLv:40, rate:10}    // Telepathy (rare!)
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:88, y:52},
    storyLocation:true
  },
  iron_canyon: {
    id:"iron_canyon", name:"Iron Canyon", icon:"⛏️", type:"route",
    desc:"A deep canyon carved by centuries of volcanic flow. The walls glint with veins of metal ore. Steel and Ground types dominate this harsh terrain.",
    connections:["volcano_core","emberveil","lava_fields"],
    wildMonsters:[
      {id:66, minLv:25, maxLv:31, rate:25},   // Ironpup
      {id:96, minLv:25, maxLv:31, rate:25},   // Pebblepup
      {id:109, minLv:26, maxLv:32, rate:20},  // Scrapbat
      {id:68, minLv:27, maxLv:32, rate:20},   // Gearbot
      {id:70, minLv:28, maxLv:33, rate:10}    // Titanshell
    ],
    hasGym:false, requiredBadges:3, mapPos:{x:88, y:30}
  },
  fairy_meadow: {
    id:"fairy_meadow", name:"Fairy Meadow", icon:"🌸", type:"route",
    desc:"A gentle field carpeted in flowers where sunlight always shines. Fairy and Grass types play in the warm breeze.",
    connections:["seedvale","route7"],
    wildMonsters:[
      {id:60, minLv:4, maxLv:8, rate:25},     // Glowpup
      {id:26, minLv:4, maxLv:8, rate:25},     // Seedpod
      {id:62, minLv:5, maxLv:9, rate:25},     // Prismfly
      {id:111, minLv:5, maxLv:9, rate:25}     // Petalpuff
    ],
    hasGym:false, requiredBadges:0, mapPos:{x:8, y:68}
  },
  lunar_peak: {
    id:"lunar_peak", name:"Lunar Peak", icon:"🌙", type:"route",
    desc:"A remote mountain summit bathed in perpetual moonlight. Ice and Dragon types roam freely under the silver glow.",
    connections:["frostpeak","storm_plateau","crystal_spire"],
    wildMonsters:[
      {id:47, minLv:36, maxLv:42, rate:25},   // Frostpup
      {id:87, minLv:36, maxLv:42, rate:25},   // Crystaldrake
      {id:51, minLv:37, maxLv:43, rate:20},   // Glaciawing
      {id:126, minLv:38, maxLv:44, rate:20},  // Lunaveil
      {id:52, minLv:40, maxLv:46, rate:10}    // Polarex
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:20, y:10}
  },
  bug_forest: {
    id:"bug_forest", name:"Bug Forest", icon:"🐛", type:"route",
    desc:"A sprawling woodland where insect Lumos swarm in the undergrowth. The canopy buzzes with the sound of a thousand wings.",
    connections:["lumoria_jungle","ancient_ruins"],
    wildMonsters:[
      {id:100, minLv:10, maxLv:16, rate:25},  // Caterpet
      {id:103, minLv:10, maxLv:16, rate:25},  // Beetleback
      {id:30, minLv:11, maxLv:16, rate:20},   // Zapbug
      {id:123, minLv:12, maxLv:17, rate:20},  // Silkweaver
      {id:10, minLv:13, maxLv:18, rate:10}    // Cinderling
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:44, y:74}
  },
  mirror_lake: {
    id:"mirror_lake", name:"Mirror Lake", icon:"🪞", type:"route",
    desc:"A perfectly still alpine lake with a surface like polished glass. The reflected sky makes it impossible to tell up from down.",
    connections:["route5","storm_plateau"],
    wildMonsters:[
      {id:53, minLv:30, maxLv:36, rate:25},   // Sleetling
      {id:49, minLv:30, maxLv:36, rate:25},   // Snowfluff
      {id:60, minLv:31, maxLv:36, rate:20},   // Glowpup
      {id:125, minLv:32, maxLv:38, rate:20},  // Mirrorfish
      {id:19, minLv:34, maxLv:39, rate:10}    // Glaciaseal
    ],
    hasGym:false, requiredBadges:4, mapPos:{x:48, y:14}
  },
  lava_fields: {
    id:"lava_fields", name:"Lava Fields", icon:"🌋", type:"route",
    desc:"A smoldering expanse of hardened lava and glowing fissures. The ground cracks underfoot and fire vents belch superheated air.",
    connections:["volcano_core","iron_canyon"],
    wildMonsters:[
      {id:12, minLv:26, maxLv:32, rate:25},   // Lavabull
      {id:15, minLv:26, maxLv:32, rate:25},   // Flamewyrm
      {id:110, minLv:27, maxLv:33, rate:20},  // Cindermole
      {id:13, minLv:28, maxLv:34, rate:20},   // Magmacow
      {id:97, minLv:29, maxLv:34, rate:10}    // Boulderhound
    ],
    hasGym:false, requiredBadges:3, mapPos:{x:82, y:26}
  },
  spirit_canyon: {
    id:"spirit_canyon", name:"Spirit Canyon", icon:"🌀", type:"route",
    desc:"A deep chasm where psychic resonance amplifies every thought and memory. The walls seem to shift and breathe.",
    connections:["haunted_grove","fairy_meadow"],
    wildMonsters:[
      {id:76, minLv:44, maxLv:50, rate:25},   // Mindpup
      {id:80, minLv:44, maxLv:50, rate:25},   // Dreamrift
      {id:121, minLv:45, maxLv:51, rate:20},  // Psyshade
      {id:58, minLv:46, maxLv:51, rate:20},   // Umbralisard
      {id:77, minLv:47, maxLv:52, rate:10}    // Psychound
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:6, y:52}
  },
  reef_ruins: {
    id:"reef_ruins", name:"Reef Ruins", icon:"🏛️", type:"special",
    desc:"Ancient steel structures submerged beneath the sea, overgrown with coral. A forgotten civilization once thrived here beneath the waves.",
    connections:["coral_reef","ancient_ruins"],
    wildMonsters:[
      {id:17, minLv:28, maxLv:35, rate:25},   // Waveclaw
      {id:98, minLv:28, maxLv:35, rate:25},   // Cragclaw
      {id:114, minLv:29, maxLv:36, rate:20},  // Coralgolem
      {id:70, minLv:30, maxLv:36, rate:20},   // Titanshell
      {id:127, minLv:35, maxLv:42, rate:10}   // Rustleviathan
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:76, y:76},
    storyLocation:true
  },
  wind_bridge: {
    id:"wind_bridge", name:"Wind Bridge", icon:"🌬️", type:"route",
    desc:"A series of ancient stone arches bridging floating islands in the sky. Powerful updrafts make travel treacherous but the view is breathtaking.",
    connections:["route7","route8","skyvault"],
    wildMonsters:[
      {id:43, minLv:48, maxLv:54, rate:25},   // Draftfinch
      {id:41, minLv:48, maxLv:54, rate:25},   // Breezekit
      {id:44, minLv:49, maxLv:55, rate:20},   // Cyclobird
      {id:116, minLv:50, maxLv:55, rate:20},  // Zephyrling
      {id:42, minLv:51, maxLv:56, rate:10}    // Galemane
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:36, y:40}
  },
  crystal_spire: {
    id:"crystal_spire", name:"Crystal Spire", icon:"💎", type:"special",
    desc:"A towering spire of pure crystal ice and steel that catches the moonlight. Few trainers have ever climbed to its pinnacle.",
    connections:["crystal_depths","lunar_peak"],
    wildMonsters:[
      {id:50, minLv:38, maxLv:45, rate:25},   // Icecrystal
      {id:99, minLv:38, maxLv:45, rate:25},   // Crystalrock
      {id:67, minLv:39, maxLv:46, rate:20},   // Steelhound
      {id:124, minLv:40, maxLv:47, rate:20},  // Frostblade
      {id:104, minLv:42, maxLv:48, rate:10}   // Hardbeetle
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:16, y:18},
    storyLocation:true
  },
  dark_canyon: {
    id:"dark_canyon", name:"Dark Canyon", icon:"🌑", type:"route",
    desc:"A pitch-black gorge where no light penetrates. Dark type Lumos have claimed every shadowed corner, and even the rocks seem to absorb light.",
    connections:["spirit_canyon","umbra_base"],
    wildMonsters:[
      {id:55, minLv:50, maxLv:56, rate:25},   // Nighthound
      {id:57, minLv:50, maxLv:56, rate:25},   // Spectrewing
      {id:120, minLv:51, maxLv:57, rate:20},  // Wraithling
      {id:59, minLv:52, maxLv:57, rate:20},   // Phantomfang
      {id:122, minLv:53, maxLv:58, rate:10}   // Gravemoss
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:4, y:60}
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
    badge:"Forge Badge", badgeEmoji:"🔥",
    quote:"My fire burns hotter than any volcano! Can you withstand the heat?",
    winQuote:"Your strength is as intense as a raging wildfire. The Forge Badge is yours!",
    team:[
      {monsterId:14, level:25, moves:["ember","quick_attack","flamethrower","tackle"]},
      {monsterId:10, level:26, moves:["ember","bug_bite","flame_fang","x_scissor"]},
      {monsterId:12, level:28, moves:["ember","headbutt","flamethrower","body_slam"]}
    ]
  },
  zara: {
    id:"zara", name:"Leader Zara", emoji:"⚡", type:"Electric",
    badge:"Current Badge", badgeEmoji:"⚡",
    quote:"I'll shock you senseless! Electric types are unstoppable!",
    winQuote:"You're truly electrifying! The Current Badge is yours.",
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
    badge:"Foresight Badge", badgeEmoji:"🔮",
    quote:"I have foreseen your defeat. The future is already written.",
    winQuote:"Incredible. You have rewritten what I thought was fate. The Foresight Badge is yours.",
    team:[
      {monsterId:76, level:50, moves:["confusion","quick_attack","psybeam","recover"]},
      {monsterId:64, level:51, moves:["confusion","fairy_wind","psybeam","dazzling_gleam"]},
      {monsterId:78, level:54, moves:["psybeam","dazzling_gleam","psychic_move","calm_mind"]}
    ]
  },
  drake: {
    id:"drake", name:"Leader Drake", emoji:"🐉", type:"Dragon",
    badge:"Wyrm Badge", badgeEmoji:"🐉",
    quote:"Dragons are the apex of all Lumos. You cannot defeat their ancient power!",
    winQuote:"You have shown the heart of a true dragon master. The Wyrm Badge is yours!",
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
  revive:     { name:"Revive",      emoji:"💫", desc:"Revives a fainted monster to 50% HP.", catchMult:0, healAmt:0, type:"revive" },
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
  quickClaw:     { name:"Quick Claw",     emoji:"⚡", desc:"30% chance to move first each turn.",        type:"held", held:{ effect:"quickClaw" } }
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
  quickClaw: 0
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
      {monsterId:28, level:13, moves:["thunder_shock","quick_attack","scratch","growl"]},
      {monsterId:95, level:15, moves:["tackle","headbutt","growl","body_slam"]}
    ]
  },
  rival_2: {
    id:"rival_2", name:"Rival Marcus", emoji:"🧒",
    quote:"I heard about Team Umbra messing with the Ruins... but that's not my problem. MY problem is beating YOU!",
    winQuote:"Ugh! I need to train harder. Hey... be careful with Team Umbra. They're dangerous.",
    triggerBadges:3,
    team:[
      {monsterId:29, level:30, moves:["thunderbolt","spark","body_slam","thunder_wave"]},
      {monsterId:42, level:31, moves:["thunderbolt","wing_attack","air_slash","thunder"]},
      {monsterId:35, level:33, moves:["mud_shot","headbutt","earthquake","body_slam"]}
    ]
  },
  rival_3: {
    id:"rival_3", name:"Rival Marcus", emoji:"🧒",
    quote:"Team Umbra tried to recruit me, can you believe that? I told them to get lost. Now I'm going to prove my strength on YOU!",
    winQuote:"You're incredible. Look... I found this near the Umbra Base. Take it - you'll need it more than me. Stop them!",
    triggerBadges:6,
    reward:{ ultraOrb:3, superPotion:3 },
    team:[
      {monsterId:29, level:50, moves:["thunder","thunderbolt","dragon_dance","body_slam"]},
      {monsterId:81, level:51, moves:["psychic_move","dragon_pulse","confusion","psystrike"]},
      {monsterId:25, level:52, moves:["earthquake","energy_ball","petal_blitz","earth_power"]},
      {monsterId:69, level:54, moves:["flash_cannon","thunder","iron_tail","flash_cannon"]}
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
      {monsterId:54, level:14, moves:["bite","quick_attack","night_slash","scratch"]},
      {monsterId:56, level:16, moves:["bite","gust","dark_pulse","wing_attack"]}
    ]
  },
  umbra_grunt_2: {
    id:"umbra_grunt_2", name:"Umbra Grunt Morta", emoji:"🕶️",
    quote:"You dare enter the Abyssal Trench? Commander Shade has claimed these waters for Team Umbra!",
    winQuote:"The Abyssdrake... you won't stop us from finding it!",
    team:[
      {monsterId:57, level:22, moves:["dark_pulse","wing_attack","air_slash","shadow_ball"]},
      {monsterId:73, level:23, moves:["sludge_bomb","toxic","venoshock","recover"]},
      {monsterId:55, level:25, moves:["crunch","night_slash","dark_pulse","body_slam"]}
    ]
  },
  umbra_commander_kira: {
    id:"umbra_commander_kira", name:"Commander Kira", emoji:"😈",
    quote:"A child? Oh how entertaining. I am Kira, first commander of Team Umbra. The volcano's power will be OURS. Stand aside or be crushed!",
    winQuote:"Impossible... I was trained by Shade himself! How can a child... Our plan is bigger than you know. Volcanox WILL awaken!",
    team:[
      {monsterId:15, level:32, moves:["flamethrower","dragon_claw","heat_wave","dragon_breath"]},
      {monsterId:38, level:33, moves:["sludge_bomb","earthquake","toxic","venoshock"]},
      {monsterId:13, level:36, moves:["flamethrower","rock_slide","fire_blast","body_slam"]},
      {monsterId:97, level:38, moves:["earthquake","rock_slide","stone_edge","body_slam"]}
    ]
  },
  umbra_commander_rex_shadow: {
    id:"umbra_commander_rex_shadow", name:"Commander Vorn", emoji:"⚡",
    quote:"I am Vorn, second commander of Team Umbra. We have awakened Tempestia from the Storm Plateau. Nothing can stop our plan now!",
    winQuote:"You're more powerful than our intelligence suggested... But Commander Shade is still ahead of you. And Tempestia has been released!",
    team:[
      {monsterId:86, level:44, moves:["thunder","dragon_claw","dragon_pulse","dragon_breath"]},
      {monsterId:42, level:45, moves:["hurricane","thunderbolt","air_slash","thunder"]},
      {monsterId:57, level:47, moves:["shadow_ball","air_slash","hurricane","dark_pulse"]},
      {monsterId:69, level:49, moves:["flash_cannon","thunder","iron_tail","body_slam"]}
    ]
  },
  umbra_shade: {
    id:"umbra_shade", name:"Commander Shade", emoji:"🌑",
    quote:"So... you are the trainer who dismantled my commanders' plans. Impressive. But it ends HERE. I have awakened all three Legendaries — Tempestia, Volcanox, and Abyssdrake. With their power, Team Umbra will control all of Lumoria! You are too late, child!",
    winQuote:"Defeated... by a trainer so young... Perhaps I misjudged the power of a trainer's bond with their Lumos. The Legendaries have retreated. Lumoria is safe... for now. You have my... grudging respect.",
    reward:{ masterOrb:1, maxPotion:5 },
    team:[
      {monsterId:79, level:58, moves:["psystrike","psychic_move","calm_mind","recover"]},
      {monsterId:59, level:59, moves:["crunch","dark_pulse","toxic","venoshock"]},
      {monsterId:65, level:60, moves:["moonblast","psychic_move","dazzling_gleam","calm_mind"]},
      {monsterId:84, level:61, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]},
      {monsterId:105, level:62, moves:["hurricane","thunder","air_slash","dragon_dance"]},
      {monsterId:107, level:65, moves:["hydro_pump","dark_pulse","dragon_pulse","crunch"]}
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
  champion_defeated: [
    "🏆 CONGRATULATIONS! You have defeated Champion Lumian and become the NEW LUMORIA CHAMPION!",
    "Your deeds protecting Lumoria from Team Umbra will be remembered forever.",
    "Professor Arbor: 'You are extraordinary. Not just a Champion in battle, but a Champion of heart. Lumoria is safe because of you!'"
  ]
};

