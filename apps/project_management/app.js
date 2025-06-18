// AI Project Manager Application - Refactored
class ProjectManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.projectData = {};
        this.autoSaveInterval = null;
        this.data = null;
        this.stakeholderManager = null;
        this.exporter = null;
        this.reportGenerator = null;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        try {
            await this.loadProjectData();
            this.stakeholderManager = new StakeholderManager(this);
            this.exporter = new ProjectExporter(this);
            this.reportGenerator = new ReportGenerator(this);
            
            this.setupEventListeners();
            this.populateDropdowns();
            this.hideAllSteps(); // Hide all steps initially
            this.loadFromStorage(); // Move after stakeholder manager is initialized
            this.updateProgress();
            this.startAutoSave();
            
            // Don't add stakeholders automatically during init - wait for user to start project
        } catch (error) {
            console.error('Failed to initialize application:', error);
            ProjectUtils.showNotification('Failed to load application data', 'error');
        }
    }

    async loadProjectData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading project data:', error);
            ProjectUtils.showNotification('Failed to load data file. Using minimal defaults.', 'warning');
            // Provide more complete fallback data
            this.data = {
                projectTypes: ["Software Development", "Marketing Campaign", "Product Launch", "Process Improvement", "Event Planning"],
                timelineOptions: ["1-2 weeks", "1 month", "2-3 months", "3-6 months", "6-12 months", "More than 1 year"],
                budgetRanges: ["Under $10K", "$10K - $50K", "$50K - $100K", "$100K - $500K", "$500K - $1M", "Over $1M"],
                stakeholderTypes: ["Project Sponsor", "End Users", "Development Team", "Management", "External Vendors", "Customers"],
                riskCategories: ["Technical", "Financial", "Timeline", "Resource", "Market", "Regulatory"],
                projectTemplates: {}, 
                stakeholderInfluenceMap: {}, 
                defaultRisks: [],
                timelineMap: {},
                baseMilestones: []
            };
        }
    }

    setupEventListeners() {
        const buttons = [
            ['startProjectBtn', () => { 
                console.log('DEBUG: Start Project button clicked');
                // If no saved data, start fresh at step 1
                if (!localStorage.getItem('ai-project-manager')) {
                    this.currentStep = 1;
                    console.log('DEBUG: No saved data, starting at step 1');
                } else {
                    console.log('DEBUG: Found saved data, current step:', this.currentStep);
                }
                this.showView('questionnaire'); 
                console.log('DEBUG: Switched to questionnaire view');
                // Navigate to the current step (handles all UI updates)
                setTimeout(() => {
                    console.log('DEBUG: About to navigate to step:', this.currentStep);
                    this.navigateToStep(this.currentStep);
                }, 10);
            }],
            ['nextBtn', () => this.nextStep()],
            ['prevBtn', () => this.prevStep()],
            ['generateBtn', () => this.generateProject()],
            ['resetBtn', () => this.resetProject()],
            ['newProjectBtn', () => this.resetProject()],
            ['exportBtn', () => this.exporter.showExportOptions()],
            ['addStakeholderBtn', () => this.stakeholderManager.addStakeholder()]
        ];
        
        buttons.forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', handler);
        });

        const form = document.getElementById('projectForm');
        if (form) {
            form.addEventListener('input', (e) => {
                if (e.target.matches('input, select, textarea')) {
                    e.target.dataset.touched = 'true';
                }
                this.saveCurrentStepData();
            });
            form.addEventListener('change', (e) => {
                if (e.target.id === 'projectType' && e.target.value) {
                    this.applyTemplate(e.target.value);
                }
            });
        }
        document.addEventListener('keydown', (e) => ProjectUtils.handleKeyNavigation(e, this));
    }

    populateDropdowns() {
        const dropdowns = [
            ['projectType', this.data.projectTypes],
            ['timeline', this.data.timelineOptions],
            ['budget', this.data.budgetRanges]
        ];
        
        dropdowns.forEach(([id, options]) => {
            const select = document.getElementById(id);
            if (select && options) {
                options.forEach(option => {
                    const optionEl = document.createElement('option');
                    optionEl.value = option;
                    optionEl.textContent = option;
                    select.appendChild(optionEl);
                });
            }
        });
    }

    showView(viewName) {
        document.querySelectorAll('.view').forEach(view => view.classList.remove('view--active'));
        const targetView = document.getElementById(viewName + 'View');
        if (targetView) targetView.classList.add('view--active');
    }

    hideAllSteps() {
        console.log('DEBUG: hideAllSteps called');
        // Hide all form steps initially until user starts a project
        document.querySelectorAll('.form-step').forEach(stepEl => {
            stepEl.style.display = 'none';
        });
        console.log('DEBUG: All form steps hidden via inline styles');
        
        // Hide navigation buttons
        const buttons = ['prevBtn', 'nextBtn', 'generateBtn'];
        buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) btn.style.display = 'none';
        });
        console.log('DEBUG: Navigation buttons hidden');
        
        // Also hide progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.display = 'none';
            console.log('DEBUG: Progress bar hidden');
        }
    }

    nextStep() {
        if (!this.validateCurrentStep()) return;
        this.saveCurrentStepData();
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.navigateToStep(this.currentStep);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.navigateToStep(this.currentStep);
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${((this.currentStep - 1) / (this.totalSteps - 1)) * 100}%`;
        }
    }

    showStep(step) {
        console.log(`DEBUG: showStep called with step ${step}`);
        
        // First hide all steps
        document.querySelectorAll('.form-step').forEach(stepEl => {
            stepEl.style.display = 'none';
            console.log(`DEBUG: Hidden step with data-step="${stepEl.getAttribute('data-step')}"`);
        });
        
        // Then show the target step - use more specific selector
        const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        if (currentStepEl) {
            console.log(`DEBUG: BEFORE setting display - Step ${step} inline style:`, currentStepEl.style.display);
            console.log(`DEBUG: BEFORE setting display - Step ${step} computed style:`, window.getComputedStyle(currentStepEl).display);
            
            currentStepEl.style.display = 'block';
            
            console.log(`DEBUG: AFTER setting display - Step ${step} inline style:`, currentStepEl.style.display);
            console.log(`DEBUG: AFTER setting display - Step ${step} computed style:`, window.getComputedStyle(currentStepEl).display);
            console.log(`DEBUG: Step ${step} element classes:`, currentStepEl.className);
            console.log(`DEBUG: Step ${step} element:`, currentStepEl);
            
            // Force a check after a brief timeout to see if something is overriding it
            setTimeout(() => {
                console.log(`DEBUG: TIMEOUT CHECK - Step ${step} inline style:`, currentStepEl.style.display);
                console.log(`DEBUG: TIMEOUT CHECK - Step ${step} computed style:`, window.getComputedStyle(currentStepEl).display);
            }, 50);
        } else {
            console.log(`DEBUG: Step ${step} element not found`);
        }
    }

    updateButtonVisibility(step) {
        const btns = [document.getElementById('prevBtn'), document.getElementById('nextBtn'), document.getElementById('generateBtn')];
        if (btns[0]) btns[0].style.display = step > 1 ? 'inline-block' : 'none';
        if (btns[1]) btns[1].style.display = step < this.totalSteps ? 'inline-block' : 'none';
        if (btns[2]) btns[2].style.display = step === this.totalSteps ? 'inline-block' : 'none';
    }

    updateProgressIndicators(step) {
        document.querySelectorAll('.progress-step').forEach((progressStep, index) => {
            const stepNumber = index + 1;
            progressStep.classList.remove('progress-step--active', 'progress-step--completed');
            if (stepNumber < step) progressStep.classList.add('progress-step--completed');
            else if (stepNumber === step) progressStep.classList.add('progress-step--active');
        });
    }

    showProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.display = 'block';
            console.log('DEBUG: Progress bar shown');
        } else {
            console.log('DEBUG: Progress bar not found');
        }
    }

    initializeStakeholderIfNeeded(step) {
        if (step === 2 && this.stakeholderManager && this.stakeholderManager.stakeholders.length === 0) {
            setTimeout(() => this.stakeholderManager.addStakeholder(), 100);
        }
    }

    navigateToStep(step) {
        console.log(`DEBUG: navigateToStep called with step ${step}`);
        
        // Update current step
        this.currentStep = step;
        
        // Show progress bar when navigating to any step
        this.showProgressBar();
        
        // Show the step (single responsibility)
        this.showStep(step);
        
        // Update all UI elements
        this.updateButtonVisibility(step);
        this.updateProgressIndicators(step);
        this.updateProgress();
        
        // Handle step-specific initialization
        this.initializeStakeholderIfNeeded(step);
    }

    applyTemplate(projectType) {
        const template = this.data.projectTemplates[projectType];
        if (!template) return;
        ['projectDescription', 'objectives', 'deliverables', 'successCriteria', 'potentialRisks', 'mitigationStrategies'].forEach(field => {
            const element = document.getElementById(field);
            if (element && template[field] && !element.value.trim()) {
                element.value = template[field];
                element.dataset.touched = 'true';
            }
        });
        ProjectUtils.showNotification(`Applied ${projectType} template`, 'success');
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return true;
        let isValid = true;
        currentStepElement.querySelectorAll('[required]').forEach(field => {
            ProjectUtils.clearFieldError(field);
            if (!field.value.trim()) {
                ProjectUtils.showFieldError(field, `${ProjectUtils.getFieldLabel(field)} is required`);
                isValid = false;
            }
        });
        if (this.currentStep === 2 && this.stakeholderManager.getValidStakeholders().length === 0) {
            ProjectUtils.showNotification('Please add at least one stakeholder', 'error');
            isValid = false;
        }
        return isValid;
    }

    async generateProject() {
        this.saveCurrentStepData();
        this.showView('processing');
        
        const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
        const texts = ['✓ Analyzing project requirements', '⏳ Generating project charter', '⏳ Assessing risks', '⏳ Creating timeline', '⏳ Finalizing recommendations'];
        
        steps.forEach((step, i) => {
            const element = document.getElementById(step);
            if (element) {
                element.classList.remove('completed', 'active');
                element.textContent = texts[i];
            }
        });
        
        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            const element = document.getElementById(steps[i]);
            if (element) {
                element.classList.add('completed');
                element.textContent = texts[i].replace('⏳', '✓');
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        this.reportGenerator.generateResults();
        this.showView('results');
    }

    resetProject() {
        console.log('DEBUG: resetProject called');
        localStorage.removeItem('ai-project-manager');
        this.currentStep = 1;
        this.projectData = {};
        this.stakeholderManager.stakeholders = [];
        const form = document.getElementById('projectForm');
        if (form) form.reset();
        const stakeholdersList = document.getElementById('stakeholdersList');
        if (stakeholdersList) stakeholdersList.innerHTML = '';
        this.hideAllSteps(); // Hide all steps initially
        this.updateProgress();
        this.showView('landing');
        console.log('DEBUG: Project reset, showing landing view');
        ProjectUtils.showNotification('Project reset successfully', 'info');
    }

    startAutoSave() { this.autoSaveInterval = setInterval(() => this.saveToStorage(), 30000); }
    stopAutoSave() { if (this.autoSaveInterval) { clearInterval(this.autoSaveInterval); this.autoSaveInterval = null; } }

    saveToStorage() {
        this.saveCurrentStepData();
        try {
            localStorage.setItem('ai-project-manager', JSON.stringify({
                currentStep: this.currentStep,
                projectData: this.projectData,
                stakeholders: this.stakeholderManager.stakeholders,
                timestamp: new Date().toISOString()
            }));
        } catch (error) { console.warn('Failed to save to localStorage:', error); }
    }

    loadFromStorage() {
        try {
            const savedData = localStorage.getItem('ai-project-manager');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.currentStep = data.currentStep || 1;
                this.projectData = data.projectData || {};
                
                if (data.stakeholders && this.stakeholderManager && typeof this.stakeholderManager.restoreStakeholders === 'function') {
                    this.stakeholderManager.restoreStakeholders(data.stakeholders);
                } else if (data.stakeholders) {
                    // Fallback: directly set stakeholders if restoreStakeholders method doesn't exist
                    this.stakeholderManager.stakeholders = data.stakeholders;
                }
                
                Object.keys(this.projectData).forEach(key => {
                    const element = document.getElementById(key);
                    if (element && this.projectData[key]) {
                        element.value = this.projectData[key];
                        element.dataset.touched = 'true';
                    }
                });
                ProjectUtils.showNotification('Previous session restored', 'info');
            }
        } catch (error) { console.warn('Failed to load from localStorage:', error); }
    }

    saveCurrentStepData() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return;
        currentStepElement.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.name) this.projectData[input.name] = input.value;
        });
        if (this.currentStep === 2 && this.stakeholderManager) {
            this.projectData.stakeholders = this.stakeholderManager.getValidStakeholders();
        }
    }
}

const projectManager = new ProjectManager();
window.projectManager = projectManager;
