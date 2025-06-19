// Xenomorph Park - Game Logic
class XenomorphPark {
    constructor() {
        // Game state
        this.gameState = {
            mode: 'building', // 'building' or 'horror'
            paused: false,
            day: 1,
            resources: {
                credits: 50000,
                power: 10,
                maxPower: 10,
                research: 0,
                security: 'High',
                visitors: 0
            },
            facilities: [],
            xenomorphs: [],
            selectedFacility: null,
            selectedSpecies: null,
            research: {
                completed: [],
                inProgress: null,
                points: 0
            },
            horror: {
                health: 100,
                ammo: 95,
                maxAmmo: 95,
                weapon: 'M41A Pulse Rifle',
                objectives: [
                    'Restore power to main grid',
                    'Evacuate remaining civilians', 
                    'Eliminate xenomorph threats'
                ]
            }
        };

        // Game data from JSON
        this.xenomorphSpecies = [
            {
                name: "Drone",
                description: "Basic worker xenomorph, birthed from human hosts",
                danger_level: 3,
                containment_difficulty: 2,
                research_cost: 100,
                food_requirement: "Low",
                special_abilities: ["Hive construction", "Basic hunting"]
            },
            {
                name: "Warrior", 
                description: "Combat-focused xenomorph with ridged skull",
                danger_level: 4,
                containment_difficulty: 3,
                research_cost: 250,
                food_requirement: "Medium",
                special_abilities: ["Pack hunting", "Stealth tactics"]
            },
            {
                name: "Runner",
                description: "Quadrupedal xenomorph birthed from animal hosts",
                danger_level: 4,
                containment_difficulty: 4,
                research_cost: 300,
                food_requirement: "Medium",
                special_abilities: ["High speed", "Wall climbing"]
            },
            {
                name: "Praetorian",
                description: "Large defensive xenomorph protecting the queen",
                danger_level: 5,
                containment_difficulty: 5,
                research_cost: 500,
                food_requirement: "High",
                special_abilities: ["Heavy armor", "Area denial"]
            },
            {
                name: "Predalien",
                description: "Rare hybrid born from Predator host",
                danger_level: 6,
                containment_difficulty: 6,
                research_cost: 1000,
                food_requirement: "Very High",
                special_abilities: ["Royal jelly production", "Advanced intelligence"]
            }
        ];

        this.facilities = [
            {
                name: "Research Lab",
                cost: 5000,
                power_requirement: 3,
                description: "Conduct xenomorph research and genetic studies"
            },
            {
                name: "Hatchery",
                cost: 8000,
                power_requirement: 2,
                description: "Controlled breeding facility with ovomorphs"
            },
            {
                name: "Containment Unit",
                cost: 12000,
                power_requirement: 5,
                description: "High-security xenomorph housing"
            },
            {
                name: "Visitor Center",
                cost: 3000,
                power_requirement: 2,
                description: "Guest facilities and viewing areas"
            },
            {
                name: "Security Station",
                cost: 7000,
                power_requirement: 4,
                description: "Colonial Marine deployment and monitoring"
            },
            {
                name: "Power Generator",
                cost: 4000,
                power_requirement: 0,
                description: "Provides power to other facilities"
            }
        ];

        this.weapons = [
            {
                name: "M41A Pulse Rifle",
                damage: 4,
                ammo_capacity: 95,
                rate_of_fire: "High",
                special: "Grenade launcher attachment"
            },
            {
                name: "M37A2 Shotgun", 
                damage: 6,
                ammo_capacity: 8,
                rate_of_fire: "Medium",
                special: "High close-range damage"
            },
            {
                name: "M56 Smartgun",
                damage: 5,
                ammo_capacity: 500,
                rate_of_fire: "Very High",
                special: "Auto-targeting system"
            }
        ];

        this.crisisEvents = [
            {
                name: "Containment Breach",
                probability: 0.3,
                severity: "Medium",
                description: "Single xenomorph escapes containment",
                response_options: ["Security lockdown", "Colonial Marine deployment", "Facility evacuation"]
            },
            {
                name: "Power Failure",
                probability: 0.2,
                severity: "High", 
                description: "Main power grid failure, all containment at risk",
                response_options: ["Emergency power", "Immediate evacuation", "Manual lockdown"]
            },
            {
                name: "Hive Outbreak",
                probability: 0.1,
                severity: "Critical",
                description: "Multiple xenomorphs coordinate escape",
                response_options: ["Nuclear option", "Full marine assault", "Abandon facility"]
            }
        ];

        this.gridSize = { width: 20, height: 15 };
        this.grid = Array(this.gridSize.height).fill().map(() => Array(this.gridSize.width).fill(null));
        
        this.init();
    }

