#!/usr/bin/env node
/*
 * Lumoria data-integrity gate (no dependencies, deterministic, <1s).
 *
 * Implements the three NEED-level CI guards from docs/qa-readiness-report.md §G:
 *   G1  Orphan-move-key guard      — every learnset move id resolves to MOVES_DATA.
 *   G2  Effect-token coverage      — every move.effect base token has a handler.
 *   G3  Syntax + global-collision  — each js/ file parses; no cross-file top-level
 *                                    `const`/`let`/`var`/`function`/`class` collisions
 *                                    (a dup top-level binding throws at page load and
 *                                    bricks the whole game, since all files share one
 *                                    global scope).
 *
 * Exit code 0 = all gates pass, 1 = at least one failure. Run: `node scripts/validate.js`.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const JS_DIR = path.join(__dirname, "..", "js");
// Page load order (from index.html). data.js + battle.js carry the data/handler
// tables we VM-load; the full list is what the syntax + collision gate scans.
const FILES = [
  "data.js", "variant-content.js", "variant-llm.js", "sprites.js",
  "music.js", "battle.js", "game.js", "online.js",
];

let failures = 0;
const fail = (gate, msg) => { failures++; console.error(`  ✗ [${gate}] ${msg}`); };
const ok = (gate, msg) => console.log(`  ✓ [${gate}] ${msg}`);

const read = f => fs.readFileSync(path.join(JS_DIR, f), "utf8");

// ---------------------------------------------------------------------------
// G3a — syntax check every file (parse-only; never executes game.js/online.js).
// ---------------------------------------------------------------------------
console.log("G3a — syntax");
for (const f of FILES) {
  try { new vm.Script(read(f), { filename: f }); ok("G3a", `${f} parses`); }
  catch (e) { fail("G3a", `${f}: ${e.message}`); }
}

// ---------------------------------------------------------------------------
// G3b — cross-file top-level declaration collision scan.
// Top-level declarations sit at column 0 in this codebase; indented code is
// nested. A name declared at column 0 in two files collides at load.
// ---------------------------------------------------------------------------
console.log("G3b — global collisions");
const DECL = /^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/;
const seen = new Map(); // name -> first file
for (const f of FILES) {
  const names = new Set();
  for (const line of read(f).split("\n")) {
    const m = line.match(DECL);
    if (m) names.add(m[1]);
  }
  for (const n of names) {
    if (seen.has(n)) fail("G3b", `top-level "${n}" declared in both ${seen.get(n)} and ${f}`);
    else seen.set(n, f);
  }
}
if (failures === 0) ok("G3b", `${seen.size} top-level declarations, no collisions`);

// ---------------------------------------------------------------------------
// VM-load data.js + battle.js to read the live tables (not regex scraping).
// const bindings stay in lexical scope for the epilogue, which publishes them.
// ---------------------------------------------------------------------------
let DATA;
try {
  const sandbox = { console, window: {}, document: {}, globalThis: null };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const epilogue = "\n;globalThis.__V = { MOVES_DATA, MONSTERS_DATA, STAGE_FX, MULTI_STAGE_FX, STATUS_REGISTRY, buildMoveArr, calcDamage, WORLD_DATA: (typeof WORLD_DATA!=='undefined'?WORLD_DATA:null), ITEMS_DATA: (typeof ITEMS_DATA!=='undefined'?ITEMS_DATA:null) };";
  vm.runInContext(read("data.js") + "\n" + read("battle.js") + epilogue, sandbox, { filename: "vmload" });
  DATA = sandbox.__V;
} catch (e) {
  fail("VM", `could not VM-load data tables: ${e.message}`);
}

if (DATA) {
  const { MOVES_DATA, MONSTERS_DATA, STAGE_FX, MULTI_STAGE_FX, STATUS_REGISTRY, buildMoveArr, calcDamage, WORLD_DATA, ITEMS_DATA } = DATA;
  const referenced = new Set(); // every move id used by some learnset (for the dead-move count)

  // -------------------------------------------------------------------------
  // G1 — orphan move keys. Walk every learnset, collect every string (move id),
  // assert membership in MOVES_DATA.
  // -------------------------------------------------------------------------
  console.log("G1 — orphan move keys");
  const collectIds = (node, out) => {
    if (Array.isArray(node)) node.forEach(n => collectIds(n, out));
    else if (typeof node === "string") out.add(node);
  };
  const orphans = new Map(); // moveId -> [monIds]
  let refCount = 0;
  for (const [mid, def] of Object.entries(MONSTERS_DATA)) {
    if (!def || !Array.isArray(def.learnset)) continue;
    const ids = new Set();
    collectIds(def.learnset, ids);
    for (const moveId of ids) {
      refCount++;
      referenced.add(moveId);
      if (!MOVES_DATA[moveId]) {
        if (!orphans.has(moveId)) orphans.set(moveId, []);
        orphans.get(moveId).push(mid);
      }
    }
  }
  if (orphans.size) {
    for (const [moveId, mons] of orphans)
      fail("G1", `move "${moveId}" referenced by ${mons.slice(0, 5).join(", ")}${mons.length > 5 ? "…" : ""} but not in MOVES_DATA`);
  } else {
    ok("G1", `${refCount} learnset references across ${Object.keys(MONSTERS_DATA).length} monsters, 0 orphans`);
  }

  // -------------------------------------------------------------------------
  // G2 — effect-token handler coverage. Decompose every move.effect (split on
  // "_and_", strip "_self"/"_target") and assert each base token resolves to a
  // handler: STAGE_FX / MULTI_STAGE_FX / STATUS_REGISTRY / the applySubEffect
  // switch / an effect intentionally handled outside applyMoveEffect.
  // -------------------------------------------------------------------------
  console.log("G2 — effect-token coverage");
  // Switch cases in applySubEffect (battle.js).
  const SWITCH_FX = ["confuse", "flinch", "heal50", "recharge"];
  // Effects handled outside applyMoveEffect (calcDamage / damage application /
  // turn ordering / passive held-item & crit-ratio hooks) — intentionally silent
  // in the dispatcher (see the trailing comment in applySubEffect, battle.js).
  const HANDLED_ELSEWHERE = ["crit", "drain", "recoil", "priority", "focus", "leftovers"];
  const known = new Set([
    ...Object.keys(STAGE_FX), ...Object.keys(MULTI_STAGE_FX),
    ...Object.keys(STATUS_REGISTRY), ...SWITCH_FX, ...HANDLED_ELSEWHERE,
  ]);
  const decompose = fx => fx.split("_and_").map(part => {
    if (part.endsWith("_self")) return part.slice(0, -5);
    if (part.endsWith("_target")) return part.slice(0, -7);
    return part;
  });
  const uncovered = new Map(); // token -> [moveIds]
  for (const [mid, def] of Object.entries(MOVES_DATA)) {
    if (!def || !def.effect) continue;
    for (const token of decompose(def.effect)) {
      if (!known.has(token)) {
        if (!uncovered.has(token)) uncovered.set(token, []);
        uncovered.get(token).push(mid);
      }
    }
  }
  if (uncovered.size) {
    for (const [token, moves] of uncovered)
      fail("G2", `effect token "${token}" has no handler (used by ${moves.slice(0, 5).join(", ")}${moves.length > 5 ? "…" : ""})`);
  } else {
    ok("G2", `all move.effect tokens resolve to a handler`);
  }

  // -------------------------------------------------------------------------
  // G4 — schema lint for the newer move fields.
  //   hits: integer ≥2, or [min,max] with 1 ≤ min ≤ max (both integers).
  //   bonusVsStatus: "any", a known status type, or an array of known types.
  // -------------------------------------------------------------------------
  console.log("G4 — hits / bonusVsStatus schema");
  const isInt = n => Number.isInteger(n);
  let g4before = failures;
  for (const [mid, def] of Object.entries(MOVES_DATA)) {
    if (!def) continue;
    if (def.hits !== undefined) {
      const h = def.hits;
      if (Array.isArray(h)) {
        if (h.length !== 2 || !isInt(h[0]) || !isInt(h[1]) || h[0] < 1 || h[1] < h[0])
          fail("G4", `${mid}: hits ${JSON.stringify(h)} must be [min,max] with 1 ≤ min ≤ max`);
      } else if (!isInt(h) || h < 2) {
        fail("G4", `${mid}: hits ${JSON.stringify(h)} must be an integer ≥ 2 (or a [min,max] array)`);
      }
    }
    if (def.bonusVsStatus !== undefined) {
      const b = def.bonusVsStatus;
      const okTok = t => t === "any" || !!STATUS_REGISTRY[t];
      const valid = (typeof b === "string") ? okTok(b)
                  : Array.isArray(b) ? (b.length > 0 && b.every(okTok))
                  : false;
      if (!valid) fail("G4", `${mid}: bonusVsStatus ${JSON.stringify(b)} must be "any", a known status, or an array of known statuses`);
    }
  }
  if (failures === g4before) ok("G4", `all hits / bonusVsStatus fields well-formed`);

  // -------------------------------------------------------------------------
  // F2 — save round-trip smoke test. Build a move array for a multi-hit move,
  // JSON round-trip a synthetic team slot, and run calcDamage with it — guards
  // against a future schema move silently breaking battle-build / damage calc.
  // -------------------------------------------------------------------------
  console.log("F2 — save round-trip smoke");
  try {
    const multiId = Object.keys(MOVES_DATA).find(id => Array.isArray(MOVES_DATA[id].hits) && MOVES_DATA[id].power);
    if (!multiId) { ok("F2", "no multi-hit move to sample (skipped)"); }
    else {
      const slot = { monsterId: 1, level: 50, moves: [multiId], currentHP: 150 };
      const round = JSON.parse(JSON.stringify(slot));               // serialize → deserialize
      const arr = buildMoveArr(round.moves);
      if (!arr.length || arr[0].id !== multiId || !(arr[0].pp > 0))
        throw new Error(`buildMoveArr produced ${JSON.stringify(arr)}`);
      const mk = types => ({ level: 50, atk: 100, def: 100, spa: 100, spd: 100, spe: 100,
        maxHP: 150, currentHP: 150, types, stages: { atk:0,def:0,spa:0,spd:0,spe:0,acc:0,eva:0 }, statuses: [] });
      const res = calcDamage(mk(["Normal"]), mk(["Normal"]), MOVES_DATA[multiId]);
      const dmg = (typeof res === "object") ? res.damage : res;
      if (!(typeof dmg === "number" && dmg >= 0)) throw new Error(`calcDamage returned ${JSON.stringify(res)}`);
      ok("F2", `round-tripped a team holding "${multiId}" (hits ${JSON.stringify(MOVES_DATA[multiId].hits)}) → damage ${dmg}`);
    }
  } catch (e) {
    fail("F2", `round-trip failed: ${e.message}`);
  }

  // -------------------------------------------------------------------------
  // G6 — evolution integrity. Every evolveTo resolves to a real species, and the
  // declared evolveMethod carries the fields its resolver (battle.js
  // resolveEvolution) needs. Dangling lines (evo fields set but no target) are
  // surfaced informationally — they can't evolve, but they don't brick anything.
  // -------------------------------------------------------------------------
  console.log("G6 — evolution integrity");
  const VALID_METHODS = new Set(["level", "item", "location", "held", "friendship", "time", "move", "teammate", "battles"]);
  const VALID_TIMES = new Set(["day", "night", "dawn", "dusk"]);
  let g6before = failures;
  const dangling = [];
  for (const [mid, def] of Object.entries(MONSTERS_DATA)) {
    if (!def) continue;
    if (def.evolveMethod && !VALID_METHODS.has(def.evolveMethod))
      fail("G6", `#${mid} ${def.name}: unknown evolveMethod "${def.evolveMethod}"`);
    if (!def.evolveTo) {
      if (def.evolveMethod || def.evolveLocation || def.evolveItem || def.evolveTime || def.evolveMove)
        dangling.push(`#${mid} ${def.name} (method=${def.evolveMethod || "?"}, no evolveTo)`);
      continue;
    }
    if (!MONSTERS_DATA[def.evolveTo]) {
      fail("G6", `#${mid} ${def.name}: evolveTo ${def.evolveTo} is not a real species`);
      continue;
    }
    switch (def.evolveMethod || "level") {
      case "level":
        if (!def.evolveLevel) fail("G6", `#${mid} ${def.name}: level evolution missing evolveLevel`);
        break;
      case "item": case "held":
        if (!def.evolveItem) fail("G6", `#${mid} ${def.name}: ${def.evolveMethod} evolution missing evolveItem`);
        else if (ITEMS_DATA && !ITEMS_DATA[def.evolveItem]) fail("G6", `#${mid} ${def.name}: evolveItem "${def.evolveItem}" not in ITEMS_DATA`);
        break;
      case "location":
        if (!def.evolveLocation) fail("G6", `#${mid} ${def.name}: location evolution missing evolveLocation`);
        else if (WORLD_DATA && !WORLD_DATA[def.evolveLocation]) fail("G6", `#${mid} ${def.name}: evolveLocation "${def.evolveLocation}" not in WORLD_DATA`);
        break;
      case "time":
        if (!VALID_TIMES.has(def.evolveTime)) fail("G6", `#${mid} ${def.name}: time evolution needs evolveTime ∈ {day,night,dawn,dusk}`);
        break;
      case "move":
        if (!def.evolveMove) fail("G6", `#${mid} ${def.name}: move evolution missing evolveMove`);
        else if (!MOVES_DATA[def.evolveMove]) fail("G6", `#${mid} ${def.name}: evolveMove "${def.evolveMove}" not in MOVES_DATA`);
        break;
      case "teammate":
        if (!def.evolveWith) fail("G6", `#${mid} ${def.name}: teammate evolution missing evolveWith`);
        else if (!MONSTERS_DATA[def.evolveWith]) fail("G6", `#${mid} ${def.name}: evolveWith ${def.evolveWith} is not a real species`);
        break;
      case "battles":
        if (!Number.isInteger(def.evolveBattles) || def.evolveBattles < 1)
          fail("G6", `#${mid} ${def.name}: battles evolution needs a positive integer evolveBattles`);
        break;
    }
  }
  if (failures === g6before) ok("G6", `all evolveTo targets resolve and methods well-formed`);
  if (dangling.length)
    console.log(`  ℹ [G6] ${dangling.length} dangling evolution line(s) — fields set but no evolveTo: ${dangling.join("; ")}`);

  // -------------------------------------------------------------------------
  // G5 (informational) — dead-move count. Defined moves never referenced by any
  // learnset. Non-blocking; surfaces drift so the dead pool doesn't grow silently.
  // -------------------------------------------------------------------------
  const dead = Object.keys(MOVES_DATA).filter(id => !referenced.has(id));
  console.log(`  ℹ [G5] ${dead.length} defined move(s) unused by any learnset (informational)`);
}

console.log("");
if (failures) { console.error(`FAILED — ${failures} issue(s).`); process.exit(1); }
console.log("PASSED — all integrity gates green.");
