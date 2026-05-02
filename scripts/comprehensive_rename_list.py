#!/usr/bin/env python3
"""
Comprehensive rename-candidate derivation.

Rules:
  1. CAP=2: no more than 2 mons may share any prefix substring of length 3..8
     (measured on bare name; Forgotten prefix stripped).
  2. CAP=2: no more than 2 mons may share any suffix substring of length 3..8.
  3. Forgotten exception: the literal "Forgotten " prefix is allowed for any
     number of mons (~39 expected). Forgotten mons are subject to midfix rule
     instead — the bare name's 3-char start must not match the start of any
     OTHER mon's bare name.
  4. Exact duplicate names (case-insensitive bare match) — both flagged, lower
     id kept canonical.
  5. Near-duplicate (similarity >= 0.88) — higher id flagged.

For each over-cap group of size N, mark mons (N - 2) for rename, keeping
the 2 lowest ids as canonical.

Output: id-ascending list of mons to rename with reasons.
"""

import re
from collections import defaultdict
from difflib import SequenceMatcher

DATA_JS = "/home/user/Lumoria/js/data.js"

with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

mon_re = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)",.*?types:\[([^\]]+)\]',
    re.MULTILINE,
)
mons = {}
for m in mon_re.finditer(content):
    mid = int(m.group(2))
    name = m.group(3)
    types = [t.strip().strip('"') for t in m.group(4).split(",")]
    mons[mid] = {"id": mid, "name": name, "types": types}

print(f"Parsed {len(mons)} mons from data.js\n")

def bare(name):
    return name[len("Forgotten "):] if name.startswith("Forgotten ") else name

def is_forgotten(mid):
    return mons[mid]["name"].startswith("Forgotten ")

# Build prefix/suffix maps for lengths 3..8 over BARE names
pfx_map = defaultdict(list)
sfx_map = defaultdict(list)
for mid, mon in mons.items():
    bl = bare(mon["name"]).lower()
    for L in range(3, 9):
        if len(bl) >= L:
            pfx_map[(L, bl[:L])].append(mid)
            sfx_map[(L, bl[-L:])].append(mid)

rename_reasons = defaultdict(list)

def mark(mid, reason):
    if reason not in rename_reasons[mid]:
        rename_reasons[mid].append(reason)

# Rule 1+2: cap=2 on every prefix/suffix length 3..8
# Strategy: identify the deepest distinct group at each length, mark excess.
# Use length 3 as the base, since longer matches are subsets.
# But for clearest reasons, prefer shortest prefix that exposes the conflict.

# For prefix conflicts: walk lengths from 3 up. If at len 3 a group has >=3 mons,
# mark all but the 2 lowest ids with that 3-char reason. Don't double-count the
# same group at len 4 (it'd give the same id-set or a subset).
# Process at length 3 first; longer lengths only catch NEW conflicts not visible
# at length 3 (which can't happen if cap=2 at len 3 already enforces).

# Actually each len-3 group is the parent of all longer ones. If len-3 has <=2
# mons, all longer subsets also have <=2. So we only need to enforce at len 3.

# But that can be over-aggressive: e.g., "Lum-" len 3 has many mons that don't
# all share "Luma-" len 4. We'd flag too many at len 3.

# The user's wish: "no more than 2 share any single prefix or suffix". So a len-3
# share with 3+ mons IS a violation, regardless of whether they share more.
# Therefore enforcing at len 3 is correct.

def process_overcap(prefix=True):
    label = "PREFIX" if prefix else "SUFFIX"
    src_map = pfx_map if prefix else sfx_map
    # Iterate over length-3 keys
    for (L, sub), ids in list(src_map.items()):
        if L != 3:
            continue
        if len(ids) <= 2:
            continue
        # Sort ids; keep lowest 2 as canonical, mark rest for rename
        sorted_ids = sorted(ids)
        keep = set(sorted_ids[:2])
        for mid in sorted_ids:
            if mid not in keep:
                # Build reason naming the longest shared substring with the
                # canonical pair (helps user see what they're really conflicting on)
                bl = bare(mons[mid]["name"]).lower()
                # find longest len where mid still in same group as keep[0]
                key_id = sorted_ids[0]
                key_bl = bare(mons[key_id]["name"]).lower()
                lcp = 0
                for i in range(min(len(bl), len(key_bl), 8)):
                    if (bl[i] if prefix else bl[-(i+1)]) == (key_bl[i] if prefix else key_bl[-(i+1)]):
                        lcp = i + 1
                    else:
                        break
                if prefix:
                    shared = bl[:max(3, lcp)]
                    reason = f"{label} '{shared}-' shared with {len(ids)} mons (cap 2): {[mons[i]['name'] for i in sorted_ids]}"
                else:
                    shared = bl[-max(3, lcp):]
                    reason = f"{label} '-{shared}' shared with {len(ids)} mons (cap 2): {[mons[i]['name'] for i in sorted_ids]}"
                mark(mid, reason)

