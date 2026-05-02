#!/usr/bin/env python3
"""
Full rename candidate analysis for Lumoria.
Finds:
  A. Exact duplicate names
  B. Near-duplicate names (similarity >= 0.88, ignoring "Forgotten " prefix)
  C. Overused suffix/prefix groups (cap 5, per Option C)
  D. Forgotten midfix conflicts (midfix of Forgotten mon matches prefix of regular mon)

Outputs a deduplicated, sorted candidate list with reasons.
Does NOT modify data.js.
"""

import re
from difflib import SequenceMatcher

DATA_JS = "/home/user/Lumoria/js/data.js"

# ──────────────────────────────────────────────
# 1. Parse data.js
# ──────────────────────────────────────────────
mons = {}  # id -> {"id": int, "name": str, "types": list[str]}

with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)",.*?types:\[([^\]]+)\]',
    re.MULTILINE,
)
for m in pattern.finditer(content):
    mid = int(m.group(2))
    name = m.group(3)
    raw_types = m.group(4)
    types = [t.strip().strip('"') for t in raw_types.split(",")]
    mons[mid] = {"id": mid, "name": name, "types": types}

print(f"Parsed {len(mons)} monsters from data.js\n")

# Helper: bare name (strip "Forgotten " prefix for comparison purposes)
def bare(name):
    if name.startswith("Forgotten "):
        return name[len("Forgotten "):]
    return name

