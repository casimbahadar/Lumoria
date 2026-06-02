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
    129: { // Voidaxis
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
    17: { noun: 'crag dragon', features: ['its scarlet-and-black scales', 'its blunt backward-swept horns', 'its coiling length'], coreLine: 'It still coils around prey before it strikes.' },
    18: { noun: 'mountain serpent', features: ['its amber-and-black armour scales', 'its great coiling body', 'its spire-wound perch'], coreLine: 'It sleeps coiled about the high rocky spires.' },
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
    30: { noun: 'reef leviathan', features: ['its silver-blue streamlined body', 'its prism-scattering scales', 'its hidden retracted spines'], coreLine: 'Ocean life still stills under its single glance.' }
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
