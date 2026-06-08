#!/usr/bin/env python3
"""Add 2 unique signature moves to each of the 39 Forgotten (78 total).
Each: rarity:"exclusive", signature:true, inserted into exactly one learnset.
Effects use only existing (validated) handler tokens."""
import re, io

# (id, key, name, type, power, acc, pp, cat, effect, ec, desc, bonusVsStatus|None)
S = [
(462,'psalm_of_the_lost','Psalm of the Lost','Aether',100,100,5,'special','drain',100,"The massed voices of the departed drain the foe and heal the user.",None),
(462,'ancestral_rite','Ancestral Rite','Primal',100,95,5,'special','spaup',100,"Invokes ancient prayer-resonance, raising the user's Sp. Atk.",None),
(463,'prism_requiem','Prism Requiem','Crystal',110,100,5,'special','crit',100,"Refracted starlight focused to a near-certain critical point.",None),
(463,'cygnus_flare','Cygnus Flare','Stellar',110,100,5,'special','spdefdown',30,"A swan-shaped starburst; devastates a foe already afflicted.","any"),
(464,'seraphic_judgment','Seraphic Judgment','Aether',125,100,5,'special','recharge',100,"An apex celestial verdict so vast the user must recover after.",None),
(464,'starforged_bulwark','Star-Forged Bulwark','Crystal',0,100,10,'status','spdefup2_and_defup2_self',100,"Forges a lattice of starlight-crystal armor, sharply raising Def and Sp. Def.",None),
(465,'second_that_never_was','The Second That Never Was','Chrono',88,100,10,'physical','priority',100,"Strikes from the gap between instants, always moving first.",None),
(465,'memory_theft','Memory Theft','Dark',100,100,5,'physical','spatkdown',100,"Erases a sliver of memory, lowering the foe's Sp. Atk.",None),
(466,'darkfire_pyre','Darkfire Pyre','Dark',110,95,5,'special','burn',30,"Lightless flame that burns without warmth and may scorch the foe.",None),
(466,'unpassed_wrath','Unpassed Wrath','Primal',110,100,5,'physical','atkup',100,"The fury of warriors who refused to die; raises the user's Atk.",None),
(467,'frozen_verdict','Frozen Verdict','Chrono',120,100,5,'special','sluggish',100,"Halts the foe in a single instant, leaving them sluggish.",None),
(467,'shattered_hour','Shattered Hour','Crystal',125,95,5,'special','spdefdown',30,"The crystallized final moment of a world, hurled at the foe.",None),
(468,'coil_discharge','Coil Discharge','Electric',100,100,5,'special','paralyze',30,"A full tesla-coil dump that may paralyze.",None),
(468,'superconductor_lance','Superconductor Lance','Crystal',100,100,5,'physical','crit',30,"A zero-resistance crystal spike with a high crit rate.",None),
(469,'fulgurite_strike','Fulgurite Strike','Electric',110,100,5,'physical','flinch',30,"Petrified lightning driven home; may make the foe flinch.",None),
(469,'deep_time_arc','Deep-Time Arc','Chrono',110,95,5,'special','sluggish',30,"A sixty-thousand-year stored discharge that slows the foe.",None),
(470,'tempest_god_roar','Tempest-God Roar','Electric',120,90,5,'special','paralyze',30,"Its roar calls lightning from every direction at once.",None),
(470,'primeval_maelstrom','Primeval Maelstrom','Primal',125,90,5,'special','defdown',30,"A storm-titan's cyclone that batters the foe's defenses.",None),
(471,'mandrake_shriek','Mandrake Shriek','Primal',100,100,5,'special','confuse',30,"The mandrake's maddening cry that may confuse.",None),
(471,'seedstone_toxin','Seed-Stone Toxin','Poison',100,100,5,'physical','badpoison',30,"Ten-thousand-year sap that may badly poison.",None),
(472,'geode_eruption','Geode Eruption','Crystal',110,95,5,'physical','defdown',30,"Cracks open its crystal core in a blast that lowers Def.",None),
(472,'tectonic_age','Tectonic Age','Primal',110,100,5,'physical','flinch',30,"Millennia of geological pressure released at once.",None),
(473,'world_bearer_slam','World-Bearer Slam','Fighting',125,100,5,'physical','defdown',100,"Brings the weight of a world down, crushing the foe's Defense.",None),
(473,'atlas_quake','Atlas Quake','Primal',120,100,5,'physical','flinch',30,"A titan's quake that can stagger the foe.",None),
(474,'foretold_tide','Foretold Tide','Aquatic',100,100,5,'special','spedown',30,"A wave the oracle saw coming; may slow the foe.",None),
(474,'precognition','Precognition','Chrono',85,100,10,'special','priority',100,"Acts on a glimpsed future, always striking first.",None),
(475,'void_lure','Void Lure','Stellar',110,100,5,'special','marked',100,"Its abyssal lure marks the foe, drawing them into the dark.",None),
(475,'pressure_crush','Pressure Crush','Aquatic',110,95,5,'physical','defdown',30,"Hadal pressure that collapses the foe's guard.",None),
(476,'ocean_sovereign','Ocean Sovereign','Aquatic',125,100,5,'special','spdefdown',30,"The sea itself bends to the last ocean-god's will.",None),
(476,'primordial_surge','Primordial Surge','Primal',120,100,5,'physical','flinch',30,"A leviathan's ancient might in a single tail-pulse.",None),
(477,'voices_on_the_wind','Voices on the Wind','Aether',100,100,5,'special','confuse',30,"Carries the lost on the wind; the foe may be confused.",None),
(477,'requiem_chime','Requiem Chime','Aether',105,100,5,'special','spdefdown',30,"A singing gust that wears down the spirit.",None),
(478,'sky_sentinel_dive','Sky-Sentinel Dive','Wind',110,100,5,'physical','flinch',30,"A reading-the-winds raptor dive that may flinch.",None),
(478,'resonant_feather','Resonant Feather','Crystal',110,100,5,'special','spedown',30,"Crystalline feathers ring at a frequency that slows.",None),
(479,'stratosphere_fall','Stratosphere Fall','Wind',125,95,5,'physical','flinch',30,"A roc's plunge from the very edge of space.",None),
(479,'edge_of_heaven','Edge of Heaven','Stellar',120,100,5,'special','spdefdown',30,"Where air meets the stars, light rains down.",None),
(480,'molten_maul','Molten Maul','Fire',100,100,5,'physical','burn',30,"Living-alloy claws that sear and may burn.",None),
(480,'alloy_rend','Alloy Rend','Crystal',100,100,5,'physical','defdown',30,"Bone-steel claws that shear through the foe's guard.",None),
(481,'eternal_ember','Eternal Ember','Fire',110,100,5,'physical','burn',100,"A wound that never stops burning — a guaranteed scorch.",None),
(481,'timeless_hunt','Timeless Hunt','Chrono',110,100,5,'physical','sluggish',30,"Stalks the foe out of time; may leave them sluggish.",None),
(482,'diamond_melt_breath','Diamond-Melt Breath','Draconic',125,90,5,'special','spdefdown',30,"Breath hot enough to melt diamond.",None),
(482,'magma_genesis','Magma Genesis','Primal',120,100,5,'physical','burn',30,"Primordial volcanic fury given draconic form.",None),
(483,'icesteel_fang','Ice-Steel Fang','Ice',100,100,5,'physical','freeze',20,"Unmeltable ice-steel fangs that may freeze.",None),
(483,'mirror_frost','Mirror Frost','Crystal',100,100,5,'special','spdefdown',30,"Crystalline ice that deflects light and shatters.",None),
(484,'doom_howl','Doom Howl','Ice',110,100,5,'physical','freeze',20,"The doom-wolf's howl drags warmth away; may freeze.",None),
(484,'entropy_bite','Entropy Bite','Chrono',110,100,5,'physical','sluggish',30,"A bite that reminds the foe warmth was always temporary.",None),
(485,'world_winter','World-Winter','Ice',125,90,5,'special','freeze',30,"The primordial frost that once shaped a continent.",None),
(485,'jotun_crush','Jotun Crush','Primal',120,100,5,'physical','defdown',30,"A frost-giant's elemental, world-old blow.",None),
(486,'dream_coil','Dream Coil','Dream',100,100,5,'special','sleep',30,"Coils through the foe's mind; may lull it to sleep.",None),
(486,'thousand_futures','Thousand Futures','Chrono',100,100,5,'special','confuse',30,"Shows every possible outcome at once, confusing the foe.",None),
(487,'full_moon_tide','Full-Moon Tide','Stellar',110,100,5,'special','spdefdown',30,"Moonlight-charged power that crests like the tide.",None),
(487,'lullaby_pool','Lullaby Pool','Dream',110,100,5,'special','sleep',30,"A pool of reflected moonlight that brings sleep.",None),
(488,'world_that_still_stands','The World That Still Stands','Dream',125,100,5,'special','sleep',30,"Pours a whole dreamed world over the foe.",None),
(488,'dreamsand_deluge','Dream-Sand Deluge','Aether',120,100,5,'special','spdefdown',30,"Rivers of golden dream-sand that wear away resolve.",None),
(489,'plate_slam','Plate Slam','Metal',100,100,5,'physical','defup',100,"A body-slam from living armor that hardens it further.",None),
(489,'crystal_bastion','Crystal Bastion','Crystal',0,100,10,'status','spdefup2_and_defup2_self',100,"Raises an unbreakable crystal-metal guard (Def & Sp. Def up sharply).",None),
(490,'legendary_forge','Legendary Forge','Metal',110,100,5,'physical','atkup',100,"Forges itself mid-battle, striking and raising its Atk.",None),
(490,'divine_temper','Divine Temper','Aether',110,100,5,'special','spdefdown',30,"A smith-god's blessing hammered into the foe.",None),
(491,'final_bulwark','Final Bulwark','Metal',125,100,5,'physical','defdown',100,"Vaeldris's last defender brings down a bronze fist.",None),
(491,'perfected_form','Perfected Form','Chrono',120,100,5,'physical','atkup',100,"A body refined across endless battles; raises Atk.",None),
(492,'counter_already_chosen','Counter Already Chosen','Chrono',88,100,10,'special','priority',100,"It chose this counter before you moved — always first.",None),
(492,'clockwork_cascade','Clockwork Cascade','Chrono',105,100,5,'special','sluggish',30,"A cascade of turning gears that slows the foe.",None),
(493,'hoarded_moments','Hoarded Moments','Chrono',110,100,5,'special','sluggish',30,"Spends stored time against the foe, slowing them.",None),
(493,'sand_of_ages','Sand of Ages','Aether',110,100,5,'special','spdefdown',30,"Ethereal hourglass-sand that erodes the spirit.",None),
(494,'devour_the_hour','Devour the Hour','Chrono',125,100,5,'special','sluggish',100,"Father Time consumes the moment; the foe falls behind.",None),
(494,'primeval_epoch','Primeval Epoch','Primal',120,100,5,'physical','defdown',30,"An age's worth of force in one titanic blow.",None),
(495,'null_field','Null Field','Stellar',100,100,5,'special','spatkdown',30,"A field where light and energy die, dampening Sp. Atk.",None),
(495,'utter_silence','Utter Silence','Spectral',100,100,5,'special','deafen',30,"Smothers all sound; the foe may be deafened.",None),
(496,'lightless','Lightless','Stellar',110,100,5,'special','accdown',30,"Drinks all light, blinding the foe.",None),
(496,'dimensional_collapse','Dimensional Collapse','Chrono',110,95,5,'special','sluggish',30,"Folds space-time around the foe, slowing them.",None),
(497,'devour_the_stars','Devour the Stars','Stellar',125,100,5,'special','spdefdown',30,"The void-serpent swallows the light of the sky.",None),
(497,'sundering_coil','Sundering Coil','Primal',120,95,5,'physical','defdown',30,"The primordial void-coil that ended a world.",None),
(498,'starmap_beam','Star-Map Beam','Stellar',100,100,5,'special','spdefdown',30,"Fires the charted night sky at the foe.",None),
(498,'astral_record','Astral Record','Aether',100,100,5,'special','calmup',100,"Reads the heavens, steadying its own spirit.",None),
(499,'supernova_burst','Supernova Burst','Stellar',115,95,5,'special','recharge',100,"Detonates its core like a dying star; must recover after.",None),
(499,'shockwave_boom','Shockwave Boom','Sonic',110,100,5,'special','flinch',30,"The deafening blast-wave of the eruption.",None),
(500,'first_star','First Star','Stellar',125,100,5,'special','spdefdown',30,"The light of the first star that ever formed.",None),
(500,'newborn_universe','Newborn Universe','Stellar',120,100,5,'special','crit',30,"Blazes like a young cosmos; a high critical-hit rate.",None),
]

