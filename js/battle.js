// ============================================================
// LUMORIA - Battle Engine
// ============================================================

const BattleState = {
  active: false,
  playerMon: null,       // live battle copy
  enemyMon: null,        // live battle copy
  isWild: false,
  isGym: false,
  isChampion: false,
  gymLeaderId: null,
  enemyTeam: [],         // for gym/champion battles
  enemyTeamIndex: 0,
  playerTeamIndex: 0,
  playerWaiting: false,  // waiting for player input
  turnInProgress: false,
  onBattleEnd: null,     // callback
  log: []
};

// ---- Helpers ----

function rollPercent(chance) { return Math.random() * 100 < chance; }

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function stageMultiplier(stage) {
  // Attack/Defense stages: -6 to +6
  const tbl = [0.25,0.29,0.33,0.4,0.5,0.67,1,1.5,2,2.5,3,3.5,4];
  return tbl[stage + 6];
}

// Calculate max HP from base stat and level
function calcMaxHP(baseHP, level) {
  return Math.floor(((2 * baseHP) * level) / 100) + level + 10;
}

// Calculate a stat from base, level
function calcStat(base, level) {
  return Math.floor(((2 * base) * level) / 100) + 5;
}

// Build a live monster object for battle from a party slot
function buildBattleMon(partySlot) {
  const def = MONSTERS_DATA[partySlot.monsterId];
  const lv = partySlot.level;
  const maxHP = calcMaxHP(def.base.hp, lv);
  return {
    monsterId: partySlot.monsterId,
    name: partySlot.nickname || def.name,
    emoji: def.emoji,
    types: [...def.types],
    level: lv,
    maxHP,
    currentHP: partySlot.currentHP !== undefined ? partySlot.currentHP : maxHP,
    atk:  calcStat(def.base.atk, lv),
    def:  calcStat(def.base.def, lv),
    spa:  calcStat(def.base.spa, lv),
    spd:  calcStat(def.base.spd, lv),
    spe:  calcStat(def.base.spe, lv),
    moves: partySlot.moves.map(mid => ({ id: mid, pp: MOVES_DATA[mid].pp, maxPP: MOVES_DATA[mid].pp })),
    status: partySlot.status || null,   // burn|paralyze|poison|badpoison|sleep|freeze
    poisonTurns: 0,
    sleepTurns: 0,
    stages: { atk:0, def:0, spa:0, spd:0, spe:0 }, // stat stages
    isConfused: false,
    confuseTurns: 0,
    fainted: partySlot.currentHP === 0,
    partyRef: partySlot  // reference back to party
  };
}

// Build a wild monster battle object from scratch
function buildWildMon(monsterId, level) {
  const def = MONSTERS_DATA[monsterId];
  const maxHP = calcMaxHP(def.base.hp, level);
  // Pick moves from learnset that the monster knows at this level
  const knownMoves = def.learnset
    .filter(entry => entry[0] <= level)
    .map(entry => entry[1]);
  // Take last 4 moves known
  const moves = knownMoves.slice(-4).map(mid => ({
    id: mid, pp: MOVES_DATA[mid].pp, maxPP: MOVES_DATA[mid].pp
  }));
  if (moves.length === 0) moves.push({ id: "tackle", pp: 35, maxPP: 35 });

  return {
    monsterId,
    name: def.name,
    emoji: def.emoji,
    types: [...def.types],
    level,
    maxHP,
    currentHP: maxHP,
    atk:  calcStat(def.base.atk, level),
    def:  calcStat(def.base.def, level),
    spa:  calcStat(def.base.spa, level),
    spd:  calcStat(def.base.spd, level),
    spe:  calcStat(def.base.spe, level),
    moves,
    status: null,
    poisonTurns: 0,
    sleepTurns: 0,
    stages: { atk:0, def:0, spa:0, spd:0, spe:0 },
    isConfused: false,
    confuseTurns: 0,
    fainted: false,
    catchRate: def.catchRate,
    expYield: def.expYield
  };
}

// Build a gym leader's monster
function buildGymMon(slot) {
  const def = MONSTERS_DATA[slot.monsterId];
  const lv = slot.level;
  const maxHP = calcMaxHP(def.base.hp, lv);
  return {
    monsterId: slot.monsterId,
    name: def.name,
    emoji: def.emoji,
    types: [...def.types],
    level: lv,
    maxHP,
    currentHP: maxHP,
    atk:  calcStat(def.base.atk, lv),
    def:  calcStat(def.base.def, lv),
    spa:  calcStat(def.base.spa, lv),
    spd:  calcStat(def.base.spd, lv),
    spe:  calcStat(def.base.spe, lv),
    moves: slot.moves.map(mid => ({ id: mid, pp: MOVES_DATA[mid].pp, maxPP: MOVES_DATA[mid].pp })),
    status: null,
    poisonTurns: 0,
    sleepTurns: 0,
    stages: { atk:0, def:0, spa:0, spd:0, spe:0 },
    isConfused: false,
    confuseTurns: 0,
    fainted: false,
    catchRate: 0,
    expYield: MONSTERS_DATA[slot.monsterId].expYield
  };
}

