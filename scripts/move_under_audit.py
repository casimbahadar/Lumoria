#!/usr/bin/env python3
"""One-off variant of scripts/move_utilization.py with threshold <5 users."""
import re
from pathlib import Path
from collections import defaultdict

DATA_JS = Path(__file__).resolve().parent.parent / "js" / "data.js"
text = DATA_JS.read_text()

moves_start = text.find("const MOVES_DATA = {")
moves_end_match = re.search(r'^\};', text[moves_start:], re.MULTILINE)
moves_block = text[moves_start:moves_start + moves_end_match.start()]

moves = {}
mpat = re.compile(r'^\s*(\w+):\s*\{\s*name:"([^"]+)",\s*type:"(\w+)"', re.MULTILINE)
for m in mpat.finditer(moves_block):
    moves[m.group(1)] = {"key": m.group(1), "name": m.group(2), "type": m.group(3)}

mons_start = text.find("const MONSTERS_DATA = {")
mons_text = text[mons_start:]
id_starts = [(int(m.group(2)), m.start()) for m in re.finditer(r'^\s*(\d+):\s*\{\s*id:(\d+),', mons_text, re.MULTILINE)]

learn_count = defaultdict(int)
for i, (mid, pos) in enumerate(id_starts):
    next_pos = id_starts[i+1][1] if i+1 < len(id_starts) else len(mons_text)
    block = mons_text[pos:next_pos]
    ls_match = re.search(r'learnset:\s*\[', block)
    if not ls_match:
        continue
    start = ls_match.end()
    depth = 1; j = start
    while j < len(block) and depth:
        if block[j] == '[': depth += 1
        elif block[j] == ']': depth -= 1
        j += 1
    learnset_str = block[start:j-1]
    seen_in_this_mon = set(re.findall(r'"([a-z][a-z0-9_]*)"', learnset_str))
    for k in seen_in_this_mon:
        learn_count[k] += 1

# Per-type bucketing
THRESHOLD = 5  # under-5 means strictly less than 5 (0,1,2,3,4)
type_stats = defaultdict(lambda: {"total": 0, "under": [], "all": []})
for k, info in moves.items():
    cnt = learn_count.get(k, 0)
    t = info["type"]
    type_stats[t]["total"] += 1
    type_stats[t]["all"].append((cnt, k, info["name"]))
    if cnt < THRESHOLD:
        type_stats[t]["under"].append((cnt, k, info["name"]))

# Headline table
print(f"{'Type':<12} {'<5 used / Total':>18} {'Fraction':>10}")
print("=" * 50)
totals_under = 0
totals_all = 0
for t in sorted(type_stats.keys()):
    s = type_stats[t]
    under_n = len(s["under"])
    total = s["total"]
    frac = f"{under_n}/{total}"
    pct = (under_n / total * 100) if total else 0
    print(f"{t:<12} {frac:>18} {pct:>9.1f}%")
    totals_under += under_n
    totals_all += total
print("-" * 50)
frac = f"{totals_under}/{totals_all}"
pct = (totals_under / totals_all * 100) if totals_all else 0
print(f"{'TOTAL':<12} {frac:>18} {pct:>9.1f}%")
print()

# Per-type detail
print("=" * 80)
print(f"PER-TYPE DETAIL — moves with fewer than {THRESHOLD} Lumori using them")
print("=" * 80)
for t in sorted(type_stats.keys()):
    s = type_stats[t]
    if not s["under"]:
        print(f"\n  {t}: 0/{s['total']} — all moves used by {THRESHOLD}+ Lumori ✓")
        continue
    print(f"\n  {t}: {len(s['under'])}/{s['total']} under-utilized")
    s["under"].sort(key=lambda x: (x[0], x[1]))
    for cnt, key, name in s["under"]:
        print(f"    [{cnt:>2}] {key:<28} \"{name}\"")
