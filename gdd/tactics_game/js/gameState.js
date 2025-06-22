// Game State Management
import { CONFIG, DEFAULT_UNITS } from './config.js';

export class GameState {
    constructor() {
        this.units = [];
        this.selectedUnit = null;
        this.targetUnit = null;
        this.currentPhase = 'player';
        this.turnCounter = 1;
        this.gameState = 'playing';
        this.movementHighlights = [];
        this.attackHighlights = [];
        this.gameMode = 'select'; // select, move, attack
    }
    
    initialize(unitData = null) {
        if (unitData) {
            this.units = unitData.map(unit => ({ ...unit, moved: false, acted: false }));
        } else {
            this.units = DEFAULT_UNITS.map(unit => ({ ...unit }));
        }
        this.resetTurnState();
    }
    
    resetGame() {
        this.initialize();
        this.selectedUnit = null;
        this.targetUnit = null;
        this.currentPhase = 'player';
        this.turnCounter = 1;
        this.gameState = 'playing';
        this.clearHighlights();
        this.gameMode = 'select';
    }
    
    resetTurnState() {
        this.units.forEach(unit => {
            unit.moved = false;
            unit.acted = false;
        });
    }
    
    endTurn() {
        if (this.currentPhase === 'player') {
            this.currentPhase = 'enemy';
            this.resetTurnState();
        } else {
            this.currentPhase = 'player';
            this.turnCounter++;
            this.resetTurnState();
        }
        this.clearSelection();
    }
    
    clearSelection() {
        this.selectedUnit = null;
        this.targetUnit = null;
        this.gameMode = 'select';
        this.clearHighlights();
    }
    
    clearHighlights() {
        this.movementHighlights = [];
        this.attackHighlights = [];
    }
    
    selectUnit(unit) {
        if (this.currentPhase !== unit.faction) return false;
        if (unit.moved && unit.acted) return false;
        
        this.selectedUnit = unit;
        this.gameMode = 'select';
        this.clearHighlights();
        return true;
    }
    
    getUnitAt(x, y) {
        return this.units.find(unit => unit.x === x && unit.y === y && unit.hp > 0);
    }
    
    removeUnit(unit) {
        const index = this.units.indexOf(unit);
        if (index !== -1) {
            this.units.splice(index, 1);
        }
    }
    
    isValidPosition(x, y) {
        return x >= 0 && x < CONFIG.gridWidth && y >= 0 && y < CONFIG.gridHeight;
    }
    
    getPlayerUnits() {
        return this.units.filter(unit => unit.faction === 'player' && unit.hp > 0);
    }
    
    getEnemyUnits() {
        return this.units.filter(unit => unit.faction === 'enemy' && unit.hp > 0);
    }
    
    checkGameEnd() {
        const playerUnits = this.getPlayerUnits();
        const enemyUnits = this.getEnemyUnits();
        
        if (playerUnits.length === 0) {
            this.gameState = 'defeat';
            return 'defeat';
        } else if (enemyUnits.length === 0) {
            this.gameState = 'victory';
            return 'victory';
        }
        
        return null;
    }
    
    calculateMovementRange(unit) {
        this.movementHighlights = [];
        if (unit.moved) return;
        
        const range = CONFIG.movementRange;
        
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const distance = Math.abs(dx) + Math.abs(dy);
                if (distance <= range && distance > 0) {
                    const newX = unit.x + dx;
                    const newY = unit.y + dy;
                    
                    if (this.isValidPosition(newX, newY) && !this.getUnitAt(newX, newY)) {
                        this.movementHighlights.push({ x: newX, y: newY });
                    }
                }
            }
        }
    }
    
    calculateAttackRange(unit) {
        this.attackHighlights = [];
        
        const range = 1; // Melee weapons have range 1
        const positions = unit.moved ? [{ x: unit.x, y: unit.y }] : [
            ...this.movementHighlights.map(pos => pos),
            { x: unit.x, y: unit.y }
        ];
        
        positions.forEach(pos => {
            for (let dx = -range; dx <= range; dx++) {
                for (let dy = -range; dy <= range; dy++) {
                    const distance = Math.abs(dx) + Math.abs(dy);
                    if (distance === range) {
                        const targetX = pos.x + dx;
                        const targetY = pos.y + dy;
                        
                        if (this.isValidPosition(targetX, targetY)) {
                            const targetUnit = this.getUnitAt(targetX, targetY);
                            if (targetUnit && targetUnit.faction !== unit.faction) {
                                this.attackHighlights.push({ x: targetX, y: targetY });
                            }
                        }
                    }
                }
            }
        });
    }
    
    moveUnit(unit, x, y) {
        if (unit.moved) return false;
        if (!this.isValidPosition(x, y)) return false;
        if (this.getUnitAt(x, y)) return false;
        
        // Check if position is in movement range
        const inRange = this.movementHighlights.some(pos => pos.x === x && pos.y === y);
        if (!inRange && !(unit.x === x && unit.y === y)) return false;
        
        unit.x = x;
        unit.y = y;
        unit.moved = true;
        
        return true;
    }
    
    waitAction() {
        if (this.selectedUnit) {
            this.selectedUnit.moved = true;
            this.selectedUnit.acted = true;
            this.clearSelection();
        }
    }
}
