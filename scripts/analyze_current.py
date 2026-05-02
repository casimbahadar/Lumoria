#!/usr/bin/env python3
"""
Analyzes the current data.js (single source of truth) at CAP=2 for all groups.
Does NOT use any APPROVED_RENAMES override — reads only what's on disk.
"""

import re
from difflib import SequenceMatcher

DATA_JS = "/home/user/Lumoria/js/data.js"
CAP = 2
SIMILARITY = 0.88

with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

mons = {}
pattern = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)",.*?types:\[([^\]]+)\]',
    re.MULTILINE,
)
for m in pattern.finditer(content):
    mid = int(m.group(2))
    mons[mid] = {
        "id": mid,
        "name": m.group(3),
        "types": [t.strip().strip('"') for t in m.group(4).split(",")],
    }

print(f"Parsed {len(mons)} mons from data.js (no overrides)\n")

def bare(n): return n[len("Forgotten "):] if n.startswith("Forgotten ") else n
def ends(n, s): return n.lower().endswith(s.lower())
def starts(n, p): return n.lower().startswith(p.lower())
def sim(a, b): return SequenceMatcher(None, a.lower(), b.lower()).ratio()

reasons = {}
def mark(mid, r):
    reasons.setdefault(mid, [])
    if r not in reasons[mid]: reasons[mid].append(r)

def cap_group(group, label):
    keep = {mid for mid, _ in group[:CAP]}
    for mid, _ in group:
        if mid not in keep: mark(mid, f"overused {label} (cap {CAP})")

# Exact dupes
b2i = {}
for mid, m in mons.items():
    b2i.setdefault(bare(m["name"]), []).append(mid)
for b, ids in b2i.items():
    if len(ids) > 1:
        for mid in ids:
            others = [i for i in ids if i != mid]
            mark(mid, f"exact duplicate '{b}' with {others}")

# Near dupes
all_ids = sorted(mons.keys())
for i in range(len(all_ids)):
    for j in range(i+1, len(all_ids)):
        a, b = all_ids[i], all_ids[j]
        ba, bb = bare(mons[a]["name"]), bare(mons[b]["name"])
        if ba == bb: continue
        s = sim(ba, bb)
        if s >= SIMILARITY:
            mark(b, f"near-dup of #{a} '{mons[a]['name']}' ({round(s,3)})")

# Suffix groups
SUFFIXES = ["vast","rix","kin","ling","lith","veth","oth","wing",
            "axis","horn","vorn","veil","crown"]
for sfx in SUFFIXES:
    g = sorted((mid, m["name"]) for mid, m in mons.items() if ends(m["name"], sfx))
    cap_group(g, f"-{sfx}")

# Special split groups
def grp(filt):
    return sorted((mid, m["name"]) for mid, m in mons.items() if filt(m["name"]))

cap_group(grp(lambda n: ends(n,"ing") and not ends(n,"ling")), "-ing (non-ling)")
cap_group(grp(lambda n: ends(n,"ith") and not ends(n,"lith")), "-ith (non-lith)")
cap_group(grp(lambda n: ends(n,"eth") and not ends(n,"veth")), "-eth (non-veth)")
cap_group(grp(lambda n: ends(n,"orn") and not ends(n,"horn") and not ends(n,"vorn")), "-orn (other)")
cap_group(grp(lambda n: ends(n,"lin") and not ends(n,"gling")), "-lin")

# Prefix groups
for pfx in ["void", "shadow"]:
    g = sorted((mid, m["name"]) for mid, m in mons.items() if starts(m["name"], pfx))
    cap_group(g, f"{pfx}-")

# Prefix stems
STEMS = ["frost","spark","volt","thunder","abyss","luna","infer","pyro",
         "cinder","titan","deep","zephyr","stone","aether","serp","dusk",
         "spectr","ember","crystal","glaci"]
for stem in STEMS:
    g = sorted((mid, m["name"]) for mid, m in mons.items()
               if bare(m["name"]).lower().startswith(stem))
    if len(g) > CAP:
        keep = {mid for mid, _ in g[:CAP]}
        for mid, _ in g:
            if mid not in keep: mark(mid, f"overused {stem}- prefix stem (cap {CAP})")

# Forgotten midfix
REG = {mid for mid, m in mons.items() if not m["name"].startswith("Forgotten ")}
FOR = {mid for mid, m in mons.items() if m["name"].startswith("Forgotten ")}
for fid in sorted(FOR):
    fname = mons[fid]["name"]
    bn = bare(fname)
    for ml in range(3, len(bn) - 1):
        mf = bn[:ml]
        matches = [(rid, mons[rid]["name"]) for rid in REG
                   if mons[rid]["name"].lower().startswith(mf.lower())
                   and mons[rid]["name"].lower() != bn.lower()]
        if matches:
            for rid, rn in matches:
                mark(fid, f"midfix '{mf}' (from '{fname}') matches #{rid} '{rn}'")
            break

# Output
print(f"=== ALL FLAGGED CANDIDATES ({len(reasons)}) ===")
print(f"{'#':>5}  {'NAME':<28}  {'TYPES':<22}  REASONS")
print("-" * 115)
for mid in sorted(reasons):
    m = mons[mid]
    print(f"#{mid:>4}  {m['name']:<28}  {'/'.join(m['types']):<22}  {'; '.join(reasons[mid])}")

print(f"\nTotal: {len(reasons)}")

# Group sizes for context
print("\n─── Over-cap groups in current data.js ───")
all_groups = []
for s in SUFFIXES:
    g = sorted((mid, m["name"]) for mid, m in mons.items() if ends(m["name"], s))
    all_groups.append((f"-{s}", g))
for p in ["void","shadow"]:
    g = sorted((mid, m["name"]) for mid, m in mons.items() if starts(m["name"], p))
    all_groups.append((f"{p}-", g))
for stem in STEMS:
    g = sorted((mid, m["name"]) for mid, m in mons.items()
               if bare(m["name"]).lower().startswith(stem))
    all_groups.append((f"{stem}- (stem)", g))

for label, g in all_groups:
    if len(g) > CAP:
        names = [n for _, n in g]
        print(f"  {label}: {len(g)} → {names}")
