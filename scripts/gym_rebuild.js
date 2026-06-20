#!/usr/bin/env node
/*
 * gym_rebuild.js — DRY-RUN generator for the gym-team overhaul.
 *
 * Rebuilds every gym's rosters to the corrected design:
 *   - Battle style (single/double/triple) = field count only; team SIZE is
 *     fixed per gym number, identical across styles.
 *       base gyms 1-5 -> 3, 6-10 -> 4, 11-15 -> 5, 16-20 -> 6.
 *   - Counter composition (off = pure off-type counter; dual = on-type
 *     [gymType,C] whose C is super-effective vs a gym weakness):
 *       base 3  : 1 off            + 2 on
 *       base 4  : 1 off + 1 dual   + 2 on
 *       base 5  : 2 off            + 3 on
 *       base 6  : 1 off + 1 dual   + 4 on
 *       NG+ 6   : 2 off + 1 dual   + 3 on        (all gyms incl. 21-24)
 *       prisma  : 3 off + 1 dual   + 2 on        (Crystal pool too small)
 *   - No Forgotten members (id < 462) in ANY gym (prisma exception: none —
 *     it relaxes majority instead). Base prefers base-dex (<322).
 *   - Only the leader's ACE stays constant across the three styles; all other
 *     slots differ per style (prisma on-type excepted: pool of 3).
 *   - Levels: keep each gym's existing per-team-set min..max band.
 *   - Moves: 4 per member drawn from its own learnset (STAB + power priority),
 *     so every move resolves in MOVES_DATA (G1-safe).
 *
 * Output: prints a full proposal table; writes proposed rosters to
 * scripts/gym_rebuild_out.json. Does NOT modify js/data.js.
 */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const DATA_PATH = path.join(__dirname, "..", "js", "data.js");
const s = {}; vm.createContext(s);
vm.runInContext(fs.readFileSync(DATA_PATH, "utf8") +
  "\n;globalThis.__D={GYM_LEADERS,MONSTERS_DATA,WORLD_DATA,TYPE_CHART,MOVES_DATA,ELITE_FOUR};", s, {});
const { GYM_LEADERS: G, MONSTERS_DATA: M, WORLD_DATA: W, TYPE_CHART: TC, MOVES_DATA: MV, ELITE_FOUR: E4 } = s.__D;

const FORGOTTEN = 462;
const eff = (a, b) => (TC[a] && TC[a][b] !== undefined) ? TC[a][b] : 1;
const allTypes = Object.keys(TC);
const weakOf = T => allTypes.filter(w => eff(w, T) > 1);
const bst = m => Object.values(m.base || {}).reduce((a, v) => a + (typeof v === "number" ? v : 0), 0);
const mons = Object.values(M);

// gym order / bands ---------------------------------------------------------
const req = {}, isNG = {};
for (const a of Object.values(W)) if (a.hasGym && a.gymLeader) {
  req[a.gymLeader] = a.requiredBadges ?? 999; if (a.requiresNGPlus) isNG[a.gymLeader] = true;
}
const baseGyms = Object.keys(G).filter(id => req[id] !== undefined && !isNG[id]).sort((a, b) => req[a] - req[b]);
const ngExclusive = Object.keys(G).filter(id => isNG[id]).sort((a, b) => req[a] - req[b]);
const bandSize = i => i < 5 ? 3 : i < 10 ? 4 : i < 15 ? 5 : 6;

// composition specs: counts of each role -----------------------------------
function baseComp(size) {
  if (size === 3) return { off: 1, dual: 0, on: 2 };
  if (size === 4) return { off: 1, dual: 1, on: 2 };
  if (size === 5) return { off: 2, dual: 0, on: 3 };
  return { off: 1, dual: 1, on: 4 };           // 6
}
function ngComp(id) {
  if (id === "prisma") return { off: 3, dual: 1, on: 2, allowOnReuse: true };
  return { off: 2, dual: 1, on: 3 };
}

// candidate classification --------------------------------------------------
function candidates(T, { maxId, preferBaseDex, excludeLegendary }) {
  const weak = weakOf(T);
  const counters = ty => ty.some(c => weak.some(w => eff(c, w) > 1));
  const pool = mons.filter(m => m.id < maxId && !(excludeLegendary && m.rarity === "legendary"));
  const onType = pool.filter(m => m.types.includes(T));
  const sortStrong = (a, b) => bst(b) - bst(a);
  const baseBias = arr => preferBaseDex
    ? [...arr].sort((a, b) => (a.id < 322 ? 0 : 1) - (b.id < 322 ? 0 : 1) || bst(b) - bst(a))
    : [...arr].sort(sortStrong);
  return {
    weak,
    on: baseBias(onType.filter(m => !(m.types.length === 2 && m.types.includes(T) && counters(m.types.filter(x => x !== T))))),
    dual: baseBias(onType.filter(m => m.types.length === 2 && m.types.includes(T) && counters(m.types.filter(x => x !== T)))),
    off: baseBias(pool.filter(m => !m.types.includes(T) && counters(m.types))),
    anyOn: baseBias(onType),
  };
}

