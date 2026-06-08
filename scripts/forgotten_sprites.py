#!/usr/bin/env python3
"""v1 procedural sprites for all 39 Forgotten Lumori. Silhouette templates
(blob/beast/flyer/humanoid/fish/serpent) + per-creature type palette, cel-shaded
via interior-distance + light direction. Renders a labelled contact sheet PNG."""
import os, math, hashlib, cairosvg
from collections import deque
OUT="docs/art-samples"; os.makedirs(OUT, exist_ok=True)
GW,GH=44,42

def ell(cx,cy,rx,ry):
    return {(x,y) for y in range(GH) for x in range(GW)
            if rx>0 and ry>0 and ((x-cx)/rx)**2+((y-cy)/ry)**2<=1.0}
def rect(x0,y0,x1,y1):
    return {(x,y) for y in range(max(0,y0),min(GH,y1)) for x in range(max(0,x0),min(GW,x1))}
def tri(p0,p1,p2):
    xs=[p0[0],p1[0],p2[0]]; ys=[p0[1],p1[1],p2[1]]; out=set()
    def sign(a,b,c): return (a[0]-c[0])*(b[1]-c[1])-(b[0]-c[0])*(a[1]-c[1])
    for y in range(max(0,min(ys)),min(GH,max(ys)+1)):
        for x in range(max(0,min(xs)),min(GW,max(xs)+1)):
            p=(x+0.3,y+0.3); d1=sign(p,p0,p1); d2=sign(p,p1,p2); d3=sign(p,p2,p0)
            if not(((d1<0)or(d2<0)or(d3<0)) and ((d1>0)or(d2>0)or(d3>0))): out.add((x,y))
    return out

def serpent_mask():
    A=[(9,12),(19,9),(29,12),(36,20),(31,28),(21,29),(16,21),(21,15),(31,18),(38,28),(32,37),(22,38)]
    segs=list(zip(A,A[1:])); sl=[math.hypot(b[0]-a[0],b[1]-a[1]) for a,b in segs]; tot=sum(sl)
    cum=[0]
    for L in sl: cum.append(cum[-1]+L)
    def th(t): return 1.8+3.4*(1-t)**0.8 + (2.4*(1-t/0.12) if t<0.12 else 0)
    m=set()
    for y in range(GH):
        for x in range(GW):
            best=(1e9,0)
            for i,(a,b) in enumerate(segs):
                ax,ay=a;bx,by=b;dx,dy=bx-ax,by-ay;L2=dx*dx+dy*dy
                f=0 if L2==0 else max(0,min(1,((x-ax)*dx+(y-ay)*dy)/L2))
                d=math.hypot(x-(ax+f*dx),y-(ay+f*dy))
                if d<best[0]: best=(d,(cum[i]+f*sl[i])/tot)
            if best[0]<=th(best[1]): m.add((x,y))
    return m,[(A[0][0]+2,A[0][1]-1)]

def template(name):
    if name=="blob":  return (ell(22,26,11,10)|tri((22,8),(12,26),(32,26)), [(18,24),(26,24)])
    if name=="beast": return (ell(20,25,13,8)|ell(33,21,6,6)|rect(11,30,15,38)|rect(16,30,20,38)|rect(24,30,28,38)|rect(29,30,33,38)|ell(7,23,3,3), [(34,20)])
    if name=="flyer": return (ell(22,26,7,11)|ell(22,12,6,6)|tri((22,16),(3,9),(9,31))|tri((22,16),(41,9),(35,31)), [(19,12),(25,12)])
    if name=="human": return (ell(22,10,6,6)|rect(16,16,28,32)|rect(11,17,16,30)|rect(28,17,33,30)|rect(17,32,21,40)|rect(23,32,27,40), [(20,10),(24,10)])
    if name=="fish":  return (ell(19,23,12,8)|tri((8,23),(1,14),(1,32))|tri((19,15),(24,9),(29,15)), [(29,21)])
    if name=="serp":  return serpent_mask()
    raise ValueError(name)

