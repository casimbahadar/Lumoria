// ============================================================
// LUMORIA - Battle Engine
// ============================================================

const BattleState = {
  active: false,
  playerMon: null,
  enemyMon: null,
  isWild: false,
  isGym: false,
  isChampion: false,
  gymLeaderId: null,
  enemyTeam: [],
  enemyTeamIndex: 0,
  playerTeamIndex: 0,
  playerWaiting: false,
  turnInProgress: false,
  onBattleEnd: null,
  log: []
};

// ---- Helpers ----

function rollPercent(chance) { return Math.random() * 100 < chance; }
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function stageMultiplier(stage) {
  return [0.25,0.29,0.33,0.4,0.5,0.67,1,1.5,2,2.5,3,3.5,4][stage + 6];
}

// ---- Status System (multi-status capable; backward-compat shim for legacy slot.status) ----
//
// Each mon carries `statuses: [{type, turns, ...}]`. Old saves with `slot.status` (string)
// are migrated via `migrateStatuses(slot)` at every read entry point.
//
// STATUS_REGISTRY is data-driven: Phase 3 adds the 19 new status types by appending rows.

const STATUS_REGISTRY = {
  // ===== PHASE 1: the original 6 =====
  burn: {
    emoji: "🔥", label: "BURN", cssClass: "status-burn", immuneTypes: ["Fire"],
    applyMsg: name => `🔥 ${name} was burned!`,
    tickDamage: mon => Math.max(1, Math.floor(mon.maxHP / 8)),
    tickMsg: (name, dmg) => `🔥 ${name} is hurt by burn! (-${dmg})`,
  },
  poison: {
    emoji: "☠️", label: "POISON", cssClass: "status-poison", immuneTypes: ["Poison","Steel"],
    applyMsg: name => `☠️ ${name} was poisoned!`,
    tickDamage: mon => Math.max(1, Math.floor(mon.maxHP / 8)),
    tickMsg: (name, dmg) => `☠️ ${name} is hurt by poison! (-${dmg})`,
  },
  badpoison: {
    emoji: "☠️", label: "TOXIC", cssClass: "status-poison", immuneTypes: ["Poison","Steel"],
    applyMsg: name => `☠️ ${name} was badly poisoned!`,
    initialTurns: 1,
    tickDamage: (mon, entry) => Math.max(1, Math.floor(mon.maxHP * (entry.turns || 1) / 16)),
    tickMsg: (name, dmg) => `☠️ ${name} is hurt by bad poison! (-${dmg})`,
    tickAfter: entry => { entry.turns = (entry.turns || 1) + 1; },
  },
  paralyze: {
    emoji: "⚡", label: "PARALYZE", cssClass: "status-paralyze", immuneTypes: ["Electric"],
    applyMsg: name => `⚡ ${name} was paralyzed!`,
    blocksMove: mon => rollPercent(25)
      ? { can: false, msg: `⚡ ${mon.name} is paralyzed and can't move!` }
      : null,
  },
  freeze: {
    emoji: "🧊", label: "FREEZE", cssClass: "status-freeze", immuneTypes: ["Ice"],
    applyMsg: name => `🧊 ${name} was frozen solid!`,
    blocksMove: (mon, entry) => {
      if (rollPercent(20)) { removeStatus(mon, "freeze"); return { can: true, msg: `${mon.name} thawed out!` }; }
      return { can: false, msg: `🧊 ${mon.name} is frozen solid!` };
    },
  },
  sleep: {
    emoji: "💤", label: "SLEEP", cssClass: "status-sleep", immuneTypes: [],
    applyMsg: name => `💤 ${name} fell asleep!`,
    initialTurns: () => 2 + Math.floor(Math.random() * 3),
    blocksMove: (mon, entry) => {
      if (--entry.turns <= 0) { removeStatus(mon, "sleep"); return { can: true, msg: `${mon.name} woke up!` }; }
      return { can: false, msg: `💤 ${mon.name} is fast asleep!` };
    },
  },

  // ===== PHASE 3: TODO 821 locked statuses (13) =====
  bleed: {
    emoji: "🩸", label: "BLEED", cssClass: "status-bleed",
    immuneTypes: ["Metal", "Crystal", "Spectral"],
    applyMsg: name => `🩸 ${name} started bleeding!`,
    tickDamage: mon => Math.max(1, Math.floor(mon.maxHP / 16)),
    tickMsg: (name, dmg) => `🩸 ${name} loses blood! (-${dmg})`,
    evolvesTo: "severe_bleed", evolveAt: 3,
  },
  severe_bleed: {
    emoji: "🩸", label: "SEVERE BLEED", cssClass: "status-severe-bleed",
    immuneTypes: ["Metal", "Crystal", "Spectral"],
    applyMsg: name => `🩸 ${name} is hemorrhaging!`,
    tickDamage: mon => Math.max(1, Math.floor(mon.maxHP / 8)),
    tickMsg: (name, dmg) => `🩸 ${name} hemorrhages! (-${dmg})`,
  },
  petrify: {
    emoji: "🗿", label: "PETRIFY", cssClass: "status-petrify",
    immuneTypes: ["Mineral", "Crystal", "Metal"],
    applyMsg: name => `🗿 ${name} is petrifying!`,
    statMod: () => ({ spe: -1 }),
    blocksMove: mon => rollPercent(25)
      ? { can: false, msg: `🗿 ${mon.name} can't move — petrified!` }
      : null,
    evolvesTo: "statue", evolveAt: 2,
  },
  statue: {
    emoji: "🗿", label: "STATUE", cssClass: "status-statue",
    immuneTypes: ["Mineral", "Crystal", "Metal"],
    applyMsg: name => `🗿 ${name} turned to stone!`,
    statMod: () => ({ def: +2 }),
    blocksMove: mon => ({ can: false, msg: `🗿 ${mon.name} is a statue and can't move!` }),
  },
  drenched: {
    emoji: "💧", label: "DRENCHED", cssClass: "status-drenched",
    immuneTypes: ["Aquatic", "Vapor"],
    applyMsg: name => `💧 ${name} was drenched!`,
    statMod: () => ({ spe: -1 }),
    incomingDmgMod: (_d, _e, move) =>
      move.type === "Fire" ? 0.5 : (move.type === "Electric" ? 2 : 1),
    evolvesTo: "soaked", evolveAt: 2,
  },
  soaked: {
    emoji: "💦", label: "SOAKED", cssClass: "status-soaked",
    immuneTypes: ["Aquatic", "Vapor"],
    applyMsg: name => `💦 ${name} is fully soaked!`,
    statMod: () => ({ spe: -2 }),
    incomingDmgMod: (_d, _e, move) =>
      move.type === "Fire" ? 0.5 : (move.type === "Electric" ? 2 : 1),
    tickDamage: mon => Math.max(1, Math.floor(mon.maxHP / 16)),
    tickMsg: (name, dmg) => `💦 ${name} shivers from the soak! (-${dmg})`,
  },
  weighed_down: {
    emoji: "🪨", label: "WEIGHED DOWN", cssClass: "status-weighed",
    immuneTypes: ["Wind", "Spectral"],
    applyMsg: name => `🪨 ${name} is weighed down!`,
    statMod: () => ({ spe: -2 }),
    blocksSwitch: () => true,
  },
  crystallize: {
    emoji: "💎", label: "CRYSTALLIZE", cssClass: "status-crystallize",
    immuneTypes: ["Aquatic"],
    applyMsg: name => `💎 ${name} is crystallizing!`,
    statMod: () => ({ def: +1, spd: +1, spe: -2 }),
  },
  echolocation: {
    emoji: "📡", label: "ECHOLOCATION", cssClass: "status-echolocation",
    immuneTypes: [],
    applyMsg: name => `📡 ${name} locked onto sound!`,
    forceHit: (_m, _e, isAtk) => isAtk,
    maxTurns: 3,
  },
  smothered: {
    emoji: "😶", label: "SMOTHERED", cssClass: "status-smothered",
    immuneTypes: ["Sonic", "Wind"],
    applyMsg: name => `😶 ${name} is smothered!`,
    accuracyMod: (_m, _e, isAtk) => isAtk ? 0.5 : 1,
  },
  marked: {
    emoji: "🎯", label: "MARKED", cssClass: "status-marked",
    immuneTypes: [],
    applyMsg: name => `🎯 ${name} was marked!`,
    incomingDmgMod: () => 1.5,
    evolvesTo: "hunted", evolveAt: 2,
  },
  burnt_out: {
    emoji: "🧯", label: "BURNT-OUT", cssClass: "status-burnt-out",
    immuneTypes: ["Fire"],
    applyMsg: name => `🧯 ${name} is burnt out!`,
    statMod: () => ({ atk: -1 }),
    evolvesTo: "crippled", evolveAt: 2,
  },
  faded: {
    emoji: "👻", label: "FADED", cssClass: "status-faded",
    immuneTypes: ["Spectral"],
    applyMsg: name => `👻 ${name} is fading!`,
    statMod: () => ({ spe: -1 }),
    accuracyMod: (_m, _e, isAtk) => isAtk ? 0.75 : 1,
  },
  strained: {
    emoji: "💪", label: "STRAINED", cssClass: "status-strained",
    immuneTypes: [],
    applyMsg: name => `💪 ${name} is strained!`,
    outgoingPowerMod: (_m, _e, move) => move.cat === "physical" ? 0.75 : 1,
    evolvesTo: "exhausted", evolveAt: 3,
  },
  sluggish: {
    emoji: "🐌", label: "SLUGGISH", cssClass: "status-sluggish",
    immuneTypes: ["Sonic"],
    applyMsg: name => `🐌 ${name} feels sluggish!`,
    statMod: () => ({ spe: -2 }),
    blocksMove: mon => rollPercent(25)
      ? { can: false, msg: `🐌 ${mon.name} is too sluggish to act!` }
      : null,
  },
  brittle: {
    emoji: "🥶", label: "BRITTLE", cssClass: "status-brittle",
    immuneTypes: ["Aquatic", "Spectral"],
    applyMsg: name => `🥶 ${name} became brittle!`,
    incomingDmgMod: (_d, _e, move) => move.cat === "physical" ? 1.5 : 1,
  },
  tainted: {
    emoji: "🦠", label: "TAINTED", cssClass: "status-tainted",
    immuneTypes: ["Toxin", "Poison", "Metal"],
    applyMsg: name => `🦠 ${name} was tainted!`,
    tickDamage: mon => Math.max(1, Math.floor(mon.maxHP / 16)),
    tickMsg: (name, dmg) => `🦠 ${name} is tainted! (-${dmg})`,
    healMod: () => 0.5,
    evolvesTo: "corroded", evolveAt: 3,
  },
  hexed: {
    emoji: "🔮", label: "HEXED", cssClass: "status-hexed",
    immuneTypes: ["Spectral", "Dream"],
    applyMsg: name => `🔮 ${name} was hexed!`,
    tickEffect: (mon) => {
      const stats = ["atk", "def", "spa", "spd", "spe"];
      const stat = stats[Math.floor(Math.random() * stats.length)];
      if (applyStageChange(mon, stat, -1)) {
        return [`🔮 ${mon.name}'s ${stat.toUpperCase()} fell from the hex!`];
      }
      return [];
    },
  },
  deafen: {
    emoji: "🔇", label: "DEAFEN", cssClass: "status-deafen",
    immuneTypes: ["Spectral", "Mineral"],
    applyMsg: name => `🔇 ${name} was deafened!`,
    incomingDmgMod: (_d, _e, move) => move.type === "Sonic" ? 0 : 1,
  },

  // ===== PHASE 3: new pure-statuses (16) =====
  hypothermia: {
    emoji: "🧊", label: "HYPOTHERMIA", cssClass: "status-hypothermia",
    immuneTypes: ["Ice", "Fire"],
    applyMsg: name => `🧊 ${name} has hypothermia!`,
    statMod: () => ({ atk: -1, spe: -1 }),
  },
  disoriented: {
    emoji: "🌀", label: "DISORIENTED", cssClass: "status-disoriented",
    immuneTypes: ["Mental"],
    applyMsg: name => `🌀 ${name} is disoriented!`,
    interceptMove: (_m, _e, chosenMove, moveset) => {
      if (rollPercent(30) && moveset.length > 1) {
        const others = moveset.filter(m => m.id !== chosenMove.id);
        return others.length ? others[Math.floor(Math.random() * others.length)] : chosenMove;
      }
      return chosenMove;
    },
    interceptMsg: (mon, sub) =>
      `🌀 ${mon.name} is disoriented — used ${MOVES_DATA[sub.id]?.name || sub.id} instead!`,
    evolvesTo: "comatose", evolveAt: 3,
  },
  migraine: {
    emoji: "🤕", label: "MIGRAINE", cssClass: "status-migraine",
    immuneTypes: [],
    applyMsg: name => `🤕 ${name} has a migraine!`,
    outgoingPowerMod: (_a, _e, move) => move.cat === "special" ? 0.75 : 1,
    evolvesTo: "concussion", evolveAt: 2,
  },
  mind_numb: {
    emoji: "🧠", label: "MIND-NUMB", cssClass: "status-mind-numb",
    immuneTypes: [],
    applyMsg: name => `🧠 ${name}'s mind is numb!`,
    blocksOutgoingMove: (mon, _e, move) =>
      move.cat === "status" ? { msg: `🧠 ${mon.name}'s mind is too numb for status moves!` } : null,
  },
  adrenaline: {
    emoji: "💪", label: "ADRENALINE", cssClass: "status-adrenaline",
    immuneTypes: [],
    applyMsg: name => `💪 ${name}'s adrenaline surged!`,
    statMod: () => ({ atk: +1, spe: +1, def: -1, spd: -1 }),
    maxTurns: 3,
  },
  inspired: {
    emoji: "✨", label: "INSPIRED", cssClass: "status-inspired",
    immuneTypes: [],
    applyMsg: name => `✨ ${name} is inspired!`,
    tickEffect: (mon) => {
      const stats = ["atk", "def", "spa", "spd", "spe"];
      const stat = stats[Math.floor(Math.random() * stats.length)];
      if (applyStageChange(mon, stat, +1)) {
        return [`✨ ${mon.name}'s ${stat.toUpperCase()} rose from inspiration!`];
      }
      return [];
    },
    maxTurns: 3,
  },
  tangled: {
    emoji: "🌿", label: "TANGLED", cssClass: "status-tangled",
    immuneTypes: ["Spectral"],
    applyMsg: name => `🌿 ${name} got tangled!`,
    blocksOutgoingMove: (mon, _e, move) => {
      const fx = move.effect || "";
      const speMods = ["speup","spedown","spedown2","dragondance"];
      if (speMods.includes(fx) || fx.includes("speup_self") || fx.includes("spedown")) {
        return { msg: `🌿 ${mon.name} is too tangled to use speed-altering moves!` };
      }
      return null;
    },
    evolvesTo: "bound", evolveAt: 2,
  },
  tethered: {
    emoji: "⛓️", label: "TETHERED", cssClass: "status-tethered",
    immuneTypes: ["Spectral"],
    applyMsg: name => `⛓️ ${name} is tethered!`,
    switchCost: () => 0.5,
    evolvesTo: "anchored", evolveAt: 2,
  },
  necrosis: {
    emoji: "💀", label: "NECROSIS", cssClass: "status-necrosis",
    immuneTypes: ["Toxin", "Poison"],
    applyMsg: name => `💀 ${name} suffers necrosis!`,
    tickDamage: mon => Math.max(1, Math.floor(mon.maxHP / 16)),
    tickMsg: (name, dmg) => `💀 ${name}'s flesh rots! (-${dmg})`,
    healMod: () => 0,
  },
  plague: {
    emoji: "🦟", label: "PLAGUE", cssClass: "status-plague",
    immuneTypes: ["Toxin"],
    applyMsg: name => `🦟 ${name} contracted the plague!`,
    tickDamage: mon => Math.max(1, Math.floor(mon.maxHP / 16)),
    tickMsg: (name, dmg) => `🦟 ${name} is plagued! (-${dmg})`,
    // Note: multi-battle spread-to-allies deferred (needs per-turn cross-mon hook)
  },
  mirrored: {
    emoji: "🪞", label: "MIRRORED", cssClass: "status-mirrored",
    immuneTypes: [],
    applyMsg: name => `🪞 ${name} is mirrored!`,
    onHitReflect: (_d, entry, move, dmgTaken, attacker) => {
      if (entry._reflectedThisTurn) return null;
      if (move.cat !== "physical") return null;
      if (!rollPercent(30)) return null;
      entry._reflectedThisTurn = true;
      const reflect = Math.max(1, Math.floor(dmgTaken * 0.3));
      return { reflectDmg: reflect, msg: `🪞 ${attacker.name} took ${reflect} reflected damage!` };
    },
    tickAfter: entry => { delete entry._reflectedThisTurn; },
  },
  possessed: {
    emoji: "👹", label: "POSSESSED", cssClass: "status-possessed",
    immuneTypes: ["Spectral"],
    applyMsg: name => `👹 ${name} is possessed!`,
    interceptMove: (_m, _e, chosenMove, moveset) => {
      if (rollPercent(30) && moveset.length > 1) {
        return moveset[Math.floor(Math.random() * moveset.length)];
      }
      return chosenMove;
    },
    interceptMsg: (mon, sub) =>
      `👹 ${mon.name} is possessed — forced to use ${MOVES_DATA[sub.id]?.name || sub.id}!`,
  },
  muted: {
    emoji: "🔕", label: "MUTED", cssClass: "status-muted",
    immuneTypes: ["Mineral"],
    applyMsg: name => `🔕 ${name} was muted!`,
    blocksOutgoingMove: (mon, _e, move) =>
      move.type === "Sonic" ? { msg: `🔕 ${mon.name} is muted — can't use Sonic moves!` } : null,
  },
  sealed: {
    emoji: "🪶", label: "SEALED", cssClass: "status-sealed",
    immuneTypes: [],
    applyMsg: name => `🪶 ${name} was sealed!`,
    onApply: (mon, entry) => {
      // Pick a type the mon currently has (most punishing); fallback to random type
      const pool = mon.types && mon.types.length ? mon.types : Object.keys(TYPE_CHART);
      entry.sealedType = pool[Math.floor(Math.random() * pool.length)];
    },
    blocksOutgoingMove: (mon, entry, move) =>
      move.type === entry.sealedType
        ? { msg: `🪶 ${mon.name} is sealed — can't use ${entry.sealedType} moves!` }
        : null,
  },
  bonded: {
    emoji: "💞", label: "BONDED", cssClass: "status-bonded",
    immuneTypes: [],
    applyMsg: name => `💞 ${name} is bonded!`,
    // Note: multi-battle dmg-share-with-ally deferred (needs cross-mon hook)
  },
  type_distorted: {
    emoji: "🔀", label: "TYPE DISTORTED", cssClass: "status-type-distorted",
    immuneTypes: [],
    applyMsg: name => `🔀 ${name}'s types are distorted!`,
    onApply: (mon, entry) => {
      const allTypes = Object.keys(TYPE_CHART);
      entry.originalTypes = [...mon.types];
      const changeBoth = rollPercent(50);
      const newTypes = [...mon.types];
      newTypes[0] = allTypes[Math.floor(Math.random() * allTypes.length)];
      if (changeBoth && newTypes.length > 1) {
        newTypes[1] = allTypes[Math.floor(Math.random() * allTypes.length)];
      }
      mon.types = newTypes;
    },
    evolvesTo: "type_shattered", evolveAt: 3,
  },

  // ===== PHASE 3: dual-pool statuses (3) — also seed the abilities pool =====
  bouncy: {
    emoji: "🟢", label: "BOUNCY", cssClass: "status-bouncy",
    immuneTypes: ["Spectral"],
    applyMsg: name => `🟢 ${name} is bouncy!`,
    onHitReflect: (_d, _e, move, dmgTaken, attacker) => {
      if (move.cat !== "physical") return null;
      const reflect = Math.max(1, Math.floor(dmgTaken * 0.4));
      return { reflectDmg: reflect, msg: `🟢 ${attacker.name} bounced back ${reflect} damage!` };
    },
  },
  refracted: {
    emoji: "🌈", label: "REFRACTED", cssClass: "status-refracted",
    immuneTypes: ["Spectral"],
    applyMsg: name => `🌈 ${name} is refracted!`,
    onHitReflect: (_d, _e, move, dmgTaken, attacker) => {
      if (move.cat !== "special") return null;
      const reflect = Math.max(1, Math.floor(dmgTaken * 0.4));
      return { reflectDmg: reflect, msg: `🌈 ${attacker.name} was refracted for ${reflect} damage!` };
    },
  },
  phase_shifted: {
    emoji: "👁️", label: "PHASE-SHIFTED", cssClass: "status-phase-shifted",
    immuneTypes: ["Spectral"],
    applyMsg: name => `👁️ ${name} is phase-shifted!`,
    // 0.75× incoming dmg on every 2nd turn (turnsActive 1, 3, 5... since we increment after the tick)
    incomingDmgMod: (_d, entry) => ((entry.turnsActive || 0) % 2 === 1) ? 0.75 : 1,
  },

  // ===== PHASE 3: evolved forms (9) =====
  crippled: {
    emoji: "🩼", label: "CRIPPLED", cssClass: "status-crippled",
    immuneTypes: ["Fire"],
    applyMsg: name => `🩼 ${name} is crippled!`,
    statMod: () => ({ atk: -2 }),
    blocksOutgoingMove: (mon, _e, move) =>
      move.cat === "physical"
        ? { msg: `🩼 ${mon.name} is crippled — can't use physical moves!` }
        : null,
  },
  corroded: {
    emoji: "🪤", label: "CORRODED", cssClass: "status-corroded",
    immuneTypes: ["Toxin", "Poison", "Metal"],
    applyMsg: name => `🪤 ${name} is corroded!`,
    tickDamage: mon => Math.max(1, Math.floor(mon.maxHP / 8)),
    tickMsg: (name, dmg) => `🪤 ${name} corrodes deeper! (-${dmg})`,
    healMod: () => 0,
    statMod: () => ({ def: -1 }),
  },
  bound: {
    emoji: "🪢", label: "BOUND", cssClass: "status-bound",
    immuneTypes: ["Spectral"],
    applyMsg: name => `🪢 ${name} is bound!`,
    blocksOutgoingMove: (mon, _e, move) =>
      move.cat === "physical"
        ? { msg: `🪢 ${mon.name} is bound — physical moves blocked!` }
        : null,
  },
  anchored: {
    emoji: "⚓", label: "ANCHORED", cssClass: "status-anchored",
    immuneTypes: ["Spectral"],
    applyMsg: name => `⚓ ${name} is anchored!`,
    blocksSwitch: () => true,
    tickDamage: mon => Math.max(1, Math.floor(mon.maxHP / 16)),
    tickMsg: (name, dmg) => `⚓ ${name} strains against the anchor! (-${dmg})`,
  },
  comatose: {
    emoji: "😵", label: "COMATOSE", cssClass: "status-comatose",
    immuneTypes: ["Mental"],
    applyMsg: name => `😵 ${name} is comatose!`,
    blocksMove: mon => rollPercent(50)
      ? { can: false, msg: `😵 ${mon.name} is unconscious!` }
      : null,
  },
  hunted: {
    emoji: "🏹", label: "HUNTED", cssClass: "status-hunted",
    immuneTypes: [],
    applyMsg: name => `🏹 ${name} is being hunted!`,
    incomingDmgMod: () => 2.0,
    opponentCritBonus: () => 6.25, // doubles default base crit (6.25 + 6.25 = 12.5)
  },
  exhausted: {
    emoji: "😮‍💨", label: "EXHAUSTED", cssClass: "status-exhausted",
    immuneTypes: [],
    applyMsg: name => `😮‍💨 ${name} is exhausted!`,
    outgoingPowerMod: () => 0.5,
  },
  concussion: {
    emoji: "🤕", label: "CONCUSSION", cssClass: "status-concussion",
    immuneTypes: [],
    applyMsg: name => `🤕 ${name} has a concussion!`,
    outgoingPowerMod: (_a, _e, move) => move.cat === "special" ? 0.5 : 1,
    onMoveAttempt: (mon) => {
      if (rollPercent(30)) {
        const selfDmg = Math.max(1, Math.floor(mon.maxHP / 8));
        mon.currentHP = Math.max(0, mon.currentHP - selfDmg);
        if (mon.currentHP <= 0) mon.fainted = true;
        return { selfHit: true, dmg: selfDmg, msg: `🤕 ${mon.name} hurt itself in concussion! (-${selfDmg})` };
      }
      return null;
    },
  },
  type_shattered: {
    emoji: "🌀", label: "TYPE SHATTERED", cssClass: "status-type-shattered",
    immuneTypes: [],
    applyMsg: name => `🌀 ${name}'s types are shattered!`,
    onApply: (mon, entry) => {
      const allTypes = Object.keys(TYPE_CHART);
      entry.originalTypes = entry.originalTypes || [...mon.types];
      const newTypes = [...mon.types];
      newTypes[0] = allTypes[Math.floor(Math.random() * allTypes.length)];
      if (newTypes.length > 1) {
        newTypes[1] = allTypes[Math.floor(Math.random() * allTypes.length)];
      }
      mon.types = newTypes;
    },
    // Flat 1.33× incoming damage, overriding the chart for the new (random) types
    effectivenessOverride: () => 1.33,
  },
};

