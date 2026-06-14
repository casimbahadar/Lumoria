# Lane A.1 — Stats (Part A.1)

Read `docs/capstone-lanes-README.md` first (shared rules), then `CLAUDE.md`.

**Branch:** `claude/capstone-laneA1-stats` · draft PR to `main`.

## Scope (ONLY this field)
- `js/data.js`: each Lumori's `base:{hp,atk,def,spa,spd,spe}` line.
- **Do NOT touch** name/desc/lore/types (Lane B), `learnset:` (Lane C), or
  `evolveTo/catchRate/encounters` (Lane A.2+D).

## Method — family by family, id-ascending
1. Dump: `node scripts/dex_dump.js stats <ids>` (shows per-stat + BST).
2. Per family, check:
   - **BST ascends** across the evolution line, with sensible jumps (base < mid < final).
   - **Stat spread fits the role/lore** (a "fastest in the dex" creature has high `spe`;
     an "immovable fortress" has high `def`/`hp`, low `spe`; a glass cannon skews
     offense; etc. — cross-check against the lore via `dex_dump full` when unsure).
   - **No outliers** vs same-stage/same-archetype peers (no accidental 600 BST commons,
     no starter finals under-statted).
   - Legendaries/mythicals appropriately elevated; NG+ and Forgotten tiers consistent.
3. Propose stat adjustments (before/after table) → approval → apply →
   `node scripts/validate.js` green → commit → push. Keep changes minimal and justified.

## Reference
- Roughly: base stage ~300–340 BST, mid ~400–470, 3-stage final ~510–540,
  pseudo-legendary finals ~550–600, legendaries higher. Use existing well-tuned lines
  as anchors rather than imposing a rigid formula.

## Deliverable
Every pre-462 line reviewed for BST curve + role-appropriate spreads, fixes applied.
