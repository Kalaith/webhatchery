// Game Data (from provided JSON)
const GAME_DATA = {
    nodeTypes: {
        "city": {
            "name": "City",
            "color": "#4CAF50",
            "icon": "🏰",
            "goldGeneration": 100,
            "suppliesGeneration": 50,
            "manaGeneration": 0,
            "defensiveBonus": 1.0,
            "description": "Generates gold and supplies, enables troop recruitment"
        },
        "resource": {
            "name": "Resource Node",
            "color": "#FF9800",
            "icon": "⛏️",
            "goldGeneration": 50,
            "suppliesGeneration": 100,
            "manaGeneration": 25,
            "defensiveBonus": 0.8,
            "description": "Provides valuable resources for your empire"
        },
        "fortress": {
            "name": "Fortress",
            "color": "#9E9E9E",
            "icon": "🛡️",
            "goldGeneration": 25,
            "suppliesGeneration": 25,
            "manaGeneration": 0,
            "defensiveBonus": 2.0,
            "description": "Defensive stronghold with high garrison value"
        },
        "shrine": {
            "name": "Shrine",
            "color": "#9C27B0",
            "icon": "✨",
            "goldGeneration": 0,
            "suppliesGeneration": 0,
            "manaGeneration": 100,
            "defensiveBonus": 1.2,
            "description": "Ancient site that provides magical power"
        },
        "stronghold": {
            "name": "Enemy Stronghold",
            "color": "#F44336",
            "icon": "💀",
            "goldGeneration": 150,
            "suppliesGeneration": 75,
            "manaGeneration": 50,
            "defensiveBonus": 2.5,
            "description": "Heavily fortified enemy position"
        }
    },
    commanderClasses: {
        "knight": {
            "name": "Knight",
            "icon": "⚔️",
            "description": "Heavily armored tank unit with high defense",
            "baseHealth": 120,
            "baseAttack": 80,
            "baseDefense": 100,
            "specialAbility": "Shield Wall - Increases army defense by 50%",
            "cost": 200
        },
        "mage": {
            "name": "Mage",
            "icon": "🔮",
            "description": "Magical supporter with area-of-effect abilities",
            "baseHealth": 80,
            "baseAttack": 120,
            "baseDefense": 60,
            "specialAbility": "Fireball - Deals AOE damage to enemy army",
            "cost": 250
        },
        "ranger": {
            "name": "Ranger",
            "icon": "🏹",
            "description": "Scout and skirmisher with mobility bonuses",
            "baseHealth": 100,
            "baseAttack": 100,
            "baseDefense": 80,
            "specialAbility": "Stealth - Can scout enemy nodes without detection",
            "cost": 180
        },
        "warlord": {
            "name": "Warlord",
            "icon": "👑",
            "description": "Leader that provides army-wide bonuses",
            "baseHealth": 110,
            "baseAttack": 90,
            "baseDefense": 90,
            "specialAbility": "Rally - Increases entire army combat effectiveness",
            "cost": 300
        }
    },
    races: {
        "human": {
            "name": "Human",
            "icon": "👤",
            "bonus": "Versatile - 10% bonus to all resources",
            "color": "#2196F3"
        },
        "elf": {
            "name": "Elf",
            "icon": "🧝",
            "bonus": "Magical Affinity - 20% bonus to mana generation",
            "color": "#4CAF50"
        },
        "orc": {
            "name": "Orc",
            "icon": "👹",
            "bonus": "Brutal Strength - 15% bonus to combat damage",
            "color": "#FF5722"
        },
        "undead": {
            "name": "Undead",
            "icon": "💀",
            "bonus": "Undying - Commanders revive with 50% health after defeat",
            "color": "#9C27B0"
        }
    },
    troopTypes: {
        "soldiers": {
            "name": "Soldiers",
            "icon": "🛡️",
            "attack": 10,
            "defense": 10,
            "cost": 20,
            "strongAgainst": ["cavalry"],
            "weakAgainst": ["archers"],
            "description": "Balanced infantry units"
        },
        "archers": {
            "name": "Archers",
            "icon": "🏹",
            "attack": 12,
            "defense": 6,
            "cost": 25,
            "strongAgainst": ["soldiers"],
            "weakAgainst": ["cavalry"],
            "description": "Ranged units effective against infantry"
        },
        "cavalry": {
            "name": "Cavalry",
            "icon": "🐎",
            "attack": 15,
            "defense": 8,
            "cost": 40,
            "strongAgainst": ["archers"],
            "weakAgainst": ["soldiers"],
            "description": "Fast mounted units"
        },
        "mages": {
            "name": "Mages",
            "icon": "🔥",
            "attack": 20,
            "defense": 4,
            "cost": 60,
            "strongAgainst": [],
            "weakAgainst": [],
            "description": "Magical support units that disrupt enemy formations"
        }
    }
};

