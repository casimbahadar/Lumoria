#!/usr/bin/env python3
"""(Re)build the sprite manifests after dropping new art into assets/.

Scans assets/sprites/*.png and assets/trainers/*.png and writes each folder's
manifest.json (a JSON array of the file basenames, minus extension). Run this
whenever you add/remove sprite or portrait files:

    python3 scripts/build_sprite_manifest.py
"""
import json, glob, os

def build(folder):
    if not os.path.isdir(folder):
        print(f"{folder}: (missing, skipped)"); return
    keys = [os.path.splitext(os.path.basename(p))[0]
            for p in glob.glob(os.path.join(folder, "*.png"))
            + glob.glob(os.path.join(folder, "*.webp"))
            + glob.glob(os.path.join(folder, "*.jpg"))]
    keys = sorted(set(keys), key=lambda s: (0, int(s)) if s.isdigit() else (1, s))
    with open(os.path.join(folder, "manifest.json"), "w") as f:
        json.dump(keys, f)
        f.write("\n")
    print(f"{folder}: {len(keys)} sprite(s) -> manifest.json")

build("assets/sprites")
build("assets/trainers")
