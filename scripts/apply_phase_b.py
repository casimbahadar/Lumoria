#!/usr/bin/env python3
"""Phase B applier: rewrite TYPE_CHART to 19-type structure + rename
literal quoted type strings in type:/types: fields + collapse 6 dual->mono."""

import re

DATA = "/home/user/Lumoria/js/data.js"

# === New 19-type chart (Phase B.1-B.4 decisions) ===
# Order: Fire, Aquatic, Nature, Electric, Earth, Wind, Ice, Dark, Fairy,
#        Metal, Poison, Mental, Draconic, Normal, Spectral, Fighting,
#        Aether, Crystal, Primal
TYPES = ["Fire","Aquatic","Nature","Electric","Earth","Wind","Ice","Dark",
         "Fairy","Metal","Poison","Mental","Draconic","Normal","Spectral",
         "Fighting","Aether","Crystal","Primal"]

# B.1 Nature attacking row
NATURE_ROW = {"Fire":0.5,"Aquatic":2,"Nature":1,"Electric":1,"Earth":2,
              "Wind":0.5,"Ice":0.5,"Dark":1,"Fairy":1,"Metal":0.5,
              "Poison":0.5,"Mental":2,"Draconic":1,"Normal":1,"Spectral":1,
              "Fighting":1,"Aether":1,"Crystal":0.5,"Primal":1}

# B.3 Earth attacking row
EARTH_ROW = {"Fire":2,"Aquatic":0.5,"Nature":0.5,"Electric":1,"Earth":0.5,
             "Wind":0,"Ice":2,"Dark":1,"Fairy":1,"Metal":2,"Poison":1,
             "Mental":1,"Draconic":1,"Normal":1,"Spectral":0,"Fighting":0.5,
             "Aether":1,"Crystal":2,"Primal":1}

# B.2 Nature defending column (attacker -> Nature)
NATURE_COL = {"Fire":2,"Aquatic":0,"Electric":0.5,"Earth":0.5,"Wind":2,
              "Ice":2,"Dark":1,"Fairy":1,"Metal":1,"Poison":2,"Mental":0.5,
              "Draconic":2,"Normal":1,"Spectral":0,"Fighting":1,"Aether":1,
              "Crystal":1,"Primal":1}

# B.4 Earth defending column (attacker -> Earth)
EARTH_COL = {"Fire":1,"Aquatic":2,"Electric":0,"Wind":0,"Ice":2,"Dark":0.5,
             "Fairy":1,"Metal":0.5,"Poison":1,"Mental":0.5,"Draconic":1,
             "Normal":1,"Spectral":0,"Fighting":2,"Aether":1,"Crystal":1,
             "Primal":1}

with open(DATA, "r", encoding="utf-8") as f:
    content = f.read()

# === Parse existing TYPE_CHART rows for retained attackers ===
chart_start = content.index("const TYPE_CHART = {")
chart_end = content.index("};", chart_start) + 2
chart_block = content[chart_start:chart_end]

# Extract each attacker row
row_re = re.compile(r'^\s*(\w+):\s*\{\s*([^}]+)\}\s*,?\s*$', re.MULTILINE)
existing_rows = {}
for m in row_re.finditer(chart_block):
    attacker = m.group(1)
    cells_str = m.group(2)
    cells = {}
    for cm in re.finditer(r'(\w+):([\d.]+)', cells_str):
        cells[cm.group(1)] = float(cm.group(2))
    existing_rows[attacker] = cells

# === Build new chart ===
new_chart = {}
for attacker in TYPES:
    if attacker == "Nature":
        new_chart["Nature"] = {t: NATURE_ROW[t] for t in TYPES}
    elif attacker == "Earth":
        new_chart["Earth"] = {t: EARTH_ROW[t] for t in TYPES}
    else:
        # Use existing row, drop Grass/Bug/Rock/Ground columns, add Nature & Earth
        row = {}
        for t in TYPES:
            if t == "Nature":
                row[t] = NATURE_COL[attacker]
            elif t == "Earth":
                row[t] = EARTH_COL[attacker]
            else:
                # Look up existing value
                if t in existing_rows[attacker]:
                    row[t] = existing_rows[attacker][t]
                else:
                    print(f"WARN: {attacker}->{t} not found in existing chart")
                    row[t] = 1.0
        new_chart[attacker] = row

