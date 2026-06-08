#!/usr/bin/env python3
"""Attempt 2: an illustrative character portrait (cel-shaded anime bust) +
a procedurally-shaded, symmetric creature sprite. Render to PNG via cairosvg."""
import os, cairosvg
OUT = "docs/art-samples"; os.makedirs(OUT, exist_ok=True)

# ============================================================ Nylara — character portrait
# Cel-shaded anime bust: ice-walker with silver hair, fur hood, ice-steel pauldron.
NYLARA = '''<svg xmlns="http://www.w3.org/2000/svg" width="360" height="440" viewBox="0 0 360 440">
<defs>
 <radialGradient id="bg" cx="50%" cy="42%" r="70%">
   <stop offset="0%" stop-color="#bfe1f4"/><stop offset="55%" stop-color="#7fa9cc"/><stop offset="100%" stop-color="#3f6489"/>
 </radialGradient>
 <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
   <stop offset="0%" stop-color="#e8f1f8"/><stop offset="45%" stop-color="#9fb3c6"/><stop offset="100%" stop-color="#5f7governed788"/></linearGradient>
 <linearGradient id="steel2" x1="0" y1="0" x2="1" y2="1">
   <stop offset="0%" stop-color="#eef5fb"/><stop offset="50%" stop-color="#aebfce"/><stop offset="100%" stop-color="#6c8398"/></linearGradient>
 <radialGradient id="iris" cx="50%" cy="38%" r="62%">
   <stop offset="0%" stop-color="#d6f3ff"/><stop offset="45%" stop-color="#5fc0ee"/><stop offset="100%" stop-color="#1c6fae"/></radialGradient>
</defs>
<rect width="360" height="440" fill="url(#bg)"/>
<ellipse cx="180" cy="250" rx="200" ry="150" fill="#2c4a68" opacity="0.18"/>

<!-- falling snow -->
<g fill="#ffffff" opacity="0.85">
 <circle cx="60" cy="70" r="3"/><circle cx="300" cy="120" r="2.4"/><circle cx="110" cy="160" r="2"/>
 <circle cx="270" cy="60" r="2.6"/><circle cx="40" cy="200" r="2"/><circle cx="330" cy="240" r="2.2"/>
 <circle cx="90" cy="300" r="2"/><circle cx="320" cy="330" r="2.4"/>
</g>

<!-- ===== shoulders / parka ===== -->
<path d="M70 440 C72 360 110 330 180 330 C250 330 288 360 290 440 Z" fill="#243a55" stroke="#15243a" stroke-width="2.5"/>
<path d="M180 330 C150 330 130 345 120 440 L150 440 C150 380 165 350 180 345 Z" fill="#2e4a6b" opacity="0.8"/>
<!-- fur collar -->
<g fill="#eef0e2" stroke="#c9cbb6" stroke-width="1.5">
 <path d="M118 352 q12 -20 26 -8 q12 -18 26 -6 q14 -16 22 -2 q14 -14 24 2 q12 -10 20 6 q10 6 6 24 q-60 -16 -134 6 q-8 -16 -16 -22 z"/>
</g>
<!-- ice-steel pauldron (left shoulder, her relic) -->
<g transform="translate(96 360)">
 <path d="M0 22 C-6 -2 18 -16 44 -10 C66 -4 70 18 60 40 C40 30 16 30 -2 40 Z" fill="url(#steel2)" stroke="#3c5067" stroke-width="2.2"/>
 <path d="M6 14 C18 4 40 4 52 14" fill="none" stroke="#eef5fb" stroke-width="2" opacity="0.7"/>
 <circle cx="30" cy="22" r="4" fill="#cfe6f5" stroke="#3c5067" stroke-width="1.4"/>
</g>

<!-- ===== neck ===== -->
<path d="M162 300 q18 22 36 0 l0 34 q-18 14 -36 0 z" fill="#f0cbb1"/>
<path d="M162 300 q18 22 36 0 l0 14 q-18 16 -36 0 z" fill="#dcb097" opacity="0.7"/>

<!-- ===== hair (back) ===== -->
<path d="M104 210 C96 120 140 70 180 70 C220 70 264 120 256 210 C272 270 250 320 235 335 C250 250 235 175 235 160 L125 160 C125 175 110 250 125 335 C110 320 88 270 104 210 Z" fill="#dfe8f2" stroke="#aebccd" stroke-width="2"/>

<!-- ===== face ===== -->
<path d="M134 175 C134 130 150 104 180 104 C210 104 226 130 226 175 C226 220 206 256 180 262 C154 256 134 220 134 175 Z" fill="#f7d9c2"/>
<!-- cheek shade + blush -->
<path d="M134 175 C134 210 150 248 180 258 C172 250 150 222 150 175 C150 140 160 116 180 110 C156 110 134 138 134 175 Z" fill="#e8bda3" opacity="0.55"/>
<ellipse cx="156" cy="210" rx="11" ry="6" fill="#f3a98c" opacity="0.45"/>
<ellipse cx="204" cy="210" rx="11" ry="6" fill="#f3a98c" opacity="0.45"/>

<!-- ===== eyes ===== -->
<g>
 <!-- left -->
 <path d="M146 188 q14 -12 30 -2 l-2 8 q-14 -8 -28 0 z" fill="#3a2b3a"/>
 <ellipse cx="160" cy="198" rx="11" ry="13" fill="#ffffff"/>
 <ellipse cx="161" cy="199" rx="9" ry="12" fill="url(#iris)"/>
 <circle cx="161" cy="200" r="4.5" fill="#13314e"/>
 <circle cx="157.5" cy="194.5" r="3" fill="#ffffff"/><circle cx="164" cy="204" r="1.6" fill="#ffffff" opacity="0.8"/>
 <path d="M148 187 q14 -10 28 -2" fill="none" stroke="#caa089" stroke-width="3" stroke-linecap="round"/>
 <!-- right -->
 <path d="M184 186 q16 -10 30 2 l-2 8 q-14 -8 -26 0 z" fill="#3a2b3a"/>
 <ellipse cx="200" cy="198" rx="11" ry="13" fill="#ffffff"/>
 <ellipse cx="199" cy="199" rx="9" ry="12" fill="url(#iris)"/>
 <circle cx="199" cy="200" r="4.5" fill="#13314e"/>
 <circle cx="195.5" cy="194.5" r="3" fill="#ffffff"/><circle cx="202" cy="204" r="1.6" fill="#ffffff" opacity="0.8"/>
 <path d="M184 185 q15 -9 30 1" fill="none" stroke="#caa089" stroke-width="3" stroke-linecap="round"/>
</g>
<!-- nose + mouth -->
<path d="M178 214 q4 6 0 9" fill="none" stroke="#d9a98c" stroke-width="2" stroke-linecap="round"/>
<path d="M168 234 q12 8 24 0" fill="none" stroke="#b06a52" stroke-width="2.4" stroke-linecap="round"/>

<!-- ===== hair (front bangs) ===== -->
<path d="M128 168 C124 120 150 92 180 92 C210 92 236 120 232 168 C224 150 214 140 206 150 C202 128 196 120 188 132 C182 116 170 116 164 134 C156 120 148 130 150 152 C142 140 132 150 128 168 Z" fill="#eef3f9" stroke="#bcc8d8" stroke-width="2"/>
<path d="M204 150 C210 140 222 150 226 166 C220 156 212 154 206 162 Z" fill="#cdd8e6"/>
<path d="M150 152 C146 142 136 150 132 166 C140 156 146 156 152 162 Z" fill="#cdd8e6"/>
<!-- side lock + frost streak -->
<path d="M232 168 q12 60 -2 110 q-2 -70 -10 -108 z" fill="#dfe8f2" stroke="#bcc8d8" stroke-width="1.5"/>
<path d="M128 168 q-12 60 2 110 q2 -70 10 -108 z" fill="#dfe8f2" stroke="#bcc8d8" stroke-width="1.5"/>

<!-- fur hood over the back of the head -->
<g fill="#eef0e2" stroke="#c9cbb6" stroke-width="1.6" opacity="0.98">
 <path d="M96 150 q14 -22 30 -8 q10 -26 30 -10 q24 -22 48 -10 q22 -14 36 4 q18 8 14 34 q-22 -20 -40 -14 q-18 -16 -38 -8 q-22 -14 -42 -2 q-20 -8 -34 6 q-6 8 -4 18 q-8 -8 -12 -20 q4 -10 12 -10 z"/>
</g>

<!-- name plate -->
<rect x="86" y="402" width="188" height="30" rx="8" fill="#16263b" opacity="0.85" stroke="#cfe6f5" stroke-width="1.5"/>
<text x="180" y="422" text-anchor="middle" font-family="Georgia, serif" font-size="17" fill="#eaf4fc" font-weight="bold" letter-spacing="2">NYLARA</text>
</svg>'''.replace("5f7governed788","5f7788")

