#!/usr/bin/env python3
"""v2 procedural sprites for all 39 Forgotten Lumori — per-archetype silhouettes +
polished 5-tone cel-shading (interior-distance + light dir + rim-light), with a
signature feature per creature (wings/halo/horns/mane/slab/scythe/lure/fins/leaf/
gear/flame/star-flecks). Renders a contact sheet PNG."""
import os, math, hashlib, cairosvg
from collections import deque
OUT="docs/art-samples"; os.makedirs(OUT, exist_ok=True)
GW,GH=50,50; CX=25
def H(s): return int(hashlib.md5(s.encode()).hexdigest(),16)

def ell(cx,cy,rx,ry):
    return {(x,y) for y in range(GH) for x in range(GW) if rx>0 and ry>0 and ((x-cx)/rx)**2+((y-cy)/ry)**2<=1}
def rect(x0,y0,x1,y1):
    return {(x,y) for y in range(max(0,y0),min(GH,y1)) for x in range(max(0,x0),min(GW,x1))}
def tri(p0,p1,p2):
    xs=[p[0] for p in(p0,p1,p2)];ys=[p[1] for p in(p0,p1,p2)];o=set()
    sg=lambda a,b,c:(a[0]-c[0])*(b[1]-c[1])-(b[0]-c[0])*(a[1]-c[1])
    for y in range(max(0,min(ys)),min(GH,max(ys)+1)):
        for x in range(max(0,min(xs)),min(GW,max(xs)+1)):
            p=(x+.4,y+.4);d=[sg(p,p0,p1),sg(p,p1,p2),sg(p,p2,p0)]
            if not(any(v<0 for v in d) and any(v>0 for v in d)): o.add((x,y))
    return o

def serpent():
    A=[(11,15),(22,11),(33,15),(40,24),(34,33),(24,34),(19,25),(24,18),(34,21),(42,32),(35,42),(25,43)]
    sg=list(zip(A,A[1:]));sl=[math.hypot(b[0]-a[0],b[1]-a[1]) for a,b in sg];tot=sum(sl);cum=[0]
    for L in sl:cum.append(cum[-1]+L)
    th=lambda t:2.0+3.8*(1-t)**.8+(2.6*(1-t/.12) if t<.12 else 0)
    m=set()
    for y in range(GH):
        for x in range(GW):
            bd,bt=1e9,0
            for i,(a,b) in enumerate(sg):
                ax,ay=a;bx,by=b;dx,dy=bx-ax,by-ay;L2=dx*dx+dy*dy
                f=0 if L2==0 else max(0,min(1,((x-ax)*dx+(y-ay)*dy)/L2))
                d=math.hypot(x-(ax+f*dx),y-(ay+f*dy))
                if d<bd:bd,bt=d,(cum[i]+f*sl[i])/tot
            if bd<=th(bt):m.add((x,y))
    return m,[(A[0][0]+2,A[0][1]-1)],(A[0][0]+2,A[0][1])

