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

  // ====== Phase 2 batch 1 — locked traits (27) ======

  // --- A. Type-immunity absorbers (10) ---
  one_with_the_sea: {
    name: "One with the Sea",
    emoji: "💧",
    cssClass: "trait-one-with-the-sea",
    description: "Aquatic moves heal 25% max HP and deal no damage to this Lumori.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) => move.type === "Aquatic" ? 0 : 1,
    onIncomingHit: (mon, _e, move) => {
      if (move.type !== "Aquatic") return null;
      const heal = Math.max(1, Math.floor(mon.maxHP * 0.25));
      mon.currentHP = Math.min(mon.maxHP, mon.currentHP + heal);
      return { msg: `💧 One with the Sea: ${mon.name} healed ${heal} HP!` };
    },
  },

  flare_absorption: {
    name: "Flare Absorption",
    emoji: "🔥",
    cssClass: "trait-flare-absorption",
    description: "Fire moves grant +1 Attack on hit; immune to Fire damage.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) => move.type === "Fire" ? 0 : 1,
    onIncomingHit: (mon, _e, move) => {
      if (move.type !== "Fire") return null;
      if (typeof applyStageChange === "function" && applyStageChange(mon, "atk", 1)) {
        return { msg: `🔥 Flare Absorption: ${mon.name}'s Attack rose!` };
      }
      return null;
    },
  },

  verdant_feast: {
    name: "Verdant Feast",
    emoji: "🌿",
    cssClass: "trait-verdant-feast",
    description: "Nature moves grant +1 Attack on hit; immune to Nature damage.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) => move.type === "Nature" ? 0 : 1,
    onIncomingHit: (mon, _e, move) => {
      if (move.type !== "Nature") return null;
      if (typeof applyStageChange === "function" && applyStageChange(mon, "atk", 1)) {
        return { msg: `🌿 Verdant Feast: ${mon.name}'s Attack rose!` };
      }
      return null;
    },
  },

  conductor: {
    name: "Conductor",
    emoji: "⚡",
    cssClass: "trait-conductor",
    description: "Electric moves restore PP to a move; immune to Electric damage.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) => move.type === "Electric" ? 0 : 1,
    onIncomingHit: (mon, _e, move) => {
      if (move.type !== "Electric") return null;
      const slot = mon.moves?.find(mv => mv.pp < mv.maxPP);
      if (slot) {
        slot.pp = Math.min(slot.maxPP, slot.pp + 3);
        const mvName = (typeof MOVES_DATA !== "undefined" ? MOVES_DATA[slot.id]?.name : null) || slot.id;
        return { msg: `⚡ Conductor: ${mon.name} regained 3 PP for ${mvName}!` };
      }
      return null;
    },
  },

  mind_feast: {
    name: "Mind-feast",
    emoji: "🧠",
    cssClass: "trait-mind-feast",
    description: "Mental moves heal 25% max HP; immune to Mental damage.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) => move.type === "Mental" ? 0 : 1,
    onIncomingHit: (mon, _e, move) => {
      if (move.type !== "Mental") return null;
      const heal = Math.max(1, Math.floor(mon.maxHP * 0.25));
      mon.currentHP = Math.min(mon.maxHP, mon.currentHP + heal);
      return { msg: `🧠 Mind-feast: ${mon.name} healed ${heal} HP!` };
    },
  },

  purge: {
    name: "Purge",
    emoji: "☠️",
    cssClass: "trait-purge",
    description: "Poison and Toxin moves heal 25% max HP; immune to both.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) =>
      (move.type === "Poison" || move.type === "Toxin") ? 0 : 1,
    onIncomingHit: (mon, _e, move) => {
      if (move.type !== "Poison" && move.type !== "Toxin") return null;
      const heal = Math.max(1, Math.floor(mon.maxHP * 0.25));
      mon.currentHP = Math.min(mon.maxHP, mon.currentHP + heal);
      return { msg: `☠️ Purge: ${mon.name} healed ${heal} HP!` };
    },
  },

  floating: {
    name: "Floating",
    emoji: "🪂",
    cssClass: "trait-floating",
    description: "Earth moves do nothing; Speed rises +1 stage on Earth-move hit.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) => move.type === "Earth" ? 0 : 1,
    onIncomingHit: (mon, _e, move) => {
      if (move.type !== "Earth") return null;
      if (typeof applyStageChange === "function" && applyStageChange(mon, "spe", 1)) {
        return { msg: `🪂 Floating: ${mon.name}'s Speed rose!` };
      }
      return null;
    },
  },

  echo_chamber: {
    name: "Echo Chamber",
    emoji: "🔇",
    cssClass: "trait-echo-chamber",
    description: "Sonic moves heal 25% max HP; immune to Sonic damage.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) => move.type === "Sonic" ? 0 : 1,
    onIncomingHit: (mon, _e, move) => {
      if (move.type !== "Sonic") return null;
      const heal = Math.max(1, Math.floor(mon.maxHP * 0.25));
      mon.currentHP = Math.min(mon.maxHP, mon.currentHP + heal);
      return { msg: `🔇 Echo Chamber: ${mon.name} healed ${heal} HP!` };
    },
  },

  vapor_vent: {
    name: "Vapor-vent",
    emoji: "💨",
    cssClass: "trait-vapor-vent",
    description: "Vapor moves grant +1 Sp.Def on hit; immune to Vapor damage.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) => move.type === "Vapor" ? 0 : 1,
    onIncomingHit: (mon, _e, move) => {
      if (move.type !== "Vapor") return null;
      if (typeof applyStageChange === "function" && applyStageChange(mon, "spd", 1)) {
        return { msg: `💨 Vapor-vent: ${mon.name}'s Sp.Def rose!` };
      }
      return null;
    },
  },

  wont_dream: {
    name: "Won't Dream",
    emoji: "💭",
    cssClass: "trait-wont-dream",
    description: "Dream moves heal 50% max HP; immune to Dream damage.",
    ngPlusOnly: false,
    incomingDmgMod: (_d, _e, move) => move.type === "Dream" ? 0 : 1,
    onIncomingHit: (mon, _e, move) => {
      if (move.type !== "Dream") return null;
      const heal = Math.max(1, Math.floor(mon.maxHP * 0.5));
      mon.currentHP = Math.min(mon.maxHP, mon.currentHP + heal);
      return { msg: `💭 Won't Dream: ${mon.name} healed ${heal} HP!` };
    },
  },

  // --- B. Stat-on-entry (5; #34 Scout dropped) ---
  intimidating_glare: {
    name: "Intimidating Glare",
    emoji: "😤",
    cssClass: "trait-intimidating-glare",
    description: "Lowers the opposing Lumori's Attack by 1 stage on entry.",
    ngPlusOnly: false,
    onEntry: (mon, _e, foe) => {
      if (!foe) return null;
      if (typeof applyStageChange === "function" && applyStageChange(foe, "atk", -1)) {
        return { msg: `😤 Intimidating Glare: ${foe.name}'s Attack fell!` };
      }
      return null;
    },
  },

  calming_presence: {
    name: "Calming Presence",
    emoji: "🧘",
    cssClass: "trait-calming-presence",
    description: "Lowers the opposing Lumori's Sp.Atk by 1 stage on entry.",
    ngPlusOnly: false,
    onEntry: (mon, _e, foe) => {
      if (!foe) return null;
      if (typeof applyStageChange === "function" && applyStageChange(foe, "spa", -1)) {
        return { msg: `🧘 Calming Presence: ${foe.name}'s Sp.Atk fell!` };
      }
      return null;
    },
  },

  surge_of_power: {
    name: "Surge of Power",
    emoji: "💪",
    cssClass: "trait-surge-of-power",
    description: "Raises own Attack by 1 stage on entry.",
    ngPlusOnly: false,
    onEntry: (mon) => {
      if (typeof applyStageChange === "function" && applyStageChange(mon, "atk", 1)) {
        return { msg: `💪 Surge of Power: ${mon.name}'s Attack rose!` };
      }
      return null;
    },
  },

  zoomer: {
    name: "Zoomer",
    emoji: "🏃",
    cssClass: "trait-zoomer",
    description: "Raises own Speed by 1 stage on entry.",
    ngPlusOnly: false,
    onEntry: (mon) => {
      if (typeof applyStageChange === "function" && applyStageChange(mon, "spe", 1)) {
        return { msg: `🏃 Zoomer: ${mon.name}'s Speed rose!` };
      }
      return null;
    },
  },

  ironbound: {
    name: "Ironbound",
    emoji: "⚙️",
    cssClass: "trait-ironbound",
    description: "Raises own Defense by 1 stage on entry.",
    ngPlusOnly: false,
    onEntry: (mon) => {
      if (typeof applyStageChange === "function" && applyStageChange(mon, "def", 1)) {
        return { msg: `⚙️ Ironbound: ${mon.name}'s Defense rose!` };
      }
      return null;
    },
  },

  // --- C. Status immunities (7) ---
  immune_system: {
    name: "Immune System",
    emoji: "🧬",
    cssClass: "trait-immune-system",
    description: "Cannot be afflicted with Poison, Bad Poison, Tainted, or Plague.",
    ngPlusOnly: false,
    immuneToStatus: ["poison", "badpoison", "tainted", "plague"],
  },

  frostproof: {
    name: "Frostproof",
    emoji: "❄️",
    cssClass: "trait-frostproof",
    description: "Cannot be Frozen or suffer Hypothermia.",
    ngPlusOnly: false,
    immuneToStatus: ["freeze", "hypothermia"],
  },

  pyroguard: {
    name: "Pyroguard",
    emoji: "🔥",
    cssClass: "trait-pyroguard",
    description: "Cannot be Burned or Burnt-out.",
    ngPlusOnly: false,
    immuneToStatus: ["burn", "burnt_out"],
  },

  insomniac: {
    name: "Insomniac",
    emoji: "👁️",
    cssClass: "trait-insomniac",
    description: "Cannot fall asleep.",
    ngPlusOnly: false,
    immuneToStatus: ["sleep"],
  },

  steel_nerves: {
    name: "Steel Nerves",
    emoji: "🪨",
    cssClass: "trait-steel-nerves",
    description: "Cannot be flinched.",
    ngPlusOnly: false,
    flinchImmune: true,
  },

  mind_fortress: {
    name: "Mind-fortress",
    emoji: "🛡️",
    cssClass: "trait-mind-fortress",
    description: "Immune to Confused, Disoriented, and Hexed.",
    ngPlusOnly: false,
    immuneToStatus: ["hexed", "disoriented"],
    confuseImmune: true,
  },

  wide_awake: {
    name: "Wide-awake",
    emoji: "☀️",
    cssClass: "trait-wide-awake",
    description: "Wakes from Sleep instantly; immune to Comatose.",
    ngPlusOnly: false,
    immuneToStatus: ["comatose"],
    instantWake: true,
  },

  // --- D. Speed-conditional (5; mechanics retuned to stage-based) ---
  adrenaline_burst: {
    name: "Adrenaline Burst",
    emoji: "💉",
    cssClass: "trait-adrenaline-burst",
    description: "Speed +1 stage while HP is below 30%.",
    ngPlusOnly: false,
    statMod: (mon) =>
      mon.currentHP < mon.maxHP * 0.3 ? { spe: 1 } : {},
  },

  bulkyness: {
    name: "Bulkyness",
    emoji: "🦏",
    cssClass: "trait-bulkyness",
    description: "Attack +1 stage and Speed -2 stages permanently — heavy and hard-hitting.",
    ngPlusOnly: false,
    statMod: () => ({ spe: -2, atk: 1 }),
  },

  wind_runner: {
    name: "Wind-runner",
    emoji: "🌬️",
    cssClass: "trait-wind-runner",
    description: "Speed rises +1 stage when hit by a Wind-type move.",
    ngPlusOnly: false,
    onIncomingHit: (mon, _e, move) => {
      if (move.type !== "Wind") return null;
      if (typeof applyStageChange === "function" && applyStageChange(mon, "spe", 1)) {
        return { msg: `🌬️ Wind-runner: ${mon.name}'s Speed rose from the gust!` };
      }
      return null;
    },
  },

  heated_sprint: {
    name: "Heated Sprint",
    emoji: "🔥",
    cssClass: "trait-heated-sprint",
    description: "Speed +2 stages while Burned — turning weakness into strength.",
    ngPlusOnly: false,
    statMod: (mon) =>
      (typeof hasStatus === "function" && hasStatus(mon, "burn")) ? { spe: 2 } : {},
  },

  energized: {
    name: "Energized",
    emoji: "🔋",
    cssClass: "trait-energized",
    description: "Speed +2 stages while own HP is above 50%.",
    ngPlusOnly: false,
    statMod: (mon) =>
      mon.currentHP > mon.maxHP * 0.5 ? { spe: 2 } : {},
  },

  // ====== Phase 2 batch 1 chunk 2 — 26 more locked traits ======

  // --- E. Move-power conditionals (7) ---
  heavy_hands: {
    name: "Heavy Hands",
    emoji: "🥊",
    cssClass: "trait-heavy-hands",
    description: "Punch and fist-flagged moves deal +30% power.",
    ngPlusOnly: false,
    outgoingPowerMod: (_a, _e, move) => {
      const n = (move.name || "").toLowerCase();
      return (n.includes("punch") || n.includes("fist") || n.includes("knuckle")) ? 1.3 : 1;
    },
  },

  crushing_bite: {
    name: "Crushing Bite",
    emoji: "🦷",
    cssClass: "trait-crushing-bite",
    description: "Bite-flagged moves deal +50% power.",
    ngPlusOnly: false,
    outgoingPowerMod: (_a, _e, move) => {
      const n = (move.name || "").toLowerCase();
      return (n.includes("bite") || n.includes("fang") || n.includes("chomp") || n.includes("crunch") || n.includes("maul")) ? 1.5 : 1;
    },
  },

  pulse_master: {
    name: "Pulse Master",
    emoji: "🌟",
    cssClass: "trait-pulse-master",
    description: "Pulse, beam, and orb-flagged moves deal +50% power.",
    ngPlusOnly: false,
    outgoingPowerMod: (_a, _e, move) => {
      const n = (move.name || "").toLowerCase();
      return (n.includes("pulse") || n.includes("beam") || n.includes("orb") || n.includes("blast")) ? 1.5 : 1;
    },
  },

  honed_edge: {
    name: "Honed Edge",
    emoji: "🗡️",
    cssClass: "trait-honed-edge",
    description: "Slice, blade, and cutting-flagged moves deal +50% power.",
    ngPlusOnly: false,
    outgoingPowerMod: (_a, _e, move) => {
      const n = (move.name || "").toLowerCase();
      return (n.includes("slash") || n.includes("cut") || n.includes("blade") || n.includes("slice") || n.includes("edge") || n.includes("razor")) ? 1.5 : 1;
    },
  },

  pyromaniac: {
    name: "Pyromaniac",
    emoji: "🔥",
    cssClass: "trait-pyromaniac",
    description: "Fire moves dealt by this Lumori +30% power; Fire moves taken +20% damage.",
    ngPlusOnly: false,
    outgoingPowerMod: (_a, _e, move) => move.type === "Fire" ? 1.3 : 1,
    incomingDmgMod: (_d, _e, move) => move.type === "Fire" ? 1.2 : 1,
  },

  storm_caller: {
    name: "Storm-caller",
    emoji: "⚡",
    cssClass: "trait-storm-caller",
    description: "Electric and Wind moves dealt by this Lumori +30% power.",
    ngPlusOnly: false,
    outgoingPowerMod: (_a, _e, move) =>
      (move.type === "Electric" || move.type === "Wind") ? 1.3 : 1,
  },

  bloodseeker: {
    name: "Bloodseeker",
    emoji: "🩸",
    cssClass: "trait-bloodseeker",
    description: "Moves vs Bleeding or Severely-Bleeding foes deal +50% damage.",
    ngPlusOnly: false,
    // Phase 3 dispatches with defender as 4th arg
    outgoingPowerMod: (_a, _e, _move, defender) => {
      if (!defender || typeof hasStatus !== "function") return 1;
      if (hasStatus(defender, "bleed") || hasStatus(defender, "severe_bleed")) return 1.5;
      return 1;
    },
  },

  // --- F. Crit-related (4) ---
  sharp_eyed: {
    name: "Sharp-eyed",
    emoji: "👁️",
    cssClass: "trait-sharp-eyed",
    description: "Crit rate raised by +2 stages — extremely crit-prone.",
    ngPlusOnly: false,
    // Adds bonus to attacker's crit rate. +2 stages ≈ +18.75 to base 6.25 (lands at 25%).
    selfCritBonus: () => 18.75,
  },

  sharpshooter: {
    name: "Sharpshooter",
    emoji: "🎯",
    cssClass: "trait-sharpshooter",
    description: "Critical hits deal ×2.5 damage instead of the usual ×1.5.",
    ngPlusOnly: false,
    critDamageMult: () => 2.5,
  },

  predator: {
    name: "Predator",
    emoji: "🐺",
    cssClass: "trait-predator",
    description: "Always lands a critical hit on foes below 50% HP.",
    ngPlusOnly: false,
    forceCritIf: (_a, _e, defender) =>
      !!(defender && defender.currentHP < defender.maxHP * 0.5),
  },

  killing_blow: {
    name: "Killing Blow",
    emoji: "☠️",
    cssClass: "trait-killing-blow",
    description: "Always lands a critical hit on foes with any active status.",
    ngPlusOnly: false,
    forceCritIf: (_a, _e, defender) => {
      if (!defender) return false;
      if (defender.statuses && defender.statuses.length > 0) return true;
      if (defender.isConfused) return true;
      return false;
    },
  },

  // --- G. Conditional damage modifiers (2; #63 Aura Break dropped) ---
  resilient_skin: {
    name: "Resilient Skin",
    emoji: "🛡️",
    cssClass: "trait-resilient-skin",
    description: "Super-effective moves vs this Lumori deal ×0.75 damage.",
    ngPlusOnly: false,
    // Phase 3 dispatches with computed effectiveness as 5th arg
    incomingDmgMod: (_d, _e, _move, _attacker, eff) =>
      (typeof eff === "number" && eff > 1) ? 0.75 : 1,
  },

  piercing_sight: {
    name: "Piercing Sight",
    emoji: "🔍",
    cssClass: "trait-piercing-sight",
    description: "Resisted moves used by this Lumori deal ×2 damage (effectively unresisting).",
    ngPlusOnly: false,
    // Phase 3 dispatches with computed effectiveness as 5th arg
    outgoingPowerMod: (_a, _e, _move, _defender, eff) =>
      (typeof eff === "number" && eff < 1 && eff > 0) ? 2.0 : 1,
  },

  // --- H. Health/recovery (5) ---
  rapid_recovery: {
    name: "Rapid Recovery",
    emoji: "🌿",
    cssClass: "trait-rapid-recovery",
    description: "Heals 1/3 max HP when switching out.",
    ngPlusOnly: false,
    onSwitchOut: (mon) => {
      const heal = Math.max(1, Math.floor(mon.maxHP / 3));
      mon.currentHP = Math.min(mon.maxHP, mon.currentHP + heal);
      return { msg: `🌿 Rapid Recovery: ${mon.name} healed ${heal} HP on switch!` };
    },
  },

  cellular_repair: {
    name: "Cellular Repair",
    emoji: "🧬",
    cssClass: "trait-cellular-repair",
    description: "Heals 1/16 max HP at the end of every turn.",
    ngPlusOnly: false,
    tickEffect: (mon) => {
      if (mon.currentHP >= mon.maxHP) return [];
      const heal = Math.max(1, Math.floor(mon.maxHP / 16));
      mon.currentHP = Math.min(mon.maxHP, mon.currentHP + heal);
      return [`🧬 Cellular Repair: ${mon.name} regenerated ${heal} HP!`];
    },
  },

  vampire: {
    name: "Vampire",
    emoji: "🩸",
    cssClass: "trait-vampire",
    description: "Heals for 25% of damage dealt by any attack.",
    ngPlusOnly: false,
    onDamageDealt: (attacker, _e, dmg) => {
      if (dmg <= 0) return null;
      const heal = Math.max(1, Math.floor(dmg * 0.25));
      attacker.currentHP = Math.min(attacker.maxHP, attacker.currentHP + heal);
      return { msg: `🩸 Vampire: ${attacker.name} drained ${heal} HP!` };
    },
  },

  phoenix_flame: {
    name: "Phoenix-Flame",
    emoji: "🔥",
    cssClass: "trait-phoenix-flame",
    description: "Once per battle, when knocked out, revives at 50% max HP.",
    ngPlusOnly: true,
    onFaint: (mon) => {
      if (mon._phoenixUsed) return null;
      mon._phoenixUsed = true;
      mon.currentHP = Math.max(1, Math.floor(mon.maxHP * 0.5));
      mon.fainted = false;
      return { msg: `🔥 Phoenix-Flame: ${mon.name} was reborn from the ashes!` };
    },
  },

  night_terror: {
    name: "Night Terror",
    emoji: "💤",
    cssClass: "trait-night-terror",
    description: "Foes that are Asleep or Comatose take -1/8 max HP each turn.",
    ngPlusOnly: false,
    // Phase 3 dispatches at end-of-turn iterating foes
    opponentTickEffect: (foe) => {
      if (typeof hasStatus !== "function") return null;
      if (!hasStatus(foe, "sleep") && !hasStatus(foe, "comatose")) return null;
      const dmg = Math.max(1, Math.floor(foe.maxHP / 8));
      foe.currentHP = Math.max(0, foe.currentHP - dmg);
      if (foe.currentHP <= 0) foe.fainted = true;
      return { msg: `💤 Night Terror: ${foe.name} suffered ${dmg} HP in its dreams!` };
    },
  },

  // --- I. Contact triggers (4) ---
  iron_spikes: {
    name: "Iron Spikes",
    emoji: "🌵",
    cssClass: "trait-iron-spikes",
    description: "Physical attackers have a 30% chance to flinch on contact.",
    ngPlusOnly: false,
    onIncomingHit: (_d, _e, move, _dmg, attacker) => {
      if (move.cat !== "physical") return null;
      if (Math.random() * 100 >= 30) return null;
      attacker._flinched = true;
      return { msg: `🌵 Iron Spikes: ${attacker.name} flinched!` };
    },
  },

  magnetic_skin: {
    name: "Magnetic Skin",
    emoji: "🧲",
    cssClass: "trait-magnetic-skin",
    description: "On physical contact, 50% chance to steal the attacker's held item (if any).",
    ngPlusOnly: false,
    onIncomingHit: (defender, _e, move, _dmg, attacker) => {
      if (move.cat !== "physical") return null;
      if (!attacker.heldItem || defender.heldItem) return null;
      if (Math.random() * 100 >= 50) return null;
      const stolen = attacker.heldItem;
      defender.heldItem = stolen;
      attacker.heldItem = null;
      return { msg: `🧲 Magnetic Skin: ${defender.name} stole ${attacker.name}'s ${stolen}!` };
    },
  },

  slime_coat: {
    name: "Slime Coat",
    emoji: "🦠",
    cssClass: "trait-slime-coat",
    description: "Physical attackers have a 30% chance to be Smothered.",
    ngPlusOnly: false,
    onIncomingHit: (_d, _e, move, _dmg, attacker) => {
      if (move.cat !== "physical") return null;
      if (Math.random() * 100 >= 30) return null;
      if (typeof addStatus === "function" && addStatus(attacker, "smothered")) {
        return { msg: `🦠 Slime Coat: ${attacker.name} was smothered!` };
      }
      return null;
    },
  },

  bewitching: {
    name: "Bewitching",
    emoji: "💕",
    cssClass: "trait-bewitching",
    description: "Physical attackers have a 30% chance to be Confused.",
    ngPlusOnly: false,
    onIncomingHit: (_d, _e, move, _dmg, attacker) => {
      if (move.cat !== "physical") return null;
      if (Math.random() * 100 >= 30) return null;
      if (attacker.isConfused) return null;
      attacker.isConfused = true;
      attacker.confuseTurns = 2 + Math.floor(Math.random() * 3);
      return { msg: `💕 Bewitching: ${attacker.name} became confused!` };
    },
  },

  // --- J. Move type modification (4) ---
  pyroform: {
    name: "Pyroform",
    emoji: "🔥",
    cssClass: "trait-pyroform",
    description: "Normal-type moves used by this Lumori become Fire-type (gains STAB if Fire).",
    ngPlusOnly: false,
    moveTypeOverride: (_a, _e, move) => move.type === "Normal" ? "Fire" : null,
  },

  crystal_tipped: {
    name: "Crystal-tipped",
    emoji: "💎",
    cssClass: "trait-crystal-tipped",
    description: "Normal-type moves used by this Lumori become Crystal-type.",
    ngPlusOnly: true,
    moveTypeOverride: (_a, _e, move) => move.type === "Normal" ? "Crystal" : null,
  },

  aqua_tongue: {
    name: "Aqua-tongue",
    emoji: "💧",
    cssClass: "trait-aqua-tongue",
    description: "Sound-keyword moves (any Sonic-style move) used by this Lumori become Aquatic-type.",
    ngPlusOnly: false,
    moveTypeOverride: (_a, _e, move) => {
      const n = (move.name || "").toLowerCase();
      const isSound = move.type === "Sonic" || n.includes("sound") || n.includes("shriek") || n.includes("cry") || n.includes("howl") || n.includes("roar");
      return isSound ? "Aquatic" : null;
    },
  },

  variform: {
    name: "Variform",
    emoji: "🔀",
    cssClass: "trait-variform",
    description: "Player picks the type of each outgoing move this turn (chosen at move-select).",
    ngPlusOnly: true,
    // Phase 3 wires the per-turn type-pick UI; data layer just declares the hook
    moveTypeOverride: (attacker, _e, move) =>
      attacker._chosenMoveType || null,
  },

  // ====== Phase 2 batch 1 — 35 candidates (77-89) still under review ======
  // ====== Phase 2 batches 2+ will add the remaining traits below ======
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
