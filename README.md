# Lumoria

A browser-based monster-catching RPG set in the Lumoria Region. Explore a vast world, catch and train creatures called **Lumori**, battle your way through sixteen Gym Leaders, dismantle the plans of the villainous **Team Umbra**, and claim the title of Champion — then discover what waits beyond.

## How to Play

Open `index.html` in any modern browser. No build step, no dependencies — runs entirely client-side with vanilla HTML, CSS, and JavaScript. Progress is saved to your browser's local storage across multiple save slots.

---

## Features

### World & Exploration

- **70+ locations** across the Lumoria Region — cities, routes, caves, ruins, bogs, caverns, underwater passages, and hidden event areas
- Fully interactive **SVG region map** with zoomable terrain, biome textures, and clickable routes
- Orthogonal route paths with direction-change zones — every turn in the map becomes its own explorable area
- Distinct routes between each gym city, each with their own wild encounter pools and trainers

### Lumori

- **446 Lumori** in the game — 407 available to catch and train, with others that can only be encountered under specific circumstances
- **26 types** spanning elemental, exotic, and post-game: Fire, Aquatic, Nature, Electric, Earth, Wind, Ice, Dark, Fairy, Metal, Poison, Mental, Draconic, Normal, Spectral, Fighting, Sonic, Vapor, Mineral, Toxin, Dream — plus Aether, Crystal, Primal, Chrono, and Stellar reserved for the post-game Forgotten Lumori
- Full **type effectiveness chart** with dual-type support and immunities
- **Natures** — 25 Lumoria-themed natures that each boost one stat and lower another, affecting every encounter
- **Individual Values (IVs)** — hidden per-stat values that make every Lumori unique; visible in battle and on the team screen
- **✨ Radiant Lumori** — rare variants with a distinct appearance (1/2048 odds); tracked separately in your Luminex
- **🔀 Variant Lumori** — alternate-typed forms that appear occasionally in the wild (1/100 odds)
- **Multi-stage evolution** — 2-stage, 3-stage, item-based (Fire Stone, Moon Stone, Thunder Stone, Metal Coat, Dusk Stone, Water Stone), and location-based evolutions
- **Split evolutions** — some base Lumori branch into different forms depending on the item used
- **Legendary Lumori** at the end of the Luminex, encountered through story quests and special events
- Carry a team of up to 6 Lumori, with overflow stored in your PC Box

### Battle System

- Turn-based battles with **1,100+ moves** across all 26 types
- **Physical, Special, and Status** move categories with accurate damage formulas
- **Multi-status battle system** — 47 distinct status conditions, and a Lumori can suffer multiple at once. Beyond the classics (Burn, Paralyze, Poison, Sleep, Freeze, Confusion, Flinch), Lumori can be afflicted with Bleed, Petrify, Drenched, Crystallize, Marked, Burnt-out, Faded, Strained, Sluggish, Brittle, Tainted, Hexed, Deafen, Echolocation, Smothered, Weighed Down, Soaked, Severe Bleed, Statue, Hypothermia, Disoriented, Migraine, Mind-numb, Adrenaline, Inspired, Tangled, Tethered, Necrosis, Plague, Mirrored, Possessed, Muted, Sealed, Bonded, Type Distorted, Bouncy, Refracted, Phase-shifted, Crippled, Corroded, Bound, Anchored, Comatose, Hunted, Exhausted, Concussion, and Type Shattered. Type-based immunities apply throughout — Metal/Crystal/Spectral resist Bleed; Aquatic/Vapor resist Drench; Mineral/Crystal/Metal resist Petrify; Spectral resists most curse-type statuses; and so on
- **Evolving statuses** — 12 status pairs where the lighter form auto-escalates after a few turns if not cured (Bleed → Severe Bleed, Petrify → Statue, Drenched → Soaked, Burnt-out → Crippled, Tainted → Corroded, Tangled → Bound, Tethered → Anchored, Disoriented → Comatose, Marked → Hunted, Strained → Exhausted, Migraine → Concussion, Type Distorted → Type Shattered)
- **Reactive statuses** — Mirrored, Bouncy, and Refracted reflect damage back at attackers (Bouncy hits physical attackers, Refracted hits special attackers)
- **Multi-battle cross-mon hooks** — Plague spreads between teammates each turn; Bonded redirects 25% of damage taken to a random teammate
- **Advanced move mechanics:**
  - `dualType` moves compute effectiveness against two attack types simultaneously (Flying-Press style)
  - `breakerVs` moves force a specific defending type to take 2× damage regardless of chart (Freeze-Dry style)
  - `alwaysCrit` moves guarantee critical hits (Frost Breath / Storm Throw style)
  - Wide-target moves hit all opposing Lumori at a 0.75× spread modifier
  - Self-target moves route secondary effects back to the attacker
  - Compound effects let moves apply multiple secondary effects in a single hit (e.g. `recharge_and_burn_target`, `echolocation_and_deafen`)
  - Recharge mechanics force a downtime turn after high-power moves
