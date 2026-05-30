#!/usr/bin/env python3
"""
Tally type-combo distribution among pre-408 (non-Forgotten) Lumori in js/data.js
under the ID-tally framework.

Counting rule (ID-tally):
  For each type combo, count EVERY Lumori in the dex whose `types` array
  matches that combo, regardless of evolution stage. Pre-stages, mid-stages,
  finals, and standalones ALL count. A pre-stage with a different types array
  counts for its own combo, not the final's. Multi-stage chains where stages
  share typing contribute multiple IDs.

Cap rules (soft caps — drift acceptable on justification):
  - Ordinary dual cap:  6 IDs
  - Flagship dual cap:  12 IDs (2x ordinary)
  - All mono combos:    automatic flagship status (12-ID cap)
  - Forgotten (id>=408) excluded entirely from pre-408 cap accounting.

See TODO.md "Cap rules & counting" section for full framework.
"""
import re
from pathlib import Path
from collections import defaultdict
from itertools import combinations

DATA_JS = Path(__file__).resolve().parent.parent / "js" / "data.js"
ORDINARY_CAP = 6
FLAGSHIP_CAP = 12
POSTGAME_THRESHOLD = 408  # Lumori with id >= 408 are Forgotten (excluded here)

# All 26 type names in the chart
ALL_TYPES = [
    "Aquatic", "Dark", "Draconic", "Dream", "Earth", "Electric", "Fairy",
    "Fighting", "Fire", "Ice", "Mental", "Metal", "Mineral", "Nature",
    "Normal", "Poison", "Sonic", "Spectral", "Toxin", "Vapor", "Wind",
    "Aether", "Crystal", "Primal", "Chrono", "Stellar",
]
# Freely-usable pre-408 (no eligibility restriction)
PRE408_FREE = [
    "Aquatic", "Dark", "Draconic", "Dream", "Earth", "Electric", "Fairy",
    "Fighting", "Fire", "Ice", "Mental", "Metal", "Mineral", "Nature",
    "Normal", "Poison", "Sonic", "Spectral", "Toxin", "Vapor", "Wind",
]
# Legendary-only pre-408 (Crystal/Primal/Stellar — CLAUDE.md exception)
POSTGAME_LEGENDARY_OK = ["Crystal", "Primal", "Stellar"]
# Strict post-408 only (never pre-408)
STRICT_POSTGAME = ["Aether", "Chrono"]

# ---------- Parse data.js ----------
text = DATA_JS.read_text()
pat = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)",.*?types:\[([^\]]+)\].*?evolveTo:\s*(\d+|null)',
    re.MULTILINE | re.DOTALL,
)
mons = {}
for m in pat.finditer(text):
    mid = int(m.group(2))
    if mid >= POSTGAME_THRESHOLD:
        continue
    types = tuple(sorted(t.strip().strip('"') for t in m.group(4).split(",")))
    mons[mid] = {"id": mid, "name": m.group(3), "types": types}

# ---------- Tally per type combo (ID-tally) ----------
combo_members = defaultdict(list)
for mid, info in mons.items():
    combo_members[info["types"]].append((mid, info["name"]))

# ---------- Cap-status per combo ----------
rows = []
for combo, members in combo_members.items():
    is_mono = len(combo) == 1
    count = len(members)
    cap = FLAGSHIP_CAP if is_mono else ORDINARY_CAP
    over = max(0, count - cap)
    rows.append({
        "combo": combo,
        "is_mono": is_mono,
        "count": count,
        "cap": cap,
        "over": over,
        "members": members,
    })

# ---------- Reports ----------
print(f"Loaded {len(mons)} pre-408 Lumori (Forgotten id>={POSTGAME_THRESHOLD} excluded)")
print(f"Distinct type combos in pre-408 dex: {len(combo_members)}")
print(f"\nCap rules (soft): ordinary dual={ORDINARY_CAP}, flagship dual={FLAGSHIP_CAP}, all monos auto-flagship\n")

# Distribution histogram
buckets = defaultdict(int)
for r in rows:
    c = r["count"]
    if c <= 6:
        buckets[str(c)] += 1
    elif c <= 8:
        buckets["7-8"] += 1
    elif c <= 10:
        buckets["9-10"] += 1
    else:
        buckets["11+"] += 1
print("=" * 60)
print("DISTRIBUTION (occupied combos by ID count)")
print("=" * 60)
print(f"  {'IDs':>5}   {'# combos':>9}")
for k in ["1", "2", "3", "4", "5", "6", "7-8", "9-10", "11+"]:
    if k in buckets:
        print(f"  {k:>5}   {buckets[k]:>9}")

# Over-cap report
over_cap = [r for r in rows if r["over"] > 0]
over_cap.sort(key=lambda r: (-r["count"], r["combo"]))
print()
print("=" * 110)
print(f"OVER-CAP COMBOS  (dual > {ORDINARY_CAP} IDs, mono > {FLAGSHIP_CAP} IDs)")
print("=" * 110)
print(f"  {'Combo':<26} {'Type':>6} {'IDs':>4} {'Cap':>4} {'+T':>3}  Members")
print("  " + "-" * 106)
for r in over_cap:
    combo_str = "/".join(r["combo"]) if not r["is_mono"] else r["combo"][0]
    type_str = "mono" if r["is_mono"] else "dual"
    members = ", ".join(f"#{mid} {n}" for mid, n in r["members"])
    print(f"  {combo_str:<26} {type_str:>6} {r['count']:>4} {r['cap']:>4} "
          f"{r['over']:>3}  {members}")
if not over_cap:
    print("  (none — all combos within cap)")
print()

# Pristine pre-408-eligible duals (still empty, freely usable)
all_freely_duals = set(tuple(sorted(c)) for c in combinations(PRE408_FREE, 2))
occupied = set(r["combo"] for r in rows if not r["is_mono"])
pristine = sorted(all_freely_duals - occupied)
print("=" * 60)
print(f"PRISTINE pre-408-freely-eligible duals: {len(pristine)}")
print("=" * 60)
print("  (empty combos available as retype targets — no legendary restriction)")
# Print compactly: 4 per line
for i in range(0, len(pristine), 4):
    line = "  " + "  ".join(f"{'/'.join(p):<22}" for p in pristine[i:i+4])
    print(line)
print()

# Summary
total = len(mons)
print(f"Pre-408 totals: {total} Lumori across {len(combo_members)} occupied type combos")
print(f"Over-cap dual combos to address: {sum(1 for r in over_cap if not r['is_mono'])}")
print(f"Over-cap monos (over flagship 12): {sum(1 for r in over_cap if r['is_mono'])}")
