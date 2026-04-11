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
  return {
    name: def.name, emoji: def.emoji,
    types: [...def.types], level: lv, nature: np, ivs,
    maxHP, currentHP: maxHP,
    atk: applyNatureToStat("atk", calcStat(def.base.atk, lv, ivs.atk), np),
    def: applyNatureToStat("def", calcStat(def.base.def, lv, ivs.def), np),
    spa: applyNatureToStat("spa", calcStat(def.base.spa, lv, ivs.spa), np),
    spd: applyNatureToStat("spd", calcStat(def.base.spd, lv, ivs.spd), np),
    spe: applyNatureToStat("spe", calcStat(def.base.spe, lv, ivs.spe), np),
    status: null, poisonTurns: 0, sleepTurns: 0,
    stages: { atk:0, def:0, spa:0, spd:0, spe:0 },
    isConfused: false, confuseTurns: 0, fainted: false,
  };
}

// Build a live battle copy from a party slot (levelCap optional)
function buildBattleMon(partySlot, levelCap) {
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
    status: partySlot.status || null,
    fainted: partySlot.currentHP === 0,
    heldItem: heldItemId,
    focusSashUsed: false,
    partyRef: partySlot,
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

  return mon;
}

// Build a wild monster battle object
function buildWildMon(monsterId, level) {
  const def = MONSTERS_DATA[monsterId];
  const nature = getRandomNature();
  const ivs = generateIVs();
  const knownMoves = def.learnset.filter(e => e[0] <= level).map(e => e[1]).slice(-4);
  if (knownMoves.length === 0) knownMoves.push("tackle");
  return {
    ...buildMonBase(def, level, ivs, nature),
    monsterId,
    moves: buildMoveArr(knownMoves),
    catchRate: def.catchRate,
    expYield: def.expYield,
  };
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

function calcDamage(attacker, defender, move) {
  if (move.power === 0) return 0;
  const atk = move.cat === "physical"
    ? attacker.atk * stageMultiplier(attacker.stages.atk)
    : attacker.spa * stageMultiplier(attacker.stages.spa);
  const def = move.cat === "physical"
    ? defender.def * stageMultiplier(defender.stages.def)
    : defender.spd * stageMultiplier(defender.stages.spd);

  const burnMod = (attacker.status === "burn" && move.cat === "physical") ? 0.5 : 1;
  let dmg = Math.floor(((2 * attacker.level / 5 + 2) * move.power * atk / def) / 50 + 2);
  dmg = Math.floor(dmg * burnMod * (0.85 + Math.random() * 0.15));
  if (attacker.types.includes(move.type)) dmg = Math.floor(dmg * 1.5);

  const atkHeld = getHeldData(attacker);
  if (atkHeld?.typeBoost === move.type) dmg = Math.floor(dmg * atkHeld.mult);
  if (atkHeld?.catBoost === move.cat)   dmg = Math.floor(dmg * atkHeld.mult);

  const eff = getTypeEffectiveness(move.type, defender.types);
  dmg = Math.floor(dmg * eff);

  let critRate = move.effect === "crit" ? 25 : 6.25;
  if (atkHeld?.effect === "critUp") critRate = Math.min(50, critRate * 2);
  const isCrit = rollPercent(critRate);
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

  // Single-stat stage changes
  if (STAGE_FX[fx]) {
    const { who, stat, delta, msg } = STAGE_FX[fx];
    const mon = who === 'a' ? attacker : defender;
    if (applyStageChange(mon, stat, delta)) {
      const arrow = delta > 0 ? '📈' : '📉';
      messages.push(`${arrow} ${mon.name}'s ${msg}!`);
    }
    return messages;
  }

  // Multi-stat stage changes
  if (MULTI_STAGE_FX[fx]) {
    const { changes, msg } = MULTI_STAGE_FX[fx];
    const mon = attacker; // all multi-stage effects target attacker
    let changed = false;
    for (const c of changes) changed = applyStageChange(mon, c.stat, c.delta) || changed;
    if (changed) messages.push(`📈 ${mon.name}'s ${msg}!`);
    return messages;
  }

  switch (fx) {
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
      defender._flinched = true;
      break;
    case "heal50": {
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
  if (mon.status === "burn" || mon.status === "poison") {
    const dmg = Math.max(1, Math.floor(mon.maxHP / 8));
    mon.currentHP = Math.max(0, mon.currentHP - dmg);
    msgs.push(mon.status === "burn"
      ? `🔥 ${mon.name} is hurt by burn! (-${dmg})`
      : `☠️ ${mon.name} is hurt by poison! (-${dmg})`);
  } else if (mon.status === "badpoison") {
    const dmg = Math.max(1, Math.floor(mon.maxHP * mon.poisonTurns / 16));
    mon.currentHP = Math.max(0, mon.currentHP - dmg);
    mon.poisonTurns++;
    msgs.push(`☠️ ${mon.name} is hurt by bad poison! (-${dmg})`);
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
  if (mon.status === "sleep") {
    if (--mon.sleepTurns <= 0) { mon.status = null; return { can: true,  msg: `${mon.name} woke up!` }; }
    return { can: false, msg: `💤 ${mon.name} is fast asleep!` };
  }
  if (mon.status === "freeze") {
    if (rollPercent(20)) { mon.status = null; return { can: true,  msg: `${mon.name} thawed out!` }; }
    return { can: false, msg: `🧊 ${mon.name} is frozen solid!` };
  }
  if (mon.status === "paralyze" && rollPercent(25)) {
    return { can: false, msg: `⚡ ${mon.name} is paralyzed and can't move!` };
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
      score = move.power * getTypeEffectiveness(move.type, target.types);
      if (ai.types.includes(move.type)) score *= 1.5;
      if (calcDamage(ai, target, move).damage >= target.currentHP) score += 1000;
    } else {
      if (move.effect === "heal50" && ai.currentHP < ai.maxHP * 0.5) score = 80;
      else if (move.effect === "atkup2" || move.effect === "dragondance") score = 60;
      else score = target.status ? 10 : 50;
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
    * item.catchMult * (wildMon.status ? 2 : 1) / 255;
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
