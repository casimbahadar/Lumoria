# Lane A.2 + D — Evolution + Encounters (Parts A.2 & D)

Read `docs/capstone-lanes-README.md` first (shared rules), then `CLAUDE.md`.

**Branch:** `claude/capstone-laneA2D-evo-encounters` · draft PR to `main`.

These two parts are combined because they share the `evolveTo…catchRate` line and
are logically linked (how a Lumori evolves affects how/where it's obtained).

## Scope (ONLY these)
- `js/data.js`: each Lumori's `evolveTo / evolveLevel / evolveItem / evolveCond /
  catchRate / expYield / rarity` line, AND the encounter-table blocks (wild spawn
  lists per area/route/zone, incl. `ngPlusWildMonsters` and Forgotten gating).
- **Do NOT touch** name/desc/lore/types (Lane B), `base:` (Lane A.1), or
  `learnset:` (Lane C).

## Part A.2 — Evolution
1. Dump: `node scripts/dex_dump.js evo <ids>` (method/level + line + catch/exp).
2. Per line, check evolution **method + level** make sense (base→mid→final levels
   ascending and reasonable; item/location/condition evolutions wired correctly).
3. **Evolution-method VARIETY audit (dex-wide):** tally how many lines use each method
   (plain level-up, level+item/stone, location, trade/condition, friendship, etc.).
   Ensure a healthy spread — flag over-reliance on plain level-up and convert a sensible
   subset of lines to alternative methods where lore supports it (e.g. a moon/night
   creature → location/time; a metal creature → metal-coat item). Propose the tally +
   proposed conversions to the user before applying.

## Part D — Encounter audit
1. Review the encounter tables of **every area / route / zone** (base, NG+, Forgotten).
2. Check: every obtainable Lumori actually appears somewhere; **level curves** rise
   sensibly by area progression; **rarity weights** are coherent (commons common,
   rares rare); no duplicate/contradictory entries; evolved forms gated appropriately
   (don't spawn a final form in the starting route); NG+/Forgotten gating intact.
3. Confirm against `rarity` and `catchRate` (which live on the A.2 line — same lane, so
   keep them consistent here).
4. Propose fixes (per-area before/after) → approval → apply →
   `node scripts/validate.js` green → commit → push.

## Deliverable
Evolution methods/levels reviewed + diversified with a recorded tally; every area's
encounter table verified for obtainability, level curve, and rarity coherence.
