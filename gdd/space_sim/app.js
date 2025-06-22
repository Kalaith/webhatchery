// Game State Management
class GameState {
    constructor() {
        this.gameData = {
            "startingResources": {
                "power": 100,
                "oxygen": 80,
                "food": 10,
                "water": 10,
                "materials": 5,
                "rareElements": 0
            },
            "colonists": [
                {
                    "id": 1,
                    "name": "Dr. Sarah Chen",
                    "type": "Scientist",
                    "health": 100,
                    "hunger": 85,
                    "rest": 90,
                    "morale": 75,
                    "explorationSkill": 7,
                    "status": "idle",
                    "discoveries": 0,
                    "explorationEndTime": null,
                    "explorationArea": null
                },
                {
                    "id": 2,
                    "name": "Engineer Rodriguez",
                    "type": "Engineer", 
                    "health": 100,
                    "hunger": 80,
                    "rest": 85,
                    "morale": 80,
                    "explorationSkill": 6,
                    "status": "idle",
                    "discoveries": 0,
                    "explorationEndTime": null,
                    "explorationArea": null
                },
                {
                    "id": 3,
                    "name": "Scout Williams",
                    "type": "Explorer",
                    "health": 100,
                    "hunger": 90,
                    "rest": 95,
                    "morale": 85,
                    "explorationSkill": 9,
                    "status": "idle",
                    "discoveries": 0,
                    "explorationEndTime": null,
                    "explorationArea": null
                }
            ],
            "techTree": {
                "survival": {
                    "foodProduction": {"unlocked": false, "cost": {"materials": 5}, "discoveries": ["organic_samples"]},
                    "waterPurification": {"unlocked": false, "cost": {"materials": 3}, "discoveries": ["water_source"]},
                    "shelterConstruction": {"unlocked": false, "cost": {"materials": 8}, "discoveries": ["building_materials"]}
                },
                "energy": {
                    "solarPanels": {"unlocked": false, "cost": {"materials": 10}, "discoveries": ["solar_crystals"]},
                    "geothermal": {"unlocked": false, "cost": {"materials": 15, "rareElements": 2}, "discoveries": ["geothermal_vents"]},
                    "powerStorage": {"unlocked": false, "cost": {"materials": 7}, "discoveries": ["energy_crystals"]}
                },
                "construction": {
                    "robotics": {"unlocked": false, "cost": {"materials": 20, "rareElements": 5}, "discoveries": ["metal_alloys", "circuit_components"]},
                    "manufacturing": {"unlocked": false, "cost": {"materials": 25}, "discoveries": ["manufacturing_site"]},
                    "advancedMaterials": {"unlocked": false, "cost": {"rareElements": 10}, "discoveries": ["rare_minerals"]}
                }
            },
            "explorationAreas": [
                {
                    "id": "nearbycrater",
                    "name": "Nearby Crater",
                    "difficulty": 1,
                    "timeRequired": 30,
                    "unlocked": true,
                    "possibleDiscoveries": ["water_source", "basic_materials", "organic_samples"]
                },
                {
                    "id": "crystalfields",
                    "name": "Crystal Fields",
                    "difficulty": 2,
                    "timeRequired": 60,
                    "unlocked": true,
                    "possibleDiscoveries": ["energy_crystals", "solar_crystals", "rare_minerals"]
                },
                {
                    "id": "ancientruins",
                    "name": "Ancient Ruins",
                    "difficulty": 3,
                    "timeRequired": 90,
                    "unlocked": false,
                    "possibleDiscoveries": ["circuit_components", "manufacturing_site", "alien_technology"]
                }
            ]
        };
        
        this.resources = {...this.gameData.startingResources};
        this.colonists = [...this.gameData.colonists];
        this.techTree = JSON.parse(JSON.stringify(this.gameData.techTree));
        this.explorationAreas = [...this.gameData.explorationAreas];
        this.discoveredItems = [];
        this.gameDay = 1;
        this.gameTime = 0;
        this.isPaused = false;
        this.gameSpeed = 1;
        this.selectedColonist = null;
        this.currentTechCategory = 'survival';
        this.eventLog = [];
        
        this.addLogEntry("System initialized. Life support online.");
        this.addLogEntry("3 colonists in cryostasis revived.");
        this.addLogEntry("Immediate surroundings scanned. Ready for exploration.");
    }
    
