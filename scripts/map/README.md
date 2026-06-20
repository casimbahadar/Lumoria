# World-map dev tooling

Helper scripts for working on the world map (`renderWorldMap` in `js/game.js`,
`WORLD_DATA` in `js/data.js`). They drive the real game in headless Chromium and read
the actual rendered DOM, so what they measure is what a player sees.

## Setup

Serve the repo root, then run any script from the repo root:

```bash
python3 -m http.server 8123 &        # serve index.html + js/ + css/
node scripts/map/render-map.js ngplus /tmp/map.png
```

Paths to Chromium / Playwright and the server URL default to this managed environment;
override with `CHROME_PATH`, `PW_MODULE`, `MAP_BASE_URL` if yours differ (see `lib.js`).

## Scripts

| Script | What it does |
| --- | --- |
| `render-map.js [ngplus\|base] [out.png] [badges]` | High-res full-map screenshot. |
| `zoom-map.js <x> <y> <w> <h> [ngplus\|base] [out.png]` | Crop a region (coords in 0–100 map %). |
| `check-overlaps.js [ngplus\|base]` | Reports label↔label and label↔marker collisions from the DOM. Exit ≠0 on any hit. |
| `check-reachability.js [base\|ngplus]` | BFS from `seedvale` using the game's own `connsOf()`; flags stranded areas. Exit ≠0 if any. |

Always also run the repo's integrity gate: `node scripts/validate.js`.

## Map conventions (as of the map-layout-respacing work)

### Marker shapes (`renderWorldMap`)
- `type:"city"` → red square; `type:"town"` → blue circle; `type:"special"` / landmark routes → triangle.
- **Name override:** any area whose name contains `Town` or `Village` renders as a blue
  circle even if coded `type:"city"`. So shapes can be controlled purely by naming
  (e.g. "Dauntridge City" → square, "Clarion Town" / "Silkwood Village" → circle).

### Name-label placement (`bestLabelSide` + `LABEL_POS`, `js/game.js`)
- `LABEL_POS[areaId]` pins a name to `"top"|"bottom"|"left"|"right"`; it always wins.
- Otherwise `bestLabelSide` scores all four sides and picks the cheapest: a road exiting
  toward a side is heavily penalised (names never sit on roads), map edges are penalised
  (names stay on-screen), and a neighbouring marker is mildly penalised (keeps spacing).
- After any label change, run `check-overlaps.js`. Fix a reported collision by pinning the
  offending area to a clear side in `LABEL_POS`.

### NG+-only road topology (`connsOf` + `NG_PLUS_ADD_EDGES` / `NG_PLUS_HIDE_EDGES`)
- Connections drive the **map visuals + road lighting only** — `travelTo` is gated by
  badges/champion/NG+ flags, not by roads.
- `connsOf(areaId)` returns an area's connections with the NG+-only overrides applied
  (extra edges added, listed edges hidden) when `G.ngPlusCount > 0`; the base map is
  untouched. All map read-sites (labels, dead-end icons, road orientation, road drawing)
  go through `connsOf`, so add future NG+-only route tweaks there.
- After any connection edit, run `check-reachability.js` to confirm nothing is stranded.

### Rendering notes
- Roads are drawn in layers (all shadows, then all yellow, then all highlights) so the
  yellow flows continuously through shared nodes (no "chain-link" at intersections).
- Land vs water tint per road segment comes from `isOceanPct` (the in-browser test is
  authoritative; a standalone Node re-implementation drifts from the bézier biomes).
