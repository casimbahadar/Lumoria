#!/usr/bin/env python3
"""
Lumoria Option C Name Conflict Resolution Script
Reads data.js, identifies all mons needing rename, proposes new names, checks conflicts.
Does NOT modify data.js.
"""

import re
import sys

# ──────────────────────────────────────────────
# 1. Parse data.js
# ──────────────────────────────────────────────
DATA_JS = "/home/user/Lumoria/js/data.js"

mons = {}  # id -> {"id": int, "name": str, "types": list[str]}

with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

# Match lines like:  NNN: { id:NNN, name:"Name", emoji:"...", types:["T1","T2"],
pattern = re.compile(
    r'^\s*(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)",.*?types:\[([^\]]+)\]',
    re.MULTILINE,
)
for m in pattern.finditer(content):
    mid = int(m.group(2))
    name = m.group(3)
    raw_types = m.group(4)
    types = [t.strip().strip('"') for t in raw_types.split(",")]
    mons[mid] = {"id": mid, "name": name, "types": types}

print(f"Parsed {len(mons)} monsters from data.js\n")

# Build name→id lookup
name_to_id = {v["name"]: k for k, v in mons.items()}

# ──────────────────────────────────────────────
# 2. Identify group members
# ──────────────────────────────────────────────

def ends_with(name, suffix):
    return name.lower().endswith(suffix.lower())

def starts_with(name, prefix):
    return name.lower().startswith(prefix.lower())

def get_group(suffix=None, prefix=None):
    """Return sorted list of (id, name) matching suffix or prefix."""
    result = []
    for mid, mon in mons.items():
        n = mon["name"]
        if suffix and ends_with(n, suffix):
            result.append((mid, n))
        elif prefix and starts_with(n, prefix):
            result.append((mid, n))
    result.sort()
    return result

# ──────────────────────────────────────────────
# 3. Determine which mons to rename per group
# ──────────────────────────────────────────────

# We'll collect: rename_ids = set of ids that must be renamed
# with reason
rename_reasons = {}  # id -> reason string

def mark_rename(mid, reason):
    if mid not in rename_reasons:
        rename_reasons[mid] = reason
    else:
        rename_reasons[mid] += "; " + reason

def cap_group_by_keep(group, keep_ids, group_name):
    """Mark all in group NOT in keep_ids for rename."""
    keep_set = set(keep_ids)
    for mid, name in group:
        if mid not in keep_set:
            mark_rename(mid, f"overused {group_name} group (cap 5, not in keep list)")

# ─── -vast ───
vast_group = get_group(suffix="vast")
vast_keep = {97, 148, 184, 282, 52}
cap_group_by_keep(vast_group, vast_keep, "-vast")
print(f"-vast group ({len(vast_group)}): {[n for _,n in vast_group]}")

# ─── -rix ───
rix_group = get_group(suffix="rix")
rix_keep = {84, 92, 205, 30, 128}
cap_group_by_keep(rix_group, rix_keep, "-rix")
print(f"-rix group ({len(rix_group)}): {[n for _,n in rix_group]}")

# ─── -kin ───
kin_group = get_group(suffix="kin")
kin_keep = {1, 7, 95, 118, 147}
cap_group_by_keep(kin_group, kin_keep, "-kin")
print(f"-kin group ({len(kin_group)}): {[n for _,n in kin_group]}")

# ─── -ling and -ing ───
# All -ling (suffix "ling")
ling_group = [(mid, mon["name"]) for mid, mon in sorted(mons.items()) if ends_with(mon["name"], "ling")]
ing_group  = [(mid, mon["name"]) for mid, mon in sorted(mons.items()) if ends_with(mon["name"], "ing") and not ends_with(mon["name"], "ling")]

ling_group.sort(); ing_group.sort()

# keep lowest 5 of each
ling_keep = {mid for mid, _ in ling_group[:5]}
ing_keep   = {mid for mid, _ in ing_group[:5]}

cap_group_by_keep(ling_group, ling_keep, "-ling")
cap_group_by_keep(ing_group,  ing_keep,  "-ing")
print(f"-ling group ({len(ling_group)}): {[n for _,n in ling_group]}")
print(f"-ing group ({len(ing_group)}): {[n for _,n in ing_group]}")

