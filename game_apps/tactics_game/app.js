// Tactical Combat Plugin System - Fire Emblem Style
class TacticalCombatPlugin {
    constructor(options = {}) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.onGameEnd = options.onGameEnd || (() => {});
        
        // Game configuration
        this.config = {
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
        
        // Game state
        this.units = [];
        this.selectedUnit = null;
        this.targetUnit = null;
        this.currentPhase = 'player';
        this.turnCounter = 1;
        this.gameState = 'playing';
        this.movementHighlights = [];
        this.attackHighlights = [];
        this.gameMode = 'select'; // select, move, attack
        
        // Weapon triangle
        this.weaponTriangle = {
            'Sword': { strong: 'Axe', weak: 'Lance' },
            'Axe': { strong: 'Lance', weak: 'Sword' },
            'Lance': { strong: 'Sword', weak: 'Axe' }
        };
        
        this.initializeEventListeners();
    }
    
    initialize(unitData = null) {
        if (unitData) {
            this.units = unitData.map(unit => ({ ...unit, moved: false, acted: false }));
        } else {
            this.loadDefaultUnits();
        }
        this.render();
        this.updateUI();
    }
    
    loadDefaultUnits() {
        this.units = [
            {
                id: "player1", name: "Ren", type: "Swordfighter", faction: "player",
                x: 1, y: 6, hp: 28, maxHp: 28, attack: 12, defense: 6, speed: 11,
                weapon: "Sword", level: 3, exp: 45, color: "#4A90E2", moved: false, acted: false
            },
            {
                id: "player2", name: "Axel", type: "Axe Fighter", faction: "player", 
                x: 2, y: 7, hp: 32, maxHp: 32, attack: 14, defense: 8, speed: 7,
                weapon: "Axe", level: 2, exp: 23, color: "#E74C3C", moved: false, acted: false
            },
            {
                id: "player3", name: "Lance", type: "Lance Knight", faction: "player",
                x: 0, y: 7, hp: 30, maxHp: 30, attack: 13, defense: 9, speed: 8,
                weapon: "Lance", level: 3, exp: 67, color: "#2ECC71", moved: false, acted: false
            },
            {
                id: "enemy1", name: "Bandit", type: "Axe Fighter", faction: "enemy",
                x: 5, y: 1, hp: 26, maxHp: 26, attack: 11, defense: 5, speed: 6,
                weapon: "Axe", level: 2, exp: 0, color: "#8B0000", moved: false, acted: false
            },
            {
                id: "enemy2", name: "Mercenary", type: "Swordfighter", faction: "enemy",
                x: 6, y: 0, hp: 24, maxHp: 24, attack: 10, defense: 4, speed: 9,
                weapon: "Sword", level: 1, exp: 0, color: "#8B0000", moved: false, acted: false
            },
            {
                id: "enemy3", name: "Knight", type: "Lance Knight", faction: "enemy",
                x: 7, y: 1, hp: 28, maxHp: 28, attack: 12, defense: 7, speed: 5,
                weapon: "Lance", level: 2, exp: 0, color: "#8B0000", moved: false, acted: false
            }
        ];
    }
    
    initializeEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasHover(e));
        
        // Control buttons
        document.getElementById('moveBtn').addEventListener('click', () => this.setGameMode('move'));
        document.getElementById('attackBtn').addEventListener('click', () => this.setGameMode('attack'));
        document.getElementById('waitBtn').addEventListener('click', () => this.waitAction());
        document.getElementById('endTurnBtn').addEventListener('click', () => this.endTurn());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.config.cellSize);
        const y = Math.floor((e.clientY - rect.top) / this.config.cellSize);
        
        if (x < 0 || x >= this.config.gridWidth || y < 0 || y >= this.config.gridHeight) return;
        
        const clickedUnit = this.getUnitAt(x, y);
        
        if (this.gameMode === 'select') {
            if (clickedUnit && clickedUnit.faction === this.currentPhase && !clickedUnit.acted) {
                this.selectUnit(clickedUnit);
            } else {
                this.deselectUnit();
            }
        } else if (this.gameMode === 'move') {
            if (this.canMoveTo(x, y)) {
                this.moveUnit(this.selectedUnit, x, y);
            }
        } else if (this.gameMode === 'attack') {
            if (clickedUnit && this.canAttack(this.selectedUnit, clickedUnit)) {
                this.initiateAttack(this.selectedUnit, clickedUnit);
            }
        }
        
        this.render();
        this.updateUI();
    }
    
    handleCanvasHover(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.config.cellSize);
        const y = Math.floor((e.clientY - rect.top) / this.config.cellSize);
        
        const hoveredUnit = this.getUnitAt(x, y);
        
        if (this.gameMode === 'attack' && hoveredUnit && this.selectedUnit) {
            if (this.canAttack(this.selectedUnit, hoveredUnit)) {
                this.showCombatForecast(this.selectedUnit, hoveredUnit);
            } else {
                this.hideCombatForecast();
            }
        }
    }
    
    selectUnit(unit) {
        this.selectedUnit = unit;
        this.gameMode = 'select';
        this.calculateMovementRange(unit);
        this.calculateAttackRange(unit);
        this.updateActionButtons();
    }
    
    deselectUnit() {
        this.selectedUnit = null;
        this.gameMode = 'select';
        this.movementHighlights = [];
        this.attackHighlights = [];
        this.updateActionButtons();
        this.hideCombatForecast();
    }
    
    setGameMode(mode) {
        if (!this.selectedUnit) return;
        
        this.gameMode = mode;
        if (mode === 'move') {
            this.calculateMovementRange(this.selectedUnit);
        } else if (mode === 'attack') {
            this.calculateAttackRange(this.selectedUnit);
        }
        this.render();
    }
    
    calculateMovementRange(unit) {
        this.movementHighlights = [];
        if (unit.moved) return;
        
        const range = this.config.movementRange;
        
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
        
        const attackPositions = new Set();
        
        positions.forEach(pos => {
            for (let dx = -range; dx <= range; dx++) {
                for (let dy = -range; dy <= range; dy++) {
                    const distance = Math.abs(dx) + Math.abs(dy);
                    if (distance === range) {
                        const attackX = pos.x + dx;
                        const attackY = pos.y + dy;
                        
                        if (this.isValidPosition(attackX, attackY)) {
                            const target = this.getUnitAt(attackX, attackY);
                            if (target && target.faction !== unit.faction) {
                                attackPositions.add(`${attackX},${attackY}`);
                            }
                        }
                    }
                }
            }
        });
        
        this.attackHighlights = Array.from(attackPositions).map(pos => {
            const [x, y] = pos.split(',').map(Number);
            return { x, y };
        });
    }
    
    canMoveTo(x, y) {
        return this.movementHighlights.some(pos => pos.x === x && pos.y === y);
    }
    
    canAttack(attacker, target) {
        if (!attacker || !target || attacker.faction === target.faction) return false;
        if (attacker.acted) return false;
        
        const distance = Math.abs(attacker.x - target.x) + Math.abs(attacker.y - target.y);
        return distance === 1;
    }
    
    moveUnit(unit, x, y) {
        unit.x = x;
        unit.y = y;
        unit.moved = true;
        this.gameMode = 'select';
        this.calculateAttackRange(unit);
    }
    
    waitAction() {
        if (this.selectedUnit) {
            this.selectedUnit.acted = true;
            this.selectedUnit.moved = true;
            this.deselectUnit();
        }
    }
    
    initiateAttack(attacker, target) {
        const combat = this.calculateCombat(attacker, target);
        this.executeCombat(combat);
        
        attacker.acted = true;
        attacker.moved = true;
        this.deselectUnit();
        
        // Check for game end
        this.checkGameEnd();
    }
    
    calculateCombat(attacker, defender) {
        const weaponAdvantage = this.getWeaponAdvantage(attacker.weapon, defender.weapon);
        
        // Calculate hit rates
        const attackerHit = Math.min(95, 80 + (attacker.speed - defender.speed) * 2 + weaponAdvantage);
        const defenderHit = Math.min(95, 80 + (defender.speed - attacker.speed) * 2 - weaponAdvantage);
        
        // Calculate damage
        const attackerDamage = Math.max(0, attacker.attack - defender.defense + Math.floor(weaponAdvantage / 5));
        const defenderDamage = Math.max(0, defender.attack - attacker.defense - Math.floor(weaponAdvantage / 5));
        
        // Calculate double attacks
        const attackerDoubles = (attacker.speed - defender.speed) >= this.config.doubleAttackSpeedThreshold;
        const defenderDoubles = (defender.speed - attacker.speed) >= this.config.doubleAttackSpeedThreshold;
        
        // Calculate critical hits
        const attackerCrit = Math.min(30, this.config.criticalHitRate + Math.floor(attacker.speed / 2));
        const defenderCrit = Math.min(30, this.config.criticalHitRate + Math.floor(defender.speed / 2));
        
        return {
            attacker, defender, weaponAdvantage,
            attackerHit, defenderHit, attackerDamage, defenderDamage,
            attackerDoubles, defenderDoubles, attackerCrit, defenderCrit
        };
    }
    
    executeCombat(combat) {
        const { attacker, defender, attackerHit, defenderHit, attackerDamage, defenderDamage,
                attackerDoubles, defenderDoubles, attackerCrit, defenderCrit } = combat;
        
        let attackerExp = this.config.expGainBase;
        let defenderExp = this.config.expGainBase;
        
        // Attacker's first strike
        if (Math.random() * 100 < attackerHit) {
            const isCrit = Math.random() * 100 < attackerCrit;
            const damage = isCrit ? attackerDamage * 3 : attackerDamage;
            defender.hp = Math.max(0, defender.hp - damage);
            
            if (defender.hp === 0) {
                attackerExp += this.config.expGainKill;
                this.levelUpCheck(attacker, attackerExp);
                return;
            }
        }
        
        // Defender's counter attack
        if (defender.hp > 0 && Math.random() * 100 < defenderHit) {
            const isCrit = Math.random() * 100 < defenderCrit;
            const damage = isCrit ? defenderDamage * 3 : defenderDamage;
            attacker.hp = Math.max(0, attacker.hp - damage);
            
            if (attacker.hp === 0) {
                this.levelUpCheck(defender, defenderExp);
                return;
            }
        }
        
        // Attacker's second strike (if applicable)
        if (attackerDoubles && attacker.hp > 0 && defender.hp > 0 && Math.random() * 100 < attackerHit) {
            const isCrit = Math.random() * 100 < attackerCrit;
            const damage = isCrit ? attackerDamage * 3 : attackerDamage;
            defender.hp = Math.max(0, defender.hp - damage);
            
            if (defender.hp === 0) {
                attackerExp += this.config.expGainKill;
            }
        }
        
        // Defender's second strike (if applicable)
        if (defenderDoubles && defender.hp > 0 && attacker.hp > 0 && Math.random() * 100 < defenderHit) {
            const isCrit = Math.random() * 100 < defenderCrit;
            const damage = isCrit ? defenderDamage * 3 : defenderDamage;
            attacker.hp = Math.max(0, attacker.hp - damage);
            
            if (attacker.hp === 0) {
                defenderExp += this.config.expGainKill;
            }
        }
        
        // Award experience
        if (attacker.hp > 0) this.levelUpCheck(attacker, attackerExp);
        if (defender.hp > 0) this.levelUpCheck(defender, defenderExp);
    }
    
    levelUpCheck(unit, expGain) {
        if (unit.faction === 'enemy') return;
        
        unit.exp += expGain;
        if (unit.exp >= 100) {
            unit.exp -= 100;
            unit.level++;
            
            // Stat growth (simplified)
            unit.maxHp += Math.floor(Math.random() * 3) + 1;
            unit.hp = unit.maxHp;
            unit.attack += Math.floor(Math.random() * 2) + 1;
            unit.defense += Math.floor(Math.random() * 2);
            unit.speed += Math.floor(Math.random() * 2);
        }
    }
    
    getWeaponAdvantage(weapon1, weapon2) {
        const triangle = this.weaponTriangle[weapon1];
        if (!triangle) return 0;
        
        if (triangle.strong === weapon2) return this.config.weaponTriangleBonus;
        if (triangle.weak === weapon2) return -this.config.weaponTriangleBonus;
        return 0;
    }
    
    endTurn() {
        if (this.currentPhase === 'player') {
            this.currentPhase = 'enemy';
            this.resetUnitActions('enemy');
            this.executeEnemyTurn();
        } else {
            this.currentPhase = 'player';
            this.turnCounter++;
            this.resetUnitActions('player');
        }
        
        this.deselectUnit();
        this.updateUI();
    }
    
    resetUnitActions(faction) {
        this.units.forEach(unit => {
            if (unit.faction === faction) {
                unit.moved = false;
                unit.acted = false;
            }
        });
    }
    
    executeEnemyTurn() {
        const enemyUnits = this.units.filter(unit => unit.faction === 'enemy' && unit.hp > 0);
        
        setTimeout(() => {
            enemyUnits.forEach(unit => {
                if (unit.hp === 0) return;
                
                const playerUnits = this.units.filter(u => u.faction === 'player' && u.hp > 0);
                const nearestPlayer = this.findNearestUnit(unit, playerUnits);
                
                if (nearestPlayer) {
                    this.moveEnemyTowardsTarget(unit, nearestPlayer);
                    
                    if (this.canAttack(unit, nearestPlayer)) {
                        this.initiateAttack(unit, nearestPlayer);
                    }
                }
                
                unit.acted = true;
                unit.moved = true;
            });
            
            this.render();
            this.checkGameEnd();
            
            setTimeout(() => {
                this.endTurn();
            }, 1000);
        }, 500);
    }
    
    findNearestUnit(unit, targets) {
        let nearest = null;
        let minDistance = Infinity;
        
        targets.forEach(target => {
            const distance = Math.abs(unit.x - target.x) + Math.abs(unit.y - target.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = target;
            }
        });
        
        return nearest;
    }
    
    moveEnemyTowardsTarget(unit, target) {
        const dx = target.x - unit.x;
        const dy = target.y - unit.y;
        
        let bestX = unit.x;
        let bestY = unit.y;
        let bestDistance = Math.abs(dx) + Math.abs(dy);
        
        // Try moving in each direction
        const moves = [
            { x: unit.x + Math.sign(dx), y: unit.y },
            { x: unit.x, y: unit.y + Math.sign(dy) },
            { x: unit.x - Math.sign(dx), y: unit.y },
            { x: unit.x, y: unit.y - Math.sign(dy) }
        ];
        
        moves.forEach(move => {
            if (this.isValidPosition(move.x, move.y) && !this.getUnitAt(move.x, move.y)) {
                const distance = Math.abs(move.x - target.x) + Math.abs(move.y - target.y);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestX = move.x;
                    bestY = move.y;
                }
            }
        });
        
        unit.x = bestX;
        unit.y = bestY;
    }
    
    checkGameEnd() {
        const playerUnits = this.units.filter(unit => unit.faction === 'player' && unit.hp > 0);
        const enemyUnits = this.units.filter(unit => unit.faction === 'enemy' && unit.hp > 0);
        
        if (playerUnits.length === 0) {
            this.gameState = 'defeat';
            this.showGameEnd('Defeat');
        } else if (enemyUnits.length === 0) {
            this.gameState = 'victory';
            this.showGameEnd('Victory');
        }
    }
    
    showGameEnd(result) {
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        
        const content = document.createElement('div');
        content.className = 'game-over-content';
        content.innerHTML = `
            <h2 class="game-over-title ${result.toLowerCase()}">${result}!</h2>
            <p>${result === 'Victory' ? 'Congratulations! You defeated all enemies.' : 'All your units have fallen.'}</p>
            <button class="btn btn--primary" onclick="this.parentElement.parentElement.remove(); tacticalCombat.resetGame();">
                Play Again
            </button>
        `;
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        this.onGameEnd(result.toLowerCase());
    }
    
    resetGame() {
        this.gameState = 'playing';
        this.currentPhase = 'player';
        this.turnCounter = 1;
        this.selectedUnit = null;
        this.gameMode = 'select';
        this.movementHighlights = [];
        this.attackHighlights = [];
        
        this.loadDefaultUnits();
        this.render();
        this.updateUI();
        this.hideCombatForecast();
        
        // Remove game end overlay if it exists
        const overlay = document.querySelector('.game-over-overlay');
        if (overlay) overlay.remove();
    }
    
    getUnitAt(x, y) {
        return this.units.find(unit => unit.x === x && unit.y === y && unit.hp > 0);
    }
    
    isValidPosition(x, y) {
        return x >= 0 && x < this.config.gridWidth && y >= 0 && y < this.config.gridHeight;
    }
    
    showCombatForecast(attacker, defender) {
        const combat = this.calculateCombat(attacker, defender);
        const forecastEl = document.getElementById('combatForecast');
        const contentEl = document.getElementById('combatForecastContent');
        
        const weaponAdvantage = this.getWeaponAdvantage(attacker.weapon, defender.weapon);
        let advantageText = '';
        let advantageClass = '';
        
        if (weaponAdvantage > 0) {
            advantageText = 'Advantage';
            advantageClass = 'strong';
        } else if (weaponAdvantage < 0) {
            advantageText = 'Disadvantage';
            advantageClass = 'weak';
        }
        
        contentEl.innerHTML = `
            <div class="combat-participants">
                <div class="combat-unit">
                    <div class="combat-unit-name">${attacker.name}</div>
                    <div class="combat-stats">
                        <div>DMG: ${combat.attackerDamage}</div>
                        <div>HIT: ${combat.attackerHit}%</div>
                        <div>CRIT: ${combat.attackerCrit}%</div>
                        ${combat.attackerDoubles ? '<div>x2</div>' : ''}
                    </div>
                    ${advantageText ? `<div class="weapon-advantage ${advantageClass}">${advantageText}</div>` : ''}
                </div>
                <div class="combat-vs">VS</div>
                <div class="combat-unit">
                    <div class="combat-unit-name">${defender.name}</div>
                    <div class="combat-stats">
                        <div>DMG: ${combat.defenderDamage}</div>
                        <div>HIT: ${combat.defenderHit}%</div>
                        <div>CRIT: ${combat.defenderCrit}%</div>
                        ${combat.defenderDoubles ? '<div>x2</div>' : ''}
                    </div>
                </div>
            </div>
        `;
        
        forecastEl.style.display = 'block';
    }
    
    hideCombatForecast() {
        document.getElementById('combatForecast').style.display = 'none';
    }
    
    updateActionButtons() {
        const moveBtn = document.getElementById('moveBtn');
        const attackBtn = document.getElementById('attackBtn');
        const waitBtn = document.getElementById('waitBtn');
        
        const hasSelected = this.selectedUnit && this.selectedUnit.faction === this.currentPhase;
        
        moveBtn.disabled = !hasSelected || this.selectedUnit?.moved;
        attackBtn.disabled = !hasSelected || this.selectedUnit?.acted;
        waitBtn.disabled = !hasSelected || this.selectedUnit?.acted;
    }
    
    updateUI() {
        // Update turn counter and phase
        document.getElementById('turnCounter').textContent = this.turnCounter;
        const phaseEl = document.getElementById('phaseIndicator');
        phaseEl.textContent = this.currentPhase === 'player' ? 'Player Phase' : 'Enemy Phase';
        phaseEl.className = `phase-indicator ${this.currentPhase === 'enemy' ? 'enemy-phase' : ''}`;
        
        // Update unit counts
        const playerCount = this.units.filter(u => u.faction === 'player' && u.hp > 0).length;
        const enemyCount = this.units.filter(u => u.faction === 'enemy' && u.hp > 0).length;
        document.getElementById('playerUnitsCount').textContent = playerCount;
        document.getElementById('enemyUnitsCount').textContent = enemyCount;
        
        // Update selected unit info
        this.updateUnitInfo();
        this.updateActionButtons();
    }
    
    updateUnitInfo() {
        const infoEl = document.getElementById('unitInfo');
        
        if (!this.selectedUnit) {
            infoEl.innerHTML = '<p class="text-secondary">Select a unit to view stats</p>';
            return;
        }
        
        const unit = this.selectedUnit;
        const hpPercent = (unit.hp / unit.maxHp) * 100;
        const expPercent = (unit.exp / 100) * 100;
        
        let hpClass = '';
        if (hpPercent <= 25) hpClass = 'critical';
        else if (hpPercent <= 50) hpClass = 'low';
        
        infoEl.innerHTML = `
            <div class="unit-name">${unit.name}</div>
            <div class="unit-type">${unit.type} - Level ${unit.level}</div>
            
            <div class="hp-bar">
                <div class="hp-fill ${hpClass}" style="width: ${hpPercent}%"></div>
            </div>
            <div style="font-size: 12px; margin-bottom: 16px;">HP: ${unit.hp}/${unit.maxHp}</div>
            
            <div class="unit-stats">
                <div class="stat-item">
                    <span>Attack:</span>
                    <span>${unit.attack}</span>
                </div>
                <div class="stat-item">
                    <span>Defense:</span>
                    <span>${unit.defense}</span>
                </div>
                <div class="stat-item">
                    <span>Speed:</span>
                    <span>${unit.speed}</span>
                </div>
                <div class="stat-item">
                    <span>Weapon:</span>
                    <span>${unit.weapon}</span>
                </div>
            </div>
            
            ${unit.faction === 'player' ? `
                <div class="exp-bar">
                    <div class="exp-fill" style="width: ${expPercent}%"></div>
                </div>
                <div style="font-size: 12px; margin-top: 4px;">EXP: ${unit.exp}/100</div>
            ` : ''}
        `;
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw highlights
        this.drawHighlights();
        
        // Draw units
        this.drawUnits();
        
        // Draw selection
        if (this.selectedUnit) {
            this.drawSelection(this.selectedUnit);
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.config.gridWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.config.cellSize, 0);
            this.ctx.lineTo(x * this.config.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.config.gridHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.config.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.config.cellSize);
            this.ctx.stroke();
        }
    }
    
    drawHighlights() {
        // Movement highlights
        this.ctx.fillStyle = 'rgba(33, 128, 141, 0.3)';
        this.movementHighlights.forEach(pos => {
            this.ctx.fillRect(
                pos.x * this.config.cellSize,
                pos.y * this.config.cellSize,
                this.config.cellSize,
                this.config.cellSize
            );
        });
        
        // Attack highlights
        this.ctx.fillStyle = 'rgba(192, 21, 47, 0.3)';
        this.attackHighlights.forEach(pos => {
            this.ctx.fillRect(
                pos.x * this.config.cellSize,
                pos.y * this.config.cellSize,
                this.config.cellSize,
                this.config.cellSize
            );
        });
    }
    
    drawUnits() {
        this.units.forEach(unit => {
            if (unit.hp <= 0) return;
            
            const x = unit.x * this.config.cellSize;
            const y = unit.y * this.config.cellSize;
            
            // Unit background
            this.ctx.fillStyle = unit.color;
            this.ctx.fillRect(x + 4, y + 4, this.config.cellSize - 8, this.config.cellSize - 8);
            
            // Unit border
            this.ctx.strokeStyle = unit.faction === 'player' ? '#2ECC71' : '#E74C3C';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x + 4, y + 4, this.config.cellSize - 8, this.config.cellSize - 8);
            
            // Weapon symbol
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            let symbol = '?';
            if (unit.weapon === 'Sword') symbol = '⚔️';
            else if (unit.weapon === 'Axe') symbol = '🪓';
            else if (unit.weapon === 'Lance') symbol = '🗡️';
            
            this.ctx.fillText(symbol, x + this.config.cellSize / 2, y + this.config.cellSize / 2);
            
            // HP bar
            const hpPercent = unit.hp / unit.maxHp;
            const barWidth = this.config.cellSize - 16;
            const barHeight = 4;
            
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(x + 8, y + this.config.cellSize - 12, barWidth, barHeight);
            
            this.ctx.fillStyle = hpPercent > 0.5 ? '#2ECC71' : hpPercent > 0.25 ? '#F39C12' : '#E74C3C';
            this.ctx.fillRect(x + 8, y + this.config.cellSize - 12, barWidth * hpPercent, barHeight);
            
            // Action indicators
            if (unit.moved || unit.acted) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.fillRect(x, y, this.config.cellSize, this.config.cellSize);
            }
        });
    }
    
    drawSelection(unit) {
        const x = unit.x * this.config.cellSize;
        const y = unit.y * this.config.cellSize;
        
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(x + 2, y + 2, this.config.cellSize - 4, this.config.cellSize - 4);
        this.ctx.setLineDash([]);
    }
}

// Initialize the plugin when the page loads
let tacticalCombat;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    
    tacticalCombat = new TacticalCombatPlugin({
        canvas: canvas,
        onGameEnd: (result) => {
            console.log('Game ended with result:', result);
        }
    });
    
    tacticalCombat.initialize();
});