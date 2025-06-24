// Game State Management
class GameState {
    constructor() {
        this.character = {
            name: '',
            level: 1,
            totalXp: 0,
            attributes: {
                strength: 10,
                dexterity: 10,
                intelligence: 10,
                constitution: 10
            },
            skills: {
                Combat: {
                    'Melee Combat': { level: 1, xp: 0, maxXp: 100 },
                    'Ranged Combat': { level: 1, xp: 0, maxXp: 100 },
                    'Magic': { level: 1, xp: 0, maxXp: 100 },
                    'Defense': { level: 1, xp: 0, maxXp: 100 }
                },
                Crafting: {
                    'Smithing': { level: 1, xp: 0, maxXp: 100 },
                    'Alchemy': { level: 1, xp: 0, maxXp: 100 },
                    'Tailoring': { level: 1, xp: 0, maxXp: 100 },
                    'Enchanting': { level: 1, xp: 0, maxXp: 100 }
                },
                Gathering: {
                    'Mining': { level: 1, xp: 0, maxXp: 100 },
                    'Herbalism': { level: 1, xp: 0, maxXp: 100 },
                    'Fishing': { level: 1, xp: 0, maxXp: 100 },
                    'Hunting': { level: 1, xp: 0, maxXp: 100 }
                },
                Social: {
                    'Leadership': { level: 1, xp: 0, maxXp: 100 },
                    'Trading': { level: 1, xp: 0, maxXp: 100 },
                    'Diplomacy': { level: 1, xp: 0, maxXp: 100 },
                    'Guild Management': { level: 1, xp: 0, maxXp: 100 }
                }
            }
        };
        
        this.resources = {
            gold: 1000,
            energy: 100,
            skillPoints: 10
        };
        
        this.inventory = {
            'Iron Ore': 5,
            'Mystic Herbs': 3,
            'Ancient Wood': 2,
            'Crystal Shards': 1
        };
        
        this.pvp = {
            rating: 1000,
            wins: 0,
            losses: 0,
            pkLevel: 0
        };
        
        this.guild = {
            name: null,
            level: 1,
            members: 1,
            treasury: 0,
            role: 'member'
        };
        
        this.currentLocation = 'Coastal Towns';
        this.currentSkillCategory = 'Combat';
        this.currentCraftingStation = 'smithy';
        
        this.marketItems = [
            { name: 'Iron Sword', price: 150, seller: 'PlayerBot1', category: 'weapons' },
            { name: 'Health Potion', price: 25, seller: 'PlayerBot2', category: 'consumables' },
            { name: 'Magic Robe', price: 300, seller: 'PlayerBot3', category: 'armor' },
            { name: 'Iron Ore', price: 10, seller: 'PlayerBot4', category: 'resources' }
        ];
        
        this.craftingRecipes = [
            { item: 'Iron Sword', materials: ['Iron Ore x3', 'Ancient Wood x1'], skillReq: 'Smithing 25', station: 'smithy' },
            { item: 'Health Potion', materials: ['Mystic Herbs x2', 'Crystal Shards x1'], skillReq: 'Alchemy 15', station: 'alchemy' },
            { item: 'Magic Robe', materials: ['Mystic Herbs x4', 'Crystal Shards x2'], skillReq: 'Tailoring 30', station: 'tailoring' },
            { item: 'Enchanted Gem', materials: ['Crystal Shards x3'], skillReq: 'Enchanting 20', station: 'enchanting' }
        ];
        
        this.activityFeed = ['Welcome to the MMORPG Sandbox!'];
        this.combatLog = ['Ready for combat...'];
        
        this.skillCategories = {
            Combat: { color: '#ff6b6b' },
            Crafting: { color: '#4ecdc4' },
            Gathering: { color: '#45b7d1' },
            Social: { color: '#96ceb4' }
        };
    }
    
    addActivity(message) {
        this.activityFeed.unshift(message);
        if (this.activityFeed.length > 50) {
            this.activityFeed.pop();
        }
        this.updateActivityFeed();
    }
    
    addCombatLog(message) {
        this.combatLog.push(message);
        if (this.combatLog.length > 20) {
            this.combatLog.shift();
        }
        this.updateCombatLog();
    }
    
