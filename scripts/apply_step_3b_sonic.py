#!/usr/bin/env python3
"""Step 3b: apply 24 regular Sonic moves + 2 exclusive Sonic moves to
MOVES_DATA. Sonic is the first new-type batch and creates the
'STEP 3B ADDITIONS' section + 'EXCLUSIVE MOVES' section in MOVES_DATA."""

import re

DATA = "/home/user/Lumoria/js/data.js"

# Move tuple: (id, name, type, dualType, power, acc, pp, cat, effect, ec, target, extra_fields_dict, desc)
# extra_fields_dict can hold: alwaysCrit, breakerVs, rarity, hits
SONIC_REGULAR = [
    # Physical (8)
    ("shake_strike", "Shake Strike", "Sonic", None, 50, 100, 30, "physical", None, 0, "single",
     {"alwaysCrit": True}, "Body-vibration impact; always lands a critical hit."),
    ("echo_strike", "Echo Strike", "Sonic", None, 30, 100, 20, "physical", None, 0, "single",
     {"hits": 2}, "Strikes twice with echoing impact."),
    ("silent_strike", "Silent Strike", "Sonic", None, 70, 100, 15, "physical", "priority", 0, "single",
     {}, "Sonic surprise strikes first."),
    ("sound_rush", "Sound Rush", "Sonic", None, 60, 100, 25, "physical", "speup", 50, "single",
     {}, "Rush with audible boom; may sharply raise Speed."),
    ("rumble_smash", "Rumble Smash", "Sonic", None, 75, 95, 15, "physical", "defdown", 30, "single",
     {}, "Ground-rumbling impact; may lower foe's Def."),
    ("drumstroke", "Drumstroke", "Sonic", None, 55, 100, 25, "physical", None, 0, "single",
     {"hits": 2}, "Two-hit resonant percussion."),
    ("skyboom_strike", "Skyboom Strike", "Sonic", ["Sonic", "Wind"], 85, 95, 10, "physical", "sluggish", 30, "wide",
     {}, "Air-pressure boom striking all foes; may inflict Sluggish."),
    ("resonance_quake", "Resonance Quake", "Sonic", None, 120, 85, 5, "physical", "atkup", 100, "single",
     {}, "Body-vibration empowerment; guaranteed +1 Atk after damage."),
    # Special (11)
    ("sonic_pulse", "Echo Pulse", "Sonic", None, 35, 100, 40, "special", None, 0, "single",
     {}, "Single resonating pulse."),
    ("wave_cry", "Wave Cry", "Sonic", None, 50, 95, 30, "special", None, 0, "wide",
     {}, "Focused sound wave hitting all foes."),
    ("resonate", "Resonate", "Sonic", None, 75, 95, 15, "special", "spaup", 30, "single",
     {}, "Resonant attack; may raise own SpA."),
    ("discord", "Discord", "Sonic", None, 60, 100, 20, "special", "confuse", 30, "wide",
     {}, "Discordant noise spreading to all foes; may confuse."),
    ("pulse_wave", "Pulse Wave", "Sonic", None, 65, 100, 20, "special", None, 0, "single",
     {"breakerVs": "Vapor"}, "Compressed shockwave that resonates devastatingly through Vapor."),
    ("prism_resonance", "Prism Resonance", "Sonic", ["Sonic", "Crystal"], 90, 95, 10, "special", "echolocation", 20, "wide",
     {}, "Crystalline resonance burst; may lock Echolocation on the target."),
    ("wail", "Wail", "Sonic", None, 80, 100, 10, "special", "atkdown", 30, "single",
     {}, "Mournful wail; may lower foe's Atk."),
    ("harmonic_burst", "Harmonic Burst", "Sonic", None, 100, 90, 5, "special", None, 0, "wide",
     {}, "Tremendous harmonic blast across the battlefield."),
    ("bass_blast", "Bass Blast", "Sonic", None, 95, 100, 5, "special", "deafen", 30, "single",
     {}, "Body-rattling deep tone; may inflict Deafen."),
    ("decibel_burst", "Decibel Burst", "Sonic", None, 85, 100, 10, "special", "flinch", 20, "wide",
     {}, "Loud burst hitting all foes; may cause flinch."),
    ("threnody", "Threnody", "Sonic", None, 130, 90, 5, "special", "recharge", 100, "single",
     {}, "Final dirge requiring rest after use."),
    # Status (5)
    ("chirp", "Chirp", "Sonic", None, 0, 100, 25, "status", "atkdown", 100, "single",
     {}, "Sharp chirp guaranteed to lower foe's Atk."),
    ("earsplit", "Earsplit", "Sonic", None, 0, 90, 15, "status", "defdown2", 100, "single",
     {}, "Piercing screech sharply lowers foe's Def."),
    ("siren_song", "Siren Song", "Sonic", None, 0, 55, 10, "status", "sleep", 100, "single",
     {}, "Lulling song puts foe to sleep when it connects."),
    ("soundproof", "Soundproof", "Sonic", None, 0, 100, 20, "status", "defup", 100, "self",
     {}, "Sound-dampening posture raises own Def."),
    ("echo_chamber", "Echo Chamber", "Sonic", None, 0, 100, 15, "status", "accup", 100, "self",
     {}, "Echo-locked acoustic focus raises own Accuracy."),
]

