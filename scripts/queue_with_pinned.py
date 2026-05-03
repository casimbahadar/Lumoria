#!/usr/bin/env python3
"""
Family-aware queue derivation. Treats a fixed set of ids as PINNED
(must keep their current names). Anything else over-cap on any 3..8 char
prefix/suffix (counted by distinct families) gets queued for rename.

For each over-cap group of size N families, drop the LOWEST-id NON-PINNED
mons last (keep them canonical when possible to minimize churn) and flag
the rest. Pinned mons are never flagged unless an entire over-cap group
is composed of pinned mons (in which case we report it as needing manual
resolution).
"""

import re
from collections import defaultdict
from difflib import SequenceMatcher
import sys
from family_map import family_of, families

DATA_JS = "/home/user/Lumoria/js/data.js"

PINNED_IDS = {
    3, 4, 5, 6, 9, 10, 17, 18, 22, 33, 39, 44, 47, 50, 86, 92, 100, 103, 108,
    118, 119, 120, 121, 122, 125, 126, 128, 132, 136, 137, 141, 147, 148,
    149, 153, 154, 158, 159, 160, 165, 166, 175, 176, 177, 180, 181, 185,
    186, 189, 191, 192, 197, 200, 202, 217, 223, 225, 229, 240, 242, 243,
    255, 256, 262, 263, 264,
}

with open(DATA_JS) as f:
    content = f.read()
mon_re = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)",.*?types:\[([^\]]+)\]',
    re.MULTILINE,
)
mons = {}
for m in mon_re.finditer(content):
    mid = int(m.group(2))
    mons[mid] = {
        "id": mid,
        "name": m.group(3),
        "types": [t.strip().strip('"') for t in m.group(4).split(",")],
    }
print(f"Parsed {len(mons)} mons.")

def bare(n): return n[10:] if n.startswith("Forgotten ") else n

# Family-aware prefix/suffix maps: (L, sub) -> {family_root_id -> [mids]}
pfx_fams = defaultdict(lambda: defaultdict(list))
sfx_fams = defaultdict(lambda: defaultdict(list))
for mid, mon in mons.items():
    bl = bare(mon["name"]).lower()
    fam = family_of(mid)
    for L in range(3, 9):
        if len(bl) >= L:
            pfx_fams[(L, bl[:L])][fam].append(mid)
            sfx_fams[(L, bl[-L:])][fam].append(mid)

flagged = defaultdict(list)
def mark(mid, reason):
    if reason not in flagged[mid]:
        flagged[mid].append(reason)

unresolvable = []

def process(prefix=True):
    src = pfx_fams if prefix else sfx_fams
    for (L, sub), fam_dict in list(src.items()):
        if L != 3:
            continue
        if len(fam_dict) <= 2:
            continue
        # Family-aware: too many distinct families share this substring
        family_list = sorted(fam_dict.keys())  # by root id
        # Count pinned vs non-pinned families
        # A family is "pinned" if AT LEAST ONE of its members at this substring
        # is pinned (we don't want to disturb pinned mons even if their family
        # has other members)
        pinned_families = []
        non_pinned_families = []
        for fam in family_list:
            mids = fam_dict[fam]
            has_pinned = any(m in PINNED_IDS for m in mids)
            (pinned_families if has_pinned else non_pinned_families).append(fam)
        # Keep up to 2 families canonical (prefer pinned, then lowest root id)
        keep_families = set(pinned_families[:2])
        slots = 2 - len(keep_families)
        if slots > 0:
            keep_families.update(non_pinned_families[:slots])
        # If too many pinned families, unresolvable
        if len(pinned_families) > 2:
            unresolvable.append({
                "kind": "PREFIX" if prefix else "SUFFIX",
                "sub": sub,
                "L": L,
                "pinned_families": [(f, [(m, mons[m]["name"]) for m in fam_dict[f]]) for f in pinned_families],
                "non_pinned_families": [(f, [(m, mons[m]["name"]) for m in fam_dict[f]]) for f in non_pinned_families],
            })
        # Flag all mons in non-keep families that aren't pinned
        for fam in family_list:
            if fam in keep_families:
                continue
            for m in fam_dict[fam]:
                if m in PINNED_IDS:
                    continue
                family_names = sorted({mons[mid_]["name"] for fam_inner in fam_dict for mid_ in fam_dict[fam_inner]})
                kind = "PREFIX" if prefix else "SUFFIX"
                mark(m, f"{kind} '{sub}' shared with {len(fam_dict)} families (cap 2): {family_names}")

