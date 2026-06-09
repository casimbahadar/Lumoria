#!/usr/bin/env python3
"""Finish moveset-util item 6: distribute the deferred Aether + Chrono orphan moves
across the now-existing Aether/Chrono Forgotten learnsets (sharing), keeping a few
ultra-finishers as rarity:"exclusive" reserves. Mirrors Batch 1/2 of the audit."""
import re, io
src = io.open('js/data.js', encoding='utf-8').read()

# moves: key -> (type, cat, power, rarity)
moves={}
for ln in src.split('\n'):
    m=re.match(r'\s*([a-z][a-z0-9_]*):\s*\{',ln)
    if not m: continue
    t=re.search(r'\btype:"([A-Za-z]+)"',ln)
    if not t: continue
    c=re.search(r'\bcat:"([a-z]+)"',ln); p=re.search(r'\bpower:(\d+)',ln); r=re.search(r'rarity:"([a-z]+)"',ln)
    moves[m.group(1)]=(t.group(1),c.group(1) if c else '?',int(p.group(1)) if p else 0, r.group(1) if r else '')

# learnset usage
used=set()
for seg in re.findall(r'learnset:\[(.*?)\]\]',src,re.S):
    used|=set(re.findall(r'"([a-z][a-z0-9_]*)"',seg))

# Forgotten id -> types
forg={}
for m in re.finditer(r'\b(46[2-9]|4[7-9]\d|500):\s*\{\s*id:\d+,[^\n]*types:\[([^\]]*)\]',src):
    iid=int(m.group(1))
    if iid>=462: forg[iid]=re.findall(r'"([A-Za-z]+)"',m.group(2))

RESERVE={'Chrono':{'timeless_apocalypse','era_calamity','eternity_lock'},
         'Aether':{'divine_judgement','infinity_strike'}}
LEVELS=[18,26,34,42,50,58,66,74,82]

assign={}   # id -> [keys]
make_excl=set()
for typ in ('Aether','Chrono'):
    fids=[i for i,ts in forg.items() if typ in ts]
    orphans=sorted(k for k,(t,c,p,r) in moves.items() if t==typ and k not in used)
    j=0
    for k in orphans:
        if k in RESERVE[typ]:
            if moves[k][3]!='exclusive': make_excl.add(k)
            continue
        fid=fids[j%len(fids)]; j+=1
        assign.setdefault(fid,[]).append(k)
    print(f"{typ}: {len(orphans)} orphans -> distribute {len([o for o in orphans if o not in RESERVE[typ]])}, reserve {len(RESERVE[typ]&set(orphans))}")

# apply: 1) tag reserves exclusive  2) append assigns to learnsets
out=[]; cur=None
for ln in src.split('\n'):
    m=re.match(r'\s*([a-z][a-z0-9_]*):\s*\{',ln)
    if m and m.group(1) in make_excl and 'rarity:' not in ln:
        ln=re.sub(r'(,\s*desc:")', r', rarity:"exclusive"\1', ln, count=1)
    em=re.match(r'\s*(\d+):\s*\{\s*id:(\d+),',ln)
    if em: cur=int(em.group(2))
    if cur in assign and re.match(r'\s*learnset:\[\[',ln):
        ins=''.join(f',[{LEVELS[i%len(LEVELS)]},"{k}"]' for i,k in enumerate(assign[cur]))
        ln=re.sub(r'(\])\](\s*,?)\s*$', r'\1'+ins+r']\2', ln, count=1)
        del assign[cur]
    out.append(ln)
io.open('js/data.js','w',encoding='utf-8').write('\n'.join(out))
print("reserves tagged exclusive:", len(make_excl), "| leftover unassigned:", sum(len(v) for v in assign.values()))