def body(name):
    if name=="blob": return ell(CX,32,12,10)|tri((CX,9),(13,32),(37,32)),[(21,30),(29,30)],(CX,13)
    if name=="orb":  return ell(CX,29,15,15),[(20,26),(30,26)],(CX,15)
    if name=="serp": return serpent()
    if name=="quad": return (ell(23,32,16,9)|ell(40,26,7,7)|rect(11,38,16,47)|rect(17,38,22,47)|rect(26,38,31,47)|rect(33,38,38,47)|ell(6,29,4,3)),[(42,25)],(40,20)
    if name=="avian":return (ell(CX,33,8,12)|ell(CX,15,7,7)|tri((CX,18),(2,8),(8,34))|tri((CX,18),(48,8),(42,34))|tri((CX,44),(20,40),(30,40))),[(22,15),(28,15)],(CX,9)
    if name=="seraph":return (ell(CX,31,8,12)|ell(CX,14,7,7)|tri((CX,16),(3,6),(7,22))|tri((CX,16),(47,6),(43,22))|tri((CX,24),(2,20),(8,34))|tri((CX,24),(48,20),(42,34))|tri((CX,30),(6,30),(12,42))|tri((CX,30),(44,30),(38,42))),[(22,14),(28,14)],(CX,8)
    if name=="titan":return (ell(CX,11,7,7)|rect(14,17,36,36)|rect(8,18,15,34)|rect(35,18,42,34)|rect(16,36,23,48)|rect(27,36,34,48)),[(21,11),(29,11)],(CX,5)
    if name=="robed":return (ell(CX,12,6,6)|tri((CX,16),(11,47),(39,47))|rect(18,16,32,30)),[(22,12),(28,12)],(CX,7)
    if name=="wraith":return (ell(CX,13,6,6)|tri((CX,18),(14,46),(36,46))|rect(19,17,31,30)),[(22,13),(28,13)],(CX,8)
    if name=="fish": return (ell(22,29,15,9)|tri((8,29),(1,18),(1,40))|tri((23,18),(28,11),(33,18))),[(33,27)],(28,19)
    if name=="fairy":return (ell(CX,32,5,8)|ell(CX,20,5,5)|ell(15,26,7,9)|ell(35,26,7,9)),[(23,20),(27,20)],(CX,15)
    raise ValueError(name)

RAMP={
 'aether':['#3a3520','#8a7a40','#c9b566','#ecd98e','#fff7d8'],'crystal':['#221d4a','#4a4090','#7a70c8','#a99ff0','#e4e0ff'],
 'dark':['#0e0b16','#272035','#463c5a','#6a5d84','#9a8cb8'],'electric':['#262610','#7a6e1a','#cdb02e','#f0d84a','#fff6b0'],
 'primal':['#22150a','#6a3f1e','#9c6630','#c89048','#ecc888'],'aquatic':['#0a2436','#1a5e92','#2f8cc0','#5fb6e6','#aae6fb'],
 'wind':['#26363c','#5f8a98','#92bcca','#c2e2ec','#f0fbff'],'fire':['#260b04','#94300c','#cc5616','#ee851f','#ffc14a'],
 'ice':['#143048','#2a6498','#4f9fd0','#84cbef','#d8f2ff'],'dream':['#201638','#4e3f7c','#7e6cb4','#ab97da','#e0d2f6'],
 'metal':['#19212c','#4e5d6e','#7e90a2','#aabccc','#e2eef6'],'chrono':['#33260f','#7a5220','#b0863a','#d8b258','#f6dc92'],
 'spectral':['#13131f','#33334e','#565680','#7e7ea8','#b0b0d2'],'stellar':['#0a0820','#201b54','#403793','#6a5fc8','#a89ff0'],
}
ACC={'gold':'#ffe08a','cyan':'#8fe3ff','orange':'#ff8a2a','acid':'#b6f04a','silver':'#e3ecf6','violet':'#bd9cff','white':'#fff4d8','magma':'#ff5a1e'}

def shade(mask,ramp):
    dist={};dq=deque()
    for p in mask:
        x,y=p
        if any((x+a,y+b) not in mask for a,b in((1,0),(-1,0),(0,1),(0,-1))): dist[p]=1;dq.append(p)
    while dq:
        x,y=dq.popleft()
        for a,b in((1,0),(-1,0),(0,1),(0,-1)):
            n=(x+a,y+b)
            if n in mask and n not in dist: dist[n]=dist[(x,y)]+1;dq.append(n)
    mx=sum(x for x,y in mask)/len(mask);my=sum(y for x,y in mask)/len(mask)
    dmax=max(dist.values())
    raw={p:.55*(dist[p]/dmax)+.45*((mx-p[0])*.5+(my-p[1])*.9) for p in mask}
    lo,hi=min(raw.values()),max(raw.values());px={}
    for p in mask:
        if dist[p]==1: px[p]=ramp[0]
        else:
            n=(raw[p]-lo)/(hi-lo+1e-9)
            px[p]=ramp[4] if n>.82 else ramp[3] if n>.58 else ramp[2] if n>.32 else ramp[1]
    return px,dist,(my,mx)