# ─── -lith ───
lith_group = get_group(suffix="lith")
lith_keep = {154, 250, 195, 388, 361}
cap_group_by_keep(lith_group, lith_keep, "-lith")
print(f"-lith group ({len(lith_group)}): {[n for _,n in lith_group]}")

# ─── plain -ith (not -lith, not -rith, not -quith — but actually all -ith not in -lith) ───
# The rule says: for plain -ith endings NOT already in -lith: keep 5, rename rest
# So we want names ending in "ith" but NOT "lith"
ith_group = [(mid, mon["name"]) for mid, mon in sorted(mons.items())
             if ends_with(mon["name"], "ith") and not ends_with(mon["name"], "lith")]
ith_group.sort()
# keep lowest-id 5
ith_keep = {mid for mid, _ in ith_group[:5]}
cap_group_by_keep(ith_group, ith_keep, "-ith (non-lith)")
print(f"-ith (non-lith) group ({len(ith_group)}): {[n for _,n in ith_group]}")

# ─── void- prefix ───
void_group = get_group(prefix="void")
void_keep = {345, 352, 398, 373}
cap_group_by_keep(void_group, void_keep, "void-")
print(f"void- group ({len(void_group)}): {[n for _,n in void_group]}")

# ─── -veil ───
veil_group = get_group(suffix="veil")
veil_keep = {221, 301}
cap_group_by_keep(veil_group, veil_keep, "-veil")
print(f"-veil group ({len(veil_group)}): {[n for _,n in veil_group]}")

# ─── -crown ───
crown_group = get_group(suffix="crown")
crown_keep = {398, 384}
cap_group_by_keep(crown_group, crown_keep, "-crown")
print(f"-crown group ({len(crown_group)}): {[n for _,n in crown_group]}")

# ─── shadow- prefix ───
shadow_group = get_group(prefix="shadow")
shadow_keep = {221, 343}
cap_group_by_keep(shadow_group, shadow_keep, "shadow-")
print(f"shadow- group ({len(shadow_group)}): {[n for _,n in shadow_group]}")

# ─── -veth ───
veth_group = get_group(suffix="veth")
veth_keep = {mid for mid, _ in sorted(veth_group)[:5]}
cap_group_by_keep(veth_group, veth_keep, "-veth")
print(f"-veth group ({len(veth_group)}): {[n for _,n in veth_group]}")

# ─── plain -eth (not -veth) ───
eth_group = [(mid, mon["name"]) for mid, mon in sorted(mons.items())
             if ends_with(mon["name"], "eth") and not ends_with(mon["name"], "veth")]
eth_group.sort()
eth_keep = {mid for mid, _ in eth_group[:5]}
cap_group_by_keep(eth_group, eth_keep, "-eth (non-veth)")
print(f"-eth (non-veth) group ({len(eth_group)}): {[n for _,n in eth_group]}")

# ─── -oth ───
oth_group = [(mid, mon["name"]) for mid, mon in sorted(mons.items())
             if ends_with(mon["name"], "oth") and not ends_with(mon["name"], "loth")
             and not ends_with(mon["name"], "roth") and not ends_with(mon["name"], "moth")]
# Actually the rule just says "-oth" ends with "oth" — keep simple
oth_group_full = [(mid, mon["name"]) for mid, mon in sorted(mons.items())
                  if ends_with(mon["name"], "oth")]
oth_group_full.sort()
oth_keep = {mid for mid, _ in oth_group_full[:5]}
cap_group_by_keep(oth_group_full, oth_keep, "-oth")
print(f"-oth group ({len(oth_group_full)}): {[n for _,n in oth_group_full]}")

# ─── -wing ───
wing_group = get_group(suffix="wing")
wing_keep = {mid for mid, _ in sorted(wing_group)[:5]}
cap_group_by_keep(wing_group, wing_keep, "-wing")
print(f"-wing group ({len(wing_group)}): {[n for _,n in wing_group]}")

# ─── -axis ───
axis_group = get_group(suffix="axis")
axis_keep = {mid for mid, _ in sorted(axis_group)[:5]}
cap_group_by_keep(axis_group, axis_keep, "-axis")
print(f"-axis group ({len(axis_group)}): {[n for _,n in axis_group]}")