src = io.open('js/data.js', encoding='utf-8').read()

# --- build move definition lines ---
def eff_field(e): return 'null' if e is None else '"%s"' % e
lines=[]
for (iid,key,name,typ,pw,acc,pp,cat,eff,ec,desc,bonus) in S:
    b = (' bonusVsStatus:"%s",' % bonus) if bonus else ''
    lines.append('  %s:{ name:"%s", type:"%s", power:%d, acc:%d, pp:%d, cat:"%s", effect:%s, ec:%d,%s signature:true, rarity:"exclusive", desc:"%s" },'
                 % (key,name,typ,pw,acc,pp,cat,eff_field(eff),ec,b,desc))
block = "\n  // --- Forgotten signature moves (2 each; unique learner) ---\n" + "\n".join(lines) + "\n"

# insert before the closing of MOVES_DATA (first top-level "\n};" after declaration)
start = src.index('const MOVES_DATA')
close = src.index('\n};', start)
src = src[:close] + "\n" + block + src[close+1:]

# --- insert signature keys into each learnset ---
from collections import defaultdict
bymon = defaultdict(list)
for e in S: bymon[e[0]].append(e[1])
SIG1=[1,30,55,72]; SIG2=[100,86,92,78]
order = sorted(bymon)
levels = {iid:(SIG1[i%4], SIG2[i%4]) for i,iid in enumerate(order)}

out=[]; cur=None
for ln in src.split('\n'):
    em=re.match(r'\s*(\d+):\s*\{\s*id:(\d+),', ln)
    if em: cur=int(em.group(2))
    if cur and 462<=cur<=500 and cur in bymon and re.match(r'\s*learnset:\[\[', ln):
        k1,k2=bymon[cur]; l1,l2=levels[cur]
        ins=',[%d,"%s"],[%d,"%s"]' % (l1,k1,l2,k2)
        ln=re.sub(r'(\])\](\s*,?)\s*$', r'\1'+ins+r']\2', ln, count=1)
        del bymon[cur]
    out.append(ln)
io.open('js/data.js','w',encoding='utf-8').write('\n'.join(out))
print("Added %d signature moves; learnset inserts remaining (should be 0): %d" % (len(S), len(bymon)))
