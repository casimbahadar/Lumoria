# Phase 1 archetype brainstorm — session notes

Persistent record of cross-session framing decisions, deferred items, and workflow rules for the `archetype-subtypes.md` Phase 1 roadmap. Updated by each session as work progresses. The roadmap counters themselves live in `TODO.md` line 94 (source of truth); this file holds the *narrative* context that doesn't fit there.

---

## Key framing decisions (canonical across sessions)

1. **Duraludon precedent** — Pokemon's bipedal skyscraper-creature is the canonical reference for "building / landmass / architectural-feature as walking creature." Every Habitat and ARCHITECTURE section intro carries this clause. Apply the same precedent to STATUE and any future cluster where the entry is a *structure/place* given creature-form.

2. **Creature framing over place framing** — every entry below a cap-1+1 line is a *discrete walking Lumori*, not an abstract personification of a location/setting. Section intros must make this explicit; ambiguous wording (e.g. "the X itself animated") should be paired with a creature-framing clause.

3. **Multi-silhouette format** — entries with multiple acceptable visual designs use:
   ```
   *as creature: [primary silhouette]. Alternative silhouette: [alt 1]. Alternative silhouette (letter): [alt 2].*
   ```
   Examples in `archetype-subtypes.md`: hot-spring (2 alts), lagoon (2 alts), geyser (2 alts), floating-island (5 alts).

4. **Open silhouettes by default** — most entries should be left silhouette-less so the user has design freedom during the appearance-design phase. Only add per-entry silhouettes when (a) the entry is ambiguous and needs a creature-vs-place clarifying tag, or (b) the user explicitly requests one. ARCHITECTURE keeps silhouettes only for pagoda + cathedral; VEHICLE has none.

5. **Cross-section deferrals tracked in intros** — each section intro names items that *could* have lived here but were deferred to another batch (e.g. graffiti → INK; sailcloth → THREAD; mineshaft → ARCHITECTURE then deferred). This prevents double-slotting later.

