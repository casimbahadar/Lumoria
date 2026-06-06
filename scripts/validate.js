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
  const epilogue = "\n;globalThis.__V = { MOVES_DATA, MONSTERS_DATA, STAGE_FX, MULTI_STAGE_FX, STATUS_REGISTRY };";
  vm.runInContext(read("data.js") + "\n" + read("battle.js") + epilogue, sandbox, { filename: "vmload" });
  DATA = sandbox.__V;
} catch (e) {
  fail("VM", `could not VM-load data tables: ${e.message}`);
}

if (DATA) {
  const { MOVES_DATA, MONSTERS_DATA, STAGE_FX, MULTI_STAGE_FX, STATUS_REGISTRY } = DATA;

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
}

console.log("");
if (failures) { console.error(`FAILED — ${failures} issue(s).`); process.exit(1); }
console.log("PASSED — all integrity gates green.");
