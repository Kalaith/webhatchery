// Fantasy Quest Generator JavaScript

class QuestGenerator {
    constructor() {
        this.questData = {
            questTypes: {
                basic: [
                    "Kill Quest",
                    "Collection Quest", 
                    "Delivery Quest",
                    "Escort Quest",
                    "Exploration Quest"
                ],
                advanced: [
                    "Mystery/Investigation",
                    "Survival Challenge",
                    "Crafting Mission",
                    "Diplomacy Quest",
                    "Multi-stage Chain",
                    "Rescue Mission",
                    "Siege Defense",
                    "Infiltration/Stealth"
                ]
            },
            creatures: [
                "Ancient Red Dragon", "Frost Wyrm", "Shadow Dragon", "Zombie Horde", "Skeleton Warriors",
                "Vampire Lord", "Lich Master", "Goblin Raiders", "Orc Warband", "Bandit Leader",
                "Cultist Assassins", "Dire Wolves", "Giant Spiders", "Owlbear", "Mountain Trolls",
                "Fire Elementals", "Shadow Demons", "Fallen Angels", "Frost Giants", "Stone Golems"
            ],
            locations: [
                "Ancient Tomb of Kings", "Forgotten Crypt", "Crystal Caverns", "Village of Millbrook",
                "Port City of Saltmere", "Capital of Valorhall", "Darkwood Forest", "Crimson Desert",
                "Frostpeak Mountains", "Wizard's Tower", "Fairy Ring Grove", "Lost Temple of Light",
                "Abandoned Castle Ravenshollow", "Elven Sanctuary", "Dwarven Mines", "Haunted Battlefield"
            ],
            items: [
                "Enchanted Blade of Heroes", "Dwarven Warhammer", "Elven Longbow", "Crown of Ancient Kings",
                "Orb of Elemental Power", "Tome of Forbidden Knowledge", "Dragon Scales", "Mithril Ore",
                "Rare Moonflower Herbs", "Magical Crystals", "Ancient Gold Coins", "Precious Ruby Gems",
                "Lost Family Heirloom", "Healing Potions", "Scroll of Fireball", "Blessed Holy Water"
            ],
            npcs: [
                "King Aldric the Just", "Princess Elara", "Duke Ravencrest", "Trader Magnus",
                "Blacksmith Thorin Ironforge", "Alchemist Sage Vera", "High Priest Benedictus",
                "Oracle of Light", "Archmage Verin", "Lorekeeper Nolan", "Farmer Willem",
                "Innkeeper Martha", "Guard Captain Boris", "Merchant Caravan Leader"
            ],
            difficulties: ["Easy", "Medium", "Hard", "Epic"],
            lengths: ["Short", "Medium", "Long", "Campaign"],
            rewards: ["Gold Coins", "Magical Items", "Experience", "Reputation", "Land Grants", "Noble Titles"]
        };

        this.questHistory = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadHistory();
    }

