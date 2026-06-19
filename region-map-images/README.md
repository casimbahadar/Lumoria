# Region map cleanup — before/after renders

Screenshots captured while de-cluttering the world map (PR: map-layout-respacing).
Goal: clean, branching, single-line roads (fewer redundant loop "boxes"),
like a classic region map. Routes are invisible waypoints; the visible
"squares" are road loops (cycles) — cleanup breaks redundant loop edges
(edges-only: no areas/encounters/dex changed; all areas stay reachable).

| Region | Before | After | Change |
|---|---|---|---|
| Center (Bloomhaven) | center-before.png | center-after.png | reposition Route 2/9/10; removed redundant Murk Crossing (Nadiril relocated) |
| Miasma City | miasma-before.png | miasma-after.png | broke Toxic Bog↔Mire Depths↔Miasma triangle loop; straightened bog corridor |
| North (Storm Plateau) | north-before.png | north-after.png | de-boxed the 5-way Storm Plateau hub; cut 5 redundant loop edges |

Redundant loop count (whole map): 20 → 15 so far.