function getStatusEntry(mon, type) {
  return mon.statuses?.find(s => s.type === type);
}
function hasStatus(mon, type) {
  return !!getStatusEntry(mon, type);
}
function hasAnyStatus(mon) {
  return !!(mon.statuses && mon.statuses.length > 0);
}
function addStatus(mon, type, opts = {}) {
  if (!mon.statuses) mon.statuses = [];
  if (hasStatus(mon, type)) return false;
  const reg = STATUS_REGISTRY[type];
  if (!reg) return false;
  if (reg.immuneTypes && reg.immuneTypes.some(t => mon.types?.includes(t))) return false;
  // Phase 3a: trait-based status immunity
  if (typeof isTraitImmuneToStatus === "function" && isTraitImmuneToStatus(mon, type)) return false;
  if (_traitConditionalImmuneToStatus(mon, type)) return false;
  // Confused-immunity (Mind-fortress etc.) and flinch-immunity (Steel Nerves) handled in canMove
  const turns = typeof reg.initialTurns === "function" ? reg.initialTurns()
              : (reg.initialTurns ?? 0);
  const entry = { type, turns, turnsActive: 0, ...opts };
  mon.statuses.push(entry);
  if (reg.onApply) reg.onApply(mon, entry);
  return true;
}
function removeStatus(mon, type) {
  if (!mon.statuses) return false;
  const idx = mon.statuses.findIndex(s => s.type === type);
  if (idx >= 0) { mon.statuses.splice(idx, 1); return true; }
  return false;
}

