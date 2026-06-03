// ============================================================
// LUMORIA - Traits (passive abilities) System
// ============================================================
// Mirrors the STATUS_REGISTRY pattern in battle.js: data-driven catalog of
// per-Lumori passive effects that fire automatically through battle hooks.
//
// Phase 1 (current): registry of 21 seeded traits ported from the PR #54
// brainstorm, plus helpers for trait lookup and a generic hook dispatcher.
// Per-Lumori trait assignment (which Lumori gets which traits) is deferred
// to Phase 5 and lives in TRAIT_ASSIGNMENTS in this same file.
//
// Trait hooks reuse the same SIGNATURES as STATUS_REGISTRY hooks so battle.js
// can dispatch both sources through the same aggregator helpers in Phase 3.
// Where status hooks take (mon, entry, move, attacker), trait hooks take the
// same shape with `entry` always null — the entry concept is status-specific.

// ---- Registry shape ----
//
// {
//   name: "Display Name",
//   emoji: "🔥",
//   cssClass: "trait-name",
//   description: "Player-facing one-liner.",
//   ngPlusOnly: false,                // Phase 5 honors this when assigning
//   immuneToStatus: ["freeze",...],   // status types this trait blocks
//
//   // Hooks (all optional; same signatures as STATUS_REGISTRY where overlapping)
//   incomingDmgMod:    (defender, _null, move, attacker) => mult,
//   outgoingPowerMod:  (attacker, _null, move)           => mult,
//   accuracyMod:       (mon, _null, isAttacking)         => mult,
//   statMod:           (mon, _null)                      => { atk?, def?, ... },
//   healMod:           (mon, _null)                      => mult,
//   onHitReflect:      (defender, _null, move, dmgTaken, attacker) => null | {reflectDmg, msg},
//   onIncomingHit:     (defender, _null, move, dmgTaken, attacker) => null | {selfDmg, msg, applyStatus},
//   onSelfDamageTaken: (mon, _null, damage)              => null | {effect}, // Vengeful-style
//   stabBonusMult:     (attacker, _null, move)           => mult,            // Empowered-style
//   forceCritImmune:   (defender, _null, move)           => bool,            // Lucky-style
//   onMoveAttempt:     (mon, _null, move)                => null | {block, msg},
//   onLowHpTrigger:    (mon, _null, lowHpFraction)       => null | {oneTimeMsg, statBonus},
//   heldItemMod:       (mon, _null)                      => mult,            // Symbiote-style
//   drainMod:          (mon, _null)                      => mult,            // Greedy-style
//   weatherTrigger:    (mon, _null, weather)             => null | {effect}, // future weather system
// }

