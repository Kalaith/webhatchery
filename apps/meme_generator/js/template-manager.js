import { Utils } from './utils.js';

// Template management functionality
export class TemplateManager {
    constructor(textManager) {
        this.textManager = textManager;
        this.templates = [
            {
                name: "Drake Pointing",
                description: "Classic Drake template",
                topText: "When you see bugs",
                bottomText: "When code works",
                icon: "👆"
            },
            {
                name: "Distracted Boyfriend", 
                description: "Looking at something new",
                topText: "Me",
                bottomText: "New framework",
                icon: "👀"
            },
            {
                name: "Woman Yelling at Cat",
                description: "Explaining vs confused",
                topText: "Me explaining code",
                bottomText: "My rubber duck",
                icon: "😾"
            },
            {
                name: "This is Fine",
                description: "Everything is fine",
                topText: "This is fine",
                bottomText: "Production is down",
                icon: "🔥"
            },
            {
                name: "Expanding Brain",
                description: "Levels of enlightenment",
                topText: "Small brain idea",
                bottomText: "Galaxy brain solution",
                icon: "🧠"
            },
            {
                name: "Two Buttons",
                description: "Difficult choices",
                topText: "Fix the bug",
                bottomText: "Ship anyway",
                icon: "🤔"
            },
            {
                name: "Change My Mind",
                description: "Controversial statements",
                topText: "CSS is awesome",
                bottomText: "Change my mind",
                icon: "💺"
            },
            {
                name: "Surprised Pikachu",
                description: "Unexpected consequences",
                topText: "Deploy on Friday",
                bottomText: "Weekend emergency",
                icon: "⚡"
            }
        ];
        
        this.init();
    }

    init() {
        this.populateTemplateGrid();
    }

    populateTemplateGrid() {
        const templateGrid = Utils.getElementById('templateGrid');
        if (!templateGrid) {
            console.warn('Template grid not found');
            return;
        }

        // Clear existing templates
        templateGrid.innerHTML = '';

        this.templates.forEach(template => {
            const templateItem = this.createTemplateItem(template);
            templateGrid.appendChild(templateItem);
        });
    }

    createTemplateItem(template) {
        const templateItem = Utils.createElement('div', 'template-item');
        
        templateItem.innerHTML = `
            <div class="template-icon">${template.icon}</div>
            <div class="template-info">
                <h4 class="template-name">${template.name}</h4>
                <p class="template-description">${template.description}</p>
                <div class="template-preview">
                    <span class="preview-text top">"${template.topText}"</span>
                    <span class="preview-text bottom">"${template.bottomText}"</span>
                </div>
            </div>
            <div class="template-actions">
                <button class="btn btn--sm btn--primary apply-template-btn">
                    Apply Template
                </button>
            </div>
        `;

        // Add click event listener
        const applyBtn = templateItem.querySelector('.apply-template-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', (e) => {
                Utils.stopPropagation(e);
                this.applyTemplate(template);
            });
        }

        // Add hover effects
        templateItem.addEventListener('mouseenter', () => {
            Utils.addClass(templateItem, 'template-item--hover');
        });

        templateItem.addEventListener('mouseleave', () => {
            Utils.removeClass(templateItem, 'template-item--hover');
        });

