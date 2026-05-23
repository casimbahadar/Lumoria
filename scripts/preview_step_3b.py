#!/usr/bin/env python3
"""Generate a Markdown preview file showing existing + proposed-new moves
for each of the 10 types being touched in Step 3b. NEW moves are marked.
For user review before any data.js changes."""

import re

# ===== Proposed NEW moves (revised for variety vs existing) =====
NEW_MOVES = {
    # ============== SONIC (8/11/5 = 24) ==============
    "Sonic": [
        ("shake_strike", "Shake Strike", 50, 100, 30, "physical", None, 0, "Body-vibration impact."),
        ("echo_strike", "Echo Strike", 30, 100, 20, "physical", "hits", 0, "Strikes twice with echo."),
        ("silent_strike", "Silent Strike", 70, 100, 15, "physical", "priority", 0, "Strikes first via sonic surprise."),
        ("resonance_quake", "Resonance Quake", 120, 85, 5, "physical", "recharge", 100, "Devastating resonance; needs rest."),
        ("sound_rush", "Sound Rush", 60, 100, 25, "physical", None, 0, "Rush with audible boom."),
        ("rumble_smash", "Rumble Smash", 75, 95, 15, "physical", "defdown", 30, "Ground-rumbling impact; may lower Def."),
        ("drumstroke", "Drumstroke", 55, 100, 25, "physical", "hits", 0, "Two-hit percussion."),
        ("bass_drop", "Bass Drop", 85, 95, 10, "physical", None, 0, "Low-frequency crushing drop."),
        ("sonic_pulse", "Echo Pulse", 35, 100, 40, "special", None, 0, "Single resonating pulse."),
        ("wave_cry", "Wave Cry", 50, 95, 30, "special", None, 0, "Focused sound wave."),
        ("resonate", "Resonate", 75, 95, 15, "special", None, 0, "Resonant attack."),
        ("discord", "Discord", 60, 100, 20, "special", "confuse", 30, "Discordant noise; may confuse."),
        ("pulse_wave", "Pulse Wave", 65, 100, 20, "special", None, 0, "Compressed shockwave."),
        ("shatter_note", "Shatter Note", 90, 95, 10, "special", None, 0, "Pitch-perfect shattering tone."),
        ("wail", "Wail", 80, 100, 10, "special", "atkdown", 30, "Mournful wail; may lower Atk."),
        ("harmonic_burst", "Harmonic Burst", 100, 90, 5, "special", "recharge", 100, "Tremendous harmonic blast."),
        ("bass_blast", "Bass Blast", 95, 100, 5, "special", None, 0, "Body-rattling deep tone."),
        ("threnody", "Threnody", 130, 90, 5, "special", "recharge", 100, "Final dirge; requires rest."),
        ("decibel_burst", "Decibel Burst", 85, 100, 10, "special", "flinch", 30, "Loud burst; may flinch."),
        ("chirp", "Chirp", 0, 100, 25, "status", "atkdown", 100, "Sharp chirp lowers foe's Atk."),
        ("earsplit", "Earsplit", 0, 90, 15, "status", "defdown2", 100, "Piercing screech; sharply lowers Def."),
        ("siren_song", "Siren Song", 0, 70, 10, "status", "sleep", 100, "Lulling song puts foe to sleep."),
        ("soundproof", "Soundproof", 0, 100, 20, "status", "defup", 100, "Raises own Def 1 stage."),
        ("echo_chamber", "Echo Chamber", 0, 100, 15, "status", "accup", 100, "Raises own Accuracy."),
    ],
    # ============== FIRE (+10 phys, +4 stat = 14) ==============
    # Fire phys variety: existing 3 burn + priority/crit/speup. New: 2 burn, atkdown, defdown, flinch, crit, recharge, spedown.
    "Fire": [
        ("ember_jab", "Ember Jab", 40, 100, 30, "physical", None, 0, "Quick burning jab."),
        ("firebreath_charge", "Firebreath Charge", 70, 100, 15, "physical", None, 0, "Charging breath-fire."),
        ("molten_claw", "Molten Claw", 65, 100, 20, "physical", "atkdown", 20, "Scalding claw may weaken offense."),
        ("coal_smash", "Coal Smash", 80, 95, 10, "physical", "defdown", 20, "Coal-fist slam; may lower Def."),
        ("magma_strike", "Magma Strike", 75, 95, 10, "physical", "flinch", 30, "Fiery slam; may flinch."),
        ("firebrand", "Firebrand", 90, 100, 10, "physical", "crit", 0, "Branding strike; high crit."),
        ("inferno_chop", "Inferno Chop", 60, 100, 15, "physical", "burn", 30, "Karate-chop wreathed in flame."),
        ("scorch_kick", "Scorch Kick", 95, 85, 10, "physical", "spedown", 30, "Kick leaves scorched ground; may slow."),
        ("flare_uppercut", "Flare Uppercut", 85, 100, 10, "physical", "flinch", 20, "Upward uppercut; may flinch."),
        ("lava_drop", "Lava Drop", 130, 85, 5, "physical", "recharge", 100, "Molten drop; requires rest."),
        # Status — existing: burn x3, defup, dragondance, spatkup. New: focus, spdefdown, defup2, atkup.
        ("flame_focus", "Flame Focus", 0, 100, 15, "status", "focus", 100, "Sharpens flame for high crit."),
        ("searing_glare", "Searing Glare", 0, 100, 15, "status", "spdefdown", 100, "Intense gaze lowers foe's SpDef."),
        ("molten_armor", "Molten Armor", 0, 100, 15, "status", "defup2", 100, "Hardens molten skin (+2 Def)."),
        ("kindle", "Kindle", 0, 100, 10, "status", "atkup", 100, "Kindles inner flame (+1 Atk)."),
    ],
    # ============== NATURE (+6 spec only; trims deferred) ==============
    # Nature spec variety: existing 3 null, 2 spdefdown, 2 drain, 3 confuse, 1 sleep, recharge, spedown, crit, spatkdown, poison.
    # New: null, atkdown, sleep, crit, flinch, recharge.
    "Nature": [
        ("nature_pulse", "Nature Pulse", 40, 100, 30, "special", None, 0, "Pulse of life-energy."),
        ("leafblade_swirl", "Leafblade Swirl", 65, 95, 20, "special", "atkdown", 20, "Swirling leaf-blades; may lower Atk."),
        ("spore_burst_v2", "Sporecloud Burst", 70, 100, 15, "special", "sleep", 10, "Burst of spores; may sleep foe."),
        ("verdant_radiance", "Verdant Radiance", 85, 90, 10, "special", "crit", 0, "Green-glow radiance; high crit."),
        ("swarm_assault", "Swarm Assault", 95, 90, 10, "special", "flinch", 20, "Insect-swarm assault; may flinch."),
        ("primordial_growth", "Primordial Growth", 110, 85, 5, "special", "recharge", 100, "Primordial growth-burst; needs rest."),
    ],
    # ============== ELECTRIC (+6 phys, +5 stat = 11) ==============
    # Electric phys existing: paralyze x6, null x2, recoil. New variety: less paralyze, more flinch/crit/recharge.
    "Electric": [
        ("thunder_jab", "Thunder Jab", 40, 100, 30, "physical", None, 0, "Quick electric jab."),
        ("spark_claw", "Spark Claw", 60, 100, 20, "physical", "paralyze", 30, "Electrified claw; may paralyze."),
        ("coil_strike", "Coil Strike", 75, 100, 15, "physical", None, 0, "Electromagnetic coil strike."),
        ("bolt_smash", "Bolt Smash", 85, 95, 10, "physical", "flinch", 20, "Bolt-charged smash; may flinch."),
        ("plasma_punch", "Plasma Punch", 95, 90, 10, "physical", "crit", 0, "Plasma-fist; high crit."),
        ("lightning_rush", "Lightning Rush", 110, 85, 5, "physical", "recharge", 100, "Charged rush; requires rest."),
        # Status existing: atkup, speup x2, paralyze x2. New: defup, atkup2, spaup2, heal50, spdefup.
        ("magnetize", "Magnetize", 0, 100, 15, "status", "defup", 100, "Magnetic field (+1 Def)."),
        ("static_charge", "Static Charge", 0, 100, 15, "status", "atkup2", 100, "Builds static (+2 Atk)."),
        ("overcharge_status", "Overcharge Coil", 0, 100, 10, "status", "spaup2", 100, "Floods circuits (+2 SpA)."),
        ("capacitor_drain", "Capacitor Drain", 0, 100, 10, "status", "heal50", 100, "Drains stored charge; restores half HP."),
        ("ground_circuit", "Ground Circuit", 0, 100, 15, "status", "spdefup", 100, "Grounds circuits (+1 SpDef)."),
    ],
    # ============== EARTH (+4 spec, +1 stat = 5; phys trims deferred) ==============
    # Earth spec existing: variety; new add flinch/crit angles. Status existing: defup x4 (heavy). New: atkup.
    "Earth": [
        ("quake_pulse", "Quake Pulse", 50, 100, 30, "special", None, 0, "Seismic pulse."),
        ("tectonic_wave", "Tectonic Wave", 75, 95, 15, "special", "spedown", 30, "Plate-shift wave; may slow."),
        ("mineral_blast", "Mineral Blast", 85, 90, 10, "special", "spdefdown", 30, "Mineral shards; may lower SpDef."),
        ("continental_shift", "Continental Shift", 110, 85, 5, "special", "recharge", 100, "Continental upheaval; needs rest."),
        ("sand_polish_v2", "Sand Storm Polish", 0, 100, 15, "status", "atkup", 100, "Sand-grinding sharpens (+1 Atk)."),
    ],
    # ============== WIND (+4 phys, +7 spec, +3 stat = 14) ==============
    # Wind variety: existing flinch-heavy, less crit/atkdown. Status existing: defup taken, swap to heal50/spdefup/accup.
    "Wind": [
        ("gust_jab", "Gust Jab", 50, 100, 25, "physical", None, 0, "Quick gust-driven jab."),
        ("windshear", "Windshear", 75, 100, 15, "physical", "crit", 0, "Sharp wind-blade; high crit."),
        ("tornado_kick", "Tornado Kick", 80, 95, 10, "physical", "spedown", 30, "Spinning kick; may slow foe."),
        ("cyclone_smash", "Cyclone Smash", 100, 90, 10, "physical", "flinch", 30, "Cyclone-slam; may flinch."),
        ("breeze_blast", "Breeze Blast", 45, 100, 30, "special", None, 0, "Soft breeze; reliable damage."),
        ("zephyr_arrow", "Zephyr Arrow", 70, 100, 20, "special", "crit", 0, "Wind-arrow; high crit."),
        ("air_resonance", "Air Resonance", 65, 95, 20, "special", "spatkdown", 30, "Resonant air; may lower SpA."),
        ("tempest_strike", "Tempest Strike", 80, 95, 15, "special", "atkdown", 20, "Tempest strike; may lower Atk."),
        ("squall", "Squall", 75, 90, 15, "special", "accdown", 20, "Sudden squall; may lower Acc."),
        ("hurricane_blast", "Hurricane Blast", 110, 80, 5, "special", "confuse", 30, "Wild hurricane; may confuse."),
        ("windstorm_eruption", "Windstorm Eruption", 130, 85, 5, "special", "recharge", 100, "Violent windstorm; needs rest."),
        ("updraft", "Updraft", 0, 100, 15, "status", "spdefup", 100, "Updraft cushion (+1 SpDef)."),
        ("gale_focus", "Gale Focus", 0, 100, 15, "status", "accup", 100, "Reads wind; raises Accuracy."),
        ("air_barrier", "Air Barrier", 0, 100, 10, "status", "heal50", 100, "Air-current bath; restores half HP."),
    ],
    # ============== ICE (+6 phys, +1 spec, +5 stat = 12) ==============
    # Ice variety: existing freeze-heavy. New: less freeze, more flinch/defdown/recharge. Status: more variety.
    "Ice": [
        ("frost_jab", "Frost Jab", 45, 100, 30, "physical", "defdown", 20, "Quick frost jab; may lower Def."),
        ("ice_claw", "Ice Claw", 60, 100, 20, "physical", "freeze", 10, "Iced claw; may freeze."),
        ("blizzard_charge", "Blizzard Charge", 75, 95, 15, "physical", "flinch", 30, "Charging blizzard; may flinch."),
        ("icicle_smash", "Icicle Smash", 80, 100, 10, "physical", None, 0, "Heavy icicle slam."),
        ("frostbite_strike", "Frostbite Strike", 95, 90, 10, "physical", "freeze", 30, "Deep-cold strike; may freeze."),
        ("avalanche_smash", "Avalanche Smash", 120, 85, 5, "physical", "recharge", 100, "Avalanche impact; requires rest."),
        ("ice_resonance", "Ice Resonance", 85, 95, 10, "special", "crit", 0, "Resonant cold; high crit."),
        ("frost_armor", "Frost Armor", 0, 100, 15, "status", "defup2", 100, "Frost-armor (+2 Def)."),
        ("cold_focus", "Cold Focus", 0, 100, 15, "status", "focus", 100, "Frigid focus raises crit chance."),
        ("arctic_calm", "Arctic Calm", 0, 100, 10, "status", "heal50", 100, "Deep calm restores half HP."),
        ("cryogenic_field", "Cryogenic Field", 0, 100, 15, "status", "spdefup2", 100, "Freezing field (+2 SpDef)."),
        ("glacial_swift", "Glacial Swift", 0, 100, 15, "status", "speup", 100, "Smooths surface (+1 Speed)."),
    ],
    # ============== DARK (+2 phys, +6 spec, +3 stat = 11) ==============
    # Dark variety: existing spec heavy on spdefdown. New: less spdefdown, more flinch/confuse/atkdown/null/recharge.
    "Dark": [
        ("shadow_jab", "Shadow Jab", 60, 100, 20, "physical", "spedown", 20, "Shadow-strike; may slow."),
        ("nightmare_smash", "Nightmare Smash", 90, 90, 10, "physical", "flinch", 20, "Nightmarish slam; may flinch."),
        ("umbral_pulse", "Umbral Pulse", 65, 100, 25, "special", "flinch", 20, "Umbral burst; may flinch."),
        ("shadow_lance", "Shadow Lance", 80, 95, 15, "special", None, 0, "Piercing shadow-lance."),
        ("void_whisper", "Void Whisper", 50, 100, 25, "special", "confuse", 20, "Disturbing whispers; may confuse."),
        ("shadowstorm", "Shadowstorm", 95, 90, 10, "special", None, 0, "Whirling shadow storm."),
        ("eclipse_burst", "Eclipse Burst", 110, 80, 5, "special", "atkdown", 30, "Blinding burst; may lower Atk."),
        ("abyssal_wave", "Abyssal Wave", 130, 85, 5, "special", "recharge", 100, "Abyssal wave; requires rest."),
        ("shadow_cloak", "Shadow Cloak", 0, 100, 15, "status", "defup", 100, "Cloak of shadow (+1 Def)."),
        ("dark_focus", "Dark Focus", 0, 100, 15, "status", "focus", 100, "Shadowed focus raises crit chance."),
        ("fear_aura", "Fear Aura", 0, 100, 15, "status", "defdown", 100, "Aura of fear lowers foe's Def."),
    ],
    # ============== FAIRY (+2 phys, +7 spec, +3 stat = 12) ==============
    # Fairy variety: existing spec heavy on spatkdown/null. New: more variety (atkdown, crit, flinch, confuse, spedown, null, recharge).
    "Fairy": [
        ("fairy_jab", "Fairy Jab", 60, 100, 20, "physical", "crit", 0, "Fairy-fist jab; high crit."),
        ("enchanted_smash", "Enchanted Smash", 90, 95, 10, "physical", "flinch", 30, "Enchanted slam; may flinch."),
        ("fairy_mist", "Fairy Mist", 45, 100, 30, "special", "atkdown", 20, "Soft mist; may lower Atk."),
        ("sparkle_shot", "Sparkle Shot", 65, 100, 20, "special", "crit", 0, "Sparkle pellet; high crit."),
        ("moonlight_beam", "Moonlight Beam", 75, 100, 15, "special", "flinch", 20, "Moonlight beam; may flinch."),
        ("charm_pulse", "Charm Pulse", 60, 95, 20, "special", "confuse", 30, "Charming pulse; may confuse."),
        ("faewind", "Faewind", 80, 95, 15, "special", "spedown", 30, "Sweeping fae-wind; may slow."),
        ("starlit_radiance", "Starlit Radiance", 110, 85, 5, "special", None, 0, "Brilliant starlit radiance."),
        ("supernova_glow", "Supernova Glow", 130, 85, 5, "special", "recharge", 100, "Supernova-bright glow; needs rest."),
        ("fairy_focus", "Fairy Focus", 0, 100, 15, "status", "accup", 100, "Focused fairy-sense (+1 Acc)."),
        ("enchant", "Enchant", 0, 100, 15, "status", "spaup", 100, "Enchants self (+1 SpA)."),
        ("healing_circle", "Healing Circle", 0, 100, 10, "status", "defup2", 100, "Fairy circle (+2 Def)."),
    ],
    # ============== METAL (+10 spec, +4 stat = 14) ==============
    # Metal spec is THIN (2 existing). Adding 10 with broad variety.
    "Metal": [
        ("metal_pulse", "Metal Pulse", 45, 100, 30, "special", None, 0, "Resonant metal pulse."),
        ("iron_shockwave", "Iron Shockwave", 60, 100, 20, "special", "defdown", 30, "Shockwave; may lower Def."),
        ("magnet_burst", "Magnet Burst", 70, 95, 15, "special", "spedown", 30, "Magnetic burst; may slow."),
        ("chromium_ray", "Chromium Ray", 75, 100, 15, "special", "crit", 0, "Chromium-light; high crit."),
        ("titanic_beam", "Titanic Beam", 90, 95, 10, "special", "spdefdown", 30, "Titanium beam; may lower SpDef."),
        ("smelter_surge", "Smelter Surge", 95, 90, 10, "special", "flinch", 20, "Forge-energy surge; may flinch."),
        ("mercurial_torrent", "Mercurial Torrent", 80, 90, 15, "special", "confuse", 30, "Quicksilver torrent; may confuse."),
        ("iron_storm", "Iron Storm", 110, 80, 5, "special", "atkdown", 30, "Iron shards; may lower Atk."),
        ("tungsten_wrath", "Tungsten Wrath", 130, 85, 5, "special", "recharge", 100, "Devastating tungsten blast."),
        ("plasma_smelt", "Plasma Smelt", 100, 85, 10, "special", "burn", 20, "Plasma-hot metal; may burn."),
        # Status — existing has defup x4 heavy. New: defup2, speup, spdefup2, heal50.
        ("iron_defense", "Iron Defense", 0, 100, 15, "status", "defup2", 100, "Iron-rigid stance (+2 Def)."),
        ("metal_polish_v2", "Mirror Polish", 0, 100, 15, "status", "speup", 100, "Polished surface (+1 Speed)."),
        ("armor_meld", "Armor Meld", 0, 100, 15, "status", "spdefup2", 100, "Welds plating (+2 SpDef)."),
        ("corrosion_proof", "Corrosion-Proof", 0, 100, 10, "status", "heal50", 100, "Resists rot; restores half HP."),
    ],
}