const ABILITY_REGISTRY = {
  // ====== From the 21 seeded by PR #54 (multi-status brainstorm) ======

  frosted: {
    name: "Frosted",
    emoji: "🧊",
    cssClass: "trait-frosted",
    description: "Ice moves deal half damage to this Lumori; Fire moves deal double. Immune to Freeze.",
    ngPlusOnly: false,
    immuneToStatus: ["freeze"],
    incomingDmgMod: (_d, _e, move) =>
      move.type === "Ice" ? 0.5 : (move.type === "Fire" ? 2.0 : 1),
  },

  resonant: {
    name: "Resonant",
    emoji: "📻",
    cssClass: "trait-resonant",
    description: "Sonic moves this Lumori uses deal double power.",
    ngPlusOnly: false,
    outgoingPowerMod: (_a, _e, move) => move.type === "Sonic" ? 2.0 : 1,
  },

  empowered: {
    name: "Empowered",
    emoji: "💥",
    cssClass: "trait-empowered",
    description: "Same-type-attack bonus boosted from 1.5× to 2.0×.",
    ngPlusOnly: false,
    // Returns the STAB multiplier this trait imposes; battle.js applies it via stabBonusMult dispatch
    stabBonusMult: (attacker, _e, move) =>
      attacker.types?.includes(move.type) ? (2.0 / 1.5) : 1,
  },

  conductive: {
    name: "Conductive",
    emoji: "⚡",
    cssClass: "trait-conductive",
    description: "Electric and Aquatic moves deal double damage to this Lumori.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) =>
      (move.type === "Electric" || move.type === "Aquatic") ? 2.0 : 1,
  },

  levitating: {
    name: "Levitating",
    emoji: "🪂",
    cssClass: "trait-levitating",
    description: "Earth moves do nothing; Wind moves deal 1.5× damage to this Lumori.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) =>
      move.type === "Earth" ? 0 : (move.type === "Wind" ? 1.5 : 1),
  },

  mossy: {
    name: "Mossy",
    emoji: "🌿",
    cssClass: "trait-mossy",
    description: "Nature moves heal this Lumori for the damage they would have dealt; Fire moves deal 1.5×.",
    ngPlusOnly: false,
    // Nature => negative dmg (heal). Fire => 1.5×. Others => 1.
    incomingDmgMod: (_d, _e, move) =>
      move.type === "Nature" ? -1 : (move.type === "Fire" ? 1.5 : 1),
    // Note: negative dmg mod is special-cased in calcDamage as "heal instead"
  },

  thorned: {
    name: "Thorned",
    emoji: "🌹",
    cssClass: "trait-thorned",
    description: "Physical attackers take 1/8 of their max HP as recoil damage.",
    ngPlusOnly: false,
    onIncomingHit: (_d, _e, move, _dmg, attacker) => {
      if (move.cat !== "physical") return null;
      const recoil = Math.max(1, Math.floor(attacker.maxHP / 8));
      attacker.currentHP = Math.max(0, attacker.currentHP - recoil);
      if (attacker.currentHP <= 0) attacker.fainted = true;
      return { selfDmg: recoil, msg: `🌹 Thorned: ${attacker.name} took ${recoil} recoil damage!` };
    },
  },

  flame_aura: {
    name: "Flame Aura",
    emoji: "🔥",
    cssClass: "trait-flame-aura",
    description: "Physical attackers take 1/8 max HP as fire damage; possibly burned.",
    ngPlusOnly: false,
    onIncomingHit: (_d, _e, move, _dmg, attacker) => {
      if (move.cat !== "physical") return null;
      if (attacker.types?.includes("Fire")) return null; // Fire attackers immune
      const dmg = Math.max(1, Math.floor(attacker.maxHP / 8));
      attacker.currentHP = Math.max(0, attacker.currentHP - dmg);
      if (attacker.currentHP <= 0) attacker.fainted = true;
      return { selfDmg: dmg, msg: `🔥 Flame Aura: ${attacker.name} was scorched for ${dmg}!` };
    },
  },

  frost_aura: {
    name: "Frost Aura",
    emoji: "❄️",
    cssClass: "trait-frost-aura",
    description: "Physical attackers have a 20% chance to suffer Frostbite (Phase 3 status).",
    ngPlusOnly: false,
    onIncomingHit: (_d, _e, move, _dmg, attacker) => {
      if (move.cat !== "physical") return null;
      if (attacker.types?.includes("Ice") || attacker.types?.includes("Fire")) return null;
      if (Math.random() * 100 >= 20) return null;
      // Frostbite isn't a status yet; placeholder: apply hypothermia (active in STATUS_REGISTRY)
      if (typeof addStatus === "function" && addStatus(attacker, "hypothermia")) {
        return { msg: `❄️ Frost Aura: ${attacker.name} got hypothermia!` };
      }
      return null;
    },
  },

  toxic_aura: {
    name: "Toxic Aura",
    emoji: "☠️",
    cssClass: "trait-toxic-aura",
    description: "Physical attackers have a 20% chance to be poisoned.",
    ngPlusOnly: false,
    onIncomingHit: (_d, _e, move, _dmg, attacker) => {
      if (move.cat !== "physical") return null;
      if (Math.random() * 100 >= 20) return null;
      if (typeof addStatus === "function" && addStatus(attacker, "poison")) {
        return { msg: `☠️ Toxic Aura: ${attacker.name} was poisoned!` };
      }
      return null;
    },
  },

  premonition: {
    name: "Premonition",
    emoji: "🌟",
    cssClass: "trait-premonition",
    description: "50% chance to dodge priority moves.",
    ngPlusOnly: false,
    // Special hook handled in accuracy/turn-order path. Stub: a defender accuracyMod
    // that halves opponent's accuracy specifically on priority moves.
    accuracyMod: (_m, _e, isAttacking, move) => {
      if (isAttacking) return 1;
      if (move?.effect === "priority") return 0.5;
      return 1;
    },
  },

  last_stand: {
    name: "Last Stand",
    emoji: "🏴",
    cssClass: "trait-last-stand",
    description: "When below 20% HP, the next attack that would faint this Lumori instead leaves it at 1 HP and grants +2 Atk / +2 SpAtk. Once per battle.",
    ngPlusOnly: false,
    // Handled in damage application path. Battle code checks this trait before
    // finalizing fatal damage. Tracks per-battle trigger via mon._lastStandUsed flag.
    onLowHpTrigger: (mon, _e, _lowHpFraction) => null, // Stub — actual mechanic wired in Phase 3
  },

  lucky: {
    name: "Lucky",
    emoji: "🍀",
    cssClass: "trait-lucky",
    description: "Incoming critical hits are negated (treated as non-critical).",
    ngPlusOnly: false,
    forceCritImmune: () => true,
  },

  mirage: {
    name: "Mirage",
    emoji: "🌅",
    cssClass: "trait-mirage",
    description: "25% of incoming moves miss due to visual displacement.",
    ngPlusOnly: false,
    accuracyMod: (_m, _e, isAttacking) => isAttacking ? 1 : 0.75,
  },

  ironclad: {
    name: "Ironclad",
    emoji: "🛡️",
    cssClass: "trait-ironclad",
    description: "Physical damage taken is halved; special damage taken is doubled.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) =>
      move.cat === "physical" ? 0.5 : (move.cat === "special" ? 2.0 : 1),
  },

  greedy: {
    name: "Greedy",
    emoji: "💰",
    cssClass: "trait-greedy",
    description: "Drain effects heal this Lumori for double the normal amount.",
    ngPlusOnly: false,
    drainMod: () => 2.0,
  },

  symbiote: {
    name: "Symbiote",
    emoji: "🦠",
    cssClass: "trait-symbiote",
    description: "Held item effects are twice as strong on this Lumori.",
    ngPlusOnly: false,
    heldItemMod: () => 2.0,
  },

  vengeful: {
    name: "Vengeful",
    emoji: "😡",
    cssClass: "trait-vengeful",
    description: "When this Lumori takes damage, its next move deals +25% damage.",
    ngPlusOnly: false,
    onSelfDamageTaken: (mon) => {
      mon._vengefulPrimed = true;
      return null;
    },
    outgoingPowerMod: (attacker) => {
      if (attacker._vengefulPrimed) {
        attacker._vengefulPrimed = false;
        return 1.25;
      }
      return 1;
    },
  },

  bouncy: {
    name: "Bouncy",
    emoji: "🟢",
    cssClass: "trait-bouncy",
    description: "Physical moves bounce back 40% of damage to the attacker.",
    ngPlusOnly: false,
    onHitReflect: (_d, _e, move, dmgTaken, attacker) => {
      if (move.cat !== "physical") return null;
      const r = Math.max(1, Math.floor(dmgTaken * 0.4));
      return { reflectDmg: r, msg: `🟢 Bouncy: ${attacker.name} bounced back for ${r} damage!` };
    },
  },

  refracted: {
    name: "Refracted",
    emoji: "🌈",
    cssClass: "trait-refracted",
    description: "Special moves are refracted back 40% of damage to the attacker.",
    ngPlusOnly: false,
    onHitReflect: (_d, _e, move, dmgTaken, attacker) => {
      if (move.cat !== "special") return null;
      const r = Math.max(1, Math.floor(dmgTaken * 0.4));
      return { reflectDmg: r, msg: `🌈 Refracted: ${attacker.name} was refracted for ${r} damage!` };
    },
  },

  phase_shifted: {
    name: "Phase-shifted",
    emoji: "👁️",
    cssClass: "trait-phase-shifted",
    description: "Incoming damage is reduced by 25% on every 2nd turn (alternates each round).",
    ngPlusOnly: false,
    // Uses battle-context turn counter. Defaults to mon._phaseTurnCounter, incremented
    // by the battle loop. Phase 3 wires the increment; this stub reads it.
    incomingDmgMod: (defender) => {
      const t = defender._phaseTurnCounter || 0;
      return (t % 2 === 1) ? 0.75 : 1;
    },
  },

  // ====== Phase 2 will add ~180-220 more traits below this line ======
};


