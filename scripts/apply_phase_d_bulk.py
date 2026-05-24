#!/usr/bin/env python3
"""Phase D bulk user-tweaks applier: 56 cell edits transcribed from
handwritten notes (May 2026 session). Modifies TYPE_CHART in place."""

import re

DATA = "/home/user/Lumoria/js/data.js"

# (attacker, defender, new_value)
CHANGES = [
    # Fire
    ("Fire", "Dark", 2),
    ("Fire", "Fairy", 2),
    ("Fire", "Aether", 0.5),
    ("Wind", "Fire", 0),
    ("Dark", "Fire", 2),
    ("Aether", "Fire", 2),
    ("Primal", "Fire", 2),
    # Aquatic
    ("Aquatic", "Crystal", 2),
    ("Aquatic", "Primal", 2),
    ("Ice", "Aquatic", 2),
    ("Metal", "Aquatic", 0.5),
    # Nature
    ("Nature", "Electric", 2),
    ("Nature", "Primal", 2),
    ("Primal", "Nature", 0),
    # Electric
    ("Electric", "Draconic", 2),
    ("Electric", "Aether", 1),
    ("Metal", "Electric", 0.5),
    ("Draconic", "Electric", 0.5),
    ("Crystal", "Electric", 2),
    # Wind
    ("Wind", "Fairy", 2),
    ("Wind", "Fighting", 2),
    ("Wind", "Mental", 0.5),
    ("Spectral", "Wind", 2),
    ("Mental", "Wind", 2),
    # Ice
    ("Ice", "Mental", 2),
    ("Ice", "Normal", 2),
    ("Normal", "Ice", 0.5),
    ("Fairy", "Ice", 0.5),
    # Dark
    ("Dark", "Fighting", 2),
    ("Fighting", "Dark", 0),
    ("Normal", "Dark", 0.5),
    # Fairy
    ("Fairy", "Poison", 1),
    ("Fairy", "Aether", 1),
    ("Normal", "Fairy", 0.5),
    ("Earth", "Fairy", 0.5),
    # Metal
    ("Metal", "Fighting", 2),
    ("Mental", "Metal", 0.5),
    # Poison
    ("Poison", "Mental", 2),
    ("Poison", "Primal", 2),
    ("Crystal", "Poison", 2),
    # Mental
    ("Mental", "Normal", 2),
    ("Mental", "Aether", 1),
    ("Normal", "Mental", 0.5),
    ("Aether", "Mental", 1),
    # Draconic
    ("Draconic", "Aether", 0.5),
    ("Wind", "Draconic", 0.5),
    ("Normal", "Draconic", 0.5),
    # Normal
    ("Normal", "Primal", 2),
    ("Primal", "Normal", 0.5),
    ("Fighting", "Normal", 1),
    # Spectral
    ("Spectral", "Primal", 2),
    ("Primal", "Spectral", 0.5),
    # Fighting
    ("Fighting", "Primal", 2),
    # Aether
    ("Aether", "Primal", 0.5),
]

with open(DATA, "r", encoding="utf-8") as f:
    content = f.read()

chart_start = content.index("const TYPE_CHART = {")
chart_end = content.index("};", chart_start) + 2
chart_block = content[chart_start:chart_end]

# Parse current chart
chart = {}
row_re = re.compile(r'^\s*(\w+)\s*:\s*\{\s*([^}]+)\}\s*,?\s*$', re.MULTILINE)
for m in row_re.finditer(chart_block):
    attacker = m.group(1)
    cells = {}
    for cm in re.finditer(r'(\w+)\s*:\s*([\d.]+)', m.group(2)):
        cells[cm.group(1)] = float(cm.group(2))
    chart[attacker] = cells

# Apply changes, tracking before/after
print(f"Applying {len(CHANGES)} cell edits:\n")
TYPES = list(chart.keys())
changed = 0
for attacker, defender, new_val in CHANGES:
    if attacker not in chart:
        print(f"  ERROR: unknown attacker '{attacker}'")
        continue
    if defender not in chart[attacker]:
        print(f"  ERROR: unknown defender '{defender}' in {attacker} row")
        continue
    old = chart[attacker][defender]
    if old == new_val:
        print(f"  {attacker}->{defender}: already {new_val} (no-op)")
    else:
        print(f"  {attacker}->{defender}: {old} -> {new_val}")
        chart[attacker][defender] = new_val
        changed += 1
print(f"\n{changed} actual changes applied (rest were no-ops).")

# Format new chart
def fmt(v):
    if v == int(v):
        return str(int(v))
    return str(v)

maxlen = max(len(t) for t in TYPES)
attacker_w = maxlen
lines = ["const TYPE_CHART = {"]
for ai, attacker in enumerate(TYPES):
    cells = []
    for t in TYPES:
        v = fmt(chart[attacker][t])
        cell = f"{t}:{v},"
        cells.append(f"{cell:<{maxlen+5}}")
    cells[-1] = cells[-1].rstrip().rstrip(",")
    line = f"  {attacker:<{attacker_w}}: {{ {' '.join(cells)} }}"
    if ai < len(TYPES) - 1:
        line += ","
    lines.append(line)
lines.append("};")
new_block = "\n".join(lines)

content = content[:chart_start] + new_block + content[chart_end:]
with open(DATA, "w", encoding="utf-8") as f:
    f.write(content)

print("\nChart rewritten.")
