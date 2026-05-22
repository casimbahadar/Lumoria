#!/usr/bin/env python3
"""Phase C applier: extend TYPE_CHART from 19 to 26 types by adding rows
and columns for the 7 new types (Sonic, Vapor, Mineral, Toxin, Chrono,
Stellar, Dream) with the locked values from Phase C interactive sub-phases."""

import re

DATA = "/home/user/Lumoria/js/data.js"

EXISTING = ["Fire","Aquatic","Nature","Electric","Earth","Wind","Ice","Dark",
            "Fairy","Metal","Poison","Mental","Draconic","Normal","Spectral",
            "Fighting","Aether","Crystal","Primal"]
NEW = ["Sonic","Vapor","Mineral","Toxin","Chrono","Stellar","Dream"]
ALL_TYPES = EXISTING + NEW

# === New attacking rows (locked from Phase C) ===
NEW_ROWS = {
    "Sonic":   {"Fire":0.5,"Aquatic":2,"Nature":1,"Electric":1,"Earth":0,
                "Wind":0.5,"Ice":2,"Dark":2,"Fairy":1,"Metal":1,"Poison":0.5,
                "Mental":2,"Draconic":1,"Normal":1,"Spectral":1,"Fighting":1,
                "Aether":1,"Crystal":2,"Primal":1,"Sonic":0.5,"Vapor":1,
                "Mineral":2,"Toxin":0.5,"Chrono":0.5,"Stellar":1,"Dream":2},
    "Vapor":   {"Fire":0.5,"Aquatic":0.5,"Nature":0.5,"Electric":1,"Earth":1,
                "Wind":0.5,"Ice":2,"Dark":1,"Fairy":1,"Metal":2,"Poison":0.5,
                "Mental":2,"Draconic":1,"Normal":1,"Spectral":2,"Fighting":1,
                "Aether":1,"Crystal":0.5,"Primal":1,"Sonic":1,"Vapor":0.5,
                "Mineral":2,"Toxin":1,"Chrono":1,"Stellar":1,"Dream":2},
    "Mineral": {"Fire":0.5,"Aquatic":0.5,"Nature":2,"Electric":1,"Earth":0.5,
                "Wind":2,"Ice":2,"Dark":1,"Fairy":2,"Metal":1,"Poison":1,
                "Mental":1,"Draconic":1,"Normal":1,"Spectral":0,"Fighting":1,
                "Aether":1,"Crystal":0.5,"Primal":1,"Sonic":1,"Vapor":0.5,
                "Mineral":0.5,"Toxin":1,"Chrono":1,"Stellar":1,"Dream":2},
    "Toxin":   {"Fire":0.5,"Aquatic":0.5,"Nature":2,"Electric":1,"Earth":0.5,
                "Wind":2,"Ice":0.5,"Dark":1,"Fairy":2,"Metal":0,"Poison":0.5,
                "Mental":2,"Draconic":1,"Normal":2,"Spectral":0,"Fighting":2,
                "Aether":1,"Crystal":0,"Primal":0.5,"Sonic":0.5,"Vapor":1,
                "Mineral":0,"Toxin":0.5,"Chrono":1,"Stellar":1,"Dream":2},
    "Chrono":  {"Fire":1,"Aquatic":1,"Nature":2,"Electric":1,"Earth":2,
                "Wind":1,"Ice":1,"Dark":1,"Fairy":0.5,"Metal":1,"Poison":1,
                "Mental":1,"Draconic":2,"Normal":2,"Spectral":0.5,"Fighting":1,
                "Aether":0.5,"Crystal":1,"Primal":1,"Sonic":2,"Vapor":2,
                "Mineral":2,"Toxin":2,"Chrono":0.5,"Stellar":0.5,"Dream":2},
    "Stellar": {"Fire":0.5,"Aquatic":0.5,"Nature":2,"Electric":1,"Earth":2,
                "Wind":0.5,"Ice":1,"Dark":2,"Fairy":1,"Metal":0.5,"Poison":1,
                "Mental":2,"Draconic":2,"Normal":2,"Spectral":1,"Fighting":1,
                "Aether":2,"Crystal":1,"Primal":1,"Sonic":1,"Vapor":1,
                "Mineral":1,"Toxin":1,"Chrono":2,"Stellar":0.5,"Dream":1},
    "Dream":   {"Fire":1,"Aquatic":1,"Nature":1,"Electric":1,"Earth":0.5,
                "Wind":0.5,"Ice":1,"Dark":2,"Fairy":2,"Metal":0.5,"Poison":1,
                "Mental":2,"Draconic":2,"Normal":2,"Spectral":2,"Fighting":2,
                "Aether":1,"Crystal":0.5,"Primal":1,"Sonic":2,"Vapor":1,
                "Mineral":0,"Toxin":0.5,"Chrono":2,"Stellar":2,"Dream":0.5},
}