SONIC_EXCLUSIVE = [
    ("perfect_pitch", "Perfect Pitch", "Sonic", None, 0, 100, 5, "status", "echolocation_and_deafen", 100, "single",
     {"rarity": "exclusive"}, "Pitch-perfect tone locks Echolocation AND Deafen on the target. Signature."),
    ("infrasonic_apocalypse", "Infrasonic Apocalypse", "Sonic", None, 150, 85, 5, "special", "recharge_and_burnt_out", 100, "wide",
     {"rarity": "exclusive"}, "Devastating infrasound across all foes; inflicts Burnt-out and requires rest after."),
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

# Find end of MOVES_DATA — search forward from start for the closing `};`
# that precedes the MONSTERS_DATA marker.
moves_start = content.index("const MOVES_DATA")
monsters_marker = content.index("// MONSTERS DATA", moves_start)
# Find the last `};` before the MONSTERS_DATA marker
close_idx = content.rfind("};", moves_start, monsters_marker)
if close_idx == -1:
    raise RuntimeError("Couldn't locate closing }; of MOVES_DATA")
insert_pos = close_idx  # insert right before the `};`

# Ensure the last existing move's `}` has a trailing comma (some legacy entries
# lack one since they were the final entry of the object).
# Walk backwards from insert_pos to find the last `}` and add comma if missing.
i = insert_pos - 1
while i > moves_start and content[i] in " \n\r\t":
    i -= 1
if content[i] == "}":
    content = content[:i+1] + "," + content[i+1:]
    insert_pos += 1  # account for the inserted comma

# Build the addition block
new_block = "\n\n  // ============================================================\n"
new_block += "  // STEP 3B ADDITIONS — REGULAR MOVES (Sonic)\n"
new_block += "  // ============================================================\n"
new_block += "\n  // --- Sonic (regular) ---\n"
for m in SONIC_REGULAR:
    new_block += fmt_move(m) + "\n"

new_block += "\n  // ============================================================\n"
new_block += "  // STEP 3B ADDITIONS — EXCLUSIVE MOVES\n"
new_block += "  // Each move has rarity:\"exclusive\" — assigned to specific\n"
new_block += "  // legendary/signature Lumori in Step 4. To be audited as a\n"
new_block += "  // separate group per the typing-system overhaul plan.\n"
new_block += "  // ============================================================\n"
new_block += "\n  // --- Sonic (exclusive) ---\n"
for m in SONIC_EXCLUSIVE:
    new_block += fmt_move(m) + "\n"

content = content[:insert_pos] + new_block + content[insert_pos:]

with open(DATA, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Inserted {len(SONIC_REGULAR)} regular + {len(SONIC_EXCLUSIVE)} exclusive Sonic moves.")
