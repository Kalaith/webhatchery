```javascript
// Example: Integrating the Tactical Combat Plugin into an existing web game

// 1. Import the plugin (if using modules)
import { TacticalCombatPlugin } from './tactical-combat-plugin.js';

// 2. Configuration
const combatConfig = {
  doubleAttackSpeedThreshold: 4,
  criticalHitRate: 5,
  weaponTriangleBonus: 15,
  movementRange: 3,
  expGainBase: 10,
  expGainKill: 30,
  cellSize: 64,
  gridWidth: 8,
  gridHeight: 8
};

// 3. Define custom units for your game
const myGameUnits = [
  {
    id: "player1",
    name: "Hero",
    type: "Swordfighter",
    faction: "player",
    x: 1, y: 6,
    hp: 28, maxHp: 28,
    attack: 12, defense: 6, speed: 11,
    weapon: "Sword",
    level: 3, exp: 45,
    color: "#4A90E2"
  },
  // Add more units...
];

// 4. Initialize plugin when tactical combat is needed
class MyGame {
  constructor() {
    // Setup main game...
    
    // Setup tactical combat plugin
    this.tacticalCombat = new TacticalCombatPlugin({
      canvas: document.getElementById('combatCanvas'),
      config: combatConfig,
      onGameEnd: this.handleCombatEnd.bind(this)
    });
    
    // Register event listeners
    this.tacticalCombat.addEventListener('unitSelected', this.handleUnitSelected.bind(this));
    this.tacticalCombat.addEventListener('combatResolved', this.handleCombatResolved.bind(this));
    this.tacticalCombat.addEventListener('turnChanged', this.handleTurnChanged.bind(this));
  }
  
  // 5. Start a tactical battle when needed
  startTacticalBattle(playerUnits, enemyUnits) {
    // Hide main game UI
    this.hideMainUI();
    
    // Show combat UI
    document.getElementById('combatContainer').style.display = 'flex';
    
    // Initialize combat with units from both sides
    const battleUnits = [...playerUnits, ...enemyUnits];
    this.tacticalCombat.initialize(battleUnits);
  }
  
  // 6. Handle combat events
  handleUnitSelected(unit) {
    console.log(`Selected unit: ${unit.name}`);
    // Update your UI based on selection
    this.updateUnitInfoPanel(unit);
  }
  
  handleCombatResolved(result) {
    console.log('Combat result:', result);
    // Play attack animations, sound effects, etc.
    this.playCombatAnimation(result);
  }
  
  handleTurnChanged(phase) {
    console.log(`Turn phase changed to: ${phase}`);
    // Update UI for current phase
    this.updatePhaseIndicator(phase);
  }
  
  // 7. Handle end of tactical combat
  handleCombatEnd(result) {
    console.log('Battle ended!', result);
    
    // Process results in your main game
    if (result.winner === 'player') {
      this.givePlayerRewards(result.expGained);
    }
    
    // Hide combat UI
    document.getElementById('combatContainer').style.display = 'none';
    
    // Return to main game
    this.showMainUI();
    this.continueMainGameStory();
  }
}

// 8. Create game instance
const game = new MyGame();

// 9. Start a battle when player encounters enemies
document.getElementById('startBattleBtn').addEventListener('click', () => {
  const currentPlayerUnits = game.getPlayerParty();
  const enemyEncounter = game.generateEnemyEncounter();
  
  game.startTacticalBattle(currentPlayerUnits, enemyEncounter);
});
```