# ─── -horn / -vorn / -orn ───
horn_group = get_group(suffix="horn")
vorn_group = get_group(suffix="vorn")
orn_group  = [(mid, mon["name"]) for mid, mon in sorted(mons.items())
              if ends_with(mon["name"], "orn")
              and not ends_with(mon["name"], "horn")
              and not ends_with(mon["name"], "vorn")]
horn_group.sort(); vorn_group.sort(); orn_group.sort()

horn_keep = {mid for mid, _ in horn_group[:5]}
vorn_keep = {mid for mid, _ in vorn_group[:3]}
orn_keep  = {mid for mid, _ in orn_group[:2]}

cap_group_by_keep(horn_group, horn_keep, "-horn")
cap_group_by_keep(vorn_group, vorn_keep, "-vorn")
cap_group_by_keep(orn_group,  orn_keep,  "-orn (other)")
print(f"-horn group ({len(horn_group)}): {[n for _,n in horn_group]}")
print(f"-vorn group ({len(vorn_group)}): {[n for _,n in vorn_group]}")
print(f"-orn (other) group ({len(orn_group)}): {[n for _,n in orn_group]}")

# ─── -lin ───
lin_group = [(mid, mon["name"]) for mid, mon in sorted(mons.items())
             if ends_with(mon["name"], "lin") and not ends_with(mon["name"], "gling")]
lin_group.sort()
lin_keep = {mid for mid, _ in lin_group[:5]}
cap_group_by_keep(lin_group, lin_keep, "-lin")
print(f"-lin group ({len(lin_group)}): {[n for _,n in lin_group]}")

# ──────────────────────────────────────────────
# 4. Specific near-duplicate fixes
# ──────────────────────────────────────────────
specific_pairs = [
    (272, "exact dupe of #10 Embrix (Embrix)"),
    (229, "too close to #195 Prismolith (Prismolt)"),
    (233, "too close to #173 Serpenthos (Serpenthorn)"),
    (327, "too close to #205 Quarrix (Quarrex)"),
    (371, "too similar to #393 Nullstorm (Nullform)"),
    (266, "shadow- prefix over cap (Shadowpup)"),
]
for mid, reason in specific_pairs:
    if mid in mons:
        mark_rename(mid, reason)
    else:
        print(f"WARNING: specific pair #{mid} not found in data!")

# These are already covered by group rules above:
# 319 Voidraxis → void- group
# 129 Voidaxis  → void- group
# 390 Voidgarden→ void- group
# 407 Voidwarden→ void- group
# 328 Smogveil  → -veil group
# 401 Cosmoveil → -veil group
# 108 Gustkin   → -kin group
# 119 Shadowvast→ -vast + shadow- groups

print(f"\nTotal mons to rename: {len(rename_reasons)}")

# ──────────────────────────────────────────────
# 5. Name generation
# ──────────────────────────────────────────────

TYPE_PREFIXES = {
    "Fire":     ["Ignit", "Pyro", "Blaze", "Flare", "Scorch", "Cinder", "Char"],
    "Water":    ["Aqua", "Tide", "Reef", "Hydro", "Coral", "Marine", "Surge"],
    "Grass":    ["Flora", "Bloom", "Fern", "Leaf", "Verdant", "Root", "Briar"],
    "Electric": ["Volt", "Zap", "Galv", "Bolt", "Amp", "Surge", "Spark"],
    "Ground":   ["Geo", "Terra", "Quake", "Tect", "Dune", "Silt", "Rubble"],
    "Wind":     ["Gale", "Breeze", "Aero", "Zephyr", "Whirl", "Gust"],
    "Ice":      ["Cryo", "Frost", "Glacie", "Polar", "Shiver", "Blizz", "Rime"],
    "Dark":     ["Nox", "Umbra", "Dusk", "Murk", "Grim", "Shade"],
    "Fairy":    ["Fae", "Luna", "Lumi", "Glim", "Aurora", "Aura"],
    "Steel":    ["Ferro", "Alloy", "Iron", "Forge", "Temper"],
    "Poison":   ["Venom", "Toxic", "Acid", "Blight", "Miasm", "Corros"],
    "Psychic":  ["Psy", "Ment", "Cerebr", "Oneiro", "Noetic"],
    "Dragon":   ["Drako", "Wyrm", "Drake", "Serp", "Drak"],
    "Normal":   ["Titan", "Coloss", "Behemo", "Magest"],
    "Rock":     ["Petro", "Litho", "Stone", "Basalt", "Granit"],
    "Bug":      ["Chitin", "Scarab", "Chrysal", "Carap"],
    "Ghost":    ["Wraith", "Specter", "Phantom", "Revenant"],
    "Fighting": ["Pummelo", "Striker", "Brawl", "Clash"],
    "Aether":   ["Aether", "Astral", "Cosm", "Stellar"],
    "Crystal":  ["Cryst", "Prism", "Gem", "Lattice"],
    "Primal":   ["Primal", "Ancient", "Primord"],
}