    bindEvents() {
        document.getElementById('generateQuest').addEventListener('click', () => this.generateQuest());
        document.getElementById('generateAnother').addEventListener('click', () => this.generateQuest());
        document.getElementById('copyQuest').addEventListener('click', () => this.copyQuestToClipboard());
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateQuestTitle(type, mainElement) {
        const titlePrefixes = {
            "Kill Quest": ["Eliminate", "Destroy", "Hunt", "Slay", "Vanquish"],
            "Collection Quest": ["Gather", "Collect", "Retrieve", "Obtain", "Acquire"],
            "Delivery Quest": ["Deliver", "Transport", "Escort", "Carry", "Bring"],
            "Escort Quest": ["Protect", "Guide", "Escort", "Safeguard", "Accompany"],
            "Exploration Quest": ["Discover", "Explore", "Investigate", "Survey", "Scout"],
            "Mystery/Investigation": ["Uncover", "Solve", "Investigate", "Reveal", "Expose"],
            "Survival Challenge": ["Survive", "Endure", "Outlast", "Withstand", "Overcome"],
            "Crafting Mission": ["Forge", "Create", "Craft", "Build", "Construct"],
            "Diplomacy Quest": ["Negotiate", "Mediate", "Resolve", "Unite", "Reconcile"],
            "Multi-stage Chain": ["The", "Epic", "Grand", "Ultimate", "Legendary"],
            "Rescue Mission": ["Rescue", "Save", "Liberate", "Free", "Recover"],
            "Siege Defense": ["Defend", "Protect", "Hold", "Guard", "Fortify"],
            "Infiltration/Stealth": ["Infiltrate", "Sneak", "Penetrate", "Breach", "Infiltrate"]
        };

        const titleSuffixes = [
            "of Legend", "of Power", "of Destiny", "of Honor", "of Shadows", 
            "of Light", "of the Ancient", "of the Forgotten", "of the Lost"
        ];

        const prefix = this.randomChoice(titlePrefixes[type] || ["The"]);
        const suffix = Math.random() > 0.5 ? " " + this.randomChoice(titleSuffixes) : "";
        
        return `${prefix} the ${mainElement}${suffix}`;
    }

    generateBasicQuest(type, difficulty, length) {
        const quest = { type, difficulty, length, isAdvanced: false };
        
        switch(type) {
            case "Kill Quest":
                const creature = this.randomChoice(this.questData.creatures);
                const killCount = this.getCountByDifficulty(difficulty, 1, 3, 5, 8);
                quest.title = this.generateQuestTitle(type, creature);
                quest.description = `A dangerous ${creature.toLowerCase()} has been terrorizing the local area. The threat must be eliminated before more innocent lives are lost.`;
                quest.primaryObjective = `Eliminate ${killCount} ${creature.toLowerCase()}${killCount > 1 ? 's' : ''}`;
                quest.mainElement = creature;
                quest.count = killCount;
                break;

            case "Collection Quest":
                const item = this.randomChoice(this.questData.items);
                const itemCount = this.getCountByDifficulty(difficulty, 3, 5, 8, 12);
                const location = this.randomChoice(this.questData.locations);
                quest.title = this.generateQuestTitle(type, item);
                quest.description = `Ancient artifacts have been scattered across dangerous territories. These precious items must be recovered before they fall into the wrong hands.`;
                quest.primaryObjective = `Collect ${itemCount} ${item.toLowerCase()}${itemCount > 1 ? 's' : ''} from ${location}`;
                quest.mainElement = item;
                quest.count = itemCount;
                quest.location = location;
                break;

            case "Delivery Quest":
                const deliveryItem = this.randomChoice(this.questData.items);
                const fromNpc = this.randomChoice(this.questData.npcs);
                const toLocation = this.randomChoice(this.questData.locations);
                quest.title = this.generateQuestTitle(type, deliveryItem);
                quest.description = `Important cargo needs to be transported safely across dangerous lands. Time is of the essence, and the cargo must arrive intact.`;
                quest.primaryObjective = `Deliver ${deliveryItem} from ${fromNpc} to ${toLocation}`;
                quest.mainElement = deliveryItem;
                quest.fromNpc = fromNpc;
                quest.toLocation = toLocation;
                break;

            case "Escort Quest":
                const escortNpc = this.randomChoice(this.questData.npcs);
                const destination = this.randomChoice(this.questData.locations);
                quest.title = this.generateQuestTitle(type, escortNpc);
                quest.description = `A valuable person needs safe passage through hostile territory. Your protection skills will be put to the test.`;
                quest.primaryObjective = `Safely escort ${escortNpc} to ${destination}`;
                quest.mainElement = escortNpc;
                quest.destination = destination;
                break;

            case "Exploration Quest":
                const exploreLocation = this.randomChoice(this.questData.locations);
                quest.title = this.generateQuestTitle(type, exploreLocation);
                quest.description = `Uncharted territories hold secrets waiting to be uncovered. Brave the unknown and map out these mysterious lands.`;
                quest.primaryObjective = `Explore and map the ${exploreLocation}`;
                quest.mainElement = exploreLocation;
                break;
        }

        return quest;
    }

    generateAdvancedQuest(type, difficulty, length) {
        const quest = { type, difficulty, length, isAdvanced: true };
        
        switch(type) {
            case "Mystery/Investigation":
                const mysteryLocation = this.randomChoice(this.questData.locations);
                const mysteryNpc = this.randomChoice(this.questData.npcs);
                quest.title = `The Mystery of ${mysteryLocation}`;
                quest.description = `Strange occurrences have been reported, and someone needs to get to the bottom of it. Follow the clues and uncover the truth.`;
                quest.primaryObjective = `Investigate the mysterious events at ${mysteryLocation}`;
                quest.secondaryObjectives = [
                    `Interview ${mysteryNpc} for information`,
                    `Gather 3 pieces of evidence`,
                    `Uncover the truth behind the mystery`
                ];
                quest.mainElement = mysteryLocation;
                break;

            case "Survival Challenge":
                const survivalLocation = this.randomChoice(this.questData.locations);
                const survivalDays = this.getCountByDifficulty(difficulty, 3, 7, 14, 30);
                quest.title = `Survival in ${survivalLocation}`;
                quest.description = `The harsh wilderness tests even the most experienced adventurers. Survive against all odds in this unforgiving environment.`;
                quest.primaryObjective = `Survive for ${survivalDays} days in ${survivalLocation}`;
                quest.secondaryObjectives = [
                    "Establish a secure shelter",
                    "Find reliable sources of food and water",
                    "Defend against hostile creatures"
                ];
                quest.mainElement = survivalLocation;
                quest.duration = survivalDays;
                break;

            case "Crafting Mission":
                const craftItem = this.randomChoice(this.questData.items);
                const craftingNpc = this.randomChoice(this.questData.npcs);
                quest.title = `Forging the ${craftItem}`;
                quest.description = `A legendary item must be crafted using ancient techniques and rare materials. Master the art of creation.`;
                quest.primaryObjective = `Craft the legendary ${craftItem}`;
                quest.secondaryObjectives = [
                    `Gather rare crafting materials`,
                    `Learn the ancient technique from ${craftingNpc}`,
                    `Forge the item in a sacred location`
                ];
                quest.mainElement = craftItem;
                quest.craftingNpc = craftingNpc;
                break;

            case "Diplomacy Quest":
                const faction1 = this.randomChoice(this.questData.locations);
                const faction2 = this.randomChoice(this.questData.locations);
                const diplomatNpc = this.randomChoice(this.questData.npcs);
                quest.title = `Peace Between ${faction1} and ${faction2}`;
                quest.description = `War threatens to tear the realm apart. Use diplomacy and negotiation to prevent bloodshed and restore peace.`;
                quest.primaryObjective = `Negotiate peace between ${faction1} and ${faction2}`;
                quest.secondaryObjectives = [
                    `Meet with leaders from both factions`,
                    `Uncover the root cause of the conflict`,
                    `Facilitate peace talks with ${diplomatNpc}`
                ];
                quest.mainElement = `${faction1} and ${faction2}`;
                break;

            case "Multi-stage Chain":
                const chainLocation = this.randomChoice(this.questData.locations);
                const chainItem = this.randomChoice(this.questData.items);
                const chainCreature = this.randomChoice(this.questData.creatures);
                quest.title = `The Legend of ${chainLocation}`;
                quest.description = `An epic quest spanning multiple challenges and locations. Only the most dedicated adventurers will see it through to the end.`;
                quest.primaryObjective = `Complete the legendary quest chain`;
                quest.secondaryObjectives = [
                    `Retrieve the ${chainItem} from ${chainLocation}`,
                    `Defeat the ${chainCreature}`,
                    `Unite the scattered allies`,
                    `Face the final challenge`
                ];
                quest.mainElement = chainLocation;
                break;

            case "Rescue Mission":
                const rescueNpc = this.randomChoice(this.questData.npcs);
                const captorCreature = this.randomChoice(this.questData.creatures);
                const prisonLocation = this.randomChoice(this.questData.locations);
                quest.title = `Rescue of ${rescueNpc}`;
                quest.description = `Someone important has been captured and needs immediate rescue. Time is running out before it's too late.`;
                quest.primaryObjective = `Rescue ${rescueNpc} from ${prisonLocation}`;
                quest.secondaryObjectives = [
                    `Locate the prisoner's exact location`,
                    `Defeat the ${captorCreature} guards`,
                    `Safely extract the prisoner`
                ];
                quest.mainElement = rescueNpc;
                break;

            case "Siege Defense":
                const defendLocation = this.randomChoice(this.questData.locations);
                const attackerCreature = this.randomChoice(this.questData.creatures);
                quest.title = `Defense of ${defendLocation}`;
                quest.description = `Enemy forces are massing for an assault. Organize the defenses and hold the line against overwhelming odds.`;
                quest.primaryObjective = `Defend ${defendLocation} from the ${attackerCreature} siege`;
                quest.secondaryObjectives = [
                    "Fortify defensive positions",
                    "Rally the local defenders",
                    "Survive multiple waves of attacks"
                ];
                quest.mainElement = defendLocation;
                break;

            case "Infiltration/Stealth":
                const infiltrateLocation = this.randomChoice(this.questData.locations);
                const stealItem = this.randomChoice(this.questData.items);
                quest.title = `Infiltration of ${infiltrateLocation}`;
                quest.description = `A covert operation requiring stealth and cunning. Slip past enemy defenses without raising the alarm.`;
                quest.primaryObjective = `Infiltrate ${infiltrateLocation} and steal the ${stealItem}`;
                quest.secondaryObjectives = [
                    "Avoid detection by guards",
                    "Disable security measures",
                    "Escape without leaving traces"
                ];
                quest.mainElement = infiltrateLocation;
                break;
        }

        return quest;
    }

    getCountByDifficulty(difficulty, easy, medium, hard, epic) {
        switch(difficulty) {
            case "Easy": return easy;
            case "Medium": return medium;
            case "Hard": return hard;
            case "Epic": return epic;
            default: return medium;
        }
    }

    getEstimatedTime(length, difficulty) {
        const baseTime = {
            "Short": { min: 1, max: 2 },
            "Medium": { min: 2, max: 4 },
            "Long": { min: 4, max: 8 },
            "Campaign": { min: 8, max: 20 }
        };

        const difficultyMultiplier = {
            "Easy": 0.8,
            "Medium": 1.0,
            "Hard": 1.3,
            "Epic": 1.6
        };

        const base = baseTime[length] || baseTime["Medium"];
        const multiplier = difficultyMultiplier[difficulty] || 1.0;
        
        const minTime = Math.ceil(base.min * multiplier);
        const maxTime = Math.ceil(base.max * multiplier);
        
        if (minTime === maxTime) {
            return `${minTime} hour${minTime > 1 ? 's' : ''}`;
        } else {
            return `${minTime}-${maxTime} hours`;
        }
    }

    generateReward(difficulty) {
        const baseReward = this.randomChoice(this.questData.rewards);
        const goldAmounts = {
            "Easy": [50, 150],
            "Medium": [150, 400],
            "Hard": [400, 800],
            "Epic": [800, 2000]
        };
        
        const range = goldAmounts[difficulty] || goldAmounts["Medium"];
        const goldAmount = this.randomNumber(range[0], range[1]);
        
        return `${goldAmount} ${baseReward}`;
    }

    generateLore(quest) {
        const loreTemplates = [
            `Legend speaks of ancient times when ${quest.mainElement} held great power over the realm.`,
            `Local folklore tells of brave heroes who once faced similar challenges in these very lands.`,
            `The archives mention a prophecy that foretells the importance of this quest to the kingdom's future.`,
            `Scholars believe this quest is connected to the ancient war that shaped the current political landscape.`,
            `Whispers among the common folk suggest that completing this task will restore balance to the region.`
        ];
        
        return this.randomChoice(loreTemplates);
    }

    generateQuest() {
        const filters = this.getFilters();
        
        // Determine quest category
        let questCategory;
        if (filters.questType === 'basic') {
            questCategory = 'basic';
        } else if (filters.questType === 'advanced') {
            questCategory = 'advanced';
        } else {
            questCategory = Math.random() > 0.6 ? 'advanced' : 'basic'; // 40% advanced, 60% basic
        }
        
        // Select quest type
        const availableTypes = this.questData.questTypes[questCategory];
        const questType = this.randomChoice(availableTypes);
        
        // Determine difficulty
        const difficulty = filters.difficulty === 'any' ? 
            this.randomChoice(this.questData.difficulties) : filters.difficulty;
        
        // Determine length
        const length = filters.length === 'any' ? 
            this.randomChoice(this.questData.lengths) : filters.length;
        
        // Generate quest based on category
        let quest;
        if (questCategory === 'basic') {
            quest = this.generateBasicQuest(questType, difficulty, length);
        } else {
            quest = this.generateAdvancedQuest(questType, difficulty, length);
        }
        
        // Add common quest properties
        quest.reward = this.generateReward(difficulty);
        quest.estimatedTime = this.getEstimatedTime(length, difficulty);
        quest.lore = this.generateLore(quest);
        quest.timestamp = new Date().toLocaleString();
        
        // Display quest and add to history
        this.displayQuest(quest);
        this.addToHistory(quest);
    }

    getFilters() {
        return {
            difficulty: document.getElementById('difficulty').value,
            questType: document.getElementById('questType').value,
            length: document.getElementById('length').value
        };
    }

    displayQuest(quest) {
        // Show quest display
        document.getElementById('questDisplay').classList.remove('hidden');
        
        // Set quest details
        document.getElementById('questTitle').textContent = quest.title;
        document.getElementById('questDescription').textContent = quest.description;
        document.getElementById('primaryObjective').textContent = quest.primaryObjective;
        document.getElementById('questReward').textContent = quest.reward;
        document.getElementById('questTime').textContent = quest.estimatedTime;
        document.getElementById('questLoreText').textContent = quest.lore;
        
        // Set badges
        document.getElementById('questTypeBadge').textContent = quest.type;
        document.getElementById('questTypeBadge').className = 'badge badge--type';
        
        document.getElementById('questDifficultyBadge').textContent = quest.difficulty;
        document.getElementById('questDifficultyBadge').className = `badge badge--difficulty-${quest.difficulty.toLowerCase()}`;
        
        document.getElementById('questLengthBadge').textContent = quest.length;
        document.getElementById('questLengthBadge').className = 'badge badge--length';
        
        // Handle secondary objectives
        const secondarySection = document.getElementById('secondaryObjectives');
        const secondaryList = document.getElementById('secondaryObjectivesList');
        
        if (quest.secondaryObjectives && quest.secondaryObjectives.length > 0) {
            secondarySection.classList.remove('hidden');
            secondaryList.innerHTML = '';
            quest.secondaryObjectives.forEach(objective => {
                const li = document.createElement('li');
                li.textContent = objective;
                secondaryList.appendChild(li);
            });
        } else {
            secondarySection.classList.add('hidden');
        }
        
        // Scroll to quest display
        document.getElementById('questDisplay').scrollIntoView({ behavior: 'smooth' });
    }

    addToHistory(quest) {
        this.questHistory.unshift(quest); // Add to beginning
        if (this.questHistory.length > 10) {
            this.questHistory = this.questHistory.slice(0, 10); // Keep only last 10
        }
        this.updateHistoryDisplay();
        this.saveHistory();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (this.questHistory.length === 0) {
            historyList.innerHTML = '<p class="quest-history__empty">No quests generated yet. Click "Generate Quest" to begin!</p>';
            return;
        }
        
        historyList.innerHTML = '';
        this.questHistory.forEach((quest, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item__title">${quest.title}</div>
                <div class="history-item__meta">
                    <span class="history-item__meta-item">${quest.type}</span>
                    <span class="history-item__meta-item">${quest.difficulty}</span>
                    <span class="history-item__meta-item">${quest.length}</span>
                    <span class="history-item__meta-item">${quest.timestamp}</span>
                </div>
            `;
            
            historyItem.addEventListener('click', () => this.displayQuest(quest));
            historyList.appendChild(historyItem);
        });
    }

    copyQuestToClipboard() {
        const quest = this.getCurrentDisplayedQuest();
        if (!quest) return;
        
        let questText = `${quest.title}\n\n`;
        questText += `Type: ${quest.type} | Difficulty: ${quest.difficulty} | Length: ${quest.length}\n\n`;
        questText += `${quest.description}\n\n`;
        questText += `Primary Objective: ${quest.primaryObjective}\n`;
        
        if (quest.secondaryObjectives && quest.secondaryObjectives.length > 0) {
            questText += `\nSecondary Objectives:\n`;
            quest.secondaryObjectives.forEach(obj => questText += `• ${obj}\n`);
        }
        
        questText += `\nReward: ${quest.reward}\n`;
        questText += `Estimated Time: ${quest.estimatedTime}\n\n`;
        questText += `Background: ${quest.lore}`;
        
        navigator.clipboard.writeText(questText).then(() => {
            // Show feedback
            const copyBtn = document.getElementById('copyQuest');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy quest: ', err);
        });
    }

    getCurrentDisplayedQuest() {
        if (this.questHistory.length === 0) return null;
        return this.questHistory[0]; // Most recent quest
    }

    clearHistory() {
        this.questHistory = [];
        this.updateHistoryDisplay();
        this.saveHistory();
    }

    saveHistory() {
        try {
            localStorage.setItem('questHistory', JSON.stringify(this.questHistory));
        } catch (e) {
            // Local storage not available, ignore
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('questHistory');
            if (saved) {
                this.questHistory = JSON.parse(saved);
                this.updateHistoryDisplay();
            }
        } catch (e) {
            // Local storage not available or corrupted, ignore
        }
    }
}

// Initialize the quest generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuestGenerator();
});