#!/usr/bin/env python3
"""
For each of the 54 approved-rename violations, classify the colliding mons:
  - INTRA: collides with another mon in the 54 -> must re-pick now
  - TRANSITIONAL: collides with a mon that's in the rename queue (i.e. will
    itself be renamed and almost certainly drop the shared prefix/suffix)
  - PERMANENT: collides with a mon that's canonical (not in queue) -> need
    alternative.

Queue = output of comprehensive_rename_list.py at strict cap-2.
"""
import re
from collections import defaultdict
from difflib import SequenceMatcher

DATA_JS = "/home/user/Lumoria/js/data.js"

APPROVED = {
    10:"Scorchlarva", 86:"Galvaglide", 92:"Arcspine", 100:"Craterlurk",
    103:"Calciderm", 108:"Silvergust", 118:"Eclipsehound", 119:"Dreadmaw",
    120:"Nightwolf", 121:"Spiraloom", 122:"Caveshroud", 125:"Venotitan",
    126:"Impefurr", 128:"Cranivade", 132:"Volcascale", 136:"Metalibat",
    137:"Goldefluff", 141:"Iridesoar", 147:"Scrapsapien", 148:"Stoicguard",
    149:"Eternarmor", 153:"Dentshaft", 154:"Terragolem", 158:"Corrodisc",
    159:"Dissotoad", 160:"Miasmafly", 165:"Venowarn", 166:"Projectery",
    167:"Cranidingo", 175:"Biolumal", 176:"Chromena", 177:"Sapphier",
    180:"Leapbun", 181:"Racehare", 185:"Hoverrow", 186:"Continemic",
    189:"Woolcalm", 191:"Pebblet", 192:"Boulderoll", 197:"Photoworm",
    200:"Iridibeetle", 202:"Sculptweave", 217:"Distorsion", 223:"Recallum",
    225:"Crealight", 229:"Radiafish", 240:"Tundrafox", 242:"Pulseglow",
    243:"Stuntrap", 255:"Psychotide", 256:"Scolphin", 262:"Transluceed",
    263:"Tendrilisk", 264:"Impenezard",
}

with open(DATA_JS) as f:
    content = f.read()
mon_re = re.compile(r'^\s*\d+:\s*\{\s*id:(\d+),\s*name:"([^"]+)"', re.MULTILINE)
current = {int(m.group(1)): m.group(2) for m in mon_re.finditer(content)}
proposed = {**current, **APPROVED}

def bare(n): return n[10:] if n.startswith("Forgotten ") else n

# Identify the queue (mons over-cap in CURRENT data.js, not just proposed)
def find_queue(name_dict):
    pfx, sfx = defaultdict(list), defaultdict(list)
    for mid, name in name_dict.items():
        bl = bare(name).lower()
        for L in range(3, 9):
            if len(bl) >= L:
                pfx[(L, bl[:L])].append(mid)
                sfx[(L, bl[-L:])].append(mid)
    flagged = set()
    for (L, sub), ids in pfx.items():
        if len(ids) > 2:
            flagged.update(sorted(ids)[2:])
    for (L, sub), ids in sfx.items():
        if len(ids) > 2:
            flagged.update(sorted(ids)[2:])
    return flagged

current_queue = find_queue(current)
print(f"Current queue size: {len(current_queue)}")

# Build proposed-state maps
proposed_pfx = defaultdict(list)
proposed_sfx = defaultdict(list)
for mid, name in proposed.items():
    bl = bare(name).lower()
    for L in range(3, 9):
        if len(bl) >= L:
            proposed_pfx[(L, bl[:L])].append(mid)
            proposed_sfx[(L, bl[-L:])].append(mid)

# For each approved rename, find violations in proposed state
def classify(other_id):
    if other_id in APPROVED:
        return "INTRA"
    if other_id in current_queue:
        return "TRANSITIONAL"
    return "PERMANENT"

print("\n" + "=" * 75)
print("VIOLATION CLASSIFICATION")
print("=" * 75)

intra_pairs = set()
permanent_violations = []
transitional_only = []

# Walk each approved id. For each substring length 3..8, check both prefix+suffix.
# Capture the SHORTEST length that triggers a violation (clearest reason).
seen_keys = set()
for mid in sorted(APPROVED):
    new_name = APPROVED[mid]
    bl = bare(new_name).lower()
    mon_violations = []
    for L in range(3, min(9, len(bl) + 1)):
        psub, ssub = bl[:L], bl[-L:]
        for kind, sub_map, sub in [("PREFIX", proposed_pfx, psub), ("SUFFIX", proposed_sfx, ssub)]:
            ids = sub_map.get((L, sub), [])
            if len(ids) > 2:
                key = (mid, kind)
                if key in seen_keys:
                    continue
                seen_keys.add(key)
                others = [i for i in sorted(ids) if i != mid]
                classes = {classify(i): [] for i in others}
                for i in others:
                    classes.setdefault(classify(i), []).append(i)
                mon_violations.append((kind, sub, L, others, classes))
                break  # shortest length only for this kind
    if mon_violations:
        print(f"\n#{mid:>4} '{new_name}':")
        worst = "TRANSITIONAL"
        for kind, sub, L, others, classes in mon_violations:
            marker_pre = "" if kind == "SUFFIX" else "-"
            marker_post = "-" if kind == "PREFIX" else ""
            print(f"  {kind} '{marker_post}{sub}{marker_pre}' (len {L}): {len(others)+1} mons -- ", end="")
            tags = []
            if "INTRA" in classes:
                ids = classes["INTRA"]
                tags.append(f"INTRA[{','.join(f'#{i}={proposed[i]}' for i in ids)}]")
                worst = "INTRA"
                for i in ids:
                    intra_pairs.add(tuple(sorted([mid, i])))
            if "PERMANENT" in classes:
                ids = classes["PERMANENT"]
                tags.append(f"PERMANENT[{','.join(f'#{i}={proposed[i]}' for i in ids)}]")
                if worst != "INTRA":
                    worst = "PERMANENT"
            if "TRANSITIONAL" in classes:
                ids = classes["TRANSITIONAL"]
                tags.append(f"TRANSITIONAL[{len(ids)} in queue]")
            print(" + ".join(tags))
        if worst == "PERMANENT":
            permanent_violations.append(mid)
        elif worst != "INTRA":
            transitional_only.append(mid)

# Now intra duplicates
intra_ids = set()
for a, b in intra_pairs:
    intra_ids.add(a)
    intra_ids.add(b)

print("\n" + "=" * 75)
print("SUMMARY")
print("=" * 75)
print(f"  INTRA-conflicts (54 collide w/ each other): {len(intra_ids)} ids")
for pair in sorted(intra_pairs):
    a, b = pair
    print(f"      #{a} {APPROVED[a]} <-> #{b} {APPROVED[b]}")
print(f"  PERMANENT-only conflicts: {len(permanent_violations)} ids -> {permanent_violations}")
print(f"  TRANSITIONAL-only conflicts (will self-resolve): {len(transitional_only)} ids")
print(f"  CLEAN (no violations): {len(APPROVED) - len(intra_ids) - len(permanent_violations) - len(transitional_only)}")