    init() {
        this.initializeDOM();
        this.setupEventListeners();
        this.createGrid();
        this.populateFacilities();
        this.populateSpecies();
        this.updateResourceDisplay();
        this.startGameLoop();
        this.showTutorial();
    }

    initializeDOM() {
        this.elements = {
            // Resource displays
            credits: document.getElementById('credits'),
            power: document.getElementById('power'),
            research: document.getElementById('research'),
            security: document.getElementById('security'),
            visitors: document.getElementById('visitors'),
            
            // Game modes
            buildingMode: document.getElementById('building-mode'),
            horrorMode: document.getElementById('horror-mode'),
            currentMode: document.getElementById('current-mode'),
            
            // Building mode elements
            facilityGrid: document.getElementById('facility-grid'),
            speciesGrid: document.getElementById('species-grid'),
            parkGrid: document.getElementById('park-grid'),
            
            // Horror mode elements
            healthFill: document.getElementById('health-fill'),
            ammoDisplay: document.getElementById('ammo-display'),
            weaponName: document.getElementById('weapon-name'),
            objectivesList: document.getElementById('objectives-list'),
            
            // Modals
            crisisModal: document.getElementById('crisis-modal'),
            researchModal: document.getElementById('research-modal'),
            tutorialPanel: document.getElementById('tutorial-panel'),
            
            // Status messages
            statusMessages: document.getElementById('status-messages')
        };
    }