// move selection from learnset ---------------------------------------------
function pickMoves(m, level) {
  const entries = (m.learnset || []).filter(e => Array.isArray(e) && typeof e[0] === "number");
  const known = []; const all = [];
  for (const e of entries) { const id = e[1]; if (typeof id !== "string") continue; all.push([e[0], id]); if (e[0] <= level) known.push(id); }
  let ids = [...new Set(known)];
  if (ids.length < 4) ids = [...new Set([...known, ...all.map(x => x[1])])];
  const score = id => { const mv = MV[id]; if (!mv) return -1; const stab = m.types.includes(mv.type); const p = mv.power || 0; return p > 0 ? p + (stab ? 60 : 0) : 30; };
  ids.sort((a, b) => score(b) - score(a));
  const out = ids.slice(0, 4);
  return out.length ? out : ["collide"];
}

// level band per team-set ---------------------------------------------------
function levelBand(teamObj) {
  const lv = [];
  for (const f of ["single", "double", "triple"]) (teamObj?.[f] || []).forEach(x => lv.push(x.level));
  if (!lv.length) return null;
  return { min: Math.min(...lv), max: Math.max(...lv) };
}
function levelsFor(n, band) {
  if (!band) return Array(n).fill(50);
  const { min, max } = band; const out = [];
  // ace is roster index 0 -> give it max, descend toward min for the rest.
  for (let i = 0; i < n; i++) out.push(n === 1 ? max : Math.round(max - (max - min) * i / (n - 1)));
  out[0] = max;
  return out;
}

// pick a roster for one style, honoring distinctness (usedAcross) -----------
function buildStyle(comp, cand, ace, usedAcross, allowOnReuse) {
  const roster = []; const localUsed = new Set();
  const take = (arr, n, reuseOk) => {
    let got = 0;
    for (const m of arr) {
      if (got >= n) break;
      if (m.id === ace.id) continue;
      if (localUsed.has(m.id)) continue;
      if (!reuseOk && usedAcross.has(m.id)) continue;
      roster.push(m); localUsed.add(m.id); got++;
    }
    // fallback: allow cross-style reuse if pool exhausted
    if (got < n) for (const m of arr) {
      if (got >= n) break;
      if (m.id === ace.id || localUsed.has(m.id)) continue;
      roster.push(m); localUsed.add(m.id); got++;
    }
    return got;
  };
  roster.push(ace); localUsed.add(ace.id);
  const onNeeded = comp.on - 1; // ace counts as one on-type
  take(cand.dual, comp.dual, allowOnReuse);
  take(cand.on, onNeeded, allowOnReuse);
  take(cand.off, comp.off, false);
  for (const m of roster) if (m.id !== ace.id) usedAcross.add(m.id);
  return roster;
}

// Single signature ace per leader, shared by base + NG+ and fixed across styles.
// = current highest-LEVEL member if it is on-type & non-Forgotten; else the
// strongest on-type member (prefer current on-type, then strongest in dex).
function computeAce(L, T, noLegendary) {
  const okLeg = m => !(noLegendary && m.rarity === "legendary");
  let sig = null;
  for (const set of [L.teams, L.ngTeams]) if (set) for (const f of ["single", "double", "triple"])
    (set[f] || []).forEach(x => { const m = M[x.monsterId]; if (!m || m.id >= FORGOTTEN || !okLeg(m)) return; const key = x.level * 1000 + bst(m); if (!sig || key > sig.key) sig = { key, m }; });
  if (sig && sig.m.types.includes(T)) return sig.m;
  const cur = [...currentMembers(L.teams), ...currentMembers(L.ngTeams)].filter(m => m.id < FORGOTTEN && m.types.includes(T) && okLeg(m));
  if (cur.length) return cur.sort((a, b) => bst(b) - bst(a))[0];
  return mons.filter(m => m.id < FORGOTTEN && m.types.includes(T) && okLeg(m)).sort((a, b) => bst(b) - bst(a))[0];
}