# ===== Read existing moves =====
DATA = "/home/user/Lumoria/js/data.js"
with open(DATA) as f:
    content = f.read()
moves_start = content.index("const MOVES_DATA")
moves_end = content.index("\nconst ", moves_start + 10)
mb = content[moves_start:moves_end]

def existing_moves(t):
    pat = re.compile(r'^\s*(\w+):\s*\{\s*name:"([^"]+)",\s*type:"' + t + r'",\s*power:(\d+),\s*acc:(\d+),\s*pp:(\d+),\s*cat:"(\w+)",\s*effect:("?[^,}]+"?|null)', re.MULTILINE)
    return [(m.group(1), m.group(2), int(m.group(3)), int(m.group(4)), int(m.group(5)), m.group(6), m.group(7).strip('"')) for m in pat.finditer(mb)]

# ===== Render Markdown =====
def fmt_eff(eff):
    return "—" if eff in ("null", "None") else eff

out = ["# Step 3b — Move additions preview (10 types)\n",
       "Existing moves shown first per type, then **NEW** additions marked. Tables show: name, category, power/acc/pp, effect.\n",
       "Aquatic: no changes (skipped).\n",
       "---\n"]

# Order: Sonic first, then user's listed order
ORDER = ["Sonic", "Fire", "Nature", "Electric", "Earth", "Wind", "Ice", "Dark", "Fairy", "Metal"]

