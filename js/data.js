// ============================================================
// LUMORIA - Game Data
// ============================================================

// NATURES SYSTEM
// Each nature boosts one stat by 10% and lowers another by 10%
// Neutral natures (same boost/lower) have no effect
const NATURES_DATA = {
  // ATK boosted
  Blazing:   { up: "atk", down: "def", desc: "Fierce and reckless" },
  Feral:     { up: "atk", down: "spa", desc: "Raw physical power" },
  Savage:    { up: "atk", down: "spd", desc: "Attacks without restraint" },
  Reckless:  { up: "atk", down: "spe", desc: "Hits hard but charges in" },
  // DEF boosted
  Ironclad:  { up: "def", down: "atk", desc: "Tough and unyielding" },
  Stalwart:  { up: "def", down: "spa", desc: "Steadfast defender" },
  Armored:   { up: "def", down: "spd", desc: "Heavily shielded" },
  Anchored:  { up: "def", down: "spe", desc: "Immovable wall" },
  // SPA boosted
  Mystic:    { up: "spa", down: "atk", desc: "Attuned to arcane forces" },
  Arcane:    { up: "spa", down: "def", desc: "Channels raw magic" },
  Ethereal:  { up: "spa", down: "spd", desc: "Otherworldly presence" },
  Astral:    { up: "spa", down: "spe", desc: "Cosmic power, slow to act" },
  // SPD boosted
  Serene:    { up: "spd", down: "atk", desc: "Calm and resilient" },
  Warding:   { up: "spd", down: "def", desc: "Magic-resistant aura" },
  Tranquil:  { up: "spd", down: "spa", desc: "Peaceful inner strength" },
  Patient:   { up: "spd", down: "spe", desc: "Waits and endures" },
  // SPE boosted
  Swift:     { up: "spe", down: "atk", desc: "Lightning fast but light" },
  Nimble:    { up: "spe", down: "def", desc: "Quick and agile" },
  Hasty:     { up: "spe", down: "spa", desc: "Acts before thinking" },
  Dashing:   { up: "spe", down: "spd", desc: "Speed over caution" },
  // Neutral natures
  Balanced:  { up: null, down: null, desc: "Well-rounded nature" },
  Stoic:     { up: null, down: null, desc: "Unchanging temperament" },
  Spirited:  { up: null, down: null, desc: "Full of energy" },
  Steadfast: { up: null, down: null, desc: "Reliable and consistent" },
  Resolute:  { up: null, down: null, desc: "Determined and focused" }
};

const NATURES_LIST = Object.keys(NATURES_DATA);

function getRandomNature() {
  return NATURES_LIST[Math.floor(Math.random() * NATURES_LIST.length)];
}

function applyNatureToStat(statName, value, nature) {
  const n = NATURES_DATA[nature];
  if (!n) return value;
  if (n.up === statName) return Math.floor(value * 1.1);
  if (n.down === statName) return Math.floor(value * 0.9);
  return value;
}

// INDIVIDUAL VALUES (IVs)
// Each stat gets a random IV from 0-31, affecting final stat calculation
function generateIVs() {
  return {
    hp:  Math.floor(Math.random() * 32),
    atk: Math.floor(Math.random() * 32),
    def: Math.floor(Math.random() * 32),
    spa: Math.floor(Math.random() * 32),
    spd: Math.floor(Math.random() * 32),
    spe: Math.floor(Math.random() * 32)
  };
}

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
  tackle:       { name:"Collide",        type:"Normal",   power:40,  acc:100, pp:35, cat:"physical", effect:null,        ec:0,   desc:"A basic tackle attack." },
  scratch:      { name:"Scratch",       type:"Normal",   power:40,  acc:100, pp:35, cat:"physical", effect:null,        ec:0,   desc:"Scratches the foe with sharp claws." },
  headbutt:     { name:"Headbutt",      type:"Normal",   power:70,  acc:100, pp:15, cat:"physical", effect:"flinch",    ec:30,  desc:"A forceful headbutt that may cause flinching." },
  body_slam:    { name:"Body Slam",     type:"Normal",   power:85,  acc:100, pp:15, cat:"physical", effect:"paralyze",  ec:30,  desc:"Slams the foe with a massive body. May paralyze." },
  hyper_beam:   { name:"Radiance Cannon",    type:"Normal",   power:150, acc:90,  pp:5,  cat:"special",  effect:"recharge",  ec:100, desc:"A powerful beam. Must recharge next turn." },
  quick_attack: { name:"Blitz",  type:"Normal",   power:40,  acc:100, pp:30, cat:"physical", effect:"priority",  ec:0,   desc:"Attacks first with blinding speed." },
  growl:        { name:"Growl",         type:"Normal",   power:0,   acc:100, pp:40, cat:"status",   effect:"atkdown",   ec:100, desc:"Lowers the foe's Attack." },
  tail_whip:    { name:"Tail Whip",     type:"Normal",   power:0,   acc:100, pp:30, cat:"status",   effect:"defdown",   ec:100, desc:"Lowers the foe's Defense." },
  leer:         { name:"Leer",          type:"Normal",   power:0,   acc:100, pp:30, cat:"status",   effect:"defdown",   ec:100, desc:"Menacing glare lowers the foe's Defense." },
  recover:      { name:"Recover",       type:"Normal",   power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Restores up to half the user's max HP." },
  swords_dance: { name:"War Dance",  type:"Normal",   power:0,   acc:100, pp:20, cat:"status",   effect:"atkup2",    ec:100, desc:"Raises the user's Attack by 2 stages." },
  harden:       { name:"Harden",        type:"Normal",   power:0,   acc:100, pp:30, cat:"status",   effect:"defup",     ec:100, desc:"Stiffens the body to raise Defense." },
  wild_tumble:  { name:"Wild Tumble",   type:"Normal",   power:60,  acc:100, pp:20, cat:"physical", effect:"flinch",    ec:20,  desc:"Tumbles into the foe wildly with reckless abandon." },
  battle_cry:   { name:"Battle Cry",    type:"Normal",   power:0,   acc:100, pp:20, cat:"status",   effect:"atkup2",    ec:100, desc:"Lets out a ferocious cry that fires up the user's fighting spirit." },
  momentum_rush:{ name:"Momentum Rush", type:"Normal",   power:75,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Builds momentum across the field and crashes into the foe at full speed." },
  vital_pulse:  { name:"Vital Pulse",   type:"Normal",   power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Focuses life energy inward to restore the user's vitality." },
  instinct_slash:{ name:"Instinct Slash",type:"Normal",  power:70,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes by pure instinct, always finding a critical spot to exploit." },
  // --- Fire ---
  ember:        { name:"Ember",         type:"Fire",     power:40,  acc:100, pp:25, cat:"special",  effect:"burn",      ec:10,  desc:"A weak fire attack that may burn." },
  flame_fang:   { name:"Flame Fang",    type:"Fire",     power:65,  acc:95,  pp:15, cat:"physical", effect:"burn",      ec:10,  desc:"Bites with flaming fangs. May burn." },
  flamethrower: { name:"Inferno Jet",  type:"Fire",     power:90,  acc:100, pp:15, cat:"special",  effect:"burn",      ec:10,  desc:"Shoots a stream of intense fire. May burn." },
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
  aqua_tail:    { name:"Tidal Sweep",     type:"Water",    power:90,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Attacks with a powerful water tail." },
  surf:         { name:"Tidal Rush",          type:"Water",    power:90,  acc:100, pp:15, cat:"special",  effect:null,        ec:0,   desc:"A powerful wave crashes over the foe." },
  hydro_pump:   { name:"Hydro Pump",    type:"Water",    power:110, acc:80,  pp:5,  cat:"special",  effect:null,        ec:0,   desc:"Blasts the foe with a powerful water jet." },
  bubble_beam:  { name:"Bubble Jet",   type:"Water",    power:65,  acc:100, pp:20, cat:"special",  effect:"spedown",   ec:10,  desc:"Shoots bubbles that may reduce Speed." },
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
  seed_bomb:    { name:"Pod Blast",     type:"Grass",    power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Drops a giant seed bomb on the foe." },
  energy_ball:  { name:"Verdant Orb",   type:"Grass",    power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"A ball of energy drawn from nature." },
  petal_blitz:  { name:"Petal Blitz",   type:"Grass",    power:100, acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Strikes with a furious petal storm." },
  sleep_powder: { name:"Slumber Dust",  type:"Grass",    power:0,   acc:75,  pp:15, cat:"status",   effect:"sleep",     ec:100, desc:"Scatters a powder that induces sleep." },
  root_lance:   { name:"Root Lance",    type:"Grass",    power:85,  acc:95,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Drives an enormous root spear through the ground and up into the foe." },
  canopy_crash: { name:"Canopy Crash",  type:"Grass",    power:90,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Drops a massive section of forest canopy onto the opponent." },
  spore_burst:  { name:"Spore Burst",   type:"Grass",    power:0,   acc:80,  pp:15, cat:"status",   effect:"sleep",     ec:100, desc:"Releases an explosive burst of sleep-inducing spores." },
  thornwall:    { name:"Thornwall",     type:"Grass",    power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Grows a wall of thorns around the user, raising its Defense." },
  verdant_surge:{ name:"Verdant Surge", type:"Grass",    power:110, acc:85,  pp:5,  cat:"special",  effect:null,        ec:0,   desc:"Surges with the full power of living nature in a devastating burst." },
  photon_leaf:  { name:"Photon Leaf",   type:"Grass",    power:70,  acc:100, pp:15, cat:"special",  effect:"crit",      ec:100, desc:"A leaf sharpened by concentrated sunlight that always finds weak points." },
  // --- Electric ---
  thunder_shock:{ name:"Thunder Shock", type:"Electric", power:40,  acc:100, pp:30, cat:"special",  effect:"paralyze",  ec:10,  desc:"A jolt of electricity. May paralyze." },
  thunderbolt:  { name:"Volt Jet",   type:"Electric", power:90,  acc:100, pp:15, cat:"special",  effect:"paralyze",  ec:10,  desc:"A strong thunderbolt. May paralyze." },
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
  icicle_crash: { name:"Frost Crash",  type:"Ice",      power:85,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Drops icicles on the foe. May flinch." },
  glacial_shard:{ name:"Glacial Shard", type:"Ice",      power:65,  acc:100, pp:20, cat:"physical", effect:"freeze",    ec:15,  desc:"Fires a razor-sharp shard of glacial ice that may freeze the target." },
  frost_breath: { name:"Frost Breath",  type:"Ice",      power:60,  acc:90,  pp:15, cat:"special",  effect:"freeze",    ec:100, desc:"Exhales a breath of supercooled air that always freezes the foe." },
  permafrost:   { name:"Permafrost",    type:"Ice",      power:0,   acc:100, pp:15, cat:"status",   effect:"spedown2",  ec:100, desc:"Encases the foe's feet in permafrost, drastically reducing Speed." },
  avalanche_drive:{ name:"Avalanche Drive",type:"Ice",   power:95,  acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Surges forward with the full weight of a collapsing avalanche." },
  cryo_lance:   { name:"Cryo Lance",    type:"Ice",      power:80,  acc:95,  pp:15, cat:"special",  effect:"freeze",    ec:10,  desc:"Conjures a lance of pure ice crystal and hurls it at the opponent." },
  winter_shroud:{ name:"Winter Shroud", type:"Ice",      power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Wraps the user in a hardened shroud of ice that bolsters its defenses." },
  // --- Dark ---
  bite:         { name:"Bite",          type:"Dark",     power:60,  acc:100, pp:25, cat:"physical", effect:"flinch",    ec:30,  desc:"Bites with dark power. May cause flinching." },
  crunch:       { name:"Crunch",        type:"Dark",     power:80,  acc:100, pp:15, cat:"physical", effect:"defdown",   ec:20,  desc:"Crunches with dark fangs. May lower Defense." },
  shadow_ball:  { name:"Void Sphere",   type:"Dark",     power:80,  acc:100, pp:15, cat:"special",  effect:"spdefdown", ec:20,  desc:"Hurls a shadowy blob. May lower Sp.Def." },
  night_slash:  { name:"Night Slash",   type:"Dark",     power:70,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes in the dark. High critical rate." },
  dark_pulse:   { name:"Void Pulse",    type:"Dark",     power:80,  acc:100, pp:15, cat:"special",  effect:"flinch",    ec:20,  desc:"Fires pulses of dark energy." },
  void_rend:    { name:"Void Rend",     type:"Dark",     power:95,  acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Tears through the foe with a claw infused with the emptiness of the void." },
  shadowstep:   { name:"Shadowstep",    type:"Dark",     power:60,  acc:100, pp:20, cat:"physical", effect:"priority",  ec:0,   desc:"Steps through shadows to strike the foe before they can see it coming." },
  nightmare_pulse:{ name:"Nightmare Pulse",type:"Dark",  power:85,  acc:90,  pp:10, cat:"special",  effect:"confuse",   ec:30,  desc:"Bombards the foe's mind with terrifying nightmare imagery." },
  eclipse_shroud:{ name:"Eclipse Shroud",type:"Dark",    power:0,   acc:100, pp:15, cat:"status",   effect:"atkup2",    ec:100, desc:"Shrouds the user in absolute darkness, sharpening its predatory instincts." },
  obsidian_fang:{ name:"Obsidian Fang", type:"Dark",     power:75,  acc:100, pp:15, cat:"physical", effect:"poison",    ec:20,  desc:"Bites with fangs of living obsidian, may leave a dark toxin behind." },
  // --- Fairy ---
  fairy_wind:   { name:"Fairy Wind",    type:"Fairy",    power:40,  acc:100, pp:30, cat:"special",  effect:null,        ec:0,   desc:"Stirs up a fairy wind to strike." },
  moonblast:    { name:"Lunar Burst",     type:"Fairy",    power:95,  acc:100, pp:15, cat:"special",  effect:"spatkdown", ec:30,  desc:"Attacks using moonlight. May lower Sp.Atk." },
  dazzling_gleam:{ name:"Prism Flare",type:"Fairy",  power:80,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Emits a powerful flash of light." },
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
  flash_cannon: { name:"Forge Blast",  type:"Steel",    power:80,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"Fires a flash of steel-colored light." },
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
  venoshock:    { name:"Venom Burst",     type:"Poison",   power:65,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Doubles damage if target is poisoned." },
  miasma_cloud: { name:"Miasma Cloud",  type:"Poison",   power:70,  acc:90,  pp:15, cat:"special",  effect:"badpoison", ec:30,  desc:"Releases a dense toxic cloud that seeps into wounds and worsens over time." },
  acid_rain:    { name:"Acid Rain",     type:"Poison",   power:80,  acc:90,  pp:10, cat:"special",  effect:"poison",    ec:50,  desc:"Summons a rain of burning acid that corrodes the foe's body." },
  venom_lance:  { name:"Venom Lance",   type:"Poison",   power:85,  acc:95,  pp:10, cat:"physical", effect:"badpoison", ec:20,  desc:"Drives a concentrated venom spike deep into the foe." },
  toxic_surge:  { name:"Toxic Surge",   type:"Poison",   power:0,   acc:100, pp:15, cat:"status",   effect:"badpoison", ec:100, desc:"Surges venom through the battlefield, severely poisoning the target." },
  sludge_wave:  { name:"Sludge Wave",   type:"Poison",   power:95,  acc:95,  pp:10, cat:"special",  effect:"poison",    ec:30,  desc:"Unleashes a tidal wave of thick corrosive sludge." },
  putrid_pulse: { name:"Putrid Pulse",  type:"Poison",   power:75,  acc:100, pp:15, cat:"special",  effect:"confuse",   ec:20,  desc:"Emits a nauseating pulse of putrid energy that may disorient the foe." },
  // --- Psychic ---
  confusion:    { name:"Confusion",     type:"Psychic",  power:50,  acc:100, pp:25, cat:"special",  effect:"confuse",   ec:10,  desc:"A telekinetic attack. May confuse." },
  psybeam:      { name:"Psi Burst",       type:"Psychic",  power:65,  acc:100, pp:20, cat:"special",  effect:"confuse",   ec:10,  desc:"Shoots a peculiar ray. May confuse." },
  psychic_move: { name:"Psychic",       type:"Psychic",  power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"A powerful psychic wave. May lower Sp.Def." },
  psystrike:    { name:"Psi Strike",     type:"Psychic",  power:100, acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Materializes psychic power to attack." },
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
  dragon_dance: { name:"Wyrm Dance",  type:"Dragon",   power:0,   acc:100, pp:20, cat:"status",   effect:"dragondance",ec:100,desc:"A ritualistic dance that raises Atk and Speed." },
  wyrm_strike:  { name:"Wyrm Strike",   type:"Dragon",   power:90,  acc:95,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Strikes with the coiled force of an ancient wyrm's tail." },
  draconic_roar:{ name:"Draconic Roar", type:"Dragon",   power:0,   acc:100, pp:15, cat:"status",   effect:"atkdown",   ec:100, desc:"Unleashes a terrifying draconic roar that withers the foe's fighting spirit." },
  scale_storm:  { name:"Scale Storm",   type:"Dragon",   power:95,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Whips a storm of razor-edged dragon scales across the battlefield." },
  ancient_breath:{ name:"Ancient Breath",type:"Dragon",  power:110, acc:85,  pp:5,  cat:"special",  effect:"burn",      ec:30,  desc:"Exhales flame from the lungs of an ancient dragon lineage." },
  eon_crash:    { name:"Eon Crash",     type:"Dragon",   power:100, acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Crashes down with the timeless weight of dragonkind." },
  // --- Rock ---
  rock_throw:   { name:"Rock Throw",    type:"Rock",     power:50,  acc:90,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Hurls a small rock at the foe." },
  rock_slide:   { name:"Rock Slide",    type:"Rock",     power:75,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Large boulders fall on the foe. May flinch." },
  stone_edge:   { name:"Crag Strike",    type:"Rock",     power:100, acc:80,  pp:5,  cat:"physical", effect:"crit",      ec:100, desc:"Stabs with sharp stones. High critical." },
  obsidian_crash:{ name:"Obsidian Crash",type:"Rock",    power:85,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Crashes an enormous slab of obsidian onto the foe." },
  geode_burst:  { name:"Geode Burst",   type:"Rock",     power:80,  acc:95,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Hurls a hollow geode that shatters on impact, scattering crystal shards." },
  crystal_lance:{ name:"Crystal Lance", type:"Rock",     power:90,  acc:90,  pp:10, cat:"physical", effect:"crit",      ec:100, desc:"Drives a lance of perfectly formed crystal at the foe with perfect accuracy." },
  granite_wall: { name:"Granite Wall",  type:"Rock",     power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Erects a wall of granite around the user, massively raising Defense." },
  landslide:    { name:"Landslide",     type:"Rock",     power:95,  acc:85,  pp:10, cat:"physical", effect:"spedown",   ec:100, desc:"Triggers a devastating landslide that buries the foe under rubble." },
  // --- Bug ---
  bug_bite:     { name:"Bug Bite",      type:"Bug",      power:60,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"Bites the foe with bug mandibles." },
  bug_buzz:     { name:"Resonance Hum",      type:"Bug",      power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"Emits a harsh buzzing sound." },
  x_scissor:    { name:"Shear Strike",     type:"Bug",      power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Slashes the foe in an X shape." },
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
  wicked_blow:   { name:"Savage Blow",   type:"Dark",     power:95,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Delivers a single devastating blow with wicked intent." },

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
  metamorphosis: { name:"Metamorphosis", type:"Bug",      power:0,   acc:100, pp:10, cat:"status",   effect:"calmup",    ec:100, desc:"Undergoes a transformation that sharpens special power and resilience." },

  // ============================================================
  // BATCH 2 — 125 NEW MOVES
  // ============================================================

  // --- Normal (+8) ---
  rapid_strike:     { name:"Rapid Strike",      type:"Normal",   power:50,  acc:100, pp:25, cat:"physical", effect:"flinch",    ec:20,  desc:"Unleashes a flurry of rapid blows that may cause flinching." },
  echoing_shout:    { name:"Echoing Shout",     type:"Normal",   power:60,  acc:100, pp:20, cat:"special",  effect:"defdown",   ec:30,  desc:"A reverberating shout that rattles the target's defenses." },
  relentless_fury:  { name:"Relentless Fury",   type:"Normal",   power:80,  acc:100, pp:15, cat:"physical", effect:"recoil",    ec:100, desc:"Attacks with reckless fury at the cost of the user's own HP." },
  iron_will:        { name:"Iron Will",         type:"Normal",   power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Steels the body with iron resolve, raising the user's Defense." },
  afterimage:       { name:"Afterimage",        type:"Normal",   power:0,   acc:100, pp:20, cat:"status",   effect:"speup",     ec:100, desc:"Moves so fast it leaves an afterimage, raising the user's Speed." },
  encore_blast:     { name:"Encore Blast",      type:"Normal",   power:90,  acc:100, pp:10, cat:"special",  effect:"spatkup",   ec:30,  desc:"A theatrical burst of energy that may boost the user's Special Attack." },
  last_stand:       { name:"Last Stand",        type:"Normal",   power:120, acc:90,  pp:5,  cat:"physical", effect:"recoil",    ec:100, desc:"A desperate all-or-nothing strike that takes a heavy toll on the user." },
  double_edge:      { name:"Double-Edge",       type:"Normal",   power:100, acc:100, pp:15, cat:"physical", effect:"recoil",    ec:100, desc:"A reckless life-risking tackle that also damages the user." },

  // --- Fire (+7) ---
  will_o_wisp:      { name:"Will-O-Wisp",       type:"Fire",     power:0,   acc:85,  pp:15, cat:"status",   effect:"burn",      ec:100, desc:"Shoots a sinister flame that reliably burns the target." },
  flame_charge:     { name:"Flame Charge",      type:"Fire",     power:50,  acc:100, pp:20, cat:"physical", effect:"speup",     ec:100, desc:"Cloaks the user in flame and charges forward, raising Speed." },
  sun_burst:        { name:"Sun Burst",         type:"Fire",     power:80,  acc:100, pp:15, cat:"special",  effect:"burn",      ec:30,  desc:"Concentrates solar energy into a burst of searing heat that may burn." },
  molten_tide:      { name:"Molten Tide",       type:"Fire",     power:95,  acc:90,  pp:10, cat:"special",  effect:"spdefdown", ec:30,  desc:"A wave of molten rock that may erode the target's special resistance." },
  eruption:         { name:"Eruption",          type:"Fire",     power:140, acc:85,  pp:5,  cat:"special",  effect:"recoil",    ec:100, desc:"Erupts with volcanic force, dealing immense damage at a cost to the user." },
  infernal_roar:    { name:"Infernal Roar",     type:"Fire",     power:0,   acc:100, pp:15, cat:"status",   effect:"spatkup",   ec:100, desc:"A roar blazing with inner fire, sharply raising the user's Special Attack." },
  fire_spin:        { name:"Fire Spin",         type:"Fire",     power:35,  acc:85,  pp:15, cat:"special",  effect:"spedown",   ec:100, desc:"Traps the foe in a swirling vortex of fire, slowing it down." },

  // --- Water (+7) ---
  water_pulse:      { name:"Water Pulse",       type:"Water",    power:60,  acc:100, pp:20, cat:"special",  effect:"confuse",   ec:20,  desc:"A pulsing wave of water that may confuse the target." },
  rain_cascade:     { name:"Rain Cascade",      type:"Water",    power:55,  acc:100, pp:20, cat:"special",  effect:null,        ec:0,   desc:"A cascading downpour of rain that never misses its mark." },
  diving_strike:    { name:"Diving Strike",     type:"Water",    power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Dives deep then rockets up to slam the foe with crushing force." },
  crabhammer:       { name:"Crabhammer",        type:"Water",    power:100, acc:90,  pp:10, cat:"physical", effect:"crit",      ec:100, desc:"A massive claw strike at high speed — always finds a critical spot." },
  steam_geyser:     { name:"Steam Geyser",      type:"Water",    power:90,  acc:90,  pp:10, cat:"special",  effect:"burn",      ec:30,  desc:"A column of superheated steam that may burn the target." },
  flood_tide:       { name:"Flood Tide",        type:"Water",    power:0,   acc:100, pp:15, cat:"status",   effect:"calmup",    ec:100, desc:"Rides the rising flood tide, bolstering special power and resilience." },
  ocean_crash:      { name:"Ocean Crash",       type:"Water",    power:120, acc:85,  pp:5,  cat:"physical", effect:"defdown",   ec:30,  desc:"Crashes into the foe with the full force of a collapsing ocean wave." },

  // --- Grass (+7) ---
  bullet_seed:      { name:"Bullet Seed",       type:"Grass",    power:65,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"Forcefully shoots seeds in rapid bursts at the target." },
  magical_leaf:     { name:"Magical Leaf",      type:"Grass",    power:60,  acc:100, pp:20, cat:"special",  effect:null,        ec:0,   desc:"Scatters leaves imbued with magical energy that never miss." },
  leech_seed:       { name:"Leech Seed",        type:"Grass",    power:0,   acc:90,  pp:10, cat:"status",   effect:"drain",     ec:100, desc:"Plants a parasitic seed on the foe that saps HP each turn." },
  leaf_storm:       { name:"Leaf Storm",        type:"Grass",    power:130, acc:90,  pp:5,  cat:"special",  effect:"spatkdown", ec:100, desc:"A savage storm of razor leaves that sharply lowers the user's Sp. Atk." },
  petal_dance:      { name:"Petal Dance",       type:"Grass",    power:120, acc:100, pp:10, cat:"special",  effect:"confuse",   ec:100, desc:"A whirling dance of petals for several turns, then confuses the user." },
  solar_beam:       { name:"Solar Beam",        type:"Grass",    power:120, acc:100, pp:10, cat:"special",  effect:"recharge",  ec:100, desc:"Absorbs sunlight on the first turn, then unleashes a powerful beam." },
  spore_shield:     { name:"Spore Shield",      type:"Grass",    power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Grows a coating of hardened spores over the body, raising Defense." },

  // --- Electric (+7) ---
  nuzzle:           { name:"Nuzzle",            type:"Electric", power:20,  acc:100, pp:20, cat:"physical", effect:"paralyze",  ec:100, desc:"Rubs cheeks against the target, delivering a jolt that always paralyzes." },
  electroweb:       { name:"Electroweb",        type:"Electric", power:55,  acc:95,  pp:15, cat:"special",  effect:"spedown",   ec:100, desc:"Shoots an electric web that snares and slows the target." },
  volt_switch:      { name:"Volt Switch",       type:"Electric", power:70,  acc:100, pp:20, cat:"special",  effect:null,        ec:0,   desc:"Jolts the foe with electricity, then retreats with swift momentum." },
  zap_cannon:       { name:"Zap Cannon",        type:"Electric", power:120, acc:50,  pp:5,  cat:"special",  effect:"paralyze",  ec:100, desc:"An electric cannon blast that always paralyzes but is hard to aim." },
  plasma_fists:     { name:"Plasma Fists",      type:"Electric", power:100, acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Slams with fists wreathed in crackling plasma for massive damage." },
  rising_voltage:   { name:"Rising Voltage",    type:"Electric", power:70,  acc:100, pp:20, cat:"special",  effect:"burn",      ec:10,  desc:"Charges the air with intensifying voltage that can unpredictably cause burns." },
  thunder_cage:     { name:"Thunder Cage",      type:"Electric", power:80,  acc:90,  pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Imprisons the foe in a cage of crackling lightning that slows movement." },

  // --- Ground (+8) ---
  bulldoze:         { name:"Bulldoze",          type:"Ground",   power:60,  acc:100, pp:20, cat:"physical", effect:"spedown",   ec:100, desc:"Stomps the ground heavily, shaking the area and lowering the foe's Speed." },
  sand_attack:      { name:"Sand Attack",       type:"Ground",   power:0,   acc:100, pp:15, cat:"status",   effect:"atkdown",   ec:100, desc:"Kicks sand into the foe's face, impairing its offensive precision." },
  bone_rush:        { name:"Bone Rush",         type:"Ground",   power:65,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Strikes the foe 2–5 times in rapid succession with a hard bone." },
  scorched_sand:    { name:"Scorched Sand",     type:"Ground",   power:70,  acc:100, pp:15, cat:"special",  effect:"burn",      ec:30,  desc:"Fires scorching superheated sand that may leave burns on contact." },
  tectonic_wrath:   { name:"Tectonic Wrath",    type:"Ground",   power:110, acc:90,  pp:10, cat:"physical", effect:"recoil",    ec:100, desc:"Channels seismic fury into a devastating blow that rattles the user too." },
  underground_slam: { name:"Underground Slam",  type:"Ground",   power:80,  acc:100, pp:15, cat:"physical", effect:"flinch",    ec:30,  desc:"Burrows underground and erupts beneath the foe for a bone-crunching slam." },
  quicksand_trap:   { name:"Quicksand Trap",    type:"Ground",   power:0,   acc:90,  pp:15, cat:"status",   effect:"spedown2",  ec:100, desc:"Sucks the foe into quicksand, drastically reducing its Speed." },
  bone_club:        { name:"Bone Club",         type:"Ground",   power:65,  acc:85,  pp:20, cat:"physical", effect:"flinch",    ec:10,  desc:"Strikes the foe with a club-like bone. May cause flinching." },

  // --- Wind (+7) ---
  breeze_blade:     { name:"Breeze Blade",      type:"Wind",     power:50,  acc:100, pp:20, cat:"physical", effect:"crit",      ec:100, desc:"Slices with focused wind so precisely it always finds a critical spot." },
  gale_strike:      { name:"Gale Strike",       type:"Wind",     power:70,  acc:100, pp:20, cat:"physical", effect:"flinch",    ec:20,  desc:"A powerful strike backed by gale-force winds that may cause flinching." },
  vacuum_wave:      { name:"Vacuum Wave",       type:"Wind",     power:40,  acc:100, pp:30, cat:"special",  effect:"priority",  ec:0,   desc:"Creates a vacuum wave that strikes before the foe can react." },
  aerial_slam:      { name:"Aerial Slam",       type:"Wind",     power:90,  acc:95,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Soars high then slams the foe with the full force of a high-altitude dive." },
  stratosphere_drop:{ name:"Stratosphere Drop", type:"Wind",     power:120, acc:85,  pp:5,  cat:"special",  effect:"recoil",    ec:100, desc:"Ascends to the stratosphere and releases a shockwave of compressed air." },
  whirlwind_force:  { name:"Whirlwind Force",   type:"Wind",     power:0,   acc:100, pp:20, cat:"status",   effect:"defdown",   ec:100, desc:"A relentless whirlwind that shreds through the target's guard." },
  wind_barrier:     { name:"Wind Barrier",      type:"Wind",     power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Wraps the body in a spinning shell of compressed wind, bolstering defense." },

  // --- Ice (+8) ---
  frost_bite:       { name:"Frost Bite",        type:"Ice",      power:60,  acc:95,  pp:15, cat:"physical", effect:"freeze",    ec:10,  desc:"Bites down with frost-coated fangs. May freeze the target." },
  aurora_blast:     { name:"Aurora Blast",      type:"Ice",      power:80,  acc:100, pp:15, cat:"special",  effect:"freeze",    ec:10,  desc:"A brilliant aurora-hued blast of frozen energy that may freeze." },
  ice_hammer:       { name:"Ice Hammer",        type:"Ice",      power:100, acc:90,  pp:10, cat:"physical", effect:"spedown",   ec:100, desc:"Slams with a fist of solid ice. Devastating power that slows the user." },
  sheer_cold:       { name:"Sheer Cold",        type:"Ice",      power:0,   acc:30,  pp:5,  cat:"special",  effect:"freeze",    ec:100, desc:"An intense cold snap of absolute zero. Rarely lands, but always freezes." },
  snow_veil:        { name:"Snow Veil",         type:"Ice",      power:0,   acc:100, pp:20, cat:"status",   effect:"spdefup",   ec:100, desc:"Cloaks the body in swirling snow that bolsters special defense." },
  glacial_lance:    { name:"Glacial Lance",     type:"Ice",      power:120, acc:95,  pp:5,  cat:"physical", effect:null,        ec:0,   desc:"Conjures a massive lance of glacial ice and hurls it at the foe." },
  hail_barrage:     { name:"Hail Barrage",      type:"Ice",      power:65,  acc:90,  pp:15, cat:"special",  effect:"flinch",    ec:20,  desc:"Pelts the foe with a relentless barrage of sharp hailstones." },
  cryogenic_breath: { name:"Cryogenic Breath",  type:"Ice",      power:85,  acc:90,  pp:10, cat:"special",  effect:"freeze",    ec:20,  desc:"Exhales a breath of cryogenic air cold enough to instantly freeze." },

  // --- Dark (+8) ---
  taunt:            { name:"Taunt",             type:"Dark",     power:0,   acc:100, pp:20, cat:"status",   effect:"atkdown",   ec:100, desc:"Provokes the target with taunts, rattling their composure and lowering Attack." },
  pursuit:          { name:"Pursuit",           type:"Dark",     power:40,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"Relentlessly pursues the foe, cutting off any attempt to flee." },
  throat_chop:      { name:"Throat Chop",       type:"Dark",     power:80,  acc:100, pp:15, cat:"physical", effect:"atkdown",   ec:100, desc:"Strikes the foe in the throat, disabling their offensive capabilities." },
  nasty_plot:       { name:"Nasty Plot",        type:"Dark",     power:0,   acc:100, pp:20, cat:"status",   effect:"spatkup",   ec:100, desc:"Schemes devious plots that sharply raise the user's Special Attack." },
  dark_void:        { name:"Null Void",         type:"Dark",     power:0,   acc:80,  pp:10, cat:"status",   effect:"sleep",     ec:100, desc:"Drags the foe into a void of darkness, pulling them into deep slumber." },
  wicked_torrent:   { name:"Wicked Torrent",    type:"Dark",     power:95,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:20,  desc:"Unleashes a torrent of wicked dark energy that may erode special defenses." },
  shadow_force:     { name:"Wraith Drive",      type:"Dark",     power:120, acc:100, pp:5,  cat:"physical", effect:null,        ec:0,   desc:"Vanishes into shadow then reappears to deliver a devastating strike." },
  abyss_stare:      { name:"Abyss Stare",       type:"Dark",     power:0,   acc:100, pp:15, cat:"status",   effect:"spatkdown", ec:100, desc:"Fixes the target with a gaze from the bottomless abyss, sapping special power." },

  // --- Fairy (+7) ---
  disarming_voice:  { name:"Disarming Voice",   type:"Fairy",    power:40,  acc:100, pp:15, cat:"special",  effect:null,        ec:0,   desc:"A melodic cry that never misses and disarms the foe's heart." },
  charm:            { name:"Charm",             type:"Fairy",    power:0,   acc:100, pp:20, cat:"status",   effect:"atkdown",   ec:100, desc:"Charms the foe with cuteness, sharply lowering its Attack." },
  moonlight:        { name:"Moonlight",         type:"Fairy",    power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Bathes in moonlight to restore the user's HP." },
  misty_explosion:  { name:"Misty Explosion",   type:"Fairy",    power:100, acc:100, pp:5,  cat:"special",  effect:"recoil",    ec:100, desc:"Explodes in a burst of mystic mist, dealing heavy damage at a cost." },
  sparkling_aria:   { name:"Glimmering Song",    type:"Fairy",    power:90,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Sings a sparkling aria that resonates with magical force." },
  light_of_ruin:    { name:"Fairy Blast",     type:"Fairy",    power:140, acc:90,  pp:5,  cat:"special",  effect:"recoil",    ec:100, desc:"Draws in destructive light for a catastrophic blast at the user's expense." },
  fairy_lock:       { name:"Fairy Lock",        type:"Fairy",    power:0,   acc:100, pp:15, cat:"status",   effect:"spedown",   ec:100, desc:"Seals the battlefield with fairy magic, slowing the foe with mystical bonds." },

  // --- Steel (+7) ---
  metal_sound:      { name:"Metal Sound",       type:"Steel",    power:0,   acc:85,  pp:40, cat:"status",   effect:"spdefdown", ec:100, desc:"Scrapes metal to produce a horrible sound that sharply lowers Sp. Def." },
  iron_defense:     { name:"Iron Defense",      type:"Steel",    power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Hardens the body like iron, sharply raising the user's Defense." },
  magnet_bomb:      { name:"Magnet Bomb",       type:"Steel",    power:60,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"Launches a magnetic bomb that homes in on the target and never misses." },
  smart_strike:     { name:"Smart Strike",      type:"Steel",    power:70,  acc:100, pp:10, cat:"physical", effect:null,        ec:0,   desc:"Strikes with calculated precision — never missing its mark." },
  sunsteel_strike:  { name:"Solar Impact",   type:"Steel",    power:100, acc:100, pp:10, cat:"physical", effect:null,        ec:0,   desc:"Charges with the force of a meteorite, ignoring the target's defenses." },
  titan_blade:      { name:"Titan Blade",       type:"Steel",    power:110, acc:90,  pp:10, cat:"physical", effect:"recoil",    ec:100, desc:"Swings a blade of titanic steel with overwhelming force, damaging the user too." },
  steel_roller:     { name:"Steel Roller",      type:"Steel",    power:130, acc:90,  pp:5,  cat:"physical", effect:"defdown",   ec:30,  desc:"Rolls over the foe with massive steel momentum, crushing through their guard." },

  // --- Poison (+7) ---
  poison_powder:    { name:"Poison Powder",     type:"Poison",   power:0,   acc:75,  pp:35, cat:"status",   effect:"poison",    ec:100, desc:"Scatters toxic powder that poisons the target on contact." },
  toxic_thread:     { name:"Toxic Thread",      type:"Poison",   power:0,   acc:100, pp:20, cat:"status",   effect:"poison",    ec:100, desc:"Shoots a thread laced with venom that poisons and entangles the foe." },
  coil:             { name:"Coil",              type:"Poison",   power:0,   acc:100, pp:20, cat:"status",   effect:"atkup",     ec:100, desc:"Coils up tightly, raising Attack and focus for the coming battle." },
  gunk_blast:       { name:"Gunk Blast",        type:"Poison",   power:120, acc:85,  pp:5,  cat:"special",  effect:"poison",    ec:30,  desc:"Blasts the foe with a surge of concentrated toxins that may poison." },
  corrosive_rain:   { name:"Corrosive Rain",    type:"Poison",   power:80,  acc:100, pp:10, cat:"special",  effect:"poison",    ec:30,  desc:"Summons a rain of corrosive acid that may poison the target." },
  venom_surge:      { name:"Venom Surge",       type:"Poison",   power:95,  acc:90,  pp:10, cat:"special",  effect:"badpoison", ec:30,  desc:"Releases concentrated venom that may badly poison the target." },
  blight_drain:     { name:"Blight Drain",      type:"Poison",   power:75,  acc:100, pp:15, cat:"special",  effect:"drain",     ec:100, desc:"Fires blighted energy that saps the foe's life force to restore the user's HP." },

  // --- Psychic (+8) ---
  cosmic_power:     { name:"Cosmic Power",      type:"Psychic",  power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Absorbs the energy of the cosmos to raise the user's Defense and resilience." },
  stored_power:     { name:"Stored Power",      type:"Psychic",  power:60,  acc:100, pp:10, cat:"special",  effect:"spatkup",   ec:30,  desc:"Unleashes stored psychic energy — the more the user is powered up, the harder it hits." },
  expanding_force:  { name:"Expanding Force",   type:"Psychic",  power:80,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Unleashes a psychic force that expands outward to blanket the target." },
  psy_blast:        { name:"Psy Blast",         type:"Psychic",  power:120, acc:90,  pp:5,  cat:"special",  effect:"spdefdown", ec:30,  desc:"A concentrated psychic beam that may crack the target's mental defenses." },
  mind_burst:       { name:"Mind Burst",        type:"Psychic",  power:85,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:20,  desc:"Causes an explosive burst inside the target's mind, weakening special defenses." },
  future_sight:     { name:"Future Sight",      type:"Psychic",  power:120, acc:100, pp:10, cat:"special",  effect:"recharge",  ec:100, desc:"Focuses psychic power that strikes the foe two turns later with tremendous force." },
  gravitational_pull:{ name:"Gravitational Pull",type:"Psychic", power:0,   acc:90,  pp:20, cat:"status",   effect:"spedown2",  ec:100, desc:"Warps gravity around the foe, drastically reducing its Speed." },
  thought_wave:     { name:"Thought Wave",      type:"Psychic",  power:50,  acc:100, pp:20, cat:"special",  effect:"confuse",   ec:30,  desc:"Sends disruptive thought waves that may leave the target confused." },

  // --- Dragon (+7) ---
  scale_shot:       { name:"Scale Shot",        type:"Dragon",   power:65,  acc:90,  pp:20, cat:"physical", effect:"speup",     ec:100, desc:"Fires sharp scales as projectiles, raising the user's Speed afterward." },
  dual_chop:        { name:"Dual Chop",         type:"Dragon",   power:40,  acc:90,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Strikes the target twice in swift succession with dragon-like precision." },
  breaking_swipe:   { name:"Breaking Swipe",    type:"Dragon",   power:60,  acc:100, pp:15, cat:"physical", effect:"atkdown",   ec:100, desc:"Sweeps the foe with a dragon's tail, always lowering their Attack." },
  clanging_scales:  { name:"Scale Crash",   type:"Dragon",   power:110, acc:100, pp:5,  cat:"special",  effect:"spdefdown", ec:100, desc:"Clashes the user's scales to release a deafening sound that lowers Sp. Def." },
  eternabeam:       { name:"Abyss Ray",        type:"Dragon",   power:160, acc:90,  pp:5,  cat:"special",  effect:"recharge",  ec:100, desc:"The most powerful attack a dragon can use — must rest on the following turn." },
  dragon_ascent:    { name:"Sky Surge",     type:"Dragon",   power:120, acc:100, pp:5,  cat:"physical", effect:"defdown",   ec:100, desc:"Ascends with dragon power and crashes down, lowering the user's defenses." },
  dragon_maw:       { name:"Dragon Maw",        type:"Dragon",   power:85,  acc:95,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Snaps with powerful dragon jaws. The sheer force may cause flinching." },

  // --- Rock (+8) ---
  stealth_rock:     { name:"Stealth Rock",      type:"Rock",     power:0,   acc:100, pp:20, cat:"status",   effect:"atkdown",   ec:100, desc:"Lays a trap of razor-sharp rocks that weakens foes as they enter battle." },
  rock_polish:      { name:"Rock Polish",       type:"Rock",     power:0,   acc:100, pp:20, cat:"status",   effect:"speup",     ec:100, desc:"Polishes the body's rocky surface until frictionless, sharply raising Speed." },
  diamond_crash:    { name:"Diamond Crash",     type:"Rock",     power:100, acc:95,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Crashes into the foe with crystalline diamond hardness." },
  ancient_tide:     { name:"Ancient Tide",      type:"Rock",     power:75,  acc:95,  pp:15, cat:"special",  effect:"defdown",   ec:20,  desc:"Unleashes a wave of ancient stone energy that may erode the foe's defenses." },
  meteor_strike:    { name:"Meteor Strike",     type:"Rock",     power:140, acc:85,  pp:5,  cat:"special",  effect:"recharge",  ec:100, desc:"Calls down a meteorite from above. Must rest on the following turn." },
  stone_axe:        { name:"Rock Cleave",         type:"Rock",     power:65,  acc:90,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Strikes with the cleaving force of a stone axe, splitting through armor." },
  rock_wrecker:     { name:"Rock Wrecker",      type:"Rock",     power:150, acc:90,  pp:5,  cat:"physical", effect:"recharge",  ec:100, desc:"A devastating rock-shattering blow that requires rest on the next turn." },
  crystal_spear:    { name:"Crystal Spear",     type:"Rock",     power:80,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"A spear of pure crystal that always strikes a critical point." },

  // --- Bug (+7) ---
  quiver_dance:     { name:"Quiver Dance",      type:"Bug",      power:0,   acc:100, pp:20, cat:"status",   effect:"calmup",    ec:100, desc:"A mystical dance that raises the user's special power, resilience, and Speed." },
  sticky_web:       { name:"Sticky Web",        type:"Bug",      power:0,   acc:100, pp:20, cat:"status",   effect:"spedown",   ec:100, desc:"Shoots a sticky web that significantly slows the target." },
  twineedle:        { name:"Twineedle",         type:"Bug",      power:50,  acc:100, pp:20, cat:"physical", effect:"poison",    ec:20,  desc:"Stings the foe twice with a sharp stinger. May poison." },
  attack_order:     { name:"Swarm Strike",      type:"Bug",      power:90,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Commands bug allies to swarm the foe — their unified assault always finds weak points." },
  swarm_fury:       { name:"Swarm Fury",        type:"Bug",      power:80,  acc:100, pp:15, cat:"physical", effect:"recoil",    ec:100, desc:"An unrelenting swarming assault that exhausts the user as well." },
  cocoon_guard:     { name:"Cocoon Guard",      type:"Bug",      power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Wraps the body in a hardened cocoon shell, dramatically raising Defense." },
  hivemind_surge:   { name:"Hivemind Surge",    type:"Bug",      power:110, acc:90,  pp:10, cat:"special",  effect:null,        ec:0,   desc:"Channels the collective power of a hivemind into a single devastating burst." },

  // ============================================================
  // LEGENDARY SIGNATURE MOVES (+7)
  // ============================================================

  // Tempestarch — Electric/Wind sovereign
  storm_sovereignty:      { name:"Storm Sovereignty",      type:"Electric", power:130, acc:90,  pp:5,  cat:"special",  effect:"paralyze",  ec:50,  desc:"Tempestarch's ultimate technique — asserts dominion over all storms, paralyzing foes with sovereign lightning." },
  // Chronoveil — Psychic/Dragon time weaver
  temporal_collapse:      { name:"Temporal Collapse",      type:"Psychic",  power:120, acc:90,  pp:5,  cat:"special",  effect:"confuse",   ec:50,  desc:"Chronoveil collapses the flow of time around the target, leaving them disoriented and confused." },
  // Ashvanus — Fire/Rock volcano titan
  volcanic_wrath:         { name:"Volcanic Wrath",         type:"Fire",     power:140, acc:85,  pp:5,  cat:"special",  effect:"burn",      ec:100, desc:"Pyrovanus channels the full fury of a super-volcano, always severely burning the target." },
  // Abyssovex — Water/Dark abyss drake
  abyssal_dominion:       { name:"Abyssal Dominion",       type:"Dark",     power:130, acc:90,  pp:5,  cat:"special",  effect:"spdefdown", ec:50,  desc:"Thalassovex asserts dominion over the deep abyss, crushing the target's psychic defenses." },
  // Gaiavorn — Ground/Grass land spirit
  world_root_bind:        { name:"World Root Bind",        type:"Ground",   power:130, acc:90,  pp:5,  cat:"physical", effect:"spedown",   ec:100, desc:"Gaiavorn erupts roots from the world's core to bind and crush the target." },
  // Voidraxis — Dark/Fairy void star
  starlight_obliteration: { name:"Starlight Obliteration", type:"Dark",     power:150, acc:85,  pp:5,  cat:"special",  effect:"recoil",    ec:100, desc:"Voidraxis extinguishes entire stars and channels their death into a single point of annihilation." },
  // Dragemian — Dragon/Fire emperor
  emperor_inferno:        { name:"Emperor Inferno",        type:"Dragon",   power:140, acc:90,  pp:5,  cat:"physical", effect:"burn",      ec:100, desc:"Dragemian, lord of all dragons, breathes the emperor's eternal flame — always scorches the target." },

  // NG+ Signature Moves
  // Cosmoveil (401) — Psychic/Fairy cosmos strike
  cosmic_veil:      { name:"Cosmic Veil",     type:"Psychic", power:140, acc:90,  pp:5,  cat:"special",  effect:"spdefdown", ec:50, desc:"Cosmoveil wraps the battlefield in condensed starlight, crushing the foe's mind and spirit." },
  // Eondrake (392) — Dragon/Psychic time fracture
  time_fracture:    { name:"Time Fracture",   type:"Dragon",  power:130, acc:90,  pp:5,  cat:"special",  effect:"spedown2",  ec:50, desc:"Eondrake shatters the flow of time around the target, massively reducing its speed." },
  // Primordiax (400) — Fire/Ground mantle surge
  mantle_surge:     { name:"Mantle Surge",    type:"Ground",  power:135, acc:85,  pp:5,  cat:"physical", effect:"defdown",   ec:50, desc:"Primordiax channels the planet's mantle into a cataclysmic ground surge that weakens all defenses." },
  // Voidcrown (398) — Dark/Fairy void dominion
  void_dominion:    { name:"Void Dominion",   type:"Dark",    power:135, acc:90,  pp:5,  cat:"special",  effect:"atkdown",   ec:50, desc:"Voidcrown exerts absolute dominion over the void, draining the target's will to fight." },
  // Veildrak (404) — Dragon/Psychic pseudo signature
  veil_collapse:    { name:"Veil Collapse",   type:"Psychic", power:120, acc:95,  pp:10, cat:"special",  effect:"confuse",   ec:50, desc:"Veildrak tears the psychic veil protecting the target's mind, leaving it confused and vulnerable." },
  // Voidwarden (407) — Dark/Steel pseudo signature
  warden_strike:    { name:"Warden Strike",   type:"Steel",   power:120, acc:95,  pp:10, cat:"physical", effect:"defdown",   ec:50, desc:"Voidwarden strikes with the full force of a guardian of worlds, shattering defensive stances." }
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
    desc:"A fire fox cub. Its tail flame glows brighter when its spirit is high.",
    lore:"Solkin resembles a lean fox kit covered in orange-red fur that fades to pale cream on its underbelly. Its tail tip burns with a small candle-bright flame that flickers when excited. Stands roughly 50 cm tall. It hunts at dawn using bursts of speed to chase insects across sun-warmed stone, and is known for its affectionate, curious temperament." },

  2: { id:2, name:"Pyrevix",    emoji:"🦊", types:["Fire"],
    base:{hp:52,atk:59,def:62,spa:74,spd:57,spe:105},
    learnset:[[1,"tackle"],[2,"ember"],[3,"quick_attack"],[4,"flame_fang"],[5,"scorch_veil"],[24,"flamethrower"],[25,"blazing_rush"],[34,"heat_wave"],[35,"fire_blast"],[43,"inferno"],[6,"embercloak"],[32,"recover"]],
    evolveTo:3, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A blazing fox with a fiery mane. Rivals fear its flaming charge.",
    lore:"Pyrevix is a mid-sized fox standing 90 cm tall with a broad chest and a flowing mane of orange flame that streams behind it when running. Its paws leave faint scorch marks on soft ground. It patrols wide territories each night, marking boundaries by igniting patches of dry grass in small controlled rings." },

  3: { id:3, name:"Ignaraeth",  emoji:"🐲", types:["Fire","Dragon"],
    base:{hp:70,atk:88,def:80,spa:105,spd:79,spe:105},
    learnset:[[1,"flame_fang"],[2,"flamethrower"],[3,"heat_wave"],[4,"scorch_veil"],[37,"fire_blast"],[40,"swords_dance"],[44,"dragon_breath"],[47,"inferno"],[48,"dragon_claw"],[52,"dragon_pulse"],[56,"solar_flare"],[60,"outrage"],[5,"embercloak"],[36,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"A terrifying dragon-fox hybrid. Its volcanic roar can be heard for miles.",
    lore:"Ignaraeth is a massive dragon-fox over 3 metres from snout to tail. Its body is draped in overlapping scales the colour of cooling lava — dark charcoal edged with glowing amber. Two broad draconic wings fold flat when at rest. It dwells inside dormant calderas, sleeping curled around magma pools, and its roar carries the heat of a forge blast." },

  // Water Starters
  4: { id:4, name:"Aquilin",     emoji:"💧", types:["Water"],
    base:{hp:45,atk:52,def:69,spa:45,spd:66,spe:46},
    learnset:[[1,"tackle",[20,"frost_current"]],[1,"tail_whip"],[4,"water_gun"],[8,"bubble_beam"],[13,"aqua_tail"],[19,"recover"],[27,"surf"],[38,"hydro_pump",[5,"tidecaller"]]],
    evolveTo:5, evolveLevel:16, catchRate:45, expYield:59, rarity:"starter",
    desc:"A water sprite that lives near ponds. Its skin is always cool and moist.",
    lore:"Aquilin is a slender otter-like creature about 60 cm long with bright teal fur and large silver-rimmed eyes. A ridged fin runs from its neck to the base of its tail for steering underwater. It inhabits clear mountain streams and wedges smooth pebbles together to form small dams as nesting sites." },

  5: { id:5, name:"Nerilis",    emoji:"🐍", types:["Water"],
    base:{hp:60,atk:66,def:79,spa:64,spd:85,spe:64},
    learnset:[[1,"water_gun"],[2,"tail_whip"],[3,"bubble_beam"],[4,"aqua_tail"],[5,"tidecaller"],[16,"recover"],[24,"surf"],[30,"harden"],[35,"hydro_pump"],[44,"tidal_crush"],[6,"deepwater_hymn"],[33,"swords_dance"]],
    evolveTo:6, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A serpentine water Lumori. Glides through water with incredible grace.",
    lore:"Nerilis is a sleek sea-serpent roughly 2 metres long with cobalt-blue scales that reflect light like polished glass. A pale turquoise stripe runs its full length, and a fan-shaped crest unfurls behind its head when threatened. It leaps between waves and can sustain speeds that outpace most sailing vessels." },

  6: { id:6, name:"Pelagroth",    emoji:"🐲", types:["Water","Dragon"],
    base:{hp:72,atk:90,def:97,spa:89,spd:105,spe:75},
    learnset:[[1,"surf"],[2,"aqua_tail"],[3,"harden"],[4,"tidecaller"],[37,"hydro_pump"],[40,"abyssal_jet"],[44,"dragon_breath"],[48,"coral_barrage"],[52,"dragon_claw"],[56,"dragon_pulse"],[60,"eon_crash"],[64,"outrage"],[5,"deepwater_hymn"],[39,"ocean_tempest"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"An oceanic behemoth said to rule the seas. Its roar causes tidal waves.",
    lore:"Pelagroth is a colossal aquatic dragon over 8 metres long, tapering from a broad armoured head to a powerful eel-like tail. Deep indigo scales cover its back while the belly is pale violet with bioluminescent patches that pulse in the deep ocean. Ancient sailors mistook its silhouette for a rising island." },

  // Grass Starters
  7: { id:7, name:"Verdkin",  emoji:"🌱", types:["Grass"],
    base:{hp:49,atk:42,def:55,spa:61,spd:70,spe:47},
    learnset:[[1,"tackle",[20,"root_lance"]],[1,"growl"],[4,"vine_whip"],[8,"razor_leaf"],[13,"seed_bomb"],[19,"swords_dance"],[27,"energy_ball"],[38,"petal_blitz",[5,"sleep_powder"]]],
    evolveTo:8, evolveLevel:16, catchRate:45, expYield:64, rarity:"starter",
    desc:"A little plant seedling that walks on root-legs. Very curious and brave.",
    lore:"Verdkin is a small round herbivore about 35 cm tall with smooth lime-green skin and two leaf-shaped ears that absorb sunlight. A single bud sprouts from the crown of its head. It grazes in meadows during morning light and huddles with others in dense thickets at night, pressing leaves together to share warmth." },

  8: { id:8, name:"Barknell",   emoji:"🦕", types:["Grass"],
    base:{hp:57,atk:68,def:63,spa:75,spd:74,spe:70},
    learnset:[[1,"vine_whip"],[2,"razor_leaf"],[3,"seed_bomb"],[4,"tackle"],[5,"sleep_powder"],[16,"swords_dance"],[24,"energy_ball"],[30,"canopy_crash"],[35,"petal_blitz"],[44,"verdant_surge"],[6,"spore_burst"],[33,"recover"]],
    evolveTo:9, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A thorny dinosaur with bark-like skin. Each spine is razor sharp.",
    lore:"Barknell is a stout quadrupedal reptile roughly the size of a large dog. Its hide is textured like bark and varies from grey-green to deep brown, blending with forest undergrowth. Rows of leaf-shaped protrusions line its spine. It sleeps pressed against tree trunks, becoming nearly invisible to passing predators." },

  9: { id:9, name:"Floraith",   emoji:"🌸", types:["Grass","Fairy"],
    base:{hp:82,atk:75,def:80,spa:101,spd:110,spe:84},
    learnset:[[1,"seed_bomb"],[2,"energy_ball"],[3,"vine_whip"],[4,"sleep_powder"],[40,"verdant_surge"],[41,"tail_whip"],[44,"fairy_wind"],[47,"petal_blitz"],[48,"scratch"],[52,"dazzling_gleam"],[56,"root_lance"],[60,"moonblast"],[5,"spore_burst"],[36,"celestial_wave"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"A majestic flower guardian. Its petals shimmer with magical energy.",
    lore:"Floraith is a graceful deer-like creature 1.2 metres tall at the shoulder. Its white body is dappled with pink flower-shaped markings, and a garland of blossoms perpetually blooms along its neck regardless of season. It radiates a faint floral scent that calms nearby wild creatures and draws pollinators to the forest floor." },

  // ===== ADDITIONAL FIRE =====
  10: { id:10, name:"Embrix",  emoji:"🐛", types:["Fire","Bug"],
    base:{hp:54,atk:68,def:37,spa:43,spd:43,spe:48},
    learnset:[[1,"tackle",[20,"cinderwhirl"]],[1,"ember"],[8,"bug_bite"],[15,"flame_fang"],[17,"swords_dance"],[22,"x_scissor",[5,"scorch_veil"]],[29,"venom_drool"],[39,"stinger_volley"]],
    evolveTo:11, evolveLevel:18, catchRate:255, expYield:56, rarity:"common",
    desc:"A fire beetle larva. Leaves scorch marks wherever it walks.",
    lore:"Embrix is a chubby flame-patterned caterpillar about 20 cm long. Its body segments alternate vivid orange and smoky black, with two antennae that glow orange at the tips. It feeds on dried bark near volcanic soil, and its silk threads are heat-resistant enough to be woven into flame-proof cloth." },

  11: { id:11, name:"Helioveth",  emoji:"🦋", types:["Fire","Wind"],
    base:{hp:65,atk:91,def:52,spa:80,spd:60,spe:128},
    learnset:[[1,"ember"],[2,"bug_bite"],[3,"flame_fang"],[4,"scorch_veil"],[23,"battle_cry"],[28,"blazing_rush"],[33,"wing_attack"],[38,"downdraft"],[43,"air_slash"],[48,"magma_surge"],[53,"heat_wave"],[58,"tempest_wrath"],[5,"embercloak"],[39,"inferno"]],
    evolveTo:12, evolveLevel:40, catchRate:75, expYield:158, rarity:"uncommon",
    desc:"A blazing moth that flies at incredible speed. Its wings radiate fierce heat.",
    lore:"Helioveth is a large butterfly with a 70 cm wingspan. Its upper wings blaze with gold and crimson patterning, while the undersides are ash-grey with ember-like spots. Visible thermals guide its migration. Each wingbeat releases a tiny cascade of warm sparks that drift harmlessly to the ground." },

  13: { id:13, name:"Taurcin",    emoji:"🐂", types:["Fire"],
    base:{hp:67,atk:69,def:56,spa:52,spd:37,spe:43},
    learnset:[[1,"tackle",[22,"magma_surge"]],[1,"ember"],[12,"headbutt"],[19,"swords_dance"],[20,"flamethrower"],[30,"body_slam"],[35,"heat_wave"],[40,"fire_blast",[5,"scorch_veil"]],[3,"embercloak"],[31,"tail_whip"]],
    evolveTo:14, evolveLevel:22, catchRate:120, expYield:112, rarity:"common",
    desc:"A powerful bull with lava dripping from its hooves. Incredibly stubborn.",
    lore:"Taurcin is a bulky bull-like creature standing 1.5 metres at the shoulder. Its rust-red hide is thick as leather armour, and two forward-curving horns glow orange at the tips from retained heat. It stamps and snorts before charging, and the impact of its body can crack stone walls." },

  14: { id:14, name:"Molteroth",    emoji:"🐃", types:["Fire","Rock"],
    base:{hp:94,atk:111,def:97,spa:78,spd:64,spe:63},
    learnset:[[1,"headbutt"],[2,"magma_surge"],[3,"ember"],[4,"flamethrower"],[5,"scorch_veil"],[30,"battle_cry"],[32,"heat_wave"],[37,"fire_blast"],[38,"stalactite_drop"],[46,"rock_slide"],[54,"stone_edge"],[62,"inferno"],[6,"embercloak"],[42,"quarry_crush"]],
    evolveTo:15, evolveLevel:42, catchRate:45, expYield:235, rarity:"uncommon",
    desc:"A volcanic beast covered in hardened magma. Nothing can stop its charge.",
    lore:"Molteroth is a massive volcanic bull over 2 metres tall, covered in plates of hardened lava-rock that grind and shift as it moves. Jets of steam escape from vents along its spine. It inhabits lava fields, grazing on mineral deposits by grinding rock with its flat stone-hard teeth." },

  16: { id:16, name:"Cindercula",   emoji:"🐍", types:["Fire"],
    base:{hp:41,atk:53,def:46,spa:59,spd:45,spe:47},
    learnset:[[1,"tackle",[20,"cinderwhirl"]],[1,"ember"],[9,"quick_attack"],[14,"leer"],[17,"flamethrower",[5,"scorch_veil"]],[24,"vital_pulse"],[32,"ashfall"],[40,"fire_blast"],[3,"embercloak"],[31,"tail_whip"]],
    evolveTo:17, evolveLevel:20, catchRate:200, expYield:65, rarity:"common",
    desc:"A small worm that breathes tiny flames. Very shy and avoids conflict.",
    lore:"Cindercula is a sinuous fire-serpent about 1.8 metres long with iridescent scales shading from copper at the head to charcoal at the tail. A thin crest of flame-coloured feathers runs from its neck to mid-body. It slithers through ash fields and hunts by sensing heat signatures with specialised pit organs." },

  17: { id:17, name:"Pyroveth",   emoji:"🐉", types:["Fire","Dragon"],
    base:{hp:78,atk:97,def:61,spa:101,spd:75,spe:92},
    learnset:[[1,"ember"],[2,"flamethrower"],[3,"cinderwhirl"],[4,"scorch_veil"],[21,"vital_pulse"],[26,"char_dance"],[32,"dragon_breath"],[38,"dragon_claw"],[44,"heat_wave"],[50,"inferno"],[56,"outrage"],[62,"solar_flare"],[5,"embercloak"],[41,"dragon_rush"]],
    evolveTo:18, evolveLevel:42, catchRate:45, expYield:198, rarity:"uncommon",
    desc:"A serpentine fire dragon. Coils around prey before unleashing flame.",
    lore:"Pyroveth is a powerful fire dragon 4 metres long with scarlet and black scales. Its broad wings generate intense heat when flapping, scorching the air in wide arcs. Pairs of backward-swept horns frame its angular head. It roosts in mountain crags above the treeline and uses updrafts to glide effortlessly for hours." },

  // ===== ADDITIONAL WATER =====
  25: { id:25, name:"Reefling",  emoji:"🦀", types:["Water"],
    base:{hp:59,atk:66,def:78,spa:43,spd:63,spe:34},
    learnset:[[1,"scratch",[22,"coral_barrage"]],[1,"water_gun"],[10,"bubble_beam"],[18,"harden"],[20,"vital_pulse"],[26,"aqua_tail"],[34,"surf",[5,"tidecaller"]],[36,"hydro_pump"],[3,"deepwater_hymn"],[31,"leer"]],
    evolveTo:26, evolveLevel:20, catchRate:190, expYield:71, rarity:"common",
    desc:"A crab that blows iridescent bubbles. Very territorial near shorelines.",
    lore:"Reefling is a small crab-like creature only 15 cm across. Its shell is pale blue-green studded with tiny polyps that filter nutrients from the water. It scuttles across coral formations in shallow warm seas, using its patterned shell for camouflage, and hides inside anemones when threatened." },

  26: { id:26, name:"Aquidon",    emoji:"🦞", types:["Water","Rock"],
    base:{hp:75,atk:102,def:110,spa:59,spd:68,spe:81},
    learnset:[[1,"scratch"],[2,"water_gun"],[3,"tidecaller"],[23,"aqua_tail"],[27,"swords_dance"],[31,"surf"],[33,"hydro_pump"],[34,"stalactite_drop"],[41,"rock_slide"],[48,"crystal_lance"],[55,"tidal_crush"],[62,"stone_edge"],[4,"deepwater_hymn"],[42,"quarry_crush"]],
    evolveTo:27, evolveLevel:44, catchRate:60, expYield:188, rarity:"uncommon",
    desc:"A massive sea claw with rock-hard shell. Few can match its raw strength.",
    lore:"Aquidon is a broad-bodied rock lobster about 50 cm long with a stone-grey carapace reinforced by calcified mineral deposits. Its crushing claws can crack thick coral. It dwells in rocky sea caves along the coastline, guarding its territory fiercely against any intruder." },

  42: { id:42, name:"Cryonik",    emoji:"🦭", types:["Ice","Water"],
    base:{hp:54,atk:56,def:64,spa:73,spd:75,spe:31},
    learnset:[[1,"tackle",[22,"frost_current"]],[1,"powder_snow"],[10,"water_gun"],[18,"ice_beam"],[20,"leer"],[26,"aqua_tail"],[34,"blizzard",[5,"permafrost"]],[36,"cryo_lance"],[3,"winter_shroud"],[31,"surf"]],
    evolveTo:43, evolveLevel:28, catchRate:120, expYield:91, rarity:"common",
    desc:"An adorable ice seal. Its smooth skin can withstand arctic temperatures.",
    lore:"Cryonik is a plump seal-like creature about 80 cm long with pale powder-blue fur tipped in white. Its wide eyes are deep amber. A thin layer of ice perpetually coats its outer fur, crackling softly as it moves. It naps on floating ice floes and slides effortlessly into freezing water to catch fish." },

  43: { id:43, name:"Boreon",  emoji:"🦭", types:["Ice","Water"],
    base:{hp:82,atk:60,def:80,spa:103,spd:97,spe:81},
    learnset:[[1,"powder_snow"],[2,"water_gun"],[3,"ice_beam"],[4,"permafrost"],[31,"blizzard"],[33,"harden"],[38,"abyssal_jet"],[43,"hoarfrost_bite"],[48,"icicle_crash"],[53,"surf"],[58,"glacial_tomb"],[63,"hydro_pump"],[5,"winter_shroud"],[41,"aqua_tail"]],
    evolveTo:44, evolveLevel:44, catchRate:40, expYield:217, rarity:"uncommon",
    desc:"A regal glacial seal. It can freeze oceans with a single breath.",
    lore:"Boreon is a larger muscular seal with slate-blue fur and a thick neck mane of frosted white hair. Bands of ice spontaneously form around its flippers when it rears up. Its bark echoes across frozen bays, audible several kilometres away. It is highly territorial during breeding season on ice shelves." },

  28: { id:28, name:"Corelin",   emoji:"🐠", types:["Water"],
    base:{hp:49,atk:34,def:58,spa:59,spd:52,spe:62},
    learnset:[[1,"tackle",[22,"coral_barrage"]],[1,"water_gun"],[9,"bubble_beam"],[16,"tail_whip"],[17,"sweet_kiss"],[25,"surf",[5,"tidecaller"]],[29,"vital_pulse"],[39,"aqua_tail"],[3,"deepwater_hymn"],[32,"leer"]],
    evolveTo:29, evolveLevel:25, catchRate:220, expYield:72, rarity:"common",
    desc:"A dazzling coral fish with rainbow fins. Lures prey with its bright colors.",
    lore:"Corelin is a delicate tropical fish 25 cm long, striped vivid orange and white with translucent fins edged in blue. It lives inside branching coral formations and carries a weak electric charge in its scales that deters predators. Its scales refract light into small rainbows in shallow water." },

  29: { id:29, name:"Neraxis",    emoji:"🐡", types:["Water"],
    base:{hp:76,atk:69,def:64,spa:114,spd:99,spe:74},
    learnset:[[1,"water_gun"],[2,"bubble_beam"],[3,"surf"],[4,"tidecaller"],[30,"growl"],[35,"harden"],[40,"quick_attack"],[45,"dazzling_gleam"],[50,"whirlpool_dive"],[55,"sea_serpent_strike"],[60,"moonblast"],[65,"hydro_pump"],[5,"deepwater_hymn"],[42,"recover"]],
    evolveTo:30, evolveLevel:42, catchRate:70, expYield:184, rarity:"uncommon",
    desc:"A majestic reef king with jewel-like scales. Commands schools of fish.",
    lore:"Neraxis is a rotund puffer fish about 30 cm in diameter when deflated. Its base colouration is sandy yellow with dark brown spots. When startled it inflates to three times its size, erecting short sharp quills. It dwells in sandy lagoons and buries itself to ambush worms and molluscs." },

  // ===== ADDITIONAL GRASS =====
  63: { id:63, name:"Sporix",    emoji:"🍄", types:["Grass","Poison"],
    base:{hp:60,atk:58,def:57,spa:66,spd:70,spe:38},
    learnset:[[1,"tackle"],[1,"vine_whip"],[8,"poison_sting"],[16,"energy_ball"],[20,"leer"],[22,"spore_burst"],[24,"sludge_bomb"],[32,"sleep_powder",[5,"thornwall"]],[36,"seed_bomb"],[3,"mycelia_net"],[31,"leaf_blade"]],
    evolveTo:64, evolveLevel:25, catchRate:135, expYield:98, rarity:"common",
    desc:"A mushroom Lumori that releases paralyzing spores when threatened.",
    lore:"Sporix is a small mushroom-topped creature about 20 cm tall with a soft, spongy white body and a broad purple-spotted cap. It releases clouds of glittering green spores when disturbed. It grows in dense clusters in dark, damp forest floors and uses spore clouds to communicate danger between neighbouring clusters." },

  64: { id:64, name:"Myceloth",   emoji:"🍄", types:["Grass","Poison"],
    base:{hp:77,atk:87,def:85,spa:93,spd:73,spe:69},
    learnset:[[1,"energy_ball"],[2,"sludge_bomb"],[29,"sleep_powder"],[30,"tail_whip"],[33,"seed_bomb"],[35,"toxic"],[40,"scratch"],[45,"razor_leaf"],[50,"venoshock"],[55,"corrosion_fang"],[60,"petal_blitz"],[65,"verdant_surge"],[3,"spore_burst"],[42,"canopy_crash"]],
    evolveTo:65, evolveLevel:42, catchRate:45, expYield:317, rarity:"uncommon",
    desc:"A spore king that commands an army of fungal creatures. Reeks of poison.",
    lore:"Myceloth is a taller, humanoid-shaped fungal creature 80 cm tall. Its body is a mass of interwoven mycelium threads visible through a translucent outer membrane. A wide flat cap sits on its rounded head. It walks slowly through forest undergrowth, trailing filaments that connect to the underground fungal network of the forest." },

  66: { id:66, name:"Viridix",    emoji:"🌿", types:["Grass"],
    base:{hp:39,atk:60,def:39,spa:52,spd:40,spe:86},
    learnset:[[1,"vine_whip",[20,"photon_leaf"]],[1,"leer"],[8,"razor_leaf"],[16,"seed_bomb"],[17,"recover"],[24,"energy_ball",[5,"sleep_powder"]],[29,"scratch"],[39,"canopy_crash"],[3,"spore_burst"],[32,"swords_dance"]],
    evolveTo:67, evolveLevel:22, catchRate:180, expYield:78, rarity:"common",
    desc:"A quick, vine-like snake that lashes with razor-edged leaves.",
    lore:"Viridix is a bright green lizard about 50 cm long with a flat leaf-shaped tail it uses as a rudder when jumping between trees. Its skin is covered in scale-shaped leaf patterns for camouflage. It feeds on tender leaf shoots high in the forest canopy and can remain still for hours to avoid detection." },

  67: { id:67, name:"Loamvin", emoji:"🌳", types:["Grass","Ground"],
    base:{hp:83,atk:93,def:80,spa:80,spd:75,spe:76},
    learnset:[[1,"razor_leaf"],[2,"seed_bomb"],[3,"sleep_powder"],[22,"energy_ball"],[27,"growl"],[32,"tackle"],[37,"sandstrike"],[42,"sand_geyser"],[47,"root_lance"],[52,"earth_power"],[57,"earthquake"],[62,"petal_blitz"],[4,"spore_burst"],[40,"scorched_earth"]],
    evolveTo:68, evolveLevel:42, catchRate:55, expYield:195, rarity:"uncommon",
    desc:"A root elemental that walks on massive tree roots. Ancient and powerful.",
    lore:"Loamvin is a massive tree-like elemental 3 metres tall. Its body resembles a twisted ancient trunk with two enormous root-limbs serving as legs and two thick branch-arms. A broad canopy of leaves grows from its head. It walks incredibly slowly across ancient forests, its steps shaking the ground for metres around." },

  69: { id:69, name:"Germix",     emoji:"🫘", types:["Grass"],
    base:{hp:38,atk:41,def:49,spa:62,spd:55,spe:52},
    learnset:[[1,"tackle",[22,"spore_burst"]],[1,"vine_whip"],[10,"energy_ball"],[16,"leer"],[18,"sleep_powder"],[26,"seed_bomb",[5,"thornwall"]],[29,"scratch"],[39,"canopy_crash"]],
    evolveTo:70, evolveLevel:18, catchRate:255, expYield:58, rarity:"common",
    desc:"A living seed pod that rolls around. Harmless but quick to flee.",
    lore:"Germix is a round, seed-shaped creature about 15 cm tall. Its smooth green body has two tiny sprout-legs and a small face framed by curling leaf tendrils. It buries itself in rich soil during the day to photosynthesize through root-hairs. When threatened it releases a burst of accelerated growth, sprouting a tangle of vines around attackers." },

  70: { id:70, name:"Verdurus",    emoji:"🐻", types:["Grass"],
    base:{hp:90,atk:102,def:71,spa:95,spd:73,spe:61},
    learnset:[[1,"tackle"],[2,"vine_whip"],[3,"leer"],[4,"energy_ball"],[5,"sleep_powder"],[23,"seed_bomb"],[27,"swords_dance"],[36,"canopy_crash"],[37,"quick_attack"],[45,"briar_lash"],[54,"body_slam"],[63,"petal_blitz"],[6,"spore_burst"],[43,"tail_whip"]],
    evolveTo:71, evolveLevel:40, catchRate:75, expYield:186, rarity:"uncommon",
    desc:"A bear covered in living vegetation. Gentle unless its forest is threatened.",
    lore:"Verdurus is a rotund bear-like grass creature 1.5 metres tall completely covered in thick layers of soft moss and grass blades. Small flowers bloom from its back in spring. It is slow-moving and placid, grazing on rich meadow grass. Its weight compresses soil into particularly fertile patches wherever it sits." },

  // ===== ELECTRIC =====
  81: { id:81, name:"Joltan",    emoji:"🐭", types:["Electric"],
    base:{hp:43,atk:47,def:36,spa:51,spd:39,spe:100},
    learnset:[[1,"scratch",[20,"volt_surge"]],[1,"thunder_shock"],[8,"quick_attack"],[16,"spark"],[22,"thunderbolt"],[29,"recover"],[30,"thunder_wave"],[38,"thunder",[5,"static_cage"]],[3,"charge_burst"],[32,"leer"]],
    evolveTo:82, evolveLevel:20, catchRate:190, expYield:82, rarity:"common",
    desc:"An electric mouse that crackles with static. Can shock with a touch.",
    lore:"Joltan is a small mouse-like creature about 25 cm long with bright yellow fur tipped in white. Its round ears are oversized, acting as electric discharge points. Blue sparks crackle along its tail constantly. It is highly energetic, always moving, and discharges small jolts when startled or excited." },

  82: { id:82, name:"Galvanos",    emoji:"🐴", types:["Electric"],
    base:{hp:59,atk:88,def:58,spa:89,spd:60,spe:141},
    learnset:[[1,"thunder_shock"],[2,"quick_attack"],[3,"spark"],[20,"thunderbolt"],[27,"thunder_wave"],[28,"growl"],[34,"harden"],[35,"thunder"],[41,"wild_tumble"],[48,"arc_flash"],[55,"plasma_strike"],[62,"body_slam"],[4,"static_cage"],[42,"leer"]],
    evolveTo:83, evolveLevel:44, catchRate:60, expYield:200, rarity:"uncommon",
    desc:"An electric horse that gallops faster than lightning. Its mane crackles.",
    lore:"Galvanos is a horse-like creature 1.2 metres at the shoulder with sleek golden-yellow hide crisscrossed by electric-blue markings. Its flowing mane crackles with constant static. It can sustain a gallop at extraordinary speed for hours by converting its own electrical energy into kinetic force." },

  84: { id:84, name:"Electrix",      emoji:"🐞", types:["Electric","Bug"],
    base:{hp:34,atk:48,def:43,spa:50,spd:43,spe:94},
    learnset:[[1,"bug_bite",[22,"arc_flash"]],[1,"thunder_shock"],[10,"spark"],[18,"string_shot"],[20,"recover"],[26,"thunderbolt"],[34,"bug_buzz",[5,"thunder_wave"]],[36,"x_scissor"],[3,"static_cage"],[31,"cocoon_burst"]],
    evolveTo:85, evolveLevel:22, catchRate:200, expYield:74, rarity:"common",
    desc:"An electric beetle that emits charged buzzing sounds. Very energetic.",
    lore:"Electrix is a small beetle about 8 cm long with hard wing-cases of metallic gold and a dark underside. Two small antennae end in blue sparks. It lives in colonies in decaying wood near bodies of water and generates electricity from moisture and organic material it processes through its digestive system." },

  85: { id:85, name:"Shockharpe",  emoji:"🦟", types:["Electric","Bug"],
    base:{hp:81,atk:68,def:53,spa:107,spd:67,spe:101},
    learnset:[[1,"thunder_shock"],[2,"bug_bite"],[3,"thunder_wave"],[23,"thunderbolt"],[29,"tail_whip"],[31,"bug_buzz"],[33,"x_scissor"],[36,"scratch"],[43,"silk_bind"],[50,"swarm_dive"],[57,"volt_surge"],[64,"thunder"],[4,"static_cage"],[42,"mandible_crush"]],
    evolveTo:86, evolveLevel:42, catchRate:75, expYield:180, rarity:"uncommon",
    desc:"A dragonfly of electricity. Moves so fast it leaves lightning trails behind.",
    lore:"Shockharpe is a large mosquito-like creature 15 cm long with a translucent body and wings that hum at a frequency causing mild disorientation in nearby creatures. Its needle-like proboscis can pierce metal. It drains bioelectric energy from prey rather than blood, leaving targets drained and sluggish." },

  87: { id:87, name:"Amperix",     emoji:"🐟", types:["Electric","Water"],
    base:{hp:48,atk:59,def:51,spa:74,spd:57,spe:63},
    learnset:[[1,"water_gun",[22,"arc_flash"]],[1,"thunder_shock"],[12,"spark"],[19,"recover"],[20,"bubble_beam"],[28,"thunderbolt"],[35,"voltaic_fang"],[36,"surf",[5,"thunder_wave"]],[3,"static_cage"],[31,"ion_cannon"]],
    evolveTo:88, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"An electric fish that shocks prey in shallow water. Glows when excited.",
    lore:"Amperix is a tropical fish 30 cm long with a vibrant yellow body striped in electric blue. Its dorsal fin doubles as an array of biological capacitor cells. It schools in large groups in warm coastal waters, and when a predator approaches the school emits a coordinated electrical pulse that stuns attackers." },

  88: { id:88, name:"Sparkrel",    emoji:"🐡", types:["Electric","Water"],
    base:{hp:78,atk:61,def:64,spa:113,spd:85,spe:100},
    learnset:[[1,"thunder_shock"],[2,"water_gun"],[3,"thunderbolt"],[4,"bubble_beam"],[5,"thunder_wave"],[32,"voltaic_fang"],[33,"surf"],[35,"tail_whip"],[42,"scratch"],[49,"thunder"],[56,"hydro_pump"],[63,"overcharge"],[6,"static_cage"],[43,"aqua_tail"]],
    evolveTo:89, evolveLevel:42, catchRate:50, expYield:205, rarity:"uncommon",
    desc:"A massive electric eel that can power a city with its discharge.",
    lore:"Sparkrel is a round, pufferfish-like creature 25 cm in diameter. Its pale yellow body is covered in soft spines that each end in a crackling electric tip. It floats near the surface of warm bays, and when threatened it inflates and extends all spines simultaneously, creating a prickling electric sphere." },

  90: { id:90, name:"Zephyrel",  emoji:"🐦", types:["Electric","Wind"],
    base:{hp:50,atk:44,def:39,spa:52,spd:55,spe:93},
    learnset:[[1,"gust",[20,"volt_surge"]],[1,"thunder_shock"],[10,"wing_attack"],[14,"growl"],[18,"thunderbolt"],[24,"tackle"],[26,"air_slash"],[33,"spark"],[34,"thunder",[5,"thunder_wave"]],[42,"cyclone_blade"],[3,"static_cage"],[32,"storm_surge"]],
    evolveTo:91, evolveLevel:28, catchRate:160, expYield:78, rarity:"common",
    desc:"A little bird of storms. Rides thunderclouds and harnesses lightning.",
    lore:"Zephyrel is a compact, sparrow-sized electric-wind bird with bright yellow feathers edged in white. Its wingtips arc with blue electricity when it dives at high speed. It rides storm fronts across open plains, using the updrafts generated by thunderstorm anvil clouds to reach extraordinary altitudes." },

  // ===== GROUND =====
  95: { id:95, name:"Dustkin",     emoji:"🐶", types:["Ground"],
    base:{hp:61,atk:71,def:58,spa:40,spd:40,spe:68},
    learnset:[[1,"scratch",[22,"sandstrike"]],[1,"growl"],[8,"mud_shot"],[16,"headbutt"],[24,"earthquake"],[29,"tail_whip"],[32,"earth_power"],[40,"body_slam",[5,"dust_veil"]],[3,"clay_armor"],[31,"leer"]],
    evolveTo:96, evolveLevel:25, catchRate:160, expYield:88, rarity:"common",
    desc:"An earth puppy that loves to dig. Its powerful paws can tunnel through rock.",
    lore:"Dustkin is a small dusty-brown dog about 40 cm at the shoulder with large floppy ears and a snout perpetually dusted in fine soil. Its soft fur repels moisture and traps dust, giving it a dull matte appearance. It inhabits arid plains and digs shallow burrows to escape midday heat." },

  96: { id:96, name:"Seismith",  emoji:"🐕", types:["Ground","Rock"],
    base:{hp:104,atk:114,def:97,spa:53,spd:64,spe:70},
    learnset:[[1,"mud_shot"],[2,"headbutt"],[3,"earthquake"],[4,"dust_veil"],[29,"earth_power"],[31,"harden"],[37,"body_slam"],[38,"stalactite_drop"],[43,"rock_slide"],[49,"crystal_lance"],[55,"fissure_slam"],[61,"stone_edge"],[5,"clay_armor"],[41,"magma_rock"]],
    evolveTo:97, evolveLevel:44, catchRate:50, expYield:218, rarity:"uncommon",
    desc:"A terrifying earth hound. Its bark triggers small tremors.",
    lore:"Seismith is a medium-sized rock dog 70 cm at the shoulder with short grey fur and natural stone plates grown over its shoulders and haunches. It is powerfully built with a broad chest. It detects underground water sources and mineral deposits by pressing its snout to the ground and sensing seismic vibrations." },

  98: { id:98, name:"Aridix",   emoji:"🦂", types:["Ground","Poison"],
    base:{hp:53,atk:56,def:60,spa:57,spd:47,spe:76},
    learnset:[[1,"scratch",[22,"terra_spike"]],[1,"poison_sting"],[10,"mud_shot"],[18,"venoshock"],[26,"earthquake"],[30,"fissure_slam"],[34,"sludge_bomb"],[42,"toxic",[5,"dust_veil"]],[3,"clay_armor"],[32,"earth_power"]],
    evolveTo:99, evolveLevel:30, catchRate:100, expYield:95, rarity:"common",
    desc:"A desert scorpion with a venomous stinger. Buries itself in sand to ambush.",
    lore:"Aridix is a scorpion about 30 cm long with pale sandstone-coloured exoskeleton and a slender venomous stinger tail. Its pincers are wide and flat for digging. It inhabits deep desert dunes, burrowing down by day and emerging at night to hunt insects attracted by its faint phosphorescent glow." },

  99: { id:99, name:"Toxivenoth",  emoji:"🦂", types:["Ground","Poison"],
    base:{hp:64,atk:90,def:71,spa:77,spd:85,spe:88},
    learnset:[[1,"poison_sting"],[2,"fissure_slam"],[3,"mud_shot"],[4,"earthquake"],[5,"venoshock"],[6,"dust_veil"],[31,"sludge_bomb"],[38,"vital_pulse"],[39,"toxic"],[46,"miasma_cloud"],[54,"earth_power"],[62,"plague_burst"],[7,"clay_armor"],[42,"venom_lance"]],
    evolveTo:100, evolveLevel:42, catchRate:35, expYield:321, rarity:"uncommon",
    desc:"A great venom scorpion. Its tail sting causes hallucinations in victims.",
    lore:"Toxivenoth is a large scorpion 70 cm long with dark teal-green exoskeleton mottled with warning-yellow patches. Its stinger delivers a complex venom that causes progressive numbness. It inhabits poison-laced desert ravines and is territorial, using its stinger to mark the boundaries of its hunting range in the ground." },

  101: { id:101, name:"Limoux",     emoji:"🐊", types:["Ground","Water"],
    base:{hp:69,atk:60,def:59,spa:48,spd:52,spe:42},
    learnset:[[1,"scratch",[22,"sandstrike"]],[1,"mud_shot"],[10,"water_gun"],[18,"bubble_beam"],[20,"tail_whip"],[26,"earthquake"],[34,"surf",[5,"dust_veil"]],[36,"whirlpool_dive"],[3,"clay_armor"],[31,"sea_serpent_strike"]],
    evolveTo:102, evolveLevel:22, catchRate:140, expYield:88, rarity:"common",
    desc:"A mud-crawling amphibian. Slides through swamps with ease.",
    lore:"Limoux is a compact crocodile-like creature 80 cm long with muddy olive-green hide and a wide flat head. Its underbelly is pale cream. It half-buries itself in shallow murky water with only its nostrils and eyes visible above the surface, waiting motionless for hours until prey ventures within snapping range." },

  102: { id:102, name:"Dunoloth",   emoji:"🐊", types:["Ground","Water"],
    base:{hp:93,atk:97,def:77,spa:91,spd:78,spe:66},
    learnset:[[1,"mud_shot"],[2,"water_gun"],[3,"dust_veil"],[23,"earthquake"],[28,"battle_cry"],[31,"surf"],[34,"frost_current"],[40,"boulder_roll"],[46,"body_slam"],[52,"earth_power"],[58,"tidal_crush"],[64,"hydro_pump"],[4,"clay_armor"],[42,"aqua_tail"]],
    evolveTo:103, evolveLevel:44, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A massive silt beast that haunts murky river deltas. Ancient and powerful.",
    lore:"Dunoloth is a large armoured crocodilian 2 metres long with thick mud-brown hide reinforced by natural stone plates along its back. Its broad tail sweeps with tremendous force when it surfaces. It controls shallow river delta territories and excavates mud wallows that other creatures use for cooling." },

  // ===== WIND =====
  108: { id:108, name:"Gustkin",   emoji:"🐱", types:["Wind"],
    base:{hp:46,atk:43,def:37,spa:56,spd:45,spe:81},
    learnset:[[1,"scratch",[20,"cyclone_blade"]],[1,"gust"],[8,"quick_attack"],[16,"wing_attack"],[21,"harden"],[24,"air_slash"],[32,"hurricane",[5,"mistveil"]],[36,"thermal_dive"],[3,"zephyr_dance"],[31,"leer"]],
    evolveTo:109, evolveLevel:22, catchRate:200, expYield:70, rarity:"common",
    desc:"A light-footed wind kitten. Jumps and glides on invisible air currents.",
    lore:"Gustkin is a lean, cat-like wind creature about 45 cm at the shoulder with pale silver-grey fur that ruffles constantly in self-generated air currents. Its ears are long and swept back. It moves with uncanny speed across open spaces, leaving a trail of swirling leaves and dust in its wake." },

  109: { id:109, name:"Siroccomane",    emoji:"🦁", types:["Wind","Electric"],
    base:{hp:70,atk:98,def:57,spa:68,spd:74,spe:119},
    learnset:[[1,"gust"],[2,"wing_attack"],[3,"mistveil"],[22,"air_slash"],[28,"zephyr_dance"],[29,"hurricane"],[34,"vital_pulse"],[40,"thunder_shock"],[46,"arc_flash"],[52,"thunderbolt"],[58,"gale_cannon"],[64,"thunder"],[4,"vortex_trap"],[42,"storm_surge"]],
    evolveTo:110, evolveLevel:44, catchRate:55, expYield:318, rarity:"uncommon",
    desc:"A majestic wind lion whose mane crackles with electric charge during storms.",
    lore:"Siroccomane is a wind lion 1.1 metres at the shoulder with tawny-gold fur and an electric-blue crackling mane that streams behind it in the breeze it generates. Its footsteps barely touch the ground. It rules open desert plateaux, herding storms and creating complex thermals that other flying creatures use for navigation." },

  111: { id:111, name:"Aeolin",  emoji:"🐦", types:["Wind","Normal"],
    base:{hp:50,atk:48,def:35,spa:50,spd:36,spe:87},
    learnset:[[1,"tackle",[20,"jetstream"]],[1,"gust"],[8,"quick_attack"],[16,"wing_attack"],[21,"harden"],[24,"air_slash"],[32,"body_slam",[5,"mistveil"]],[36,"instinct_slash"],[3,"zephyr_dance"],[31,"wild_tumble"]],
    evolveTo:112, evolveLevel:20, catchRate:230, expYield:65, rarity:"common",
    desc:"A common draft finch that rides air currents effortlessly.",
    lore:"Aeolin is a slender bird 60 cm long with pale white-silver feathers and a long forked tail that acts as a rudder. Its wingtips curve back elegantly in flight. It inhabits high-altitude cliff faces and rarely descends below the snowline, riding permanent updrafts with minimal wing movement for days at a time." },

  112: { id:112, name:"Swirlavel",   emoji:"🦅", types:["Wind"],
    base:{hp:61,atk:90,def:58,spa:85,spd:61,spe:130},
    learnset:[[1,"gust"],[2,"wing_attack"],[3,"jetstream"],[4,"mistveil"],[21,"air_slash"],[27,"swords_dance"],[29,"body_slam"],[34,"scratch"],[41,"steel_wing"],[48,"skyfall"],[55,"hurricane"],[62,"tempest_wrath"],[5,"zephyr_dance"],[42,"leer"]],
    evolveTo:113, evolveLevel:42, catchRate:65, expYield:195, rarity:"uncommon",
    desc:"A great cyclone eagle. Causes miniature tornadoes with each wingbeat.",
    lore:"Swirlavel is a compact eagle 50 cm long with grey-brown patterned feathers and a distinctive double-spiral crest on its head. It creates miniature localised whirlwinds with each wingbeat that allow it to hover effortlessly in place. It hunts by dropping into these personal tornadoes and striking prey below." },

  114: { id:114, name:"Nimbusel",   emoji:"☁️", types:["Wind","Fairy"],
    base:{hp:54,atk:32,def:33,spa:76,spd:71,spe:67},
    learnset:[[1,"tackle",[22,"mistveil"]],[1,"gust"],[9,"fairy_wind"],[17,"sweet_kiss"],[20,"tail_whip"],[25,"air_slash"],[33,"moonblast",[5,"zephyr_dance"]],[36,"dazzling_gleam"],[3,"vortex_trap"],[31,"storm_surge"]],
    evolveTo:115, evolveLevel:25, catchRate:150, expYield:80, rarity:"common",
    desc:"A fluffy cloud puffball. It floats serenely but fights with surprising force.",
    lore:"Nimbusel is a wisp-like cloud fairy creature about 30 cm tall that resembles a small humanoid formed from condensed cloud matter with gossamer wings. Its body constantly sheds small snowflake-like crystals. It drifts through mountain mist at high elevation, rarely descending, and is considered a blessing when sighted." },

  115: { id:115, name:"Aetherworn",  emoji:"👻", types:["Wind","Dark"],
    base:{hp:80,atk:60,def:64,spa:107,spd:85,spe:94},
    learnset:[[1,"gust"],[2,"air_slash"],[3,"tackle"],[4,"mistveil"],[30,"growl"],[35,"shadowstep"],[40,"night_slash"],[45,"dark_pulse"],[50,"shadow_ball"],[55,"cyclone_blade"],[60,"nightmare_pulse"],[65,"hurricane"],[5,"zephyr_dance"],[42,"storm_surge"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:195, rarity:"uncommon",
    desc:"A ghost of mist that drifts at night. Its touch drains life energy.",
    lore:"Aetherworn is a shadow-wind creature 50 cm long resembling a tattered bat with ragged dark wings and a body that seems to shift between solid and smoke. Its eyes are pale grey. It haunts windswept ruins and desolate cliff edges, and its passage chills the air noticeably even on warm days." },

  // ===== ICE =====
  47: { id:47, name:"Sleetkin",    emoji:"🐺", types:["Ice"],
    base:{hp:49,atk:54,def:51,spa:63,spd:47,spe:73},
    learnset:[[1,"scratch",[22,"glacial_shard"]],[1,"powder_snow"],[8,"quick_attack"],[16,"icicle_crash"],[24,"ice_beam"],[29,"recover"],[32,"ice_punch"],[40,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[31,"leer"]],
    evolveTo:48, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"An ice wolf pup with fur as white as fresh snow. Very loyal and fierce.",
    lore:"Sleetkin is a lean wolf-like creature about 70 cm at the shoulder with short grey-white fur overlaid by a thin shell of constantly renewing ice crystals. Its paws leave perfectly hexagonal imprints in snow. It hunts in packs across tundra, using coordinated flanking manoeuvres to drive prey toward waiting ambushers." },

  48: { id:48, name:"Hailgorge",emoji:"🐺", types:["Ice"],
    base:{hp:89,atk:85,def:55,spa:81,spd:76,spe:94},
    learnset:[[1,"powder_snow"],[2,"quick_attack"],[3,"ice_beam"],[4,"icicle_crash"],[5,"scratch"],[6,"permafrost"],[28,"recover"],[29,"ice_punch"],[37,"blizzard"],[40,"hoarfrost_bite"],[52,"body_slam"],[64,"avalanche_drive"],[7,"winter_shroud"],[44,"leer"]],
    evolveTo:49, evolveLevel:44, catchRate:40, expYield:220, rarity:"uncommon",
    desc:"A blizzard hound that howls to summon snowstorms. Fearsome and fast.",
    lore:"Hailgorge is a massive ice wolf 1.3 metres tall at the shoulder with broad shoulders and white fur that bristles with jagged ice spines when it raises its hackles. Its howl condenses moisture in the air into a brief localised hailstorm. It leads Sleetkin packs with absolute authority." },

  50: { id:50, name:"Nivelin",   emoji:"🐏", types:["Ice","Normal"],
    base:{hp:49,atk:49,def:55,spa:52,spd:64,spe:54},
    learnset:[[1,"tackle",[22,"permafrost"]],[1,"powder_snow"],[10,"harden"],[18,"ice_beam"],[20,"vital_pulse"],[26,"body_slam"],[34,"blizzard",[5,"winter_shroud"]],[36,"headbutt"],[3,"frostfire_veil"],[31,"glacial_shard"]],
    evolveTo:51, evolveLevel:24, catchRate:180, expYield:77, rarity:"common",
    desc:"A fluffy snow sheep. Its wool absorbs cold air and condenses it to ice.",
    lore:"Nivelin is a stocky ram-like creature with thick white wool and curling horns coated in layers of old ice. A pale blue tinge runs through the wool near its spine. It grazes on frost-covered highland moss and climbs sheer glacier faces using hooves specially adapted to grip slick ice surfaces." },

  51: { id:51, name:"Shiverling",  emoji:"💎", types:["Ice"],
    base:{hp:76,atk:67,def:93,spa:106,spd:91,spe:56},
    learnset:[[1,"powder_snow"],[2,"winter_shroud"],[3,"harden"],[4,"vital_pulse"],[5,"ice_beam"],[6,"permafrost"],[31,"blizzard"],[33,"headbutt"],[34,"growl"],[44,"recover"],[54,"hoarfrost_bite"],[64,"icicle_crash"],[7,"frostfire_veil"],[43,"leer"]],
    evolveTo:52, evolveLevel:42, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A crystalline ice being of pure frozen beauty. It never melts.",
    lore:"Shiverling is a small crystalline creature about 25 cm tall shaped like a rounded gemstone with stubby limbs. Its body is translucent pale blue ice with tiny fractures inside that catch light and scatter it in prismatic patterns. It inhabits deep glacier caverns and sings a faint chiming tone that resonates through the ice walls." },

  53: { id:53, name:"Mistwhirl",  emoji:"🦢", types:["Ice","Wind"],
    base:{hp:54,atk:40,def:41,spa:68,spd:55,spe:98},
    learnset:[[1,"powder_snow",[22,"cryo_lance"]],[1,"gust"],[12,"wing_attack"],[20,"ice_beam"],[28,"air_slash"],[31,"glacial_tomb"],[36,"blizzard"],[44,"hurricane",[5,"permafrost"]],[3,"winter_shroud"],[33,"thermal_dive"]],
    evolveTo:54, evolveLevel:30, catchRate:100, expYield:95, rarity:"common",
    desc:"A graceful bird with ice-crystal wings. Leaves frost trails in the sky.",
    lore:"Mistwhirl is a graceful swan-like creature with a 1.5-metre wingspan. Its feathers are pale silver-white, and where its wingtips pass through the air they leave delicate trails of ice crystals that hang momentarily before dissolving. It glides on arctic wind currents for hours without flapping, riding the freezing gusts between mountain peaks." },

  54: { id:54, name:"Arcturex",     emoji:"🐻‍❄️", types:["Ice","Ground"],
    base:{hp:92,atk:101,def:89,spa:66,spd:79,spe:61},
    learnset:[[1,"powder_snow"],[2,"ice_beam"],[3,"permafrost"],[30,"glacial_tomb"],[33,"blizzard"],[35,"battle_cry"],[40,"scratch"],[45,"glacial_shard"],[50,"icicle_crash"],[55,"earth_power"],[60,"avalanche_drive"],[65,"earthquake"],[4,"winter_shroud"],[42,"sinkhole_maw"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:228, rarity:"uncommon",
    desc:"A massive polar bear Lumori. Can freeze the ground solid with its roar.",
    lore:"Arcturex is a stocky white bear 2.5 metres tall whose paws are broad and flat as snowshoes. Rings of brown-grey stone and compacted earth encircle its upper arms and neck, formed from years of digging frozen ground. It excavates hibernation dens 3 metres deep into permafrost, lining them with ice shavings for insulation." },

  45: { id:45, name:"Slatis",   emoji:"🌨️", types:["Ice","Water"],
    base:{hp:51,atk:39,def:49,spa:74,spd:64,spe:45},
    learnset:[[1,"tackle",[20,"frost_breath"]],[1,"water_gun"],[9,"powder_snow"],[14,"growl"],[17,"ice_beam"],[24,"scratch"],[25,"surf"],[33,"blizzard",[5,"permafrost"]],[34,"bubble_beam"],[42,"riptide_slam"],[3,"winter_shroud"],[32,"aqua_tail"]],
    evolveTo:46, evolveLevel:32, catchRate:130, expYield:82, rarity:"common",
    desc:"A sleet sprite that lives in cold mountain streams. Chills the air around it.",
    lore:"Slatis is a drifting jellyfish-like ice creature 60 cm in diameter. Its translucent bell shimmers with pale arctic blue light, and long trailing tendrils of frozen water hang below it like icicles. It bobs through freezing mountain lakes, generating a localised cold field that chills the surrounding water." },

  // ===== DARK =====
  118: { id:118, name:"Umbrakin",   emoji:"🐕", types:["Dark"],
    base:{hp:39,atk:56,def:44,spa:62,spd:39,spe:88},
    learnset:[[1,"scratch",[22,"shadowstep"]],[1,"bite"],[8,"quick_attack"],[16,"night_slash"],[24,"crunch"],[29,"recover"],[32,"dark_pulse"],[40,"shadow_ball",[5,"eclipse_shroud"]],[3,"dread_howl"],[31,"leer"]],
    evolveTo:119, evolveLevel:25, catchRate:150, expYield:88, rarity:"common",
    desc:"A shadow puppy that hides in darkness. Its eyes glow red at night.",
    lore:"Umbrakin is a small dark-coloured dog about 40 cm at the shoulder with jet-black fur that absorbs nearby light, creating a subtle darkening effect around it. Its eyes glow a faint amber. It is skittish and secretive, hiding in shadows and emerging only at dusk to scavenge in settlements." },

  119: { id:119, name:"Shadowvast",  emoji:"🐕", types:["Dark"],
    base:{hp:81,atk:90,def:57,spa:83,spd:77,spe:92},
    learnset:[[1,"bite"],[2,"quick_attack"],[3,"crunch"],[4,"night_slash"],[5,"scratch"],[6,"eclipse_shroud"],[26,"recover"],[29,"dark_pulse"],[37,"shadow_ball"],[38,"nightmare_pulse"],[51,"body_slam"],[64,"void_rend"],[7,"dread_howl"],[44,"leer"]],
    evolveTo:120, evolveLevel:44, catchRate:45, expYield:316, rarity:"uncommon",
    desc:"A hound of the night. Moves silently and strikes from blind spots.",
    lore:"Shadowvast is a large dark dog 90 cm at the shoulder with pure black fur and a broad powerful chest. It moves without sound on any surface. It guards underground lairs and claims territorial ownership of shadow-filled spaces within its range, tolerating no other predators in its claimed darkness." },

  121: { id:121, name:"Noxalin",     emoji:"🦇", types:["Dark","Wind"],
    base:{hp:52,atk:47,def:34,spa:57,spd:51,spe:106},
    learnset:[[1,"bite",[22,"shadowstep"]],[1,"gust"],[9,"wing_attack"],[17,"dark_pulse"],[25,"air_slash"],[29,"soul_rend"],[33,"shadow_ball"],[41,"hurricane",[5,"eclipse_shroud"]],[3,"dread_howl"],[32,"void_rend"]],
    evolveTo:122, evolveLevel:28, catchRate:130, expYield:85, rarity:"common",
    desc:"A dark bat that absorbs light. Creates zones of absolute darkness.",
    lore:"Noxalin is a medium-sized bat 60 cm long with dark grey-black fur and long narrow wings. Its face is flat with a broad wrinkled nose-leaf for echolocation. It roosts in enormous colonies inside cave systems and emerges at dusk in spiralling columns that can darken the sky for minutes." },

  122: { id:122, name:"Umbraveth", emoji:"🦇", types:["Dark","Wind"],
    base:{hp:63,atk:78,def:48,spa:116,spd:78,spe:119},
    learnset:[[1,"dark_pulse"],[2,"wing_attack"],[3,"air_slash"],[4,"shadowstep"],[5,"eclipse_shroud"],[30,"shadow_ball"],[35,"growl"],[38,"hurricane"],[42,"tackle"],[49,"night_slash"],[56,"nightmare_pulse"],[63,"cyclone_blade"],[6,"dread_howl"],[43,"void_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A spectral wing beast. Its mere passing through an area chills it completely.",
    lore:"Umbraveth is a large dark-wind bat with a 1.5-metre wingspan. Its wings are leathery dark purple-black and its fur is deep charcoal grey. When it passes, shadows move in directions contrary to light sources. It roosts alone in sea caves and hunts by riding cold offshore winds far out to sea." },

  123: { id:123, name:"Nocturil", emoji:"🦎", types:["Dark","Poison"],
    base:{hp:51,atk:60,def:50,spa:60,spd:48,spe:62},
    learnset:[[1,"scratch",[22,"obsidian_fang"]],[1,"bite"],[10,"poison_sting"],[18,"night_slash"],[26,"sludge_bomb"],[34,"crunch"],[42,"dark_pulse"],[50,"toxic",[5,"eclipse_shroud"]],[3,"dread_howl"],[36,"blackout_bomb"]],
    evolveTo:124, evolveLevel:32, catchRate:90, expYield:98, rarity:"common",
    desc:"A dark lizard with venomous bite. Camouflages perfectly in shadows.",
    lore:"Nocturil is a lean dark-green lizard 60 cm long with rough scales and a venomous forked tongue. A dark stripe runs from eye to tail. It inhabits rock crevices in shadowed ravines and is almost impossible to spot when motionless. Its venom causes mild hallucinations that disorient predators long enough to allow escape." },

  124: { id:124, name:"Phantorvex", emoji:"🐍", types:["Dark","Poison"],
    base:{hp:76,atk:95,def:72,spa:89,spd:73,spe:81},
    learnset:[[1,"bite"],[2,"eclipse_shroud"],[3,"poison_sting"],[4,"obsidian_fang"],[5,"sludge_bomb"],[32,"crunch"],[39,"dark_pulse"],[40,"harden"],[47,"toxic"],[48,"dread_howl"],[56,"venoshock"],[64,"void_rend"],[6,"dark_shroud"],[42,"blackout_bomb"]],
    evolveTo:125, evolveLevel:44, catchRate:35, expYield:218, rarity:"uncommon",
    desc:"A phantom serpent of darkness and venom. Said to haunt ancient ruins.",
    lore:"Phantorvex is a large venomous serpent 2 metres long with dark iridescent scales that shift between deep purple and black. Its fangs inject a necrotic venom. It haunts ancient ruins and underground crypts, and local legends claim it is drawn to places where death has recently occurred." },

  // ===== FAIRY =====
  137: { id:137, name:"Lumkin",     emoji:"🐶", types:["Fairy"],
    base:{hp:42,atk:35,def:50,spa:52,spd:57,spe:76},
    learnset:[[1,"tackle",[22,"pixie_bolt"]],[1,"fairy_wind"],[8,"sweet_kiss"],[16,"dazzling_gleam"],[20,"vital_pulse"],[24,"moonblast"],[32,"recover",[5,"stardust_veil"]],[36,"glitter_storm"],[3,"charm_bloom"],[31,"leer"]],
    evolveTo:138, evolveLevel:25, catchRate:190, expYield:78, rarity:"common",
    desc:"A glowing puppy surrounded by fairy light. Brings luck wherever it goes.",
    lore:"Lumkin is a small, round fairy dog about 30 cm at the shoulder with pure white fluffy fur that radiates a warm golden glow. Its eyes are bright violet. It bounces energetically and its glow intensifies when it is happy. It is attracted to places of celebration and is considered to bring good fortune." },

  138: { id:138, name:"Aetherael", emoji:"🐕", types:["Fairy"],
    base:{hp:71,atk:67,def:68,spa:100,spd:90,spe:77},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"moonblast"],[4,"sweet_kiss"],[29,"recover"],[30,"tail_whip"],[35,"battle_cry"],[40,"quick_attack"],[45,"wish_spark"],[50,"moonveil"],[55,"celestial_wave"],[60,"psystrike"],[5,"stardust_veil"],[39,"leer"]],
    evolveTo:139, evolveLevel:44, catchRate:50, expYield:205, rarity:"uncommon",
    desc:"A luminous hound of fairy power. Its radiance can banish dark spirits.",
    lore:"Aetherael is a sleek fairy hound 70 cm at the shoulder with luminous white fur and an aura of soft gold-pink light surrounding it constantly. Its eyes are deep amethyst. It moves with effortless grace and seeks out beings in distress, projecting a calming field of fairy light to soothe emotional pain." },

  140: { id:140, name:"Faeling",    emoji:"🦋", types:["Fairy","Bug"],
    base:{hp:35,atk:44,def:33,spa:79,spd:71,spe:78},
    learnset:[[1,"fairy_wind",[22,"wish_spark"]],[1,"bug_bite"],[10,"sweet_kiss"],[18,"dazzling_gleam"],[20,"recover"],[26,"moonblast"],[34,"bug_buzz",[5,"stardust_veil"]],[36,"gossamer_lance"],[3,"charm_bloom"],[31,"cocoon_burst"]],
    evolveTo:141, evolveLevel:22, catchRate:160, expYield:82, rarity:"common",
    desc:"A prismatic butterfly that scatters rainbow dust. Hard to catch.",
    lore:"Faeling is a small butterfly fairy-bug creature with a 25 cm wingspan. Its wings display soft pastel fairy-shimmer patterns — pinks, creams, and pale golds — with delicate trailing tails. Its body is slender and pale green. It inhabits enchanted meadows and its wingbeat releases a fine powder that induces feelings of mild euphoria." },

  141: { id:141, name:"Prisoveth",  emoji:"🦋", types:["Fairy","Wind"],
    base:{hp:83,atk:55,def:60,spa:110,spd:95,spe:88},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"recover"],[4,"sweet_kiss"],[23,"moonblast"],[29,"gust"],[33,"gossamer_lance"],[36,"quick_attack"],[43,"air_slash"],[50,"moonveil"],[57,"glitter_storm"],[64,"hurricane"],[5,"stardust_veil"],[42,"thermal_dive"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:200, rarity:"uncommon",
    desc:"A radiant butterfly of pure fairy energy. Its wings shimmer with all colors.",
    lore:"Prisoveth is a large fairy-wind butterfly with a 90 cm wingspan. Its upper wings are brilliant iridescent white that fractures into rainbow spectra in sunlight, while the undersides show soft cloud-white with violet hints. It soars on warm thermals above flowering valleys, visible from great distances by its light display." },

  142: { id:142, name:"Dawnirel",  emoji:"✨", types:["Fairy","Psychic"],
    base:{hp:50,atk:48,def:54,spa:74,spd:61,spe:63},
    learnset:[[1,"fairy_wind",[22,"stardust_veil"]],[1,"confusion"],[10,"sweet_kiss"],[18,"psybeam"],[26,"dazzling_gleam"],[30,"neural_storm"],[34,"psychic_move"],[42,"moonblast",[5,"charm_bloom"]],[3,"aurora_veil"],[32,"glitter_storm"]],
    evolveTo:143, evolveLevel:32, catchRate:100, expYield:96, rarity:"common",
    desc:"A dawn spirit that appears at sunrise. Its psychic energy is immense.",
    lore:"Dawnirel is a small star-shaped psychic-fairy creature about 20 cm across, with a central golden body and five pointed arms tipped in pale rose light. It hovers gently, spinning slowly, and emits pulses of warm light in rhythm with its thoughts. It appears at dawn and dusk on cloudless days." },

  143: { id:143, name:"Lunarael",   emoji:"🌟", types:["Fairy","Psychic"],
    base:{hp:79,atk:66,def:79,spa:131,spd:105,spe:74},
    learnset:[[1,"dazzling_gleam"],[2,"sweet_kiss"],[32,"psychic_move"],[36,"recover"],[39,"moonblast"],[40,"calm_mind"],[44,"quick_attack"],[48,"wish_spark"],[52,"future_echo"],[56,"celestial_wave"],[60,"psystrike"],[64,"mind_shatter"],[3,"stardust_veil"],[38,"thought_crush"]],
    evolveTo:144, evolveLevel:46, catchRate:25, expYield:248, rarity:"rare",
    desc:"A celestial being of fairy and psychic power. Claims to have come from the stars.",
    lore:"Lunarael is a larger crescent-moon-shaped psychic-fairy creature 45 cm across. Its body is deep violet-blue with silver-white edges that glow brightly in darkness. It is nocturnal and inhabits open mountain summits, drifting upward on clear nights and releasing lunar-charged energy that causes nearby crystals to resonate." },

  // ===== STEEL =====
  147: { id:147, name:"Ferrokin",     emoji:"🤖", types:["Steel"],
    base:{hp:47,atk:60,def:72,spa:37,spd:45,spe:54},
    learnset:[[1,"scratch",[22,"alloy_edge"]],[1,"metal_claw"],[9,"harden"],[17,"flash_cannon"],[25,"steel_wing"],[29,"leer"],[33,"iron_tail"],[41,"body_slam",[5,"magnetize"]],[3,"ironskin"],[32,"tail_whip"]],
    evolveTo:148, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"A puppy encased in iron armor. Slow but incredibly tough.",
    lore:"Ferrokin is a small humanoid steel creature 50 cm tall with a compact body of dark grey steel plates with visible bolts and seams. Its eyes are small yellow optical lenses. It collects metal scraps and incorporates them into its own body, slowly growing more elaborate and patched over time." },

  148: { id:148, name:"Adamavast",  emoji:"🦾", types:["Steel"],
    base:{hp:90,atk:107,def:111,spa:65,spd:83,spe:37},
    learnset:[[1,"metal_claw"],[2,"flash_cannon"],[3,"steel_wing"],[4,"magnetize"],[28,"leer"],[30,"iron_tail"],[35,"battle_cry"],[38,"body_slam"],[42,"quick_attack"],[49,"rivet_barrage"],[56,"forge_strike"],[63,"tungsten_ram"],[5,"ironskin"],[43,"recover"]],
    evolveTo:149, evolveLevel:46, catchRate:40, expYield:225, rarity:"uncommon",
    desc:"A steel hound with titanium claws. Almost nothing can break its armor.",
    lore:"Adamavast is a large humanoid steel creature 1.5 metres tall with a broad powerful chest and arms that function as natural weapons. Its surface is burnished dark steel with deep scratches from past battles. It is stoic, rarely speaking, and positions itself between perceived threats and those it considers worth protecting." },

  150: { id:150, name:"Gearon",     emoji:"⚙️", types:["Steel","Electric"],
    base:{hp:48,atk:50,def:67,spa:52,spd:57,spe:54},
    learnset:[[1,"metal_claw",[22,"shrapnel_burst"]],[1,"thunder_shock"],[10,"flash_cannon"],[18,"spark"],[21,"recover"],[26,"thunderbolt"],[34,"flash_cannon"],[38,"plasma_strike"],[42,"thunder",[5,"magnetize"]],[3,"ironskin"],[32,"ball_lightning"]],
    evolveTo:151, evolveLevel:28, catchRate:100, expYield:95, rarity:"common",
    desc:"A mechanical gear-bot that runs on electric power. Loves to tinker.",
    lore:"Gearon is a compact steel-electric creature 60 cm tall that resembles a gear-work automaton. Its round body is made of interlocking cog-wheels that spin and whir constantly, generating its own electrical power through mechanical motion. Sparks escape through gaps in its gear-work as it moves." },

  151: { id:151, name:"Alloytron",    emoji:"🦿", types:["Steel","Electric"],
    base:{hp:77,atk:72,def:92,spa:108,spd:75,spe:66},
    learnset:[[1,"thunderbolt"],[2,"magnetize"],[31,"flash_cannon"],[32,"surge_field"],[36,"harden"],[39,"thunder"],[40,"rivet_barrage"],[44,"volt_surge"],[48,"iron_tail"],[52,"tungsten_ram"],[56,"overcharge"],[60,"hyper_beam"],[3,"ironskin"],[37,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:235, rarity:"uncommon",
    desc:"A mechanical warrior powered by electric cores. Feared on every battlefield.",
    lore:"Alloytron is a larger electric-steel automaton 1.2 metres tall. Its body is an assembly of interlocked alloy panels with exposed wiring running between them. Its chest houses a glowing power core visible through a transparent casing. It can interface with electrical infrastructure and draw power directly from city grid lines." },

  152: { id:152, name:"Imperion",  emoji:"🐢", types:["Steel","Rock"],
    base:{hp:108,atk:61,def:138,spa:59,spd:105,spe:30},
    learnset:[[1,"tackle",[25,"ironskin"]],[1,"rock_throw"],[12,"harden"],[20,"flash_cannon"],[24,"growl"],[28,"rock_slide"],[36,"iron_tail"],[44,"stone_edge"],[45,"temper_edge"],[52,"body_slam",[5,"magnetize"]],[3,"slag_shield"],[37,"crystal_lance"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:318, rarity:"uncommon",
    desc:"A colossal steel-rock turtle. Nigh indestructible but very slow.",
    lore:"Imperion is a heavily built steel-rock tortoise 1.5 metres long with a thick dome shell of laminated steel plates fused over natural rock. It moves with glacial slowness but is nearly impossible to harm. It is said to carry small ecosystems on its shell — moss, insects, and even small plants grow undisturbed there." },

  // ===== POISON =====
  155: { id:155, name:"Toxirin",    emoji:"🐸", types:["Poison"],
    base:{hp:67,atk:56,def:58,spa:71,spd:50,spe:49},
    learnset:[[1,"tackle",[22,"miasma_cloud"]],[1,"poison_sting"],[9,"bubble_beam"],[17,"sludge_bomb"],[20,"battle_cry"],[25,"toxic"],[33,"venoshock"],[36,"sludge_wave"],[41,"sludge_bomb",[5,"toxic_surge"]],[3,"toxin_bloom"],[31,"leer"]],
    evolveTo:156, evolveLevel:24, catchRate:150, expYield:88, rarity:"common",
    desc:"A toxic toad that drips with powerful venom. Warty and repulsive but deadly.",
    lore:"Toxirin is a small plump frog about 15 cm long with vivid lime-green skin marked by patterns of yellow and black warning colours. It secretes a sticky toxic slime from its skin that deters predators effectively. It inhabits warm rainforest ponds and amplifies its chirping call to remarkable volume for its size." },

  156: { id:156, name:"Venekon",   emoji:"🐸", types:["Poison","Water"],
    base:{hp:98,atk:72,def:65,spa:113,spd:87,spe:56},
    learnset:[[1,"poison_sting"],[2,"bubble_beam"],[3,"toxic_surge"],[24,"toxic"],[30,"venoshock"],[32,"tail_whip"],[33,"sludge_wave"],[38,"sludge_bomb"],[40,"scratch"],[48,"venom_lance"],[56,"surf"],[64,"hydro_pump"],[4,"toxin_bloom"],[43,"aqua_tail"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A venom toad of enormous size. Its croaking alone can poison the air.",
    lore:"Venekon is a medium poison-water frog 35 cm long with a flattened head and webbed feet. Its skin is mottled blue-green and brown. It produces a diluted aquatic toxin that disperses through water to deter fish predators. It inhabits murky river backwaters and calls from beneath floating lily pads." },

  157: { id:157, name:"Acidelix",    emoji:"🫧", types:["Poison"],
    base:{hp:61,atk:47,def:47,spa:75,spd:59,spe:43},
    learnset:[[1,"tackle",[22,"putrid_pulse"]],[1,"poison_sting"],[10,"sludge_bomb"],[18,"toxic"],[21,"vital_pulse"],[26,"venoshock"],[34,"recover"],[38,"sludge_wave"],[42,"sludge_bomb",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"leer"]],
    evolveTo:158, evolveLevel:26, catchRate:130, expYield:95, rarity:"common",
    desc:"A blob of acid that oozes across the ground. Dissolves things with its body.",
    lore:"Acidelix is a floating translucent orb about 20 cm in diameter filled with slowly swirling acid-green liquid. Its outer membrane is barely visible. It drifts through damp cave systems, dissolving organic material it contacts and absorbing the resulting nutrients through its outer surface." },

  158: { id:158, name:"Acidoloth",  emoji:"🫧", types:["Poison","Ground"],
    base:{hp:98,atk:70,def:86,spa:110,spd:86,spe:30},
    learnset:[[1,"toxic"],[2,"tackle"],[3,"venoshock"],[4,"toxic_surge"],[32,"growl"],[35,"sludge_wave"],[38,"mud_shot"],[39,"sludge_bomb"],[44,"loam_leech"],[50,"terra_spike"],[56,"earth_power"],[62,"earthquake"],[5,"toxin_bloom"],[41,"magnitude"]],
    evolveTo:159, evolveLevel:44, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A sludge behemoth that poisons everything it touches. Its territory reeks.",
    lore:"Acidoloth is a large ground-crawling acidic creature 1 metre across, shaped like a flattened disc with short stubby limbs. Its undersurface exudes a corrosive fluid that slowly etches whatever it crawls across. It inhabits cave floors and underground acid springs, leaving characteristic pitting in stone wherever it travels." },

  160: { id:160, name:"Miasoveth",   emoji:"🦟", types:["Poison","Wind"],
    base:{hp:49,atk:53,def:30,spa:78,spd:64,spe:77},
    learnset:[[1,"poison_sting",[22,"acid_rain"]],[1,"gust"],[10,"sludge_bomb"],[16,"vital_pulse"],[18,"air_slash"],[26,"toxic"],[29,"miasma_cloud"],[34,"hurricane"],[40,"plague_burst"],[42,"venoshock",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"sludge_wave"]],
    evolveTo:161, evolveLevel:30, catchRate:140, expYield:88, rarity:"common",
    desc:"A miasma fly that leaves toxic trails in its wake. Spreads pestilence.",
    lore:"Miasoveth is a large winged insect creature with a 60 cm wingspan, resembling a crane fly but with a bloated poisonous abdomen. Its wings are translucent, tinted sickly yellow-green. It creates toxic air currents with its wings as it flies, leaving a drift of suspended poisonous particles in its wake." },

  // ===== PSYCHIC =====
  166: { id:166, name:"Novakin",     emoji:"🐩", types:["Psychic"],
    base:{hp:50,atk:34,def:39,spa:74,spd:72,spe:72},
    learnset:[[1,"tackle",[22,"mind_shatter"]],[1,"confusion"],[8,"quick_attack"],[16,"psybeam"],[24,"psychic_move"],[29,"leer"],[32,"calm_mind"],[40,"psystrike",[5,"prism_ward"]],[3,"mind_reader"],[31,"recover"]],
    evolveTo:167, evolveLevel:25, catchRate:165, expYield:86, rarity:"common",
    desc:"A psychic puppy that reads minds. Can predict attacks before they happen.",
    lore:"Novakin is a small psychic dog about 30 cm at the shoulder with smooth lavender-grey fur and a large domed forehead that glows softly when focusing. Its eyes are bright blue-silver. It reads emotions effortlessly and communicates its own feelings through projected imagery rather than vocalisation." },

  167: { id:167, name:"Psychovast",   emoji:"🐩", types:["Psychic"],
    base:{hp:78,atk:58,def:54,spa:108,spd:100,spe:107},
    learnset:[[1,"confusion"],[2,"psybeam"],[3,"psychic_move"],[4,"prism_ward"],[29,"calm_mind"],[31,"growl"],[37,"psystrike"],[38,"battle_cry"],[43,"recover"],[49,"wild_tumble"],[55,"telepathic_slam"],[61,"thought_crush"],[5,"mind_reader"],[41,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:318, rarity:"uncommon",
    desc:"A psychic hound whose mind burns with power. Can levitate small objects.",
    lore:"Psychovast is a larger psychic dog 75 cm at the shoulder with sleek indigo-grey fur and a prominent cranial ridge. Concentric rings of faint blue light appear around its head when it concentrates. It can project full sensory experiences into nearby minds and uses this ability to test the character of strangers." },

  168: { id:168, name:"Espelith",     emoji:"🔮", types:["Psychic","Fairy"],
    base:{hp:46,atk:51,def:57,spa:80,spd:79,spe:62},
    learnset:[[1,"confusion",[22,"insight_flare"]],[1,"fairy_wind"],[10,"psybeam"],[18,"dazzling_gleam"],[26,"psychic_move"],[34,"moonblast"],[42,"calm_mind"],[50,"psystrike",[5,"prism_ward"]],[3,"mind_reader"],[36,"glitter_storm"]],
    evolveTo:169, evolveLevel:32, catchRate:90, expYield:100, rarity:"common",
    desc:"A mystical esper being. Bridges the worlds of psychic and fairy magic.",
    lore:"Espelith is a psychic-fairy gem creature 50 cm tall resembling a rounded prism of violet crystal with short limbs and a serene humanoid face embedded in the front face of the crystal. It refracts nearby psychic energy into visible light, producing beautiful patterns on surrounding surfaces." },

  169: { id:169, name:"Aurarael",   emoji:"🌀", types:["Psychic"],
    base:{hp:83,atk:62,def:59,spa:119,spd:98,spe:104},
    learnset:[[1,"psybeam"],[2,"psychic_move"],[3,"prism_ward"],[36,"harden"],[39,"calm_mind"],[40,"recover"],[44,"quick_attack"],[47,"psystrike"],[48,"telepathic_slam"],[52,"thought_crush"],[56,"temporal_rift"],[60,"hyper_beam"],[4,"mind_reader"],[35,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:245, rarity:"rare",
    desc:"A being of pure psychic energy. Communicates only by telepathy.",
    lore:"Aurarael is a flowing psychic entity 60 cm tall that resembles a whirlpool of blue-violet light given form. It has no solid body, only a continuously cycling vortex of condensed psychic energy. It inhabits locations with high psychic resonance — ancient meditation sites, mystical crossroads — and absorbs ambient thought energy." },

  170: { id:170, name:"Oneiron",   emoji:"💫", types:["Psychic","Dark"],
    base:{hp:75,atk:69,def:52,spa:125,spd:94,spe:84},
    learnset:[[1,"confusion",[25,"future_echo"]],[1,"bite"],[11,"psybeam"],[19,"dark_pulse"],[23,"swords_dance"],[27,"psychic_move"],[35,"shadow_ball"],[42,"nightmare_pulse"],[43,"night_slash"],[51,"psystrike",[5,"calm_mind"]],[3,"prism_ward"],[37,"void_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:70, expYield:185, rarity:"uncommon",
    desc:"A dreamrift that exists between sleep and waking. It draws power from nightmares.",
    lore:"Oneiron is a dark-psychic dream entity 70 cm tall with a wisp-like body of deep indigo and silver. Its limbs dissolve at the edges into drifting motes of light. It inhabits the boundary between waking and sleep, entering dreams of nearby sleeping creatures and exploring their symbolic landscapes." },

  171: { id:171, name:"Drakorius",    emoji:"🐲", types:["Psychic","Dragon"],
    base:{hp:75,atk:88,def:74,spa:112,spd:82,spe:90},
    learnset:[[1,"dragon_breath",[28,"mind_shatter"]],[1,"confusion"],[13,"psybeam"],[21,"dragon_claw"],[24,"swords_dance"],[29,"psychic_move"],[37,"dragon_pulse"],[44,"astral_rend"],[45,"psystrike"],[53,"outrage",[5,"calm_mind"]],[3,"prism_ward"],[38,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A psychic dragon that manipulates reality with its mind. Ancient and mysterious.",
    lore:"Drakorius is a psychic dragon 2 metres long with sleek violet-blue scales and a broad intelligent forehead. Its wings are translucent membranes showing internal structure like stained glass. It is uniquely capable of reading the intent of other dragons and has historically served as a mediator between rival dragon clans." },

  // ===== DRAGON =====
  172: { id:172, name:"Scalurin",    emoji:"🐣", types:["Dragon"],
    base:{hp:47,atk:73,def:53,spa:63,spd:60,spe:30},
    learnset:[[1,"scratch",[22,"wyrm_strike"]],[1,"dragon_breath"],[12,"dragon_claw"],[20,"vital_pulse"],[22,"dragon_pulse"],[30,"dragon_dance"],[36,"cataclysm_breath"],[40,"outrage",[5,"draconic_roar"]],[3,"primordial_roar"],[31,"recover"]],
    evolveTo:173, evolveLevel:30, catchRate:45, expYield:91, rarity:"uncommon",
    desc:"A baby dragon hatchling. Clumsy but full of fiery determination.",
    lore:"Scalurin is a tiny dragon hatchling 20 cm long with soft, flexible scales in pale gold-green. Its eyes are enormous relative to its face. It stumbles awkwardly when walking but is a capable swimmer. It hatches in sandy riverbanks and spends its first year hunting insects near the water's edge." },

  173: { id:173, name:"Serpenthos",    emoji:"🐲", types:["Dragon"],
    base:{hp:71,atk:102,def:72,spa:79,spd:65,spe:67},
    learnset:[[1,"dragon_breath"],[2,"dragon_claw"],[3,"dragon_pulse"],[4,"dragon_dance"],[5,"draconic_roar"],[33,"tail_whip"],[36,"battle_cry"],[37,"outrage"],[39,"wild_tumble"],[42,"drake_rush"],[45,"scale_storm"],[46,"hyper_beam"],[6,"primordial_roar"],[30,"recover"]],
    evolveTo:174, evolveLevel:55, catchRate:15, expYield:175, rarity:"rare",
    desc:"A powerful wyrm with tremendous strength. Known to destroy mountains. Legends say it will one day don armor of living steel.",
    lore:"Serpenthos is a young dragon-serpent 1.5 metres long with green-bronze scales and a flat cobra-like hood it flares when threatened. Its wings are still developing and cannot support flight. It inhabits river caves and hunts fish by lunging from concealed positions near the water surface." },

  174: { id:174, name:"Scalevorn", emoji:"🦕", types:["Dragon","Steel"],
    base:{hp:88,atk:115,def:118,spa:75,spd:85,spe:62},
    learnset:[[1,"dragon_claw"],[1,"metal_claw"],[20,"dragon_pulse"],[30,"flash_cannon"],[40,"iron_tail"],[50,"outrage"],[60,"forge_strike"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:275, rarity:"rare",
    desc:"The final form of the ancient dragon lineage. Its scales have fused into living steel over millennia of battle, creating impenetrable natural armor.",
    lore:"Scalevorn is a powerful dragon-steel hybrid 4 metres long with scales that have hardened into steel-grey metallic plates over centuries. Its body is broad and muscular. It moves on four limbs with its wings folded into secondary arms. Its scales have been used in legendary armour-forging projects." },

  321: { id:321, name:"Dragemian",  emoji:"🐉", types:["Dragon","Fire"],
    base:{hp:86,atk:149,def:101,spa:101,spd:94,spe:66},
    learnset:[[1,"outrage"],[2,"dragon_pulse"],[3,"scale_storm"],[4,"hyper_beam"],[5,"dragon_dance"],[58,"char_dance"],[61,"growl"],[64,"harden"],[65,"flame_fang"],[66,"pyre_fang"],[67,"heat_wave"],[68,"inferno"],[69,"ancient_breath"],[70,"fire_blast"]],
    evolveTo:null, evolveLevel:null, catchRate:5, expYield:340, rarity:"legendary",
    desc:"The lord of all dragons. Its fire is hot enough to melt any metal.",
    lore:"Dragemian is a legendary fire-dragon of enormous size, estimated at 12 metres from snout to tail. Its scales are deep crimson-black edged with gold, and two enormous curved horns sweep back from its broad angular skull. Its wings span nearly 20 metres and darken the sky when spread. Ancient texts describe it as the progenitor of all fire dragon lineages, and its breath weapon — a sustained column of solar-temperature fire — can be seen from the horizon." },

  175: { id:175, name:"Neruveth",    emoji:"🦭", types:["Water","Dragon"],
    base:{hp:71,atk:104,def:76,spa:98,spd:92,spe:88},
    learnset:[[1,"water_gun",[28,"eon_crash"]],[1,"dragon_breath"],[14,"surf"],[17,"harden"],[22,"dragon_claw"],[30,"hydro_pump"],[31,"coral_barrage"],[38,"dragon_pulse"],[43,"tidal_crush"],[46,"outrage",[5,"tidecaller"]],[3,"deepwater_hymn"],[34,"ocean_tempest"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A sea dragon that rules the ocean floor. Massive and aquatic.",
    lore:"Neruveth is a serpentine water-dragon 5 metres long with fluid blue-green scales and a flowing fin-crest from snout to tail. Its underbelly glows with bioluminescent blue. It inhabits deep ocean trenches and ascends to shallower water only to feed, drawing vast schools of fish upward with its bioluminescence." },

  176: { id:176, name:"Tempyroth",   emoji:"⚡", types:["Electric","Dragon"],
    base:{hp:68,atk:82,def:62,spa:117,spd:78,spe:113},
    learnset:[[1,"thunder_shock",[28,"wyrm_strike"]],[1,"dragon_breath"],[12,"thunderbolt"],[17,"harden"],[20,"dragon_claw"],[28,"thunder"],[30,"dynamo_whip"],[36,"dragon_pulse"],[42,"eon_crash"],[44,"outrage",[5,"thunder_wave"]],[3,"static_cage"],[33,"ion_cannon"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A dragon of lightning storms. Calls down thunder with each roar.",
    lore:"Tempyroth is a sleek electric-dragon 4 metres long with chrome-yellow and black scales that crackle with electrical charge. Its wing membranes are translucent yellow. It creates a continuous corona of electricity around its body while flying, visible at night as a moving chain of lightning." },

  177: { id:177, name:"Glaciroth",emoji:"💠", types:["Ice","Dragon"],
    base:{hp:73,atk:96,def:79,spa:115,spd:100,spe:74},
    learnset:[[1,"powder_snow",[28,"scale_storm"]],[1,"dragon_breath"],[13,"ice_beam"],[21,"dragon_claw"],[24,"recover"],[29,"blizzard"],[37,"dragon_pulse"],[44,"cryo_lance"],[45,"outrage"],[53,"ice_punch",[5,"permafrost"]],[3,"winter_shroud"],[38,"glacial_tomb"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A crystal dragon of ice. Its scales deflect nearly any attack.",
    lore:"Glaciroth is a magnificent ice-dragon 6 metres long with deep sapphire-blue scales and a crest of crystal ice spines along its neck. Its underbelly is pale white. Its breath produces a stream of sub-zero air that flash-freezes anything within 20 metres. It sleeps buried under glacier ice for decades." },

  // ===== NORMAL =====
  178: { id:178, name:"Fluffen",     emoji:"🐱", types:["Normal"],
    base:{hp:64,atk:55,def:43,spa:41,spd:48,spe:54},
    learnset:[[1,"tackle",[20,"momentum_rush"]],[1,"growl"],[8,"scratch"],[16,"quick_attack"],[24,"body_slam"],[29,"harden"],[32,"headbutt"],[40,"hyper_beam",[5,"tail_whip"]],[3,"leer"],[31,"endure_pulse"]],
    evolveTo:179, evolveLevel:20, catchRate:220, expYield:68, rarity:"common",
    desc:"An adorable fur ball. Incredibly soft but surprisingly tough in a fight.",
    lore:"Fluffen is a small round cat about 20 cm tall with enormously fluffy cream-white fur that makes it appear twice its actual size. Its tiny face is barely visible through the fur. It is the softest-feeling creature known and produces a continuous low purr that has documented calming effects on nearby creatures." },

  179: { id:179, name:"Velvetine",    emoji:"🐈", types:["Normal"],
    base:{hp:83,atk:91,def:82,spa:55,spd:66,spe:100},
    learnset:[[1,"scratch"],[2,"quick_attack"],[3,"growl"],[21,"body_slam"],[26,"harden"],[29,"headbutt"],[30,"leer"],[37,"hyper_beam"],[38,"swords_dance"],[47,"vital_pulse"],[56,"instinct_slash"],[65,"night_slash"],[4,"tail_whip"],[44,"tackle"]],
    evolveTo:null, evolveLevel:null, catchRate:80, expYield:180, rarity:"common",
    desc:"A graceful cat with retractable steel-like claws. Nimble and quick.",
    lore:"Velvetine is a sleek adult cat 35 cm at the shoulder with short, incredibly smooth dark-grey fur that shimmers like silk. Its eyes are pale gold. It moves with total silence on any surface and is nearly impossible to sneak up on in return. It prefers warmth and high vantage points in settled areas." },

  180: { id:180, name:"Lopikin",     emoji:"🐰", types:["Normal"],
    base:{hp:43,atk:44,def:38,spa:38,spd:38,spe:78},
    learnset:[[1,"tackle",[20,"wild_tumble"]],[1,"tail_whip"],[8,"quick_attack"],[16,"headbutt"],[17,"recover"],[24,"body_slam",[5,"growl"]],[29,"harden"],[39,"vital_pulse"]],
    evolveTo:181, evolveLevel:18, catchRate:255, expYield:55, rarity:"common",
    desc:"A swift rabbit with huge ears. Can hear predators from far away.",
    lore:"Lopikin is a small rabbit 25 cm long with oversized hind legs and soft white-grey fur. Its long ears pivot independently in different directions. It can leap 3 metres horizontally from standing still. It lives in warrens on open plains and maintains elaborate underground tunnel networks as escape routes." },

  181: { id:181, name:"Boundrix",  emoji:"🐇", types:["Normal"],
    base:{hp:88,atk:74,def:49,spa:71,spd:59,spe:117},
    learnset:[[1,"quick_attack"],[2,"headbutt"],[3,"tackle"],[4,"recover"],[5,"growl"],[18,"wild_tumble"],[21,"body_slam"],[27,"leer"],[36,"battle_cry"],[45,"swords_dance"],[54,"momentum_rush"],[63,"hyper_beam"],[6,"tail_whip"],[43,"scratch"]],
    evolveTo:null, evolveLevel:null, catchRate:100, expYield:165, rarity:"common",
    desc:"A super-quick bouncing rabbit. Few can outrun this energetic creature.",
    lore:"Boundrix is a lean racing rabbit 45 cm long with short brown fur, long muscular legs, and a compact aerodynamic body shape. Its ears lie flat when running. It can sustain sprints of extraordinary speed for short distances and uses evasion rather than combat as its primary survival strategy." },

  182: { id:182, name:"Rotunden",   emoji:"🐻", types:["Normal"],
    base:{hp:81,atk:67,def:62,spa:52,spd:41,spe:48},
    learnset:[[1,"tackle",[22,"battle_cry"]],[1,"growl"],[10,"headbutt"],[18,"body_slam"],[26,"swords_dance"],[30,"scratch"],[34,"hyper_beam"],[42,"recover",[5,"tail_whip"]],[3,"leer"],[32,"double_strike"]],
    evolveTo:183, evolveLevel:25, catchRate:140, expYield:98, rarity:"common",
    desc:"A roly-poly bear. Loves honey and naps. Surprisingly strong when angry.",
    lore:"Rotunden is a chubby round bear-like creature 80 cm tall. Its fur is russet-brown and dense, giving it a perfectly spherical silhouette. It stores enormous fat reserves for winter and can be found in autumn gorging on berries and fruit. It is gentle by nature and rarely provoked." },

  183: { id:183, name:"Glutoros",    emoji:"🐻", types:["Normal"],
    base:{hp:113,atk:93,def:79,spa:75,spd:66,spe:58},
    learnset:[[1,"headbutt"],[2,"battle_cry"],[3,"body_slam"],[4,"tail_whip"],[5,"growl"],[6,"tackle"],[25,"swords_dance"],[31,"hyper_beam"],[38,"leer"],[39,"recover"],[51,"harden"],[64,"vital_pulse"],[7,"focus_roar"],[44,"wild_tumble"]],
    evolveTo:184, evolveLevel:44, catchRate:50, expYield:220, rarity:"uncommon",
    desc:"A tubby great bear of enormous power. Its hugs can crush boulders.",
    lore:"Glutoros is a massive bear 1.8 metres at the shoulder with heavy russet-brown fur and a broad rounded back. It has an almost supernatural appetite and can consume quantities of food that seem physically impossible. It is found in areas of extreme natural abundance and its presence indicates healthy ecosystem balance." },

  185: { id:185, name:"Airellin",   emoji:"🐦", types:["Normal","Wind"],
    base:{hp:60,atk:43,def:31,spa:54,spd:50,spe:64},
    learnset:[[1,"tackle",[22,"wild_tumble"]],[1,"gust"],[8,"quick_attack"],[14,"harden"],[16,"wing_attack"],[24,"air_slash"],[25,"vortex_trap"],[32,"body_slam",[5,"growl"]],[34,"instinct_slash"],[42,"skyfall"],[3,"tail_whip"],[33,"feral_swipe"]],
    evolveTo:186, evolveLevel:28, catchRate:180, expYield:72, rarity:"common",
    desc:"A pudgy bird that barely fits in trees. Better at fighting than flying.",
    lore:"Airellin is a small sparrow-like wind bird 15 cm long with pale cream feathers and a round body. It perpetually hovers 30 cm above surfaces rather than perching, even when sleeping. Its feet have atrophied from disuse. It navigates entirely by air current and maintains a mental map of all wind patterns in its territory." },

  187: { id:187, name:"Norindel",     emoji:"🐷", types:["Normal"],
    base:{hp:65,atk:66,def:62,spa:42,spd:44,spe:30},
    learnset:[[1,"tackle",[22,"momentum_rush"]],[1,"growl"],[10,"headbutt"],[14,"recover"],[20,"body_slam"],[24,"battle_cry"],[30,"swords_dance"],[33,"scratch"],[40,"hyper_beam",[5,"tail_whip"]],[42,"wild_tumble"],[3,"leer"],[32,"quick_attack"]],
    evolveTo:188, evolveLevel:30, catchRate:170, expYield:80, rarity:"common",
    desc:"A snuffling pig Lumori that loves digging for truffles. Stubborn and cute.",
    lore:"Norindel is a plump pink pig 40 cm at the shoulder with a curly tail and a perpetually contented expression. It roots in rich soil with its broad sensitive snout and locates buried tubers, truffles, and underground water sources with remarkable accuracy. Farmers prize it as a living divining rod." },

  // ===== ROCK =====
  191: { id:191, name:"Petrikin",   emoji:"🪨", types:["Rock"],
    base:{hp:60,atk:63,def:73,spa:46,spd:31,spe:45},
    learnset:[[1,"tackle",[22,"obsidian_crash"]],[1,"rock_throw"],[8,"harden"],[16,"headbutt"],[24,"rock_slide"],[29,"tail_whip"],[32,"stone_edge"],[40,"body_slam",[5,"granite_wall"]],[3,"petrify_gaze"],[31,"growl"]],
    evolveTo:192, evolveLevel:25, catchRate:160, expYield:88, rarity:"common",
    desc:"A rock puppy with pebble-studded fur. Loves rolling into a ball.",
    lore:"Petrikin is a small rock creature 20 cm tall shaped like a round pebble with two tiny legs and a somewhat surprised-looking face embedded in the stone. It is almost indistinguishable from an ordinary river pebble when still. It lives in streambeds and rolls with the current when travelling." },

  192: { id:192, name:"Lithavast",emoji:"🪨", types:["Rock","Ground"],
    base:{hp:82,atk:108,def:112,spa:50,spd:57,spe:69},
    learnset:[[1,"rock_throw"],[2,"headbutt"],[3,"harden"],[4,"rock_slide"],[5,"granite_wall"],[29,"stone_edge"],[33,"tremor_stomp"],[37,"body_slam"],[41,"earth_power"],[49,"crystal_lance"],[57,"landslide"],[65,"earthquake"],[6,"petrify_gaze"],[44,"magnitude"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:222, rarity:"uncommon",
    desc:"A boulder hound encrusted with stones. Can cause landslides by running.",
    lore:"Lithavast is a large rock-ground creature 1.5 metres tall shaped like a roughly humanoid boulder. Its features are barely defined but clearly present. It moves by rolling and shifting its own mass. Groups of Lithavast arrange themselves in formations that geologists initially mistake for natural rock outcroppings." },

  193: { id:193, name:"Rugothon",    emoji:"🦞", types:["Rock","Water"],
    base:{hp:71,atk:78,def:89,spa:52,spd:63,spe:68},
    learnset:[[1,"scratch",[25,"geode_burst"]],[1,"rock_throw"],[11,"water_gun"],[16,"swords_dance"],[19,"rock_slide"],[27,"aqua_tail"],[29,"sandstone_rush"],[35,"stone_edge"],[40,"sea_serpent_strike"],[43,"surf",[5,"granite_wall"]],[3,"petrify_gaze"],[33,"landslide"]],
    evolveTo:194, evolveLevel:38, catchRate:75, expYield:168, rarity:"uncommon",
    desc:"A crag claw crab that lives on rocky sea cliffs. Fiercely territorial.",
    lore:"Rugothon is a massive rock-water crustacean 2 metres long with a heavily encrusted shell of barnacles and embedded pebbles. Its eight wide legs are each tipped with flat digging pads. It inhabits rocky coastlines where it is mistaken for a tide-pool feature until it suddenly moves." },

  195: { id:195, name:"Prismolith",  emoji:"💎", types:["Rock","Ice"],
    base:{hp:70,atk:66,def:101,spa:77,spd:87,spe:38},
    learnset:[[1,"rock_throw",[25,"crystal_lance"]],[1,"powder_snow"],[12,"harden"],[17,"swords_dance"],[20,"rock_slide"],[28,"ice_beam"],[31,"stalactite_drop"],[36,"stone_edge"],[43,"icicle_crash"],[44,"blizzard",[5,"granite_wall"]],[3,"petrify_gaze"],[33,"quarry_crush"]],
    evolveTo:196, evolveLevel:40, catchRate:70, expYield:172, rarity:"uncommon",
    desc:"A crystal of ice and stone. Formed under tremendous pressure underground.",
    lore:"Prismolith is a faceted crystal-rock creature 80 cm tall shaped like a natural geode that has grown legs. Its body is a rough dark matrix on the outside, but gaps reveal brilliant purple amethyst crystals within. It moves very slowly and is prized by miners for the high-quality crystals it sheds during moulting." },

  // ===== BUG =====
  197: { id:197, name:"Vermelin",   emoji:"🐛", types:["Bug"],
    base:{hp:42,atk:30,def:35,spa:30,spd:30,spe:39},
    learnset:[[1,"tackle",[5,"silk_bind"]],[1,"string_shot"],[5,"bug_bite",[6,"chitin_guard"]],[13,"growl"],[20,"swords_dance"],[27,"scratch"],[34,"venom_drool"],[41,"mandible_crush"]],
    evolveTo:198, evolveLevel:7, catchRate:255, expYield:39, rarity:"common",
    desc:"A cute caterpillar. Harmless and curious, though it spins strong silk.",
    lore:"Vermelin is a small, worm-like bug creature 8 cm long with a pale green segmented body and a round head with two tiny antennae. It lives entirely underground in loose soil, aerating it as it tunnels. It photosynthesises weakly through thin translucent sections of its skin even below the surface." },

  198: { id:198, name:"Chrysalix",  emoji:"🫙", types:["Bug"],
    base:{hp:46,atk:30,def:58,spa:30,spd:30,spe:30},
    learnset:[[17,"harden"]],
    evolveTo:199, evolveLevel:10, catchRate:120, expYield:72, rarity:"common",
    desc:"A shimmering cocoon. Inside, something remarkable is taking shape.",
    lore:"Chrysalix is a pupating bug creature 12 cm long encased in a hard metallic-green chrysalis shell. Its body within is completely liquefied in the process of transformation. The chrysalis vibrates at a frequency inaudible to humans but felt by nearby insects as a call to gather and guard the emerging adult." },

  199: { id:199, name:"Aeridaleth",emoji:"🦋", types:["Bug","Wind"],
    base:{hp:73,atk:39,def:53,spa:104,spd:85,spe:93},
    learnset:[[14,"leer"],[18,"string_shot"],[22,"gust"],[26,"scratch"],[30,"silk_bind"],[34,"sonic_buzz"],[38,"air_slash"],[42,"dazzling_gleam"],[46,"x_scissor"],[50,"bug_buzz"],[54,"stinger_volley"],[58,"hurricane"],[3,"chitin_guard"],[39,"cocoon_burst"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:170, rarity:"uncommon",
    desc:"A glorious butterfly of wind and beauty. Its wing patterns mesmerize foes.",
    lore:"Aeridaleth is a large butterfly 60 cm wingspan with wings displaying intricate patterns in deep teal, gold, and black. It emerged from Chrysalix through a dramatic transformation. It undertakes migrations of thousands of kilometres, navigating by magnetic fields and producing a floral scent that persists in its wake for hours." },

  200: { id:200, name:"Colerix",  emoji:"🪲", types:["Bug","Rock"],
    base:{hp:61,atk:73,def:71,spa:43,spd:51,spe:30},
    learnset:[[1,"bug_bite",[22,"mandible_crush"]],[1,"rock_throw"],[10,"headbutt"],[18,"x_scissor"],[20,"leer"],[26,"rock_slide"],[34,"stone_edge",[5,"string_shot"]],[36,"swarm_dive"],[3,"chitin_guard"],[31,"magma_rock"]],
    evolveTo:201, evolveLevel:25, catchRate:130, expYield:95, rarity:"common",
    desc:"A heavily armored beetle. Its rock-hard shell is practically indestructible.",
    lore:"Colerix is a beetle 12 cm long with a hard iridescent wing-case that shifts between emerald and sapphire depending on viewing angle. Its underside is pale gold. It lives in old-growth forest canopy and cuts precise circular holes in leaves that it then rolls into tubes for egg-laying." },

  201: { id:201, name:"Scarabion",  emoji:"🪲", types:["Bug","Steel"],
    base:{hp:88,atk:124,def:94,spa:64,spd:69,spe:46},
    learnset:[[1,"x_scissor"],[2,"string_shot"],[25,"rock_slide"],[30,"harden"],[31,"stone_edge"],[33,"swarm_dive"],[35,"pheromone_rush"],[40,"flash_cannon"],[45,"bug_buzz"],[50,"stinger_volley"],[55,"iron_tail"],[60,"hyper_beam"],[3,"chitin_guard"],[39,"cocoon_burst"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A steel beetle of terrifying might. Its mandibles can cut through iron.",
    lore:"Scarabion is a large scarab beetle 20 cm long with a metallic copper-gold carapace etched with natural hieroglyphic-like patterns. Its wide horns are used to roll large balls of compressed organic material that it buries as food caches. Ancient cultures venerated it as a symbol of renewal and persistence." },


  // ===== BATCH 1: POISON/DRAGON, ELECTRIC, FIRE/ICE (IDs 206-214) =====

  // 3-stage Poison/Dragon chain: Venomscale → Toxidrak → Dragovenom
  206: { id:206, name:"Venomscale", emoji:"🐍", types:["Poison","Dragon"],
    base:{hp:50,atk:62,def:50,spa:68,spd:52,spe:65},
    learnset:[[1,"poison_sting"],[1,"dragon_breath"],[12,"sludge_bomb"],[22,"dragon_claw"],[32,"toxic"],[42,"dragon_pulse"],[52,"venom_lance"],[62,"hyper_beam"]],
    evolveTo:207, evolveLevel:26, catchRate:180, expYield:72, rarity:"common",
    desc:"A small serpent whose venom has a faint draconic energy. Its fangs drip with corrosive toxin.",
    lore:"Venomscale is a small dragon-serpent 40 cm long with vivid green scales overlaid with yellow warning banding. Its fangs are visibly elongated and hollow. It inhabits tropical jungle undergrowth and hunts by striking from concealment, relying on venom rather than constriction to subdue prey." },

  207: { id:207, name:"Venodrak", emoji:"🐉", types:["Poison","Dragon"],
    base:{hp:75,atk:90,def:68,spa:98,spd:72,spe:80},
    learnset:[[1,"sludge_bomb"],[1,"dragon_claw"],[20,"toxic"],[28,"dragon_pulse"],[36,"venom_lance"],[44,"outrage"],[52,"sludge_wave"],[60,"hyper_beam"]],
    evolveTo:208, evolveLevel:46, catchRate:90, expYield:148, rarity:"uncommon",
    desc:"A dragon-serpent that breathes venomous mist. Its flight path traces poisonous trails through the sky.",
    lore:"Venodrak is a dragon-serpent 1.5 metres long with purple-black scales banded in sickly yellow. Its narrow wings allow limited gliding between trees. It hunts from the forest canopy, dropping onto prey below and injecting a fast-acting paralytic venom before taking flight again." },

  208: { id:208, name:"Wyrmvenom", emoji:"🐲", types:["Poison","Dragon"],
    base:{hp:88,atk:105,def:80,spa:114,spd:87,spe:76},
    learnset:[[1,"venom_lance"],[1,"outrage"],[30,"sludge_wave"],[38,"dragon_pulse"],[46,"dragon_dance"],[54,"corrosion_fang"],[62,"ancient_breath"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:28, expYield:262, rarity:"rare",
    desc:"A venomous wyvern of terrible power. Its mere presence poisons the ground for miles around.",
    lore:"Wyrmvenom is a massive venomous dragon 5 metres long with deep olive-green scales marked in yellow-orange bands. Its wingspan spans 7 metres. Its venom glands are the largest of any known creature, producing a cocktail that dissolves organic tissue rapidly. It is feared across tropical regions." },

  // 2-stage Normal/Electric chain: Boltfur → Thundermane (level 30)
  209: { id:209, name:"Boltfur", emoji:"🐇", types:["Normal","Electric"],
    base:{hp:58,atk:52,def:48,spa:65,spd:58,spe:88},
    learnset:[[1,"thunder_shock"],[1,"tackle"],[12,"spark"],[22,"thunderbolt"],[32,"discharge"],[42,"volt_surge"],[52,"ball_lightning"],[60,"hyper_beam"]],
    evolveTo:210, evolveLevel:30, catchRate:155, expYield:82, rarity:"common",
    desc:"A rabbit-like creature whose fur stands permanently on end from static electricity. Leaves sparks wherever it hops.",
    lore:"Boltfur is a small normal-electric rabbit 20 cm long with yellow-white fur that stands permanently on end, giving it a spiky silhouette. Its long ears act as static accumulators. In dry weather its fur produces visible sparks with every movement. It communicates with other Boltfur by controlled static discharge patterns." },

  210: { id:210, name:"Thundermane", emoji:"🦁", types:["Normal","Electric"],
    base:{hp:89,atk:85,def:75,spa:105,spd:87,spe:109},
    learnset:[[1,"thunderbolt"],[1,"body_slam"],[24,"discharge"],[32,"volt_surge"],[40,"thunder"],[48,"ball_lightning"],[56,"plasma_strike"],[64,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:42, expYield:222, rarity:"uncommon",
    desc:"An electric lion whose mane generates constant lightning storms. The pride leader of its herd.",
    lore:"Thundermane is a normal-electric lion 1.2 metres at the shoulder with a tawny body and a mane of crackling yellow-white lightning that generates constant audible crackling. Its steps discharge static into the ground. It rules open savannahs and signals territorial boundaries with rolling thunder produced by mane flares." },

  // 3-stage Fire/Ice chain: Cinderfrost → Glaciblaze → Pyroglacier
  211: { id:211, name:"Cinderfrost", emoji:"🔥", types:["Fire","Ice"],
    base:{hp:48,atk:58,def:45,spa:72,spd:55,spe:68},
    learnset:[[1,"ember"],[1,"powder_snow"],[12,"flamethrower"],[22,"ice_beam"],[32,"fire_blast"],[42,"blizzard"],[52,"overheat"],[62,"hyper_beam"]],
    evolveTo:212, evolveLevel:28, catchRate:175, expYield:72, rarity:"common",
    desc:"A creature born where volcanic vents meet glacial ice. Its body perpetually cycles between fire and frost.",
    lore:"Cinderfrost is a small fire-ice creature 40 cm long resembling a lizard with the left half of its body covered in warm orange fire-scales and the right half in cold blue ice-scales. A visible boundary of crackling energy runs down its midline. Where its two natures meet, brief steam eruptions occur." },

  212: { id:212, name:"Frostscorch", emoji:"🌡️", types:["Fire","Ice"],
    base:{hp:74,atk:82,def:68,spa:108,spd:88,spe:88},
    learnset:[[1,"flamethrower"],[1,"ice_beam"],[22,"fire_blast"],[30,"blizzard"],[38,"frost_breath"],[46,"overheat"],[54,"glacial_tomb"],[62,"hyper_beam"]],
    evolveTo:213, evolveLevel:46, catchRate:88, expYield:155, rarity:"uncommon",
    desc:"A dual-natured creature of perfect thermal balance. Its left side blazes while its right side freezes.",
    lore:"Frostscorch is a medium fire-ice creature 80 cm long with a perfectly equal split — one half brilliant crimson, one half ice-blue. Its eyes are mismatched: one amber, one pale blue. It inhabits the specific boundary zones between volcanic and glacial terrain, the only creature perfectly adapted for that harsh transition." },

  213: { id:213, name:"Infriglace", emoji:"🌋", types:["Fire","Ice"],
    base:{hp:89,atk:93,def:81,spa:120,spd:95,spe:72},
    learnset:[[1,"fire_blast"],[1,"blizzard"],[32,"overheat"],[40,"glacial_tomb"],[48,"heat_wave"],[56,"icicle_crash"],[64,"caldera_meltdown"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:268, rarity:"rare",
    desc:"A cataclysmic being that collapses the boundary between fire and ice. Superheated geysers and flash-freezes occur in its wake.",
    lore:"Infriglace is a colossal fire-ice titan 3 metres long. Its left side blazes with a volcanic orange-red and its right is encased in glacial ice that never melts. The boundary between its natures is a permanent crackling storm of steam. Its very presence disrupts local climate in a radius of several kilometres." },

  // Standalone Water/Rock: Coralstone
  214: { id:214, name:"Petrwave", emoji:"🪸", types:["Water","Rock"],
    base:{hp:101,atk:96,def:117,spa:83,spd:99,spe:54},
    learnset:[[1,"water_gun"],[1,"rock_throw"],[18,"surf"],[28,"stone_edge"],[38,"hydro_pump"],[48,"rock_slide"],[58,"bedrock_slam"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:48, expYield:212, rarity:"uncommon",
    desc:"A living coral fortress. Anchors itself to seafloor rocks and grows for centuries, becoming near-indestructible.",
    lore:"Petrwave is a 1.5-metre coral fortress creature resembling a crab whose shell is built from a mass of densely packed living coral and rock. Its four broad legs anchor it to seafloor rock. It filters nutrients from strong ocean currents and its shell provides habitat for thousands of small marine organisms." },

  // ===== BATCH 1: PSYCHIC/DARK TYPES (IDs 215-221) =====

  // 3-stage Ghost/Psychic chain: Spiritch → Phantorge → Spectraith
  215: { id:215, name:"Veilwisp", emoji:"🌀", types:["Psychic"],
    base:{hp:40,atk:42,def:30,spa:68,spd:52,spe:72},
    learnset:[[1,"confusion"],[1,"psybeam"],[12,"calm_mind"],[20,"psychic_move"],[28,"moonblast"],[36,"psystrike"],[44,"neural_storm"],[52,"astral_rend"]],
    evolveTo:216, evolveLevel:26, catchRate:175, expYield:68, rarity:"common",
    desc:"A wisp of pure psychic energy. Drifts through reality reading the thoughts of every living thing nearby.",
    lore:"Veilwisp is a floating psychic orb 20 cm across made of condensed translucent violet energy. Its form shifts between a perfect sphere and a wispy irregularity as its thoughts wander. It drifts through solid objects as if they do not exist and leaves a brief afterimage wherever it passes." },

  216: { id:216, name:"Mindrift", emoji:"🌫️", types:["Psychic"],
    base:{hp:65,atk:65,def:52,spa:102,spd:80,spe:88},
    learnset:[[1,"psybeam"],[1,"calm_mind"],[20,"psychic_move"],[28,"moonblast"],[36,"psystrike"],[44,"neural_storm"],[52,"astral_rend"],[60,"hyper_beam"]],
    evolveTo:217, evolveLevel:44, catchRate:90, expYield:145, rarity:"uncommon",
    desc:"A drifting psychic entity that bridges the conscious and unconscious mind. Its form shifts like fog.",
    lore:"Mindrift is a larger psychic entity 40 cm across with a body like a slowly rotating galaxy of blue-white light particles. No fixed centre is visible — it is simultaneously everywhere within its form. It is drawn to sleeping creatures and hovers above their heads to sample their dream-states." },

  217: { id:217, name:"Mentovast", emoji:"🔮", types:["Psychic"],
    base:{hp:82,atk:70,def:67,spa:132,spd:106,spe:93},
    learnset:[[1,"psychic_move"],[1,"moonblast"],[30,"psystrike"],[38,"neural_storm"],[46,"astral_rend"],[54,"psybeam"],[62,"calm_mind"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A vast psychic intelligence that defies physical form. Peers into the deepest layers of consciousness.",
    lore:"Mentovast is a vast psychic intelligence that lacks a physical body, instead manifesting as a shimmering distortion in the air roughly 1 metre across. Nearby objects float slightly and light bends toward it. It exists primarily in a mental dimension and its physical manifestation is merely an accidental side-effect." },

  // 2-stage Ghost/Dark chain: Mistwraith → Shademont (item evo: Dusk Stone)
  218: { id:218, name:"Duskmist", emoji:"🌑", types:["Dark"],
    base:{hp:55,atk:62,def:48,spa:85,spd:68,spe:75},
    learnset:[[1,"bite"],[1,"dark_pulse"],[14,"night_slash"],[24,"eclipse_shroud"],[34,"crunch"],[44,"soul_rend"],[54,"dread_howl"],[60,"hyper_beam"]],
    evolveTo:219, evolveLevel:null, evolveItem:"duskStone", evolveMethod:"item", catchRate:130, expYield:102, rarity:"common",
    desc:"A dark mist that drains ambient light and warmth. Those who walk through it feel inexplicable despair.",
    lore:"Duskmist is a dark entity 50 cm across resembling a patch of shadow that has achieved self-awareness. It drains colour and warmth from everything it passes through. In its presence visible light dims and breath becomes visible as if suddenly cold. It inhabits spaces between buildings and under dense tree canopies." },

  219: { id:219, name:"Nightmont", emoji:"🖤", types:["Dark"],
    base:{hp:80,atk:88,def:74,spa:122,spd:100,spe:86},
    learnset:[[1,"dark_pulse"],[1,"eclipse_shroud"],[28,"night_slash"],[36,"crunch"],[44,"soul_rend"],[52,"dread_howl"],[60,"dark_pulse"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:225, rarity:"rare",
    desc:"A mountain of absolute darkness. Creates a shadow zone where no light can penetrate for hundreds of meters.",
    lore:"Nightmont is a massive dark creature 3 metres tall shaped like a perfectly black mountain. Its form is absolute darkness with only two dim red pinpoints for eyes. The shadow it casts in artificial light has no clear edges, as if the shadow itself is also alive. It moves only when unobserved." },

  // 2-stage Ghost/Normal chain: Hauntrix → Grimveil (level 34)
  220: { id:220, name:"Umbrajest", emoji:"🎭", types:["Dark","Psychic"],
    base:{hp:62,atk:58,def:55,spa:78,spd:62,spe:82},
    learnset:[[1,"bite"],[1,"confusion"],[12,"dark_pulse"],[22,"psybeam"],[32,"night_slash"],[42,"psychic_move"],[52,"eclipse_shroud"],[60,"hyper_beam"]],
    evolveTo:221, evolveLevel:34, catchRate:145, expYield:92, rarity:"common",
    desc:"A trickster in a dark jester's mask. Uses psychic illusions and dark energy to confuse and terrify.",
    lore:"Umbrajest is a dark-psychic trickster creature 60 cm tall with a wispy smoke-black body and a permanent wide grin formed by luminescent patches. Its eyes are bright and mischievous. It delights in rearranging objects in darkened rooms and projecting images of feared things into the peripheral vision of passers-by." },



  // ===== BATCH 2: GHOST/PSYCHIC/DRAGON (IDs 221-235) =====

  // Grimveil (evolves from Hauntrix 220)
  221: { id:221, name:"Shadowveil", emoji:"🎪", types:["Dark","Psychic"],
    base:{hp:91,atk:84,def:78,spa:109,spd:91,spe:97},
    learnset:[[1,"dark_pulse"],[1,"psychic_move"],[26,"night_slash"],[34,"eclipse_shroud"],[42,"soul_rend"],[50,"dread_howl"],[58,"moonblast"],[66,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:220, rarity:"uncommon",
    desc:"A master of dark illusions. Those who witness its act lose themselves in psychic nightmares for days.",
    lore:"Shadowveil is a dark-psychic creature 90 cm tall resembling a tall humanoid draped in a cloak of living shadow. Its face is blank except for two silver eyes. It is impossible to touch directly — hands pass through its shadow-substance — but it can interact physically by will. It observes from darkened doorways." },

  // 3-stage Psychic chain: Mindpuff → Cerebrix → Psytheon
  222: { id:222, name:"Mindpuff", emoji:"🫧", types:["Psychic"],
    base:{hp:42,atk:35,def:38,spa:70,spd:58,spe:65},
    learnset:[[1,"confusion"],[1,"psybeam"],[10,"calm_mind"],[20,"psychic_move"],[30,"moonblast"],[40,"psystrike"],[50,"neural_storm"],[60,"hyper_beam"]],
    evolveTo:223, evolveLevel:24, catchRate:190, expYield:65, rarity:"common",
    desc:"A floating blob of pure thought-energy. Its mood is contagious to nearby Lumori.",
    lore:"Mindpuff is a small psychic creature 20 cm across resembling a round cloud-puff of blue-silver light with two bright eyes. It bounces gently in the air and broadcasts simple emotions outward in waves — contentment, curiosity, mild alarm. It is drawn to calm environments and distressed by conflict." },

  223: { id:223, name:"Cerebrix", emoji:"🧠", types:["Psychic"],
    base:{hp:64,atk:52,def:58,spa:105,spd:88,spe:82},
    learnset:[[1,"psybeam"],[1,"calm_mind"],[18,"psychic_move"],[28,"moonblast"],[38,"psystrike"],[48,"neural_storm"],[56,"astral_rend"],[64,"hyper_beam"]],
    evolveTo:224, evolveLevel:42, catchRate:90, expYield:145, rarity:"uncommon",
    desc:"An evolved brain-creature with exponential intelligence. Solves complex equations for fun.",
    lore:"Cerebrix is a medium psychic creature 50 cm tall with a smooth ovoid body of pale blue-violet and a large visible cranium through which psychic energy pulses rhythmically. Its four thin limbs end in long sensitive fingers. It can scan a mind in seconds and retains perfect recall of all information it encounters." },

  224: { id:224, name:"Psytheon", emoji:"🔮", types:["Psychic","Fairy"],
    base:{hp:82,atk:63,def:74,spa:131,spd:112,spe:88},
    learnset:[[1,"psychic_move"],[1,"moonblast"],[32,"psystrike"],[40,"neural_storm"],[48,"astral_rend"],[56,"dazzling_gleam"],[64,"celestial_wave"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:265, rarity:"rare",
    desc:"The apex psychic being. Its thoughts reshape reality in its immediate vicinity.",
    lore:"Psytheon is a graceful psychic-fairy creature 70 cm tall resembling a humanoid with oversized head and delicate crystal wings. Its body is pale lavender with gold trim on its wings. It exudes a field of concentrated wonder that makes nearby creatures briefly lose track of their fears. Artists claim it inspires creativity." },

  // Standalone Psychic/Fairy: Glimmerkin
  225: { id:225, name:"Glimmerkin", emoji:"✨", types:["Psychic","Fairy"],
    base:{hp:82,atk:60,def:72,spa:115,spd:105,spe:88},
    learnset:[[1,"fairy_wind"],[1,"confusion"],[15,"dazzling_gleam"],[25,"moonblast"],[35,"psybeam"],[45,"psychic_move"],[55,"celestial_wave"],[65,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:210, rarity:"uncommon",
    desc:"A crystalline fairy of pure mental energy. Its body refracts light into impossible colors.",
    lore:"Glimmerkin is a small psychic-fairy creature 30 cm tall with a rounded glowing body of warm pink-gold light. It leaves a trail of glimmer-dust wherever it floats. It inhabits libraries, art studios, and places of quiet human creativity, feeding on the ambient ambient creative energy generated there." },

  // Split evolution family: Prismoo → 3 forms via stones
  // Spectroo (base, Normal/Psychic) → Prismace (Fire Stone), Prismoon (Moon Stone), Prismolt (Thunder Stone)
  226: { id:226, name:"Spectroo", emoji:"🌈", types:["Normal","Psychic"],
    base:{hp:60,atk:55,def:55,spa:68,spd:60,spe:62},
    learnset:[[1,"tackle"],[1,"confusion"],[14,"psybeam"],[22,"fairy_wind"],[30,"moonblast"],[40,"psychic_move"],[50,"hyper_beam"]],
    evolveTo:227, evolveLevel:null, evolveItem:"firestone", evolveMethod:"item", catchRate:140, expYield:88, rarity:"common",
    desc:"A prism-shaped creature full of untapped potential. Exposure to different energies changes its form entirely.",
    lore:"Spectroo is a normal-psychic creature 40 cm long resembling a kangaroo made of translucent white light. Its pouch holds concentrated psychic energy. It hops through open fields and its presence makes detailed hallucinations of past events visible in the area — a form of psychic archaeology." },

  // Spectrace: Fire Stone evolution (Fire/Psychic)
  227: { id:227, name:"Spectrace", emoji:"🔥", types:["Fire","Psychic"],
    base:{hp:78,atk:95,def:65,spa:118,spd:72,spe:92},
    learnset:[[1,"flamethrower"],[1,"psychic_move"],[28,"fire_blast"],[36,"psystrike"],[44,"astral_rend"],[52,"overheat"],[60,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:225, rarity:"rare",
    desc:"A blazing prism warrior. Its psychic fire burns away illusions and exposes hidden truths.",
    lore:"Spectrace is a fire-psychic creature 50 cm long resembling a fast-moving trail of orange-violet flame with barely visible limbs. Its body is heat and psychic energy intertwined. It moves so rapidly its form appears as a blurred streak. Ancient texts describe it arriving at prophetic moments as an omen of transformation." },

  // Spectroon: Moon Stone evolution (Ice/Psychic)
  228: { id:228, name:"Lunaroon", emoji:"🌙", types:["Ice","Psychic"],
    base:{hp:82,atk:72,def:88,spa:122,spd:108,spe:78},
    learnset:[[1,"ice_beam"],[1,"psychic_move"],[28,"blizzard"],[36,"psystrike"],[44,"astral_rend"],[52,"frost_breath"],[60,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:225, rarity:"rare",
    desc:"A moonlit prism draped in eternal winter. Its gaze freezes time momentarily.",
    lore:"Lunaroon is an ice-psychic creature 50 cm tall resembling a rounded creature with a body of compressed moonlight — pale silver-blue and cold to approach. It is visibly brighter during full moon phases. It inhabits high open plateaux and maps the positions of stars by psychic observation, never needing to look up." },

  // Prismolt: Thunder Stone evolution (Electric/Psychic)
  229: { id:229, name:"Prismolt", emoji:"⚡", types:["Electric","Psychic"],
    base:{hp:72,atk:88,def:62,spa:130,spd:78,spe:110},
    learnset:[[1,"thunderbolt"],[1,"psychic_move"],[28,"thunder"],[36,"psystrike"],[44,"astral_rend"],[52,"discharge"],[60,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:225, rarity:"rare",
    desc:"A thunderstruck prism crackling with psychic lightning. Thoughts become electrical impulses at its speed.",
    lore:"Prismolt is an electric-psychic creature 40 cm long resembling a small fish whose body is a continuous spectrum of shifting colour. Electrical and psychic energies form a unified field around it. It inhabits the upper atmosphere, surfacing near radio towers and electrical masts to feed on broadcast radiation." },

  // ===== DRAGON TYPES (IDs 230-235) =====

  // 2-stage Dragon chain: Scaleling → Wyvaxis
  230: { id:230, name:"Scaleling", emoji:"🐊", types:["Dragon"],
    base:{hp:58,atk:72,def:62,spa:60,spd:55,spe:58},
    learnset:[[1,"tackle"],[1,"dragon_breath"],[16,"dragon_claw"],[26,"dragon_pulse"],[36,"dragon_dance"],[46,"outrage"],[56,"hyper_beam"]],
    evolveTo:231, evolveLevel:36, catchRate:150, expYield:90, rarity:"common",
    desc:"A young river drake with scales that shimmer like gemstones. Fierce despite its small size.",
    lore:"Scaleling is a tiny dragon hatchling 15 cm long with shiny copper-red scales and an oversized head. Its wings are crumpled against its body and not yet functional. It inhabits rocky outcroppings and practises flight by jumping from increasingly high ledges, rarely succeeding but never deterred." },

  231: { id:231, name:"Wyvaxis", emoji:"🐲", types:["Dragon","Water"],
    base:{hp:91,atk:109,def:84,spa:94,spd:78,spe:94},
    learnset:[[1,"dragon_claw"],[1,"surf"],[30,"dragon_pulse"],[38,"dragon_dance"],[46,"hydro_pump"],[54,"outrage"],[62,"ancient_breath"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A river drake that has mastered both land and water. Controls currents with its dragon energy.",
    lore:"Wyvaxis is a water-dragon 2 metres long with streamlined aqua-blue and emerald scales and a broad flat tail optimised for powerful swimming strokes. It is more fish than lizard in movement, rarely leaving water except to bask on rocks. Its wings are vestigial fins that aid steering underwater." },

  // 3-stage Dragon/Ground chain: Draxon → Serpenthorn → Wyvernak
  232: { id:232, name:"Serphaxon", emoji:"🦎", types:["Dragon","Ground"],
    base:{hp:52,atk:68,def:65,spa:45,spd:50,spe:55},
    learnset:[[1,"tackle"],[1,"mud_shot"],[14,"dragon_breath"],[24,"earthquake"],[34,"dragon_claw"],[44,"dragon_pulse"],[54,"outrage"],[64,"hyper_beam"]],
    evolveTo:233, evolveLevel:32, catchRate:160, expYield:82, rarity:"common",
    desc:"A ground-burrowing dragon hatchling. Its thick hide absorbs punishment like bedrock.",
    lore:"Serphaxon is a ground-dragon 2.5 metres long with earthy brown-bronze scales and four short powerful legs. Its blunt snout and heavy claws make it a capable excavator. It digs extensive underground lairs in rocky hillsides and uses its weight to collapse cave ceilings onto trespassers." },

  233: { id:233, name:"Serpenthorn", emoji:"🐍", types:["Dragon","Ground"],
    base:{hp:78,atk:98,def:90,spa:65,spd:72,spe:68},
    learnset:[[1,"dragon_claw"],[1,"earthquake"],[26,"earth_power"],[34,"dragon_pulse"],[42,"dragon_dance"],[50,"outrage"],[58,"bedrock_slam"],[66,"hyper_beam"]],
    evolveTo:234, evolveLevel:52, catchRate:75, expYield:165, rarity:"uncommon",
    desc:"A horned serpent that tunnels through mountain roots. Its charge creates fissures in bedrock.",
    lore:"Serpenthorn is a ground-dragon 3 metres long with thick rust-brown scales and numerous backward-curved spines along its back. It rolls along rocky terrain to move quickly, using its spine-ring as a natural wheel. It inhabits ravine systems and is capable of reaching high speed on smooth stone surfaces." },

  234: { id:234, name:"Wyvernak", emoji:"🐉", types:["Dragon","Ground"],
    base:{hp:100,atk:125,def:104,spa:72,spd:83,spe:66},
    learnset:[[1,"outrage"],[1,"earthquake"],[36,"dragon_dance"],[44,"earth_power"],[52,"dragon_pulse"],[60,"bedrock_slam"],[68,"ancient_breath"],[76,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:20, expYield:275, rarity:"rare",
    desc:"An ancient wyvern that has merged with the earth. Mountain ranges shift when it stirs in its sleep.",
    lore:"Wyvernak is a large ground-dragon 4 metres long with broad grey-green scales and a crest of stone spines. Its wings generate dust-clouds when spread. It inhabits canyon systems where it ambushes prey by dropping from cliff ledges and pinning targets under its considerable weight before delivering a killing bite." },

  // Standalone Dragon/Water: Glintscale
  235: { id:235, name:"Glintscale", emoji:"🐟", types:["Dragon","Water"],
    base:{hp:88,atk:98,def:82,spa:101,spd:85,spe:96},
    learnset:[[1,"dragon_claw"],[1,"surf"],[20,"dragon_pulse"],[30,"hydro_pump"],[40,"dragon_dance"],[50,"outrage"],[60,"geyser_burst"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:215, rarity:"uncommon",
    desc:"A dragon-koi of iridescent scales. Legends say it swims the boundary between worlds.",
    lore:"Glintscale is a water-dragon 3 metres long with brilliant silver-green scales that catch light and scatter it in all directions. Underwater it is effectively invisible from above due to this mirroring effect. It uses its reflective scales to confuse and disorient prey, striking when they become disoriented." },



  // ===== BATCH 3: ICE / ELECTRIC / ROCK (IDs 236-250) =====

  // 2-stage Ice chain: Frostick → Glacicore (level 30)
  236: { id:236, name:"Frostick", emoji:"🧊", types:["Ice"],
    base:{hp:50,atk:58,def:52,spa:68,spd:55,spe:62},
    learnset:[[1,"powder_snow"],[1,"tackle"],[12,"frost_breath"],[22,"ice_beam"],[32,"blizzard"],[42,"cryo_lance"],[52,"icicle_crash"],[60,"hyper_beam"]],
    evolveTo:237, evolveLevel:30, catchRate:170, expYield:78, rarity:"common",
    desc:"A porcupine of solid ice. Its quills are natural ice needles that regenerate after use.",
    lore:"Frostick is a very small ice creature 10 cm tall shaped like an icicle with two tiny arms. Its body is pure transparent ice. It forms spontaneously in sub-zero environments and clusters in large groups on cave ceilings, combining into lattice structures for warmth. Individual ones melt quickly in warm hands." },

  237: { id:237, name:"Icevault", emoji:"❄️", types:["Ice","Rock"],
    base:{hp:92,atk:102,def:112,spa:78,spd:88,spe:48},
    learnset:[[1,"ice_beam"],[1,"rock_slide"],[24,"blizzard"],[32,"stone_edge"],[40,"cryo_lance"],[48,"icicle_crash"],[56,"avalanche_drive"],[64,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:215, rarity:"uncommon",
    desc:"A glacier golem of living ice and stone. So cold that even fire moves slowly near it.",
    lore:"Icevault is a medium ice-rock creature 50 cm tall shaped like a small fortress tower of interlocked ice and stone. Its walls are surprisingly thick. It inhabits glacier-topped mountains and creates elaborate ice-and-rock den structures that persist for centuries, providing shelter to generations of smaller creatures." },

  // 3-stage Ice/Wind chain: Snowble → Blizzavane → Permafrix
  238: { id:238, name:"Snowble", emoji:"☃️", types:["Ice","Wind"],
    base:{hp:44,atk:42,def:45,spa:65,spd:52,spe:68},
    learnset:[[1,"powder_snow"],[1,"gust"],[10,"frost_breath"],[18,"air_slash"],[26,"ice_beam"],[36,"blizzard"],[46,"hurricane"],[56,"hyper_beam"]],
    evolveTo:239, evolveLevel:28, catchRate:175, expYield:72, rarity:"common",
    desc:"A snowball that rides wind currents to travel. Gets bigger and angrier in blizzards.",
    lore:"Snowble is a small ice-wind creature 20 cm across shaped like a rounded snowball with two eyes and a perpetual state of gentle tumbling. It is carried effortlessly by any breeze. When it rolls across snow it grows larger, and groups of Snowble combine into enormous snowballs during blizzards." },

  239: { id:239, name:"Blizzariel", emoji:"🌨️", types:["Ice","Wind"],
    base:{hp:68,atk:62,def:65,spa:100,spd:82,spe:90},
    learnset:[[1,"air_slash"],[1,"ice_beam"],[22,"blizzard"],[30,"hurricane"],[38,"cryo_lance"],[46,"icicle_crash"],[54,"avalanche_drive"],[62,"hyper_beam"]],
    evolveTo:240, evolveLevel:44, catchRate:90, expYield:148, rarity:"uncommon",
    desc:"A blizzard spirit that travels on storm winds. Turns clear skies into whiteout conditions.",
    lore:"Blizzariel is a medium ice-wind creature 60 cm tall resembling a humanoid made of condensed blizzard — compacted snow, ice shards, and wind — that holds a roughly consistent form but constantly sheds and reforms its outer layer. Its core is a small dense crystal of frozen wind-energy." },

  240: { id:240, name:"Permafrix", emoji:"🌀", types:["Ice","Wind"],
    base:{hp:83,atk:77,def:80,spa:119,spd:99,spe:92},
    learnset:[[1,"blizzard"],[1,"hurricane"],[32,"cryo_lance"],[40,"icicle_crash"],[48,"avalanche_drive"],[56,"glacial_tomb"],[64,"sleet_barrage"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:28, expYield:265, rarity:"rare",
    desc:"A permanent blizzard given form. The cold zone around it stretches for miles in every direction.",
    lore:"Permafrix is a large ice-wind creature 1 metre tall shaped like an arctic fox whose body is composed of ancient compressed glacier-air. Its fur appears to be made of fine ice needles. It runs at tremendous speed across frozen tundra, leaving no pawprints because it barely contacts the surface." },

  // Standalone Ice/Crystal evolves in cold area: Crystalix
  241: { id:241, name:"Shardlix", emoji:"💠", types:["Ice","Psychic"],
    base:{hp:78,atk:75,def:105,spa:115,spd:100,spe:72},
    learnset:[[1,"ice_beam"],[1,"psychic_move"],[20,"cryo_lance"],[30,"psybeam"],[40,"blizzard"],[50,"psystrike"],[60,"glacial_tomb"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"cosmic_cavern", evolveMethod:"location", catchRate:50, expYield:215, rarity:"uncommon",
    desc:"A crystal lattice of ice and psychic power. Forms only in caves where cosmic energy freezes space itself.",
    lore:"Shardlix is a psychic-ice creature 40 cm tall resembling a bipedal figure made entirely of precision-cut ice crystals fitted together without gaps. Its eyes are two flawless prismatic lenses. It transmits thoughts through vibrations in its crystalline body and can read psychic impressions left on ice surfaces." },

  // 2-stage Electric/Bug chain: Zappling → Voltrix (level 30)
  242: { id:242, name:"Zappling", emoji:"🐞", types:["Electric","Bug"],
    base:{hp:46,atk:55,def:42,spa:68,spd:50,spe:78},
    learnset:[[1,"thunder_shock"],[1,"bug_buzz"],[12,"spark"],[22,"thunderbolt"],[32,"discharge"],[42,"x_scissor"],[52,"thunder"],[60,"hyper_beam"]],
    evolveTo:243, evolveLevel:30, catchRate:170, expYield:75, rarity:"common",
    desc:"A ladybug-like creature that stores electricity in its shell spots. Releases it when threatened.",
    lore:"Zappling is a tiny electric-bug creature 5 cm long resembling a glowing firefly. Its abdomen pulses with yellow-white electric light at regular intervals. Huge swarms congregate in summer nights over open water, and the coordinated light patterns of the swarm are a complex form of collective communication." },

  243: { id:243, name:"Arcdrix", emoji:"🪲", types:["Electric","Bug"],
    base:{hp:72,atk:82,def:68,spa:110,spd:78,spe:98},
    learnset:[[1,"thunderbolt"],[1,"x_scissor"],[24,"discharge"],[32,"bug_buzz"],[40,"thunder"],[48,"volt_surge"],[56,"ball_lightning"],[64,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:215, rarity:"uncommon",
    desc:"An electrified beetle warrior. Its wing-cases generate static as it flies, creating lightning storms.",
    lore:"Arcdrix is a medium electric-bug dragonfly with a 25 cm wingspan. Its four wings are translucent copper edged in electric-blue arcs. It hunts by creating a small electrical trap in mid-air and herding smaller insects into it. It can deliver a precise shock from its tail that stuns prey without killing it." },

  // 3-stage Electric/Fighting chain: Staticlaw → Thundravex → Megavolt
  244: { id:244, name:"Staticlaw", emoji:"🦁", types:["Electric"],
    base:{hp:58,atk:68,def:52,spa:72,spd:55,spe:88},
    learnset:[[1,"thunder_shock"],[1,"spark"],[12,"thunderbolt"],[20,"discharge"],[30,"arc_flash"],[38,"ball_lightning"],[46,"thunder"],[54,"plasma_strike"]],
    evolveTo:245, evolveLevel:28, catchRate:160, expYield:80, rarity:"common",
    desc:"A lion pup whose mane crackles with electricity. Each battle makes its mane larger and brighter.",
    lore:"Staticlaw is a small electric creature 30 cm at the shoulder resembling a weasel with short yellow-white fur that permanently crackles. Its claws generate static charge on contact with any surface. It is perpetually restless and accumulates charge by running in tight circles, periodically discharging into the ground." },

  245: { id:245, name:"Thundravex", emoji:"⚡", types:["Electric"],
    base:{hp:82,atk:90,def:72,spa:110,spd:80,spe:108},
    learnset:[[1,"thunderbolt"],[1,"discharge"],[22,"ball_lightning"],[30,"arc_flash"],[38,"thunder"],[46,"volt_surge"],[54,"plasma_strike"],[62,"hyper_beam"]],
    evolveTo:246, evolveLevel:48, catchRate:75, expYield:165, rarity:"uncommon",
    desc:"A thunder lion that calls down lightning with its roar. Its mane is a living Tesla coil.",
    lore:"Thundravex is a medium electric creature 60 cm at the shoulder resembling a larger weasel-cat with bright yellow fur and dark dorsal stripe. Electrical arcs jump between its ears. It emits a continuous 50 Hz hum audible up close. It inhabits open areas near tall trees it uses as earthing points." },

  246: { id:246, name:"Megavolt", emoji:"🦁", types:["Electric"],
    base:{hp:89,atk:93,def:76,spa:111,spd:80,spe:101},
    learnset:[[1,"thunder"],[1,"discharge"],[32,"ball_lightning"],[40,"plasma_strike"],[48,"arc_flash"],[56,"volt_surge"],[64,"overcharge"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:270, rarity:"rare",
    desc:"A king of thunder whose roar is heard across continents. Lightning bends to its will.",
    lore:"Megavolt is a large electric creature 1 metre at the shoulder resembling a powerful felid with chrome-yellow fur and a mane of crackling electric coils. Its roar is accompanied by a visible electrical shockwave that temporarily blinds and deafens those nearby. It is considered the apex electric predator." },

  // Standalone Electric/Bug: Sparkeen
  247: { id:247, name:"Sparkeen", emoji:"🦋", types:["Electric","Bug"],
    base:{hp:72,atk:68,def:65,spa:102,spd:88,spe:115},
    learnset:[[1,"thunderbolt"],[1,"bug_buzz"],[18,"discharge"],[28,"x_scissor"],[38,"thunder"],[48,"volt_surge"],[58,"ball_lightning"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:210, rarity:"uncommon",
    desc:"An electric butterfly that flickers between flower fields and storm clouds. Its wings spark with each flap.",
    lore:"Sparkeen is a small electric-bug creature 10 cm long resembling a glowing green beetle. Its carapace generates a localised electric field that is pleasant to the touch at low intensity but painful if the creature is threatened. It inhabits electrical substations and inside lightning-rod structures." },

  // 3-stage Rock/Ground chain: Pebblard → Boulderax → Megalith
  248: { id:248, name:"Pebblard", emoji:"🪨", types:["Rock"],
    base:{hp:52,atk:60,def:72,spa:38,spd:52,spe:42},
    learnset:[[1,"rock_throw"],[1,"tackle"],[12,"rock_slide"],[22,"earth_power"],[32,"stone_edge"],[42,"earthquake"],[52,"bedrock_slam"],[60,"hyper_beam"]],
    evolveTo:249, evolveLevel:28, catchRate:175, expYield:72, rarity:"common",
    desc:"A living pebble with stubby limbs. Rolls into enemies to deal surprisingly heavy blows.",
    lore:"Pebblard is a small round rock creature 15 cm in diameter that is essentially a smooth river pebble with two tiny eyes. It camouflages perfectly among ordinary rocks. It communicates with others by clicking against nearby stone. Geologists have placed Pebblard specimens in their sample bags by mistake." },

  249: { id:249, name:"Boulderax", emoji:"⛰️", types:["Rock","Ground"],
    base:{hp:80,atk:95,def:108,spa:52,spd:70,spe:52},
    learnset:[[1,"rock_slide"],[1,"earth_power"],[22,"stone_edge"],[30,"earthquake"],[38,"bedrock_slam"],[46,"mud_shot"],[54,"clay_armor"],[62,"hyper_beam"]],
    evolveTo:250, evolveLevel:46, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A boulder-bodied titan that rolls through terrain like a wrecking ball. Nothing stops its charge.",
    lore:"Boulderax is a medium rock-ground creature 60 cm tall shaped like a squat boulder with thick arm-stubs and two flat feet. Its surface matches local geological formations. It rolls itself into a perfect sphere for travel and unfurls only when it finds suitable terrain to defend." },

  250: { id:250, name:"Megalith", emoji:"🗿", types:["Rock","Ground"],
    base:{hp:110,atk:120,def:134,spa:55,spd:88,spe:43},
    learnset:[[1,"stone_edge"],[1,"earthquake"],[32,"bedrock_slam"],[40,"clay_armor"],[48,"earth_power"],[56,"rock_slide"],[64,"worldseed_quake"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:20, expYield:280, rarity:"rare",
    desc:"An ancient monolith that walks. Archaeological markings on its body predate all known civilizations.",
    lore:"Megalith is a massive rock-ground creature 2 metres tall shaped like an ancient standing stone with barely-defined features. It can remain motionless for decades, and local legends often grow up around stationary Megalith mistaken for man-made monuments. It moves very rarely, only when its territory is significantly threatened." },



  // ===== BATCH 4: ROCK / WATER / GRASS / DARK (IDs 251-265) =====

  // 2-stage Rock/Steel chain: Crumblite → Stonegrip (Metal Coat item)
  251: { id:251, name:"Crumblite", emoji:"🪨", types:["Rock","Steel"],
    base:{hp:60,atk:75,def:85,spa:42,spd:60,spe:45},
    learnset:[[1,"rock_throw"],[1,"metal_claw"],[14,"rock_slide"],[24,"flash_cannon"],[34,"stone_edge"],[44,"iron_tail"],[54,"forge_strike"],[60,"hyper_beam"]],
    evolveTo:252, evolveLevel:null, evolveItem:"metalCoat", evolveMethod:"item", catchRate:140, expYield:98, rarity:"common",
    desc:"A ore-encrusted creature that upgrades itself by absorbing metallic minerals from cave walls.",
    lore:"Crumblite is a rock-steel creature 40 cm tall whose body appears to be crumbling stone held together by thin steel rebar-like structures growing through it. Chunks occasionally fall away and are immediately replaced by new growth. It inhabits construction sites and ruined architecture, instinctively reinforcing damaged structures." },

  252: { id:252, name:"Stonegrip", emoji:"🛡️", types:["Rock","Steel"],
    base:{hp:95,atk:110,def:135,spa:58,spd:88,spe:52},
    learnset:[[1,"stone_edge"],[1,"flash_cannon"],[28,"iron_tail"],[36,"forge_strike"],[44,"earthquake"],[52,"bedrock_slam"],[60,"heavy_slam"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:235, rarity:"rare",
    desc:"An iron-clad rock titan. Its exterior is half-rock, half-steel, forming impenetrable natural armor.",
    lore:"Stonegrip is a rock-steel creature 80 cm tall with a compact body of grey granite reinforced by visible steel plating bolted to its surface. Its broad hands can crush stone to powder. It works obsessively to compress and compact loose rock around it, creating denser stone formations wherever it dwells." },

  // Standalone Rock/Fire: Ashrock (location evo near volcano area)
  253: { id:253, name:"Ashrock", emoji:"🌋", types:["Rock","Fire"],
    base:{hp:90,atk:105,def:100,spa:88,spd:75,spe:55},
    learnset:[[1,"rock_throw"],[1,"ember"],[18,"rock_slide"],[28,"flamethrower"],[38,"stone_edge"],[48,"magma_rock"],[58,"fire_blast"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"forge_ruins", evolveMethod:"location", catchRate:55, expYield:215, rarity:"uncommon",
    desc:"Volcanic rock infused with fire. Found only near ancient forge sites where magma once flowed freely.",
    lore:"Ashrock is a fire-rock creature 60 cm tall resembling a chunk of volcanic basalt with glowing orange cracks running through it like veins of magma. Its surface radiates intense heat. It inhabits volcanic crater rims and lava tube exits, cooling slowly over centuries until its glow dims and it becomes dormant." },

  // 2-stage Water/Psychic chain: Aquapuff → Wavrix (level 28)
  254: { id:254, name:"Bubblepuff", emoji:"🫧", types:["Water","Psychic"],
    base:{hp:50,atk:45,def:48,spa:72,spd:62,spe:68},
    learnset:[[1,"water_gun"],[1,"confusion"],[10,"bubble_beam"],[20,"psybeam"],[30,"surf"],[40,"psychic_move"],[50,"hydro_pump"],[60,"hyper_beam"]],
    evolveTo:255, evolveLevel:28, catchRate:165, expYield:76, rarity:"common",
    desc:"A bubble of water with psychic intelligence. Floats using mental energy as much as buoyancy.",
    lore:"Bubblepuff is a round water-psychic creature 25 cm across resembling a translucent bubble of water with two bright eyes and a dreamy expression. It floats just above water surfaces and can drift through the air for short distances. It projects thoughts as visible coloured ripples across any water surface it contacts." },

  255: { id:255, name:"Wavrix", emoji:"🌊", types:["Water","Psychic"],
    base:{hp:82,atk:70,def:78,spa:120,spd:102,spe:92},
    learnset:[[1,"surf"],[1,"psychic_move"],[22,"hydro_pump"],[30,"psystrike"],[38,"aqua_tail"],[46,"neural_storm"],[54,"geyser_burst"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A psychic wave entity. Predicts tides and currents with perfect accuracy millennia in advance.",
    lore:"Wavrix is a flowing water-psychic creature 50 cm tall shaped like a wave frozen in mid-curl with a face in its crest. Its body is continuously cycling water that maintains its wave-form through psychic concentration. It inhabits ocean shores and is particularly active at high tide, growing taller with stronger waves." },

  // 3-stage Water/Ice chain: Tideling → Coralhorn → Torrentox
  256: { id:256, name:"Waveling", emoji:"🦀", types:["Water","Ice"],
    base:{hp:48,atk:52,def:58,spa:65,spd:55,spe:52},
    learnset:[[1,"water_gun"],[1,"powder_snow"],[12,"bubble_beam"],[22,"ice_beam"],[32,"surf"],[42,"blizzard"],[52,"hydro_pump"],[60,"hyper_beam"]],
    evolveTo:257, evolveLevel:26, catchRate:170, expYield:74, rarity:"common",
    desc:"A crab-like creature with frozen shell. Moves between sea and frozen tundra with ease.",
    lore:"Waveling is a water-ice creature 30 cm long resembling a small dolphin made of ice-blue water. Its body is semi-solid — more ice than liquid in cold conditions and more liquid in warmth. It schools in large groups in cold coastal waters and leaps collectively in synchronised arcing patterns." },

  257: { id:257, name:"Reefhorn", emoji:"🦞", types:["Water","Ice"],
    base:{hp:72,atk:80,def:88,spa:90,spd:78,spe:65},
    learnset:[[1,"ice_beam"],[1,"surf"],[20,"blizzard"],[28,"aqua_tail"],[36,"cryo_lance"],[44,"hydro_pump"],[52,"icicle_crash"],[60,"hyper_beam"]],
    evolveTo:258, evolveLevel:44, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A horned sea creature made partly of frozen coral. Its horns channel water and ice attacks with precision.",
    lore:"Reefhorn is a water-ice creature 60 cm long resembling a narwhal with a single spiralling ice horn 20 cm long. Its body is a deep blue-grey. It inhabits cold-water reefs where its horn can chip algae from rock surfaces. The horn breaks and regrows seasonally, and shed horns are used by seabirds as nesting material." },

  258: { id:258, name:"Torrentox", emoji:"🐙", types:["Water","Ice"],
    base:{hp:90,atk:86,def:93,spa:119,spd:99,spe:63},
    learnset:[[1,"hydro_pump"],[1,"blizzard"],[30,"aqua_tail"],[38,"cryo_lance"],[46,"icicle_crash"],[54,"glacial_tomb"],[62,"geyser_burst"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:268, rarity:"rare",
    desc:"An ancient sea kraken of ice. Controls ocean currents and freezes sea lanes solid in winter.",
    lore:"Torrentox is a water-ice creature 1.2 metres long resembling a muscular orca calf with blue-white colouration and ice-plate armour along its dorsal surface. It generates ice walls around prey by rapidly cooling a volume of water from within, trapping targets in an enclosed freezing pocket." },

  // Standalone Water/Psychic: Lumejell
  259: { id:259, name:"Lumejell", emoji:"🪼", types:["Water","Psychic"],
    base:{hp:88,atk:64,def:80,spa:118,spd:105,spe:95},
    learnset:[[1,"water_gun"],[1,"psybeam"],[18,"surf"],[28,"psychic_move"],[38,"hydro_pump"],[48,"psystrike"],[58,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:215, rarity:"uncommon",
    desc:"A luminescent jellyfish with psychic tentacles. Its bioluminescence communicates complex thoughts.",
    lore:"Lumejell is a water-psychic jellyfish 45 cm in diameter with a pale blue bioluminescent bell and long trailing psychic-charged tendrils. Its pulsing light patterns encode complex emotional information. Deep-sea researchers have documented Lumejell performing what appears to be coordinated light-art displays at night." },

  // 2-stage Grass/Fairy chain: Sproutix → Leafhorn (level 26)
  260: { id:260, name:"Sproutix", emoji:"🌱", types:["Grass","Fairy"],
    base:{hp:48,atk:50,def:48,spa:72,spd:58,spe:65},
    learnset:[[1,"vine_whip"],[1,"fairy_wind"],[12,"razor_leaf"],[22,"moonblast"],[32,"energy_ball"],[42,"petal_blitz"],[52,"dazzling_gleam"],[60,"hyper_beam"]],
    evolveTo:261, evolveLevel:26, catchRate:175, expYield:72, rarity:"common",
    desc:"A fairy sprout that blooms with magical flowers. Its pollen causes drowsiness in those it trusts.",
    lore:"Sproutix is a small grass-fairy creature 15 cm tall resembling a tiny sapling with two leaf-hands and round fairy-light eyes. It sprouts from the ground in spring meadows and can take root again if it stays still long enough. It leaves a trail of tiny flowers wherever it walks." },

  261: { id:261, name:"Leafhorn", emoji:"🌺", types:["Grass","Fairy"],
    base:{hp:82,atk:78,def:75,spa:115,spd:100,spe:88},
    learnset:[[1,"moonblast"],[1,"energy_ball"],[20,"petal_blitz"],[28,"dazzling_gleam"],[36,"grove_wrath"],[44,"celestial_wave"],[52,"briar_lash"],[60,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:218, rarity:"uncommon",
    desc:"A horned bloom fairy of tremendous grace. Its horn concentrates solar and lunar energy into beam attacks.",
    lore:"Leafhorn is a medium grass-fairy creature 50 cm tall resembling a deer-faun with leaf-antlers and a body covered in overlapping leaf-scales of vivid green. Fairy energy causes the leaves to shimmer gold at dawn. It inhabits enchanted forests and its passage encourages dormant seeds to germinate." },

  // 3-stage Grass/Poison chain: Seedling → Vinrix → Thornvast
  262: { id:262, name:"Seedling", emoji:"🌿", types:["Grass","Poison"],
    base:{hp:46,atk:52,def:45,spa:65,spd:55,spe:60},
    learnset:[[1,"vine_whip"],[1,"poison_sting"],[10,"razor_leaf"],[20,"sludge_bomb"],[30,"energy_ball"],[40,"toxic"],[50,"petal_blitz"],[60,"hyper_beam"]],
    evolveTo:263, evolveLevel:24, catchRate:180, expYield:68, rarity:"common",
    desc:"A seed creature wrapped in poisoned vines. It plants itself to absorb nutrients then walks away.",
    lore:"Seedling is a small grass-poison creature 20 cm tall resembling a germinating seed that has grown a face and legs. Its body is pale green and slightly translucent. It releases spores from its open seed-pod head that fertilise nearby soil while delivering a mild deterrent toxin to grazing animals." },

  263: { id:263, name:"Vinrix", emoji:"🌵", types:["Grass","Poison"],
    base:{hp:70,atk:80,def:68,spa:98,spd:80,spe:72},
    learnset:[[1,"razor_leaf"],[1,"sludge_bomb"],[18,"energy_ball"],[28,"toxic"],[36,"petal_blitz"],[44,"venom_lance"],[52,"grove_wrath"],[60,"hyper_beam"]],
    evolveTo:264, evolveLevel:42, catchRate:90, expYield:145, rarity:"uncommon",
    desc:"A cactus warrior of venomous thorns. Its spines can inject toxins from up to three meters away.",
    lore:"Vinrix is a grass-poison creature 60 cm long resembling a vine-wrapped lizard. Its body is covered in climbing vine tendrils that it can extend rapidly. The vines secrete a contact irritant. It inhabits jungle undergrowth and creates elaborate vine-trap networks around its territory that snare careless prey." },

  264: { id:264, name:"Thornvast", emoji:"🌳", types:["Grass","Poison"],
    base:{hp:95,atk:102,def:86,spa:111,spd:93,spe:63},
    learnset:[[1,"petal_blitz"],[1,"venom_lance"],[30,"grove_wrath"],[38,"toxic"],[46,"energy_ball"],[54,"sludge_wave"],[62,"briar_lash"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:260, rarity:"rare",
    desc:"An enormous toxic thorn tree. Its roots poison groundwater for miles, making it a territorial nightmare.",
    lore:"Thornvast is a massive grass-poison creature 2 metres tall resembling a walking thorn-bush. Its broad body is impenetrable — every surface bristles with 15-cm thorns coated in irritant sap. It moves slowly through dense jungle, and other creatures create well-worn trails specifically to avoid contact with it." },

  // Standalone Grass/Bug: Mosswing
  265: { id:265, name:"Mosswing", emoji:"🦗", types:["Grass","Bug"],
    base:{hp:78,atk:82,def:70,spa:95,spd:88,spe:108},
    learnset:[[1,"bug_buzz"],[1,"vine_whip"],[18,"x_scissor"],[28,"energy_ball"],[38,"razor_leaf"],[48,"petal_blitz"],[58,"bug_buzz"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:210, rarity:"uncommon",
    desc:"A mossy grasshopper that blends perfectly into overgrown forest floors. Its wings buzz with plant pollen.",
    lore:"Mosswing is a grass-bug creature 20 cm wingspan resembling a moth whose wings are covered in living moss rather than scales. The moss is a different species front and back, providing camouflage on both bark and leaf surfaces. Its moss-wings are never still, micro-growing and micro-dying continuously." },



  // ===== BATCH 5: DARK / FIRE / STEEL / NORMAL (IDs 266-280) =====

  // 3-stage Dark chain: Shadowpup → Nightclaw → Darkfang
  266: { id:266, name:"Shadowpup", emoji:"🐺", types:["Dark"],
    base:{hp:48,atk:62,def:45,spa:50,spd:48,spe:72},
    learnset:[[1,"bite"],[1,"tackle"],[10,"night_slash"],[20,"dark_pulse"],[30,"crunch"],[40,"eclipse_shroud"],[50,"soul_rend"],[60,"hyper_beam"]],
    evolveTo:267, evolveLevel:26, catchRate:180, expYield:70, rarity:"common",
    desc:"A shadow wolf pup that feeds on ambient light. Eyes glow in pitch darkness where nothing should glow.",
    lore:"Shadowpup is a small dark dog 25 cm at the shoulder with jet-black fur so dark it absorbs almost all visible light. Its outline against bright backgrounds seems slightly wrong — too sharp and flat. It is playful and energetic, unaware that its unusual appearance unnerves most creatures it approaches." },

  267: { id:267, name:"Nightclaw", emoji:"🐾", types:["Dark"],
    base:{hp:72,atk:95,def:65,spa:75,spd:68,spe:90},
    learnset:[[1,"night_slash"],[1,"phantom_claw"],[20,"dark_pulse"],[28,"eclipse_shroud"],[36,"crunch"],[44,"soul_rend"],[52,"shadow_ball"],[60,"hyper_beam"]],
    evolveTo:268, evolveLevel:44, catchRate:85, expYield:150, rarity:"uncommon",
    desc:"A ghost-dark wolf that phases through shadows. Its claws can strike from a different dimension.",
    lore:"Nightclaw is a medium dark dog 55 cm at the shoulder with deep black fur and retractable claws that are non-reflective. It hunts by moving through deep shadow too fast to track, using echolocation rather than vision. Its natural shadow-camouflage is so effective it can vanish against dark walls in daylight." },

  268: { id:268, name:"Darkfang", emoji:"🐕", types:["Dark"],
    base:{hp:89,atk:118,def:79,spa:87,spd:79,spe:98},
    learnset:[[1,"eclipse_shroud"],[1,"soul_rend"],[30,"dark_pulse"],[38,"shadow_ball"],[46,"night_slash"],[54,"phantom_claw"],[62,"dread_howl"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:268, rarity:"rare",
    desc:"The apex shadow predator. Its howl resonates across dimensions and can be heard in the land of the dead.",
    lore:"Darkfang is a large dark wolf 90 cm at the shoulder with pitch-black fur and fangs that absorb light, giving them a void-like appearance. Its growl is felt more than heard, as a pressure in the chest. It inhabits forested night-terrain and sees in conditions of total darkness as clearly as others see in daylight." },

  // 2-stage Dark split: Grimshade → Eclipsoon (Moon Stone item)
  269: { id:269, name:"Grimshade", emoji:"🦇", types:["Dark"],
    base:{hp:55,atk:65,def:52,spa:78,spd:65,spe:82},
    learnset:[[1,"bite"],[1,"dark_pulse"],[14,"night_slash"],[24,"eclipse_shroud"],[34,"crunch"],[44,"soul_rend"],[54,"dread_howl"],[60,"hyper_beam"]],
    evolveTo:270, evolveLevel:null, evolveItem:"moonStone", evolveMethod:"item", catchRate:130, expYield:102, rarity:"common",
    desc:"A twilight bat that thrives between day and night. Its fur absorbs moonlight and stores it as dark energy.",
    lore:"Grimshade is a large dark predator 1.1 metres at the shoulder resembling a panther that exists partially as shadow. Its physical body is present but its shadow is far larger and moves independently. When it attacks, the shadow strikes first from an angle the prey cannot anticipate." },

  270: { id:270, name:"Eclipsoon", emoji:"🌑", types:["Dark","Fairy"],
    base:{hp:83,atk:87,def:75,spa:114,spd:100,spe:91},
    learnset:[[1,"dark_pulse"],[1,"moonblast"],[28,"eclipse_shroud"],[36,"soul_rend"],[44,"dread_howl"],[52,"fae_requiem"],[60,"shadow_ball"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:38, expYield:228, rarity:"rare",
    desc:"The eclipse bat, born when moon stone energy meets absolute darkness. Its wings block out the stars.",
    lore:"Eclipsoon is a dark-fairy creature 40 cm long resembling a small raccoon-like animal with black fur and patches of luminescent fairy-pink on its face and tail tip. It inhabits forest edge habitats and uses its glowing patches to signal to others across open clearings at night." },

  // Standalone Dark/Normal: Duskrat
  271: { id:271, name:"Murkrat", emoji:"🐀", types:["Dark","Normal"],
    base:{hp:95,atk:100,def:82,spa:68,spd:75,spe:105},
    learnset:[[1,"bite"],[1,"tackle"],[18,"night_slash"],[28,"dark_pulse"],[38,"body_slam"],[48,"crunch"],[58,"eclipse_shroud"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:205, rarity:"uncommon",
    desc:"A cunning dark rodent that steals anything shiny. Surprisingly tough for its size and always escapes.",
    lore:"Murkrat is a dark-normal creature 30 cm long resembling a fat rat with dark grey fur and bright beady eyes. It is deeply pragmatic — it will steal anything useful, hoard it, and trade it back. It inhabits sewer systems and underground markets and is surprisingly social once trust is established." },

  // 2-stage Fire/Dragon chain: Embrix → Blazeon (level 28)
  272: { id:272, name:"Embrix", emoji:"🦎", types:["Fire","Dragon"],
    base:{hp:50,atk:68,def:52,spa:65,spd:50,spe:72},
    learnset:[[1,"ember"],[1,"dragon_breath"],[12,"flamethrower"],[22,"dragon_claw"],[32,"fire_blast"],[42,"dragon_pulse"],[52,"outrage"],[62,"hyper_beam"]],
    evolveTo:273, evolveLevel:34, catchRate:155, expYield:82, rarity:"common",
    desc:"A fire lizard with nascent draconic power. Breathes embers in spiraling dragon-shaped patterns.",
    lore:"Embrix is a young fire-dragon 25 cm long with bright orange-red scales and oversized eyes. Its wings are too small for flight but it flaps them enthusiastically when excited. It produces tiny fireballs no larger than a marble. It is the juvenile form of a powerful fire dragon lineage and grows rapidly with proper nutrition." },

  273: { id:273, name:"Blazeon", emoji:"🔥", types:["Fire","Dragon"],
    base:{hp:86,atk:110,def:75,spa:112,spd:77,spe:90},
    learnset:[[1,"flamethrower"],[1,"dragon_claw"],[26,"fire_blast"],[34,"dragon_pulse"],[42,"outrage"],[50,"dragon_dance"],[58,"caldera_meltdown"],[66,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:228, rarity:"uncommon",
    desc:"A fire dragon of pure scorching flame. Dances in lava rivers to power up its abilities further.",
    lore:"Blazeon is a fire-dragon 1.5 metres long with deep crimson-orange scales and a fully developed wing-span of 2 metres. Its breath weapon is now a sustained stream of fire rather than fireballs. It inhabits volcanic hillsides and defends a territory of several square kilometres from other fire-types." },

  // 3-stage Fire/Rock chain: Cindling → Infernox → Pyrovast
  274: { id:274, name:"Cindling", emoji:"🪨", types:["Fire","Rock"],
    base:{hp:46,atk:60,def:65,spa:55,spd:50,spe:52},
    learnset:[[1,"ember"],[1,"rock_throw"],[10,"rock_slide"],[20,"flamethrower"],[30,"stone_edge"],[40,"fire_blast"],[50,"magma_rock"],[60,"hyper_beam"]],
    evolveTo:275, evolveLevel:28, catchRate:170, expYield:74, rarity:"common",
    desc:"A coal-like creature that ignites when rolling downhill. Leaves scorch marks on stone paths.",
    lore:"Cindling is a fire-rock creature 30 cm long resembling a small lizard made of dark basalt with glowing cinders embedded in its skin. It collects small pebbles and packs them into its cinder-body over time, growing heavier and slower with age. The hottest cinders in its body mark its most active thinking." },

  275: { id:275, name:"Infernox", emoji:"🌋", types:["Fire","Rock"],
    base:{hp:72,atk:92,def:95,spa:82,spd:68,spe:62},
    learnset:[[1,"flamethrower"],[1,"stone_edge"],[22,"fire_blast"],[30,"magma_rock"],[38,"rock_slide"],[46,"earthquake"],[54,"caldera_meltdown"],[62,"hyper_beam"]],
    evolveTo:276, evolveLevel:46, catchRate:75, expYield:158, rarity:"uncommon",
    desc:"A volcanic rock beast that erupts periodically. Carries magma inside its carapace like a pressure cooker.",
    lore:"Infernox is a fire-rock creature 80 cm long resembling a larger armoured lizard with volcanic plate armour. Its joints glow with pooled magma. Its footsteps leave brief glowing prints. It inhabits lava fields and uses its rock-hard body to deflect predator strikes while retaliating with blasts of focused fire." },

  276: { id:276, name:"Scorchvast", emoji:"🏔️", types:["Fire","Rock"],
    base:{hp:102,atk:118,def:109,spa:90,spd:78,spe:53},
    learnset:[[1,"fire_blast"],[1,"magma_rock"],[32,"caldera_meltdown"],[40,"earthquake"],[48,"stone_edge"],[56,"bedrock_slam"],[64,"ashfall"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:18, expYield:272, rarity:"rare",
    desc:"A living volcano of immense destructive power. When it battles, the sky fills with ash and the earth splits.",
    lore:"Scorchvast is a massive fire-rock creature 2 metres long resembling a very large igneous lizard entirely encased in natural stone armour. Fountains of fire erupt from vents on its back when it is agitated. Its body temperature is sufficient to melt most metals on contact." },

  // Standalone Fire/Ground: Magmite (location evo near forge area)
  277: { id:277, name:"Magmite", emoji:"🌶️", types:["Fire","Ground"],
    base:{hp:92,atk:110,def:96,spa:98,spd:80,spe:62},
    learnset:[[1,"ember"],[1,"mud_shot"],[18,"flamethrower"],[28,"earth_power"],[38,"fire_blast"],[48,"earthquake"],[58,"magma_surge"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"ironforge", evolveMethod:"location", catchRate:50, expYield:215, rarity:"uncommon",
    desc:"Found only in volcanic forge areas where earth meets fire. Its body is half-molten rock, half-flame.",
    lore:"Magmite is a small fire-ground creature 20 cm tall resembling a lava droplet that has cooled enough to walk. Its body is glossy dark basalt with an interior glow. It inhabits active volcanic vents and feeds by filtering mineral nutrients from magma, which passes harmlessly through its heat-adapted body." },

  // 2-stage Steel/Fairy chain: Ironling → Steelhorn (Metal Coat item)
  278: { id:278, name:"Ironling", emoji:"⚙️", types:["Steel","Fairy"],
    base:{hp:52,atk:65,def:78,spa:60,spd:58,spe:55},
    learnset:[[1,"metal_claw"],[1,"fairy_wind"],[14,"flash_cannon"],[24,"moonblast"],[34,"iron_tail"],[44,"dazzling_gleam"],[54,"forge_strike"],[60,"hyper_beam"]],
    evolveTo:279, evolveLevel:null, evolveItem:"metalCoat", evolveMethod:"item", catchRate:145, expYield:92, rarity:"common",
    desc:"A small fairy forged of living iron. Works tirelessly in ancient forges, seeking purpose and strength.",
    lore:"Ironling is a small steel-fairy creature 30 cm tall resembling a tiny knight in fairy-crafted iron armour. Its armour is silver-grey with a faint shimmer. It is protective of smaller creatures and positions itself between perceived threats and those it has chosen to guard, regardless of relative size." },

  279: { id:279, name:"Steelhorn", emoji:"🦌", types:["Steel","Fairy"],
    base:{hp:87,atk:97,def:114,spa:84,spd:97,spe:71},
    learnset:[[1,"flash_cannon"],[1,"moonblast"],[28,"iron_tail"],[36,"dazzling_gleam"],[44,"forge_strike"],[52,"heavy_slam"],[60,"celestial_wave"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:38, expYield:228, rarity:"rare",
    desc:"A horned steel fairy of regal bearing. Its horn channels both fairy magic and forged steel energy.",
    lore:"Steelhorn is a medium steel-fairy creature 70 cm tall with a humanoid body of polished silver steel and a single straight horn of fairy-charged metal from its forehead. The horn channels and purifies energy. It inhabits ancient forge-temples and stands watch over sacred metalworking sites." },

  // 3-stage Steel/Ground chain: Gearbit → Cogvex → Mechavast
  280: { id:280, name:"Gearbit", emoji:"🔩", types:["Steel","Ground"],
    base:{hp:50,atk:62,def:72,spa:40,spd:52,spe:48},
    learnset:[[1,"metal_claw"],[1,"mud_shot"],[12,"flash_cannon"],[22,"earth_power"],[32,"iron_tail"],[42,"earthquake"],[52,"forge_strike"],[60,"hyper_beam"]],
    evolveTo:281, evolveLevel:28, catchRate:165, expYield:76, rarity:"common",
    desc:"A mechanical gear creature that burrows through ore deposits. Powered by geothermal energy.",
    lore:"Gearbit is a small steel-ground creature 20 cm tall shaped like a round gear-work automaton with stubby legs. Its body is a collection of interlocked cogs that rotate slowly. It digs through soil to locate metal deposits and incorporates found metals into its growing gear-body." },



  // ===== BATCH 6: STEEL / NORMAL / WIND / POISON / BUG (IDs 281-295) =====

  // Cogvex and Mechavast (continuing Gearbit chain from 280)
  281: { id:281, name:"Cogvex", emoji:"⚙️", types:["Steel","Ground"],
    base:{hp:78,atk:98,def:108,spa:58,spd:75,spe:60},
    learnset:[[1,"flash_cannon"],[1,"earth_power"],[22,"iron_tail"],[30,"earthquake"],[38,"forge_strike"],[46,"bedrock_slam"],[54,"heavy_slam"],[62,"hyper_beam"]],
    evolveTo:282, evolveLevel:46, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A complex gear-machine creature that absorbs underground minerals to repair itself.",
    lore:"Cogvex is a medium steel-ground automaton 60 cm tall with a more elaborate gear-work body. Its chest is an exposed mechanism of dozens of interlocking cogs and pistons. It constructs complex gear-driven tools from found materials and leaves functional mechanical devices scattered across its territory." },

  282: { id:282, name:"Mechavast", emoji:"🤖", types:["Steel","Ground"],
    base:{hp:105,atk:122,def:124,spa:63,spd:85,spe:51},
    learnset:[[1,"forge_strike"],[1,"earthquake"],[32,"heavy_slam"],[40,"bedrock_slam"],[48,"iron_tail"],[56,"earth_power"],[64,"flash_cannon"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:18, expYield:278, rarity:"rare",
    desc:"The ultimate mechanical titan. Its body is a perfect fusion of steel and compressed earth.",
    lore:"Mechavast is a large steel-ground automaton 1.5 metres tall with a heavy industrial design — thick piston-driven legs, a drill-bit hand, and a hydraulic claw. Its internal mechanisms grind audibly. It excavates ore deposits with mechanical precision and stacks sorted mineral samples in neat geometric arrangements." },

  // Standalone Steel/Ground: Rustpike
  283: { id:283, name:"Rustpike", emoji:"🗡️", types:["Steel","Poison"],
    base:{hp:85,atk:112,def:90,spa:72,spd:78,spe:78},
    learnset:[[1,"metal_claw"],[1,"poison_sting"],[18,"iron_tail"],[28,"sludge_bomb"],[38,"forge_strike"],[48,"toxic"],[58,"flash_cannon"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:48, expYield:212, rarity:"uncommon",
    desc:"A rusted iron spike creature coated in toxins. Its corroded exterior makes it harder to damage than pristine steel.",
    lore:"Rustpike is a steel-poison creature 50 cm long resembling a pike fish made of rusting iron with patches of toxic green oxidation. Its fin-spines release a corroding toxin. It inhabits iron-rich waterways where its body chemistry is sustained by dissolved metals. Its presence discolours the water orange-red." },

  // 2-stage Normal/Wind chain: Fluffkin → Cloudvane (level 26)
  284: { id:284, name:"Fluffkin", emoji:"☁️", types:["Normal","Wind"],
    base:{hp:55,atk:48,def:50,spa:62,spd:58,spe:72},
    learnset:[[1,"tackle"],[1,"gust"],[12,"air_slash"],[22,"body_slam"],[32,"hurricane"],[42,"downdraft"],[52,"gale_cannon"],[60,"hyper_beam"]],
    evolveTo:285, evolveLevel:26, catchRate:170, expYield:72, rarity:"common",
    desc:"A fluffy cloud puff with tiny wings. Drifts on thermals and sheds soft white fur that becomes rain clouds.",
    lore:"Fluffkin is a small normal-wind creature 20 cm tall resembling a puffball of cream-white fluff with two eyes. It is so light it is carried by the weakest breeze. It lives in open meadows and cannot truly control its movement — it goes wherever the wind takes it, expressing mild surprise at each new destination." },

  285: { id:285, name:"Cloudrift", emoji:"🌤️", types:["Normal","Wind"],
    base:{hp:88,atk:78,def:78,spa:95,spd:90,spe:100},
    learnset:[[1,"air_slash"],[1,"body_slam"],[20,"hurricane"],[28,"gale_cannon"],[36,"downdraft"],[44,"squall_slash"],[52,"tempest_wrath"],[60,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:218, rarity:"uncommon",
    desc:"A cloud-form creature that rides jet streams. Creates weather patterns across entire regions as it travels.",
    lore:"Cloudrift is a medium normal-wind creature 40 cm across resembling a compact cloud with a contented face. It drifts at a consistent altitude of 3 metres above ground level regardless of terrain and passes through tree canopies with only mild distortion of its form. It rains gently when sad." },

  // 3-stage Normal chain: Fuzzlet → Cuddrix → Majesticore (lv24, lv44)
  286: { id:286, name:"Fuzzlet", emoji:"🐾", types:["Normal"],
    base:{hp:50,atk:55,def:50,spa:45,spd:48,spe:65},
    learnset:[[1,"tackle"],[1,"headbutt"],[10,"body_slam"],[20,"reckless_charge"],[30,"battle_cry"],[40,"heavy_slam"],[50,"hyper_beam"]],
    evolveTo:287, evolveLevel:24, catchRate:185, expYield:65, rarity:"common",
    desc:"An extremely fluffy creature with boundless energy. Rolls into threats and bounces off harmlessly, then tries again.",
    lore:"Fuzzlet is a small round normal creature 15 cm tall completely covered in dense fuzzy cream-white fur. Its eyes are barely visible through the fuzz. It grooms itself constantly and the shed fuzz accumulates into soft nest-like mounds that other small creatures use for shelter." },

  287: { id:287, name:"Cuddrix", emoji:"🐻", types:["Normal"],
    base:{hp:78,atk:82,def:72,spa:62,spd:68,spe:78},
    learnset:[[1,"body_slam"],[1,"reckless_charge"],[18,"battle_cry"],[28,"heavy_slam"],[38,"headbutt"],[48,"iron_press"],[58,"hyper_beam"]],
    evolveTo:288, evolveLevel:44, catchRate:90, expYield:140, rarity:"uncommon",
    desc:"A bear-like powerhouse with soft fur hiding tremendous muscle. Known for unexpectedly strong hugs.",
    lore:"Cuddrix is a medium normal creature 35 cm tall resembling a round bear-cub with soft pale-brown fur and large dark eyes. It is intensely affectionate and uses gentle physical contact to communicate. Its presence measurably reduces stress hormone levels in larger creatures, which researchers attribute to a chemical it secretes." },

  288: { id:288, name:"Majesticore", emoji:"🦁", types:["Normal","Psychic"],
    base:{hp:98,atk:98,def:85,spa:98,spd:97,spe:74},
    learnset:[[1,"heavy_slam"],[1,"psychic_move"],[30,"battle_cry"],[38,"reckless_charge"],[46,"psystrike"],[54,"neural_storm"],[62,"hyper_beam"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:265, rarity:"rare",
    desc:"A majestic being that has awakened psychic powers. Perfectly balanced in all attributes, a ruler among Lumori.",
    lore:"Majesticore is a large normal-psychic creature 1.2 metres at the shoulder resembling a lion with a broad flat psychic-light mane. It moves with deliberate, unhurried grace. Its gaze holds a density of presence that causes involuntary deference even in creatures far larger than itself." },

  // Standalone Normal: Bouncyblob
  289: { id:289, name:"Bouncyblob", emoji:"🎱", types:["Normal"],
    base:{hp:110,atk:85,def:85,spa:85,spd:85,spe:85},
    learnset:[[1,"tackle"],[1,"body_slam"],[18,"headbutt"],[28,"reckless_charge"],[38,"heavy_slam"],[48,"battle_cry"],[58,"iron_press"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:200, rarity:"uncommon",
    desc:"A perfectly spherical blob of pure vitality. Its round body absorbs physical impacts with zero damage.",
    lore:"Bouncyblob is a normal creature 30 cm in diameter resembling a perfectly spherical blob of pale pink gel. It bounces continuously regardless of surface type, using kinetic energy storage in its elastic body to maintain constant motion. It absorbs physical impacts and redirects them as higher bounces." },

  // Standalone Normal/Ghost: Mimiclaw (evolves in gloomy location)
  290: { id:290, name:"Mimiclaw", emoji:"🎭", types:["Normal","Dark"],
    base:{hp:82,atk:90,def:78,spa:95,spd:85,spe:102},
    learnset:[[1,"tackle"],[1,"shadow_ball"],[15,"phantom_claw"],[25,"eclipse_shroud"],[35,"body_slam"],[45,"soul_rend"],[55,"shadow_ball"],[65,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"cobweb_gully", evolveMethod:"location", catchRate:52, expYield:212, rarity:"uncommon",
    desc:"An unsettling mimic that copies the appearance of other Lumori. Found deep in haunted gullies and ruins.",
    lore:"Mimiclaw is a dark-normal creature 40 cm long resembling a cat with dark grey fur and the ability to shift its outline. Its face can rearrange its features to mimic any creature it has studied for ten minutes or more. It uses mimicry of distressed sounds to lure curious prey within reach." },

  // 2-stage Wind chain: Breezekin → Galehorn (level 28)
  291: { id:291, name:"Breezekin", emoji:"🌬️", types:["Wind"],
    base:{hp:48,atk:52,def:45,spa:68,spd:58,spe:85},
    learnset:[[1,"gust"],[1,"air_slash"],[12,"downdraft"],[22,"hurricane"],[32,"gale_cannon"],[42,"squall_slash"],[52,"tempest_wrath"],[60,"hyper_beam"]],
    evolveTo:292, evolveLevel:28, catchRate:168, expYield:74, rarity:"common",
    desc:"A gentle breeze spirit that grows stronger in storms. Races other flying Lumori for fun.",
    lore:"Breezekin is a compact wind creature 35 cm at the shoulder resembling a slender pale-grey cat whose fur streams perpetually as if blown by a gentle breeze even indoors. Its movements are fluid and almost silent. It inhabits open plains and coastal areas, navigating primarily by smell carried on wind currents." },

  292: { id:292, name:"Galehorn", emoji:"🌪️", types:["Wind","Electric"],
    base:{hp:78,atk:85,def:70,spa:108,spd:88,spe:115},
    learnset:[[1,"air_slash"],[1,"thunderbolt"],[22,"hurricane"],[30,"thunder"],[38,"tempest_wrath"],[46,"gale_cannon"],[54,"squall_slash"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A wind horn creature that channels storms. Its horn generates tornadic electrical vortexes.",
    lore:"Galehorn is a large wind-electric creature 1.2 metres at the shoulder resembling a ram with a grey-white body and spiralling horns that generate electrical charge through the piezoelectric effect when they vibrate in high winds. During storms it faces directly into the gale and absorbs the energy." },

  // 3-stage Wind chain: Zephyrpuff → Stormwing → Cyclonax
  293: { id:293, name:"Gustpuff", emoji:"💨", types:["Wind"],
    base:{hp:42,atk:45,def:38,spa:65,spd:55,spe:90},
    learnset:[[1,"gust"],[1,"tackle"],[10,"air_slash"],[20,"downdraft"],[30,"hurricane"],[40,"gale_cannon"],[50,"squall_slash"],[60,"hyper_beam"]],
    evolveTo:294, evolveLevel:26, catchRate:175, expYield:68, rarity:"common",
    desc:"A puff of magical wind given form. Spins in circles when excited, creating tiny dust devils.",
    lore:"Gustpuff is a small wind creature 25 cm tall resembling a dandelion head that has achieved sentience. Its body is a central point from which dozens of light wind-filaments radiate in all directions. It blows apart and reassembles in new locations. Each filament carries sensory information back to its central point." },

  294: { id:294, name:"Stormwing", emoji:"🦅", types:["Wind","Dragon"],
    base:{hp:70,atk:88,def:68,spa:98,spd:80,spe:108},
    learnset:[[1,"air_slash"],[1,"dragon_breath"],[20,"hurricane"],[28,"dragon_claw"],[36,"gale_cannon"],[44,"dragon_pulse"],[52,"tempest_wrath"],[60,"hyper_beam"]],
    evolveTo:295, evolveLevel:44, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A storm-drake hybrid of wind and dragon power. Rides cyclones across entire mountain ranges.",
    lore:"Stormwing is a large wind-dragon 3 metres long with powerful slate-grey wings spanning 5 metres. Its scales are grey-blue and its eyes are electric-white. It generates its own personal storm system wherever it flies — clouds condensing from its wingtip vortices, lightning striking where it looks." },

  295: { id:295, name:"Cyclonax", emoji:"🌀", types:["Wind","Dragon"],
    base:{hp:81,atk:93,def:77,spa:112,spd:88,spe:99},
    learnset:[[1,"hurricane"],[1,"dragon_pulse"],[30,"tempest_wrath"],[38,"dragon_dance"],[46,"gale_cannon"],[54,"outrage"],[62,"ancient_breath"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:20, expYield:272, rarity:"rare",
    desc:"A hurricane dragon of unimaginable velocity. When it flies, it creates permanent weather anomalies.",
    lore:"Cyclonax is a massive wind-dragon 5 metres long with a vortex of perpetual cyclonic wind orbiting its body. Its scales are deep grey with white edges. It is rarely seen, living above the weather systems of the world. When it descends to lower altitudes it brings catastrophic storms with it." },



  // ===== BATCH 7: POISON / BUG / MIXED FILLS (IDs 296-313) =====

  // 3-stage Poison/Bug chain: Toxifly → Venomwing → Plagueoth (lv26, lv44)
  296: { id:296, name:"Plaguefly", emoji:"🦟", types:["Poison","Bug"],
    base:{hp:44,atk:52,def:40,spa:68,spd:52,spe:80},
    learnset:[[1,"poison_sting"],[1,"bug_buzz"],[10,"sludge_bomb"],[20,"x_scissor"],[30,"toxic"],[40,"venoshock"],[50,"venom_lance"],[60,"hyper_beam"]],
    evolveTo:297, evolveLevel:26, catchRate:178, expYield:70, rarity:"common",
    desc:"A mosquito-like creature with toxic saliva. A single bite can poison most Lumori instantly.",
    lore:"Plaguefly is a large poison-bug insect with a 30 cm wingspan. Its wings are translucent grey with poison-green venation. Its body is a bloated sack of toxic fluid. It breeds in stagnant water and its larval masses are visible as roiling dark clouds beneath the surface of contaminated ponds." },

  297: { id:297, name:"Blightwing", emoji:"🦋", types:["Poison","Bug"],
    base:{hp:68,atk:78,def:62,spa:98,spd:78,spe:100},
    learnset:[[1,"x_scissor"],[1,"sludge_bomb"],[20,"toxic"],[28,"venoshock"],[36,"bug_buzz"],[44,"venom_lance"],[52,"sludge_wave"],[60,"hyper_beam"]],
    evolveTo:298, evolveLevel:44, catchRate:85, expYield:148, rarity:"uncommon",
    desc:"A poison butterfly whose wing scales are deadly toxins. A single wing-flap spreads enough venom to fell a herd.",
    lore:"Blightwing is a medium poison-bug butterfly with 40 cm wingspan. Its wings are dark purple with sickly yellow-green patches that glow faintly. Each wingbeat releases microscopic blight-spores that cause plant growth to wither. It inhabits areas of environmental decay, flourishing where other life struggles." },

  298: { id:298, name:"Plagueoth", emoji:"🦠", types:["Poison","Bug"],
    base:{hp:82,atk:89,def:73,spa:116,spd:95,spe:95},
    learnset:[[1,"venom_lance"],[1,"bug_buzz"],[30,"sludge_wave"],[38,"toxic"],[46,"venoshock"],[54,"mycelia_net"],[62,"corrosion_fang"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:268, rarity:"rare",
    desc:"The plague moth. Ancient texts describe its awakening as an omen of great pestilence. Its touch corrupts.",
    lore:"Plagueoth is a large poison-bug creature 60 cm long resembling a grotesque moth with ragged dark wings and a bloated abdomen. Its wing-scales contain a contact toxin. It inhabits abandoned buildings and decaying organic matter and leaves a visible trail of toxin-dust in its wake." },

  // 2-stage Bug/Poison chain: Stinglet → Nettleclaw (level 28)
  299: { id:299, name:"Stinglet", emoji:"🐝", types:["Bug","Poison"],
    base:{hp:50,atk:65,def:52,spa:58,spd:55,spe:78},
    learnset:[[1,"bug_buzz"],[1,"poison_sting"],[12,"x_scissor"],[22,"sludge_bomb"],[32,"toxic"],[42,"venoshock"],[52,"venom_lance"],[60,"hyper_beam"]],
    evolveTo:300, evolveLevel:28, catchRate:162, expYield:78, rarity:"common",
    desc:"A bee-like stinger creature with a massive venomous barb. Builds hives from toxic resin.",
    lore:"Stinglet is a small bug-poison bee 8 cm long with a bright yellow-and-black striped abdomen. Its stinger contains a venom that causes localised swelling and intense pain. It is fiercely territorial around its nest and coordinates with colony-mates using chemical signals to perform coordinated defence responses." },

  300: { id:300, name:"Nettleclaw", emoji:"🦂", types:["Bug","Poison"],
    base:{hp:80,atk:105,def:80,spa:88,spd:80,spe:95},
    learnset:[[1,"x_scissor"],[1,"venom_lance"],[22,"toxic"],[30,"venoshock"],[38,"sludge_bomb"],[46,"bug_buzz"],[54,"sludge_wave"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:42, expYield:218, rarity:"uncommon",
    desc:"A scorpion-bug hybrid of lethal venom. Its claws inject a toxin that dissolves steel over time.",
    lore:"Nettleclaw is a large bug-poison scorpion-bee hybrid 25 cm long with a bee-striped yellow and black body and a scorpion-like tail in addition to its bee-stinger. It is solitary and aggressive, marking territory with scent-trails that it defends vigorously against any trespasser regardless of size." },

  // Standalone Fire/Ghost: Emberveil
  301: { id:301, name:"Emberveil", emoji:"🔥", types:["Fire","Dark"],
    base:{hp:78,atk:82,def:72,spa:118,spd:95,spe:102},
    learnset:[[1,"ember"],[1,"shadow_ball"],[18,"flamethrower"],[28,"phantom_claw"],[38,"fire_blast"],[48,"eclipse_shroud"],[58,"soul_rend"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:48, expYield:215, rarity:"uncommon",
    desc:"A fire specter born from the embers of burned-down haunted houses. Leaves smoldering phantom footprints.",
    lore:"Emberveil is a fire-dark creature 60 cm tall resembling a smouldering black cat whose fur is made of living shadow and ember. Dim orange flames flicker through its dark coat without burning it. It inhabits the spaces near dying fires — hearths, burn-sites, campfire remains — absorbing residual heat from ash." },

  // 2-stage Fairy chain: Lightpuff → Lumivane (Moon Stone item)
  302: { id:302, name:"Lightpuff", emoji:"🌟", types:["Fairy"],
    base:{hp:55,atk:48,def:55,spa:78,spd:68,spe:70},
    learnset:[[1,"fairy_wind"],[1,"dazzling_gleam"],[14,"moonblast"],[24,"celestial_wave"],[34,"glitter_storm"],[44,"fae_requiem"],[54,"moonveil"],[60,"hyper_beam"]],
    evolveTo:303, evolveLevel:null, evolveItem:"moonStone", evolveMethod:"item", catchRate:138, expYield:96, rarity:"common",
    desc:"A star-dust fairy of gentle light. Absorbs moonlight to build its energy toward a magnificent transformation.",
    lore:"Lightpuff is a small fairy creature 20 cm across resembling a round luminous orb with two bright eyes and a constant gentle glow. Its light is warm and golden. It drifts through settlements at night, drawn to windows of occupied homes, and its presence is considered a sign of domestic happiness." },

  303: { id:303, name:"Lumivane", emoji:"🌠", types:["Fairy","Psychic"],
    base:{hp:81,atk:68,def:78,spa:122,spd:109,spe:92},
    learnset:[[1,"moonblast"],[1,"psychic_move"],[28,"celestial_wave"],[36,"psystrike"],[44,"glitter_storm"],[52,"neural_storm"],[60,"fae_requiem"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:230, rarity:"rare",
    desc:"The comet fairy, born from moonstone energy and starlight. Crosses the sky in streaks of prismatic light.",
    lore:"Lumivane is a fairy-psychic creature 50 cm tall resembling a graceful humanoid composed of starlight and psychic radiance. Its body shifts between solid and luminous depending on its concentration. It inhabits high mountain observatories and archives astronomical data in a crystalline psychic memory." },

  // 3-stage Rock/Ice chain: Crysthorn → Geoshard → Crystallon (location: cold area, lv28, lv48)
  304: { id:304, name:"Icethorn", emoji:"💎", types:["Rock","Ice"],
    base:{hp:52,atk:62,def:75,spa:58,spd:60,spe:50},
    learnset:[[1,"rock_throw"],[1,"powder_snow"],[12,"rock_slide"],[22,"ice_beam"],[32,"stone_edge"],[42,"cryo_lance"],[52,"blizzard"],[60,"hyper_beam"]],
    evolveTo:305, evolveLevel:28, catchRate:162, expYield:78, rarity:"common",
    desc:"A crystal thorn creature that grows in frozen caves. Its crystalline spines shatter on impact then regrow.",
    lore:"Icethorn is a rock-ice creature 40 cm tall resembling a cactus-like formation of grey rock studded with ice-crystal spines. Its ice spines regrow within hours if broken off. It inhabits frozen rocky highlands and uses its spines both to collect water from passing fog and to deter large herbivores." },

  305: { id:305, name:"Geoshard", emoji:"🗻", types:["Rock","Ice"],
    base:{hp:78,atk:92,def:105,spa:78,spd:82,spe:58},
    learnset:[[1,"ice_beam"],[1,"stone_edge"],[22,"cryo_lance"],[30,"blizzard"],[38,"bedrock_slam"],[46,"icicle_crash"],[54,"avalanche_drive"],[62,"hyper_beam"]],
    evolveTo:306, evolveLevel:48, catchRate:75, expYield:158, rarity:"uncommon",
    desc:"A rock and ice giant with shard weapons. Lives on the highest frozen peaks of the Lumoria mountain range.",
    lore:"Geoshard is a rock-ice creature 80 cm tall resembling a jagged crystal cluster that has grown into a vaguely bipedal shape. Its body is dark stone filled with brilliant ice formations visible through large natural gaps. It moves rarely and is often mistaken for a natural geological feature." },

  306: { id:306, name:"Crystallon", emoji:"🏔️", types:["Rock","Ice"],
    base:{hp:101,atk:108,def:117,spa:83,spd:91,spe:50},
    learnset:[[1,"blizzard"],[1,"bedrock_slam"],[32,"avalanche_drive"],[40,"icicle_crash"],[48,"stone_edge"],[56,"glacial_tomb"],[64,"worldseed_quake"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:18, expYield:275, rarity:"rare",
    desc:"The frozen mountain titan. Glaciers form around it spontaneously. Worshipped by ancient mountain peoples.",
    lore:"Crystallon is a large rock-ice entity 1.5 metres tall resembling an ancient standing stone made of interlocked rock and ice crystal structures. Its face is barely defined — two faint depressions in the stone suggest eyes. It has stood in the same valley for centuries, and local cultures have built myths around it." },

  // Standalone Fire/Dark: Cinderpaw
  307: { id:307, name:"Cinderpaw", emoji:"🐈", types:["Fire","Dark"],
    base:{hp:85,atk:103,def:73,spa:98,spd:79,spe:112},
    learnset:[[1,"ember"],[1,"bite"],[18,"flamethrower"],[28,"night_slash"],[38,"fire_blast"],[48,"dark_pulse"],[58,"eclipse_shroud"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:52, expYield:212, rarity:"uncommon",
    desc:"A dark flame cat that stalks targets silently before unleashing explosive fire attacks. Unpredictable and cunning.",
    lore:"Cinderpaw is a fire-dark cat 45 cm at the shoulder with glossy black fur overlaid with faintly glowing ember-orange markings on its paws, ears, and tail tip. It moves silently and blends into shadow easily. It inhabits ancient forge-ruins and warm building interiors, drawn to residual warmth in stone." },

  // 2-stage Water/Ghost chain: Tidewraith → Aquaphant (Water Stone item)
  308: { id:308, name:"Seafraith", emoji:"🌊", types:["Water","Dark"],
    base:{hp:58,atk:62,def:58,spa:88,spd:75,spe:80},
    learnset:[[1,"water_gun"],[1,"shadow_ball"],[14,"surf"],[24,"phantom_claw"],[34,"hydro_pump"],[44,"eclipse_shroud"],[54,"soul_rend"],[60,"hyper_beam"]],
    evolveTo:309, evolveLevel:null, evolveItem:"waterStone", evolveMethod:"item", catchRate:135, expYield:98, rarity:"common",
    desc:"A ghost that drowned and merged with ocean tides. Haunts coastal routes, pulling travelers into the surf.",
    lore:"Seafraith is a water-dark creature 60 cm long resembling a deep-sea fish with a translucent dark body through which dim bioluminescent organs are visible. Its eyes are white and sightless — it navigates by sensing water displacement. It inhabits sunken ruins at depths where light never reaches." },

  309: { id:309, name:"Tidephant", emoji:"🐋", types:["Water","Dark"],
    base:{hp:94,atk:82,def:86,spa:113,spd:102,spe:73},
    learnset:[[1,"hydro_pump"],[1,"eclipse_shroud"],[28,"soul_rend"],[36,"phantom_claw"],[44,"geyser_burst"],[52,"shadow_ball"],[60,"dark_pulse"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:232, rarity:"rare",
    desc:"A spectral sea leviathan that capsizes ships. Half water, half ghost—completely terrifying.",
    lore:"Tidephant is a large water-dark creature 2 metres long resembling a cetacean with dark blue-black hide and a broad flat head. Its eyes emit a faint cold light visible in dark water. It inhabits deep ocean trenches and surfaces only to breathe, leaving minimal wake despite its size." },

  // 2-stage Ground/Water chain: Mudpump → Marshix (level 28)
  310: { id:310, name:"Mudpump", emoji:"🐊", types:["Ground","Water"],
    base:{hp:58,atk:68,def:62,spa:58,spd:55,spe:55},
    learnset:[[1,"mud_shot"],[1,"water_gun"],[12,"earth_power"],[22,"surf"],[32,"earthquake"],[42,"hydro_pump"],[52,"clay_armor"],[60,"hyper_beam"]],
    evolveTo:311, evolveLevel:28, catchRate:155, expYield:80, rarity:"common",
    desc:"A muddy crocodile creature that wallows in swamps. Its mud coating provides natural camouflage and armor.",
    lore:"Mudpump is a small ground-water creature 30 cm long resembling a mudskipper with a broad head and four short legs equally suited to mud and shallow water. It builds dome-shaped mud homes in tidal mudflats and uses suction from its wide mouth to excavate burrow chambers." },

  311: { id:311, name:"Marshix", emoji:"🦛", types:["Ground","Water"],
    base:{hp:105,atk:118,def:100,spa:78,spd:82,spe:62},
    learnset:[[1,"earthquake"],[1,"surf"],[22,"earth_power"],[30,"hydro_pump"],[38,"clay_armor"],[46,"bedrock_slam"],[54,"aqua_tail"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:42, expYield:222, rarity:"uncommon",
    desc:"A hippo-like swamp titan that commands both mud and water. Creates marshy terrain wherever it settles.",
    lore:"Marshix is a large ground-water hippo-like creature 1.5 metres at the shoulder with a broad pale grey body and mud-brown legs. It spends most of its time submerged in shallow marsh water with only its eyes and nostrils above the surface. Its movements churn the marsh bottom, aerating the sediment beneficially." },

  // 2-stage Ground/Dark chain: Dunecrawl → Sandrix (level 32)
  312: { id:312, name:"Dunecrawl", emoji:"🦂", types:["Ground","Dark"],
    base:{hp:55,atk:72,def:60,spa:52,spd:55,spe:70},
    learnset:[[1,"mud_shot"],[1,"bite"],[14,"earth_power"],[24,"night_slash"],[34,"earthquake"],[44,"dark_pulse"],[54,"eclipse_shroud"],[60,"hyper_beam"]],
    evolveTo:313, evolveLevel:32, catchRate:148, expYield:85, rarity:"common",
    desc:"A scorpion-like creature that burrows under desert sands. Strikes from below with venomous ambushes.",
    lore:"Dunecrawl is a medium ground-dark creature 70 cm long resembling an armadillo with dark sand-coloured armour and the ability to roll into a complete sphere. At night it unfurls and hunts, and at dawn it rolls into a ball and buries itself under a thin layer of sand, becoming invisible." },

  313: { id:313, name:"Sandrix", emoji:"🐍", types:["Ground","Dark"],
    base:{hp:88,atk:112,def:88,spa:75,spd:80,spe:98},
    learnset:[[1,"earthquake"],[1,"dark_pulse"],[26,"night_slash"],[34,"earth_power"],[42,"eclipse_shroud"],[50,"bedrock_slam"],[58,"soul_rend"],[66,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:225, rarity:"uncommon",
    desc:"A sand serpent of deadly cunning. Camouflages perfectly in desert terrain and strikes without warning.",
    lore:"Sandrix is a ground-dark serpent 1.5 metres long with sandy brown-black scales and a flat head. It inhabits desert shadow-zones — rocky overhangs and dune troughs — and hunts by detecting the vibration of footsteps in sand. Its dark colouration appears to absorb light, deepening shadows around it." },


  // ===== LEGENDARIES (IDs 314-321) =====
  314: { id:314, name:"Galeaxis",  emoji:"🌪️", types:["Wind","Electric"],
    base:{hp:102,atk:84,def:93,spa:125,spd:96,spe:100},
    learnset:[[1,"air_slash"],[1,"thunder_shock"],[7,"gust"],[14,"spark"],[21,"zephyr_dance"],[28,"thunderbolt"],[35,"downdraft"],[42,"hurricane"],[49,"squall_slash"],[56,"overcharge"],[63,"tempest_wrath"],[70,"gale_cannon"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Storm Bird. Said to control all weather in Lumoria.",
    lore:"Galeaxis is a wind-electric creature 1 metre at the shoulder resembling a sleek greyhound whose pale grey body constantly trails streamers of compressed air and electric sparks. It runs at extraordinary speeds across open plains and its passage creates brief localised sonic booms as it exceeds natural air displacement limits." },

  315: { id:315, name:"Ashvanus",   emoji:"🌋", types:["Fire","Rock"],
    base:{hp:113,atk:145,def:111,spa:102,spd:89,spe:50},
    learnset:[[1,"ember"],[1,"rock_throw"],[7,"flame_fang"],[14,"rock_slide"],[21,"magma_surge"],[28,"stone_edge"],[35,"ashfall"],[42,"flamethrower"],[49,"magma_rock"],[56,"fire_blast"],[63,"caldera_meltdown"],[70,"bedrock_slam"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Volcano Titan. Eruptions across Lumoria mark its awakening.",
    lore:"Ashvanus is a large fire-rock creature 2 metres tall resembling a volcanic vent that has grown a body. Its core is glowing magma surrounded by a shell of compressed ash-rock. It stands dormant for years between activity phases, during which local plants colonise its ash-body, making it appear as a small hill." },

  316: { id:316, name:"Abyssovex", emoji:"🌊", types:["Water","Dark"],
    base:{hp:99,atk:102,def:85,spa:130,spd:92,spe:82},
    learnset:[[1,"water_gun"],[1,"bite"],[7,"bubble_beam"],[14,"crunch"],[21,"abyssal_jet"],[28,"dark_pulse"],[35,"surf"],[42,"abyssal_snare"],[49,"dragon_pulse"],[56,"soul_rend"],[63,"hydro_pump"],[70,"geyser_burst"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Abyss Drake. Lurks in the deepest ocean trenches.",
    lore:"Abyssovex is a massive water-dark leviathan 8 metres long resembling an enormous deep-sea squid with dark bioluminescent patches along its body. Its tentacles extend 4 metres beyond its mantle. It inhabits the deepest ocean trenches and ascends toward surface waters only during rare deep-sea events." },

  // ===== NEW LUMOS IDs 108-167 =====

  // ===== ELECTRIC/ROCK =====
  92: { id:92, name:"Arcrix", emoji:"⚡", types:["Electric","Rock"],
    base:{hp:62,atk:68,def:75,spa:48,spd:55,spe:41},
    learnset:[[1,"rock_throw",[22,"arc_flash"]],[1,"thunder_shock"],[10,"spark"],[18,"rock_slide"],[20,"recover"],[26,"thunderbolt"],[34,"stone_edge",[5,"thunder_wave"]],[36,"volt_surge"],[3,"static_cage"],[31,"ball_lightning"]],
    evolveTo:93, evolveLevel:30, catchRate:130, expYield:96, rarity:"common",
    desc:"A rocky beetle crackling with stored lightning. Its shell acts as a living battery.",
    lore:"Arcrix is a spiny, iguana-like creature 80 cm long whose grey-brown rocky hide is embedded with crystals that conduct electricity. Blue arc-discharges crackle between its dorsal crystals during high humidity. It lives on exposed clifftops and charges itself from lightning strikes, surviving direct hits that would vaporise other creatures." },

  // ===== STEEL/DARK =====
  134: { id:134, name:"Aeronyx", emoji:"🦇", types:["Steel","Dark"],
    base:{hp:49,atk:51,def:69,spa:45,spd:57,spe:66},
    learnset:[[1,"bite",[20,"shadowstep"]],[1,"metal_claw"],[9,"wing_attack"],[17,"dark_pulse"],[21,"leer"],[25,"flash_cannon"],[33,"crunch",[5,"magnetize"]],[36,"shadow_ball"],[3,"ironskin"],[31,"smelt_crush"]],
    evolveTo:135, evolveLevel:28, catchRate:140, expYield:88, rarity:"common",
    desc:"A small bat with scrap-metal wings that screech on the wind. Lives in old ruins.",
    lore:"Aeronyx is a sleek steel-dark bat 80 cm long with wings made of thin flexible metal alloy rather than membrane. Its body is dark gunmetal grey with blue-tinted metal plating. It slices through the air with minimal noise and can fold its metal wings to act as shields. It roosts on steel structures." },

  // ===== FIRE/GROUND =====
  19: { id:19, name:"Magmaurin", emoji:"🐾", types:["Fire","Ground"],
    base:{hp:68,atk:70,def:59,spa:51,spd:43,spe:49},
    learnset:[[1,"ember",[22,"magma_surge"]],[1,"scratch"],[9,"mud_shot"],[17,"flame_fang"],[20,"leer"],[25,"earthquake"],[33,"flamethrower",[5,"scorch_veil"]],[36,"cinderwhirl"],[3,"embercloak"],[31,"wildfire_surge"]],
    evolveTo:20, evolveLevel:26, catchRate:150, expYield:92, rarity:"common",
    desc:"A fire mole that tunnels through volcanic rock. Its claws glow orange with heat.",
    lore:"Magmaurin is a stocky bear-sized creature with a rounded body half-coated in cooling lava plates. Its fur beneath the stone armour is singed brown. It lumbers through volcanic badlands, digging up mineral veins with massive clawed forearms, and rolls into a ball of cooled rock when threatened." },

  // ===== FAIRY/GRASS =====
  72: { id:72, name:"Floralin", emoji:"🌸", types:["Fairy","Grass"],
    base:{hp:39,atk:35,def:40,spa:63,spd:65,spe:59},
    learnset:[[1,"tackle",[20,"stardust_veil"]],[1,"fairy_wind"],[8,"vine_whip"],[16,"dazzling_gleam"],[21,"leer"],[24,"razor_leaf"],[32,"moonblast",[5,"sweet_kiss"]],[36,"seed_bomb"],[3,"charm_bloom"],[31,"leaf_blade"]],
    evolveTo:73, evolveLevel:20, catchRate:220, expYield:70, rarity:"common",
    desc:"A puff of fairy pollen given form. It drifts wherever the breeze takes it.",
    lore:"Floralin is a slender fairy-grass creature 70 cm tall resembling a humanoid formed from intertwined flower stems. Its body is pale green with pink blossoms open along its arms and crown. A trail of petals falls wherever it walks. It inhabits enchanted glades and dances in slow patterns that mirror the movement of the wind." },

  // ===== NORMAL/GROUND =====
  104: { id:104, name:"Arenikin", emoji:"🐾", types:["Normal","Ground"],
    base:{hp:47,atk:63,def:55,spa:46,spd:32,spe:64},
    learnset:[[1,"tackle",[22,"sandstrike"]],[1,"growl"],[8,"mud_shot"],[16,"quick_attack"],[20,"clay_armor"],[24,"headbutt"],[32,"earthquake",[5,"tail_whip"]],[36,"boulder_roll"],[3,"leer"],[31,"mud_bomb"]],
    evolveTo:105, evolveLevel:22, catchRate:180, expYield:78, rarity:"common",
    desc:"A sandy-furred critter that kicks up dust clouds when startled. Very skittish.",
    lore:"Arenikin is a small sandy-furred dog about 35 cm at the shoulder with large upright ears and a slender snout suited for digging. Its colouring matches desert sand almost exactly. It stores excess food underground and marks its territory with scratched symbols in stone, which researchers have documented as a primitive map system." },

  // ===== WATER/POISON =====
  31: { id:31, name:"Toxaquil", emoji:"🐙", types:["Water","Poison"],
    base:{hp:52,atk:50,def:55,spa:57,spd:52,spe:51},
    learnset:[[1,"water_gun",[22,"putrid_pulse"]],[1,"poison_sting"],[10,"bubble_beam"],[18,"sludge_bomb"],[20,"recover"],[26,"surf"],[34,"toxic",[5,"tidecaller"]],[36,"corrosion_fang"],[3,"deepwater_hymn"],[31,"sludge_wave"]],
    evolveTo:32, evolveLevel:28, catchRate:130, expYield:90, rarity:"common",
    desc:"A polypoid sea creature that releases clouds of inky venom to escape predators.",
    lore:"Toxaquil is a purple-mantled octopus about 45 cm across with eight tentacles banded in deep violet and sickly yellow. Glands beneath its skin secrete a mild paralytic toxin that coats its arms. It hunts by spreading tentacles in a wide web beneath unsuspecting prey and then quickly contracting." },

  // ===== WATER/STEEL =====
  37: { id:37, name:"Coralossus", emoji:"🪸", types:["Water","Steel"],
    base:{hp:88,atk:83,def:118,spa:71,spd:90,spe:30},
    learnset:[[1,"water_gun",[25,"ironskin"]],[1,"metal_claw"],[11,"harden"],[16,"swords_dance"],[19,"aqua_tail"],[27,"flash_cannon"],[29,"rivet_barrage"],[35,"surf"],[40,"tidal_crush"],[43,"iron_tail",[5,"tidecaller"]],[3,"deepwater_hymn"],[33,"smelt_crush"]],
    evolveTo:38, evolveLevel:44, catchRate:55, expYield:188, rarity:"uncommon",
    desc:"A golem formed from centuries of compressed coral and sunken steel. Nearly indestructible.",
    lore:"Coralossus is a massive living-reef creature 4 metres tall appearing as a hulking humanoid formed from packed coral, encrusted shells, and marine growth. Steel-hard armour covers every surface. It stands motionless on the sea floor for decades, and divers often mistake it for a natural reef formation." },

  // ===== WATER/WIND =====
  39: { id:39, name:"Depthveth", emoji:"🐬", types:["Water","Wind"],
    base:{hp:73,atk:74,def:69,spa:86,spd:72,spe:84},
    learnset:[[1,"water_gun",[24,"tidal_crush"]],[1,"gust"],[12,"bubble_beam"],[20,"wing_attack"],[25,"swords_dance"],[28,"surf"],[36,"air_slash"],[44,"hydro_pump"],[45,"riptide_slam"],[52,"hurricane",[5,"tidecaller"]],[3,"deepwater_hymn"],[37,"storm_surge"]],
    evolveTo:40, evolveLevel:42, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A dolphin that leaps between ocean waves and sea winds. Its song calms storms.",
    lore:"Depthveth is a sleek manta-ray-like creature with a 3-metre wingspan and gossamer trailing fins that ripple like silk in underwater currents. Its body is midnight blue above and pale silver beneath. It glides silently through cold deep-water channels, guided by a keen sense of electromagnetic fields." },

  // ===== WIND/PSYCHIC =====
  116: { id:116, name:"Zephyrin", emoji:"🌀", types:["Wind","Psychic"],
    base:{hp:43,atk:32,def:35,spa:69,spd:54,spe:95},
    learnset:[[1,"gust",[22,"mind_shatter"]],[1,"confusion"],[9,"quick_attack"],[17,"air_slash"],[25,"psybeam"],[29,"psystrike"],[33,"hurricane"],[41,"psychic_move",[5,"mistveil"]],[3,"zephyr_dance"],[32,"astral_rend"]],
    evolveTo:117, evolveLevel:32, catchRate:110, expYield:90, rarity:"common",
    desc:"A wisp of wind given a curious mind. Follows trainers to observe how they think.",
    lore:"Zephyrin is a graceful serpentine wind-psychic creature 1.5 metres long with translucent teal-blue scales and a constantly swirling aura of disturbed air. Its fins are long trailing ribbons of compressed wind. It inhabits mountain weather-stations and is considered a reliable predictor of atmospheric pressure changes." },

  // ===== WATER/FAIRY =====
  34: { id:34, name:"Pearlith", emoji:"🐚", types:["Water","Fairy"],
    base:{hp:36,atk:37,def:52,spa:69,spd:62,spe:57},
    learnset:[[1,"tackle",[22,"wish_spark"]],[1,"water_gun"],[8,"fairy_wind"],[16,"bubble_beam"],[20,"leer"],[24,"dazzling_gleam"],[32,"surf",[5,"tidecaller"]],[36,"riptide_slam"],[3,"deepwater_hymn"],[31,"moonblast"]],
    evolveTo:35, evolveLevel:24, catchRate:200, expYield:74, rarity:"common",
    desc:"A tiny shellfish encasing a fairy-touched pearl. Shimmers with a gentle inner light.",
    lore:"Pearlith resembles a barnacle-encrusted oyster about 20 cm in diameter, but its interior emits warm rose-gold luminescence. It forms pearls infused with fairy energy and defends itself by snapping its shell shut with surprising force against anything attempting to pry it open." },

  // ===== GRASS/DARK =====
  78: { id:78, name:"Sylvnox", emoji:"🌿", types:["Grass","Dark"],
    base:{hp:61,atk:62,def:48,spa:59,spd:54,spe:69},
    learnset:[[1,"vine_whip",[22,"root_lance"]],[1,"bite"],[10,"razor_leaf"],[18,"night_slash"],[26,"energy_ball"],[30,"grove_wrath"],[34,"crunch"],[42,"dark_pulse",[5,"sleep_powder"]],[3,"spore_burst"],[32,"void_rend"]],
    evolveTo:79, evolveLevel:30, catchRate:110, expYield:98, rarity:"common",
    desc:"A shadowy plant sprite that hides in dark undergrowth. Its thorns drip with shadow energy.",
    lore:"Sylvnox is a sleek, fox-like dark-grass creature 65 cm at the shoulder. Its coat is deep forest-green with black underbelly and dark purple-black markings. Its eyes gleam amber in shadows. It prowls the edges of forests at twilight and uses shadow-camouflage to stalk prey, striking only when within striking range." },

  // ===== POISON/GRASS =====
  162: { id:162, name:"Marlix", emoji:"🌾", types:["Poison","Grass"],
    base:{hp:55,atk:56,def:53,spa:59,spd:48,spe:66},
    learnset:[[1,"poison_sting",[22,"miasma_cloud"]],[1,"vine_whip"],[10,"sludge_bomb"],[18,"razor_leaf"],[26,"toxic"],[30,"petal_blitz"],[34,"energy_ball"],[42,"venoshock",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"sludge_wave"]],
    evolveTo:163, evolveLevel:28, catchRate:120, expYield:94, rarity:"common",
    desc:"A bog plant with razor-edged thorns dripping toxic sap. Thrives in poisoned swamps.",
    lore:"Marlix is a slender poison-grass creature 80 cm tall resembling a humanoid made of dense marsh reeds. Its stalk-body is pale green with brown banding, and it moves by bending and straightening its reed-limbs. It inhabits shallow wetlands and disguises itself as ordinary marsh vegetation between encounters." },

  // ===== DARK =====
  126: { id:126, name:"Vexakin", emoji:"👻", types:["Dark"],
    base:{hp:30,atk:38,def:31,spa:56,spd:59,spe:79},
    learnset:[[1,"bite"],[1,"leer"],[8,"quick_attack"],[16,"dark_pulse"],[20,"shadowstep"],[21,"vital_pulse"],[24,"crunch"],[32,"shadow_ball",[5,"eclipse_shroud"]],[36,"void_rend"],[3,"dread_howl"],[31,"recover"]],
    evolveTo:127, evolveLevel:26, catchRate:160, expYield:80, rarity:"common",
    desc:"A faint wraith of shadow energy. Haunts dark places and feeds on fearful emotions.",
    lore:"Vexakin is a slight dark-coloured fox-like creature 45 cm at the shoulder with deep slate-grey fur and eyes that reflect no light. It mimics sounds from its environment — calls of other creatures, distant voices, metal scraping — to confuse and misdirect. It is deeply mischievous by nature." },

  // ===== PSYCHIC/DARK =====
  128: { id:128, name:"Mentarix", emoji:"🔮", types:["Psychic","Dark"],
    base:{hp:41,atk:50,def:49,spa:78,spd:69,spe:61},
    learnset:[[1,"confusion",[22,"telepathic_slam"]],[1,"bite"],[10,"psybeam"],[18,"dark_pulse"],[26,"psychic_move"],[30,"neural_storm"],[34,"shadow_ball"],[42,"psystrike",[5,"calm_mind"]],[3,"prism_ward"],[32,"blackout_bomb"]],
    evolveTo:129, evolveLevel:34, catchRate:90, expYield:100, rarity:"common",
    desc:"A shade of psychic darkness. It exists half in reality and half in the mind's eye.",
    lore:"Mentarix is a tall psychic-dark biped 1.3 metres tall with a smooth lavender-grey body and an oversized cranium that pulses with light when it concentrates. Its small hands trail crackling dark energy. It dredges suppressed memories from others without consent and catalogues them in its own vast mental archive." },

  // ===== DARK/GRASS =====
  130: { id:130, name:"Necralia", emoji:"🌿", types:["Dark","Grass"],
    base:{hp:76,atk:72,def:79,spa:86,spd:74,spe:63},
    learnset:[[1,"bite",[24,"obsidian_fang"]],[1,"vine_whip"],[11,"night_slash"],[19,"razor_leaf"],[23,"recover"],[27,"crunch"],[35,"energy_ball"],[42,"nightmare_pulse"],[43,"dark_pulse"],[51,"shadow_ball",[5,"eclipse_shroud"]],[3,"dread_howl"],[37,"wicked_blow"]],
    evolveTo:131, evolveLevel:40, catchRate:65, expYield:178, rarity:"uncommon",
    desc:"An ancient mossy boulder animated by dark energy. Feeds on the light of living things.",
    lore:"Necralia is a plant-dark creature resembling a thorned bush 80 cm tall that has achieved mobility. Its branches are dark as charcoal and its leaves are deep burgundy-black with serrated edges. It creeps silently through forests, uprooting itself and relocating, and consumes fallen creatures to fuel its growth." },

  // ===== BUG/FAIRY =====
  202: { id:202, name:"Sericrix", emoji:"🕷️", types:["Bug","Fairy"],
    base:{hp:34,atk:52,def:63,spa:58,spd:49,spe:85},
    learnset:[[1,"string_shot",[22,"silk_bind"]],[1,"fairy_wind"],[9,"bug_bite"],[17,"dazzling_gleam"],[20,"recover"],[25,"x_scissor"],[33,"moonblast",[5,"chitin_guard"]],[36,"swarm_dive"],[3,"compound_glare"],[31,"bug_buzz"]],
    evolveTo:203, evolveLevel:26, catchRate:160, expYield:84, rarity:"common",
    desc:"A spider that weaves silk infused with fairy dust. Its webs shimmer like spun moonlight.",
    lore:"Sericrix is a spider 15 cm across with a pale cream body and legs banded in rose-gold. Its silk is exceptionally strong and has a faint iridescent sheen. It weaves elaborate three-dimensional web sculptures rather than flat sheets, incorporating fairy-touched strands that glow at dawn and dusk." },

  // ===== ICE/STEEL =====
  55: { id:55, name:"Rimeling", emoji:"🗡️", types:["Ice","Steel"],
    base:{hp:46,atk:73,def:66,spa:56,spd:52,spe:76},
    learnset:[[1,"powder_snow",[25,"cryo_lance"]],[1,"metal_claw"],[11,"ice_punch"],[19,"flash_cannon"],[27,"icicle_crash"],[30,"smelt_crush"],[35,"iron_tail"],[43,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[33,"forge_strike"]],
    evolveTo:56, evolveLevel:36, catchRate:90, expYield:110, rarity:"uncommon",
    desc:"A blade of living ice and metal. Keeps its edge forever sharp in the coldest conditions.",
    lore:"Rimeling is a slender humanoid about 1.2 metres tall made entirely of layered ice and dark tempered steel. Its body appears jointed, like armour assembled from ice-forged plates. Blue veins of compressed frost show through gaps in the plating. It stands motionless in blizzards for days, absorbing ambient cold to reinforce its body." },

  // ===== ICE/FAIRY =====
  57: { id:57, name:"Speculith", emoji:"🐟", types:["Ice","Fairy"],
    base:{hp:51,atk:37,def:62,spa:73,spd:68,spe:51},
    learnset:[[1,"tackle",[22,"pixie_bolt"]],[1,"powder_snow"],[8,"fairy_wind"],[16,"ice_beam"],[24,"dazzling_gleam"],[29,"avalanche_drive"],[32,"moonblast"],[40,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[31,"subzero_slash"]],
    evolveTo:58, evolveLevel:28, catchRate:150, expYield:85, rarity:"common",
    desc:"A fish with scales like mirror-polished ice. Reflects attacks with its shimmering body.",
    lore:"Speculith is a floating disc-shaped ice creature about 40 cm across, resembling a magnifying lens of perfectly clear fairy-touched ice. Delicate crystalline spines radiate around its circumference. It drifts through cold mountain air, using its body to focus and scatter light, and communicates with others by flashing light-signals." },

  // ===== ICE/DRAGON =====
  59: { id:59, name:"Lunaveris", emoji:"🌙", types:["Ice","Dragon"],
    base:{hp:63,atk:65,def:69,spa:79,spd:64,spe:59},
    learnset:[[1,"powder_snow",[24,"wyrm_strike"]],[1,"dragon_breath"],[12,"ice_beam"],[20,"dragon_claw"],[28,"icicle_crash"],[36,"dragon_pulse"],[44,"blizzard"],[52,"outrage",[5,"permafrost"]],[3,"winter_shroud"],[37,"scale_storm"]],
    evolveTo:60, evolveLevel:40, catchRate:60, expYield:115, rarity:"uncommon",
    desc:"A moonlit dragon of frost. Its scales glimmer with cold starlight on winter nights.",
    lore:"Lunaveris is a serpentine ice-dragon 5 metres long with scales that shift between deep blue and silver depending on the angle of light. A crescent-shaped ridge of ice forms its crest. It is nocturnal, hunting on moonlit glacier surfaces and using reflected moonlight to navigate across vast frozen plains." },

  // ===== WATER/STEEL =====
  41: { id:41, name:"Titanomare", emoji:"🐋", types:["Water","Steel"],
    base:{hp:113,atk:95,def:109,spa:84,spd:91,spe:58},
    learnset:[[1,"surf",[1,"sea_serpent_strike"]],[1,"iron_tail"],[1,"aqua_tail"],[1,"flash_cannon"],[18,"growl"],[31,"tackle"],[44,"bubble_beam"],[55,"hydro_pump"],[58,"temper_edge"],[65,"hyper_beam",[5,"tidecaller"]],[3,"deepwater_hymn"],[41,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:15, expYield:280, rarity:"rare",
    desc:"A leviathan armored in barnacle-covered steel. Said to be older than the ocean floor itself.",
    lore:"Titanomare is an oceanic titan 10 metres long with a whale-like body coated in overlapping steel-grey armour plates thick enough to deflect cannon fire. Four broad stabilising fins propel it at great speed. Ancient civilisations built harbours specifically to attract and appease this living warship." },

  // ===== EVOLUTIONS (108+ referenced above) =====

  93: { id:93, name:"Stonebolt", emoji:"🪨", types:["Electric","Rock"],
    base:{hp:81,atk:98,def:92,spa:69,spd:57,spe:83},
    learnset:[[1,"rock_slide"],[2,"thunderbolt"],[3,"spark"],[4,"thunder_wave"],[31,"stone_edge"],[33,"volt_surge"],[35,"vital_pulse"],[40,"geode_burst"],[45,"earthquake"],[50,"thunder"],[55,"overcharge"],[60,"hyper_beam"],[5,"static_cage"],[39,"wild_charge"]],
    evolveTo:94, evolveLevel:44, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A towering boulder monster wreathed in crackling lightning. Its stomps cause earthquakes.",
    lore:"Stonebolt is a stout rhinoceros-like creature 1.3 metres at the shoulder with thick stone-grey hide reinforced by natural granite ridges. Pairs of stubby crystalline horns grow from its snout, and discharging electricity between them creates a directed electrical bolt. It is slow but extraordinarily durable." },

  135: { id:135, name:"Steelvex", emoji:"🦇", types:["Steel","Dark"],
    base:{hp:82,atk:102,def:94,spa:59,spd:73,spe:78},
    learnset:[[1,"flash_cannon"],[2,"dark_pulse"],[3,"magnetize"],[30,"crunch"],[33,"shadow_ball"],[34,"harden"],[38,"rivet_barrage"],[43,"steel_wing"],[48,"night_slash"],[53,"forge_strike"],[58,"void_rend"],[63,"iron_tail"],[4,"ironskin"],[41,"smelt_crush"]],
    evolveTo:136, evolveLevel:44, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"An iron-clad wraith bat. Its metallic screech disorients enemies from great distances.",
    lore:"Steelvex is a larger dark-steel bat 1.2 metres long with broad metallic wings that catch and reflect light strangely. Its body is chrome-black. It has the habit of dismantling mechanical objects it finds — gears, clockwork, small machines — studying each component before reassembling them incorrectly." },

  20: { id:20, name:"Embrath", emoji:"🦔", types:["Fire","Ground"],
    base:{hp:97,atk:121,def:76,spa:69,spd:62,spe:64},
    learnset:[[1,"flame_fang"],[2,"mud_shot"],[3,"earthquake"],[4,"scorch_veil"],[30,"flamethrower"],[31,"battle_cry"],[36,"ashfall"],[41,"earth_power"],[46,"fissure_slam"],[51,"inferno"],[56,"fire_blast"],[61,"tectonic_slam"],[5,"embercloak"],[40,"scorched_earth"]],
    evolveTo:21, evolveLevel:44, catchRate:45, expYield:218, rarity:"uncommon",
    desc:"A lava-boring behemoth that carves tunnels with molten precision. Its spines erupt flame.",
    lore:"Embrath is a medium-sized spined lizard about 80 cm long with scales alternating charcoal grey and deep rust. Heat-sensing pits line its snout. It hunts underground prey by detecting body heat through soil, then erupts from the ground in a burst of superheated air to stun its catch." },

  73: { id:73, name:"Faelomis", emoji:"🌺", types:["Fairy","Grass"],
    base:{hp:78,atk:60,def:65,spa:115,spd:89,spe:93},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"vine_whip"],[4,"sweet_kiss"],[21,"razor_leaf"],[27,"tail_whip"],[29,"moonblast"],[34,"scratch"],[41,"moonveil"],[48,"celestial_wave"],[55,"energy_ball"],[62,"petal_blitz"],[5,"stardust_veil"],[42,"leaf_blade"]],
    evolveTo:74, evolveLevel:44, catchRate:60, expYield:195, rarity:"uncommon",
    desc:"A bloom fairy of extraordinary grace. Its petals carry healing magic on the breeze.",
    lore:"Faelomis is a tall graceful fairy-grass creature 1.2 metres tall. Its body is composed of interlocking flowering vines over a luminous inner core. Large bloom-wings trail from its back, their petals reshaping continuously. It is drawn to locations where multiple ley lines intersect, feeding on ambient magical energy." },

  105: { id:105, name:"Dravanas", emoji:"🦁", types:["Normal","Ground"],
    base:{hp:91,atk:108,def:71,spa:50,spd:62,spe:112},
    learnset:[[1,"mud_shot"],[2,"growl"],[22,"headbutt"],[28,"vital_pulse"],[29,"earthquake"],[33,"boulder_roll"],[34,"swords_dance"],[40,"wild_tumble"],[46,"momentum_rush"],[52,"body_slam"],[58,"earth_power"],[64,"hyper_beam"],[3,"tail_whip"],[42,"loam_leech"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:200, rarity:"uncommon",
    desc:"A sand lion with a mane of hardened earth. Commands the desert winds.",
    lore:"Dravanas is a lion-sized ground creature 1.2 metres at the shoulder with tawny earth-coloured fur and a mane of compressed soil and pebbles. Its paws leave deep prints. It digs vast underground lair systems that can span a hectare, and its roar causes nearby loose soil to tremor in concentric rings." },

  32: { id:32, name:"Noxaquith", emoji:"🦑", types:["Water","Poison"],
    base:{hp:77,atk:80,def:76,spa:108,spd:83,spe:53},
    learnset:[[1,"sludge_bomb"],[2,"surf"],[3,"tidecaller"],[31,"toxic"],[33,"corrosion_fang"],[34,"growl"],[38,"tackle"],[43,"blight_mist"],[48,"venoshock"],[53,"dark_pulse"],[58,"sludge_wave"],[63,"hydro_pump"],[4,"deepwater_hymn"],[41,"venom_lance"]],
    evolveTo:33, evolveLevel:44, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A venomous sea predator with eight toxic-tipped tentacles. Feared by all ocean life.",
    lore:"Noxaquith is a large hood-flaring squid about 1.2 metres long. Its body is deep navy blue with patterns that shift like oil on water. Poisoned ink jets blind and briefly paralyze anything caught in the cloud, serving as both camouflage and an offensive weapon." },

  117: { id:117, name:"Pneumathos", emoji:"🌪️", types:["Wind","Psychic"],
    base:{hp:66,atk:57,def:69,spa:114,spd:88,spe:110},
    learnset:[[1,"air_slash"],[2,"psybeam"],[3,"psystrike"],[4,"mind_shatter"],[5,"mistveil"],[32,"hurricane"],[38,"psychic_move"],[39,"harden"],[44,"calm_mind"],[50,"insight_flare"],[56,"thought_crush"],[62,"hyper_beam"],[6,"zephyr_dance"],[41,"astral_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:240, rarity:"rare",
    desc:"A cyclone of pure psychic wind. Its thoughts create miniature tornadoes around it.",
    lore:"Pneumathos is a large wind-psychic entity 2.5 metres tall resembling a swirling pillar of concentrated air with a humanoid core visible through the vortex. Psychic energy gives it a faint violet tint. It reads atmospheric data from thousands of kilometres away and processes it instantly." },

  35: { id:35, name:"Undirael", emoji:"🧜", types:["Water","Fairy"],
    base:{hp:65,atk:62,def:63,spa:110,spd:87,spe:103},
    learnset:[[1,"water_gun"],[2,"fairy_wind"],[3,"bubble_beam"],[4,"dazzling_gleam"],[5,"tidecaller"],[29,"surf"],[30,"tail_whip"],[36,"scratch"],[42,"moonveil"],[48,"aqua_tail"],[54,"moonblast"],[60,"hydro_pump"],[6,"deepwater_hymn"],[40,"sea_serpent_strike"]],
    evolveTo:36, evolveLevel:46, catchRate:40, expYield:222, rarity:"rare",
    desc:"A sea nymph radiating both water and fairy energy. Said to protect lost sailors.",
    lore:"Undirael is a mermaid-like creature 1.5 metres tall with the lower body of a deep-sea fish in shimmering violet and a humanoid torso. Its flowing hair is made of water-weed adorned with living sea-stars. It guides lost sailors away from dangerous reefs by projecting alluring visions of safe harbours." },

  79: { id:79, name:"Morraveth", emoji:"🌑", types:["Grass","Dark"],
    base:{hp:84,atk:101,def:80,spa:100,spd:72,spe:67},
    learnset:[[1,"razor_leaf"],[2,"energy_ball"],[3,"night_slash"],[4,"sleep_powder"],[31,"crunch"],[35,"harden"],[39,"dark_pulse"],[40,"photon_leaf"],[45,"shadow_ball"],[50,"blackout_bomb"],[55,"void_rend"],[60,"petal_blitz"],[5,"spore_burst"],[38,"leaf_blade"]],
    evolveTo:80, evolveLevel:44, catchRate:40, expYield:218, rarity:"uncommon",
    desc:"A dark vine predator that ensnares prey in shadow-infused tendrils. Ancient and cunning.",
    lore:"Morraveth is a wolf-like dark-grass predator 90 cm at the shoulder with midnight-green fur and black patches. Withered vines and dead bark cover parts of its body naturally. It hunts by corrupting plant growth around prey into thorny barriers, gradually encircling its target before closing in." },

  163: { id:163, name:"Blightalis", emoji:"🪷", types:["Poison","Grass"],
    base:{hp:88,atk:80,def:60,spa:116,spd:83,spe:58},
    learnset:[[1,"sludge_bomb"],[2,"toxic"],[3,"poison_sting"],[4,"toxic_surge"],[28,"petal_blitz"],[31,"energy_ball"],[35,"growl"],[39,"venoshock"],[42,"battle_cry"],[49,"photon_leaf"],[56,"venom_lance"],[63,"root_lance"],[5,"toxin_bloom"],[43,"leaf_blade"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:215, rarity:"uncommon",
    desc:"A carnivorous flower of potent venom. Its blooms lure in prey before injecting toxins.",
    lore:"Blightalis is a poison-grass creature 1.2 metres tall resembling a large corrupted flower. Its petals are deep crimson-purple and droop downward like a wilting bloom. Its stem-body is hollow and filled with toxic nectar. It lures insects and small creatures into its central chamber, trapping and dissolving them." },

  127: { id:127, name:"Specraxis", emoji:"👻", types:["Dark","Psychic"],
    base:{hp:78,atk:68,def:54,spa:107,spd:90,spe:91},
    learnset:[[1,"dark_pulse"],[2,"eclipse_shroud"],[29,"shadow_ball"],[30,"growl"],[34,"tackle"],[38,"confusion"],[42,"dreamweave"],[46,"night_slash"],[50,"nightmare_pulse"],[54,"psychic_move"],[58,"blackout_bomb"],[62,"psystrike"],[3,"dread_howl"],[39,"astral_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A phantom born from dark and psychic energies. Can read minds and project nightmares.",
    lore:"Specraxis is a ghostly dark-psychic creature 70 cm tall with a translucent smoke-grey body and large hollow eye-sockets that glow with pale violet light. It floats 10 cm above the ground at all times. It reads surface thoughts involuntarily and broadcasts them back in distorted form, causing confusion in crowded places." },

  129: { id:129, name:"Voidaxis", emoji:"🌀", types:["Psychic","Dark"],
    base:{hp:83,atk:77,def:72,spa:107,spd:89,spe:75},
    learnset:[[1,"psybeam"],[2,"dark_pulse"],[3,"psychic_move"],[4,"shadow_ball"],[5,"calm_mind"],[39,"psystrike"],[40,"battle_cry"],[44,"prism_ward"],[49,"obsidian_fang"],[54,"void_rend"],[59,"mind_shatter"],[64,"hyper_beam"],[6,"mind_reader"],[41,"thought_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:248, rarity:"rare",
    desc:"A void being of psychic and dark power. Consumes light and thought with equal ease.",
    lore:"Voidaxis is a large psychic-dark entity 1.5 metres tall whose body appears to exist partially in another dimension — its edges are blurred and its form shifts when viewed peripherally. Its presence makes nearby electronic devices malfunction. It communicates only through psychic projection and has never been heard to vocalise." },

  203: { id:203, name:"Arachnalis", emoji:"🕸️", types:["Bug","Fairy"],
    base:{hp:76,atk:64,def:73,spa:101,spd:89,spe:74},
    learnset:[[1,"dazzling_gleam"],[2,"x_scissor"],[3,"string_shot"],[30,"moonblast"],[31,"charm_bloom"],[34,"harden"],[38,"pheromone_rush"],[42,"wild_tumble"],[46,"gossamer_lance"],[50,"moonveil"],[54,"bug_buzz"],[58,"fae_requiem"],[4,"chitin_guard"],[37,"mandible_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:318, rarity:"uncommon",
    desc:"A radiant spider archon that spins webs that trap bad dreams. Revered as a good omen.",
    lore:"Arachnalis is a large spider 30 cm across with a sleek silver-white body and gossamer wings — vestigial but capable of short gliding jumps. Its web structures are architectural in complexity. It inhabits flowered glades and decorates its webs with flower petals, creating structures that attract pollinating insects as prey." },

  56: { id:56, name:"Deepfreeze", emoji:"⚔️", types:["Ice","Steel"],
    base:{hp:69,atk:122,def:105,spa:78,spd:83,spe:79},
    learnset:[[1,"ice_punch"],[2,"flash_cannon"],[3,"icicle_crash"],[4,"iron_tail"],[5,"permafrost"],[40,"blizzard"],[41,"winter_shroud"],[44,"swords_dance"],[48,"glacial_shard"],[52,"steel_wing"],[56,"avalanche_drive"],[60,"hyper_beam"],[6,"frostfire_veil"],[37,"subzero_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:260, rarity:"rare",
    desc:"A legendary blade forged from glacier ice and pure ore. Its strikes freeze what they cut.",
    lore:"Deepfreeze is a heavily armoured bipedal warrior 1.8 metres tall. Its steel-and-ice body is broad-chested with thick pauldrons of glacial ice fused permanently to steel underneath. Its footsteps leave frost-rimed prints. It patrols the deepest glacier regions and engages any intruder with sword-like projections of flash-frozen air." },

  58: { id:58, name:"Irisarael", emoji:"💠", types:["Ice","Fairy"],
    base:{hp:73,atk:69,def:92,spa:95,spd:100,spe:67},
    learnset:[[1,"ice_beam"],[2,"dazzling_gleam"],[3,"tackle"],[4,"permafrost"],[29,"moonblast"],[34,"stardust_veil"],[37,"blizzard"],[40,"growl"],[46,"wish_spark"],[52,"cryo_lance"],[58,"icicle_crash"],[64,"hyper_beam"],[5,"winter_shroud"],[42,"subzero_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:218, rarity:"rare",
    desc:"A prismatic ice being of refined fairy power. Its crystalline body bends light into rainbows.",
    lore:"Irisarael is a graceful, winged fairy creature 1 metre tall. Its wings are formed from enormous flat ice crystals showing rainbow iridescence in sunlight. Its slender body is pale lavender-white. It inhabits frozen waterfalls, sleeping anchored to the ice surface by small ice anchors on its heels." },

  60: { id:60, name:"Boreadrake", emoji:"🐉", types:["Ice","Dragon"],
    base:{hp:84,atk:104,def:93,spa:110,spd:83,spe:76},
    learnset:[[1,"ice_beam"],[2,"dragon_pulse"],[3,"icicle_crash"],[4,"permafrost"],[41,"blizzard"],[44,"swords_dance"],[48,"dragon_dance"],[49,"outrage"],[52,"glacial_shard"],[56,"avalanche_drive"],[60,"ancient_breath"],[64,"hyper_beam"],[5,"winter_shroud"],[38,"drake_rush"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:285, rarity:"rare",
    desc:"A dragon cloaked in the aurora. Its roar scatters ribbons of colored ice across the sky.",
    lore:"Boreadrake is an imposing ice dragon 7 metres long with broad wings that span 10 metres. Its thick scales are blue-white, edged in darker navy, and its underbelly is pale silver. Ancient artwork shows it guarding the northern glaciers for millennia. When it exhales, the air solidifies into ice shards that rain down for hundreds of metres." },

  // ===== ADDITIONAL COMMON/UNCOMMON/RARE LUMOS =====

  // ===== FIRE/PSYCHIC =====
  22: { id:22, name:"Scorchorin", emoji:"🔥", types:["Fire","Psychic"],
    base:{hp:35,atk:41,def:37,spa:58,spd:56,spe:68},
    learnset:[[1,"ember",[20,"cinderwhirl"]],[1,"confusion"],[9,"psybeam"],[17,"flamethrower"],[21,"recover"],[25,"psychic_move"],[33,"fire_blast",[5,"scorch_veil"]],[36,"magma_surge"],[3,"embercloak"],[31,"inferno"]],
    evolveTo:23, evolveLevel:28, catchRate:150, expYield:88, rarity:"common",
    desc:"A psychic flame sprite. Its fire burns hotter when it concentrates its mind.",
    lore:"Scorchorin is a lightly built snake-headed lizard about 1 metre long with bright amber scales marked by psychic-violet patterns along the flanks. Its eyes glow purple when focusing energy. It preys on animals much larger than itself by implanting sensory illusions that disorient them before striking." },

  23: { id:23, name:"Pyraxis", emoji:"🧠", types:["Fire","Psychic"],
    base:{hp:68,atk:64,def:68,spa:103,spd:81,spe:98},
    learnset:[[1,"flamethrower"],[2,"psychic_move"],[3,"scorch_veil"],[30,"fire_blast"],[32,"battle_cry"],[36,"calm_mind"],[40,"dreamweave"],[44,"heat_wave"],[48,"psystrike"],[52,"mind_shatter"],[56,"inferno"],[60,"solar_flare"],[4,"embercloak"],[38,"thought_crush"]],
    evolveTo:24, evolveLevel:44, catchRate:35, expYield:235, rarity:"rare",
    desc:"A psychic fire sage. Projects visions of infernos to terrify foes before striking.",
    lore:"Pyraxis is a tall mantis-like biped 1.5 metres high with flame-red chitin plating and violet-lit compound eyes. Long scythe-like forelimbs channel both heat and psychic pressure. It stalks prey through arid ruins, paralyzing targets with a telepathic shock before incinerating them." },

  // ===== GRASS/ELECTRIC =====
  75: { id:75, name:"Sylvolt", emoji:"🌱", types:["Grass","Electric"],
    base:{hp:40,atk:63,def:39,spa:60,spd:54,spe:59},
    learnset:[[1,"vine_whip",[22,"volt_surge"]],[1,"thunder_shock"],[8,"razor_leaf"],[16,"spark"],[20,"recover"],[24,"energy_ball"],[32,"thunderbolt",[5,"sleep_powder"]],[36,"plasma_strike"],[3,"spore_burst"],[31,"petal_blitz"]],
    evolveTo:76, evolveLevel:22, catchRate:190, expYield:78, rarity:"common",
    desc:"A sprout crackling with static electricity. Charges itself by photosynthesizing lightning.",
    lore:"Sylvolt is a lithe, raptor-like creature 70 cm at the shoulder with vivid green scales striped with yellow electric markings. A dorsal fin of conductive leaf-like scales runs its spine. It perches high in trees and charges itself in thunderstorms, storing electricity in specialised cells along its spine for later discharge." },

  76: { id:76, name:"Sparkwood", emoji:"🌳", types:["Grass","Electric"],
    base:{hp:81,atk:78,def:68,spa:111,spd:84,spe:68},
    learnset:[[1,"razor_leaf"],[2,"recover"],[3,"vine_whip"],[4,"volt_surge"],[5,"sleep_powder"],[22,"energy_ball"],[29,"thunderbolt"],[30,"swords_dance"],[38,"petal_blitz"],[46,"verdant_surge"],[54,"thunder"],[62,"hyper_beam"],[6,"spore_burst"],[42,"canopy_crash"]],
    evolveTo:77, evolveLevel:44, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"An ancient tree monster that stores electric charge in every leaf. Touch it and be zapped.",
    lore:"Sparkwood is a large quadruped 1.3 metres at the shoulder whose body resembles a living tree. Its brown bark-covered legs support a leafy upper body shot through with crackling yellow electric veins. During storms it acts as a natural lightning rod, absorbing strikes and distributing the charge through forest roots." },

  // ===== ROCK/DARK =====
  132: { id:132, name:"Obsidrix", emoji:"🪨", types:["Rock","Dark"],
    base:{hp:73,atk:69,def:75,spa:48,spd:62,spe:32},
    learnset:[[1,"rock_throw",[22,"obsidian_crash"]],[1,"bite"],[10,"headbutt"],[18,"crunch"],[26,"rock_slide"],[30,"landslide"],[34,"dark_pulse"],[42,"stone_edge",[5,"granite_wall"]],[3,"petrify_gaze"],[32,"quarry_crush"]],
    evolveTo:133, evolveLevel:30, catchRate:130, expYield:97, rarity:"common",
    desc:"A rock monster that absorbs shadow energy. Moves imperceptibly slow but hits with shattering force.",
    lore:"Obsidrix is a spiny rock-dark creature 60 cm long resembling a horned lizard made of volcanic obsidian. Its body is jet black with razor-sharp ridges. It reflects almost no light. It inhabits old lava tubes and volcanic glass fields, and its presence is detected mainly by the sound of its obsidian scales clicking together." },

  133: { id:133, name:"Monolithox", emoji:"🗿", types:["Rock","Dark"],
    base:{hp:102,atk:114,def:103,spa:62,spd:70,spe:39},
    learnset:[[1,"rock_slide"],[2,"landslide"],[3,"crunch"],[4,"granite_wall"],[31,"dark_pulse"],[35,"battle_cry"],[39,"stone_edge"],[40,"abyssal_snare"],[45,"shadow_ball"],[50,"blackout_bomb"],[55,"earthquake"],[60,"hyper_beam"],[5,"petrify_gaze"],[38,"malice_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:230, rarity:"uncommon",
    desc:"A living monolith of darkened stone. Ancient civilizations worshipped it as a god of night.",
    lore:"Monolithox is a towering rock-dark monolith creature 3 metres tall. It appears to be a standing stone until it moves — its rectangular basalt-dark body is nearly featureless except for two deep-set glowing red eyes. It moves extremely slowly but is virtually indestructible, its body having the hardness of natural obsidian." },

  // ===== POISON/BUG =====
  164: { id:164, name:"Blightmite", emoji:"🐛", types:["Poison","Bug"],
    base:{hp:56,atk:37,def:55,spa:65,spd:52,spe:30},
    learnset:[[1,"poison_sting",[20,"venom_lance"]],[1,"string_shot"],[8,"bug_bite"],[16,"sludge_bomb"],[21,"recover"],[24,"x_scissor"],[32,"toxic",[5,"toxic_surge"]],[36,"sonic_buzz"],[3,"toxin_bloom"],[31,"mandible_crush"]],
    evolveTo:165, evolveLevel:20, catchRate:220, expYield:65, rarity:"common",
    desc:"A larva coated in toxic slime. Leaves a trail of venom wherever it crawls.",
    lore:"Blightmite is a small caterpillar-like poison-bug creature 10 cm long. Its body is dark purple-black with short bristle-hairs that release toxins on contact. It feeds on the toxic leaves that other creatures avoid, sequestering their poisons into its own body and becoming increasingly dangerous as it eats." },

  165: { id:165, name:"Noxoveth", emoji:"🦋", types:["Poison","Bug"],
    base:{hp:77,atk:69,def:57,spa:106,spd:84,spe:92},
    learnset:[[1,"sludge_bomb"],[2,"toxic_surge"],[20,"recover"],[25,"quick_attack"],[29,"toxic"],[30,"nerve_agent"],[35,"venoshock"],[40,"air_slash"],[45,"putrid_pulse"],[50,"acid_rain"],[55,"cocoon_burst"],[60,"bug_buzz"],[3,"toxin_bloom"],[39,"leech_life"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A venomous moth that releases toxic scales on the wind. A cloud of them can fell a Lumori quickly.",
    lore:"Noxoveth is a large poison-bug butterfly with a 50 cm wingspan. Its wings are deep black with vivid purple warning patterns. It releases a cloud of toxic scales when startled, and the scales cause skin irritation and respiratory distress in creatures that inhale them. It inhabits dense poisonous forest regions." },

  // ===== STEEL/GROUND =====
  153: { id:153, name:"Forgekin", emoji:"⚙️", types:["Steel","Ground"],
    base:{hp:60,atk:63,def:85,spa:30,spd:50,spe:35},
    learnset:[[1,"metal_claw",[22,"forge_strike"]],[1,"mud_shot"],[9,"harden"],[17,"flash_cannon"],[20,"tail_whip"],[25,"earthquake"],[33,"iron_tail",[5,"magnetize"]],[36,"boulder_roll"],[3,"ironskin"],[31,"scorched_earth"]],
    evolveTo:154, evolveLevel:26, catchRate:160, expYield:90, rarity:"common",
    desc:"A small ore elemental born in deep mine shafts. Tough as iron and twice as stubborn.",
    lore:"Forgekin is a compact steel-ground creature 60 cm tall shaped like a short humanoid miner. Its steel body is scuffed and dented from constant digging. It uses its broad flat hands as shovels to excavate ore veins. It never stops working — even while dormant it taps at nearby rock surfaces reflexively." },

  154: { id:154, name:"Titanolith", emoji:"🤖", types:["Steel","Ground"],
    base:{hp:95,atk:108,def:116,spa:52,spd:79,spe:30},
    learnset:[[1,"flash_cannon"],[2,"earthquake"],[3,"magnetize"],[30,"iron_tail"],[31,"battle_cry"],[34,"loam_leech"],[38,"rock_slide"],[42,"temper_edge"],[46,"body_slam"],[50,"earth_power"],[54,"tungsten_ram"],[58,"anvil_drop"],[4,"ironskin"],[37,"magnitude"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:222, rarity:"uncommon",
    desc:"A forged golem of steel and compressed earth. Was created to guard ancient mines.",
    lore:"Titanolith is a massive steel-ground golem 2.5 metres tall. Its body is a tremendous assembly of metal and compressed earth. The ground trembles slightly with each of its steps. It is largely indifferent to the world around it and moves at its own slow pace, but obstacles that cannot be sidestepped are simply absorbed." },

  // ===== DRAGON/GROUND =====
  106: { id:106, name:"Geodrak", emoji:"🐣", types:["Dragon","Ground"],
    base:{hp:40,atk:59,def:63,spa:57,spd:42,spe:64},
    learnset:[[1,"scratch",[22,"terra_spike"]],[1,"dragon_breath"],[10,"mud_shot"],[18,"dragon_claw"],[20,"tail_whip"],[26,"earthquake"],[34,"dragon_pulse",[5,"dragon_dance"]],[36,"sinkhole_maw"],[3,"draconic_roar"],[31,"dragon_rush"]],
    evolveTo:107, evolveLevel:32, catchRate:80, expYield:94, rarity:"uncommon",
    desc:"A burrowing dragon hatchling. Digs deep tunnels and breathes sand-laden gusts.",
    lore:"Geodrak is a hatchling dragon about 40 cm long with rough grey-brown scales and two stumpy wing-buds on its back. Its small claws are already powerful diggers. It hatches from eggs buried in volcanic soil and immediately begins tunnelling to locate its first mineral meal." },

  107: { id:107, name:"Quakeon", emoji:"🐲", types:["Dragon","Ground"],
    base:{hp:86,atk:108,def:96,spa:94,spd:64,spe:69},
    learnset:[[1,"dragon_claw"],[2,"earthquake"],[3,"dragon_dance"],[32,"dragon_pulse"],[36,"battle_cry"],[40,"draconic_roar"],[44,"tremor_stomp"],[48,"earth_power"],[52,"eon_crash"],[56,"ancient_breath"],[60,"outrage"],[64,"hyper_beam"],[4,"primordial_roar"],[39,"scale_storm"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:260, rarity:"rare",
    desc:"A subterranean dragon that causes quakes with each step. Rules the deep underground.",
    lore:"Quakeon is a mature ground-dragon 2 metres long with broad overlapping dark-bronze scales and fully developed wings too short for sustained flight but useful for gliding downhill. It excavates vast cavern systems using its tail as a battering ram, and ground above its tunnels often subsides unexpectedly." },

  // ===== NORMAL/PSYCHIC =====
  189: { id:189, name:"Quirelin", emoji:"🐑", types:["Normal","Psychic"],
    base:{hp:49,atk:43,def:42,spa:63,spd:68,spe:58},
    learnset:[[1,"tackle",[22,"future_echo"]],[1,"confusion"],[9,"growl"],[17,"psybeam"],[25,"recover"],[29,"dreamweave"],[33,"psychic_move"],[41,"calm_mind",[5,"tail_whip"]],[3,"leer"],[32,"psycho_cut"]],
    evolveTo:190, evolveLevel:24, catchRate:180, expYield:78, rarity:"common",
    desc:"A woolly psychic creature that reads emotional auras. Very empathetic and gentle.",
    lore:"Quirelin is a small psychic sheep about 40 cm at the shoulder with soft white wool and calm violet eyes. Its wool carries a faint static charge from accumulated psychic energy. It grazes peacefully in highland meadows and the simple act of standing near it produces a remarkable sense of mental clarity." },

  190: { id:190, name:"Aetherflock", emoji:"🐏", types:["Normal","Psychic"],
    base:{hp:88,atk:57,def:67,spa:110,spd:103,spe:75},
    learnset:[[1,"psybeam"],[2,"future_echo"],[3,"growl"],[24,"recover"],[30,"psychic_move"],[31,"vital_pulse"],[36,"wild_tumble"],[38,"calm_mind"],[42,"body_slam"],[48,"thought_crush"],[54,"psystrike"],[60,"hyper_beam"],[4,"tail_whip"],[40,"headbutt"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:200, rarity:"uncommon",
    desc:"A dreaming flock manifestation. Said to appear to sleeping trainers before a great trial.",
    lore:"Aetherflock is a medium psychic sheep 70 cm at the shoulder with thicker wool of silvery-white that drifts gently in an invisible wind even in still air. Its wool glows faintly at night. Entire flocks graze on isolated mountain plateaux and are said to collectively generate powerful psychic fields." },

  // ===== BUG/GROUND =====
  204: { id:204, name:"Muddite", emoji:"🪲", types:["Bug","Ground"],
    base:{hp:62,atk:68,def:73,spa:34,spd:35,spe:45},
    learnset:[[1,"bug_bite",[22,"chitin_guard"]],[1,"mud_shot"],[10,"string_shot"],[18,"x_scissor"],[20,"leer"],[26,"earthquake"],[34,"bug_buzz",[5,"compound_glare"]],[36,"swarm_dive"],[3,"moth_dust"],[31,"magnitude"]],
    evolveTo:205, evolveLevel:24, catchRate:170, expYield:88, rarity:"common",
    desc:"A burrowing beetle that lives in dry earth. Its mandibles can crack solid rock.",
    lore:"Muddite is a small grub-like bug creature 6 cm long with a soft muddy-brown body and short digging limbs. It lives entirely in clay-rich soil and packs mud around itself to form a protective case when threatened. It is an important aerator of heavy clay soils and supports plant root growth." },

  205: { id:205, name:"Quarrix", emoji:"🪲", types:["Bug","Ground"],
    base:{hp:90,atk:108,def:93,spa:68,spd:58,spe:65},
    learnset:[[1,"x_scissor"],[2,"string_shot"],[24,"earthquake"],[29,"swords_dance"],[31,"bug_buzz"],[34,"sandstrike"],[39,"rock_slide"],[44,"mandible_crush"],[49,"cocoon_burst"],[54,"earth_power"],[59,"stone_edge"],[64,"hyper_beam"],[3,"chitin_guard"],[41,"drill_run"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"An armored ground beetle of incredible toughness. Plows through solid bedrock with ease.",
    lore:"Quarrix is a medium beetle 15 cm long with a hard quartzite-grey shell and powerful digging forelegs. Its shell surface has the texture of rough stone. It inhabits rocky hillsides and buries itself in gravel, extracting mineral nutrients from the stone it processes through a specialised digestive system." },

  // ===== WIND/ICE =====
  61: { id:61, name:"Gelspike", emoji:"🌬️", types:["Wind","Ice"],
    base:{hp:34,atk:45,def:36,spa:64,spd:47,spe:93},
    learnset:[[1,"gust"],[1,"powder_snow"],[8,"wing_attack"],[16,"permafrost"],[22,"cryo_lance"],[24,"air_slash"],[29,"gale_cannon"],[32,"ice_beam"],[40,"hurricane",[5,"mistveil"]],[3,"zephyr_dance"],[31,"storm_surge"]],
    evolveTo:62, evolveLevel:26, catchRate:180, expYield:78, rarity:"common",
    desc:"A gust of frozen air given form. Howls through mountain passes on the coldest nights.",
    lore:"Gelspike is a compact creature about 60 cm tall shaped somewhat like a hedgehog. Its body is pale ice-blue and covered in dozens of sharp translucent ice spines that project outward in all directions. A constant cold mist drifts around it. It rolls into a spiky ball when threatened, allowing wind to carry it across frozen plains." },

  62: { id:62, name:"Gelwing", emoji:"🦅", types:["Wind","Ice"],
    base:{hp:74,atk:66,def:61,spa:106,spd:78,spe:92},
    learnset:[[1,"wing_attack"],[2,"air_slash"],[3,"mistveil"],[29,"ice_beam"],[31,"battle_cry"],[36,"sleet_barrage"],[37,"hurricane"],[41,"cyclone_blade"],[46,"icicle_crash"],[51,"avalanche_drive"],[56,"blizzard"],[61,"hyper_beam"],[4,"zephyr_dance"],[40,"thermal_dive"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:215, rarity:"uncommon",
    desc:"A raptor of blizzards. Summons snowstorms with each powerful wingbeat.",
    lore:"Gelwing is a large eagle-like creature with a 2-metre wingspan. Its feathers are sleek white with ice-blue tips, and its talons are permanently encased in curved ice blades. It hunts mountain prey by diving from high altitude and striking with talons that freeze whatever they grasp on contact." },

  // ===== FAIRY/STEEL =====
  145: { id:145, name:"Faerrin", emoji:"📌", types:["Fairy","Steel"],
    base:{hp:35,atk:46,def:71,spa:68,spd:52,spe:51},
    learnset:[[1,"fairy_wind",[22,"ironskin"]],[1,"metal_claw"],[9,"dazzling_gleam"],[17,"flash_cannon"],[20,"recover"],[25,"moonblast"],[33,"iron_tail",[5,"sweet_kiss"]],[36,"gossamer_lance"],[3,"stardust_veil"],[31,"glitter_storm"]],
    evolveTo:146, evolveLevel:26, catchRate:170, expYield:82, rarity:"common",
    desc:"A tiny fairy-knight made of living silver. Fiercely guards those it bonds with.",
    lore:"Faerrin is a petite fairy-steel creature 40 cm tall resembling a humanoid knight in tiny armour. Its armour is forged from a pale silver-gold alloy that catches fairy light and redirects it as a dazzling display. It inhabits ruined ancient fortresses and maintains guard even centuries after the fort's abandonment." },

  146: { id:146, name:"Shinarith", emoji:"🛡️", types:["Fairy","Steel"],
    base:{hp:70,atk:67,def:107,spa:87,spd:95,spe:54},
    learnset:[[1,"dazzling_gleam"],[2,"flash_cannon"],[3,"moonblast"],[4,"metal_claw"],[5,"sweet_kiss"],[30,"iron_tail"],[32,"growl"],[38,"tackle"],[44,"steel_wing"],[50,"temper_edge"],[56,"moonveil"],[62,"hyper_beam"],[6,"stardust_veil"],[41,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:230, rarity:"rare",
    desc:"An armored fairy sentinel that never abandons its post. Its shield can repel any curse.",
    lore:"Shinarith is a medium fairy-steel guardian 90 cm tall encased in gleaming platinum armour decorated with fairy-glyph engravings. Its inner light shines through gaps in the armour in warm gold tones. It is fiercely loyal and will defend any being it has bonded with from threats many times its size." },

  317: { id:317, name:"Temporith", emoji:"⏳", types:["Psychic","Dragon"],
    base:{hp:97,atk:100,def:99,spa:132,spd:107,spe:83},
    learnset:[[1,"confusion"],[1,"dragon_breath"],[7,"psybeam"],[14,"calm_mind"],[21,"dragon_claw"],[28,"psychic_move"],[35,"dragon_pulse"],[42,"prism_ward"],[49,"astral_rend"],[56,"ancient_breath"],[63,"temporal_rift"],[70,"neural_storm"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Veil of Time. Said to exist at the crossing point of past and future.",
    lore:"Temporith is a psychic-dragon 3 metres long whose scales appear to flicker between states of existence — slightly out of phase with the present moment. Its outline is never quite sharp. It inhabits places where history is dense — ancient battlefields, old libraries — feeding on residual temporal energy." },

  318: { id:318, name:"Gaiavorn", emoji:"🌍", types:["Ground","Grass"],
    base:{hp:103,atk:125,def:104,spa:92,spd:89,spe:75},
    learnset:[[1,"mud_shot"],[1,"vine_whip"],[7,"sandstrike"],[14,"razor_leaf"],[21,"earth_power"],[28,"seed_bomb"],[35,"clay_armor"],[42,"briar_lash"],[49,"earthquake"],[56,"grove_wrath"],[63,"worldseed_quake"],[70,"verdant_surge"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Spirit of the Land. Every continent in Lumoria trembles at its footfall.",
    lore:"Gaiavorn is a ground-grass titan 4 metres tall resembling a towering elemental figure whose lower body is packed earth and roots and whose upper body is a living forest canopy. Trees grow from its shoulders. It moves once per decade at most and its displacement creates new valleys and ridges." },

  319: { id:319, name:"Voidraxis", emoji:"🌌", types:["Dark","Fairy"],
    base:{hp:95,atk:93,def:89,spa:131,spd:113,spe:88},
    learnset:[[1,"fairy_wind"],[1,"bite"],[7,"dark_pulse"],[14,"dazzling_gleam"],[21,"eclipse_shroud"],[28,"moonblast"],[35,"abyssal_snare"],[42,"shadow_ball"],[49,"dread_howl"],[56,"glitter_storm"],[63,"soul_rend"],[70,"fae_requiem"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Void Star. A being of absolute darkness ringed by fairy light. Where it passes, stars blink out.",
    lore:"Voidraxis is a dark-fairy creature 1 metre at the shoulder with a body that appears as a perfectly shaped void in reality — an absence of light surrounded by a rim of pale fairy luminescence. It inhabits boundary spaces between light and dark and feeds on ambient emotional energy at dawn and dusk." },

  320: { id:320, name:"Galvathon", emoji:"⚡", types:["Steel","Electric"],
    base:{hp:91,atk:120,def:108,spa:103,spd:84,spe:93},
    learnset:[[1,"metal_claw"],[1,"thunder_shock"],[7,"spark"],[14,"steel_wing"],[21,"magnetize"],[28,"thunderbolt"],[35,"flash_cannon"],[42,"forge_strike"],[49,"iron_tail"],[56,"ball_lightning"],[63,"anvil_drop"],[70,"thunder"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Stormforged. Born in the heart of the greatest storm ever recorded. Lightning is its heartbeat.",
    lore:"Galvathon is a massive steel-electric creature 3 metres tall resembling a great mechanical titan powered by its own internal fusion of steel and lightning. Its body is dark polished metal with electric arcs cascading continuously across its surface. It is considered the pinnacle of natural mechanical evolution." },

  // ===== NEW EVOLUTIONS (IDs 168-177) =====

  91: { id:91, name:"Vortexathos", emoji:"🦅", types:["Electric","Wind"],
    base:{hp:65,atk:78,def:55,spa:96,spd:73,spe:120},
    learnset:[[1,"thunder_shock"],[1,"downdraft"],[2,"thunderbolt"],[3,"air_slash"],[4,"static_cage"],[30,"arc_flash"],[35,"tempest_wrath"],[40,"thunder"],[45,"volt_surge"],[50,"hurricane"],[55,"plasma_strike"],[60,"ball_lightning"],[6,"charge_burst"],[42,"wing_attack"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:198, rarity:"uncommon",
    desc:"An electrified storm raptor that rides cyclones. Its wingspan crackles with constant discharge.",
    lore:"Vortexathos is a massive eagle-wind creature with a 4-metre wingspan. Its feathers are grey-white above and dark charcoal beneath, and electric-blue lines trace the leading edges of its wings. It circles high above storm systems and descends to strike prey with a diving electrical vortex that scours the ground." },

  46: { id:46, name:"Frostmere", emoji:"🦭", types:["Ice","Water"],
    base:{hp:90,atk:65,def:90,spa:109,spd:92,spe:59},
    learnset:[[1,"powder_snow"],[1,"water_gun"],[2,"ice_beam"],[3,"permafrost"],[4,"winter_shroud"],[33,"blizzard"],[38,"aqua_tail"],[42,"hoarfrost_bite"],[46,"icicle_crash"],[50,"hydro_pump"],[54,"glacial_tomb"],[58,"surf"],[5,"cryo_lance"],[43,"harden"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"An ancient ice behemoth that rests in glacial caves. Its breath can freeze the ocean surface.",
    lore:"Frostmere is a streamlined ice-seal 1.5 metres long with shimmering silver-white fur and eyes the colour of deep glacier melt. Patches of semi-transparent ice form naturally on its back and shoulders. It hunts in polar water channels, detecting prey through vibrations in the ice with specialised sensors in its snout." },

  161: { id:161, name:"Mistbane", emoji:"🦠", types:["Poison","Wind"],
    base:{hp:70,atk:75,def:54,spa:102,spd:80,spe:105},
    learnset:[[1,"poison_sting"],[1,"downdraft"],[2,"sludge_bomb"],[3,"air_slash"],[4,"mycelia_net"],[31,"toxic"],[36,"venoshock"],[40,"tempest_wrath"],[45,"corrosion_fang"],[50,"hurricane"],[55,"venom_lance"],[60,"sludge_wave"],[5,"miasma_cloud"],[43,"wing_attack"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:195, rarity:"uncommon",
    desc:"A miasmic wind wraith draped in toxic cloud. Its wingbeats scatter poisonous spores across entire valleys.",
    lore:"Mistbane is a formless poison-wind entity about 40 cm across that resembles a drifting cloud of dark olive-green haze. It has no fixed body outline, constantly shifting shape. It inhabits bogs and toxic marshland, blending with natural mist and slowly sapping the vitality of any creature breathing the air it occupies." },

  186: { id:186, name:"Airovast", emoji:"🕊️", types:["Normal","Wind"],
    base:{hp:88,atk:73,def:55,spa:83,spd:70,spe:111},
    learnset:[[1,"tackle"],[1,"downdraft"],[2,"quick_attack"],[3,"air_slash"],[4,"body_slam"],[29,"wing_attack"],[34,"wild_tumble"],[38,"momentum_rush"],[43,"hurricane"],[48,"battle_cry"],[53,"hyper_beam"],[58,"gale_cannon"],[5,"zephyr_dance"],[41,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:185, rarity:"uncommon",
    desc:"A free-spirited wind wanderer that soars over continents in a single day, carried effortlessly on warm thermals.",
    lore:"Airovast is a large albatross-like wind-normal bird with a 2.5-metre wingspan. Its plumage is pure white above and pale grey below. It can fly continuously for months without landing using dynamic soaring — extracting energy from the boundary between fast and slow wind layers near the ocean surface." },

  188: { id:188, name:"Plentorus", emoji:"🦔", types:["Normal"],
    base:{hp:105,atk:94,def:89,spa:60,spd:70,spe:62},
    learnset:[[1,"tackle"],[1,"growl"],[2,"headbutt"],[3,"body_slam"],[4,"harden"],[31,"swords_dance"],[35,"wild_tumble"],[39,"recover"],[43,"momentum_rush"],[48,"body_slam"],[53,"instinct_slash"],[58,"hyper_beam"],[5,"battle_cry"],[40,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:188, rarity:"uncommon",
    desc:"A round and robust Lumori of immense endurance. Unshakable and steadfast, it weathers any storm with quiet dignity.",
    lore:"Plentorus is a stocky hedgehog-like normal creature 40 cm long. Its broad rounded back is covered in dense pale-brown quills with cream tips. It forages constantly and builds elaborate winter larders by hiding food in dozens of separate caches. It never seems to remember all of them, inadvertently planting many seeds." },

  194: { id:194, name:"Lithomere", emoji:"🦀", types:["Rock","Water"],
    base:{hp:95,atk:100,def:115,spa:72,spd:85,spe:75},
    learnset:[[1,"scratch"],[1,"water_gun"],[2,"aqua_tail"],[3,"stalactite_drop"],[4,"harden"],[39,"rock_slide"],[43,"hydro_pump"],[47,"stone_edge"],[52,"tidal_crush"],[56,"crystal_lance"],[60,"sea_serpent_strike"],[64,"quarry_crush"],[5,"tidecaller"],[42,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:248, rarity:"rare",
    desc:"A colossal ancient shore titan. Its shell is older than recorded history, layered with oceanic minerals.",
    lore:"Lithomere is a crab-like rock-water creature 60 cm across with a shell of compressed coastal rock. It inhabits intertidal zones and wedges itself into rock crevices during low tide, sealing gaps with a secreted mineral cement. Its shell grows thicker with each passing year." },

  196: { id:196, name:"Frigolith", emoji:"💎", types:["Rock","Ice"],
    base:{hp:87,atk:77,def:127,spa:103,spd:108,spe:48},
    learnset:[[1,"powder_snow"],[1,"stalactite_drop"],[2,"ice_beam"],[3,"rock_slide"],[4,"harden"],[41,"blizzard"],[45,"stone_edge"],[49,"crystal_lance"],[53,"icicle_crash"],[57,"glacial_tomb"],[61,"quarry_crush"],[65,"cryo_lance"],[5,"permafrost"],[43,"harden"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:258, rarity:"rare",
    desc:"A titanic crystal colossus forged from eons of glacial pressure. Its body refracts light into blinding aurora beams.",
    lore:"Frigolith is a rock-ice creature 1 metre long resembling a boulder partially submerged in permafrost. Crystalline ice formations have grown through cracks in its rock body over centuries. In winter it becomes nearly invisible against frozen tundra. Warming weather causes it distress as its ice components begin to melt." },

  40: { id:40, name:"Marevanos", emoji:"🐋", types:["Water","Wind"],
    base:{hp:84,atk:87,def:80,spa:108,spd:90,spe:101},
    learnset:[[1,"surf"],[1,"downdraft"],[2,"aqua_tail"],[3,"air_slash"],[4,"tidecaller"],[43,"hydro_pump"],[47,"hurricane"],[51,"tidal_crush"],[55,"tempest_wrath"],[59,"sea_serpent_strike"],[63,"ocean_tempest"],[67,"whirlpool_dive"],[5,"deepwater_hymn"],[48,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A sovereign of sky and sea. It breaches into storm clouds and dives into ocean trenches with equal majesty.",
    lore:"Marevanos is a cetacean-like creature 6 metres long with a streamlined blue-grey body and vast translucent wing-fins that catch both wind and water. It breaches spectacularly, launching fully airborne and gliding long distances. Sailors consider spotting it a good-weather omen." },

  131: { id:131, name:"Necrothon", emoji:"🌑", types:["Dark","Grass"],
    base:{hp:94,atk:89,def:99,spa:104,spd:90,spe:74},
    learnset:[[1,"bite"],[1,"vine_whip"],[2,"dark_pulse"],[3,"seed_bomb"],[4,"eclipse_shroud"],[41,"shadow_ball"],[45,"petal_blitz"],[49,"night_slash"],[53,"verdant_surge"],[57,"abyssal_snare"],[61,"soul_rend"],[65,"dread_howl"],[5,"mycelia_net"],[46,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:262, rarity:"rare",
    desc:"An ancient funerary grove made manifest. Moonless nights draw out its full power; forests bow as it passes.",
    lore:"Necrothon is a massive dark-grass tree creature 3 metres tall with a twisted trunk-body of dead black wood and a crown of withered crimson leaves that never fall. It stands motionless for months at a time, then relocates at night. The forest it inhabits gradually darkens and other plants around it wither." },

  38: { id:38, name:"Titanariel", emoji:"🦑", types:["Water","Steel"],
    base:{hp:97,atk:92,def:137,spa:82,spd:108,spe:34},
    learnset:[[1,"scratch"],[1,"water_gun"],[2,"aqua_tail"],[3,"flash_cannon"],[4,"harden"],[45,"hydro_pump"],[49,"iron_tail"],[53,"tidal_crush"],[57,"magnetize"],[61,"sea_serpent_strike"],[65,"forge_strike"],[69,"anvil_drop"],[5,"tidecaller"],[50,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:275, rarity:"rare",
    desc:"A mythic armored leviathan said to have dragged whole ships to the ocean floor. Its shell is impenetrable.",
    lore:"Titanariel is a 7-metre armoured sea titan resembling a colossal nautilus with a steel-hard shell and tentacles reinforced with metallic plating. It propels itself by expelling high-pressure water jets. Ancient naval records describe it capsizing large ships by wrapping its tentacles around the hull." },

  // ===== 3RD STAGE EVOLUTIONS (IDs 178-212) =====

  // 178: Inferarch - Fire/Dragon (Embrix→Helioveth→Inferarch)
  12: { id:12, name:"Inferarch", emoji:"🔥", types:["Fire","Dragon"],
    base:{hp:84,atk:110,def:79,spa:119,spd:84,spe:74},
    learnset:[[1,"ember"],[1,"flamethrower"],[2,"dragon_breath"],[3,"heat_wave"],[4,"scorch_veil"],[38,"fire_blast"],[43,"dragon_claw"],[48,"solar_flare"],[52,"outrage"],[57,"inferno"],[62,"dragon_pulse"],[67,"char_dance"],[5,"embercloak"],[44,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:265, rarity:"rare",
    desc:"A sovereign of flame and ancient dragon lineage. Its wingbeats ignite the air itself into roaring curtains of fire.",
    lore:"Inferarch is an enormous draconic predator nearly 5 metres long. Its scales are layered like volcanic rock — deep black at the base transitioning to red along the edges, with a continuous inner glow visible through the gaps. It inhabits the deepest volcanic rifts, drawing sustenance directly from geothermal heat." },

  // 179: Pyroclasm - Fire/Rock (Taurcin→Molteroth→Pyroclasm)
  15: { id:15, name:"Pyroclasm", emoji:"🌋", types:["Fire","Rock"],
    base:{hp:102,atk:126,def:107,spa:86,spd:72,spe:57},
    learnset:[[1,"headbutt"],[1,"magma_surge"],[2,"flamethrower"],[3,"scorch_veil"],[4,"rock_slide"],[38,"heat_wave"],[42,"stone_edge"],[46,"fire_blast"],[50,"stalactite_drop"],[54,"inferno"],[58,"quarry_crush"],[62,"solar_flare"],[5,"embercloak"],[44,"ashfall"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"A living caldera given form. When it charges, the ground splits and magma fountains in its wake.",
    lore:"Pyroclasm is a jagged semi-humanoid rock creature 2.5 metres tall. Its body is a mass of dark basalt encrusted with glowing magma veins. When agitated it hurls chunks of its own burning body as projectiles. It forms in the wake of eruptions and is considered a manifestation of volcanic rage." },

  // 180: Helixareth - Fire/Dragon (Ignicula→Pyroveth→Helixareth)
  18: { id:18, name:"Helixareth", emoji:"🐉", types:["Fire","Dragon"],
    base:{hp:87,atk:111,def:72,spa:121,spd:82,spe:77},
    learnset:[[1,"ember"],[1,"flamethrower"],[2,"dragon_breath"],[3,"cinderwhirl"],[4,"scorch_veil"],[38,"dragon_claw"],[42,"heat_wave"],[46,"fire_blast"],[50,"dragon_pulse"],[54,"solar_flare"],[58,"outrage"],[62,"inferno"],[5,"embercloak"],[44,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"An ancient serpent of celestial fire that coils around mountaintops. Legends say its breath forged the first volcanoes.",
    lore:"Helixareth is a serpentine fire dragon 6 metres long that coils tightly around rocky spires to sleep. Its amber-and-black scales overlap like armour, and twin crests of blue-tipped flame crown its narrow skull. It breathes a spiralling helix of fire able to bore through solid stone." },

  // 181: Terravore - Fire/Ground (Magmaurin→Pyroterrath→Terravore)
  21: { id:21, name:"Terravore", emoji:"🦎", types:["Fire","Ground"],
    base:{hp:100,atk:134,def:89,spa:79,spd:74,spe:74},
    learnset:[[1,"flame_fang"],[1,"earthquake"],[2,"magma_surge"],[3,"scorched_earth"],[4,"scorch_veil"],[38,"flamethrower"],[42,"earth_power"],[46,"fire_blast"],[50,"ashfall"],[54,"inferno"],[58,"sand_geyser"],[62,"solar_flare"],[5,"embercloak"],[44,"blazing_rush"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:260, rarity:"rare",
    desc:"A predator born from the magma deep within the earth. It tunnels through bedrock and erupts beneath its prey.",
    lore:"Terravore is a hulking dinosaur-like creature 3 metres long with thick terracotta hide reinforced by fire-hardened dorsal plates. Its wide mouth can swallow boulders to digest the minerals within. It tunnels through volcanic earth, leaving perfectly circular bore-holes 1 metre in diameter." },

  // 182: Ignitheon - Fire/Psychic (Ignorin→Pyraxis→Ignitheon)
  24: { id:24, name:"Ignitheon", emoji:"🔮", types:["Fire","Psychic"],
    base:{hp:82,atk:77,def:77,spa:131,spd:97,spe:86},
    learnset:[[1,"flamethrower"],[1,"psychic_move"],[2,"scorch_veil"],[3,"psystrike"],[4,"heat_wave"],[38,"fire_blast"],[42,"calm_mind"],[46,"solar_flare"],[50,"thought_crush"],[54,"inferno"],[58,"mind_shatter"],[62,"neural_storm"],[5,"embercloak"],[44,"astral_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"An oracle of living flame. It reads the minds of its foes and burns their deepest fears into reality.",
    lore:"Ignitheon is a regal lion-like psychic-fire creature 2 metres long. Its mane is living fire that changes colour with its emotional state — gold when calm, white when enraged. Violet markings pulse along its flanks. It guards ancient flame temples and is said to judge challengers before allowing passage." },

  // 183: Tidalossus - Water/Rock (Coralix→Aquidon→Tidalossus)
  27: { id:27, name:"Tidalossus", emoji:"🦞", types:["Water","Rock"],
    base:{hp:92,atk:121,def:126,spa:67,spd:82,spe:62},
    learnset:[[1,"scratch"],[1,"surf"],[2,"tidecaller"],[3,"stalactite_drop"],[4,"rock_slide"],[38,"aqua_tail"],[42,"stone_edge"],[46,"tidal_crush"],[50,"crystal_lance"],[54,"hydro_pump"],[58,"quarry_crush"],[62,"sea_serpent_strike"],[5,"deepwater_hymn"],[44,"coral_barrage"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"A colossus of tide and stone that rules coastal shallows. Its claws can shear cliff faces clean through.",
    lore:"Tidalossus is a massive crustacean predator 4 metres across, with a dome-shaped granite-grey shell etched by centuries of wave erosion. Its six limbs end in serrated crushing claws. It prowls coastal shallows at night and generates a localised tidal surge by rapidly displacing water with its body." },

  // 184: Polarveth - Ice/Water (Cryonik→Boreon→Polarveth)
  44: { id:44, name:"Polarveth", emoji:"🧊", types:["Ice","Water"],
    base:{hp:97,atk:73,def:97,spa:122,spd:103,spe:58},
    learnset:[[1,"powder_snow"],[1,"surf"],[2,"ice_beam"],[3,"permafrost"],[4,"winter_shroud"],[38,"blizzard"],[42,"hoarfrost_bite"],[46,"icicle_crash"],[50,"hydro_pump"],[54,"glacial_tomb"],[58,"cryo_lance"],[62,"abyssal_jet"],[5,"tidecaller"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A titan of polar seas whose body is half glacier and half deep ocean. Its roar shatters icebergs for miles around.",
    lore:"Polarveth is a serpentine ice-water creature 3 metres long with translucent blue-white scales and broad front flippers. Its tail sweeps in wide arcs to break through thin ice sheets. It hunts beneath pack ice, surfacing through cracks to catch prey venturing near the frozen edge." },

  // 185: Nepturix - Water (Corelin→Neraxis→Nepturix)
  30: { id:30, name:"Nepturix", emoji:"🐟", types:["Water"],
    base:{hp:91,atk:82,def:77,spa:136,spd:107,spe:57},
    learnset:[[1,"water_gun"],[1,"surf"],[2,"bubble_beam"],[3,"tidecaller"],[4,"whirlpool_dive"],[38,"hydro_pump"],[42,"tidal_crush"],[46,"sea_serpent_strike"],[50,"coral_barrage"],[54,"abyssal_jet"],[58,"ocean_tempest"],[62,"dazzling_gleam"],[5,"deepwater_hymn"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"A leviathan of the reef that commands all ocean life with a single glance. Its scales scatter light like a shattered prism.",
    lore:"Nepturix is a silvery deep-sea fish about 60 cm long with enormous light-gathering eyes and a slender streamlined body. Bioluminescent dots line its lateral line. It descends to lightless ocean trenches during the day and ascends to shallower water at night to feed on schooling fish." },

  // 186: Noxarith - Water/Poison (Toxaquil→Noxaquith→Noxarith)
  33: { id:33, name:"Noxarith", emoji:"🪸", types:["Water","Poison"],
    base:{hp:92,atk:98,def:87,spa:127,spd:98,spe:48},
    learnset:[[1,"sludge_bomb"],[1,"surf"],[2,"tidecaller"],[3,"toxic"],[4,"corrosion_fang"],[38,"venom_lance"],[42,"sludge_wave"],[46,"hydro_pump"],[50,"acid_rain"],[54,"venoshock"],[58,"putrid_pulse"],[62,"stinger_volley"],[5,"deepwater_hymn"],[44,"miasma_cloud"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A dread titan of poisoned tides. Its very presence turns the sea around it a sickly green and chokes all nearby life.",
    lore:"Noxarith resembles a bright-red sea anemone 40 cm across, crowned with tentacles tipped in venomous barbs. It anchors to rocky outcroppings in poison-saturated waters and releases drifting stinging cells to stun plankton and small fish drawn by its vivid colouration." },

  // 187: Thalassira - Water/Fairy (Pearlith→Undirael→Thalassira)
  36: { id:36, name:"Thalassira", emoji:"🧜", types:["Water","Fairy"],
    base:{hp:91,atk:76,def:81,spa:139,spd:106,spe:57},
    learnset:[[1,"water_gun"],[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"tidecaller"],[4,"moonblast"],[38,"celestial_wave"],[42,"surf"],[46,"glitter_storm"],[50,"hydro_pump"],[54,"fae_requiem"],[58,"sea_serpent_strike"],[62,"moonveil"],[5,"deepwater_hymn"],[44,"sweet_kiss"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:275, rarity:"rare",
    desc:"The radiant sovereign of the world's oceans. Sailors who see it are said to be blessed with eternal safe passage.",
    lore:"Thalassira is a grand aquatic fairy-dragon 5 metres long, combining the sinuous body of a sea serpent with translucent fairy wings that function as fins. Its scales are iridescent ocean-blue and silver. It guards hidden underwater groves where rare magical plants grow undisturbed." },

  // 188: Mycovast - Grass/Poison (Sporix→Myceloth→Mycovast)
  65: { id:65, name:"Mycovast", emoji:"🍄", types:["Grass","Poison"],
    base:{hp:98,atk:109,def:103,spa:108,spd:88,spe:44},
    learnset:[[1,"energy_ball"],[1,"sludge_bomb"],[2,"spore_burst"],[3,"toxic"],[4,"sleep_powder"],[38,"petal_blitz"],[42,"venom_lance"],[46,"verdant_surge"],[50,"sludge_wave"],[54,"venoshock"],[58,"canopy_crash"],[62,"acid_rain"],[5,"mycelia_net"],[44,"corrosion_fang"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A fungal colossus whose spores drift on the wind for hundreds of miles, corrupting forests in days. It is the rot at the heart of every plagued wood.",
    lore:"Mycovast is a hulking fungal creature 2 metres tall with a thick, barrel-like body covered in overlapping shelf-fungus plates. Purple, green, and white tones mottle its surface. It generates a continuous cloud of toxic spores around itself and moves with surprising speed for its size when defending its spore territory." },

  // 189: Rootvorn - Grass/Ground (Viridix→Terravin→Rootvorn)
  68: { id:68, name:"Rootvorn", emoji:"🌳", types:["Grass","Ground"],
    base:{hp:98,atk:118,def:104,spa:93,spd:88,spe:49},
    learnset:[[1,"razor_leaf"],[1,"earthquake"],[2,"seed_bomb"],[3,"root_lance"],[4,"sleep_powder"],[38,"energy_ball"],[42,"earth_power"],[46,"petal_blitz"],[50,"verdant_surge"],[54,"sand_geyser"],[58,"canopy_crash"],[62,"scorched_earth"],[5,"spore_burst"],[44,"briar_lash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"An enormous ancient root-walker that reshapes the earth as it moves. Valleys and gullies form in its wake over centuries.",
    lore:"Rootvorn is a larger, more aggressive root elemental 4 metres tall. Its body is darker — deep brown and almost black — and its branch-arms end in jagged broken-wood points. It uproots itself and moves at night, replanting in new locations before dawn. It is believed to reorganise forests over decades." },

  // 190: Verdovast - Grass (Germix→Verdurus→Verdovast)
  71: { id:71, name:"Verdovast", emoji:"🐻", types:["Grass"],
    base:{hp:109,atk:123,def:88,spa:113,spd:88,spe:29},
    learnset:[[1,"tackle"],[1,"vine_whip"],[2,"energy_ball"],[3,"sleep_powder"],[4,"seed_bomb"],[38,"petal_blitz"],[42,"swords_dance"],[46,"canopy_crash"],[50,"verdant_surge"],[54,"body_slam"],[58,"briar_lash"],[62,"photon_leaf"],[5,"spore_burst"],[44,"root_lance"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A titanic forest guardian born of the oldest living wood. No axe or flame has ever felled it; those who try are swallowed by the undergrowth.",
    lore:"Verdovast is a massive grass bear 2.5 metres tall, its body now fully encrusted in thick bark-like plant growth and flowering vines. Trees and shrubs spontaneously germinate on its back over the years, so older individuals resemble walking small ecosystems. It rarely moves fast but is nearly impossible to injure through its dense living armour." },

  // 191: Morralyn - Grass/Dark (Sylvnox→Morraveth→Morralyn)
  80: { id:80, name:"Morralyn", emoji:"🌑", types:["Grass","Dark"],
    base:{hp:98,atk:122,def:97,spa:117,spd:87,spe:29},
    learnset:[[1,"razor_leaf"],[1,"night_slash"],[2,"energy_ball"],[3,"dark_pulse"],[4,"sleep_powder"],[38,"petal_blitz"],[42,"shadow_ball"],[46,"void_rend"],[50,"verdant_surge"],[54,"soul_rend"],[58,"canopy_crash"],[62,"eclipse_shroud"],[5,"spore_burst"],[44,"abyssal_snare"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A wraith of shadow and thorn that stalks moonless forests. The trees it passes through wither and grow dark, feeding it endlessly.",
    lore:"Morralyn is a large bear-wolf hybrid 1.5 metres at the shoulder, deeply dark green-black with dead plant material fused to its back forming a natural carapace. It emits a faint aura of decay that accelerates the decomposition of fallen material around it, enriching the soil as it passes." },

  // 192: Faevernal - Fairy/Grass (Floralin→Faelomis→Faevernal)
  74: { id:74, name:"Faevernal", emoji:"🌸", types:["Fairy","Grass"],
    base:{hp:93,atk:77,def:82,spa:137,spd:108,spe:53},
    learnset:[[1,"fairy_wind"],[1,"vine_whip"],[2,"dazzling_gleam"],[3,"moonblast"],[4,"sweet_kiss"],[38,"celestial_wave"],[42,"petal_blitz"],[46,"glitter_storm"],[50,"verdant_surge"],[54,"fae_requiem"],[58,"energy_ball"],[62,"moonveil"],[5,"stardust_veil"],[44,"sleep_powder"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A being of pure spring magic. Where it dances, flowers bloom overnight and the air fills with the scent of a thousand blossoms.",
    lore:"Faevernal is a regal fairy-grass entity 1.8 metres tall. It resembles a tall humanoid wreathed in cascading blossoms, with a crown of living golden flowers and flowing cape-wings made of enormous tropical petals. Ancient nature spirits are believed to incarnate within it during spring equinox festivals." },

  // 193: Junglevolt - Grass/Electric (Sylvolt→Arborvolt→Junglevolt)
  77: { id:77, name:"Thorncharge", emoji:"⚡", types:["Grass","Electric"],
    base:{hp:92,atk:98,def:82,spa:132,spd:98,spe:48},
    learnset:[[1,"razor_leaf"],[1,"thunderbolt"],[2,"energy_ball"],[3,"volt_surge"],[4,"sleep_powder"],[38,"thunder"],[42,"petal_blitz"],[46,"verdant_surge"],[50,"plasma_strike"],[54,"canopy_crash"],[58,"ion_cannon"],[62,"arc_flash"],[5,"spore_burst"],[44,"charge_burst"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"An ancient living battery tree that stores decades of lightning within its rings. Its roots conduct electricity through entire forests.",
    lore:"Thorncharge is a powerful quadruped 1.5 metres tall covered in dark green armoured hide reinforced by thorny ridges that channel and discharge stored electricity. Its mane is a crown of crackling thorns. It charges headlong into enemies, using its thorns to both impale and electrocute on contact." },

  // 194: Voltanox - Electric (Joltan→Galvanos→Voltanox)
  83: { id:83, name:"Voltanox", emoji:"⚡", types:["Electric"],
    base:{hp:81,atk:111,def:71,spa:115,spd:76,spe:96},
    learnset:[[1,"thunder_shock"],[1,"thunderbolt"],[2,"spark"],[3,"thunder_wave"],[4,"quick_attack"],[38,"thunder"],[42,"arc_flash"],[46,"plasma_strike"],[50,"volt_surge"],[54,"ion_cannon"],[58,"charge_burst"],[62,"voltaic_fang"],[5,"static_cage"],[44,"wild_charge"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:275, rarity:"rare",
    desc:"A creature of living electricity whose gallop shakes the heavens. Cities it runs through are briefly lit as bright as day.",
    lore:"Voltanox is a muscular bull-like electric creature 1.5 metres at the shoulder. Its dark charcoal hide is scored with bright yellow lightning-bolt markings on each flank. Two short thick horns act as capacitor tips, building and releasing enormous charges when it lowers its head to charge." },

  // 195: Zapoveth - Electric/Bug (Electrix→Voltharpe→Zapoveth)
  86: { id:86, name:"Zapoveth", emoji:"🦟", types:["Electric","Bug"],
    base:{hp:84,atk:89,def:69,spa:129,spd:84,spe:95},
    learnset:[[1,"thunder_shock"],[1,"bug_buzz"],[2,"thunderbolt"],[3,"x_scissor"],[4,"thunder_wave"],[38,"thunder"],[42,"volt_surge"],[46,"swarm_dive"],[50,"plasma_strike"],[54,"mandible_crush"],[58,"ion_cannon"],[62,"stinger_volley"],[5,"static_cage"],[44,"silk_bind"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A dragonfly of pure lightning. Its body discharges with every wingbeat; to be caught in its swarm is to stand in a thunderstorm.",
    lore:"Zapoveth is a dragonfly-like creature with a 40 cm wingspan. Its four wings are translucent gold and crackle with static charge. Its slender body is vivid yellow. It hunts in flight, hovering stationary before striking prey with a precisely targeted electrical discharge from its forward-pointing tail." },

  // 196: Surgolith - Electric/Water (Amperix→Volterel→Surgolith)
  89: { id:89, name:"Surgolith", emoji:"🐙", types:["Electric","Water"],
    base:{hp:93,atk:77,def:82,spa:137,spd:103,spe:58},
    learnset:[[1,"thunder_shock"],[1,"surf"],[2,"thunderbolt"],[3,"water_gun"],[4,"thunder_wave"],[38,"thunder"],[42,"hydro_pump"],[46,"voltaic_fang"],[50,"tidal_crush"],[54,"ion_cannon"],[58,"abyssal_jet"],[62,"overcharge"],[5,"static_cage"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A deep-sea colossus of crackling electricity. It powers itself by siphoning ocean currents and discharges columns of electrified water at will.",
    lore:"Surgolith is a large electric octopus 1.5 metres across with eight arms that each carry independently charged electric organs. Its skin cycles through dim bioluminescent yellow patterns. It perches on deep-sea volcanic thermal vents and uses the electric differential to power its movements without needing to hunt." },

  // 197: Petrovast - Electric/Rock (Voltrix→Petravolt→Petrovast)
  94: { id:94, name:"Petrovast", emoji:"⛰️", types:["Electric","Rock"],
    base:{hp:98,atk:117,def:112,spa:82,spd:73,spe:68},
    learnset:[[1,"rock_slide"],[1,"thunderbolt"],[2,"spark"],[3,"stone_edge"],[4,"thunder_wave"],[38,"thunder"],[42,"earthquake"],[46,"volt_surge"],[50,"crystal_lance"],[54,"stalactite_drop"],[58,"ion_cannon"],[62,"quarry_crush"],[5,"static_cage"],[44,"temper_edge"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A mountain that walks, crackling with perpetual storm energy. Lightning cascades across its stony hide at all times.",
    lore:"Petrovast is a massive rock-electric titan 2 metres at the shoulder shaped like a rhinoceros-rhinoceros hybrid. Its entire body is encased in thick basalt-coloured plates between which vivid electrical arcs constantly discharge. Its charge builds up from ground contact, and it is almost impossible to move once stationary." },

  // 198: Tectonvast - Ground/Rock (Terrakin→Seismith→Tectonvast)
  97: { id:97, name:"Tectonvast", emoji:"🦏", types:["Ground","Rock"],
    base:{hp:111,atk:136,def:116,spa:57,spd:73,spe:57},
    learnset:[[1,"earthquake"],[1,"rock_slide"],[2,"headbutt"],[3,"earth_power"],[4,"stone_edge"],[38,"stalactite_drop"],[42,"crystal_lance"],[46,"sand_geyser"],[50,"quarry_crush"],[54,"scorched_earth"],[58,"fissure_slam"],[62,"body_slam"],[5,"clay_armor"],[44,"temper_edge"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"A living tectonic plate. Every step it takes registers as a minor earthquake. Civilizations have risen and fallen on the choices of where it walks.",
    lore:"Tectonvast is a massive rhinoceros-like ground-rock creature 2 metres at the shoulder. Its armoured hide is grey-brown with deep cracked furrows. Its horn is a solid column of compressed stone 40 cm long. Seismic activity follows it wherever it goes, and geologists track its movements to predict tremors." },

  // 199: Geovenomvast - Ground/Poison (Aridix→Geovenoth→Geovenomvast)
  100: { id:100, name:"Venomvast", emoji:"🦂", types:["Ground","Poison"],
    base:{hp:89,atk:119,def:89,spa:105,spd:99,spe:49},
    learnset:[[1,"poison_sting"],[1,"earthquake"],[2,"venom_lance"],[3,"earth_power"],[4,"toxic"],[38,"sludge_wave"],[42,"miasma_cloud"],[46,"scorched_earth"],[50,"acid_rain"],[54,"sand_geyser"],[58,"stinger_volley"],[62,"toxic_surge"],[5,"clay_armor"],[44,"corrosion_fang"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A scorpion tyrant of the poisoned badlands. Its stinger contains enough venom to wilt an entire forest, and its tail leaves craters in the earth.",
    lore:"Venomvast is a colossal scorpion nearly 2 metres long with an enormous broad carapace of dark purple-black chitin. Its eight legs move with disturbing silence. The stinger at the end of its tail stores enough venom to incapacitate a creature ten times its size. It is rarely seen during daylight hours." },

  // 200: Geovast - Ground/Water (Limoux→Geoloth→Geovast)
  103: { id:103, name:"Crustvast", emoji:"🐊", types:["Ground","Water"],
    base:{hp:109,atk:118,def:98,spa:103,spd:83,spe:39},
    learnset:[[1,"earthquake"],[1,"surf"],[2,"earth_power"],[3,"tidal_crush"],[4,"mud_shot"],[38,"hydro_pump"],[42,"sand_geyser"],[46,"aqua_tail"],[50,"scorched_earth"],[54,"sea_serpent_strike"],[58,"boulder_roll"],[62,"abyssal_jet"],[5,"clay_armor"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:260, rarity:"rare",
    desc:"A delta titan that merges the force of river and rock. River mouths form around it; whole new coastlines appear where it settles.",
    lore:"Crustvast is a massive freshwater crocodilian 3.5 metres long with a hide so heavily armoured by calcified mineral deposits that it resembles stone more than skin. Its jaw pressure is sufficient to crush boulders. It blocks rivers, and smaller creatures shelter in the calm water behind its stationary bulk." },

  // 201: Aeolarch - Wind/Electric (Zephyrkin→Aeolomane→Aeolarch)
  110: { id:110, name:"Aeolarch", emoji:"🦁", types:["Wind","Electric"],
    base:{hp:93,atk:122,def:73,spa:88,spd:87,spe:87},
    learnset:[[1,"gust"],[1,"thunderbolt"],[2,"air_slash"],[3,"zephyr_dance"],[4,"arc_flash"],[38,"hurricane"],[42,"thunder"],[46,"gale_cannon"],[50,"plasma_strike"],[54,"volt_surge"],[58,"tempest_wrath"],[62,"ion_cannon"],[5,"vortex_trap"],[44,"squall_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A storm sovereign whose mane is a permanent tempest. When it roars, thunder rolls across the land for days.",
    lore:"Aeolarch is a massive wind lion 1.8 metres at the shoulder with a broad chest, white fur shading to storm-grey at the extremities, and a mane that crackles and sparks continuously. It commands local weather patterns and is regarded as a living storm-anchor by coastal communities." },

  // 202: Cyclavorn - Wind (Aeolin→Cyclavel→Cyclavorn)
  113: { id:113, name:"Cyclavorn", emoji:"🦅", types:["Wind"],
    base:{hp:89,atk:114,def:74,spa:110,spd:79,spe:84},
    learnset:[[1,"gust"],[1,"wing_attack"],[2,"air_slash"],[3,"jetstream"],[4,"mistveil"],[38,"hurricane"],[42,"skyfall"],[46,"squall_slash"],[50,"thermal_dive"],[54,"gale_cannon"],[58,"tempest_wrath"],[62,"downdraft"],[5,"zephyr_dance"],[44,"vortex_trap"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A hurricane made flesh. It circles the highest peaks and its passage creates new storm systems that endure for years.",
    lore:"Cyclavorn is a massive condor-like bird with a 3.5-metre wingspan. Its plumage is deep charcoal grey with white under-wing patches visible only in flight. It circles at tremendous altitude for weeks without landing, descending only to feed. Its wingbeats can be felt as pressure waves on the ground below." },

  // 203: Frigidvorn - Ice (Cryokin→Boreovast→Frigidvorn)
  49: { id:49, name:"Frigidvorn", emoji:"🐺", types:["Ice"],
    base:{hp:97,atk:108,def:77,spa:103,spd:92,spe:73},
    learnset:[[1,"powder_snow"],[1,"ice_beam"],[2,"icicle_crash"],[3,"blizzard"],[4,"permafrost"],[38,"hoarfrost_bite"],[42,"cryo_lance"],[46,"glacial_tomb"],[50,"avalanche_drive"],[54,"winter_shroud"],[58,"body_slam"],[62,"quick_attack"],[5,"frostfire_veil"],[44,"instinct_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A wolf of absolute zero whose howl flash-freezes the air for miles. Entire mountain valleys have become permanent glacier fields where it hunts.",
    lore:"Frigidvorn is a solitary bear-like ice creature 2 metres tall, covered in thick grey-white fur matted with ice crystals. Its breath freezes solid on contact with open air, producing a permanent mist cloud around its face. It excavates dens deep in glacier ice and hibernates for years between active periods." },

  // 204: Glaciovast - Ice/Normal (Nivelin→Glacivern→Glaciovast)
  52: { id:52, name:"Permavast", emoji:"🐻‍❄️", types:["Ice","Normal"],
    base:{hp:109,atk:88,def:118,spa:113,spd:103,spe:19},
    learnset:[[1,"powder_snow"],[1,"body_slam"],[2,"ice_beam"],[3,"harden"],[4,"blizzard"],[38,"headbutt"],[42,"hoarfrost_bite"],[46,"icicle_crash"],[50,"glacial_tomb"],[54,"recover"],[58,"cryo_lance"],[62,"hyper_beam"],[5,"winter_shroud"],[44,"vital_pulse"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:260, rarity:"rare",
    desc:"An immovable glacier bear of legendary endurance. It has slept for centuries at a time; when it wakes, the ice age returns.",
    lore:"Permavast is a large bear-like creature 2 metres tall covered in dense white fur streaked with grey. Its exposed skin and nose are pale blue-grey. Thick slabs of ancient glacier ice have fused to its shoulders and haunches over many years. It does not hibernate but instead roams frozen tundra year-round, barely affected by the cold." },

  // 205: Noctovast - Dark (Umbrakin→Noctivast→Noctovast)
  120: { id:120, name:"Noctovast", emoji:"🐕", types:["Dark"],
    base:{hp:98,atk:117,def:77,spa:108,spd:87,spe:63},
    learnset:[[1,"bite"],[1,"crunch"],[2,"night_slash"],[3,"dark_pulse"],[4,"eclipse_shroud"],[38,"shadow_ball"],[42,"void_rend"],[46,"soul_rend"],[50,"abyssal_snare"],[54,"dread_howl"],[58,"body_slam"],[62,"quick_attack"],[5,"shadowstep"],[44,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A hound of the perpetual midnight. Darkness pools around it wherever it goes; even torch-flames gutter and die in its presence.",
    lore:"Noctovast is a massive black-furred predator 1.4 metres at the shoulder resembling a great dane mixed with a wolf. Its form is surrounded by a subtle shadow-haze. It hunts large prey by pursuing it into darkness where it has absolute advantage, wearing it down over long relentless chases." },

  // 206: Phantomvast - Dark/Poison (Nocturil→Phantorvex→Phantomvast)
  125: { id:125, name:"Phantomvast", emoji:"🦎", types:["Dark","Poison"],
    base:{hp:92,atk:121,def:87,spa:111,spd:86,spe:53},
    learnset:[[1,"bite"],[1,"venom_lance"],[2,"dark_pulse"],[3,"sludge_wave"],[4,"eclipse_shroud"],[38,"void_rend"],[42,"acid_rain"],[46,"shadow_ball"],[50,"soul_rend"],[54,"toxic_surge"],[58,"corrosion_fang"],[62,"dread_howl"],[5,"shadowstep"],[44,"abyssal_snare"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"A venom phantom of ancient ruin sites. It haunts deep in shadow, and those bitten by it suffer visions of oblivion they never escape.",
    lore:"Phantomvast is a titanic dark-poison serpent 4 metres long with body width enough to encircle a large tree. Its scales are near-black with faint violet banding. It constricts prey before envenomating, and the venom it produces is so potent that researchers use it in diluted form as an anaesthetic." },

  // 207: Lumiarch - Fairy (Lumkin→Aetherael→Lumiarch)
  139: { id:139, name:"Lumiarch", emoji:"🌟", types:["Fairy"],
    base:{hp:97,atk:86,def:86,spa:131,spd:107,spe:43},
    learnset:[[1,"fairy_wind"],[1,"dazzling_gleam"],[2,"moonblast"],[3,"sweet_kiss"],[4,"stardust_veil"],[38,"celestial_wave"],[42,"glitter_storm"],[46,"fae_requiem"],[50,"moonveil"],[54,"recover"],[58,"wish_spark"],[62,"hyper_beam"],[5,"charm_bloom"],[44,"vital_pulse"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"The sovereign of fairy light. Its radiance can banish every shadow from a city; dark spirits flee the land at its mere approach.",
    lore:"Lumiarch is a majestic fairy hound 1.1 metres at the shoulder with brilliant white fur and a mane of living light that shifts through all warm colours slowly. Violet eyes glow like lanterns. Ancient lore records it appearing at the site of major conflicts and bringing sudden, unexplained peace between combatants." },

  // 208: Celestarch - Fairy/Psychic (Dawnirel→Lunarael→Celestarch)
  144: { id:144, name:"Celestarch", emoji:"🌙", types:["Fairy","Psychic"],
    base:{hp:95,atk:75,def:91,spa:147,spd:114,spe:28},
    learnset:[[1,"dazzling_gleam"],[1,"psychic_move"],[2,"moonblast"],[3,"calm_mind"],[4,"stardust_veil"],[38,"celestial_wave"],[42,"psystrike"],[46,"fae_requiem"],[50,"thought_crush"],[54,"glitter_storm"],[58,"mind_shatter"],[62,"prism_ward"],[5,"sweet_kiss"],[44,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:280, rarity:"rare",
    desc:"A celestial archon said to be the personification of the moon's light and the night sky's oldest thoughts. Stars bow when it rises.",
    lore:"Celestarch is a grand psychic-fairy celestial creature 1.5 metres across resembling a many-pointed star. Its body is brilliant gold-white and its aura shifts through deep purple and starlight silver. It appears only during celestial events — eclipses, conjunctions, meteor showers — and is regarded as a divine herald." },

  // 209: Adamovast - Steel (Ferrokin→Adamavast→Adamovast)
  149: { id:149, name:"Adamovast", emoji:"🐩", types:["Steel"],
    base:{hp:101,atk:130,def:134,spa:71,spd:91,spe:23},
    learnset:[[1,"metal_claw"],[1,"flash_cannon"],[2,"iron_tail"],[3,"magnetize"],[4,"forge_strike"],[38,"anvil_drop"],[42,"iron_press"],[46,"slag_shield"],[50,"temper_edge"],[54,"steel_wing"],[58,"body_slam"],[62,"hyper_beam"],[5,"ironskin"],[44,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:275, rarity:"rare",
    desc:"A steel titan of absolute indomitability. Every surface of its body is a different legendary alloy; no recorded force has ever cracked its hide.",
    lore:"Adamovast is a massive steel entity 2 metres tall shaped like a heavy suit of full plate armour that moves of its own accord. Its surface is deep charcoal-grey adamantine. No creature has ever found a way to scratch its surface with any natural weapon. It considers itself a guardian of civilisation itself." },

  // 210: Ferrovast - Steel/Dark (Aeronyx→Ferrovex→Ferrovast)
  136: { id:136, name:"Ferrovast", emoji:"🦇", types:["Steel","Dark"],
    base:{hp:93,atk:127,def:112,spa:73,spd:87,spe:58},
    learnset:[[1,"metal_claw"],[1,"dark_pulse"],[2,"flash_cannon"],[3,"crunch"],[4,"magnetize"],[38,"forge_strike"],[42,"void_rend"],[46,"iron_tail"],[50,"shadow_ball"],[54,"anvil_drop"],[58,"night_slash"],[62,"soul_rend"],[5,"ironskin"],[44,"eclipse_shroud"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A wraith of living iron that hunts in total darkness. Its metallic screech can shatter stone and its wings cut like blades.",
    lore:"Ferrovast is a massive dark-steel bat with a 2.5-metre wingspan. Its body is entirely covered in overlapping dark steel plates that protect it like armour. In flight it produces a distinctive metallic drone audible from 500 metres. It nests inside abandoned industrial structures and hollowed-out ore deposits." },

  // 211: Acidovast - Poison/Ground (Acidelix→Toxoloth→Acidovast)
  159: { id:159, name:"Acidovast", emoji:"🐸", types:["Poison","Ground"],
    base:{hp:111,atk:86,def:102,spa:136,spd:96,spe:19},
    learnset:[[1,"toxic"],[1,"earthquake"],[2,"sludge_wave"],[3,"earth_power"],[4,"toxic_surge"],[38,"acid_rain"],[42,"venom_lance"],[46,"sand_geyser"],[50,"sludge_bomb"],[54,"venoshock"],[58,"scorched_earth"],[62,"putrid_pulse"],[5,"miasma_cloud"],[44,"corrosion_fang"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"A colossal acid behemoth that dissolves the ground wherever it treads. Entire cave systems have been created by its acidic ooze eating through the earth.",
    lore:"Acidovast is a massive ground-poison creature 2 metres tall resembling a toad made of compressed toxic earth. Its skin constantly weeps acidic liquid. The ground around it is perpetually discoloured. It is one of the few creatures that can neutralise other poisons by contact, making it paradoxically useful as an antidote source." },

  // 212: Behemovast - Normal (Rotunden→Glutoros→Behemovast)
  184: { id:184, name:"Behemovast", emoji:"🐻", types:["Normal"],
    base:{hp:140,atk:116,def:97,spa:77,spd:77,spe:43},
    learnset:[[1,"headbutt"],[1,"body_slam"],[2,"battle_cry"],[3,"swords_dance"],[4,"recover"],[38,"hyper_beam"],[42,"wild_tumble"],[46,"momentum_rush"],[50,"vital_pulse"],[54,"instinct_slash"],[58,"harden"],[62,"tackle"],[5,"focus_roar"],[44,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"The greatest bear that has ever walked Lumoria. When it stands fully upright, it blots out the sun. Its roar has been mistaken for natural disasters.",
    lore:"Behemovast is a titanic normal-type creature 3 metres at the shoulder, resembling an enormous bear with a solid barrel-shaped torso and legs like columns. Its thick brown-grey fur is matted and tough. It is the heaviest non-legendary Lumori known and leaves impressions in solid rock where it steps." },

  // =====================================================================
  // NG+-EXCLUSIVE LUMORI (IDs 322–421) — appear only in New Game+ runs
  // =====================================================================

  // ---- Tier 1a: Mid-game NG+ (badges 8–11 areas) BST ~490–540 ----
  322: { id:322, name:"Venomwraith", emoji:"☠️", types:["Poison","Ghost"],
    base:{hp:60,atk:65,def:54,spa:81,spd:69,spe:71}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"poison_sting"],[10,"shadow_ball"],[20,"sludge_bomb"],[30,"miasma_cloud"],[40,"void_rend"],[50,"sludge_wave"],[60,"toxic_surge"],[5,"toxic"],[45,"venom_lance"]],
    catchRate:30, expYield:255, rarity:"rare",
    desc:"A wraith of pure venom that haunts poison-soaked ruins. Its touch corrupts everything.",
    lore:"Venomwraith is a spectral poison-type 1.5 metres tall with a translucent body that glows sickly green. Corrosive vapour constantly seeps from its form." },

  323: { id:323, name:"Toxicore", emoji:"🧪", types:["Poison","Fire"],
    base:{hp:63,atk:73,def:58,spa:84,spd:62,spe:60}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[8,"poison_sting"],[18,"flamethrower"],[28,"sludge_bomb"],[38,"heat_wave"],[48,"acid_rain"],[58,"inferno"],[5,"toxic"],[42,"venom_lance"]],
    catchRate:28, expYield:260, rarity:"rare",
    desc:"An alchemical horror born in Miasma City's toxic reactors. Its core burns with caustic plasma.",
    lore:"Toxicore is a compact fire-poison creature 1.2 metres tall resembling a living flask of boiling acid. Its core chamber glows a violent orange-green." },

  324: { id:324, name:"Chittering", emoji:"🦗", types:["Bug","Dark"],
    base:{hp:54,atk:84,def:62,spa:58,spd:65,spe:77}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"bug_bite"],[12,"shadowstep"],[22,"bug_buzz"],[32,"umbral_claw"],[42,"phantom_claw"],[52,"shadow_ball"],[62,"bug_buzz"],[5,"shadow_sneak"],[38,"void_rend"]],
    catchRate:25, expYield:248, rarity:"rare",
    desc:"A razor-limbed predator insect that hunts in absolute darkness. It clicks its mandibles as it circles prey.",
    lore:"Chittering is a sleek dark-coloured insect 1.3 metres long with six blade-like limbs and multi-faceted crimson eyes that see perfectly in darkness." },

  325: { id:325, name:"Dunespike", emoji:"🏜️", types:["Ground","Poison"],
    base:{hp:70,atk:81,def:69,spa:56,spd:61,spe:68}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"earth_power"],[10,"poison_sting"],[22,"terra_spike"],[32,"sludge_bomb"],[42,"fissure_slam"],[52,"acid_rain"],[62,"earth_power"],[5,"toxic"],[35,"venom_lance"]],
    catchRate:28, expYield:252, rarity:"rare",
    desc:"A burrowing predator that injects venom through bone spikes as it erupts from the sand.",
    lore:"Dunespike is a powerful ground-poison creature 1.6 metres long resembling an armoured mole-rat with elongated venom spines along its spine and snout." },

  326: { id:326, name:"Silthorn", emoji:"🌿", types:["Grass","Poison"],
    base:{hp:66,atk:69,def:72,spa:77,spd:69,spe:52}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"vine_whip"],[12,"poison_sting"],[22,"energy_ball"],[32,"sludge_bomb"],[42,"root_lance"],[52,"verdant_surge"],[62,"acid_rain"],[5,"toxic"],[38,"sleep_powder"]],
    catchRate:30, expYield:250, rarity:"rare",
    desc:"A carnivorous marsh plant that lures prey with sweet-smelling nectar before paralysing them with venom.",
    lore:"Silthorn is a large ambulatory plant 1.8 metres tall with glossy dark-green leaves edged with translucent purple poison sacs. Its roots move like fingers." },

  327: { id:327, name:"Quarrex", emoji:"⛏️", types:["Rock","Ground"],
    base:{hp:77,atk:93,def:89,spa:48,spd:61,spe:52}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"rock_throw"],[10,"earth_power"],[20,"rock_slide"],[30,"terra_spike"],[40,"fissure_slam"],[50,"fossil_rush"],[60,"rock_slide"],[5,"harden"],[35,"iron_tail"]],
    catchRate:25, expYield:258, rarity:"rare",
    desc:"A titan of compressed stone forged in Terravault's deepest mines. Its fists leave craters.",
    lore:"Quarrex is a massive rock-ground creature 2.2 metres tall composed of interlocked slabs of granite and iron ore. Miners initially mistook ancient specimens for geological formations." },

  328: { id:328, name:"Smogveil", emoji:"🌫️", types:["Poison","Wind"],
    base:{hp:58,atk:60,def:52,spa:83,spd:71,spe:76}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"gust"],[10,"miasma_cloud"],[20,"air_slash"],[30,"sludge_bomb"],[40,"sludge_wave"],[50,"acid_rain"],[60,"tailwind_strike"],[5,"toxic"],[38,"neural_storm"]],
    catchRate:27, expYield:253, rarity:"rare",
    desc:"A drifting toxic cloud given form. Entire towns have been evacuated when a Smogveil settled overhead.",
    lore:"Smogveil is an amorphous poison-wind creature 3 metres across that resembles a dense yellow-green storm cloud. It has no fixed shape but two amber luminescent eye-spots drift within it." },

  329: { id:329, name:"Skullmite", emoji:"💀", types:["Bug","Rock"],
    base:{hp:65,atk:81,def:84,spa:52,spd:65,spe:73}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"bug_bite"],[10,"rock_throw"],[20,"metal_claw"],[30,"rock_slide"],[40,"fossil_rush"],[50,"bug_buzz"],[60,"iron_tail"],[5,"harden"],[38,"venom_drool"]],
    catchRate:26, expYield:256, rarity:"rare",
    desc:"An armoured beetle with a fossilised shell harder than most metals. Ancient specimens are sold as armour.",
    lore:"Skullmite is a beetle-like rock-bug creature 1.1 metres long with a helmet-shaped carapace of fossilised mineral. Its mandibles can crack geodes." },

  330: { id:330, name:"Blistermaw", emoji:"🐊", types:["Water","Poison"],
    base:{hp:71,atk:80,def:66,spa:77,spd:69,spe:57}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"water_gun"],[10,"poison_sting"],[20,"tidal_crush"],[30,"sludge_bomb"],[40,"hydro_pump"],[50,"sludge_wave"],[60,"sea_serpent_strike"],[5,"toxic"],[38,"venom_lance"]],
    catchRate:28, expYield:258, rarity:"rare",
    desc:"A swamp crocodilian with acid-laced saliva. Prey dissolves within minutes of a bite.",
    lore:"Blistermaw is a water-poison reptile 2.8 metres long resembling a heavily built crocodile with blistered, acid-weeping skin and rows of hollow venom-conducting teeth." },

  331: { id:331, name:"Thornmoth", emoji:"🦋", types:["Bug","Grass"],
    base:{hp:55,atk:63,def:58,spa:78,spd:68,spe:78}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"gust"],[8,"vine_whip"],[18,"bug_bite"],[28,"razor_leaf"],[38,"bug_buzz"],[48,"canopy_crash"],[58,"verdant_surge"],[5,"sleep_powder"],[35,"spore_burst"]],
    catchRate:28, expYield:248, rarity:"rare",
    desc:"A giant moth covered in razor-edged leaf-scales. Its wing-beats strip bark from trees.",
    lore:"Thornmoth is a large bug-grass creature with a 2-metre wingspan. Its wings resemble overlapping serrated leaves in deep emerald and brown patterns." },

  // ---- Tier 1b: Mid-game NG+ (badges 8–11) Steel/Ice/Electric BST ~510–550 ----
  332: { id:332, name:"Glacicore", emoji:"🧊", types:["Ice","Steel"],
    base:{hp:68,atk:83,def:96,spa:75,spd:81,spe:57}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ice_punch"],[10,"metal_claw"],[20,"ice_beam"],[30,"iron_tail"],[40,"cryo_lance"],[50,"flash_cannon"],[60,"blizzard"],[5,"harden"],[38,"winter_shroud"]],
    catchRate:25, expYield:262, rarity:"rare",
    desc:"A golem wrapped in self-generated permafrost. Its steel core never melts, no matter the heat.",
    lore:"Glacicore is an ice-steel creature 1.8 metres tall resembling a humanoid armour suit formed from interlocking plates of iron and glacial ice." },

  333: { id:333, name:"Voltfang", emoji:"🐺", types:["Electric","Dark"],
    base:{hp:66,atk:91,def:61,spa:78,spd:67,spe:92}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"thunder_shock"],[10,"shadowstep"],[20,"thunderbolt"],[30,"void_rend"],[40,"thunder"],[50,"phantom_claw"],[60,"volt_surge"],[5,"thunder_wave"],[38,"shadow_ball"]],
    catchRate:26, expYield:258, rarity:"rare",
    desc:"A storm wolf that channels voltage through its dark fur. Its howl triggers localised lightning strikes.",
    lore:"Voltfang is an electric-dark wolf 1.4 metres at the shoulder with jet-black fur shot through with crackling yellow lightning. Its eyes glow violet." },

  334: { id:334, name:"Ferrocrush", emoji:"⚙️", types:["Steel","Ground"],
    base:{hp:83,atk:104,def:100,spa:52,spd:70,spe:61}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"metal_claw"],[10,"earth_power"],[20,"iron_tail"],[30,"fissure_slam"],[40,"flash_cannon"],[50,"terra_spike"],[60,"fossil_rush"],[5,"harden"],[38,"alloy_edge"]],
    catchRate:22, expYield:268, rarity:"rare",
    desc:"A mechanical behemoth forged in Ironforge's deepest furnaces. It was never meant to leave.",
    lore:"Ferrocrush is a 2.5-metre steel-ground golem with a body of smelted iron and a core of compressed ore. Its joints run at thousands of atmospheres of pressure." },

  335: { id:335, name:"Frostprowl", emoji:"🐆", types:["Ice","Wind"],
    base:{hp:63,atk:86,def:59,spa:74,spd:67,spe:106}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"powder_snow"],[8,"gust"],[18,"air_slash"],[28,"ice_beam"],[38,"cryo_lance"],[48,"blizzard"],[58,"tailwind_strike"],[5,"winter_shroud"],[38,"zephyr_dance"]],
    catchRate:27, expYield:255, rarity:"rare",
    desc:"A predator born in arctic storm-fronts. It rides its own blizzard to close in on prey invisibly.",
    lore:"Frostprowl is an ice-wind feline 1.5 metres long with pale blue-white fur and translucent crystalline whiskers. It can achieve speeds of 120 km/h in an open blizzard." },

  336: { id:336, name:"Coilstrike", emoji:"🐍", types:["Electric","Poison"],
    base:{hp:61,atk:74,def:63,spa:94,spd:76,spe:87}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"thunder_shock"],[10,"poison_sting"],[20,"thunderbolt"],[30,"sludge_bomb"],[40,"thunder"],[50,"acid_rain"],[60,"volt_surge"],[5,"thunder_wave"],[38,"toxic_surge"]],
    catchRate:28, expYield:252, rarity:"rare",
    desc:"A serpent that generates electricity through its venom glands. A single bite delivers both poison and paralysis.",
    lore:"Coilstrike is a sleek electric-poison snake 2.5 metres long with alternating bands of bright yellow and dark purple scales. Electrical discharge is visible along its spine." },

  337: { id:337, name:"Ashgolem", emoji:"🔥", types:["Fire","Rock"],
    base:{hp:87,atk:97,def:91,spa:77,spd:68,spe:50}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[10,"rock_throw"],[20,"flamethrower"],[30,"rock_slide"],[40,"heat_wave"],[50,"fossil_rush"],[60,"fire_blast"],[5,"harden"],[40,"magma_surge"]],
    catchRate:24, expYield:265, rarity:"rare",
    desc:"A creature born from a volcanic eruption, its body is a walking magma chamber encased in basalt.",
    lore:"Ashgolem is a fire-rock creature 2 metres tall with a body of cooling basalt cracked to reveal glowing magma beneath. Ash and cinders constantly drift from its surface." },

  338: { id:338, name:"Rimeclaw", emoji:"🦅", types:["Ice","Flying"],
    base:{hp:64,atk:88,def:61,spa:76,spd:69,spe:97}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"powder_snow"],[8,"gust"],[18,"ice_punch"],[28,"air_slash"],[38,"cryo_lance"],[48,"blizzard"],[58,"tailwind_strike"],[5,"zephyr_dance"],[35,"ice_beam"]],
    catchRate:25, expYield:258, rarity:"rare",
    desc:"A hawk that nests on storm-capped peaks. Its talons are perpetually coated in razor-sharp ice.",
    lore:"Rimeclaw is an ice-flying raptor with a 2.4-metre wingspan and talons of permanent glacial ice that never melt. Its primary feathers cut like edged weapons." },

  339: { id:339, name:"Voltbeetle", emoji:"⚡", types:["Bug","Electric"],
    base:{hp:66,atk:81,def:86,spa:75,spd:72,spe:80}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"bug_bite"],[10,"thunder_shock"],[20,"metal_claw"],[30,"thunderbolt"],[40,"bug_buzz"],[50,"volt_surge"],[60,"thunder"],[5,"harden"],[38,"alloy_edge"]],
    catchRate:26, expYield:257, rarity:"rare",
    desc:"A beetle that accumulates static charge on its elytra. Touching its wing-covers triggers a full discharge.",
    lore:"Voltbeetle is a squat beetle 0.9 metres long with highly polished elytra that generate static electricity from air resistance alone. A constant low hum surrounds it." },

  340: { id:340, name:"Cryoshard", emoji:"💎", types:["Ice","Psychic"],
    base:{hp:63,atk:68,def:72,spa:102,spd:89,spe:66}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"powder_snow"],[10,"psychic_move"],[20,"ice_beam"],[30,"psystrike"],[40,"cryo_lance"],[50,"mind_shatter"],[60,"blizzard"],[5,"winter_shroud"],[38,"prism_ward"]],
    catchRate:24, expYield:262, rarity:"rare",
    desc:"A sentient crystal of psychically-active ice. Its facets reflect possible futures.",
    lore:"Cryoshard is a floating ice-psychic crystal 1 metre across with an irregular faceted form that constantly shifts. Each face reflects a different perceived future of whoever looks into it." },

  341: { id:341, name:"Mirestone", emoji:"🪨", types:["Rock","Psychic"],
    base:{hp:72,atk:70,def:93,spa:89,spd:83,spe:53}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"rock_throw"],[10,"psychic_move"],[20,"rock_slide"],[30,"psystrike"],[40,"fossil_rush"],[50,"mind_shatter"],[60,"neural_storm"],[5,"prism_ward"],[38,"harden"]],
    catchRate:24, expYield:263, rarity:"rare",
    desc:"A monolith of psychically-resonant stone found at ancient ley line intersections.",
    lore:"Mirestone is a floating rock-psychic entity resembling a worn monolith 1.5 metres tall. Ancient carvings on its surface glow when it uses psychic powers." },

  // ---- Tier 2: Late-game NG+ (badges 12–16 areas) BST ~545–590 ----
  342: { id:342, name:"Wraithking", emoji:"👑", types:["Ghost","Dark"],
    base:{hp:69,atk:94,def:71,spa:92,spd:79,spe:90}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"shadow_ball"],[10,"void_rend"],[20,"umbral_claw"],[30,"phantom_claw"],[40,"shadow_sneak"],[50,"shadowstep"],[60,"neural_storm"],[5,"toxic"],[38,"mind_shatter"]],
    catchRate:18, expYield:285, rarity:"rare",
    desc:"The apex ghost predator — a crowned wraith that rules over all lesser ghost-types in its domain.",
    lore:"Wraithking is a ghost-dark entity 2 metres tall with a spectral crown of black flame. It commands lesser ghost-types and its presence causes all light sources within 50 metres to dim." },

  343: { id:343, name:"Shadowreave", emoji:"🌑", types:["Dark","Psychic"],
    base:{hp:66,atk:81,def:66,spa:103,spd:85,spe:89}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"shadowstep"],[10,"psychic_move"],[20,"void_rend"],[30,"psystrike"],[40,"phantom_claw"],[50,"mind_shatter"],[60,"neural_storm"],[5,"shadow_sneak"],[38,"dreamweave"]],
    catchRate:18, expYield:283, rarity:"rare",
    desc:"A being that exists simultaneously in darkness and thought. It reads minds to hunt more efficiently.",
    lore:"Shadowreave is a dark-psychic entity 1.6 metres tall with a body composed of living shadow and two luminous violet eyes. Its silhouette is never quite the same shape twice." },

  344: { id:344, name:"Glimmeritch", emoji:"🧚", types:["Fairy","Ghost"],
    base:{hp:63,atk:69,def:68,spa:102,spd:91,spe:97}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"fairy_wind"],[10,"shadow_ball"],[20,"fae_requiem"],[30,"psystrike"],[40,"phantom_claw"],[50,"void_rend"],[60,"fae_requiem"],[5,"dreamweave"],[38,"prism_ward"]],
    catchRate:18, expYield:280, rarity:"rare",
    desc:"A corrupted fairy that has passed through death and returned. Its glow is beautiful and deeply unsettling.",
    lore:"Glimmeritch is a fairy-ghost creature resembling a 0.6-metre glowing humanoid with translucent wings and a body that flickers between solid and spectral forms." },

  345: { id:345, name:"Voidcoil", emoji:"🌀", types:["Dark","Dragon"],
    base:{hp:73,atk:99,def:75,spa:90,spd:77,spe:81}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"dragon_breath"],[10,"void_rend"],[20,"dragon_claw"],[30,"shadow_ball"],[40,"wyrm_strike"],[50,"phantom_claw"],[60,"cataclysm_breath"],[5,"dragon_dance"],[38,"primordial_roar"]],
    catchRate:16, expYield:290, rarity:"rare",
    desc:"A dragon born from a void rift. Its scales absorb all light, making it nearly invisible in darkness.",
    lore:"Voidcoil is a dark-dragon serpent 4 metres long with scales so black they create a visible absence of light. Its eyes emit dim crimson light visible only in complete darkness." },

  346: { id:346, name:"Astralwing", emoji:"🌟", types:["Psychic","Flying"],
    base:{hp:67,atk:74,def:65,spa:100,spd:88,spe:96}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"gust"],[10,"psychic_move"],[20,"air_slash"],[30,"psystrike"],[40,"tailwind_strike"],[50,"mind_shatter"],[60,"neural_storm"],[5,"zephyr_dance"],[38,"dreamweave"]],
    catchRate:17, expYield:285, rarity:"rare",
    desc:"A being of pure psychic energy given wings. It navigates by reading the surface thoughts of other creatures.",
    lore:"Astralwing is a psychic-flying entity with a 3-metre wingspan composed of solidified psychic energy. Its body is a luminous humanoid shape with feathers made of thought-light." },

  347: { id:347, name:"Embersteel", emoji:"🔩", types:["Steel","Fire"],
    base:{hp:77,atk:104,def:98,spa:77,spd:75,spe:69}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"metal_claw"],[10,"ember"],[20,"iron_tail"],[30,"flamethrower"],[40,"flash_cannon"],[50,"heat_wave"],[60,"solar_flare"],[5,"embercloak"],[38,"alloy_edge"]],
    catchRate:16, expYield:292, rarity:"rare",
    desc:"Forged in Ironforge's legendary seventh furnace, it is the pinnacle of fire-steel metallurgy.",
    lore:"Embersteel is a steel-fire golem 2.2 metres tall with a body of superheated steel that glows white-hot at its joints. It was created as a guardian automaton and has never been fully tamed." },

  348: { id:348, name:"Galedrake", emoji:"🌪️", types:["Dragon","Wind"],
    base:{hp:69,atk:91,def:69,spa:91,spd:76,spe:99}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"gust"],[10,"dragon_breath"],[20,"air_slash"],[30,"dragon_claw"],[40,"tailwind_strike"],[50,"wyvern_gust"],[60,"scale_storm"],[5,"zephyr_dance"],[38,"wyrm_strike"]],
    catchRate:16, expYield:288, rarity:"rare",
    desc:"A dragon that rides perpetual cyclones of its own creation. It cannot stop flying or the storm dies.",
    lore:"Galedrake is a dragon-wind creature 3.5 metres long with broad swept-back wings that generate a constant personal cyclone. The air around it is always in violent circular motion." },

  349: { id:349, name:"Crystavault", emoji:"💠", types:["Ice","Rock"],
    base:{hp:80,atk:91,def:109,spa:74,spd:87,spe:54}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ice_punch"],[10,"rock_throw"],[20,"ice_beam"],[30,"rock_slide"],[40,"cryo_lance"],[50,"fossil_rush"],[60,"blizzard"],[5,"harden"],[38,"winter_shroud"]],
    catchRate:16, expYield:292, rarity:"rare",
    desc:"A fortress of living glacier-stone. Its outer shell has never been successfully breached in recorded history.",
    lore:"Crystavault is an ice-rock creature 2.5 metres tall resembling a fortified tower of layered glacial ice and granite. Ancient siege equipment has been found bent and broken around specimens." },

  350: { id:350, name:"Fernwrath", emoji:"🌿", types:["Grass","Dragon"],
    base:{hp:73,atk:95,def:75,spa:92,spd:79,spe:81}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"vine_whip"],[10,"dragon_breath"],[20,"root_lance"],[30,"dragon_pulse"],[40,"canopy_crash"],[50,"wyrm_strike"],[60,"verdant_surge"],[5,"dragon_dance"],[38,"ancient_breath"]],
    catchRate:15, expYield:292, rarity:"rare",
    desc:"A dragon grown from the world's oldest forest. Its scales are living wood; vines sprout from its wounds.",
    lore:"Fernwrath is a grass-dragon 4 metres long with scales of polished dark wood and a mane of living ferns. Where it walks, plants accelerate through their entire life cycle in hours." },

  351: { id:351, name:"Spectravore", emoji:"🌈", types:["Fairy","Psychic"],
    base:{hp:65,atk:71,def:68,spa:104,spd:92,spe:90}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"fairy_wind"],[10,"psychic_move"],[20,"fae_requiem"],[30,"psystrike"],[40,"mind_shatter"],[50,"neural_storm"],[60,"fae_requiem"],[5,"dreamweave"],[38,"prism_ward"]],
    catchRate:15, expYield:288, rarity:"rare",
    desc:"A being of pure prismatic thought that feeds on raw psychic energy. It is invariably found near psychic Lumori.",
    lore:"Spectravore is a fairy-psychic entity 1 metre tall that appears as a floating iridescent humanoid silhouette surrounded by a shifting aura of all visible colours." },

  // ---- Tier 3: Post-game NG+ (requiresChampion areas) BST ~580–630 ----
  352: { id:352, name:"Voidlord", emoji:"🕳️", types:["Dark","Psychic"],
    base:{hp:72,atk:94,def:76,spa:100,spd:84,spe:89}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"void_rend"],[10,"mind_shatter"],[20,"phantom_claw"],[30,"neural_storm"],[40,"shadowstep"],[50,"psystrike"],[60,"cataclysm_breath"],[5,"dreamweave"],[45,"prism_ward"]],
    catchRate:12, expYield:308, rarity:"rare",
    desc:"The sovereign of all void-touched creatures. Its mind is a labyrinth with no exit.",
    lore:"Voidlord is a dark-psychic entity 2.2 metres tall with a body of solidified void-matter and a crown of hovering psychic fragments. No one who has entered its mindscape has returned unchanged." },

  353: { id:353, name:"Infernotitan", emoji:"🌋", types:["Fire","Dragon"],
    base:{hp:78,atk:106,def:82,spa:98,spd:74,spe:82}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"flamethrower"],[10,"dragon_claw"],[20,"fire_blast"],[30,"dragon_pulse"],[40,"solar_flare"],[50,"cataclysm_breath"],[60,"ancient_breath"],[5,"char_dance"],[38,"primordial_roar"]],
    catchRate:10, expYield:318, rarity:"rare",
    desc:"A volcanic dragon that erupts when enraged. Continents have shifted from its ancient battles.",
    lore:"Infernotitan is a fire-dragon 6 metres long with scales of hardened magma and breath hot enough to liquefy stone. Ancient geological surveys attribute certain canyon formations to its rampages." },

  354: { id:354, name:"Riftwhale", emoji:"🐋", types:["Water","Psychic"],
    base:{hp:105,atk:77,def:88,spa:99,spd:93,spe:53}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"surf"],[10,"psychic_move"],[20,"hydro_pump"],[30,"psystrike"],[40,"sea_serpent_strike"],[50,"mind_shatter"],[60,"neural_storm"],[5,"tidecaller"],[38,"dreamweave"]],
    catchRate:10, expYield:315, rarity:"rare",
    desc:"A leviathan that travels between dimensions using psychic rift gates. Islands vanish when it surfaces.",
    lore:"Riftwhale is a water-psychic creature 12 metres long resembling a colossal whale with flanks covered in luminous psychic sigils. It navigates by warping local space." },

  355: { id:355, name:"Abyssalith", emoji:"🌊", types:["Water","Dark"],
    base:{hp:81,atk:99,def:88,spa:89,spd:81,spe:77}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"surf"],[10,"void_rend"],[20,"tidal_crush"],[30,"shadow_ball"],[40,"hydro_pump"],[50,"sea_serpent_strike"],[60,"sludge_wave"],[5,"shadowstep"],[38,"phantom_claw"]],
    catchRate:10, expYield:318, rarity:"rare",
    desc:"A hunter from the deepest abyss. Light physically bends around it as though avoiding contact.",
    lore:"Abyssalith is a water-dark creature 5 metres long resembling an armoured eel with bioluminescent lures. Its black scales have a refractive property that makes it nearly invisible underwater." },

  356: { id:356, name:"Stormlord", emoji:"⛈️", types:["Electric","Dragon"],
    base:{hp:72,atk:92,def:72,spa:104,spd:82,spe:98}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"thunder_shock"],[10,"dragon_breath"],[20,"thunderbolt"],[30,"dragon_pulse"],[40,"thunder"],[50,"wyrm_strike"],[60,"volt_surge"],[5,"dragon_dance"],[38,"ancient_breath"]],
    catchRate:10, expYield:320, rarity:"rare",
    desc:"A dragon that calls down storms across entire regions. It is the living embodiment of a thunderhead.",
    lore:"Stormlord is an electric-dragon 5 metres long with scales of polished chrome-blue and wing membranes of crackling electricity. The sky darkens for 100 kilometres when it takes flight." },

  357: { id:357, name:"Thornspire", emoji:"🌳", types:["Grass","Steel"],
    base:{hp:83,atk:91,def:108,spa:83,spd:90,spe:60}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"vine_whip"],[10,"metal_claw"],[20,"root_lance"],[30,"iron_tail"],[40,"canopy_crash"],[50,"flash_cannon"],[60,"verdant_surge"],[5,"thornwall"],[38,"alloy_edge"]],
    catchRate:10, expYield:316, rarity:"rare",
    desc:"An ancient tree-god whose bark is stronger than titanium. It has not moved in ten thousand years.",
    lore:"Thornspire is a grass-steel creature 8 metres tall resembling an impossibly old tree with branches of reinforced steel-alloy and roots that pierce solid bedrock." },

  358: { id:358, name:"Pyrocrown", emoji:"👑", types:["Fire","Psychic"],
    base:{hp:71,atk:83,def:73,spa:111,spd:92,spe:90}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[10,"psychic_move"],[20,"flamethrower"],[30,"psystrike"],[40,"solar_flare"],[50,"mind_shatter"],[60,"neural_storm"],[5,"char_dance"],[38,"dreamweave"]],
    catchRate:10, expYield:318, rarity:"rare",
    desc:"A psychic phoenix wearing a crown of permanent solar fire. Flame is its thought made manifest.",
    lore:"Pyrocrown is a fire-psychic bird 1.8 metres tall with feathers of solidified flame and a crown of pure solar fire. Its thoughts manifest as bursts of psychokinetic flame." },

  359: { id:359, name:"Glaciarch", emoji:"❄️", types:["Ice","Psychic"],
    base:{hp:73,atk:79,def:90,spa:107,spd:93,spe:73}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ice_beam"],[10,"psychic_move"],[20,"cryo_lance"],[30,"psystrike"],[40,"blizzard"],[50,"mind_shatter"],[60,"neural_storm"],[5,"prism_ward"],[38,"winter_shroud"]],
    catchRate:10, expYield:316, rarity:"rare",
    desc:"The sovereign of all ice-bound psychics. Its mind is as cold and clear as absolute zero.",
    lore:"Glaciarch is an ice-psychic entity 2 metres tall resembling an idealised humanoid carved entirely from deep blue glacial ice. Its eyes are voids of total blue-white." },

  360: { id:360, name:"Duskmantle", emoji:"🌙", types:["Dark","Fairy"],
    base:{hp:68,atk:83,def:73,spa:105,spd:98,spe:93}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"fairy_wind"],[10,"void_rend"],[20,"fae_requiem"],[30,"shadow_ball"],[40,"phantom_claw"],[50,"mind_shatter"],[60,"neural_storm"],[5,"shadowstep"],[38,"dreamweave"]],
    catchRate:10, expYield:318, rarity:"rare",
    desc:"A twilight sovereign that rules the threshold between day and night. It is neither fully light nor dark.",
    lore:"Duskmantle is a dark-fairy entity 1.8 metres tall that appears different from each angle — from one side it is a radiant fairy, from the other a creature of shadow. Both states are equally real." },

  361: { id:361, name:"Tectolith", emoji:"🌍", types:["Ground","Dragon"],
    base:{hp:92,atk:104,def:94,spa:78,spd:82,spe:70}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"earth_power"],[10,"dragon_claw"],[20,"fissure_slam"],[30,"dragon_pulse"],[40,"terra_spike"],[50,"wyrm_strike"],[60,"eon_crash"],[5,"dragon_dance"],[38,"primordial_roar"]],
    catchRate:10, expYield:320, rarity:"rare",
    desc:"A dragon so old it has become part of the land itself. Earthquakes are merely it turning in its sleep.",
    lore:"Tectolith is a ground-dragon 7 metres long with a body of compacted tectonic plates and continents of moss and stone across its back. It is older than most mountain ranges." },

  // ---- Tier 3b: More post-game NG+ BST ~590–640 ----
  362: { id:362, name:"Lunaspectre", emoji:"🌕", types:["Psychic","Ghost"],
    base:{hp:70,atk:78,def:74,spa:110,spd:94,spe:94}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"psychic_move"],[10,"shadow_ball"],[20,"psystrike"],[30,"void_rend"],[40,"mind_shatter"],[50,"phantom_claw"],[60,"neural_storm"],[5,"dreamweave"],[38,"prism_ward"]],
    catchRate:10, expYield:320, rarity:"rare",
    desc:"A moon-born spectre woven from lunar psychic energy. It appears only on nights of the full moon.",
    lore:"Lunaspectre is a psychic-ghost entity 2 metres tall that resembles a human silhouette composed of condensed moonlight. Its edges blur and shimmer like a reflection on disturbed water." },

  363: { id:363, name:"Chromavast", emoji:"🎨", types:["Normal","Psychic"],
    base:{hp:87,atk:90,def:83,spa:100,spd:90,spe:75}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"headbutt"],[10,"psychic_move"],[20,"body_slam"],[30,"psystrike"],[40,"hyper_beam"],[50,"mind_shatter"],[60,"neural_storm"],[5,"battle_cry"],[38,"dreamweave"]],
    catchRate:8, expYield:322, rarity:"rare",
    desc:"A colossal entity that shifts colour with its mood. When all colours appear simultaneously, it is enraged.",
    lore:"Chromavast is a normal-psychic creature 3 metres tall with a smooth ovoid body that cycles through every colour in the visible spectrum. Its form is constantly, slowly shifting." },

  364: { id:364, name:"Deepcrawler", emoji:"🦀", types:["Water","Steel"],
    base:{hp:85,atk:100,def:107,spa:75,spd:85,spe:68}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"water_gun"],[10,"metal_claw"],[20,"tidal_crush"],[30,"iron_tail"],[40,"hydro_pump"],[50,"flash_cannon"],[60,"sea_serpent_strike"],[5,"harden"],[38,"alloy_edge"]],
    catchRate:9, expYield:320, rarity:"rare",
    desc:"An armoured crustacean from the ocean floor. Its shell is composed of self-reinforcing bio-steel alloy.",
    lore:"Deepcrawler is a water-steel crustacean 2.5 metres across with a carapace of bio-synthesised steel alloy. Deep-sea pressure sensors have detected it moving at depths of 11 kilometres." },

  365: { id:365, name:"Cinderking", emoji:"🔥", types:["Fire","Dark"],
    base:{hp:75,atk:105,def:79,spa:94,spd:77,spe:90}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[10,"void_rend"],[20,"flamethrower"],[30,"shadow_ball"],[40,"solar_flare"],[50,"phantom_claw"],[60,"inferno"],[5,"char_dance"],[38,"umbral_claw"]],
    catchRate:9, expYield:318, rarity:"rare",
    desc:"A fire tyrant that rules through fear and flame. Its crown of black fire is cold to the touch.",
    lore:"Cinderking is a fire-dark creature 2.5 metres tall with a regal, bipedal form and a crown of black fire. It rules fire-type territory through dominance displays so intense that lesser fire-types flee entire regions." },

  366: { id:366, name:"Starlance", emoji:"⭐", types:["Psychic","Steel"],
    base:{hp:67,atk:94,def:90,spa:99,spd:82,spe:88}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"metal_claw"],[10,"psychic_move"],[20,"iron_tail"],[30,"psystrike"],[40,"flash_cannon"],[50,"mind_shatter"],[60,"neural_storm"],[5,"alloy_edge"],[38,"prism_ward"]],
    catchRate:9, expYield:322, rarity:"rare",
    desc:"A celestial lance that achieved sentience. It fell from orbit and has been fighting battles ever since.",
    lore:"Starlance is a psychic-steel entity 2 metres long resembling an elongated lance of alien metal with psychic runes carved along its entire length. It moves by telekinesis." },

  367: { id:367, name:"Bouldertide", emoji:"🌊", types:["Water","Rock"],
    base:{hp:91,atk:97,def:103,spa:80,spd:83,spe:66}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"water_gun"],[10,"rock_throw"],[20,"surf"],[30,"rock_slide"],[40,"hydro_pump"],[50,"fossil_rush"],[60,"sea_serpent_strike"],[5,"harden"],[38,"tidal_crush"]],
    catchRate:9, expYield:318, rarity:"rare",
    desc:"A creature that is half ocean, half cliff-face. It creates tsunamis as a side effect of moving.",
    lore:"Bouldertide is a water-rock creature 4 metres tall resembling a tide-carved sea stack that walks. Water constantly flows through channels in its stone body." },

  368: { id:368, name:"Willowisp", emoji:"🕯️", types:["Ghost","Fire"],
    base:{hp:67,atk:80,def:69,spa:110,spd:93,spe:101}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[10,"shadow_ball"],[20,"flamethrower"],[30,"void_rend"],[40,"solar_flare"],[50,"phantom_claw"],[60,"inferno"],[5,"shadowstep"],[38,"shadow_sneak"]],
    catchRate:9, expYield:320, rarity:"rare",
    desc:"An ancient will-o-the-wisp grown to monstrous power. It leads the living into the realm of flame.",
    lore:"Willowisp is a ghost-fire entity resembling a human-sized floating flame with a faint spectral face visible in its core. Its fire burns without fuel and consumes nothing physical." },

  369: { id:369, name:"Gravithorn", emoji:"🔮", types:["Psychic","Ground"],
    base:{hp:80,atk:94,def:88,spa:100,spd:84,spe:74}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"earth_power"],[10,"psychic_move"],[20,"terra_spike"],[30,"psystrike"],[40,"fissure_slam"],[50,"mind_shatter"],[60,"neural_storm"],[5,"prism_ward"],[38,"dreamweave"]],
    catchRate:9, expYield:320, rarity:"rare",
    desc:"A psychic that has learned to manipulate gravity. It walks on any surface, including the sky.",
    lore:"Gravithorn is a psychic-ground entity 1.8 metres tall with a body of psychically compressed stone. It can reverse gravity in a 30-metre radius and routinely walks on vertical surfaces." },

  370: { id:370, name:"Vortexwing", emoji:"🌪️", types:["Wind","Electric"],
    base:{hp:70,atk:90,def:68,spa:101,spd:81,spe:110}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"gust"],[10,"thunder_shock"],[20,"air_slash"],[30,"thunderbolt"],[40,"tailwind_strike"],[50,"volt_surge"],[60,"thunder"],[5,"zephyr_dance"],[38,"thunder_wave"]],
    catchRate:9, expYield:322, rarity:"rare",
    desc:"A living tornado that generates electricity from its rotation. Anything inside it is shredded and electrocuted simultaneously.",
    lore:"Vortexwing is a wind-electric entity 3 metres tall that exists as a permanent self-sustaining vortex. At its core is a dense electromagnetic nucleus visible as a crackling violet sphere." },

  371: { id:371, name:"Nullform", emoji:"⬛", types:["Dark","Normal"],
    base:{hp:82,atk:95,def:82,spa:94,spd:86,spe:86}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"void_rend"],[10,"headbutt"],[20,"shadow_ball"],[30,"body_slam"],[40,"phantom_claw"],[50,"hyper_beam"],[60,"neural_storm"],[5,"shadowstep"],[38,"battle_cry"]],
    catchRate:8, expYield:325, rarity:"rare",
    desc:"A creature with no definite type at heart. It absorbs the nature of whatever it defeats.",
    lore:"Nullform is a dark-normal creature 2 metres tall with a body of perfect matte black that reflects no light at all. It has no fixed features but rearranges its form to match whatever it has most recently defeated." },

  // ---- Tier 4: Prismatic Rift exclusives BST ~630–670 ----
  372: { id:372, name:"Prismancer", emoji:"🌈", types:["Psychic","Dragon"],
    base:{hp:69,atk:89,def:77,spa:107,spd:89,spe:89}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"psychic_move"],[10,"dragon_pulse"],[20,"psystrike"],[30,"dragon_claw"],[40,"mind_shatter"],[50,"wyrm_strike"],[60,"neural_storm"],[5,"dragon_dance"],[48,"cataclysm_breath"]],
    catchRate:8, expYield:335, rarity:"rare",
    desc:"A dragon born from a rift in the visible spectrum. Its scales cycle through every wavelength of light.",
    lore:"Prismancer is a psychic-dragon 4 metres long whose scales shift through every colour of visible light in a constant slow cycle. The air around it refracts into rainbow halos." },

  373: { id:373, name:"Voidrend", emoji:"🌌", types:["Dark","Ghost"],
    base:{hp:69,atk:103,def:74,spa:92,spd:82,spe:100}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"void_rend"],[10,"phantom_claw"],[20,"shadow_ball"],[30,"shadowstep"],[40,"umbral_claw"],[50,"mind_shatter"],[60,"neural_storm"],[5,"shadow_sneak"],[48,"cataclysm_breath"]],
    catchRate:7, expYield:338, rarity:"rare",
    desc:"A predator from between realities. It tears holes in space as naturally as others breathe.",
    lore:"Voidrend is a dark-ghost entity 2.5 metres tall with a body that exists simultaneously in normal space and the void between dimensions. Its claws leave visible tears in reality that slowly heal." },

  374: { id:374, name:"Auroradrake", emoji:"🌠", types:["Ice","Dragon"],
    base:{hp:69,atk:92,def:78,spa:102,spd:85,spe:94}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ice_beam"],[10,"dragon_breath"],[20,"cryo_lance"],[30,"dragon_pulse"],[40,"blizzard"],[50,"scale_storm"],[60,"cataclysm_breath"],[5,"dragon_dance"],[48,"ancient_breath"]],
    catchRate:7, expYield:338, rarity:"rare",
    desc:"A dragon woven from the aurora itself. It migrates between magnetic poles, trailing lights across the sky.",
    lore:"Auroradrake is an ice-dragon 5 metres long with translucent scales that emit bioluminescent light in bands of green, violet, and gold — a living aurora. It navigates by magnetic field." },

  375: { id:375, name:"Fluxserpent", emoji:"⚡", types:["Electric","Psychic"],
    base:{hp:67,atk:85,def:70,spa:110,spd:87,spe:101}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"thunder_shock"],[10,"psychic_move"],[20,"thunderbolt"],[30,"psystrike"],[40,"thunder"],[50,"mind_shatter"],[60,"neural_storm"],[5,"thunder_wave"],[48,"volt_surge"]],
    catchRate:7, expYield:340, rarity:"rare",
    desc:"A serpent of pure electrokinetic thought. It rewrites neural pathways with a single discharge.",
    lore:"Fluxserpent is an electric-psychic serpent 3 metres long composed of a continuous loop of electrical current given physical form. It can project its consciousness through any electrical system." },

  376: { id:376, name:"Solarwrath", emoji:"☀️", types:["Fire","Fairy"],
    base:{hp:68,atk:84,def:73,spa:112,spd:89,spe:94}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[10,"fairy_wind"],[20,"solar_flare"],[30,"fae_requiem"],[40,"fire_blast"],[50,"mind_shatter"],[60,"neural_storm"],[5,"char_dance"],[48,"solar_flare"]],
    catchRate:7, expYield:338, rarity:"rare",
    desc:"A being of concentrated solar fury blessed by ancient fairy magic. It has never been touched by shadow.",
    lore:"Solarwrath is a fire-fairy creature 2 metres tall composed of radiant solar plasma. It is warm to be near and hot to approach — within 10 metres, all shadow is eliminated." },

  377: { id:377, name:"Abyssforge", emoji:"🌋", types:["Ground","Steel"],
    base:{hp:85,atk:103,def:105,spa:73,spd:81,spe:73}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"earth_power"],[10,"metal_claw"],[20,"fissure_slam"],[30,"iron_tail"],[40,"terra_spike"],[50,"flash_cannon"],[60,"fossil_rush"],[5,"harden"],[48,"alloy_edge"]],
    catchRate:7, expYield:340, rarity:"rare",
    desc:"Born at the meeting of mantle and iron core, it forges new minerals inside itself as it moves.",
    lore:"Abyssforge is a ground-steel creature 3 metres tall with a body of compressed ultra-dense alloy formed under planetary core pressures. It leaves impressions in solid steel where it rests." },

  378: { id:378, name:"Dreamweald", emoji:"💭", types:["Psychic","Fairy"],
    base:{hp:69,atk:73,def:73,spa:113,spd:97,spe:95}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"fairy_wind"],[10,"psychic_move"],[20,"fae_requiem"],[30,"psystrike"],[40,"mind_shatter"],[50,"neural_storm"],[60,"dreamweave"],[5,"prism_ward"],[48,"cortex_spike"]],
    catchRate:7, expYield:340, rarity:"rare",
    desc:"A being that exists only in the shared dreamspace of nearby creatures. Physical contact wakes it permanently.",
    lore:"Dreamweald is a psychic-fairy entity visible only to those who are half-asleep. In full wakefulness it appears as a translucent shimmer, but in dreams it takes whatever form the dreamer most desires." },

  379: { id:379, name:"Riftscale", emoji:"🔮", types:["Dragon","Ghost"],
    base:{hp:78,atk:105,def:87,spa:111,spd:94,spe:105}, evolveTo:null, evolveLevel:null, ngPlusTier:2,
    learnset:[[1,"dragon_breath"],[10,"shadow_ball"],[20,"dragon_claw"],[30,"phantom_claw"],[40,"wyrm_strike"],[50,"void_rend"],[60,"cataclysm_breath"],[5,"dragon_dance"],[48,"eon_crash"]],
    catchRate:6, expYield:342, rarity:"legendary",
    desc:"A dragon that phases between worlds. Its scales exist in multiple realities simultaneously.",
    lore:"Riftscale is a dragon-ghost 4.5 metres long whose scales shimmer with a translucent quality — half of them appear solid and half ghostly. It can phase through solid matter at will." },

  380: { id:380, name:"Tempestborn", emoji:"⛈️", types:["Electric","Wind"],
    base:{hp:77,atk:98,def:77,spa:116,spd:94,spe:116}, evolveTo:null, evolveLevel:null, ngPlusTier:2,
    learnset:[[1,"thunder_shock"],[10,"gust"],[20,"thunderbolt"],[30,"air_slash"],[40,"thunder"],[50,"volt_surge"],[60,"tailwind_strike"],[5,"zephyr_dance"],[48,"neural_storm"]],
    catchRate:6, expYield:345, rarity:"legendary",
    desc:"Born at the eye of a century-storm. It IS the storm — a permanent atmospheric event given will.",
    lore:"Tempestborn is an electric-wind entity 4 metres across — a self-sustaining atmospheric vortex with a crackling lightning nucleus. Meteorologists have tracked it as both a storm and a living creature." },

  381: { id:381, name:"Crystalmind", emoji:"💎", types:["Psychic","Steel"],
    base:{hp:69,atk:78,def:94,spa:107,spd:92,spe:80}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"metal_claw"],[10,"psychic_move"],[20,"alloy_edge"],[30,"psystrike"],[40,"flash_cannon"],[50,"mind_shatter"],[60,"neural_storm"],[5,"prism_ward"],[48,"cortex_spike"]],
    catchRate:6, expYield:345, rarity:"rare",
    desc:"A crystal computer of living steel and pure psychic energy. It has solved every problem ever posed to it.",
    lore:"Crystalmind is a psychic-steel entity 1.5 metres tall shaped like a perfect geometric polyhedron of living crystal laced with steel filaments. Its psychic processing speed exceeds any known computation." },

  // ---- Tier 5: Apex Summit exclusives BST ~655–695 ----
  382: { id:382, name:"Oblivionwing", emoji:"🖤", types:["Dark","Dragon"],
    base:{hp:71,atk:103,def:78,spa:95,spd:81,spe:97}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"dragon_claw"],[10,"void_rend"],[20,"wyrm_strike"],[30,"shadow_ball"],[40,"scale_storm"],[50,"phantom_claw"],[60,"cataclysm_breath"],[5,"dragon_dance"],[52,"primordial_roar"]],
    catchRate:5, expYield:355, rarity:"rare",
    desc:"A dragon that devours light itself. Darkness spreads for kilometres from wherever it roosts.",
    lore:"Oblivionwing is a dark-dragon 6 metres long with wings that absorb all incoming light. Flying overhead, it casts a shadow darker than any natural darkness. Stars are visible at noon beneath its wings." },

  383: { id:383, name:"Apexblade", emoji:"⚔️", types:["Steel","Dragon"],
    base:{hp:71,atk:112,def:93,spa:77,spd:81,spe:91}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"metal_claw"],[10,"dragon_breath"],[20,"iron_tail"],[30,"dragon_claw"],[40,"flash_cannon"],[50,"wyrm_strike"],[60,"scale_storm"],[5,"dragon_dance"],[52,"alloy_edge"]],
    catchRate:5, expYield:355, rarity:"rare",
    desc:"The ultimate fusion of forged steel and draconic power. Its body is a living weapon.",
    lore:"Apexblade is a steel-dragon 5 metres long with a body of folded ultra-steel and draconic biology merged at the cellular level. Every surface is an edge. Its teeth alone number 340." },

  384: { id:384, name:"Solarcrown", emoji:"🌞", types:["Fire","Psychic"],
    base:{hp:69,atk:83,def:76,spa:115,spd:91,spe:91}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"solar_flare"],[10,"psychic_move"],[20,"fire_blast"],[30,"psystrike"],[40,"heat_wave"],[50,"mind_shatter"],[60,"neural_storm"],[5,"char_dance"],[52,"dreamweave"]],
    catchRate:5, expYield:358, rarity:"rare",
    desc:"The embodiment of solar noon — a psychic sun that walks the earth and has never known night.",
    lore:"Solarcrown is a fire-psychic entity 2.5 metres tall composed of compressed solar plasma. Its crown is a permanent coronal loop. Astronomers debate whether the sun responds to it or vice versa." },

  385: { id:385, name:"Permafrost", emoji:"🧊", types:["Ice","Ground"],
    base:{hp:87,atk:102,def:104,spa:75,spd:87,spe:70}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ice_punch"],[10,"earth_power"],[20,"cryo_lance"],[30,"fissure_slam"],[40,"blizzard"],[50,"terra_spike"],[60,"ice_beam"],[5,"winter_shroud"],[52,"harden"]],
    catchRate:5, expYield:355, rarity:"rare",
    desc:"A creature so cold it freezes the ground beneath it permanently. It has never melted.",
    lore:"Permafrost is an ice-ground creature 3 metres tall resembling a glacial boulder with limbs. The ground beneath it freezes to a depth of 50 metres and does not thaw for decades after it leaves." },

  386: { id:386, name:"Wraithstorm", emoji:"💀", types:["Ghost","Electric"],
    base:{hp:68,atk:92,def:70,spa:106,spd:84,spe:105}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"shadow_ball"],[10,"thunder_shock"],[20,"phantom_claw"],[30,"thunderbolt"],[40,"void_rend"],[50,"volt_surge"],[60,"thunder"],[5,"shadow_sneak"],[52,"neural_storm"]],
    catchRate:5, expYield:358, rarity:"rare",
    desc:"A ghost electrified by a lightning strike. It haunts storm fronts and strikes from inside the thunder.",
    lore:"Wraithstorm is a ghost-electric entity that exists inside active lightning bolts. Between strikes it takes the form of a translucent humanoid crackling with contained electricity." },

  387: { id:387, name:"Deepvoid", emoji:"🕳️", types:["Dark","Water"],
    base:{hp:82,atk:94,def:85,spa:101,spd:85,spe:78}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"surf"],[10,"void_rend"],[20,"tidal_crush"],[30,"shadow_ball"],[40,"hydro_pump"],[50,"phantom_claw"],[60,"sea_serpent_strike"],[5,"shadowstep"],[52,"abyssal_jet"]],
    catchRate:5, expYield:355, rarity:"rare",
    desc:"Something pulled up from a depth so great that light has never touched it. It is the dark of absolute abyss.",
    lore:"Deepvoid is a dark-water creature 6 metres long with a featureless body of absolute black. No light reflects from it. It was first encountered when it breached from a trench 12 kilometres deep." },

  388: { id:388, name:"Chronolith", emoji:"⏳", types:["Rock","Psychic"],
    base:{hp:85,atk:86,def:103,spa:100,spd:90,spe:61}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"rock_slide"],[10,"psychic_move"],[20,"fossil_rush"],[30,"psystrike"],[40,"rock_slide"],[50,"mind_shatter"],[60,"neural_storm"],[5,"prism_ward"],[52,"cortex_spike"]],
    catchRate:5, expYield:358, rarity:"rare",
    desc:"A stone that has witnessed every moment of Lumoria's history and remembers all of them simultaneously.",
    lore:"Chronolith is a rock-psychic entity resembling a massive standing stone 2.5 metres tall with geological strata that each contain a perfect frozen moment from the past, visible if viewed psychically." },

  389: { id:389, name:"Stormcrown", emoji:"⛈️", types:["Electric","Dragon"],
    base:{hp:78,atk:103,def:85,spa:118,spd:91,spe:108}, evolveTo:null, evolveLevel:null, ngPlusTier:2,
    learnset:[[1,"thunder_shock"],[10,"dragon_breath"],[20,"thunderbolt"],[30,"dragon_pulse"],[40,"thunder"],[50,"wyrm_strike"],[60,"cataclysm_breath"],[5,"dragon_dance"],[52,"volt_surge"]],
    catchRate:5, expYield:360, rarity:"legendary",
    desc:"The apex predator of electric dragons. Every storm in Lumoria eventually reports to it.",
    lore:"Stormcrown is an electric-dragon 5.5 metres long with a permanent crown of crackling lightning. It is the dominant electric-type in any region it inhabits and other electric creatures defer to it instinctively." },

  390: { id:390, name:"Voidgarden", emoji:"🌸", types:["Fairy","Dark"],
    base:{hp:71,atk:81,def:77,spa:112,spd:93,spe:91}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"fairy_wind"],[10,"shadow_ball"],[20,"fae_requiem"],[30,"void_rend"],[40,"mind_shatter"],[50,"phantom_claw"],[60,"neural_storm"],[5,"dreamweave"],[52,"umbral_claw"]],
    catchRate:5, expYield:360, rarity:"rare",
    desc:"A garden of beautiful but corrupted fae life. Its flowers are as poisonous as they are gorgeous.",
    lore:"Voidgarden is a fairy-dark entity 2 metres tall resembling a humanoid composed of luminous flowers and dark thorned vines growing simultaneously. The flowers glow with a light that induces euphoria." },

  391: { id:391, name:"Titanfang", emoji:"🦷", types:["Normal","Dragon"],
    base:{hp:88,atk:111,def:86,spa:77,spd:80,spe:83}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"headbutt"],[10,"dragon_breath"],[20,"body_slam"],[30,"dragon_claw"],[40,"hyper_beam"],[50,"wyrm_strike"],[60,"eon_crash"],[5,"dragon_dance"],[52,"primordial_roar"]],
    catchRate:5, expYield:362, rarity:"rare",
    desc:"The largest creature confirmed alive in Lumoria. It has no natural predators.",
    lore:"Titanfang is a normal-dragon creature 10 metres long resembling an ancient apex predator grown to impossible scale. The ground shakes with each step. Its roar is felt as a physical pressure for 30 kilometres." },

  // ---- Tier 5b: Ultra-rare Apex Summit BST ~680–710 ----
  392: { id:392, name:"Eondrake", emoji:"🐉", types:["Dragon","Psychic"],
    base:{hp:82,atk:115,def:91,spa:122,spd:95,spe:100}, evolveTo:null, evolveLevel:null, ngPlusTier:3,
    learnset:[[1,"dragon_pulse"],[10,"psystrike"],[20,"wyrm_strike"],[30,"mind_shatter"],[40,"scale_storm"],[50,"neural_storm"],[60,"cataclysm_breath"],[5,"dragon_dance"],[55,"time_fracture"]],
    catchRate:4, expYield:368, rarity:"legendary",
    desc:"A dragon that has lived so long it perceives all possible futures simultaneously. It fights battles it has already won.",
    lore:"Eondrake is a dragon-psychic 7 metres long whose scales carry the iridescent sheen of deep time. Its eyes are filled with visions of every past and future moment. Ancient records show it has appeared at every major historical turning point." },

  393: { id:393, name:"Nullstorm", emoji:"🌀", types:["Dark","Electric"],
    base:{hp:68,atk:95,def:70,spa:107,spd:83,spe:102}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"void_rend"],[10,"thunder_shock"],[20,"shadow_ball"],[30,"thunderbolt"],[40,"phantom_claw"],[50,"volt_surge"],[60,"neural_storm"],[5,"shadow_sneak"],[55,"thunder_wave"]],
    catchRate:4, expYield:368, rarity:"rare",
    desc:"A dark electromagnetic storm given will. It communicates by interrupting every electrical device within range.",
    lore:"Nullstorm is a dark-electric entity 5 metres across that resembles a contained electromagnetic storm with a dark nucleus. Every electronic device within a kilometre malfunctions in its presence." },

  394: { id:394, name:"Solarvast", emoji:"🌟", types:["Fire","Dragon"],
    base:{hp:86,atk:120,def:92,spa:117,spd:92,spe:101}, evolveTo:null, evolveLevel:null, ngPlusTier:3,
    learnset:[[1,"flamethrower"],[10,"dragon_breath"],[20,"solar_flare"],[30,"dragon_pulse"],[40,"fire_blast"],[50,"cataclysm_breath"],[60,"ancient_breath"],[5,"char_dance"],[55,"primordial_roar"]],
    catchRate:4, expYield:370, rarity:"legendary",
    desc:"A fire dragon born from the sun itself. The corona of its home star still wraps its body.",
    lore:"Solarvast is a fire-dragon 7 metres long whose scales burn with the surface temperature of a star. It was first recorded appearing from a solar flare. Its breath weapon reaches temperatures measurable only in solar physics." },

  395: { id:395, name:"Glacierend", emoji:"❄️", types:["Ice","Dragon"],
    base:{hp:97,atk:124,def:110,spa:115,spd:103,spe:99}, evolveTo:null, evolveLevel:null, ngPlusTier:4,
    learnset:[[1,"ice_beam"],[10,"dragon_claw"],[20,"cryo_lance"],[30,"dragon_pulse"],[40,"blizzard"],[50,"scale_storm"],[60,"cataclysm_breath"],[5,"dragon_dance"],[55,"ancient_breath"]],
    catchRate:4, expYield:370, rarity:"legendary",
    desc:"A glacier-dragon that has been growing since the last ice age. It moves slowly, but nothing stops it.",
    lore:"Glacierend is an ice-dragon 8 metres long with scales of glacial blue ice 50,000 years old. It moves at glacial speed outside battle but in combat is explosively fast. Every valley it has walked through remains permanently frozen." },

  396: { id:396, name:"Thunderpeak", emoji:"⚡", types:["Electric","Steel"],
    base:{hp:70,atk:98,def:92,spa:94,spd:79,spe:92}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"thunder_shock"],[10,"metal_claw"],[20,"thunderbolt"],[30,"iron_tail"],[40,"thunder"],[50,"flash_cannon"],[60,"volt_surge"],[5,"harden"],[55,"alloy_edge"]],
    catchRate:4, expYield:370, rarity:"rare",
    desc:"A living lightning rod of steel. Every bolt from every storm in Lumoria eventually passes through it.",
    lore:"Thunderpeak is an electric-steel creature 3 metres tall resembling a stylised lightning bolt in living metal. It has a near-perfect conductor rating and can absorb, store, and release planet-scale electrical charge." },

  397: { id:397, name:"Abyssalord", emoji:"🌊", types:["Water","Ghost"],
    base:{hp:79,atk:92,def:81,spa:101,spd:87,spe:85}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"surf"],[10,"shadow_ball"],[20,"tidal_crush"],[30,"phantom_claw"],[40,"hydro_pump"],[50,"void_rend"],[60,"neural_storm"],[5,"shadowstep"],[55,"sea_serpent_strike"]],
    catchRate:4, expYield:372, rarity:"rare",
    desc:"The lord of all drowned things. Sailors who die at sea answer to it now.",
    lore:"Abyssalord is a water-ghost creature 9 metres long resembling a massive spectral leviathan trailing ghostly sea-wrack. It is invisible underwater — its presence is detected only by a sudden drop in water temperature and the silencing of all sea life." },

  398: { id:398, name:"Voidcrown", emoji:"🌌", types:["Dark","Fairy"],
    base:{hp:87,atk:103,def:96,spa:137,spd:112,spe:117}, evolveTo:null, evolveLevel:null, ngPlusTier:4,
    learnset:[[1,"fae_requiem"],[10,"void_rend"],[20,"mind_shatter"],[30,"shadow_ball"],[40,"neural_storm"],[50,"phantom_claw"],[60,"void_dominion"],[5,"dreamweave"],[55,"void_dominion"]],
    catchRate:4, expYield:372, rarity:"legendary",
    desc:"The sovereign of corrupted fae — a ruler that bridges the beautiful and the terrible without apology.",
    lore:"Voidcrown is a dark-fairy entity 2.5 metres tall wearing a permanent crown of void-matter and fairy-light. Half of its face is radiant and warm; the other half is an absolute darkness that swallows sight." },

  399: { id:399, name:"Stonekeeper", emoji:"⛰️", types:["Rock","Ghost"],
    base:{hp:83,atk:89,def:103,spa:89,spd:89,spe:72}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"rock_slide"],[10,"shadow_ball"],[20,"fossil_rush"],[30,"phantom_claw"],[40,"rock_slide"],[50,"void_rend"],[60,"neural_storm"],[5,"harden"],[55,"prism_ward"]],
    catchRate:4, expYield:370, rarity:"rare",
    desc:"The ghost of a mountain that refused to erode. It guards the summit as it always has.",
    lore:"Stonekeeper is a rock-ghost entity 4 metres tall resembling a craggy mountain peak with a translucent interior. It is the spirit of a specific peak that was destroyed in an ancient cataclysm. It still performs the same patrol it did 10,000 years ago." },

  400: { id:400, name:"Primordiax", emoji:"🔥", types:["Fire","Ground"],
    base:{hp:102,atk:136,def:110,spa:110,spd:101,spe:101}, evolveTo:null, evolveLevel:null, ngPlusTier:4,
    learnset:[[1,"flamethrower"],[10,"earth_power"],[20,"magma_surge"],[30,"fissure_slam"],[40,"solar_flare"],[50,"terra_spike"],[60,"mantle_surge"],[5,"char_dance"],[55,"mantle_surge"]],
    catchRate:4, expYield:375, rarity:"legendary",
    desc:"A creature born when the planet's crust cracked and the mantle met the surface. It predates all others.",
    lore:"Primordiax is a fire-ground creature 5 metres tall resembling a primordial titan of cooling lava and deep rock. Geologists have identified its footprints in geological formations 500 million years old." },

  401: { id:401, name:"Cosmoveil", emoji:"🌠", types:["Psychic","Fairy"],
    base:{hp:89,atk:94,def:94,spa:146,spd:121,spe:121}, evolveTo:null, evolveLevel:null, ngPlusTier:4,
    learnset:[[1,"fairy_wind"],[10,"psychic_move"],[20,"fae_requiem"],[30,"psystrike"],[40,"mind_shatter"],[50,"neural_storm"],[60,"cosmic_veil"],[5,"prism_ward"],[55,"cosmic_veil"]],
    catchRate:3, expYield:380, rarity:"legendary",
    desc:"A being from beyond the known world. It arrived as a point of light that grew into something impossible.",
    lore:"Cosmoveil is a psychic-fairy entity 2 metres tall composed of condensed starlight and cosmic fairy magic. It arrived from outside the known Lumoria region and has not yet been placed in any evolutionary lineage. Its biology resembles nothing previously recorded." },

  // ---- Pseudo-legendary Family 1: Dragon/Psychic (Dracoveil line) BST 310→470→600 ----
  402: { id:402, name:"Scalit", emoji:"🐣", types:["Dragon","Psychic"],
    evolveTo:403, evolveLevel:32, ngPlusTier:1,
    base:{hp:50,atk:65,def:45,spa:60,spd:50,spe:40}, // BST 310
    learnset:[[1,"dragon_breath"],[1,"psychic_move"],[12,"dragon_claw"],[20,"psystrike"],[28,"dragon_dance"],[32,"wyrm_strike"]],
    catchRate:45, expYield:65, rarity:"uncommon",
    desc:"A tiny dragon hatchling with a faintly glowing psychic crest. Found only in NG+ rifts.",
    lore:"Scalit is a dragon-psychic hatchling 0.4 metres long with iridescent scales that pulse faintly with psychic energy. Its crest grows brighter each time it uses a psychic move." },

  403: { id:403, name:"Dracomind", emoji:"🐲", types:["Dragon","Psychic"],
    evolveTo:404, evolveLevel:52, ngPlusTier:1,
    base:{hp:72,atk:92,def:70,spa:95,spd:78,spe:63}, // BST 470
    learnset:[[1,"dragon_breath"],[1,"psychic_move"],[15,"dragon_claw"],[25,"psystrike"],[35,"dragon_dance"],[45,"wyrm_strike"],[55,"mind_shatter"]],
    catchRate:15, expYield:155, rarity:"rare",
    desc:"A fierce mid-stage dragon whose psychic power has grown enough to bend reality around it.",
    lore:"Dracomind is a dragon-psychic creature 1.8 metres long with gleaming scales layered in psychokinetic field. Its roar leaves visible ripples in the air from the psychic shock wave it produces." },

  404: { id:404, name:"Veildrak", emoji:"🐉", types:["Dragon","Psychic"],
    evolveTo:null, evolveLevel:null, ngPlusTier:1,
    base:{hp:92,atk:110,def:88,spa:130,spd:100,spe:80}, // BST 600
    learnset:[[1,"dragon_pulse"],[1,"psystrike"],[20,"wyrm_strike"],[30,"mind_shatter"],[40,"scale_storm"],[50,"neural_storm"],[60,"cataclysm_breath"],[5,"dragon_dance"],[60,"time_fracture"]],
    catchRate:5, expYield:300, rarity:"pseudolegendary",
    desc:"The apex of dragon-psychic evolution. It perceives battle outcomes before they happen and acts accordingly.",
    lore:"Veildrak is a dragon-psychic 5 metres long with wings that refract light into prismatic patterns and a crest of crystallised psychic energy. It is considered the pinnacle of the NG+ Lumori hierarchy." },

  // ---- Pseudo-legendary Family 2: Dark/Steel (Voidsteel line) BST 300→465→600 ----
  405: { id:405, name:"Mirkling", emoji:"🐾", types:["Dark","Steel"],
    evolveTo:406, evolveLevel:30, ngPlusTier:1,
    base:{hp:45,atk:62,def:55,spa:48,spd:50,spe:40}, // BST 300
    learnset:[[1,"shadowstep"],[1,"metal_claw"],[10,"void_rend"],[18,"iron_tail"],[26,"phantom_claw"],[30,"alloy_edge"]],
    catchRate:45, expYield:62, rarity:"uncommon",
    desc:"A shadow-pup of dark-steel born in the void rifts. Its tiny steel claws cut harder than they should.",
    lore:"Mirkling is a dark-steel creature 0.5 metres long resembling a shadowy puppy with small but razor-sharp steel claws. It instinctively forms alliances with other dark-types." },

  406: { id:406, name:"Umbrasteel", emoji:"🐺", types:["Dark","Steel"],
    evolveTo:407, evolveLevel:50, ngPlusTier:1,
    base:{hp:68,atk:98,def:88,spa:72,spd:78,spe:61}, // BST 465
    learnset:[[1,"shadowstep"],[1,"metal_claw"],[12,"void_rend"],[22,"iron_tail"],[32,"phantom_claw"],[42,"alloy_edge"],[52,"flash_cannon"]],
    catchRate:15, expYield:152, rarity:"rare",
    desc:"A wolf of forged shadows and living steel. It hunts in packs but leads every pack it joins.",
    lore:"Umbrasteel is a dark-steel creature 1.5 metres at the shoulder with a body of woven shadow filaments reinforced with micro-crystal steel alloy. It can become completely invisible in shadow." },

  407: { id:407, name:"Voidwarden", emoji:"⚔️", types:["Dark","Steel"],
    evolveTo:null, evolveLevel:null, ngPlusTier:1,
    base:{hp:88,atk:130,def:115,spa:85,spd:95,spe:87}, // BST 600
    learnset:[[1,"void_rend"],[1,"iron_tail"],[20,"phantom_claw"],[30,"flash_cannon"],[40,"umbral_claw"],[50,"alloy_edge"],[60,"scale_storm"],[5,"dragon_dance"],[60,"void_dominion"]],
    catchRate:5, expYield:300, rarity:"pseudolegendary",
    desc:"The supreme guardian of the void boundary. It wields darkness and steel as extensions of its own will.",
    lore:"Voidwarden is a dark-steel creature 3 metres tall with a body of condensed void-matter reinforced with an exoskeleton of ultra-dense steel. Ancient legends name it the Warden of the Boundary Between Worlds." },

  // ============================================================
  // FORGOTTEN LUMORI — IDs 408–446 (Vaeldrian Region)
  // These Lumori are not catchable and not named to the player.
  // In battle: "Forgotten Lumori X came in to battle."
  // In Luminex Vaeldris tab: shows only emoji + "Forgotten Lumori X"
  // foreignRegion:true flags all entries for mystery display.
  // ============================================================

  // --- Wielder: Lysara (Celestial Plateau) ---
  408: { id:408, name:"Forgotten Auravian", emoji:"🕊️", types:["Psychic","Flying"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:115,atk:95,def:110,spa:145,spd:130,spe:125},
    learnset:[[1,"confusion"],[20,"psybeam"],[35,"air_slash"],[50,"psychic_move"],[65,"moonblast"],[70,"cosmic_veil"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Messengers of the sacred temples of a lost land, Auravian carry the resonance of ancient prayers on crystalline wings.",
    lore:"Auravian are the divine messengers of Vaeldris. They appear to those who have lost something precious and are said to carry the voices of the departed on their wings." },

  409: { id:409, name:"Forgotten Lumarix", emoji:"🦢", types:["Fairy","Ground"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:120,atk:100,def:115,spa:155,spd:135,spe:125},
    learnset:[[1,"fairy_wind"],[20,"earth_power"],[35,"dazzling_gleam"],[50,"moonblast"],[65,"fissure_slam"],[70,"celestial_wave"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Lumarix hold fragments of starlight within their translucent bodies and release blinding radiance when threatened.",
    lore:"The crystalline structures within a Lumarix's body refract light in ways that physicists from Vaeldris spent centuries trying to explain. They never succeeded." },

  410: { id:410, name:"Forgotten Celestrix", emoji:"👼", types:["Normal","Steel"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:130,atk:105,def:120,spa:170,spd:145,spe:130},
    learnset:[[1,"body_slam"],[20,"flash_cannon"],[35,"psychic_move"],[50,"moonblast"],[65,"alloy_edge"],[70,"cosmic_veil"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"The apex guardian of Vaeldris's celestial order, Celestrix was said to manifest only when the stars aligned perfectly.",
    lore:"Lysara wept on the day Celestrix became the last of its kind. She has never spoken of the Sundering to anyone, but those who watch her battle claim they can see it in her eyes." },

  // --- Wielder: Morrigan (The Shadowfen) ---
  411: { id:411, name:"Forgotten Nyxviper", emoji:"🦇", types:["Dark","Ghost"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:80,atk:150,def:80,spa:120,spd:90,spe:200},
    learnset:[[1,"night_slash"],[20,"shadow_ball"],[35,"dark_pulse"],[50,"void_rend"],[65,"shadowstep"],[70,"eclipse_shroud"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Nyxviper phase through solid matter and strike from the space between moments. Their venom erases memories rather than dealing damage.",
    lore:"Vaeldrian scholars debated whether Nyxviper were truly physical beings or manifestations of collective nightmares. The debate was never resolved." },

  412: { id:412, name:"Forgotten Morrath", emoji:"🌑", types:["Poison","Fire"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:85,atk:145,def:90,spa:135,spd:95,spe:200},
    learnset:[[1,"shadow_ball"],[20,"fire_blast"],[35,"dark_pulse"],[50,"sludge_wave"],[65,"cinderwhirl"],[70,"nightmare_pulse"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Ancient Vaeldrians believed Morrath were warriors who refused to pass on. Their dark flames absorb light and burn without producing warmth.",
    lore:"The flames Morrath produce are called darkfire — they are technically fire in every measurable sense, yet a room lit only by darkfire grows darker the longer they burn." },

  413: { id:413, name:"Forgotten Duskmourn", emoji:"🕷️", types:["Ice","Psychic"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:95,atk:155,def:95,spa:155,spd:100,spe:200},
    learnset:[[1,"ice_punch"],[20,"psychic_move"],[35,"blizzard"],[50,"psystrike"],[65,"cryo_lance"],[70,"veil_collapse"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Duskmourn presided over Vaeldris's shadow courts as judge and executioner. It was the last thing standing when the Sundering came — and it still carries that grief.",
    lore:"Morrigan found Duskmourn three days after the Sundering, standing perfectly still at the edge of the collapse. She has never been able to explain why it chose to follow her." },

  // --- Wielder: Kael (Stormpeak Ridge) ---
  414: { id:414, name:"Forgotten Electrak", emoji:"🌩️", types:["Electric","Steel"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:90,atk:130,def:90,spa:150,spd:90,spe:170},
    learnset:[[1,"thunder_shock"],[20,"flash_cannon"],[35,"thunderbolt"],[50,"volt_surge"],[65,"alloy_edge"],[70,"overcharge"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Electrak surf electromagnetic currents at speeds that blur their outline. Their charged steel scales can discharge enough power to fuel a city for hours.",
    lore:"The steel in Electrak's scales is a natural alloy produced by their bodies — a material that conducts electricity with zero resistance that Vaeldrian engineers failed to replicate." },

  415: { id:415, name:"Forgotten Arcvolt", emoji:"⚡", types:["Dragon","Rock"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:95,atk:140,def:95,spa:155,spd:100,spe:165},
    learnset:[[1,"dragon_breath"],[20,"stone_edge"],[35,"dragon_claw"],[50,"dragon_pulse"],[65,"obsidian_crash"],[70,"time_fracture"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Arcvolt stores massive charges within draconic stone-scale formations before releasing them in a single arc. The discharge leaves glass where the lightning lands.",
    lore:"Arcvolt's scales form geological strata within their bodies over time — geologists from Vaeldris once found evidence of strikes dating back sixty thousand years in a single Arcvolt's hide." },

  416: { id:416, name:"Forgotten Fulgureis", emoji:"🌪️", types:["Flying","Water"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:100,atk:155,def:100,spa:165,spd:110,spe:170},
    learnset:[[1,"gust"],[20,"surf"],[35,"hurricane"],[50,"hydro_pump"],[65,"tidal_crush"],[70,"time_fracture"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Fulgureis was worshipped as Vaeldris's storm god. Its roar causes lightning to strike from all directions simultaneously. It has never been struck by lightning — it IS lightning.",
    lore:"Kael refuses to call Fulgureis by any title. He says if you need a title to respect something, you haven't understood it yet." },

  // --- Wielder: Thessaly (Ancient Root Cavern) ---
  417: { id:417, name:"Forgotten Rootborn", emoji:"🌿", types:["Grass","Poison"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:155,atk:135,def:130,spa:90,spd:120,spe:90},
    learnset:[[1,"vine_whip"],[20,"sludge_bomb"],[35,"seed_bomb"],[50,"energy_ball"],[65,"toxic_surge"],[70,"verdant_surge"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Rootborn grew from ancient seed-stones buried beneath Vaeldris's mountains for ten thousand years. Their roots crack bedrock and draw nutrients from bare stone.",
    lore:"A single Rootborn can undermine a mountain's foundation in a century. Thessaly meditates beside hers every morning and says it tells her things the mountains are thinking." },

  418: { id:418, name:"Forgotten Tellurak", emoji:"🗻", types:["Rock","Steel"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:160,atk:145,def:140,spa:95,spd:125,spe:85},
    learnset:[[1,"rock_slide"],[20,"iron_tail"],[35,"stone_edge"],[50,"flash_cannon"],[65,"obsidian_crash"],[70,"warden_strike"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Tellurak has absorbed millennia of geological pressure. Eruptions and earthquakes do not faze it. It once held a mountain together for a week through sheer will.",
    lore:"Vaeldrian stonecutters believed Tellurak were mountains that decided to walk. Thessaly has never corrected this belief." },

  419: { id:419, name:"Forgotten Gaiasurge", emoji:"🌋", types:["Ground","Dragon"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:170,atk:160,def:150,spa:105,spd:130,spe:85},
    learnset:[[1,"earthquake"],[20,"dragon_breath"],[35,"earth_power"],[50,"dragon_claw"],[65,"fissure_slam"],[70,"mantle_surge"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Gaiasurge embodies Vaeldris's tectonic fury. When the Sundering struck, it held the land together for as long as anything could. Then it could hold no longer.",
    lore:"Thessaly never speaks of what she saw Gaiasurge do during the Sundering. She says some things are too large for language." },

  // --- Wielder: Nereus (The Hadal Depths) ---
  420: { id:420, name:"Forgotten Pelagor", emoji:"🐬", types:["Water","Psychic"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:110,atk:110,def:100,spa:145,spd:115,spe:140},
    learnset:[[1,"water_gun"],[20,"confusion"],[35,"surf"],[50,"psychic_move"],[65,"hydro_pump"],[70,"telepathic_slam"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Pelagor perceive the emotional currents of the ocean and can sense fear, joy, and hunger across miles of open water.",
    lore:"Nereus claims Pelagor told him about the Sundering before it happened. He was three days' sail from Vaeldris and turned back because of it. He has never decided if that was the right choice." },

  421: { id:421, name:"Forgotten Bathykor", emoji:"🦈", types:["Dark","Poison"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:115,atk:120,def:105,spa:155,spd:120,spe:135},
    learnset:[[1,"dark_pulse"],[20,"sludge_bomb"],[35,"crunch"],[50,"venom_lance"],[65,"obsidian_fang"],[70,"void_dominion"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"From Vaeldris's lightless deep zones, Bathykor evolved to crush prey under pressures that collapse iron. Its gaze draws enemies toward an unseen void.",
    lore:"The toxin Bathykor produces doesn't cause pain. Victims simply become very still, very calm, and very far from the surface." },

  422: { id:422, name:"Forgotten Tidecrest", emoji:"🌊", types:["Dragon","Ice"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:125,atk:140,def:110,spa:165,spd:130,spe:130},
    learnset:[[1,"dragon_breath"],[20,"ice_beam"],[35,"dragon_claw"],[50,"blizzard"],[65,"eon_crash"],[70,"time_fracture"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Tidecrest commands ocean currents that span continents. A single pulse of its tail can redirect rivers. Nereus calls it the last ocean god. The ocean agrees.",
    lore:"In Vaeldrian myth, Tidecrest did not swim the ocean. The ocean flowed around Tidecrest." },

  // --- Wielder: Caelia (Cloudspire) ---
  423: { id:423, name:"Forgotten Aetherveil", emoji:"🦋", types:["Fairy","Electric"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:85,atk:100,def:90,spa:155,spd:110,spe:180},
    learnset:[[1,"fairy_wind"],[20,"thunder_shock"],[35,"dazzling_gleam"],[50,"thunderbolt"],[65,"moonblast"],[70,"pixie_bolt"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Aetherveil are the songs of the wind given form. Their calls travel across mountain ranges in seconds, carrying the voices of the lost to where they are needed.",
    lore:"Caelia says Aetherveil don't fly so much as they remind the air where it wants to go." },

  424: { id:424, name:"Forgotten Zephyrak", emoji:"🦅", types:["Flying","Steel"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:90,atk:105,def:95,spa:165,spd:115,spe:180},
    learnset:[[1,"gust"],[20,"flash_cannon"],[35,"air_slash"],[50,"alloy_edge"],[65,"hurricane"],[70,"warden_strike"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Zephyrak navigate by the electromagnetic signatures of all living things below, seeing the world as a tapestry of pulsing lights from miles in the clouds.",
    lore:"A Zephyrak's steel-feathers vibrate at frequencies that predict weather systems days in advance. Vaeldrian navigators once paid fortunes to travel with one." },

  425: { id:425, name:"Forgotten Skydrak", emoji:"🌬️", types:["Wind","Dragon"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:100,atk:115,def:100,spa:180,spd:125,spe:180},
    learnset:[[1,"gust"],[20,"dragon_breath"],[35,"hurricane"],[50,"dragon_pulse"],[65,"gale_cannon"],[70,"time_fracture"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Skydrak soars at the edge of the atmosphere where air meets space. Its wings span a city block. The last of its kind watched Vaeldris fall from that height and could do nothing.",
    lore:"Caelia refuses to let Skydrak land. She says it belongs in the sky and the day it touches the ground again is the day she'll know it has given up." },

  // --- Wielder: Dravek (Magma Forge) ---
  426: { id:426, name:"Forgotten Pyraeon", emoji:"🦁", types:["Fire","Steel"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:90,atk:155,def:110,spa:130,spd:95,spe:140},
    learnset:[[1,"ember"],[20,"metal_claw"],[35,"fire_blast"],[50,"flash_cannon"],[65,"solar_flare"],[70,"forge_strike"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Pyraeon's body is a living alloy — bone-steel fused with molten cores. Their claws can cut through solid iron with a single stroke.",
    lore:"Dravek sharpens Pyraeon's claws on volcanic rock every morning. He says the ritual keeps them both sharp." },

  427: { id:427, name:"Forgotten Emberon", emoji:"🐯", types:["Dark","Ground"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:95,atk:165,def:115,spa:135,spd:100,spe:140},
    learnset:[[1,"night_slash"],[20,"earthquake"],[35,"dark_pulse"],[50,"earth_power"],[65,"obsidian_fang"],[70,"void_dominion"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Emberon hunts in volcanic shadow. Its strikes leave wounds that refuse to stop burning, channeled through volcanic earth energy into something darker.",
    lore:"Every general in Vaeldris's history tried to recruit Dravek. He refused every one of them. Emberon, he said, fights for itself — he just happens to agree with it." },

  428: { id:428, name:"Forgotten Dracofire", emoji:"🔥", types:["Dragon","Poison"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:105,atk:185,def:120,spa:145,spd:105,spe:140},
    learnset:[[1,"dragon_breath"],[20,"sludge_wave"],[35,"dragon_claw"],[50,"venom_lance"],[65,"outrage"],[70,"mantle_surge"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Dracofire channels volcanic energy through draconic poison. Its exhale reaches temperatures that melt diamond — and the vapour corrodes whatever survives the heat.",
    lore:"Dravek bonded Dracofire as a hatchling, when it fit in his palm. He carried it under his armour for two winters. He has never admitted this publicly." },

  // --- Wielder: Nylara (Glacial Abyss) ---
  429: { id:429, name:"Forgotten Frigalum", emoji:"🦊", types:["Ice","Steel"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:120,atk:120,def:130,spa:120,spd:130,spe:100},
    learnset:[[1,"ice_punch"],[20,"flash_cannon"],[35,"ice_beam"],[50,"alloy_edge"],[65,"permafrost"],[70,"warden_strike"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Frigalum are armored in ice-steel — a material unique to Vaeldris that never melts and deflects dragonfire. Vaeldrian smiths spent centuries failing to replicate it.",
    lore:"The only sample of Frigalum ice-steel that made it out of Vaeldris is the pauldron on Nylara's left shoulder. She refuses to explain how she acquired it." },

  430: { id:430, name:"Forgotten Cryvorn", emoji:"🐺", types:["Dark","Rock"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:125,atk:130,def:140,spa:125,spd:135,spe:95},
    learnset:[[1,"dark_pulse"],[20,"stone_edge"],[35,"crunch"],[50,"obsidian_crash"],[65,"eclipse_shroud"],[70,"crystal_lance"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Cryvorn lurk beneath glacial ice, rising to drag prey into the frozen depths. Their dark aura prevents victims from feeling the cold — until it is already fatal.",
    lore:"Nylara says Cryvorn don't hunt so much as they remind prey that warmth was always temporary." },

  431: { id:431, name:"Forgotten Frostdrax", emoji:"❄️", types:["Dragon","Fairy"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:135,atk:145,def:150,spa:135,spd:145,spe:90},
    learnset:[[1,"dragon_breath"],[20,"fairy_wind"],[35,"dragon_claw"],[50,"moonblast"],[65,"eon_crash"],[70,"time_fracture"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Frostdrax maintained Vaeldris's northern climate for millennia. The ice continent shattered within hours of the moment it fled. It has not forgiven itself.",
    lore:"Frostdrax is the only one of the 39 that Nylara says chose to come with her. She did not command it. It simply followed." },

  // --- Wielder: Solenne (Moonhaven Ruins) ---
  432: { id:432, name:"Forgotten Dreamaith", emoji:"🦉", types:["Psychic","Ghost"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:100,atk:75,def:105,spa:175,spd:150,spe:115},
    learnset:[[1,"confusion"],[20,"shadow_ball"],[35,"psychic_move"],[50,"void_rend"],[65,"psystrike"],[70,"veil_collapse"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Dreamaith drift through walls and minds alike, leaving vivid impressions of Vaeldris in their wake. Those who encounter one report dreaming of a lost land for weeks afterward.",
    lore:"Solenne says Dreamaith don't know Vaeldris is gone. Every night, in the dream they share with her, it still stands." },

  433: { id:433, name:"Forgotten Luneveth", emoji:"🌙", types:["Fairy","Water"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:105,atk:80,def:110,spa:185,spd:155,spe:115},
    learnset:[[1,"fairy_wind"],[20,"water_gun"],[35,"moonblast"],[50,"surf"],[65,"celestial_wave"],[70,"hydro_pump"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Luneveth absorb moonlight and convert it into tidal energy. On full moon nights their power doubles. They are drawn to places that remember the sea.",
    lore:"There is a pool in Moonhaven Ruins that Luneveth fills each night with reflected moonlight. By morning it is dry again. Solenne has watched this every night for fifteen years." },

  434: { id:434, name:"Forgotten Psydrak", emoji:"💭", types:["Dragon","Electric"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:115,atk:90,def:115,spa:200,spd:165,spe:115},
    learnset:[[1,"dragon_breath"],[20,"thunderbolt"],[35,"dragon_pulse"],[50,"thunder"],[65,"draconic_roar"],[70,"time_fracture"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Psydrak exists simultaneously across multiple timelines. Its draconic mind holds the memory of Vaeldris in a thousand possible futures — and the grief of knowing none survived.",
    lore:"Solenne says Psydrak has been trying to show her a timeline where Vaeldris still exists. She says she can feel it almost finding one, night after night." },

  // --- Wielder: Rax (The Iron Sanctum) ---
  435: { id:435, name:"Forgotten Ironvast", emoji:"🦾", types:["Steel","Rock"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:130,atk:145,def:175,spa:75,spd:130,spe:65},
    learnset:[[1,"metal_claw"],[20,"rock_slide"],[35,"iron_tail"],[50,"stone_edge"],[65,"obsidian_crash"],[70,"warden_strike"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Ironvast's carapace has never been cracked in recorded Vaeldrian history. Engineers once used shed Ironvast shells as building material — with their full consent.",
    lore:"Rax says Ironvast has only ever been afraid once. He doesn't say when." },

  436: { id:436, name:"Forgotten Forgerak", emoji:"⚔️", types:["Fire","Dark"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:135,atk:155,def:185,spa:80,spd:135,spe:60},
    learnset:[[1,"ember"],[20,"night_slash"],[35,"fire_blast"],[50,"dark_pulse"],[65,"solar_flare"],[70,"eclipse_shroud"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Forgerak can heat their core to temperatures that liquefy ore. Vaeldrian smiths once worked alongside them to craft legendary weapons. Those weapons are all gone now.",
    lore:"Rax carries one of those weapons — a blade forged by Forgerak before the Sundering. He has never used it in battle. He says it isn't meant for fighting." },

  437: { id:437, name:"Forgotten Alloydrax", emoji:"🛡️", types:["Dragon","Fighting"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:145,atk:170,def:200,spa:90,spd:145,spe:50},
    learnset:[[1,"dragon_breath"],[20,"body_slam"],[35,"dragon_claw"],[50,"outrage"],[65,"eon_crash"],[70,"mantle_surge"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Alloydrax continuously refines its own body, becoming stronger with every battle. It was Vaeldris's final line of defense. The fact that Vaeldris still fell says everything.",
    lore:"Rax does not speak of Alloydrax's battle during the Sundering. He only says that it did its job — and that doing your job perfectly is not always enough." },

  // --- Wielder: Tempris (The Arc Station) ---
  438: { id:438, name:"Forgotten Volteon", emoji:"🔋", types:["Electric","Psychic"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:90,atk:110,def:95,spa:160,spd:120,spe:145},
    learnset:[[1,"thunder_shock"],[20,"confusion"],[35,"thunderbolt"],[50,"psychic_move"],[65,"volt_surge"],[70,"overcharge"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Volteon processes battle outcomes in microseconds using electric-psychic predictive modeling. By the time you have decided to act, Volteon has already chosen its counter.",
    lore:"Tempris designed the predictive model that Volteon runs. He says it's 94.7% accurate. Volteon disagrees with the 5.3% margin of error." },

  439: { id:439, name:"Forgotten Sparkeis", emoji:"⚡", types:["Steel","Ice"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:95,atk:120,def:100,spa:165,spd:125,spe:145},
    learnset:[[1,"metal_claw"],[20,"ice_punch"],[35,"flash_cannon"],[50,"blizzard"],[65,"alloy_edge"],[70,"warden_strike"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Sparkeis are living power grids — their steel chassis stores charges that could power a city for months. They convert all kinetic energy into electricity passively.",
    lore:"Tempris installed a small meter on Sparkeis to measure output. It broke after three days. He has not replaced it." },

  440: { id:440, name:"Forgotten Thunderax", emoji:"🌩️", types:["Dragon","Grass"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:105,atk:135,def:110,spa:180,spd:135,spe:135},
    learnset:[[1,"dragon_breath"],[20,"energy_ball"],[35,"dragon_pulse"],[50,"verdant_surge"],[65,"eon_crash"],[70,"time_fracture"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Thunderax charges itself using entire storm systems. Tempris claims it once powered a civilization for a week by standing still in a thundercloud. He is not exaggerating.",
    lore:"Thunderax is the only one of the 39 that does not seem to remember Vaeldris. Tempris has never decided if that is a tragedy or a mercy." },

  // --- Wielder: Vayne (The Void Gate) ---
  441: { id:441, name:"Forgotten Nihilax", emoji:"🕳️", types:["Dark","Ground"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:75,atk:145,def:80,spa:160,spd:90,spe:170},
    learnset:[[1,"night_slash"],[20,"earth_power"],[35,"dark_pulse"],[50,"earthquake"],[65,"eclipse_shroud"],[70,"void_dominion"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Nihilax emit a field that suppresses all energy signatures within range. In their presence, lights dim, sound muffles, and time seems to hesitate.",
    lore:"Vayne says Nihilax was the first Lumori she saw after the Sundering began. She has never been sure if it was trying to help or simply watching." },

  442: { id:442, name:"Forgotten Vantarix", emoji:"🌌", types:["Psychic","Poison"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:80,atk:155,def:85,spa:170,spd:95,spe:165},
    learnset:[[1,"confusion"],[20,"sludge_bomb"],[35,"psychic_move"],[50,"venom_lance"],[65,"psystrike"],[70,"toxic_surge"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Vantarix absorb light across all spectrums, appearing as a perfect silhouette even in total darkness. They are the only known Lumori visible inside the dimensional collapse itself.",
    lore:"Vayne has a drawing of Vantarix she made the first night she was safe. She has never looked at it again." },

  443: { id:443, name:"Forgotten Abysdrak", emoji:"💠", types:["Dragon","Ghost"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:90,atk:170,def:90,spa:185,spd:100,spe:165},
    learnset:[[1,"dragon_breath"],[20,"shadow_ball"],[35,"dragon_claw"],[50,"void_rend"],[65,"outrage"],[70,"void_dominion"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Abysdrak embodies the void at the heart of the Sundering. Vayne refuses to explain how she bound it to her will. Only that the night she did, stars over Vaeldris went out and never came back.",
    lore:"Some of the other wielders are afraid of Abysdrak. Vayne considers this the only reasonable response." },

  // --- Wielder: Azura (Observatory Peak) ---
  444: { id:444, name:"Forgotten Cosmolith", emoji:"🌠", types:["Psychic","Fairy"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:110,atk:90,def:110,spa:185,spd:130,spe:95},
    learnset:[[1,"confusion"],[20,"fairy_wind"],[35,"psychic_move"],[50,"moonblast"],[65,"psystrike"],[70,"cosmic_veil"]],
    catchRate:0, expYield:300, rarity:"legendary",
    desc:"Cosmolith serve as living star maps — their scales reflect the night sky of Vaeldris exactly as it existed the moment before the Sundering. They are the only record those stars ever existed.",
    lore:"Azura detected the Sundering three days before it happened by reading a change in Cosmolith's scale patterns. She had not understood what she was seeing until it was too late." },

  445: { id:445, name:"Forgotten Stardrax", emoji:"✨", types:["Dragon","Fire"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:115,atk:100,def:115,spa:195,spd:135,spe:90},
    learnset:[[1,"dragon_breath"],[20,"fire_blast"],[35,"dragon_pulse"],[50,"solar_flare"],[65,"ancient_breath"],[70,"time_fracture"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Stardrax's power surges like a dying star — quiet and vast until catastrophically sudden. Azura kept its egg safe for twelve years before it hatched the day the Sundering began.",
    lore:"The egg hatched the exact moment the Sundering started. Azura has spent fifteen years deciding what that means." },

  446: { id:446, name:"Forgotten Stellarion", emoji:"🔭", types:["Normal","Ghost"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:125,atk:115,def:125,spa:210,spd:145,spe:80},
    learnset:[[1,"body_slam"],[20,"shadow_ball"],[35,"psychic_move"],[50,"hyper_beam"],[65,"void_rend"],[70,"cosmic_veil"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Stellarion is said to contain a fragment of the first star that ever formed. To those who cannot perceive cosmic energy it appears ordinary. To Azura, it blazes like a newborn universe.",
    lore:"Azura says Stellarion is the last wonder Vaeldris ever produced — and that it is also the most important thing to survive the Sundering, because it carries the proof that Vaeldris was worth mourning." }
};


// ============================================================
// WORLD DATA - Lumoria Region
// ============================================================
const WORLD_DATA = {
  seedvale: {
    id:"seedvale", name:"Seedvale Town", icon:"🏡", type:"town",
    desc:"A peaceful starter town nestled in a valley. Professor Solaris's lab is here.",
    connections:["route1","fairy_meadow_south"],
    wildMonsters:[], hasGym:false, requiredBadges:0,
    mapPos:{x:15, y:75}
  },
  route1: {
    id:"route1", name:"Route 1 - Meadow Path", icon:"🌿", type:"route",
    desc:"A gentle grassy path with mild wild Lumori. Perfect for beginners.",
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
    desc:"A dense forest teeming with Bug and Grass type Lumori.",
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
    connections:["route3","route4","volcano_core","iron_canyon"],
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
    connections:["route4","route5","storm_plateau","thunder_cliffs"],
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
    connections:["sparkmoor","frostpeak","mirror_lake"],
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
    connections:["route5","route6","storm_plateau","crystal_depths","lunar_peak"],
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
    connections:["route6","route7","crystal_depths","haunted_grove"],
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
    connections:["shadowmere","skyvault","mystic_forest","fairy_meadow_north","poison_swamp_upper","wind_bridge"],
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
    connections:["route7","route8","mystic_forest","sky_harbor","wind_bridge"],
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
    connections:["skyvault","dragonspire","wind_bridge"],
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
    hasGym:true, gymLeader:"drake", requiredBadges:7, mapPos:{x:55, y:42},
    legendaryEncounter:{monsterId:84, level:60}
  },
  victoryroad: {
    id:"victoryroad", name:"The Gauntlet", icon:"⚔️", type:"route",
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
    connections:["route2","ancient_ruins","bug_forest_west","poison_swamp_lower"],
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
    desc:"Crumbling temples from a forgotten civilization. Psychic and Dark energies fill the air. The Umbra Order has been spotted here.",
    connections:["lumoria_jungle","bug_forest_east","reef_ruins"],
    wildMonsters:[
      {id:142, minLv:12, maxLv:16, rate:25},  // Dawnsprite
      {id:170, minLv:12, maxLv:16, rate:25},  // Dreamrift
      {id:124, minLv:13, maxLv:17, rate:20},  // Phantomfang
      {id:168, minLv:14, maxLv:17, rate:20},  // Esperia
      {id:166, minLv:14, maxLv:17, rate:10}   // Mindpup
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:64, y:76},
    storyLocation:true, hasUmbraEncounter:true,
    legendaryEncounter:{monsterId:165, level:55}
  },
  deep_trench: {
    id:"deep_trench", name:"Abyssal Trench", icon:"🌊", type:"route",
    desc:"The deepest part of Lumoria's ocean. Water and Dragon types of terrifying power lurk here. The Umbra Order seeks something ancient in these depths.",
    connections:["tidewatch","coral_reef","sunken_temple"],
    wildMonsters:[
      {id:85, minLv:18, maxLv:24, rate:25},  // Seadrake
      {id:33, minLv:18, maxLv:24, rate:25},  // Surgeeel
      {id:19, minLv:19, maxLv:24, rate:25},  // Glaciaseal
      {id:17, minLv:20, maxLv:25, rate:15},  // Waveclaw
      {id:98, minLv:20, maxLv:25, rate:10}   // Cragclaw
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:78, y:60},
    storyLocation:true, hasUmbraEncounter:true,
    legendaryEncounter:{monsterId:107, level:50}
  },
  volcano_core: {
    id:"volcano_core", name:"Volcano Core", icon:"🌋", type:"route",
    desc:"The scorching heart of the volcano beneath Emberveil. Only the most fearless trainers descend here. Legendary energies stir within.",
    connections:["emberveil","iron_canyon","lava_fields"],
    wildMonsters:[
      {id:15, minLv:22, maxLv:28, rate:25},  // Flamewyrm
      {id:13, minLv:22, maxLv:28, rate:25},  // Magmacow
      {id:38, minLv:23, maxLv:28, rate:20},  // Venomscorp
      {id:97, minLv:24, maxLv:29, rate:20},  // Boulderhound
      {id:15, minLv:24, maxLv:29, rate:10}   // Flamewyrm
    ],
    hasGym:false, requiredBadges:3, mapPos:{x:82, y:42},
    storyLocation:true, hasUmbraEncounter:true,
    legendaryEncounter:{monsterId:106, level:50}
  },
  storm_plateau: {
    id:"storm_plateau", name:"Storm Plateau", icon:"⛈️", type:"route",
    desc:"A high plateau perpetually wracked by storms. Electric and Dragon types are drawn to its crackling energy.",
    connections:["sparkmoor","frostpeak","lunar_peak","mirror_lake","thunder_cliffs"],
    wildMonsters:[
      {id:86, minLv:28, maxLv:34, rate:25},  // Stormwyrm
      {id:42, minLv:28, maxLv:34, rate:25},  // Galemane
      {id:31, minLv:29, maxLv:34, rate:25},  // Thunderfly
      {id:44, minLv:29, maxLv:34, rate:15},  // Cyclobird
      {id:33, minLv:30, maxLv:35, rate:10}   // Surgeeel
    ],
    hasGym:false, requiredBadges:4, mapPos:{x:36, y:12},
    storyLocation:true, hasUmbraEncounter:true,
    legendaryEncounter:{monsterId:105, level:50}
  },
  crystal_depths: {
    id:"crystal_depths", name:"Crystal Depths", icon:"💠", type:"route",
    desc:"An underground crystal cavern with walls of pure ice and steel. Rare mineral-type Lumori call this glittering place home.",
    connections:["frostpeak","shadowmere","crystal_spire"],
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
    desc:"A forest where the boundary between worlds is thin. Fairy and Psychic creatures drift between the trees. The Umbra Order's hideout is rumoured to be nearby.",
    connections:["route7","skyvault","sky_harbor","umbra_base"],
    wildMonsters:[
      {id:143, minLv:46, maxLv:52, rate:25},  // Celestara
      {id:141, minLv:46, maxLv:52, rate:25},  // Radiantfly
      {id:169, minLv:47, maxLv:52, rate:20},  // Telepathy
      {id:115, minLv:48, maxLv:52, rate:20},  // Mistwalker
      {id:122, minLv:48, maxLv:52, rate:10}   // Spectrewing
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:25, y:62},
    storyLocation:true, hasUmbraEncounter:true
  },
  umbra_base: {
    id:"umbra_base", name:"The Umbra Order Base", icon:"☠️", type:"special",
    desc:"The hidden fortress of The Umbra Order. Their leader, Commander Shade, awaits you here. This is your chance to stop their plan to awaken the three Legendaries.",
    connections:["mystic_forest","dark_canyon"],
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
  poison_swamp_upper: {
    id:"poison_swamp_upper", name:"Poison Swamp Upper", icon:"🌿", type:"route",
    desc:"The upper reaches of the Poison Swamp, where toxic fumes seep from cracks in the earth near the marshes of Route 7.",
    connections:["route7","poison_swamp_lower"],
    wildMonsters:[
      {id:71, minLv:44, maxLv:49, rate:30},   // Toxitoad
      {id:73, minLv:44, maxLv:49, rate:35},   // Acidblob
      {id:75, minLv:45, maxLv:50, rate:35}    // Miasmafly
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:30, y:56}
  },
  poison_swamp_lower: {
    id:"poison_swamp_lower", name:"Poison Swamp Lower", icon:"🌿", type:"route",
    desc:"The deeper, fouler reaches of the Poison Swamp. The air is thick with noxious miasma and stronger Poison types lurk in the muck.",
    connections:["poison_swamp_upper","lumoria_jungle"],
    wildMonsters:[
      {id:75, minLv:46, maxLv:51, rate:25},   // Miasmafly
      {id:119, minLv:47, maxLv:52, rate:35},  // Bogthorn
      {id:74, minLv:48, maxLv:53, rate:40}    // Sludgebeast
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:42, y:70}
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
    storyLocation:true, hasUmbraEncounter:true
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
    hasGym:false, requiredBadges:3, mapPos:{x:88, y:30},
    legendaryEncounter:{monsterId:167, level:55}
  },
  fairy_meadow_south: {
    id:"fairy_meadow_south", name:"Fairy Meadow South", icon:"🌸", type:"route",
    desc:"The southern stretch of Fairy Meadow, where gentle flowers bloom near Seedvale. Fairy and Grass types play in the warm breeze.",
    connections:["seedvale","fairy_meadow_north","spirit_canyon"],
    wildMonsters:[
      {id:137, minLv:4, maxLv:7, rate:30},     // Glowpup
      {id:69, minLv:4, maxLv:7, rate:35},     // Germix
      {id:111, minLv:5, maxLv:8, rate:35}     // Aeolin
    ],
    hasGym:false, requiredBadges:0, mapPos:{x:8, y:68}
  },
  fairy_meadow_north: {
    id:"fairy_meadow_north", name:"Fairy Meadow North", icon:"🌸", type:"route",
    desc:"The northern stretch of Fairy Meadow leading toward the Poison Marshes. Stronger Fairy types guard this path.",
    connections:["fairy_meadow_south","route7"],
    wildMonsters:[
      {id:137, minLv:6, maxLv:10, rate:25},    // Glowpup
      {id:140, minLv:7, maxLv:11, rate:35},   // Faeling
      {id:111, minLv:7, maxLv:11, rate:40}    // Aeolin
    ],
    hasGym:false, requiredBadges:0, mapPos:{x:8, y:48}
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
  bug_forest_west: {
    id:"bug_forest_west", name:"Bug Forest West", icon:"🐛", type:"route",
    desc:"The western edge of the Bug Forest, thick with webs and buzzing wings. Connects to the Lumoria Jungle.",
    connections:["lumoria_jungle","bug_forest_east"],
    wildMonsters:[
      {id:197, minLv:10, maxLv:14, rate:30},  // Vermelin
      {id:200, minLv:10, maxLv:14, rate:30},  // Colerix
      {id:84, minLv:11, maxLv:15, rate:40}    // Electrix
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:50, y:74}
  },
  bug_forest_east: {
    id:"bug_forest_east", name:"Bug Forest East", icon:"🐛", type:"route",
    desc:"The deeper eastern reaches of the Bug Forest. Stronger bugs and rare species inhabit the ancient trees near the ruins.",
    connections:["bug_forest_west","ancient_ruins"],
    wildMonsters:[
      {id:200, minLv:12, maxLv:17, rate:25},  // Colerix
      {id:123, minLv:13, maxLv:18, rate:35},  // Nocturil
      {id:10, minLv:14, maxLv:19, rate:40}    // Embrix
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:56, y:76}
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
    connections:["haunted_grove","fairy_meadow_south","dark_canyon"],
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
    storyLocation:true, hasUmbraEncounter:true
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
    storyLocation:true, hasUmbraEncounter:true,
    legendaryEncounter:{monsterId:164, level:55}
  },
  dark_canyon: {
    id:"dark_canyon", name:"Dark Canyon", icon:"🌑", type:"route",
    desc:"A pitch-black gorge where no light penetrates. Dark type Lumori have claimed every shadowed corner, and even the rocks seem to absorb light.",
    connections:["spirit_canyon","umbra_base"],
    wildMonsters:[
      {id:119, minLv:50, maxLv:56, rate:25},   // Nighthound
      {id:122, minLv:50, maxLv:56, rate:25},   // Spectrewing
      {id:126, minLv:51, maxLv:57, rate:20},  // Wraithling
      {id:124, minLv:52, maxLv:57, rate:20},   // Phantomfang
      {id:130, minLv:53, maxLv:58, rate:10}   // Gravemoss
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:4, y:60},
    legendaryEncounter:{monsterId:166, level:55}
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
    hasGym:false, requiredBadges:8, mapPos:{x:60, y:48},
    ngPlusWildMonsters:[{id:326,minLv:62,maxLv:68,rate:20},{id:328,minLv:62,maxLv:68,rate:15},{id:331,minLv:63,maxLv:69,rate:15}]
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
      {id:155, minLv:57, maxLv:62, rate:15},  // Toxirin (base)
      {id:157, minLv:57, maxLv:62, rate:15},  // Acidelix (base)
      {id:160, minLv:58, maxLv:63, rate:15},  // Miasoveth (base)
      {id:161, minLv:59, maxLv:64, rate:10},  // Mistbane (mid → after base ✓)
      {id:162, minLv:58, maxLv:63, rate:10},  // Marlix (base)
      {id:163, minLv:59, maxLv:64, rate:10},  // Blightalis (mid → after base ✓)
      {id:206, minLv:57, maxLv:62, rate:10},  // Venomscale (base Poison/Dragon)
      {id:266, minLv:57, maxLv:62, rate:10},  // Shadowpup (base Dark)
      {id:299, minLv:57, maxLv:62, rate:5}    // Stinglet (base Bug/Poi)
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:48, y:60},
    ngPlusWildMonsters:[{id:322,minLv:64,maxLv:70,rate:20},{id:323,minLv:64,maxLv:70,rate:15},{id:325,minLv:65,maxLv:71,rate:10}]
  },
  miasmacity: {
    id:"miasmacity", name:"Miasma City", icon:"🏭", type:"city",
    desc:"An industrial city shrouded in toxic mist. Home to Gym Leader Viper, master of Poison types.",
    connections:["toxic_bog","route11"],
    wildMonsters:[
      {id:156, minLv:58, maxLv:63, rate:25},  // Venekon (mid)
      {id:159, minLv:60, maxLv:65, rate:25},  // Acidovast (final, 158 on murk_crossing ✓)
      {id:163, minLv:59, maxLv:64, rate:25},  // Blightalis (mid, 162 on route10 ✓)
      {id:165, minLv:59, maxLv:64, rate:25}   // Noxoveth (mid, 164 on murk_crossing ✓)
    ],
    hasGym:true, gymLeader:"viper", requiredBadges:9, mapPos:{x:42, y:65},
    ngPlusWildMonsters:[{id:322,minLv:65,maxLv:70,rate:25},{id:324,minLv:65,maxLv:70,rate:15}]
  },
  route11: {
    id:"route11", name:"Route 11 - Tremor Pass", icon:"🏔️", type:"route",
    desc:"A rumbling mountain pass where the ground never stops shaking.",
    connections:["miasmacity","quake_foothills"],
    wildMonsters:[
      {id:95,  minLv:59, maxLv:64, rate:20},  // Dustkin (base)
      {id:98,  minLv:59, maxLv:64, rate:20},  // Aridix (base)
      {id:101, minLv:59, maxLv:64, rate:20},  // Limoux (base)
      {id:104, minLv:60, maxLv:65, rate:20},  // Arenikin (base)
      {id:105, minLv:61, maxLv:66, rate:10},  // Dravanas (mid → after 104 ✓)
      {id:106, minLv:60, maxLv:65, rate:10},  // Geodrak (base)
      {id:236, minLv:59, maxLv:64, rate:10},  // Frostick (base Ice)
      {id:248, minLv:59, maxLv:64, rate:10}   // Pebblard (base Rock)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:35, y:72},
    ngPlusWildMonsters:[{id:325,minLv:66,maxLv:72,rate:20},{id:327,minLv:66,maxLv:72,rate:15},{id:329,minLv:67,maxLv:73,rate:10}]
  },
  terravault: {
    id:"terravault", name:"Terravault City", icon:"⛏️", type:"city",
    desc:"A city carved into a mountainside, rich with mineral deposits. Home to Gym Leader Atlas.",
    connections:["tremor_summit","route12"],
    wildMonsters:[
      {id:97,  minLv:61, maxLv:66, rate:25},  // Tectonvast (final, 96 on quake_foothills ✓)
      {id:100, minLv:61, maxLv:66, rate:25},  // Venomvast (final, 99 on quake_foothills ✓)
      {id:103, minLv:61, maxLv:66, rate:25},  // Crustvast (final, 102 on quake_foothills ✓)
      {id:105, minLv:61, maxLv:66, rate:15},  // Dravanas (final, 104 on route11 ✓)
      {id:107, minLv:62, maxLv:67, rate:10}   // Quakeon (final, 106 on route11 ✓)
    ],
    hasGym:true, gymLeader:"atlas", requiredBadges:10, mapPos:{x:28, y:78},
    ngPlusWildMonsters:[{id:327,minLv:67,maxLv:72,rate:25},{id:337,minLv:67,maxLv:72,rate:15}]
  },
  route12: {
    id:"route12", name:"Route 12 - Silk Road", icon:"🕸️", type:"route",
    desc:"A path threaded with giant webs. Bug types ambush travelers at every turn.",
    connections:["terravault","fungal_cavern"],
    wildMonsters:[
      {id:197, minLv:61, maxLv:66, rate:20},  // Vermelin (base)
      {id:198, minLv:62, maxLv:67, rate:20},  // Chrysalix (mid → after 197 ✓)
      {id:200, minLv:61, maxLv:66, rate:20},  // Colerix (base)
      {id:202, minLv:62, maxLv:67, rate:20},  // Sericrix (base)
      {id:204, minLv:63, maxLv:68, rate:15},  // Muddite (base)
      {id:215, minLv:62, maxLv:67, rate:10},  // Veilwisp (base Psychic)
      {id:262, minLv:62, maxLv:67, rate:10}   // Seedling (base Grass/Poi)
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:22, y:82},
    ngPlusWildMonsters:[{id:324,minLv:68,maxLv:74,rate:20},{id:329,minLv:68,maxLv:74,rate:15},{id:339,minLv:69,maxLv:75,rate:10},{id:402,minLv:68,maxLv:74,rate:8},{id:405,minLv:68,maxLv:74,rate:8}]
  },
  silkwood: {
    id:"silkwood", name:"Silkwood Village", icon:"🌲", type:"city",
    desc:"A village nestled in an ancient forest where Bug types are revered. Home to Gym Leader Mantis.",
    connections:["ancient_grove","route13"],
    wildMonsters:[
      {id:199, minLv:63, maxLv:68, rate:25},  // Aeridaleth (final)
      {id:201, minLv:62, maxLv:67, rate:25},  // Scarabion (mid)
      {id:203, minLv:63, maxLv:68, rate:25},  // Arachnalis (mid, 202 on route12 ✓)
      {id:205, minLv:64, maxLv:69, rate:25}   // Quarrix (mid)
    ],
    hasGym:true, gymLeader:"mantis", requiredBadges:11, mapPos:{x:15, y:88},
    ngPlusWildMonsters:[{id:330,minLv:68,maxLv:74,rate:25},{id:331,minLv:68,maxLv:74,rate:20},{id:326,minLv:68,maxLv:74,rate:10},{id:402,minLv:69,maxLv:75,rate:6},{id:405,minLv:69,maxLv:75,rate:6}]
  },
  route13: {
    id:"route13", name:"Route 13 - Gale Ridge West", icon:"🌬️", type:"route",
    desc:"The western arm of Gale Ridge, where howling winds funnel through a narrow canyon toward the furthest point of the region.",
    connections:["silkwood","wind_hollow"],
    wildMonsters:[
      {id:108, minLv:63, maxLv:68, rate:20},  // Gustkin (base)
      {id:109, minLv:64, maxLv:69, rate:20},  // Siroccomane (mid → after 108 ✓)
      {id:111, minLv:63, maxLv:68, rate:20},  // Aeolin (base)
      {id:114, minLv:64, maxLv:69, rate:15},  // Nimbusel (base)
      {id:116, minLv:64, maxLv:69, rate:15},  // Zephyrin (base)
      {id:61,  minLv:65, maxLv:70, rate:10},  // wind-type standalone
      {id:291, minLv:63, maxLv:68, rate:10},  // Breezekin (base Wind)
      {id:222, minLv:63, maxLv:68, rate:10},  // Mindpuff (base Psychic)
      {id:220, minLv:63, maxLv:68, rate:5}    // Umbrajest (base Dark/Psychic)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:10, y:92},
    ngPlusWildMonsters:[{id:335,minLv:70,maxLv:76,rate:20},{id:348,minLv:70,maxLv:76,rate:15},{id:370,minLv:71,maxLv:77,rate:10}]
  },
  gusthaven: {
    id:"gusthaven", name:"Gusthaven Town", icon:"🌀", type:"city",
    desc:"A town of windmills and airships. Home to Gym Leader Zephyra, master of Wind types.",
    connections:["tempest_cliffs","route14"],
    wildMonsters:[
      {id:110, minLv:65, maxLv:70, rate:25},  // Aeolarch (final)
      {id:113, minLv:65, maxLv:70, rate:25},  // Cyclavorn (final)
      {id:115, minLv:65, maxLv:70, rate:20},  // Aetherworn (mid)
      {id:117, minLv:65, maxLv:70, rate:20},  // Pneumathos (mid)
      {id:62,  minLv:66, maxLv:70, rate:10}   // standalone
    ],
    hasGym:true, gymLeader:"zephyra", requiredBadges:12, mapPos:{x:18, y:95},
    ngPlusWildMonsters:[{id:335,minLv:71,maxLv:76,rate:25},{id:370,minLv:71,maxLv:76,rate:15}]
  },
  route14: {
    id:"route14", name:"Route 14 - Ironwork Path", icon:"⚙️", type:"route",
    desc:"A path lined with abandoned machinery. Steel types have claimed the ruins as their territory.",
    connections:["gusthaven","ash_fields"],
    wildMonsters:[
      {id:147, minLv:65, maxLv:70, rate:20},  // Ferrokin (base)
      {id:148, minLv:66, maxLv:71, rate:20},  // Adamavast (mid → after 147 ✓)
      {id:150, minLv:65, maxLv:70, rate:20},  // Gearon (base)
      {id:134, minLv:66, maxLv:71, rate:20},  // Aeronyx (base)
      {id:153, minLv:66, maxLv:71, rate:10},  // Forgekin (base)
      {id:55,  minLv:67, maxLv:72, rate:10},  // standalone steel
      {id:278, minLv:65, maxLv:70, rate:10},  // Ironling (base Steel/Fairy)
      {id:244, minLv:65, maxLv:70, rate:10},  // Staticlaw (base Electric)
      {id:280, minLv:65, maxLv:70, rate:5}    // Gearbit (base Steel/Ground)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:28, y:92},
    ngPlusWildMonsters:[{id:334,minLv:72,maxLv:78,rate:20},{id:347,minLv:72,maxLv:78,rate:15},{id:366,minLv:73,maxLv:79,rate:10}]
  },
  ironforge: {
    id:"ironforge", name:"Ironforge City", icon:"🔨", type:"city",
    desc:"A city of foundries and forges. Home to Gym Leader Ferro, master of Steel types.",
    connections:["forge_approach","route15"],
    wildMonsters:[
      {id:149, minLv:67, maxLv:72, rate:25},  // Adamovast (final)
      {id:151, minLv:66, maxLv:71, rate:20},  // Alloytron (mid)
      {id:152, minLv:67, maxLv:72, rate:20},  // Imperion (Steel/Rock)
      {id:135, minLv:67, maxLv:72, rate:20},  // Steelvex (mid, 134 on route14 ✓)
      {id:136, minLv:68, maxLv:73, rate:15}   // Ferrovast (final → after 135 ✓)
    ],
    hasGym:true, gymLeader:"ferro", requiredBadges:13, mapPos:{x:38, y:88},
    ngPlusWildMonsters:[{id:334,minLv:73,maxLv:78,rate:25},{id:347,minLv:73,maxLv:78,rate:20},{id:377,minLv:73,maxLv:79,rate:8}]
  },
  route15: {
    id:"route15", name:"Route 15 - Granite Pass", icon:"🪨", type:"route",
    desc:"A narrow mountain pass strewn with boulders. Rock types dominate.",
    connections:["ironforge","granite_tunnels"],
    wildMonsters:[
      {id:191, minLv:67, maxLv:72, rate:20},  // Petrikin (base)
      {id:192, minLv:68, maxLv:73, rate:20},  // Lithavast (mid → after 191 ✓)
      {id:193, minLv:67, maxLv:72, rate:20},  // Rugothon (base)
      {id:132, minLv:68, maxLv:73, rate:20},  // Obsidrix (base)
      {id:133, minLv:69, maxLv:74, rate:10},  // Monolithox (mid → after 132 ✓)
      {id:93,  minLv:69, maxLv:74, rate:10},  // standalone rock
      {id:251, minLv:67, maxLv:72, rate:10},  // Crumblite (base Rock/Steel)
      {id:304, minLv:67, maxLv:72, rate:10},  // Icethorn (base Rock/Ice)
      {id:232, minLv:67, maxLv:72, rate:5}    // Serphaxon (base Dragon/Ground)
    ],
    hasGym:false, requiredBadges:14, mapPos:{x:48, y:85},
    ngPlusWildMonsters:[{id:332,minLv:74,maxLv:80,rate:20},{id:349,minLv:74,maxLv:80,rate:15},{id:369,minLv:75,maxLv:81,rate:10}]
  },
  quarryville: {
    id:"quarryville", name:"Quarryville Town", icon:"🏗️", type:"city",
    desc:"A mining town carved from solid rock. Home to Gym Leader Boulder, master of Rock types.",
    connections:["crystal_mine","route16"],
    wildMonsters:[
      {id:192, minLv:68, maxLv:73, rate:20},  // Lithavast (mid)
      {id:195, minLv:69, maxLv:74, rate:20},  // Prismolith (195 on stone_plateau ✓)
      {id:196, minLv:70, maxLv:75, rate:20},  // Frigolith (mid → after 195 ✓)
      {id:133, minLv:69, maxLv:74, rate:25},  // Monolithox (mid)
      {id:92,  minLv:70, maxLv:74, rate:15}   // standalone
    ],
    hasGym:true, gymLeader:"boulder", requiredBadges:14, mapPos:{x:55, y:82},
    ngPlusWildMonsters:[{id:327,minLv:74,maxLv:80,rate:25},{id:341,minLv:74,maxLv:80,rate:15},{id:349,minLv:75,maxLv:81,rate:8}]
  },
  route16: {
    id:"route16", name:"Route 16 - Starlit Path", icon:"✨", type:"route",
    desc:"A magical path where starlight dances on every surface. Fairy types float among the luminescent flowers.",
    connections:["quarryville","nebula_gorge"],
    wildMonsters:[
      {id:137, minLv:69, maxLv:74, rate:20},  // Lumkin (base)
      {id:72,  minLv:69, maxLv:74, rate:20},  // fairy-type (base)
      {id:73,  minLv:70, maxLv:75, rate:20},  // fairy-type (evo → after 72 ✓)
      {id:142, minLv:69, maxLv:74, rate:20},  // Dawnirel (base, new)
      {id:145, minLv:70, maxLv:75, rate:15},  // Faerrin (base)
      {id:225, minLv:69, maxLv:74, rate:10},  // Glimmerkin (standalone Psy/Fairy)
      {id:226, minLv:69, maxLv:74, rate:10},  // Spectroo (base split-evo)
      {id:254, minLv:69, maxLv:74, rate:10},  // Bubblepuff (base Water/Psy)
      {id:302, minLv:69, maxLv:74, rate:5}    // Lightpuff (base Fairy, item evo)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:62, y:78},
    ngPlusWildMonsters:[{id:344,minLv:76,maxLv:82,rate:20},{id:351,minLv:76,maxLv:82,rate:15},{id:360,minLv:77,maxLv:83,rate:10}]
  },
  starbloom: {
    id:"starbloom", name:"Starbloom City", icon:"🌟", type:"city",
    desc:"A radiant city that glows with fairy magic. Home to Gym Leader Seraphina, the last gym before The Vanguard.",
    connections:["astral_plateau","victoryroad","void_rift"],
    wildMonsters:[
      {id:138, minLv:70, maxLv:75, rate:20},  // Aetherael (mid)
      {id:139, minLv:71, maxLv:76, rate:15},  // Lumiarch (final → after 138 ✓)
      {id:143, minLv:70, maxLv:75, rate:20},  // Lunarael (mid)
      {id:144, minLv:71, maxLv:76, rate:15},  // Celestarch (final → after 143 ✓)
      {id:146, minLv:71, maxLv:76, rate:20},  // Shinarith (mid, 145 on route16 ✓)
      {id:203, minLv:72, maxLv:76, rate:10},  // Arachnalis (mid)
      {id:224, minLv:72, maxLv:76, rate:10},  // Psytheon (final → 223 on cosmic_cavern ✓)
      {id:217, minLv:73, maxLv:77, rate:5}    // Mentovast (final Psychic)
    ],
    hasGym:true, gymLeader:"seraphina", requiredBadges:15, mapPos:{x:68, y:72},
    ngPlusWildMonsters:[{id:344,minLv:77,maxLv:82,rate:25},{id:351,minLv:77,maxLv:82,rate:20},{id:360,minLv:78,maxLv:83,rate:8}]
  },
  // ---- ADDITIONAL ROUTES (direction-change splits & mid-gym connectors) ----
  murk_crossing: {
    id:"murk_crossing", name:"Murk Crossing", icon:"🌫️", type:"route",
    desc:"A bog-choked crossing where the path turns south through fetid marshland. Toxic vapors hang low and Poison types lurk in every murky puddle.",
    connections:["route10","toxic_bog"],
    wildMonsters:[
      {id:155, minLv:57, maxLv:62, rate:15},  // Toxirin (base)
      {id:156, minLv:58, maxLv:63, rate:20},  // Venekon (mid → after base ✓)
      {id:158, minLv:58, maxLv:63, rate:20},  // Acidoloth (mid, base Acidelix on route10 ✓)
      {id:159, minLv:60, maxLv:65, rate:20},  // Acidovast (final → after 158 ✓)
      {id:164, minLv:58, maxLv:63, rate:15},  // Blightmite (base, new)
      {id:165, minLv:59, maxLv:64, rate:10}   // Noxoveth (mid → after 164 ✓)
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:42, y:60}
  },
  quake_foothills: {
    id:"quake_foothills", name:"Quake Foothills", icon:"🌋", type:"route",
    desc:"Rolling foothills rocked by constant tremors where Terravault's mountain range begins. Ground-type Lumori burrow through the cracked and heaving earth.",
    connections:["route11","magma_vent"],
    wildMonsters:[
      {id:95,  minLv:59, maxLv:64, rate:15},  // Dustkin (base)
      {id:96,  minLv:60, maxLv:65, rate:20},  // Seismith (mid → after 95 ✓)
      {id:98,  minLv:59, maxLv:64, rate:15},  // Aridix (base)
      {id:99,  minLv:60, maxLv:65, rate:20},  // Toxivenoth (mid → after 98 ✓)
      {id:101, minLv:59, maxLv:64, rate:15},  // Limoux (base)
      {id:102, minLv:60, maxLv:65, rate:15}   // Dunoloth (mid → after 101 ✓)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:28, y:72}
  },
  cobweb_gully: {
    id:"cobweb_gully", name:"Cobweb Gully", icon:"🕸️", type:"route",
    desc:"A sunken gully thick with silken threads where every tree and boulder is wrapped in webs. Bug types in every stage of evolution compete for territory.",
    connections:["fungal_cavern","ancient_grove"],
    wildMonsters:[
      {id:198, minLv:62, maxLv:67, rate:15},  // Chrysalix (mid, 197 on route12 ✓)
      {id:199, minLv:63, maxLv:68, rate:15},  // Aeridaleth (final → after 198 ✓)
      {id:200, minLv:61, maxLv:66, rate:15},  // Colerix (base)
      {id:201, minLv:62, maxLv:67, rate:20},  // Scarabion (mid → after 200 ✓)
      {id:204, minLv:63, maxLv:68, rate:15},  // Muddite (base)
      {id:205, minLv:64, maxLv:69, rate:20}   // Quarrix (mid → after 204 ✓)
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:15, y:82}
  },
  gale_ridge_east: {
    id:"gale_ridge_east", name:"Gale Ridge East", icon:"🌪️", type:"route",
    desc:"Where Gale Ridge curves sharply eastward, the winds reverse direction entirely. This turn is notorious for sending unprepared trainers stumbling backward toward Silkwood.",
    connections:["gale_peak","tempest_cliffs"],
    wildMonsters:[
      {id:109, minLv:64, maxLv:69, rate:15},  // Siroccomane (mid, 108 on route13 ✓)
      {id:110, minLv:65, maxLv:70, rate:20},  // Aeolarch (final → after 109 ✓)
      {id:112, minLv:64, maxLv:69, rate:15},  // Swirlavel (mid, 111 on route13 ✓)
      {id:113, minLv:65, maxLv:70, rate:20},  // Cyclavorn (final → after 112 ✓)
      {id:115, minLv:65, maxLv:70, rate:15},  // Aetherworn (mid, 114 on route13 ✓)
      {id:117, minLv:65, maxLv:70, rate:15}   // Pneumathos (mid, 116 on route13 ✓)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:14, y:95}
  },
  forge_approach: {
    id:"forge_approach", name:"Forge Approach", icon:"🔩", type:"route",
    desc:"The rusted outer edge of Ironforge's industrial sprawl. Abandoned conveyor lines and slag heaps attract Steel-type Lumori who claim the metal as their own.",
    connections:["smelter_pass","ironforge"],
    wildMonsters:[
      {id:148, minLv:66, maxLv:71, rate:20},  // Adamavast (mid)
      {id:149, minLv:67, maxLv:72, rate:15},  // Adamovast (final → after 148 ✓)
      {id:150, minLv:65, maxLv:70, rate:15},  // Gearon (base)
      {id:151, minLv:66, maxLv:71, rate:20},  // Alloytron (mid → after 150 ✓)
      {id:153, minLv:66, maxLv:71, rate:15},  // Forgekin (base)
      {id:154, minLv:67, maxLv:72, rate:15}   // Titanolith (mid → after 153 ✓)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:38, y:92}
  },
  stone_plateau: {
    id:"stone_plateau", name:"Stone Plateau", icon:"🏜️", type:"route",
    desc:"A windswept expanse of exposed bedrock leading into Quarryville. Ancient monoliths dot the plateau and Rock and Dark types claim each one as territory.",
    connections:["granite_tunnels","crystal_mine"],
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
    connections:["nebula_gorge","astral_plateau"],
    wildMonsters:[
      {id:137, minLv:69, maxLv:74, rate:15},  // Lumkin (base)
      {id:138, minLv:70, maxLv:75, rate:20},  // Aetherael (mid → after 137 ✓)
      {id:143, minLv:70, maxLv:75, rate:15},  // Lunarael (mid, 142 on route16 ✓)
      {id:144, minLv:71, maxLv:76, rate:20},  // Celestarch (final → after 143 ✓)
      {id:145, minLv:70, maxLv:75, rate:15},  // Faerrin (base)
      {id:119, minLv:70, maxLv:74, rate:10},  // Nighthound (Dark/Umbra)
      {id:222, minLv:70, maxLv:74, rate:10},  // Mindpuff (base, for Psytheon chain)
      {id:223, minLv:70, maxLv:74, rate:10},  // Cerebrix (mid → after 222 ✓)
      {id:255, minLv:71, maxLv:75, rate:10}   // Wavrix (mid → Aquapuff on route16 ✓)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:68, y:78}
  },
  void_rift: {
    id:"void_rift", name:"The Void Rift", icon:"🌀", type:"special",
    desc:"A tear in reality pulsing with dark energy near Route 16. The Umbra Order's experiments cracked open this rift, and within its swirling darkness, Voidraxis — the Void Star — awaits any trainer bold enough to enter.",
    connections:["starbloom","umbra_lab"],
    wildMonsters:[
      {id:119, minLv:72, maxLv:77, rate:30},  // Nighthound (Dark)
      {id:122, minLv:72, maxLv:77, rate:30},  // Spectrewing (Dark)
      {id:120, minLv:73, maxLv:78, rate:25},  // dark-type
      {id:131, minLv:73, maxLv:78, rate:15}   // Necrothon (Dark/Grass)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:75, y:72},
    ngPlusWildMonsters:[{id:342,minLv:78,maxLv:84,rate:20},{id:343,minLv:78,maxLv:84,rate:15},{id:352,minLv:79,maxLv:85,rate:8}]
  },
  // ---- ADDITIONAL MID-GYM ROUTES (phase 2) ----
  toxic_bog: {
    id:"toxic_bog", name:"Toxic Bog", icon:"🐸", type:"route",
    desc:"A stagnant bog where the path turns south toward Miasma City. Foul gas bubbles up through the mud and Poison types lurk beneath the surface.",
    connections:["murk_crossing","mire_depths"],
    wildMonsters:[
      {id:156, minLv:58, maxLv:63, rate:20},  // Venekon (mid)
      {id:158, minLv:58, maxLv:63, rate:20},  // Acidoloth (mid)
      {id:159, minLv:60, maxLv:65, rate:20},  // Acidovast (final)
      {id:164, minLv:58, maxLv:63, rate:20},  // Blightmite (base)
      {id:165, minLv:59, maxLv:64, rate:20}   // Noxoveth (mid → after 164 ✓)
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:42, y:63}
  },
  tremor_summit: {
    id:"tremor_summit", name:"Tremor Summit", icon:"⛰️", type:"route",
    desc:"The crest of the quake-ridden foothills where the shaking is strongest. Only final-stage Ground-type Lumori can hold their footing here.",
    connections:["quake_foothills","terravault"],
    wildMonsters:[
      {id:97,  minLv:62, maxLv:67, rate:25},  // Tectonvast (final, 96 on quake_foothills ✓)
      {id:100, minLv:62, maxLv:67, rate:25},  // Venomvast (final, 99 on quake_foothills ✓)
      {id:103, minLv:62, maxLv:67, rate:25},  // Crustvast (final, 102 on quake_foothills ✓)
      {id:105, minLv:63, maxLv:68, rate:15},  // Dravanas (final, 104 on route11 ✓)
      {id:107, minLv:63, maxLv:68, rate:10}   // Quakeon (final, 106 on route11 ✓)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:28, y:75}
  },
  gale_peak: {
    id:"gale_peak", name:"Gale Peak", icon:"🌀", type:"route",
    desc:"The westernmost tip of the region — where Gale Ridge reaches its farthest point before turning sharply east. The wind here changes direction mid-step.",
    connections:["wind_hollow","gale_ridge_east"],
    wildMonsters:[
      {id:108, minLv:63, maxLv:68, rate:15},  // Gustkin (base)
      {id:109, minLv:64, maxLv:69, rate:20},  // Siroccomane (mid → after 108 ✓)
      {id:111, minLv:63, maxLv:68, rate:15},  // Aeolin (base)
      {id:112, minLv:64, maxLv:69, rate:20},  // Swirlavel (mid → after 111 ✓)
      {id:116, minLv:64, maxLv:69, rate:15},  // Zephyrin (base)
      {id:117, minLv:65, maxLv:70, rate:15}   // Pneumathos (mid → after 116 ✓)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:7, y:96}
  },
  forge_ruins: {
    id:"forge_ruins", name:"Forge Ruins", icon:"🏚️", type:"route",
    desc:"Collapsed factory halls stretching east from the old Ironwork Path. Steel-type Lumori nest in the rusted machinery, and mid-stage chains are common sightings.",
    connections:["ash_fields","smelter_pass"],
    wildMonsters:[
      {id:147, minLv:65, maxLv:70, rate:15},  // Ferrokin (base)
      {id:148, minLv:66, maxLv:71, rate:20},  // Adamavast (mid → after 147 ✓)
      {id:150, minLv:65, maxLv:70, rate:15},  // Gearon (base)
      {id:151, minLv:66, maxLv:71, rate:20},  // Alloytron (mid → after 150 ✓)
      {id:134, minLv:66, maxLv:71, rate:15},  // Aeronyx (base)
      {id:135, minLv:67, maxLv:72, rate:15}   // Steelvex (mid → after 134 ✓)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:33, y:92}
  },

  // ---- NEW AREAS: GYMS 9-16 EXPANSION ----

  mire_depths: {
    id:"mire_depths", name:"Mire Depths", icon:"🐸", type:"route",
    desc:"A labyrinthine deep-swamp sector south of Toxic Bog. Venomous Lumori that have shed their pre-evolutions stalk the murky waterways. Umbra scouts use the miasma as cover.",
    connections:["toxic_bog","miasmacity"],
    wildMonsters:[
      {id:156, minLv:59, maxLv:64, rate:20},  // Venekon (mid, base 155 on route10 ✓)
      {id:297, minLv:58, maxLv:63, rate:20},  // Blightwing (mid → 296 Toxifly on route10 ✓) WAIT - base needs earlier
      {id:165, minLv:59, maxLv:64, rate:20},  // Noxoveth (mid, 164 on murk_crossing ✓)
      {id:296, minLv:58, maxLv:63, rate:20},  // Plaguefly (base Poi/Bug)
      {id:299, minLv:58, maxLv:63, rate:10},  // Stinglet (base Bug/Poi, also on route10)
      {id:218, minLv:59, maxLv:64, rate:10}   // Mistwraith (base Ghost/Dark, item evo)
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:41, y:67}
  },
  magma_vent: {
    id:"magma_vent", name:"Magma Vent", icon:"🌋", type:"route",
    desc:"A superheated gorge where magma seeps through rock fissures between the foothills and Tremor Summit. Ground and Fire types bask in the thermal heat.",
    connections:["quake_foothills","tremor_summit"],
    wildMonsters:[
      {id:96,  minLv:61, maxLv:66, rate:20},  // Seismith (mid, 95 on quake_foothills ✓)
      {id:99,  minLv:61, maxLv:66, rate:20},  // Toxivenoth (mid, 98 on quake_foothills ✓)
      {id:102, minLv:61, maxLv:66, rate:20},  // Dunoloth (mid, 101 on quake_foothills ✓)
      {id:248, minLv:60, maxLv:65, rate:15},  // Pebblard (base Rock, also on route11)
      {id:274, minLv:60, maxLv:65, rate:15},  // Cindling (base Fire/Rock)
      {id:312, minLv:60, maxLv:65, rate:10}   // Dunecrawl (base Ground/Dark)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:28, y:74}
  },
  fungal_cavern: {
    id:"fungal_cavern", name:"Fungal Cavern", icon:"🍄", type:"route",
    desc:"An underground cavern lit by bioluminescent fungi on the route to Cobweb Gully. Grass and Bug types thrive in the moist, glowing dark.",
    connections:["route12","cobweb_gully"],
    wildMonsters:[
      {id:197, minLv:62, maxLv:67, rate:15},  // Vermelin (base Bug)
      {id:215, minLv:62, maxLv:67, rate:20},  // Veilwisp (base Psychic)
      {id:216, minLv:63, maxLv:68, rate:15},  // Mindrift (mid → Psywisp 215 ✓)
      {id:262, minLv:62, maxLv:67, rate:20},  // Seedling (base Grass/Poi)
      {id:263, minLv:63, maxLv:68, rate:15},  // Vinrix (mid → after 262 ✓)
      {id:272, minLv:62, maxLv:67, rate:15}   // Embrix (base Fire/Dragon)
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:20, y:83}
  },
  ancient_grove: {
    id:"ancient_grove", name:"Ancient Grove", icon:"🌳", type:"route",
    desc:"A sacred forest grove of thousand-year-old trees. The air hums with ancient energy. Grass types here have evolved beyond their usual forms.",
    connections:["cobweb_gully","silkwood"],
    wildMonsters:[
      {id:221, minLv:64, maxLv:69, rate:20},  // Grimveil (mid → Hauntrix 220 on route13 ✓)
      {id:264, minLv:64, maxLv:69, rate:20},  // Thornvast (final → Vinrix 263 on fungal_cavern ✓)
      {id:199, minLv:63, maxLv:68, rate:20},  // Aeridaleth (final Bug)
      {id:265, minLv:63, maxLv:68, rate:20},  // Mosswing (standalone Grass/Bug)
      {id:273, minLv:63, maxLv:68, rate:10},  // Blazeon (mid → Embrix 272 on fungal_cavern ✓)
      {id:290, minLv:63, maxLv:68, rate:10}   // Mimiclaw (location evo cobweb_gully nearby)
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:14, y:86}
  },
  wind_hollow: {
    id:"wind_hollow", name:"Wind Hollow", icon:"🌬️", type:"route",
    desc:"A sheltered bowl between cliff faces that creates a perfect wind tunnel. Rookie Wind-type Lumori train here before ascending Gale Ridge.",
    connections:["route13","gale_peak"],
    wildMonsters:[
      {id:292, minLv:64, maxLv:69, rate:25},  // Galehorn (mid → 291 Breezekin on route13 ✓)
      {id:293, minLv:63, maxLv:68, rate:20},  // Gustpuff (base Wind)
      {id:222, minLv:63, maxLv:68, rate:20},  // Mindpuff (base Psychic)
      {id:223, minLv:64, maxLv:69, rate:15},  // Cerebrix (mid → after 222 ✓)
      {id:238, minLv:63, maxLv:68, rate:10},  // Snowble (base Ice/Wind)
      {id:284, minLv:63, maxLv:68, rate:10}   // Fluffkin (base Normal/Wind)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:8, y:93}
  },
  tempest_cliffs: {
    id:"tempest_cliffs", name:"Tempest Cliffs", icon:"⛰️", type:"route",
    desc:"Sheer cliff faces battered by perpetual gales where Gale Ridge meets Gusthaven. Only the most powerful Wind types cling to the rockface here.",
    connections:["gale_ridge_east","gusthaven"],
    wildMonsters:[
      {id:294, minLv:65, maxLv:70, rate:25},  // Stormwing (mid → 293 on gale_peak ✓)
      {id:295, minLv:66, maxLv:71, rate:15},  // Cyclonax (final → after 294 ✓)
      {id:239, minLv:65, maxLv:70, rate:20},  // Blizzariel (mid → 238 on gale_peak ✓)
      {id:240, minLv:66, maxLv:71, rate:15},  // Permafrix (final → after 239 ✓)
      {id:285, minLv:65, maxLv:70, rate:15},  // Cloudrift (mid → Fluffkin on wind_hollow ✓)
      {id:174, minLv:65, maxLv:70, rate:10}   // Scalevorn (standalone Dragon/Steel)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:16, y:97}
  },
  ash_fields: {
    id:"ash_fields", name:"Ash Fields", icon:"🏜️", type:"route",
    desc:"A barren expanse of volcanic ash fields between Gusthaven and the Forge Ruins. Fire types scorch the ashen ground, and Steel types scavenge the slag.",
    connections:["route14","forge_ruins"],
    wildMonsters:[
      {id:245, minLv:66, maxLv:71, rate:25},  // Thundravex (mid Electric → 244 ✓)
      {id:275, minLv:66, maxLv:71, rate:25},  // Infernox (mid → 274 Cindling on magma_vent ✓)
      {id:266, minLv:65, maxLv:70, rate:20},  // Shadowpup (base Dark, also route10)
      {id:267, minLv:66, maxLv:71, rate:15},  // Nightclaw (mid → after 266 ✓)
      {id:278, minLv:65, maxLv:70, rate:10},  // Ironling (base, also route14)
      {id:312, minLv:65, maxLv:70, rate:5}    // Dunecrawl (base, also magma_vent)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:30, y:90}
  },
  smelter_pass: {
    id:"smelter_pass", name:"Smelter Pass", icon:"🔥", type:"route",
    desc:"A narrow gorge between forge ruin walls where steel smelting still occurs. Metal vapors attract Steel/Fire hybrids and battle-hardened mid-evolutions.",
    connections:["forge_ruins","forge_approach"],
    wildMonsters:[
      {id:281, minLv:67, maxLv:72, rate:25},  // Cogvex (mid → 280 Gearbit on route14 ✓)
      {id:276, minLv:67, maxLv:72, rate:20},  // Scorchvast (final → Infernox on ash_fields ✓)
      {id:283, minLv:66, maxLv:71, rate:20},  // Rustpike (standalone Steel/Poi)
      {id:246, minLv:67, maxLv:72, rate:15},  // Megavolt (final → 245 on ash_fields ✓)
      {id:268, minLv:67, maxLv:72, rate:10},  // Darkfang (final Dark → 267 ✓)
      {id:307, minLv:66, maxLv:71, rate:10}   // Cinderpaw (standalone Fire/Dark)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:36, y:91}
  },
  granite_tunnels: {
    id:"granite_tunnels", name:"Granite Tunnels", icon:"⛏️", type:"route",
    desc:"Underground tunnels bored through solid granite linking Ironforge to the Stone Plateau. Rock and Dragon types nest in the crystalline formations.",
    connections:["route15","stone_plateau"],
    wildMonsters:[
      {id:249, minLv:68, maxLv:73, rate:25},  // Boulderax (mid → 248 on route11/magma_vent ✓)
      {id:305, minLv:68, maxLv:73, rate:20},  // Geoshard (mid → 304 Crysthorn on route15 ✓)
      {id:233, minLv:68, maxLv:73, rate:20},  // Serpenthorn (mid → 232 Draxon on route15 ✓)
      {id:174, minLv:68, maxLv:73, rate:15},  // Scalevorn (standalone Dragon/Steel)
      {id:251, minLv:67, maxLv:72, rate:10},  // Crumblite (base Rock/Steel, also route15)
      {id:282, minLv:68, maxLv:73, rate:10}   // Mechavast (final → Cogvex on smelter_pass ✓)
    ],
    hasGym:false, requiredBadges:14, mapPos:{x:46, y:84}
  },
  crystal_mine: {
    id:"crystal_mine", name:"Crystal Mine", icon:"💎", type:"route",
    desc:"An exhausted gem mine between Stone Plateau and Quarryville where crystalline Rock types have colonized the abandoned shafts.",
    connections:["stone_plateau","quarryville"],
    wildMonsters:[
      {id:250, minLv:70, maxLv:75, rate:20},  // Megalith (final → 249 on granite_tunnels ✓)
      {id:306, minLv:70, maxLv:75, rate:20},  // Crystallon (final → 305 on granite_tunnels ✓)
      {id:234, minLv:70, maxLv:75, rate:20},  // Wyvernak (final → 233 on granite_tunnels ✓)
      {id:237, minLv:69, maxLv:74, rate:15},  // Icevault (mid → 236 Frostick on route11 ✓)
      {id:313, minLv:69, maxLv:74, rate:15},  // Sandrix (mid → 312 Dunecrawl on magma_vent ✓)
      {id:241, minLv:70, maxLv:75, rate:10}   // Shardlix (location evo from cosmic_cavern energy)
    ],
    hasGym:false, requiredBadges:14, mapPos:{x:53, y:83}
  },
  nebula_gorge: {
    id:"nebula_gorge", name:"Nebula Gorge", icon:"🌠", type:"route",
    desc:"A star-dusted gorge where cosmic energy from nearby Starbloom saturates the air. Psychic and Fairy types commune with the starlight here.",
    connections:["route16","cosmic_cavern"],
    wildMonsters:[
      {id:254, minLv:70, maxLv:75, rate:20},  // Bubblepuff (base, also on route16)
      {id:255, minLv:71, maxLv:76, rate:20},  // Wavrix (mid → after 254 ✓)
      {id:215, minLv:70, maxLv:75, rate:15},  // Veilwisp (base Psychic)
      {id:216, minLv:71, maxLv:76, rate:15},  // Mindrift (mid → Psywisp 215 ✓)
      {id:259, minLv:70, maxLv:75, rate:15},  // Lumejell (standalone Water/Psy)
      {id:269, minLv:70, maxLv:75, rate:10},  // Grimshade (base Dark, item evo)
      {id:271, minLv:70, maxLv:75, rate:5}    // Murkrat (standalone Dark/Normal)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:64, y:76}
  },
  astral_plateau: {
    id:"astral_plateau", name:"Astral Plateau", icon:"⭐", type:"route",
    desc:"A high plateau above Cosmic Cavern where the sky seems close enough to touch. Rare Lumori shaped by cosmic energy appear here in the hours around midnight.",
    connections:["cosmic_cavern","starbloom"],
    wildMonsters:[
      {id:217, minLv:72, maxLv:77, rate:20},  // Mentovast (final Psychic)
      {id:224, minLv:72, maxLv:77, rate:20},  // Psytheon (final → 223 on cosmic_cavern ✓)
      {id:303, minLv:72, maxLv:77, rate:15},  // Lumivane (Moon Stone evo, base 302 on route16 ✓)
      {id:229, minLv:72, maxLv:77, rate:15},  // Prismolt (Thunder Stone evo, base 226 on route16 ✓)
      {id:228, minLv:72, maxLv:77, rate:10},  // Spectroon (Moon Stone evo, base 226 on route16 ✓)
      {id:309, minLv:72, maxLv:77, rate:10},  // Tidephant (Water Stone evo, base 308 → Water/Dark)
      {id:308, minLv:71, maxLv:76, rate:10}   // Seafraith (base Water/Dark)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:67, y:74}
  },

  // ============================================================
  // POST-GAME: UMBRA REMNANT RAIDS (accessible after becoming Champion)
  // ============================================================
  umbra_lab: {
    id:"umbra_lab", name:"Umbra Secret Lab", icon:"🧪", type:"special",
    desc:"A concealed laboratory carved into the cliffs near the Void Rift. Umbra scientists who fled justice still experiment here, mutating Lumori with void energy. Fire and Poison types roam the toxic corridors.",
    connections:["void_rift","shadow_archive"],
    wildMonsters:[
      {id:52,  minLv:65, maxLv:70, rate:20},
      {id:55,  minLv:65, maxLv:70, rate:20},
      {id:156, minLv:66, maxLv:71, rate:20},
      {id:159, minLv:67, maxLv:72, rate:20},
      {id:315, minLv:68, maxLv:72, rate:5}   // Ashvanus roams the vents
    ],
    hasGym:false, requiredBadges:16, requiresChampion:true,
    hasUmbraEncounter:true, mapPos:{x:81, y:69}
  },
  shadow_archive: {
    id:"shadow_archive", name:"Shadow Archive", icon:"📂", type:"special",
    desc:"Umbra's encrypted data vault hidden beneath a collapsed glacier. Ghost and Steel Lumori guard the servers that hold the organization's remaining secrets.",
    connections:["umbra_lab","void_nexus"],
    wildMonsters:[
      {id:136, minLv:68, maxLv:73, rate:20},
      {id:131, minLv:68, maxLv:73, rate:20},
      {id:133, minLv:69, maxLv:74, rate:20},
      {id:120, minLv:69, maxLv:74, rate:20},
      {id:122, minLv:70, maxLv:75, rate:20}
    ],
    hasGym:false, requiredBadges:16, requiresChampion:true,
    hasUmbraEncounter:true, mapPos:{x:86, y:73}
  },
  void_nexus: {
    id:"void_nexus", name:"Void Nexus", icon:"🌑", type:"special",
    desc:"The heart of Umbra's post-defeat operations — a nexus of void energy deep in unmapped territory. Only the strongest trainers reach this place. Ultra-rare Lumori cluster around the residual void energy.",
    connections:["shadow_archive","prismatic_rift","vaeldrian_reaches"],
    wildMonsters:[
      {id:270, minLv:72, maxLv:78, rate:20},
      {id:267, minLv:72, maxLv:78, rate:20},
      {id:269, minLv:73, maxLv:78, rate:15},
      {id:319, minLv:74, maxLv:78, rate:5},
      {id:320, minLv:74, maxLv:78, rate:5}
    ],
    hasGym:false, requiredBadges:16, requiresChampion:true,
    hasUmbraEncounter:true, mapPos:{x:83, y:79},
    ngPlusWildMonsters:[{id:345,minLv:80,maxLv:87,rate:20},{id:352,minLv:81,maxLv:87,rate:15},{id:373,minLv:82,maxLv:88,rate:8}]
  },

  // ============================================================
  // VAELDRIAN REACHES — Post-game, accessible after defeating umbra_shade
  // ============================================================
  vaeldrian_reaches: {
    id:"vaeldrian_reaches", name:"The Vaeldrian Reaches", icon:"🌀", type:"special",
    desc:"A convergence point where the boundary between Lumoria and the lost land of Vaeldris grows thin. Thirteen Wielders wait here — survivors of a world that no longer exists, each carrying a bond that outlasted their home.",
    connections:["void_nexus"],
    wildMonsters:[],
    hasGym:false, requiredBadges:16, requiresChampion:true, requiresDefeated:"umbra_shade",
    mapPos:{x:88, y:85}
  },

  // ===== NG+ EXCLUSIVE AREAS =====
  prismatic_rift: {
    id:"prismatic_rift", name:"Prismatic Rift", icon:"🌈", type:"special",
    desc:"A fracture in reality shimmering with all colours at once. Only those who have already conquered Lumoria once can perceive its existence. Lumori here have been twisted by exposure to every type simultaneously.",
    connections:["void_nexus","apex_summit"],
    wildMonsters:[
      {id:300, minLv:82, maxLv:88, rate:20},
      {id:150, minLv:83, maxLv:88, rate:15},
      {id:130, minLv:84, maxLv:90, rate:10},
      {id:310, minLv:84, maxLv:90, rate:10},
      {id:321, minLv:85, maxLv:92, rate:5},
      {id:372, minLv:84, maxLv:90, rate:10},
      {id:373, minLv:84, maxLv:90, rate:8},
      {id:374, minLv:85, maxLv:91, rate:8},
      {id:375, minLv:85, maxLv:91, rate:8},
      {id:376, minLv:85, maxLv:91, rate:7},
      {id:377, minLv:86, maxLv:92, rate:7},
      {id:378, minLv:86, maxLv:92, rate:7},
      {id:379, minLv:86, maxLv:92, rate:6},
      {id:380, minLv:87, maxLv:93, rate:5},
      {id:381, minLv:87, maxLv:93, rate:4},
      {id:403, minLv:85, maxLv:91, rate:5},
      {id:406, minLv:85, maxLv:91, rate:5}
    ],
    hasGym:false, requiredBadges:16, requiresChampion:true, requiresNGPlus:true,
    mapPos:{x:76, y:84}
  },
  apex_summit: {
    id:"apex_summit", name:"Apex Summit", icon:"⛰️", type:"special",
    desc:"The highest point in all of Lumoria, accessible only to trainers who have already stood as Champion. A legendary Lumori of pure light waits here for someone worthy of a second journey.",
    connections:["prismatic_rift"],
    wildMonsters:[
      {id:1,   minLv:85, maxLv:90, rate:20},
      {id:130, minLv:86, maxLv:92, rate:15},
      {id:321, minLv:88, maxLv:95, rate:5},
      {id:382, minLv:87, maxLv:93, rate:12},
      {id:383, minLv:87, maxLv:93, rate:10},
      {id:384, minLv:88, maxLv:94, rate:8},
      {id:385, minLv:88, maxLv:94, rate:8},
      {id:386, minLv:88, maxLv:94, rate:7},
      {id:387, minLv:89, maxLv:95, rate:6},
      {id:388, minLv:89, maxLv:95, rate:6},
      {id:389, minLv:89, maxLv:95, rate:5},
      {id:390, minLv:90, maxLv:96, rate:4},
      {id:391, minLv:90, maxLv:96, rate:4},
      {id:392, minLv:90, maxLv:96, rate:3},
      {id:393, minLv:91, maxLv:97, rate:3},
      {id:394, minLv:91, maxLv:97, rate:2},
      {id:395, minLv:91, maxLv:97, rate:2},
      {id:396, minLv:92, maxLv:98, rate:2},
      {id:397, minLv:92, maxLv:98, rate:2},
      {id:398, minLv:92, maxLv:98, rate:2},
      {id:399, minLv:93, maxLv:99, rate:1},
      {id:400, minLv:93, maxLv:99, rate:1},
      {id:401, minLv:95, maxLv:100, rate:1},
      {id:404, minLv:90, maxLv:96, rate:3},
      {id:407, minLv:90, maxLv:96, rate:3}
    ],
    hasGym:false, requiredBadges:16, requiresChampion:true, requiresNGPlus:true,
    isApexBoss:true, mapPos:{x:70, y:88}
  },

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
    teams:{
      single:[
        {monsterId:178, level:11, moves:["tackle","headbutt","growl","quick_attack"]},
        {monsterId:183, level:14, moves:["headbutt","body_slam","growl","tackle"]}
      ],
      double:[
        {monsterId:178, level:10, moves:["tackle","headbutt","growl","quick_attack"]},
        {monsterId:180, level:12, moves:["tackle","quick_attack","tail_whip","headbutt"]},
        {monsterId:183, level:14, moves:["headbutt","body_slam","growl","tackle"]}
      ],
      triple:[
        {monsterId:178, level:10, moves:["tackle","headbutt","growl","quick_attack"]},
        {monsterId:180, level:11, moves:["tackle","quick_attack","tail_whip","headbutt"]},
        {monsterId:182, level:12, moves:["headbutt","body_slam","growl","tackle"]},
        {monsterId:183, level:13, moves:["headbutt","body_slam","growl","tackle"]},
        {monsterId:185, level:13, moves:["tackle","gust","quick_attack","wing_attack"]}
      ]
    }
  },
  marina: {
    id:"marina", name:"Leader Marina", emoji:"🌊", type:"Water",
    badge:"Wave Badge", badgeEmoji:"🌊",
    quote:"The ocean is vast and powerful. Feel the force of its tides!",
    winQuote:"You truly understand the ocean's power. The Wave Badge is yours.",
    teams:{
      single:[
        {monsterId:25, level:18, moves:["water_gun","bubble_beam","harden","aqua_tail"]},
        {monsterId:5,  level:19, moves:["water_gun","aqua_tail","surf","recover"]}
      ],
      double:[
        {monsterId:28, level:17, moves:["water_gun","bubble_beam","sweet_kiss","quick_attack"]},
        {monsterId:25, level:18, moves:["water_gun","bubble_beam","harden","aqua_tail"]},
        {monsterId:193, level:19, moves:["water_gun","rock_slide","aqua_tail","harden"]},
        {monsterId:5,  level:20, moves:["water_gun","aqua_tail","surf","recover"]}
      ],
      triple:[
        {monsterId:28, level:17, moves:["water_gun","bubble_beam","sweet_kiss","quick_attack"]},
        {monsterId:25, level:18, moves:["water_gun","bubble_beam","harden","aqua_tail"]},
        {monsterId:193, level:18, moves:["water_gun","rock_slide","aqua_tail","harden"]},
        {monsterId:29, level:19, moves:["water_gun","aqua_tail","bubble_beam","dazzling_gleam"]},
        {monsterId:5,  level:20, moves:["water_gun","aqua_tail","surf","recover"]}
      ]
    }
  },
  pyros: {
    id:"pyros", name:"Leader Pyros", emoji:"🔥", type:"Fire",
    badge:"Forge Badge", badgeEmoji:"🔥",
    quote:"My fire burns hotter than any volcano! Can you withstand the heat?",
    winQuote:"Your strength is as intense as a raging wildfire. The Forge Badge is yours!",
    teams:{
      single:[
        {monsterId:16, level:22, moves:["ember","quick_attack","flamethrower","tackle"]},
        {monsterId:13, level:23, moves:["ember","headbutt","flamethrower","body_slam"]}
      ],
      double:[
        {monsterId:16, level:21, moves:["ember","quick_attack","flamethrower","tackle"]},
        {monsterId:10, level:22, moves:["ember","bug_bite","flame_fang","x_scissor"]},
        {monsterId:13, level:23, moves:["ember","headbutt","flamethrower","body_slam"]}
      ],
      triple:[
        {monsterId:16, level:21, moves:["ember","quick_attack","flamethrower","tackle"]},
        {monsterId:10, level:22, moves:["ember","bug_bite","flame_fang","x_scissor"]},
        {monsterId:17, level:22, moves:["flamethrower","dragon_claw","heat_wave","dragon_breath"]},
        {monsterId:13, level:23, moves:["ember","headbutt","flamethrower","body_slam"]}
      ]
    }
  },
  zara: {
    id:"zara", name:"Leader Zara", emoji:"⚡", type:"Electric",
    badge:"Current Badge", badgeEmoji:"⚡",
    quote:"I'll shock you senseless! Electric types are unstoppable!",
    winQuote:"You're truly electrifying! The Current Badge is yours.",
    teams:{
      single:[
        {monsterId:90, level:26, moves:["thunder_shock","wing_attack","spark","thunderbolt"]},
        {monsterId:82, level:28, moves:["thunderbolt","spark","body_slam","thunder_wave"]}
      ],
      double:[
        {monsterId:84, level:25, moves:["thunder_shock","spark","bug_bite","string_shot"]},
        {monsterId:90, level:26, moves:["thunder_shock","wing_attack","spark","thunderbolt"]},
        {monsterId:82, level:28, moves:["thunderbolt","spark","body_slam","thunder_wave"]}
      ],
      triple:[
        {monsterId:84, level:25, moves:["thunder_shock","spark","bug_bite","string_shot"]},
        {monsterId:90, level:26, moves:["thunder_shock","wing_attack","spark","thunderbolt"]},
        {monsterId:81, level:27, moves:["thunder_shock","spark","thunderbolt","quick_attack"]},
        {monsterId:82, level:28, moves:["thunderbolt","spark","body_slam","thunder_wave"]}
      ]
    }
  },
  glacier: {
    id:"glacier", name:"Leader Glacier", emoji:"❄️", type:"Ice",
    badge:"Frost Badge", badgeEmoji:"❄️",
    quote:"The cold never bothered me! But it will certainly bother you!",
    winQuote:"Your warmth has melted even my icy heart. The Frost Badge is yours.",
    teams:{
      single:[
        {monsterId:47, level:33, moves:["powder_snow","quick_attack","ice_beam","icicle_crash"]},
        {monsterId:50, level:34, moves:["powder_snow","harden","ice_beam","blizzard"]}
      ],
      double:[
        {monsterId:45, level:32, moves:["powder_snow","water_gun","ice_beam","surf"]},
        {monsterId:47, level:33, moves:["powder_snow","quick_attack","ice_beam","icicle_crash"]},
        {monsterId:50, level:34, moves:["powder_snow","harden","ice_beam","blizzard"]}
      ],
      triple:[
        {monsterId:45, level:32, moves:["powder_snow","water_gun","ice_beam","surf"]},
        {monsterId:47, level:33, moves:["powder_snow","quick_attack","ice_beam","icicle_crash"]},
        {monsterId:48, level:33, moves:["blizzard","ice_beam","surf","icicle_crash"]},
        {monsterId:50, level:34, moves:["powder_snow","harden","ice_beam","blizzard"]}
      ]
    }
  },
  nyx: {
    id:"nyx", name:"Leader Nyx", emoji:"🌑", type:"Dark",
    badge:"Dusk Badge", badgeEmoji:"🌑",
    quote:"Light cannot penetrate my darkness. Surrender to the shadow!",
    winQuote:"A light that cannot be extinguished... The Dusk Badge is yours.",
    teams:{
      single:[
        {monsterId:118, level:37, moves:["bite","quick_attack","crunch","night_slash"]},
        {monsterId:123, level:39, moves:["bite","poison_sting","crunch","shadow_ball"]}
      ],
      double:[
        {monsterId:121, level:36, moves:["bite","gust","dark_pulse","wing_attack"]},
        {monsterId:118, level:37, moves:["bite","quick_attack","crunch","night_slash"]},
        {monsterId:123, level:39, moves:["bite","poison_sting","crunch","shadow_ball"]}
      ],
      triple:[
        {monsterId:121, level:36, moves:["bite","gust","dark_pulse","wing_attack"]},
        {monsterId:118, level:37, moves:["bite","quick_attack","crunch","night_slash"]},
        {monsterId:122, level:38, moves:["dark_pulse","wing_attack","air_slash","shadow_ball"]},
        {monsterId:123, level:39, moves:["bite","poison_sting","crunch","shadow_ball"]}
      ]
    }
  },
  oracle: {
    id:"oracle", name:"Leader Oracle", emoji:"🔮", type:"Psychic",
    badge:"Foresight Badge", badgeEmoji:"🔮",
    quote:"I have foreseen your defeat. The future is already written.",
    winQuote:"Incredible. You have rewritten what I thought was fate. The Foresight Badge is yours.",
    teams:{
      single:[
        {monsterId:166, level:43, moves:["confusion","quick_attack","psybeam","recover"]},
        {monsterId:168, level:45, moves:["psybeam","dazzling_gleam","psychic_move","calm_mind"]}
      ],
      double:[
        {monsterId:167, level:42, moves:["confusion","psybeam","recover","quick_attack"]},
        {monsterId:166, level:43, moves:["confusion","quick_attack","psybeam","recover"]},
        {monsterId:142, level:43, moves:["confusion","fairy_wind","psybeam","dazzling_gleam"]},
        {monsterId:168, level:45, moves:["psybeam","dazzling_gleam","psychic_move","calm_mind"]}
      ],
      triple:[
        {monsterId:167, level:42, moves:["confusion","psybeam","recover","quick_attack"]},
        {monsterId:166, level:43, moves:["confusion","quick_attack","psybeam","recover"]},
        {monsterId:142, level:43, moves:["confusion","fairy_wind","psybeam","dazzling_gleam"]},
        {monsterId:169, level:44, moves:["confusion","psybeam","psychic_move","calm_mind"]},
        {monsterId:170, level:45, moves:["psychic_move","dark_pulse","shadow_ball","night_slash"]},
        {monsterId:168, level:45, moves:["psybeam","dazzling_gleam","psychic_move","calm_mind"]}
      ]
    }
  },
  drake: {
    id:"drake", name:"Leader Drake", emoji:"🐉", type:"Dragon",
    badge:"Wyrm Badge", badgeEmoji:"🐉",
    quote:"Dragons are the apex of all Lumori. You cannot defeat their ancient power!",
    winQuote:"You have shown the heart of a true dragon master. The Wyrm Badge is yours!",
    teams:{
      single:[
        {monsterId:172, level:48, moves:["dragon_breath","dragon_claw","headbutt","dragon_dance"]},
        {monsterId:173, level:50, moves:["dragon_claw","dragon_pulse","dragon_dance","outrage"]}
      ],
      double:[
        {monsterId:172, level:47, moves:["dragon_breath","dragon_claw","headbutt","dragon_dance"]},
        {monsterId:174, level:48, moves:["dragon_claw","iron_tail","dragon_breath","flash_cannon"]},
        {monsterId:175, level:49, moves:["water_gun","dragon_breath","surf","dragon_claw"]},
        {monsterId:173, level:50, moves:["dragon_claw","dragon_pulse","dragon_dance","outrage"]}
      ],
      triple:[
        {monsterId:172, level:47, moves:["dragon_breath","dragon_claw","headbutt","dragon_dance"]},
        {monsterId:174, level:48, moves:["dragon_claw","iron_tail","dragon_breath","flash_cannon"]},
        {monsterId:175, level:49, moves:["water_gun","dragon_breath","surf","dragon_claw"]},
        {monsterId:176, level:49, moves:["thunder_shock","dragon_breath","thunderbolt","dragon_claw"]},
        {monsterId:177, level:50, moves:["ice_beam","dragon_breath","blizzard","dragon_claw"]},
        {monsterId:173, level:50, moves:["dragon_claw","dragon_pulse","dragon_dance","outrage"]}
      ]
    }
  },
  // ---- 8 NEW GYM LEADERS (badges 8-15) ----
  thorne: {
    id:"thorne", name:"Leader Thorne", emoji:"🌿", type:"Grass",
    badge:"Canopy Badge", badgeEmoji:"🌿",
    quote:"The forest speaks to me. Let its vines entangle your hopes!",
    winQuote:"Your spirit is as resilient as ancient oak. The Canopy Badge is yours.",
    teams:{
      single:[
        {monsterId:263, level:52, moves:["vine_whip","poison_jab","energy_ball","toxic"]},
        {monsterId:9,   level:53, moves:["petal_blitz","energy_ball","moonblast","canopy_crash"]}
      ],
      double:[
        {monsterId:8,   level:51, moves:["razor_leaf","vine_whip","seed_bomb","energy_ball"]},
        {monsterId:263, level:52, moves:["vine_whip","poison_jab","energy_ball","toxic"]},
        {monsterId:264, level:52, moves:["energy_ball","toxic","sludge_bomb","petal_blitz"]},
        {monsterId:9,   level:53, moves:["petal_blitz","energy_ball","moonblast","canopy_crash"]}
      ],
      triple:[
        {monsterId:8,   level:51, moves:["razor_leaf","vine_whip","seed_bomb","energy_ball"]},
        {monsterId:263, level:52, moves:["vine_whip","poison_jab","energy_ball","toxic"]},
        {monsterId:264, level:52, moves:["energy_ball","toxic","sludge_bomb","petal_blitz"]},
        {monsterId:65,  level:52, moves:["petal_blitz","energy_ball","verdant_surge","canopy_crash"]},
        {monsterId:9,   level:53, moves:["petal_blitz","energy_ball","moonblast","canopy_crash"]}
      ]
    }
  },
  viper: {
    id:"viper", name:"Leader Viper", emoji:"☠️", type:"Poison",
    badge:"Venom Badge", badgeEmoji:"☠️",
    quote:"One drop is all it takes. My Lumori are lethal to the touch!",
    winQuote:"You survived my venom... impressive. The Venom Badge is yours.",
    teams:{
      single:[
        {monsterId:156, level:56, moves:["sludge_bomb","venoshock","toxic","acid_rain"]},
        {monsterId:158, level:57, moves:["sludge_wave","earthquake","acid_rain","toxic"]}
      ],
      double:[
        {monsterId:156, level:55, moves:["sludge_bomb","venoshock","toxic","acid_rain"]},
        {monsterId:297, level:55, moves:["sludge_bomb","air_slash","toxic","bug_buzz"]},
        {monsterId:208, level:56, moves:["sludge_bomb","dragon_pulse","venoshock","toxic"]},
        {monsterId:158, level:57, moves:["sludge_wave","earthquake","acid_rain","toxic"]}
      ],
      triple:[
        {monsterId:156, level:55, moves:["sludge_bomb","venoshock","toxic","acid_rain"]},
        {monsterId:297, level:55, moves:["sludge_bomb","air_slash","toxic","bug_buzz"]},
        {monsterId:99,  level:56, moves:["sludge_bomb","earthquake","toxic","venoshock"]},
        {monsterId:208, level:56, moves:["sludge_bomb","dragon_pulse","venoshock","toxic"]},
        {monsterId:158, level:57, moves:["sludge_wave","earthquake","acid_rain","toxic"]}
      ]
    }
  },
  atlas: {
    id:"atlas", name:"Leader Atlas", emoji:"🏔️", type:"Ground",
    badge:"Tectonic Badge", badgeEmoji:"🏔️",
    quote:"I am the earth itself. Unshakable. Unyielding. Unstoppable!",
    winQuote:"The ground trembles in respect. The Tectonic Badge is yours.",
    teams:{
      single:[
        {monsterId:96,  level:59, moves:["earthquake","rock_slide","mud_shot","stone_edge"]},
        {monsterId:54,  level:60, moves:["earthquake","blizzard","ice_beam","earth_power"]}
      ],
      double:[
        {monsterId:96,  level:58, moves:["earthquake","rock_slide","mud_shot","stone_edge"]},
        {monsterId:310, level:59, moves:["mud_shot","water_gun","earthquake","mud_bomb"]},
        {monsterId:311, level:59, moves:["surf","earthquake","earth_power","mud_shot"]},
        {monsterId:54,  level:60, moves:["earthquake","blizzard","ice_beam","earth_power"]}
      ],
      triple:[
        {monsterId:96,  level:58, moves:["earthquake","rock_slide","mud_shot","stone_edge"]},
        {monsterId:310, level:59, moves:["mud_shot","water_gun","earthquake","mud_bomb"]},
        {monsterId:311, level:59, moves:["surf","earthquake","earth_power","mud_shot"]},
        {monsterId:250, level:59, moves:["earthquake","stone_edge","rock_slide","landslide"]},
        {monsterId:54,  level:60, moves:["earthquake","blizzard","ice_beam","earth_power"]}
      ]
    }
  },
  mantis: {
    id:"mantis", name:"Leader Mantis", emoji:"🦗", type:"Bug",
    badge:"Chitin Badge", badgeEmoji:"🦗",
    quote:"Bugs are nature's perfect warriors. Swift, sharp, and relentless!",
    winQuote:"Your reflexes rival even my bugs. The Chitin Badge is yours!",
    teams:{
      single:[
        {monsterId:201, level:62, moves:["x_scissor","bug_buzz","iron_tail","mandible_crush"]},
        {monsterId:203, level:63, moves:["bug_buzz","moonblast","x_scissor","dazzling_gleam"]}
      ],
      double:[
        {monsterId:201, level:61, moves:["x_scissor","bug_buzz","iron_tail","mandible_crush"]},
        {monsterId:197, level:62, moves:["bug_bite","x_scissor","poison_sting","bug_buzz"]},
        {monsterId:299, level:62, moves:["bug_bite","poison_sting","x_scissor","toxic"]},
        {monsterId:203, level:63, moves:["bug_buzz","moonblast","x_scissor","dazzling_gleam"]}
      ],
      triple:[
        {monsterId:201, level:61, moves:["x_scissor","bug_buzz","iron_tail","mandible_crush"]},
        {monsterId:197, level:62, moves:["bug_bite","x_scissor","poison_sting","bug_buzz"]},
        {monsterId:299, level:62, moves:["bug_bite","poison_sting","x_scissor","toxic"]},
        {monsterId:300, level:62, moves:["x_scissor","sludge_bomb","toxic","bug_buzz"]},
        {monsterId:199, level:63, moves:["bug_buzz","air_slash","x_scissor","hurricane"]},
        {monsterId:203, level:63, moves:["bug_buzz","moonblast","x_scissor","dazzling_gleam"]}
      ]
    }
  },
  zephyra: {
    id:"zephyra", name:"Leader Zephyra", emoji:"🌪️", type:"Wind",
    badge:"Tempest Badge", badgeEmoji:"🌪️",
    quote:"The winds obey my command! Can you stand against the storm?",
    winQuote:"You've weathered the fiercest gale. The Tempest Badge is yours.",
    teams:{
      single:[
        {monsterId:112, level:65, moves:["hurricane","air_slash","cyclone_blade","jetstream"]},
        {monsterId:314, level:66, moves:["hurricane","thunderbolt","tempest_wrath","gale_cannon"]}
      ],
      double:[
        {monsterId:112, level:64, moves:["hurricane","air_slash","cyclone_blade","jetstream"]},
        {monsterId:294, level:65, moves:["hurricane","dragon_breath","air_slash","cyclone_blade"]},
        {monsterId:295, level:65, moves:["hurricane","dragon_claw","air_slash","cyclone_blade"]},
        {monsterId:314, level:66, moves:["hurricane","thunderbolt","tempest_wrath","gale_cannon"]}
      ],
      triple:[
        {monsterId:112, level:64, moves:["hurricane","air_slash","cyclone_blade","jetstream"]},
        {monsterId:294, level:65, moves:["hurricane","dragon_breath","air_slash","cyclone_blade"]},
        {monsterId:295, level:65, moves:["hurricane","dragon_claw","air_slash","cyclone_blade"]},
        {monsterId:186, level:65, moves:["body_slam","hurricane","air_slash","quick_attack"]},
        {monsterId:199, level:65, moves:["bug_buzz","air_slash","x_scissor","hurricane"]},
        {monsterId:314, level:66, moves:["hurricane","thunderbolt","tempest_wrath","gale_cannon"]}
      ]
    }
  },
  ferro: {
    id:"ferro", name:"Leader Ferro", emoji:"⚙️", type:"Steel",
    badge:"Alloy Badge", badgeEmoji:"⚙️",
    battleMode:"double",
    quote:"Steel is perfection. No weakness, no flaw, no mercy!",
    winQuote:"Even steel bends before your will. The Alloy Badge is yours.",
    teams:{
      single:[
        {monsterId:148, level:68, moves:["iron_tail","forge_strike","flash_cannon","crunch"]},
        {monsterId:151, level:69, moves:["tungsten_ram","flash_cannon","thunder","iron_tail"]}
      ],
      double:[
        {monsterId:148, level:67, moves:["iron_tail","forge_strike","flash_cannon","crunch"]},
        {monsterId:252, level:68, moves:["stone_edge","iron_tail","flash_cannon","rock_slide"]},
        {monsterId:279, level:68, moves:["flash_cannon","moonblast","iron_tail","dazzling_gleam"]},
        {monsterId:151, level:69, moves:["tungsten_ram","flash_cannon","thunder","iron_tail"]}
      ],
      triple:[
        {monsterId:148, level:67, moves:["iron_tail","forge_strike","flash_cannon","crunch"]},
        {monsterId:252, level:68, moves:["stone_edge","iron_tail","flash_cannon","rock_slide"]},
        {monsterId:279, level:68, moves:["flash_cannon","moonblast","iron_tail","dazzling_gleam"]},
        {monsterId:174, level:68, moves:["dragon_claw","iron_tail","dragon_breath","flash_cannon"]},
        {monsterId:151, level:69, moves:["tungsten_ram","flash_cannon","thunder","iron_tail"]}
      ]
    }
  },
  boulder: {
    id:"boulder", name:"Leader Boulder", emoji:"🪨", type:"Rock",
    badge:"Geode Badge", badgeEmoji:"🪨",
    battleMode:"double",
    quote:"Solid as stone, heavy as mountains. My Lumori are unbreakable!",
    winQuote:"You've shattered my defenses. The Geode Badge is yours.",
    teams:{
      single:[
        {monsterId:191, level:70, moves:["stone_edge","rock_slide","tackle","headbutt"]},
        {monsterId:192, level:71, moves:["earthquake","stone_edge","rock_slide","landslide"]},
        {monsterId:152, level:72, moves:["tungsten_ram","stone_edge","iron_tail","landslide"]}
      ],
      double:[
        {monsterId:191, level:70, moves:["stone_edge","rock_slide","tackle","headbutt"]},
        {monsterId:192, level:70, moves:["earthquake","stone_edge","rock_slide","landslide"]},
        {monsterId:304, level:71, moves:["crystal_lance","stone_edge","ice_beam","rock_slide"]},
        {monsterId:305, level:71, moves:["stone_edge","ice_beam","rock_slide","blizzard"]}
      ],
      triple:[
        {monsterId:191, level:70, moves:["stone_edge","rock_slide","tackle","headbutt"]},
        {monsterId:192, level:70, moves:["earthquake","stone_edge","rock_slide","landslide"]},
        {monsterId:304, level:71, moves:["crystal_lance","stone_edge","ice_beam","rock_slide"]},
        {monsterId:305, level:71, moves:["stone_edge","ice_beam","rock_slide","blizzard"]},
        {monsterId:152, level:72, moves:["tungsten_ram","stone_edge","iron_tail","landslide"]}
      ]
    }
  },
  seraphina: {
    id:"seraphina", name:"Leader Seraphina", emoji:"🧚", type:"Fairy",
    badge:"Aurora Badge", badgeEmoji:"🧚",
    battleMode:"double",
    quote:"Fairy magic is the most beautiful and the most deadly force in Lumoria!",
    winQuote:"Your heart shines brighter than any fairy light. The Aurora Badge is yours!",
    teams:{
      single:[
        {monsterId:302, level:74, moves:["moonblast","dazzling_gleam","fairy_wind","draining_kiss"]},
        {monsterId:143, level:75, moves:["moonblast","psychic_move","celestial_wave","calm_mind"]}
      ],
      double:[
        {monsterId:138, level:73, moves:["moonblast","dazzling_gleam","fairy_wind","celestial_wave"]},
        {monsterId:302, level:74, moves:["moonblast","dazzling_gleam","fairy_wind","draining_kiss"]},
        {monsterId:303, level:74, moves:["moonblast","psychic_move","dazzling_gleam","calm_mind"]},
        {monsterId:143, level:75, moves:["moonblast","psychic_move","celestial_wave","calm_mind"]}
      ],
      triple:[
        {monsterId:138, level:73, moves:["moonblast","dazzling_gleam","fairy_wind","celestial_wave"]},
        {monsterId:302, level:74, moves:["moonblast","dazzling_gleam","fairy_wind","draining_kiss"]},
        {monsterId:303, level:74, moves:["moonblast","psychic_move","dazzling_gleam","calm_mind"]},
        {monsterId:142, level:74, moves:["confusion","fairy_wind","psybeam","dazzling_gleam"]},
        {monsterId:143, level:75, moves:["moonblast","psychic_move","celestial_wave","calm_mind"]}
      ]
    }
  },
  champion: {
    id:"champion", name:"Champion Lumian", emoji:"👑", type:"Mixed",
    badge:null, badgeEmoji:"🏆",
    battleMode:"triple",
    quote:"I am Champion Lumian, master of all types and all strategies. Many have tried... none have succeeded. Show me your resolve, young trainer!",
    winQuote:"Astounding! You have defeated the Champion of Lumoria! Your name will echo through the ages! You are the new Lumoria Champion!",
    teams:{
      single:[
        {monsterId:320, level:81, moves:["thunderbolt","tungsten_ram","flash_cannon","forge_strike"]},
        {monsterId:321, level:83, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]},
        {monsterId:171, level:84, moves:["psychic_move","dragon_pulse","temporal_rift","outrage"]}
      ],
      double:[
        {monsterId:273, level:79, moves:["flamethrower","dragon_pulse","fire_blast","outrage"]},
        {monsterId:225, level:82, moves:["psychic_move","moonblast","dazzling_gleam","calm_mind"]},
        {monsterId:321, level:83, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]},
        {monsterId:171, level:84, moves:["psychic_move","dragon_pulse","temporal_rift","outrage"]}
      ],
      triple:[
        {monsterId:273, level:79, moves:["flamethrower","dragon_pulse","fire_blast","outrage"]},
        {monsterId:240, level:80, moves:["blizzard","hurricane","ice_beam","air_slash"]},
        {monsterId:189, level:81, moves:["psychic_move","body_slam","quick_attack","recover"]},
        {monsterId:190, level:82, moves:["psychic_move","moonblast","quick_attack","calm_mind"]},
        {monsterId:321, level:83, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]},
        {monsterId:171, level:84, moves:["psychic_move","dragon_pulse","temporal_rift","outrage"]}
      ]
    }
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
  potion:     { name:"Luma Vial",      emoji:"🧪", desc:"Heals 20 HP.", catchMult:0, healAmt:20,  type:"heal" },
  superPotion:{ name:"Luma Draught",emoji:"💊", desc:"Heals 50 HP.", catchMult:0, healAmt:50,  type:"heal" },
  maxPotion:  { name:"Luma Infusion",  emoji:"💉", desc:"Fully heals HP.", catchMult:0, healAmt:999, type:"heal" },
  revive:     { name:"Luma Shard",      emoji:"💫", desc:"Revives a fainted monster to 50% HP.", catchMult:0, healAmt:0, type:"revive" },
  rareCandy:  { name:"Growth Crystal",  emoji:"🍬", desc:"Instantly raises a Lumori by 1 level.", catchMult:0, healAmt:0, type:"candy" },
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
  focusSash:     { name:"Resolve Band",     emoji:"🎗️", desc:"Survive a fatal hit with 1 HP once per battle.", type:"held", held:{ effect:"focusSash" } },
  leftovers:     { name:"Food Scraps",      emoji:"🍎", desc:"Restores 1/16 max HP each turn.",            type:"held", held:{ effect:"leftovers" } },
  scopeLens:     { name:"Scope Lens",     emoji:"🔭", desc:"Increases critical hit rate.",                type:"held", held:{ effect:"critUp" } },
  quickClaw:     { name:"Swift Claw",     emoji:"⚡", desc:"30% chance to move first each turn.",        type:"held", held:{ effect:"quickClaw" } },
  // NG+-exclusive held items
  prismaticShard: { name:"Prismatic Shard", emoji:"🌈", desc:"Boosts all stats by 15% for NG+-exclusive Lumori.",       type:"held", held:{ effect:"ngPlusBoost", mult:1.15 }, requiresNGPlus:true },
  apexCore:       { name:"Apex Core",       emoji:"💠", desc:"Raises all battle stats by 10% when held by any Lumori.", type:"held", held:{ effect:"allStatsUp",  mult:1.10 }, requiresNGPlus:true },
  voidEmber:      { name:"Void Ember",      emoji:"🔮", desc:"Boosts Dark and Fire-type moves by 30% when held.",       type:"held", held:{ typeBoostDual:["Dark","Fire"], mult:1.3 }, requiresNGPlus:true },
  // Battle items
  xAttack:       { name:"Power Charge",      emoji:"⚔️", desc:"Raises Attack in battle.", catchMult:0, healAmt:0, type:"battle", battleEffect:{ stat:"atk", stages:1 } },
  xDefense:      { name:"Guard Charge",     emoji:"🛡️", desc:"Raises Defense in battle.", catchMult:0, healAmt:0, type:"battle", battleEffect:{ stat:"def", stages:1 } },
  xSpeed:        { name:"Swift Charge",       emoji:"💨", desc:"Raises Speed in battle.", catchMult:0, healAmt:0, type:"battle", battleEffect:{ stat:"spe", stages:1 } },
  // Additional held items
  poisonBarb:    { name:"Venom Thorn",   emoji:"🗡️", desc:"Boosts Poison-type moves by 20% when held.", type:"held", held:{ typeBoost:"Poison", mult:1.2 } },
  softSand:      { name:"Coarse Sand",     emoji:"🏖️", desc:"Boosts Ground-type moves by 20% when held.", type:"held", held:{ typeBoost:"Ground", mult:1.2 } },
  silverPowder:  { name:"Carapace Dust", emoji:"✨", desc:"Boosts Bug-type moves by 20% when held.", type:"held", held:{ typeBoost:"Bug", mult:1.2 } },
  metalCoat:     { name:"Iron Shell",    emoji:"🔩", desc:"Boosts Steel-type moves by 20% when held.", type:"held", held:{ typeBoost:"Steel", mult:1.2 } },
  hardStone:     { name:"Crag Shard",    emoji:"🪨", desc:"Boosts Rock-type moves by 20% when held.", type:"held", held:{ typeBoost:"Rock", mult:1.2 } },
  pixieDust:     { name:"Fairy Essence",    emoji:"🧚", desc:"Boosts Fairy-type moves by 20% when held.", type:"held", held:{ typeBoost:"Fairy", mult:1.2 } },
  blackGlasses:  { name:"Black Glasses", emoji:"🕶️", desc:"Boosts Dark-type moves by 20% when held.", type:"held", held:{ typeBoost:"Dark", mult:1.2 } },
  neverMeltIce:  { name:"Eternal Ice",emoji:"🧊", desc:"Boosts Ice-type moves by 20% when held.", type:"held", held:{ typeBoost:"Ice", mult:1.2 } },
  dragonFang:    { name:"Dragon Fang",   emoji:"🐲", desc:"Boosts Dragon-type moves by 20% when held.", type:"held", held:{ typeBoost:"Dragon", mult:1.2 } },
  shellBell:     { name:"Shell Bell",    emoji:"🔔", desc:"Restores HP equal to 1/8 of damage dealt.", type:"held", held:{ effect:"shellBell" } },
  mysticWater:   { name:"Mystic Water",  emoji:"💧", desc:"Boosts Water-type moves by 20% when held.", type:"held", held:{ typeBoost:"Water", mult:1.2 } },
  // Evolution Items
  fireStone:     { name:"Ember Shard",     emoji:"🔴", desc:"A stone radiating fiery energy. Evolves certain Lumori.", type:"evoItem" },
  waterStone:    { name:"Tide Shard",    emoji:"🔵", desc:"A stone pulsing with aquatic energy. Evolves certain Lumori.", type:"evoItem" },
  leafStone:     { name:"Grove Shard",     emoji:"🟢", desc:"A stone infused with the essence of nature. Evolves certain Lumori.", type:"evoItem" },
  thunderStone:  { name:"Storm Shard",  emoji:"🟡", desc:"A stone crackling with electric charge. Evolves certain Lumori.", type:"evoItem" },
  moonStone:     { name:"Lunar Shard",     emoji:"🌙", desc:"A stone that glows with lunar energy. Evolves certain Lumori.", type:"evoItem" },
  sunStone:      { name:"Solar Shard",      emoji:"☀️", desc:"A stone radiating solar warmth. Evolves certain Lumori.", type:"evoItem" },
  duskStone:     { name:"Twilight Shard",     emoji:"🌑", desc:"A stone steeped in twilight energy. Evolves certain Lumori.", type:"evoItem" },
  dragonScale:   { name:"Wyrm Scale",   emoji:"🐉", desc:"A scale from an ancient dragon. Evolves certain Lumori.", type:"evoItem" },
  steelCoating:  { name:"Steel Coating",  emoji:"🔩", desc:"A special metallic coating. Evolves certain Lumori.", type:"evoItem" },
  prismShard:    { name:"Prism Shard",    emoji:"💎", desc:"A shard of prismatic crystal. Evolves certain Lumori.", type:"evoItem" }
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
  mysticWater: 0,
  fireStone: 0,
  waterStone: 0,
  leafStone: 0,
  thunderStone: 0,
  moonStone: 0,
  sunStone: 0,
  duskStone: 0,
  dragonScale: 0,
  steelCoating: 0,
  prismShard: 0
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
    teams:{
      single:[
        {monsterId:81, level:13, moves:["thunder_shock","quick_attack","scratch","growl"]},
        {monsterId:187, level:15, moves:["tackle","headbutt","growl","body_slam"]}
      ],
      double:[
        {monsterId:81, level:12, moves:["thunder_shock","quick_attack","scratch","growl"]},
        {monsterId:95, level:13, moves:["mud_shot","headbutt","earthquake","body_slam"]},
        {monsterId:187, level:15, moves:["tackle","headbutt","growl","body_slam"]}
      ],
      triple:[
        {monsterId:81, level:12, moves:["thunder_shock","quick_attack","scratch","growl"]},
        {monsterId:95, level:13, moves:["mud_shot","headbutt","earthquake","body_slam"]},
        {monsterId:16, level:14, moves:["ember","quick_attack","tackle","growl"]},
        {monsterId:187, level:15, moves:["tackle","headbutt","growl","body_slam"]}
      ]
    }
  },
  rival_2: {
    id:"rival_2", name:"Rival Marcus", emoji:"🧒",
    quote:"I heard about The Umbra Order messing with the Ruins... but that's not my problem. MY problem is beating YOU!",
    winQuote:"Ugh! I need to train harder. Hey... be careful with The Umbra Order. They're dangerous.",
    triggerBadges:3,
    teams:{
      single:[
        {monsterId:82, level:30, moves:["thunderbolt","spark","body_slam","thunder_wave"]},
        {monsterId:95, level:33, moves:["mud_shot","headbutt","earthquake","body_slam"]}
      ],
      double:[
        {monsterId:82, level:30, moves:["thunderbolt","spark","body_slam","thunder_wave"]},
        {monsterId:109, level:31, moves:["thunderbolt","wing_attack","air_slash","thunder"]},
        {monsterId:95, level:33, moves:["mud_shot","headbutt","earthquake","body_slam"]}
      ],
      triple:[
        {monsterId:82, level:30, moves:["thunderbolt","spark","body_slam","thunder_wave"]},
        {monsterId:109, level:31, moves:["thunderbolt","wing_attack","air_slash","thunder"]},
        {monsterId:121, level:32, moves:["bite","gust","dark_pulse","wing_attack"]},
        {monsterId:95, level:33, moves:["mud_shot","headbutt","earthquake","body_slam"]}
      ]
    }
  },
  rival_3: {
    id:"rival_3", name:"Rival Marcus", emoji:"🧒",
    quote:"The Umbra Order tried to recruit me, can you believe that? I told them to get lost. Now I'm going to prove my strength on YOU!",
    winQuote:"You're incredible. Look... I found this near the Umbra Base. Take it - you'll need it more than me. Stop them!",
    triggerBadges:6,
    reward:{ ultraOrb:3, superPotion:3 },
    teams:{
      single:[
        {monsterId:82,  level:50, moves:["thunder","thunderbolt","dragon_dance","body_slam"]},
        {monsterId:171, level:51, moves:["psychic_move","dragon_pulse","confusion","psystrike"]},
        {monsterId:281, level:54, moves:["iron_tail","earthquake","flash_cannon","thunder"]}
      ],
      double:[
        {monsterId:82,  level:50, moves:["thunder","thunderbolt","dragon_dance","body_slam"]},
        {monsterId:171, level:51, moves:["psychic_move","dragon_pulse","confusion","psystrike"]},
        {monsterId:234, level:52, moves:["dragon_breath","earthquake","dragon_pulse","earth_power"]},
        {monsterId:281, level:54, moves:["iron_tail","earthquake","flash_cannon","thunder"]}
      ],
      triple:[
        {monsterId:82,  level:50, moves:["thunder","thunderbolt","dragon_dance","body_slam"]},
        {monsterId:171, level:51, moves:["psychic_move","dragon_pulse","confusion","psystrike"]},
        {monsterId:234, level:52, moves:["dragon_breath","earthquake","dragon_pulse","earth_power"]},
        {monsterId:109, level:52, moves:["hurricane","thunderbolt","air_slash","thunder"]},
        {monsterId:281, level:54, moves:["iron_tail","earthquake","flash_cannon","thunder"]}
      ]
    }
  },
  rival_4: {
    id:"rival_4", name:"Rival Marcus", emoji:"🧒",
    quote:"I heard a rumour — a new Umbra faction is operating in the southern routes. They've been capturing evolved Lumori. This doesn't sit right with me... but first, I need to settle things with YOU!",
    winQuote:"Incredible as always... I'll investigate those Umbra sightings. Watch your back on Routes 12 onward — something's off.",
    triggerBadges:9,
    teams:{
      single:[
        {monsterId:82,  level:62, moves:["thunder","dragon_dance","body_slam","thunderbolt"]},
        {monsterId:171, level:63, moves:["psychic_move","dragon_pulse","psystrike","calm_mind"]},
        {monsterId:282, level:65, moves:["flash_cannon","iron_tail","earthquake","thunderbolt"]}
      ],
      double:[
        {monsterId:82,  level:62, moves:["thunder","dragon_dance","body_slam","thunderbolt"]},
        {monsterId:171, level:63, moves:["psychic_move","dragon_pulse","psystrike","calm_mind"]},
        {monsterId:250, level:64, moves:["earthquake","stone_edge","rock_slide","landslide"]},
        {monsterId:282, level:65, moves:["flash_cannon","iron_tail","earthquake","thunderbolt"]},
        {monsterId:65,  level:66, moves:["petal_blitz","energy_ball","verdant_surge","canopy_crash"]}
      ],
      triple:[
        {monsterId:82,  level:62, moves:["thunder","dragon_dance","body_slam","thunderbolt"]},
        {monsterId:171, level:63, moves:["psychic_move","dragon_pulse","psystrike","calm_mind"]},
        {monsterId:250, level:64, moves:["earthquake","stone_edge","rock_slide","landslide"]},
        {monsterId:282, level:65, moves:["flash_cannon","iron_tail","earthquake","thunderbolt"]},
        {monsterId:65,  level:66, moves:["petal_blitz","energy_ball","verdant_surge","canopy_crash"]},
        {monsterId:234, level:66, moves:["dragon_breath","earthquake","dragon_pulse","earth_power"]}
      ]
    }
  },
  rival_5: {
    id:"rival_5", name:"Rival Marcus", emoji:"🧒",
    quote:"I found what The Umbra Order is after — Voidraxis, the Void Star legendary! They've opened a Void Rift near Route 16. This is serious. If you can't beat ME, you have no chance against what's waiting there!",
    winQuote:"You're ready. I've been tracking Commander Phantom — she's at the Void Rift with Voidraxis. Hurry, before they complete the ritual! Take this — you'll need it.",
    triggerBadges:14,
    reward:{ masterOrb:1, maxPotion:5 },
    teams:{
      single:[
        {monsterId:171, level:71, moves:["psystrike","dragon_pulse","temporal_rift","calm_mind"]},
        {monsterId:282, level:73, moves:["flash_cannon","thunder","tungsten_ram","anvil_drop"]},
        {monsterId:321, level:75, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]}
      ],
      double:[
        {monsterId:82,  level:70, moves:["thunder","dragon_dance","arc_flash","overcharge"]},
        {monsterId:171, level:71, moves:["psystrike","dragon_pulse","temporal_rift","calm_mind"]},
        {monsterId:250, level:72, moves:["earthquake","stone_edge","tectonic_slam","earth_power"]},
        {monsterId:282, level:73, moves:["flash_cannon","thunder","tungsten_ram","anvil_drop"]},
        {monsterId:264, level:74, moves:["petal_blitz","verdant_surge","energy_ball","toxic"]}
      ],
      triple:[
        {monsterId:82,  level:70, moves:["thunder","dragon_dance","arc_flash","overcharge"]},
        {monsterId:171, level:71, moves:["psystrike","dragon_pulse","temporal_rift","calm_mind"]},
        {monsterId:250, level:72, moves:["earthquake","stone_edge","tectonic_slam","earth_power"]},
        {monsterId:282, level:73, moves:["flash_cannon","thunder","tungsten_ram","anvil_drop"]},
        {monsterId:264, level:74, moves:["petal_blitz","verdant_surge","energy_ball","toxic"]},
        {monsterId:321, level:75, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]}
      ]
    }
  }
};

// The Umbra Order Commanders - encountered at key story locations
const UMBRA_BATTLES = {
  umbra_grunt_1: {
    id:"umbra_grunt_1", name:"Umbra Acolyte Vex", emoji:"🕶️",
    triggerLocation:"ancient_ruins",
    quote:"Halt! The Umbra Order's research must not be interrupted! The three Legendaries will be ours!",
    winQuote:"This isn't over... Commander Shade will hear about you!",
    teams:{
      single:[
        {monsterId:118, level:14, moves:["bite","quick_attack","night_slash","scratch"]},
        {monsterId:121, level:16, moves:["bite","gust","dark_pulse","wing_attack"]}
      ],
      double:[
        {monsterId:118, level:14, moves:["bite","quick_attack","night_slash","scratch"]},
        {monsterId:119, level:15, moves:["crunch","night_slash","dark_pulse","body_slam"]},
        {monsterId:121, level:16, moves:["bite","gust","dark_pulse","wing_attack"]}
      ],
      triple:[
        {monsterId:118, level:14, moves:["bite","quick_attack","night_slash","scratch"]},
        {monsterId:119, level:15, moves:["crunch","night_slash","dark_pulse","body_slam"]},
        {monsterId:121, level:16, moves:["bite","gust","dark_pulse","wing_attack"]},
        {monsterId:122, level:16, moves:["dark_pulse","wing_attack","air_slash","shadow_ball"]}
      ]
    }
  },
  umbra_grunt_2: {
    id:"umbra_grunt_2", name:"Umbra Acolyte Morta", emoji:"🕶️",
    triggerLocation:"deep_trench",
    quote:"You dare enter the Abyssal Trench? Commander Shade has claimed these waters for The Umbra Order!",
    winQuote:"The Abyssdrake... you won't stop us from finding it!",
    teams:{
      single:[
        {monsterId:122, level:22, moves:["dark_pulse","wing_attack","air_slash","shadow_ball"]},
        {monsterId:119, level:25, moves:["crunch","night_slash","dark_pulse","body_slam"]}
      ],
      double:[
        {monsterId:122, level:22, moves:["dark_pulse","wing_attack","air_slash","shadow_ball"]},
        {monsterId:157, level:23, moves:["sludge_bomb","toxic","venoshock","recover"]},
        {monsterId:119, level:25, moves:["crunch","night_slash","dark_pulse","body_slam"]}
      ],
      triple:[
        {monsterId:122, level:22, moves:["dark_pulse","wing_attack","air_slash","shadow_ball"]},
        {monsterId:157, level:23, moves:["sludge_bomb","toxic","venoshock","recover"]},
        {monsterId:119, level:25, moves:["crunch","night_slash","dark_pulse","body_slam"]},
        {monsterId:118, level:25, moves:["bite","quick_attack","crunch","night_slash"]}
      ]
    }
  },
  umbra_commander_kira: {
    id:"umbra_commander_kira", name:"Commander Kira", emoji:"😈",
    triggerLocation:"volcano_core",
    quote:"A child? Oh how entertaining. I am Kira, first commander of The Umbra Order. The volcano's power will be OURS. Stand aside or be crushed!",
    winQuote:"Impossible... I was trained by Shade himself! How can a child... Our plan is bigger than you know. Volcanox WILL awaken!",
    teams:{
      single:[
        {monsterId:14, level:36, moves:["flamethrower","rock_slide","fire_blast","body_slam"]},
        {monsterId:192, level:38, moves:["earthquake","rock_slide","stone_edge","body_slam"]}
      ],
      double:[
        {monsterId:17, level:32, moves:["flamethrower","dragon_claw","heat_wave","dragon_breath"]},
        {monsterId:99, level:33, moves:["sludge_bomb","earthquake","toxic","venoshock"]},
        {monsterId:14, level:36, moves:["flamethrower","rock_slide","fire_blast","body_slam"]},
        {monsterId:192, level:38, moves:["earthquake","rock_slide","stone_edge","body_slam"]}
      ],
      triple:[
        {monsterId:17, level:32, moves:["flamethrower","dragon_claw","heat_wave","dragon_breath"]},
        {monsterId:99, level:33, moves:["sludge_bomb","earthquake","toxic","venoshock"]},
        {monsterId:16, level:35, moves:["flamethrower","quick_attack","fire_blast","body_slam"]},
        {monsterId:14, level:36, moves:["flamethrower","rock_slide","fire_blast","body_slam"]},
        {monsterId:192, level:38, moves:["earthquake","rock_slide","stone_edge","body_slam"]}
      ]
    }
  },
  umbra_commander_rex_shadow: {
    id:"umbra_commander_rex_shadow", name:"Commander Vorn", emoji:"⚡",
    triggerLocation:"storm_plateau",
    quote:"I am Vorn, second commander of The Umbra Order. We have awakened Tempestia from the Storm Plateau. Nothing can stop our plan now!",
    winQuote:"You're more powerful than our intelligence suggested... But Commander Shade is still ahead of you. And Tempestia has been released!",
    teams:{
      single:[
        {monsterId:109, level:45, moves:["hurricane","thunderbolt","air_slash","thunder"]},
        {monsterId:151, level:49, moves:["flash_cannon","thunder","iron_tail","body_slam"]}
      ],
      double:[
        {monsterId:176, level:44, moves:["thunder","dragon_claw","dragon_pulse","dragon_breath"]},
        {monsterId:109, level:45, moves:["hurricane","thunderbolt","air_slash","thunder"]},
        {monsterId:122, level:47, moves:["shadow_ball","air_slash","hurricane","dark_pulse"]},
        {monsterId:151, level:49, moves:["flash_cannon","thunder","iron_tail","body_slam"]}
      ],
      triple:[
        {monsterId:176, level:44, moves:["thunder","dragon_claw","dragon_pulse","dragon_breath"]},
        {monsterId:109, level:45, moves:["hurricane","thunderbolt","air_slash","thunder"]},
        {monsterId:82,  level:46, moves:["thunderbolt","spark","body_slam","thunder_wave"]},
        {monsterId:122, level:47, moves:["shadow_ball","air_slash","hurricane","dark_pulse"]},
        {monsterId:151, level:49, moves:["flash_cannon","thunder","iron_tail","body_slam"]}
      ]
    }
  },
  umbra_shade: {
    id:"umbra_shade", name:"Commander Shade", emoji:"🌑",
    triggerLocation:"haunted_grove",
    quote:"So... you are the trainer who dismantled my commanders' plans. Impressive. But it ends HERE. I have awakened all three Legendaries — Tempestia, Volcanox, and Abyssdrake. With their power, The Umbra Order will control all of Lumoria! You are too late, child!",
    winQuote:"Defeated... by a trainer so young... Perhaps I misjudged the power of a trainer's bond with their Lumori. The Legendaries have retreated. Lumoria is safe... for now. You have my... grudging respect.",
    reward:{ masterOrb:1, maxPotion:5 },
    teams:{
      single:[
        {monsterId:269, level:59, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
        {monsterId:316, level:63, moves:["hydro_pump","dark_pulse","dragon_pulse","crunch"]},
        {monsterId:321, level:65, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]}
      ],
      double:[
        {monsterId:217, level:58, moves:["psychic_move","psystrike","calm_mind","recover"]},
        {monsterId:269, level:59, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
        {monsterId:270, level:60, moves:["dark_pulse","moonblast","shadow_ball","dazzling_gleam"]},
        {monsterId:314, level:62, moves:["hurricane","thunder","air_slash","dragon_dance"]},
        {monsterId:316, level:65, moves:["hydro_pump","dark_pulse","dragon_pulse","crunch"]}
      ],
      triple:[
        {monsterId:217, level:58, moves:["psychic_move","psystrike","calm_mind","recover"]},
        {monsterId:269, level:59, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
        {monsterId:270, level:60, moves:["dark_pulse","moonblast","shadow_ball","dazzling_gleam"]},
        {monsterId:321, level:61, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]},
        {monsterId:314, level:62, moves:["hurricane","thunder","air_slash","dragon_dance"]},
        {monsterId:316, level:65, moves:["hydro_pump","dark_pulse","dragon_pulse","crunch"]}
      ]
    }
  },

  // ---- POST-GYM-15 VOIDRAXIS STORYLINE ----
  umbra_phantom_grunt: {
    id:"umbra_phantom_grunt", name:"Umbra Agent Riven", emoji:"🕶️",
    quote:"Turn back, trainer! Commander Phantom has reclaimed these routes for The Umbra Order's new operation. The Void Star awakens — and its power over dark and fairy energy will be OURS!",
    winQuote:"You're stronger than I expected... but the Commander won't be stopped so easily. The Void Rift is already open!",
    teams:{
      single:[
        {monsterId:119, level:65, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
        {monsterId:267, level:66, moves:["crunch","dark_pulse","night_slash","shadow_sneak"]},
        {monsterId:125, level:68, moves:["dark_pulse","sludge_bomb","venoshock","night_slash"]}
      ],
      double:[
        {monsterId:119, level:65, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
        {monsterId:267, level:66, moves:["crunch","dark_pulse","night_slash","shadow_sneak"]},
        {monsterId:269, level:67, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
        {monsterId:125, level:68, moves:["dark_pulse","sludge_bomb","venoshock","night_slash"]}
      ],
      triple:[
        {monsterId:119, level:65, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
        {monsterId:267, level:66, moves:["crunch","dark_pulse","night_slash","shadow_sneak"]},
        {monsterId:269, level:67, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
        {monsterId:125, level:68, moves:["dark_pulse","sludge_bomb","venoshock","night_slash"]},
        {monsterId:270, level:68, moves:["dark_pulse","moonblast","shadow_ball","dazzling_gleam"]}
      ]
    }
  },
  // ---- POST-GAME REMNANT RAIDS ----
  umbra_remnant_lab: {
    id:"umbra_remnant_lab", name:"Dr. Vex Caldris", emoji:"🧪",
    triggerLocation:"umbra_lab",
    quote:"You found us? Impressive. But the Champion title doesn't intimidate science. We've been perfecting void-energy mutation since before you won your first badge. These specimens will destroy you!",
    winQuote:"Our research... ruined again... How does one child keep dismantling everything we build?",
    reward:{ ultraOrb:3, maxPotion:3 },
    teams:{
      single:[
        {monsterId:52,  level:68, moves:["flamethrower","fire_blast","overheat","smog"]},
        {monsterId:159, level:70, moves:["sludge_bomb","venoshock","gunk_shot","toxic"]},
        {monsterId:315, level:72, moves:["magma_rock","fire_blast","stone_edge","caldera_meltdown"]}
      ],
      double:[
        {monsterId:52,  level:68, moves:["flamethrower","fire_blast","overheat","smog"]},
        {monsterId:55,  level:69, moves:["fire_blast","flamethrower","heat_wave","smog"]},
        {monsterId:159, level:70, moves:["sludge_bomb","venoshock","gunk_shot","toxic"]},
        {monsterId:315, level:72, moves:["magma_rock","fire_blast","stone_edge","caldera_meltdown"]}
      ],
      triple:[
        {monsterId:52,  level:68, moves:["flamethrower","fire_blast","overheat","smog"]},
        {monsterId:55,  level:69, moves:["fire_blast","flamethrower","heat_wave","smog"]},
        {monsterId:156, level:69, moves:["venoshock","sludge_bomb","toxic","poison_fang"]},
        {monsterId:159, level:70, moves:["sludge_bomb","venoshock","gunk_shot","toxic"]},
        {monsterId:315, level:72, moves:["magma_rock","fire_blast","stone_edge","caldera_meltdown"]}
      ]
    }
  },
  umbra_remnant_archive: {
    id:"umbra_remnant_archive", name:"Archivist Nera", emoji:"📂",
    triggerLocation:"shadow_archive",
    quote:"This archive holds the sum of The Umbra Order's knowledge. I will not let it fall into the hands of some reckless Champion. The secrets here are worth more than your victory lap.",
    winQuote:"The data... it's all exposed now. Fine. Take it. Maybe someone else can finish what we started.",
    reward:{ masterOrb:1, maxPotion:4 },
    teams:{
      single:[
        {monsterId:136, level:71, moves:["flash_cannon","iron_tail","forge_strike","dark_pulse"]},
        {monsterId:133, level:73, moves:["crunch","stone_edge","shadow_ball","dark_pulse"]},
        {monsterId:320, level:75, moves:["thunder","flash_cannon","forge_strike","anvil_drop"]}
      ],
      double:[
        {monsterId:136, level:71, moves:["flash_cannon","iron_tail","forge_strike","dark_pulse"]},
        {monsterId:122, level:72, moves:["dark_pulse","air_slash","shadow_ball","wing_attack"]},
        {monsterId:133, level:73, moves:["crunch","stone_edge","shadow_ball","dark_pulse"]},
        {monsterId:320, level:75, moves:["thunder","flash_cannon","forge_strike","anvil_drop"]}
      ],
      triple:[
        {monsterId:131, level:70, moves:["shadow_ball","dark_pulse","giga_drain","energy_ball"]},
        {monsterId:136, level:71, moves:["flash_cannon","iron_tail","forge_strike","dark_pulse"]},
        {monsterId:122, level:72, moves:["dark_pulse","air_slash","shadow_ball","wing_attack"]},
        {monsterId:133, level:73, moves:["crunch","stone_edge","shadow_ball","dark_pulse"]},
        {monsterId:320, level:75, moves:["thunder","flash_cannon","forge_strike","anvil_drop"]}
      ]
    }
  },
  umbra_remnant_nexus: {
    id:"umbra_remnant_nexus", name:"Void-Master Sable", emoji:"🌑",
    triggerLocation:"void_nexus",
    quote:"So. You followed the void all the way here. I am Sable — the last true believer. While the others fled or surrendered, I stayed to master what the void offers. You are Champion of Lumoria. I am Champion of the Void. Let us settle this once and for all.",
    winQuote:"...The void does not forgive failure. Nor do I. But you — you've earned something rare: my respect. Take what you need. The Void Nexus is yours.",
    reward:{ masterOrb:2, rareCandy:5 },
    teams:{
      single:[
        {monsterId:269, level:74, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
        {monsterId:270, level:75, moves:["dark_pulse","moonblast","shadow_ball","dazzling_gleam"]},
        {monsterId:319, level:77, moves:["dark_pulse","moonblast","shadow_ball","soul_rend"]},
        {monsterId:320, level:78, moves:["thunder","flash_cannon","forge_strike","anvil_drop"]}
      ],
      double:[
        {monsterId:267, level:73, moves:["crunch","dark_pulse","night_slash","shadow_sneak"]},
        {monsterId:269, level:74, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
        {monsterId:270, level:75, moves:["dark_pulse","moonblast","shadow_ball","dazzling_gleam"]},
        {monsterId:319, level:77, moves:["dark_pulse","moonblast","shadow_ball","soul_rend"]},
        {monsterId:320, level:78, moves:["thunder","flash_cannon","forge_strike","anvil_drop"]}
      ],
      triple:[
        {monsterId:267, level:73, moves:["crunch","dark_pulse","night_slash","shadow_sneak"]},
        {monsterId:269, level:74, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
        {monsterId:270, level:75, moves:["dark_pulse","moonblast","shadow_ball","dazzling_gleam"]},
        {monsterId:125, level:75, moves:["dark_pulse","sludge_bomb","venoshock","night_slash"]},
        {monsterId:319, level:77, moves:["dark_pulse","moonblast","shadow_ball","soul_rend"]},
        {monsterId:320, level:78, moves:["thunder","flash_cannon","forge_strike","anvil_drop"]}
      ]
    }
  },
  umbra_commander_phantom: {
    id:"umbra_commander_phantom", name:"Commander Phantom", emoji:"🌌",
    quote:"A child again? How tiresome. I am Phantom, Commander of The Umbra Order's Void Division. While you were playing gym challenger, WE discovered the Void Star — Voidraxis — slumbering in the rift between light and darkness. With its power over both Dark AND Fairy energy, no one in Lumoria can resist us. Stand aside!",
    winQuote:"Impossible... Voidraxis should have responded to my call... The bond between trainer and Lumori really IS stronger than raw power. I— retreat! This isn't over, trainer. Voidraxis is still free. Find it before Umbra does!",
    teams:{
      single:[
        {monsterId:270, level:69, moves:["dark_pulse","moonblast","shadow_ball","dazzling_gleam"]},
        {monsterId:136, level:72, moves:["flash_cannon","dark_pulse","forge_strike","void_rend"]},
        {monsterId:319, level:74, moves:["dark_pulse","moonblast","shadow_ball","soul_rend"]}
      ],
      double:[
        {monsterId:269, level:68, moves:["crunch","dark_pulse","shadow_ball","night_slash"]},
        {monsterId:270, level:69, moves:["dark_pulse","moonblast","shadow_ball","dazzling_gleam"]},
        {monsterId:133, level:70, moves:["crunch","stone_edge","shadow_ball","dark_pulse"]},
        {monsterId:136, level:72, moves:["flash_cannon","dark_pulse","forge_strike","void_rend"]},
        {monsterId:319, level:74, moves:["dark_pulse","moonblast","shadow_ball","soul_rend"]}
      ],
      triple:[
        {monsterId:269, level:68, moves:["crunch","dark_pulse","shadow_ball","night_slash"]},
        {monsterId:270, level:69, moves:["dark_pulse","moonblast","shadow_ball","dazzling_gleam"]},
        {monsterId:133, level:70, moves:["crunch","stone_edge","shadow_ball","dark_pulse"]},
        {monsterId:125, level:71, moves:["dark_pulse","sludge_bomb","venoshock","night_slash"]},
        {monsterId:136, level:72, moves:["flash_cannon","dark_pulse","forge_strike","void_rend"]},
        {monsterId:319, level:74, moves:["dark_pulse","moonblast","shadow_ball","soul_rend"]}
      ]
    }
  }
};

// ============================================================
// VAELDRIS WIELDERS — 13 post-game triple battles
// Accessible after defeating umbra_shade (Commander Shade).
// NG+ scales team levels up (ngTeam arrays).
// Each battle is triple format; player brings 4 mons (3 active + 1 reserve).
// ============================================================
const VAELDRIS_WIELDERS = {
  wielder_lysara: {
    id:"wielder_lysara", name:"Lysara", emoji:"🌟", location:"vaeldrian_reaches",
    quote:"You have come this far from a land that still breathes. Show me it was worth it.",
    winQuote:"You carry something we no longer have. Hold onto it.",
    team:[
      {monsterId:408, level:98, moves:["psychic_move","air_slash","moonblast","cosmic_veil"]},
      {monsterId:409, level:99, moves:["moonblast","earth_power","dazzling_gleam","celestial_wave"]},
      {monsterId:410, level:100, moves:["flash_cannon","moonblast","alloy_edge","cosmic_veil"]}
    ],
    ngTeam:[
      {monsterId:408, level:100, moves:["psychic_move","air_slash","moonblast","cosmic_veil"]},
      {monsterId:409, level:102, moves:["moonblast","earth_power","dazzling_gleam","celestial_wave"]},
      {monsterId:410, level:105, moves:["flash_cannon","moonblast","alloy_edge","cosmic_veil"]}
    ]
  },
  wielder_morrigan: {
    id:"wielder_morrigan", name:"Morrigan", emoji:"🌑", location:"vaeldrian_reaches",
    quote:"Vaeldris burned while I watched. What will you do when everything you know is gone?",
    winQuote:"You fight like someone who still has something to lose. That used to describe me.",
    team:[
      {monsterId:411, level:98, moves:["shadow_ball","dark_pulse","void_rend","eclipse_shroud"]},
      {monsterId:412, level:99, moves:["fire_blast","sludge_wave","dark_pulse","nightmare_pulse"]},
      {monsterId:413, level:100, moves:["blizzard","psystrike","cryo_lance","veil_collapse"]}
    ],
    ngTeam:[
      {monsterId:411, level:100, moves:["shadow_ball","dark_pulse","void_rend","eclipse_shroud"]},
      {monsterId:412, level:102, moves:["fire_blast","sludge_wave","dark_pulse","nightmare_pulse"]},
      {monsterId:413, level:105, moves:["blizzard","psystrike","cryo_lance","veil_collapse"]}
    ]
  },
  wielder_kael: {
    id:"wielder_kael", name:"Kael", emoji:"⛈️", location:"vaeldrian_reaches",
    quote:"The storm was the only honest thing in Vaeldris. Let's see if you can survive honesty.",
    winQuote:"You weathered it. That's rare.",
    team:[
      {monsterId:414, level:98, moves:["thunderbolt","flash_cannon","volt_surge","overcharge"]},
      {monsterId:415, level:99, moves:["stone_edge","dragon_pulse","obsidian_crash","time_fracture"]},
      {monsterId:416, level:100, moves:["hurricane","hydro_pump","tidal_crush","time_fracture"]}
    ],
    ngTeam:[
      {monsterId:414, level:100, moves:["thunderbolt","flash_cannon","volt_surge","overcharge"]},
      {monsterId:415, level:102, moves:["stone_edge","dragon_pulse","obsidian_crash","time_fracture"]},
      {monsterId:416, level:105, moves:["hurricane","hydro_pump","tidal_crush","time_fracture"]}
    ]
  },
  wielder_thessaly: {
    id:"wielder_thessaly", name:"Thessaly", emoji:"🌿", location:"vaeldrian_reaches",
    quote:"The roots remember what the surface has forgotten. I will test whether you do too.",
    winQuote:"The land acknowledges you. That means something.",
    team:[
      {monsterId:417, level:98, moves:["seed_bomb","sludge_bomb","energy_ball","verdant_surge"]},
      {monsterId:418, level:99, moves:["stone_edge","flash_cannon","obsidian_crash","warden_strike"]},
      {monsterId:419, level:100, moves:["earthquake","earth_power","dragon_claw","mantle_surge"]}
    ],
    ngTeam:[
      {monsterId:417, level:100, moves:["seed_bomb","sludge_bomb","energy_ball","verdant_surge"]},
      {monsterId:418, level:102, moves:["stone_edge","flash_cannon","obsidian_crash","warden_strike"]},
      {monsterId:419, level:105, moves:["earthquake","earth_power","dragon_claw","mantle_surge"]}
    ]
  },
  wielder_nereus: {
    id:"wielder_nereus", name:"Nereus", emoji:"🌊", location:"vaeldrian_reaches",
    quote:"I turned back when the ocean warned me. Now I turn nothing back. Prove you can handle the deep.",
    winQuote:"The depths respect strength. So do I.",
    team:[
      {monsterId:420, level:98, moves:["surf","psychic_move","hydro_pump","telepathic_slam"]},
      {monsterId:421, level:99, moves:["crunch","venom_lance","dark_pulse","void_dominion"]},
      {monsterId:422, level:100, moves:["dragon_claw","blizzard","eon_crash","time_fracture"]}
    ],
    ngTeam:[
      {monsterId:420, level:100, moves:["surf","psychic_move","hydro_pump","telepathic_slam"]},
      {monsterId:421, level:102, moves:["crunch","venom_lance","dark_pulse","void_dominion"]},
      {monsterId:422, level:105, moves:["dragon_claw","blizzard","eon_crash","time_fracture"]}
    ]
  },
  wielder_caelia: {
    id:"wielder_caelia", name:"Caelia", emoji:"☁️", location:"vaeldrian_reaches",
    quote:"The sky doesn't care where you're from. It only cares how high you reach.",
    winQuote:"You belong up here. Not many do.",
    team:[
      {monsterId:423, level:98, moves:["moonblast","thunderbolt","dazzling_gleam","pixie_bolt"]},
      {monsterId:424, level:99, moves:["air_slash","flash_cannon","hurricane","warden_strike"]},
      {monsterId:425, level:100, moves:["hurricane","dragon_pulse","gale_cannon","time_fracture"]}
    ],
    ngTeam:[
      {monsterId:423, level:100, moves:["moonblast","thunderbolt","dazzling_gleam","pixie_bolt"]},
      {monsterId:424, level:102, moves:["air_slash","flash_cannon","hurricane","warden_strike"]},
      {monsterId:425, level:105, moves:["hurricane","dragon_pulse","gale_cannon","time_fracture"]}
    ]
  },
  wielder_dravek: {
    id:"wielder_dravek", name:"Dravek", emoji:"🔥", location:"vaeldrian_reaches",
    quote:"The forge never apologizes for the heat. Neither do I.",
    winQuote:"You didn't flinch. That's the first requirement.",
    team:[
      {monsterId:426, level:98, moves:["fire_blast","flash_cannon","solar_flare","forge_strike"]},
      {monsterId:427, level:99, moves:["dark_pulse","earth_power","obsidian_fang","void_dominion"]},
      {monsterId:428, level:100, moves:["dragon_claw","venom_lance","outrage","mantle_surge"]}
    ],
    ngTeam:[
      {monsterId:426, level:100, moves:["fire_blast","flash_cannon","solar_flare","forge_strike"]},
      {monsterId:427, level:102, moves:["dark_pulse","earth_power","obsidian_fang","void_dominion"]},
      {monsterId:428, level:105, moves:["dragon_claw","venom_lance","outrage","mantle_surge"]}
    ]
  },
  wielder_nylara: {
    id:"wielder_nylara", name:"Nylara", emoji:"❄️", location:"vaeldrian_reaches",
    quote:"The cold preserves everything that heat destroys. I have preserved much. Now let me test you.",
    winQuote:"You survived the cold. Vaeldris would have welcomed you.",
    team:[
      {monsterId:429, level:98, moves:["ice_beam","flash_cannon","alloy_edge","warden_strike"]},
      {monsterId:430, level:99, moves:["crunch","obsidian_crash","eclipse_shroud","crystal_lance"]},
      {monsterId:431, level:100, moves:["dragon_claw","moonblast","eon_crash","time_fracture"]}
    ],
    ngTeam:[
      {monsterId:429, level:100, moves:["ice_beam","flash_cannon","alloy_edge","warden_strike"]},
      {monsterId:430, level:102, moves:["crunch","obsidian_crash","eclipse_shroud","crystal_lance"]},
      {monsterId:431, level:105, moves:["dragon_claw","moonblast","eon_crash","time_fracture"]}
    ]
  },
  wielder_solenne: {
    id:"wielder_solenne", name:"Solenne", emoji:"🌙", location:"vaeldrian_reaches",
    quote:"Dreams outlast everything. Even the world that made them. What do yours contain?",
    winQuote:"You fight like you're awake. Most people never manage that.",
    team:[
      {monsterId:432, level:98, moves:["psychic_move","shadow_ball","psystrike","veil_collapse"]},
      {monsterId:433, level:99, moves:["moonblast","surf","celestial_wave","hydro_pump"]},
      {monsterId:434, level:100, moves:["dragon_pulse","thunder","draconic_roar","time_fracture"]}
    ],
    ngTeam:[
      {monsterId:432, level:100, moves:["psychic_move","shadow_ball","psystrike","veil_collapse"]},
      {monsterId:433, level:102, moves:["moonblast","surf","celestial_wave","hydro_pump"]},
      {monsterId:434, level:105, moves:["dragon_pulse","thunder","draconic_roar","time_fracture"]}
    ]
  },
  wielder_rax: {
    id:"wielder_rax", name:"Rax", emoji:"🛡️", location:"vaeldrian_reaches",
    quote:"Vaeldris had one final defense. It wasn't enough. I want to know if you would have been.",
    winQuote:"You would have been. That is the most I have ever said about anyone.",
    team:[
      {monsterId:435, level:98, moves:["iron_tail","stone_edge","obsidian_crash","warden_strike"]},
      {monsterId:436, level:99, moves:["fire_blast","dark_pulse","solar_flare","eclipse_shroud"]},
      {monsterId:437, level:100, moves:["dragon_claw","outrage","eon_crash","mantle_surge"]}
    ],
    ngTeam:[
      {monsterId:435, level:100, moves:["iron_tail","stone_edge","obsidian_crash","warden_strike"]},
      {monsterId:436, level:102, moves:["fire_blast","dark_pulse","solar_flare","eclipse_shroud"]},
      {monsterId:437, level:105, moves:["dragon_claw","outrage","eon_crash","mantle_surge"]}
    ]
  },
  wielder_tempris: {
    id:"wielder_tempris", name:"Tempris", emoji:"⚡", location:"vaeldrian_reaches",
    quote:"I have modelled every possible outcome of this battle. One of them involves you winning. Show me that one.",
    winQuote:"You were the 5.3%. I have updated my model.",
    team:[
      {monsterId:438, level:98, moves:["thunderbolt","psychic_move","volt_surge","overcharge"]},
      {monsterId:439, level:99, moves:["flash_cannon","blizzard","alloy_edge","warden_strike"]},
      {monsterId:440, level:100, moves:["dragon_pulse","verdant_surge","eon_crash","time_fracture"]}
    ],
    ngTeam:[
      {monsterId:438, level:100, moves:["thunderbolt","psychic_move","volt_surge","overcharge"]},
      {monsterId:439, level:102, moves:["flash_cannon","blizzard","alloy_edge","warden_strike"]},
      {monsterId:440, level:105, moves:["dragon_pulse","verdant_surge","eon_crash","time_fracture"]}
    ]
  },
  wielder_vayne: {
    id:"wielder_vayne", name:"Vayne", emoji:"🕳️", location:"vaeldrian_reaches",
    quote:"I have stared into the void long enough that it has started staring back. Let's see what it makes of you.",
    winQuote:"The void considered you and retreated. You should be proud.",
    team:[
      {monsterId:441, level:98, moves:["dark_pulse","earthquake","eclipse_shroud","void_dominion"]},
      {monsterId:442, level:99, moves:["psychic_move","venom_lance","psystrike","toxic_surge"]},
      {monsterId:443, level:100, moves:["dragon_claw","void_rend","outrage","void_dominion"]}
    ],
    ngTeam:[
      {monsterId:441, level:100, moves:["dark_pulse","earthquake","eclipse_shroud","void_dominion"]},
      {monsterId:442, level:102, moves:["psychic_move","venom_lance","psystrike","toxic_surge"]},
      {monsterId:443, level:105, moves:["dragon_claw","void_rend","outrage","void_dominion"]}
    ]
  },
  wielder_azura: {
    id:"wielder_azura", name:"Azura", emoji:"🌠", location:"vaeldrian_reaches",
    quote:"I read the stars and knew Vaeldris would fall three days before it happened. I read you now. I wonder what I see.",
    winQuote:"The stars said you would win. I didn't believe them. I was wrong.",
    team:[
      {monsterId:444, level:98, moves:["psychic_move","moonblast","psystrike","cosmic_veil"]},
      {monsterId:445, level:99, moves:["dragon_pulse","solar_flare","ancient_breath","time_fracture"]},
      {monsterId:446, level:100, moves:["shadow_ball","hyper_beam","void_rend","cosmic_veil"]}
    ],
    ngTeam:[
      {monsterId:444, level:100, moves:["psychic_move","moonblast","psystrike","cosmic_veil"]},
      {monsterId:445, level:102, moves:["dragon_pulse","solar_flare","ancient_breath","time_fracture"]},
      {monsterId:446, level:105, moves:["shadow_ball","hyper_beam","void_rend","cosmic_veil"]}
    ]
  }
};

// Story event text shown at key moments
const STORY_EVENTS = {
  intro: [
    "Professor Solaris: Welcome, young trainer! The Lumoria Region is a beautiful land... but dark times approach.",
    "Professor Solaris: A shadowy organization called TEAM UMBRA has been spotted near ancient sites across the region.",
    "Professor Solaris: They seek to awaken the three Legendary Lumori — Tempestia, Volcanox, and Abyssdrake.",
    "Professor Solaris: If awakened and controlled, these creatures could destroy Lumoria. You must become strong enough to stop them!",
    "Professor Solaris: Collect all 8 Gym Badges, and the power you build along the way will be your greatest weapon. Good luck!"
  ],
  after_badge_1: [
    "📰 News Flash: Strange hooded figures have been sighted near the Lumoria Jungle. Citizens are advised to be cautious.",
    "Your Rival Marcus rushes up: 'Hey! Did you hear about The Umbra Order? They were spotted at the Ancient Ruins! Be careful out there.'"
  ],
  after_badge_2: [
    "Professor Solaris calls: 'Trainer! The Umbra Order has been diving into the Abyssal Trench near Tidewatch Port. They're looking for Abyssdrake's resting place. Stop them!'"
  ],
  after_badge_3: [
    "📰 Breaking News: Tremors reported near Emberveil! Experts fear The Umbra Order is attempting to wake Volcanox in the Volcano Core.",
    "A wounded explorer stumbles to you: 'The Umbra Order... their commander Kira... she's in the Volcano Core... you must stop her!'"
  ],
  after_badge_4: [
    "Storm clouds gather unusually above the Storm Plateau...",
    "Professor Solaris: 'The storm patterns are abnormal — The Umbra Order may be attempting to awaken Tempestia! Reach the Storm Plateau before it's too late!'"
  ],
  after_badge_5: [
    "Marcus: 'Two Legendaries nearly awakened... I tried to follow The Umbra Order but they disappeared into the Mystic Forest. Their base must be there!'",
    "Professor Solaris: 'I've heard rumours of a hidden Umbra Base in the forest beyond Route 7. You must infiltrate it and confront Commander Shade!'"
  ],
  after_badge_6: [
    "Professor Solaris: 'You defeated Commander Shade! The Legendaries have retreated. But... Shade escaped. Stay vigilant.'",
    "Professor Solaris: 'The path to the Champion is now clear. Earn your final badges and face Champion Lumian. You've proven yourself a true hero of Lumoria!'"
  ],
  after_badge_9: [
    "Marcus: 'Hey! I've been seeing suspicious black-cloaked figures on the southern routes. Different from the Umbra grunts we fought before. Something new is brewing...'",
    "📰 News Flash: Trainers report unusual void-like disturbances near Route 12. Scientists are baffled by readings of overlapping Dark and Fairy energy signatures."
  ],
  after_badge_14: [
    "📰 BREAKING: A mysterious 'Void Rift' has opened near Starbloom City! Dark and Fairy energy readings are off the charts. Citizens warned to stay away from Route 16.",
    "Marcus rushes up, breathless: 'It's The Umbra Order — a new commander called Phantom! They've been working in secret since Shade was defeated. They found a new legendary, Voidraxis the Void Star, and they're trying to control it!'",
    "Professor Solaris: 'The Void Star — Voidraxis — is a legendary being of absolute dark and fairy power. If The Umbra Order binds it to their will, all of Lumoria's dark and fairy Lumori will fall under their control. You MUST stop Commander Phantom!'"
  ],
  after_badge_15: [
    "You've defeated Commander Phantom! But she escaped... and Voidraxis roams free, unbound.",
    "Marcus: 'The Void Rift is still active near Route 16. Voidraxis is unsettled — if you can face it and earn its respect, it won't be a threat anymore. It's now or never.'",
    "Professor Solaris: 'An untamed Voidraxis could destabilize the balance of dark and fairy energy across Lumoria. Face it in the Void Rift — not to destroy it, but to challenge it. A true bond can calm even the most powerful legendary!'"
  ],
  champion_defeated: [
    "🏆 CONGRATULATIONS! You have defeated Champion Lumian and become the NEW LUMORIA CHAMPION!",
    "Your deeds protecting Lumoria from The Umbra Order — twice! — will be remembered forever.",
    "Professor Solaris: 'You are extraordinary. Not just a Champion in battle, but a Champion of heart. Lumoria is safe because of you — and because of the bond you share with your Lumori!'"
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
      { itemId: "rareCandy", price: 1 },
      { itemId: "steelCoating", price: 2500 },
      { itemId: "dragonScale", price: 3000 },
      { itemId: "duskStone", price: 2000 },
      { itemId: "sunStone", price: 2000 },
      { itemId: "moonStone", price: 2000 },
      { itemId: "prismShard", price: 3000 },
      { itemId: "leafStone", price: 2000 },
      { itemId: "waterStone", price: 2000 },
      { itemId: "fireStone", price: 2000 }
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
      { itemId: "thunderStone", price: 2000 },
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
  },
  void_rift: {
    name: "Rift Outpost (NG+ Shop)",
    items: [
      { itemId: "ultraOrb",      price: 600 },
      { itemId: "masterOrb",     price: 50000 },
      { itemId: "maxPotion",     price: 500 },
      { itemId: "revive",        price: 500 },
      { itemId: "rareCandy",     price: 1 },
      { itemId: "prismaticShard",price: 12000 },
      { itemId: "apexCore",      price: 15000 },
      { itemId: "voidEmber",     price: 10000 }
    ]
  },
  apex_summit: {
    name: "Summit Vault (NG+ Shop)",
    items: [
      { itemId: "ultraOrb",      price: 600 },
      { itemId: "masterOrb",     price: 50000 },
      { itemId: "maxPotion",     price: 500 },
      { itemId: "revive",        price: 500 },
      { itemId: "rareCandy",     price: 1 },
      { itemId: "prismaticShard",price: 12000 },
      { itemId: "apexCore",      price: 15000 },
      { itemId: "voidEmber",     price: 10000 }
    ]
  }
};

// ============================================================
// ELITE FOUR (themed, NOT monotype)
// ============================================================
const ELITE_FOUR = [
  {
    id: "aria", name: "Elite Aria", emoji: "🎵", theme: "Graceful Offense",
    quote: "My Lumori dance through battle like a symphony. Can you keep up with the tempo?",
    winQuote: "A beautiful performance... You've earned my respect.",
    teams: {
      single: [
        { monsterId: 109, level: 75, moves: ["hurricane", "air_slash", "moonblast", "jetstream"] },
        { monsterId: 303, level: 77, moves: ["moonblast", "psychic_move", "dazzling_gleam", "celestial_wave"] },
        { monsterId: 117, level: 77, moves: ["psychic_move", "hurricane", "cyclone_blade", "calm_mind"] }
      ],
      double: [
        { monsterId: 143, level: 75, moves: ["moonblast", "psychic_move", "dazzling_gleam", "calm_mind"] },
        { monsterId: 109, level: 75, moves: ["hurricane", "air_slash", "moonblast", "jetstream"] },
        { monsterId: 224, level: 76, moves: ["psychic_move", "moonblast", "dazzling_gleam", "calm_mind"] },
        { monsterId: 303, level: 77, moves: ["moonblast", "psychic_move", "dazzling_gleam", "celestial_wave"] },
        { monsterId: 117, level: 77, moves: ["psychic_move", "hurricane", "cyclone_blade", "calm_mind"] }
      ],
      triple: [
        { monsterId: 143, level: 75, moves: ["moonblast", "psychic_move", "dazzling_gleam", "calm_mind"] },
        { monsterId: 109, level: 75, moves: ["hurricane", "air_slash", "moonblast", "jetstream"] },
        { monsterId: 224, level: 76, moves: ["psychic_move", "moonblast", "dazzling_gleam", "calm_mind"] },
        { monsterId: 303, level: 77, moves: ["moonblast", "psychic_move", "dazzling_gleam", "celestial_wave"] },
        { monsterId: 117, level: 77, moves: ["psychic_move", "hurricane", "cyclone_blade", "calm_mind"] },
        { monsterId: 138, level: 77, moves: ["moonblast", "dazzling_gleam", "fairy_wind", "celestial_wave"] }
      ]
    }
  },
  {
    id: "grimshaw", name: "Elite Grimshaw", emoji: "💀", theme: "Brutal Power",
    quote: "I don't do finesse. I crush. I break. I win.",
    winQuote: "Tch... You hit harder than I expected. Fine, you pass.",
    teams: {
      single: [
        { monsterId: 312, level: 76, moves: ["earthquake", "dark_pulse", "crunch", "sand_tomb"] },
        { monsterId: 148, level: 78, moves: ["iron_tail", "crunch", "flash_cannon", "forge_strike"] },
        { monsterId: 213, level: 78, moves: ["outrage", "dragon_pulse", "fire_blast", "dragon_dance"] }
      ],
      double: [
        { monsterId: 123, level: 76, moves: ["crunch", "sludge_bomb", "dark_pulse", "poison_sting"] },
        { monsterId: 312, level: 76, moves: ["earthquake", "dark_pulse", "crunch", "sand_tomb"] },
        { monsterId: 208, level: 77, moves: ["sludge_wave", "dragon_pulse", "venoshock", "toxic"] },
        { monsterId: 148, level: 78, moves: ["iron_tail", "crunch", "flash_cannon", "forge_strike"] },
        { monsterId: 213, level: 78, moves: ["outrage", "dragon_pulse", "fire_blast", "dragon_dance"] }
      ],
      triple: [
        { monsterId: 123, level: 76, moves: ["crunch", "sludge_bomb", "dark_pulse", "poison_sting"] },
        { monsterId: 312, level: 76, moves: ["earthquake", "dark_pulse", "crunch", "sand_tomb"] },
        { monsterId: 208, level: 77, moves: ["sludge_wave", "dragon_pulse", "venoshock", "toxic"] },
        { monsterId: 148, level: 78, moves: ["iron_tail", "crunch", "flash_cannon", "forge_strike"] },
        { monsterId: 213, level: 78, moves: ["outrage", "dragon_pulse", "fire_blast", "dragon_dance"] },
        { monsterId: 133, level: 78, moves: ["crunch", "stone_edge", "shadow_ball", "dark_pulse"] }
      ]
    }
  },
  {
    id: "celeste", name: "Elite Celeste", emoji: "✨", theme: "Cosmic Balance",
    quote: "The stars have aligned for this battle. Let us see what fate decrees.",
    winQuote: "The cosmos acknowledges your strength. Proceed, champion-to-be.",
    teams: {
      single: [
        { monsterId: 48,  level: 77, moves: ["blizzard", "ice_beam", "surf", "icicle_crash"] },
        { monsterId: 229, level: 78, moves: ["thunderbolt", "psychic_move", "thunder", "calm_mind"] },
        { monsterId: 3,   level: 79, moves: ["flamethrower", "dragon_claw", "heat_wave", "outrage"] }
      ],
      double: [
        { monsterId: 168, level: 77, moves: ["psychic_move", "dazzling_gleam", "moonblast", "calm_mind"] },
        { monsterId: 48,  level: 77, moves: ["blizzard", "ice_beam", "surf", "icicle_crash"] },
        { monsterId: 229, level: 78, moves: ["thunderbolt", "psychic_move", "thunder", "calm_mind"] },
        { monsterId: 3,   level: 79, moves: ["flamethrower", "dragon_claw", "heat_wave", "outrage"] },
        { monsterId: 241, level: 79, moves: ["ice_beam", "psychic_move", "blizzard", "calm_mind"] }
      ],
      triple: [
        { monsterId: 168, level: 77, moves: ["psychic_move", "dazzling_gleam", "moonblast", "calm_mind"] },
        { monsterId: 48,  level: 77, moves: ["blizzard", "ice_beam", "surf", "icicle_crash"] },
        { monsterId: 229, level: 78, moves: ["thunderbolt", "psychic_move", "thunder", "calm_mind"] },
        { monsterId: 3,   level: 79, moves: ["flamethrower", "dragon_claw", "heat_wave", "outrage"] },
        { monsterId: 241, level: 79, moves: ["ice_beam", "psychic_move", "blizzard", "calm_mind"] },
        { monsterId: 170, level: 79, moves: ["psychic_move", "dark_pulse", "shadow_ball", "night_slash"] }
      ]
    }
  },
  {
    id: "titan", name: "Elite Titan", emoji: "🏔️", theme: "Immovable Fortress",
    quote: "I am the mountain. I am the wall. You shall not pass.",
    winQuote: "The mountain crumbles... You have the strength of a titan yourself.",
    teams: {
      single: [
        { monsterId: 152, level: 78, moves: ["tungsten_ram", "stone_edge", "iron_tail", "flash_cannon"] },
        { monsterId: 54,  level: 79, moves: ["blizzard", "earthquake", "ice_beam", "earth_power"] },
        { monsterId: 237, level: 80, moves: ["ice_beam", "stone_edge", "blizzard", "crystal_lance"] }
      ],
      double: [
        { monsterId: 195, level: 77, moves: ["stone_edge", "crystal_lance", "landslide", "rock_slide"] },
        { monsterId: 152, level: 78, moves: ["tungsten_ram", "stone_edge", "iron_tail", "flash_cannon"] },
        { monsterId: 54,  level: 79, moves: ["blizzard", "earthquake", "ice_beam", "earth_power"] },
        { monsterId: 251, level: 79, moves: ["stone_edge", "iron_tail", "flash_cannon", "rock_slide"] },
        { monsterId: 237, level: 80, moves: ["ice_beam", "stone_edge", "blizzard", "crystal_lance"] }
      ],
      triple: [
        { monsterId: 195, level: 77, moves: ["stone_edge", "crystal_lance", "landslide", "rock_slide"] },
        { monsterId: 152, level: 78, moves: ["tungsten_ram", "stone_edge", "iron_tail", "flash_cannon"] },
        { monsterId: 54,  level: 79, moves: ["blizzard", "earthquake", "ice_beam", "earth_power"] },
        { monsterId: 251, level: 79, moves: ["stone_edge", "iron_tail", "flash_cannon", "rock_slide"] },
        { monsterId: 237, level: 80, moves: ["ice_beam", "stone_edge", "blizzard", "crystal_lance"] },
        { monsterId: 192, level: 80, moves: ["earthquake", "stone_edge", "rock_slide", "landslide"] }
      ]
    }
  }
];

// ============================================================
// LEVEL CAPS - Player team levels are capped in major battles
// ============================================================
const LEVEL_CAPS = {
  // Gym Leaders: cap = highest team member level + 2
  rex: 16, marina: 19, pyros: 23, zara: 28,
  glacier: 34, nyx: 39, oracle: 45, drake: 50,
  thorne: 53, viper: 57, atlas: 60, mantis: 63,
  zephyra: 66, ferro: 69, boulder: 72, seraphina: 75,
  // The Vanguard
  aria: 77, grimshaw: 78, celeste: 79, titan: 80,
  // Champion
  champion: 84,
  // Rival battles
  rival_1: 17, rival_2: 35, rival_3: 56,
  rival_4: 68, rival_5: 77,
  // The Umbra Order bosses
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
  { id:"q1", title:"First Steps", desc:"Defeat 3 wild Lumori on Route 1 to prove your mettle.", location:"route1", type:"boss", requiredBadges:0,
    boss:{monsterId:181, level:8, moves:["tackle","headbutt","growl","quick_attack"]},
    reward:{type:"item", itemId:"potion", qty:5}, rewardText:"5 Luma Vials" },
  { id:"q2", title:"Seedvale's Lost Pet", desc:"A child in Seedvale lost their Pudgeling. Find and defeat the wild one on Route 1.", location:"route1", type:"boss", requiredBadges:0,
    boss:{monsterId:185, level:7, moves:["tackle","gust","growl","wing_attack"]},
    reward:{type:"item", itemId:"greatOrb", qty:3}, rewardText:"3 Great Orbs" },
  { id:"q3", title:"Bug Catcher's Challenge", desc:"A bug catcher on Route 1 challenges you to battle his prized Caterpet!", location:"route1", type:"boss", requiredBadges:0,
    boss:{monsterId:198, level:10, moves:["bug_bite","string_shot","tackle","harden"]},
    reward:{type:"money", amount:500}, rewardText:"500 coins" },
  { id:"q4", title:"Meadow Guardian", desc:"A powerful Bushbear guards the meadow clearing. Defeat it!", location:"route1", type:"boss", requiredBadges:0,
    boss:{monsterId:70, level:12, moves:["vine_whip","tackle","razor_leaf","growl"]},
    reward:{type:"item", itemId:"miracleSeed", qty:1}, rewardText:"Miracle Seed" },
  { id:"q5", title:"Professor's Errand", desc:"Visit Ashford City to deliver a package for Professor Solaris.", location:"ashford", type:"visit", requiredBadges:0,
    reward:{type:"money", amount:300}, rewardText:"300 coins" },
  { id:"q6", title:"Night Prowler", desc:"A mysterious dark Lumori has been spotted on Route 1 at night. Defeat it!", location:"route1", type:"boss", requiredBadges:1,
    boss:{monsterId:118, level:15, moves:["bite","quick_attack","night_slash","growl"]},
    reward:{type:"item", itemId:"blackGlasses", qty:1}, rewardText:"Black Glasses" },
  { id:"q7", title:"Fairy Ring Mystery", desc:"Strange lights glow in Fairy Meadow. Investigate by defeating the guardian.", location:"fairy_meadow_south", type:"boss", requiredBadges:0,
    boss:{monsterId:60, level:10, moves:["fairy_wind","tackle","sweet_kiss","quick_attack"]},
    reward:{type:"item", itemId:"pixieDust", qty:1}, rewardText:"Fairy Essence" },
  { id:"q8", title:"The Stubborn Sproutling", desc:"A giant Sproutling blocks the path! Battle it to clear the way.", location:"route1", type:"boss", requiredBadges:0,
    boss:{monsterId:7, level:11, moves:["vine_whip","tackle","razor_leaf","sleep_powder"]},
    reward:{type:"item", itemId:"potion", qty:3}, rewardText:"3 Luma Vials" },
  { id:"q9", title:"Route 1 Champion", desc:"Become the undisputed champion of Route 1 by defeating the alpha!", location:"route1", type:"boss", requiredBadges:1,
    boss:{monsterId:179, level:18, moves:["headbutt","body_slam","quick_attack","hyper_beam"]},
    reward:{type:"money", amount:1000}, rewardText:"1000 coins" },
  { id:"q10", title:"Ashford Arena Amateur", desc:"Win the Ashford amateur tournament!", location:"ashford", type:"boss", requiredBadges:1,
    boss:{monsterId:183, level:16, moves:["body_slam","headbutt","quick_attack","hyper_beam"]},
    reward:{type:"item", itemId:"superPotion", qty:3}, rewardText:"3 Luma Draughts" },

  // ---- TIDEWATCH & WATER AREAS (11-20) ----
  { id:"q11", title:"Tidewatch Fisherman", desc:"A fisherman challenges you with his strongest Water Lumori!", location:"tidewatch", type:"boss", requiredBadges:1,
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
  { id:"q17", title:"Ancient Ruins Scholar", desc:"A scholar needs help clearing Lumori from the Ancient Ruins.", location:"ancient_ruins", type:"boss", requiredBadges:1,
    boss:{monsterId:166, level:22, moves:["confusion","psybeam","quick_attack","recover"]},
    reward:{type:"money", amount:1200}, rewardText:"1200 coins" },
  { id:"q18", title:"Tidal Wave Warning", desc:"A rogue Water Lumori threatens Tidewatch harbor!", location:"tidewatch", type:"boss", requiredBadges:2,
    boss:{monsterId:39, level:28, moves:["surf","hurricane","aqua_tail","wing_attack"]},
    reward:{type:"item", itemId:"revive", qty:3}, rewardText:"3 Luma Shards" },
  { id:"q19", title:"Pearl Diver", desc:"Dive for pearls in the Coral Reef, but beware the guardian!", location:"coral_reef", type:"boss", requiredBadges:2,
    boss:{monsterId:34, level:26, moves:["dazzling_gleam","surf","fairy_wind","bubble_beam"]},
    reward:{type:"money", amount:2000}, rewardText:"2000 coins" },
  { id:"q20", title:"Route 2 Ranger", desc:"The Route 2 ranger needs help with an aggressive wild Lumori.", location:"route2", type:"boss", requiredBadges:1,
    boss:{monsterId:8, level:18, moves:["razor_leaf","vine_whip","poison_sting","body_slam"]},
    reward:{type:"item", itemId:"superPotion", qty:5}, rewardText:"5 Luma Draughts" },

  // ---- EMBERVEIL & FIRE AREAS (21-30) ----
  { id:"q21", title:"Volcanic Challenge", desc:"Brave the Volcano Core and defeat its fiery guardian!", location:"volcano_core", type:"boss", requiredBadges:3,
    boss:{monsterId:20, level:35, moves:["flamethrower","earthquake","fire_blast","earth_power"]},
    reward:{type:"item", itemId:"charcoal", qty:1}, rewardText:"Charcoal" },
  { id:"q22", title:"Lava Fields Survivor", desc:"Cross the Lava Fields and defeat the alpha fire Lumori.", location:"lava_fields", type:"boss", requiredBadges:3,
    boss:{monsterId:13, level:34, moves:["flamethrower","body_slam","heat_wave","fire_blast"]},
    reward:{type:"money", amount:2500}, rewardText:"2500 coins" },
  { id:"q23", title:"Emberveil Forge Master", desc:"The Forge Master tests trainers with his strongest Lumori.", location:"emberveil", type:"boss", requiredBadges:2,
    boss:{monsterId:16, level:30, moves:["flamethrower","quick_attack","heat_wave","fire_blast"]},
    reward:{type:"item", itemId:"maxPotion", qty:3}, rewardText:"3 Luma Infusions" },
  { id:"q24", title:"Cinder Mole Hunt", desc:"A rare Cindermole has been spotted in the Lava Fields!", location:"lava_fields", type:"boss", requiredBadges:3,
    boss:{monsterId:19, level:32, moves:["flamethrower","earthquake","mud_shot","ember"]},
    reward:{type:"item", itemId:"softSand", qty:1}, rewardText:"Coarse Sand" },
  { id:"q25", title:"Iron Canyon Explorer", desc:"Explore the treacherous Iron Canyon and defeat its sentinel.", location:"iron_canyon", type:"boss", requiredBadges:3,
    boss:{monsterId:148, level:34, moves:["iron_tail","crunch","flash_cannon","metal_claw"]},
    reward:{type:"item", itemId:"metalCoat", qty:1}, rewardText:"Iron Shell" },
  { id:"q26", title:"Route 3 Gauntlet", desc:"Run the Route 3 trainer gauntlet and face the final boss!", location:"route3", type:"boss", requiredBadges:2,
    boss:{monsterId:26, level:26, moves:["surf","rock_slide","aqua_tail","headbutt"]},
    reward:{type:"money", amount:1500}, rewardText:"1500 coins" },
  { id:"q27", title:"Fire Dance Festival", desc:"Win the Emberveil Fire Dance Festival battle tournament!", location:"emberveil", type:"boss", requiredBadges:3,
    boss:{monsterId:11, level:32, moves:["flamethrower","wing_attack","air_slash","heat_wave"]},
    reward:{type:"item", itemId:"xAttack", qty:5}, rewardText:"5 Power Charges" },
  { id:"q28", title:"Molten Core Mystery", desc:"Strange energy readings in the Volcano Core need investigation.", location:"volcano_core", type:"boss", requiredBadges:3,
    boss:{monsterId:14, level:36, moves:["flamethrower","rock_slide","earthquake","fire_blast"]},
    reward:{type:"money", amount:3000}, rewardText:"3000 coins" },
  { id:"q29", title:"The Scorched Path", desc:"Clear the scorched path through Route 4 from aggressive Lumori.", location:"route4", type:"boss", requiredBadges:3,
    boss:{monsterId:99, level:34, moves:["earthquake","poison_sting","venoshock","mud_shot"]},
    reward:{type:"item", itemId:"revive", qty:3}, rewardText:"3 Luma Shards" },
  { id:"q30", title:"Ember Guardian", desc:"The legendary ember guardian protects Emberveil's sacred flame.", location:"emberveil", type:"boss", requiredBadges:3,
    boss:{monsterId:3, level:38, moves:["flamethrower","dragon_claw","heat_wave","outrage"]},
    reward:{type:"item", itemId:"dragonFang", qty:1}, rewardText:"Dragon Fang" },

  // ---- SPARKMOOR & ELECTRIC AREAS (31-40) ----
  { id:"q31", title:"Static Shock", desc:"A dangerously charged Lumori terrorizes Sparkmoor. Stop it!", location:"sparkmoor", type:"boss", requiredBadges:3,
    boss:{monsterId:82, level:36, moves:["thunderbolt","spark","thunder_wave","body_slam"]},
    reward:{type:"item", itemId:"magnet", qty:1}, rewardText:"Magnet" },
  { id:"q32", title:"Thunder Cliffs Dare", desc:"Scale the Thunder Cliffs and face the storm beast!", location:"thunder_cliffs", type:"boss", requiredBadges:4,
    boss:{monsterId:92, level:40, moves:["thunderbolt","rock_slide","stone_edge","spark"]},
    reward:{type:"money", amount:3500}, rewardText:"3500 coins" },
  { id:"q33", title:"Power Plant Breach", desc:"Wild Electric Lumori have breached the Sparkmoor power plant!", location:"sparkmoor", type:"boss", requiredBadges:3,
    boss:{monsterId:85, level:35, moves:["thunderbolt","bug_buzz","spark","x_scissor"]},
    reward:{type:"item", itemId:"ultraOrb", qty:3}, rewardText:"3 Ultra Orbs" },
  { id:"q34", title:"Route 4 Blockade", desc:"A stubborn Ground Lumori blocks Route 4. Move it!", location:"route4", type:"boss", requiredBadges:3,
    boss:{monsterId:96, level:33, moves:["earthquake","rock_slide","mud_shot","headbutt"]},
    reward:{type:"item", itemId:"maxPotion", qty:2}, rewardText:"2 Luma Infusions" },
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
    reward:{type:"item", itemId:"xSpeed", qty:5}, rewardText:"5 Swift Charges" },
  { id:"q39", title:"Voltforest Protector", desc:"The Voltforest needs a champion to defeat the invasive alpha.", location:"bug_forest_west", type:"boss", requiredBadges:1,
    boss:{monsterId:147, level:20, moves:["thunderbolt","vine_whip","spark","razor_leaf"]},
    reward:{type:"item", itemId:"silverPowder", qty:1}, rewardText:"Carapace Dust" },
  { id:"q40", title:"The Magnetic Anomaly", desc:"A strange magnetic field disrupts Sparkmoor. Find the source!", location:"sparkmoor", type:"boss", requiredBadges:4,
    boss:{monsterId:151, level:42, moves:["flash_cannon","thunderbolt","iron_tail","hyper_beam"]},
    reward:{type:"money", amount:4000}, rewardText:"4000 coins" },

  // ---- FROSTPEAK & ICE AREAS (41-50) ----
  { id:"q41", title:"Blizzard Warning", desc:"A massive blizzard Lumori rampages near Frostpeak!", location:"frostpeak", type:"boss", requiredBadges:4,
    boss:{monsterId:50, level:44, moves:["blizzard","ice_beam","icicle_crash","harden"]},
    reward:{type:"item", itemId:"neverMeltIce", qty:1}, rewardText:"Eternal Ice" },
  { id:"q42", title:"Frozen Lake Monster", desc:"Break through the ice and battle the creature beneath!", location:"mirror_lake", type:"boss", requiredBadges:4,
    boss:{monsterId:45, level:42, moves:["blizzard","surf","ice_beam","hydro_pump"]},
    reward:{type:"money", amount:4000}, rewardText:"4000 coins" },
  { id:"q43", title:"Avalanche Alert", desc:"Stop the Lumori causing avalanches on Route 5!", location:"route5", type:"boss", requiredBadges:4,
    boss:{monsterId:56, level:43, moves:["blizzard","flash_cannon","ice_beam","iron_tail"]},
    reward:{type:"item", itemId:"revive", qty:5}, rewardText:"5 Luma Shards" },
  { id:"q44", title:"Crystal Depths Expedition", desc:"Delve into the Crystal Depths and claim the crystal prize.", location:"crystal_depths", type:"boss", requiredBadges:5,
    boss:{monsterId:195, level:48, moves:["crystal_lance","stone_edge","rock_slide","landslide"]},
    reward:{type:"item", itemId:"hardStone", qty:1}, rewardText:"Crag Shard" },
  { id:"q45", title:"Frostpeak Ski Challenge", desc:"Win the Frostpeak ski challenge battle tournament!", location:"frostpeak", type:"boss", requiredBadges:4,
    boss:{monsterId:47, level:42, moves:["ice_beam","icicle_crash","quick_attack","blizzard"]},
    reward:{type:"money", amount:3000}, rewardText:"3000 coins" },
  { id:"q46", title:"Ice Sculptor's Request", desc:"An ice sculptor needs rare ice crystals. Defeat the Lumori guarding them.", location:"frostpeak", type:"boss", requiredBadges:4,
    boss:{monsterId:55, level:44, moves:["ice_beam","flash_cannon","iron_tail","blizzard"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Luma Infusions" },
  { id:"q47", title:"Polar Expedition", desc:"Join the polar expedition and face the apex predator!", location:"route5", type:"boss", requiredBadges:4,
    boss:{monsterId:54, level:45, moves:["blizzard","earthquake","ice_beam","earth_power"]},
    reward:{type:"item", itemId:"xDefense", qty:5}, rewardText:"5 Guard Charges" },
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
    reward:{type:"item", itemId:"pixieDust", qty:1}, rewardText:"Fairy Essence" },
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
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Luma Infusions" },
  { id:"q58", title:"Grave Moss Collector", desc:"Collect rare grave moss by defeating its parasitic host.", location:"haunted_grove", type:"boss", requiredBadges:5,
    boss:{monsterId:130, level:46, moves:["shadow_ball","energy_ball","dark_pulse","razor_leaf"]},
    reward:{type:"money", amount:3500}, rewardText:"3500 coins" },
  { id:"q59", title:"The Umbravine", desc:"A monstrous Umbravine has rooted in Route 6. Remove it!", location:"route6", type:"boss", requiredBadges:5,
    boss:{monsterId:79, level:50, moves:["dark_pulse","energy_ball","seed_bomb","shadow_ball"]},
    reward:{type:"item", itemId:"miracleSeed", qty:1}, rewardText:"Miracle Seed" },
  { id:"q60", title:"Nightfall Reckoning", desc:"Face the most powerful dark Lumori in all of Shadowmere.", location:"shadowmere", type:"boss", requiredBadges:6,
    boss:{monsterId:123, level:55, moves:["crunch","sludge_bomb","dark_pulse","shadow_ball"]},
    reward:{type:"item", itemId:"xAttack", qty:5}, rewardText:"5 Power Charges" },

  // ---- SKYVAULT & PSYCHIC AREAS (61-70) ----
  { id:"q61", title:"Mind Over Matter", desc:"A psychic barrier blocks Skyvault. Shatter it by defeating the guardian.", location:"skyvault", type:"boss", requiredBadges:6,
    boss:{monsterId:168, level:54, moves:["psychic_move","dazzling_gleam","psybeam","calm_mind"]},
    reward:{type:"item", itemId:"wiseGlasses", qty:1}, rewardText:"Wise Glasses" },
  { id:"q62", title:"Mystic Forest Patrol", desc:"Patrol the Mystic Forest and defeat rogue Lumori.", location:"mystic_forest", type:"boss", requiredBadges:6,
    boss:{monsterId:78, level:50, moves:["shadow_ball","razor_leaf","dark_pulse","energy_ball"]},
    reward:{type:"money", amount:4000}, rewardText:"4000 coins" },
  { id:"q63", title:"Sky Harbor Defense", desc:"Sky Harbor is under attack! Defend it from the invader!", location:"sky_harbor", type:"boss", requiredBadges:6,
    boss:{monsterId:112, level:52, moves:["hurricane","air_slash","wing_attack","jetstream"]},
    reward:{type:"item", itemId:"revive", qty:5}, rewardText:"5 Luma Shards" },
  { id:"q64", title:"Poison Swamp Cleanup", desc:"Clear the toxic Lumori polluting the Poison Swamp.", location:"poison_swamp_upper", type:"boss", requiredBadges:6,
    boss:{monsterId:74, level:52, moves:["sludge_wave","earthquake","acid_rain","toxic"]},
    reward:{type:"item", itemId:"poisonBarb", qty:1}, rewardText:"Venom Thorn" },
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
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Luma Infusions" },
  { id:"q69", title:"Skyvault Observatory", desc:"The observatory telescope reveals a hidden Lumori. Battle it!", location:"skyvault", type:"boss", requiredBadges:6,
    boss:{monsterId:319, level:56, moves:["dark_pulse","moonblast","psychic_move","shadow_ball"]},
    reward:{type:"item", itemId:"spiritVeil", qty:1}, rewardText:"Spirit Veil" },
  { id:"q70", title:"Dreamweaver", desc:"A Lumori weaves dreams into reality. Snap out of it by fighting!", location:"mystic_forest", type:"boss", requiredBadges:6,
    boss:{monsterId:142, level:52, moves:["dazzling_gleam","fairy_wind","psychic_move","moonblast"]},
    reward:{type:"item", itemId:"pixieDust", qty:1}, rewardText:"Fairy Essence" },

  // ---- DRAGONSPIRE & LATE GAME (71-80) ----
  { id:"q71", title:"Dragon's Trial", desc:"Pass the Dragon's Trial at Dragonspire to prove your worth.", location:"dragonspire", type:"boss", requiredBadges:7,
    boss:{monsterId:173, level:60, moves:["outrage","dragon_pulse","dragon_dance","hyper_beam"]},
    reward:{type:"money", amount:8000}, rewardText:"8000 coins" },
  { id:"q72", title:"Route 8 Warden", desc:"The Route 8 warden tests all who pass.", location:"route8", type:"boss", requiredBadges:7,
    boss:{monsterId:321, level:58, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]},
    reward:{type:"item", itemId:"dragonFang", qty:1}, rewardText:"Dragon Fang" },
  { id:"q73", title:"Victory Road Preview", desc:"Get a taste of Victory Road by defeating its gatekeeper!", location:"victoryroad", type:"boss", requiredBadges:8,
    boss:{monsterId:152, level:60, moves:["tungsten_ram","stone_edge","iron_tail","flash_cannon"]},
    reward:{type:"item", itemId:"xAttack", qty:5}, rewardText:"5 Power Charges" },
  { id:"q74", title:"Dragon Egg Protector", desc:"Protect the dragon eggs from poachers by defeating their leader!", location:"dragonspire", type:"boss", requiredBadges:7,
    boss:{monsterId:172, level:56, moves:["dragon_claw","dragon_breath","body_slam","dragon_dance"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Luma Infusions" },
  { id:"q75", title:"The Dragon Sage", desc:"An ancient dragon sage challenges worthy trainers.", location:"dragonspire", type:"boss", requiredBadges:8,
    boss:{monsterId:175, level:62, moves:["surf","dragon_pulse","hydro_pump","dragon_claw"]},
    reward:{type:"money", amount:10000}, rewardText:"10000 coins" },
  { id:"q76", title:"Stormforged Encounter", desc:"A rare Stormforged has been spotted near Thunder Cliffs!", location:"thunder_cliffs", type:"boss", requiredBadges:4,
    boss:{monsterId:320, level:45, moves:["thunderbolt","flash_cannon","forge_strike","spark"]},
    reward:{type:"item", itemId:"metalCoat", qty:1}, rewardText:"Iron Shell" },
  { id:"q77", title:"Route 8 Ambush", desc:"Bandits ambush travelers on Route 8. Stop them!", location:"route8", type:"boss", requiredBadges:7,
    boss:{monsterId:119, level:56, moves:["crunch","dark_pulse","night_slash","shadow_ball"]},
    reward:{type:"item", itemId:"revive", qty:5}, rewardText:"5 Luma Shards" },
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
  { id:"q82", title:"Toxic Waste Crisis", desc:"Miasma City's toxic waste has spawned a dangerous Lumori!", location:"miasmacity", type:"boss", requiredBadges:9,
    boss:{monsterId:158, level:60, moves:["sludge_wave","earthquake","acid_rain","toxic"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Luma Infusions" },
  { id:"q83", title:"Terravault Excavation", desc:"Join the excavation and battle what you unearth!", location:"terravault", type:"boss", requiredBadges:10,
    boss:{monsterId:107, level:62, moves:["earthquake","earth_power","fissure_slam","mud_shot"]},
    reward:{type:"item", itemId:"softSand", qty:1}, rewardText:"Coarse Sand" },
  { id:"q84", title:"Silkwood Cocoon Crisis", desc:"Giant cocoons are hatching dangerous Lumori in Silkwood!", location:"silkwood", type:"boss", requiredBadges:11,
    boss:{monsterId:201, level:64, moves:["x_scissor","bug_buzz","iron_tail","mandible_crush"]},
    reward:{type:"item", itemId:"silverPowder", qty:1}, rewardText:"Carapace Dust" },
  { id:"q85", title:"Gusthaven Wind Trial", desc:"Pass the Wind Trial to earn the respect of Gusthaven.", location:"gusthaven", type:"boss", requiredBadges:12,
    boss:{monsterId:109, level:66, moves:["hurricane","moonblast","air_slash","cyclone_blade"]},
    reward:{type:"money", amount:7000}, rewardText:"7000 coins" },
  { id:"q86", title:"Ironforge Masterwork", desc:"Defeat the Ironforge champion's ultimate creation!", location:"ironforge", type:"boss", requiredBadges:13,
    boss:{monsterId:151, level:68, moves:["tungsten_ram","flash_cannon","thunder","iron_tail"]},
    reward:{type:"item", itemId:"metalCoat", qty:1}, rewardText:"Iron Shell" },
  { id:"q87", title:"Quarryville Fossil Hunt", desc:"A rare fossil Lumori has been revived! Battle it!", location:"quarryville", type:"boss", requiredBadges:14,
    boss:{monsterId:195, level:68, moves:["crystal_lance","stone_edge","landslide","geode_burst"]},
    reward:{type:"item", itemId:"hardStone", qty:1}, rewardText:"Crag Shard" },
  { id:"q88", title:"Starbloom Celestial Trial", desc:"The Celestial Trial awaits at Starbloom. Are you worthy?", location:"starbloom", type:"boss", requiredBadges:15,
    boss:{monsterId:143, level:70, moves:["moonblast","psychic_move","celestial_wave","dazzling_gleam"]},
    reward:{type:"item", itemId:"pixieDust", qty:1}, rewardText:"Fairy Essence" },
  { id:"q89", title:"Route 9 Pioneer", desc:"Be the first to explore the new Route 9!", location:"route9", type:"boss", requiredBadges:8,
    boss:{monsterId:8, level:55, moves:["petal_blitz","razor_leaf","seed_bomb","energy_ball"]},
    reward:{type:"money", amount:5000}, rewardText:"5000 coins" },
  { id:"q90", title:"Route 10 Toxin", desc:"Clear the toxic Lumori blocking Route 10.", location:"route10", type:"boss", requiredBadges:9,
    boss:{monsterId:156, level:58, moves:["sludge_bomb","venoshock","toxic","acid_rain"]},
    reward:{type:"item", itemId:"superPotion", qty:10}, rewardText:"10 Super Potions" },
  { id:"q91", title:"Route 11 Tremors", desc:"Investigate the tremors shaking Route 11.", location:"route11", type:"boss", requiredBadges:10,
    boss:{monsterId:102, level:60, moves:["earthquake","earth_power","body_slam","fissure_slam"]},
    reward:{type:"money", amount:6000}, rewardText:"6000 coins" },
  { id:"q92", title:"Route 12 Swarm", desc:"A massive bug swarm threatens Route 12!", location:"route12", type:"boss", requiredBadges:11,
    boss:{monsterId:203, level:62, moves:["bug_buzz","moonblast","x_scissor","dazzling_gleam"]},
    reward:{type:"item", itemId:"revive", qty:5}, rewardText:"5 Luma Shards" },
  { id:"q93", title:"Route 13 Gale", desc:"Navigate through the gale on Route 13.", location:"route13", type:"boss", requiredBadges:12,
    boss:{monsterId:112, level:64, moves:["hurricane","air_slash","cyclone_blade","skyfall"]},
    reward:{type:"item", itemId:"xSpeed", qty:5}, rewardText:"5 Swift Charges" },
  { id:"q94", title:"Route 14 Forge", desc:"Cross through the active forge on Route 14.", location:"route14", type:"boss", requiredBadges:13,
    boss:{monsterId:148, level:66, moves:["forge_strike","iron_tail","flash_cannon","crunch"]},
    reward:{type:"money", amount:7000}, rewardText:"7000 coins" },
  { id:"q95", title:"Route 15 Rockslide", desc:"Clear the massive rockslide on Route 15.", location:"route15", type:"boss", requiredBadges:14,
    boss:{monsterId:192, level:66, moves:["earthquake","stone_edge","rock_slide","landslide"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Luma Infusions" },
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
    reward:{type:"item", itemId:"xDefense", qty:5}, rewardText:"5 Guard Charges" },
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
  { id:"q109", title:"Ultimate Trial", desc:"Face the ultimate trial: a gauntlet of the strongest wild Lumori!", location:"victoryroad", type:"boss", requiredBadges:16,
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
    reward:{type:"item", itemId:"silverPowder", qty:1}, rewardText:"Carapace Dust" },

  // Route 10 - Toxic Passage (Poison focus)
  { id:"q114", title:"Toxic Passage Brawler", desc:"A battle-hardened Poison trainer blocks the toxic passage.", location:"route10", type:"boss", requiredBadges:9,
    boss:{monsterId:159, level:60, moves:["acid_rain","sludge_wave","venom_lance","earth_power"]},
    reward:{type:"money", amount:6500}, rewardText:"6500 coins" },
  { id:"q115", title:"Miasma City Chemist", desc:"A Miasma City chemist tests trainers with toxic-type experiments.", location:"miasmacity", type:"boss", requiredBadges:9,
    boss:{monsterId:163, level:61, moves:["sludge_wave","venoshock","venom_lance","toxic"]},
    reward:{type:"item", itemId:"poisonBarb", qty:1}, rewardText:"Venom Thorn" },
  { id:"q116", title:"Evolved Wind Venom", desc:"A Toxivane has evolved and taken root on Route 10. Clear it out!", location:"route10", type:"boss", requiredBadges:9,
    boss:{monsterId:161, level:60, moves:["hurricane","sludge_wave","air_slash","venom_lance"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Luma Infusions" },

  // Route 11 - Tremor Pass (Ground focus)
  { id:"q117", title:"Tremor Pass Demolitions", desc:"A demolitions expert challenges you at the rockiest point of Route 11.", location:"route11", type:"boss", requiredBadges:10,
    boss:{monsterId:97, level:63, moves:["earthquake","tectonic_slam","earth_power","stone_edge"]},
    reward:{type:"money", amount:7000}, rewardText:"7000 coins" },
  { id:"q118", title:"Desert Dragon Duel", desc:"A legendary desert dragon has been spotted at Route 11. Challenge it!", location:"route11", type:"boss", requiredBadges:10,
    boss:{monsterId:107, level:64, moves:["dragon_claw","earthquake","earth_power","outrage"]},
    reward:{type:"item", itemId:"softSand", qty:1}, rewardText:"Coarse Sand" },
  { id:"q119", title:"Terravault Iron Giant", desc:"An ancient iron giant guards the entrance to Terravault's mines.", location:"terravault", type:"boss", requiredBadges:10,
    boss:{monsterId:103, level:63, moves:["earthquake","surf","earth_power","tidal_crush"]},
    reward:{type:"item", itemId:"xDefense", qty:5}, rewardText:"5 Guard Charges" },

  // Route 12 - Silk Road (Bug focus)
  { id:"q120", title:"Silk Road Weaver", desc:"The legendary Silk Road Weaver challenges trainers who disturb its web.", location:"route12", type:"boss", requiredBadges:11,
    boss:{monsterId:202, level:65, moves:["moonblast","bug_buzz","silk_bind","dazzling_gleam"]},
    reward:{type:"money", amount:7500}, rewardText:"7500 coins" },
  { id:"q121", title:"Silkwood Ancient Beetle", desc:"An ancient evolved beetle protects the Great Silkwood Tree's roots.", location:"silkwood", type:"boss", requiredBadges:11,
    boss:{monsterId:201, level:65, moves:["x_scissor","iron_tail","flash_cannon","mandible_crush"]},
    reward:{type:"item", itemId:"silverPowder", qty:1}, rewardText:"Carapace Dust" },
  { id:"q122", title:"Rock Beetle King", desc:"The Rock Beetle King rules the Silk Road tunnels deep below.", location:"route12", type:"boss", requiredBadges:11,
    boss:{monsterId:205, level:65, moves:["bug_buzz","earthquake","stone_edge","mandible_crush"]},
    reward:{type:"item", itemId:"hardStone", qty:1}, rewardText:"Crag Shard" },

  // Route 13 - Gale Ridge (Wind focus)
  { id:"q123", title:"Gale Ridge Storm Rider", desc:"A storm rider has trained her Wind Lumori to hurricane strength.", location:"route13", type:"boss", requiredBadges:12,
    boss:{monsterId:113, level:67, moves:["hurricane","tempest_wrath","cyclone_blade","air_slash"]},
    reward:{type:"money", amount:8000}, rewardText:"8000 coins" },
  { id:"q124", title:"Gusthaven Wind Sage", desc:"The ancient Wind Sage challenges only the strongest trainers.", location:"gusthaven", type:"boss", requiredBadges:12,
    boss:{monsterId:117, level:67, moves:["hurricane","psychic_move","cyclone_blade","astral_rend"]},
    reward:{type:"item", itemId:"swiftFeather", qty:1}, rewardText:"Swift Feather" },
  { id:"q125", title:"Cyclavorn Chase", desc:"A Cyclavorn has run amok through Gale Ridge! Calm it with battle.", location:"route13", type:"boss", requiredBadges:12,
    boss:{monsterId:110, level:66, moves:["hurricane","thunderbolt","cyclone_blade","storm_surge"]},
    reward:{type:"item", itemId:"xSpeed", qty:5}, rewardText:"5 Swift Charges" },

  // Route 14 - Ironwork Path (Steel focus)
  { id:"q126", title:"Ironwork Sentinel", desc:"The Ironwork Path's mechanical sentinel bars all unworthy trainers.", location:"route14", type:"boss", requiredBadges:13,
    boss:{monsterId:149, level:69, moves:["tungsten_ram","flash_cannon","iron_tail","forge_strike"]},
    reward:{type:"money", amount:8500}, rewardText:"8500 coins" },
  { id:"q127", title:"Ironforge Champion Smith", desc:"The master blacksmith of Ironforge forged his Lumori as hard as steel.", location:"ironforge", type:"boss", requiredBadges:13,
    boss:{monsterId:154, level:69, moves:["flash_cannon","earthquake","tungsten_ram","anvil_drop"]},
    reward:{type:"item", itemId:"metalCoat", qty:1}, rewardText:"Iron Shell" },

  // Route 15 - Granite Pass / The Umbra Order Resurgence
  { id:"q128", title:"Granite Pass Guardian", desc:"A Rock master guards the narrowest point of Granite Pass.", location:"route15", type:"boss", requiredBadges:14,
    boss:{monsterId:196, level:71, moves:["stone_edge","icicle_crash","blizzard","crystal_lance"]},
    reward:{type:"money", amount:9000}, rewardText:"9000 coins" },
  { id:"q129", title:"Umbra Void Patrol", desc:"The Umbra Order agents have set up a checkpoint on Route 15! Clear them out!", location:"route15", type:"boss", requiredBadges:14,
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
  { id:"q132", title:"Commander Phantom's Last Stand", desc:"Commander Phantom has regrouped on Route 16! Stop The Umbra Order before they re-open the Void Rift!", location:"route16", type:"boss", requiredBadges:15,
    boss:{monsterId:120, level:70, moves:["crunch","dark_pulse","void_rend","night_slash"]},
    reward:{type:"item", itemId:"maxPotion", qty:10}, rewardText:"10 Max Potions",
    umbra:true },

  // ============================================================
  // NG+-EXCLUSIVE QUESTS (requiresNGPlus: true)
  // ============================================================

  // --- Discovery & Exploration ---
  { id:"ngq01", title:"Beyond the Boundary", desc:"A shimmer in the air marks where reality has thinned. Enter the Void Rift and encounter the creatures that now roam there.", location:"void_rift", type:"exploration", requiresNGPlus:true, requiredBadges:0,
    reward:{type:"item", itemId:"prismaticShard", qty:1}, rewardText:"Prismatic Shard" },
  { id:"ngq02", title:"The Summit Calls", desc:"Locals speak of new creatures seen at the Apex Summit since your return. Be the first to catalogue them.", location:"apex_summit", type:"exploration", requiresNGPlus:true, requiredBadges:0,
    reward:{type:"item", itemId:"apexCore", qty:1}, rewardText:"Apex Core" },
  { id:"ngq03", title:"Prismatic Phenomena", desc:"A researcher in Veilport has documented strange prismatic energy readings across the Prismatic Rift. Investigate three encounters there.", location:"prismatic_rift", type:"exploration", requiresNGPlus:true, requiredBadges:0,
    reward:{type:"money", amount:15000}, rewardText:"15000 coins" },
  { id:"ngq04", title:"Rift Walker's Journal", desc:"Find the journal of a trainer who entered the Void Nexus in a prior era. It contains clues to finding NG+-exclusive Lumori.", location:"void_nexus", type:"exploration", requiresNGPlus:true, requiredBadges:0,
    reward:{type:"item", itemId:"voidEmber", qty:1}, rewardText:"Void Ember" },

  // --- Catch Quests ---
  { id:"ngq05", title:"Rift Collector: Tier I", desc:"The creatures of this new era are unlike any before. Catch 5 NG+-exclusive Lumori to prove your worth as a rift collector.", location:"void_rift", type:"catch", requiresNGPlus:true, requiredBadges:0,
    catchTarget:5, catchNGPlusOnly:true, reward:{type:"item", itemId:"ultraOrb", qty:10}, rewardText:"10 Ultra Orbs" },
  { id:"ngq06", title:"Rift Collector: Tier II", desc:"You have only scratched the surface. Catch 15 NG+-exclusive Lumori across any area.", location:"prismatic_rift", type:"catch", requiresNGPlus:true, requiredBadges:0,
    catchTarget:15, catchNGPlusOnly:true, reward:{type:"item", itemId:"apexCore", qty:2}, rewardText:"2 Apex Cores" },
  { id:"ngq07", title:"Void Menagerie", desc:"A legendary collector challenges you to fill your box with the rarest void-touched creatures. Catch 30 NG+ Lumori.", location:"apex_summit", type:"catch", requiresNGPlus:true, requiredBadges:0,
    catchTarget:30, catchNGPlusOnly:true, reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"ngq08", title:"The Apex Archive", desc:"Catch every creature in the Apex Summit area — the rarest living things in Lumoria.", location:"apex_summit", type:"catch", requiresNGPlus:true, requiredBadges:0,
    catchTarget:20, catchNGPlusOnly:true, reward:{type:"item", itemId:"masterOrb", qty:3}, rewardText:"3 Master Orbs" },

  // --- Boss Battles ---
  { id:"ngq09", title:"Prismatic Trial — Wave 1", desc:"A mysterious trainer calling himself the Prismatic Warden challenges all who enter the Rift. Defeat him to prove your worth.", location:"prismatic_rift", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:379, level:85, moves:["dragon_claw","phantom_claw","wyrm_strike","cataclysm_breath"]},
    reward:{type:"item", itemId:"prismaticShard", qty:2}, rewardText:"2 Prismatic Shards" },
  { id:"ngq10", title:"Prismatic Trial — Wave 2", desc:"The Prismatic Warden's partner has emerged. Face the storm entity she commands.", location:"prismatic_rift", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:380, level:87, moves:["thunder","tailwind_strike","volt_surge","neural_storm"]},
    reward:{type:"item", itemId:"apexCore", qty:2}, rewardText:"2 Apex Cores" },
  { id:"ngq11", title:"Apex Gauntlet — Round 1", desc:"The Apex Gauntlet is a legendary test. Face the first guardian of the Summit.", location:"apex_summit", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:389, level:90, moves:["thunder","dragon_pulse","volt_surge","cataclysm_breath"]},
    reward:{type:"item", itemId:"voidEmber", qty:2}, rewardText:"2 Void Embers" },
  { id:"ngq12", title:"Apex Gauntlet — Round 2", desc:"The second guardian awaits. Its power dwarfs all that came before.", location:"apex_summit", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:392, level:92, moves:["time_fracture","cataclysm_breath","mind_shatter","neural_storm"]},
    reward:{type:"money", amount:80000}, rewardText:"80000 coins" },
  { id:"ngq13", title:"Apex Gauntlet — The Final Trial", desc:"Face the pinnacle of the Apex Gauntlet — the guardian that has never been defeated.", location:"apex_summit", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:401, level:95, moves:["cosmic_veil","neural_storm","fae_requiem","prism_ward"]},
    reward:{type:"item", itemId:"masterOrb", qty:5}, rewardText:"5 Master Orbs" },

  // --- Gym Leader Omega Rematches ---
  { id:"ngq14", title:"Rex Omega Challenge", desc:"Gym Leader Rex has trained in the NG+ era. His Normal-types are now truly fearsome.", location:"ashford", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:391, level:82, moves:["headbutt","body_slam","hyper_beam","dragon_claw"]},
    reward:{type:"money", amount:20000}, rewardText:"20000 coins", gymOmega:true },
  { id:"ngq15", title:"Zephyra Omega Challenge", desc:"Gym Leader Zephyra has embraced the void-touched wind Lumori. Her speed is now unmatched.", location:"gusthaven", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:370, level:84, moves:["thunder","tailwind_strike","volt_surge","air_slash"]},
    reward:{type:"money", amount:22000}, rewardText:"22000 coins", gymOmega:true },
  { id:"ngq16", title:"Atlas Omega Challenge", desc:"Gym Leader Atlas wields NG+ steel behemoths. Can you crack his iron fortress?", location:"ironforge", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:334, level:83, moves:["flash_cannon","iron_tail","terra_spike","fissure_slam"]},
    reward:{type:"money", amount:21000}, rewardText:"21000 coins", gymOmega:true },

  // --- Special Trainer Battles ---
  { id:"ngq17", title:"The Void Scholar", desc:"A researcher who survived exposure to a Void Rift challenges you with a void-type team.", location:"void_rift", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:373, level:86, moves:["void_rend","phantom_claw","shadow_ball","cataclysm_breath"]},
    reward:{type:"item", itemId:"prismaticShard", qty:3}, rewardText:"3 Prismatic Shards" },
  { id:"ngq18", title:"Champion++ — The True Test", desc:"The Champion has been training since your first victory. This rematch will push you beyond your limits.", location:"victoryroad", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:400, level:98, moves:["mantle_surge","solar_flare","terra_spike","inferno"]},
    reward:{type:"item", itemId:"apexCore", qty:5}, rewardText:"5 Apex Cores" },

  // --- NG+ Umbra Order Return ---
  { id:"ngq19", title:"Umbra Returns — The Void Ritual", desc:"The Umbra Order has reconstituted in the NG+ era, attempting to open a permanent void portal. Stop them!", location:"void_nexus", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:398, level:88, moves:["void_dominion","void_rend","neural_storm","fae_requiem"]},
    reward:{type:"money", amount:60000}, rewardText:"60000 coins", umbra:true },
  { id:"ngq20", title:"Director Shade — Final Form", desc:"Director Shade has absorbed void energy and returned more powerful than ever. End this once and for all.", location:"void_nexus", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:352, level:90, moves:["void_rend","mind_shatter","neural_storm","phantom_claw"]},
    reward:{type:"item", itemId:"masterOrb", qty:5}, rewardText:"5 Master Orbs + title", umbra:true },

  // --- Pseudo-legendary Quests ---
  { id:"ngq21", title:"The Dragon Veil Seeker", desc:"Legends speak of a Dragon-Psychic lineage hidden in the Prismatic Rift. Find and face the evolved form.", location:"prismatic_rift", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:404, level:88, moves:["veil_collapse","cataclysm_breath","mind_shatter","wyrm_strike"]},
    reward:{type:"item", itemId:"prismaticShard", qty:3}, rewardText:"3 Prismatic Shards" },
  { id:"ngq22", title:"Warden of the Void Gate", desc:"The dark-steel warden protects the boundary between worlds. Defeat it to prove you are master of this era.", location:"apex_summit", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:407, level:88, moves:["warden_strike","void_dominion","alloy_edge","phantom_claw"]},
    reward:{type:"item", itemId:"apexCore", qty:3}, rewardText:"3 Apex Cores" },

  // ============================================================
  // MISCELLANEOUS TOUGH NG+ BATTLES — Unique Strong Trainers
  // High-difficulty fights with curated full teams, not leader rematches
  // ============================================================

  // --- The Void Council (5 elite specialists) ---
  { id:"ngq23", title:"Void Council: The Tactician", desc:"Councilor Vale commands a perfectly coordinated team built around prediction and counters. Every switch is calculated.", location:"void_rift", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:343, level:88, moves:["shadowstep","psystrike","mind_shatter","phantom_claw"]},
    reward:{type:"money", amount:40000}, rewardText:"40000 coins", council:true },
  { id:"ngq24", title:"Void Council: The Berserker", desc:"Councilor Kade brings raw overwhelming power. No strategy — just six monsters that hit as hard as anything alive.", location:"void_nexus", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:382, level:90, moves:["cataclysm_breath","scale_storm","void_rend","primordial_roar"]},
    reward:{type:"money", amount:45000}, rewardText:"45000 coins", council:true },
  { id:"ngq25", title:"Void Council: The Illusionist", desc:"Councilor Mira uses status, confusion, and misdirection. You will never know what hits you.", location:"prismatic_rift", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:378, level:89, moves:["dreamweave","fae_requiem","neural_storm","mind_shatter"]},
    reward:{type:"item", itemId:"prismaticShard", qty:2}, rewardText:"2 Prismatic Shards", council:true },
  { id:"ngq26", title:"Void Council: The Titan", desc:"Councilor Gorn fields the heaviest defensive walls in Lumoria. Chip through or be outlasted.", location:"apex_summit", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:385, level:91, moves:["blizzard","fissure_slam","cryo_lance","terra_spike"]},
    reward:{type:"money", amount:50000}, rewardText:"50000 coins", council:true },
  { id:"ngq27", title:"Void Council: The Grandmaster", desc:"Councilor Null is the most fearsome trainer in NG+ Lumoria. His team is the stuff of legend.", location:"apex_summit", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:398, level:95, moves:["void_dominion","neural_storm","fae_requiem","mind_shatter"]},
    reward:{type:"item", itemId:"apexCore", qty:5}, rewardText:"5 Apex Cores + title", council:true },

  // --- The Ancient Gauntlet (10-wave no-heal challenge) ---
  { id:"ngq28", title:"Ancient Gauntlet — Entry", desc:"The Ancient Gauntlet is a legendary 10-battle challenge with no healing between fights. Attempt it only when fully prepared.", location:"void_nexus", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:352, level:87, moves:["void_rend","mind_shatter","phantom_claw","neural_storm"]},
    reward:{type:"money", amount:30000}, rewardText:"30000 coins" },
  { id:"ngq29", title:"Ancient Gauntlet — The Final Wave", desc:"You've fought through everything the Gauntlet has. One last opponent stands between you and eternal glory.", location:"void_nexus", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:401, level:98, moves:["cosmic_veil","neural_storm","psystrike","fae_requiem"]},
    reward:{type:"item", itemId:"masterOrb", qty:10}, rewardText:"10 Master Orbs + Gauntlet title" },

  // --- Wandering Elite Trainers (scattered across NG+ map) ---
  { id:"ngq30", title:"The Drifting Duelist", desc:"A masked trainer wanders the NG+ routes seeking worthy challengers. They appear without warning and leave the same way.", location:"void_rift", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:356, level:88, moves:["thunder","dragon_pulse","wyrm_strike","volt_surge"]},
    reward:{type:"money", amount:35000}, rewardText:"35000 coins" },
  { id:"ngq31", title:"The Apex Archivist", desc:"A scholar who has catalogued every NG+ Lumori challenges you to prove you understand their power.", location:"prismatic_rift", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:379, level:90, moves:["wyrm_strike","cataclysm_breath","phantom_claw","scale_storm"]},
    reward:{type:"item", itemId:"prismaticShard", qty:4}, rewardText:"4 Prismatic Shards" },
  { id:"ngq32", title:"The Storm Hermit", desc:"A recluse who has lived at the top of Apex Summit for 30 years. Their Lumori are battle-hardened beyond anything you have fought.", location:"apex_summit", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:389, level:93, moves:["volt_surge","cataclysm_breath","thunder","neural_storm"]},
    reward:{type:"money", amount:55000}, rewardText:"55000 coins" },

  // --- The Rival Gauntlet (your journey's rivals, all NG+ evolved) ---
  { id:"ngq33", title:"Rival Challenge: The First Rival", desc:"Your first rival has completed their own NG+ journey. Their team is unrecognisable from what you once faced.", location:"void_rift", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:345, level:89, moves:["wyrm_strike","void_rend","shadow_ball","cataclysm_breath"]},
    reward:{type:"money", amount:30000}, rewardText:"30000 coins" },
  { id:"ngq34", title:"Rival Challenge: The Team Rocket", desc:"Your nemesis rival has rebuilt their team around pure NG+ power. They want to settle the score permanently.", location:"apex_summit", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:393, level:92, moves:["void_rend","thunder","shadow_ball","neural_storm"]},
    reward:{type:"money", amount:40000}, rewardText:"40000 coins" },

  // --- Legendary Beast Hunt (high-level wild legendary encounters as quests) ---
  { id:"ngq35", title:"Legend Hunt: Eondrake", desc:"Track down the ancient Eondrake that has been spotted near the Prismatic Rift. It will not be caught easily.", location:"prismatic_rift", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:392, level:90, moves:["time_fracture","cataclysm_breath","mind_shatter","wyrm_strike"]},
    reward:{type:"item", itemId:"masterOrb", qty:2}, rewardText:"2 Master Orbs" },
  { id:"ngq36", title:"Legend Hunt: Cosmoveil", desc:"Cosmoveil has been sighted at the absolute peak of Apex Summit. Reach it and face the being from beyond the stars.", location:"apex_summit", type:"boss", requiresNGPlus:true, requiredBadges:0,
    boss:{monsterId:401, level:95, moves:["cosmic_veil","fae_requiem","neural_storm","psystrike"]},
    reward:{type:"item", itemId:"masterOrb", qty:3}, rewardText:"3 Master Orbs" }
];