function currentMembers(teamObj) {
  const ids = new Set();
  for (const f of ["single", "double", "triple"]) (teamObj?.[f] || []).forEach(x => ids.add(x.monsterId));
  return [...ids].map(id => M[id]).filter(Boolean);
}

// build one team-set (base or ng) -------------------------------------------
function buildSet(T, comp, maxId, preferBaseDex, band, sizes, currentTeamObj, ace, excludeLegendary) {
  const cand = candidates(T, { maxId, preferBaseDex, excludeLegendary });
  // bias candidate ordering to put CURRENT members first (thematic retention)
  const cur = currentMembers(currentTeamObj);
  const curIds = new Set(cur.map(m => m.id));
  const bias = arr => [...arr].sort((a, b) => (curIds.has(a.id) ? 0 : 1) - (curIds.has(b.id) ? 0 : 1));
  cand.on = bias(cand.on); cand.dual = bias(cand.dual); cand.off = bias(cand.off); cand.anyOn = bias(cand.anyOn);
  const usedAcross = new Set();
  const styles = {};
  for (const st of ["single", "double", "triple"]) {
    const roster = buildStyle(comp, cand, ace, usedAcross, comp.allowOnReuse);
    const levels = levelsFor(roster.length, band);
    styles[st] = roster.map((m, i) => ({
      monsterId: m.id, name: m.name, types: m.types, role: m.id === ace.id ? "ace"
        : (m.types.length === 2 && m.types.includes(T) && cand.dual.some(d => d.id === m.id)) ? "dual"
        : m.types.includes(T) ? "on" : "off",
      level: levels[i], moves: pickMoves(m, levels[i]),
    }));
  }
  return { ace: ace.id, aceName: ace.name, styles };
}

// prisma — mixed-type specialist: 6 dual-typed members, all 12 type-slots
// distinct within a team. Ace fixed across styles; others differ per style.
function buildPrisma(L, ace, band) {
  const eligible = mons.filter(m => m.id < FORGOTTEN && m.rarity !== "legendary" && m.types.length === 2 && m.id !== ace.id);
  const cur = currentMembers(L.teams); const curIds = new Set(cur.map(m => m.id));
  eligible.sort((a, b) => (curIds.has(a.id) ? 0 : 1) - (curIds.has(b.id) ? 0 : 1) || bst(b) - bst(a));
  const usedAcross = new Set();
  const styles = {};
  for (const st of ["single", "double", "triple"]) {
    const roster = [ace]; const localUsed = new Set([ace.id]); const usedTypes = new Set(ace.types);
    const pass = reuseOk => { for (const m of eligible) { if (roster.length >= 6) break; if (localUsed.has(m.id)) continue; if (!reuseOk && usedAcross.has(m.id)) continue; if (m.types.some(t => usedTypes.has(t))) continue; roster.push(m); localUsed.add(m.id); m.types.forEach(t => usedTypes.add(t)); } };
    pass(false); if (roster.length < 6) pass(true);
    const levels = levelsFor(roster.length, band);
    roster.forEach(m => { if (m.id !== ace.id) usedAcross.add(m.id); });
    styles[st] = roster.map((m, i) => ({ monsterId: m.id, name: m.name, types: m.types, role: m.id === ace.id ? "ace" : "mix", level: levels[i], moves: pickMoves(m, levels[i]) }));
  }
  return { ace: ace.id, aceName: ace.name, styles };
}

