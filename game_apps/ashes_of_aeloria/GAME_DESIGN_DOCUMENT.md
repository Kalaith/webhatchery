# Ashes of Aeloria - Game Design Document

## Executive Summary

**Ashes of Aeloria** is a **high-fantasy node-based strategy game** that blends classic commander-driven warfare with modern tactical gameplay. Players control elite commanders across a connected network of strategic nodes, building armies, managing resources, and engaging in large-scale battles to conquer the realm of Aeloria.

Drawing inspiration from games like *Generation of Chaos*, *The Great Villainess: Strategy of Lily*, and *Dragon Force*, Ashes of Aeloria emphasizes **commander-centric gameplay**, **army-versus-army battles**, and **strategic territorial control** through an intuitive node-based map system.

---

## Core Game Concept

### Vision Statement
*"Command legendary heroes in epic battles for control of a mystical realm, where strategic positioning and tactical brilliance determine the fate of kingdoms."*

### Design Pillars
1. **Commander-Centric Strategy** - Elite heroes are the heart of your empire
2. **Node-Based Tactical Map** - Clear frontlines and strategic chokepoints
3. **Army-Scale Warfare** - Large formation battles, not individual skirmishes  
4. **Progressive Conquest** - Territorial expansion through connected networks
5. **Persistent Progression** - Commanders grow stronger through experience and equipment

---

## Game Overview

### Genre
Turn-based strategy with real-time tactical combat elements

### Target Audience
- Strategy game enthusiasts familiar with classic titles like *Ogre Battle* and *Dragon Force*
- Players who enjoy commander-driven gameplay from *Fire Emblem* and *Advance Wars*
- Fans of node-based strategy from modern titles like *Slay the Spire* and *FTL*

### Platform
Web-based (React/TypeScript frontend with potential for mobile adaptation)

### Core Gameplay Loop
1. **Strategic Phase** - Deploy commanders, plan territorial expansion
2. **Combat Phase** - Resolve battles through auto-calculation or tactical intervention
3. **Management Phase** - Collect resources, recruit units, upgrade facilities
4. **Progression Phase** - Level commanders, unlock abilities, advance technology

---

## Detailed Game Systems

## 1. Node-Based Map System

### Map Structure
The game world consists of **interconnected nodes** representing strategic locations across the realm of Aeloria. Each node serves specific functions and provides unique strategic value.

#### Node Types
| Node Type | Icon | Primary Function | Strategic Value |
|-----------|------|------------------|-----------------|
| **City** 🏰 | Command centers | High gold/supplies generation, commander recruitment |
| **Resource Node** ⛏️ | Economic hubs | Balanced resource production, supply line anchors |
| **Fortress** 🛡️ | Defensive positions | High defensive bonuses, chokepoint control |
| **Shrine** ✨ | Magical sites | Mana generation, special abilities unlock |
| **Stronghold** 💀 | Enemy capitals | Victory objectives, heavily fortified positions |

#### Node Properties
- **Star Level (1-5)** - Represents fortification strength and upgrade potential
- **Garrison Strength** - Defensive military presence
- **Resource Generation** - Gold, Supplies, and Mana per turn
- **Commander Capacity** - Maximum commanders that can be stationed
- **Connection Network** - Strategic pathways to adjacent nodes

### Territorial Control Mechanics
- **Zone of Control** - Each node influences surrounding territory
- **Supply Lines** - Connected friendly nodes provide mutual support
- **Chokepoints** - Critical nodes that control access to regions
- **Victory Threshold** - Control 70% of nodes to achieve conquest victory

## 2. Commander System

### Commander Classes
The game features four distinct commander archetypes, each with unique battlefield roles:

#### Knight ⚔️ - "The Shield of the Realm"
- **Role**: Tank/Defender
- **Stats**: High Health (120), High Defense (100), Moderate Attack (80)
- **Special Ability**: Shield Wall - Increases army defense by 50%
- **Army Specialization**: Infantry-focused formations
- **Strategic Use**: Holding defensive positions, protecting key nodes

