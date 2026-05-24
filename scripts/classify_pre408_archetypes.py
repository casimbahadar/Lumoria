#!/usr/bin/env python3
"""Pre-408 archetype classification for the UNIFIED audit.

Reads MONSTERS_DATA from js/data.js, groups mons into families (via evolveTo
chains), filters to pre-408 (final-stage id < 408), and runs a hybrid keyword
sweep against archetype keywords. Outputs three buckets:

  HIGH-CONFIDENCE: single archetype matched on multiple strong keywords or
                   on a unique signature keyword. Auto-propose.
  AMBIGUOUS:       multiple archetypes matched, or only weak matches.
                   Flag for user decision.
  UNCLASSIFIED:    no archetype keywords matched at all. Flag for user
                   decision (likely needs lore reading).

Read-only: prints results to stdout. Does not modify any files.
"""
import re
from collections import defaultdict

DATA_JS = "/home/user/Lumoria/js/data.js"
FORGOTTEN_START = 408

# Archetype keyword dictionary.
# Format: archetype_name -> [list of keywords]
# Keywords are matched as whole-word substrings (case-insensitive) against
# the combined name + lore + desc text.

COMMON_ARCHETYPES = {
    "wolf": ["wolf", "wolves", "lupine", "lycan"],
    "lion / big-cat": ["lion", "lioness", "panther", "tiger", "leopard", "jaguar", "cheetah", "big-cat", "big cat"],
    "cat (small felid)": ["cat", "kitten", "feline", "kitty"],
    "dog (non-wolf canine)": ["dog", "puppy", "canine", "hound", "mutt"],
    "bear": ["bear", "ursine", "ursid"],
    "bird-of-prey": ["eagle", "hawk", "falcon", "raptor", "vulture", "kite"],
    "cetacean": ["whale", "dolphin", "porpoise", "cetacean", "orca"],
    "butterfly/moth": ["butterfly", "moth", "lepidoptera", "imago"],
    "beetle": ["beetle", "scarab", "weevil"],
    "crab/lobster": ["crab", "lobster", "crustacean", "shrimp"],
    "serpent (non-dragon)": ["serpent", "snake", "python", "viper", "cobra", "naga"],
    "fish (non-eel)": ["fish", "trout", "salmon", "carp", "tuna", "perch"],
    "lizard/saurian (non-dragon)": ["lizard", "saurian", "iguana", "gecko", "skink", "monitor"],
    "frog/toad": ["frog", "toad", "amphibian", "tadpole"],
    "spider": ["spider", "arachnid", "tarantula"],
    "bat": ["bat", "chiroptera"],
    "rabbit/hare": ["rabbit", "hare", "bunny", "leveret", "lagomorph"],
    "bovid": ["ram", "yak", "bull", "auroch", "ox", "bovid", "bison", "buffalo", "antelope"],
    "mouse/rat (rodent)": ["mouse", "rat", "rodent", "vole", "shrew"],
    "horse/equine": ["horse", "pony", "stallion", "equine", "mare", "foal", "destrier"],
    "stag/elk/deer": ["deer", "stag", "elk", "fawn", "buck", "doe", "moose", "caribou"],
    "otter/mustelid": ["otter", "weasel", "marten", "mustelid", "ferret", "stoat", "wolverine"],
    "pig/boar": ["pig", "boar", "swine", "hog", "sow", "piglet"],
    "hippo": ["hippo", "hippopotamus"],
    "kangaroo/marsupial": ["kangaroo", "marsupial", "wallaby"],
    "hedgehog/porcupine": ["hedgehog", "porcupine"],
    "crocodilian": ["crocodile", "alligator", "caiman", "gharial"],
    "snail/mollusk": ["snail", "mollusk", "gastropod", "slug"],
    "jellyfish/cnidarian": ["jellyfish", "cnidarian", "medusa"],
    "cephalopod": ["octopus", "squid", "cephalopod", "nautilus", "cuttlefish"],
    "mushroom/fungus": ["mushroom", "fungus", "fungal", "mycelium"],
    "echidna": ["echidna", "spiny anteater"],
    "owl": ["owl", "owlet"],
    "dragonfly": ["dragonfly", "damselfly", "odonata"],
    "scorpion": ["scorpion"],
    "insect-swarm": ["swarm", "hive-mind"],
    "coral-titan": ["coral-titan", "coral titan"],
    "sea-fairy queen": ["sea-fairy", "sea fairy"],
    "hyena": ["hyena"],
    "bee": ["bee", "wasp", "honeybee"],
    "shark/eel": ["shark", "eel"],
    "rhino": ["rhino", "rhinoceros"],
    "tanuki": ["tanuki", "raccoon-dog", "raccoon dog"],
    "kitsune": ["kitsune", "fox-spirit", "fox spirit"],
    "fox": ["fox", "vulpine", "kit", "vixen"],
    "ant": ["ant", "ant-like", "formicid"],
    "centipede/millipede": ["centipede", "millipede"],
    "turtle/tortoise": ["turtle", "tortoise", "terrapin"],
    "seal/pinniped": ["seal", "pinniped", "sea lion", "walrus"],
    "bird (generic)": ["bird", "avian", "fledgling", "feathered"],
    "ape/primate": ["ape", "monkey", "gorilla", "chimpanzee", "primate"],
    "starfish": ["starfish", "sea star"],
    "anemone": ["anemone"],
    "manta/ray": ["manta", "stingray", "ray"],
    "salamander/newt": ["salamander", "newt"],
}

