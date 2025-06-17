// Magical Girl Simulator - Game Logic

// Game State
let gameState = {
    resources: {
        gold: 1000,
        magicalCrystals: 500,
        friendshipPoints: 1000
    },
    magicalGirls: [],
    availableGirls: [],
    missions: [],
    stats: {
        missionsCompleted: 0,
        trainingSessions: 0
    }
};

// Initialize game data
const initialData = {
    "initialMagicalGirls": [
        {
            "id": 1,
            "name": "Luna Stardust",
            "rarity": 4,
            "element": "Moon",
            "hp": 850,
            "magicPower": 920,
            "defense": 780,
            "agility": 850,
            "luck": 780,
            "level": 1,
            "experience": 0,
            "abilities": ["Moonbeam Blast", "Lunar Healing", "Starlight Shield"],
            "description": "A legendary magical girl who draws power from the moon and stars.",
            "preferredMissions": ["Combat", "Defense"]
        },
        {
            "id": 2,
            "name": "Sakura Blossom",
            "rarity": 3,
            "element": "Nature",
            "hp": 720,
            "magicPower": 680,
            "defense": 650,
            "agility": 720,
            "luck": 680,
            "level": 1,
            "experience": 0,
            "abilities": ["Petal Storm", "Nature's Embrace", "Cherry Blossom Dance"],
            "description": "A nature-loving magical girl with the power of cherry blossoms.",
            "preferredMissions": ["Rescue", "Investigation"]
        },
        {
            "id": 3,
            "name": "Crystal Heart",
            "rarity": 2,
            "element": "Love",
            "hp": 680,
            "magicPower": 520,
            "defense": 620,
            "agility": 580,
            "luck": 560,
            "level": 1,
            "experience": 0,
            "abilities": ["Heart Beam", "Love Shield", "Friendship Power"],
            "description": "A caring magical girl who fights with the power of love and friendship.",
            "preferredMissions": ["Rescue", "Defense"]
        }
    ],
    "availableMagicalGirls": [
        {
            "id": 4,
            "name": "Ember Phoenix",
            "rarity": 3,
            "element": "Fire",
            "hp": 700,
            "magicPower": 780,
            "defense": 600,
            "agility": 720,
            "luck": 640,
            "level": 1,
            "experience": 0,
            "abilities": ["Phoenix Fire", "Flame Tornado", "Rising Phoenix"],
            "description": "A fiery magical girl with the spirit of a phoenix.",
            "preferredMissions": ["Combat", "Investigation"]
        },
        {
            "id": 5,
            "name": "Aqua Marine",
            "rarity": 2,
            "element": "Water",
            "hp": 650,
            "magicPower": 580,
            "defense": 720,
            "agility": 520,
            "luck": 580,
            "level": 1,
            "experience": 0,
            "abilities": ["Aqua Splash", "Tidal Wave", "Water Barrier"],
            "description": "A calm magical girl who controls the power of water.",
            "preferredMissions": ["Defense", "Rescue"]
        },
        {
            "id": 6,
            "name": "Wind Dancer",
            "rarity": 1,
            "element": "Air",
            "hp": 480,
            "magicPower": 520,
            "defense": 420,
            "agility": 680,
            "luck": 480,
            "level": 1,
            "experience": 0,
            "abilities": ["Wind Slash", "Tornado Spin", "Breeze Step"],
            "description": "A swift magical girl who dances with the wind.",
            "preferredMissions": ["Investigation", "Combat"]
        },
        {
            "id": 7,
            "name": "Star Shooter",
            "rarity": 1,
            "element": "Light",
            "hp": 520,
            "magicPower": 580,
            "defense": 480,
            "agility": 520,
            "luck": 520,
            "level": 1,
            "experience": 0,
            "abilities": ["Star Bolt", "Light Beam", "Radiant Burst"],
            "description": "A bright magical girl who shoots stars of light.",
            "preferredMissions": ["Combat", "Investigation"]
        },
        {
            "id": 8,
            "name": "Shadow Mystic",
            "rarity": 3,
            "element": "Dark",
            "hp": 680,
            "magicPower": 720,
            "defense": 580,
            "agility": 780,
            "luck": 820,
            "level": 1,
            "experience": 0,
            "abilities": ["Shadow Strike", "Dark Veil", "Mystic Portal"],
            "description": "A mysterious magical girl who commands the shadows.",
            "preferredMissions": ["Investigation", "Combat"]
        }
    ],
    "missionTypes": [
        {
            "id": 1,
            "name": "Demon Patrol",
            "type": "Combat",
            "difficulty": "Easy",
            "duration": 1,
            "requirements": {"minLevel": 1, "minMagicPower": 400},
            "rewards": {"experience": 50, "gold": 100, "crystals": 5}
        },
        {
            "id": 2,
            "name": "Rescue Civilians",
            "type": "Rescue",
            "difficulty": "Normal",
            "duration": 2,
            "requirements": {"minLevel": 2, "minHP": 500},
            "rewards": {"experience": 80, "gold": 150, "crystals": 8}
        },
        {
            "id": 3,
            "name": "Investigate Dark Energy",
            "type": "Investigation",
            "difficulty": "Hard",
            "duration": 3,
            "requirements": {"minLevel": 3, "minLuck": 600},
            "rewards": {"experience": 120, "gold": 200, "crystals": 12}
        },
        {
            "id": 4,
            "name": "Defend the City",
            "type": "Defense",
            "difficulty": "Expert",
            "duration": 4,
            "requirements": {"minLevel": 4, "minDefense": 650},
            "rewards": {"experience": 180, "gold": 300, "crystals": 20}
        }
    ]
};