process(prefix=True)
process(prefix=False)

# Exact duplicates
bare_to_ids = defaultdict(list)
for mid, mon in mons.items():
    bare_to_ids[bare(mon["name"]).lower()].append(mid)
for b, ids in bare_to_ids.items():
    if len(ids) > 1:
        # If all in same family, allow (e.g. shouldn't happen but just in case)
        fams = {family_of(i) for i in ids}
        if len(fams) > 1:
            sorted_ids = sorted(ids)
            for mid in sorted_ids[1:]:
                if mid not in PINNED_IDS:
                    mark(mid, f"EXACT DUPLICATE bare name '{b}' with {sorted_ids}")

# Near-duplicates
THRESHOLD = 0.88
all_ids = sorted(mons.keys())
for i in range(len(all_ids)):
    for j in range(i + 1, len(all_ids)):
        a, b_id = all_ids[i], all_ids[j]
        if family_of(a) == family_of(b_id):
            continue  # same family — similar names are fine
        ba = bare(mons[a]["name"]).lower()
        bb = bare(mons[b_id]["name"]).lower()
        if ba == bb:
            continue
        score = SequenceMatcher(None, ba, bb).ratio()
        if score >= THRESHOLD and b_id not in PINNED_IDS:
            mark(b_id, f"NEAR-DUPE of #{a} '{mons[a]['name']}' (sim {score:.3f})")

# Forgotten midfix conflicts (skip if midfix matches a same-family mon)
for fid in sorted(mons):
    if not mons[fid]["name"].startswith("Forgotten "):
        continue
    if fid in PINNED_IDS:
        continue
    bname = bare(mons[fid]["name"]).lower()
    if len(bname) < 3:
        continue
    midfix = bname[:3]
    matches = []
    for rid in mons:
        if rid == fid:
            continue
        if family_of(rid) == family_of(fid):
            continue  # same family - allowed
        rname_bare = bare(mons[rid]["name"]).lower()
        if rname_bare.startswith(midfix) and rname_bare != bname:
            matches.append(rid)
    if matches:
        names = [mons[r]["name"] for r in sorted(matches)]
        mark(fid, f"MIDFIX '{midfix}' (Forgotten) starts: {names}")

print(f"\n=== TOTAL TO RENAME (family-aware): {len(flagged)} ===\n")

if unresolvable:
    print(f"!! UNRESOLVABLE GROUPS (manual): {len(unresolvable)}")
    for u in unresolvable[:5]:
        print(f"  {u['kind']} '{u['sub']}': {len(u['pinned_families'])} pinned families")
    print()

if "--full" in sys.argv:
    print(f"{'#':>5}  {'NAME':<28}  {'TYPES':<22}  REASONS")
    print("-" * 110)
    for mid in sorted(flagged):
        mon = mons[mid]
        types_str = "/".join(mon["types"])
        reasons = " | ".join(flagged[mid])
        if len(reasons) > 200:
            reasons = reasons[:197] + "..."
        print(f"#{mid:>4}  {mon['name']:<28}  {types_str:<22}  {reasons}")
else:
    print(f"First 30 in queue (id-ascending):")
    print(f"{'#':>5}  {'NAME':<28}  {'TYPES':<22}  TOP REASON")
    print("-" * 100)
    for mid in sorted(flagged)[:30]:
        mon = mons[mid]
        types_str = "/".join(mon["types"])
        reason = flagged[mid][0]
        if len(reason) > 80:
            reason = reason[:77] + "..."
        print(f"#{mid:>4}  {mon['name']:<28}  {types_str:<22}  {reason}")
    print(f"\n...and {len(flagged) - 30} more. Run with --full to see all.")
