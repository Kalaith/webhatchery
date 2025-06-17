// Dragon's Hoard - Idle Game JavaScript

class DragonHoardGame {
    constructor() {
        this.gameState = {
            gold: 0,
            totalTreasures: 0,
            uniqueTreasures: new Set(),
            minions: 0,
            goldPerClick: 1,
            goldPerSecond: 0.1,
            upgrades: {},
            discoveredTreasures: [],
            achievements: new Set(),
            prestigeLevel: 0,
            lastSave: Date.now(),
            cooldowns: {
                minions: 0,
                explore: 0
            }
        };

        this.treasureData = [
            {"name": "Ancient Golden Goblet", "rarity": "rare", "description": "A goblet that once belonged to a forgotten king, inscribed with mysterious runes.", "effect": "Increases gold income by 5%"},
            {"name": "Dragon Scale Armor", "rarity": "epic", "description": "Armor crafted from the scales of an ancient dragon, radiating protective magic.", "effect": "Reduces minion costs by 10%"},
            {"name": "Crystallized Moonbeam", "rarity": "legendary", "description": "A shard of pure moonlight captured in crystal form, pulsing with ethereal energy.", "effect": "Doubles exploration success rate"},
            {"name": "Hourglass of Eternal Moments", "rarity": "epic", "description": "Time seems to slow when gazing upon this mystical timepiece.", "effect": "Increases offline earnings by 25%"},
            {"name": "Miniature City in a Bottle", "rarity": "rare", "description": "A perfectly preserved miniature civilization trapped within enchanted glass.", "effect": "Unlocks additional minion type"},
            {"name": "Philosopher's Stone Fragment", "rarity": "legendary", "description": "A piece of the legendary stone that turns base metals to gold.", "effect": "Transmutes common treasures to rare"},
            {"name": "Singing Blade of the Wind Lords", "rarity": "epic", "description": "This blade hums with the power of ancient wind magic.", "effect": "Increases exploration speed by 50%"},
            {"name": "Bottled Storm Cloud", "rarity": "rare", "description": "A tempest contained within an unbreakable vessel, crackling with electricity.", "effect": "Chance to find multiple treasures at once"},
            {"name": "Map to Nowhere", "rarity": "common", "description": "A map that leads to places that don't exist... or do they?", "effect": "Reveals hidden treasure locations"},
            {"name": "Crown of Forgotten Kings", "rarity": "legendary", "description": "The crown of rulers whose names have been lost to time, yet their power remains.", "effect": "All minions work 100% faster"}
        ];

        this.upgradeData = [
            {"id": "clawSharpness", "name": "Sharper Claws", "baseCost": 10, "effect": "Increases manual gold collection", "maxLevel": 50},
            {"id": "lairExpansion", "name": "Lair Expansion", "baseCost": 100, "effect": "Increases treasure storage capacity", "maxLevel": 20},
            {"id": "minionRecruitment", "name": "Recruit Minions", "baseCost": 500, "effect": "Hire minions for automatic gold collection", "maxLevel": 100},
            {"id": "magicalResonance", "name": "Magical Resonance", "baseCost": 1000, "effect": "Treasure effects are more powerful", "maxLevel": 25},
            {"id": "ancientKnowledge", "name": "Ancient Knowledge", "baseCost": 5000, "effect": "Unlock new exploration areas", "maxLevel": 10}
        ];

        this.gameBalance = {
            baseGoldPerClick: 1,
            baseGoldPerSecond: 0.1,
            upgradeCostMultiplier: 1.15,
            treasureDiscoveryChance: 0.1,
            legendaryChance: 0.01,
            epicChance: 0.05,
            rareChance: 0.2,
            prestigeRequirement: 1000000
        };

        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.updateUI();
        this.startGameLoop();
        this.startAutoSave();
        this.logEvent("🐉 The dragon awakens and surveys its hoard...");
    }

