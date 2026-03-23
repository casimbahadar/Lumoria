# Lumoria - A Lumo Catching Adventure

A browser-based monster-catching RPG inspired by classic Pokemon games. Explore the Lumoria Region, catch and train creatures called **Lumos**, battle Gym Leaders, thwart the villainous **Team Umbra**, and become the Champion.

## How to Play

Open `index.html` in any modern browser. No build step, no dependencies — it runs entirely client-side with vanilla HTML, CSS, and JavaScript. Progress is saved to your browser's local storage.

## Features

### World & Exploration

- **70+ locations** across the Lumoria Region — 16 gym cities, routes, caves, ruins, bogs, caverns, and special event areas
- Fully interactive **SVG region map** with zoomable terrain, biome textures, and clickable routes between locations
- Orthogonal route paths with direction-change areas — every turn in the regional map becomes its own explorable zone
- 12 new routes added between gyms 9–16 including Mire Depths, Magma Vent, Fungal Cavern, Ancient Grove, Wind Hollow, Tempest Cliffs, Ash Fields, Smelter Pass, Granite Tunnels, Crystal Mine, Nebula Gorge, and Astral Plateau

### Lumos (Monsters)

- **321 unique Lumos** to discover, catch, and train
- **16 types:** Fire, Water, Grass, Electric, Ground, Wind, Ice, Dark, Fairy, Steel, Poison, Psychic, Dragon, Normal, Rock, Bug
- Full **type effectiveness chart** with dual-type support and immunities
- **Multi-stage evolution** system — 2-stage, 3-stage, item-based (Fire Stone, Moon Stone, Thunder Stone, Metal Coat, Dusk Stone, Water Stone), and location-based evolutions
- **Split evolutions** — some base Lumos evolve into entirely different forms depending on which item is used
- **8 Legendary Lumos** (IDs 314–321) at the end of the Lumodex, encountered through story quests and special events
- New Lumos exclusive to post-Gym 8 routes incorporate rare type combinations including Poison/Dragon, Fire/Ice, Normal/Electric, and more
- Carry a team of up to 6 Lumos with overflow stored in your PC Box

### Battle System

- Turn-based battles with **352 moves** across all 16 types
- **Physical, Special, and Status** move categories
- **Status effects:** Burn, Paralyze, Poison, Sleep, Freeze, Confusion, Flinch
- Critical hits, priority moves, recharge mechanics, and stat stage modifiers
- **Held items** affect battles — type-boosting items, Focus Sash, Leftovers, Quick Claw, Scope Lens, and more

### Progression

- **16 Gym Leaders** each specializing in a different type, awarding a unique badge:
  1. Rex (Normal) — Foundation Badge
  2. Marina (Water) — Wave Badge
  3. Pyros (Fire) — Forge Badge
  4. Zara (Electric) — Current Badge
  5. Glacier (Ice) — Frost Badge
  6. Nyx (Dark) — Dusk Badge
  7. Oracle (Psychic) — Foresight Badge
  8. Drake (Dragon) — Wyrm Badge
  9. Thorne (Grass) — Canopy Badge
  10. Viper (Poison) — Venom Badge
  11. Atlas (Ground) — Tectonic Badge
  12. Mantis (Bug) — Chitin Badge
  13. Zephyra (Wind) — Tempest Badge
  14. Ferro (Steel) — Alloy Badge
  15. Boulder (Rock) — Geode Badge
  16. Seraphina (Fairy) — Aurora Badge
- **Elite Four** — Aria, Grimshaw, Celeste, and Titan guard the path to the Champion
- **Champion Lumian** awaits at Victory Summit with a team of level 75–80 Lumos
- **Rival Marcus** challenges you at key badge milestones throughout your journey

### Story

- **Team Umbra** is trying to awaken legendary Lumos and tear open a rift in reality
- Battle through Umbra Grunts, Commanders Kira and Vorn, and Leader Shade
- After Gym 15, Team Umbra's experiments crack open the **Void Rift** — confront Voidraxis before it consumes Starbloom
- Professor Arbor guides you from starter selection through the endgame

### Items & Shops

- **Capture Orbs:** Basic, Great, Ultra, and Master Orb
- **Medicine:** Potion, Super Potion, Max Potion, Revive
- **40+ held items** including stat boosters, type-boosting items, and battle-effect items
- **Shops** in towns and cities with inventory that scales with progression

### Additional Features

- **Lumodex** — tracks all seen and caught Lumos with search and filter
- **Quest system** — 110+ quests with money and item rewards
- **Bag management** — organized by Orbs, Medicine, and Held Items
- **Save/Load** via browser local storage with backward-compatible migration
- **In-game tutorial** covering all mechanics
- **Hall of Fame** screen upon defeating the Champion
- Mobile-friendly responsive design with touch support

## Project Structure

```
index.html      — Game shell and all screen layouts
css/style.css   — All styling, animations, and responsive layout
js/data.js      — Type chart, moves, monsters, world map, items, quests, shops
js/sprites.js   — SVG sprite rendering for all Lumos
js/battle.js    — Battle engine, AI, damage calculation
js/game.js      — Game state, UI rendering, map, navigation, save/load
```
