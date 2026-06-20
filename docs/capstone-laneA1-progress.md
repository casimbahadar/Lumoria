# Lane A.1 (Stats) — progress

Branch: `claude/capstone-laneA1-stats` (container: `claude/capstone-lanea1-stats-bcfywi`) · draft PR #97.
Scope: only the `base:{…}` line of each Lumori in `js/data.js`.

## Band checklist (id-ascending)
- [ ] 1–50
- [ ] 51–100
- [ ] 101–200
- [ ] 201–321 (base dex)
- [ ] 322–461 (NG+)
- [ ] 462–500 (Forgotten — light re-verify)

## Starter triangle design
Per user: the 3 starter lines are deliberately **distinct archetypes** so the opening choice is meaningful,
and are kept as **elevated exception lines** (finals = 530 BST each) above the rescaled base dex
(main commit `e9d9892` reduced ids 10–313 to ~354 avg; 3-stage finals ~430–450, cap 510). All three
finals now share BST 530 with totally different spreads:
- **Fire / Calderaeth** — fast special sweeper (spe 111, spa 105).
- **Water / Banksnout** — physical tank (def 110, atk 105, low spa).
- **Nature / Garlawarden** — special wall (spd 119, spa 112, low atk).

## Reviewed families

| Family | ids | Status | Notes |
|--------|-----|--------|-------|
| #1 Solkin line (Fire) | 1–3 | ✅ adjusted | Solkin 35/53/45/64/47/81 (325). Pyrevix 52/65/62/74/63/93 (409). Calderaeth 70/85/80/105/79/111 (530). Fast special-sweeper curve; 325→409→530. |
| #2 Aquatter line (Water) | 4–6 | ✅ adjusted | Aquatter 48/55/72/42/56/50 (323). Cobaleap 62/73/81/44/60/90 (410). Banksnout 95/105/110/50/93/77 (530). Physical-tank identity; 323→410→530. |
| #3 Saurbud line (Nature) | 7–9 | ✅ adjusted | Saurbud 50/40/57/62/68/47 (324). Barknell 63/40/68/89/92/58 (410). Garlawarden 85/45/85/112/119/84 (530). Special-wall identity; 324→410→530. |

## Next up
- Family #4: ids 10–12 (Scorchlarva line) — now on the **rescaled** base-dex curve (3-stage final ≤510, mid ≤400, base ~210–230). Starters were the elevated exception; from #10 on, work to the reduced caps.
