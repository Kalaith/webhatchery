// D&D Monster Builder Application
class MonsterBuilder {
    constructor() {
        this.data = {
            challengeRatings: [
                {"cr": "0", "xp": 0, "proficiency": 2},
                {"cr": "1/8", "xp": 25, "proficiency": 2},
                {"cr": "1/4", "xp": 50, "proficiency": 2},
                {"cr": "1/2", "xp": 100, "proficiency": 2},
                {"cr": "1", "xp": 200, "proficiency": 2},
                {"cr": "2", "xp": 450, "proficiency": 2},
                {"cr": "3", "xp": 700, "proficiency": 2},
                {"cr": "4", "xp": 1100, "proficiency": 2},
                {"cr": "5", "xp": 1800, "proficiency": 3},
                {"cr": "6", "xp": 2300, "proficiency": 3},
                {"cr": "7", "xp": 2900, "proficiency": 3},
                {"cr": "8", "xp": 3900, "proficiency": 3},
                {"cr": "9", "xp": 5000, "proficiency": 4},
                {"cr": "10", "xp": 5900, "proficiency": 4},
                {"cr": "11", "xp": 7200, "proficiency": 4},
                {"cr": "12", "xp": 8400, "proficiency": 4},
                {"cr": "13", "xp": 10000, "proficiency": 5},
                {"cr": "14", "xp": 11500, "proficiency": 5},
                {"cr": "15", "xp": 13000, "proficiency": 5},
                {"cr": "16", "xp": 15000, "proficiency": 5},
                {"cr": "17", "xp": 18000, "proficiency": 6},
                {"cr": "18", "xp": 20000, "proficiency": 6},
                {"cr": "19", "xp": 22000, "proficiency": 6},
                {"cr": "20", "xp": 25000, "proficiency": 6},
                {"cr": "21", "xp": 33000, "proficiency": 7},
                {"cr": "22", "xp": 41000, "proficiency": 7},
                {"cr": "23", "xp": 50000, "proficiency": 7},
                {"cr": "24", "xp": 62000, "proficiency": 7},
                {"cr": "25", "xp": 75000, "proficiency": 8},
                {"cr": "26", "xp": 90000, "proficiency": 8},
                {"cr": "27", "xp": 105000, "proficiency": 8},
                {"cr": "28", "xp": 120000, "proficiency": 8},
                {"cr": "29", "xp": 135000, "proficiency": 9},
                {"cr": "30", "xp": 155000, "proficiency": 9}
            ],
            templateMonsters: [
                {
                    name: "Basic Humanoid",
                    size: "Medium",
                    type: "Humanoid",
                    alignment: "Lawful Neutral",
                    str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
                    ac: 10, hp: 4, hitDice: "1d8",
                    walkSpeed: 30,
                    cr: "0"
                },
                {
                    name: "Fierce Beast",
                    size: "Large", 
                    type: "Beast",
                    alignment: "Unaligned",
                    str: 16, dex: 14, con: 15, int: 2, wis: 12, cha: 6,
                    ac: 13, hp: 25, hitDice: "3d10 + 6",
                    walkSpeed: 40,
                    cr: "1"
                },
                {
                    name: "Magical Construct",
                    size: "Medium",
                    type: "Construct", 
                    alignment: "Unaligned",
                    str: 14, dex: 8, con: 16, int: 6, wis: 10, cha: 1,
                    ac: 16, hp: 40, hitDice: "6d8 + 18",
                    walkSpeed: 25,
                    cr: "2"
                }
            ]
        };
        
        this.currentMonster = this.getEmptyMonster();
        this.dynamicItemCounters = {
            traits: 0,
            actions: 0,
            bonusActions: 0,
            reactions: 0
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePreview();
        this.loadSavedMonsters();
    }

    getEmptyMonster() {
        return {
            name: '',
            size: '',
            type: '',
            alignment: '',
            description: '',
            str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
            profBonus: 2,
            ac: 10,
            armorType: 'Natural Armor',
            hp: 1,
            hitDice: '',
            walkSpeed: 30, flySpeed: 0, swimSpeed: 0, climbSpeed: 0, burrowSpeed: 0,
            cr: '0',
            traits: [],
            actions: [],
            bonusActions: [],
            reactions: []
        };
    }

    setupEventListeners() {
        // Form inputs
        const form = document.getElementById('monsterForm');
        form.addEventListener('input', (e) => this.handleFormInput(e));
        form.addEventListener('change', (e) => this.handleFormInput(e));

        // Collapsible sections
        document.querySelectorAll('.collapse-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleSection(e));
        });

        // Dynamic list management
        document.querySelectorAll('.add-item').forEach(btn => {
            btn.addEventListener('click', (e) => this.addDynamicItem(e));
        });

        // Header buttons
        document.getElementById('templateBtn').addEventListener('click', () => this.showTemplateModal());
        document.getElementById('saveBtn').addEventListener('click', () => this.showSaveModal());
        document.getElementById('loadBtn').addEventListener('click', () => this.showLoadModal());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportMonster());

