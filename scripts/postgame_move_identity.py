#!/usr/bin/env python3
"""Post-game-type move identity: give flat effect:null damaging moves in the 5
post-game types thematic minor effects. Leaves the 2 lowest-power basics per
type vanilla. Adds one bonusVsStatus exploiter per type."""
import re, io

ROT = {
 'Aether':['spdefdown','confuse','drain','spatkdown'],
 'Chrono':['spedown','sluggish','spdefdown','accdown'],
 'Crystal':['defdown','crit','spdefdown','brittle'],
 'Primal':['atkdown','bleed','flinch','defdown'],
 'Stellar':['spdefdown','accdown','crit','spatkdown'],
}
EXPLOIT = {'Aether':'any','Chrono':'sluggish','Crystal':'brittle','Primal':'bleed','Stellar':'any'}
EC = {'recharge':100,'crit':100,'drain':100,'sluggish':30,'bleed':30,'brittle':30,'confuse':30,
      'flinch':30,'defdown':30,'spdefdown':30,'spatkdown':30,'atkdown':30,'spedown':30,'accdown':30}
post=set(ROT)

src=io.open('js/data.js',encoding='utf-8').read()
targets=[]  # (type, power, key)
for ln in src.split('\n'):
    m=re.match(r'\s*([a-z][a-z0-9_]*):\s*\{',ln)
    if not m: continue
    t=re.search(r'\btype:"([A-Za-z]+)"',ln)
    if not t or t.group(1) not in post: continue
    c=re.search(r'\bcat:"([a-z]+)"',ln); p=re.search(r'\bpower:(\d+)',ln)
    e=re.search(r'\beffect:(null|"[a-z0-9_]+")',ln)
    if not e or e.group(1)!='null': continue
    if 'signature:true' in ln: continue
    cat=c.group(1) if c else '?'; pw=int(p.group(1)) if p else 0
    if cat=='status' or pw<=0: continue
    targets.append((t.group(1),pw,m.group(1)))

# assign per type
assign={}  # key -> (effect, ec, bonus|None)
for typ in post:
    ms=sorted([(pw,k) for tt,pw,k in targets if tt==typ], reverse=True)
    leave_null=set(k for _,k in ms[-2:])  # 2 lowest stay vanilla
    work=[k for _,k in ms if k not in leave_null]
    rot=ROT[typ]
    for i,k in enumerate(work):
        if i==0:
            assign[k]=('recharge',100,None)           # top nuke gets a recharge downside
        elif i==1:
            eff=rot[0]; assign[k]=(eff,EC[eff],EXPLOIT[typ])  # exploiter
        else:
            eff=rot[(i-1)%len(rot)]; assign[k]=(eff,EC[eff],None)

# apply line edits
out=[]; n=0
for ln in src.split('\n'):
    m=re.match(r'\s*([a-z][a-z0-9_]*):\s*\{',ln)
    if m and m.group(1) in assign and 'effect:null' in ln:
        eff,ec,bonus=assign[m.group(1)]
        ln=re.sub(r'\beffect:null', 'effect:"%s"'%eff, ln, count=1)
        ln=re.sub(r'\bec:\d+', 'ec:%d'%ec, ln, count=1)
        if bonus and 'bonusVsStatus' not in ln:
            ln=re.sub(r'(\bec:\d+,)', r'\1 bonusVsStatus:"%s",'%bonus, ln, count=1)
        n+=1
    out.append(ln)
io.open('js/data.js','w',encoding='utf-8').write('\n'.join(out))
print("post-game move-identity effects applied:", n, "/ targets", len(targets), "(10 left vanilla)")