// ---- Damage Calculation ----

function calcDamage(attacker, defender, move) {
  if (move.power === 0) return 0;
  const atk = move.cat === "physical"
    ? attacker.atk * stageMultiplier(attacker.stages.atk)
    : attacker.spa * stageMultiplier(attacker.stages.spa);
  const def = move.cat === "physical"
    ? defender.def * stageMultiplier(defender.stages.def)
    : defender.spd * stageMultiplier(defender.stages.spd);

  // Burn halves physical attack
  const burnMod = (attacker.status === "burn" && move.cat === "physical") ? 0.5 : 1;

  let dmg = Math.floor(((2 * attacker.level / 5 + 2) * move.power * atk / def) / 50 + 2);
  dmg = Math.floor(dmg * burnMod);

  // Random factor 0.85-1.0
  const rand = 0.85 + Math.random() * 0.15;
  dmg = Math.floor(dmg * rand);

  // STAB: +50% if attacker shares type with move
  if (attacker.types.includes(move.type)) dmg = Math.floor(dmg * 1.5);

  // Type effectiveness
  const eff = getTypeEffectiveness(move.type, defender.types);
  dmg = Math.floor(dmg * eff);

  // Critical hit (1/16 base, or 1/4 if crit flag)
  const critRate = move.effect === "crit" ? 25 : 6.25;
  const isCrit = rollPercent(critRate);
  if (isCrit) dmg = Math.floor(dmg * 1.5);

  return { damage: Math.max(1, dmg), effectiveness: eff, crit: isCrit };
}

// ---- Apply Move Effects ----

function applyMoveEffect(move, attacker, defender) {
  if (!move.effect || move.ec === 0) return [];
  const messages = [];
  if (!rollPercent(move.ec)) return messages;

  switch (move.effect) {
    case "burn":
      if (!defender.status && !defender.types.includes("Fire")) {
        defender.status = "burn";
        messages.push(`🔥 ${defender.name} was burned!`);
      }
      break;
    case "paralyze":
      if (!defender.status && !defender.types.includes("Electric")) {
        defender.status = "paralyze";
        messages.push(`⚡ ${defender.name} was paralyzed!`);
      }
      break;
    case "poison":
      if (!defender.status && !defender.types.includes("Poison") && !defender.types.includes("Steel")) {
        defender.status = "poison";
        messages.push(`☠️ ${defender.name} was poisoned!`);
      }
      break;
    case "badpoison":
      if (!defender.status && !defender.types.includes("Poison") && !defender.types.includes("Steel")) {
        defender.status = "badpoison";
        defender.poisonTurns = 1;
        messages.push(`☠️ ${defender.name} was badly poisoned!`);
      }
      break;
    case "freeze":
      if (!defender.status && !defender.types.includes("Ice")) {
        defender.status = "freeze";
        messages.push(`🧊 ${defender.name} was frozen solid!`);
      }
      break;
    case "sleep":
      if (!defender.status) {
        defender.status = "sleep";
        defender.sleepTurns = 2 + Math.floor(Math.random() * 3);
        messages.push(`💤 ${defender.name} fell asleep!`);
      }
      break;
    case "confuse":
      if (!defender.isConfused) {
        defender.isConfused = true;
        defender.confuseTurns = 2 + Math.floor(Math.random() * 3);
        messages.push(`😵 ${defender.name} became confused!`);
      }
      break;
    case "flinch":
      // flinch handled in turn order
      defender._flinched = true;
      break;
    case "atkdown":
      if (defender.stages.atk > -6) {
        defender.stages.atk = Math.max(-6, defender.stages.atk - 1);
        messages.push(`📉 ${defender.name}'s Attack fell!`);
      }
      break;
    case "defdown":
      if (defender.stages.def > -6) {
        defender.stages.def = Math.max(-6, defender.stages.def - 1);
        messages.push(`📉 ${defender.name}'s Defense fell!`);
      }
      break;
    case "spdefdown":
      if (defender.stages.spd > -6) {
        defender.stages.spd = Math.max(-6, defender.stages.spd - 1);
        messages.push(`📉 ${defender.name}'s Sp.Def fell!`);
      }
      break;
    case "spedown":
      if (defender.stages.spe > -6) {
        defender.stages.spe = Math.max(-6, defender.stages.spe - 1);
        messages.push(`📉 ${defender.name}'s Speed fell!`);
      }
      break;
    case "spedown2":
      if (defender.stages.spe > -6) {
        defender.stages.spe = Math.max(-6, defender.stages.spe - 2);
        messages.push(`📉 ${defender.name}'s Speed fell sharply!`);
      }
      break;
    case "spatkdown":
      if (defender.stages.spa > -6) {
        defender.stages.spa = Math.max(-6, defender.stages.spa - 1);
        messages.push(`📉 ${defender.name}'s Sp.Atk fell!`);
      }
      break;
    case "atkup":
      if (attacker.stages.atk < 6) {
        attacker.stages.atk = Math.min(6, attacker.stages.atk + 1);
        messages.push(`📈 ${attacker.name}'s Attack rose!`);
      }
      break;
    case "atkup2":
      if (attacker.stages.atk < 6) {
        attacker.stages.atk = Math.min(6, attacker.stages.atk + 2);
        messages.push(`📈 ${attacker.name}'s Attack rose sharply!`);
      }
      break;
    case "defup":
      if (attacker.stages.def < 6) {
        attacker.stages.def = Math.min(6, attacker.stages.def + 1);
        messages.push(`📈 ${attacker.name}'s Defense rose!`);
      }
      break;
    case "calmup":
      if (attacker.stages.spa < 6) attacker.stages.spa = Math.min(6, attacker.stages.spa + 1);
      if (attacker.stages.spd < 6) attacker.stages.spd = Math.min(6, attacker.stages.spd + 1);
      messages.push(`📈 ${attacker.name}'s Sp.Atk and Sp.Def rose!`);
      break;
    case "dragondance":
      if (attacker.stages.atk < 6) attacker.stages.atk = Math.min(6, attacker.stages.atk + 1);
      if (attacker.stages.spe < 6) attacker.stages.spe = Math.min(6, attacker.stages.spe + 1);
      messages.push(`📈 ${attacker.name}'s Attack and Speed rose!`);
      break;
    case "heal50":
      const healAmt = Math.floor(attacker.maxHP * 0.5);
      attacker.currentHP = Math.min(attacker.maxHP, attacker.currentHP + healAmt);
      messages.push(`💚 ${attacker.name} restored ${healAmt} HP!`);
      break;
  }
  return messages;
}

