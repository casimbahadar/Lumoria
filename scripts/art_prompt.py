#!/usr/bin/env python3
"""Assemble an image-generation prompt for any Lumori from its Luminex data.

The base/NG+ range (ids < 462) has no hand-authored art prompts — only the
reusable Formula + house-style line at the top of docs/forgotten-art-prompts.md.
This script mechanically builds that prompt for an id by reading the creature's
own entry (js/data.js) and its variant anchors (js/variant-content.js), so the
Luminex entry stays the single source of truth.

Usage:
    python3 scripts/art_prompt.py <id> [<id> ...]
    python3 scripts/art_prompt.py 231
    python3 scripts/art_prompt.py 16 17 18          # whole evolution line
    python3 scripts/art_prompt.py 231 --mode card   # dex-card framing
    python3 scripts/art_prompt.py 231 --style pixel # Gen-4 pixel-art sprite
    python3 scripts/art_prompt.py 231 --raw         # just the parsed fields

Output per id: the ready-to-paste PROMPT, a COMPONENTS breakdown (so you can
tweak any slot by hand), and the full lore as reference.
"""

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "js" / "data.js"
VARIANT = ROOT / "js" / "variant-content.js"
FORGOTTEN_START = 462

# Verbatim house-style line from docs/forgotten-art-prompts.md — keep in sync.
STYLE_LINE = (
    "expressive painterly cartoon creature illustration, big bright eyes, "
    "soft detailed fur/scale shading, glowing elemental effects, warm "
    "cinematic rim-lighting, atmospheric themed background; art style moved "
    "away from Nintendo's official Pokemon look — cartoon but unique and "
    "distinctive; creature centered, full-body, simple or transparent "
    "background for cropping"
)

CARD_LINE = (
    "presented as a framed creature-dex card — name, type icon, a short "
    "flavor line, and 2-3 small expression/pose thumbnails — " + STYLE_LINE
)

# Gen-4 (DS-era) pixel-art style line, used when --style pixel is passed.
PIXEL_LINE = (
    "a Generation-4 (Nintendo DS, Diamond/Pearl/Platinum-era) Pokemon-style "
    "pixel-art sprite, low-resolution ~96x96 pixel grid, limited flat palette, "
    "crisp hard-edged pixels with no anti-aliasing or smooth gradients, simple "
    "dithering for shadows, clean dark outline, bold readable silhouette that "
    "stays clear when scaled down to ~40px, front 3/4 battle pose, centered "
    "full-body on a fully transparent background, square 1:1 framing"
)

# Sizing footer printed under pixel-mode prompts — real engine render targets.
PIXEL_SIZING = (
    "Target: square PNG -> assets/sprites/<id>.png. Generate native 96x96; the "
    "engine scales the one square image to 90px (battle), 110px (dex detail), "
    "100px (team), 56px/40px (lists). Keep the silhouette bold + high-contrast "
    "so it also reads as a ~16-30px area/map icon. For crisp (not blurred) "
    "pixels the sprite <img> needs image-rendering: pixelated (currently auto)."
)

# Per-type glowing-FX phrasing for the [signature feature + glowing FX] slot.
TYPE_FX = {
    "Normal": "soft natural lighting",
    "Fire": "glowing flame and ember effects",
    "Aquatic": "flowing water and spray effects",
    "Nature": "verdant leaf-and-pollen glow",
    "Electric": "crackling electric arcs",
    "Ice": "frost and icy-shard effects",
    "Fighting": "kinetic impact aura",
    "Poison": "noxious bubbling haze",
    "Earth": "rock-and-dust effects",
    "Wind": "swirling wind and air-current effects",
    "Mental": "glowing psychic aura",
    "Spectral": "ghostly translucent wisps",
    "Draconic": "draconic energy glow",
    "Dark": "shadowy dark aura",
    "Metal": "gleaming metallic sheen",
    "Fairy": "sparkling fairy glow",
    "Mineral": "crystalline mineral facets",
    "Toxin": "caustic toxic vapor",
    "Sonic": "visible sound-wave ripples",
    "Vapor": "drifting vapor mist",
    "Dream": "dreamy lavender-twilight haze",
    "Crystal": "prismatic crystal refractions",
    "Primal": "primal earthen-magma aura",
    "Stellar": "starlight and cosmic glow",
    "Aether": "divine white-gold radiance",
    "Chrono": "pale-blue time-distortion glow",
}

