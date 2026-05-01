#!/usr/bin/env python3
"""Adjust legend BSTs and add ngPlusTier fields for Luminex ordering."""

import re

# BST targets per tier
# Trio (570-595): 379 Riftscale, 380 Tempestborn, 389 Stormcrown
# Pair (600-610): 392 Eondrake, 394 Solarvast
# Apex (640-670): 395 Glacierend, 398 Voidcrown, 400 Primordiax, 401 Cosmoveil

LEGEND_BST = {
    379: 580,   # Riftscale — trio
    380: 578,   # Tempestborn — trio
    389: 583,   # Stormcrown — trio
    392: 605,   # Eondrake — pair
    394: 608,   # Solarvast — pair
    395: 648,   # Glacierend — apex
    398: 652,   # Voidcrown — apex
    400: 660,   # Primordiax — apex
    401: 665,   # Cosmoveil — apex
}

# ngPlusTier: 0=regular, 1=pseudo, 2=legend minor, 3=legend mid, 4=legend apex
TIER_MAP = {
    # pseudo base/mid/final
    402:1, 403:1, 404:1, 405:1, 406:1, 407:1,
    # trio legends
    379:2, 380:2, 389:2,
    # pair legends
    392:3, 394:3,
    # apex legends
    395:4, 398:4, 400:4, 401:4,
}

STAT_RE = re.compile(
    r'(base:\{hp:)(\d+)(,atk:)(\d+)(,def:)(\d+)(,spa:)(\d+)(,spd:)(\d+)(,spe:)(\d+)(\})'
)

def scale_stats(hp, atk, df, spa, spd, spe, target):
    current = hp + atk + df + spa + spd + spe
    if current == 0: return hp, atk, df, spa, spd, spe
    ratio = target / current
    new = [round(s * ratio) for s in [hp, atk, df, spa, spd, spe]]
    diff = target - sum(new)
    if diff != 0:
        new[new.index(max(new))] += diff
    for i in range(6):
        if new[i] < 45:
            deficit = 45 - new[i]
            new[i] = 45
            rest = sorted([(new[j], j) for j in range(6) if j != i and new[j] > 45], reverse=True)
            if rest: new[rest[0][1]] -= deficit
    return tuple(new)

with open("js/data.js", "r") as f:
    text = f.read()

# 1. Adjust BSTs for designated legends
for mid, target in LEGEND_BST.items():
    start_marker = f'  {mid}: {{ id:{mid},'
    pos = text.find(start_marker)
    if pos == -1:
        print(f"WARNING: ID {mid} not found"); continue
    region = text[pos:pos+800]
    m = STAT_RE.search(region)
    if not m:
        print(f"WARNING: stats not found for {mid}"); continue
    vals = tuple(int(m.group(i)) for i in [2,4,6,8,10,12])
    old_bst = sum(vals)
    new_vals = scale_stats(*vals, target)
    new_bst = sum(new_vals)
    old_str = m.group(0)
    new_str = (f'base:{{hp:{new_vals[0]},atk:{new_vals[1]},def:{new_vals[2]},'
               f'spa:{new_vals[3]},spd:{new_vals[4]},spe:{new_vals[5]}}}')
    new_region = region.replace(old_str, new_str, 1)
    text = text[:pos] + new_region + text[pos+len(region):]
    print(f"ID {mid}: BST {old_bst} -> {new_bst} (target {target})")

# 2. Add ngPlusTier field after evolveTo/evolveLevel line for each tier mon
# Pattern: find "evolveTo:X, evolveLevel:X}," and add ngPlusTier after the base stats closing
EVOLVE_NULLNULL_RE = re.compile(r'evolveTo:null, evolveLevel:null,')
EVOLVE_RE = re.compile(r'(evolveTo:[^,]+, evolveLevel:[^,]+,)')

for mid, tier in TIER_MAP.items():
    start_marker = f'  {mid}: {{ id:{mid},'
    pos = text.find(start_marker)
    if pos == -1:
        print(f"WARNING: ID {mid} not found for tier"); continue
    region_end = pos + 1200
    region = text[pos:region_end]
    # Add ngPlusTier after evolveTo/evolveLevel
    if 'ngPlusTier:' in region:
        print(f"ID {mid}: ngPlusTier already set")
        continue
    m = EVOLVE_RE.search(region)
    if m:
        old = m.group(0)
        new = old + f' ngPlusTier:{tier},'
        new_region = region.replace(old, new, 1)
        text = text[:pos] + new_region + text[pos+len(region):]
        print(f"ID {mid}: set ngPlusTier={tier}")
    else:
        print(f"WARNING: evolveTo not found for ID {mid}")

with open("js/data.js", "w") as f:
    f.write(text)
print("\nDone.")
