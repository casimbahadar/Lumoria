# Trainer / character portraits (drop-in raster art)

Drop a real image here named by the character's **id/key** (same key the game uses):

```
assets/trainers/rex.png          # Gym Leader Rex
assets/trainers/marina.png       # Gym Leader Marina
assets/trainers/aria.png         # Elite Aria
assets/trainers/umbra_shade.png  # Commander Shade
...
```

Gym-leader keys: `rex, marina, pyros, zara, glacier, nyx, oracle, drake, thorne, viper,
atlas, mantis, zephyra, ferro, boulder, seraphina`.
Elite keys: `aria, grimshaw, celeste, titan`. Umbra keys: `umbra_shade,
umbra_commander_kira, umbra_commander_rex_shadow, umbra_commander_phantom, ...`.

Register them with **`python3 scripts/build_sprite_manifest.py`** (or edit
`manifest.json`). `getTrainerSpriteURL` then uses `assets/trainers/<key>.png` and
**falls back to the procedural avatar / emoji** for anything not listed.

Character art briefs (look / palette / prompt) live in `docs/character-art-prompts.md`.