6. **Behavioral notes survive silhouette strips** — when silhouettes are removed from an entry, any behavioral/lore content (e.g. fortress-wall's protective tendency toward castle-being) should be preserved as a separate `*behavior: ...*` italic tag.

---

## Workflow rules in force

Per `CLAUDE.md` and TODO.md line 94:

- **Always confirm before acting** — propose → letter-picks → write → commit → push. No "obvious next step" auto-applies.
- **Per-batch commits** — each new top-level category is one commit; TODO.md refreshes are separate commits at cluster handoffs.
- **PR strategy: session-stacked or per-batch** — 2026-05-11 session used one stacked PR (#41, merged). Future sessions may choose per-batch PRs if preferred; confirm at session start.
- **Branch from latest `main`** at session start to pick up prior session merges.

---

## Run order remaining (post-2026-05-11)

**Manmade cluster (6 left):** STATUE → BANNER → TROPHY → ROBOTIC → CAMERA → INSTRUMENTS *(confirmed)*

**Phenomena cluster (7):** SHADOW-CAST → BUBBLE → SMOKE → PERFUME → HOLOGRAM → EXPLOSIVE → WEATHER/ATMOSPHERIC

**Roadmap totals:** 34 batches in roadmap (33 firm + INSTRUMENTS confirmed-pending-entries); 21 roadmap done (APPLIANCE landed). **23 categories committed** (21 roadmap + 2 bonus PLANTS/FUNGI). **14 batches remaining** in roadmap: 5 Manmade + INSTRUMENTS confirmed-pending + 7 Phenomena. INSTRUMENTS reframed from "tentative" to "confirmed batch — entries deferred to future session" earlier this session.

*Deferral / carryover framing clarification (added 2026-05-12 mid-session):* Items "logged as candidates" or "flagged for [category]" in deferral lists are tracked-for-possible-future-pick. There is **no commitment** that an entry will ever land. Future-session brainstorms may pick from these lists, propose alternative entries, or leave a candidate dormant indefinitely.

---

## Deferred / unassigned items (revisit when relevant)

Carried across batches without a final home. Each may end up reassigned to a future cluster or dropped entirely.

### From Habitat cluster
- **magma-chamber-being** — declined from CAVE and HOT-SPRING.
- **hydrothermal-vent / black-smoker** — declined from CAVE and HOT-SPRING.
- **desert-island-being** — entry exists in ISLAND but silhouette intentionally removed; user wants to revisit concept.
- **beach / sandy-shore-being** — entry exists; silhouette intentionally blank (user has design in mind).
- **snowdrift, icicle-formation, polar-night** — explicitly deferred to WEATHER/ATMOSPHERIC batch.
- **fumarole / steam-only vent** — flagged SMOKE-adjacent, deferred.

### From Materials cluster
- **steel-being** as alloy-form — deferred to avoid collision with Steel-type element.
- **molten-metal-being** — deferred to avoid magma-chamber/FIRE overlap.
- **coin** — defers to JEWELRY batch.
- **paint-can, ink-pot** vessel forms — defer to CONTAINER.
- **printer-ink, pen-ink (fountain, ballpoint)** — defer to TOOL.

### From Manmade cluster (ARCHITECTURE deferrals)
- **mineshaft** — carried CAVE → ARCHITECTURE → deferred again. No home yet.
- **bridge, dam, dungeon, watchtower, pier, stupa, ziggurat, cottage, yurt** — proposed for ARCHITECTURE but not picked.

### From Manmade cluster (VEHICLE deferrals)
- **sailboat / yacht** (with sailcloth carryover from THREAD).
- **bicycle, rowboat / canoe, hot-air balloon, blimp / dirigible, sled / sleigh, hovercraft / hovercar**.
- **hearse / coffin-on-wheels** — flagged as specialty too dark; dropped.

### From Manmade cluster (TOY deferrals)
- **toy-car, model-train** — carried over from VEHICLE deferrals; offered in TOY proposal but not picked.
- **tin-soldier-being, toy-robot-being** — proposed but not picked (toy-robot remains for ROBOTIC).
- **sock-puppet, ventriloquist-dummy, finger-puppet, porcelain-doll** — plush/doll candidates not picked.
- **action-figure variants (collectible-figurine, army-men)** — proposed but not picked.
- **hobby-horse, building-block, interlocking-brick, erector / construction-set** — proposed but not picked.
- **jack-in-the-box, yo-yo** — wind-up/mechanical candidates not picked.
- **bouncy-ball, pinwheel** — classic/misc candidates not picked.
- **balloon-animal, shadow-puppet, charm-toy, board-game-piece, slingshot, musical-toy / xylophone / toy-drum** — flagged as adjacent and deferred to their respective clusters (BUBBLE, SHADOW-CAST, JEWELRY, GAME-PIECE, TOOL, INSTRUMENTS-or-TOOL).

### From Manmade cluster (GAME-PIECE deferrals)
- **checkers-piece, go-stone, shogi-piece, backgammon-checker, meeple, generic-game-token** — board-piece candidates proposed but not picked.
- **trading-card-being** — proposed but not picked (collectible card vs. playing-card distinction; user kept only 52-deck playing-card + 4 individual suits).
- **six-sided-die-being, coin-flip-being** — proposed but not picked (polyhedral-die covers the dice slot; coin-flip dropped since currency-coin lives in JEWELRY).
- **poker-chip, mahjong-tile, domino** — token candidates not picked.
- **game-board, spinner, generic-pawn, hourglass-timer, jenga-block, yahtzee-cup, bingo-ball, game-controller** — track/marker/specialty candidates not picked.
- **slot-machine, roulette-wheel, pinball, arcade-cabinet** → flagged for APPLIANCE.
- **paper-fortune-teller (cootie-catcher)** → flagged for TOY (re-emergence possible).
- **tarot-card / Major Arcana** → moved to MYTHICAL CREATURES this session as new `### Arcana / divination / fortune-telling` sub-section (separate commit). User decision: tarot is mystical/archetypal, fits Mythical better than mechanical game-piece.

### From Manmade cluster (JEWELRY deferrals)
- **talisman-being** — proposed but not picked (slot reserved alongside amulet-being; distinction: talisman attracts luck vs. amulet wards harm).
- **locket-being, pearl-strand-being, choker-being** — neckwear candidates not picked.
- **signet-ring-being, gem-encrusted-ring-being** — ring variants not picked (signet flagged for STATUE / heraldic crossover).
- **hoop-earring-being, stud-earring-being, nose-ring-being, lip-ring-being** — ear/face piercing candidates not picked (earring-being kept as generic per user pick).
- **bracelet-being, bangle-being, charm-bracelet-being, friendship-bracelet-being, cuff-bracelet-being, anklet-being, armlet-being** — wrist/arm/ankle candidates not picked. (charm-bracelet was carryover from TOY's charm-toy deferral; friendship-bracelet was carryover from THREAD/CLOTH's non-claim.)
- **diadem-being, circlet-being** — crown-variant candidates not picked (crown + tiara kept).
- **brooch-being, cufflink-being, body-chain-being** — body/decorative candidates not picked.
- **coin-being (generic), gold-coin-being** — coin variant candidates not picked this batch; user picked split-coin framing → ancient-coin-being kept now; generic / gold-coin entries deferred to a future session.

### From Manmade cluster (CONTAINER deferrals)
- **pot-being, vase-being** — pottery candidates not picked (user's "distinct" framing means future entries would split separately; jar-being kept this batch).
- **ink-pot / inkwell-being** — INK/PIGMENT carryover deferral; reached CONTAINER but not picked this batch (paint-can resolved; ink-pot deferred again to future CONTAINER densification session).
- **teacup-being, mug-being, tankard-being** — drinkware candidates not picked (goblet/chalice + wine-glass kept).
- **bottle-being, wine-bottle-being, flask-being, canteen-being, thermos-being** — bottle/flask candidates not picked.
- **box-being, crate-being, jewelry-box-being** — box/chest candidates not picked (treasure-chest + coffin kept).
- **basket-being, sack-being, backpack-being, handbag / purse-being** — bag/soft-container candidates not picked (suitcase/luggage kept).
- **barrel-being, bucket-being** — utility candidates not picked.
- **cauldron-being** → flagged for MYTHICAL CREATURES (witch-cauldron iconography; future-session add probably in `### Other mythical (cross-cultural)`).
- **shipping-container-being** — declined this batch; VEHICLE cargo-ship's "container-stack shoulders" descriptor implicitly covers the concept (no standalone entry needed).
- **envelope-being, gourd / hollow-fruit-being, piggy-bank-being** — specialty candidates not picked (piggy-bank flagged CLAY/CERAMIC + JEWELRY-coin adjacency; gourd flagged PLANTS/FLORA adjacency).

### From Manmade cluster (TOOL deferrals)
*All entries below are candidates only — no commitment they'll ever be picked. User clarified mid-session that deferrals/carryovers do not imply eventual addition.*
- **screwdriver-being, wrench-being, pliers-being, chisel-being, shovel / spade-being** — hand-tool candidates not picked (hammer + saw + pickaxe + axe kept; shovel/spade is the carryover from GAME-PIECE's TOOL-shovel adjacency flag, logged here as inherited candidate).
- **shears-being** — cutting-tool candidate not picked (knife + scissors kept).
- **shield-being, gun / firearm-being, mace-being** — weapon candidates not picked (firearm explicitly dropped as too-modern/dark, consistent with VEHICLE hearse-drop call; shield flagged defensive-vs-offensive; mace not picked).
- **pen-being (ballpoint / fountain-pen), pencil-being, paintbrush-being, printer-ink-cartridge-being** — writing-implement candidates not picked this batch (only quill kept). INK/PIGMENT's pen-ink + printer-ink-cartridge deferrals reach TOOL but only partially resolved — pen/pencil/paintbrush/cartridge are inherited candidates here.
- **ruler-being, compass-being (drawing-compass two-leg), hourglass / sand-timer-being, magnifying-glass-being** — measuring/precision candidates not picked (hourglass is carryover from GAME-PIECE deferral, inherited).
- **fishing-rod-being, net-being, slingshot-being** — fishing/hunting candidates not picked beyond harpoon (net is carryover from THREAD/CLOTH deferral, inherited; slingshot is carryover from TOY deferral, inherited).
- **whistle-being** → user redirected to TOY as a TOY-side candidate (not a TOOL slot). Logged for possible future TOY densification only.
- **magic-wand-being, wizard-staff-being** — flagged for MYTHICAL CREATURES (mystical-implement domain); not pulled into TOOL.
- **microscope-being, telescope-being** — flagged as APPLIANCE candidates (lens-mechanism artifacts); not picked here.

### From Manmade cluster (APPLIANCE deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **toaster-being, blender-being, dishwasher-being, kettle / electric-kettle-being, rice-cooker-being** — kitchen-appliance candidates not picked (refrigerator + oven/stove/cooktop combined + microwave + coffee-maker kept).
- **washing-machine-being, dryer-being, clothes-iron-being** — laundry/cleaning candidates not picked (vacuum-cleaner kept).
- **space-heater-being, electric-fan-being** — HVAC candidates not picked (air-conditioner + humidifier kept).
- **television / TV-being, radio-being, record-player / phonograph-being, speaker / boombox-being** — entertainment-electronics candidates not picked.
- **gaming-console-being** — proposed for APPLIANCE but user redirected to TOY-side candidate ("probably fits better as Toy"); logged for possible future TOY densification, not added to APPLIANCE or to TOY this session.
- **arcade-cabinet-being, roulette-wheel-being** — gaming-arcade candidates not picked (slot-machine + pinball-machine kept). These were inherited from GAME-PIECE deferral; partial resolution.
- **printer-being, typewriter-being** — office candidates not picked (copier kept).
- **furnace-being, elevator-being** — industrial/heavy candidates not picked (kiln + generator kept; elevator was flagged ARCHITECTURE-borderline).
- **microscope-being, telescope-being, thermometer-being** — scientific-instrument candidates inherited from TOOL flag; not picked this batch.
- **electric-shaver-being, chainsaw-being** — personal-care / power-tool candidates not picked (hairdryer + electric-drill kept).

### From URBAN drop fallout
URBAN was dropped entirely in this session. Its 3 entries migrated to ARCHITECTURE: skyscraper-being, ruin/abandoned-building-being, intersection/crossroads-being. **Other URBAN candidates** proposed but never landed: alleyway, highway-overpass, subway-tunnel, subway-station, apartment-block, rooftop, sidewalk-pavement, manhole-cover, streetlamp, neon-sign, traffic-jam, graffiti (latter went to INK), light-pollution-glow.

### Cross-cluster floating concepts
- **sunken-island / Atlantis-style ruin-landmass** — flagged for MYTHICAL or UNIQUE.
- **rainbow-pool / prismatic-spring** — proposed under HOT-SPRING (J) but not picked.
- **kelp-forest as habitat-being** — kelp-individual stays in PLANTS; the habitat-form would need a slot if wanted.

---

## Cluster completion log

| Cluster | Status | Notes |
|---|---|---|
| Bio (PLANTS, FUNGI, PREHISTORIC, MICROORGANISMS, EGG, SHELL, SYMBIOSIS) | DONE 5/5 | PLANTS + FUNGI predate the 35-batch roadmap (bonus categories). |
| Habitat | DONE 4/4 | RIVER dropped, URBAN dropped (entries → ARCHITECTURE). |
| Materials | DONE 4/4 | All 4 batches landed clean. |
| Manmade | IN PROGRESS 8/14 | ARCHITECTURE + VEHICLE + TOY + GAME-PIECE + JEWELRY + CONTAINER + TOOL + APPLIANCE done. INSTRUMENTS 14th slot confirmed (entries pending future session). Next: STATUE. |
| Phenomena | NOT STARTED 0/7 | Receives multiple deferrals from earlier clusters. |

---

## Session log

- **2026-05-11 session** — PR #41 (merged). 22 commits: 7 new categories (CAVE/UNDERGROUND, GLACIER, HOT-SPRING, ISLAND, CLAY/CERAMIC, THREAD/CLOTH, INK/PIGMENT, METAL-OBJECT, ARCHITECTURE, VEHICLE — net 10 added incl. URBAN-then-dropped) plus framing/cleanup commits. RIVER and URBAN clusters dropped. Duraludon precedent established. Multi-silhouette format introduced.
- **2026-05-12 session** — TOY landed as 18th committed category (12 entries across 6 sub-groups: plush/dolls, action figures, vehicles-as-toys, construction toys, mechanical/wind-up, classic/misc). INSTRUMENTS placeholder added at end of Manmade as tentative 14th slot, then confirmed-as-batch later same session (entries deferred to future session). GAME-PIECE landed as 19th committed category (13 entries across 5 sub-groups: chess sub-cluster, cards/suits, dice, tokens, specialty). Tarot Major Arcana picks moved to MYTHICAL CREATURES → new Arcana / divination / fortune-telling sub-section (separate commit, 5 entries). JEWELRY landed as 20th committed category (8 entries across 5 sub-groups: neckwear pendant+amulet, finger/hand ring+wedding-band, generic earring, crown+tiara, ancient-coin). Resolves METAL-OBJECT's coin-deferral + TOY's charm-toy-deferral (charm-bracelet logged as candidate). CONTAINER landed as 21st committed category (9 entries across 5 sub-groups: pottery jar+urn+amphora, drinkware goblet/chalice+wine-glass, boxes treasure-chest+coffin, bags suitcase, utility paint-can). Resolves INK/PIGMENT's paint-can-deferral (ink-pot logged as candidate). Coffin retained despite VEHICLE hearse-drop precedent. Cauldron flagged for MYTHICAL as future-session candidate. TOOL landed as 22nd committed category (14 entries across 7 sub-groups: hand-tools hammer+saw+pickaxe+axe, cutting knife+scissors, weapons sword+spear+bow-and-arrow+dagger, writing quill, keys/locks key-padlock-paired-pair, fishing harpoon, sound tuning-fork). Resolves METAL-OBJECT's weapons+keys deferral and INSTRUMENTS placeholder's tuning-fork note. Whistle redirected to TOY as TOY-side candidate (not added this session). Mid-session framing clarification: "logged as candidate" / "flagged for X" means tracked for possible future pick — **no commitment** an entry will ever land. APPLIANCE landed as 23rd committed category (18 entries across 8 sub-groups: kitchen fridge+oven/stove/cooktop-combined+microwave+coffee-maker, laundry vacuum-cleaner, HVAC air-conditioner+humidifier, computing desktop+laptop+smartphone+tablet, gaming slot-machine+pinball, office copier, industrial kiln+generator, personal-care+power-tools hairdryer+electric-drill). Resolves CLAY/CERAMIC's kiln-deferral, partial of GAME-PIECE's arcade-deferral (slot+pinball landed; arcade-cabinet+roulette logged as candidates), and TOOL's electric-drill-borderline distinction. Modern computing kept per user "Keep" call. Gaming-console redirected to TOY-side candidate (matches whistle pattern). Counters now: **23 committed / 14 remaining**.
