#!/usr/bin/env python3
"""Step 3b additions: add new moves across 10 types to hit user-specified
counts. Adds-only — trims for Nature (4 phys, 4 stat) and Earth (12 phys)
are deferred (require learnset audit)."""

import re

DATA = "/home/user/Lumoria/js/data.js"

# Each move: (id, name, type, power, acc, pp, cat, effect, ec, desc, hits_optional)
# hits_optional is int or None
MOVES = [
    # ============== SONIC (8 phys + 11 spec + 5 stat = 24) ==============
    # Physical
    ("shake_strike", "Shake Strike", "Sonic", 50, 100, 30, "physical", None, 0, "Body-vibration impact.", None),
    ("echo_strike", "Echo Strike", "Sonic", 30, 100, 20, "physical", "hits", 0, "Strikes twice with echo.", 2),
    ("silent_strike", "Silent Strike", "Sonic", 70, 100, 15, "physical", "priority", 0, "Strikes first via sonic surprise.", None),
    ("resonance_quake", "Resonance Quake", "Sonic", 120, 85, 5, "physical", "recharge", 100, "Devastating ground-shaking resonance; needs rest.", None),
    ("sound_rush", "Sound Rush", "Sonic", 60, 100, 25, "physical", None, 0, "Rush attack with audible boom.", None),
    ("rumble_smash", "Rumble Smash", "Sonic", 75, 95, 15, "physical", "defdown", 30, "Deep ground-rumbling impact; may lower Def.", None),
    ("drumstroke", "Drumstroke", "Sonic", 55, 100, 25, "physical", "hits", 0, "Two-hit resonant percussion.", 2),
    ("bass_drop", "Bass Drop", "Sonic", 85, 95, 10, "physical", None, 0, "Crushing low-frequency drop.", None),
    # Special
    ("sonic_pulse", "Echo Pulse", "Sonic", 35, 100, 40, "special", None, 0, "Single resonating pulse.", None),
    ("wave_cry", "Wave Cry", "Sonic", 50, 95, 30, "special", None, 0, "Focused sound wave.", None),
    ("resonate", "Resonate", "Sonic", 75, 95, 15, "special", None, 0, "Resonant attack.", None),
    ("discord", "Discord", "Sonic", 60, 100, 20, "special", "confuse", 30, "Discordant noise; may confuse.", None),
    ("pulse_wave", "Pulse Wave", "Sonic", 65, 100, 20, "special", None, 0, "Compressed shockwave.", None),
    ("shatter_note", "Shatter Note", "Sonic", 90, 95, 10, "special", None, 0, "Pitch-perfect tone shatters.", None),
    ("wail", "Wail", "Sonic", 80, 100, 10, "special", "atkdown", 30, "Mournful wail; may lower Atk.", None),
    ("harmonic_burst", "Harmonic Burst", "Sonic", 100, 90, 5, "special", "recharge", 100, "Tremendous harmonic blast; needs rest.", None),
    ("bass_blast", "Bass Blast", "Sonic", 95, 100, 5, "special", None, 0, "Body-rattling deep tone.", None),
    ("threnody", "Threnody", "Sonic", 130, 90, 5, "special", "recharge", 100, "Final dirge; requires rest.", None),
    ("decibel_burst", "Decibel Burst", "Sonic", 85, 100, 10, "special", "flinch", 30, "Loud burst; may cause flinch.", None),
    # Status
    ("chirp", "Chirp", "Sonic", 0, 100, 25, "status", "atkdown", 100, "Sharp chirp lowers foe's Atk.", None),
    ("earsplit", "Earsplit", "Sonic", 0, 90, 15, "status", "defdown2", 100, "Piercing screech; sharply lowers Def.", None),
    ("siren_song", "Siren Song", "Sonic", 0, 70, 10, "status", "sleep", 100, "Lulling song puts foe to sleep.", None),
    ("soundproof", "Soundproof", "Sonic", 0, 100, 20, "status", "defup", 100, "Raises own Def 1 stage.", None),
    ("echo_chamber", "Echo Chamber", "Sonic", 0, 100, 15, "status", "accup", 100, "Raises own Accuracy.", None),

    # ============== FIRE (10 phys + 4 stat = 14) ==============
    # Physical
    ("ember_jab", "Ember Jab", "Fire", 40, 100, 30, "physical", None, 0, "Quick burning jab.", None),
    ("firebreath_charge", "Firebreath Charge", "Fire", 70, 100, 15, "physical", None, 0, "Charging breath-fire attack.", None),
    ("molten_claw", "Molten Claw", "Fire", 65, 100, 20, "physical", "burn", 10, "Searing claw slash; may burn.", None),
    ("coal_smash", "Coal Smash", "Fire", 80, 95, 10, "physical", "defdown", 20, "Coal-fist slam; may lower Def.", None),
    ("magma_strike", "Magma Strike", "Fire", 75, 95, 10, "physical", "burn", 20, "Molten body slam; may burn.", None),
    ("firebrand", "Firebrand", "Fire", 90, 100, 10, "physical", "crit", 0, "Branding strike; high crit ratio.", None),
    ("inferno_chop", "Inferno Chop", "Fire", 60, 100, 15, "physical", "burn", 30, "Karate-chop wreathed in flame.", None),
    ("scorch_kick", "Scorch Kick", "Fire", 95, 85, 10, "physical", "burn", 10, "Powerful kick; may burn.", None),
    ("flare_uppercut", "Flare Uppercut", "Fire", 85, 100, 10, "physical", "flinch", 20, "Upward uppercut; may flinch.", None),
    ("lava_drop", "Lava Drop", "Fire", 130, 85, 5, "physical", "recharge", 100, "Drops as molten lava; needs rest.", None),
    # Status
    ("flame_focus", "Flame Focus", "Fire", 0, 100, 15, "status", "focus", 100, "Sharpens flame for high crit chance.", None),
    ("searing_glare", "Searing Glare", "Fire", 0, 100, 15, "status", "spdefdown", 100, "Intense gaze lowers foe's SpDef.", None),
    ("molten_armor", "Molten Armor", "Fire", 0, 100, 15, "status", "defup2", 100, "Hardens molten skin (+2 Def).", None),
    ("kindle", "Kindle", "Fire", 0, 100, 10, "status", "spaup", 100, "Kindles inner flame (+1 SpA).", None),

    # ============== ELECTRIC (6 phys + 5 stat = 11) ==============
    # Physical
    ("thunder_jab", "Thunder Jab", "Electric", 40, 100, 30, "physical", None, 0, "Quick electric jab.", None),
    ("spark_claw", "Spark Claw", "Electric", 60, 100, 20, "physical", "paralyze", 30, "Electrified claw slash; may paralyze.", None),
    ("coil_strike", "Coil Strike", "Electric", 75, 100, 15, "physical", None, 0, "Electromagnetic coil strike.", None),
    ("bolt_smash", "Bolt Smash", "Electric", 85, 95, 10, "physical", "paralyze", 20, "Heavy bolt-charged smash; may paralyze.", None),
    ("plasma_punch", "Plasma Punch", "Electric", 95, 90, 10, "physical", "paralyze", 10, "Plasma-fist punch; may paralyze.", None),
    ("lightning_rush", "Lightning Rush", "Electric", 110, 85, 5, "physical", "recharge", 100, "Charged rush; requires rest.", None),
    # Status
    ("magnetize", "Magnetize", "Electric", 0, 100, 15, "status", "defup", 100, "Magnetic field hardens body (+1 Def).", None),
    ("static_charge", "Static Charge", "Electric", 0, 100, 15, "status", "atkup", 100, "Builds static for stronger strikes (+1 Atk).", None),
    ("overcharge", "Overcharge", "Electric", 0, 100, 10, "status", "spaup2", 100, "Floods circuits with power (+2 SpA).", None),
    ("capacitor_drain", "Capacitor Drain", "Electric", 0, 100, 10, "status", "heal50", 100, "Drains stored charge to recover up to half HP.", None),
    ("ground_circuit", "Ground Circuit", "Electric", 0, 100, 15, "status", "spdefup", 100, "Grounds circuits to defend (+1 SpDef).", None),

    # ============== WIND (4 phys + 7 spec + 3 stat = 14) ==============
    # Physical
    ("gust_jab", "Gust Jab", "Wind", 50, 100, 25, "physical", None, 0, "Quick gust-driven jab.", None),
    ("windshear", "Windshear", "Wind", 75, 100, 15, "physical", None, 0, "Sharp wind-blade strike.", None),
    ("tornado_kick", "Tornado Kick", "Wind", 80, 95, 10, "physical", "flinch", 20, "Spinning wind kick; may flinch.", None),
    ("cyclone_smash", "Cyclone Smash", "Wind", 100, 90, 10, "physical", None, 0, "Cyclone-force body slam.", None),
    # Special
    ("breeze_blast", "Breeze Blast", "Wind", 45, 100, 30, "special", None, 0, "Soft breeze; reliable damage.", None),
    ("zephyr_arrow", "Zephyr Arrow", "Wind", 70, 100, 20, "special", None, 0, "Sharp wind-arrow strike.", None),
    ("air_resonance", "Air Resonance", "Wind", 65, 95, 20, "special", "spedown", 20, "Resonating air; may lower Speed.", None),
    ("tempest_strike", "Tempest Strike", "Wind", 80, 95, 15, "special", None, 0, "Tempest-condensed strike.", None),
    ("squall", "Squall", "Wind", 75, 90, 15, "special", "accdown", 20, "Sudden squall; may lower Accuracy.", None),
    ("hurricane_blast", "Hurricane Blast", "Wind", 110, 80, 5, "special", "confuse", 30, "Wild hurricane; may confuse.", None),
    ("windstorm_eruption", "Windstorm Eruption", "Wind", 130, 85, 5, "special", "recharge", 100, "Violent windstorm; needs rest.", None),
    # Status
    ("updraft", "Updraft", "Wind", 0, 100, 15, "status", "speup", 100, "Riding updraft (+1 Speed).", None),
    ("gale_focus", "Gale Focus", "Wind", 0, 100, 15, "status", "accup", 100, "Reads wind; raises Accuracy.", None),
    ("air_barrier", "Air Barrier", "Wind", 0, 100, 15, "status", "defup", 100, "Wraps body in air-barrier (+1 Def).", None),

    # ============== ICE (6 phys + 1 spec + 5 stat = 12) ==============
    # Physical
    ("frost_jab", "Frost Jab", "Ice", 45, 100, 30, "physical", None, 0, "Quick frost jab.", None),
    ("ice_claw", "Ice Claw", "Ice", 60, 100, 20, "physical", "freeze", 10, "Iced claw slash; may freeze.", None),
    ("blizzard_charge", "Blizzard Charge", "Ice", 75, 95, 15, "physical", "freeze", 20, "Charging blizzard impact; may freeze.", None),
    ("icicle_smash", "Icicle Smash", "Ice", 80, 100, 10, "physical", None, 0, "Heavy icicle slam.", None),
    ("frostbite_strike", "Frostbite Strike", "Ice", 95, 90, 10, "physical", "freeze", 30, "Deep-cold strike; may freeze.", None),
    ("avalanche_smash", "Avalanche Smash", "Ice", 120, 85, 5, "physical", "recharge", 100, "Avalanche impact; requires rest.", None),
    # Special
    ("ice_resonance", "Ice Resonance", "Ice", 85, 95, 10, "special", "freeze", 20, "Resonant cold; may freeze.", None),
    # Status
    ("frost_armor", "Frost Armor", "Ice", 0, 100, 15, "status", "defup", 100, "Frost-armor (+1 Def).", None),
    ("cold_focus", "Cold Focus", "Ice", 0, 100, 15, "status", "focus", 100, "Frigid focus raises crit chance.", None),
    ("arctic_calm", "Arctic Calm", "Ice", 0, 100, 10, "status", "heal50", 100, "Deep calm restores half HP.", None),
    ("cryogenic_field", "Cryogenic Field", "Ice", 0, 100, 15, "status", "spdefup", 100, "Freezing field (+1 SpDef).", None),
    ("permafrost", "Permafrost", "Ice", 0, 100, 15, "status", "speup", 100, "Smooths surface like ice (+1 Speed).", None),

    # ============== DARK (2 phys + 6 spec + 3 stat = 11) ==============
    # Physical
    ("shadow_jab", "Shadow Jab", "Dark", 60, 100, 20, "physical", None, 0, "Quick shadow-strike.", None),
    ("nightmare_smash", "Nightmare Smash", "Dark", 90, 90, 10, "physical", "flinch", 20, "Nightmarish slam; may flinch.", None),
    # Special
    ("umbral_pulse", "Umbral Pulse", "Dark", 65, 100, 25, "special", "flinch", 20, "Umbral burst; may flinch.", None),
    ("shadow_lance", "Shadow Lance", "Dark", 80, 95, 15, "special", None, 0, "Piercing shadow-lance.", None),
    ("void_whisper", "Void Whisper", "Dark", 50, 100, 25, "special", "confuse", 20, "Disturbing whispers; may confuse.", None),
    ("shadowstorm", "Shadowstorm", "Dark", 95, 90, 10, "special", None, 0, "Whirling shadow storm.", None),
    ("eclipse_burst", "Eclipse Burst", "Dark", 110, 80, 5, "special", None, 0, "Blinding eclipse-burst.", None),
    ("abyssal_wave", "Abyssal Wave", "Dark", 130, 85, 5, "special", "recharge", 100, "Abyssal wave; requires rest.", None),
    # Status
    ("shadow_cloak", "Shadow Cloak", "Dark", 0, 100, 15, "status", "defup", 100, "Cloak of shadow (+1 Def).", None),
    ("dark_focus", "Dark Focus", "Dark", 0, 100, 15, "status", "focus", 100, "Shadowed focus raises crit chance.", None),
    ("fear_aura", "Fear Aura", "Dark", 0, 100, 15, "status", "atkdown", 100, "Aura of fear lowers foe's Atk.", None),

    # ============== FAIRY (2 phys + 7 spec + 3 stat = 12) ==============
    # Physical
    ("fairy_jab", "Fairy Jab", "Fairy", 60, 100, 20, "physical", None, 0, "Quick fairy-fist jab.", None),
    ("enchanted_smash", "Enchanted Smash", "Fairy", 90, 95, 10, "physical", None, 0, "Enchanted heavy slam.", None),
    # Special
    ("fairy_mist", "Fairy Mist", "Fairy", 45, 100, 30, "special", None, 0, "Soft fairy-mist.", None),
    ("sparkle_shot", "Sparkle Shot", "Fairy", 65, 100, 20, "special", None, 0, "Concentrated sparkle.", None),
    ("moonlight_beam", "Moonlight Beam", "Fairy", 75, 100, 15, "special", None, 0, "Beam of moonlight.", None),
    ("charm_pulse", "Charm Pulse", "Fairy", 60, 95, 20, "special", "atkdown", 30, "Charming pulse; may lower Atk.", None),
    ("faewind", "Faewind", "Fairy", 80, 95, 15, "special", None, 0, "Sweeping fae-wind.", None),
    ("starlit_radiance", "Starlit Radiance", "Fairy", 110, 85, 5, "special", None, 0, "Brilliant starlit radiance.", None),
    ("supernova_glow", "Supernova Glow", "Fairy", 130, 85, 5, "special", "recharge", 100, "Supernova-bright glow; needs rest.", None),
    # Status
    ("fairy_focus", "Fairy Focus", "Fairy", 0, 100, 15, "status", "accup", 100, "Focused fairy-sense (+1 Accuracy).", None),
    ("enchant", "Enchant", "Fairy", 0, 100, 15, "status", "spaup", 100, "Enchants self (+1 SpA).", None),
    ("healing_circle", "Healing Circle", "Fairy", 0, 100, 10, "status", "heal50", 100, "Fairy circle restores half HP.", None),

    # ============== METAL (10 spec + 4 stat = 14) ==============
    # Special
    ("metal_pulse", "Metal Pulse", "Metal", 45, 100, 30, "special", None, 0, "Resonant metal pulse.", None),
    ("iron_shockwave", "Iron Shockwave", "Metal", 60, 100, 20, "special", None, 0, "Iron-density shockwave.", None),
    ("magnet_burst", "Magnet Burst", "Metal", 70, 95, 15, "special", None, 0, "Magnetic-field burst.", None),
    ("chromium_ray", "Chromium Ray", "Metal", 75, 100, 15, "special", None, 0, "Sharp chromium-light ray.", None),
    ("titanic_beam", "Titanic Beam", "Metal", 90, 95, 10, "special", None, 0, "Titanium-density beam.", None),
    ("smelter_surge", "Smelter Surge", "Metal", 95, 90, 10, "special", None, 0, "Surge of forge-energy.", None),
    ("mercurial_torrent", "Mercurial Torrent", "Metal", 80, 90, 15, "special", None, 0, "Mercury-quicksilver torrent.", None),
    ("iron_storm", "Iron Storm", "Metal", 110, 80, 5, "special", None, 0, "Storm of iron shards.", None),
    ("tungsten_wrath", "Tungsten Wrath", "Metal", 130, 85, 5, "special", "recharge", 100, "Devastating tungsten blast; needs rest.", None),
    ("plasma_smelt", "Plasma Smelt", "Metal", 100, 85, 10, "special", "burn", 20, "Plasma-hot metal; may burn.", None),
    # Status
    ("iron_defense", "Iron Defense", "Metal", 0, 100, 15, "status", "defup2", 100, "Hardens to iron (+2 Def).", None),
    ("metal_polish", "Metal Polish", "Metal", 0, 100, 15, "status", "speup", 100, "Polished surface (+1 Speed).", None),
    ("armor_meld", "Armor Meld", "Metal", 0, 100, 15, "status", "spdefup", 100, "Melds defensive plating (+1 SpDef).", None),
    ("corrosion_proof", "Corrosion-Proof", "Metal", 0, 100, 10, "status", "heal50", 100, "Resists rot; restores half HP.", None),

    # ============== NATURE (6 spec only — trims deferred) ==============
    ("nature_pulse", "Nature Pulse", "Nature", 40, 100, 30, "special", None, 0, "Pulse of life-energy.", None),
    ("leafblade_swirl", "Leafblade Swirl", "Nature", 65, 95, 20, "special", None, 0, "Swirling leaf-blades.", None),
    ("spore_burst", "Spore Burst", "Nature", 70, 100, 15, "special", "sleep", 10, "Burst of spores; may sleep foe.", None),
    ("verdant_radiance", "Verdant Radiance", "Nature", 85, 90, 10, "special", None, 0, "Green-glow radiance.", None),
    ("swarm_assault", "Swarm Assault", "Nature", 95, 90, 10, "special", None, 0, "Insect-swarm assault.", None),
    ("primordial_growth", "Primordial Growth", "Nature", 110, 85, 5, "special", None, 0, "Primordial growth-burst.", None),

    # ============== EARTH (4 spec + 1 stat = 5 — phys trims deferred) ==============
    # Special
    ("quake_pulse", "Quake Pulse", "Earth", 50, 100, 30, "special", None, 0, "Seismic pulse.", None),
    ("tectonic_wave", "Tectonic Wave", "Earth", 75, 95, 15, "special", None, 0, "Tectonic-plate wave.", None),
    ("mineral_blast", "Mineral Blast", "Earth", 85, 90, 10, "special", None, 0, "Burst of mineral shards.", None),
    ("continental_shift", "Continental Shift", "Earth", 110, 85, 5, "special", None, 0, "Continental upheaval.", None),
    # Status
    ("sand_polish", "Sand Polish", "Earth", 0, 100, 15, "status", "speup", 100, "Sand smooths surface (+1 Speed).", None),
]

