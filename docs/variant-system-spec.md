# Variant + Shiny System — Implementation Spec (TODO #11)

Authoritative design for the procedural variant + shiny system. Built on branch
`claude/variant-shiny-ui`. Touches `js/game.js`, `js/battle.js`, `js/online.js`,
`index.html`, `css/style.css` — **not** `WORLD_DATA` (safe alongside the
encounter-rate work).

## A. Shiny
- **Rate:** 1/2048 base · ×4 for NG+ species (id ≥ 322) · × time-of-day & event multipliers.
- **Rolls in every battle type** (wild, trainer/rival, gym, champion, quest-boss, Umbra, Vaeldris wielder) — all 500 shiny-capable.
- **Effect:** +10% all stats; hue-shifted sprite; ✨ marker.
- **Online:** fully usable (trades, and future PvP — no shiny restriction).
- **Showcase:** Luminex **✨ tab** rendering shiny sprites of species seen/caught.

## B. Variant — when it appears
- **Rate: 1/200**, rolled per-mon, in **every** battle type, on either side.
- **Stacks with shiny** for catchable mons (the 474 = ids 1–461 + the 13 Forgotten leads).
  Stat order: permute → variant drifts → then shiny's +10% last.
- Rolled at encounter; **persists on catch** (stored on the party slot).

## C. `variantTypes`
- **85%** random 2 distinct types · **10%** mono · **5%** original combo (same types, possibly order-swapped).
- Pool = the **24** non-Forgotten types (never **Aether/Chrono**).
- **Crystal / Primal / Stellar** each only **1/500** to appear.

## D. `variantImmune`
- **One random type of the 24**, independent of the variant's own typing.
- Variant takes **0× damage** from that type. Hidden until caught; shown in team detail.

## E. `variantBase` (permute + 3 independent gates) — FINAL
1. **Permute** the species' six base-stat values across {hp,atk,def,spa,spd,spe} (BST unchanged by this step).
2. Roll **three independent activation gates**: **Large 20% · Medium 20% · Small 40%**.
3. **Fail all three** (0.8 × 0.8 × 0.6 = **~38.4%**) → no-drift permuted variant. *(The gates ARE the no-drift mechanism; no separate gate.)*
4. **Large** gate passed → **1 uniformly-random stat** drifts (≤15%).
5. **Medium** gate passed → number of stats = **0 / 1 / 2 at 30% / 50% / 20%**, each on a **uniformly-random distinct unclaimed stat** (≤10%).
6. **Small** gate passed → **each leftover (unclaimed) stat independently 40%** to drift (≤5%).
7. Each drifted stat: magnitude `±ceil(currentValue × rand(1..cap)%)` (cap = 15/10/5); **50/50 decides up vs down only**.
- Bands apply in priority **Large → Medium → Small**; a stat is claimed by at most one band.
- Stat selection is **uniformly random** — spe/spa as likely as hp; no positional bias.
- Bands co-occur (richest = 1×≤15% + 2×≤10% + rest×≤5%); **BST drifts** since ± is per-stat.

## F. Tracker & display
- **Luminex 🔀 tab:** logs **every variant encountered** — caught, seen-not-caught, and uncatchable enemy variants (trainer/Umbra/wielder). Per species, record the stat distributions, typings, and immunities seen so far.
- **Team detail:** show the variant's typing, its permuted+drifted stat bars, and an **"Immune to: X"** row (knowable only after catching).

## G. Online
- **Variants and shinies both usable online** (trades; future PvP).
- (Originally shinies were to be barred from PvP — that restriction was dropped.)

## Scope
- **#11 (this branch):** A–F above + shiny showcase + shiny-in-all-battles.
- **#12 (later):** deeper per-Lumori variant *content* / additional randomization (lore, descriptions, movesets).
- **New TODO:** Online PvP battle system (no shiny restriction).

## Data model (per party slot / caught record)
```
variant: true,
variantTypes: ["TypeA", "TypeB"],   // or ["TypeA"] if mono
variantBase:  { hp, atk, def, spa, spd, spe },  // permuted + drifted
variantImmune: "TypeC"
```
`shiny: true|false` is independent. Save adds tracking sets:
`shinySeen, shinyCaught, variantSeen, variantCaught` (with migration for old saves).

## Build order (verified commits)
1. Branch + spec + TODO updates ← (this commit)
2. Roll + generators (`getVariantTypes` rewrite to 24 types, `getVariantBase`, `getVariantImmune`) at 1/200, all battle types
3. Persistence on catch + save/load migration + tracking sets
4. Battle integration (stats from `variantBase`, 0× immunity in damage calc, shiny in non-wild)
5. Team detail (permuted/drifted stats + "Immune to: X")
6. Luminex 🔀 variant tracker + ✨ shiny showcase
7. Online: confirm variants + shinies usable; PvP left to its new TODO