// ---- Per-Lumori assignment ----
// Filled in Phase 5. Each entry: { pool: [traitId1, traitId2?], ngPlusPool?: [...] }
// pool size 1 or 2; ngPlusPool only consulted in NG+ playthroughs.
const TRAIT_ASSIGNMENTS = {
  // Example shape (commented out until Phase 5):
  // 1: { pool: ["frosted"] },                                   // mono trait Lumori
  // 100: { pool: ["resonant", "ironclad"] },                    // dual trait Lumori
  // 250: { pool: ["mossy"], ngPlusPool: ["empowered"] },        // NG+ alt
};


// ---- Helpers ----

// Get the array of active trait ids for a battle-mon. Reads from mon.traits if set,
// otherwise falls back to TRAIT_ASSIGNMENTS[monsterId].pool (Phase 5 hookup).
function getMonTraits(mon) {
  if (Array.isArray(mon?.traits)) return mon.traits;
  return []; // Phase 5 fills this in
}

// Return the registry entry for a trait id, or null if unknown.
function getTraitDef(traitId) {
  return ABILITY_REGISTRY[traitId] || null;
}

// Does this mon have a specific trait active?
function hasTrait(mon, traitId) {
  return getMonTraits(mon).includes(traitId);
}

// Generic hook dispatcher — for any hook name, walks all of mon's active traits
// and calls the hook with the same signature as STATUS_REGISTRY hooks. The second
// argument is always null (no entry concept for traits). Caller decides how to
// combine results (multiplicative for damage mods, first-non-null for triggers).
function applyTraitHook(mon, hookName, ...args) {
  const results = [];
  for (const traitId of getMonTraits(mon)) {
    const reg = ABILITY_REGISTRY[traitId];
    if (reg?.[hookName]) {
      results.push({ traitId, value: reg[hookName](mon, null, ...args) });
    }
  }
  return results;
}