GOOD_SUFFIXES = [
    "rend", "fang", "golem", "guard", "bolt", "ridge", "peak",
    "spire", "forge", "gale", "maw", "jaw", "pulse", "shock", "flare",
    "burst", "crag", "shroud", "shade", "glow", "flash", "crest",
    "surge", "coil", "drake", "helm", "blade", "talon", "scale", "hide",
    "shell", "plate", "spike", "shard", "cliff",
    "furl", "dread", "bane", "brand", "claw",
    "crush", "stomp", "howl", "roar", "drift",
    "raid", "ward", "mark", "seal", "arc", "grim", "plume",
    "shred", "crux", "plex", "trax", "nex", "vex",
]
# Note: removed "groth" (adds -oth), "thorn" (adds -horn), "stone"/"rock" (generic),
# "tide"/"wave"/"reef" (type-specific), "ravine" (too long for short prefixes)

# Track already-used names (existing + proposed)
used_names = set(name_to_id.keys())
proposed_names = {}  # id -> new_name

def pick_name(mid, types):
    """Generate a unique name for the given mon."""
    primary = types[0]
    secondary = types[1] if len(types) > 1 else None

    prefixes = TYPE_PREFIXES.get(primary, ["Titan"])
    sec_prefixes = TYPE_PREFIXES.get(secondary, []) if secondary else []

    # Try combinations: primary prefix + suffix, then secondary, then combos
    candidates = []
    for pfx in prefixes:
        for sfx in GOOD_SUFFIXES:
            name = pfx.capitalize() + sfx.capitalize()
            if 6 <= len(name) <= 12:
                candidates.append(name)

    # Also try primary + secondary blend
    for pfx in prefixes:
        for spfx in sec_prefixes:
            for sfx in GOOD_SUFFIXES:
                name = pfx.capitalize() + spfx[:3].lower() + sfx.capitalize()
                if 6 <= len(name) <= 12:
                    candidates.append(name)

    # Also try secondary prefix + suffix
    for pfx in sec_prefixes:
        for sfx in GOOD_SUFFIXES:
            name = pfx.capitalize() + sfx.capitalize()
            if 6 <= len(name) <= 12:
                candidates.append(name)

    for name in candidates:
        if name not in used_names:
            return name

    # Fallback: add mon id suffix to ensure uniqueness
    for pfx in prefixes:
        name = pfx.capitalize() + "rend" + str(mid % 100)
        if name not in used_names and 6 <= len(name) <= 12:
            return name

    return f"Mon{mid}Rend"  # last resort

# Generate names in id order
print("\nGenerating new names...\n")
for mid in sorted(rename_reasons.keys()):
    mon = mons[mid]
    new_name = pick_name(mid, mon["types"])
    proposed_names[mid] = new_name
    used_names.add(new_name)  # reserve it immediately

# ──────────────────────────────────────────────
# 6. Conflict check
# ──────────────────────────────────────────────
conflicts = []
seen_proposed = {}
for mid, new_name in proposed_names.items():
    # Check against existing names (excluding the mon being renamed)
    if new_name in name_to_id and name_to_id[new_name] != mid:
        conflicts.append(f"CONFLICT: #{mid} → '{new_name}' already used by #{name_to_id[new_name]}")
    # Check for duplicate proposals
    if new_name in seen_proposed:
        conflicts.append(f"DUPE PROPOSAL: #{mid} and #{seen_proposed[new_name]} both → '{new_name}'")
    seen_proposed[new_name] = mid

