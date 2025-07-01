// Game Data
const KEMONOMIMI_TYPES = [
    {
        name: "Nekomimi",
        animal: "Cat",
        traits: ["Curious", "Agile", "Independent"],
        job_bonuses: {"stealth": 20, "entertainment": 15, "athletic": 10},
        base_stats: {"strength": 40, "agility": 70, "intelligence": 60, "charisma": 55, "endurance": 50, "loyalty": 45},
        emoji: "🐱"
    },
    {
        name: "Inumimi", 
        animal: "Dog",
        traits: ["Loyal", "Brave", "Friendly"],
        job_bonuses: {"security": 25, "athletic": 15, "entertainment": 10},
        base_stats: {"strength": 65, "agility": 60, "intelligence": 55, "charisma": 70, "endurance": 70, "loyalty": 85},
        emoji: "🐶"
    },
    {
        name: "Kitsunemimi",
        animal: "Fox", 
        traits: ["Cunning", "Intelligent", "Mysterious"],
        job_bonuses: {"magical": 30, "scholarly": 25, "stealth": 15},
        base_stats: {"strength": 45, "agility": 65, "intelligence": 85, "charisma": 60, "endurance": 55, "loyalty": 40},
        emoji: "🦊"
    },
    {
        name: "Usagimimi",
        animal: "Rabbit",
        traits: ["Quick", "Cautious", "Gentle"],
        job_bonuses: {"athletic": 20, "stealth": 10, "entertainment": 15},
        base_stats: {"strength": 35, "agility": 80, "intelligence": 65, "charisma": 50, "endurance": 60, "loyalty": 60},
        emoji: "🐰"
    },
    {
        name: "Ookami",
        animal: "Wolf",
        traits: ["Strong", "Pack-oriented", "Leadership"],
        job_bonuses: {"security": 20, "physical": 25, "leadership": 30},
        base_stats: {"strength": 80, "agility": 70, "intelligence": 70, "charisma": 75, "endurance": 75, "loyalty": 70},
        emoji: "🐺"
    },
    {
        name: "Nezumimi",
        animal: "Mouse",
        traits: ["Small", "Sneaky", "Resourceful"],
        job_bonuses: {"stealth": 25, "scholarly": 15, "infiltration": 30},
        base_stats: {"strength": 25, "agility": 75, "intelligence": 70, "charisma": 40, "endurance": 45, "loyalty": 55},
        emoji: "🐭"
    }
];

const JOB_CATEGORIES = [
    {
        name: "Physical Labor",
        description: "Construction, farming, mining work",
        required_stats: ["strength", "endurance"],
        training_cost: 100,
        training_time: 3,
        salary_multiplier: 1.5
    },
    {
        name: "Athletic Performance", 
        description: "Sports, dancing, acrobatics",
        required_stats: ["agility", "endurance"],
        training_cost: 150,
        training_time: 4,
        salary_multiplier: 2.0
    },
    {
        name: "Scholarly Work",
        description: "Research, teaching, accounting", 
        required_stats: ["intelligence"],
        training_cost: 200,
        training_time: 5,
        salary_multiplier: 2.5
    },
    {
        name: "Entertainment",
        description: "Singing, acting, hosting",
        required_stats: ["charisma", "agility"],
        training_cost: 175,
        training_time: 4,
        salary_multiplier: 3.0
    },
    {
        name: "Security Work",
        description: "Bodyguard, police, military",
        required_stats: ["strength", "loyalty"],
        training_cost: 125,
        training_time: 4,
        salary_multiplier: 2.2
    },
    {
        name: "Stealth Operations",
        description: "Spy work, investigation",
        required_stats: ["agility", "intelligence"],
        training_cost: 250,
        training_time: 6,
        salary_multiplier: 3.5
    },
    {
        name: "Magical Arts",
        description: "Spellcasting, potion-making",
        required_stats: ["intelligence", "charisma"],
        training_cost: 300,
        training_time: 7,
        salary_multiplier: 4.0
    }
];

const HAIR_COLORS = ["Black", "Brown", "Blonde", "Red", "Silver", "White", "Blue", "Purple", "Pink", "Green"];
const EYE_COLORS = ["Brown", "Blue", "Green", "Hazel", "Gray", "Purple", "Gold", "Red", "Silver"];
const PERSONALITY_TRAITS = ["Playful", "Serious", "Shy", "Outgoing", "Calm", "Energetic", "Mischievous", "Gentle", "Bold", "Wise"];