#### Mage 🔮 - "The Arcane Destroyer" 
- **Role**: Area Damage/Support
- **Stats**: High Attack (120), Low Health (80), Low Defense (60)
- **Special Ability**: Fireball - Deals AOE damage to enemy formations
- **Army Specialization**: Magic-enhanced units
- **Strategic Use**: Siege warfare, eliminating clustered enemies

#### Ranger 🏹 - "The Swift Hunter"
- **Role**: Scout/Skirmisher
- **Stats**: Balanced (100/100/80)
- **Special Ability**: Stealth - Scout enemy nodes without detection
- **Army Specialization**: Mobile archer formations
- **Strategic Use**: Intelligence gathering, flanking maneuvers

#### Warlord 👑 - "The Battle Master"
- **Role**: Leadership/Buff Support
- **Stats**: Well-rounded (110/90/90)
- **Special Ability**: Rally - Increases entire army combat effectiveness
- **Army Specialization**: Combined arms coordination
- **Strategic Use**: Leading major offensives, coordinating multiple armies

### Commander Progression
- **Experience Points** - Gained through combat participation and victories
- **Level Advancement** - Unlocks stat increases and new abilities
- **Equipment System** - Weapons and artifacts enhance capabilities
- **Relationship Building** - Commanders develop loyalty and synergy bonuses
- **Permadeath Risk** - Lost commanders cannot be easily replaced

### Racial Variants
Each commander belongs to one of four races, providing unique bonuses:

| Race | Icon | Faction Bonus | Strategic Advantage |
|------|------|---------------|-------------------|
| **Human** 👤 | Versatile - 10% bonus to all resources | Economic efficiency |
| **Elf** 🧝 | Magical Affinity - 20% bonus mana generation | Magical warfare |
| **Orc** 👹 | Brutal Strength - 15% bonus combat damage | Aggressive tactics |
| **Undead** 💀 | Undying - Commanders revive with 50% health | Attrition warfare |

## 3. Army Composition and Combat

### Troop Types and Rock-Paper-Scissors Mechanics

The combat system employs classic unit effectiveness relationships:

#### Core Unit Types
- **Soldiers** 🛡️ (Infantry): Balanced units strong vs Cavalry, weak vs Archers
- **Archers** 🏹 (Ranged): High damage vs Infantry, vulnerable to Cavalry charges  
- **Cavalry** 🐎 (Mounted): Fast strikers strong vs Archers, countered by Infantry
- **Mages** 🔥 (Support): Disruptive specialists, fragile but universally effective

#### Combat Resolution
- **Auto-Resolution**: Default battle calculation based on army strength, formations, and commander abilities
- **Tactical Intervention**: Players can adjust formations and trigger special abilities
- **Terrain Effects**: Node types provide defensive bonuses and tactical modifiers
- **Morale System**: Victory/defeat affects army effectiveness in subsequent battles

### Army Management
- **Formation Stances**: Aggressive (high damage), Defensive (damage reduction), Skirmish (mobility)
- **Unit Recruitment**: Cities and resource nodes enable troop training
- **Supply Requirements**: Armies need ongoing resources for maintenance
- **Capacity Limits**: Commanders can only manage armies up to their command rating

## 4. Resource Management and Economy

### Resource Types
The game employs a three-resource economy system:

#### Gold 💰
- **Sources**: Cities (100/turn), Resource Nodes (50/turn), Fortresses (25/turn)
- **Uses**: Commander recruitment, army training, node upgrades
- **Strategic Importance**: Primary currency for military expansion

#### Supplies 📦  
- **Sources**: Resource Nodes (100/turn), Cities (50/turn), Fortresses (25/turn)
- **Uses**: Army maintenance, garrison upkeep, defensive improvements
- **Strategic Importance**: Required for sustained military operations

#### Mana ✨
- **Sources**: Shrines (100/turn), Resource Nodes (25/turn), Strongholds (50/turn)
- **Uses**: Commander special abilities, magical research, powerful battle interventions
- **Strategic Importance**: Enables tactical superiority and special operations

