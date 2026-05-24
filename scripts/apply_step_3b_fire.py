#!/usr/bin/env python3
"""Step 3b — Fire: modify 8 existing moves, mark 2 existing as exclusive,
add 14 new regular + 3 new exclusive Fire moves."""

import re

DATA = "/home/user/Lumoria/js/data.js"

# Existing-move effect modifications: (move_id, new_effect, new_ec)
# new_effect can be a single tag like "atkup", a combined tag like
# "recharge_and_burnt_out" (multi-effect), or "null" for none.
EXISTING_EFFECT_CHANGES = [
    ("flamethrower",     "atkup",   30),   # Inferno Jet: burn → atkup self
    ("cinderwhirl",      "spedown", 30),   # burn → spedown
    ("sun_burst",        "spaup",   30),   # burn → spaup self
    ("forge_blast",      "atkup",   30),   # burn → atkup self
    ("wildfire_surge",   "spedown", 30),   # burn → spedown
    ("toxic_blaze",      "poison",  30),   # burn → poison (name fit)
    ("caldera_meltdown", "recharge_and_burnt_out", 100),  # burn → recharge+burnt_out
    ("flash_fire",       "spaup",   30),   # null → spaup self
]

# Existing moves to mark as rarity:"exclusive"
MARK_EXCLUSIVE = ["pyre_fang", "wildfire_surge"]

# New Fire regular moves (10 phys + 4 stat)
# (id, name, type, dualType, power, acc, pp, cat, effect, ec, target, extras, desc)
FIRE_REGULAR = [
    # Physical (10)
    ("pyre_strike", "Pyre Strike", "Fire", None, 40, 100, 30, "physical", None, 0, "single",
     {"breakerVs": "Spectral"}, "Funeral-pyre strike that banishes spectral foes; super-effective vs Spectral."),
    ("inferno_charge", "Inferno Charge", "Fire", None, 70, 100, 15, "physical", "speup", 30, "single",
     {}, "Charging fire-rush; may raise own Speed."),
    ("molten_claw", "Molten Claw", "Fire", None, 65, 100, 20, "physical", "burnt_out", 20, "single",
     {}, "Searing claw; may inflict Burnt-out."),
    ("coal_smash", "Coal Smash", "Fire", None, 80, 95, 10, "physical", "strained", 30, "single",
     {}, "Coal-fist slam; may inflict Strained."),
    ("magma_strike", "Magma Strike", "Fire", None, 75, 95, 10, "physical", "burn", 20, "single",
     {}, "Molten body slam; may burn."),
    ("firebrand", "Firebrand", "Fire", None, 90, 100, 10, "physical", None, 0, "single",
     {"alwaysCrit": True}, "Branding-iron strike; always lands a critical hit."),
    ("inferno_chop", "Inferno Chop", "Fire", None, 60, 100, 15, "physical", "burn", 30, "single",
     {}, "Karate-chop wreathed in flame; may burn."),
    ("scorch_kick", "Scorch Kick", "Fire", ["Fire", "Earth"], 95, 85, 10, "physical", "marked", 30, "wide",
     {}, "Earth-scorching kick across all foes; may inflict Marked."),
    ("flare_uppercut", "Flare Uppercut", "Fire", None, 85, 100, 10, "physical", "flinch", 20, "single",
     {}, "Upward flare-uppercut; may flinch."),
    ("lava_drop", "Lava Drop", "Fire", None, 130, 85, 5, "physical", "recharge", 100, "wide",
     {}, "Drops as molten lava across all foes; requires rest."),
    # Status (4)
    ("flame_focus", "Flame Focus", "Fire", None, 0, 100, 15, "status", "focus", 100, "self",
     {}, "Sharpens flame for high critical-hit ratio."),
    ("searing_glare", "Searing Glare", "Fire", None, 0, 100, 15, "status", "spdefdown", 100, "single",
     {}, "Intense gaze lowers foe's SpDef."),
    ("molten_armor", "Molten Armor", "Fire", None, 0, 100, 15, "status", "defup2", 100, "self",
     {}, "Hardens molten skin (+2 Def)."),
    ("kindle", "Kindle", "Fire", None, 0, 100, 10, "status", "atkup", 100, "self",
     {}, "Kindles inner flame (+1 Atk)."),
]

# New Fire exclusive moves (3)
FIRE_EXCLUSIVE = [
    ("solar_zenith", "Solar Zenith", "Fire", ["Fire", "Stellar"], 130, 90, 5, "special", "recharge_and_spatkup_self", 100, "single",
     {"rarity": "exclusive"}, "Signature solar-zenith blast; requires rest but guarantees +1 SpA. Dual Fire+Stellar."),
    ("infernos_grasp", "Inferno's Grasp", "Fire", None, 120, 85, 5, "physical", "burn", 100, "single",
     {"rarity": "exclusive"}, "Guaranteed-burn physical grip — signature legendary move."),
    ("magma_baptism", "Magma Baptism", "Fire", None, 150, 85, 5, "special", "recharge_and_bleed_target", 100, "wide",
     {"rarity": "exclusive"}, "Devastating wide magma wave; inflicts Bleed on all foes and requires rest."),
]

