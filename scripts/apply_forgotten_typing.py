#!/usr/bin/env python3
"""Apply the Forgotten Lumori typing/archetype/appearance audit to js/data.js.

- new types per id (per-wielder theme + cross/mono/uniqueness design)
- new emojis
- 486<->488 identity swap (names + fields swap; base-stat spreads stay with the slot)
- essential desc/lore rewrites (only where the text contradicted the new identity)
- adds an `appearance:` field to every Forgotten entry
- removes the resolved `// LORE-AUDIT FLAG (Step 4)` comment lines
"""
import re, io

TYPES = {
462:'"Aether","Primal"',463:'"Crystal","Stellar"',464:'"Aether","Crystal"',
465:'"Dark","Chrono"',466:'"Dark","Primal"',467:'"Crystal","Chrono"',
468:'"Electric","Crystal"',469:'"Electric","Chrono"',470:'"Electric","Primal"',
471:'"Poison","Primal"',472:'"Crystal","Primal"',473:'"Primal","Fighting"',
474:'"Aquatic","Chrono"',475:'"Aquatic","Stellar"',476:'"Aquatic","Primal"',
477:'"Aether"',478:'"Wind","Crystal"',479:'"Wind","Stellar"',
480:'"Fire","Crystal"',481:'"Fire","Chrono"',482:'"Draconic","Primal"',
483:'"Ice","Crystal"',484:'"Ice","Chrono"',485:'"Ice","Primal"',
486:'"Dream","Chrono"',487:'"Stellar","Dream"',488:'"Dream","Aether"',
489:'"Metal","Crystal"',490:'"Metal","Aether"',491:'"Metal","Chrono"',
492:'"Chrono"',493:'"Aether","Chrono"',494:'"Chrono","Primal"',
495:'"Stellar","Spectral"',496:'"Chrono","Stellar"',497:'"Primal","Stellar"',
498:'"Aether","Stellar"',499:'"Stellar","Sonic"',500:'"Stellar"',
}

EMOJI = {
462:"🕊️",463:"🦢",464:"👼",465:"🗡️",466:"🌑",467:"⏸️",468:"🌩️",469:"🔮",470:"🌀",
471:"🌿",472:"🗻",473:"🌋",474:"🐬",475:"🦈",476:"🌊",477:"🎐",478:"🦅",479:"🌬️",
480:"🦁",481:"🐯",482:"🔥",483:"🦊",484:"🐺",485:"❄️",486:"💭",487:"🌙",488:"💤",
489:"🦾",490:"⚔️",491:"🛡️",492:"⏱️",493:"⌛",494:"🕰️",495:"🕳️",496:"🌌",497:"🐍",
498:"🌠",499:"✨",500:"🌟",
}

NAME = {486:"Forgotten Psydrak", 488:"Forgotten Dreamaith"}

DESC = {
465:"Forgotten Nyxviper exist a half-second outside time. They step into the pause between heartbeats, strike, and are gone before the moment resumes — a victim never perceives the wound being made.",
467:"Forgotten Duskmourn is the instant the Sundering began, given form. Around it time does not pass — dust hangs in the air and the light of that final day never fades.",
486:"Forgotten Psydrak does not fly through skies but through dreams. Its half-real body drifts like smoke and starlight, trailing fragments of worlds that were only ever dreamed.",
488:"Forgotten Dreamaith drifts through walls and minds alike, pouring rivers of dream-sand that bloom into whole worlds. Those it passes dream of Vaeldris, still standing, for weeks.",
493:"Forgotten Sparkeis hoards moments the way others hoard treasure. Time pools inside its great hourglass core as glowing sand, and what it pours back out has already happened — or has not happened yet.",
494:"Forgotten Thunderax is the Titan of passing time given shape. Memory dissolves in its wake — which is why it alone, of all the Forgotten, no longer remembers Vaeldris at all.",
}

LORE = {
465:"Vaeldrian duelists called them 'the second that never was.' A Nyxviper does not outrun the eye; it removes itself from the timeline entirely and returns only to land the blow.",
467:"Morrigan found Duskmourn standing perfectly still at the edge of the collapse, three days after. It had not moved because, for Duskmourn, those three days had not yet happened.",
486:"Forgotten Psydrak coils through the dream Solenne shares each night, where it holds a thousand sleeping versions of Vaeldris — every one a world that might still have been.",
488:"Solenne says Dreamaith does not know Vaeldris is gone. Every night, in the dream it pours for her, the lost land still stands — and for a few hours, so does everyone in it.",
493:"Tempris tried to measure how much time Sparkeis holds. The instrument read a figure, then unread it, then showed a third. He stopped trying.",
494:"Tempris says Thunderax does not mourn the lost land because, for it, the lost land was simply one more moment that time has already carried away.",
}

