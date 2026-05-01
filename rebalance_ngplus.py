#!/usr/bin/env python3
"""Rebalance NG+ Lumori BSTs (IDs 322-401) and set legend rarities."""

import re, sys

TARGETS = {
    # Tier 1a  badges 1-5  ~400 BST
    322:400, 323:400, 324:400, 325:405, 326:405,
    327:420, 328:400, 329:420, 330:420, 331:400,
    # Tier 1b  badges 8-11  ~460 BST
    332:460, 333:455, 334:470, 335:455, 336:455,
    337:470, 338:455, 339:460, 340:460, 341:460,
    # Tier 2   badges 12-16  ~490 BST
    342:495, 343:490, 344:490, 345:495, 346:490,
    347:500, 348:495, 349:495, 350:495, 351:490,
    # Tier 3   requiresChampion  ~515 BST
    352:515, 353:520, 354:515, 355:515, 356:520,
    357:515, 358:520, 359:515, 360:520, 361:520,
    # Tier 3b  more post-game  ~520 BST
    362:520, 363:525, 364:520, 365:520, 366:520,
    367:520, 368:520, 369:520, 370:520, 371:525,
    # Tier 4   Prismatic Rift  regular=520, legends=580
    372:520, 373:520, 374:520, 375:520, 376:520,
    377:520, 378:520,
    379:580,  # Riftscale - legend
    380:580,  # Tempestborn - legend
    381:520,
    # Tier 5   Apex Summit  regular=520, legend(389)=585
    382:525, 383:525, 384:525, 385:525, 386:525,
    387:525, 388:525,
    389:585,  # Stormcrown - legend
    390:525, 391:525,
    # Tier 5b  ultra-rare  regular=525, legends=590-595
    392:590,  # Eondrake - legend
    393:525,
    394:590,  # Solarvast - legend
    395:590,  # Glacierend - legend
    396:525,
    397:525,
    398:590,  # Voidcrown - legend
    399:525,
    400:595,  # Primordiax - legend
    401:595,  # Cosmoveil - legend
}

LEGEND_IDS = {379, 380, 389, 392, 394, 395, 398, 400, 401}

STAT_RE = re.compile(
    r'(base:\{hp:)(\d+)(,atk:)(\d+)(,def:)(\d+)(,spa:)(\d+)(,spd:)(\d+)(,spe:)(\d+)(\})'
)
RARITY_RE = re.compile(r'(catchRate:\d+, expYield:\d+, rarity:)"[^"]+"')

with open("js/data.js", "r", encoding="utf-8") as f:
    text = f.read()

# Split into per-monster sections using "NNN: { id:NNN," as boundaries
# We process the text for each ID individually
def scale_stats(hp, atk, df, spa, spd, spe, target):
    current = hp + atk + df + spa + spd + spe
    if current == 0:
        return hp, atk, df, spa, spd, spe
    ratio = target / current
    new = [round(s * ratio) for s in [hp, atk, df, spa, spd, spe]]
    # Adjust rounding error on the highest stat
    diff = target - sum(new)
    if diff != 0:
        idx = new.index(max(new))
        new[idx] += diff
    # Enforce minimum 40 per stat
    for i in range(6):
        if new[i] < 40:
            deficit = 40 - new[i]
            new[i] = 40
            # Remove deficit from highest remaining
            rest = [(new[j], j) for j in range(6) if j != i and new[j] > 40]
            if rest:
                rest.sort(reverse=True)
                new[rest[0][1]] -= deficit
    return tuple(new)

changed = 0
for mid, target in TARGETS.items():
    # Find the block for this specific id
    id_pattern = re.compile(
        rf'({re.escape(str(mid))}: \{{ id:{mid},.*?)(base:\{{hp:)(\d+)(,atk:)(\d+)(,def:)(\d+)(,spa:)(\d+)(,spd:)(\d+)(,spe:)(\d+)(\}})',
        re.DOTALL
    )
    # Actually simpler: search line by line for "  NNN: { id:NNN," then find the next base: line
    # Use a targeted substitution scoped to a region
    # Find the monster block start
    start_marker = f'  {mid}: {{ id:{mid},'
    pos = text.find(start_marker)
    if pos == -1:
        print(f"WARNING: ID {mid} not found", file=sys.stderr)
        continue

    # Find "base:{" within the next 500 chars
    region_end = pos + 1000
    region = text[pos:region_end]
    m = STAT_RE.search(region)
    if not m:
        print(f"WARNING: base stats not found for ID {mid}", file=sys.stderr)
        continue

    hp, atk, df, spa, spd, spe = (int(m.group(2)), int(m.group(4)), int(m.group(6)),
                                    int(m.group(8)), int(m.group(10)), int(m.group(12)))
    old_bst = hp + atk + df + spa + spd + spe
    nhp, natk, ndf, nspa, nspd, nspe = scale_stats(hp, atk, df, spa, spd, spe, target)
    new_bst = nhp + natk + ndf + nspa + nspd + nspe

    old_stat_str = m.group(0)
    new_stat_str = (f'base:{{hp:{nhp},atk:{natk},def:{ndf},'
                    f'spa:{nspa},spd:{nspd},spe:{nspe}}}')

    # Replace only within this monster's region
    new_region = region.replace(old_stat_str, new_stat_str, 1)
    text = text[:pos] + new_region + text[pos + len(region):]

    print(f"ID {mid}: BST {old_bst} -> {new_bst} (target {target})")
    changed += 1

    # Update rarity for legends
    if mid in LEGEND_IDS:
        # Find the rarity in this monster's refreshed region
        pos2 = text.find(f'  {mid}: {{ id:{mid},')
        region2 = text[pos2:pos2+1000]
        new_region2 = RARITY_RE.sub(r'\1"legendary"', region2, count=1)
        if new_region2 != region2:
            text = text[:pos2] + new_region2 + text[pos2 + len(region2):]
            print(f"  -> Set ID {mid} rarity to legendary")

print(f"\nTotal monsters updated: {changed}")

with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(text)

print("Done. js/data.js written.")