// Multiplicative aggregator for damage/power/heal/etc. modifiers
function aggregateMultMod(mon, hookName, ...args) {
  let m = 1;
  for (const traitId of getMonTraits(mon)) {
    const reg = ABILITY_REGISTRY[traitId];
    if (reg?.[hookName]) {
      const v = reg[hookName](mon, null, ...args);
      if (typeof v === "number") m *= v;
    }
  }
  return m;
}

// First-true aggregator for boolean immunity/block hooks
function aggregateBoolHook(mon, hookName, ...args) {
  for (const traitId of getMonTraits(mon)) {
    const reg = ABILITY_REGISTRY[traitId];
    if (reg?.[hookName] && reg[hookName](mon, null, ...args)) return true;
  }
  return false;
}

// First-non-null aggregator for trigger hooks (onHitReflect, onIncomingHit, etc.)
function aggregateFirstResult(mon, hookName, ...args) {
  for (const traitId of getMonTraits(mon)) {
    const reg = ABILITY_REGISTRY[traitId];
    if (reg?.[hookName]) {
      const r = reg[hookName](mon, null, ...args);
      if (r) return { traitId, ...r };
    }
  }
  return null;
}

// Check if a trait grants immunity to a specific status type
function isTraitImmuneToStatus(mon, statusType) {
  for (const traitId of getMonTraits(mon)) {
    const reg = ABILITY_REGISTRY[traitId];
    if (reg?.immuneToStatus?.includes(statusType)) return true;
  }
  return false;
}


// ---- Verbose battle-log helper ----
// Per-turn deduplication: a trait that procs N times in one turn (e.g. Thorned on
// a multi-hit move) logs once with "×N" rather than N spammed lines. Battle code
// resets the per-turn log accumulator at the start of each turn.

function startTraitLogTurn(mon) {
  mon._traitLogThisTurn = {};
}

function logTraitTrigger(mon, traitId, msg, _logFn) {
  if (!mon._traitLogThisTurn) mon._traitLogThisTurn = {};
  const counter = (mon._traitLogThisTurn[traitId] || 0) + 1;
  mon._traitLogThisTurn[traitId] = counter;
  return counter === 1 ? msg : `${msg.replace(/!$/, "")} (×${counter})`;
}


// Export for non-module environments (browser-loaded script)
if (typeof window !== "undefined") {
  window.ABILITY_REGISTRY = ABILITY_REGISTRY;
  window.TRAIT_ASSIGNMENTS = TRAIT_ASSIGNMENTS;
  window.getMonTraits = getMonTraits;
  window.getTraitDef = getTraitDef;
  window.hasTrait = hasTrait;
  window.applyTraitHook = applyTraitHook;
  window.aggregateMultMod = aggregateMultMod;
  window.aggregateBoolHook = aggregateBoolHook;
  window.aggregateFirstResult = aggregateFirstResult;
  window.isTraitImmuneToStatus = isTraitImmuneToStatus;
  window.startTraitLogTurn = startTraitLogTurn;
  window.logTraitTrigger = logTraitTrigger;
}