MYTHICAL_ARCHETYPES = {
    "dragon": ["dragon", "wyvern", "drake", "wyrm", "draconic"],
    "fairy/sprite": ["fairy", "sprite", "pixie", "faerie", "fae"],
    "ghost/wraith/spectral": ["wraith", "ghost", "spectre", "specter", "spectral", "phantom", "apparition", "haunt"],
    "void/cosmic/abstract": ["void", "cosmic", "cosmos", "abstract", "non-euclidean"],
    "crystalline-prism/gem": ["crystal", "gem", "crystalline", "prism", "geode", "quartz", "amethyst", "ruby", "diamond"],
    "golem (humanoid metal/stone)": ["golem", "construct", "metal humanoid", "stone humanoid", "automaton"],
    "phoenix/solar-bird": ["phoenix", "firebird", "solar bird"],
    "treant/ent": ["treant", "ent", "tree-spirit", "walking tree"],
    "slime/blob/amorphous": ["slime", "blob", "amorphous", "ooze", "gelatin"],
    "mermaid/sirenian": ["mermaid", "merman", "sirenian", "siren"],
    "orb/wisp/cloud-formless": ["orb", "wisp", "will-o-wisp", "willowisp", "luminous sphere"],
    "snowman": ["snowman"],
    "leshy/forest-spirit": ["leshy", "forest-spirit", "forest spirit"],
    "elemental": ["elemental"],
    "nymph/dryad": ["nymph", "dryad", "naiad"],
    "kraken/sea-titan": ["kraken", "sea-titan", "sea titan"],
    "phoenix/solar": ["phoenix"],
    "demon/oni": ["demon", "oni", "imp", "devil"],
    "angel/seraph": ["angel", "seraph", "cherub"],
    "vampire": ["vampire", "vampyric"],
    "centaur/satyr": ["centaur", "satyr", "faun"],
    "humanoid-warrior": ["warrior", "knight", "samurai", "champion-of"],
}

ALL_ARCHETYPES = {**COMMON_ARCHETYPES, **MYTHICAL_ARCHETYPES}