def fmt_move(m):
    mid, name, t, dual, pow, acc, pp, cat, eff, ec, tgt, extras, desc = m
    parts = [f'name:"{name}"', f'type:"{t}"']
    if dual:
        dual_str = ",".join(f'"{x}"' for x in dual)
        parts.append(f'dualType:[{dual_str}]')
    parts.extend([f'power:{pow}', f'acc:{acc}', f'pp:{pp}', f'cat:"{cat}"'])
    eff_s = "null" if eff is None else f'"{eff}"'
    parts.append(f'effect:{eff_s}')
    parts.append(f'ec:{ec}')
    parts.append(f'target:"{tgt}"')
    for k, v in extras.items():
        if isinstance(v, bool):
            parts.append(f'{k}:{"true" if v else "false"}')
        elif isinstance(v, (int, float)):
            parts.append(f'{k}:{v}')
        else:
            parts.append(f'{k}:"{v}"')
    parts.append(f'desc:"{desc}"')
    return f"  {mid+':':<24} {{ " + ", ".join(parts) + " },"

with open(DATA, "r", encoding="utf-8") as f:
    content = f.read()

# === Step 1: Modify existing move effects ===
for move_id, new_eff, new_ec in EXISTING_EFFECT_CHANGES:
    # Match: move_id:    { ... effect:"oldeff" ... ec:N ... }
    # Replace the effect and ec.
    pat = re.compile(
        rf'(\b{re.escape(move_id)}:\s*\{{[^}}]*?effect:")[^"]*("[^}}]*?ec:)\d+',
        re.DOTALL,
    )
    m = pat.search(content)
    if not m:
        print(f"WARN: couldn't find {move_id} for effect change")
        continue
    new_content = pat.sub(rf'\g<1>{new_eff}\g<2>{new_ec}', content, count=1)
    if new_content == content:
        print(f"WARN: no change for {move_id}")
    else:
        content = new_content
        print(f"  Modified {move_id}: effect → {new_eff}, ec → {new_ec}")

# === Step 2: Mark existing moves as exclusive ===
for move_id in MARK_EXCLUSIVE:
    # Find the move definition and add rarity:"exclusive" before the closing }
    pat = re.compile(
        rf'(\b{re.escape(move_id)}:\s*\{{[^}}]*?desc:"[^"]*")\s*\}}',
        re.DOTALL,
    )
    m = pat.search(content)
    if not m:
        print(f"WARN: couldn't find {move_id} for rarity tag")
        continue
    new_content = pat.sub(rf'\g<1>, rarity:"exclusive" }}', content, count=1)
    if new_content == content:
        print(f"WARN: no rarity change for {move_id}")
    else:
        content = new_content
        print(f"  Marked {move_id} as exclusive")

# === Step 3: Insert new regular + exclusive moves at end of MOVES_DATA ===
moves_start = content.index("const MOVES_DATA")
monsters_marker = content.index("// MONSTERS DATA", moves_start)
close_idx = content.rfind("};", moves_start, monsters_marker)

# Ensure trailing comma on last move
i = close_idx - 1
while i > moves_start and content[i] in " \n\r\t":
    i -= 1
if content[i] == "}":
    content = content[:i+1] + "," + content[i+1:]
    close_idx += 1

# Find the existing "// --- Sonic (regular) ---" section to insert Fire after it
sonic_reg_marker = content.find("// --- Sonic (regular) ---", moves_start, close_idx)
# Find end of Sonic regular section — find "// ============" (start of exclusive section)
sonic_excl_marker = content.find("// STEP 3B ADDITIONS — EXCLUSIVE MOVES", sonic_reg_marker)
# Insert Fire regular right before the exclusive section header
# But we need to insert AFTER all Sonic regular moves. Find the line before the // ===
# block that starts the exclusive section.
excl_section_start = content.rfind("\n  // =====", sonic_reg_marker, sonic_excl_marker)

fire_reg_block = "\n  // --- Fire (regular) ---\n"
for m in FIRE_REGULAR:
    fire_reg_block += fmt_move(m) + "\n"

# Insert Fire regular block right before the exclusive section
content = content[:excl_section_start] + fire_reg_block + content[excl_section_start:]

# Now find the // --- Sonic (exclusive) --- section and append Fire exclusive after it
# Find Sonic exclusive section
sonic_excl_section = content.find("// --- Sonic (exclusive) ---", excl_section_start)
# Find the next line that isn't part of Sonic exclusive — i.e. the line right before `};`
# Re-locate closing }; since content has been modified
moves_start = content.index("const MOVES_DATA")
monsters_marker = content.index("// MONSTERS DATA", moves_start)
close_idx = content.rfind("};", moves_start, monsters_marker)

# Insert Fire exclusive block right before `};`
fire_excl_block = "\n  // --- Fire (exclusive) ---\n"
for m in FIRE_EXCLUSIVE:
    fire_excl_block += fmt_move(m) + "\n"

content = content[:close_idx] + fire_excl_block + content[close_idx:]

with open(DATA, "w", encoding="utf-8") as f:
    f.write(content)

print(f"\nApplied: {len(EXISTING_EFFECT_CHANGES)} effect changes, {len(MARK_EXCLUSIVE)} exclusive marks, {len(FIRE_REGULAR)} new regular, {len(FIRE_EXCLUSIVE)} new exclusive.")
