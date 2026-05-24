#!/usr/bin/env python3
"""Step 3b — batch 3: 8 types (Poison/Mental/Draconic/Normal/Spectral/
Fighting/Aether/Crystal). Includes existing-effect modifications for
variety where existing moves were heavily repeating an effect."""

import re

DATA = "/home/user/Lumoria/js/data.js"

# Existing-move effect modifications per type
EXISTING_EFFECT_CHANGES = [
    # === RETROACTIVE BATCH 2 AUDITS (variety fixes for already-committed types) ===
    # Nature — diversify the 8 null-effect physical moves
    ("bullet_seed", "hits", 0),
    ("fury_cutter", "crit", 100),
    ("pin_missile", "hits", 0),
    ("petal_blitz", "flinch", 30),
    ("root_lance", "defdown", 30),
    ("pod_blast", "flinch", 30),
    ("shear_strike", "crit", 100),
    ("cocoon_burst", "flinch", 30),
    ("hivemind_surge", "spaup", 30),
    ("verdant_surge", "atkup", 30),
    # Electric — reduce paralyze count (18 → 12)
    ("volt_fang", "atkdown", 30),
    ("volt_rail", "spedown", 30),
    ("voltaic_fang", "defdown", 30),
    ("discharge", "spedown", 30),
    ("volt_jet", "atkup", 30),
    ("volt_surge", "spaup", 30),
    # Earth — diversify minor repetition
    ("sinkhole_maw", "atkdown", 30),
    ("scorched_sand", "atkdown", 30),
    ("smoldering_abyss", "spdefdown", 30),
    # Wind — reduce flinch + spedown
    ("aerial_assault", "atkdown", 30),
    ("aerial_slam", "defdown", 30),
    ("gale_strike", "speup", 30),
    ("jetstream", "spdefdown", 30),
    # Ice — reduce freeze count
    ("cryo_plate", "defdown", 30),
    ("hoarfrost_bite", "atkdown", 30),
    ("aurora_blast", "spdefdown", 30),
    ("cryogenic_breath", "spaup", 30),
    # Dark — reduce spdefdown spec heavy
    ("dark_corrosion", "defdown", 30),
    ("malice_beam", "atkdown", 30),
    ("void_sphere", "flinch", 30),
    ("wicked_torrent", "spedown", 30),
    # Fairy — reduce spatkdown + null
    ("celestial_wave", "flinch", 30),
    ("moonlit_surge", "atkdown", 30),
    ("radiant_burst", "confuse", 30),
    ("lunar_burst", "spedown", 30),
    ("glitter_storm", "spdefdown", 30),
    ("prism_flare", "crit", 100),
    ("glimmering_song", "atkup", 30),
    ("starfall", "flinch", 30),
    # Metal — reduce defup status count
    ("ironskin", "atkup", 100),
    ("slag_shield", "spdefup", 100),
    # === BATCH 3 (Poison/Mental/Draconic/Normal existing audits) ===
    # Poison — reduce poison-effect count from 15 to ~9
    ("acid_rain", "spdefdown", 30),
    ("sludge_wave", "defdown", 30),
    ("blight_mist", "atkdown", 30),
    ("gunk_blast", "spdefdown", 30),
    ("corrosive_rain", "defdown", 30),
    ("acid_burst", "spedown", 30),
    # Mental — reduce confuse + spdefdown variety
    ("psi_burst", "atkdown", 30),
    ("telepathic_slam", "spedown", 30),
    ("neural_storm", "flinch", 30),
    ("thought_wave", "spaup", 30),
    ("veil_collapse", "defdown", 30),
    ("thought_crush", "defdown", 30),
    ("astral_rend", "flinch", 30),
    ("mind_burst", "spaup", 30),
    ("thought_stream", "drain", 100),
    # Draconic
    ("draconic_claw", "crit", 100),
    ("scale_storm", "flinch", 30),
    ("drake_rush", "speup", 30),
    ("draconic_rage", "atkup", 30),
    ("draconic_rush", "defdown", 30),
    ("twister", "confuse", 30),
    ("draconic_maw", "atkdown", 30),
    # Normal
    ("momentum_rush", "speup", 30),
    ("wild_tumble", "spedown", 30),
    ("rapid_strike", "crit", 100),
    ("echoing_shout", "spdefdown", 30),
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
    return f"  {mid+':':<28} {{ " + ", ".join(parts) + " },"

# Format: (id, name, type, dualType, power, acc, pp, cat, effect, ec, target, extras, desc)
def M(mid, name, t, pow, acc, pp, cat, eff=None, ec=0, tgt="single", dual=None, desc="", **extras):
    return (mid, name, t, dual, pow, acc, pp, cat, eff, ec, tgt, extras, desc)

TYPE_DATA = {
    "Poison": {
        "regular": [
            M("venom_jab", "Venom Jab", "Poison", 40, 100, 30, "physical", desc="Quick venom jab."),
            M("plague_strike", "Plague Strike", "Poison", 65, 100, 20, "physical", "poison", 30, desc="Plague-tipped strike; may poison."),
            M("corrosive_bite", "Corrosive Bite", "Poison", 80, 95, 15, "physical", "defdown", 30, desc="Corrosive bite; may lower Def.", breakerVs="Aether"),
            M("toxic_lash", "Toxic Lash", "Poison", 90, 85, 10, "physical", desc="Whipping toxic lash.", alwaysCrit=True),
            M("venom_drown", "Venom Drown", "Poison", 110, 85, 5, "physical", tgt="wide", dual=["Poison", "Aquatic"], desc="Toxic flood across all foes. Dual Poison+Aquatic."),
        ],
        "exclusive": [
            M("plague_bringer", "Plague Bringer", "Poison", 130, 90, 5, "physical", "tainted", 100, "wide", desc="Inflicts Tainted on all foes.", rarity="exclusive"),
            M("miasma_storm", "Miasma Storm", "Poison", 100, 90, 10, "special", "poison", 100, "wide", desc="Guaranteed poison wide attack.", rarity="exclusive"),
            M("necrotic_burst", "Necrotic Burst", "Poison", 150, 80, 5, "special", "recharge_and_bleed_target", 100, desc="Necrotic blast; bleed + rest.", rarity="exclusive"),
        ],
    },
    "Mental": {
        "regular": [
            M("psy_jab", "Psy Jab", "Mental", 40, 100, 30, "physical", desc="Quick psy-jab."),
            M("mind_strike", "Mind Strike", "Mental", 65, 100, 20, "physical", desc="Focused mind-strike."),
            M("telekinetic_throw", "Telekinetic Throw", "Mental", 75, 95, 15, "physical", desc="Telekinetic throw."),
            M("brain_blast_p", "Brain Blast", "Mental", 85, 90, 10, "physical", "confuse", 30, desc="Brain-rattling blast."),
            M("cerebral_punch", "Cerebral Punch", "Mental", 95, 90, 10, "physical", "spdefdown", 30, desc="Mind-piercing punch.", alwaysCrit=True),
            M("mind_breaker_phy", "Mindbreaker", "Mental", 110, 85, 5, "physical", tgt="wide", dual=["Mental", "Sonic"], desc="Sonic-laced mind-breaker. Dual Mental+Sonic."),
            M("mental_pulse_n", "Mental Pulse", "Mental", 70, 100, 15, "special", "spdefdown", 20, tgt="wide", desc="Pulse on all foes; may lower SpDef."),
            M("mind_meld", "Mind Meld", "Mental", 90, 95, 10, "special", desc="Mental fusion strike.", breakerVs="Aether"),
            M("mind_focus_s", "Mind Focus", "Mental", 0, 100, 15, "status", "focus", 100, "self", desc="Focused mind; high crit."),
            M("cerebral_calm", "Cerebral Calm", "Mental", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
            M("mental_overflow", "Mental Overflow", "Mental", 0, 100, 10, "status", "spaup2", 100, "self", desc="+2 SpA."),
            M("psyche_lock", "Psyche Lock", "Mental", 0, 100, 15, "status", "atkdown", 100, desc="Locks foe's Atk (-1)."),
        ],
        "exclusive": [
            M("cosmic_thought", "Cosmic Thought", "Mental", 130, 85, 5, "special", "marked", 100, "single", dual=["Mental", "Stellar"], desc="Cosmic thought-strike. Locks Marked.", rarity="exclusive"),
            M("psyche_drain", "Psyche Drain", "Mental", 90, 100, 10, "special", "drain", 100, desc="Drains psychic essence.", rarity="exclusive"),
            M("mind_apocalypse", "Mind Apocalypse", "Mental", 150, 85, 5, "special", "recharge_and_smothered_target", 100, "wide", desc="Smothers all foes; needs rest.", rarity="exclusive"),
        ],
    },
    "Draconic": {
        "regular": [
            M("draco_jab", "Draco Jab", "Draconic", 40, 100, 30, "physical", desc="Quick draco-jab.", breakerVs="Fairy"),
            M("draco_pulse_n", "Draco Pulse", "Draconic", 70, 100, 15, "special", desc="Draconic pulse.", alwaysCrit=True),
            M("wyrm_breath", "Wyrm Breath", "Draconic", 90, 90, 10, "special", tgt="wide", dual=["Draconic", "Wind"], desc="Wide wyrm-breath. Dual Draconic+Wind."),
            M("dragon_focus", "Dragon Focus", "Draconic", 0, 100, 15, "status", "focus", 100, "self", desc="Dragon's focus; high crit."),
            M("ancient_meditation", "Ancient Meditation", "Draconic", 0, 100, 10, "status", "calmup", 100, "self", desc="Calm-up self."),
            M("wyrm_armor", "Wyrm Armor", "Draconic", 0, 100, 15, "status", "defup2", 100, "self", desc="+2 Def."),
            M("draconic_might", "Draconic Might", "Draconic", 0, 100, 15, "status", "atkup", 100, "self", desc="+1 Atk."),
            M("arcane_breath", "Arcane Breath", "Draconic", 0, 100, 15, "status", "spaup", 100, "self", desc="+1 SpA."),
            M("dragon_calm", "Dragon Calm", "Draconic", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
        ],
        "exclusive": [
            M("eternal_dragon", "Eternal Dragon", "Draconic", 0, 100, 5, "status", "atkup2_and_spaup2_self", 100, "self", desc="+2 Atk AND +2 SpA self.", rarity="exclusive"),
            M("wyrm_calamity", "Wyrm Calamity", "Draconic", 130, 85, 5, "special", "bleed", 30, "wide", desc="Wide wyrm-calamity; may bleed.", rarity="exclusive"),
            M("genesis_dragon", "Genesis Dragon", "Draconic", 150, 80, 5, "special", "recharge_and_crystallize_target", 100, dual=["Draconic", "Crystal"], desc="Crystallizes target. Dual Draconic+Crystal.", rarity="exclusive"),
        ],
    },
    "Normal": {
        "regular": [
            M("quick_jab_n", "Quick Jab", "Normal", 40, 100, 30, "physical", "priority", 0, desc="First-strike jab."),
            M("body_blow", "Body Blow", "Normal", 75, 100, 15, "physical", desc="Heavy body blow."),
            M("tornado_grab", "Tornado Grab", "Normal", 90, 85, 10, "physical", tgt="wide", dual=["Normal", "Wind"], desc="Spinning grab on all foes. Dual Normal+Wind."),
            M("echo_beam_n", "Echo Beam", "Normal", 60, 100, 20, "special", tgt="wide", desc="Echoing beam on all foes."),
            M("aural_ray", "Aural Ray", "Normal", 70, 100, 20, "special", "spdefdown", 20, desc="Aural ray; may lower SpDef."),
            M("radiant_burst_n", "Radiant Burst", "Normal", 85, 90, 10, "special", desc="Radiant burst.", alwaysCrit=True),
            M("lumiwave", "Lumiwave", "Normal", 95, 90, 10, "special", "atkdown", 30, tgt="wide", desc="Lumiwave on all foes; may lower Atk."),
            M("zenith_ray", "Zenith Ray", "Normal", 110, 85, 5, "special", desc="Pure-light zenith ray.", breakerVs="Spectral"),
        ],
        "exclusive": [
            M("final_strike", "Final Strike", "Normal", 130, 85, 5, "physical", "recoil", 100, desc="Kamikaze strike with heavy recoil.", rarity="exclusive"),
            M("burnout_blast", "Burnout Blast", "Normal", 100, 90, 5, "special", "burnt_out", 100, "wide", desc="Inflicts Burnt-out on all foes.", rarity="exclusive"),
            M("apocalypse_finale", "Apocalypse Finale", "Normal", 150, 80, 5, "special", "recharge_and_bleed_target", 100, "wide", desc="Wide bleed apocalypse; needs rest.", rarity="exclusive"),
        ],
    },
    "Spectral": {
        "regular": [
            M("ghost_jab", "Ghost Jab", "Spectral", 40, 100, 30, "physical", desc="Quick ghost-jab."),
            M("ectoplasm_strike", "Ectoplasm Strike", "Spectral", 75, 95, 15, "physical", desc="Ectoplasmic strike.", alwaysCrit=True),
            M("phantom_charge", "Phantom Charge", "Spectral", 95, 90, 10, "physical", dual=["Spectral", "Dark"], desc="Phantom charge. Dual Spectral+Dark."),
            M("ghost_pulse", "Ghost Pulse", "Spectral", 50, 100, 30, "special", desc="Single ghost-pulse."),
            M("soul_lance", "Soul Lance", "Spectral", 70, 100, 20, "special", tgt="wide", desc="Wide soul-lance."),
            M("ectoplasm_wave", "Ectoplasm Wave", "Spectral", 80, 95, 15, "special", "atkdown", 30, tgt="wide", desc="Ectoplasm wave; may lower Atk."),
            M("phantom_beam", "Phantom Beam", "Spectral", 75, 95, 15, "special", desc="Phantom beam.", breakerVs="Mental"),
            M("void_wail", "Void Wail", "Spectral", 85, 90, 10, "special", "confuse", 30, tgt="wide", desc="Void wail; may confuse."),
            M("soul_burst", "Soul Burst", "Spectral", 110, 85, 5, "special", desc="Heavy soul-burst."),
            M("spirit_calamity", "Spirit Calamity", "Spectral", 130, 85, 5, "special", tgt="wide", desc="Spirit calamity on all foes."),
            M("veil_shroud", "Veil Shroud", "Spectral", 0, 100, 15, "status", "defup", 100, "self", desc="+1 Def."),
            M("ghost_focus", "Ghost Focus", "Spectral", 0, 100, 15, "status", "focus", 100, "self", desc="High crit ratio."),
            M("spirit_drain", "Spirit Drain", "Spectral", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
            M("phantom_dance", "Phantom Dance", "Spectral", 0, 100, 15, "status", "calmup", 100, "self", desc="Calm-up self."),
            M("spectral_lock", "Spectral Lock", "Spectral", 0, 100, 15, "status", "atkdown", 100, desc="Locks foe's Atk."),
            M("ectoplasm_armor", "Ectoplasm Armor", "Spectral", 0, 100, 15, "status", "spdefup2", 100, "self", desc="+2 SpDef."),
            M("fade", "Fade", "Spectral", 0, 100, 15, "status", "speup", 100, "self", desc="+1 Speed."),
        ],
        "exclusive": [
            M("ghost_devourer", "Ghost Devourer", "Spectral", 130, 85, 5, "physical", "drain", 100, desc="Devour and heal.", rarity="exclusive"),
            M("spectral_bind", "Spectral Bind", "Spectral", 0, 100, 5, "status", "petrify", 100, desc="Petrify-bind the target.", rarity="exclusive"),
            M("abyssal_haunting", "Abyssal Haunting", "Spectral", 150, 80, 5, "special", "recharge_and_hexed_target", 100, "wide", desc="Hexes all foes; needs rest.", rarity="exclusive"),
        ],
    },
    "Fighting": {
        "regular": [
            M("quick_punch", "Quick Punch", "Fighting", 40, 100, 30, "physical", "priority", 0, desc="First-strike punch."),
            M("roundhouse", "Roundhouse", "Fighting", 60, 100, 25, "physical", desc="Roundhouse kick."),
            M("uppercut_f", "Uppercut", "Fighting", 75, 100, 20, "physical", desc="Upward uppercut."),
            M("straight_jab", "Straight Jab", "Fighting", 50, 100, 30, "physical", desc="Direct jab."),
            M("body_check", "Body Check", "Fighting", 70, 100, 20, "physical", desc="Body check."),
            M("low_sweep_f", "Low Sweep", "Fighting", 65, 100, 20, "physical", "spedown", 30, desc="Low sweep; may slow."),
            M("high_kick", "High Kick", "Fighting", 90, 85, 10, "physical", desc="High kick.", alwaysCrit=True),
            M("flying_press", "Flying Press", "Fighting", 90, 95, 10, "physical", tgt="wide", dual=["Fighting", "Wind"], desc="Aerial press on all foes. Dual Fighting+Wind."),
            M("close_combat", "Close Combat", "Fighting", 110, 100, 5, "physical", "defdown", 100, desc="All-out attack; lowers own Def."),
            M("focus_punch_f", "Focus Punch", "Fighting", 130, 100, 5, "physical", desc="Charged focus-punch."),
            M("spear_thrust", "Spear Thrust", "Fighting", 80, 95, 15, "physical", desc="Piercing thrust."),
            M("crippling_blow", "Crippling Blow", "Fighting", 85, 90, 10, "physical", "defdown", 30, desc="Crippling blow."),
            M("spinning_kick", "Spinning Kick", "Fighting", 100, 85, 10, "physical", "flinch", 20, desc="Spinning kick; may flinch."),
            M("roar_strike", "Roar Strike", "Fighting", 95, 90, 10, "physical", "atkup", 30, desc="Empowering roar-strike."),
            M("iron_fist", "Iron Fist", "Fighting", 95, 100, 10, "physical", dual=["Fighting", "Metal"], desc="Iron-clad fist. Dual Fighting+Metal."),
            M("martial_finish", "Martial Finish", "Fighting", 120, 85, 5, "physical", desc="Closing martial blow."),
            M("ki_blast", "Ki Blast", "Fighting", 50, 100, 30, "special", desc="Ki-blast."),
            M("focused_beam", "Focused Beam", "Fighting", 65, 100, 20, "special", desc="Focused beam."),
            M("martial_aura", "Martial Aura", "Fighting", 75, 100, 15, "special", "atkup", 30, desc="Martial aura; may raise Atk."),
            M("ki_burst", "Ki Burst", "Fighting", 80, 95, 15, "special", tgt="wide", desc="Wide ki-burst."),
            M("spirit_bomb", "Spirit Bomb", "Fighting", 95, 90, 10, "special", tgt="wide", desc="Wide spirit bomb."),
            M("battle_cry", "Battle Cry", "Fighting", 60, 100, 20, "special", "atkdown", 30, tgt="wide", desc="Cry that lowers foes' Atk."),
            M("sonic_palm", "Sonic Palm", "Fighting", 85, 95, 10, "special", desc="Sonic palm.", breakerVs="Crystal"),
            M("shockwave_kick", "Shockwave Kick", "Fighting", 90, 90, 10, "special", "flinch", 30, tgt="wide", desc="Shockwave-kick wide."),
            M("heaven_strike", "Heaven Strike", "Fighting", 110, 85, 5, "special", desc="Heaven-piercing strike."),
            M("galaxy_punch_spec", "Galaxy Punch", "Fighting", 95, 95, 10, "special", "crit", 100, desc="High-crit galaxy-fist."),
            M("martial_intent", "Martial Intent", "Fighting", 70, 100, 15, "special", "spaup", 30, desc="May raise SpA."),
            M("focus_pose", "Focus Pose", "Fighting", 0, 100, 15, "status", "focus", 100, "self", desc="High crit."),
            M("battle_meditation", "Battle Meditation", "Fighting", 0, 100, 15, "status", "calmup", 100, "self", desc="Calm up."),
            M("iron_will", "Iron Will", "Fighting", 0, 100, 15, "status", "defup", 100, "self", desc="+1 Def."),
            M("fighter_resolve", "Fighter's Resolve", "Fighting", 0, 100, 15, "status", "atkup2", 100, "self", desc="+2 Atk."),
            M("swift_form", "Swift Form", "Fighting", 0, 100, 15, "status", "speup", 100, "self", desc="+1 Speed."),
            M("martial_block", "Martial Block", "Fighting", 0, 100, 15, "status", "spdefup", 100, "self", desc="+1 SpDef."),
            M("battle_rhythm", "Battle Rhythm", "Fighting", 0, 100, 15, "status", "accup", 100, "self", desc="+1 Acc."),
            M("recover_strike", "Recovery Stance", "Fighting", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
        ],
        "exclusive": [
            M("nova_punch", "Nova Punch", "Fighting", 130, 85, 5, "physical", "marked", 100, desc="Locks Marked.", rarity="exclusive"),
            M("dragon_press", "Dragon Press", "Fighting", 0, 100, 5, "status", "atkup2_and_speup_self", 100, "self", desc="+2 Atk AND +1 Speed.", rarity="exclusive"),
            M("ultimate_strike", "Ultimate Strike", "Fighting", 150, 80, 5, "physical", "recharge_and_bleed_target", 100, desc="Guaranteed Bleed; needs rest.", rarity="exclusive"),
        ],
    },
    "Aether": {
        "regular": [
            M("aether_jab", "Aether Jab", "Aether", 40, 100, 30, "physical", desc="Quick aether-jab."),
            M("mystic_strike", "Mystic Strike", "Aether", 70, 100, 15, "physical", desc="Mystic strike."),
            M("ethereal_slash", "Ethereal Slash", "Aether", 85, 95, 15, "physical", desc="Ethereal slash.", alwaysCrit=True),
            M("radiant_strike", "Radiant Strike", "Aether", 95, 90, 10, "physical", "spdefdown", 30, dual=["Aether", "Fairy"], desc="Radiant strike. Dual Aether+Fairy."),
            M("divine_press", "Divine Press", "Aether", 110, 85, 5, "physical", tgt="wide", desc="Wide divine press."),
            M("aether_pulse", "Aether Pulse", "Aether", 50, 100, 30, "special", desc="Single aether-pulse."),
            M("mystic_ray", "Mystic Ray", "Aether", 70, 100, 20, "special", desc="Mystic ray."),
            M("arcane_beam", "Arcane Beam", "Aether", 80, 95, 15, "special", desc="Arcane beam."),
            M("radiant_wave", "Radiant Wave", "Aether", 90, 90, 10, "special", tgt="wide", desc="Radiant wave."),
            M("mystical_eruption", "Mystical Eruption", "Aether", 100, 85, 10, "special", tgt="wide", desc="Mystical eruption.", breakerVs="Spectral"),
            M("ethereal_storm", "Ethereal Storm", "Aether", 120, 85, 5, "special", tgt="wide", desc="Wide ethereal storm."),
            M("aether_focus", "Aether Focus", "Aether", 0, 100, 15, "status", "focus", 100, "self", desc="High crit."),
            M("arcane_meditation", "Arcane Meditation", "Aether", 0, 100, 15, "status", "calmup", 100, "self", desc="Calm-up."),
            M("divine_ward", "Divine Ward", "Aether", 0, 100, 15, "status", "defup2", 100, "self", desc="+2 Def."),
            M("mystic_charge", "Mystic Charge", "Aether", 0, 100, 10, "status", "spaup2", 100, "self", desc="+2 SpA."),
            M("radiant_aura", "Radiant Aura", "Aether", 0, 100, 15, "status", "accup", 100, "self", desc="+1 Acc."),
            M("ethereal_step", "Ethereal Step", "Aether", 0, 100, 15, "status", "speup", 100, "self", desc="+1 Speed."),
            M("life_force", "Life Force", "Aether", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
            M("arcane_resolve", "Arcane Resolve", "Aether", 0, 100, 15, "status", "spdefup", 100, "self", desc="+1 SpDef."),
        ],
        "exclusive": [
            M("cosmic_purify", "Cosmic Purify", "Aether", 0, 100, 5, "status", "marked", 100, "wide", desc="Locks Marked on all foes.", rarity="exclusive"),
            M("divine_judgement", "Divine Judgement", "Aether", 130, 90, 5, "special", tgt="wide", desc="Wide divine judgement.", rarity="exclusive"),
            M("infinity_strike", "Infinity Strike", "Aether", 150, 80, 5, "special", "recharge_and_petrify_target", 100, desc="May Petrify; needs rest.", rarity="exclusive"),
        ],
    },
    "Crystal": {
        "regular": [
            M("crystal_jab", "Crystal Jab", "Crystal", 40, 100, 30, "physical", desc="Quick crystal-jab."),
            M("crystal_punch", "Crystal Punch", "Crystal", 60, 100, 20, "physical", desc="Crystal-fist punch."),
            M("shard_strike", "Shard Strike", "Crystal", 50, 95, 25, "physical", desc="Sharp shard-strike."),
            M("crystalline_slash", "Crystalline Slash", "Crystal", 75, 95, 15, "physical", desc="Crystalline slash."),
            M("prism_blow", "Prism Blow", "Crystal", 85, 90, 10, "physical", desc="Heavy prism-blow."),
            M("gemstone_strike", "Gemstone Strike", "Crystal", 95, 85, 10, "physical", desc="Gemstone strike.", alwaysCrit=True),
            M("crystal_smash", "Crystal Smash", "Crystal", 100, 85, 10, "physical", "defdown", 30, desc="Crystal smash; may lower Def."),
            M("shard_blade", "Shard Blade", "Crystal", 70, 100, 15, "physical", desc="Sharp shard-blade.", breakerVs="Mental"),
            M("crystal_press", "Crystal Press", "Crystal", 110, 85, 5, "physical", tgt="wide", dual=["Crystal", "Mineral"], desc="Wide crystal-press. Dual Crystal+Mineral."),
            M("diamond_drill", "Diamond Drill", "Crystal", 90, 95, 10, "physical", "crit", 100, desc="High-crit diamond drill."),
            M("quartz_quake", "Quartz Quake", "Crystal", 120, 85, 5, "physical", tgt="wide", desc="Wide quartz-quake."),
            M("crystal_pulse", "Crystal Pulse", "Crystal", 50, 100, 30, "special", desc="Crystal pulse."),
            M("prism_ray", "Prism Ray", "Crystal", 70, 100, 20, "special", desc="Prism ray."),
            M("crystalline_beam", "Crystalline Beam", "Crystal", 80, 95, 15, "special", tgt="wide", desc="Wide crystalline beam."),
            M("rainbow_burst", "Rainbow Burst", "Crystal", 85, 90, 10, "special", "confuse", 30, tgt="wide", desc="Rainbow burst; may confuse."),
            M("gemstone_blast", "Gemstone Blast", "Crystal", 95, 90, 10, "special", "spdefdown", 30, desc="May lower SpDef."),
            M("prismatic_eruption", "Prismatic Eruption", "Crystal", 110, 85, 5, "special", tgt="wide", desc="Wide prismatic eruption."),
            M("crystal_storm", "Crystal Storm", "Crystal", 95, 90, 10, "special", tgt="wide", desc="Crystal storm."),
            M("starlight_prism", "Starlight Prism", "Crystal", 100, 85, 10, "special", dual=["Crystal", "Stellar"], desc="Dual Crystal+Stellar prism."),
            M("crystal_focus", "Crystal Focus", "Crystal", 0, 100, 15, "status", "focus", 100, "self", desc="High crit."),
            M("prism_armor", "Prism Armor", "Crystal", 0, 100, 15, "status", "defup2", 100, "self", desc="+2 Def."),
            M("crystal_lattice", "Crystal Lattice", "Crystal", 0, 100, 15, "status", "spdefup2", 100, "self", desc="+2 SpDef."),
            M("radiant_reflection", "Radiant Reflection", "Crystal", 0, 100, 15, "status", "defup", 100, "self", desc="+1 Def."),
            M("crystal_charge", "Crystal Charge", "Crystal", 0, 100, 15, "status", "atkup", 100, "self", desc="+1 Atk."),
            M("prismatic_calm", "Prismatic Calm", "Crystal", 0, 100, 10, "status", "heal50", 100, "self", desc="Restores half HP."),
            M("crystalline_speed", "Crystalline Speed", "Crystal", 0, 100, 15, "status", "speup", 100, "self", desc="+1 Speed."),
            M("gem_focus", "Gem Focus", "Crystal", 0, 100, 15, "status", "accup", 100, "self", desc="+1 Acc."),
        ],
        "exclusive": [
            M("prism_apocalypse", "Prism Apocalypse", "Crystal", 130, 85, 5, "special", "brittle", 100, "wide", desc="Locks Brittle on all foes.", rarity="exclusive"),
            M("infinity_facet", "Infinity Facet", "Crystal", 0, 100, 5, "status", "spdefup2_and_defup2_self", 100, "self", desc="+2 SpDef AND +2 Def.", rarity="exclusive"),
            M("star_crystal", "Star Crystal", "Crystal", 150, 80, 5, "special", "recharge_and_crystallize_target", 100, "wide", desc="Crystallizes all foes; needs rest.", rarity="exclusive"),
        ],
    },
}

# === Apply ===
with open(DATA, "r", encoding="utf-8") as f:
    content = f.read()

# Step 1: Existing effect modifications
for move_id, new_eff, new_ec in EXISTING_EFFECT_CHANGES:
    pat = re.compile(rf'(\b{re.escape(move_id)}:\s*\{{[^}}]*?effect:")[^"]*("[^}}]*?ec:)\d+', re.DOTALL)
    m = pat.search(content)
    if m:
        content = pat.sub(rf'\g<1>{new_eff}\g<2>{new_ec}', content, count=1)
        print(f"  Modified {move_id}: effect → {new_eff}, ec → {new_ec}")
    else:
        # Try null variant
        pat2 = re.compile(rf'(\b{re.escape(move_id)}:\s*\{{[^}}]*?effect:)null([^}}]*?ec:)\d+', re.DOTALL)
        m2 = pat2.search(content)
        if m2:
            content = pat2.sub(rf'\g<1>"{new_eff}"\g<2>{new_ec}', content, count=1)
            print(f"  Modified {move_id} (was null): effect → {new_eff}, ec → {new_ec}")
        else:
            print(f"  WARN: couldn't find {move_id}")

# Step 2: Add new moves at end of MOVES_DATA
moves_start = content.index("const MOVES_DATA")
monsters_marker = content.index("// MONSTERS DATA", moves_start)
close_idx = content.rfind("};", moves_start, monsters_marker)

# Ensure trailing comma
i = close_idx - 1
while i > moves_start and content[i] in " \n\r\t":
    i -= 1
if content[i] == "}":
    content = content[:i+1] + "," + content[i+1:]
    close_idx += 1

# Insert regular before exclusive section, exclusive at end
all_regular = ""
all_exclusive = ""
for type_name, data in TYPE_DATA.items():
    if data.get("regular"):
        all_regular += f"\n  // --- {type_name} (regular, batch3) ---\n"
        for m in data["regular"]:
            all_regular += fmt_move(m) + "\n"
    if data.get("exclusive"):
        all_exclusive += f"\n  // --- {type_name} (exclusive, batch3) ---\n"
        for m in data["exclusive"]:
            all_exclusive += fmt_move(m) + "\n"

# Find latest exclusive section header to insert regular before it
excl_section_marker = content.rfind("// STEP 3B ADDITIONS — EXCLUSIVE MOVES", moves_start, close_idx)
excl_block_start = content.rfind("\n  // =====", moves_start, excl_section_marker)

content = content[:excl_block_start] + all_regular + content[excl_block_start:]

# Re-locate close
moves_start = content.index("const MOVES_DATA")
monsters_marker = content.index("// MONSTERS DATA", moves_start)
close_idx = content.rfind("};", moves_start, monsters_marker)

content = content[:close_idx] + all_exclusive + content[close_idx:]

with open(DATA, "w", encoding="utf-8") as f:
    f.write(content)

total_reg = sum(len(d.get("regular", [])) for d in TYPE_DATA.values())
total_excl = sum(len(d.get("exclusive", [])) for d in TYPE_DATA.values())
print(f"\nInserted {total_reg} regular + {total_excl} exclusive across {len(TYPE_DATA)} types.")
for tn, d in TYPE_DATA.items():
    print(f"  {tn}: +{len(d.get('regular', []))} regular, +{len(d.get('exclusive', []))} exclusive")