- Critical hits, priority moves, accuracy/evasion stages, and full stat stage modifiers
- Multi-hit moves, recoil, and drain mechanics
- **Status badges UI** — every active status displays on the battle info panel with a color-coded tag
- **Battle format selection** — choose Single, Double, or Triple format before every major battle; each format uses a distinct opponent team and strategy
- **Held items** that affect battle — type boosters, Focus Sash, Leftovers, Quick Claw, Scope Lens, and more
- **In-battle item use** — open your bag mid-battle to use Potions, Revives, or stat items at the cost of your turn

### Progression

- **16 Gym Leaders** each specializing in a different type, awarding a unique badge on defeat:

  | # | Leader | Type | Badge |
  |---|---|---|---|
  | 1 | Rex | Normal | Foundation Badge |
  | 2 | Marina | Aquatic | Wave Badge |
  | 3 | Pyros | Fire | Forge Badge |
  | 4 | Zara | Electric | Current Badge |
  | 5 | Glacier | Ice | Frost Badge |
  | 6 | Nyx | Dark | Dusk Badge |
  | 7 | Oracle | Mental | Foresight Badge |
  | 8 | Drake | Draconic | Wyrm Badge |
  | 9 | Thorne | Nature | Canopy Badge |
  | 10 | Viper | Poison | Venom Badge |
  | 11 | Atlas | Earth | Tectonic Badge |
  | 12 | Mantis | Nature | Chitin Badge |
  | 13 | Zephyra | Wind | Tempest Badge |
  | 14 | Ferro | Metal | Alloy Badge |
  | 15 | Boulder | Earth | Geode Badge |
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
- **50+ items** including stat boosters, type-boosting held items, and battle-effect items
- **X-items** (X-Attack, X-Defense, X-Speed) for in-battle stat boosts
- **Shops** in every town and city with inventory that scales with your badge count
- **Healing Centers** in every town and city

### Quality of Life

- **Luminex** — full Lumori encyclopedia with search, filter by type, and BST display; tracks every Lumori seen and caught, including Radiant and Variant forms
- **Quest system** — 130+ quests with money and item rewards, tracked in a dedicated quest log
- **Daily challenges** — rotating objectives that reward consistent play
- **Achievements** — 40+ milestones that reward exploration and mastery
- **Bag management** — organized into Orbs, Medicine, and Held Items
- **Multiple save slots** — maintain separate playthroughs in the same browser
- **Save/Load** via browser local storage with full backward-compatible migration
- In-game tutorial covering all core mechanics
- **Hall of Fame** screen upon defeating the Champion
- **Procedural chiptune music** — a full dynamic soundtrack synthesized in-browser via Web Audio API; no external audio files required
- **Procedural trainer sprites** — every trainer is uniquely generated in SVG
- Mobile-friendly responsive design with touch support

### Online Features

Online features require a configured Firebase project (see `js/online.js` for setup instructions). Once connected:

- **Leaderboards** — compete globally across multiple categories: battles won, Lumori caught, Radiant caught, and event points
- **Live Events** — server-driven timed events that boost spawn rates, shiny odds, and introduce exclusive encounter pools
- **Time-Based Events** — passive bonuses that shift with the time of day and day of the week
- **Trading** — post Lumori for trade and browse listings from other players; complete trades to receive their Lumori directly
- **Async PvP** — post a battle challenge using your current team; other players can accept and the result is simulated and reported
- **Live PvP** — real-time head-to-head battles using room codes; both players submit moves simultaneously with speed-ordered resolution
- **Friend System** — share your friend code, add others, and view their profiles and progress

---

## Post-Game

Becoming Champion is only the beginning.

Lumoria's post-game is substantial — rematches, new adversaries, hidden areas, and challenges that push your team far beyond what the main story demands. Some content is only accessible after you've proven yourself as Champion. Pursuing it all will take considerably longer than the main journey.

Among the post-game's content: a set of thirteen distinct adversaries, each with a hand-crafted team of rare Lumori found nowhere else in the game. These Lumori carry moves exclusive to them — designed around their typings and built to be felt. Seek them out if you want the most demanding battles Lumoria has to offer. After every one of these thirteen adversaries falls, each will reappear once at their stronghold to give you a chance to catch the rare Lumori at the heart of their bond — a one-time encounter, so come prepared.

For those who have seen everything the post-game has to offer, there is one more layer still waiting.

---

## New Game Plus

Completing the game unlocks **New Game+**, a second run of Lumoria with the challenge turned up significantly. Enemy trainers are stronger, new Lumori appear in the wild, new areas of the region open up, and the stakes of every encounter are higher. Your Lumori carry over — use that advantage wisely. NG+ is designed for players who want a true test of mastery. Note: New Game+ and the Forgotten Lumori post-quest are independent layers — neither requires the other, and the Lumori from each pool stay distinct.

---

## Project Structure

```
index.html      — Game shell and all screen layouts
css/style.css   — All styling, animations, and responsive layout
js/data.js      — Type chart, moves, Lumori data, world map, items, quests, shops
js/sprites.js   — SVG sprite rendering for all Lumori
js/battle.js    — Battle engine, AI, damage calculation
js/game.js      — Game state, UI rendering, map, navigation, save/load
js/music.js     — Procedural chiptune music engine
js/online.js    — Firebase online system (leaderboards, trading, PvP, events)
```