# === New defending columns (attacker -> NewType). Used to extend existing rows. ===
NEW_COLS = {
    "Sonic":   {"Fire":1,"Aquatic":1,"Nature":0,"Electric":1,"Earth":2,
                "Wind":2,"Ice":2,"Dark":1,"Fairy":1,"Metal":0.5,"Poison":0.5,
                "Mental":1,"Draconic":2,"Normal":1,"Spectral":1,"Fighting":1,
                "Aether":1,"Crystal":1,"Primal":1,"Sonic":0.5,"Vapor":1,
                "Mineral":1,"Toxin":0.5,"Chrono":2,"Stellar":1,"Dream":2},
    "Vapor":   {"Fire":2,"Aquatic":1,"Nature":0.5,"Electric":2,"Earth":0.5,
                "Wind":2,"Ice":0.5,"Dark":1,"Fairy":0.5,"Metal":0.5,"Poison":0.5,
                "Mental":0.5,"Draconic":2,"Normal":0.5,"Spectral":0.5,"Fighting":0,
                "Aether":2,"Crystal":0.5,"Primal":1,"Sonic":1,"Vapor":0.5,
                "Mineral":0.5,"Toxin":1,"Chrono":2,"Stellar":1,"Dream":1},
    "Mineral": {"Fire":0.5,"Aquatic":2,"Nature":1,"Electric":1,"Earth":1,
                "Wind":1,"Ice":0.5,"Dark":1,"Fairy":1,"Metal":2,"Poison":1,
                "Mental":0.5,"Draconic":1,"Normal":0.5,"Spectral":0,"Fighting":2,
                "Aether":1,"Crystal":0.5,"Primal":1,"Sonic":2,"Vapor":2,
                "Mineral":0.5,"Toxin":0,"Chrono":2,"Stellar":1,"Dream":0},
    "Toxin":   {"Fire":2,"Aquatic":1,"Nature":2,"Electric":1,"Earth":1,
                "Wind":0.5,"Ice":1,"Dark":1,"Fairy":2,"Metal":2,"Poison":0.5,
                "Mental":1,"Draconic":1,"Normal":1,"Spectral":0.5,"Fighting":1,
                "Aether":2,"Crystal":0.5,"Primal":1,"Sonic":0.5,"Vapor":1,
                "Mineral":1,"Toxin":0.5,"Chrono":2,"Stellar":1,"Dream":0.5},
    "Chrono":  {"Fire":0.5,"Aquatic":0.5,"Nature":0.5,"Electric":0.5,"Earth":0.5,
                "Wind":0.5,"Ice":0.5,"Dark":1,"Fairy":1,"Metal":0.5,"Poison":0.5,
                "Mental":2,"Draconic":1,"Normal":0.5,"Spectral":1,"Fighting":0.5,
                "Aether":2,"Crystal":1,"Primal":2,"Sonic":0.5,"Vapor":1,
                "Mineral":1,"Toxin":1,"Chrono":0.5,"Stellar":2,"Dream":2},
    "Stellar": {"Fire":0.5,"Aquatic":0.5,"Nature":0.5,"Electric":0.5,"Earth":0.5,
                "Wind":0.5,"Ice":0.5,"Dark":2,"Fairy":1,"Metal":1,"Poison":1,
                "Mental":1,"Draconic":1,"Normal":0.5,"Spectral":1,"Fighting":0.5,
                "Aether":1,"Crystal":1,"Primal":2,"Sonic":1,"Vapor":1,
                "Mineral":1,"Toxin":1,"Chrono":0.5,"Stellar":0.5,"Dream":2},
    "Dream":   {"Fire":2,"Aquatic":1,"Nature":1,"Electric":2,"Earth":1,
                "Wind":1,"Ice":1,"Dark":0.5,"Fairy":1,"Metal":1,"Poison":1,
                "Mental":2,"Draconic":1,"Normal":1,"Spectral":1,"Fighting":1,
                "Aether":0.5,"Crystal":1,"Primal":2,"Sonic":2,"Vapor":2,
                "Mineral":2,"Toxin":2,"Chrono":2,"Stellar":1,"Dream":0.5},
}

# === Consistency check: cross-new cells should agree ===
for r in NEW:
    for c in NEW:
        v_row = NEW_ROWS[r][c]
        v_col = NEW_COLS[c][r]
        if v_row != v_col:
            print(f"WARN: inconsistency at ({r}->{c}): row={v_row}, col={v_col}")

with open(DATA, "r", encoding="utf-8") as f:
    content = f.read()

# === Parse existing chart ===
chart_start = content.index("const TYPE_CHART = {")
chart_end = content.index("};", chart_start) + 2
chart_block = content[chart_start:chart_end]
row_re = re.compile(r'^\s*(\w+)\s*:\s*\{\s*([^}]+)\}\s*,?\s*$', re.MULTILINE)
existing_chart = {}
for m in row_re.finditer(chart_block):
    attacker = m.group(1)
    cells_str = m.group(2)
    cells = {}
    for cm in re.finditer(r'(\w+)\s*:\s*([\d.]+)', cells_str):
        cells[cm.group(1)] = float(cm.group(2))
    existing_chart[attacker] = cells

# === Build new 26x26 chart ===
new_chart = {}
for attacker in ALL_TYPES:
    row = {}
    for defender in ALL_TYPES:
        if attacker in NEW:
            row[defender] = NEW_ROWS[attacker][defender]
        elif defender in NEW:
            row[defender] = NEW_COLS[defender][attacker]
        else:
            row[defender] = existing_chart[attacker][defender]
    new_chart[attacker] = row

# === Format ===
def fmt(v):
    if v == int(v):
        return str(int(v))
    return str(v)

maxlen = max(len(t) for t in ALL_TYPES)
attacker_w = maxlen
lines = ["const TYPE_CHART = {"]
for ai, attacker in enumerate(ALL_TYPES):
    cells = []
    for t in ALL_TYPES:
        v = fmt(new_chart[attacker][t])
        cell = f"{t}:{v},"
        cells.append(f"{cell:<{maxlen+5}}")
    cells[-1] = cells[-1].rstrip().rstrip(",")
    line = f"  {attacker:<{attacker_w}}: {{ {' '.join(cells)} }}"
    if ai < len(ALL_TYPES) - 1:
        line += ","
    lines.append(line)
lines.append("};")
new_block = "\n".join(lines)

content = content[:chart_start] + new_block + content[chart_end:]

with open(DATA, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Phase C applied. Chart now {len(ALL_TYPES)} types ({len(EXISTING)} existing + {len(NEW)} new).")
