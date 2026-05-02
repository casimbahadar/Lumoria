#!/usr/bin/env python3
"""Dump structured info for candidate mons: name, emoji, types, evo chain, lore, flag reason."""

import re
import sys

DATA_JS = "/home/user/Lumoria/js/data.js"

with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

mon_block_re = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)",\s*emoji:"([^"]*)",\s*types:\[([^\]]+)\],(.*?)(?=^\s*\d+:\s*\{|\Z)',
    re.MULTILINE | re.DOTALL,
)

mons = {}
for m in mon_block_re.finditer(content):
    mid = int(m.group(2))
    name = m.group(3)
    emoji = m.group(4)
    types = [t.strip().strip('"') for t in m.group(5).split(",")]
    body = m.group(6)
    evolve_to_m = re.search(r'evolveTo:\s*(\d+|null)', body)
    evolve_to = None
    if evolve_to_m and evolve_to_m.group(1) != "null":
        evolve_to = int(evolve_to_m.group(1))
    desc_m = re.search(r'desc:"((?:[^"\\]|\\.)*)"', body)
    lore_m = re.search(r'lore:"((?:[^"\\]|\\.)*)"', body)
    mons[mid] = {
        "id": mid,
        "name": name,
        "emoji": emoji,
        "types": types,
        "evolveTo": evolve_to,
        "desc": desc_m.group(1) if desc_m else "",
        "lore": lore_m.group(1) if lore_m else "",
    }

# build pre-evo map
pre = {}
for mid, mon in mons.items():
    if mon["evolveTo"]:
        pre.setdefault(mon["evolveTo"], []).append(mid)

def chain(mid):
    """Walk back to root, then forward through this mon."""
    # find root
    cur = mid
    visited = {cur}
    while True:
        parents = pre.get(cur, [])
        if not parents:
            break
        cur = parents[0]
        if cur in visited:
            break
        visited.add(cur)
    # walk forward
    chain_ids = [cur]
    while mons.get(chain_ids[-1], {}).get("evolveTo"):
        nxt = mons[chain_ids[-1]]["evolveTo"]
        if nxt in chain_ids:
            break
        chain_ids.append(nxt)
    return chain_ids

def stage_label(mid):
    c = chain(mid)
    if len(c) == 1:
        return "Standalone"
    idx = c.index(mid)
    if idx == 0:
        return "Base stage"
    elif idx == len(c) - 1:
        return "Final stage"
    else:
        return f"Mid stage ({idx+1}/{len(c)})"

ids = [int(x) for x in sys.argv[1:]]
for mid in ids:
    if mid not in mons:
        print(f"#{mid}: NOT FOUND")
        continue
    m = mons[mid]
    c = chain(mid)
    chain_str = " → ".join(mons[i]["name"] for i in c) if len(c) > 1 else m["name"]
    print(f"=== #{mid} {m['name']} {m['emoji']} {'/'.join(m['types'])} ===")
    print(f"  Stage: {stage_label(mid)} ({chain_str})")
    print(f"  Lore: {m['lore'] or '(none)'}")
    print(f"  Desc: {m['desc']}")
    print()