    updateActivityFeed() {
        const feed = document.getElementById('activity-feed');
        if (feed) {
            feed.innerHTML = this.activityFeed.map(activity => 
                `<div class="activity-item">${activity}</div>`
            ).join('');
        }
    }
    
    updateCombatLog() {
        const log = document.querySelector('.combat-log');
        if (log) {
            log.innerHTML = this.combatLog.join('<br>');
            log.scrollTop = log.scrollHeight;
        }
    }
    
    gainSkillXp(category, skill, amount) {
        const skillData = this.character.skills[category][skill];
        skillData.xp += amount;
        
        while (skillData.xp >= skillData.maxXp) {
            skillData.xp -= skillData.maxXp;
            skillData.level++;
            skillData.maxXp = Math.floor(skillData.maxXp * 1.2);
            this.addActivity(`${skill} leveled up to ${skillData.level}!`);
            
            // Level up animation
            const skillElement = document.querySelector(`[data-skill="${skill}"]`);
            if (skillElement) {
                skillElement.classList.add('level-up-animation');
                setTimeout(() => skillElement.classList.remove('level-up-animation'), 500);
            }
        }
        
        this.character.totalXp += amount;
        this.updateSkillDisplay();
        this.updateHeader();
    }
    
    updateHeader() {
        const elements = {
            'character-display-name': this.character.name,
            'character-level': this.character.level,
            'total-xp': this.character.totalXp,
            'gold-count': this.resources.gold,
            'energy-count': this.resources.energy,
            'skill-points': this.resources.skillPoints
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    updateSkillDisplay() {
        this.renderSkills();
        this.updateDashboardStats();
    }
    
    updateDashboardStats() {
        const combatAvg = this.getAverageSkillLevel('Combat');
        const craftingAvg = this.getAverageSkillLevel('Crafting');
        
        const elements = {
            'combat-level': Math.floor(combatAvg),
            'crafting-level': Math.floor(craftingAvg),
            'pvp-rating': this.pvp.rating,
            'guild-rank': this.guild.name || 'None'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    getAverageSkillLevel(category) {
        const skills = this.character.skills[category];
        const levels = Object.values(skills).map(skill => skill.level);
        return levels.reduce((a, b) => a + b, 0) / levels.length;
    }
    
    renderSkills() {
        const skillTree = document.getElementById('skill-tree');
        if (!skillTree) return;
        
        const category = this.currentSkillCategory;
        const skills = this.character.skills[category];
        
        skillTree.innerHTML = '';
        
        Object.entries(skills).forEach(([skillName, skillData]) => {
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item';
            skillElement.dataset.skill = skillName;
            
            const progressPercent = (skillData.xp / skillData.maxXp) * 100;
            const upgradeCost = skillData.level;
            
            skillElement.innerHTML = `
                <div class="skill-header">
                    <span class="skill-name">${skillName}</span>
                    <span class="skill-level">Lv. ${skillData.level}</span>
                </div>
                <div class="skill-progress">
                    <div class="skill-progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="skill-actions">
                    <span class="skill-cost">Cost: ${upgradeCost} SP</span>
                    <button class="skill-upgrade-btn" ${this.resources.skillPoints < upgradeCost ? 'disabled' : ''}>
                        Upgrade
                    </button>
                </div>
            `;
            
            const upgradeBtn = skillElement.querySelector('.skill-upgrade-btn');
            upgradeBtn.addEventListener('click', () => {
                if (this.resources.skillPoints >= upgradeCost) {
                    this.resources.skillPoints -= upgradeCost;
                    this.gainSkillXp(category, skillName, skillData.maxXp);
                    this.addActivity(`Upgraded ${skillName} with skill points!`);
                }
            });
            
            skillTree.appendChild(skillElement);
        });
    }
}

// Initialize Game
const game = new GameState();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const characterCreationModal = document.getElementById('character-creation-modal');
    const gameInterface = document.getElementById('game-interface');
    const characterNameInput = document.getElementById('character-name');
    const createCharacterBtn = document.getElementById('create-character-btn');

    // Tab Navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Character Creation
    createCharacterBtn.addEventListener('click', () => {
        const name = characterNameInput.value.trim();
        if (name) {
            game.character.name = name;
            
            // Hide modal and show game interface
            characterCreationModal.style.display = 'none';
            gameInterface.classList.remove('hidden');
            gameInterface.style.display = 'flex';
            
            game.updateHeader();
            game.addActivity(`${name} has entered the world!`);
            initializeGame();
        } else {
            alert('Please enter a character name!');
        }
    });

    // Tab Navigation
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show target content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Initialize tab-specific content
            if (targetTab === 'skills') {
                game.renderSkills();
            } else if (targetTab === 'crafting') {
                renderCrafting();
            } else if (targetTab === 'market') {
                renderMarket();
            }
        });
    });

    // Skill Category Selection
    document.querySelectorAll('.skill-category').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.skill-category').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            game.currentSkillCategory = btn.dataset.category;
            game.renderSkills();
        });
    });

    // Crafting Station Selection
    document.querySelectorAll('.crafting-station').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.crafting-station').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            game.currentCraftingStation = btn.dataset.station;
            renderCrafting();
        });
    });

    // PvP System
    document.querySelectorAll('.zone-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const zone = btn.dataset.zone;
            game.addActivity(`Entered ${zone} combat zone`);
            game.addCombatLog(`Entered ${zone} - Looking for opponents...`);
            
            // Simulate finding opponent
            setTimeout(() => {
                const opponents = ['ShadowWarrior', 'MagicMaster', 'StealthRogue', 'HolyPaladin'];
                const opponent = opponents[Math.floor(Math.random() * opponents.length)];
                game.addCombatLog(`Found opponent: ${opponent}`);
            }, 1000);
        });
    });

    // Combat Actions
    const attackBtn = document.getElementById('attack-btn');
    const defendBtn = document.getElementById('defend-btn');
    const magicBtn = document.getElementById('magic-btn');

    if (attackBtn) {
        attackBtn.addEventListener('click', () => {
            const damage = Math.floor(Math.random() * 20) + 10;
            const enemyDamage = Math.floor(Math.random() * 15) + 5;
            
            game.addCombatLog(`You attack for ${damage} damage!`);
            game.addCombatLog(`Enemy attacks for ${enemyDamage} damage!`);
            
            const victory = Math.random() > 0.5;
            setTimeout(() => {
                if (victory) {
                    game.addCombatLog('Victory! You defeated your opponent!');
                    game.pvp.wins++;
                    game.pvp.rating += 25;
                    game.resources.gold += 50;
                    game.gainSkillXp('Combat', 'Melee Combat', 30);
                    game.addActivity('Won a PvP battle!');
                } else {
                    game.addCombatLog('Defeat! You were overwhelmed...');
                    game.pvp.losses++;
                    game.pvp.rating -= 15;
                    game.addActivity('Lost a PvP battle...');
                }
                updatePvPStats();
                game.updateHeader();
            }, 2000);
        });
    }

    if (defendBtn) {
        defendBtn.addEventListener('click', () => {
            game.addCombatLog('You raise your guard...');
            game.gainSkillXp('Combat', 'Defense', 20);
        });
    }

    if (magicBtn) {
        magicBtn.addEventListener('click', () => {
            const damage = Math.floor(Math.random() * 30) + 15;
            game.addCombatLog(`You cast a spell for ${damage} magical damage!`);
            game.gainSkillXp('Combat', 'Magic', 25);
        });
    }

    // Guild System
    const createGuildBtn = document.getElementById('create-guild-btn');
    const joinGuildBtn = document.getElementById('join-guild-btn');

    if (createGuildBtn) {
        createGuildBtn.addEventListener('click', () => {
            const guildName = prompt('Enter guild name:');
            if (guildName) {
                game.guild.name = guildName;
                game.guild.role = 'leader';
                game.addActivity(`Founded guild: ${guildName}`);
                renderGuildInterface();
            }
        });
    }

    if (joinGuildBtn) {
        joinGuildBtn.addEventListener('click', () => {
            const guilds = ['Shadow Clan', 'Light Brotherhood', 'Dragon Riders', 'Mystic Order'];
            const selectedGuild = guilds[Math.floor(Math.random() * guilds.length)];
            
            game.guild.name = selectedGuild;
            game.guild.members = Math.floor(Math.random() * 50) + 10;
            game.guild.treasury = Math.floor(Math.random() * 10000) + 1000;
            game.addActivity(`Joined guild: ${selectedGuild}`);
            renderGuildInterface();
        });
    }

    // World Map
    document.querySelectorAll('.travel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const region = btn.closest('.region').dataset.region;
            const regionNames = {
                'northern-peaks': 'Northern Peaks',
                'mystic-forest': 'Mystic Forest',
                'coastal-towns': 'Coastal Towns',
                'desert-ruins': 'Desert Ruins'
            };
            
            game.currentLocation = regionNames[region];
            const currentRegionEl = document.getElementById('current-region');
            if (currentRegionEl) {
                currentRegionEl.textContent = game.currentLocation;
            }
            game.addActivity(`Traveled to ${game.currentLocation}`);
            
            // Update available activities based on region
            updateRegionActivities(region);
        });
    });

    // Market System
    const listItemBtn = document.getElementById('list-item-btn');
    if (listItemBtn) {
        listItemBtn.addEventListener('click', () => {
            const itemSelect = document.getElementById('sell-item');
            const priceInput = document.getElementById('sell-price');
            const item = itemSelect.value;
            const price = parseInt(priceInput.value);
            
            if (item && price > 0 && game.inventory[item] > 0) {
                game.inventory[item]--;
                if (game.inventory[item] === 0) {
                    delete game.inventory[item];
                }
                
                game.marketItems.push({
                    name: item,
                    price: price,
                    seller: game.character.name,
                    category: 'resources'
                });
                
                game.addActivity(`Listed ${item} for ${price} gold`);
                renderMarket();
                
                itemSelect.value = '';
                priceInput.value = '';
            } else {
                alert('Please select an item and enter a valid price!');
            }
        });
    }

    // Set up initial character attributes display
    updateCharacterAttributes();
});