# Signature keywords — if a single one of these appears, it's a strong
# enough signal alone to count as high-confidence (no second keyword needed).
SIGNATURE_KEYWORDS = {
    "wolf": "wolf",
    "lion / big-cat": "lion",
    "bear": "bear",
    "owl": "owl",
    "dragon": "dragon",
    "wyvern": "dragon",
    "drake": "dragon",
    "fairy": "fairy/sprite",
    "wraith": "ghost/wraith/spectral",
    "phoenix": "phoenix/solar-bird",
    "treant": "treant/ent",
    "kitsune": "kitsune",
    "tanuki": "tanuki",
    "kraken": "kraken/sea-titan",
    "mermaid": "mermaid/sirenian",
    "snowman": "snowman",
    "leshy": "leshy/forest-spirit",
    "echidna": "echidna",
    "hyena": "hyena",
    "rhino": "rhino",
    "hippo": "hippo",
    "hedgehog": "hedgehog/porcupine",
    "porcupine": "hedgehog/porcupine",
    "scorpion": "scorpion",
    "centaur": "centaur/satyr",
}

# ============================================================
# Parse MONSTERS_DATA
# ============================================================
with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

# Find the MONSTERS_DATA block, slice from there to its closing brace
m_start = content.find("const MONSTERS_DATA = {")
m_end = content.find("\nconst WORLD_DATA", m_start)
if m_start == -1 or m_end == -1:
    raise SystemExit("Could not locate MONSTERS_DATA block")
data_block = content[m_start:m_end]

# Parse each mon entry: id, name, types, evolveTo, lore, desc, emoji
mons = {}
entry_pat = re.compile(
    r'(\d+):\s*\{\s*id:(\d+),\s*name:"([^"]+)"',
    re.MULTILINE,
)
# Use lookahead to bound each entry to start of next entry or end
entry_starts = []
for m in entry_pat.finditer(data_block):
    entry_starts.append((int(m.group(2)), m.group(3), m.start()))
entry_starts.append((None, None, len(data_block)))

for i in range(len(entry_starts) - 1):
    mid, name, off = entry_starts[i]
    end = entry_starts[i + 1][2]
    body = data_block[off:end]

    types_m = re.search(r'types:\s*\[([^\]]+)\]', body)
    evolve_m = re.search(r'evolveTo:\s*(\d+|null)', body)
    lore_m = re.search(r'lore:\s*"((?:[^"\\]|\\.)*)"', body)
    desc_m = re.search(r'desc:\s*"((?:[^"\\]|\\.)*)"', body)
    emoji_m = re.search(r'emoji:\s*"((?:[^"\\]|\\.)*)"', body)

    types = []
    if types_m:
        types = [t.strip().strip('"') for t in types_m.group(1).split(",") if t.strip()]
    evolve = None
    if evolve_m and evolve_m.group(1) != "null":
        evolve = int(evolve_m.group(1))

    mons[mid] = {
        "id": mid,
        "name": name,
        "types": types,
        "evolveTo": evolve,
        "lore": lore_m.group(1) if lore_m else "",
        "desc": desc_m.group(1) if desc_m else "",
        "emoji": emoji_m.group(1) if emoji_m else "",
    }

# ============================================================
# Build families (chains via evolveTo)
# ============================================================
# Each family = a chain ending in a final-stage mon (evolveTo == None).
# Walk evolveTo backwards to gather pre-evolutions.
pre_evo = defaultdict(list)  # mid -> [list of mids that evolve INTO this mid]
for mid, mon in mons.items():
    if mon["evolveTo"] is not None:
        pre_evo[mon["evolveTo"]].append(mid)

def gather_chain(final_id):
    """Walk back from final-stage mon, returning ordered chain [base, ..., final]."""
    chain = [final_id]
    cur = final_id
    while pre_evo[cur]:
        prev = pre_evo[cur][0]  # branched evos: take first; matters little for archetype
        chain.insert(0, prev)
        cur = prev
    return chain

families = []
for mid, mon in mons.items():
    if mon["evolveTo"] is None:
        chain = gather_chain(mid)
        families.append({
            "final_id": mid,
            "final_name": mon["name"],
            "chain": chain,
            "is_multi_stage": len(chain) > 1,
        })

# ============================================================
# Filter to pre-408
# ============================================================
pre408_families = [f for f in families if f["final_id"] < FORGOTTEN_START]
pre408_families.sort(key=lambda f: f["final_id"])

