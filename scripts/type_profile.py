#!/usr/bin/env python3
"""Per-type offensive + defensive profile from current TYPE_CHART."""

import re

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

types = list(chart.keys())

print(f"# Per-type profile ({len(types)} types)\n")

for t in types:
    print(f"## {t}")
    # Offensive (this type as attacker)
    se = sorted([d for d, v in chart[t].items() if v == 2 and d != t])
    nve = sorted([d for d, v in chart[t].items() if v == 0.5 and d != t])
    immune_def = sorted([d for d, v in chart[t].items() if v == 0 and d != t])
    # Defensive (this type as defender)
    weak = sorted([a for a in types if a != t and chart[a].get(t) == 2])
    resist = sorted([a for a in types if a != t and chart[a].get(t) == 0.5])
    immune = sorted([a for a in types if a != t and chart[a].get(t) == 0])
    self_off = chart[t][t]

    print(f"  OFFENSE — super-effective ({len(se)}): {', '.join(se) if se else '—'}")
    print(f"  OFFENSE — not-very-effective ({len(nve)}): {', '.join(nve) if nve else '—'}")
    print(f"  OFFENSE — no-effect ({len(immune_def)}): {', '.join(immune_def) if immune_def else '—'}")
    print(f"  DEFENSE — weak to ({len(weak)}): {', '.join(weak) if weak else '—'}")
    print(f"  DEFENSE — resists ({len(resist)}): {', '.join(resist) if resist else '—'}")
    print(f"  DEFENSE — immune to ({len(immune)}): {', '.join(immune) if immune else '—'}")
    print(f"  SELF: {self_off}x")
    print()

# Summary table
print("=" * 80)
print(f"## SUMMARY TABLE\n")
print(f"{'Type':<10} | {'2× atk':>6} | {'.5× atk':>7} | {'0× atk':>6} | {'2× def':>6} | {'.5× def':>7} | {'0× def':>6}")
print("-" * 70)
for t in types:
    se = sum(1 for d, v in chart[t].items() if v == 2 and d != t)
    nve = sum(1 for d, v in chart[t].items() if v == 0.5 and d != t)
    immune_def = sum(1 for d, v in chart[t].items() if v == 0 and d != t)
    weak = sum(1 for a in types if a != t and chart[a].get(t) == 2)
    resist = sum(1 for a in types if a != t and chart[a].get(t) == 0.5)
    immune = sum(1 for a in types if a != t and chart[a].get(t) == 0)
    print(f"{t:<10} | {se:>6} | {nve:>7} | {immune_def:>6} | {weak:>6} | {resist:>7} | {immune:>6}")
