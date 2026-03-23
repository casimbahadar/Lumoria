#!/usr/bin/env node
// Fix object keys for legendaries where id: was updated but key wasn't
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'js', 'data.js');
let src = fs.readFileSync(dataPath, 'utf8');

// Remaining bad object keys: old_key: { id:new_id,
// Based on inspection: 207→315, 208→316, 210→318, 211→319, 212→320, 213→321
// Also 213 key maps to id:321

const fixes = [
  ['213', '321'],  // object key 213 → 321
  ['207', '315'],
  ['208', '316'],
  ['210', '318'],
  ['211', '319'],
  ['212', '320'],
];

for (const [oldKey, newId] of fixes) {
  // Pattern: "  207: { id:315," - replace just the object key part
  // Use regex to match "  <oldKey>: { id:<newId>,"
  const pattern = new RegExp(`  ${oldKey}: \\{ id:${newId},`, 'g');
  src = src.replace(pattern, `  ${newId}: { id:${newId},`);
}

fs.writeFileSync(dataPath, src, 'utf8');

// Verify
const lines = src.split('\n');
const legIds = [314,315,316,317,318,319,320,321];
for (const id of legIds) {
  const found = lines.some(l => l.match(new RegExp(`^  ${id}: \\{ id:${id},`)));
  console.log(`  ID ${id}: ${found ? 'OK' : 'MISSING'}`);
}
// Check no old monster-definition keys remain
for (const id of [206,207,208,209,210,211,212,213]) {
  const found = lines.some(l => l.match(new RegExp(`^  ${id}: \\{ id:[0-9]`)));
  if (found) console.log(`  WARNING: old key ${id} still present`);
}
console.log('Done.');