// Initialize game
function initializeGame() {
    gameState.magicalGirls = [...initialData.initialMagicalGirls];
    gameState.availableGirls = [...initialData.availableMagicalGirls];
    gameState.missions = [...initialData.missionTypes];
    
    updateResourceDisplay();
    updateDashboardStats();
    renderRoster();
    populateSelectors();
    renderMissions();
}

// Navigation
function switchScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected screen
    document.getElementById(`${screenName}-screen`).classList.add('active');
    
    // Add active class to clicked nav button
    document.querySelector(`[data-screen="${screenName}"]`).classList.add('active');
    
    // Refresh content if needed
    if (screenName === 'roster') {
        renderRoster();
    } else if (screenName === 'training') {
        populateSelectors();
        updateTrainingPanel(); // Make sure training panel is updated
    } else if (screenName === 'missions') {
        populateSelectors();
        renderMissions();
    }
}

// Event listeners for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchScreen(e.target.dataset.screen);
        });
    });
    
    // Training girl selector
    const trainingSelect = document.getElementById('training-girl-select');
    if (trainingSelect) {
        trainingSelect.addEventListener('change', updateTrainingPanel);
    }
    
    // Mission girl selector
    const missionSelect = document.getElementById('mission-girl-select');
    if (missionSelect) {
        missionSelect.addEventListener('change', renderMissions);
    }
    
    // Rarity filter
    const rarityFilter = document.getElementById('rarity-filter');
    if (rarityFilter) {
        rarityFilter.addEventListener('change', renderRoster);
    }
    
    // Training buttons - use event delegation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('train-btn')) {
            const stat = e.target.dataset.stat;
            const selectElement = document.getElementById('training-girl-select');
            const girlId = parseInt(selectElement.value);
            if (girlId && !isNaN(girlId)) {
                trainStat(girlId, stat);
            } else {
                alert('Please select a magical girl first!');
            }
        }
    });
    
    initializeGame();
});

// Update resource display
function updateResourceDisplay() {
    document.getElementById('gold-amount').textContent = gameState.resources.gold;
    document.getElementById('crystals-amount').textContent = gameState.resources.magicalCrystals;
    document.getElementById('friendship-amount').textContent = gameState.resources.friendshipPoints;
}

// Update dashboard stats
function updateDashboardStats() {
    document.getElementById('total-girls').textContent = gameState.magicalGirls.length;
    document.getElementById('missions-completed').textContent = gameState.stats.missionsCompleted;
    document.getElementById('training-completed').textContent = gameState.stats.trainingSessions;
}