process_overcap(prefix=True)
process_overcap(prefix=False)

# Rule 4: exact duplicates (bare names, case-insensitive)
bare_to_ids = defaultdict(list)
for mid, mon in mons.items():
    bare_to_ids[bare(mon["name"]).lower()].append(mid)
for b, ids in bare_to_ids.items():
    if len(ids) > 1:
        sorted_ids = sorted(ids)
        for mid in sorted_ids[1:]:  # keep lowest id, rename rest
            mark(mid, f"EXACT DUPLICATE bare name '{b}' shared with id(s) {sorted_ids[:1] + [i for i in sorted_ids if i != mid and i != sorted_ids[0]]}")

# Rule 5: near-duplicates (>=0.88 similarity, bare)
THRESHOLD = 0.88
all_ids = sorted(mons.keys())
for i in range(len(all_ids)):
    for j in range(i + 1, len(all_ids)):
        a, b = all_ids[i], all_ids[j]
        ba = bare(mons[a]["name"]).lower()
        bb = bare(mons[b]["name"]).lower()
        if ba == bb:
            continue
        score = SequenceMatcher(None, ba, bb).ratio()
        if score >= THRESHOLD:
            mark(b, f"NEAR-DUPE of #{a} '{mons[a]['name']}' (sim {score:.3f})")

# Rule 3: Forgotten midfix conflicts
# For each Forgotten mon, the bare name's 3+ char start must not match the start
# of any OTHER mon (regular OR Forgotten) at length 3.
REGULAR_IDS = {mid for mid in mons if not is_forgotten(mid)}
for fid in sorted(mons):
    if not is_forgotten(fid):
        continue
    fname = mons[fid]["name"]
    bname = bare(fname).lower()
    if len(bname) < 3:
        continue
    midfix3 = bname[:3]
    matches = [rid for rid in mons
               if rid != fid
               and bare(mons[rid]["name"]).lower().startswith(midfix3)
               and bare(mons[rid]["name"]).lower() != bname]
    if matches:
        names = [mons[rid]["name"] for rid in sorted(matches)]
        mark(fid, f"MIDFIX '{midfix3}' (from '{fname}') matches start of: {names}")

# OUTPUT
print(f"=== TOTAL TO RENAME: {len(rename_reasons)} mons ===\n")

# Bucket counts
def bucket(mid):
    rs = rename_reasons[mid]
    has_pfx = any("PREFIX " in r for r in rs)
    has_sfx = any("SUFFIX " in r for r in rs)
    has_dup = any("EXACT DUPLICATE" in r for r in rs)
    has_near = any("NEAR-DUPE" in r for r in rs)
    has_mid = any("MIDFIX" in r for r in rs)
    return has_pfx, has_sfx, has_dup, has_near, has_mid

pfx_count = sum(1 for m in rename_reasons if bucket(m)[0])
sfx_count = sum(1 for m in rename_reasons if bucket(m)[1])
dup_count = sum(1 for m in rename_reasons if bucket(m)[2])
near_count = sum(1 for m in rename_reasons if bucket(m)[3])
mid_count = sum(1 for m in rename_reasons if bucket(m)[4])

print(f"  PREFIX over-cap:     {pfx_count}")
print(f"  SUFFIX over-cap:     {sfx_count}")
print(f"  EXACT duplicates:    {dup_count}")
print(f"  NEAR-dupes (>=0.88): {near_count}")
print(f"  MIDFIX (Forgotten):  {mid_count}")
print(f"  (categories overlap; union = {len(rename_reasons)})\n")

print(f"=== CANDIDATES (id-ascending) ===")
print(f"{'#':>5}  {'NAME':<28}  {'TYPES':<22}  REASONS")
print("-" * 110)
for mid in sorted(rename_reasons):
    mon = mons[mid]
    types_str = "/".join(mon["types"])
    reasons = " | ".join(rename_reasons[mid])
    # Truncate long reasons for readability
    if len(reasons) > 200:
        reasons = reasons[:197] + "..."
    print(f"#{mid:>4}  {mon['name']:<28}  {types_str:<22}  {reasons}")
