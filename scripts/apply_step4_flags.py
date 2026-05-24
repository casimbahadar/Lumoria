#!/usr/bin/env python3
"""Step 4 (flag-only) applier: inserts LORE-AUDIT FLAG comments above 46
Lumori entries in js/data.js so the future lore/description -> typing audit
addresses them. Idempotent: skips entries that already carry a Step 4 flag.

Categories:
  - 29 forgotten Lumori (id >= 408) missing a 408+-only type
  - 6 auto-collapsed mono from Phase B (re-dual review)
  - 11 PR #49 forced retypes (Spectral/Fighting now pre-408 OK)
"""
import re
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "js" / "data.js"

FORGOTTEN_29 = [409, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421,
                424, 425, 426, 428, 430, 431, 432, 433, 434, 436, 437, 438,
                440, 442, 443, 445, 446]
AUTO_COLLAPSED_6 = [192, 249, 250, 265, 327, 331]
PR49_11 = [55, 152, 322, 342, 344, 362, 368, 373, 386, 397, 399]

FLAG_FORGOTTEN  = "  // LORE-AUDIT FLAG (Step 4): needs a 408+-only type (Aether/Crystal/Primal/Chrono/Stellar) per lore"
FLAG_COLLAPSED  = "  // LORE-AUDIT FLAG (Step 4): auto-collapsed to mono in Phase B — review for re-dual"
FLAG_PR49       = "  // LORE-AUDIT FLAG (Step 4): PR #49 forced retype (Spectral/Fighting now pre-408 OK — reconsider)"

PLAN = (
    [(i, FLAG_FORGOTTEN) for i in FORGOTTEN_29]
    + [(i, FLAG_COLLAPSED) for i in AUTO_COLLAPSED_6]
    + [(i, FLAG_PR49) for i in PR49_11]
)

def main():
    src = DATA.read_text()
    lines = src.split("\n")

    entry_pat = re.compile(r'^(\s*)(\d+):\s*\{\s*id:(\d+),')
    id_to_line = {}
    for idx, line in enumerate(lines):
        m = entry_pat.match(line)
        if m and int(m.group(2)) == int(m.group(3)):
            id_to_line[int(m.group(2))] = idx

    inserts = []
    skipped = []
    missing = []
    for eid, flag in PLAN:
        if eid not in id_to_line:
            missing.append(eid)
            continue
        line_idx = id_to_line[eid]
        prev = lines[line_idx - 1] if line_idx > 0 else ""
        if "LORE-AUDIT FLAG (Step 4)" in prev:
            skipped.append(eid)
            continue
        inserts.append((line_idx, flag, eid))

    if missing:
        print(f"ERROR: ids not found in data.js: {missing}", file=sys.stderr)
        sys.exit(1)

    # Apply inserts in reverse order so line indices remain valid.
    inserts.sort(key=lambda x: -x[0])
    for line_idx, flag, eid in inserts:
        lines.insert(line_idx, flag)

    out = "\n".join(lines)
    DATA.write_text(out)

    print(f"Inserted: {len(inserts)} flags")
    print(f"Skipped (already flagged): {len(skipped)}")
    if skipped:
        print(f"  ids: {skipped}")
    print(f"Total planned: {len(PLAN)}")

if __name__ == "__main__":
    main()
