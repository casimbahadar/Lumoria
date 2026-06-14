#!/usr/bin/env node
// Affix / name validator for the capstone renaming work (Lane B).
// Usage:
//   node scripts/affix_check.js [exclude:7,8,9] Name1 Name2 ...
// For each candidate name, reports whether it is CLEAN or which rules it breaks:
//   - exact name collision
//   - 4-char prefix/suffix group would exceed 3 IDs (the affix cap)
//   - genuine 3-char morpheme (-maw/-let/-kin/-don) would exceed 3
//   - CROSS-POSITION rule: a morpheme used as a prefix in one name must NOT be
//     used as a suffix in another (and vice-versa)
//
// `exclude:` lists the ids being renamed away (so they don't count against the cap).
// Forgotten "Forgotten X" names are counted by their base ("X").

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');
src += "\n;globalThis.__M=(typeof MONSTERS_DATA!=='undefined')?MONSTERS_DATA:null;";
const ctx = {}; vm.createContext(ctx);
try { vm.runInContext(src, ctx); } catch (e) { /* tolerate late refs */ }
const M = ctx.__M;
if (!M) { console.error('FATAL: could not load MONSTERS_DATA'); process.exit(1); }

const args = process.argv.slice(2);
let exclude = new Set();
const cands = [];
for (const a of args) {
  if (a.startsWith('exclude:')) {
    a.slice('exclude:'.length).split(',').filter(Boolean).forEach(x => exclude.add(Number(x)));
  } else cands.push(a);
}

const names = Object.values(M)
  .filter(e => !exclude.has(e.id))
  .map(e => e.name.toLowerCase().replace(/^forgotten /, ''));

const MORPH = ['maw', 'let', 'kin', 'don']; // genuine 3-char morphemes capped at 3

function check(c) {
  c = c.toLowerCase();
  const issues = [];
  const p4 = names.filter(x => x.startsWith(c.slice(0, 4)));
  const s4 = names.filter(x => x.endsWith(c.slice(-4)));
  if (names.includes(c)) issues.push('EXISTS');
  if (p4.length >= 3) issues.push(`pre"${c.slice(0, 4)}"=${p4.length + 1} [${p4.join(',')}]`);
  if (s4.length >= 3) issues.push(`suf"${c.slice(-4)}"=${s4.length + 1} [${s4.join(',')}]`);
  for (const m of MORPH) {
    if (c.endsWith(m)) {
      const cnt = names.filter(x => x.endsWith(m)).length;
      if (cnt >= 3) issues.push(`morph"-${m}"=${cnt + 1}`);
    }
  }
  // cross-position: candidate prefix used as a suffix elsewhere
  for (const L of [5, 4, 3]) {
    const pre = c.slice(0, L);
    const asSuf = names.filter(x => x !== c && x.endsWith(pre));
    if (asSuf.length) { issues.push(`XPRE"${pre}"=suffix in [${asSuf.slice(0, 3).join(',')}]`); break; }
  }
  // cross-position: candidate suffix used as a prefix elsewhere
  for (const L of [5, 4, 3]) {
    const suf = c.slice(-L);
    const asPre = names.filter(x => x !== c && x.startsWith(suf));
    if (asPre.length) { issues.push(`XSUF"${suf}"=prefix in [${asPre.slice(0, 3).join(',')}]`); break; }
  }
  return issues;
}

if (!cands.length) {
  console.log('Usage: node scripts/affix_check.js [exclude:7,8,9] Name1 Name2 ...');
  process.exit(0);
}
for (const c of cands) {
  const i = check(c);
  console.log(`${c.padEnd(14)} ${i.length ? '✗ ' + i.join(' | ') : '✓ CLEAN'}`);
}