def feat(px,mask,dist,head,acc,ramp,name,iid):
    hx,hy=head; A=acc
    def put(x,y,c):
        if 0<=x<GW and 0<=y<GH: px[(x,y)]=c
    if name=="starflecks":
        for p in mask:
            if dist.get(p,0)>2 and H(f"{iid}{p}")%17==0: px[p]=A
    elif name=="flame":
        for dx in range(-4,5):
            t=1-abs(dx)/5;
            for yy in range(int(2+5*t)):
                put(hx+dx,hy-1-yy, A if yy<2 else ramp[4])
    elif name=="halo":
        for a in range(0,360,18):
            put(hx+round(9*math.cos(math.radians(a))),hy-6+round(4*math.sin(math.radians(a))),A)
    elif name=="horns":
        for s in(-1,1):
            for k in range(4): put(hx+s*(3+k),hy-3-k,ramp[3] if k<2 else A)
    elif name=="crown":
        for dx in(-4,-2,0,2,4): put(hx+dx,hy-4,A);
        for dx in(-3,3): put(hx+dx,hy-6,A)
    elif name=="mane":
        for a in range(0,360,20):
            put(hx+round(10*math.cos(math.radians(a))),hy+6+round(9*math.sin(math.radians(a))),ramp[1])
    elif name=="slab":
        for x in range(hx-11,hx+12):
            for y in range(hy-12,hy-6):
                put(x,y,ramp[2] if y>hy-11 else ramp[3])
        for x in range(hx-11,hx+12): put(x,hy-6,ramp[0]); put(x,hy-12,ramp[0])
    elif name=="scythe":
        for k in range(16): put(hx+10,hy-6+k,ramp[1])
        for k in range(7): put(hx+10-k,hy-6+abs(k-3),A)
    elif name=="lure":
        for k in range(5): put(hx,hy-3-k,ramp[3])
        put(hx,hy-8,A);put(hx-1,hy-8,A);put(hx,hy-9,A)
    elif name=="fins":
        for p in list(mask):
            x,y=p
            if dist.get(p,0)==1 and y<sum(q[1] for q in mask)/len(mask) and H(f"{iid}f{p}")%5==0: px[p]=A
    elif name=="gear":
        for a in range(0,360,30):
            put(hx+round(11*math.cos(math.radians(a))),hy+12+round(11*math.sin(math.radians(a))),A)
    elif name=="leaf":
        for dx,dy in[(0,-2),(0,-3),(-1,-4),(1,-4),(-2,-5),(2,-5),(0,-5)]: put(hx+dx,hy+dy,ACC['acid'])
    elif name=="spark":
        for dx in(-3,0,3,-1,2): put(hx+dx,hy-2,A)
    # eyes glow drawn by caller