// Character Attributes Update
function updateCharacterAttributes() {
    const attributes = ['strength', 'dexterity', 'intelligence', 'constitution'];
    attributes.forEach(attr => {
        const element = document.getElementById(`attr-${attr}`);
        if (element) {
            element.textContent = game.character.attributes[attr];
        }
    });
}

// Crafting System
function renderCrafting() {
    const recipesList = document.getElementById('recipes-list');
    const station = game.currentCraftingStation;
    
    if (!recipesList) return;
    
    recipesList.innerHTML = '';
    
    const availableRecipes = game.craftingRecipes.filter(recipe => recipe.station === station);
    
    availableRecipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe-item';
        recipeElement.innerHTML = `
            <div class="recipe-name">${recipe.item}</div>
            <div class="recipe-materials">${recipe.materials.join(', ')}</div>
            <div class="recipe-skill-req">${recipe.skillReq}</div>
        `;
        
        recipeElement.addEventListener('click', () => {
            document.querySelectorAll('.recipe-item').forEach(r => r.classList.remove('selected'));
            recipeElement.classList.add('selected');
            selectRecipe(recipe);
        });
        
        recipesList.appendChild(recipeElement);
    });
    
    renderInventory();
}

function selectRecipe(recipe) {
    const selectedRecipe = document.getElementById('selected-recipe');
    const craftBtn = document.getElementById('craft-btn');
    
    if (selectedRecipe) {
        selectedRecipe.innerHTML = `
            <div class="recipe-details">
                <h4>${recipe.item}</h4>
                <div class="recipe-materials">Materials: ${recipe.materials.join(', ')}</div>
                <div class="recipe-skill-req">Requires: ${recipe.skillReq}</div>
            </div>
        `;
    }
    
    if (craftBtn) {
        const canCraft = checkCraftingRequirements(recipe);
        craftBtn.disabled = !canCraft;
        craftBtn.onclick = () => craftItem(recipe);
    }
}