# ============================================================
# Run archetype classification on each family's final-stage
# ============================================================
def classify(mon):
    """Returns (high_conf_archetype, matched_keywords_per_archetype).

    high_conf_archetype is None if ambiguous or unmatched.
    """
    text = " ".join([mon["name"], mon["lore"], mon["desc"]]).lower()
    matches = defaultdict(list)  # archetype -> [matched keywords]
    for archetype, keywords in ALL_ARCHETYPES.items():
        for kw in keywords:
            # Whole-word match (allow hyphens/punctuation as boundary)
            pat = re.compile(r'\b' + re.escape(kw.lower()) + r'\b')
            if pat.search(text):
                matches[archetype].append(kw)

    # Signature keyword: if any signature keyword present, prefer its archetype
    sig_hit = None
    for sig_kw, sig_arch in SIGNATURE_KEYWORDS.items():
        if re.search(r'\b' + re.escape(sig_kw) + r'\b', text):
            sig_hit = sig_arch
            break

    # Decision logic
    if not matches:
        return (None, matches, "UNCLASSIFIED")

    # Strong single-archetype match: only one archetype keyword family hit
    if len(matches) == 1:
        return (list(matches.keys())[0], matches, "HIGH-CONFIDENCE")

    # Multiple archetypes: defer to signature if present
    if sig_hit and sig_hit in matches:
        return (sig_hit, matches, "HIGH-CONFIDENCE (signature)")

    # Multiple archetypes, no signature: ambiguous
    return (None, matches, "AMBIGUOUS")


# ============================================================
# Classify pre-408 families + bucket
# ============================================================
high_conf = []
ambiguous = []
unclassified = []

for fam in pre408_families:
    final_mon = mons[fam["final_id"]]
    archetype, matches, bucket = classify(final_mon)
    record = {
        "final_id": fam["final_id"],
        "final_name": fam["final_name"],
        "types": "/".join(final_mon["types"]),
        "emoji": final_mon["emoji"],
        "lore_snippet": final_mon["lore"][:120] + ("..." if len(final_mon["lore"]) > 120 else ""),
        "proposed_archetype": archetype,
        "matches": dict(matches),
        "bucket": bucket,
        "is_multi_stage": fam["is_multi_stage"],
    }
    if bucket.startswith("HIGH-CONFIDENCE"):
        high_conf.append(record)
    elif bucket == "AMBIGUOUS":
        ambiguous.append(record)
    else:
        unclassified.append(record)

# ============================================================
# Output
# ============================================================
print(f"Total pre-408 families: {len(pre408_families)}")
print(f"  multi-stage: {sum(1 for f in pre408_families if f['is_multi_stage'])}")
print(f"  standalone:  {sum(1 for f in pre408_families if not f['is_multi_stage'])}")
print()
print(f"Classification buckets:")
print(f"  HIGH-CONFIDENCE: {len(high_conf)}")
print(f"  AMBIGUOUS:       {len(ambiguous)}")
print(f"  UNCLASSIFIED:    {len(unclassified)}")
print()

def emit_table(title, records):
    print(f"=" * 80)
    print(f"{title} ({len(records)})")
    print(f"=" * 80)
    for r in records:
        stage = "[MULTI]" if r["is_multi_stage"] else "[SOLO] "
        print(f"#{r['final_id']:3d} {stage} {r['final_name']:25s} [{r['types']:20s}] {r['emoji']:4s} → {r['proposed_archetype'] or '???'}")
        if r["matches"]:
            for arch, kws in r["matches"].items():
                marker = "★" if arch == r["proposed_archetype"] else " "
                print(f"        {marker} {arch:35s} kws={kws}")
        if r["lore_snippet"]:
            print(f"        lore: \"{r['lore_snippet']}\"")
    print()

emit_table("HIGH-CONFIDENCE (auto-propose; user approve in batches)", high_conf)
emit_table("AMBIGUOUS (multiple archetypes matched; user decide)", ambiguous)
emit_table("UNCLASSIFIED (no keywords matched; user decide from lore)", unclassified)
