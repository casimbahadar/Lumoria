#!/usr/bin/env python3
"""
Family-aware comprehensive prefix/suffix collision analyzer.

Cap-2 rule: each prefix/suffix substring of length 3..8 may appear in at
most 2 distinct evolution families. Multiple mons within the SAME family
sharing the same prefix/suffix count as 1 use (e.g. Roselia + Roserade
in Pokemon would count as 1 "Rose-" family use, not 2).

Usage:
  python3 scripts/full_collision_check.py             # show all over-cap groups
  python3 scripts/full_collision_check.py NAME [...]  # check candidate name(s)
  python3 scripts/full_collision_check.py NAME --family ID  # treat NAME as if
      it joined the family with root id ID (for family-internal new evos)
"""

import re
import sys
from collections import defaultdict
from family_map import family_of, families, mons as fam_mons

DATA_JS = "/home/user/Lumoria/js/data.js"

with open(DATA_JS) as f:
    content = f.read()
mon_re = re.compile(r'^\s*\d+:\s*\{\s*id:(\d+),\s*name:"([^"]+)"', re.MULTILINE)
mons = {int(m.group(1)): m.group(2) for m in mon_re.finditer(content)}

def bare(n):
    return n[10:] if n.startswith("Forgotten ") else n

# Pre-build prefix/suffix -> family-set maps for lengths 3..8
pfx_families = defaultdict(set)  # (length, substring) -> {family_root_ids}
sfx_families = defaultdict(set)
pfx_mons = defaultdict(list)  # for displaying which mons are in each group
sfx_mons = defaultdict(list)
for mid, name in mons.items():
    bl = bare(name).lower()
    fam = family_of(mid)
    for L in range(3, 9):
        if len(bl) >= L:
            pfx_families[(L, bl[:L])].add(fam)
            sfx_families[(L, bl[-L:])].add(fam)
            pfx_mons[(L, bl[:L])].append((mid, name))
            sfx_mons[(L, bl[-L:])].append((mid, name))

def show_overcap():
    """Print all prefix/suffix groups where >2 distinct families share."""
    print("=== OVER-CAP PREFIX GROUPS (>2 distinct families share start) ===")
    rows = []
    for (L, sub), fams in pfx_families.items():
        if len(fams) >= 3:
            rows.append((L, sub, fams, pfx_mons[(L, sub)]))
    rows.sort(key=lambda r: (-len(r[2]), -r[0], r[1]))
    seen = set()
    for L, sub, fams, mlist in rows:
        key = (frozenset(fams),)
        if key in seen:
            continue
        seen.add(key)
        names = sorted({n for _, n in mlist})
        print(f"  '{sub}-' (len {L}): {len(fams)} families - {names}")

    print("\n=== OVER-CAP SUFFIX GROUPS (>2 distinct families share end) ===")
    rows = []
    for (L, sub), fams in sfx_families.items():
        if len(fams) >= 3:
            rows.append((L, sub, fams, sfx_mons[(L, sub)]))
    rows.sort(key=lambda r: (-len(r[2]), -r[0], r[1]))
    seen = set()
    for L, sub, fams, mlist in rows:
        key = (frozenset(fams),)
        if key in seen:
            continue
        seen.add(key)
        names = sorted({n for _, n in mlist})
        print(f"  '-{sub}' (len {L}): {len(fams)} families - {names}")

def check_candidate(cand, candidate_family=None):
    """
    Check whether the candidate name violates cap-2 by family.
    candidate_family: if provided, the family id this name will belong to
      (so it doesn't count itself if its family already shares the substring).
      If None, treats it as a new standalone family.
    """
    cl = cand.lower()
    print(f"\n--- Candidate: {cand}" + (f" (family@{candidate_family})" if candidate_family else "") + " ---")
    issues = []
    for L in range(3, min(9, len(cl) + 1)):
        psub = cl[:L]
        ssub = cl[-L:]
        # Existing families with this prefix/suffix
        pf = pfx_families.get((L, psub), set())
        sf = sfx_families.get((L, ssub), set())
        # Add candidate's family (or a sentinel "new")
        new_fam = candidate_family if candidate_family is not None else "<new>"
        new_pf = pf | {new_fam}
        new_sf = sf | {new_fam}
        if len(new_pf) > 2:
            other_names = sorted({n for _, n in pfx_mons.get((L, psub), [])})
            issues.append(f"  PREFIX '{psub}-' (len {L}): would be {len(new_pf)} families ({other_names} + {cand})")
        if len(new_sf) > 2:
            other_names = sorted({n for _, n in sfx_mons.get((L, ssub), [])})
            issues.append(f"  SUFFIX '-{ssub}' (len {L}): would be {len(new_sf)} families ({other_names} + {cand})")
    if issues:
        print("BLOCKED:")
        for i in issues:
            print(i)
    else:
        print("OK - no cap-2 family violations at any prefix/suffix length 3..8")

if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        show_overcap()
    else:
        # Parse: NAME [NAME ...] [--family ID]
        candidate_family = None
        names = []
        i = 0
        while i < len(args):
            if args[i] == "--family":
                candidate_family = int(args[i + 1])
                i += 2
            else:
                names.append(args[i])
                i += 1
        for n in names:
            check_candidate(n, candidate_family=candidate_family)