function checkCraftingRequirements(recipe) {
    // Check materials
    for (const material of recipe.materials) {
        const [itemName, amount] = material.split(' x');
        if (!game.inventory[itemName] || game.inventory[itemName] < parseInt(amount)) {
            return false;
        }
    }
    
    // Check skill requirement
    const [skillName, requiredLevel] = recipe.skillReq.split(' ');
    const skillCategory = Object.keys(game.character.skills).find(cat => 
        game.character.skills[cat][skillName]
    );
    
    if (skillCategory && game.character.skills[skillCategory][skillName].level < parseInt(requiredLevel)) {
        return false;
    }
    
    return true;
}

function craftItem(recipe) {
    if (!checkCraftingRequirements(recipe)) return;
    
    // Consume materials
    for (const material of recipe.materials) {
        const [itemName, amount] = material.split(' x');
        game.inventory[itemName] -= parseInt(amount);
        if (game.inventory[itemName] <= 0) {
            delete game.inventory[itemName];
        }
    }
    
    // Add crafted item to inventory
    game.inventory[recipe.item] = (game.inventory[recipe.item] || 0) + 1;
    
    // Gain skill experience
    const [skillName] = recipe.skillReq.split(' ');
    const skillCategory = Object.keys(game.character.skills).find(cat => 
        game.character.skills[cat][skillName]
    );
    
    if (skillCategory) {
        game.gainSkillXp(skillCategory, skillName, 50);
    }
    
    game.addActivity(`Crafted ${recipe.item}!`);
    
    // Visual feedback
    const craftingPanel = document.querySelector('.crafting-panel');
    if (craftingPanel) {
        craftingPanel.classList.add('crafting-success');
        setTimeout(() => craftingPanel.classList.remove('crafting-success'), 1000);
    }
    
    renderCrafting();
}