// Vanguard (Elite Four) + Champion: themed/mixed 6-member teams, distinct per
// style, ace = current highest-level signature. Vanguard no-legendaries;
// Champion keeps its legendary signatures (final-boss exception).
const THEME = {
  aria: m => m.base.spe + m.base.spa,        // Graceful Offense
  grimshaw: m => m.base.atk + m.base.hp,     // Brutal Power
  celeste: m => bst(m),                      // Cosmic Balance
  titan: m => m.base.def + m.base.spd + m.base.hp, // Immovable Fortress
  champion: m => bst(m),                      // Mixed (strongest)
};
function buildMixed(id, teamObj, band, allowLegendary, legendaryAce, fixedExtra = [], excludeIds = [], preferNgBand = false) {
  const metric = THEME[id] || bst;
  const cur = currentMembers(teamObj); const curIds = new Set(cur.map(m => m.id));
  const inNg = m => m.id >= 322 && m.id < FORGOTTEN; // NG+-exclusive dex band
  // ace = current signature (highest level, then BST); for the Champion, require a legendary.
  let ace = null, aceKey = -1;
  const scanAce = needLeg => { for (const f of ["single", "double", "triple"]) (teamObj[f] || []).forEach(x => { const m = M[x.monsterId]; if (!m || excludeIds.includes(m.id)) return; if (needLeg && m.rarity !== "legendary") return; const key = x.level * 1000 + bst(m); if (key > aceKey) { aceKey = key; ace = m; } }); };
  scanAce(!!legendaryAce); if (!ace) scanAce(false);
  // fill pool excludes the ace, any fixedExtra/excludeIds, and (unless allowed) all legendaries.
  // NG+ versions bias toward NG+-band (322-461) mons; base versions bias toward current members.
  const pool = mons.filter(m => m.id < FORGOTTEN && (allowLegendary || m.rarity !== "legendary") && m.id !== ace.id && !fixedExtra.includes(m.id) && !excludeIds.includes(m.id))
    .sort((a, b) => preferNgBand
      ? ((inNg(b) ? 1 : 0) - (inNg(a) ? 1 : 0)) || metric(b) - metric(a)
      : ((curIds.has(a.id) ? 0 : 1) - (curIds.has(b.id) ? 0 : 1)) || metric(b) - metric(a));
  const usedAcross = new Set(); const styles = {};
  for (const st of ["single", "double", "triple"]) {
    const roster = [ace, ...fixedExtra.map(i => M[i])]; const localUsed = new Set(roster.map(m => m.id));
    const take = reuseOk => { for (const m of pool) { if (roster.length >= 6) break; if (localUsed.has(m.id)) continue; if (!reuseOk && usedAcross.has(m.id)) continue; roster.push(m); localUsed.add(m.id); } };
    take(false); if (roster.length < 6) take(true);
    const levels = levelsFor(6, band);
    roster.forEach(m => { if (m.id !== ace.id) usedAcross.add(m.id); });
    styles[st] = roster.map((m, i) => ({ monsterId: m.id, name: m.name, types: m.types, role: m.id === ace.id ? "ace" : "mix", level: levels[i], moves: pickMoves(m, levels[i]) }));
  }
  return { ace: ace.id, aceName: ace.name, styles };
}

// ---------------------------------------------------------------------------
const result = {};
const tallyLine = (label, T, styles) => {
  const c = st => { const r = styles[st]; const off = r.filter(x => x.role === "off").length; const dual = r.filter(x => x.role === "dual").length; const on = r.filter(x => x.role === "on" || x.role === "ace").length; return `${off}off+${dual}dual+${on}on=${r.length}`; };
  console.log(`  ${label.padEnd(10)} S[${c("single")}] D[${c("double")}] T[${c("triple")}]`);
};
const distinctCheck = styles => {
  const sets = ["single", "double", "triple"].map(st => styles[st].filter(x => x.role !== "ace").map(x => x.monsterId));
  const overlap = (a, b) => a.filter(x => b.includes(x));
  const o = [...overlap(sets[0], sets[1]), ...overlap(sets[0], sets[2]), ...overlap(sets[1], sets[2])];
  return o.length ? `non-ace overlap: ${[...new Set(o)].join(",")}` : "fully distinct (ace-only shared)";
};