APP = {
462:"Serene winged messenger-being; slender luminous body, large crystalline-feathered wings, light-veiled faceless head ringed by a faint halo, trailing prayer-glyph ribbons. White-gold and opal palette.",
463:"Regal swan of translucent living crystal; glowing star-points along neck and wings tracing the Cygnus constellation, prismatic light refraction. Crystal, indigo and gold palette.",
464:"Apex six-winged seraph; crystalline starlight-forged armor, three pairs of radiant wings, a halo of orbiting crystal shards, masked serene visage, forged light-lance. White-gold and prismatic palette.",
465:"Sleek hooded time-assassin that flickers between instants; segmented black-plated limbs, twin blade-arms, pale-blue after-image echoes trailing it mid-strike. Matte-black and violet palette.",
466:"Primordial warrior-shape of black darkfire that swallows light; horned silhouette, cracked obsidian armor plates, dim dying-ember eyes, the air darkening around it. Void-black and faint-orange palette.",
467:"Tall robed judge-figure frozen at a single instant; a cracked clock-face stopped in its chest, body of pale frozen crystal, dust and shards hanging motionless around it. Grey-crystal and frost-white palette.",
468:"Fast quadruped-construct around a crackling tesla-coil spine; crystalline insulator scale-plates, arcs leaping between coil-rings, motion-blur speed trail. Chrome-blue and electric-cyan palette.",
469:"Creature of petrified lightning; branching translucent fulgurite-glass limbs frozen mid-strike, a layered stone core with glassy lightning-scars, amber-blue glow in the cracks. Smoky-glass and sandstone palette.",
470:"Colossal primordial storm-titan; serpentine cyclone lower body as a waterspout, muscular storm-cloud torso, thunderhead-crowned head, lightning-vein eyes. Storm-grey and electric-blue palette.",
471:"Primordial mandrake; gnarled humanoid root-body grown from a cracked seed-stone, leafy frond crest, hollow knot-mouth that speaks, toxic-violet sap weeping from the bark. Bark-brown and moss-green palette.",
472:"Walking mountain whose hollow interior is a vast geode; craggy stone hide cracked open at the chest to reveal a glowing amethyst crystal cavity, mossy strata. Slate-grey and amethyst palette.",
473:"Colossal earth-titan in an Atlas pose bearing a cracking slab of land on its shoulders; magma-veined black-stone musculature, mountain-shard crown, boulder fists. Basalt-black and magma-orange palette.",
474:"Sleek dolphin-like ocean oracle; smooth luminous body, glowing third foresight-eye on its brow, current-glyphs along its flanks, faint time-ripples trailing it. Pearl-teal and deep-blue palette.",
475:"Abyssal anglerfish predator; armored deep-pressure body, gaping needle-toothed maw, a glowing lure holding a tiny violet void-star that draws prey in. Black-blue and bioluminescent-cyan palette.",
476:"Primordial sea-leviathan titan; immense serpentine whale-bodied form, fluked tail, ridged coral-and-shell crest, ocean water curving and flowing around it. Deep ocean-blue and sea-green palette.",
477:"Near-formless wind-spirit shaped like a floating wind-chime; suspended luminous singing tubes and ribbons, a translucent silhouette held together by moving air. Pale-blue and white-gold shimmer palette.",
478:"Fierce storm-wind harpy sky-sentinel; raptor wings and talons, avian-humanoid body, crystalline resonant feathers with prismatic edges, eyes reading glowing wind-current lines. Slate-blue and steel-grey palette.",
479:"Colossal mythic roc eagle with an enormous wingspan; feathers fading from cloud-white to star-flecked indigo at the tips, regal crested head, soaring at the edge of space. Cloud-white and indigo palette.",
480:"Mythic Nemean lion of living alloy; bronze-and-crystal mane, black bone-steel hide with glowing molten seams, iron-shearing claws. Bronze and molten-orange palette.",
481:"Prehistoric sabertooth that hunts in volcanic shadow; ash-striped pelt, oversized glowing fangs, eternal slow-burning embers trailing from its claw-marks. Charcoal and ember-orange palette.",
482:"Primordial magma-dragon; obsidian-plated draconic body with cracked molten cores glowing through, jagged volcanic crest, jaws glowing with diamond-melting heat. Obsidian-black and magma-red palette.",
483:"Arctic fox armored in unmeltable crystalline ice-steel plates; sleek white pelt, frost-rimmed tail, frost trailing behind it. Glacier-blue and steel-silver palette.",
484:"Massive Norse doom-wolf Fenrir rising from cracked glacier ice; dark frost-rimed fur, chilling pale aura, cold pale eyes. Charcoal-blue and frost-white palette.",
485:"Primordial Ymir frost-giant jotun; towering body of jagged ice and grey stone, glacier-shard beard and crown, exhaling a blizzard, ice spreading from its feet. Deep glacier-blue and white-rime palette.",
486:"Coiling dream-dragon of drifting smoke and starlight; semi-translucent body, trailing fragments of dreamed worlds, soft glowing clock-glyphs in its mane. Lavender and twilight-violet palette.",
487:"Graceful fairy woven of moonlight; translucent crescent-veined wings, body of pale silver light, cupping a small reflective moon-pool orb. Moon-silver and pale-lavender palette.",
488:"Imposing dream-god; tall robed figure of shifting twilight cloth and dream-sand, a starry void where its face should be, pouring golden dream-sand that blooms into tiny floating dreamscapes. Twilight-indigo and gold palette.",
489:"Armored ankylosaurus-tank; impenetrable crystalline-metal plating, a heavy club tail of fused ore-crystal, low and immovable. Gunmetal-grey and crystal-blue palette.",
490:"Divine forge-spirit smith; broad humanoid of living metal with a molten forge-core chest, anvil shoulders, hammer hands, halo of sparks, forging a glowing blade. Dark-iron and forge-orange palette.",
491:"Giant bronze Talos automaton-guardian; towering riveted bronze colossus, glowing core-seam, clockwork joints, bracing a massive tower shield as a final defender. Aged-bronze and verdigris palette.",
492:"Sleek precognitive clockwork automaton; exposed turning brass gears, a stopwatch-face head, pale-blue ghost-images of its next moves projected ahead of it. Brass and glass palette.",
493:"Ethereal hourglass-being; a luminous figure built around a great hourglass torso of falling glowing sand, time-frozen motes orbiting it, soft halo. White-gold and amber palette.",
494:"Primordial Titan of Time; vast ancient figure in a star-mantle, a clockwork-gear halo, holding an hourglass and scythe, a long beard of falling sand. Antique-brass and deep-indigo palette.",
495:"Hooded faceless wraith of pure silence; a dampening void where light dims and sound dies, stars guttering out around its frayed hem. Starless-black and dim-violet palette.",
496:"A perfect living silhouette that absorbs all light; flat pure-black cut-out body whose interior shows a star-flecked collapsing void, edges shimmering with time-distortion. Absolute-black and star-violet palette.",
497:"Colossal primordial void-serpent (Apophis); starless black scales, an enormous maw swallowing constellations, extinguished stars trailing from its fangs. Void-black with dying-gold star-flecks.",
498:"Living star-chart; plated body like a rotating celestial globe inside brass armillary meridian-rings, scales mapping a glowing constellation night-sky. Indigo and gold palette with brass rings.",
499:"Planet-born supernova-core beast; dormant as a compact ash-shelled ember-beast, then its shell cracks open and it erupts into concentric shockwave rings and radiant plasma plumes like a corona-mane. Ash-black to blue-white with violet shock-rings.",
500:"Imposing radiant star-spirit carrying a blazing star-shard core in its chest; robes of woven nebula-light, a crown of orbiting starlight, blazing like a newborn universe. Deep-indigo and white-gold palette.",
}

