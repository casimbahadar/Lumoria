/* =============================================================================
 * variant-content.js — Procedural variant CONTENT generator (TODO #12, approach C)
 *
 * The variant *mechanic* (rolled typing / permuted+drifted base / immunity) lives
 * in battle.js. This module turns a rolled variant into COHERENT, deterministic
 * flavour: description, lore, behaviour — and (later) a generated learnset.
 *
 * Determinism: content is a pure function of the variant's already-persisted
 * signature (variantTypes + variantBase + variantImmune). No new save fields.
 *
 * Quality model (C): a cross-conditioned clause library + per-species identity
 * "anchors". Sentence frames keep the variable parts in OBJECT position so the
 * authored clauses never collide with subject-verb agreement — that is what keeps
 * the composed prose reading naturally rather than like fill-in-the-blank.
 * ===========================================================================*/
(function (global) {
  'use strict';

  /* ---- deterministic PRNG (mulberry32) seeded from the variant signature ---- */
  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function variantSignature(v) {
    return (v.variantTypes || []).join('/') + '|' +
           JSON.stringify(v.variantBase || {}) + '|' + (v.variantImmune || '');
  }
  // Seed includes the SPECIES (def.id) as well as the roll, so two different
  // species with an identical roll diverge in structure/phrasing too — not just
  // in the plugged-in anchor details. (Same species + same roll stays identical,
  // which is intended: it IS the same variant. No per-instance save data.)
  function makeRng(v, def) {
    return mulberry32(hashStr((def ? def.id + ':' : '') + variantSignature(v)));
  }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

  /* ---- stat identity: describe the variant by its OWN resulting stat shape ---- */
  function statProfile(def, variantBase) {
    const b = variantBase || def.base;
    const bst = Object.values(b).reduce((s, x) => s + x, 0);
    const baseBst = Object.values(def.base).reduce((s, x) => s + x, 0);
    const entries = Object.entries(b);
    const top = entries.slice().sort((x, y) => y[1] - x[1])[0][0];
    const low = entries.slice().sort((x, y) => x[1] - y[1])[0][0];
    const phys = b.atk, spec = b.spa, bulk = b.hp + b.def + b.spd, speed = b.spe;
    let label;
    if (top === 'spe' && speed >= phys && speed >= spec) label = 'swift';
    else if (phys - spec >= 12) label = 'brute';
    else if (spec - phys >= 12) label = 'caster';
    else if (bulk / 3 >= Math.max(phys, spec) + 6) label = 'bulwark';
    else label = 'even';
    const delta = bst - baseBst;
    const heft = delta >= 18 ? 'heavier' : delta <= -18 ? 'frailer' : 'comparable';
    return { label, top, low, bst, delta, heft };
  }

  /* ---- per-type body manifestation (how the element reshapes a feature) ----
   * Phrased as verb-phrase complements: "<Rift-distortion has> X". */
  const TYPE_BODY = {
    Fire: [
      'baked it into smouldering plates veined with embers that brighten when it is provoked',
      'set a slow inner furnace beneath its surface, so heat-shimmer warps the air around it',
      'left its margins glowing like cooling slag, shedding sparks where it moves'
    ],
    Mineral: [
      'crusted it over with overlapping slabs of dark stone',
      'grown rough mineral facets across it that catch and scatter the light',
      'weighed it down under a carapace of raw, unpolished rock'
    ],
    Ice: [
      'locked it into brittle, glassy planes that trail rime wherever it lingers',
      'frosted it through until its outline stutters like breath on cold glass',
      'hollowed it into something closer to a drifting sheet of ice than a body'
    ],
    Toxin: [
      'made it weep a faint iridescent haze that smells of rot and crushed metal',
      'swollen it with sluggish, venom-dark fluid beneath the surface',
      'stained it in sickly, glistening colours that warn of its touch'
    ],
    Fairy: [
      'gilded it in a soft luminance that smells of crushed flowers',
      'lightened it until it seems half-made of drifting pollen and pale light',
      'wrapped it in a gentle, deceptive glow that belies what it has become'
    ],
    Dark: [
      'drunk the light from it until only a creature-shaped absence remains',
      'smeared its edges into a clot of moving shadow',
      'dimmed it to a silhouette that the eye keeps sliding off'
    ],
    Nature: [
      'threaded it with creeping vine and pale moss that knits over old contours',
      'sprouted stubborn growth across it, leaf and root reclaiming the shape',
      'softened it under a pelt of living green that stirs without wind'
    ],
    Aquatic: [
      'rendered it sleek and streaming, forever beaded with cold water',
      'made its surface ripple like a thing seen through a current',
      'left it slick and translucent, as though poured rather than grown'
    ],
    Electric: [
      'charged it until static crawls visibly across its surface',
      'wired it through with arcs that snap to anything that comes near',
      'left it humming, the air around it tasting of a coming storm'
    ],
    Spectral: [
      'thinned it toward transparency, more rumour of a body than a body',
      'unmoored it from solid form, so parts of it phase in and out of view',
      'hollowed it into a cold, hovering echo of what it was'
    ],
    Wind: [
      'pared it down to something lean that the air seems to move through',
      'set a constant restless current sliding over its surface',
      'lightened it until it drifts a hand’s breadth off the ground'
    ],
    Mental: [
      'left a perpetual pressure radiating from it that sets teeth on edge',
      'sharpened it to a quiet, watchful stillness',
      'hung a faint distortion around it, as if the air itself were thinking'
    ],
    Normal: [
      'bleached it to a plain, unsettling ordinariness',
      'pared away every exotic trait until only blunt, common flesh remains',
      'left it deceptively unremarkable, its danger easy to miss'
    ],
    Fighting: [
      'corded it with dense, overdeveloped muscle that strains against its old shape',
      'hardened its limbs into blunt instruments built for close work',
      'rebuilt it heavier and broader, weighted toward the strike'
    ],
    Poison: [
      'suffused it with seeping, blistering toxins that bead along its surface',
      'turned its fluids caustic, hissing faintly where they drip',
      'left it slick with a corrosive sheen that pits whatever it touches'
    ],
    Earth: [
      'packed it over with dense clods of soil and grit that shed as it moves',
      'rooted a heavy, earthen solidity through its frame',
      'caked it in dry, cracking earth that flakes away and reforms'
    ],
    Bug: [
      'plated it in chitinous segments that click as it shifts',
      'sprouted twitching antennae and a glassy carapace across it',
      'compounded its surface into the faceted armour of an insect'
    ],
    Rock: [
      'sheathed it in jagged, weather-worn stone',
      'fused crude boulders onto its frame that grind as they settle',
      'petrified its outer layer into rough, fractured rock'
    ],
    Draconic: [
      'scaled it over with overlapping draconic plates and a low, ancient menace',
      'lengthened it into something serpentine and imperious',
      'kindled an old, reptilian power beneath armoured scales'
    ],
    Metal: [
      'cased it in seamless, cold alloy that rings when struck',
      'replaced its surface with riveted plates of dull metal',
      'forged its edges into burnished, unyielding steel'
    ],
    Vapor: [
      'half-dissolved it into a curling body of hot mist',
      'blurred its boundaries into drifting steam that reforms slowly',
      'rendered it more vapour than flesh, condensing and thinning by turns'
    ],
    Dream: [
      'softened it into something hazy and oneiric, hard to hold in the eye',
      'wrapped it in a drowsy shimmer that sets the mind adrift',
      'unfixed it from waking logic, its shape shifting like a half-remembered dream'
    ],
    Sonic: [
      'set a constant resonance thrumming through it that blurs its edges',
      'tuned it to a piercing hum that rattles loose objects nearby',
      'rebuilt it around sound, its form shuddering with standing waves'
    ],
    Stellar: [
      'studded it with points of cold starlight beneath a darkened surface',
      'hollowed it into a vessel for distant, glittering constellations',
      'lit it from within by a slow, stellar radiance'
    ],
    Crystal: [
      'grew sharp, translucent crystal facets across it that refract the light',
      'lattice-locked its surface into gleaming prismatic planes',
      'replaced its hide with clear, faceted crystal that chimes softly'
    ],
    Primal: [
      'reverted it to something older and rawer, all instinct and heavy bone',
      'thickened it with ancient, untamed vitality',
      'stripped away the refined and left only primal, brute essence'
    ]
  };

  /* ---- per-type signature "tell" (an environmental trace) ---- */
  const TYPE_TELL = {
    Fire: 'It leaves scorch-marks on the ground it crosses.',
    Mineral: 'Its passage grinds shallow furrows into softer stone.',
    Ice: 'A creeping frost spreads from wherever it rests.',
    Toxin: 'Plants wilt in a slow ring around where it has stood.',
    Fairy: 'A scatter of fading motes hangs in the air behind it.',
    Dark: 'Light seems to dim a little in the space it occupies.',
    Nature: 'Tiny shoots push up through its tracks within hours.',
    Aquatic: 'It leaves everything it touches damp and cold.',
    Electric: 'It makes nearby hair stand and small devices stutter.',
    Spectral: 'Cold spots linger in the rooms it has drifted through.',
    Wind: 'Loose dust and leaves spiral in its wake.',
    Mental: 'Those near it report half-heard whispers afterward.',
    Normal: 'Nothing about its passing seems strange — which is the strangest thing of all.',
    Fighting: 'The ground shows the deep prints of something that hits hard.',
    Poison: 'A faint chemical reek lingers wherever it has been.',
    Earth: 'Loose soil and dust trail from it constantly.',
    Bug: 'A dry, chittering sound precedes it.',
    Rock: 'Chips of stone flake off in its wake.',
    Draconic: 'The air carries a heavy, primordial weight around it.',
    Metal: 'It leaves faint scrapes of bright metal on hard surfaces.',
    Vapor: 'A warm fog clings to the air where it lingers.',
    Dream: 'Those nearby grow inexplicably drowsy.',
    Sonic: 'A faint ringing lingers in the ears after it passes.',
    Stellar: 'Faint motes of light wink in and out around it.',
    Crystal: 'Scattered rainbows flicker across nearby surfaces.',
    Primal: 'A heavy, animal musk hangs around it.'
  };

  /* ---- immunity clauses (diegetic), with synergy overrides keyed by body type ---- */
  const IMMUNE_GENERIC = [
    function (t) { return `${t} attacks find no purchase on it, sloughing away before they can bite.`; },
    function (t) { return `It simply ignores ${t}, which passes through without leaving a mark.`; },
    function (t) { return `${t} of any strength breaks against it and does nothing at all.`; }
  ];
  // [bodyTypeOnVariant][immuneType] -> vivid line
  const IMMUNE_SYNERGY = {
    Fire:    { Aquatic: 'Water never reaches it; a wave hisses to steam before it can land.' },
    Ice:     { Fire: 'Flame finds no purchase, guttering out the instant it touches the cold.' },
    Spectral:{ Normal: 'Ordinary force passes clean through its half-real body, touching nothing.' },
    Aquatic: { Fire: 'Fire dies against it in a curtain of steam.' },
    Mental:  { Mental: 'Stranger still, thought slides off it entirely, finding nothing to grip.' },
    Toxin:   { Toxin: 'Poison is meaningless to it now — it is already steeped in worse.' }
  };
  function immuneClause(variantTypes, immune, rng) {
    for (const t of variantTypes) {
      if (IMMUNE_SYNERGY[t] && IMMUNE_SYNERGY[t][immune]) return IMMUNE_SYNERGY[t][immune];
    }
    return pick(rng, IMMUNE_GENERIC)(immune);
  }

  /* ---- stat-drift behaviour clauses, keyed by profile label ---- */
  const DRIFT_LORE = {
    swift:   ['What it lost in substance it gained in speed, crossing ground almost faster than the eye can follow.'],
    brute:   ['It no longer relies on its old subtlety, striking now with blunt physical force.'],
    caster:  ['Its power has turned inward and outward at once, hurling energy rather than closing to grips.'],
    bulwark: ['It has grown markedly harder to put down, absorbing punishment that would scatter its kin.'],
    even:    ['Its strengths sit in uneasy balance, none clearly master of the others.']
  };
  const DRIFT_BEHAVIOUR = {
    swift:   ['Strikes in quick passes and slips away before a counter can land; cornered, it folds quickly.'],
    brute:   ['Plants itself and trades blows head-on, trusting raw force over evasion.'],
    caster:  ['Keeps its distance and bombards from range, wary of anything that gets close.'],
    bulwark: ['Settles in and outlasts opponents, soaking hits while it wears them down.'],
    even:    ['Adapts to the fight in front of it, with no single tactic it favours.']
  };
  const HEFT_CLAUSE = {
    heavier: 'It carries noticeably more bulk than the creature it was.',
    frailer: 'It is thinner and more fragile than its unaltered kin.',
    comparable: ''
  };
  // Explicit contrast with the ordinary (non-variant) species — the "how it compares
  // to its normal self" flavour. Builds from the baseline typing + baseline build.
  const SHAPE_NOUN = {
    swift: 'a quick skirmisher', brute: 'a physical bruiser', caster: 'a ranged attacker',
    bulwark: 'a stubborn wall', even: 'an all-rounder'
  };
  const SHAPE_BARE = {
    swift: 'skirmisher', brute: 'bruiser', caster: 'ranged attacker', bulwark: 'wall', even: 'all-rounder'
  };
  const TACTIC = { // 3rd-person singular — always used with a singular subject
    swift: 'darts in and slips away', brute: 'trades blows up close', caster: 'strikes from a distance',
    bulwark: 'grinds out long fights', even: 'reads the fight and adapts'
  };
  // Shared baseline-vs-variant comparison parts (drives the contrast woven into
  // lore, description AND behaviour — generated, varied, never a fixed line).
  function compareParts(def, v) {
    const normT = (def.types || []).join('/');
    const varT = ((v.variantTypes && v.variantTypes.length) ? v.variantTypes : def.types).join('/');
    const nl = statProfile(def, def.base).label, vl = statProfile(def, v.variantBase).label;
    return { normT, varT, nl, vl, np: SHAPE_NOUN[nl], vp: SHAPE_NOUN[vl],
             npB: SHAPE_BARE[nl], vpB: SHAPE_BARE[vl],
             nt: TACTIC[nl], vt: TACTIC[vl], same: nl === vl, sameType: normT === varT };
  }
  function comparisonClause(def, v, rng) {
    const c = compareParts(def, v);
    const frames = [
      `Set beside an ordinary ${def.name} — ${c.normT} by nature, ${c.np} in a fight — this one answers to ${c.varT}${c.same ? ', still ' + c.vp : ' and fights as ' + c.vp}.`,
      `Where a true ${def.name} stays ${c.normT} and plays ${c.np}, this distortion has turned ${c.varT}${c.same ? ', the same ' + c.vp + ' underneath' : ', ' + c.vp + ' instead'}.`,
      `It shares little with a wild ${def.name}: that one is ${c.normT} and ${c.np}; this is ${c.varT}, ${c.vp}.`,
      `A wild ${def.name} would be ${c.normT}, ${c.np}; the Rift left this one ${c.varT} and ${c.vp}.`,
      `Hold it against its unaltered kin and the gap shows — a ${c.normT} ${c.npB} made over into a ${c.varT} ${c.vpB}.`
    ];
    return pick(rng, frames);
  }

  /* ---- per-species identity anchors (BATCHED content; fallback auto-derives) ---- */
  const ANCHORS = {
    129: { // Cerebraith
      noun: 'void-being',
      features: ['its blurred, ever-shifting edges', 'the dim-pulsing cranium at its core',
                 'the faint Cranivade silhouette held within it'],
      coreLine: 'The silhouette at its centre persists, but its old psychic voice has gone quiet.'
    },
    1: { // Solkin
      noun: 'fox kit',
      features: ['its candle-bright tail-flame', 'the soft orange-red fur along its back',
                 'its quick, darting frame'],
      coreLine: 'It still carries a kit’s restless curiosity beneath the change.'
    },
    3: { // Calderaeth
      noun: 'dragon',
      features: ['the cooling-lava scales across its hide', 'its broad, smouldering wings',
                 'the molten light banked in its throat'],
      coreLine: 'The volcanic heart of the creature endures, however its surface is remade.'
    },
    2:  { noun: 'flame-maned fox', features: ['its streaming mane of orange flame', 'the scorch-marks its paws leave', 'its broad, fire-lit chest'], coreLine: 'The fox beneath the fire still patrols its nightly territory.' },
    4:  { noun: 'otter sprite', features: ['its bright teal fur', 'the ridged fin running down its back', 'its large silver-rimmed eyes'], coreLine: 'It stays cool and moist to the touch whatever it becomes.' },
    5:  { noun: 'cobalt otter', features: ['its glossy cobalt fur', 'its long, leaping body', 'the flattened fin fused along its spine'], coreLine: 'Its restless, leaping grace carries through the change.' },
    6:  { noun: 'amphibious otter', features: ['its powerful digging claws', 'its stretched, land-strong limbs', 'its broad, blunt snout'], coreLine: 'It remains as at home on the bank as in the current.' },
    7:  { noun: 'seedling sprite', features: ['its smooth lime-green skin', 'its stubby root-legs', 'the single bud on its crown'], coreLine: 'A seedling’s brave curiosity lingers under the distortion.' },
    8:  { noun: 'bark-hide reptile', features: ['its bark-plated hide', 'the rows of leaf-spines along its back', 'its razor-edged spines'], coreLine: 'The stout, stubborn reptile endures beneath the change.' },
    9:  { noun: 'bark guardian', features: ['its fused bark-plate armour', 'the blossoms blooming along its spine', 'its heavy, rooted frame'], coreLine: 'Pollinators still trail it wherever it roams.' },
    10: { noun: 'flame larva', features: ['its orange-and-black segmented body', 'its glowing antenna tips', 'the scorch-marks it leaves'], coreLine: 'It still smoulders softly as it inches along.' },
    11: { noun: 'flame chrysalis', features: ['its flame-veined casing', 'its layered tan-and-charcoal shell', 'the single dark thread it hangs by'], coreLine: 'It hangs motionless, something winged still forming within.' },
    12: { noun: 'fire-moth', features: ['its vast crimson-and-gold wings', 'the ash-rimmed eyespots on its wings', 'its slender black-banded body'], coreLine: 'The heat off its wings still lifts it into the thermals.' },
    13: { noun: 'lava bull', features: ['its thick rust-red hide', 'its heat-glowing horns', 'its heavy stamping hooves'], coreLine: 'It still snorts and stamps before it charges.' },
    14: { noun: 'volcanic bull', features: ['its hardened lava-rock plates', 'its amber-glowing horns', 'its grinding, shifting hide'], coreLine: 'Nothing slows its charge once it begins.' },
    15: { noun: 'volcanic titan', features: ['its dark basalt body', 'the glowing magma veins across it', 'the burning rock it hurls'], coreLine: 'The ground still splits where it charges.' },
    16: { noun: 'fire-serpent', features: ['its copper-to-charcoal scales', 'the crest of flame-coloured feathers', 'its sinuous length'], coreLine: 'It keeps to the ash fields, shy of any fight.' },
    17: { noun: 'plumed fire-serpent', features: ['its scarlet-and-black scales', 'its great iridescent plumed wings', 'its coiling length'], coreLine: 'It rides the rising thermals for hours, trailing sparks.' },
    18: { noun: 'plumed sky-serpent', features: ['its vast amber-and-scarlet feathered wings', 'its crown of iridescent plumes', 'its fire-trailing coils'], coreLine: 'It loops through the high thermals trailing a banner of fire.' },
    19: { noun: 'magma mole', features: ['its cooling lava-plate coat', 'its heat-glowing claws', 'its singed underfur'], coreLine: 'It still tunnels the badlands for mineral veins.' },
    20: { noun: 'boring lizard', features: ['its charcoal-and-rust scales', 'its flame-erupting spines', 'its lean tunnelling frame'], coreLine: 'It carves its tunnels with molten precision still.' },
    21: { noun: 'magma predator', features: ['its thick terracotta hide', 'its fire-hardened dorsal plates', 'its heat-pitted snout'], coreLine: 'It still erupts from the bedrock beneath its prey.' },
    22: { noun: 'flame sprite', features: ['its amber scales marked with violet', 'its purple, focusing eyes', 'its slight snake-headed frame'], coreLine: 'Its fire still burns hotter the harder it concentrates.' },
    23: { noun: 'saurian channeler', features: ['its budding feathered ruff', 'its long claw-tipped forelimbs', 'the violet psychic markings along it'], coreLine: 'It still paralyses prey with thought before it strikes.' },
    24: { noun: 'flame oracle', features: ['its mane of living fire', 'the colour that shifts with its mood', 'its regal lion-like frame'], coreLine: 'It still reads the minds of those it faces.' },
    25: { noun: 'reef crab', features: ['its polyp-studded shell', 'the iridescent bubbles it blows', 'its small scuttling frame'], coreLine: 'It stays fiercely territorial along the shoreline.' },
    26: { noun: 'rock lobster', features: ['its stone-grey carapace', 'its heavy crushing pincers', 'its mineral-calcified shell'], coreLine: 'Its raw strength carries through the change.' },
    27: { noun: 'tide colossus', features: ['its dome of granite-grey shell', 'its rows of serrated claws', 'its wave-worn carapace'], coreLine: 'It still rules the coastal shallows by main strength.' },
    28: { noun: 'coral fish', features: ['its vivid orange-and-white stripes', 'its blue-edged translucent fins', 'the weak charge in its scales'], coreLine: 'It still lures prey with its bright colours.' },
    29: { noun: 'reef puffer', features: ['its sandy-yellow spotted scales', 'its rounded puffer body', 'the faint rainbow in its scales'], coreLine: 'Schools of fish still gather at its command.' },
    30: { noun: 'reef leviathan', features: ['its silver-blue streamlined body', 'its prism-scattering scales', 'its hidden retracted spines'], coreLine: 'Ocean life still stills under its single glance.' },
    31: { noun: 'banded octopus', features: ['its violet-and-yellow banded tentacles', 'the paralytic sheen on its arms', 'its bulbous mantle'], coreLine: 'It still snares prey in toxin-slick arms.' },
    32: { noun: 'hooded squid', features: ['its flaring navy hood', 'its streamlined squid silhouette', 'its venom-tipped tentacles'], coreLine: 'It still runs down prey in open water.' },
    33: { noun: 'bloomed cephalopod', features: ['its bell-shaped crimson mantle', 'its many drifting tentacles', 'its colossal bulk'], coreLine: 'It drifts vast and venomous through the deep.' },
    34: { noun: 'pearl fry', features: ['its tiny pale-violet body', 'the barnacled oyster shell it shelters in', 'its delicate fins'], coreLine: 'It still curls shyly within its shell.' },
    35: { noun: 'mermaid', features: ['its pale-violet upper body', 'its long lengthened fin-tail', 'its flowing translucent fins'], coreLine: 'It has outgrown its shell but not its grace.' },
    36: { noun: 'sea-fairy sovereign', features: ['its regal humanoid upper body', 'its sweeping iridescent fin-tail', 'its crown of coral and light'], coreLine: 'It still bears itself as a sovereign of the oceans.' },
    37: { noun: 'living-reef golem', features: ['its body of packed coral and shell', 'its metal-hard encrusted armour', 'its hulking humanoid frame'], coreLine: 'It stands like a reef given purpose and weight.' },
    38: { noun: 'sea-titan', features: ['its interlocking fossil-shell plates', 'its towering humanoid bulk', 'its barnacle-crusted limbs'], coreLine: 'It looms a true colossus of the deep.' },
    39: { noun: 'manta drifter', features: ['its broad gossamer wing-fins', 'its midnight-blue-over-silver body', 'its trailing silken fins'], coreLine: 'It still glides like silk through the currents.' },
    40: { noun: 'winged cetacean', features: ['its broad pectoral wing-fins', 'its flat manta-like head', 'its streamlined blue-grey body'], coreLine: 'It carries the manta’s glide into open water.' },
    41: { noun: 'oceanic titan', features: ['its overlapping steel-grey plates', 'its whale-vast body', 'its four broad stabilising fins'], coreLine: 'Its armour still turns aside what would sink a ship.' },
    42: { noun: 'ice seal', features: ['its powder-blue ice-tipped fur', 'the crackling coat of ice over it', 'its wide amber eyes'], coreLine: 'A thin skin of ice still crackles as it moves.' },
    43: { noun: 'frost seal', features: ['its slate-blue fur', 'its frosted white neck-mane', 'the ice that bands its body'], coreLine: 'It sheds ice in spontaneous bands as it surges.' },
    44: { noun: 'serpentine seal', features: ['its translucent blue-white fur', 'its long muscled pinniped body', 'its broad front flippers'], coreLine: 'It moves sleek and powerful through frozen water.' },
    45: { noun: 'ice medusa', features: ['its translucent glowing bell', 'its trailing icicle tendrils', 'its drifting weightless body'], coreLine: 'It drifts cold and luminous on the current.' },
    46: { noun: 'frozen medusa', features: ['its condensed seal-shaped body', 'its translucent gelatinous flesh', 'the faint charge running through it'], coreLine: 'It holds a firmer shape than the drifting jelly it was.' },
    47: { noun: 'ice wolf', features: ['its renewing shell of ice crystals', 'its short grey-white fur', 'the hexagonal prints it leaves'], coreLine: 'Frost re-forms across its coat as fast as it cracks.' },
    48: { noun: 'ice wolf', features: ['its bristling ice-spine hackles', 'its broad white-furred shoulders', 'its frost-rimed muzzle'], coreLine: 'Its hackles still rise into jagged ice when roused.' },
    49: { noun: 'glacial wolf', features: ['its thick matted grey-white fur', 'its armoured ice ruff', 'its heavy shoulders'], coreLine: 'It carries a glacier’s cold weight in every step.' },
    50: { noun: 'frost ram', features: ['its thick white wool', 'its ice-layered curling horns', 'the blue tinge along its spine'], coreLine: 'It still grazes the frostbound highland moss.' },
    51: { noun: 'woolly bovid', features: ['its dense pale wool', 'its growing shoulder ice-plates', 'its sturdy frame'], coreLine: 'It is halfway to the great glacial ox it will become.' },
    52: { noun: 'mountain auroch', features: ['its shell of ancient glacier ice', 'its colossal shoulders', 'its frost-matted coat'], coreLine: 'It moves with the slow certainty of a glacier.' },
    53: { noun: 'frost owlet', features: ['its soft white-and-silver down', 'its enormous golden eyes', 'its near-fully-swivelling head'], coreLine: 'It keeps an owlet’s wide, watchful stare.' },
    54: { noun: 'snowy owl', features: ['its dense silver-white feathers', 'its vast pale wingspan', 'its piercing golden eyes'], coreLine: 'It still rides the cold air on silent wings.' },
    55: { noun: 'ice-forged figure', features: ['its layered ice-and-steel plating', 'its jointed armoured limbs', 'the blue veins of compressed ice through it'], coreLine: 'It moves like armour assembled and given will.' },
    56: { noun: 'frozen warrior', features: ['its broad fused chest-armour', 'its pauldrons of glacial ice', 'its heavy bipedal frame'], coreLine: 'It stands a warrior cased in living ice.' },
    57: { noun: 'lens-fairy', features: ['its flat circular lens-face', 'its radiating crystalline spines', 'its translucent floating body'], coreLine: 'It still hangs weightless, watching through its lens.' },
    58: { noun: 'iris fairy', features: ['its enormous flat ice-crystal wings', 'their full rainbow iridescence', 'its graceful slender body'], coreLine: 'Light still splinters into rainbows across its wings.' },
    59: { noun: 'ice-dragon', features: ['its blue-to-silver shifting scales', 'its crescent ridge of ice', 'its serpentine length'], coreLine: 'It still hunts by night, cold and unhurried.' },
    60: { noun: 'ice dragon', features: ['its broad ice-armoured wings', 'its blue-and-silver scales', 'its imposing length'], coreLine: 'It commands the high cold air on vast wings.' },
    61: { noun: 'ice hedgehog', features: ['its translucent ice spines', 'its pale ice-blue body', 'its rounded prickly frame'], coreLine: 'It still bristles its spines at any threat.' },
    62: { noun: 'ice porcupine', features: ['its long translucent quills', 'its pale ice-blue hide', 'its broad-shouldered bulk'], coreLine: 'It still raises its frozen quills in warning.' },
    63: { noun: 'mushroom sprite', features: ['its broad purple-spotted cap', 'its soft spongy white body', 'the glittering green spores it releases'], coreLine: 'It still puffs out clouds of glittering spores.' },
    64: { noun: 'fungal humanoid', features: ['its cap lifted on a humanoid stalk', 'its spongy reformed body', 'its drifting spore-haze'], coreLine: 'It rises now on a fungal stalk, half-upright.' },
    65: { noun: 'fungal hulk', features: ['its barrel-thick body', 'its wide flat cap', 'its spore-laden bulk'], coreLine: 'It looms heavy and slow, wreathed in spores.' },
    66: { noun: 'fern snail', features: ['its lime-green fern-patterned shell', 'its soft curling body', 'its slow gliding foot'], coreLine: 'It still carries its spiral shell like a rolled frond.' },
    67: { noun: 'forest snail', features: ['its bark-crusted shell', 'its long extended body', 'its broad gliding foot'], coreLine: 'It still hauls its mossy shell through the loam.' },
    68: { noun: 'ancient snail', features: ['its towering apex shell', 'its vast extended body', 'the roots trailing from its shell'], coreLine: 'It moves with the patience of something ancient.' },
    69: { noun: 'seed sprite', features: ['its smooth green seed-body', 'its two tiny sprout-legs', 'the leaf tendrils framing its face'], coreLine: 'It still buries itself to rest in soft soil.' },
    70: { noun: 'walking seed-pod', features: ['its split green husk', 'the soft moss within it', 'its lumbering pod-body'], coreLine: 'Its husk has cracked open to reveal the green within.' },
    71: { noun: 'ancient seed-pod', features: ['its enormous overgrown husk', 'the saplings rooted across it', 'its mossy bulk'], coreLine: 'A small forest grows over its ancient husk.' },
    72: { noun: 'flower sprite', features: ['its body of intertwined stems', 'the pink blossoms along it', 'its slender pale-green form'], coreLine: 'Blossoms still open across it in the sun.' },
    73: { noun: 'flowering fairy', features: ['its interlocking flowering vines', 'its luminous inner glow', 'its graceful tall form'], coreLine: 'A soft light still glows from within its vines.' },
    74: { noun: 'blossom fairy', features: ['its cascade of blossoms', 'its regal humanoid form', 'its wreath of living flowers'], coreLine: 'It carries itself wreathed in endless bloom.' },
    75: { noun: 'forest fawn', features: ['its vivid green coat', 'its short antler-buds', 'its lithe legs'], coreLine: 'It still bounds skittishly through the undergrowth.' },
    76: { noun: 'antlered stag', features: ['its crown of bark-covered antlers', 'its green-shading hide', 'its broad chest'], coreLine: 'Its branching antlers still crackle faintly.' },
    77: { noun: 'thorned elk', features: ['its thorny dorsal ridges', 'its dark green reinforced hide', 'its heavy shoulders'], coreLine: 'It still lowers its thorned crown to charge.' },
    78: { noun: 'forest leshy', features: ['its bark skin', 'its fringed cloak of dark leaves', 'its twig-horns'], coreLine: 'It still slips silent through shadowed groves.' },
    79: { noun: 'grove leshy', features: ['its dark-wood shoulder-plates', 'its elongating antlers', 'its bark-knotted frame'], coreLine: 'The corrupted grove still answers to its presence.' },
    80: { noun: 'leshy-lord', features: ['its towering bark-skinned frame', 'its full crown of antlers', 'its mantle of dead leaves'], coreLine: 'It rules its corrupted grove as an old, dark lord.' },
    81: { noun: 'electric foal', features: ['its bright yellow coat', 'its static-raised dark mane', 'its skittish legs'], coreLine: 'Sparks still snap through its raised mane.' },
    82: { noun: 'electric horse', features: ['its golden-yellow hide', 'the electric-blue lines across it', 'its powerful frame'], coreLine: 'Current still races along the lines of its coat.' },
    83: { noun: 'electric stallion', features: ['its dark charcoal hide', 'its bright lightning-bolt markings', 'its storming mane'], coreLine: 'It still gallops trailing arcs of lightning.' },
    84: { noun: 'dragonfly nymph', features: ['its gold-edged dark plates', 'its small gill-fans', 'its segmented aquatic body'], coreLine: 'It still lurks in the water before its change.' },
    85: { noun: 'dragonfly nymph', features: ['its slimming late-instar body', 'its budding wings', 'its charged segments'], coreLine: 'It is poised between water and air, mid-change.' },
    86: { noun: 'dragonfly', features: ['its translucent gold wings', 'the static crackling along them', 'its slender darting body'], coreLine: 'It still darts on wings that snap with charge.' },
    87: { noun: 'charged reef fish', features: ['its blue-striped yellow body', 'its capacitor dorsal fin', 'its schooling shape'], coreLine: 'Its fin still stores a stinging charge.' },
    88: { noun: 'electric eel', features: ['its silver-blue elongating body', 'its pale yellow underside', 'its slick length'], coreLine: 'A growing charge still hums along its body.' },
    89: { noun: 'eel leviathan', features: ['its blue-black banded body', 'its colossal length', 'the charge crawling over it'], coreLine: 'It still floods the water with current when roused.' },
    90: { noun: 'storm sparrow', features: ['its white-edged yellow feathers', 'its arcing wingtips', 'its quick diving frame'], coreLine: 'Its wingtips still spark as it dives.' },
    91: { noun: 'storm eagle', features: ['its vast charged wings', 'the lightning along its leading edges', 'its broad raptor frame'], coreLine: 'It still rides the storm-front on crackling wings.' },
    92: { noun: 'spark echidna', features: ['its conductive crystalline quills', 'its rocky grey-brown hide', 'its stocky digging frame'], coreLine: 'Its quills still gather and snap with charge.' },
    93: { noun: 'rock echidna', features: ['its thick stone plate-quills', 'its broad shoulders', 'its grounded heavy frame'], coreLine: 'It still channels charge down through the stone.' },
    94: { noun: 'stone echidna', features: ['its iron-laced stone casing', 'its colossal frame', 'its plate-quilled hide'], coreLine: 'It moves like a charged outcrop come alive.' },
    95: { noun: 'rhino calf', features: ['its grey-brown hide', 'its forming proto-armour plates', 'its stubby horn'], coreLine: 'It already stamps the ground like the shaker it will be.' },
    96: { noun: 'seismic rhino', features: ['its mineral-rich earth plates', 'its broad chest', 'its heavy horn'], coreLine: 'Its footfalls still send tremors through the ground.' },
    97: { noun: 'rhino-titan', features: ['its iron-and-copper-veined armour', 'its massive frame', 'its great horn'], coreLine: 'The earth still quakes beneath its charge.' },
    98: { noun: 'desert scorpion', features: ['its sandstone exoskeleton', 'its venomous stinger tail', 'its flat digging pincers'], coreLine: 'It still burrows in the dunes to ambush prey.' },
    99: { noun: 'venom scorpion', features: ['its teal-green warning-marked shell', 'its heavy stinger', 'its broad pincers'], coreLine: 'Its sting still drips with potent venom.' },
    100: { noun: 'colossal scorpion', features: ['its purple-black chitin', 'its enormous carapace', 'its towering stinger'], coreLine: 'It still lurks in craters, vast and patient.' },
    101: { noun: 'mud crocodile', features: ['its muddy olive hide', 'its wide flat head', 'its pale underbelly'], coreLine: 'It still lies half-buried in the shallows.' },
    102: { noun: 'armoured crocodilian', features: ['its mud-brown stone-plated hide', 'its powerful jaws', 'its low heavy build'], coreLine: 'It still ambushes from the muddy banks.' },
    103: { noun: 'river crocodilian', features: ['its calcified mineral hide', 'its massive jaws', 'its armoured length'], coreLine: 'Its hide has all but turned to stone.' },
    104: { noun: 'desert pup', features: ['its sandy fur', 'its large upright ears', 'its digging snout'], coreLine: 'It still yips and digs in the warm sand.' },
    105: { noun: 'desert hyena', features: ['its tawny earth-toned coat', 'its thickened dorsal ridge', 'its powerful jaws'], coreLine: 'It still ranges the dunes in restless packs.' },
    106: { noun: 'armoured hatchling', features: ['its cap of bony scutes', 'its iron-grey shell', 'its powerful digging claws'], coreLine: 'It rolls into an armoured ball at the first sign of danger.' },
    107: { noun: 'armoured glyptodon', features: ['its great dark-bronze dome', 'its knobbed bludgeon tail', 'its heavy clawed limbs'], coreLine: 'Its tread still sets the ground trembling.' },
    108: { noun: 'wind cub', features: ['its silver-grey ruffling fur', 'its long swept ears', 'the air currents stirring around it'], coreLine: 'A breeze still follows it wherever it goes.' },
    109: { noun: 'wind lion', features: ['its tawny-gold coat', 'its wind-stirred mane', 'its long swept ears'], coreLine: 'Gusts still swirl around its restless mane.' },
    110: { noun: 'storm lion', features: ['its white-to-storm-grey coat', 'its billowing mane', 'its commanding frame'], coreLine: 'It still moves at the head of its own gale.' },
    111: { noun: 'wind bird', features: ['its white-silver feathers', 'its long forked rudder-tail', 'its curved wingtips'], coreLine: 'It still rides the high breezes with ease.' },
    112: { noun: 'wind eagle', features: ['its grey-brown weathered plumage', 'its stiffened tail', 'its sharp eyes'], coreLine: 'It still wheels on the rising thermals.' },
    113: { noun: 'condor', features: ['its vast wingspan', 'its streamlined skull', 'its apex-predator frame'], coreLine: 'It still owns the high air over the peaks.' },
    114: { noun: 'cloud fairy', features: ['its body of condensed cloud', 'its gossamer wings', 'its shifting wispy form'], coreLine: 'It still drifts and reforms on the breeze.' },
    115: { noun: 'storm-wraith fairy', features: ['its frayed ragged wings', 'its darkened cloud-body', 'its tattered silhouette'], coreLine: 'Its form has gone storm-dark and ragged.' },
    116: { noun: 'wind vortex', features: ['its column of teal compressed air', 'its faint psychic glow', 'its swirling trailing streamers'], coreLine: 'A quiet psychic pressure still spins at its core.' },
    117: { noun: 'gale vortex', features: ['its vast swirling air-body', 'its bright psychic core', 'its roaring currents'], coreLine: 'It still thinks in the language of the wind.' },
    118: { noun: 'shadow hound', features: ['its light-drinking jet-black fur', 'the dimness gathering around it', 'its lean frame'], coreLine: 'Shadows still pool in the space it occupies.' },
    119: { noun: 'dark hound', features: ['its pure-black coat', 'its broad powerful chest', 'its heavy jaws'], coreLine: 'It still hunts silent through the deepest dark.' },
    120: { noun: 'night wolf', features: ['its great black-furred frame', 'its powerful build', 'its gleaming eyes'], coreLine: 'It still runs down prey under a moonless sky.' },
    121: { noun: 'echo bat', features: ['its grey-black narrow wings', 'its broad wrinkled nose-leaf', 'its slight frame'], coreLine: 'It still navigates the dark by its own echoes.' },
    122: { noun: 'cave bat', features: ['its broad leathery purple-black wings', 'its dark furred body', 'its keen ears'], coreLine: 'It still shrouds itself in the cave-dark.' },
    123: { noun: 'venom lizard', features: ['its rough dark-green scales', 'its venomous forked tongue', 'the dark stripe down its body'], coreLine: 'It still tastes the air for prey by night.' },
    124: { noun: 'shadow serpent', features: ['its dark iridescent scales', 'its long legless body', 'its venomous bite'], coreLine: 'It still glides shadow-silent through the rocks.' },
    125: { noun: 'titan serpent', features: ['its iridescent purple-black scales', 'its tree-thick coils', 'its vast length'], coreLine: 'It can still encircle a great tree in its coils.' },
    126: { noun: 'mimic fox', features: ['its slate-grey fur', 'its light-less eyes', 'its slight quick frame'], coreLine: 'It still mimics the sounds it overhears.' },
    127: { noun: 'fox-spirit', features: ['its part-translucent fox form', 'its drifting spectral tails', 'its slate fur'], coreLine: 'It still plays its sly spirit-tricks.' },
    128: { noun: 'psychic biped', features: ['its smooth lavender-grey body', 'its oversized pulsing cranium', 'its slight frame'], coreLine: 'Its cranium still lights when it concentrates.' },
    130: { noun: 'thorn-bush creature', features: ['its charcoal thorned branches', 'its dark withered leaves', 'its creeping roots'], coreLine: 'It still drags itself toward the living.' },
    131: { noun: 'blight-tree', features: ['its twisted dark trunk-body', 'its grasping branch-limbs', 'its withered canopy'], coreLine: 'Decay still spreads from where it roots.' },
    132: { noun: 'obsidian lizard', features: ['its jet-black obsidian body', 'its razor ridge-spines', 'its horned brow'], coreLine: 'Its glassy hide still turns aside most blows.' },
    133: { noun: 'obsidian saurian', features: ['its massive obsidian body', 'its fused ridge-back', 'its glassy black plates'], coreLine: 'It looms like a shard of mountain given will.' },
    134: { noun: 'steel bat', features: ['its thin metal-alloy wings', 'its gunmetal-grey body', 'its bladed wingtips'], coreLine: 'Its metal wings still slice the air silently.' },
    135: { noun: 'steel bat', features: ['its chrome-black wing-shields', 'its dark alloy body', 'its broad span'], coreLine: 'Its shield-wings still flash as they catch the light.' },
    136: { noun: 'steel leviathan-bat', features: ['its overlapping steel plate-wings', 'its vast span', 'its armoured body'], coreLine: 'It still blots out the sky on plated wings.' },
    137: { noun: 'fairy pup', features: ['its glowing white fluff', 'its warm golden aura', 'its bright violet eyes'], coreLine: 'A gentle golden warmth still radiates from it.' },
    138: { noun: 'fairy hound', features: ['its luminous adult fur', 'its soft gold aura', 'its sleek frame'], coreLine: 'Its coat still glows with a quiet light.' },
    139: { noun: 'radiant hound', features: ['its brilliant white fur', 'its gold-pink aura', 'its regal bearing'], coreLine: 'It still carries a calming radiance about it.' },
    140: { noun: 'fairy butterfly', features: ['its pastel-shimmer wings', 'its tiny delicate body', 'its drifting flight'], coreLine: 'It still flits on softly shimmering wings.' },
    141: { noun: 'iris butterfly', features: ['its brilliant iridescent wings', 'its broad span', 'its graceful glide'], coreLine: 'Light still plays in rainbows across its wings.' },
    142: { noun: 'star sprite', features: ['its golden star-shaped body', 'its five rose-tipped arms', 'its soft glow'], coreLine: 'A gentle dawn-light still rings its points.' },
    143: { noun: 'moon sprite', features: ['its crescent-curved body', 'its pale lunar glow', 'its inward-curved arms'], coreLine: 'It still waxes and wanes with a soft light.' },
    144: { noun: 'celestial sprite', features: ['its many-pointed radiant body', 'its vast soft glow', 'its serene poise'], coreLine: 'It still hangs aglow like a small constellation.' },
    145: { noun: 'fairy knight', features: ['its tiny silver-gold armour', 'its glinting plates', 'its valiant little frame'], coreLine: 'It still stands guard with a knight’s resolve.' },
    146: { noun: 'fairy guardian', features: ['its gleaming platinum armour', 'its decorated plates', 'its steadfast stance'], coreLine: 'It still holds its ground as a sworn guardian.' },
    147: { noun: 'scrap automaton', features: ['its bolted grey steel plates', 'its visible seams', 'its small frame'], coreLine: 'Its joints still clank as it moves.' },
    148: { noun: 'steel sentinel', features: ['its broad reforged chest', 'its battle-scarred plating', 'its powerful arms'], coreLine: 'It still stands immovable in defence.' },
    149: { noun: 'plated colossus', features: ['its complete suit of plate', 'its massive steel frame', 'its towering stance'], coreLine: 'Few blows still find a seam in its armour.' },
    150: { noun: 'gearwork automaton', features: ['its interlocking cog-wheels', 'its spinning round body', 'its sparking contacts'], coreLine: 'Its gears still whir and spark as it moves.' },
    151: { noun: 'alloy automaton', features: ['its assembly of alloy plates', 'its charged inner core', 'its mechanical limbs'], coreLine: 'Current still arcs between its alloy plates.' },
    152: { noun: 'steel tortoise', features: ['its laminated steel dome-shell', 'its rock-fused underplates', 'its slow heavy gait'], coreLine: 'It still withdraws behind an unbreakable shell.' },
    153: { noun: 'miner automaton', features: ['its scuffed dented steel body', 'its digging limbs', 'its blunt sturdy frame'], coreLine: 'It still tunnels tirelessly through rock.' },
    154: { noun: 'metal-earth golem', features: ['its tremendous assembled frame', 'its steel-and-stone bulk', 'its grinding joints'], coreLine: 'The ground still groans under its tread.' },
    155: { noun: 'poison frog', features: ['its lime-green skin', 'its yellow-and-black warning marks', 'the sticky toxin it secretes'], coreLine: 'Its skin still warns of the toxin beneath.' },
    156: { noun: 'marsh frog', features: ['its flattened head', 'its webbed feet', 'its toxin-slick skin'], coreLine: 'It still lurks in fouled water for prey.' },
    157: { noun: 'acid orb', features: ['its swirling acid-green core', 'its barely-visible membrane', 'its drifting buoyant body'], coreLine: 'It still drifts, sloshing with caustic fluid.' },
    158: { noun: 'acid crawler', features: ['its broad disc-like body', 'its acid-weeping skin', 'its short stubby limbs'], coreLine: 'It still leaves a corroded trail behind it.' },
    159: { noun: 'toxic toad', features: ['its body of compressed toxic earth', 'its bloated bulk', 'its acrid hide'], coreLine: 'It still squats vast, dissolving all it touches.' },
    160: { noun: 'miasma fly', features: ['its bloated poisonous abdomen', 'its translucent wings', 'its long spindly legs'], coreLine: 'It still trails a haze of poison as it flies.' },
    161: { noun: 'miasma swarm', features: ['its cloud of tiny flies', 'its shifting collective shape', 'its poisonous haze'], coreLine: 'It still moves as one mind in many bodies.' },
    162: { noun: 'reed humanoid', features: ['its body of dense marsh reeds', 'its pale-green brown-banded stalk', 'its swaying frame'], coreLine: 'It still rustles like reeds in a foul wind.' },
    163: { noun: 'blight-flower humanoid', features: ['its deep crimson petal-head', 'its reed-stalk body', 'its toxic pollen'], coreLine: 'Its bloom still scatters blighted pollen.' },
    164: { noun: 'poison caterpillar', features: ['its purple-black body', 'its toxic bristle-hairs', 'its small inching frame'], coreLine: 'Its bristles still shed toxin on contact.' },
    165: { noun: 'poison moth', features: ['its deep black wings', 'its toxin-dusted scales', 'its drifting flight'], coreLine: 'Its wing-dust still warns of its poison.' },
    166: { noun: 'psychic pup', features: ['its lavender-grey fur', 'its glowing domed forehead', 'its alert frame'], coreLine: 'Its brow still glows when it focuses.' },
    167: { noun: 'psychic hound', features: ['its indigo-grey coat', 'its broad glowing brow', 'its keen stance'], coreLine: 'A faint pressure still radiates from its mind.' },
    168: { noun: 'gem creature', features: ['its violet crystal prism body', 'the serene face within it', 'its short limbs'], coreLine: 'A calm presence still hums within its crystal.' },
    169: { noun: 'crystal cluster', features: ['its orbiting cluster of shards', 'its violet glow', 'its slow turning halo'], coreLine: 'Its shards still wheel in quiet orbit.' },
    170: { noun: 'dream-wisp', features: ['its indigo-and-silver wisp body', 'its dissolving limbs', 'the motes drifting off it'], coreLine: 'Its edges still melt away into dream.' },
    171: { noun: 'oracle-serpent', features: ['its broad flaring cobra-hood', 'its eye-marked violet-blue coils', 'its hypnotic gaze'], coreLine: 'A keen, ancient intelligence still lights its eyes.' },
    172: { noun: 'dragon hatchling', features: ['its soft pale gold-green scales', 'its enormous eyes', 'its stumbling gait'], coreLine: 'It still stumbles with a hatchling’s clumsiness.' },
    173: { noun: 'dragon-serpent', features: ['its green-bronze scales', 'its flat head-crest', 'its coiling body'], coreLine: 'It still coils and weaves as it stalks.' },
    174: { noun: 'steel dragon', features: ['its steel-grey metallic plates', 'its powerful frame', 'its bladed scales'], coreLine: 'Its plated hide still rings like struck metal.' },
    175: { noun: 'deep-sea shark', features: ['its dark blue-green hide', 'its rows of fins', 'its glowing underbelly'], coreLine: 'Its underbelly still glows in the dark water.' },
    176: { noun: 'thunder-beast', features: ['its chrome-yellow-and-black bristling fur', 'the lightning-corona wreathing its body', 'its crackling fangs and claws'], coreLine: 'A storm-charge still crackles across its bristling fur.' },
    177: { noun: 'sapphire basilisk', features: ['its deep sapphire scales', 'its crest of crystal ice spines', 'its frost-pale belly'], coreLine: 'A chill still rolls off its sapphire hide.' },
    178: { noun: 'fluff cat', features: ['its enormous cream-white fluff', 'its tiny hidden face', 'its round bouncy shape'], coreLine: 'It still looks twice its true size for all the fluff.' },
    179: { noun: 'sleek cat', features: ['its short velvety fur', 'its lithe frame', 'its poised stance'], coreLine: 'It still moves with a smooth, unhurried grace.' },
    180: { noun: 'leap rabbit', features: ['its oversized hind legs', 'its independently pivoting ears', 'its soft white-grey fur'], coreLine: 'It still springs away in great startled bounds.' },
    181: { noun: 'racing hare', features: ['its short brown aerodynamic coat', 'its long powerful legs', 'its lean frame'], coreLine: 'It still bolts at the first sign of motion.' },
    182: { noun: 'round bear', features: ['its dense russet fur', 'its perfectly spherical shape', 'its food-stuffed cheeks'], coreLine: 'It still hoards food against its round middle.' },
    183: { noun: 'great bear', features: ['its towering russet bulk', 'its heavy upright stance', 'its broad shoulders'], coreLine: 'It still lumbers with a glutton’s ponderous weight.' },
    184: { noun: 'behemoth bear', features: ['its barrel-shaped torso', 'its pillar-like legs', 'its colossal frame'], coreLine: 'The ground still shifts under its titanic bulk.' },
    185: { noun: 'hover sparrow', features: ['its pale cream feathers', 'its round little body', 'the way it hovers above surfaces'], coreLine: 'It still hangs in the air rather than perch.' },
    186: { noun: 'albatross', features: ['its pure white upper feathers', 'its vast gliding wingspan', 'its tireless flight'], coreLine: 'It still rides the open winds for days unending.' },
    187: { noun: 'contented pig', features: ['its plump pink body', 'its curly tail', 'its rooting snout'], coreLine: 'It still roots happily through rich soil.' },
    188: { noun: 'wild boar', features: ['its broad heavy chest', 'its sensitive snout', 'its bristled hide'], coreLine: 'It still roots and charges with stubborn force.' },
    189: { noun: 'psychic sheep', features: ['its soft white wool', 'its calm violet eyes', 'the faint static in its fleece'], coreLine: 'A gentle calm still settles over those near it.' },
    190: { noun: 'cloud sheep', features: ['its silvery drifting wool', 'its serene eyes', 'its weightless fleece'], coreLine: 'Its fleece still drifts as if half-made of cloud.' },
    191: { noun: 'pebble creature', features: ['its round river-pebble body', 'its two tiny legs', 'its surprised little face'], coreLine: 'It still sits still as a stone when startled.' },
    192: { noun: 'boulder creature', features: ['its rough humanoid boulder body', 'its heavy stone limbs', 'its blunt craggy head'], coreLine: 'It still rolls into a boulder to charge downhill.' },
    193: { noun: 'reef crustacean', features: ['its barnacle-encrusted shell', 'its embedded pebbles', 'its eight wide legs'], coreLine: 'It still drags a reef of its own across the seabed.' },
    194: { noun: 'rock crab', features: ['its compressed-rock shell', 'its broad flat carapace', 'its sturdy claws'], coreLine: 'It still wedges among the coastal rocks unseen.' },
    195: { noun: 'geode creature', features: ['its rough dark matrix outer body', 'its amethyst crystal core', 'its stubby legs'], coreLine: 'Cold light still glints from the crystals within.' },
    196: { noun: 'permafrost boulder', features: ['its frost-locked rocky body', 'its embedded amethyst', 'its half-buried bulk'], coreLine: 'Frost still grips it fast to the ground.' },
    197: { noun: 'leaf worm', features: ['its pale-green segmented body', 'its two tiny antennae', 'its round little head'], coreLine: 'It still inches along feeding on leaves.' },
    198: { noun: 'chrysalis', features: ['its hard metallic-green shell', 'its sealed casing', 'its still hanging form'], coreLine: 'It hangs sealed, something taking shape within.' },
    199: { noun: 'forest butterfly', features: ['its teal-gold-and-black patterned wings', 'its slender body', 'its drifting flight'], coreLine: 'It still drifts on broad patterned wings.' },
    200: { noun: 'iridescent beetle', features: ['its emerald-to-sapphire wing-case', 'its hard shell', 'its small scuttling legs'], coreLine: 'Its shell still shifts colour as it turns.' },
    201: { noun: 'scarab beetle', features: ['its copper-gold metallised shell', 'its broad carapace', 'its strong forelegs'], coreLine: 'Its metal shell still gleams like worked gold.' },
    202: { noun: 'weaver spider', features: ['its pale-cream body', 'its rose-gold banded legs', 'its iridescent silk'], coreLine: 'It still spins silk of surprising strength.' },
    203: { noun: 'silk spider', features: ['its silver-white body', 'its long fine legs', 'its glimmering web'], coreLine: 'It still tends a vast and glimmering web.' },
    204: { noun: 'clay grub', features: ['its soft muddy-brown body', 'its short digging limbs', 'its blunt head'], coreLine: 'It still burrows through the rich clay soil.' },
    205: { noun: 'quarry beetle', features: ['its quartzite-grey shell', 'its rough stony texture', 'its digging legs'], coreLine: 'It still grinds through stone for buried roots.' },
    206: { noun: 'gentle hatchling-serpent', features: ['its bright warning-banded scales', 'its hopeful nuzzling', 'the faint toxic sheen on its skin'], coreLine: 'It waits at the jungle edge, hoping for a friend.' },
    207: { noun: 'shunned dragon-serpent', features: ['its purple-black banded scales', 'its watchful, longing gaze', 'the toxins it exudes unmeant'], coreLine: 'It mimics village calls from afar, aching to belong.' },
    208: { noun: 'lonely plague-dragon', features: ['its vast seven-metre wingspan', 'its gentle mournful eyes', 'the potent glands it cannot still'], coreLine: 'It sings to distant villages, inviting a friend who never comes.' },
    209: { noun: 'spark rabbit', features: ['its on-end yellow-white fur', 'its spiky silhouette', 'its long charged ears'], coreLine: 'Static still crackles through its bristling fur.' },
    210: { noun: 'thunder hare', features: ['its great electric mane', 'its powerful hind legs', 'its long charged ears'], coreLine: 'Its bounds still come with a crack of static.' },
    211: { noun: 'split-element lizard', features: ['its fire-scaled half', 'its ice-scaled half', 'the seam of steam between them'], coreLine: 'Fire and frost still war along its divided body.' },
    212: { noun: 'split-element beast', features: ['its crimson fire half', 'its ice-blue frozen half', 'the steam where they meet'], coreLine: 'Its two halves still hold in tense balance.' },
    213: { noun: 'fire-ice titan', features: ['its volcanic-orange half', 'its glacial-blue half', 'the roiling steam between'], coreLine: 'Steam still boils where its halves collide.' },
    214: { noun: 'coral-fortress crab', features: ['its shell of packed coral and rock', 'its fortress-like bulk', 'its broad claws'], coreLine: 'It still hauls a living reef on its back.' },
    215: { noun: 'psychic wisp', features: ['its condensed violet energy', 'its shifting sphere-to-wisp form', 'its faint glow'], coreLine: 'It still drifts between sphere and shapeless wisp.' },
    216: { noun: 'psychic cloud', features: ['its rotating particle-body', 'its diffuse violet light', 'its slow drift'], coreLine: 'Its scattered motes still turn in slow thought.' },
    217: { noun: 'bodiless intelligence', features: ['its near-invisible presence', 'the warp it leaves in the air', 'its scattered awareness'], coreLine: 'It still presses on the mind without a body to see.' },
    218: { noun: 'living shadow', features: ['its patch of self-aware shadow', 'its colour-draining edge', 'its low creep'], coreLine: 'Warmth and colour still drain near it.' },
    219: { noun: 'shadow giant', features: ['its towering shadow-body', 'its lightless form', 'its looming silhouette'], coreLine: 'It still rises like night given shape.' },
    220: { noun: 'smoke trickster', features: ['its wispy smoke-black body', 'its luminous grinning patches', 'its drifting form'], coreLine: 'Its glowing grin still floats in the dark.' },
    221: { noun: 'shadow-cloaked figure', features: ['its cloak of living shadow', 'its smoke-dark body', 'its veiled silhouette'], coreLine: 'It still drifts shrouded in its own shadow.' },
    222: { noun: 'thought-puff', features: ['its round blue-silver cloud-body', 'its two bright eyes', 'its gentle bobbing'], coreLine: 'It still bounces lightly on unseen currents.' },
    223: { noun: 'memory ovoid', features: ['its smooth pale ovoid body', 'its calm glow', 'its hovering poise'], coreLine: 'A quiet, retentive mind still hums within it.' },
    224: { noun: 'psychic-fairy', features: ['its graceful humanoid form', 'its prominent cranium', 'its soft aura'], coreLine: 'Its mind still reaches gently outward.' },
    225: { noun: 'crystal sprite', features: ['its glowing crystal body', 'its pink-gold light', 'the glimmer-trail it leaves'], coreLine: 'It still leaves a trail of fading glimmer.' },
    226: { noun: 'light kangaroo', features: ['its translucent white-light body', 'its energy-filled pouch', 'its bounding gait'], coreLine: 'Psychic energy still pools within its pouch.' },
    227: { noun: 'flame kangaroo', features: ['its fire-kindled light body', 'its blazing pouch', 'its leaping frame'], coreLine: 'Its pouch still smoulders with kindled energy.' },
    228: { noun: 'moonlit marsupial', features: ['its compressed moonlit body', 'its leaf-touched form', 'its quiet pouch-glow'], coreLine: 'A soft lunar calm still surrounds it.' },
    229: { noun: 'charged marsupial', features: ['its thunder-kindled light body', 'its crackling pouch', 'its electric aura'], coreLine: 'Its pouch still hums with stored charge.' },
    230: { noun: 'river-yokai hatchling', features: ['the water-dish on its head', 'its webbed green hands', 'its eager grappling stance'], coreLine: 'It guards the water in its head-dish above all else.' },
    231: { noun: 'kappa wrestler', features: ['its broad turtle-shell', 'the brimming dish on its crown', 'its powerful webbed grip'], coreLine: 'It drags challengers into the current and pins them fast.' },
    232: { noun: 'burrowing dragon', features: ['its earthy brown-bronze scales', 'its four powerful legs', 'its heavy digging claws'], coreLine: 'It still tunnels with a digger’s blunt strength.' },
    233: { noun: 'ground-dragon', features: ['its rust-brown thickened scales', 'its long low body', 'its clawed limbs'], coreLine: 'It still drags its long body through the rock.' },
    234: { noun: 'plated wyvern', features: ['its broad grey-green plates', 'its weathered hide', 'its heavy frame'], coreLine: 'Its weathered plates still shrug off blows.' },
    235: { noun: 'glimmer koi', features: ['its silver-green light-scattering scales', 'its long trailing fins', 'its shimmering trail'], coreLine: 'Underwater it still vanishes in scattered light.' },
    236: { noun: 'icicle sprite', features: ['its transparent ice body', 'its two tiny arms', 'its sharp pointed form'], coreLine: 'It still forms anew wherever the cold gathers.' },
    237: { noun: 'ice-stone tower', features: ['its lattice of ice and stone', 'its tower-like silhouette', 'its frozen core'], coreLine: 'It still rises fused to the cave bedrock.' },
    238: { noun: 'snowball creature', features: ['its perfectly round snow-body', 'its two coal eyes', 'its cold packed form'], coreLine: 'It still rolls along gathering more snow.' },
    239: { noun: 'snowman', features: ['its three stacked snow-tiers', 'its coal features', 'its growing frame'], coreLine: 'It still stacks itself taller as it grows.' },
    240: { noun: 'snow-titan', features: ['its three towering snow-tiers', 'its unsettlingly cheerful face', 'its colossal frame'], coreLine: 'Its jolly shape still hides a cold malevolence.' },
    241: { noun: 'crystal figure', features: ['its precision-cut ice-crystal body', 'its faceted limbs', 'its serene poise'], coreLine: 'It still fits together flawless, like cut glass.' },
    242: { noun: 'spark firefly', features: ['its glowing pulsing abdomen', 'its tiny luminous body', 'its delicate wings'], coreLine: 'Its light still pulses in a steady rhythm.' },
    243: { noun: 'shock dragonfly', features: ['its elongated dragonfly frame', 'its charged wings', 'its glowing abdomen'], coreLine: 'It still stuns prey with a snapping field.' },
    244: { noun: 'static weasel', features: ['its crackling yellow-white fur', 'its slender kit body', 'its quick paws'], coreLine: 'Static still snaps from its fur at a touch.' },
    245: { noun: 'thunder mustelid', features: ['its bright yellow fur', 'its longer muscular body', 'its charged coat'], coreLine: 'Charge still ripples down its lengthening frame.' },
    246: { noun: 'thunder wolverine', features: ['its heavily muscled body', 'its bristling charged fur', 'its powerful claws'], coreLine: 'It still discharges a storm when it strikes.' },
    247: { noun: 'spark butterfly', features: ['its glowing green wings', 'the electric field around it', 'its small drifting body'], coreLine: 'A faint field still hums around its wings.' },
    248: { noun: 'pebble creature', features: ['its smooth river-pebble body', 'its two tiny eyes', 'its camouflaged shape'], coreLine: 'It still sits motionless, just another stone.' },
    249: { noun: 'boulder creature', features: ['its squat boulder-frame', 'its rough stone limbs', 'its blunt head'], coreLine: 'It still hunkers down like a stubborn rock.' },
    250: { noun: 'standing-stone golem', features: ['its tall ancient stone body', 'its weathered surface', 'its monolithic frame'], coreLine: 'It still stands like a menhir come to life.' },
    251: { noun: 'rebar golem', features: ['its crumbling stone body', 'the steel rebar holding it together', 'its loose grinding joints'], coreLine: 'It still sheds gravel with every step.' },
    252: { noun: 'concrete golem', features: ['its steel-stabilised stone body', 'its compacted frame', 'its heavy fists'], coreLine: 'Its body holds firm now where it once crumbled.' },
    253: { noun: 'basalt creature', features: ['its volcanic basalt body', 'the glowing orange cracks across it', 'its blocky frame'], coreLine: 'Heat still glows in the seams of its stone.' },
    254: { noun: 'water bubble', features: ['its translucent water-bubble body', 'its two bright eyes', 'its dreamy drift'], coreLine: 'It still bobs along lost in a daydream.' },
    255: { noun: 'tide spirit', features: ['its frozen-wave body', 'its flowing translucent crest', 'its psychic shimmer'], coreLine: 'It still curls like a wave caught mid-break.' },
    256: { noun: 'water dolphin', features: ['its ice-blue water body', 'its semi-solid form', 'its sleek shape'], coreLine: 'It still leaps in cold, glassy arcs.' },
    257: { noun: 'narwhal', features: ['its blue-grey body', 'its single spiralled horn', 'its dense frame'], coreLine: 'It still breaks ice with its long horn.' },
    258: { noun: 'orca calf', features: ['its blue-and-white markings', 'its muscular body', 'its powerful tail'], coreLine: 'It still surges through frigid water with force.' },
    259: { noun: 'psychic jellyfish', features: ['its bioluminescent blue bell', 'its trailing charged tendrils', 'its drifting body'], coreLine: 'Its tendrils still pulse with faint psychic light.' },
    260: { noun: 'sapling sprite', features: ['its tiny sapling body', 'its two leaf-hands', 'its soft-glowing eyes'], coreLine: 'It still turns its leaf-hands toward the sun.' },
    261: { noun: 'leaf faun', features: ['its leaf-antlers', 'its overlapping leaf-scales', 'its slender faun frame'], coreLine: 'New leaves still bud along its antlers each season.' },
    262: { noun: 'cactus sprite', features: ['its pale-green translucent body', 'its spined limbs', 'its little face'], coreLine: 'It still squares up to far larger foes.' },
    263: { noun: 'vine fighter', features: ['its wrapping vine-tendril limbs', 'its translucent core', 'its toxic spines'], coreLine: 'It still lashes out with whipping tendrils.' },
    264: { noun: 'thorn warrior', features: ['its walking thorn-armoured body', 'its lashing vine-limbs', 'its towering frame'], coreLine: 'It still wades into a brawl bristling with thorns.' },
    265: { noun: 'moss moth', features: ['its living-moss wings', 'its soft furred body', 'its slow flutter'], coreLine: 'Moss still grows thick across its wings.' },
    266: { noun: 'shadow pup', features: ['its light-drinking jet-black fur', 'its small frame', 'its blurred outline'], coreLine: 'Its edges still blur against any bright thing.' },
    267: { noun: 'night hound', features: ['its deep-black coat', 'its larger frame', 'its dark claws'], coreLine: 'It still hunts unseen in the deepest dark.' },
    268: { noun: 'dark wolf', features: ['its pitch-black coat', 'its non-reflective claws', 'its powerful frame'], coreLine: 'It still vanishes wholly into the night.' },
    269: { noun: 'shadow tanuki', features: ['its slate-grey fur', 'its banded raccoon tail', 'its unnaturally dark shadow'], coreLine: 'Its shadow still moves a beat behind it.' },
    270: { noun: 'eclipse tanuki', features: ['its dark fur broken by pale patches', 'its banded tail', 'its sly grin'], coreLine: 'Mischief still glints in its moonlit eyes.' },
    271: { noun: 'murk rat', features: ['its dark grey fur', 'its bright beady eyes', 'its fat scrappy body'], coreLine: 'It still scavenges with ruthless pragmatism.' },
    272: { noun: 'phoenix hatchling', features: ['its downy orange-red plumage', 'its oversized curious eyes', 'its eager too-small wings'], coreLine: 'It scatters sparks flapping wings too small to fly.' },
    273: { noun: 'phoenix', features: ['its crimson-and-gold burning plumage', 'its broad everlasting-flame wings', 'the ashes it rises from'], coreLine: 'It rises from its own ashes brighter each time.' },
    274: { noun: 'cinder lizard', features: ['its dark basalt skin', 'the glowing cinders embedded in it', 'its small frame'], coreLine: 'Cinders still smoulder along its hide.' },
    275: { noun: 'volcanic beast', features: ['its volcanic plate armour', 'its glowing seams', 'its heavy build'], coreLine: 'Magma still glows between its armour plates.' },
    276: { noun: 'magma colossus', features: ['its fused stone armour', 'its molten core-glow', 'its massive frame'], coreLine: 'It still radiates a furnace heat as it moves.' },
    277: { noun: 'lava droplet', features: ['its glossy dark basalt body', 'its glowing molten core', 'its little legs'], coreLine: 'Its core still glows molten beneath the crust.' },
    278: { noun: 'iron knight', features: ['its silver-grey fairy-iron armour', 'its small valiant frame', 'its glinting plates'], coreLine: 'It still stands at attention like a sworn squire.' },
    279: { noun: 'steel knight', features: ['its refined steel armour', 'its horned helm', 'its steadfast stance'], coreLine: 'It still bears itself with knightly resolve.' },
    280: { noun: 'gear automaton', features: ['its gear-work body', 'its stubby legs', 'its ticking mechanism'], coreLine: 'Its cogs still tick away inside its chest.' },
    281: { noun: 'cog automaton', features: ['its complex cog-and-piston body', 'its exposed mechanism', 'its sturdy limbs'], coreLine: 'Pistons still drive its every blow.' },
    282: { noun: 'mech automaton', features: ['its heavy mechanical frame', 'its piston-driven arms', 'its grinding gears'], coreLine: 'It still strikes with piston-driven force.' },
    283: { noun: 'rust pike', features: ['its rusting iron body', 'its toxic green oxidation', 'its jagged fin-spines'], coreLine: 'Its rust still flakes off in toxic motes.' },
    284: { noun: 'puffball sprite', features: ['its cream-white fluff', 'its two little eyes', 'its weightless body'], coreLine: 'It still drifts off on the lightest breeze.' },
    285: { noun: 'cloud sprite', features: ['its compact cloud-body', 'its contented face', 'its drifting form'], coreLine: 'It still floats along wearing a placid smile.' },
    286: { noun: 'kirin fawn', features: ['its dense cream-white fluff', 'its tiny hooves', 'its round puffball shape'], coreLine: 'It still hides its slight frame under all that fluff.' },
    287: { noun: 'kirin calf', features: ['its soft pale-brown coat', 'its budding antlers', 'its gentle eyes'], coreLine: 'It still steps with a calf’s careful grace.' },
    288: { noun: 'dragon-kirin', features: ['its regal scaled-and-furred body', 'its branching antlers', 'its auspicious aura'], coreLine: 'An air of good fortune still attends it.' },
    289: { noun: 'gel blob', features: ['its pale pink gel body', 'its perfectly spherical shape', 'its endless bounce'], coreLine: 'It still bounces along without ever stopping.' },
    290: { noun: 'mimic cat', features: ['its dark grey fur', 'its shifting outline', 'its rearranging face'], coreLine: 'It still reshapes its face to unsettle onlookers.' },
    291: { noun: 'wind fawn', features: ['its sleek pale-grey coat', 'its slender legs', 'its long ears'], coreLine: 'It still bounds light as a gust over open ground.' },
    292: { noun: 'gale antelope', features: ['its grey-white coat', 'its long resonant horns', 'its powerful legs'], coreLine: 'Its horns still keen in a strong wind.' },
    293: { noun: 'storm dragonet', features: ['its pale-grey hardening scales', 'its loose wing-folds', 'its small frame'], coreLine: 'Faint static still clings to its new scales.' },
    294: { noun: 'storm dragon', features: ['its grey-blue scales', 'its broad charged wings', 'its crackling frame'], coreLine: 'A storm still gathers under its beating wings.' },
    295: { noun: 'cyclone dragon', features: ['its deep-grey white-edged scales', 'its vast wings', 'the perpetual storm around it'], coreLine: 'It still rides at the heart of its own cyclone.' },
    296: { noun: 'plague fly', features: ['its translucent green-veined wings', 'its bloated body', 'its spindly legs'], coreLine: 'It still spreads sickness wherever it lands.' },
    297: { noun: 'blight mosquito', features: ['its dark purple wings', 'its piercing proboscis', 'its lean body'], coreLine: 'It still drains and poisons in a single bite.' },
    298: { noun: 'plague mosquito', features: ['its needle-long proboscis', 'its elongated body', 'its dark wings'], coreLine: 'Its needle still drives deep for tainted blood.' },
    299: { noun: 'sting bee', features: ['its yellow-and-black striped abdomen', 'its venom stinger', 'its buzzing wings'], coreLine: 'Its sting still leaves a burning welt.' },
    300: { noun: 'nettle bee', features: ['its striped armoured body', 'its heavy stinger', 'its droning wings'], coreLine: 'Its drone still warns of a venomous sting.' },
    301: { noun: 'ember cat', features: ['its fur of living shadow and ember', 'its dim-glowing orange markings', 'its smouldering frame'], coreLine: 'Embers still glow beneath its shadowed coat.' },
    302: { noun: 'light orb', features: ['its round luminous body', 'its two bright eyes', 'its gentle constant glow'], coreLine: 'A soft warm light still spills from it.' },
    303: { noun: 'radiant orb', features: ['its brilliant grown form', 'its lunar glow', 'its drifting light'], coreLine: 'It still bathes its surroundings in calm light.' },
    304: { noun: 'ice cactus', features: ['its grey rock body', 'its ice-crystal spines', 'its cactus-like form'], coreLine: 'Its spines still re-freeze sharp after every thaw.' },
    305: { noun: 'crystal cluster', features: ['its jagged rock-crystal body', 'its clustered shards', 'its rough bipedal frame'], coreLine: 'Cold light still glints between its shards.' },
    306: { noun: 'crystal golem', features: ['its elongated crystalline body', 'its layered ice-and-rock form', 'its towering frame'], coreLine: 'It still grows new crystal where it is broken.' },
    307: { noun: 'ember cat', features: ['its glossy black fur', 'its glowing ember paw-markings', 'its lithe frame'], coreLine: 'Its paw-prints still smoulder faintly behind it.' },
    308: { noun: 'ghost fish', features: ['its translucent dark body', 'its dim bioluminescence', 'its drifting deep-sea form'], coreLine: 'It still haunts the lightless deep.' },
    309: { noun: 'spectral cetacean', features: ['its dark blue-black hide', 'its broad flat head', 'its phasing form'], coreLine: 'It still surfaces silent as a drowned memory.' },
    310: { noun: 'mud calf', features: ['its slick mud coat', 'its broad rounded body', 'its blunt snout'], coreLine: 'It still wallows happily in the marsh-mud.' },
    311: { noun: 'marsh hippo', features: ['its hardened mud-crust hide', 'its broad bulk', 'its heavy jaws'], coreLine: 'It still guards its stretch of marsh fiercely.' },
    312: { noun: 'dune armadillo', features: ['its dark sand-coloured plates', 'its tight-fitting armour', 'its rolling form'], coreLine: 'It still curls into a seamless armoured ball.' },
    313: { noun: 'desert armadillo', features: ['its brown-black plates', 'its heavy armoured shell', 'its digging claws'], coreLine: 'It still tunnels the dunes in armoured silence.' },
    314: { noun: 'gale raptor', features: ['its pale-grey raptor body', 'its trailing air-streamers', 'its swept wings'], coreLine: 'It still cuts the air with a keening rush.' },
    315: { noun: 'volcanic vent', features: ['its glowing magma core', 'its surrounding rock body', 'its venting heat'], coreLine: 'It still vents smoke and cinder as it moves.' },
    316: { noun: 'abyssal squid', features: ['its enormous dark body', 'its bioluminescent patches', 'its vast tentacles'], coreLine: 'It still rises from the lightless abyss to feed.' },
    317: { noun: 'time-dragon', features: ['its phase-flickering scales', 'its shifting outline', 'its serpentine body'], coreLine: 'It still slips half a moment out of phase.' },
    318: { noun: 'earth titan', features: ['its lower body of packed earth and roots', 'its canopy of foliage', 'its towering frame'], coreLine: 'Life still takes root across its earthen body.' },
    319: { noun: 'void-star', features: ['its body of perfect darkness', 'its rim of pale stellar light', 'its absence-in-reality form'], coreLine: 'Stars still seem to gutter where it passes.' },
    320: { noun: 'mechanical titan', features: ['its great steel frame', 'its glowing fusion core', 'its piston limbs'], coreLine: 'Its core still thrums with caged power.' },
    321: { noun: 'legendary fire-dragon', features: ['its crimson-black scales', 'its enormous wingspan', 'its furnace breath'], coreLine: 'Its breath could still reduce stone to slag.' },
    322: { noun: 'venom wraith', features: ['its translucent green-glowing body', 'the corrosive vapour seeping from it', 'its drifting form'], coreLine: 'A caustic mist still trails from it.' },
    323: { noun: 'acid-flask creature', features: ['its boiling acid core', 'its glowing chamber-body', 'its fuming vents'], coreLine: 'Its core still boils with violent acid.' },
    324: { noun: 'blade insect', features: ['its six blade-like limbs', 'its multi-faceted crimson eyes', 'its sleek dark body'], coreLine: 'It still sees perfectly in total dark.' },
    325: { noun: 'venom mole-rat', features: ['its armoured hide', 'its venom spines', 'its powerful digging claws'], coreLine: 'It still erupts from the sand spines-first.' },
    326: { noun: 'walking plant', features: ['its glossy dark-green leaves', 'its purple poison sacs', 'its trailing roots'], coreLine: 'Its leaves still weep poison at the edges.' },
    327: { noun: 'quarry golem', features: ['its interlocked granite slabs', 'its iron-ore veins', 'its massive frame'], coreLine: 'It can still pass for an outcrop until it moves.' },
    328: { noun: 'smog cloud', features: ['its dense yellow-green haze', 'its shapeless drifting body', 'its choking vapour'], coreLine: 'It still rolls in like a poisoned fog.' },
    329: { noun: 'fossil beetle', features: ['its helmet-shaped fossil carapace', 'its crushing mandibles', 'its armoured body'], coreLine: 'Its mandibles still crack stone with ease.' },
    330: { noun: 'acid crocodile', features: ['its blistered acid-weeping skin', 'its rows of teeth', 'its heavy build'], coreLine: 'Acid still drips from its blistered hide.' },
    331: { noun: 'thorn moth', features: ['its serrated leaf-like wings', 'its emerald-and-brown patterning', 'its broad span'], coreLine: 'Its wings still cut like serrated leaves.' },
    332: { noun: 'ice-armour suit', features: ['its interlocking iron-and-ice plates', 'its hollow armour frame', 'its frost-rimed seams'], coreLine: 'Cold still radiates from its joined plates.' },
    333: { noun: 'storm wolf', features: ['its jet-black fur shot with lightning', 'its crackling coat', 'its fierce eyes'], coreLine: 'Lightning still races through its dark fur.' },
    334: { noun: 'iron golem', features: ['its smelted-iron body', 'its compressed-ore core', 'its glowing joints'], coreLine: 'Its joints still run searing hot under pressure.' },
    335: { noun: 'frost cat', features: ['its pale blue-white fur', 'its crystalline whiskers', 'its blurring speed'], coreLine: 'It still streaks past faster than the eye follows.' },
    336: { noun: 'shock viper', features: ['its yellow-and-purple banded scales', 'its charged coils', 'its venom fangs'], coreLine: 'A charge still builds along its tensed coils.' },
    337: { noun: 'ash golem', features: ['its cooling basalt body', 'its magma-bright cracks', 'the ash it sheds'], coreLine: 'Cinders still drift from its cracked body.' },
    338: { noun: 'ice raptor', features: ['its never-melting ice talons', 'its broad wings', 'its frost-curved feathers'], coreLine: 'Its talons still grip in unmelting ice.' },
    339: { noun: 'volt beetle', features: ['its polished static-charged elytra', 'its squat armoured body', 'its buzzing flight'], coreLine: 'Static still builds across its glossy shell.' },
    340: { noun: 'psychic crystal', features: ['its irregular shifting facets', 'its floating form', 'its reflecting faces'], coreLine: 'Its faces still reshape themselves in the air.' },
    341: { noun: 'monolith', features: ['its worn carved surface', 'its glowing ancient runes', 'its floating bulk'], coreLine: 'Its carvings still light when it reaches out.' },
    342: { noun: 'wraith-king', features: ['its crown of black flame', 'its spectral regal form', 'its commanding presence'], coreLine: 'Lesser ghosts still bow before it.' },
    343: { noun: 'shadow wraith', features: ['its body of living shadow', 'its two luminous violet eyes', 'its shifting silhouette'], coreLine: 'Its form still tears free of any cast light.' },
    344: { noun: 'glimmer-wisp', features: ['its flickering glowing body', 'its translucent wings', 'its phasing form'], coreLine: 'It still winks between seen and unseen.' },
    345: { noun: 'void raven', features: ['its light-swallowing black plumage', 'its dim crimson eyes', 'its shadow-coiled wake'], coreLine: 'A visible darkness still pools around it.' },
    346: { noun: 'astral form', features: ['its body of solidified psychic energy', 'its luminous wings', 'its radiant outline'], coreLine: 'It still glides on wings of pure thought.' },
    347: { noun: 'forge golem', features: ['its superheated steel body', 'its white-hot joints', 'its forged frame'], coreLine: 'Its seams still glow forge-bright with heat.' },
    348: { noun: 'gale swift', features: ['its long swept-back wings', 'the cyclone whirling around it', 'its sleek body'], coreLine: 'A private gale still churns wherever it flies.' },
    349: { noun: 'ice fortress', features: ['its layered ice-and-granite body', 'its tower-like form', 'its battlement ridges'], coreLine: 'It still stands like a keep that learned to walk.' },
    350: { noun: 'forest iguana', features: ['its polished dark-wood scales', 'its crest of living ferns', 'its bark-hard hide'], coreLine: 'Plants still surge to life where it treads.' },
    351: { noun: 'prism marsupial', features: ['its prism-fractured light body', 'its faceted form', 'its glowing pouch'], coreLine: 'Light still splinters through its fractured frame.' },
    352: { noun: 'void-lord', features: ['its body of solidified void', 'its crown of hovering fragments', 'its imperious form'], coreLine: 'Nearby thought still bends toward its will.' },
    353: { noun: 'fire salamander', features: ['its magma-slick toxic hide', 'its glowing seams', 'its colossal frame'], coreLine: 'Its breath could still run stone to liquid.' },
    354: { noun: 'rift whale', features: ['its colossal whale body', 'its luminous psychic sigils', 'its slow vast glide'], coreLine: 'Its sigils still light as it folds the deep.' },
    355: { noun: 'abyssal eel', features: ['its refracting black scales', 'its bioluminescent lures', 'its armoured length'], coreLine: 'Its lures still glimmer to draw in prey.' },
    356: { noun: 'thunderbird', features: ['its chrome-blue plumage', 'its wings of crackling lightning', 'its commanding bulk'], coreLine: 'The sky still darkens when it takes wing.' },
    357: { noun: 'iron tree', features: ['its steel-alloy branches', 'its ancient towering trunk', 'its deep iron roots'], coreLine: 'It still stands rooted like an iron-boned elder.' },
    358: { noun: 'solar phoenix', features: ['its feathers of solidified flame', 'its crown of solar fire', 'its radiant form'], coreLine: 'Its thoughts still flare into visible flame.' },
    359: { noun: 'ice sovereign', features: ['its body of deep blue glacial ice', 'its carved idealised form', 'its cold gaze'], coreLine: 'A profound stillness still surrounds it.' },
    360: { noun: 'dusk entity', features: ['its angle-shifting form', 'its half of radiant thought', 'its half of pure dark'], coreLine: 'It still shows a different face from every side.' },
    361: { noun: 'island-turtle', features: ['its shell of compacted tectonic plates', 'the moss and stone across its back', 'its colossal length'], coreLine: 'Whole ecosystems still cling to its back.' },
    362: { noun: 'moonlight wraith', features: ['its silhouette of condensed moonlight', 'its blurred shifting edges', 'its pale glow'], coreLine: 'It still wavers like moonlight on water.' },
    363: { noun: 'colour-cycling ovoid', features: ['its smooth ovoid body', 'its endlessly cycling colours', 'its calm form'], coreLine: 'Its surface still drifts through every hue.' },
    364: { noun: 'deep crustacean', features: ['its bio-steel carapace', 'its pressure-sensor array', 'its broad body'], coreLine: 'It still withstands the crushing deep.' },
    365: { noun: 'cinder king', features: ['its regal bipedal form', 'its crown of black fire', 'its smouldering presence'], coreLine: 'It still rules its fiery domain by right.' },
    366: { noun: 'rune-lance', features: ['its elongated alien-metal body', 'its carved psychic runes', 'its bladed length'], coreLine: 'Its runes still hum when it wills it.' },
    367: { noun: 'sea-stack creature', features: ['its tide-carved stone body', 'the water flowing through it', 'its towering frame'], coreLine: 'The tide still pours endlessly through it.' },
    368: { noun: 'will-o-wisp', features: ['its floating flame body', 'the spectral face in its core', 'its drifting light'], coreLine: 'A dim face still flickers within its flame.' },
    369: { noun: 'gravity stone', features: ['its psychically compressed stone body', 'its hovering bulk', 'its warping pull'], coreLine: 'Gravity still bends in the space around it.' },
    370: { noun: 'electro vortex', features: ['its self-sustaining vortex body', 'its electromagnetic core', 'its roaring spin'], coreLine: 'It still holds itself together as pure storm.' },
    371: { noun: 'null entity', features: ['its perfect matte-black body', 'its featureless surface', 'its shifting outline'], coreLine: 'No light still escapes its lightless skin.' },
    372: { noun: 'prism chameleon', features: ['its colour-cycling scales', 'its refracting hide', 'its grasping tail and turret eyes'], coreLine: 'Light still bends and splits across its scales.' },
    373: { noun: 'void-rift entity', features: ['its half-here body', 'its void-torn edges', 'its flickering form'], coreLine: 'Part of it still hangs in the space between.' },
    374: { noun: 'aurora walrus', features: ['its aurora-glowing hide', 'its green-violet-gold glow', 'its short ivory tusks'], coreLine: 'Auroral light still ripples down its hide.' },
    375: { noun: 'current serpent', features: ['its body of looping current', 'its crackling form', 'its fluid coils'], coreLine: 'It still flows as a closed circuit of lightning.' },
    376: { noun: 'solar entity', features: ['its body of solar plasma', 'its searing radiance', 'its blazing form'], coreLine: 'It still burns hotter the closer one draws.' },
    377: { noun: 'core golem', features: ['its ultra-dense alloy body', 'its crushing weight', 'its compressed frame'], coreLine: 'It still carries the weight of a planet’s core.' },
    378: { noun: 'dream entity', features: ['its barely-there shimmer', 'its dreamlike form', 'its half-seen shape'], coreLine: 'It still shows itself only to the half-asleep.' },
    379: { noun: 'rift kelpie', features: ['its half-solid half-ghostly hide', 'its streaming spectral mane', 'its phasing equine form'], coreLine: 'Half of it still refuses to be quite real.' },
    380: { noun: 'tempest vortex', features: ['its self-sustaining storm body', 'its lightning nucleus', 'its howling winds'], coreLine: 'Weather still bends around its turning core.' },
    381: { noun: 'crystal polyhedron', features: ['its geometric crystal body', 'its steel-laced facets', 'its precise form'], coreLine: 'Its facets still pulse with ordered thought.' },
    382: { noun: 'oblivion raven', features: ['its light-absorbing wings', 'its black-feathered body', 'its vast shadow'], coreLine: 'Its shadow still falls darker than night.' },
    383: { noun: 'steel swordfish', features: ['its folded ultra-steel body', 'its razor-edged surfaces', 'its long sword-bill'], coreLine: 'Every edge of it could still part steel.' },
    384: { noun: 'sun entity', features: ['its compressed solar-plasma body', 'its permanent coronal crown', 'its blinding glow'], coreLine: 'A small star’s heat still pours off it.' },
    385: { noun: 'glacier golem', features: ['its glacial-boulder body', 'its frost-sheathed limbs', 'its frozen ground-aura'], coreLine: 'The ground still freezes deep beneath it.' },
    386: { noun: 'storm wraith', features: ['its translucent between-strikes form', 'its lightning-borne body', 'its crackling edges'], coreLine: 'It still rides the lightning between strikes.' },
    387: { noun: 'abyssal void', features: ['its featureless absolute-black body', 'its light-swallowing surface', 'its vast bulk'], coreLine: 'No light still returns from its dark depths.' },
    388: { noun: 'time-stone', features: ['its massive standing-stone body', 'its layered strata', 'its frozen-moment runes'], coreLine: 'Each stratum still holds a sealed moment.' },
    389: { noun: 'crowned thunderbird', features: ['its permanent lightning crown', 'its charged plumage', 'its dominant bulk'], coreLine: 'It still cows every lesser storm-creature near.' },
    390: { noun: 'venom garden', features: ['its body of venomous flowers', 'its dark thorned vines', 'its humanoid form'], coreLine: 'Toxic blooms still open and wither across it.' },
    391: { noun: 'behemoth', features: ['its impossibly vast body', 'its ancient apex frame', 'its earth-shaking tread'], coreLine: 'The ground still shakes with each of its steps.' },
    392: { noun: 'eon sphinx', features: ['its deep-time iridescent mane', 'its vision-filled eyes', 'its ageless frame'], coreLine: 'Ages still seem to turn behind its eyes.' },
    393: { noun: 'null storm', features: ['its contained electromagnetic storm', 'its dark nucleus', 'its crackling shell'], coreLine: 'Electronics still die in the field around it.' },
    394: { noun: 'solar griffin', features: ['its star-hot plumage', 'its blazing body', 'its immense frame'], coreLine: 'Its plumage still burns like a star’s surface.' },
    395: { noun: 'glacier walrus', features: ['its ancient glacial-ice hide', 'its vast tusked body', 'its slow ponderous frame'], coreLine: 'Ages of ice still armour its hide.' },
    396: { noun: 'lightning idol', features: ['its living-metal bolt shape', 'its near-perfect conductance', 'its jagged frame'], coreLine: 'Charge still races flawlessly through it.' },
    397: { noun: 'spectral leviathan', features: ['its massive spectral body', 'its trailing ghostly sea-wrack', 'its phasing bulk'], coreLine: 'It still glides unseen beneath the waves.' },
    398: { noun: 'void-crowned entity', features: ['its crown of void and fairy-light', 'its half-radiant half-dark face', 'its regal form'], coreLine: 'Light and void still divide it down the middle.' },
    399: { noun: 'mountain spirit', features: ['its craggy peak-like body', 'its translucent interior', 'its towering bulk'], coreLine: 'It is still the living spirit of its mountain.' },
    400: { noun: 'primordial titan', features: ['its body of cooling lava and deep rock', 'its molten seams', 'its ancient bulk'], coreLine: 'The first heat of the world still smoulders in it.' },
    401: { noun: 'cosmic veil', features: ['its body of condensed starlight', 'its cosmic shimmer', 'its drifting form'], coreLine: 'It still carries the cold of distant stars.' },
    402: { noun: 'psychic dragonet', features: ['its iridescent scales', 'its faint psychic pulse', 'its tiny frame'], coreLine: 'Its scales still flicker when it uses its mind.' },
    403: { noun: 'mind-dragon', features: ['its permanently gleaming scales', 'its psychokinetic field', 'its lean body'], coreLine: 'Objects still drift in its silent field.' },
    404: { noun: 'veil-dragon', features: ['its crystallised refracting wings', 'its gleaming scales', 'its long body'], coreLine: 'Its wings still split light into shifting veils.' },
    405: { noun: 'shadow puppy', features: ['its shadowy little body', 'its razor steel claws', 'its eager frame'], coreLine: 'It still bounds about on needle-clawed paws.' },
    406: { noun: 'shadow-steel hound', features: ['its body of woven shadow-fibre', 'its steel-hard edges', 'its dark frame'], coreLine: 'Its shadow-woven hide still turns blades.' },
    407: { noun: 'void warden', features: ['its condensed void-matter body', 'its ultra-steel exoskeleton', 'its imposing frame'], coreLine: 'It still stands guard, dense as a collapsed star.' },
    408: { noun: 'gem sprite', features: ['its cloudy quartz body', 'its raw crystal facets', 'its faint ley-light glow'], coreLine: 'Ley-light still glimmers faintly within it.' },
    409: { noun: 'gem tortoise', features: ['its annealed gemstone plates', 'its faceted shell', 'its slow gait'], coreLine: 'Its shell still cuts the light into facets.' },
    410: { noun: 'crystal tortoise', features: ['its centuries-old crystal shell', 'its colossal frame', 'its prismatic glow'], coreLine: 'Light still pours in rainbows from its ancient shell.' },
    411: { noun: 'quill-runner', features: ['its hollow vibrating quills', 'its flightless body', 'the buzzing wake it throws'], coreLine: 'Its quills still hum as it runs.' },
    412: { noun: 'echo runner', features: ['its scaled draconic hide', 'its long running legs', 'its sounding crest'], coreLine: 'Its strides still throw a wake of sound.' },
    413: { noun: 'resonant saurian', features: ['its hollow keratin casque', 'its towering frame', 'its booming call'], coreLine: 'Its casque still amplifies bone-deep booms.' },
    414: { noun: 'toxin grub', features: ['its pale burrowing body', 'its toxin-digesting maw', 'its slow furrows'], coreLine: 'It still ploughs the soil feeding on filth.' },
    415: { noun: 'boring worm', features: ['its rotating ring of mineral teeth', 'its segmented body', 'its grinding maw'], coreLine: 'It still grinds through stone like soft earth.' },
    416: { noun: 'desert leviathan', features: ['its caravan-long body', 'its grinding maw', 'its tremor-sense'], coreLine: 'It still reads footfalls through the deep sand.' },
    417: { noun: 'houseless spirit', features: ['its borrowed wooden fragment', 'its cold drifting presence', 'its faint form'], coreLine: 'It still seeks cast-off things to inhabit.' },
    418: { noun: 'frost marionette', features: ['its jointed frost-glazed wood', 'its dangling limbs', 'its puppet frame'], coreLine: 'It still moves as if on unseen strings.' },
    419: { noun: 'porcelain doll', features: ['its immaculate porcelain face', 'its child-sized frame', 'its drifting glide'], coreLine: 'It still drifts silent through winter halls.' },
    420: { noun: 'mist creature', features: ['its soft foggy body', 'its placid huddling form', 'the warm fog it exhales'], coreLine: 'It still pools gentle fog around itself.' },
    421: { noun: 'geyser beast', features: ['its insulating layer of fat', 'its steam-wreathed hide', 'its lounging bulk'], coreLine: 'It still steams gently in its mineral pools.' },
    422: { noun: 'steam titan', features: ['its mountainous warm bulk', 'its scalding hide', 'its rolling steam'], coreLine: 'Spring-water still flashes to steam on its skin.' },
    423: { noun: 'mineral forager', features: ['its overlapping mineral scales', 'its grit-eating maw', 'its low body'], coreLine: 'It still grows new scales from the ore it eats.' },
    424: { noun: 'ore-veined beast', features: ['its iron-and-copper-veined scales', 'its smelting gut', 'its sturdy frame'], coreLine: 'Veins of raw metal still thread its scales.' },
    425: { noun: 'strata digger', features: ['its laminated stone-and-metal scales', 'its great digging claws', 'its banded hide'], coreLine: 'Each scale still records a layer of its years.' },
    426: { noun: 'brawler hatchling', features: ['its hardened raptorial forelimbs', 'its pugnacious stance', 'its small frame'], coreLine: 'It still spars with anything that moves.' },
    427: { noun: 'mantis duelist', features: ['its bladed forelimbs', 'its calm reading gaze', 'its poised stance'], coreLine: 'It still answers a blow before it is thrown.' },
    428: { noun: 'mantis master', features: ['its honed blade-arms', 'its far-reaching perception', 'its serene poise'], coreLine: 'It still strikes a heartbeat ahead of thought.' },
    429: { noun: 'dream tapir', features: ['its long twitching snout', 'its drowsy half-lidded eyes', 'its placid body'], coreLine: 'It still drifts toward the dreams of sleepers.' },
    430: { noun: 'nightmare tapir', features: ['its darkened hide', 'its dream-supping snout', 'its heavier frame'], coreLine: 'It still wades into nightmares to feed.' },
    431: { noun: 'dream-eater', features: ['its vast deliberate bulk', 'its dream-walking presence', 'its dark form'], coreLine: 'It still steps fully into a sleeper’s mind.' },
    432: { noun: 'primal calf', features: ['its small tusks', 'its unhurried gaze', 'its sturdy frame'], coreLine: 'An ancient calm still steadies it even young.' },
    433: { noun: 'mossback titan', features: ['the moss carpeting its flanks', 'the ferns between its shoulders', 'its slow tread'], coreLine: 'Whole gardens still take root upon it.' },
    434: { noun: 'forest-bearing mammoth', features: ['the ancient forest on its back', 'its colossal tusks', 'its mountainous bulk'], coreLine: 'It still carries a forest older than the gyms.' },
    435: { noun: 'stone-fist creature', features: ['its mineral-callused fists', 'its rocky hide', 'its sturdy arms'], coreLine: 'It still hardens its fists against bare stone.' },
    436: { noun: 'crag brawler', features: ['its accreted mineral forearms', 'its rocky knuckles', 'its broad shoulders'], coreLine: 'It still cracks and regrows its stone gauntlets.' },
    437: { noun: 'highland goliath', features: ['its armour of living rock', 'its mountainous muscle', 'its towering frame'], coreLine: 'It still leads the highland troops unchallenged.' },
    438: { noun: 'chime nymph', features: ['its glassy chiming wings', 'its small body', 'its windchime song'], coreLine: 'Its wings still chime in the faintest breeze.' },
    439: { noun: 'song seraph', features: ['its luminous conducting limbs', 'its woven light-and-sound', 'its radiant form'], coreLine: 'It still conducts chords of light and song.' },
    440: { noun: 'rust mite', features: ['its caustic oozing film', 'its small crawling body', 'the pitted rust it leaves'], coreLine: 'It still corrodes metal and stone in its wake.' },
    441: { noun: 'corrosion centipede', features: ['its charged segments', 'its acid-slick body', 'its many legs'], coreLine: 'Its bite still delivers acid and a jolt at once.' },
    442: { noun: 'fen leech', features: ['its bloated warmth-fed body', 'its sucker-maw', 'the sour fog it vents'], coreLine: 'It still swells on the warmth of larger prey.' },
    443: { noun: 'miasma mass', features: ['its slow swollen bulk', 'its toxin-laden body', 'the creeping fog it exhales'], coreLine: 'It still breathes out a slow, poisoning haze.' },
    444: { noun: 'sentry pup', features: ['its small twitchy body', 'its piercing watch-call', 'its alert ears'], coreLine: 'It still sounds the alarm at the first danger.' },
    445: { noun: 'sentry guard', features: ['its swift strong body', 'its piercing shriek', 'its watchful stance'], coreLine: 'It still backs its alarm with a guard’s ferocity.' },
    446: { noun: 'spore sprout', features: ['its small fungal cap', 'its soft spore-haze', 'its overnight growth'], coreLine: 'It still puffs spores at the first disturbance.' },
    447: { noun: 'walking fungus', features: ['its person-tall cap', 'the spore-fog it vents', 'its rooted gait'], coreLine: 'Spores still take root wherever its fog settles.' },
    448: { noun: 'burrow pup', features: ['its blind questing snout', 'its spade-claws', 'its grit-dusted body'], coreLine: 'It still reads the dark by the grit it shoves.' },
    449: { noun: 'deep digger', features: ['its obsidian claws', 'its vibration-sense', 'its lightless-deep body'], coreLine: 'It still hunts blind in the lightless deep.' },
    450: { noun: 'club-arm crustacean', features: ['its club-like forelimbs', 'its fast snapping strike', 'its armoured body'], coreLine: 'Its strike still cracks shells in a blink.' },
    451: { noun: 'smash-claw crustacean', features: ['its accelerating club-arms', 'the cavitation flash of its strike', 'its armoured frame'], coreLine: 'Its blow still boils the water before it lands.' },
    452: { noun: 'dozing creature', features: ['its ever-drowsing body', 'the moss settled on it', 'its glacial drift'], coreLine: 'It still hangs forever between sleep and waking.' },
    453: { noun: 'dream-haze sloth', features: ['its haze of luminous dreams', 'its canopy-drifting body', 'its gentle aura'], coreLine: 'Its aura still wraps wanderers in soft dreams.' },
    454: { noun: 'bell haunt', features: ['its discarded bell-home', 'its soft self-ringing', 'its unseen presence'], coreLine: 'It still tolls itself softly at odd hours.' },
    455: { noun: 'bell-spirit', features: ['its bronze-and-iron bell-body', 'its gathered spirits', 'its physical toll'], coreLine: 'Its knell still strikes like a physical blow.' },
    456: { noun: 'mist axolotl', features: ['its feathery external gills', 'its pale springwater body', 'the mist it leaves'], coreLine: 'Its gills still trail little curls of mist.' },
    457: { noun: 'thermal axolotl', features: ['its broad fog-breathing gills', 'its regenerative body', 'its warm-pool bulk'], coreLine: 'It still breathes a warm fog across the water.' },
    458: { noun: 'tengu sprite', features: ['its mischievous build', 'its wind-drilled martial forms', 'its quick limbs'], coreLine: 'It still trains its forms against the mountain gales.' },
    459: { noun: 'tengu master', features: ['its wind-wreathed fists', 'its martial bearing', 'its swept feathers'], coreLine: 'It still calls the mountain wind to its blows.' },
    460: { noun: 'singing bowl', features: ['its votive metal bowl-body', 'its hovering drift', 'its meditative ring'], coreLine: 'Generations of prayer still ring within it.' },
    461: { noun: 'bell-tower construct', features: ['its nested singing-bowls', 'its many-noted ring', 'its towering form'], coreLine: 'Its layered tones still resonate as one chord.' },
    462: { noun: 'divine messenger', features: ['its crystalline feathered wings', 'its halo of soft light', 'its aura of lost things'], coreLine: 'It still seeks out those who have lost something dear.' },
    463: { noun: 'constellation swan', features: ['its living-crystal body', 'its constellation of star-points', 'its prismatic light'], coreLine: 'Light still bends into rainbows through its body.' },
    464: { noun: 'six-winged seraph', features: ['its starlight-crystal armor', 'its three pairs of radiant wings', 'its halo of orbiting shards'], coreLine: 'It still mourns as the last of its kind.' },
    465: { noun: 'temporal assassin', features: ['its segmented black-plated limbs', 'its twin blade-arms', 'its trailing time-echoes'], coreLine: 'It still strikes from the gap between moments.' },
    466: { noun: 'darkfire warrior', features: ['its lightless darkfire flames', 'its cracked obsidian armor', 'its dying-ember eyes'], coreLine: 'Its darkfire still burns without giving any light.' },
    467: { noun: 'frozen judge', features: ['its pale crystal form', 'its stopped clock-face', 'its motionless hanging dust'], coreLine: 'It still stands frozen at the instant the world ended.' },
    468: { noun: 'tesla-coil beast', features: ['its crackling coil spine', 'its crystalline insulator plates', 'its leaping arcs'], coreLine: 'Charge still flows through it without any loss.' },
    469: { noun: 'petrified-lightning beast', features: ['its fulgurite-glass limbs', 'its strata-scarred core', 'its frozen arcs'], coreLine: 'Its body still holds lightning struck ages ago.' },
    470: { noun: 'storm-titan', features: ['its cyclone-funnel body', 'its storm-cloud mane', 'its lightning-vein eyes'], coreLine: 'It still commands respect without any title.' },
    471: { noun: 'primordial mandrake', features: ['its gnarled root body', 'its toxin-laced bark', 'its seed-stone heart'], coreLine: 'It still whispers what the mountains are thinking.' },
    472: { noun: 'walking geode', features: ['its cracked-open crystal core', 'its mountain-stone hide', 'its colossal tread'], coreLine: 'It still moves like a mountain that chose to walk.' },
    473: { noun: 'earth-titan', features: ['its magma-veined body', 'its mountain-shard crown', 'its world-bearing arms'], coreLine: 'Its strength still feels too large for words.' },
    474: { noun: 'ocean oracle', features: ['its luminous sleek body', 'its glowing foresight-eye', 'its trailing time-ripples'], coreLine: 'It still seems to know what has not yet happened.' },
    475: { noun: 'abyssal anglerfish', features: ['its armored deep-sea body', 'its glowing void-star lure', 'its needle-toothed maw'], coreLine: 'Its lure still draws prey gently into the dark.' },
    476: { noun: 'ocean leviathan', features: ['its vast serpentine body', 'its coral-and-shell crest', 'its tide-commanding presence'], coreLine: 'The sea still seems to part around it.' },
    477: { noun: 'wind-chime spirit', features: ['its near-formless veil', 'its singing chimes', 'its weightless drift'], coreLine: 'The air still moves as if to greet it.' },
    478: { noun: 'storm harpy', features: ['its crystalline resonant feathers', 'its broad raptor wings', 'its keen wind-reading eyes'], coreLine: 'Its feathers still hum with coming weather.' },
    479: { noun: 'sky roc', features: ['its city-block wingspan', 'its star-flecked feathers', 'its restless wings'], coreLine: 'It still refuses ever to touch the ground.' },
    480: { noun: 'nemean lion', features: ['its bronze-and-crystal mane', 'its molten-seamed hide', 'its iron-shearing claws'], coreLine: 'Its claws still hold a freshly-sharpened edge.' },
    481: { noun: 'ember sabertooth', features: ['its ash-striped pelt', 'its oversized glowing fangs', 'its ever-burning wounds'], coreLine: 'It still answers to no one but itself.' },
    482: { noun: 'magma dragon', features: ['its obsidian-plated body', 'its molten-core cracks', 'its diamond-melting breath'], coreLine: 'It still keeps the loyalty it learned as a hatchling.' },
    483: { noun: 'ice-steel fox', features: ['its crystalline ice-steel plating', 'its sleek white pelt', 'its frost-rimmed tail'], coreLine: 'Its ice-steel still holds an impossible edge.' },
    484: { noun: 'doom-wolf', features: ['its dark frost-rimed fur', 'its cold patient gaze', 'its silent stalk'], coreLine: 'Warmth still drains from all it stalks.' },
    485: { noun: 'frost-giant', features: ['its jagged ice-and-stone body', 'its glacier-shard crown', 'its blizzard breath'], coreLine: 'A whole continent of cold still answers to it.' },
    486: { noun: 'dream dragon', features: ['its smoke-and-starlight body', 'its trailing dreamed worlds', 'its clock-glyph mane'], coreLine: 'In its dream, the lost home still stands.' },
    487: { noun: 'moonlight fairy', features: ['its pale silver-light body', 'its crescent-veined wings', 'its glowing moon-pool orb'], coreLine: 'It still pours moonlight into still water by night.' },
    488: { noun: 'dream-god', features: ['its twilight-cloth robes', 'its starry void face', 'its rivers of dream-sand'], coreLine: 'In the dream it pours, the lost home still stands.' },
    489: { noun: 'armored titan', features: ['its crystalline-metal plating', 'its fused ore club-tail', 'its unshakable stance'], coreLine: 'It still stands unmoved by almost anything.' },
    490: { noun: 'forge-smith spirit', features: ['its molten forge-core chest', 'its anvil shoulders', 'its halo of sparks'], coreLine: 'It could still forge a blade worth a kingdom.' },
    491: { noun: 'bronze colossus', features: ['its riveted bronze body', 'its glowing core-seam', 'its great tower shield'], coreLine: 'It still does its duty without complaint.' },
    492: { noun: 'clockwork seer', features: ['its turning brass gears', 'its stopwatch-face head', 'its projected next moves'], coreLine: 'It still calculates the odds of everything.' },
    493: { noun: 'hourglass spirit', features: ['its falling-sand core', 'its time-frozen motes', 'its soft halo'], coreLine: 'The moments it hoards still defy any measure.' },
    494: { noun: 'time-titan', features: ['its star-mantle', 'its clockwork-gear halo', 'its beard of falling sand'], coreLine: 'It alone still carries no memory of the loss.' },
    495: { noun: 'silence wraith', features: ['its hooded null-form', 'its light-dimming aura', 'its guttering stars'], coreLine: 'Whether it helps or harms is still never clear.' },
    496: { noun: 'living silhouette', features: ['its pure-black cut-out form', 'its star-flecked void interior', 'its warping edges'], coreLine: 'A piece of the collapse still clings to it.' },
    497: { noun: 'void-serpent', features: ['its starless black scales', 'its constellation-swallowing maw', 'its trailing dead stars'], coreLine: 'Fear of it is still the only reasonable response.' },
    498: { noun: 'living star-chart', features: ['its rotating celestial-globe body', 'its brass meridian-rings', 'its mapped night sky'], coreLine: 'Its star-patterns still shift before great events.' },
    499: { noun: 'supernova beast', features: ['its ash-shelled ember core', 'its erupting shockwave rings', 'its radiant plasma plumes'], coreLine: 'Its hatching is still bound to that fateful day.' },
    500: { noun: 'star-spirit', features: ['its blazing star-shard core', 'its nebula-light robes', 'its crown of orbiting starlight'], coreLine: 'It is still the last wonder its lost home produced.' }
  };
  function autoAnchor(def) {
    return { noun: 'creature',
             features: ['its outline', 'its hide', 'its frame'],
             coreLine: 'Something of the original ' + def.name + ' persists beneath the distortion.' };
  }
  function anchorFor(def) { return ANCHORS[def.id] || autoAnchor(def); }

  /* ---- helpers ---- */
  function typeWord(types) { return types.join('/'); }
  function aOrAn(phrase) { return /^[AEIOU]/.test(phrase) ? 'an' : 'a'; }
  function bodyClause(types, rng) {
    // prefer a clause from the first authored type; blend a second if present & authored
    const authored = types.filter(t => TYPE_BODY[t]);
    if (!authored.length) return 'warped it past easy recognition';
    return pick(rng, TYPE_BODY[pick(rng, authored)]);
  }
  function tellClause(types, rng) {
    const authored = types.filter(t => TYPE_TELL[t]);
    return authored.length ? TYPE_TELL[pick(rng, authored)] : '';
  }

  /* ---- composition ---- */
  function buildLore(def, v, rng) {
    const a = anchorFor(def);
    const types = v.variantTypes || def.types;
    const prof = statProfile(def, v.variantBase);
    const feature = pick(rng, a.features);

    const tw = typeWord(types);
    const openFrames = [
      `The Rift has ${bodyClause(types, rng)}, recasting this ${def.name} as ${aOrAn(tw)} ${tw} aberration.`,
      `Distortion has ${bodyClause(types, rng)}; what was once a familiar ${a.noun} is now something ${tw} and wrong.`,
      `Whatever passed through the Rift ${bodyClause(types, rng)}, leaving ${aOrAn(tw)} ${tw} echo of the original ${def.name}.`
    ];
    const featureFrames = [
      `The change shows first in ${feature}.`,
      `Look closely, and the giveaway is ${feature}.`,
      `The distortion reads most plainly in ${feature}.`
    ];
    const sentences = [
      pick(rng, openFrames),
      pick(rng, featureFrames),
      a.coreLine,
      comparisonClause(def, v, rng),   // explicit contrast with its ordinary self
    ];
    if (tellClause(types, rng)) sentences.push(tellClause(types, rng));
    if (v.variantImmune) sentences.push(immuneClause(types, v.variantImmune, rng));
    return sentences.filter(Boolean).join(' ');
  }

  const DESC_ADJ = {
    swift: 'flickering, restless', brute: 'hard-knuckled, graceless', caster: 'simmering, stand-off',
    bulwark: 'swollen, obdurate', even: 'subtly wrong'
  };
  function buildDesc(def, v, rng) {
    const c = compareParts(def, v);
    const adj = DESC_ADJ[c.vl];
    const frames = c.same ? [
      `A ${adj} ${c.varT} ${def.name} — its kin's ${c.npB} build kept, but recoloured from ${c.normT}.`,
      `Still ${c.vp} like any ${def.name}, yet ${c.varT} where its kin run ${c.normT}.`
    ] : [
      `A ${adj} ${c.varT} ${def.name} where its kin run ${c.normT} — a ${c.vpB} now, not a ${c.npB}.`,
      `Unlike the usual ${c.normT} ${def.name}, this one is ${c.varT} and fights as ${c.vp}.`,
      `A ${def.name} remade from a ${c.normT} ${c.npB} into a ${adj} ${c.varT} ${c.vpB}.`,
      `This ${def.name} trades a ${c.normT} ${c.npB} frame for a ${c.varT} ${c.vpB} one.`
    ];
    return pick(rng, frames);
  }

  function buildBehaviour(def, v, rng) {
    const c = compareParts(def, v);
    const base = pick(rng, DRIFT_BEHAVIOUR[c.vl]);
    const frames = c.same ? [
      `Like a normal ${def.name} it ${c.vt}, but with the Rift's edge behind every move.`,
      `${base} — much as an ordinary ${def.name} would, only sharper.`
    ] : [
      `Where an ordinary ${def.name} ${c.nt}, this one ${c.vt}.`,
      `A normal ${def.name} ${c.nt}; this one ${c.vt} instead.`,
      `Forget how a normal ${def.name} ${c.nt} — this one ${c.vt}.`,
      `${base} A wild ${def.name} ${c.nt} instead.`
    ];
    return pick(rng, frames);
  }

  function generate(def, v) {
    if (!v || !v.variant) return null;
    const rng = makeRng(v, def);
    return {
      desc: buildDesc(def, v, rng),
      lore: buildLore(def, v, rng),
      behaviour: buildBehaviour(def, v, rng)
    };
  }

  /* ===========================================================================
   * LEARNSET / MOVESET generation
   * Rules (locked with design):
   *  - move COUNT = round(N × (1 ± random 0–20%)), 50/50 direction (N = original count)
   *  - per-move LEVEL = original level × (1 ± random 0–30%), per-move 50/50; Lv1 stays 1;
   *    sorted ascending and forced strictly-increasing
   *  - extra moves (M>N): appended past the last level with RANDOMISED gaps
   *  - fewer moves (M<N): RANDOM moves dropped (not just the top)
   *  - move pool: 2/3 in-type, 1/3 off-type; ordered weak→strong; ≥1 damaging move;
   *    excludes legendary/signature moves and ultimate nukes
   *  - all deterministic from the same seed as the flavour text
   * =========================================================================*/
  const BATTLE_TYPES = ['Normal','Fire','Aquatic','Nature','Electric','Ice','Fighting','Poison',
    'Earth','Wind','Mental','Bug','Rock','Spectral','Draconic','Dark','Metal','Fairy','Toxin',
    'Vapor','Mineral','Dream','Sonic','Stellar','Crystal','Primal'];

  let _pools = null; // { byType:{Type:[ids]}, allowed:Set }
  function buildPools() {
    if (_pools) return _pools;
    const MD = (typeof MOVES_DATA !== 'undefined') ? MOVES_DATA : {};
    const MON = (typeof MONSTERS_DATA !== 'undefined') ? MONSTERS_DATA : {};
    // learners per move + their rarities
    const learners = {};
    for (const id in MON) {
      const def = MON[id]; if (!def.learnset) continue;
      const seen = new Set();
      for (const e of def.learnset) {
        if (typeof e[1] === 'string') seen.add(e[1]);
        if (e.length >= 3 && Array.isArray(e[2])) seen.add(e[2][1]);
      }
      for (const mv of seen) (learners[mv] = learners[mv] || []).push(def.rarity || 'common');
    }
    const RESTRICTED = new Set(['legendary', 'mythical']);
    const allowed = new Set();
    const byType = {};
    for (const mv in MD) {
      const m = MD[mv];
      if (!m || !BATTLE_TYPES.includes(m.type)) continue;          // real creature-type moves only
      if (m.effect === 'recharge' || (m.power || 0) >= 130) continue; // ultimate nukes
      const rs = learners[mv];
      if (rs && rs.length && rs.every(r => RESTRICTED.has(r))) continue; // legendary signatures
      allowed.add(mv);
      (byType[m.type] = byType[m.type] || []).push(mv);
    }
    _pools = { byType, allowed, MD };
    return _pools;
  }

  function origLevelPairs(def) {
    const pairs = [];
    const seen = new Set();
    for (const e of def.learnset || []) {
      if (typeof e[0] === 'number' && typeof e[1] === 'string' && !seen.has(e[1])) { seen.add(e[1]); pairs.push(e[0]); }
      if (e.length >= 3 && Array.isArray(e[2]) && !seen.has(e[2][1])) { seen.add(e[2][1]); pairs.push(e[2][0]); }
    }
    return pairs.sort((a, b) => a - b);
  }

  function shuffle(rng, arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function generateLearnset(def, v) {
    const rng = makeRng(v, def);
    const pools = buildPools();
    const MD = pools.MD;
    const types = (v.variantTypes && v.variantTypes.length) ? v.variantTypes : def.types;
    const baseLevels = origLevelPairs(def);
    const N = baseLevels.length || 1;

    // 1. target count M = N × (1 ± 0–20%)
    const dirC = rng() < 0.5 ? -1 : 1;
    const M = Math.max(1, Math.round(N * (1 + dirC * rng() * 0.20)));

    // 2. choose which levels structure to use
    let levels;
    if (M <= N) {
      const keep = shuffle(rng, baseLevels.map((_, i) => i)).slice(0, M).sort((a, b) => a - b);
      levels = keep.map(i => baseLevels[i]);
    } else {
      levels = baseLevels.slice();
      let last = baseLevels[N - 1];
      const avgGap = N > 1 ? (baseLevels[N - 1] - baseLevels[0]) / (N - 1) : 6;
      for (let k = 0; k < M - N; k++) {
        last += Math.max(2, Math.round(avgGap * (0.5 + rng()))); // 0.5×–1.5× avg, randomised
        levels.push(last);
      }
    }

    // 3. scale each level ±0–30% (Lv1 anchored), then sort + force strictly increasing
    levels = levels.map(lv => {
      if (lv <= 1) return 1;
      const d = rng() < 0.5 ? -1 : 1;
      return Math.max(2, Math.round(lv * (1 + d * rng() * 0.30)));
    }).sort((a, b) => a - b);
    for (let i = 1; i < levels.length; i++) if (levels[i] <= levels[i - 1]) levels[i] = levels[i - 1] + 1;

    // 4. pick moves: 2/3 in-type, 1/3 off-type, ≥1 damaging, weak→strong
    const inPool = [];
    const inSeen = new Set();
    for (const t of types) for (const mv of (pools.byType[t] || [])) if (!inSeen.has(mv)) { inSeen.add(mv); inPool.push(mv); }
    const offPool = [...pools.allowed].filter(mv => !inSeen.has(mv));
    const nIn = Math.min(inPool.length, Math.round(M * 2 / 3));
    const nOff = M - nIn;
    let chosen = shuffle(rng, inPool).slice(0, nIn).concat(shuffle(rng, offPool).slice(0, nOff));
    // top up if pools were short
    if (chosen.length < M) {
      const rest = shuffle(rng, [...pools.allowed].filter(mv => !chosen.includes(mv)));
      chosen = chosen.concat(rest.slice(0, M - chosen.length));
    }
    chosen = chosen.slice(0, levels.length);
    // guarantee ≥1 damaging move
    if (!chosen.some(mv => (MD[mv] && MD[mv].power > 0))) {
      const dmgIn = shuffle(rng, inPool).find(mv => MD[mv] && MD[mv].power > 0);
      if (dmgIn) chosen[chosen.length - 1] = dmgIn;
    }
    // order weak→strong (status power 0 sorts early, mimicking a natural curve)
    chosen.sort((a, b) => (MD[a].power || 0) - (MD[b].power || 0));

    return levels.map((lv, i) => [lv, chosen[i]]).filter(p => p[1]);
  }

  // 4 moves known at a given level — same rule the base game uses (last-4 of learnt moves)
  function generateBattleMoves(def, v, level) {
    const ls = generateLearnset(def, v);
    const known = ls.filter(p => p[0] <= level).map(p => p[1]);
    const out = (known.length ? known : [ls[0] && ls[0][1]]).slice(-4).filter(Boolean);
    return out.length ? out : ['tackle'];
  }

  const API = { generate, statProfile, variantSignature, generateLearnset, generateBattleMoves, _hashStr: hashStr };
  global.VariantContent = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
