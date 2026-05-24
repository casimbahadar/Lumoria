#!/usr/bin/env python3
"""Step 3b — apply new moves for 8 types in one batch: Nature, Electric,
Earth, Wind, Ice, Dark, Fairy, Metal. Adds-only (no existing-move audits).
Recharge only on 150-pow exclusives (130-pow get no recharge penalty)."""

import re

DATA = "/home/user/Lumoria/js/data.js"

# Move tuple: (id, name, type, dualType, power, acc, pp, cat, effect, ec, target, extras, desc)
TYPE_DATA = {
    "Nature": {
        "regular": [
            ("nature_pulse", "Nature Pulse", "Nature", None, 40, 100, 30, "special", None, 0, "single",
             {"alwaysCrit": True}, "Pulse of life-energy; always lands a critical hit."),
            ("leafblade_swirl", "Leafblade Swirl", "Nature", None, 65, 95, 20, "special", "atkdown", 20, "single",
             {}, "Swirling leaf-blades; may lower foe's Atk."),
            ("sporecloud_burst", "Sporecloud Burst", "Nature", None, 70, 100, 15, "special", "sleep", 10, "wide",
             {}, "Burst of spores across all foes; may sleep them."),
            ("verdant_radiance", "Verdant Radiance", "Nature", ["Nature", "Stellar"], 85, 90, 10, "special", "crit", 100, "single",
             {}, "Bright life-radiance with high crit ratio. Dual Nature+Stellar."),
            ("swarm_assault", "Swarm Assault", "Nature", None, 95, 90, 10, "special", "flinch", 20, "wide",
             {}, "Insect-swarm assault on all foes; may flinch."),
            ("primordial_growth", "Primordial Growth", "Nature", ["Nature", "Earth"], 110, 85, 5, "special", None, 0, "single",
             {}, "Primordial growth-burst. Dual Nature+Earth."),
        ],
        "exclusive": [
            ("apocalypse_bloom", "Apocalypse Bloom", "Nature", None, 130, 85, 5, "special", "bleed", 100, "wide",
             {"rarity": "exclusive"}, "Wide bleed-blooming wave — signature."),
            ("parasitic_drain", "Parasitic Drain", "Nature", None, 90, 100, 10, "special", "drain", 100, "single",
             {"rarity": "exclusive"}, "Powerful drain-channel — signature."),
            ("ancient_grove", "Ancient Grove", "Nature", None, 150, 80, 5, "special", "recharge_and_tainted_target", 100, "wide",
             {"rarity": "exclusive"}, "Ancient grove-energy releases Tainted on all foes; requires rest."),
        ],
    },
    "Electric": {
        "regular": [
            ("thunder_jab", "Thunder Jab", "Electric", None, 40, 100, 30, "physical", None, 0, "single",
             {}, "Quick electric jab."),
            ("spark_claw", "Spark Claw", "Electric", None, 60, 100, 20, "physical", "paralyze", 30, "single",
             {"breakerVs": "Earth"}, "Electrified claw; bypasses Earth's normal immunity."),
            ("coil_strike", "Coil Strike", "Electric", None, 75, 100, 15, "physical", None, 0, "single",
             {}, "Electromagnetic coil-strike."),
            ("bolt_smash", "Bolt Smash", "Electric", ["Electric", "Metal"], 85, 95, 10, "physical", "flinch", 20, "wide",
             {}, "Bolt-charged smash. Dual Electric+Metal; may flinch all foes."),
            ("plasma_punch", "Plasma Punch", "Electric", None, 95, 90, 10, "physical", None, 0, "single",
             {"alwaysCrit": True}, "Plasma-fist; always lands a critical hit."),
            ("lightning_rush", "Lightning Rush", "Electric", ["Electric", "Sonic"], 110, 85, 10, "physical", "sluggish", 30, "wide",
             {}, "Sonic-boom-fast rush. Dual Electric+Sonic; may inflict Sluggish."),
            ("magnet_field", "Magnet Field", "Electric", None, 0, 100, 15, "status", "defup", 100, "self",
             {}, "Magnetic field hardens body (+1 Def)."),
            ("static_charge", "Static Charge", "Electric", None, 0, 100, 15, "status", "atkup2", 100, "self",
             {}, "Builds static (+2 Atk)."),
            ("overcharge_status", "Overcharge Coil", "Electric", None, 0, 100, 10, "status", "spaup2", 100, "self",
             {}, "Floods circuits (+2 SpA)."),
            ("capacitor_drain", "Capacitor Drain", "Electric", None, 0, 100, 10, "status", "heal50", 100, "self",
             {}, "Drains stored charge; restores half HP."),
            ("ground_circuit", "Ground Circuit", "Electric", None, 0, 100, 15, "status", "spdefup", 100, "self",
             {}, "Grounds circuits (+1 SpDef)."),
        ],
        "exclusive": [
            ("tesla_overload", "Tesla Overload", "Electric", None, 130, 90, 5, "special", "paralyze", 30, "wide",
             {"rarity": "exclusive"}, "Wide overload — may paralyze all foes."),
            ("eye_of_storm", "Eye of the Storm", "Electric", None, 0, 100, 5, "status", "echolocation_and_speup_self", 100, "single",
             {"rarity": "exclusive"}, "Locks Echolocation on target AND raises own Speed."),
            ("plasma_judgement", "Plasma Judgement", "Electric", None, 150, 85, 5, "special", "recharge_and_burn_target", 100, "single",
             {"rarity": "exclusive"}, "Searing plasma-bolt; guaranteed burn; requires rest."),
        ],
    },
    "Earth": {
        "regular": [
            ("quake_pulse", "Quake Pulse", "Earth", None, 50, 100, 30, "special", None, 0, "single",
             {"alwaysCrit": True}, "Seismic pulse; always lands a critical hit."),
            ("tectonic_wave", "Tectonic Wave", "Earth", None, 75, 95, 15, "special", "spedown", 30, "wide",
             {"breakerVs": "Aether"}, "Plate-shift wave; super vs Aether; may slow all foes."),
            ("mineral_blast", "Mineral Blast", "Earth", ["Earth", "Mineral"], 85, 90, 10, "special", "spdefdown", 30, "single",
             {}, "Mineral-shard burst. Dual Earth+Mineral; may lower SpDef."),
            ("continental_shift", "Continental Shift", "Earth", ["Earth", "Wind"], 110, 85, 5, "special", None, 0, "wide",
             {}, "Continental upheaval driven by wind erosion. Dual Earth+Wind."),
            ("sand_polish_v2", "Sand Storm Polish", "Earth", None, 0, 100, 15, "status", "atkup", 100, "self",
             {}, "Sand-grinding sharpens claws (+1 Atk)."),
        ],
        "exclusive": [
            ("terra_lock", "Terra Lock", "Earth", None, 0, 100, 5, "status", "petrify", 100, "single",
             {"rarity": "exclusive"}, "Locks the target in stone — signature Petrify status."),
            ("world_rend", "World Rend", "Earth", None, 130, 85, 5, "physical", "defdown", 100, "wide",
             {"rarity": "exclusive"}, "Earth-rending impact; guaranteed Def-down on all foes."),
            ("gaia_judgement", "Gaia Judgement", "Earth", None, 150, 80, 5, "special", "recharge_and_statue_target", 30, "single",
             {"rarity": "exclusive"}, "Geomantic judgement; may directly inflict Statue; requires rest."),
        ],
    },
    "Wind": {
        "regular": [
            ("gust_jab", "Gust Jab", "Wind", None, 50, 100, 25, "physical", None, 0, "single",
             {}, "Quick gust-driven jab."),
            ("windshear", "Windshear", "Wind", None, 75, 100, 15, "physical", "crit", 100, "single",
             {}, "Sharp wind-blade with high crit ratio."),
            ("tornado_kick", "Tornado Kick", "Wind", None, 80, 95, 10, "physical", "spedown", 30, "single",
             {}, "Spinning wind-kick; may slow."),
            ("cyclone_smash", "Cyclone Smash", "Wind", ["Wind", "Sonic"], 100, 90, 10, "physical", "flinch", 30, "wide",
             {}, "Cyclonic slam producing a sonic-boom. Dual Wind+Sonic; may flinch all foes."),
            ("breeze_blast", "Breeze Blast", "Wind", None, 45, 100, 30, "special", None, 0, "single",
             {}, "Soft breeze; reliable damage."),
            ("zephyr_arrow", "Zephyr Arrow", "Wind", None, 70, 100, 20, "special", None, 0, "single",
             {"alwaysCrit": True}, "Wind-arrow; always lands a critical hit."),
            ("air_resonance", "Air Resonance", "Wind", None, 65, 95, 20, "special", "spatkdown", 30, "single",
             {}, "Resonant air; may lower foe's SpA."),
            ("tempest_wave", "Tempest Wave", "Wind", None, 80, 95, 15, "special", "atkdown", 20, "single",
             {}, "Tempest-condensed wave; may lower foe's Atk."),
            ("squall", "Squall", "Wind", None, 75, 90, 15, "special", "deafen", 20, "wide",
             {}, "Sudden squall on all foes; may inflict Deafen."),
            ("hurricane_blast", "Hurricane Blast", "Wind", None, 110, 80, 5, "special", "confuse", 30, "wide",
             {"breakerVs": "Spectral"}, "Wild hurricane; super vs Spectral; may confuse all foes."),
            ("windstorm_eruption", "Thunderstorm Eruption", "Wind", ["Wind", "Electric"], 130, 85, 5, "special", "strained", 30, "wide",
             {}, "Lightning-laced windstorm. Dual Wind+Electric; may inflict Strained on all foes."),
            ("updraft", "Updraft", "Wind", None, 0, 100, 15, "status", "spdefup", 100, "self",
             {}, "Updraft cushion (+1 SpDef)."),
            ("gale_focus", "Gale Focus", "Wind", None, 0, 100, 15, "status", "accup", 100, "self",
             {}, "Reads wind currents; raises own Accuracy."),
            ("air_barrier", "Air Barrier", "Wind", None, 0, 100, 10, "status", "heal50", 100, "self",
             {}, "Air-current bath restores half HP."),
        ],
        "exclusive": [
            ("gale_force", "Gale Force", "Wind", None, 130, 95, 5, "special", "smothered", 100, "wide",
             {"rarity": "exclusive"}, "Smothering wide gust — signature."),
            ("stratos_pierce", "Stratosphere Pierce", "Wind", None, 150, 80, 5, "physical", "recharge_and_marked_target", 100, "single",
             {"rarity": "exclusive"}, "Sky-diving pierce; locks Marked; requires rest."),
            ("sky_dominion", "Sky Dominion", "Wind", None, 0, 100, 5, "status", "speup2_and_atkup_self", 100, "self",
             {"rarity": "exclusive"}, "Total sky command: +2 Speed AND +1 Atk."),
        ],
    },
    "Ice": {
        "regular": [
            ("frost_jab", "Frost Jab", "Ice", None, 45, 100, 30, "physical", None, 0, "single",
             {"breakerVs": "Aquatic"}, "Quick frost-jab; super vs Aquatic (Freeze-Dry analogue)."),
            ("ice_claw", "Ice Claw", "Ice", None, 60, 100, 20, "physical", "freeze", 10, "single",
             {}, "Iced claw; may freeze."),
            ("blizzard_charge", "Blizzard Charge", "Ice", None, 75, 95, 15, "physical", "sluggish", 30, "single",
             {}, "Charging blizzard; may inflict Sluggish."),
            ("icicle_smash", "Icicle Smash", "Ice", None, 80, 100, 10, "physical", None, 0, "single",
             {"alwaysCrit": True}, "Icicle slam; always lands a critical hit."),
            ("frostbite_strike", "Frostbite Strike", "Ice", None, 95, 90, 10, "physical", "freeze", 30, "single",
             {}, "Deep-cold strike; may freeze."),
            ("avalanche_smash", "Avalanche Smash", "Ice", ["Ice", "Earth"], 120, 85, 5, "physical", None, 0, "wide",
             {}, "Avalanche-scale slam. Dual Ice+Earth."),
            ("ice_resonance", "Ice Resonance", "Ice", ["Ice", "Sonic"], 85, 95, 10, "special", "brittle", 30, "wide",
             {}, "Resonant cold. Dual Ice+Sonic; may inflict Brittle."),
            ("frost_armor", "Frost Armor", "Ice", None, 0, 100, 15, "status", "defup2", 100, "self",
             {}, "Frost-armor (+2 Def)."),
            ("cold_focus", "Cold Focus", "Ice", None, 0, 100, 15, "status", "focus", 100, "self",
             {}, "Frigid focus raises crit chance."),
            ("arctic_calm", "Arctic Calm", "Ice", None, 0, 100, 10, "status", "heal50", 100, "self",
             {}, "Deep calm restores half HP."),
            ("cryogenic_field", "Cryogenic Field", "Ice", None, 0, 100, 15, "status", "spdefup2", 100, "self",
             {}, "Freezing field (+2 SpDef)."),
            ("glacial_swift", "Glacial Swift", "Ice", None, 0, 100, 15, "status", "speup", 100, "self",
             {}, "Smooths surface like ice (+1 Speed)."),
        ],
        "exclusive": [
            ("eternal_winter", "Eternal Winter", "Ice", None, 0, 100, 5, "status", "sluggish_and_spdefup_self", 100, "wide",
             {"rarity": "exclusive"}, "Locks Sluggish on all foes AND raises own SpDef."),
            ("glaciation", "Glaciation", "Ice", None, 130, 85, 5, "special", "freeze", 100, "wide",
             {"rarity": "exclusive"}, "Guaranteed freeze on all foes — signature."),
            ("permafrost_lock", "Permafrost Lock", "Ice", None, 150, 80, 5, "physical", "recharge_and_petrify_target", 30, "single",
             {"rarity": "exclusive"}, "Permafrost binds the target; may inflict Petrify; requires rest."),
        ],
    },
    "Dark": {
        "regular": [
            ("shadow_jab", "Shadow Jab", "Dark", None, 60, 100, 20, "physical", "spedown", 20, "single",
             {"breakerVs": "Fairy"}, "Shadow-strike pierces fairy-light; may slow."),
            ("nightmare_smash", "Nightmare Smash", "Dark", ["Dark", "Dream"], 90, 90, 10, "physical", "flinch", 20, "single",
             {}, "Nightmarish slam. Dual Dark+Dream; may flinch."),
            ("umbral_pulse", "Umbral Pulse", "Dark", None, 65, 100, 25, "special", "flinch", 20, "single",
             {}, "Umbral burst; may flinch."),
            ("shadow_lance", "Shadow Lance", "Dark", None, 80, 95, 15, "special", None, 0, "single",
             {"alwaysCrit": True}, "Piercing shadow-lance; always lands a critical hit."),
            ("void_whisper", "Void Whisper", "Dark", None, 50, 100, 25, "special", "confuse", 20, "wide",
             {}, "Disturbing whispers on all foes; may confuse."),
            ("shadowstorm", "Shadowstorm", "Dark", ["Dark", "Wind"], 95, 90, 10, "special", None, 0, "wide",
             {}, "Whirling shadow-storm. Dual Dark+Wind."),
            ("eclipse_burst", "Eclipse Burst", "Dark", None, 110, 80, 5, "special", "atkdown", 30, "wide",
             {}, "Blinding eclipse-burst on all foes; may lower Atk."),
            ("abyssal_wave", "Abyssal Wave", "Dark", None, 130, 85, 5, "special", "bleed", 30, "single",
             {}, "Abyssal wave; may inflict Bleed."),
            ("shadow_cloak", "Shadow Cloak", "Dark", None, 0, 100, 15, "status", "defup", 100, "self",
             {}, "Cloak of shadow (+1 Def)."),
            ("dark_focus", "Dark Focus", "Dark", None, 0, 100, 15, "status", "focus", 100, "self",
             {}, "Shadowed focus raises crit chance."),
            ("fear_aura", "Fear Aura", "Dark", None, 0, 100, 15, "status", "defdown", 100, "single",
             {}, "Aura of fear lowers foe's Def."),
        ],
        "exclusive": [
            ("eternal_night", "Eternal Night", "Dark", None, 0, 100, 5, "status", "marked_and_atkdown_target", 100, "wide",
             {"rarity": "exclusive"}, "Locks Marked on all foes AND lowers their Atk."),
            ("soul_devour", "Soul Devour", "Dark", None, 130, 85, 5, "physical", "bleed_and_drain", 100, "single",
             {"rarity": "exclusive"}, "Guaranteed Bleed-drain physical — signature."),
            ("abyssal_eclipse", "Abyssal Eclipse", "Dark", None, 150, 80, 5, "special", "recharge_and_petrify_target", 30, "wide",
             {"rarity": "exclusive"}, "Wide abyssal eclipse; may inflict Petrify; requires rest."),
        ],
    },
    "Fairy": {
        "regular": [
            ("fairy_jab", "Fairy Jab", "Fairy", None, 60, 100, 20, "physical", "crit", 100, "single",
             {}, "Fairy-fist jab with high crit ratio."),
            ("enchanted_smash", "Enchanted Smash", "Fairy", None, 90, 95, 10, "physical", "flinch", 30, "single",
             {}, "Enchanted slam; may flinch."),
            ("fairy_mist", "Fairy Mist", "Fairy", None, 45, 100, 30, "special", "atkdown", 20, "wide",
             {"breakerVs": "Metal"}, "Corrosive fairy-mist; super vs Metal; may lower Atk."),
            ("sparkle_shot", "Sparkle Shot", "Fairy", None, 65, 100, 20, "special", None, 0, "single",
             {"alwaysCrit": True}, "Sparkle pellet; always lands a critical hit."),
            ("moonlight_beam", "Moonlight Beam", "Fairy", None, 75, 100, 15, "special", "flinch", 20, "wide",
             {}, "Moonlight beam on all foes; may flinch."),
            ("charm_pulse", "Charm Pulse", "Fairy", None, 60, 95, 20, "special", "confuse", 30, "wide",
             {}, "Charming pulse on all foes; may confuse."),
            ("faewind", "Faewind", "Fairy", ["Fairy", "Wind"], 80, 95, 15, "special", "spedown", 30, "single",
             {}, "Sweeping fae-wind. Dual Fairy+Wind; may slow."),
            ("starlit_radiance", "Starlit Radiance", "Fairy", ["Fairy", "Stellar"], 110, 85, 5, "special", None, 0, "wide",
             {}, "Starlit radiance on all foes. Dual Fairy+Stellar."),
            ("supernova_glow", "Supernova Glow", "Fairy", None, 130, 85, 5, "special", "smothered", 30, "single",
             {}, "Blinding supernova; may inflict Smothered."),
            ("fairy_focus", "Fairy Focus", "Fairy", None, 0, 100, 15, "status", "accup", 100, "self",
             {}, "Focused fairy-sense (+1 Accuracy)."),
            ("enchant", "Enchant", "Fairy", None, 0, 100, 15, "status", "spaup", 100, "self",
             {}, "Enchants self (+1 SpA)."),
            ("healing_circle", "Healing Circle", "Fairy", None, 0, 100, 10, "status", "defup2", 100, "self",
             {}, "Fairy circle (+2 Def)."),
        ],
        "exclusive": [
            ("wish_grant", "Wish Grant", "Fairy", None, 0, 100, 5, "status", "heal50_and_echolocation_self", 100, "self",
             {"rarity": "exclusive"}, "Restores half HP AND locks Echolocation on self."),
            ("ethereal_judgement", "Ethereal Judgement", "Fairy", None, 130, 90, 5, "special", "atkdown", 100, "wide",
             {"rarity": "exclusive"}, "Wide ethereal judgement; guaranteed atkdown on all foes."),
            ("dreamscape", "Dreamscape", "Fairy", None, 150, 80, 5, "special", "recharge_and_sleep_target", 100, "wide",
             {"rarity": "exclusive"}, "Dreamscape envelopes all foes; guaranteed sleep; requires rest."),
        ],
    },
    "Metal": {
        "regular": [
            ("metal_pulse", "Metal Pulse", "Metal", None, 45, 100, 30, "special", None, 0, "single",
             {}, "Resonant metal pulse."),
            ("iron_shockwave", "Iron Shockwave", "Metal", None, 60, 100, 20, "special", "defdown", 30, "wide",
             {}, "Iron-density shockwave on all foes; may lower Def."),
            ("magnet_burst", "Magnet Burst", "Metal", None, 70, 95, 15, "special", None, 0, "single",
             {"alwaysCrit": True}, "Magnetic-field burst; always lands a critical hit."),
            ("chromium_ray", "Chromium Ray", "Metal", None, 75, 100, 15, "special", "crit", 100, "single",
             {"breakerVs": "Mental"}, "Chromium-light ray; super vs Mental; high crit ratio."),
            ("titanic_beam", "Titanic Beam", "Metal", ["Metal", "Mineral"], 90, 95, 10, "special", "spdefdown", 30, "wide",
             {}, "Titanium beam on all foes. Dual Metal+Mineral; may lower SpDef."),
            ("smelter_surge", "Smelter Surge", "Metal", None, 95, 90, 10, "special", "flinch", 20, "single",
             {}, "Forge-energy surge; may flinch."),
            ("mercurial_torrent", "Mercurial Torrent", "Metal", None, 80, 90, 15, "special", "confuse", 30, "single",
             {}, "Quicksilver torrent; may confuse."),
            ("iron_storm", "Iron Storm", "Metal", None, 110, 80, 5, "special", "atkdown", 30, "wide",
             {}, "Iron-shard storm on all foes; may lower Atk."),
            ("tungsten_wrath", "Tungsten Wrath", "Metal", ["Metal", "Earth"], 130, 85, 5, "special", "bleed", 30, "single",
             {}, "Devastating tungsten-blast. Dual Metal+Earth; may inflict Bleed."),
            ("plasma_smelt", "Plasma Smelt", "Metal", None, 100, 85, 10, "special", "burn", 20, "single",
             {}, "Plasma-hot metal; may burn."),
            ("iron_bulwark", "Iron Bulwark", "Metal", None, 0, 100, 15, "status", "defup2", 100, "self",
             {}, "Iron-rigid stance (+2 Def)."),
            ("mirror_polish", "Mirror Polish", "Metal", None, 0, 100, 15, "status", "speup", 100, "self",
             {}, "Polished surface (+1 Speed)."),
            ("armor_meld", "Armor Meld", "Metal", None, 0, 100, 15, "status", "spdefup2", 100, "self",
             {}, "Welds plating (+2 SpDef)."),
            ("corrosion_proof", "Corrosion-Proof", "Metal", None, 0, 100, 10, "status", "heal50", 100, "self",
             {}, "Resists rot; restores half HP."),
        ],
        "exclusive": [
            ("supernova_forge", "Supernova Forge", "Metal", None, 130, 95, 5, "special", "brittle", 100, "wide",
             {"rarity": "exclusive"}, "Wide brittle-inducing forge-blast — signature."),
            ("tungsten_titan", "Tungsten Titan", "Metal", None, 150, 80, 5, "physical", "recharge_and_petrify_target", 30, "single",
             {"rarity": "exclusive"}, "Titan-grade tungsten strike; may inflict Petrify; requires rest."),
            ("ironheart", "Ironheart", "Metal", None, 0, 100, 5, "status", "defup2_and_spdefup2_self", 100, "self",
             {"rarity": "exclusive"}, "Iron-heart resolve: +2 Def AND +2 SpDef."),
        ],
    },
}

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

