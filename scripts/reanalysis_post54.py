#!/usr/bin/env python3
"""
Post-54-renames analysis. CAP=2 for ALL groups.
Applies approved renames virtually, then re-runs full candidate detection.
Does NOT modify data.js.
"""

import re
from difflib import SequenceMatcher

DATA_JS = "/home/user/Lumoria/js/data.js"
CAP = 2

APPROVED_RENAMES = {
    10: "Scorchlarva",
    86: "Galvaglide",
    92: "Arcspine",
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
    167: "Cranidingo",
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

# ── 1. Parse data.js, apply approved renames ──────────────────────────────────
mons = {}
with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)",.*?types:\[([^\]]+)\]',
    re.MULTILINE,
)
for m in pattern.finditer(content):
    mid = int(m.group(2))
    name = APPROVED_RENAMES.get(mid, m.group(3))
    raw_types = m.group(4)
    types = [t.strip().strip('"') for t in raw_types.split(",")]
    mons[mid] = {"id": mid, "name": name, "types": types}

print(f"Parsed {len(mons)} monsters ({len(APPROVED_RENAMES)} renames applied)\n")

# ── Helpers ───────────────────────────────────────────────────────────────────
def bare(name):
    return name[len("Forgotten "):] if name.startswith("Forgotten ") else name

