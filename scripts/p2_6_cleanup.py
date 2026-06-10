#!/usr/bin/env python3
"""
P2-6 cleanup: for the 18 deficit-1 Lumori that the basic-tier sweep
couldn't fix (because they already had all basic-tier moves of their
flagged type), add ONE mid-tier (P70-110) STAB move each.

Targets manually identified from the P2-5 holdout list.
"""
import re
import sys
from pathlib import Path

DATA_JS = Path(__file__).resolve().parent.parent / "js" / "data.js"
APPLY = "--apply" in sys.argv

# Manual picks (mid-tier P70-110, varied to avoid mass-share)
PICKS = [
    (214, "Aquatic", "tidal_sweep"),
    (225, "Mineral", "ore_punch"),
    (228, "Nature", "pod_blast"),
    (229, "Electric", "volt_surge"),
    (235, "Aquatic", "tidal_sweep"),
    (241, "Mental", "synaptic_shatter"),
    (253, "Fire", "searing_gale"),
    (253, "Mineral", "ore_punch"),
    (259, "Aquatic", "tidal_sweep"),
    (271, "Normal", "cranial_ram"),
    (283, "Poison", "miasma_cloud"),
    (290, "Normal", "cranial_ram"),
    (301, "Fire", "searing_gale"),
    (307, "Fire", "searing_gale"),
    (380, "Electric", "arc_flash"),
    (380, "Wind", "typhoon"),
    (389, "Electric", "arc_flash"),
    (398, "Fairy", "lunar_burst"),
]

text = DATA_JS.read_text()
from collections import defaultdict
by_mid = defaultdict(list)
for mid, t, k in PICKS:
    by_mid[mid].append(k)

new_text = text
edits = 0
for mid, keys in by_mid.items():
    pat = re.compile(rf'\n  {mid}:\s*\{{\s*id:{mid},')
    m_block = pat.search(new_text)
    if not m_block:
        print(f"  WARN: #{mid} not found")
        continue
    region = new_text[m_block.start():m_block.start()+3000]
    ls_m = re.search(r'learnset:\s*\[', region)
    if not ls_m:
        continue
    start_abs = m_block.start() + ls_m.end()
    depth = 1
    j = start_abs
    while j < len(new_text) and depth:
        if new_text[j] == '[': depth += 1
        elif new_text[j] == ']': depth -= 1
        j += 1
    end_abs = j - 1
    learnset_str = new_text[start_abs:end_abs]
    levels = [int(x) for x in re.findall(r'\[(\d+),', learnset_str)]
    next_level = max(levels) + 2 if levels else 30
    if next_level > 90:
        next_level = 90
    new_entries = []
    for k in keys:
        if k in learnset_str:
            continue
        new_entries.append(f',[{next_level},"{k}"]')
        next_level += 1
    if new_entries:
        new_text = new_text[:end_abs] + ''.join(new_entries) + new_text[end_abs:]
        edits += len(new_entries)
        print(f"  #{mid}: +{len(new_entries)} ({', '.join(keys)})")

print(f"\nTotal edits: {edits}")
if APPLY:
    DATA_JS.write_text(new_text)
    print("Written.")
else:
    print("(dry-run)")