moves_start = content.index("const MOVES_DATA")
monsters_marker = content.index("// MONSTERS DATA", moves_start)
close_idx = content.rfind("};", moves_start, monsters_marker)

# Add trailing comma to last move if missing
i = close_idx - 1
while i > moves_start and content[i] in " \n\r\t":
    i -= 1
if content[i] == "}":
    content = content[:i+1] + "," + content[i+1:]
    close_idx += 1

# Insert all regular moves first (per type), then all exclusives at the very end
all_regular = "\n"
all_exclusive = ""

for type_name, data in TYPE_DATA.items():
    if data.get("regular"):
        all_regular += f"\n  // --- {type_name} (regular) ---\n"
        for m in data["regular"]:
            all_regular += fmt_move(m) + "\n"
    if data.get("exclusive"):
        all_exclusive += f"\n  // --- {type_name} (exclusive) ---\n"
        for m in data["exclusive"]:
            all_exclusive += fmt_move(m) + "\n"

# Find the position right before the existing exclusive section header
excl_section_marker = content.find("// STEP 3B ADDITIONS — EXCLUSIVE MOVES", moves_start, close_idx)
# Find the start of the exclusive section's `// ==========` block
excl_block_start = content.rfind("\n  // =====", moves_start, excl_section_marker)

# Insert all regular moves right before the exclusive section
content = content[:excl_block_start] + all_regular + content[excl_block_start:]

# Re-locate close_idx since content changed
moves_start = content.index("const MOVES_DATA")
monsters_marker = content.index("// MONSTERS DATA", moves_start)
close_idx = content.rfind("};", moves_start, monsters_marker)

# Insert exclusives right before the closing };
content = content[:close_idx] + all_exclusive + content[close_idx:]

with open(DATA, "w", encoding="utf-8") as f:
    f.write(content)

total_reg = sum(len(d.get("regular", [])) for d in TYPE_DATA.values())
total_excl = sum(len(d.get("exclusive", [])) for d in TYPE_DATA.values())
print(f"Inserted {total_reg} regular + {total_excl} exclusive across {len(TYPE_DATA)} types.")
for type_name, data in TYPE_DATA.items():
    print(f"  {type_name}: +{len(data.get('regular', []))} regular, +{len(data.get('exclusive', []))} exclusive")