def similarity(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def ends_with(name, suffix):
    return name.lower().endswith(suffix.lower())

def starts_with(name, prefix):
    return name.lower().startswith(prefix.lower())

rename_reasons = {}

def mark(mid, reason):
    rename_reasons.setdefault(mid, [])
    if reason not in rename_reasons[mid]:
        rename_reasons[mid].append(reason)

def cap_group(group, label):
    keep_set = {mid for mid, _ in group[:CAP]}
    for mid, _ in group:
        if mid not in keep_set:
            mark(mid, f"overused {label} (cap {CAP})")

# ── 2A. Exact duplicates ──────────────────────────────────────────────────────
bare_to_ids = {}
for mid, mon in mons.items():
    bare_to_ids.setdefault(bare(mon["name"]), []).append(mid)

for b, ids in bare_to_ids.items():
    if len(ids) > 1:
        for mid in ids:
            others = [i for i in ids if i != mid]
            mark(mid, f"exact duplicate bare name '{b}' with id(s) {others}")

# ── 2B. Near-duplicates ───────────────────────────────────────────────────────
THRESHOLD = 0.88
all_ids = sorted(mons.keys())
for i in range(len(all_ids)):
    for j in range(i + 1, len(all_ids)):
        id_a, id_b = all_ids[i], all_ids[j]
        ba, bb = bare(mons[id_a]["name"]), bare(mons[id_b]["name"])
        if ba == bb:
            continue
        score = similarity(ba, bb)
        if score >= THRESHOLD:
            mark(id_b, f"near-duplicate of #{id_a} '{mons[id_a]['name']}' (score {round(score,3)})")

# ── 2C. Suffix groups (CAP=2) ─────────────────────────────────────────────────
for suffix, label in [
    ("vast",  "-vast"),  ("rix",   "-rix"),   ("kin",  "-kin"),
    ("ling",  "-ling"),  ("lith",  "-lith"),  ("veth", "-veth"),
    ("oth",   "-oth"),   ("wing",  "-wing"),  ("axis", "-axis"),
    ("horn",  "-horn"),  ("vorn",  "-vorn"),  ("veil", "-veil"),
    ("crown", "-crown"),
]:
    cap_group(sorted((mid, mon["name"]) for mid, mon in mons.items()
                     if ends_with(mon["name"], suffix)), label)

# special splits
cap_group(sorted((mid, mon["name"]) for mid, mon in mons.items()
    if ends_with(mon["name"], "ing") and not ends_with(mon["name"], "ling")), "-ing (non-ling)")
cap_group(sorted((mid, mon["name"]) for mid, mon in mons.items()
    if ends_with(mon["name"], "ith") and not ends_with(mon["name"], "lith")), "-ith (non-lith)")
cap_group(sorted((mid, mon["name"]) for mid, mon in mons.items()
    if ends_with(mon["name"], "eth") and not ends_with(mon["name"], "veth")), "-eth (non-veth)")
cap_group(sorted((mid, mon["name"]) for mid, mon in mons.items()
    if ends_with(mon["name"], "orn")
    and not ends_with(mon["name"], "horn")
    and not ends_with(mon["name"], "vorn")), "-orn (other)")
cap_group(sorted((mid, mon["name"]) for mid, mon in mons.items()
    if ends_with(mon["name"], "lin") and not ends_with(mon["name"], "gling")), "-lin")

# ── 2C-2. Prefix groups (CAP=2) ──────────────────────────────────────────────
for prefix, label in [("void", "void-"), ("shadow", "shadow-")]:
    cap_group(sorted((mid, mon["name"]) for mid, mon in mons.items()
                     if starts_with(mon["name"], prefix)), label)

# ── 2C-3. Prefix stems (CAP=2) ───────────────────────────────────────────────
for stem in [
    "frost", "spark", "volt", "thunder", "abyss", "luna",
    "infer", "pyro", "cinder", "titan", "deep", "zephyr",
    "stone", "aether", "serp", "dusk", "spectr", "ember",
    "crystal", "glaci",
]:
    grp = sorted((mid, mon["name"]) for mid, mon in mons.items()
                 if bare(mon["name"]).lower().startswith(stem))
    if len(grp) > CAP:
        keep_set = {mid for mid, _ in grp[:CAP]}
        for mid, _ in grp:
            if mid not in keep_set:
                mark(mid, f"overused {stem}- prefix stem (cap {CAP})")

# ── 2D. Forgotten midfix conflicts ───────────────────────────────────────────
REGULAR_IDS  = {mid for mid, mon in mons.items() if not mon["name"].startswith("Forgotten ")}
FORGOTTEN_IDS = {mid for mid, mon in mons.items() if mon["name"].startswith("Forgotten ")}

for fid in sorted(FORGOTTEN_IDS):
    fname = mons[fid]["name"]
    bname = bare(fname)
    for mlen in range(3, len(bname) - 1):
        midfix = bname[:mlen]
        matches = [(rid, mons[rid]["name"]) for rid in REGULAR_IDS
                   if mons[rid]["name"].lower().startswith(midfix.lower())
                   and mons[rid]["name"].lower() != bname.lower()]
        if matches:
            for rid, rname in matches:
                mark(fid, f"Forgotten midfix '{midfix}' (from '{fname}') matches prefix of #{rid} '{rname}'")
            break

# ── 3. Filter out already-renamed mons ───────────────────────────────────────
remaining = {mid: r for mid, r in rename_reasons.items() if mid not in APPROVED_RENAMES}

# ── 4. Output ─────────────────────────────────────────────────────────────────
print(f"=== REMAINING CANDIDATES ({len(remaining)} unique mons) ===")
print(f"{'#':>5}  {'CURRENT NAME':<30}  {'TYPES':<22}  REASONS")
print("-" * 115)
for mid in sorted(remaining.keys()):
    mon = mons[mid]
    types_str = "/".join(mon["types"])
    reasons = "; ".join(remaining[mid])
    print(f"#{mid:>4}  {mon['name']:<30}  {types_str:<22}  {reasons}")

print(f"\nTotal remaining to rename: {len(remaining)}")
cat_a = {m for m in remaining if any("exact duplicate" in r for r in remaining[m])}
cat_b = {m for m in remaining if any("near-duplicate" in r for r in remaining[m])}
cat_c = {m for m in remaining if any("overused" in r for r in remaining[m])}
cat_d = {m for m in remaining if any("midfix" in r for r in remaining[m])}
print(f"  A (exact dupes):       {len(cat_a)}")
print(f"  B (near-dupes ≥{THRESHOLD}): {len(cat_b)}")
print(f"  C (overuse, cap={CAP}):    {len(cat_c)}")
print(f"  D (midfix conflicts):  {len(cat_d)}")

# ── 5. Group sizes snapshot ───────────────────────────────────────────────────
print(f"\n─── Group sizes after 54 renames (showing groups with >2 remaining) ───")
all_groups = []
for suffix in ["vast","rix","kin","ling","lith","veth","oth","wing","axis","horn","vorn","veil","crown"]:
    g = sorted((mid, mon["name"]) for mid, mon in mons.items() if ends_with(mon["name"], suffix))
    all_groups.append((f"-{suffix}", g))
for prefix in ["void","shadow"]:
    g = sorted((mid, mon["name"]) for mid, mon in mons.items() if starts_with(mon["name"], prefix))
    all_groups.append((f"{prefix}-", g))
for stem in ["frost","spark","volt","thunder","abyss","luna","infer","pyro","cinder","titan","deep","zephyr","stone","aether","serp","dusk","spectr","ember","crystal","glaci"]:
    g = sorted((mid, mon["name"]) for mid, mon in mons.items() if bare(mon["name"]).lower().startswith(stem))
    all_groups.append((f"{stem}- (stem)", g))

for label, g in all_groups:
    if len(g) > CAP:
        keep = [n for _, n in g[:CAP]]
        extra = [n for _, n in g[CAP:]]
        print(f"  {label}: {len(g)} total → keep {keep} → still need rename: {extra}")