        // Modal events
        document.getElementById('closeTemplateModal').addEventListener('click', () => this.hideModal('templateModal'));
        document.getElementById('closeSaveLoadModal').addEventListener('click', () => this.hideModal('saveLoadModal'));
        document.getElementById('confirmSave').addEventListener('click', () => this.saveMonster());

        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // Auto-update ability modifiers
        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(ability => {
            document.getElementById(ability).addEventListener('input', () => this.updateAbilityModifier(ability));
        });

        // CR change updates proficiency
        document.getElementById('cr').addEventListener('change', () => this.updateProficiencyFromCR());
    }

    handleFormInput(e) {
        const { id, value, type } = e.target;
        
        if (type === 'number') {
            this.currentMonster[id] = parseInt(value) || 0;
        } else {
            this.currentMonster[id] = value;
        }

        this.updatePreview();
    }

    updateAbilityModifier(ability) {
        const score = parseInt(document.getElementById(ability).value) || 10;
        const modifier = Math.floor((score - 10) / 2);
        const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        document.getElementById(`${ability}-mod`).textContent = modifierText;
        
        this.currentMonster[ability] = score;
        this.updatePreview();
    }

    updateProficiencyFromCR() {
        const cr = document.getElementById('cr').value;
        const crData = this.data.challengeRatings.find(c => c.cr === cr);
        if (crData) {
            document.getElementById('profBonus').value = crData.proficiency;
            document.getElementById('xpValue').textContent = `${crData.xp.toLocaleString()} XP`;
            this.currentMonster.profBonus = crData.proficiency;
            this.updatePreview();
        }
    }

    toggleSection(e) {
        const button = e.currentTarget;
        const content = button.parentElement.nextElementSibling;
        const icon = button.querySelector('.collapse-icon');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            content.style.display = 'none';
            button.setAttribute('aria-expanded', 'false');
            icon.textContent = '+';
        } else {
            content.style.display = 'block';
            button.setAttribute('aria-expanded', 'true');
            icon.textContent = '−';
        }
    }

    addDynamicItem(e) {
        const target = e.target.dataset.target;
        const container = document.getElementById(target);
        const addButton = e.target;
        
        const itemId = this.dynamicItemCounters[target]++;
        const item = this.createDynamicItem(target, itemId);
        
        container.insertBefore(item, addButton);
        
        // Initialize empty item in current monster data
        if (!this.currentMonster[target]) {
            this.currentMonster[target] = [];
        }
        this.currentMonster[target].push({ name: '', description: '' });
        
        this.updatePreview();
    }

    createDynamicItem(type, id) {
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <div class="dynamic-item-header">
                <button type="button" class="remove-item" onclick="app.removeDynamicItem('${type}', ${id}, this)">Remove</button>
            </div>
            <div class="form-group">
                <label class="form-label">Name</label>
                <input type="text" class="form-control dynamic-name" data-type="${type}" data-index="${id}" placeholder="Ability name">
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-control dynamic-description" data-type="${type}" data-index="${id}" rows="3" placeholder="Ability description"></textarea>
            </div>
        `;

        // Add event listeners to the new inputs
        const nameInput = div.querySelector('.dynamic-name');
        const descInput = div.querySelector('.dynamic-description');
        
        nameInput.addEventListener('input', (e) => this.updateDynamicItem(e));
        descInput.addEventListener('input', (e) => this.updateDynamicItem(e));

        return div;
    }

    removeDynamicItem(type, id, button) {
        const item = button.closest('.dynamic-item');
        const index = parseInt(id);
        
        // Remove from DOM
        item.remove();
        
        // Remove from data (find by matching index)
        const nameInput = item.querySelector('.dynamic-name');
        const actualIndex = Array.from(document.querySelectorAll(`.dynamic-name[data-type="${type}"]`))
            .indexOf(nameInput);
        
        if (actualIndex !== -1 && this.currentMonster[type]) {
            this.currentMonster[type].splice(actualIndex, 1);
        }
        
        this.updatePreview();
    }

    updateDynamicItem(e) {
        const { dataset: { type, index }, value, classList } = e.target;
        const isName = classList.contains('dynamic-name');
        
        if (!this.currentMonster[type]) {
            this.currentMonster[type] = [];
        }

        // Find the actual index in the array
        const allInputs = Array.from(document.querySelectorAll(`.dynamic-name[data-type="${type}"]`));
        const actualIndex = allInputs.indexOf(e.target.classList.contains('dynamic-name') ? e.target : 
            e.target.closest('.dynamic-item').querySelector('.dynamic-name'));

        if (actualIndex !== -1) {
            if (!this.currentMonster[type][actualIndex]) {
                this.currentMonster[type][actualIndex] = { name: '', description: '' };
            }
            
            if (isName) {
                this.currentMonster[type][actualIndex].name = value;
            } else {
                this.currentMonster[type][actualIndex].description = value;
            }
        }

        this.updatePreview();
    }

    updatePreview() {
        this.updateBasicInfo();
        this.updateStats();
        this.updateAbilityScores();
        this.updateChallengeRating();
        this.updateTraitsAndActions();
    }

    updateBasicInfo() {
        const name = this.currentMonster.name || 'Monster Name';
        const size = this.currentMonster.size || 'Medium';
        const type = this.currentMonster.type || 'humanoid';
        const alignment = this.currentMonster.alignment || 'neutral';

        document.getElementById('previewName').textContent = name;
        document.getElementById('previewMeta').innerHTML = `<em>${size} ${type.toLowerCase()}, ${alignment.toLowerCase()}</em>`;
    }

    updateStats() {
        const ac = this.currentMonster.ac || 10;
        const armorType = this.currentMonster.armorType || 'Natural Armor';
        const hp = this.currentMonster.hp || 1;
        const hitDice = this.currentMonster.hitDice || '';

        document.getElementById('previewAC').textContent = `${ac}${armorType !== 'Unarmored' ? ` (${armorType})` : ''}`;
        document.getElementById('previewHP').textContent = `${hp}${hitDice ? ` (${hitDice})` : ''}`;

        // Speed
        const speeds = [];
        if (this.currentMonster.walkSpeed > 0) speeds.push(`${this.currentMonster.walkSpeed} ft.`);
        if (this.currentMonster.flySpeed > 0) speeds.push(`fly ${this.currentMonster.flySpeed} ft.`);
        if (this.currentMonster.swimSpeed > 0) speeds.push(`swim ${this.currentMonster.swimSpeed} ft.`);
        if (this.currentMonster.climbSpeed > 0) speeds.push(`climb ${this.currentMonster.climbSpeed} ft.`);
        if (this.currentMonster.burrowSpeed > 0) speeds.push(`burrow ${this.currentMonster.burrowSpeed} ft.`);

        document.getElementById('previewSpeed').textContent = speeds.join(', ') || '30 ft.';
    }

    updateAbilityScores() {
        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(ability => {
            const score = this.currentMonster[ability] || 10;
            const modifier = Math.floor((score - 10) / 2);
            const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            
            document.getElementById(`preview${ability.charAt(0).toUpperCase() + ability.slice(1)}`).textContent = 
                `${score} (${modifierText})`;
        });
    }

    updateChallengeRating() {
        const cr = this.currentMonster.cr || '0';
        const crData = this.data.challengeRatings.find(c => c.cr === cr);
        const xp = crData ? crData.xp : 0;
        const profBonus = this.currentMonster.profBonus || 2;

        document.getElementById('previewCR').textContent = `${cr} (${xp.toLocaleString()} XP)`;
        document.getElementById('previewProf').textContent = `+${profBonus}`;
    }

    updateTraitsAndActions() {
        this.updateDynamicPreview('traits', 'previewTraits', 'traitsDiv');
        this.updateDynamicPreview('actions', 'previewActions', 'actionsDiv');
        this.updateDynamicPreview('bonusActions', 'previewBonusActions');
        this.updateDynamicPreview('reactions', 'previewReactions');
    }

    updateDynamicPreview(type, previewId, divId) {
        const container = document.getElementById(previewId);
        const items = this.currentMonster[type] || [];
        
        if (items.length === 0 || items.every(item => !item.name && !item.description)) {
            container.innerHTML = '';
            if (divId) {
                document.getElementById(divId).style.display = 'none';
            }
            return;
        }

        if (divId) {
            document.getElementById(divId).style.display = 'block';
        }

        let html = '';
        if (type === 'actions' && items.length > 0) {
            html += '<h4>Actions</h4>';
        } else if (type === 'bonusActions' && items.length > 0) {
            html += '<h4>Bonus Actions</h4>';
        } else if (type === 'reactions' && items.length > 0) {
            html += '<h4>Reactions</h4>';
        }

        items.forEach(item => {
            if (item.name || item.description) {
                html += `
                    <div class="${type === 'traits' ? 'trait-item' : 'action-item'}">
                        <span class="${type === 'traits' ? 'trait-name' : 'action-name'}">${item.name || 'Unnamed'}.</span>
                        <span class="${type === 'traits' ? 'trait-description' : 'action-description'}">${item.description || ''}</span>
                    </div>
                `;
            }
        });

        container.innerHTML = html;
    }

    // Template Management
    showTemplateModal() {
        const modal = document.getElementById('templateModal');
        const list = document.getElementById('templateList');
        
        list.innerHTML = '';
        this.data.templateMonsters.forEach((template, index) => {
            const item = document.createElement('div');
            item.className = 'template-item';
            item.innerHTML = `
                <div class="template-name">${template.name}</div>
                <div class="template-description">${template.size} ${template.type}, CR ${template.cr}</div>
            `;
            item.addEventListener('click', () => this.loadTemplate(template));
            list.appendChild(item);
        });
        
        modal.style.display = 'flex';
    }

    loadTemplate(template) {
        // Clear current monster
        this.currentMonster = { ...this.getEmptyMonster(), ...template };
        
        // Update form fields
        Object.keys(template).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = template[key];
                if (key.includes('Speed')) {
                    element.value = template[key] || 0;
                }
            }
        });

        // Update ability modifiers
        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(ability => {
            this.updateAbilityModifier(ability);
        });

        // Update CR-related fields
        this.updateProficiencyFromCR();
        this.updatePreview();
        this.hideModal('templateModal');
    }

    // Save/Load System
    showSaveModal() {
        document.getElementById('saveLoadTitle').textContent = 'Save Monster';
        document.getElementById('saveSection').style.display = 'block';
        document.getElementById('loadSection').style.display = 'none';
        document.getElementById('saveName').value = this.currentMonster.name || '';
        document.getElementById('saveLoadModal').style.display = 'flex';
    }

    showLoadModal() {
        document.getElementById('saveLoadTitle').textContent = 'Load Monster';
        document.getElementById('saveSection').style.display = 'none';
        document.getElementById('loadSection').style.display = 'block';
        this.populateLoadList();
        document.getElementById('saveLoadModal').style.display = 'flex';
    }

    saveMonster() {
        const name = document.getElementById('saveName').value.trim();
        if (!name) {
            alert('Please enter a monster name');
            return;
        }

        const savedMonsters = this.getSavedMonsters();
        const monsterData = { ...this.currentMonster, name };
        
        savedMonsters[name] = monsterData;
        localStorage.setItem('dndMonsters', JSON.stringify(savedMonsters));
        
        this.hideModal('saveLoadModal');
        alert('Monster saved successfully!');
    }

    getSavedMonsters() {
        const saved = localStorage.getItem('dndMonsters');
        return saved ? JSON.parse(saved) : {};
    }

    populateLoadList() {
        const list = document.getElementById('savedMonstersList');
        const saved = this.getSavedMonsters();
        
        list.innerHTML = '';
        
        if (Object.keys(saved).length === 0) {
            list.innerHTML = '<p>No saved monsters found.</p>';
            return;
        }

        Object.entries(saved).forEach(([name, data]) => {
            const item = document.createElement('div');
            item.className = 'saved-monster-item';
            item.innerHTML = `
                <div>
                    <div class="template-name">${name}</div>
                    <div class="template-description">${data.size || 'Medium'} ${data.type || 'Humanoid'}, CR ${data.cr || '0'}</div>
                </div>
                <div class="saved-monster-actions">
                    <button class="btn btn--sm btn--primary" onclick="app.loadSavedMonster('${name}')">Load</button>
                    <button class="btn btn--sm btn--outline" onclick="app.deleteSavedMonster('${name}')">Delete</button>
                </div>
            `;
            list.appendChild(item);
        });
    }

    loadSavedMonster(name) {
        const saved = this.getSavedMonsters();
        const monster = saved[name];
        
        if (!monster) {
            alert('Monster not found');
            return;
        }

        this.loadTemplate(monster);
        this.hideModal('saveLoadModal');
    }

    deleteSavedMonster(name) {
        if (!confirm(`Delete ${name}?`)) return;
        
        const saved = this.getSavedMonsters();
        delete saved[name];
        localStorage.setItem('dndMonsters', JSON.stringify(saved));
        this.populateLoadList();
    }

    loadSavedMonsters() {
        // This method can be used to populate a dropdown or similar UI element
        const saved = this.getSavedMonsters();
        return Object.keys(saved);
    }

    // Export functionality
    exportMonster() {
        const exportData = {
            ...this.currentMonster,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `${this.currentMonster.name || 'monster'}.json`;
        link.click();
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}

// Initialize the application
const app = new MonsterBuilder();

// Make app globally available for onclick handlers
window.app = app;