# === Format new TYPE_CHART block ===
def fmt(v):
    """Format multiplier as 0.5/1/2 without trailing decimals for ints."""
    if v == int(v):
        return str(int(v))
    return str(v)

# Width of each type name for alignment
maxlen = max(len(t) for t in TYPES)

lines = ["const TYPE_CHART = {"]
attacker_w = max(len(t) for t in TYPES)
for ai, attacker in enumerate(TYPES):
    row = new_chart[attacker]
    cells = []
    for t in TYPES:
        v = fmt(row[t])
        cell = f"{t}:{v},"
        cells.append(f"{cell:<{maxlen+5}}")
    # Trim trailing comma on last cell of row
    cells[-1] = cells[-1].rstrip().rstrip(",")
    line = f"  {attacker:<{attacker_w}}: {{ {' '.join(cells)} }}"
    if ai < len(TYPES) - 1:
        line += ","
    lines.append(line)
lines.append("};")
new_chart_block = "\n".join(lines)

# === Replace TYPE_CHART block in content ===
content = content[:chart_start] + new_chart_block + content[chart_end:]

# === Literal-quote renames for type:/types: fields ===
# These only match exact "Grass" / "Bug" / "Rock" / "Ground" quoted strings,
# so move names like "Bug Bite" and lore prose are safe.
renames = [('"Grass"', '"Nature"'),
           ('"Bug"', '"Nature"'),
           ('"Rock"', '"Earth"'),
           ('"Ground"', '"Earth"')]
for old, new in renames:
    n = content.count(old)
    content = content.replace(old, new)
    print(f"  Replaced {old} -> {new}: {n} occurrences")

# === Collapse dual-fused to mono ===
collapses = [('types:["Nature","Nature"]', 'types:["Nature"]'),
             ('types:["Earth","Earth"]', 'types:["Earth"]')]
for old, new in collapses:
    n = content.count(old)
    content = content.replace(old, new)
    print(f"  Collapsed {old} -> {new}: {n} occurrences")

# === Section comment renames ===
comment_renames = [
    (r'^(\s*//\s*---\s*)Grass(\s*---)', r'\1Nature\2'),
    (r'^(\s*//\s*---\s*)Bug(\s*---)', r'\1Nature\2'),  # may dup with Grass; OK
    (r'^(\s*//\s*---\s*)Rock(\s*---)', r'\1Earth\2'),
    (r'^(\s*//\s*---\s*)Ground(\s*---)', r'\1Earth\2'),
    (r'^(\s*//\s*---\s*NEW:\s*)Grass\b', r'\1Nature'),
    (r'^(\s*//\s*---\s*NEW:\s*)Bug\b', r'\1Nature'),
    (r'^(\s*//\s*---\s*NEW:\s*)Rock\b', r'\1Earth'),
    (r'^(\s*//\s*---\s*NEW:\s*)Ground\b', r'\1Earth'),
]
for pat, repl in comment_renames:
    new_content, n = re.subn(pat, repl, content, flags=re.MULTILINE)
    if n > 0:
        print(f"  Comment rename {pat!r}: {n}")
        content = new_content

with open(DATA, "w", encoding="utf-8") as f:
    f.write(content)

print("\nPhase B applied. Verifying...")

# === Verify ===
verify = open(DATA).read()
for t in ["Grass", "Bug", "Rock", "Ground"]:
    in_chart = bool(re.search(rf'\b{t}:', verify[verify.index("TYPE_CHART"):verify.index("};", verify.index("TYPE_CHART"))]))
    in_type_field = (f'"{t}"' in verify)
    print(f"  {t}: in chart? {in_chart} | quoted-string remaining? {in_type_field}")