function renderInventory() {
    const inventoryGrid = document.getElementById('inventory-grid');
    if (!inventoryGrid) return;
    
    inventoryGrid.innerHTML = '';
    
    Object.entries(game.inventory).forEach(([item, quantity]) => {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot has-item';
        slot.innerHTML = `
            <div>${item}</div>
            <div>x${quantity}</div>
        `;
        inventoryGrid.appendChild(slot);
    });
    
    // Add empty slots
    for (let i = 0; i < 20 - Object.keys(game.inventory).length; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.innerHTML = 'Empty';
        inventoryGrid.appendChild(slot);
    }
}

function updatePvPStats() {
    const elements = {
        'pvp-rating-display': game.pvp.rating,
        'pvp-wins': game.pvp.wins,
        'pvp-losses': game.pvp.losses,
        'pk-level': game.pvp.pkLevel
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

function renderGuildInterface() {
    const guildInfo = document.getElementById('guild-info');
    const guildManagement = document.getElementById('guild-management');
    
    if (game.guild.name && guildInfo && guildManagement) {
        guildInfo.classList.add('hidden');
        guildManagement.classList.remove('hidden');
        
        const elements = {
            'guild-name-display': game.guild.name,
            'guild-members': game.guild.members,
            'guild-level': game.guild.level,
            'guild-treasury': game.guild.treasury
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
        
        // Render member list
        const memberList = document.getElementById('guild-member-list');
        if (memberList) {
            const members = ['GuildMaster', 'ViceLeader', 'Member1', 'Member2', 'Member3'];
            memberList.innerHTML = members.map(member => 
                `<div class="guild-member">${member} (${member === 'GuildMaster' ? 'Leader' : 'Member'})</div>`
            ).join('');
        }
    }
}

function updateRegionActivities(region) {
    const activities = {
        'northern-peaks': ['Mine Iron Ore', 'Search for Gems', 'Fight Mountain Beasts'],
        'mystic-forest': ['Gather Herbs', 'Study Ancient Magic', 'Hunt Mystical Creatures'],
        'coastal-towns': ['Fish in Harbor', 'Trade with Merchants', 'Explore Docks'],
        'desert-ruins': ['Excavate Artifacts', 'Decipher Ancient Texts', 'Battle Desert Nomads']
    };
    
    const regionActivities = document.querySelector('.region-activities');
    if (regionActivities) {
        regionActivities.innerHTML = activities[region].map(activity => 
            `<button class="activity-btn" onclick="performActivity('${activity}')">${activity}</button>`
        ).join('');
    }
}

function performActivity(activity) {
    game.addActivity(`Performed activity: ${activity}`);
    
    // Simulate resource gathering
    if (activity.includes('Mine')) {
        game.inventory['Iron Ore'] = (game.inventory['Iron Ore'] || 0) + Math.floor(Math.random() * 3) + 1;
        game.gainSkillXp('Gathering', 'Mining', 20);
    } else if (activity.includes('Gather')) {
        game.inventory['Mystic Herbs'] = (game.inventory['Mystic Herbs'] || 0) + Math.floor(Math.random() * 2) + 1;
        game.gainSkillXp('Gathering', 'Herbalism', 20);
    } else if (activity.includes('Fish')) {
        game.inventory['Fresh Fish'] = (game.inventory['Fresh Fish'] || 0) + Math.floor(Math.random() * 3) + 1;
        game.gainSkillXp('Gathering', 'Fishing', 20);
    } else if (activity.includes('Hunt')) {
        game.inventory['Animal Hide'] = (game.inventory['Animal Hide'] || 0) + Math.floor(Math.random() * 2) + 1;
        game.gainSkillXp('Gathering', 'Hunting', 20);
    }
    
    // Consume energy
    game.resources.energy = Math.max(0, game.resources.energy - 10);
    game.updateHeader();
    renderInventory();
}

function renderMarket() {
    const marketGrid = document.getElementById('market-items');
    const sellItemSelect = document.getElementById('sell-item');
    
    if (marketGrid) {
        // Render market items
        marketGrid.innerHTML = game.marketItems.map(item => `
            <div class="market-item">
                <h5>${item.name}</h5>
                <div class="market-price">${item.price} Gold</div>
                <div class="market-seller">Seller: ${item.seller}</div>
                <button class="buy-btn" onclick="buyItem('${item.name}', ${item.price})">Buy</button>
            </div>
        `).join('');
    }
    
    if (sellItemSelect) {
        // Populate sell dropdown
        sellItemSelect.innerHTML = '<option value="">Select item to sell</option>';
        Object.keys(game.inventory).forEach(item => {
            sellItemSelect.innerHTML += `<option value="${item}">${item} (${game.inventory[item]})</option>`;
        });
    }
}

function buyItem(itemName, price) {
    if (game.resources.gold >= price) {
        game.resources.gold -= price;
        game.inventory[itemName] = (game.inventory[itemName] || 0) + 1;
        game.addActivity(`Purchased ${itemName} for ${price} gold`);
        game.updateHeader();
        
        // Remove item from market
        game.marketItems = game.marketItems.filter(item => item.name !== itemName);
        renderMarket();
        renderInventory();
    } else {
        alert('Not enough gold!');
    }
}

// Random Events System
function startRandomEvents() {
    setInterval(() => {
        const events = [
            'A dragon has been spotted in the Northern Peaks!',
            'Rare herbs have been discovered in the Mystic Forest!',
            'Pirates are attacking merchant ships near Coastal Towns!',
            'Ancient treasures unearthed in the Desert Ruins!',
            'Guild war declared between Shadow Clan and Light Brotherhood!',
            'Market prices for Iron Ore are rising rapidly!',
            'A mysterious trader has appeared in the town square!',
            'Legendary weapon discovered in ancient dungeon!'
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        game.addActivity(`🌟 World Event: ${randomEvent}`);
        
        // Add to world events display
        const worldEvents = document.getElementById('world-events');
        if (worldEvents) {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.textContent = `🌟 ${randomEvent}`;
            worldEvents.insertBefore(eventElement, worldEvents.firstChild);
            
            // Keep only recent events
            if (worldEvents.children.length > 5) {
                worldEvents.removeChild(worldEvents.lastChild);
            }
        }
    }, 30000); // Every 30 seconds
}

// Energy Regeneration
function startEnergyRegen() {
    setInterval(() => {
        if (game.resources.energy < 100) {
            game.resources.energy += 5;
            game.updateHeader();
        }
    }, 10000); // Every 10 seconds
}

// Skill Point Generation
function startSkillPointGen() {
    setInterval(() => {
        game.resources.skillPoints += 1;
        game.updateHeader();
        game.addActivity('Gained 1 skill point from meditation');
    }, 60000); // Every minute
}

// Initialize Game
function initializeGame() {
    game.updateHeader();
    game.updateDashboardStats();
    game.renderSkills();
    renderCrafting();
    renderMarket();
    updatePvPStats();
    updateRegionActivities('coastal-towns');
    updateCharacterAttributes();
    
    // Start background systems
    startRandomEvents();
    startEnergyRegen();
    startSkillPointGen();
    
    // Initial world events
    const initialEvents = [
        '🌟 World Event: Dragon Sighting in the Northern Peaks',
        '⚔️ Guild War: Shadow Clan vs Light Brotherhood',
        '💰 Market Alert: Iron Ore prices rising'
    ];
    
    const worldEvents = document.getElementById('world-events');
    if (worldEvents) {
        worldEvents.innerHTML = initialEvents.map(event => 
            `<div class="event-item">${event}</div>`
        ).join('');
    }
    
    // Initialize activity feed
    game.updateActivityFeed();
}