# ──────────────────────────────────────────────
# 7. Output rename table
# ──────────────────────────────────────────────
print("=" * 80)
print("LUMORIA OPTION C — RENAME PROPOSALS")
print("=" * 80)
print(f"{'ID':>5}  {'OLD NAME':<22}  {'NEW NAME':<18}  {'TYPES':<25}  REASON")
print("-" * 100)
for mid in sorted(proposed_names.keys()):
    mon = mons[mid]
    new_name = proposed_names[mid]
    types_str = "/".join(mon["types"])
    reason = rename_reasons.get(mid, "")
    print(f"#{mid:>4}  {mon['name']:<22}  {new_name:<18}  {types_str:<25}  {reason}")

print("\n" + "=" * 80)
print(f"Total renames: {len(proposed_names)}")

print("\n─── Python dict (old_name → (id, new_name, types)) ───")
print("{")
for mid in sorted(proposed_names.keys()):
    mon = mons[mid]
    new_name = proposed_names[mid]
    types = mon["types"]
    print(f'    "{mon["name"]}": ({mid}, "{new_name}", {types}),')
print("}")

print("\n─── Conflict Report ───")
if conflicts:
    for c in conflicts:
        print(c)
else:
    print("No conflicts detected.")

# ──────────────────────────────────────────────
# 8. Verification counts
# ──────────────────────────────────────────────
print("\n─── Group verification (post-rename) ───")

# After rename, what names remain in each group?
final_names = {}
for mid, mon in mons.items():
    if mid in proposed_names:
        final_names[mid] = proposed_names[mid]
    else:
        final_names[mid] = mon["name"]

def count_suffix_post(suffix):
    return [(mid, final_names[mid]) for mid in sorted(final_names) if final_names[mid].lower().endswith(suffix.lower())]

def count_prefix_post(prefix):
    return [(mid, final_names[mid]) for mid in sorted(final_names) if final_names[mid].lower().startswith(prefix.lower())]

checks = [
    ("suffix", "vast", 5),
    ("suffix", "rix", 5),
    ("suffix", "kin", 5),
    ("suffix", "ling", 5),
    ("suffix", "lith", 5),
    ("prefix", "void", 4),
    ("suffix", "veil", 2),
    ("suffix", "crown", 2),
    ("prefix", "shadow", 2),
    ("suffix", "veth", 5),
    ("suffix", "oth", 5),
    ("suffix", "wing", 5),
    ("suffix", "axis", 5),
    ("suffix", "horn", 5),
    ("suffix", "vorn", 3),
    ("suffix", "lin", 5),
]
for kind, pat, cap in checks:
    if kind == "suffix":
        remaining = count_suffix_post(pat)
    else:
        remaining = count_prefix_post(pat)
    status = "OK" if len(remaining) <= cap else f"OVER CAP ({len(remaining)} > {cap})"
    print(f"  -{pat}: {len(remaining)} remaining — {status}  [{', '.join(n for _,n in remaining)}]")

# ing (non-ling)
ing_post = [(mid, final_names[mid]) for mid in sorted(final_names)
            if final_names[mid].lower().endswith("ing") and not final_names[mid].lower().endswith("ling")]
status = "OK" if len(ing_post) <= 5 else f"OVER CAP ({len(ing_post)} > 5)"
print(f"  -ing (non-ling): {len(ing_post)} remaining — {status}")

# ith non-lith
ith_post = [(mid, final_names[mid]) for mid in sorted(final_names)
            if final_names[mid].lower().endswith("ith") and not final_names[mid].lower().endswith("lith")]
status = "OK" if len(ith_post) <= 5 else f"OVER CAP ({len(ith_post)} > 5)"
print(f"  -ith (non-lith): {len(ith_post)} remaining — {status}")

# eth non-veth
eth_post = [(mid, final_names[mid]) for mid in sorted(final_names)
            if final_names[mid].lower().endswith("eth") and not final_names[mid].lower().endswith("veth")]
status = "OK" if len(eth_post) <= 5 else f"OVER CAP ({len(eth_post)} > 5)"
print(f"  -eth (non-veth): {len(eth_post)} remaining — {status}")
