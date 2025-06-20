// Dungeon Core Simulator - Game Logic

class DungeonCoreGame {
    constructor() {
        this.gameData = {
            roomTypes: [
                { name: "Basic Room", cost: 10, description: "Standard monster encounter room", color: "#666666", spawnCostReduction: 0 },
                { name: "Monster Lair", cost: 25, description: "Reduced monster spawn costs", color: "#8B0000", spawnCostReduction: 0.3 },
                { name: "Trap Hallway", cost: 20, description: "Concentrated trap damage", color: "#FF8C00", spawnCostReduction: 0 },
                { name: "Treasure Room", cost: 40, description: "Increased loot rewards", color: "#FFD700", spawnCostReduction: 0 },
                { name: "Boss Chamber", cost: 100, description: "Final challenge room", color: "#4B0082", spawnCostReduction: 0 }
            ],
            monsterTypes: [
                { name: "Goblin", baseCost: 5, hp: 15, attack: 3, defense: 1, color: "#228B22", description: "Weak but cheap basic monster" },
                { name: "Orc", baseCost: 10, hp: 25, attack: 5, defense: 2, color: "#8B4513", description: "Balanced fighter with decent stats" },
                { name: "Skeleton", baseCost: 8, hp: 20, attack: 4, defense: 3, color: "#F5F5DC", description: "Durable undead warrior" },
                { name: "Troll", baseCost: 20, hp: 40, attack: 7, defense: 3, color: "#556B2F", description: "Powerful tank monster" },
                { name: "Dragon", baseCost: 50, hp: 80, attack: 12, defense: 5, color: "#DC143C", description: "Legendary boss monster" }
            ],
            adventurerClasses: [
                { name: "Warrior", hp: 30, attack: 6, defense: 4, color: "#CD853F" },
                { name: "Mage", hp: 20, attack: 8, defense: 2, color: "#4169E1" },
                { name: "Archer", hp: 25, attack: 7, defense: 3, color: "#228B22" },
                { name: "Rogue", hp: 22, attack: 8, defense: 2, color: "#8B008B" }
            ]
        };

        this.gameState = {
            mana: 50,
            maxMana: 100,
            manaRegen: 1,
            gold: 100,
            souls: 0,
            day: 1,
            gameTime: 0,
            isDayTime: true,
            dungeonOpen: true,
            gameSpeed: 1,
            selectedRoomType: null,
            selectedMonsterType: null,
            placementMode: 'room'
        };

        this.grid = {
            size: 10,
            cellSize: 50,
            cells: []
        };

        this.adventurers = [];
        this.combatQueue = [];
        this.gameLog = [];
        
        this.initializeGrid();
        this.initializeUI();
        this.setupEventListeners();
        this.startGameLoop();
        this.showWelcomeModal();
    }

    initializeGrid() {
        // Initialize empty grid
        for (let y = 0; y < this.grid.size; y++) {
            this.grid.cells[y] = [];
            for (let x = 0; x < this.grid.size; x++) {
                this.grid.cells[y][x] = {
                    roomType: null,
                    monsters: [],
                    isEntrance: x === 0 && y === Math.floor(this.grid.size / 2),
                    isExit: x === this.grid.size - 1 && y === Math.floor(this.grid.size / 2)
                };
            }
        }
    }

    initializeUI() {
        this.canvas = document.getElementById('dungeon-grid');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = this.grid.size * this.grid.cellSize;
        this.canvas.height = this.grid.size * this.grid.cellSize;
        
        this.populateRoomSelector();
        this.populateMonsterSelector();
        this.updateResourceDisplay();
        this.renderGrid();
    }

    populateRoomSelector() {
        const selector = document.getElementById('room-selector');
        this.gameData.roomTypes.forEach((roomType, index) => {
            const roomElement = document.createElement('div');
            roomElement.className = 'room-type';
            roomElement.dataset.roomIndex = index;
            
            roomElement.innerHTML = `
                <div class="room-type-header">
                    <span class="room-type-name">${roomType.name}</span>
                    <span class="room-type-cost">${roomType.cost}💰</span>
                </div>
                <div class="room-type-description">${roomType.description}</div>
            `;
            
            roomElement.addEventListener('click', () => this.selectRoomType(index));
            selector.appendChild(roomElement);
        });
    }

