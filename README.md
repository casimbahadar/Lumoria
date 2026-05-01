# Lumoria

A browser-based monster-catching RPG set in the Lumoria Region. Explore a vast world, catch and train creatures called **Lumori**, battle your way through sixteen Gym Leaders, dismantle the plans of the villainous **Team Umbra**, and claim the title of Champion — then discover what waits beyond.

## How to Play

Open `index.html` in any modern browser. No build step, no dependencies — runs entirely client-side with vanilla HTML, CSS, and JavaScript. Progress is saved to your browser's local storage.

---

## Features

### World & Exploration

- **70+ locations** across the Lumoria Region — cities, routes, caves, ruins, bogs, caverns, underwater passages, and hidden event areas
- Fully interactive **SVG region map** with zoomable terrain, biome textures, and clickable routes
- Orthogonal route paths with direction-change zones — every turn in the map becomes its own explorable area
- Distinct routes between each gym city, each with their own wild encounter pools and trainers

### Lumori

- **407 unique Lumori** to discover, catch, and train — with more waiting to be uncovered
- **21 types:** Fire, Water, Grass, Electric, Ground, Wind, Ice, Dark, Fairy, Steel, Poison, Psychic, Dragon, Normal, Rock, Bug, Ghost, Fighting, Crystal, Primal, Aether
- Full **type effectiveness chart** with dual-type support and immunities
- **Multi-stage evolution** — 2-stage, 3-stage, item-based (Fire Stone, Moon Stone, Thunder Stone, Metal Coat, Dusk Stone, Water Stone), and location-based evolutions
- **Split evolutions** — some base Lumori branch into different forms depending on the item used
- **Legendary Lumori** at the end of the Luminex, encountered through story quests and special events
- Carry a team of up to 6 Lumori, with overflow stored in your PC Box

### Battle System

- Turn-based battles with **544 moves** across all 21 types
- **Physical, Special, and Status** move categories with accurate damage formulas
- **Status effects:** Burn, Paralyze, Poison, Sleep, Freeze, Confusion, Flinch
- Critical hits, priority moves, recharge mechanics, and stat stage modifiers
- Multi-hit moves, recoil, and drain mechanics
- **Battle format selection** — choose Single, Double, or Triple format before every major battle; each format uses a distinct opponent team and strategy
- **Held items** that affect battle — type boosters, Focus Sash, Leftovers, Quick Claw, Scope Lens, and more
- **In-battle item use** — open your bag mid-battle to use Potions, Revives, or stat items at the cost of your turn

### Progression

- **16 Gym Leaders** each specializing in a different type, awarding a unique badge on defeat:

  | # | Leader | Type | Badge |
  |---|---|---|---|
  | 1 | Rex | Normal | Foundation Badge |
  | 2 | Marina | Water | Wave Badge |
  | 3 | Pyros | Fire | Forge Badge |
  | 4 | Zara | Electric | Current Badge |
  | 5 | Glacier | Ice | Frost Badge |
  | 6 | Nyx | Dark | Dusk Badge |
  | 7 | Oracle | Psychic | Foresight Badge |
  | 8 | Drake | Dragon | Wyrm Badge |
  | 9 | Thorne | Grass | Canopy Badge |
  | 10 | Viper | Poison | Venom Badge |
  | 11 | Atlas | Ground | Tectonic Badge |
  | 12 | Mantis | Bug | Chitin Badge |
  | 13 | Zephyra | Wind | Tempest Badge |
  | 14 | Ferro | Steel | Alloy Badge |
  | 15 | Boulder | Rock | Geode Badge |
  | 16 | Seraphina | Fairy | Aurora Badge |

- **The Vanguard** — four elite trainers guard the path to Victory Summit
- **Champion Lumian** awaits at the peak with a formidable team of seasoned Lumori
- **Rival Marcus** challenges you at key points throughout your journey

### Story

- **Team Umbra** seeks to awaken legendary Lumori and tear open a rift in reality
- Battle through Umbra Grunts, Commanders, and the enigmatic Leader Shade
- A growing threat climaxes after Gym 15 — confront a being that has no place in this world before it consumes everything
- Professor Arbor guides you from your first Lumori through the final confrontation

### Items & Economy

- **Capture Orbs:** Basic, Great, Ultra, and Master
- **Medicine:** Potion, Super Potion, Max Potion, Revive — usable in the overworld and mid-battle
- **30+ held items** including stat boosters, type-boosting items, and battle-effect items
- **X-items** (X-Attack, X-Defense, X-Speed) for in-battle stat boosts
- **Shops** in every town and city with inventory that scales with your badge count
- **Healing Centers** in every town and city

### Quality of Life

- **Luminex** — full Lumori encyclopedia with search, filter by type, and BST display; tracks every Lumori seen and caught
- **Quest system** — 130+ quests with money and item rewards, tracked in a dedicated quest log
- **Achievements** — milestones that reward exploration and mastery
- **Bag management** — organized into Orbs, Medicine, and Held Items
- **Save/Load** via browser local storage with full backward-compatible migration
- In-game tutorial covering all core mechanics
- **Hall of Fame** screen upon defeating the Champion
- Mobile-friendly responsive design with touch support

---

## Post-Game

Becoming Champion is only the beginning.

Lumoria's post-game is substantial — rematches, new adversaries, hidden areas, and challenges that push your team far beyond what the main story demands. Some content is only accessible after you've proven yourself as Champion. Pursuing it all will take considerably longer than the main journey.

Among the post-game's content: a set of thirteen distinct adversaries, each with a hand-crafted team of rare Lumori found nowhere else in the game. These Lumori carry moves exclusive to them — designed around their typings and built to be felt. Seek them out if you want the most demanding battles Lumoria has to offer.

For those who have seen everything the post-game has to offer, there is one more layer still waiting.

---

## New Game Plus

Completing the game unlocks **New Game+**, a second run of Lumoria with the challenge turned up significantly. Enemy trainers are stronger, new Lumori appear in the wild, new areas of the region open up, and the stakes of every encounter are higher. Your Lumori carry over — use that advantage wisely. NG+ is designed for players who want a true test of mastery.

---

## Project Structure

```
index.html      — Game shell and all screen layouts
css/style.css   — All styling, animations, and responsive layout
js/data.js      — Type chart, moves, Lumori data, world map, items, quests, shops
js/sprites.js   — SVG sprite rendering for all Lumori
js/battle.js    — Battle engine, AI, damage calculation
js/game.js      — Game state, UI rendering, map, navigation, save/load
```
