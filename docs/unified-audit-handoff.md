# Handoff: 🕯 UNIFIED per-Lumori audit (Lumoria)

You are picking up the **next major phase** of the Lumoria project: the UNIFIED
per-Lumori lore + desc + emoji + archetype + typing + cap audit. Read `CLAUDE.md`
first — its rules are binding (especially: **always propose and get explicit
approval before any edit/commit/push/branch op**; the post-game typing
restriction; context-window checkpoints at 50/75/90/98%).

## What UNIFIED is
One per-Lumori pass that merges four previously-separate workflows so each Lumori
gets a single locked decision (lore + desc + emoji + archetype + types) in one
approval/commit batch, instead of three separate touches. Full spec is in
`TODO.md` under "🕯 Per-Lumori lore + desc + archetype + cap audit (UNIFIED)".

Per-Lumori workflow: (1) read name/types/desc/lore/emoji + any inline
`LORE-AUDIT FLAG`; (2) audit consistency (emoji↔body, desc↔lore, name leaks,
stat↔body flag-only); (3) decide archetype (cap rules); (4) decide typing (cap
tally); (5) resolve any Step-4 flag; (6) **propose before/after table, wait for
approval**; (7) apply + `node scripts/validate.js` + commit (batch at user's
discretion).

## Dex bands — AUTHORITATIVE (per `js/game.js` `NG_PLUS_DEX_START`/`FORGOTTEN_DEX_START`)
- **1–321** — base dex (normal playthrough encounters).
- **322–461** — **NG+-exclusive** (140 ids; only spawn in New Game+ runs). Two
  sub-blocks in `js/data.js`:
  - **322–407** — original NG+ block (already classified in `taxonomy.md`: the
    wraiths 322/342/343/344/362/386/397/399, Mirkling/Umbrasteel/Voidwarden, …).
  - **408–461** — the **+54 NG+ families** added in the dex-to-500 expansion
    (#57). **These are the unclassified subset** — the core "54 NG+ classification"
    task. They use the previously-unused types (Crystal, Sonic, Vapor, Nature,
    Mental, Toxin, Dream).
- **462–500** — **Forgotten Lumori** (39, Vaeldrian Region). NOT NG+-exclusive;
  gated behind completing the Vaeldris wielder quest line. Carry the 5 reserved
  post-game types. Their dedicated audit is **DONE** — do not redo.

⚠️ The legacy "Forgotten = id ≥ 408" numbering is **RETIRED** (CLAUDE.md and code
now use **≥ 462**). Note: ids 408–461 are pre-462, so per CLAUDE.md their existing
Crystal/etc. types are **legacy** — surface case-by-case during the walk, do
**not** mass-strip (decision locked with the user 2026-06-09).

## Cap & type framework
- **Type-combo cap = ID-tally** (`scripts/oversaturated_combos.py`): ordinary
  dual ≤ **6 IDs**, flagship/mono ≤ **12 IDs**; every evo stage counts by its own
  types. ⚠️ **FIX FIRST:** that script's `POSTGAME_THRESHOLD` must be **462** (so
  the 408–461 NG+ families count and only true Forgotten ≥462 are excluded). If
  it still says 408, update it.
- **Archetype cap:** 3 families per common archetype; mythical-exempt list +
  borderline resolutions are LOCKED in `docs/mythical-archetype-policy.md`
  (golem exempt; cetacean/treant capped at 3; wraith split). Honor it.
- **Post-game types** (Aether, Chrono, Crystal, Primal, Stellar): reserved for
  Forgotten (≥462). Aether/Chrono never below 462; Crystal/Primal/Stellar only
  pre-462 under the narrow legendary+intrinsic-lore exception. Exclude all five
  from pre-462 suggestions by default.
- **26-type system, NO "Bug" type.** Real damage path is `getMoveEffectiveness`
  (`js/battle.js`); `getTypeEffectiveness` (`js/data.js`) is unused.
- **Validation:** `node scripts/validate.js` must stay green (G1/G2/G3a/G3b/G4/F2).

## Already done — do NOT redo
- **#84 diversity collision pass:** 12 retypes incl. **Darkfang #268→Dark/Spectral**
  and **Emberveil #301→Fire/Spectral** — these two ARE the UNIFIED section's
  "pre-surfaced collisions"; they're DONE. Mosswing #265 → Nature/Wind (moth).
- **#85 mythical policy lock + Forgotten renumber** (taxonomy 408–446→462–500).
- **#86 re-archetype execution:** cetacean trim-2 (Marevanos→manta-ray,
  Tidephant→pinniped), treant trim-1 (Silthorn→carnivorous-plant), wraith split.
- **🌑 Forgotten dedicated audit: COMPLETE** (typing/moveset/stats/archetype/lore/
  variant/appearance-briefs). Residuals are Abilities-assignment (blocked on the
  Abilities feature) + 13 wielder cutscenes — separate items.

## Highest-value UNIFIED work remaining
1. **Classify the 54 NG+ families (ids 408–461)** in `taxonomy.md` — entirely
   unclassified; hard prerequisite for accurate cap tallies. Review their legacy
   post-game types (e.g. 408 Glimmerling, 409 Facetite are Crystal) against the
   pre-462 legendary exception.
2. **Resolve remaining desc↔lore body inconsistencies:** #84 Electrix (beetle vs
   dragonfly-nymph), #243 Stuntrap (beetle vs dragonfly), #316 Abyssovex (Abyss
   Drake vs squid). (#265 Mosswing already handled.)
3. **Distribute under-used pre-462 types** where lore fits (Sonic/Vapor/Mineral/
   Toxin/Dream/Fighting/Spectral — fewer now after #84/#86).
4. **Re-decide the flagship-combo list** under the 26-type chart (old 4-combo list
   is stale).
5. **Resolve any remaining inline `LORE-AUDIT FLAG (Step 4)`** comments in data.js.
6. Fold in **standalone-count reduction** and the **renaming queue** as the walk
   surfaces candidates.

## Decide with the user BEFORE starting (scoping questions)
- Walk order: id-ascending, archetype-cluster, or flagged-first?
- Batch size: 1 Lumori/approval (safe) or N/approval table-based (faster)?
- Flagship-combo list: re-decide up front or per-combo during the walk?

## Key files
`js/data.js` (MONSTERS_DATA, MOVES_DATA, TYPE_CHART) · `js/variant-content.js`
(per-Lumori identity anchors — keep in sync when archetype/type changes) ·
`taxonomy.md` (classifications; Forgotten now 462+, NG+ 408–461 unclassified) ·
`docs/mythical-archetype-policy.md` (LOCKED) ·
`docs/archetype-diversity-matrix.md` (reference; anchor-derived tokens must be
cross-checked against each Lumori's desc/lore — several "collisions" are false
positives) · `scripts/oversaturated_combos.py` (cap tally — fix threshold first).

## Operational notes
- The cloud env has **reclaimed/reset the working tree repeatedly** this session
  (local HEAD reverting to old commits). **Commit and push promptly**; after any
  reclaim, `git fetch origin main` and rebuild your branch onto real `origin/main`
  before committing.
- Use a fresh branch off `main` (e.g. `claude/unified-audit-<n>`); open a **draft
  PR**; merge only with the user's go-ahead.

First action: confirm the three scoping questions with the user, fix the
`oversaturated_combos.py` threshold (→462), then propose a walk plan.