for t in ORDER:
    new = NEW_MOVES.get(t, [])
    existing = existing_moves(t)
    # Tally counts
    e_p = sum(1 for x in existing if x[5] == "physical")
    e_s = sum(1 for x in existing if x[5] == "special")
    e_st = sum(1 for x in existing if x[5] == "status")
    n_p = sum(1 for x in new if x[5] == "physical")
    n_s = sum(1 for x in new if x[5] == "special")
    n_st = sum(1 for x in new if x[5] == "status")
    out.append(f"## {t}")
    out.append(f"Existing: **{e_p}P / {e_s}S / {e_st}St = {e_p+e_s+e_st}**")
    out.append(f"After: **{e_p+n_p}P / {e_s+n_s}S / {e_st+n_st}St = {e_p+n_p+e_s+n_s+e_st+n_st}** (+{n_p+n_s+n_st} new)")
    out.append("")

    for cat in ["physical", "special", "status"]:
        e_cat = [x for x in existing if x[5] == cat]
        n_cat = [x for x in new if x[5] == cat]
        if not e_cat and not n_cat:
            continue
        out.append(f"### {cat.capitalize()} ({len(e_cat)+len(n_cat)})")
        out.append("| Name | Pow | Acc | PP | Effect |")
        out.append("|---|---|---|---|---|")
        for mid, name, pow, acc, pp, _, eff in e_cat:
            out.append(f"| {name} | {pow} | {acc} | {pp} | {fmt_eff(eff)} |")
        for mid, name, pow, acc, pp, _, eff, _, _ in n_cat:
            eff_s = fmt_eff(eff if eff else "—")
            out.append(f"| **{name}** (NEW) | {pow} | {acc} | {pp} | **{eff_s}** |")
        out.append("")
    out.append("---\n")

with open("/tmp/step_3b_preview.md", "w") as f:
    f.write("\n".join(out))

print(f"Wrote preview to /tmp/step_3b_preview.md ({sum(1 for _ in open('/tmp/step_3b_preview.md'))} lines)")