// Render roster
function renderRoster() {
    const rosterGrid = document.getElementById('roster-grid');
    const rarityFilter = document.getElementById('rarity-filter').value;
    
    let filteredGirls = gameState.magicalGirls;
    if (rarityFilter !== 'all') {
        filteredGirls = gameState.magicalGirls.filter(girl => girl.rarity === parseInt(rarityFilter));
    }
    
    rosterGrid.innerHTML = filteredGirls.map(girl => `
        <div class="magical-girl-card" onclick="showCharacterDetails(${girl.id})">
            <div class="card-header">
                <div class="girl-name">${girl.name}</div>
                <div class="rarity-stars">${'★'.repeat(girl.rarity)}</div>
            </div>
            <div class="element-badge element-${girl.element}">${girl.element}</div>
            <div class="stats-mini">
                <div class="stat-mini">
                    <span class="label">HP:</span>
                    <span class="value">${girl.hp}</span>
                </div>
                <div class="stat-mini">
                    <span class="label">Magic:</span>
                    <span class="value">${girl.magicPower}</span>
                </div>
                <div class="stat-mini">
                    <span class="label">Defense:</span>
                    <span class="value">${girl.defense}</span>
                </div>
                <div class="stat-mini">
                    <span class="label">Level:</span>
                    <span class="value">${girl.level}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Show character details modal
function showCharacterDetails(girlId) {
    const girl = gameState.magicalGirls.find(g => g.id === girlId);
    if (!girl) return;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3>${girl.name}</h3>
        <div class="rarity-stars">${'★'.repeat(girl.rarity)}</div>
        <div class="element-badge element-${girl.element}">${girl.element}</div>
        <p>${girl.description}</p>
        
        <div class="stats-display">
            <div class="stat-item">
                <span class="stat-label">HP:</span>
                <span class="stat-value">${girl.hp}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Magic Power:</span>
                <span class="stat-value">${girl.magicPower}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Defense:</span>
                <span class="stat-value">${girl.defense}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Agility:</span>
                <span class="stat-value">${girl.agility}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Luck:</span>
                <span class="stat-value">${girl.luck}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Level:</span>
                <span class="stat-value">${girl.level}</span>
            </div>
        </div>
        
        <div class="abilities-list">
            <h4>Special Abilities:</h4>
            ${girl.abilities.map(ability => `<div class="ability">${ability}</div>`).join('')}
        </div>
    `;
    
    document.getElementById('character-modal').classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('character-modal').classList.add('hidden');
}

// Populate selectors
function populateSelectors() {
    const trainingSelect = document.getElementById('training-girl-select');
    const missionSelect = document.getElementById('mission-girl-select');
    
    const options = gameState.magicalGirls.map(girl => 
        `<option value="${girl.id}">${girl.name} (Lv.${girl.level})</option>`
    ).join('');
    
    if (trainingSelect) {
        trainingSelect.innerHTML = '<option value="">Select a magical girl...</option>' + options;
    }
    if (missionSelect) {
        missionSelect.innerHTML = '<option value="">Select a magical girl...</option>' + options;
    }
}

// Update training panel
function updateTrainingPanel() {
    const selectElement = document.getElementById('training-girl-select');
    if (!selectElement || !selectElement.value) {
        document.getElementById('training-girl-name').textContent = 'Select a magical girl';
        // Hide stats or show default values
        document.getElementById('training-hp').textContent = '0';
        document.getElementById('training-magicPower').textContent = '0';
        document.getElementById('training-defense').textContent = '0';
        document.getElementById('training-agility').textContent = '0';
        document.getElementById('training-luck').textContent = '0';
        return;
    }
    
    const girlId = parseInt(selectElement.value);
    const girl = gameState.magicalGirls.find(g => g.id === girlId);
    
    if (!girl) {
        document.getElementById('training-girl-name').textContent = 'Select a magical girl';
        return;
    }
    
    document.getElementById('training-girl-name').textContent = girl.name;
    document.getElementById('training-hp').textContent = girl.hp;
    document.getElementById('training-magicPower').textContent = girl.magicPower;
    document.getElementById('training-defense').textContent = girl.defense;
    document.getElementById('training-agility').textContent = girl.agility;
    document.getElementById('training-luck').textContent = girl.luck;
}

// Train stat
function trainStat(girlId, stat) {
    const girl = gameState.magicalGirls.find(g => g.id === girlId);
    if (!girl) {
        alert('Magical girl not found!');
        return;
    }
    
    const cost = 50;
    if (gameState.resources.gold < cost) {
        alert('Not enough gold for training! You need 50 gold.');
        return;
    }
    
    gameState.resources.gold -= cost;
    const increase = Math.floor(Math.random() * 20) + 10; // 10-30 increase
    girl[stat] += increase;
    
    // Check for level up
    girl.experience += 10;
    const expNeeded = girl.level * 100;
    if (girl.experience >= expNeeded) {
        girl.level++;
        girl.experience = 0;
        alert(`🎉 ${girl.name} leveled up to Level ${girl.level}!`);
    }
    
    gameState.stats.trainingSessions++;
    
    updateResourceDisplay();
    updateTrainingPanel();
    updateDashboardStats();
    populateSelectors(); // Update selectors to show new level
    
    // Show training success message
    alert(`✨ ${girl.name}'s ${stat} increased by ${increase}! (-50 gold)`);
    
    // Visual feedback
    const button = document.querySelector(`[data-stat="${stat}"]`);
    if (button) {
        button.style.transform = 'scale(1.2)';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.background = 'linear-gradient(135deg, var(--color-magical-pink), var(--color-magical-purple))';
        }, 300);
    }
}