// Migrate legacy single-string status format -> statuses array. Idempotent.
function migrateStatuses(obj) {
  if (!obj) return;
  if (Array.isArray(obj.statuses)) {
    delete obj.status; delete obj.poisonTurns; delete obj.sleepTurns;
    return;
  }
  obj.statuses = [];
  if (obj.status) {
    const entry = { type: obj.status, turns: 0 };
    if (obj.status === "sleep" && obj.sleepTurns) entry.turns = obj.sleepTurns;
    if (obj.status === "badpoison" && obj.poisonTurns) entry.turns = obj.poisonTurns;
    obj.statuses.push(entry);
  }
  delete obj.status; delete obj.poisonTurns; delete obj.sleepTurns;
}

function clearStatuses(obj) {
  obj.statuses = [];
  delete obj.status; delete obj.poisonTurns; delete obj.sleepTurns;
}

// ---- Status-aggregator helpers (Phase 3) ----
// Each iterates a mon's active statuses, querying the registry for the
// matching hook and combining results across all entries.

// ---- Phase 3a: trait dispatch helpers ----
// Iterate a mon's active traits, invoking `fn(traitRegistryEntry, traitId)` for each.
// No-op if traits system isn't loaded.
function _eachTrait(mon, fn) {
  if (!mon || typeof getMonTraits !== "function" || typeof ABILITY_REGISTRY === "undefined") return;
  for (const traitId of getMonTraits(mon)) {
    const reg = ABILITY_REGISTRY[traitId];
    if (reg) fn(reg, traitId);
  }
}

// Trait conditional status immunity (e.g. Permafrost: immune to Burn only in snow)
function _traitConditionalImmuneToStatus(mon, statusType) {
  let immune = false;
  _eachTrait(mon, (reg) => {
    if (reg.conditionalImmuneToStatus && reg.conditionalImmuneToStatus(mon, null, statusType)) immune = true;
  });
  return immune;
}

function getStatMod(mon) {
  const mods = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  if (mon.statuses) {
    for (const e of mon.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.statMod) {
        const m = reg.statMod(mon, e);
        for (const [k, v] of Object.entries(m)) mods[k] = (mods[k] || 0) + v;
      }
    }
  }
  // Phase 3a: also dispatch trait statMod hooks
  _eachTrait(mon, (reg) => {
    if (reg.statMod) {
      const m = reg.statMod(mon, null);
      for (const [k, v] of Object.entries(m)) mods[k] = (mods[k] || 0) + v;
    }
  });
  return mods;
}

function getEffectiveStage(mon, stat) {
  const base = (mon.stages && mon.stages[stat]) || 0;
  const mod = getStatMod(mon)[stat] || 0;
  let stage = clamp(base + mod, -6, 6);
  // Phase 3a: stage floor (Steady: spe never below 0)
  _eachTrait(mon, (reg) => {
    if (reg.floorStatStage) {
      const floor = reg.floorStatStage(stat);
      if (typeof floor === "number" && stage < floor) stage = floor;
    }
  });
  return stage;
}

function getEffectiveSpeed(mon) {
  return mon.spe * stageMultiplier(getEffectiveStage(mon, "spe"));
}

function getIncomingDmgMod(defender, move, attacker, eff) {
  let m = 1;
  if (defender.statuses) {
    for (const e of defender.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.incomingDmgMod) m *= (reg.incomingDmgMod(defender, e, move, attacker, eff) ?? 1);
    }
  }
  _eachTrait(defender, (reg) => {
    if (reg.incomingDmgMod) m *= (reg.incomingDmgMod(defender, null, move, attacker, eff) ?? 1);
  });
  return m;
}

function getOutgoingPowerMod(attacker, move, defender, eff) {
  let m = 1;
  if (attacker.statuses) {
    for (const e of attacker.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.outgoingPowerMod) m *= (reg.outgoingPowerMod(attacker, e, move, defender, eff) ?? 1);
    }
  }
  _eachTrait(attacker, (reg) => {
    if (reg.outgoingPowerMod) m *= (reg.outgoingPowerMod(attacker, null, move, defender, eff) ?? 1);
  });
  return m;
}

function getAccuracyMod(mon, isAttacking, move) {
  let m = 1;
  if (mon.statuses) {
    for (const e of mon.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.accuracyMod) m *= (reg.accuracyMod(mon, e, isAttacking, move) ?? 1);
    }
  }
  _eachTrait(mon, (reg) => {
    if (reg.accuracyMod) m *= (reg.accuracyMod(mon, null, isAttacking, move) ?? 1);
  });
  return m;
}

function shouldForceHit(attacker) {
  if (attacker.statuses) {
    for (const e of attacker.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.forceHit && reg.forceHit(attacker, e, true)) return true;
    }
  }
  let force = false;
  _eachTrait(attacker, (reg) => {
    if (reg.forceHit && reg.forceHit(attacker, null, true)) force = true;
  });
  return force;
}

function getHealMod(mon) {
  let m = 1;
  if (mon.statuses) {
    for (const e of mon.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.healMod) m *= (reg.healMod(mon, e) ?? 1);
    }
  }
  _eachTrait(mon, (reg) => {
    if (reg.healMod) m *= (reg.healMod(mon, null) ?? 1);
  });
  return m;
}

function getOpponentCritBonus(defender) {
  let b = 0;
  if (defender.statuses) {
    for (const e of defender.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.opponentCritBonus) b += (reg.opponentCritBonus(defender, e) ?? 0);
    }
  }
  _eachTrait(defender, (reg) => {
    if (reg.opponentCritBonus) b += (reg.opponentCritBonus(defender, null) ?? 0);
  });
  return b;
}

// Self-crit bonus (Sharp-eyed, Dream Lord)
function getSelfCritBonus(attacker, move) {
  let b = 0;
  _eachTrait(attacker, (reg) => {
    if (reg.selfCritBonus) {
      const v = reg.selfCritBonus(attacker, null, move);
      if (typeof v === "number") b += v;
    }
  });
  return b;
}