def similarity(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

# ──────────────────────────────────────────────
# 2. Build name→id lookup (by bare name)
# ──────────────────────────────────────────────
# Map bare_name -> list of ids (could be >1 for exact dupes)
bare_to_ids = {}
for mid, mon in mons.items():
    b = bare(mon["name"])
    bare_to_ids.setdefault(b, []).append(mid)

# ──────────────────────────────────────────────
# 3A. Exact duplicates (same bare name, different id)
# ──────────────────────────────────────────────
rename_reasons = {}  # id -> [reasons]

def mark(mid, reason):
    rename_reasons.setdefault(mid, [])
    if reason not in rename_reasons[mid]:
        rename_reasons[mid].append(reason)

exact_dupe_pairs = []
for b, ids in bare_to_ids.items():
    if len(ids) > 1:
        for mid in ids:
            others = [i for i in ids if i != mid]
            reason = f"exact duplicate bare name '{b}' shared with id(s) {others}"
            mark(mid, reason)
        # record as pair (lower id, higher id)
        for i in range(len(ids)):
            for j in range(i+1, len(ids)):
                exact_dupe_pairs.append((ids[i], ids[j], b))

print(f"=== A. Exact duplicate bare names: {len(exact_dupe_pairs)} pair(s) ===")
for a, b_id, name in sorted(exact_dupe_pairs):
    print(f"  #{a} {mons[a]['name']}  ↔  #{b_id} {mons[b_id]['name']}  (bare: '{name}')")

# ──────────────────────────────────────────────
# 3B. Near-duplicates (0.88 <= similarity < 1.0, bare names)
# ──────────────────────────────────────────────
SIMILARITY_THRESHOLD = 0.88

all_ids = sorted(mons.keys())
near_dupe_pairs = []

for i in range(len(all_ids)):
    for j in range(i+1, len(all_ids)):
        id_a, id_b = all_ids[i], all_ids[j]
        bare_a = bare(mons[id_a]["name"])
        bare_b = bare(mons[id_b]["name"])
        if bare_a == bare_b:
            continue  # already caught by exact dupe
        score = similarity(bare_a, bare_b)
        if score >= SIMILARITY_THRESHOLD:
            near_dupe_pairs.append((id_a, id_b, bare_a, bare_b, round(score, 3)))

print(f"\n=== B. Near-duplicate pairs (similarity >= {SIMILARITY_THRESHOLD}): {len(near_dupe_pairs)} pair(s) ===")
for id_a, id_b, na, nb, score in sorted(near_dupe_pairs, key=lambda x: -x[4]):
    print(f"  #{id_a} '{mons[id_a]['name']}' ↔ #{id_b} '{mons[id_b]['name']}'  score={score}")
    # Mark the higher-id one for rename (keep lower id as canonical)
    reason = f"near-duplicate of #{id_a} '{mons[id_a]['name']}' (score {score})"
    mark(id_b, reason)

CAP = 5  # max allowed members per group

# ──────────────────────────────────────────────
# 3C. Overused suffix/prefix groups (cap = CAP)
# ──────────────────────────────────────────────
def ends_with(name, suffix):
    return name.lower().endswith(suffix.lower())

def starts_with(name, prefix):
    return name.lower().startswith(prefix.lower())

def get_group(suffix=None, prefix=None):
    result = []
    for mid, mon in mons.items():
        n = mon["name"]
        if suffix and ends_with(n, suffix):
            result.append((mid, n))
        elif prefix and starts_with(n, prefix):
            result.append((mid, n))
    return sorted(result)

def cap_group(group, label):
    keep_set = {mid for mid, _ in group[:CAP]}
    for mid, name in group:
        if mid not in keep_set:
            mark(mid, f"overused {label} (cap {CAP})")

def make_group_sorted(suffix=None, prefix=None):
    return sorted(get_group(suffix=suffix, prefix=prefix))

vast_group  = make_group_sorted(suffix="vast");  cap_group(vast_group,  "-vast group")
rix_group   = make_group_sorted(suffix="rix");   cap_group(rix_group,   "-rix group")
kin_group   = make_group_sorted(suffix="kin");   cap_group(kin_group,   "-kin group")
ling_group  = make_group_sorted(suffix="ling");  cap_group(ling_group,  "-ling group")
lith_group  = make_group_sorted(suffix="lith");  cap_group(lith_group,  "-lith group")
void_group  = make_group_sorted(prefix="void");  cap_group(void_group,  "void- group")
veil_group  = make_group_sorted(suffix="veil");  cap_group(veil_group,  "-veil group")
crown_group = make_group_sorted(suffix="crown"); cap_group(crown_group, "-crown group")
shadow_group= make_group_sorted(prefix="shadow");cap_group(shadow_group,"shadow- group")
veth_group  = make_group_sorted(suffix="veth");  cap_group(veth_group,  "-veth group")
oth_group   = make_group_sorted(suffix="oth");   cap_group(oth_group,   "-oth group")
wing_group  = make_group_sorted(suffix="wing");  cap_group(wing_group,  "-wing group")
axis_group  = make_group_sorted(suffix="axis");  cap_group(axis_group,  "-axis group")
horn_group  = make_group_sorted(suffix="horn");  cap_group(horn_group,  "-horn group")
vorn_group  = make_group_sorted(suffix="vorn");  cap_group(vorn_group,  "-vorn group")

ing_group = sorted([(mid, mons[mid]["name"]) for mid in mons
                    if ends_with(mons[mid]["name"], "ing") and not ends_with(mons[mid]["name"], "ling")])
cap_group(ing_group, "-ing group")

ith_group = sorted([(mid, mons[mid]["name"]) for mid in mons
                    if ends_with(mons[mid]["name"], "ith") and not ends_with(mons[mid]["name"], "lith")])
cap_group(ith_group, "-ith (non-lith) group")

eth_group = sorted([(mid, mons[mid]["name"]) for mid in mons
                    if ends_with(mons[mid]["name"], "eth") and not ends_with(mons[mid]["name"], "veth")])
cap_group(eth_group, "-eth (non-veth) group")

orn_group = sorted([(mid, mons[mid]["name"]) for mid in mons
                    if ends_with(mons[mid]["name"], "orn")
                    and not ends_with(mons[mid]["name"], "horn")
                    and not ends_with(mons[mid]["name"], "vorn")])
cap_group(orn_group, "-orn (other) group")

lin_group = sorted([(mid, mons[mid]["name"]) for mid in mons
                    if ends_with(mons[mid]["name"], "lin") and not ends_with(mons[mid]["name"], "gling")])
cap_group(lin_group, "-lin group")

# ──────────────────────────────────────────────
# 3C-2. Shared prefix-stem groups (cap=2 each)
# These are prefixes that appear 3+ times across all mons (bare names).
# ──────────────────────────────────────────────
PREFIX_STEMS = [
    "frost", "spark", "volt", "thunder", "abyss", "luna",
    "infer", "pyro", "cinder", "titan", "deep", "zephyr",
    "stone", "aether", "serp", "dusk", "spectr", "ember",
    "crystal", "glaci",
]

for stem in PREFIX_STEMS:
    grp = sorted([(mid, mons[mid]["name"]) for mid in mons
                  if bare(mons[mid]["name"]).lower().startswith(stem)])
    if len(grp) > 2:
        keep_set = {mid for mid, _ in grp[:2]}
        for mid, name in grp:
            if mid not in keep_set:
                mark(mid, f"overused {stem}- prefix stem (cap 2)")

# ──────────────────────────────────────────────
# 3D. Forgotten midfix conflicts
# ──────────────────────────────────────────────
# For each Forgotten mon, extract the "midfix" (the first part of their bare name,
# defined as everything before the suffix — we try 3-6 char prefixes of the bare name).
# If that midfix matches the start of any regular mon's name → conflict.

REGULAR_IDS = {mid for mid, mon in mons.items() if not mon["name"].startswith("Forgotten ")}
FORGOTTEN_IDS = {mid for mid, mon in mons.items() if mon["name"].startswith("Forgotten ")}

print(f"\n=== D. Forgotten midfix vs regular mon prefix conflicts ===")
midfix_conflict_count = 0
for fid in sorted(FORGOTTEN_IDS):
    fname = mons[fid]["name"]
    bname = bare(fname)  # e.g. "Lumarix", "Ironvast"
    # Try midfix lengths 3..len-2 (at least 3 chars, not the whole name)
    for mlen in range(3, len(bname) - 1):
        midfix = bname[:mlen]
        # Find regular mons whose name starts with this midfix (case-insensitive)
        matches = [(rid, mons[rid]["name"]) for rid in REGULAR_IDS
                   if mons[rid]["name"].lower().startswith(midfix.lower())
                   and mons[rid]["name"].lower() != bname.lower()]
        if matches:
            for rid, rname in matches:
                reason = f"Forgotten midfix '{midfix}' (from '{fname}') matches prefix of #{rid} '{rname}'"
                print(f"  {reason}")
                # Mark the Forgotten mon (keep the regular one as canonical)
                mark(fid, reason)
                midfix_conflict_count += 1
            break  # longest match found at this length; move to next Forgotten

if midfix_conflict_count == 0:
    print("  None found.")

# ──────────────────────────────────────────────
# 4. Summary
# ──────────────────────────────────────────────
print(f"\n=== FINAL CANDIDATE LIST ({len(rename_reasons)} unique mons) ===")
print(f"{'#':>5}  {'NAME':<28}  {'TYPES':<22}  REASONS")
print("-" * 110)
for mid in sorted(rename_reasons.keys()):
    mon = mons[mid]
    types_str = "/".join(mon["types"])
    reasons = "; ".join(rename_reasons[mid])
    print(f"#{mid:>4}  {mon['name']:<28}  {types_str:<22}  {reasons}")

print(f"\nTotal unique mons to rename: {len(rename_reasons)}")

# Category breakdown
cat_a = {mid for mid in rename_reasons if any("exact duplicate" in r for r in rename_reasons[mid])}
cat_b = {mid for mid in rename_reasons if any("near-duplicate" in r for r in rename_reasons[mid])}
cat_c = {mid for mid in rename_reasons if any("overused" in r for r in rename_reasons[mid])}
cat_d = {mid for mid in rename_reasons if any("midfix" in r for r in rename_reasons[mid])}
print(f"  A (exact dupes):                {len(cat_a)}")
print(f"  B (near-dupes ≥{SIMILARITY_THRESHOLD}):        {len(cat_b)}")
print(f"  C (overuse groups, cap={CAP}):    {len(cat_c)}")
print(f"  D (midfix conflicts):           {len(cat_d)}")
print(f"  (categories overlap — union is {len(rename_reasons)})")

print(f"\n─── Group sizes (before any renames) ───")
groups_to_show = [
    ("suffix","vast"), ("suffix","rix"), ("suffix","kin"), ("suffix","ling"),
    ("suffix","ing_nonling"), ("suffix","lith"), ("suffix","ith_nonlith"),
    ("prefix","void"), ("suffix","veil"), ("suffix","crown"), ("prefix","shadow"),
    ("suffix","veth"), ("suffix","eth_nonveth"), ("suffix","oth"), ("suffix","wing"),
    ("suffix","axis"), ("suffix","horn"), ("suffix","vorn"), ("suffix","orn_other"),
    ("suffix","lin"),
]
for kind, pat in groups_to_show:
    if pat == "ing_nonling":
        g = [(mid, mons[mid]["name"]) for mid in mons if ends_with(mons[mid]["name"],"ing") and not ends_with(mons[mid]["name"],"ling")]
    elif pat == "ith_nonlith":
        g = [(mid, mons[mid]["name"]) for mid in mons if ends_with(mons[mid]["name"],"ith") and not ends_with(mons[mid]["name"],"lith")]
    elif pat == "eth_nonveth":
        g = [(mid, mons[mid]["name"]) for mid in mons if ends_with(mons[mid]["name"],"eth") and not ends_with(mons[mid]["name"],"veth")]
    elif pat == "orn_other":
        g = [(mid, mons[mid]["name"]) for mid in mons if ends_with(mons[mid]["name"],"orn") and not ends_with(mons[mid]["name"],"horn") and not ends_with(mons[mid]["name"],"vorn")]
    elif kind == "suffix":
        g = [(mid, mons[mid]["name"]) for mid in mons if ends_with(mons[mid]["name"], pat)]
    else:
        g = [(mid, mons[mid]["name"]) for mid in mons if starts_with(mons[mid]["name"], pat)]
    keep2 = sorted(g)[:CAP]
    print(f"  {pat}: {len(g)} total → keep {[n for _,n in keep2]}, rename {len(g)-CAP} others")
