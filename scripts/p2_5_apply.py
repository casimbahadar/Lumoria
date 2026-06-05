#!/usr/bin/env python3
"""
P2-5 bulk apply: for each deficit-1 Lumori (excluding Stellar/Primal
which are deferred), insert ONE thematic STAB move into the learnset.

Reads the stab_completeness flag list, then for each (Lumori, type)
pair adds a basic-tier move of that type at the next free level slot,
provided the Lumori doesn't already have it.

Uses an in-memory dict of "go-to basic" STAB moves per type, varied so
nearby Lumori don't all get the same move.
"""
import re
import sys
from pathlib import Path
from collections import defaultdict

DATA_JS = Path(__file__).resolve().parent.parent / "js" / "data.js"
APPLY = "--apply" in sys.argv

# Deferred (Stellar/Primal/Aether/Chrono — rare/legendary typings, revisit later)
DEFER_TYPES = {"Stellar", "Primal", "Aether", "Chrono"}

text = DATA_JS.read_text()

# Parse MOVES_DATA to get type per key
mblock_end = re.search(r'^\};', text[text.find('const MOVES_DATA'):], re.MULTILINE).start() + text.find('const MOVES_DATA')
mblock = text[text.find('const MOVES_DATA'):mblock_end]
mtype = {}
for m in re.finditer(r'^\s*(\w+):\s*\{\s*name:"[^"]+",\s*type:"(\w+)"', mblock, re.MULTILINE):
    mtype[m.group(1)] = m.group(2)

# Per-type basic-tier (40-70 power) move pool, ordered by preference (variety)
def basic_pool(typ):
    """Return move keys of given type with power 40-70 (basic-tier)."""
    full = []
    for m in re.finditer(r'^\s*(\w+):\s*\{([^}]*)\}', mblock, re.MULTILINE):
        key, body = m.group(1), m.group(2)
        t_m = re.search(r'type:"(\w+)"', body)
        p_m = re.search(r'power:(\d+)', body)
        if not t_m or t_m.group(1) != typ or not p_m:
            continue
        p = int(p_m.group(1))
        if 40 <= p <= 75:
            full.append((key, p))
    full.sort(key=lambda x: x[1])
    return [k for k, _ in full]

type_pools = {t: basic_pool(t) for t in set(mtype.values())}

# Round-robin counter per type to spread the picks across Lumori
type_idx = defaultdict(int)

# Parse MONSTERS_DATA to find Lumori blocks
mons_start = text.find("const MONSTERS_DATA = {")
mons_text = text[mons_start:]

# Find every Lumori block's position
id_positions = []
for m in re.finditer(r'^\s*(\d+):\s*\{\s*id:(\d+),', mons_text, re.MULTILINE):
    id_positions.append((int(m.group(2)), m.start()))

mons = {}
for i, (mid, pos) in enumerate(id_positions):
    next_pos = id_positions[i+1][1] if i+1 < len(id_positions) else len(mons_text)
    block = mons_text[pos:next_pos]
    types_m = re.search(r'types:\[([^\]]+)\]', block)
    types = [t.strip().strip('"') for t in types_m.group(1).split(",")] if types_m else []
    ls_match = re.search(r'learnset:\s*\[', block)
    move_keys = []
    if ls_match:
        start = ls_match.end()
        depth = 1
        j = start
        while j < len(block) and depth:
            if block[j] == '[': depth += 1
            elif block[j] == ']': depth -= 1
            j += 1
        learnset_str = block[start:j-1]
        move_keys = re.findall(r'"([a-z][a-z0-9_]*)"', learnset_str)
    mons[mid] = {"types": types, "move_keys": move_keys, "block_abs_start": mons_start + pos, "block_abs_end": mons_start + (id_positions[i+1][1] if i+1 < len(id_positions) else len(mons_text))}

# Stage inference
evolves_into = set()
for m in re.finditer(r'evolveTo:\s*(\d+)', mons_text):
    evolves_into.add(int(m.group(1)))
for mid, info in mons.items():
    block_text = mons_text[id_positions[[i for i,p in enumerate(id_positions) if p[0]==mid][0]][1]:]
    block_text = block_text[:200]  # head only
    ev = re.search(r'evolveTo:\s*(\d+|null)', block_text)
    is_final = ev and ev.group(1) == "null"
    is_base = mid not in evolves_into
    info["stage"] = "standalone" if (is_base and is_final) else ("final" if is_final else ("base" if is_base else "mid"))
    rar = re.search(r'rarity:"(\w+)"', mons_text[id_positions[[i for i,p in enumerate(id_positions) if p[0]==mid][0]][1]:][:400])
    info["rarity"] = rar.group(1) if rar else None