# palette ramps: [outline, dark, mid, light]
RAMP={
 'aether':['#3a3520','#9a8a4e','#e3cf86','#fff5cf'],'crystal':['#241f50','#5a4fa0','#8f86d8','#dcd6ff'],
 'dark':['#120f1c','#2f2740','#544a66','#8073a0'],'electric':['#2a2a10','#9a8a20','#e0c83a','#fff0a0'],
 'primal':['#241606','#7a4a22','#b87a3c','#e8c07a'],'aquatic':['#0a283c','#1f6aa0','#3e9fd0','#9fdcf5'],
 'wind':['#28383e','#6f9aa8','#a8d0dc','#e8f6fb'],'fire':['#2a0d05','#a8330c','#e0641a','#f5a623'],
 'ice':['#163048','#2e6fa0','#74c2ea','#d6f1ff'],'dream':['#241a40','#5a4a8a','#9a86c8','#daccf2'],
 'metal':['#1c2430','#5a6b7c','#9fb3c6','#dfeaf2'],'chrono':['#3a2a12','#8a5e22','#c89a44','#f0d488'],
 'spectral':['#161624','#3a3a5a','#6a6a92','#aaaace'],'stellar':['#0b0922','#241f5c','#4a3f9a','#8f84e6'],
}
ACC={'gold':'#ffe08a','cyan':'#8fe3ff','orange':'#ff8a2a','acid':'#b6f04a','silver':'#e3ecf6',
     'violet':'#bd9cff','white':'#fff4d8','magma':'#ff5a1e'}

# (id, name, template, palette, accent, motif)
SPEC=[
(462,"Auravian","flyer","aether","gold","star"),(463,"Lumarix","flyer","crystal","gold","star"),
(464,"Celestrix","flyer","aether","gold","star"),(465,"Nyxviper","human","dark","cyan",""),
(466,"Morrath","blob","dark","orange","flame"),(467,"Duskmourn","human","crystal","cyan",""),
(468,"Electrak","beast","electric","cyan","spark"),(469,"Arcvolt","blob","electric","gold","spark"),
(470,"Fulgureis","serp","electric","orange",""),(471,"Rootborn","human","primal","acid",""),
(472,"Tellurak","blob","primal","violet","star"),(473,"Gaiasurge","human","primal","magma","flame"),
(474,"Pelagor","fish","aquatic","cyan",""),(475,"Bathykor","fish","aquatic","gold","spark"),
(476,"Tidecrest","serp","aquatic","gold",""),(477,"Aetherveil","blob","aether","gold","star"),
(478,"Zephyrak","flyer","wind","cyan",""),(479,"Skydrak","flyer","wind","gold","star"),
(480,"Pyraeon","beast","fire","gold","flame"),(481,"Emberon","beast","fire","cyan","flame"),
(482,"Dracofire","serp","fire","gold","flame"),(483,"Frigalum","beast","ice","silver",""),
(484,"Cryvorn","beast","ice","cyan",""),(485,"Frostdrax","human","ice","silver",""),
(486,"Psydrak","serp","dream","cyan","star"),(487,"Luneveth","flyer","dream","silver","star"),
(488,"Dreamaith","human","dream","gold","star"),(489,"Ironvast","beast","metal","cyan",""),
(490,"Forgerak","human","metal","orange","flame"),(491,"Alloydrax","human","metal","cyan",""),
(492,"Volteon","human","chrono","cyan","spark"),(493,"Sparkeis","blob","aether","cyan","spark"),
(494,"Thunderax","human","chrono","magma","spark"),(495,"Nihilax","human","spectral","violet",""),
(496,"Vantarix","human","dark","gold","star"),(497,"Abysdrak","serp","stellar","gold","star"),
(498,"Cosmolith","blob","stellar","gold","star"),(499,"Stardrax","blob","stellar","white","flame"),
(500,"Stellarion","human","stellar","gold","star"),
]