### Economic Growth
- **Node Upgrades**: Star level improvements increase resource generation
- **Territorial Expansion**: More nodes = greater resource income
- **Efficiency Bonuses**: Racial traits and commander abilities enhance production
- **Trade Networks**: Connected friendly nodes provide synergy bonuses

## 5. Turn Structure and Game Flow

### Phase-Based Turns
Each game turn consists of three distinct phases:

#### 1. Player Phase
- **Commander Movement**: Deploy commanders to nodes within movement range
- **Combat Initiation**: Attack adjacent enemy-controlled nodes
- **Resource Allocation**: Spend resources on recruitment and upgrades
- **Special Actions**: Use commander abilities and magical interventions

#### 2. Enemy Phase  
- **AI Decision Making**: Enemy commanders move and attack based on strategic priorities
- **Automated Combat**: AI resolves battles using same rules as player
- **Resource Management**: Enemy factions collect income and reinforce positions
- **Adaptive Strategy**: AI responds to player actions with counter-strategies

#### 3. Upkeep Phase
- **Resource Collection**: All factions collect income from controlled nodes
- **Maintenance Costs**: Armies consume supplies, buildings require upkeep
- **Event Resolution**: Random events, environmental effects, narrative developments
- **Victory Checking**: Evaluate win conditions and game state

### Pacing and Progression
- **Early Game**: Focus on expanding from starting position, recruiting first commanders
- **Mid Game**: Territorial conflicts over key nodes, army building, strategic positioning
- **Late Game**: Major offensives toward enemy strongholds, decisive battles
- **Campaign Length**: 15-25 turns for standard victory, scalable for different game modes

## 6. Victory Conditions and Game Modes

### Primary Victory Conditions

#### Conquest Victory 🏆
- **Requirement**: Control 70% of all nodes on the map
- **Strategy**: Aggressive expansion and territorial domination
- **Timeline**: Typically achieved in 20-30 turns

#### Stronghold Victory ⚔️
- **Requirement**: Capture all enemy stronghold nodes
- **Strategy**: Focused assault on heavily defended positions
- **Timeline**: High-risk, high-reward approach for skilled players

#### Economic Victory 💎
- **Requirement**: Accumulate massive resource reserves (10,000+ gold equivalent)
- **Strategy**: Defensive play with economic optimization
- **Timeline**: Long-term strategy requiring careful resource management

### Defeat Conditions
- **Commander Elimination**: Lose all recruited commanders
- **Capital Loss**: Enemy captures your starting city
- **Resource Bankruptcy**: Unable to maintain minimum army requirements

## 7. User Interface and Visual Design

### Map Display
- **Isometric Perspective**: Clear view of node network and territorial control
- **Visual Indicators**: Color-coded ownership, commander positions, resource flow
- **Interactive Elements**: Click nodes for detailed information, drag-and-drop commander assignment
- **Battle Visualization**: Animated combat resolution with tactical feedback

### Commander Management Panel
- **Tabbed Interface**: Separate views for Player and Enemy commanders
- **Detailed Statistics**: Health, experience, equipment, assigned position
- **Assignment Controls**: Drag commanders to nodes, view capacity limits
- **Progression Tracking**: Experience bars, level advancement, ability unlocks

### Resource Dashboard
- **Real-time Display**: Current gold, supplies, mana with income projections
- **Trend Analysis**: Resource flow visualization, spending breakdowns
- **Budget Planning**: Preview costs for planned actions and upgrades
- **Economic Optimization**: Efficiency recommendations and improvement suggestions

## 8. Technical Architecture

### Frontend Technology Stack
- **React 18** with TypeScript for component-based UI development
- **Zustand** for state management with localStorage persistence
- **HTML5 Canvas** for interactive map rendering and battle visualization
- **Tailwind CSS** for responsive design and visual styling

### Game State Management
- **Persistent Storage**: Game progress saved locally with migration support
- **State Validation**: Automatic map connection repair and data integrity checks
- **Performance Optimization**: Efficient rendering for large army battles
- **Modular Design**: Extensible architecture for future content expansion

### AI Implementation
- **Strategic AI**: Multi-layered decision making for territorial expansion
- **Tactical AI**: Formation optimization and ability usage in combat
- **Adaptive Difficulty**: AI responds to player skill level and strategy
- **Behavioral Variety**: Different AI personalities for replayability