def threshold(stage, rarity, is_mono):
    base_map_mono = {"base": 5, "mid": 6, "final": 7, "standalone": 7}
    base_map_dual = {"base": 3, "mid": 4, "final": 4, "standalone": 4}
    table = base_map_mono if is_mono else base_map_dual
    val = table.get(stage, 4 if is_mono else 3)
    if rarity in ("legendary", "exclusive"):
        val = 8 if is_mono else 5
    return val

# Find deficit-1 cases excluding deferred types and Forgotten (id>=462)
FORGOTTEN_START = 462
to_fix = []
for mid, info in mons.items():
    if mid >= FORGOTTEN_START:
        continue
    if not info["types"]:
        continue
    is_mono = len(info["types"]) == 1
    th = threshold(info["stage"], info["rarity"], is_mono)
    for t in info["types"]:
        if t in DEFER_TYPES:
            continue
        # count STAB
        stab = sum(1 for k in info["move_keys"] if mtype.get(k) == t)
        if stab < th:  # any deficit
            for _ in range(th - stab):
                to_fix.append((mid, t))

print(f"Deficit-1 fix targets (excluding deferred types): {len(to_fix)}")

# Pick a move for each: type pool, skip if already in Lumori's learnset, round-robin
fix_plan = []  # list of (mid, type, move_key)
for mid, t in to_fix:
    pool = type_pools.get(t, [])
    chosen = None
    for _ in range(len(pool)):
        idx = type_idx[t] % len(pool)
        candidate = pool[idx]
        type_idx[t] += 1
        if candidate not in mons[mid]["move_keys"]:
            chosen = candidate
            break
    if chosen:
        fix_plan.append((mid, t, chosen))

print(f"Picks made: {len(fix_plan)}")

# Show plan
from collections import Counter
type_counts = Counter(t for _, t, _ in fix_plan)
print(f"By type:")
for t, n in sorted(type_counts.items(), key=lambda x: -x[1]):
    print(f"  {t}: {n}")

if not APPLY:
    print("\n(dry-run; use --apply to mutate data.js)")
    print("\nFirst 10 picks:")
    for mid, t, k in fix_plan[:10]:
        print(f"  #{mid:<4} ({t}): add '{k}'")
    sys.exit(0)

# Apply: edit each Lumori's learnset in data.js
# Strategy: for each (mid, t, k), find the Lumori's learnset[...] in text,
# parse existing entries, find a free level slot near the top, insert [N,"k"]
# at a sensible position, write back the modified text.

# Easier: just append [N,"k"] at the END of the learnset's [...]
# (the codebase already has out-of-order entries, so this is fine)

# Strategy: regex-find each Lumori block's `learnset:[...]` and append before the closing `]`

# Group fixes by mid (so we apply all of a Lumori's fixes at once)
fixes_by_mid = defaultdict(list)
for mid, t, k in fix_plan:
    fixes_by_mid[mid].append((t, k))

# For each Lumori, find its learnset in text and append the moves
new_text = text
edits = 0
for mid, ts_ks in fixes_by_mid.items():
    # find the Lumori block in new_text
    # Anchor to: `\n  {mid}: { id:{mid},`
    pat = re.compile(rf'\n  {mid}:\s*\{{\s*id:{mid},')
    m_block = pat.search(new_text)
    if not m_block:
        print(f"  WARN: #{mid} not found")
        continue
    # Find learnset:[ within next 3000 chars
    region = new_text[m_block.start():m_block.start()+3000]
    ls_m = re.search(r'learnset:\s*\[', region)
    if not ls_m:
        print(f"  WARN: #{mid} no learnset")
        continue
    start_abs = m_block.start() + ls_m.end()
    # Find matching closing ]
    depth = 1
    j = start_abs
    while j < len(new_text) and depth:
        if new_text[j] == '[': depth += 1
        elif new_text[j] == ']': depth -= 1
        j += 1
    end_abs = j - 1  # position of closing ]

    # Determine the level: append at max-existing-level + 2 (or 80 cap)
    learnset_str = new_text[start_abs:end_abs]
    levels = [int(x) for x in re.findall(r'\[(\d+),', learnset_str)]
    next_level = max(levels) + 2 if levels else 30
    if next_level > 90:
        next_level = 90

    # Build new entries to append
    new_entries = []
    for t, k in ts_ks:
        # ensure not already in learnset
        if k in learnset_str:
            continue
        new_entries.append(f',[{next_level},"{k}"]')
        next_level += 1

    if new_entries:
        new_text = new_text[:end_abs] + ''.join(new_entries) + new_text[end_abs:]
        edits += len(new_entries)

print(f"Edits applied: {edits}")

if APPLY:
    DATA_JS.write_text(new_text)
    print("Written.")
