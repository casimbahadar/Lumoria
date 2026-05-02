#!/usr/bin/env python3
"""
Verify the 54 approved renames from reanalysis_post54.py against strict
cap-2 (every prefix/suffix substring of length 3..8 across all 446 bare
names), then apply them to js/data.js if all clean.

Forgotten prefix is exempt (midfix rule applies separately for those mons,
and none of these 54 are Forgotten).

Run with --dry-run to only verify, --apply to write data.js.
"""

import re
import sys
from collections import defaultdict

DATA_JS = "/home/user/Lumoria/js/data.js"

# 53 of the original 54 approved renames.
# #167 Cranidingo dropped — it formed a 3-way INTRA conflict at "Cra-" with
# #100 Craterlurk and #128 Cranivade (cap-2 forces dropping one). Cranidingo
# returns to the front of the rename queue for a fresh prefix pick.
APPROVED = {
    10:  "Scorchlarva",
    86:  "Galvaglide",
    92:  "Arcspine",
    100: "Craterlurk",
    103: "Calciderm",
    108: "Silvergust",
    118: "Eclipsehound",
    119: "Dreadmaw",
    120: "Nightwolf",
    121: "Spiraloom",
    122: "Caveshroud",
    125: "Venotitan",
    126: "Impefurr",
    128: "Cranivade",
    132: "Volcascale",
    136: "Metalibat",
    137: "Goldefluff",
    141: "Iridesoar",
    147: "Scrapsapien",
    148: "Stoicguard",
    149: "Eternarmor",
    153: "Dentshaft",
    154: "Terragolem",
    158: "Corrodisc",
    159: "Dissotoad",
    160: "Miasmafly",
    165: "Venowarn",
    166: "Projectery",
    175: "Biolumal",
    176: "Chromena",
    177: "Sapphier",
    180: "Leapbun",
    181: "Racehare",
    185: "Hoverrow",
    186: "Continemic",
    189: "Woolcalm",
    191: "Pebblet",
    192: "Boulderoll",
    197: "Photoworm",
    200: "Iridibeetle",
    202: "Sculptweave",
    217: "Distorsion",
    223: "Recallum",
    225: "Crealight",
    229: "Radiafish",
    240: "Tundrafox",
    242: "Pulseglow",
    243: "Stuntrap",
    255: "Psychotide",
    256: "Scolphin",
    262: "Transluceed",
    263: "Tendrilisk",
    264: "Impenezard",
}

# Read data.js
with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

mon_re = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)"',
    re.MULTILINE,
)
current_names = {}  # id -> current name in data.js
for m in mon_re.finditer(content):
    current_names[int(m.group(2))] = m.group(3)

# Build the proposed name set: replace approved ids, leave the rest
def bare(name):
    return name[len("Forgotten "):] if name.startswith("Forgotten ") else name

proposed = dict(current_names)
for mid, new_name in APPROVED.items():
    proposed[mid] = new_name

# Build prefix/suffix maps over PROPOSED state, count >2 = violation
def build_maps(name_dict):
    pfx = defaultdict(list)
    sfx = defaultdict(list)
    for mid, name in name_dict.items():
        bl = bare(name).lower()
        for L in range(3, 9):
            if len(bl) >= L:
                pfx[(L, bl[:L])].append(mid)
                sfx[(L, bl[-L:])].append(mid)
    return pfx, sfx

print("=" * 70)
print("VERIFYING 54 APPROVED RENAMES UNDER STRICT CAP-2 (lengths 3..8)")
print("=" * 70)

violations = []  # list of (mid, kind, sub, ids)
pfx, sfx = build_maps(proposed)

# Only flag NEW conflicts caused by the 54 renames
# (existing conflicts in current data.js aren't the 54's fault)
for mid in APPROVED:
    new_name = APPROVED[mid]
    bl = bare(new_name).lower()
    for L in range(3, min(9, len(bl) + 1)):
        psub = bl[:L]
        ssub = bl[-L:]
        # In proposed state, how many mons share this prefix?
        pshare = pfx.get((L, psub), [])
        sshare = sfx.get((L, ssub), [])
        if len(pshare) > 2:
            other_names = [proposed[i] for i in sorted(pshare)]
            violations.append((mid, new_name, "PREFIX", L, psub, other_names))
        if len(sshare) > 2:
            other_names = [proposed[i] for i in sorted(sshare)]
            violations.append((mid, new_name, "SUFFIX", L, ssub, other_names))

# Deduplicate violations (same id+kind+sub may appear at multiple lengths;
# show shortest length for clarity)
seen = set()
clean_violations = []
for v in violations:
    key = (v[0], v[2], v[5][0] if v[5] else "")  # mid + kind + first other
    short_key = (v[0], v[2])
    if short_key in seen:
        continue
    seen.add(short_key)
    clean_violations.append(v)

if clean_violations:
    print(f"\n[!] {len(clean_violations)} VIOLATION(S) - the 54 renames are not all safe:\n")
    for mid, name, kind, L, sub, others in clean_violations:
        marker = "-" if kind == "SUFFIX" else ""
        marker2 = "-" if kind == "PREFIX" else ""
        print(f"  #{mid} '{name}': {kind} '{marker}{sub}{marker2}' (len {L}) shared with {len(others)} mons:")
        for n in others:
            print(f"      {n}")
        print()
else:
    print("\n[OK] All 54 renames clear under strict cap-2 (prefix+suffix lengths 3..8).")

# Also report: what does the proposed-state queue look like for the rest?
print("=" * 70)
print("REMAINING-TO-RENAME COUNT after the 54 are applied (strict cap-2)")
print("=" * 70)
flagged_after = set()
for (L, sub), ids in pfx.items():
    if len(ids) > 2:
        flagged_after.update(sorted(ids)[2:])
for (L, sub), ids in sfx.items():
    if len(ids) > 2:
        flagged_after.update(sorted(ids)[2:])
# Subtract those already in APPROVED (they're "renamed", not in queue)
flagged_after -= set(APPROVED.keys())
print(f"  {len(flagged_after)} mons would still need renaming")

if "--apply" in sys.argv:
    if clean_violations and "--force" not in sys.argv:
        print("\n[ABORT] Refusing to apply with violations present. Pass --force to override.")
        sys.exit(1)
    elif clean_violations:
        print(f"\n[FORCE] Applying despite {len(clean_violations)} transitional violation(s).")
        print("       Queue derivation will surface remaining canonical-mon collisions.")
    print("\n--- APPLYING RENAMES TO data.js ---")
    new_content = content
    applied = 0
    for mid, new_name in sorted(APPROVED.items()):
        old = current_names[mid]
        # Match "ID: { id:ID, name:"OLD"" exactly
        pattern = re.compile(
            r'(' + str(mid) + r':\s*\{\s*id:' + str(mid) + r',\s*name:")' + re.escape(old) + r'(")'
        )
        m = pattern.search(new_content)
        if not m:
            print(f"  [!] could not find #{mid} '{old}' in data.js")
            continue
        new_content = pattern.sub(r'\g<1>' + new_name + r'\g<2>', new_content, count=1)
        applied += 1
        print(f"  #{mid:>4}: {old} -> {new_name}")
    with open(DATA_JS, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"\n  Wrote {applied} renames to {DATA_JS}")
elif not clean_violations:
    print("\nRun with --apply to write to data.js.")
