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

7. **Humanoid creature-as-being framing for abstract / role-based concepts** — when a category is built around abstract concepts that don't have a singular canonical "object-form" (professions, dance styles, sport roles, performance archetypes, etc.), entries may be framed as **humanoid creatures embodying the concept** rather than iconic-item-as-being. The humanoid creature carries the iconic gear / pose / role of the concept as flavor (e.g., judge-being carries gavel + robe; astronaut-being carries spacesuit + helmet; ballet-dancer-being carries pointe-shoes + tutu). Established 2026-05-15 session for DANCE/MOVEMENT and CAREERS/PROFESSIONS clusters per user call. Humanoid framing precedent already exists in MYTHICAL CREATURES (humanoid-wraith / lich / banshee), UNIQUE/ONE-OF-A-KIND (divine-messenger), and elsewhere. **Applicable to future clusters around abstract / role-based concepts.** Existing object-as-being clusters are NOT retroactively rewritten unless the user explicitly requests it; cap-1+1 object-as-being framing remains the established default for most entries.

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

**Phenomena cluster: DONE 7/7** *(SHADOW-CAST + BUBBLE + SMOKE + PERFUME + HOLOGRAM + EXPLOSIVE + WEATHER/ATMOSPHERIC all landed 2026-05-13 — cluster closed; reserved-picks resolved: mirage from HOLOGRAM, snowdrift+icicle+polar-night from GLACIER/Habitat, mist+fog from SMOKE all landed in WEATHER)*

**Roadmap totals:** 33 batches in roadmap (all 33 firm); **33 roadmap done — PHASE 1 CATEGORY ROADMAP COMPLETE** (WEATHER landed 2026-05-13). **35 categories committed** (33 roadmap + 2 bonus PLANTS/FUNGI). **0 batches remaining** in category roadmap. BANNER permanently dropped 2026-05-12 session (parallels RIVER + URBAN drops in earlier Phase 1 work).

**Pending after roadmap closure:** Cross-cluster deferral-review pass (see new section at end of this file).

*Deferral / carryover framing clarification (added 2026-05-12 mid-session):* Items "logged as candidates" or "flagged for [category]" in deferral lists are tracked-for-possible-future-pick. There is **no commitment** that an entry will ever land. Future-session brainstorms may pick from these lists, propose alternative entries, or leave a candidate dormant indefinitely.

---

## Deferred / unassigned items (revisit when relevant)

Carried across batches without a final home. Each may end up reassigned to a future cluster or dropped entirely.

### From Habitat cluster
- **magma-chamber-being** — declined from CAVE and HOT-SPRING. **RENAMED to `magma-being` and LANDED in THERMAL EXTREMES Geothermal/hot sub-group 2026-05-15** per user resolution.
- **hydrothermal-vent / black-smoker** — declined from CAVE and HOT-SPRING. **DROPPED entirely 2026-05-15** per user resolution (no home pursued).
- **desert-island-being** — entry exists in ISLAND but silhouette intentionally removed; user wants to revisit concept.
- **beach / sandy-shore-being** — entry exists; silhouette intentionally blank (user has design in mind).
- **snowdrift, icicle-formation, polar-night** — explicitly deferred to WEATHER/ATMOSPHERIC batch. **All three LANDED in WEATHER batch 2026-05-13** as reserved confirmed-picks (snowdrift was originally a GLACIER entry, dropped from GLACIER and re-routed; icicle + polar-night came from this same Habitat-deferrals row).
- **fumarole / steam-only vent** — flagged SMOKE-adjacent, deferred. **DROPPED entirely 2026-05-13 SMOKE batch** per user call (Habitat-deferral does not land; no remaining home).

### From Materials cluster
- **steel-being** as alloy-form — deferred to avoid collision with Steel-type element. **DROPPED entirely 2026-05-15** per user resolution.
- **molten-metal-being** — deferred to avoid magma-chamber/FIRE overlap. **DROPPED entirely 2026-05-15** per user resolution.
- **coin** — defers to JEWELRY batch. **LANDED in JEWELRY as `ancient-coin-being`.**
- **paint-can** — vessel form, deferred to CONTAINER. **LANDED in CONTAINER.** **ink-pot DROPPED entirely 2026-05-15** per user resolution.
- **printer-ink, pen-ink (fountain, ballpoint)** — defer to TOOL.

### From Manmade cluster (ARCHITECTURE deferrals)
- **mineshaft** — carried CAVE → ARCHITECTURE → deferred again. **DROPPED entirely 2026-05-15** per user resolution.
- **bridge, watchtower** — proposed for ARCHITECTURE but not picked (logged as candidates). *(dam, dungeon, pier, stupa, ziggurat, cottage, yurt DROPPED entirely 2026-05-15 per user resolution.)*

### From Manmade cluster (VEHICLE deferrals)
- **sailboat / yacht** (with sailcloth carryover from THREAD).
- **bicycle, hot-air balloon, blimp / dirigible, hovercraft / hovercar**. *(rowboat / canoe + sled / sleigh DROPPED entirely 2026-05-15 per user resolution.)*
- **hearse / coffin-on-wheels** — flagged as specialty too dark; dropped.

### From Manmade cluster (TOY deferrals)
- *(toy-car + model-train DROPPED entirely 2026-05-15 per user resolution.)*
- **toy-robot-being** — proposed but not picked (toy-robot remains for ROBOTIC). *(tin-soldier-being DROPPED entirely 2026-05-15 per user resolution.)*
- *(sock-puppet, ventriloquist-dummy, finger-puppet, porcelain-doll all DROPPED entirely 2026-05-15 per user resolution.)*
- **action-figure variants (collectible-figurine, army-men)** — proposed but not picked.
- *(hobby-horse, building-block, interlocking-brick, erector / construction-set all DROPPED entirely 2026-05-15 per user resolution.)*
- *(jack-in-the-box, yo-yo, bouncy-ball, pinwheel all DROPPED entirely 2026-05-15 per user resolution.)*
- **balloon-animal, shadow-puppet, charm-toy, board-game-piece, slingshot, musical-toy / xylophone / toy-drum** — flagged as adjacent and deferred to their respective clusters (BUBBLE, SHADOW-CAST, JEWELRY, GAME-PIECE, TOOL, INSTRUMENTS-or-TOOL).

### From Manmade cluster (GAME-PIECE deferrals)
- **game-controller** — track/marker/specialty candidate not picked, kept as candidate.
- **slot-machine, pinball** → flagged for APPLIANCE, **LANDED in APPLIANCE.**
- **tarot-card / Major Arcana** → moved to MYTHICAL CREATURES (Arcana / divination / fortune-telling sub-section, separate commit). User decision: tarot is mystical/archetypal, fits Mythical better than mechanical game-piece.
- *(All other GAME-PIECE deferrals DROPPED entirely 2026-05-15 per user resolution: checkers-piece, go-stone, shogi-piece, backgammon-checker, meeple, generic-game-token, trading-card-being, six-sided-die-being, coin-flip-being, poker-chip, mahjong-tile, domino, game-board, spinner, generic-pawn, jenga-block, yahtzee-cup, bingo-ball, arcade-cabinet, roulette-wheel, paper-fortune-teller / cootie-catcher.)* *(hourglass-timer already dropped 2026-05-15 per N27 dedup — landed in UNIQUE.)*

