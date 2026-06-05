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
  Fire    : { Fire:0.5,     Aquatic:0.5,  Nature:2,     Electric:1,   Earth:1,      Wind:1,       Ice:2,        Dark:2,       Fairy:2,      Metal:2,      Poison:1,     Mental:1,     Draconic:0.5, Normal:1,     Spectral:1,   Fighting:1,   Aether:0.5,   Crystal:2,    Primal:1,     Sonic:1,      Vapor:2,      Mineral:0.5,  Toxin:2,      Chrono:0.5,   Stellar:0.5,  Dream:2 },
  Aquatic : { Fire:2,       Aquatic:0.5,  Nature:0,     Electric:1,   Earth:2,      Wind:1,       Ice:1,        Dark:1,       Fairy:1,      Metal:1,      Poison:1,     Mental:1,     Draconic:0.5, Normal:1,     Spectral:1,   Fighting:1,   Aether:1,     Crystal:2,    Primal:2,     Sonic:1,      Vapor:1,      Mineral:2,    Toxin:1,      Chrono:0.5,   Stellar:0.5,  Dream:1 },
  Nature  : { Fire:0.5,     Aquatic:2,    Nature:1,     Electric:2,   Earth:2,      Wind:0.5,     Ice:0.5,      Dark:1,       Fairy:1,      Metal:0.5,    Poison:0.5,   Mental:2,     Draconic:1,   Normal:1,     Spectral:1,   Fighting:1,   Aether:1,     Crystal:0.5,  Primal:2,     Sonic:0,      Vapor:0.5,    Mineral:1,    Toxin:2,      Chrono:0.5,   Stellar:0.5,  Dream:1 },
  Electric: { Fire:1,       Aquatic:2,    Nature:0.5,   Electric:0.5, Earth:0,      Wind:2,       Ice:1,        Dark:1,       Fairy:1,      Metal:1,      Poison:1,     Mental:1,     Draconic:2,   Normal:1,     Spectral:1,   Fighting:1,   Aether:1,     Crystal:0.5,  Primal:1,     Sonic:1,      Vapor:2,      Mineral:1,    Toxin:1,      Chrono:0.5,   Stellar:0.5,  Dream:2 },
  Earth   : { Fire:2,       Aquatic:0.5,  Nature:0.5,   Electric:1,   Earth:0.5,    Wind:0,       Ice:2,        Dark:1,       Fairy:0.5,    Metal:2,      Poison:1,     Mental:1,     Draconic:1,   Normal:1,     Spectral:0,   Fighting:0.5, Aether:1,     Crystal:2,    Primal:1,     Sonic:2,      Vapor:0.5,    Mineral:1,    Toxin:1,      Chrono:0.5,   Stellar:0.5,  Dream:1 },
  Wind    : { Fire:0,       Aquatic:1,    Nature:2,     Electric:0.5, Earth:0,      Wind:1,       Ice:1,        Dark:1,       Fairy:2,      Metal:0.5,    Poison:1,     Mental:0.5,   Draconic:0.5, Normal:1,     Spectral:1,   Fighting:2,   Aether:1,     Crystal:1,    Primal:1,     Sonic:2,      Vapor:2,      Mineral:1,    Toxin:0.5,    Chrono:0.5,   Stellar:0.5,  Dream:1 },
  Ice     : { Fire:0.5,     Aquatic:2,    Nature:2,     Electric:1,   Earth:2,      Wind:2,       Ice:0.5,      Dark:1,       Fairy:1,      Metal:0.5,    Poison:1,     Mental:1,     Draconic:2,   Normal:2,     Spectral:1,   Fighting:1,   Aether:1,     Crystal:0.5,  Primal:2,     Sonic:2,      Vapor:0.5,    Mineral:0.5,  Toxin:1,      Chrono:0.5,   Stellar:0.5,  Dream:1 },
  Dark    : { Fire:2,       Aquatic:1,    Nature:1,     Electric:1,   Earth:0.5,    Wind:1,       Ice:1,        Dark:0.5,     Fairy:0.5,    Metal:1,      Poison:1,     Mental:2,     Draconic:1,   Normal:1,     Spectral:2,   Fighting:2,   Aether:2,     Crystal:1,    Primal:0.5,   Sonic:1,      Vapor:1,      Mineral:1,    Toxin:1,      Chrono:1,     Stellar:2,    Dream:0.5 },
  Fairy   : { Fire:1,       Aquatic:1,    Nature:1,     Electric:1,   Earth:1,      Wind:1,       Ice:0.5,      Dark:2,       Fairy:1,      Metal:0.5,    Poison:1,     Mental:1,     Draconic:2,   Normal:1,     Spectral:1,   Fighting:2,   Aether:1,     Crystal:1,    Primal:1,     Sonic:1,      Vapor:0.5,    Mineral:1,    Toxin:2,      Chrono:1,     Stellar:1,    Dream:1 },
  Metal   : { Fire:0.5,     Aquatic:0.5,  Nature:1,     Electric:0.5, Earth:0.5,    Wind:1,       Ice:2,        Dark:1,       Fairy:2,      Metal:0.5,    Poison:1,     Mental:1,     Draconic:1,   Normal:1,     Spectral:1,   Fighting:2,   Aether:1,     Crystal:2,    Primal:1,     Sonic:0.5,    Vapor:0.5,    Mineral:2,    Toxin:2,      Chrono:0.5,   Stellar:1,    Dream:1 },
  Poison  : { Fire:1,       Aquatic:1,    Nature:2,     Electric:1,   Earth:1,      Wind:1,       Ice:1,        Dark:1,       Fairy:2,      Metal:0,      Poison:0.5,   Mental:2,     Draconic:1,   Normal:1,     Spectral:0.5, Fighting:1,   Aether:2,     Crystal:0.5,  Primal:2,     Sonic:0.5,    Vapor:0.5,    Mineral:1,    Toxin:0.5,    Chrono:0.5,   Stellar:1,    Dream:1 },
  Mental  : { Fire:1,       Aquatic:1,    Nature:0.5,   Electric:1,   Earth:0.5,    Wind:2,       Ice:1,        Dark:0,       Fairy:1,      Metal:0.5,    Poison:2,     Mental:0.5,   Draconic:1,   Normal:2,     Spectral:1,   Fighting:2,   Aether:1,     Crystal:1,    Primal:2,     Sonic:1,      Vapor:0.5,    Mineral:0.5,  Toxin:1,      Chrono:2,     Stellar:1,    Dream:2 },
  Draconic: { Fire:1,       Aquatic:1,    Nature:2,     Electric:0.5, Earth:1,      Wind:1,       Ice:1,        Dark:1,       Fairy:0,      Metal:0.5,    Poison:1,     Mental:1,     Draconic:2,   Normal:1,     Spectral:1,   Fighting:1,   Aether:0.5,   Crystal:1,    Primal:2,     Sonic:2,      Vapor:2,      Mineral:1,    Toxin:1,      Chrono:1,     Stellar:1,    Dream:1 },
  Normal  : { Fire:1,       Aquatic:1,    Nature:1,     Electric:1,   Earth:1,      Wind:1,       Ice:0.5,      Dark:0.5,     Fairy:0.5,    Metal:0.5,    Poison:1,     Mental:0.5,   Draconic:0.5, Normal:1,     Spectral:0,   Fighting:1,   Aether:1,     Crystal:1,    Primal:2,     Sonic:1,      Vapor:0.5,    Mineral:0.5,  Toxin:1,      Chrono:0.5,   Stellar:0.5,  Dream:1 },
  Spectral: { Fire:1,       Aquatic:1,    Nature:0,     Electric:1,   Earth:0,      Wind:2,       Ice:1,        Dark:0.5,     Fairy:1,      Metal:1,      Poison:1,     Mental:2,     Draconic:1,   Normal:0,     Spectral:2,   Fighting:0,   Aether:2,     Crystal:1,    Primal:2,     Sonic:1,      Vapor:0.5,    Mineral:0,    Toxin:0.5,    Chrono:1,     Stellar:1,    Dream:1 },
  Fighting: { Fire:1,       Aquatic:1,    Nature:1,     Electric:1,   Earth:2,      Wind:1,       Ice:2,        Dark:0,       Fairy:0.5,    Metal:2,      Poison:0.5,   Mental:0.5,   Draconic:1,   Normal:1,     Spectral:0,   Fighting:1,   Aether:1,     Crystal:2,    Primal:2,     Sonic:1,      Vapor:0,      Mineral:2,    Toxin:1,      Chrono:0.5,   Stellar:0.5,  Dream:1 },
  Aether  : { Fire:2,       Aquatic:1,    Nature:1,     Electric:1,   Earth:1,      Wind:1,       Ice:1,        Dark:2,       Fairy:0.5,    Metal:1,      Poison:1,     Mental:1,     Draconic:2,   Normal:0.5,   Spectral:2,   Fighting:1,   Aether:0.5,   Crystal:1,    Primal:0.5,   Sonic:1,      Vapor:2,      Mineral:1,    Toxin:2,      Chrono:2,     Stellar:1,    Dream:0.5 },
  Crystal : { Fire:1,       Aquatic:0.5,  Nature:1,     Electric:2,   Earth:1,      Wind:1,       Ice:2,        Dark:1,       Fairy:1,      Metal:0.5,    Poison:2,     Mental:0.5,     Draconic:1,   Normal:2,     Spectral:1,   Fighting:1,   Aether:1,     Crystal:0.5,  Primal:1,     Sonic:1,      Vapor:0.5,    Mineral:0.5,  Toxin:0.5,    Chrono:1,     Stellar:1,    Dream:1 },
  Primal  : { Fire:2,       Aquatic:1,    Nature:0,     Electric:1,   Earth:1,      Wind:1,       Ice:1,        Dark:1,       Fairy:2,      Metal:2,      Poison:1,     Mental:1,     Draconic:0.5, Normal:0.5,   Spectral:0.5, Fighting:1,   Aether:1,     Crystal:1,    Primal:0.5,   Sonic:1,      Vapor:1,      Mineral:1,    Toxin:1,      Chrono:2,     Stellar:2,    Dream:2 },
  Sonic   : { Fire:0.5,     Aquatic:2,    Nature:1,     Electric:1,   Earth:0,      Wind:0.5,     Ice:2,        Dark:2,       Fairy:1,      Metal:1,      Poison:0.5,   Mental:1,     Draconic:1,   Normal:1,     Spectral:1,   Fighting:1,   Aether:1,     Crystal:2,    Primal:1,     Sonic:0.5,    Vapor:1,      Mineral:2,    Toxin:0.5,    Chrono:0.5,   Stellar:1,    Dream:2 },
  Vapor   : { Fire:0.5,     Aquatic:0.5,  Nature:0.5,   Electric:1,   Earth:1,      Wind:0.5,     Ice:2,        Dark:1,       Fairy:1,      Metal:2,      Poison:0.5,   Mental:2,     Draconic:1,   Normal:1,     Spectral:2,   Fighting:1,   Aether:1,     Crystal:0.5,  Primal:1,     Sonic:1,      Vapor:0.5,    Mineral:2,    Toxin:1,      Chrono:1,     Stellar:1,    Dream:2 },
  Mineral : { Fire:0.5,     Aquatic:0.5,  Nature:2,     Electric:1,   Earth:0.5,    Wind:2,       Ice:2,        Dark:1,       Fairy:2,      Metal:1,      Poison:1,     Mental:1,     Draconic:1,   Normal:1,     Spectral:0,   Fighting:1,   Aether:1,     Crystal:0.5,  Primal:1,     Sonic:1,      Vapor:0.5,    Mineral:0.5,  Toxin:1,      Chrono:1,     Stellar:1,    Dream:2 },
  Toxin   : { Fire:0.5,     Aquatic:0.5,  Nature:2,     Electric:1,   Earth:0.5,    Wind:2,       Ice:0.5,      Dark:1,       Fairy:2,      Metal:0,      Poison:0.5,   Mental:2,     Draconic:1,   Normal:2,     Spectral:0,   Fighting:2,   Aether:1,     Crystal:0,    Primal:0.5,   Sonic:0.5,    Vapor:1,      Mineral:0,    Toxin:0.5,    Chrono:1,     Stellar:1,    Dream:2 },
  Chrono  : { Fire:1,       Aquatic:1,    Nature:2,     Electric:1,   Earth:2,      Wind:1,       Ice:1,        Dark:1,       Fairy:0.5,    Metal:1,      Poison:1,     Mental:1,     Draconic:2,   Normal:2,     Spectral:0.5, Fighting:1,   Aether:0.5,   Crystal:1,    Primal:1,     Sonic:2,      Vapor:2,      Mineral:2,    Toxin:2,      Chrono:0.5,   Stellar:0.5,  Dream:2 },
  Stellar : { Fire:0.5,     Aquatic:0.5,  Nature:2,     Electric:1,   Earth:2,      Wind:0.5,     Ice:1,        Dark:2,       Fairy:1,      Metal:0.5,    Poison:1,     Mental:2,     Draconic:2,   Normal:2,     Spectral:1,   Fighting:1,   Aether:2,     Crystal:1,    Primal:1,     Sonic:1,      Vapor:1,      Mineral:1,    Toxin:1,      Chrono:2,     Stellar:0.5,  Dream:1 },
  Dream   : { Fire:1,       Aquatic:1,    Nature:1,     Electric:1,   Earth:0.5,    Wind:0.5,     Ice:1,        Dark:2,       Fairy:2,      Metal:0.5,    Poison:1,     Mental:2,     Draconic:2,   Normal:2,     Spectral:2,   Fighting:2,   Aether:1,     Crystal:0.5,  Primal:1,     Sonic:2,      Vapor:1,      Mineral:0,    Toxin:0.5,    Chrono:2,     Stellar:2,    Dream:0.5 }
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
  scratch:      { name:"Graze",         type:"Normal",   power:40,  acc:100, pp:35, cat:"physical", effect:null,        ec:0,   desc:"Scratches the foe with sharp claws." },
  headbutt:     { name:"Cranial Ram",   type:"Normal",   power:70,  acc:100, pp:15, cat:"physical", effect:"flinch",    ec:30,  desc:"A forceful headbutt that may cause flinching." },
  body_slam:    { name:"Crushing Bulk",  type:"Normal",   power:85,  acc:100, pp:15, cat:"physical", effect:"paralyze",  ec:30,  desc:"Slams the foe with a massive body. May paralyze." },
  hyper_beam:   { name:"Radiance Cannon",    type:"Normal",   power:150, acc:90,  pp:5,  cat:"special",  effect:"recharge",  ec:100, desc:"A powerful beam. Must recharge next turn." },
  quick_attack: { name:"Blitz",  type:"Normal",   power:40,  acc:100, pp:30, cat:"physical", effect:"priority",  ec:0,   desc:"Attacks first with blinding speed." },
  growl:        { name:"Daunt",         type:"Normal",   power:0,   acc:100, pp:40, cat:"status",   effect:"atkdown",   ec:100, desc:"Lowers the foe's Attack." },
  tail_whip:    { name:"Lashing Tail",  type:"Normal",   power:0,   acc:100, pp:30, cat:"status",   effect:"defdown",   ec:100, desc:"Lowers the foe's Defense." },
  leer:         { name:"Baleful Stare", type:"Normal",   power:0,   acc:100, pp:30, cat:"status",   effect:"defdown",   ec:100, desc:"Menacing glare lowers the foe's Defense." },
  recover:      { name:"Second Wind",   type:"Normal",   power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Restores up to half the user's max HP." },
  swords_dance: { name:"War Dance",  type:"Normal",   power:0,   acc:100, pp:20, cat:"status",   effect:"atkup2",    ec:100, desc:"Raises the user's Attack by 2 stages." },
  harden:       { name:"Fortify",       type:"Normal",   power:0,   acc:100, pp:30, cat:"status",   effect:"defup",     ec:100, desc:"Stiffens the body to raise Defense." },
  wild_tumble:  { name:"Wild Tumble",   type:"Normal",   power:60,  acc:100, pp:20, cat:"physical", effect:"spedown",    ec:30,  desc:"Tumbles into the foe wildly with reckless abandon." },
  battle_cry:   { name:"Battle Cry",    type:"Normal",   power:0,   acc:100, pp:20, cat:"status",   effect:"atkup2",    ec:100, desc:"Lets out a ferocious cry that fires up the user's fighting spirit." },
  momentum_rush:{ name:"Momentum Rush", type:"Normal",   power:75,  acc:100, pp:15, cat:"physical", effect:"speup",        ec:30,   desc:"Builds momentum across the field and crashes into the foe at full speed." },
  vital_pulse:  { name:"Vital Pulse",   type:"Normal",   power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Focuses life energy inward to restore the user's vitality." },
  instinct_slash:{ name:"Instinct Slash",type:"Normal",  power:70,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes by pure instinct, always finding a critical spot to exploit." },
  // --- Fire ---
  ember:        { name:"Flicker",       type:"Fire",     power:40,  acc:100, pp:25, cat:"special",  effect:"burn",      ec:10,  desc:"A weak fire attack that may burn." },
  flame_fang:   { name:"Flame Fang",    type:"Fire",     power:65,  acc:95,  pp:15, cat:"physical", effect:"burn",      ec:10,  desc:"Bites with flaming fangs. May burn." },
  flamethrower: { name:"Inferno Jet",  type:"Fire",     power:90,  acc:100, pp:15, cat:"special",  effect:"atkup",      ec:30,  desc:"Shoots a stream of intense fire. May burn." },
  fire_blast:   { name:"Pyroclasm",     type:"Fire",     power:110, acc:85,  pp:5,  cat:"special",  effect:"burn",      ec:10,  desc:"A massive fireball. May burn the target." },
  heat_wave:    { name:"Searing Gale",  type:"Fire",     power:95,  acc:90,  pp:10, cat:"special",  effect:"burn",      ec:10,  desc:"Exhales a wave of scorching heat." },
  inferno:      { name:"Conflagration", type:"Fire",     power:100, acc:85,  pp:5,  cat:"special",  effect:"burn",      ec:100, desc:"A raging inferno that always burns." },
  cinderwhirl:  { name:"Cinderwhirl",   type:"Fire",     power:85,  acc:90,  pp:10, cat:"special",  effect:"spedown",      ec:30,  desc:"Unleashes a spinning tornado of cinders that scorches everything in its path." },
  scorch_veil:  { name:"Scorch Veil",   type:"Fire",     power:0,   acc:100, pp:15, cat:"status",   effect:"burn",      ec:100, desc:"Wraps the user in a veil of burning ash that singes any foe that makes contact." },
  magma_surge:  { name:"Magma Surge",   type:"Fire",     power:90,  acc:85,  pp:10, cat:"special",  effect:"burn",      ec:30,  desc:"Erupts scalding magma from the ground beneath the foe." },
  embercloak:   { name:"Embercloak",    type:"Fire",     power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Cloaks the user in a shell of compressed flame that hardens the body." },
  blazing_rush: { name:"Blazing Rush",  type:"Fire",     power:60,  acc:100, pp:15, cat:"physical", effect:"priority",  ec:0,   desc:"Charges the foe at incredible speed, body engulfed in roaring flames." },
  solar_flare:  { name:"Solar Flare",   type:"Fire",     power:120, acc:80,  pp:5,  cat:"special",  effect:"burn",      ec:50,  desc:"Focuses the heat of the sun into a devastating concentrated beam." },
  char_dance:   { name:"Char Dance",    type:"Fire",     power:0,   acc:100, pp:10, cat:"status",   effect:"dragondance",ec:100,desc:"A fiery war dance that emboldens the user, raising Attack and Speed." },
  // --- Aquatic ---
  water_gun:    { name:"Aquatic Gun",     type:"Aquatic",    power:40,  acc:100, pp:25, cat:"special",  effect:null,        ec:0,   desc:"Squirts water at the foe." },
  aqua_tail:    { name:"Tidal Sweep",     type:"Aquatic",    power:90,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Attacks with a powerful water tail." },
  surf:         { name:"Tidal Rush",          type:"Aquatic",    power:90,  acc:100, pp:15, cat:"special",  effect:null,        ec:0,   desc:"A powerful wave crashes over the foe." },
  hydro_pump:   { name:"Tsunami",       type:"Aquatic",    power:110, acc:80,  pp:5,  cat:"special",  effect:null,        ec:0,   desc:"Blasts the foe with a powerful water jet." },
  bubble_beam:  { name:"Bubble Jet",   type:"Aquatic",    power:65,  acc:100, pp:20, cat:"special",  effect:"spedown",   ec:10,  desc:"Shoots bubbles that may reduce Speed." },
  tidal_crush:  { name:"Tidal Crush",   type:"Aquatic",    power:100, acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Slams the foe with a crushing wall of tide water." },
  whirlpool_dive:{ name:"Whirlpool Dive",type:"Aquatic",   power:80,  acc:95,  pp:15, cat:"physical", effect:"confuse",   ec:20,  desc:"Dives into a churning whirlpool and emerges to slam the foe." },
  frost_current:{ name:"Frost Current", type:"Aquatic",    power:70,  acc:100, pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Fires a current of near-freezing water that slows the target." },
  abyssal_jet:  { name:"Abyssal Jet",   type:"Aquatic",    power:55,  acc:100, pp:20, cat:"special",  effect:"priority",  ec:0,   desc:"Blasts a jet of deep-ocean water at blinding speed." },
  coral_barrage:{ name:"Coral Barrage", type:"Aquatic",    power:75,  acc:90,  pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Hurls a barrage of razor-sharp coral fragments at the foe." },
  sea_serpent_strike:{ name:"Sea Serpent Strike",type:"Aquatic",power:95,acc:90,pp:10,cat:"physical",effect:null,        ec:0,   desc:"A coiling strike mimicking the legendary sea serpent's lethal lunge." },
  tidecaller:   { name:"Tidecaller",    type:"Aquatic",    power:0,   acc:100, pp:15, cat:"status",   effect:"calmup",    ec:100, desc:"Calls upon the tides to bolster the user's special power and resilience." },
  // --- Nature ---
  vine_whip:    { name:"Vine Lash",     type:"Nature",    power:45,  acc:100, pp:25, cat:"physical", effect:null,        ec:0,   desc:"Strikes with long, slender vines." },
  razor_leaf:   { name:"Sharp Leaves",  type:"Nature",    power:55,  acc:95,  pp:25, cat:"physical", effect:"crit",      ec:100, desc:"Slices with razor-edged leaves. High crit." },
  seed_bomb:    { name:"Pod Blast",     type:"Nature",    power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Drops a giant seed bomb on the foe." },
  energy_ball:  { name:"Verdant Orb",   type:"Nature",    power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"A ball of energy drawn from nature." },
  petal_blitz:  { name:"Petal Blitz",   type:"Nature",    power:100, acc:90,  pp:10, cat:"physical", effect:"flinch",        ec:30,   desc:"Strikes with a furious petal storm." },
  sleep_powder: { name:"Slumber Dust",  type:"Nature",    power:0,   acc:75,  pp:15, cat:"status",   effect:"sleep",     ec:100, desc:"Scatters a powder that induces sleep." },
  root_lance:   { name:"Root Lance",    type:"Nature",    power:85,  acc:95,  pp:10, cat:"physical", effect:"defdown",        ec:30,   desc:"Drives an enormous root spear through the ground and up into the foe." },
  canopy_crash: { name:"Canopy Crash",  type:"Nature",    power:90,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Drops a massive section of forest canopy onto the opponent." },
  spore_burst:  { name:"Spore Burst",   type:"Nature",    power:0,   acc:80,  pp:15, cat:"status",   effect:"sleep",     ec:100, desc:"Releases an explosive burst of sleep-inducing spores." },
  thornwall:    { name:"Thornwall",     type:"Nature",    power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Grows a wall of thorns around the user, raising its Defense." },
  verdant_surge:{ name:"Verdant Surge", type:"Nature",    power:110, acc:85,  pp:5,  cat:"special",  effect:"atkup",        ec:30,   desc:"Surges with the full power of living nature in a devastating burst." },
  photon_leaf:  { name:"Photon Leaf",   type:"Nature",    power:70,  acc:100, pp:15, cat:"special",  effect:"crit",      ec:100, desc:"A leaf sharpened by concentrated sunlight that always finds weak points." },
  // --- Electric ---
  thunder_shock:{ name:"Jolt",          type:"Electric", power:40,  acc:100, pp:30, cat:"special",  effect:"paralyze",  ec:10,  desc:"A jolt of electricity. May paralyze." },
  thunderbolt:  { name:"Volt Jet",   type:"Electric", power:90,  acc:100, pp:15, cat:"special",  effect:"paralyze",  ec:10,  desc:"A strong thunderbolt. May paralyze." },
  thunder:      { name:"Stormbolt",     type:"Electric", power:110, acc:70,  pp:10, cat:"special",  effect:"paralyze",  ec:30,  desc:"A massive thunderstrike. May paralyze." },
  thunder_wave: { name:"Stun Pulse",    type:"Electric", power:0,   acc:90,  pp:20, cat:"status",   effect:"paralyze",  ec:100, desc:"A weak electrical charge that paralyzes." },
  spark:        { name:"Static Strike", type:"Electric", power:65,  acc:100, pp:20, cat:"physical", effect:"paralyze",  ec:30,  desc:"Electric tackle. May paralyze." },
  volt_surge:   { name:"Volt Surge",    type:"Electric", power:85,  acc:95,  pp:10, cat:"special",  effect:"spaup",  ec:30,  desc:"A surging wave of voltage that overloads the foe's nervous system." },
  arc_flash:    { name:"Arc Flash",     type:"Electric", power:75,  acc:100, pp:15, cat:"special",  effect:"flinch",    ec:30,  desc:"Produces a blinding flash of electric arcing that may startle the foe." },
  static_cage:  { name:"Static Cage",   type:"Electric", power:0,   acc:90,  pp:15, cat:"status",   effect:"paralyze",  ec:100, desc:"Wraps the foe in a cage of crackling static electricity." },
  overcharge:   { name:"Overcharge",    type:"Electric", power:120, acc:85,  pp:5,  cat:"special",  effect:"recharge",  ec:100, desc:"Releases a catastrophic overcharge of electricity, requiring rest afterward." },
  plasma_strike:{ name:"Plasma Strike", type:"Electric", power:80,  acc:100, pp:10, cat:"physical", effect:"paralyze",  ec:30,  desc:"Surrounds the user's fist in superheated plasma for a shocking punch." },
  charge_burst: { name:"Charge Burst",  type:"Electric", power:0,   acc:100, pp:20, cat:"status",   effect:"atkup",     ec:100, desc:"Charges the body with electric potential, raising the next physical hit's power." },
  // --- Earth ---
  mud_shot:     { name:"Mud Spray",     type:"Earth",   power:55,  acc:95,  pp:15, cat:"special",  effect:"spedown",   ec:100, desc:"Hurls mud at the foe, lowering Speed." },
  earthquake:   { name:"Tectonic Shift", type:"Earth",   power:100, acc:100, pp:10, cat:"physical", effect:null,        ec:0,   desc:"A massive earthquake rattles the field." },
  earth_power:  { name:"Geoblast",      type:"Earth",   power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"The ground heaves beneath the foe." },
  sandstrike:   { name:"Sandstrike",    type:"Earth",   power:60,  acc:100, pp:20, cat:"physical", effect:"spedown",   ec:30,  desc:"Hurls a concentrated blast of cutting sand that slows the foe." },
  fissure_slam: { name:"Fissure Slam",  type:"Earth",   power:100, acc:85,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Slams the ground so hard it opens a fissure beneath the foe." },
  terra_spike:  { name:"Terra Spike",   type:"Earth",   power:80,  acc:95,  pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Drives a spike of compressed earth up through the ground at the foe." },
  dust_veil:    { name:"Dust Veil",     type:"Earth",   power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Surrounds the user in swirling dust that deflects incoming blows." },
  boulder_roll: { name:"Boulder Roll",  type:"Earth",   power:75,  acc:90,  pp:15, cat:"physical", effect:"flinch",    ec:30,  desc:"Curls into a ball and rolls into the foe with terrifying momentum." },
  quicksand_pull:{ name:"Quicksand Pull",type:"Earth",  power:65,  acc:90,  pp:15, cat:"special",  effect:"spedown2",  ec:100, desc:"Conjures a patch of quicksand that drags the foe's legs down." },
  // --- Wind ---
  gust:         { name:"Breeze",        type:"Wind",     power:40,  acc:100, pp:35, cat:"special",  effect:null,        ec:0,   desc:"Blows the foe with a gust of wind." },
  air_slash:    { name:"Wind Scythe",   type:"Wind",     power:75,  acc:95,  pp:15, cat:"special",  effect:"flinch",    ec:30,  desc:"Slices with a blade of air. May flinch." },
  hurricane:    { name:"Typhoon",       type:"Wind",     power:110, acc:70,  pp:10, cat:"special",  effect:"confuse",   ec:30,  desc:"Slams the foe into a violent hurricane." },
  wing_attack:  { name:"Wingbeat",      type:"Wind",     power:60,  acc:100, pp:35, cat:"physical", effect:null,        ec:0,   desc:"Strikes with powerful wings." },
  jetstream:    { name:"Jetstream",     type:"Wind",     power:80,  acc:95,  pp:15, cat:"special",  effect:"spdefdown",   ec:30,  desc:"Fires a focused stream of high-speed air that batters the foe's footing." },
  skyfall:      { name:"Skyfall",       type:"Wind",     power:90,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Ascends to great height and plummets with crushing momentum." },
  cyclone_blade:{ name:"Cyclone Blade", type:"Wind",     power:85,  acc:95,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Spins to form a blade of compressed air and slashes the foe." },
  mistveil:     { name:"Mistveil",      type:"Wind",     power:0,   acc:100, pp:20, cat:"status",   effect:"spedown",   ec:100, desc:"Releases a mist that slows everything caught within it." },
  tailwind_strike:{ name:"Tailwind Strike",type:"Wind",  power:55,  acc:100, pp:20, cat:"physical", effect:"priority",  ec:0,   desc:"Rides a tailwind to smash into the foe before they can react." },
  zephyr_dance: { name:"Zephyr Dance",  type:"Wind",     power:0,   acc:100, pp:15, cat:"status",   effect:"dragondance",ec:100,desc:"A graceful aerial dance that raises Attack and Speed on the wind currents." },
  // --- Ice ---
  powder_snow:  { name:"Flurries",      type:"Ice",      power:40,  acc:100, pp:25, cat:"special",  effect:"freeze",    ec:10,  desc:"Pelts the foe with a hail of snow." },
  ice_beam:     { name:"Cold Beam",     type:"Ice",      power:90,  acc:100, pp:10, cat:"special",  effect:"freeze",    ec:10,  desc:"Fires a beam of ice. May freeze." },
  blizzard:     { name:"Whiteout",      type:"Ice",      power:110, acc:70,  pp:5,  cat:"special",  effect:"freeze",    ec:10,  desc:"A howling blizzard. May freeze." },
  ice_punch:    { name:"Glacial Punch", type:"Ice",      power:75,  acc:100, pp:15, cat:"physical", effect:"freeze",    ec:10,  desc:"A punch with an icy fist. May freeze." },
  icicle_crash: { name:"Frost Crash",  type:"Ice",      power:85,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Drops icicles on the foe. May flinch." },
  glacial_shard:{ name:"Rime Shard", type:"Ice",      power:65,  acc:100, pp:20, cat:"physical", effect:"freeze",    ec:15,  desc:"Fires a razor-sharp shard of glacial ice that may freeze the target." },
  frost_breath: { name:"Cold Snap",     type:"Ice",      power:60,  acc:90,  pp:15, cat:"special",  effect:"freeze",    ec:100, desc:"Exhales a breath of supercooled air that always freezes the foe." },
  permafrost:   { name:"Permafrost",    type:"Ice",      power:0,   acc:100, pp:15, cat:"status",   effect:"spedown2",  ec:100, desc:"Encases the foe's feet in permafrost, drastically reducing Speed." },
  avalanche_drive:{ name:"Avalanche Drive",type:"Ice",   power:95,  acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Surges forward with the full weight of a collapsing avalanche." },
  cryo_lance:   { name:"Cryo Lance",    type:"Ice",      power:80,  acc:95,  pp:15, cat:"special",  effect:"freeze",    ec:10,  desc:"Conjures a lance of pure ice crystal and hurls it at the opponent." },
  winter_shroud:{ name:"Winter Shroud", type:"Ice",      power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Wraps the user in a hardened shroud of ice that bolsters its defenses." },
  // --- Dark ---
  bite:         { name:"Chomp",          type:"Dark",     power:60,  acc:100, pp:25, cat:"physical", effect:"flinch",    ec:30,  desc:"Bites with dark power. May cause flinching." },
  crunch:       { name:"Jaw Crush",        type:"Dark",     power:80,  acc:100, pp:15, cat:"physical", effect:"defdown",   ec:20,  desc:"Crunches with dark fangs. May lower Defense." },
  shadow_ball:  { name:"Nether Sphere",   type:"Dark",     power:80,  acc:100, pp:15, cat:"special",  effect:"spdefdown", ec:20,  desc:"Hurls a shadowy blob. May lower Sp.Def." },
  night_slash:  { name:"Dusk Slash",   type:"Dark",     power:70,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes in the dark. High critical rate." },
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
  sweet_kiss:   { name:"Bewitching Kiss",    type:"Fairy",    power:0,   acc:75,  pp:10, cat:"status",   effect:"confuse",   ec:100, desc:"An angel's kiss that confuses the foe." },
  stardust_veil:{ name:"Stardust Veil", type:"Fairy",    power:0,   acc:100, pp:20, cat:"status",   effect:"calmup",    ec:100, desc:"Wraps the user in drifting stardust that enhances special power and resilience." },
  pixie_bolt:   { name:"Pixie Bolt",    type:"Fairy",    power:75,  acc:100, pp:15, cat:"special",  effect:"confuse",   ec:20,  desc:"Fires a bolt of concentrated pixie energy that scrambles the foe's mind." },
  charm_bloom:  { name:"Charm Bloom",   type:"Fairy",    power:0,   acc:90,  pp:20, cat:"status",   effect:"atkdown",   ec:100, desc:"Releases a bloom of irresistible charm that weakens the foe's will to attack." },
  celestial_wave:{ name:"Celestial Wave",type:"Fairy",   power:90,  acc:95,  pp:10, cat:"special",  effect:"flinch", ec:30,  desc:"Channels the light of distant stars into a sweeping radiant wave." },
  wish_spark:   { name:"Wish Spark",    type:"Fairy",    power:55,  acc:100, pp:25, cat:"special",  effect:null,        ec:0,   desc:"A spark of pure wish-energy that banishes negative feelings and harms the foe." },
  moonveil:     { name:"Moonveil",      type:"Fairy",    power:85,  acc:90,  pp:10, cat:"physical", effect:"spdefdown", ec:20,  desc:"Slashes with a blade woven from moonlight, cutting through special defenses." },
  // --- Metal ---
  steel_wing:   { name:"Metal Wing",    type:"Metal",    power:70,  acc:90,  pp:25, cat:"physical", effect:"defup",     ec:10,  desc:"Strikes with steel wings. May raise Defense." },
  iron_tail:    { name:"Alloy Tail",     type:"Metal",    power:100, acc:75,  pp:15, cat:"physical", effect:"defdown",   ec:30,  desc:"Slams with a steel-hard tail. May lower Defense." },
  flash_cannon: { name:"Forge Blast",  type:"Metal",    power:80,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"Fires a flash of steel-colored light." },
  metal_claw:   { name:"Chrome Claw",    type:"Metal",    power:50,  acc:95,  pp:35, cat:"physical", effect:"atkup",     ec:10,  desc:"Slashes with steel claws. May raise Attack." },
  forge_strike: { name:"Forge Strike",  type:"Metal",    power:90,  acc:95,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Strikes with a blow as powerful as a forge hammer, denting armor." },
  tungsten_ram: { name:"Tungsten Ram",  type:"Metal",    power:110, acc:85,  pp:5,  cat:"physical", effect:"recharge",  ec:100, desc:"Charges with the density of tungsten in a devastating ram that needs recovery." },
  magnetize:    { name:"Magnetize",     type:"Metal",    power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Polarizes the user's body magnetically to repel incoming metal-based attacks." },
  shrapnel_burst:{ name:"Shrapnel Burst",type:"Metal",   power:75,  acc:90,  pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Explodes fragments of sharp metal in all directions to damage the foe." },
  alloy_edge:   { name:"Alloy Edge",    type:"Metal",    power:65,  acc:100, pp:20, cat:"physical", effect:"crit",      ec:100, desc:"Slices with a blade of impossibly sharp layered alloy, always finding weak spots." },
  ironskin:     { name:"Ironskin",      type:"Metal",    power:0,   acc:100, pp:15, cat:"status",   effect:"atkup",     ec:100, desc:"Hardens the surface of the body to the density of pure iron." },
  // --- Poison ---
  poison_sting: { name:"Septic Prick",  type:"Poison",   power:15,  acc:100, pp:35, cat:"physical", effect:"poison",    ec:30,  desc:"Stings with a poisonous stinger." },
  sludge_bomb:  { name:"Ooze Bomb",   type:"Poison",   power:90,  acc:100, pp:10, cat:"special",  effect:"poison",    ec:30,  desc:"Hurls a sludge bomb. May poison." },
  toxic:        { name:"Toxify",         type:"Poison",   power:0,   acc:90,  pp:10, cat:"status",   effect:"badpoison", ec:100, desc:"Badly poisons the foe. Damage worsens each turn." },
  venoshock:    { name:"Virulent Surge",     type:"Poison",   power:65,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Doubles damage if target is poisoned." },
  miasma_cloud: { name:"Miasma Cloud",  type:"Poison",   power:70,  acc:90,  pp:15, cat:"special",  effect:"badpoison", ec:30,  desc:"Releases a dense toxic cloud that seeps into wounds and worsens over time." },
  acid_rain:    { name:"Acid Rain",     type:"Poison",   power:80,  acc:90,  pp:10, cat:"special",  effect:"spdefdown",    ec:30,  desc:"Summons a rain of burning acid that corrodes the foe's body." },
  venom_lance:  { name:"Venom Lance",   type:"Poison",   power:85,  acc:95,  pp:10, cat:"physical", effect:"badpoison", ec:20,  desc:"Drives a concentrated venom spike deep into the foe." },
  toxic_surge:  { name:"Toxic Surge",   type:"Poison",   power:0,   acc:100, pp:15, cat:"status",   effect:"badpoison", ec:100, desc:"Surges venom through the battlefield, severely poisoning the target." },
  sludge_wave:  { name:"Sludge Wave",   type:"Poison",   power:95,  acc:95,  pp:10, cat:"special",  effect:"defdown",    ec:30,  desc:"Unleashes a tidal wave of thick corrosive sludge." },
  putrid_pulse: { name:"Putrid Pulse",  type:"Poison",   power:75,  acc:100, pp:15, cat:"special",  effect:"confuse",   ec:20,  desc:"Emits a nauseating pulse of putrid energy that may disorient the foe." },
  // --- Mental ---
  confusion:    { name:"Mind Jolt",     type:"Mental",  power:50,  acc:100, pp:25, cat:"special",  effect:"confuse",   ec:10,  desc:"A telekinetic attack. May confuse." },
  psybeam:      { name:"Psi Burst",       type:"Mental",  power:65,  acc:100, pp:20, cat:"special",  effect:"confuse",   ec:10,  desc:"Shoots a peculiar ray. May confuse." },
  psychic_move: { name:"Mental",       type:"Mental",  power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"A powerful psychic wave. May lower Sp.Def." },
  psystrike:    { name:"Psi Strike",     type:"Mental",  power:100, acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Materializes psychic power to attack." },
  calm_mind:    { name:"Inner Calm",     type:"Mental",  power:0,   acc:100, pp:20, cat:"status",   effect:"calmup",    ec:100, desc:"Raises Sp.Atk and Sp.Def by 1 stage." },
  mind_shatter: { name:"Synaptic Shatter",  type:"Mental",  power:100, acc:90,  pp:10, cat:"special",  effect:"spdefdown", ec:30,  desc:"Shatters the foe's mental fortitude with a concentrated psychic burst." },
  telepathic_slam:{ name:"Telepathic Slam",type:"Mental",power:85, acc:95,  pp:10, cat:"special",  effect:"spedown",   ec:30,  desc:"Reads the foe's thoughts and strikes using their own fear against them." },
  future_echo:  { name:"Future Echo",   type:"Mental",  power:80,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Sends an echo of future energy that strikes the foe one turn ahead of time." },
  insight_flare:{ name:"Insight Flare", type:"Mental",  power:75,  acc:100, pp:15, cat:"special",  effect:"crit",      ec:100, desc:"Flares with intense mental insight, always finding the critical point." },
  thought_crush:{ name:"Thought Crush", type:"Mental",  power:90,  acc:85,  pp:10, cat:"special",  effect:"defdown", ec:30,  desc:"Crushes the foe's mind with overwhelming psychokinetic force." },
  // --- Draconic ---
  dragon_breath:{ name:"Draconic Breath", type:"Draconic",   power:60,  acc:100, pp:20, cat:"special",  effect:"paralyze",  ec:30,  desc:"Exhales a dragon's breath. May paralyze." },
  dragon_claw:  { name:"Draconic Claw",   type:"Draconic",   power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Slashes with razor-sharp dragon claws." },
  dragon_pulse: { name:"Draconic Pulse",  type:"Draconic",   power:85,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Fires a shockwave of dragon energy." },
  outrage:      { name:"Rampage",       type:"Draconic",   power:120, acc:100, pp:10, cat:"physical", effect:"confuse",   ec:100, desc:"A 2-3 turn rampage. Confuses user after." },
  dragon_dance: { name:"Hydra Dance",  type:"Draconic",   power:0,   acc:100, pp:20, cat:"status",   effect:"dragondance",ec:100,desc:"A ritualistic dance that raises Atk and Speed." },
  wyrm_strike:  { name:"Wyrm Strike",   type:"Draconic",   power:90,  acc:95,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Strikes with the coiled force of an ancient wyrm's tail." },
  draconic_roar:{ name:"Saurian Roar", type:"Draconic",   power:0,   acc:100, pp:15, cat:"status",   effect:"atkdown",   ec:100, desc:"Unleashes a terrifying Saurian Roar that withers the foe's fighting spirit." },
  scale_storm:  { name:"Scale Storm",   type:"Draconic",   power:95,  acc:90,  pp:10, cat:"physical", effect:"flinch",        ec:30,   desc:"Whips a storm of razor-edged dragon scales across the battlefield." },
  ancient_breath:{ name:"Ancient Breath",type:"Draconic",  power:110, acc:85,  pp:5,  cat:"special",  effect:"burn",      ec:30,  desc:"Exhales flame from the lungs of an ancient dragon lineage." },
  eon_crash:    { name:"Eon Crash",     type:"Draconic",   power:100, acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Crashes down with the timeless weight of dragonkind." },
  // --- Earth ---
  rock_throw:   { name:"Stone Throw",    type:"Earth",     power:50,  acc:90,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Hurls a small rock at the foe." },
  rock_slide:   { name:"Stone Slide",    type:"Earth",     power:75,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Large boulders fall on the foe. May flinch." },
  stone_edge:   { name:"Crag Strike",    type:"Earth",     power:100, acc:80,  pp:5,  cat:"physical", effect:"crit",      ec:100, desc:"Stabs with sharp stones. High critical." },
  obsidian_crash:{ name:"Obsidian Crash",type:"Earth",    power:85,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:30,  desc:"Crashes an enormous slab of obsidian onto the foe." },
  geode_burst:  { name:"Geode Burst",   type:"Earth",     power:80,  acc:95,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Hurls a hollow geode that shatters on impact, scattering crystal shards." },
  crystal_lance:{ name:"Crystal Lance", type:"Earth",     power:90,  acc:90,  pp:10, cat:"physical", effect:"crit",      ec:100, desc:"Drives a lance of perfectly formed crystal at the foe with perfect accuracy." },
  granite_wall: { name:"Granite Wall",  type:"Earth",     power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Erects a wall of granite around the user, massively raising Defense." },
  landslide:    { name:"Landslide",     type:"Earth",     power:95,  acc:85,  pp:10, cat:"physical", effect:"spedown",   ec:100, desc:"Triggers a devastating landslide that buries the foe under rubble." },
  // --- Nature ---
  bug_bite:     { name:"Mandible Bite",      type:"Nature",      power:60,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"Bites the foe with bug mandibles." },
  bug_buzz:     { name:"Resonance Hum",      type:"Nature",      power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:10,  desc:"Emits a harsh buzzing sound." },
  x_scissor:    { name:"Shear Strike",     type:"Nature",      power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Slashes the foe in an X shape." },
  string_shot:  { name:"Silk Spray",    type:"Nature",      power:0,   acc:95,  pp:40, cat:"status",   effect:"spedown2",  ec:100, desc:"Binds the foe with string, slowing them." },
  silk_bind:    { name:"Silk Bind",     type:"Nature",      power:55,  acc:95,  pp:20, cat:"physical", effect:"spedown",   ec:100, desc:"Wraps the foe in strong silk threads that bind and slow their movement." },
  mandible_crush:{ name:"Mandible Crush",type:"Nature",     power:85,  acc:95,  pp:10, cat:"physical", effect:"defdown",   ec:20,  desc:"Crushes the foe between massive mandibles with bone-cracking force." },
  swarm_dive:   { name:"Swarm Dive",    type:"Nature",      power:80,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Dives into the foe alongside a swarm of allies in a coordinated assault." },
  venom_drool:  { name:"Venom Drool",   type:"Nature",      power:65,  acc:100, pp:15, cat:"special",  effect:"poison",    ec:30,  desc:"Drools corrosive bug venom that seeps through the foe's defenses." },
  chitin_guard: { name:"Chitin Guard",  type:"Nature",      power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Hardens the chitin exoskeleton to deflect incoming attacks." },
  sonic_buzz:   { name:"Sonic Buzz",    type:"Nature",      power:75,  acc:100, pp:15, cat:"special",  effect:"confuse",   ec:20,  desc:"Produces a disorienting high-frequency buzz that rattles the foe's mind." },

  // --- NEW: Fire (2 more → 15) ---
  ashfall:      { name:"Ashfall",       type:"Fire",     power:70,  acc:100, pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Rains superheated volcanic ash that chokes and slows the target." },
  pyre_fang:    { name:"Pyre Fang",     type:"Fire",     power:85,  acc:95,  pp:10, cat:"physical", effect:"burn",      ec:20,  desc:"Sinks incandescent fangs deep into the foe, leaving smoldering wounds.", rarity:"exclusive" },

  // --- NEW: Aquatic (3 more → 15) ---
  riptide_slam: { name:"Riptide Slam",  type:"Aquatic",    power:85,  acc:95,  pp:10, cat:"physical", effect:"spedown",   ec:30,  desc:"Catches the foe in a violent riptide and slams them into the seabed." },
  geyser_burst: { name:"Geyser Burst",  type:"Aquatic",    power:110, acc:80,  pp:5,  cat:"special",  effect:"burn",      ec:20,  desc:"Erupts a scalding geyser from deep underground that may scald the foe." },
  deepwater_hymn:{ name:"Deepwater Hymn",type:"Aquatic",   power:0,   acc:100, pp:15, cat:"status",   effect:"calmup",    ec:100, desc:"Sings the ancient song of the ocean depths to bolster special power." },

  // --- NEW: Nature (3 more → 15) ---
  briar_lash:   { name:"Briar Lash",    type:"Nature",    power:75,  acc:100, pp:15, cat:"physical", effect:"poison",    ec:20,  desc:"Lashes the foe with thorny briars coated in natural toxin." },
  mycelia_net:  { name:"Mycelia Net",   type:"Nature",    power:0,   acc:90,  pp:15, cat:"status",   effect:"spedown2",  ec:100, desc:"Spreads a web of fungal threads that entangles and drastically slows the target." },
  grove_wrath:  { name:"Grove Wrath",   type:"Nature",    power:100, acc:85,  pp:5,  cat:"physical", effect:"flinch",    ec:30,  desc:"Channels the fury of an ancient forest into a devastating trunk-shattering strike." },

  // --- NEW: Electric (4 more → 15) ---
  dynamo_whip:  { name:"Dynamo Whip",   type:"Electric", power:70,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Cracks a whip of concentrated lightning across the opponent." },
  surge_field:  { name:"Surge Field",   type:"Electric", power:0,   acc:100, pp:15, cat:"status",   effect:"speup",     ec:100, desc:"Charges the ground with electricity, accelerating the user's movements." },
  voltaic_fang: { name:"Voltaic Fang",  type:"Electric", power:85,  acc:95,  pp:10, cat:"physical", effect:"defdown",  ec:30,  desc:"Bites with electrified fangs that discharge thousands of volts." },
  ball_lightning:{ name:"Ball Lightning",type:"Electric", power:95,  acc:90,  pp:10, cat:"special",  effect:"paralyze",  ec:20,  desc:"Conjures a sphere of rogue lightning that drifts toward the foe and detonates." },

  // --- NEW: Earth (6 more → 15) ---
  sinkhole_maw: { name:"Sinkhole Maw",  type:"Earth",   power:85,  acc:90,  pp:10, cat:"physical", effect:"atkdown",   ec:30,  desc:"Opens a gaping sinkhole beneath the foe that swallows them briefly." },
  tremor_stomp: { name:"Tremor Stomp",  type:"Earth",   power:70,  acc:100, pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Stomps the earth with enough force to send shockwaves through the foe's bones." },
  clay_armor:   { name:"Clay Armor",    type:"Earth",   power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Packs the body in layers of hardened clay, sharply raising Defense." },
  sand_geyser:  { name:"Sand Geyser",   type:"Earth",   power:80,  acc:95,  pp:10, cat:"special",  effect:"confuse",   ec:20,  desc:"Blasts the foe with a high-pressure jet of superheated sand." },
  tectonic_slam:{ name:"Tectonic Slam", type:"Earth",   power:110, acc:85,  pp:5,  cat:"physical", effect:"defdown",   ec:20,  desc:"Shifts the tectonic plates beneath the foe with catastrophic force." },
  loam_leech:   { name:"Loam Leech",    type:"Earth",   power:60,  acc:100, pp:15, cat:"special",  effect:"drain",     ec:100, desc:"Drains the foe's energy through the soil, restoring the user's vitality." },

  // --- NEW: Wind (5 more → 15) ---
  downdraft:    { name:"Downdraft",     type:"Wind",     power:65,  acc:100, pp:20, cat:"special",  effect:"spedown",   ec:30,  desc:"Forces a column of heavy air down on the foe, crushing their momentum." },
  thermal_dive: { name:"Thermal Dive",  type:"Wind",     power:90,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Rides a thermal updraft to extreme height, then dives with devastating force." },
  squall_slash: { name:"Squall Slash",  type:"Wind",     power:80,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with wind-hardened feathers during a sudden squall. High crit rate." },
  vortex_trap:  { name:"Vortex Trap",   type:"Wind",     power:0,   acc:85,  pp:15, cat:"status",   effect:"confuse",   ec:100, desc:"Traps the foe in a disorienting vortex that scrambles their senses." },
  gale_cannon:  { name:"Gale Cannon",   type:"Wind",     power:110, acc:80,  pp:5,  cat:"special",  effect:"flinch",    ec:30,  desc:"Compresses air into a devastating lance of wind and fires it at the foe." },

  // --- NEW: Ice (4 more → 15) ---
  hoarfrost_bite:{ name:"Hoarfrost Bite",type:"Ice",     power:70,  acc:100, pp:15, cat:"physical", effect:"atkdown",    ec:30,  desc:"Bites with jaws rimed in hoarfrost that may flash-freeze the wound." },
  sleet_barrage:{ name:"Sleet Barrage", type:"Ice",      power:60,  acc:90,  pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Pelts the foe with a rapid barrage of razor-sharp sleet shards." },
  glacial_tomb: { name:"Tundra Tomb",  type:"Ice",      power:95,  acc:85,  pp:10, cat:"special",  effect:"freeze",    ec:20,  desc:"Encases the foe in a tomb of glacial ice that may leave them frozen." },
  frostfire_veil:{ name:"Frostfire Veil",type:"Ice",     power:0,   acc:100, pp:15, cat:"status",   effect:"calmup",    ec:100, desc:"Wraps the user in a paradoxical veil of freezing flame that sharpens the mind." },

  // --- NEW: Dark (5 more → 15) ---
  umbral_claw:  { name:"Umbral Claw",   type:"Dark",     power:80,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Rakes the foe with claws forged from living shadow. High crit rate." },
  dread_howl:   { name:"Dread Howl",    type:"Dark",     power:0,   acc:100, pp:15, cat:"status",   effect:"spatkdown", ec:100, desc:"Emits a howl of pure dread that saps the foe's will to use special attacks." },
  abyssal_snare:{ name:"Tenebrous Snare", type:"Dark",     power:70,  acc:95,  pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Tendrils of darkness coil around the foe, dragging them into sluggishness." },
  blackout_bomb:{ name:"Blackout Bomb",  type:"Dark",     power:90,  acc:90,  pp:10, cat:"special",  effect:"confuse",   ec:30,  desc:"Detonates a sphere of absolute darkness that disorients everything nearby." },
  soul_rend:    { name:"Soul Rend",     type:"Dark",     power:100, acc:85,  pp:5,  cat:"special",  effect:"spdefdown", ec:30,  desc:"Tears at the foe's spiritual essence, shredding their mental resilience." },

  // --- NEW: Fairy (5 more → 15) ---
  gossamer_lance:{ name:"Gossamer Lance",type:"Fairy",   power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Drives a lance of crystallized fairy light through the foe." },
  aurora_veil:  { name:"Aurora Veil",   type:"Fairy",    power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Wraps the user in shimmering aurora light that deflects attacks." },
  dream_eater:  { name:"Dream Drain",   type:"Fairy",    power:75,  acc:100, pp:15, cat:"special",  effect:"drain",     ec:100, desc:"Devours the foe's pleasant dreams, restoring the user's health." },
  glitter_storm:{ name:"Glitter Storm", type:"Fairy",    power:95,  acc:90,  pp:10, cat:"special",  effect:"spdefdown", ec:30,  desc:"Unleashes a storm of razor-sharp glitter that dazzles and cuts." },
  fae_requiem:  { name:"Fae Requiem",   type:"Fairy",    power:110, acc:80,  pp:5,  cat:"special",  effect:"confuse",   ec:30,  desc:"Sings an ancient fairy requiem that overwhelms the foe's mind." },

  // --- NEW: Metal (5 more → 15) ---
  rivet_barrage:{ name:"Rivet Barrage", type:"Metal",    power:70,  acc:90,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Fires a hail of white-hot rivets from the body at the foe." },
  smelt_crush:  { name:"Smelt Crush",   type:"Metal",    power:95,  acc:90,  pp:10, cat:"physical", effect:"burn",      ec:20,  desc:"Crushes the foe with superheated molten metal arms." },
  temper_edge:  { name:"Temper Edge",   type:"Metal",    power:80,  acc:100, pp:10, cat:"physical", effect:"atkup",     ec:20,  desc:"Strikes with a perfectly tempered blade that hones the user's edge." },
  slag_shield:  { name:"Slag Shield",   type:"Metal",    power:0,   acc:100, pp:15, cat:"status",   effect:"spdefup",     ec:100, desc:"Coats the body in cooling slag that hardens into impenetrable armor." },
  anvil_drop:   { name:"Anvil Drop",    type:"Metal",    power:120, acc:80,  pp:5,  cat:"physical", effect:"flinch",    ec:30,  desc:"Drops from above with the devastating weight of a falling anvil." },

  // --- NEW: Poison (5 more → 15) ---
  blight_mist:  { name:"Blight Mist",   type:"Poison",   power:60,  acc:100, pp:20, cat:"special",  effect:"atkdown",    ec:30,  desc:"Exhales a sickly green mist that infects the foe with creeping blight." },
  corrosion_fang:{ name:"Corrosion Fang",type:"Poison",  power:80,  acc:95,  pp:15, cat:"physical", effect:"defdown",   ec:30,  desc:"Bites with fangs dripping in armor-dissolving corrosive venom." },
  toxin_bloom:  { name:"Toxin Bloom",   type:"Poison",   power:0,   acc:100, pp:10, cat:"status",   effect:"atkup2",    ec:100, desc:"Absorbs ambient toxins to stimulate the body's aggressive potential." },
  nerve_agent:  { name:"Nerve Agent",   type:"Poison",   power:55,  acc:100, pp:20, cat:"special",  effect:"paralyze",  ec:30,  desc:"Releases a fast-acting nerve toxin that locks up the foe's muscles." },
  plague_burst: { name:"Plague Burst",  type:"Poison",   power:100, acc:85,  pp:5,  cat:"special",  effect:"badpoison", ec:50,  desc:"Detonates a concentrated mass of plague spores in a devastating blast." },

  // --- NEW: Mental (5 more → 15) ---
  dreamweave:   { name:"Dreamweave",    type:"Mental",  power:70,  acc:100, pp:15, cat:"special",  effect:"sleep",     ec:20,  desc:"Weaves a psychic web of drowsy imagery that may lull the foe to sleep." },
  cortex_spike: { name:"Cortex Spike",  type:"Mental",  power:85,  acc:95,  pp:10, cat:"special",  effect:"crit",      ec:100, desc:"Drives a spike of psychic force into the foe's cortex. High crit rate." },
  prism_ward:   { name:"Prism Ward",    type:"Mental",  power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Projects a shimmering psychic prism that refracts incoming attacks." },
  neural_storm: { name:"Neural Storm",  type:"Mental",  power:100, acc:85,  pp:5,  cat:"special",  effect:"flinch",   ec:30,  desc:"Unleashes a chaotic storm of psychic impulses that overwhelms the foe's brain." },
  astral_rend:  { name:"Astral Rend",   type:"Mental",  power:90,  acc:95,  pp:10, cat:"special",  effect:"flinch", ec:30,  desc:"Tears the foe's astral form loose, exposing their mental defenses." },

  // --- NEW: Draconic (5 more → 15) ---
  draco_fang:   { name:"Draco Fang",    type:"Draconic",   power:75,  acc:100, pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Sinks draconic fangs infused with primal power into the foe." },
  wyvern_gust:  { name:"Wyvern Gust",   type:"Draconic",   power:65,  acc:100, pp:20, cat:"special",  effect:"spedown",   ec:30,  desc:"Beats wings with dragonfire to blast the foe with scorching wind." },
  primordial_roar:{ name:"Primordial Roar",type:"Draconic", power:0,   acc:100, pp:10, cat:"status",   effect:"atkup2",    ec:100, desc:"Roars with the voice of the first dragon, surging with primal battle fury." },
  drake_rush:   { name:"Drake Rush",    type:"Draconic",   power:90,  acc:95,  pp:10, cat:"physical", effect:"speup",        ec:30,   desc:"Charges forward with draconic speed and slams the foe with full momentum." },
  cataclysm_breath:{ name:"Cataclysm Breath",type:"Draconic",power:130,acc:75, pp:5,  cat:"special",  effect:"burn",      ec:20,  desc:"Exhales a breath of world-ending dragonfire that incinerates everything." },

  // --- NEW: Earth (7 more → 15) ---
  stalactite_drop:{ name:"Stalactite Drop",type:"Earth",   power:70,  acc:95,  pp:15, cat:"physical", effect:"flinch",    ec:30,  desc:"Drops massive stalactites from above that crash down on the foe." },
  fossil_rush:  { name:"Fossil Rush",   type:"Earth",     power:80,  acc:100, pp:10, cat:"physical", effect:null,        ec:0,   desc:"Charges with the hardened force of an ancient fossil embedded in the body." },
  gem_scatter:  { name:"Gem Scatter",   type:"Earth",     power:65,  acc:90,  pp:15, cat:"special",  effect:"spdefdown", ec:20,  desc:"Shatters gemstones and scatters razor-sharp fragments at the foe." },
  bedrock_slam: { name:"Bedrock Slam",  type:"Earth",     power:110, acc:80,  pp:5,  cat:"physical", effect:"recharge",  ec:100, desc:"Slams with the weight of pure bedrock. Must recharge afterward." },
  petrify_gaze: { name:"Petrify Gaze",  type:"Earth",     power:0,   acc:80,  pp:15, cat:"status",   effect:"paralyze",  ec:100, desc:"Fixes the foe with a stony gaze that locks their body in place." },
  sandstone_rush:{ name:"Sandstone Rush",type:"Earth",     power:75,  acc:95,  pp:15, cat:"physical", effect:"spedown",   ec:30,  desc:"Grinds through the foe with a body hardened into rough sandstone." },
  magma_rock:   { name:"Magma Stone",    type:"Earth",     power:85,  acc:90,  pp:10, cat:"special",  effect:"burn",      ec:20,  desc:"Hurls a boulder of still-molten magma rock that scorches on impact." },

  // --- NEW: Nature (5 more → 15) ---
  compound_glare:{ name:"Compound Glare",type:"Nature",     power:0,   acc:100, pp:20, cat:"status",   effect:"spatkdown", ec:100, desc:"Fixes the foe with thousands of compound eyes, unnerving their focus." },
  pheromone_rush:{ name:"Pheromone Rush",type:"Nature",      power:60,  acc:100, pp:20, cat:"physical", effect:"priority",  ec:0,   desc:"Releases attack pheromones and charges with insectile speed." },
  cocoon_burst: { name:"Cocoon Burst",  type:"Nature",      power:85,  acc:95,  pp:10, cat:"special",  effect:"flinch",        ec:30,   desc:"Shatters its cocoon in an explosive burst of metamorphic energy." },
  stinger_volley:{ name:"Stinger Volley",type:"Nature",     power:90,  acc:85,  pp:10, cat:"physical", effect:"poison",    ec:30,  desc:"Fires a volley of venomous stingers in rapid succession." },
  moth_dust:    { name:"Moth Dust",     type:"Nature",      power:0,   acc:85,  pp:15, cat:"status",   effect:"sleep",     ec:100, desc:"Scatters iridescent scales from moth wings that induce deep sleep." },

  // --- SIGNATURE MOVES for remaining legendaries ---
  tempest_wrath:{ name:"Tempest Wrath", type:"Wind",     power:120, acc:85,  pp:5,  cat:"special",  effect:"confuse",   ec:50,  desc:"Signature move of Tempestia. Unleashes the fury of a divine storm that shatters the foe's composure." },
  caldera_meltdown:{ name:"Caldera Meltdown",type:"Fire", power:130, acc:80, pp:5,  cat:"special",  effect:"recharge_and_burnt_out",      ec:100, desc:"Signature move of Volcanox. Triggers a volcanic caldera collapse of apocalyptic heat." },
  temporal_rift:{ name:"Temporal Rift",  type:"Mental",  power:110, acc:90,  pp:5,  cat:"special",  effect:"confuse",   ec:50,  desc:"Signature move of Chronoveil. Tears a rift in time that disorients the foe completely." },
  worldseed_quake:{ name:"Worldseed Quake",type:"Earth", power:120, acc:85, pp:5,  cat:"physical", effect:"defdown",   ec:50,  desc:"Signature move of Terranova. Cracks the earth with the force of a continental seed germinating." },

  // --- ROUND 3: Expanding all types to 22 ---

  // Normal (+5 → 22)
  double_strike: { name:"Double Smash", type:"Normal",   power:50,  acc:95,  pp:20, cat:"physical", effect:null,        ec:0,   desc:"Hits twice in rapid succession with blinding speed." },
  focus_roar:    { name:"Focus Roar",    type:"Normal",   power:0,   acc:100, pp:15, cat:"status",   effect:"spatkup",   ec:100, desc:"Roars with focused intent, sharpening the user's special attack." },
  reckless_charge:{ name:"Reckless Charge",type:"Normal", power:120, acc:100, pp:15, cat:"physical", effect:"recoil",    ec:100, desc:"A reckless full-body charge that also damages the user." },
  endure_pulse:  { name:"Endure Pulse",  type:"Normal",   power:0,   acc:100, pp:10, cat:"status",   effect:"defup",     ec:100, desc:"Pulses with survival energy, steeling the body for the next blow." },
  feral_swipe:   { name:"Feral Swipe",   type:"Normal",   power:65,  acc:100, pp:20, cat:"physical", effect:"atkup",     ec:20,  desc:"A savage swipe driven by primal instinct that may power up the user." },

  // Fire (+6 → 22)
  flash_fire:    { name:"Flash Fire",    type:"Fire",     power:50,  acc:100, pp:25, cat:"special",  effect:"spaup",        ec:30,   desc:"A quick burst of concentrated flame." },
  lava_plume:    { name:"Lava Spout",    type:"Fire",     power:80,  acc:100, pp:15, cat:"special",  effect:"burn",      ec:30,  desc:"Erupts lava in all directions, likely to burn." },
  smolder_trap:  { name:"Smolder Trap",  type:"Fire",     power:0,   acc:90,  pp:15, cat:"status",   effect:"burn",      ec:100, desc:"Lays a trap of smoldering coals that burns the foe." },
  ignition_kick: { name:"Ignition Kick", type:"Fire",     power:90,  acc:95,  pp:10, cat:"physical", effect:"burn",      ec:20,  desc:"Delivers a combustion-powered kick wreathed in ignited air." },
  wildfire_surge:{ name:"Wildfire Surge",type:"Fire",     power:95,  acc:85,  pp:10, cat:"special",  effect:"spedown",      ec:30,  desc:"Unleashes an uncontrollable wildfire that sweeps across the field.", rarity:"exclusive" },
  cinder_lance:  { name:"Cinder Lance",  type:"Fire",     power:75,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Thrusts a lance of compressed cinder at a vital point. High crit rate." },

  // Aquatic (+7 → 22)
  aqua_jet:      { name:"Wave Dash",     type:"Aquatic",    power:40,  acc:100, pp:20, cat:"physical", effect:"priority",  ec:0,   desc:"Strikes first by surrounding the body in water and charging." },
  rain_dance:    { name:"Monsoon",       type:"Aquatic",    power:0,   acc:100, pp:10, cat:"status",   effect:"spatkup",   ec:100, desc:"Calls down rain to boost the user's special attack." },
  torrent_fang:  { name:"Torrent Fang",  type:"Aquatic",    power:80,  acc:95,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Bites with fangs sheathed in pressurized water." },
  whirlpool:     { name:"Maelstrom",     type:"Aquatic",    power:70,  acc:85,  pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Traps the foe in a churning whirlpool that slows their escape." },
  ocean_tempest: { name:"Ocean Tempest", type:"Aquatic",    power:100, acc:80,  pp:5,  cat:"special",  effect:"confuse",   ec:30,  desc:"Summons a furious ocean tempest that batters and confuses." },
  brine_slash:   { name:"Brine Slash",   type:"Aquatic",    power:65,  acc:100, pp:20, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with a blade of crystallized brine. High crit rate." },
  tidal_blessing:{ name:"Marine Blessing",type:"Aquatic",    power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Draws on the ocean's grace to restore the user's vitality." },

  // Grass (+7 → 22)
  leaf_blade:    { name:"Verdant Edge",  type:"Nature",    power:90,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with a blade-sharp leaf. High crit rate." },
  synthesis:     { name:"Regrow",        type:"Nature",    power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Absorbs sunlight to restore the user's health." },
  thorn_barrage: { name:"Thorn Barrage", type:"Nature",    power:70,  acc:95,  pp:15, cat:"physical", effect:"poison",    ec:20,  desc:"Fires a barrage of poisoned thorns at the target." },
  jungle_hammer: { name:"Jungle Hammer",type:"Nature",    power:110, acc:90,  pp:5,  cat:"physical", effect:"recoil",    ec:100, desc:"Slams with a massive jungle root. The impact recoils on the user." },
  pollen_storm:  { name:"Pollen Storm",  type:"Nature",    power:85,  acc:90,  pp:10, cat:"special",  effect:"sleep",     ec:20,  desc:"Whips up a storm of sleep-inducing pollen." },
  root_drain:    { name:"Root Drain",    type:"Nature",    power:75,  acc:100, pp:15, cat:"special",  effect:"drain",     ec:100, desc:"Sends roots into the foe to drain their energy and heal the user." },
  bark_shield:   { name:"Bark Shield",   type:"Nature",    power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Grows a thick bark shield that raises the user's defense." },

  // Electric (+7 → 22)
  wild_charge:   { name:"Voltaic Rush",  type:"Electric", power:90,  acc:100, pp:15, cat:"physical", effect:"recoil",    ec:100, desc:"An electrified reckless tackle that also hurts the user." },
  shock_wave:    { name:"Shock Pulse",   type:"Electric", power:60,  acc:100, pp:20, cat:"special",  effect:null,        ec:0,   desc:"A wave of electricity that never misses." },
  magnet_rise:   { name:"Repulsion Field", type:"Electric", power:0,   acc:100, pp:15, cat:"status",   effect:"speup",     ec:100, desc:"Levitates using electromagnetic force, boosting speed." },
  ion_cannon:    { name:"Ion Cannon",    type:"Electric", power:100, acc:85,  pp:5,  cat:"special",  effect:"spdefdown", ec:30,  desc:"Fires a concentrated beam of ions that shreds special defense." },
  chain_spark:   { name:"Chain Spark",   type:"Electric", power:70,  acc:95,  pp:15, cat:"special",  effect:"paralyze",  ec:20,  desc:"Sparks that chain between targets, likely to paralyze." },
  volt_fang:     { name:"Volt Fang",     type:"Electric", power:75,  acc:95,  pp:15, cat:"physical", effect:"atkdown",  ec:30,  desc:"Bites with electrically charged fangs." },
  discharge:     { name:"Galvanic Burst", type:"Electric", power:80,  acc:100, pp:15, cat:"special",  effect:"spedown",  ec:30,  desc:"Releases a massive electrical discharge in all directions." },

  // Ground (+6 → 22)
  drill_run:     { name:"Auger Strike",  type:"Earth",   power:80,  acc:95,  pp:10, cat:"physical", effect:"crit",      ec:100, desc:"Spins like a drill and crashes into the foe. High crit rate." },
  mud_bomb:      { name:"Mire Burst",    type:"Earth",   power:65,  acc:85,  pp:10, cat:"special",  effect:"spdefdown", ec:30,  desc:"Hurls a large ball of mud that may lower accuracy." },
  scorched_earth:{ name:"Scorched Earth",type:"Earth",   power:90,  acc:90,  pp:10, cat:"special",  effect:"burn",      ec:20,  desc:"Superheats the ground beneath the foe until it scorches." },
  magnitude:     { name:"Aftershock",    type:"Earth",   power:85,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Shakes the ground with varying intensity." },
  sand_tomb:     { name:"Burial Sands",  type:"Earth",   power:55,  acc:85,  pp:15, cat:"physical", effect:"spedown",   ec:100, desc:"Traps the foe in a swirling sand tomb." },
  earthen_wall:  { name:"Earthen Wall",  type:"Earth",   power:0,   acc:100, pp:10, cat:"status",   effect:"defup",     ec:100, desc:"Raises a massive wall of packed earth to shield the user." },

  // Wind (+6 → 22)
  razor_wind:    { name:"Slicing Gale",  type:"Wind",     power:80,  acc:100, pp:10, cat:"special",  effect:"crit",      ec:100, desc:"Fires blades of razor-sharp wind. High crit rate." },
  aerial_ace:    { name:"Falcon Dive",   type:"Wind",     power:60,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"A swift aerial strike that never misses." },
  storm_surge:   { name:"Storm Surge",   type:"Wind",     power:95,  acc:90,  pp:10, cat:"special",  effect:"spedown",   ec:30,  desc:"Unleashes a concentrated surge of storm energy." },
  feather_dance: { name:"Plume Veil",    type:"Wind",     power:0,   acc:100, pp:15, cat:"status",   effect:"atkdown",   ec:100, desc:"Scatters feathers that distract and weaken the foe's attacks." },
  slipstream:    { name:"Slipstream",    type:"Wind",     power:0,   acc:100, pp:15, cat:"status",   effect:"speup",     ec:100, desc:"Rides the slipstream to dramatically boost speed." },
  tornado_slam:  { name:"Tornado Slam",  type:"Wind",     power:100, acc:85,  pp:5,  cat:"physical", effect:"confuse",   ec:30,  desc:"Catches the foe in a tornado and slams them into the ground." },

  // Ice (+7 → 22)
  ice_shard:     { name:"Icy Shot",      type:"Ice",      power:40,  acc:100, pp:30, cat:"physical", effect:"priority",  ec:0,   desc:"Throws shards of ice that strike first." },
  aurora_beam:   { name:"Borealis Ray",  type:"Ice",      power:65,  acc:100, pp:20, cat:"special",  effect:"atkdown",   ec:10,  desc:"Fires a rainbow-colored beam that may lower Attack." },
  freeze_dry:    { name:"Flash Freeze",  type:"Ice",      power:70,  acc:100, pp:20, cat:"special",  effect:"freeze",    ec:10,  desc:"Flash-freezes the moisture around the foe." },
  hail_storm:    { name:"Hail Storm",    type:"Ice",      power:80,  acc:90,  pp:10, cat:"special",  effect:"flinch",    ec:30,  desc:"Summons a brutal hailstorm that batters the foe." },
  icicle_spear:  { name:"Icicle Volley", type:"Ice",      power:75,  acc:95,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Drives a sharp icicle spear into the foe." },
  subzero_slash: { name:"Subzero Slash", type:"Ice",      power:90,  acc:90,  pp:10, cat:"physical", effect:"freeze",    ec:15,  desc:"Slashes with claws cooled to absolute zero." },
  crystal_veil:  { name:"Crystal Veil",  type:"Ice",      power:0,   acc:100, pp:10, cat:"status",   effect:"calmup",    ec:100, desc:"Coats the user in crystal ice that sharpens focus and resilience." },

  // Dark (+7 → 22)
  sucker_punch:  { name:"Cheap Shot",  type:"Dark",     power:70,  acc:100, pp:5,  cat:"physical", effect:"priority",  ec:0,   desc:"Strikes first with a sneaky sucker punch." },
  feint_attack:  { name:"Backstab",  type:"Dark",     power:60,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"Approaches the foe disarmingly, then strikes without warning." },
  shadow_sneak:  { name:"Shade Dash",  type:"Dark",     power:40,  acc:100, pp:30, cat:"physical", effect:"priority",  ec:0,   desc:"Extends shadow to strike the foe before they react." },
  malice_beam:   { name:"Malice Beam",   type:"Dark",     power:85,  acc:95,  pp:10, cat:"special",  effect:"atkdown", ec:30,  desc:"Fires a beam of concentrated malice that erodes mental barriers." },
  dark_shroud:   { name:"Dark Shroud",   type:"Dark",     power:0,   acc:100, pp:15, cat:"status",   effect:"speup",     ec:100, desc:"Cloaks the user in darkness, boosting evasion and speed." },
  phantom_claw:  { name:"Phantom Claw",  type:"Dark",     power:75,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with ghostly claws that find vital points. High crit rate." },
  wicked_blow:   { name:"Savage Blow",   type:"Dark",     power:95,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Delivers a single devastating blow with wicked intent." },

  // Fairy (+7 → 22)
  draining_kiss: { name:"Vampiric Kiss",  type:"Fairy",   power:50,  acc:100, pp:10, cat:"special",  effect:"drain",     ec:100, desc:"Steals the foe's energy with an enchanted kiss." },
  play_rough:    { name:"Roughhouse",    type:"Fairy",    power:90,  acc:90,  pp:10, cat:"physical", effect:"atkdown",   ec:10,  desc:"Plays rough with the foe, lowering their Attack." },
  misty_terrain: { name:"Misty Terrain", type:"Fairy",    power:0,   acc:100, pp:10, cat:"status",   effect:"spdefup",   ec:100, desc:"Covers the field in protective mist that raises special defense." },
  starfall:      { name:"Starfall",      type:"Fairy",    power:80,  acc:95,  pp:15, cat:"special",  effect:"flinch",        ec:30,   desc:"Calls down a shower of starlight that crashes into the foe." },
  enchanted_edge:{ name:"Enchanted Edge",type:"Fairy",    power:70,  acc:100, pp:15, cat:"physical", effect:"spatkdown", ec:20,  desc:"Strikes with a blade imbued with fairy enchantment." },
  radiant_burst: { name:"Radiant Burst", type:"Fairy",    power:100, acc:85,  pp:5,  cat:"special",  effect:"confuse", ec:30,  desc:"Releases a devastating burst of pure fairy radiance." },
  sylvan_song:   { name:"Sylvan Song",   type:"Fairy",    power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Sings an ancient sylvan melody that restores the user's health." },

  // Metal (+7 → 22)
  bullet_punch:  { name:"Piston Jab",  type:"Metal",    power:40,  acc:100, pp:30, cat:"physical", effect:"priority",  ec:0,   desc:"Strikes with a steel fist at blinding speed." },
  gyro_ball:     { name:"Flywheel",     type:"Metal",    power:85,  acc:100, pp:5,  cat:"physical", effect:null,        ec:0,   desc:"Spins and slams into the foe with metallic force." },
  heavy_slam:    { name:"Heavy Slam",    type:"Metal",    power:100, acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Slams into the foe with a heavy metal body." },
  mirror_coat:   { name:"Mirror Plating",   type:"Metal",    power:0,   acc:100, pp:15, cat:"status",   effect:"spdefup",   ec:100, desc:"Polishes the body to a mirror shine, raising special defense." },
  metal_burst:   { name:"Counterforge",   type:"Metal",    power:80,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Fires shrapnel of stored metallic energy at the foe." },
  iron_press:    { name:"Iron Press",    type:"Metal",    power:85,  acc:95,  pp:10, cat:"physical", effect:"defdown",   ec:30,  desc:"Presses down on the foe with crushing metallic weight." },
  chrome_slash:  { name:"Chrome Slash",  type:"Metal",    power:70,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with chrome-plated claws. High crit rate." },

  // Poison (+7 → 22)
  acid_spray:    { name:"Acid Spray",    type:"Poison",   power:40,  acc:100, pp:20, cat:"special",  effect:"spdefdown", ec:100, desc:"Sprays a corrosive acid that sharply lowers special defense." },
  cross_poison:  { name:"Vile Cross",  type:"Poison",   power:70,  acc:100, pp:20, cat:"physical", effect:"poison",    ec:10,  desc:"Slashes with a poisonous blade in a cross pattern." },
  poison_jab:    { name:"Barb Jab",    type:"Poison",   power:80,  acc:100, pp:20, cat:"physical", effect:"poison",    ec:30,  desc:"Jabs with a toxin-coated appendage." },
  toxic_spikes:  { name:"Bane Caltrops",  type:"Poison",   power:0,   acc:100, pp:15, cat:"status",   effect:"poison",    ec:100, desc:"Lays a trap of toxic spikes that poisons on contact." },
  gunk_shot:     { name:"Sludge Cannon",     type:"Poison",   power:120, acc:80,  pp:5,  cat:"physical", effect:"poison",    ec:30,  desc:"Hurls a massive blob of toxic gunk at the foe." },
  venom_shock:   { name:"Caustic Shock",   type:"Poison",   power:65,  acc:100, pp:15, cat:"special",  effect:"paralyze",  ec:20,  desc:"Shocks the foe with venomous electricity." },
  noxious_gas:   { name:"Noxious Gas",   type:"Poison",   power:0,   acc:85,  pp:15, cat:"status",   effect:"badpoison", ec:100, desc:"Releases a cloud of noxious gas that severely poisons." },

  // Mental (+6 → 22)
  zen_headbutt:  { name:"Cortex Ram",  type:"Mental",  power:80,  acc:90,  pp:15, cat:"physical", effect:"flinch",    ec:20,  desc:"Focuses psychic energy into the forehead and rams the foe." },
  psycho_cut:    { name:"Psi Blade",    type:"Mental",  power:70,  acc:100, pp:20, cat:"physical", effect:"crit",      ec:100, desc:"Slashes with psychically sharpened blades. High crit rate." },
  mind_reader:   { name:"Clairvoyance",   type:"Mental",  power:0,   acc:100, pp:10, cat:"status",   effect:"spatkup",   ec:100, desc:"Reads the foe's mind to sharpen the user's special attack." },
  hypnosis:      { name:"Mesmerize",      type:"Mental",  power:0,   acc:60,  pp:20, cat:"status",   effect:"sleep",     ec:100, desc:"Puts the foe to sleep with hypnotic suggestion." },
  psywave:       { name:"Psionic Wave",       type:"Mental",  power:75,  acc:100, pp:15, cat:"special",  effect:null,        ec:0,   desc:"Attacks with a telekinetic wave of force." },
  extrasensory:  { name:"Sixth Sense",  type:"Mental",  power:80,  acc:100, pp:20, cat:"special",  effect:"flinch",    ec:10,  desc:"Attacks with an odd psychic power that may cause flinching." },

  // Draconic (+7 → 22)
  dragon_tail:   { name:"Drake Tail",   type:"Draconic",   power:60,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Slaps the foe with a powerful dragon tail." },
  draco_meteor:  { name:"Comet Crash",  type:"Draconic",   power:130, acc:90,  pp:5,  cat:"special",  effect:"spatkdown", ec:100, desc:"Calls down meteors with draconic power. Lowers user's Sp.Atk." },
  dragon_rush:   { name:"Leviathan Rush",   type:"Draconic",   power:100, acc:75,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Charges the foe with menacing draconic energy." },
  twister:       { name:"Wyrm Gale",       type:"Draconic",   power:40,  acc:100, pp:20, cat:"special",  effect:"confuse",    ec:30,  desc:"Whips up a vicious twister of draconic wind." },
  dragon_rage:   { name:"Serpent Rage",   type:"Draconic",   power:55,  acc:100, pp:15, cat:"special",  effect:null,        ec:0,   desc:"Blasts the foe with an ancient draconic fury." },
  serpent_coil:  { name:"Serpent Coil",   type:"Draconic",   power:0,   acc:100, pp:15, cat:"status",   effect:"atkup",     ec:100, desc:"Coils like a dragon serpent, building power for the next strike." },

  // Rock (+7 → 22)
  ancient_power: { name:"Primeval Force", type:"Earth",    power:60,  acc:100, pp:5,  cat:"special",  effect:"atkup",     ec:10,  desc:"Attacks with prehistoric power that may raise all stats." },
  power_gem:     { name:"Gemburst",      type:"Earth",     power:80,  acc:100, pp:20, cat:"special",  effect:null,        ec:0,   desc:"Fires a ray of light formed from gemstones." },
  rock_blast:    { name:"Basalt Volley",    type:"Earth",     power:70,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Hurls multiple rocks at the foe in rapid succession." },
  smack_down:    { name:"Smack Down",    type:"Earth",     power:50,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Hurls a stone to knock the foe down to earth." },
  diamond_storm: { name:"Diamond Storm", type:"Earth",     power:100, acc:95,  pp:5,  cat:"physical", effect:"defup",     ec:50,  desc:"Whips up a storm of diamonds that may raise Defense." },
  erosion_wave:  { name:"Erosion Wave",  type:"Earth",     power:75,  acc:95,  pp:10, cat:"special",  effect:"defdown",   ec:30,  desc:"Sends a wave of eroding stone particles that wear down defenses." },

  // Bug (+7 → 22)
  fury_cutter:   { name:"Mantis Slash",  type:"Nature",      power:40,  acc:95,  pp:20, cat:"physical", effect:"crit",        ec:100,   desc:"Slashes with scythe-like claws in a fury." },
  signal_beam:   { name:"Lumen Pulse",   type:"Nature",      power:75,  acc:100, pp:15, cat:"special",  effect:"confuse",   ec:10,  desc:"Fires a peculiar signal beam that confuses." },
  leech_life:    { name:"Sap Bite",      type:"Nature",      power:80,  acc:100, pp:10, cat:"physical", effect:"drain",     ec:100, desc:"Drains the foe's blood to restore the user's HP." },
  pin_missile:   { name:"Quill Barrage", type:"Nature",      power:55,  acc:95,  pp:20, cat:"physical", effect:"hits",        ec:0,   desc:"Fires sharp pins at the foe in rapid succession." },
  lunge:         { name:"Maul",          type:"Nature",      power:80,  acc:100, pp:15, cat:"physical", effect:"atkdown",   ec:100, desc:"Lunges at the foe, lowering their Attack on contact." },
  infestation:   { name:"Infestation",   type:"Nature",      power:50,  acc:100, pp:20, cat:"special",  effect:"spedown",   ec:30,  desc:"Infests the foe with parasitic bugs that slow them down." },
  metamorphosis: { name:"Metamorphosis", type:"Nature",      power:0,   acc:100, pp:10, cat:"status",   effect:"calmup",    ec:100, desc:"Undergoes a transformation that sharpens special power and resilience." },

  // ============================================================
  // BATCH 2 — 125 NEW MOVES
  // ============================================================

  // --- Normal (+8) ---
  rapid_strike:     { name:"Rapid Strike",      type:"Normal",   power:50,  acc:100, pp:25, cat:"physical", effect:"crit",    ec:100,  desc:"Unleashes a flurry of rapid blows that may cause flinching." },
  echoing_shout:    { name:"Echoing Shout",     type:"Normal",   power:60,  acc:100, pp:20, cat:"special",  effect:"spdefdown",   ec:30,  desc:"A reverberating shout that rattles the target's defenses." },
  relentless_fury:  { name:"Relentless Fury",   type:"Normal",   power:80,  acc:100, pp:15, cat:"physical", effect:"recoil",    ec:100, desc:"Attacks with reckless fury at the cost of the user's own HP." },
  afterimage:       { name:"Afterimage",        type:"Normal",   power:0,   acc:100, pp:20, cat:"status",   effect:"speup",     ec:100, desc:"Moves so fast it leaves an afterimage, raising the user's Speed." },
  encore_blast:     { name:"Encore Blast",      type:"Normal",   power:90,  acc:100, pp:10, cat:"special",  effect:"spatkup",   ec:30,  desc:"A theatrical burst of energy that may boost the user's Special Attack." },
  last_stand:       { name:"Last Stand",        type:"Normal",   power:120, acc:90,  pp:5,  cat:"physical", effect:"recoil",    ec:100, desc:"A desperate all-or-nothing strike that takes a heavy toll on the user." },
  double_edge:      { name:"All-Out Assault",   type:"Normal",   power:100, acc:100, pp:15, cat:"physical", effect:"recoil",    ec:100, desc:"A reckless life-risking tackle that also damages the user." },

  // --- Fire (+7) ---
  will_o_wisp:      { name:"Hexflame",           type:"Fire",     power:0,   acc:85,  pp:15, cat:"status",   effect:"burn",      ec:100, desc:"Shoots a sinister flame that reliably burns the target." },
  flame_charge:     { name:"Flame Charge",      type:"Fire",     power:50,  acc:100, pp:20, cat:"physical", effect:"speup",     ec:100, desc:"Cloaks the user in flame and charges forward, raising Speed." },
  sun_burst:        { name:"Sun Burst",         type:"Fire",     power:80,  acc:100, pp:15, cat:"special",  effect:"spaup",      ec:30,  desc:"Concentrates solar energy into a burst of searing heat that may burn." },
  molten_tide:      { name:"Molten Tide",       type:"Fire",     power:95,  acc:90,  pp:10, cat:"special",  effect:"spdefdown", ec:30,  desc:"A wave of molten rock that may erode the target's special resistance." },
  eruption:         { name:"Pyroclastic Burst",  type:"Fire",     power:140, acc:85,  pp:5,  cat:"special",  effect:"recoil",    ec:100, desc:"Erupts with volcanic force, dealing immense damage at a cost to the user." },
  infernal_roar:    { name:"Infernal Roar",     type:"Fire",     power:0,   acc:100, pp:15, cat:"status",   effect:"spatkup",   ec:100, desc:"A roar blazing with inner fire, sharply raising the user's Special Attack." },
  fire_spin:        { name:"Flame Spiral",       type:"Fire",     power:35,  acc:85,  pp:15, cat:"special",  effect:"spedown",   ec:100, desc:"Traps the foe in a swirling vortex of fire, slowing it down." },

  // --- Aquatic (+7) ---
  water_pulse:      { name:"Aquatic Pulse",       type:"Aquatic",    power:60,  acc:100, pp:20, cat:"special",  effect:"confuse",   ec:20,  desc:"A pulsing wave of water that may confuse the target." },
  rain_cascade:     { name:"Rain Cascade",      type:"Aquatic",    power:55,  acc:100, pp:20, cat:"special",  effect:null,        ec:0,   desc:"A cascading downpour of rain that never misses its mark." },
  diving_strike:    { name:"Diving Strike",     type:"Aquatic",    power:80,  acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Dives deep then rockets up to slam the foe with crushing force." },
  crabhammer:       { name:"Claw Hammer",       type:"Aquatic",    power:100, acc:90,  pp:10, cat:"physical", effect:"crit",      ec:100, desc:"A massive claw strike at high speed — always finds a critical spot." },
  steam_geyser:     { name:"Steam Geyser",      type:"Aquatic",    power:90,  acc:90,  pp:10, cat:"special",  effect:"burn",      ec:30,  desc:"A column of superheated steam that may burn the target." },
  flood_tide:       { name:"Flood Tide",        type:"Aquatic",    power:0,   acc:100, pp:15, cat:"status",   effect:"calmup",    ec:100, desc:"Rides the rising flood tide, bolstering special power and resilience." },
  ocean_crash:      { name:"Ocean Crash",       type:"Aquatic",    power:120, acc:85,  pp:5,  cat:"physical", effect:"defdown",   ec:30,  desc:"Crashes into the foe with the full force of a collapsing ocean wave." },

  // --- Grass (+7) ---
  bullet_seed:      { name:"Seed Volley",       type:"Nature",    power:65,  acc:100, pp:20, cat:"physical", effect:"hits",        ec:0,   desc:"Forcefully shoots seeds in rapid bursts at the target." },
  magical_leaf:     { name:"Fae Petals",        type:"Nature",    power:60,  acc:100, pp:20, cat:"special",  effect:null,        ec:0,   desc:"Scatters leaves imbued with magical energy that never miss." },
  leech_seed:       { name:"Sap Seed",          type:"Nature",    power:0,   acc:90,  pp:10, cat:"status",   effect:"drain",     ec:100, desc:"Plants a parasitic seed on the foe that saps HP each turn." },
  leaf_storm:       { name:"Foliage Tempest",   type:"Nature",    power:130, acc:90,  pp:5,  cat:"special",  effect:"spatkdown", ec:100, desc:"A savage storm of razor leaves that sharply lowers the user's Sp. Atk." },
  petal_dance:      { name:"Blossom Frenzy",    type:"Nature",    power:120, acc:100, pp:10, cat:"special",  effect:"confuse",   ec:100, desc:"A whirling dance of petals for several turns, then confuses the user." },
  solar_beam:       { name:"Sun Ray",           type:"Nature",    power:120, acc:100, pp:10, cat:"special",  effect:"recharge",  ec:100, desc:"Absorbs sunlight on the first turn, then unleashes a powerful beam." },
  spore_shield:     { name:"Spore Shield",      type:"Nature",    power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Grows a coating of hardened spores over the body, raising Defense." },

  // --- Electric (+7) ---
  nuzzle:           { name:"Nuzzle",            type:"Electric", power:20,  acc:100, pp:20, cat:"physical", effect:"paralyze",  ec:100, desc:"Rubs cheeks against the target, delivering a jolt that always paralyzes." },
  electroweb:       { name:"Shock Net",         type:"Electric", power:55,  acc:95,  pp:15, cat:"special",  effect:"spedown",   ec:100, desc:"Shoots an electric web that snares and slows the target." },
  volt_switch:      { name:"Relay Shock",       type:"Electric", power:70,  acc:100, pp:20, cat:"special",  effect:null,        ec:0,   desc:"Jolts the foe with electricity, then retreats with swift momentum." },
  zap_cannon:       { name:"Arc Cannon",        type:"Electric", power:120, acc:50,  pp:5,  cat:"special",  effect:"paralyze",  ec:100, desc:"An electric cannon blast that always paralyzes but is hard to aim." },
  plasma_fists:     { name:"Tesla Fists",      type:"Electric", power:100, acc:100, pp:15, cat:"physical", effect:null,        ec:0,   desc:"Slams with fists wreathed in crackling plasma for massive damage." },
  rising_voltage:   { name:"Rising Voltage",    type:"Electric", power:70,  acc:100, pp:20, cat:"special",  effect:"burn",      ec:10,  desc:"Charges the air with intensifying voltage that can unpredictably cause burns." },
  thunder_cage:     { name:"Thunder Cage",      type:"Electric", power:80,  acc:90,  pp:15, cat:"special",  effect:"spedown",   ec:30,  desc:"Imprisons the foe in a cage of crackling lightning that slows movement." },

  // --- Ground (+8) ---
  bulldoze:         { name:"Trample",           type:"Earth",   power:60,  acc:100, pp:20, cat:"physical", effect:"spedown",   ec:100, desc:"Stomps the ground heavily, shaking the area and lowering the foe's Speed." },
  sand_attack:      { name:"Dust Toss",         type:"Earth",   power:0,   acc:100, pp:15, cat:"status",   effect:"atkdown",   ec:100, desc:"Kicks sand into the foe's face, impairing its offensive precision." },
  bone_rush:        { name:"Bone Barrage",      type:"Earth",   power:65,  acc:90,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Strikes the foe 2–5 times in rapid succession with a hard bone." },
  scorched_sand:    { name:"Scorched Sand",     type:"Earth",   power:70,  acc:100, pp:15, cat:"special",  effect:"atkdown",      ec:30,  desc:"Fires scorching superheated sand that may leave burns on contact." },
  underground_slam: { name:"Underground Crush",  type:"Earth",   power:80,  acc:100, pp:15, cat:"physical", effect:"flinch",    ec:30,  desc:"Burrows underground and erupts beneath the foe for a bone-crunching slam." },
  quicksand_trap:   { name:"Quicksand Trap",    type:"Earth",   power:0,   acc:90,  pp:15, cat:"status",   effect:"spedown2",  ec:100, desc:"Sucks the foe into quicksand, drastically reducing its Speed." },
  bone_club:        { name:"Bone Cudgel",       type:"Earth",   power:65,  acc:85,  pp:20, cat:"physical", effect:"flinch",    ec:10,  desc:"Strikes the foe with a club-like bone. May cause flinching." },

  // --- Wind (+7) ---
  breeze_blade:     { name:"Breeze Blade",      type:"Wind",     power:50,  acc:100, pp:20, cat:"physical", effect:"crit",      ec:100, desc:"Slices with focused wind so precisely it always finds a critical spot." },
  gale_strike:      { name:"Gale Strike",       type:"Wind",     power:70,  acc:100, pp:20, cat:"physical", effect:"speup",    ec:30,  desc:"A powerful strike backed by gale-force winds that may cause flinching." },
  vacuum_wave:      { name:"Suction Wave",      type:"Wind",     power:40,  acc:100, pp:30, cat:"special",  effect:"priority",  ec:0,   desc:"Creates a vacuum wave that strikes before the foe can react." },
  aerial_slam:      { name:"Aerial Slam",       type:"Wind",     power:90,  acc:95,  pp:10, cat:"physical", effect:"defdown",    ec:30,  desc:"Soars high then slams the foe with the full force of a high-altitude dive." },
  stratosphere_drop:{ name:"Stratosphere Drop", type:"Wind",     power:120, acc:85,  pp:5,  cat:"special",  effect:"recoil",    ec:100, desc:"Ascends to the stratosphere and releases a shockwave of compressed air." },
  whirlwind_force:  { name:"Whirlwind Force",   type:"Wind",     power:0,   acc:100, pp:20, cat:"status",   effect:"defdown",   ec:100, desc:"A relentless whirlwind that shreds through the target's guard." },
  wind_barrier:     { name:"Wind Barrier",      type:"Wind",     power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Wraps the body in a spinning shell of compressed wind, bolstering defense." },

  // --- Ice (+8) ---
  frost_bite:       { name:"Frost Bite",        type:"Ice",      power:60,  acc:95,  pp:15, cat:"physical", effect:"freeze",    ec:10,  desc:"Bites down with frost-coated fangs. May freeze the target." },
  aurora_blast:     { name:"Aurora Blast",      type:"Ice",      power:80,  acc:100, pp:15, cat:"special",  effect:"spdefdown",    ec:30,  desc:"A brilliant aurora-hued blast of frozen energy that may freeze." },
  ice_hammer:       { name:"Ice Hammer",        type:"Ice",      power:100, acc:90,  pp:10, cat:"physical", effect:"spedown",   ec:100, desc:"Slams with a fist of solid ice. Devastating power that slows the user." },
  sheer_cold:       { name:"Absolute Zero",     type:"Ice",      power:0,   acc:30,  pp:5,  cat:"special",  effect:"freeze",    ec:100, desc:"An intense cold snap of absolute zero. Rarely lands, but always freezes." },
  snow_veil:        { name:"Snow Veil",         type:"Ice",      power:0,   acc:100, pp:20, cat:"status",   effect:"spdefup",   ec:100, desc:"Cloaks the body in swirling snow that bolsters special defense." },
  glacial_lance:    { name:"Glacial Lance",     type:"Ice",      power:120, acc:95,  pp:5,  cat:"physical", effect:null,        ec:0,   desc:"Conjures a massive lance of glacial ice and hurls it at the foe." },
  hail_barrage:     { name:"Hail Barrage",      type:"Ice",      power:65,  acc:90,  pp:15, cat:"special",  effect:"flinch",    ec:20,  desc:"Pelts the foe with a relentless barrage of sharp hailstones." },
  cryogenic_breath: { name:"Cryogenic Breath",  type:"Ice",      power:85,  acc:90,  pp:10, cat:"special",  effect:"spaup",    ec:30,  desc:"Exhales a breath of cryogenic air cold enough to instantly freeze." },

  // --- Dark (+8) ---
  taunt:            { name:"Provoke",             type:"Dark",     power:0,   acc:100, pp:20, cat:"status",   effect:"atkdown",   ec:100, desc:"Provokes the target with taunts, rattling their composure and lowering Attack." },
  pursuit:          { name:"Run Down",           type:"Dark",     power:40,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"Relentlessly pursues the foe, cutting off any attempt to flee." },
  throat_chop:      { name:"Throat Chop",       type:"Dark",     power:80,  acc:100, pp:15, cat:"physical", effect:"atkdown",   ec:100, desc:"Strikes the foe in the throat, disabling their offensive capabilities." },
  nasty_plot:       { name:"Sinister Scheme",        type:"Dark",     power:0,   acc:100, pp:20, cat:"status",   effect:"spatkup",   ec:100, desc:"Schemes devious plots that sharply raise the user's Special Attack." },
  dark_void:        { name:"Null Void",         type:"Dark",     power:0,   acc:80,  pp:10, cat:"status",   effect:"sleep",     ec:100, desc:"Drags the foe into a void of darkness, pulling them into deep slumber." },
  wicked_torrent:   { name:"Wicked Torrent",    type:"Dark",     power:95,  acc:100, pp:10, cat:"special",  effect:"spedown", ec:30,  desc:"Unleashes a torrent of wicked dark energy that may erode special defenses." },
  shadow_force:     { name:"Wraith Drive",      type:"Dark",     power:120, acc:100, pp:5,  cat:"physical", effect:null,        ec:0,   desc:"Vanishes into shadow then reappears to deliver a devastating strike." },
  abyss_stare:      { name:"Abyss Stare",       type:"Dark",     power:0,   acc:100, pp:15, cat:"status",   effect:"spatkdown", ec:100, desc:"Fixes the target with a gaze from the bottomless abyss, sapping special power." },

  // --- Fairy (+7) ---
  disarming_voice:  { name:"Disarming Voice",   type:"Fairy",    power:40,  acc:100, pp:15, cat:"special",  effect:null,        ec:0,   desc:"A melodic cry that never misses and disarms the foe's heart." },
  charm:            { name:"Beguile",             type:"Fairy",    power:0,   acc:100, pp:20, cat:"status",   effect:"atkdown",   ec:100, desc:"Charms the foe with cuteness, sharply lowering its Attack." },
  moonlight:        { name:"Moonglow",         type:"Fairy",    power:0,   acc:100, pp:10, cat:"status",   effect:"heal50",    ec:100, desc:"Bathes in moonlight to restore the user's HP." },
  misty_explosion:  { name:"Misty Explosion",   type:"Fairy",    power:100, acc:100, pp:5,  cat:"special",  effect:"recoil",    ec:100, desc:"Explodes in a burst of mystic mist, dealing heavy damage at a cost." },
  sparkling_aria:   { name:"Glimmering Song",    type:"Fairy",    power:90,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Sings a sparkling aria that resonates with magical force." },
  light_of_ruin:    { name:"Fairy Blast",     type:"Fairy",    power:140, acc:90,  pp:5,  cat:"special",  effect:"recoil",    ec:100, desc:"Draws in destructive light for a catastrophic blast at the user's expense." },
  fairy_lock:       { name:"Sprite Lock",        type:"Fairy",    power:0,   acc:100, pp:15, cat:"status",   effect:"spedown",   ec:100, desc:"Seals the battlefield with fairy magic, slowing the foe with mystical bonds." },

  // --- Metal (+7) ---
  metal_sound:      { name:"Grating Din",       type:"Metal",    power:0,   acc:85,  pp:40, cat:"status",   effect:"spdefdown", ec:100, desc:"Scrapes metal to produce a horrible sound that sharply lowers Sp. Def." },
  iron_defense:     { name:"Bulwark",      type:"Metal",    power:0,   acc:100, pp:15, cat:"status",   effect:"defup",     ec:100, desc:"Hardens the body like iron, sharply raising the user's Defense." },
  magnet_bomb:      { name:"Magnetic Mine",       type:"Metal",    power:60,  acc:100, pp:20, cat:"physical", effect:null,        ec:0,   desc:"Launches a magnetic bomb that homes in on the target and never misses." },
  smart_strike:     { name:"Smart Strike",      type:"Metal",    power:70,  acc:100, pp:10, cat:"physical", effect:null,        ec:0,   desc:"Strikes with calculated precision — never missing its mark." },
  sunsteel_strike:  { name:"Solar Impact",   type:"Metal",    power:100, acc:100, pp:10, cat:"physical", effect:null,        ec:0,   desc:"Charges with the force of a meteorite, ignoring the target's defenses." },
  titan_blade:      { name:"Titan Blade",       type:"Metal",    power:110, acc:90,  pp:10, cat:"physical", effect:"recoil",    ec:100, desc:"Swings a blade of titanic steel with overwhelming force, damaging the user too." },
  steel_roller:     { name:"Metal Roller",      type:"Metal",    power:130, acc:90,  pp:5,  cat:"physical", effect:"defdown",   ec:30,  desc:"Rolls over the foe with massive steel momentum, crushing through their guard." },

  // --- Poison (+7) ---
  poison_powder:    { name:"Pestilent Dust",     type:"Poison",   power:0,   acc:75,  pp:35, cat:"status",   effect:"poison",    ec:100, desc:"Scatters toxic powder that poisons the target on contact." },
  toxic_thread:     { name:"Toxic Thread",      type:"Poison",   power:0,   acc:100, pp:20, cat:"status",   effect:"poison",    ec:100, desc:"Shoots a thread laced with venom that poisons and entangles the foe." },
  coil:             { name:"Coil",              type:"Poison",   power:0,   acc:100, pp:20, cat:"status",   effect:"atkup",     ec:100, desc:"Coils up tightly, raising Attack and focus for the coming battle." },
  gunk_blast:       { name:"Gunk Blast",        type:"Poison",   power:120, acc:85,  pp:5,  cat:"special",  effect:"spdefdown",    ec:30,  desc:"Blasts the foe with a surge of concentrated toxins that may poison." },
  corrosive_rain:   { name:"Corrosive Rain",    type:"Poison",   power:80,  acc:100, pp:10, cat:"special",  effect:"defdown",    ec:30,  desc:"Summons a rain of corrosive acid that may poison the target." },
  blight_drain:     { name:"Blight Drain",      type:"Poison",   power:75,  acc:100, pp:15, cat:"special",  effect:"drain",     ec:100, desc:"Fires blighted energy that saps the foe's life force to restore the user's HP." },

  // --- Mental (+8) ---
  cosmic_power:     { name:"Astral Guard",      type:"Mental",  power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Absorbs the energy of the cosmos to raise the user's Defense and resilience." },
  stored_power:     { name:"Latent Force",      type:"Mental",  power:60,  acc:100, pp:10, cat:"special",  effect:"spatkup",   ec:30,  desc:"Unleashes stored psychic energy — the more the user is powered up, the harder it hits." },
  expanding_force:  { name:"Expanding Force",   type:"Mental",  power:80,  acc:100, pp:10, cat:"special",  effect:null,        ec:0,   desc:"Unleashes a psychic force that expands outward to blanket the target." },
  psy_blast:        { name:"Psy Blast",         type:"Mental",  power:120, acc:90,  pp:5,  cat:"special",  effect:"spdefdown", ec:30,  desc:"A concentrated psychic beam that may crack the target's mental defenses." },
  mind_burst:       { name:"Noetic Burst",        type:"Mental",  power:85,  acc:100, pp:10, cat:"special",  effect:"spaup", ec:30,  desc:"Causes an explosive burst inside the target's mind, weakening special defenses." },
  future_sight:     { name:"Prophecy",      type:"Mental",  power:120, acc:100, pp:10, cat:"special",  effect:"recharge",  ec:100, desc:"Focuses psychic power that strikes the foe two turns later with tremendous force." },
  gravitational_pull:{ name:"Gravitational Pull",type:"Mental", power:0,   acc:90,  pp:20, cat:"status",   effect:"spedown2",  ec:100, desc:"Warps gravity around the foe, drastically reducing its Speed." },
  thought_wave:     { name:"Thought Wave",      type:"Mental",  power:50,  acc:100, pp:20, cat:"special",  effect:"spaup",   ec:30,  desc:"Sends disruptive thought waves that may leave the target confused." },

  // --- Draconic (+7) ---
  scale_shot:       { name:"Scale Shot",        type:"Draconic",   power:65,  acc:90,  pp:20, cat:"physical", effect:"speup",     ec:100, desc:"Fires sharp scales as projectiles, raising the user's Speed afterward." },
  dual_chop:        { name:"Twin Chop",         type:"Draconic",   power:40,  acc:90,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Strikes the target twice in swift succession with dragon-like precision." },
  breaking_swipe:   { name:"Breaking Swipe",    type:"Draconic",   power:60,  acc:100, pp:15, cat:"physical", effect:"atkdown",   ec:100, desc:"Sweeps the foe with a dragon's tail, always lowering their Attack." },
  clanging_scales:  { name:"Scale Crash",   type:"Draconic",   power:110, acc:100, pp:5,  cat:"special",  effect:"spdefdown", ec:100, desc:"Clashes the user's scales to release a deafening sound that lowers Sp. Def." },
  eternabeam:       { name:"Abyss Ray",        type:"Draconic",   power:160, acc:90,  pp:5,  cat:"special",  effect:"recharge",  ec:100, desc:"The most powerful attack a dragon can use — must rest on the following turn." },
  dragon_ascent:    { name:"Sky Surge",     type:"Draconic",   power:120, acc:100, pp:5,  cat:"physical", effect:"defdown",   ec:100, desc:"Ascends with dragon power and crashes down, lowering the user's defenses." },
  dragon_maw:       { name:"Wyvern Maw",        type:"Draconic",   power:85,  acc:95,  pp:10, cat:"physical", effect:"flinch",    ec:20,  desc:"Snaps with powerful dragon jaws. The sheer force may cause flinching." },

  // --- Rock (+8) ---
  stealth_rock:     { name:"Embedded Spike",      type:"Earth",     power:0,   acc:100, pp:20, cat:"status",   effect:"atkdown",   ec:100, desc:"Lays a trap of razor-sharp rocks that weakens foes as they enter battle." },
  rock_polish:      { name:"Mineral Polish",       type:"Earth",     power:0,   acc:100, pp:20, cat:"status",   effect:"speup",     ec:100, desc:"Polishes the body's rocky surface until frictionless, sharply raising Speed." },
  diamond_crash:    { name:"Diamond Crash",     type:"Earth",     power:100, acc:95,  pp:10, cat:"physical", effect:null,        ec:0,   desc:"Crashes into the foe with crystalline diamond hardness." },
  ancient_tide:     { name:"Ancient Tide",      type:"Earth",     power:75,  acc:95,  pp:15, cat:"special",  effect:"defdown",   ec:20,  desc:"Unleashes a wave of ancient stone energy that may erode the foe's defenses." },
  meteor_strike:    { name:"Meteor Strike",     type:"Earth",     power:140, acc:85,  pp:5,  cat:"special",  effect:"recharge",  ec:100, desc:"Calls down a meteorite from above. Must rest on the following turn." },
  stone_axe:        { name:"Stone Cleave",         type:"Earth",     power:65,  acc:90,  pp:15, cat:"physical", effect:null,        ec:0,   desc:"Strikes with the cleaving force of a stone axe, splitting through armor." },
  rock_wrecker:     { name:"Boulder Wrecker",      type:"Earth",     power:150, acc:90,  pp:5,  cat:"physical", effect:"recharge",  ec:100, desc:"A devastating rock-shattering blow that requires rest on the next turn." },
  crystal_spear:    { name:"Crystal Spear",     type:"Earth",     power:80,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"A spear of pure crystal that always strikes a critical point." },

  // --- Bug (+7) ---
  quiver_dance:     { name:"Quiver Dance",      type:"Nature",      power:0,   acc:100, pp:20, cat:"status",   effect:"calmup",    ec:100, desc:"A mystical dance that raises the user's special power, resilience, and Speed." },
  sticky_web:       { name:"Sticky Web",        type:"Nature",      power:0,   acc:100, pp:20, cat:"status",   effect:"spedown",   ec:100, desc:"Shoots a sticky web that significantly slows the target." },
  twineedle:        { name:"Twin Sting",        type:"Nature",      power:50,  acc:100, pp:20, cat:"physical", effect:"poison",    ec:20,  desc:"Stings the foe twice with a sharp stinger. May poison." },
  attack_order:     { name:"Swarm Strike",      type:"Nature",      power:90,  acc:100, pp:15, cat:"physical", effect:"crit",      ec:100, desc:"Commands bug allies to swarm the foe — their unified assault always finds weak points." },
  swarm_fury:       { name:"Locust Fury",        type:"Nature",      power:80,  acc:100, pp:15, cat:"physical", effect:"recoil",    ec:100, desc:"An unrelenting swarming assault that exhausts the user as well." },
  cocoon_guard:     { name:"Cocoon Guard",      type:"Nature",      power:0,   acc:100, pp:20, cat:"status",   effect:"defup",     ec:100, desc:"Wraps the body in a hardened cocoon shell, dramatically raising Defense." },
  hivemind_surge:   { name:"Hivemind Surge",    type:"Nature",      power:110, acc:90,  pp:10, cat:"special",  effect:"spaup",        ec:30,   desc:"Channels the collective power of a hivemind into a single devastating burst." },

  // ============================================================
  // LEGENDARY SIGNATURE MOVES (+7)
  // ============================================================

  // Tempestarch — Electric/Wind sovereign
  storm_sovereignty:      { name:"Storm Sovereignty",      type:"Electric", power:130, acc:90,  pp:5,  cat:"special",  effect:"paralyze",  ec:50,  desc:"Tempestarch's ultimate technique — asserts dominion over all storms, paralyzing foes with sovereign lightning." },
  // Chronoveil — Mental/Draconic time weaver
  temporal_collapse:      { name:"Temporal Collapse",      type:"Mental",  power:120, acc:90,  pp:5,  cat:"special",  effect:"confuse",   ec:50,  desc:"Chronoveil collapses the flow of time around the target, leaving them disoriented and confused." },
  // Ashvanus — Fire/Rock volcano titan
  volcanic_wrath:         { name:"Volcanic Wrath",         type:"Fire",     power:140, acc:85,  pp:5,  cat:"special",  effect:"burn",      ec:100, desc:"Pyrovanus channels the full fury of a super-volcano, always severely burning the target." },
  // Abyssovex — Aquatic/Dark abyss drake
  abyssal_dominion:       { name:"Abyssal Dominion",       type:"Dark",     power:130, acc:90,  pp:5,  cat:"special",  effect:"spdefdown", ec:50,  desc:"Thalassovex asserts dominion over the deep abyss, crushing the target's psychic defenses." },
  // Gaiavorn — Ground/Grass land spirit
  world_root_bind:        { name:"World Root Bind",        type:"Earth",   power:130, acc:90,  pp:5,  cat:"physical", effect:"spedown",   ec:100, desc:"Gaiavorn erupts roots from the world's core to bind and crush the target." },
  // Voidraxis — Dark/Fairy void star
  starlight_obliteration: { name:"Starlight Obliteration", type:"Dark",     power:150, acc:85,  pp:5,  cat:"special",  effect:"recoil",    ec:100, desc:"Voidraxis extinguishes entire stars and channels their death into a single point of annihilation." },
  // Dragemian — Draconic/Fire emperor
  emperor_inferno:        { name:"Emperor Inferno",        type:"Draconic",   power:140, acc:90,  pp:5,  cat:"physical", effect:"burn",      ec:100, desc:"Dragemian, lord of all dragons, breathes the emperor's eternal flame — always scorches the target." },

  // NG+ Signature Moves
  // Cosmoveil (401) — Mental/Fairy cosmos strike
  cosmic_veil:      { name:"Cosmic Veil",     type:"Aether" , power:140, acc:90,  pp:5,  cat:"special",  effect:"spdefdown", ec:50, desc:"Cosmoveil wraps the battlefield in condensed starlight, crushing the foe's mind and spirit." },
  // Eondrake (392) — Draconic/Mental time fracture
  time_fracture:    { name:"Time Fracture",   type:"Draconic",  power:130, acc:90,  pp:5,  cat:"special",  effect:"spedown2",  ec:50, desc:"Eondrake shatters the flow of time around the target, massively reducing its speed." },
  // Primordiax (400) — Fire/Ground mantle surge
  mantle_surge:     { name:"Mantle Surge",    type:"Earth",  power:135, acc:85,  pp:5,  cat:"physical", effect:"defdown",   ec:50, desc:"Primordiax channels the planet's mantle into a cataclysmic ground surge that weakens all defenses." },
  // Voidcrown (398) — Dark/Fairy void dominion
  void_dominion:    { name:"Void Dominion",   type:"Dark",    power:135, acc:90,  pp:5,  cat:"special",  effect:"atkdown",   ec:50, desc:"Voidcrown exerts absolute dominion over the void, draining the target's will to fight." },
  // Veildrak (404) — Draconic/Mental pseudo signature
  veil_collapse:    { name:"Veil Collapse",   type:"Mental", power:120, acc:95,  pp:10, cat:"special",  effect:"defdown",   ec:30, desc:"Veildrak tears the psychic veil protecting the target's mind, leaving it confused and vulnerable." },
  // Voidwarden (407) — Dark/Metal pseudo signature
  warden_strike:    { name:"Warden Strike",   type:"Metal",   power:120, acc:95,  pp:10, cat:"physical", effect:"defdown",   ec:50, desc:"Voidwarden strikes with the full force of a guardian of worlds, shattering defensive stances." },
  // --- Spectral (signature moves for Forgotten Lumori) ---
  spirit_strike:    { name:"Spirit Strike",   type:"Spectral",   power:80,  acc:95,  pp:15, cat:"physical", effect:"flinch",    ec:20, desc:"Strikes with a surge of spectral force that rattles the target to its core." },
  specter_pulse:    { name:"Specter Pulse",   type:"Spectral",   power:90,  acc:100, pp:10, cat:"special",  effect:"spdefdown", ec:20, desc:"Fires a concentrated pulse of spectral energy that erodes the target's special defenses." },
  haunting_cry:     { name:"Haunting Cry",    type:"Spectral",   power:0,   acc:100, pp:15, cat:"status",   effect:"atkdown",   ec:100,desc:"An otherworldly wail that weakens the target's will to strike." },
  phantom_force:    { name:"Phantom Force",   type:"Spectral",   power:110, acc:90,  pp:5,  cat:"physical", effect:"confuse",   ec:30, desc:"Phases through reality to strike with ghostly force, leaving the target disoriented." },
  // --- Fighting (signature moves for Forgotten Lumori) ---
  power_drive:      { name:"Power Drive",     type:"Fighting",power:80,  acc:100, pp:15, cat:"physical", effect:"flinch",    ec:20, desc:"Drives forward with concentrated fighting power that rocks the target off balance." },
  iron_cleave:      { name:"Iron Cleave",     type:"Fighting",power:95,  acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20, desc:"Cleaves through armor and fortitude alike with raw physical mastery." },
  seismic_force:    { name:"Seismic Force",   type:"Fighting",power:120, acc:85,  pp:5,  cat:"special",  effect:"recharge",  ec:100,desc:"Channels fighting spirit into a devastating force wave. Must recharge next turn." },
  // --- Flying (signature moves for Forgotten Lumori) ---
  aerial_assault:   { name:"Aerial Assault",  type:"Wind",  power:85,  acc:90,  pp:10, cat:"physical", effect:"atkdown",    ec:30, desc:"Dives from great heights and slams into the foe with aerial precision." },
  sky_dive:         { name:"Sky Dive",         type:"Wind",  power:100, acc:90,  pp:10, cat:"physical", effect:"priority",  ec:0,  desc:"Plunges from the heavens with staggering speed, always striking first." },

  // --- Cosmic (signature moves for Forgotten Lumori) ---
  aura_veil_strike: { name:"Aura Veil Strike", type:"Aether",  power:85,  acc:100, pp:15, cat:"special",  effect:"defup",     ec:30, desc:"Auravian wraps itself in stellar light and fires a focused cosmic beam, the energy hardening into a protective shell around it." },
  aether_shock:     { name:"Aether Shock",     type:"Aether",  power:90,  acc:95,  pp:10, cat:"special",  effect:"paralyze",  ec:20, desc:"Aetherveil releases a pulse of raw aetheric energy that crackles through the target's nervous system." },
  cosmic_dust:      { name:"Cosmic Dust",      type:"Aether",  power:85,  acc:100, pp:15, cat:"special",  effect:"spatkdown", ec:30, desc:"Cosmolith scatters ancient stellar matter across the battlefield, clouding the opponent's senses and dulling their power." },
  celestial_forge:  { name:"Celestial Forge",  type:"Aether",  power:140, acc:90,  pp:5,  cat:"physical", effect:"recoil",    ec:100,desc:"Celestrix compresses starlight into a solid weapon and delivers a strike that scorches reality. The feedback tears at the wielder." },
  star_cannon:      { name:"Star Cannon",      type:"Aether",  power:55,  acc:100, pp:10, cat:"special",  effect:"defdown",   ec:30, hits:2, desc:"Celestrix fires two concentrated bolts of compressed starlight that punch through defenses on impact." },

  // --- Bug (signature moves for Forgotten Lumori) ---
  swarm_tide:       { name:"Brood Tide",       type:"Nature",     power:40,  acc:95,  pp:10, cat:"special",  effect:"spedown",   ec:30, hits:3, desc:"Fulgureis summons a torrent of charged insects in three cascading waves, each slowing the target further." },

  // --- Aquatic (signature moves for Forgotten Lumori) ---
  torrent_shell:    { name:"Torrent Shell",    type:"Aquatic",   power:150, acc:85,  pp:5,  cat:"special",  effect:"recoil",    ec:100,desc:"Fulgureis condenses an ocean's worth of pressure into a single catastrophic blast. The backlash is immense." },
  dream_torrent:    { name:"Dream Torrent",    type:"Aquatic",   power:90,  acc:95,  pp:10, cat:"special",  effect:"confuse",   ec:30, desc:"Dreamaith floods the opponent's mind with tidal dreamscapes, leaving them disoriented and struggling to focus." },
  moonlit_surge:    { name:"Moonlit Surge",    type:"Fairy",   power:100, acc:95,  pp:10, cat:"special",  effect:"atkdown", ec:30, desc:"Luneveth channels concentrated moonlight into a surge of lunar energy that dims the opponent's special power." },

  // --- Ground (signature moves for Forgotten Lumori) ---
  luma_quake:       { name:"Luma Quake",       type:"Earth",  power:100, acc:95,  pp:10, cat:"physical", effect:"atkup",     ec:30, desc:"Lumarix strikes the earth with radiant force, the impact reverberating through its body and sharpening its resolve." },
  tectonic_wrath:   { name:"Tectonic Wrath",   type:"Earth",  power:145, acc:85,  pp:5,  cat:"physical", effect:"recoil",    ec:100,desc:"Gaiasurge ruptures the continental shelf beneath the opponent. The shockwave tears back through Gaiasurge's limbs." },
  quake_barrage:    { name:"Quake Barrage",    type:"Fighting",power:40,  acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:20, hits:3, desc:"Gaiasurge delivers three earth-shaking blows in rapid succession, each strike rattling the opponent's footing." },
  smoldering_abyss: { name:"Smoldering Abyss", type:"Earth", power:95,  acc:90,  pp:10, cat:"special",  effect:"spdefdown",      ec:30, desc:"Emberon opens a rift to magmatic depths beneath the opponent's feet. Superheated gases scorch what survives the impact." },
  nihil_quake:      { name:"Nihil Quake",      type:"Primal",  power:90,  acc:95,  pp:10, cat:"physical", effect:"spedown",   ec:30, desc:"Nihilax tears apart the ground itself with nihilistic force, disrupting the target's footing and momentum." },

  // --- Ice (signature moves for Forgotten Lumori) ---
  mind_blizzard:    { name:"Psychic Blizzard",    type:"Mental", power:135, acc:85,  pp:5,  cat:"special",  effect:"recoil",    ec:100,desc:"Duskmourn amplifies psychic energy to a destructive extreme, generating a psychic blizzard. The mental strain is brutal." },
  frost_pulse:      { name:"Frost Pulse",      type:"Ice",     power:50,  acc:95,  pp:10, cat:"special",  effect:"freeze",    ec:20, hits:2, desc:"Duskmourn fires two pulses of absolute-zero energy that can lock the target in ice on contact." },
  glacial_riptide:  { name:"Glacial Riptide",  type:"Ice",     power:140, acc:85,  pp:5,  cat:"special",  effect:"recoil",    ec:100,desc:"Tidecrest summons a riptide flash-frozen to absolute zero and drives it through the target. The backlash chills even Tidecrest." },
  tidal_fang:       { name:"Tidal Fang",       type:"Primal",  power:60,  acc:100, pp:10, cat:"physical", effect:"defdown",   ec:30, hits:2, desc:"Tidecrest bites twice with draconic force backed by tidal momentum, wearing down the target's defenses." },
  cryo_plate:       { name:"Cryo Plate",       type:"Ice",     power:85,  acc:100, pp:10, cat:"physical", effect:"defdown",    ec:30, desc:"Frigalum slams an ice-hardened plate of steel into the target. A thin probability of total freezing lingers." },
  frost_lattice:    { name:"Icebound Lattice",    type:"Ice",     power:100, acc:95,  pp:10, cat:"special",  effect:"spedown",   ec:30, desc:"Sparkeis weaves a crystalline lattice of ice energy around the target, restricting their movement and slowing their reactions." },

  // --- Dark (signature moves for Forgotten Lumori) ---
  nyx_fang:         { name:"Nyx Fang",         type:"Dark",    power:85,  acc:100, pp:15, cat:"physical", effect:"spedown",   ec:30, desc:"Nyxviper strikes from absolute darkness with fangs that leave a numbing venom slowing the target's reflexes." },
  dark_corrosion:   { name:"Dark Corrosion",   type:"Dark",    power:95,  acc:100, pp:10, cat:"special",  effect:"defdown", ec:30, desc:"Bathykor releases a wave of corrosive dark energy that eats through the target's mental defenses." },
  cryo_shatter:     { name:"Cryo Shatter",     type:"Earth",    power:110, acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:30, desc:"Cryvorn superheats then instantly flash-freezes stone before detonating it into the opponent, cracking their defenses." },
  forge_blast:      { name:"Forge Blast",      type:"Fire",    power:105, acc:90,  pp:10, cat:"special",  effect:"atkup",      ec:30, desc:"Forgerak channels forge-fire intensified beyond metal's tolerance and releases it in a shaped detonation." },

  // --- Poison (signature moves for Forgotten Lumori) ---
  toxic_blaze:      { name:"Toxic Blaze",      type:"Fire",    power:95,  acc:100, pp:10, cat:"special",  effect:"poison",      ec:30, desc:"Morrath ignites its toxins into a poisonous firestorm. The heat is almost secondary to the burning residue it leaves." },
  root_toxin:       { name:"Root Toxin",       type:"Poison",  power:85,  acc:100, pp:15, cat:"physical", effect:"poison",    ec:100,desc:"Rootborn drives toxin-saturated vines into the target, delivering a full dose of its most potent venom on contact." },
  venom_surge:      { name:"Venom Surge",      type:"Draconic",  power:145, acc:85,  pp:5,  cat:"physical", effect:"recoil",    ec:100,desc:"Dracofire condenses venom and dragonfire into a single explosive charge and detonates it on contact. The explosion damages both." },
  acid_burst:       { name:"Acid Burst",       type:"Poison",  power:40,  acc:90,  pp:10, cat:"special",  effect:"spedown",    ec:30, hits:3, desc:"Dracofire erupts with three blasts of concentrated acid in rapid succession, each carrying a chance to poison." },
  venom_mind:       { name:"Venom Mind",       type:"Mental", power:95,  acc:100, pp:10, cat:"special",  effect:"spatkdown", ec:30, desc:"Vantarix injects psychic toxins into the opponent's mind, steadily diminishing their capacity for special attacks." },

  // --- Electric (signature moves for Forgotten Lumori) ---
  volt_rail:        { name:"Ampere Rail",        type:"Electric",power:90,  acc:95,  pp:10, cat:"physical", effect:"spedown",  ec:30, desc:"Electrak fires along a magnetic rail it generates in an instant, striking with rail-gun velocity and leaving the target stunned." },
  thought_stream:   { name:"Thought Stream",   type:"Mental", power:90,  acc:95,  pp:10, cat:"special",  effect:"drain", ec:100, desc:"Pelagor floods the target with a torrent of raw psychic data, overwhelming their mental defenses." },
  voltaic_fang:     { name:"Voltaic Fang",     type:"Draconic",  power:140, acc:90,  pp:5,  cat:"physical", effect:"recoil",    ec:100,desc:"Psydrak charges its draconic fangs with lethal voltage before biting down. The discharge blows back through Psydrak's own jaw." },
  thunder_chain:    { name:"Thunder Chain",    type:"Electric",power:40,  acc:90,  pp:10, cat:"special",  effect:"paralyze",  ec:20, hits:3, desc:"Psydrak fires three chained lightning arcs that arc between target limbs, each carrying a chance to paralyze." },
  psycho_surge:     { name:"Psycho Surge",     type:"Mental", power:90,  acc:95,  pp:10, cat:"special",  effect:"calmup",    ec:30, desc:"Volteon releases a surge of psychoelectric energy, sometimes amplifying its own mental capabilities in the process." },

  // --- Rock (signature moves for Forgotten Lumori) ---
  arc_strike:       { name:"Arc Strike",       type:"Normal",  power:110, acc:90,  pp:10, cat:"physical", effect:"flinch",    ec:20, desc:"Arcvolt concentrates its electromagnetic force into a normal-type shockwave of pure concussive energy that stuns on impact." },
  mineral_lance:    { name:"Mineral Lance",    type:"Earth",    power:105, acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:30, desc:"Tellurak fires a dense spike of compressed minerals at hypersonic velocity that pierces through the target's defenses." },

  // --- Metal (signature moves for Forgotten Lumori) ---
  pyro_alloy:       { name:"Pyro Alloy",       type:"Metal",   power:85,  acc:100, pp:10, cat:"physical", effect:"burn",      ec:20, desc:"Pyraeon fuses its superheated alloy scales into an edge and strikes, leaving a burning brand on contact." },
  iron_fortress:    { name:"Iron Fortress",    type:"Crystal",   power:85,  acc:100, pp:10, cat:"physical", effect:"defup",     ec:100,desc:"Ironvast strikes with total commitment, its own body acting as a rampart. Every blow hardens its defensive posture." },
  steel_gale:       { name:"Ferrous Gale",       type:"Metal",   power:100, acc:95,  pp:10, cat:"physical", effect:"flinch",    ec:20, desc:"Zephyrak spins its steel-edged wings to hurricane velocity and releases a blade of compressed metal-edged air." },

  // --- Spectral (signature moves for Forgotten Lumori) ---
  phantom_gale:     { name:"Phantom Gale",     type:"Spectral",   power:130, acc:90,  pp:5,  cat:"special",  effect:"recoil",    ec:100,desc:"Skydrak tears open a corridor to the void and channels its force through a phantom-wind strike. The void tears back." },
  void_cyclone:     { name:"Void Cyclone",     type:"Wind",    power:50,  acc:95,  pp:10, cat:"special",  effect:"spatkdown", ec:30, hits:2, desc:"Skydrak creates two cyclones of void-infused wind in succession, each disrupting the target's focus." },
  winter_shade:     { name:"Winter Shade",     type:"Spectral",   power:130, acc:90,  pp:5,  cat:"physical", effect:"recoil",    ec:100,desc:"Frostdrax becomes solid shadow and delivers a blow that hits from inside the target's own silhouette. The impact echoes back." },
  glacial_spirit:   { name:"Glacial Spirit",   type:"Fairy",   power:55,  acc:95,  pp:10, cat:"special",  effect:"spedown",   ec:30, hits:2, desc:"Frostdrax fires two waves of fairy-imbued glacial energy that seep into the target's joints, slowing their movement." },
  void_rend_ex:     { name:"Void Rend EX",     type:"Wind",   power:55,  acc:95,  pp:10, cat:"special",  effect:"spdefdown", ec:30, hits:2, desc:"Abysdrak tears twin rifts through the fabric of space itself, each rend tearing through the target's special defenses." },
  abyssal_fang:     { name:"Abyssal Fang",     type:"Draconic",  power:145, acc:85,  pp:5,  cat:"physical", effect:"recoil",    ec:100,desc:"Abysdrak descends from the abyssal deep with draconic force beyond comprehension. The impact damage reverberates back." },
  ghost_radiance:   { name:"Spectral Radiance",   type:"Spectral",   power:40,  acc:90,  pp:10, cat:"special",  effect:"spatkdown", ec:30, hits:3, desc:"Stellarion fires three pulses of spectral radiance that haunt the target's mind with each successive hit." },

  // --- Draconic (signature moves for Forgotten Lumori) ---
  stellar_flare:    { name:"Stellar Flare",    type:"Draconic",  power:110, acc:90,  pp:10, cat:"special",  effect:"burn",      ec:20, desc:"Stardrax ignites draconic plasma at stellar temperature and fires it in a focused jet that carries lingering heat." },
  alloy_breaker:    { name:"Alloy Breaker",    type:"Draconic",  power:150, acc:85,  pp:5,  cat:"physical", effect:"recoil",    ec:100,desc:"Alloydrax drives its full metallic mass at draconic velocity into the target. The resulting impact damages Alloydrax as well." },
  dragon_pummels:   { name:"Draconic Pummels",   type:"Fighting",power:40,  acc:90,  pp:10, cat:"physical", effect:"defdown",   ec:20, hits:3, desc:"Alloydrax delivers three relentless draconic strikes in sequence, each eroding the target's defensive stance." },

  // --- Flying (signature moves for Forgotten Lumori) ---
  canopy_strike:    { name:"Canopy Strike",    type:"Wind",  power:130, acc:90,  pp:5,  cat:"physical", effect:"recoil",    ec:100,desc:"Thunderax dives from maximum altitude and slams into the target like a falling sky. It pulls up hard but the landing hurts." },
  sky_harvest:      { name:"Sky Harvest",      type:"Nature",   power:90,  acc:95,  pp:10, cat:"special",  effect:"drain",     ec:100,desc:"Thunderax converts solar energy it has absorbed during flight directly into a beam attack, restoring its health as it strikes." },

  // --- Normal (signature moves for Forgotten Lumori) ---
  stellar_collapse: { name:"Stellar Collapse", type:"Normal",  power:150, acc:85,  pp:5,  cat:"physical", effect:"recoil",    ec:100,desc:"Stellarion implodes its own normal-type presence into a gravitational singularity and releases it on impact. Survivable, barely." },


  // ============================================================
  // STEP 3B ADDITIONS — REGULAR MOVES (Sonic)
  // ============================================================

  // --- Sonic (regular) ---
  shake_strike:            { name:"Shake Smash", type:"Sonic", power:50, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Body-vibration impact; always lands a critical hit." },
  echo_strike:             { name:"Echo Strike", type:"Sonic", power:30, acc:100, pp:20, cat:"physical", effect:null, ec:0, target:"single", hits:2, desc:"Strikes twice with echoing impact." },
  silent_strike:           { name:"Silent Strike", type:"Sonic", power:70, acc:100, pp:15, cat:"physical", effect:"priority", ec:0, target:"single", desc:"Sonic surprise strikes first." },
  sound_rush:              { name:"Sound Rush", type:"Sonic", power:60, acc:100, pp:25, cat:"physical", effect:"speup", ec:50, target:"single", desc:"Rush with audible boom; may sharply raise Speed." },
  rumble_smash:            { name:"Rumble Smash", type:"Sonic", power:75, acc:95, pp:15, cat:"physical", effect:"defdown", ec:30, target:"single", desc:"Ground-rumbling impact; may lower foe's Def." },
  drumstroke:              { name:"Drumstroke", type:"Sonic", power:55, acc:100, pp:25, cat:"physical", effect:null, ec:0, target:"single", hits:2, desc:"Two-hit resonant percussion." },
  skyboom_strike:          { name:"Skyboom Strike", type:"Sonic", dualType:["Sonic","Wind"], power:85, acc:95, pp:10, cat:"physical", effect:"sluggish", ec:30, target:"wide", desc:"Air-pressure boom striking all foes; may inflict Sluggish." },
  resonance_quake:         { name:"Resonance Quake", type:"Sonic", power:120, acc:85, pp:5, cat:"physical", effect:"atkup", ec:100, target:"single", desc:"Body-vibration empowerment; guaranteed +1 Atk after damage." },
  sonic_pulse:             { name:"Echo Pulse", type:"Sonic", power:35, acc:100, pp:40, cat:"special", effect:null, ec:0, target:"single", desc:"Single resonating pulse." },
  wave_cry:                { name:"Wave Cry", type:"Sonic", power:50, acc:95, pp:30, cat:"special", effect:null, ec:0, target:"wide", desc:"Focused sound wave hitting all foes." },
  resonate:                { name:"Resonate", type:"Sonic", power:75, acc:95, pp:15, cat:"special", effect:"spaup", ec:30, target:"single", desc:"Resonant attack; may raise own SpA." },
  discord:                 { name:"Discord", type:"Sonic", power:60, acc:100, pp:20, cat:"special", effect:"confuse", ec:30, target:"wide", desc:"Discordant noise spreading to all foes; may confuse." },
  pulse_wave:              { name:"Pulse Wave", type:"Sonic", power:65, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"single", breakerVs:"Vapor", desc:"Compressed shockwave that resonates devastatingly through Vapor." },
  prism_resonance:         { name:"Prism Resonance", type:"Sonic", dualType:["Sonic","Crystal"], power:90, acc:95, pp:10, cat:"special", effect:"echolocation", ec:20, target:"wide", desc:"Crystalline resonance burst; may lock Echolocation on the target." },
  wail:                    { name:"Wail", type:"Sonic", power:80, acc:100, pp:10, cat:"special", effect:"atkdown", ec:30, target:"single", desc:"Mournful wail; may lower foe's Atk." },
  harmonic_burst:          { name:"Harmonic Burst", type:"Sonic", power:100, acc:90, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Tremendous harmonic blast across the battlefield." },
  bass_blast:              { name:"Bass Blast", type:"Sonic", power:95, acc:100, pp:5, cat:"special", effect:"deafen", ec:30, target:"single", desc:"Body-rattling deep tone; may inflict Deafen." },
  decibel_burst:           { name:"Decibel Burst", type:"Sonic", power:85, acc:100, pp:10, cat:"special", effect:"flinch", ec:20, target:"wide", desc:"Loud burst hitting all foes; may cause flinch." },
  threnody:                { name:"Threnody", type:"Sonic", power:130, acc:90, pp:5, cat:"special", effect:"recharge", ec:100, target:"single", desc:"Final dirge requiring rest after use." },
  chirp:                   { name:"Chirp", type:"Sonic", power:0, acc:100, pp:25, cat:"status", effect:"atkdown", ec:100, target:"single", desc:"Sharp chirp guaranteed to lower foe's Atk." },
  earsplit:                { name:"Earsplit", type:"Sonic", power:0, acc:90, pp:15, cat:"status", effect:"defdown2", ec:100, target:"single", desc:"Piercing screech sharply lowers foe's Def." },
  siren_song:              { name:"Siren Song", type:"Sonic", power:0, acc:55, pp:10, cat:"status", effect:"sleep", ec:100, target:"single", desc:"Lulling song puts foe to sleep when it connects." },
  soundproof:              { name:"Soundproof", type:"Sonic", power:0, acc:100, pp:20, cat:"status", effect:"defup", ec:100, target:"self", desc:"Sound-dampening posture raises own Def." },
  echo_chamber:            { name:"Echo Chamber", type:"Sonic", power:0, acc:100, pp:15, cat:"status", effect:"accup", ec:100, target:"self", desc:"Echo-locked acoustic focus raises own Accuracy." },

  // --- Fire (regular) ---
  pyre_strike:             { name:"Pyre Strike", type:"Fire", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", breakerVs:"Spectral", desc:"Funeral-pyre strike that banishes spectral foes; super-effective vs Spectral." },
  inferno_charge:          { name:"Inferno Charge", type:"Fire", power:70, acc:100, pp:15, cat:"physical", effect:"speup", ec:30, target:"single", desc:"Charging fire-rush; may raise own Speed." },
  molten_claw:             { name:"Molten Claw", type:"Fire", power:65, acc:100, pp:20, cat:"physical", effect:"burnt_out", ec:20, target:"single", desc:"Searing claw; may inflict Burnt-out." },
  coal_smash:              { name:"Coal Smash", type:"Fire", power:80, acc:95, pp:10, cat:"physical", effect:"strained", ec:30, target:"single", desc:"Coal-fist slam; may inflict Strained." },
  magma_strike:            { name:"Magma Strike", type:"Fire", power:75, acc:95, pp:10, cat:"physical", effect:"burn", ec:20, target:"single", desc:"Molten body slam; may burn." },
  firebrand:               { name:"Firebrand", type:"Fire", power:90, acc:100, pp:10, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Branding-iron strike; always lands a critical hit." },
  inferno_chop:            { name:"Inferno Chop", type:"Fire", power:60, acc:100, pp:15, cat:"physical", effect:"burn", ec:30, target:"single", desc:"Karate-chop wreathed in flame; may burn." },
  scorch_kick:             { name:"Scorch Kick", type:"Fire", dualType:["Fire","Earth"], power:95, acc:85, pp:10, cat:"physical", effect:"marked", ec:30, target:"wide", desc:"Earth-scorching kick across all foes; may inflict Marked." },
  flare_uppercut:          { name:"Flare Uppercut", type:"Fire", power:85, acc:100, pp:10, cat:"physical", effect:"flinch", ec:20, target:"single", desc:"Upward flare-uppercut; may flinch." },
  lava_drop:               { name:"Lava Drop", type:"Fire", power:130, acc:85, pp:5, cat:"physical", effect:"recharge", ec:100, target:"wide", desc:"Drops as molten lava across all foes; requires rest." },
  flame_focus:             { name:"Ember Focus", type:"Fire", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"Sharpens flame for high critical-hit ratio." },
  searing_glare:           { name:"Searing Glare", type:"Fire", power:0, acc:100, pp:15, cat:"status", effect:"spdefdown", ec:100, target:"single", desc:"Intense gaze lowers foe's SpDef." },
  molten_armor:            { name:"Molten Armor", type:"Fire", power:0, acc:100, pp:15, cat:"status", effect:"defup2", ec:100, target:"self", desc:"Hardens molten skin (+2 Def)." },
  kindle:                  { name:"Kindle", type:"Fire", power:0, acc:100, pp:10, cat:"status", effect:"atkup", ec:100, target:"self", desc:"Kindles inner flame (+1 Atk)." },


  // --- Nature (regular) ---
  nature_pulse:            { name:"Nature Pulse", type:"Nature", power:40, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Pulse of life-energy; always lands a critical hit." },
  leafblade_swirl:         { name:"Leafblade Swirl", type:"Nature", power:65, acc:95, pp:20, cat:"special", effect:"atkdown", ec:20, target:"single", desc:"Swirling leaf-blades; may lower foe's Atk." },
  sporecloud_burst:        { name:"Sporecloud Burst", type:"Nature", power:70, acc:100, pp:15, cat:"special", effect:"sleep", ec:10, target:"wide", desc:"Burst of spores across all foes; may sleep them." },
  verdant_radiance:        { name:"Sylvan Radiance", type:"Nature", dualType:["Nature","Stellar"], power:85, acc:90, pp:10, cat:"special", effect:"crit", ec:100, target:"single", desc:"Bright life-radiance with high crit ratio. Dual Nature+Stellar." },
  swarm_assault:           { name:"Swarm Assault", type:"Nature", power:95, acc:90, pp:10, cat:"special", effect:"flinch", ec:20, target:"wide", desc:"Insect-swarm assault on all foes; may flinch." },
  primordial_growth:       { name:"Primordial Growth", type:"Nature", dualType:["Nature","Earth"], power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"single", desc:"Primordial growth-burst. Dual Nature+Earth." },

  // --- Electric (regular) ---
  thunder_jab:             { name:"Thunder Jab", type:"Electric", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick electric jab." },
  spark_claw:              { name:"Spark Claw", type:"Electric", power:60, acc:100, pp:20, cat:"physical", effect:"paralyze", ec:30, target:"single", breakerVs:"Earth", desc:"Electrified claw; bypasses Earth's normal immunity." },
  coil_strike:             { name:"Coil Strike", type:"Electric", power:75, acc:100, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Electromagnetic coil-strike." },
  bolt_smash:              { name:"Bolt Smash", type:"Electric", dualType:["Electric","Metal"], power:85, acc:95, pp:10, cat:"physical", effect:"flinch", ec:20, target:"wide", desc:"Bolt-charged smash. Dual Electric+Metal; may flinch all foes." },
  plasma_punch:            { name:"Plasma Punch", type:"Electric", power:95, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Plasma-fist; always lands a critical hit." },
  lightning_rush:          { name:"Lightning Rush", type:"Electric", dualType:["Electric","Sonic"], power:110, acc:85, pp:10, cat:"physical", effect:"sluggish", ec:30, target:"wide", desc:"Sonic-boom-fast rush. Dual Electric+Sonic; may inflict Sluggish." },
  magnet_field:            { name:"Magnet Field", type:"Electric", power:0, acc:100, pp:15, cat:"status", effect:"defup", ec:100, target:"self", desc:"Magnetic field hardens body (+1 Def)." },
  static_charge:           { name:"Static Charge", type:"Electric", power:0, acc:100, pp:15, cat:"status", effect:"atkup2", ec:100, target:"self", desc:"Builds static (+2 Atk)." },
  overcharge_status:       { name:"Overcharge Coil", type:"Electric", power:0, acc:100, pp:10, cat:"status", effect:"spaup2", ec:100, target:"self", desc:"Floods circuits (+2 SpA)." },
  capacitor_drain:         { name:"Capacitor Drain", type:"Electric", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Drains stored charge; restores half HP." },
  ground_circuit:          { name:"Ground Circuit", type:"Electric", power:0, acc:100, pp:15, cat:"status", effect:"spdefup", ec:100, target:"self", desc:"Grounds circuits (+1 SpDef)." },

  // --- Earth (regular) ---
  quake_pulse:             { name:"Quake Pulse", type:"Earth", power:50, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Seismic pulse; always lands a critical hit." },
  tectonic_wave:           { name:"Telluric Wave", type:"Earth", power:75, acc:95, pp:15, cat:"special", effect:"spedown", ec:30, target:"wide", breakerVs:"Aether", desc:"Plate-shift wave; super vs Aether; may slow all foes." },
  mineral_blast:           { name:"Mineral Blast", type:"Earth", dualType:["Earth","Mineral"], power:85, acc:90, pp:10, cat:"special", effect:"spdefdown", ec:30, target:"single", desc:"Mineral-shard burst. Dual Earth+Mineral; may lower SpDef." },
  continental_shift:       { name:"Continental Shift", type:"Earth", dualType:["Earth","Wind"], power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Continental upheaval driven by wind erosion. Dual Earth+Wind." },
  sand_polish_v2:          { name:"Sand Storm Polish", type:"Earth", power:0, acc:100, pp:15, cat:"status", effect:"atkup", ec:100, target:"self", desc:"Sand-grinding sharpens claws (+1 Atk)." },

  // --- Wind (regular) ---
  gust_jab:                { name:"Gust Jab", type:"Wind", power:50, acc:100, pp:25, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick gust-driven jab." },
  windshear:               { name:"Windshear", type:"Wind", power:75, acc:100, pp:15, cat:"physical", effect:"crit", ec:100, target:"single", desc:"Sharp wind-blade with high crit ratio." },
  tornado_kick:            { name:"Tornado Kick", type:"Wind", power:80, acc:95, pp:10, cat:"physical", effect:"spedown", ec:30, target:"single", desc:"Spinning wind-kick; may slow." },
  cyclone_smash:           { name:"Cyclone Smash", type:"Wind", dualType:["Wind","Sonic"], power:100, acc:90, pp:10, cat:"physical", effect:"flinch", ec:30, target:"wide", desc:"Cyclonic slam producing a sonic-boom. Dual Wind+Sonic; may flinch all foes." },
  breeze_blast:            { name:"Breeze Blast", type:"Wind", power:45, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", desc:"Soft breeze; reliable damage." },
  zephyr_arrow:            { name:"Zephyr Arrow", type:"Wind", power:70, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Wind-arrow; always lands a critical hit." },
  air_resonance:           { name:"Air Resonance", type:"Wind", power:65, acc:95, pp:20, cat:"special", effect:"spatkdown", ec:30, target:"single", desc:"Resonant air; may lower foe's SpA." },
  tempest_wave:            { name:"Tempest Wave", type:"Wind", power:80, acc:95, pp:15, cat:"special", effect:"atkdown", ec:20, target:"single", desc:"Tempest-condensed wave; may lower foe's Atk." },
  squall:                  { name:"Squall", type:"Wind", power:75, acc:90, pp:15, cat:"special", effect:"deafen", ec:20, target:"wide", desc:"Sudden squall on all foes; may inflict Deafen." },
  hurricane_blast:         { name:"Hurricane Blast", type:"Wind", power:110, acc:80, pp:5, cat:"special", effect:"confuse", ec:30, target:"wide", breakerVs:"Spectral", desc:"Wild hurricane; super vs Spectral; may confuse all foes." },
  windstorm_eruption:      { name:"Thunderstorm Eruption", type:"Wind", dualType:["Wind","Electric"], power:130, acc:85, pp:5, cat:"special", effect:"strained", ec:30, target:"wide", desc:"Lightning-laced windstorm. Dual Wind+Electric; may inflict Strained on all foes." },
  updraft:                 { name:"Updraft", type:"Wind", power:0, acc:100, pp:15, cat:"status", effect:"spdefup", ec:100, target:"self", desc:"Updraft cushion (+1 SpDef)." },
  gale_focus:              { name:"Mistral Focus", type:"Wind", power:0, acc:100, pp:15, cat:"status", effect:"accup", ec:100, target:"self", desc:"Reads wind currents; raises own Accuracy." },
  air_barrier:             { name:"Air Barrier", type:"Wind", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Air-current bath restores half HP." },

  // --- Ice (regular) ---
  frost_jab:               { name:"Frigid Jab", type:"Ice", power:45, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", breakerVs:"Aquatic", desc:"Quick Frigid-Jab; super vs Aquatic (Freeze-Dry analogue)." },
  ice_claw:                { name:"Ice Claw", type:"Ice", power:60, acc:100, pp:20, cat:"physical", effect:"freeze", ec:10, target:"single", desc:"Iced claw; may freeze." },
  blizzard_charge:         { name:"Blizzard Charge", type:"Ice", power:75, acc:95, pp:15, cat:"physical", effect:"sluggish", ec:30, target:"single", desc:"Charging blizzard; may inflict Sluggish." },
  icicle_smash:            { name:"Icicle Smash", type:"Ice", power:80, acc:100, pp:10, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Icicle slam; always lands a critical hit." },
  frostbite_strike:        { name:"Frostbite Strike", type:"Ice", power:95, acc:90, pp:10, cat:"physical", effect:"freeze", ec:30, target:"single", desc:"Deep-cold strike; may freeze." },
  avalanche_smash:         { name:"Avalanche Smash", type:"Ice", dualType:["Ice","Earth"], power:120, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"wide", desc:"Avalanche-scale slam. Dual Ice+Earth." },
  ice_resonance:           { name:"Ice Resonance", type:"Ice", dualType:["Ice","Sonic"], power:85, acc:95, pp:10, cat:"special", effect:"brittle", ec:30, target:"wide", desc:"Resonant cold. Dual Ice+Sonic; may inflict Brittle." },
  frost_armor:             { name:"Boreal Armor", type:"Ice", power:0, acc:100, pp:15, cat:"status", effect:"defup2", ec:100, target:"self", desc:"Boreal-Armor (+2 Def)." },
  cold_focus:              { name:"Cold Focus", type:"Ice", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"Frigid focus raises crit chance." },
  arctic_calm:             { name:"Arctic Calm", type:"Ice", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Deep calm restores half HP." },
  cryogenic_field:         { name:"Cryogenic Field", type:"Ice", power:0, acc:100, pp:15, cat:"status", effect:"spdefup2", ec:100, target:"self", desc:"Freezing field (+2 SpDef)." },
  glacial_swift:           { name:"Polar Swift", type:"Ice", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"Smooths surface like ice (+1 Speed)." },

  // --- Dark (regular) ---
  shadow_jab:              { name:"Shadow Jab", type:"Dark", power:60, acc:100, pp:20, cat:"physical", effect:"spedown", ec:20, target:"single", breakerVs:"Fairy", desc:"Shadow-strike pierces fairy-light; may slow." },
  nightmare_smash:         { name:"Nightmare Smash", type:"Dark", dualType:["Dark","Dream"], power:90, acc:90, pp:10, cat:"physical", effect:"flinch", ec:20, target:"single", desc:"Nightmarish slam. Dual Dark+Dream; may flinch." },
  umbral_pulse:            { name:"Umbral Pulse", type:"Dark", power:65, acc:100, pp:25, cat:"special", effect:"flinch", ec:20, target:"single", desc:"Umbral burst; may flinch." },
  shadow_lance:            { name:"Shadow Lance", type:"Dark", power:80, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Piercing shadow-lance; always lands a critical hit." },
  void_whisper:            { name:"Stygian Whisper", type:"Dark", power:50, acc:100, pp:25, cat:"special", effect:"confuse", ec:20, target:"wide", desc:"Disturbing whispers on all foes; may confuse." },
  shadowstorm:             { name:"Shadowstorm", type:"Dark", dualType:["Dark","Wind"], power:95, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Whirling shadow-storm. Dual Dark+Wind." },
  eclipse_burst:           { name:"Eclipse Burst", type:"Dark", power:110, acc:80, pp:5, cat:"special", effect:"atkdown", ec:30, target:"wide", desc:"Blinding eclipse-burst on all foes; may lower Atk." },
  abyssal_wave:            { name:"Abyssal Wave", type:"Dark", power:130, acc:85, pp:5, cat:"special", effect:"bleed", ec:30, target:"single", desc:"Abyssal wave; may inflict Bleed." },
  shadow_cloak:            { name:"Shadow Cloak", type:"Dark", power:0, acc:100, pp:15, cat:"status", effect:"defup", ec:100, target:"self", desc:"Cloak of shadow (+1 Def)." },
  dark_focus:              { name:"Dark Focus", type:"Dark", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"Shadowed focus raises crit chance." },
  fear_aura:               { name:"Fear Aura", type:"Dark", power:0, acc:100, pp:15, cat:"status", effect:"defdown", ec:100, target:"single", desc:"Aura of fear lowers foe's Def." },

  // --- Fairy (regular) ---
  fairy_jab:               { name:"Fairy Jab", type:"Fairy", power:60, acc:100, pp:20, cat:"physical", effect:"crit", ec:100, target:"single", desc:"Fairy-fist jab with high crit ratio." },
  enchanted_smash:         { name:"Enchanted Smash", type:"Fairy", power:90, acc:95, pp:10, cat:"physical", effect:"flinch", ec:30, target:"single", desc:"Enchanted slam; may flinch." },
  fairy_mist:              { name:"Nymph Mist", type:"Fairy", power:45, acc:100, pp:30, cat:"special", effect:"atkdown", ec:20, target:"wide", breakerVs:"Metal", desc:"Corrosive Nymph-Mist; super vs Metal; may lower Atk." },
  sparkle_shot:            { name:"Sparkle Shot", type:"Fairy", power:65, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Sparkle pellet; always lands a critical hit." },
  moonlight_beam:          { name:"Moonlight Beam", type:"Fairy", power:75, acc:100, pp:15, cat:"special", effect:"flinch", ec:20, target:"wide", desc:"Moonlight beam on all foes; may flinch." },
  charm_pulse:             { name:"Charm Pulse", type:"Fairy", power:60, acc:95, pp:20, cat:"special", effect:"confuse", ec:30, target:"wide", desc:"Charming pulse on all foes; may confuse." },
  faewind:                 { name:"Faewind", type:"Fairy", dualType:["Fairy","Wind"], power:80, acc:95, pp:15, cat:"special", effect:"spedown", ec:30, target:"single", desc:"Sweeping fae-wind. Dual Fairy+Wind; may slow." },
  starlit_radiance:        { name:"Starlit Radiance", type:"Fairy", dualType:["Fairy","Stellar"], power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Starlit radiance on all foes. Dual Fairy+Stellar." },
  supernova_glow:          { name:"Supernova Glow", type:"Fairy", power:130, acc:85, pp:5, cat:"special", effect:"smothered", ec:30, target:"single", desc:"Blinding supernova; may inflict Smothered." },
  fairy_focus:             { name:"Sylph Focus", type:"Fairy", power:0, acc:100, pp:15, cat:"status", effect:"accup", ec:100, target:"self", desc:"Focused fairy-sense (+1 Accuracy)." },
  enchant:                 { name:"Enchant", type:"Fairy", power:0, acc:100, pp:15, cat:"status", effect:"spaup", ec:100, target:"self", desc:"Enchants self (+1 SpA)." },
  healing_circle:          { name:"Healing Circle", type:"Fairy", power:0, acc:100, pp:10, cat:"status", effect:"defup2", ec:100, target:"self", desc:"Fairy circle (+2 Def)." },

  // --- Metal (regular) ---
  metal_pulse:             { name:"Metal Pulse", type:"Metal", power:45, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", desc:"Resonant metal pulse." },
  iron_shockwave:          { name:"Wrought Shockwave", type:"Metal", power:60, acc:100, pp:20, cat:"special", effect:"defdown", ec:30, target:"wide", desc:"Iron-density shockwave on all foes; may lower Def." },
  magnet_burst:            { name:"Magnet Burst", type:"Metal", power:70, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Magnetic-field burst; always lands a critical hit." },
  chromium_ray:            { name:"Chromium Ray", type:"Metal", power:75, acc:100, pp:15, cat:"special", effect:"crit", ec:100, target:"single", breakerVs:"Mental", desc:"Chromium-light ray; super vs Mental; high crit ratio." },
  titanic_beam:            { name:"Titanic Beam", type:"Metal", dualType:["Metal","Mineral"], power:90, acc:95, pp:10, cat:"special", effect:"spdefdown", ec:30, target:"wide", desc:"Titanium beam on all foes. Dual Metal+Mineral; may lower SpDef." },
  smelter_surge:           { name:"Smelter Surge", type:"Metal", power:95, acc:90, pp:10, cat:"special", effect:"flinch", ec:20, target:"single", desc:"Forge-energy surge; may flinch." },
  mercurial_torrent:       { name:"Mercurial Torrent", type:"Metal", power:80, acc:90, pp:15, cat:"special", effect:"confuse", ec:30, target:"single", desc:"Quicksilver torrent; may confuse." },
  iron_storm:              { name:"Iron Storm", type:"Metal", power:110, acc:80, pp:5, cat:"special", effect:"atkdown", ec:30, target:"wide", desc:"Iron-shard storm on all foes; may lower Atk." },
  tungsten_wrath:          { name:"Tungsten Wrath", type:"Metal", dualType:["Metal","Earth"], power:130, acc:85, pp:5, cat:"special", effect:"bleed", ec:30, target:"single", desc:"Devastating tungsten-blast. Dual Metal+Earth; may inflict Bleed." },
  plasma_smelt:            { name:"Plasma Smelt", type:"Metal", power:100, acc:85, pp:10, cat:"special", effect:"burn", ec:20, target:"single", desc:"Plasma-hot metal; may burn." },
  iron_bulwark:            { name:"Iron Bulwark", type:"Metal", power:0, acc:100, pp:15, cat:"status", effect:"defup2", ec:100, target:"self", desc:"Iron-rigid stance (+2 Def)." },
  mirror_polish:           { name:"Mirror Polish", type:"Metal", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"Polished surface (+1 Speed)." },
  armor_meld:              { name:"Armor Meld", type:"Metal", power:0, acc:100, pp:15, cat:"status", effect:"spdefup2", ec:100, target:"self", desc:"Welds plating (+2 SpDef)." },
  corrosion_proof:         { name:"Corrosion-Proof", type:"Metal", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Resists rot; restores half HP." },

  // --- Poison (regular, batch3) ---
  venom_jab:                   { name:"Venom Jab", type:"Poison", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick venom jab." },
  plague_strike:               { name:"Plague Strike", type:"Poison", power:65, acc:100, pp:20, cat:"physical", effect:"poison", ec:30, target:"single", desc:"Plague-tipped strike; may poison." },
  corrosive_bite:              { name:"Corrosive Bite", type:"Poison", power:80, acc:95, pp:15, cat:"physical", effect:"defdown", ec:30, target:"single", breakerVs:"Aether", desc:"Corrosive bite; may lower Def." },
  toxic_lash:                  { name:"Toxic Lash", type:"Poison", power:90, acc:85, pp:10, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Whipping toxic lash." },
  venom_drown:                 { name:"Venom Drown", type:"Poison", dualType:["Poison","Aquatic"], power:110, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"wide", desc:"Toxic flood across all foes. Dual Poison+Aquatic." },

  // --- Mental (regular, batch3) ---
  psy_jab:                     { name:"Psy Jab", type:"Mental", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick psy-jab." },
  mind_strike:                 { name:"Mind Strike", type:"Mental", power:65, acc:100, pp:20, cat:"physical", effect:null, ec:0, target:"single", desc:"Focused mind-strike." },
  telekinetic_throw:           { name:"Telekinetic Throw", type:"Mental", power:75, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Telekinetic throw." },
  brain_blast_p:               { name:"Brain Blast", type:"Mental", power:85, acc:90, pp:10, cat:"physical", effect:"confuse", ec:30, target:"single", desc:"Brain-rattling blast." },
  cerebral_punch:              { name:"Cerebral Punch", type:"Mental", power:95, acc:90, pp:10, cat:"physical", effect:"spdefdown", ec:30, target:"single", alwaysCrit:true, desc:"Mind-piercing punch." },
  mind_breaker_phy:            { name:"Mindbreaker", type:"Mental", dualType:["Mental","Sonic"], power:110, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"wide", desc:"Sonic-laced mind-breaker. Dual Mental+Sonic." },
  mental_pulse_n:              { name:"Mental Pulse", type:"Mental", power:70, acc:100, pp:15, cat:"special", effect:"spdefdown", ec:20, target:"wide", desc:"Pulse on all foes; may lower SpDef." },
  mind_meld:                   { name:"Cognition Meld", type:"Mental", power:90, acc:95, pp:10, cat:"special", effect:null, ec:0, target:"single", breakerVs:"Aether", desc:"Mental fusion strike." },
  mind_focus_s:                { name:"Mnemonic Focus", type:"Mental", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"Focused mind; high crit." },
  cerebral_calm:               { name:"Cerebral Calm", type:"Mental", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },
  mental_overflow:             { name:"Mental Overflow", type:"Mental", power:0, acc:100, pp:10, cat:"status", effect:"spaup2", ec:100, target:"self", desc:"+2 SpA." },
  psyche_lock:                 { name:"Psyche Lock", type:"Mental", power:0, acc:100, pp:15, cat:"status", effect:"atkdown", ec:100, target:"single", desc:"Locks foe's Atk (-1)." },

  // --- Draconic (regular, batch3) ---
  draco_jab:                   { name:"Draco Jab", type:"Draconic", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", breakerVs:"Fairy", desc:"Quick draco-jab." },
  draco_pulse_n:               { name:"Draco Pulse", type:"Draconic", power:70, acc:100, pp:15, cat:"special", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Draconic pulse." },
  wyrm_breath:                 { name:"Reptilian Gust", type:"Draconic", dualType:["Draconic","Wind"], power:90, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide reptilian gust. Dual Draconic+Wind." },
  dragon_focus:                { name:"Dragon Focus", type:"Draconic", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"Dragon's focus; high crit." },
  ancient_meditation:          { name:"Ancient Meditation", type:"Draconic", power:0, acc:100, pp:10, cat:"status", effect:"calmup", ec:100, target:"self", desc:"Calm-up self." },
  wyrm_armor:                  { name:"Drake Armor", type:"Draconic", power:0, acc:100, pp:15, cat:"status", effect:"defup2", ec:100, target:"self", desc:"+2 Def." },
  draconic_might:              { name:"Basilisk Might", type:"Draconic", power:0, acc:100, pp:15, cat:"status", effect:"atkup", ec:100, target:"self", desc:"+1 Atk." },
  arcane_breath:               { name:"Arcane Roar", type:"Draconic", power:0, acc:100, pp:15, cat:"status", effect:"spaup", ec:100, target:"self", desc:"+1 SpA." },
  dragon_calm:                 { name:"Dragon Calm", type:"Draconic", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },

  // --- Normal (regular, batch3) ---
  quick_jab_n:                 { name:"Quick Jab", type:"Normal", power:40, acc:100, pp:30, cat:"physical", effect:"priority", ec:0, target:"single", desc:"First-strike jab." },
  body_blow:                   { name:"Body Blow", type:"Normal", power:75, acc:100, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Heavy body blow." },
  tornado_grab:                { name:"Tornado Grab", type:"Normal", dualType:["Normal","Wind"], power:90, acc:85, pp:10, cat:"physical", effect:null, ec:0, target:"wide", desc:"Spinning grab on all foes. Dual Normal+Wind." },
  echo_beam_n:                 { name:"Echo Beam", type:"Normal", power:60, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"wide", desc:"Echoing beam on all foes." },
  aural_ray:                   { name:"Aural Ray", type:"Normal", power:70, acc:100, pp:20, cat:"special", effect:"spdefdown", ec:20, target:"single", desc:"Aural ray; may lower SpDef." },
  radiant_burst_n:             { name:"Radiant Burst", type:"Normal", power:85, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Radiant burst." },
  lumiwave:                    { name:"Lumiwave", type:"Normal", power:95, acc:90, pp:10, cat:"special", effect:"atkdown", ec:30, target:"wide", desc:"Lumiwave on all foes; may lower Atk." },
  zenith_ray:                  { name:"Zenith Ray", type:"Normal", power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"single", breakerVs:"Spectral", desc:"Pure-light zenith ray." },

  // --- Spectral (regular, batch3) ---
  ghost_jab:                   { name:"Ghost Jab", type:"Spectral", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick ghost-jab." },
  ectoplasm_strike:            { name:"Ectoplasm Strike", type:"Spectral", power:75, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Ectoplasmic strike." },
  phantom_charge:              { name:"Revenant Charge", type:"Spectral", dualType:["Spectral","Dark"], power:95, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Revenant Charge. Dual Spectral+Dark." },
  ghost_pulse:                 { name:"Ghost Pulse", type:"Spectral", power:50, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", desc:"Single ghost-pulse." },
  soul_lance:                  { name:"Soul Lance", type:"Spectral", power:70, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide soul-lance." },
  ectoplasm_wave:              { name:"Ectoplasm Wave", type:"Spectral", power:80, acc:95, pp:15, cat:"special", effect:"atkdown", ec:30, target:"wide", desc:"Ectoplasm wave; may lower Atk." },
  phantom_beam:                { name:"Phantom Beam", type:"Spectral", power:75, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"single", breakerVs:"Mental", desc:"Phantom beam." },
  void_wail:                   { name:"Void Wail", type:"Spectral", power:85, acc:90, pp:10, cat:"special", effect:"confuse", ec:30, target:"wide", desc:"Void wail; may confuse." },
  soul_burst:                  { name:"Soul Burst", type:"Spectral", power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"single", desc:"Heavy soul-burst." },
  spirit_calamity:             { name:"Spirit Calamity", type:"Spectral", power:130, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Spirit calamity on all foes." },
  veil_shroud:                 { name:"Veil Shroud", type:"Spectral", power:0, acc:100, pp:15, cat:"status", effect:"defup", ec:100, target:"self", desc:"+1 Def." },
  ghost_focus:                 { name:"Wraith Focus", type:"Spectral", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"High crit ratio." },
  spirit_drain:                { name:"Spirit Drain", type:"Spectral", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },
  phantom_dance:               { name:"Eidolon Dance", type:"Spectral", power:0, acc:100, pp:15, cat:"status", effect:"calmup", ec:100, target:"self", desc:"Calm-up self." },
  spectral_lock:               { name:"Spectral Lock", type:"Spectral", power:0, acc:100, pp:15, cat:"status", effect:"atkdown", ec:100, target:"single", desc:"Locks foe's Atk." },
  ectoplasm_armor:             { name:"Ectoplasm Armor", type:"Spectral", power:0, acc:100, pp:15, cat:"status", effect:"spdefup2", ec:100, target:"self", desc:"+2 SpDef." },
  fade:                        { name:"Fade", type:"Spectral", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"+1 Speed." },

  // --- Fighting (regular, batch3) ---
  quick_punch:                 { name:"Quick Punch", type:"Fighting", power:40, acc:100, pp:30, cat:"physical", effect:"priority", ec:0, target:"single", desc:"First-strike punch." },
  roundhouse:                  { name:"Roundhouse", type:"Fighting", power:60, acc:100, pp:25, cat:"physical", effect:null, ec:0, target:"single", desc:"Roundhouse kick." },
  uppercut_f:                  { name:"Uppercut", type:"Fighting", power:75, acc:100, pp:20, cat:"physical", effect:null, ec:0, target:"single", desc:"Upward uppercut." },
  straight_jab:                { name:"Straight Jab", type:"Fighting", power:50, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Direct jab." },
  body_check:                  { name:"Body Check", type:"Fighting", power:70, acc:100, pp:20, cat:"physical", effect:null, ec:0, target:"single", desc:"Body check." },
  low_sweep_f:                 { name:"Leg Sweep", type:"Fighting", power:65, acc:100, pp:20, cat:"physical", effect:"spedown", ec:30, target:"single", desc:"Low sweep; may slow." },
  high_kick:                   { name:"High Kick", type:"Fighting", power:90, acc:85, pp:10, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"High kick." },
  flying_press:                { name:"Flying Press", type:"Fighting", dualType:["Fighting","Wind"], power:90, acc:95, pp:10, cat:"physical", effect:null, ec:0, target:"wide", desc:"Aerial press on all foes. Dual Fighting+Wind." },
  close_combat:                { name:"Brawl", type:"Fighting", power:110, acc:100, pp:5, cat:"physical", effect:"defdown", ec:100, target:"single", desc:"All-out attack; lowers own Def." },
  focus_punch_f:               { name:"Haymaker", type:"Fighting", power:130, acc:100, pp:5, cat:"physical", effect:null, ec:0, target:"single", desc:"Charged focus-punch." },
  spear_thrust:                { name:"Spear Thrust", type:"Fighting", power:80, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Piercing thrust." },
  crippling_blow:              { name:"Crippling Blow", type:"Fighting", power:85, acc:90, pp:10, cat:"physical", effect:"defdown", ec:30, target:"single", desc:"Crippling blow." },
  spinning_kick:               { name:"Spinning Kick", type:"Fighting", power:100, acc:85, pp:10, cat:"physical", effect:"flinch", ec:20, target:"single", desc:"Spinning kick; may flinch." },
  roar_strike:                 { name:"Roar Strike", type:"Fighting", power:95, acc:90, pp:10, cat:"physical", effect:"atkup", ec:30, target:"single", desc:"Empowering roar-strike." },
  iron_fist:                   { name:"Iron Fist", type:"Fighting", dualType:["Fighting","Metal"], power:95, acc:100, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Iron-clad fist. Dual Fighting+Metal." },
  martial_finish:              { name:"Martial Finish", type:"Fighting", power:120, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"single", desc:"Closing martial blow." },
  ki_blast:                    { name:"Ki Blast", type:"Fighting", power:50, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", desc:"Ki-blast." },
  focused_beam:                { name:"Focused Beam", type:"Fighting", power:65, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"single", desc:"Focused beam." },
  martial_aura:                { name:"Martial Aura", type:"Fighting", power:75, acc:100, pp:15, cat:"special", effect:"atkup", ec:30, target:"single", desc:"Martial aura; may raise Atk." },
  ki_burst:                    { name:"Ki Burst", type:"Fighting", power:80, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide ki-burst." },
  spirit_bomb:                 { name:"Spirit Bomb", type:"Fighting", power:95, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide spirit bomb." },
  battle_cry:                  { name:"Battle Cry", type:"Fighting", power:60, acc:100, pp:20, cat:"special", effect:"atkdown", ec:30, target:"wide", desc:"Cry that lowers foes' Atk." },
  sonic_palm:                  { name:"Sonic Palm", type:"Fighting", power:85, acc:95, pp:10, cat:"special", effect:null, ec:0, target:"single", breakerVs:"Crystal", desc:"Sonic palm." },
  shockwave_kick:              { name:"Shockwave Kick", type:"Fighting", power:90, acc:90, pp:10, cat:"special", effect:"flinch", ec:30, target:"wide", desc:"Shockwave-kick wide." },
  heaven_strike:               { name:"Heaven Strike", type:"Fighting", power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"single", desc:"Heaven-piercing strike." },
  galaxy_punch_spec:           { name:"Galaxy Punch", type:"Fighting", power:95, acc:95, pp:10, cat:"special", effect:"crit", ec:100, target:"single", desc:"High-crit galaxy-fist." },
  martial_intent:              { name:"Martial Intent", type:"Fighting", power:70, acc:100, pp:15, cat:"special", effect:"spaup", ec:30, target:"single", desc:"May raise SpA." },
  focus_pose:                  { name:"Focus Pose", type:"Fighting", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"High crit." },
  battle_meditation:           { name:"Battle Meditation", type:"Fighting", power:0, acc:100, pp:15, cat:"status", effect:"calmup", ec:100, target:"self", desc:"Calm up." },
  iron_will:                   { name:"Iron Will", type:"Fighting", power:0, acc:100, pp:15, cat:"status", effect:"defup", ec:100, target:"self", desc:"+1 Def." },
  fighter_resolve:             { name:"Fighter's Resolve", type:"Fighting", power:0, acc:100, pp:15, cat:"status", effect:"atkup2", ec:100, target:"self", desc:"+2 Atk." },
  swift_form:                  { name:"Swift Form", type:"Fighting", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"+1 Speed." },
  martial_block:               { name:"Warrior Block", type:"Fighting", power:0, acc:100, pp:15, cat:"status", effect:"spdefup", ec:100, target:"self", desc:"+1 SpDef." },
  battle_rhythm:               { name:"Battle Rhythm", type:"Fighting", power:0, acc:100, pp:15, cat:"status", effect:"accup", ec:100, target:"self", desc:"+1 Acc." },
  recover_strike:              { name:"Recovery Stance", type:"Fighting", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },

  // --- Aether (regular, batch3) ---
  aether_jab:                  { name:"Aether Jab", type:"Aether", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick aether-jab." },
  mystic_strike:               { name:"Mystic Blow", type:"Aether", power:70, acc:100, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Mystic Blow." },
  ethereal_slash:              { name:"Ethereal Slash", type:"Aether", power:85, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Ethereal slash." },
  radiant_strike:              { name:"Radiant Strike", type:"Aether", dualType:["Aether","Fairy"], power:95, acc:90, pp:10, cat:"physical", effect:"spdefdown", ec:30, target:"single", desc:"Radiant strike. Dual Aether+Fairy." },
  divine_press:                { name:"Divine Press", type:"Aether", power:110, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"wide", desc:"Wide divine press." },
  aether_pulse:                { name:"Aether Pulse", type:"Aether", power:50, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", desc:"Single aether-pulse." },
  mystic_ray:                  { name:"Mystic Ray", type:"Aether", power:70, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"single", desc:"Mystic ray." },
  arcane_beam:                 { name:"Arcane Beam", type:"Aether", power:80, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"single", desc:"Arcane beam." },
  radiant_wave:                { name:"Radiant Wave", type:"Aether", power:90, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Radiant wave." },
  mystical_eruption:           { name:"Mystical Eruption", type:"Aether", power:100, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"wide", breakerVs:"Spectral", desc:"Mystical eruption." },
  ethereal_storm:              { name:"Ethereal Storm", type:"Aether", power:120, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide ethereal storm." },
  aether_focus:                { name:"Empyrean Focus", type:"Aether", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"High crit." },
  arcane_meditation:           { name:"Arcane Meditation", type:"Aether", power:0, acc:100, pp:15, cat:"status", effect:"calmup", ec:100, target:"self", desc:"Calm-up." },
  divine_ward:                 { name:"Divine Ward", type:"Aether", power:0, acc:100, pp:15, cat:"status", effect:"defup2", ec:100, target:"self", desc:"+2 Def." },
  mystic_charge:               { name:"Mystic Charge", type:"Aether", power:0, acc:100, pp:10, cat:"status", effect:"spaup2", ec:100, target:"self", desc:"+2 SpA." },
  radiant_aura:                { name:"Radiant Aura", type:"Aether", power:0, acc:100, pp:15, cat:"status", effect:"accup", ec:100, target:"self", desc:"+1 Acc." },
  ethereal_step:               { name:"Ethereal Step", type:"Aether", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"+1 Speed." },
  life_force:                  { name:"Life Force", type:"Aether", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },
  arcane_resolve:              { name:"Arcane Resolve", type:"Aether", power:0, acc:100, pp:15, cat:"status", effect:"spdefup", ec:100, target:"self", desc:"+1 SpDef." },

  // --- Crystal (regular, batch3) ---
  crystal_jab:                 { name:"Crystal Jab", type:"Crystal", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick crystal-jab." },
  crystal_punch:               { name:"Quartz Punch", type:"Crystal", power:60, acc:100, pp:20, cat:"physical", effect:null, ec:0, target:"single", desc:"Crystal-fist punch." },
  shard_strike:                { name:"Shard Strike", type:"Crystal", power:50, acc:95, pp:25, cat:"physical", effect:null, ec:0, target:"single", desc:"Sharp shard-strike." },
  crystalline_slash:           { name:"Crystalline Slash", type:"Crystal", power:75, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Crystalline slash." },
  prism_blow:                  { name:"Prism Blow", type:"Crystal", power:85, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Heavy prism-blow." },
  gemstone_strike:             { name:"Gemstone Strike", type:"Crystal", power:95, acc:85, pp:10, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Gemstone strike." },
  crystal_smash:               { name:"Geode Smash", type:"Crystal", power:100, acc:85, pp:10, cat:"physical", effect:"defdown", ec:30, target:"single", desc:"Geode Smash; may lower Def." },
  shard_blade:                 { name:"Shard Blade", type:"Crystal", power:70, acc:100, pp:15, cat:"physical", effect:null, ec:0, target:"single", breakerVs:"Mental", desc:"Sharp shard-blade." },
  crystal_press:               { name:"Beryl Press", type:"Crystal", dualType:["Crystal","Mineral"], power:110, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"wide", desc:"Wide Beryl-Press. Dual Crystal+Mineral." },
  diamond_drill:               { name:"Diamond Drill", type:"Crystal", power:90, acc:95, pp:10, cat:"physical", effect:"crit", ec:100, target:"single", desc:"High-crit diamond drill." },
  quartz_quake:                { name:"Quartz Quake", type:"Crystal", power:120, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"wide", desc:"Wide quartz-quake." },
  crystal_pulse:               { name:"Crystal Pulse", type:"Crystal", power:50, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", desc:"Crystal pulse." },
  prism_ray:                   { name:"Prism Ray", type:"Crystal", power:70, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"single", desc:"Prism ray." },
  crystalline_beam:            { name:"Crystalline Beam", type:"Crystal", power:80, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide crystalline beam." },
  rainbow_burst:               { name:"Rainbow Burst", type:"Crystal", power:85, acc:90, pp:10, cat:"special", effect:"confuse", ec:30, target:"wide", desc:"Rainbow burst; may confuse." },
  gemstone_blast:              { name:"Gemstone Blast", type:"Crystal", power:95, acc:90, pp:10, cat:"special", effect:"spdefdown", ec:30, target:"single", desc:"May lower SpDef." },
  prismatic_eruption:          { name:"Prismatic Eruption", type:"Crystal", power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide prismatic eruption." },
  crystal_storm:               { name:"Crystal Storm", type:"Crystal", power:95, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Crystal storm." },
  starlight_prism:             { name:"Starlight Prism", type:"Crystal", dualType:["Crystal","Stellar"], power:100, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"single", desc:"Dual Crystal+Stellar prism." },
  crystal_focus:               { name:"Facet Focus", type:"Crystal", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"High crit." },
  prism_armor:                 { name:"Opaline Armor", type:"Crystal", power:0, acc:100, pp:15, cat:"status", effect:"defup2", ec:100, target:"self", desc:"+2 Def." },
  crystal_lattice:             { name:"Jade Lattice", type:"Crystal", power:0, acc:100, pp:15, cat:"status", effect:"spdefup2", ec:100, target:"self", desc:"+2 SpDef." },
  radiant_reflection:          { name:"Radiant Reflection", type:"Crystal", power:0, acc:100, pp:15, cat:"status", effect:"defup", ec:100, target:"self", desc:"+1 Def." },
  crystal_charge:              { name:"Sapphire Charge", type:"Crystal", power:0, acc:100, pp:15, cat:"status", effect:"atkup", ec:100, target:"self", desc:"+1 Atk." },
  prismatic_calm:              { name:"Prismatic Calm", type:"Crystal", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },
  crystalline_speed:           { name:"Crystalline Speed", type:"Crystal", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"+1 Speed." },
  gem_focus:                   { name:"Gem Focus", type:"Crystal", power:0, acc:100, pp:15, cat:"status", effect:"accup", ec:100, target:"self", desc:"+1 Acc." },

  // --- Primal (regular, batch4) ---
  primal_jab:                      { name:"Primal Jab", type:"Primal", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick primal-jab." },
  feral_claw:                      { name:"Feral Claw", type:"Primal", power:60, acc:100, pp:20, cat:"physical", effect:null, ec:0, target:"single", desc:"Feral claw-strike." },
  savage_bite:                     { name:"Savage Bite", type:"Primal", power:75, acc:100, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Savage bite." },
  wild_strike:                     { name:"Wild Strike", type:"Primal", power:85, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Wild strike." },
  beast_charge:                    { name:"Beast Charge", type:"Primal", dualType:["Primal","Normal"], power:90, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Beast charge. Dual Primal+Normal." },
  crushing_jaws:                   { name:"Crushing Jaws", type:"Primal", power:95, acc:90, pp:10, cat:"physical", effect:"defdown", ec:30, target:"single", desc:"Crushing jaws; may lower Def." },
  raw_fury:                        { name:"Raw Fury", type:"Primal", power:100, acc:85, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Raw fury strike." },
  primal_smash:                    { name:"Primal Smash", type:"Primal", power:110, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"wide", desc:"Wide primal smash." },
  ancient_strike:                  { name:"Ancient Strike", type:"Primal", power:80, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Ancient strike." },
  apex_predator:                   { name:"Apex Predator", type:"Primal", power:120, acc:80, pp:5, cat:"physical", effect:null, ec:0, target:"single", desc:"Apex-predator finish." },
  primal_roar:                     { name:"Bestial Roar", type:"Primal", power:50, acc:100, pp:30, cat:"special", effect:"atkdown", ec:30, target:"wide", desc:"Bestial Roar; may lower Atk." },
  ancient_pulse:                   { name:"Ancient Pulse", type:"Primal", power:70, acc:100, pp:15, cat:"special", effect:null, ec:0, target:"single", desc:"Ancient-energy pulse." },
  wild_aura:                       { name:"Wild Aura", type:"Primal", power:85, acc:90, pp:10, cat:"special", effect:"atkup", ec:30, target:"single", desc:"Wild aura; may raise own Atk." },
  soul_eater_p:                    { name:"Soul Eater", type:"Primal", power:90, acc:95, pp:10, cat:"special", effect:"drain", ec:100, target:"single", breakerVs:"Aether", desc:"Drains essence." },
  primal_eruption:                 { name:"Primeval Eruption", type:"Primal", power:100, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide Primeval Eruption." },
  world_devour:                    { name:"World Devour", type:"Primal", power:130, acc:80, pp:5, cat:"special", effect:null, ec:0, target:"single", desc:"World-devouring blast." },
  primal_focus:                    { name:"Atavistic Focus", type:"Primal", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"High crit." },
  feral_armor:                     { name:"Feral Armor", type:"Primal", power:0, acc:100, pp:15, cat:"status", effect:"defup", ec:100, target:"self", desc:"+1 Def." },
  wild_rage:                       { name:"Wild Rage", type:"Primal", power:0, acc:100, pp:10, cat:"status", effect:"atkup2", ec:100, target:"self", desc:"+2 Atk." },
  ancient_calm:                    { name:"Ancient Calm", type:"Primal", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },
  beast_speed:                     { name:"Beast Speed", type:"Primal", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"+1 Speed." },
  primal_meditation:               { name:"Untamed Meditation", type:"Primal", power:0, acc:100, pp:15, cat:"status", effect:"calmup", ec:100, target:"self", desc:"Calm-up." },

  // --- Vapor (regular, batch4) ---
  vapor_jab:                       { name:"Vapor Jab", type:"Vapor", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick vapor-jab." },
  mist_strike:                     { name:"Haze Strike", type:"Vapor", power:60, acc:100, pp:20, cat:"physical", effect:null, ec:0, target:"single", desc:"Mist-veiled strike." },
  steam_punch:                     { name:"Steam Punch", type:"Vapor", power:75, acc:100, pp:15, cat:"physical", effect:"burn", ec:20, target:"single", desc:"Steam-hot punch; may burn." },
  cloud_strike:                    { name:"Cumulus Strike", type:"Vapor", power:80, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Cloud-form strike." },
  fog_kick:                        { name:"Fog Kick", type:"Vapor", power:70, acc:100, pp:20, cat:"physical", effect:"accdown", ec:30, target:"single", alwaysCrit:true, desc:"Fog-kick; may lower Acc." },
  mist_lash:                       { name:"Smog Lash", type:"Vapor", power:85, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Mist-whip strike." },
  boiling_strike:                  { name:"Boiling Strike", type:"Vapor", power:90, acc:90, pp:10, cat:"physical", effect:"burn", ec:30, target:"single", desc:"Boiling-hot strike." },
  steam_slam:                      { name:"Steam Slam", type:"Vapor", power:100, acc:85, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Steam-pressure slam." },
  cloud_smash:                     { name:"Cloud Smash", type:"Vapor", power:95, acc:90, pp:10, cat:"physical", effect:"spedown", ec:30, target:"single", desc:"Cloud-smash; may slow." },
  mist_press:                      { name:"Mist Press", type:"Vapor", dualType:["Vapor","Aquatic"], power:110, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"wide", desc:"Wide mist-press. Dual Vapor+Aquatic." },
  miasma_blow:                     { name:"Fume Blow", type:"Vapor", power:80, acc:95, pp:15, cat:"physical", effect:"poison", ec:20, target:"single", desc:"Miasma-poisoned blow." },
  vapor_drill:                     { name:"Smog Drill", type:"Vapor", power:95, acc:95, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Vapor-condensed drill." },
  mist_s:                          { name:"Mist Pulse", type:"Vapor", power:40, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide mist pulse." },
  fog_beam:                        { name:"Fog Beam", type:"Vapor", power:55, acc:100, pp:20, cat:"special", effect:"accdown", ec:20, target:"wide", desc:"Fog beam; may lower Acc." },
  steam_burst:                     { name:"Steam Burst", type:"Vapor", power:65, acc:100, pp:20, cat:"special", effect:"burn", ec:20, target:"single", desc:"Steam burst; may burn." },
  vapor_ray:                       { name:"Vapor Ray", type:"Vapor", power:70, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"single", desc:"Vapor ray." },
  mist_pulse:                      { name:"Brume Resonance", type:"Vapor", power:75, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide Brume Resonance." },
  boil_v:                          { name:"Boil", type:"Vapor", power:80, acc:95, pp:15, cat:"special", effect:"burn", ec:30, target:"single", desc:"Boil-attack; may burn." },
  cloud_blast:                     { name:"Cloud Blast", type:"Vapor", power:85, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide cloud blast." },
  miasma_wave:                     { name:"Miasma Wave", type:"Vapor", power:65, acc:100, pp:20, cat:"special", effect:"poison", ec:20, target:"wide", desc:"Miasma wave; may poison." },
  fog_storm:                       { name:"Fog Storm", type:"Vapor", power:90, acc:90, pp:10, cat:"special", effect:"accdown", ec:30, target:"wide", breakerVs:"Fire", desc:"Fog storm; may lower Acc." },
  drizzle:                         { name:"Drizzle", type:"Vapor", power:50, acc:100, pp:25, cat:"special", effect:null, ec:0, target:"single", desc:"Light drizzle." },
  condense:                        { name:"Condense", type:"Vapor", power:80, acc:95, pp:15, cat:"special", effect:"spedown", ec:30, target:"single", desc:"Condensing pressure; may slow." },
  vapor_eruption:                  { name:"Nimbus Eruption", type:"Vapor", power:100, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide Nimbus Eruption." },
  stream_burst:                    { name:"Stream Burst", type:"Vapor", power:70, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"single", desc:"Pressurized stream." },
  acid_mist:                       { name:"Acid Mist", type:"Vapor", power:80, acc:95, pp:15, cat:"special", effect:"poison", ec:30, target:"single", desc:"Acid mist; may poison." },
  corrosive_fog:                   { name:"Corrosive Fog", type:"Vapor", power:90, acc:90, pp:10, cat:"special", effect:"spdefdown", ec:30, target:"wide", desc:"Corrosive fog; may lower SpDef." },
  steam_storm:                     { name:"Geyser Storm", type:"Vapor", power:95, acc:90, pp:10, cat:"special", effect:"burn", ec:20, target:"wide", desc:"Geyser Storm; may burn." },
  mist_flood:                      { name:"Nimbus Flood", type:"Vapor", power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Flooding mist on all foes." },
  miasma_apocalypse:               { name:"Miasma Apocalypse", type:"Vapor", power:130, acc:85, pp:5, cat:"special", effect:"poison", ec:30, target:"wide", desc:"Wide miasma; may poison." },
  burning_mist:                    { name:"Burning Mist", type:"Vapor", power:85, acc:95, pp:10, cat:"special", effect:"burn", ec:30, target:"single", desc:"Burning mist." },
  abyssal_mist:                    { name:"Abyssal Mist", type:"Vapor", dualType:["Vapor","Dark"], power:100, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"single", desc:"Dark-charged mist. Dual Vapor+Dark." },
  vapor_focus:                     { name:"Haze Focus", type:"Vapor", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"High crit." },
  mist_veil:                       { name:"Mist Veil", type:"Vapor", power:0, acc:100, pp:15, cat:"status", effect:"defup", ec:100, target:"self", desc:"+1 Def." },
  fog_screen:                      { name:"Murk Screen", type:"Vapor", power:0, acc:100, pp:15, cat:"status", effect:"spdefup", ec:100, target:"self", desc:"+1 SpDef." },
  cloud_form:                      { name:"Cloud Form", type:"Vapor", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },
  mist_speed:                      { name:"Wisp Speed", type:"Vapor", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"+1 Speed." },
  condense_form:                   { name:"Condense Form", type:"Vapor", power:0, acc:100, pp:15, cat:"status", effect:"atkup", ec:100, target:"self", desc:"+1 Atk." },
  evaporate:                       { name:"Evaporate", type:"Vapor", power:0, acc:100, pp:15, cat:"status", effect:"accup", ec:100, target:"self", desc:"+1 Acc." },
  mist_meditation:                 { name:"Cumulus Meditation", type:"Vapor", power:0, acc:100, pp:15, cat:"status", effect:"calmup", ec:100, target:"self", desc:"Calm-up." },
  vapor_calm:                      { name:"Smoke Calm", type:"Vapor", power:0, acc:100, pp:10, cat:"status", effect:"defup2", ec:100, target:"self", desc:"+2 Def." },
  boiling_rage:                    { name:"Boiling Rage", type:"Vapor", power:0, acc:100, pp:10, cat:"status", effect:"atkup2", ec:100, target:"self", desc:"+2 Atk." },

  // --- Mineral (regular, batch4) ---
  mineral_jab:                     { name:"Mineral Jab", type:"Mineral", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick mineral-jab." },
  mineral_strike:                  { name:"Lode Strike", type:"Mineral", power:60, acc:100, pp:20, cat:"physical", effect:null, ec:0, target:"single", desc:"Lode-Strike." },
  ore_punch:                       { name:"Ore Punch", type:"Mineral", power:75, acc:100, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Ore-clad punch." },
  mineral_crystal_shard:           { name:"Crystal Shard", type:"Mineral", power:80, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Sharp-shard strike." },
  mineral_smash:                   { name:"Cobble Smash", type:"Mineral", power:85, acc:95, pp:15, cat:"physical", effect:"defdown", ec:30, target:"single", desc:"May lower Def." },
  ore_smash:                       { name:"Ore Smash", type:"Mineral", power:90, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Heavy ore-smash." },
  shard_volley:                    { name:"Shard Volley", type:"Mineral", power:50, acc:95, pp:15, cat:"physical", effect:"hits", ec:0, target:"single", desc:"Triple shard-volley." },
  quarry_crush:                    { name:"Quarry Crush", type:"Mineral", dualType:["Mineral","Earth"], power:95, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Quarry crush. Dual Mineral+Earth." },
  mineral_press:                   { name:"Granite Press", type:"Mineral", power:100, acc:85, pp:10, cat:"physical", effect:null, ec:0, target:"wide", desc:"Wide Granite-Press." },
  obsidian_strike:                 { name:"Obsidian Strike", type:"Mineral", power:110, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"single", breakerVs:"Wind", desc:"Obsidian-sharp strike." },
  mineral_pulse:                   { name:"Mineral Pulse", type:"Mineral", power:45, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", desc:"Mineral pulse." },
  ore_ray:                         { name:"Ore Ray", type:"Mineral", power:70, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"single", desc:"Ore-ray." },
  shard_burst_m:                   { name:"Shard Burst", type:"Mineral", power:80, acc:95, pp:15, cat:"special", effect:"spdefdown", ec:30, target:"wide", desc:"Shard burst; may lower SpDef." },
  crystal_glow:                    { name:"Crystal Glow", type:"Mineral", power:85, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide crystal-glow." },
  mineral_resonance:               { name:"Calcite Resonance", type:"Mineral", dualType:["Mineral","Sonic"], power:90, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"single", desc:"Resonant burst. Dual Mineral+Sonic." },
  gem_storm:                       { name:"Gem Storm", type:"Mineral", power:100, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide gem-storm." },
  mineral_eruption:                { name:"Basalt Eruption", type:"Mineral", power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide Basalt Eruption." },
  quartz_blast:                    { name:"Quartz Blast", type:"Mineral", power:120, acc:80, pp:5, cat:"special", effect:null, ec:0, target:"single", desc:"High-power quartz-blast." },
  mineral_focus:                   { name:"Flint Focus", type:"Mineral", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"High crit." },
  ore_armor:                       { name:"Slate Armor", type:"Mineral", power:0, acc:100, pp:15, cat:"status", effect:"defup2", ec:100, target:"self", desc:"+2 Def." },
  shard_form:                      { name:"Shard Form", type:"Mineral", power:0, acc:100, pp:15, cat:"status", effect:"atkup", ec:100, target:"self", desc:"+1 Atk." },
  mineral_lattice:                 { name:"Mica Lattice", type:"Mineral", power:0, acc:100, pp:15, cat:"status", effect:"spdefup2", ec:100, target:"self", desc:"+2 SpDef." },
  mineral_heal:                    { name:"Sediment Heal", type:"Mineral", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },
  quarry_speed:                    { name:"Quarry Speed", type:"Mineral", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"+1 Speed." },

  // --- Toxin (regular, batch4) ---
  tox_jab:                         { name:"Toxin Jab", type:"Toxin", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick toxin-jab." },
  tox_fang:                        { name:"Venom Fang", type:"Toxin", power:55, acc:100, pp:25, cat:"physical", effect:"poison", ec:30, target:"single", desc:"Venom-fang; may poison." },
  tox_bite:                        { name:"Septic Bite", type:"Toxin", power:65, acc:100, pp:20, cat:"physical", effect:"poison", ec:30, target:"single", desc:"Septic Bite." },
  tox_acid_strike:                 { name:"Vitriol Strike", type:"Toxin", power:75, acc:100, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Vitriol-Strike." },
  tox_corrosive_claw:              { name:"Acrid Claw", type:"Toxin", power:80, acc:95, pp:15, cat:"physical", effect:"defdown", ec:30, target:"single", desc:"May lower Def." },
  tox_lash:                        { name:"Toxic Lash", type:"Toxin", power:70, acc:100, pp:20, cat:"physical", effect:"poison", ec:30, target:"single", desc:"Toxic lash." },
  tox_venom_thrust:                { name:"Venom Thrust", type:"Toxin", power:85, acc:90, pp:15, cat:"physical", effect:"poison", ec:50, target:"single", alwaysCrit:true, desc:"Venom-thrust; high poison chance." },
  tox_slash:                       { name:"Acid Slash", type:"Toxin", power:90, acc:95, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Acid-slash." },
  tox_sting:                       { name:"Toxic Sting", type:"Toxin", power:50, acc:100, pp:30, cat:"physical", effect:"priority", ec:0, target:"single", desc:"First-strike sting." },
  tox_miasma_strike:               { name:"Sulfuric Spray", type:"Toxin", power:80, acc:100, pp:15, cat:"physical", effect:"poison", ec:30, target:"single", desc:"Sulfuric-Spray." },
  tox_burst_phy:                   { name:"Corrosive Burst", type:"Toxin", power:95, acc:90, pp:10, cat:"physical", effect:"defdown", ec:30, target:"single", desc:"Corrosive burst." },
  tox_kiss:                        { name:"Toxic Kiss", type:"Toxin", power:60, acc:100, pp:20, cat:"physical", effect:"poison", ec:100, target:"single", desc:"Guaranteed poison." },
  tox_drown:                       { name:"Bilious Drown", type:"Toxin", power:85, acc:95, pp:10, cat:"physical", effect:null, ec:0, target:"wide", desc:"Drowning venom." },
  tox_press:                       { name:"Acid Press", type:"Toxin", power:100, acc:85, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Acid-press." },
  tox_plague_claw:                 { name:"Plague Claw", type:"Toxin", dualType:["Toxin","Nature"], power:90, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Plague-tipped. Dual Toxin+Nature." },
  tox_lash2:                       { name:"Miasma Lash", type:"Toxin", power:75, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Miasma-lash." },
  tox_smash:                       { name:"Toxin Smash", type:"Toxin", power:110, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"single", desc:"Toxin-smash." },
  tox_storm_phy:                   { name:"Malignant Storm", type:"Toxin", power:105, acc:85, pp:10, cat:"physical", effect:null, ec:0, target:"wide", desc:"Wide Malignant-Storm." },
  tox_finish:                      { name:"Corrosive Finish", type:"Toxin", power:120, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"single", desc:"Closing corrosive finish." },
  tox_plague_strike:               { name:"Blight Strike", type:"Toxin", power:95, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", breakerVs:"Fairy", desc:"Blight-Strike." },
  tox_pulse:                       { name:"Toxin Pulse", type:"Toxin", power:45, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", desc:"Single toxin-pulse." },
  tox_venom_ray:                   { name:"Venom Ray", type:"Toxin", power:65, acc:100, pp:20, cat:"special", effect:"poison", ec:30, target:"single", desc:"Venom ray." },
  tox_acid_burst:                  { name:"Acid Burst", type:"Toxin", power:80, acc:95, pp:15, cat:"special", effect:"spdefdown", ec:30, target:"wide", desc:"Acid burst." },
  tox_miasma_blast:                { name:"Miasma Blast", type:"Toxin", power:90, acc:95, pp:10, cat:"special", effect:"poison", ec:30, target:"wide", desc:"Miasma blast." },
  tox_storm_spec:                  { name:"Virulent Storm", type:"Toxin", power:100, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide Virulent Storm." },
  tox_plague_wave:                 { name:"Plague Wave", type:"Toxin", dualType:["Toxin","Dream"], power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide plague-wave. Dual Toxin+Dream." },
  tox_focus:                       { name:"Noxious Focus", type:"Toxin", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"High crit." },
  tox_venom_field:                 { name:"Squalid Field", type:"Toxin", power:0, acc:100, pp:15, cat:"status", effect:"atkup", ec:100, target:"self", desc:"+1 Atk." },
  tox_acid_armor:                  { name:"Caustic Shell", type:"Toxin", power:0, acc:100, pp:15, cat:"status", effect:"defup", ec:100, target:"self", desc:"+1 Def." },
  tox_corrosive_step:              { name:"Corrosive Step", type:"Toxin", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"+1 Speed." },
  tox_miasma_screen:               { name:"Tainted Screen", type:"Toxin", power:0, acc:100, pp:15, cat:"status", effect:"spdefup", ec:100, target:"self", desc:"+1 SpDef." },
  tox_poison_resolve:              { name:"Poison Resolve", type:"Toxin", power:0, acc:100, pp:10, cat:"status", effect:"atkup2", ec:100, target:"self", desc:"+2 Atk." },
  tox_plague_charge:               { name:"Rancid Charge", type:"Toxin", power:0, acc:100, pp:15, cat:"status", effect:"spaup", ec:100, target:"self", desc:"+1 SpA." },
  tox_calm:                        { name:"Putrid Calm", type:"Toxin", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },
  tox_venom_mark:                  { name:"Pox Mark", type:"Toxin", power:0, acc:100, pp:15, cat:"status", effect:"atkdown", ec:100, target:"single", desc:"Lowers foe's Atk." },
  tox_acidic_glance:               { name:"Acidic Glance", type:"Toxin", power:0, acc:100, pp:15, cat:"status", effect:"defdown", ec:100, target:"single", desc:"Lowers foe's Def." },
  tox_miasma_lure:                 { name:"Miasma Lure", type:"Toxin", power:0, acc:100, pp:15, cat:"status", effect:"spedown", ec:100, target:"single", desc:"Lowers foe's Speed." },
  tox_plague_meditation:           { name:"Fester Meditation", type:"Toxin", power:0, acc:100, pp:15, cat:"status", effect:"calmup", ec:100, target:"self", desc:"Calm-up." },

  // --- Chrono (regular, batch4) ---
  chrono_jab:                      { name:"Chrono Jab", type:"Chrono", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick chrono-jab." },
  time_strike:                     { name:"Time Strike", type:"Chrono", power:60, acc:100, pp:20, cat:"physical", effect:null, ec:0, target:"single", desc:"Time-distorted strike." },
  temporal_slash:                  { name:"Temporal Slash", type:"Chrono", power:75, acc:100, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Temporal slash." },
  era_punch:                       { name:"Era Punch", type:"Chrono", power:85, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Aged-fist punch." },
  chrono_smash:                    { name:"Aeon Smash", type:"Chrono", power:95, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Aeon-Smash." },
  timefade_strike:                 { name:"Timefade Strike", type:"Chrono", power:90, acc:95, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Time-fading strike." },
  era_crush:                       { name:"Era Crush", type:"Chrono", power:100, acc:85, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Era-crushing impact." },
  chrono_press:                    { name:"Clockwork Press", type:"Chrono", dualType:["Chrono","Aether"], power:110, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"single", desc:"Clockwork-Press. Dual Chrono+Aether." },
  epoch_strike:                    { name:"Epoch Strike", type:"Chrono", power:80, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Epoch-strike." },
  timewarp_blow:                   { name:"Timewarp Blow", type:"Chrono", power:120, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"single", breakerVs:"Spectral", desc:"Timewarp blow." },
  chrono_pulse:                    { name:"Chrono Pulse", type:"Chrono", power:45, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", desc:"Chrono pulse." },
  time_ray:                        { name:"Time Ray", type:"Chrono", power:65, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"single", desc:"Time ray." },
  temporal_wave:                   { name:"Temporal Wave", type:"Chrono", power:75, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide temporal wave." },
  era_burst:                       { name:"Millennium Burst", type:"Chrono", power:80, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Millennium Burst." },
  chrono_blast:                    { name:"Continuum Blast", type:"Chrono", power:90, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"single", desc:"Continuum Blast." },
  timefade_beam:                   { name:"Timefade Beam", type:"Chrono", power:85, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"single", desc:"Timefade beam." },
  age_burst:                       { name:"Age Burst", type:"Chrono", power:100, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide age burst." },
  epoch_eruption:                  { name:"Epoch Eruption", type:"Chrono", power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide epoch eruption." },
  chrono_storm:                    { name:"Chrono Storm", type:"Chrono", power:95, acc:90, pp:10, cat:"special", effect:"sluggish", ec:30, target:"wide", desc:"Chrono storm; may inflict Sluggish." },
  era_calamity:                    { name:"Era Calamity", type:"Chrono", dualType:["Chrono","Stellar"], power:120, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"single", desc:"Era calamity. Dual Chrono+Stellar." },
  chrono_focus:                    { name:"Hourglass Focus", type:"Chrono", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"High crit." },
  time_meditation:                 { name:"Time Meditation", type:"Chrono", power:0, acc:100, pp:15, cat:"status", effect:"calmup", ec:100, target:"self", desc:"Calm-up." },
  temporal_armor:                  { name:"Temporal Armor", type:"Chrono", power:0, acc:100, pp:15, cat:"status", effect:"defup2", ec:100, target:"self", desc:"+2 Def." },
  era_calm:                        { name:"Sundial Calm", type:"Chrono", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },
  chrono_speed:                    { name:"Aevum Speed", type:"Chrono", power:0, acc:100, pp:10, cat:"status", effect:"speup2", ec:100, target:"self", desc:"+2 Speed." },
  timefade_step:                   { name:"Timefade Step", type:"Chrono", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"+1 Speed." },
  age_resolve:                     { name:"Age Resolve", type:"Chrono", power:0, acc:100, pp:15, cat:"status", effect:"atkup", ec:100, target:"self", desc:"+1 Atk." },
  epoch_charge:                    { name:"Epoch Charge", type:"Chrono", power:0, acc:100, pp:15, cat:"status", effect:"spaup", ec:100, target:"self", desc:"+1 SpA." },
  chrono_lock:                     { name:"Eternity Lock", type:"Chrono", power:0, acc:100, pp:15, cat:"status", effect:"spedown", ec:100, target:"single", desc:"Lowers foe's Speed." },
  timewarp_meditation:             { name:"Timewarp Meditation", type:"Chrono", power:0, acc:100, pp:15, cat:"status", effect:"accup", ec:100, target:"self", desc:"+1 Acc." },

  // --- Stellar (regular, batch4) ---
  star_jab:                        { name:"Star Jab", type:"Stellar", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", rarity:"exclusive", desc:"Quick star-jab." },
  stellar_strike:                  { name:"Stellar Strike", type:"Stellar", power:70, acc:100, pp:15, cat:"physical", effect:null, ec:0, target:"single", rarity:"exclusive", desc:"Stellar strike." },
  galaxy_punch_phy:                { name:"Galaxy Punch", type:"Stellar", power:85, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, rarity:"exclusive", desc:"Galaxy-punch." },
  cosmic_slam:                     { name:"Cosmic Slam", type:"Stellar", power:95, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Cosmic slam." },
  nova_strike:                     { name:"Nova Strike", type:"Stellar", dualType:["Stellar","Fire"], power:90, acc:95, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Nova-fire strike. Dual Stellar+Fire." },
  starlight_charge:                { name:"Starlight Charge", type:"Stellar", power:100, acc:85, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Starlight charge." },
  supernova_press:                 { name:"Supernova Press", type:"Stellar", power:110, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"wide", rarity:"exclusive", desc:"Wide supernova press." },
  cosmic_finisher:                 { name:"Quasar Finisher", type:"Stellar", power:120, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"single", rarity:"exclusive", desc:"Closing cosmic blow." },
  stellar_pulse:                   { name:"Stellar Pulse", type:"Stellar", power:45, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", rarity:"exclusive", desc:"Stellar pulse." },
  star_ray:                        { name:"Star Ray", type:"Stellar", power:60, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"single", desc:"Star ray." },
  cosmic_beam:                     { name:"Cosmic Beam", type:"Stellar", power:70, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide cosmic beam." },
  nova_burst:                      { name:"Nova Burst", type:"Stellar", power:80, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide nova burst." },
  supernova_blast:                 { name:"Supernova Blast", type:"Stellar", power:90, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"single", rarity:"exclusive", desc:"Supernova blast." },
  galactic_wave:                   { name:"Galactic Wave", type:"Stellar", power:85, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"wide", rarity:"exclusive", desc:"Galactic wave." },
  starlight_beam:                  { name:"Starlight Beam", type:"Stellar", power:75, acc:100, pp:15, cat:"special", effect:null, ec:0, target:"single", breakerVs:"Dark", rarity:"exclusive", desc:"Starlight beam." },
  cosmic_storm:                    { name:"Pulsar Storm", type:"Stellar", power:95, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Pulsar Storm." },
  supernova_eruption:              { name:"Supernova Eruption", type:"Stellar", power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide supernova eruption." },
  starfall_s:                      { name:"Starfall", type:"Stellar", power:100, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"single", desc:"Starfall." },
  cosmic_flare:                    { name:"Comet Flare", type:"Stellar", power:90, acc:95, pp:10, cat:"special", effect:null, ec:0, target:"single", desc:"Comet Flare." },
  nebula_burst:                    { name:"Nebula Burst", type:"Stellar", power:95, acc:90, pp:10, cat:"special", effect:"confuse", ec:30, target:"wide", desc:"Nebula burst; may confuse." },
  nova_calamity:                   { name:"Nova Calamity", type:"Stellar", power:105, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"wide", rarity:"exclusive", desc:"Wide nova calamity." },
  astral_blast:                    { name:"Astral Blast", type:"Stellar", power:120, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"single", desc:"High-power astral blast." },
  galaxy_apocalypse:               { name:"Galaxy Apocalypse", type:"Stellar", power:130, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide galaxy apocalypse." },
  stellar_focus:                   { name:"Stellar Focus", type:"Stellar", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", rarity:"exclusive", desc:"High crit." },
  cosmic_meditation:               { name:"Zodiac Meditation", type:"Stellar", power:0, acc:100, pp:15, cat:"status", effect:"calmup", ec:100, target:"self", rarity:"exclusive", desc:"Calm-up." },
  nova_armor:                      { name:"Meteor Armor", type:"Stellar", power:0, acc:100, pp:15, cat:"status", effect:"defup", ec:100, target:"self", rarity:"exclusive", desc:"+1 Def." },
  star_calm:                       { name:"Orbital Calm", type:"Stellar", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", rarity:"exclusive", desc:"Restores half HP." },
  galactic_speed:                  { name:"Galactic Speed", type:"Stellar", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", rarity:"exclusive", desc:"+1 Speed." },
  supernova_resolve:               { name:"Astral Resolve", type:"Stellar", power:0, acc:100, pp:10, cat:"status", effect:"atkup2", ec:100, target:"self", desc:"+2 Atk." },
  astral_focus:                    { name:"Astral Focus", type:"Stellar", power:0, acc:100, pp:10, cat:"status", effect:"spaup2", ec:100, target:"self", desc:"+2 SpA." },
  cosmic_aura:                     { name:"Celestial Aura", type:"Stellar", power:0, acc:100, pp:15, cat:"status", effect:"accup", ec:100, target:"self", rarity:"exclusive", desc:"+1 Acc." },
  starlight_lock:                  { name:"Starlight Lock", type:"Stellar", power:0, acc:100, pp:15, cat:"status", effect:"spdefdown", ec:100, target:"single", desc:"Lowers foe's SpDef." },
  nebula_meditation:               { name:"Nebula Meditation", type:"Stellar", power:0, acc:100, pp:15, cat:"status", effect:"spdefup2", ec:100, target:"self", rarity:"exclusive", desc:"+2 SpDef." },

  // --- Dream (regular, batch4) ---
  dream_jab:                       { name:"Dream Jab", type:"Dream", power:40, acc:100, pp:30, cat:"physical", effect:null, ec:0, target:"single", desc:"Quick dream-jab." },
  nightmare_strike:                { name:"Nightmare Strike", type:"Dream", power:70, acc:100, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Nightmare-strike." },
  somnia_punch:                    { name:"Somnia Punch", type:"Dream", power:80, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", desc:"Somnia-punch." },
  dream_charge:                    { name:"Reverie Charge", type:"Dream", power:85, acc:95, pp:15, cat:"physical", effect:null, ec:0, target:"single", alwaysCrit:true, desc:"Reverie-Charge." },
  nightmare_slash:                 { name:"Terror Slash", type:"Dream", power:90, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Terror-Slash." },
  dream_press:                     { name:"Oneiric Press", type:"Dream", dualType:["Dream","Mental"], power:95, acc:90, pp:10, cat:"physical", effect:null, ec:0, target:"single", desc:"Oneiric-Press. Dual Dream+Mental." },
  lullaby_strike:                  { name:"Lullaby Strike", type:"Dream", power:100, acc:85, pp:10, cat:"physical", effect:"sleep", ec:30, target:"single", desc:"Lullaby-strike; may sleep." },
  dreamscape_smash:                { name:"Dreamscape Smash", type:"Dream", power:110, acc:85, pp:5, cat:"physical", effect:null, ec:0, target:"wide", desc:"Wide dreamscape smash." },
  dream_pulse:                     { name:"Dream Pulse", type:"Dream", power:35, acc:100, pp:30, cat:"special", effect:null, ec:0, target:"single", desc:"Dream pulse." },
  somnia_ray:                      { name:"Somnia Ray", type:"Dream", power:50, acc:100, pp:25, cat:"special", effect:null, ec:0, target:"single", desc:"Somnia ray." },
  dream_beam:                      { name:"Lucid Beam", type:"Dream", power:65, acc:100, pp:20, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide Lucid Beam." },
  nightmare_burst:                 { name:"Dread Burst", type:"Dream", power:75, acc:95, pp:15, cat:"special", effect:"sleep", ec:20, target:"wide", desc:"Wide; may sleep." },
  lullaby_song:                    { name:"Lullaby Song", type:"Dream", power:70, acc:100, pp:20, cat:"special", effect:"sleep", ec:30, target:"single", desc:"May sleep." },
  dream_wave:                      { name:"Trance Wave", type:"Dream", power:80, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide Trance Wave." },
  somnia_blast:                    { name:"Somnia Blast", type:"Dream", power:85, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"single", desc:"Somnia blast." },
  nightmare_storm:                 { name:"Nightmare Storm", type:"Dream", power:90, acc:90, pp:10, cat:"special", effect:"confuse", ec:30, target:"wide", desc:"Wide; may confuse." },
  dream_eruption:                  { name:"Slumber Eruption", type:"Dream", power:100, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide Slumber Eruption." },
  lullaby_aura:                    { name:"Lullaby Aura", type:"Dream", power:75, acc:100, pp:15, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide lullaby aura." },
  dream_breath:                    { name:"Hypnic Breath", type:"Dream", power:80, acc:95, pp:15, cat:"special", effect:null, ec:0, target:"single", desc:"Hypnic Breath." },
  nightmare_calamity:              { name:"Phantasm Calamity", type:"Dream", power:95, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"single", desc:"Phantasm Calamity." },
  somnia_storm:                    { name:"Hypnos Storm", type:"Dream", power:95, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide Hypnos Storm." },
  dream_swirl:                     { name:"Drowse Swirl", type:"Dream", power:85, acc:95, pp:10, cat:"special", effect:"sleep", ec:30, target:"single", desc:"May sleep." },
  nightmare_haunt:                 { name:"Gloom Haunt", type:"Dream", power:90, acc:90, pp:10, cat:"special", effect:null, ec:0, target:"single", breakerVs:"Spectral", desc:"Haunt." },
  dream_apocalypse_spec:           { name:"Mirage Apocalypse", type:"Dream", power:105, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide Mirage Apocalypse." },
  nightmare_finisher:              { name:"Dread Finisher", type:"Dream", power:110, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"single", desc:"Closing nightmare blow." },
  starlit_dream:                   { name:"Starlit Dream", type:"Dream", dualType:["Dream","Stellar"], power:100, acc:85, pp:10, cat:"special", effect:null, ec:0, target:"single", desc:"Cosmic dream. Dual Dream+Stellar." },
  cosmic_nightmare:                { name:"Cosmic Nightmare", type:"Dream", power:120, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide cosmic-nightmare." },
  eternal_dream_n:                 { name:"Eternal Dream", type:"Dream", power:130, acc:85, pp:5, cat:"special", effect:null, ec:0, target:"wide", desc:"Wide eternal dream." },
  dream_focus:                     { name:"Reverie Focus", type:"Dream", power:0, acc:100, pp:15, cat:"status", effect:"focus", ec:100, target:"self", desc:"High crit." },
  nightmare_aura:                  { name:"Phobia Aura", type:"Dream", power:0, acc:100, pp:15, cat:"status", effect:"atkdown", ec:100, target:"single", desc:"Lowers foe's Atk." },
  somnia_calm:                     { name:"Doze Calm", type:"Dream", power:0, acc:100, pp:10, cat:"status", effect:"heal50", ec:100, target:"self", desc:"Restores half HP." },
  dream_meditation:                { name:"Trance Meditation", type:"Dream", power:0, acc:100, pp:15, cat:"status", effect:"calmup", ec:100, target:"self", desc:"Calm-up." },
  lullaby_charge:                  { name:"Nocturne Charge", type:"Dream", power:0, acc:100, pp:15, cat:"status", effect:"spaup", ec:100, target:"self", desc:"+1 SpA." },
  dream_armor:                     { name:"Slumber Armor", type:"Dream", power:0, acc:100, pp:15, cat:"status", effect:"defup", ec:100, target:"self", desc:"+1 Def." },
  nightmare_resolve:               { name:"Fright Resolve", type:"Dream", power:0, acc:100, pp:15, cat:"status", effect:"atkup", ec:100, target:"self", desc:"+1 Atk." },
  somnia_speed:                    { name:"Hypnos Speed", type:"Dream", power:0, acc:100, pp:15, cat:"status", effect:"speup", ec:100, target:"self", desc:"+1 Speed." },
  dream_focus_acc:                 { name:"Lucid Acuity", type:"Dream", power:0, acc:100, pp:15, cat:"status", effect:"accup", ec:100, target:"self", desc:"+1 Acc." },
  nightmare_lock:                  { name:"Phantasm Lock", type:"Dream", power:0, acc:100, pp:15, cat:"status", effect:"spedown", ec:100, target:"single", desc:"Lowers foe's Speed." },

  // ============================================================
  // STEP 3B ADDITIONS — EXCLUSIVE MOVES
  // Each move has rarity:"exclusive" — assigned to specific
  // legendary/signature Lumori in Step 4. To be audited as a
  // separate group per the typing-system overhaul plan.
  // ============================================================

  // --- Sonic (exclusive) ---
  perfect_pitch:           { name:"Perfect Pitch", type:"Sonic", power:0, acc:100, pp:5, cat:"status", effect:"echolocation_and_deafen", ec:100, target:"single", rarity:"exclusive", desc:"Pitch-perfect tone locks Echolocation AND Deafen on the target. Signature." },
  infrasonic_apocalypse:   { name:"Infrasonic Apocalypse", type:"Sonic", power:150, acc:85, pp:5, cat:"special", effect:"recharge_and_burnt_out", ec:100, target:"wide", rarity:"exclusive", desc:"Devastating infrasound across all foes; inflicts Burnt-out and requires rest after." },

  // --- Fire (exclusive) ---
  solar_zenith:            { name:"Solar Zenith", type:"Fire", dualType:["Fire","Stellar"], power:130, acc:90, pp:5, cat:"special", effect:"recharge_and_spatkup_self", ec:100, target:"single", rarity:"exclusive", desc:"Signature solar-zenith blast; requires rest but guarantees +1 SpA. Dual Fire+Stellar." },
  infernos_grasp:          { name:"Inferno's Grasp", type:"Fire", power:120, acc:85, pp:5, cat:"physical", effect:"burn", ec:100, target:"single", rarity:"exclusive", desc:"Guaranteed-burn physical grip — signature legendary move." },
  magma_baptism:           { name:"Magma Baptism", type:"Fire", power:150, acc:85, pp:5, cat:"special", effect:"recharge_and_bleed_target", ec:100, target:"wide", rarity:"exclusive", desc:"Devastating wide magma wave; inflicts Bleed on all foes and requires rest." },

  // --- Nature (exclusive) ---
  apocalypse_bloom:        { name:"Apocalypse Bloom", type:"Nature", power:130, acc:85, pp:5, cat:"special", effect:"bleed", ec:100, target:"wide", rarity:"exclusive", desc:"Wide bleed-blooming wave — signature." },
  parasitic_drain:         { name:"Parasitic Drain", type:"Nature", power:90, acc:100, pp:10, cat:"special", effect:"drain", ec:100, target:"single", rarity:"exclusive", desc:"Powerful drain-channel — signature." },
  ancient_grove:           { name:"Ancient Grove", type:"Nature", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_tainted_target", ec:100, target:"wide", rarity:"exclusive", desc:"Ancient grove-energy releases Tainted on all foes; requires rest." },

  // --- Electric (exclusive) ---
  tesla_overload:          { name:"Tesla Overload", type:"Electric", power:130, acc:90, pp:5, cat:"special", effect:"paralyze", ec:30, target:"wide", rarity:"exclusive", desc:"Wide overload — may paralyze all foes." },
  eye_of_storm:            { name:"Eye of the Storm", type:"Electric", power:0, acc:100, pp:5, cat:"status", effect:"echolocation_and_speup_self", ec:100, target:"single", rarity:"exclusive", desc:"Locks Echolocation on target AND raises own Speed." },
  plasma_judgement:        { name:"Plasma Judgement", type:"Electric", power:150, acc:85, pp:5, cat:"special", effect:"recharge_and_burn_target", ec:100, target:"single", rarity:"exclusive", desc:"Searing plasma-bolt; guaranteed burn; requires rest." },

  // --- Earth (exclusive) ---
  terra_lock:              { name:"Terra Lock", type:"Earth", power:0, acc:100, pp:5, cat:"status", effect:"petrify", ec:100, target:"single", rarity:"exclusive", desc:"Locks the target in stone — signature Petrify status." },
  world_rend:              { name:"World Rend", type:"Earth", power:130, acc:85, pp:5, cat:"physical", effect:"defdown", ec:100, target:"wide", rarity:"exclusive", desc:"Earth-rending impact; guaranteed Def-down on all foes." },
  gaia_judgement:          { name:"Gaia Judgement", type:"Earth", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_statue_target", ec:30, target:"single", rarity:"exclusive", desc:"Geomantic judgement; may directly inflict Statue; requires rest." },

  // --- Wind (exclusive) ---
  gale_force:              { name:"Gale Force", type:"Wind", power:130, acc:95, pp:5, cat:"special", effect:"smothered", ec:100, target:"wide", rarity:"exclusive", desc:"Smothering wide gust — signature." },
  stratos_pierce:          { name:"Stratosphere Pierce", type:"Wind", power:150, acc:80, pp:5, cat:"physical", effect:"recharge_and_marked_target", ec:100, target:"single", rarity:"exclusive", desc:"Sky-diving pierce; locks Marked; requires rest." },
  sky_dominion:            { name:"Sky Dominion", type:"Wind", power:0, acc:100, pp:5, cat:"status", effect:"speup2_and_atkup_self", ec:100, target:"self", rarity:"exclusive", desc:"Total sky command: +2 Speed AND +1 Atk." },

  // --- Ice (exclusive) ---
  eternal_winter:          { name:"Eternal Winter", type:"Ice", power:0, acc:100, pp:5, cat:"status", effect:"sluggish_and_spdefup_self", ec:100, target:"wide", rarity:"exclusive", desc:"Locks Sluggish on all foes AND raises own SpDef." },
  glaciation:              { name:"Glaciation", type:"Ice", power:130, acc:85, pp:5, cat:"special", effect:"freeze", ec:100, target:"wide", rarity:"exclusive", desc:"Guaranteed freeze on all foes — signature." },
  permafrost_lock:         { name:"Permafrost Lock", type:"Ice", power:150, acc:80, pp:5, cat:"physical", effect:"recharge_and_petrify_target", ec:30, target:"single", rarity:"exclusive", desc:"Permafrost binds the target; may inflict Petrify; requires rest." },

  // --- Dark (exclusive) ---
  eternal_night:           { name:"Eternal Night", type:"Dark", power:0, acc:100, pp:5, cat:"status", effect:"marked_and_atkdown_target", ec:100, target:"wide", rarity:"exclusive", desc:"Locks Marked on all foes AND lowers their Atk." },
  soul_devour:             { name:"Soul Devour", type:"Dark", power:130, acc:85, pp:5, cat:"physical", effect:"bleed_and_drain", ec:100, target:"single", rarity:"exclusive", desc:"Guaranteed Bleed-drain physical — signature." },
  abyssal_eclipse:         { name:"Abyssal Eclipse", type:"Dark", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_petrify_target", ec:30, target:"wide", rarity:"exclusive", desc:"Wide abyssal eclipse; may inflict Petrify; requires rest." },

  // --- Fairy (exclusive) ---
  wish_grant:              { name:"Wish Grant", type:"Fairy", power:0, acc:100, pp:5, cat:"status", effect:"heal50_and_echolocation_self", ec:100, target:"self", rarity:"exclusive", desc:"Restores half HP AND locks Echolocation on self." },
  ethereal_judgement:      { name:"Ethereal Judgement", type:"Fairy", power:130, acc:90, pp:5, cat:"special", effect:"atkdown", ec:100, target:"wide", rarity:"exclusive", desc:"Wide ethereal judgement; guaranteed atkdown on all foes." },
  dreamscape:              { name:"Dreamscape", type:"Fairy", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_sleep_target", ec:100, target:"wide", rarity:"exclusive", desc:"Dreamscape envelopes all foes; guaranteed sleep; requires rest." },

  // --- Metal (exclusive) ---
  supernova_forge:         { name:"Supernova Forge", type:"Metal", power:130, acc:95, pp:5, cat:"special", effect:"brittle", ec:100, target:"wide", rarity:"exclusive", desc:"Wide brittle-inducing forge-blast — signature." },
  tungsten_titan:          { name:"Tungsten Titan", type:"Metal", power:150, acc:80, pp:5, cat:"physical", effect:"recharge_and_petrify_target", ec:30, target:"single", rarity:"exclusive", desc:"Titan-grade tungsten strike; may inflict Petrify; requires rest." },
  ironheart:               { name:"Ironheart", type:"Metal", power:0, acc:100, pp:5, cat:"status", effect:"defup2_and_spdefup2_self", ec:100, target:"self", rarity:"exclusive", desc:"Iron-heart resolve: +2 Def AND +2 SpDef." },

  // --- Poison (exclusive, batch3) ---
  plague_bringer:              { name:"Plague Bringer", type:"Poison", power:130, acc:90, pp:5, cat:"physical", effect:"tainted", ec:100, target:"wide", rarity:"exclusive", desc:"Inflicts Tainted on all foes." },
  miasma_storm:                { name:"Miasma Storm", type:"Poison", power:100, acc:90, pp:10, cat:"special", effect:"poison", ec:100, target:"wide", rarity:"exclusive", desc:"Guaranteed poison wide attack." },
  necrotic_burst:              { name:"Necrotic Burst", type:"Poison", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_bleed_target", ec:100, target:"single", rarity:"exclusive", desc:"Necrotic blast; bleed + rest." },

  // --- Mental (exclusive, batch3) ---
  cosmic_thought:              { name:"Cosmic Thought", type:"Mental", dualType:["Mental","Stellar"], power:130, acc:85, pp:5, cat:"special", effect:"marked", ec:100, target:"single", rarity:"exclusive", desc:"Cosmic thought-strike. Locks Marked." },
  psyche_drain:                { name:"Psyche Drain", type:"Mental", power:90, acc:100, pp:10, cat:"special", effect:"drain", ec:100, target:"single", rarity:"exclusive", desc:"Drains psychic essence." },
  mind_apocalypse:             { name:"Mind Apocalypse", type:"Mental", power:150, acc:85, pp:5, cat:"special", effect:"recharge_and_smothered_target", ec:100, target:"wide", rarity:"exclusive", desc:"Smothers all foes; needs rest." },

  // --- Draconic (exclusive, batch3) ---
  eternal_dragon:              { name:"Eternal Dragon", type:"Draconic", power:0, acc:100, pp:5, cat:"status", effect:"atkup2_and_spaup2_self", ec:100, target:"self", rarity:"exclusive", desc:"+2 Atk AND +2 SpA self." },
  wyrm_calamity:               { name:"Wyrm Calamity", type:"Draconic", power:130, acc:85, pp:5, cat:"special", effect:"bleed", ec:30, target:"wide", rarity:"exclusive", desc:"Wide wyrm-calamity; may bleed." },
  genesis_dragon:              { name:"Genesis Dragon", type:"Draconic", dualType:["Draconic","Crystal"], power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_crystallize_target", ec:100, target:"single", rarity:"exclusive", desc:"Crystallizes target. Dual Draconic+Crystal." },

  // --- Normal (exclusive, batch3) ---
  final_strike:                { name:"Final Strike", type:"Normal", power:130, acc:85, pp:5, cat:"physical", effect:"recoil", ec:100, target:"single", rarity:"exclusive", desc:"Kamikaze strike with heavy recoil." },
  burnout_blast:               { name:"Burnout Blast", type:"Normal", power:100, acc:90, pp:5, cat:"special", effect:"burnt_out", ec:100, target:"wide", rarity:"exclusive", desc:"Inflicts Burnt-out on all foes." },
  apocalypse_finale:           { name:"Apocalypse Finale", type:"Normal", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_bleed_target", ec:100, target:"wide", rarity:"exclusive", desc:"Wide bleed apocalypse; needs rest." },

  // --- Spectral (exclusive, batch3) ---
  ghost_devourer:              { name:"Ghost Devourer", type:"Spectral", power:130, acc:85, pp:5, cat:"physical", effect:"drain", ec:100, target:"single", rarity:"exclusive", desc:"Devour and heal." },
  spectral_bind:               { name:"Spectral Bind", type:"Spectral", power:0, acc:100, pp:5, cat:"status", effect:"petrify", ec:100, target:"single", rarity:"exclusive", desc:"Petrify-bind the target." },
  abyssal_haunting:            { name:"Abyssal Haunting", type:"Spectral", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_hexed_target", ec:100, target:"wide", rarity:"exclusive", desc:"Hexes all foes; needs rest." },

  // --- Fighting (exclusive, batch3) ---
  nova_punch:                  { name:"Nova Punch", type:"Fighting", power:130, acc:85, pp:5, cat:"physical", effect:"marked", ec:100, target:"single", rarity:"exclusive", desc:"Locks Marked." },
  dragon_press:                { name:"Dragon Press", type:"Fighting", power:0, acc:100, pp:5, cat:"status", effect:"atkup2_and_speup_self", ec:100, target:"self", rarity:"exclusive", desc:"+2 Atk AND +1 Speed." },
  ultimate_strike:             { name:"Ultimate Strike", type:"Fighting", power:150, acc:80, pp:5, cat:"physical", effect:"recharge_and_bleed_target", ec:100, target:"single", rarity:"exclusive", desc:"Guaranteed Bleed; needs rest." },

  // --- Aether (exclusive, batch3) ---
  cosmic_purify:               { name:"Cosmic Purify", type:"Aether", power:0, acc:100, pp:5, cat:"status", effect:"marked", ec:100, target:"wide", rarity:"exclusive", desc:"Locks Marked on all foes." },
  divine_judgement:            { name:"Divine Judgement", type:"Aether", power:130, acc:90, pp:5, cat:"special", effect:null, ec:0, target:"wide", rarity:"exclusive", desc:"Wide divine judgement." },
  infinity_strike:             { name:"Infinity Strike", type:"Aether", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_petrify_target", ec:100, target:"single", rarity:"exclusive", desc:"May Petrify; needs rest." },

  // --- Crystal (exclusive, batch3) ---
  prism_apocalypse:            { name:"Prism Apocalypse", type:"Crystal", power:130, acc:85, pp:5, cat:"special", effect:"brittle", ec:100, target:"wide", rarity:"exclusive", desc:"Locks Brittle on all foes." },
  infinity_facet:              { name:"Infinity Facet", type:"Crystal", power:0, acc:100, pp:5, cat:"status", effect:"spdefup2_and_defup2_self", ec:100, target:"self", rarity:"exclusive", desc:"+2 SpDef AND +2 Def." },
  star_crystal:                { name:"Star Crystal", type:"Crystal", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_crystallize_target", ec:100, target:"wide", rarity:"exclusive", desc:"Crystallizes all foes; needs rest." },

  // --- Primal (exclusive, batch4) ---
  world_eater:                     { name:"World Eater", type:"Primal", power:130, acc:85, pp:5, cat:"physical", effect:"bleed", ec:100, target:"single", rarity:"exclusive", desc:"Guaranteed bleed." },
  primal_calamity:                 { name:"Primal Calamity", type:"Primal", power:0, acc:100, pp:5, cat:"status", effect:"atkup2_and_defup2_self", ec:100, target:"self", rarity:"exclusive", desc:"+2 Atk AND +2 Def." },
  age_ender:                       { name:"Age Ender", type:"Primal", dualType:["Primal","Earth"], power:150, acc:80, pp:5, cat:"physical", effect:"recharge_and_petrify_target", ec:100, target:"single", rarity:"exclusive", desc:"May Petrify; needs rest. Dual Primal+Earth." },

  // --- Vapor (exclusive, batch4) ---
  vapor_shroud:                    { name:"Vapor Shroud", type:"Vapor", power:0, acc:100, pp:5, cat:"status", effect:"smothered", ec:100, target:"single", rarity:"exclusive", desc:"Smothers the target." },
  miasma_calamity:                 { name:"Miasma Calamity", type:"Vapor", power:130, acc:85, pp:5, cat:"special", effect:"poison", ec:100, target:"wide", rarity:"exclusive", desc:"Wide guaranteed poison." },
  heat_death:                      { name:"Heat Death", type:"Vapor", power:150, acc:85, pp:5, cat:"special", effect:"recharge_and_burnt_out_target", ec:100, target:"wide", rarity:"exclusive", desc:"Inflicts Burnt-out; needs rest." },

  // --- Mineral (exclusive, batch4) ---
  earth_shatter:                   { name:"Earth Shatter", type:"Mineral", power:130, acc:85, pp:5, cat:"physical", effect:"brittle", ec:100, target:"wide", rarity:"exclusive", desc:"Locks Brittle on all foes." },
  mineral_apocalypse:              { name:"Mineral Apocalypse", type:"Mineral", power:0, acc:100, pp:5, cat:"status", effect:"petrify", ec:100, target:"single", rarity:"exclusive", desc:"Petrifies the target." },
  starcore_burst:                  { name:"Starcore Burst", type:"Mineral", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_bleed_target", ec:30, target:"wide", rarity:"exclusive", desc:"Wide; may inflict Bleed; needs rest." },

  // --- Toxin (exclusive, batch4) ---
  tox_tainted_breath:              { name:"Tainted Breath", type:"Toxin", power:130, acc:85, pp:5, cat:"special", effect:"tainted", ec:100, target:"wide", rarity:"exclusive", desc:"Locks Tainted on all foes." },
  tox_plague_bringer:              { name:"Plague Bringer", type:"Toxin", power:0, acc:100, pp:5, cat:"status", effect:"poison_and_atkdown_target", ec:100, target:"wide", rarity:"exclusive", desc:"Poisons all foes AND lowers Atk." },
  tox_necrotic_apocalypse:         { name:"Necrotic Apocalypse", type:"Toxin", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_severe_bleed_target", ec:30, target:"wide", rarity:"exclusive", desc:"May inflict Severe Bleed; needs rest." },

  // --- Chrono (exclusive, batch4) ---
  chronoshift:                     { name:"Chronoshift", type:"Chrono", power:130, acc:85, pp:5, cat:"special", effect:"sluggish", ec:100, target:"wide", rarity:"exclusive", desc:"Locks Sluggish on all foes." },
  eternal_age:                     { name:"Eternal Age", type:"Chrono", power:0, acc:100, pp:5, cat:"status", effect:"weighed_down", ec:100, target:"single", rarity:"exclusive", desc:"Permanently weighs target down." },
  timeless_apocalypse:             { name:"Timeless Apocalypse", type:"Chrono", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_petrify_target", ec:100, target:"single", rarity:"exclusive", desc:"Guaranteed Petrify; needs rest." },

  // --- Stellar (exclusive, batch4) ---
  star_apocalypse:                 { name:"Star Apocalypse", type:"Stellar", power:130, acc:85, pp:5, cat:"special", effect:"brittle", ec:100, target:"wide", rarity:"exclusive", desc:"Locks Brittle on all foes." },
  galaxy_devourer:                 { name:"Galaxy Devourer", type:"Stellar", power:100, acc:95, pp:10, cat:"special", effect:"drain", ec:100, target:"single", rarity:"exclusive", desc:"Drains the target." },
  cosmic_eradication:              { name:"Cosmic Eradication", type:"Stellar", dualType:["Stellar","Chrono"], power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_petrify_target", ec:100, target:"wide", rarity:"exclusive", desc:"Petrifies all foes; needs rest. Dual Stellar+Chrono." },

  // --- Dream (exclusive, batch4) ---
  dream_devourer:                  { name:"Dream Devourer", type:"Dream", power:130, acc:85, pp:5, cat:"special", effect:"drain", ec:100, target:"single", rarity:"exclusive", desc:"Drains the target." },
  nightmare_bringer:               { name:"Nightmare Bringer", type:"Dream", power:0, acc:100, pp:5, cat:"status", effect:"sleep_and_atkdown_target", ec:100, target:"wide", rarity:"exclusive", desc:"Sleeps all foes AND lowers Atk." },
  apocalyptic_dream:               { name:"Apocalyptic Dream", type:"Dream", power:150, acc:80, pp:5, cat:"special", effect:"recharge_and_bleed_target", ec:100, target:"wide", rarity:"exclusive", desc:"Wide bleed; needs rest." },
};


// ============================================================
// MONSTERS DATA (107 Monsters)
// ============================================================
const MONSTERS_DATA = {
  // ===== FIRE STARTERS + FIRE LINE =====
  1: { id:1, name:"Solkin",    emoji:"🦊", types:["Fire"],
    base:{hp:35,atk:48,def:40,spa:64,spd:47,spe:91},
    learnset:[[1,"tackle",[20,"cinderwhirl"]],[1,"growl"],[2,"kindle"],[4,"ember"],[8,"quick_attack"],[11,"cinder_lance"],[13,"flame_fang"],[16,"firebrand"],[19,"swords_dance"],[27,"flamethrower"],[38,"fire_blast",[5,"scorch_veil"]]],
    evolveTo:2, evolveLevel:16, catchRate:45, expYield:62, rarity:"starter",
    desc:"A fire fox cub. Its tail flame glows brighter when its spirit is high.",
    lore:"Solkin resembles a lean fox kit covered in orange-red fur that fades to pale cream on its underbelly. Its tail tip burns with a small candle-bright flame that flickers when excited. Stands roughly 50 cm tall. It hunts at dawn using bursts of speed to chase insects across sun-warmed stone, and is known for its affectionate, curious temperament. Watch a Solkin kit at dawn and you may catch it pausing mid-chase to gaze at distant volcanic plumes — the long stare of a creature half-aware of the cooling-lava scales it will one day wear as Calderaeth." },

  2: { id:2, name:"Pyrevix",    emoji:"🦊", types:["Fire"],
    base:{hp:52,atk:59,def:62,spa:74,spd:57,spe:105},
    learnset:[[1,"tackle"],[2,"ember"],[3,"quick_attack"],[4,"flame_fang"],[5,"scorch_veil"],[6,"embercloak"],[8,"cinder_lance"],[15,"fire_spin"],[20,"flame_focus"],[24,"flamethrower"],[25,"blazing_rush"],[28,"scorch_kick"],[32,"recover"],[34,"heat_wave"],[35,"fire_blast"],[43,"inferno"]],
    evolveTo:3, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A blazing fox with a fiery mane. Rivals fear its flaming charge.",
    lore:"Pyrevix is a mid-sized fox standing 90 cm tall — Solkin's candle-bright tail-flame has spread up the body into a flowing mane of orange flame that streams behind it when running, framed by a broader chest. Its paws leave faint scorch marks on soft ground. It patrols wide territories each night, marking boundaries by igniting patches of dry grass in small controlled rings." },

  3: { id:3, name:"Calderaeth",  emoji:"🐲", types:["Fire","Draconic"],
    base:{hp:70,atk:88,def:80,spa:105,spd:79,spe:105},
    learnset:[[1,"flame_fang"],[2,"flamethrower"],[3,"heat_wave"],[4,"scorch_veil"],[10,"cinder_lance"],[15,"flash_fire"],[20,"pyre_strike"],[25,"searing_glare"],[30,"eruption"],[37,"fire_blast"],[40,"swords_dance"],[44,"dragon_breath"],[47,"inferno"],[48,"dragon_claw"],[52,"dragon_pulse"],[56,"solar_flare"],[60,"outrage"],[5,"embercloak"],[36,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"A terrifying dragon-fox hybrid. Its volcanic roar can be heard for miles.",
    lore:"Calderaeth is a massive dragon-fox over 3 metres from snout to tail — Pyrevix's flowing orange flame mane has thickened and lengthened around its neck even as its body has reshaped into dragon-form. Its body is draped in overlapping scales the colour of cooling lava — dark charcoal edged with glowing amber. Two broad draconic wings fold flat when at rest. It dwells inside dormant calderas, sleeping curled around magma pools, and its roar carries the heat of a forge blast." },

  // Aquatic Starters
  4: { id:4, name:"Aquatter",     emoji:"💧", types:["Aquatic"],
    base:{hp:45,atk:52,def:69,spa:45,spd:66,spe:46},
    learnset:[[1,"tackle",[20,"frost_current"]],[1,"tail_whip"],[4,"water_gun"],[8,"bubble_beam"],[13,"aqua_tail"],[19,"recover"],[27,"surf"],[38,"hydro_pump",[5,"tidecaller"]]],
    evolveTo:5, evolveLevel:16, catchRate:45, expYield:59, rarity:"starter",
    desc:"A water sprite that lives near ponds. Its skin is always cool and moist.",
    lore:"Aquatter is a slender otter-like creature about 60 cm long with bright teal fur and large silver-rimmed eyes. A ridged fin runs from its neck to the base of its tail for steering underwater. It inhabits clear mountain streams and wedges smooth pebbles together to form small dams as nesting sites." },

  5: { id:5, name:"Cobaleap",    emoji:"🦦", types:["Aquatic"],
    base:{hp:60,atk:66,def:79,spa:64,spd:85,spe:64},
    learnset:[[1,"water_gun"],[2,"tail_whip"],[3,"bubble_beam"],[4,"aqua_tail"],[5,"tidecaller"],[16,"recover"],[24,"surf"],[30,"harden"],[35,"hydro_pump"],[44,"tidal_crush"],[6,"deepwater_hymn"],[33,"swords_dance"]],
    evolveTo:6, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A sleek long-bodied otter-cousin with cobalt fur. Streaks through water in graceful leaping bounds, surfacing in a quick arc each stroke.",
    lore:"Cobaleap is a long-bodied mustelid roughly 2 metres from nose to tail, more elongated and slender than its base form. Its juvenile teal kit-fur has deepened to a glossy cobalt, and Aquatter's neck-to-tail steering fin has flattened and fused into its denser, sleeker body. Its short cobalt-blue fur is so dense it appears to gleam like polished glass when wet, and a pale turquoise stripe runs from the crown of its head to the tip of its powerful tail. A small ruff of stiffer guard-hairs flares behind its head when threatened — mistaken at a distance for a fin or crest. It hunts in shallow coastal waters by leaping between wave crests in long bounding arcs, and can sustain speeds that outpace most sailing vessels for hours at a time." },

  6: { id:6, name:"Banksnout",    emoji:"🦦", types:["Aquatic","Dark"],
    base:{hp:72,atk:90,def:97,spa:89,spd:105,spe:75},
    learnset:[[1,"surf"],[2,"aqua_tail"],[3,"harden"],[4,"tidecaller"],[37,"hydro_pump"],[40,"abyssal_jet"],[44,"mud_shot"],[48,"coral_barrage"],[52,"drill_run"],[56,"earth_power"],[60,"fissure_slam"],[64,"tectonic_slam"],[5,"deepwater_hymn"],[39,"ocean_tempest"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"An amphibious otter that has grown to thrive on land as much as in water. Its stretched limbs and digging claws make it as fearsome on the bank as in the current.",
    lore:"Banksnout is a powerfully built otter just over 2 metres from snout to tail-tip. Where Cobaleap spends almost all its life submerged, this final form has gradually grown into a true land-thriver: its limbs have stretched and thickened, Cobaleap's gleaming cobalt-blue coat has darkened to a glossy umber and gained a coarser overcoat that sheds water and sun alike, and its broad webbed forepaws have developed stout digging claws strong enough to carve deep tunnels straight into riverbanks. It still chases trout and crustaceans through submerged channels, but increasingly it patrols the surrounding grasslands at dusk and dawn — stalking rodents and ground-nesting birds in near-silence before ambushing them, then retreating to long burrows whose chambers open well above the waterline. Long mud slides worn into embankments mark its preferred travel routes between water and land." },

  // Grass Starters
  7: { id:7, name:"Verdkin",  emoji:"🌱", types:["Nature"],
    base:{hp:49,atk:42,def:55,spa:61,spd:70,spe:47},
    learnset:[[1,"tackle",[20,"root_lance"]],[1,"growl"],[4,"vine_whip"],[8,"razor_leaf"],[13,"seed_bomb"],[19,"swords_dance"],[27,"energy_ball"],[38,"petal_blitz",[5,"sleep_powder"]]],
    evolveTo:8, evolveLevel:16, catchRate:45, expYield:64, rarity:"starter",
    desc:"A little plant seedling that walks on root-legs. Very curious and brave.",
    lore:"Verdkin is a small round herbivore about 35 cm tall with smooth lime-green skin, stubby leg-roots and a small reptilian tail beneath its leafy lower body, and two leaf-shaped ears that absorb sunlight. A single bud sprouts from the crown of its head. It grazes in meadows during morning light and huddles with others in dense thickets at night, pressing leaves together to share warmth." },

  8: { id:8, name:"Barknell",   emoji:"🦕", types:["Nature"],
    base:{hp:57,atk:68,def:63,spa:75,spd:74,spe:70},
    learnset:[[1,"vine_whip"],[2,"razor_leaf"],[3,"seed_bomb"],[4,"tackle"],[5,"sleep_powder"],[16,"swords_dance"],[24,"energy_ball"],[30,"canopy_crash"],[35,"petal_blitz"],[44,"verdant_surge"],[6,"spore_burst"],[33,"recover"]],
    evolveTo:9, evolveLevel:36, catchRate:25, expYield:142, rarity:"uncommon",
    desc:"A thorny dinosaur with bark-like skin. Each spine is razor sharp.",
    lore:"Barknell is a stout quadrupedal reptile roughly the size of a large dog — Verdkin's stubby leg-roots have lengthened into true legs and its leaf-shaped ears have multiplied into rows of leaf-shaped protrusions along its spine. Its hide is textured like bark and varies from grey-green to deep brown, blending with forest undergrowth. It sleeps pressed against tree trunks, becoming nearly invisible to passing predators." },

  9: { id:9, name:"Garlawarden",   emoji:"🌸", types:["Nature","Fairy"],
    base:{hp:82,atk:75,def:80,spa:101,spd:110,spe:84},
    learnset:[[1,"seed_bomb"],[2,"energy_ball"],[3,"vine_whip"],[4,"sleep_powder"],[40,"verdant_surge"],[41,"tail_whip"],[44,"fairy_wind"],[47,"petal_blitz"],[48,"scratch"],[52,"dazzling_gleam"],[56,"root_lance"],[60,"moonblast"],[5,"spore_burst"],[36,"celestial_wave"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:265, rarity:"rare",
    desc:"A bark-armored reptile guardian. Year-round blossoms bloom along its spine, drawing pollinators wherever it roams.",
    lore:"Garlawarden is a powerfully built quadrupedal reptile about 2 metres at the shoulder — the fully grown form of the Barknell lineage. Its hide of tightly fused bark plates is overgrown with living petals and small white-and-pink blossoms that bloom year-round regardless of season. A garland of larger flowers crowns its broad skull, and pollen drifts from its flanks as it walks. It moves slowly through old-growth forest, grazing on understory ferns and emitting a faint floral musk that calms nearby wildlife and draws pollinators to congregate in its wake." },

  // ===== ADDITIONAL FIRE =====
  10: { id:10, name:"Scorchlarva",  emoji:"🐛", types:["Fire","Nature"],
    base:{hp:54,atk:68,def:37,spa:43,spd:43,spe:48},
    learnset:[[1,"tackle",[20,"cinderwhirl"]],[1,"ember"],[8,"bug_bite"],[15,"flame_fang"],[17,"swords_dance"],[22,"x_scissor",[5,"scorch_veil"]],[29,"venom_drool"],[39,"stinger_volley"]],
    evolveTo:11, evolveLevel:18, catchRate:255, expYield:56, rarity:"common",
    desc:"A fire beetle larva. Leaves scorch marks wherever it walks.",
    lore:"Scorchlarva is a chubby flame-patterned caterpillar about 20 cm long. Its body segments alternate vivid orange and smoky black, with two antennae that glow orange at the tips. It feeds on dried bark near volcanic soil, and its silk threads are heat-resistant enough to be woven into flame-proof cloth." },

  11: { id:11, name:"Heliocoon",  emoji:"🥚", types:["Fire","Wind"],
    base:{hp:80,atk:40,def:130,spa:60,spd:110,spe:56},
    learnset:[[1,"harden"],[1,"ember"],[4,"bug_bite"],[5,"embercloak"],[6,"kindle"],[8,"chitin_guard"],[10,"cocoon_guard"],[14,"scorch_veil"],[18,"sun_burst"],[20,"recover"],[22,"metamorphosis"],[26,"harden"],[32,"embercloak"],[36,"heat_wave"],[39,"inferno"]],
    evolveTo:12, evolveLevel:40, catchRate:75, expYield:158, rarity:"uncommon",
    desc:"A motionless flame-veined chrysalis hanging from charred branches. Sealed within, a future winged form slowly takes shape.",
    lore:"Heliocoon is a 30-centimetre teardrop-shaped chrysalis spun from Scorchlarva's heat-resistant silk and anchored by a single dark thread to the underside of a charred branch. Its outer casing is layered tan and charcoal-grey, threaded with thin orange veins that pulse faintly with internal warmth as the larva continues to develop inside. It does not feed and rarely shifts — only the casing's surface trembles when the body within turns. Heat radiates from the shell strongly enough to discourage most predators, and it can hang motionless for weeks on end while it waits to emerge into its winged final form." },

  13: { id:13, name:"Taurcin",    emoji:"🐂", types:["Fire"],
    base:{hp:67,atk:69,def:56,spa:52,spd:37,spe:43},
    learnset:[[1,"tackle",[22,"magma_surge"]],[1,"ember"],[12,"headbutt"],[19,"swords_dance"],[20,"flamethrower"],[30,"body_slam"],[35,"heat_wave"],[40,"fire_blast",[5,"scorch_veil"]],[3,"embercloak"],[31,"tail_whip"]],
    evolveTo:14, evolveLevel:22, catchRate:120, expYield:112, rarity:"common",
    desc:"A powerful bull with lava dripping from its hooves. Incredibly stubborn.",
    lore:"Taurcin is a bulky bull-like creature standing 1.5 metres at the shoulder. Its rust-red hide is thick as leather armour, and two forward-curving horns glow orange at the tips from retained heat. It stamps and snorts before charging, and the impact of its body can crack stone walls. Veteran Taurcin will stamp their hooves into bare soil until faint magma-glow rises through the cracks; the instinct comes from further down the bloodline, where Pyroclasm walks across pools of cooling lava without harm." },

  14: { id:14, name:"Molteroth",    emoji:"🐃", types:["Fire","Earth"],
    base:{hp:94,atk:111,def:97,spa:78,spd:64,spe:63},
    learnset:[[1,"headbutt"],[2,"magma_surge"],[3,"ember"],[4,"flamethrower"],[5,"scorch_veil"],[6,"embercloak"],[10,"fire_spin"],[14,"molten_claw"],[18,"inferno_chop"],[22,"infernal_roar"],[26,"inferno_charge"],[30,"battle_cry"],[32,"heat_wave"],[34,"eruption"],[37,"fire_blast"],[38,"stalactite_drop"],[42,"quarry_crush"],[46,"rock_slide"],[54,"stone_edge"],[62,"inferno"]],
    evolveTo:15, evolveLevel:42, catchRate:45, expYield:235, rarity:"uncommon",
    desc:"A volcanic beast covered in hardened magma. Nothing can stop its charge.",
    lore:"Molteroth is a massive volcanic bull over 2 metres tall — Taurcin's rust-red hide has cooled and crusted into plates of hardened lava-rock that grind and shift as it moves, and its forward-curving horns now glow with steady amber heat rather than only at the tips. Jets of steam escape from vents along its spine. It inhabits lava fields, grazing on mineral deposits by grinding rock with its flat stone-hard teeth." },

  16: { id:16, name:"Cindercula",   emoji:"🐍", types:["Fire"],
    base:{hp:41,atk:53,def:46,spa:59,spd:45,spe:47},
    learnset:[[1,"tackle",[20,"cinderwhirl"]],[1,"ember"],[9,"quick_attack"],[14,"leer"],[17,"flamethrower",[5,"scorch_veil"]],[24,"vital_pulse"],[32,"ashfall"],[40,"fire_blast"],[3,"embercloak"],[31,"tail_whip"]],
    evolveTo:17, evolveLevel:20, catchRate:200, expYield:65, rarity:"common",
    desc:"A small worm that breathes tiny flames. Very shy and avoids conflict.",
    lore:"Cindercula is a sinuous fire-serpent about 1.8 metres long with iridescent scales shading from copper at the head to charcoal at the tail. A thin crest of flame-coloured feathers runs from its neck to mid-body. It slithers through ash fields and hunts by sensing heat signatures with specialised pit organs. Despite having no limbs at all, Cindercula sometimes rear upright along thermal columns and flare their feathered crests outward — a rehearsal of the great wings Searburn unfurls at metamorphosis and Bahamber spreads at maturity." },

  17: { id:17, name:"Searburn",   emoji:"🐉", types:["Draconic","Earth"],
    base:{hp:78,atk:97,def:61,spa:101,spd:75,spe:92},
    learnset:[[1,"ember"],[2,"flamethrower"],[3,"cinderwhirl"],[4,"scorch_veil"],[21,"vital_pulse"],[26,"char_dance"],[32,"dragon_breath"],[38,"dragon_claw"],[44,"heat_wave"],[50,"inferno"],[56,"outrage"],[62,"solar_flare"],[5,"embercloak"],[41,"dragon_rush"]],
    evolveTo:18, evolveLevel:42, catchRate:45, expYield:198, rarity:"uncommon",
    desc:"A serpentine crag dragon. Coils around prey before unleashing flame.",
    lore:"Searburn is a powerful earth-dragon 4 metres long — Cindercula's serpentine length has thickened and reared upward, its copper-to-charcoal scales darkened to scarlet-and-black and the flame-coloured feathered crest hardened into a pair of backward-swept horns framing its angular head. Its broad wings generate intense heat when flapping, scorching the air in wide arcs. It roosts in mountain crags above the treeline and uses updrafts to glide effortlessly for hours; years among the granite spires harden its scales toward the colour and density of the cliffs it claims as territory." },

  // ===== ADDITIONAL WATER =====
  25: { id:25, name:"Reefling",  emoji:"🦀", types:["Aquatic"],
    base:{hp:59,atk:66,def:78,spa:43,spd:63,spe:34},
    learnset:[[1,"scratch",[22,"coral_barrage"]],[1,"water_gun"],[10,"bubble_beam"],[18,"harden"],[20,"vital_pulse"],[26,"aqua_tail"],[34,"surf",[5,"tidecaller"]],[36,"hydro_pump"],[3,"deepwater_hymn"],[31,"leer"]],
    evolveTo:26, evolveLevel:20, catchRate:190, expYield:71, rarity:"common",
    desc:"A crab that blows iridescent bubbles. Very territorial near shorelines.",
    lore:"Reefling is a small crab-like creature only 15 cm across. Its shell is pale blue-green studded with tiny polyps that filter nutrients from the water. It scuttles across coral formations in shallow warm seas, using its patterned shell for camouflage, and hides inside anemones when threatened." },

  26: { id:26, name:"Aquidon",    emoji:"🦞", types:["Aquatic","Earth"],
    base:{hp:75,atk:102,def:110,spa:59,spd:68,spe:81},
    learnset:[[1,"scratch"],[2,"water_gun"],[3,"tidecaller"],[23,"aqua_tail"],[27,"swords_dance"],[31,"surf"],[33,"hydro_pump"],[34,"stalactite_drop"],[41,"rock_slide"],[48,"crystal_lance"],[55,"tidal_crush"],[62,"stone_edge"],[4,"deepwater_hymn"],[42,"quarry_crush"]],
    evolveTo:27, evolveLevel:44, catchRate:60, expYield:188, rarity:"uncommon",
    desc:"A massive sea claw with rock-hard shell. Few can match its raw strength.",
    lore:"Aquidon is a broad-bodied rock lobster about 50 cm long — Reefling's pale blue-green coral-polyp shell has hardened and stilled into a stone-grey carapace reinforced by calcified mineral deposits, and its tiny defensive pincers have grown into crushing claws that can crack thick coral. It dwells in rocky sea caves along the coastline, guarding its territory fiercely against any intruder." },

  42: { id:42, name:"Cryonik",    emoji:"🦭", types:["Ice","Aquatic"],
    base:{hp:54,atk:56,def:64,spa:73,spd:75,spe:31},
    learnset:[[1,"tackle",[22,"frost_current"]],[1,"powder_snow"],[10,"water_gun"],[18,"ice_beam"],[20,"leer"],[26,"aqua_tail"],[34,"blizzard",[5,"permafrost"]],[36,"cryo_lance"],[3,"winter_shroud"],[31,"surf"]],
    evolveTo:43, evolveLevel:28, catchRate:120, expYield:91, rarity:"common",
    desc:"An adorable ice seal. Its smooth skin can withstand arctic temperatures.",
    lore:"Cryonik is a plump seal-like creature about 80 cm long with pale powder-blue fur tipped in white. Its wide eyes are deep amber. A thin layer of ice perpetually coats its outer fur, crackling softly as it moves. It naps on floating ice floes and slides effortlessly into freezing water to catch fish." },

  43: { id:43, name:"Boreon",  emoji:"🦭", types:["Ice","Aquatic"],
    base:{hp:82,atk:60,def:80,spa:103,spd:97,spe:81},
    learnset:[[1,"powder_snow"],[2,"water_gun"],[3,"ice_beam"],[4,"permafrost"],[31,"blizzard"],[33,"harden"],[38,"abyssal_jet"],[43,"hoarfrost_bite"],[48,"icicle_crash"],[53,"surf"],[58,"glacial_tomb"],[63,"hydro_pump"],[5,"winter_shroud"],[41,"aqua_tail"]],
    evolveTo:44, evolveLevel:44, catchRate:40, expYield:217, rarity:"uncommon",
    desc:"A regal glacial seal. It can freeze oceans with a single breath.",
    lore:"Boreon is a larger muscular seal — Cryonik's powder-blue fur has deepened to slate-blue and its perpetually crackling ice-coat has thickened into a frosted white neck-mane. Bands of ice spontaneously form around its flippers when it rears up. Its bark echoes across frozen bays, audible several kilometres away. It is highly territorial during breeding season on ice shelves." },

  28: { id:28, name:"Corelin",   emoji:"🐠", types:["Aquatic"],
    base:{hp:49,atk:34,def:58,spa:59,spd:52,spe:62},
    learnset:[[1,"tackle",[22,"coral_barrage"]],[1,"water_gun"],[9,"bubble_beam"],[16,"tail_whip"],[17,"sweet_kiss"],[25,"surf",[5,"tidecaller"]],[29,"vital_pulse"],[39,"aqua_tail"],[3,"deepwater_hymn"],[32,"leer"]],
    evolveTo:29, evolveLevel:25, catchRate:220, expYield:72, rarity:"common",
    desc:"A dazzling coral fish with rainbow fins. Lures prey with its bright colors.",
    lore:"Corelin is a delicate tropical fish 25 cm long, striped vivid orange and white with translucent fins edged in blue. It lives inside branching coral formations and carries a weak electric charge in its scales that deters predators. Its scales refract light into small rainbows in shallow water." },

  29: { id:29, name:"Neraxis",    emoji:"🐡", types:["Aquatic"],
    base:{hp:76,atk:69,def:64,spa:114,spd:99,spe:74},
    learnset:[[1,"water_gun"],[2,"bubble_beam"],[3,"surf"],[4,"tidecaller"],[30,"growl"],[35,"harden"],[40,"quick_attack"],[45,"dazzling_gleam"],[50,"whirlpool_dive"],[55,"sea_serpent_strike"],[60,"moonblast"],[65,"hydro_pump"],[5,"deepwater_hymn"],[42,"recover"]],
    evolveTo:30, evolveLevel:42, catchRate:70, expYield:184, rarity:"uncommon",
    desc:"A majestic reef king with jewel-like scales. Commands schools of fish.",
    lore:"Neraxis is a rotund puffer fish about 30 cm in diameter when deflated — Corelin's vivid orange-and-white reef stripes have muted to sandy yellow with dark brown spots as it migrated from coral to lagoon, but its scales still refract faint rainbows in shallow sunlight. When startled it inflates to three times its size, erecting short sharp quills. It dwells in sandy lagoons and buries itself to ambush worms and molluscs." },

  // ===== ADDITIONAL GRASS =====
  63: { id:63, name:"Sporix",    emoji:"🍄", types:["Nature"],
    base:{hp:60,atk:58,def:57,spa:66,spd:70,spe:38},
    learnset:[[1,"tackle"],[1,"vine_whip"],[8,"poison_sting"],[16,"energy_ball"],[20,"leer"],[22,"spore_burst"],[24,"sludge_bomb"],[32,"sleep_powder",[5,"thornwall"]],[36,"seed_bomb"],[3,"mycelia_net"],[31,"leaf_blade"]],
    evolveTo:64, evolveLevel:25, catchRate:135, expYield:98, rarity:"common",
    desc:"A mushroom Lumori that releases paralyzing spores when threatened.",
    lore:"Sporix is a small mushroom-topped creature about 20 cm tall with a soft, spongy white body and a broad purple-spotted cap. It releases clouds of glittering green spores when disturbed. It grows in dense clusters in dark, damp forest floors and uses spore clouds to communicate danger between neighbouring clusters." },

  64: { id:64, name:"Myceloth",   emoji:"🍄", types:["Nature"],
    base:{hp:77,atk:87,def:85,spa:93,spd:73,spe:69},
    learnset:[[1,"energy_ball"],[2,"sludge_bomb"],[29,"sleep_powder"],[30,"tail_whip"],[33,"seed_bomb"],[35,"toxic"],[40,"scratch"],[45,"razor_leaf"],[50,"venoshock"],[55,"corrosion_fang"],[60,"petal_blitz"],[65,"verdant_surge"],[3,"spore_burst"],[42,"canopy_crash"]],
    evolveTo:65, evolveLevel:42, catchRate:45, expYield:317, rarity:"uncommon",
    desc:"A spore king that commands an army of fungal creatures. Reeks of poison.",
    lore:"Myceloth is a taller, humanoid-shaped fungal creature 80 cm tall — Sporix's purple-spotted cap has lifted onto a humanoid stalk and its spongy juvenile body has reorganised into interwoven mycelium threads visible through a translucent outer membrane. A wide flat cap sits on its rounded head. It walks slowly through forest undergrowth, trailing filaments that connect to the underground fungal network of the forest." },

  66: { id:66, name:"Viridix",    emoji:"🐌", types:["Nature"],
    base:{hp:39,atk:60,def:39,spa:52,spd:40,spe:86},
    learnset:[[1,"vine_whip",[20,"photon_leaf"]],[1,"leer"],[8,"razor_leaf"],[16,"seed_bomb"],[17,"recover"],[24,"energy_ball",[5,"sleep_powder"]],[29,"scratch"],[39,"canopy_crash"],[3,"spore_burst"],[32,"swords_dance"]],
    evolveTo:67, evolveLevel:22, catchRate:180, expYield:78, rarity:"common",
    desc:"A bright green leaf-snail whose curled shell mimics a young rolled fern. Glides slowly across forest floors leaving a faintly luminescent slime trail.",
    lore:"Viridix is a small terrestrial mollusk about 30 centimetres long including its curled spiral shell, which is lime-green and patterned like a rolled fern frond — perfect camouflage among forest undergrowth. Two long sensory tentacles rise from its head, tipped with tiny golden dots that twist toward sunlight, and its soft body is bright green with darker scale-like ripples along its mantle. It glides slowly across the forest floor on a single muscular foot, feeding on tender leaf shoots and fungi, and leaves behind a faintly luminescent slime trail that lingers for hours after sundown." },

  67: { id:67, name:"Loamvin", emoji:"🐌", types:["Nature","Earth"],
    base:{hp:83,atk:93,def:80,spa:80,spd:75,spe:76},
    learnset:[[1,"razor_leaf"],[2,"seed_bomb"],[3,"sleep_powder"],[22,"energy_ball"],[27,"growl"],[32,"tackle"],[37,"sandstrike"],[42,"sand_geyser"],[47,"root_lance"],[52,"earth_power"],[57,"earthquake"],[62,"petal_blitz"],[4,"spore_burst"],[40,"scorched_earth"]],
    evolveTo:68, evolveLevel:42, catchRate:55, expYield:195, rarity:"uncommon",
    desc:"A 1-metre forest snail whose massive curled shell is encrusted with bark, moss, and trailing vines. Walks slow circuits between damp glades over years.",
    lore:"Loamvin is a substantial forest snail roughly 1 metre across at the shell's widest curl, with a body 1.2 metres long when fully extended — Viridix's small lime-green leaf-patterned shell has grown massive and so heavily overgrown with bark plates, mossy patches, and trailing vines that the underlying calcified spiral is barely visible — small ferns even sprout from cracks where the shell meets the body. Two thick sensory eyestalks rise above its head, each ending in a glowing amber-green eye, and its broad muscular foot leaves a wide damp trail through the leaf-litter as it moves. It walks slow circuits between damp forest glades over years, and the small ecosystems carried on its shell shed seeds and spores wherever it goes." },

  69: { id:69, name:"Germix",     emoji:"🫘", types:["Nature"],
    base:{hp:38,atk:41,def:49,spa:62,spd:55,spe:52},
    learnset:[[1,"tackle",[22,"spore_burst"]],[1,"vine_whip"],[10,"energy_ball"],[16,"leer"],[18,"sleep_powder"],[26,"seed_bomb",[5,"thornwall"]],[29,"scratch"],[39,"canopy_crash"]],
    evolveTo:70, evolveLevel:18, catchRate:255, expYield:58, rarity:"common",
    desc:"A living seed pod that rolls around. Harmless but quick to flee.",
    lore:"Germix is a round, seed-shaped creature about 15 cm tall. Its smooth green body has two tiny sprout-legs and a small face framed by curling leaf tendrils. It buries itself in rich soil during the day to photosynthesize through root-hairs. When threatened it releases a burst of accelerated growth, sprouting a tangle of vines around attackers." },

  70: { id:70, name:"Verdurus",    emoji:"🌱", types:["Nature"],
    base:{hp:90,atk:102,def:71,spa:95,spd:73,spe:61},
    learnset:[[1,"tackle"],[2,"vine_whip"],[3,"leer"],[4,"energy_ball"],[5,"sleep_powder"],[23,"seed_bomb"],[27,"swords_dance"],[36,"canopy_crash"],[37,"quick_attack"],[45,"briar_lash"],[54,"body_slam"],[63,"petal_blitz"],[6,"spore_burst"],[43,"tail_whip"]],
    evolveTo:71, evolveLevel:40, catchRate:75, expYield:186, rarity:"uncommon",
    desc:"A mid-sized walking seed-pod 1.5 metres tall whose green husk has split open to reveal long curling leaf-tendrils and a soft moss-covered core. Drops fresh seeds in its wake.",
    lore:"Verdurus is a 1.5-metre walking seed-pod, the matured form of Germix whose smooth green husk has gradually split open along ridge-lines to reveal a soft moss-covered core inside. Long curling leaf-tendrils unfurl from the open seams, swaying gently as it walks on its short root-legs. Small yellow flowers bloom in clusters across its outer surface in spring, and ripe pollen drifts from them onto the wind. Wherever Verdurus walks for any length of time, it drops fresh seeds from internal pods, and patches of new growth follow its trail." },

  // ===== ELECTRIC =====
  81: { id:81, name:"Joltan",    emoji:"🐎", types:["Electric"],
    base:{hp:43,atk:47,def:36,spa:51,spd:39,spe:100},
    learnset:[[1,"scratch",[20,"volt_surge"]],[1,"thunder_shock"],[8,"quick_attack"],[16,"spark"],[22,"thunderbolt"],[29,"recover"],[30,"thunder_wave"],[38,"thunder",[5,"static_cage"]],[3,"charge_burst"],[32,"leer"]],
    evolveTo:82, evolveLevel:20, catchRate:190, expYield:82, rarity:"common",
    desc:"A miniature electric pony-foal that bounds across grasslands faster than the eye can track. Tiny blue sparks drift from its short mane.",
    lore:"Joltan is a miniature electric pony-foal about 50 centimetres at the shoulder with a bright yellow short-haired coat and a dark mane that stands constantly on end from accumulated static charge. Tiny blue sparks drift from the tips of its mane and tail as it moves, and it discharges small jolts into anything that touches it unexpectedly. It cannot stand still — it races constantly across grasslands, building up kinetic and electrical energy together." },

  82: { id:82, name:"Galvanos",    emoji:"🐴", types:["Electric"],
    base:{hp:59,atk:88,def:58,spa:89,spd:60,spe:141},
    learnset:[[1,"thunder_shock"],[2,"quick_attack"],[3,"spark"],[20,"thunderbolt"],[27,"thunder_wave"],[28,"growl"],[34,"harden"],[35,"thunder"],[41,"wild_tumble"],[48,"arc_flash"],[55,"plasma_strike"],[62,"body_slam"],[4,"static_cage"],[42,"leer"]],
    evolveTo:83, evolveLevel:44, catchRate:60, expYield:200, rarity:"uncommon",
    desc:"An electric horse that gallops faster than lightning. Its mane crackles.",
    lore:"Galvanos is a horse-like creature 1.2 metres at the shoulder — Joltan's yellow pony-foal coat has grown into a sleek golden-yellow hide crisscrossed by electric-blue markings. Its flowing mane crackles with constant static. It can sustain a gallop at extraordinary speed for hours by converting its own electrical energy into kinetic force." },

  84: { id:84, name:"Electrix",      emoji:"🐛", types:["Electric","Aquatic"],
    base:{hp:34,atk:48,def:43,spa:50,spd:43,spe:94},
    learnset:[[1,"bug_bite",[22,"arc_flash"]],[1,"thunder_shock"],[10,"spark"],[18,"string_shot"],[20,"recover"],[26,"thunderbolt"],[34,"bug_buzz",[5,"thunder_wave"]],[36,"x_scissor"],[3,"static_cage"],[31,"cocoon_burst"]],
    evolveTo:85, evolveLevel:22, catchRate:200, expYield:74, rarity:"common",
    desc:"An electric beetle that emits charged buzzing sounds. Very energetic.",
    lore:"Electrix is a small dragonfly nymph 8 cm long, the aquatic juvenile stage of the lineage. Its body is segmented and dark with metallic gold-edged plates, and small gilled abdomen-tufts trail behind it as it crawls along stream beds. It already generates faint electrical sparks from its rudimentary wing-buds when threatened. It hunts smaller aquatic insects with its hooked predatory mandibles, and lives in colonies in slow-moving water near decaying wood, where it processes organic material into bioelectric energy." },

  85: { id:85, name:"Shockharpe",  emoji:"🪰", types:["Electric","Nature"],
    base:{hp:81,atk:68,def:53,spa:107,spd:67,spe:101},
    learnset:[[1,"thunder_shock"],[2,"bug_bite"],[3,"thunder_wave"],[23,"thunderbolt"],[29,"tail_whip"],[31,"bug_buzz"],[33,"x_scissor"],[36,"scratch"],[43,"silk_bind"],[50,"swarm_dive"],[57,"volt_surge"],[64,"thunder"],[4,"static_cage"],[42,"mandible_crush"]],
    evolveTo:86, evolveLevel:42, catchRate:75, expYield:180, rarity:"uncommon",
    desc:"A dragonfly of electricity. Moves so fast it leaves lightning trails behind.",
    lore:"Shockharpe is a 15 cm late-instar dragonfly, the metamorphic mid-stage of the Electrix lineage. Its body has elongated and slimmed from its aquatic-nymph form, and its rudimentary wing-buds have unfolded into newly emerged wings that are still soft and translucent, humming at a frequency that causes mild disorientation in nearby creatures. Its hooked predatory mandibles and accumulating electrical charge are inherited from the nymph. It drains bioelectric energy from prey rather than blood, leaving targets drained and sluggish." },

  87: { id:87, name:"Amperix",     emoji:"🐟", types:["Electric","Aquatic"],
    base:{hp:48,atk:59,def:51,spa:74,spd:57,spe:63},
    learnset:[[1,"water_gun",[22,"arc_flash"]],[1,"thunder_shock"],[12,"spark"],[19,"recover"],[20,"bubble_beam"],[28,"thunderbolt"],[35,"voltaic_fang"],[36,"surf",[5,"thunder_wave"]],[3,"static_cage"],[31,"ion_cannon"]],
    evolveTo:88, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"An electric fish that shocks prey in shallow water. Glows when excited.",
    lore:"Amperix is a tropical fish 30 cm long with a vibrant yellow body striped in electric blue. Its dorsal fin doubles as an array of biological capacitor cells. It schools in large groups in warm coastal waters, and when a predator approaches the school emits a coordinated electrical pulse that stuns attackers. After a school's coordinated electrical pulse fires, a handful of Amperix tend to drift in place rather than rejoin the formation, dorsal capacitors humming with unused charge: the first stirrings of the solitary thermal-vent hunter Surgolith eventually becomes." },

  88: { id:88, name:"Sparkrel",    emoji:"🐟", types:["Electric","Aquatic"],
    base:{hp:78,atk:61,def:64,spa:113,spd:85,spe:100},
    learnset:[[1,"thunder_shock"],[2,"water_gun"],[3,"thunderbolt"],[4,"bubble_beam"],[5,"thunder_wave"],[32,"voltaic_fang"],[33,"surf"],[35,"tail_whip"],[42,"scratch"],[49,"thunder"],[56,"hydro_pump"],[63,"overcharge"],[6,"static_cage"],[43,"aqua_tail"]],
    evolveTo:89, evolveLevel:42, catchRate:50, expYield:205, rarity:"uncommon",
    desc:"A 60-centimetre developing electric eel, slim and silver-blue, that crackles when startled. Patterns of static glow along its sides as it swims.",
    lore:"Sparkrel is a developing electric eel about 60 centimetres long — Amperix's tropical schooling body has slimmed and elongated to silver-blue with a pale yellow underbelly streaked by electric markings that pulse along its length when it accelerates. Its skin produces small sparks when disturbed, and as it grows the capacitor cells of its earlier school-fish stage have consolidated into specialised organs running the full length of its body. It floats near the surface of warm bays alongside drifting kelp, discharging static bursts to stun small prey before swallowing them whole." },

  90: { id:90, name:"Zephyrel",  emoji:"🐦", types:["Electric","Wind"],
    base:{hp:50,atk:44,def:39,spa:52,spd:55,spe:93},
    learnset:[[1,"gust",[20,"volt_surge"]],[1,"thunder_shock"],[10,"wing_attack"],[14,"growl"],[18,"thunderbolt"],[24,"tackle"],[26,"air_slash"],[33,"spark"],[34,"thunder",[5,"thunder_wave"]],[42,"cyclone_blade"],[3,"static_cage"],[32,"storm_surge"]],
    evolveTo:91, evolveLevel:28, catchRate:160, expYield:78, rarity:"common",
    desc:"A little bird of storms. Rides thunderclouds and harnesses lightning.",
    lore:"Zephyrel is a compact, sparrow-sized electric-wind bird with bright yellow feathers edged in white. Its wingtips arc with blue electricity when it dives at high speed. It rides storm fronts across open plains, using the updrafts generated by thunderstorm anvil clouds to reach extraordinary altitudes." },

  // ===== GROUND =====
  95: { id:95, name:"Dustkin",     emoji:"🦏", types:["Earth"],
    base:{hp:61,atk:71,def:58,spa:40,spd:40,spe:68},
    learnset:[[1,"scratch",[22,"sandstrike"]],[1,"growl"],[8,"mud_shot"],[16,"headbutt"],[24,"earthquake"],[29,"tail_whip"],[32,"earth_power"],[40,"body_slam",[5,"dust_veil"]],[3,"clay_armor"],[31,"leer"]],
    evolveTo:96, evolveLevel:25, catchRate:160, expYield:88, rarity:"common",
    desc:"A dusty rhino calf the size of a small dog. Stomps about arid plains, sometimes shedding tiny static crackles from its budding horn.",
    lore:"Dustkin is a stout rhino calf about 50 centimetres at the shoulder, the early form of a lineage of seismic earth-shakers. Its grey-brown hide is already beginning to thicken into proto-armour plates across its shoulders and broad chest, and a small ridged horn-bud crowns its snout — sometimes shedding tiny crackles of static when the calf scuffs the dry earth in play. It inhabits arid plains and digs shallow burrows to escape midday heat, drinking from rain pools that gather in the depressions left by its passing herd. Dustkin calves visibly flinch at faint thunder from distant storms; an unconscious recognition of the conductive iron-veined Tectonvast hide they will grow into, when storms follow rather than precede them across the plains." },

  96: { id:96, name:"Seismith",  emoji:"🦏", types:["Earth","Electric"],
    base:{hp:104,atk:114,def:97,spa:53,spd:64,spe:70},
    learnset:[[1,"mud_shot"],[2,"headbutt"],[3,"earthquake"],[4,"dust_veil"],[29,"earth_power"],[31,"harden"],[37,"body_slam"],[38,"spark"],[43,"rock_slide"],[49,"crystal_lance"],[55,"fissure_slam"],[61,"wild_charge"],[5,"clay_armor"],[41,"magma_rock"]],
    evolveTo:97, evolveLevel:44, catchRate:50, expYield:218, rarity:"uncommon",
    desc:"A mid-sized rhino with conductive earthen plates fused to its hide. Each footfall sends crackling static through the surrounding ground.",
    lore:"Seismith is a medium-sized rhino around 1 metre at the shoulder, broad-chested and powerful — Dustkin's proto-armour plates have hardened into mineral-rich earth flecked with iron and copper veins, now spanning its shoulders, haunches, and along the ridges of its skull, channelling subterranean electrical currents up through its body. Its single thickening horn glows faintly amber when it lowers its head to listen for water or prey, and small arcs of static dance between its hooves and the ground with each measured step. It detects underground deposits and tremors by sensing the shifting electrical field they produce, and packs of Seismith are sometimes followed by storms drawn to the conductive metal in their hides." },

  98: { id:98, name:"Aridix",   emoji:"🦂", types:["Earth","Poison"],
    base:{hp:53,atk:56,def:60,spa:57,spd:47,spe:76},
    learnset:[[1,"scratch",[22,"terra_spike"]],[1,"poison_sting"],[10,"mud_shot"],[18,"venoshock"],[26,"earthquake"],[30,"fissure_slam"],[34,"sludge_bomb"],[42,"toxic",[5,"dust_veil"]],[3,"clay_armor"],[32,"earth_power"]],
    evolveTo:99, evolveLevel:30, catchRate:100, expYield:95, rarity:"common",
    desc:"A desert scorpion with a venomous stinger. Buries itself in sand to ambush.",
    lore:"Aridix is a scorpion about 30 cm long with pale sandstone-coloured exoskeleton and a slender venomous stinger tail. Its pincers are wide and flat for digging. It inhabits deep desert dunes, burrowing down by day and emerging at night to hunt insects attracted by its faint phosphorescent glow." },

  99: { id:99, name:"Toxivenoth",  emoji:"🦂", types:["Earth","Poison"],
    base:{hp:64,atk:90,def:71,spa:77,spd:85,spe:88},
    learnset:[[1,"poison_sting"],[2,"fissure_slam"],[3,"mud_shot"],[4,"earthquake"],[5,"venoshock"],[6,"dust_veil"],[31,"sludge_bomb"],[38,"vital_pulse"],[39,"toxic"],[46,"miasma_cloud"],[54,"earth_power"],[62,"plague_burst"],[7,"clay_armor"],[42,"venom_lance"]],
    evolveTo:100, evolveLevel:42, catchRate:35, expYield:321, rarity:"uncommon",
    desc:"A great venom scorpion. Its tail sting causes hallucinations in victims.",
    lore:"Toxivenoth is a large scorpion 70 cm long — Aridix's pale sandstone-coloured exoskeleton has darkened to dark teal-green mottled with warning-yellow patches. Its stinger delivers a complex venom that causes progressive numbness. It inhabits poison-laced desert ravines and is territorial, using its stinger to mark the boundaries of its hunting range in the ground." },

  101: { id:101, name:"Limoux",     emoji:"🐊", types:["Earth","Aquatic"],
    base:{hp:69,atk:60,def:59,spa:48,spd:52,spe:42},
    learnset:[[1,"scratch",[22,"sandstrike"]],[1,"mud_shot"],[10,"water_gun"],[18,"bubble_beam"],[20,"tail_whip"],[26,"earthquake"],[34,"surf",[5,"dust_veil"]],[36,"whirlpool_dive"],[3,"clay_armor"],[31,"sea_serpent_strike"]],
    evolveTo:102, evolveLevel:22, catchRate:140, expYield:88, rarity:"common",
    desc:"A mud-crawling amphibian. Slides through swamps with ease.",
    lore:"Limoux is a compact crocodile-like creature 80 cm long with muddy olive-green hide and a wide flat head. Its underbelly is pale cream. It half-buries itself in shallow murky water with only its nostrils and eyes visible above the surface, waiting motionless for hours until prey ventures within snapping range." },

  102: { id:102, name:"Dunoloth",   emoji:"🐊", types:["Earth","Aquatic"],
    base:{hp:93,atk:97,def:77,spa:91,spd:78,spe:66},
    learnset:[[1,"mud_shot"],[2,"water_gun"],[3,"dust_veil"],[23,"earthquake"],[28,"battle_cry"],[31,"surf"],[34,"frost_current"],[40,"boulder_roll"],[46,"body_slam"],[52,"earth_power"],[58,"tidal_crush"],[64,"hydro_pump"],[4,"clay_armor"],[42,"aqua_tail"]],
    evolveTo:103, evolveLevel:44, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A massive silt beast that haunts murky river deltas. Ancient and powerful.",
    lore:"Dunoloth is a large armoured crocodilian 2 metres long — Limoux's muddy olive-green hide has darkened and thickened to mud-brown, reinforced by natural stone plates along its back. Its broad tail sweeps with tremendous force when it surfaces. It controls shallow river delta territories and excavates mud wallows that other creatures use for cooling." },

  // ===== WIND =====
  108: { id:108, name:"Silvergust",   emoji:"🐱", types:["Wind"],
    base:{hp:46,atk:43,def:37,spa:56,spd:45,spe:81},
    learnset:[[1,"scratch",[20,"cyclone_blade"]],[1,"gust"],[8,"quick_attack"],[16,"wing_attack"],[21,"harden"],[24,"air_slash"],[32,"hurricane",[5,"mistveil"]],[36,"thermal_dive"],[3,"zephyr_dance"],[31,"leer"]],
    evolveTo:109, evolveLevel:22, catchRate:200, expYield:70, rarity:"common",
    desc:"A light-footed wind kitten. Jumps and glides on invisible air currents.",
    lore:"Silvergust is a lion-cub-sized wind-felid about 45 cm at the shoulder with pale silver-grey fur that ruffles constantly in self-generated air currents. Its ears are long and swept back. It moves with uncanny speed across open spaces, leaving a trail of swirling leaves and dust in its wake. On a high outcropping at dusk, a Silvergust cub will sometimes stand frozen with its ears swept fully back and silver fur ruffling in self-generated wind: the body bracing itself, instinctively, against the storm-mane Siroccomane wears and the full electric-blue mane Aeolarch carries thereafter." },

  109: { id:109, name:"Siroccomane",    emoji:"🦁", types:["Wind","Electric"],
    base:{hp:70,atk:98,def:57,spa:68,spd:74,spe:119},
    learnset:[[1,"gust"],[2,"wing_attack"],[3,"mistveil"],[22,"air_slash"],[28,"zephyr_dance"],[29,"hurricane"],[34,"vital_pulse"],[40,"thunder_shock"],[46,"arc_flash"],[52,"thunderbolt"],[58,"gale_cannon"],[64,"thunder"],[4,"vortex_trap"],[42,"storm_surge"]],
    evolveTo:110, evolveLevel:44, catchRate:55, expYield:318, rarity:"uncommon",
    desc:"A majestic wind lion whose mane crackles with electric charge during storms.",
    lore:"Siroccomane is a wind lion 1.1 metres at the shoulder — Silvergust's silver-grey cub-fur has matured to tawny-gold and the long swept ears now top a full lion-mane that crackles electric-blue and streams behind it in the breeze it generates. Its footsteps barely touch the ground. It rules open desert plateaux, herding storms and creating complex thermals that other flying creatures use for navigation." },

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
    lore:"Swirlavel is a compact eagle 50 cm long — Aeolin's white-silver feathers have weathered to a grey-brown pattern and its long forked tail has shortened and stiffened into a powerful rudder, with a distinctive double-spiral crest now topping its head. It creates miniature localised whirlwinds with each wingbeat that allow it to hover effortlessly in place. It hunts by dropping into these personal tornadoes and striking prey below." },

  114: { id:114, name:"Nimbusel",   emoji:"☁️", types:["Wind","Fairy"],
    base:{hp:54,atk:32,def:33,spa:76,spd:71,spe:67},
    learnset:[[1,"tackle",[22,"mistveil"]],[1,"gust"],[3,"vortex_trap"],[9,"fairy_wind"],[12,"breeze_blade"],[15,"squall"],[17,"sweet_kiss"],[20,"tail_whip"],[24,"breeze_blast"],[25,"air_slash"],[31,"storm_surge"],[33,"moonblast",[5,"zephyr_dance"]],[36,"dazzling_gleam"]],
    evolveTo:115, evolveLevel:25, catchRate:150, expYield:80, rarity:"common",
    desc:"A fluffy cloud puffball. It floats serenely but fights with surprising force.",
    lore:"Nimbusel is a wisp-like cloud fairy creature about 30 cm tall that resembles a small humanoid formed from condensed cloud matter with gossamer wings. Its body constantly sheds small snowflake-like crystals. It drifts through mountain mist at high elevation, rarely descending, and is considered a blessing when sighted." },

  115: { id:115, name:"Aetherworn",  emoji:"👻", types:["Wind","Dark"],
    base:{hp:80,atk:60,def:64,spa:107,spd:85,spe:94},
    learnset:[[1,"gust"],[2,"air_slash"],[3,"tackle"],[4,"mistveil"],[30,"growl"],[35,"shadowstep"],[40,"night_slash"],[45,"dark_pulse"],[50,"shadow_ball"],[55,"cyclone_blade"],[60,"nightmare_pulse"],[65,"hurricane"],[5,"zephyr_dance"],[42,"storm_surge"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:195, rarity:"uncommon",
    desc:"A tattered cloud-fairy whose body has frayed into shifting smoke and ragged tatters. Its passage chills the air noticeably even on warm days.",
    lore:"Aetherworn is a tall ragged cloud-fairy roughly 80 centimetres tall, the matured form of Nimbusel whose once-gossamer wings and humanoid silhouette have frayed into trailing tatters of dark cloud-matter. Its body shifts continuously between solid and smoke — at one moment a clear humanoid outline, the next a drifting smear of grey-violet vapour with two pale grey eyes glowing through. Long tendrils of cloud-fabric trail from its shoulders and hem like a wind-torn cloak, and its passage chills the air noticeably even on warm days. It haunts windswept ruins and desolate cliff edges, drawn to high places where mountain wind streams past in deep gusts." },

  // ===== ICE =====
  47: { id:47, name:"Hexaprowl",    emoji:"🐺", types:["Ice"],
    base:{hp:49,atk:54,def:51,spa:63,spd:47,spe:73},
    learnset:[[1,"scratch",[22,"glacial_shard"]],[1,"powder_snow"],[8,"quick_attack"],[16,"icicle_crash"],[24,"ice_beam"],[29,"recover"],[32,"ice_punch"],[40,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[31,"leer"]],
    evolveTo:48, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"An ice wolf pup with fur as white as fresh snow. Very loyal and fierce.",
    lore:"Hexaprowl is a lean wolf-like creature about 70 cm at the shoulder with short grey-white fur overlaid by a thin shell of constantly renewing ice crystals. Its paws leave perfectly hexagonal imprints in snow. It hunts in packs across tundra, using coordinated flanking manoeuvres to drive prey toward waiting ambushers." },

  48: { id:48, name:"Hailgorge",emoji:"🐺", types:["Ice"],
    base:{hp:89,atk:85,def:55,spa:81,spd:76,spe:94},
    learnset:[[1,"powder_snow"],[2,"quick_attack"],[3,"ice_beam"],[4,"icicle_crash"],[5,"scratch"],[6,"permafrost"],[28,"recover"],[29,"ice_punch"],[37,"blizzard"],[40,"hoarfrost_bite"],[52,"body_slam"],[64,"avalanche_drive"],[7,"winter_shroud"],[44,"leer"]],
    evolveTo:49, evolveLevel:44, catchRate:40, expYield:220, rarity:"uncommon",
    desc:"A blizzard hound that howls to summon snowstorms. Fearsome and fast.",
    lore:"Hailgorge is a massive ice wolf 1.3 metres tall at the shoulder with broad shoulders and white fur that bristles with jagged ice spines when it raises its hackles — Hexaprowl's thin ice-crystal shell has thickened into a permanent armoured mantle along its back, and the hexagonal paw-prints of its juvenile form have widened into bear-sized impressions. Its howl condenses moisture in the air into a brief localised hailstorm. It leads Hexaprowl packs with absolute authority." },

  50: { id:50, name:"Tundram",   emoji:"🐏", types:["Ice","Normal"],
    base:{hp:49,atk:49,def:55,spa:52,spd:64,spe:54},
    learnset:[[1,"tackle",[22,"permafrost"]],[1,"powder_snow"],[10,"harden"],[18,"ice_beam"],[20,"vital_pulse"],[26,"body_slam"],[34,"blizzard",[5,"winter_shroud"]],[36,"headbutt"],[3,"frostfire_veil"],[31,"glacial_shard"]],
    evolveTo:51, evolveLevel:24, catchRate:180, expYield:77, rarity:"common",
    desc:"A fluffy snow sheep. Its wool absorbs cold air and condenses it to ice.",
    lore:"Tundram is a stocky ram-like creature with thick white wool and curling horns coated in layers of old ice. A pale blue tinge runs through the wool near its spine. It grazes on frost-covered highland moss and climbs sheer glacier faces using hooves specially adapted to grip slick ice surfaces." },

  51: { id:51, name:"Shiverling",  emoji:"🦬", types:["Ice","Normal"],
    base:{hp:76,atk:67,def:93,spa:106,spd:91,spe:56},
    learnset:[[1,"powder_snow"],[2,"winter_shroud"],[3,"harden"],[4,"vital_pulse"],[5,"ice_beam"],[6,"permafrost"],[31,"blizzard"],[33,"headbutt"],[34,"growl"],[44,"recover"],[54,"hoarfrost_bite"],[64,"icicle_crash"],[7,"frostfire_veil"],[43,"leer"]],
    evolveTo:52, evolveLevel:42, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A sturdy frost-yak whose shoulders are starting to grow translucent slabs of glacier ice. Roams highland tundra in small herds, generating a steady chill in the air.",
    lore:"Shiverling is a stout woolly bovid roughly 1 metre at the shoulder, halfway in build between a frost-blooded ram and the great glacial mountain-oxen it will become. Its dense pale wool is streaked with the same blue tinge as Tundram's spine, and two short, curling horns — still tipped in old ice — sit low on its broad skull. Translucent slabs of pale-blue glacier ice have begun to fuse to its shoulders and along its back, refracting light in faint prismatic patterns when struck by the sun. Small herds roam highland tundra together, jostling against one another so that the ice plates of neighbouring beasts grind in a low keening chime that carries across snowfields for kilometres." },

  53: { id:53, name:"Mistwhirl",  emoji:"🦉", types:["Ice","Wind"],
    base:{hp:52,atk:60,def:32,spa:45,spd:70,spe:98},
    learnset:[[1,"powder_snow",[22,"cryo_lance"]],[1,"gust"],[12,"wing_attack"],[20,"ice_beam"],[28,"air_slash"],[31,"glacial_tomb"],[36,"blizzard"],[44,"hurricane",[5,"permafrost"]],[3,"winter_shroud"],[33,"thermal_dive"]],
    evolveTo:54, evolveLevel:30, catchRate:100, expYield:95, rarity:"common",
    desc:"A downy snowy owlet whose head pivots through near-perfect circles. Soft mist swirls outward whenever it ruffles its feathers.",
    lore:"Mistwhirl is a fluffy white-and-pale-silver owlet about 30 centimetres tall, with enormous golden eyes and a head that swivels nearly all the way around. Its downy feathers are still soft and unhardened — they shed tiny ice crystals into delicate trails of swirling mist whenever it ruffles them or pivots its head sharply. It perches in arctic conifer crowns and on snowbound branches, watching everything within its range in absolute silence, and learns the wind currents of its mountain pass as a young flier learns to glide between thermals." },

  54: { id:54, name:"Arcturex",     emoji:"🦉", types:["Ice","Wind"],
    base:{hp:80,atk:101,def:52,spa:57,spd:87,spe:113},
    learnset:[[1,"powder_snow"],[2,"ice_beam"],[3,"permafrost"],[4,"winter_shroud"],[8,"snow_veil"],[12,"frost_armor"],[16,"hail_barrage"],[20,"glacial_swift"],[24,"feather_dance"],[26,"zephyr_arrow"],[28,"aerial_ace"],[30,"glacial_tomb"],[32,"razor_wind"],[33,"blizzard"],[34,"wind_barrier"],[35,"battle_cry"],[36,"avalanche_smash"],[38,"glacial_lance"],[40,"scratch"],[42,"cyclone_blade"],[44,"aurora_blast"],[45,"glacial_shard"],[48,"hail_storm"],[50,"icicle_crash"],[52,"sheer_cold"],[55,"storm_surge"],[60,"avalanche_drive"],[65,"hurricane"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:228, rarity:"uncommon",
    desc:"A massive snowy owl whose silent flight makes it the apex watcher of the polar dusk. Its talons can crack frozen earth.",
    lore:"Arcturex is an enormous snowy owl 1.2 metres tall and over 2.5 metres in wingspan — Mistwhirl's soft white-and-silver owlet down has hardened and layered into dense pale silver-white feathers that absorb sound completely — its hunting flight is so silent that prey hears only the moment of strike. Its broad disc-like face is bordered in pearl-grey edge feathers, and two large amber-gold eyes catch and reflect what little light reaches the polar dusk it patrols. Its talons are long and powerful enough to crack frozen earth crust on landing, and like its Boötes-watcher namesake it rules a fixed circuit of sky each night, watching all that passes beneath. Hunters in the high north consider its silhouette across the moon a sign of clear hunting ahead — or, when it stoops, a warning that the next storm is already rolling in." },

  45: { id:45, name:"Slatis",   emoji:"🌨️", types:["Ice","Aquatic"],
    base:{hp:51,atk:39,def:49,spa:74,spd:64,spe:45},
    learnset:[[1,"tackle",[20,"frost_breath"]],[1,"water_gun"],[6,"ice_shard"],[9,"powder_snow"],[11,"frost_bite"],[14,"growl"],[16,"frost_jab"],[17,"ice_beam"],[24,"scratch"],[25,"surf"],[33,"blizzard",[5,"permafrost"]],[34,"bubble_beam"],[42,"riptide_slam"],[3,"winter_shroud"],[32,"aqua_tail"]],
    evolveTo:46, evolveLevel:32, catchRate:130, expYield:82, rarity:"common",
    desc:"A sleet sprite that lives in cold mountain streams. Chills the air around it.",
    lore:"Slatis is a drifting jellyfish-like ice creature 60 cm in diameter. Its translucent bell shimmers with pale arctic blue light, and long trailing tendrils of frozen water hang below it like icicles. It bobs through freezing mountain lakes, generating a localised cold field that chills the surrounding water." },

  // ===== DARK =====
  118: { id:118, name:"Eclipsehound",   emoji:"🐕", types:["Dark"],
    base:{hp:39,atk:56,def:44,spa:62,spd:39,spe:88},
    learnset:[[1,"scratch",[22,"shadowstep"]],[1,"bite"],[8,"quick_attack"],[16,"night_slash"],[24,"crunch"],[29,"recover"],[32,"dark_pulse"],[40,"shadow_ball",[5,"eclipse_shroud"]],[3,"dread_howl"],[31,"leer"]],
    evolveTo:119, evolveLevel:25, catchRate:150, expYield:88, rarity:"common",
    desc:"A shadow puppy that hides in darkness. Its eyes glow red at night.",
    lore:"Eclipsehound is a small dark-coloured dog about 40 cm at the shoulder with jet-black fur that absorbs nearby light, creating a subtle darkening effect around it. Its eyes glow a faint amber. It is skittish and secretive, hiding in shadows and emerging only at dusk to scavenge in settlements." },

  119: { id:119, name:"Dreadmaw",  emoji:"🐕", types:["Dark"],
    base:{hp:81,atk:90,def:57,spa:83,spd:77,spe:92},
    learnset:[[1,"bite"],[2,"quick_attack"],[3,"crunch"],[4,"night_slash"],[5,"scratch"],[6,"eclipse_shroud"],[26,"recover"],[29,"dark_pulse"],[37,"shadow_ball"],[38,"nightmare_pulse"],[51,"body_slam"],[64,"void_rend"],[7,"dread_howl"],[44,"leer"]],
    evolveTo:120, evolveLevel:44, catchRate:45, expYield:316, rarity:"uncommon",
    desc:"A hound of the night. Moves silently and strikes from blind spots.",
    lore:"Dreadmaw is a large dark dog 90 cm at the shoulder — Eclipsehound's jet-black light-absorbing fur has deepened to pure black across a broad powerful chest, and the skittish pup's silent-paw habit has matured into the ability to move without sound on any surface. It guards underground lairs and claims territorial ownership of shadow-filled spaces within its range, tolerating no other predators in its claimed darkness." },

  121: { id:121, name:"Spiraloom",     emoji:"🦇", types:["Dark","Wind"],
    base:{hp:52,atk:47,def:34,spa:57,spd:51,spe:106},
    learnset:[[1,"bite",[22,"shadowstep"]],[1,"gust"],[9,"wing_attack"],[17,"dark_pulse"],[25,"air_slash"],[29,"soul_rend"],[33,"shadow_ball"],[41,"hurricane",[5,"eclipse_shroud"]],[3,"dread_howl"],[32,"void_rend"]],
    evolveTo:122, evolveLevel:28, catchRate:130, expYield:85, rarity:"common",
    desc:"A dark bat that absorbs light. Creates zones of absolute darkness.",
    lore:"Spiraloom is a medium-sized bat 60 cm long with dark grey-black fur and long narrow wings. Its face is flat with a broad wrinkled nose-leaf for echolocation. It roosts in enormous colonies inside cave systems and emerges at dusk in spiralling columns that can darken the sky for minutes." },

  122: { id:122, name:"Caveshroud", emoji:"🦇", types:["Dark","Wind"],
    base:{hp:63,atk:78,def:48,spa:116,spd:78,spe:119},
    learnset:[[1,"dark_pulse"],[2,"wing_attack"],[3,"air_slash"],[4,"shadowstep"],[5,"eclipse_shroud"],[30,"shadow_ball"],[35,"growl"],[38,"hurricane"],[42,"tackle"],[49,"night_slash"],[56,"nightmare_pulse"],[63,"cyclone_blade"],[6,"dread_howl"],[43,"void_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A spectral wing beast. Its mere passing through an area chills it completely.",
    lore:"Caveshroud is a large dark-wind bat with a 1.5-metre wingspan — Spiraloom's narrow grey-black wings have broadened to leathery dark purple-black and its echolocating nose-leaf has flattened against deeper charcoal-grey fur. When it passes, shadows move in directions contrary to light sources. It roosts alone in sea caves and hunts by riding cold offshore winds far out to sea." },

  123: { id:123, name:"Nocturil", emoji:"🦎", types:["Dark","Poison"],
    base:{hp:51,atk:60,def:50,spa:60,spd:48,spe:62},
    learnset:[[1,"scratch",[22,"obsidian_fang"]],[1,"bite"],[10,"poison_sting"],[18,"night_slash"],[26,"sludge_bomb"],[34,"crunch"],[42,"dark_pulse"],[50,"toxic",[5,"eclipse_shroud"]],[3,"dread_howl"],[36,"blackout_bomb"]],
    evolveTo:124, evolveLevel:32, catchRate:90, expYield:98, rarity:"common",
    desc:"A dark lizard with venomous bite. Camouflages perfectly in shadows.",
    lore:"Nocturil is a lean dark-green lizard 60 cm long with rough scales and a venomous forked tongue. A dark stripe runs from eye to tail. It inhabits rock crevices in shadowed ravines and is almost impossible to spot when motionless. Its venom causes mild hallucinations that disorient predators long enough to allow escape. Hold a Nocturil still and watch closely: its four limbs press flat against its sides until they nearly disappear into the body, a preview written into the muscle memory of the legless serpent silhouette Phantorvex commits to fully." },

  124: { id:124, name:"Phantorvex", emoji:"🐍", types:["Dark","Poison"],
    base:{hp:76,atk:95,def:72,spa:89,spd:73,spe:81},
    learnset:[[1,"bite"],[2,"eclipse_shroud"],[3,"poison_sting"],[4,"obsidian_fang"],[5,"sludge_bomb"],[32,"crunch"],[39,"dark_pulse"],[40,"harden"],[47,"toxic"],[48,"dread_howl"],[56,"venoshock"],[64,"void_rend"],[6,"dark_shroud"],[42,"blackout_bomb"]],
    evolveTo:125, evolveLevel:44, catchRate:35, expYield:218, rarity:"uncommon",
    desc:"A phantom serpent of darkness and venom. Said to haunt ancient ruins.",
    lore:"Phantorvex is a long-bodied legless serpent-lizard 2 metres long — Nocturil's dark-green rough scales have darkened into dark iridescent scales that shift between deep purple and black, while its legs have shrivelled to vestigial limb-stubs against its sides. Its fangs inject a necrotic venom. It haunts ancient ruins and underground crypts, and local legends claim it is drawn to places where death has recently occurred." },

  // ===== FAIRY =====
  137: { id:137, name:"Goldefluff",     emoji:"🐶", types:["Fairy"],
    base:{hp:42,atk:35,def:50,spa:52,spd:57,spe:76},
    learnset:[[1,"tackle",[22,"pixie_bolt"]],[1,"fairy_wind"],[8,"sweet_kiss"],[16,"dazzling_gleam"],[20,"vital_pulse"],[24,"moonblast"],[32,"recover",[5,"stardust_veil"]],[36,"glitter_storm"],[3,"charm_bloom"],[31,"leer"]],
    evolveTo:138, evolveLevel:25, catchRate:190, expYield:78, rarity:"common",
    desc:"A glowing puppy surrounded by fairy light. Brings luck wherever it goes.",
    lore:"Goldefluff is a small, round fairy dog about 30 cm at the shoulder with pure white fluffy fur that radiates a warm golden glow. Its eyes are bright violet. It bounces energetically and its glow intensifies when it is happy. It is attracted to places of celebration and is considered to bring good fortune." },

  138: { id:138, name:"Aetherael", emoji:"🐕", types:["Fairy"],
    base:{hp:71,atk:67,def:68,spa:100,spd:90,spe:77},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"moonblast"],[4,"sweet_kiss"],[29,"recover"],[30,"tail_whip"],[35,"battle_cry"],[40,"quick_attack"],[45,"wish_spark"],[50,"moonveil"],[55,"celestial_wave"],[60,"psystrike"],[5,"stardust_veil"],[39,"leer"]],
    evolveTo:139, evolveLevel:44, catchRate:50, expYield:205, rarity:"uncommon",
    desc:"A luminous hound of fairy power. Its radiance can banish dark spirits.",
    lore:"Aetherael is a sleek fairy hound 70 cm at the shoulder — Goldefluff's pure white fluffy puppy fur has lengthened into luminous adult fur, the warm golden glow has matured into a soft gold-pink aura surrounding it constantly, and the bright violet pup-eyes have deepened to amethyst. It moves with effortless grace and seeks out beings in distress, projecting a calming field of fairy light to soothe emotional pain." },

  140: { id:140, name:"Faeling",    emoji:"🦋", types:["Fairy","Wind"],
    base:{hp:35,atk:44,def:33,spa:79,spd:71,spe:78},
    learnset:[[1,"fairy_wind",[22,"wish_spark"]],[1,"bug_bite"],[10,"sweet_kiss"],[18,"dazzling_gleam"],[20,"recover"],[26,"moonblast"],[34,"bug_buzz",[5,"stardust_veil"]],[36,"gossamer_lance"],[3,"charm_bloom"],[31,"cocoon_burst"]],
    evolveTo:141, evolveLevel:22, catchRate:160, expYield:82, rarity:"common",
    desc:"A prismatic butterfly that scatters rainbow dust. Hard to catch.",
    lore:"Faeling is a small fairy butterfly with a 25 cm wingspan. Its wings display soft pastel fairy-shimmer patterns — pinks, creams, and pale golds — with delicate trailing tails. Its body is slender and pale green. It inhabits enchanted meadows and its wingbeat releases a fine powder that induces feelings of mild euphoria." },

  141: { id:141, name:"Iridesoar",  emoji:"🦋", types:["Fairy","Wind"],
    base:{hp:83,atk:55,def:60,spa:110,spd:95,spe:88},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"recover"],[4,"sweet_kiss"],[23,"moonblast"],[29,"gust"],[33,"gossamer_lance"],[36,"quick_attack"],[43,"air_slash"],[50,"moonveil"],[57,"glitter_storm"],[64,"hurricane"],[5,"stardust_veil"],[42,"thermal_dive"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:200, rarity:"uncommon",
    desc:"A radiant butterfly of pure fairy energy. Its wings shimmer with all colors.",
    lore:"Iridesoar is a large fairy-wind butterfly with a 90 cm wingspan — Faeling's pastel-shimmer juvenile wings have whitened to brilliant iridescent upper wings that now fracture into full rainbow spectra in sunlight, while the underside still shows the soft cloud-white with violet hints carried over from the chrysalis. It soars on warm thermals above flowering valleys, visible from great distances by its light display." },

  142: { id:142, name:"Dawnirel",  emoji:"✨", types:["Fairy","Mental"],
    base:{hp:50,atk:48,def:54,spa:74,spd:61,spe:63},
    learnset:[[1,"fairy_wind",[22,"stardust_veil"]],[1,"confusion"],[10,"sweet_kiss"],[18,"psybeam"],[26,"dazzling_gleam"],[30,"neural_storm"],[34,"psychic_move"],[42,"moonblast",[5,"charm_bloom"]],[3,"aurora_veil"],[32,"glitter_storm"]],
    evolveTo:143, evolveLevel:32, catchRate:100, expYield:96, rarity:"common",
    desc:"A dawn spirit that appears at sunrise. Its psychic energy is immense.",
    lore:"Dawnirel is a small star-shaped psychic-fairy creature about 20 cm across, with a central golden body and five pointed arms tipped in pale rose light. It hovers gently, spinning slowly, and emits pulses of warm light in rhythm with its thoughts. It appears at dawn and dusk on cloudless days." },

  143: { id:143, name:"Lunarael",   emoji:"🌟", types:["Fairy","Mental"],
    base:{hp:79,atk:66,def:79,spa:131,spd:105,spe:74},
    learnset:[[1,"dazzling_gleam"],[2,"sweet_kiss"],[32,"psychic_move"],[36,"recover"],[39,"moonblast"],[40,"calm_mind"],[44,"quick_attack"],[48,"wish_spark"],[52,"future_echo"],[56,"celestial_wave"],[60,"psystrike"],[64,"mind_shatter"],[3,"stardust_veil"],[38,"thought_crush"]],
    evolveTo:144, evolveLevel:46, catchRate:25, expYield:248, rarity:"rare",
    desc:"A celestial being of fairy and psychic power. Claims to have come from the stars.",
    lore:"Lunarael is a larger crescent-moon-shaped psychic-fairy creature 45 cm across — Dawnirel's pointed arms have curved inward, briefly crescent-like, before they bloom back to a full many-pointed star at its final stage. Its body is deep violet-blue with silver-white edges that glow brightly in darkness. It is nocturnal and inhabits open mountain summits, drifting upward on clear nights and releasing lunar-charged energy that causes nearby crystals to resonate." },

  // ===== STEEL =====
  147: { id:147, name:"Scrapsapien",     emoji:"🤖", types:["Metal"],
    base:{hp:47,atk:60,def:72,spa:37,spd:45,spe:54},
    learnset:[[1,"scratch",[22,"alloy_edge"]],[1,"metal_claw"],[9,"harden"],[17,"flash_cannon"],[25,"steel_wing"],[29,"leer"],[33,"iron_tail"],[41,"body_slam",[5,"magnetize"]],[3,"ironskin"],[32,"tail_whip"]],
    evolveTo:148, evolveLevel:28, catchRate:120, expYield:90, rarity:"common",
    desc:"A small steel humanoid armored in iron plates. Slow but incredibly tough.",
    lore:"Scrapsapien is a small humanoid steel creature 50 cm tall with a compact body of dark grey steel plates with visible bolts and seams. Its eyes are small yellow optical lenses. It collects metal scraps and incorporates them into its own body, slowly growing more elaborate and patched over time." },

  148: { id:148, name:"Stoicguard",  emoji:"🦾", types:["Metal"],
    base:{hp:90,atk:107,def:111,spa:65,spd:83,spe:37},
    learnset:[[1,"metal_claw"],[2,"flash_cannon"],[3,"steel_wing"],[4,"magnetize"],[28,"leer"],[30,"iron_tail"],[35,"battle_cry"],[38,"body_slam"],[42,"quick_attack"],[49,"rivet_barrage"],[56,"forge_strike"],[63,"tungsten_ram"],[5,"ironskin"],[43,"recover"]],
    evolveTo:149, evolveLevel:46, catchRate:40, expYield:225, rarity:"uncommon",
    desc:"A steel hound with titanium claws. Almost nothing can break its armor.",
    lore:"Stoicguard is a large humanoid steel creature 1.5 metres tall — Scrapsapien's compact bolted-and-seamed plating has reforged into a broad powerful chest and arms that function as natural weapons, and the scrap-collecting habit of its juvenile form has left a surface of burnished dark steel with deep scratches from past battles. It is stoic, rarely speaking, and positions itself between perceived threats and those it considers worth protecting." },

  150: { id:150, name:"Gearon",     emoji:"⚙️", types:["Metal","Electric"],
    base:{hp:48,atk:50,def:67,spa:52,spd:57,spe:54},
    learnset:[[1,"metal_claw",[22,"shrapnel_burst"]],[1,"thunder_shock"],[10,"flash_cannon"],[18,"spark"],[21,"recover"],[26,"thunderbolt"],[34,"flash_cannon"],[38,"plasma_strike"],[42,"thunder",[5,"magnetize"]],[3,"ironskin"],[32,"ball_lightning"]],
    evolveTo:151, evolveLevel:28, catchRate:100, expYield:95, rarity:"common",
    desc:"A mechanical gear-bot that runs on electric power. Loves to tinker.",
    lore:"Gearon is a compact steel-electric creature 60 cm tall that resembles a gear-work automaton. Its round body is made of interlocking cog-wheels that spin and whir constantly, generating its own electrical power through mechanical motion. Sparks escape through gaps in its gear-work as it moves." },

  151: { id:151, name:"Alloytron",    emoji:"🦿", types:["Metal","Electric"],
    base:{hp:77,atk:72,def:92,spa:108,spd:75,spe:66},
    learnset:[[1,"thunderbolt"],[2,"magnetize"],[31,"flash_cannon"],[32,"surge_field"],[36,"harden"],[39,"thunder"],[40,"rivet_barrage"],[44,"volt_surge"],[48,"iron_tail"],[52,"tungsten_ram"],[56,"overcharge"],[60,"hyper_beam"],[3,"ironskin"],[37,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:235, rarity:"uncommon",
    desc:"A mechanical warrior powered by electric cores. Feared on every battlefield.",
    lore:"Alloytron is a larger electric-steel automaton 1.2 metres tall — Gearon's spinning cog-wheels have consolidated into an assembly of interlocked alloy panels with exposed wiring running between them, and the mechanical-motion sparks of its juvenile form have organised into a glowing power core visible through a transparent casing in its chest. Its chest houses a glowing power core visible through a transparent casing. It can interface with electrical infrastructure and draw power directly from city grid lines." },

  // LORE-AUDIT FLAG (Step 4): PR #49 forced retype (Spectral/Fighting now pre-408 OK — reconsider)
  152: { id:152, name:"Imperion",  emoji:"🐢", types:["Metal","Earth"],
    base:{hp:108,atk:61,def:138,spa:59,spd:105,spe:30},
    learnset:[[1,"tackle",[25,"ironskin"]],[1,"rock_throw"],[12,"harden"],[20,"flash_cannon"],[24,"growl"],[28,"rock_slide"],[36,"iron_tail"],[44,"stone_edge"],[45,"temper_edge"],[52,"body_slam",[5,"magnetize"]],[3,"slag_shield"],[37,"crystal_lance"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:318, rarity:"uncommon",
    desc:"A colossal steel-rock turtle. Nigh indestructible but very slow.",
    lore:"Imperion is a heavily built metal-earth tortoise 1.5 metres long with a thick dome shell of laminated steel plates fused over natural rock. It moves with glacial slowness but is nearly impossible to harm. It is said to carry small ecosystems on its shell — moss, insects, and even small plants grow undisturbed there." },

  // ===== POISON =====
  155: { id:155, name:"Toxirin",    emoji:"🐸", types:["Poison"],
    base:{hp:67,atk:56,def:58,spa:71,spd:50,spe:49},
    learnset:[[1,"tackle",[22,"miasma_cloud"]],[1,"poison_sting"],[9,"bubble_beam"],[17,"sludge_bomb"],[20,"battle_cry"],[25,"toxic"],[33,"venoshock"],[36,"sludge_wave"],[41,"sludge_bomb",[5,"toxic_surge"]],[3,"toxin_bloom"],[31,"leer"]],
    evolveTo:156, evolveLevel:24, catchRate:150, expYield:88, rarity:"common",
    desc:"A toxic toad that drips with powerful venom. Warty and repulsive but deadly.",
    lore:"Toxirin is a small plump frog about 15 cm long with vivid lime-green skin marked by patterns of yellow and black warning colours. It secretes a sticky toxic slime from its skin that deters predators effectively. It inhabits warm rainforest ponds and amplifies its chirping call to remarkable volume for its size. Older Toxirin sometimes abandon the bright lily-pads of the rainforest entirely and drift downstream for hours into darker, slower water. They are scouts ahead of their own evolution, sampling the murky river backwaters Venekon eventually settles into." },

  156: { id:156, name:"Venekon",   emoji:"🐸", types:["Poison","Aquatic"],
    base:{hp:98,atk:72,def:65,spa:113,spd:87,spe:56},
    learnset:[[1,"poison_sting"],[2,"bubble_beam"],[3,"toxic_surge"],[24,"toxic"],[30,"venoshock"],[32,"tail_whip"],[33,"sludge_wave"],[38,"sludge_bomb"],[40,"scratch"],[48,"venom_lance"],[56,"surf"],[64,"hydro_pump"],[4,"toxin_bloom"],[43,"aqua_tail"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A venom toad of enormous size. Its croaking alone can poison the air.",
    lore:"Venekon is a medium poison-water frog 35 cm long with a flattened head and webbed feet — Toxirin's lime-green skin and yellow-black warning patterns have muddied to a mottled blue-green and brown as it migrated from rainforest ponds to murky river backwaters, and its sticky skin-toxin has dispersed into a diluted aquatic toxin for fending off fish predators. It produces a diluted aquatic toxin that disperses through water to deter fish predators. It inhabits murky river backwaters and calls from beneath floating lily pads." },

  157: { id:157, name:"Acidelix",    emoji:"🫧", types:["Poison"],
    base:{hp:61,atk:47,def:47,spa:75,spd:59,spe:43},
    learnset:[[1,"tackle",[22,"putrid_pulse"]],[1,"poison_sting"],[10,"sludge_bomb"],[18,"toxic"],[21,"vital_pulse"],[26,"venoshock"],[34,"recover"],[38,"sludge_wave"],[42,"sludge_bomb",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"leer"]],
    evolveTo:158, evolveLevel:26, catchRate:130, expYield:95, rarity:"common",
    desc:"A blob of acid that oozes across the ground. Dissolves things with its body.",
    lore:"Acidelix is a floating translucent orb about 20 cm in diameter filled with slowly swirling acid-green liquid. Its outer membrane is barely visible. It drifts through damp cave systems, dissolving organic material it contacts and absorbing the resulting nutrients through its outer surface." },

  158: { id:158, name:"Corrodisc",  emoji:"🫧", types:["Poison","Earth"],
    base:{hp:98,atk:70,def:86,spa:110,spd:86,spe:30},
    learnset:[[1,"toxic"],[2,"tackle"],[3,"venoshock"],[4,"toxic_surge"],[32,"growl"],[35,"sludge_wave"],[38,"mud_shot"],[39,"sludge_bomb"],[44,"loam_leech"],[50,"terra_spike"],[56,"earth_power"],[62,"earthquake"],[5,"toxin_bloom"],[41,"magnitude"]],
    evolveTo:159, evolveLevel:44, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A sludge behemoth that poisons everything it touches. Its territory reeks.",
    lore:"Corrodisc is a large ground-crawling acidic creature 1 metre across, shaped like a flattened toad-tadpole with a broad disc-like body and short stubby limbs — Acidelix's drifting orb-membrane has settled to the ground and reorganised into a flat disc, and the acid-green liquid that once filled its sphere now exudes from its undersurface as a corrosive fluid that slowly etches whatever it crawls across. It inhabits cave floors and underground acid springs, leaving characteristic pitting in stone wherever it travels." },

  160: { id:160, name:"Miasmafly",   emoji:"🦟", types:["Poison","Wind"],
    base:{hp:49,atk:53,def:30,spa:78,spd:64,spe:77},
    learnset:[[1,"poison_sting",[22,"acid_rain"]],[1,"gust"],[10,"sludge_bomb"],[16,"vital_pulse"],[18,"air_slash"],[26,"toxic"],[29,"miasma_cloud"],[34,"hurricane"],[40,"plague_burst"],[42,"venoshock",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"sludge_wave"]],
    evolveTo:161, evolveLevel:30, catchRate:140, expYield:88, rarity:"common",
    desc:"A miasma fly that leaves toxic trails in its wake. Spreads pestilence.",
    lore:"Miasmafly is a large winged insect creature with a 60 cm wingspan, resembling a crane fly but with a bloated poisonous abdomen. Its wings are translucent, tinted sickly yellow-green. It creates toxic air currents with its wings as it flies, leaving a drift of suspended poisonous particles in its wake. Older Miasmafly drift back to stagnant water as their lifespan closes, returning instinctively to the marsh-pools where their bodies will fracture into the countless microscopic offspring-flies that compose Mistbane." },

  // ===== PSYCHIC =====
  166: { id:166, name:"Projectery",     emoji:"🐩", types:["Mental"],
    base:{hp:50,atk:34,def:39,spa:74,spd:72,spe:72},
    learnset:[[1,"tackle",[22,"mind_shatter"]],[1,"confusion"],[8,"quick_attack"],[16,"psybeam"],[24,"psychic_move"],[29,"leer"],[32,"calm_mind"],[40,"psystrike",[5,"prism_ward"]],[3,"mind_reader"],[31,"recover"]],
    evolveTo:167, evolveLevel:25, catchRate:165, expYield:86, rarity:"common",
    desc:"A psychic puppy that reads minds. Can predict attacks before they happen.",
    lore:"Projectery is a small psychic dog about 30 cm at the shoulder with smooth lavender-grey fur and a large domed forehead that glows softly when focusing. Its eyes are bright blue-silver. It reads emotions effortlessly and communicates its own feelings through projected imagery rather than vocalisation." },

  167: { id:167, name:"Psychovast",   emoji:"🐩", types:["Mental"],
    base:{hp:78,atk:58,def:54,spa:108,spd:100,spe:107},
    learnset:[[1,"confusion"],[2,"psybeam"],[3,"psychic_move"],[4,"prism_ward"],[29,"calm_mind"],[31,"growl"],[37,"psystrike"],[38,"battle_cry"],[43,"recover"],[49,"wild_tumble"],[55,"telepathic_slam"],[61,"thought_crush"],[5,"mind_reader"],[41,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:318, rarity:"uncommon",
    desc:"A psychic hound whose mind burns with power. Can levitate small objects.",
    lore:"Psychovast is a larger psychic dog 75 cm at the shoulder — Projectery's smooth lavender-grey fur has darkened to sleek indigo-grey, and the domed glowing forehead of its juvenile form has hardened into a prominent cranial ridge. Concentric rings of faint blue light appear around its head when it concentrates. It can project full sensory experiences into nearby minds and uses this ability to test the character of strangers." },

  168: { id:168, name:"Espelith",     emoji:"🔮", types:["Mental","Mineral"],
    base:{hp:46,atk:51,def:57,spa:80,spd:79,spe:62},
    learnset:[[1,"confusion",[22,"insight_flare"]],[1,"fairy_wind"],[8,"crystal_glow"],[10,"psybeam"],[14,"mineral_focus"],[18,"dazzling_gleam"],[26,"psychic_move"],[30,"mineral_pulse"],[34,"moonblast"],[42,"calm_mind"],[50,"psystrike",[5,"prism_ward"]],[3,"mind_reader"],[36,"glitter_storm"]],
    evolveTo:169, evolveLevel:32, catchRate:90, expYield:100, rarity:"common",
    desc:"A serene gem-being. Bridges the worlds of mind and matter, refracting psychic energy through its violet prism body into patterns of light.",
    lore:"Espelith is a mental-mineral gem creature 50 cm tall resembling a rounded prism of violet crystal with short limbs and a serene humanoid face embedded in the front face of the crystal. It refracts nearby psychic energy into visible light, producing beautiful patterns on surrounding surfaces." },

  169: { id:169, name:"Aurarael",   emoji:"💫", types:["Mental","Mineral"],
    base:{hp:83,atk:62,def:59,spa:119,spd:98,spe:104},
    learnset:[[1,"psybeam"],[2,"psychic_move"],[3,"prism_ward"],[20,"ore_ray"],[36,"harden"],[38,"mineral_pulse"],[39,"calm_mind"],[40,"recover"],[44,"quick_attack"],[45,"gem_storm"],[47,"psystrike"],[48,"telepathic_slam"],[50,"quartz_blast"],[52,"thought_crush"],[56,"temporal_rift"],[60,"hyper_beam"],[4,"mind_reader"],[35,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:245, rarity:"rare",
    desc:"A levitating psychic core orbited by seven prism shards, held in formation by a luminous mind-field. Its serene face gleams from the central crystal.",
    lore:"Aurarael is a 60-centimetre crystalline entity whose violet prism body has fractured upward into a slowly orbiting cluster of seven smaller shards, held in formation by the visible blue-violet psychic field that radiates between them. The serene humanoid face from its Espelith juvenile stage still shimmers at the centre of the largest core shard, watching outward through every angle of the rotating crown. It inhabits locations with high psychic resonance — ancient meditation sites, mystical crossroads — and the constant low chime of its orbiting shards announces its presence well before it drifts into view." },

  170: { id:170, name:"Oneiron",   emoji:"💫", types:["Mental","Dream"],
    base:{hp:75,atk:69,def:52,spa:125,spd:94,spe:84},
    learnset:[[1,"confusion",[25,"future_echo"]],[1,"bite"],[11,"psybeam"],[19,"dark_pulse"],[23,"swords_dance"],[27,"psychic_move"],[35,"shadow_ball"],[42,"nightmare_pulse"],[43,"night_slash"],[51,"psystrike",[5,"calm_mind"]],[3,"prism_ward"],[37,"void_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:70, expYield:185, rarity:"uncommon",
    desc:"A dreamrift that exists between sleep and waking. It draws power from nightmares.",
    lore:"Oneiron is a mental-dream entity 70 cm tall with a wisp-like body of deep indigo and silver. Its limbs dissolve at the edges into drifting motes of light. It inhabits the boundary between waking and sleep, entering dreams of nearby sleeping creatures and exploring their symbolic landscapes." },

  171: { id:171, name:"Drakorius",    emoji:"🐲", types:["Draconic"],
    base:{hp:75,atk:88,def:74,spa:112,spd:82,spe:90},
    learnset:[[1,"dragon_breath",[28,"mind_shatter"]],[1,"confusion"],[13,"psybeam"],[21,"dragon_claw"],[24,"swords_dance"],[29,"psychic_move"],[37,"dragon_pulse"],[44,"astral_rend"],[45,"psystrike"],[53,"outrage",[5,"calm_mind"]],[3,"prism_ward"],[38,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A wise mediator dragon, fluent in the territorial calls of every clan. Ancient and mysterious.",
    lore:"Drakorius is a dragon 2 metres long with sleek violet-blue scales and a broad intelligent forehead. Its wings are translucent membranes showing internal structure like stained glass. It is uniquely fluent in the territorial calls and posture-language of every dragon species, and has historically served as a mediator between rival dragon clans." },

  // ===== DRAGON =====
  172: { id:172, name:"Scalurin",    emoji:"🐣", types:["Draconic"],
    base:{hp:47,atk:73,def:53,spa:63,spd:60,spe:30},
    learnset:[[1,"scratch",[22,"wyrm_strike"]],[1,"dragon_breath"],[12,"dragon_claw"],[20,"vital_pulse"],[22,"dragon_pulse"],[30,"dragon_dance"],[36,"cataclysm_breath"],[40,"outrage",[5,"draconic_roar"]],[3,"primordial_roar"],[31,"recover"]],
    evolveTo:173, evolveLevel:30, catchRate:45, expYield:91, rarity:"uncommon",
    desc:"A baby dragon hatchling. Clumsy but full of fiery determination.",
    lore:"Scalurin is a tiny dragon hatchling 20 cm long with soft, flexible scales in pale gold-green. Its eyes are enormous relative to its face. It stumbles awkwardly when walking but is a capable swimmer. It hatches in sandy riverbanks and spends its first year hunting insects near the water's edge." },

  173: { id:173, name:"Serpenthos",    emoji:"🐲", types:["Draconic"],
    base:{hp:71,atk:102,def:72,spa:79,spd:65,spe:67},
    learnset:[[1,"dragon_breath"],[2,"dragon_claw"],[3,"dragon_pulse"],[4,"dragon_dance"],[5,"draconic_roar"],[33,"tail_whip"],[36,"battle_cry"],[37,"outrage"],[39,"wild_tumble"],[42,"drake_rush"],[45,"scale_storm"],[46,"hyper_beam"],[6,"primordial_roar"],[30,"recover"]],
    evolveTo:174, evolveLevel:55, catchRate:15, expYield:175, rarity:"rare",
    desc:"A powerful wyrm with tremendous strength. Known to destroy mountains. Legends say it will one day don armor of living steel.",
    lore:"Serpenthos is a young dragon-serpent 1.5 metres long — Scalurin's soft pale gold-green scales have hardened and darkened to green-bronze, and a flat cobra-like hood has emerged from its broadening neck that it flares when threatened. Its wings are still developing and cannot support flight. It inhabits river caves and hunts fish by lunging from concealed positions near the water surface." },

  174: { id:174, name:"Scalevorn", emoji:"🦕", types:["Draconic","Metal"],
    base:{hp:88,atk:115,def:118,spa:75,spd:85,spe:62},
    learnset:[[1,"dragon_claw"],[1,"metal_claw"],[20,"dragon_pulse"],[30,"flash_cannon"],[40,"iron_tail"],[50,"outrage"],[60,"forge_strike"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:275, rarity:"rare",
    desc:"The final form of the ancient dragon lineage. Its scales have fused into living steel over millennia of battle, creating impenetrable natural armor.",
    lore:"Scalevorn is a powerful dragon-steel hybrid 4 metres long — Serpenthos's green-bronze scales have hardened into steel-grey metallic plates over centuries, and the cobra-hood of its juvenile form has folded flat against the broad muscular base of its skull. Its body is broad and muscular. It moves on four limbs with its wings folded into secondary arms. Its scales have been used in legendary armour-forging projects." },

  321: { id:321, name:"Dragemian",  emoji:"🐉", types:["Draconic","Fire"],
    base:{hp:86,atk:149,def:101,spa:101,spd:94,spe:66},
    learnset:[[1,"outrage"],[2,"dragon_pulse"],[3,"scale_storm"],[4,"hyper_beam"],[5,"dragon_dance"],[58,"char_dance"],[61,"growl"],[64,"harden"],[65,"flame_fang"],[66,"pyre_fang"],[67,"heat_wave"],[68,"inferno"],[69,"ancient_breath"],[70,"fire_blast"]],
    evolveTo:null, evolveLevel:null, catchRate:5, expYield:340, rarity:"legendary",
    desc:"The lord of all dragons. Its fire is hot enough to melt any metal.",
    lore:"Dragemian is a legendary fire-dragon of enormous size, estimated at 12 metres from snout to tail. Its scales are deep crimson-black edged with gold, and two enormous curved horns sweep back from its broad angular skull. Its wings span nearly 20 metres and darken the sky when spread. Ancient texts describe it as the progenitor of all fire dragon lineages, and its breath weapon — a sustained column of solar-temperature fire — can be seen from the horizon." },

  175: { id:175, name:"Biolumal",    emoji:"🐉", types:["Aquatic","Draconic"],
    base:{hp:71,atk:104,def:76,spa:98,spd:92,spe:88},
    learnset:[[1,"water_gun",[28,"eon_crash"]],[1,"dragon_breath"],[14,"surf"],[17,"harden"],[22,"dragon_claw"],[30,"hydro_pump"],[31,"coral_barrage"],[38,"dragon_pulse"],[43,"tidal_crush"],[46,"outrage",[5,"tidecaller"]],[3,"deepwater_hymn"],[34,"ocean_tempest"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A sea dragon that rules the ocean floor. Massive and aquatic.",
    lore:"Biolumal is a serpentine water-dragon 5 metres long with fluid blue-green scales and a flowing fin-crest from snout to tail. Its underbelly glows with bioluminescent blue. It inhabits deep ocean trenches and ascends to shallower water only to feed, drawing vast schools of fish upward with its bioluminescence." },

  176: { id:176, name:"Chromena",   emoji:"⚡", types:["Electric","Draconic"],
    base:{hp:68,atk:82,def:62,spa:117,spd:78,spe:113},
    learnset:[[1,"thunder_shock",[28,"wyrm_strike"]],[1,"dragon_breath"],[12,"thunderbolt"],[17,"harden"],[20,"dragon_claw"],[28,"thunder"],[30,"dynamo_whip"],[36,"dragon_pulse"],[42,"eon_crash"],[44,"outrage",[5,"thunder_wave"]],[3,"static_cage"],[33,"ion_cannon"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A dragon of lightning storms. Calls down thunder with each roar.",
    lore:"Chromena is a sleek electric-dragon 4 metres long with chrome-yellow and black scales that crackle with electrical charge. Its wing membranes are translucent yellow. It creates a continuous corona of electricity around its body while flying, visible at night as a moving chain of lightning." },

  177: { id:177, name:"Sapphier",emoji:"💠", types:["Ice","Draconic"],
    base:{hp:73,atk:96,def:79,spa:115,spd:100,spe:74},
    learnset:[[1,"powder_snow",[28,"scale_storm"]],[1,"dragon_breath"],[13,"ice_beam"],[21,"dragon_claw"],[24,"recover"],[29,"blizzard"],[37,"dragon_pulse"],[44,"cryo_lance"],[45,"outrage"],[53,"ice_punch",[5,"permafrost"]],[3,"winter_shroud"],[38,"glacial_tomb"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"A crystal dragon of ice. Its scales deflect nearly any attack.",
    lore:"Sapphier is a magnificent ice-dragon 6 metres long with deep sapphire-blue scales and a crest of crystal ice spines along its neck. Its underbelly is pale white. Its breath produces a stream of sub-zero air that flash-freezes anything within 20 metres. It sleeps buried under glacier ice for decades." },

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
    lore:"Velvetine is a sleek adult cat 35 cm at the shoulder — Fluffen's enormously fluffy cream-white kitten-fur has shed and smoothed into short, incredibly silk-shimmering dark-grey fur, and the tiny hidden kitten-face has emerged with pale gold eyes. It moves with total silence on any surface and is nearly impossible to sneak up on in return. It prefers warmth and high vantage points in settled areas." },

  180: { id:180, name:"Leapbun",     emoji:"🐰", types:["Normal"],
    base:{hp:43,atk:44,def:38,spa:38,spd:38,spe:78},
    learnset:[[1,"tackle",[20,"wild_tumble"]],[1,"tail_whip"],[8,"quick_attack"],[16,"headbutt"],[17,"recover"],[24,"body_slam",[5,"growl"]],[29,"harden"],[39,"vital_pulse"]],
    evolveTo:181, evolveLevel:18, catchRate:255, expYield:55, rarity:"common",
    desc:"A swift rabbit with huge ears. Can hear predators from far away.",
    lore:"Leapbun is a small rabbit 25 cm long with oversized hind legs and soft white-grey fur. Its long ears pivot independently in different directions. It can leap 3 metres horizontally from standing still. It lives in warrens on open plains and maintains elaborate underground tunnel networks as escape routes." },

  181: { id:181, name:"Racehare",  emoji:"🐇", types:["Normal"],
    base:{hp:88,atk:74,def:49,spa:71,spd:59,spe:117},
    learnset:[[1,"quick_attack"],[2,"headbutt"],[3,"tackle"],[4,"recover"],[5,"growl"],[18,"wild_tumble"],[21,"body_slam"],[27,"leer"],[36,"battle_cry"],[45,"swords_dance"],[54,"momentum_rush"],[63,"hyper_beam"],[6,"tail_whip"],[43,"scratch"]],
    evolveTo:null, evolveLevel:null, catchRate:100, expYield:165, rarity:"common",
    desc:"A super-quick bouncing rabbit. Few can outrun this energetic creature.",
    lore:"Racehare is a lean racing rabbit 45 cm long — Leapbun's soft white-grey fur has darkened to short brown across a compact aerodynamic body shape, and the oversized hind legs of the kit have lengthened into long muscular legs. Its ears lie flat when running rather than pivoting independently. It can sustain sprints of extraordinary speed for short distances and uses evasion rather than combat as its primary survival strategy." },

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
    lore:"Glutoros is a massive bear 1.8 metres at the shoulder — Rotunden's perfectly spherical russet-brown silhouette has elongated and grown upright into a broad rounded back with heavy russet-brown fur, and the autumn-gorging habit of its juvenile form has matured into an almost supernatural appetite. It has an almost supernatural appetite and can consume quantities of food that seem physically impossible. It is found in areas of extreme natural abundance and its presence indicates healthy ecosystem balance." },

  185: { id:185, name:"Hoverrow",   emoji:"🐦", types:["Normal","Wind"],
    base:{hp:60,atk:43,def:31,spa:54,spd:50,spe:64},
    learnset:[[1,"tackle",[22,"wild_tumble"]],[1,"gust"],[8,"quick_attack"],[14,"harden"],[16,"wing_attack"],[24,"air_slash"],[25,"vortex_trap"],[32,"body_slam",[5,"growl"]],[34,"instinct_slash"],[42,"skyfall"],[3,"tail_whip"],[33,"feral_swipe"]],
    evolveTo:186, evolveLevel:28, catchRate:180, expYield:72, rarity:"common",
    desc:"A pudgy bird that barely fits in trees. Better at fighting than flying.",
    lore:"Hoverrow is a small sparrow-like wind bird 15 cm long with pale cream feathers and a round body. It perpetually hovers 30 cm above surfaces rather than perching, even when sleeping. Its feet have atrophied from disuse. It navigates entirely by air current and maintains a mental map of all wind patterns in its territory. Hoverrow's atrophied feet make the rare necessary landings painful and clumsy, yet the bird shows no concern: its body seems to already understand that Continemic spends entire continents aloft without ever needing to perch." },

  187: { id:187, name:"Norindel",     emoji:"🐷", types:["Normal"],
    base:{hp:65,atk:66,def:62,spa:42,spd:44,spe:30},
    learnset:[[1,"tackle",[22,"momentum_rush"]],[1,"growl"],[10,"headbutt"],[14,"recover"],[20,"body_slam"],[24,"battle_cry"],[30,"swords_dance"],[33,"scratch"],[40,"hyper_beam",[5,"tail_whip"]],[42,"wild_tumble"],[3,"leer"],[32,"quick_attack"]],
    evolveTo:188, evolveLevel:30, catchRate:170, expYield:80, rarity:"common",
    desc:"A snuffling pig Lumori that loves digging for truffles. Stubborn and cute.",
    lore:"Norindel is a plump pink pig 40 cm at the shoulder with a curly tail and a perpetually contented expression. It roots in rich soil with its broad sensitive snout and locates buried tubers, truffles, and underground water sources with remarkable accuracy. Farmers prize it as a living divining rod." },

  // ===== ROCK =====
  191: { id:191, name:"Pebblet",   emoji:"🪨", types:["Earth"],
    base:{hp:60,atk:63,def:73,spa:46,spd:31,spe:45},
    learnset:[[1,"tackle",[22,"obsidian_crash"]],[1,"rock_throw"],[8,"harden"],[16,"headbutt"],[24,"rock_slide"],[29,"tail_whip"],[32,"stone_edge"],[40,"body_slam",[5,"granite_wall"]],[3,"petrify_gaze"],[31,"growl"]],
    evolveTo:192, evolveLevel:25, catchRate:160, expYield:88, rarity:"common",
    desc:"A rock creature shaped like a small pebble with tiny legs. Almost indistinguishable from an ordinary river stone when still.",
    lore:"Pebblet is a small rock creature 20 cm tall shaped like a round pebble with two tiny legs and a somewhat surprised-looking face embedded in the stone. It is almost indistinguishable from an ordinary river pebble when still. It lives in streambeds and rolls with the current when travelling. Pebblet cluster in tight streambank groupings that mimic natural rock outcroppings. From within each cluster, individuals occasionally rear briefly upright on their two tiny legs before tumbling back, rehearsing both the awkward humanoid stance and the geologist-fooling formation Boulderoll and Megalith will maintain together at much greater scale." },

  // LORE-AUDIT FLAG (Step 4): auto-collapsed to mono in Phase B — review for re-dual
  192: { id:192, name:"Boulderoll",emoji:"🪨", types:["Earth"],
    base:{hp:82,atk:108,def:112,spa:50,spd:57,spe:69},
    learnset:[[1,"rock_throw"],[2,"headbutt"],[3,"harden"],[4,"rock_slide"],[5,"granite_wall"],[29,"stone_edge"],[33,"tremor_stomp"],[37,"body_slam"],[41,"earth_power"],[49,"crystal_lance"],[57,"landslide"],[65,"earthquake"],[6,"petrify_gaze"],[44,"magnitude"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:222, rarity:"uncommon",
    desc:"A boulder hound encrusted with stones. Can cause landslides by running.",
    lore:"Boulderoll is a large rock-ground creature 1.5 metres tall shaped like a roughly humanoid boulder — Pebblet's round river-pebble silhouette has grown and squared into a rough humanoid shape, the small surprised face of its kit form barely defined now but still clearly present, and the current-rolling travel habit has matured into a rolling shift of its own mass overland. It moves by rolling and shifting its own mass. Groups of Boulderoll arrange themselves in formations that geologists initially mistake for natural rock outcroppings." },

  193: { id:193, name:"Rugothon",    emoji:"🦞", types:["Aquatic","Mineral"],
    base:{hp:71,atk:78,def:89,spa:52,spd:63,spe:68},
    learnset:[[1,"scratch",[25,"geode_burst"]],[1,"rock_throw"],[11,"water_gun"],[16,"swords_dance"],[19,"rock_slide"],[27,"aqua_tail"],[29,"sandstone_rush"],[35,"stone_edge"],[40,"sea_serpent_strike"],[43,"surf",[5,"granite_wall"]],[3,"petrify_gaze"],[33,"landslide"]],
    evolveTo:194, evolveLevel:38, catchRate:75, expYield:168, rarity:"uncommon",
    desc:"A crag claw crab that lives on rocky sea cliffs. Fiercely territorial.",
    lore:"Rugothon is a massive water-mineral crustacean 2 metres long with a heavily encrusted shell of barnacles and embedded pebbles. Its eight wide legs are each tipped with flat digging pads. It inhabits rocky coastlines where it is mistaken for a tide-pool feature until it suddenly moves. Rugothon spend long hours wedging themselves into rock crevices much smaller than their 2-metre bodies, packing their bulk inward. Older individuals also eat noticeably less in each successive moult cycle, then less again, slowly withdrawing into themselves. Both habits compound across generations into the smaller, denser rock-crab Lithomere becomes — the only Lumori evolution known to scale downward in size while gaining density." },

  195: { id:195, name:"Prismolith",  emoji:"💎", types:["Ice","Mineral"],
    base:{hp:70,atk:66,def:101,spa:77,spd:87,spe:38},
    learnset:[[1,"rock_throw",[25,"crystal_lance"]],[1,"powder_snow"],[3,"petrify_gaze"],[8,"mineral_focus"],[11,"stealth_rock"],[12,"harden"],[14,"crystal_veil"],[17,"swords_dance"],[20,"rock_slide"],[22,"mineral_heal"],[24,"glacial_lance"],[26,"crystal_spear"],[28,"ice_beam"],[30,"mineral_lattice"],[31,"stalactite_drop"],[33,"quarry_crush"],[34,"hail_storm"],[36,"stone_edge"],[38,"diamond_storm"],[40,"gem_scatter"],[43,"icicle_crash"],[44,"blizzard",[5,"granite_wall"]],[45,"power_gem"]],
    evolveTo:196, evolveLevel:40, catchRate:70, expYield:172, rarity:"uncommon",
    desc:"A crystal of ice and stone. Formed under tremendous pressure underground.",
    lore:"Prismolith is a faceted ice-mineral creature 80 cm tall shaped like a natural geode that has grown legs. Its body is a rough dark matrix on the outside, but gaps reveal brilliant purple amethyst crystals within. It moves very slowly and is prized by miners for the high-quality crystals it sheds during moulting. Each year a Prismolith moves more slowly than the last, and where it pauses too long its feet sink slightly into the frozen ground beneath: these are the first signs of the permafrost rooting Frigolith commits to fully." },

  // ===== BUG =====
  197: { id:197, name:"Photoworm",   emoji:"🐛", types:["Nature"],
    base:{hp:42,atk:30,def:35,spa:30,spd:30,spe:39},
    learnset:[[1,"tackle",[5,"silk_bind"]],[1,"string_shot"],[5,"bug_bite",[6,"chitin_guard"]],[13,"growl"],[20,"swords_dance"],[27,"scratch"],[34,"venom_drool"],[41,"mandible_crush"]],
    evolveTo:198, evolveLevel:7, catchRate:255, expYield:39, rarity:"common",
    desc:"A cute caterpillar. Harmless and curious, though it spins strong silk.",
    lore:"Photoworm is a small, worm-like bug creature 8 cm long with a pale green segmented body and a round head with two tiny antennae. It lives entirely underground in loose soil, aerating it as it tunnels. It photosynthesises weakly through thin translucent sections of its skin even below the surface." },

  198: { id:198, name:"Chrysalix",  emoji:"🫙", types:["Nature"],
    base:{hp:46,atk:30,def:58,spa:30,spd:30,spe:30},
    learnset:[[17,"harden"]],
    evolveTo:199, evolveLevel:10, catchRate:120, expYield:72, rarity:"common",
    desc:"A shimmering cocoon. Inside, something remarkable is taking shape.",
    lore:"Chrysalix is a pupating bug creature 12 cm long encased in a hard metallic-green chrysalis shell — Photoworm's pale-green segmented body has surfaced from its underground burrow and spun its weak-photosynthesis skin into the hardened metallic-green casing, the body within now completely liquefied in the process of transformation. The chrysalis vibrates at a frequency inaudible to humans but felt by nearby insects as a call to gather and guard the emerging adult." },

  199: { id:199, name:"Aeridaleth",emoji:"🦋", types:["Nature","Wind"],
    base:{hp:73,atk:39,def:53,spa:104,spd:85,spe:93},
    learnset:[[14,"leer"],[18,"string_shot"],[22,"gust"],[26,"scratch"],[30,"silk_bind"],[34,"sonic_buzz"],[38,"air_slash"],[42,"dazzling_gleam"],[46,"x_scissor"],[50,"bug_buzz"],[54,"stinger_volley"],[58,"hurricane"],[3,"chitin_guard"],[39,"cocoon_burst"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:170, rarity:"uncommon",
    desc:"A glorious butterfly of wind and beauty. Its wing patterns mesmerize foes.",
    lore:"Aeridaleth is a large butterfly 60 cm wingspan with wings displaying intricate patterns in deep teal, gold, and black. It emerged from Chrysalix through a dramatic transformation. It undertakes migrations of thousands of kilometres, navigating by magnetic fields and producing a floral scent that persists in its wake for hours." },

  200: { id:200, name:"Iridibeetle",  emoji:"🪲", types:["Nature","Metal"],
    base:{hp:61,atk:73,def:71,spa:43,spd:51,spe:30},
    learnset:[[1,"bug_bite",[22,"mandible_crush"]],[1,"rock_throw"],[10,"headbutt"],[18,"x_scissor"],[20,"leer"],[26,"rock_slide"],[34,"stone_edge",[5,"string_shot"]],[36,"swarm_dive"],[3,"chitin_guard"],[31,"magma_rock"]],
    evolveTo:201, evolveLevel:25, catchRate:130, expYield:95, rarity:"common",
    desc:"A heavily armored beetle. Its rock-hard shell is practically indestructible.",
    lore:"Iridibeetle is a beetle 12 cm long with a hard iridescent wing-case that shifts between emerald and sapphire depending on viewing angle. Its underside is pale gold. It lives in old-growth forest canopy and cuts precise circular holes in leaves that it then rolls into tubes for egg-laying." },

  201: { id:201, name:"Scarabion",  emoji:"🪲", types:["Nature","Metal"],
    base:{hp:88,atk:124,def:94,spa:64,spd:69,spe:46},
    learnset:[[1,"x_scissor"],[2,"string_shot"],[25,"rock_slide"],[30,"harden"],[31,"stone_edge"],[33,"swarm_dive"],[35,"pheromone_rush"],[40,"flash_cannon"],[45,"bug_buzz"],[50,"stinger_volley"],[55,"iron_tail"],[60,"hyper_beam"],[3,"chitin_guard"],[39,"cocoon_burst"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A steel beetle of terrifying might. Its mandibles can cut through iron.",
    lore:"Scarabion is a large scarab beetle 20 cm long — Iridibeetle's iridescent emerald-sapphire wing-case has darkened and metallised into a copper-gold carapace etched with natural hieroglyphic-like patterns. Its wide horns are used to roll large balls of compressed organic material that it buries as food caches. Ancient cultures venerated it as a symbol of renewal and persistence." },


  // ===== BATCH 1: POISON/DRAGON, ELECTRIC, FIRE/ICE (IDs 206-214) =====

  // 3-stage Poison/Draconic chain: Venomscale → Toxidrak → Dragovenom
  206: { id:206, name:"Venomscale", emoji:"🐍", types:["Poison","Draconic"],
    base:{hp:50,atk:62,def:50,spa:68,spd:52,spe:65},
    learnset:[[1,"poison_sting"],[1,"dragon_breath"],[12,"sludge_bomb"],[22,"dragon_claw"],[32,"toxic"],[42,"dragon_pulse"],[52,"venom_lance"],[62,"hyper_beam"]],
    evolveTo:207, evolveLevel:26, catchRate:180, expYield:72, rarity:"common",
    desc:"A small serpent whose venom has a faint draconic energy. Its fangs drip with corrosive toxin.",
    lore:"Venomscale is a small dragon-serpent 40 cm long with vivid green scales overlaid with yellow warning banding. Its fangs are visibly elongated and hollow. It inhabits tropical jungle undergrowth and hunts by striking from concealment, relying on venom rather than constriction to subdue prey." },

  207: { id:207, name:"Venodrak", emoji:"🐉", types:["Poison","Draconic"],
    base:{hp:75,atk:90,def:68,spa:98,spd:72,spe:80},
    learnset:[[1,"sludge_bomb"],[1,"dragon_claw"],[20,"toxic"],[28,"dragon_pulse"],[36,"venom_lance"],[44,"outrage"],[52,"sludge_wave"],[60,"hyper_beam"]],
    evolveTo:208, evolveLevel:46, catchRate:90, expYield:148, rarity:"uncommon",
    desc:"A dragon-serpent that breathes venomous mist. Its flight path traces poisonous trails through the sky.",
    lore:"Venodrak is a dragon-serpent 1.5 metres long — Venomscale's vivid green scales have darkened to purple-black, and the yellow warning banding has deepened to a sickly yellow as the venom-load it carries has matured. Its narrow wings allow limited gliding between trees. It hunts from the forest canopy, dropping onto prey below and injecting a fast-acting paralytic venom before taking flight again." },

  208: { id:208, name:"Wyrmvenom", emoji:"🐲", types:["Poison","Draconic"],
    base:{hp:88,atk:105,def:80,spa:114,spd:87,spe:76},
    learnset:[[1,"venom_lance"],[1,"outrage"],[30,"sludge_wave"],[38,"dragon_pulse"],[46,"dragon_dance"],[54,"corrosion_fang"],[62,"ancient_breath"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:28, expYield:262, rarity:"rare",
    desc:"A venomous wyvern of terrible power. Its mere presence poisons the ground for miles around.",
    lore:"Wyrmvenom is a massive venomous dragon 5 metres long — Venodrak's purple-black scales have shifted to deep olive-green marked in yellow-orange bands, and the narrow gliding wings of its juvenile form have grown into a full 7-metre wingspan. Its venom glands are the largest of any known creature, producing a cocktail that dissolves organic tissue rapidly. It is feared across tropical regions." },

  // 2-stage Normal/Electric chain: Boltfur → Thundermane (level 30)
  209: { id:209, name:"Boltfur", emoji:"🐇", types:["Normal","Electric"],
    base:{hp:58,atk:52,def:48,spa:65,spd:58,spe:88},
    learnset:[[1,"thunder_shock"],[1,"tackle"],[12,"spark"],[22,"thunderbolt"],[32,"discharge"],[42,"volt_surge"],[52,"ball_lightning"],[60,"hyper_beam"]],
    evolveTo:210, evolveLevel:30, catchRate:155, expYield:82, rarity:"common",
    desc:"A rabbit-like creature whose fur stands permanently on end from static electricity. Leaves sparks wherever it hops.",
    lore:"Boltfur is a small normal-electric rabbit 20 cm long with yellow-white fur that stands permanently on end, giving it a spiky silhouette. Its long ears act as static accumulators. In dry weather its fur produces visible sparks with every movement. It communicates with other Boltfur by controlled static discharge patterns." },

  210: { id:210, name:"Thundermane", emoji:"🐰", types:["Normal","Electric"],
    base:{hp:89,atk:85,def:75,spa:105,spd:87,spe:109},
    learnset:[[1,"thunderbolt"],[1,"body_slam"],[24,"discharge"],[32,"volt_surge"],[40,"thunder"],[48,"ball_lightning"],[56,"plasma_strike"],[64,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:42, expYield:222, rarity:"uncommon",
    desc:"A colossal storm-hare with a crackling lightning-mane around its long ears. Bounds the open savannah at thunder-cracking speeds, marking territory with rolling claps.",
    lore:"Thundermane is a giant maned hare 1.2 metres at the shoulder when seated and easily 1.8 metres long when stretched. Its powerful hind legs and lithe tawny body still read as lagomorph at a glance, but Boltfur's spiky juvenile fur has thickened into a stiff mane of yellow-white fur — perpetually crackling with arcs of static lightning — that flares around its long upright ears and down the back of its neck like a lion's. It rules open savannahs by hopping rather than stalking, covering thirty metres in a single bound and discharging the built-up charge of each landing back into the earth. Its territorial calls are not roars but rolling thunderclaps produced by mane-flares strong enough to be heard kilometres away." },

  // 3-stage Fire/Ice chain: Cinderfrost → Glaciblaze → Pyroglacier
  211: { id:211, name:"Cinderfrost", emoji:"🔥", types:["Fire","Ice"],
    base:{hp:48,atk:58,def:45,spa:72,spd:55,spe:68},
    learnset:[[1,"ember"],[1,"powder_snow"],[12,"flamethrower"],[22,"ice_beam"],[32,"fire_blast"],[42,"blizzard"],[52,"solar_flare"],[62,"hyper_beam"]],
    evolveTo:212, evolveLevel:28, catchRate:175, expYield:72, rarity:"common",
    desc:"A creature born where volcanic vents meet glacial ice. Its body perpetually cycles between fire and frost.",
    lore:"Cinderfrost is a small fire-ice creature 40 cm long resembling a lizard with the left half of its body covered in warm orange fire-scales and the right half in cold blue ice-scales. A visible boundary of crackling energy runs down its midline. Where its two natures meet, brief steam eruptions occur. In deep sleep, the steam eruptions along a Cinderfrost's midline grow louder and more frequent: distant echoes of the permanent crackling steam-storm Infriglace hosts between its halves at colossal scale." },

  212: { id:212, name:"Frostscorch", emoji:"🌡️", types:["Fire","Ice"],
    base:{hp:74,atk:82,def:68,spa:108,spd:88,spe:88},
    learnset:[[1,"flamethrower"],[1,"ice_beam"],[22,"fire_blast"],[30,"blizzard"],[38,"frost_breath"],[46,"solar_flare"],[54,"glacial_tomb"],[62,"hyper_beam"]],
    evolveTo:213, evolveLevel:46, catchRate:88, expYield:155, rarity:"uncommon",
    desc:"A dual-natured creature of perfect thermal balance. Its left side blazes while its right side freezes.",
    lore:"Frostscorch is a medium fire-ice creature 80 cm long — Cinderfrost's orange-and-blue lizard halves have intensified into a perfectly equal split, one half brilliant crimson and one half ice-blue, and the crackling midline-boundary has matured into mismatched eyes (one amber, one pale blue) anchoring either side of its dual nature. It inhabits the specific boundary zones between volcanic and glacial terrain, the only creature perfectly adapted for that harsh transition." },

  213: { id:213, name:"Infriglace", emoji:"🌋", types:["Fire","Ice"],
    base:{hp:89,atk:93,def:81,spa:120,spd:95,spe:72},
    learnset:[[1,"fire_blast"],[1,"blizzard"],[32,"solar_flare"],[40,"glacial_tomb"],[48,"heat_wave"],[56,"icicle_crash"],[64,"caldera_meltdown"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:268, rarity:"rare",
    desc:"A cataclysmic being that collapses the boundary between fire and ice. Superheated geysers and flash-freezes occur in its wake.",
    lore:"Infriglace is a colossal fire-ice titan 3 metres long — Frostscorch's crimson and ice-blue halves have intensified into volcanic orange-red and never-melting glacial ice, and the brief steam eruptions of its juvenile midline have grown into a permanent crackling storm between the two sides. The boundary between its natures is a permanent crackling storm of steam. Its very presence disrupts local climate in a radius of several kilometres." },

  // Standalone Aquatic/Rock: Coralstone
  214: { id:214, name:"Petrwave", emoji:"🪸", types:["Aquatic","Earth"],
    base:{hp:101,atk:96,def:117,spa:83,spd:99,spe:54},
    learnset:[[1,"water_gun"],[1,"rock_throw"],[18,"surf"],[28,"stone_edge"],[38,"hydro_pump"],[48,"rock_slide"],[58,"bedrock_slam"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:48, expYield:212, rarity:"uncommon",
    desc:"A living coral fortress. Anchors itself to seafloor rocks and grows for centuries, becoming near-indestructible.",
    lore:"Petrwave is a 1.5-metre coral fortress creature resembling a crab whose shell is built from a mass of densely packed living coral and rock. Its four broad legs anchor it to seafloor rock. It filters nutrients from strong ocean currents and its shell provides habitat for thousands of small marine organisms." },

  // ===== BATCH 1: PSYCHIC/DARK TYPES (IDs 215-221) =====

  // 3-stage Spectral/Mental chain: Spiritch → Phantorge → Spectraith
  215: { id:215, name:"Veilwisp", emoji:"🌀", types:["Mental"],
    base:{hp:40,atk:42,def:30,spa:68,spd:52,spe:72},
    learnset:[[1,"confusion"],[1,"psybeam"],[12,"calm_mind"],[20,"psychic_move"],[28,"moonblast"],[36,"psystrike"],[44,"neural_storm"],[52,"astral_rend"]],
    evolveTo:216, evolveLevel:26, catchRate:175, expYield:68, rarity:"common",
    desc:"A wisp of pure psychic energy. Drifts through reality reading the thoughts of every living thing nearby.",
    lore:"Veilwisp is a floating psychic orb 20 cm across made of condensed translucent violet energy. Its form shifts between a perfect sphere and a wispy irregularity as its thoughts wander. It drifts through solid objects as if they do not exist and leaves a brief afterimage wherever it passes. With age a Veilwisp spends longer and longer stretches in its irregular wispy state, shorter intervals as a perfect sphere. This gradual self-dissolution is the body easing toward the bodiless distortion Distorsion eventually sustains." },

  216: { id:216, name:"Mindrift", emoji:"🌫️", types:["Mental"],
    base:{hp:65,atk:65,def:52,spa:102,spd:80,spe:88},
    learnset:[[1,"psybeam"],[1,"calm_mind"],[20,"psychic_move"],[28,"moonblast"],[36,"psystrike"],[44,"neural_storm"],[52,"astral_rend"],[60,"hyper_beam"]],
    evolveTo:217, evolveLevel:44, catchRate:90, expYield:145, rarity:"uncommon",
    desc:"A drifting psychic entity that bridges the conscious and unconscious mind. Its form shifts like fog.",
    lore:"Mindrift is a larger psychic entity 40 cm across — Veilwisp's condensed violet sphere has dispersed and lightened into a body like a slowly rotating galaxy of blue-white light particles, and its wandering wisp-form has matured into a state where no fixed centre is visible: the entity is simultaneously everywhere within itself. It is drawn to sleeping creatures and hovers above their heads to sample their dream-states." },

  217: { id:217, name:"Distorsion", emoji:"🔮", types:["Mental"],
    base:{hp:82,atk:70,def:67,spa:132,spd:106,spe:93},
    learnset:[[1,"psychic_move"],[1,"moonblast"],[30,"psystrike"],[38,"neural_storm"],[46,"astral_rend"],[54,"psybeam"],[62,"calm_mind"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A vast psychic intelligence that defies physical form. Peers into the deepest layers of consciousness.",
    lore:"Distorsion is a vast psychic intelligence that lacks a physical body — Mindrift's slowly-rotating particle-galaxy has dispersed entirely, leaving only a shimmering distortion in the air roughly 1 metre across. Nearby objects float slightly and light bends toward it. It exists primarily in a mental dimension and its physical manifestation is merely an accidental side-effect." },

  // 2-stage Spectral/Dark chain: Mistwraith → Shademont (item evo: Dusk Stone)
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
    lore:"Nightmont is a massive dark creature 3 metres tall — Duskmist's small shadow-patch has condensed and grown vertical into the silhouette of a perfectly black mountain. Its form is absolute darkness with only two dim red pinpoints for eyes. The shadow it casts in artificial light has no clear edges, as if the shadow itself is also alive. It moves only when unobserved." },

  // 2-stage Dark/Vapor chain: Umbrajest → Shadowveil (level 34)
  220: { id:220, name:"Umbrajest", emoji:"🎭", types:["Dark","Vapor"],
    base:{hp:62,atk:58,def:55,spa:78,spd:62,spe:82},
    learnset:[[1,"bite"],[1,"confusion"],[5,"vapor_jab"],[8,"drizzle"],[10,"mist_s"],[12,"dark_pulse"],[14,"mist_strike"],[16,"fog_beam"],[20,"fog_kick"],[22,"psybeam"],[24,"vapor_focus"],[28,"mist_pulse"],[32,"night_slash"],[42,"psychic_move"],[52,"eclipse_shroud"],[60,"hyper_beam"]],
    evolveTo:221, evolveLevel:34, catchRate:145, expYield:92, rarity:"common",
    desc:"A trickster in a dark jester's mask. Uses vaporous illusions and dark energy to confuse and terrify.",
    lore:"Umbrajest is a dark-vapor trickster creature 60 cm tall with a wispy smoke-black body and a permanent wide grin formed by luminescent patches. Its eyes are bright and mischievous. It delights in rearranging objects in darkened rooms and projecting images of feared things into the peripheral vision of passers-by." },



  // ===== BATCH 2: GHOST/PSYCHIC/DRAGON (IDs 221-235) =====

  // Shadowveil (evolves from Umbrajest 220)
  221: { id:221, name:"Shadowveil", emoji:"🎪", types:["Dark","Vapor"],
    base:{hp:91,atk:84,def:78,spa:109,spd:91,spe:97},
    learnset:[[1,"dark_pulse"],[1,"psychic_move"],[12,"fog_kick"],[16,"mist_s"],[20,"mist_pulse"],[22,"cloud_form"],[26,"night_slash"],[28,"mist_lash"],[34,"eclipse_shroud"],[36,"fog_storm"],[40,"abyssal_mist"],[42,"soul_rend"],[50,"dread_howl"],[54,"mist_veil"],[58,"moonblast"],[66,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:220, rarity:"uncommon",
    desc:"A master of dark illusions. Those who witness its act lose themselves in vaporous nightmares for days.",
    lore:"Shadowveil is a dark-vapor creature 90 cm tall resembling a tall humanoid draped in a cloak of living shadow — Umbrajest's wispy smoke-body has solidified into a cloaked humanoid form. Its face is blank except for two silver eyes. It is impossible to touch directly — hands pass through its shadow-substance — but it can interact physically by will. It observes from darkened doorways." },

  // 3-stage Mental chain: Mindpuff → Cerebrix → Psytheon
  222: { id:222, name:"Mindpuff", emoji:"🫧", types:["Mental"],
    base:{hp:42,atk:35,def:38,spa:70,spd:58,spe:65},
    learnset:[[1,"confusion"],[1,"psybeam"],[10,"calm_mind"],[20,"psychic_move"],[30,"moonblast"],[40,"psystrike"],[50,"neural_storm"],[60,"hyper_beam"]],
    evolveTo:223, evolveLevel:24, catchRate:190, expYield:65, rarity:"common",
    desc:"A floating blob of pure thought-energy. Its mood is contagious to nearby Lumori.",
    lore:"Mindpuff is a small psychic creature 20 cm across resembling a round cloud-puff of blue-silver light with two bright eyes. It bounces gently in the air and broadcasts simple emotions outward in waves — contentment, curiosity, mild alarm. It is drawn to calm environments and distressed by conflict. The simple emotion-waves a young Mindpuff broadcasts (contentment, curiosity, mild alarm) slowly structure themselves into proto-thoughts and brief impressions of language across the creature's life, a slow shaping toward the sapient cognition Recallum fully possesses." },

  223: { id:223, name:"Recallum", emoji:"🧠", types:["Mental"],
    base:{hp:64,atk:52,def:58,spa:105,spd:88,spe:82},
    learnset:[[1,"psybeam"],[1,"calm_mind"],[18,"psychic_move"],[28,"moonblast"],[38,"psystrike"],[48,"neural_storm"],[56,"astral_rend"],[64,"hyper_beam"]],
    evolveTo:224, evolveLevel:42, catchRate:90, expYield:145, rarity:"uncommon",
    desc:"An evolved brain-creature with exponential intelligence. Solves complex equations for fun.",
    lore:"Recallum is a medium psychic creature 50 cm tall — Mindpuff's round cloud-puff body has condensed into a smooth ovoid of pale blue-violet, and the simple emotion-broadcasts of its juvenile form have grown into a large visible cranium through which psychic energy now pulses rhythmically. Its four thin limbs first manifest as condensed psychic energy and only later harden into matter, ending in long sensitive fingers. It can scan a mind in seconds and retains perfect recall of all information it encounters." },

  224: { id:224, name:"Psytheon", emoji:"🔮", types:["Mental","Fairy"],
    base:{hp:82,atk:63,def:74,spa:131,spd:112,spe:88},
    learnset:[[1,"psychic_move"],[1,"moonblast"],[32,"psystrike"],[40,"neural_storm"],[48,"astral_rend"],[56,"dazzling_gleam"],[64,"celestial_wave"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:265, rarity:"rare",
    desc:"The apex psychic being. Its thoughts reshape reality in its immediate vicinity.",
    lore:"Psytheon is a graceful psychic-fairy creature 70 cm tall — Recallum's ovoid body has stretched into a humanoid with its prominent cranium preserved as an oversized head, and the four condensed-energy limbs have crystallised into delicate crystal wings above a torso of pale lavender trimmed in gold. It exudes a field of concentrated wonder that makes nearby creatures briefly lose track of their fears. Artists claim it inspires creativity." },

  // Standalone Fairy/Mineral: Crealight
  225: { id:225, name:"Crealight", emoji:"✨", types:["Fairy","Mineral"],
    base:{hp:82,atk:60,def:72,spa:115,spd:105,spe:88},
    learnset:[[1,"fairy_wind"],[1,"confusion"],[15,"dazzling_gleam"],[20,"crystal_glow"],[25,"moonblast"],[30,"mineral_pulse"],[35,"psybeam"],[40,"quartz_blast"],[45,"psychic_move"],[50,"power_gem"],[55,"celestial_wave"],[65,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:210, rarity:"uncommon",
    desc:"A crystalline fairy of pure prismatic energy. Its body refracts light into impossible colors.",
    lore:"Crealight is a small fairy-mineral creature 30 cm tall with a rounded glowing crystal body of warm pink-gold light. It leaves a trail of glimmer-dust wherever it floats. It inhabits libraries, art studios, and places of quiet human creativity, feeding on the ambient creative energy generated there." },

  // Split evolution family: Prismoo → 3 forms via stones
  // Spectroo (base, Normal/Mental) → Prismace (Fire Stone), Prismoon (Moon Stone), Prismolt (Thunder Stone)
  226: { id:226, name:"Spectroo", emoji:"🌈", types:["Normal","Mental"],
    base:{hp:60,atk:55,def:55,spa:68,spd:60,spe:62},
    learnset:[[1,"tackle"],[1,"confusion"],[14,"psybeam"],[22,"fairy_wind"],[30,"moonblast"],[40,"psychic_move"],[50,"hyper_beam"]],
    evolveTo:227, evolveLevel:null, evolveItem:"fireStone", evolveMethod:"item", catchRate:140, expYield:88, rarity:"common",
    desc:"A prism-shaped creature full of untapped potential. Exposure to different energies changes its form entirely.",
    lore:"Spectroo is a normal-psychic creature 40 cm long resembling a kangaroo made of translucent white light. Its pouch holds concentrated psychic energy. It hops through open fields and its presence makes detailed hallucinations of past events visible in the area — a form of psychic archaeology. Spectroo cradle their psychic-pouch with their forelimbs whenever they pause, instinctively shielding something not yet ready to manifest. By adolescence, individuals from the same litter develop diverging sleeping postures: some tuck toward warmth, others face the moon, others curl around the pouch like a battery, others spread under prismatic light. All become unusually attentive in the presence of evolution-stones at distances where other Lumori show no awareness — four temperaments for the four stone-bound paths the lineage may take, with individuals eventually crystallising into Spectrace, Lunaroon, Radiafish, or Spectravore." },

  // Spectrace: Fire Stone evolution (Fire/Mental)
  227: { id:227, name:"Spectrace", emoji:"🔥", types:["Fire","Mental"],
    base:{hp:78,atk:95,def:65,spa:118,spd:72,spe:92},
    learnset:[[1,"flamethrower"],[1,"psychic_move"],[28,"fire_blast"],[36,"psystrike"],[44,"astral_rend"],[52,"solar_flare"],[60,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:225, rarity:"rare",
    desc:"A blazing prism warrior. Its psychic fire burns away illusions and exposes hidden truths.",
    lore:"Spectrace is a fire-psychic creature 50 cm long — Spectroo's translucent white-light kangaroo silhouette has ignited under firestone touch into streaking flame, hindquarters trailing off into fire and forelimbs barely visible through the heat-haze. Its body is heat and psychic energy intertwined. It moves so rapidly its form appears as a blurred streak. Ancient texts describe it arriving at prophetic moments as an omen of transformation." },

  // Spectroon: Moon Stone evolution (Ice/Mental)
  228: { id:228, name:"Lunaroon", emoji:"🌙", types:["Nature","Mental"],
    base:{hp:82,atk:72,def:88,spa:122,spd:108,spe:78},
    learnset:[[1,"energy_ball"],[1,"psychic_move"],[28,"petal_blitz"],[36,"psystrike"],[44,"astral_rend"],[52,"spore_burst"],[60,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:225, rarity:"rare",
    desc:"A moonlit kangaroo whose body grows night-blooming silver flora. Its presence opens blossoms across highland clearings wherever it pads.",
    lore:"Lunaroon is a 50-centimetre marsupial — Spectroo's translucent white-light kangaroo silhouette has been moonStone-touched into a form of compressed moonlight overgrown with night-blooming silver flora — pale violet-blue moss covers its hindquarters and a crown of small white-and-silver flowers blooms across its head and shoulders, opening only when full moonlight touches them. Its pouch holds a soft glow that draws moonlight downward in a faint cascade onto the soil it crosses, and dormant seeds sprout in its wake. It inhabits high open plateaux and roams quietly during clear nights, mapping the positions of stars by psychic observation while leaving a trail of newly-opened blossoms wherever it pauses." },

  // Prismolt: Thunder Stone evolution (Electric/Mental)
  229: { id:229, name:"Radiafish", emoji:"⚡", types:["Electric","Mental"],
    base:{hp:72,atk:88,def:62,spa:130,spd:78,spe:110},
    learnset:[[1,"thunderbolt"],[1,"psychic_move"],[28,"thunder"],[36,"psystrike"],[44,"astral_rend"],[52,"discharge"],[60,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:225, rarity:"rare",
    desc:"A kangaroo-silhouette of crackling electric plasma. It bounds across high mountain ridges in arcing leaps that briefly carry it through the air on bursts of electrical thrust.",
    lore:"Radiafish is a 40-centimetre electric-psychic creature whose body is Spectroo's translucent kangaroo-silhouette ignited under thunderStone exposure into constantly cycling electric plasma — pale yellow at the core, shifting through blue-white at its outer layers, with the pouch and hindquarters most visible when it pauses between leaps. It bounds across high mountain ridges and along power-line corridors in long arcing jumps that briefly carry it through the air on bursts of electrical thrust. It surfaces near radio towers and electrical masts to feed on broadcast radiation, and its psychic field translates surrounding electrical activity into thought-impulses at lightning speed." },

  // ===== DRAGON TYPES (IDs 230-235) =====

  // 2-stage Draconic chain: Scaleling → Wyvaxis
  230: { id:230, name:"Scaleling", emoji:"🐲", types:["Draconic"],
    base:{hp:58,atk:72,def:62,spa:60,spd:55,spe:58},
    learnset:[[1,"tackle"],[1,"dragon_breath"],[16,"dragon_claw"],[26,"dragon_pulse"],[36,"dragon_dance"],[46,"outrage"],[56,"hyper_beam"]],
    evolveTo:231, evolveLevel:36, catchRate:150, expYield:90, rarity:"common",
    desc:"A young river drake with scales that shimmer like gemstones. Fierce despite its small size.",
    lore:"Scaleling is a tiny dragon hatchling 15 cm long with shiny copper-red scales and an oversized head. Its wings are crumpled against its body and not yet functional. It inhabits rocky outcroppings and practises flight by jumping from increasingly high ledges, rarely succeeding but never deterred. Its scales redden when basking but darken to aqua-blue once it learns to swim." },

  231: { id:231, name:"Wyvaxis", emoji:"🐲", types:["Draconic","Aquatic"],
    base:{hp:91,atk:109,def:84,spa:94,spd:78,spe:94},
    learnset:[[1,"dragon_claw"],[1,"surf"],[30,"dragon_pulse"],[38,"dragon_dance"],[46,"hydro_pump"],[54,"outrage"],[62,"ancient_breath"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A river drake that has mastered both land and water. Controls currents with its dragon energy.",
    lore:"Wyvaxis is a water-dragon 2 metres long — Scaleling's copper-red basking-scales have fully darkened to streamlined aqua-blue and emerald, and a broad flat tail has emerged optimised for powerful swimming strokes. It is more fish than lizard in movement, rarely leaving water except to bask on rocks. Its wings are vestigial fins that aid steering underwater." },

  // 3-stage Draconic/Ground chain: Draxon → Serpenthorn → Wyvernak
  232: { id:232, name:"Serphaxon", emoji:"🐲", types:["Draconic"],
    base:{hp:52,atk:68,def:65,spa:45,spd:50,spe:55},
    learnset:[[1,"tackle"],[1,"mud_shot"],[14,"dragon_breath"],[24,"earthquake"],[34,"dragon_claw"],[44,"dragon_pulse"],[54,"outrage"],[64,"hyper_beam"]],
    evolveTo:233, evolveLevel:32, catchRate:160, expYield:82, rarity:"common",
    desc:"A ground-burrowing young dragon. Its thick hide absorbs punishment like bedrock.",
    lore:"Serphaxon is a dragon 2.5 metres long with earthy brown-bronze scales and four short powerful legs. Its blunt snout and heavy claws make it a capable excavator. It digs extensive underground lairs in rocky hillsides and uses its weight to collapse cave ceilings onto trespassers." },

  233: { id:233, name:"Serpenthorn", emoji:"🐍", types:["Draconic","Earth"],
    base:{hp:78,atk:98,def:90,spa:65,spd:72,spe:68},
    learnset:[[1,"dragon_claw"],[1,"earthquake"],[26,"earth_power"],[34,"dragon_pulse"],[42,"dragon_dance"],[50,"outrage"],[58,"bedrock_slam"],[66,"hyper_beam"]],
    evolveTo:234, evolveLevel:52, catchRate:75, expYield:165, rarity:"uncommon",
    desc:"A horned serpent that tunnels through mountain roots. Its charge creates fissures in bedrock.",
    lore:"Serpenthorn is a long-bodied four-legged ground-dragon 3 metres long — Serphaxon's earthy brown-bronze scales have thickened to rust-brown and its blunt-snout digger frame has elongated into a body that drags its belly low, almost serpentine in motion, with numerous backward-curved spines now lining its back. Its short legs fold tightly against its body when it rolls along rocky terrain, using its spine-ring as a natural wheel. It inhabits ravine systems and is capable of reaching high speed on smooth stone surfaces." },

  234: { id:234, name:"Wyvernak", emoji:"🐉", types:["Draconic","Earth"],
    base:{hp:100,atk:125,def:104,spa:72,spd:83,spe:66},
    learnset:[[1,"outrage"],[1,"earthquake"],[36,"dragon_dance"],[44,"earth_power"],[52,"dragon_pulse"],[60,"bedrock_slam"],[68,"ancient_breath"],[76,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:20, expYield:275, rarity:"rare",
    desc:"An ancient wyvern that has merged with the earth. Mountain ranges shift when it stirs in its sleep.",
    lore:"Wyvernak is a large ground-dragon 4 metres long — Serpenthorn's rust-brown scales have weathered to broad grey-green plates, and the backward-curved spine-row of its juvenile form has consolidated into a single crest of stone spines crowning its skull. Its wings generate dust-clouds when spread. It inhabits canyon systems where it ambushes prey by dropping from cliff ledges and pinning targets under its considerable weight before delivering a killing bite." },

  // Standalone Draconic/Aquatic: Glintscale
  235: { id:235, name:"Glintscale", emoji:"🐟", types:["Draconic","Aquatic"],
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

  237: { id:237, name:"Icevault", emoji:"❄️", types:["Ice","Earth"],
    base:{hp:92,atk:102,def:112,spa:78,spd:88,spe:48},
    learnset:[[1,"ice_beam"],[1,"rock_slide"],[24,"blizzard"],[32,"stone_edge"],[40,"cryo_lance"],[48,"icicle_crash"],[56,"avalanche_drive"],[64,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:215, rarity:"uncommon",
    desc:"A glacier golem of living ice and stone. So cold that even fire moves slowly near it.",
    lore:"Icevault forms when a Frostick fuses with cave bedrock, its body lattice expanding into a tower-like silhouette of interlocked ice and stone 50 centimetres tall. Its walls are surprisingly thick. It inhabits glacier-topped mountains and creates elaborate ice-and-rock den structures that persist for centuries, providing shelter to generations of smaller creatures." },

  // 3-stage Ice/Wind chain: Snowble → Blizzavane → Permafrix
  238: { id:238, name:"Snowble", emoji:"☃️", types:["Ice"],
    base:{hp:44,atk:42,def:45,spa:65,spd:52,spe:68},
    learnset:[[1,"powder_snow"],[1,"tackle"],[10,"frost_breath"],[18,"cryo_lance"],[26,"ice_beam"],[36,"blizzard"],[46,"avalanche_drive"],[56,"hyper_beam"]],
    evolveTo:239, evolveLevel:28, catchRate:175, expYield:72, rarity:"common",
    desc:"A self-rolling snowball that grows larger with every tumble across fresh snow. Tiny dark coal-eyes peek from a perfectly round body, and faint bumps mark where stick-limbs will eventually emerge.",
    lore:"Snowble is a small Ice creature 20 centimetres across, shaped exactly like a perfectly round snowball with two small dark coal-eyes peeking from its surface. Beneath its smooth white shell, traces of stick-limbs and a small carrot-shaped nose are already forming — barely-visible bumps that will emerge when it grows large enough. It rolls effortlessly across snowfields, gathering more snow with every revolution, and groups of Snowble combine into single enormous boulders during heavy blizzards as they pack together for warmth. A few Snowble pause in deep shadow rather than rolling on, and their dense inner cores catch darkness more readily than fresh snow does — the first faint stir of the corruption Tundrafox eventually succumbs to during the long polar dark." },

  239: { id:239, name:"Blizzariel", emoji:"☃️", types:["Ice"],
    base:{hp:68,atk:62,def:65,spa:100,spd:82,spe:90},
    learnset:[[1,"icicle_crash"],[1,"ice_beam"],[12,"arctic_calm"],[18,"hail_barrage"],[22,"blizzard"],[30,"permafrost"],[38,"cryo_lance"],[46,"icicle_crash"],[54,"avalanche_drive"],[62,"hyper_beam"]],
    evolveTo:240, evolveLevel:44, catchRate:90, expYield:148, rarity:"uncommon",
    desc:"An adolescent snowman whose three packed-snow tiers have stacked vertically. Stick arms reach out from its midsection and a small dense crystal glows at its core.",
    lore:"Blizzariel is a 60-centimetre adolescent snowman — Snowble's perfectly-round juvenile body has stacked vertically into three growing tiers — a bottom for legs, a middle for the torso, and a top for the head. Its surface remains soft-white and constantly sheds and reforms its outer layer in the wind, but a small dense crystal of frozen wind-energy now glows visibly at its core, holding its body in shape against the elements. Two stick-arms reach out from its mid-section, a small carrot nose and three coal-buttons mark its face, and it walks slowly across snowfields on packed-snow legs, leaving prints that linger in the soft surface." },

  240: { id:240, name:"Tundrafox", emoji:"☃️", types:["Ice","Dark"],
    base:{hp:83,atk:77,def:80,spa:119,spd:99,spe:92},
    learnset:[[1,"blizzard"],[1,"dark_pulse"],[12,"arctic_calm"],[18,"aurora_blast"],[22,"blizzard_charge"],[26,"cryogenic_breath"],[30,"frostbite_strike"],[32,"cryo_lance"],[36,"glacial_lance"],[40,"icicle_crash"],[44,"ice_claw"],[48,"avalanche_drive"],[52,"ice_hammer"],[56,"glacial_tomb"],[60,"sheer_cold"],[64,"sleet_barrage"],[72,"night_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:28, expYield:265, rarity:"rare",
    desc:"A 3-metre malevolent snow-titan whose cheerful snowman frame has frozen into something cruel. Its hollow coal-eyes glint with predatory cold, and a permanent blizzard cloaks its approach.",
    lore:"Tundrafox is a colossal malevolent snow-titan 3 metres tall whose three stacked tiers form an unsettlingly cheerful silhouette of a great snowman — until you notice the wrongness. Its transformation begins when a Blizzariel grows large enough to weather the months-long polar dark months without melting; the small dense crystal of frozen wind-energy at its core cools past a threshold during the unbroken polar night and develops a malice of its own, an awareness shaped by sustained darkness and cold rather than warmth. Around this dark-frozen core the snowman's body grows dense with compressed glacier-air rather than ordinary snow, giving the surface a faint silver-blue tint and the density of stone-ice. Long branch-arms hang past its midsection, ending in twisted fingers tipped in needle-sharp shards. Its broad face bears a long crystalline carrot-nose curved like a tusk and four hollow coal-eyes whose centres glow faint violet — two original, two new ones opened by the corrupted core. It hunts by gliding its lower tier across the surface like a sled, leaving no trail; a permanent localised blizzard cloaks its approach, dropping the air temperature and silencing all sound for kilometres around. Northern hunters consider it a true terror — a creature that wears the joyful shape of a snowman to lower its prey's guard before striking." },

  // Standalone Ice/Crystal evolves in cold area: Crystalix
  241: { id:241, name:"Shardlix", emoji:"💠", types:["Ice","Mental"],
    base:{hp:78,atk:75,def:105,spa:115,spd:100,spe:72},
    learnset:[[1,"ice_beam"],[1,"psychic_move"],[20,"cryo_lance"],[30,"psybeam"],[40,"blizzard"],[50,"psystrike"],[60,"glacial_tomb"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"cosmic_cavern", evolveMethod:"location", catchRate:50, expYield:215, rarity:"uncommon",
    desc:"A crystal lattice of ice and psychic power. Forms only in caves where cosmic energy freezes space itself.",
    lore:"Shardlix is a psychic-ice creature 40 cm tall resembling a bipedal figure made entirely of precision-cut ice crystals fitted together without gaps. Its eyes are two flawless prismatic lenses. It transmits thoughts through vibrations in its crystalline body and can read psychic impressions left on ice surfaces." },

  // 2-stage Electric/Bug chain: Zappling → Voltrix (level 30)
  242: { id:242, name:"Pulseglow", emoji:"🐞", types:["Electric"],
    base:{hp:46,atk:55,def:42,spa:68,spd:50,spe:78},
    learnset:[[1,"thunder_shock"],[1,"bug_buzz"],[12,"spark"],[22,"thunderbolt"],[32,"discharge"],[42,"x_scissor"],[52,"thunder"],[60,"hyper_beam"]],
    evolveTo:243, evolveLevel:30, catchRate:170, expYield:75, rarity:"common",
    desc:"A firefly-like creature that stores electricity in its abdomen-light. Releases it when threatened.",
    lore:"Pulseglow is a tiny electric creature 5 cm long resembling a glowing firefly. Its abdomen pulses with yellow-white electric light at regular intervals. Huge swarms congregate in summer nights over open water, and the coordinated light patterns of the swarm are a complex form of collective communication." },

  243: { id:243, name:"Stuntrap", emoji:"🪲", types:["Electric","Nature"],
    base:{hp:72,atk:82,def:68,spa:110,spd:78,spe:98},
    learnset:[[1,"thunderbolt"],[1,"x_scissor"],[24,"discharge"],[32,"bug_buzz"],[40,"thunder"],[48,"volt_surge"],[56,"ball_lightning"],[64,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:215, rarity:"uncommon",
    desc:"An electrified beetle warrior. Its wing-cases generate static as it flies, creating lightning storms.",
    lore:"Stuntrap is a medium electric-bug 25 centimetres in wingspan that has moulted from Pulseglow's firefly carapace into an elongated dragonfly form, its abdominal light-organs migrating outward to become the electric-blue arcs along its translucent copper wings. It hunts by creating a small electrical trap in mid-air and herding smaller insects into it. It can deliver a precise shock from its tail that stuns prey without killing it." },

  // 3-stage Electric/Fighting chain: Staticlaw → Thundravex → Megavolt
  244: { id:244, name:"Staticlaw", emoji:"🦡", types:["Electric"],
    base:{hp:58,atk:68,def:52,spa:72,spd:55,spe:88},
    learnset:[[1,"thunder_shock"],[1,"spark"],[12,"thunderbolt"],[20,"discharge"],[30,"arc_flash"],[38,"ball_lightning"],[46,"thunder"],[54,"plasma_strike"]],
    evolveTo:245, evolveLevel:28, catchRate:160, expYield:80, rarity:"common",
    desc:"A small electric weasel-kit whose short fur permanently crackles with static. Runs in tight circles to build charge before discharging into the ground.",
    lore:"Staticlaw is a small electric weasel-kit 30 centimetres at the shoulder with short yellow-white fur that permanently crackles with static charge. Its claws generate small static shocks on contact with any surface. It is perpetually restless and accumulates electrical charge by running in tight circles, periodically discharging the built-up energy into the ground in flashes that startle larger creatures away." },

  245: { id:245, name:"Thundravex", emoji:"⚡", types:["Electric"],
    base:{hp:82,atk:90,def:72,spa:110,spd:80,spe:108},
    learnset:[[1,"thunderbolt"],[1,"discharge"],[22,"ball_lightning"],[30,"arc_flash"],[38,"thunder"],[46,"volt_surge"],[54,"plasma_strike"],[62,"hyper_beam"]],
    evolveTo:246, evolveLevel:48, catchRate:75, expYield:165, rarity:"uncommon",
    desc:"An adolescent thunder-weasel 60 centimetres at the shoulder. Its dorsal stripe glows when it accumulates static, and arcs jump constantly between its alert ears.",
    lore:"Thundravex is a 60-centimetre adolescent mustelid, longer-bodied and more muscular than its Staticlaw juvenile stage, with bright yellow fur and a dark dorsal stripe that runs from the back of its head to the tip of its sleek tail. Electrical arcs constantly jump between its alert pointed ears, and the dorsal stripe glows brighter when the static charge built up in its body approaches discharge. It emits a continuous 50 Hz hum audible up close, and inhabits open areas near tall trees it uses as earthing points to safely release accumulated charge." },

  246: { id:246, name:"Megavolt", emoji:"🦡", types:["Electric"],
    base:{hp:89,atk:93,def:76,spa:111,spd:80,spe:101},
    learnset:[[1,"thunder"],[1,"discharge"],[32,"ball_lightning"],[40,"plasma_strike"],[48,"arc_flash"],[56,"volt_surge"],[64,"overcharge"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:270, rarity:"rare",
    desc:"A massive thunder-wolverine 1 metre at the shoulder, fearless and apex among electric predators. Its collar of crackling coils announces its presence with audible static.",
    lore:"Megavolt is a massive thunder-wolverine 1 metre at the shoulder, the apex form of the Staticlaw→Thundravex lineage. Its body is heavily muscled with chrome-yellow fur and a thick collar of crackling electric coils running from the back of its neck down both shoulders, mistaken at distance for a felid mane. It is fearless to the point of recklessness, attacking creatures many times its size to defend its territory, and the visible electrical shockwave that accompanies its roar temporarily blinds and deafens those nearby. It is considered the apex electric predator of any region it claims." },

  // Standalone Electric/Bug: Sparkeen
  247: { id:247, name:"Sparkeen", emoji:"🦋", types:["Electric"],
    base:{hp:72,atk:68,def:65,spa:102,spd:88,spe:115},
    learnset:[[1,"thunderbolt"],[1,"bug_buzz"],[18,"discharge"],[28,"x_scissor"],[38,"thunder"],[48,"volt_surge"],[58,"ball_lightning"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:210, rarity:"uncommon",
    desc:"An electric butterfly that flickers between flower fields and storm clouds. Its wings spark with each flap.",
    lore:"Sparkeen is a small electric creature 10 cm across resembling a glowing green butterfly. Its wings generate a localised electric field that is pleasant to the touch at low intensity but painful if the creature is threatened. It inhabits electrical substations and inside lightning-rod structures." },

  // 3-stage Rock/Ground chain: Pebblard → Boulderax → Megalith
  248: { id:248, name:"Pebblard", emoji:"🪨", types:["Earth"],
    base:{hp:52,atk:60,def:72,spa:38,spd:52,spe:42},
    learnset:[[1,"rock_throw"],[1,"tackle"],[12,"rock_slide"],[22,"earth_power"],[32,"stone_edge"],[42,"earthquake"],[52,"bedrock_slam"],[60,"hyper_beam"]],
    evolveTo:249, evolveLevel:28, catchRate:175, expYield:72, rarity:"common",
    desc:"A living pebble with stubby limbs. Rolls into enemies to deal surprisingly heavy blows.",
    lore:"Pebblard is a small round rock creature 15 cm in diameter that is essentially a smooth river pebble with two tiny eyes. It camouflages perfectly among ordinary rocks. It communicates with others by clicking against nearby stone. Geologists have placed Pebblard specimens in their sample bags by mistake." },

  // LORE-AUDIT FLAG (Step 4): auto-collapsed to mono in Phase B — review for re-dual
  249: { id:249, name:"Boulderax", emoji:"⛰️", types:["Earth"],
    base:{hp:80,atk:95,def:108,spa:52,spd:70,spe:52},
    learnset:[[1,"rock_slide"],[1,"earth_power"],[22,"stone_edge"],[30,"earthquake"],[38,"bedrock_slam"],[46,"mud_shot"],[54,"clay_armor"],[62,"hyper_beam"]],
    evolveTo:250, evolveLevel:46, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A boulder-bodied titan that rolls through terrain like a wrecking ball. Nothing stops its charge.",
    lore:"Boulderax is a medium rock-ground creature 60 cm tall — Pebblard's smooth river-pebble silhouette has grown squat and boulder-shaped, sprouting thick arm-stubs and two flat feet, and the camouflage that once hid it among ordinary rocks now matches local geological formations at a much larger scale. It rolls itself into a perfect sphere for travel and unfurls only when it finds suitable terrain to defend." },

  // LORE-AUDIT FLAG (Step 4): auto-collapsed to mono in Phase B — review for re-dual
  250: { id:250, name:"Megalith", emoji:"🗿", types:["Earth"],
    base:{hp:110,atk:120,def:134,spa:55,spd:88,spe:43},
    learnset:[[1,"stone_edge"],[1,"earthquake"],[15,"rock_polish"],[20,"earthen_wall"],[25,"stone_axe"],[32,"bedrock_slam"],[35,"quake_pulse"],[40,"clay_armor"],[45,"rock_wrecker"],[48,"earth_power"],[50,"tectonic_wave"],[56,"rock_slide"],[60,"continental_shift"],[64,"worldseed_quake"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:20, expYield:280, rarity:"rare",
    desc:"An ancient monolith that walks. Archaeological markings on its body predate all known civilizations.",
    lore:"Megalith is a massive rock-ground creature 2 metres tall — Boulderax's squat boulder-frame has lengthened and straightened upward into an ancient standing stone with barely-defined features, and the sphere-rolling travel habit of its juvenile form has stilled into the motionless stillness that lets it stand for decades, often mistaken for a man-made monument. It can remain motionless for decades, and local legends often grow up around stationary Megalith mistaken for man-made monuments. It moves very rarely, only when its territory is significantly threatened." },



  // ===== BATCH 4: ROCK / WATER / GRASS / DARK (IDs 251-265) =====

  // 2-stage Rock/Metal chain: Crumblite → Stonegrip (Metal Coat item)
  251: { id:251, name:"Crumblite", emoji:"🪨", types:["Earth","Metal"],
    base:{hp:60,atk:75,def:85,spa:42,spd:60,spe:45},
    learnset:[[1,"rock_throw"],[1,"metal_claw"],[14,"rock_slide"],[24,"flash_cannon"],[34,"stone_edge"],[44,"iron_tail"],[54,"forge_strike"],[60,"hyper_beam"]],
    evolveTo:252, evolveLevel:null, evolveItem:"metalCoat", evolveMethod:"item", catchRate:140, expYield:98, rarity:"common",
    desc:"A ore-encrusted creature that upgrades itself by absorbing metallic minerals from cave walls.",
    lore:"Crumblite is an earth-metal creature 40 cm tall whose body appears to be crumbling stone held together by thin steel rebar-like structures growing through it. Chunks occasionally fall away and are immediately replaced by new growth. It inhabits construction sites and ruined architecture, instinctively reinforcing damaged structures. A Crumblite constantly loses and regrows chunks of its crumbling stone-body, but each replaced piece sets slightly more permanently than the last. This gradual stabilisation is the slow approach toward the bolted-steel-plate compactness Stonegrip exhibits once metalCoat fully reinforces it." },

  252: { id:252, name:"Stonegrip", emoji:"🛡️", types:["Earth","Metal"],
    base:{hp:95,atk:110,def:135,spa:58,spd:88,spe:52},
    learnset:[[1,"stone_edge"],[1,"flash_cannon"],[28,"iron_tail"],[36,"forge_strike"],[44,"earthquake"],[52,"bedrock_slam"],[60,"heavy_slam"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:235, rarity:"rare",
    desc:"An iron-clad rock titan. Its exterior is half-rock, half-steel, forming impenetrable natural armor.",
    lore:"Stonegrip is an earth-metal creature 80 cm tall — Crumblite's crumbling stone-body has been stabilised under metalCoat's influence into a compact frame of grey granite, the thin rebar-structures of its juvenile form now visible steel plating bolted to its surface. Its broad hands can crush stone to powder. It works obsessively to compress and compact loose rock around it, creating denser stone formations wherever it dwells." },

  // Standalone Fire/Mineral: Ashrock (location evo near volcano area)
  253: { id:253, name:"Ashrock", emoji:"🌋", types:["Fire","Mineral"],
    base:{hp:90,atk:105,def:100,spa:88,spd:75,spe:55},
    learnset:[[1,"rock_throw"],[1,"ember"],[18,"rock_slide"],[28,"flamethrower"],[38,"stone_edge"],[48,"magma_rock"],[58,"fire_blast"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"forge_ruins", evolveMethod:"location", catchRate:55, expYield:215, rarity:"uncommon",
    desc:"Volcanic rock infused with fire. Found only near ancient forge sites where magma once flowed freely.",
    lore:"Ashrock is a fire-mineral creature 60 cm tall resembling a chunk of volcanic basalt with glowing orange cracks running through it like veins of magma. Its surface radiates intense heat. It inhabits volcanic crater rims and lava tube exits, cooling slowly over centuries until its glow dims and it becomes dormant." },

  // 2-stage Aquatic/Mental chain: Aquapuff → Wavrix (level 28)
  254: { id:254, name:"Bubblepuff", emoji:"🫧", types:["Aquatic","Mental"],
    base:{hp:50,atk:45,def:48,spa:72,spd:62,spe:68},
    learnset:[[1,"water_gun"],[1,"confusion"],[10,"bubble_beam"],[20,"psybeam"],[30,"surf"],[40,"psychic_move"],[50,"hydro_pump"],[60,"hyper_beam"]],
    evolveTo:255, evolveLevel:28, catchRate:165, expYield:76, rarity:"common",
    desc:"A bubble of water with psychic intelligence. Floats using mental energy as much as buoyancy.",
    lore:"Bubblepuff is a round water-psychic creature 25 cm across resembling a translucent bubble of water with two bright eyes and a dreamy expression. It floats just above water surfaces and can drift through the air for short distances. It projects thoughts as visible coloured ripples across any water surface it contacts. A Bubblepuff's projected ripples grow more complex with age and begin to anticipate the water's own movements: a small, accidental version of the perfect tide-and-current prediction Psychotide performs across millennia." },

  255: { id:255, name:"Psychotide", emoji:"🌊", types:["Aquatic","Mental"],
    base:{hp:82,atk:70,def:78,spa:120,spd:102,spe:92},
    learnset:[[1,"surf"],[1,"psychic_move"],[22,"hydro_pump"],[30,"psystrike"],[38,"aqua_tail"],[46,"neural_storm"],[54,"geyser_burst"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A psychic wave entity. Predicts tides and currents with perfect accuracy millennia in advance.",
    lore:"Psychotide is a flowing water-psychic creature 50 cm tall — Bubblepuff's round bubble-body has uncoiled and stretched into a wave frozen in mid-curl with a face in its crest, the dreamy expression of its juvenile form preserved as the wave's central feature. Its body is continuously cycling water that maintains its wave-form through psychic concentration. It inhabits ocean shores and is particularly active at high tide, growing taller with stronger waves." },

  // 3-stage Aquatic/Ice chain: Tideling → Coralhorn → Torrentox
  256: { id:256, name:"Scolphin", emoji:"🐬", types:["Aquatic"],
    base:{hp:48,atk:52,def:58,spa:65,spd:55,spe:52},
    learnset:[[1,"water_gun"],[1,"powder_snow"],[12,"bubble_beam"],[22,"ice_beam"],[32,"surf"],[42,"blizzard"],[52,"hydro_pump"],[60,"hyper_beam"]],
    evolveTo:257, evolveLevel:26, catchRate:170, expYield:74, rarity:"common",
    desc:"A dolphin-like creature of ice-blue water. Schools in cold coastal seas and leaps in synchronised arcing patterns.",
    lore:"Scolphin is a water creature 30 cm long resembling a small dolphin made of ice-blue water. Its body is semi-solid — more ice than liquid in cold conditions and more liquid in warmth. It schools in large groups in cold coastal waters and leaps collectively in synchronised arcing patterns. Younger Scolphin's body is roughly 60% liquid water and 40% ice, but the ratio reverses with age toward the dense solid form their narwhal and orca-calf adult stages adopt. Their tail-half is consistently denser and colder than their head-half — the body already pre-shaped along the axis Torrentox's armoured-dorsal will eventually establish — and their school-communication chirps narrow with each year into the directional precision-hunting echolocation Torrentox uses to map prey through frozen water." },

  257: { id:257, name:"Reefhorn", emoji:"🦄", types:["Aquatic","Ice"],
    base:{hp:72,atk:80,def:88,spa:90,spd:78,spe:65},
    learnset:[[1,"ice_beam"],[1,"surf"],[20,"blizzard"],[28,"aqua_tail"],[36,"cryo_lance"],[44,"hydro_pump"],[52,"icicle_crash"],[60,"hyper_beam"]],
    evolveTo:258, evolveLevel:44, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A horned sea creature made partly of frozen coral. Its horns channel water and ice attacks with precision.",
    lore:"Reefhorn is a water-ice creature 60 cm long — Scolphin's ice-blue dolphin form has solidified to a denser blue-grey narwhal frame and grown a single spiralling ice horn 20 cm long from its forehead, the schooling instinct dropping away in favour of solitary reef-territory. It inhabits cold-water reefs where its horn can chip algae from rock surfaces. The horn breaks and regrows seasonally, and shed horns are used by seabirds as nesting material." },

  258: { id:258, name:"Torrentox", emoji:"🐋", types:["Aquatic","Ice"],
    base:{hp:90,atk:86,def:93,spa:119,spd:99,spe:63},
    learnset:[[1,"hydro_pump"],[1,"blizzard"],[30,"aqua_tail"],[38,"cryo_lance"],[46,"icicle_crash"],[54,"glacial_tomb"],[62,"geyser_burst"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:268, rarity:"rare",
    desc:"An ancient orca-titan of ice. Controls ocean currents and freezes sea lanes solid in winter.",
    lore:"Torrentox is a water-ice creature 1.2 metres long — Reefhorn's deep blue-grey narwhal frame has whitened to a muscular orca calf with blue-white colouration, and the spiralling ice-horn has dissolved into the ice-plate armour now lining its dorsal surface. It generates ice walls around prey by rapidly cooling a volume of water from within, trapping targets in an enclosed freezing pocket." },

  // Standalone Aquatic/Mental: Lumejell
  259: { id:259, name:"Lumejell", emoji:"🪼", types:["Aquatic","Mental"],
    base:{hp:88,atk:64,def:80,spa:118,spd:105,spe:95},
    learnset:[[1,"water_gun"],[1,"psybeam"],[18,"surf"],[28,"psychic_move"],[38,"hydro_pump"],[48,"psystrike"],[58,"neural_storm"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:215, rarity:"uncommon",
    desc:"A luminescent jellyfish with psychic tentacles. Its bioluminescence communicates complex thoughts.",
    lore:"Lumejell is a water-psychic jellyfish 45 cm in diameter with a pale blue bioluminescent bell and long trailing psychic-charged tendrils. Its pulsing light patterns encode complex emotional information. Deep-sea researchers have documented Lumejell performing what appears to be coordinated light-art displays at night." },

  // 2-stage Grass/Fairy chain: Sproutix → Leafhorn (level 26)
  260: { id:260, name:"Sproutix", emoji:"🌱", types:["Nature"],
    base:{hp:48,atk:50,def:48,spa:72,spd:58,spe:65},
    learnset:[[1,"vine_whip"],[1,"fairy_wind"],[12,"razor_leaf"],[22,"moonblast"],[32,"energy_ball"],[42,"petal_blitz"],[52,"dazzling_gleam"],[60,"hyper_beam"]],
    evolveTo:261, evolveLevel:26, catchRate:175, expYield:72, rarity:"common",
    desc:"A grass sprout that blooms with vibrant flowers. Its pollen causes drowsiness in those it trusts.",
    lore:"Sproutix is a small grass creature 15 cm tall resembling a tiny sapling with two leaf-hands and round soft-glowing eyes. It sprouts from the ground in spring meadows and can take root again if it stays still long enough. It leaves a trail of tiny flowers wherever it walks." },

  261: { id:261, name:"Leafhorn", emoji:"🌺", types:["Nature"],
    base:{hp:82,atk:78,def:75,spa:115,spd:100,spe:88},
    learnset:[[1,"moonblast"],[1,"energy_ball"],[5,"synthesis"],[8,"leech_seed"],[12,"nature_pulse"],[16,"leafblade_swirl"],[20,"petal_blitz"],[24,"magical_leaf"],[28,"dazzling_gleam"],[32,"petal_dance"],[36,"grove_wrath"],[40,"pollen_storm"],[44,"celestial_wave"],[48,"thorn_barrage"],[50,"leaf_storm"],[52,"briar_lash"],[56,"solar_beam"],[58,"verdant_radiance"],[60,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:218, rarity:"uncommon",
    desc:"A horned bloom deer of tremendous grace. Its horn concentrates solar and lunar energy into beam attacks.",
    lore:"Leafhorn is a medium grass creature 50 cm tall resembling a deer-faun with leaf-antlers and a body covered in overlapping leaf-scales of vivid green. As it matured from Sproutix, its trunk-body split into four leaf-clad limbs and its head-leaves hardened into antlers. Morning sunlight catches the leaves and they shimmer gold at dawn. It inhabits enchanted forests and its passage encourages dormant seeds to germinate." },

  // 3-stage Fighting/Toxin chain: Transluceed → Tendrilisk → Impenezard
  262: { id:262, name:"Transluceed", emoji:"🌿", types:["Fighting","Toxin"],
    base:{hp:46,atk:52,def:45,spa:65,spd:55,spe:60},
    learnset:[[1,"vine_whip"],[1,"poison_sting"],[5,"tox_acid_armor"],[10,"razor_leaf"],[15,"tox_corrosive_step"],[20,"sludge_bomb"],[25,"tox_acid_burst"],[30,"energy_ball"],[40,"toxic"],[50,"petal_blitz"],[60,"hyper_beam"]],
    evolveTo:263, evolveLevel:24, catchRate:180, expYield:68, rarity:"common",
    desc:"A seed creature wrapped in poisoned vines. It plants itself to absorb nutrients then walks away.",
    lore:"Transluceed is a small fighting-toxin creature 20 cm tall resembling a cactus sapling that has grown a face and legs. Its body is pale green and slightly translucent. Tiny venom-tipped thorn-buds dot its surface, flicked at grazing animals to deter them. As it ages, these buds harden into the vine-tendril limbs Tendrilisk wields and eventually the towering thorn-warrior Impenezard rises into decades later." },

  263: { id:263, name:"Tendrilisk", emoji:"🌵", types:["Fighting","Toxin"],
    base:{hp:70,atk:80,def:68,spa:98,spd:80,spe:72},
    learnset:[[1,"razor_leaf"],[1,"sludge_bomb"],[18,"energy_ball"],[20,"tox_corrosive_claw"],[25,"tox_slash"],[28,"toxic"],[30,"tox_acid_burst"],[36,"petal_blitz"],[44,"venom_lance"],[45,"tox_press"],[52,"grove_wrath"],[60,"hyper_beam"]],
    evolveTo:264, evolveLevel:42, catchRate:90, expYield:145, rarity:"uncommon",
    desc:"A cactus warrior of venomous thorns. Its spines can inject toxins from up to three meters away.",
    lore:"Tendrilisk is a fighting-toxin creature 60 cm tall whose vine-tendril limbs still wrap Transluceed's pale-green translucent seed-pod at its core. Its cactus-warrior body bristles with sharp thorns, held in a constant martial stance — the climbing vine-tendrils that grow from it extend rapidly to strike, each tipped with venomous barbs that flick out to three metres at threats or prey. It inhabits jungle undergrowth and trains daily by setting up elaborate thorn-target networks throughout its territory." },

  264: { id:264, name:"Impenezard", emoji:"🌳", types:["Fighting","Toxin"],
    base:{hp:95,atk:102,def:86,spa:111,spd:93,spe:63},
    learnset:[[1,"petal_blitz"],[1,"venom_lance"],[15,"tox_corrosive_claw"],[20,"tox_corrosive_step"],[28,"tox_slash"],[30,"grove_wrath"],[38,"toxic"],[45,"tox_press"],[46,"energy_ball"],[54,"sludge_wave"],[62,"briar_lash"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:260, rarity:"rare",
    desc:"An enormous walking thorn-warrior. Its 15-cm venom-thorns inject potent toxins on impact, making any approach deadly.",
    lore:"Impenezard is a massive fighting-toxin creature 2 metres tall resembling a walking thorn-warrior — Tendrilisk's climbing vine-tendrils have hardened into 15-cm thorns tipped with potent venom, and its body has thickened into a bristling cactus-plate carapace. Its broad form is nearly impenetrable. It moves slowly through dense jungle in measured fighting stances, and other creatures create well-worn trails specifically to avoid contact with it." },

  // Standalone Grass/Bug: Mosswing
  // LORE-AUDIT FLAG (Step 4): auto-collapsed to mono in Phase B — review for re-dual
  265: { id:265, name:"Mosswing", emoji:"🦗", types:["Nature"],
    base:{hp:78,atk:82,def:70,spa:95,spd:88,spe:108},
    learnset:[[1,"bug_buzz"],[1,"vine_whip"],[5,"cocoon_guard"],[10,"metamorphosis"],[14,"quiver_dance"],[18,"x_scissor"],[22,"sticky_web"],[28,"energy_ball"],[32,"spore_shield"],[38,"razor_leaf"],[42,"sporecloud_burst"],[48,"petal_blitz"],[58,"bug_buzz"],[68,"hyper_beam"]],
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
    lore:"Shadowpup is a small dark dog 25 cm at the shoulder with jet-black fur so dark it absorbs almost all visible light. Its outline against bright backgrounds seems slightly wrong — too sharp and flat. It is playful and energetic, unaware that its unusual appearance unnerves most creatures it approaches. A Shadowpup's quiet growls and yips somehow produce a faint chest-pressure in nearby creatures despite being inaudibly soft. The same pup will visibly flinch from sudden bright light, its visual cortex evidently calibrated for total darkness already. Both quirks foretell Darkfang: the felt-not-heard intimidation the apex form fully wields, and the pitch-darkness vision its eyes will use as clearly as others use daylight." },

  267: { id:267, name:"Nightclaw", emoji:"🐾", types:["Dark"],
    base:{hp:72,atk:95,def:65,spa:75,spd:68,spe:90},
    learnset:[[1,"night_slash"],[1,"phantom_claw"],[20,"dark_pulse"],[28,"eclipse_shroud"],[36,"crunch"],[44,"soul_rend"],[52,"shadow_ball"],[60,"hyper_beam"]],
    evolveTo:268, evolveLevel:44, catchRate:85, expYield:150, rarity:"uncommon",
    desc:"A dark wolf that phases through shadows. Its claws can strike from a different dimension.",
    lore:"Nightclaw is a medium dark dog 55 cm at the shoulder — Shadowpup's jet-black light-absorbing fur has deepened across a larger frame, and the strangely-flat outline of its pup-form has sharpened into non-reflective retractable claws. It hunts by moving through deep shadow too fast to track, using echolocation rather than vision. Its natural shadow-camouflage is so effective it can vanish against dark walls in daylight." },

  268: { id:268, name:"Darkfang", emoji:"🐕", types:["Dark"],
    base:{hp:89,atk:118,def:79,spa:87,spd:79,spe:98},
    learnset:[[1,"eclipse_shroud"],[1,"soul_rend"],[30,"dark_pulse"],[38,"shadow_ball"],[46,"night_slash"],[54,"phantom_claw"],[62,"dread_howl"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:268, rarity:"rare",
    desc:"The apex shadow predator. Its howl resonates across dimensions and can be heard in the land of the dead.",
    lore:"Darkfang is a large dark wolf 90 cm at the shoulder — Nightclaw's deep-black coat has darkened to pitch and the non-reflective claws that hid its juvenile form have been joined by fangs that absorb light, giving them a void-like appearance. Its growl is felt more than heard, as a pressure in the chest. It inhabits forested night-terrain and sees in conditions of total darkness as clearly as others see in daylight." },

  // 2-stage Dark split: Grimshade → Eclipsoon (Moon Stone item)
  269: { id:269, name:"Grimshade", emoji:"🦝", types:["Dark"],
    base:{hp:55,atk:65,def:52,spa:78,spd:65,spe:82},
    learnset:[[1,"bite"],[1,"dark_pulse"],[14,"night_slash"],[24,"eclipse_shroud"],[34,"crunch"],[44,"soul_rend"],[54,"dread_howl"],[60,"hyper_beam"]],
    evolveTo:270, evolveLevel:null, evolveItem:"moonStone", evolveMethod:"item", catchRate:130, expYield:102, rarity:"common",
    desc:"A tanuki cub with deep slate-grey fur and a long shadow that seems to move on its own. Already learning the shape-shifting trickery of its lineage.",
    lore:"Grimshade is a small tanuki-like creature 50 centimetres long with deep slate-grey fur and a thick raccoon-banded tail. Its shadow is unusually large for its size and seems to drift independently in low light, sometimes brushing surfaces several seconds after Grimshade has passed — the first sign of the eclipse-magic that will mature in its evolved form. It is fiercely curious and mischievous, opening pouches and pots in mountain camps for the sheer joy of seeing things fall over." },

  270: { id:270, name:"Eclipsoon", emoji:"🌑", types:["Dark","Fairy"],
    base:{hp:83,atk:87,def:75,spa:114,spd:100,spe:91},
    learnset:[[1,"dark_pulse"],[1,"moonblast"],[28,"eclipse_shroud"],[36,"soul_rend"],[44,"dread_howl"],[52,"fae_requiem"],[60,"shadow_ball"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:38, expYield:228, rarity:"rare",
    desc:"An eclipse-tanuki whose dark fur is patched with fairy-pink moonlight markings. Its illusion-magic peaks under the shadow of an eclipse.",
    lore:"Eclipsoon is a 70-centimetre dark-fairy tanuki, the matured form of Grimshade's mischievous lineage. Its dense dark fur is broken by patches of luminescent fairy-pink across its face, ear-tips, and the rings of its long banded tail; when full moonlight or eclipse shadow falls across it, those patches glow brightly enough to read by. It is famous in Lumoria folklore for spinning convincing illusions of vanished objects, missing creatures, or impossible vistas to confuse travellers, and its illusions are strongest under the shadow of an eclipse — when sun and moon align, an Eclipsoon's deceptions become indistinguishable from reality. It inhabits forest-edge habitats and signals to others across open clearings at night with rhythmic flashes of its glowing patches." },

  // Standalone Dark/Normal: Duskrat
  271: { id:271, name:"Murkrat", emoji:"🐀", types:["Dark","Normal"],
    base:{hp:95,atk:100,def:82,spa:68,spd:75,spe:105},
    learnset:[[1,"bite"],[1,"tackle"],[18,"night_slash"],[28,"dark_pulse"],[38,"body_slam"],[48,"crunch"],[58,"eclipse_shroud"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:205, rarity:"uncommon",
    desc:"A cunning dark rodent that steals anything shiny. Surprisingly tough for its size and always escapes.",
    lore:"Murkrat is a dark-normal creature 30 cm long resembling a fat rat with dark grey fur and bright beady eyes. It is deeply pragmatic — it will steal anything useful, hoard it, and trade it back. It inhabits sewer systems and underground markets and is surprisingly social once trust is established." },

  // 2-stage Fire/Draconic chain: Embrix → Blazeon (level 28)
  272: { id:272, name:"Embrix", emoji:"🦎", types:["Fire","Draconic"],
    base:{hp:50,atk:68,def:52,spa:65,spd:50,spe:72},
    learnset:[[1,"ember"],[1,"dragon_breath"],[12,"flamethrower"],[22,"dragon_claw"],[32,"fire_blast"],[42,"dragon_pulse"],[52,"outrage"],[62,"hyper_beam"]],
    evolveTo:273, evolveLevel:34, catchRate:155, expYield:82, rarity:"common",
    desc:"A fire lizard with nascent draconic power. Breathes embers in spiraling dragon-shaped patterns.",
    lore:"Embrix is a young fire-dragon 25 cm long with bright orange-red scales and oversized eyes. Its wings are too small for flight but it flaps them enthusiastically when excited. It produces tiny fireballs no larger than a marble. It is the juvenile form of a powerful fire dragon lineage and grows rapidly with proper nutrition." },

  273: { id:273, name:"Blazeon", emoji:"🔥", types:["Fire","Draconic"],
    base:{hp:86,atk:110,def:75,spa:112,spd:77,spe:90},
    learnset:[[1,"flamethrower"],[1,"dragon_claw"],[26,"fire_blast"],[34,"dragon_pulse"],[42,"outrage"],[50,"dragon_dance"],[58,"caldera_meltdown"],[66,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:228, rarity:"uncommon",
    desc:"A fire dragon of pure scorching flame. Dances in lava rivers to power up its abilities further.",
    lore:"Blazeon is a fire-dragon 1.5 metres long with deep crimson-orange scales and a fully developed wing-span of 2 metres. Its breath weapon is now a sustained stream of fire rather than fireballs. It inhabits volcanic hillsides and defends a territory of several square kilometres from other fire-types." },

  // 3-stage Fire/Rock chain: Cindling → Infernox → Pyrovast
  274: { id:274, name:"Cindling", emoji:"🪨", types:["Fire","Mineral"],
    base:{hp:46,atk:60,def:65,spa:55,spd:50,spe:52},
    learnset:[[1,"ember"],[1,"rock_throw"],[10,"rock_slide"],[15,"mineral_lattice"],[20,"flamethrower"],[30,"stone_edge"],[40,"fire_blast"],[50,"magma_rock"],[60,"hyper_beam"]],
    evolveTo:275, evolveLevel:28, catchRate:170, expYield:74, rarity:"common",
    desc:"A coal-like creature that ignites when rolling downhill. Leaves scorch marks on stone paths.",
    lore:"Cindling is a fire-mineral creature 30 cm long resembling a small lizard made of dark basalt with glowing cinders embedded in its skin. It collects small pebbles and packs them into its cinder-body over time, growing heavier and slower with age. The hottest cinders in its body mark its most active thinking. A Cindling's surface cinders glow steadily hotter and oranger as the creature ages, the body's heat-storage capacity inching toward the magma-pool levels Infernox sustains across every joint. Faint heat-shimmer extends further outward with each successive moult, approaching the eruption-radius Scorchvast maintains constantly. Provoke a fully-grown Cindling and its body will produce a small but distinct ground-tremor that propagates further than its tiny mass should allow." },

  275: { id:275, name:"Infernox", emoji:"🌋", types:["Fire","Mineral"],
    base:{hp:72,atk:92,def:95,spa:82,spd:68,spe:62},
    learnset:[[1,"flamethrower"],[1,"stone_edge"],[8,"coal_smash"],[12,"flame_focus"],[16,"flash_fire"],[20,"lava_drop"],[22,"fire_blast"],[26,"magma_strike"],[30,"magma_rock"],[34,"molten_tide"],[38,"rock_slide"],[42,"pyre_strike"],[44,"searing_glare"],[46,"earthquake"],[50,"volcanic_wrath"],[54,"caldera_meltdown"],[62,"hyper_beam"]],
    evolveTo:276, evolveLevel:46, catchRate:75, expYield:158, rarity:"uncommon",
    desc:"A volcanic rock beast that erupts periodically. Carries magma inside its carapace like a pressure cooker.",
    lore:"Infernox is a fire-mineral creature 80 cm long — Cindling's basalt-and-cinder juvenile body has thickened into volcanic plate armour resembling a larger armoured lizard, the embedded cinders of its early form now pooled magma glowing through every joint. Its footsteps leave brief glowing prints. It inhabits lava fields and uses its rock-hard body to deflect predator strikes while retaliating with blasts of focused fire." },

  276: { id:276, name:"Scorchvast", emoji:"🏔️", types:["Fire","Mineral"],
    base:{hp:102,atk:118,def:109,spa:90,spd:78,spe:53},
    learnset:[[1,"fire_blast"],[1,"magma_rock"],[12,"coal_smash"],[18,"infernal_roar"],[24,"smolder_trap"],[28,"molten_armor"],[32,"caldera_meltdown"],[36,"magma_strike"],[40,"earthquake"],[44,"volcanic_wrath"],[48,"stone_edge"],[56,"bedrock_slam"],[64,"ashfall"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:18, expYield:272, rarity:"rare",
    desc:"A living volcano of immense destructive power. When it battles, the sky fills with ash and the earth splits.",
    lore:"Scorchvast is a massive fire-mineral creature 2 metres long — Infernox's volcanic plate armour has thickened and fused into natural stone armour entirely encasing a very large igneous lizard, and the joint-magma of its juvenile form has rerouted into fountains of fire that erupt from vents on its back when it is agitated. Its body temperature is sufficient to melt most metals on contact." },

  // Standalone mono Fire: Magmite (location evo near forge area)
  277: { id:277, name:"Magmite", emoji:"🌶️", types:["Fire"],
    base:{hp:92,atk:110,def:96,spa:98,spd:80,spe:62},
    learnset:[[1,"ember"],[1,"mud_shot"],[18,"flamethrower"],[28,"earth_power"],[38,"fire_blast"],[48,"earthquake"],[58,"magma_surge"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"ironforge", evolveMethod:"location", catchRate:50, expYield:215, rarity:"uncommon",
    desc:"Found only in volcanic forge areas where earth meets fire. Its body is half-molten rock, half-flame.",
    lore:"Magmite is a small fire creature 20 cm tall resembling a lava droplet that has cooled enough to walk. Its body is glossy dark basalt with an interior glow. It inhabits active volcanic vents and feeds by filtering mineral nutrients from magma, which passes harmlessly through its heat-adapted body." },

  // 2-stage Metal/Fairy chain: Ironling → Steelhorn (Metal Coat item)
  278: { id:278, name:"Ironling", emoji:"⚙️", types:["Metal","Fairy"],
    base:{hp:52,atk:65,def:78,spa:60,spd:58,spe:55},
    learnset:[[1,"metal_claw"],[1,"fairy_wind"],[14,"flash_cannon"],[24,"moonblast"],[34,"iron_tail"],[44,"dazzling_gleam"],[54,"forge_strike"],[60,"hyper_beam"]],
    evolveTo:279, evolveLevel:null, evolveItem:"metalCoat", evolveMethod:"item", catchRate:145, expYield:92, rarity:"common",
    desc:"A small fairy forged of living iron. Works tirelessly in ancient forges, seeking purpose and strength.",
    lore:"Ironling is a small steel-fairy creature 30 cm tall resembling a tiny knight in fairy-crafted iron armour. Its armour is silver-grey with a faint shimmer. It is protective of smaller creatures and positions itself between perceived threats and those it has chosen to guard, regardless of relative size." },

  279: { id:279, name:"Steelhorn", emoji:"🦌", types:["Metal","Fairy"],
    base:{hp:87,atk:97,def:114,spa:84,spd:97,spe:71},
    learnset:[[1,"flash_cannon"],[1,"moonblast"],[28,"iron_tail"],[36,"dazzling_gleam"],[44,"forge_strike"],[52,"heavy_slam"],[60,"celestial_wave"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:38, expYield:228, rarity:"rare",
    desc:"A horned steel fairy of regal bearing. Its horn channels both fairy magic and forged steel energy.",
    lore:"Steelhorn is a medium steel-fairy creature 70 cm tall — Ironling's silver-grey fairy-crafted iron armour has been refined under metalCoat's influence into a humanoid body of polished silver steel, and a single straight horn of fairy-charged metal has emerged from its forehead, channelling and purifying energy. It inhabits ancient forge-temples and stands watch over sacred metalworking sites." },

  // 3-stage Metal/Fighting chain: Gearbit → Cogvex → Mechavast
  280: { id:280, name:"Gearbit", emoji:"🔩", types:["Metal","Fighting"],
    base:{hp:50,atk:62,def:72,spa:40,spd:52,spe:48},
    learnset:[[1,"metal_claw"],[1,"mud_shot"],[12,"flash_cannon"],[22,"earth_power"],[32,"iron_tail"],[42,"earthquake"],[52,"forge_strike"],[60,"hyper_beam"]],
    evolveTo:281, evolveLevel:28, catchRate:165, expYield:76, rarity:"common",
    desc:"A gear-driven sparring automaton that grapples with found scrap to build strength. Restless and combative.",
    lore:"Gearbit is a small metal-fighting creature 20 cm tall shaped like a round gear-work automaton with stubby legs. Its body is a collection of interlocked cogs that rotate slowly. It spars constantly with found scrap and rival Gearbits, incorporating useful metals into its growing combat-frame. A Gearbit's slow-rotating juvenile cogs are visibly oversized for the small frame that houses them. They were forged at a scale meant for a far heavier Cogvex chassis, and the body still awaits years of martial conditioning before it grows large enough to put them properly to work." },



  // ===== BATCH 6: STEEL / NORMAL / WIND / POISON / BUG (IDs 281-295) =====

  // Cogvex and Mechavast (continuing Gearbit chain from 280)
  281: { id:281, name:"Cogvex", emoji:"⚙️", types:["Metal","Fighting"],
    base:{hp:78,atk:98,def:108,spa:58,spd:75,spe:60},
    learnset:[[1,"flash_cannon"],[1,"earth_power"],[22,"iron_tail"],[30,"earthquake"],[38,"forge_strike"],[46,"bedrock_slam"],[54,"heavy_slam"],[62,"hyper_beam"]],
    evolveTo:282, evolveLevel:46, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A complex gear-machine combatant that builds practice rigs from scavenged parts and trains alone for hours.",
    lore:"Cogvex is a medium metal-fighting automaton 60 cm tall — Gearbit's stubby gear-work frame has elaborated into a more complex body, and the metals it absorbed in countless sparring matches have crystallised into an exposed chest mechanism of dozens of interlocking cogs and pistons. It constructs gear-driven training apparatus from found materials and leaves functional practice rigs scattered across its territory." },

  282: { id:282, name:"Mechavast", emoji:"🤖", types:["Metal","Fighting"],
    base:{hp:105,atk:122,def:124,spa:63,spd:85,spe:51},
    learnset:[[1,"forge_strike"],[1,"earthquake"],[32,"heavy_slam"],[40,"bedrock_slam"],[48,"iron_tail"],[56,"earth_power"],[64,"flash_cannon"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:18, expYield:278, rarity:"rare",
    desc:"The ultimate combat titan. Its body is a perfect fusion of steel and martial precision.",
    lore:"Mechavast is a large metal-fighting automaton 1.5 metres tall — Cogvex's exposed chest-mechanism of interlocking cogs and pistons has been enclosed within a heavy combat chassis, and the gear-driven training apparatus its juvenile form constructed are now built directly into its body as weapons: thick piston-driven legs, a drill-bit gauntlet, and a hydraulic combat-claw. Its internal mechanisms grind audibly. It drills opponents into submission with mechanical precision and marks vanquished rivals' stations in neat geometric formations." },

  // Standalone Metal/Ground: Rustpike
  283: { id:283, name:"Rustpike", emoji:"🗡️", types:["Metal","Poison"],
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
    lore:"Cloudrift is a medium normal-wind creature 40 cm across resembling a compact cloud with a contented face — Fluffkin's cream-white fluff has densified into the cloud-body, and the wind that once dragged its juvenile form helplessly now bears it at a steady chosen altitude. It drifts at a consistent altitude of 3 metres above ground level regardless of terrain and passes through tree canopies with only mild distortion of its form. It rains gently when sad." },

  // 3-stage Normal chain: Fuzzlet → Cuddrix → Majesticore (lv24, lv44)
  286: { id:286, name:"Fuzzlet", emoji:"🦌", types:["Fairy"],
    base:{hp:50,atk:55,def:50,spa:45,spd:48,spe:65},
    learnset:[[1,"tackle"],[1,"fairy_wind"],[10,"dazzling_gleam"],[20,"sweet_kiss"],[30,"wish_spark"],[40,"moonblast"],[50,"hyper_beam"]],
    evolveTo:287, evolveLevel:24, catchRate:185, expYield:65, rarity:"common",
    desc:"A tiny fluffy kirin-fawn so densely furred that its body looks like a creamy puffball. Its hooves are barely visible beneath its fluff.",
    lore:"Fuzzlet is a small kirin-fawn 15 centimetres tall, so densely covered in cream-white fluff that its body looks like a perfectly round puffball — only its tiny hooves and gentle dark eyes peek out. Beneath the fluff are the proportions of a slender deer-fawn, and small antler-buds are already raising the fluff at the crown of its head. A faint warm fairy-glow emanates from within its fluff and intensifies when it is content, casting soft golden light on whoever holds it. It grooms itself constantly, and shed fluff accumulates into soft nest-like mounds where it has rested." },

  287: { id:287, name:"Cuddrix", emoji:"🦌", types:["Fairy"],
    base:{hp:78,atk:82,def:72,spa:62,spd:68,spe:78},
    learnset:[[1,"body_slam"],[1,"fairy_wind"],[18,"dazzling_gleam"],[28,"sweet_kiss"],[38,"moonblast"],[48,"glitter_storm"],[58,"hyper_beam"]],
    evolveTo:288, evolveLevel:44, catchRate:90, expYield:140, rarity:"uncommon",
    desc:"An adolescent kirin-calf with soft pale-brown fur and developing antler-buds. Its mere presence measurably calms larger creatures.",
    lore:"Cuddrix is an adolescent kirin-calf 35 centimetres at the shoulder — Fuzzlet's cream-white kit-fluff has shed to reveal a soft pale-brown undercoat, and its large gentle dark eyes are unchanged; small antler-buds tipped in pale gold are visible at its crown, growing larger with each passing season and already beginning to glow with a soft auspicious fairy-light. It is intensely affectionate and uses gentle physical contact — nuzzles, brief leans against another creature's flank — to communicate. Its presence measurably reduces stress hormone levels in larger creatures, an effect researchers attribute to the calming fairy-aura that emanates softly from its golden antler-glow." },

  288: { id:288, name:"Majesticore", emoji:"🌟", types:["Draconic","Fairy"],
    base:{hp:98,atk:98,def:85,spa:98,spd:97,spe:74},
    learnset:[[1,"heavy_slam"],[1,"dragon_breath"],[30,"fairy_wind"],[38,"dragon_claw"],[46,"moonblast"],[54,"dragon_pulse"],[62,"hyper_beam"],[70,"outrage"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:265, rarity:"rare",
    desc:"A regal dragon-kirin 1.2 metres at the shoulder. Its antlers wreathed in dragonfire-light, fine scales mixed with its fur, and its passage calls down gentle rain.",
    lore:"Majesticore is a regal dragon-kirin 1.2 metres at the shoulder, the auspicious final form of the Fuzzlet→Cuddrix lineage and the embodiment of the ancient legend of the qilin — the dragon-horse. Its sleek brown-gold body is overlaid with fine pale-gold scales beneath the longer fur of its haunches and shoulders, and its full branching antlers are wreathed in soft dragonfire-light that shifts through warm gold and rose hues. A flowing mane of fairy-light cascades from its neck down its shoulders, and at its passage gentle rain falls from clear skies — a sign of the dragon-blood that quickens the kirin's blessing. Its hooves leave only the gentlest impressions in soft soil, and its presence causes calm to settle over any region it crosses — agitated creatures still, fearful animals approach trustingly, and arguments between travellers cool to thoughtful silence within minutes of its arrival. Ancient texts describe its appearance at moments of great peace or great change as an auspicious omen." },

  // Standalone Normal: Bouncyblob
  289: { id:289, name:"Bouncyblob", emoji:"🎱", types:["Normal"],
    base:{hp:110,atk:85,def:85,spa:85,spd:85,spe:85},
    learnset:[[1,"tackle"],[1,"body_slam"],[18,"headbutt"],[28,"reckless_charge"],[38,"heavy_slam"],[48,"battle_cry"],[58,"iron_press"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:200, rarity:"uncommon",
    desc:"A perfectly spherical blob of pure vitality. Its round body absorbs physical impacts with zero damage.",
    lore:"Bouncyblob is a normal creature 30 cm in diameter resembling a perfectly spherical blob of pale pink gel. It bounces continuously regardless of surface type, using kinetic energy storage in its elastic body to maintain constant motion. It absorbs physical impacts and redirects them as higher bounces." },

  // Standalone Normal/Spectral: Mimiclaw (evolves in gloomy location)
  290: { id:290, name:"Mimiclaw", emoji:"🎭", types:["Normal","Dark"],
    base:{hp:82,atk:90,def:78,spa:95,spd:85,spe:102},
    learnset:[[1,"tackle"],[1,"shadow_ball"],[15,"phantom_claw"],[25,"eclipse_shroud"],[35,"body_slam"],[45,"soul_rend"],[55,"shadow_ball"],[65,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, evolveLocation:"cobweb_gully", evolveMethod:"location", catchRate:52, expYield:212, rarity:"uncommon",
    desc:"An unsettling mimic that copies the appearance of other Lumori. Found deep in haunted gullies and ruins.",
    lore:"Mimiclaw is a dark-normal creature 40 cm long resembling a cat with dark grey fur and the ability to shift its outline. Its face can rearrange its features to mimic any creature it has studied for ten minutes or more. It uses mimicry of distressed sounds to lure curious prey within reach." },

  // 2-stage Wind chain: Breezekin → Galehorn (level 28)
  291: { id:291, name:"Breezekin", emoji:"🌬️", types:["Wind"],
    base:{hp:48,atk:52,def:45,spa:68,spd:58,spe:85},
    learnset:[[1,"gust"],[1,"air_slash"],[6,"gust_jab"],[10,"breeze_blade"],[12,"downdraft"],[16,"updraft"],[22,"hurricane"],[32,"gale_cannon"],[42,"squall_slash"],[52,"tempest_wrath"],[60,"hyper_beam"]],
    evolveTo:292, evolveLevel:28, catchRate:168, expYield:74, rarity:"common",
    desc:"A small wind-antelope fawn whose flowing mane streams perpetually in an invisible breeze. Bounds at remarkable speed across open plains.",
    lore:"Breezekin is a compact wind-antelope fawn 35 centimetres at the shoulder, slender-legged and graceful, with a sleek pale-grey coat and a long flowing mane that streams perpetually as if caught in a constant breeze — even indoors. Its movements are fluid and almost silent, and it bounds at speeds far above what its size suggests, navigating open plains and coastal grasslands primarily by smell carried on wind currents." },

  292: { id:292, name:"Galehorn", emoji:"🌪️", types:["Wind","Sonic"],
    base:{hp:78,atk:85,def:70,spa:108,spd:88,spe:115},
    learnset:[[1,"air_slash"],[1,"thunderbolt"],[10,"aerial_ace"],[14,"gale_focus"],[18,"razor_wind"],[22,"hurricane"],[26,"slipstream"],[30,"thunder"],[34,"gale_strike"],[38,"tempest_wrath"],[42,"windshear"],[44,"zephyr_arrow"],[46,"gale_cannon"],[54,"squall_slash"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A swift wind-antelope crowned with spiralling horns that hum and resonate in high winds. Faces gales head-on to set its horns ringing in low, carrying tones.",
    lore:"Galehorn is a large wind-antelope 1.2 metres at the shoulder, the matured form of the Breezekin lineage. Its slender muscular body is grey-white with a long flowing mane down its neck and shoulders, and its head bears a pair of long spiralling horns that hum at a resonant pitch when they vibrate in high winds, producing a low ringing tone audible for kilometres. During storms it faces directly into the gale and amplifies the wind through these horns. It is one of the swiftest land creatures in any region it claims, and its passage through open plains leaves a faint resonant ringing in the air that can be heard by other Lumori for hours." },

  // 3-stage Wind chain: Zephyrpuff → Stormwing → Cyclonax
  293: { id:293, name:"Gustpuff", emoji:"💨", types:["Electric","Draconic"],
    base:{hp:42,atk:45,def:38,spa:65,spd:55,spe:90},
    learnset:[[1,"gust"],[1,"tackle"],[6,"gust_jab"],[10,"air_slash"],[16,"updraft"],[20,"downdraft"],[30,"hurricane"],[40,"gale_cannon"],[50,"squall_slash"],[60,"hyper_beam"]],
    evolveTo:294, evolveLevel:26, catchRate:175, expYield:68, rarity:"common",
    desc:"A tiny wind-dragon hatchling whose newly-shed scale-husks float around it as drifting feather-light puffs of fluff. Disperses and reassembles in low winds.",
    lore:"Gustpuff is a small electric-dragon hatchling about 25 centimetres long, with delicate pale-grey scales just hardening into solid form. Loose translucent scale-husks shed during its earliest moults still float around it like drifting puffs of dandelion-down, crackling with faint static when they brush against each other — a cloud of soft filaments that lifts and reassembles around its body whenever it moves through low winds. Its tiny wings are not yet strong enough for sustained flight, but it darts through grasslands and coastal updrafts at speeds that belie its size, and its passage is announced by the gentle drift of those fluff-husks settling behind it. When groups of Gustpuff hatch in the same season, their combined scale-husks form a small visible cloud above them — an accidental precursor of the personal storm-systems Cyclonax sustains. A sleeping Gustpuff will twitch its tiny incomplete wings in patterns far more complex than its current flight ability requires, practising a wingstroke Stormwing performs adult. The species' instinctive preference for coastal updrafts and high ridges over grasslands or forests reveals the same orientation toward the wind-cathedrals Cyclonax eventually occupies." },

  294: { id:294, name:"Stormwing", emoji:"🐉", types:["Electric","Draconic"],
    base:{hp:70,atk:88,def:68,spa:98,spd:80,spe:108},
    learnset:[[1,"air_slash"],[1,"dragon_breath"],[12,"squall"],[16,"aerial_slam"],[20,"hurricane"],[24,"gale_strike"],[28,"dragon_claw"],[32,"tempest_wave"],[36,"gale_cannon"],[40,"hurricane_blast"],[44,"dragon_pulse"],[48,"windstorm_eruption"],[52,"tempest_wrath"],[60,"hyper_beam"]],
    evolveTo:295, evolveLevel:44, catchRate:80, expYield:155, rarity:"uncommon",
    desc:"A storm-drake hybrid of wind and dragon power. Rides cyclones across entire mountain ranges.",
    lore:"Stormwing is a large electric-dragon 3 metres long — Gustpuff's pale-grey hardening scales have darkened to grey-blue and the translucent scale-husks of its juvenile form have ceased shedding entirely, leaving powerful slate-grey wings spanning 5 metres. Its eyes are electric-white. It generates its own personal storm system wherever it flies — clouds condensing from its wingtip vortices, lightning striking where it looks." },

  295: { id:295, name:"Cyclonax", emoji:"🌀", types:["Electric","Draconic"],
    base:{hp:81,atk:93,def:77,spa:112,spd:88,spe:99},
    learnset:[[1,"hurricane"],[1,"dragon_pulse"],[20,"cyclone_smash"],[24,"gale_focus"],[28,"slipstream"],[30,"tempest_wrath"],[32,"tornado_slam"],[34,"hurricane_blast"],[36,"whirlwind_force"],[38,"dragon_dance"],[40,"windstorm_eruption"],[42,"stratosphere_drop"],[46,"gale_cannon"],[54,"outrage"],[62,"ancient_breath"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:20, expYield:272, rarity:"rare",
    desc:"A hurricane dragon of unimaginable velocity. When it flies, it creates permanent weather anomalies.",
    lore:"Cyclonax is a massive electric-dragon 5 metres long — Stormwing's grey-blue scales have darkened to deep grey with white edges, and the personal storm system that condensed from its juvenile form's wingtip vortices has matured into a perpetual cyclone orbiting its full body. It is rarely seen, living above the weather systems of the world. When it descends to lower altitudes it brings catastrophic storms with it." },



  // ===== BATCH 7: POISON / BUG / MIXED FILLS (IDs 296-313) =====

  // 3-stage Poison/Toxin chain: Plaguefly → Blightwing → Plagueoth (lv26, lv44)
  296: { id:296, name:"Plaguefly", emoji:"🦟", types:["Poison","Toxin"],
    base:{hp:44,atk:52,def:40,spa:68,spd:52,spe:80},
    learnset:[[1,"poison_sting"],[1,"bug_buzz"],[5,"tox_plague_meditation"],[10,"sludge_bomb"],[15,"tox_pulse"],[20,"x_scissor"],[25,"tox_plague_charge"],[30,"toxic"],[40,"venoshock"],[50,"venom_lance"],[60,"hyper_beam"]],
    evolveTo:297, evolveLevel:26, catchRate:178, expYield:70, rarity:"common",
    desc:"A mosquito-like creature with toxic saliva. A single bite can poison most Lumori instantly.",
    lore:"Plaguefly is a large poison-toxin insect with a 30 cm wingspan. Its wings are translucent grey with poison-green venation. Its body is a bloated sack of toxic fluid. It breeds in stagnant water and its larval masses are visible as roiling dark clouds beneath the surface of contaminated ponds." },

  297: { id:297, name:"Blightwing", emoji:"🦟", types:["Poison","Toxin"],
    base:{hp:68,atk:78,def:62,spa:98,spd:78,spe:100},
    learnset:[[1,"x_scissor"],[1,"sludge_bomb"],[15,"tox_plague_claw"],[20,"toxic"],[25,"tox_plague_strike"],[28,"venoshock"],[35,"tox_pulse"],[36,"bug_buzz"],[44,"venom_lance"],[52,"sludge_wave"],[60,"hyper_beam"]],
    evolveTo:298, evolveLevel:44, catchRate:85, expYield:148, rarity:"uncommon",
    desc:"A blight mosquito whose extended proboscis can drain entire forests of vitality. Its bite spreads withering pestilence.",
    lore:"Blightwing is a medium poison-toxin mosquito with 40 cm wingspan — Plaguefly's translucent grey wings have darkened to dark purple with the same poison-green venation now glowing faintly across them. Its elongated proboscis can pierce thick bark to drain plant sap, leaving withered scars in its wake. It inhabits areas of environmental decay, flourishing where other life struggles." },

  298: { id:298, name:"Plagueoth", emoji:"🦟", types:["Poison","Toxin"],
    base:{hp:82,atk:89,def:73,spa:116,spd:95,spe:95},
    learnset:[[1,"venom_lance"],[1,"bug_buzz"],[8,"pin_missile"],[12,"fury_cutter"],[15,"tox_plague_claw"],[18,"lunge"],[20,"tox_plague_strike"],[24,"infestation"],[28,"twineedle"],[30,"sludge_wave"],[32,"hivemind_surge"],[35,"tox_plague_wave"],[38,"toxic"],[40,"swarm_assault"],[44,"swarm_fury"],[45,"tox_plague_charge"],[46,"venoshock"],[50,"attack_order"],[54,"mycelia_net"],[56,"sticky_web"],[60,"quiver_dance"],[62,"corrosion_fang"],[70,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:22, expYield:268, rarity:"rare",
    desc:"The plague mosquito. Ancient texts describe its awakening as an omen of great pestilence. A single drain leaves victims hollowed.",
    lore:"Plagueoth is a large poison-toxin mosquito 60 cm long — Blightwing's elongated bark-piercing proboscis has lengthened further into a needle as long as its body, and the slim juvenile abdomen has bloated into a venom-sac. Its ragged dark wings have a 1.5 m span. It inhabits abandoned buildings and decaying swampland, draining the vital fluids of any creature unfortunate enough to be caught alone at dusk." },

  // 2-stage Toxin/Sonic chain: Stinglet → Nettleclaw (level 28)
  299: { id:299, name:"Stinglet", emoji:"🐝", types:["Toxin","Sonic"],
    base:{hp:50,atk:65,def:52,spa:58,spd:55,spe:78},
    learnset:[[1,"bug_buzz"],[1,"poison_sting"],[5,"tox_kiss"],[12,"x_scissor"],[15,"tox_venom_field"],[22,"sludge_bomb"],[32,"toxic"],[42,"venoshock"],[52,"venom_lance"],[60,"hyper_beam"]],
    evolveTo:300, evolveLevel:28, catchRate:162, expYield:78, rarity:"common",
    desc:"A bee-like stinger creature with a massive venomous barb. Builds hives from toxic resin.",
    lore:"Stinglet is a small toxin-sonic bee 8 cm long with a bright yellow-and-black striped abdomen. Its stinger contains a venom that causes localised swelling and intense pain. It is fiercely territorial around its nest and coordinates with colony-mates using chemical signals to perform coordinated defence responses." },

  300: { id:300, name:"Nettleclaw", emoji:"🐝", types:["Toxin","Sonic"],
    base:{hp:80,atk:105,def:80,spa:88,spd:80,spe:95},
    learnset:[[1,"x_scissor"],[1,"venom_lance"],[8,"pin_missile"],[12,"fury_cutter"],[15,"tox_kiss"],[18,"lunge"],[20,"tox_venom_ray"],[22,"toxic"],[25,"tox_venom_field"],[28,"infestation"],[30,"venoshock"],[32,"tox_venom_mark"],[34,"twineedle"],[36,"hivemind_surge"],[38,"sludge_bomb"],[40,"swarm_assault"],[44,"swarm_fury"],[46,"bug_buzz"],[50,"attack_order"],[54,"sludge_wave"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:42, expYield:218, rarity:"uncommon",
    desc:"A great venom-bee with an elongated stinger-tail. The whip-stinger arches scorpion-like over its back but is true bee anatomy, parallel-evolved from the standard sting.",
    lore:"Nettleclaw is a large toxin-sonic bee 25 cm long — Stinglet's bright yellow-and-black striped abdomen has matured across an entire body still bee-striped yellow-and-black, with four membranous wings and an elongated segmented stinger-tail that arches scorpion-like over its back. The whip-stinger is parallel-evolved from the bee's standard sting, not arachnid heritage. It is solitary and aggressive — unusual for Hymenoptera — marking territory with scent-trails that it defends vigorously against any trespasser regardless of size." },

  // Standalone Fire/Spectral: Emberveil
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

  303: { id:303, name:"Lumivane", emoji:"🌠", types:["Fairy","Mental"],
    base:{hp:81,atk:68,def:78,spa:122,spd:109,spe:92},
    learnset:[[1,"moonblast"],[1,"psychic_move"],[28,"celestial_wave"],[36,"psystrike"],[44,"glitter_storm"],[52,"neural_storm"],[60,"fae_requiem"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:230, rarity:"rare",
    desc:"The comet-orb fairy, a larger luminous sphere haloed by streaming light-rays. Crosses the sky in streaks of prismatic light.",
    lore:"Lumivane is a fairy-psychic creature 50 cm across — Lightpuff's warm-golden 20 cm orb has grown under moonStone influence into a brilliant luminous sphere haloed by rudimentary limb-extensions of condensed light — translucent arm-rays and trailing tendril-legs that emerge from the central sphere but do not sever from it. Its body shifts between solid and luminous depending on its concentration. It inhabits high mountain observatories and archives astronomical data in a crystalline psychic memory at the core of its orb-body." },

  // 3-stage Rock/Ice chain: Crysthorn → Geoshard → Crystallon (location: cold area, lv28, lv48)
  304: { id:304, name:"Icethorn", emoji:"💎", types:["Earth","Ice"],
    base:{hp:52,atk:62,def:75,spa:58,spd:60,spe:50},
    learnset:[[1,"rock_throw"],[1,"powder_snow"],[12,"rock_slide"],[22,"ice_beam"],[32,"stone_edge"],[42,"cryo_lance"],[52,"blizzard"],[60,"hyper_beam"]],
    evolveTo:305, evolveLevel:28, catchRate:162, expYield:78, rarity:"common",
    desc:"A crystal thorn creature that grows in frozen caves. Its crystalline spines shatter on impact then regrow.",
    lore:"Icethorn is a rock-ice creature 40 cm tall resembling a cactus-like formation of grey rock studded with ice-crystal spines. Its ice spines regrow within hours if broken off. It inhabits frozen rocky highlands and uses its spines both to collect water from passing fog and to deter large herbivores." },

  305: { id:305, name:"Geoshard", emoji:"🗻", types:["Earth","Ice"],
    base:{hp:78,atk:92,def:105,spa:78,spd:82,spe:58},
    learnset:[[1,"ice_beam"],[1,"stone_edge"],[22,"cryo_lance"],[30,"blizzard"],[38,"bedrock_slam"],[46,"icicle_crash"],[54,"avalanche_drive"],[62,"hyper_beam"]],
    evolveTo:306, evolveLevel:48, catchRate:75, expYield:158, rarity:"uncommon",
    desc:"A rock and ice giant with shard weapons. Lives on the highest frozen peaks of the Lumoria mountain range.",
    lore:"Geoshard is a rock-ice creature 80 cm tall — Icethorn's grey rock body has expanded and crystallised into a jagged cluster of natural rock and ice that has grown into a vaguely bipedal shape, the ice-crystal spines of its juvenile form now reorganised into brilliant ice formations visible through large natural gaps in its dark stone frame. It moves rarely and is often mistaken for a natural geological feature." },

  306: { id:306, name:"Crystallon", emoji:"🏔️", types:["Earth","Ice"],
    base:{hp:101,atk:108,def:117,spa:83,spd:91,spe:50},
    learnset:[[1,"blizzard"],[1,"bedrock_slam"],[32,"avalanche_drive"],[40,"icicle_crash"],[48,"stone_edge"],[56,"glacial_tomb"],[64,"worldseed_quake"],[72,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:18, expYield:275, rarity:"rare",
    desc:"The frozen mountain titan. Glaciers form around it spontaneously. Worshipped by ancient mountain peoples.",
    lore:"Crystallon is a large rock-ice entity 1.5 metres tall — Geoshard's jagged crystal-cluster bipedal frame has settled and elongated into an ancient standing stone of interlocked rock and ice crystal structures, the natural gaps of its juvenile form now sealed. Its face is barely defined — two faint depressions in the stone suggest eyes. It has stood in the same valley for centuries, and local cultures have built myths around it." },

  // Standalone Fire/Dark: Cinderpaw
  307: { id:307, name:"Cinderpaw", emoji:"🐈", types:["Fire","Dark"],
    base:{hp:85,atk:103,def:73,spa:98,spd:79,spe:112},
    learnset:[[1,"ember"],[1,"bite"],[18,"flamethrower"],[28,"night_slash"],[38,"fire_blast"],[48,"dark_pulse"],[58,"eclipse_shroud"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:52, expYield:212, rarity:"uncommon",
    desc:"A dark flame cat that stalks targets silently before unleashing explosive fire attacks. Unpredictable and cunning.",
    lore:"Cinderpaw is a fire-dark cat 45 cm at the shoulder with glossy black fur overlaid with faintly glowing ember-orange markings on its paws, ears, and tail tip. It moves silently and blends into shadow easily. It inhabits ancient forge-ruins and warm building interiors, drawn to residual warmth in stone." },

  // 2-stage Aquatic/Spectral chain: Seafraith → Tidephant (Water Stone item)
  308: { id:308, name:"Seafraith", emoji:"🌊", types:["Aquatic","Spectral"],
    base:{hp:58,atk:62,def:58,spa:88,spd:75,spe:80},
    learnset:[[1,"water_gun"],[1,"shadow_ball"],[14,"surf"],[24,"phantom_claw"],[34,"hydro_pump"],[44,"eclipse_shroud"],[54,"soul_rend"],[60,"hyper_beam"]],
    evolveTo:309, evolveLevel:null, evolveItem:"waterStone", evolveMethod:"item", catchRate:135, expYield:98, rarity:"common",
    desc:"A ghost that drowned and merged with ocean tides. Haunts coastal routes, pulling travelers into the surf.",
    lore:"Seafraith is a water-spectral creature 60 cm long resembling a deep-sea fish with a translucent dark body through which dim bioluminescent organs are visible. Its eyes are white and sightless — it navigates by sensing water displacement. It inhabits sunken ruins at depths where light never reaches." },

  309: { id:309, name:"Tidephant", emoji:"🐋", types:["Aquatic","Spectral"],
    base:{hp:94,atk:82,def:86,spa:113,spd:102,spe:73},
    learnset:[[1,"hydro_pump"],[1,"eclipse_shroud"],[28,"soul_rend"],[36,"phantom_claw"],[44,"geyser_burst"],[52,"shadow_ball"],[60,"dark_pulse"],[68,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:232, rarity:"rare",
    desc:"A spectral sea leviathan that capsizes ships. Half water, half ghost—completely terrifying.",
    lore:"Tidephant is a large water-spectral creature 2 metres long resembling a cetacean with dark blue-black hide and a broad flat head. As it matured from Seafraith, its fins broadened into flippers and its skeleton calcified into a whale-like frame — a fish-to-leviathan apotheosis. Its eyes emit a faint cold light visible in dark water. It inhabits deep ocean trenches and surfaces only to breathe, leaving minimal wake despite its size." },

  // 2-stage Aquatic/Nature chain: Mudpump → Marshix (level 28)
  310: { id:310, name:"Mudpump", emoji:"🦛", types:["Aquatic","Nature"],
    base:{hp:58,atk:68,def:62,spa:58,spd:55,spe:55},
    learnset:[[1,"mud_shot"],[1,"water_gun"],[8,"sand_attack"],[12,"earth_power"],[22,"surf"],[32,"earthquake"],[42,"hydro_pump"],[52,"clay_armor"],[60,"hyper_beam"]],
    evolveTo:311, evolveLevel:28, catchRate:155, expYield:80, rarity:"common",
    desc:"A small hippo calf perpetually slick with mud. Wallows in shallow tidal mudflats and digs out cool burrow-chambers with its broad snout.",
    lore:"Mudpump is a small hippo calf about 50 centimetres long with a broad rounded body coated in slick wet mud and a short blunt snout perfectly suited to scooping muddy water. It is too small to fully submerge in deep water, so it wallows in shallow tidal mudflats and shallow lagoons where it builds dome-shaped mud-and-reed homes by piling clay around itself with a suction-pump motion of its wide mouth. Small herds of Mudpump dig out vast networks of cool burrow-chambers connecting their wallows beneath the soft surface." },

  311: { id:311, name:"Marshix", emoji:"🦛", types:["Aquatic","Nature"],
    base:{hp:105,atk:118,def:100,spa:78,spd:82,spe:62},
    learnset:[[1,"earthquake"],[1,"surf"],[18,"erosion_wave"],[22,"earth_power"],[26,"quicksand_pull"],[30,"hydro_pump"],[38,"clay_armor"],[46,"bedrock_slam"],[54,"aqua_tail"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:42, expYield:222, rarity:"uncommon",
    desc:"A hippo-like swamp titan that commands both mud and water. Creates marshy terrain wherever it settles.",
    lore:"Marshix is a large marshland hippo-like creature 1.5 metres at the shoulder — Mudpump's slick mud-coating has set and hardened into a broad pale grey body with mud-brown legs, and the suction-pump snout of its calf form has widened for adult marsh-feeding. It spends most of its time submerged in shallow marsh water with only its eyes and nostrils above the surface. Its movements churn the marsh bottom, aerating the sediment beneficially." },

  // 2-stage Ground/Dark chain: Dunecrawl → Sandrix (level 32)
  312: { id:312, name:"Dunecrawl", emoji:"🪨", types:["Earth","Dark"],
    base:{hp:55,atk:72,def:60,spa:52,spd:55,spe:70},
    learnset:[[1,"mud_shot"],[1,"bite"],[5,"sand_attack"],[8,"bone_club"],[11,"bone_rush"],[14,"earth_power"],[18,"quicksand_trap"],[22,"quicksand_pull"],[24,"night_slash"],[28,"sand_polish_v2"],[34,"earthquake"],[38,"stealth_rock"],[44,"dark_pulse"],[48,"underground_slam"],[54,"eclipse_shroud"],[60,"hyper_beam"]],
    evolveTo:313, evolveLevel:32, catchRate:148, expYield:85, rarity:"common",
    desc:"A medium armadillo whose dark sand-coloured armour rolls into a perfect sphere. Buries itself under a thin layer of sand at dawn to disappear from view.",
    lore:"Dunecrawl is a medium armadillo 70 centimetres long with overlapping plates of dark sand-coloured armour that fit together perfectly when it rolls into a sphere — small enough to nest in the palm of a giant's hand. At night it unfurls and hunts insects and small reptiles across the dunes, and at dawn it rolls back into a ball and buries itself under a thin layer of sand, becoming indistinguishable from a dark stone among many." },

  313: { id:313, name:"Sandrix", emoji:"🪨", types:["Earth","Dark"],
    base:{hp:88,atk:112,def:88,spa:75,spd:80,spe:98},
    learnset:[[1,"earthquake"],[1,"dark_pulse"],[8,"bone_club"],[12,"earthen_wall"],[16,"rock_polish"],[20,"erosion_wave"],[24,"quicksand_trap"],[26,"night_slash"],[28,"sand_polish_v2"],[30,"smack_down"],[34,"earth_power"],[36,"ancient_tide"],[40,"underground_slam"],[42,"eclipse_shroud"],[44,"scorched_sand"],[50,"bedrock_slam"],[54,"world_root_bind"],[58,"soul_rend"],[66,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:225, rarity:"uncommon",
    desc:"A massive desert armadillo 1.5 metres long. Strikes prey from below by burrowing through soft sand at deceptive speed.",
    lore:"Sandrix is a large desert armadillo 1.5 metres long — Dunecrawl's dark sand-coloured plates have darkened further to sandy brown-black across a body more than double its juvenile length, the overlapping armour absorbing light around it deepening the shadow it casts even at midday. It inhabits desert shadow-zones — rocky overhangs and dune troughs — and hunts by detecting footstep vibrations through sand at extraordinary range, then burrowing rapidly beneath its prey and erupting from below to clamp on with armored jaws. When threatened it tucks fully into a 1-metre sphere of impenetrable plate-armor and rolls down dunes at frightening speed." },


  // ===== LEGENDARIES (IDs 314-321) =====
  314: { id:314, name:"Galeaxis",  emoji:"🌪️", types:["Wind","Sonic"],
    base:{hp:102,atk:84,def:93,spa:125,spd:96,spe:100},
    learnset:[[1,"air_slash"],[1,"thunder_shock"],[7,"gust"],[14,"spark"],[21,"zephyr_dance"],[28,"thunderbolt"],[35,"downdraft"],[42,"hurricane"],[49,"squall_slash"],[56,"overcharge"],[63,"tempest_wrath"],[70,"gale_cannon"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Skybreaker. Said to control all weather in Lumoria.",
    lore:"Galeaxis is a wind-sonic creature with a 1-metre wingspan, a sleek pale-grey raptor body trailing streamers of compressed air. From cruising altitude it folds its wings and dives faster than sound, and each plunge ends in a localised sonic boom as it exceeds natural air displacement limits. Hunters claim the shockwave can be felt before the bird itself is seen." },

  315: { id:315, name:"Ashvanus",   emoji:"🌋", types:["Fire","Earth"],
    base:{hp:113,atk:145,def:111,spa:102,spd:89,spe:50},
    learnset:[[1,"ember"],[1,"rock_throw"],[7,"flame_fang"],[14,"rock_slide"],[21,"magma_surge"],[28,"stone_edge"],[35,"ashfall"],[42,"flamethrower"],[49,"magma_rock"],[56,"fire_blast"],[63,"caldera_meltdown"],[70,"bedrock_slam"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Volcano Titan. Eruptions across Lumoria mark its awakening.",
    lore:"Ashvanus is a large fire-rock creature 2 metres tall resembling a volcanic vent that has grown a body. Its core is glowing magma surrounded by a shell of compressed ash-rock. It stands dormant for years between activity phases, during which local plants colonise its ash-body, making it appear as a small hill." },

  316: { id:316, name:"Abyssovex", emoji:"🌊", types:["Aquatic","Dark"],
    base:{hp:99,atk:102,def:85,spa:130,spd:92,spe:82},
    learnset:[[1,"water_gun"],[1,"bite"],[7,"bubble_beam"],[14,"crunch"],[21,"abyssal_jet"],[28,"dark_pulse"],[35,"surf"],[42,"abyssal_snare"],[49,"dragon_pulse"],[56,"soul_rend"],[63,"hydro_pump"],[70,"geyser_burst"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:310, rarity:"legendary",
    desc:"The Legendary Abyss Drake. Lurks in the deepest ocean trenches.",
    lore:"Abyssovex is a massive water-dark leviathan 8 metres long resembling an enormous deep-sea squid with dark bioluminescent patches along its body. Its tentacles extend 4 metres beyond its mantle. It inhabits the deepest ocean trenches and ascends toward surface waters only during rare deep-sea events." },

  // ===== NEW LUMOS IDs 108-167 =====

  // ===== ELECTRIC/ROCK =====
  92: { id:92, name:"Arcspine", emoji:"⚡", types:["Electric","Earth"],
    base:{hp:62,atk:68,def:75,spa:48,spd:55,spe:41},
    learnset:[[1,"rock_throw",[22,"arc_flash"]],[1,"thunder_shock"],[10,"spark"],[18,"rock_slide"],[20,"recover"],[26,"thunderbolt"],[34,"stone_edge",[5,"thunder_wave"]],[36,"volt_surge"],[3,"static_cage"],[31,"ball_lightning"]],
    evolveTo:93, evolveLevel:30, catchRate:130, expYield:96, rarity:"common",
    desc:"A spiny rock-echidna 80 centimetres long. Its crystal-tipped quills crackle with stored static, and it curls into a spiked ball when threatened.",
    lore:"Arcspine is a stocky electric echidna about 80 centimetres long with a grey-brown rocky hide bristling with stiff conductive quills tipped in pale-blue crystalline spurs. Its short snout is adapted for digging into mineral-rich soil where it locates electric ant nests by sensing their faint earth-charge. Blue arc-discharges crackle between its dorsal quills during high humidity, and it survives direct lightning strikes that would vaporise other creatures by routing the charge through its stone-armoured body and into the ground. When threatened, it tucks into a ball of bristling crystalline spikes." },

  // ===== STEEL/DARK =====
  134: { id:134, name:"Aeronyx", emoji:"🦇", types:["Metal","Dark"],
    base:{hp:49,atk:51,def:69,spa:45,spd:57,spe:66},
    learnset:[[1,"bite",[20,"shadowstep"]],[1,"metal_claw"],[9,"wing_attack"],[17,"dark_pulse"],[21,"leer"],[25,"flash_cannon"],[33,"crunch",[5,"magnetize"]],[36,"shadow_ball"],[3,"ironskin"],[31,"smelt_crush"]],
    evolveTo:135, evolveLevel:28, catchRate:140, expYield:88, rarity:"common",
    desc:"A small bat with scrap-metal wings that screech on the wind. Lives in old ruins.",
    lore:"Aeronyx is a sleek steel-dark bat 80 cm long with wings made of thin flexible metal alloy rather than membrane. Its body is dark gunmetal grey with blue-tinted metal plating. It slices through the air with minimal noise and can fold its metal wings to act as shields. It roosts on steel structures. Aeronyx will hold the wing-shield position for minutes at a time even with no apparent threat: an autonomic drill, written into the body, for the chrome-black armour Steelvex wears continuously." },

  // ===== FIRE/GROUND =====
  19: { id:19, name:"Magmaurin", emoji:"🐾", types:["Fire","Earth"],
    base:{hp:68,atk:70,def:59,spa:51,spd:43,spe:49},
    learnset:[[1,"ember",[22,"magma_surge"]],[1,"scratch"],[9,"mud_shot"],[17,"flame_fang"],[20,"leer"],[25,"earthquake"],[33,"flamethrower",[5,"scorch_veil"]],[36,"cinderwhirl"],[3,"embercloak"],[31,"wildfire_surge"]],
    evolveTo:20, evolveLevel:26, catchRate:150, expYield:92, rarity:"common",
    desc:"A fire mole that tunnels through volcanic rock. Its claws glow orange with heat.",
    lore:"Magmaurin is a bear-sized stocky saurian with a rounded body half-coated in cooling lava plates. Its fur beneath the stone armour is singed brown. It lumbers through volcanic badlands, digging up mineral veins with massive clawed forearms, and rolls into a ball of cooled rock when threatened." },

  // ===== FAIRY/GRASS =====
  72: { id:72, name:"Floralin", emoji:"🌸", types:["Fairy","Nature"],
    base:{hp:39,atk:35,def:40,spa:63,spd:65,spe:59},
    learnset:[[1,"tackle",[20,"stardust_veil"]],[1,"fairy_wind"],[8,"vine_whip"],[16,"dazzling_gleam"],[21,"leer"],[24,"razor_leaf"],[32,"moonblast",[5,"sweet_kiss"]],[36,"seed_bomb"],[3,"charm_bloom"],[31,"leaf_blade"]],
    evolveTo:73, evolveLevel:20, catchRate:220, expYield:70, rarity:"common",
    desc:"A puff of fairy pollen given form. It drifts wherever the breeze takes it.",
    lore:"Floralin is a slender fairy-grass creature 70 cm tall resembling a humanoid formed from intertwined flower stems. Its body is pale green with pink blossoms open along its arms and crown. A trail of petals falls wherever it walks. It inhabits enchanted glades and dances in slow patterns that mirror the movement of the wind." },

  // ===== NORMAL/GROUND =====
  104: { id:104, name:"Arenikin", emoji:"🐾", types:["Normal","Earth"],
    base:{hp:47,atk:63,def:55,spa:46,spd:32,spe:64},
    learnset:[[1,"tackle",[22,"sandstrike"]],[1,"growl"],[8,"mud_shot"],[16,"quick_attack"],[20,"clay_armor"],[24,"headbutt"],[32,"earthquake",[5,"tail_whip"]],[36,"boulder_roll"],[3,"leer"],[31,"mud_bomb"]],
    evolveTo:105, evolveLevel:22, catchRate:180, expYield:78, rarity:"common",
    desc:"A sandy-furred critter that kicks up dust clouds when startled. Very skittish.",
    lore:"Arenikin is a small sandy-furred hyena-pup about 35 cm at the shoulder with large upright ears, a stocky build, and a slender snout suited for digging. Its colouring matches desert sand almost exactly. It stores excess food underground and marks its territory with scratched symbols in stone, which researchers have documented as a primitive map system." },

  // ===== WATER/POISON =====
  31: { id:31, name:"Toxaquil", emoji:"🐙", types:["Aquatic","Poison"],
    base:{hp:52,atk:50,def:55,spa:57,spd:52,spe:51},
    learnset:[[1,"water_gun",[22,"putrid_pulse"]],[1,"poison_sting"],[10,"bubble_beam"],[18,"sludge_bomb"],[20,"recover"],[26,"surf"],[34,"toxic",[5,"tidecaller"]],[36,"corrosion_fang"],[3,"deepwater_hymn"],[31,"sludge_wave"]],
    evolveTo:32, evolveLevel:28, catchRate:130, expYield:90, rarity:"common",
    desc:"A polypoid sea creature that releases clouds of inky venom to escape predators.",
    lore:"Toxaquil is a purple-mantled octopus about 45 cm across with eight tentacles banded in deep violet and sickly yellow. Glands beneath its skin secrete a mild paralytic toxin that coats its arms. It hunts by spreading tentacles in a wide web beneath unsuspecting prey and then quickly contracting." },

  // ===== WATER/STEEL =====
  37: { id:37, name:"Coralossus", emoji:"🪸", types:["Aquatic","Metal"],
    base:{hp:88,atk:83,def:118,spa:71,spd:90,spe:30},
    learnset:[[1,"water_gun",[25,"ironskin"]],[1,"metal_claw"],[11,"harden"],[16,"swords_dance"],[19,"aqua_tail"],[27,"flash_cannon"],[29,"rivet_barrage"],[35,"surf"],[40,"tidal_crush"],[43,"iron_tail",[5,"tidecaller"]],[3,"deepwater_hymn"],[33,"smelt_crush"]],
    evolveTo:38, evolveLevel:44, catchRate:55, expYield:188, rarity:"uncommon",
    desc:"A golem formed from centuries of compressed coral and sunken steel. Nearly indestructible.",
    lore:"Coralossus is a massive living-reef creature 4 metres tall appearing as a hulking humanoid formed from packed coral, encrusted shells, and marine growth. Metal-hard armour covers every surface. It stands motionless on the sea floor for decades, and divers often mistake it for a natural reef formation." },

  // ===== WATER/WIND =====
  39: { id:39, name:"Gossafin", emoji:"🐬", types:["Aquatic","Wind"],
    base:{hp:73,atk:74,def:69,spa:86,spd:72,spe:84},
    learnset:[[1,"water_gun",[24,"tidal_crush"]],[1,"gust"],[12,"bubble_beam"],[20,"wing_attack"],[25,"swords_dance"],[28,"surf"],[36,"air_slash"],[44,"hydro_pump"],[45,"riptide_slam"],[52,"hurricane",[5,"tidecaller"]],[3,"deepwater_hymn"],[37,"storm_surge"]],
    evolveTo:40, evolveLevel:42, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A dolphin that leaps between ocean waves and sea winds. Its song calms storms.",
    lore:"Gossafin is a sleek manta-ray-like creature with a 3-metre wingspan and gossamer trailing fins that ripple like silk in underwater currents. Its body is midnight blue above and pale silver beneath. It glides silently through cold deep-water channels, guided by a keen sense of electromagnetic fields." },

  // ===== WIND/PSYCHIC =====
  116: { id:116, name:"Zephyrin", emoji:"🌀", types:["Wind","Mental"],
    base:{hp:43,atk:32,def:35,spa:69,spd:54,spe:95},
    learnset:[[1,"gust",[22,"mind_shatter"]],[1,"confusion"],[9,"quick_attack"],[17,"air_slash"],[25,"psybeam"],[29,"psystrike"],[33,"hurricane"],[41,"psychic_move",[5,"mistveil"]],[3,"zephyr_dance"],[32,"astral_rend"]],
    evolveTo:117, evolveLevel:32, catchRate:110, expYield:90, rarity:"common",
    desc:"A wisp of wind given a curious mind. Follows trainers to observe how they think.",
    lore:"Zephyrin is a small wind-psychic vortex 1.5 metres tall, a swirling column of translucent teal-blue compressed air with a faint psychic glow at its centre. Long trailing ribbons of wind unfurl from its periphery and drift behind it as it moves. It inhabits mountain weather-stations and is considered a reliable predictor of atmospheric pressure changes." },

  // ===== WATER/FAIRY =====
  34: { id:34, name:"Pearlith", emoji:"🐚", types:["Aquatic","Fairy"],
    base:{hp:36,atk:37,def:52,spa:69,spd:62,spe:57},
    learnset:[[1,"tackle",[22,"wish_spark"]],[1,"water_gun"],[8,"fairy_wind"],[16,"bubble_beam"],[20,"leer"],[24,"dazzling_gleam"],[32,"surf",[5,"tidecaller"]],[36,"riptide_slam"],[3,"deepwater_hymn"],[31,"moonblast"]],
    evolveTo:35, evolveLevel:24, catchRate:200, expYield:74, rarity:"common",
    desc:"A tiny pearl-mermaid fry curled inside a fairy-touched oyster shell. Snaps the shell shut to hide whenever startled.",
    lore:"Pearlith is a tiny pearl-mermaid fry about 12 centimetres long, curled comfortably inside a 20-centimetre barnacle-encrusted oyster shell that serves as both nursery and shelter. Its tiny pale-violet body has a soft humanoid torso and a stubby pearl-coloured tail tipped in delicate translucent fins; rose-gold luminescence pulses gently from its core, illuminating the shell from within. When threatened it tucks fully inside and snaps the shell closed with surprising force, becoming indistinguishable from an ordinary oyster among reef rocks. As it grows, fairy energy concentrates in its body until the shell can no longer contain it, and it emerges into the open sea as Undirael." },

  // ===== GRASS/DARK =====
  78: { id:78, name:"Sylvnox", emoji:"🌿", types:["Nature","Dark"],
    base:{hp:61,atk:62,def:48,spa:59,spd:54,spe:69},
    learnset:[[1,"vine_whip",[22,"root_lance"]],[1,"bite"],[10,"razor_leaf"],[18,"night_slash"],[26,"energy_ball"],[30,"grove_wrath"],[34,"crunch"],[42,"dark_pulse",[5,"sleep_powder"]],[3,"spore_burst"],[32,"void_rend"]],
    evolveTo:79, evolveLevel:30, catchRate:110, expYield:98, rarity:"common",
    desc:"A shadowy plant sprite that hides in dark undergrowth. Its thorns drip with shadow energy.",
    lore:"Sylvnox is a small bark-skinned forest-sprite 60 cm tall, the youngest stage of the leshy lineage. Its body is bipedal and humanoid, wrapped in a fringed cloak of dark leaves and shadow-moss with two short twig-horns curling from its brow. Its amber eyes glow through the foliage-hood as it skitters through the undergrowth at twilight, drawing shadow-camouflage from the corrupted plants it touches. Travellers who hear its faint giggling among the trees rarely see it before it is gone." },

  // ===== POISON/GRASS =====
  162: { id:162, name:"Marlix", emoji:"🌾", types:["Nature","Toxin"],
    base:{hp:55,atk:56,def:53,spa:59,spd:48,spe:66},
    learnset:[[1,"poison_sting",[22,"miasma_cloud"]],[1,"vine_whip"],[10,"sludge_bomb"],[15,"tox_miasma_screen"],[18,"razor_leaf"],[25,"tox_miasma_lure"],[26,"toxic"],[30,"petal_blitz"],[34,"energy_ball"],[35,"tox_lash2"],[42,"venoshock",[5,"toxic_surge"]],[3,"toxin_bloom"],[32,"sludge_wave"]],
    evolveTo:163, evolveLevel:28, catchRate:120, expYield:94, rarity:"common",
    desc:"A bog plant with razor-edged thorns dripping toxic sap. Thrives in poisoned swamps.",
    lore:"Marlix is a slender grass-toxin creature 80 cm tall resembling a humanoid made of dense marsh reeds. Its stalk-body is pale green with brown banding, and it moves by bending and straightening its reed-limbs. It inhabits shallow wetlands and disguises itself as ordinary marsh vegetation between encounters." },

  // ===== DARK =====
  126: { id:126, name:"Impefurr", emoji:"🦊", types:["Dark"],
    base:{hp:30,atk:38,def:31,spa:56,spd:59,spe:79},
    learnset:[[1,"bite"],[1,"leer"],[8,"quick_attack"],[16,"dark_pulse"],[20,"shadowstep"],[21,"vital_pulse"],[24,"crunch"],[32,"shadow_ball",[5,"eclipse_shroud"]],[36,"void_rend"],[3,"dread_howl"],[31,"recover"]],
    evolveTo:127, evolveLevel:26, catchRate:160, expYield:80, rarity:"common",
    desc:"A faint wraith of shadow energy. Haunts dark places and feeds on fearful emotions.",
    lore:"Impefurr is a slight dark-coloured fox-like creature 45 cm at the shoulder with deep slate-grey fur and eyes that reflect no light. It mimics sounds from its environment — calls of other creatures, distant voices, metal scraping — to confuse and misdirect. It is deeply mischievous by nature." },

  // ===== PSYCHIC/DARK =====
  128: { id:128, name:"Cranivade", emoji:"🔮", types:["Mental","Spectral"],
    base:{hp:41,atk:50,def:49,spa:78,spd:69,spe:61},
    learnset:[[1,"confusion",[22,"telepathic_slam"]],[1,"bite"],[10,"psybeam"],[18,"dark_pulse"],[26,"psychic_move"],[30,"neural_storm"],[34,"shadow_ball"],[42,"psystrike",[5,"calm_mind"]],[3,"prism_ward"],[32,"blackout_bomb"]],
    evolveTo:129, evolveLevel:34, catchRate:90, expYield:100, rarity:"common",
    desc:"A spectre of mental power. It exists half in reality and half in the mind's eye.",
    lore:"Cranivade is a tall mental-spectral biped 1.3 metres tall with a smooth lavender-grey body and an oversized cranium that pulses with light when it concentrates. Its small hands trail crackling spectral energy. It dredges suppressed memories from others without consent and catalogues them in its own vast mental archive. During its deepest archiving trances, the lavender-grey cranium of a Cranivade briefly turns translucent at the edges and flickers between dimensions; this momentary phase-shift is exactly the half-dimensional state Voidaxis inhabits permanently." },

  // ===== DARK/GRASS =====
  130: { id:130, name:"Necralia", emoji:"🌿", types:["Dark","Nature"],
    base:{hp:76,atk:72,def:79,spa:86,spd:74,spe:63},
    learnset:[[1,"bite",[24,"obsidian_fang"]],[1,"vine_whip"],[11,"night_slash"],[19,"razor_leaf"],[23,"recover"],[27,"crunch"],[35,"energy_ball"],[42,"nightmare_pulse"],[43,"dark_pulse"],[51,"shadow_ball",[5,"eclipse_shroud"]],[3,"dread_howl"],[37,"wicked_blow"]],
    evolveTo:131, evolveLevel:40, catchRate:65, expYield:178, rarity:"uncommon",
    desc:"An ancient mossy boulder animated by dark energy. Feeds on the light of living things.",
    lore:"Necralia is a plant-dark creature resembling a thorned bush 80 cm tall that has achieved mobility. Its branches are dark as charcoal and its leaves are deep burgundy-black with serrated edges. It creeps silently through forests, uprooting itself and relocating, and consumes fallen creatures to fuel its growth." },

  // ===== BUG/FAIRY =====
  202: { id:202, name:"Sculptweave", emoji:"🕷️", types:["Nature","Fairy"],
    base:{hp:34,atk:52,def:63,spa:58,spd:49,spe:85},
    learnset:[[1,"string_shot",[22,"silk_bind"]],[1,"fairy_wind"],[9,"bug_bite"],[17,"dazzling_gleam"],[20,"recover"],[25,"x_scissor"],[33,"moonblast",[5,"chitin_guard"]],[36,"swarm_dive"],[3,"compound_glare"],[31,"bug_buzz"]],
    evolveTo:203, evolveLevel:26, catchRate:160, expYield:84, rarity:"common",
    desc:"A spider that weaves silk infused with fairy dust. Its webs shimmer like spun moonlight.",
    lore:"Sculptweave is a spider 15 cm across with a pale cream body and legs banded in rose-gold. Its silk is exceptionally strong and has a faint iridescent sheen. It weaves elaborate three-dimensional web sculptures rather than flat sheets, incorporating fairy-touched strands that glow at dawn and dusk." },

  // ===== ICE/STEEL =====
  // LORE-AUDIT FLAG (Step 4): PR #49 forced retype (Spectral/Fighting now pre-408 OK — reconsider)
  55: { id:55, name:"Rimeling", emoji:"🗡️", types:["Ice","Metal"],
    base:{hp:46,atk:73,def:66,spa:56,spd:52,spe:76},
    learnset:[[1,"powder_snow",[25,"cryo_lance"]],[1,"metal_claw"],[11,"ice_punch"],[19,"flash_cannon"],[27,"icicle_crash"],[30,"smelt_crush"],[35,"iron_tail"],[43,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[33,"forge_strike"]],
    evolveTo:56, evolveLevel:36, catchRate:90, expYield:110, rarity:"uncommon",
    desc:"A blade of living ice and metal. Keeps its edge forever sharp in the coldest conditions.",
    lore:"Rimeling is a slender humanoid about 1.2 metres tall made entirely of layered ice and dark tempered steel. Its body appears jointed, like armour assembled from ice-forged plates. Blue veins of compressed frost show through gaps in the plating. It stands motionless in blizzards for days, absorbing ambient cold to reinforce its body." },

  // ===== ICE/FAIRY =====
  57: { id:57, name:"Speculith", emoji:"✨", types:["Ice","Fairy"],
    base:{hp:51,atk:37,def:62,spa:73,spd:68,spe:51},
    learnset:[[1,"tackle",[22,"pixie_bolt"]],[1,"powder_snow"],[8,"fairy_wind"],[16,"ice_beam"],[24,"dazzling_gleam"],[29,"avalanche_drive"],[32,"moonblast"],[40,"blizzard",[5,"permafrost"]],[3,"winter_shroud"],[31,"subzero_slash"]],
    evolveTo:58, evolveLevel:28, catchRate:150, expYield:85, rarity:"common",
    desc:"A small floating ice-fairy with a translucent lens for a face. Drifts through cold mountain air, signaling to others with prismatic flashes through its glassy mask.",
    lore:"Speculith is a small floating ice-fairy roughly 40 cm tall, its slender translucent body capped with a flat circular lens-plate where its face would be. Delicate crystalline spines radiate from the lens like the petals of a frozen flower, and a pair of stubby wing-buds — folded close against its back — already glint with the rainbow iridescence its evolved form will display in full. It drifts on icy updrafts through cold mountain air, focusing and scattering light through its lens-face to flash bright prismatic signals to others of its kind." },

  // ===== ICE/DRAGON =====
  59: { id:59, name:"Lunaveris", emoji:"🌙", types:["Ice","Draconic"],
    base:{hp:63,atk:65,def:69,spa:79,spd:64,spe:59},
    learnset:[[1,"powder_snow",[24,"wyrm_strike"]],[1,"dragon_breath"],[12,"ice_beam"],[20,"dragon_claw"],[28,"icicle_crash"],[36,"dragon_pulse"],[44,"blizzard"],[52,"outrage",[5,"permafrost"]],[3,"winter_shroud"],[37,"scale_storm"]],
    evolveTo:60, evolveLevel:40, catchRate:60, expYield:115, rarity:"uncommon",
    desc:"A moonlit dragon of frost. Its scales glimmer with cold starlight on winter nights.",
    lore:"Lunaveris is a serpentine ice-dragon 5 metres long with scales that shift between deep blue and silver depending on the angle of light. A crescent-shaped ridge of ice forms its crest. It is nocturnal, hunting on moonlit glacier surfaces and using reflected moonlight to navigate across vast frozen plains." },

  // ===== WATER/STEEL =====
  41: { id:41, name:"Titanomare", emoji:"🐋", types:["Aquatic","Metal"],
    base:{hp:113,atk:95,def:109,spa:84,spd:91,spe:58},
    learnset:[[1,"surf",[1,"sea_serpent_strike"]],[1,"iron_tail"],[1,"aqua_tail"],[1,"flash_cannon"],[18,"growl"],[31,"tackle"],[44,"bubble_beam"],[55,"hydro_pump"],[58,"temper_edge"],[65,"hyper_beam",[5,"tidecaller"]],[3,"deepwater_hymn"],[41,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:15, expYield:280, rarity:"rare",
    desc:"A leviathan armored in barnacle-covered steel. Said to be older than the ocean floor itself.",
    lore:"Titanomare is an oceanic titan 10 metres long with a whale-like body coated in overlapping steel-grey armour plates thick enough to deflect cannon fire. Four broad stabilising fins propel it at great speed. Ancient civilisations built harbours specifically to attract and appease this living warship." },

  // ===== EVOLUTIONS (108+ referenced above) =====

  93: { id:93, name:"Stonebolt", emoji:"🪨", types:["Electric","Earth"],
    base:{hp:81,atk:98,def:92,spa:69,spd:57,spe:83},
    learnset:[[1,"rock_slide"],[2,"thunderbolt"],[3,"spark"],[4,"thunder_wave"],[31,"stone_edge"],[33,"volt_surge"],[35,"vital_pulse"],[40,"geode_burst"],[45,"earthquake"],[50,"thunder"],[55,"overcharge"],[60,"hyper_beam"],[5,"static_cage"],[39,"wild_charge"]],
    evolveTo:94, evolveLevel:44, catchRate:45, expYield:220, rarity:"uncommon",
    desc:"A heavyset rock-echidna whose paired forehead-spurs discharge directional bolts of lightning. Slow but built like a fortress.",
    lore:"Stonebolt is a stout rock-echidna 1.3 metres at the shoulder, bulkier and broader than its Arcspine juvenile stage. Its quill-forest has consolidated into thick stone-grey plate-quills along its back and flanks, and granite ridges rim its shoulders. A pair of stubby crystalline forehead-spurs grows above its snout — discharging electricity between them creates a directed electrical bolt that strikes far ahead. It is slow but extraordinarily durable, weathering attacks that would shatter most other creatures." },

  135: { id:135, name:"Steelvex", emoji:"🦇", types:["Metal","Dark"],
    base:{hp:82,atk:102,def:94,spa:59,spd:73,spe:78},
    learnset:[[1,"flash_cannon"],[2,"dark_pulse"],[3,"magnetize"],[30,"crunch"],[33,"shadow_ball"],[34,"harden"],[38,"rivet_barrage"],[43,"steel_wing"],[48,"night_slash"],[53,"forge_strike"],[58,"void_rend"],[63,"iron_tail"],[4,"ironskin"],[41,"smelt_crush"]],
    evolveTo:136, evolveLevel:44, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"An iron-clad wraith bat. Its metallic screech disorients enemies from great distances.",
    lore:"Steelvex is a larger dark-steel bat 1.2 metres long — Aeronyx's gunmetal-grey alloy wings have broadened into the metallic shields that now catch and reflect light strangely, and the blue-tinted plating of its juvenile form has darkened to a chrome-black body. It has the habit of dismantling mechanical objects it finds — gears, clockwork, small machines — studying each component before reassembling them incorrectly." },

  20: { id:20, name:"Embrath", emoji:"🦔", types:["Fire","Earth"],
    base:{hp:97,atk:121,def:76,spa:69,spd:62,spe:64},
    learnset:[[1,"flame_fang"],[2,"mud_shot"],[3,"earthquake"],[4,"scorch_veil"],[5,"embercloak"],[8,"firebrand"],[12,"scorch_kick"],[16,"molten_claw"],[20,"fire_spin"],[24,"inferno_chop"],[30,"flamethrower"],[31,"battle_cry"],[36,"ashfall"],[40,"scorched_earth"],[41,"earth_power"],[46,"fissure_slam"],[51,"inferno"],[56,"fire_blast"],[61,"tectonic_slam"]],
    evolveTo:21, evolveLevel:44, catchRate:45, expYield:218, rarity:"uncommon",
    desc:"A lava-boring behemoth that carves tunnels with molten precision. Its spines erupt flame.",
    lore:"Embrath is a medium-sized spined lizard about 80 cm long — Magmaurin's stocky saurian frame has slimmed and lengthened for hunting, the lava-plate armour shed in favour of scales that still retain the charcoal grey and deep rust of its juvenile rock-coat. Heat-sensing pits line its snout. It hunts underground prey by detecting body heat through soil, then erupts from the ground in a burst of superheated air to stun its catch." },

  73: { id:73, name:"Faelomis", emoji:"🌺", types:["Fairy","Nature"],
    base:{hp:78,atk:60,def:65,spa:115,spd:89,spe:93},
    learnset:[[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"vine_whip"],[4,"sweet_kiss"],[21,"razor_leaf"],[27,"tail_whip"],[29,"moonblast"],[34,"scratch"],[41,"moonveil"],[48,"celestial_wave"],[55,"energy_ball"],[62,"petal_blitz"],[5,"stardust_veil"],[42,"leaf_blade"]],
    evolveTo:74, evolveLevel:44, catchRate:60, expYield:195, rarity:"uncommon",
    desc:"A bloom fairy of extraordinary grace. Its petals carry healing magic on the breeze.",
    lore:"Faelomis is a tall graceful fairy-grass creature 1.2 metres tall — Floralin's pale-green stem-body has woven into interlocking flowering vines over a luminous inner core, and its pink arm-blossoms have unfurled into large bloom-wings that trail from its back, their petals reshaping continuously. It is drawn to locations where multiple ley lines intersect, feeding on ambient magical energy." },

  105: { id:105, name:"Dravanas", emoji:"🐾", types:["Normal","Earth"],
    base:{hp:91,atk:108,def:71,spa:50,spd:62,spe:112},
    learnset:[[1,"mud_shot"],[2,"growl"],[22,"headbutt"],[28,"vital_pulse"],[29,"earthquake"],[33,"boulder_roll"],[34,"swords_dance"],[40,"wild_tumble"],[46,"momentum_rush"],[52,"body_slam"],[58,"earth_power"],[64,"hyper_beam"],[3,"tail_whip"],[42,"loam_leech"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:200, rarity:"uncommon",
    desc:"A great desert hyena with a thick crest-mane of hardened earth. Commands the desert winds.",
    lore:"Dravanas is a great desert hyena 1.2 metres at the shoulder — Arenikin's sandy pup-fur has darkened to tawny earth-tones and the small dorsal ridge of the pup has thickened into a heavy shoulder-and-back crest-mane of compressed soil and pebbles, a natural feature exaggerated in this lineage into a true earth-mantle. Its paws leave deep prints. It digs vast underground lair systems that can span a hectare, and its low whooping cackle causes nearby loose soil to tremor in concentric rings." },

  32: { id:32, name:"Noxaquith", emoji:"🦑", types:["Aquatic","Poison"],
    base:{hp:77,atk:80,def:76,spa:108,spd:83,spe:53},
    learnset:[[1,"sludge_bomb"],[2,"surf"],[3,"tidecaller"],[31,"toxic"],[33,"corrosion_fang"],[34,"growl"],[38,"tackle"],[43,"blight_mist"],[48,"venoshock"],[53,"dark_pulse"],[58,"sludge_wave"],[63,"hydro_pump"],[4,"deepwater_hymn"],[41,"venom_lance"]],
    evolveTo:33, evolveLevel:44, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A venomous sea predator with eight toxic-tipped tentacles. Feared by all ocean life.",
    lore:"Noxaquith is a large hood-flaring squid about 1.2 metres long — Toxaquil's octopus frame has elongated into a streamlined squid silhouette for open-water hunting, the eight tentacles supplemented by two longer feeding-arms, and the paralytic skin-toxin concentrated into the defensive ink it now jets. Its body is deep navy blue with patterns that shift like oil on water. Poisoned ink jets blind and briefly paralyze anything caught in the cloud, serving as both camouflage and an offensive weapon." },

  117: { id:117, name:"Pneumathos", emoji:"🌪️", types:["Wind","Mental"],
    base:{hp:66,atk:57,def:69,spa:114,spd:88,spe:110},
    learnset:[[1,"air_slash"],[2,"psybeam"],[3,"psystrike"],[4,"mind_shatter"],[5,"mistveil"],[6,"zephyr_dance"],[10,"air_barrier"],[14,"wind_barrier"],[18,"air_resonance"],[22,"vacuum_wave"],[26,"cyclone_smash"],[30,"tempest_wave"],[32,"hurricane"],[34,"tornado_slam"],[38,"psychic_move"],[39,"harden"],[41,"astral_rend"],[44,"calm_mind"],[48,"hurricane_blast"],[50,"insight_flare"],[56,"thought_crush"],[62,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:240, rarity:"rare",
    desc:"A cyclone of pure psychic wind. Its thoughts create miniature tornadoes around it.",
    lore:"Pneumathos is a large wind-psychic entity 2.5 metres tall — Zephyrin's teal-blue compressed-air pillar has expanded into a swirling vortex of concentrated air with a humanoid core now visible at its centre, and the faint psychic glow has deepened to a violet tint. It reads atmospheric data from thousands of kilometres away and processes it instantly." },

  35: { id:35, name:"Undirael", emoji:"🧜", types:["Aquatic","Fairy"],
    base:{hp:65,atk:62,def:63,spa:110,spd:87,spe:103},
    learnset:[[1,"water_gun"],[2,"fairy_wind"],[3,"bubble_beam"],[4,"dazzling_gleam"],[5,"tidecaller"],[29,"surf"],[30,"tail_whip"],[36,"scratch"],[42,"moonveil"],[48,"aqua_tail"],[54,"moonblast"],[60,"hydro_pump"],[6,"deepwater_hymn"],[40,"sea_serpent_strike"]],
    evolveTo:36, evolveLevel:46, catchRate:40, expYield:222, rarity:"rare",
    desc:"A sea nymph radiating both water and fairy energy. Said to protect lost sailors.",
    lore:"Undirael is a mermaid-like creature 1.5 metres tall — Pearlith's tiny pale-violet body has grown to full mermaid stature now that the oyster shell can no longer contain it, the lower half lengthened into a deep-sea fish-tail shimmering violet and the upper retaining the humanoid torso with rose-gold core-luminescence still pulsing faintly beneath the skin. Its flowing hair is made of water-weed adorned with living sea-stars. It guides lost sailors away from dangerous reefs by projecting alluring visions of safe harbours." },

  79: { id:79, name:"Morraveth", emoji:"🌳", types:["Nature","Dark"],
    base:{hp:84,atk:101,def:80,spa:100,spd:72,spe:67},
    learnset:[[1,"razor_leaf"],[2,"energy_ball"],[3,"night_slash"],[4,"sleep_powder"],[31,"crunch"],[35,"harden"],[39,"dark_pulse"],[40,"photon_leaf"],[45,"shadow_ball"],[50,"blackout_bomb"],[55,"void_rend"],[60,"petal_blitz"],[5,"spore_burst"],[38,"leaf_blade"]],
    evolveTo:80, evolveLevel:44, catchRate:40, expYield:218, rarity:"uncommon",
    desc:"A dark vine predator that ensnares prey in shadow-infused tendrils. Ancient and cunning.",
    lore:"Morraveth is a mid-stage leshy 1 metre tall — Sylvnox's bark-skin has thickened into shoulder-plates of dark wood, and the twig-horns of its sprite-form have elongated into branching antler-buds. Withered vines coil around its forearms and its leaf-cloak has deepened to midnight green and black. It hunts by corrupting the plant growth around its prey into thorny barriers, gradually encircling the target before closing in from the shadows." },

  163: { id:163, name:"Blightalis", emoji:"🪷", types:["Nature","Toxin"],
    base:{hp:88,atk:80,def:60,spa:116,spd:83,spe:58},
    learnset:[[1,"sludge_bomb"],[2,"toxic"],[3,"poison_sting"],[4,"toxic_surge"],[5,"toxin_bloom"],[7,"bark_shield"],[10,"thorn_barrage"],[13,"leech_seed"],[15,"tox_miasma_screen"],[17,"bullet_seed"],[20,"leafblade_swirl"],[23,"magical_leaf"],[25,"tox_miasma_strike"],[28,"petal_blitz"],[31,"energy_ball"],[33,"pollen_storm"],[35,"growl"],[35,"tox_miasma_blast"],[39,"venoshock"],[42,"battle_cry"],[43,"leaf_blade"],[45,"tox_lash2"],[46,"petal_dance"],[49,"photon_leaf"],[54,"solar_beam"],[56,"venom_lance"],[63,"root_lance"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:215, rarity:"uncommon",
    desc:"A carnivorous flower of potent venom. Its blooms lure in prey before injecting toxins.",
    lore:"Blightalis is a grass-toxin creature 1.2 metres tall whose Marlix reed-stalk body has bloomed into a flower-headed humanoid. Its petals are deep crimson-purple and droop downward like a wilting bloom around its head. Its stem-body is hollow and filled with toxic nectar. It lures insects and small creatures into its central chamber, trapping and dissolving them." },

  127: { id:127, name:"Specraxis", emoji:"👻", types:["Dark","Mental"],
    base:{hp:78,atk:68,def:54,spa:107,spd:90,spe:91},
    learnset:[[1,"dark_pulse"],[2,"eclipse_shroud"],[29,"shadow_ball"],[30,"growl"],[34,"tackle"],[38,"confusion"],[42,"dreamweave"],[46,"night_slash"],[50,"nightmare_pulse"],[54,"psychic_move"],[58,"blackout_bomb"],[62,"psystrike"],[3,"dread_howl"],[39,"astral_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"A spectral fox-spirit whose shadowy form trails into smoke. Multiple ghostly tails fan out behind it, and its violet eyes seem to read minds at a glance.",
    lore:"Specraxis is a 70-centimetre kitsune-like fox-spirit, the matured form of Impefurr's mischievous lineage. Its fox silhouette is preserved but partly translucent — a smoke-grey body shading darker toward the spine and tail-tips, with deep-set violet eyes glowing through long fringes of shadow-fur. Two long shadow-tails fan from its hindquarters and seem to multiply or merge depending on the angle of viewing. It floats roughly 10 centimetres above the ground at all times, padding silently through the air, and its mind-reading is so passive it broadcasts surface thoughts back through its violet aura — anyone standing nearby in a crowded place hears their own private thoughts spoken back to them in distorted whispers, causing widespread confusion." },

  129: { id:129, name:"Voidaxis", emoji:"🌀", types:["Mental","Spectral"],
    base:{hp:83,atk:77,def:72,spa:107,spd:89,spe:75},
    learnset:[[1,"psybeam"],[2,"dark_pulse"],[3,"psychic_move"],[4,"shadow_ball"],[5,"calm_mind"],[39,"psystrike"],[40,"battle_cry"],[44,"prism_ward"],[49,"obsidian_fang"],[54,"void_rend"],[59,"mind_shatter"],[64,"hyper_beam"],[6,"mind_reader"],[41,"thought_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:248, rarity:"rare",
    desc:"A void being of mental and spectral power. Consumes light and thought with equal ease.",
    lore:"Voidaxis is a large mental-spectral entity 1.5 metres tall whose body appears to exist partially in another dimension — Cranivade's lavender-grey biped silhouette persists at the form's centre with its oversized cranium still pulsing dimly, but its edges are blurred and its outline shifts when viewed peripherally, dissolving into half-dimensional shadow. Its presence makes nearby electronic devices malfunction. It communicates only through psychic projection and has never been heard to vocalise." },

  203: { id:203, name:"Arachnalis", emoji:"🕸️", types:["Nature","Fairy"],
    base:{hp:76,atk:64,def:73,spa:101,spd:89,spe:74},
    learnset:[[1,"dazzling_gleam"],[2,"x_scissor"],[3,"string_shot"],[30,"moonblast"],[31,"charm_bloom"],[34,"harden"],[38,"pheromone_rush"],[42,"wild_tumble"],[46,"gossamer_lance"],[50,"moonveil"],[54,"bug_buzz"],[58,"fae_requiem"],[4,"chitin_guard"],[37,"mandible_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:318, rarity:"uncommon",
    desc:"A radiant spider archon that spins webs that trap bad dreams. Revered as a good omen.",
    lore:"Arachnalis is a large spider 30 cm across — Sculptweave's pale-cream body has lightened to silver-white and the rose-gold leg-banding has thinned to faint shimmer, while the fairy-touched silk it once spun has crystallised into vestigial gossamer wings capable of short gliding jumps. Its web structures are architectural in complexity. It inhabits flowered glades and decorates its webs with flower petals, creating structures that attract pollinating insects as prey." },

  56: { id:56, name:"Deepfreeze", emoji:"⚔️", types:["Ice","Metal"],
    base:{hp:69,atk:122,def:105,spa:78,spd:83,spe:79},
    learnset:[[1,"ice_punch"],[2,"flash_cannon"],[3,"icicle_crash"],[4,"iron_tail"],[5,"permafrost"],[40,"blizzard"],[41,"winter_shroud"],[44,"swords_dance"],[48,"glacial_shard"],[52,"steel_wing"],[56,"avalanche_drive"],[60,"hyper_beam"],[6,"frostfire_veil"],[37,"subzero_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:260, rarity:"rare",
    desc:"A legendary blade forged from glacier ice and pure ore. Its strikes freeze what they cut.",
    lore:"Deepfreeze is a heavily armoured bipedal warrior 1.8 metres tall — Rimeling's jointed ice-and-steel plating has thickened and fused into broad-chested armour with pauldrons of glacial ice permanently bonded to the steel underneath, and the blue veins of compressed frost now glow more brightly across the chest and shoulders. Its footsteps leave frost-rimed prints. It patrols the deepest glacier regions and engages any intruder with sword-like projections of flash-frozen air." },

  58: { id:58, name:"Irisarael", emoji:"💠", types:["Ice","Fairy"],
    base:{hp:73,atk:69,def:92,spa:95,spd:100,spe:67},
    learnset:[[1,"ice_beam"],[2,"dazzling_gleam"],[3,"tackle"],[4,"permafrost"],[29,"moonblast"],[34,"stardust_veil"],[37,"blizzard"],[40,"growl"],[46,"wish_spark"],[52,"cryo_lance"],[58,"icicle_crash"],[64,"hyper_beam"],[5,"winter_shroud"],[42,"subzero_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:218, rarity:"rare",
    desc:"A prismatic ice being of refined fairy power. Its crystalline body bends light into rainbows.",
    lore:"Irisarael is a graceful, winged fairy creature 1 metre tall — Speculith's stubby wing-buds have unfurled into enormous flat ice-crystal wings showing the full rainbow iridescence its juvenile form only hinted at, and the lens-plate face has rounded into a proper fairy visage with eyes glinting through the prismatic glass. Its slender body is pale lavender-white. It inhabits frozen waterfalls, sleeping anchored to the ice surface by small ice anchors on its heels." },

  60: { id:60, name:"Boreadrake", emoji:"🐉", types:["Ice","Draconic"],
    base:{hp:84,atk:104,def:93,spa:110,spd:83,spe:76},
    learnset:[[1,"ice_beam"],[2,"dragon_pulse"],[3,"icicle_crash"],[4,"permafrost"],[41,"blizzard"],[44,"swords_dance"],[48,"dragon_dance"],[49,"outrage"],[52,"glacial_shard"],[56,"avalanche_drive"],[60,"ancient_breath"],[64,"hyper_beam"],[5,"winter_shroud"],[38,"drake_rush"]],
    evolveTo:null, evolveLevel:null, catchRate:10, expYield:285, rarity:"rare",
    desc:"A dragon cloaked in the aurora. Its roar scatters ribbons of colored ice across the sky.",
    lore:"Boreadrake is an imposing ice dragon 7 metres long — Lunaveris's serpentine 5-metre body has thickened and broadened into a 10-metre wingspan, and the blue-and-silver scales of its juvenile form have darkened to thick blue-white edged in navy with a pale silver underbelly. Ancient artwork shows it guarding the northern glaciers for millennia. When it exhales, the air solidifies into ice shards that rain down for hundreds of metres." },

  // ===== ADDITIONAL COMMON/UNCOMMON/RARE LUMOS =====

  // ===== FIRE/PSYCHIC =====
  22: { id:22, name:"Hallucigaze", emoji:"🔥", types:["Fire","Mental"],
    base:{hp:35,atk:41,def:37,spa:58,spd:56,spe:68},
    learnset:[[1,"ember",[20,"cinderwhirl"]],[1,"confusion"],[9,"psybeam"],[17,"flamethrower"],[21,"recover"],[25,"psychic_move"],[33,"fire_blast",[5,"scorch_veil"]],[36,"magma_surge"],[3,"embercloak"],[31,"inferno"]],
    evolveTo:23, evolveLevel:28, catchRate:150, expYield:88, rarity:"common",
    desc:"A psychic flame sprite. Its fire burns hotter when it concentrates its mind.",
    lore:"Hallucigaze is a lightly built snake-headed lizard about 1 metre long with bright amber scales marked by psychic-violet patterns along the flanks. Its eyes glow purple when focusing energy. It preys on animals much larger than itself by implanting sensory illusions that disorient them before striking. The illusions a Hallucigaze projects to disorient prey occasionally turn back on the projector itself, showing the creature walking upright on heavy hindlegs with a great mane of fire. It treats these visions with reverence: half-prophecy, half-memory of Ignitheon." },

  23: { id:23, name:"Pyraxis", emoji:"🦎", types:["Fire","Mental"],
    base:{hp:68,atk:64,def:68,spa:103,spd:81,spe:98},
    learnset:[[1,"flamethrower"],[2,"psychic_move"],[3,"scorch_veil"],[30,"fire_blast"],[32,"battle_cry"],[36,"calm_mind"],[40,"dreamweave"],[44,"heat_wave"],[48,"psystrike"],[52,"mind_shatter"],[56,"inferno"],[60,"solar_flare"],[4,"embercloak"],[38,"thought_crush"]],
    evolveTo:24, evolveLevel:44, catchRate:35, expYield:235, rarity:"rare",
    desc:"A bipedal saurian whose feathered mane is just beginning to bloom. Channels heat and thought through long, claw-tipped forelimbs to paralyse prey before striking.",
    lore:"Pyraxis is a tall bipedal saurian about 1.5 metres at the shoulder, walking upright on heavy hindlegs while its long upper limbs swing free or sweep forward to claw at prey. Hallucigaze's snake-headed silhouette is gone, but the violet psychic markings that pulsed along its flanks have spread to its underside, and its eyes still glow violet when focusing energy. Its scaled hide is flame-red across the back and deepens to violet down the underside; a stiff feathered ruff has begun to grow around its broadening jaw — the first hint of the leonine final form to come. Slitted pupils glow violet when it focuses, and its forelimbs leave faint heat shimmers in the air as it channels both thermal and psychic energy along their length. It stalks arid ruins on near-silent footfalls, locking prey in a brief telepathic shock before incinerating it with a concentrated jet of flame from the throat." },

  // ===== GRASS/ELECTRIC =====
  75: { id:75, name:"Sylvolt", emoji:"🦌", types:["Nature","Electric"],
    base:{hp:40,atk:63,def:39,spa:60,spd:54,spe:59},
    learnset:[[1,"vine_whip",[22,"volt_surge"]],[1,"thunder_shock"],[8,"razor_leaf"],[16,"spark"],[20,"recover"],[24,"energy_ball"],[32,"thunderbolt",[5,"sleep_powder"]],[36,"plasma_strike"],[3,"spore_burst"],[31,"petal_blitz"]],
    evolveTo:76, evolveLevel:22, catchRate:190, expYield:78, rarity:"common",
    desc:"A bright-green fawn with leaf-tipped antler buds that crackle with static. Bounds through underbrush leaving a faint trail of leaf-shed and sparks.",
    lore:"Sylvolt is a lithe forest fawn about 70 centimetres at the shoulder, with a coat of vivid green that shades into pale moss-yellow along its underbelly. Its short stubby antler-buds have not yet hardened into wood — instead, each is tipped with a small cluster of broad photosynthetic leaves striped in electric yellow, which crackle with static whenever they catch sunlight. It bounds through forest underbrush at remarkable speed, charging the leaf-buds in storm-laden afternoons and discharging tiny sparks into the soil along its trails." },

  76: { id:76, name:"Sparkwood", emoji:"🌳", types:["Nature","Electric"],
    base:{hp:81,atk:78,def:68,spa:111,spd:84,spe:68},
    learnset:[[1,"razor_leaf"],[2,"recover"],[3,"vine_whip"],[4,"volt_surge"],[5,"sleep_powder"],[22,"energy_ball"],[29,"thunderbolt"],[30,"swords_dance"],[38,"petal_blitz"],[46,"verdant_surge"],[54,"thunder"],[62,"hyper_beam"],[6,"spore_burst"],[42,"canopy_crash"]],
    evolveTo:77, evolveLevel:44, catchRate:45, expYield:318, rarity:"uncommon",
    desc:"An adolescent stag whose growing antlers have hardened into living bark, branching skyward and humming with stored lightning. Acts as a roaming lightning rod in storms.",
    lore:"Sparkwood is a 1.3-metre adolescent stag whose Sylvolt antler-buds have grown into a full crown of branching, bark-covered antlers — each rack 60 centimetres across, rough as old wood and shot through with crackling yellow electric veins. Its body has darkened into a rich forest-green coat with brown bark-textured plates along its shoulders and flanks. During storms it acts as a roaming lightning rod, absorbing strikes through the antlers and channelling the charge down through its hooves into the forest roots beneath, fertilising entire hillsides." },

  // ===== ROCK/DARK =====
  132: { id:132, name:"Volcascale", emoji:"🪨", types:["Earth","Dark"],
    base:{hp:73,atk:69,def:75,spa:48,spd:62,spe:32},
    learnset:[[1,"rock_throw",[22,"obsidian_crash"]],[1,"bite"],[10,"headbutt"],[18,"crunch"],[26,"rock_slide"],[30,"landslide"],[34,"dark_pulse"],[42,"stone_edge",[5,"granite_wall"]],[3,"petrify_gaze"],[32,"quarry_crush"]],
    evolveTo:133, evolveLevel:30, catchRate:130, expYield:97, rarity:"common",
    desc:"A rock monster that absorbs shadow energy. Moves imperceptibly slow but hits with shattering force.",
    lore:"Volcascale is a spiny rock-dark creature 60 cm long resembling a horned lizard made of volcanic obsidian. Its body is jet black with razor-sharp ridges. It reflects almost no light. It inhabits old lava tubes and volcanic glass fields, and its presence is detected mainly by the sound of its obsidian scales clicking together." },

  133: { id:133, name:"Monolithox", emoji:"🗿", types:["Earth","Dark"],
    base:{hp:102,atk:114,def:103,spa:62,spd:70,spe:39},
    learnset:[[1,"rock_slide"],[2,"landslide"],[3,"crunch"],[4,"granite_wall"],[31,"dark_pulse"],[35,"battle_cry"],[39,"stone_edge"],[40,"abyssal_snare"],[45,"shadow_ball"],[50,"blackout_bomb"],[55,"earthquake"],[60,"hyper_beam"],[5,"petrify_gaze"],[38,"malice_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:230, rarity:"uncommon",
    desc:"A living monolith of darkened stone. Ancient civilizations worshipped it as a god of night.",
    lore:"Monolithox is a hulking obsidian saurian 3 metres tall — Volcascale's obsidian horned-lizard frame has grown massive and its sharp-ridged back has fused into a towering monolithic plate-shell. It appears to be a standing stone until it moves; the basalt-dark plate is nearly featureless except for two deep-set glowing red eyes set in a low-slung saurian skull. It moves extremely slowly but is virtually indestructible, its body having the hardness of natural obsidian." },

  // ===== POISON/BUG =====
  164: { id:164, name:"Blightmite", emoji:"🐛", types:["Poison"],
    base:{hp:56,atk:37,def:55,spa:65,spd:52,spe:30},
    learnset:[[1,"poison_sting",[20,"venom_lance"]],[1,"string_shot"],[8,"bug_bite"],[16,"sludge_bomb"],[21,"recover"],[24,"x_scissor"],[32,"toxic",[5,"toxic_surge"]],[36,"sonic_buzz"],[3,"toxin_bloom"],[31,"mandible_crush"]],
    evolveTo:165, evolveLevel:20, catchRate:220, expYield:65, rarity:"common",
    desc:"A larva coated in toxic slime. Leaves a trail of venom wherever it crawls.",
    lore:"Blightmite is a small caterpillar-like poison creature 10 cm long. Its body is dark purple-black with short bristle-hairs that release toxins on contact. It feeds on the toxic leaves that other creatures avoid, sequestering their poisons into its own body and becoming increasingly dangerous as it eats." },

  165: { id:165, name:"Venowarn", emoji:"🦋", types:["Poison","Wind"],
    base:{hp:77,atk:69,def:57,spa:106,spd:84,spe:92},
    learnset:[[1,"sludge_bomb"],[2,"toxic_surge"],[20,"recover"],[25,"quick_attack"],[29,"toxic"],[30,"nerve_agent"],[35,"venoshock"],[40,"air_slash"],[45,"putrid_pulse"],[50,"acid_rain"],[55,"cocoon_burst"],[60,"bug_buzz"],[3,"toxin_bloom"],[39,"leech_life"]],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:185, rarity:"uncommon",
    desc:"A venomous moth that releases toxic scales on the wind. A cloud of them can fell a Lumori quickly.",
    lore:"Venowarn is a large poison-wind butterfly with a 50 cm wingspan — Blightmite's dark purple-black caterpillar body has metamorphosed into deep black wings, with the bristle-hair toxin now sequestered into vivid purple warning patterns. It releases a cloud of toxic scales when startled, and the scales cause skin irritation and respiratory distress in creatures that inhale them. It inhabits dense poisonous forest regions." },

  // ===== STEEL/GROUND =====
  153: { id:153, name:"Dentshaft", emoji:"⚙️", types:["Metal","Earth"],
    base:{hp:60,atk:63,def:85,spa:30,spd:50,spe:35},
    learnset:[[1,"metal_claw",[22,"forge_strike"]],[1,"mud_shot"],[9,"harden"],[17,"flash_cannon"],[20,"tail_whip"],[25,"earthquake"],[33,"iron_tail",[5,"magnetize"]],[36,"boulder_roll"],[3,"ironskin"],[31,"scorched_earth"]],
    evolveTo:154, evolveLevel:26, catchRate:160, expYield:90, rarity:"common",
    desc:"A small ore elemental born in deep mine shafts. Tough as iron and twice as stubborn.",
    lore:"Dentshaft is a compact metal-earth creature 60 cm tall shaped like a short humanoid miner. Its steel body is scuffed and dented from constant digging. It uses its broad flat hands as shovels to excavate ore veins. It never stops working — even while dormant it taps at nearby rock surfaces reflexively. Every handful of ore a Dentshaft processes leaves a microscopic amount of metal and earth bonded into its body. The slow accretion compounds across years of mine-work into the 2.5-metre golem frame Terragolem eventually attains." },

  154: { id:154, name:"Terragolem", emoji:"🤖", types:["Metal","Earth"],
    base:{hp:95,atk:108,def:116,spa:52,spd:79,spe:30},
    learnset:[[1,"flash_cannon"],[2,"earthquake"],[3,"magnetize"],[30,"iron_tail"],[31,"battle_cry"],[34,"loam_leech"],[38,"rock_slide"],[42,"temper_edge"],[46,"body_slam"],[50,"earth_power"],[54,"tungsten_ram"],[58,"anvil_drop"],[4,"ironskin"],[37,"magnitude"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:222, rarity:"uncommon",
    desc:"A forged golem of steel and compressed earth. Was created to guard ancient mines.",
    lore:"Terragolem is a massive metal-earth golem 2.5 metres tall — Dentshaft's dented-and-scuffed humanoid miner-frame has expanded into a tremendous assembly of metal and compressed earth, and the reflexive surface-tapping of its juvenile form has become a deep tremor through the ground with every step. The ground trembles slightly with each of its steps. It is largely indifferent to the world around it and moves at its own slow pace, but obstacles that cannot be sidestepped are simply absorbed." },

  // ===== DRAGON/GROUND =====
  106: { id:106, name:"Geodrak", emoji:"🐣", types:["Draconic"],
    base:{hp:40,atk:59,def:63,spa:57,spd:42,spe:64},
    learnset:[[1,"scratch",[22,"terra_spike"]],[1,"dragon_breath"],[10,"mud_shot"],[18,"dragon_claw"],[20,"tail_whip"],[26,"earthquake"],[34,"dragon_pulse",[5,"dragon_dance"]],[36,"sinkhole_maw"],[3,"draconic_roar"],[31,"dragon_rush"]],
    evolveTo:107, evolveLevel:32, catchRate:80, expYield:94, rarity:"uncommon",
    desc:"A burrowing dragon hatchling. Digs deep tunnels and breathes sand-laden gusts.",
    lore:"Geodrak is a hatchling dragon about 40 cm long with rough grey-brown scales and two stumpy wing-buds on its back. Its small claws are already powerful diggers. It hatches from eggs buried in volcanic soil and immediately begins tunnelling to locate its first meal. Newly-hatched Geodrak often gather at cave mouths and spread their stumpy wing-buds toward the open sky. The preparation is futile; Quakeon, the mature ground-dragon they grow into, only ever achieves short downhill glides. True flight remains a hereditary aspiration this evolution will never fulfil." },

  107: { id:107, name:"Quakeon", emoji:"🐲", types:["Draconic","Earth"],
    base:{hp:86,atk:108,def:96,spa:94,spd:64,spe:69},
    learnset:[[1,"dragon_claw"],[2,"earthquake"],[3,"dragon_dance"],[32,"dragon_pulse"],[36,"battle_cry"],[40,"draconic_roar"],[44,"tremor_stomp"],[48,"earth_power"],[52,"eon_crash"],[56,"ancient_breath"],[60,"outrage"],[64,"hyper_beam"],[4,"primordial_roar"],[39,"scale_storm"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:260, rarity:"rare",
    desc:"A subterranean dragon that causes quakes with each step. Rules the deep underground.",
    lore:"Quakeon is a mature ground-dragon 2 metres long — Geodrak's stumpy wing-buds have grown into fully developed wings (still too short for sustained flight but useful for gliding downhill), and the rough grey-brown hatchling scales have darkened to broad overlapping dark-bronze plates. It excavates vast cavern systems using its tail as a battering ram, and ground above its tunnels often subsides unexpectedly." },

  // ===== NORMAL/PSYCHIC =====
  189: { id:189, name:"Woolcalm", emoji:"🐑", types:["Normal","Mental"],
    base:{hp:49,atk:43,def:42,spa:63,spd:68,spe:58},
    learnset:[[1,"tackle",[22,"future_echo"]],[1,"confusion"],[9,"growl"],[17,"psybeam"],[25,"recover"],[29,"dreamweave"],[33,"psychic_move"],[41,"calm_mind",[5,"tail_whip"]],[3,"leer"],[32,"psycho_cut"]],
    evolveTo:190, evolveLevel:24, catchRate:180, expYield:78, rarity:"common",
    desc:"A woolly psychic creature that reads emotional auras. Very empathetic and gentle.",
    lore:"Woolcalm is a small psychic sheep about 40 cm at the shoulder with soft white wool and calm violet eyes. Its wool carries a faint static charge from accumulated psychic energy. It grazes peacefully in highland meadows and the simple act of standing near it produces a remarkable sense of mental clarity." },

  190: { id:190, name:"Aetherflock", emoji:"🐏", types:["Normal","Mental"],
    base:{hp:88,atk:57,def:67,spa:110,spd:103,spe:75},
    learnset:[[1,"psybeam"],[2,"future_echo"],[3,"growl"],[24,"recover"],[30,"psychic_move"],[31,"vital_pulse"],[36,"wild_tumble"],[38,"calm_mind"],[42,"body_slam"],[48,"thought_crush"],[54,"psystrike"],[60,"hyper_beam"],[4,"tail_whip"],[40,"headbutt"]],
    evolveTo:null, evolveLevel:null, catchRate:50, expYield:200, rarity:"uncommon",
    desc:"A dreaming flock manifestation. Said to appear to sleeping trainers before a great trial.",
    lore:"Aetherflock is a medium psychic sheep 70 cm at the shoulder — Woolcalm's soft white wool has thickened and lightened to silvery-white that drifts gently in an invisible wind even in still air, and the faint static charge of its juvenile fleece now manifests as a soft night-glow. Entire flocks graze on isolated mountain plateaux and are said to collectively generate powerful psychic fields." },

  // ===== BUG/GROUND =====
  204: { id:204, name:"Muddite", emoji:"🐛", types:["Nature","Earth"],
    base:{hp:62,atk:68,def:73,spa:34,spd:35,spe:45},
    learnset:[[1,"bug_bite",[22,"chitin_guard"]],[1,"mud_shot"],[10,"string_shot"],[18,"x_scissor"],[20,"leer"],[26,"earthquake"],[34,"bug_buzz",[5,"compound_glare"]],[36,"swarm_dive"],[3,"moth_dust"],[31,"magnitude"]],
    evolveTo:205, evolveLevel:24, catchRate:170, expYield:88, rarity:"common",
    desc:"A burrowing grub-bug that aerates clay soil. Packs mud around itself for protection when threatened.",
    lore:"Muddite is a small grub-like bug creature 6 cm long with a soft muddy-brown body and short digging limbs. It lives entirely in clay-rich soil and packs mud around itself to form a protective case when threatened. It is an important aerator of heavy clay soils and supports plant root growth." },

  205: { id:205, name:"Quarrix", emoji:"🪲", types:["Nature","Earth"],
    base:{hp:90,atk:108,def:93,spa:68,spd:58,spe:65},
    learnset:[[1,"x_scissor"],[2,"string_shot"],[24,"earthquake"],[29,"swords_dance"],[31,"bug_buzz"],[34,"sandstrike"],[39,"rock_slide"],[44,"mandible_crush"],[49,"cocoon_burst"],[54,"earth_power"],[59,"stone_edge"],[64,"hyper_beam"],[3,"chitin_guard"],[41,"drill_run"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:215, rarity:"uncommon",
    desc:"An armored ground beetle of incredible toughness. Plows through solid bedrock with ease.",
    lore:"Quarrix is a medium beetle 15 cm long — Muddite's soft muddy-brown grub-body has hardened into a quartzite-grey shell with the texture of rough stone, and its short digging limbs have lengthened into powerful forelegs that crack rock as easily as its juvenile form once aerated clay. Its shell surface has the texture of rough stone. It inhabits rocky hillsides and buries itself in gravel, extracting mineral nutrients from the stone it processes through a specialised digestive system." },

  // ===== WIND/ICE =====
  61: { id:61, name:"Gelspike", emoji:"🦔", types:["Ice","Poison"],
    base:{hp:34,atk:45,def:36,spa:64,spd:47,spe:93},
    learnset:[[1,"poison_sting"],[1,"powder_snow"],[4,"ice_shard"],[8,"harden"],[10,"frost_jab"],[12,"frost_bite"],[14,"freeze_dry"],[16,"permafrost"],[18,"icicle_spear"],[22,"cryo_lance"],[24,"venom_lance"],[29,"sludge_bomb"],[32,"ice_beam"],[40,"venoshock",[5,"mistveil"]],[3,"toxic"],[31,"stinger_volley"]],
    evolveTo:62, evolveLevel:26, catchRate:180, expYield:78, rarity:"common",
    desc:"A small ice hedgehog whose translucent quills are tipped with paralytic frost-venom. A faintly numbing chill-mist hangs around it at all times.",
    lore:"Gelspike is a compact creature about 60 cm tall shaped like a hedgehog. Its body is pale ice-blue and covered in dozens of sharp translucent ice spines that project outward in all directions, each tipped with a clear bead of paralytic frost-venom that crystallises on contact with air. A toxic chill-mist drifts around it constantly — breathable but distinctly numbing to anything that lingers nearby. It rolls into a venomous spiky ball when threatened, allowing wind to carry it across frozen plains while leaving a faint trail of stinging mist behind." },

  62: { id:62, name:"Gelwing", emoji:"🦔", types:["Ice","Poison"],
    base:{hp:74,atk:66,def:61,spa:106,spd:78,spe:92},
    learnset:[[1,"poison_sting"],[2,"venom_lance"],[3,"mistveil"],[4,"toxic"],[10,"icicle_spear"],[16,"freeze_dry"],[22,"blizzard_charge"],[26,"icicle_smash"],[29,"ice_beam"],[31,"battle_cry"],[36,"sleet_barrage"],[37,"putrid_pulse"],[40,"sludge_bomb"],[41,"stinger_volley"],[46,"icicle_crash"],[51,"avalanche_drive"],[56,"blizzard"],[61,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:215, rarity:"uncommon",
    desc:"A large ice-porcupine whose blade-quills carry a paralytic frost-venom. Launches volleys of toxic spines and tucks into a wind-borne ball of poisoned ice when threatened.",
    lore:"Gelwing is a large adult ice-porcupine roughly 1.2 metres long and 70 cm at the shoulder — Gelspike's pale ice-blue hedgehog body has lengthened and its short translucent spines have grown into long blade-quills along its back, flanks, and tail — translucent ice tipped in pale blue, the longest reaching nearly 40 centimetres — and each one weeps a slow bead of paralytic frost-venom that freezes solid on whatever flesh it pierces. It hunts mountain prey by detecting their breath on the wind and launching volleys of envenomed quills with sharp shrugs of its haunches; in flight or pursuit it folds entirely into a wind-borne rolling sphere, picked up by glacial gusts and rocketed across frozen passes leaving a thin trail of toxic mist in its wake. Spent quills regrow within hours from its constantly forming inner frost." },

  // ===== FAIRY/STEEL =====
  145: { id:145, name:"Faerrin", emoji:"📌", types:["Fairy","Metal"],
    base:{hp:35,atk:46,def:71,spa:68,spd:52,spe:51},
    learnset:[[1,"fairy_wind",[22,"ironskin"]],[1,"metal_claw"],[9,"dazzling_gleam"],[17,"flash_cannon"],[20,"recover"],[25,"moonblast"],[33,"iron_tail",[5,"sweet_kiss"]],[36,"gossamer_lance"],[3,"stardust_veil"],[31,"glitter_storm"]],
    evolveTo:146, evolveLevel:26, catchRate:170, expYield:82, rarity:"common",
    desc:"A tiny fairy-knight made of living silver. Fiercely guards those it bonds with.",
    lore:"Faerrin is a petite fairy-steel creature 40 cm tall resembling a humanoid knight in tiny armour. Its armour is forged from a pale silver-gold alloy that catches fairy light and redirects it as a dazzling display. It inhabits ruined ancient fortresses and maintains guard even centuries after the fort's abandonment." },

  146: { id:146, name:"Shinarith", emoji:"🛡️", types:["Fairy","Metal"],
    base:{hp:70,atk:67,def:107,spa:87,spd:95,spe:54},
    learnset:[[1,"dazzling_gleam"],[2,"flash_cannon"],[3,"moonblast"],[4,"metal_claw"],[5,"sweet_kiss"],[30,"iron_tail"],[32,"growl"],[38,"tackle"],[44,"steel_wing"],[50,"temper_edge"],[56,"moonveil"],[62,"hyper_beam"],[6,"stardust_veil"],[41,"forge_strike"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:230, rarity:"rare",
    desc:"An armored fairy sentinel that never abandons its post. Its shield can repel any curse.",
    lore:"Shinarith is a medium fairy-steel guardian 90 cm tall — Faerrin's silver-gold knight-alloy has been forged anew into gleaming platinum armour decorated with fairy-glyph engravings, and the dazzling light-redirection of its juvenile form now shines through gaps in the armour as inner warm gold tones. It is fiercely loyal and will defend any being it has bonded with from threats many times its size." },

  317: { id:317, name:"Temporith", emoji:"⏳", types:["Mental","Draconic"],
    base:{hp:97,atk:100,def:99,spa:132,spd:107,spe:83},
    learnset:[[1,"confusion"],[1,"dragon_breath"],[7,"psybeam"],[14,"calm_mind"],[21,"dragon_claw"],[28,"psychic_move"],[35,"dragon_pulse"],[42,"prism_ward"],[49,"astral_rend"],[56,"ancient_breath"],[63,"temporal_rift"],[70,"neural_storm"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Veil of Time. Said to exist at the crossing point of past and future.",
    lore:"Temporith is a psychic-dragon 3 metres long whose scales appear to flicker between states of existence — slightly out of phase with the present moment. Its outline is never quite sharp. It inhabits places where history is dense — ancient battlefields, old libraries — feeding on residual temporal energy." },

  318: { id:318, name:"Gaiavorn", emoji:"🌍", types:["Earth","Nature"],
    base:{hp:103,atk:125,def:104,spa:92,spd:89,spe:75},
    learnset:[[1,"mud_shot"],[1,"vine_whip"],[7,"sandstrike"],[14,"razor_leaf"],[21,"earth_power"],[28,"seed_bomb"],[35,"clay_armor"],[42,"briar_lash"],[49,"earthquake"],[56,"grove_wrath"],[63,"worldseed_quake"],[70,"verdant_surge"],[77,"hyper_beam"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Spirit of the Land. Every continent in Lumoria trembles at its footfall.",
    lore:"Gaiavorn is a ground-grass titan 4 metres tall resembling a towering elemental figure whose lower body is packed earth and roots and whose upper body is a living forest canopy. Trees grow from its shoulders. It moves once per decade at most and its displacement creates new valleys and ridges." },

  319: { id:319, name:"Voidraxis", emoji:"🌌", types:["Dark","Stellar"],
    base:{hp:95,atk:93,def:89,spa:131,spd:113,spe:88},
    learnset:[[1,"fairy_wind"],[1,"bite"],[7,"dark_pulse"],[11,"starlight_lock"],[14,"dazzling_gleam"],[21,"eclipse_shroud"],[28,"moonblast"],[32,"nebula_burst"],[35,"abyssal_snare"],[42,"shadow_ball"],[49,"dread_howl"],[55,"cosmic_storm"],[56,"glitter_storm"],[63,"soul_rend"],[70,"fae_requiem"],[77,"hyper_beam"],[80,"astral_blast"]],
    evolveTo:null, evolveLevel:null, catchRate:3, expYield:315, rarity:"legendary",
    desc:"The Legendary Void Star. A being of absolute darkness ringed by stellar light. Where it passes, stars blink out.",
    lore:"Voidraxis is a dark-stellar creature 1 metre at the shoulder with a body that appears as a perfectly shaped void in reality — an absence of light surrounded by a rim of pale stellar luminescence. It inhabits boundary spaces between light and dark and feeds on ambient emotional energy at dawn and dusk." },

  320: { id:320, name:"Galvathon", emoji:"⚡", types:["Metal","Electric"],
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
    lore:"Vortexathos is a massive eagle-wind creature with a 4-metre wingspan — Zephyrel's juvenile electric-blue feather-lines have brightened and now trace the leading edges of its much-larger wings, with feathers grey-white above and dark charcoal beneath. It circles high above storm systems and descends to strike prey with a diving electrical vortex that scours the ground." },

  46: { id:46, name:"Frostmere", emoji:"🦭", types:["Ice","Electric"],
    base:{hp:90,atk:65,def:90,spa:109,spd:92,spe:59},
    learnset:[[1,"powder_snow"],[1,"thunder_shock"],[2,"ice_beam"],[3,"permafrost"],[4,"winter_shroud"],[5,"cryo_lance"],[8,"ice_shard"],[12,"frost_bite"],[16,"frost_jab"],[20,"snow_veil"],[24,"cold_focus"],[28,"arctic_calm"],[33,"blizzard"],[38,"voltaic_fang"],[42,"hoarfrost_bite"],[43,"harden"],[46,"icicle_crash"],[50,"ion_cannon"],[54,"glacial_tomb"],[58,"ball_lightning"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:205, rarity:"uncommon",
    desc:"A gelatinous pinniped of compacted living frost. Bioluminescent pulses ripple through its translucent body, mapping prey by their electric fields.",
    lore:"Frostmere is a gelatinous deep-ocean creature 1.5 metres long that has condensed its drifting medusa form into a more solid, seal-shaped silhouette. Its translucent body — Slatis's free-floating jellyfish bell — is now packed into a streamlined pinniped outline of bluish-white frozen jelly, sheathed in a fine layer of silver-white frost crystals that mimic the look of fur. Pale eyes the colour of deep glacier melt sit forward in its head, and the trailing tendrils of its base form persist as faint translucent streamers behind its flippers. Subtle bioluminescent pulses ripple through its gel-body in slow waves, illuminating it from within and serving as the visible discharge of an internal organ that maps the electric fields of every living thing nearby — its entire body functions as a single conductive sensor, hunting through polar water channels by reading prey's heartbeats from metres away rather than relying on sight." },

  161: { id:161, name:"Mistbane", emoji:"🦠", types:["Poison","Wind"],
    base:{hp:70,atk:75,def:54,spa:102,spd:80,spe:105},
    learnset:[[1,"poison_sting"],[1,"downdraft"],[2,"sludge_bomb"],[3,"air_slash"],[4,"mycelia_net"],[31,"toxic"],[36,"venoshock"],[40,"tempest_wrath"],[45,"corrosion_fang"],[50,"hurricane"],[55,"venom_lance"],[60,"sludge_wave"],[5,"miasma_cloud"],[43,"wing_attack"]],
    evolveTo:null, evolveLevel:null, catchRate:45, expYield:195, rarity:"uncommon",
    desc:"A drifting cloud-swarm of microscopic miasma-flies that moves and feeds as one creature. The swarm is denser at its centre, where a queen hovers.",
    lore:"Mistbane is a 1-metre cloud-swarm of countless microscopic miasma-flies — Miasmafly's solo form has fractured into countless tiny offspring-flies, each so small as to be barely visible individually but bound together by shared chemical signals into a single drifting collective. At its centre, sometimes glimpsed when the swarm thins, hovers a single larger queen-fly with a 30 centimetre wingspan whose pheromone trail directs the others. The swarm-cloud flows, condenses, and disperses but never fully dissolves; it inhabits bogs and toxic marshland, blending with natural mist and slowly sapping the vitality of any creature breathing the air it occupies." },

  186: { id:186, name:"Continemic", emoji:"🕊️", types:["Normal","Wind"],
    base:{hp:88,atk:73,def:55,spa:83,spd:70,spe:111},
    learnset:[[1,"tackle"],[1,"downdraft"],[2,"quick_attack"],[3,"air_slash"],[4,"body_slam"],[29,"wing_attack"],[34,"wild_tumble"],[38,"momentum_rush"],[43,"hurricane"],[48,"battle_cry"],[53,"hyper_beam"],[58,"gale_cannon"],[5,"zephyr_dance"],[41,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:185, rarity:"uncommon",
    desc:"A free-spirited wind wanderer that soars over continents in a single day, carried effortlessly on warm thermals.",
    lore:"Continemic is a large albatross-like wind-normal bird with a 2.5-metre wingspan — Hoverrow's pale cream feathers have whitened to pure white above and pale grey below, and the perpetual-hover habit that atrophied its juvenile feet has matured into the dynamic soaring that lets it cross continents in a day without landing. It can fly continuously for months without landing using dynamic soaring — extracting energy from the boundary between fast and slow wind layers near the ocean surface." },

  188: { id:188, name:"Plentorus", emoji:"🐗", types:["Normal"],
    base:{hp:105,atk:94,def:89,spa:60,spd:70,spe:62},
    learnset:[[1,"tackle"],[1,"growl"],[2,"headbutt"],[3,"body_slam"],[4,"harden"],[31,"swords_dance"],[35,"wild_tumble"],[39,"recover"],[43,"momentum_rush"],[48,"body_slam"],[53,"instinct_slash"],[58,"hyper_beam"],[5,"battle_cry"],[40,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:188, rarity:"uncommon",
    desc:"A heavyset wild boar whose back-bristles have hardened into a ridge of quill-like spines. Constantly forages, scattering seeds wherever its winter caches are forgotten.",
    lore:"Plentorus is a heavyset wild boar around 90 cm at the shoulder, the fully grown form of the Norindel lineage. Its broad chest and broad sensitive snout still recognise it as a true suidae, but the soft pink hide of its juvenile stage has darkened to a coarse pale-brown coat — and the bristles along its spine, shoulders, and rump have stiffened over the seasons into rows of sharp quill-like spines tipped in cream. It forages constantly through forest underbrush and builds elaborate winter larders, hiding food in dozens of separate caches; it rarely remembers them all, and the forgotten ones germinate the following spring into thickets that mark its old territories." },

  194: { id:194, name:"Lithomere", emoji:"🦀", types:["Aquatic","Mineral"],
    base:{hp:95,atk:100,def:115,spa:72,spd:85,spe:75},
    learnset:[[1,"scratch"],[1,"water_gun"],[2,"aqua_tail"],[3,"stalactite_drop"],[4,"harden"],[5,"tidecaller"],[15,"mineral_crystal_shard"],[18,"ancient_tide"],[25,"mineral_resonance"],[35,"shard_burst_m"],[39,"rock_slide"],[42,"swords_dance"],[43,"hydro_pump"],[47,"stone_edge"],[52,"tidal_crush"],[56,"crystal_lance"],[60,"sea_serpent_strike"],[64,"quarry_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:248, rarity:"rare",
    desc:"A colossal ancient shore titan. Its shell is older than recorded history, layered with oceanic minerals.",
    lore:"Lithomere is a crab-like water-mineral creature 60 cm across with a shell of compressed coastal rock — Rugothon's massive barnacle-encrusted carapace has compressed down through dense mineral deposition into a smaller but far denser shell, and the eight digging legs have shortened into wedge-shaped braces that lock its body into rock crevices during low tide, sealing gaps with a secreted mineral cement. Its shell grows thicker with each passing year." },

  196: { id:196, name:"Frigolith", emoji:"💎", types:["Ice","Mineral"],
    base:{hp:87,atk:77,def:127,spa:103,spd:108,spe:48},
    learnset:[[1,"powder_snow"],[1,"stalactite_drop"],[2,"ice_beam"],[3,"rock_slide"],[4,"harden"],[5,"permafrost"],[10,"cold_focus"],[15,"shard_form"],[18,"cryogenic_field"],[20,"mineral_heal"],[22,"icicle_smash"],[25,"mineral_lattice"],[28,"frost_armor"],[30,"ice_hammer"],[35,"crystal_spear"],[41,"blizzard"],[43,"harden"],[45,"stone_edge"],[49,"crystal_lance"],[53,"icicle_crash"],[57,"glacial_tomb"],[61,"quarry_crush"],[65,"cryo_lance"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:258, rarity:"rare",
    desc:"A titanic crystal colossus forged from eons of glacial pressure. Its body refracts light into blinding aurora beams.",
    lore:"Frigolith is an ice-mineral creature 1 metre long resembling a boulder partially submerged in permafrost — Prismolith's purple amethyst crystals have darkened and refrozen into crystalline ice formations that have grown through cracks in its rock body over centuries, and its mobile legs have rooted into the tundra it must now remain in to survive. In winter it becomes nearly invisible against frozen tundra. Warming weather causes it distress as its ice components begin to melt." },

  40: { id:40, name:"Marevanos", emoji:"🐋", types:["Aquatic","Wind"],
    base:{hp:84,atk:87,def:80,spa:108,spd:90,spe:101},
    learnset:[[1,"surf"],[1,"downdraft"],[2,"aqua_tail"],[3,"air_slash"],[4,"tidecaller"],[43,"hydro_pump"],[47,"hurricane"],[51,"tidal_crush"],[55,"tempest_wrath"],[59,"sea_serpent_strike"],[63,"ocean_tempest"],[67,"whirlpool_dive"],[5,"deepwater_hymn"],[48,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A sovereign of sky and sea. It breaches into storm clouds and dives into ocean trenches with equal majesty.",
    lore:"Marevanos is a winged cetacean 6 metres long whose flat broad head and pectoral wing-fins retain the manta silhouette of Gossafin's juvenile form; its streamlined blue-grey body trails into a powerful tail, and its wing-fins catch both wind and water. It breaches spectacularly, launching fully airborne and gliding long distances. Sailors consider spotting it a good-weather omen." },

  131: { id:131, name:"Necrothon", emoji:"🌑", types:["Dark","Nature"],
    base:{hp:94,atk:89,def:99,spa:104,spd:90,spe:74},
    learnset:[[1,"bite"],[1,"vine_whip"],[2,"dark_pulse"],[3,"seed_bomb"],[4,"eclipse_shroud"],[41,"shadow_ball"],[45,"petal_blitz"],[49,"night_slash"],[53,"verdant_surge"],[57,"abyssal_snare"],[61,"soul_rend"],[65,"dread_howl"],[5,"mycelia_net"],[46,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:262, rarity:"rare",
    desc:"An ancient funerary grove made manifest. Moonless nights draw out its full power; forests bow as it passes.",
    lore:"Necrothon is a massive dark-grass tree creature 3 metres tall — Necralia's charcoal thorned-bush branches have hardened into a twisted trunk-body of dead black wood, and the burgundy-black serrated leaves have darkened to a crown of withered crimson leaves that never fall. It stands motionless for months at a time, then relocates at night. The forest it inhabits gradually darkens and other plants around it wither." },

  38: { id:38, name:"Titanariel", emoji:"🗿", types:["Aquatic","Metal"],
    base:{hp:97,atk:92,def:137,spa:82,spd:108,spe:34},
    learnset:[[1,"scratch"],[1,"water_gun"],[2,"aqua_tail"],[3,"flash_cannon"],[4,"harden"],[45,"hydro_pump"],[49,"iron_tail"],[53,"tidal_crush"],[57,"magnetize"],[61,"sea_serpent_strike"],[65,"forge_strike"],[69,"anvil_drop"],[5,"tidecaller"],[50,"swords_dance"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:275, rarity:"rare",
    desc:"A 7-metre armored sea-titan whose massive coral-plated arms can capsize a galleon. Walks the deep-ocean floor in absolute silence.",
    lore:"Titanariel is a 7-metre armoured sea-titan, the fully grown form of the Coralossus lineage and a true colossus of the deep. Its hulking humanoid silhouette is sheathed in interlocking plates of fossilised coral fused with sunken steel salvaged from countless wrecks, and barnacles cluster along its joints in great encrusted ridges. Two enormous arms — each as thick as a ship's mast and tipped in plate-armoured grasping claws — hang past its knees, capable of crushing iron and capsizing galleons by pulling on a hull from below. It walks the deep-ocean floor in absolute silence, its great weight muffled by water, and ancient naval records describe it surfacing only during the most violent storms to drag foundering ships down to its lair." },

  // ===== 3RD STAGE EVOLUTIONS (IDs 178-212) =====

  // 178: Inferarch - Fire/Draconic (Embrix→Helioveth→Inferarch)
  12: { id:12, name:"Inferarch", emoji:"🦋", types:["Fire","Wind"],
    base:{hp:84,atk:110,def:79,spa:119,spd:84,spe:74},
    learnset:[[1,"ember"],[1,"flamethrower"],[2,"gust"],[3,"heat_wave"],[4,"scorch_veil"],[38,"fire_blast"],[43,"wing_attack"],[48,"solar_flare"],[52,"bug_buzz"],[57,"inferno"],[62,"hurricane"],[67,"char_dance"],[5,"embercloak"],[44,"air_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:265, rarity:"rare",
    desc:"A regal fire-moth of vast wingspan. Heat shed by its wings rises into thermals it can ride for hours.",
    lore:"Inferarch is an enormous fire-moth nearly 1.5 metres across the wings — the imago that finally splits Heliocoon's shell. Its slender body is banded in deep black; the upper wings flare with crimson, gold, and ash-rimmed eyespots that catch firelight when it rests, while the undersides shed a constant powder of ember-grey scales. Each broad wingbeat draws in cool air and releases it as a column of superheated wind that becomes its own thermal — Inferarch can drift silently above caldera fields for hours without descending. It feeds at night on the nectar of fire-blossoms that bloom only in geothermal soil, and the smouldering pollen it carries between flowers is responsible for the rapid spread of those heat-loving plants." },

  // 15: Pyroclasm - Fire/Earth (Taurcin→Molteroth→Pyroclasm)
  15: { id:15, name:"Pyroclasm", emoji:"🌋", types:["Fire","Earth"],
    base:{hp:102,atk:126,def:107,spa:86,spd:72,spe:57},
    learnset:[[1,"headbutt"],[1,"magma_surge"],[2,"flamethrower"],[3,"scorch_veil"],[4,"rock_slide"],[5,"embercloak"],[8,"will_o_wisp"],[12,"smolder_trap"],[16,"molten_armor"],[22,"infernal_roar"],[28,"inferno_charge"],[34,"eruption"],[36,"volcanic_wrath"],[38,"heat_wave"],[42,"stone_edge"],[44,"ashfall"],[46,"fire_blast"],[50,"stalactite_drop"],[54,"inferno"],[58,"quarry_crush"],[62,"solar_flare"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"A living caldera given form. When it charges, the ground splits and magma fountains in its wake.",
    lore:"Pyroclasm is a jagged bipedal volcanic bull-titan 2.5 metres tall that has reared up onto two legs since its Molteroth stage, its body a mass of dark basalt encrusted with glowing magma veins. When agitated it hurls chunks of its own burning body as projectiles. It forms in the wake of eruptions and is considered a manifestation of volcanic rage." },

  // 180: Helixareth - Fire/Draconic (Ignicula→Pyroveth→Helixareth)
  18: { id:18, name:"Bahamber", emoji:"🐉", types:["Draconic","Earth"],
    base:{hp:87,atk:111,def:72,spa:121,spd:82,spe:77},
    learnset:[[1,"ember"],[1,"flamethrower"],[2,"dragon_breath"],[3,"cinderwhirl"],[4,"scorch_veil"],[38,"dragon_claw"],[42,"heat_wave"],[46,"fire_blast"],[50,"dragon_pulse"],[54,"solar_flare"],[58,"outrage"],[62,"inferno"],[5,"embercloak"],[44,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"An ancient serpent of celestial fire that coils around mountaintops. Legends say its breath forged the first volcanoes.",
    lore:"Bahamber is a serpentine earth-dragon 6 metres long that coils tightly around rocky spires to sleep — Searburn's scarlet-and-black scales have darkened further to amber-and-black overlapping like armour, and the backward-swept horns of its juvenile form have grown forward into twin crests of blue-tipped flame crowning its narrow skull. Vast wings fold along its serpentine length when at rest, almost invisible against its scales but capable of sweeping fire across a hillside when unfurled. It breathes a spiralling helix of fire able to bore through solid stone." },

  // 21: Terravore - Fire/Earth (Magmaurin→Embrath→Terravore)
  21: { id:21, name:"Terravore", emoji:"🦖", types:["Fire","Earth"],
    base:{hp:100,atk:134,def:89,spa:79,spd:74,spe:74},
    learnset:[[1,"flame_fang"],[1,"earthquake"],[2,"magma_surge"],[3,"scorched_earth"],[4,"scorch_veil"],[5,"embercloak"],[12,"flame_focus"],[20,"inferno_charge"],[38,"flamethrower"],[42,"earth_power"],[44,"blazing_rush"],[46,"fire_blast"],[48,"scorched_sand"],[50,"ashfall"],[54,"inferno"],[58,"sand_geyser"],[62,"solar_flare"]],
    evolveTo:null, evolveLevel:null, catchRate:35, expYield:260, rarity:"rare",
    desc:"A predator born from the magma deep within the earth. It tunnels through bedrock and erupts beneath its prey.",
    lore:"Terravore is a hulking dinosaur-like creature 3 metres long, the apex of Embrath's lineage — its charcoal-and-rust juvenile scales have weathered to a uniform thick terracotta hide reinforced by fire-hardened dorsal plates, and the heat-pits along its snout have widened into wide-spaced sensory pores. Its wide mouth can swallow boulders to digest the minerals within. It tunnels through volcanic earth, leaving perfectly circular bore-holes 1 metre in diameter." },

  // 182: Ignitheon - Fire/Mental (Ignorin→Pyraxis→Ignitheon)
  24: { id:24, name:"Ignitheon", emoji:"🔮", types:["Fire","Mental"],
    base:{hp:82,atk:77,def:77,spa:131,spd:97,spe:86},
    learnset:[[1,"flamethrower"],[1,"psychic_move"],[2,"scorch_veil"],[3,"psystrike"],[4,"heat_wave"],[38,"fire_blast"],[42,"calm_mind"],[46,"solar_flare"],[50,"thought_crush"],[54,"inferno"],[58,"mind_shatter"],[62,"neural_storm"],[5,"embercloak"],[44,"astral_rend"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"An oracle of living flame. It reads the minds of its foes and burns their deepest fears into reality.",
    lore:"Ignitheon is a regal lion-like psychic-fire creature 2 metres long — Pyraxis's stiff feathered ruff has bloomed into a full mane of living fire that changes colour with its emotional state (gold when calm, white when enraged), and the violet psychic markings of its juvenile flanks still pulse along its sides. It guards ancient flame temples and is said to judge challengers before allowing passage." },

  // 183: Tidalossus - Aquatic/Rock (Coralix→Aquidon→Tidalossus)
  27: { id:27, name:"Tidalossus", emoji:"🦞", types:["Aquatic","Earth"],
    base:{hp:92,atk:121,def:126,spa:67,spd:82,spe:62},
    learnset:[[1,"scratch"],[1,"surf"],[2,"tidecaller"],[3,"stalactite_drop"],[4,"rock_slide"],[38,"aqua_tail"],[42,"stone_edge"],[46,"tidal_crush"],[50,"crystal_lance"],[54,"hydro_pump"],[58,"quarry_crush"],[62,"sea_serpent_strike"],[5,"deepwater_hymn"],[44,"coral_barrage"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"A colossus of tide and stone that rules coastal shallows. Its claws can shear cliff faces clean through.",
    lore:"Tidalossus is a massive crustacean predator 4 metres across — Aquidon's stone-grey carapace has expanded into a dome-shaped granite-grey shell etched by centuries of wave erosion, and its two crushing claws have multiplied across six serrated limbs. It prowls coastal shallows at night and generates a localised tidal surge by rapidly displacing water with its body." },

  // 184: Polarveth - Ice/Aquatic (Cryonik→Boreon→Polarveth)
  44: { id:44, name:"Nagislither", emoji:"🧊", types:["Ice","Aquatic"],
    base:{hp:97,atk:73,def:97,spa:122,spd:103,spe:58},
    learnset:[[1,"powder_snow"],[1,"surf"],[2,"ice_beam"],[3,"permafrost"],[4,"winter_shroud"],[38,"blizzard"],[42,"hoarfrost_bite"],[46,"icicle_crash"],[50,"hydro_pump"],[54,"glacial_tomb"],[58,"cryo_lance"],[62,"abyssal_jet"],[5,"tidecaller"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A titan of polar seas whose body is half glacier and half deep ocean. Its roar shatters icebergs for miles around.",
    lore:"Nagislither is an elongated mature seal-form 3 metres long, sleek and powerfully muscled, with translucent blue-white fur over a long pinniped body and broad front flippers. Its whiskered face and dark amber eyes match the Boreon-and-Cryonik lineage, but its tail has lengthened into a sweeping rudder that breaks through thin ice sheets in wide arcs. It hunts beneath pack ice, surfacing through cracks to catch prey venturing near the frozen edge." },

  // 185: Nepturix - Aquatic (Corelin→Neraxis→Nepturix)
  30: { id:30, name:"Nepturix", emoji:"🐟", types:["Aquatic"],
    base:{hp:91,atk:82,def:77,spa:136,spd:107,spe:57},
    learnset:[[1,"water_gun"],[1,"surf"],[2,"bubble_beam"],[3,"tidecaller"],[4,"whirlpool_dive"],[38,"hydro_pump"],[42,"tidal_crush"],[46,"sea_serpent_strike"],[50,"coral_barrage"],[54,"abyssal_jet"],[58,"ocean_tempest"],[62,"dazzling_gleam"],[5,"deepwater_hymn"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:270, rarity:"rare",
    desc:"A leviathan of the reef that commands all ocean life with a single glance. Its scales scatter light like a shattered prism.",
    lore:"Nepturix is a silvery deep-sea fish about 60 cm long — Neraxis's rotund puffer body has streamlined and elongated for open-water hunting, the defensive spines retracted beneath the skin and the sandy lagoon camouflage darkened to silver-blue for trench depths. Enormous light-gathering eyes give it the slender streamlined head it now needs. Bioluminescent dots line its lateral line. It descends to lightless ocean trenches during the day and ascends to shallower water at night to feed on schooling fish." },

  // 186: Noxarith - Aquatic/Poison (Toxaquil→Noxaquith→Noxarith)
  33: { id:33, name:"Septanemone", emoji:"🦑", types:["Aquatic","Poison"],
    base:{hp:92,atk:98,def:87,spa:127,spd:98,spe:48},
    learnset:[[1,"sludge_bomb"],[1,"surf"],[2,"tidecaller"],[3,"toxic"],[4,"corrosion_fang"],[38,"venom_lance"],[42,"sludge_wave"],[46,"hydro_pump"],[50,"acid_rain"],[54,"venoshock"],[58,"putrid_pulse"],[62,"stinger_volley"],[5,"deepwater_hymn"],[44,"miasma_cloud"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A massive bloomed cephalopod that drifts through poison-clouded waters. Its venom-tipped tentacles unfurl like the petals of a deep-sea anemone.",
    lore:"Septanemone is a colossal bloomed cephalopod nearly 3.5 metres from beak to outermost tentacle-tip — Noxaquith's navy hood has flared open and bloomed into a bell-shaped mantle patterned in deep crimson and bruised violet, and its poisoned ink has specialised into stinging cells that scatter from soft frills around its body like the inverted petals of a vast sea anemone — a bloom from which seven main tentacles, each tipped with venomous barbs, unfurl in a wide circle. Smaller stinging cells scatter from the frills as it swims, leaving drifting clouds that paralyse plankton and small fish drawn in by its vivid colouration. It cruises slowly through poison-saturated waters using rhythmic jets from its mantle, anchoring briefly to rocky outcroppings only when digesting a large meal — never permanently sessile." },

  // 187: Thalassira - Aquatic/Fairy (Pearlith→Undirael→Thalassira)
  36: { id:36, name:"Thalassira", emoji:"👑", types:["Aquatic","Fairy"],
    base:{hp:91,atk:76,def:81,spa:139,spd:106,spe:57},
    learnset:[[1,"water_gun"],[1,"fairy_wind"],[2,"dazzling_gleam"],[3,"tidecaller"],[4,"moonblast"],[38,"celestial_wave"],[42,"surf"],[46,"glitter_storm"],[50,"hydro_pump"],[54,"fae_requiem"],[58,"sea_serpent_strike"],[62,"moonveil"],[5,"deepwater_hymn"],[44,"sweet_kiss"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:275, rarity:"rare",
    desc:"The radiant sovereign of the world's oceans — a regal sea-fairy queen whose long fin-tail and gossamer wings command tides and storms alike.",
    lore:"Thalassira is the radiant sovereign of the world's oceans, a regal sea-fairy queen 4 metres from crown to tail-tip with the upper body of a tall ethereal humanoid and a long sweeping fin-tail of iridescent ocean-blue and silver. From her shoulders unfurl two pairs of translucent fairy wings — gossamer in air and webbed for swift propulsion underwater. Strands of her flowing water-weed hair are woven with constellations of living sea-stars, and her crown is a single colossal pearl-fragment formed from the same fairy energy that quickened her in her Pearlith stage. She guards hidden underwater groves where rare magical plants grow undisturbed, and sailors who see her are blessed with eternal safe passage." },

  // 188: Mycovast - Grass/Poison (Sporix→Myceloth→Mycovast)
  65: { id:65, name:"Mycovast", emoji:"🍄", types:["Nature","Poison"],
    base:{hp:98,atk:109,def:103,spa:108,spd:88,spe:44},
    learnset:[[1,"energy_ball"],[1,"sludge_bomb"],[2,"spore_burst"],[3,"toxic"],[4,"sleep_powder"],[38,"petal_blitz"],[42,"venom_lance"],[46,"verdant_surge"],[50,"sludge_wave"],[54,"venoshock"],[58,"canopy_crash"],[62,"acid_rain"],[5,"mycelia_net"],[44,"corrosion_fang"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A fungal colossus whose spores drift on the wind for hundreds of miles, corrupting forests in days. It is the rot at the heart of every plagued wood.",
    lore:"Mycovast is a hulking fungal creature 2 metres tall — Myceloth's translucent humanoid frame has thickened into a thick, barrel-like body and the wide flat cap of its earlier form has multiplied into overlapping shelf-fungus plates. Purple, green, and white tones mottle its surface. It generates a continuous cloud of toxic spores around itself and moves with surprising speed for its size when defending its spore territory." },

  // 189: Rootvorn - Grass/Ground (Viridix→Terravin→Rootvorn)
  68: { id:68, name:"Rootvorn", emoji:"🐌", types:["Nature","Earth"],
    base:{hp:98,atk:118,def:104,spa:93,spd:88,spe:49},
    learnset:[[1,"razor_leaf"],[1,"earthquake"],[2,"seed_bomb"],[3,"root_lance"],[4,"sleep_powder"],[38,"energy_ball"],[42,"earth_power"],[46,"petal_blitz"],[50,"verdant_surge"],[54,"sand_geyser"],[58,"canopy_crash"],[62,"scorched_earth"],[5,"spore_burst"],[44,"briar_lash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A 3-metre ancient garden snail whose colossal shell has become a rooted bonsai forest. Reorganises woodland over centuries simply by walking through it.",
    lore:"Rootvorn is a colossal ancient snail nearly 3 metres tall at the shell's apex, with a body that extends another 4 metres when fully out of the shell — Loamvin's bark-and-moss-overgrown shell has expanded and been so deeply colonised over centuries that it now resembles a mossy hill — thick roots from full-grown saplings have driven down through the shell's surface and clutched it like a living crown, and a complete miniature canopy of broad leaves shades the back of its body. Its eyestalks are 1-metre wood-coloured stalks tipped in twin amber gleams, raised cautiously above the canopy when it senses motion. It uproots itself only at night, dragging its forested shell to a new location before dawn, and is believed to reorganise the layout of entire woodlands over decades — wherever it has travelled, new groves take root from the seeds shed by its passing." },

  // 190: Verdovast - Grass (Germix→Verdurus→Verdovast)
  71: { id:71, name:"Verdovast", emoji:"🌳", types:["Nature"],
    base:{hp:109,atk:123,def:88,spa:113,spd:88,spe:29},
    learnset:[[1,"tackle"],[1,"vine_whip"],[2,"energy_ball"],[3,"sleep_powder"],[4,"seed_bomb"],[5,"spore_burst"],[8,"bark_shield"],[11,"leech_seed"],[14,"root_drain"],[17,"synthesis"],[20,"nature_pulse"],[23,"bullet_seed"],[26,"petal_dance"],[30,"primordial_growth"],[34,"leaf_storm"],[38,"petal_blitz"],[42,"swords_dance"],[44,"root_lance"],[46,"canopy_crash"],[50,"verdant_surge"],[54,"body_slam"],[56,"solar_beam"],[58,"briar_lash"],[60,"verdant_radiance"],[62,"photon_leaf"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A colossal ancient seed-pod 2.5 metres tall whose surface is overgrown with saplings, vines, and a small ecosystem. Walks slowly across forests, dropping fertile seeds with each step.",
    lore:"Verdovast is a colossal ancient seed-pod 2.5 metres tall — Verdurus's split walking seed-pod has grown enormous and its surface is now so deeply grown over with saplings, vines, blossoms, and a small ecosystem of moss and tendrils that the original seed-husk is barely visible. Older Verdovast resemble walking gardens, with tiny trees growing from their shoulders and back, fruit ripening among the branches, and small creatures nesting in the foliage they carry. It walks slowly across forests on broad root-feet, dropping fertile seeds at every step, and patches of new growth — eventually entire grove ecosystems — spring up wherever it has lingered." },

  // 191: Morralyn - Grass/Dark (Sylvnox→Morraveth→Morralyn)
  80: { id:80, name:"Morralyn", emoji:"🪵", types:["Nature","Dark"],
    base:{hp:98,atk:122,def:97,spa:117,spd:87,spe:29},
    learnset:[[1,"razor_leaf"],[1,"night_slash"],[2,"energy_ball"],[3,"dark_pulse"],[4,"sleep_powder"],[5,"spore_burst"],[8,"bark_shield"],[14,"root_drain"],[20,"synthesis"],[26,"nature_pulse"],[30,"magical_leaf"],[34,"primordial_growth"],[38,"petal_blitz"],[42,"shadow_ball"],[44,"abyssal_snare"],[46,"void_rend"],[50,"verdant_surge"],[54,"soul_rend"],[58,"canopy_crash"],[60,"verdant_radiance"],[62,"eclipse_shroud"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A wraith of shadow and thorn that stalks moonless forests. The trees it passes through wither and grow dark, feeding it endlessly.",
    lore:"Morralyn is the ancient leshy-lord of corrupted groves, a towering 1.8-metre bark-skinned forest-spirit — Morraveth's branching antler-buds have grown into a full crown of branching black antlers, and a long vine-beard hung with hollow seedpods has matured below. Dead foliage and dark moss cover the heavy bark-armour plates of its body, and a faint aura of decay accelerates the decomposition of fallen material around it, enriching the soil it walks upon. It is said that the deepest, most shadow-tangled groves of Lumoria are still ruled by patriarchal Morralyn who have not been seen by human eyes in centuries." },

  // 192: Faevernal - Fairy/Grass (Floralin→Faelomis→Faevernal)
  74: { id:74, name:"Faevernal", emoji:"🌸", types:["Fairy","Nature"],
    base:{hp:93,atk:77,def:82,spa:137,spd:108,spe:53},
    learnset:[[1,"fairy_wind"],[1,"vine_whip"],[2,"dazzling_gleam"],[3,"moonblast"],[4,"sweet_kiss"],[38,"celestial_wave"],[42,"petal_blitz"],[46,"glitter_storm"],[50,"verdant_surge"],[54,"fae_requiem"],[58,"energy_ball"],[62,"moonveil"],[5,"stardust_veil"],[44,"sleep_powder"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A being of pure spring magic. Where it dances, flowers bloom overnight and the air fills with the scent of a thousand blossoms.",
    lore:"Faevernal is a regal fairy-grass entity 1.8 metres tall — Faelomis's interlocking flowering vines have given way to a humanoid wreathed in cascading blossoms, the bloom-wings expanded into flowing cape-wings of enormous tropical petals, and the inner core crowned by living golden flowers. Ancient nature spirits are believed to incarnate within it during spring equinox festivals." },

  // 193: Junglevolt - Grass/Electric (Sylvolt→Arborvolt→Junglevolt)
  77: { id:77, name:"Thorncharge", emoji:"⚡", types:["Nature","Electric"],
    base:{hp:92,atk:98,def:82,spa:132,spd:98,spe:48},
    learnset:[[1,"razor_leaf"],[1,"thunderbolt"],[2,"energy_ball"],[3,"volt_surge"],[4,"sleep_powder"],[5,"spore_burst"],[8,"thorn_barrage"],[20,"leafblade_swirl"],[36,"leaf_storm"],[38,"thunder"],[42,"petal_blitz"],[44,"charge_burst"],[46,"verdant_surge"],[50,"plasma_strike"],[54,"canopy_crash"],[58,"ion_cannon"],[62,"arc_flash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A massive armored elk crowned with thorny electric antlers. Charges enemies head-on, electrocuting and impaling on contact.",
    lore:"Thorncharge is a powerful elk 1.5 metres at the shoulder, broad-chested and heavy-shouldered, with a coat of dark green hide reinforced by thick thorny ridges along its spine, shoulders, and flanks. Sparkwood's bark-covered branching antlers have hardened into a 1-metre-wide crown of jagged living thorns that crackle constantly with stored electricity — discharging a sharp arc of lightning at each tip whenever the antlers strike anything. It charges headlong into enemies, using its thorn-crown to both impale and electrocute on contact, and herds of Thorncharge fertilise meadows wherever they pass with the residual electricity earthed through their hooves." },

  // 194: Voltanox - Electric (Joltan→Galvanos→Voltanox)
  83: { id:83, name:"Voltanox", emoji:"🐎", types:["Electric"],
    base:{hp:81,atk:111,def:71,spa:115,spd:76,spe:96},
    learnset:[[1,"thunder_shock"],[1,"thunderbolt"],[2,"spark"],[3,"thunder_wave"],[4,"quick_attack"],[38,"thunder"],[42,"arc_flash"],[46,"plasma_strike"],[50,"volt_surge"],[54,"ion_cannon"],[58,"charge_burst"],[62,"voltaic_fang"],[5,"static_cage"],[44,"wild_charge"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:275, rarity:"rare",
    desc:"A heavy electric destrier whose hooves spark thunder with each strike. Cities briefly light up bright as day when it gallops through them.",
    lore:"Voltanox is a powerful electric stallion 1.6 metres at the shoulder — Galvanos's golden-yellow hide has darkened to dark charcoal marked by bright yellow lightning-bolt patterns along each flank and shoulder. Its broad chest and heavy musculature suggest a destrier or clydesdale-sized warhorse, and its long mane and tail crackle constantly with stored electrical charge. Two short forward-curving forehead-spurs act as capacitor tips, building enormous charges that release in arcs when it lowers its head and charges; the impact of its hooves on the ground can send visible shockwaves through metal surfaces nearby. Cities through which it briefly gallops are lit as bright as day for the moments of its passing." },

  // 195: Zapoveth - Electric/Bug (Electrix→Voltharpe→Zapoveth)
  86: { id:86, name:"Galvaglide", emoji:"🪰", types:["Electric","Nature"],
    base:{hp:84,atk:89,def:69,spa:129,spd:84,spe:95},
    learnset:[[1,"thunder_shock"],[1,"bug_buzz"],[2,"thunderbolt"],[3,"x_scissor"],[4,"thunder_wave"],[38,"thunder"],[42,"volt_surge"],[46,"swarm_dive"],[50,"plasma_strike"],[54,"mandible_crush"],[58,"ion_cannon"],[62,"stinger_volley"],[5,"static_cage"],[44,"silk_bind"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A dragonfly of pure lightning. Its body discharges with every wingbeat; to be caught in its swarm is to stand in a thunderstorm.",
    lore:"Galvaglide is a dragonfly-like creature with a 40 cm wingspan — Shockharpe's translucent late-instar wings have hardened to translucent gold and now crackle with static charge, and its hooked predatory mandibles have refined into precision strike-points. Its slender body is vivid yellow. It hunts in flight, hovering stationary before striking prey with a precisely targeted electrical discharge from its forward-pointing tail." },

  // 196: Surgolith - Electric/Aquatic (Amperix→Volterel→Surgolith)
  89: { id:89, name:"Surgolith", emoji:"🐍", types:["Electric","Aquatic"],
    base:{hp:93,atk:77,def:82,spa:137,spd:103,spe:58},
    learnset:[[1,"thunder_shock"],[1,"surf"],[2,"thunderbolt"],[3,"water_gun"],[4,"thunder_wave"],[38,"thunder"],[42,"hydro_pump"],[46,"voltaic_fang"],[50,"tidal_crush"],[54,"ion_cannon"],[58,"abyssal_jet"],[62,"overcharge"],[5,"static_cage"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A 4-metre electric eel-like leviathan whose body crackles with stored ocean current. It powers itself by siphoning thermal-vent differentials.",
    lore:"Surgolith is a colossal electric eel-like leviathan over 4 metres long — Sparkrel's silver-blue developing form has darkened to a dark blue-black body marked by bands of bright yellow that pulse with stored electricity along its full length. Two long whiskers below its jaw act as ultra-sensitive electroreceptors, mapping every fish in the deep waters around it. It lives perched coiled around deep-sea volcanic thermal vents, drawing on the differential between hot and cold water to power its movements without needing to hunt for energy. When threatened, it discharges columns of electrified water in any direction, and the surrounding sea briefly glows with cascading currents." },

  // 197: Petrovast - Electric/Rock (Voltrix→Petravolt→Petrovast)
  94: { id:94, name:"Petrovast", emoji:"⛰️", types:["Electric","Earth"],
    base:{hp:98,atk:117,def:112,spa:82,spd:73,spe:68},
    learnset:[[1,"rock_slide"],[1,"thunderbolt"],[2,"spark"],[3,"stone_edge"],[4,"thunder_wave"],[5,"static_cage"],[20,"ancient_power"],[38,"thunder"],[42,"earthquake"],[44,"temper_edge"],[46,"volt_surge"],[50,"crystal_lance"],[54,"stalactite_drop"],[58,"ion_cannon"],[62,"quarry_crush"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A mountainous rock-echidna 2 metres at the shoulder, its body a fortress of basalt plates. Almost impossible to move once stationary.",
    lore:"Petrovast is a colossal ancient rock-echidna 2 metres at the shoulder — Stonebolt's stone-grey plate-quills have thickened further into a body entirely encased in interlocking basalt-coloured plates between which vivid electrical arcs constantly discharge. Its forelimbs end in massive blunt digging claws capable of carving through bedrock, and the row of plate-spurs along its back crackles with the stored charge of years of weathered storms. Its weight builds up so much ground contact that it is almost impossible to move once it has settled into a position; herds of Petrovast are rarely seen — most are encountered as solitary sentinels guarding the same mountain pass for decades." },

  // 198: Tectonvast - Ground/Rock (Terrakin→Seismith→Tectonvast)
  97: { id:97, name:"Tectonvast", emoji:"🦏", types:["Earth","Electric"],
    base:{hp:111,atk:136,def:116,spa:57,spd:73,spe:57},
    learnset:[[1,"earthquake"],[1,"thunderbolt"],[2,"headbutt"],[3,"earth_power"],[4,"stone_edge"],[5,"clay_armor"],[6,"earthen_wall"],[8,"rock_polish"],[12,"smack_down"],[15,"ancient_power"],[18,"erosion_wave"],[20,"tectonic_wave"],[22,"stone_axe"],[24,"quake_pulse"],[26,"meteor_strike"],[28,"rock_wrecker"],[30,"continental_shift"],[32,"diamond_crash"],[36,"diamond_storm"],[38,"ball_lightning"],[42,"crystal_lance"],[44,"temper_edge"],[46,"sand_geyser"],[50,"overcharge"],[54,"scorched_earth"],[58,"fissure_slam"],[62,"body_slam"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"A colossal rhino-titan whose every footfall registers as both an earthquake and a thunderclap. Lightning rolls along its plated hide as it walks.",
    lore:"Tectonvast is a massive rhino-titan 2 metres at the shoulder — Seismith's iron-and-copper-veined plates have grown across its grey-brown hide into heavy sheathing-armour of iron-veined earth, deeply furrowed and crackling with static potential built up over decades of seismic march. Its single horn — a column of compressed mineral over 40 centimetres long — glows white-hot at the tip when it lowers its head to charge, releasing the stored charge through whatever it strikes in a clap of grounded thunder. Seismic activity follows it wherever it walks, but unlike its ancestors the air around it carries the metallic tang of ozone, and skies darken overhead as storms are drawn to the metal in its hide." },

  // 199: Geovenomvast - Ground/Poison (Aridix→Geovenoth→Geovenomvast)
  100: { id:100, name:"Craterlurk", emoji:"🦂", types:["Earth","Poison"],
    base:{hp:89,atk:119,def:89,spa:105,spd:99,spe:49},
    learnset:[[1,"poison_sting"],[1,"earthquake"],[2,"venom_lance"],[3,"earth_power"],[4,"toxic"],[38,"sludge_wave"],[42,"miasma_cloud"],[46,"scorched_earth"],[50,"acid_rain"],[54,"sand_geyser"],[58,"stinger_volley"],[62,"toxic_surge"],[5,"clay_armor"],[44,"corrosion_fang"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A scorpion tyrant of the poisoned badlands. Its stinger contains enough venom to wilt an entire forest, and its tail leaves craters in the earth.",
    lore:"Craterlurk is a colossal scorpion nearly 2 metres long — Toxivenoth's teal-green exoskeleton has darkened to dark purple-black chitin across an enormous broad carapace. Its eight legs move with disturbing silence. The stinger at the end of its tail stores enough venom to incapacitate a creature ten times its size. It is rarely seen during daylight hours." },

  // 200: Geovast - Ground/Aquatic (Limoux→Geoloth→Geovast)
  103: { id:103, name:"Calciderm", emoji:"🐊", types:["Earth","Aquatic"],
    base:{hp:109,atk:118,def:98,spa:103,spd:83,spe:39},
    learnset:[[1,"earthquake"],[1,"surf"],[2,"earth_power"],[3,"tidal_crush"],[4,"mud_shot"],[38,"hydro_pump"],[42,"sand_geyser"],[46,"aqua_tail"],[50,"scorched_earth"],[54,"sea_serpent_strike"],[58,"boulder_roll"],[62,"abyssal_jet"],[5,"clay_armor"],[44,"frost_current"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:260, rarity:"rare",
    desc:"A delta titan that merges the force of river and rock. River mouths form around it; whole new coastlines appear where it settles.",
    lore:"Calciderm is a massive freshwater crocodilian 3.5 metres long — Dunoloth's mud-brown hide and stone-plates have calcified into mineral deposits so heavily that the body now resembles stone more than skin. Its jaw pressure is sufficient to crush boulders. It blocks rivers, and smaller creatures shelter in the calm water behind its stationary bulk." },

  // 201: Aeolarch - Wind/Electric (Zephyrkin→Aeolomane→Aeolarch)
  110: { id:110, name:"Aeolarch", emoji:"🦁", types:["Wind","Electric"],
    base:{hp:93,atk:122,def:73,spa:88,spd:87,spe:87},
    learnset:[[1,"gust"],[1,"thunderbolt"],[2,"air_slash"],[3,"zephyr_dance"],[4,"arc_flash"],[38,"hurricane"],[42,"thunder"],[46,"gale_cannon"],[50,"plasma_strike"],[54,"volt_surge"],[58,"tempest_wrath"],[62,"ion_cannon"],[5,"vortex_trap"],[44,"squall_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A storm sovereign whose mane is a permanent tempest. When it roars, thunder rolls across the land for days.",
    lore:"Aeolarch is a massive wind lion 1.8 metres at the shoulder — Siroccomane's tawny-gold fur has lightened to a white coat shading to storm-grey at the extremities, and the electric-blue mane has thickened across a broader chest, crackling and sparking continuously. It commands local weather patterns and is regarded as a living storm-anchor by coastal communities." },

  // 202: Cyclavorn - Wind (Aeolin→Cyclavel→Cyclavorn)
  113: { id:113, name:"Cyclavorn", emoji:"🦅", types:["Wind"],
    base:{hp:89,atk:114,def:74,spa:110,spd:79,spe:84},
    learnset:[[1,"gust"],[1,"wing_attack"],[2,"air_slash"],[3,"jetstream"],[4,"mistveil"],[5,"zephyr_dance"],[12,"aerial_ace"],[18,"breeze_blast"],[24,"feather_dance"],[28,"air_barrier"],[32,"aerial_slam"],[38,"hurricane"],[42,"skyfall"],[44,"vortex_trap"],[46,"squall_slash"],[50,"thermal_dive"],[54,"gale_cannon"],[58,"tempest_wrath"],[62,"downdraft"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:255, rarity:"rare",
    desc:"A hurricane made flesh. It circles the highest peaks and its passage creates new storm systems that endure for years.",
    lore:"Cyclavorn is a massive condor-like bird with a 3.5-metre wingspan — Swirlavel's double-spiral crest has smoothed into the streamlined skull of a high-altitude apex predator, and the grey-brown eagle plumage has darkened to deep charcoal with white under-wing patches visible only in flight. It circles at tremendous altitude for weeks without landing, descending only to feed. Its wingbeats can be felt as pressure waves on the ground below." },

  // 203: Frigidvorn - Ice (Cryokin→Boreovast→Frigidvorn)
  49: { id:49, name:"Frigidvorn", emoji:"🐺", types:["Ice"],
    base:{hp:97,atk:108,def:77,spa:103,spd:92,spe:73},
    learnset:[[1,"powder_snow"],[1,"ice_beam"],[2,"icicle_crash"],[3,"blizzard"],[4,"permafrost"],[38,"hoarfrost_bite"],[42,"cryo_lance"],[46,"glacial_tomb"],[50,"avalanche_drive"],[54,"winter_shroud"],[58,"body_slam"],[62,"quick_attack"],[5,"frostfire_veil"],[44,"instinct_slash"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A wolf of absolute zero whose howl flash-freezes the air for miles. Entire mountain valleys have become permanent glacier fields where it hunts.",
    lore:"Frigidvorn is a heavy-shouldered, shaggy ice-wolf 2 metres at the shoulder — Hailgorge's white fur and ice-spine hackles have lengthened and matted into thick grey-white fur and a permanent armoured ice-coat across its shoulders. Its breath freezes solid on contact with open air, producing a permanent mist cloud around its face. It excavates dens deep in glacier ice and hibernates for years between active periods." },

  // 204: Glaciovast - Ice/Normal (Nivelin→Glacivern→Glaciovast)
  52: { id:52, name:"Permavast", emoji:"🐃", types:["Ice","Normal"],
    base:{hp:109,atk:88,def:118,spa:113,spd:103,spe:19},
    learnset:[[1,"powder_snow"],[1,"body_slam"],[2,"ice_beam"],[3,"harden"],[4,"blizzard"],[38,"headbutt"],[42,"hoarfrost_bite"],[46,"icicle_crash"],[50,"glacial_tomb"],[54,"recover"],[58,"cryo_lance"],[62,"hyper_beam"],[5,"winter_shroud"],[44,"vital_pulse"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:260, rarity:"rare",
    desc:"An immovable mountain-auroch armored in ancient glacier ice. When it wakes from a long slumber, the ice age returns.",
    lore:"Permavast is a colossal mountain auroch around 2.5 metres at the shoulder and over 4 metres long — Shiverling's growing shoulder ice-plates have fused into a near-armoured shell of ancient glacier ice across its flanks and spine, and its woolly yak-coat has thickened into dense white fur streaked with grey. Two massive curled horns layered in old ice sweep low and wide from its broad skull, ringed in faint hoarfrost. It does not hibernate but roams frozen tundra year-round, breaking through wind-packed snowdrifts with its broad chest while the ice plates along its flanks grind audibly against one another with each measured step." },

  // 205: Noctovast - Dark (Umbrakin→Noctivast→Noctovast)
  120: { id:120, name:"Nightwolf", emoji:"🐕", types:["Dark"],
    base:{hp:98,atk:117,def:77,spa:108,spd:87,spe:63},
    learnset:[[1,"bite"],[1,"crunch"],[2,"night_slash"],[3,"dark_pulse"],[4,"eclipse_shroud"],[38,"shadow_ball"],[42,"void_rend"],[46,"soul_rend"],[50,"abyssal_snare"],[54,"dread_howl"],[58,"body_slam"],[62,"quick_attack"],[5,"shadowstep"],[44,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A hound of the perpetual midnight. Darkness pools around it wherever it goes; even torch-flames gutter and die in its presence.",
    lore:"Nightwolf is a massive black-furred predator 1.4 metres at the shoulder — Dreadmaw's pure black fur and powerful chest have grown into a great-dane-and-wolf hybrid frame. Its form is surrounded by a subtle shadow-haze. It hunts large prey by pursuing it into darkness where it has absolute advantage, wearing it down over long relentless chases." },

  // 206: Phantomvast - Dark/Poison (Nocturil→Phantorvex→Phantomvast)
  125: { id:125, name:"Venotitan", emoji:"🐍", types:["Dark","Poison"],
    base:{hp:92,atk:121,def:87,spa:111,spd:86,spe:53},
    learnset:[[1,"bite"],[1,"venom_lance"],[2,"dark_pulse"],[3,"sludge_wave"],[4,"eclipse_shroud"],[38,"void_rend"],[42,"acid_rain"],[46,"shadow_ball"],[50,"soul_rend"],[54,"toxic_surge"],[58,"corrosion_fang"],[62,"dread_howl"],[5,"shadowstep"],[44,"abyssal_snare"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"A venom phantom of ancient ruin sites. It haunts deep in shadow, and those bitten by it suffer visions of oblivion they never escape.",
    lore:"Venotitan is a titanic dark-poison serpent 4 metres long with body width enough to encircle a large tree — Phantorvex's iridescent purple-black scales have darkened to near-black with the violet shimmer now faint banding, and the necrotic venom of its juvenile form has matured into a constrictor's killing dose. It constricts prey before envenomating, and the venom it produces is so potent that researchers use it in diluted form as an anaesthetic." },

  // 207: Lumiarch - Fairy (Lumkin→Aetherael→Lumiarch)
  139: { id:139, name:"Lumiarch", emoji:"🌟", types:["Fairy"],
    base:{hp:97,atk:86,def:86,spa:131,spd:107,spe:43},
    learnset:[[1,"fairy_wind"],[1,"dazzling_gleam"],[2,"moonblast"],[3,"sweet_kiss"],[4,"stardust_veil"],[38,"celestial_wave"],[42,"glitter_storm"],[46,"fae_requiem"],[50,"moonveil"],[54,"recover"],[58,"wish_spark"],[62,"hyper_beam"],[5,"charm_bloom"],[44,"vital_pulse"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"The sovereign of fairy light. Its radiance can banish every shadow from a city; dark spirits flee the land at its mere approach.",
    lore:"Lumiarch is a majestic fairy hound 1.1 metres at the shoulder — Aetherael's luminous white fur has brightened further and its soft gold-pink aura has condensed into a mane of living light that shifts through all warm colours slowly. Violet eyes glow like lanterns. Ancient lore records it appearing at the site of major conflicts and bringing sudden, unexplained peace between combatants." },

  // 208: Celestarch - Fairy/Mental (Dawnirel→Lunarael→Celestarch)
  144: { id:144, name:"Celestarch", emoji:"🌙", types:["Fairy","Mental"],
    base:{hp:95,atk:75,def:91,spa:147,spd:114,spe:28},
    learnset:[[1,"dazzling_gleam"],[1,"psychic_move"],[2,"moonblast"],[3,"calm_mind"],[4,"stardust_veil"],[38,"celestial_wave"],[42,"psystrike"],[46,"fae_requiem"],[50,"thought_crush"],[54,"glitter_storm"],[58,"mind_shatter"],[62,"prism_ward"],[5,"sweet_kiss"],[44,"eon_crash"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:280, rarity:"rare",
    desc:"A celestial archon said to be the personification of the moon's light and the night sky's oldest thoughts. Stars bow when it rises.",
    lore:"Celestarch is a grand psychic-fairy celestial creature 1.5 metres across — Lunarael's curved-inward crescent arms have bloomed back into a many-pointed star, and the deep violet-blue body has brightened to brilliant gold-white with an aura shifting through deep purple and starlight silver. It appears only during celestial events — eclipses, conjunctions, meteor showers — and is regarded as a divine herald." },

  // 209: Adamovast - Metal (Ferrokin→Adamavast→Adamovast)
  149: { id:149, name:"Eternarmor", emoji:"🐩", types:["Metal"],
    base:{hp:101,atk:130,def:134,spa:71,spd:91,spe:23},
    learnset:[[1,"metal_claw"],[1,"flash_cannon"],[2,"iron_tail"],[3,"magnetize"],[4,"forge_strike"],[38,"anvil_drop"],[42,"iron_press"],[46,"slag_shield"],[50,"temper_edge"],[54,"steel_wing"],[58,"body_slam"],[62,"hyper_beam"],[5,"ironskin"],[44,"recover"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:275, rarity:"rare",
    desc:"A steel titan of absolute indomitability. Every surface of its body is a different legendary alloy; no recorded force has ever cracked its hide.",
    lore:"Eternarmor is a massive steel entity 2 metres tall — Stoicguard's burnished battle-scarred chest and arms have hardened into a complete suit of full plate armour that now moves of its own accord, the surface refined to deep charcoal-grey adamantine that retains the silent stoicism of its juvenile form. No creature has ever found a way to scratch its surface with any natural weapon. It considers itself a guardian of civilisation itself." },

  // 210: Ferrovast - Metal/Dark (Aeronyx→Ferrovex→Ferrovast)
  136: { id:136, name:"Metalibat", emoji:"🦇", types:["Metal","Dark"],
    base:{hp:93,atk:127,def:112,spa:73,spd:87,spe:58},
    learnset:[[1,"metal_claw"],[1,"dark_pulse"],[2,"flash_cannon"],[3,"crunch"],[4,"magnetize"],[38,"forge_strike"],[42,"void_rend"],[46,"iron_tail"],[50,"shadow_ball"],[54,"anvil_drop"],[58,"night_slash"],[62,"soul_rend"],[5,"ironskin"],[44,"eclipse_shroud"]],
    evolveTo:null, evolveLevel:null, catchRate:30, expYield:265, rarity:"rare",
    desc:"A wraith of living iron that hunts in total darkness. Its metallic screech can shatter stone and its wings cut like blades.",
    lore:"Metalibat is a massive dark-steel bat with a 2.5-metre wingspan — Steelvex's chrome-black wing-shields have thickened into overlapping dark steel plates that now armour its entire body, and the mechanical-object obsession of its juvenile form has matured into a 500-metre metallic drone audible from the industrial structures it nests within. In flight it produces a distinctive metallic drone audible from 500 metres. It nests inside abandoned industrial structures and hollowed-out ore deposits." },

  // 211: Acidovast - Poison/Ground (Acidelix→Toxoloth→Acidovast)
  159: { id:159, name:"Dissotoad", emoji:"🐸", types:["Poison","Earth"],
    base:{hp:111,atk:86,def:102,spa:136,spd:96,spe:19},
    learnset:[[1,"toxic"],[1,"earthquake"],[2,"sludge_wave"],[3,"earth_power"],[4,"toxic_surge"],[38,"acid_rain"],[42,"venom_lance"],[46,"sand_geyser"],[50,"sludge_bomb"],[54,"venoshock"],[58,"scorched_earth"],[62,"putrid_pulse"],[5,"miasma_cloud"],[44,"corrosion_fang"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"A colossal acid behemoth that dissolves the ground wherever it treads. Entire cave systems have been created by its acidic ooze eating through the earth.",
    lore:"Dissotoad is a massive ground-poison creature 2 metres tall resembling a toad made of compressed toxic earth — Corrodisc's flat disc-body has lifted upward into a true upright toad-frame, the corrosive undersurface now generalised across its skin as constant acidic weeping. The ground around it is perpetually discoloured. It is one of the few creatures that can neutralise other poisons by contact, making it paradoxically useful as an antidote source." },

  // 212: Behemovast - Normal (Rotunden→Glutoros→Behemovast)
  184: { id:184, name:"Behemovast", emoji:"🐻", types:["Normal"],
    base:{hp:140,atk:116,def:97,spa:77,spd:77,spe:43},
    learnset:[[1,"headbutt"],[1,"body_slam"],[2,"battle_cry"],[3,"swords_dance"],[4,"recover"],[38,"hyper_beam"],[42,"wild_tumble"],[46,"momentum_rush"],[50,"vital_pulse"],[54,"instinct_slash"],[58,"harden"],[62,"tackle"],[5,"focus_roar"],[44,"leer"]],
    evolveTo:null, evolveLevel:null, catchRate:25, expYield:270, rarity:"rare",
    desc:"The greatest bear that has ever walked Lumoria. When it stands fully upright, it blots out the sun. Its roar has been mistaken for natural disasters.",
    lore:"Behemovast is a titanic normal-type creature 3 metres at the shoulder, resembling an enormous bear with a solid barrel-shaped torso and legs like columns — Glutoros's already-massive frame has grown into the heaviest non-legendary Lumori known, and the heavy russet-brown fur has matted and toughened to thick brown-grey under the bulk it must now support. It is the heaviest non-legendary Lumori known and leaves impressions in solid rock where it steps." },

  // =====================================================================
  // NG+-EXCLUSIVE LUMORI (IDs 322–407) — appear only in New Game+ runs
  // Forgotten Lumori (IDs 408–446) live in a separate range gated behind
  // completing the Vaeldris Wielder quest line; they are NOT NG+-exclusive.
  // =====================================================================

  // ---- Tier 1a: Mid-game NG+ (badges 8–11 areas) BST ~490–540 ----
  // LORE-AUDIT FLAG (Step 4): PR #49 forced retype (Spectral/Fighting now pre-408 OK — reconsider)
  322: { id:322, name:"Venomwraith", emoji:"☠️", types:["Poison","Spectral"],
    base:{hp:60,atk:65,def:54,spa:81,spd:69,spe:71}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"poison_sting"],[10,"shadow_ball"],[20,"sludge_bomb"],[30,"miasma_cloud"],[40,"void_rend"],[50,"sludge_wave"],[60,"toxic_surge"],[5,"toxic"],[45,"venom_lance"]],
    catchRate:30, expYield:255, rarity:"rare",
    desc:"A wraith of pure venom that haunts poison-soaked ruins. Its touch corrupts everything.",
    lore:"Venomwraith is a poison-spectral entity 1.5 metres tall with a translucent body that glows sickly green. Corrosive vapour constantly seeps from its form." },

  323: { id:323, name:"Toxicore", emoji:"🧪", types:["Poison","Fire"],
    base:{hp:63,atk:73,def:58,spa:84,spd:62,spe:60}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[8,"poison_sting"],[18,"flamethrower"],[28,"sludge_bomb"],[38,"heat_wave"],[48,"acid_rain"],[58,"inferno"],[5,"toxic"],[42,"venom_lance"]],
    catchRate:28, expYield:260, rarity:"rare",
    desc:"An alchemical horror born in Miasma City's toxic reactors. Its core burns with caustic plasma.",
    lore:"Toxicore is a compact fire-poison creature 1.2 metres tall resembling a living flask of boiling acid. Its core chamber glows a violent orange-green." },

  324: { id:324, name:"Chittering", emoji:"🦂", types:["Nature","Dark"],
    base:{hp:54,atk:84,def:62,spa:58,spd:65,spe:77}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"bug_bite"],[12,"shadowstep"],[22,"bug_buzz"],[32,"umbral_claw"],[42,"phantom_claw"],[52,"shadow_ball"],[62,"bug_buzz"],[5,"shadow_sneak"],[38,"void_rend"]],
    catchRate:25, expYield:248, rarity:"rare",
    desc:"A razor-limbed predator insect that hunts in absolute darkness. It clicks its mandibles as it circles prey.",
    lore:"Chittering is a sleek dark-coloured insect 1.3 metres long with six blade-like limbs and multi-faceted crimson eyes that see perfectly in darkness." },

  325: { id:325, name:"Dunespike", emoji:"🏜️", types:["Earth","Poison"],
    base:{hp:70,atk:81,def:69,spa:56,spd:61,spe:68}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"earth_power"],[10,"poison_sting"],[22,"terra_spike"],[32,"sludge_bomb"],[42,"fissure_slam"],[52,"acid_rain"],[62,"earth_power"],[5,"toxic"],[35,"venom_lance"]],
    catchRate:28, expYield:252, rarity:"rare",
    desc:"A burrowing predator that injects venom through bone spikes as it erupts from the sand.",
    lore:"Dunespike is a powerful ground-poison creature 1.6 metres long resembling an armoured mole-rat with elongated venom spines along its spine and snout." },

  326: { id:326, name:"Silthorn", emoji:"🌿", types:["Nature","Poison"],
    base:{hp:66,atk:69,def:72,spa:77,spd:69,spe:52}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"vine_whip"],[12,"poison_sting"],[22,"energy_ball"],[32,"sludge_bomb"],[42,"root_lance"],[52,"verdant_surge"],[62,"acid_rain"],[5,"toxic"],[38,"sleep_powder"]],
    catchRate:30, expYield:250, rarity:"rare",
    desc:"A carnivorous marsh plant that lures prey with sweet-smelling nectar before paralysing them with venom.",
    lore:"Silthorn is a large ambulatory plant 1.8 metres tall with glossy dark-green leaves edged with translucent purple poison sacs. Its roots move like fingers." },

  // LORE-AUDIT FLAG (Step 4): auto-collapsed to mono in Phase B — review for re-dual
  327: { id:327, name:"Quarrex", emoji:"⛏️", types:["Earth"],
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

  329: { id:329, name:"Skullmite", emoji:"💀", types:["Nature","Mineral"],
    base:{hp:65,atk:81,def:84,spa:52,spd:65,spe:73}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"bug_bite"],[10,"rock_throw"],[20,"metal_claw"],[25,"gem_storm"],[30,"rock_slide"],[40,"fossil_rush"],[50,"bug_buzz"],[60,"iron_tail"],[5,"harden"],[38,"venom_drool"]],
    catchRate:26, expYield:256, rarity:"rare",
    desc:"An armoured beetle with a fossilised shell harder than most metals. Ancient specimens are sold as armour.",
    lore:"Skullmite is a beetle-like mineral creature 1.1 metres long with a helmet-shaped carapace of fossilised mineral. Its mandibles can crack geodes." },

  330: { id:330, name:"Blistermaw", emoji:"🐊", types:["Aquatic","Poison"],
    base:{hp:71,atk:80,def:66,spa:77,spd:69,spe:57}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"water_gun"],[10,"poison_sting"],[20,"tidal_crush"],[30,"sludge_bomb"],[40,"hydro_pump"],[50,"sludge_wave"],[60,"sea_serpent_strike"],[5,"toxic"],[38,"venom_lance"]],
    catchRate:28, expYield:258, rarity:"rare",
    desc:"A swamp crocodilian with acid-laced saliva. Prey dissolves within minutes of a bite.",
    lore:"Blistermaw is a water-poison reptile 2.8 metres long resembling a heavily built crocodile with blistered, acid-weeping skin and rows of hollow venom-conducting teeth." },

  // LORE-AUDIT FLAG (Step 4): auto-collapsed to mono in Phase B — review for re-dual
  331: { id:331, name:"Thornmoth", emoji:"🦋", types:["Nature"],
    base:{hp:55,atk:63,def:58,spa:78,spd:68,spe:78}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"gust"],[8,"vine_whip"],[18,"bug_bite"],[28,"razor_leaf"],[38,"bug_buzz"],[48,"canopy_crash"],[58,"verdant_surge"],[5,"sleep_powder"],[35,"spore_burst"]],
    catchRate:28, expYield:248, rarity:"rare",
    desc:"A giant moth covered in razor-edged leaf-scales. Its wing-beats strip bark from trees.",
    lore:"Thornmoth is a large bug-grass creature with a 2-metre wingspan. Its wings resemble overlapping serrated leaves in deep emerald and brown patterns." },

  // ---- Tier 1b: Mid-game NG+ (badges 8–11) Metal/Ice/Electric BST ~510–550 ----
  332: { id:332, name:"Glacicore", emoji:"🧊", types:["Ice","Metal"],
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

  334: { id:334, name:"Ferrocrush", emoji:"⚙️", types:["Metal","Fire"],
    base:{hp:83,atk:104,def:100,spa:52,spd:70,spe:61}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"metal_claw"],[10,"earth_power"],[20,"iron_tail"],[30,"fissure_slam"],[40,"flash_cannon"],[50,"terra_spike"],[60,"fossil_rush"],[5,"harden"],[38,"alloy_edge"]],
    catchRate:22, expYield:268, rarity:"rare",
    desc:"A mechanical behemoth forged in Ironforge's deepest furnaces. It was never meant to leave.",
    lore:"Ferrocrush is a 2.5-metre metal-fire golem with a body of smelted iron and a core of compressed ore. Its joints run at thousands of atmospheres of pressure." },

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

  337: { id:337, name:"Ashgolem", emoji:"🔥", types:["Fire","Mineral"],
    base:{hp:87,atk:97,def:91,spa:77,spd:68,spe:50}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[5,"harden"],[10,"rock_throw"],[15,"molten_armor"],[20,"flamethrower"],[30,"rock_slide"],[40,"heat_wave"],[40,"magma_surge"],[50,"fossil_rush"],[60,"fire_blast"]],
    catchRate:24, expYield:265, rarity:"rare",
    desc:"A creature born from a volcanic eruption, its body is a walking magma chamber encased in basalt.",
    lore:"Ashgolem is a fire-mineral creature 2 metres tall with a body of cooling basalt cracked to reveal glowing magma beneath. Ash and cinders constantly drift from its surface." },

  338: { id:338, name:"Rimeclaw", emoji:"🦅", types:["Ice"],
    base:{hp:64,atk:88,def:61,spa:76,spd:69,spe:97}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"powder_snow"],[8,"gust"],[18,"ice_punch"],[28,"air_slash"],[38,"cryo_lance"],[48,"blizzard"],[58,"tailwind_strike"],[5,"zephyr_dance"],[35,"ice_beam"]],
    catchRate:25, expYield:258, rarity:"rare",
    desc:"A hawk that nests on storm-capped peaks. Its talons are perpetually coated in razor-sharp ice.",
    lore:"Rimeclaw is an ice-flying raptor with a 2.4-metre wingspan and talons of permanent glacial ice that never melt. Its primary feathers cut like edged weapons." },

  339: { id:339, name:"Voltbeetle", emoji:"⚡", types:["Electric","Sonic"],
    base:{hp:66,atk:81,def:86,spa:75,spd:72,spe:80}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"bug_bite"],[10,"thunder_shock"],[20,"metal_claw"],[30,"thunderbolt"],[40,"bug_buzz"],[50,"volt_surge"],[60,"thunder"],[5,"harden"],[38,"alloy_edge"]],
    catchRate:26, expYield:257, rarity:"rare",
    desc:"A beetle that accumulates static charge on its elytra. Touching its wing-covers triggers a full discharge.",
    lore:"Voltbeetle is a squat beetle 0.9 metres long with highly polished elytra that generate static electricity from air resistance alone. A constant low hum surrounds it." },

  340: { id:340, name:"Cryoshard", emoji:"💎", types:["Ice","Mental"],
    base:{hp:63,atk:68,def:72,spa:102,spd:89,spe:66}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"powder_snow"],[10,"psychic_move"],[20,"ice_beam"],[30,"psystrike"],[40,"cryo_lance"],[50,"mind_shatter"],[60,"blizzard"],[5,"winter_shroud"],[38,"prism_ward"]],
    catchRate:24, expYield:262, rarity:"rare",
    desc:"A sentient crystal of psychically-active ice. Its facets reflect possible futures.",
    lore:"Cryoshard is a floating ice-psychic crystal 1 metre across with an irregular faceted form that constantly shifts. Each face reflects a different perceived future of whoever looks into it." },

  341: { id:341, name:"Mirestone", emoji:"🪨", types:["Earth","Mental"],
    base:{hp:72,atk:70,def:93,spa:89,spd:83,spe:53}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"rock_throw"],[10,"psychic_move"],[20,"rock_slide"],[30,"psystrike"],[40,"fossil_rush"],[50,"mind_shatter"],[60,"neural_storm"],[5,"prism_ward"],[38,"harden"]],
    catchRate:24, expYield:263, rarity:"rare",
    desc:"A monolith of psychically-resonant stone found at ancient ley line intersections.",
    lore:"Mirestone is a floating rock-psychic entity resembling a worn monolith 1.5 metres tall. Ancient carvings on its surface glow when it uses psychic powers." },

  // ---- Tier 2: Late-game NG+ (badges 12–16 areas) BST ~545–590 ----
  // LORE-AUDIT FLAG (Step 4): PR #49 forced retype (Spectral/Fighting now pre-408 OK — reconsider)
  342: { id:342, name:"Wraithking", emoji:"👑", types:["Dark","Spectral"],
    base:{hp:69,atk:94,def:71,spa:92,spd:79,spe:90}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"shadow_ball"],[10,"void_rend"],[20,"umbral_claw"],[30,"phantom_claw"],[40,"shadow_sneak"],[50,"shadowstep"],[60,"neural_storm"],[5,"toxic"],[38,"mind_shatter"]],
    catchRate:18, expYield:285, rarity:"rare",
    desc:"The apex ghost predator — a crowned wraith that rules over all lesser ghost-types in its domain.",
    lore:"Wraithking is a dark-spectral entity 2 metres tall with a spectral crown of black flame. It commands lesser ghost-types and its presence causes all light sources within 50 metres to dim." },

  343: { id:343, name:"Shadowreave", emoji:"🌑", types:["Dark","Spectral"],
    base:{hp:66,atk:81,def:66,spa:103,spd:85,spe:89}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"shadowstep"],[10,"psychic_move"],[20,"void_rend"],[30,"psystrike"],[40,"phantom_claw"],[50,"mind_shatter"],[60,"neural_storm"],[5,"shadow_sneak"],[38,"dreamweave"]],
    catchRate:18, expYield:283, rarity:"rare",
    desc:"A being of living shadow that exists simultaneously in darkness and the spectral realm. It phases through walls to hunt, its constantly shifting silhouette making it nearly impossible to track.",
    lore:"Shadowreave is a dark-spectral entity 1.6 metres tall with a body composed of living shadow and two luminous violet eyes. Its silhouette is never quite the same shape twice." },

  // LORE-AUDIT FLAG (Step 4): PR #49 forced retype (Spectral/Fighting now pre-408 OK — reconsider)
  344: { id:344, name:"Glimmeritch", emoji:"🧚", types:["Fairy","Spectral"],
    base:{hp:63,atk:69,def:68,spa:102,spd:91,spe:97}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"fairy_wind"],[10,"shadow_ball"],[20,"fae_requiem"],[30,"psystrike"],[40,"phantom_claw"],[50,"void_rend"],[60,"fae_requiem"],[5,"dreamweave"],[38,"prism_ward"]],
    catchRate:18, expYield:280, rarity:"rare",
    desc:"A corrupted fairy that has passed through death and returned. Its glow is beautiful and deeply unsettling.",
    lore:"Glimmeritch is a fairy-spectral creature resembling a 0.6-metre glowing humanoid with translucent wings and a body that flickers between solid and spectral forms." },

  345: { id:345, name:"Voidcoil", emoji:"🌀", types:["Dark","Draconic"],
    base:{hp:73,atk:99,def:75,spa:90,spd:77,spe:81}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"dragon_breath"],[10,"void_rend"],[20,"dragon_claw"],[30,"shadow_ball"],[40,"wyrm_strike"],[50,"phantom_claw"],[60,"cataclysm_breath"],[5,"dragon_dance"],[38,"primordial_roar"]],
    catchRate:16, expYield:290, rarity:"rare",
    desc:"A dragon born from a void rift. Its scales absorb all light, making it nearly invisible in darkness.",
    lore:"Voidcoil is a dark-dragon serpent 4 metres long with scales so black they create a visible absence of light. Its eyes emit dim crimson light visible only in complete darkness." },

  346: { id:346, name:"Astralwing", emoji:"🌟", types:["Mental","Wind"],
    base:{hp:67,atk:74,def:65,spa:100,spd:88,spe:96}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"gust"],[10,"psychic_move"],[20,"air_slash"],[30,"psystrike"],[40,"tailwind_strike"],[50,"mind_shatter"],[60,"neural_storm"],[5,"zephyr_dance"],[38,"dreamweave"]],
    catchRate:17, expYield:285, rarity:"rare",
    desc:"A being of pure psychic energy given wings. It navigates by reading the surface thoughts of other creatures.",
    lore:"Astralwing is a psychic-flying entity with a 3-metre wingspan composed of solidified psychic energy. Its body is a luminous humanoid shape with feathers made of thought-light." },

  347: { id:347, name:"Embersteel", emoji:"🔩", types:["Metal","Fire"],
    base:{hp:77,atk:104,def:98,spa:77,spd:75,spe:69}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"metal_claw"],[10,"ember"],[20,"iron_tail"],[30,"flamethrower"],[40,"flash_cannon"],[50,"heat_wave"],[60,"solar_flare"],[5,"embercloak"],[38,"alloy_edge"]],
    catchRate:16, expYield:292, rarity:"rare",
    desc:"Forged in Ironforge's legendary seventh furnace, it is the pinnacle of fire-steel metallurgy.",
    lore:"Embersteel is a steel-fire golem 2.2 metres tall with a body of superheated steel that glows white-hot at its joints. It was created as a guardian automaton and has never been fully tamed." },

  348: { id:348, name:"Galedrake", emoji:"🌪️", types:["Draconic","Wind"],
    base:{hp:69,atk:91,def:69,spa:91,spd:76,spe:99}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"gust"],[10,"dragon_breath"],[20,"air_slash"],[30,"dragon_claw"],[40,"tailwind_strike"],[50,"wyvern_gust"],[60,"scale_storm"],[5,"zephyr_dance"],[38,"wyrm_strike"]],
    catchRate:16, expYield:288, rarity:"rare",
    desc:"A dragon that rides perpetual cyclones of its own creation. It cannot stop flying or the storm dies.",
    lore:"Galedrake is a dragon-wind creature 3.5 metres long with broad swept-back wings that generate a constant personal cyclone. The air around it is always in violent circular motion." },

  349: { id:349, name:"Crystavault", emoji:"💠", types:["Ice","Mineral"],
    base:{hp:80,atk:91,def:109,spa:74,spd:87,spe:54}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ice_punch"],[5,"harden"],[10,"rock_throw"],[12,"cryogenic_field"],[15,"crystal_veil"],[18,"frost_armor"],[20,"ice_beam"],[22,"ice_hammer"],[25,"crystal_glow"],[28,"ice_resonance"],[30,"rock_slide"],[38,"winter_shroud"],[40,"cryo_lance"],[50,"fossil_rush"],[60,"blizzard"]],
    catchRate:16, expYield:292, rarity:"rare",
    desc:"A fortress of living glacier-stone. Its outer shell has never been successfully breached in recorded history.",
    lore:"Crystavault is an ice-mineral creature 2.5 metres tall resembling a fortified tower of layered glacial ice and granite. Ancient siege equipment has been found bent and broken around specimens." },

  350: { id:350, name:"Fernwrath", emoji:"🌿", types:["Nature","Draconic"],
    base:{hp:73,atk:95,def:75,spa:92,spd:79,spe:81}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"vine_whip"],[10,"dragon_breath"],[20,"root_lance"],[30,"dragon_pulse"],[40,"canopy_crash"],[50,"wyrm_strike"],[60,"verdant_surge"],[5,"dragon_dance"],[38,"ancient_breath"]],
    catchRate:15, expYield:292, rarity:"rare",
    desc:"A dragon grown from the world's oldest forest. Its scales are living wood; vines sprout from its wounds.",
    lore:"Fernwrath is a grass-dragon 4 metres long with scales of polished dark wood and a mane of living ferns. Where it walks, plants accelerate through their entire life cycle in hours." },

  351: { id:351, name:"Spectravore", emoji:"🌈", types:["Mental","Mineral"],
    base:{hp:65,atk:71,def:68,spa:104,spd:92,spe:90}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"fairy_wind"],[10,"psychic_move"],[20,"fae_requiem"],[25,"ore_ray"],[30,"psystrike"],[40,"mind_shatter"],[45,"quartz_blast"],[50,"neural_storm"],[60,"fae_requiem"],[5,"dreamweave"],[38,"prism_ward"]],
    catchRate:15, expYield:288, rarity:"rare",
    desc:"A being of pure prismatic thought that feeds on raw psychic energy. It is invariably found near psychic Lumori.",
    lore:"Spectravore is a mental-mineral entity 1 metre tall — Spectroo's translucent white-light kangaroo silhouette has fractured under prism-stone exposure into a floating iridescent humanoid, the pouch's concentrated psychic energy now dispersed as a shifting aura of all visible colours surrounding it." },

  // ---- Tier 3: Post-game NG+ (requiresChampion areas) BST ~580–630 ----
  352: { id:352, name:"Voidlord", emoji:"🕳️", types:["Mental","Spectral"],
    base:{hp:72,atk:94,def:76,spa:100,spd:84,spe:89}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"void_rend"],[10,"mind_shatter"],[20,"phantom_claw"],[30,"neural_storm"],[40,"shadowstep"],[50,"psystrike"],[60,"cataclysm_breath"],[5,"dreamweave"],[45,"prism_ward"]],
    catchRate:12, expYield:308, rarity:"rare",
    desc:"The sovereign of all void-touched creatures. Its mind is a labyrinth with no exit.",
    lore:"Voidlord is a mental-spectral entity 2.2 metres tall with a body of solidified void-matter and a crown of hovering psychic fragments. No one who has entered its mindscape has returned unchanged." },

  353: { id:353, name:"Infernotitan", emoji:"🌋", types:["Draconic","Mineral"],
    base:{hp:78,atk:106,def:82,spa:98,spd:74,spe:82}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"flamethrower"],[5,"char_dance"],[10,"dragon_claw"],[15,"lava_drop"],[20,"fire_blast"],[25,"magma_strike"],[30,"dragon_pulse"],[35,"molten_tide"],[38,"primordial_roar"],[40,"solar_flare"],[50,"cataclysm_breath"],[60,"ancient_breath"]],
    catchRate:10, expYield:318, rarity:"rare",
    desc:"A volcanic dragon that erupts when enraged. Continents have shifted from its ancient battles.",
    lore:"Infernotitan is a mineral-dragon 6 metres long with scales of hardened magma and breath hot enough to liquefy stone. Ancient geological surveys attribute certain canyon formations to its rampages." },

  354: { id:354, name:"Riftwhale", emoji:"🐋", types:["Aquatic","Mental"],
    base:{hp:105,atk:77,def:88,spa:99,spd:93,spe:53}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"surf"],[10,"psychic_move"],[20,"hydro_pump"],[30,"psystrike"],[40,"sea_serpent_strike"],[50,"mind_shatter"],[60,"neural_storm"],[5,"tidecaller"],[38,"dreamweave"]],
    catchRate:10, expYield:315, rarity:"rare",
    desc:"A leviathan that travels between dimensions using psychic rift gates. Islands vanish when it surfaces.",
    lore:"Riftwhale is a water-psychic creature 12 metres long resembling a colossal whale with flanks covered in luminous psychic sigils. It navigates by warping local space." },

  355: { id:355, name:"Abyssalith", emoji:"🌊", types:["Aquatic","Toxin"],
    base:{hp:81,atk:99,def:88,spa:89,spd:81,spe:77}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"surf"],[10,"void_rend"],[20,"tidal_crush"],[22,"tox_drown"],[30,"shadow_ball"],[32,"tox_acidic_glance"],[40,"hydro_pump"],[45,"tox_storm_spec"],[50,"sea_serpent_strike"],[60,"sludge_wave"],[5,"shadowstep"],[38,"phantom_claw"]],
    catchRate:10, expYield:318, rarity:"rare",
    desc:"A hunter from the deepest abyss. Light physically bends around it as though avoiding contact.",
    lore:"Abyssalith is a water-toxin creature 5 metres long resembling an armoured eel with bioluminescent lures. Its black scales have a refractive property that makes it nearly invisible underwater." },

  356: { id:356, name:"Stormlord", emoji:"⛈️", types:["Electric","Draconic"],
    base:{hp:72,atk:92,def:72,spa:104,spd:82,spe:98}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"thunder_shock"],[10,"dragon_breath"],[20,"thunderbolt"],[30,"dragon_pulse"],[40,"thunder"],[50,"wyrm_strike"],[60,"volt_surge"],[5,"dragon_dance"],[38,"ancient_breath"]],
    catchRate:10, expYield:320, rarity:"rare",
    desc:"A dragon that calls down storms across entire regions. It is the living embodiment of a thunderhead.",
    lore:"Stormlord is an electric-dragon 5 metres long with scales of polished chrome-blue and wing membranes of crackling electricity. The sky darkens for 100 kilometres when it takes flight." },

  357: { id:357, name:"Thornspire", emoji:"🌳", types:["Nature","Metal"],
    base:{hp:83,atk:91,def:108,spa:83,spd:90,spe:60}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"vine_whip"],[10,"metal_claw"],[20,"root_lance"],[30,"iron_tail"],[40,"canopy_crash"],[50,"flash_cannon"],[60,"verdant_surge"],[5,"thornwall"],[38,"alloy_edge"]],
    catchRate:10, expYield:316, rarity:"rare",
    desc:"An ancient tree-god whose bark is stronger than titanium. It has not moved in ten thousand years.",
    lore:"Thornspire is a grass-steel creature 8 metres tall resembling an impossibly old tree with branches of reinforced steel-alloy and roots that pierce solid bedrock." },

  358: { id:358, name:"Pyrocrown", emoji:"👑", types:["Fire","Mental"],
    base:{hp:71,atk:83,def:73,spa:111,spd:92,spe:90}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[10,"psychic_move"],[20,"flamethrower"],[30,"psystrike"],[40,"solar_flare"],[50,"mind_shatter"],[60,"neural_storm"],[5,"char_dance"],[38,"dreamweave"]],
    catchRate:10, expYield:318, rarity:"rare",
    desc:"A psychic phoenix wearing a crown of permanent solar fire. Flame is its thought made manifest.",
    lore:"Pyrocrown is a fire-psychic bird 1.8 metres tall with feathers of solidified flame and a crown of pure solar fire. Its thoughts manifest as bursts of psychokinetic flame." },

  359: { id:359, name:"Glaciarch", emoji:"❄️", types:["Ice","Mental"],
    base:{hp:73,atk:79,def:90,spa:107,spd:93,spe:73}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ice_beam"],[10,"psychic_move"],[20,"cryo_lance"],[30,"psystrike"],[40,"blizzard"],[50,"mind_shatter"],[60,"neural_storm"],[5,"prism_ward"],[38,"winter_shroud"]],
    catchRate:10, expYield:316, rarity:"rare",
    desc:"The sovereign of all ice-bound psychics. Its mind is as cold and clear as absolute zero.",
    lore:"Glaciarch is an ice-psychic entity 2 metres tall resembling an idealised humanoid carved entirely from deep blue glacial ice. Its eyes are voids of total blue-white." },

  360: { id:360, name:"Duskmantle", emoji:"🌙", types:["Dark","Mental"],
    base:{hp:68,atk:83,def:73,spa:105,spd:98,spe:93}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"fairy_wind"],[10,"void_rend"],[20,"fae_requiem"],[30,"shadow_ball"],[40,"phantom_claw"],[50,"mind_shatter"],[60,"neural_storm"],[5,"shadowstep"],[38,"dreamweave"]],
    catchRate:10, expYield:318, rarity:"rare",
    desc:"A twilight sovereign that rules the threshold between day and night. It is neither fully light nor dark.",
    lore:"Duskmantle is a dark-mental entity 1.8 metres tall that appears different from each angle — from one side it is a being of radiant thought, from the other a creature of shadow. Both states are equally real." },

  361: { id:361, name:"Tectolith", emoji:"🌍", types:["Earth","Draconic"],
    base:{hp:92,atk:104,def:94,spa:78,spd:82,spe:70}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"earth_power"],[10,"dragon_claw"],[20,"fissure_slam"],[30,"dragon_pulse"],[40,"terra_spike"],[50,"wyrm_strike"],[60,"eon_crash"],[5,"dragon_dance"],[38,"primordial_roar"]],
    catchRate:10, expYield:320, rarity:"rare",
    desc:"A dragon so old it has become part of the land itself. Earthquakes are merely it turning in its sleep.",
    lore:"Tectolith is a ground-dragon 7 metres long with a body of compacted tectonic plates and continents of moss and stone across its back. It is older than most mountain ranges." },

  // ---- Tier 3b: More post-game NG+ BST ~590–640 ----
  362: { id:362, name:"Lunaspectre", emoji:"🌕", types:["Mental","Spectral"],
    base:{hp:70,atk:78,def:74,spa:110,spd:94,spe:94}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"psychic_move"],[10,"shadow_ball"],[20,"psystrike"],[30,"void_rend"],[40,"mind_shatter"],[50,"phantom_claw"],[60,"neural_storm"],[5,"dreamweave"],[38,"prism_ward"]],
    catchRate:10, expYield:320, rarity:"rare",
    desc:"A moon-born spectre woven from lunar psychic energy. It appears only on nights of the full moon.",
    lore:"Lunaspectre is a mental-spectral entity 2 metres tall that resembles a human silhouette composed of condensed moonlight. Its edges blur and shimmer like a reflection on disturbed water." },

  363: { id:363, name:"Chromavast", emoji:"🎨", types:["Normal","Mental"],
    base:{hp:87,atk:90,def:83,spa:100,spd:90,spe:75}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"headbutt"],[10,"psychic_move"],[20,"body_slam"],[30,"psystrike"],[40,"hyper_beam"],[50,"mind_shatter"],[60,"neural_storm"],[5,"battle_cry"],[38,"dreamweave"]],
    catchRate:8, expYield:322, rarity:"rare",
    desc:"A colossal entity that shifts colour with its mood. When all colours appear simultaneously, it is enraged.",
    lore:"Chromavast is a normal-psychic creature 3 metres tall with a smooth ovoid body that cycles through every colour in the visible spectrum. Its form is constantly, slowly shifting." },

  364: { id:364, name:"Deepcrawler", emoji:"🦀", types:["Aquatic","Metal"],
    base:{hp:85,atk:100,def:107,spa:75,spd:85,spe:68}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"water_gun"],[10,"metal_claw"],[20,"tidal_crush"],[30,"iron_tail"],[40,"hydro_pump"],[50,"flash_cannon"],[60,"sea_serpent_strike"],[5,"harden"],[38,"alloy_edge"]],
    catchRate:9, expYield:320, rarity:"rare",
    desc:"An armoured crustacean from the ocean floor. Its shell is composed of self-reinforcing bio-steel alloy.",
    lore:"Deepcrawler is an aquatic-metal crustacean 2.5 metres across with a carapace of bio-synthesised steel alloy. Deep-sea pressure sensors have detected it moving at depths of 11 kilometres." },

  365: { id:365, name:"Cinderking", emoji:"🔥", types:["Fire","Dark"],
    base:{hp:75,atk:105,def:79,spa:94,spd:77,spe:90}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[10,"void_rend"],[20,"flamethrower"],[30,"shadow_ball"],[40,"solar_flare"],[50,"phantom_claw"],[60,"inferno"],[5,"char_dance"],[38,"umbral_claw"]],
    catchRate:9, expYield:318, rarity:"rare",
    desc:"A fire tyrant that rules through fear and flame. Its crown of black fire is cold to the touch.",
    lore:"Cinderking is a fire-dark creature 2.5 metres tall with a regal, bipedal form and a crown of black fire. It rules fire-type territory through dominance displays so intense that lesser fire-types flee entire regions." },

  366: { id:366, name:"Starlance", emoji:"⭐", types:["Mental","Metal"],
    base:{hp:67,atk:94,def:90,spa:99,spd:82,spe:88}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"metal_claw"],[10,"psychic_move"],[20,"iron_tail"],[30,"psystrike"],[40,"flash_cannon"],[50,"mind_shatter"],[60,"neural_storm"],[5,"alloy_edge"],[38,"prism_ward"]],
    catchRate:9, expYield:322, rarity:"rare",
    desc:"A celestial lance that achieved sentience. It fell from orbit and has been fighting battles ever since.",
    lore:"Starlance is a psychic-steel entity 2 metres long resembling an elongated lance of alien metal with psychic runes carved along its entire length. It moves by telekinesis." },

  367: { id:367, name:"Bouldertide", emoji:"🌊", types:["Aquatic","Mineral"],
    base:{hp:91,atk:97,def:103,spa:80,spd:83,spe:66}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"water_gun"],[5,"harden"],[10,"rock_throw"],[15,"ancient_tide"],[20,"surf"],[30,"rock_slide"],[38,"tidal_crush"],[40,"hydro_pump"],[45,"mineral_press"],[50,"fossil_rush"],[60,"sea_serpent_strike"]],
    catchRate:9, expYield:318, rarity:"rare",
    desc:"A creature that is half ocean, half cliff-face. It creates tsunamis as a side effect of moving.",
    lore:"Bouldertide is an aquatic-mineral creature 4 metres tall resembling a tide-carved sea stack that walks. Aquatic constantly flows through channels in its stone body." },

  // LORE-AUDIT FLAG (Step 4): PR #49 forced retype (Spectral/Fighting now pre-408 OK — reconsider)
  368: { id:368, name:"Willowisp", emoji:"🕯️", types:["Fire","Spectral"],
    base:{hp:67,atk:80,def:69,spa:110,spd:93,spe:101}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[10,"shadow_ball"],[20,"flamethrower"],[30,"void_rend"],[40,"solar_flare"],[50,"phantom_claw"],[60,"inferno"],[5,"shadowstep"],[38,"shadow_sneak"]],
    catchRate:9, expYield:320, rarity:"rare",
    desc:"An ancient will-o-the-wisp grown to monstrous power. It leads the living into the realm of flame.",
    lore:"Willowisp is a fire-spectral entity resembling a human-sized floating flame with a faint spectral face visible in its core. Its fire burns without fuel and consumes nothing physical." },

  369: { id:369, name:"Gravithorn", emoji:"🔮", types:["Mental","Earth"],
    base:{hp:80,atk:94,def:88,spa:100,spd:84,spe:74}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"earth_power"],[10,"psychic_move"],[20,"terra_spike"],[30,"psystrike"],[40,"fissure_slam"],[50,"mind_shatter"],[60,"neural_storm"],[5,"prism_ward"],[38,"dreamweave"]],
    catchRate:9, expYield:320, rarity:"rare",
    desc:"A psychic that has learned to manipulate gravity. It walks on any surface, including the sky.",
    lore:"Gravithorn is a psychic-ground entity 1.8 metres tall with a body of psychically compressed stone. It can reverse gravity in a 30-metre radius and routinely walks on vertical surfaces." },

  370: { id:370, name:"Vortexwing", emoji:"🌪️", types:["Electric","Sonic"],
    base:{hp:70,atk:90,def:68,spa:101,spd:81,spe:110}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"gust"],[10,"thunder_shock"],[20,"air_slash"],[30,"thunderbolt"],[40,"tailwind_strike"],[50,"volt_surge"],[60,"thunder"],[5,"zephyr_dance"],[38,"thunder_wave"]],
    catchRate:9, expYield:322, rarity:"rare",
    desc:"A living tornado that generates electricity from its rotation. Anything inside it is shredded and electrocuted simultaneously.",
    lore:"Vortexwing is an electric-sonic entity 3 metres tall that exists as a permanent self-sustaining vortex. At its core is a dense electromagnetic nucleus visible as a crackling violet sphere." },

  371: { id:371, name:"Nullform", emoji:"⬛", types:["Dark","Normal"],
    base:{hp:82,atk:95,def:82,spa:94,spd:86,spe:86}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"void_rend"],[10,"headbutt"],[20,"shadow_ball"],[30,"body_slam"],[40,"phantom_claw"],[50,"hyper_beam"],[60,"neural_storm"],[5,"shadowstep"],[38,"battle_cry"]],
    catchRate:8, expYield:325, rarity:"rare",
    desc:"A creature with no definite type at heart. It absorbs the nature of whatever it defeats.",
    lore:"Nullform is a dark-normal creature 2 metres tall with a body of perfect matte black that reflects no light at all. It has no fixed features but rearranges its form to match whatever it has most recently defeated." },

  // ---- Tier 4: Prismatic Rift exclusives BST ~630–670 ----
  372: { id:372, name:"Prismancer", emoji:"🌈", types:["Draconic","Mineral"],
    base:{hp:69,atk:89,def:77,spa:107,spd:89,spe:89}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"psychic_move"],[10,"dragon_pulse"],[20,"psystrike"],[30,"dragon_claw"],[40,"mind_shatter"],[50,"wyrm_strike"],[60,"neural_storm"],[5,"dragon_dance"],[48,"cataclysm_breath"]],
    catchRate:8, expYield:335, rarity:"rare",
    desc:"A dragon born from a rift in the visible spectrum. Its scales cycle through every wavelength of light.",
    lore:"Prismancer is a mineral-dragon 4 metres long whose scales shift through every colour of visible light in a constant slow cycle. The air around it refracts into rainbow halos." },

  373: { id:373, name:"Voidrend", emoji:"🌌", types:["Dark","Spectral"],
    base:{hp:69,atk:103,def:74,spa:92,spd:82,spe:100}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"void_rend"],[10,"phantom_claw"],[20,"shadow_ball"],[30,"shadowstep"],[40,"umbral_claw"],[50,"mind_shatter"],[60,"neural_storm"],[5,"shadow_sneak"],[48,"cataclysm_breath"]],
    catchRate:7, expYield:338, rarity:"rare",
    desc:"A predator from between realities. It tears holes in space as naturally as others breathe.",
    lore:"Voidrend is a dark-spectral entity 2.5 metres tall with a body that exists simultaneously in normal space and the void between dimensions. Its claws leave visible tears in reality that slowly heal." },

  374: { id:374, name:"Auroradrake", emoji:"🌠", types:["Ice","Draconic"],
    base:{hp:69,atk:92,def:78,spa:102,spd:85,spe:94}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ice_beam"],[10,"dragon_breath"],[20,"cryo_lance"],[30,"dragon_pulse"],[40,"blizzard"],[50,"scale_storm"],[60,"cataclysm_breath"],[5,"dragon_dance"],[48,"ancient_breath"]],
    catchRate:7, expYield:338, rarity:"rare",
    desc:"A dragon woven from the aurora itself. It migrates between magnetic poles, trailing lights across the sky.",
    lore:"Auroradrake is an ice-dragon 5 metres long with translucent scales that emit bioluminescent light in bands of green, violet, and gold — a living aurora. It navigates by magnetic field." },

  375: { id:375, name:"Fluxserpent", emoji:"⚡", types:["Electric","Mental"],
    base:{hp:67,atk:85,def:70,spa:110,spd:87,spe:101}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"thunder_shock"],[10,"psychic_move"],[20,"thunderbolt"],[30,"psystrike"],[40,"thunder"],[50,"mind_shatter"],[60,"neural_storm"],[5,"thunder_wave"],[48,"volt_surge"]],
    catchRate:7, expYield:340, rarity:"rare",
    desc:"A serpent of pure electrokinetic thought. It rewrites neural pathways with a single discharge.",
    lore:"Fluxserpent is an electric-mental serpent 3 metres long composed of a continuous loop of electrical current given physical form. It can project its consciousness through any electrical system." },

  376: { id:376, name:"Solarwrath", emoji:"☀️", types:["Fire","Fairy"],
    base:{hp:68,atk:84,def:73,spa:112,spd:89,spe:94}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ember"],[10,"fairy_wind"],[20,"solar_flare"],[30,"fae_requiem"],[40,"fire_blast"],[50,"mind_shatter"],[60,"neural_storm"],[5,"char_dance"],[48,"solar_flare"]],
    catchRate:7, expYield:338, rarity:"rare",
    desc:"A being of concentrated solar fury blessed by ancient fairy magic. It has never been touched by shadow.",
    lore:"Solarwrath is a fire-fairy creature 2 metres tall composed of radiant solar plasma. It is warm to be near and hot to approach — within 10 metres, all shadow is eliminated." },

  377: { id:377, name:"Abyssforge", emoji:"🌋", types:["Earth","Metal"],
    base:{hp:85,atk:103,def:105,spa:73,spd:81,spe:73}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"earth_power"],[10,"metal_claw"],[20,"fissure_slam"],[30,"iron_tail"],[40,"terra_spike"],[50,"flash_cannon"],[60,"fossil_rush"],[5,"harden"],[48,"alloy_edge"]],
    catchRate:7, expYield:340, rarity:"rare",
    desc:"Born at the meeting of mantle and iron core, it forges new minerals inside itself as it moves.",
    lore:"Abyssforge is an earth-metal creature 3 metres tall with a body of compressed ultra-dense alloy formed under planetary core pressures. It leaves impressions in solid steel where it rests." },

  378: { id:378, name:"Dreamweald", emoji:"💭", types:["Mental","Dream"],
    base:{hp:69,atk:73,def:73,spa:113,spd:97,spe:95}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"fairy_wind"],[10,"psychic_move"],[20,"fae_requiem"],[30,"psystrike"],[40,"mind_shatter"],[50,"neural_storm"],[60,"dreamweave"],[5,"prism_ward"],[48,"cortex_spike"]],
    catchRate:7, expYield:340, rarity:"rare",
    desc:"A being that exists only in the shared dreamspace of nearby creatures. Physical contact wakes it permanently.",
    lore:"Dreamweald is a mental-dream entity visible only to those who are half-asleep. In full wakefulness it appears as a translucent shimmer, but in dreams it takes whatever form the dreamer most desires." },

  379: { id:379, name:"Riftscale", emoji:"🔮", types:["Draconic","Spectral"],
    base:{hp:78,atk:105,def:87,spa:111,spd:94,spe:105}, evolveTo:null, evolveLevel:null, ngPlusTier:2,
    learnset:[[1,"dragon_breath"],[10,"shadow_ball"],[20,"dragon_claw"],[30,"phantom_claw"],[40,"wyrm_strike"],[50,"void_rend"],[60,"cataclysm_breath"],[5,"dragon_dance"],[48,"eon_crash"]],
    catchRate:6, expYield:342, rarity:"legendary",
    desc:"A dragon that phases between worlds. Its scales exist in multiple realities simultaneously.",
    lore:"Riftscale is a draconic-spectral 4.5 metres long whose scales shimmer with a translucent quality — half of them appear solid and half ghostly. It can phase through solid matter at will." },

  380: { id:380, name:"Tempestborn", emoji:"⛈️", types:["Electric","Wind"],
    base:{hp:77,atk:98,def:77,spa:116,spd:94,spe:116}, evolveTo:null, evolveLevel:null, ngPlusTier:2,
    learnset:[[1,"thunder_shock"],[10,"gust"],[20,"thunderbolt"],[30,"air_slash"],[40,"thunder"],[50,"volt_surge"],[60,"tailwind_strike"],[5,"zephyr_dance"],[48,"neural_storm"]],
    catchRate:6, expYield:345, rarity:"legendary",
    desc:"Born at the eye of a century-storm. It IS the storm — a permanent atmospheric event given will.",
    lore:"Tempestborn is an electric-wind entity 4 metres across — a self-sustaining atmospheric vortex with a crackling lightning nucleus. Meteorologists have tracked it as both a storm and a living creature." },

  381: { id:381, name:"Crystalmind", emoji:"💎", types:["Mental","Metal"],
    base:{hp:69,atk:78,def:94,spa:107,spd:92,spe:80}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"metal_claw"],[10,"psychic_move"],[20,"alloy_edge"],[30,"psystrike"],[40,"flash_cannon"],[50,"mind_shatter"],[60,"neural_storm"],[5,"prism_ward"],[48,"cortex_spike"]],
    catchRate:6, expYield:345, rarity:"rare",
    desc:"A crystal computer of living steel and pure psychic energy. It has solved every problem ever posed to it.",
    lore:"Crystalmind is a psychic-steel entity 1.5 metres tall shaped like a perfect geometric polyhedron of living crystal laced with steel filaments. Its psychic processing speed exceeds any known computation." },

  // ---- Tier 5: Apex Summit exclusives BST ~655–695 ----
  382: { id:382, name:"Oblivionwing", emoji:"🖤", types:["Dark","Draconic"],
    base:{hp:71,atk:103,def:78,spa:95,spd:81,spe:97}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"dragon_claw"],[10,"void_rend"],[20,"wyrm_strike"],[30,"shadow_ball"],[40,"scale_storm"],[50,"phantom_claw"],[60,"cataclysm_breath"],[5,"dragon_dance"],[52,"primordial_roar"]],
    catchRate:5, expYield:355, rarity:"rare",
    desc:"A dragon that devours light itself. Darkness spreads for kilometres from wherever it roosts.",
    lore:"Oblivionwing is a dark-dragon 6 metres long with wings that absorb all incoming light. Flying overhead, it casts a shadow darker than any natural darkness. Stars are visible at noon beneath its wings." },

  383: { id:383, name:"Apexblade", emoji:"⚔️", types:["Metal","Draconic"],
    base:{hp:71,atk:112,def:93,spa:77,spd:81,spe:91}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"metal_claw"],[10,"dragon_breath"],[20,"iron_tail"],[30,"dragon_claw"],[40,"flash_cannon"],[50,"wyrm_strike"],[60,"scale_storm"],[5,"dragon_dance"],[52,"alloy_edge"]],
    catchRate:5, expYield:355, rarity:"rare",
    desc:"The ultimate fusion of forged steel and draconic power. Its body is a living weapon.",
    lore:"Apexblade is a steel-dragon 5 metres long with a body of folded ultra-steel and draconic biology merged at the cellular level. Every surface is an edge. Its teeth alone number 340." },

  384: { id:384, name:"Solarcrown", emoji:"🌞", types:["Fire","Stellar"],
    base:{hp:69,atk:83,def:76,spa:115,spd:91,spe:91}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"solar_flare"],[5,"char_dance"],[8,"sun_burst"],[10,"psychic_move"],[12,"flash_fire"],[15,"nova_strike"],[20,"fire_blast"],[25,"nova_burst"],[30,"psystrike"],[40,"heat_wave"],[45,"cosmic_flare"],[50,"mind_shatter"],[52,"dreamweave"],[55,"supernova_eruption"],[60,"neural_storm"]],
    catchRate:5, expYield:358, rarity:"legendary",
    desc:"The embodiment of solar noon — a psychic sun that walks the earth and has never known night.",
    lore:"Solarcrown is a fire-stellar entity 2.5 metres tall composed of compressed solar plasma. Its crown is a permanent coronal loop. Astronomers debate whether the sun responds to it or vice versa." },

  385: { id:385, name:"Permafrost", emoji:"🧊", types:["Ice","Earth"],
    base:{hp:87,atk:102,def:104,spa:75,spd:87,spe:70}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"ice_punch"],[10,"earth_power"],[20,"cryo_lance"],[30,"fissure_slam"],[40,"blizzard"],[50,"terra_spike"],[60,"ice_beam"],[5,"winter_shroud"],[52,"harden"]],
    catchRate:5, expYield:355, rarity:"rare",
    desc:"A creature so cold it freezes the ground beneath it permanently. It has never melted.",
    lore:"Permafrost is an ice-ground creature 3 metres tall resembling a glacial boulder with limbs. The ground beneath it freezes to a depth of 50 metres and does not thaw for decades after it leaves." },

  // LORE-AUDIT FLAG (Step 4): PR #49 forced retype (Spectral/Fighting now pre-408 OK — reconsider)
  386: { id:386, name:"Wraithstorm", emoji:"💀", types:["Electric","Spectral"],
    base:{hp:68,atk:92,def:70,spa:106,spd:84,spe:105}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"shadow_ball"],[10,"thunder_shock"],[20,"phantom_claw"],[30,"thunderbolt"],[40,"void_rend"],[50,"volt_surge"],[60,"thunder"],[5,"shadow_sneak"],[52,"neural_storm"]],
    catchRate:5, expYield:358, rarity:"rare",
    desc:"A ghost electrified by a lightning strike. It haunts storm fronts and strikes from inside the thunder.",
    lore:"Wraithstorm is an electric-spectral entity that exists inside active lightning bolts. Between strikes it takes the form of a translucent humanoid crackling with contained electricity." },

  387: { id:387, name:"Deepvoid", emoji:"🕳️", types:["Dark","Aquatic"],
    base:{hp:82,atk:94,def:85,spa:101,spd:85,spe:78}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"surf"],[10,"void_rend"],[20,"tidal_crush"],[30,"shadow_ball"],[40,"hydro_pump"],[50,"phantom_claw"],[60,"sea_serpent_strike"],[5,"shadowstep"],[52,"abyssal_jet"]],
    catchRate:5, expYield:355, rarity:"rare",
    desc:"Something pulled up from a depth so great that light has never touched it. It is the dark of absolute abyss.",
    lore:"Deepvoid is a dark-water creature 6 metres long with a featureless body of absolute black. No light reflects from it. It was first encountered when it breached from a trench 12 kilometres deep." },

  388: { id:388, name:"Chronolith", emoji:"⏳", types:["Earth","Mental"],
    base:{hp:85,atk:86,def:103,spa:100,spd:90,spe:61}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"rock_slide"],[10,"psychic_move"],[20,"fossil_rush"],[30,"psystrike"],[40,"rock_slide"],[50,"mind_shatter"],[60,"neural_storm"],[5,"prism_ward"],[52,"cortex_spike"]],
    catchRate:5, expYield:358, rarity:"rare",
    desc:"A stone that has witnessed every moment of Lumoria's history and remembers all of them simultaneously.",
    lore:"Chronolith is a rock-psychic entity resembling a massive standing stone 2.5 metres tall with geological strata that each contain a perfect frozen moment from the past, visible if viewed psychically." },

  389: { id:389, name:"Stormcrown", emoji:"⛈️", types:["Electric","Draconic"],
    base:{hp:78,atk:103,def:85,spa:118,spd:91,spe:108}, evolveTo:null, evolveLevel:null, ngPlusTier:2,
    learnset:[[1,"thunder_shock"],[10,"dragon_breath"],[20,"thunderbolt"],[30,"dragon_pulse"],[40,"thunder"],[50,"wyrm_strike"],[60,"cataclysm_breath"],[5,"dragon_dance"],[52,"volt_surge"]],
    catchRate:5, expYield:360, rarity:"legendary",
    desc:"The apex predator of electric dragons. Every storm in Lumoria eventually reports to it.",
    lore:"Stormcrown is an electric-dragon 5.5 metres long with a permanent crown of crackling lightning. It is the dominant electric-type in any region it inhabits and other electric creatures defer to it instinctively." },

  390: { id:390, name:"Voidgarden", emoji:"🌸", types:["Nature","Poison"],
    base:{hp:71,atk:81,def:77,spa:112,spd:93,spe:91}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"fairy_wind"],[10,"shadow_ball"],[20,"fae_requiem"],[30,"void_rend"],[40,"mind_shatter"],[50,"phantom_claw"],[60,"neural_storm"],[5,"dreamweave"],[52,"umbral_claw"]],
    catchRate:5, expYield:360, rarity:"rare",
    desc:"A garden of beautiful but corrupted plant life. Its flowers are as poisonous as they are gorgeous.",
    lore:"Voidgarden is a nature-poison entity 2 metres tall resembling a humanoid composed of venomous flowers and dark thorned vines growing simultaneously. The flowers glow with a light that induces euphoria." },

  391: { id:391, name:"Titanfang", emoji:"🦷", types:["Normal","Draconic"],
    base:{hp:88,atk:111,def:86,spa:77,spd:80,spe:83}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"headbutt"],[10,"dragon_breath"],[20,"body_slam"],[30,"dragon_claw"],[40,"hyper_beam"],[50,"wyrm_strike"],[60,"eon_crash"],[5,"dragon_dance"],[52,"primordial_roar"]],
    catchRate:5, expYield:362, rarity:"rare",
    desc:"The largest creature confirmed alive in Lumoria. It has no natural predators.",
    lore:"Titanfang is a normal-dragon creature 10 metres long resembling an ancient apex predator grown to impossible scale. The ground shakes with each step. Its roar is felt as a physical pressure for 30 kilometres." },

  // ---- Tier 5b: Ultra-rare Apex Summit BST ~680–710 ----
  392: { id:392, name:"Eondrake", emoji:"🐉", types:["Draconic","Mental"],
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

  394: { id:394, name:"Solarvast", emoji:"🌟", types:["Draconic","Stellar"],
    base:{hp:86,atk:120,def:92,spa:117,spd:92,spe:101}, evolveTo:null, evolveLevel:null, ngPlusTier:3,
    learnset:[[1,"flamethrower"],[5,"char_dance"],[8,"sun_burst"],[10,"dragon_breath"],[15,"searing_glare"],[20,"solar_flare"],[25,"starlight_charge"],[30,"dragon_pulse"],[35,"cosmic_slam"],[40,"fire_blast"],[50,"cataclysm_breath"],[55,"primordial_roar"],[55,"supernova_resolve"],[60,"ancient_breath"],[65,"galaxy_apocalypse"]],
    catchRate:4, expYield:370, rarity:"legendary",
    desc:"A stellar dragon born from the sun itself. The corona of its home star still wraps its body.",
    lore:"Solarvast is a stellar-dragon 7 metres long whose scales burn with the surface temperature of a star. It was first recorded appearing from a solar flare. Its breath weapon reaches temperatures measurable only in solar physics." },

  395: { id:395, name:"Glacierend", emoji:"❄️", types:["Ice","Draconic"],
    base:{hp:97,atk:124,def:110,spa:115,spd:103,spe:99}, evolveTo:null, evolveLevel:null, ngPlusTier:4,
    learnset:[[1,"ice_beam"],[5,"dragon_dance"],[10,"dragon_claw"],[15,"ice_claw"],[20,"cryo_lance"],[25,"cryogenic_breath"],[30,"dragon_pulse"],[35,"frostbite_strike"],[40,"blizzard"],[45,"sheer_cold"],[50,"scale_storm"],[55,"ancient_breath"],[60,"cataclysm_breath"]],
    catchRate:4, expYield:370, rarity:"legendary",
    desc:"A glacier-dragon that has been growing since the last ice age. It moves slowly, but nothing stops it.",
    lore:"Glacierend is an ice-dragon 8 metres long with scales of glacial blue ice 50,000 years old. It moves at glacial speed outside battle but in combat is explosively fast. Every valley it has walked through remains permanently frozen." },

  396: { id:396, name:"Thunderpeak", emoji:"⚡", types:["Electric","Metal"],
    base:{hp:70,atk:98,def:92,spa:94,spd:79,spe:92}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"thunder_shock"],[10,"metal_claw"],[20,"thunderbolt"],[30,"iron_tail"],[40,"thunder"],[50,"flash_cannon"],[60,"volt_surge"],[5,"harden"],[55,"alloy_edge"]],
    catchRate:4, expYield:370, rarity:"rare",
    desc:"A living lightning rod of steel. Every bolt from every storm in Lumoria eventually passes through it.",
    lore:"Thunderpeak is an electric-steel creature 3 metres tall resembling a stylised lightning bolt in living metal. It has a near-perfect conductor rating and can absorb, store, and release planet-scale electrical charge." },

  // LORE-AUDIT FLAG (Step 4): PR #49 forced retype (Spectral/Fighting now pre-408 OK — reconsider)
  397: { id:397, name:"Abyssalord", emoji:"🌊", types:["Aquatic","Spectral"],
    base:{hp:79,atk:92,def:81,spa:101,spd:87,spe:85}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"surf"],[10,"shadow_ball"],[20,"tidal_crush"],[30,"phantom_claw"],[40,"hydro_pump"],[50,"void_rend"],[60,"neural_storm"],[5,"shadowstep"],[55,"sea_serpent_strike"]],
    catchRate:4, expYield:372, rarity:"rare",
    desc:"The lord of all drowned things. Sailors who die at sea answer to it now.",
    lore:"Abyssalord is a water-spectral creature 9 metres long resembling a massive spectral leviathan trailing ghostly sea-wrack. It is invisible underwater — its presence is detected only by a sudden drop in water temperature and the silencing of all sea life." },

  398: { id:398, name:"Voidcrown", emoji:"🌌", types:["Dark","Fairy"],
    base:{hp:87,atk:103,def:96,spa:137,spd:112,spe:117}, evolveTo:null, evolveLevel:null, ngPlusTier:4,
    learnset:[[1,"fae_requiem"],[10,"void_rend"],[20,"mind_shatter"],[30,"shadow_ball"],[40,"neural_storm"],[50,"phantom_claw"],[60,"void_dominion"],[5,"dreamweave"],[55,"void_dominion"]],
    catchRate:4, expYield:372, rarity:"legendary",
    desc:"The sovereign of corrupted fae — a ruler that bridges the beautiful and the terrible without apology.",
    lore:"Voidcrown is a dark-fairy entity 2.5 metres tall wearing a permanent crown of void-matter and fairy-light. Half of its face is radiant and warm; the other half is an absolute darkness that swallows sight." },

  // LORE-AUDIT FLAG (Step 4): PR #49 forced retype (Spectral/Fighting now pre-408 OK — reconsider)
  399: { id:399, name:"Stonekeeper", emoji:"⛰️", types:["Earth","Spectral"],
    base:{hp:83,atk:89,def:103,spa:89,spd:89,spe:72}, evolveTo:null, evolveLevel:null,
    learnset:[[1,"rock_slide"],[10,"shadow_ball"],[20,"fossil_rush"],[30,"phantom_claw"],[40,"rock_slide"],[50,"void_rend"],[60,"neural_storm"],[5,"harden"],[55,"prism_ward"]],
    catchRate:4, expYield:370, rarity:"rare",
    desc:"The ghost of a mountain that refused to erode. It guards the summit as it always has.",
    lore:"Stonekeeper is an earth-spectral entity 4 metres tall resembling a craggy mountain peak with a translucent interior. It is the spirit of a specific peak that was destroyed in an ancient cataclysm. It still performs the same patrol it did 10,000 years ago." },

  400: { id:400, name:"Primordiax", emoji:"🔥", types:["Fire","Primal"],
    base:{hp:102,atk:136,def:110,spa:110,spd:101,spe:101}, evolveTo:null, evolveLevel:null, ngPlusTier:4,
    learnset:[[1,"flamethrower"],[10,"earth_power"],[15,"primal_focus"],[20,"magma_surge"],[25,"ancient_pulse"],[30,"fissure_slam"],[35,"ancient_calm"],[40,"solar_flare"],[45,"raw_fury"],[50,"terra_spike"],[60,"mantle_surge"],[5,"char_dance"],[55,"mantle_surge"]],
    catchRate:4, expYield:375, rarity:"legendary",
    desc:"A creature born when the planet's crust cracked and the mantle met the surface. It predates all others.",
    lore:"Primordiax is a fire-primal creature 5 metres tall resembling a primordial titan of cooling lava and deep rock. Geologists have identified its footprints in geological formations 500 million years old." },

  401: { id:401, name:"Cosmoveil", emoji:"🌠", types:["Stellar","Mental"],
    base:{hp:89,atk:94,def:94,spa:146,spd:121,spe:121}, evolveTo:null, evolveLevel:null, ngPlusTier:4,
    learnset:[[1,"fairy_wind"],[10,"psychic_move"],[15,"star_ray"],[20,"fae_requiem"],[25,"cosmic_beam"],[30,"psystrike"],[40,"mind_shatter"],[45,"starfall_s"],[50,"neural_storm"],[60,"cosmic_veil"],[5,"prism_ward"],[55,"cosmic_veil"],[55,"astral_focus"]],
    catchRate:3, expYield:380, rarity:"legendary",
    desc:"A being from beyond the known world. It arrived as a point of light that grew into something impossible.",
    lore:"Cosmoveil is a mental-stellar entity 2 metres tall composed of condensed starlight and cosmic stellar magic. It arrived from outside the known Lumoria region and has not yet been placed in any evolutionary lineage. Its biology resembles nothing previously recorded." },

  // ---- Pseudo-legendary Family 1: Draconic/Mental (Dracoveil line) BST 310→470→600 ----
  402: { id:402, name:"Scalit", emoji:"🐣", types:["Draconic","Mental"],
    evolveTo:403, evolveLevel:32, ngPlusTier:1,
    base:{hp:50,atk:65,def:45,spa:60,spd:50,spe:40}, // BST 310
    learnset:[[1,"dragon_breath"],[1,"psychic_move"],[12,"dragon_claw"],[20,"psystrike"],[28,"dragon_dance"],[32,"wyrm_strike"]],
    catchRate:45, expYield:65, rarity:"uncommon",
    desc:"A tiny dragon hatchling with a faintly glowing psychic crest. Found only in NG+ rifts.",
    lore:"Scalit is a dragon-psychic hatchling 0.4 metres long with iridescent scales that pulse faintly with psychic energy. Each psychic move a Scalit uses brightens its crest, and the accumulating luminance never fully fades between uses. Over a lifetime that residual glow becomes the constant psychokinetic field Dracomind layers across its scales, then crystallises further into the prismatic wings Veildrak wears at maturity." },

  403: { id:403, name:"Dracomind", emoji:"🐲", types:["Draconic","Mental"],
    evolveTo:404, evolveLevel:52, ngPlusTier:1,
    base:{hp:72,atk:92,def:70,spa:95,spd:78,spe:63}, // BST 470
    learnset:[[1,"dragon_breath"],[1,"psychic_move"],[15,"dragon_claw"],[25,"psystrike"],[35,"dragon_dance"],[45,"wyrm_strike"],[55,"mind_shatter"]],
    catchRate:15, expYield:155, rarity:"rare",
    desc:"A fierce mid-stage dragon whose psychic power has grown enough to bend reality around it.",
    lore:"Dracomind is a dragon-psychic creature 1.8 metres long — Scalit's iridescent hatchling scales have hardened to a permanent gleam, and the faint psychic-energy pulse of its juvenile form now layers as a psychokinetic field across its surface. Its roar leaves visible ripples in the air from the psychic shock wave it produces." },

  404: { id:404, name:"Veildrak", emoji:"🐉", types:["Draconic","Mental"],
    evolveTo:null, evolveLevel:null, ngPlusTier:1,
    base:{hp:92,atk:110,def:88,spa:130,spd:100,spe:80}, // BST 600
    learnset:[[1,"dragon_pulse"],[1,"psystrike"],[20,"wyrm_strike"],[30,"mind_shatter"],[40,"scale_storm"],[50,"neural_storm"],[60,"cataclysm_breath"],[5,"dragon_dance"],[60,"time_fracture"]],
    catchRate:5, expYield:300, rarity:"pseudolegendary",
    desc:"The apex of dragon-psychic evolution. It perceives battle outcomes before they happen and acts accordingly.",
    lore:"Veildrak is a dragon-psychic 5 metres long — Dracomind's psychokinetic field has crystallised outward into wings that refract light into prismatic patterns and a crest of solidified psychic energy, the shock-wave roar of its juvenile form refined into the precision of an entity that perceives battle outcomes before they happen. It is considered the pinnacle of the NG+ Lumori hierarchy." },

  // ---- Pseudo-legendary Family 2: Dark/Metal (Voidsteel line) BST 300→465→600 ----
  405: { id:405, name:"Mirkling", emoji:"🐾", types:["Dark","Metal"],
    evolveTo:406, evolveLevel:30, ngPlusTier:1,
    base:{hp:45,atk:62,def:55,spa:48,spd:50,spe:40}, // BST 300
    learnset:[[1,"shadowstep"],[1,"metal_claw"],[10,"void_rend"],[18,"iron_tail"],[26,"phantom_claw"],[30,"alloy_edge"]],
    catchRate:45, expYield:62, rarity:"uncommon",
    desc:"A shadow-pup of dark-steel born in the void rifts. Its tiny steel claws cut harder than they should.",
    lore:"Mirkling is a dark-steel creature 0.5 metres long resembling a shadowy puppy with small but razor-sharp steel claws. A Mirkling instinctively forms alliances with other dark-types but rarely with its own kind: pre-conditioning for the solitary boundary-warden life Voidwarden eventually leads. Mirkling consistently patrol the edges of rift-zones rather than entering them, drawn already to the guardian role they will inhabit at their third evolution. Their claws are not steel from birth either; they slowly metallise across the first year of life as the shadow-and-steel fusion of the lineage chemically composes itself in the pup." },

  406: { id:406, name:"Umbrasteel", emoji:"🐺", types:["Dark","Metal"],
    evolveTo:407, evolveLevel:50, ngPlusTier:1,
    base:{hp:68,atk:98,def:88,spa:72,spd:78,spe:61}, // BST 465
    learnset:[[1,"shadowstep"],[1,"metal_claw"],[12,"void_rend"],[22,"iron_tail"],[32,"phantom_claw"],[42,"alloy_edge"],[52,"flash_cannon"]],
    catchRate:15, expYield:152, rarity:"rare",
    desc:"A wolf of forged shadows and living steel. It hunts in packs but leads every pack it joins.",
    lore:"Umbrasteel is a dark-steel creature 1.5 metres at the shoulder — Mirkling's puppy-shadow has woven itself into a body of fine shadow filaments reinforced with micro-crystal steel alloy, and the small razor-sharp pup-claws have matured into the apex hunter's silent invisibility within shadow." },

  407: { id:407, name:"Voidwarden", emoji:"⚔️", types:["Dark","Metal"],
    evolveTo:null, evolveLevel:null, ngPlusTier:1,
    base:{hp:88,atk:130,def:115,spa:85,spd:95,spe:87}, // BST 600
    learnset:[[1,"void_rend"],[1,"iron_tail"],[20,"phantom_claw"],[30,"flash_cannon"],[40,"umbral_claw"],[50,"alloy_edge"],[60,"scale_storm"],[5,"dragon_dance"],[60,"void_dominion"]],
    catchRate:5, expYield:300, rarity:"pseudolegendary",
    desc:"The supreme guardian of the void boundary. It wields darkness and steel as extensions of its own will.",
    lore:"Voidwarden is a dark-steel creature 3 metres tall with a body of condensed void-matter reinforced with an exoskeleton of ultra-dense steel. Its transformation begins when an Umbrasteel proves itself worthy of guarding the boundary between worlds — at that moment, the canine body it carried as juvenile and adolescent re-forges itself upright: the four legs reconstitute as two heavy hindlimbs and two long arms tipped in steel claws, and the shadow-filaments of its body re-weave into a humanoid silhouette better suited to wielding darkness and steel as tools. Ancient legends name Voidwarden the Warden of the Boundary Between Worlds, and it is rarely seen — its post is a fixed point in the lattice that separates one reality from another, and it leaves only at the call of catastrophic incursion." },

  // ============================================================
  // NG+ EXCLUSIVE FAMILIES — IDs 408–461
  // 22 evolution-only families with pristine type combos. NG+ only
  // (id >= NG_PLUS_DEX_START). Scattered into ngPlusWildMonsters overlays.
  // ============================================================

  // --- F1: gem-shelled tortoise (Crystal / Crystal-Fairy) — LEGENDARY line ---
  408: { id:408, name:"Glimmerling", emoji:"💎", types:["Crystal"],
    evolveTo:409, evolveLevel:18, catchRate:30, expYield:70, rarity:"legendary",
    base:{hp:55,atk:45,def:80,spa:65,spd:75,spe:40}, // BST 360
    learnset:[[1,"tackle"],[1,"harden"],[5,"crystal_jab"],[9,"shard_strike"],[12,"crystal_focus"],[14,"fairy_wind"],[17,"gem_focus"],[19,"crystal_pulse"],[22,"crystalline_speed"],[25,"crystal_charge"],[31,"prism_ray"]],
    desc:"A hatchling tortoise no bigger than a thumb, its domed shell a cluster of cloudy raw quartz.",
    lore:"Glimmerling is born when a vein of dormant gem-crystal absorbs enough ambient ley-light to quicken into life. The cloudy quartz of its shell clears a little more each season as it basks, and hatchlings instinctively gather in sunlit hollows where the refracted glow keeps predators wary. Folk who find a Glimmerling sunning itself speak of a faint chiming hum that rises from the shell at dawn." },

  409: { id:409, name:"Facetite", emoji:"💎", types:["Crystal","Fairy"],
    evolveTo:410, evolveLevel:42, catchRate:15, expYield:150, rarity:"legendary",
    base:{hp:80,atk:65,def:115,spa:95,spd:100,spe:50}, // BST 505
    learnset:[[1,"tackle"],[1,"harden"],[5,"crystal_jab"],[14,"fairy_wind"],[19,"crystal_pulse"],[22,"radiant_reflection"],[27,"prism_ray"],[33,"dazzling_gleam"],[36,"prismatic_calm"],[39,"crystalline_beam"],[43,"gemstone_strike"],[45,"crystal_lattice"]],
    desc:"Its shell has cleared into faceted gemstone planes that split sunlight into drifting fairy-glimmer.",
    lore:"As a Glimmerling matures into Facetite, the quartz of its shell anneals into true gemstone, each plate cut into geometric facets that scatter light in shifting rainbows. The drifting motes of glimmer it sheds are warm to the touch and pacify nearby Lumori, and Facetite is often found guarding spring-fed grottoes where the light dances brightest." },

  410: { id:410, name:"Prismarch", emoji:"💎", types:["Crystal","Fairy"],
    evolveTo:null, evolveLevel:null, catchRate:5, expYield:320, rarity:"legendary",
    base:{hp:110,atk:85,def:145,spa:125,spd:130,spe:30}, // BST 625
    learnset:[[1,"crystal_pulse"],[1,"dazzling_gleam"],[1,"recover"],[30,"crystal_veil"],[32,"ice_resonance"],[33,"crystalline_beam"],[38,"rainbow_burst"],[40,"crystal_press"],[42,"prism_armor"],[45,"prism_blow"],[48,"gemstone_blast"],[50,"crystal_storm"],[54,"moonblast"],[55,"prismatic_eruption"],[60,"starlight_prism"],[66,"prism_apocalypse"]],
    desc:"An ancient gem-tortoise whose vast domed shell has grown into a living cathedral of prisms.",
    lore:"Prismarch is reckoned a legendary among gem-Lumori — a colossal tortoise that has carried its crystal shell for centuries until the facets fused into a single radiant dome that bends daylight into standing rainbows for leagues around. It moves perhaps once a generation, and where it finally settles, gardens of luminous crystal bloom from the soil. Pilgrims claim the light beneath its shell can mend a fractured spirit." },

  // --- F2: booming ratite / cassowary (Sonic / Draconic-Sonic) ---
  411: { id:411, name:"Thrumquill", emoji:"🐤", types:["Sonic"],
    evolveTo:412, evolveLevel:16, catchRate:150, expYield:64, rarity:"common",
    base:{hp:50,atk:62,def:45,spa:50,spd:48,spe:50}, // BST 305
    learnset:[[1,"tackle"],[1,"chirp"],[5,"echo_strike"],[9,"quick_attack"],[14,"sound_rush"],[19,"draco_jab"],[25,"rumble_smash"]],
    desc:"A flightless chick whose stiff quill-feathers buzz with a low, constant thrum.",
    lore:"Thrumquill cannot fly, but the hollow quills along its back vibrate when it runs, throwing a buzzing wake of sound that startles insects into the open. Chicks travel in noisy crashes through the undergrowth, and the collective thrum of a brood can be felt in the chest before they are ever seen." },

  412: { id:412, name:"Echostride", emoji:"🦤", types:["Draconic","Sonic"],
    evolveTo:413, evolveLevel:36, catchRate:70, expYield:145, rarity:"uncommon",
    base:{hp:70,atk:92,def:62,spa:66,spd:60,spe:60}, // BST 410
    learnset:[[1,"tackle"],[5,"echo_strike"],[14,"sound_rush"],[19,"dragon_breath"],[24,"rumble_smash"],[30,"skyboom_strike"],[36,"dragon_claw"],[42,"resonance_quake"]],
    desc:"A long-legged runner that kicks with reptilian talons and booms to stun its rivals.",
    lore:"Echostride has shed the last of its down for a scaled, draconic hide, and its legs have lengthened into powerful runners tipped with dagger-claws. It defends territory by lowering its head and loosing a chest-deep boom that rattles the ground; rivals that do not flee are met with a slashing kick. Its call carries far enough that whole valleys learn to give its nesting-grounds a wide berth." },

  413: { id:413, name:"Resonadon", emoji:"🦤", types:["Draconic","Sonic"],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:255, rarity:"rare",
    base:{hp:85,atk:120,def:78,spa:82,spd:75,spe:90}, // BST 530
    learnset:[[1,"sound_rush"],[1,"dragon_breath"],[24,"rumble_smash"],[36,"dragon_claw"],[42,"skyboom_strike"],[48,"bass_blast"],[54,"outrage"],[60,"resonance_quake"],[66,"threnody"]],
    desc:"A towering ratite crowned with a hollow draconic casque that channels world-shaking infrasound.",
    lore:"Resonadon stands taller than a mounted rider, its head capped by a hollow keratin casque that amplifies the infrasonic booms of its ancestors into pressure waves felt rather than heard. A charging Resonadon precedes itself with a wall of silent sound that buckles knees and scatters herds, and only then does it close with talon and crest. Old herders read the trembling of still water as warning that one is near." },

  // --- F3: burrowing sandworm / annelid (Toxin / Earth-Toxin) ---
  414: { id:414, name:"Grublurk", emoji:"🪱", types:["Toxin"],
    evolveTo:415, evolveLevel:16, catchRate:160, expYield:62, rarity:"common",
    base:{hp:60,atk:55,def:58,spa:42,spd:45,spe:40}, // BST 300
    learnset:[[1,"tackle"],[1,"tox_sting"],[5,"mud_shot"],[8,"tox_calm"],[10,"tox_jab"],[15,"harden"],[18,"tox_lash"],[20,"sandstrike"],[26,"tox_acid_strike"]],
    desc:"A pale, finger-thick grub that sweats an acrid slime as it inches through loose soil.",
    lore:"Grublurk spends its larval life just beneath the surface, ploughing slow furrows and digesting the toxins other creatures leave behind. The acrid film coating its skin deters most predators, and gardeners both curse the burrows it leaves and prize the rich, detoxified earth it leaves in its wake." },

  415: { id:415, name:"Tunnelmaw", emoji:"🪱", types:["Earth","Toxin"],
    evolveTo:416, evolveLevel:36, catchRate:75, expYield:142, rarity:"uncommon",
    base:{hp:80,atk:78,def:80,spa:52,spd:60,spe:45}, // BST 395
    learnset:[[1,"tackle"],[5,"mud_shot"],[15,"tox_jab"],[18,"tox_lash"],[20,"sandstrike"],[22,"ore_armor"],[26,"tox_acid_strike"],[30,"tox_burst_phy"],[32,"bulldoze"],[38,"tox_venom_thrust"],[44,"earthquake"]],
    desc:"A segmented burrower ringed with grinding mineral teeth at the front of its tunnel-boring maw.",
    lore:"Tunnelmaw bores through hardpan and stone alike, its leading segment fused into a rotating ring of mineral teeth that grind rock to swallowable grit. It floods its tunnels with caustic mucus to soften the way and to drown anything that follows it down. Mining camps learn to recognise the faint hiss of acid that precedes a Tunnelmaw breaking through a wall." },

  416: { id:416, name:"Sandscourge", emoji:"🪱", types:["Earth","Toxin"],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:250, rarity:"rare",
    base:{hp:105,atk:110,def:100,spa:60,spd:80,spe:60}, // BST 515
    learnset:[[1,"sandstrike"],[1,"tox_acid_strike"],[15,"tox_lash"],[26,"tox_venom_thrust"],[30,"tox_burst_phy"],[38,"earthquake"],[40,"tox_acid_armor"],[44,"tox_smash"],[50,"sand_tomb"],[52,"tox_calm"],[56,"tox_storm_phy"],[62,"tectonic_slam"],[68,"tox_finish"]],
    desc:"A colossal dune-worm that erupts from beneath the sand to drag down anything crossing its territory.",
    lore:"Sandscourge is the apex of its line, a leviathan of the deep desert long enough to encircle a caravan. It senses footfalls through kilometres of sand and surfaces in a spray of grit and venom, collapsing dunes to mire its prey before it strikes. Nomads mark its hunting-grounds on their maps in red and cross them only by night, when the cold drives it deep." },

  // --- F4: haunted ice-marionette (Spectral / Ice-Spectral) ---
  417: { id:417, name:"Glacigeist", emoji:"👻", types:["Spectral"],
    evolveTo:418, evolveLevel:18, catchRate:150, expYield:65, rarity:"common",
    base:{hp:48,atk:40,def:52,spa:72,spd:58,spe:25}, // BST 295
    learnset:[[1,"ghost_jab"],[1,"powder_snow"],[6,"ghost_pulse"],[11,"frost_breath"],[16,"specter_pulse"],[22,"aurora_beam"],[28,"phantom_beam"]],
    desc:"A small, lonely haunt that has crept inside a cracked porcelain joint to give itself a body.",
    lore:"Glacigeist is a houseless spirit drawn to abandoned, cold places, where it slips into a discarded fragment of carved wood or porcelain to anchor itself to the world. The object frosts over wherever the spirit touches it, and a faint chill marks the rooms it has chosen to haunt. Left undisturbed, it begins to gather more pieces to itself." },

  418: { id:418, name:"Frostmarion", emoji:"❄️", types:["Ice","Spectral"],
    evolveTo:419, evolveLevel:38, catchRate:70, expYield:148, rarity:"uncommon",
    base:{hp:62,atk:52,def:70,spa:95,spd:76,spe:30}, // BST 385
    learnset:[[1,"ghost_jab"],[6,"ghost_pulse"],[16,"specter_pulse"],[22,"aurora_beam"],[28,"phantom_beam"],[34,"ice_beam"],[40,"soul_lance"],[46,"glacial_shard"]],
    desc:"A puppet of frost-lacquered wood, worked by an unseen ghost through threads of icy thread.",
    lore:"Having gathered enough cast-off pieces, the spirit assembles Frostmarion: a jointed marionette of pale wood glazed in frost, dangling from strings of frozen filament that it manipulates itself. It moves with the eerie, hitching grace of a puppet whose puppeteer is hidden, and the air around its strings rings faintly cold. Those who cut the threads find them re-formed by morning." },

  419: { id:419, name:"Pallidoll", emoji:"🎎", types:["Ice","Spectral"],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:250, rarity:"rare",
    base:{hp:80,atk:60,def:88,spa:125,spd:97,spe:55}, // BST 505
    learnset:[[1,"specter_pulse"],[1,"aurora_beam"],[28,"phantom_beam"],[40,"soul_lance"],[46,"ice_beam"],[52,"phantom_force"],[58,"blizzard"],[64,"soul_burst"],[70,"winter_shade"]],
    desc:"A life-size haunted doll wreathed in freezing mist, its painted eyes following anyone who lingers.",
    lore:"Pallidoll is the spirit fully realised — a doll the size of a child, porcelain-faced and immaculate, drifting through silent winter halls on a low bank of freezing fog. It is gentle to those who treat it kindly and merciless to those who would break it, sealing intruders in sudden rime. Estates that house a Pallidoll are always cold, and always, somehow, perfectly clean." },

  // --- F5: hot-spring capybara (Vapor / Fire-Vapor) ---
  420: { id:420, name:"Mistling", emoji:"♨️", types:["Vapor"],
    evolveTo:421, evolveLevel:18, catchRate:150, expYield:66, rarity:"common",
    base:{hp:62,atk:48,def:52,spa:60,spd:58,spe:30}, // BST 310
    learnset:[[1,"tackle"],[1,"mist_s"],[5,"vapor_jab"],[8,"drizzle"],[10,"ember"],[12,"mist_meditation"],[15,"fog_beam"],[18,"vapor_focus"],[20,"steam_burst"],[26,"mist_pulse"]],
    desc:"A round, downy pup that breathes out little curls of warm fog when it dozes.",
    lore:"Mistling are gregarious and famously placid, huddling together at the edges of warm springs and exhaling soft fog that pools around them like a blanket. The warm haze keeps their fur from freezing in cold country and soothes wounds, so injured Lumori often shelter among a Mistling colony until they mend." },

  421: { id:421, name:"Geyserook", emoji:"♨️", types:["Fire","Vapor"],
    evolveTo:422, evolveLevel:38, catchRate:70, expYield:150, rarity:"uncommon",
    base:{hp:85,atk:62,def:70,spa:82,spd:76,spe:35}, // BST 410
    learnset:[[1,"tackle"],[5,"vapor_jab"],[10,"ember"],[12,"mist_veil"],[16,"steam_punch"],[20,"steam_burst"],[22,"evaporate"],[24,"boiling_rage"],[26,"flame_charge"],[30,"cloud_blast"],[32,"boil_v"],[38,"flamethrower"],[40,"burning_mist"],[44,"vapor_eruption"]],
    desc:"A barrel-bodied beast that nests against thermal vents and vents scalding spray when alarmed.",
    lore:"Geyserook makes its home where geothermal heat meets water, lounging in mineral pools heated from below. The fat it stores insulates a furnace-warm core, and when threatened it arches its back and jets superheated spray from glands along its spine. Bath-keepers in volcanic country consider a resident Geyserook a sign that the springs run hot and clean." },

  422: { id:422, name:"Tempesteam", emoji:"♨️", types:["Fire","Vapor"],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:258, rarity:"rare",
    base:{hp:115,atk:80,def:88,spa:108,spd:96,spe:48}, // BST 535
    learnset:[[1,"steam_burst"],[1,"flamethrower"],[1,"recover"],[16,"boiling_rage"],[20,"condense_form"],[26,"boil_v"],[28,"burning_mist"],[32,"boiling_strike"],[36,"molten_tide"],[38,"vapor_eruption"],[40,"steam_slam"],[44,"heat_wave"],[46,"vapor_drill"],[50,"steam_storm"],[56,"lava_plume"],[62,"miasma_apocalypse"]],
    desc:"A massive, placid behemoth that wears a permanent cloak of scalding steam from its furnace-hot hide.",
    lore:"Tempesteam is the elder of the line, a ponderous mountain of warm flesh whose hide runs hot enough to flash spring-water into a rolling shroud of steam that hides it from sight. It is slow to anger and slower to move, but a roused Tempesteam can fill a whole valley with blinding, scalding fog. Travellers lost in such a cloud are wise to walk toward the heat, not away, for it has been known to shelter the freezing within its steam." },

  // --- F6: armored pangolin (Mineral / Metal-Mineral) ---
  423: { id:423, name:"Pebblite", emoji:"🪨", types:["Mineral"],
    evolveTo:424, evolveLevel:16, catchRate:160, expYield:60, rarity:"common",
    base:{hp:52,atk:55,def:78,spa:38,spd:47,spe:30}, // BST 300
    learnset:[[1,"tackle"],[1,"harden"],[5,"mineral_jab"],[8,"mineral_crystal_shard"],[10,"shard_volley"],[12,"shard_form"],[14,"mineral_focus"],[16,"ore_punch"],[18,"stealth_rock"],[20,"mineral_resonance"],[22,"mineral_strike"],[24,"gem_scatter"],[25,"shard_burst_m"],[26,"mineral_blast"],[28,"mineral_smash"],[30,"power_gem"]],
    desc:"A pebble-scaled pup that tucks into a tight ball at the first sign of trouble.",
    lore:"Pebblite is plated head to tail in overlapping scales of raw mineral that it grows by ingesting grit and ore. At rest it forages for hard nodules to wear down its ever-growing scales; at the first alarm it rolls into an armoured sphere that even larger predators give up on. Its scales, shed as it grows, are collected by jewelers for their natural polish." },

  424: { id:424, name:"Geodon", emoji:"🦔", types:["Metal","Mineral"],
    evolveTo:425, evolveLevel:38, catchRate:75, expYield:145, rarity:"uncommon",
    base:{hp:70,atk:80,def:105,spa:48,spd:62,spe:35}, // BST 400
    learnset:[[1,"tackle"],[5,"mineral_jab"],[8,"ore_armor"],[12,"quarry_speed"],[16,"ore_punch"],[20,"shard_burst_m"],[22,"metal_claw"],[28,"mineral_smash"],[34,"iron_defense"],[36,"mineral_blast"],[40,"ore_smash"],[46,"heavy_slam"]],
    desc:"Its mineral scales have hardened with veins of native metal into a near-impervious armour.",
    lore:"As it matures, Geodon begins smelting trace metals from the ore it eats, threading its mineral scales with veins of iron and copper until they ring like struck plate. It uses its bladed foreclaws to tear open termite mounds and ore seams alike, and a curled Geodon has turned the teeth of more than one predator. The metallic sheen of its armour deepens with age." },

  425: { id:425, name:"Strataclaw", emoji:"⛏️", types:["Metal","Mineral"],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:252, rarity:"rare",
    base:{hp:90,atk:115,def:140,spa:55,spd:75,spe:45}, // BST 520
    learnset:[[1,"ore_punch"],[1,"metal_claw"],[1,"iron_defense"],[20,"quarry_speed"],[28,"mineral_smash"],[35,"mineral_press"],[40,"ore_smash"],[45,"mineral_blast"],[46,"iron_tail"],[52,"obsidian_strike"],[58,"anvil_drop"],[64,"tungsten_ram"]],
    desc:"A great pangolin whose scales are layered like strata of tempered metal and stone over a digging titan.",
    lore:"Strataclaw is a digging titan whose every scale is a laminate of stone and tempered metal laid down in visible strata, each band a record of the ground it has eaten through. Its forelimbs end in pick-like claws that quarry through bedrock as easily as soil, and it carves the deep dens that whole communities of smaller Lumori later inhabit. Miners who find its abandoned tunnels follow them gratefully toward the richest seams." },

  // --- F7: martial mantis (Fighting / Fighting-Mental) ---
  426: { id:426, name:"Pummelo", emoji:"🦗", types:["Fighting"],
    evolveTo:427, evolveLevel:16, catchRate:150, expYield:64, rarity:"common",
    base:{hp:48,atk:68,def:50,spa:52,spd:47,spe:40}, // BST 305
    learnset:[[1,"quick_punch"],[1,"battle_cry"],[5,"straight_jab"],[9,"low_sweep_f"],[14,"body_check"],[19,"confusion"],[25,"roundhouse"]],
    desc:"A palm-sized mantis nymph that drills its strikes against stones for hours on end.",
    lore:"Pummelo hatches already pugnacious, sparring with its broodmates and battering pebbles with its raptorial forelimbs to harden them. The faint hum it gives off while training is the first stirring of the focused mind its line is known for, and trainers prize the discipline a young Pummelo shows even at this size." },

  427: { id:427, name:"Brawlith", emoji:"🦗", types:["Fighting","Mental"],
    evolveTo:428, evolveLevel:36, catchRate:70, expYield:145, rarity:"uncommon",
    base:{hp:62,atk:95,def:66,spa:70,spd:62,spe:55}, // BST 410
    learnset:[[1,"quick_punch"],[5,"straight_jab"],[14,"body_check"],[19,"confusion"],[25,"roundhouse"],[31,"psybeam"],[37,"iron_fist"],[43,"zen_headbutt"]],
    desc:"A mantis warrior whose meditation has woken a focused psychic edge to its strikes.",
    lore:"Brawlith fights with an eerie calm, reading an opponent's intent a breath before they move and answering with bladed forelimbs guided by foresight. Between bouts it holds long, motionless vigils that sharpen its mind as surely as its sparring sharpens its claws, and rival Brawlith settle disputes in silent, lightning-fast duels." },

  428: { id:428, name:"Zenkaiser", emoji:"🦗", types:["Fighting","Mental"],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:255, rarity:"rare",
    base:{hp:78,atk:125,def:78,spa:88,spd:81,spe:80}, // BST 530
    learnset:[[1,"roundhouse"],[1,"confusion"],[25,"zen_headbutt"],[37,"iron_fist"],[43,"psycho_cut"],[49,"close_combat"],[55,"psychic_move"],[61,"focus_punch_f"],[67,"expanding_force"]],
    desc:"A master mantis that strikes faster than thought, its mind and blades moving as one.",
    lore:"Zenkaiser is the culmination of its line's discipline — a duelist whose perception runs so far ahead of its blows that it seems to parry attacks before they are thrown. It seeks out the strongest fighters not from aggression but from a need to test the edge of its own focus, and bows to a worthy foe whether it wins or loses. Monasteries in the high passes are said to keep one as an instructor." },

  // --- F8: dream-eating baku / tapir (Dream / Dark-Dream) ---
  429: { id:429, name:"Lullasnout", emoji:"🌙", types:["Dream"],
    evolveTo:430, evolveLevel:18, catchRate:150, expYield:63, rarity:"common",
    base:{hp:62,atk:45,def:52,spa:58,spd:53,spe:30}, // BST 300
    learnset:[[1,"tackle"],[1,"lullaby_song"],[5,"dream_jab"],[10,"dream_pulse"],[15,"somnia_ray"],[20,"bite"],[26,"dream_beam"]],
    desc:"A drowsy, snouted cub that snuffles through the air for the scent of dreams.",
    lore:"Lullasnout drifts half-asleep even while awake, its long flexible snout twitching toward the dreams of nearby sleepers. It nibbles only at idle daydreams and bad moods, leaving those it visits a little lighter of heart, and parents in some regions welcome a Lullasnout into the nursery to keep nightmares at bay." },

  430: { id:430, name:"Drowsetapir", emoji:"🌙", types:["Dark","Dream"],
    evolveTo:431, evolveLevel:38, catchRate:70, expYield:145, rarity:"uncommon",
    base:{hp:82,atk:60,def:70,spa:78,spd:70,spe:35}, // BST 395
    learnset:[[1,"tackle"],[5,"dream_jab"],[15,"somnia_ray"],[20,"bite"],[26,"dream_beam"],[32,"dark_pulse"],[38,"nightmare_burst"],[44,"nightmare_storm"]],
    desc:"A heavy-shouldered dream-eater that now draws nourishment from nightmares as well.",
    lore:"As it matures, Drowsetapir develops a taste for the darker dreams its gentler youth avoided, wading into nightmares to devour the fear within. The sleepers it feeds upon wake unsettled but unharmed, their terrors gone, and a Drowsetapir grown bold will follow a troubled mind for nights on end until the nightmare is consumed." },

  431: { id:431, name:"Nocturnbaku", emoji:"🌙", types:["Dark","Dream"],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:250, rarity:"rare",
    base:{hp:110,atk:75,def:88,spa:105,spd:92,spe:40}, // BST 510
    learnset:[[1,"dream_beam"],[1,"dark_pulse"],[26,"somnia_blast"],[38,"nightmare_storm"],[44,"shadow_ball"],[50,"dream_devourer"],[56,"nightmare_calamity"],[62,"soul_rend"],[66,"dream_apocalypse_spec"]],
    desc:"A great baku wreathed in stolen dreams, able to walk into sleep and reshape it at will.",
    lore:"Nocturnbaku is the dream-eater grown vast and deliberate, a creature that steps fully into a sleeper's mind and walks their dreamscape as easily as a meadow. It can soothe a haunted soul into untroubled rest or, provoked, trap a foe in an endless looping nightmare. Folk leave offerings at the edge of forests where one is known to den, asking for a single dreamless night." },

  // --- F9: mossy mammoth (Primal / Nature-Primal) — LEGENDARY line ---
  432: { id:432, name:"Tusklet", emoji:"🦣", types:["Primal"],
    evolveTo:433, evolveLevel:20, catchRate:30, expYield:72, rarity:"legendary",
    base:{hp:75,atk:70,def:68,spa:45,spd:57,spe:50}, // BST 365
    learnset:[[1,"tackle"],[1,"primal_roar"],[5,"primal_jab"],[8,"primal_focus"],[10,"feral_claw"],[14,"beast_speed"],[16,"savage_bite"],[20,"wild_rage"],[22,"wild_strike"],[28,"beast_charge"]],
    desc:"A shaggy calf with stubby tusks, already strong enough to topple a grown traveller.",
    lore:"Tusklet are born of a bloodline so ancient it predates the region's other Lumori, and even as calves they carry the deep, unhurried strength of their kind. A herd guards its young in a wall of bodies, and a lost Tusklet will trumpet a call that grown Primammoth answer from valleys away. The moss already creeping along its back marks the living mountain it will become." },

  433: { id:433, name:"Verdantusk", emoji:"🦣", types:["Nature","Primal"],
    evolveTo:434, evolveLevel:44, catchRate:15, expYield:155, rarity:"legendary",
    base:{hp:105,atk:100,def:95,spa:60,spd:80,spe:70}, // BST 510
    learnset:[[1,"tackle"],[5,"primal_jab"],[10,"beast_speed"],[16,"savage_bite"],[20,"wild_rage"],[22,"vine_whip"],[28,"beast_charge"],[34,"seed_bomb"],[36,"wild_aura"],[40,"crushing_jaws"],[46,"primal_smash"]],
    desc:"A great tusker whose hide has become a hanging garden of moss, fern and clinging vine.",
    lore:"Verdantusk moves slowly enough that whole ecosystems take root upon it — moss carpets its flanks, ferns nod between its shoulders, and small Lumori shelter in the living thicket of its hide. Where it walks, it tramples seed into soil and fertilises the ground, and old forests trace their first saplings to the passage of one of these wandering groves." },

  434: { id:434, name:"Primammoth", emoji:"🦣", types:["Nature","Primal"],
    evolveTo:null, evolveLevel:null, catchRate:5, expYield:325, rarity:"legendary",
    base:{hp:140,atk:130,def:118,spa:70,spd:102,spe:70}, // BST 630
    learnset:[[1,"beast_charge"],[1,"seed_bomb"],[20,"wild_rage"],[28,"crushing_jaws"],[30,"feral_armor"],[36,"wild_aura"],[40,"primal_smash"],[45,"apex_predator"],[46,"energy_ball"],[50,"raw_fury"],[52,"ancient_strike"],[55,"ancient_calm"],[58,"jungle_hammer"],[64,"primal_eruption"],[70,"world_devour"]],
    desc:"A living mountain of the elder world, a moss-mantled mammoth that forests follow like a wake.",
    lore:"Primammoth is reckoned legendary — a titan that has carried the first forest on its back since before the gyms were built, so vast and slow that a grove matures and dies between its footfalls. It remembers the land as it was and steers great migrations of Lumori by instinct older than memory. To stand in its shadow is to feel the weight of every age it has walked through, and the deep green hush of the world before names." },

  // --- F10: stone-fist gorilla (Mineral / Fighting-Mineral) ---
  435: { id:435, name:"Knucklite", emoji:"🦍", types:["Mineral"],
    evolveTo:436, evolveLevel:16, catchRate:160, expYield:62, rarity:"common",
    base:{hp:55,atk:62,def:70,spa:40,spd:48,spe:45}, // BST 320
    learnset:[[1,"tackle"],[1,"harden"],[5,"mineral_jab"],[10,"ore_punch"],[15,"quick_punch"],[20,"mineral_strike"],[26,"body_check"]],
    desc:"A stocky ape-pup that hardens its knuckles by drumming them against cave walls.",
    lore:"Knucklite grows up in rocky highlands, where it toughens its fists by pounding stone until thick mineral calluses form across its knuckles. Troops communicate by drumming these stony fists against boulders, and the booming knuckle-rhythm of a Knucklite band rolls for miles through the canyons they call home." },

  436: { id:436, name:"Cragfist", emoji:"🦍", types:["Fighting","Mineral"],
    evolveTo:437, evolveLevel:38, catchRate:75, expYield:145, rarity:"uncommon",
    base:{hp:75,atk:95,def:88,spa:48,spd:62,spe:52}, // BST 420
    learnset:[[1,"tackle"],[5,"mineral_jab"],[15,"quick_punch"],[20,"ore_punch"],[26,"body_check"],[32,"mineral_smash"],[38,"iron_fist"],[44,"seismic_force"]],
    desc:"A powerful ape whose forearms are sheathed in plates of grown-in rock.",
    lore:"Cragfist has encased its forearms in slabs of accreted mineral that it cracks and regrows after every brawl, turning each punch into a falling boulder. Troops are led by the Cragfist whose stone gauntlets are thickest and most scarred, and a challenge for leadership is decided by a single thunderous exchange of blows that splits the very ground." },

  437: { id:437, name:"Goliathon", emoji:"🦍", types:["Fighting","Mineral"],
    evolveTo:null, evolveLevel:null, catchRate:40, expYield:252, rarity:"rare",
    base:{hp:95,atk:128,def:110,spa:55,spd:77,spe:60}, // BST 525
    learnset:[[1,"ore_punch"],[1,"iron_fist"],[16,"smack_down"],[20,"stone_axe"],[26,"mineral_smash"],[28,"quake_pulse"],[34,"tectonic_wave"],[38,"seismic_force"],[40,"underground_slam"],[44,"obsidian_strike"],[46,"mineral_press"],[48,"diamond_crash"],[50,"close_combat"],[56,"quarry_crush"],[60,"continental_shift"],[62,"quake_barrage"],[68,"mineral_eruption"]],
    desc:"A colossal silverback whose stone-clad fists can shatter a cliff face in a single blow.",
    lore:"Goliathon is the undisputed patriarch of the highland troops, a mountain of muscle armoured in living rock that it can shrug off avalanches. It rarely needs to fight — its mere knuckle-drum, felt as a tremor through the stone, is enough to send challengers away — but when it does, the landscape itself is rearranged. Old quarries in gorilla country are said to be the work of feuding Goliathon." },

  // --- F11: cicada bard-fae (Sonic / Fairy-Sonic) ---
  438: { id:438, name:"Chimelet", emoji:"🎐", types:["Sonic"],
    evolveTo:439, evolveLevel:24, catchRate:190, expYield:68, rarity:"common",
    base:{hp:52,atk:45,def:48,spa:70,spd:60,spe:45}, // BST 320
    learnset:[[1,"chirp"],[1,"echo_strike"],[5,"sonic_pulse"],[10,"sound_rush"],[15,"resonate"],[20,"pulse_wave"],[26,"wave_cry"]],
    desc:"A tiny winged cicada-sprite whose translucent wings ring like struck glass.",
    lore:"Chimelet spends its long nymphhood underground and emerges already singing, its glassy wings chiming in the breeze like a hung windchime. Swarms tune their songs to one another until a whole grove rings in harmony, and travellers say a chorus of Chimelet at dusk is among the gentlest sounds in all Lumoria." },

  439: { id:439, name:"Seraphene", emoji:"🎐", types:["Fairy","Sonic"],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:200, rarity:"uncommon",
    base:{hp:75,atk:60,def:68,spa:118,spd:92,spe:72}, // BST 485
    learnset:[[1,"sonic_pulse"],[1,"fairy_wind"],[15,"resonate"],[20,"pulse_wave"],[26,"dazzling_gleam"],[32,"harmonic_burst"],[38,"moonblast"],[44,"siren_song"],[50,"prism_resonance"]],
    desc:"A radiant cicada-fae whose layered song can soothe a raging Lumori or shatter stone.",
    lore:"Seraphene's chime has matured into true music — chords woven from fairy-light and sound that it conducts with sweeps of its luminous wings. Its harmonies can lull the most savage Lumori into calm or, focused to a single piercing note, crack stone and scatter foes. Bards travel for weeks to record the song of a Seraphene, though no instrument has ever truly captured it." },

  // --- F12: charged centipede (Toxin / Electric-Toxin) ---
  440: { id:440, name:"Rustmite", emoji:"🐛", types:["Toxin"],
    evolveTo:441, evolveLevel:26, catchRate:190, expYield:70, rarity:"common",
    base:{hp:50,atk:60,def:52,spa:48,spd:45,spe:55}, // BST 310
    learnset:[[1,"tox_sting"],[1,"tox_jab"],[5,"thunder_shock"],[10,"tox_bite"],[12,"tox_focus"],[15,"spark"],[20,"tox_acid_strike"],[22,"tox_poison_resolve"],[26,"tox_fang"]],
    desc:"A many-legged grub whose corrosive secretions pit and rust whatever it crawls across.",
    lore:"Rustmite oozes a caustic film that eats at metal and stone alike, leaving a telltale trail of pitted rust wherever it travels. It nests in damp ironwork and decaying machinery, feeding on the corrosion it creates, and a colony can reduce an abandoned forge to flaking ruin in a single season." },

  441: { id:441, name:"Corrodon", emoji:"🐛", types:["Electric","Toxin"],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:205, rarity:"uncommon",
    base:{hp:72,atk:98,def:70,spa:78,spd:62,spe:90}, // BST 470
    learnset:[[1,"tox_jab"],[5,"thunder_shock"],[15,"spark"],[18,"tox_focus"],[20,"tox_acid_strike"],[26,"volt_fang"],[28,"tox_poison_resolve"],[32,"tox_venom_thrust"],[38,"discharge"],[44,"tox_storm_phy"],[50,"plasma_strike"]],
    desc:"A fast, armoured centipede that pairs corrosive venom with a stored electric charge.",
    lore:"Corrodon's many segments each hold a tiny store of charge drawn from the corrosion it feeds on, so a bite delivers acid and a jolt at once. It races along power-lines and pipework with unnerving speed, shorting machinery and dissolving the housings, and engineers in the foundry cities wage a constant quiet war against the colonies that infest their conduits." },

  // --- F13: miasma leech (Vapor / Poison-Vapor) ---
  442: { id:442, name:"Bloatleech", emoji:"🩸", types:["Vapor"],
    evolveTo:443, evolveLevel:26, catchRate:190, expYield:66, rarity:"common",
    base:{hp:65,atk:45,def:55,spa:58,spd:52,spe:30}, // BST 305
    learnset:[[1,"vapor_jab"],[1,"mist_s"],[5,"poison_sting"],[8,"miasma_blow"],[10,"fog_beam"],[12,"vapor_ray"],[15,"acid_spray"],[18,"mist_meditation"],[20,"mist_pulse"],[26,"venoshock"]],
    desc:"A swollen, translucent leech that exhales a faint sour fog as it feeds.",
    lore:"Bloatleech haunts stagnant fens, bloating itself on the vital warmth of larger Lumori and venting the excess as a sour, low-hanging mist. The fog it breathes out dulls the senses of its host, so a feeding Bloatleech often goes unnoticed until it drops away, fat and sluggish, into the murk." },

  443: { id:443, name:"Miasmire", emoji:"🩸", types:["Poison","Vapor"],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:200, rarity:"uncommon",
    base:{hp:95,atk:60,def:78,spa:92,spd:85,spe:50}, // BST 460
    learnset:[[1,"vapor_jab"],[5,"poison_sting"],[15,"acid_spray"],[18,"mist_veil"],[20,"mist_pulse"],[24,"condense"],[26,"venoshock"],[28,"acid_mist"],[32,"miasma_cloud"],[34,"cloud_smash"],[38,"sludge_bomb"],[40,"mist_flood"],[44,"miasma_wave"],[50,"corrosive_fog"],[52,"fog_screen"]],
    desc:"A bloated bog-horror that drags a permanent cloud of toxic mist wherever it oozes.",
    lore:"Miasmire has grown into a slow, swollen mass that no longer needs to attach to feed — it simply exhales a creeping fog of toxin and waits for weakened prey to fall. Whole stretches of marsh die back where one settles, the reeds blackening in the haze, and bog-guides mark a Miasmire's territory by the silence and the smell long before they see it." },

  // --- F14: meerkat sentinel (Sonic / Normal-Sonic) ---
  444: { id:444, name:"Squeaklet", emoji:"🐿️", types:["Sonic"],
    evolveTo:445, evolveLevel:24, catchRate:190, expYield:68, rarity:"common",
    base:{hp:52,atk:55,def:48,spa:55,spd:50,spe:55}, // BST 315
    learnset:[[1,"chirp"],[1,"echo_strike"],[5,"quick_attack"],[10,"sonic_pulse"],[15,"sound_rush"],[20,"shake_strike"],[26,"pulse_wave"]],
    desc:"A bright-eyed burrow-pup that pops upright to give a piercing alarm-squeak.",
    lore:"Squeaklet live in chattering colonies riddled with tunnels, and every pup learns the watch-calls before it learns to forage. A sentinel will stand on its hind legs atop the highest mound and loose a squeak so sharp it stops a hawk mid-stoop, sending the whole colony underground in a heartbeat." },

  445: { id:445, name:"Sentrike", emoji:"🐿️", types:["Normal","Sonic"],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:205, rarity:"uncommon",
    base:{hp:78,atk:88,def:68,spa:78,spd:73,spe:90}, // BST 475
    learnset:[[1,"echo_strike"],[5,"quick_attack"],[15,"sound_rush"],[20,"shake_strike"],[26,"pulse_wave"],[32,"body_slam"],[38,"decibel_burst"],[44,"earsplit"],[50,"skyboom_strike"]],
    desc:"A vigilant sentinel whose focused shriek can stagger an attacker from across the dunes.",
    lore:"Sentrike is the colony's standing guard, grown swift and strong enough to back its alarm-calls with action. Its shriek has sharpened into a weapon — a focused blast of sound that buckles a predator's stance and buys the burrow precious seconds. A colony with a seasoned Sentrike on watch is almost impossible to surprise." },

  // --- F15: spore myconid (Vapor / Nature-Vapor) ---
  446: { id:446, name:"Sporelet", emoji:"🍄", types:["Vapor"],
    evolveTo:447, evolveLevel:26, catchRate:190, expYield:66, rarity:"common",
    base:{hp:60,atk:45,def:58,spa:62,spd:55,spe:30}, // BST 310
    learnset:[[1,"tackle"],[1,"mist_s"],[5,"vapor_jab"],[8,"mist_meditation"],[10,"sleep_powder"],[12,"vapor_focus"],[15,"fog_beam"],[18,"acid_mist"],[20,"mist_pulse"],[26,"seed_bomb"]],
    desc:"A capped sprout that puffs a fine drowsy haze of spores when nudged.",
    lore:"Sporelet pushes up overnight in damp, shaded hollows, releasing a soft haze of spores at the first disturbance to ward off grazers. The mist is harmless but soporific, and small Lumori that bed down near a cluster of Sporelet sleep deep and wake to find the sprouts have quietly multiplied around them." },

  447: { id:447, name:"Fumycet", emoji:"🍄", types:["Nature","Vapor"],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:200, rarity:"uncommon",
    base:{hp:92,atk:62,def:80,spa:95,spd:84,spe:55}, // BST 468
    learnset:[[1,"tackle"],[5,"vapor_jab"],[15,"fog_beam"],[16,"mist_speed"],[18,"mist_veil"],[20,"seed_bomb"],[22,"stream_burst"],[24,"acid_mist"],[26,"mist_pulse"],[28,"evaporate"],[32,"mycelia_net"],[34,"vapor_drill"],[38,"energy_ball"],[44,"corrosive_fog"],[50,"spore_burst"]],
    desc:"A towering fungal myconid that breathes living spore-fog and seeds the soil as it walks.",
    lore:"Fumycet is a walking fungus the height of a person, its cap venting a slow fog thick with spores that take root wherever they settle. It cultivates the ground it passes over, leaving trails of fresh mushroom-growth, and the deep mycelial network beneath a Fumycet's range lets it sense every footfall pressing the soil for miles." },

  // --- F16: burrowing mole (Mineral / Dark-Mineral) ---
  448: { id:448, name:"Cobblepup", emoji:"🦡", types:["Mineral"],
    evolveTo:449, evolveLevel:24, catchRate:190, expYield:64, rarity:"common",
    base:{hp:54,atk:60,def:62,spa:40,spd:44,spe:45}, // BST 305
    learnset:[[1,"tackle"],[1,"harden"],[5,"mineral_jab"],[10,"shard_volley"],[12,"mineral_resonance"],[15,"ore_punch"],[18,"shard_form"],[20,"mineral_strike"],[26,"mineral_smash"]],
    desc:"A snub-nosed digger with spade-claws that shovel through gravel as if it were sand.",
    lore:"Cobblepup is born blind in deep burrows and reads the world through the grit it shoves aside, its spade-claws breaking cobbles to swallow the mineral-rich shards within. Pups dig constantly, and a single litter can honeycomb a hillside in a season, sieving the soil for the ore-pebbles that strengthen their claws." },

  449: { id:449, name:"Oredigger", emoji:"🦡", types:["Dark","Mineral"],
    evolveTo:null, evolveLevel:null, catchRate:65, expYield:198, rarity:"uncommon",
    base:{hp:80,atk:100,def:88,spa:50,spd:62,spe:75}, // BST 455
    learnset:[[1,"tackle"],[5,"mineral_jab"],[15,"ore_punch"],[18,"ore_armor"],[20,"bite"],[26,"mineral_smash"],[32,"night_slash"],[38,"obsidian_strike"],[44,"crunch"],[50,"shadowstep"]],
    desc:"A lightless-eyed tunneler that ambushes from below, dragging prey down into the dark.",
    lore:"Oredigger has abandoned the surface entirely, hunting in the lightless deep where its sense of vibration and its obsidian claws make it lord of the tunnels. It strikes upward without warning, hauling unwary Lumori beneath the soil before they can struggle, and miners who hear claws scraping the far side of a rock wall know to dig elsewhere." },

  // --- F17: mantis shrimp (Fighting / Fighting-Fire) ---
  450: { id:450, name:"Jabshell", emoji:"🦐", types:["Fighting"],
    evolveTo:451, evolveLevel:28, catchRate:180, expYield:70, rarity:"common",
    base:{hp:55,atk:72,def:58,spa:48,spd:47,spe:45}, // BST 325
    learnset:[[1,"quick_punch"],[1,"battle_cry"],[5,"straight_jab"],[10,"body_check"],[15,"low_sweep_f"],[20,"power_drive"],[26,"roundhouse"]],
    desc:"A small reef-shrimp whose club-arms strike fast enough to crack a shell with a snap.",
    lore:"Jabshell hammers at snails and stones from the moment it can lift its club-like forelimbs, and the snap of its strike comes faster than the eye can follow. The percussive crack it makes echoes through tide-pools, and rivals settle territorial disputes in flurries of blows that leave the water briefly boiling with tiny bubbles." },

  451: { id:451, name:"Smashclaw", emoji:"🦐", types:["Fighting","Fire"],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:210, rarity:"uncommon",
    base:{hp:80,atk:128,def:78,spa:68,spd:66,spe:70}, // BST 490
    learnset:[[1,"quick_punch"],[5,"straight_jab"],[15,"body_check"],[20,"power_drive"],[26,"flame_charge"],[32,"iron_fist"],[38,"ignition_kick"],[44,"close_combat"],[50,"flare_uppercut"]],
    desc:"A reef-brawler whose club-strike moves so fast the water flashes to steam on impact.",
    lore:"Smashclaw's strike is among the fastest blows in all Lumoria — its club-arms accelerate so violently that the water ahead of them boils into a flash of scalding vapour, doubling the force as the bubble collapses. It cracks open the toughest shells and the hardest stones with ease, and challengers who underestimate the little brawler are met with a punch that lands like a thrown coal." },

  // --- F18: dream sloth (Dream / Dream-Fairy) ---
  452: { id:452, name:"Dozit", emoji:"🦥", types:["Dream"],
    evolveTo:453, evolveLevel:28, catchRate:190, expYield:64, rarity:"common",
    base:{hp:68,atk:42,def:55,spa:58,spd:57,spe:20}, // BST 300
    learnset:[[1,"tackle"],[1,"lullaby_song"],[5,"dream_jab"],[10,"dream_pulse"],[15,"somnia_ray"],[20,"dream_beam"],[26,"lullaby_aura"]],
    desc:"A perpetually half-asleep sloth that drifts through its own slow daydreams.",
    lore:"Dozit spends nearly all its life adrift between waking and sleep, moving so slowly that moss and small Lumori take up residence in its fur. Its dreams leak gently into the air as a calming drowse, and creatures that doze beneath a hanging Dozit share in its mild, wandering reveries." },

  453: { id:453, name:"Lullavoir", emoji:"🦥", types:["Dream","Fairy"],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:196, rarity:"uncommon",
    base:{hp:100,atk:55,def:80,spa:90,spd:95,spe:30}, // BST 450
    learnset:[[1,"dream_pulse"],[1,"fairy_wind"],[15,"somnia_ray"],[20,"dream_beam"],[26,"draining_kiss"],[32,"dazzling_gleam"],[38,"somnia_blast"],[44,"moonblast"],[50,"lullaby_song"]],
    desc:"A serene, slow-moving sloth-fae that spins waking dreams of soft light around itself.",
    lore:"Lullavoir drifts through the high canopy wrapped in a haze of luminous, gentle dreams, and to wander into its aura is to feel one's worries dissolve into a pleasant drowse. It means no harm — those it lulls wake rested and content — but enemies caught in its dreamscape simply forget why they came to fight. Forest-folk consider a resident Lullavoir a blessing on the grove." },

  // --- F19: haunted bell (Spectral / Metal-Spectral) ---
  454: { id:454, name:"Tollwisp", emoji:"🔔", types:["Spectral"],
    evolveTo:455, evolveLevel:30, catchRate:180, expYield:68, rarity:"common",
    base:{hp:50,atk:42,def:62,spa:72,spd:62,spe:24}, // BST 312
    learnset:[[1,"ghost_jab"],[1,"haunting_cry"],[5,"ghost_pulse"],[10,"specter_pulse"],[15,"void_wail"],[20,"phantom_beam"],[26,"spirit_drain"]],
    desc:"A small spirit that has taken up residence inside a cracked, tarnished handbell.",
    lore:"Tollwisp is a lonely haunt nesting within a discarded bell, ringing itself softly at odd hours to announce a presence no one can see. The sound carries an unmistakable mournful note, and old chapels where a Tollwisp has settled are said to toll on their own on the anniversaries of those once mourned there." },

  455: { id:455, name:"Knellgeist", emoji:"🔔", types:["Metal","Spectral"],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:205, rarity:"uncommon",
    base:{hp:72,atk:60,def:105,spa:100,spd:95,spe:40}, // BST 472
    learnset:[[1,"ghost_pulse"],[1,"specter_pulse"],[15,"void_wail"],[20,"phantom_beam"],[26,"flash_cannon"],[32,"metal_sound"],[38,"soul_burst"],[44,"chromium_ray"],[50,"phantom_force"]],
    desc:"A great cast-iron tower-bell possessed by a host of spirits, its toll heavy with dread.",
    lore:"Knellgeist is a massive bronze-and-iron bell grown thick with the spirits drawn to its resonance, and its toll is a physical force — a wave of sound and dread that buckles the will of any who hear it. It rings of its own accord before calamities, and townsfolk who hear an unmanned Knellgeist sound at midnight bar their doors and wait for dawn." },

  // --- F20: axolotl (Vapor / Aquatic-Vapor) ---
  456: { id:456, name:"Mistgill", emoji:"🦎", types:["Vapor"],
    evolveTo:457, evolveLevel:26, catchRate:190, expYield:68, rarity:"common",
    base:{hp:65,atk:50,def:55,spa:58,spd:55,spe:35}, // BST 318
    learnset:[[1,"tackle"],[1,"mist_s"],[5,"vapor_jab"],[10,"water_gun"],[12,"stream_burst"],[15,"fog_beam"],[18,"mist_speed"],[20,"mist_pulse"],[22,"mist_strike"],[26,"bubble_beam"]],
    desc:"A frilled, perpetually smiling amphibian whose feathery gills trail wisps of warm mist.",
    lore:"Mistgill lives in mineral springs where warm water meets cool air, and the feathery external gills it waves to breathe leave little curls of mist drifting behind it. It regenerates lost limbs in days and never fully matures away from the water, keeping its juvenile frills and its placid, eternal smile throughout its life." },

  457: { id:457, name:"Vaporlotl", emoji:"🦎", types:["Aquatic","Vapor"],
    evolveTo:null, evolveLevel:null, catchRate:60, expYield:205, rarity:"uncommon",
    base:{hp:100,atk:72,def:78,spa:92,spd:86,spe:50}, // BST 478
    learnset:[[1,"water_gun"],[1,"mist_s"],[10,"stream_burst"],[15,"fog_beam"],[18,"mist_speed"],[20,"bubble_beam"],[22,"fog_screen"],[26,"mist_pulse"],[28,"cloud_strike"],[32,"aqua_tail"],[38,"steam_burst"],[40,"mist_press"],[44,"surf"],[50,"vapor_eruption"],[52,"vapor_calm"]],
    desc:"A large spring-dwelling amphibian wreathed in warm vapour, able to heal its own wounds in moments.",
    lore:"Vaporlotl rules the deep thermal pools, its broad gills exhaling a constant warm fog across the water's surface. Its regenerative powers are the stuff of legend — it can knit a severed limb whole within an afternoon — and injured Lumori that reach a Vaporlotl's spring and rest in its mist often recover from wounds that should have been mortal." },

  // --- F21: tengu (Fighting / Fighting-Wind) ---
  458: { id:458, name:"Gustling", emoji:"👺", types:["Fighting"],
    evolveTo:459, evolveLevel:28, catchRate:180, expYield:72, rarity:"common",
    base:{hp:55,atk:68,def:52,spa:55,spd:50,spe:50}, // BST 330
    learnset:[[1,"quick_punch"],[1,"battle_cry"],[5,"gust"],[10,"straight_jab"],[15,"low_sweep_f"],[20,"body_check"],[26,"roundhouse"]],
    desc:"A red-faced mountain imp that practices its fist-forms atop wind-blasted crags.",
    lore:"Gustling are mischievous spirits of the high peaks, drilling endless martial forms against the mountain gales and snatching the hats of travellers who climb too proudly. The wind they train against has taught them footwork no still-air fighter can match, and a humbled climber who bows respectfully may find a Gustling willing to guide them down." },

  459: { id:459, name:"Tengrath", emoji:"👺", types:["Fighting","Wind"],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:212, rarity:"uncommon",
    base:{hp:82,atk:115,def:72,spa:80,spd:71,spe:75}, // BST 495
    learnset:[[1,"gust"],[5,"straight_jab"],[15,"body_check"],[20,"air_slash"],[26,"roundhouse"],[32,"tornado_kick"],[38,"iron_fist"],[44,"close_combat"],[50,"hurricane"]],
    desc:"A long-nosed tengu master that rides the gale and strikes from the heart of a whirlwind.",
    lore:"Tengrath is a tengu in its full power — a martial spirit that summons the mountain wind to its fists and feet, closing the distance on a gust to land blows that arrive from impossible angles. It tests warriors who climb to its peak, demanding humility as fiercely as skill, and the rare student it deems worthy is taught wind-walking forms found in no dojo below." },

  // --- F22: singing-bowl construct (Sonic / Mental-Sonic) ---
  460: { id:460, name:"Gongling", emoji:"🎵", types:["Sonic"],
    evolveTo:461, evolveLevel:30, catchRate:180, expYield:68, rarity:"common",
    base:{hp:55,atk:45,def:58,spa:68,spd:54,spe:35}, // BST 315
    learnset:[[1,"echo_strike"],[1,"resonate"],[5,"sonic_pulse"],[10,"sound_rush"],[15,"confusion"],[20,"pulse_wave"],[26,"wave_cry"]],
    desc:"A small hovering singing-bowl that hums a steady, calming tone of its own accord.",
    lore:"Gongling is a votive bowl given a faint will by generations of meditation rung into its metal. It drifts a hand's breadth above the ground, humming a low tone that steadies racing thoughts, and temples treasure one as a tireless aid to focus — though a startled Gongling will clang a discordant note that scatters concentration just as easily." },

  461: { id:461, name:"Resonethe", emoji:"🎵", types:["Mental","Sonic"],
    evolveTo:null, evolveLevel:null, catchRate:55, expYield:208, rarity:"uncommon",
    base:{hp:82,atk:58,def:80,spa:115,spd:92,spe:55}, // BST 482
    learnset:[[1,"sonic_pulse"],[1,"confusion"],[15,"pulse_wave"],[20,"psybeam"],[26,"harmonic_burst"],[32,"resonance_quake"],[38,"psychic_move"],[44,"threnody"],[50,"mind_shatter"]],
    desc:"A great resonating bowl-construct whose layered tones tune the very thoughts of those nearby.",
    lore:"Resonethe is a towering construct of nested singing-bowls, each ringing a different note, that has accumulated enough meditative resonance to touch the minds around it. Its harmonies can lift a clouded mind to perfect clarity or, struck in anger, shatter concentration and will alike with a single dissonant chord. Oracles seat themselves within its rings to think thoughts they could not hold alone." },

  // ============================================================
  // FORGOTTEN LUMORI — IDs 462–500 (Vaeldrian Region)
  // These Lumori are not catchable and not named to the player.
  // In battle: "Forgotten Lumori X came in to battle."
  // In Luminex Vaeldris tab: shows only emoji + "Forgotten Lumori X"
  // foreignRegion:true flags all entries for mystery display.
  // ============================================================

  // --- Wielder: Lysara (Celestial Plateau) ---
  462: { id:462, name:"Forgotten Auravian", emoji:"🕊️", types:["Aether","Primal"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:115,atk:95,def:110,spa:145,spd:130,spe:125},
    learnset:[[1,"confusion"],[5,"aether_jab"],[10,"aether_pulse"],[15,"primal_focus"],[20,"psybeam"],[25,"life_force"],[30,"mystic_ray"],[35,"earth_power"],[40,"arcane_beam"],[45,"ancient_pulse"],[50,"psychic_move"],[50,"mystic_charge"],[55,"primal_meditation"],[60,"mystical_eruption"],[65,"moonblast"],[70,"cosmic_veil"],[75,"radiant_aura"],[80,"aura_veil_strike"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Messengers of the sacred temples of a lost land, Auravian carry the resonance of ancient prayers on crystalline wings.",
    lore:"Auravian are the divine messengers of Vaeldris. They appear to those who have lost something precious and are said to carry the voices of the departed on their wings." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  463: { id:463, name:"Forgotten Lumarix", emoji:"🦢", types:["Fairy","Earth"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:120,atk:100,def:115,spa:155,spd:135,spe:125},
    learnset:[[1,"fairy_wind"],[20,"earth_power"],[35,"dazzling_gleam"],[50,"moonblast"],[65,"fissure_slam"],[70,"celestial_wave"],[80,"luma_quake"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Lumarix hold fragments of starlight within their translucent bodies and release blinding radiance when threatened.",
    lore:"The crystalline structures within a Lumarix's body refract light in ways that physicists from Vaeldris spent centuries trying to explain. They never succeeded." },

  464: { id:464, name:"Forgotten Celestrix", emoji:"👼", types:["Aether","Metal"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:130,atk:105,def:120,spa:170,spd:145,spe:130},
    learnset:[[1,"body_slam"],[5,"aether_jab"],[20,"flash_cannon"],[25,"divine_ward"],[35,"psychic_move"],[40,"ethereal_slash"],[45,"arcane_resolve"],[50,"moonblast"],[55,"radiant_wave"],[65,"alloy_edge"],[70,"cosmic_veil"],[75,"divine_press"],[80,"celestial_forge"],[85,"arcane_meditation"],[90,"star_cannon"],[100,"ethereal_storm"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"The apex guardian of Vaeldris's celestial order, Celestrix was said to manifest only when the stars aligned perfectly.",
    lore:"Lysara wept on the day Celestrix became the last of its kind. She has never spoken of the Sundering to anyone, but those who watch her battle claim they can see it in her eyes." },

  // --- Wielder: Morrigan (The Shadowfen) ---
  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  465: { id:465, name:"Forgotten Nyxviper", emoji:"🦇", types:["Dark","Spectral"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:80,atk:150,def:80,spa:120,spd:90,spe:200},
    learnset:[[1,"night_slash"],[20,"shadow_ball"],[35,"dark_pulse"],[50,"void_rend"],[65,"shadowstep"],[70,"eclipse_shroud"],[80,"nyx_fang"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Nyxviper phase through solid matter and strike from the space between moments. Their venom erases memories rather than dealing damage.",
    lore:"Vaeldrian scholars debated whether Nyxviper were truly physical beings or manifestations of collective nightmares. The debate was never resolved." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  466: { id:466, name:"Forgotten Morrath", emoji:"🌑", types:["Poison","Fire"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:85,atk:145,def:90,spa:135,spd:95,spe:200},
    learnset:[[1,"shadow_ball"],[20,"fire_blast"],[35,"dark_pulse"],[50,"sludge_wave"],[65,"cinderwhirl"],[70,"nightmare_pulse"],[80,"toxic_blaze"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Ancient Vaeldrians believed Morrath were warriors who refused to pass on. Their dark flames absorb light and burn without producing warmth.",
    lore:"The flames Morrath produce are called darkfire — they are technically fire in every measurable sense, yet a room lit only by darkfire grows darker the longer they burn." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  467: { id:467, name:"Forgotten Duskmourn", emoji:"🕷️", types:["Ice","Mental"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:95,atk:155,def:95,spa:155,spd:100,spe:200},
    learnset:[[1,"ice_punch"],[20,"psychic_move"],[35,"blizzard"],[50,"psystrike"],[65,"cryo_lance"],[70,"veil_collapse"],[80,"mind_blizzard"],[90,"frost_pulse"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Duskmourn presided over Vaeldris's shadow courts as judge and executioner. It was the last thing standing when the Sundering came — and it still carries that grief.",
    lore:"Morrigan found Duskmourn three days after the Sundering, standing perfectly still at the edge of the collapse. She has never been able to explain why it chose to follow her." },

  // --- Wielder: Kael (Stormpeak Ridge) ---
  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  468: { id:468, name:"Forgotten Electrak", emoji:"🌩️", types:["Electric","Metal"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:90,atk:130,def:90,spa:150,spd:90,spe:170},
    learnset:[[1,"thunder_shock"],[20,"flash_cannon"],[35,"thunderbolt"],[50,"volt_surge"],[65,"alloy_edge"],[70,"overcharge"],[80,"volt_rail"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Electrak surf electromagnetic currents at speeds that blur their outline. Their charged steel scales can discharge enough power to fuel a city for hours.",
    lore:"The steel in Electrak's scales is a natural alloy produced by their bodies — a material that conducts electricity with zero resistance that Vaeldrian engineers failed to replicate." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  469: { id:469, name:"Forgotten Arcvolt", emoji:"⚡", types:["Normal","Earth"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:95,atk:140,def:95,spa:155,spd:100,spe:165},
    learnset:[[1,"dragon_breath"],[20,"stone_edge"],[35,"dragon_claw"],[50,"dragon_pulse"],[65,"obsidian_crash"],[70,"time_fracture"],[80,"arc_strike"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Arcvolt stores massive charges within draconic stone-scale formations before releasing them in a single arc. The discharge leaves glass where the lightning lands.",
    lore:"Arcvolt's scales form geological strata within their bodies over time — geologists from Vaeldris once found evidence of strikes dating back sixty thousand years in a single Arcvolt's hide." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  470: { id:470, name:"Forgotten Fulgureis", emoji:"🌪️", types:["Nature","Aquatic"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:100,atk:155,def:100,spa:165,spd:110,spe:170},
    learnset:[[1,"gust"],[20,"surf"],[35,"hurricane"],[50,"hydro_pump"],[65,"tidal_crush"],[70,"time_fracture"],[80,"torrent_shell"],[90,"swarm_tide"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Fulgureis was worshipped as Vaeldris's storm god. Its roar causes lightning to strike from all directions simultaneously. It has never been struck by lightning — it IS lightning.",
    lore:"Kael refuses to call Fulgureis by any title. He says if you need a title to respect something, you haven't understood it yet." },

  // --- Wielder: Thessaly (Ancient Root Cavern) ---
  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  471: { id:471, name:"Forgotten Rootborn", emoji:"🌿", types:["Nature","Poison"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:155,atk:135,def:130,spa:90,spd:120,spe:90},
    learnset:[[1,"vine_whip"],[20,"sludge_bomb"],[35,"seed_bomb"],[50,"energy_ball"],[65,"toxic_surge"],[70,"verdant_surge"],[80,"root_toxin"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Rootborn grew from ancient seed-stones buried beneath Vaeldris's mountains for ten thousand years. Their roots crack bedrock and draw nutrients from bare stone.",
    lore:"A single Rootborn can undermine a mountain's foundation in a century. Thessaly meditates beside hers every morning and says it tells her things the mountains are thinking." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  472: { id:472, name:"Forgotten Tellurak", emoji:"🗻", types:["Earth","Metal"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:160,atk:145,def:140,spa:95,spd:125,spe:85},
    learnset:[[1,"rock_slide"],[20,"iron_tail"],[35,"stone_edge"],[50,"flash_cannon"],[65,"obsidian_crash"],[70,"warden_strike"],[80,"mineral_lance"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Tellurak has absorbed millennia of geological pressure. Eruptions and earthquakes do not faze it. It once held a mountain together for a week through sheer will.",
    lore:"Vaeldrian stonecutters believed Tellurak were mountains that decided to walk. Thessaly has never corrected this belief." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  473: { id:473, name:"Forgotten Gaiasurge", emoji:"🌋", types:["Earth","Fighting"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:170,atk:160,def:150,spa:105,spd:130,spe:85},
    learnset:[[1,"earthquake"],[20,"power_drive"],[35,"earth_power"],[50,"iron_cleave"],[65,"fissure_slam"],[70,"mantle_surge"],[80,"tectonic_wrath"],[90,"quake_barrage"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Gaiasurge embodies Vaeldris's tectonic fury. When the Sundering struck, it held the land together for as long as anything could. Then it could hold no longer.",
    lore:"Thessaly never speaks of what she saw Gaiasurge do during the Sundering. She says some things are too large for language." },

  // --- Wielder: Nereus (The Hadal Depths) ---
  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  474: { id:474, name:"Forgotten Pelagor", emoji:"🐬", types:["Aquatic","Mental"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:110,atk:110,def:100,spa:145,spd:115,spe:140},
    learnset:[[1,"water_gun"],[20,"confusion"],[35,"surf"],[50,"psychic_move"],[65,"hydro_pump"],[70,"telepathic_slam"],[80,"thought_stream"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Pelagor perceive the emotional currents of the ocean and can sense fear, joy, and hunger across miles of open water.",
    lore:"Nereus claims Pelagor told him about the Sundering before it happened. He was three days' sail from Vaeldris and turned back because of it. He has never decided if that was the right choice." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  475: { id:475, name:"Forgotten Bathykor", emoji:"🦈", types:["Dark","Poison"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:115,atk:120,def:105,spa:155,spd:120,spe:135},
    learnset:[[1,"dark_pulse"],[20,"sludge_bomb"],[35,"crunch"],[50,"venom_lance"],[65,"obsidian_fang"],[70,"void_dominion"],[80,"dark_corrosion"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"From Vaeldris's lightless deep zones, Bathykor evolved to crush prey under pressures that collapse iron. Its gaze draws enemies toward an unseen void.",
    lore:"The toxin Bathykor produces doesn't cause pain. Victims simply become very still, very calm, and very far from the surface." },

  476: { id:476, name:"Forgotten Tidecrest", emoji:"🌊", types:["Primal","Ice"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:125,atk:140,def:110,spa:165,spd:130,spe:130},
    learnset:[[1,"ice_punch"],[15,"feral_armor"],[20,"ice_beam"],[30,"apex_predator"],[35,"surf"],[45,"ancient_calm"],[50,"blizzard"],[60,"primal_meditation"],[65,"eon_crash"],[70,"time_fracture"],[80,"glacial_riptide"],[90,"tidal_fang"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Tidecrest commands ocean currents that span continents. A single pulse of its tail can redirect rivers. Nereus calls it the last ocean god. The ocean agrees.",
    lore:"In Vaeldrian myth, Tidecrest did not swim the ocean. The ocean flowed around Tidecrest." },

  // --- Wielder: Caelia (Cloudspire) ---
  477: { id:477, name:"Forgotten Aetherveil", emoji:"🦋", types:["Aether","Electric"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:85,atk:100,def:90,spa:155,spd:110,spe:180},
    learnset:[[1,"confusion"],[5,"aether_jab"],[15,"aether_pulse"],[20,"thunder_shock"],[25,"ethereal_step"],[30,"aether_focus"],[35,"dazzling_gleam"],[40,"mystic_strike"],[45,"radiant_wave"],[50,"thunderbolt"],[55,"ethereal_slash"],[65,"moonblast"],[70,"discharge"],[75,"mystical_eruption"],[80,"aether_shock"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Aetherveil are the songs of the wind given form. Their calls travel across mountain ranges in seconds, carrying the voices of the lost to where they are needed.",
    lore:"Caelia says Aetherveil don't fly so much as they remind the air where it wants to go." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  478: { id:478, name:"Forgotten Zephyrak", emoji:"🦅", types:["Wind","Metal"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:90,atk:105,def:95,spa:165,spd:115,spe:180},
    learnset:[[1,"gust"],[20,"flash_cannon"],[35,"air_slash"],[50,"alloy_edge"],[65,"hurricane"],[70,"warden_strike"],[80,"steel_gale"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Zephyrak navigate by the electromagnetic signatures of all living things below, seeing the world as a tapestry of pulsing lights from miles in the clouds.",
    lore:"A Zephyrak's steel-feathers vibrate at frequencies that predict weather systems days in advance. Vaeldrian navigators once paid fortunes to travel with one." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  479: { id:479, name:"Forgotten Skydrak", emoji:"🌬️", types:["Wind","Spectral"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:100,atk:115,def:100,spa:180,spd:125,spe:180},
    learnset:[[1,"gust"],[20,"specter_pulse"],[35,"hurricane"],[50,"spirit_strike"],[65,"gale_cannon"],[70,"haunting_cry"],[80,"phantom_gale"],[90,"void_cyclone"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Skydrak soars at the edge of the atmosphere where air meets space. Its wings span a city block. The last of its kind watched Vaeldris fall from that height and could do nothing.",
    lore:"Caelia refuses to let Skydrak land. She says it belongs in the sky and the day it touches the ground again is the day she'll know it has given up." },

  // --- Wielder: Dravek (Magma Forge) ---
  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  480: { id:480, name:"Forgotten Pyraeon", emoji:"🦁", types:["Fire","Metal"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:90,atk:155,def:110,spa:130,spd:95,spe:140},
    learnset:[[1,"ember"],[20,"metal_claw"],[35,"fire_blast"],[50,"flash_cannon"],[65,"solar_flare"],[70,"forge_strike"],[80,"pyro_alloy"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Pyraeon's body is a living alloy — bone-steel fused with molten cores. Their claws can cut through solid iron with a single stroke.",
    lore:"Dravek sharpens Pyraeon's claws on volcanic rock every morning. He says the ritual keeps them both sharp." },

  481: { id:481, name:"Forgotten Emberon", emoji:"🐯", types:["Primal","Earth"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:95,atk:165,def:115,spa:135,spd:100,spe:140},
    learnset:[[1,"rock_slide"],[15,"beast_speed"],[20,"earthquake"],[25,"feral_armor"],[30,"raw_fury"],[35,"fire_blast"],[40,"ancient_power"],[45,"wild_aura"],[50,"earth_power"],[55,"apex_predator"],[60,"meteor_strike"],[65,"dragon_claw"],[70,"stone_edge"],[75,"world_root_bind"],[80,"smoldering_abyss"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Emberon hunts in volcanic shadow. Its strikes leave wounds that refuse to stop burning, channeled through volcanic earth energy into something darker.",
    lore:"Every general in Vaeldris's history tried to recruit Dravek. He refused every one of them. Emberon, he said, fights for itself — he just happens to agree with it." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  482: { id:482, name:"Forgotten Dracofire", emoji:"🔥", types:["Draconic","Poison"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:105,atk:185,def:120,spa:145,spd:105,spe:140},
    learnset:[[1,"dragon_breath"],[20,"sludge_wave"],[35,"dragon_claw"],[50,"venom_lance"],[65,"outrage"],[70,"mantle_surge"],[80,"venom_surge"],[90,"acid_burst"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Dracofire channels volcanic energy through draconic poison. Its exhale reaches temperatures that melt diamond — and the vapour corrodes whatever survives the heat.",
    lore:"Dravek bonded Dracofire as a hatchling, when it fit in his palm. He carried it under his armour for two winters. He has never admitted this publicly." },

  // --- Wielder: Nylara (Glacial Abyss) ---
  483: { id:483, name:"Forgotten Frigalum", emoji:"🦊", types:["Ice","Crystal"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:120,atk:120,def:130,spa:120,spd:130,spe:100},
    learnset:[[1,"ice_punch"],[15,"aurora_blast"],[20,"blizzard"],[25,"crystalline_slash"],[30,"ice_claw"],[35,"ice_beam"],[40,"shard_blade"],[50,"rock_slide"],[55,"crystal_smash"],[65,"permafrost"],[70,"stone_edge"],[75,"diamond_drill"],[80,"cryo_plate"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Frigalum are armored in ice-steel — a material unique to Vaeldris that never melts and deflects dragonfire. Vaeldrian smiths spent centuries failing to replicate it.",
    lore:"The only sample of Frigalum ice-steel that made it out of Vaeldris is the pauldron on Nylara's left shoulder. She refuses to explain how she acquired it." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  484: { id:484, name:"Forgotten Cryvorn", emoji:"🐺", types:["Dark","Ice"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:125,atk:130,def:140,spa:125,spd:135,spe:95},
    learnset:[[1,"dark_pulse"],[20,"ice_punch"],[35,"crunch"],[50,"blizzard"],[65,"eclipse_shroud"],[70,"ice_beam"],[80,"cryo_shatter"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Cryvorn lurk beneath glacial ice, rising to drag prey into the frozen depths. Their dark aura prevents victims from feeling the cold — until it is already fatal.",
    lore:"Nylara says Cryvorn don't hunt so much as they remind prey that warmth was always temporary." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  485: { id:485, name:"Forgotten Frostdrax", emoji:"❄️", types:["Spectral","Fairy"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:135,atk:145,def:150,spa:135,spd:145,spe:90},
    learnset:[[1,"spirit_strike"],[20,"fairy_wind"],[35,"specter_pulse"],[50,"moonblast"],[65,"celestial_wave"],[70,"haunting_cry"],[80,"winter_shade"],[90,"glacial_spirit"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Frostdrax maintained Vaeldris's northern climate for millennia. The ice continent shattered within hours of the moment it fled. It has not forgiven itself.",
    lore:"Frostdrax is the only one of the 39 that Nylara says chose to come with her. She did not command it. It simply followed." },

  // --- Wielder: Solenne (Moonhaven Ruins) ---
  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  486: { id:486, name:"Forgotten Dreamaith", emoji:"🦉", types:["Mental","Aquatic"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:100,atk:75,def:105,spa:175,spd:150,spe:115},
    learnset:[[1,"confusion"],[20,"shadow_ball"],[35,"psychic_move"],[50,"void_rend"],[65,"psystrike"],[70,"veil_collapse"],[80,"dream_torrent"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Dreamaith drift through walls and minds alike, leaving vivid impressions of Vaeldris in their wake. Those who encounter one report dreaming of a lost land for weeks afterward.",
    lore:"Solenne says Dreamaith don't know Vaeldris is gone. Every night, in the dream they share with her, it still stands." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  487: { id:487, name:"Forgotten Luneveth", emoji:"🌙", types:["Fairy","Aquatic"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:105,atk:80,def:110,spa:185,spd:155,spe:115},
    learnset:[[1,"fairy_wind"],[20,"water_gun"],[35,"moonblast"],[50,"surf"],[65,"celestial_wave"],[70,"hydro_pump"],[80,"moonlit_surge"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Luneveth absorb moonlight and convert it into tidal energy. On full moon nights their power doubles. They are drawn to places that remember the sea.",
    lore:"There is a pool in Moonhaven Ruins that Luneveth fills each night with reflected moonlight. By morning it is dry again. Solenne has watched this every night for fifteen years." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  488: { id:488, name:"Forgotten Psydrak", emoji:"💭", types:["Draconic","Electric"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:115,atk:90,def:115,spa:200,spd:165,spe:115},
    learnset:[[1,"dragon_breath"],[20,"thunderbolt"],[35,"dragon_pulse"],[50,"thunder"],[65,"draconic_roar"],[70,"time_fracture"],[80,"voltaic_fang"],[90,"thunder_chain"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Psydrak exists simultaneously across multiple timelines. Its draconic mind holds the memory of Vaeldris in a thousand possible futures — and the grief of knowing none survived.",
    lore:"Solenne says Psydrak has been trying to show her a timeline where Vaeldris still exists. She says she can feel it almost finding one, night after night." },

  // --- Wielder: Rax (The Iron Sanctum) ---
  489: { id:489, name:"Forgotten Ironvast", emoji:"🦾", types:["Crystal","Earth"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:130,atk:145,def:175,spa:75,spd:130,spe:65},
    learnset:[[1,"rock_throw"],[15,"crystal_punch"],[20,"rock_slide"],[25,"crystal_spear"],[35,"rock_blast"],[40,"diamond_storm"],[45,"quartz_quake"],[50,"stone_edge"],[55,"diamond_crash"],[65,"obsidian_crash"],[70,"earthquake"],[75,"diamond_drill"],[80,"iron_fortress"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Ironvast's carapace has never been cracked in recorded Vaeldrian history. Engineers once used shed Ironvast shells as building material — with their full consent.",
    lore:"Rax says Ironvast has only ever been afraid once. He doesn't say when." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  490: { id:490, name:"Forgotten Forgerak", emoji:"⚔️", types:["Fire","Dark"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:135,atk:155,def:185,spa:80,spd:135,spe:60},
    learnset:[[1,"ember"],[20,"night_slash"],[35,"fire_blast"],[50,"dark_pulse"],[65,"solar_flare"],[70,"eclipse_shroud"],[80,"forge_blast"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Forgerak can heat their core to temperatures that liquefy ore. Vaeldrian smiths once worked alongside them to craft legendary weapons. Those weapons are all gone now.",
    lore:"Rax carries one of those weapons — a blade forged by Forgerak before the Sundering. He has never used it in battle. He says it isn't meant for fighting." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  491: { id:491, name:"Forgotten Alloydrax", emoji:"🛡️", types:["Draconic","Fighting"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:145,atk:170,def:200,spa:90,spd:145,spe:50},
    learnset:[[1,"dragon_breath"],[20,"body_slam"],[35,"dragon_claw"],[50,"outrage"],[65,"eon_crash"],[70,"mantle_surge"],[80,"dragon_pummels"],[90,"alloy_breaker"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Alloydrax continuously refines its own body, becoming stronger with every battle. It was Vaeldris's final line of defense. The fact that Vaeldris still fell says everything.",
    lore:"Rax does not speak of Alloydrax's battle during the Sundering. He only says that it did its job — and that doing your job perfectly is not always enough." },

  // --- Wielder: Tempris (The Arc Station) ---
  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  492: { id:492, name:"Forgotten Volteon", emoji:"🔋", types:["Electric","Mental"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:90,atk:110,def:95,spa:160,spd:120,spe:145},
    learnset:[[1,"thunder_shock"],[20,"confusion"],[35,"thunderbolt"],[50,"psychic_move"],[65,"volt_surge"],[70,"overcharge"],[80,"psycho_surge"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Volteon processes battle outcomes in microseconds using electric-psychic predictive modeling. By the time you have decided to act, Volteon has already chosen its counter.",
    lore:"Tempris designed the predictive model that Volteon runs. He says it's 94.7% accurate. Volteon disagrees with the 5.3% margin of error." },

  493: { id:493, name:"Forgotten Sparkeis", emoji:"⚡", types:["Crystal","Ice"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:95,atk:120,def:100,spa:165,spd:125,spe:145},
    learnset:[[1,"powder_snow"],[20,"ice_punch"],[30,"radiant_reflection"],[35,"ice_beam"],[40,"crystal_storm"],[45,"shard_blade"],[50,"blizzard"],[55,"prismatic_eruption"],[65,"rock_slide"],[70,"stone_edge"],[80,"frost_lattice"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Sparkeis are living power grids — their steel chassis stores charges that could power a city for months. They convert all kinetic energy into electricity passively.",
    lore:"Tempris installed a small meter on Sparkeis to measure output. It broke after three days. He has not replaced it." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  494: { id:494, name:"Forgotten Thunderax", emoji:"🌩️", types:["Wind","Nature"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:105,atk:135,def:110,spa:180,spd:135,spe:135},
    learnset:[[1,"aerial_assault"],[20,"energy_ball"],[35,"sky_dive"],[50,"verdant_surge"],[65,"gale_cannon"],[70,"hurricane"],[80,"canopy_strike"],[90,"sky_harvest"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Thunderax charges itself using entire storm systems. Tempris claims it once powered a civilization for a week by standing still in a thundercloud. He is not exaggerating.",
    lore:"Thunderax is the only one of the 39 that does not seem to remember Vaeldris. Tempris has never decided if that is a tragedy or a mercy." },

  // --- Wielder: Vayne (The Void Gate) ---
  495: { id:495, name:"Forgotten Nihilax", emoji:"🕳️", types:["Primal","Spectral"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:75,atk:145,def:80,spa:160,spd:90,spe:170},
    learnset:[[1,"night_slash"],[15,"ancient_pulse"],[20,"earth_power"],[30,"primal_meditation"],[35,"dark_pulse"],[45,"soul_eater_p"],[50,"earthquake"],[65,"specter_pulse"],[70,"void_dominion"],[80,"nihil_quake"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Nihilax emit a field that suppresses all energy signatures within range. In their presence, lights dim, sound muffles, and time seems to hesitate.",
    lore:"Vayne says Nihilax was the first Lumori she saw after the Sundering began. She has never been sure if it was trying to help or simply watching." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  496: { id:496, name:"Forgotten Vantarix", emoji:"🌌", types:["Mental","Nature"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:80,atk:155,def:85,spa:170,spd:95,spe:165},
    learnset:[[1,"confusion"],[20,"bug_bite"],[35,"psychic_move"],[50,"x_scissor"],[65,"psystrike"],[70,"signal_beam"],[80,"venom_mind"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Vantarix absorb light across all spectrums, appearing as a perfect silhouette even in total darkness. They are the only known Lumori visible inside the dimensional collapse itself.",
    lore:"Vayne has a drawing of Vantarix she made the first night she was safe. She has never looked at it again." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  497: { id:497, name:"Forgotten Abysdrak", emoji:"💠", types:["Wind","Draconic"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:90,atk:170,def:90,spa:185,spd:100,spe:165},
    learnset:[[1,"dragon_breath"],[20,"air_slash"],[35,"dragon_claw"],[50,"hurricane"],[65,"outrage"],[70,"gale_cannon"],[80,"abyssal_fang"],[90,"void_rend_ex"]],
    catchRate:0, expYield:420, rarity:"legendary",
    desc:"Abysdrak embodies the void at the heart of the Sundering. Vayne refuses to explain how she bound it to her will. Only that the night she did, stars over Vaeldris went out and never came back.",
    lore:"Some of the other wielders are afraid of Abysdrak. Vayne considers this the only reasonable response." },

  // --- Wielder: Azura (Observatory Peak) ---
  498: { id:498, name:"Forgotten Cosmolith", emoji:"🌠", types:["Aether","Fairy"],
    evolveTo:null, evolveLevel:null, foreignRegion:true,
    base:{hp:110,atk:90,def:110,spa:185,spd:130,spe:95},
    learnset:[[1,"confusion"],[5,"aether_jab"],[15,"aether_pulse"],[20,"fairy_wind"],[25,"life_force"],[30,"aether_focus"],[35,"dazzling_gleam"],[40,"arcane_meditation"],[45,"arcane_beam"],[50,"moonblast"],[55,"mystic_charge"],[65,"psystrike"],[70,"cosmic_veil"],[75,"radiant_strike"],[80,"cosmic_dust"]],
    catchRate:3, expYield:300, rarity:"legendary",
    desc:"Cosmolith serve as living star maps — their scales reflect the night sky of Vaeldris exactly as it existed the moment before the Sundering. They are the only record those stars ever existed.",
    lore:"Azura detected the Sundering three days before it happened by reading a change in Cosmolith's scale patterns. She had not understood what she was seeing until it was too late." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  499: { id:499, name:"Forgotten Stardrax", emoji:"✨", types:["Draconic","Fire"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:115,atk:100,def:115,spa:195,spd:135,spe:90},
    learnset:[[1,"dragon_breath"],[20,"fire_blast"],[35,"dragon_pulse"],[50,"solar_flare"],[65,"ancient_breath"],[70,"time_fracture"],[80,"stellar_flare"]],
    catchRate:0, expYield:350, rarity:"legendary",
    desc:"Stardrax's power surges like a dying star — quiet and vast until catastrophically sudden. Azura kept its egg safe for twelve years before it hatched the day the Sundering began.",
    lore:"The egg hatched the exact moment the Sundering started. Azura has spent fifteen years deciding what that means." },

  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore
  500: { id:500, name:"Forgotten Stellarion", emoji:"🔭", types:["Normal","Spectral"],
    evolveTo:null, evolveLevel:null, foreignRegion:true, uncatchable:true,
    base:{hp:125,atk:115,def:125,spa:210,spd:145,spe:80},
    learnset:[[1,"body_slam"],[20,"shadow_ball"],[35,"psychic_move"],[50,"hyper_beam"],[65,"void_rend"],[70,"cosmic_veil"],[80,"stellar_collapse"],[90,"ghost_radiance"]],
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
      {id:178, minLv:2, maxLv:4, rate:10},  // Fluffen
      {id:180, minLv:2, maxLv:4, rate:30},  // Leapbun
      {id:197, minLv:2, maxLv:5, rate:35}, // Photoworm
      {id:185, minLv:3, maxLv:5, rate:25}   // Hoverrow
    ],
    hasGym:false, requiredBadges:0, mapPos:{x:25, y:68}
  },
  ashford: {
    id:"ashford", name:"Ashford City", icon:"🏙️", type:"city",
    desc:"The first city of the journey. Home to Gym Leader Rex who specializes in Normal types.",
    connections:["route1","route2"],
    wildMonsters:[
      {id:178, minLv:4, maxLv:7, rate:25},
      {id:187, minLv:4, maxLv:7, rate:10},
      {id:69, minLv:4, maxLv:6, rate:30},
      {id:180, minLv:5, maxLv:7, rate:35}
    ],
    hasGym:true, gymLeader:"rex", requiredBadges:0, mapPos:{x:38, y:62}
  },
  route2: {
    id:"route2", name:"Route 2 - Greenwood Forest", icon:"🌲", type:"route",
    desc:"A dense forest teeming with Bug and Grass type Lumori.",
    connections:["ashford","tidewatch","lumoria_jungle"],
    wildMonsters:[
      {id:197, minLv:6, maxLv:9, rate:30}, // Photoworm
      {id:200, minLv:6, maxLv:9, rate:10}, // Iridibeetle
      {id:66, minLv:6, maxLv:9, rate:15},  // Viridix
      {id:69, minLv:6, maxLv:9, rate:25},  // Germix
      {id:84, minLv:7, maxLv:9, rate:20}   // Electrix
    ],
    ngPlusWildMonsters:[{id:446, minLv:6, maxLv:9, rate:12}], // NG+ family base: Sporelet
    hasGym:false, requiredBadges:1, mapPos:{x:50, y:58}
  },
  tidewatch: {
    id:"tidewatch", name:"Tidewatch Port", icon:"⛵", type:"city",
    desc:"A bustling port city on the coast. Gym Leader Marina commands the waves.",
    connections:["route2","route3","deep_trench"],
    wildMonsters:[
      {id:25, minLv:10, maxLv:13, rate:30}, // Reefling
      {id:28, minLv:10, maxLv:13, rate:30}, // Corelin
      {id:87, minLv:10, maxLv:12, rate:20}, // Amperix
      {id:42, minLv:11, maxLv:13, rate:20}  // Cryonik
    ],
    hasGym:true, gymLeader:"marina", requiredBadges:1, mapPos:{x:62, y:52}
  },
  route3: {
    id:"route3", name:"Route 3 - Coastal Shore", icon:"🏖️", type:"route",
    desc:"A rocky shoreline where Aquatic types thrive.",
    connections:["tidewatch","emberveil"],
    wildMonsters:[
      {id:25, minLv:14, maxLv:17, rate:25},
      {id:28, minLv:14, maxLv:17, rate:25},
      {id:101, minLv:14, maxLv:16, rate:25},
      {id:42, minLv:15, maxLv:17, rate:25}
    ],
    ngPlusWildMonsters:[{id:456, minLv:14, maxLv:17, rate:12}], // NG+ family base: Mistgill
    hasGym:false, requiredBadges:2, mapPos:{x:70, y:45}
  },
  emberveil: {
    id:"emberveil", name:"Emberveil City", icon:"🌋", type:"city",
    desc:"Built near an active volcano. The fiery Gym Leader Pyros waits within.",
    connections:["route3","route4","volcano_core","iron_canyon"],
    wildMonsters:[
      {id:16, minLv:18, maxLv:22, rate:35}, // Cindercula
      {id:13, minLv:18, maxLv:22, rate:10}, // Taurcin
      {id:10, minLv:18, maxLv:21, rate:30}, // Scorchlarva
      {id:191, minLv:19, maxLv:22, rate:25}  // Pebblet
    ],
    ngPlusWildMonsters:[{id:1, minLv:18, maxLv:22, rate:10}], // NG+-only: Solkin (fire starter line)
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
    ngPlusWildMonsters:[{id:414, minLv:22, maxLv:25, rate:12}], // NG+ family base: Grublurk
    hasGym:false, requiredBadges:3, mapPos:{x:65, y:28}
  },
  sparkmoor: {
    id:"sparkmoor", name:"Sparkmoor Town", icon:"⚡", type:"city",
    desc:"A town on the electric plains. Gym Leader Zara harnesses lightning power.",
    connections:["route4","route5","storm_plateau","thunder_cliffs"],
    wildMonsters:[
      {id:242, minLv:26, maxLv:30, rate:15}, // Pulseglow (obtainability fix)
      {id:81, minLv:26, maxLv:30, rate:25}, // Joltan
      {id:84, minLv:26, maxLv:30, rate:30}, // Electrix
      {id:90, minLv:27, maxLv:30, rate:20}, // Zephyrel
      {id:87, minLv:27, maxLv:30, rate:10}  // Amperix
    ],
    ngPlusWildMonsters:[{id:440, minLv:26, maxLv:29, rate:12}], // NG+ family base: Rustmite
    hasGym:true, gymLeader:"zara", requiredBadges:3, mapPos:{x:52, y:25}
  },
  route5: {
    id:"route5", name:"Route 5 - Thunder Plains", icon:"🌩️", type:"route",
    desc:"A wide open plain where storms are constant and Electric types roam freely.",
    connections:["sparkmoor","frostpeak","mirror_lake"],
    wildMonsters:[
      {id:209, minLv:30, maxLv:34, rate:10}, // Boltfur (obtainability fix)
      {id:81, minLv:30, maxLv:34, rate:25},
      {id:90, minLv:30, maxLv:34, rate:20},
      {id:111, minLv:31, maxLv:34, rate:30}, // Aeolin
      {id:182, minLv:31, maxLv:34, rate:15}  // Rotunden
    ],
    ngPlusWildMonsters:[{id:444, minLv:30, maxLv:33, rate:12}], // NG+ family base: Squeaklet
    hasGym:false, requiredBadges:4, mapPos:{x:42, y:22}
  },
  frostpeak: {
    id:"frostpeak", name:"Frostpeak Village", icon:"❄️", type:"city",
    desc:"A snow-covered village atop a frozen mountain. Ice Gym Leader Glacier awaits.",
    connections:["route5","route6","storm_plateau","crystal_depths","lunar_peak"],
    wildMonsters:[
      {id:47, minLv:34, maxLv:38, rate:25}, // Hexaprowl
      {id:50, minLv:34, maxLv:38, rate:30}, // Tundram
      {id:45, minLv:35, maxLv:38, rate:35}, // Slatis
      {id:53, minLv:35, maxLv:38, rate:10}  // Mistwhirl
    ],
    ngPlusWildMonsters:[{id:432, minLv:34, maxLv:37, rate:6}], // NG+ family base: Tusklet
    hasGym:true, gymLeader:"glacier", requiredBadges:4, mapPos:{x:32, y:18}
  },
  route6: {
    id:"route6", name:"Route 6 - Crystal Caverns", icon:"💎", type:"route",
    desc:"An icy cave system glittering with crystals. Ice and Rock types dwell here.",
    connections:["frostpeak","shadowmere"],
    wildMonsters:[
      {id:289, minLv:38, maxLv:42, rate:10}, // Bouncyblob (obtainability fix)
      {id:47, minLv:38, maxLv:42, rate:30},
      {id:51, minLv:38, maxLv:42, rate:15}, // Shiverling
      {id:195, minLv:39, maxLv:42, rate:20}, // Prismolith
      {id:53, minLv:39, maxLv:42, rate:25}
    ],
    ngPlusWildMonsters:[{id:435, minLv:38, maxLv:41, rate:12}], // NG+ family base: Knucklite
    hasGym:false, requiredBadges:5, mapPos:{x:22, y:25}
  },
  shadowmere: {
    id:"shadowmere", name:"Shadowmere City", icon:"🌑", type:"city",
    desc:"A city forever shrouded in shadow. Dark Gym Leader Nyx commands the night.",
    connections:["route6","route7","crystal_depths","haunted_grove"],
    wildMonsters:[
      {id:118, minLv:42, maxLv:46, rate:45}, // Eclipsehound
      {id:121, minLv:42, maxLv:46, rate:20}, // Spiraloom
      {id:123, minLv:43, maxLv:46, rate:35}  // Nocturil
    ],
    ngPlusWildMonsters:[{id:417, minLv:42, maxLv:45, rate:12}], // NG+ family base: Glacigeist
    hasGym:true, gymLeader:"nyx", requiredBadges:5, mapPos:{x:15, y:35}
  },
  route7: {
    id:"route7", name:"Route 7 - Poison Marshes", icon:"☠️", type:"route",
    desc:"A fetid swamp full of poison. Dark and Poison types are found in abundance.",
    connections:["shadowmere","skyvault","mystic_forest","fairy_meadow_north","poison_swamp_upper","wind_bridge"],
    wildMonsters:[
      {id:157, minLv:46, maxLv:50, rate:25}, // Acidelix
      {id:155, minLv:46, maxLv:50, rate:25}, // Toxirin
      {id:160, minLv:47, maxLv:50, rate:25}, // Miasmafly
      {id:121, minLv:47, maxLv:50, rate:25}  // Spiraloom
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:20, y:48}
  },
  skyvault: {
    id:"skyvault", name:"Skyvault City", icon:"🏰", type:"city",
    desc:"A city floating on clouds. Mental Gym Leader Oracle sees all futures.",
    connections:["route7","route8","mystic_forest","sky_harbor","wind_bridge"],
    wildMonsters:[
      {id:166, minLv:50, maxLv:54, rate:30}, // Projectery
      {id:142, minLv:50, maxLv:54, rate:25}, // Dawnirel
      {id:114, minLv:51, maxLv:54, rate:35}, // Nimbusel
      {id:168, minLv:51, maxLv:54, rate:10}  // Espelith
    ],
    ngPlusWildMonsters:[{id:460, minLv:50, maxLv:53, rate:12}], // NG+ family base: Gongling
    hasGym:true, gymLeader:"oracle", requiredBadges:6, mapPos:{x:30, y:55}
  },
  route8: {
    id:"route8", name:"Route 8 - Sky Corridors", icon:"🌤️", type:"route",
    desc:"Aerial paths between floating islands. Wind and Mental types soar here.",
    connections:["skyvault","dragonspire","wind_bridge"],
    wildMonsters:[
      {id:108, minLv:54, maxLv:58, rate:34}, // Silvergust
      {id:112, minLv:54, maxLv:58, rate:29}, // Swirlavel
      {id:171, minLv:55, maxLv:58, rate:24}, // Drakorius
      {id:177, minLv:55, maxLv:58, rate:10}, // Sapphier
      {id:128, minLv:55, maxLv:58, rate:3}   // Cranivade
    ],
    hasGym:false, requiredBadges:7, mapPos:{x:42, y:50}
  },
  dragonspire: {
    id:"dragonspire", name:"Dragonspire Peak", icon:"🐉", type:"city",
    desc:"The highest peak in Lumoria. Draconic Gym Leader Drake commands ancient power.",
    connections:["route8","route9"],
    wildMonsters:[
      {id:235, minLv:58, maxLv:62, rate:10}, // Glintscale (obtainability fix)
      {id:172, minLv:58, maxLv:62, rate:30}, // Scalurin
      {id:175, minLv:58, maxLv:62, rate:20}, // Biolumal
      {id:176, minLv:59, maxLv:62, rate:25}, // Chromena
      {id:177, minLv:59, maxLv:62, rate:15}  // Sapphier
    ],
    hasGym:true, gymLeader:"drake", requiredBadges:7, mapPos:{x:55, y:42},
    legendaryEncounter:{monsterId:84, level:60}
  },
  victoryroad: {
    id:"victoryroad", name:"The Gauntlet", icon:"⚔️", type:"route",
    desc:"The final gauntlet. Only trainers with all 16 badges may pass.",
    connections:["starbloom","summit"],
    wildMonsters:[
      {id:173, minLv:62, maxLv:66, rate:25}, // Serpenthos
      {id:124, minLv:62, maxLv:66, rate:25}, // Phantorvex
      {id:143, minLv:62, maxLv:66, rate:25}, // Lunarael
      {id:151, minLv:63, maxLv:66, rate:25}  // Alloytron
    ],
    ngPlusWildMonsters:[{id:382, minLv:63, maxLv:66, rate:8}], // thinned from mega-area
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
      {id:260, minLv:10, maxLv:13, rate:18}, // Sproutix (obtainability fix)
      {id:63, minLv:8, maxLv:12, rate:14},   // Sporix
      {id:66, minLv:8, maxLv:12, rate:28},   // Viridix
      {id:140, minLv:9, maxLv:12, rate:24},   // Faeling
      {id:155, minLv:9, maxLv:13, rate:8},   // Toxirin
      {id:160, minLv:10, maxLv:13, rate:8}   // Miasmafly
    ],
    ngPlusWildMonsters:[{id:411, minLv:9, maxLv:12, rate:12}], // NG+ family base: Thrumquill
    hasGym:false, requiredBadges:1, mapPos:{x:56, y:68}
  },
  ancient_ruins: {
    id:"ancient_ruins", name:"Ancient Ruins", icon:"🏛️", type:"route",
    desc:"Crumbling temples from a forgotten civilization. Mental and Dark energies fill the air. The Umbra Order has been spotted here.",
    connections:["lumoria_jungle","bug_forest_east","reef_ruins"],
    wildMonsters:[
      {id:22, minLv:13, maxLv:17, rate:30}, // Hallucigaze (obtainability fix)
      {id:142, minLv:12, maxLv:16, rate:20},  // Dawnirel
      {id:124, minLv:13, maxLv:17, rate:10},  // Phantorvex
      {id:168, minLv:14, maxLv:17, rate:15},  // Espelith
      {id:166, minLv:14, maxLv:17, rate:25}   // Projectery
    ],
    ngPlusWildMonsters:[{id:448, minLv:12, maxLv:16, rate:12}], // NG+ family base: Cobblepup
    hasGym:false, requiredBadges:1, mapPos:{x:64, y:76},
    storyLocation:true, hasUmbraEncounter:true,
    legendaryEncounter:{monsterId:165, level:55}
  },
  deep_trench: {
    id:"deep_trench", name:"Abyssal Trench", icon:"🌊", type:"route",
    desc:"The deepest part of Lumoria's ocean. Aquatic and Draconic types of terrifying power lurk here. The Umbra Order seeks something ancient in these depths.",
    connections:["tidewatch","coral_reef","sunken_temple"],
    wildMonsters:[
      {id:230, minLv:20, maxLv:24, rate:18}, // Scaleling (obtainability fix)
      {id:85, minLv:18, maxLv:24, rate:14},  // Shockharpe
      {id:33, minLv:18, maxLv:24, rate:6},  // Septanemone
      {id:19, minLv:19, maxLv:24, rate:28},  // Magmaurin
      {id:17, minLv:20, maxLv:25, rate:10},  // Searburn
      {id:98, minLv:20, maxLv:25, rate:24}   // Aridix
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
      {id:277, minLv:24, maxLv:29, rate:24}, // Magmite (obtainability fix)
      {id:15, minLv:22, maxLv:28, rate:12},  // Pyroclasm
      {id:13, minLv:22, maxLv:28, rate:28},  // Taurcin
      {id:38, minLv:23, maxLv:28, rate:12},  // Titanariel
      {id:97, minLv:24, maxLv:29, rate:12},  // Tectonvast
      {id:15, minLv:24, maxLv:29, rate:12}   // Pyroclasm
    ],
    hasGym:false, requiredBadges:3, mapPos:{x:82, y:42},
    storyLocation:true, hasUmbraEncounter:true,
    legendaryEncounter:{monsterId:106, level:50}
  },
  storm_plateau: {
    id:"storm_plateau", name:"Storm Plateau", icon:"⛈️", type:"route",
    desc:"A high plateau perpetually wracked by storms. Electric and Draconic types are drawn to its crackling energy.",
    connections:["sparkmoor","frostpeak","lunar_peak","mirror_lake","thunder_cliffs"],
    wildMonsters:[
      {id:86, minLv:28, maxLv:34, rate:25},  // Galvaglide
      {id:42, minLv:28, maxLv:34, rate:25},  // Cryonik
      {id:31, minLv:29, maxLv:34, rate:25},  // Toxaquil
      {id:44, minLv:29, maxLv:34, rate:15},  // Nagislither
      {id:33, minLv:30, maxLv:35, rate:10}   // Septanemone
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
      {id:211, minLv:34, maxLv:38, rate:28}, // Cinderfrost (obtainability fix)
      {id:177, minLv:34, maxLv:40, rate:6},  // Sapphier
      {id:195, minLv:34, maxLv:40, rate:24},  // Prismolith
      {id:152, minLv:35, maxLv:40, rate:10},  // Imperion
      {id:201, minLv:36, maxLv:41, rate:18}, // Scarabion
      {id:54, minLv:36, maxLv:41, rate:14}   // Arcturex
    ],
    ngPlusWildMonsters:[{id:408, minLv:36, maxLv:40, rate:6}], // NG+ family base: Glimmerling
    hasGym:false, requiredBadges:5, mapPos:{x:10, y:28}
  },
  mystic_forest: {
    id:"mystic_forest", name:"Mystic Forest", icon:"🌌", type:"route",
    desc:"A forest where the boundary between worlds is thin. Fairy and Mental creatures drift between the trees. The Umbra Order's hideout is rumoured to be nearby.",
    connections:["route7","skyvault","sky_harbor","umbra_base"],
    wildMonsters:[
      {id:143, minLv:46, maxLv:52, rate:6},  // Lunarael
      {id:141, minLv:46, maxLv:52, rate:24},  // Iridesoar
      {id:169, minLv:47, maxLv:52, rate:10},  // Aurarael
      {id:115, minLv:48, maxLv:52, rate:28},  // Aetherworn
      {id:122, minLv:48, maxLv:52, rate:14},  // Caveshroud
      {id:170, minLv:46, maxLv:52, rate:18}   // Oneiron
    ],
    ngPlusWildMonsters:[{id:429, minLv:46, maxLv:49, rate:12}], // NG+ family base: Lullasnout
    hasGym:false, requiredBadges:6, mapPos:{x:25, y:62},
    storyLocation:true, hasUmbraEncounter:true
  },
  umbra_base: {
    id:"umbra_base", name:"The Umbra Order Base", icon:"☠️", type:"special",
    desc:"The hidden fortress of The Umbra Order. Their leader, Commander Shade, awaits you here. This is your chance to stop their plan to awaken the three Legendaries.",
    connections:["mystic_forest","dark_canyon"],
    wildMonsters:[
      {id:119, minLv:50, maxLv:55, rate:25},  // Dreadmaw
      {id:124, minLv:50, maxLv:55, rate:25},  // Phantorvex
      {id:122, minLv:51, maxLv:55, rate:25},  // Caveshroud
      {id:158, minLv:51, maxLv:55, rate:25}   // Corrodisc
    ],
    hasGym:false, requiredBadges:6,
    hasUmbraBase:true,
    mapPos:{x:12, y:58}
  },

  // ===== NEW AREAS =====
  coral_reef: {
    id:"coral_reef", name:"Coral Reef", icon:"🪸", type:"route",
    desc:"A stunning underwater coral garden teeming with colorful Aquatic and Poison types. Sunlight filters through the shimmering water above.",
    connections:["deep_trench","reef_ruins","sunken_temple"],
    wildMonsters:[
      {id:256, minLv:24, maxLv:28, rate:13}, // Scolphin (obtainability fix)
      {id:34, minLv:22, maxLv:26, rate:25}, // Pearlith (obtainability fix)
      {id:28, minLv:22, maxLv:28, rate:20},   // Corelin
      {id:25, minLv:22, maxLv:28, rate:11},   // Reefling
      {id:31, minLv:23, maxLv:28, rate:16},  // Toxaquil
      {id:155, minLv:24, maxLv:29, rate:9},   // Toxirin
      {id:39, minLv:25, maxLv:30, rate:6}   // Gossafin
    ],
    ngPlusWildMonsters:[{id:450, minLv:22, maxLv:26, rate:12}], // NG+ family base: Jabshell
    hasGym:false, requiredBadges:2, mapPos:{x:84, y:72}
  },
  haunted_grove: {
    id:"haunted_grove", name:"Haunted Grove", icon:"👻", type:"route",
    desc:"A twisted forest where ancient trees whisper in the dark. Spectral-like shadows drift between the gnarled branches.",
    connections:["shadowmere","spirit_canyon"],
    wildMonsters:[
      {id:78, minLv:42, maxLv:46, rate:10}, // Sylvnox (obtainability fix)
      {id:118, minLv:42, maxLv:47, rate:24},   // Eclipsehound
      {id:121, minLv:42, maxLv:47, rate:14},   // Spiraloom
      {id:126, minLv:43, maxLv:48, rate:28},  // Impefurr
      {id:123, minLv:44, maxLv:48, rate:18},   // Nocturil
      {id:130, minLv:45, maxLv:50, rate:6}   // Necralia
    ],
    ngPlusWildMonsters:[{id:454, minLv:43, maxLv:47, rate:12}], // NG+ family base: Tollwisp
    hasGym:false, requiredBadges:5, mapPos:{x:8, y:42}
  },
  sky_harbor: {
    id:"sky_harbor", name:"Sky Harbor", icon:"⛵", type:"town",
    desc:"A floating dock tethered to the clouds. Wind traders and Mental navigators pass through this breezy waystation.",
    connections:["skyvault","mystic_forest"],
    wildMonsters:[
      {id:108, minLv:48, maxLv:53, rate:25},   // Silvergust
      {id:114, minLv:48, maxLv:53, rate:15},   // Nimbusel
      {id:116, minLv:49, maxLv:54, rate:20},  // Zephyrin
      {id:141, minLv:50, maxLv:54, rate:10},   // Iridesoar
      {id:111, minLv:49, maxLv:53, rate:30}    // Aeolin
    ],
    hasGym:false, requiredBadges:6, mapPos:{x:18, y:62}
  },
  thunder_cliffs: {
    id:"thunder_cliffs", name:"Thunder Cliffs", icon:"⚡", type:"route",
    desc:"Sheer cliff faces perpetually struck by lightning. Electric energy crackles through every rock and stone here.",
    connections:["sparkmoor","storm_plateau"],
    wildMonsters:[
      {id:247, minLv:30, maxLv:36, rate:10}, // Sparkeen (obtainability fix)
      {id:81, minLv:28, maxLv:34, rate:28},   // Joltan
      {id:90, minLv:28, maxLv:34, rate:24},   // Zephyrel
      {id:92, minLv:29, maxLv:34, rate:18},  // Arcspine
      {id:85, minLv:30, maxLv:35, rate:14},   // Shockharpe
      {id:176, minLv:31, maxLv:36, rate:6}    // Chromena
    ],
    hasGym:false, requiredBadges:4, mapPos:{x:60, y:16}
  },
  poison_swamp_upper: {
    id:"poison_swamp_upper", name:"Poison Swamp Upper", icon:"🌿", type:"route",
    desc:"The upper reaches of the Poison Swamp, where toxic fumes seep from cracks in the earth near the marshes of Route 7.",
    connections:["route7","poison_swamp_lower"],
    wildMonsters:[
      {id:71, minLv:44, maxLv:49, rate:30},   // Verdovast
      {id:73, minLv:44, maxLv:49, rate:35},   // Faelomis
      {id:75, minLv:45, maxLv:50, rate:35}    // Sylvolt
    ],
    ngPlusWildMonsters:[{id:442, minLv:44, maxLv:48, rate:12}], // NG+ family base: Bloatleech
    hasGym:false, requiredBadges:6, mapPos:{x:30, y:56}
  },
  poison_swamp_lower: {
    id:"poison_swamp_lower", name:"Poison Swamp Lower", icon:"🌿", type:"route",
    desc:"The deeper, fouler reaches of the Poison Swamp. The air is thick with noxious miasma and stronger Poison types lurk in the muck.",
    connections:["poison_swamp_upper","lumoria_jungle"],
    wildMonsters:[
      {id:75, minLv:46, maxLv:51, rate:45},   // Sylvolt
      {id:119, minLv:47, maxLv:52, rate:35},  // Dreadmaw
      {id:74, minLv:48, maxLv:53, rate:20}    // Faevernal
    ],
    ngPlusWildMonsters:[{id:336, minLv:48, maxLv:53, rate:10}], // NG+ standalone: Coilstrike
    hasGym:false, requiredBadges:6, mapPos:{x:42, y:70}
  },
  sunken_temple: {
    id:"sunken_temple", name:"Sunken Temple", icon:"🏛️", type:"special",
    desc:"An ancient temple half-submerged beneath the ocean. Mental inscriptions glow on the walls. Something powerful sleeps in the inner sanctum.",
    connections:["deep_trench","coral_reef"],
    wildMonsters:[
      {id:175, minLv:25, maxLv:32, rate:9},   // Biolumal
      {id:166, minLv:25, maxLv:32, rate:31},   // Projectery
      {id:37, minLv:26, maxLv:33, rate:23},  // Coralossus
      {id:168, minLv:27, maxLv:33, rate:27},   // Espelith
      {id:169, minLv:35, maxLv:40, rate:10}    // Aurarael (rare!)
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:88, y:52},
    storyLocation:true, hasUmbraEncounter:true
  },
  iron_canyon: {
    id:"iron_canyon", name:"Iron Canyon", icon:"⛏️", type:"route",
    desc:"A deep canyon carved by centuries of volcanic flow. The walls glint with veins of metal ore. Metal and Ground types dominate this harsh terrain.",
    connections:["volcano_core","emberveil","lava_fields"],
    wildMonsters:[
      {id:147, minLv:25, maxLv:31, rate:25},   // Scrapsapien
      {id:191, minLv:25, maxLv:31, rate:25},   // Pebblet
      {id:134, minLv:26, maxLv:32, rate:20},  // Aeronyx
      {id:150, minLv:27, maxLv:32, rate:20},   // Gearon
      {id:152, minLv:28, maxLv:33, rate:10}    // Imperion
    ],
    ngPlusWildMonsters:[{id:423, minLv:25, maxLv:29, rate:12}], // NG+ family base: Pebblite
    hasGym:false, requiredBadges:3, mapPos:{x:88, y:30},
    legendaryEncounter:{monsterId:167, level:55}
  },
  fairy_meadow_south: {
    id:"fairy_meadow_south", name:"Fairy Meadow South", icon:"🌸", type:"route",
    desc:"The southern stretch of Fairy Meadow, where gentle flowers bloom near Seedvale. Fairy and Grass types play in the warm breeze.",
    connections:["seedvale","fairy_meadow_north","spirit_canyon"],
    wildMonsters:[
      {id:137, minLv:4, maxLv:7, rate:30},     // Goldefluff
      {id:69, minLv:4, maxLv:7, rate:35},     // Germix
      {id:111, minLv:5, maxLv:8, rate:35}     // Aeolin
    ],
    ngPlusWildMonsters:[{id:438, minLv:5, maxLv:8, rate:12}], // NG+ family base: Chimelet
    hasGym:false, requiredBadges:0, mapPos:{x:8, y:68}
  },
  fairy_meadow_north: {
    id:"fairy_meadow_north", name:"Fairy Meadow North", icon:"🌸", type:"route",
    desc:"The northern stretch of Fairy Meadow leading toward the Poison Marshes. Stronger Fairy types guard this path.",
    connections:["fairy_meadow_south","route7"],
    wildMonsters:[
      {id:286, minLv:8, maxLv:11, rate:25}, // Fuzzlet (obtainability fix)
      {id:137, minLv:6, maxLv:10, rate:30},    // Goldefluff
      {id:140, minLv:7, maxLv:11, rate:10},   // Faeling
      {id:111, minLv:7, maxLv:11, rate:35}    // Aeolin
    ],
    hasGym:false, requiredBadges:0, mapPos:{x:8, y:48}
  },
  lunar_peak: {
    id:"lunar_peak", name:"Lunar Peak", icon:"🌙", type:"route",
    desc:"A remote mountain summit bathed in perpetual moonlight. Ice and Draconic types roam freely under the silver glow.",
    connections:["frostpeak","storm_plateau","crystal_spire"],
    wildMonsters:[
      {id:47, minLv:36, maxLv:42, rate:30},   // Hexaprowl
      {id:177, minLv:36, maxLv:42, rate:10},   // Sapphier
      {id:53, minLv:37, maxLv:43, rate:25},   // Mistwhirl
      {id:59, minLv:38, maxLv:44, rate:20},  // Lunaveris
      {id:54, minLv:40, maxLv:46, rate:15}    // Arcturex
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:20, y:10}
  },
  bug_forest_west: {
    id:"bug_forest_west", name:"Bug Forest West", icon:"🐛", type:"route",
    desc:"The western edge of the Bug Forest, thick with webs and buzzing wings. Connects to the Lumoria Jungle.",
    connections:["lumoria_jungle","bug_forest_east"],
    wildMonsters:[
      {id:197, minLv:10, maxLv:14, rate:45},  // Photoworm
      {id:200, minLv:10, maxLv:14, rate:20},  // Iridibeetle
      {id:84, minLv:11, maxLv:15, rate:35}    // Electrix
    ],
    ngPlusWildMonsters:[{id:426, minLv:10, maxLv:14, rate:12}], // NG+ family base: Pummelo
    hasGym:false, requiredBadges:1, mapPos:{x:50, y:74}
  },
  bug_forest_east: {
    id:"bug_forest_east", name:"Bug Forest East", icon:"🐛", type:"route",
    desc:"The deeper eastern reaches of the Bug Forest. Stronger bugs and rare species inhabit the ancient trees near the ruins.",
    connections:["bug_forest_west","ancient_ruins"],
    wildMonsters:[
      {id:200, minLv:12, maxLv:17, rate:35},  // Iridibeetle
      {id:123, minLv:13, maxLv:18, rate:20},  // Nocturil
      {id:10, minLv:14, maxLv:19, rate:45}    // Scorchlarva
    ],
    hasGym:false, requiredBadges:1, mapPos:{x:56, y:76}
  },
  mirror_lake: {
    id:"mirror_lake", name:"Mirror Lake", icon:"🪞", type:"route",
    desc:"A perfectly still alpine lake with a surface like polished glass. The reflected sky makes it impossible to tell up from down.",
    connections:["route5","storm_plateau"],
    wildMonsters:[
      {id:189, minLv:30, maxLv:34, rate:16}, // Woolcalm (obtainability fix)
      {id:45, minLv:30, maxLv:36, rate:24},   // Slatis
      {id:50, minLv:30, maxLv:36, rate:16},   // Tundram
      {id:137, minLv:31, maxLv:36, rate:28},   // Goldefluff
      {id:57, minLv:32, maxLv:38, rate:10},  // Speculith
      {id:43, minLv:34, maxLv:39, rate:6}    // Boreon
    ],
    ngPlusWildMonsters:[{id:420, minLv:30, maxLv:34, rate:12}], // NG+ family base: Mistling
    hasGym:false, requiredBadges:4, mapPos:{x:48, y:14}
  },
  lava_fields: {
    id:"lava_fields", name:"Lava Fields", icon:"🌋", type:"route",
    desc:"A smoldering expanse of hardened lava and glowing fissures. The ground cracks underfoot and fire vents belch superheated air.",
    connections:["volcano_core","iron_canyon"],
    wildMonsters:[
      {id:253, minLv:28, maxLv:34, rate:6}, // Ashrock (obtainability fix)
      {id:13, minLv:26, maxLv:32, rate:28},   // Taurcin
      {id:17, minLv:26, maxLv:32, rate:14},   // Searburn
      {id:19, minLv:27, maxLv:33, rate:24},  // Magmaurin
      {id:14, minLv:28, maxLv:34, rate:10},   // Molteroth
      {id:192, minLv:29, maxLv:34, rate:18}    // Boulderoll
    ],
    hasGym:false, requiredBadges:3, mapPos:{x:82, y:26}
  },
  spirit_canyon: {
    id:"spirit_canyon", name:"Spirit Canyon", icon:"🌀", type:"route",
    desc:"A deep chasm where psychic resonance amplifies every thought and memory. The walls seem to shift and breathe.",
    connections:["haunted_grove","fairy_meadow_south","dark_canyon"],
    wildMonsters:[
      {id:166, minLv:44, maxLv:50, rate:35},   // Projectery
      {id:123, minLv:46, maxLv:51, rate:50},   // Nocturil
      {id:167, minLv:47, maxLv:52, rate:15}    // Psychovast
    ],
    hasGym:false, requiredBadges:5, mapPos:{x:6, y:52}
  },
  reef_ruins: {
    id:"reef_ruins", name:"Reef Ruins", icon:"🏛️", type:"special",
    desc:"Ancient steel structures submerged beneath the sea, overgrown with coral. A forgotten civilization once thrived here beneath the waves.",
    connections:["coral_reef","ancient_ruins"],
    wildMonsters:[
      {id:214, minLv:36, maxLv:42, rate:8}, // Petrwave (obtainability fix)
      {id:26, minLv:28, maxLv:35, rate:18},   // Aquidon
      {id:193, minLv:28, maxLv:35, rate:28},   // Rugothon
      {id:37, minLv:29, maxLv:36, rate:24},  // Coralossus
      {id:152, minLv:30, maxLv:36, rate:14},   // Imperion
      {id:41, minLv:35, maxLv:42, rate:8}   // Titanomare
    ],
    hasGym:false, requiredBadges:2, mapPos:{x:76, y:76},
    storyLocation:true, hasUmbraEncounter:true
  },
  wind_bridge: {
    id:"wind_bridge", name:"Wind Bridge", icon:"🌬️", type:"route",
    desc:"A series of ancient stone arches bridging floating islands in the sky. Powerful updrafts make travel treacherous but the view is breathtaking.",
    connections:["route7","route8","skyvault"],
    wildMonsters:[
      {id:111, minLv:48, maxLv:54, rate:25},   // Aeolin
      {id:108, minLv:48, maxLv:54, rate:25},   // Silvergust
      {id:112, minLv:49, maxLv:55, rate:20},   // Swirlavel
      {id:116, minLv:50, maxLv:55, rate:20},  // Zephyrin
      {id:109, minLv:51, maxLv:56, rate:10}    // Siroccomane
    ],
    ngPlusWildMonsters:[{id:458, minLv:48, maxLv:52, rate:12}], // NG+ family base: Gustling
    hasGym:false, requiredBadges:6, mapPos:{x:36, y:40}
  },
  crystal_spire: {
    id:"crystal_spire", name:"Crystal Spire", icon:"💎", type:"special",
    desc:"A towering spire of pure crystal ice and steel that catches the moonlight. Few trainers have ever climbed to its pinnacle.",
    connections:["crystal_depths","lunar_peak"],
    wildMonsters:[
      {id:51, minLv:38, maxLv:45, rate:15},   // Shiverling
      {id:195, minLv:38, maxLv:45, rate:25},   // Prismolith
      {id:148, minLv:39, maxLv:46, rate:10},   // Stoicguard
      {id:55, minLv:40, maxLv:47, rate:30},  // Rimeling
      {id:201, minLv:42, maxLv:48, rate:20}   // Scarabion
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
      {id:119, minLv:50, maxLv:56, rate:20},   // Dreadmaw
      {id:122, minLv:50, maxLv:56, rate:10},   // Caveshroud
      {id:126, minLv:51, maxLv:57, rate:30},  // Impefurr
      {id:124, minLv:52, maxLv:57, rate:15},   // Phantorvex
      {id:130, minLv:53, maxLv:58, rate:25}   // Necralia
    ],
    ngPlusWildMonsters:[{id:371, minLv:52, maxLv:58, rate:10}], // NG+ standalone: Nullform
    hasGym:false, requiredBadges:6, mapPos:{x:4, y:60},
    legendaryEncounter:{monsterId:166, level:55}
  },
  // ---- NEW ROUTES & GYM CITIES (badges 8-15) ----
  route9: {
    id:"route9", name:"Route 9 - Verdant Trail", icon:"🌿", type:"route",
    desc:"A lush overgrown trail leading south from Dragonspire. Grass and Bug types thrive here.",
    connections:["dragonspire","bloomhaven"],
    wildMonsters:[
      {id:7, minLv:55, maxLv:60, rate:15},
      {id:66, minLv:55, maxLv:60, rate:20},
      {id:197, minLv:55, maxLv:60, rate:30},
      {id:72, minLv:56, maxLv:61, rate:25},
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
      {id:70, minLv:56, maxLv:60, rate:25},
      {id:73, minLv:57, maxLv:61, rate:10},
      {id:75, minLv:58, maxLv:62, rate:35}
    ],
    ngPlusWildMonsters:[{id:452, minLv:56, maxLv:60, rate:12}], // NG+ family base: Dozit
    hasGym:true, gymLeader:"thorne", requiredBadges:8, mapPos:{x:55, y:55}
  },
  route10: {
    id:"route10", name:"Route 10 - Toxic Passage", icon:"☠️", type:"route",
    desc:"A murky swamp path where poisonous fumes rise from the ground.",
    connections:["bloomhaven","murk_crossing"],
    wildMonsters:[
      {id:155, minLv:57, maxLv:62, rate:10},  // Toxirin (base)
      {id:157, minLv:57, maxLv:62, rate:17},  // Acidelix (base)
      {id:160, minLv:58, maxLv:63, rate:9},  // Miasmafly (base)
      {id:161, minLv:59, maxLv:64, rate:5},  // Mistbane (mid → after base ✓)
      {id:162, minLv:58, maxLv:63, rate:14},  // Marlix (base)
      {id:163, minLv:59, maxLv:64, rate:7},  // Blightalis (mid → after base ✓)
      {id:206, minLv:57, maxLv:62, rate:12},  // Venomscale (base Poison/Draconic)
      {id:266, minLv:57, maxLv:62, rate:21},  // Shadowpup (base Dark)
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
      {id:159, minLv:60, maxLv:65, rate:25},  // Dissotoad (final, 158 on murk_crossing ✓)
      {id:163, minLv:59, maxLv:64, rate:25},  // Blightalis (mid, 162 on route10 ✓)
      {id:165, minLv:59, maxLv:64, rate:25}   // Venowarn (mid, 164 on murk_crossing ✓)
    ],
    hasGym:true, gymLeader:"viper", requiredBadges:9, mapPos:{x:42, y:65},
    ngPlusWildMonsters:[{id:322,minLv:65,maxLv:70,rate:25},{id:324,minLv:65,maxLv:70,rate:15}]
  },
  route11: {
    id:"route11", name:"Route 11 - Tremor Pass", icon:"🏔️", type:"route",
    desc:"A rumbling mountain pass where the ground never stops shaking.",
    connections:["miasmacity","quake_foothills"],
    wildMonsters:[
      {id:95,  minLv:59, maxLv:64, rate:11},  // Dustkin (base)
      {id:98,  minLv:59, maxLv:64, rate:7},  // Aridix (base)
      {id:101, minLv:59, maxLv:64, rate:13},  // Limoux (base)
      {id:104, minLv:60, maxLv:65, rate:22},  // Arenikin (base)
      {id:105, minLv:61, maxLv:66, rate:5},  // Dravanas (mid → after 104 ✓)
      {id:106, minLv:60, maxLv:65, rate:15},  // Geodrak (base)
      {id:236, minLv:59, maxLv:64, rate:9},  // Frostick (base Ice)
      {id:248, minLv:59, maxLv:64, rate:18}   // Pebblard (base Rock)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:35, y:72},
    ngPlusWildMonsters:[{id:361, minLv:60, maxLv:66, rate:10}, {id:325,minLv:66,maxLv:72,rate:20},{id:327,minLv:66,maxLv:72,rate:15},{id:329,minLv:67,maxLv:73,rate:10}]
  },
  terravault: {
    id:"terravault", name:"Terravault City", icon:"⛏️", type:"city",
    desc:"A city carved into a mountainside, rich with mineral deposits. Home to Gym Leader Atlas.",
    connections:["tremor_summit","route12"],
    wildMonsters:[
      {id:97,  minLv:61, maxLv:66, rate:15},  // Tectonvast (final, 96 on quake_foothills ✓)
      {id:100, minLv:61, maxLv:66, rate:15},  // Craterlurk (final, 99 on quake_foothills ✓)
      {id:103, minLv:61, maxLv:66, rate:15},  // Calciderm (final, 102 on quake_foothills ✓)
      {id:105, minLv:61, maxLv:66, rate:30},  // Dravanas (final, 104 on route11 ✓)
      {id:107, minLv:62, maxLv:67, rate:25}   // Quakeon (final, 106 on route11 ✓)
    ],
    hasGym:true, gymLeader:"atlas", requiredBadges:10, mapPos:{x:28, y:78},
    ngPlusWildMonsters:[{id:353, minLv:63, maxLv:67, rate:9}, {id:327,minLv:67,maxLv:72,rate:25},{id:337,minLv:67,maxLv:72,rate:15}]
  },
  route12: {
    id:"route12", name:"Route 12 - Silk Road", icon:"🕸️", type:"route",
    desc:"A path threaded with giant webs. Bug types ambush travelers at every turn.",
    connections:["terravault","fungal_cavern"],
    wildMonsters:[
      {id:197, minLv:61, maxLv:66, rate:25},  // Photoworm (base)
      {id:198, minLv:62, maxLv:67, rate:20},  // Chrysalix (mid → after 197 ✓)
      {id:200, minLv:61, maxLv:66, rate:9},  // Iridibeetle (base)
      {id:202, minLv:62, maxLv:67, rate:6},  // Sculptweave (base)
      {id:204, minLv:63, maxLv:68, rate:13},  // Muddite (base)
      {id:215, minLv:62, maxLv:67, rate:16},  // Veilwisp (base Mental)
      {id:262, minLv:62, maxLv:67, rate:11}   // Transluceed (base Grass/Poi)
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:22, y:82},
    ngPlusWildMonsters:[{id:391, minLv:64, maxLv:68, rate:8}, {id:324,minLv:68,maxLv:74,rate:20},{id:329,minLv:68,maxLv:74,rate:15},{id:339,minLv:69,maxLv:75,rate:10},{id:402,minLv:68,maxLv:74,rate:8},{id:405,minLv:68,maxLv:74,rate:8}]
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
    ngPlusWildMonsters:[{id:357, minLv:63, maxLv:69, rate:10}, {id:330,minLv:68,maxLv:74,rate:25},{id:331,minLv:68,maxLv:74,rate:20},{id:326,minLv:68,maxLv:74,rate:10},{id:402,minLv:69,maxLv:75,rate:6},{id:405,minLv:69,maxLv:75,rate:6}]
  },
  route13: {
    id:"route13", name:"Route 13 - Gale Ridge West", icon:"🌬️", type:"route",
    desc:"The western arm of Gale Ridge, where howling winds funnel through a narrow canyon toward the furthest point of the region.",
    connections:["silkwood","wind_hollow"],
    wildMonsters:[
      {id:108, minLv:63, maxLv:68, rate:16},  // Silvergust (base)
      {id:109, minLv:64, maxLv:69, rate:5},  // Siroccomane (mid → after 108 ✓)
      {id:111, minLv:63, maxLv:68, rate:21},  // Aeolin (base)
      {id:114, minLv:64, maxLv:69, rate:8},  // Nimbusel (base)
      {id:116, minLv:64, maxLv:69, rate:10},  // Zephyrin (base)
      {id:61,  minLv:65, maxLv:70, rate:12},  // wind-type standalone
      {id:291, minLv:63, maxLv:68, rate:7},  // Breezekin (base Wind)
      {id:222, minLv:63, maxLv:68, rate:16},  // Mindpuff (base Mental)
      {id:220, minLv:63, maxLv:68, rate:5}    // Umbrajest (base Dark/Mental)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:10, y:92},
    ngPlusWildMonsters:[{id:356, minLv:64, maxLv:70, rate:9}, {id:335,minLv:70,maxLv:76,rate:20},{id:348,minLv:70,maxLv:76,rate:15},{id:370,minLv:71,maxLv:77,rate:10}]
  },
  gusthaven: {
    id:"gusthaven", name:"Gusthaven Town", icon:"🌀", type:"city",
    desc:"A town of windmills and airships. Home to Gym Leader Zephyra, master of Wind types.",
    connections:["tempest_cliffs","route14"],
    wildMonsters:[
      {id:110, minLv:65, maxLv:70, rate:13},  // Aeolarch (final)
      {id:113, minLv:65, maxLv:70, rate:12},  // Cyclavorn (final)
      {id:115, minLv:65, maxLv:70, rate:25},  // Aetherworn (mid)
      {id:117, minLv:65, maxLv:70, rate:20},  // Pneumathos (mid)
      {id:62,  minLv:66, maxLv:70, rate:30}   // standalone
    ],
    hasGym:true, gymLeader:"zephyra", requiredBadges:12, mapPos:{x:18, y:95},
    ngPlusWildMonsters:[{id:338, minLv:66, maxLv:70, rate:10}, {id:335,minLv:71,maxLv:76,rate:25},{id:370,minLv:71,maxLv:76,rate:15}]
  },
  route14: {
    id:"route14", name:"Route 14 - Ironwork Path", icon:"⚙️", type:"route",
    desc:"A path lined with abandoned machinery. Metal types have claimed the ruins as their territory.",
    connections:["gusthaven","ash_fields"],
    wildMonsters:[
      {id:147, minLv:65, maxLv:70, rate:21},  // Scrapsapien (base)
      {id:148, minLv:66, maxLv:71, rate:5},  // Stoicguard (mid → after 147 ✓)
      {id:150, minLv:65, maxLv:70, rate:14},  // Gearon (base)
      {id:134, minLv:66, maxLv:71, rate:12},  // Aeronyx (base)
      {id:153, minLv:66, maxLv:71, rate:17},  // Dentshaft (base)
      {id:55,  minLv:67, maxLv:72, rate:9},  // standalone steel
      {id:278, minLv:65, maxLv:70, rate:10},  // Ironling (base Metal/Fairy)
      {id:244, minLv:65, maxLv:70, rate:7},  // Staticlaw (base Electric)
      {id:280, minLv:65, maxLv:70, rate:5}    // Gearbit (base Metal/Ground)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:28, y:92},
    ngPlusWildMonsters:[{id:383, minLv:66, maxLv:72, rate:8}, {id:334,minLv:72,maxLv:78,rate:20},{id:347,minLv:72,maxLv:78,rate:15},{id:366,minLv:73,maxLv:79,rate:10}]
  },
  ironforge: {
    id:"ironforge", name:"Ironforge City", icon:"🔨", type:"city",
    desc:"A city of foundries and forges. Home to Gym Leader Ferro, master of Metal types.",
    connections:["forge_approach","route15"],
    wildMonsters:[
      {id:149, minLv:67, maxLv:72, rate:13},  // Eternarmor (final)
      {id:151, minLv:66, maxLv:71, rate:25},  // Alloytron (mid)
      {id:152, minLv:67, maxLv:72, rate:20},  // Imperion (Metal/Rock)
      {id:135, minLv:67, maxLv:72, rate:30},  // Steelvex (mid, 134 on route14 ✓)
      {id:136, minLv:68, maxLv:73, rate:12}   // Metalibat (final → after 135 ✓)
    ],
    hasGym:true, gymLeader:"ferro", requiredBadges:13, mapPos:{x:38, y:88},
    ngPlusWildMonsters:[{id:377, minLv:67, maxLv:73, rate:8}, {id:334,minLv:73,maxLv:78,rate:25},{id:347,minLv:73,maxLv:78,rate:20},{id:377,minLv:73,maxLv:79,rate:8}]
  },
  route15: {
    id:"route15", name:"Route 15 - Granite Pass", icon:"🪨", type:"route",
    desc:"A narrow mountain pass strewn with boulders. Rock types dominate.",
    connections:["ironforge","granite_tunnels"],
    wildMonsters:[
      {id:191, minLv:67, maxLv:72, rate:21},  // Pebblet (base)
      {id:192, minLv:68, maxLv:73, rate:9},  // Boulderoll (mid → after 191 ✓)
      {id:193, minLv:67, maxLv:72, rate:10},  // Rugothon (base)
      {id:132, minLv:68, maxLv:73, rate:14},  // Volcascale (base)
      {id:133, minLv:69, maxLv:74, rate:5},  // Monolithox (mid → after 132 ✓)
      {id:93,  minLv:69, maxLv:74, rate:7},  // standalone rock
      {id:251, minLv:67, maxLv:72, rate:12},  // Crumblite (base Rock/Metal)
      {id:304, minLv:67, maxLv:72, rate:17},  // Icethorn (base Rock/Ice)
      {id:232, minLv:67, maxLv:72, rate:5}    // Serphaxon (base Draconic/Ground)
    ],
    hasGym:false, requiredBadges:14, mapPos:{x:48, y:85},
    ngPlusWildMonsters:[{id:364, minLv:68, maxLv:74, rate:9}, {id:332,minLv:74,maxLv:80,rate:20},{id:349,minLv:74,maxLv:80,rate:15},{id:369,minLv:75,maxLv:81,rate:10}]
  },
  quarryville: {
    id:"quarryville", name:"Quarryville Town", icon:"🏗️", type:"city",
    desc:"A mining town carved from solid rock. Home to Gym Leader Boulder, master of Rock types.",
    connections:["crystal_mine","route16"],
    wildMonsters:[
      {id:192, minLv:68, maxLv:73, rate:20},  // Boulderoll (mid)
      {id:195, minLv:69, maxLv:74, rate:25},  // Prismolith (195 on stone_plateau ✓)
      {id:196, minLv:70, maxLv:75, rate:10},  // Frigolith (mid → after 195 ✓)
      {id:133, minLv:69, maxLv:74, rate:15},  // Monolithox (mid)
      {id:92,  minLv:70, maxLv:74, rate:30}   // standalone
    ],
    hasGym:true, gymLeader:"boulder", requiredBadges:14, mapPos:{x:55, y:82},
    ngPlusWildMonsters:[{id:399, minLv:69, maxLv:75, rate:8}, {id:359, minLv:69, maxLv:75, rate:9}, {id:327,minLv:74,maxLv:80,rate:25},{id:341,minLv:74,maxLv:80,rate:15},{id:349,minLv:75,maxLv:81,rate:8}]
  },
  route16: {
    id:"route16", name:"Route 16 - Starlit Path", icon:"✨", type:"route",
    desc:"A magical path where starlight dances on every surface. Fairy types float among the luminescent flowers.",
    connections:["quarryville","nebula_gorge"],
    wildMonsters:[
      {id:137, minLv:69, maxLv:74, rate:17},  // Goldefluff (base)
      {id:72,  minLv:69, maxLv:74, rate:21},  // fairy-type (base)
      {id:73,  minLv:70, maxLv:75, rate:7},  // fairy-type (evo → after 72 ✓)
      {id:142, minLv:69, maxLv:74, rate:10},  // Dawnirel (base, new)
      {id:145, minLv:70, maxLv:75, rate:14},  // Faerrin (base)
      {id:225, minLv:69, maxLv:74, rate:5},  // Crealight (standalone Psy/Fairy)
      {id:226, minLv:69, maxLv:74, rate:9},  // Spectroo (base split-evo)
      {id:254, minLv:69, maxLv:74, rate:12},  // Bubblepuff (base Aquatic/Psy)
      {id:302, minLv:69, maxLv:74, rate:5}    // Lightpuff (base Fairy, item evo)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:62, y:78},
    ngPlusWildMonsters:[{id:363, minLv:71, maxLv:75, rate:9}, {id:344,minLv:76,maxLv:82,rate:20},{id:351,minLv:76,maxLv:82,rate:15},{id:360,minLv:77,maxLv:83,rate:10}]
  },
  starbloom: {
    id:"starbloom", name:"Starbloom City", icon:"🌟", type:"city",
    desc:"A radiant city that glows with fairy magic. Home to Gym Leader Seraphina, the last gym before The Vanguard.",
    connections:["astral_plateau","victoryroad","void_rift"],
    wildMonsters:[
      {id:138, minLv:70, maxLv:75, rate:24},  // Aetherael (mid)
      {id:139, minLv:71, maxLv:76, rate:8},  // Lumiarch (final → after 138 ✓)
      {id:143, minLv:70, maxLv:75, rate:13},  // Lunarael (mid)
      {id:144, minLv:71, maxLv:76, rate:8},  // Celestarch (final → after 143 ✓)
      {id:146, minLv:71, maxLv:76, rate:15},  // Shinarith (mid, 145 on route16 ✓)
      {id:203, minLv:72, maxLv:76, rate:19},  // Arachnalis (mid)
      {id:224, minLv:72, maxLv:76, rate:8},  // Psytheon (final → 223 on cosmic_cavern ✓)
      {id:217, minLv:73, maxLv:77, rate:5}    // Distorsion (final Mental)
    ],
    hasGym:true, gymLeader:"seraphina", requiredBadges:15, mapPos:{x:68, y:72},
    ngPlusWildMonsters:[{id:362, minLv:70, maxLv:77, rate:9}, {id:344,minLv:77,maxLv:82,rate:25},{id:351,minLv:77,maxLv:82,rate:20},{id:360,minLv:78,maxLv:83,rate:8}]
  },
  // ---- ADDITIONAL ROUTES (direction-change splits & mid-gym connectors) ----
  murk_crossing: {
    id:"murk_crossing", name:"Murk Crossing", icon:"🌫️", type:"route",
    desc:"A bog-choked crossing where the path turns south through fetid marshland. Toxic vapors hang low and Poison types lurk in every murky puddle.",
    connections:["route10","toxic_bog"],
    wildMonsters:[
      {id:155, minLv:57, maxLv:62, rate:24},  // Toxirin (base)
      {id:156, minLv:58, maxLv:63, rate:10},  // Venekon (mid → after base ✓)
      {id:158, minLv:58, maxLv:63, rate:18},  // Corrodisc (mid, base Acidelix on route10 ✓)
      {id:159, minLv:60, maxLv:65, rate:6},  // Dissotoad (final → after 158 ✓)
      {id:164, minLv:58, maxLv:63, rate:28},  // Blightmite (base, new)
      {id:165, minLv:59, maxLv:64, rate:14}   // Venowarn (mid → after 164 ✓)
    ],
    ngPlusWildMonsters:[{id:355, minLv:58, maxLv:65, rate:10}], // NG+ standalone: Abyssalith
    hasGym:false, requiredBadges:9, mapPos:{x:42, y:60}
  },
  quake_foothills: {
    id:"quake_foothills", name:"Quake Foothills", icon:"🌋", type:"route",
    desc:"Rolling foothills rocked by constant tremors where Terravault's mountain range begins. Ground-type Lumori burrow through the cracked and heaving earth.",
    connections:["route11","magma_vent"],
    wildMonsters:[
      {id:95,  minLv:59, maxLv:64, rate:24},  // Dustkin (base)
      {id:96,  minLv:60, maxLv:65, rate:8},  // Seismith (mid → after 95 ✓)
      {id:98,  minLv:59, maxLv:64, rate:18},  // Aridix (base)
      {id:99,  minLv:60, maxLv:65, rate:14},  // Toxivenoth (mid → after 98 ✓)
      {id:101, minLv:59, maxLv:64, rate:28},  // Limoux (base)
      {id:102, minLv:60, maxLv:65, rate:8}   // Dunoloth (mid → after 101 ✓)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:28, y:72}
  },
  cobweb_gully: {
    id:"cobweb_gully", name:"Cobweb Gully", icon:"🕸️", type:"route",
    desc:"A sunken gully thick with silken threads where every tree and boulder is wrapped in webs. Bug types in every stage of evolution compete for territory.",
    connections:["fungal_cavern","ancient_grove"],
    wildMonsters:[
      {id:198, minLv:62, maxLv:67, rate:28},  // Chrysalix (mid, 197 on route12 ✓)
      {id:199, minLv:63, maxLv:68, rate:14},  // Aeridaleth (final → after 198 ✓)
      {id:200, minLv:61, maxLv:66, rate:18},  // Iridibeetle (base)
      {id:201, minLv:62, maxLv:67, rate:6},  // Scarabion (mid → after 200 ✓)
      {id:204, minLv:63, maxLv:68, rate:24},  // Muddite (base)
      {id:205, minLv:64, maxLv:69, rate:10}   // Quarrix (mid → after 204 ✓)
    ],
    hasGym:false, requiredBadges:11, mapPos:{x:15, y:82}
  },
  gale_ridge_east: {
    id:"gale_ridge_east", name:"Gale Ridge East", icon:"🌪️", type:"route",
    desc:"Where Gale Ridge curves sharply eastward, the winds reverse direction entirely. This turn is notorious for sending unprepared trainers stumbling backward toward Silkwood.",
    connections:["gale_peak","tempest_cliffs"],
    wildMonsters:[
      {id:109, minLv:64, maxLv:69, rate:24},  // Siroccomane (mid, 108 on route13 ✓)
      {id:110, minLv:65, maxLv:70, rate:8},  // Aeolarch (final → after 109 ✓)
      {id:112, minLv:64, maxLv:69, rate:28},  // Swirlavel (mid, 111 on route13 ✓)
      {id:113, minLv:65, maxLv:70, rate:8},  // Cyclavorn (final → after 112 ✓)
      {id:115, minLv:65, maxLv:70, rate:18},  // Aetherworn (mid, 114 on route13 ✓)
      {id:117, minLv:65, maxLv:70, rate:14}   // Pneumathos (mid, 116 on route13 ✓)
    ],
    ngPlusWildMonsters:[{id:393, minLv:65, maxLv:70, rate:8}], // thinned from mega-area
    hasGym:false, requiredBadges:12, mapPos:{x:14, y:95}
  },
  forge_approach: {
    id:"forge_approach", name:"Forge Approach", icon:"🔩", type:"route",
    desc:"The rusted outer edge of Ironforge's industrial sprawl. Abandoned conveyor lines and slag heaps attract Metal-type Lumori who claim the metal as their own.",
    connections:["smelter_pass","ironforge"],
    wildMonsters:[
      {id:148, minLv:66, maxLv:71, rate:10},  // Stoicguard (mid)
      {id:149, minLv:67, maxLv:72, rate:6},  // Eternarmor (final → after 148 ✓)
      {id:150, minLv:65, maxLv:70, rate:24},  // Gearon (base)
      {id:151, minLv:66, maxLv:71, rate:14},  // Alloytron (mid → after 150 ✓)
      {id:153, minLv:66, maxLv:71, rate:28},  // Dentshaft (base)
      {id:154, minLv:67, maxLv:72, rate:18}   // Terragolem (mid → after 153 ✓)
    ],
    hasGym:false, requiredBadges:13, mapPos:{x:38, y:92}
  },
  stone_plateau: {
    id:"stone_plateau", name:"Stone Plateau", icon:"🏜️", type:"route",
    desc:"A windswept expanse of exposed bedrock leading into Quarryville. Ancient monoliths dot the plateau and Rock and Dark types claim each one as territory.",
    connections:["granite_tunnels","crystal_mine"],
    wildMonsters:[
      {id:192, minLv:68, maxLv:73, rate:18},  // Boulderoll (mid, 191 on route15 ✓)
      {id:193, minLv:67, maxLv:72, rate:28},  // Rugothon (base)
      {id:194, minLv:68, maxLv:73, rate:10},  // Lithomere (mid → after 193 ✓)
      {id:133, minLv:69, maxLv:74, rate:14},  // Monolithox (mid)
      {id:195, minLv:69, maxLv:74, rate:24},  // Prismolith (base, new)
      {id:196, minLv:70, maxLv:75, rate:6}   // Frigolith (mid → after 195 ✓)
    ],
    ngPlusWildMonsters:[{id:385, minLv:68, maxLv:75, rate:8}, {id:367, minLv:68, maxLv:75, rate:10}], // NG+ standalone: Bouldertide
    hasGym:false, requiredBadges:14, mapPos:{x:48, y:82}
  },
  cosmic_cavern: {
    id:"cosmic_cavern", name:"Cosmic Cavern", icon:"🌌", type:"route",
    desc:"A glittering cavern lit by bioluminescent crystals on the approach to Starbloom. Fairy types dance in the starlight, but dark shadows hint at lurking Umbra agents.",
    connections:["nebula_gorge","astral_plateau"],
    wildMonsters:[
      {id:137, minLv:69, maxLv:74, rate:16},  // Goldefluff (base)
      {id:138, minLv:70, maxLv:75, rate:11},  // Aetherael (mid → after 137 ✓)
      {id:143, minLv:70, maxLv:75, rate:7},  // Lunarael (mid, 142 on route16 ✓)
      {id:144, minLv:71, maxLv:76, rate:5},  // Celestarch (final → after 143 ✓)
      {id:145, minLv:70, maxLv:75, rate:14},  // Faerrin (base)
      {id:119, minLv:70, maxLv:74, rate:9},  // Dreadmaw (Dark/Umbra)
      {id:222, minLv:70, maxLv:74, rate:20},  // Mindpuff (base, for Psytheon chain)
      {id:223, minLv:70, maxLv:74, rate:12},  // Recallum (mid → after 222 ✓)
      {id:255, minLv:71, maxLv:75, rate:6}   // Psychotide (mid → Aquapuff on route16 ✓)
    ],
    ngPlusWildMonsters:[{id:397, minLv:70, maxLv:76, rate:8}], // thinned from mega-area
    hasGym:false, requiredBadges:15, mapPos:{x:68, y:78}
  },
  void_rift: {
    id:"void_rift", name:"The Void Rift", icon:"🌀", type:"special",
    desc:"A tear in reality pulsing with dark energy near Route 16. The Umbra Order's experiments cracked open this rift, and within its swirling darkness, Voidraxis — the Void Star — awaits any trainer bold enough to enter.",
    connections:["starbloom","umbra_lab"],
    wildMonsters:[
      {id:119, minLv:72, maxLv:77, rate:30},  // Dreadmaw (Dark)
      {id:122, minLv:72, maxLv:77, rate:30},  // Caveshroud (Dark)
      {id:120, minLv:73, maxLv:78, rate:25},  // dark-type
      {id:131, minLv:73, maxLv:78, rate:15}   // Necrothon (Dark/Grass)
    ],
    hasGym:false, requiredBadges:15, mapPos:{x:75, y:72},
    ngPlusWildMonsters:[{id:373, minLv:78, maxLv:84, rate:8}, {id:342,minLv:78,maxLv:84,rate:20},{id:343,minLv:78,maxLv:84,rate:15},{id:352,minLv:79,maxLv:85,rate:8}]
  },
  // ---- ADDITIONAL MID-GYM ROUTES (phase 2) ----
  toxic_bog: {
    id:"toxic_bog", name:"Toxic Bog", icon:"🐸", type:"route",
    desc:"A stagnant bog where the path turns south toward Miasma City. Foul gas bubbles up through the mud and Poison types lurk beneath the surface.",
    connections:["murk_crossing","mire_depths"],
    wildMonsters:[
      {id:156, minLv:58, maxLv:63, rate:20},  // Venekon (mid)
      {id:158, minLv:58, maxLv:63, rate:20},  // Corrodisc (mid)
      {id:159, minLv:60, maxLv:65, rate:20},  // Dissotoad (final)
      {id:164, minLv:58, maxLv:63, rate:20},  // Blightmite (base)
      {id:165, minLv:59, maxLv:64, rate:20}   // Venowarn (mid → after 164 ✓)
    ],
    hasGym:false, requiredBadges:9, mapPos:{x:42, y:63}
  },
  tremor_summit: {
    id:"tremor_summit", name:"Tremor Summit", icon:"⛰️", type:"route",
    desc:"The crest of the quake-ridden foothills where the shaking is strongest. Only final-stage Ground-type Lumori can hold their footing here.",
    connections:["quake_foothills","terravault"],
    wildMonsters:[
      {id:97,  minLv:62, maxLv:67, rate:15},  // Tectonvast (final, 96 on quake_foothills ✓)
      {id:100, minLv:62, maxLv:67, rate:15},  // Craterlurk (final, 99 on quake_foothills ✓)
      {id:103, minLv:62, maxLv:67, rate:15},  // Calciderm (final, 102 on quake_foothills ✓)
      {id:105, minLv:63, maxLv:68, rate:30},  // Dravanas (final, 104 on route11 ✓)
      {id:107, minLv:63, maxLv:68, rate:25}   // Quakeon (final, 106 on route11 ✓)
    ],
    hasGym:false, requiredBadges:10, mapPos:{x:28, y:75}
  },
  gale_peak: {
    id:"gale_peak", name:"Gale Peak", icon:"🌀", type:"route",
    desc:"The westernmost tip of the region — where Gale Ridge reaches its farthest point before turning sharply east. The wind here changes direction mid-step.",
    connections:["wind_hollow","gale_ridge_east"],
    wildMonsters:[
      {id:108, minLv:63, maxLv:68, rate:24},  // Silvergust (base)
      {id:109, minLv:64, maxLv:69, rate:10},  // Siroccomane (mid → after 108 ✓)
      {id:111, minLv:63, maxLv:68, rate:28},  // Aeolin (base)
      {id:112, minLv:64, maxLv:69, rate:14},  // Swirlavel (mid → after 111 ✓)
      {id:116, minLv:64, maxLv:69, rate:18},  // Zephyrin (base)
      {id:117, minLv:65, maxLv:70, rate:6}   // Pneumathos (mid → after 116 ✓)
    ],
    hasGym:false, requiredBadges:12, mapPos:{x:7, y:96}
  },
  forge_ruins: {
    id:"forge_ruins", name:"Forge Ruins", icon:"🏚️", type:"route",
    desc:"Collapsed factory halls stretching east from the old Ironwork Path. Metal-type Lumori nest in the rusted machinery, and mid-stage chains are common sightings.",
    connections:["ash_fields","smelter_pass"],
    wildMonsters:[
      {id:147, minLv:65, maxLv:70, rate:28},  // Scrapsapien (base)
      {id:148, minLv:66, maxLv:71, rate:6},  // Stoicguard (mid → after 147 ✓)
      {id:150, minLv:65, maxLv:70, rate:24},  // Gearon (base)
      {id:151, minLv:66, maxLv:71, rate:10},  // Alloytron (mid → after 150 ✓)
      {id:134, minLv:66, maxLv:71, rate:18},  // Aeronyx (base)
      {id:135, minLv:67, maxLv:72, rate:14}   // Steelvex (mid → after 134 ✓)
    ],
    ngPlusWildMonsters:[{id:396, minLv:66, maxLv:72, rate:8}], // thinned from mega-area
    hasGym:false, requiredBadges:13, mapPos:{x:33, y:92}
  },

  // ---- NEW AREAS: GYMS 9-16 EXPANSION ----

  mire_depths: {
    id:"mire_depths", name:"Mire Depths", icon:"🐸", type:"route",
    desc:"A labyrinthine deep-swamp sector south of Toxic Bog. Venomous Lumori that have shed their pre-evolutions stalk the murky waterways. Umbra scouts use the miasma as cover.",
    connections:["toxic_bog","miasmacity"],
    wildMonsters:[
      {id:156, minLv:59, maxLv:64, rate:9},  // Venekon (mid, base 155 on route10 ✓)
      {id:297, minLv:58, maxLv:63, rate:18},  // Blightwing (mid → 296 Toxifly on route10 ✓) WAIT - base needs earlier
      {id:165, minLv:59, maxLv:64, rate:13},  // Venowarn (mid, 164 on murk_crossing ✓)
      {id:296, minLv:58, maxLv:63, rate:27},  // Plaguefly (base Poi/Bug)
      {id:299, minLv:58, maxLv:63, rate:23},  // Stinglet (base Bug/Poi, also on route10)
      {id:218, minLv:59, maxLv:64, rate:10}   // Duskmist (base Spectral/Dark, item evo)
    ],
    legendaryEncounter:{monsterId:316, level:62}, // static legendary (obtainability fix)
    hasGym:false, requiredBadges:9, mapPos:{x:41, y:67}
  },
  magma_vent: {
    id:"magma_vent", name:"Magma Vent", icon:"🌋", type:"route",
    desc:"A superheated gorge where magma seeps through rock fissures between the foothills and Tremor Summit. Ground and Fire types bask in the thermal heat.",
    connections:["quake_foothills","tremor_summit"],
    wildMonsters:[
      {id:96,  minLv:61, maxLv:66, rate:8},  // Seismith (mid, 95 on quake_foothills ✓)
      {id:99,  minLv:61, maxLv:66, rate:14},  // Toxivenoth (mid, 98 on quake_foothills ✓)
      {id:102, minLv:61, maxLv:66, rate:8},  // Dunoloth (mid, 101 on quake_foothills ✓)
      {id:248, minLv:60, maxLv:65, rate:28},  // Pebblard (base Rock, also on route11)
      {id:274, minLv:60, maxLv:65, rate:24},  // Cindling (base Fire/Rock)
      {id:312, minLv:60, maxLv:65, rate:18}   // Dunecrawl (base Ground/Dark)
    ],
    ngPlusWildMonsters:[{id:368, minLv:61, maxLv:66, rate:9}], // NG+ standalone: Willowisp
    legendaryEncounter:{monsterId:321, level:63}, // base-game legendary (relocated from NG+ mega-areas)
    hasGym:false, requiredBadges:10, mapPos:{x:28, y:74}
  },
  fungal_cavern: {
    id:"fungal_cavern", name:"Fungal Cavern", icon:"🍄", type:"route",
    desc:"An underground cavern lit by bioluminescent fungi on the route to Cobweb Gully. Grass and Bug types thrive in the moist, glowing dark.",
    connections:["route12","cobweb_gully"],
    wildMonsters:[
      {id:197, minLv:62, maxLv:67, rate:28},  // Photoworm (base Bug)
      {id:215, minLv:62, maxLv:67, rate:24},  // Veilwisp (base Mental)
      {id:216, minLv:63, maxLv:68, rate:10},  // Mindrift (mid → Psywisp 215 ✓)
      {id:262, minLv:62, maxLv:67, rate:18},  // Transluceed (base Grass/Poi)
      {id:263, minLv:63, maxLv:68, rate:6},  // Tendrilisk (mid → after 262 ✓)
      {id:272, minLv:62, maxLv:67, rate:14}   // Embrix (base Fire/Draconic)
    ],
    ngPlusWildMonsters:[{id:350, minLv:63, maxLv:68, rate:10}], // NG+ standalone: Fernwrath
    hasGym:false, requiredBadges:11, mapPos:{x:20, y:83}
  },
  ancient_grove: {
    id:"ancient_grove", name:"Ancient Grove", icon:"🌳", type:"route",
    desc:"A sacred forest grove of thousand-year-old trees. The air hums with ancient energy. Grass types here have evolved beyond their usual forms.",
    connections:["cobweb_gully","silkwood"],
    wildMonsters:[
      {id:221, minLv:64, maxLv:69, rate:14},  // Shadowveil (mid → Hauntrix 220 on route13 ✓)
      {id:264, minLv:64, maxLv:69, rate:13},  // Impenezard (final → Vinrix 263 on fungal_cavern ✓)
      {id:199, minLv:63, maxLv:68, rate:27},  // Aeridaleth (final Bug)
      {id:265, minLv:63, maxLv:68, rate:23},  // Mosswing (standalone Grass/Bug)
      {id:273, minLv:63, maxLv:68, rate:13},  // Blazeon (mid → Embrix 272 on fungal_cavern ✓)
      {id:290, minLv:63, maxLv:68, rate:10}   // Mimiclaw (location evo cobweb_gully nearby)
    ],
    legendaryEncounter:{monsterId:318, level:69}, // static legendary (obtainability fix)
    ngPlusWildMonsters:[{id:390, minLv:64, maxLv:69, rate:8}], // thinned from mega-area
    hasGym:false, requiredBadges:11, mapPos:{x:14, y:86}
  },
  wind_hollow: {
    id:"wind_hollow", name:"Wind Hollow", icon:"🌬️", type:"route",
    desc:"A sheltered bowl between cliff faces that creates a perfect wind tunnel. Rookie Wind-type Lumori train here before ascending Gale Ridge.",
    connections:["route13","gale_peak"],
    wildMonsters:[
      {id:292, minLv:64, maxLv:69, rate:6},  // Galehorn (mid → 291 Breezekin on route13 ✓)
      {id:293, minLv:63, maxLv:68, rate:18},  // Gustpuff (base Wind)
      {id:222, minLv:63, maxLv:68, rate:28},  // Mindpuff (base Mental)
      {id:223, minLv:64, maxLv:69, rate:10},  // Recallum (mid → after 222 ✓)
      {id:238, minLv:63, maxLv:68, rate:24},  // Snowble (base Ice/Wind)
      {id:284, minLv:63, maxLv:68, rate:14}   // Fluffkin (base Normal/Wind)
    ],
    legendaryEncounter:{monsterId:314, level:66}, // static legendary (obtainability fix)
    ngPlusWildMonsters:[{id:375, minLv:64, maxLv:69, rate:8}], // thinned from mega-area
    hasGym:false, requiredBadges:12, mapPos:{x:8, y:93}
  },
  tempest_cliffs: {
    id:"tempest_cliffs", name:"Tempest Cliffs", icon:"⛰️", type:"route",
    desc:"Sheer cliff faces battered by perpetual gales where Gale Ridge meets Gusthaven. Only the most powerful Wind types cling to the rockface here.",
    connections:["gale_ridge_east","gusthaven"],
    wildMonsters:[
      {id:294, minLv:65, maxLv:70, rate:24},  // Stormwing (mid → 293 on gale_peak ✓)
      {id:295, minLv:66, maxLv:71, rate:8},  // Cyclonax (final → after 294 ✓)
      {id:239, minLv:65, maxLv:70, rate:28},  // Blizzariel (mid → 238 on gale_peak ✓)
      {id:240, minLv:66, maxLv:71, rate:8},  // Tundrafox (final → after 239 ✓)
      {id:285, minLv:65, maxLv:70, rate:18},  // Cloudrift (mid → Fluffkin on wind_hollow ✓)
      {id:174, minLv:65, maxLv:70, rate:14}   // Scalevorn (standalone Draconic/Metal)
    ],
    ngPlusWildMonsters:[{id:386, minLv:66, maxLv:71, rate:8}, {id:333, minLv:66, maxLv:71, rate:10}], // NG+ standalone: Voltfang
    hasGym:false, requiredBadges:12, mapPos:{x:16, y:97}
  },
  ash_fields: {
    id:"ash_fields", name:"Ash Fields", icon:"🏜️", type:"route",
    desc:"A barren expanse of volcanic ash fields between Gusthaven and the Forge Ruins. Fire types scorch the ashen ground, and Metal types scavenge the slag.",
    connections:["route14","forge_ruins"],
    wildMonsters:[
      {id:301, minLv:66, maxLv:71, rate:6}, // Emberveil (obtainability fix)
      {id:245, minLv:66, maxLv:71, rate:9},  // Thundravex (mid Electric → 244 ✓)
      {id:275, minLv:66, maxLv:71, rate:13},  // Infernox (mid → 274 Cindling on magma_vent ✓)
      {id:266, minLv:65, maxLv:70, rate:27},  // Shadowpup (base Dark, also route10)
      {id:267, minLv:66, maxLv:71, rate:17},  // Nightclaw (mid → after 266 ✓)
      {id:278, minLv:65, maxLv:70, rate:23},  // Ironling (base, also route14)
      {id:312, minLv:65, maxLv:70, rate:5}    // Dunecrawl (base, also magma_vent)
    ],
    ngPlusWildMonsters:[{id:376, minLv:67, maxLv:72, rate:8}, {id:358, minLv:66, maxLv:71, rate:9}], // NG+ standalone: Pyrocrown
    hasGym:false, requiredBadges:13, mapPos:{x:30, y:90}
  },
  smelter_pass: {
    id:"smelter_pass", name:"Smelter Pass", icon:"🔥", type:"route",
    desc:"A narrow gorge between forge ruin walls where steel smelting still occurs. Metal vapors attract Metal/Fire hybrids and battle-hardened mid-evolutions.",
    connections:["forge_ruins","forge_approach"],
    wildMonsters:[
      {id:281, minLv:67, maxLv:72, rate:25},  // Cogvex (mid → 280 Gearbit on route14 ✓)
      {id:276, minLv:67, maxLv:72, rate:20},  // Scorchvast (final → Infernox on ash_fields ✓)
      {id:283, minLv:66, maxLv:71, rate:20},  // Rustpike (standalone Metal/Poi)
      {id:246, minLv:67, maxLv:72, rate:15},  // Megavolt (final → 245 on ash_fields ✓)
      {id:268, minLv:67, maxLv:72, rate:10},  // Darkfang (final Dark → 267 ✓)
      {id:307, minLv:66, maxLv:71, rate:10}   // Cinderpaw (standalone Fire/Dark)
    ],
    ngPlusWildMonsters:[{id:365, minLv:67, maxLv:72, rate:9}], // NG+ standalone: Cinderking
    hasGym:false, requiredBadges:13, mapPos:{x:36, y:91}
  },
  granite_tunnels: {
    id:"granite_tunnels", name:"Granite Tunnels", icon:"⛏️", type:"route",
    desc:"Underground tunnels bored through solid granite linking Ironforge to the Stone Plateau. Rock and Draconic types nest in the crystalline formations.",
    connections:["route15","stone_plateau"],
    wildMonsters:[
      {id:249, minLv:68, maxLv:73, rate:24},  // Boulderax (mid → 248 on route11/magma_vent ✓)
      {id:305, minLv:68, maxLv:73, rate:14},  // Geoshard (mid → 304 Crysthorn on route15 ✓)
      {id:233, minLv:68, maxLv:73, rate:18},  // Serpenthorn (mid → 232 Draxon on route15 ✓)
      {id:174, minLv:68, maxLv:73, rate:10},  // Scalevorn (standalone Draconic/Metal)
      {id:251, minLv:67, maxLv:72, rate:28},  // Crumblite (base Rock/Metal, also route15)
      {id:282, minLv:68, maxLv:73, rate:6}   // Mechavast (final → Cogvex on smelter_pass ✓)
    ],
    ngPlusWildMonsters:[{id:374, minLv:68, maxLv:73, rate:8}], // thinned from mega-area
    hasGym:false, requiredBadges:14, mapPos:{x:46, y:84}
  },
  crystal_mine: {
    id:"crystal_mine", name:"Crystal Mine", icon:"💎", type:"route",
    desc:"An exhausted gem mine between Stone Plateau and Quarryville where crystalline Rock types have colonized the abandoned shafts.",
    connections:["stone_plateau","quarryville"],
    wildMonsters:[
      {id:250, minLv:70, maxLv:75, rate:14},  // Megalith (final → 249 on granite_tunnels ✓)
      {id:306, minLv:70, maxLv:75, rate:13},  // Crystallon (final → 305 on granite_tunnels ✓)
      {id:234, minLv:70, maxLv:75, rate:13},  // Wyvernak (final → 233 on granite_tunnels ✓)
      {id:237, minLv:69, maxLv:74, rate:27},  // Icevault (mid → 236 Frostick on route11 ✓)
      {id:313, minLv:69, maxLv:74, rate:23},  // Sandrix (mid → 312 Dunecrawl on magma_vent ✓)
      {id:241, minLv:70, maxLv:75, rate:10}   // Shardlix (location evo from cosmic_cavern energy)
    ],
    legendaryEncounter:{monsterId:317, level:73}, // static legendary (obtainability fix)
    ngPlusWildMonsters:[{id:388, minLv:70, maxLv:75, rate:8}, {id:340, minLv:70, maxLv:75, rate:10}], // NG+ standalone: Cryoshard
    hasGym:false, requiredBadges:14, mapPos:{x:53, y:83}
  },
  nebula_gorge: {
    id:"nebula_gorge", name:"Nebula Gorge", icon:"🌠", type:"route",
    desc:"A star-dusted gorge where cosmic energy from nearby Starbloom saturates the air. Mental and Fairy types commune with the starlight here.",
    connections:["route16","cosmic_cavern"],
    wildMonsters:[
      {id:254, minLv:70, maxLv:75, rate:21},  // Bubblepuff (base, also on route16)
      {id:255, minLv:71, maxLv:76, rate:13},  // Psychotide (mid → after 254 ✓)
      {id:215, minLv:70, maxLv:75, rate:26},  // Veilwisp (base Mental)
      {id:216, minLv:71, maxLv:76, rate:17},  // Mindrift (mid → Psywisp 215 ✓)
      {id:259, minLv:70, maxLv:75, rate:8},  // Lumejell (standalone Aquatic/Psy)
      {id:269, minLv:70, maxLv:75, rate:10},  // Grimshade (base Dark, item evo)
      {id:271, minLv:70, maxLv:75, rate:5}    // Murkrat (standalone Dark/Normal)
    ],
    ngPlusWildMonsters:[{id:387, minLv:71, maxLv:76, rate:8}, {id:354, minLv:71, maxLv:76, rate:9}], // NG+ standalone: Riftwhale
    hasGym:false, requiredBadges:15, mapPos:{x:64, y:76}
  },
  astral_plateau: {
    id:"astral_plateau", name:"Astral Plateau", icon:"⭐", type:"route",
    desc:"A high plateau above Cosmic Cavern where the sky seems close enough to touch. Rare Lumori shaped by cosmic energy appear here in the hours around midnight.",
    connections:["cosmic_cavern","starbloom"],
    wildMonsters:[
      {id:217, minLv:72, maxLv:77, rate:14},  // Distorsion (final Mental)
      {id:224, minLv:72, maxLv:77, rate:14},  // Psytheon (final → 223 on cosmic_cavern ✓)
      {id:303, minLv:72, maxLv:77, rate:15},  // Lumivane (Moon Stone evo, base 302 on route16 ✓)
      {id:229, minLv:72, maxLv:77, rate:15},  // Radiafish (Thunder Stone evo, base 226 on route16 ✓)
      {id:228, minLv:72, maxLv:77, rate:10},  // Lunaroon (Moon Stone evo, base 226 on route16 ✓)
      {id:309, minLv:72, maxLv:77, rate:10},  // Tidephant (Aquatic Stone evo, base 308 → Aquatic/Dark)
      {id:308, minLv:71, maxLv:76, rate:22}   // Seafraith (base Aquatic/Dark)
    ],
    ngPlusWildMonsters:[{id:346, minLv:72, maxLv:77, rate:10}], // NG+ standalone: Astralwing
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
      {id:52,  minLv:65, maxLv:70, rate:17},
      {id:55,  minLv:65, maxLv:70, rate:33},
      {id:156, minLv:66, maxLv:71, rate:28},
      {id:159, minLv:67, maxLv:72, rate:17},
      {id:315, minLv:68, maxLv:72, rate:5}   // Ashvanus roams the vents
    ],
    hasGym:false, requiredBadges:16, requiresChampion:true,
    hasUmbraEncounter:true, mapPos:{x:81, y:69}
  },
  shadow_archive: {
    id:"shadow_archive", name:"Shadow Archive", icon:"📂", type:"special",
    desc:"Umbra's encrypted data vault hidden beneath a collapsed glacier. Spectral and Metal Lumori guard the servers that hold the organization's remaining secrets.",
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
      {id:270, minLv:72, maxLv:78, rate:18},
      {id:267, minLv:72, maxLv:78, rate:31},
      {id:269, minLv:73, maxLv:78, rate:41},
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
      {id:300, minLv:82, maxLv:88, rate:23},
      {id:150, minLv:83, maxLv:88, rate:17},
      {id:310, minLv:84, maxLv:90, rate:11},
      {id:372, minLv:84, maxLv:90, rate:11},
      {id:378, minLv:86, maxLv:92, rate:8},
      {id:379, minLv:86, maxLv:92, rate:7},
      {id:380, minLv:87, maxLv:93, rate:6},
      {id:381, minLv:87, maxLv:93, rate:5},
      {id:403, minLv:85, maxLv:91, rate:6},
      {id:406, minLv:85, maxLv:91, rate:6}
    ],
    hasGym:false, requiredBadges:16, requiresChampion:true, requiresNGPlus:true,
    mapPos:{x:76, y:84}
  },
  apex_summit: {
    id:"apex_summit", name:"Apex Summit", icon:"⛰️", type:"special",
    desc:"The highest point in all of Lumoria, accessible only to trainers who have already stood as Champion. A legendary Lumori of pure light waits here for someone worthy of a second journey.",
    connections:["prismatic_rift"],
    wildMonsters:[
      {id:384, minLv:88, maxLv:94, rate:27},
      {id:389, minLv:89, maxLv:95, rate:16},
      {id:392, minLv:90, maxLv:96, rate:10},
      {id:394, minLv:91, maxLv:97, rate:7},
      {id:395, minLv:91, maxLv:97, rate:7},
      {id:398, minLv:92, maxLv:98, rate:7},
      {id:400, minLv:93, maxLv:99, rate:3},
      {id:401, minLv:95, maxLv:100, rate:3},
      {id:404, minLv:90, maxLv:96, rate:10},
      {id:407, minLv:90, maxLv:96, rate:10}
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
    id:"marina", name:"Leader Marina", emoji:"🌊", type:"Aquatic",
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
    id:"oracle", name:"Leader Oracle", emoji:"🔮", type:"Mental",
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
    id:"drake", name:"Leader Drake", emoji:"🐉", type:"Draconic",
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
    id:"thorne", name:"Leader Thorne", emoji:"🌿", type:"Nature",
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
    id:"atlas", name:"Leader Atlas", emoji:"🏔️", type:"Earth",
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
    id:"mantis", name:"Leader Mantis", emoji:"🦗", type:"Nature",
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
    id:"ferro", name:"Leader Ferro", emoji:"⚙️", type:"Metal",
    badge:"Alloy Badge", badgeEmoji:"⚙️",
    battleMode:"double",
    quote:"Metal is perfection. No weakness, no flaw, no mercy!",
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
    id:"boulder", name:"Leader Boulder", emoji:"🪨", type:"Earth",
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
  mysticDew:     { name:"Mystic Dew",     emoji:"💧", desc:"Powers up Aquatic-type moves by 20%.",        type:"held", held:{ typeBoost:"Aquatic", mult:1.2 } },
  miracleSeed:   { name:"Miracle Seed",   emoji:"🌿", desc:"Powers up Grass-type moves by 20%.",        type:"held", held:{ typeBoost:"Nature", mult:1.2 } },
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
  softSand:      { name:"Coarse Sand",     emoji:"🏖️", desc:"Boosts Ground-type moves by 20% when held.", type:"held", held:{ typeBoost:"Earth", mult:1.2 } },
  silverPowder:  { name:"Carapace Dust", emoji:"✨", desc:"Boosts Bug-type moves by 20% when held.", type:"held", held:{ typeBoost:"Nature", mult:1.2 } },
  metalCoat:     { name:"Iron Shell",    emoji:"🔩", desc:"Boosts Metal-type moves by 20% when held.", type:"held", held:{ typeBoost:"Metal", mult:1.2 } },
  hardStone:     { name:"Crag Shard",    emoji:"🪨", desc:"Boosts Rock-type moves by 20% when held.", type:"held", held:{ typeBoost:"Earth", mult:1.2 } },
  pixieDust:     { name:"Fairy Essence",    emoji:"🧚", desc:"Boosts Fairy-type moves by 20% when held.", type:"held", held:{ typeBoost:"Fairy", mult:1.2 } },
  blackGlasses:  { name:"Black Glasses", emoji:"🕶️", desc:"Boosts Dark-type moves by 20% when held.", type:"held", held:{ typeBoost:"Dark", mult:1.2 } },
  neverMeltIce:  { name:"Eternal Ice",emoji:"🧊", desc:"Boosts Ice-type moves by 20% when held.", type:"held", held:{ typeBoost:"Ice", mult:1.2 } },
  dragonFang:    { name:"Draconic Fang",   emoji:"🐲", desc:"Boosts Draconic-type moves by 20% when held.", type:"held", held:{ typeBoost:"Draconic", mult:1.2 } },
  shellBell:     { name:"Shell Bell",    emoji:"🔔", desc:"Restores HP equal to 1/8 of damage dealt.", type:"held", held:{ effect:"shellBell" } },
  mysticWater:   { name:"Mystic Aquatic",  emoji:"💧", desc:"Boosts Aquatic-type moves by 20% when held.", type:"held", held:{ typeBoost:"Aquatic", mult:1.2 } },
  // Evolution Items
  fireStone:     { name:"Ember Shard",     emoji:"🔴", desc:"A stone radiating fiery energy. Evolves certain Lumori.", type:"evoItem" },
  waterStone:    { name:"Tide Shard",    emoji:"🔵", desc:"A stone pulsing with aquatic energy. Evolves certain Lumori.", type:"evoItem" },
  leafStone:     { name:"Grove Shard",     emoji:"🟢", desc:"A stone infused with the essence of nature. Evolves certain Lumori.", type:"evoItem" },
  thunderStone:  { name:"Storm Shard",  emoji:"🟡", desc:"A stone crackling with electric charge. Evolves certain Lumori.", type:"evoItem" },
  moonStone:     { name:"Lunar Shard",     emoji:"🌙", desc:"A stone that glows with lunar energy. Evolves certain Lumori.", type:"evoItem" },
  sunStone:      { name:"Solar Shard",      emoji:"☀️", desc:"A stone radiating solar warmth. Evolves certain Lumori.", type:"evoItem" },
  duskStone:     { name:"Twilight Shard",     emoji:"🌑", desc:"A stone steeped in twilight energy. Evolves certain Lumori.", type:"evoItem" },
  dragonScale:   { name:"Wyrm Scale",   emoji:"🐉", desc:"A scale from an ancient dragon. Evolves certain Lumori.", type:"evoItem" },
  steelCoating:  { name:"Metal Coating",  emoji:"🔩", desc:"A special metallic coating. Evolves certain Lumori.", type:"evoItem" },
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
        {monsterId:52,  level:68, moves:["flamethrower","fire_blast","solar_flare","sludge_bomb"]},
        {monsterId:159, level:70, moves:["sludge_bomb","venoshock","gunk_shot","toxic"]},
        {monsterId:315, level:72, moves:["magma_rock","fire_blast","stone_edge","caldera_meltdown"]}
      ],
      double:[
        {monsterId:52,  level:68, moves:["flamethrower","fire_blast","solar_flare","sludge_bomb"]},
        {monsterId:55,  level:69, moves:["fire_blast","flamethrower","heat_wave","sludge_bomb"]},
        {monsterId:159, level:70, moves:["sludge_bomb","venoshock","gunk_shot","toxic"]},
        {monsterId:315, level:72, moves:["magma_rock","fire_blast","stone_edge","caldera_meltdown"]}
      ],
      triple:[
        {monsterId:52,  level:68, moves:["flamethrower","fire_blast","solar_flare","sludge_bomb"]},
        {monsterId:55,  level:69, moves:["fire_blast","flamethrower","heat_wave","sludge_bomb"]},
        {monsterId:156, level:69, moves:["venoshock","sludge_bomb","toxic","corrosion_fang"]},
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
        {monsterId:131, level:70, moves:["shadow_ball","dark_pulse","verdant_surge","energy_ball"]},
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
    id:"wielder_lysara", name:"Lysara", emoji:"🌟", location:"astral_plateau",
    quote:"You have come this far from a land that still breathes. Show me it was worth it.",
    winQuote:"You carry something we no longer have. Hold onto it.",
    lumoriLore:"Stellarion appeared during the great centennial alignment — a night when every constellation in Vaeldris locked into perfect geometric relation. It did not emerge from anywhere visible. The temple stones simply parted for it. I had been the temple's keeper for eleven years. It walked to me, looked at me once, and never left. I still do not know if I found it or if it was simply done waiting for me to arrive.",
    vaeldrisLore:"Vaeldris was not like other regions. Its Ley lines ran near enough to the surface that you could feel them if you knew how to listen — a low resonance in the stone, a pressure behind the eyes in certain valleys. The sacred temples I kept were built on convergence points of that energy, built by people who understood it long before any formal study existed. That energy was the reason the 39 came. It was the reason all of this happened.",
    team:[
      {monsterId:462, level:98, moves:["psychic_move","air_slash","moonblast","aura_veil_strike"]},
      {monsterId:463, level:99, moves:["moonblast","earth_power","dazzling_gleam","luma_quake"]},
      {monsterId:464, level:100, moves:["flash_cannon","moonblast","celestial_forge","star_cannon"]}
    ],
    ngTeam:[
      {monsterId:462, level:100, moves:["psychic_move","air_slash","moonblast","aura_veil_strike"]},
      {monsterId:463, level:102, moves:["moonblast","earth_power","dazzling_gleam","luma_quake"]},
      {monsterId:464, level:105, moves:["flash_cannon","moonblast","celestial_forge","star_cannon"]}
    ]
  },
  wielder_morrigan: {
    id:"wielder_morrigan", name:"Morrigan", emoji:"🌑", location:"haunted_grove",
    quote:"Vaeldris burned while I watched. What will you do when everything you know is gone?",
    winQuote:"You fight like someone who still has something to lose. That used to describe me.",
    lumoriLore:"Voidwing had been trying to extinguish Vaeldris's coastal fires alone for three days when I found it. Working with its ice and psychic force against blazes it could not possibly stop, exhausted past anything that should have allowed it to keep moving. When I reached it, it looked at me and did not run. That was the only introduction we needed — two things past feeling, deciding without words to face what remained together.",
    vaeldrisLore:"The 39 were not native to Vaeldris. They came from places beyond known maps — older, stranger places — drawn by the Ley resonance into a region that could sustain them. While Vaeldris lived, scholars came from four regions to study them. They were proof that Lumori could be something older, shaped by forces no other region offered. We were proud. After Vaeldris fell, the world forgot they had ever existed at all.",
    team:[
      {monsterId:465, level:98, moves:["shadow_ball","dark_pulse","void_rend","nyx_fang"]},
      {monsterId:466, level:99, moves:["fire_blast","sludge_wave","dark_pulse","toxic_blaze"]},
      {monsterId:467, level:100, moves:["blizzard","psystrike","mind_blizzard","frost_pulse"]}
    ],
    ngTeam:[
      {monsterId:465, level:100, moves:["shadow_ball","dark_pulse","void_rend","nyx_fang"]},
      {monsterId:466, level:102, moves:["fire_blast","sludge_wave","dark_pulse","toxic_blaze"]},
      {monsterId:467, level:105, moves:["blizzard","psystrike","mind_blizzard","frost_pulse"]}
    ]
  },
  wielder_kael: {
    id:"wielder_kael", name:"Kael", emoji:"⛈️", location:"storm_plateau",
    quote:"The storm was the only honest thing in Vaeldris. Let's see if you can survive honesty.",
    winQuote:"You weathered it. That's rare.",
    lumoriLore:"I was sixteen the first time I saw Stormdrake. A surge had rolled over Vaeldris's northern cliffs without warning and I had climbed to the top to watch it — which was not wise. Stormdrake was already there. It had been watching storms since before my great-grandparents were born. It ignored me for three hours. Then the storm broke and it looked at me and made a sound I have never been able to describe. I consider it the best conversation of my life.",
    vaeldrisLore:"We were not selected. We were recognized. The region had a way of making itself known to certain people — a particular resonance, a quality of light in specific valleys. The 39 came to each of us individually, years apart. When the last of us was found, we had not announced ourselves as a group. We had simply, without planning it, become one. The Ley Network settled the day all 13 bonds were formed. None of us realized it until much later.",
    team:[
      {monsterId:468, level:98, moves:["thunderbolt","flash_cannon","volt_surge","volt_rail"]},
      {monsterId:469, level:99, moves:["stone_edge","dragon_pulse","obsidian_crash","arc_strike"]},
      {monsterId:470, level:100, moves:["hurricane","hydro_pump","torrent_shell","swarm_tide"]}
    ],
    ngTeam:[
      {monsterId:468, level:100, moves:["thunderbolt","flash_cannon","volt_surge","volt_rail"]},
      {monsterId:469, level:102, moves:["stone_edge","dragon_pulse","obsidian_crash","arc_strike"]},
      {monsterId:470, level:105, moves:["hurricane","hydro_pump","torrent_shell","swarm_tide"]}
    ]
  },
  wielder_thessaly: {
    id:"wielder_thessaly", name:"Thessaly", emoji:"🌿", location:"ancient_ruins",
    quote:"The roots remember what the surface has forgotten. I will test whether you do too.",
    winQuote:"The land acknowledges you. That means something.",
    lumoriLore:"The eastern fault line was shifting the day Gaiasurge came to me — shifting in a way that should have destroyed three villages. Gaiasurge went to the fault and stood there for six hours, legs braced against tectonic forces that could have split a continent. It did not ask for help. It did not acknowledge me until it was done. Then it walked to where I was standing and sat down beside me. I have never found words for what I felt. I have stopped trying.",
    vaeldrisLore:"The Ley Network was Vaeldris's circulatory system — lines of convergent elemental energy running beneath every stone and current and root. A researcher named Solarn mapped it completely for the first time in recorded history. His maps were extraordinary. They showed exactly where every line ran, exactly where they converged, exactly how the energy moved. They were the most accurate document of Vaeldris's internal structure that had ever existed. We should have been more careful about what he did with them afterward.",
    team:[
      {monsterId:471, level:98, moves:["seed_bomb","sludge_bomb","energy_ball","root_toxin"]},
      {monsterId:472, level:99, moves:["stone_edge","flash_cannon","obsidian_crash","mineral_lance"]},
      {monsterId:473, level:100, moves:["earthquake","earth_power","tectonic_wrath","quake_barrage"]}
    ],
    ngTeam:[
      {monsterId:471, level:100, moves:["seed_bomb","sludge_bomb","energy_ball","root_toxin"]},
      {monsterId:472, level:102, moves:["stone_edge","flash_cannon","obsidian_crash","mineral_lance"]},
      {monsterId:473, level:105, moves:["earthquake","earth_power","tectonic_wrath","quake_barrage"]}
    ]
  },
  wielder_nereus: {
    id:"wielder_nereus", name:"Nereus", emoji:"🌊", location:"deep_trench",
    quote:"I turned back when the ocean warned me. Now I turn nothing back. Prove you can handle the deep.",
    winQuote:"The depths respect strength. So do I.",
    lumoriLore:"My diving equipment failed at four thousand meters. Something enormous caught me in the dark before I hit the trench floor. I woke on the surface with Abyssalon circling beneath me — a silhouette the size of a ship, visible only because the water around it was colder than the deep current. It had carried me up four kilometers without explanation. I have returned to that depth many times since. Each time I am afraid. Each time I know I am exactly where I am supposed to be.",
    vaeldrisLore:"Solarn's maps revealed something none of us had suspected. All the Ley lines converged at a single node — not near the center of Vaeldris but exactly the center, with a mathematical precision that could not be natural. Something had placed them there, long before any recorded history. Solarn spent a year determining what. When he found his answer, he published it in academic journals across three regions. The answer attracted attention. Not the kind he had intended.",
    team:[
      {monsterId:474, level:98, moves:["surf","psychic_move","hydro_pump","thought_stream"]},
      {monsterId:475, level:99, moves:["crunch","venom_lance","dark_pulse","dark_corrosion"]},
      {monsterId:476, level:100, moves:["dragon_claw","blizzard","glacial_riptide","tidal_fang"]}
    ],
    ngTeam:[
      {monsterId:474, level:100, moves:["surf","psychic_move","hydro_pump","thought_stream"]},
      {monsterId:475, level:102, moves:["crunch","venom_lance","dark_pulse","dark_corrosion"]},
      {monsterId:476, level:105, moves:["dragon_claw","blizzard","glacial_riptide","tidal_fang"]}
    ]
  },
  wielder_caelia: {
    id:"wielder_caelia", name:"Caelia", emoji:"☁️", location:"gale_peak",
    quote:"The sky doesn't care where you're from. It only cares how high you reach.",
    winQuote:"You belong up here. Not many do.",
    lumoriLore:"Skydrak lives at the edge of breathable atmosphere. I reached it once, on borrowed altitude, running out of air. It appeared from nowhere and flew beneath me. I do not know why. I have spent years wondering whether it was instinct, whether it recognized something in me, whether I simply fell in its direction at the right moment. Skydrak has shown no interest in clarifying this. After all our years together, I have come to understand that this is its way of saying the reason should already be obvious.",
    vaeldrisLore:"Within a year of Solarn's publication, something had begun following his work. Not reading it — consuming it. Absorbing the mapped knowledge of the Ley Network the way certain Lumori absorb elemental energy, drawing the information into itself across a vast distance. We did not notice it immediately because it had no body. It was attending to our world with something older and more patient than eyes. By the time Solarn recognized what was happening, it had already found what it came for.",
    team:[
      {monsterId:477, level:98, moves:["moonblast","thunderbolt","dazzling_gleam","aether_shock"]},
      {monsterId:478, level:99, moves:["air_slash","flash_cannon","hurricane","steel_gale"]},
      {monsterId:479, level:100, moves:["hurricane","specter_pulse","phantom_gale","void_cyclone"]}
    ],
    ngTeam:[
      {monsterId:477, level:100, moves:["moonblast","thunderbolt","dazzling_gleam","aether_shock"]},
      {monsterId:478, level:102, moves:["air_slash","flash_cannon","hurricane","steel_gale"]},
      {monsterId:479, level:105, moves:["hurricane","specter_pulse","phantom_gale","void_cyclone"]}
    ]
  },
  wielder_dravek: {
    id:"wielder_dravek", name:"Dravek", emoji:"🔥", location:"volcano_core",
    quote:"The forge never apologizes for the heat. Neither do I.",
    winQuote:"You didn't flinch. That's the first requirement.",
    lumoriLore:"I was nineteen and angry at everything when I descended into Vaeldris's volcanic interior, looking for something to prove. Pyralloy was asleep in the magma. It woke when I arrived and regarded me with the expression of someone interrupted during something important. That expression has not meaningfully changed in thirty years. I have come to find it comforting — it is the face of a creature with nothing left to prove, looking at one who has not yet learned that lesson.",
    vaeldrisLore:"The entity fed precisely. It consumed the minor Ley convergence nodes first — dozens of them over months — so slowly that the early tremors seemed like ordinary geological activity. By the time Solarn recognized the pattern, fourteen nodes were already gone. It had been patient. It had been thorough. It understood the Network better than most of us did. Solarn came to the thirteen of us with his analysis. He told us we had perhaps two weeks before the larger nodes began to fall.",
    team:[
      {monsterId:480, level:98, moves:["fire_blast","flash_cannon","solar_flare","pyro_alloy"]},
      {monsterId:481, level:99, moves:["dark_pulse","earth_power","obsidian_fang","smoldering_abyss"]},
      {monsterId:482, level:100, moves:["dragon_claw","venom_lance","venom_surge","acid_burst"]}
    ],
    ngTeam:[
      {monsterId:480, level:100, moves:["fire_blast","flash_cannon","solar_flare","pyro_alloy"]},
      {monsterId:481, level:102, moves:["dark_pulse","earth_power","obsidian_fang","smoldering_abyss"]},
      {monsterId:482, level:105, moves:["dragon_claw","venom_lance","venom_surge","acid_burst"]}
    ]
  },
  wielder_nylara: {
    id:"wielder_nylara", name:"Nylara", emoji:"❄️", location:"crystal_spire",
    quote:"The cold preserves everything that heat destroys. I have preserved much. Now let me test you.",
    winQuote:"You survived the cold. Vaeldris would have welcomed you.",
    lumoriLore:"I was sitting in my study the night after the evacuation order, doing nothing, staring at a wall. The door opened. Frostdrax came in, looked at me, and curled up beside my desk. I had not sought it. It had found its way to me across a thousand kilometers of collapsing region and simply decided to stay. I believe it understood something that night that took me years longer to reach: that choosing to remain beside someone who is grieving is its own kind of strength.",
    vaeldrisLore:"Solarn had identified a failsafe. The central convergence node could be deliberately collapsed — it would destroy the Ley Network permanently, but the entity would have nothing left to consume. The window was 37 hours. It required physically destroying the shutdown mechanism at the node itself. It would cost Vaeldris everything it was, but it would stop the entity from reaching any other region. Rax did not hesitate. He said he would go. He left within the hour.",
    team:[
      {monsterId:483, level:98, moves:["ice_beam","flash_cannon","alloy_edge","cryo_plate"]},
      {monsterId:484, level:99, moves:["crunch","obsidian_crash","eclipse_shroud","cryo_shatter"]},
      {monsterId:485, level:100, moves:["specter_pulse","moonblast","winter_shade","glacial_spirit"]}
    ],
    ngTeam:[
      {monsterId:483, level:100, moves:["ice_beam","flash_cannon","alloy_edge","cryo_plate"]},
      {monsterId:484, level:102, moves:["crunch","obsidian_crash","eclipse_shroud","cryo_shatter"]},
      {monsterId:485, level:105, moves:["specter_pulse","moonblast","winter_shade","glacial_spirit"]}
    ]
  },
  wielder_solenne: {
    id:"wielder_solenne", name:"Solenne", emoji:"🌙", location:"lunar_peak",
    quote:"Dreams outlast everything. Even the world that made them. What do yours contain?",
    winQuote:"You fight like you're awake. Most people never manage that.",
    lumoriLore:"Psydrak first appeared to me in a dream — not as a symbol but literally, walking through my sleeping mind as if the boundary between sleeping thought and physical reality were a courtesy it had decided not to observe. When I woke, it was outside my window. I asked it over years whether it had been in the dream or whether the dream had taken place within it. Psydrak has never provided a satisfying answer. I have come to suspect it considers the question beside the point.",
    vaeldrisLore:"Rax fought through forty-three hours of entity-warped territory to reach the central node. He arrived with twelve hours remaining in the window. The shutdown mechanism had already been destroyed — physically obliterated, with a precision that required knowing exactly what it was, exactly what it did, and exactly what destroying it would prevent. Someone had been there before him. Not the entity, which consumed rather than destroyed selectively. Someone with knowledge. Someone with purpose. We have never established who.",
    team:[
      {monsterId:486, level:98, moves:["psychic_move","shadow_ball","psystrike","dream_torrent"]},
      {monsterId:487, level:99, moves:["moonblast","surf","celestial_wave","moonlit_surge"]},
      {monsterId:488, level:100, moves:["dragon_pulse","thunder","voltaic_fang","thunder_chain"]}
    ],
    ngTeam:[
      {monsterId:486, level:100, moves:["psychic_move","shadow_ball","psystrike","dream_torrent"]},
      {monsterId:487, level:102, moves:["moonblast","surf","celestial_wave","moonlit_surge"]},
      {monsterId:488, level:105, moves:["dragon_pulse","thunder","voltaic_fang","thunder_chain"]}
    ]
  },
  wielder_rax: {
    id:"wielder_rax", name:"Rax", emoji:"🛡️", location:"umbra_base",
    quote:"Vaeldris had one final defense. It wasn't enough. I want to know if you would have been.",
    winQuote:"You would have been. That is the most I have ever said about anyone.",
    lumoriLore:"Alloydrax held the line for eleven hours. I had deployed it as a defensive anchor while the evacuation proceeded — the last barrier between the entity's advance and Vaeldris's population centers. It should have lasted two hours at most. I have reviewed the force data many times and have no physical explanation for how it lasted eleven. I believe it knew what was at stake. I believe it chose to hold anyway, past every reasonable threshold, because the alternative was allowing what it guarded against to reach the people behind it.",
    vaeldrisLore:"I reached the central node and I could not stop it. The mechanism was gone. I tried seventeen improvised methods. None worked. I asked the 39 Lumori to hold with me. They held. The other twelve channeled every available Ley energy into a containment field. We bought thirty-one hours. We did not stop it. Someone destroyed that shutdown mechanism before I arrived — deliberately, with full knowledge of what it would mean. I do not know who. I think about it every day. I will think about it every day for the rest of my life.",
    team:[
      {monsterId:489, level:98, moves:["iron_tail","stone_edge","obsidian_crash","iron_fortress"]},
      {monsterId:490, level:99, moves:["fire_blast","dark_pulse","solar_flare","forge_blast"]},
      {monsterId:491, level:100, moves:["dragon_claw","iron_cleave","dragon_pummels","alloy_breaker"]}
    ],
    ngTeam:[
      {monsterId:489, level:100, moves:["iron_tail","stone_edge","obsidian_crash","iron_fortress"]},
      {monsterId:490, level:102, moves:["fire_blast","dark_pulse","solar_flare","forge_blast"]},
      {monsterId:491, level:105, moves:["dragon_claw","iron_cleave","dragon_pummels","alloy_breaker"]}
    ]
  },
  wielder_tempris: {
    id:"wielder_tempris", name:"Tempris", emoji:"⚡", location:"thunder_cliffs",
    quote:"I have modelled every possible outcome of this battle. One of them involves you winning. Show me that one.",
    winQuote:"You were the 5.3%. I have updated my model.",
    lumoriLore:"Thunderax powered my research station for two years before I understood it was doing so intentionally. I had attributed the anomalous charge readings to atmospheric variance — a reasonable assumption. The day I understood, I walked outside and found Thunderax on the generator array, perfectly still, producing consistent and precisely calibrated output. I asked it why. It looked at me. I made the only non-quantitative notation in twelve years of research logs: it wanted to help. I have not removed that line. I have stopped trying.",
    vaeldrisLore:"The thirteen of us maintained the containment field for thirty-one hours. The 39 Lumori coordinated with us without instruction — they had understood the situation before we finished explaining it, or perhaps before we began. We were running out of time. The entity had adapted to the field's frequency and was beginning to breach. We had bought every hour we could buy. And then Vayne said something none of us had prepared for.",
    team:[
      {monsterId:492, level:98, moves:["thunderbolt","psychic_move","volt_surge","psycho_surge"]},
      {monsterId:493, level:99, moves:["flash_cannon","blizzard","alloy_edge","frost_lattice"]},
      {monsterId:494, level:100, moves:["aerial_assault","verdant_surge","canopy_strike","sky_harvest"]}
    ],
    ngTeam:[
      {monsterId:492, level:100, moves:["thunderbolt","psychic_move","volt_surge","psycho_surge"]},
      {monsterId:493, level:102, moves:["flash_cannon","blizzard","alloy_edge","frost_lattice"]},
      {monsterId:494, level:105, moves:["aerial_assault","verdant_surge","canopy_strike","sky_harvest"]}
    ]
  },
  wielder_vayne: {
    id:"wielder_vayne", name:"Vayne", emoji:"🕳️", location:"void_rift",
    quote:"I have stared into the void long enough that it has started staring back. Let's see what it makes of you.",
    winQuote:"The void considered you and retreated. You should be proud.",
    lumoriLore:"Voidcrown was sitting at the edge of the most unstable void rift in Vaeldris when I found it — a place where the boundary between something and nothing had worn thin enough to be dangerous. It was watching the rift with the patience of something that had already seen where the void leads and had decided, with full knowledge, to remain beside it anyway. I understood that patience immediately. It was the only introduction we needed. We have never required anything more from each other.",
    vaeldrisLore:"I told the others I could end it. The entity was, in some fundamental sense, a relative of the void — something that devours rather than contains. I had spent years studying void resonance and believed I could draw it in. I told them the cost was personal and that I had already decided. Voidcrown came with me without being asked. We entered the rift. I cannot describe what happened inside — the physics of that space do not map to language. The entity did not come back out. Voidcrown and I are here. We are not unchanged. I do not consider that a loss.",
    team:[
      {monsterId:495, level:98, moves:["specter_pulse","earthquake","dark_pulse","nihil_quake"]},
      {monsterId:496, level:99, moves:["psychic_move","x_scissor","psystrike","venom_mind"]},
      {monsterId:497, level:100, moves:["dragon_claw","gale_cannon","abyssal_fang","void_rend_ex"]}
    ],
    ngTeam:[
      {monsterId:495, level:100, moves:["specter_pulse","earthquake","dark_pulse","nihil_quake"]},
      {monsterId:496, level:102, moves:["psychic_move","x_scissor","psystrike","venom_mind"]},
      {monsterId:497, level:105, moves:["dragon_claw","gale_cannon","abyssal_fang","void_rend_ex"]}
    ]
  },
  wielder_azura: {
    id:"wielder_azura", name:"Azura", emoji:"🌠", location:"cosmic_cavern",
    quote:"I read the stars and knew Vaeldris would fall three days before it happened. I read you now. I wonder what I see.",
    winQuote:"The stars said you would win. I didn't believe them. I was wrong.",
    lumoriLore:"Stardrax appeared at my observatory window three days before the Sundering began. I had been reading the stars and they had changed — not physically, but in their relationships to each other, arranged into a configuration that meant catastrophe on a scale I had not witnessed in any prior chart. Stardrax looked at me with the expression it always has: as if it already knows the outcome and is waiting for me to catch up. I have never determined if this is meant to comfort me. I suspect it simply is what it is.",
    vaeldrisLore:"I will tell you what I know, as clearly as I can. A researcher named Solarn spent his life mapping Vaeldris's Ley Network — the lines of convergent elemental energy that ran beneath our region and made it what it was. His maps revealed that all our Ley lines converged at a single artificially placed node at the exact center of Vaeldris, a construction older than any recorded history. Solarn published this discovery across three regions' academic journals. Something read that publication and came for what it described.\n\nThe entity had no conventional form. It was an intelligence that consumed structured energy — Ley networks were its preferred sustenance. It had done this before, in places the old texts called the Dimmed Reaches, which we had assumed were mythology. They were not mythology. They were warning.\n\nSolarn identified a failsafe: deliberately collapsing the central node would starve the entity and stop its spread, at the cost of Vaeldris's Ley Network forever. The window was 37 hours. Rax went to execute it. The shutdown mechanism had already been destroyed when he arrived — deliberately, surgically, by someone with precise knowledge of what it did and what its destruction would prevent. The identity of whoever destroyed it has never been established. I have my suspicions. I have kept them to myself.\n\nWe held for thirty-one hours. All thirteen wielders, all 39 Lumori, channeling everything we had into a containment field. Vayne ended it. He drew the entity into the void rift using resonance techniques I still do not fully understand. He and Voidcrown came back. They are different. He says this is acceptable.\n\nThe 39 Lumori followed us when we left Vaeldris. We did not command them. We did not ask. They came. I have read many things in the stars over the course of my life. I have never read anything that told me why they chose to follow. I have come to believe some things are simply choices — made by creatures old enough to understand exactly what choosing costs — and that the only proper response is to spend the rest of your life being worthy of them.",
    team:[
      {monsterId:498, level:98, moves:["psychic_move","moonblast","psystrike","cosmic_dust"]},
      {monsterId:499, level:99, moves:["dragon_pulse","solar_flare","ancient_breath","stellar_flare"]},
      {monsterId:500, level:100, moves:["shadow_ball","hyper_beam","stellar_collapse","ghost_radiance"]}
    ],
    ngTeam:[
      {monsterId:498, level:100, moves:["psychic_move","moonblast","psystrike","cosmic_dust"]},
      {monsterId:499, level:102, moves:["dragon_pulse","solar_flare","ancient_breath","stellar_flare"]},
      {monsterId:500, level:105, moves:["shadow_ball","hyper_beam","stellar_collapse","ghost_radiance"]}
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
  { id:"q11", title:"Tidewatch Fisherman", desc:"A fisherman challenges you with his strongest Aquatic Lumori!", location:"tidewatch", type:"boss", requiredBadges:1,
    boss:{monsterId:25, level:22, moves:["surf","aqua_tail","bubble_beam","harden"]},
    reward:{type:"money", amount:800}, rewardText:"800 coins" },
  { id:"q12", title:"Coral Reef Explorer", desc:"Explore the Coral Reef and defeat its guardian.", location:"coral_reef", type:"boss", requiredBadges:2,
    boss:{monsterId:37, level:28, moves:["surf","flash_cannon","rock_slide","harden"]},
    reward:{type:"item", itemId:"mysticWater", qty:1}, rewardText:"Mystic Aquatic" },
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
  { id:"q18", title:"Tidal Wave Warning", desc:"A rogue Aquatic Lumori threatens Tidewatch harbor!", location:"tidewatch", type:"boss", requiredBadges:2,
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
    reward:{type:"item", itemId:"dragonFang", qty:1}, rewardText:"Draconic Fang" },

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
  { id:"q67", title:"Mental Duel", desc:"Oracle's apprentice challenges you to a psychic duel!", location:"skyvault", type:"boss", requiredBadges:6,
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
  { id:"q71", title:"Draconic's Trial", desc:"Pass the Draconic's Trial at Dragonspire to prove your worth.", location:"dragonspire", type:"boss", requiredBadges:7,
    boss:{monsterId:173, level:60, moves:["outrage","dragon_pulse","dragon_dance","hyper_beam"]},
    reward:{type:"money", amount:8000}, rewardText:"8000 coins" },
  { id:"q72", title:"Route 8 Warden", desc:"The Route 8 warden tests all who pass.", location:"route8", type:"boss", requiredBadges:7,
    boss:{monsterId:321, level:58, moves:["outrage","fire_blast","dragon_pulse","dragon_dance"]},
    reward:{type:"item", itemId:"dragonFang", qty:1}, rewardText:"Draconic Fang" },
  { id:"q73", title:"Victory Road Preview", desc:"Get a taste of Victory Road by defeating its gatekeeper!", location:"victoryroad", type:"boss", requiredBadges:8,
    boss:{monsterId:152, level:60, moves:["tungsten_ram","stone_edge","iron_tail","flash_cannon"]},
    reward:{type:"item", itemId:"xAttack", qty:5}, rewardText:"5 Power Charges" },
  { id:"q74", title:"Draconic Egg Protector", desc:"Protect the dragon eggs from poachers by defeating their leader!", location:"dragonspire", type:"boss", requiredBadges:7,
    boss:{monsterId:172, level:56, moves:["dragon_claw","dragon_breath","body_slam","dragon_dance"]},
    reward:{type:"item", itemId:"maxPotion", qty:5}, rewardText:"5 Luma Infusions" },
  { id:"q75", title:"The Draconic Sage", desc:"An ancient dragon sage challenges worthy trainers.", location:"dragonspire", type:"boss", requiredBadges:8,
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
    reward:{type:"item", itemId:"dragonFang", qty:1}, rewardText:"Draconic Fang" },
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
  { id:"q103", title:"Abyssal Draconic", desc:"Abyssdrake lurks in the Deep Trench. Challenge the abyss!", location:"deep_trench", type:"boss", requiredBadges:8,
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
  { id:"q118", title:"Desert Draconic Duel", desc:"A legendary desert dragon has been spotted at Route 11. Challenge it!", location:"route11", type:"boss", requiredBadges:10,
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

  // Route 14 - Ironwork Path (Metal focus)
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
  { id:"ngq21", title:"The Draconic Veil Seeker", desc:"Legends speak of a Draconic-Mental lineage hidden in the Prismatic Rift. Find and face the evolved form.", location:"prismatic_rift", type:"boss", requiresNGPlus:true, requiredBadges:0,
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
    reward:{type:"item", itemId:"masterOrb", qty:3}, rewardText:"3 Master Orbs" },

  // ============================================================
  // VAELDRIS WIELDER QUESTS (13 battles) — Post-game, after umbra_shade
  // Triple battles; player brings 4 Lumori (3 active + 1 reserve).
  // Party of 6 locked before first wielder battle; choose 4 per fight.
  // NG+ scales the opposing team levels higher.
  // ============================================================
  { id:"wielder_lysara", title:"The Celestial Witness", desc:"A survivor of Vaeldris is said to rest where the stars burn brightest in Lumoria — seekers speak of a plateau so high that the air itself seems to sing. Lysara holds the memory of Vaeldris's sacred temples. She will not come to you. Seek her at the Astral Plateau in the east.",
    location:"astral_plateau", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_morrigan", title:"The Shadowfen's Grief", desc:"Morrigan watched Vaeldris burn. She has carried that grief into darkness — those who have wandered the Haunted Grove report a figure among the shadows who does not flinch from the dead. She is there. Bring four Lumori and choose wisely.",
    location:"haunted_grove", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_kael", title:"The Storm That Remembers", desc:"Kael goes where storms go. Trainers who have crossed the Storm Plateau claim to have seen a lone figure standing in the lightning who did not run. That is him. He does not move for weather. He moves for worthy challengers.",
    location:"storm_plateau", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_thessaly", title:"The Root Memory", desc:"Thessaly communes with old things. The Ancient Ruins hold layers of history she can read like text — she has been there since the Umbra was defeated, waiting among stones that remember. Find the deepest chamber. She will know you are coming.",
    location:"ancient_ruins", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_nereus", title:"The Depth That Does Not Forgive", desc:"Nereus returned to the deepest water he could find after Vaeldris fell. The Abyssal Trench in the south — so deep that light gives up trying — is where he has stayed. Something massive guards the path to him. That is not a warning. That is information.",
    location:"deep_trench", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_caelia", title:"Keeper of the Open Sky", desc:"Caelia's creatures belong to the sky — the one thing the Sundering could not consume. She keeps to Gale Peak at Lumoria's northwestern edge, above the clouds where her Lumori fly free. The wind there will tell you if you're close.",
    location:"gale_peak", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_dravek", title:"The Forge That Still Burns", desc:"Dravek forged his team in Vaeldris's volcanic heart. When that forge was gone, he found Lumoria's Volcano Core — active, unforgiving, as close to what he lost as he could manage. Go south to the Volcano Core. The heat will intensify near him.",
    location:"volcano_core", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_nylara", title:"The Glacial Keeper", desc:"Nylara preserved what cold could save. She settled at the Crystal Spire — a place of frozen permanence in Lumoria's northern reaches where the ice remembers everything. The spire is difficult to reach. She considers that appropriate.",
    location:"crystal_spire", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_solenne", title:"The Dream That Remains", desc:"Solenne and her Lumori dream of Vaeldris every night. She has made her home at Lunar Peak, where the moonlight never fully yields to day — a place between waking and sleep. Reach her there. She will already know you are on your way.",
    location:"lunar_peak", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_rax", title:"The Last Defense", desc:"After the Umbra Order fell, Rax moved into their abandoned base. He said someone should guard a place that dangerous — that leaving it empty would be its own kind of mistake. The Umbra Order Base is quiet now. Rax is not.",
    location:"umbra_base", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_tempris", title:"The Architect of Odds", desc:"Tempris chose Thunder Cliffs for its electrical output data — the most consistent high-voltage readings in Lumoria, useful for research. He is there, running models. He already knows there is a non-trivial probability you will find him.",
    location:"thunder_cliffs", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_vayne", title:"The Void That Watches", desc:"Vayne returned to a void rift after Vaeldris — the one in Lumoria's northwest, where the boundary between worlds is thin. She says it feels like home now. The Void Rift is not safe for unprepared trainers. She is counting on that.",
    location:"void_rift", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"money", amount:50000}, rewardText:"50000 coins" },
  { id:"wielder_azura", title:"The Last Star Reader", desc:"Azura knew what was coming before it arrived. She chose Cosmic Cavern — where the star-light filters down through stone and the Ley resonance is strongest in all of Lumoria. She is the last. Find her deep within. She has been expecting you.",
    location:"cosmic_cavern", type:"wielder", requiresChampion:true, requiresDefeated:"umbra_shade", requiredBadges:16,
    reward:{type:"item", itemId:"masterOrb", qty:2}, rewardText:"2 Master Orbs" }
];
