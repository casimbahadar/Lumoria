#!/usr/bin/env python3
"""
Tally type-combo distribution among pre-408 (non-Forgotten) Lumori in js/data.js.
Identifies combos exceeding the ordinary cap (2 families + 1 standalone = 3 entries).

Family = final-stage Lumori that has a pre-evolution (whole evo chain counts once).
Standalone = final-stage Lumori with NO pre-evolution (each counts once).
Non-final stages don't count toward the cap (they're members of their family).
"""
import re
from pathlib import Path
from collections import defaultdict

DATA_JS = Path("/home/user/Lumoria/js/data.js")
ORDINARY_CAP_TOTAL = 3
ORDINARY_CAP_FAM = 2
ORDINARY_CAP_STD = 1
POSTGAME_THRESHOLD = 408  # Lumori with id >= 408 are Forgotten (excluded here)

text = DATA_JS.read_text()
mons = {}
pat = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)",.*?types:\[([^\]]+)\].*?evolveTo:\s*(\d+|null)',
    re.MULTILINE | re.DOTALL,
)
for m in pat.finditer(text):
    mid = int(m.group(2))
    types = tuple(sorted(t.strip().strip('"') for t in m.group(4).split(",")))
    evolve = m.group(5)
    mons[mid] = {
        "id": mid,
        "name": m.group(3),
        "types": types,
        "evolveTo": None if evolve == "null" else int(evolve),
    }

# Reverse map: target_id -> source_id (i.e. who evolves INTO me?)
pre_evo = {}
for mid, info in mons.items():
    if info["evolveTo"] is not None:
        pre_evo[info["evolveTo"]] = mid


def is_final(mid):
    return mons[mid]["evolveTo"] is None


def is_family_final(mid):
    return is_final(mid) and mid in pre_evo


def is_standalone(mid):
    return is_final(mid) and mid not in pre_evo


# Filter to pre-408
pre408_mons = {mid: info for mid, info in mons.items() if mid < POSTGAME_THRESHOLD}

# Tally per type combo
combo_stats = defaultdict(lambda: {"families": [], "standalones": []})
for mid, info in pre408_mons.items():
    if is_family_final(mid):
        combo_stats[info["types"]]["families"].append((mid, info["name"]))
    elif is_standalone(mid):
        combo_stats[info["types"]]["standalones"].append((mid, info["name"]))


rows = []
for combo, stats in combo_stats.items():
    fam_n = len(stats["families"])
    sa_n = len(stats["standalones"])
    total = fam_n + sa_n
    over_total = max(0, total - ORDINARY_CAP_TOTAL)
    over_fam = max(0, fam_n - ORDINARY_CAP_FAM)
    over_std = max(0, sa_n - ORDINARY_CAP_STD)
    rows.append({
        "combo": combo,
        "families": fam_n,
        "standalones": sa_n,
        "total": total,
        "over_total": over_total,
        "over_fam": over_fam,
        "over_std": over_std,
        "is_over_cap": (over_total > 0 or over_fam > 0 or over_std > 0),
        "fam_members": stats["families"],
        "sa_members": stats["standalones"],
    })

over_cap = [r for r in rows if r["is_over_cap"]]
over_cap.sort(key=lambda r: (-r["total"], -r["over_total"], r["combo"]))

print(f"Loaded {len(pre408_mons)} pre-408 Lumori (Forgotten id≥408 excluded)")
print(f"Distinct type combos in pre-408 dex: {len(rows)}")
print(f"Over-cap combos (any of: total>3, families>2, standalones>1): {len(over_cap)}")
print(f"Ordinary cap rule: 2 families + 1 standalone (max 3 entries total)\n")

print("=" * 110)
print("OVER-CAP TYPE COMBOS (sorted by total entries desc)")
print("=" * 110)
print(f"{'Combo':<26} {'Fam':>4} {'Std':>4} {'Tot':>4} {'+T':>3} {'+F':>3} {'+S':>3}  Members")
print("-" * 110)
for r in over_cap:
    combo_str = "/".join(r["combo"]) if len(r["combo"]) > 1 else r["combo"][0] + " (mono)"
    members = ", ".join(f"#{mid} {n}" for mid, n in (r["fam_members"] + r["sa_members"]))
    print(f"{combo_str:<26} {r['families']:>4} {r['standalones']:>4} {r['total']:>4} "
          f"{r['over_total']:>3} {r['over_fam']:>3} {r['over_std']:>3}  {members}")
print()

# Summary
total_pre408 = len(pre408_mons)
total_families = sum(r["families"] for r in rows)
total_standalones = sum(r["standalones"] for r in rows)
print(f"Pre-408 totals: {total_families} families + {total_standalones} standalones "
      f"= {total_families + total_standalones} cap-counted entries "
      f"({total_pre408} total Lumori incl. intermediate stages)")