// Game State
class GameState {
    constructor() {
        this.turn = 1;
        this.phase = 'player'; // 'player', 'enemy', 'upkeep'
        this.resources = {
            gold: 500,
            supplies: 300,
            mana: 100
        };
        this.commanders = [];
        this.nodes = [];
        this.selectedNode = null;
        this.selectedCommander = null;
        this.gameOver = false;
        this.winner = null;
        
        this.initializeNodes();
    }
    
    initializeNodes() {
        // Create a diverse set of nodes for the game map
        const nodeConfigs = [
            { type: 'city', x: 150, y: 150, owner: 'player', starLevel: 2 },
            { type: 'resource', x: 300, y: 100, owner: 'neutral', starLevel: 1 },
            { type: 'fortress', x: 200, y: 250, owner: 'neutral', starLevel: 3 },
            { type: 'shrine', x: 100, y: 300, owner: 'neutral', starLevel: 2 },
            { type: 'city', x: 450, y: 200, owner: 'neutral', starLevel: 2 },
            { type: 'resource', x: 350, y: 300, owner: 'neutral', starLevel: 1 },
            { type: 'stronghold', x: 600, y: 150, owner: 'enemy', starLevel: 4 },
            { type: 'fortress', x: 550, y: 300, owner: 'enemy', starLevel: 3 },
            { type: 'city', x: 650, y: 400, owner: 'enemy', starLevel: 2 },
            { type: 'resource', x: 400, y: 450, owner: 'neutral', starLevel: 1 },
            { type: 'shrine', x: 500, y: 500, owner: 'neutral', starLevel: 2 },
            { type: 'fortress', x: 250, y: 400, owner: 'neutral', starLevel: 3 }
        ];
        
        this.nodes = nodeConfigs.map((config, index) => ({
            id: index,
            ...config,
            garrison: this.calculateGarrison(config.type, config.starLevel, config.owner),
            connections: []
        }));
        
        // Create connections between nodes
        this.createNodeConnections();
    }
    
    calculateGarrison(type, starLevel, owner) {
        const baseGarrison = GAME_DATA.nodeTypes[type].defensiveBonus * 50;
        const starBonus = starLevel * 20;
        const ownerMultiplier = owner === 'enemy' ? 1.5 : owner === 'player' ? 0.8 : 1.0;
        return Math.floor((baseGarrison + starBonus) * ownerMultiplier);
    }
    