// Force-crit-if check (Predator, Killing Blow, Light-feet)
function shouldForceCrit(attacker, defender, move) {
  let force = false;
  _eachTrait(attacker, (reg) => {
    if (reg.forceCritIf && reg.forceCritIf(attacker, null, defender, move)) force = true;
  });
  return force;
}

// Crit-immunity (Lucky)
function isImmuneToCrit(defender, move) {
  let immune = false;
  _eachTrait(defender, (reg) => {
    if (reg.forceCritImmune && reg.forceCritImmune(defender, null, move)) immune = true;
  });
  return immune;
}

// Critical-hit damage multiplier (Sharpshooter): returns the crit mult (default 1.5)
function getCritDamageMult(attacker) {
  let m = 1.5;
  _eachTrait(attacker, (reg) => {
    if (reg.critDamageMult) {
      const v = reg.critDamageMult(attacker, null);
      if (typeof v === "number") m = v;
    }
  });
  return m;
}

// STAB bonus multiplier override (Empowered, Dragon's Heart)
function getStabBonusMult(attacker, move) {
  let m = 1;
  _eachTrait(attacker, (reg) => {
    if (reg.stabBonusMult) {
      const v = reg.stabBonusMult(attacker, null, move);
      if (typeof v === "number") m *= v;
    }
  });
  return m;
}

function getEffectivenessOverride(defender, move) {
  if (defender.statuses) {
    for (const e of defender.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.effectivenessOverride) {
        const v = reg.effectivenessOverride(defender, e, move);
        if (v !== null && v !== undefined) return v;
      }
    }
  }
  let override = null;
  _eachTrait(defender, (reg) => {
    if (override !== null) return;
    if (reg.effectivenessOverride) {
      const v = reg.effectivenessOverride(defender, null, move);
      if (v !== null && v !== undefined) override = v;
    }
  });
  return override;
}

// Resistance-bypass (Sonic Bypass): floor effectiveness at 1× for matching move
function shouldBypassResistance(attacker, move) {
  let bypass = false;
  _eachTrait(attacker, (reg) => {
    if (reg.bypassResistance && reg.bypassResistance(move)) bypass = true;
  });
  return bypass;
}

// Move-type override (Pyroform, Crystal-tipped, Aqua-tongue, Variform)
function getMoveTypeOverride(attacker, move) {
  let newType = null;
  _eachTrait(attacker, (reg) => {
    if (newType !== null) return;
    if (reg.moveTypeOverride) {
      const v = reg.moveTypeOverride(attacker, null, move);
      if (v) newType = v;
    }
  });
  return newType;
}

function checkBlocksOutgoingMove(attacker, move) {
  if (attacker.statuses) {
    for (const e of attacker.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.blocksOutgoingMove) {
        const block = reg.blocksOutgoingMove(attacker, e, move);
        if (block) return block;
      }
    }
  }
  let blocked = null;
  _eachTrait(attacker, (reg) => {
    if (blocked) return;
    if (reg.blocksOutgoingMove) {
      const block = reg.blocksOutgoingMove(attacker, null, move);
      if (block) blocked = block;
    }
  });
  return blocked;
}

function checkBlocksSwitch(mon) {
  if (mon.statuses) {
    for (const e of mon.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.blocksSwitch && reg.blocksSwitch(mon, e)) {
        return { msg: `${reg.emoji} ${mon.name} can't switch out — ${reg.label}!` };
      }
    }
  }
  let blocked = null;
  _eachTrait(mon, (reg) => {
    if (blocked) return;
    if (reg.blocksSwitch && reg.blocksSwitch(mon, null)) {
      blocked = { msg: `${reg.emoji || ""} ${mon.name} can't switch out — ${reg.name}!` };
    }
  });
  return blocked;
}

function getSwitchCost(mon) {
  let cost = 0;
  if (mon.statuses) {
    for (const e of mon.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.switchCost) cost = Math.max(cost, reg.switchCost(mon, e) ?? 0);
    }
  }
  _eachTrait(mon, (reg) => {
    if (reg.switchCost) cost = Math.max(cost, reg.switchCost(mon, null) ?? 0);
  });
  return cost;
}

function interceptMove(attacker, chosenMove, moveset) {
  if (attacker.statuses) {
    for (const e of attacker.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.interceptMove) {
        const sub = reg.interceptMove(attacker, e, chosenMove, moveset);
        if (sub && sub !== chosenMove && sub.id !== chosenMove.id) {
          return { move: sub, msg: reg.interceptMsg ? reg.interceptMsg(attacker, sub) : null };
        }
      }
    }
  }
  let intercepted = null;
  _eachTrait(attacker, (reg) => {
    if (intercepted) return;
    if (reg.interceptMove) {
      const sub = reg.interceptMove(attacker, null, chosenMove, moveset);
      if (sub && sub !== chosenMove && sub.id !== chosenMove.id) {
        intercepted = { move: sub, msg: reg.interceptMsg ? reg.interceptMsg(attacker, sub) : null };
      }
    }
  });
  return intercepted || { move: chosenMove, msg: null };
}

function checkOnMoveAttempt(attacker, move) {
  if (attacker.statuses) {
    for (const e of attacker.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.onMoveAttempt) {
        const result = reg.onMoveAttempt(attacker, e, move);
        if (result) return result;
      }
    }
  }
  let attempt = null;
  _eachTrait(attacker, (reg) => {
    if (attempt) return;
    if (reg.onMoveAttempt) {
      const result = reg.onMoveAttempt(attacker, null, move);
      if (result) attempt = result;
    }
  });
  return attempt;
}

// Apply reflect-on-hit effects; mutates attacker.currentHP. Returns first match's msg (or null).
function applyOnHitReflect(defender, attacker, move, dmgTaken) {
  if (defender.statuses) {
    for (const e of defender.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.onHitReflect) {
        const result = reg.onHitReflect(defender, e, move, dmgTaken, attacker);
        if (result) {
          attacker.currentHP = Math.max(0, attacker.currentHP - result.reflectDmg);
          if (attacker.currentHP <= 0) attacker.fainted = true;
          return result;
        }
      }
    }
  }
  // Phase 3a: trait onHitReflect (Bouncy, Refracted from traits)
  let reflected = null;
  _eachTrait(defender, (reg) => {
    if (reflected) return;
    if (reg.onHitReflect) {
      const result = reg.onHitReflect(defender, null, move, dmgTaken, attacker);
      if (result) {
        attacker.currentHP = Math.max(0, attacker.currentHP - result.reflectDmg);
        if (attacker.currentHP <= 0) attacker.fainted = true;
        reflected = result;
      }
    }
  });
  return reflected;
}

// Apply on-incoming-hit hooks (Thorned, Aura traits, Resolute, Vengeance, etc.)
// Returns array of log messages. Dispatches both status and trait hooks.
function applyOnIncomingHit(defender, attacker, move, dmgTaken, eff) {
  const messages = [];
  if (defender.statuses) {
    for (const e of defender.statuses) {
      const reg = STATUS_REGISTRY[e.type];
      if (reg?.onIncomingHit) {
        const r = reg.onIncomingHit(defender, e, move, dmgTaken, attacker, eff);
        if (r?.msg) messages.push(r.msg);
      }
    }
  }
  _eachTrait(defender, (reg) => {
    if (reg.onIncomingHit) {
      const r = reg.onIncomingHit(defender, null, move, dmgTaken, attacker, eff);
      if (r?.msg) messages.push(r.msg);
    }
  });
  return messages;
}

// Apply on-damage-dealt hooks for the attacker (Vampire).
function applyOnDamageDealt(attacker, defender, totalDmg) {
  const messages = [];
  _eachTrait(attacker, (reg) => {
    if (reg.onDamageDealt) {
      const r = reg.onDamageDealt(attacker, null, totalDmg, defender);
      if (r?.msg) messages.push(r.msg);
    }
  });
  return messages;
}

// ---- Phase 3b: event-trigger hook dispatchers ----

// onEntry — fires when a Lumori first becomes active in this battle.
// foe is the opposing active mon (may be null for non-battle contexts).
function applyOnEntry(mon, foe) {
  const messages = [];
  _eachTrait(mon, (reg) => {
    if (reg.onEntry) {
      const r = reg.onEntry(mon, null, foe);
      if (r?.msg) messages.push(r.msg);
    }
  });
  return messages;
}

// onSwitchOut — fires when a Lumori voluntarily switches out.
// incomingAlly is the Lumori coming in (may be null).
function applyOnSwitchOut(mon, incomingAlly) {
  const messages = [];
  _eachTrait(mon, (reg) => {
    if (reg.onSwitchOut) {
      const r = reg.onSwitchOut(mon, null, incomingAlly);
      if (r?.msg) messages.push(r.msg);
    }
  });
  return messages;
}

// onSwitchIn — fires when a Lumori re-enters battle (Return Surge needs to
// distinguish first entry from re-entry; the trait itself reads _hasEnteredOnce).
function applyOnSwitchIn(mon, foe) {
  const messages = [];
  _eachTrait(mon, (reg) => {
    if (reg.onSwitchIn) {
      const r = reg.onSwitchIn(mon, null, foe);
      if (r?.msg) messages.push(r.msg);
    }
  });
  return messages;
}

// onKO — fires on the attacker when its move KOs a foe.
function applyOnKO(attacker, defender) {
  const messages = [];
  _eachTrait(attacker, (reg) => {
    if (reg.onKO) {
      const r = reg.onKO(attacker, null, defender);
      if (r?.msg) messages.push(r.msg);
    }
  });
  return messages;
}

// onCritTaken — fires on the defender when it takes a critical hit
// (Blood Rage atk+6, Reckoning spe+1, Counter-Charged primer).
function applyOnCritTaken(defender, attacker, move) {
  const messages = [];
  _eachTrait(defender, (reg) => {
    if (reg.onCritTaken) {
      const r = reg.onCritTaken(defender, null, attacker, move);
      if (r?.msg) messages.push(r.msg);
    }
  });
  return messages;
}

// onSelfCrit — fires on the attacker when it lands a critical hit (Crit Reserve).
function applyOnSelfCrit(attacker, defender, move) {
  const messages = [];
  _eachTrait(attacker, (reg) => {
    if (reg.onSelfCrit) {
      const r = reg.onSelfCrit(attacker, null, defender, move);
      if (r?.msg) messages.push(r.msg);
    }
  });
  return messages;
}

// onFaint — fires BEFORE the mon is marked fainted. Trait can revive (set
// mon.currentHP and mon.fainted = false) — see Phoenix-Flame, Lumian Soul.
// Returns the first non-null msg, or null if no trait intervened.
function applyOnFaint(mon) {
  let msg = null;
  _eachTrait(mon, (reg) => {
    if (msg) return; // first-match wins
    if (reg.onFaint) {
      const r = reg.onFaint(mon, null);
      if (r?.msg) msg = r.msg;
    }
  });
  return msg;
}