console.log("===================== GYM REBUILD — DRY RUN =====================\n");
baseGyms.forEach((id, i) => {
  const L = G[id], T = L.type, size = bandSize(i);
  let bBand = levelBand(L.teams), nBand = levelBand(L.ngTeams) || bBand;
  if (id === "rex") { bBand = { min: bBand.min, max: 10 }; nBand = { min: nBand.min, max: 10 }; } // ace 9->10 (LEVEL_CAPS + G1 NG+ = 12)
  const ace = computeAce(L, T, true);   // no legendaries in base OR NG+ gyms
  const baseSet = buildSet(T, baseComp(size), FORGOTTEN, true, bBand, size, L.teams, ace, true);
  const ngSet = buildSet(T, ngComp(id), FORGOTTEN, false, nBand, 6, L.ngTeams || L.teams, ace, true);
  result[id] = { base: baseSet, ng: ngSet };
  console.log(`GYM ${i + 1}: ${L.name} (${T})  base size=${size}  ace=${baseSet.aceName}`);
  console.log(`  base band ${bBand ? bBand.min + "-" + bBand.max : "?"} | ng band ${nBand ? nBand.min + "-" + nBand.max : "?"}`);
  tallyLine("base", T, baseSet.styles);
  tallyLine("NG+", T, ngSet.styles);
  console.log("  base " + distinctCheck(baseSet.styles));
  console.log("  NG+  " + distinctCheck(ngSet.styles));
  console.log("");
});
ngExclusive.forEach((id, i) => {
  const L = G[id], T = L.type;
  const band = levelBand(L.teams);
  // NG+-exclusive gyms: still no legendaries. prisma has no non-legendary Crystal,
  // so her ace is the strongest non-legendary dual-type (mixed-specialist signature).
  const ace = id === "prisma" ? M[169] /* Prismatica — mixed-specialist signature */ : computeAce(L, T, true);
  const ngSet = id === "prisma"
    ? buildPrisma(L, ace, band)
    : buildSet(T, ngComp(id), FORGOTTEN, false, band, 6, L.teams, ace, true);
  result[id] = { ng: ngSet };
  console.log(`GYM ${21 + i}: ${L.name} (${T})  [NG+-exclusive]  ace=${ngSet.aceName}  band ${band ? band.min + "-" + band.max : "?"}`);
  if (id === "prisma") {
    for (const st of ["single", "double", "triple"]) {
      const r = ngSet.styles[st]; const types = new Set(); r.forEach(m => m.types.forEach(t => types.add(t)));
      const allDual = r.every(m => m.types.length === 2);
      console.log(`  ${st.padEnd(6)} members=${r.length} allDual=${allDual} distinctTypes=${types.size}/12`);
    }
  } else {
    tallyLine("NG+", T, ngSet.styles);
  }
  console.log("  NG+  " + distinctCheck(ngSet.styles));
  console.log("");
});

// Vanguard (Elite Four) + Champion --------------------------------------------
console.log("===================== VANGUARD + CHAMPION =====================\n");
const ngBandCount = styles => { let n = 0; for (const st of ["single", "double", "triple"]) styles[st].forEach(m => { if (m.monsterId >= 322 && m.monsterId < FORGOTTEN) n++; }); return n; };
for (const e of E4) {
  const band = levelBand(e.teams);
  const excl = e.id === "celeste" ? [169] : []; // 169 Prismatica reserved for prisma's ace
  const set = buildMixed(e.id, e.teams, band, false, false, [], excl);
  const ngSet = buildMixed(e.id, e.teams, band, false, false, [], excl, true); // NG+ version, NG+-band biased
  result[e.id] = { mixed: set, mixedNg: ngSet };
  const types = st => { const t = new Set(); set.styles[st].forEach(m => m.types.forEach(x => t.add(x))); return t.size; };
  console.log(`${e.name} (${e.id}) — ${e.theme}  ace=${set.aceName}  band ${band.min}-${band.max}`);
  for (const st of ["single", "double", "triple"]) console.log(`  base ${st.padEnd(6)} size=${set.styles[st].length} distinctTypes=${types(st)} legendaries=0`);
  console.log(`  NG+ uses ${ngBandCount(ngSet.styles)}/18 NG+-band mons (322-461) · ace=${ngSet.aceName}`);
  console.log("  base " + distinctCheck(set.styles) + " | NG+ " + distinctCheck(ngSet.styles) + "\n");
}
{
  const c = G.champion; const band = levelBand(c.teams);
  // Champion keeps exactly its 2 signature legendaries: ace Dragemian (#321) + Galvathon (#320), fixed across styles; rest non-legendary.
  const set = buildMixed("champion", c.teams, band, false, true, [320]);
  const ngSet = buildMixed("champion", c.teams, band, false, true, [320], [], true); // NG+ version, NG+-band biased
  result.champion = { mixed: set, mixedNg: ngSet };
  const legCount = (styles, st) => styles[st].filter(m => M[m.monsterId].rarity === "legendary").length;
  console.log(`${c.name} (champion) — Mixed  ace=${set.aceName}  band ${band.min}-${band.max}`);
  for (const st of ["single", "double", "triple"]) console.log(`  base ${st.padEnd(6)} size=${set.styles[st].length} legendaries=${legCount(set.styles, st)}`);
  console.log(`  NG+ uses ${ngBandCount(ngSet.styles)}/18 NG+-band mons · legendaries/style=${legCount(ngSet.styles, "single")} (Dragemian+Galvathon)`);
  console.log("  base " + distinctCheck(set.styles) + " | NG+ " + distinctCheck(ngSet.styles) + "\n");
}

fs.writeFileSync(path.join(__dirname, "gym_rebuild_out.json"), JSON.stringify(result, null, 1));
console.log("Full proposed rosters written to scripts/gym_rebuild_out.json (data.js NOT modified).");