    addLogEntry(message) {
        this.eventLog.push({
            message: message,
            time: this.gameDay,
            timestamp: Date.now()
        });
        
        // Keep only last 20 entries
        if (this.eventLog.length > 20) {
            this.eventLog.shift();
        }
    }
    
    getColonistById(id) {
        return this.colonists.find(c => c.id === id);
    }
    
    getExplorationAreaById(id) {
        return this.explorationAreas.find(a => a.id === id);
    }
    
    canResearchTech(category, techName) {
        const tech = this.techTree[category][techName];
        if (tech.unlocked) return false;
        
        // Check if all required discoveries are made
        const hasRequiredDiscoveries = tech.discoveries.every(discovery => 
            this.discoveredItems.includes(discovery)
        );
        
        if (!hasRequiredDiscoveries) return false;
        
        // Check if we have enough resources
        for (const [resource, amount] of Object.entries(tech.cost)) {
            if (this.resources[resource] < amount) return false;
        }
        
        return true;
    }
    
    researchTech(category, techName) {
        const tech = this.techTree[category][techName];
        if (!this.canResearchTech(category, techName)) return false;
        
        // Consume resources
        for (const [resource, amount] of Object.entries(tech.cost)) {
            this.resources[resource] -= amount;
        }
        
        tech.unlocked = true;
        this.addLogEntry(`Research completed: ${techName}`);
        
        // Apply tech benefits
        this.applyTechBenefits(category, techName);
        
        return true;
    }
    
    applyTechBenefits(category, techName) {
        switch (techName) {
            case 'foodProduction':
                this.resources.food += 20;
                this.addLogEntry("Food production facility online. +20 Food");
                break;
            case 'waterPurification':
                this.resources.water += 15;
                this.addLogEntry("Water purification system active. +15 Water");
                break;
            case 'solarPanels':
                this.resources.power += 30;
                this.addLogEntry("Solar panels deployed. +30 Power");
                break;
            case 'powerStorage':
                this.resources.power += 50;
                this.addLogEntry("Power storage enhanced. +50 Power capacity");
                break;
        }
    }
}

// Game Manager
class GameManager {
    constructor() {
        this.state = new GameState();
        this.gameLoop = null;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showIntroScreen();
    }
    