// onLowHpTrigger — fires once when HP first crosses ~25% threshold.
// Each trait may have its own threshold; the hook itself decides whether to fire.
function applyOnLowHpTrigger(mon) {
  const messages = [];
  _eachTrait(mon, (reg) => {
    if (reg.onLowHpTrigger) {
      const lowFrac = mon.currentHP / mon.maxHP;
      const r = reg.onLowHpTrigger(mon, null, lowFrac);
      if (r?.msg) messages.push(r.msg);
    }
  });
  return messages;
}

// onBattleEnd — fires once when the battle resolves (won, lost, ran, caught).
function applyOnBattleEnd(mon, outcome) {
  const messages = [];
  _eachTrait(mon, (reg) => {
    if (reg.onBattleEnd) {
      const r = reg.onBattleEnd(mon, null, outcome);
      if (r?.msg) messages.push(r.msg);
    }
  });
  return messages;
}

// onMoveUse — fires after this Lumori uses a move (Chameleon's type-shift).
function applyOnMoveUse(mon, move) {
  const messages = [];
  _eachTrait(mon, (reg) => {
    if (reg.onMoveUse) {
      const r = reg.onMoveUse(mon, null, move);
      if (r?.msg) messages.push(r.msg);
    }
  });
  return messages;
}

// onMoveHit / onMoveMiss — for Steady Aim consecutive-miss tracking.
function applyOnMoveHit(mon, move, defender) {
  _eachTrait(mon, (reg) => {
    if (reg.onMoveHit) reg.onMoveHit(mon, null, move, defender);
    if (reg.onHitLanded) reg.onHitLanded(mon, null, move, 0, defender);
  });
}

function applyOnMoveMiss(mon, move) {
  _eachTrait(mon, (reg) => {
    if (reg.onMoveMiss) reg.onMoveMiss(mon, null, move);
  });
}

// onStatLowered — fires on the mon when a stat-lower delta lands (Pride).
function applyOnStatLowered(mon, stat, delta) {
  _eachTrait(mon, (reg) => {
    if (reg.onStatLowered) reg.onStatLowered(mon, null, stat, delta);
  });
}

// onSelfStatRaised — fires on the mon when a stat-raise delta lands (Earthshaker).
function applyOnSelfStatRaised(mon, stat, delta) {
  _eachTrait(mon, (reg) => {
    if (reg.onSelfStatRaised) reg.onSelfStatRaised(mon, null, stat, delta);
  });
}

// Priority bonus aggregator — for turn-order calculations.
// Iterates traits' priorityBonus and movePriorityBonus hooks.
function getPriorityBonus(mon, foe, move) {
  let bonus = 0;
  _eachTrait(mon, (reg) => {
    if (reg.priorityBonus) {
      const v = reg.priorityBonus(mon, null, foe);
      if (typeof v === "number") bonus += v;
    }
    if (reg.movePriorityBonus && move) {
      const v = reg.movePriorityBonus(mon, null, move);
      if (typeof v === "number") bonus += v;
    }
  });
  return bonus;
}

// Once-per-battle low-HP threshold tracker. Call when a mon takes damage.
// Returns array of log messages for any triggered low-HP traits.
function checkAndFireLowHpTrigger(mon) {
  if (!mon || mon.fainted) return [];
  if (mon._lowHpTriggerFired) return [];
  // Default threshold 25% — individual traits also re-check via their own hooks
  if (mon.currentHP < mon.maxHP * 0.25) {
    mon._lowHpTriggerFired = true;
    return applyOnLowHpTrigger(mon);
  }
  return [];
}

// Per-turn counter increment. Call at end of each turn for active mons.
function tickTurnCounter(mon) {
  if (!mon) return;
  mon._turnsInBattle = (mon._turnsInBattle || 0) + 1;
}

// Multi-battle: cross-mon status hooks (Phase 3 follow-up).

// Bonded share: when a defender with Bonded takes damage, redirect 25% to a
// random alive teammate (excluding self). No-op if no allies or no Bonded.
function applyBondedShare(defender, allies, totalDamage) {
  if (totalDamage <= 0 || !hasStatus(defender, "bonded") || !Array.isArray(allies)) return null;
  const valid = allies.filter(m => m && m !== defender && !m.fainted && m.currentHP > 0);
  if (valid.length === 0) return null;
  const ally = valid[Math.floor(Math.random() * valid.length)];
  const shareDmg = Math.max(1, Math.floor(totalDamage * 0.25));
  ally.currentHP = Math.max(0, ally.currentHP - shareDmg);
  if (ally.currentHP <= 0) ally.fainted = true;
  return { ally, dmg: shareDmg, msg: `💞 ${ally.name} took ${shareDmg} bonded damage!` };
}

// Plague spread: each turn, every plagued mon on the field has a 30% chance
// to spread the plague to a random non-plagued, non-immune field-ally.
function applyPlagueSpread(fieldMons) {
  const msgs = [];
  if (!Array.isArray(fieldMons)) return msgs;
  for (const mon of fieldMons) {
    if (!mon || mon.fainted || mon.currentHP <= 0) continue;
    if (!hasStatus(mon, "plague")) continue;
    if (!rollPercent(30)) continue;
    const candidates = fieldMons.filter(m =>
      m && m !== mon && !m.fainted && m.currentHP > 0 && !hasStatus(m, "plague"));
    if (candidates.length === 0) continue;
    const target = candidates[Math.floor(Math.random() * candidates.length)];
    if (addStatus(target, "plague")) {
      msgs.push(`🦟 Plague spread from ${mon.name} to ${target.name}!`);
    }
  }
  return msgs;
}

// Effective accuracy for an attack; respects forceHit + attacker/defender modifiers.
// Combines: attacker's stages.acc + defender's stages.eva (Pokemon-style accuracy stages)
// with passive accuracyMod hooks from active statuses (Smothered, Faded, Mirage, etc.).
function getEffectiveAccuracy(attacker, defender, move) {
  if (shouldForceHit(attacker)) return 100;
  const accStage = (attacker.stages && attacker.stages.acc) || 0;
  const evaStage = (defender.stages && defender.stages.eva) || 0;
  // stageMultiplier curve: 0→1.0, +1→1.5, -1→0.67, +6→4.0, -6→0.25
  const stageAccMult = stageMultiplier(accStage);
  const stageEvaMult = stageMultiplier(evaStage);
  const accAtk = getAccuracyMod(attacker, true, move);
  const accDef = getAccuracyMod(defender, false, move);
  return Math.min(100, move.acc * stageAccMult / stageEvaMult * accAtk * accDef);
}

function calcMaxHP(baseHP, level, iv) {
  return Math.floor(((2 * baseHP + (iv||0)) * level) / 100) + level + 10;
}

function calcStat(base, level, iv) {
  return Math.floor(((2 * base + (iv||0)) * level) / 100) + 5;
}

// Shared move array builder
function buildMoveArr(moveIds) {
  return moveIds.map(mid => ({ id: mid, pp: MOVES_DATA[mid].pp, maxPP: MOVES_DATA[mid].pp }));
}

// Shared battle-mon base (common fields for all 3 build functions)
function buildMonBase(def, lv, ivs, nature, baseOverride) {
  const np = nature || "Balanced";
  const base = baseOverride || def.base;
  const maxHP = calcMaxHP(base.hp, lv, ivs.hp);
  const displayName = def.foreignRegion ? `Forgotten Lumori ${def.id - 461}` : def.name;
  return {
    name: displayName, emoji: def.emoji,
    types: [...def.types], level: lv, nature: np, ivs,
    maxHP, currentHP: maxHP,
    atk: applyNatureToStat("atk", calcStat(base.atk, lv, ivs.atk), np),
    def: applyNatureToStat("def", calcStat(base.def, lv, ivs.def), np),
    spa: applyNatureToStat("spa", calcStat(base.spa, lv, ivs.spa), np),
    spd: applyNatureToStat("spd", calcStat(base.spd, lv, ivs.spd), np),
    spe: applyNatureToStat("spe", calcStat(base.spe, lv, ivs.spe), np),
    statuses: [],
    stages: { atk:0, def:0, spa:0, spd:0, spe:0, acc:0, eva:0 },
    isConfused: false, confuseTurns: 0, fainted: false,
  };
}

// Build a live battle copy from a party slot (levelCap optional)
function buildBattleMon(partySlot, levelCap) {
  migrateStatuses(partySlot);
  const def = MONSTERS_DATA[partySlot.monsterId];
  const lv = (levelCap && partySlot.level > levelCap) ? levelCap : partySlot.level;
  const ivs = partySlot.ivs || { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 };
  const heldItemId = partySlot.heldItem || null;
  const heldData = heldItemId ? ITEMS_DATA[heldItemId] : null;

  const mon = {
    ...buildMonBase(def, lv, ivs, partySlot.nature, partySlot.variant ? partySlot.variantBase : null),
    monsterId: partySlot.monsterId,
    name: partySlot.nickname || def.name,
    moves: buildMoveArr(partySlot.moves),
    statuses: partySlot.statuses.map(s => ({ ...s })),
    fainted: partySlot.currentHP === 0,
    heldItem: heldItemId,
    focusSashUsed: false,
    partyRef: partySlot,
    shiny: !!partySlot.shiny,
    variant: !!partySlot.variant,
    variantTypes: partySlot.variantTypes || null,
    variantImmune: partySlot.variantImmune || null,
  };

  // Vital Seed: boost maxHP by 15%
  if (heldData?.held?.stat === "hp") {
    mon.maxHP = Math.floor(mon.maxHP * heldData.held.mult);
  }

  // Restore actual current HP (scale if level-capped or HP-boosted)
  const actualMax = calcMaxHP(def.base.hp, partySlot.level, ivs.hp);
  const rawHP = partySlot.currentHP !== undefined ? partySlot.currentHP : actualMax;
  const baseMax = calcMaxHP(def.base.hp, lv, ivs.hp);
  mon.currentHP = Math.min(mon.maxHP,
    (levelCap && partySlot.level > levelCap)
      ? Math.max(1, Math.floor((rawHP / actualMax) * mon.maxHP))
      : (mon.maxHP > baseMax ? Math.min(mon.maxHP, rawHP + (mon.maxHP - baseMax)) : rawHP)
  );

  // Stat-boosting held items (non-HP)
  if (heldData?.held?.stat && heldData.held.stat !== "hp") {
    const s = heldData.held.stat;
    mon[s] = Math.floor(mon[s] * heldData.held.mult);
  }

  // Apex Core: +10% all stats
  if (heldData?.held?.effect === "allStatsUp") {
    const m = heldData.held.mult;
    const b = x => Math.floor(x * m);
    mon.maxHP = b(mon.maxHP); mon.atk = b(mon.atk); mon.def = b(mon.def);
    mon.spa = b(mon.spa); mon.spd = b(mon.spd); mon.spe = b(mon.spe);
  }

  // Prismatic Shard: +15% all stats for NG+-exclusive Lumori
  if (heldData?.held?.effect === "ngPlusBoost" && typeof NG_PLUS_DEX_START !== "undefined" && def.id >= NG_PLUS_DEX_START) {
    const m = heldData.held.mult;
    const b = x => Math.floor(x * m);
    mon.maxHP = b(mon.maxHP); mon.atk = b(mon.atk); mon.def = b(mon.def);
    mon.spa = b(mon.spa); mon.spd = b(mon.spd); mon.spe = b(mon.spe);
  }

  // Shiny: +10% all stats
  if (partySlot.shiny) {
    const b = x => Math.floor(x * 1.1);
    mon.maxHP = b(mon.maxHP); mon.currentHP = Math.min(mon.currentHP, mon.maxHP);
    mon.atk = b(mon.atk); mon.def = b(mon.def);
    mon.spa = b(mon.spa); mon.spd = b(mon.spd); mon.spe = b(mon.spe);
  }
  // Variant: override types
  if (partySlot.variant && partySlot.variantTypes) mon.types = [...partySlot.variantTypes];

  return mon;
}

