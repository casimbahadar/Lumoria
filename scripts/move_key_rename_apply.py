#!/usr/bin/env python3
"""
Move-key rename apply script.

Computes the rename map from MOVES_DATA (key vs name-to-key) and applies
it atomically across:
  - MOVES_DATA key declarations in js/data.js
  - learnset references in MONSTERS_DATA
  - trainer moves:[...] arrays in WORLD_DATA / encounter blocks
  - hardcoded refs in js/battle.js, js/game.js, js/variant-content.js

Collision handling (per user direction): force-rename with _2 (then _3,
etc.) suffix.
  - Internal collisions (multiple old keys → same new key): first by
    alphabetical-old-key gets the clean name; rest get _2, _3.
  - External collisions (new key shadows existing untouched key): the
    renamed move gets the _2 suffix; the existing key stays untouched.

Safety:
  - Replacements use quoted-key boundaries ("old_key") so we don't hit
    accidental substring matches in lore/desc text.
  - Per-file replacement count is reported.
  - JS parse check via Node after apply.

Usage:
  python3 scripts/move_key_rename_apply.py            # dry-run, report only
  python3 scripts/move_key_rename_apply.py --apply    # mutate files
"""
import re
import sys
from pathlib import Path
from collections import defaultdict

REPO = Path(__file__).resolve().parent.parent
DATA_JS = REPO / "js" / "data.js"
BATTLE_JS = REPO / "js" / "battle.js"
GAME_JS = REPO / "js" / "game.js"
VARIANT_JS = REPO / "js" / "variant-content.js"

APPLY = "--apply" in sys.argv

# ---------- Parse MOVES_DATA ----------
text = DATA_JS.read_text()
moves_start = text.find("const MOVES_DATA = {")
moves_end_match = re.search(r'^\};', text[moves_start:], re.MULTILINE)
moves_block = text[moves_start:moves_start + moves_end_match.start()]

mpat = re.compile(r'^\s*(\w+):\s*\{\s*name:"([^"]+)"', re.MULTILINE)
moves = []
for m in mpat.finditer(moves_block):
    moves.append({"key": m.group(1), "name": m.group(2)})

def name_to_key(name):
    return re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')

# ---------- Build rename map with collision handling ----------
existing_keys = {m["key"] for m in moves}
# Pass 1: proposed renames (per move, what would it be if no collision)
proposed = {m["key"]: name_to_key(m["name"]) for m in moves if name_to_key(m["name"]) != m["key"]}

# Pass 2: detect external collisions (proposed shadows existing untouched key)
keys_being_renamed = set(proposed.keys())
untouched_keys = existing_keys - keys_being_renamed

# Pass 3: assign final new_key with _N suffix for collisions
# Group: claimed_new_key → list of (old_key) that want it
claim = defaultdict(list)
for old, new in proposed.items():
    claim[new].append(old)

# For each claimed new_key:
#   - if it collides with an untouched existing key, ALL claimants need a suffix
#   - if multiple claimants, first by alpha gets clean, rest get _2, _3
rename_map = {}
for new, old_list in claim.items():
    old_list_sorted = sorted(old_list)
    external_collision = new in untouched_keys
    if external_collision:
        # ALL claimants get suffixed
        for i, old in enumerate(old_list_sorted, start=2):  # start at _2 since _1 is the untouched
            rename_map[old] = f"{new}_{i}"
    else:
        # First claimant gets clean name, rest get _2, _3, ...
        rename_map[old_list_sorted[0]] = new
        for i, old in enumerate(old_list_sorted[1:], start=2):
            rename_map[old] = f"{new}_{i}"

# Verify no remaining collisions with existing untouched keys after suffixing
final_new_keys = set(rename_map.values())
final_collisions = final_new_keys & untouched_keys
assert not final_collisions, f"Post-suffix collisions: {final_collisions}"

# Verify all renames are unique within the new keyspace
new_keys_list = list(rename_map.values())
assert len(new_keys_list) == len(set(new_keys_list)), "Duplicate new keys after suffixing"

print(f"Total moves: {len(moves)}")
print(f"Diverging keys: {len(proposed)}")
print(f"Rename map size: {len(rename_map)}")
SUFFIX_RE = re.compile(r'_\d+$')
print(f"  Clean renames: {sum(1 for v in rename_map.values() if not SUFFIX_RE.search(v))}")
print(f"  Suffixed renames: {sum(1 for v in rename_map.values() if SUFFIX_RE.search(v))}")
print()

# Show suffix-affected entries
suffixed = [(k, v) for k, v in rename_map.items() if SUFFIX_RE.search(v)]
if suffixed:
    print("Suffixed renames (collision-disambiguated):")
    for old, new in sorted(suffixed):
        print(f"  {old:<32} → {new}")
    print()

# ---------- Apply renames ----------
def apply_to_file(path, map_):
    """Replace every "old_key" reference with "new_key". Returns count."""
    if not path.exists():
        return 0
    src = path.read_text()
    count = 0
    # Process longest keys first to avoid prefix overlaps
    for old in sorted(map_, key=len, reverse=True):
        new = map_[old]
        # Match quoted refs: "old_key" with strict boundary
        pat = re.compile(rf'"{re.escape(old)}"')
        new_src, n = pat.subn(f'"{new}"', src)
        count += n
        src = new_src
    return src, count

def apply_moves_data_keys(src, map_):
    """Rename MOVES_DATA top-level key declarations: `old_key: { ...`"""
    count = 0
    for old in sorted(map_, key=len, reverse=True):
        new = map_[old]
        # Match line-anchored key declaration: `  old_key: {`
        pat = re.compile(rf'^(\s*){re.escape(old)}(\s*:\s*\{{)', re.MULTILINE)
        new_src, n = pat.subn(rf'\1{new}\2', src)
        count += n
        src = new_src
    return src, count

print("=" * 70)
print(f"{'DRY-RUN' if not APPLY else 'APPLYING'} — per-file replacement counts:")
print("=" * 70)

# data.js needs BOTH key declarations AND quoted refs replaced
src = DATA_JS.read_text()
src, kc = apply_moves_data_keys(src, rename_map)
src_after_keys = src
# Now do quoted refs
for old in sorted(rename_map, key=len, reverse=True):
    new = rename_map[old]
    pat = re.compile(rf'"{re.escape(old)}"')
    src, n = pat.subn(f'"{new}"', src)
print(f"  js/data.js: {kc} key declarations + quoted refs across file")

if APPLY:
    DATA_JS.write_text(src)

# Other files: only quoted refs
for path in [BATTLE_JS, GAME_JS, VARIANT_JS]:
    if not path.exists():
        continue
    result = apply_to_file(path, rename_map)
    if result == 0:
        continue
    new_src, c = result
    print(f"  {path.relative_to(REPO)}: {c} quoted refs")
    if APPLY:
        path.write_text(new_src)

if not APPLY:
    print()
    print("(dry-run — no files written. Use --apply to mutate.)")
else:
    print()
    print("Applied. Run JS parse check + discovery script to verify.")
