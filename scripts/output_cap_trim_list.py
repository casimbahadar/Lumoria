#!/usr/bin/env python3
"""Output the post-BREAKING cap-trim list ((d) task 4).

Combines:
- The keyword auto-classification (HIGH-CONFIDENCE bucket from
  scripts/classify_pre408_archetypes.py) for the 153 clear cases
- The manual overrides from batches 1-3 (this session, 2026-05-24) for
  the 77 ambiguous + unclassified cases

Aggregates per-archetype counts across all 230 pre-408 families and
flags over-cap archetypes (cap 3 for common-animal; mythical-exempt
sets vary). Output is the UNIFIED audit's trim worklist input.

Forgotten/postgame (id >= 408) is excluded — those have inline
LORE-AUDIT FLAGs and get per-Lumori UNIFIED attention.
"""
import re
from collections import defaultdict

DATA_JS = "/home/user/Lumoria/js/data.js"
FORGOTTEN_START = 408

# Batch 1-3 manual overrides (final-stage id -> archetype)
MANUAL_OVERRIDES = {
    # Batch 1 (27 ambiguous)
    6: "otter/mustelid", 24: "lion / big-cat", 30: "fish (non-eel)",
    33: "cephalopod", 40: "cetacean", 46: "seal/pinniped",
    86: "dragonfly", 89: "shark/eel", 113: "bird-of-prey", 122: "bat",
    125: "serpent (non-dragon)", 151: "golem (humanoid metal/stone)",
    156: "frog/toad", 159: "frog/toad", 181: "rabbit/hare",
    192: "golem (humanoid metal/stone)", 210: "rabbit/hare",
    227: "kangaroo/marsupial", 241: "crystalline-prism/gem",
    243: "dragonfly", 247: "beetle", 301: "cat (small felid)",
    309: "cetacean", 335: "cat (small felid)",
    368: "orb/wisp/cloud-formless", 373: "void/cosmic/abstract",
    407: "void-warden / boundary-sentinel",
    # Batch 2 (39 unclassified-fits-existing)
    9: "lizard/saurian (non-dragon)", 21: "lizard/saurian (non-dragon)",
    71: "seed-pod / walking-garden", 103: "crocodilian",
    117: "wind-elemental", 131: "treant/ent",
    149: "golem (humanoid metal/stone)",
    163: "faerie sprite / winged-fairy humanoid",
    190: "bovid", 221: "shadow/wraith/ghost-spectral",
    250: "rock-monolith / standing-stone",
    252: "golem (humanoid metal/stone)",
    253: "rock-monolith / standing-stone",
    255: "water-elemental", 277: "fire-elemental",
    285: "orb/wisp/cloud-formless", 298: "mosquito",
    313: "armadillo", 315: "rock-monolith / standing-stone",
    320: "golem (humanoid metal/stone)",
    326: "treant/ent", 327: "rock-monolith / standing-stone",
    337: "golem (humanoid metal/stone)",
    341: "rock-monolith / standing-stone",
    343: "shadow/wraith/ghost-spectral",
    357: "treant/ent", 359: "crystalline-prism/gem",
    363: "orb/wisp/cloud-formless",
    367: "rock-monolith / standing-stone",
    369: "rock-monolith / standing-stone",
    370: "storm-elemental", 371: "void/cosmic/abstract",
    377: "golem (humanoid metal/stone)",
    380: "storm-elemental", 384: "phoenix/solar-bird",
    385: "rock-monolith / standing-stone", 387: "void/cosmic/abstract",
    388: "rock-monolith / standing-stone", 393: "storm-elemental",
    # Batch 3 (11 unclassified-new-slots)
    213: "elemental titan / geological-colossus",
    217: "disembodied psychic intelligence",
    219: "rock-monolith / standing-stone",  # dark-shadow variant
    323: "alchemical flask-being / living vessel",
    324: "mantis / blade-insect",
    346: "humanoid (folded into 🔮 bucket)",  # Astralwing
    349: "architectural / fortified tower",
    365: "humanoid (folded into 🔮 bucket)",  # Cinderking
    366: "weapon-being / animate-construct",
    396: "weapon-being / animate-construct",
    400: "elemental titan / geological-colossus",
    # Cleanup overrides — families where keyword sweep failed but lore is unambiguous
    15: "bovid",  # Pyroclasm: "volcanic bull-titan"
    38: "coral-titan",  # Titanariel: "armoured sea-titan, the fully grown form of the Coralossus lineage"
    56: "golem (humanoid metal/stone)",  # Deepfreeze: "heavily armoured bipedal warrior"
    129: "void/cosmic/abstract",  # Voidaxis: "psychic-dark entity exists partially in another dimension"
    152: "turtle/tortoise",  # Imperion: "steel-rock tortoise" — new common-animal slot, pristine
    161: "insect-swarm",  # Mistbane: "cloud-swarm of microscopic miasma-flies"
    170: "orb/wisp/cloud-formless",  # Oneiron: "dream entity, wisp-like body"
    186: "bird-of-prey",  # Continemic: "albatross-like wind-normal bird"
    196: "rock-monolith / standing-stone",  # Frigolith: "boulder partially submerged in permafrost"
    237: "architectural / fortified tower",  # Icevault: "tower-like silhouette"
    258: "cetacean",  # Torrentox: "narwhal frame has whitened"
    314: "dog (non-wolf canine)",  # Galeaxis: "sleek greyhound"
    318: "elemental titan / geological-colossus",  # Gaiavorn: "ground-grass titan, towering elemental figure"
    328: "orb/wisp/cloud-formless",  # Smogveil: "dense yellow-green storm cloud, no [body]"
    330: "crocodilian",  # Blistermaw: "heavily built crocodile"
    331: "butterfly/moth",  # Thornmoth: "2-metre wingspan, wings resemble serrated leaves"
    332: "golem (humanoid metal/stone)",  # Glacicore: "humanoid armour suit"
    358: "phoenix/solar-bird",  # Pyrocrown: "fire-psychic bird, crown of solar fire"
}