## 9. Content and Progression Systems

### Campaign Structure
- **Tutorial Campaign**: Introduction to core mechanics through guided scenarios
- **Main Campaign**: Epic storyline across multiple regions of Aeloria
- **Challenge Scenarios**: Specialized maps testing specific strategic skills
- **Sandbox Mode**: Custom map generation for unlimited replayability

### Unlock Progression
- **Commander Classes**: New archetypes unlocked through campaign progress
- **Racial Variants**: Additional factions become available with achievements
- **Advanced Abilities**: Powerful special attacks earned through experience
- **Legendary Equipment**: Rare artifacts discovered in ancient shrines

### Achievement System
- **Strategic Mastery**: Recognition for tactical excellence and efficient victories
- **Economic Efficiency**: Rewards for optimal resource management
- **Military Leadership**: Honors for commander development and army coordination
- **Exploration Rewards**: Bonuses for discovering hidden map features

## 10. Balancing and Difficulty

### Difficulty Scaling
- **Adaptive AI**: Enemy intelligence adjusts to player performance
- **Resource Modifiers**: Economic advantages/disadvantages based on difficulty
- **Time Pressure**: Victory condition timers for advanced players
- **Permadeath Stakes**: Higher difficulties increase commander loss consequences

### Balance Philosophy
- **No Dominant Strategy**: Multiple viable approaches to victory
- **Meaningful Choices**: Every decision has strategic trade-offs
- **Risk vs Reward**: Aggressive play offers higher gains but greater danger
- **Comeback Mechanics**: Losing players have opportunities to recover

### Testing and Iteration
- **Playtesting Metrics**: Win rates, average game length, strategy diversity
- **Community Feedback**: Player-reported balance issues and suggestions
- **Data Analytics**: Statistical analysis of successful vs unsuccessful strategies
- **Regular Updates**: Continuous refinement based on player behavior patterns

---

## Development Roadmap

### Phase 1: Core Systems (Current Status ✅)
- ✅ Node-based map system with visual rendering
- ✅ Commander recruitment and management
- ✅ Basic combat resolution and army management
- ✅ Resource collection and economic foundation
- ✅ Turn-based gameplay with AI opponent
- ✅ Local storage persistence and state management

### Phase 2: Enhanced Combat (In Progress 🔄)
- 🔄 Advanced battle resolution with formation effects
- ⏳ Commander special abilities implementation
- ⏳ Detailed troop type effectiveness system
- ⏳ Terrain modifiers and tactical positioning
- ⏳ Visual battle animations and feedback

### Phase 3: Strategic Depth (Planned 📋)
- 📋 Multiple victory conditions
- 📋 Random events and environmental challenges  
- 📋 Advanced AI with personality variants
- 📋 Campaign mode with narrative integration
- 📋 Achievement and progression systems

### Phase 4: Content Expansion (Future 🔮)
- 🔮 Additional commander classes and races
- 🔮 Magical abilities and spell system
- 🔮 Multiplayer support for competitive play
- 🔮 Map editor and custom scenario creation
- 🔮 Mobile platform adaptation

---

## Conclusion

**Ashes of Aeloria** represents a modern evolution of classic commander-driven strategy games, combining the tactical depth of titles like *Generation of Chaos* with the accessibility and clarity of contemporary node-based design. Through its focus on meaningful strategic choices, progressive commander development, and large-scale army warfare, the game offers both nostalgic appeal for strategy veterans and engaging accessibility for new players.

The current implementation provides a solid foundation of core systems, with comprehensive commander management, territorial control mechanics, and AI-driven opponents. Future development will expand upon these foundations to create a rich, replayable strategy experience that honors the genre's heritage while embracing modern design principles.

*The realm of Aeloria awaits your command. Will you forge an empire through cunning strategy, or will your commanders fall to the winds of war?*

---

**Document Version**: 1.0  
**Last Updated**: January 2024  
**Status**: Living Document - Subject to iteration based on playtesting and development progress
