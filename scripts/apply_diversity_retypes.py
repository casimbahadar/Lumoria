#!/usr/bin/env python3
"""Apply the archetype-diversity type pivots (cap-verified under the ID-tally
framework: ordinary dual <=6 IDs, mono/flagship <=12). Each retyped Lumori also
gets one damaging STAB move of its new type, plus the Cryoshard lore pivot.
Idempotent-ish: skips a STAB move already present. Run from repo root.

Decisions (user-confirmed):
  251 Crumblite   Earth/Metal -> Metal/Mineral   + lode_strike (Mineral)
  252 Stonegrip   Earth/Metal -> Metal/Mineral   + granite_slam (Mineral)
  377 Abyssforge  Earth/Metal -> Earth/Mineral   + obsidian_strike (Mineral)
  55  Rimeling    Ice/Metal   -> Ice/Fighting     + straight_jab (Fighting)
  56  Deepfreeze  Ice/Metal   -> Ice/Fighting     + iron_fist (Fighting)
  334 Ferrocrush  Metal/Fire  -> Metal/Fighting   + brawl (Fighting)
  301 Emberveil   Fire/Dark   -> Fire/Spectral    + phantom_beam (Spectral)
  265 Mosswing    Nature      -> Nature/Wind       + gale_strike (Wind)
  266 Shadowpup   Dark        -> Dark/Sonic        + sound_rush (Sonic)
  267 Nightclaw   Dark        -> Dark/Sonic        + concussive_strike (Sonic)
  268 Darkfang    Dark        -> Dark/Spectral     + reaper_scythe (Spectral)
  340 Cryoshard   Ice/Mental  -> Ice/Sonic         + prism_resonance (Sonic) + lore pivot
Lumivane (303) intentionally NOT retyped (stays Fairy/Mental; label-only fix in taxonomy.md).
"""
import io

PLAN = {
 251: ('["Earth","Metal"]',  '["Metal","Mineral"]',  (20, "lode_strike")),
 252: ('["Earth","Metal"]',  '["Metal","Mineral"]',  (40, "granite_slam")),
 377: ('["Earth","Metal"]',  '["Earth","Mineral"]',  (45, "obsidian_strike")),
 55:  ('["Ice","Metal"]',    '["Ice","Fighting"]',   (15, "straight_jab")),
 56:  ('["Ice","Metal"]',    '["Ice","Fighting"]',   (46, "iron_fist")),
 334: ('["Metal","Fire"]',   '["Metal","Fighting"]', (48, "brawl")),
 301: ('["Fire","Dark"]',    '["Fire","Spectral"]',  (44, "phantom_beam")),
 265: ('["Nature"]',         '["Nature","Wind"]',    (34, "gale_strike")),
 266: ('["Dark"]',           '["Dark","Sonic"]',     (16, "sound_rush")),
 267: ('["Dark"]',           '["Dark","Sonic"]',     (40, "concussive_strike")),
 268: ('["Dark"]',           '["Dark","Spectral"]',  (58, "reaper_scythe")),
 340: ('["Ice","Mental"]',   '["Ice","Sonic"]',      (45, "prism_resonance")),
}

src = io.open('js/data.js', encoding='utf-8').read()
n = 0
for mid, (old_t, new_t, (lvl, mv)) in PLAN.items():
    head_old = f'{mid}: {{ id:{mid}, '
    hidx = src.find(head_old)
    assert hidx != -1, f"header not found for #{mid}"
    line_end = src.find('\n', hidx)
    header = src[hidx:line_end]
    if old_t in header:
        src = src[:hidx] + header.replace(old_t, new_t, 1) + src[line_end:]
    else:
        assert new_t in header, f"#{mid} neither old nor new types in header"
    entry_start = src.find(f'id:{mid},', hidx)
    ls = src.find('learnset:[[', entry_start)
    assert ls != -1, f"learnset not found for #{mid}"
    if f'"{mv}"' not in src[ls:ls+700]:
        insert_at = ls + len('learnset:[')
        src = src[:insert_at] + f'[{lvl},"{mv}"],' + src[insert_at:]
    n += 1
    print(f"  #{mid}: -> {new_t}  +[{lvl},{mv}]")

# Cryoshard lore pivot (Ice/Mental psychic -> Ice/Sonic resonant crystal)
OLD_DESC = 'desc:"A sentient crystal of psychically-active ice. Its facets reflect possible futures.",'
NEW_DESC = 'desc:"A sentient crystal of resonant ice. Its facets ring with tones that shatter stone and bone.",'
OLD_LORE = ('lore:"Cryoshard is a floating ice-psychic crystal 1 metre across with an irregular '
            'faceted form that constantly shifts. Each face reflects a different perceived future '
            'of whoever looks into it." }')
NEW_LORE = ('lore:"Cryoshard is a floating faceted ice-crystal 1 metre across whose form constantly '
            'shifts. Each facet rings at its own frequency, and when the tones fall into alignment it '
            'looses a focused pulse of resonant sound — a chord of pure cold that fractures whatever '
            'stands before it." }')
if OLD_DESC in src:
    src = src.replace(OLD_DESC, NEW_DESC, 1); print("  Cryoshard desc pivoted")
if OLD_LORE in src:
    src = src.replace(OLD_LORE, NEW_LORE, 1); print("  Cryoshard lore pivoted")

io.open('js/data.js', 'w', encoding='utf-8').write(src)
print(f"\nApplied {n} retypes + Cryoshard lore.")