    createNodeConnections() {
        // Simple connection algorithm - connect nodes within a certain distance
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                if (distance < 200) { // Connection threshold
                    this.nodes[i].connections.push(j);
                    this.nodes[j].connections.push(i);
                }
            }
        }
    }
    
    getDistance(node1, node2) {
        return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
    }
    
    addCommander(className, race) {
        const commanderClass = GAME_DATA.commanderClasses[className];
        const commanderRace = GAME_DATA.races[race];
        
        if (this.resources.gold < commanderClass.cost) {
            return false;
        }
        
        this.resources.gold -= commanderClass.cost;
        
        const commander = {
            id: this.commanders.length,
            name: `${commanderRace.name} ${commanderClass.name}`,
            class: className,
            race: race,
            level: 1,
            experience: 0,
            health: commanderClass.baseHealth,
            maxHealth: commanderClass.baseHealth,
            attack: commanderClass.baseAttack,
            defense: commanderClass.baseDefense,
            assignedNode: null,
            army: {
                soldiers: 20,
                archers: 10,
                cavalry: 5,
                mages: 2
            }
        };
        
        this.commanders.push(commander);
        return true;
    }
    
    calculateIncome() {
        let income = { gold: 0, supplies: 0, mana: 0 };
        
        this.nodes.filter(node => node.owner === 'player').forEach(node => {
            const nodeType = GAME_DATA.nodeTypes[node.type];
            income.gold += nodeType.goldGeneration;
            income.supplies += nodeType.suppliesGeneration;
            income.mana += nodeType.manaGeneration;
        });
        
        // Apply racial bonuses
        this.commanders.forEach(commander => {
            const race = commander.race;
            if (race === 'human') {
                income.gold = Math.floor(income.gold * 1.1);
                income.supplies = Math.floor(income.supplies * 1.1);
                income.mana = Math.floor(income.mana * 1.1);
            } else if (race === 'elf') {
                income.mana = Math.floor(income.mana * 1.2);
            }
        });
        
        return income;
    }
    
    checkVictoryCondition() {
        const totalNodes = this.nodes.length;
        const playerNodes = this.nodes.filter(node => node.owner === 'player').length;
        const enemyNodes = this.nodes.filter(node => node.owner === 'enemy').length;
        
        const playerControlPercentage = playerNodes / totalNodes;
        const enemyControlPercentage = enemyNodes / totalNodes;
        
        if (playerControlPercentage >= 0.7) {
            this.gameOver = true;
            this.winner = 'player';
            return true;
        } else if (enemyControlPercentage >= 0.7) {
            this.gameOver = true;
            this.winner = 'enemy';
            return true;
        }
        
        return false;
    }
}

// Game Engine
class GameEngine {
    constructor() {
        this.state = new GameState();
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.selectedClass = null;
        this.selectedRace = null;
        
        this.setupEventListeners();
        this.updateUI();
        this.render();
        this.addBattleLog('🎮 Welcome to Conquest of Realms! Select nodes to view details or recruit commanders to begin.', 'info');
    }
    
    setupEventListeners() {
        // Canvas events
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // UI Events
        document.getElementById('recruitBtn').addEventListener('click', () => this.showRecruitModal());
        document.getElementById('endTurnBtn').addEventListener('click', () => this.endTurn());
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelpModal());
        
        // Modal events
        this.setupModalEvents();
        