SPEC=[
(462,"Auravian","avian","aether","gold","halo"),(463,"Lumarix","avian","crystal","gold","starflecks"),
(464,"Celestrix","seraph","aether","gold","halo"),(465,"Nyxviper","wraith","dark","cyan","scythe"),
(466,"Morrath","blob","dark","orange","flame"),(467,"Duskmourn","robed","crystal","cyan","gear"),
(468,"Electrak","quad","electric","cyan","spark"),(469,"Arcvolt","orb","electric","gold","spark"),
(470,"Fulgureis","serp","electric","orange","horns"),(471,"Rootborn","robed","primal","acid","leaf"),
(472,"Tellurak","orb","primal","violet","starflecks"),(473,"Gaiasurge","titan","primal","magma","slab"),
(474,"Pelagor","fish","aquatic","cyan","fins"),(475,"Bathykor","fish","aquatic","gold","lure"),
(476,"Tidecrest","serp","aquatic","gold","fins"),(477,"Aetherveil","wraith","aether","gold","starflecks"),
(478,"Zephyrak","avian","wind","cyan","horns"),(479,"Skydrak","avian","wind","gold","starflecks"),
(480,"Pyraeon","quad","fire","gold","mane"),(481,"Emberon","quad","fire","cyan","flame"),
(482,"Dracofire","serp","fire","gold","horns"),(483,"Frigalum","quad","ice","silver","spark"),
(484,"Cryvorn","quad","ice","cyan","mane"),(485,"Frostdrax","titan","ice","silver","horns"),
(486,"Psydrak","serp","dream","cyan","starflecks"),(487,"Luneveth","fairy","dream","silver","starflecks"),
(488,"Dreamaith","robed","dream","gold","crown"),(489,"Ironvast","quad","metal","cyan","spark"),
(490,"Forgerak","titan","metal","orange","flame"),(491,"Alloydrax","titan","metal","cyan","crown"),
(492,"Volteon","robed","chrono","cyan","gear"),(493,"Sparkeis","orb","aether","cyan","gear"),
(494,"Thunderax","robed","chrono","magma","scythe"),(495,"Nihilax","wraith","spectral","violet","starflecks"),
(496,"Vantarix","wraith","dark","gold","starflecks"),(497,"Abysdrak","serp","stellar","gold","starflecks"),
(498,"Cosmolith","orb","stellar","gold","gear"),(499,"Stardrax","orb","stellar","white","flame"),
(500,"Stellarion","robed","stellar","gold","crown"),
]

def make(s):
    iid,nm,bt,pal,acc,ft=s
    mask,eyes,head=body(bt);ramp=RAMP[pal];A=ACC[acc]
    px,dist,_=shade(mask,ramp)
    feat(px,mask,dist,head,A,ramp,ft,iid)
    for (ex,ey) in eyes:
        for dx,dy in((0,0),(0,-1)):
            if (ex+dx,ey+dy) in mask: px[(ex+dx,ey+dy)]='#0b0b16'
        px[(ex,ey)]=A
    return px

S=3.0;CW=int(GW*S)+22;CH=int(GH*S)+30;COLS=6;ROWS=(len(SPEC)+COLS-1)//COLS
parts=[f'<defs><radialGradient id="cell" cx="50%" cy="42%" r="70%"><stop offset="0%" stop-color="#222637"/><stop offset="100%" stop-color="#161924"/></radialGradient></defs>',
       f'<rect width="{CW*COLS}" height="{CH*ROWS}" fill="#0e1018"/>']
for i,s in enumerate(SPEC):
    r,c=divmod(i,COLS);ox,oy=c*CW+10,r*CH+8
    parts.append(f'<rect x="{ox-4}" y="{oy-2}" width="{CW-12}" height="{CH-12}" rx="9" fill="url(#cell)" stroke="#313850"/>')
    px=make(s)
    parts.append('<g shape-rendering="crispEdges">'+"".join(
        f'<rect x="{ox+x*S:.1f}" y="{oy+y*S:.1f}" width="{S+0.4:.1f}" height="{S+0.4:.1f}" fill="{c}"/>' for (x,y),c in px.items())+'</g>')
    parts.append(f'<text x="{ox+GW*S/2:.0f}" y="{oy+CH-12}" text-anchor="middle" font-family="monospace" font-size="11" fill="#d5dbe8">#{s[0]} {s[1]}</text>')
svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW*COLS}" height="{CH*ROWS}" viewBox="0 0 {CW*COLS} {CH*ROWS}">'+"".join(parts)+'</svg>'
open(f"{OUT}/forgotten-sprites-v2.svg","w").write(svg)
cairosvg.svg2png(bytestring=svg.encode(), write_to=f"{OUT}/forgotten-sprites-v2.png", scale=1.5)
print("wrote v2 contact sheet")