// Render missions
function renderMissions() {
    const selectElement = document.getElementById('mission-girl-select');
    const missionsList = document.getElementById('missions-list');
    
    if (!selectElement || !selectElement.value) {
        missionsList.innerHTML = '<p>Select a magical girl to see available missions.</p>';
        return;
    }
    
    const girlId = parseInt(selectElement.value);
    const girl = gameState.magicalGirls.find(g => g.id === girlId);
    
    if (!girl) {
        missionsList.innerHTML = '<p>Select a magical girl to see available missions.</p>';
        return;
    }
    
    missionsList.innerHTML = gameState.missions.map(mission => {
        const canAttempt = checkMissionRequirements(girl, mission);
        const buttonClass = canAttempt ? 'btn btn--primary' : 'btn btn--outline';
        const buttonText = canAttempt ? 'Start Mission' : 'Requirements not met';
        
        return `
            <div class="mission-card">
                <div class="mission-info">
                    <h4>${mission.name}</h4>
                    <div>
                        <span class="mission-type">${mission.type}</span>
                        <span class="mission-difficulty">${mission.difficulty}</span>
                    </div>
                    <div class="mission-requirements">
                        ${Object.entries(mission.requirements).map(([key, value]) => {
                            const girlStat = key.replace('min', '').toLowerCase();
                            const girlValue = girl[girlStat] || 0;
                            const meets = girlValue >= value;
                            return `${key.replace('min', '')}: ${value} ${meets ? '✅' : '❌'} (${girlValue})`;
                        }).join(', ')}
                    </div>
                    <div class="mission-rewards">
                        <span class="reward">💫 ${mission.rewards.experience} EXP</span>
                        <span class="reward">💰 ${mission.rewards.gold} Gold</span>
                        <span class="reward">💎 ${mission.rewards.crystals} Crystals</span>
                    </div>
                </div>
                <button class="${buttonClass}" onclick="startMission(${mission.id}, ${girl.id})" ${canAttempt ? '' : 'disabled'}>
                    ${buttonText}
                </button>
            </div>
        `;
    }).join('');
}

// Check mission requirements
function checkMissionRequirements(girl, mission) {
    const req = mission.requirements;
    return Object.entries(req).every(([key, value]) => {
        const girlStat = key.replace('min', '').toLowerCase();
        return (girl[girlStat] || 0) >= value;
    });
}

// Start mission
function startMission(missionId, girlId) {
    const mission = gameState.missions.find(m => m.id === missionId);
    const girl = gameState.magicalGirls.find(g => g.id === girlId);
    
    if (!mission || !girl) return;
    
    // Calculate success rate based on girl's stats vs requirements
    const successRate = calculateSuccessRate(girl, mission);
    const success = Math.random() < successRate;
    
    let resultMessage = `<h3>Mission: ${mission.name}</h3>`;
    resultMessage += `<p><strong>${girl.name}</strong> has returned from the mission!</p>`;
    
    if (success) {
        // Grant rewards
        gameState.resources.gold += mission.rewards.gold;
        gameState.resources.magicalCrystals += mission.rewards.crystals;
        girl.experience += mission.rewards.experience;
        
        // Check for level up
        const expNeeded = girl.level * 100;
        if (girl.experience >= expNeeded) {
            girl.level++;
            girl.experience = 0;
            resultMessage += `<p class="success">🎉 ${girl.name} leveled up to Level ${girl.level}!</p>`;
        }
        
        gameState.stats.missionsCompleted++;
        
        resultMessage += `<p class="success">✅ Mission Successful!</p>`;
        resultMessage += `<div class="mission-rewards">`;
        resultMessage += `<div>💫 +${mission.rewards.experience} Experience</div>`;
        resultMessage += `<div>💰 +${mission.rewards.gold} Gold</div>`;
        resultMessage += `<div>💎 +${mission.rewards.crystals} Crystals</div>`;
        resultMessage += `</div>`;
    } else {
        resultMessage += `<p class="error">❌ Mission Failed!</p>`;
        resultMessage += `<p>Better luck next time. Try training your magical girl more!</p>`;
    }
    
    showMissionResult(resultMessage);
    updateResourceDisplay();
    updateDashboardStats();
    populateSelectors(); // Update selectors to show new level
    renderMissions(); // Refresh missions to show updated requirements
}

