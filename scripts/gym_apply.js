#!/usr/bin/env node
/*
 * gym_apply.js — writes the rebuilt rosters from gym_rebuild_out.json into
 * js/data.js via targeted, brace-matched replacement of each leader's
 * `teams`/`ngTeams` object values (every other field/comment is preserved).
 *
 *   - base gyms (24): teams <- base, ngTeams <- ng (NG+-only gyms 21-24: teams <- ng)
 *   - Vanguard (ELITE_FOUR x4): teams <- mixed, ngTeams <- mixedNg (inserted)
 *   - Champion (GYM_LEADERS.champion): teams <- mixed, ngTeams <- mixedNg (inserted)
 *
 * Members are written as {monsterId, level, moves:[...]} (name/types/role dropped).
 * Run after gym_rebuild.js. Does a syntax check before writing.
 */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const DATA = path.join(__dirname, "..", "js", "data.js");
let txt = fs.readFileSync(DATA, "utf8");
const R = JSON.parse(fs.readFileSync(path.join(__dirname, "gym_rebuild_out.json"), "utf8"));

const matchBrace = (s, i) => { let d = 0; for (; i < s.length; i++) { if (s[i] === "{") d++; else if (s[i] === "}") { if (--d === 0) return i + 1; } } throw new Error("unbalanced brace"); };
function serStyles(styles, ind) {
  const memb = m => `{monsterId:${m.monsterId}, level:${m.level}, moves:[${m.moves.map(x => JSON.stringify(x)).join(", ")}]}`;
  const arr = a => a.map(memb).join(`,\n${ind}    `);
  const blk = k => `${ind}  ${k}:[\n${ind}    ${arr(styles[k])}\n${ind}  ]`;
  return `{\n${blk("single")},\n${blk("double")},\n${blk("triple")}\n${ind}}`;
}

const reps = []; // {start,end,text} ; start===end => insertion

// value object span of a key (key like /(?<!ng)teams/ or /ngTeams/) searched in [from,to)
function valueSpan(from, to, keyRe) {
  const sub = txt.slice(from, to); const m = keyRe.exec(sub); if (!m) return null;
  const braceIdx = txt.indexOf("{", from + m.index); const end = matchBrace(txt, braceIdx);
  return { braceIdx, end };
}
function setTeams(from, to, styles) { const s = valueSpan(from, to, /(?<!ng)teams\s*:/); reps.push({ start: s.braceIdx, end: s.end, text: serStyles(styles, "    ") }); return s.end; }
function setNg(from, to, styles) { const s = valueSpan(from, to, /ngTeams\s*:/); reps.push({ start: s.braceIdx, end: s.end, text: serStyles(styles, "    ") }); }
function insertNgAfter(pos, styles) { reps.push({ start: pos, end: pos, text: `,\n    ngTeams:${serStyles(styles, "    ")}` }); }

// ---- GYM_LEADERS ----
const glOpen = txt.indexOf("{", txt.indexOf("const GYM_LEADERS = {"));
const glEnd = matchBrace(txt, glOpen);
const keyRe = /\n  ([a-z_]+):\s*\{/g; keyRe.lastIndex = glOpen;
const positions = []; let mm;
while ((mm = keyRe.exec(txt)) && mm.index < glEnd) positions.push({ key: mm[1], idx: mm.index });
for (let i = 0; i < positions.length; i++) {
  const { key, idx } = positions[i]; const to = (i + 1 < positions.length) ? positions[i + 1].idx : glEnd;
  const r = R[key]; if (!r) continue;
  if (r.base && r.ng) { setTeams(idx, to, r.base.styles); setNg(idx, to, r.ng.styles); }       // base gym
  else if (r.ng) { setTeams(idx, to, r.ng.styles); }                                            // NG+-only gym
  else if (r.mixed) { const tEnd = setTeams(idx, to, r.mixed.styles); insertNgAfter(tEnd, r.mixedNg.styles); } // champion
}

// ---- ELITE_FOUR ----
const efStart = txt.indexOf("const ELITE_FOUR = ["); const efEnd = txt.indexOf("\n];", efStart);
for (const id of ["aria", "grimshaw", "celeste", "titan"]) {
  const r = R[id]; if (!r) continue;
  const idIdx = txt.indexOf(`id: "${id}"`, efStart);
  const tEnd = setTeams(idIdx, efEnd, r.mixed.styles);
  insertNgAfter(tEnd, r.mixedNg.styles);
}

// apply descending so indices stay valid
reps.sort((a, b) => b.start - a.start);
for (const r of reps) txt = txt.slice(0, r.start) + r.text + txt.slice(r.end);

// syntax check before writing
new vm.Script(txt, { filename: "data.js(new)" });
fs.writeFileSync(DATA, txt);
console.log(`Applied ${reps.length} roster edits to js/data.js (syntax OK).`);