# Rare-type color language, verbatim intent from the forgotten doc. Appended to
# the palette only when one of these reserved types is present.
RARE_COLORS = {
    "Aether": "white-gold, opal, halo accents",
    "Chrono": "brass-clockwork, amber sand, pale-blue time-glow",
    "Crystal": "prismatic facets, gem-tones",
    "Primal": "earthen-amber, bone, magma",
    "Stellar": "indigo-violet, gold starlight",
    "Dream": "lavender-twilight",
}

# Colour / material lexicon for the [palette] slot, scraped from lore in order.
COLOR_TERMS = [
    "white", "black", "grey", "gray", "silver", "golden", "gold", "copper",
    "bronze", "amber", "scarlet", "crimson", "ruby", "red", "orange",
    "yellow", "emerald", "jade", "teal", "green", "turquoise", "cyan",
    "azure", "cobalt", "sapphire", "aqua-blue", "aqua", "blue", "indigo",
    "violet", "purple", "lavender", "magenta", "pink", "coral", "rust",
    "brown", "tan", "ochre", "sandy", "sand", "charcoal", "ashen", "ash",
    "obsidian", "slate", "ivory", "pearl", "opal", "bone", "cream", "snow",
    "frost", "glacial", "iridescent", "prismatic", "metallic", "pale",
    "dark", "blue-tipped",
]

# Tone words drawn from rarity, to push the framing's grandeur.
RARITY_TONE = {
    "legendary": "imposing and awe-inspiring",
    "pseudolegendary": "powerful and majestic",
    "mythical": "ethereal and otherworldly",
    "rare": "striking",
}


def _field(block, key, quote='"'):
    """Pull a single quoted string field from an entry block."""
    q = re.escape(quote)
    m = re.search(key + r"\s*:\s*" + q + r"((?:[^" + q + r"\\]|\\.)*)" + q, block)
    return m.group(1).strip() if m else None


def parse_data(text):
    """Return {id: {name, emoji, types, desc, lore, rarity}} from data.js."""
    starts = [(int(m.group(1)), m.start())
              for m in re.finditer(r"^\s*(\d+)\s*:\s*\{\s*id\s*:\s*\1\b",
                                    text, re.M)]
    entries = {}
    for i, (mid, start) in enumerate(starts):
        end = starts[i + 1][1] if i + 1 < len(starts) else len(text)
        block = text[start:end]
        types_m = re.search(r"types\s*:\s*\[([^\]]*)\]", block)
        types = []
        if types_m:
            types = [t.strip().strip('"').strip("'")
                     for t in types_m.group(1).split(",") if t.strip()]
        entries[mid] = {
            "name": _field(block, "name"),
            "emoji": _field(block, "emoji"),
            "types": types,
            "desc": _field(block, "desc"),
            "lore": _field(block, "lore"),
            "rarity": _field(block, "rarity"),
        }
    return entries


def parse_variant(text):
    """Return {id: {noun, features, coreLine}} from variant-content.js."""
    out = {}
    for m in re.finditer(r"^\s*(\d+)\s*:\s*\{(.*)\}\s*,?\s*$", text, re.M):
        mid, body = int(m.group(1)), m.group(2)
        noun = _field(body, "noun", "'")
        core = _field(body, "coreLine", "'")
        feats_m = re.search(r"features\s*:\s*\[([^\]]*)\]", body)
        feats = []
        if feats_m:
            feats = [f.strip().strip("'").strip('"')
                     for f in re.split(r"'\s*,\s*'", feats_m.group(1).strip())
                     if f.strip().strip("'").strip('"')]
        if noun or feats or core:
            out[mid] = {"noun": noun, "features": feats, "coreLine": core}
    return out


def first_sentence(lore, name):
    """Body-plan slot: the opening lore sentence, de-named to 'a ...'."""
    if not lore:
        return None
    sent = re.split(r"(?<=[.!?])\s+", lore.strip())[0].rstrip(".")
    if name:
        sent = re.sub(r"^" + re.escape(name) + r"\s+(is|are)\s+", "", sent)
    return sent.strip()


def palette(lore):
    """Scrape colour/material terms from lore, in order, de-duped, max 5."""
    if not lore:
        return []
    low = lore.lower()
    found = []
    seen = []
    for term in COLOR_TERMS:
        # whole-word match so "red" won't fire inside "revered", "ash" inside "flash"
        m = re.search(r"\b" + re.escape(term) + r"\b", low)
        # skip terms already subsumed by a longer match (e.g. "ash" within "ashen")
        if m and not any(term in s or s in term for s in seen):
            found.append((m.start(), term))
            seen.append(term)
    found.sort()
    return [term for _, term in found][:4]