### From Manmade cluster (JEWELRY deferrals)
- **talisman-being** — proposed but not picked (slot reserved alongside amulet-being; distinction: talisman attracts luck vs. amulet wards harm).
- **locket-being** — neckwear candidate not picked.
- **signet-ring-being, gem-encrusted-ring-being** — ring variants not picked (signet flagged for STATUE / heraldic crossover).
- **hoop-earring-being** — ear-piercing candidate not picked (earring-being kept as generic per user pick).
- **bracelet-being, bangle-being, charm-bracelet-being, anklet-being, armlet-being** — wrist/arm/ankle candidates not picked. (charm-bracelet was carryover from TOY's charm-toy deferral.)
- **diadem-being** — crown-variant candidate not picked (crown + tiara kept).
- **brooch-being** — body/decorative candidate not picked.
- **coin-being (generic), gold-coin-being** — coin variant candidates not picked this batch; user picked split-coin framing → ancient-coin-being kept now; generic / gold-coin entries deferred to a future session.
- *(pearl-strand-being, choker-being, stud-earring-being, nose-ring-being, lip-ring-being, friendship-bracelet-being, cuff-bracelet-being, circlet-being, cufflink-being, body-chain-being all DROPPED entirely 2026-05-15 per user resolution.)*

### From Manmade cluster (CONTAINER deferrals)
- **vase-being** — pottery candidate not picked (user's "distinct" framing means future entries would split separately; jar-being kept this batch). *(pot-being DROPPED 2026-05-15 per user resolution.)*
- **wine-bottle-being** — bottle/flask candidate not picked.
- **jewelry-box-being** — box/chest candidate not picked (treasure-chest + coffin kept).
- **cauldron-being** → flagged for MYTHICAL CREATURES (witch-cauldron iconography). **LANDED in MYTHICAL Other (cross-cultural) 2026-05-15** per cross-cluster pending-review resolution.
- *(ink-pot / inkwell-being DROPPED 2026-05-15 per earlier resolution. teacup / mug / tankard / bottle / flask / canteen / thermos / box / crate / basket / sack / backpack / handbag / purse / barrel / bucket / shipping-container / envelope-being all DROPPED entirely 2026-05-15 per user resolution. gourd / hollow-fruit + piggy-bank previously DROPPED. paint-can previously LANDED in CONTAINER.)*

### From Manmade cluster (TOOL deferrals)
*All entries below are candidates only — no commitment they'll ever be picked. User clarified mid-session that deferrals/carryovers do not imply eventual addition.*
- **shield-being** — weapon candidate not picked (defensive-vs-offensive framing; firearm + mace DROPPED earlier).
- **magnifying-glass-being** — *landed in OPTICAL IMAGING (formerly CAMERA) per lens-mechanism reframing 2026-05-13.*
- *(MAJOR DROP 2026-05-15 per user resolution: screwdriver-being, wrench-being, pliers-being, chisel-being, shovel/spade-being (hand-tools), shears-being (cutting), mace-being (weapon — firearm earlier DROPPED), pen-being (ballpoint/fountain-pen), pencil-being, paintbrush-being, printer-ink-cartridge-being (writing implements), ruler-being, compass-being / drawing-compass (measuring), fishing-rod-being, net-being, slingshot-being (fishing/hunting) — all DROPPED entirely.)* *(hourglass earlier dropped per N27 — landed in UNIQUE. telescope dropped per N48.)*
- **whistle-being** → user redirected to TOY as a TOY-side candidate. **DROPPED entirely 2026-05-15** per cross-cluster pending-review resolution (TOY cluster closed without retro-add; no home).
- **magic-wand-being** — flagged for MYTHICAL CREATURES (mystical-implement domain). **LANDED in MYTHICAL Other (cross-cultural) 2026-05-15** per cross-cluster pending-review resolution. **wizard-staff-being DROPPED entirely 2026-05-15** per same resolution (magic-wand-being covers mystical-implement domain sufficiently; staff-form not needed as separate entry).
- **microscope-being, telescope-being** — flagged as APPLIANCE candidates (lens-mechanism artifacts); not picked here.

### From Manmade cluster (APPLIANCE deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **blender-being, rice-cooker-being** — kitchen-appliance candidates not picked.
- **television / TV-being** — entertainment-electronics candidate not picked.
- **microscope-being** — scientific-instrument candidate; reframed as OPTICAL IMAGING (formerly CAMERA) candidate per lens-mechanism domain-claim (2026-05-13). *(telescope-being DROPPED per N48 2026-05-15.)*
- **thermometer-being** — *LANDED in TOOL retroactively* via 2026-05-13 commit per CAMERA cross-section redirect (new Measurement/precision sub-group).
- **chainsaw-being** — power-tool candidate not picked.
- *(MAJOR DROP 2026-05-15 per user resolution: toaster-being, dishwasher-being, kettle/electric-kettle-being (kitchen), washing-machine-being, dryer-being, clothes-iron-being (laundry/cleaning), space-heater-being, electric-fan-being (HVAC), radio-being, record-player / phonograph-being, speaker / boombox-being (entertainment), printer-being, typewriter-being (office), furnace-being, elevator-being (industrial), electric-shaver-being (personal-care) — all DROPPED entirely.)* *(gaming-console-being earlier DROPPED per cross-cluster review. arcade-cabinet + roulette-wheel earlier DROPPED with GAME-PIECE block.)*

### From Manmade cluster (STATUE deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **buddha-statue-being** — religious-sculpture candidate not picked.
- **gargoyle-statue-being** — candidate not picked; frozen-stone-gargoyle = STATUE, animate-gargoyle = MYTHICAL.
- **atlas-being** → LANDED in MYTHICAL Greek/Roman 2026-05-15 as `atlas`.
- **abstract-sculpture-being** — DROPPED entirely (non-figurative; doesn't fit STATUE definition per user call).
- *(MAJOR DROP 2026-05-15 per user resolution: venus-de-milo-being, discobolus-being, bust / portrait-bust-being (classical/Renaissance), moai / easter-island-being, sphinx-statue-being (iconic-monument), crucifix-being, madonna-statue-being, jizo-statue-being (religious — buddha-statue kept), gravestone / tombstone-being, weeping-angel-being, memorial-obelisk-being (tomb/memorial), garden-gnome-being, lawn-flamingo-being (garden), caryatid-being (column-figure), wax-figure-being, mannequin-being, nutcracker-being, totem-pole-being, bobble-head-being, bronze-horseman-being (specialty/figurative) — all DROPPED entirely.)*

### From Manmade cluster (ROBOTIC deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **automaton-being** — clockwork-Victorian / da-Vinci-mechanical period-flavor humanoid candidate; not picked (android + mech + cyborg covered the humanoid sub-cluster).
- **mech-suit-pilot-pair-being** — paired SYMBIOSIS-style entry candidate; not picked (SYMBIOSIS cluster already covers paired-being framing; mech-being covers the silhouette here).
- **sentient-AI-core-being** — LANDED as entry; ROBOTIC-domain confirmed per user call.
- **cyborg-being** — LANDED as entry; ROBOTIC-domain confirmed per user call.
- **self-driving-car-being** — stays VEHICLE-side (car-being covers silhouette).
- *(MAJOR DROP 2026-05-15 per user resolution: humanoid-robot-being, toy-robot-being, assistant-bot/butler-robot-being, factory-arm/industrial-robot-arm-being, drone-being, rover-being, surveillance-bot-being (originally deferred to CAMERA cross-section), nanobot-swarm-being, robotic-arm-prosthetic-being — all DROPPED entirely.)* *(automaton earlier DROPPED per N49 — already in MYTHICAL Golems.)*

### From Manmade cluster (OPTICAL IMAGING — formerly CAMERA + HOLOGRAM — deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **microscope-being** — base + eyepiece + objective optical-instrument candidate; OPTICAL IMAGING-domain confirmed per lens-mechanism reframing, but not picked.
- **thermometer-being** — *LANDED in TOOL retroactively* via 2026-05-13 commit per CAMERA cross-section redirect (new Measurement/precision sub-group).
- **smartphone-camera-being** — implicit duplicate of APPLIANCE's smartphone-being; no separate entry.
- *(rainbow-hologram-being, ghost-projection / phantom-image-being, sky-projection / cloud-projection-being all LANDED in OPTICAL IMAGING Sci-fi/technological projections sub-group 2026-05-15 per user resolution.)*
- *(MAJOR CAMERA-SIDE DROP 2026-05-15 per user resolution: polaroid / instant-camera-being, disposable-camera-being, bellows / large-format-camera-being, point-and-shoot / compact-camera-being (photographic), broadcast / TV-news-camera-being (cinematic), CCTV / surveillance-camera-being, trail-cam / wildlife-camera-being (surveillance), surveillance-bot-being, periscope-being, daguerreotype / antique-camera-being, pinhole-camera-being (vintage/specialty), photo-booth-being, spy-cam / hidden-camera-being, camera-obscura-being, kaleidoscope-being, light-meter-being, projector-being — all DROPPED entirely.)*
- *(MAJOR HOLOGRAM-SIDE DROP 2026-05-15 per user resolution: generic hologram-being, holographic-display-being, holographic-avatar / messenger-being, laser-projection-being, light-painting-being, stage-hologram-being, pepper's-ghost-being, zoetrope-being, light-show / laser-show-being, projected-map / planetarium-being, neon-sign, marquee-light, lighthouse-beam, search-light, christmas-light-projection — all DROPPED entirely.)* *(afterimage earlier DROPPED. telescope DROPPED per N48.)*

### From Manmade cluster (INSTRUMENTS deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **saxophone-being, clarinet-being** — wind candidates not picked.
- **sitar-being** — folk/world candidate not picked.
- **electric-guitar-being** — implicitly covered by generic guitar-being under 1+1 cap per user call.
- **music-box-being** — already in TOY's `**Mechanical / Wind-up**` sub-group.
- **tuning-fork-being** — already in TOOL's `**Sound / signaling**` sub-group.
- *(MAJOR DROP 2026-05-15 per user resolution: snare-drum, bass-drum, timpani/kettle-drum, djembe/hand-drum, tambourine (percussion), marimba, pipe-organ/organ, accordion, cello, lute/lyre/mandolin (string), tuba, french-horn (wind — saxophone + clarinet kept), bell, gong, church-bell, temple-gong, cymbal, triangle, synthesizer/keyboard, drum-machine, theremin, turntable/DJ-deck (electronic), didgeridoo, bagpipe, erhu, ocarina, harmonica, kazoo (folk/world — sitar kept), bongo, congas, ukulele, banjo, oboe, bassoon, double-bass, sousaphone (adjacent) — all DROPPED entirely.)* *(whistle earlier DROPPED.)*

### From Phenomena cluster (SHADOW-CAST deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **fear-shadow / dread-shadow-being, dusk-shadow / nightfall-shadow-being** — earlier DROPPED entirely (out-of-scope).
- *(MAJOR DROP 2026-05-15 per user resolution: cast-shadow / your-shadow-being, tree-shadow, building-shadow, shadow-on-wall, silhouette-against-light, shadow-puppet, shadow-play / shadow-theater, magic-lantern-projection, crepuscular-ray, anticrepuscular-ray, earth-shadow-being, dappled-light, mottled-shadow, sundial-gnomon-shadow, opaque-glass-blur — all DROPPED entirely.)* *(eclipse-shadow / solar-eclipse / lunar-eclipse / penumbra / umbra earlier DROPPED per N1+N16.)*

### From Phenomena cluster (BUBBLE deferrals)
*All entries below are candidates only — no commitment they'll ever be picked.*
- **geodesic-dome / protective-dome-bubble-being** — ARCHITECTURE-side candidate per user call.
- **hot-air-balloon-being, blimp-being, dirigible-being** — VEHICLE-side candidates per user call.
- **crystal-ball / orb-being** — CRYSTALLINE/GEM-side candidate per user call.
- **cell / vesicle / blood-cell-being** — MICROORGANISMS-side candidates per user call.
- **pearl-being** — JEWELRY-side candidate per user call.
- *(MAJOR DROP 2026-05-15 per user resolution: bubble-bath / suds-being, bubble-wrap-being, single-bubble-in-water-being, foam-being (generic), sea-foam-being, champagne-bubble / fizz-being, plastic-bubble / quarantine-bubble-being, glass-blowing-bubble-being, ball-pit-ball-being, spit-bubble, fish-bubble-breath, bubble-tea-pearl, mucus-bubble / nasal-bubble, oxygen-bubble-from-plant, frog's-throat-bubble — all DROPPED entirely.)*

### From Phenomena cluster (SMOKE deferrals)
*All entries below are candidates only — no commitment they'll ever be picked. Several items explicitly DROPPED or ROUTED per user calls this batch.*

**Dropped entirely per user call (no remaining home):**
- **fumarole / steam-only vent-being** — Habitat-deferral DROPPED entirely (overrides earlier "flagged SMOKE-adjacent, deferred" routing in Habitat-deferrals block).
- **genie-smoke-emerging-from-lamp-being** — SMOKE-side variant DROPPED (MYTHICAL djinn covers the canonical form as-is).
- **dragon-breath-being** — SMOKE-side variant DROPPED (MYTHICAL dragon entries cover the canonical form as-is).
- **wizard-smoke / spell-vapor-being** — DROPPED entirely (not pulled into SMOKE or MYTHICAL).

**Routed to other categories per user call:**
- **volcanic-smoke / pyroclastic-cloud-being, ash-cloud-being** — **NATURAL-DISASTER-side per user call** (volcanic-eruption-event covers; vapor-byproduct stays with the disaster event, not SMOKE-domain).
- **dust-cloud-being** — **NATURAL-DISASTER-side per user call** (sandstorm-adjacent; particulate-not-vapor, NATURAL-DISASTER's sandstorm/dust-storm covers).
- **mist-being, fog-being** — **WEATHER-side per user call** (defer to upcoming WEATHER/ATMOSPHERIC batch as natural-atmospheric water-vapor phenomena).
- **incense-smoke-being** — **PERFUME-side per user call** (scent-carrying vapor convention: fragrance-carrying = PERFUME).
- **train-locomotive-smoke-being** — **implicit in VEHICLE train-being silhouette per user call** (no standalone SMOKE entry; VEHICLE train-being's "smokestack-head" descriptor covers).
- **coffee-maker-steam-being, humidifier-steam-mist-being** — already vapor-as-feature in APPLIANCE entries (coffee-maker steam-vent + humidifier steam-mist exhalation), not standalone vapor-beings.

**Standard candidates DROPPED 2026-05-15 per user resolution:**
- *(campfire-smoke, cigarette/cigar/pipe-smoke, chimney-smoke, industrial-smokestack/factory-smoke (combustion), tea-kettle-steam, sauna-steam (steam-context), car-exhaust/tailpipe-smoke, rocket-exhaust/contrail, ship-funnel-smoke (vehicular/exhaust), smoke-signal, flare-smoke/emergency-signal, fog-machine-smoke (signaling/theatrical), smoke-ring, grilling-smoke/barbecue-smoke, gunpowder-smoke/battlefield-smoke, propaganda-balloon-smoke (adjacent) — all DROPPED entirely.)*

### From Phenomena cluster (PERFUME deferrals)
*All entries below are candidates only — no commitment they'll ever be picked. Several items explicitly DROPPED per user calls this batch.*

**Dropped entirely per user call (no remaining home):**
- **stench / stink-being, body-odor / sweat-aroma-being, rot / decay-aroma-being** — unpleasant-scent counter-aspect candidates DROPPED entirely per user call (PERFUME covers pleasant-scent domain only this session).
- **pollen-cloud / spring-meadow-aroma-being** — diffuse-aroma candidate DROPPED entirely per user call (not pulled into PERFUME, not retro-added to PLANTS).
- **skunk-spray-being** — animal-defense scent vapor DROPPED entirely per user call (skunk-being already exists in MAMMALS/Mustelids at line 234; no separate PERFUME-side spray-vapor entry).

**Candidates not picked (PERFUME-domain confirmed, logged for possible future densification):**
- **flower-scent / floral-aroma-being (generic)** — PERFUME-domain confirmed.
- **petrichor / after-rain-aroma-being** — PERFUME-domain confirmed (scent-emission framing wins over atmospheric-phenomenon framing).
- **air-freshener / aerosol-spray-being** — PERFUME-domain confirmed (scent-vapor-product framing wins over APPLIANCE device-as-being framing).
- *(MAJOR DROP 2026-05-15 per user resolution: essential-oil-aroma, sage-bundle/smudge-smoke, resin-incense/frankincense-myrrh, joss-stick (incense), jasmine-scent (specific floral), baking-aroma/bread-cookie-aroma, coffee-aroma, citrus-zest/lemon-aroma (food/kitchen), campfire-aroma/wood-smoke-aroma, scented-candle-aroma, potpourri, car-air-freshener-pine-tree, hospital-disinfectant-smell, new-car-smell, library-old-book-smell, ginger-aroma (adjacent) — all DROPPED entirely.)*

### From Phenomena cluster (HOLOGRAM deferrals) — now merged into OPTICAL IMAGING per 2026-05-15 consolidation
- **mirage-being** — LANDED in WEATHER as reserved confirmed-pick.
- **afterimage-being** — DROPPED entirely per user call.
- *(rainbow-hologram-being, ghost-projection / phantom-image-being, sky-projection / cloud-projection-being all LANDED in OPTICAL IMAGING Sci-fi/technological projections sub-group 2026-05-15.)*
- *(MAJOR DROP 2026-05-15 per user resolution: generic hologram-being, holographic-display-being, holographic-avatar / messenger-being, laser-projection-being, light-painting-being, stage-hologram-being, pepper's-ghost-being, zoetrope-being, light-show / laser-show-being, projected-map / planetarium-being, neon-sign, marquee-light, lighthouse-beam, search-light, christmas-light-projection — all DROPPED entirely.)*

### From Phenomena cluster (EXPLOSIVE deferrals)
*All entries below are candidates only — no commitment they'll ever be picked. Several items explicitly DROPPED or ROUTED per user calls.*

**Dropped entirely per user call (no remaining home):**
- **atomic-bomb / nuclear-blast-being** — DROPPED entirely (uniquely heavy / dark; parallels VEHICLE hearse-drop + TOOL firearm-drop pattern).
- **landmine-being** — DROPPED entirely (joins atomic-bomb in too-dark-to-include territory).

**Routed to other categories per user call:**
- **big-bang-being** — cosmological origin event; **COSMOLOGICAL/ENERGY-side per user call** (cosmic-origin-event framing wins over EXPLOSIVE physical-blast framing; COSMOLOGICAL is already DONE — would need retro-add if ever pursued).
- **balloon-pop-being** — bubble-burst pop; **BUBBLE-side feature per user call** (already covered in BUBBLE silhouettes for balloon-being and related entries; not a standalone EXPLOSIVE entry).
- **supernova-explosion** — skipped per user call (already exists in NATURAL-DISASTER as supernova; no duplicate).

**Convention established this batch:**
- **EXPLOSIVE accepts weapons-scale entries per user picks** (grenade + bomb + missile-warhead landed). Convention divergence from TOOL: weapons-as-handheld-implement = TOOL drop precedent stands (firearm dropped); weapons-as-blast-event = EXPLOSIVE-domain landed. This sets precedent for any future weapons-scale deliberations.

**Candidates DROPPED 2026-05-15 per user resolution:**
- *(sparkler, roman-candle, firecracker (pyrotechnic), confetti-bomb/party-popper (celebratory), mining-blast/quarry-charge (demolition), gas-explosion/propane-blast, boiler-explosion, dust-explosion/grain-silo (combustion/fuel-air), popcorn-pop/pop-snap (benign), sonic-boom (shockwave), M-80 (adjacent) — all DROPPED entirely.)*

### From Phenomena cluster (WEATHER/ATMOSPHERIC deferrals)
*All entries below are candidates only — no commitment they'll ever be picked. Several items explicitly DROPPED per user calls. **This is the final batch of the Phase 1 category roadmap.***

**Reserved confirmed-picks resolved (all landed in this batch):**
- **mirage-being** — landed (per HOLOGRAM cross-section reservation).
- **snowdrift-being, icicle-formation-being, polar-night-being** — landed (per Habitat/GLACIER deferrals; snowdrift was originally a GLACIER entry, dropped from GLACIER in earlier session, re-routed and landed here).
- **mist-being, fog-being** — landed (per SMOKE batch user call).

**Dropped entirely per user call (no remaining home):**
- **mushroom-cloud-being** — DROPPED entirely (per atomic-bomb DROP from EXPLOSIVE; follows nuclear-imagery pattern).
- **weather-vane-being** — DROPPED entirely (device-not-phenomenon framing; weather-vane is a TOOL/instrument, not an atmospheric phenomenon).

**Routed to other categories per user call:**
- **smog-being** — already landed in SMOKE batch as industrial-pollution-haze; **smog WEATHER-side duplicate skipped per user call**.
- **crepuscular-ray / godray-being** — stays SHADOW-CAST candidate per SHADOW-CAST batch deferral; **N/A for WEATHER cross-section per user call** (no WEATHER-domain claim).

**Candidates not picked (WEATHER-domain confirmed, logged for possible future densification):**
- **cirrus-cloud-being, stratus-cloud-being, lenticular-cloud-being** — cloud-form candidates not picked (generic cloud + storm-cloud kept as representatives).
- **freezing-rain-being, drizzle-being** — precipitation candidates not picked (rain + snow + hail kept). *("sleet" half of former `sleet / freezing-rain-being` name DROPPED 2026-05-15 per user resolution — freezing-rain kept as the entry name; sleet not retained as alias.)*
- **wind-gust-being, whirlwind / dust-devil-being, zephyr-being, chinook / foehn-wind-being** — wind candidates not picked (breeze kept as representative). **Whirlwind / dust-devil judged WEATHER-domain per user call** (vs. NATURAL-DISASTER tornado-event) but not picked.
- **sunrise / sunset-being** — colored-sky transition candidate not picked (rainbow + aurora kept as light-phenomena representatives).
- **frost-being, rime / hoarfrost-being** — winter surface-ice candidates not picked.
- **heat-haze / heat-shimmer-being, humidity-haze-being, sun-glare-being** — heat/dry candidates not picked (mirage kept as reserved-pick).
- **dew-being** — morning surface-moisture candidate not picked.
- **dawn-being, dusk / twilight-being, golden-hour-being, stormfront-being** — specialty/liminal candidates not picked.
- Other adjacent unproposed candidates: thunderclap-sound, ball-lightning, fata-morgana, sundog-parhelion (logged for future densification awareness).

### From URBAN drop fallout
URBAN was dropped entirely in this session. Its 3 entries migrated to ARCHITECTURE: skyscraper-being, ruin/abandoned-building-being, intersection/crossroads-being. **Other URBAN candidates** proposed but never landed: alleyway, highway-overpass, subway-tunnel, subway-station, apartment-block, rooftop, sidewalk-pavement, manhole-cover, streetlamp, neon-sign, traffic-jam, graffiti (latter went to INK), light-pollution-glow.

### Cross-cluster floating concepts
- **sunken-island / Atlantis-style ruin-landmass** — flagged for MYTHICAL or UNIQUE. **DROPPED entirely 2026-05-15** per cross-cluster pending-review resolution (no specific home pursued; concept dropped).
- **rainbow-pool / prismatic-spring** — proposed under HOT-SPRING (J) but not picked.
- **kelp-forest as habitat-being** — kelp-individual stays in PLANTS; the habitat-form would need a slot if wanted.

---

## Cluster completion log

| Cluster | Status | Notes |
|---|---|---|
| Bio (PLANTS, FUNGI, PREHISTORIC, MICROORGANISMS, EGG, SHELL, SYMBIOSIS) | DONE 5/5 | PLANTS + FUNGI predate the 35-batch roadmap (bonus categories). |
| Habitat | DONE 3/3 (post-consolidation) | RIVER + URBAN dropped (entries → ARCHITECTURE). 2026-05-15: GLACIER + HOT-SPRING merged into **THERMAL EXTREMES** (5 entries combined). Remaining Habitat categories: CAVE/UNDERGROUND, THERMAL EXTREMES, ISLAND. |
| Materials | DONE 4/4 | All 4 batches landed clean. |
| Manmade | DONE 12/13 (post-consolidation) | Original 13: ARCHITECTURE + VEHICLE + TOY + GAME-PIECE + JEWELRY + CONTAINER + TOOL + APPLIANCE + STATUE + TROPHY + ROBOTIC + CAMERA + INSTRUMENTS. 2026-05-15 consolidations: TROPHY absorbed into JEWELRY (Awards/honors sub-group); CAMERA merged into OPTICAL IMAGING (which now spans former CAMERA + HOLOGRAM). Effective Manmade categories: ARCHITECTURE + VEHICLE + TOY + GAME-PIECE + JEWELRY (now with Awards) + CONTAINER + TOOL + APPLIANCE + STATUE + ROBOTIC + OPTICAL IMAGING + INSTRUMENTS = 12. **BANNER permanently dropped 2026-05-12.** |
| Phenomena | DONE 7/7 | SHADOW-CAST + BUBBLE + SMOKE + PERFUME + HOLOGRAM + EXPLOSIVE + WEATHER/ATMOSPHERIC all landed 2026-05-13. WEATHER landed 6 reserved confirmed-picks (mirage from HOLOGRAM; snowdrift + icicle-formation + polar-night from GLACIER/Habitat deferrals; mist + fog from SMOKE) plus 8 fresh picks. **Phase 1 category roadmap COMPLETE 35/35.** Final deferral-review pass pending. |
| Phase 1 extension (post-roadmap-closure) | IN PROGRESS 14/? (post-consolidation) | Brainstorm batches 1+2+3 picks landed 2026-05-15. **50-category milestone reached at MISSING SENSES (50th committed); reduced to 49 after consolidations.** CAREERS/PROFESSIONS densified with 16 retro-adds + restructured to 3 sub-groups. ANATOMY densified with 3 retro-adds (lung + new Cellular/molecular sub-group). COSMOLOGICAL/ENERGY retro-adds (comet + asteroid) descriptor-enhanced rather than added (duplicates). **2026-05-15 consolidation pass (all 5 combines applied):** MATHEMATICS + WRITING/SYMBOLS/LANGUAGE → **SYMBOLS & GLYPHS** (4 entries). CANDY/SWEETS + DRINKS/BEVERAGES → **FOOD & DRINK** (5 entries). GLACIER + HOT-SPRING → **THERMAL EXTREMES** (5 entries, Habitat 4 → 3). CAMERA + HOLOGRAM → **OPTICAL IMAGING** (9 entries, 5 sub-groups — inverse-processes unified). TROPHY absorbed into JEWELRY as **Awards / honors** sub-group (medal + laurel-wreath; Manmade 13 → 12). **Total category count: 50 → 45.**

**2026-05-15 dedup pass (12 cases A1-A12 applied — case-by-case):**
- A1: Dropped `aurora-being` from COSMOLOGICAL (duplicate of WEATHER's `aurora-borealis-being`).
- A2: Dropped `nebula-galaxy-cosmic-being` from VOID (duplicate of COSMOLOGICAL's `nebula-being`).
- A3: Dropped `starlight-cosmic-being` from VOID (duplicate of COSMOLOGICAL's `stellar-being / star-spirit`).
- A4: Dropped `shapeshifter / mimic / form-shifter` from VOID (duplicate of MYTHICAL's `shapeshifter`).
- A5: Added cross-section note to VOID `dream-being / nightmare-being` distinguishing MAMMALS mythical-equid nightmare (horse-form) + MYTHICAL Wisps dream-wisp (spirit-form). VOID `prismatic / rainbow` also got disambiguation note vs. WEATHER rainbow-being.
- A6: Restructured UNIQUE `weapon-creature` — dropped 6 subs duplicating TOOL (sword-blade, bow-arrow, lance-spear, hammer-mace, axe, dagger); kept 4 unique (scythe, shield, gauntlet, whip).
- A7: Dropped `instrument-creature` from UNIQUE (duplicate of INSTRUMENTS cluster).
- A8: Renamed UNIQUE `painted-canvas / mural-being` → `painted-canvas-being` (removes name-collision with INK/PIGMENT mural-being).
- A9: Renamed UNIQUE `chimeric-composite` → `patchwork-composite` (disambiguates from MYTHICAL `chimera` Greek-myth).
- A10: Dropped `card-dice-fate-game-creature` from UNIQUE (duplicate of GAME-PIECE coverage).
- A11: Reframed UNIQUE `divine-messenger` from "angelic-flavored" to "courier / emissary-figure" (disambiguates from MYTHICAL angel; preserves humanoid-framing-precedent role). **Option A follow-up applied 2026-05-15:** added new `prophet-being / oracle-prophet` entry to MYTHICAL CREATURES Other (cross-cultural) sub-section — captures the divine-flavor that was removed from divine-messenger reframe.
- A12: Added cross-section note to CAVE intro distinguishing CAVE `cave-echo` (cave-specific resonance) from VOID `echo-being` (abstract free-floating echo).

**Entry totals after consolidation + dedup:** 50 → 45 categories; 1,138 → 1,127 entries file-wide (1,150 with dragons). |

---

## Session log

- **2026-05-11 session** — PR #41 (merged). 22 commits: 7 new categories (CAVE/UNDERGROUND, GLACIER, HOT-SPRING, ISLAND, CLAY/CERAMIC, THREAD/CLOTH, INK/PIGMENT, METAL-OBJECT, ARCHITECTURE, VEHICLE — net 10 added incl. URBAN-then-dropped) plus framing/cleanup commits. RIVER and URBAN clusters dropped. Duraludon precedent established. Multi-silhouette format introduced.
- **2026-05-12 session** — TOY landed as 18th committed category (12 entries across 6 sub-groups: plush/dolls, action figures, vehicles-as-toys, construction toys, mechanical/wind-up, classic/misc). INSTRUMENTS placeholder added at end of Manmade as tentative 14th slot, then confirmed-as-batch later same session (entries deferred to future session). GAME-PIECE landed as 19th committed category (13 entries across 5 sub-groups: chess sub-cluster, cards/suits, dice, tokens, specialty). Tarot Major Arcana picks moved to MYTHICAL CREATURES → new Arcana / divination / fortune-telling sub-section (separate commit, 5 entries). JEWELRY landed as 20th committed category (8 entries across 5 sub-groups: neckwear pendant+amulet, finger/hand ring+wedding-band, generic earring, crown+tiara, ancient-coin). Resolves METAL-OBJECT's coin-deferral + TOY's charm-toy-deferral (charm-bracelet logged as candidate). CONTAINER landed as 21st committed category (9 entries across 5 sub-groups: pottery jar+urn+amphora, drinkware goblet/chalice+wine-glass, boxes treasure-chest+coffin, bags suitcase, utility paint-can). Resolves INK/PIGMENT's paint-can-deferral (ink-pot logged as candidate). Coffin retained despite VEHICLE hearse-drop precedent. Cauldron flagged for MYTHICAL as future-session candidate. TOOL landed as 22nd committed category (14 entries across 7 sub-groups: hand-tools hammer+saw+pickaxe+axe, cutting knife+scissors, weapons sword+spear+bow-and-arrow+dagger, writing quill, keys/locks key-padlock-paired-pair, fishing harpoon, sound tuning-fork). Resolves METAL-OBJECT's weapons+keys deferral and INSTRUMENTS placeholder's tuning-fork note. Whistle redirected to TOY as TOY-side candidate (not added this session). Mid-session framing clarification: "logged as candidate" / "flagged for X" means tracked for possible future pick — **no commitment** an entry will ever land. APPLIANCE landed as 23rd committed category (18 entries across 8 sub-groups: kitchen fridge+oven/stove/cooktop-combined+microwave+coffee-maker, laundry vacuum-cleaner, HVAC air-conditioner+humidifier, computing desktop+laptop+smartphone+tablet, gaming slot-machine+pinball, office copier, industrial kiln+generator, personal-care+power-tools hairdryer+electric-drill). Resolves CLAY/CERAMIC's kiln-deferral, partial of GAME-PIECE's arcade-deferral (slot+pinball landed; arcade-cabinet+roulette logged as candidates), and TOOL's electric-drill-borderline distinction. Modern computing kept per user "Keep" call. Gaming-console redirected to TOY-side candidate (matches whistle pattern). STATUE landed as 24th committed category (5 entries across 3 sub-groups: classical david+equestrian, iconic statue-of-liberty+terracotta-warrior, garden cherub). Tight batch. Resolves CLAY/CERAMIC's figurines/warriors-deferral (terracotta-warrior landed; metal-statues from METAL-OBJECT covered conceptually by generic statues like david). Atlas redirected to MYTHICAL-side candidate. Abstract-sculpture dropped (non-figurative; outside STATUE definition). Convention bake-ins: gargoyle/weeping-angel/sphinx/moai confirmed STATUE-domain if added later. **BANNER permanently dropped from roadmap** per user call (parallels RIVER + URBAN drops). Manmade total slots: 14 → 13. Dangling references: THREAD/CLOTH's flag-form mention (line 975) and JEWELRY's heraldic-sash mention left as historical-references per user Option A choice. TROPHY landed as 25th committed category (2 entries, single Awards sub-group: medal + laurel-wreath). Tight wrap-batch. Laurel-wreath flagged JEWELRY-headwear-adjacent but kept here as Olympic-award convention. 10 candidates logged (trophy-cup, blue-ribbon, plaque, olympic-medal-distinct, statuette-trophy, championship-belt, certificate/diploma, ribbon-rosette, prize-pennant, key-to-the-city). Counters now: **25 committed / 11 remaining**. Session wrapped after TROPHY.
- **2026-05-13 session** — ROBOTIC landed as 26th committed category (8 entries across 3 sub-groups: humanoid/android android+mech/mecha+cyborg, companion/domestic robot-vacuum+companion-bot, sci-fi/specialty battle-bot+sentient-AI-core+robo-spider). Resolves APPLIANCE's robot-vacuum borderline-deferral (lands here per autonomous-AI = ROBOTIC convention). Mech/mecha silhouette evokes Gundam-Wing piloted combat-frame per user flavor call; battle-bot kept distinct (smaller-than-mech autonomous-combat-drone scale). User domain calls baked in: cyborg-being judged ROBOTIC (not MYTHICAL/UNIQUE redirect); sentient-AI-core-being judged ROBOTIC (not VOID/COSMIC/ABSTRACT or UNIQUE redirect); nanobot-swarm ROBOTIC-domain confirmed though not picked; self-driving-car stays VEHICLE-side (car-being covers silhouette). Toy-robot proposed (carryover from TOY deferral "remains for ROBOTIC") but explicitly **not picked** this batch — logged as inherited candidate. Surveillance-bot deferred to CAMERA cross-section call (avoids pre-empting CAMERA batch). Other candidates logged but not picked: automaton, humanoid-robot, assistant-bot/butler-robot, factory-arm/industrial-arm, drone, rover, mech-suit-pilot-pair, robotic-arm-prosthetic. **Thermometer-being retro-added to TOOL** via separate commit later in session per CAMERA cross-section redirect — new `**Measurement / precision**` sub-group added to TOOL (opens room for future ruler / drawing-compass / hourglass candidates inherited from TOOL deferrals); APPLIANCE-deferrals block in this file split to reflect thermometer landed retro vs. microscope+telescope reframed as CAMERA-side candidates. **CAMERA landed as 27th committed category** (7 entries across 4 sub-groups: photographic camera+DSLR, cinematic movie-camera+camcorder, surveillance dashcam/bodycam, optical binoculars+magnifying-glass). Resolves TOOL's magnifying-glass-deferral via lens-mechanism reframing. User domain calls baked in: optical-instruments (telescope / microscope / magnifying-glass / binoculars / periscope) take CAMERA as canonical home per user call (lens-mechanism reframing — image-capture AND lens-based-observation both qualify); surveillance-bot CAMERA-domain confirmed (resolves ROBOTIC deferral); photo-booth CAMERA-domain confirmed; periscope CAMERA-domain confirmed (vs. VEHICLE submarine-component); thermometer NOT CAMERA-domain → TOOL retro-add per above. Smartphone-camera implicitly covered by APPLIANCE smartphone-being (no duplicate per user agree). APPLIANCE intro line 1234's "Microscope / telescope / thermometer flagged from TOOL as APPLIANCE candidates" reference left as historical-reference per user Option A convention (no retroactive rewrites of already-committed batch intros). Counters now: **27 committed / 9 remaining**. Manmade cluster 12/13. **INSTRUMENTS landed as 28th committed category** later in same session (9 entries across 5 sub-groups: percussion drum, keyboard/mallet piano+xylophone, string violin+harp+generic-guitar, wind trumpet+flute, folk shamisen/koto). Resolves TOY's musical-toy/xylophone/toy-drum deferrals via canonical adult-instrument forms (xylophone-being + drum-being). User domain calls baked into intro: synthesizer/drum-machine/theremin/DJ-turntable INSTRUMENTS-domain confirmed (vs. APPLIANCE) but none picked; church-bell/temple-gong/pipe-organ INSTRUMENTS-domain confirmed (vs. ARCHITECTURE bell-tower/cathedral-fixture) but none picked; electric-guitar implicitly covered by generic guitar-being under 1+1 cap (no split). Whistle stays TOY-side (not pulled). INSTRUMENTS placeholder qualifier `*(confirmed batch — entries pending future session)*` dropped from H2 heading per user call. **Closes Manmade cluster at 13/13 — Manmade cluster DONE.** Counters now: **28 committed / 7 remaining**. **SHADOW-CAST landed as 29th committed category** later in same session — opens Phenomena cluster (4 entries across 2 sub-groups: personal/detached silhouettes silhouette+doppelganger-shadow+shadow-twin, ambient/pooled shadow-pool-being). Per user clarification, shadow-pool-being framed as a *living puddle of pure shadow and darkness* (sentient dark-liquid form, ground-pooling or wall-creeping) rather than ambient-canopy-gathering — distinct from MYTHICAL slimes via shadow-not-fluid substance framing. 6 cross-section conventions baked into intro per user confirms: (1) absolute-dark-environment = CAVE pitch, cast-shadow-from-light-source = SHADOW-CAST; (2) spectral-undead-spirit = MYTHICAL wraith/shade, formless-shadow-flicker = MYTHICAL shadow-wisp, slimes-of-substance = MYTHICAL slimes, physical-cast-shadow = SHADOW-CAST; (3) elemental-substance = ELEMENTALS dark/shadow-elemental, phenomenon = SHADOW-CAST; (4) light-reflection = VOID mirror, formless-darkness = VOID void-being, abstract-light/dark = VOID duality, light-blockage = SHADOW-CAST; (5) projected-light-presence = HOLOGRAM, projected-light-absence (shadow-puppet/magic-lantern) = SHADOW-CAST; (6) fully-autonomous shape-mimic = MYTHICAL shapeshifter, anchored-to-visual-source shadow-mimic = SHADOW-CAST (doppelganger-shadow lands here). Eclipse-shadows + magic-lantern-projection SHADOW-CAST-domain confirmed but not picked. F-group conceptual candidates (fear-shadow, dusk-shadow) **dropped entirely** as out-of-scope. Shadow-puppet TOY-deferral carryover logged as SHADOW-CAST-domain inherited candidate (not picked). Counters now: **29 committed / 6 remaining**. Phenomena cluster IN PROGRESS 1/7. **BUBBLE landed as 30th committed category** later in same session (11 entries across 4 sub-groups: soap/film soap-bubble+dish-soap-foam, inflatables balloon+balloon-animal+bubble-gum+beach-ball+inflatable-pool-toy, liquid boiling-bubble, encapsulating force-field+snow-globe+terrarium-globe). Resolves TOY's balloon + balloon-animal deferrals. User domain calls baked into intro: snow-globe BUBBLE-domain ("snow-globe object looks like a bubble" — vs. CONTAINER vessel framing); force-field / energy-bubble BUBBLE-domain ("force-field over a town can look like a bubble" — vs. HOLOGRAM projection or COSMOLOGICAL energy-substance); geodesic-dome / protective-dome stays ARCHITECTURE-side (built-rigid-structure); hot-air-balloon / blimp / dirigible stays VEHICLE-side (passenger-carrying inflatable convention); crystal-ball / orb stays CRYSTALLINE-side (solid-not-hollow); cell / vesicle / blood-cell stays MICROORGANISMS-side (biological-membrane framing); pearl stays JEWELRY-side (wearable solid-sphere). Candidates logged but not picked: bubble-bath/suds, bubble-wrap, single-bubble-in-water, generic foam, sea-foam, champagne-bubble/fizz, plastic-bubble/quarantine-bubble, glass-blowing-bubble, ball-pit-ball. Counters now: **30 committed / 5 remaining**. Phenomena cluster IN PROGRESS 2/7. **SMOKE landed as 31st committed category** later in same session (5 entries across 4 sub-groups: combustion smoke+wildfire-smoke, steam-vapor steam, volcanic/geothermal sulfur-vent/brimstone-vapor, atmospheric/specialty smog). Tight batch with heavy domain-routing per user calls: fumarole DROPPED entirely (overrides Habitat's earlier "flagged SMOKE-adjacent, deferred" routing — retroactive note added to Habitat-deferrals block); G-group fantasy/mystical (genie-smoke, dragon-breath, wizard-smoke / spell-vapor) DROPPED entirely; volcanic-smoke + ash-cloud routed to NATURAL-DISASTER-side (volcanic-eruption-event covers byproduct); dust-cloud routed to NATURAL-DISASTER-side (sandstorm-adjacent particulate); mist + fog routed to WEATHER-side (defer to upcoming WEATHER batch); incense-smoke routed to PERFUME-side (scent-carrying vapor convention); train-locomotive-smoke implicit in VEHICLE train-being silhouette per user call. Counters now: **31 committed / 4 remaining**. Phenomena cluster IN PROGRESS 3/7. **PERFUME landed as 32nd committed category** later in same session (12 entries across 6 sub-groups: perfume/cologne/body-spray commercial fragrances, incense-smoke per SMOKE routing, natural floral/herbal rose+lavender+mint, food/kitchen spice-aroma, natural environmental sea-breeze+forest/pine, synthetic/industrial/domestic gasoline+fresh-laundry — last sub-group new this batch). Resolves SMOKE's incense-smoke routing. User domain calls baked into intro: flower-scent / floral-aroma + petrichor + campfire-aroma + air-freshener / aerosol-spray + scented-candle all judged PERFUME-domain (scent-emission framing wins over PLANTS-feature / WEATHER / SMOKE / APPLIANCE framings) but none picked — logged as candidates. DROPPED entirely per user call: stench / stink / body-odor / sweat-aroma / rot / decay-aroma (unpleasant-scent counter-aspect, PERFUME covers pleasant-scent only); pollen-cloud / spring-meadow-aroma; skunk-spray (skunk-being already at MAMMALS line 234, no PERFUME-side spray entry). 3 new user-additions to candidate list: gasoline-aroma, mint-aroma, fresh-laundry-aroma (all landed — gasoline + fresh-laundry seeded the new Synthetic/industrial/domestic sub-group). Counters now: **32 committed / 3 remaining**. Phenomena cluster IN PROGRESS 4/7. **HOLOGRAM landed as 33rd committed category** later in same session (2 entries in single sub-group: sci-fi/technological VR-projection + AR-overlay). Tight wrap-batch like TROPHY. User domain calls baked into intro: ghost-projection/phantom-image judged HOLOGRAM-domain (tech-projection-not-spirit; vs. MYTHICAL wraith); zoetrope judged HOLOGRAM-domain (proto-projected-animation; user overrode TOY lean); sky-projection/cloud-projection judged HOLOGRAM-domain (projected-light-on-cloud-surface; vs. WEATHER framing) — all confirmed but none picked. **Mirage routed to WEATHER-side as reserved confirmed-pick** for upcoming WEATHER batch (atmospheric-heat-shimmer framing wins; user clarified "move it to weather but add it as a chosen entry" — analogous to thermometer-for-TOOL flag pattern but no retro-add needed since WEATHER hasn't landed yet). Afterimage DROPPED entirely (too narrow / physiological). Counters now: **33 committed / 2 remaining**. Phenomena cluster IN PROGRESS 5/7. **EXPLOSIVE landed as 34th committed category** later in same session (7 entries across 4 sub-groups: pyrotechnic firework, industrial/demolition dynamite + C4, weapons-scale grenade + bomb + missile, sound shockwave/blast-wave). **Convention established: EXPLOSIVE accepts weapons-scale entries** (grenade + bomb + missile-warhead picked) — diverges from TOOL firearm-drop precedent. Convention: weapons-as-handheld-implement = TOOL-drop, weapons-as-blast-event = EXPLOSIVE-domain. DROPPED entirely per user call: atomic-bomb / nuclear-blast + landmine (uniquely heavy / dark; joins VEHICLE hearse + TOOL firearm in too-dark-to-include territory). Routed per user call: big-bang to COSMOLOGICAL-side; balloon-pop to BUBBLE-side feature; supernova skipped (already in NATURAL-DISASTER). Sonic-boom EXPLOSIVE-domain confirmed but not picked. Counters now: **34 committed / 1 remaining**. Phenomena cluster IN PROGRESS 6/7. **WEATHER/ATMOSPHERIC landed as 35th committed category** later in same session (14 entries across 7 sub-groups: cloud + storm-cloud, rain + snow + hail, breeze, rainbow + aurora-borealis, snowdrift + icicle-formation + polar-night, mirage, mist + fog). Closes Phenomena cluster at 7/7 and **closes Phase 1 category roadmap at 35/35** (33 firm + 2 bonus PLANTS/FUNGI). Resolved 6 reserved confirmed-picks: mirage from HOLOGRAM cross-section, snowdrift + icicle-formation + polar-night from GLACIER/Habitat deferrals (snowdrift originally a GLACIER entry, dropped from GLACIER in earlier session, re-routed and landed here), mist + fog from SMOKE batch routing. User domain calls baked into intro: hail WEATHER-domain (vs. NATURAL-DISASTER hailstorm event); whirlwind/dust-devil WEATHER-domain confirmed (not picked). DROPPED entirely per user call: mushroom-cloud (per atomic-bomb DROP precedent); weather-vane (device-not-phenomenon). Smog WEATHER-side duplicate skipped (already in SMOKE batch as industrial-pollution-haze). Crepuscular-ray N/A for WEATHER (stays SHADOW-CAST candidate). Counters now: **35 committed / 0 remaining**. **Phenomena cluster DONE 7/7. Phase 1 category roadmap COMPLETE 35/35.** Pending: cross-cluster deferral-review pass (separate batch, may span multiple sessions; PR/branch decision deferred to that session).

Session 2026-05-13 totals: **11 commits / 7 new categories + 1 retro-add (thermometer→TOOL).** New categories landed in order: ROBOTIC, CAMERA, INSTRUMENTS (closes Manmade), SHADOW-CAST (opens Phenomena), BUBBLE, SMOKE, PERFUME, HOLOGRAM, EXPLOSIVE, WEATHER/ATMOSPHERIC (closes Phenomena + roadmap). Conventions established this session: weapons-scale entries = EXPLOSIVE-domain (vs. TOOL drop precedent); lens-mechanism reframing places optical-instruments in CAMERA (telescope/microscope/binoculars/magnifying-glass/periscope); mech/Gundam-Wing flavor for ROBOTIC. Multiple permanent drops this session: fumarole, atomic-bomb, landmine, mushroom-cloud, weather-vane, plus ~12 minor concept drops in PERFUME (stench/stink/body-odor/decay/pollen/skunk-spray) and HOLOGRAM (afterimage). Manmade cluster DONE 13/13 (ROBOTIC + CAMERA + INSTRUMENTS closed it). Phenomena cluster DONE 7/7 (all 7 batches landed this single session). Phase 1 category roadmap **COMPLETE** 35/35.

- **2026-05-15 session — Phase 1 extension batches (post-roadmap-closure).** Brainstorm-batch-1 of 50 new creature concepts proposed; user picked 13 entries split across 3 new clusters + 2 retro-adds. **FURNITURE landed as 36th committed category** (5 entries in single Core-furniture sub-group: chair, table, bed, couch/sofa, bookshelf — last entry FURNITURE-domain per user pick rather than CONTAINER). **ANATOMY landed as 37th committed category** (3 entries in single Discrete-organs sub-group: brain, eyeball, tongue). **MATHEMATICS landed as 38th committed category** (2 entries in single Geometric/numerical-forms sub-group: cube, infinity-symbol). **Stapler + notebook/notepad retro-added to TOOL** via separate commit later in same session per brainstorm-batch-1 user picks — new `**Office / paper**` sub-group added to TOOL (opens room for future eraser / paper-clip / sticky-note / sharpener candidates from brainstorm-batch-1 not-picked items). Parallels thermometer-for-TOOL retro-add precedent from 2026-05-13. Does not bump category counter (TOOL already counted). **Scarf retro-added to THREAD/CLOTH** via separate commit later in same session per brainstorm-batch-1 user picks — new `**Wearable garments**` sub-group added (partially resolves THREAD/CLOTH's "full clothing/garments deferred" framing in original intro; opens room for future shoe/hat/tie/sock candidates). Does not bump category counter (THREAD/CLOTH already counted). New "Phase 1 extension" cluster-log row added to track post-roadmap-closure additions. New branch + new draft PR for this workstream (separate from PR #44 which is ready-for-review for the original roadmap closure). Session 2026-05-15 totals: **5 commits / 3 new categories (FURNITURE, ANATOMY, MATHEMATICS) + 2 retro-adds (stapler+notebook to TOOL; scarf to THREAD/CLOTH).** 13 new entries across all clusters/retro-adds.

---

## Pending: Cross-cluster deferral-review pass

After roadmap closure (WEATHER landed 2026-05-13), one more batch is planned: a final consolidated review of every `### From X cluster (Y deferrals)` block in this file + every "candidates logged but not picked" mention in category intros within `archetype-subtypes.md`. Per user call, the goal is to take a final look at each deferred / not-picked item and decide whether to:

- **Permanently drop** from session-notes deferral blocks + intro candidate lists (parallel to "DROPPED entirely" precedent established for items like fumarole, atomic-bomb, landmine, mushroom-cloud, weather-vane, abstract-sculpture, fear-shadow/dusk-shadow, stench/stink/decay-aroma, pollen-cloud, skunk-spray, afterimage).
- **Keep** as future-densification candidate (no action needed; current state preserved).
- **Promote** any remaining items to actual entries via retro-add (parallel to thermometer-for-TOOL pattern from this session).

This is a separate batch from the 35-category roadmap and does **not** add new categories. May span multiple sessions / multiple commits depending on volume — per user call, splitting into per-cluster sub-batches is acceptable to manage context. PR/branch decision deferred to that session.

Suggested sub-batch granularity (TBD at review-pass session start):
- **Batch A:** Habitat cluster deferrals (CAVE/UNDERGROUND, GLACIER, HOT-SPRING, ISLAND + URBAN drop fallout)
- **Batch B:** Materials cluster deferrals (CLAY/CERAMIC, THREAD/CLOTH, INK/PIGMENT, METAL-OBJECT)
- **Batch C:** Manmade cluster deferrals — early (ARCHITECTURE, VEHICLE, TOY, GAME-PIECE, JEWELRY)
- **Batch D:** Manmade cluster deferrals — mid (CONTAINER, TOOL, APPLIANCE, STATUE)
- **Batch E:** Manmade cluster deferrals — late (TROPHY, ROBOTIC, CAMERA, INSTRUMENTS)
- **Batch F:** Phenomena cluster deferrals (SHADOW-CAST, BUBBLE, SMOKE, PERFUME, HOLOGRAM, EXPLOSIVE, WEATHER/ATMOSPHERIC)
- **Batch G:** Cross-cluster floating concepts + any remaining bookkeeping
