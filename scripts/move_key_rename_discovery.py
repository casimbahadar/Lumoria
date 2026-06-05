#!/usr/bin/env python3
"""
Move-key rename discovery: find all MOVES_DATA keys whose snake_case form
diverges from their display name's snake_case form.

For each diverging move, propose old_key → new_key based on the display name.

Read-only — produces a rename map for review before applying.
"""
import re
from pathlib import Path
from collections import defaultdict

DATA_JS = Path(__file__).resolve().parent.parent / "js" / "data.js"
text = DATA_JS.read_text()

# Parse MOVES_DATA
moves_start = text.find("const MOVES_DATA = {")
moves_end_match = re.search(r'^\};', text[moves_start:], re.MULTILINE)
moves_block = text[moves_start:moves_start + moves_end_match.start()]

mpat = re.compile(r'^\s*(\w+):\s*\{\s*name:"([^"]+)",\s*type:"(\w+)"', re.MULTILINE)
moves = []
for m in mpat.finditer(moves_block):
    moves.append({"key": m.group(1), "name": m.group(2), "type": m.group(3)})

def name_to_key(name):
    """Convert display name to snake_case key form."""
    # Lowercase, replace non-alphanum with _, collapse multiple _, strip _
    s = re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')
    return s

# Find divergences
rename_map = {}
collisions = defaultdict(list)  # if multiple keys map to same proposed name
for m in moves:
    proposed = name_to_key(m["name"])
    if proposed != m["key"]:
        rename_map[m["key"]] = proposed
        collisions[proposed].append(m["key"])

# Identify collisions (different old keys → same proposed new key)
real_collisions = {k: v for k, v in collisions.items() if len(v) > 1}

print(f"Total moves: {len(moves)}")
print(f"Keys diverging from display name: {len(rename_map)} ({len(rename_map)/len(moves)*100:.0f}%)")
print(f"Proposed-key collisions (need manual resolution): {len(real_collisions)}")
print()

# Detect collisions WITH EXISTING KEYS that aren't being renamed
existing_keys = {m["key"] for m in moves}
keys_being_renamed_away = set(rename_map.keys())
proposed_new_keys = set(rename_map.values())
# A proposed new key conflicts if it matches an existing key that isn't being renamed away
external_collisions = proposed_new_keys & (existing_keys - keys_being_renamed_away)

if external_collisions:
    print(f"External collisions (new key would shadow existing untouched key): {len(external_collisions)}")
    for c in sorted(external_collisions):
        from_keys = [k for k, v in rename_map.items() if v == c]
        print(f"  '{c}' (existing) ← would be created by: {', '.join(from_keys)}")
    print()

if real_collisions:
    print("Internal collisions (two old keys propose the same new key):")
    for new, old_list in sorted(real_collisions.items()):
        print(f"  '{new}' ← {', '.join(old_list)}")
    print()

print("=" * 90)
print(f"PROPOSED RENAMES ({len(rename_map)} total)")
print("=" * 90)
by_type = defaultdict(list)
for m in moves:
    if m["key"] in rename_map:
        by_type[m["type"]].append(m)
for typ in sorted(by_type):
    print(f"\n  {typ} ({len(by_type[typ])}):")
    for m in sorted(by_type[typ], key=lambda x: x["key"]):
        new_key = rename_map[m["key"]]
        marker = ""
        if new_key in real_collisions:
            marker = "  ⚠ INTERNAL COLLISION"
        elif new_key in external_collisions:
            marker = "  ⚠ EXTERNAL COLLISION"
        print(f"    {m['key']:<32} → {new_key:<32}  \"{m['name']}\"{marker}")
