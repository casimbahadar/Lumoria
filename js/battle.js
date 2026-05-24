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
  const turns = typeof reg.initialTurns === "function" ? reg.initialTurns()
              : (reg.initialTurns ?? 0);
  mon.statuses.push({ type, turns, ...opts });
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
function buildMonBase(def, lv, ivs, nature) {
  const np = nature || "Balanced";
  const maxHP = calcMaxHP(def.base.hp, lv, ivs.hp);
  const displayName = def.foreignRegion ? `Forgotten Lumori ${def.id - 407}` : def.name;
  return {
    name: displayName, emoji: def.emoji,
    types: [...def.types], level: lv, nature: np, ivs,
    maxHP, currentHP: maxHP,
    atk: applyNatureToStat("atk", calcStat(def.base.atk, lv, ivs.atk), np),
    def: applyNatureToStat("def", calcStat(def.base.def, lv, ivs.def), np),
    spa: applyNatureToStat("spa", calcStat(def.base.spa, lv, ivs.spa), np),
    spd: applyNatureToStat("spd", calcStat(def.base.spd, lv, ivs.spd), np),
    spe: applyNatureToStat("spe", calcStat(def.base.spe, lv, ivs.spe), np),
    statuses: [],
    stages: { atk:0, def:0, spa:0, spd:0, spe:0 },
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
    ...buildMonBase(def, lv, ivs, partySlot.nature),
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

// Deterministic variant typing for a monster (completely different from original)
const ALL_TYPES = ["Fire","Water","Grass","Electric","Ground","Wind","Ice","Dark","Fairy","Steel","Poison","Psychic","Dragon","Normal","Rock","Bug"];
function getVariantTypes(monsterId, origTypes) {
  const pool = ALL_TYPES.filter(t => !origTypes.includes(t));
  const t1 = pool[monsterId % pool.length];
  const t2 = pool[(monsterId * 3 + 7) % pool.length];
  return t1 !== t2 ? [t1, t2] : [t1, pool[(pool.indexOf(t1) + 1) % pool.length]];
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
  const shiny   = forceShiny   !== undefined ? forceShiny   : (Math.random() < shinyRate);
  const variant = forceVariant !== undefined ? forceVariant : (!shiny && Math.random() < 1/100);
  const variantTypes = variant ? getVariantTypes(monsterId, def.types) : null;

  const mon = {
    ...buildMonBase(def, level, ivs, nature),
    monsterId,
    moves: buildMoveArr(knownMoves),
    catchRate: def.catchRate,
    expYield: def.expYield,
    shiny, variant, variantTypes,
  };

  // Shiny: 10% higher stats across the board
  if (shiny) {
    const boost = x => Math.floor(x * 1.1);
    mon.maxHP = boost(mon.maxHP); mon.currentHP = mon.maxHP;
    mon.atk = boost(mon.atk); mon.def = boost(mon.def);
    mon.spa = boost(mon.spa); mon.spd = boost(mon.spd); mon.spe = boost(mon.spe);
  }
  // Variant: different typing
  if (variant && variantTypes) mon.types = [...variantTypes];

  return mon;
}

// Build a gym/boss monster (perfect IVs, no nature modifier)
function buildGymMon(slot) {
  const def = MONSTERS_DATA[slot.monsterId];
  const ivs31 = { hp:31, atk:31, def:31, spa:31, spd:31, spe:31 };
  return {
    ...buildMonBase(def, slot.level, ivs31, "Balanced"),
    monsterId: slot.monsterId,
    moves: buildMoveArr(slot.moves),
    catchRate: 0,
    expYield: def.expYield,
  };
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
  const atk = move.cat === "physical"
    ? attacker.atk * stageMultiplier(attacker.stages.atk)
    : attacker.spa * stageMultiplier(attacker.stages.spa);
  const def = move.cat === "physical"
    ? defender.def * stageMultiplier(defender.stages.def)
    : defender.spd * stageMultiplier(defender.stages.spd);

  const burnMod = (hasStatus(attacker, "burn") && move.cat === "physical") ? 0.5 : 1;
  // Wide-spread modifier: 0.75× when a wide move actually hits more than one target.
  // For 1v1 (default targetCount=1) this is a no-op.
  const spreadMod = (move.target === "wide" && targetCount > 1) ? 0.75 : 1;
  let dmg = Math.floor(((2 * attacker.level / 5 + 2) * move.power * atk / def) / 50 + 2);
  dmg = Math.floor(dmg * burnMod * spreadMod * (0.85 + Math.random() * 0.15));
  if (attacker.types.includes(move.type)) dmg = Math.floor(dmg * 1.5);

  const atkHeld = getHeldData(attacker);
  if (atkHeld?.typeBoost === move.type) dmg = Math.floor(dmg * atkHeld.mult);
  if (atkHeld?.catBoost === move.cat)   dmg = Math.floor(dmg * atkHeld.mult);
  if (atkHeld?.typeBoostDual?.includes(move.type)) dmg = Math.floor(dmg * atkHeld.mult);

  const eff = getMoveEffectiveness(move, defender.types);
  dmg = Math.floor(dmg * eff);

  let critRate = move.effect === "crit" ? 25 : 6.25;
  if (atkHeld?.effect === "critUp") critRate = Math.min(50, critRate * 2);
  const isCrit = move.alwaysCrit === true || rollPercent(critRate);
  if (isCrit) dmg = Math.floor(dmg * 1.5);

  return { damage: Math.max(1, dmg), effectiveness: eff, crit: isCrit };
}

// ---- Apply Move Effects ----

// Data-driven single-stat stage changes { who:'a'=attacker/'d'=defender, stat, delta, msg }
const STAGE_FX = {
  atkdown:   { who:'d', stat:'atk', delta:-1, msg:'Attack fell' },
  defdown:   { who:'d', stat:'def', delta:-1, msg:'Defense fell' },
  spdefdown: { who:'d', stat:'spd', delta:-1, msg:'Sp.Def fell' },
  spedown:   { who:'d', stat:'spe', delta:-1, msg:'Speed fell' },
  spedown2:  { who:'d', stat:'spe', delta:-2, msg:'Speed fell sharply' },
  spatkdown: { who:'d', stat:'spa', delta:-1, msg:'Sp.Atk fell' },
  atkup:     { who:'a', stat:'atk', delta:+1, msg:'Attack rose' },
  atkup2:    { who:'a', stat:'atk', delta:+2, msg:'Attack rose sharply' },
  defup:     { who:'a', stat:'def', delta:+1, msg:'Defense rose' },
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
  return true;
}

function applyMoveEffect(move, attacker, defender) {
  if (!move.effect || move.ec === 0) return [];
  const messages = [];
  if (!rollPercent(move.ec)) return messages;
  const fx = move.effect;
  // For target:"self" moves, redirect secondary effects to the user.
  // STAGE_FX entries with who:'a' stay on attacker regardless; who:'d' routes via target.
  const target = (move.target === "self") ? attacker : defender;

  // Single-stat stage changes
  if (STAGE_FX[fx]) {
    const { who, stat, delta, msg } = STAGE_FX[fx];
    const mon = who === 'a' ? attacker : target;
    if (applyStageChange(mon, stat, delta)) {
      const arrow = delta > 0 ? '📈' : '📉';
      messages.push(`${arrow} ${mon.name}'s ${msg}!`);
    }
    return messages;
  }

  // Multi-stat stage changes
  if (MULTI_STAGE_FX[fx]) {
    const { changes, msg } = MULTI_STAGE_FX[fx];
    const mon = attacker; // multi-stage effects are self-buffs
    let changed = false;
    for (const c of changes) changed = applyStageChange(mon, c.stat, c.delta) || changed;
    if (changed) messages.push(`📈 ${mon.name}'s ${msg}!`);
    return messages;
  }

  switch (fx) {
    case "burn":
    case "paralyze":
    case "poison":
    case "badpoison":
    case "freeze":
    case "sleep":
      // Phase 1: preserve single-status rule (one persistent status at a time).
      // Phase 3 removes this guard when the 19 new statuses are introduced.
      if (!hasAnyStatus(target) && addStatus(target, fx)) {
        messages.push(STATUS_REGISTRY[fx].applyMsg(target.name));
      }
      break;
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
      // heal50 is always self-targeting (it's a recovery move)
      const healAmt = Math.floor(attacker.maxHP * 0.5);
      attacker.currentHP = Math.min(attacker.maxHP, attacker.currentHP + healAmt);
      messages.push(`💚 ${attacker.name} restored ${healAmt} HP!`);
      break;
    }
  }
  return messages;
}

// ---- Status Tick ----

function tickStatus(mon) {
  const msgs = [];
  if (!mon.statuses) mon.statuses = [];
  // Iterate a snapshot so tickAfter callbacks (or future evolves) can mutate safely
  for (const entry of [...mon.statuses]) {
    const reg = STATUS_REGISTRY[entry.type];
    if (!reg) continue;
    if (reg.tickDamage) {
      const dmg = reg.tickDamage(mon, entry);
      mon.currentHP = Math.max(0, mon.currentHP - dmg);
      if (reg.tickMsg) msgs.push(reg.tickMsg(mon.name, dmg));
    }
    if (reg.tickAfter) reg.tickAfter(entry);
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

// Check if mon can move this turn (handles sleep/freeze/paralyze/confusion)
function canMove(mon) {
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
  const newDef = MONSTERS_DATA[targetId];
  partySlot.monsterId = targetId;
  const newMax = calcMaxHP(newDef.base.hp, partySlot.level);
  partySlot.currentHP = Math.max(1, Math.floor(newMax * (partySlot.currentHP / partySlot.maxHP)));
  partySlot.maxHP = newMax;
  const existingMoves = new Set(partySlot.moves);
  for (const m of newDef.learnset.filter(e => e[0] <= partySlot.level).map(e => e[1]).filter(m => !existingMoves.has(m))) {
    if (partySlot.moves.length < 4) partySlot.moves.push(m);
  }
  return { oldId, newId: targetId };
}
