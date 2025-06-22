// Main Game Controller - Coordinates all systems
import { GameState } from './gameState.js';
import { Renderer } from './renderer.js';
import { UIManager } from './ui.js';
import { CombatSystem } from './combat.js';
import { AISystem } from './ai.js';

export class TacticalCombatGame {
    constructor(options = {}) {
        this.canvas = options.canvas;
        this.onGameEnd = options.onGameEnd || (() => {});
        
        // Initialize systems
        this.gameState = new GameState();
        this.renderer = new Renderer(this.canvas);
        this.ui = new UIManager();
        
        this.initializeEventListeners();
    }
    
    initialize(unitData = null) {
        this.gameState.initialize(unitData);
        this.render();
        this.updateUI();
    }
    
    initializeEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasHover(e));
        
        // Control buttons
        document.getElementById('moveBtn')?.addEventListener('click', () => this.setGameMode('move'));
        document.getElementById('attackBtn')?.addEventListener('click', () => this.setGameMode('attack'));
        document.getElementById('waitBtn')?.addEventListener('click', () => this.waitAction());
        document.getElementById('endTurnBtn')?.addEventListener('click', () => this.endTurn());
        document.getElementById('resetBtn')?.addEventListener('click', () => this.resetGame());
    }
    
    handleCanvasClick(e) {
        const pos = this.renderer.getCanvasPosition(e);
        const clickedUnit = this.gameState.getUnitAt(pos.x, pos.y);
        
        switch (this.gameState.gameMode) {
            case 'select':
                this.handleUnitSelection(clickedUnit);
                break;
            case 'move':
                this.handleMovement(pos.x, pos.y);
                break;
            case 'attack':
                this.handleAttack(clickedUnit);
                break;
        }
        
        this.render();
        this.updateUI();
    }
    
    handleCanvasHover(e) {
        if (this.gameState.gameMode !== 'attack' || !this.gameState.selectedUnit) return;
        
        const pos = this.renderer.getCanvasPosition(e);
        const hoveredUnit = this.gameState.getUnitAt(pos.x, pos.y);
        
        if (hoveredUnit && hoveredUnit.faction !== this.gameState.selectedUnit.faction) {
            const canAttack = this.gameState.attackHighlights.some(h => h.x === pos.x && h.y === pos.y);
            if (canAttack) {
                this.ui.showCombatForecast(this.gameState.selectedUnit, hoveredUnit);
                return;
            }
        }
        
        this.ui.hideCombatForecast();
    }
    
    handleUnitSelection(unit) {
        if (!unit) {
            this.gameState.clearSelection();
            return;
        }
        
        if (this.gameState.selectUnit(unit)) {
            // Unit successfully selected
        } else {
            this.gameState.clearSelection();
        }
    }
    
    handleMovement(x, y) {
        if (!this.gameState.selectedUnit) return;
        
        if (this.gameState.moveUnit(this.gameState.selectedUnit, x, y)) {
            this.gameState.gameMode = 'select';
            this.gameState.clearHighlights();
        }
    }
    
    handleAttack(targetUnit) {
        if (!this.gameState.selectedUnit || !targetUnit) return;
        if (targetUnit.faction === this.gameState.selectedUnit.faction) return;
        
        // Check if target is in attack range
        const inRange = this.gameState.attackHighlights.some(pos => 
            pos.x === targetUnit.x && pos.y === targetUnit.y
        );
        
        if (inRange) {
            this.executeCombat(this.gameState.selectedUnit, targetUnit);
        }
    }
    
    executeCombat(attacker, defender) {
        const combatResult = CombatSystem.executeCombat(attacker, defender);
        
        // Handle defeated units
        if (combatResult.defenderDefeated) {
            const levelUps = CombatSystem.gainExperience(attacker, true);
            this.gameState.removeUnit(defender);
            
            if (levelUps.length > 0) {
                this.ui.showLevelUpModal(attacker, levelUps);
            }
        } else {
            CombatSystem.gainExperience(attacker, false);
        }
        
        if (combatResult.attackerDefeated) {
            this.gameState.removeUnit(attacker);
        }
        
        // Mark attacker as acted
        attacker.acted = true;
        
        // Clear selection and combat forecast
        this.gameState.clearSelection();
        this.ui.hideCombatForecast();
        
        // Check for game end
        const gameResult = this.gameState.checkGameEnd();
        if (gameResult) {
            this.ui.showGameOverModal(gameResult);
            this.onGameEnd(gameResult);
        }
    }
    
    setGameMode(mode) {
        if (!this.gameState.selectedUnit) return;
        
        this.gameState.gameMode = mode;
        if (mode === 'move') {
            this.gameState.calculateMovementRange(this.gameState.selectedUnit);
        } else if (mode === 'attack') {
            this.gameState.calculateAttackRange(this.gameState.selectedUnit);
        }
        this.render();
        this.updateUI();
    }
    
    waitAction() {
        this.gameState.waitAction();
        this.render();
        this.updateUI();
    }
    
    endTurn() {
        if (this.gameState.currentPhase === 'player') {
            // Start enemy turn
            this.gameState.endTurn();
            this.render();
            this.updateUI();
            
            // Execute enemy AI with delay for visibility
            setTimeout(() => {
                this.executeEnemyTurn();
            }, 1000);
        } else {
            this.gameState.endTurn();
            this.render();
            this.updateUI();
        }
    }
    
    executeEnemyTurn() {
        const enemyUnits = this.gameState.getEnemyUnits();
        let unitIndex = 0;
        
        const processNextUnit = () => {
            if (unitIndex >= enemyUnits.length) {
                // All enemy units processed, end enemy turn
                this.gameState.endTurn();
                this.render();
                this.updateUI();
                return;
            }
            
            const unit = enemyUnits[unitIndex];
            if (unit.hp > 0 && (!unit.moved || !unit.acted)) {
                this.executeEnemyUnitTurn(unit);
            }
            
            unitIndex++;
            
            // Delay before processing next unit
            setTimeout(processNextUnit, 800);
        };
        
        processNextUnit();
    }
    
    executeEnemyUnitTurn(unit) {
        // Simple AI: move towards nearest player, attack if possible
        const playerUnits = this.gameState.getPlayerUnits();
        if (playerUnits.length === 0) return;
        
        // Find closest player
        let closestPlayer = null;
        let closestDistance = Infinity;
        
        playerUnits.forEach(player => {
            const distance = Math.abs(unit.x - player.x) + Math.abs(unit.y - player.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPlayer = player;
            }
        });
        
        // Try to attack first
        if (!unit.acted) {
            const attackTargets = this.getEnemyAttackTargets(unit);
            if (attackTargets.length > 0) {
                const target = attackTargets[0]; // Attack first available target
                this.executeCombat(unit, target);
                return; // Combat handles the rest
            }
        }
        
        // Move towards closest player
        if (!unit.moved && closestPlayer) {
            const bestMove = this.findBestEnemyMove(unit, closestPlayer);
            if (bestMove) {
                this.gameState.moveUnit(unit, bestMove.x, bestMove.y);
            } else {
                unit.moved = true;
            }
        }
        
        // Mark as acted if no actions taken
        if (!unit.acted) {
            unit.acted = true;
        }
        
        this.render();
    }
    
    getEnemyAttackTargets(unit) {
        const targets = [];
        const range = 1;
        
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const distance = Math.abs(dx) + Math.abs(dy);
                if (distance === range) {
                    const targetX = unit.x + dx;
                    const targetY = unit.y + dy;
                    
                    const target = this.gameState.getUnitAt(targetX, targetY);
                    if (target && target.faction === 'player') {
                        targets.push(target);
                    }
                }
            }
        }
        
        return targets;
    }
    
    findBestEnemyMove(unit, target) {
        const possibleMoves = [];
        const range = 3;
        
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const distance = Math.abs(dx) + Math.abs(dy);
                if (distance <= range && distance > 0) {
                    const newX = unit.x + dx;
                    const newY = unit.y + dy;
                    
                    if (this.gameState.isValidPosition(newX, newY) && !this.gameState.getUnitAt(newX, newY)) {
                        possibleMoves.push({ x: newX, y: newY });
                    }
                }
            }
        }
        
        if (possibleMoves.length === 0) return null;
        
        // Find move that gets closest to target
        let bestMove = null;
        let bestDistance = Infinity;
        
        possibleMoves.forEach(move => {
            const distance = Math.abs(move.x - target.x) + Math.abs(move.y - target.y);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMove = move;
            }
        });
        
        return bestMove;
    }
    
    resetGame() {
        this.gameState.resetGame();
        this.ui.hideCombatForecast();
        this.render();
        this.updateUI();
    }
    
    render() {
        this.renderer.render(this.gameState);
    }
    
    updateUI() {
        this.ui.updatePhaseIndicator(this.gameState.currentPhase, this.gameState.turnCounter);
        this.ui.updateActionButtons(this.gameState.selectedUnit, this.gameState.gameMode);
        this.ui.updateUnitInfo(this.gameState.selectedUnit);
    }
}