// Calculate success rate
function calculateSuccessRate(girl, mission) {
    const req = mission.requirements;
    let totalOverage = 0;
    let requirements = 0;
    
    Object.entries(req).forEach(([key, value]) => {
        const girlStat = key.replace('min', '').toLowerCase();
        const girlValue = girl[girlStat] || 0;
        const overage = (girlValue - value) / value;
        totalOverage += Math.max(0, overage);
        requirements++;
    });
    
    const baseRate = 0.5; // 50% base success rate
    const bonusRate = Math.min(0.4, totalOverage / requirements); // Up to 40% bonus
    return Math.min(0.95, baseRate + bonusRate); // Max 95% success rate
}

// Show mission result
function showMissionResult(message) {
    document.getElementById('mission-result-body').innerHTML = message;
    document.getElementById('mission-result-modal').classList.remove('hidden');
}

// Close mission result modal
function closeMissionResult() {
    document.getElementById('mission-result-modal').classList.add('hidden');
}

// Perform summon
function performSummon(type) {
    let cost, currency;
    
    if (type === 'friendship') {
        cost = 100;
        currency = 'friendshipPoints';
    } else {
        cost = 50;
        currency = 'magicalCrystals';
    }
    
    if (gameState.resources[currency] < cost) {
        alert(`Not enough ${currency.replace(/([A-Z])/g, ' $1').toLowerCase()}!`);
        return;
    }
    
    gameState.resources[currency] -= cost;
    
    // Determine rarity based on summon type
    let rarityWeights;
    if (type === 'friendship') {
        rarityWeights = {1: 0.7, 2: 0.25, 3: 0.05, 4: 0.001}; // Mostly common
    } else {
        rarityWeights = {1: 0.4, 2: 0.35, 3: 0.2, 4: 0.05}; // Better rates
    }
    
    const rarity = weightedRandomSelect(rarityWeights);
    const availableGirls = gameState.availableGirls.filter(g => g.rarity === rarity);
    
    if (availableGirls.length === 0) {
        alert('No more magical girls available of this rarity!');
        gameState.resources[currency] += cost; // Refund
        return;
    }
    
    const selectedGirl = availableGirls[Math.floor(Math.random() * availableGirls.length)];
    
    // Remove from available and add to roster
    gameState.availableGirls = gameState.availableGirls.filter(g => g.id !== selectedGirl.id);
    gameState.magicalGirls.push({...selectedGirl});
    
    // Show result
    const resultDiv = document.getElementById('summon-result');
    resultDiv.innerHTML = `
        <h3>✨ Summoning Complete! ✨</h3>
        <div class="magical-girl-card" style="display: inline-block; margin: 20px;">
            <div class="card-header">
                <div class="girl-name">${selectedGirl.name}</div>
                <div class="rarity-stars">${'★'.repeat(selectedGirl.rarity)}</div>
            </div>
            <div class="element-badge element-${selectedGirl.element}">${selectedGirl.element}</div>
            <p>${selectedGirl.description}</p>
        </div>
    `;
    resultDiv.classList.remove('hidden');
    resultDiv.classList.add('success');
    
    setTimeout(() => {
        resultDiv.classList.remove('success');
    }, 3000);
    
    updateResourceDisplay();
    updateDashboardStats();
    populateSelectors();
}

// Weighted random selection
function weightedRandomSelect(weights) {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [value, weight] of Object.entries(weights)) {
        random -= weight;
        if (random <= 0) {
            return parseInt(value);
        }
    }
    
    return parseInt(Object.keys(weights)[0]); // Fallback
}