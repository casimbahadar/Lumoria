# Lane B — Flavor + renaming (Part B)

Read `docs/capstone-lanes-README.md` first (shared rules), then `CLAUDE.md`.

**Branch:** `claude/capstone-laneB-flavor` · draft PR to `main`.

## Scope (ONLY these fields)
- `js/data.js`: each Lumori's `name`, `emoji`, `types` (header line), `desc`, `lore`.
- `js/variant-content.js`: the id-keyed `noun` / `features` / `coreLine` anchor.
- `taxonomy.md`: name/archetype lines when a name or archetype changes.
- **Do NOT touch** `base:` (Lane A.1), `learnset:` (Lane C), or
  `evolveTo/catchRate/encounter tables` (Lane A.2+D).

## Method — family by family, id-ascending
1. Dump the family: `node scripts/dex_dump.js flavor <ids>`.
2. Present each entry to the user in **labelled-section format**:
   ```
   ### #<id> <Name>  <emoji>  <types> · <rarity> · →#<evolveTo>
   **Description:** …
   **Lore:** …
   **Appearance/behaviour anchor:** noun / features / coreLine
   **Name note:** affix/fit check
   ```
3. Audit per entry: emoji ↔ body plan, desc ↔ lore consistency, name leaks,
   appearance/behaviour coherence, and whether the **name** fits (renaming allowed).
4. Propose changes → wait for approval → apply → `validate.js` green → commit → push.

## Renaming rules
- Renaming is OPEN for any Lumori **except** the ~90 already changed in the
  affix-cleanup pass (LOCKED — see `TODO.md` DONE LOG).
- Every candidate name must pass `node scripts/affix_check.js <Name>` → `✓ CLEAN`
  (≤3-per-affix cap + cross-position rule: a morpheme must not be a prefix in one
  name and a suffix in another).
- Before replacing, footprint the OLD name across **all of `js/`** + `taxonomy.md`
  (watch for `js/game.js` ROAMING_LEGENDARIES and `js/traits.js`).
- Type changes obey the post-game typing restriction in `CLAUDE.md`
  (Aether/Chrono never <462; Crystal/Primal/Stellar pre-462 only under the legendary
  exception).

## Deliverable
Every pre-462 family reviewed for flavor coherence + final names, with fixes applied.
Forgotten (≥462) had a dedicated audit already — light re-verify only.