// ===== Procedural variant system (see docs/variant-system-spec.md) =====
// 24 variant-usable types: all current types EXCEPT the Forgotten-locked
// Aether and Chrono. Crystal/Primal/Stellar are allowed but rare (1/500 each).
const VARIANT_TYPE_POOL = ["Fire","Aquatic","Nature","Electric","Earth","Wind","Ice","Dark","Fairy","Metal","Poison","Mental","Draconic","Normal","Spectral","Fighting","Crystal","Primal","Sonic","Vapor","Mineral","Toxin","Stellar","Dream"];
const VARIANT_RARE_TYPES = ["Crystal","Primal","Stellar"];
const VARIANT_COMMON_TYPES = VARIANT_TYPE_POOL.filter(t => !VARIANT_RARE_TYPES.includes(t)); // 21

function pickVariantType() {
  // Each rare type independently 1/500; otherwise uniform among the 21 commons.
  for (const rt of VARIANT_RARE_TYPES) if (Math.random() < 1/500) return rt;
  return VARIANT_COMMON_TYPES[Math.floor(Math.random() * VARIANT_COMMON_TYPES.length)];
}

// 85% random 2-distinct · 10% mono · 5% original combo (maybe order-swapped).
function rollVariantTypes(origTypes) {
  const safeOrig = (origTypes || []).filter(t => t !== "Aether" && t !== "Chrono");
  const r = Math.random();
  if (r < 0.05 && safeOrig.length) {
    if (safeOrig.length === 2 && Math.random() < 0.5) return [safeOrig[1], safeOrig[0]];
    return [...safeOrig];
  }
  if (r < 0.15) return [pickVariantType()];
  const a = pickVariantType();
  let b = pickVariantType(), guard = 0;
  while (b === a && guard++ < 30) b = pickVariantType();
  if (b === a) { const alt = VARIANT_TYPE_POOL.filter(t => t !== a); b = alt[Math.floor(Math.random()*alt.length)]; }
  return [a, b];
}

// Variant takes 0x damage from one random type of the 24 (independent of typing).
function rollVariantImmune() {
  return VARIANT_TYPE_POOL[Math.floor(Math.random() * VARIANT_TYPE_POOL.length)];
}

// Permute the 6 base values, then 3 independent gates (Large 20% / Medium 20% /
// Small 40%). See spec §E. Returns a new {hp,atk,def,spa,spd,spe} base object.
const VARIANT_STAT_KEYS = ["hp","atk","def","spa","spd","spe"];

