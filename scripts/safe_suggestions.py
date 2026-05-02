#!/usr/bin/env python3
"""
Family-aware filter: a candidate prefix/suffix is SAFE iff for every length
L in 3..8, the count of distinct families using that substring is <= 1
(so adding our candidate, in a NEW family, makes <= 2).

If the candidate is joining an existing family that already uses the
substring, that family doesn't count twice — pass --family ID.

Usage:
  python3 scripts/safe_suggestions.py --prefix Magma Char ... --suffix flare drake ...
  python3 scripts/safe_suggestions.py --family 11 --prefix ... --suffix ...
"""
import re
import sys
from collections import defaultdict
from family_map import family_of, mons as fam_mons

DATA_JS = "/home/user/Lumoria/js/data.js"

with open(DATA_JS) as f:
    content = f.read()
mon_re = re.compile(r'^\s*\d+:\s*\{\s*id:(\d+),\s*name:"([^"]+)"', re.MULTILINE)
mons = {int(m.group(1)): m.group(2) for m in mon_re.finditer(content)}

def bare(n):
    return n[10:] if n.startswith("Forgotten ") else n

pfx_families = defaultdict(set)
sfx_families = defaultdict(set)
for mid, name in mons.items():
    bl = bare(name).lower()
    fam = family_of(mid)
    for L in range(3, 9):
        if len(bl) >= L:
            pfx_families[(L, bl[:L])].add(fam)
            sfx_families[(L, bl[-L:])].add(fam)

def safe_prefix(p, candidate_family=None):
    pl = p.lower()
    reasons = []
    for L in range(3, min(9, len(pl) + 1)):
        fams = pfx_families.get((L, pl[:L]), set())
        # If the candidate's family is already in fams, no addition.
        # Otherwise we'd add 1 family.
        if candidate_family is not None and candidate_family in fams:
            count = len(fams)
        else:
            count = len(fams) + 1
        if count > 2:
            reasons.append(f"'{pl[:L]}-' (len {L}) already in {len(fams)} families")
    return (len(reasons) == 0, reasons)

def safe_suffix(s, candidate_family=None):
    sl = s.lower()
    reasons = []
    for L in range(3, min(9, len(sl) + 1)):
        fams = sfx_families.get((L, sl[-L:]), set())
        if candidate_family is not None and candidate_family in fams:
            count = len(fams)
        else:
            count = len(fams) + 1
        if count > 2:
            reasons.append(f"'-{sl[-L:]}' (len {L}) already in {len(fams)} families")
    return (len(reasons) == 0, reasons)

def filter_list(candidates, kind, candidate_family=None):
    fn = safe_prefix if kind == "prefix" else safe_suffix
    safe, blocked = [], []
    for c in candidates:
        ok, reasons = fn(c, candidate_family=candidate_family)
        (safe if ok else blocked).append((c, reasons))
    return safe, blocked

if __name__ == "__main__":
    args = sys.argv[1:]
    mode = None
    candidate_family = None
    prefixes, suffixes = [], []
    i = 0
    while i < len(args):
        if args[i] == "--family":
            candidate_family = int(args[i + 1])
            i += 2
        elif args[i] == "--prefix":
            mode = "p"
            i += 1
        elif args[i] == "--suffix":
            mode = "s"
            i += 1
        elif mode == "p":
            prefixes.append(args[i]); i += 1
        elif mode == "s":
            suffixes.append(args[i]); i += 1
        else:
            i += 1

    if candidate_family is not None:
        print(f"(family-aware: candidate joins family@{candidate_family})\n")

    if prefixes:
        safe, blocked = filter_list(prefixes, "prefix", candidate_family)
        print(f"=== PREFIX SAFE ({len(safe)}/{len(prefixes)}) ===")
        for c, _ in safe:
            print(f"  {c}")
        if blocked:
            print(f"\n=== PREFIX BLOCKED ({len(blocked)}) ===")
            for c, reasons in blocked:
                print(f"  {c}: {'; '.join(reasons)}")

    if suffixes:
        safe, blocked = filter_list(suffixes, "suffix", candidate_family)
        print(f"\n=== SUFFIX SAFE ({len(safe)}/{len(suffixes)}) ===")
        for c, _ in safe:
            print(f"  {c}")
        if blocked:
            print(f"\n=== SUFFIX BLOCKED ({len(blocked)}) ===")
            for c, reasons in blocked:
                print(f"  {c}: {'; '.join(reasons)}")
