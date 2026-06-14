#!/usr/bin/env node
// Per-Lumori data dumper for the capstone passes.
// Usage:
//   node scripts/dex_dump.js <mode> <id|id-range> ...
// modes:
//   flavor  - name/emoji/types/desc/lore/variant anchor      (Lane B)
//   stats   - base stats + BST + role hint                    (Lane A.1)
//   evo     - evolution method/level + line + catch/exp       (Lane A.2)
//   moves   - learnset expanded & sorted + STAB check          (Lane C)
//   full    - everything
// ids: "1 2 3" or "1-9" or "1-9 25 30-33"

const fs = require('fs'); const vm = require('vm'); const path = require('path');
const load = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
let src = load('js/data.js') + "\n;globalThis.__M=MONSTERS_DATA;globalThis.__MV=MOVES_DATA;";
const ctx = {}; vm.createContext(ctx); try { vm.runInContext(src, ctx); } catch (e) {}
const M = ctx.__M, MV = ctx.__MV;
const vc = load('js/variant-content.js');

const bst = b => b.hp + b.atk + b.def + b.spa + b.spd + b.spe;
function ids(args) {
  const out = [];
  for (const a of args) {
    const m = a.match(/^(\d+)-(\d+)$/);
    if (m) { for (let i = +m[1]; i <= +m[2]; i++) out.push(i); }
    else if (/^\d+$/.test(a)) out.push(+a);
  }
  return out;
}
function vcAnchor(id) {
  const re = new RegExp("\\n\\s*" + id + ":\\s*\\{[\\s\\S]*?coreLine:[^\\n]*", 'm');
  const m = vc.match(re); return m ? m[0].trim().replace(/\s+/g, ' ') : '(auto-derived fallback)';
}
function expandLS(ls) {
  const out = [];
  for (const e of ls) {
    if (typeof e[0] === 'number' && typeof e[1] === 'string') out.push([e[0], e[1]]);
    if (e.length >= 3 && Array.isArray(e[2])) out.push([e[2][0], e[2][1]]);
  }
  out.sort((a, b) => a[0] - b[0]);
  const seen = new Set(); return out.filter(([l, m]) => seen.has(m) ? false : seen.add(m));
}
function preEvo(id) { return Object.values(M).find(x => x.evolveTo === id); }

const mode = process.argv[2] || 'full';
for (const id of ids(process.argv.slice(3))) {
  const e = M[id]; if (!e) { console.log(`#${id} NOT FOUND`); continue; }
  const b = e.base, stab = e.types;
  console.log('='.repeat(80));
  console.log(`#${e.id}  ${e.name}   ${e.emoji}   [${e.types.join('/')}]   rarity:${e.rarity}`);
  if (mode === 'stats' || mode === 'full') {
    console.log(`STATS  hp:${b.hp} atk:${b.atk} def:${b.def} spa:${b.spa} spd:${b.spd} spe:${b.spe}   BST:${bst(b)}`);
  }
  if (mode === 'evo' || mode === 'full') {
    const pe = preEvo(id);
    console.log(`EVO    ${pe ? '#' + pe.id + ' ' + pe.name + ' → ' : ''}#${id}${e.evolveTo ? ' → #' + e.evolveTo : ' (final)'}`);
    console.log(`       evolveTo:${e.evolveTo}  evolveLevel:${e.evolveLevel}` +
      (e.evolveItem ? `  evolveItem:${e.evolveItem}` : '') + (e.evolveCond ? `  evolveCond:${e.evolveCond}` : ''));
    console.log(`       catchRate:${e.catchRate}  expYield:${e.expYield}`);
  }
  if (mode === 'flavor' || mode === 'full') {
    console.log(`DESC   ${e.desc}`);
    console.log(`LORE   ${e.lore}`);
    console.log(`VARIANT ${vcAnchor(id)}`);
  }
  if (mode === 'moves' || mode === 'full') {
    console.log('MOVESET (expanded; * = STAB):');
    const ls = expandLS(e.learnset); const dmg = new Set();
    for (const [lv, k] of ls) {
      const m = MV[k]; if (!m) { console.log(`  L${String(lv).padStart(2)} ${k} ⚠️ ORPHAN`); continue; }
      if (m.power) dmg.add(m.type);
      const st = stab.includes(m.type) && m.power ? '*' : ' ';
      console.log(`  ${st}L${String(lv).padStart(2)}  ${m.name.padEnd(18)} ${m.type.padEnd(9)} ${(m.cat || '').slice(0, 3)} pow:${m.power ? String(m.power).padStart(3) : ' --'}`);
    }
    const miss = stab.filter(t => !dmg.has(t));
    console.log(`  STAB: {${[...dmg].join(', ')}}  ${miss.length ? '⚠️ MISSING ' + miss.join(',') : '✓'}`);
  }
}