    bindEvents() {
        // Intro screen
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });
        
        // Time controls
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.pauseGame();
        });
        
        document.getElementById('play-btn').addEventListener('click', () => {
            this.resumeGame();
        });
        
        document.getElementById('fast-forward-btn').addEventListener('click', () => {
            this.toggleFastForward();
        });
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Tech category switching
        document.querySelectorAll('.tech-category').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTechCategory(e.target.dataset.category);
            });
        });
        
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });
        
        // Modal background clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // Colonist actions
        document.getElementById('feed-colonist').addEventListener('click', () => {
            this.feedColonist();
        });
        
        document.getElementById('rest-colonist').addEventListener('click', () => {
            this.restColonist();
        });
        
        // Exploration and research
        document.getElementById('claim-discovery').addEventListener('click', () => {
            this.claimDiscovery();
        });
        
        document.getElementById('research-tech').addEventListener('click', () => {
            this.researchCurrentTech();
        });
    }
    
    showIntroScreen() {
        document.getElementById('intro-screen').classList.remove('hidden');
        document.getElementById('game-screen').classList.add('hidden');
    }
    
    startGame() {
        document.getElementById('intro-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        this.renderGame();
        this.startGameLoop();
    }
    
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            if (!this.state.isPaused) {
                this.updateGame();
            }
        }, 1000 / this.state.gameSpeed);
    }
    
    pauseGame() {
        this.state.isPaused = true;
        document.getElementById('pause-btn').classList.add('active');
        document.getElementById('play-btn').classList.remove('active');
    }
    
    resumeGame() {
        this.state.isPaused = false;
        document.getElementById('pause-btn').classList.remove('active');
        document.getElementById('play-btn').classList.add('active');
    }
    
    toggleFastForward() {
        this.state.gameSpeed = this.state.gameSpeed === 1 ? 3 : 1;
        document.getElementById('fast-forward-btn').classList.toggle('active');
        
        // Restart game loop with new speed
        clearInterval(this.gameLoop);
        this.startGameLoop();
    }
    
    updateGame() {
        this.state.gameTime += 1;
        
        // Update day counter
        if (this.state.gameTime % 120 === 0) { // 2 minutes = 1 day
            this.state.gameDay += 1;
            this.dailyUpdates();
        }
        
        // Update colonist needs
        this.updateColonistNeeds();
        
        // Check exploration completion
        this.checkExplorationCompletion();
        
        // Update resource consumption
        this.updateResourceConsumption();
        
        // Render updates
        this.renderGame();
    }
    
    dailyUpdates() {
        // Colonist need degradation
        this.state.colonists.forEach(colonist => {
            if (colonist.status === 'idle') {
                colonist.hunger = Math.max(0, colonist.hunger - 5);
                colonist.rest = Math.max(0, colonist.rest - 3);
                
                if (colonist.hunger < 30) {
                    colonist.morale = Math.max(0, colonist.morale - 10);
                    colonist.health = Math.max(0, colonist.health - 5);
                }
                
                if (colonist.rest < 30) {
                    colonist.morale = Math.max(0, colonist.morale - 5);
                }
            }
        });
        
        this.state.addLogEntry(`Day ${this.state.gameDay} begins`);
    }
    
    updateColonistNeeds() {
        // Gradual need degradation
        this.state.colonists.forEach(colonist => {
            if (colonist.status === 'exploring') {
                colonist.hunger = Math.max(0, colonist.hunger - 0.1);
                colonist.rest = Math.max(0, colonist.rest - 0.15);
            } else {
                colonist.hunger = Math.max(0, colonist.hunger - 0.05);
                colonist.rest = Math.max(0, colonist.rest - 0.03);
            }
            
            // Health effects
            if (colonist.hunger < 20 || colonist.rest < 20) {
                colonist.health = Math.max(0, colonist.health - 0.1);
                colonist.morale = Math.max(0, colonist.morale - 0.1);
            }
        });
    }
    
    updateResourceConsumption() {
        // Power consumption
        this.state.resources.power = Math.max(0, this.state.resources.power - 0.1);
        
        // Oxygen efficiency based on power
        const powerEfficiency = this.state.resources.power / 100;
        this.state.resources.oxygen = Math.min(100, Math.max(0, 
            this.state.resources.oxygen + (powerEfficiency * 0.2) - 0.1
        ));
        
        // Critical warnings
        if (this.state.resources.power < 20 && this.state.gameTime % 60 === 0) {
            this.showNotification('Warning: Power levels critical!', 'warning');
        }
        
        if (this.state.resources.oxygen < 50 && this.state.gameTime % 60 === 0) {
            this.showNotification('Warning: Oxygen levels low!', 'warning');
        }
    }
    
    checkExplorationCompletion() {
        this.state.colonists.forEach(colonist => {
            if (colonist.status === 'exploring' && colonist.explorationEndTime) {
                if (Date.now() >= colonist.explorationEndTime) {
                    this.completeExploration(colonist);
                }
            }
        });
    }
    
    completeExploration(colonist) {
        const area = this.state.getExplorationAreaById(colonist.explorationArea);
        if (!area) return;
        
        colonist.status = 'idle';
        colonist.explorationEndTime = null;
        
        // Generate discovery
        const possibleDiscoveries = area.possibleDiscoveries;
        const discoveryChance = Math.min(0.8, colonist.explorationSkill / 10);
        
        if (Math.random() < discoveryChance) {
            const discovery = possibleDiscoveries[Math.floor(Math.random() * possibleDiscoveries.length)];
            this.processDiscovery(colonist, discovery, area);
        } else {
            colonist.explorationArea = null;
            this.state.addLogEntry(`${colonist.name} returned from ${area.name} empty-handed`);
            this.showNotification(`${colonist.name} found nothing at ${area.name}`, 'info');
        }
        
        // Experience gain
        colonist.discoveries += 1;
        if (colonist.explorationSkill < 10) {
            colonist.explorationSkill += 0.1;
        }
        
        // Fatigue from exploration
        colonist.rest = Math.max(0, colonist.rest - 20);
        colonist.hunger = Math.max(0, colonist.hunger - 15);
    }
    
    processDiscovery(colonist, discoveryType, area) {
        const discoveries = {
            'water_source': { name: 'Water Source', description: 'A clean water source', resources: { water: 5 } },
            'basic_materials': { name: 'Basic Materials', description: 'Useful construction materials', resources: { materials: 3 } },
            'organic_samples': { name: 'Organic Samples', description: 'Biological specimens for food production', resources: { food: 2 } },
            'energy_crystals': { name: 'Energy Crystals', description: 'Crystals that store energy', resources: { power: 10 } },
            'solar_crystals': { name: 'Solar Crystals', description: 'Crystals that absorb solar energy', resources: { power: 15 } },
            'rare_minerals': { name: 'Rare Minerals', description: 'Valuable rare elements', resources: { rareElements: 2 } },
            'circuit_components': { name: 'Circuit Components', description: 'Advanced electronic components', resources: { rareElements: 1 } },
            'manufacturing_site': { name: 'Manufacturing Site', description: 'An old manufacturing facility', resources: { materials: 10 } },
            'metal_alloys': { name: 'Metal Alloys', description: 'Strong metal compounds', resources: { materials: 8 } },
            'geothermal_vents': { name: 'Geothermal Vents', description: 'Natural energy source', resources: { power: 20 } },
            'building_materials': { name: 'Building Materials', description: 'Materials for construction', resources: { materials: 6 } },
            'alien_technology': { name: 'Alien Technology', description: 'Unknown alien artifacts', resources: { rareElements: 5 } }
        };
        
        const discovery = discoveries[discoveryType];
        if (!discovery) return;
        
        colonist.explorationArea = null;
        
        // Add to discovered items for tech tree
        if (!this.state.discoveredItems.includes(discoveryType)) {
            this.state.discoveredItems.push(discoveryType);
        }
        
        // Show discovery modal
        this.showDiscoveryModal(colonist, discovery, area);
        
        this.state.addLogEntry(`${colonist.name} discovered ${discovery.name} at ${area.name}!`);
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Render appropriate content
        if (tabName === 'tech') {
            this.renderTechTree();
        } else if (tabName === 'explore') {
            this.renderExplorationAreas();
        }
    }
    
    switchTechCategory(category) {
        this.state.currentTechCategory = category;
        
        // Update category buttons
        document.querySelectorAll('.tech-category').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.renderTechTree();
    }
    
    renderGame() {
        this.renderResources();
        this.renderColonists();
        this.renderColonistSprites();
        this.renderEventLog();
        this.renderSystemStatus();
        this.renderGameDay();
    }
    
    renderResources() {
        document.getElementById('power-value').textContent = Math.floor(this.state.resources.power);
        document.getElementById('oxygen-value').textContent = Math.floor(this.state.resources.oxygen);
        document.getElementById('food-value').textContent = Math.floor(this.state.resources.food);
        document.getElementById('water-value').textContent = Math.floor(this.state.resources.water);
        document.getElementById('materials-value').textContent = Math.floor(this.state.resources.materials);
        document.getElementById('rare-elements-value').textContent = Math.floor(this.state.resources.rareElements);
    }
    
    renderSystemStatus() {
        const powerEfficiency = this.state.resources.power;
        const oxygenGeneration = this.state.resources.oxygen;
        
        document.getElementById('power-efficiency-bar').style.width = `${powerEfficiency}%`;
        document.getElementById('oxygen-generation-bar').style.width = `${oxygenGeneration}%`;
    }
    
    renderGameDay() {
        document.getElementById('game-day').textContent = `Day ${this.state.gameDay}`;
    }
    
    renderEventLog() {
        const eventLog = document.getElementById('event-log');
        eventLog.innerHTML = '';
        
        this.state.eventLog.slice(-10).forEach(entry => {
            const div = document.createElement('div');
            div.className = 'log-entry';
            div.textContent = entry.message;
            eventLog.appendChild(div);
        });
        
        eventLog.scrollTop = eventLog.scrollHeight;
    }
    
    renderColonists() {
        const colonistList = document.getElementById('colonist-list');
        colonistList.innerHTML = '';
        
        this.state.colonists.forEach(colonist => {
            const card = document.createElement('div');
            card.className = 'colonist-card';
            card.onclick = () => this.showColonistModal(colonist);
            
            card.innerHTML = `
                <div class="colonist-header">
                    <div>
                        <div class="colonist-name">${colonist.name}</div>
                        <div class="colonist-type">${colonist.type}</div>
                    </div>
                    <div class="colonist-status status ${colonist.status}">${colonist.status}</div>
                </div>
                <div class="colonist-stats">
                    <div class="stat-mini">
                        <span>Health:</span>
                        <span>${Math.floor(colonist.health)}%</span>
                    </div>
                    <div class="stat-mini">
                        <span>Hunger:</span>
                        <span>${Math.floor(colonist.hunger)}%</span>
                    </div>
                    <div class="stat-mini">
                        <span>Rest:</span>
                        <span>${Math.floor(colonist.rest)}%</span>
                    </div>
                    <div class="stat-mini">
                        <span>Morale:</span>
                        <span>${Math.floor(colonist.morale)}%</span>
                    </div>
                </div>
            `;
            
            colonistList.appendChild(card);
        });
    }
    
    renderColonistSprites() {
        const container = document.getElementById('colonists-container');
        container.innerHTML = '';
        
        this.state.colonists.forEach((colonist, index) => {
            const sprite = document.createElement('div');
            sprite.className = `colonist-sprite ${colonist.status}`;
            sprite.onclick = () => this.showColonistModal(colonist);
            
            // Position colonists around the life support module
            const angle = (index * 120) * (Math.PI / 180);
            const radius = 100;
            const centerX = 50;
            const centerY = 50;
            const x = centerX + Math.cos(angle) * radius / 2;
            const y = centerY + Math.sin(angle) * radius / 2;
            
            sprite.style.left = `${x}%`;
            sprite.style.top = `${y}%`;
            sprite.style.transform = 'translate(-50%, -50%)';
            
            // Emoji based on colonist type
            const emojis = {
                'Scientist': '🔬',
                'Engineer': '🔧',
                'Explorer': '🧭'
            };
            sprite.textContent = emojis[colonist.type] || '👤';
            
            container.appendChild(sprite);
        });
    }
    
    renderTechTree() {
        const techTree = document.getElementById('tech-tree');
        techTree.innerHTML = '';
        
        const category = this.state.currentTechCategory;
        const techs = this.state.techTree[category];
        
        Object.entries(techs).forEach(([techName, tech]) => {
            const canResearch = this.state.canResearchTech(category, techName);
            const hasRequiredDiscoveries = tech.discoveries.every(discovery => 
                this.state.discoveredItems.includes(discovery)
            );
            
            const item = document.createElement('div');
            item.className = `tech-item ${tech.unlocked ? 'unlocked' : ''} ${!hasRequiredDiscoveries ? 'disabled' : ''}`;
            
            if (canResearch) {
                item.onclick = () => this.showTechModal(category, techName, tech);
            }
            
            const costItems = Object.entries(tech.cost).map(([resource, amount]) => 
                `<div class="cost-item">
                    <span>${this.getResourceIcon(resource)}</span>
                    <span>${amount}</span>
                </div>`
            ).join('');
            
            item.innerHTML = `
                <div class="tech-name">${this.formatTechName(techName)}</div>
                <div class="tech-cost">${costItems}</div>
                ${!hasRequiredDiscoveries ? '<div style="font-size: 11px; color: var(--color-text-secondary);">Missing discoveries</div>' : ''}
            `;
            
            techTree.appendChild(item);
        });
    }
    
    renderExplorationAreas() {
        const container = document.getElementById('exploration-areas');
        container.innerHTML = '';
        
        this.state.explorationAreas.forEach(area => {
            const div = document.createElement('div');
            div.className = `exploration-area ${!area.unlocked ? 'locked' : ''}`;
            
            const availableColonists = this.state.colonists.filter(c => c.status === 'idle');
            const selectOptions = availableColonists.map(c => 
                `<option value="${c.id}">${c.name} (Skill: ${Math.floor(c.explorationSkill)})</option>`
            ).join('');
            
            div.innerHTML = `
                <div class="area-header">
                    <div class="area-name">${area.name}</div>
                    <div class="area-difficulty">Level ${area.difficulty}</div>
                </div>
                <div class="area-info">
                    Time required: ${area.timeRequired}s | 
                    Possible discoveries: ${area.possibleDiscoveries.length}
                </div>
                ${area.unlocked ? `
                    <div class="assign-colonist">
                        <select class="colonist-select form-control" ${availableColonists.length === 0 ? 'disabled' : ''}>
                            <option value="">Select Colonist</option>
                            ${selectOptions}
                        </select>
                        <button class="explore-btn btn btn--primary btn--sm" 
                                onclick="game.sendOnExploration('${area.id}', this.parentNode.querySelector('select').value)"
                                ${availableColonists.length === 0 ? 'disabled' : ''}>
                            Explore
                        </button>
                    </div>
                ` : '<div style="opacity: 0.5;">Area locked</div>'}
            `;
            
            container.appendChild(div);
        });
    }
    
    sendOnExploration(areaId, colonistId) {
        if (!colonistId) {
            this.showNotification('Please select a colonist', 'error');
            return;
        }
        
        const colonist = this.state.getColonistById(parseInt(colonistId));
        const area = this.state.getExplorationAreaById(areaId);
        
        if (!colonist || !area) return;
        
        if (colonist.status !== 'idle') {
            this.showNotification('Colonist is not available', 'error');
            return;
        }
        
        // Check if colonist is healthy enough
        if (colonist.health < 30) {
            this.showNotification('Colonist is too weak for exploration', 'error');
            return;
        }
        
        colonist.status = 'exploring';
        colonist.explorationArea = areaId;
        colonist.explorationEndTime = Date.now() + (area.timeRequired * 1000);
        
        this.state.addLogEntry(`${colonist.name} began exploring ${area.name}`);
        this.showNotification(`${colonist.name} started exploring ${area.name}`, 'success');
        
        this.renderExplorationAreas();
    }
    
    showColonistModal(colonist) {
        this.state.selectedColonist = colonist;
        
        document.getElementById('colonist-modal-name').textContent = colonist.name;
        document.getElementById('colonist-modal-type').textContent = `Type: ${colonist.type}`;
        
        // Update stats
        document.getElementById('modal-health-bar').style.width = `${colonist.health}%`;
        document.getElementById('modal-health-value').textContent = Math.floor(colonist.health);
        
        document.getElementById('modal-hunger-bar').style.width = `${colonist.hunger}%`;
        document.getElementById('modal-hunger-value').textContent = Math.floor(colonist.hunger);
        
        document.getElementById('modal-rest-bar').style.width = `${colonist.rest}%`;
        document.getElementById('modal-rest-value').textContent = Math.floor(colonist.rest);
        
        document.getElementById('modal-morale-bar').style.width = `${colonist.morale}%`;
        document.getElementById('modal-morale-value').textContent = Math.floor(colonist.morale);
        
        document.getElementById('modal-skill-value').textContent = Math.floor(colonist.explorationSkill);
        document.getElementById('modal-status-value').textContent = colonist.status;
        document.getElementById('modal-discoveries-value').textContent = colonist.discoveries;
        
        // Enable/disable action buttons
        document.getElementById('feed-colonist').disabled = this.state.resources.food < 1;
        document.getElementById('rest-colonist').disabled = colonist.status === 'exploring';
        
        document.getElementById('colonist-modal').classList.remove('hidden');
    }
    
    showTechModal(category, techName, tech) {
        this.state.selectedTech = { category, techName, tech };
        
        document.getElementById('tech-modal-name').textContent = this.formatTechName(techName);
        document.getElementById('tech-modal-description').textContent = this.getTechDescription(techName);
        
        const costContainer = document.getElementById('tech-modal-cost');
        costContainer.innerHTML = Object.entries(tech.cost).map(([resource, amount]) => 
            `<div class="cost-item">
                <span>${this.getResourceIcon(resource)}</span>
                <span>${resource}: ${amount}</span>
            </div>`
        ).join('');
        
        document.getElementById('research-tech').disabled = !this.state.canResearchTech(category, techName);
        
        document.getElementById('tech-modal').classList.remove('hidden');
    }
    
    showDiscoveryModal(colonist, discovery, area) {
        this.state.pendingDiscovery = { colonist, discovery, area };
        
        const resultsDiv = document.getElementById('exploration-results');
        resultsDiv.innerHTML = `
            <div class="discovery-item">
                <div class="discovery-name">${discovery.name}</div>
                <div class="discovery-description">${discovery.description}</div>
                <div style="margin-top: 8px; font-size: 12px;">
                    Resources: ${Object.entries(discovery.resources).map(([r, a]) => `${this.getResourceIcon(r)} +${a}`).join(', ')}
                </div>
            </div>
        `;
        
        document.getElementById('exploration-modal').classList.remove('hidden');
    }
    
    feedColonist() {
        if (this.state.resources.food < 1) {
            this.showNotification('Not enough food', 'error');
            return;
        }
        
        const colonist = this.state.selectedColonist;
        if (!colonist) return;
        
        this.state.resources.food -= 1;
        colonist.hunger = Math.min(100, colonist.hunger + 30);
        colonist.morale = Math.min(100, colonist.morale + 10);
        
        this.showNotification(`${colonist.name} has been fed`, 'success');
        this.showColonistModal(colonist); // Refresh modal
    }
    
    restColonist() {
        const colonist = this.state.selectedColonist;
        if (!colonist || colonist.status === 'exploring') return;
        
        colonist.rest = Math.min(100, colonist.rest + 40);
        colonist.morale = Math.min(100, colonist.morale + 5);
        
        this.showNotification(`${colonist.name} is resting`, 'success');
        this.showColonistModal(colonist); // Refresh modal
    }
    
    claimDiscovery() {
        const pending = this.state.pendingDiscovery;
        if (!pending) return;
        
        const { discovery } = pending;
        
        // Add resources
        Object.entries(discovery.resources).forEach(([resource, amount]) => {
            this.state.resources[resource] += amount;
        });
        
        this.showNotification(`Added ${discovery.name} to inventory!`, 'success');
        this.closeModal(document.getElementById('exploration-modal'));
        
        this.state.pendingDiscovery = null;
    }
    
    researchCurrentTech() {
        const selected = this.state.selectedTech;
        if (!selected) return;
        
        const { category, techName } = selected;
        
        if (this.state.researchTech(category, techName)) {
            this.showNotification(`Research completed: ${this.formatTechName(techName)}`, 'success');
            this.closeModal(document.getElementById('tech-modal'));
            this.renderTechTree();
        } else {
            this.showNotification('Cannot research this technology', 'error');
        }
    }
    
    closeModal(modal) {
        modal.classList.add('hidden');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Utility functions
    getResourceIcon(resource) {
        const icons = {
            power: '⚡',
            oxygen: '🧪',
            food: '🍎',
            water: '💧',
            materials: '🧱',
            rareElements: '💎'
        };
        return icons[resource] || '📦';
    }
    
    formatTechName(techName) {
        return techName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
    
    getTechDescription(techName) {
        const descriptions = {
            foodProduction: 'Establish hydroponic farms to produce food sustainably',
            waterPurification: 'Build systems to purify and recycle water',
            shelterConstruction: 'Construct better shelters for colonists',
            solarPanels: 'Deploy solar panels to harness the sun\'s energy',
            geothermal: 'Tap into geothermal energy sources',
            powerStorage: 'Build advanced battery systems for energy storage',
            robotics: 'Develop robotic assistants for various tasks',
            manufacturing: 'Set up automated manufacturing facilities',
            advancedMaterials: 'Research and produce advanced materials'
        };
        return descriptions[techName] || 'Advanced technology for colony development';
    }
}

// Initialize game when page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new GameManager();
});