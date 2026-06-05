#!/usr/bin/env python3
"""
Move name prefix/suffix cluster analysis for MOVES_DATA in js/data.js.

For each of the 26 types, tokenize move display names into first-word
(prefix) and last-word (suffix). Report clusters with >3 members per type
(soft 3-cap convention from the other session's de-IP / declustering work).

Tokens treated case-insensitively; punctuation stripped.
"""
import re
from pathlib import Path
from collections import defaultdict

DATA_JS = Path(__file__).resolve().parent.parent / "js" / "data.js"
text = DATA_JS.read_text()
moves_start = text.find("const MOVES_DATA = {")
moves_end_match = re.search(r'^\};', text[moves_start:], re.MULTILINE)
moves_block = text[moves_start:moves_start + moves_end_match.start()]

mpat = re.compile(r'^\s*(\w+):\s*\{\s*name:"([^"]+)",\s*type:"(\w+)"', re.MULTILINE)
moves_by_type = defaultdict(list)
for m in mpat.finditer(moves_block):
    key, name, typ = m.group(1), m.group(2), m.group(3)
    moves_by_type[typ].append({"key": key, "name": name})

def tokens(name):
    """Lowercase token list, punctuation removed."""
    return [re.sub(r'[^a-z0-9]', '', t.lower()) for t in name.split() if t]

def analyse_type(typ, moves, cap=3):
    prefix = defaultdict(list)
    suffix = defaultdict(list)
    for m in moves:
        toks = tokens(m["name"])
        if not toks:
            continue
        if len(toks) >= 1:
            prefix[toks[0]].append(m["name"])
        if len(toks) >= 2:
            suffix[toks[-1]].append(m["name"])
    over_pre = {t: ns for t, ns in prefix.items() if len(ns) > cap}
    over_suf = {t: ns for t, ns in suffix.items() if len(ns) > cap}
    return over_pre, over_suf

print(f"MOVES_DATA: {sum(len(v) for v in moves_by_type.values())} moves / {len(moves_by_type)} types")
print(f"3-cap convention: report clusters of >3 sharing a first-word or last-word.\n")

over_total = 0
clean_types = []
for typ in sorted(moves_by_type.keys()):
    moves = moves_by_type[typ]
    over_pre, over_suf = analyse_type(typ, moves, cap=3)
    if not over_pre and not over_suf:
        clean_types.append(typ)
        continue
    print("=" * 78)
    print(f"  {typ} ({len(moves)} moves)")
    print("=" * 78)
    if over_pre:
        for tok, names in sorted(over_pre.items(), key=lambda x: (-len(x[1]), x[0])):
            print(f"  prefix '{tok}*' x{len(names)}: {', '.join(names)}")
            over_total += 1
    if over_suf:
        for tok, names in sorted(over_suf.items(), key=lambda x: (-len(x[1]), x[0])):
            print(f"  suffix '*{tok}' x{len(names)}: {', '.join(names)}")
            over_total += 1
    print()

print(f"\nClean types (no >3 clusters): {', '.join(clean_types) if clean_types else '(none)'}")
print(f"Over-cap clusters total: {over_total}")
