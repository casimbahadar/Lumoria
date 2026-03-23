#!/usr/bin/env node
// Move legendaries 206-213 → 314-321 via two-pass rename
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');

// Mappings: old → new
const mappings = [
  [206, 314], [207, 315], [208, 316], [209, 317],
  [210, 318], [211, 319], [212, 320], [213, 321]
];

// Pass 1: old IDs → temp IDs (add 5000)
for (const [oldId] of mappings) {
  const tmpId = oldId + 5000;
  src = src.split(`:${oldId},`).join(`:${tmpId},`);   // id:206,
  src = src.split(`:${oldId} `).join(`:${tmpId} `);   // id:206 (with space)
  src = src.split(`:${oldId}}`).join(`:${tmpId}}`);   // id:206}
  src = src.split(`:${oldId}\n`).join(`:${tmpId}\n`); // id:206\n
  src = src.split(`{id:${oldId},`).join(`{id:${tmpId},`);  // {id:206,
  src = src.split(`{id:${oldId} `).join(`{id:${tmpId} `);  // {id:206
}

// Pass 2: temp IDs → final IDs
for (const [oldId, newId] of mappings) {
  const tmpId = oldId + 5000;
  src = src.split(`:${tmpId},`).join(`:${newId},`);
  src = src.split(`:${tmpId} `).join(`:${newId} `);
  src = src.split(`:${tmpId}}`).join(`:${newId}}`);
  src = src.split(`:${tmpId}\n`).join(`:${newId}\n`);
  src = src.split(`{id:${tmpId},`).join(`{id:${newId},`);
  src = src.split(`{id:${tmpId} `).join(`{id:${newId} `);
}

// Update LEGENDARIES section marker (add after 313)
src = src.replace('  // ===== LEGENDARIES =====\n  206:', '  // ===== LEGENDARIES (IDs 314-321) =====\n  314:');
src = src.replace('  // ===== NEW LEGENDARIES =====\n  209:', '  317:');

// Fix any 314: (which was 206:) key in object
// The JS object keys need updating too - they're just numeric keys
// Replace "  206: {" → "  314: {" style entries at start of line
for (const [oldId, newId] of mappings) {
  const tmpId = oldId + 5000;
  // Object key style: "  206: { id:206,"
  src = src.split(`  ${oldId}: { id:${oldId},`).join(`  ${tmpId}: { id:${tmpId},`);
}
for (const [oldId, newId] of mappings) {
  const tmpId = oldId + 5000;
  src = src.split(`  ${tmpId}: { id:${tmpId},`).join(`  ${newId}: { id:${newId},`);
}

fs.writeFileSync(dataPath, src, 'utf8');
console.log('Done! Legendaries moved 206-213 → 314-321');

// Verify
const lines = src.split('\n');
const legCheck = [314,315,316,317,318,319,320,321];
for (const id of legCheck) {
  const found = lines.some(l => l.includes(`  ${id}: { id:${id},`));
  console.log(`  ID ${id}: ${found ? 'OK' : 'MISSING'}`);
}
// Make sure old IDs are gone from monster definitions
const oldIds = [206,207,208,209,210,211,212,213];
for (const id of oldIds) {
  const found = lines.some(l => l.match(new RegExp(`^  ${id}: \\{ id:${id},`)));
  if (found) console.log(`  WARNING: old ID ${id} still present as monster definition!`);
}
console.log('Verification complete.');
