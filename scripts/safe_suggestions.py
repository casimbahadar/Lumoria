#!/usr/bin/env python3
"""
Filter a list of candidate prefixes/suffixes to those that are SAFE under
strict cap-2 against current data.js.

A prefix P is safe iff for every length L in 3..min(8, len(P)),
the count of existing bare names starting with P[:L].lower() is <= 1.
Same logic for suffixes (using last-L-chars).

Usage:
  python3 scripts/safe_suggestions.py --prefix Magma Char Brand Sear ...
  python3 scripts/safe_suggestions.py --suffix flare drake wyrm coil ...
  python3 scripts/safe_suggestions.py --prefix A B C --suffix x y z
"""
import re
import sys
from collections import defaultdict

DATA_JS = "/home/user/Lumoria/js/data.js"

with open(DATA_JS) as f:
    content = f.read()
mon_re = re.compile(r'^\s*\d+:\s*\{\s*id:(\d+),\s*name:"([^"]+)"', re.MULTILINE)
mons = {int(m.group(1)): m.group(2) for m in mon_re.finditer(content)}

def bare(n):
    return n[10:] if n.startswith("Forgotten ") else n

# Pre-build prefix/suffix counters for lengths 3..8
pfx_count = defaultdict(int)  # (length, substring.lower()) -> count
sfx_count = defaultdict(int)
for name in mons.values():
    bl = bare(name).lower()
    for L in range(3, 9):
        if len(bl) >= L:
            pfx_count[(L, bl[:L])] += 1
            sfx_count[(L, bl[-L:])] += 1

def safe_prefix(p, verbose=False):
    """Return (ok, reasons). ok=True if every 3..len(p) char prefix has <=1 existing mon."""
    pl = p.lower()
    reasons = []
    for L in range(3, min(9, len(pl) + 1)):
        c = pfx_count.get((L, pl[:L]), 0)
        if c >= 2:
            reasons.append(f"'{pl[:L]}-' (len {L}) already at {c} mons")
    return (len(reasons) == 0, reasons)

def safe_suffix(s, verbose=False):
    sl = s.lower()
    reasons = []
    for L in range(3, min(9, len(sl) + 1)):
        c = sfx_count.get((L, sl[-L:]), 0)
        if c >= 2:
            reasons.append(f"'-{sl[-L:]}' (len {L}) already at {c} mons")
    return (len(reasons) == 0, reasons)

def filter_list(candidates, kind):
    fn = safe_prefix if kind == "prefix" else safe_suffix
    safe, blocked = [], []
    for c in candidates:
        ok, reasons = fn(c)
        (safe if ok else blocked).append((c, reasons))
    return safe, blocked

if __name__ == "__main__":
    args = sys.argv[1:]
    mode = None
    prefixes, suffixes = [], []
    for a in args:
        if a == "--prefix":
            mode = "p"
        elif a == "--suffix":
            mode = "s"
        elif mode == "p":
            prefixes.append(a)
        elif mode == "s":
            suffixes.append(a)

    if prefixes:
        safe, blocked = filter_list(prefixes, "prefix")
        print(f"=== PREFIX SAFE ({len(safe)}/{len(prefixes)}) ===")
        for c, _ in safe:
            print(f"  {c}")
        if blocked:
            print(f"\n=== PREFIX BLOCKED ({len(blocked)}) ===")
            for c, reasons in blocked:
                print(f"  {c}: {'; '.join(reasons)}")

    if suffixes:
        safe, blocked = filter_list(suffixes, "suffix")
        print(f"\n=== SUFFIX SAFE ({len(safe)}/{len(suffixes)}) ===")
        for c, _ in safe:
            print(f"  {c}")
        if blocked:
            print(f"\n=== SUFFIX BLOCKED ({len(blocked)}) ===")
            for c, reasons in blocked:
                print(f"  {c}: {'; '.join(reasons)}")