// ---- Status Tick ----

function tickStatus(mon) {
  const msgs = [];
  if (!mon.status) return msgs;
  switch (mon.status) {
    case "burn":
      const burnDmg = Math.max(1, Math.floor(mon.maxHP / 8));
      mon.currentHP = Math.max(0, mon.currentHP - burnDmg);
      msgs.push(`🔥 ${mon.name} is hurt by burn! (-${burnDmg})`);
      break;
    case "poison":
      const poisDmg = Math.max(1, Math.floor(mon.maxHP / 8));
      mon.currentHP = Math.max(0, mon.currentHP - poisDmg);
      msgs.push(`☠️ ${mon.name} is hurt by poison! (-${poisDmg})`);
      break;
    case "badpoison":
      const bpDmg = Math.max(1, Math.floor(mon.maxHP * mon.poisonTurns / 16));
      mon.currentHP = Math.max(0, mon.currentHP - bpDmg);
      mon.poisonTurns++;
      msgs.push(`☠️ ${mon.name} is hurt by bad poison! (-${bpDmg})`);
      break;
  }
  if (mon.currentHP <= 0) mon.fainted = true;
  return msgs;
}

// Check if mon can move this turn
function canMove(mon) {
  if (mon.status === "sleep") {
    mon.sleepTurns--;
    if (mon.sleepTurns <= 0) {
      mon.status = null;
      return { can: true, msg: `${mon.name} woke up!` };
    }
    return { can: false, msg: `💤 ${mon.name} is fast asleep!` };
  }
  if (mon.status === "freeze") {
    if (rollPercent(20)) {
      mon.status = null;
      return { can: true, msg: `${mon.name} thawed out!` };
    }
    return { can: false, msg: `🧊 ${mon.name} is frozen solid!` };
  }
  if (mon.status === "paralyze" && rollPercent(25)) {
    return { can: false, msg: `⚡ ${mon.name} is paralyzed and can't move!` };
  }
  if (mon.isConfused) {
    mon.confuseTurns--;
    if (mon.confuseTurns <= 0) {
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
  // Score each move by expected damage and utility
  const usableMoves = ai.moves.filter(m => m.pp > 0);
  if (usableMoves.length === 0) return { id: "tackle", pp: 1, maxPP: 35 }; // struggle

  let bestMove = usableMoves[0];
  let bestScore = -1;

  for (const m of usableMoves) {
    const move = MOVES_DATA[m.id];
    if (!move) continue;
    let score = 0;

    if (move.power > 0) {
      const eff = getTypeEffectiveness(move.type, target.types);
      score = move.power * eff;
      // STAB bonus
      if (ai.types.includes(move.type)) score *= 1.5;
      // Prefer finishing moves
      const { damage } = calcDamage(ai, target, move);
      if (damage >= target.currentHP) score += 1000;
    } else {
      // Status moves: value them based on situation
      if (move.effect === "heal50" && ai.currentHP < ai.maxHP * 0.5) score = 80;
      else if (move.effect === "atkup2" || move.effect === "dragondance") score = 60;
      else if (!target.status) score = 50;
      else score = 10;
    }
    if (score > bestScore) { bestScore = score; bestMove = m; }
  }
  return bestMove;
}

// ---- Capture Mechanic ----

function attemptCapture(wildMon, orbType) {
  const item = ITEMS_DATA[orbType];
  if (!item) return false;
  if (item.catchMult >= 255) return true; // Master Orb

  const rate = wildMon.catchRate || 45;
  const hpFactor = (3 * wildMon.maxHP - 2 * wildMon.currentHP) / (3 * wildMon.maxHP);
  const statusBonus = wildMon.status ? 2 : 1;
  const catchVal = (rate * hpFactor * item.catchMult * statusBonus) / 255;
  return Math.random() < catchVal;
}

// ---- XP Calculation ----

function calcXPGain(defeatedMon, isWild) {
  const base = defeatedMon.expYield || 100;
  const factor = isWild ? 1 : 1.5;
  return Math.floor(base * defeatedMon.level * factor / 7);
}

// XP needed for level n (medium-fast: n^3)
function xpForLevel(level) {
  return Math.floor(Math.pow(level, 3) * 0.8);
}

// Give XP to a party monster and handle level ups
function giveXP(partySlot, amount) {
  partySlot.xp = (partySlot.xp || 0) + amount;
  const levelUps = [];

  while (partySlot.level < 100) {
    const needed = xpForLevel(partySlot.level + 1);
    if (partySlot.xp < needed) break;
    partySlot.level++;
    // Recalculate stats
    const def = MONSTERS_DATA[partySlot.monsterId];
    const lv = partySlot.level;
    const oldMax = partySlot.maxHP || calcMaxHP(def.base.hp, lv - 1);
    const newMax = calcMaxHP(def.base.hp, lv);
    const hpGain = newMax - oldMax;
    partySlot.maxHP = newMax;
    partySlot.currentHP = Math.min(partySlot.maxHP, (partySlot.currentHP || 1) + hpGain);
    // Learn new moves
    const newMoves = def.learnset
      .filter(entry => entry[0] === lv)
      .map(entry => entry[1]);
    for (const mid of newMoves) {
      if (!partySlot.moves.includes(mid)) {
        if (partySlot.moves.length < 4) {
          partySlot.moves.push(mid);
        } else {
          // Replace last move (simplified)
          partySlot.moves[3] = mid;
        }
      }
    }
    levelUps.push({ level: lv, newMoves });
  }
  return levelUps;
}

// Check evolution
function checkEvolution(partySlot) {
  const def = MONSTERS_DATA[partySlot.monsterId];
  if (def.evolveTo && partySlot.level >= def.evolveLevel) {
    return def.evolveTo;
  }
  return null;
}

// Evolve a party slot
function evolveMonster(partySlot) {
  const targetId = checkEvolution(partySlot);
  if (!targetId) return null;
  const oldId = partySlot.monsterId;
  const newDef = MONSTERS_DATA[targetId];
  partySlot.monsterId = targetId;
  // Keep nickname if set
  if (!partySlot.nickname) partySlot.nickname = null;
  // Update HP proportionally
  const lv = partySlot.level;
  const newMax = calcMaxHP(newDef.base.hp, lv);
  const ratio = partySlot.currentHP / partySlot.maxHP;
  partySlot.maxHP = newMax;
  partySlot.currentHP = Math.max(1, Math.floor(newMax * ratio));
  // Merge moves
  const existingMoves = new Set(partySlot.moves);
  const newMoves = newDef.learnset
    .filter(e => e[0] <= lv)
    .map(e => e[1])
    .filter(m => !existingMoves.has(m));
  for (const m of newMoves) {
    if (partySlot.moves.length < 4) partySlot.moves.push(m);
  }
  return { oldId, newId: targetId };
}