    populateMonsterSelector() {
        const selector = document.getElementById('monster-selector');
        this.gameData.monsterTypes.forEach((monsterType, index) => {
            const monsterElement = document.createElement('div');
            monsterElement.className = 'monster-type';
            monsterElement.dataset.monsterIndex = index;
            
            monsterElement.innerHTML = `
                <div class="monster-type-header">
                    <span class="monster-type-name">${monsterType.name}</span>
                    <span class="monster-type-cost">${monsterType.baseCost}✨</span>
                </div>
                <div class="monster-type-description">${monsterType.description}</div>
                <div class="monster-stats">
                    <div class="stat">HP: ${monsterType.hp}</div>
                    <div class="stat">ATK: ${monsterType.attack}</div>
                    <div class="stat">DEF: ${monsterType.defense}</div>
                </div>
            `;
            
            monsterElement.addEventListener('click', () => this.selectMonsterType(index));
            selector.appendChild(monsterElement);
        });
    }

    selectRoomType(index) {
        // Clear previous selection
        document.querySelectorAll('.room-type').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.monster-type').forEach(el => el.classList.remove('selected'));
        
        // Select new room type
        document.querySelectorAll('.room-type')[index].classList.add('selected');
        this.gameState.selectedRoomType = index;
        this.gameState.selectedMonsterType = null;
        this.gameState.placementMode = 'room';
    }

    selectMonsterType(index) {
        // Clear previous selection
        document.querySelectorAll('.room-type').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.monster-type').forEach(el => el.classList.remove('selected'));
        
        // Select new monster type
        document.querySelectorAll('.monster-type')[index].classList.add('selected');
        this.gameState.selectedMonsterType = index;
        this.gameState.selectedRoomType = null;
        this.gameState.placementMode = 'monster';
    }

    setupEventListeners() {
        // Canvas click handling
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Game controls
        document.getElementById('start-day').addEventListener('click', () => this.startAdventurerPhase());
        document.getElementById('speed-toggle').addEventListener('click', () => this.toggleGameSpeed());
        
        // Modal controls
        document.getElementById('modal-close').addEventListener('click', () => this.hideModal());
        document.getElementById('modal-confirm').addEventListener('click', () => this.hideModal());
    }

    handleCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.grid.cellSize);
        const y = Math.floor((event.clientY - rect.top) / this.grid.cellSize);
        
        if (x >= 0 && x < this.grid.size && y >= 0 && y < this.grid.size) {
            if (this.gameState.placementMode === 'room' && this.gameState.selectedRoomType !== null) {
                this.placeRoom(x, y);
            } else if (this.gameState.placementMode === 'monster' && this.gameState.selectedMonsterType !== null) {
                this.placeMonster(x, y);
            }
        }
    }

    placeRoom(x, y) {
        const cell = this.grid.cells[y][x];
        const roomType = this.gameData.roomTypes[this.gameState.selectedRoomType];
        
        // Check if cell is empty and player has enough gold
        if (!cell.roomType && this.gameState.gold >= roomType.cost) {
            cell.roomType = this.gameState.selectedRoomType;
            this.gameState.gold -= roomType.cost;
            this.updateResourceDisplay();
            this.renderGrid();
            this.addLogEntry(`Placed ${roomType.name} for ${roomType.cost} gold`, 'system');
        } else if (cell.roomType) {
            this.addLogEntry('Cell already occupied!', 'system');
        } else {
            this.addLogEntry('Not enough gold!', 'system');
        }
    }

    placeMonster(x, y) {
        const cell = this.grid.cells[y][x];
        const monsterType = this.gameData.monsterTypes[this.gameState.selectedMonsterType];
        
        // Check if cell has a room and player has enough mana
        if (cell.roomType !== null) {
            const roomType = this.gameData.roomTypes[cell.roomType];
            const cost = Math.floor(monsterType.baseCost * (1 - roomType.spawnCostReduction));
            
            if (this.gameState.mana >= cost) {
                const monster = {
                    type: this.gameState.selectedMonsterType,
                    hp: monsterType.hp,
                    maxHp: monsterType.hp,
                    attack: monsterType.attack,
                    defense: monsterType.defense,
                    alive: true
                };
                
                cell.monsters.push(monster);
                this.gameState.mana -= cost;
                this.updateResourceDisplay();
                this.renderGrid();
                this.addLogEntry(`Spawned ${monsterType.name} for ${cost} mana`, 'system');
            } else {
                this.addLogEntry('Not enough mana!', 'system');
            }
        } else {
            this.addLogEntry('Need to place a room first!', 'system');
        }
    }

    renderGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let y = 0; y < this.grid.size; y++) {
            for (let x = 0; x < this.grid.size; x++) {
                this.renderCell(x, y);
            }
        }
        
        // Render adventurers if any
        this.adventurers.forEach(adventurer => {
            if (adventurer.visible) {
                this.renderAdventurer(adventurer);
            }
        });
    }

    renderCell(x, y) {
        const cell = this.grid.cells[y][x];
        const cellX = x * this.grid.cellSize;
        const cellY = y * this.grid.cellSize;
        
        // Draw cell background
        this.ctx.fillStyle = '#2c2c54';
        this.ctx.fillRect(cellX, cellY, this.grid.cellSize, this.grid.cellSize);
        
        // Draw room if present
        if (cell.roomType !== null) {
            const roomType = this.gameData.roomTypes[cell.roomType];
            this.ctx.fillStyle = roomType.color;
            this.ctx.fillRect(cellX + 2, cellY + 2, this.grid.cellSize - 4, this.grid.cellSize - 4);
        }
        
        // Draw entrance/exit markers
        if (cell.isEntrance) {
            this.ctx.fillStyle = '#00FF00';
            this.ctx.fillRect(cellX, cellY + 20, 10, 10);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '12px Arial';
            this.ctx.fillText('IN', cellX + 12, cellY + 30);
        }
        if (cell.isExit) {
            this.ctx.fillStyle = '#FF0000';
            this.ctx.fillRect(cellX + 40, cellY + 20, 10, 10);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '12px Arial';
            this.ctx.fillText('OUT', cellX + 20, cellY + 30);
        }
        
        // Draw monsters
        if (cell.monsters.length > 0) {
            cell.monsters.forEach((monster, index) => {
                if (monster.alive) {
                    const monsterType = this.gameData.monsterTypes[monster.type];
                    this.ctx.fillStyle = monsterType.color;
                    this.ctx.fillRect(cellX + 10 + (index * 8), cellY + 5, 8, 8);
                }
            });
        }
        
        // Draw grid lines
        this.ctx.strokeStyle = '#444';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(cellX, cellY, this.grid.cellSize, this.grid.cellSize);
    }

    renderAdventurer(adventurer) {
        const cellX = adventurer.x * this.grid.cellSize + 25;
        const cellY = adventurer.y * this.grid.cellSize + 35;
        
        this.ctx.fillStyle = adventurer.color;
        this.ctx.fillRect(cellX, cellY, 12, 12);
        
        // Draw health bar
        const healthPercent = adventurer.hp / adventurer.maxHp;
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(cellX, cellY - 8, 12, 3);
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(cellX, cellY - 8, 12 * healthPercent, 3);
    }

    startAdventurerPhase() {
        if (!this.gameState.dungeonOpen) {
            this.addLogEntry('Dungeon is closed for maintenance!', 'system');
            return;
        }
        
        // Generate adventurer party
        this.generateAdventurerParty();
        this.addLogEntry('Adventurers have entered the dungeon!', 'system');
    }

    generateAdventurerParty() {
        const partySize = Math.floor(Math.random() * 2) + 3; // 3-4 adventurers
        const party = [];
        
        for (let i = 0; i < partySize; i++) {
            const classType = this.gameData.adventurerClasses[Math.floor(Math.random() * this.gameData.adventurerClasses.length)];
            const adventurer = {
                name: `${classType.name} ${i + 1}`,
                class: classType.name,
                hp: classType.hp,
                maxHp: classType.hp,
                attack: classType.attack,
                defense: classType.defense,
                color: classType.color,
                x: 0,
                y: Math.floor(this.grid.size / 2),
                visible: true,
                alive: true
            };
            party.push(adventurer);
        }
        
        this.adventurers = party;
        this.startAdventurerMovement();
    }

    startAdventurerMovement() {
        if (this.adventurers.length === 0) return;
        
        let currentX = 0;
        const moveInterval = setInterval(() => {
            if (currentX >= this.grid.size - 1 || this.adventurers.filter(a => a.alive).length === 0) {
                clearInterval(moveInterval);
                this.endAdventurerPhase();
                return;
            }
            
            currentX++;
            this.adventurers.forEach(adventurer => {
                if (adventurer.alive) {
                    adventurer.x = currentX;
                }
            });
            
            // Check for combat
            const currentCell = this.grid.cells[Math.floor(this.grid.size / 2)][currentX];
            if (currentCell.monsters.length > 0 && currentCell.monsters.some(m => m.alive)) {
                clearInterval(moveInterval);
                this.startCombat(currentCell);
            }
            
            this.renderGrid();
        }, 1000 / this.gameState.gameSpeed);
    }

    startCombat(cell) {
        const aliveAdventurers = this.adventurers.filter(a => a.alive);
        const aliveMonsters = cell.monsters.filter(m => m.alive);
        
        this.addLogEntry(`Combat begins! ${aliveAdventurers.length} adventurers vs ${aliveMonsters.length} monsters`, 'combat');
        
        const combatInterval = setInterval(() => {
            // Adventurers attack
            aliveAdventurers.forEach(adventurer => {
                if (adventurer.alive && aliveMonsters.length > 0) {
                    const target = aliveMonsters[Math.floor(Math.random() * aliveMonsters.length)];
                    const damage = Math.max(1, adventurer.attack - target.defense);
                    target.hp -= damage;
                    
                    if (target.hp <= 0) {
                        target.alive = false;
                        this.addLogEntry(`${adventurer.name} killed a ${this.gameData.monsterTypes[target.type].name}!`, 'combat');
                    }
                }
            });
            
            // Update alive monsters list
            const stillAliveMonsters = cell.monsters.filter(m => m.alive);
            
            // Monsters attack back
            stillAliveMonsters.forEach(monster => {
                if (aliveAdventurers.length > 0) {
                    const target = aliveAdventurers[Math.floor(Math.random() * aliveAdventurers.length)];
                    const monsterType = this.gameData.monsterTypes[monster.type];
                    const damage = Math.max(1, monsterType.attack - target.defense);
                    target.hp -= damage;
                    
                    if (target.hp <= 0) {
                        target.alive = false;
                        this.addLogEntry(`${target.name} was slain by a ${monsterType.name}!`, 'combat');
                    }
                }
            });
            
            // Check combat end conditions
            const currentlyAliveAdventurers = this.adventurers.filter(a => a.alive);
            const currentlyAliveMonsters = cell.monsters.filter(m => m.alive);
            
            if (currentlyAliveMonsters.length === 0) {
                clearInterval(combatInterval);
                this.addLogEntry('Adventurers won the battle!', 'combat');
                this.rewardAdventurers();
                this.continueAdventurerMovement();
            } else if (currentlyAliveAdventurers.length === 0) {
                clearInterval(combatInterval);
                this.addLogEntry('All adventurers were defeated!', 'combat');
                this.rewardFromDeaths();
                this.endAdventurerPhase();
            } else if (currentlyAliveAdventurers.length <= 1 && Math.random() < 0.3) {
                clearInterval(combatInterval);
                this.addLogEntry('Remaining adventurers retreat!', 'combat');
                this.endAdventurerPhase();
            }
            
            this.renderGrid();
        }, 1500 / this.gameState.gameSpeed);
    }

    continueAdventurerMovement() {
        setTimeout(() => {
            this.startAdventurerMovement();
        }, 1000 / this.gameState.gameSpeed);
    }

    rewardAdventurers() {
        const goldReward = Math.floor(Math.random() * 10) + 5;
        this.gameState.gold += goldReward;
        this.addLogEntry(`Found ${goldReward} gold!`, 'reward');
        this.updateResourceDisplay();
    }

    rewardFromDeaths() {
        const aliveAdventurers = this.adventurers.filter(a => a.alive);
        const deadAdventurers = this.adventurers.filter(a => !a.alive);
        
        const goldReward = deadAdventurers.length * 15;
        const soulReward = deadAdventurers.length;
        
        this.gameState.gold += goldReward;
        this.gameState.souls += soulReward;
        
        this.addLogEntry(`Gained ${goldReward} gold and ${soulReward} souls from defeated adventurers!`, 'reward');
        this.updateResourceDisplay();
    }

    endAdventurerPhase() {
        this.adventurers = [];
        this.addLogEntry('Adventurer phase ended.', 'system');
        this.renderGrid();
    }

    toggleGameSpeed() {
        const speedButton = document.getElementById('speed-toggle');
        this.gameState.gameSpeed = this.gameState.gameSpeed === 1 ? 2 : this.gameState.gameSpeed === 2 ? 4 : 1;
        speedButton.textContent = `${this.gameState.gameSpeed}x Speed`;
    }

    updateResourceDisplay() {
        document.getElementById('current-mana').textContent = Math.floor(this.gameState.mana);
        document.getElementById('max-mana').textContent = this.gameState.maxMana;
        document.getElementById('mana-regen').textContent = this.gameState.manaRegen;
        document.getElementById('current-gold').textContent = this.gameState.gold;
        document.getElementById('current-souls').textContent = this.gameState.souls;
        document.getElementById('day-count').textContent = this.gameState.day;
        
        // Update time display
        const hours = Math.floor(this.gameState.gameTime / 3600) + 6;
        const minutes = Math.floor((this.gameState.gameTime % 3600) / 60);
        const timeString = `${hours % 24}:${minutes.toString().padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`;
        document.getElementById('time-display').textContent = timeString;
        
        // Update dungeon status
        const statusElement = document.getElementById('dungeon-status');
        if (this.gameState.dungeonOpen) {
            statusElement.textContent = 'Open';
            statusElement.className = 'status-indicator';
        } else {
            statusElement.textContent = 'Closed';
            statusElement.className = 'status-indicator closed';
        }
    }

    addLogEntry(message, type = 'system') {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = message;
        
        const gameLog = document.getElementById('game-log');
        gameLog.appendChild(logEntry);
        gameLog.scrollTop = gameLog.scrollHeight;
        
        // Keep only last 20 entries
        while (gameLog.children.length > 20) {
            gameLog.removeChild(gameLog.firstChild);
        }
    }

    showWelcomeModal() {
        document.getElementById('game-modal').classList.remove('hidden');
    }

    hideModal() {
        document.getElementById('game-modal').classList.add('hidden');
    }

    startGameLoop() {
        setInterval(() => {
            // Mana regeneration
            if (this.gameState.mana < this.gameState.maxMana) {
                this.gameState.mana = Math.min(this.gameState.maxMana, this.gameState.mana + this.gameState.manaRegen / 10);
            }
            
            // Time progression
            this.gameState.gameTime += this.gameState.gameSpeed;
            
            // Day/night cycle (simplified)
            const dayLength = 18 * 3600; // 18 hours day
            const nightLength = 6 * 3600; // 6 hours night
            const totalDayLength = dayLength + nightLength;
            
            if (this.gameState.gameTime >= totalDayLength) {
                this.gameState.gameTime = 0;
                this.gameState.day++;
                this.addLogEntry(`Day ${this.gameState.day} begins!`, 'system');
            }
            
            this.gameState.isDayTime = this.gameState.gameTime < dayLength;
            this.gameState.dungeonOpen = this.gameState.isDayTime;
            
            this.updateResourceDisplay();
        }, 100);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new DungeonCoreGame();
});