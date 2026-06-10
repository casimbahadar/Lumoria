# Monster sprites (drop-in raster art)

Drop a real image here named by its **dex id**:

```
assets/sprites/462.png      # Forgotten Auravian
assets/sprites/3.png        # Calderaeth
...
```

Then register them — either:
- run **`python3 scripts/build_sprite_manifest.py`** (scans this folder, rewrites `manifest.json`), or
- add the id strings to `manifest.json` by hand, e.g. `["3","462"]`.

The game (`getMonsterSpriteURL` in `js/sprites.js`) uses `assets/sprites/<id>.png`
for any id listed in `manifest.json`, and **falls back to the procedural SVG** for
everything else — so you can replace sprites a few at a time without breaking anything.

**Tips for art that fits the game:**
- The creature **cropped on a transparent (or simple) background** — not a full card.
- Square-ish framing (the game renders them at 40–100 px square `<img>`).
- PNG with transparency reads best over the battle/dex backgrounds.
- Consistent style + lighting across the set keeps the dex cohesive.
- Prompt style that works (per your DALL·E examples): describe the **body plan**, the
  **palette**, and "*move the art style away from Nintendo's, keep it cartoon but make it
  unique*" — the per-creature briefs in `docs/forgotten-art-prompts.md` are a starting point.