# Mythical-exempt archetypes (cap not 3) — from (b) plus this session's additions
MYTHICAL_EXEMPT = {
    "dragon", "phoenix/solar-bird", "kitsune", "tanuki",
    "mermaid/sirenian", "sea-fairy queen", "coral-titan",
    "kraken/sea-titan", "shadow/wraith/ghost-spectral",
    "void/cosmic/abstract", "slime/blob/amorphous",
    "crystalline-prism/gem", "treant/ent",
    "golem (humanoid metal/stone)",
    "faerie sprite / winged-fairy humanoid",
    "orb/wisp/cloud-formless", "snowman",
    "leshy/forest-spirit", "insect-swarm",
    # Session additions
    "void-warden / boundary-sentinel",
    "elemental titan / geological-colossus",
    "disembodied psychic intelligence",
    "alchemical flask-being / living vessel",
    "architectural / fortified tower",
    "weapon-being / animate-construct",
    # Elementals (separate per-element cap = 1+1)
    "wind-elemental", "water-elemental", "fire-elemental",
    # Natural-disaster (per-disaster cap = 1+1)
    "storm-elemental",
    # 🔮 late-discussion bucket
    "humanoid (folded into 🔮 bucket)",
    "coral-titan",
    "insect-swarm",
}

# Cap rules
COMMON_CAP = 3
ELEMENTAL_CAP = 1  # +1 standalone, but family count = 1
STORM_CAP = 1


def parse_mons():
    with open(DATA_JS, encoding="utf-8") as f:
        content = f.read()
    m_start = content.find("const MONSTERS_DATA = {")
    m_end = content.find("\nconst WORLD_DATA", m_start)
    block = content[m_start:m_end]

    mons = {}
    entry_pat = re.compile(r'(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)"', re.MULTILINE)
    entries = [(int(m.group(2)), m.group(3), m.start()) for m in entry_pat.finditer(block)]
    entries.append((None, None, len(block)))
    for i in range(len(entries) - 1):
        mid, name, off = entries[i]
        end = entries[i + 1][2]
        body = block[off:end]
        evolve_m = re.search(r'evolveTo:\s*(\d+|null)', body)
        lore_m = re.search(r'lore:\s*"((?:[^"\\]|\\.)*)"', body)
        evolve = None if (not evolve_m or evolve_m.group(1) == "null") else int(evolve_m.group(1))
        mons[mid] = {"id": mid, "name": name, "evolveTo": evolve, "lore": lore_m.group(1) if lore_m else ""}
    return mons