// Roll a variant STAT TRANSFORM: a permutation of the 6 stat slots + a signed
// per-slot drift fraction. Stored on the variant so EVOLUTION can re-apply the
// same transform to the evolved species' base (shape preserved, scaled up).
// Gates match the spec: Large 20% (<=15%), Medium 20% (0/1/2 @ <=10%), Small 40% (each <=5%).
function rollVariantTransform() {
  const perm = VARIANT_STAT_KEYS.map((_, i) => i);
  for (let i = perm.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  const drift = [0,0,0,0,0,0];
  const claimed = new Set();
  const unclaimed = () => [0,1,2,3,4,5].filter(s => !claimed.has(s));
  const pick = pool => pool[Math.floor(Math.random() * pool.length)];
  const doDrift = (slot, capPct) => { const pct = 1 + Math.floor(Math.random()*capPct); drift[slot] = (Math.random() < 0.5 ? -1 : 1) * pct / 100; claimed.add(slot); };
  if (Math.random() < 0.20) doDrift(pick(unclaimed()), 15);
  if (Math.random() < 0.20) {
    const cr = Math.random(); const count = cr < 0.30 ? 0 : (cr < 0.80 ? 1 : 2);
    for (let i = 0; i < count; i++) { const p = unclaimed(); if (!p.length) break; doDrift(pick(p), 10); }
  }
  if (Math.random() < 0.40) for (const s of unclaimed()) if (Math.random() < 0.40) doDrift(s, 5);
  return { perm, drift };
}

// Apply a stored transform to ANY species base -> permuted + drifted stat block.
function applyVariantTransform(baseObj, mods) {
  const values = VARIANT_STAT_KEYS.map(k => baseObj[k]);
  const out = {};
  VARIANT_STAT_KEYS.forEach((k, s) => {
    const src = values[(mods.perm && mods.perm[s] != null) ? mods.perm[s] : s];
    out[k] = Math.max(1, Math.round(src * (1 + ((mods.drift && mods.drift[s]) || 0))));
  });
  return out;
}

// Roll the full variant payload for a monster (or no-variant). rate 1/200.
function rollVariant(def, forceVariant) {
  const isVar = forceVariant !== undefined ? forceVariant : (Math.random() < 1/200);
  if (!isVar) return { variant:false, variantTypes:null, variantBase:null, variantImmune:null, variantMods:null };
  const mods = rollVariantTransform();
  return {
    variant: true,
    variantTypes: rollVariantTypes(def.types),
    variantBase: applyVariantTransform(def.base, mods),
    variantImmune: rollVariantImmune(),
    variantMods: mods
  };
}

// Build a wild monster battle object
function buildWildMon(monsterId, level, forceShiny, forceVariant) {
  const def = MONSTERS_DATA[monsterId];
  const nature = getRandomNature();
  const ivs = generateIVs();
  const knownMoves = def.learnset.filter(e => e[0] <= level).map(e => e[1]).slice(-4);
  if (knownMoves.length === 0) knownMoves.push("tackle");

  let shinyRate = 1/2048;
  if (typeof getTimeShinyMult  === "function") shinyRate *= getTimeShinyMult();
  if (typeof getEventShinyBoost === "function") shinyRate *= getEventShinyBoost();
  if (typeof NG_PLUS_DEX_START !== "undefined" && monsterId >= NG_PLUS_DEX_START) shinyRate *= 4;
  const shiny = forceShiny !== undefined ? forceShiny : (Math.random() < shinyRate);
  const v = rollVariant(def, forceVariant); // 1/200; independent of shiny (they stack)
  // Variants fight with a type-derived generated moveset (see variant-content.js).
  const wildMoves = (v.variant && typeof VariantContent !== "undefined" && VariantContent.generateBattleMoves)
    ? VariantContent.generateBattleMoves(def, v, level) : knownMoves;

  const mon = {
    ...buildMonBase(def, level, ivs, nature, v.variant ? v.variantBase : null),
    monsterId,
    moves: buildMoveArr(wildMoves),
    catchRate: def.catchRate,
    expYield: def.expYield,
    shiny, variant: v.variant, variantTypes: v.variantTypes, variantBase: v.variantBase, variantImmune: v.variantImmune, variantMods: v.variantMods,
  };
  // Variant: override typing
  if (v.variant && v.variantTypes) mon.types = [...v.variantTypes];
  // Shiny: +10% stats (applied last, on top of any variant base)
  if (shiny) {
    const boost = x => Math.floor(x * 1.1);
    mon.maxHP = boost(mon.maxHP); mon.currentHP = mon.maxHP;
    mon.atk = boost(mon.atk); mon.def = boost(mon.def);
    mon.spa = boost(mon.spa); mon.spd = boost(mon.spd); mon.spe = boost(mon.spe);
  }
  return mon;
}

// Build a gym/boss monster (perfect IVs, no nature modifier)
function buildGymMon(slot) {
  const def = MONSTERS_DATA[slot.monsterId];
  const ivs31 = { hp:31, atk:31, def:31, spa:31, spd:31, spe:31 };
  // Shiny + variant can appear on any non-wild enemy team too.
  let shinyRate = 1/2048;
  if (typeof getTimeShinyMult  === "function") shinyRate *= getTimeShinyMult();
  if (typeof getEventShinyBoost === "function") shinyRate *= getEventShinyBoost();
  if (typeof NG_PLUS_DEX_START !== "undefined" && slot.monsterId >= NG_PLUS_DEX_START) shinyRate *= 4;
  const shiny = Math.random() < shinyRate;
  const v = rollVariant(def);
  const gymMoves = (v.variant && typeof VariantContent !== "undefined" && VariantContent.generateBattleMoves)
    ? VariantContent.generateBattleMoves(def, v, slot.level) : slot.moves;
  const mon = {
    ...buildMonBase(def, slot.level, ivs31, "Balanced", v.variant ? v.variantBase : null),
    monsterId: slot.monsterId,
    moves: buildMoveArr(gymMoves),
    catchRate: 0,
    expYield: def.expYield,
    shiny, variant: v.variant, variantTypes: v.variantTypes, variantBase: v.variantBase, variantImmune: v.variantImmune, variantMods: v.variantMods,
  };
  if (v.variant && v.variantTypes) mon.types = [...v.variantTypes];
  if (shiny) {
    const boost = x => Math.floor(x * 1.1);
    mon.maxHP = boost(mon.maxHP); mon.currentHP = mon.maxHP;
    mon.atk = boost(mon.atk); mon.def = boost(mon.def);
    mon.spa = boost(mon.spa); mon.spd = boost(mon.spd); mon.spe = boost(mon.spe);
  }
  return mon;
}

// ---- Damage Calculation ----

function getHeldData(mon) {
  if (!mon.heldItem) return null;
  const item = ITEMS_DATA[mon.heldItem];
  return item?.held ?? null;
}

// Effectiveness for a move against a defender, honoring:
//   - move.dualType:[A,B]  → product of both types' effectiveness (Flying-Press style)
//   - move.breakerVs:"X"   → if defender has type X, that cell is forced to 2× regardless of chart (Freeze-Dry style)
// Falls back to the single-type chart lookup for normal moves.
function getMoveEffectiveness(move, defenderTypes) {
  const moveTypes = move.dualType || [move.type];
  let total = 1;
  for (const mt of moveTypes) {
    let eff = 1;
    for (const dt of defenderTypes) {
      if (move.breakerVs && dt === move.breakerVs) {
        eff *= 2;
      } else if (TYPE_CHART[mt] && TYPE_CHART[mt][dt] !== undefined) {
        eff *= TYPE_CHART[mt][dt];
      }
    }
    total *= eff;
  }
  return total;
}

function calcDamage(attacker, defender, move, opts = {}) {
  if (move.power === 0) return 0;
  const targetCount = opts.targetCount || 1;

  // Phase 3a: trait move-type override (Pyroform, Crystal-tipped, Aqua-tongue, Variform).
  // Build a working move object with the overridden type if any trait demands it.
  const overrideType = getMoveTypeOverride(attacker, move);
  const workMove = overrideType ? { ...move, type: overrideType } : move;

  // Effective stages combine mon.stages + passive statMod from active statuses + traits.
  const aAtkStage = getEffectiveStage(attacker, "atk");
  const aSpaStage = getEffectiveStage(attacker, "spa");
  const dDefStage = getEffectiveStage(defender, "def");
  const dSpdStage = getEffectiveStage(defender, "spd");
  const atk = workMove.cat === "physical"
    ? attacker.atk * stageMultiplier(aAtkStage)
    : attacker.spa * stageMultiplier(aSpaStage);
  const def = workMove.cat === "physical"
    ? defender.def * stageMultiplier(dDefStage)
    : defender.spd * stageMultiplier(dSpdStage);

  // Compute effectiveness EARLY so trait outgoingPowerMod hooks (Piercing Sight,
  // Bloodseeker) can read it via the 4th/5th args. Also honor Sonic Bypass (floor at 1×).
  const override = getEffectivenessOverride(defender, workMove);
  let eff = override !== null ? override : getMoveEffectiveness(workMove, defender.types);
  if (shouldBypassResistance(attacker, workMove) && eff < 1 && eff > 0) eff = 1;

  const burnMod = (hasStatus(attacker, "burn") && workMove.cat === "physical") ? 0.5 : 1;
  // Wide-spread modifier: 0.75× when a wide move actually hits more than one target.
  const spreadMod = (workMove.target === "wide" && targetCount > 1) ? 0.75 : 1;
  // Outgoing power mod from attacker's active statuses (Strained/Exhausted/Migraine/Concussion)
  // and traits (Heavy Hands / Crushing Bite / Pulse Master / Pyromaniac / Bloodseeker / etc).
  const powerMod = getOutgoingPowerMod(attacker, workMove, defender, eff);
  let dmg = Math.floor(((2 * attacker.level / 5 + 2) * workMove.power * atk / def) / 50 + 2);
  dmg = Math.floor(dmg * burnMod * spreadMod * powerMod * (0.85 + Math.random() * 0.15));

  // STAB: 1.5× by default, but trait stabBonusMult (Empowered, Dragon's Heart) can override.
  if (attacker.types.includes(workMove.type)) {
    const stabExtra = getStabBonusMult(attacker, workMove);
    dmg = Math.floor(dmg * 1.5 * stabExtra);
  }

  const atkHeld = getHeldData(attacker);
  if (atkHeld?.typeBoost === workMove.type) dmg = Math.floor(dmg * atkHeld.mult);
  if (atkHeld?.catBoost === workMove.cat)   dmg = Math.floor(dmg * atkHeld.mult);
  if (atkHeld?.typeBoostDual?.includes(workMove.type)) dmg = Math.floor(dmg * atkHeld.mult);

  // Variant immunity: a variant takes 0x damage from its rolled immune type.
  if (defender.variantImmune && (workMove.type === defender.variantImmune || (workMove.dualType || []).includes(defender.variantImmune))) {
    return { damage: 0, effectiveness: 0, crit: false };
  }
  dmg = Math.floor(dmg * eff);

  // Incoming dmg multiplier from defender's statuses + traits (Drenched/Soaked,
  // Brittle, Marked/Hunted, Phase-shifted, Per-type defensive traits, Resilient Skin, etc).
  const incomingMod = getIncomingDmgMod(defender, workMove, attacker, eff);
  dmg = Math.floor(dmg * incomingMod);

  // Crit calculation: traits can force-crit (Predator, Killing Blow, Light-feet),
  // grant crit-immunity (Lucky), boost crit rate (Sharp-eyed, Dream Lord), or override
  // crit damage multiplier (Sharpshooter).
  let critRate = workMove.effect === "crit" ? 25 : 6.25;
  if (atkHeld?.effect === "critUp") critRate = Math.min(50, critRate * 2);
  critRate += getOpponentCritBonus(defender);
  critRate += getSelfCritBonus(attacker, workMove);
  let isCrit = workMove.alwaysCrit === true || shouldForceCrit(attacker, defender, workMove) || rollPercent(critRate);
  if (isCrit && isImmuneToCrit(defender, workMove)) isCrit = false;
  if (isCrit) {
    const critMult = getCritDamageMult(attacker);
    dmg = Math.floor(dmg * critMult);
  }

  return { damage: Math.max(1, dmg), effectiveness: eff, crit: isCrit };
}

// ---- Apply Move Effects ----

// Data-driven single-stat stage changes { who:'a'=attacker/'d'=defender, stat, delta, msg }
// `who` is overridable: target:"self" moves coerce 'd' → 'a' in applySubEffect.
const STAGE_FX = {
  atkdown:   { who:'d', stat:'atk', delta:-1, msg:'Attack fell' },
  defdown:   { who:'d', stat:'def', delta:-1, msg:'Defense fell' },
  defdown2:  { who:'d', stat:'def', delta:-2, msg:'Defense fell sharply' },
  spdefdown: { who:'d', stat:'spd', delta:-1, msg:'Sp.Def fell' },
  spedown:   { who:'d', stat:'spe', delta:-1, msg:'Speed fell' },
  spedown2:  { who:'d', stat:'spe', delta:-2, msg:'Speed fell sharply' },
  spatkdown: { who:'d', stat:'spa', delta:-1, msg:'Sp.Atk fell' },
  atkup:     { who:'a', stat:'atk', delta:+1, msg:'Attack rose' },
  atkup2:    { who:'a', stat:'atk', delta:+2, msg:'Attack rose sharply' },
  defup:     { who:'a', stat:'def', delta:+1, msg:'Defense rose' },
  defup2:    { who:'a', stat:'def', delta:+2, msg:'Defense rose sharply' },
  speup:     { who:'a', stat:'spe', delta:+1, msg:'Speed rose' },
  spaup:     { who:'a', stat:'spa', delta:+1, msg:'Sp.Atk rose' },
  spaup2:    { who:'a', stat:'spa', delta:+2, msg:'Sp.Atk rose sharply' },
  spatkup:   { who:'a', stat:'spa', delta:+1, msg:'Sp.Atk rose' }, // synonym for spaup
  spdefup:   { who:'a', stat:'spd', delta:+1, msg:'Sp.Def rose' },
  spdefup2:  { who:'a', stat:'spd', delta:+2, msg:'Sp.Def rose sharply' },
  accup:     { who:'a', stat:'acc', delta:+1, msg:'Accuracy rose' },
  accup2:    { who:'a', stat:'acc', delta:+2, msg:'Accuracy rose sharply' },
  accdown:   { who:'d', stat:'acc', delta:-1, msg:'Accuracy fell' },
  accdown2:  { who:'d', stat:'acc', delta:-2, msg:'Accuracy fell sharply' },
  evup:      { who:'a', stat:'eva', delta:+1, msg:'Evasion rose' },
  evdown:    { who:'d', stat:'eva', delta:-1, msg:'Evasion fell' },
};
// Multi-stat stage changes
const MULTI_STAGE_FX = {
  calmup:      { changes:[{who:'a',stat:'spa',delta:+1},{who:'a',stat:'spd',delta:+1}], msg:'Sp.Atk and Sp.Def rose' },
  dragondance: { changes:[{who:'a',stat:'atk',delta:+1},{who:'a',stat:'spe',delta:+1}], msg:'Attack and Speed rose' },
};

function applyStageChange(mon, stat, delta) {
  const cur = mon.stages[stat];
  if (delta < 0 && cur <= -6) return false;
  if (delta > 0 && cur >= 6) return false;
  mon.stages[stat] = Math.max(-6, Math.min(6, cur + delta));
  // Phase 3b: trait triggers (Pride on stat-lowered; Earthshaker on stat-raised).
  // Re-entrancy guard so the triggered effect's own applyStageChange doesn't loop.
  if (!mon._inStageChangeTrigger) {
    mon._inStageChangeTrigger = true;
    try {
      if (delta < 0) applyOnStatLowered(mon, stat, delta);
      else if (delta > 0) applyOnSelfStatRaised(mon, stat, delta);
    } finally {
      mon._inStageChangeTrigger = false;
    }
  }
  return true;
}

// Phase 5 — Compound effect dispatcher.
// Compound tags like "echolocation_and_deafen" / "recharge_and_burn_target" /
// "atkup2_and_spaup2_self" are split on "_and_". Each segment may carry an
// optional "_self" or "_target" suffix that overrides routing for that segment;
// segments without a suffix inherit the parent move's target routing.
// Per TODO 821, this is a transitional dispatcher — the long-term migration is
// to an `effects:[{effect, ec}, ...]` array schema on the move. Until then,
// compound tags share the parent's ec roll (all-or-nothing).
function applyMoveEffect(move, attacker, defender) {
  if (!move.effect || move.ec === 0) return [];
  if (!rollPercent(move.ec)) return [];
  const fx = move.effect;
  const defaultTarget = (move.target === "self") ? attacker : defender;

  if (fx.includes("_and_")) {
    const messages = [];
    for (const part of fx.split("_and_")) {
      let baseFx = part;
      let subTarget = defaultTarget;
      if (part.endsWith("_self")) {
        baseFx = part.slice(0, -5);
        subTarget = attacker;
      } else if (part.endsWith("_target")) {
        baseFx = part.slice(0, -7);
        subTarget = defender;
      }
      messages.push(...applySubEffect(baseFx, attacker, subTarget));
    }
    return messages;
  }

  return applySubEffect(fx, attacker, defaultTarget);
}

// Single-effect application. `target` already reflects move.target / suffix routing.
function applySubEffect(fx, attacker, target) {
  const messages = [];

  // Single-stat stage changes
  if (STAGE_FX[fx]) {
    const { who, stat, delta, msg } = STAGE_FX[fx];
    // who:'a' is always self-buff/self-debuff; who:'d' routes via target (which
    // already accounts for the move's target field and any compound-tag suffix).
    const mon = who === 'a' ? attacker : target;
    if (applyStageChange(mon, stat, delta)) {
      const arrow = delta > 0 ? '📈' : '📉';
      messages.push(`${arrow} ${mon.name}'s ${msg}!`);
    }
    return messages;
  }

  // Multi-stat stage changes (always self-buffs in current data)
  if (MULTI_STAGE_FX[fx]) {
    const { changes, msg } = MULTI_STAGE_FX[fx];
    let changed = false;
    for (const c of changes) changed = applyStageChange(attacker, c.stat, c.delta) || changed;
    if (changed) messages.push(`📈 ${attacker.name}'s ${msg}!`);
    return messages;
  }

  // Status applications (registry-driven). Phase 3: multi-status stacking is live
  // (per TODO 821 "allow multiple persistent statuses on a single Lumori at once").
  // addStatus internally rejects re-applying the same status type or applying a
  // status the mon is type-immune to; cross-type stacking is allowed.
  if (STATUS_REGISTRY[fx]) {
    if (addStatus(target, fx)) {
      messages.push(STATUS_REGISTRY[fx].applyMsg(target.name));
    }
    return messages;
  }

  // Special-case effects
  switch (fx) {
    case "confuse":
      if (!target.isConfused) {
        target.isConfused = true;
        target.confuseTurns = 2 + Math.floor(Math.random() * 3);
        messages.push(`😵 ${target.name} became confused!`);
      }
      break;
    case "flinch":
      target._flinched = true;
      break;
    case "heal50": {
      // Always self-targeting (it's a recovery move). healMod from active statuses
      // (Tainted halves, Necrosis/Corroded fully block) is applied here.
      const baseHeal = Math.floor(attacker.maxHP * 0.5);
      const healAmt = Math.floor(baseHeal * getHealMod(attacker));
      if (healAmt > 0) {
        attacker.currentHP = Math.min(attacker.maxHP, attacker.currentHP + healAmt);
        messages.push(`💚 ${attacker.name} restored ${healAmt} HP!`);
      } else {
        messages.push(`💚 ${attacker.name}'s healing was blocked!`);
      }
      break;
    }
    case "recharge":
      // Phase 6: attacker must skip its next turn
      attacker.mustRecharge = true;
      break;
    // Effects handled outside applyMoveEffect (silenced here):
    //   crit (calcDamage), drain/recoil/hits (damage application),
    //   priority (turn ordering), leftovers/focus (passive)
  }
  return messages;
}

// ---- Status Tick ----

function tickStatus(mon) {
  const msgs = [];
  if (!mon.statuses) mon.statuses = [];
  // Iterate a snapshot so tickAfter callbacks / removeStatus on evolve / expire are safe.
  for (const entry of [...mon.statuses]) {
    const reg = STATUS_REGISTRY[entry.type];
    if (!reg) continue;
    // 1. DOT
    if (reg.tickDamage) {
      const dmg = reg.tickDamage(mon, entry);
      mon.currentHP = Math.max(0, mon.currentHP - dmg);
      if (reg.tickMsg) msgs.push(reg.tickMsg(mon.name, dmg));
    }
    // 2. Per-turn side effects (Hexed random debuff, Inspired random buff, etc.)
    if (reg.tickEffect) {
      const tickMsgs = reg.tickEffect(mon, entry);
      if (Array.isArray(tickMsgs)) msgs.push(...tickMsgs);
    }
    // 3. Per-status custom turn-counter mutation (e.g. badpoison turns++)
    if (reg.tickAfter) reg.tickAfter(entry);
    // 4. Generic active-turn counter — drives evolution + maxTurns expiration
    entry.turnsActive = (entry.turnsActive || 0) + 1;
    // 5. Evolution (parent → evolved replaces parent; evolved's onApply fires via addStatus)
    if (reg.evolvesTo && reg.evolveAt && entry.turnsActive >= reg.evolveAt) {
      removeStatus(mon, entry.type);
      const parentLabel = reg.label;
      if (addStatus(mon, reg.evolvesTo)) {
        const evolved = STATUS_REGISTRY[reg.evolvesTo];
        msgs.push(`⚠️ ${mon.name}'s ${parentLabel} worsened into ${evolved.label}!`);
      }
      continue;
    }
    // 6. Plain expiration (no evolution)
    if (reg.maxTurns && entry.turnsActive >= reg.maxTurns) {
      removeStatus(mon, entry.type);
      msgs.push(`${reg.label} on ${mon.name} wore off.`);
    }
  }
  if (mon.currentHP <= 0) mon.fainted = true;

  // Leftovers: heal 1/16 max HP per turn
  const heldInfo = getHeldData(mon);
  if (heldInfo?.effect === "leftovers" && mon.currentHP > 0 && mon.currentHP < mon.maxHP) {
    const heal = Math.max(1, Math.floor(mon.maxHP / 16));
    mon.currentHP = Math.min(mon.maxHP, mon.currentHP + heal);
    msgs.push(`🍎 ${mon.name}'s Leftovers restored ${heal} HP!`);
  }
  return msgs;
}

// Focus Sash: survive a fatal hit with 1 HP
function applyFocusSash(mon, damage) {
  const held = getHeldData(mon);
  if (held?.effect === "focusSash" && !mon.focusSashUsed && mon.currentHP === mon.maxHP && damage >= mon.currentHP) {
    mon.focusSashUsed = true;
    return { damage: mon.currentHP - 1, triggered: true };
  }
  return { damage, triggered: false };
}

// Quick Claw: 30% chance to move first
function checkQuickClaw(mon) {
  return getHeldData(mon)?.effect === "quickClaw" && rollPercent(30);
}

// Check if mon can move this turn (handles recharge/sleep/freeze/paralyze/confusion)
function canMove(mon) {
  // Phase 6: recharge — mon must skip the turn after using a recharge-flagged move
  if (mon.mustRecharge) {
    mon.mustRecharge = false;
    return { can: false, msg: `💤 ${mon.name} must recharge!` };
  }
  if (!mon.statuses) mon.statuses = [];
  // Status-driven movement blockers (iterate a snapshot so callbacks can remove safely)
  for (const entry of [...mon.statuses]) {
    const reg = STATUS_REGISTRY[entry.type];
    if (!reg || !reg.blocksMove) continue;
    const result = reg.blocksMove(mon, entry);
    if (result === null) continue;      // didn't block this turn
    return result;                       // blocked OR wake-up message
  }
  if (mon.isConfused) {
    if (--mon.confuseTurns <= 0) {
      mon.isConfused = false;
    } else if (rollPercent(33)) {
      const selfDmg = Math.max(1, Math.floor(mon.maxHP / 8));
      mon.currentHP = Math.max(0, mon.currentHP - selfDmg);
      if (mon.currentHP <= 0) mon.fainted = true;
      return { can: false, msg: `😵 ${mon.name} hurt itself in confusion! (-${selfDmg})` };
    }
  }
  return { can: true, msg: null };
}

// ---- AI Move Selection ----

function aiChooseMove(ai, target) {
  const usableMoves = ai.moves.filter(m => m.pp > 0);
  if (!usableMoves.length) return { id: "tackle", pp: 1, maxPP: 35 };

  return usableMoves.reduce((best, m) => {
    const move = MOVES_DATA[m.id];
    if (!move) return best;
    let score = 0;
    if (move.power > 0) {
      score = move.power * getMoveEffectiveness(move, target.types);
      if (ai.types.includes(move.type)) score *= 1.5;
      if (calcDamage(ai, target, move).damage >= target.currentHP) score += 1000;
    } else {
      if (move.effect === "heal50" && ai.currentHP < ai.maxHP * 0.5) score = 80;
      else if (move.effect === "atkup2" || move.effect === "dragondance") score = 60;
      else score = hasAnyStatus(target) ? 10 : 50;
    }
    return score > best.score ? { m, score } : best;
  }, { m: usableMoves[0], score: -1 }).m;
}

// ---- Capture Mechanic ----

function attemptCapture(wildMon, orbType) {
  const item = ITEMS_DATA[orbType];
  if (!item) return false;
  if (item.catchMult >= 255) return true;
  const catchVal = (wildMon.catchRate || 45)
    * ((3 * wildMon.maxHP - 2 * wildMon.currentHP) / (3 * wildMon.maxHP))
    * item.catchMult * (hasAnyStatus(wildMon) ? 2 : 1) / 255;
  return Math.random() < catchVal;
}

// ---- XP & Levelling ----

function calcXPGain(defeatedMon, isWild) {
  return Math.floor((defeatedMon.expYield || 100) * defeatedMon.level * (isWild ? 1 : 1.5) / 7);
}

function xpForLevel(level) { return Math.floor(Math.pow(level, 3) * 0.8); }

function giveXP(partySlot, amount) {
  partySlot.xp = (partySlot.xp || 0) + amount;
  const levelUps = [];
  while (partySlot.level < 100 && partySlot.xp >= xpForLevel(partySlot.level + 1)) {
    partySlot.level++;
    const def = MONSTERS_DATA[partySlot.monsterId];
    const lv = partySlot.level;
    const pIvs = partySlot.ivs || { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 };
    const newMax = calcMaxHP(def.base.hp, lv, pIvs.hp);
    partySlot.currentHP = Math.min(newMax, (partySlot.currentHP || 1) + newMax - (partySlot.maxHP || newMax));
    partySlot.maxHP = newMax;
    const newMoves = def.learnset.filter(e => e[0] === lv).map(e => e[1]);
    for (const mid of newMoves) {
      if (!partySlot.moves.includes(mid))
        partySlot.moves.length < 4 ? partySlot.moves.push(mid) : (partySlot.moves[3] = mid);
    }
    levelUps.push({ level: lv, newMoves });
  }
  return levelUps;
}

// ---- Evolution ----

function checkEvolution(partySlot) {
  const def = MONSTERS_DATA[partySlot.monsterId];
  if (def.evolveTo && def.evolveLevel && partySlot.level >= def.evolveLevel) return def.evolveTo;
  return null;
}

function evolveMonster(partySlot) {
  const targetId = checkEvolution(partySlot);
  if (!targetId) return null;
  const oldId = partySlot.monsterId;
  const oldDef = MONSTERS_DATA[oldId];
  const newDef = MONSTERS_DATA[targetId];
  partySlot.monsterId = targetId;

  // Variants keep their rolled typing + immunity, and re-derive their permuted/
  // drifted stats onto the evolved species' base via the stored transform — so a
  // bruiser stays a bruiser, scaled up. (Legacy variants w/o a stored transform
  // fall back to proportional per-slot scaling.)
  if (partySlot.variant && partySlot.variantBase) {
    if (partySlot.variantMods && typeof applyVariantTransform === "function") {
      partySlot.variantBase = applyVariantTransform(newDef.base, partySlot.variantMods);
    } else if (oldDef) {
      const nb = {};
      for (const k of ["hp","atk","def","spa","spd","spe"]) nb[k] = Math.max(1, Math.round(newDef.base[k] * (partySlot.variantBase[k] / (oldDef.base[k] || 1))));
      partySlot.variantBase = nb;
    }
  }

  const hpBase = (partySlot.variant && partySlot.variantBase) ? partySlot.variantBase.hp : newDef.base.hp;
  const newMax = calcMaxHP(hpBase, partySlot.level);
  partySlot.currentHP = Math.max(1, Math.floor(newMax * (partySlot.currentHP / partySlot.maxHP)));
  partySlot.maxHP = newMax;

  if (partySlot.variant && typeof VariantContent !== "undefined" && VariantContent.generateBattleMoves) {
    // Regenerate a type-derived moveset for the evolved variant.
    partySlot.moves = VariantContent.generateBattleMoves(newDef, {
      variant: true, variantTypes: partySlot.variantTypes,
      variantBase: partySlot.variantBase, variantImmune: partySlot.variantImmune
    }, partySlot.level);
  } else {
    const existingMoves = new Set(partySlot.moves);
    for (const m of newDef.learnset.filter(e => e[0] <= partySlot.level).map(e => e[1]).filter(m => !existingMoves.has(m))) {
      if (partySlot.moves.length < 4) partySlot.moves.push(m);
    }
  }
  return { oldId, newId: targetId };
}
