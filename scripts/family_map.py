#!/usr/bin/env python3
"""
Build the evolution-family map for all 446 mons.

A "family" is a weakly-connected component in the evolveTo graph.
Each mon belongs to exactly one family (its root id is the family id).

Cap-2 rule (family-aware): a prefix/suffix substring may be used by at
most 2 distinct families. Multiple mons within the SAME family sharing
the prefix/suffix count as 1 use.

Usage:
  from family_map import family_of, families
"""
import re
from collections import defaultdict

DATA_JS = "/home/user/Lumoria/js/data.js"

with open(DATA_JS) as f:
    content = f.read()

mon_re = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)",.*?evolveTo:\s*(\d+|null)',
    re.MULTILINE | re.DOTALL,
)
mons = {}
edges = {}  # mid -> evolveTo or None
for m in mon_re.finditer(content):
    mid = int(m.group(2))
    name = m.group(3)
    et = m.group(4)
    edges[mid] = int(et) if et != "null" else None
    mons[mid] = name

# Build pre-evo map (id -> ids that evolve into it)
pre = defaultdict(list)
for mid, target in edges.items():
    if target is not None:
        pre[target].append(mid)

# Find family root for each mon (walk back to id with no pre-evos)
def root_of(mid, visited=None):
    if visited is None:
        visited = set()
    if mid in visited:
        return mid  # cycle guard
    visited.add(mid)
    parents = pre.get(mid, [])
    if not parents:
        return mid
    return root_of(parents[0], visited)

family_id = {}  # mid -> root id
for mid in mons:
    family_id[mid] = root_of(mid)

# families: root_id -> set of mids
families = defaultdict(set)
for mid, root in family_id.items():
    families[root].add(mid)

def family_of(mid):
    """Return the family root id for a mon."""
    return family_id[mid]

if __name__ == "__main__":
    import sys
    if "--show-multi" in sys.argv:
        print(f"=== Multi-member families ({sum(1 for fam in families.values() if len(fam) > 1)}) ===")
        for root in sorted(families):
            members = sorted(families[root])
            if len(members) > 1:
                names = [f"#{m} {mons[m]}" for m in members]
                print(f"  family@{root}: {' -> '.join(names)}")
    else:
        print(f"Total families: {len(families)}")
        print(f"  Single-mon families: {sum(1 for f in families.values() if len(f) == 1)}")
        print(f"  2-mon families:      {sum(1 for f in families.values() if len(f) == 2)}")
        print(f"  3-mon families:      {sum(1 for f in families.values() if len(f) == 3)}")
        print(f"  4+-mon families:     {sum(1 for f in families.values() if len(f) >= 4)}")
