#!/usr/bin/env node
"use strict";
const fs = require("fs"), path = require("path");
const R = JSON.parse(fs.readFileSync(path.join(__dirname, "gym_rebuild_out.json"), "utf8"));
const order = ["rex","marina","pyros","kano","zara","glacier","marl","nyx","oracle","drake","thorne","acrid","viper","atlas","mantis","steam","zephyra","ferro","boulder","seraphina","echo","mortis","somna","prisma"];
const out = [];
const roleTag = r => ({ ace: "★ACE", dual: "◆DUAL", on: "on", off: "✖OFF" }[r] || r);
const line = m => `      ${roleTag(m.role).padEnd(6)} #${String(m.monsterId).padStart(3)} ${m.name} [${m.types.join("/")}] Lv${m.level}  {${m.moves.join(", ")}}`;
const styleBlock = (label, styles) => {
  out.push(`    ${label}:`);
  for (const st of ["single","double","triple"]) {
    if (!styles[st]) continue;
    out.push(`    · ${st} (${styles[st].length}):`);
    styles[st].forEach(m => out.push(line(m)));
  }
};
order.forEach((id, i) => {
  const g = R[id]; if (!g) return;
  out.push(`\n## GYM ${i + 1} — ${id}`);
  if (g.base) styleBlock("BASE", g.base.styles);
  if (g.ng) styleBlock("NG+", g.ng.styles);
});
["aria", "grimshaw", "celeste", "titan", "champion"].forEach(id => {
  const g = R[id]; if (!g || !g.mixed) return;
  out.push(`\n## ${id.toUpperCase()} (Vanguard/Champion)`);
  styleBlock("TEAM", g.mixed.styles);
});
fs.writeFileSync(path.join(__dirname, "gym_rebuild_report.txt"), out.join("\n"));
console.log("wrote scripts/gym_rebuild_report.txt (" + out.length + " lines)");
// also print just the ACES + one sample full gym for inline review
console.log("\n=== ACES (signature, fixed across styles) ===");
order.forEach((id, i) => {
  const g = R[id]; const set = g.ng || g.base; const ace = set.styles.single.find(m => m.role === "ace");
  console.log(`  G${String(i+1).padStart(2)} ${id.padEnd(10)} ace #${ace.monsterId} ${ace.name} [${ace.types.join("/")}]`);
});
