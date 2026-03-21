# TODO - Lumoria Bugs & Feature Requests

## Bugs

### ~~1. Wild Lumos persists when starting a quest~~ ✅ FIXED
- Fixed: startQuestBattle now properly initializes battle state

### ~~2. Shop not opening from town menu~~ ✅ FIXED
- Fixed: Added click event listener for area shop button

### ~~3. Route and town name overlapping on map~~ ✅ FIXED (mobile)
- Fixed: Route labels hidden on tablet/phone screens to prevent overlap
- Desktop layout unaffected

### ~~4. Revive cost is wrong after losing~~ ✅ FIXED (previously)
- Was already fixed: 100% HP restore, 5% money cost on blackout

## Feature Requests

### ~~5. Healing at towns and cities~~ ✅ DONE
- Heal button appears at all towns and cities
- Fully restores team HP for free

### ~~6. Natures system~~ ✅ DONE
- 25 Lumoria-themed natures (20 stat-affecting + 5 neutral)
- Each nature boosts one stat +10% and lowers another -10%
- Displayed on team detail screen with color-coded stat bars
- Nature assigned randomly on catch/create, migrated for old saves

### ~~7. Individual Values (IVs)~~ ✅ DONE
- 0-31 IV per stat affects stat calculation
- Shown on battle screen for wild encounters (to evaluate catches)
- Shown on team detail screen
- Gym/boss mons get perfect 31 IVs
- Migrated for old saves

### ~~8. Double and triple battle functionality~~ ✅ DONE
- Double battle mode (2v2): Ferro, Boulder, Seraphina gyms
- Triple battle mode (3v3): Champion Lumian
- Per-mon move selection with target picking
- Speed-ordered turn resolution, auto-replacement of fainted mons

### ~~9. AI-generated sprites~~ ✅ DONE
- Procedural SVG trainer sprite generator (chibi style)
- 5 hair styles, 6 skin tones, 7 eye colors, type-themed outfits
- Trainer sprites shown in gym leader panel and battle intro
- 2 new monster archetypes: Insectoid and Amorphous (7 total body types)

### ~~10. Music and battle themes~~ ✅ DONE
- Procedural chiptune music engine using Web Audio API
- 7 tracks: overworld, wild battle, gym battle, champion battle,
  rival battle, umbra battle, elite battle
- Music auto-switches between overworld and battle contexts
- Toggle mute via nav bar music button
- No external audio files needed (all synthesized in-browser)
