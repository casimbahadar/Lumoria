# Mythical Archetype Policy (LOCKED)

_Status: **locked** 2026-06-09. This is the source of truth for which archetypes are exempt from the archetype family-cap, and how the borderline cases resolve. Supersedes the looser "mythical-exempt" notes scattered in `taxonomy.md`._

## Scope & counting rules

- **Archetype cap (default):** 3 families per common-animal archetype; 1 family + 1 standalone per element (elementals) / per disaster subtype.
- **Mythical-exempt:** listed archetypes below carry **no cap** — they are universally-recognized mythological/folkloric beings whose variety is a feature.
- **Forgotten exclusion:** the 39 Forgotten (ids **462–500**) are excluded from all pre-Forgotten cap accounting — they have a separate one-unique-archetype-per-Forgotten rule. *(Note: the Forgotten range is 462+, NOT the legacy 408+. Ids 408–461 are 54 regular NG+ families and DO count toward caps.)*
- **NG+ band (408–461):** these 54 families are regular dex members and count toward caps. They are **not yet classified** in `taxonomy.md` — full archetype classification is deferred to the UNIFIED audit. Counts below fold in the NG+ families only where already identified (notably the spectral additions affecting wraith).

## Mythical-exempt archetypes (no cap) — CONFIRMED

dragon-mythic · kitsune · tanuki · leshy/forest-spirit · snowman · sea-fairy queen/mermaid · kraken/sea-titan · void/cosmic-abstract · faerie-sprite · will-o-wisp · slime/blob · crystalline-prism · kirin · insect-swarm · phoenix/solar-being · primordial-titan · warden/boundary-sentinel · **golem (humanoid metal/stone construct)**

- **Golem — CONFIRMED EXEMPT** (11 families). A golem is a universal mythological construct on the same footing as a dragon; the family count is intentional. No trim.
- **Dragon sub-flavors** (fire/psychic/ice-dragon counts) — **no sub-caps applied.** Dragon-mythic is exempt as a whole; sub-flavor crowding is acceptable.

## Borderline resolutions — DECIDED

### Cetacean/whale → common cap-3 (NOT mythical) · trim 2
Whales are real animals, not mythical sea-leviathans. Pre-Forgotten count = **5** (Marevanos #40, Titanomare #41, Torrentox #258, Tidephant #309, Riftwhale #354; Pelagor #420→renumbered Forgotten excluded).
- **Keep (3):** Torrentox (orca), Riftwhale (psychic-whale), Titanomare (steel-whale titan).
- **Re-archetype (2):** Marevanos #40 → **manta-ray** (lore already says "winged whale/manta"); Tidephant #309 → **pinniped/elephant-seal** (already mid-reclassification; "-phant" leans elephant-seal). Both stay sea-creatures — minimal lore change.

### Treant/walking-tree → cap-3 (capped, NOT exempt) · trim 1
Per user direction, treant is **flagged for capping** rather than exempt. Pre-Forgotten count = **4** (Necrothon #131, Impenezard #264, Silthorn #326, Thornspire #357; Rootborn #417→renumbered Forgotten excluded).
- **Keep (3):** Necrothon, Impenezard, Thornspire.
- **Re-archetype (1):** Silthorn #326 → **carnivorous-plant** (Impenezard and Silthorn are near-duplicate thorn-plants; differentiating Silthorn relieves the redundancy).

### Wraith/spectre → split the over-broad bucket into distinct sub-archetypes
Per user direction, wraith is **flagged for capping**. Rather than strip the spectral identity from 8 Lumori, the 11+ "wraith" bucket is **split**: a tight core stays "wraith," and the clearly-distinct members become their own spectral sub-archetypes (all remain Spectral-typed — no lore violence). This caps each resulting archetype while *improving* diversity.
- **Core wraith (humanoid spectre), keep ≤3:** Shadowveil #221, Wraithking #342, Shadowreave #343.
- **Split into own sub-archetypes:**
  - Abyssalord #397 → **spectral-leviathan**
  - Stonekeeper #399 → **mountain-spirit / genius-loci**
  - Wraithstorm #386 → **storm-wraith / lightning-spectre**
  - Glimmeritch #344 → fold to **faerie-sprite** (spectral-fairy hybrid)
  - Venomwraith #322 → **plague-spectre**
  - Lunaspectre #362 → **moonlight-spectre**
  - NG+ spectral additions: Glacigeist #417 → frost-spectre · Pallidoll #419 → **haunted-doll** · Tollwisp #454 + Knellgeist #455 → **bell-spirit** (these are already distinct — they confirm the split approach).

## Cleared / non-issues
- **Pre-Forgotten "Ghost typing" flag (old #362/#373):** STALE. Spectral is a pre-Forgotten-allowed type in the 26-type system; there is no restriction to resolve.
- **Voidaxis #129, Voidlord (renumbered), Psytheon #224, Mosswing #265:** all already correctly classified — no action.

## Deliverable form
**Docs-only.** No `mythical:true` field is added to `js/data.js`. Rationale: nothing in code consumes a mythical flag today; the mechanics-facing tier is already `ngPlusTier`; the only feature a flag uniquely enables is archetype-based dex filtering, which can be derived from this policy on demand. Add the field later only if/when such a feature is built.

## Execution status
- ✅ Forgotten renumber 408–446 → 462–500 applied in `taxonomy.md`.
- ✅ Policy locked (this doc) + `taxonomy.md` over-cap table updated.
- ⏳ **Creature re-archetyping** (cetacean ×2, treant ×1, wraith split) — the data.js lore/emoji edits are creative per-family changes; queued for execution (each gets a propose→approve pass), folded into the BREAKING/UNIFIED workflow.
- ⏳ **Full NG+ (408–461) archetype classification** — deferred to UNIFIED.