// Game State
class GameState {
    constructor() {
        this.coins = 1000;
        this.day = 1;
        this.kemonomimi = [];
        this.breedingQueue = [];
        this.trainingQueue = [];
        this.marketStock = [];
        this.selectedParent1 = null;
        this.selectedParent2 = null;
        this.nextId = 1;
        
        // Create starter kemonomimi
        this.kemonomimi.push(this.createRandomKemonomimi());
        this.generateMarketStock();
    }
    
    createRandomKemonomimi(parent1 = null, parent2 = null) {
        let type, stats;
        
        if (parent1 && parent2) {
            // Breeding - inherit from parents
            const types = [parent1.type, parent2.type];
            type = types[Math.random() < 0.7 ? 0 : 1]; // 70% chance of parent1's type
            
            stats = {};
            Object.keys(parent1.stats).forEach(stat => {
                const avg = (parent1.stats[stat] + parent2.stats[stat]) / 2;
                const variation = Math.random() * 20 - 10; // ±10 variation
                stats[stat] = Math.max(10, Math.min(100, Math.round(avg + variation)));
            });
        } else {
            // Random generation
            type = KEMONOMIMI_TYPES[Math.floor(Math.random() * KEMONOMIMI_TYPES.length)];
            stats = {};
            Object.keys(type.base_stats).forEach(stat => {
                const base = type.base_stats[stat];
                const variation = Math.random() * 20 - 10; // ±10 variation
                stats[stat] = Math.max(10, Math.min(100, Math.round(base + variation)));
            });
        }
        
        const hairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)];
        const eyeColor = EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)];
        const personality = PERSONALITY_TRAITS[Math.floor(Math.random() * PERSONALITY_TRAITS.length)];
        
        const kemono = {
            id: this.nextId++,
            name: this.generateName(),
            type: type,
            stats: stats,
            hairColor: hairColor,
            eyeColor: eyeColor,
            personality: personality,
            age: 18 + Math.floor(Math.random() * 10),
            status: 'available',
            trainedJobs: [],
            parents: parent1 && parent2 ? [parent1.id, parent2.id] : null,
            children: []
        };
        
        return kemono;
    }
    
    generateName() {
        const prefixes = ['Aki', 'Yuki', 'Hana', 'Saki', 'Miko', 'Rei', 'Kyo', 'Tai', 'Ren', 'Nao'];
        const suffixes = ['ko', 'mi', 'ka', 'na', 'ri', 'to', 'ya', 'hi', 'ru', 'ta'];
        return prefixes[Math.floor(Math.random() * prefixes.length)] + 
               suffixes[Math.floor(Math.random() * suffixes.length)];
    }
    
    generateMarketStock() {
        this.marketStock = [];
        for (let i = 0; i < 6; i++) {
            const kemono = this.createRandomKemonomimi();
            kemono.price = this.calculateBasePrice(kemono);
            this.marketStock.push(kemono);
        }
    }
    
    calculateBasePrice(kemono) {
        const avgStats = Object.values(kemono.stats).reduce((a, b) => a + b, 0) / 6;
        const basePrice = 150 + (avgStats - 50) * 3;
        return Math.max(100, Math.round(basePrice));
    }
    
    calculateSellPrice(kemono) {
        let basePrice = this.calculateBasePrice(kemono);
        
        // Add value for trained jobs
        kemono.trainedJobs.forEach(job => {
            const jobData = JOB_CATEGORIES.find(j => j.name === job);
            if (jobData) {
                basePrice += jobData.training_cost * jobData.salary_multiplier;
            }
        });
        
        return Math.round(basePrice * 0.8); // Sell for 80% of calculated value
    }
}

// Initialize game
let gameState = new GameState();

// DOM Elements
const coinsDisplay = document.getElementById('coins-display');
const dayDisplay = document.getElementById('day-display');
const collectionCountDisplay = document.getElementById('collection-count');
const collectionGrid = document.getElementById('collection-grid');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