    setupEventListeners() {
        document.getElementById('collectGoldBtn').addEventListener('click', () => this.collectGold());
        document.getElementById('sendMinionsBtn').addEventListener('click', () => this.sendMinions());
        document.getElementById('exploreRuinsBtn').addEventListener('click', () => this.exploreRuins());
        document.getElementById('upgradeLairBtn').addEventListener('click', () => this.upgradeLair());
        document.getElementById('prestigeBtn').addEventListener('click', () => this.prestige());
        document.getElementById('saveGameBtn').addEventListener('click', () => this.saveGame());
        document.getElementById('resetGameBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('closeTreasureModal').addEventListener('click', () => this.closeTreasureModal());
    }

    formatNumber(num) {
        if (num < 1000) return Math.floor(num).toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
        return (num / 1000000000).toFixed(1) + 'B';
    }

    collectGold() {
        const goldEarned = this.calculateGoldPerClick();
        this.gameState.gold += goldEarned;
        this.showFloatingNumber(goldEarned, document.getElementById('collectGoldBtn'));
        this.addPulseEffect('collectGoldBtn');
        this.checkAchievements();
        this.updateUI();
    }

    calculateGoldPerClick() {
        let base = this.gameBalance.baseGoldPerClick;
        const clawLevel = this.gameState.upgrades.clawSharpness || 0;
        base *= (1 + clawLevel * 0.5);
        
        // Apply treasure bonuses
        this.gameState.discoveredTreasures.forEach(treasure => {
            if (treasure.name === "Ancient Golden Goblet") {
                base *= 1.05;
            }
        });
        
        return Math.ceil(base);
    }

    calculateGoldPerSecond() {
        let base = this.gameBalance.baseGoldPerSecond;
        const minionLevel = this.gameState.upgrades.minionRecruitment || 0;
        base += minionLevel * 0.5;
        
        // Apply treasure bonuses
        this.gameState.discoveredTreasures.forEach(treasure => {
            if (treasure.name === "Crown of Forgotten Kings") {
                base *= 2;
            }
        });
        
        return base;
    }

    sendMinions() {
        if (this.gameState.cooldowns.minions > 0) return;
        
        const minionLevel = this.gameState.upgrades.minionRecruitment || 0;
        if (minionLevel === 0) {
            this.logEvent("⚠️ You need to recruit minions first!");
            return;
        }
        
        const goldEarned = Math.ceil(minionLevel * 10 * (1 + this.gameState.prestigeLevel * 0.1));
        this.gameState.gold += goldEarned;
        this.gameState.cooldowns.minions = 30;
        
        this.logEvent(`👹 Your ${minionLevel} minions collected ${this.formatNumber(goldEarned)} gold!`);
        this.updateUI();
    }

    exploreRuins() {
        if (this.gameState.cooldowns.explore > 0) return;
        
        this.gameState.cooldowns.explore = 60;
        
        let discoveryChance = this.gameBalance.treasureDiscoveryChance;
        
        // Apply treasure bonuses
        this.gameState.discoveredTreasures.forEach(treasure => {
            if (treasure.name === "Crystallized Moonbeam") {
                discoveryChance *= 2;
            }
        });
        
        if (Math.random() < discoveryChance) {
            this.discoverTreasure();
        } else {
            this.logEvent("🗺️ You explored ancient ruins but found nothing of value...");
        }
        
        this.updateUI();
    }

    discoverTreasure() {
        const rarityRoll = Math.random();
        let rarity = 'common';
        
        if (rarityRoll < this.gameBalance.legendaryChance) {
            rarity = 'legendary';
        } else if (rarityRoll < this.gameBalance.epicChance) {
            rarity = 'epic';
        } else if (rarityRoll < this.gameBalance.rareChance) {
            rarity = 'rare';
        }
        
        const availableTreasures = this.treasureData.filter(t => 
            t.rarity === rarity && !this.gameState.uniqueTreasures.has(t.name)
        );
        
        if (availableTreasures.length === 0) {
            this.logEvent("✨ You found a shimmering duplicate, but it crumbles to dust...");
            return;
        }
        
        const treasure = availableTreasures[Math.floor(Math.random() * availableTreasures.length)];
        this.gameState.discoveredTreasures.push(treasure);
        this.gameState.uniqueTreasures.add(treasure.name);
        this.gameState.totalTreasures++;
        
        this.showTreasureModal(treasure);
        this.addRecentTreasure(treasure);
        this.logEvent(`💎 Discovered: ${treasure.name} (${treasure.rarity})!`);
        this.checkAchievements();
    }

    upgradeLair() {
        const cost = 100 * Math.pow(1.5, this.gameState.upgrades.lairExpansion || 0);
        
        if (this.gameState.gold >= cost) {
            this.gameState.gold -= cost;
            this.gameState.upgrades.lairExpansion = (this.gameState.upgrades.lairExpansion || 0) + 1;
            this.logEvent(`🏰 Expanded your lair! Level ${this.gameState.upgrades.lairExpansion}`);
            this.updateUI();
        } else {
            this.logEvent("⚠️ Not enough gold to upgrade your lair!");
        }
    }

    buyUpgrade(upgradeId) {
        const upgradeInfo = this.upgradeData.find(u => u.id === upgradeId);
        if (!upgradeInfo) return;
        
        const currentLevel = this.gameState.upgrades[upgradeId] || 0;
        if (currentLevel >= upgradeInfo.maxLevel) return;
        
        const cost = Math.ceil(upgradeInfo.baseCost * Math.pow(this.gameBalance.upgradeCostMultiplier, currentLevel));
        
        if (this.gameState.gold >= cost) {
            this.gameState.gold -= cost;
            this.gameState.upgrades[upgradeId] = currentLevel + 1;
            
            if (upgradeId === 'minionRecruitment') {
                this.gameState.minions = this.gameState.upgrades[upgradeId];
            }
            
            this.logEvent(`⬆️ Upgraded ${upgradeInfo.name} to level ${this.gameState.upgrades[upgradeId]}!`);
            this.updateUI();
        }
    }

    prestige() {
        if (this.gameState.gold < this.gameBalance.prestigeRequirement) return;
        
        if (confirm("Sleep for a century? This will reset your progress but grant permanent bonuses!")) {
            this.gameState.prestigeLevel++;
            this.gameState.gold = 0;
            this.gameState.upgrades = {};
            this.gameState.minions = 0;
            this.gameState.cooldowns = { minions: 0, explore: 0 };
            
            this.logEvent(`💤 You slept for a century and awakened stronger! Prestige level: ${this.gameState.prestigeLevel}`);
            this.updateUI();
        }
    }

    checkAchievements() {
        const achievements = [
            { id: 'firstHoard', condition: () => this.gameState.gold >= 1000, name: 'First Hoard', desc: 'Collect your first 1000 gold' },
            { id: 'treasureHunter', condition: () => this.gameState.uniqueTreasures.size >= 10, name: 'Treasure Hunter', desc: 'Find 10 unique treasures' },
            { id: 'dragonLord', condition: () => this.gameState.gold >= 1000000, name: 'Dragon Lord', desc: 'Reach 1 million gold' },
            { id: 'legendaryCollector', condition: () => this.gameState.discoveredTreasures.some(t => t.rarity === 'legendary'), name: 'Legendary Collector', desc: 'Find a legendary treasure' },
            { id: 'minionMaster', condition: () => this.gameState.minions >= 50, name: 'Minion Master', desc: 'Have 50 active minions' }
        ];
        
        achievements.forEach(achievement => {
            if (!this.gameState.achievements.has(achievement.id) && achievement.condition()) {
                this.gameState.achievements.add(achievement.id);
                this.logEvent(`🏆 Achievement unlocked: ${achievement.name}!`);
            }
        });
    }

    updateUI() {
        // Update resource counters
        document.getElementById('goldCount').textContent = this.formatNumber(this.gameState.gold);
        document.getElementById('treasureCount').textContent = this.gameState.totalTreasures;
        document.getElementById('uniqueCount').textContent = this.gameState.uniqueTreasures.size;
        document.getElementById('minionCount').textContent = this.gameState.minions;
        
        // Update gold per click display
        document.getElementById('goldPerClick').textContent = this.formatNumber(this.calculateGoldPerClick());
        
        // Update cooldown displays
        this.updateCooldowns();
        
        // Update upgrade shop
        this.updateUpgradeShop();
        
        // Update treasure collection
        this.updateTreasureCollection();
        
        // Update prestige button
        const prestigeBtn = document.getElementById('prestigeBtn');
        if (this.gameState.gold >= this.gameBalance.prestigeRequirement) {
            prestigeBtn.disabled = false;
            prestigeBtn.classList.remove('btn--outline');
            prestigeBtn.classList.add('btn--primary');
        } else {
            prestigeBtn.disabled = true;
            prestigeBtn.classList.add('btn--outline');
            prestigeBtn.classList.remove('btn--primary');
        }
        
        // Update lair upgrade cost
        const lairCost = 100 * Math.pow(1.5, this.gameState.upgrades.lairExpansion || 0);
        document.querySelector('#upgradeLairBtn .btn-cost').textContent = `Cost: ${this.formatNumber(lairCost)}`;
    }

    updateCooldowns() {
        const minionCooldown = document.getElementById('minionCooldown');
        const exploreCooldown = document.getElementById('exploreCooldown');
        
        if (this.gameState.cooldowns.minions > 0) {
            minionCooldown.textContent = `${this.gameState.cooldowns.minions}s`;
            minionCooldown.classList.remove('hidden');
        } else {
            minionCooldown.classList.add('hidden');
        }
        
        if (this.gameState.cooldowns.explore > 0) {
            exploreCooldown.textContent = `${this.gameState.cooldowns.explore}s`;
            exploreCooldown.classList.remove('hidden');
        } else {
            exploreCooldown.classList.add('hidden');
        }
    }

    updateUpgradeShop() {
        const upgradesList = document.getElementById('upgradesList');
        upgradesList.innerHTML = '';
        
        this.upgradeData.forEach(upgrade => {
            const currentLevel = this.gameState.upgrades[upgrade.id] || 0;
            const cost = Math.ceil(upgrade.baseCost * Math.pow(this.gameBalance.upgradeCostMultiplier, currentLevel));
            const canAfford = this.gameState.gold >= cost;
            const maxLevel = currentLevel >= upgrade.maxLevel;
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = 'upgrade-item';
            upgradeElement.innerHTML = `
                <div class="upgrade-info">
                    <div class="upgrade-name">${upgrade.name}</div>
                    <div class="upgrade-description">${upgrade.effect}</div>
                    <div class="upgrade-level">Level: ${currentLevel}/${upgrade.maxLevel}</div>
                </div>
                <div class="upgrade-cost">${maxLevel ? 'MAX' : this.formatNumber(cost)}</div>
            `;
            
            if (!maxLevel && canAfford) {
                upgradeElement.style.cursor = 'pointer';
                upgradeElement.addEventListener('click', () => this.buyUpgrade(upgrade.id));
            } else if (!canAfford && !maxLevel) {
                upgradeElement.style.opacity = '0.5';
            }
            
            upgradesList.appendChild(upgradeElement);
        });
    }

    updateTreasureCollection() {
        const collection = document.getElementById('treasureCollection');
        collection.innerHTML = '';
        
        this.gameState.discoveredTreasures.forEach(treasure => {
            const treasureElement = document.createElement('div');
            treasureElement.className = `treasure-card ${treasure.rarity}`;
            treasureElement.innerHTML = `
                <div class="treasure-name">${treasure.name}</div>
                <div class="treasure-description">${treasure.description}</div>
                <div class="treasure-effect">${treasure.effect}</div>
            `;
            collection.appendChild(treasureElement);
        });
    }

    addRecentTreasure(treasure) {
        const recentList = document.getElementById('recentTreasuresList');
        
        const treasureElement = document.createElement('div');
        treasureElement.className = `treasure-entry ${treasure.rarity}`;
        treasureElement.innerHTML = `
            <strong>${treasure.name}</strong><br>
            <small>${treasure.effect}</small>
        `;
        
        recentList.insertBefore(treasureElement, recentList.firstChild);
        
        // Keep only 5 most recent
        while (recentList.children.length > 5) {
            recentList.removeChild(recentList.lastChild);
        }
    }

    showTreasureModal(treasure) {
        const modal = document.getElementById('treasureModal');
        const details = document.getElementById('treasureDetails');
        
        details.innerHTML = `
            <div class="treasure-name ${treasure.rarity}">${treasure.name}</div>
            <div class="treasure-description">${treasure.description}</div>
            <div class="treasure-effect"><strong>Effect:</strong> ${treasure.effect}</div>
        `;
        
        modal.classList.remove('hidden');
    }

    closeTreasureModal() {
        document.getElementById('treasureModal').classList.add('hidden');
    }

    showFloatingNumber(amount, element) {
        const rect = element.getBoundingClientRect();
        const floatingNum = document.createElement('div');
        floatingNum.className = 'floating-number';
        floatingNum.textContent = `+${this.formatNumber(amount)}`;
        floatingNum.style.left = (rect.left + rect.width / 2) + 'px';
        floatingNum.style.top = rect.top + 'px';
        
        document.getElementById('floatingNumbers').appendChild(floatingNum);
        
        setTimeout(() => {
            floatingNum.remove();
        }, 2000);
    }

    addPulseEffect(elementId) {
        const element = document.getElementById(elementId);
        element.classList.add('pulse');
        setTimeout(() => element.classList.remove('pulse'), 500);
    }

    logEvent(message) {
        const eventsList = document.getElementById('eventsList');
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.textContent = message;
        
        eventsList.insertBefore(eventElement, eventsList.firstChild);
        
        // Keep only 10 most recent events
        while (eventsList.children.length > 10) {
            eventsList.removeChild(eventsList.lastChild);
        }
    }

    startGameLoop() {
        const gameLoop = (timestamp) => {
            // Passive gold generation
            const deltaTime = 16 / 1000; // Assuming 60 FPS
            this.gameState.gold += this.calculateGoldPerSecond() * deltaTime;
            
            // Update cooldowns
            if (this.gameState.cooldowns.minions > 0) {
                this.gameState.cooldowns.minions = Math.max(0, this.gameState.cooldowns.minions - deltaTime);
            }
            if (this.gameState.cooldowns.explore > 0) {
                this.gameState.cooldowns.explore = Math.max(0, this.gameState.cooldowns.explore - deltaTime);
            }
            
            this.updateUI();
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
    }

    startAutoSave() {
        setInterval(() => {
            this.saveGame();
        }, 10000); // Auto-save every 10 seconds
    }

    saveGame() {
        try {
            const saveData = {
                ...this.gameState,
                uniqueTreasures: Array.from(this.gameState.uniqueTreasures),
                achievements: Array.from(this.gameState.achievements)
            };
            localStorage.setItem('dragonHoardSave', JSON.stringify(saveData));
            this.logEvent("💾 Game saved successfully!");
        } catch (error) {
            this.logEvent("⚠️ Failed to save game!");
        }
    }

    loadGame() {
        try {
            const saveData = localStorage.getItem('dragonHoardSave');
            if (saveData) {
                const parsed = JSON.parse(saveData);
                this.gameState = {
                    ...this.gameState,
                    ...parsed,
                    uniqueTreasures: new Set(parsed.uniqueTreasures || []),
                    achievements: new Set(parsed.achievements || [])
                };
                
                // Calculate offline earnings
                const offlineTime = (Date.now() - this.gameState.lastSave) / 1000;
                if (offlineTime > 60) { // Only if offline for more than a minute
                    const offlineGold = this.calculateGoldPerSecond() * Math.min(offlineTime, 86400); // Max 24 hours
                    this.gameState.gold += offlineGold;
                    this.logEvent(`💰 Earned ${this.formatNumber(offlineGold)} gold while away!`);
                }
            }
        } catch (error) {
            this.logEvent("⚠️ Failed to load saved game, starting fresh!");
        }
    }

    resetGame() {
        if (confirm("Are you sure you want to reset your entire game? This cannot be undone!")) {
            localStorage.removeItem('dragonHoardSave');
            location.reload();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new DragonHoardGame();
});