// Stakeholder management functionality
class StakeholderManager {
    constructor(projectManager) {
        this.manager = projectManager;
        this.stakeholders = [];
    }

    addStakeholder() {
        const stakeholdersList = document.getElementById('stakeholdersList');
        if (!stakeholdersList) return;

        const stakeholderIndex = this.stakeholders.length;
        
        const stakeholderDiv = document.createElement('div');
        stakeholderDiv.className = 'stakeholder-item';
        stakeholderDiv.setAttribute('data-index', stakeholderIndex);
        stakeholderDiv.innerHTML = `
            <input type="text" placeholder="Stakeholder name *" class="form-control" data-stakeholder-name="${stakeholderIndex}">
            <select class="form-control" data-stakeholder-type="${stakeholderIndex}">
                <option value="">Select role...</option>
                ${this.manager.data.stakeholderTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
            <button type="button" class="remove-stakeholder" onclick="projectManager.stakeholderManager.removeStakeholder(${stakeholderIndex})">Remove</button>
        `;
        
        stakeholdersList.appendChild(stakeholderDiv);
        
        const nameInput = stakeholderDiv.querySelector(`[data-stakeholder-name="${stakeholderIndex}"]`);
        const typeSelect = stakeholderDiv.querySelector(`[data-stakeholder-type="${stakeholderIndex}"]`);
        
        if (nameInput) {
            nameInput.addEventListener('input', () => this.updateStakeholder(stakeholderIndex, 'name', nameInput.value));
        }
        if (typeSelect) {
            typeSelect.addEventListener('change', () => this.updateStakeholder(stakeholderIndex, 'type', typeSelect.value));
        }

        this.stakeholders.push({ name: '', type: '' });
    }

    addStakeholderWithData(stakeholderData, index) {
        const stakeholdersList = document.getElementById('stakeholdersList');
        if (!stakeholdersList) return;

        const stakeholderDiv = document.createElement('div');
        stakeholderDiv.className = 'stakeholder-item';
        stakeholderDiv.setAttribute('data-index', index);
        stakeholderDiv.innerHTML = `
            <input type="text" placeholder="Stakeholder name *" class="form-control" data-stakeholder-name="${index}" value="${stakeholderData.name || ''}">
            <select class="form-control" data-stakeholder-type="${index}">
                <option value="">Select role...</option>
                ${this.manager.data.stakeholderTypes.map(type => `<option value="${type}" ${type === stakeholderData.type ? 'selected' : ''}>${type}</option>`).join('')}
            </select>
            <button type="button" class="remove-stakeholder" onclick="projectManager.stakeholderManager.removeStakeholder(${index})">Remove</button>
        `;
        
        stakeholdersList.appendChild(stakeholderDiv);
        
        const nameInput = stakeholderDiv.querySelector(`[data-stakeholder-name="${index}"]`);
        const typeSelect = stakeholderDiv.querySelector(`[data-stakeholder-type="${index}"]`);
        
        if (nameInput) {
            nameInput.addEventListener('input', () => this.updateStakeholder(index, 'name', nameInput.value));
        }
        if (typeSelect) {
            typeSelect.addEventListener('change', () => this.updateStakeholder(index, 'type', typeSelect.value));
        }
    }

    removeStakeholder(index) {
        const stakeholderItem = document.querySelector(`[data-index="${index}"]`);
        const stakeholderItems = document.querySelectorAll('.stakeholder-item');
        
        if (stakeholderItems.length > 1 && stakeholderItem) {
            stakeholderItem.remove();
            this.stakeholders.splice(index, 1);
            this.reindexStakeholders();
        }
    }

    updateStakeholder(index, field, value) {
        if (this.stakeholders[index]) {
            this.stakeholders[index][field] = value;
        }
    }

    reindexStakeholders() {
        const stakeholderItems = document.querySelectorAll('.stakeholder-item');
        stakeholderItems.forEach((item, index) => {
            item.setAttribute('data-index', index);
            
            const nameInput = item.querySelector('[data-stakeholder-name]');
            const typeSelect = item.querySelector('[data-stakeholder-type]');
            const removeBtn = item.querySelector('.remove-stakeholder');
            
            if (nameInput) nameInput.setAttribute('data-stakeholder-name', index);
            if (typeSelect) typeSelect.setAttribute('data-stakeholder-type', index);
            if (removeBtn) removeBtn.setAttribute('onclick', `projectManager.stakeholderManager.removeStakeholder(${index})`);
        });    }
    
    getValidStakeholders() {
        return this.stakeholders.filter(s => s.name.trim() && s.type.trim());
    }
    
    recreateStakeholder(index, stakeholderData) {
        const stakeholdersList = document.getElementById('stakeholdersList');
        if (!stakeholdersList) return;

        const stakeholderDiv = document.createElement('div');
        stakeholderDiv.className = 'stakeholder-item';
        stakeholderDiv.setAttribute('data-index', index);
        stakeholderDiv.innerHTML = `
            <input type="text" placeholder="Stakeholder name *" class="form-control" data-stakeholder-name="${index}" value="${stakeholderData.name || ''}">
            <select class="form-control" data-stakeholder-type="${index}">
                <option value="">Select role...</option>
                ${this.manager.data.stakeholderTypes.map(type => `<option value="${type}" ${type === stakeholderData.type ? 'selected' : ''}>${type}</option>`).join('')}
            </select>
            <button type="button" class="remove-stakeholder" onclick="projectManager.stakeholderManager.removeStakeholder(${index})">Remove</button>
        `;
        
        stakeholdersList.appendChild(stakeholderDiv);
        
        const nameInput = stakeholderDiv.querySelector(`[data-stakeholder-name="${index}"]`);
        const typeSelect = stakeholderDiv.querySelector(`[data-stakeholder-type="${index}"]`);
        
        if (nameInput) {
            nameInput.addEventListener('input', () => this.updateStakeholder(index, 'name', nameInput.value));
        }
        if (typeSelect) {
            typeSelect.addEventListener('change', () => this.updateStakeholder(index, 'type', typeSelect.value));
        }
    }

    restoreStakeholders(stakeholderData) {
        this.clear();
        if (stakeholderData && Array.isArray(stakeholderData)) {
            stakeholderData.forEach(stakeholder => {
                this.stakeholders.push({ ...stakeholder });
                this.recreateStakeholder(this.stakeholders.length - 1, stakeholder);
            });
        }
    }

    clear() {
        this.stakeholders = [];
        const stakeholdersList = document.getElementById('stakeholdersList');
        if (stakeholdersList) {
            stakeholdersList.innerHTML = '';
        }
    }
}