def shade(mask):
    if not mask: return {}
    dist={}; dq=deque()
    for (x,y) in mask:
        if any((x+dx,y+dy) not in mask for dx,dy in((1,0),(-1,0),(0,1),(0,-1))):
            dist[(x,y)]=1; dq.append((x,y))
    while dq:
        cx,cy=dq.popleft()
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            n=(cx+dx,cy+dy)
            if n in mask and n not in dist: dist[n]=dist[(cx,cy)]+1; dq.append(n)
    mx=sum(x for x,y in mask)/len(mask); my=sum(y for x,y in mask)/len(mask)
    dmax=max(dist.values())
    raw={p:0.55*(dist[p]/dmax)+0.45*((mx-p[0])*0.5+(my-p[1])*0.9) for p in mask}
    lo,hi=min(raw.values()),max(raw.values())
    out={}
    for p in mask:
        if dist[p]==1: out[p]=0          # outline
        else:
            n=(raw[p]-lo)/(hi-lo+1e-9); out[p]=3 if n>0.66 else (2 if n>0.36 else 1)
    return out,dist,my

def make(spec):
    iid,nm,tpl,pal,acc,motif=spec
    mask,eyes=template(tpl); tones,dist,my=shade(mask)
    ramp=RAMP[pal]; a=ACC[acc]; px={}
    for p,t in tones.items(): px[p]=ramp[t]
    if motif=="star":
        for p in mask:
            if dist[p]>2 and int(hashlib.md5(f"{iid}{p}".encode()).hexdigest(),16)%19==0: px[p]=a
    if motif=="flame":
        for p in mask:
            if dist[p]==2 and p[1]<my: px[p]=a
    if motif=="spark":
        for p in mask:
            if dist[p]>2 and int(hashlib.md5(f"{iid}{p}".encode()).hexdigest(),16)%41==0: px[p]=a
    for (ex,ey) in eyes:
        for dx in (0,):
            if (ex+dx,ey) in mask: px[(ex+dx,ey)]='#0a0a14'
        if (ex,ey-1) in mask or (ex,ey) in mask: px[(ex,ey-1)]=a; px[(ex,ey)]=a  # glowing eye
    return px

# ---- contact sheet ----
S=3.2; CW=int(GW*S)+24; CH=int(GH*S)+34; COLS=6
ROWS=(len(SPEC)+COLS-1)//COLS
parts=[f'<rect width="{CW*COLS}" height="{CH*ROWS}" fill="#11131c"/>']
for i,spec in enumerate(SPEC):
    r,c=divmod(i,COLS); ox,oy=c*CW+12,r*CH+8
    parts.append(f'<rect x="{ox-4}" y="{oy-2}" width="{CW-16}" height="{CH-14}" rx="8" fill="#1b1e2b" stroke="#2c3142"/>')
    px=make(spec)
    g=[f'<rect x="{ox+x*S:.1f}" y="{oy+y*S:.1f}" width="{S+0.5:.1f}" height="{S+0.5:.1f}" fill="{col}"/>'
       for (x,y),col in px.items()]
    parts.append('<g shape-rendering="crispEdges">'+"".join(g)+'</g>')
    parts.append(f'<text x="{ox+GW*S/2:.0f}" y="{oy+CH-16}" text-anchor="middle" font-family="monospace" '
                 f'font-size="11" fill="#cdd3e0">#{spec[0]} {spec[1]}</text>')
svg=(f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW*COLS}" height="{CH*ROWS}" '
     f'viewBox="0 0 {CW*COLS} {CH*ROWS}">'+"".join(parts)+'</svg>')
open(f"{OUT}/forgotten-sprites-v1.svg","w").write(svg)
cairosvg.svg2png(bytestring=svg.encode(), write_to=f"{OUT}/forgotten-sprites-v1.png", scale=1.4)
print(f"wrote contact sheet: {len(SPEC)} sprites, {COLS}x{ROWS}")