    setupEventListeners() {
        // Game controls
        document.getElementById('start-research').addEventListener('click', () => this.openResearchModal());
        document.getElementById('pause-game').addEventListener('click', () => this.togglePause());
        document.getElementById('save-game').addEventListener('click', () => this.saveGame());
        
        // Horror mode controls
        document.getElementById('switch-weapon').addEventListener('click', () => this.switchWeapon());
        document.getElementById('use-medkit').addEventListener('click', () => this.useMedkit());
        document.getElementById('return-building').addEventListener('click', () => this.switchToBuilding());
        
        // Modal controls
        document.getElementById('close-research').addEventListener('click', () => this.closeResearchModal());
        document.getElementById('close-tutorial').addEventListener('click', () => this.closeTutorial());
        
        // Crisis modal event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('crisis-option')) {
                this.handleCrisisResponse(e.target.dataset.option);
            }
        });
    }

    createGrid() {
        const parkGrid = this.elements.parkGrid;
        parkGrid.innerHTML = '';
        
        for (let row = 0; row < this.gridSize.height; row++) {
            for (let col = 0; col < this.gridSize.width; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => this.handleGridClick(row, col));
                parkGrid.appendChild(cell);
            }
        }
    }

    populateFacilities() {
        const facilityGrid = this.elements.facilityGrid;
        facilityGrid.innerHTML = '';
        
        this.facilities.forEach(facility => {
            const facilityElement = document.createElement('div');
            facilityElement.className = 'facility-item';
            facilityElement.dataset.facilityName = facility.name;
            
            facilityElement.innerHTML = `
                <div class="facility-name">${facility.name}</div>
                <div class="facility-cost">$${facility.cost.toLocaleString()}</div>
                <div class="facility-description">${facility.description}</div>
                <div style="font-size: 10px; color: #888; margin-top: 4px;">
                    Power: ${facility.power_requirement}
                </div>
            `;
            
            facilityElement.addEventListener('click', () => this.selectFacility(facility));
            facilityGrid.appendChild(facilityElement);
        });
    }

    populateSpecies() {
        const speciesGrid = this.elements.speciesGrid;
        speciesGrid.innerHTML = '';
        
        this.xenomorphSpecies.forEach(species => {
            const speciesElement = document.createElement('div');
            speciesElement.className = 'species-item';
            speciesElement.dataset.speciesName = species.name;
            
            const dangerClass = this.getDangerClass(species.danger_level);
            
            speciesElement.innerHTML = `
                <div class="species-name">${species.name}</div>
                <div class="species-cost">Research: ${species.research_cost}</div>
                <div class="species-description">${species.description}</div>
                <div class="danger-level ${dangerClass}">
                    Danger Level: ${species.danger_level}
                </div>
            `;
            
            speciesElement.addEventListener('click', () => this.selectSpecies(species));
            speciesGrid.appendChild(speciesElement);
        });
    }

    getDangerClass(level) {
        if (level <= 2) return 'low';
        if (level <= 4) return 'medium';
        if (level <= 5) return 'high';
        return 'critical';
    }

    selectFacility(facility) {
        // Remove previous selection
        document.querySelectorAll('.facility-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selection to clicked facility
        const facilityElement = document.querySelector(`[data-facility-name="${facility.name}"]`);
        facilityElement.classList.add('selected');
        
        this.gameState.selectedFacility = facility;
        this.gameState.selectedSpecies = null;
        
        this.showStatusMessage(`Selected: ${facility.name}`, 'info');
    }

    selectSpecies(species) {
        // Check if species is researched
        if (!this.gameState.research.completed.includes(species.name) && species.name !== 'Drone') {
            this.showStatusMessage(`${species.name} requires research first!`, 'error');
            return;
        }
        
        // Remove previous selection
        document.querySelectorAll('.species-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selection to clicked species
        const speciesElement = document.querySelector(`[data-species-name="${species.name}"]`);
        speciesElement.classList.add('selected');
        
        this.gameState.selectedSpecies = species;
        this.gameState.selectedFacility = null;
        
        this.showStatusMessage(`Selected: ${species.name}`, 'info');
    }

    handleGridClick(row, col) {
        if (this.gameState.selectedFacility) {
            this.placeFacility(row, col, this.gameState.selectedFacility);
        } else if (this.gameState.selectedSpecies) {
            this.placeSpecies(row, col, this.gameState.selectedSpecies);
        }
    }

    placeFacility(row, col, facility) {
        // Check if cell is occupied
        if (this.grid[row][col]) {
            this.showStatusMessage('Cell already occupied!', 'error');
            return;
        }
        
        // Check if player has enough credits
        if (this.gameState.resources.credits < facility.cost) {
            this.showStatusMessage('Insufficient credits!', 'error');
            return;
        }
        
        // Check power requirements
        if (facility.name !== 'Power Generator' && 
            this.gameState.resources.power < facility.power_requirement) {
            this.showStatusMessage('Insufficient power!', 'error');
            return;
        }
        
        // Place facility
        this.grid[row][col] = {
            type: 'facility',
            data: facility,
            id: Date.now()
        };
        
        // Update resources
        this.gameState.resources.credits -= facility.cost;
        
        if (facility.name === 'Power Generator') {
            this.gameState.resources.maxPower += 10;
            this.gameState.resources.power += 10;
        } else {
            this.gameState.resources.power -= facility.power_requirement;
        }
        
        // Update visual
        this.updateGridCell(row, col);
        this.updateResourceDisplay();
        
        // Add to facilities list
        this.gameState.facilities.push({
            ...facility,
            row,
            col,
            id: this.grid[row][col].id
        });
        
        this.showStatusMessage(`${facility.name} constructed!`, 'success');
        
        // Check for random events
        this.checkRandomEvents();
    }

    placeSpecies(row, col, species) {
        // Check if cell has a containment unit
        const cell = this.grid[row][col];
        if (!cell || cell.data.name !== 'Containment Unit') {
            this.showStatusMessage('Xenomorphs require Containment Units!', 'error');
            return;
        }
        
        // Check if containment already has a xenomorph
        if (cell.xenomorph) {
            this.showStatusMessage('Containment Unit is already occupied!', 'error');
            return;
        }
        
        // Add xenomorph to containment
        cell.xenomorph = {
            ...species,
            id: Date.now(),
            health: 100,
            hunger: 50,
            aggression: species.danger_level * 10
        };
        
        this.gameState.xenomorphs.push(cell.xenomorph);
        this.updateGridCell(row, col);
        
        this.showStatusMessage(`${species.name} contained!`, 'success');
        
        // Increase security risk
        this.updateSecurityLevel();
    }

    updateGridCell(row, col) {
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const cellData = this.grid[row][col];
        
        if (!cellData) return;
        
        cellElement.classList.add('facility');
        
        if (cellData.data.name === 'Research Lab') {
            cellElement.classList.add('research');
            cellElement.textContent = '🔬';
        } else if (cellData.data.name === 'Containment Unit') {
            cellElement.classList.add('containment');
            cellElement.textContent = cellData.xenomorph ? '👾' : '🔒';
        } else if (cellData.data.name === 'Hatchery') {
            cellElement.textContent = '🥚';
        } else if (cellData.data.name === 'Security Station') {
            cellElement.textContent = '🛡️';
        } else if (cellData.data.name === 'Visitor Center') {
            cellElement.textContent = '👥';
        } else if (cellData.data.name === 'Power Generator') {
            cellElement.textContent = '⚡';
        }
    }

    updateResourceDisplay() {
        this.elements.credits.textContent = this.gameState.resources.credits.toLocaleString();
        this.elements.power.textContent = `${this.gameState.resources.power}/${this.gameState.resources.maxPower}`;
        this.elements.research.textContent = this.gameState.resources.research;
        this.elements.security.textContent = this.gameState.resources.security;
        this.elements.visitors.textContent = this.gameState.resources.visitors;
    }

    updateSecurityLevel() {
        const totalDanger = this.gameState.xenomorphs.reduce((sum, xeno) => sum + xeno.danger_level, 0);
        const securityFacilities = this.gameState.facilities.filter(f => f.name === 'Security Station').length;
        
        let securityLevel = 'High';
        if (totalDanger > securityFacilities * 15) {
            securityLevel = 'Critical';
        } else if (totalDanger > securityFacilities * 10) {
            securityLevel = 'Medium';
        } else if (totalDanger > securityFacilities * 5) {
            securityLevel = 'Low';
        }
        
        this.gameState.resources.security = securityLevel;
        this.updateResourceDisplay();
    }

    checkRandomEvents() {
        // Only check if there are xenomorphs
        if (this.gameState.xenomorphs.length === 0) return;
        
        // Random chance for crisis events
        const random = Math.random();
        let triggerEvent = null;
        
        for (const event of this.crisisEvents) {
            if (random < event.probability * 0.1) { // Reduced probability for demo
                triggerEvent = event;
                break;
            }
        }
        
        if (triggerEvent) {
            this.triggerCrisisEvent(triggerEvent);
        }
    }

    triggerCrisisEvent(event) {
        // Show crisis modal
        document.getElementById('crisis-title').textContent = event.name.toUpperCase();
        document.getElementById('crisis-description').textContent = event.description;
        
        const optionsContainer = document.getElementById('crisis-options');
        optionsContainer.innerHTML = '';
        
        event.response_options.forEach(option => {
            const optionElement = document.createElement('button');
            optionElement.className = 'crisis-option';
            optionElement.textContent = option;
            optionElement.dataset.option = option;
            optionsContainer.appendChild(optionElement);
        });
        
        this.elements.crisisModal.classList.add('active');
        
        // Play alarm sound effect (simulated)
        this.showStatusMessage(`🚨 CRISIS: ${event.name}`, 'error');
    }

    handleCrisisResponse(option) {
        this.elements.crisisModal.classList.remove('active');
        
        switch (option) {
            case 'Colonial Marine deployment':
            case 'Full marine assault':
                this.switchToHorror();
                break;
            case 'Security lockdown':
                this.gameState.resources.credits -= 5000;
                this.showStatusMessage('Lockdown initiated. Crisis contained.', 'success');
                break;
            case 'Facility evacuation':
                this.gameState.resources.visitors = 0;
                this.gameState.resources.credits -= 10000;
                this.showStatusMessage('Evacuation complete. Facility damaged.', 'warning');
                break;
            case 'Nuclear option':
                this.resetPark();
                this.showStatusMessage('Facility destroyed. Starting over...', 'error');
                break;
            default:
                this.showStatusMessage(`Implemented: ${option}`, 'info');
        }
        
        this.updateResourceDisplay();
    }

    switchToHorror() {
        this.gameState.mode = 'horror';
        this.elements.buildingMode.classList.remove('active');
        this.elements.horrorMode.classList.add('active');
        this.elements.currentMode.textContent = 'Survival Horror Mode';
        
        // Initialize horror mode
        this.initHorrorMode();
        this.showStatusMessage('Colonial Marines deployed!', 'info');
    }

    switchToBuilding() {
        this.gameState.mode = 'building';
        this.elements.horrorMode.classList.remove('active');
        this.elements.buildingMode.classList.add('active');
        this.elements.currentMode.textContent = 'Building Mode';
        
        this.showStatusMessage('Returned to base operations.', 'success');
    }

    initHorrorMode() {
        // Reset horror stats
        this.gameState.horror.health = 100;
        this.gameState.horror.ammo = this.gameState.horror.maxAmmo;
        
        // Update HUD
        this.updateHorrorHUD();
        
        // Start motion tracker animation
        this.startMotionTracker();
    }

    updateHorrorHUD() {
        this.elements.healthFill.style.width = `${this.gameState.horror.health}%`;
        this.elements.ammoDisplay.textContent = `${this.gameState.horror.ammo}/${this.gameState.horror.maxAmmo}`;
        this.elements.weaponName.textContent = this.gameState.horror.weapon;
    }

    startMotionTracker() {
        // Simulate alien movement on motion tracker
        setInterval(() => {
            if (this.gameState.mode !== 'horror') return;
            
            const alienBlips = document.getElementById('alien-blips');
            alienBlips.innerHTML = '';
            
            // Add random alien blips
            for (let i = 0; i < Math.random() * 3; i++) {
                const blip = document.createElement('div');
                blip.className = 'tracker-blip';
                blip.style.left = Math.random() * 140 + 'px';
                blip.style.top = Math.random() * 140 + 'px';
                blip.style.background = '#ff4444';
                blip.style.boxShadow = '0 0 10px #ff4444';
                alienBlips.appendChild(blip);
            }
        }, 2000);
    }

    switchWeapon() {
        const currentIndex = this.weapons.findIndex(w => w.name === this.gameState.horror.weapon);
        const nextIndex = (currentIndex + 1) % this.weapons.length;
        const nextWeapon = this.weapons[nextIndex];
        
        this.gameState.horror.weapon = nextWeapon.name;
        this.gameState.horror.ammo = nextWeapon.ammo_capacity;
        this.gameState.horror.maxAmmo = nextWeapon.ammo_capacity;
        
        this.updateHorrorHUD();
        this.showStatusMessage(`Switched to ${nextWeapon.name}`, 'info');
    }

    useMedkit() {
        if (this.gameState.horror.health >= 100) {
            this.showStatusMessage('Health is already full!', 'warning');
            return;
        }
        
        this.gameState.horror.health = Math.min(100, this.gameState.horror.health + 50);
        this.updateHorrorHUD();
        this.showStatusMessage('Medkit used. Health restored.', 'success');
    }

    openResearchModal() {
        // Check if player has research labs
        const researchLabs = this.gameState.facilities.filter(f => f.name === 'Research Lab').length;
        if (researchLabs === 0) {
            this.showStatusMessage('Build a Research Lab first!', 'error');
            return;
        }
        
        this.populateResearchTree();
        this.elements.researchModal.classList.add('active');
    }

    closeResearchModal() {
        this.elements.researchModal.classList.remove('active');
    }

    populateResearchTree() {
        const researchTree = document.getElementById('research-tree');
        researchTree.innerHTML = '';
        
        this.xenomorphSpecies.forEach(species => {
            if (species.name === 'Drone') return; // Drone is available by default
            
            const researchItem = document.createElement('div');
            researchItem.className = 'research-item';
            
            const isCompleted = this.gameState.research.completed.includes(species.name);
            const canResearch = this.gameState.resources.research >= species.research_cost;
            
            if (isCompleted) {
                researchItem.classList.add('completed');
            }
            
            researchItem.innerHTML = `
                <h4>${species.name}</h4>
                <p>${species.description}</p>
                <div>Cost: ${species.research_cost} RP</div>
                <div>Status: ${isCompleted ? 'Completed' : 'Available'}</div>
            `;
            
            if (!isCompleted && canResearch) {
                const researchBtn = document.createElement('button');
                researchBtn.className = 'btn btn--primary';
                researchBtn.textContent = 'Research';
                researchBtn.addEventListener('click', () => this.startResearch(species));
                researchItem.appendChild(researchBtn);
            }
            
            researchTree.appendChild(researchItem);
        });
    }

    startResearch(species) {
        this.gameState.resources.research -= species.research_cost;
        this.gameState.research.completed.push(species.name);
        
        this.updateResourceDisplay();
        this.populateResearchTree();
        
        this.showStatusMessage(`${species.name} research completed!`, 'success');
    }

    togglePause() {
        this.gameState.paused = !this.gameState.paused;
        const btn = document.getElementById('pause-game');
        btn.textContent = this.gameState.paused ? 'Resume' : 'Pause';
        
        this.showStatusMessage(this.gameState.paused ? 'Game Paused' : 'Game Resumed', 'info');
    }

    saveGame() {
        localStorage.setItem('xenomorphPark', JSON.stringify(this.gameState));
        this.showStatusMessage('Game Saved!', 'success');
    }

    resetPark() {
        // Clear grid
        this.grid = Array(this.gridSize.height).fill().map(() => Array(this.gridSize.width).fill(null));
        
        // Reset game state
        this.gameState.facilities = [];
        this.gameState.xenomorphs = [];
        this.gameState.resources = {
            credits: 50000,
            power: 10,
            maxPower: 10,
            research: 0,
            security: 'High',
            visitors: 0
        };
        
        // Update display
        this.createGrid();
        this.updateResourceDisplay();
    }

    startGameLoop() {
        // Main game loop - runs every second
        setInterval(() => {
            if (this.gameState.paused) return;
            
            // Increment day every 30 seconds
            if (Date.now() % 30000 < 1000) {
                this.gameState.day++;
            }
            
            // Generate research points
            const researchLabs = this.gameState.facilities.filter(f => f.name === 'Research Lab').length;
            this.gameState.resources.research += researchLabs * 2;
            
            // Generate visitor income
            const visitorCenters = this.gameState.facilities.filter(f => f.name === 'Visitor Center').length;
            this.gameState.resources.visitors = visitorCenters * 50;
            this.gameState.resources.credits += this.gameState.resources.visitors * 10;
            
            this.updateResourceDisplay();
        }, 1000);
    }

    showTutorial() {
        this.elements.tutorialPanel.style.display = 'block';
    }

    closeTutorial() {
        this.elements.tutorialPanel.style.display = 'none';
    }

    showStatusMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `status-message ${type}`;
        messageElement.textContent = message;
        
        this.elements.statusMessages.appendChild(messageElement);
        
        // Remove message after 4 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 4000);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.xenomorphPark = new XenomorphPark();
});