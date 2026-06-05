#!/usr/bin/env python3
"""
Phase 2: STAB-completeness audit discovery.

For each Lumori, list its types and count how many learnset moves match
each type. Flag Lumori with insufficient STAB coverage.

Thresholds (per type, per Lumori, by stage):
  - base (BST < 400 or first in chain):  >=2 STAB per type
  - mid  (mid in 3-stage chain):          >=3 STAB per type
  - final (no evolveTo):                  >=4 STAB per type
  - Forgotten / legendary (rarity flag):  >=4 STAB per type

Stage is inferred from evolveTo (null = final) and presence in another
Lumori's evolveTo (= not base).

Forgotten Lumori (id 462-500) are excluded — they'll be re-audited as
part of a dedicated Forgotten-typing overhaul.

Read-only — produces a report. Use for planning Phase 2 batches.
"""
import re
import json
from pathlib import Path
from collections import defaultdict

DATA_JS = Path(__file__).resolve().parent.parent / "js" / "data.js"
text = DATA_JS.read_text()

# Parse MOVES_DATA: key → type
mblock_start = text.find("const MOVES_DATA = {")
mblock_end_match = re.search(r'^\};', text[mblock_start:], re.MULTILINE)
mblock = text[mblock_start:mblock_start + mblock_end_match.start()]
mpat = re.compile(r'^\s*(\w+):\s*\{\s*name:"([^"]+)",\s*type:"(\w+)"', re.MULTILINE)
# Each move: key → set of types it counts as STAB for (primary + dualType if present)
move_types = {}
# Capture each full move declaration line to also detect dualType:["A","B"]
mfull_pat = re.compile(r'^\s*(\w+):\s*\{([^}]*)\}', re.MULTILINE)
for m in mfull_pat.finditer(mblock):
    key = m.group(1)
    body = m.group(2)
    type_m = re.search(r'type:"(\w+)"', body)
    if not type_m:
        continue
    types = {type_m.group(1)}
    dual_m = re.search(r'dualType:\[([^\]]+)\]', body)
    if dual_m:
        for t in re.findall(r'"(\w+)"', dual_m.group(1)):
            types.add(t)
    move_types[key] = types

# Parse MONSTERS_DATA
mons_start = text.find("const MONSTERS_DATA = {")
mons_text = text[mons_start:]

mons = {}
id_pat = re.compile(r'^\s*(\d+):\s*\{\s*id:(\d+),', re.MULTILINE)
id_positions = [(int(m.group(2)), m.start()) for m in id_pat.finditer(mons_text)]

evolveTo_pat = re.compile(r'evolveTo:\s*(\d+|null)')
types_pat = re.compile(r'types:\[([^\]]+)\]')
name_pat = re.compile(r'name:"([^"]+)"')
rarity_pat = re.compile(r'rarity:"(\w+)"')

for i, (mid, pos) in enumerate(id_positions):
    next_pos = id_positions[i+1][1] if i+1 < len(id_positions) else len(mons_text)
    block = mons_text[pos:next_pos]

    name_m = name_pat.search(block)
    types_m = types_pat.search(block)
    if not name_m or not types_m:
        continue
    types = [t.strip().strip('"') for t in types_m.group(1).split(",")]

    ev = evolveTo_pat.search(block)
    evolveTo = None if ev and ev.group(1) == "null" else (int(ev.group(1)) if ev else None)

    rar_m = rarity_pat.search(block)
    rarity = rar_m.group(1) if rar_m else None

    # Extract learnset move keys (balanced bracket parse)
    ls_match = re.search(r'learnset:\s*\[', block)
    move_keys = []
    if ls_match:
        start = ls_match.end()
        depth = 1
        j = start
        while j < len(block) and depth:
            if block[j] == '[':
                depth += 1
            elif block[j] == ']':
                depth -= 1
            j += 1
        learnset_str = block[start:j-1]
        move_keys = re.findall(r'"([a-z][a-z0-9_]*)"', learnset_str)

    mons[mid] = {
        "id": mid,
        "name": name_m.group(1),
        "types": types,
        "evolveTo": evolveTo,
        "rarity": rarity,
        "move_keys": move_keys,
    }

# Infer stage: base if NOT in any other's evolveTo, mid if not final & has evolveTo, final if evolveTo=None
evolves_into = {info["evolveTo"] for info in mons.values() if info["evolveTo"]}
for mid, info in mons.items():
    is_base = mid not in evolves_into
    is_final = info["evolveTo"] is None
    if is_base and is_final:
        info["stage"] = "standalone"
    elif is_base:
        info["stage"] = "base"
    elif is_final:
        info["stage"] = "final"
    else:
        info["stage"] = "mid"

# Per-type-per-Lumori STAB count (a dualType move counts for BOTH types)
for mid, info in mons.items():
    stab = defaultdict(int)
    for k in info["move_keys"]:
        m_types = move_types.get(k, set())
        for t in m_types:
            if t in info["types"]:
                stab[t] += 1
    info["stab"] = dict(stab)

# Threshold by mono-vs-dual and stage
def threshold(stage, rarity, is_mono):
    """Per-type minimum STAB."""
    base_map_mono = {"base": 5, "mid": 6, "final": 7, "standalone": 7}
    base_map_dual = {"base": 3, "mid": 4, "final": 4, "standalone": 4}
    table = base_map_mono if is_mono else base_map_dual
    val = table.get(stage, 4 if is_mono else 3)
    # Legendary/exclusive bump
    if rarity in ("legendary", "exclusive"):
        val = 8 if is_mono else 5
    return val

FORGOTTEN_START = 462

# Flag insufficient (excludes Forgotten — to be re-audited separately)
flagged = []
for mid, info in mons.items():
    if mid >= FORGOTTEN_START:
        continue
    is_mono = len(info["types"]) == 1
    threshold_per_type = threshold(info["stage"], info["rarity"], is_mono)
    for t in info["types"]:
        count = info["stab"].get(t, 0)
        if count < threshold_per_type:
            flagged.append({
                "id": mid,
                "name": info["name"],
                "types": info["types"],
                "stage": info["stage"],
                "rarity": info["rarity"],
                "type_short": t,
                "count": count,
                "threshold": threshold_per_type,
                "deficit": threshold_per_type - count,
            })

# Report
print(f"Total Lumori scanned: {len(mons)} (Forgotten 462-500 excluded)")
print(f"Flagged Lumori-type pairs with insufficient STAB: {len(flagged)}")
print()
print("Thresholds (per type):")
print("  Mono Lumori:  base=5, mid=6, final/standalone=7, legendary=8")
print("  Dual Lumori:  base=3, mid=4, final/standalone=4, legendary=5")
print("  dualType moves count for BOTH their types")
print()
print("=" * 90)
print(f"{'ID':>4}  {'Name':<24} {'Stage':<10} {'Type':<10} {'Have':>5} {'Need':>5} {'-':>3}")
print("=" * 90)
flagged.sort(key=lambda x: (-x["deficit"], x["id"]))
for f in flagged:
    print(f"  {f['id']:>3}  {f['name']:<24} {f['stage']:<10} {f['type_short']:<10} {f['count']:>5} {f['threshold']:>5} {f['deficit']:>3}")

# Per-type summary
print()
print("=" * 70)
print("PER-TYPE SUMMARY (deficit by type-flag)")
print("=" * 70)
by_type = defaultdict(int)
for f in flagged:
    by_type[f["type_short"]] += 1
for t, n in sorted(by_type.items(), key=lambda x: -x[1]):
    print(f"  {t:<12} {n:>4} flagged Lumori")
