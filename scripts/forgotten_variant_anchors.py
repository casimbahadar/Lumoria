#!/usr/bin/env python3
"""Rewrite the 39 Forgotten identity anchors in js/variant-content.js to match
the new types/archetypes/appearance. All strings single-quote-safe (no apostrophes)."""
import re, io

A = {
462:("divine messenger",["its crystalline feathered wings","its halo of soft light","its aura of lost things"],"It still seeks out those who have lost something dear."),
463:("constellation swan",["its living-crystal body","its constellation of star-points","its prismatic light"],"Light still bends into rainbows through its body."),
464:("six-winged seraph",["its starlight-crystal armor","its three pairs of radiant wings","its halo of orbiting shards"],"It still mourns as the last of its kind."),
465:("temporal assassin",["its segmented black-plated limbs","its twin blade-arms","its trailing time-echoes"],"It still strikes from the gap between moments."),
466:("darkfire warrior",["its lightless darkfire flames","its cracked obsidian armor","its dying-ember eyes"],"Its darkfire still burns without giving any light."),
467:("frozen judge",["its pale crystal form","its stopped clock-face","its motionless hanging dust"],"It still stands frozen at the instant the world ended."),
468:("tesla-coil beast",["its crackling coil spine","its crystalline insulator plates","its leaping arcs"],"Charge still flows through it without any loss."),
469:("petrified-lightning beast",["its fulgurite-glass limbs","its strata-scarred core","its frozen arcs"],"Its body still holds lightning struck ages ago."),
470:("storm-titan",["its cyclone-funnel body","its storm-cloud mane","its lightning-vein eyes"],"It still commands respect without any title."),
471:("primordial mandrake",["its gnarled root body","its toxin-laced bark","its seed-stone heart"],"It still whispers what the mountains are thinking."),
472:("walking geode",["its cracked-open crystal core","its mountain-stone hide","its colossal tread"],"It still moves like a mountain that chose to walk."),
473:("earth-titan",["its magma-veined body","its mountain-shard crown","its world-bearing arms"],"Its strength still feels too large for words."),
474:("ocean oracle",["its luminous sleek body","its glowing foresight-eye","its trailing time-ripples"],"It still seems to know what has not yet happened."),
475:("abyssal anglerfish",["its armored deep-sea body","its glowing void-star lure","its needle-toothed maw"],"Its lure still draws prey gently into the dark."),
476:("ocean leviathan",["its vast serpentine body","its coral-and-shell crest","its tide-commanding presence"],"The sea still seems to part around it."),
477:("wind-chime spirit",["its near-formless veil","its singing chimes","its weightless drift"],"The air still moves as if to greet it."),
478:("storm harpy",["its crystalline resonant feathers","its broad raptor wings","its keen wind-reading eyes"],"Its feathers still hum with coming weather."),
479:("sky roc",["its city-block wingspan","its star-flecked feathers","its restless wings"],"It still refuses ever to touch the ground."),
480:("nemean lion",["its bronze-and-crystal mane","its molten-seamed hide","its iron-shearing claws"],"Its claws still hold a freshly-sharpened edge."),
481:("ember sabertooth",["its ash-striped pelt","its oversized glowing fangs","its ever-burning wounds"],"It still answers to no one but itself."),
482:("magma dragon",["its obsidian-plated body","its molten-core cracks","its diamond-melting breath"],"It still keeps the loyalty it learned as a hatchling."),
483:("ice-steel fox",["its crystalline ice-steel plating","its sleek white pelt","its frost-rimmed tail"],"Its ice-steel still holds an impossible edge."),
484:("doom-wolf",["its dark frost-rimed fur","its cold patient gaze","its silent stalk"],"Warmth still drains from all it stalks."),
485:("frost-giant",["its jagged ice-and-stone body","its glacier-shard crown","its blizzard breath"],"A whole continent of cold still answers to it."),
486:("dream dragon",["its smoke-and-starlight body","its trailing dreamed worlds","its clock-glyph mane"],"In its dream, the lost home still stands."),
487:("moonlight fairy",["its pale silver-light body","its crescent-veined wings","its glowing moon-pool orb"],"It still pours moonlight into still water by night."),
488:("dream-god",["its twilight-cloth robes","its starry void face","its rivers of dream-sand"],"In the dream it pours, the lost home still stands."),
489:("armored titan",["its crystalline-metal plating","its fused ore club-tail","its unshakable stance"],"It still stands unmoved by almost anything."),
490:("forge-smith spirit",["its molten forge-core chest","its anvil shoulders","its halo of sparks"],"It could still forge a blade worth a kingdom."),
491:("bronze colossus",["its riveted bronze body","its glowing core-seam","its great tower shield"],"It still does its duty without complaint."),
492:("clockwork seer",["its turning brass gears","its stopwatch-face head","its projected next moves"],"It still calculates the odds of everything."),
493:("hourglass spirit",["its falling-sand core","its time-frozen motes","its soft halo"],"The moments it hoards still defy any measure."),
494:("time-titan",["its star-mantle","its clockwork-gear halo","its beard of falling sand"],"It alone still carries no memory of the loss."),
495:("silence wraith",["its hooded null-form","its light-dimming aura","its guttering stars"],"Whether it helps or harms is still never clear."),
496:("living silhouette",["its pure-black cut-out form","its star-flecked void interior","its warping edges"],"A piece of the collapse still clings to it."),
497:("void-serpent",["its starless black scales","its constellation-swallowing maw","its trailing dead stars"],"Fear of it is still the only reasonable response."),
498:("living star-chart",["its rotating celestial-globe body","its brass meridian-rings","its mapped night sky"],"Its star-patterns still shift before great events."),
499:("supernova beast",["its ash-shelled ember core","its erupting shockwave rings","its radiant plasma plumes"],"Its hatching is still bound to that fateful day."),
500:("star-spirit",["its blazing star-shard core","its nebula-light robes","its crown of orbiting starlight"],"It is still the last wonder its lost home produced."),
}

src = io.open('js/variant-content.js', encoding='utf-8').read()
def build(iid, comma):
    noun,fe,core = A[iid]
    feats = ", ".join("'%s'" % f for f in fe)
    return "    %d: { noun: '%s', features: [%s], coreLine: '%s' }%s" % (iid, noun, feats, core, comma)

out=[]; n=0
for ln in src.split('\n'):
    m=re.match(r'^(\s*)(\d+): \{ noun:.*\}(,?)\s*$', ln)
    if m and int(m.group(2)) in A:
        out.append(build(int(m.group(2)), m.group(3))); n+=1
    else:
        out.append(ln)
io.open('js/variant-content.js','w',encoding='utf-8').write('\n'.join(out))
print("variant anchors rewritten:", n)
