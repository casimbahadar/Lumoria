#!/usr/bin/env python3
"""Read-only: dump every type combo that currently exceeds the ordinary cap
(2F+1S = 3 entries). Group by severity. Flag which combos COULD be rescued
by flagship promotion (4F+2S = 6 entries) vs. which would still need retypes
even at flagship status."""

import re
from collections import defaultdict

DATA_JS = "/home/user/Lumoria/js/data.js"

with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

mons = {}
pat = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)",.*?types:\[([^\]]+)\].*?evolveTo:\s*(\d+|null)',
    re.MULTILINE | re.DOTALL,
)
for m in pat.finditer(content):
    mid = int(m.group(2))
    types = tuple(sorted(t.strip().strip('"') for t in m.group(4).split(",")))
    evolve = m.group(5)
    mons[mid] = {
        "id": mid,
        "name": m.group(3),
        "types": types,
        "evolveTo": None if evolve == "null" else int(evolve),
    }

# Reverse map: who evolves into me?
preEvo = {}
for mid, info in mons.items():
    if info["evolveTo"] is not None:
        preEvo[info["evolveTo"]] = mid

def family_chain(final_id):
    chain = [final_id]
    cur = final_id
    while cur in preEvo:
        cur = preEvo[cur]
        chain.append(cur)
    return list(reversed(chain))

# Tally by combo using only finals (since a family tallies once)
combos = defaultdict(lambda: {"families": [], "standalones": []})
for mid, info in mons.items():
    if info["evolveTo"] is not None:
        continue  # not a final-stage
    combo = info["types"]
    chain = family_chain(mid)
    entry = {"final_id": mid, "name": info["name"], "chain": chain}
    if len(chain) == 1:
        combos[combo]["standalones"].append(entry)
    else:
        combos[combo]["families"].append(entry)

ORDINARY_F = 2
ORDINARY_S = 1
FLAGSHIP_F = 4
FLAGSHIP_S = 2

def combo_label(combo):
    if len(combo) == 1:
        return f"mono {combo[0]}"
    return "/".join(combo)

def excess(combo_data, cap_f, cap_s):
    f = len(combo_data["families"])
    s = len(combo_data["standalones"])
    over_f = max(0, f - cap_f)
    over_s = max(0, s - cap_s)
    return over_f + over_s

# Find all over-cap (ordinary) combos
violations = []
for combo, data in combos.items():
    over_ord = excess(data, ORDINARY_F, ORDINARY_S)
    if over_ord > 0:
        over_flag = excess(data, FLAGSHIP_F, FLAGSHIP_S)
        violations.append((combo, data, over_ord, over_flag))

violations.sort(key=lambda v: (-v[2], combo_label(v[0])))

print(f"Total over-cap combos (vs ordinary 2F+1S=3): {len(violations)}\n")

# Already-tentative flagships
TENTATIVE = {("Fairy", "Psychic"), ("Dragon", "Fire"),
             ("Dragon", "Psychic"), ("Normal",)}

print("=" * 80)
print("Group A: Combos that would become COMPLIANT under flagship promotion")
print("         (i.e. over by 1-3 at ordinary cap, ≤6 entries total)")
print("=" * 80)
for combo, data, over_ord, over_flag in violations:
    if over_flag == 0:
        is_tent = " [TENTATIVE]" if combo in TENTATIVE else ""
        f = len(data["families"])
        s = len(data["standalones"])
        print(f"\n## {combo_label(combo)}  ({f}F+{s}S = {f+s} entries; over ordinary by {over_ord}){is_tent}")
        for e in data["families"]:
            chain_str = " → ".join(f"#{m} {mons[m]['name']}" for m in e["chain"])
            print(f"    F: {chain_str}")
        for e in data["standalones"]:
            print(f"    S: #{e['final_id']} {e['name']}")

print("\n" + "=" * 80)
print("Group B: Combos still over even at FLAGSHIP cap (4F+2S=6)")
print("         — promotion alone is insufficient; retypes needed either way")
print("=" * 80)
for combo, data, over_ord, over_flag in violations:
    if over_flag > 0:
        is_tent = " [TENTATIVE]" if combo in TENTATIVE else ""
        f = len(data["families"])
        s = len(data["standalones"])
        print(f"\n## {combo_label(combo)}  ({f}F+{s}S = {f+s} entries; over ordinary by {over_ord}, over flagship by {over_flag}){is_tent}")
        for e in data["families"]:
            chain_str = " → ".join(f"#{m} {mons[m]['name']}" for m in e["chain"])
            print(f"    F: {chain_str}")
        for e in data["standalones"]:
            print(f"    S: #{e['final_id']} {e['name']}")
