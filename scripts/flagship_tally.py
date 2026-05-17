#!/usr/bin/env python3
"""Read-only: tally member ids + family/standalone status for the 4 tentative
flagship typings. Output: short table per combo."""

import re

DATA_JS = "/home/user/Lumoria/js/data.js"

with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

mons = {}
# Match id:N, name:"X", ... types:[...], ... evolveTo:Y (Y may be null or int)
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

# Build reverse map: who evolves into me?
preEvo = {}
for mid, info in mons.items():
    if info["evolveTo"] is not None:
        preEvo[info["evolveTo"]] = mid

# A mon is a final-stage iff evolveTo is None.
# A family = a final-stage. Walk pre-evolution chain to gather member ids.
# A standalone = a final-stage with NO pre-evolution.
def family_chain(final_id):
    chain = [final_id]
    cur = final_id
    while cur in preEvo:
        cur = preEvo[cur]
        chain.append(cur)
    return list(reversed(chain))

# Target combos
targets = [
    ("Fairy/Psychic", ("Fairy", "Psychic")),
    ("Dragon/Fire", ("Dragon", "Fire")),
    ("Dragon/Psychic", ("Dragon", "Psychic")),
    ("mono Normal", ("Normal",)),
]

print(f"Parsed {len(mons)} mons from data.js\n")
print("Cap for flagship: 4 families + 2 standalones = 6 entries\n")
print("=" * 72)

for label, combo in targets:
    finals_in_combo = [mid for mid, info in mons.items()
                       if info["types"] == combo and info["evolveTo"] is None]
    finals_in_combo.sort()
    families = []
    standalones = []
    for fid in finals_in_combo:
        chain = family_chain(fid)
        # check all members of the chain share the same typing
        same_combo_chain = all(mons[m]["types"] == combo for m in chain)
        if len(chain) == 1:
            standalones.append((fid, mons[fid]["name"], chain, same_combo_chain))
        else:
            families.append((fid, mons[fid]["name"], chain, same_combo_chain))

    print(f"\n## {label}  ({len(families)} families + {len(standalones)} standalones = {len(families)+len(standalones)} entries)")
    if families:
        print(f"  Families (final-stage anchor):")
        for fid, name, chain, pure in families:
            chain_str = " → ".join(f"#{m} {mons[m]['name']}" for m in chain)
            mark = "" if pure else "  [mixed-typing chain]"
            print(f"    {chain_str}{mark}")
    if standalones:
        print(f"  Standalones:")
        for fid, name, chain, pure in standalones:
            print(f"    #{fid} {name}")
    if not families and not standalones:
        print("  (none)")