def build_prompt(mid, mon, var, mode="sprite", style="painterly"):
    name = mon.get("name") or f"#{mid}"
    types = mon.get("types") or ["Normal"]
    element = "/".join(types)
    primary = types[0]

    noun = (var or {}).get("noun") or "creature"
    features = (var or {}).get("features") or []
    core = (var or {}).get("coreLine") or ""
    body = first_sentence(mon.get("lore"), name) or noun

    pal = palette(mon.get("lore"))
    rare = [t for t in types if t in RARE_COLORS]
    pal_str = ", ".join(pal) + " palette" if pal else ""
    if rare:
        rare_str = "; ".join(RARE_COLORS[t] for t in rare)
        pal_str = (pal_str + "; " if pal_str else "") + f"rare-type palette {rare_str}"

    fx = TYPE_FX.get(primary, "glowing elemental effects")
    tone = RARITY_TONE.get((mon.get("rarity") or "").lower())

    article = "an" if element[:1].upper() in "AEIOU" else "a"
    parts = [f"{body}, {article} {element}-type creature"]
    if features:
        parts.append("; ".join(features))
    if pal_str:
        parts.append(pal_str)
    parts.append(fx)
    if tone:
        parts.append(tone)
    if core:
        parts.append(core.rstrip("."))
    lead = "; ".join(p for p in parts if p)

    # pixel overrides framing (a pixel sprite isn't a dex card)
    if style == "pixel":
        style_line = PIXEL_LINE
    elif mode == "card":
        style_line = CARD_LINE
    else:
        style_line = STYLE_LINE
    return f"{lead}. {style_line}", {
        "name": name, "emoji": mon.get("emoji"), "element": element,
        "noun": noun, "body_plan": body, "features": features,
        "palette": pal_str or "(none detected — add by hand)",
        "fx": fx, "pose": core, "rarity": mon.get("rarity"),
    }


def emit(mid, mon, var, mode, raw, style):
    if mon is None:
        print(f"\n#{mid}: not found in data.js\n")
        return
    prompt, comp = build_prompt(mid, mon, var, mode, style)
    head = f"#{mid} {comp['name']} {comp['emoji'] or ''}".strip()
    print("\n" + "=" * 78)
    print(head + f"   [{comp['element']}]"
          + (f" · {comp['rarity']}" if comp['rarity'] else ""))
    print("=" * 78)
    if mid >= FORGOTTEN_START:
        print("NOTE: id >= 462 is a Forgotten Lumori — a hand-authored prompt "
              "likely\n      exists in docs/forgotten-art-prompts.md; prefer "
              "that if present.")
    if raw:
        print("\nPARSED FIELDS:")
        for k in ("noun", "body_plan", "features", "palette", "fx", "pose"):
            print(f"  {k:10}: {comp[k]}")
        print(f"  lore      : {mon.get('lore')}")
        return
    label = "PROMPT (Gen-4 pixel sprite)" if style == "pixel" else "PROMPT"
    print(f"\n{label} (paste into image generator):\n")
    print('  "' + prompt + '"')
    print("\nCOMPONENTS (tweak any slot by hand):")
    for k in ("noun", "body_plan", "palette", "fx", "pose"):
        print(f"  {k:10}: {comp[k]}")
    print(f"  features  : {', '.join(comp['features']) or '(none)'}")
    if style == "pixel":
        print(f"\nSIZING: {PIXEL_SIZING}")
    print(f"\nLORE (reference): {mon.get('lore')}")


def main():
    ap = argparse.ArgumentParser(description="Build a Lumori art prompt by id.")
    ap.add_argument("ids", nargs="+", type=int, help="Lumori id(s)")
    ap.add_argument("--mode", choices=("sprite", "card"), default="sprite",
                    help="sprite (engine art, default) or card (dex-card framing)")
    ap.add_argument("--style", choices=("painterly", "pixel"), default="painterly",
                    help="painterly illustration (default) or Gen-4 pixel-art "
                         "sprite (overrides --mode card)")
    ap.add_argument("--raw", action="store_true",
                    help="dump parsed fields only, no assembled prompt")
    args = ap.parse_args()

    data = parse_data(DATA.read_text(encoding="utf-8"))
    variants = parse_variant(VARIANT.read_text(encoding="utf-8"))
    for mid in args.ids:
        emit(mid, data.get(mid), variants.get(mid), args.mode, args.raw, args.style)
    print()


if __name__ == "__main__":
    sys.exit(main())
