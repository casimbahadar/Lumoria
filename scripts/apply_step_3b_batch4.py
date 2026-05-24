#!/usr/bin/env python3
"""Step 3b — batch 4 (final): 7 types (Primal/Vapor/Mineral/Toxin/Chrono/
Stellar/Dream). Mostly empty-existing types so audits minimal."""

import re

DATA = "/home/user/Lumoria/js/data.js"

def M(mid, name, t, pow, acc, pp, cat, eff=None, ec=0, tgt="single", dual=None, desc="", **extras):
    return (mid, name, t, dual, pow, acc, pp, cat, eff, ec, tgt, extras, desc)

def fmt_move(m):
    mid, name, t, dual, pow, acc, pp, cat, eff, ec, tgt, extras, desc = m
    parts = [f'name:"{name}"', f'type:"{t}"']
    if dual:
        parts.append('dualType:[' + ",".join(f'"{x}"' for x in dual) + ']')
    parts.extend([f'power:{pow}', f'acc:{acc}', f'pp:{pp}', f'cat:"{cat}"'])
    parts.append(f'effect:{"null" if eff is None else chr(34)+eff+chr(34)}')
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
    return f"  {mid+':':<32} {{ " + ", ".join(parts) + " },"

TYPE_DATA = {
    "Primal": {
        "regular": [
            M("primal_jab", "Primal Jab", "Primal", 40, 100, 30, "physical", desc="Quick primal-jab."),
            M("feral_claw", "Feral Claw", "Primal", 60, 100, 20, "physical", desc="Feral claw-strike."),
            M("savage_bite", "Savage Bite", "Primal", 75, 100, 15, "physical", desc="Savage bite."),
            M("wild_strike", "Wild Strike", "Primal", 85, 95, 15, "physical", desc="Wild strike.", alwaysCrit=True),
            M("beast_charge", "Beast Charge", "Primal", 90, 90, 10, "physical", dual=["Primal", "Normal"], desc="Beast charge. Dual Primal+Normal."),
            M("crushing_jaws", "Crushing Jaws", "Primal", 95, 90, 10, "physical", "defdown", 30, desc="Crushing jaws; may lower Def."),
            M("raw_fury", "Raw Fury", "Primal", 100, 85, 10, "physical", desc="Raw fury strike."),
            M("primal_smash", "Primal Smash", "Primal", 110, 85, 5, "physical", tgt="wide", desc="Wide primal smash."),
            M("ancient_strike", "Ancient Strike", "Primal", 80, 95, 15, "physical", desc="Ancient strike."),
            M("apex_predator", "Apex Predator", "Primal", 120, 80, 5, "physical", desc="Apex-predator finish."),
            M("primal_roar", "Primal Roar", "Primal", 50, 100, 30, "special", "atkdown", 30, tgt="wide", desc="Primal roar; may lower Atk."),
            M("ancient_pulse", "Ancient Pulse", "Primal", 70, 100, 15, "special", desc="Ancient-energy pulse."),
            M("wild_aura", "Wild Aura", "Primal", 85, 90, 10, "special", "atkup", 30, desc="Wild aura; may raise own Atk."),
            M("soul_eater_p", "Soul Eater", "Primal", 90, 95, 10, "special", "drain", 100, desc="Drains essence.", breakerVs="Aether"),
            M("primal_eruption", "Primal Eruption", "Primal", 100, 85, 10, "special", tgt="wide", desc="Wide primal eruption."),
            M("world_devour", "World Devour", "Primal", 130, 80, 5, "special", desc="World-devouring blast."),
            M("primal_focus", "Primal Focus", "Primal", 0, 100, 15, "status", "focus", 100, "self", desc="High crit."),
            M("feral_armor", "Feral Armor", "Primal", 0, 100, 15, "status", "defup", 100, "self", desc="+1 Def."),
            M("wild_rage", "Wild Rage", "Primal", 0, 100, 10, "status", "atkup2", 100, "self", desc="+2 Atk."),
            M("ancient_calm", "Ancient Calm", "Primal", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
            M("beast_speed", "Beast Speed", "Primal", 0, 100, 15, "status", "speup", 100, "self", desc="+1 Speed."),
            M("primal_meditation", "Primal Meditation", "Primal", 0, 100, 15, "status", "calmup", 100, "self", desc="Calm-up."),
        ],
        "exclusive": [
            M("world_eater", "World Eater", "Primal", 130, 85, 5, "physical", "bleed", 100, desc="Guaranteed bleed.", rarity="exclusive"),
            M("primal_calamity", "Primal Calamity", "Primal", 0, 100, 5, "status", "atkup2_and_defup2_self", 100, "self", desc="+2 Atk AND +2 Def.", rarity="exclusive"),
            M("age_ender", "Age Ender", "Primal", 150, 80, 5, "physical", "recharge_and_petrify_target", 100, dual=["Primal", "Earth"], desc="May Petrify; needs rest. Dual Primal+Earth.", rarity="exclusive"),
        ],
    },
    "Vapor": {
        "regular": [
            M("vapor_jab", "Vapor Jab", "Vapor", 40, 100, 30, "physical", desc="Quick vapor-jab."),
            M("mist_strike", "Mist Strike", "Vapor", 60, 100, 20, "physical", desc="Mist-veiled strike."),
            M("steam_punch", "Steam Punch", "Vapor", 75, 100, 15, "physical", "burn", 20, desc="Steam-hot punch; may burn."),
            M("cloud_strike", "Cloud Strike", "Vapor", 80, 95, 15, "physical", desc="Cloud-form strike."),
            M("fog_kick", "Fog Kick", "Vapor", 70, 100, 20, "physical", "accdown", 30, desc="Fog-kick; may lower Acc.", alwaysCrit=True),
            M("mist_lash", "Mist Lash", "Vapor", 85, 90, 10, "physical", desc="Mist-whip strike."),
            M("boiling_strike", "Boiling Strike", "Vapor", 90, 90, 10, "physical", "burn", 30, desc="Boiling-hot strike."),
            M("steam_slam", "Steam Slam", "Vapor", 100, 85, 10, "physical", desc="Steam-pressure slam."),
            M("cloud_smash", "Cloud Smash", "Vapor", 95, 90, 10, "physical", "spedown", 30, desc="Cloud-smash; may slow."),
            M("mist_press", "Mist Press", "Vapor", 110, 85, 5, "physical", tgt="wide", dual=["Vapor", "Aquatic"], desc="Wide mist-press. Dual Vapor+Aquatic."),
            M("miasma_blow", "Miasma Blow", "Vapor", 80, 95, 15, "physical", "poison", 20, desc="Miasma-poisoned blow."),
            M("vapor_drill", "Vapor Drill", "Vapor", 95, 95, 10, "physical", desc="Vapor-condensed drill."),
            M("mist_s", "Mist Pulse", "Vapor", 40, 100, 30, "special", tgt="wide", desc="Wide mist pulse."),
            M("fog_beam", "Fog Beam", "Vapor", 55, 100, 20, "special", "accdown", 20, tgt="wide", desc="Fog beam; may lower Acc."),
            M("steam_burst", "Steam Burst", "Vapor", 65, 100, 20, "special", "burn", 20, desc="Steam burst; may burn."),
            M("vapor_ray", "Vapor Ray", "Vapor", 70, 100, 20, "special", desc="Vapor ray."),
            M("mist_pulse", "Mist Resonance", "Vapor", 75, 95, 15, "special", tgt="wide", desc="Wide mist resonance."),
            M("boil_v", "Boil", "Vapor", 80, 95, 15, "special", "burn", 30, desc="Boil-attack; may burn."),
            M("cloud_blast", "Cloud Blast", "Vapor", 85, 90, 10, "special", tgt="wide", desc="Wide cloud blast."),
            M("miasma_wave", "Miasma Wave", "Vapor", 65, 100, 20, "special", "poison", 20, tgt="wide", desc="Miasma wave; may poison."),
            M("fog_storm", "Fog Storm", "Vapor", 90, 90, 10, "special", "accdown", 30, tgt="wide", desc="Fog storm; may lower Acc.", breakerVs="Fire"),
            M("drizzle", "Drizzle", "Vapor", 50, 100, 25, "special", desc="Light drizzle."),
            M("condense", "Condense", "Vapor", 80, 95, 15, "special", "spedown", 30, desc="Condensing pressure; may slow."),
            M("vapor_eruption", "Vapor Eruption", "Vapor", 100, 85, 10, "special", tgt="wide", desc="Wide vapor eruption."),
            M("stream_burst", "Stream Burst", "Vapor", 70, 100, 20, "special", desc="Pressurized stream."),
            M("acid_mist", "Acid Mist", "Vapor", 80, 95, 15, "special", "poison", 30, desc="Acid mist; may poison."),
            M("corrosive_fog", "Corrosive Fog", "Vapor", 90, 90, 10, "special", "spdefdown", 30, tgt="wide", desc="Corrosive fog; may lower SpDef."),
            M("steam_storm", "Steam Storm", "Vapor", 95, 90, 10, "special", "burn", 20, tgt="wide", desc="Steam storm; may burn."),
            M("mist_flood", "Mist Flood", "Vapor", 110, 85, 5, "special", tgt="wide", desc="Flooding mist on all foes."),
            M("miasma_apocalypse", "Miasma Apocalypse", "Vapor", 130, 85, 5, "special", "poison", 30, tgt="wide", desc="Wide miasma; may poison."),
            M("burning_mist", "Burning Mist", "Vapor", 85, 95, 10, "special", "burn", 30, desc="Burning mist."),
            M("abyssal_mist", "Abyssal Mist", "Vapor", 100, 85, 10, "special", dual=["Vapor", "Dark"], desc="Dark-charged mist. Dual Vapor+Dark."),
            M("vapor_focus", "Vapor Focus", "Vapor", 0, 100, 15, "status", "focus", 100, "self", desc="High crit."),
            M("mist_veil", "Mist Veil", "Vapor", 0, 100, 15, "status", "defup", 100, "self", desc="+1 Def."),
            M("fog_screen", "Fog Screen", "Vapor", 0, 100, 15, "status", "spdefup", 100, "self", desc="+1 SpDef."),
            M("cloud_form", "Cloud Form", "Vapor", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
            M("mist_speed", "Mist Speed", "Vapor", 0, 100, 15, "status", "speup", 100, "self", desc="+1 Speed."),
            M("condense_form", "Condense Form", "Vapor", 0, 100, 15, "status", "atkup", 100, "self", desc="+1 Atk."),
            M("evaporate", "Evaporate", "Vapor", 0, 100, 15, "status", "accup", 100, "self", desc="+1 Acc."),
            M("mist_meditation", "Mist Meditation", "Vapor", 0, 100, 15, "status", "calmup", 100, "self", desc="Calm-up."),
            M("vapor_calm", "Vapor Calm", "Vapor", 0, 100, 10, "status", "defup2", 100, "self", desc="+2 Def."),
            M("boiling_rage", "Boiling Rage", "Vapor", 0, 100, 10, "status", "atkup2", 100, "self", desc="+2 Atk."),
        ],
        "exclusive": [
            M("vapor_shroud", "Vapor Shroud", "Vapor", 0, 100, 5, "status", "smothered", 100, desc="Smothers the target.", rarity="exclusive"),
            M("miasma_calamity", "Miasma Calamity", "Vapor", 130, 85, 5, "special", "poison", 100, "wide", desc="Wide guaranteed poison.", rarity="exclusive"),
            M("heat_death", "Heat Death", "Vapor", 150, 85, 5, "special", "recharge_and_burnt_out_target", 100, "wide", desc="Inflicts Burnt-out; needs rest.", rarity="exclusive"),
        ],
    },
    "Mineral": {
        "regular": [
            M("mineral_jab", "Mineral Jab", "Mineral", 40, 100, 30, "physical", desc="Quick mineral-jab."),
            M("mineral_strike", "Mineral Strike", "Mineral", 60, 100, 20, "physical", desc="Mineral-strike."),
            M("ore_punch", "Ore Punch", "Mineral", 75, 100, 15, "physical", desc="Ore-clad punch."),
            M("mineral_crystal_shard", "Crystal Shard", "Mineral", 80, 95, 15, "physical", desc="Sharp-shard strike."),
            M("mineral_smash", "Mineral Smash", "Mineral", 85, 95, 15, "physical", "defdown", 30, desc="May lower Def."),
            M("ore_smash", "Ore Smash", "Mineral", 90, 90, 10, "physical", desc="Heavy ore-smash.", alwaysCrit=True),
            M("shard_volley", "Shard Volley", "Mineral", 50, 95, 15, "physical", "hits", 0, desc="Triple shard-volley."),
            M("quarry_crush", "Quarry Crush", "Mineral", 95, 90, 10, "physical", dual=["Mineral", "Earth"], desc="Quarry crush. Dual Mineral+Earth."),
            M("mineral_press", "Mineral Press", "Mineral", 100, 85, 10, "physical", tgt="wide", desc="Wide mineral-press."),
            M("obsidian_strike", "Obsidian Strike", "Mineral", 110, 85, 5, "physical", desc="Obsidian-sharp strike.", breakerVs="Wind"),
            M("mineral_pulse", "Mineral Pulse", "Mineral", 45, 100, 30, "special", desc="Mineral pulse."),
            M("ore_ray", "Ore Ray", "Mineral", 70, 100, 20, "special", desc="Ore-ray."),
            M("shard_burst_m", "Shard Burst", "Mineral", 80, 95, 15, "special", "spdefdown", 30, tgt="wide", desc="Shard burst; may lower SpDef."),
            M("crystal_glow", "Crystal Glow", "Mineral", 85, 90, 10, "special", tgt="wide", desc="Wide crystal-glow."),
            M("mineral_resonance", "Mineral Resonance", "Mineral", 90, 90, 10, "special", dual=["Mineral", "Sonic"], desc="Resonant burst. Dual Mineral+Sonic."),
            M("gem_storm", "Gem Storm", "Mineral", 100, 85, 10, "special", tgt="wide", desc="Wide gem-storm."),
            M("mineral_eruption", "Mineral Eruption", "Mineral", 110, 85, 5, "special", tgt="wide", desc="Wide mineral eruption."),
            M("quartz_blast", "Quartz Blast", "Mineral", 120, 80, 5, "special", desc="High-power quartz-blast."),
            M("mineral_focus", "Mineral Focus", "Mineral", 0, 100, 15, "status", "focus", 100, "self", desc="High crit."),
            M("ore_armor", "Ore Armor", "Mineral", 0, 100, 15, "status", "defup2", 100, "self", desc="+2 Def."),
            M("shard_form", "Shard Form", "Mineral", 0, 100, 15, "status", "atkup", 100, "self", desc="+1 Atk."),
            M("mineral_lattice", "Mineral Lattice", "Mineral", 0, 100, 15, "status", "spdefup2", 100, "self", desc="+2 SpDef."),
            M("mineral_heal", "Mineral Heal", "Mineral", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
            M("quarry_speed", "Quarry Speed", "Mineral", 0, 100, 15, "status", "speup", 100, "self", desc="+1 Speed."),
        ],
        "exclusive": [
            M("earth_shatter", "Earth Shatter", "Mineral", 130, 85, 5, "physical", "brittle", 100, "wide", desc="Locks Brittle on all foes.", rarity="exclusive"),
            M("mineral_apocalypse", "Mineral Apocalypse", "Mineral", 0, 100, 5, "status", "petrify", 100, desc="Petrifies the target.", rarity="exclusive"),
            M("starcore_burst", "Starcore Burst", "Mineral", 150, 80, 5, "special", "recharge_and_bleed_target", 30, "wide", desc="Wide; may inflict Bleed; needs rest.", rarity="exclusive"),
        ],
    },
    "Toxin": {
        "regular": [
            M("tox_jab", "Toxin Jab", "Toxin", 40, 100, 30, "physical", desc="Quick toxin-jab."),
            M("tox_fang", "Venom Fang", "Toxin", 55, 100, 25, "physical", "poison", 30, desc="Venom-fang; may poison."),
            M("tox_bite", "Toxin Bite", "Toxin", 65, 100, 20, "physical", "poison", 30, desc="Toxin bite."),
            M("tox_acid_strike", "Acid Strike", "Toxin", 75, 100, 15, "physical", desc="Acid-strike."),
            M("tox_corrosive_claw", "Corrosive Claw", "Toxin", 80, 95, 15, "physical", "defdown", 30, desc="May lower Def."),
            M("tox_lash", "Toxic Lash", "Toxin", 70, 100, 20, "physical", "poison", 30, desc="Toxic lash."),
            M("tox_venom_thrust", "Venom Thrust", "Toxin", 85, 90, 15, "physical", "poison", 50, desc="Venom-thrust; high poison chance.", alwaysCrit=True),
            M("tox_slash", "Acid Slash", "Toxin", 90, 95, 10, "physical", desc="Acid-slash."),
            M("tox_sting", "Toxic Sting", "Toxin", 50, 100, 30, "physical", "priority", 0, desc="First-strike sting."),
            M("tox_miasma_strike", "Miasma Strike", "Toxin", 80, 100, 15, "physical", "poison", 30, desc="Miasma-strike."),
            M("tox_burst_phy", "Corrosive Burst", "Toxin", 95, 90, 10, "physical", "defdown", 30, desc="Corrosive burst."),
            M("tox_kiss", "Toxic Kiss", "Toxin", 60, 100, 20, "physical", "poison", 100, desc="Guaranteed poison."),
            M("tox_drown", "Venom Drown", "Toxin", 85, 95, 10, "physical", tgt="wide", desc="Drowning venom."),
            M("tox_press", "Acid Press", "Toxin", 100, 85, 10, "physical", desc="Acid-press."),
            M("tox_plague_claw", "Plague Claw", "Toxin", 90, 90, 10, "physical", dual=["Toxin", "Nature"], desc="Plague-tipped. Dual Toxin+Nature."),
            M("tox_lash2", "Miasma Lash", "Toxin", 75, 95, 15, "physical", desc="Miasma-lash."),
            M("tox_smash", "Toxin Smash", "Toxin", 110, 85, 5, "physical", desc="Toxin-smash."),
            M("tox_storm_phy", "Venom Storm", "Toxin", 105, 85, 10, "physical", tgt="wide", desc="Wide venom-storm."),
            M("tox_finish", "Corrosive Finish", "Toxin", 120, 85, 5, "physical", desc="Closing corrosive finish."),
            M("tox_plague_strike", "Plague Strike", "Toxin", 95, 90, 10, "physical", desc="Plague-strike.", breakerVs="Fairy"),
            M("tox_pulse", "Toxin Pulse", "Toxin", 45, 100, 30, "special", desc="Single toxin-pulse."),
            M("tox_venom_ray", "Venom Ray", "Toxin", 65, 100, 20, "special", "poison", 30, desc="Venom ray."),
            M("tox_acid_burst", "Acid Burst", "Toxin", 80, 95, 15, "special", "spdefdown", 30, tgt="wide", desc="Acid burst."),
            M("tox_miasma_blast", "Miasma Blast", "Toxin", 90, 95, 10, "special", "poison", 30, tgt="wide", desc="Miasma blast."),
            M("tox_storm_spec", "Toxin Storm", "Toxin", 100, 85, 10, "special", tgt="wide", desc="Wide toxin storm."),
            M("tox_plague_wave", "Plague Wave", "Toxin", 110, 85, 5, "special", tgt="wide", dual=["Toxin", "Dream"], desc="Wide plague-wave. Dual Toxin+Dream."),
            M("tox_focus", "Toxin Focus", "Toxin", 0, 100, 15, "status", "focus", 100, "self", desc="High crit."),
            M("tox_venom_field", "Venom Field", "Toxin", 0, 100, 15, "status", "atkup", 100, "self", desc="+1 Atk."),
            M("tox_acid_armor", "Acid Armor", "Toxin", 0, 100, 15, "status", "defup", 100, "self", desc="+1 Def."),
            M("tox_corrosive_step", "Corrosive Step", "Toxin", 0, 100, 15, "status", "speup", 100, "self", desc="+1 Speed."),
            M("tox_miasma_screen", "Miasma Screen", "Toxin", 0, 100, 15, "status", "spdefup", 100, "self", desc="+1 SpDef."),
            M("tox_poison_resolve", "Poison Resolve", "Toxin", 0, 100, 10, "status", "atkup2", 100, "self", desc="+2 Atk."),
            M("tox_plague_charge", "Plague Charge", "Toxin", 0, 100, 15, "status", "spaup", 100, "self", desc="+1 SpA."),
            M("tox_calm", "Toxin Calm", "Toxin", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
            M("tox_venom_mark", "Venom Mark", "Toxin", 0, 100, 15, "status", "atkdown", 100, desc="Lowers foe's Atk."),
            M("tox_acidic_glance", "Acidic Glance", "Toxin", 0, 100, 15, "status", "defdown", 100, desc="Lowers foe's Def."),
            M("tox_miasma_lure", "Miasma Lure", "Toxin", 0, 100, 15, "status", "spedown", 100, desc="Lowers foe's Speed."),
            M("tox_plague_meditation", "Plague Meditation", "Toxin", 0, 100, 15, "status", "calmup", 100, "self", desc="Calm-up."),
        ],
        "exclusive": [
            M("tox_tainted_breath", "Tainted Breath", "Toxin", 130, 85, 5, "special", "tainted", 100, "wide", desc="Locks Tainted on all foes.", rarity="exclusive"),
            M("tox_plague_bringer", "Plague Bringer", "Toxin", 0, 100, 5, "status", "poison_and_atkdown_target", 100, "wide", desc="Poisons all foes AND lowers Atk.", rarity="exclusive"),
            M("tox_necrotic_apocalypse", "Necrotic Apocalypse", "Toxin", 150, 80, 5, "special", "recharge_and_severe_bleed_target", 30, "wide", desc="May inflict Severe Bleed; needs rest.", rarity="exclusive"),
        ],
    },
    "Chrono": {
        "regular": [
            M("chrono_jab", "Chrono Jab", "Chrono", 40, 100, 30, "physical", desc="Quick chrono-jab."),
            M("time_strike", "Time Strike", "Chrono", 60, 100, 20, "physical", desc="Time-distorted strike."),
            M("temporal_slash", "Temporal Slash", "Chrono", 75, 100, 15, "physical", desc="Temporal slash."),
            M("era_punch", "Era Punch", "Chrono", 85, 95, 15, "physical", desc="Aged-fist punch.", alwaysCrit=True),
            M("chrono_smash", "Chrono Smash", "Chrono", 95, 90, 10, "physical", desc="Chrono-smash."),
            M("timefade_strike", "Timefade Strike", "Chrono", 90, 95, 10, "physical", desc="Time-fading strike."),
            M("era_crush", "Era Crush", "Chrono", 100, 85, 10, "physical", desc="Era-crushing impact."),
            M("chrono_press", "Chrono Press", "Chrono", 110, 85, 5, "physical", dual=["Chrono", "Aether"], desc="Chrono-press. Dual Chrono+Aether."),
            M("epoch_strike", "Epoch Strike", "Chrono", 80, 95, 15, "physical", desc="Epoch-strike."),
            M("timewarp_blow", "Timewarp Blow", "Chrono", 120, 85, 5, "physical", desc="Timewarp blow.", breakerVs="Spectral"),
            M("chrono_pulse", "Chrono Pulse", "Chrono", 45, 100, 30, "special", desc="Chrono pulse."),
            M("time_ray", "Time Ray", "Chrono", 65, 100, 20, "special", desc="Time ray."),
            M("temporal_wave", "Temporal Wave", "Chrono", 75, 95, 15, "special", tgt="wide", desc="Wide temporal wave."),
            M("era_burst", "Era Burst", "Chrono", 80, 90, 10, "special", tgt="wide", desc="Era burst."),
            M("chrono_blast", "Chrono Blast", "Chrono", 90, 90, 10, "special", desc="Chrono blast."),
            M("timefade_beam", "Timefade Beam", "Chrono", 85, 90, 10, "special", desc="Timefade beam."),
            M("age_burst", "Age Burst", "Chrono", 100, 85, 10, "special", tgt="wide", desc="Wide age burst."),
            M("epoch_eruption", "Epoch Eruption", "Chrono", 110, 85, 5, "special", tgt="wide", desc="Wide epoch eruption."),
            M("chrono_storm", "Chrono Storm", "Chrono", 95, 90, 10, "special", "sluggish", 30, tgt="wide", desc="Chrono storm; may inflict Sluggish."),
            M("era_calamity", "Era Calamity", "Chrono", 120, 85, 5, "special", dual=["Chrono", "Stellar"], desc="Era calamity. Dual Chrono+Stellar."),
            M("chrono_focus", "Chrono Focus", "Chrono", 0, 100, 15, "status", "focus", 100, "self", desc="High crit."),
            M("time_meditation", "Time Meditation", "Chrono", 0, 100, 15, "status", "calmup", 100, "self", desc="Calm-up."),
            M("temporal_armor", "Temporal Armor", "Chrono", 0, 100, 15, "status", "defup2", 100, "self", desc="+2 Def."),
            M("era_calm", "Era Calm", "Chrono", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
            M("chrono_speed", "Chrono Speed", "Chrono", 0, 100, 10, "status", "speup2", 100, "self", desc="+2 Speed."),
            M("timefade_step", "Timefade Step", "Chrono", 0, 100, 15, "status", "speup", 100, "self", desc="+1 Speed."),
            M("age_resolve", "Age Resolve", "Chrono", 0, 100, 15, "status", "atkup", 100, "self", desc="+1 Atk."),
            M("epoch_charge", "Epoch Charge", "Chrono", 0, 100, 15, "status", "spaup", 100, "self", desc="+1 SpA."),
            M("chrono_lock", "Chrono Lock", "Chrono", 0, 100, 15, "status", "spedown", 100, desc="Lowers foe's Speed."),
            M("timewarp_meditation", "Timewarp Meditation", "Chrono", 0, 100, 15, "status", "accup", 100, "self", desc="+1 Acc."),
        ],
        "exclusive": [
            M("chronoshift", "Chronoshift", "Chrono", 130, 85, 5, "special", "sluggish", 100, "wide", desc="Locks Sluggish on all foes.", rarity="exclusive"),
            M("eternal_age", "Eternal Age", "Chrono", 0, 100, 5, "status", "weighed_down", 100, desc="Permanently weighs target down.", rarity="exclusive"),
            M("timeless_apocalypse", "Timeless Apocalypse", "Chrono", 150, 80, 5, "special", "recharge_and_petrify_target", 100, desc="Guaranteed Petrify; needs rest.", rarity="exclusive"),
        ],
    },
    "Stellar": {
        "regular": [
            M("star_jab", "Star Jab", "Stellar", 40, 100, 30, "physical", desc="Quick star-jab."),
            M("stellar_strike", "Stellar Strike", "Stellar", 70, 100, 15, "physical", desc="Stellar strike."),
            M("galaxy_punch_phy", "Galaxy Punch", "Stellar", 85, 95, 15, "physical", desc="Galaxy-punch.", alwaysCrit=True),
            M("cosmic_slam", "Cosmic Slam", "Stellar", 95, 90, 10, "physical", desc="Cosmic slam."),
            M("nova_strike", "Nova Strike", "Stellar", 90, 95, 10, "physical", dual=["Stellar", "Fire"], desc="Nova-fire strike. Dual Stellar+Fire."),
            M("starlight_charge", "Starlight Charge", "Stellar", 100, 85, 10, "physical", desc="Starlight charge."),
            M("supernova_press", "Supernova Press", "Stellar", 110, 85, 5, "physical", tgt="wide", desc="Wide supernova press."),
            M("cosmic_finisher", "Cosmic Finisher", "Stellar", 120, 85, 5, "physical", desc="Closing cosmic blow."),
            M("stellar_pulse", "Stellar Pulse", "Stellar", 45, 100, 30, "special", desc="Stellar pulse."),
            M("star_ray", "Star Ray", "Stellar", 60, 100, 20, "special", desc="Star ray."),
            M("cosmic_beam", "Cosmic Beam", "Stellar", 70, 100, 20, "special", tgt="wide", desc="Wide cosmic beam."),
            M("nova_burst", "Nova Burst", "Stellar", 80, 95, 15, "special", tgt="wide", desc="Wide nova burst."),
            M("supernova_blast", "Supernova Blast", "Stellar", 90, 90, 10, "special", desc="Supernova blast."),
            M("galactic_wave", "Galactic Wave", "Stellar", 85, 95, 15, "special", tgt="wide", desc="Galactic wave."),
            M("starlight_beam", "Starlight Beam", "Stellar", 75, 100, 15, "special", desc="Starlight beam.", breakerVs="Dark"),
            M("cosmic_storm", "Cosmic Storm", "Stellar", 95, 90, 10, "special", tgt="wide", desc="Cosmic storm."),
            M("supernova_eruption", "Supernova Eruption", "Stellar", 110, 85, 5, "special", tgt="wide", desc="Wide supernova eruption."),
            M("starfall_s", "Starfall", "Stellar", 100, 90, 10, "special", desc="Starfall."),
            M("cosmic_flare", "Cosmic Flare", "Stellar", 90, 95, 10, "special", desc="Cosmic flare."),
            M("nebula_burst", "Nebula Burst", "Stellar", 95, 90, 10, "special", "confuse", 30, tgt="wide", desc="Nebula burst; may confuse."),
            M("nova_calamity", "Nova Calamity", "Stellar", 105, 85, 10, "special", tgt="wide", desc="Wide nova calamity."),
            M("astral_blast", "Astral Blast", "Stellar", 120, 85, 5, "special", desc="High-power astral blast."),
            M("galaxy_apocalypse", "Galaxy Apocalypse", "Stellar", 130, 85, 5, "special", tgt="wide", desc="Wide galaxy apocalypse."),
            M("stellar_focus", "Stellar Focus", "Stellar", 0, 100, 15, "status", "focus", 100, "self", desc="High crit."),
            M("cosmic_meditation", "Cosmic Meditation", "Stellar", 0, 100, 15, "status", "calmup", 100, "self", desc="Calm-up."),
            M("nova_armor", "Nova Armor", "Stellar", 0, 100, 15, "status", "defup", 100, "self", desc="+1 Def."),
            M("star_calm", "Star Calm", "Stellar", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
            M("galactic_speed", "Galactic Speed", "Stellar", 0, 100, 15, "status", "speup", 100, "self", desc="+1 Speed."),
            M("supernova_resolve", "Supernova Resolve", "Stellar", 0, 100, 10, "status", "atkup2", 100, "self", desc="+2 Atk."),
            M("astral_focus", "Astral Focus", "Stellar", 0, 100, 10, "status", "spaup2", 100, "self", desc="+2 SpA."),
            M("cosmic_aura", "Cosmic Aura", "Stellar", 0, 100, 15, "status", "accup", 100, "self", desc="+1 Acc."),
            M("starlight_lock", "Starlight Lock", "Stellar", 0, 100, 15, "status", "spdefdown", 100, desc="Lowers foe's SpDef."),
            M("nebula_meditation", "Nebula Meditation", "Stellar", 0, 100, 15, "status", "spdefup2", 100, "self", desc="+2 SpDef."),
        ],
        "exclusive": [
            M("star_apocalypse", "Star Apocalypse", "Stellar", 130, 85, 5, "special", "brittle", 100, "wide", desc="Locks Brittle on all foes.", rarity="exclusive"),
            M("galaxy_devourer", "Galaxy Devourer", "Stellar", 100, 95, 10, "special", "drain", 100, desc="Drains the target.", rarity="exclusive"),
            M("cosmic_eradication", "Cosmic Eradication", "Stellar", 150, 80, 5, "special", "recharge_and_petrify_target", 100, "wide", dual=["Stellar", "Chrono"], desc="Petrifies all foes; needs rest. Dual Stellar+Chrono.", rarity="exclusive"),
        ],
    },
    "Dream": {
        "regular": [
            M("dream_jab", "Dream Jab", "Dream", 40, 100, 30, "physical", desc="Quick dream-jab."),
            M("nightmare_strike", "Nightmare Strike", "Dream", 70, 100, 15, "physical", desc="Nightmare-strike."),
            M("somnia_punch", "Somnia Punch", "Dream", 80, 95, 15, "physical", desc="Somnia-punch."),
            M("dream_charge", "Dream Charge", "Dream", 85, 95, 15, "physical", desc="Dream-charge.", alwaysCrit=True),
            M("nightmare_slash", "Nightmare Slash", "Dream", 90, 90, 10, "physical", desc="Nightmare-slash."),
            M("dream_press", "Dream Press", "Dream", 95, 90, 10, "physical", dual=["Dream", "Mental"], desc="Dream-press. Dual Dream+Mental."),
            M("lullaby_strike", "Lullaby Strike", "Dream", 100, 85, 10, "physical", "sleep", 30, desc="Lullaby-strike; may sleep."),
            M("dreamscape_smash", "Dreamscape Smash", "Dream", 110, 85, 5, "physical", tgt="wide", desc="Wide dreamscape smash."),
            M("dream_pulse", "Dream Pulse", "Dream", 35, 100, 30, "special", desc="Dream pulse."),
            M("somnia_ray", "Somnia Ray", "Dream", 50, 100, 25, "special", desc="Somnia ray."),
            M("dream_beam", "Dream Beam", "Dream", 65, 100, 20, "special", tgt="wide", desc="Wide dream beam."),
            M("nightmare_burst", "Nightmare Burst", "Dream", 75, 95, 15, "special", "sleep", 20, tgt="wide", desc="Wide; may sleep."),
            M("lullaby_song", "Lullaby Song", "Dream", 70, 100, 20, "special", "sleep", 30, desc="May sleep."),
            M("dream_wave", "Dream Wave", "Dream", 80, 95, 15, "special", tgt="wide", desc="Wide dream wave."),
            M("somnia_blast", "Somnia Blast", "Dream", 85, 90, 10, "special", desc="Somnia blast."),
            M("nightmare_storm", "Nightmare Storm", "Dream", 90, 90, 10, "special", "confuse", 30, tgt="wide", desc="Wide; may confuse."),
            M("dream_eruption", "Dream Eruption", "Dream", 100, 85, 10, "special", tgt="wide", desc="Wide dream eruption."),
            M("lullaby_aura", "Lullaby Aura", "Dream", 75, 100, 15, "special", tgt="wide", desc="Wide lullaby aura."),
            M("dream_breath", "Dream Breath", "Dream", 80, 95, 15, "special", desc="Dream breath."),
            M("nightmare_calamity", "Nightmare Calamity", "Dream", 95, 90, 10, "special", desc="Nightmare calamity."),
            M("somnia_storm", "Somnia Storm", "Dream", 95, 90, 10, "special", tgt="wide", desc="Wide somnia storm."),
            M("dream_swirl", "Dream Swirl", "Dream", 85, 95, 10, "special", "sleep", 30, desc="May sleep."),
            M("nightmare_haunt", "Nightmare Haunt", "Dream", 90, 90, 10, "special", desc="Haunt.", breakerVs="Spectral"),
            M("dream_apocalypse_spec", "Dream Apocalypse", "Dream", 105, 85, 10, "special", tgt="wide", desc="Wide dream apocalypse."),
            M("nightmare_finisher", "Nightmare Finisher", "Dream", 110, 85, 5, "special", desc="Closing nightmare blow."),
            M("starlit_dream", "Starlit Dream", "Dream", 100, 85, 10, "special", dual=["Dream", "Stellar"], desc="Cosmic dream. Dual Dream+Stellar."),
            M("cosmic_nightmare", "Cosmic Nightmare", "Dream", 120, 85, 5, "special", tgt="wide", desc="Wide cosmic-nightmare."),
            M("eternal_dream_n", "Eternal Dream", "Dream", 130, 85, 5, "special", tgt="wide", desc="Wide eternal dream."),
            M("dream_focus", "Dream Focus", "Dream", 0, 100, 15, "status", "focus", 100, "self", desc="High crit."),
            M("nightmare_aura", "Nightmare Aura", "Dream", 0, 100, 15, "status", "atkdown", 100, desc="Lowers foe's Atk."),
            M("somnia_calm", "Somnia Calm", "Dream", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
            M("dream_meditation", "Dream Meditation", "Dream", 0, 100, 15, "status", "calmup", 100, "self", desc="Calm-up."),
            M("lullaby_charge", "Lullaby Charge", "Dream", 0, 100, 15, "status", "spaup", 100, "self", desc="+1 SpA."),
            M("dream_armor", "Dream Armor", "Dream", 0, 100, 15, "status", "defup", 100, "self", desc="+1 Def."),
            M("nightmare_resolve", "Nightmare Resolve", "Dream", 0, 100, 15, "status", "atkup", 100, "self", desc="+1 Atk."),
            M("somnia_speed", "Somnia Speed", "Dream", 0, 100, 15, "status", "speup", 100, "self", desc="+1 Speed."),
            M("dream_focus_acc", "Dream Acuity", "Dream", 0, 100, 15, "status", "accup", 100, "self", desc="+1 Acc."),
            M("nightmare_lock", "Nightmare Lock", "Dream", 0, 100, 15, "status", "spedown", 100, desc="Lowers foe's Speed."),
        ],
        "exclusive": [
            M("dream_devourer", "Dream Devourer", "Dream", 130, 85, 5, "special", "drain", 100, desc="Drains the target.", rarity="exclusive"),
            M("nightmare_bringer", "Nightmare Bringer", "Dream", 0, 100, 5, "status", "sleep_and_atkdown_target", 100, "wide", desc="Sleeps all foes AND lowers Atk.", rarity="exclusive"),
            M("apocalyptic_dream", "Apocalyptic Dream", "Dream", 150, 80, 5, "special", "recharge_and_bleed_target", 100, "wide", desc="Wide bleed; needs rest.", rarity="exclusive"),
        ],
    },
}

with open(DATA, "r", encoding="utf-8") as f:
    content = f.read()

moves_start = content.index("const MOVES_DATA")
monsters_marker = content.index("// MONSTERS DATA", moves_start)
close_idx = content.rfind("};", moves_start, monsters_marker)

i = close_idx - 1
while i > moves_start and content[i] in " \n\r\t":
    i -= 1
if content[i] == "}":
    content = content[:i+1] + "," + content[i+1:]
    close_idx += 1

all_regular = ""
all_exclusive = ""
for type_name, data in TYPE_DATA.items():
    if data.get("regular"):
        all_regular += f"\n  // --- {type_name} (regular, batch4) ---\n"
        for m in data["regular"]:
            all_regular += fmt_move(m) + "\n"
    if data.get("exclusive"):
        all_exclusive += f"\n  // --- {type_name} (exclusive, batch4) ---\n"
        for m in data["exclusive"]:
            all_exclusive += fmt_move(m) + "\n"

excl_section_marker = content.rfind("// STEP 3B ADDITIONS — EXCLUSIVE MOVES", moves_start, close_idx)
excl_block_start = content.rfind("\n  // =====", moves_start, excl_section_marker)
content = content[:excl_block_start] + all_regular + content[excl_block_start:]

moves_start = content.index("const MOVES_DATA")
monsters_marker = content.index("// MONSTERS DATA", moves_start)
close_idx = content.rfind("};", moves_start, monsters_marker)
content = content[:close_idx] + all_exclusive + content[close_idx:]

with open(DATA, "w", encoding="utf-8") as f:
    f.write(content)

total_reg = sum(len(d.get("regular", [])) for d in TYPE_DATA.values())
total_excl = sum(len(d.get("exclusive", [])) for d in TYPE_DATA.values())
print(f"Inserted {total_reg} regular + {total_excl} exclusive across {len(TYPE_DATA)} types.")
for tn, d in TYPE_DATA.items():
    print(f"  {tn}: +{len(d.get('regular', []))} regular, +{len(d.get('exclusive', []))} exclusive")