def keyword_classify(name, lore):
    """Reusing scripts/classify_pre408_archetypes.py keyword set — minimal duplicate."""
    text = (name + " " + lore).lower()
    # Most-specific signature matches first
    sig = [
        ("wolf", "wolf"), ("lupine", "wolf"),
        ("kitsune", "kitsune"), ("tanuki", "tanuki"),
        ("dragon", "dragon"), ("wyvern", "dragon"), ("drake", "dragon"),
        ("phoenix", "phoenix/solar-bird"),
        ("snowman", "snowman"),
        ("leshy", "leshy/forest-spirit"),
        ("hyena", "hyena"),
        ("rhino", "rhino"), ("echidna", "echidna"), ("scorpion", "scorpion"),
        ("hippo", "hippo"),
        ("hedgehog", "hedgehog/porcupine"), ("porcupine", "hedgehog/porcupine"),
        ("treant", "treant/ent"), ("ent ", "treant/ent"),
        ("mermaid", "mermaid/sirenian"), ("kraken", "kraken/sea-titan"),
        ("kirin", "kirin / qilin"), ("qilin", "kirin / qilin"),
        ("centaur", "centaur/satyr"),
        ("mosquito", "mosquito"),
        ("armadillo", "armadillo"),
        ("snail", "snail/mollusk"),
        ("hare", "rabbit/hare"), ("rabbit", "rabbit/hare"), ("lagomorph", "rabbit/hare"),
        ("owl", "owl"), ("dragonfly", "dragonfly"),
        ("antelope", "bovid"), ("ram ", "bovid"), ("yak", "bovid"), ("bovid", "bovid"),
        ("kangaroo", "kangaroo/marsupial"),
        ("crocodil", "crocodilian"), ("alligator", "crocodilian"),
        ("frog ", "frog/toad"), ("toad ", "frog/toad"),
        ("crab", "crab/lobster"), ("lobster", "crab/lobster"), ("crustacean", "crab/lobster"),
        ("beetle", "beetle"), ("butterfly", "butterfly/moth"), ("moth ", "butterfly/moth"),
        ("eel ", "shark/eel"), ("shark", "shark/eel"),
        ("octopus", "cephalopod"), ("squid", "cephalopod"), ("cephalopod", "cephalopod"),
        ("nautilus", "cephalopod"),
        ("jellyfish", "jellyfish/cnidarian"), ("anemone", "anemone"),
        ("whale", "cetacean"), ("dolphin", "cetacean"), ("cetacean", "cetacean"),
        ("seal ", "seal/pinniped"), ("pinniped", "seal/pinniped"),
        ("manta", "manta/ray"), ("starfish", "starfish"),
        ("eagle", "bird-of-prey"), ("hawk", "bird-of-prey"), ("falcon", "bird-of-prey"),
        ("condor", "bird-of-prey"), ("raptor", "bird-of-prey"),
        ("otter", "otter/mustelid"), ("weasel", "otter/mustelid"),
        ("marten", "otter/mustelid"), ("wolverine", "otter/mustelid"),
        ("stag ", "stag/elk/deer"), ("elk ", "stag/elk/deer"), ("deer", "stag/elk/deer"),
        ("fawn", "stag/elk/deer"), ("buck", "stag/elk/deer"),
        ("horse", "horse/equine"), ("stallion", "horse/equine"), ("equine", "horse/equine"),
        ("destrier", "horse/equine"),
        ("boar", "pig/boar"), ("pig ", "pig/boar"),
        ("bat ", "bat"), ("bats ", "bat"),
        ("lion", "lion / big-cat"), ("panther", "lion / big-cat"), ("tiger", "lion / big-cat"),
        ("leopard", "lion / big-cat"), ("jaguar", "lion / big-cat"), ("cheetah", "lion / big-cat"),
        ("cat ", "cat (small felid)"), ("feline", "cat (small felid)"), ("kitten", "cat (small felid)"),
        ("dog ", "dog (non-wolf canine)"), ("hound", "dog (non-wolf canine)"), ("canine", "dog (non-wolf canine)"),
        ("bear ", "bear"), ("ursine", "bear"),
        ("fairy", "faerie sprite / winged-fairy humanoid"), ("sprite", "faerie sprite / winged-fairy humanoid"),
        ("pixie", "faerie sprite / winged-fairy humanoid"),
        ("wraith", "shadow/wraith/ghost-spectral"), ("ghost", "shadow/wraith/ghost-spectral"),
        ("phantom", "shadow/wraith/ghost-spectral"), ("spectral", "shadow/wraith/ghost-spectral"),
        ("void ", "void/cosmic/abstract"), ("cosmic", "void/cosmic/abstract"),
        ("golem", "golem (humanoid metal/stone)"), ("construct", "golem (humanoid metal/stone)"),
        ("automaton", "golem (humanoid metal/stone)"),
        ("slime", "slime/blob/amorphous"), ("blob", "slime/blob/amorphous"),
        ("crystal", "crystalline-prism/gem"), ("gem ", "crystalline-prism/gem"),
        ("prism", "crystalline-prism/gem"),
        ("mushroom", "mushroom/fungus"), ("fungus", "mushroom/fungus"),
        ("spider", "spider"), ("ant ", "ant"),
        ("mouse", "mouse/rat (rodent)"), ("rat ", "mouse/rat (rodent)"), ("rodent", "mouse/rat (rodent)"),
        ("fish", "fish (non-eel)"),  # last to avoid catching "selfish" etc.
        ("serpent", "serpent (non-dragon)"), ("snake", "serpent (non-dragon)"), ("viper", "serpent (non-dragon)"),
        ("lizard", "lizard/saurian (non-dragon)"), ("saurian", "lizard/saurian (non-dragon)"),
        ("iguana", "lizard/saurian (non-dragon)"),
    ]
    for kw, arch in sig:
        if re.search(r'\b' + re.escape(kw.strip()) + r'\b', text):
            return arch
    return "UNCLASSIFIED"