# ============================================================ procedural creature sprite
def build_creature():
    W,H = 34, 38
    cx = (W-1)/2.0
    cy, R = 23.0, 12.0     # lower body circle
    apex = 7.0             # teardrop top
    def inside(x,y):
        if (x-cx)**2 + (y-cy)**2 <= R*R: return True
        if apex <= y <= cy:
            hw = R*(y-apex)/(cy-apex)
            return abs(x-cx) <= hw
        return False
    grid = [['.']*W for _ in range(H)]
    lit = {}
    for y in range(H):
        for x in range(W):
            if inside(x,y):
                lit[(x,y)] = (cx-x)*0.45 + (cy-y)*0.95   # light from upper-left
    lo, hi = min(lit.values()), max(lit.values())
    def band(v, ramp):
        t = (v-lo)/(hi-lo+1e-9)
        return ramp[min(len(ramp)-1, int(t*len(ramp)))]
    body = ['d','g','G','w']          # dark->light green
    belly = ['cs','c','cw']
    for (x,y),v in lit.items():
        # belly = lower-central ellipse
        if ((x-cx)/6.5)**2 + ((y-(cy+3))/8.5)**2 <= 1:
            grid[y][x] = band(v, belly)
        else:
            grid[y][x] = band(v, body)
    # leaf sprout on top
    for (dx,dy,ch) in [(0,-2,'G'),(0,-3,'G'),(0,-4,'g'),(-1,-4,'G'),(1,-4,'G'),(-2,-5,'g'),(2,-5,'g'),(0,-6,'g')]:
        gx,gy = int(round(cx))+dx, int(round(apex))+dy
        if 0<=gy<H and 0<=gx<W: grid[gy][gx]=ch
    # outline (inside pixel with an outside 4-neighbour)
    for y in range(H):
        for x in range(W):
            if grid[y][x] not in ('.','K') :
                for nx,ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                    if not (0<=nx<W and 0<=ny<H) or grid[ny][nx]=='.':
                        grid[y][x]='K'; break
    # feet
    for fx in (int(cx)-5, int(cx)+5):
        for (dx,dy) in [(0,0),(1,0),(0,1),(1,1)]:
            gy=int(cy+R-1)+dy; gx=fx+dx
            if 0<=gy<H and 0<=gx<W: grid[gy][gx]='K' if dy==1 else 'g'
    # eyes (symmetric) — white + dark pupil + highlight
    for ex in (int(cx)-4, int(cx)+4):
        ey=int(cy)-2
        for (dx,dy,ch) in [(0,-1,'wht'),(1,-1,'wht'),(0,0,'eye'),(1,0,'eye'),(0,1,'eye'),(1,1,'wht'),(0,-1,'wht')]:
            gx,gy=ex+dx,ey+dy
            if 0<=gy<H and 0<=gx<W: grid[gy][gx]=ch
        grid[ey][ex]='hl'  # top highlight
    PAL = {'K':'#16401e','d':'#2f6a37','g':'#4aa14b','G':'#79c764','w':'#cdee9f',
           'cs':'#d8caa0','c':'#f0e6c6','cw':'#fdf7df','eye':'#16301d','wht':'#ffffff','hl':'#ffffff'}
    PX=14
    rects=[f'<rect x="{x*PX}" y="{y*PX}" width="{PX}" height="{PX}" fill="{PAL[grid[y][x]]}"/>'
           for y in range(H) for x in range(W) if grid[y][x]!='.']
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W*PX}" height="{H*PX}" '
            f'viewBox="0 0 {W*PX} {H*PX}" shape-rendering="crispEdges">'
            f'<rect width="100%" height="100%" fill="#eef3f7"/>'+"".join(rects)+'</svg>')

CREATURE = build_creature()
for name,svg in [("wielder-nylara-portrait",NYLARA),("lumori-sproutle-gen4",CREATURE)]:
    open(f"{OUT}/{name}.svg","w").write(svg)
    cairosvg.svg2png(bytestring=svg.encode(), write_to=f"{OUT}/{name}.png", scale=2)
    print("wrote", name)
