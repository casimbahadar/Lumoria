#!/usr/bin/env python3
"""Read-only: for every over-cap type combo, list each member family/standalone
with a one-line archetype summary extracted from the final-stage's lore.
Filter members to pre-Forgotten (id < 408), but still show Forgotten count
per combo so the user knows what's in the cap budget."""

import re
from collections import defaultdict

DATA_JS = "/home/user/Lumoria/js/data.js"
FORGOTTEN_START = 408

with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

# Two-pass parse: first grab basic mon fields, then enrich with lore OR desc.
mons = {}
basic_pat = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)".*?types:\[([^\]]+)\].*?evolveTo:\s*(\d+|null)',
    re.MULTILINE | re.DOTALL,
)
for m in basic_pat.finditer(content):
    mid = int(m.group(2))
    types = tuple(sorted(t.strip().strip('"') for t in m.group(4).split(",")))
    evolve = m.group(5)
    mons[mid] = {
        "id": mid,
        "name": m.group(3),
        "types": types,
        "evolveTo": None if evolve == "null" else int(evolve),
        "lore": "",
    }

# Enrich with lore (preferred) or desc (fallback). Use entry-start anchors
# to bound each mon's text, then search within for lore/desc.
starts = []
for m in re.finditer(r'^\s*(\d+):\s*\{\s*id:(\d+),', content, re.MULTILINE):
    starts.append((int(m.group(2)), m.start()))
starts.append((None, len(content)))
for i in range(len(starts) - 1):
    mid, off = starts[i]
    end = starts[i + 1][1]
    if mid not in mons:
        continue
    body = content[off:end]
    lore_m = re.search(r'lore:"([^"]*)"', body)
    desc_m = re.search(r'desc:"([^"]*)"', body)
    mons[mid]["lore"] = (lore_m.group(1) if lore_m else (desc_m.group(1) if desc_m else ""))

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

# Tally
combos = defaultdict(lambda: {"families": [], "standalones": []})
for mid, info in mons.items():
    if info["evolveTo"] is not None:
        continue
    combo = info["types"]
    chain = family_chain(mid)
    entry = {"final_id": mid, "name": info["name"], "chain": chain}
    if len(chain) == 1:
        combos[combo]["standalones"].append(entry)
    else:
        combos[combo]["families"].append(entry)

ORDINARY_F, ORDINARY_S = 2, 1
FLAGSHIP_F, FLAGSHIP_S = 4, 2

def combo_label(combo):
    if len(combo) == 1:
        return f"mono {combo[0]}"
    return "/".join(combo)

def excess(data, cap_f, cap_s):
    f = len(data["families"])
    s = len(data["standalones"])
    return max(0, f - cap_f) + max(0, s - cap_s)

def archetype_oneline(lore, name):
    """Extract a short archetype phrase from lore: first sentence trimmed to ~100 chars,
    with the name stripped from the start if present."""
    if not lore:
        return "(no lore)"
    # First sentence (split on period+space)
    first = re.split(r'\.\s', lore, maxsplit=1)[0]
    # Drop leading name "X is a ..." → "a ..."
    first = re.sub(rf'^{re.escape(name)}\s+is\s+(?:an?\s+|the\s+)?', '', first)
    first = re.sub(rf'^{re.escape(name)}\s+', '', first)
    # Trim length
    if len(first) > 110:
        first = first[:107] + "..."
    return first.strip()

violations = []
for combo, data in combos.items():
    over_ord = excess(data, ORDINARY_F, ORDINARY_S)
    if over_ord > 0:
        over_flag = excess(data, FLAGSHIP_F, FLAGSHIP_S)
        violations.append((combo, data, over_ord, over_flag))
violations.sort(key=lambda v: (-v[2], combo_label(v[0])))

print("PRE-FORGOTTEN ARCHETYPE SUMMARY (id < 408) — over-cap combos\n")
print("Cap: ordinary 2F+1S=3 | flagship 4F+2S=6\n")
print("Forgotten members (id≥408) listed by count only; pre-Forgotten by name+archetype.")
print("=" * 80)

for combo, data, over_ord, over_flag in violations:
    pre_fams = [e for e in data["families"] if e["final_id"] < FORGOTTEN_START]
    fg_fams = [e for e in data["families"] if e["final_id"] >= FORGOTTEN_START]
    pre_solos = [e for e in data["standalones"] if e["final_id"] < FORGOTTEN_START]
    fg_solos = [e for e in data["standalones"] if e["final_id"] >= FORGOTTEN_START]

    total_f = len(data["families"])
    total_s = len(data["standalones"])

    print(f"\n## {combo_label(combo)}  ({total_f}F+{total_s}S = {total_f+total_s} total | over ord {over_ord}, over flag {over_flag})")
    if fg_fams or fg_solos:
        print(f"   [Forgotten in bin: {len(fg_fams)}F+{len(fg_solos)}S]")

    if pre_fams:
        print("   Pre-Forgotten families:")
        for e in pre_fams:
            final = mons[e["final_id"]]
            chain_str = " → ".join(f"#{m} {mons[m]['name']}" for m in e["chain"])
            arch = archetype_oneline(final["lore"], final["name"])
            print(f"     {chain_str}")
            print(f"       └ {arch}")
    if pre_solos:
        print("   Pre-Forgotten standalones:")
        for e in pre_solos:
            final = mons[e["final_id"]]
            arch = archetype_oneline(final["lore"], final["name"])
            print(f"     #{e['final_id']} {final['name']}")
            print(f"       └ {arch}")
    if not pre_fams and not pre_solos:
        print("   (no pre-Forgotten members — combo composed entirely of Forgotten)")
