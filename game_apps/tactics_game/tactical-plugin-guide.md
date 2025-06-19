# Tactical Combat Plugin Integration Guide

## Overview
The Tactical Combat Plugin is a comprehensive Fire Emblem-style turn-based tactical combat system designed for web games. It provides a complete plugin architecture that can be easily integrated into existing web-based games.

## Key Features

### Core Combat Mechanics
- **Weapon Triangle System**: Swords beat Axes, Axes beat Lances, Lances beat Swords
- **Turn-Based Combat**: Alternating player and enemy phases
- **Grid-Based Movement**: 8x8 tactical grid with movement range visualization
- **Speed-Based Doubling**: Units with 4+ speed advantage attack twice
- **Combat Prediction**: Shows damage, hit rate, and critical chance before combat
- **Experience System**: Units gain EXP and level up through combat

### Technical Architecture
- **Modular Plugin Design**: Easy integration with existing games
- **Event-Driven System**: Clean separation of concerns
- **Canvas-Based Rendering**: High-performance 2D graphics
- **JSON Configuration**: Customizable units, maps, and game rules
- **State Management**: Complete game state tracking and persistence

## Integration Examples

### Basic Integration
```javascript
// Initialize the plugin
const tacticalPlugin = new TacticalCombatPlugin({
    canvas: document.getElementById('gameCanvas'),
    onGameEnd: (winner) => {
        console.log(`Game ended! Winner: ${winner}`);
    }
});

// Load unit data and start
tacticalPlugin.initialize(customUnits);
```

### Custom Unit Configuration
```javascript
const customUnits = [
    {
        id: "hero1",
        name: "Custom Hero",
        type: "Swordfighter",
        faction: "player",
        x: 0, y: 7,
        hp: 30, maxHp: 30,
        attack: 15, defense: 8, speed: 12,
        weapon: "Sword",
        level: 5, exp: 0,
        color: "#FF6B6B"
    }
    // Add more units...
];
```

### Event Handling
```javascript
// Listen for combat events
tacticalPlugin.addEventListener('unitSelected', (unit) => {
    console.log(`Selected unit: ${unit.name}`);
});

tacticalPlugin.addEventListener('combatResolved', (result) => {
    console.log(`Combat result:`, result);
});

tacticalPlugin.addEventListener('turnChanged', (phase) => {
    console.log(`New phase: ${phase}`);
});
```

## Plugin API Reference

### Constructor Options
- `canvas`: HTML5 Canvas element for rendering
- `onGameEnd`: Callback function for game completion
- `config`: Optional configuration overrides

### Methods
- `initialize(unitData)`: Initialize plugin with unit data
- `reset()`: Reset game to initial state
- `getCurrentPhase()`: Get current turn phase
- `getSelectedUnit()`: Get currently selected unit
- `getGameState()`: Get complete game state
- `addEventListener(event, callback)`: Register event listeners
- `removeEventListener(event, callback)`: Remove event listeners

### Events
- `unitSelected`: Fired when a unit is selected
- `unitMoved`: Fired when a unit moves
- `combatInitiated`: Fired when combat begins
- `combatResolved`: Fired when combat ends
- `turnChanged`: Fired when phase changes
- `gameEnded`: Fired when game concludes

## Customization Options

### Game Configuration
```javascript
const config = {
    doubleAttackSpeedThreshold: 4,  // Speed difference for double attacks
    criticalHitRate: 5,             // Base critical hit percentage
    weaponTriangleBonus: 15,        // Weapon triangle advantage bonus
    movementRange: 3,               // Base movement range
    expGainBase: 10,                // Base EXP gain
    expGainKill: 30,                // Bonus EXP for defeating enemies
    cellSize: 64,                   // Grid cell size in pixels
    gridWidth: 8,                   // Map width in cells
    gridHeight: 8                   // Map height in cells
};
```

### Custom Weapon Types
```javascript
const customWeaponTriangle = {
    'Magic': { strong: 'Physical', weak: 'Resist' },
    'Physical': { strong: 'Resist', weak: 'Magic' },
    'Resist': { strong: 'Magic', weak: 'Physical' }
};
```

## Integration Patterns

### As a Game Component
```javascript
class MyGame {
    constructor() {
        this.tacticalCombat = new TacticalCombatPlugin({
            canvas: this.gameCanvas,
            onGameEnd: this.handleCombatEnd.bind(this)
        });
    }
    
    startTacticalBattle(enemyUnits, playerUnits) {
        const allUnits = [...playerUnits, ...enemyUnits];
        this.tacticalCombat.initialize(allUnits);
    }
    
    handleCombatEnd(winner) {
        // Return to main game after combat
        this.switchToOverworldMode();
    }
}
```

### As a Battle System Module
```javascript
class BattleManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.tacticalPlugin = new TacticalCombatPlugin({
            canvas: gameEngine.getBattleCanvas(),
            onGameEnd: this.resolveBattle.bind(this)
        });
    }
    
    initiateCombat(scenario) {
        this.currentScenario = scenario;
        this.tacticalPlugin.initialize(scenario.units);
    }
    
    resolveBattle(result) {
        this.gameEngine.handleBattleResult(result);
    }
}
```

## Best Practices

### Performance Optimization
- Use object pooling for temporary UI elements
- Implement viewport culling for large maps
- Cache frequently accessed DOM elements
- Minimize canvas redraws with dirty rectangle tracking

### State Management
- Serialize game state for save/load functionality
- Implement undo/redo with command pattern
- Use immutable state updates for predictable behavior

### User Experience
- Provide clear visual feedback for all actions
- Implement smooth animations for unit movement
- Add sound effects and visual effects hooks
- Ensure responsive design for mobile devices

## Example Implementations

### RPG Integration
```javascript
// In your RPG's battle transition
function enterTacticalBattle(encounter) {
    const battleUnits = convertToTacticalUnits(encounter);
    tacticalCombat.initialize(battleUnits);
    
    // Hide RPG UI, show tactical UI
    toggleUIMode('tactical');
}

function exitTacticalBattle(result) {
    // Process battle results
    updatePlayerParty(result.survivingUnits);
    grantExperience(result.expGained);
    
    // Return to RPG mode
    toggleUIMode('rpg');
}
```

### Strategy Game Integration
```javascript
// In your strategy game's combat resolution
function resolveMapCombat(attackingArmy, defendingArmy) {
    const tacticalUnits = convertArmyToUnits(attackingArmy, defendingArmy);
    
    tacticalCombat.addEventListener('gameEnded', (winner) => {
        updateMapAfterBattle(winner, tacticalUnits);
    });
    
    tacticalCombat.initialize(tacticalUnits);
}
```

## Support and Extensions

### Plugin Extensions
The system supports additional plugins for:
- Terrain effects and elevation
- Special abilities and magic systems
- Advanced AI behavior
- Multiplayer networking
- Visual effect systems

### Community Resources
- [GitHub Repository](https://github.com/tactical-combat-plugin)
- [Documentation Wiki](https://wiki.tactical-combat-plugin.dev)
- [Discord Community](https://discord.gg/tactical-combat)
- [Tutorial Videos](https://youtube.com/tactical-combat-tutorials)

This plugin provides a solid foundation for implementing sophisticated tactical combat in web games while maintaining flexibility for customization and extension.