// Modal elements
const kemonoModal = document.getElementById('kemono-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalFooter = document.getElementById('modal-footer');
const closeModalBtn = document.getElementById('close-modal');

const jobModal = document.getElementById('job-modal');
const jobSelection = document.getElementById('job-selection');
const closeJobModalBtn = document.getElementById('close-job-modal');

// Global functions for window scope
window.showKemonoDetails = function(kemono) {
    modalTitle.textContent = `${kemono.name} - ${kemono.type.name}`;
    
    modalBody.innerHTML = `
        <div class="kemono-info">
            <div class="info-section">
                <h4>Physical Traits</h4>
                <p><strong>Type:</strong> ${kemono.type.name} (${kemono.type.animal})</p>
                <p><strong>Age:</strong> ${kemono.age} years</p>
                <p><strong>Hair Color:</strong> ${kemono.hairColor}</p>
                <p><strong>Eye Color:</strong> ${kemono.eyeColor}</p>
                <p><strong>Personality:</strong> ${kemono.personality}</p>
            </div>
            
            <div class="info-section">
                <h4>Natural Traits</h4>
                <div class="trait-list">
                    ${kemono.type.traits.map(trait => `<span class="trait-tag">${trait}</span>`).join('')}
                </div>
            </div>
            
            <div class="info-section">
                <h4>Stats</h4>
                <div class="detailed-stats">
                    <div class="detailed-stat">
                        <div class="detailed-stat-name">Strength</div>
                        <div class="detailed-stat-value">${kemono.stats.strength}</div>
                    </div>
                    <div class="detailed-stat">
                        <div class="detailed-stat-name">Agility</div>
                        <div class="detailed-stat-value">${kemono.stats.agility}</div>
                    </div>
                    <div class="detailed-stat">
                        <div class="detailed-stat-name">Intelligence</div>
                        <div class="detailed-stat-value">${kemono.stats.intelligence}</div>
                    </div>
                    <div class="detailed-stat">
                        <div class="detailed-stat-name">Charisma</div>
                        <div class="detailed-stat-value">${kemono.stats.charisma}</div>
                    </div>
                    <div class="detailed-stat">
                        <div class="detailed-stat-name">Endurance</div>
                        <div class="detailed-stat-value">${kemono.stats.endurance}</div>
                    </div>
                    <div class="detailed-stat">
                        <div class="detailed-stat-name">Loyalty</div>
                        <div class="detailed-stat-value">${kemono.stats.loyalty}</div>
                    </div>
                </div>
            </div>
            
            ${kemono.trainedJobs.length > 0 ? `
                <div class="info-section">
                    <h4>Trained Jobs</h4>
                    <div class="trait-list">
                        ${kemono.trainedJobs.map(job => `<span class="trait-tag">${job}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    modalFooter.innerHTML = `
        <button class="btn btn--secondary" onclick="closeModal()">Close</button>
        ${kemono.status === 'available' ? `
            <button class="btn btn--primary" onclick="selectForBreeding(${kemono.id})">Select for Breeding</button>
            <button class="btn btn--primary" onclick="selectForTraining(${kemono.id})">Start Training</button>
        ` : ''}
    `;
    
    kemonoModal.classList.remove('hidden');
};

window.closeModal = function() {
    kemonoModal.classList.add('hidden');
    jobModal.classList.add('hidden');
};

window.selectForBreeding = function(kemonoId) {
    const kemono = gameState.kemonomimi.find(k => k.id === kemonoId);
    if (!kemono || kemono.status !== 'available') return;
    
    if (!gameState.selectedParent1) {
        gameState.selectedParent1 = kemono;
    } else if (!gameState.selectedParent2 && kemono.id !== gameState.selectedParent1.id) {
        gameState.selectedParent2 = kemono;
    } else {
        // Replace parent1 if selecting different kemono
        gameState.selectedParent1 = kemono;
        gameState.selectedParent2 = null;
    }
    
    closeModal();
    updateBreedingSlots();
};

window.selectForTraining = function(kemonoId) {
    closeModal();
    // Show job selection modal
    const availableJobs = JOB_CATEGORIES.filter(job => gameState.coins >= job.training_cost);
    
    if (availableJobs.length === 0) {
        alert('Not enough coins for any training!');
        return;
    }
    
    jobSelection.innerHTML = `
        <h4>Select Training Job</h4>
        <div class="job-selection-grid" style="display: grid; gap: 16px;">
            ${availableJobs.map(job => `
                <div class="job-option card" onclick="startTraining(${kemonoId}, '${job.name}')" style="cursor: pointer; padding: 16px;">
                    <h5>${job.name}</h5>
                    <p>${job.description}</p>
                    <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                        <div class="job-cost">Cost: ${job.training_cost} coins</div>
                        <div class="job-duration">Duration: ${job.training_time} days</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    jobModal.classList.remove('hidden');
};

window.startTraining = function(kemonoId, jobName) {
    const kemono = gameState.kemonomimi.find(k => k.id === kemonoId);
    const job = JOB_CATEGORIES.find(j => j.name === jobName);
    
    if (!kemono || kemono.status !== 'available' || gameState.coins < job.training_cost) return;
    
    gameState.coins -= job.training_cost;
    kemono.status = 'training';
    
    const trainingProject = {
        kemono: kemono,
        job: job,
        startDay: gameState.day,
        duration: job.training_time,
        id: Date.now()
    };
    
    gameState.trainingQueue.push(trainingProject);
    
    closeModal();
    updateDisplay();
    updateTrainingProgress();
};

window.selectJob = function(jobName) {
    const availableKemonomimi = gameState.kemonomimi.filter(k => k.status === 'available');
    
    if (availableKemonomimi.length === 0) {
        alert('No available kemonomimi for training!');
        return;
    }
    
    const job = JOB_CATEGORIES.find(j => j.name === jobName);
    
    jobSelection.innerHTML = `
        <h4>Select Kemonomimi for ${jobName}</h4>
        <p><strong>Cost:</strong> ${job.training_cost} coins | <strong>Duration:</strong> ${job.training_time} days</p>
        <p><strong>Required Stats:</strong> ${job.required_stats.join(', ')}</p>
        
        <div class="kemono-selection" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px;">
            ${availableKemonomimi.map(kemono => {
                const suitability = calculateJobSuitability(kemono, job);
                const suitabilityClass = suitability >= 70 ? 'excellent' : suitability >= 50 ? 'good' : 'poor';
                
                return `
                    <div class="kemono-option card" onclick="startTraining(${kemono.id}, '${jobName}')" style="cursor: pointer; text-align: center; padding: 16px;">
                        <div class="kemono-avatar" style="font-size: 2rem; margin-bottom: 8px;">${kemono.type.emoji}</div>
                        <h5>${kemono.name}</h5>
                        <p>${kemono.type.name}</p>
                        <div class="suitability ${suitabilityClass}" style="margin-top: 8px; padding: 4px 8px; border-radius: 4px; font-size: 12px; background: var(--color-secondary);">
                            Suitability: ${suitability}%
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    jobModal.classList.remove('hidden');
};

window.buyKemono = function(kemonoId) {
    const kemono = gameState.marketStock.find(k => k.id === kemonoId);
    if (!kemono || gameState.coins < kemono.price) return;
    
    gameState.coins -= kemono.price;
    gameState.kemonomimi.push(kemono);
    gameState.marketStock = gameState.marketStock.filter(k => k.id !== kemonoId);
    
    updateDisplay();
    renderBuyMarket();
};

window.sellKemono = function(kemonoId) {
    const kemono = gameState.kemonomimi.find(k => k.id === kemonoId);
    if (!kemono || kemono.status !== 'available') return;
    
    const sellPrice = gameState.calculateSellPrice(kemono);
    gameState.coins += sellPrice;
    gameState.kemonomimi = gameState.kemonomimi.filter(k => k.id !== kemonoId);
    
    updateDisplay();
    renderSellMarket();
};

window.refreshMarket = function() {
    gameState.generateMarketStock();
    renderBuyMarket();
};

window.switchMarketTab = function(tab) {
    const buyTab = document.getElementById('buy-tab-btn');
    const sellTab = document.getElementById('sell-tab-btn');
    const buyMarket = document.getElementById('buy-market');
    const sellMarket = document.getElementById('sell-market');
    
    if (tab === 'buy') {
        buyTab.classList.add('active');
        sellTab.classList.remove('active');
        buyMarket.classList.remove('hidden');
        sellMarket.classList.add('hidden');
    } else {
        sellTab.classList.add('active');
        buyTab.classList.remove('active');
        sellMarket.classList.remove('hidden');
        buyMarket.classList.add('hidden');
    }
};

window.startBreeding = function() {
    if (!gameState.selectedParent1 || !gameState.selectedParent2 || gameState.coins < 200) return;
    
    gameState.coins -= 200;
    gameState.selectedParent1.status = 'breeding';
    gameState.selectedParent2.status = 'breeding';
    
    const breedingProject = {
        parent1: gameState.selectedParent1,
        parent2: gameState.selectedParent2,
        startDay: gameState.day,
        duration: 5,
        id: Date.now()
    };
    
    gameState.breedingQueue.push(breedingProject);
    gameState.selectedParent1 = null;
    gameState.selectedParent2 = null;
    
    updateDisplay();
    updateBreedingSlots();
    updateBreedingQueue();
};

// Game Management
function updateDisplay() {
    coinsDisplay.textContent = gameState.coins;
    dayDisplay.textContent = gameState.day;
    collectionCountDisplay.textContent = gameState.kemonomimi.length;
}

function showTab(tabName) {
    // Update tab buttons
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab panels
    tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === tabName + '-tab');
    });
    
    // Refresh content based on active tab
    switch(tabName) {
        case 'collection':
            renderCollection();
            break;
        case 'breeding':
            renderBreeding();
            break;
        case 'training':
            renderTraining();
            break;
        case 'marketplace':
            renderMarketplace();
            break;
        case 'family-tree':
            renderFamilyTree();
            break;
    }
}

// Collection Rendering
function renderCollection() {
    collectionGrid.innerHTML = '';
    
    gameState.kemonomimi.forEach(kemono => {
        const card = createKemonoCard(kemono);
        collectionGrid.appendChild(card);
    });
}

function createKemonoCard(kemono) {
    const card = document.createElement('div');
    card.className = 'kemono-card';
    
    const statusClass = kemono.status === 'available' ? 'status-available' : 
                       kemono.status === 'training' ? 'status-training' : 'status-breeding';
    
    card.innerHTML = `
        <div class="kemono-header">
            <h3 class="kemono-name">${kemono.name}</h3>
            <span class="kemono-type">${kemono.type.name}</span>
        </div>
        <div class="kemono-avatar">${kemono.type.emoji}</div>
        <div class="kemono-stats">
            <div class="stat-row">
                <span class="stat-name">STR</span>
                <span class="stat-value">${kemono.stats.strength}</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">AGI</span>
                <span class="stat-value">${kemono.stats.agility}</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">INT</span>
                <span class="stat-value">${kemono.stats.intelligence}</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">CHA</span>
                <span class="stat-value">${kemono.stats.charisma}</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">END</span>
                <span class="stat-value">${kemono.stats.endurance}</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">LOY</span>
                <span class="stat-value">${kemono.stats.loyalty}</span>
            </div>
        </div>
        <div class="kemono-status ${statusClass}">
            ${kemono.status.charAt(0).toUpperCase() + kemono.status.slice(1)}
        </div>
    `;
    
    // Add click event listener
    card.addEventListener('click', () => showKemonoDetails(kemono));
    
    return card;
}

// Breeding System
function renderBreeding() {
    updateBreedingSlots();
    updateBreedingQueue();
}

function updateBreedingSlots() {
    const parent1Slot = document.getElementById('parent1-slot');
    const parent2Slot = document.getElementById('parent2-slot');
    const breedBtn = document.getElementById('breed-btn');
    
    if (gameState.selectedParent1) {
        parent1Slot.innerHTML = createMiniKemonoCard(gameState.selectedParent1);
        parent1Slot.classList.add('selected');
    } else {
        parent1Slot.innerHTML = '<p>Select a kemonomimi</p>';
        parent1Slot.classList.remove('selected');
    }
    
    if (gameState.selectedParent2) {
        parent2Slot.innerHTML = createMiniKemonoCard(gameState.selectedParent2);
        parent2Slot.classList.add('selected');
    } else {
        parent2Slot.innerHTML = '<p>Select a kemonomimi</p>';
        parent2Slot.classList.remove('selected');
    }
    
    breedBtn.disabled = !gameState.selectedParent1 || !gameState.selectedParent2 || gameState.coins < 200;
}

function createMiniKemonoCard(kemono) {
    return `
        <div class="mini-kemono-card">
            <div class="kemono-avatar" style="width: 60px; height: 60px; font-size: 1.5rem;">${kemono.type.emoji}</div>
            <h4>${kemono.name}</h4>
            <p>${kemono.type.name}</p>
        </div>
    `;
}

function updateBreedingQueue() {
    const queueList = document.getElementById('queue-list');
    
    if (gameState.breedingQueue.length === 0) {
        queueList.innerHTML = '<p>No active breeding projects</p>';
        return;
    }
    
    queueList.innerHTML = gameState.breedingQueue.map(project => {
        const daysLeft = project.duration - (gameState.day - project.startDay);
        const progress = Math.max(0, ((gameState.day - project.startDay) / project.duration) * 100);
        
        return `
            <div class="progress-item">
                <div class="progress-info">
                    <p class="progress-name">${project.parent1.name} × ${project.parent2.name}</p>
                    <p class="progress-job">Breeding in progress</p>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                <div class="progress-time">${Math.max(0, daysLeft)} days left</div>
            </div>
        `;
    }).join('');
}

// Training System
function renderTraining() {
    renderJobList();
    updateTrainingProgress();
}

function renderJobList() {
    const jobList = document.getElementById('job-list');
    
    jobList.innerHTML = JOB_CATEGORIES.map(job => `
        <div class="job-card" onclick="selectJob('${job.name}')">
            <div class="job-header">
                <h4 class="job-name">${job.name}</h4>
                <p class="job-description">${job.description}</p>
            </div>
            <div class="job-requirements">
                ${job.required_stats.map(stat => `<span class="requirement-tag">${stat}</span>`).join('')}
            </div>
            <div class="job-details">
                <div class="job-detail">
                    <span class="job-detail-label">Cost</span>
                    <span class="job-detail-value">${job.training_cost}</span>
                </div>
                <div class="job-detail">
                    <span class="job-detail-label">Time</span>
                    <span class="job-detail-value">${job.training_time}d</span>
                </div>
                <div class="job-detail">
                    <span class="job-detail-label">Value</span>
                    <span class="job-detail-value">${job.salary_multiplier}x</span>
                </div>
            </div>
        </div>
    `).join('');
}

function calculateJobSuitability(kemono, job) {
    let totalRelevantStats = 0;
    let maxPossible = 0;
    
    job.required_stats.forEach(stat => {
        totalRelevantStats += kemono.stats[stat];
        maxPossible += 100;
    });
    
    // Add type bonuses
    const typeBonus = kemono.type.job_bonuses[job.name.toLowerCase().replace(' ', '')] || 0;
    
    const base = (totalRelevantStats / maxPossible) * 100;
    return Math.min(100, Math.round(base + typeBonus));
}

function updateTrainingProgress() {
    const trainingProgress = document.getElementById('training-progress');
    
    if (gameState.trainingQueue.length === 0) {
        trainingProgress.innerHTML = '<p>No kemonomimi currently training</p>';
        return;
    }
    
    trainingProgress.innerHTML = gameState.trainingQueue.map(project => {
        const daysLeft = project.duration - (gameState.day - project.startDay);
        const progress = Math.max(0, ((gameState.day - project.startDay) / project.duration) * 100);
        
        return `
            <div class="progress-item">
                <div class="progress-info">
                    <p class="progress-name">${project.kemono.name}</p>
                    <p class="progress-job">${project.job.name}</p>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                <div class="progress-time">${Math.max(0, daysLeft)} days left</div>
            </div>
        `;
    }).join('');
}

// Marketplace System
function renderMarketplace() {
    renderBuyMarket();
    renderSellMarket();
}

function renderBuyMarket() {
    const buyMarket = document.getElementById('buy-market');
    
    buyMarket.innerHTML = gameState.marketStock.map(kemono => `
        <div class="market-card">
            ${createKemonoCard(kemono).outerHTML}
            <div class="market-price">
                <span class="price-value">${kemono.price} coins</span>
                <button class="btn btn--primary" onclick="buyKemono(${kemono.id})" 
                        ${gameState.coins < kemono.price ? 'disabled' : ''}>
                    Buy
                </button>
            </div>
        </div>
    `).join('');
}

function renderSellMarket() {
    const sellMarket = document.getElementById('sell-market');
    const sellableKemonomimi = gameState.kemonomimi.filter(k => k.status === 'available');
    
    sellMarket.innerHTML = sellableKemonomimi.map(kemono => {
        const sellPrice = gameState.calculateSellPrice(kemono);
        return `
            <div class="market-card">
                ${createKemonoCard(kemono).outerHTML}
                <div class="market-price">
                    <span class="price-value">${sellPrice} coins</span>
                    <button class="btn btn--primary" onclick="sellKemono(${kemono.id})">
                        Sell
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Family Tree
function renderFamilyTree() {
    const display = document.getElementById('family-tree-display');
    const families = buildFamilyTree();
    
    if (families.length === 0) {
        display.innerHTML = '<p>Your kemonomimi family lineages will appear here as you breed them.</p>';
        return;
    }
    
    display.innerHTML = families.map(family => `
        <div class="family-branch">
            <h4>Family Line</h4>
            ${renderFamilyBranch(family)}
        </div>
    `).join('');
}

function buildFamilyTree() {
    // Simple family tree implementation
    const families = [];
    const processed = new Set();
    
    gameState.kemonomimi.forEach(kemono => {
        if (!processed.has(kemono.id) && kemono.parents) {
            const family = collectFamily(kemono, processed);
            if (family.length > 1) families.push(family);
        }
    });
    
    return families;
}

function collectFamily(kemono, processed) {
    const family = [kemono];
    processed.add(kemono.id);
    
    // Add children
    gameState.kemonomimi.forEach(k => {
        if (k.parents && k.parents.includes(kemono.id) && !processed.has(k.id)) {
            family.push(...collectFamily(k, processed));
        }
    });
    
    return family;
}

function renderFamilyBranch(family) {
    return family.map(kemono => `
        <div class="family-node">
            <div>${kemono.type.emoji}</div>
            <div>${kemono.name}</div>
            <div>${kemono.type.name}</div>
        </div>
    `).join('');
}

// Time Progression
function advanceDay() {
    gameState.day++;
    
    // Process breeding queue
    gameState.breedingQueue = gameState.breedingQueue.filter(project => {
        if (gameState.day - project.startDay >= project.duration) {
            // Breeding complete
            const offspring = gameState.createRandomKemonomimi(project.parent1, project.parent2);
            gameState.kemonomimi.push(offspring);
            
            project.parent1.status = 'available';
            project.parent2.status = 'available';
            project.parent1.children.push(offspring.id);
            project.parent2.children.push(offspring.id);
            
            return false; // Remove from queue
        }
        return true;
    });
    
    // Process training queue
    gameState.trainingQueue = gameState.trainingQueue.filter(project => {
        if (gameState.day - project.startDay >= project.duration) {
            // Training complete
            project.kemono.status = 'available';
            project.kemono.trainedJobs.push(project.job.name);
            
            // Slight stat improvement
            project.job.required_stats.forEach(stat => {
                project.kemono.stats[stat] = Math.min(100, project.kemono.stats[stat] + Math.floor(Math.random() * 3) + 1);
            });
            
            return false; // Remove from queue
        }
        return true;
    });
    
    // Random market refresh
    if (Math.random() < 0.3) {
        gameState.generateMarketStock();
    }
    
    updateDisplay();
    updateBreedingQueue();
    updateTrainingProgress();
    if (document.getElementById('marketplace-tab').classList.contains('active')) {
        renderBuyMarket();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => showTab(btn.dataset.tab));
    });
    
    // Modal controls
    closeModalBtn.addEventListener('click', closeModal);
    closeJobModalBtn.addEventListener('click', closeModal);
    
    // Breeding
    document.getElementById('breed-btn').addEventListener('click', startBreeding);
    
    // Marketplace
    document.getElementById('refresh-market-btn').addEventListener('click', refreshMarket);
    document.getElementById('buy-tab-btn').addEventListener('click', () => switchMarketTab('buy'));
    document.getElementById('sell-tab-btn').addEventListener('click', () => switchMarketTab('sell'));
    
    // Time progression (every 3 seconds for demo)
    setInterval(advanceDay, 3000);
    
    // Initialize display
    updateDisplay();
    showTab('collection');
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === kemonoModal || event.target === jobModal) {
        closeModal();
    }
});