# ===================== Format moves as JS =====================
def fmt_move(m):
    mid, name, t, pow, acc, pp, cat, eff, ec, desc, hits = m
    eff_s = "null" if eff is None else f'"{eff}"'
    hits_s = f", hits:{hits}" if hits else ""
    return f'  {mid+":":<24} {{ name:"{name}", type:"{t}", power:{pow}, acc:{acc}, pp:{pp}, cat:"{cat}", effect:{eff_s}, ec:{ec}{hits_s}, desc:"{desc}" }},'

with open(DATA, "r", encoding="utf-8") as f:
    content = f.read()

# Find end of MOVES_DATA (the closing }; before next const)
moves_start = content.index("const MOVES_DATA")
# Find the matching closing brace — the first `};` followed by blank line + const
moves_end_match = re.search(r"\n\};\n\n(?=// )", content[moves_start:])
if moves_end_match:
    insert_pos = moves_start + moves_end_match.start()
else:
    # Fallback: find any `\n};\n` after moves_start
    insert_pos = content.index("\n};\n", moves_start)

# Group moves by type for section comments
by_type = {}
for m in MOVES:
    t = m[2]
    by_type.setdefault(t, []).append(m)

new_block = "\n\n  // ============================================================\n"
new_block += "  // STEP 3b ADDITIONS (2026-05-21): new moves per user-specified counts\n"
new_block += "  // ============================================================\n"
for t, moves in by_type.items():
    new_block += f"\n  // --- {t} (Step 3b additions) ---\n"
    for m in moves:
        new_block += fmt_move(m) + "\n"

# Insert the new block right before the closing };
content = content[:insert_pos] + new_block + content[insert_pos:]

with open(DATA, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Inserted {len(MOVES)} new moves across {len(by_type)} types.")
for t in by_type:
    p = sum(1 for m in by_type[t] if m[6] == "physical")
    s = sum(1 for m in by_type[t] if m[6] == "special")
    st = sum(1 for m in by_type[t] if m[6] == "status")
    print(f"  {t}: +{p} phys, +{s} spec, +{st} stat = +{p+s+st}")
