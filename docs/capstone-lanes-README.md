# 📋 Capstone — parallel lane plan

The "Final per-Lumori complete analysis" capstone is split into independent
**lanes** that can run as **separate concurrent sessions**, each on its own branch
and draft PR. This file is the shared contract; each lane also has its own doc.

## Lanes

| Lane | Part | Scope (the ONLY fields it may edit) | Branch |
|------|------|--------------------------------------|--------|
| **B** | Flavor + renaming | `name`, `emoji`, `types` (header line), `desc`, `lore` (`js/data.js`) + `js/variant-content.js` anchors + `taxonomy.md` | `claude/capstone-laneB-flavor` |
| **A.1** | Stats | the `base:{…}` line only (`js/data.js`) | `claude/capstone-laneA1-stats` |
| **C** | Movesets | the `learnset:[…]` line only (`js/data.js`) + `MOVES_DATA` if a move is genuinely missing | `claude/capstone-laneC-movesets` |
| **A.2 + D** | Evolution + encounters | the `evolveTo/evolveLevel/evolveItem/evolveCond/catchRate/expYield/rarity` line + the encounter-table blocks (`js/data.js`) | `claude/capstone-laneA2D-evo-encounters` |

**A.2 and D are combined into one lane** because they share the `evolveTo…catchRate`
line and are logically linked (evolution method affects obtainability). Do not split them.

## Field discipline (the rule that makes parallel safe)
Edit **only your lane's fields**. Never touch another lane's fields, even if you
notice something — note it for that lane instead. Because lanes edit different
*lines* of each entry, Git auto-merges them; conflicts only happen if two lanes
touch the same line.

## Per-session rules (all lanes)
1. Read `CLAUDE.md` first — binding (propose → approve → apply; post-game typing
   restriction; context checkpoints). One change per approval.
2. Work on your lane's branch; commit + push there; open/keep a **draft PR** to `main`.
3. **Before every commit:** `git fetch origin main` and rebase/ff onto it (the cloud
   container rolls back between turns, and other lanes are merging). Then
   `git fetch origin <your-branch>` and ensure HEAD includes the remote tip.
4. **Merge to `main` frequently in small chunks** — short-lived branches keep merges trivial.
5. `node scripts/validate.js` must stay green before every commit.
6. Renames (Lane B only): vet every new name with `node scripts/affix_check.js` —
   it must print `✓ CLEAN` (enforces the ≤3-per-affix cap + the cross-position rule).
   Then footprint the OLD name across **all of `js/`** + `taxonomy.md` before replacing
   (some names live in `js/game.js` ROAMING_LEGENDARIES and `js/traits.js`).
7. The ~90 names changed in the affix-cleanup pass are **LOCKED** — see the DONE LOG
   in `TODO.md`. Lane B may rename anything *else*.

## Tools
- `node scripts/dex_dump.js <flavor|stats|evo|moves|full> <ids…>` — per-Lumori dump
  (ids accept ranges, e.g. `1-9 25 30-33`).
- `node scripts/affix_check.js [exclude:7,8] Name1 Name2 …` — name validator (Lane B).
- `node scripts/validate.js` — integrity gates (must stay green).

## Bands (per `js/game.js`)
base = ids 1–321 · NG+-exclusive = 322–461 · Forgotten = ids ≥ 462 (audited; treat
gently). Affix caps are **pre-462 ≤ 3**, Forgotten counted separately.
