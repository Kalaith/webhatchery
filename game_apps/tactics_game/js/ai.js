// AI System for enemy units
export class AISystem {
    static executeEnemyTurn(gameState) {
        const enemyUnits = gameState.getEnemyUnits();
        
        for (const unit of enemyUnits) {
            if (unit.moved && unit.acted) continue;
            
            this.executeUnitTurn(unit, gameState);
        }
    }
    
    static executeUnitTurn(unit, gameState) {
        // Find the closest player unit
        const playerUnits = gameState.getPlayerUnits();
        let closestPlayer = null;
        let closestDistance = Infinity;
        
        playerUnits.forEach(player => {
            const distance = Math.abs(unit.x - player.x) + Math.abs(unit.y - player.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPlayer = player;
            }
        });
        
        if (!closestPlayer) return;
        
        // Try to attack if in range
        const attackTargets = this.getAttackTargets(unit, gameState);
        if (attackTargets.length > 0 && !unit.acted) {
            // Attack the target with lowest HP or highest priority
            const target = this.selectBestTarget(attackTargets, gameState);
            if (target) {
                this.executeAttack(unit, target, gameState);
                unit.acted = true;
            }
        }
        
        // Move towards closest player if not moved
        if (!unit.moved) {
            const bestPosition = this.findBestMovePosition(unit, closestPlayer, gameState);
            if (bestPosition) {
                gameState.moveUnit(unit, bestPosition.x, bestPosition.y);
            } else {
                unit.moved = true; // No valid moves
            }
        }
        
        // Mark as acted if no other actions available
        if (!unit.acted) {
            unit.acted = true;
        }
    }
    
    static getAttackTargets(unit, gameState) {
        const targets = [];
        const range = 1; // Melee range
        
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const distance = Math.abs(dx) + Math.abs(dy);
                if (distance === range) {
                    const targetX = unit.x + dx;
                    const targetY = unit.y + dy;
                    
                    if (gameState.isValidPosition(targetX, targetY)) {
                        const target = gameState.getUnitAt(targetX, targetY);
                        if (target && target.faction === 'player') {
                            targets.push(target);
                        }
                    }
                }
            }
        }
        
        return targets;
    }
    
    static selectBestTarget(targets, gameState) {
        // Priority: lowest HP, then highest damage dealt
        let bestTarget = null;
        let bestScore = -1;
        
        targets.forEach(target => {
            // Score based on low HP (easier to kill) and high damage potential
            const score = (100 - target.hp) + (target.attack * 0.5);
            if (score > bestScore) {
                bestScore = score;
                bestTarget = target;
            }
        });
        
        return bestTarget;
    }
    
    static executeAttack(attacker, defender, gameState) {
        // This would normally call the combat system
        // For now, just mark that an attack happened
        console.log(`${attacker.name} attacks ${defender.name}`);
        // The actual combat execution would be handled by the main game loop
    }
    
    static findBestMovePosition(unit, target, gameState) {
        const possibleMoves = [];
        const range = 3; // Movement range
        
        // Generate all possible move positions
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const distance = Math.abs(dx) + Math.abs(dy);
                if (distance <= range && distance > 0) {
                    const newX = unit.x + dx;
                    const newY = unit.y + dy;
                    
                    if (gameState.isValidPosition(newX, newY) && !gameState.getUnitAt(newX, newY)) {
                        possibleMoves.push({ x: newX, y: newY });
                    }
                }
            }
        }
        
        if (possibleMoves.length === 0) return null;
        
        // Find the move that gets closest to the target
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
}
