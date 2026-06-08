#!/usr/bin/env python3
"""Bigger 800-BST creature sprite: Forgotten Abysdrak — the apophis void-serpent.
Procedural: a coiling serpent body (distance-to-polyline) cel-shaded as a rounded
tube, void-black scales with gold star-flecks, a head with glowing eyes swallowing
stars. Rendered to PNG via cairosvg."""
import os, math, hashlib, cairosvg
OUT = "docs/art-samples"; os.makedirs(OUT, exist_ok=True)

W, H = 60, 60
# serpent spine (head -> tail), grid coords; forms an S / coil
ANCH = [(12,14),(22,11),(32,15),(40,24),(37,34),(27,37),(20,31),(21,21),
        (27,18),(36,22),(44,32),(46,44),(38,50),(28,50)]
# cumulative lengths for global param t
segs = list(zip(ANCH, ANCH[1:]))
seglen = [math.hypot(b[0]-a[0], b[1]-a[1]) for a,b in segs]
total = sum(seglen); cum = [0]
for L in seglen: cum.append(cum[-1]+L)

def nearest(px, py):
    best = (1e9, 0.0)
    for i,(a,b) in enumerate(segs):
        ax,ay=a; bx,by=b; dx,dy=bx-ax,by-ay
        L2=dx*dx+dy*dy
        f = 0.0 if L2==0 else max(0,min(1,((px-ax)*dx+(py-ay)*dy)/L2))
        qx,qy=ax+f*dx, ay+f*dy
        d=math.hypot(px-qx,py-qy)
        if d<best[0]:
            t=(cum[i]+f*seglen[i])/total
            best=(d,t)
    return best

def thick(t):                      # body radius along the spine
    base = 2.1 + 4.6*(1-t)**0.85
    if t < 0.10: base += 3.2*(1-t/0.10)   # head bulge
    return base

grid=[['.']*W for _ in range(H)]
val={}
for y in range(H):
    for x in range(W):
        d,t = nearest(x+0.5, y+0.5)
        r = thick(t)
        if d <= r:
            edge = d/r                      # 0 center .. 1 rim
            # rounded-tube + top-light shading
            v = (1-edge)*0.75 + (1 - y/H)*0.25
            val[(x,y)] = (v, edge, t)
lo = min(v for v,_,_ in val.values()); hi = max(v for v,_,_ in val.values())
DK='dk'; MD='md'; HI='hi'; RM='rm'; K='K'
for (x,y),(v,edge,t) in val.items():
    if edge > 0.80: grid[y][x]=K            # outline rim
    else:
        n=(v-lo)/(hi-lo+1e-9)
        grid[y][x]= HI if n>0.72 else (MD if n>0.40 else DK)
# gold star-flecks scattered on the body
for (x,y),(v,edge,t) in val.items():
    if grid[y][x] in (MD,HI) and edge<0.62:
        h=int(hashlib.md5(f"{x},{y}".encode()).hexdigest(),16)
        if h%37==0: grid[y][x]='star'
# head: eyes + jaw at the head end (anchor 0 area)
hx,hy = ANCH[0]
for (ex,ey,ch) in [(hx+2,hy-1,'eye'),(hx+4,hy,'eye'),(hx+2,hy-1,'eye')]:
    if 0<=ey<H and 0<=ex<W and grid[ey][ex]==K or grid[ey][ex] in (DK,MD,HI):
        grid[ey][ex]='eye'
# a fang/maw hint under the head
for (mx,my) in [(hx+5,hy+3),(hx+6,hy+2)]:
    if 0<=my<H and 0<=mx<W and grid[my][mx]!='.': grid[my][mx]='fang'
# background stars near the maw "being swallowed"
for (sx,sy) in [(7,10),(9,7),(5,16),(11,5)]:
    if grid[sy][sx]=='.': grid[sy][sx]='bgstar'

PAL={'K':'#070613','dk':'#171033','md':'#2a1f57','hi':'#473a86','rm':'#322a63',
     'star':'#ffe08a','eye':'#ff5a33','fang':'#f2e9d8','bgstar':'#fff0b0'}
PX=11
rects=[f'<rect x="{x*PX}" y="{y*PX}" width="{PX}" height="{PX}" fill="{PAL[grid[y][x]]}"/>'
       for y in range(H) for x in range(W) if grid[y][x]!='.']
# subtle eye glow halo
gx,gy=(ANCH[0][0]+3)*PX,(ANCH[0][1])*PX
svg=(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W*PX}" height="{H*PX}" '
     f'viewBox="0 0 {W*PX} {H*PX}">'
     f'<defs><radialGradient id="vb" cx="50%" cy="45%" r="75%">'
     f'<stop offset="0%" stop-color="#1a1640"/><stop offset="100%" stop-color="#05030f"/></radialGradient></defs>'
     f'<rect width="100%" height="100%" fill="url(#vb)"/>'
     f'<g shape-rendering="crispEdges">'+"".join(rects)+'</g>'
     f'<circle cx="{gx}" cy="{gy}" r="16" fill="#ff5a33" opacity="0.28"/></svg>')
open(f"{OUT}/lumori-abysdrak-800.svg","w").write(svg)
cairosvg.svg2png(bytestring=svg.encode(), write_to=f"{OUT}/lumori-abysdrak-800.png", scale=2)
print("wrote lumori-abysdrak-800  (grid %dx%d)"%(W,H))
