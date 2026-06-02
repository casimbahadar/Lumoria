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
    Mental: 'Those near it report half-heard whispers afterward.'
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
    }
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
    ];
    const heft = HEFT_CLAUSE[prof.heft];
    if (heft) sentences.push(heft);
    sentences.push(pick(rng, DRIFT_LORE[prof.label]));
    if (tellClause(types, rng)) sentences.push(tellClause(types, rng));
    if (v.variantImmune) sentences.push(immuneClause(types, v.variantImmune, rng));
    return sentences.filter(Boolean).join(' ');
  }

  function buildDesc(def, v, rng) {
    const types = v.variantTypes || def.types;
    const prof = statProfile(def, v.variantBase);
    const adj = {
      swift: 'A flickering, restless', brute: 'A hard-knuckled, graceless',
      caster: 'A simmering, stand-off', bulwark: 'A swollen, obdurate', even: 'A subtly wrong'
    }[prof.label];
    const tail = {
      swift: 'that moves before the eye can follow', brute: 'that would rather hit than think',
      caster: 'that fights from a wary distance', bulwark: 'that endures almost anything',
      even: 'whose nature refuses to settle'
    }[prof.label];
    return `${adj} ${typeWord(types)} ${def.name} ${tail}.`;
  }

  function buildBehaviour(def, v, rng) {
    const prof = statProfile(def, v.variantBase);
    return pick(rng, DRIFT_BEHAVIOUR[prof.label]);
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

  const API = { generate, statProfile, variantSignature, _hashStr: hashStr };
  global.VariantContent = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
