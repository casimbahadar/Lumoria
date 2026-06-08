#!/usr/bin/env python3
"""STAB top-up for the 39 Forgotten: ensure >=3 damaging moves of each type
(4 for mono-type) by adding curated existing pool moves to learnsets."""
import re, io

CUR = {
'Aether': ['aether_pulse','radiant_wave','aether_shock','mystic_ray','arcane_beam','radiant_strike','ethereal_slash','cosmic_dust'],
'Chrono': ['chronoshift','timewarp_blow','age_burst','era_punch','timefade_beam','continuum_blast','aeon_smash','chrono_storm'],
'Crystal':['geode_smash','gemstone_strike','crystal_storm','prism_blow','gemstone_blast','diamond_drill','quartz_quake','beryl_press'],
'Primal': ['primal_smash','ancient_strike','beast_charge','wild_strike','crushing_jaws','raw_fury','apex_predator','primeval_eruption'],
'Stellar':['astral_blast','starlight_charge','nebula_burst','cosmic_slam','pulsar_storm','starfall_2','supernova_press'],
'Dream':  ['starlit_dream','lullaby_strike','oneiric_press','terror_slash','dreamscape_smash','slumber_eruption','hypnos_storm'],
'Sonic':  ['bass_blast','acoustic_shock','harmonic_wave','decibel_burst','frequency_blast','concussive_strike','skyboom_strike'],
'Metal':  ['warden_strike','anvil_drop','heavy_slam','iron_storm','titan_blade','ferrous_gale','metal_roller'],
'Electric':['stormbolt','lightning_rush','ion_cannon','plasma_punch','volt_jet','voltaic_rush','ampere_rail','arc_cannon'],
'Aquatic':['tidal_rush','ocean_crash','tidal_crush','riptide_slam','whirlpool_dive','tidal_sweep','torrent_shell','sea_serpent_strike'],
'Ice':    ['glacial_lance','cold_beam','ice_hammer','frostbite_strike','subzero_slash','avalanche_smash','ice_resonance'],
'Wind':   ['gale_cannon','typhoon','cyclone_smash','storm_surge','tornado_slam','sky_dive','gale_force','canopy_strike'],
'Fire':   ['pyroclasm','forge_blast','conflagration','solar_flare','searing_gale','lava_drop','wildfire_surge'],
'Dark':   ['void_rend','savage_blow','shadowstorm','soul_rend','eclipse_burst','wicked_torrent','abyssal_wave'],
'Poison': ['sludge_wave','venom_lance','ooze_bomb','toxic_lash','corrosive_bite','gunk_blast','sludge_cannon'],
'Fighting':['brawl','spinning_kick','iron_fist','iron_cleave','haymaker','shockwave_kick','roar_strike','seismic_force'],
'Spectral':['specter_pulse','phantom_force','soul_burst','revenant_charge','necrotic_pulse','void_wail','reaper_scythe'],
}
LEVELS = [24,38,52,66,78,44]  # spread levels for added STAB

src = io.open('js/data.js', encoding='utf-8').read()
moves = {}
for ln in src.split('\n'):
    m = re.match(r'\s*([a-z][a-z0-9_]*):\s*\{', ln)
    if not m: continue
    t = re.search(r'\btype:"([A-Za-z]+)"', ln)
    if not t: continue
    c = re.search(r'\bcat:"([a-z]+)"', ln); p = re.search(r'\bpower:(\d+)', ln)
    moves[m.group(1)] = (t.group(1), c.group(1) if c else '?', int(p.group(1)) if p else 0)

def dmg(k, typ):
    return k in moves and moves[k][0]==typ and moves[k][1]!='status' and moves[k][2]>0

# compute additions per id
forg = {}
for m in re.finditer(r'\b(46[2-9]|4[7-9]\d|500):\s*\{\s*id:\d+,[^\n]*types:\[([^\]]*)\]', src):
    iid=int(m.group(1))
    if iid<462: continue
    types=re.findall(r'"([A-Za-z]+)"', m.group(2))
    blk=src[m.end():m.end()+1800]; lm=re.search(r'learnset:\[(\[.*?\])\]', blk, re.S)
    keys=re.findall(r'"([a-z][a-z0-9_]*)"', lm.group(1)) if lm else []
    forg[iid]=(types, keys)

adds={}
for iid,(types,keys) in forg.items():
    present=set(keys); newadd=[]
    target = 4 if len(types)==1 else 3
    for t in types:
        have=sum(1 for k in keys if dmg(k,t))
        need=max(0, target-have)
        for cand in CUR.get(t,[]):
            if need<=0: break
            if cand in present or not dmg(cand,t): continue
            newadd.append(cand); present.add(cand); need-=1
        if need>0: print(f"  WARN id{iid} {t}: still short {need}")
    adds[iid]=newadd

# rewrite learnset lines, appending additions
out=[]; cur=None
for ln in src.split('\n'):
    em=re.match(r'\s*(\d+):\s*\{\s*id:(\d+),', ln)
    if em: cur=int(em.group(2))
    if cur and 462<=cur<=500 and adds.get(cur) and re.match(r'\s*learnset:\[\[', ln):
        extra=adds[cur]
        ins=''.join(f',[{LEVELS[i%len(LEVELS)]},"{k}"]' for i,k in enumerate(extra))
        # insert before the final outer ] of learnset value: ...]] -> ...],<ins ...>]
        ln=re.sub(r'(\])\](\s*,?)\s*$', r'\1'+ins+r']\2', ln, count=1)
        adds[cur]=None
    out.append(ln)
io.open('js/data.js','w',encoding='utf-8').write('\n'.join(out))
tot=sum(len(v) for v in adds.values() if v)  # leftovers (should be 0)
print("STAB top-up applied. leftover-unapplied:", tot)
