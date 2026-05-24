#!/usr/bin/env python3
"""Generate Phase C-style per-type tables for the 19 existing types
(skipping the 7 new types which were just finalized in Phase C).
Output: Markdown file with one attacking row + one defending column
table per type, listing all 26 cells with current values."""

import re

EXISTING = ["Fire","Aquatic","Nature","Electric","Earth","Wind","Ice","Dark",
            "Fairy","Metal","Poison","Mental","Draconic","Normal","Spectral",
            "Fighting","Aether","Crystal","Primal"]
NEW = ["Sonic","Vapor","Mineral","Toxin","Chrono","Stellar","Dream"]
ALL_TYPES = EXISTING + NEW

with open('/home/user/Lumoria/js/data.js') as f:
    content = f.read()

chart_start = content.index("const TYPE_CHART = {")
chart_end = content.index("};", chart_start) + 2
chart_block = content[chart_start:chart_end]

chart = {}
for m in re.finditer(r'^\s*(\w+)\s*:\s*\{\s*([^}]+)\}\s*,?\s*$', chart_block, re.MULTILINE):
    attacker = m.group(1)
    cells = {}
    for cm in re.finditer(r'(\w+)\s*:\s*([\d.]+)', m.group(2)):
        cells[cm.group(1)] = float(cm.group(2))
    chart[attacker] = cells

def fmt(v):
    if v == int(v):
        return str(int(v))
    return str(v)

def cell_marker(v):
    """Return bold/non-bold marker for non-1× cells."""
    if v == 1:
        return ""
    return "**"

lines = []
lines.append("# Phase D twist deliberation — current state of the 19 existing types\n")
lines.append("Each type has two tables: attacking row (this type → defender) and defending column (attacker → this type).\n")
lines.append("Non-1× cells are bolded for easy scanning. Neutral 1× cells shown for completeness.\n")
lines.append("The 7 new types (Sonic, Vapor, Mineral, Toxin, Chrono, Stellar, Dream) are NOT shown — they're already finalized.\n")
lines.append("---\n")

for t in EXISTING:
    lines.append(f"## {t}\n")
    # Attacking row
    lines.append(f"### {t} attacking row ({t} → defender)\n")
    lines.append("| Defender | Value |")
    lines.append("|---|---|")
    for d in ALL_TYPES:
        v = chart[t][d]
        b = cell_marker(v)
        marker = " (self)" if d == t else ""
        lines.append(f"| {b}{d}{b}{marker} | {b}{fmt(v)}{b} |")
    lines.append("")

    # Defending column
    lines.append(f"### {t} defending column (attacker → {t})\n")
    lines.append("| Attacker | Value |")
    lines.append("|---|---|")
    for a in ALL_TYPES:
        v = chart[a][t]
        b = cell_marker(v)
        marker = " (self)" if a == t else ""
        lines.append(f"| {b}{a}{b}{marker} | {b}{fmt(v)}{b} |")
    lines.append("\n---\n")

with open('/tmp/phase_d_tables.md', 'w') as f:
    f.write('\n'.join(lines))

print(f"Wrote {len(EXISTING)} type tables to /tmp/phase_d_tables.md")
