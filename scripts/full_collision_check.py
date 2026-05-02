#!/usr/bin/env python3
"""
Comprehensive prefix/suffix collision analyzer for all 446 Lumori names.
For every shared prefix substring of length 3..8, count how many mons share it.
Same for suffix. Flag any group with count >= 3 (over cap of 2).

Usage:
  python3 scripts/full_collision_check.py             # show all over-cap groups
  python3 scripts/full_collision_check.py NAME [NAME...]  # check candidate names against current dataset
"""

import re
import sys
from collections import defaultdict

DATA_JS = "/home/user/Lumoria/js/data.js"

# Approved renames already discussed but not yet written to data.js
# (these REPLACE the current name in data.js for analysis purposes).
# Keep empty when checking candidates against the actual on-disk state.
APPROVED_PENDING = {}

with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

mon_re = re.compile(r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)"', re.MULTILINE)
mons = {}
for m in mon_re.finditer(content):
    mid = int(m.group(2))
    mons[mid] = APPROVED_PENDING.get(mid, m.group(3))

def bare(name):
    return name[len("Forgotten "):] if name.startswith("Forgotten ") else name

# Build prefix/suffix maps for lengths 3..8
def build_maps():
    pfx_map = defaultdict(list)  # (length, substring) -> [ids]
    sfx_map = defaultdict(list)
    for mid, name in mons.items():
        b = bare(name)
        bl = b.lower()
        for L in range(3, 9):
            if len(bl) >= L:
                pfx_map[(L, bl[:L])].append(mid)
                sfx_map[(L, bl[-L:])].append(mid)
    return pfx_map, sfx_map

pfx_map, sfx_map = build_maps()

def show_overcap():
    """Print all prefix/suffix groups at count >= 3."""
    print(f"=== OVER-CAP PREFIX GROUPS (>=3 mons share start, length 3..8) ===")
    seen = set()
    # Show longest matches per id-set first to deduplicate
    rows = []
    for (L, sub), ids in pfx_map.items():
        if len(ids) >= 3:
            rows.append((L, sub, ids))
    rows.sort(key=lambda r: (-r[0], -len(r[2]), r[1]))
    # Deduplicate: if a longer prefix already covers same id-set, skip the shorter
    covered_by_longer = set()
    for L, sub, ids in rows:
        key = tuple(sorted(ids))
        # Keep longest distinct version
        if key in covered_by_longer:
            continue
        covered_by_longer.add(key)
        names = [mons[i] for i in ids]
        print(f"  '{sub}-' (len {L}): {len(ids)} mons -> {names}")

    print(f"\n=== OVER-CAP SUFFIX GROUPS (>=3 mons share end, length 3..8) ===")
    rows = []
    for (L, sub), ids in sfx_map.items():
        if len(ids) >= 3:
            rows.append((L, sub, ids))
    rows.sort(key=lambda r: (-r[0], -len(r[2]), r[1]))
    covered_by_longer = set()
    for L, sub, ids in rows:
        key = tuple(sorted(ids))
        if key in covered_by_longer:
            continue
        covered_by_longer.add(key)
        names = [mons[i] for i in ids]
        print(f"  '-{sub}' (len {L}): {len(ids)} mons -> {names}")

def check_candidate(cand):
    """Check whether adding `cand` to the dataset would violate cap=2 for any prefix/suffix length 3..8."""
    cl = cand.lower()
    print(f"\n--- Candidate: {cand} ---")
    issues = []
    for L in range(3, min(9, len(cl) + 1)):
        psub = cl[:L]
        ssub = cl[-L:]
        # Existing share count (excluding nothing, since cand is new)
        pshare = pfx_map.get((L, psub), [])
        sshare = sfx_map.get((L, ssub), [])
        # Adding cand makes len(pshare)+1 (if not already in mons by id)
        new_p = len(pshare) + 1
        new_s = len(sshare) + 1
        if new_p > 2:
            existing = [mons[i] for i in pshare]
            issues.append(f"  PREFIX '{psub}-' (len {L}): would be {new_p} ({existing} + {cand})")
        if new_s > 2:
            existing = [mons[i] for i in sshare]
            issues.append(f"  SUFFIX '-{ssub}' (len {L}): would be {new_s} ({existing} + {cand})")
    if issues:
        print("BLOCKED:")
        for i in issues:
            print(i)
    else:
        print("OK - no cap-2 violations at any prefix/suffix length 3..8")

if __name__ == "__main__":
    if len(sys.argv) == 1:
        show_overcap()
    else:
        for cand in sys.argv[1:]:
            check_candidate(cand)