src = io.open('js/data.js', encoding='utf-8').read()
lines = src.split('\n')
out = []
cur = None
entry_start = re.compile(r'^(\s*)(\d+):\s*\{\s*id:(\d+),')
for ln in lines:
    if 'LORE-AUDIT FLAG (Step 4)' in ln:
        continue  # resolved
    m = entry_start.match(ln)
    if m:
        cur = int(m.group(3))
        if 462 <= cur <= 500:
            if cur in NAME:
                ln = re.sub(r'name:"[^"]*"', 'name:"%s"' % NAME[cur], ln, count=1)
            ln = re.sub(r'emoji:"[^"]*"', 'emoji:"%s"' % EMOJI[cur], ln, count=1)
            ln = re.sub(r'types:\[[^\]]*\]', 'types:[%s]' % TYPES[cur], ln, count=1)
        out.append(ln)
        continue
    if cur and 462 <= cur <= 500:
        dm = re.match(r'^(\s*)desc:"(.*)",\s*$', ln)
        if dm and cur in DESC:
            out.append('%sdesc:"%s",' % (dm.group(1), DESC[cur]))
            continue
        lm = re.match(r'^(\s*)lore:"(.*)"\s*\}(,?)\s*$', ln)
        if lm:
            indent = lm.group(1); text = LORE.get(cur, lm.group(2)); tail = lm.group(3)
            out.append('%slore:"%s",' % (indent, text))
            out.append('%sappearance:"%s" }%s' % (indent, APP[cur], tail))
            cur = None
            continue
    out.append(ln)

io.open('js/data.js', 'w', encoding='utf-8').write('\n'.join(out))
print("data.js updated.")