        return templateItem;
    }

    applyTemplate(template) {
        try {
            if (!this.textManager) {
                throw new Error('Text manager not available');
            }

            // Apply the template using the text manager
            this.textManager.applyTemplate(template);
            
            // Show success message
            this.showMessage(`Applied "${template.name}" template`);
            
            // Dispatch custom event for analytics/tracking
            this.dispatchTemplateEvent('template:applied', template);
            
        } catch (error) {
            this.handleError(error, 'applying template');
        }
    }

    addCustomTemplate(name, description, topText, bottomText, icon = '📝') {
        try {
            if (!Utils.isValidString(name)) {
                throw new Error('Template name is required');
            }

            const customTemplate = {
                name,
                description: description || 'Custom template',
                topText: topText || 'Top text',
                bottomText: bottomText || 'Bottom text',
                icon,
                isCustom: true
            };

            this.templates.push(customTemplate);
            this.populateTemplateGrid();
            
            this.showMessage(`Custom template "${name}" added`);
            
            return customTemplate;
            
        } catch (error) {
            this.handleError(error, 'adding custom template');
            return null;
        }
    }

    removeCustomTemplate(templateName) {
        try {
            const index = this.templates.findIndex(t => t.name === templateName && t.isCustom);
            
            if (index === -1) {
                throw new Error('Custom template not found');
            }

            this.templates.splice(index, 1);
            this.populateTemplateGrid();
            
            this.showMessage(`Custom template "${templateName}" removed`);
            
        } catch (error) {
            this.handleError(error, 'removing custom template');
        }
    }

    getTemplateByName(name) {
        return this.templates.find(template => template.name === name);
    }

    searchTemplates(query) {
        if (!Utils.isValidString(query)) {
            return this.templates;
        }

        const lowerQuery = query.toLowerCase();
        return this.templates.filter(template => 
            template.name.toLowerCase().includes(lowerQuery) ||
            template.description.toLowerCase().includes(lowerQuery) ||
            template.topText.toLowerCase().includes(lowerQuery) ||
            template.bottomText.toLowerCase().includes(lowerQuery)
        );
    }

    filterTemplateGrid(query = '') {
        const templateGrid = Utils.getElementById('templateGrid');
        if (!templateGrid) return;

        const filteredTemplates = this.searchTemplates(query);
        
        // Clear grid
        templateGrid.innerHTML = '';
        
        if (filteredTemplates.length === 0) {
            templateGrid.innerHTML = `
                <div class="template-empty-state">
                    <div class="empty-icon">🔍</div>
                    <h4>No templates found</h4>
                    <p>Try a different search term</p>
                </div>
            `;
            return;
        }

        // Populate with filtered results
        filteredTemplates.forEach(template => {
            const templateItem = this.createTemplateItem(template);
            templateGrid.appendChild(templateItem);
        });
    }

    exportTemplates() {
        try {
            const customTemplates = this.templates.filter(t => t.isCustom);
            
            if (customTemplates.length === 0) {
                this.showMessage('No custom templates to export', 'info');
                return;
            }

            const dataStr = JSON.stringify(customTemplates, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = 'meme-templates.json';
            link.click();
            
            this.showMessage(`Exported ${customTemplates.length} custom templates`);
            
        } catch (error) {
            this.handleError(error, 'exporting templates');
        }
    }

    importTemplates(file) {
        try {
            if (!file || file.type !== 'application/json') {
                throw new Error('Please select a valid JSON file');
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importedTemplates = JSON.parse(e.target.result);
                    
                    if (!Array.isArray(importedTemplates)) {
                        throw new Error('Invalid template file format');
                    }

                    let importCount = 0;
                    
                    importedTemplates.forEach(template => {
                        if (this.validateTemplate(template)) {
                            template.isCustom = true;
                            this.templates.push(template);
                            importCount++;
                        }
                    });

                    if (importCount > 0) {
                        this.populateTemplateGrid();
                        this.showMessage(`Imported ${importCount} templates`);
                    } else {
                        this.showMessage('No valid templates found in file', 'warning');
                    }
                    
                } catch (parseError) {
                    this.handleError(parseError, 'parsing template file');
                }
            };

            reader.onerror = () => {
                this.handleError(new Error('Failed to read file'), 'reading template file');
            };

            reader.readAsText(file);
            
        } catch (error) {
            this.handleError(error, 'importing templates');
        }
    }

    validateTemplate(template) {
        return template &&
               Utils.isValidString(template.name) &&
               Utils.isValidString(template.topText) &&
               Utils.isValidString(template.bottomText);
    }

    // Utility methods
    dispatchTemplateEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    handleError(error, context) {
        Utils.logError(error, `TemplateManager ${context}`);
        this.showMessage(`Error ${context}: ${error.message}`, 'error');
    }

    showMessage(text, type = 'info') {
        const event = new CustomEvent('app:notification', {
            detail: { message: text, type }
        });
        document.dispatchEvent(event);
    }

    // Public API
    getTemplateCount() {
        return this.templates.length;
    }

    getCustomTemplateCount() {
        return this.templates.filter(t => t.isCustom).length;
    }

    getAllTemplates() {
        return [...this.templates];
    }

    getBuiltinTemplates() {
        return this.templates.filter(t => !t.isCustom);
    }

    getCustomTemplates() {
        return this.templates.filter(t => t.isCustom);
    }

    destroy() {
        // Clean up any resources if needed
        const templateGrid = Utils.getElementById('templateGrid');
        if (templateGrid) {
            templateGrid.innerHTML = '';
        }
    }
}
