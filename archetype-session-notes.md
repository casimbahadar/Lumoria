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

**Manmade cluster: DONE 13/13** *(INSTRUMENTS landed 2026-05-13, closing the cluster; BANNER dropped 2026-05-12 — permanently removed from roadmap per user call, parallels RIVER + URBAN drops in earlier Phase 1 sessions)*

**Phenomena cluster (5 left):** SMOKE → PERFUME → HOLOGRAM → EXPLOSIVE → WEATHER/ATMOSPHERIC *(SHADOW-CAST + BUBBLE landed 2026-05-13)*

**Roadmap totals:** 33 batches in roadmap (all 33 firm); 28 roadmap done (BUBBLE landed 2026-05-13). **30 categories committed** (28 roadmap + 2 bonus PLANTS/FUNGI). **5 batches remaining** in roadmap: 5 Phenomena. BANNER permanently dropped 2026-05-12 session (parallels RIVER + URBAN drops in earlier Phase 1 work).

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
- **microscope-being, telescope-being** — scientific-instrument candidates inherited from TOOL flag; not picked in APPLIANCE batch. **Now reframed as CAMERA-side candidates** per CAMERA intro's lens-mechanism domain-claim (2026-05-13 session).
- **thermometer-being** — scientific-instrument candidate inherited from TOOL flag; not picked in APPLIANCE batch. **Landed in TOOL retroactively** via separate commit on 2026-05-13 session per CAMERA cross-section redirect (measurement-instrument without lens-mechanism, doesn't fit CAMERA — opens new `**Measurement / precision**` sub-group in TOOL).
- **electric-shaver-being, chainsaw-being** — personal-care / power-tool candidates not picked (hairdryer + electric-drill kept).

### From Manmade cluster (STATUE deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **venus-de-milo-being, discobolus-being, bust / portrait-bust-being** — classical/Renaissance candidates not picked (david + equestrian-statue kept).
- **moai / easter-island-being, sphinx-statue-being** — iconic-monument candidates not picked; both confirmed STATUE-domain (per user sub-decision answers) if/when added in future densification.
- **buddha-statue-being, crucifix-being, madonna-statue-being, jizo-statue-being** — religious-sculpture candidates not picked (n/a per user).
- **gravestone / tombstone-being, weeping-angel-being, memorial-obelisk-being** — tomb/memorial candidates not picked; weeping-angel confirmed STATUE-domain (per user sub-decision); memorial-obelisk flagged ARCHITECTURE-borderline.
- **garden-gnome-being, lawn-flamingo-being** — garden-decorative candidates not picked (garden-cherub kept).
- **atlas-being** → user redirected to MYTHICAL-side candidate (titan-form fits MYTHICAL roster). Logged for possible future MYTHICAL densification.
- **caryatid-being** — column-figure-female-support candidate not picked (ARCHITECTURE-borderline; column-as-figure).
- **gargoyle-statue-being** — candidate not picked; confirmed STATUE-domain (per user sub-decision; frozen-stone-gargoyle = STATUE, animate-gargoyle = MYTHICAL).
- **wax-figure-being, mannequin-being, nutcracker-being, totem-pole-being, bobble-head-being, bronze-horseman-being** — specialty/figurative candidates not picked (nutcracker + bobble-head flagged TOY-borderline; mannequin flagged TOOL/APPLIANCE-borderline; bronze-horseman concept implicitly covered by generic equestrian-statue).
- **abstract-sculpture-being** — DROPPED entirely (non-figurative; doesn't fit STATUE's representational definition per user call).

### From Manmade cluster (ROBOTIC deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **automaton-being** — clockwork-Victorian / da-Vinci-mechanical period-flavor humanoid candidate; not picked (android + mech + cyborg covered the humanoid sub-cluster).
- **humanoid-robot-being** — mid-tech generic humanoid candidate; not picked (android polish + mech bulk bracketed the silhouette).
- **toy-robot-being** — tin-toy / retro boxy-robot candidate, carried over from TOY deferral ("toy-robot remains for ROBOTIC" per TOY intro); explicitly **not picked** this batch per user call. Remains as inherited candidate for any future ROBOTIC densification.
- **assistant-bot / butler-robot-being** — service-android tray-arms silhouette; not picked (companion-bot/pet-robot covered the domestic sub-cluster).
- **factory-arm / industrial-robot-arm-being** — articulated-manipulator candidate; not picked (industrial sub-cluster left empty this batch).
- **drone-being** — autonomous-aerial quad-rotor candidate; not picked. ROBOTIC-domain confirmed (vs. VEHICLE) per intro convention; logged for possible future ROBOTIC densification.
- **rover-being** — wheeled exploration robot (Mars-rover silhouette) candidate; not picked.
- **surveillance-bot-being** — camera-headed patrol robot candidate; **deferred to CAMERA cross-section call** to avoid pre-empting the CAMERA batch (per user sub-decision: "not relevant").
- **nanobot-swarm-being** — microscale-swarm-form candidate; not picked. **ROBOTIC-domain confirmed** per user call (engineered-not-living, distinguishes from MICROORGANISMS swarm convention).
- **self-driving-car-being** — autonomous-vehicle borderline; user call: **stays VEHICLE-side** since car-being already covers the silhouette (no ROBOTIC duplicate needed).
- **sentient-AI-core-being** — landed as entry this batch; ROBOTIC-domain confirmed per user call (vs. VOID/COSMIC/ABSTRACT or UNIQUE/ONE-OF-A-KIND).
- **cyborg-being** — landed as entry this batch; ROBOTIC-domain confirmed per user call (vs. MYTHICAL/UNIQUE redirect, which would have paralleled atlas/cauldron pattern).
- **mech-suit-pilot-pair-being** — paired SYMBIOSIS-style entry candidate; not picked (SYMBIOSIS cluster already covers paired-being framing; mech-being covers the silhouette here).
- **robotic-arm-prosthetic-being** — wearable cyborg-component candidate; not picked (cyborg-being covers part-organic-part-machine umbrella).

### From Manmade cluster (CAMERA deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **polaroid / instant-camera-being, disposable-camera-being, bellows / large-format-camera-being, point-and-shoot / compact-camera-being** — photographic-camera candidates not picked (generic camera + DSLR covered the sub-cluster).
- **broadcast / TV-news-camera-being** — cinematic candidate not picked (movie-camera + camcorder covered the sub-cluster).
- **CCTV / surveillance-camera-being, trail-cam / wildlife-camera-being** — surveillance candidates not picked (dashcam/bodycam covered the sub-cluster).
- **surveillance-bot-being** — camera-headed patrol robot candidate; **CAMERA-domain confirmed** per user call (resolves ROBOTIC deferral that explicitly redirected to CAMERA cross-section call), but not picked this batch — logged as inherited candidate from ROBOTIC.
- **telescope-being** — long-tube astronomical/spyglass optical-instrument candidate; **CAMERA-domain confirmed** per user call (lens-mechanism reframing — CAMERA is canonical home), but not picked. Inherited from TOOL→APPLIANCE deferral chain.
- **microscope-being** — base + eyepiece + objective optical-instrument candidate; **CAMERA-domain confirmed** per user call, but not picked. Inherited from TOOL→APPLIANCE deferral chain.
- **periscope-being** — extending L-shaped viewer candidate; **CAMERA-domain confirmed** per user call (rather than VEHICLE submarine-component), but not picked.
- **daguerreotype / antique-camera-being, pinhole-camera-being** — specialty/vintage camera candidates not picked.
- **photo-booth-being** — curtained-cabinet 4-strip-output booth candidate; **CAMERA-domain confirmed** per user call (camera-in-a-box vs. ARCHITECTURE-cabinet), but not picked.
- **spy-cam / hidden-camera-being** — disguised-form camera candidate not picked.
- **thermometer-being** — measurement-instrument flagged in earlier APPLIANCE deferrals; **redirected to TOOL-side per user call this session — landed in TOOL retroactively** via separate commit (new `**Measurement / precision**` sub-group). No lens-mechanism → outside CAMERA's optical-apparatus definition.
- **camera-obscura-being, kaleidoscope-being, light-meter-being, projector-being** — adjacent-concept candidates not proposed this batch (projector would lean HOLOGRAM-side; camera-obscura is borderline ARCHITECTURE; light-meter is measurement-instrument like thermometer; kaleidoscope is optical-toy candidate).
- **smartphone-camera-being** — implicit duplicate of APPLIANCE's smartphone-being; not pulled here per user "agree" call.

### From Manmade cluster (INSTRUMENTS deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **snare-drum-being, bass-drum-being, timpani / kettle-drum-being, djembe / hand-drum-being, tambourine-being** — percussion candidates not picked (generic drum-being covered the sub-cluster).
- **marimba-being** — xylophone's larger cousin; not picked (xylophone-being kept as the canonical mallet-instrument form).
- **pipe-organ / organ-being** — INSTRUMENTS-domain confirmed per user call (vs. ARCHITECTURE cathedral-fixture framing) but not picked. Future-densification candidate.
- **accordion-being** — squeezebox candidate from pre-staged candidate list; not picked.
- **cello-being, lute / lyre / mandolin-being** — string candidates not picked (violin + harp + generic guitar covered the sub-cluster).
- **saxophone-being, clarinet-being, tuba-being, french-horn-being** — wind candidates not picked (trumpet/brass + flute/wind covered the sub-cluster).
- **bell-being, gong-being** — bell/gong-default candidates from pre-staged list not picked.
- **church-bell-being, temple-gong-being** — INSTRUMENTS-domain confirmed per user call (vs. ARCHITECTURE bell-tower / temple-structure framing) but not picked.
- **cymbal-being, triangle-being** — small-percussion candidates not picked.
- **electric-guitar-being** — implicitly covered by generic guitar-being under 1+1 cap per user call (no separate split). Logged to record the design decision, not as a pickable candidate.
- **synthesizer / keyboard-being, drum-machine-being, theremin-being, turntable / DJ-deck-being** — electronic-instrument candidates; **INSTRUMENTS-domain confirmed** per user call (performance-instrument with player-interface = INSTRUMENTS, not APPLIANCE) but none picked.
- **didgeridoo-being, bagpipe-being, sitar-being, erhu-being, ocarina-being, harmonica-being, kazoo-being** — folk/world/specialty candidates; not picked (only shamisen/koto landed as the folk/world representative).
- **bongo-being, congas-being, ukulele-being, banjo-being, oboe-being, bassoon-being, double-bass-being, sousaphone-being** — adjacent canonical instruments not proposed this batch (logged for future densification awareness).
- **whistle-being** — TOY-side carryover candidate; per user call stays TOY-side (not pulled into INSTRUMENTS as wind-instrument). Logged for possible future TOY densification only.
- **music-box-being** — already in TOY's `**Mechanical / Wind-up**` sub-group; not duplicated here (wind-up plaything framing wins over performance-instrument framing for the canonical music-box).
- **tuning-fork-being** — already in TOOL's `**Sound / signaling**` sub-group as pitch-precision tool; not duplicated here.

### From Phenomena cluster (SHADOW-CAST deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **cast-shadow / your-shadow-being** — the personal-shadow-anchored-to-owner default candidate; not picked (silhouette-being chosen as generic-form; doppelganger + shadow-twin chosen as detached/paired variants).
- **eclipse-shadow-being, solar-eclipse-being, lunar-eclipse-being, penumbra-being, umbra-being** — astronomical-shadow candidates; **SHADOW-CAST-domain confirmed** per user call (vs. NATURAL-DISASTER overlap, though NATURAL-DISASTER's meteor-strike/supernova are cosmic-adjacent), but none picked.
- **tree-shadow-being, building-shadow-being, shadow-on-wall-being, silhouette-against-light-being** — object-cast-shadow candidates not picked (silhouette-being covers the generic-cutout concept).
- **shadow-puppet-being** — TOY deferral carryover ("shadow-puppet defers to SHADOW-CAST" per TOY intro); **SHADOW-CAST-domain confirmed** but not picked this batch — logged as inherited candidate from TOY.
- **shadow-play / shadow-theater-being** — projected-performance ensemble candidate not picked.
- **magic-lantern-projection-being** — pre-cinema light-blockage projection candidate; **SHADOW-CAST-domain confirmed** per user call (vs. HOLOGRAM projection framing — mechanism is silhouette-cutout, not light-emission) but not picked.
- **crepuscular-ray-being, anticrepuscular-ray-being, earth-shadow-being** — atmospheric god-ray / horizon-band candidates; not picked. Earth-shadow-being adjacent to WEATHER/ATMOSPHERIC upcoming (sunset-horizon-band overlap).
- **fear-shadow / dread-shadow-being, dusk-shadow / nightfall-shadow-being** — **DROPPED entirely** per user call (out-of-scope; conceptual fear-shadow leaned MYTHICAL wraith / VOID abstract, dusk-shadow leaned WEATHER twilight — neither cleanly SHADOW-CAST).
- Other adjacent candidates not proposed this batch: dappled-light, mottled-shadow, sundial-gnomon-shadow, opaque-glass-blur (logged for future densification awareness).

### From Phenomena cluster (BUBBLE deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **bubble-bath / suds-being** — separate-foam candidate not picked (user picked dish-soap / detergent-foam-being as the foam representative; bubble-bath context-variant not pulled).
- **bubble-wrap-being** — sheet-of-air-pockets candidate not picked.
- **single-bubble-in-water-being, foam-being (generic), sea-foam-being, champagne-bubble / fizz-being** — liquid/aerated candidates not picked (boiling-bubble-being kept as the canonical rising-bubble form).
- **geodesic-dome / protective-dome-bubble-being** — built-rigid-dome candidate; **ARCHITECTURE-side per user call** (built-rigid-structure framing wins over transparent-film-bubble framing). Logged for possible future ARCHITECTURE densification (ARCHITECTURE cluster is already DONE — would require retro-add similar to thermometer→TOOL precedent if ever pursued).
- **plastic-bubble / quarantine-bubble-being** — medical/iconic sealed-environment candidate not picked.
- **glass-blowing-bubble-being** — craft-process molten-glass sphere candidate not picked.
- **ball-pit-ball-being** — single solid plastic ball candidate not picked (TOY-side framing; solid-not-bubble).
- **hot-air-balloon-being, blimp-being, dirigible-being** — passenger-carrying inflatables; **stay VEHICLE-side candidates per user call** (existing VEHICLE deferrals). Convention: passenger-carrying inflatable = VEHICLE-side; decorative/non-transport inflatable = BUBBLE.
- **crystal-ball / orb-being** — solid-sphere candidate; **stays CRYSTALLINE/GEM-side per user call** (solid-not-hollow framing; CRYSTALLINE is already DONE — would require retro-add if ever pursued).
- **cell / vesicle / blood-cell-being** — biological-membrane-bubble candidates; **stay MICROORGANISMS-side per user call** (MICROORGANISMS is already DONE — biological framing wins, no BUBBLE duplicate).
- **pearl-being** — solid-sphere wearable candidate; **stays JEWELRY-side per user call** (JEWELRY is already DONE — pearl deferred from JEWELRY batch as wearable; not pulled into BUBBLE).
- Other adjacent unproposed candidates: spit-bubble, fish-bubble-breath, bubble-tea-pearl, mucus-bubble / nasal-bubble, oxygen-bubble-from-plant, frog's-throat-bubble (logged for future densification awareness).

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
| Manmade | DONE 13/13 | ARCHITECTURE + VEHICLE + TOY + GAME-PIECE + JEWELRY + CONTAINER + TOOL + APPLIANCE + STATUE + TROPHY + ROBOTIC + CAMERA + INSTRUMENTS done. **BANNER permanently dropped 2026-05-12.** Cluster closed 2026-05-13. |
| Phenomena | IN PROGRESS 2/7 | SHADOW-CAST + BUBBLE landed 2026-05-13. BUBBLE resolves TOY's balloon + balloon-animal deferrals. Remaining deferrals targeting Phenomena: fumarole → SMOKE; snowdrift / icicle-formation / polar-night → WEATHER. |

---

## Session log

- **2026-05-11 session** — PR #41 (merged). 22 commits: 7 new categories (CAVE/UNDERGROUND, GLACIER, HOT-SPRING, ISLAND, CLAY/CERAMIC, THREAD/CLOTH, INK/PIGMENT, METAL-OBJECT, ARCHITECTURE, VEHICLE — net 10 added incl. URBAN-then-dropped) plus framing/cleanup commits. RIVER and URBAN clusters dropped. Duraludon precedent established. Multi-silhouette format introduced.
- **2026-05-12 session** — TOY landed as 18th committed category (12 entries across 6 sub-groups: plush/dolls, action figures, vehicles-as-toys, construction toys, mechanical/wind-up, classic/misc). INSTRUMENTS placeholder added at end of Manmade as tentative 14th slot, then confirmed-as-batch later same session (entries deferred to future session). GAME-PIECE landed as 19th committed category (13 entries across 5 sub-groups: chess sub-cluster, cards/suits, dice, tokens, specialty). Tarot Major Arcana picks moved to MYTHICAL CREATURES → new Arcana / divination / fortune-telling sub-section (separate commit, 5 entries). JEWELRY landed as 20th committed category (8 entries across 5 sub-groups: neckwear pendant+amulet, finger/hand ring+wedding-band, generic earring, crown+tiara, ancient-coin). Resolves METAL-OBJECT's coin-deferral + TOY's charm-toy-deferral (charm-bracelet logged as candidate). CONTAINER landed as 21st committed category (9 entries across 5 sub-groups: pottery jar+urn+amphora, drinkware goblet/chalice+wine-glass, boxes treasure-chest+coffin, bags suitcase, utility paint-can). Resolves INK/PIGMENT's paint-can-deferral (ink-pot logged as candidate). Coffin retained despite VEHICLE hearse-drop precedent. Cauldron flagged for MYTHICAL as future-session candidate. TOOL landed as 22nd committed category (14 entries across 7 sub-groups: hand-tools hammer+saw+pickaxe+axe, cutting knife+scissors, weapons sword+spear+bow-and-arrow+dagger, writing quill, keys/locks key-padlock-paired-pair, fishing harpoon, sound tuning-fork). Resolves METAL-OBJECT's weapons+keys deferral and INSTRUMENTS placeholder's tuning-fork note. Whistle redirected to TOY as TOY-side candidate (not added this session). Mid-session framing clarification: "logged as candidate" / "flagged for X" means tracked for possible future pick — **no commitment** an entry will ever land. APPLIANCE landed as 23rd committed category (18 entries across 8 sub-groups: kitchen fridge+oven/stove/cooktop-combined+microwave+coffee-maker, laundry vacuum-cleaner, HVAC air-conditioner+humidifier, computing desktop+laptop+smartphone+tablet, gaming slot-machine+pinball, office copier, industrial kiln+generator, personal-care+power-tools hairdryer+electric-drill). Resolves CLAY/CERAMIC's kiln-deferral, partial of GAME-PIECE's arcade-deferral (slot+pinball landed; arcade-cabinet+roulette logged as candidates), and TOOL's electric-drill-borderline distinction. Modern computing kept per user "Keep" call. Gaming-console redirected to TOY-side candidate (matches whistle pattern). STATUE landed as 24th committed category (5 entries across 3 sub-groups: classical david+equestrian, iconic statue-of-liberty+terracotta-warrior, garden cherub). Tight batch. Resolves CLAY/CERAMIC's figurines/warriors-deferral (terracotta-warrior landed; metal-statues from METAL-OBJECT covered conceptually by generic statues like david). Atlas redirected to MYTHICAL-side candidate. Abstract-sculpture dropped (non-figurative; outside STATUE definition). Convention bake-ins: gargoyle/weeping-angel/sphinx/moai confirmed STATUE-domain if added later. **BANNER permanently dropped from roadmap** per user call (parallels RIVER + URBAN drops). Manmade total slots: 14 → 13. Dangling references: THREAD/CLOTH's flag-form mention (line 975) and JEWELRY's heraldic-sash mention left as historical-references per user Option A choice. TROPHY landed as 25th committed category (2 entries, single Awards sub-group: medal + laurel-wreath). Tight wrap-batch. Laurel-wreath flagged JEWELRY-headwear-adjacent but kept here as Olympic-award convention. 10 candidates logged (trophy-cup, blue-ribbon, plaque, olympic-medal-distinct, statuette-trophy, championship-belt, certificate/diploma, ribbon-rosette, prize-pennant, key-to-the-city). Counters now: **25 committed / 11 remaining**. Session wrapped after TROPHY.
- **2026-05-13 session** — ROBOTIC landed as 26th committed category (8 entries across 3 sub-groups: humanoid/android android+mech/mecha+cyborg, companion/domestic robot-vacuum+companion-bot, sci-fi/specialty battle-bot+sentient-AI-core+robo-spider). Resolves APPLIANCE's robot-vacuum borderline-deferral (lands here per autonomous-AI = ROBOTIC convention). Mech/mecha silhouette evokes Gundam-Wing piloted combat-frame per user flavor call; battle-bot kept distinct (smaller-than-mech autonomous-combat-drone scale). User domain calls baked in: cyborg-being judged ROBOTIC (not MYTHICAL/UNIQUE redirect); sentient-AI-core-being judged ROBOTIC (not VOID/COSMIC/ABSTRACT or UNIQUE redirect); nanobot-swarm ROBOTIC-domain confirmed though not picked; self-driving-car stays VEHICLE-side (car-being covers silhouette). Toy-robot proposed (carryover from TOY deferral "remains for ROBOTIC") but explicitly **not picked** this batch — logged as inherited candidate. Surveillance-bot deferred to CAMERA cross-section call (avoids pre-empting CAMERA batch). Other candidates logged but not picked: automaton, humanoid-robot, assistant-bot/butler-robot, factory-arm/industrial-arm, drone, rover, mech-suit-pilot-pair, robotic-arm-prosthetic. **Thermometer-being retro-added to TOOL** via separate commit later in session per CAMERA cross-section redirect — new `**Measurement / precision**` sub-group added to TOOL (opens room for future ruler / drawing-compass / hourglass candidates inherited from TOOL deferrals); APPLIANCE-deferrals block in this file split to reflect thermometer landed retro vs. microscope+telescope reframed as CAMERA-side candidates. **CAMERA landed as 27th committed category** (7 entries across 4 sub-groups: photographic camera+DSLR, cinematic movie-camera+camcorder, surveillance dashcam/bodycam, optical binoculars+magnifying-glass). Resolves TOOL's magnifying-glass-deferral via lens-mechanism reframing. User domain calls baked in: optical-instruments (telescope / microscope / magnifying-glass / binoculars / periscope) take CAMERA as canonical home per user call (lens-mechanism reframing — image-capture AND lens-based-observation both qualify); surveillance-bot CAMERA-domain confirmed (resolves ROBOTIC deferral); photo-booth CAMERA-domain confirmed; periscope CAMERA-domain confirmed (vs. VEHICLE submarine-component); thermometer NOT CAMERA-domain → TOOL retro-add per above. Smartphone-camera implicitly covered by APPLIANCE smartphone-being (no duplicate per user agree). APPLIANCE intro line 1234's "Microscope / telescope / thermometer flagged from TOOL as APPLIANCE candidates" reference left as historical-reference per user Option A convention (no retroactive rewrites of already-committed batch intros). Counters now: **27 committed / 9 remaining**. Manmade cluster 12/13. **INSTRUMENTS landed as 28th committed category** later in same session (9 entries across 5 sub-groups: percussion drum, keyboard/mallet piano+xylophone, string violin+harp+generic-guitar, wind trumpet+flute, folk shamisen/koto). Resolves TOY's musical-toy/xylophone/toy-drum deferrals via canonical adult-instrument forms (xylophone-being + drum-being). User domain calls baked into intro: synthesizer/drum-machine/theremin/DJ-turntable INSTRUMENTS-domain confirmed (vs. APPLIANCE) but none picked; church-bell/temple-gong/pipe-organ INSTRUMENTS-domain confirmed (vs. ARCHITECTURE bell-tower/cathedral-fixture) but none picked; electric-guitar implicitly covered by generic guitar-being under 1+1 cap (no split). Whistle stays TOY-side (not pulled). INSTRUMENTS placeholder qualifier `*(confirmed batch — entries pending future session)*` dropped from H2 heading per user call. **Closes Manmade cluster at 13/13 — Manmade cluster DONE.** Counters now: **28 committed / 7 remaining**. **SHADOW-CAST landed as 29th committed category** later in same session — opens Phenomena cluster (4 entries across 2 sub-groups: personal/detached silhouettes silhouette+doppelganger-shadow+shadow-twin, ambient/pooled shadow-pool-being). Per user clarification, shadow-pool-being framed as a *living puddle of pure shadow and darkness* (sentient dark-liquid form, ground-pooling or wall-creeping) rather than ambient-canopy-gathering — distinct from MYTHICAL slimes via shadow-not-fluid substance framing. 6 cross-section conventions baked into intro per user confirms: (1) absolute-dark-environment = CAVE pitch, cast-shadow-from-light-source = SHADOW-CAST; (2) spectral-undead-spirit = MYTHICAL wraith/shade, formless-shadow-flicker = MYTHICAL shadow-wisp, slimes-of-substance = MYTHICAL slimes, physical-cast-shadow = SHADOW-CAST; (3) elemental-substance = ELEMENTALS dark/shadow-elemental, phenomenon = SHADOW-CAST; (4) light-reflection = VOID mirror, formless-darkness = VOID void-being, abstract-light/dark = VOID duality, light-blockage = SHADOW-CAST; (5) projected-light-presence = HOLOGRAM, projected-light-absence (shadow-puppet/magic-lantern) = SHADOW-CAST; (6) fully-autonomous shape-mimic = MYTHICAL shapeshifter, anchored-to-visual-source shadow-mimic = SHADOW-CAST (doppelganger-shadow lands here). Eclipse-shadows + magic-lantern-projection SHADOW-CAST-domain confirmed but not picked. F-group conceptual candidates (fear-shadow, dusk-shadow) **dropped entirely** as out-of-scope. Shadow-puppet TOY-deferral carryover logged as SHADOW-CAST-domain inherited candidate (not picked). Counters now: **29 committed / 6 remaining**. Phenomena cluster IN PROGRESS 1/7. **BUBBLE landed as 30th committed category** later in same session (11 entries across 4 sub-groups: soap/film soap-bubble+dish-soap-foam, inflatables balloon+balloon-animal+bubble-gum+beach-ball+inflatable-pool-toy, liquid boiling-bubble, encapsulating force-field+snow-globe+terrarium-globe). Resolves TOY's balloon + balloon-animal deferrals. User domain calls baked into intro: snow-globe BUBBLE-domain ("snow-globe object looks like a bubble" — vs. CONTAINER vessel framing); force-field / energy-bubble BUBBLE-domain ("force-field over a town can look like a bubble" — vs. HOLOGRAM projection or COSMOLOGICAL energy-substance); geodesic-dome / protective-dome stays ARCHITECTURE-side (built-rigid-structure); hot-air-balloon / blimp / dirigible stays VEHICLE-side (passenger-carrying inflatable convention); crystal-ball / orb stays CRYSTALLINE-side (solid-not-hollow); cell / vesicle / blood-cell stays MICROORGANISMS-side (biological-membrane framing); pearl stays JEWELRY-side (wearable solid-sphere). Candidates logged but not picked: bubble-bath/suds, bubble-wrap, single-bubble-in-water, generic foam, sea-foam, champagne-bubble/fizz, plastic-bubble/quarantine-bubble, glass-blowing-bubble, ball-pit-ball. Counters now: **30 committed / 5 remaining**. Phenomena cluster IN PROGRESS 2/7. Next: SMOKE *(or close session)*.