        // Zoom controls
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoom(0.8));
    }
    
    setupModalEvents() {
        // Recruitment modal
        document.getElementById('closeRecruitModal').addEventListener('click', () => this.hideModal('recruitModal'));
        document.getElementById('cancelRecruitBtn').addEventListener('click', () => this.hideModal('recruitModal'));
        document.getElementById('confirmRecruitBtn').addEventListener('click', () => this.confirmRecruitment());
        
        // Help modal
        document.getElementById('closeHelpModal').addEventListener('click', () => this.hideModal('helpModal'));
        
        // Battle modal
        document.getElementById('closeBattleModal').addEventListener('click', () => this.hideModal('battleModal'));
        
        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.scale - this.offsetX;
        const y = (e.clientY - rect.top) / this.scale - this.offsetY;
        
        // Find clicked node
        const clickedNode = this.state.nodes.find(node => {
            const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
            return distance < 30;
        });
        
        if (clickedNode) {
            this.handleNodeClick(clickedNode);
        } else {
            // Clicked empty space - deselect
            this.state.selectedNode = null;
            this.updateInfoPanel();
            this.render();
        }
    }
    
    handleNodeClick(node) {
        if (this.state.phase !== 'player') return;
        
        if (!this.state.selectedNode) {
            // First click - select node
            this.state.selectedNode = node;
            this.updateInfoPanel();
            this.addBattleLog(`📍 Selected ${GAME_DATA.nodeTypes[node.type].name} (${node.owner})`, 'info');
        } else if (this.state.selectedNode.id === node.id) {
            // Same node clicked - deselect
            this.state.selectedNode = null;
            this.updateInfoPanel();
        } else if (this.state.selectedNode.owner === 'player' && 
                   this.state.selectedNode.connections.includes(node.id) &&
                   node.owner !== 'player') {
            // Attack action
            this.initiateAttack(this.state.selectedNode, node);
        } else {
            // Select different node
            this.state.selectedNode = node;
            this.updateInfoPanel();
            this.addBattleLog(`📍 Selected ${GAME_DATA.nodeTypes[node.type].name} (${node.owner})`, 'info');
        }
        
        this.render();
    }
    
    initiateAttack(attackerNode, defenderNode) {
        this.addBattleLog(`⚔️ Attacking ${GAME_DATA.nodeTypes[defenderNode.type].name}...`, 'info');
        
        const result = this.resolveBattle(attackerNode, defenderNode);
        this.showBattleResult(result);
        
        if (result.victory) {
            defenderNode.owner = 'player';
            defenderNode.garrison = Math.floor(defenderNode.garrison * 0.3); // Reduced garrison after capture
            this.addBattleLog(`🎉 Victory! Captured ${GAME_DATA.nodeTypes[defenderNode.type].name}`, 'victory');
        } else {
            this.addBattleLog(`💀 Defeat at ${GAME_DATA.nodeTypes[defenderNode.type].name}`, 'defeat');
        }
        
        this.state.selectedNode = null;
        this.updateUI();
        this.render();
        
        // Check victory condition
        if (this.state.checkVictoryCondition()) {
            this.endGame();
        }
    }
    
    resolveBattle(attackerNode, defenderNode) {
        // Calculate battle strength
        let attackerStrength = attackerNode.garrison;
        let defenderStrength = defenderNode.garrison * GAME_DATA.nodeTypes[defenderNode.type].defensiveBonus;
        
        // Add commander bonuses if assigned
        const assignedCommander = this.state.commanders.find(c => c.assignedNode === attackerNode.id);
        if (assignedCommander) {
            const commanderBonus = assignedCommander.attack + assignedCommander.defense;
            attackerStrength += commanderBonus;
            
            // Racial bonuses
            if (assignedCommander.race === 'orc') {
                attackerStrength *= 1.15; // Brutal strength
            }
        }
        
        // Add some randomness
        const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        attackerStrength *= randomFactor;
        
        const victory = attackerStrength > defenderStrength;
        const casualties = Math.floor(attackerNode.garrison * (victory ? 0.2 : 0.4));
        
        attackerNode.garrison = Math.max(10, attackerNode.garrison - casualties);
        
        return {
            victory,
            attackerStrength: Math.floor(attackerStrength),
            defenderStrength: Math.floor(defenderStrength),
            casualties
        };
    }
    
    showBattleResult(result) {
        const modal = document.getElementById('battleModal');
        const resultDiv = document.getElementById('battleResult');
        
        resultDiv.innerHTML = `
            <div class="battle-summary">
                <h3>${result.victory ? '🎉 Victory!' : '💀 Defeat'}</h3>
                <div class="battle-stats">
                    <div class="stat-item">
                        <strong>Attacker Strength:</strong> ${result.attackerStrength}
                    </div>
                    <div class="stat-item">
                        <strong>Defender Strength:</strong> ${result.defenderStrength}
                    </div>
                    <div class="stat-item">
                        <strong>Casualties:</strong> ${result.casualties}
                    </div>
                </div>
            </div>
        `;
        
        this.showModal('battleModal');
    }
    
    endTurn() {
        if (this.state.phase !== 'player') return;
        
        this.state.phase = 'enemy';
        this.updateUI();
        this.addBattleLog('🔄 Enemy turn begins...', 'info');
        
        // AI Turn
        setTimeout(() => {
            this.executeAITurn();
            this.state.phase = 'upkeep';
            this.updateUI();
            this.addBattleLog('💰 Upkeep phase - collecting resources...', 'info');
            
            setTimeout(() => {
                this.executeUpkeep();
                this.state.turn++;
                this.state.phase = 'player';
                this.updateUI();
                this.addBattleLog(`🆕 Turn ${this.state.turn} begins - Your move!`, 'info');
            }, 1000);
        }, 1500);
    }
    
    executeAITurn() {
        // Simple AI: attack adjacent player nodes
        const enemyNodes = this.state.nodes.filter(node => node.owner === 'enemy');
        let aiActed = false;
        
        enemyNodes.forEach(enemyNode => {
            const targetConnections = enemyNode.connections
                .map(id => this.state.nodes[id])
                .filter(node => node.owner === 'player');
            
            if (targetConnections.length > 0 && Math.random() > 0.7) {
                const target = targetConnections[Math.floor(Math.random() * targetConnections.length)];
                const result = this.resolveBattle(enemyNode, target);
                
                if (result.victory) {
                    target.owner = 'enemy';
                    target.garrison = Math.floor(target.garrison * 0.3);
                    this.addBattleLog(`💀 Enemy captured ${GAME_DATA.nodeTypes[target.type].name}!`, 'defeat');
                    aiActed = true;
                }
            }
        });
        
        if (!aiActed) {
            this.addBattleLog('🛡️ Enemy forces hold their positions', 'info');
        }
    }
    
    executeUpkeep() {
        const income = this.state.calculateIncome();
        this.state.resources.gold += income.gold;
        this.state.resources.supplies += income.supplies;
        this.state.resources.mana += income.mana;
        
        this.addBattleLog(`💰 Income: +${income.gold} gold, +${income.supplies} supplies, +${income.mana} mana`, 'info');
        
        // Check victory condition
        if (this.state.checkVictoryCondition()) {
            this.endGame();
        }
    }
    
    showRecruitModal() {
        this.populateRecruitmentOptions();
        this.showModal('recruitModal');
    }
    
    populateRecruitmentOptions() {
        const classSelection = document.getElementById('classSelection');
        const raceSelection = document.getElementById('raceSelection');
        
        // Reset selections
        this.selectedClass = null;
        this.selectedRace = null;
        
        // Populate classes
        classSelection.innerHTML = '';
        Object.entries(GAME_DATA.commanderClasses).forEach(([key, commanderClass]) => {
            const option = document.createElement('div');
            option.className = 'selection-option';
            option.dataset.class = key;
            option.innerHTML = `
                <div class="option-icon">${commanderClass.icon}</div>
                <div class="option-name">${commanderClass.name}</div>
                <div class="option-description">${commanderClass.description}</div>
                <div class="option-cost">Cost: ${commanderClass.cost} gold</div>
            `;
            option.addEventListener('click', () => this.selectClass(key, option));
            classSelection.appendChild(option);
        });
        
        // Populate races
        raceSelection.innerHTML = '';
        Object.entries(GAME_DATA.races).forEach(([key, race]) => {
            const option = document.createElement('div');
            option.className = 'selection-option';
            option.dataset.race = key;
            option.innerHTML = `
                <div class="option-icon">${race.icon}</div>
                <div class="option-name">${race.name}</div>
                <div class="option-description">${race.bonus}</div>
            `;
            option.addEventListener('click', () => this.selectRace(key, option));
            raceSelection.appendChild(option);
        });
        
        // Reset summary
        this.updateRecruitmentSummary();
    }
    
    selectClass(className, element) {
        document.querySelectorAll('#classSelection .selection-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        this.selectedClass = className;
        this.updateRecruitmentSummary();
    }
    
    selectRace(raceName, element) {
        document.querySelectorAll('#raceSelection .selection-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        this.selectedRace = raceName;
        this.updateRecruitmentSummary();
    }
    
    updateRecruitmentSummary() {
        const summary = document.getElementById('recruitmentSummary');
        const confirmBtn = document.getElementById('confirmRecruitBtn');
        const costSpan = document.getElementById('recruitCost');
        
        if (this.selectedClass && this.selectedRace) {
            const commanderClass = GAME_DATA.commanderClasses[this.selectedClass];
            const race = GAME_DATA.races[this.selectedRace];
            
            summary.innerHTML = `
                <h4>${race.icon} ${race.name} ${commanderClass.icon} ${commanderClass.name}</h4>
                <p><strong>Special Ability:</strong> ${commanderClass.specialAbility}</p>
                <p><strong>Racial Bonus:</strong> ${race.bonus}</p>
                <div class="summary-stats">
                    <div class="summary-stat">
                        <div class="summary-stat-value">${commanderClass.baseHealth}</div>
                        <div class="summary-stat-label">Health</div>
                    </div>
                    <div class="summary-stat">
                        <div class="summary-stat-value">${commanderClass.baseAttack}</div>
                        <div class="summary-stat-label">Attack</div>
                    </div>
                    <div class="summary-stat">
                        <div class="summary-stat-value">${commanderClass.baseDefense}</div>
                        <div class="summary-stat-label">Defense</div>
                    </div>
                </div>
            `;
            
            costSpan.textContent = commanderClass.cost;
            confirmBtn.disabled = this.state.resources.gold < commanderClass.cost;
        } else {
            summary.innerHTML = '<p>Select a class and race to see details</p>';
            confirmBtn.disabled = true;
            costSpan.textContent = '-';
        }
    }
    
    confirmRecruitment() {
        if (this.selectedClass && this.selectedRace) {
            const success = this.state.addCommander(this.selectedClass, this.selectedRace);
            if (success) {
                this.addBattleLog(`⚔️ Recruited ${GAME_DATA.races[this.selectedRace].name} ${GAME_DATA.commanderClasses[this.selectedClass].name}`, 'info');
                this.updateUI();
                this.hideModal('recruitModal');
            } else {
                this.addBattleLog(`❌ Not enough gold to recruit commander`, 'defeat');
            }
        }
    }
    
    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }
    
    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        if (modalId === 'recruitModal') {
            this.selectedClass = null;
            this.selectedRace = null;
        }
    }
    
    showHelpModal() {
        this.showModal('helpModal');
    }
    
    zoom(factor) {
        this.scale *= factor;
        this.scale = Math.max(0.5, Math.min(2, this.scale));
        this.render();
    }
    
    updateUI() {
        // Update resources
        document.getElementById('goldAmount').textContent = this.state.resources.gold;
        document.getElementById('suppliesAmount').textContent = this.state.resources.supplies;
        document.getElementById('manaAmount').textContent = this.state.resources.mana;
        
        // Update turn info
        document.getElementById('turnNumber').textContent = this.state.turn;
        document.getElementById('currentPhase').textContent = 
            this.state.phase.charAt(0).toUpperCase() + this.state.phase.slice(1);
        
        // Update commanders list
        this.updateCommandersList();
        
        // Update info panel
        this.updateInfoPanel();
    }
    
    updateCommandersList() {
        const list = document.getElementById('commandersList');
        
        if (this.state.commanders.length === 0) {
            list.innerHTML = '<p class="text-secondary">No commanders recruited</p>';
            return;
        }
        
        list.innerHTML = this.state.commanders.map(commander => `
            <div class="commander-item" data-commander-id="${commander.id}">
                <div class="commander-icon">${GAME_DATA.races[commander.race].icon}${GAME_DATA.commanderClasses[commander.class].icon}</div>
                <div class="commander-info">
                    <div class="commander-name">${commander.name}</div>
                    <div class="commander-details">Level ${commander.level} • Health: ${commander.health}/${commander.maxHealth}</div>
                </div>
            </div>
        `).join('');
    }
    
    updateInfoPanel() {
        const infoDiv = document.getElementById('selectionInfo');
        
        if (!this.state.selectedNode) {
            infoDiv.innerHTML = '<p class="text-secondary">Select a node or commander for details</p>';
            return;
        }
        
        const node = this.state.selectedNode;
        const nodeType = GAME_DATA.nodeTypes[node.type];
        
        infoDiv.innerHTML = `
            <div class="node-info">
                <div class="node-header">
                    <div class="node-icon">${nodeType.icon}</div>
                    <div class="node-name">${nodeType.name}</div>
                </div>
                <p class="node-description">${nodeType.description}</p>
                <div class="owner-indicator owner-${node.owner}">
                    ${node.owner.toUpperCase()}
                </div>
                <div class="node-stats">
                    <div class="stat-item">
                        <span>💰 Gold: ${nodeType.goldGeneration}</span>
                    </div>
                    <div class="stat-item">
                        <span>📦 Supplies: ${nodeType.suppliesGeneration}</span>
                    </div>
                    <div class="stat-item">
                        <span>✨ Mana: ${nodeType.manaGeneration}</span>
                    </div>
                    <div class="stat-item">
                        <span>🛡️ Garrison: ${node.garrison}</span>
                    </div>
                    <div class="stat-item">
                        <span>⭐ Star Level: ${node.starLevel}</span>
                    </div>
                </div>
                ${this.getNodeActions(node)}
            </div>
        `;
    }
    
    getNodeActions(node) {
        if (this.state.phase !== 'player') return '';
        
        let actions = '';
        
        if (node.owner === 'player') {
            actions += '<div class="action-buttons">';
            if (node.type === 'city') {
                actions += '<button class="btn btn--sm btn--recruit-troops" onclick="game.addBattleLog(\'🏗️ Troop recruitment coming in future updates!\', \'info\')">Recruit Troops</button>';
            }
            actions += '</div>';
        } else if (this.state.selectedNode && 
                   this.state.selectedNode.owner === 'player' && 
                   this.state.selectedNode.connections.includes(node.id)) {
            actions += '<div class="action-buttons">';
            actions += '<p class="text-secondary">🎯 Click this node again to attack!</p>';
            actions += '</div>';
        }
        
        return actions;
    }
    
    addBattleLog(message, type = 'info') {
        const logDiv = document.getElementById('battleLog');
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = message;
        logDiv.appendChild(entry);
        logDiv.scrollTop = logDiv.scrollHeight;
        
        // Keep only last 20 entries
        while (logDiv.children.length > 20) {
            logDiv.removeChild(logDiv.firstChild);
        }
    }
    
    endGame() {
        const message = this.state.winner === 'player' ? 
            '🎉 Congratulations! You have achieved victory!' : 
            '💀 Defeat! The enemy has conquered the realm.';
        
        this.addBattleLog(message, this.state.winner === 'player' ? 'victory' : 'defeat');
        
        setTimeout(() => {
            alert(message + '\n\nGame Over');
        }, 1000);
    }
    
    render() {
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(this.offsetX, this.offsetY);
        
        // Clear canvas
        this.ctx.clearRect(-this.offsetX, -this.offsetY, this.canvas.width / this.scale, this.canvas.height / this.scale);
        
        // Draw connections
        this.drawConnections();
        
        // Draw nodes
        this.drawNodes();
        
        this.ctx.restore();
    }
    
    drawConnections() {
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        
        this.state.nodes.forEach(node => {
            node.connections.forEach(connectionId => {
                if (connectionId > node.id) { // Avoid drawing connections twice
                    const connectedNode = this.state.nodes[connectionId];
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(connectedNode.x, connectedNode.y);
                    this.ctx.stroke();
                }
            });
        });
    }
    
    drawNodes() {
        this.state.nodes.forEach(node => {
            const nodeType = GAME_DATA.nodeTypes[node.type];
            
            // Node background
            this.ctx.fillStyle = this.getNodeColor(node);
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Selection highlight
            if (this.state.selectedNode && this.state.selectedNode.id === node.id) {
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 4;
                this.ctx.stroke();
            }
            
            // Node border
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Node icon
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(nodeType.icon, node.x, node.y);
            
            // Star level indicators
            for (let i = 0; i < node.starLevel; i++) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.font = '12px Arial';
                this.ctx.fillText('⭐', node.x - 20 + (i * 8), node.y - 35);
            }
            
            // Garrison indicator
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(node.garrison, node.x, node.y + 40);
        });
    }
    
    getNodeColor(node) {
        if (node.owner === 'player') {
            return '#4CAF50'; // Green for player
        } else if (node.owner === 'enemy') {
            return '#F44336'; // Red for enemy
        } else {
            return '#9E9E9E'; // Gray for neutral
        }
    }
}

// Global game instance
let game;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    game = new GameEngine();
});