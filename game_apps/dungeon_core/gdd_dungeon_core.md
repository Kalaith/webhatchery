# Dungeon Core Simulator - Game Design Document

## Overview
A web-based idle game where players take on the role of a Dungeon Core, building and managing a dungeon. Adventurers enter daily to fight monsters, collect loot, and potentially die. The game features 2D Zelda-like visuals with autonomous combat.

## Core Gameplay Loop
1. **Dungeon Management Phase** (Idle)
   - Place rooms, monsters, and traps
   - Spend mana to spawn monsters
   - Upgrade dungeon features
2. **Adventurer Phase** (Active)
   - Watch adventurers progress through dungeon
   - Autonomous combat plays out
   - Adventurers loot or die
3. **Reset Phase** (Idle)
   - Monsters respawn when dungeon is empty
   - New adventurer parties form in town

## Dungeon System
### Layout
- **2D grid-based levels** (like 2D Zelda)
- Multiple connected rooms (10 per floor)
- Last room contains boss battle
- Shortcut exit after boss room
- Staircases appear for multi-floor dungeons

### Room Types
| Type | Function | Special Properties |
|------|----------|---------------------|
| Basic Room | Monster encounters | Default spawn |
| Monster Lair | Reduced spawn costs | Unlockable |
| Trap Hallway | Concentrated traps | Limited placement |
| Treasure Room | Increased loot | Attracts more adventurers |
| Boss Chamber | Final challenge | Required per floor |

### Dungeon Rules
- Monsters respawn only when dungeon is empty
- New groups wait until respawn completes
- Overspending on monsters increases respawn time
- Dungeon "closes" for maintenance (like Theme Park)

## Monster System
- Cost mana to place
- Permanent until killed (then respawn)
- Themed by room type
- Strength scales with dungeon level
- Can be upgraded between runs

## Adventurer System
### Behavior
- Parties of 3-4 adventurers
- Autonomous combat (Gladiator-style)
- Decision making:
  - 0-1 casualties: Continue
  - 2+ casualties: Retreat
  - Party wipe: Permanent death

### Progression
- Level up with experience
- Permanent death system
- Dynamic party formation:
  - Replace dead members
  - Disband if too many losses
- Visible gear upgrades

### Daily Cycle
- Active: 6AM - 12AM (18h)
- Closed: 12AM - 6AM (6h maintenance)
- Can manually close for adjustments

## Economy Systems
### Resources
| Resource | Generation | Use |
|----------|------------|-----|
| Mana | Passive regen | Monster spawning |
| Gold | Adventurer deaths | Upgrades/expansions |
| Souls | Boss kills | Premium content |

### Expansions
- Themed room packs (e.g. "Lava Biome")
- Earnable in-game or purchasable
- New monster types
- Special traps/features

## Future Considerations
1. **Cross-Dungeon Play**
   - Send monsters to attack other dungeons
   - PvP elements

2. **Spell System**
   - Dungeon abilities during runs
   - Environmental effects

3. **Night Events**
   - Special encounters during closure
   - Maintenance minigames

## Technical Specifications
- **Platform**: Web-based (HTML5)
- **Visuals**: Top-down 2D (Zelda-like)
- **Combat**: Autonomous (Gladiator-inspired)
- **Save System**: Cloud-based progression

## UI Mockup (Concept)