def main():
    mons = parse_mons()
    # Final-stage families: mons with evolveTo == None
    finals = [m for m in mons.values() if m["evolveTo"] is None and m["id"] < FORGOTTEN_START]
    finals.sort(key=lambda m: m["id"])

    classifications = {}
    for f in finals:
        if f["id"] in MANUAL_OVERRIDES:
            classifications[f["id"]] = MANUAL_OVERRIDES[f["id"]]
        else:
            classifications[f["id"]] = keyword_classify(f["name"], f["lore"])

    # Aggregate per archetype
    archetype_to_families = defaultdict(list)
    for fid, arch in classifications.items():
        archetype_to_families[arch].append((fid, mons[fid]["name"]))

    # Output: separate buckets
    print("=" * 90)
    print(f"POST-BREAKING CAP-TRIM LIST (pre-408 only, post batches 1-3)")
    print(f"Generated 2026-05-24. Source: scripts/output_cap_trim_list.py")
    print("=" * 90)
    print(f"Total pre-408 families: {len(finals)}")
    print(f"Total archetypes:       {len(archetype_to_families)}")
    print()

    # Sort by count descending
    sorted_arcs = sorted(archetype_to_families.items(), key=lambda x: -len(x[1]))

    print("=" * 90)
    print("OVER-CAP ARCHETYPES (cap 3 for common; mythical-exempt have varying caps)")
    print("=" * 90)
    for arch, fams in sorted_arcs:
        if arch in ("UNCLASSIFIED", "humanoid (folded into 🔮 bucket)"):
            continue
        exempt = arch in MYTHICAL_EXEMPT
        cap_label = "[exempt]" if exempt else f"[cap {COMMON_CAP}]"
        over = "OVER" if not exempt and len(fams) > COMMON_CAP else ""
        if over or len(fams) > 3:  # show all 3+ to surface borderlines
            fams_sorted = sorted(fams)
            members = ", ".join(f"{n}#{i}" for i, n in fams_sorted)
            print(f"  {over:5s} {arch:50s} {cap_label:10s} count={len(fams):2d}  {members}")

    print()
    print("=" * 90)
    print("AT/UNDER CAP COMMON ARCHETYPES (cap 3, count ≤ 3)")
    print("=" * 90)
    for arch, fams in sorted_arcs:
        if arch in ("UNCLASSIFIED", "humanoid (folded into 🔮 bucket)"):
            continue
        if arch in MYTHICAL_EXEMPT: continue
        if len(fams) > COMMON_CAP: continue
        fams_sorted = sorted(fams)
        members = ", ".join(f"{n}#{i}" for i, n in fams_sorted)
        print(f"  {arch:50s} count={len(fams):2d}  {members}")

    print()
    print("=" * 90)
    print("MYTHICAL-EXEMPT ARCHETYPES (cap varies; full count for reference)")
    print("=" * 90)
    for arch, fams in sorted_arcs:
        if arch not in MYTHICAL_EXEMPT: continue
        fams_sorted = sorted(fams)
        members = ", ".join(f"{n}#{i}" for i, n in fams_sorted)
        print(f"  {arch:50s} count={len(fams):2d}  {members}")

    print()
    unclassified = archetype_to_families.get("UNCLASSIFIED", [])
    folded = archetype_to_families.get("humanoid (folded into 🔮 bucket)", [])
    if unclassified:
        print("=" * 90)
        print(f"STILL-UNCLASSIFIED (keyword sweep failed + no manual override) ({len(unclassified)})")
        print("=" * 90)
        for fid, name in sorted(unclassified):
            print(f"  #{fid:3d} {name}: {mons[fid]['lore'][:120]}")

    if folded:
        print()
        print("=" * 90)
        print(f"FOLDED INTO 🔮 humanoid late-discussion bucket ({len(folded)})")
        print("=" * 90)
        for fid, name in sorted(folded):
            print(f"  #{fid:3d} {name}")


if __name__ == "__main__":
    main()
