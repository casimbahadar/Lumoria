# Lane C — Movesets (Part C)

Read `docs/capstone-lanes-README.md` first (shared rules), then `CLAUDE.md`.

**Branch:** `claude/capstone-laneC-movesets` · draft PR to `main`.

## Scope (ONLY these)
- `js/data.js`: each Lumori's `learnset:[…]` line (move keys + the levels they're learned).
- `MOVES_DATA` in `js/data.js`: only if a genuinely-needed move is missing and must be
  added (rare — prefer existing moves).
- **Do NOT touch** name/desc/lore/types (Lane B), `base:` (Lane A.1), or
  `evolveTo/catchRate/encounters` (Lane A.2+D).

## Learnset format
`[level, "move_key"]`, and an optional 3rd element `[level2,"move_key2"]` packs a
second move learned at `level2`. `dex_dump moves` expands and sorts these for you.

## Method — family by family, id-ascending
1. Dump: `node scripts/dex_dump.js moves <ids>` (expanded, STAB-flagged, orphan-flagged).
2. Per entry, check:
   - **STAB completeness:** each type has at least one same-type damaging move at a
     sensible level (the dump prints `⚠️ MISSING <type>` if not).
   - **Level pacing:** moves unlock at reasonable levels; strongest moves late; no
     dead early levels; evo-stage learnsets richer than pre-evos.
   - **On-type / thematic fit:** moves match the creature's identity (cross-check lore
     via `dex_dump full`). No orphan move keys (validate.js G1 catches these).
   - **Evolution carry-over:** a final form's learnset should make sense relative to its
     pre-evos (shared early moves, new signature moves on evolving).
3. Propose learnset edits (before/after) → approval → apply →
   `node scripts/validate.js` green (G1 orphans, G2 effect tokens, G4 schema) → commit → push.

## Deliverable
Every pre-462 line reviewed for STAB completeness, level pacing, and thematic fit.
