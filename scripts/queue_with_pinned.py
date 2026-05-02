#!/usr/bin/env python3
"""
Re-derive the rename queue from current data.js, treating a fixed set of
ids as PINNED (must keep their current names). Anything else over-cap on
any 3..8 char prefix/suffix gets queued for rename.

For each over-cap group, drop the LOWEST-id NON-PINNED mons last (keep them
canonical when possible to minimize churn) and flag the rest. Pinned mons
are never flagged unless an entire over-cap group is composed of pinned
mons (in which case we report it as needing manual resolution).

Pinned set: the 53 ids just applied + #167 Cranidingo (still pending re-pick,
keep its current name as a placeholder).
"""

import re
from collections import defaultdict
from difflib import SequenceMatcher
import sys

DATA_JS = "/home/user/Lumoria/js/data.js"

# 53 ids whose new names were just applied (must stay as-is) + #167 (pending re-pick)
PINNED_IDS = {
    10, 86, 92, 100, 103, 108, 118, 119, 120, 121, 122, 125, 126, 128,
    132, 136, 137, 141, 147, 148, 149, 153, 154, 158, 159, 160, 165,
    166, 175, 176, 177, 180, 181, 185, 186, 189, 191, 192, 197, 200,
    202, 217, 223, 225, 229, 240, 242, 243, 255, 256, 262, 263, 264,
    167,  # pending re-pick — but its CURRENT name "Cranidingo" stays for now
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

# Wait -- #167 Cranidingo is in PINNED_IDS but its current data.js name is
# still "Mentovast"... no wait, let me check actual current name
# Actually it's "Vexakin" or similar. We need to PIN by keeping CURRENT name
# even if it's still over-cap. So #167 will simply be flagged in queue.
# Remove from PINNED to allow it to be flagged.
PINNED_IDS.discard(167)

# Build prefix/suffix maps
pfx, sfx = defaultdict(list), defaultdict(list)
for mid, mon in mons.items():
    bl = bare(mon["name"]).lower()
    for L in range(3, 9):
        if len(bl) >= L:
            pfx[(L, bl[:L])].append(mid)
            sfx[(L, bl[-L:])].append(mid)

flagged = defaultdict(list)
def mark(mid, reason):
    if reason not in flagged[mid]:
        flagged[mid].append(reason)

unresolvable = []  # groups composed entirely of PINNED ids that exceed cap

def process(prefix=True):
    src = pfx if prefix else sfx
    for (L, sub), ids in list(src.items()):
        if L != 3:
            continue
        if len(ids) <= 2:
            continue
        # Separate into pinned vs non-pinned
        pinned_in_group = [i for i in ids if i in PINNED_IDS]
        non_pinned = [i for i in ids if i not in PINNED_IDS]
        # If pinned alone exceed cap, that's unresolvable -- need manual pick
        if len(pinned_in_group) > 2:
            unresolvable.append({
                "kind": "PREFIX" if prefix else "SUFFIX",
                "sub": sub,
                "L": L,
                "pinned": [(i, mons[i]["name"]) for i in sorted(pinned_in_group)],
                "non_pinned": [(i, mons[i]["name"]) for i in sorted(non_pinned)],
            })
            # Flag all non-pinned anyway, plus excess pinned
            for i in non_pinned:
                names = [mons[x]["name"] for x in sorted(ids)]
                kind = "PREFIX" if prefix else "SUFFIX"
                marker = "-" if prefix else ""
                marker2 = "" if prefix else "-"
                mark(i, f"{kind} '{marker2}{sub}{marker}' shared with {len(ids)} mons (cap 2): {names}")
            continue
        # Keep pinned (up to 2) and lowest-id non-pinned to fill remaining slots
        keep = set(pinned_in_group[:2])
        slots_left = 2 - len(keep)
        if slots_left > 0:
            keep.update(sorted(non_pinned)[:slots_left])
        # Flag everyone not kept
        for i in ids:
            if i not in keep and i not in PINNED_IDS:
                names = [mons[x]["name"] for x in sorted(ids)]
                kind = "PREFIX" if prefix else "SUFFIX"
                marker = "-" if prefix else ""
                marker2 = "" if prefix else "-"
                mark(i, f"{kind} '{marker2}{sub}{marker}' shared with {len(ids)} mons (cap 2): {names}")

process(prefix=True)
process(prefix=False)

# Exact duplicates (excluding pinned)
bare_to_ids = defaultdict(list)
for mid, mon in mons.items():
    bare_to_ids[bare(mon["name"]).lower()].append(mid)
for b, ids in bare_to_ids.items():
    if len(ids) > 1:
        sorted_ids = sorted(ids)
        for mid in sorted_ids[1:]:
            if mid not in PINNED_IDS:
                mark(mid, f"EXACT DUPLICATE bare name '{b}' shared with {sorted_ids}")

# Near-duplicates (excluding pinned)
THRESHOLD = 0.88
all_ids = sorted(mons.keys())
for i in range(len(all_ids)):
    for j in range(i + 1, len(all_ids)):
        a, b_id = all_ids[i], all_ids[j]
        ba = bare(mons[a]["name"]).lower()
        bb = bare(mons[b_id]["name"]).lower()
        if ba == bb:
            continue
        score = SequenceMatcher(None, ba, bb).ratio()
        if score >= THRESHOLD and b_id not in PINNED_IDS:
            mark(b_id, f"NEAR-DUPE of #{a} '{mons[a]['name']}' (sim {score:.3f})")

# Forgotten midfix conflicts
for fid in sorted(mons):
    if not mons[fid]["name"].startswith("Forgotten "):
        continue
    if fid in PINNED_IDS:
        continue
    bname = bare(mons[fid]["name"]).lower()
    if len(bname) < 3:
        continue
    midfix = bname[:3]
    matches = [rid for rid in mons
               if rid != fid
               and bare(mons[rid]["name"]).lower().startswith(midfix)
               and bare(mons[rid]["name"]).lower() != bname]
    if matches:
        names = [mons[r]["name"] for r in sorted(matches)]
        mark(fid, f"MIDFIX '{midfix}' (Forgotten) starts of: {names}")

# Output
print(f"\n=== TOTAL TO RENAME: {len(flagged)} ===\n")

if unresolvable:
    print(f"!! UNRESOLVABLE GROUPS (all pinned, manual resolution needed): {len(unresolvable)}")
    for u in unresolvable:
        print(f"  {u['kind']} '{u['sub']}' (len {u['L']}): pinned={u['pinned']}, non_pinned={u['non_pinned']}")
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
    # Show just first 30 + summary
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
