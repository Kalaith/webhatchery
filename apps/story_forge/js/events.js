import { api } from './api.js';
import { ui } from './ui.js';

class Events {
    constructor() {
        this.app = null; // Will be set by the app
    }

    init(app) {
        this.app = app;
        this.bindEvents();
    }

    bindEvents() {
        // Navigation
        document.getElementById('loginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            ui.showLoginModal();
        });

        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.app.logout();
        });

        document.getElementById('dashboardBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            ui.showDashboard();
        });

        document.getElementById('createStoryBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            ui.showStoryCreation();
        });

        document.getElementById('backToHomeBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            ui.showHomepage();
        });

        document.getElementById('backToDashboardBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            ui.showDashboard();
        });

        // Login modal
        document.getElementById('closeLoginModal').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            ui.hideLoginModal();
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleLogin(e);
        });

        // Story creation
        document.getElementById('cancelStoryCreation').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            ui.showHomepage();
        });

        document.getElementById('storyCreationForm').addEventListener('submit', (e) => this.handleStoryCreation(e));

        // Search and filters
        document.getElementById('searchInput').addEventListener('input', () => ui.renderStories());
        document.getElementById('genreFilter').addEventListener('change', () => ui.renderStories());
        document.getElementById('accessFilter').addEventListener('change', () => ui.renderStories());

        // Writing interface
        document.getElementById('contributeBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            ui.showWritingInterface();
        });

        document.getElementById('cancelWriting').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            ui.showStoryReading(this.app.currentStory);
        });

        document.getElementById('submitSampleBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.submitWritingSample();
        });

        document.getElementById('submitParagraph').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.submitParagraph();
        });

        // Story management
        document.getElementById('manageStoryBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            ui.showStoryManagement();
        });

        // Dashboard tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.switchTab(e);
            });
        });

        // Modal click outside to close
        document.getElementById('loginModal').addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') {
                ui.hideLoginModal();
            }
        });
    }

    handleLogin(e) {
        const usernameSelect = document.getElementById('username');
        const username = usernameSelect.value;
        
        if (!username) {
            ui.showToast('Please select a user', 'error');
            return;
        }
        
        const user = api.getUserByUsername(username);
        
        if (user) {
            this.app.currentUser = user;
            ui.update();
            ui.hideLoginModal();
            ui.showToast(`Welcome back, ${user.username}!`);
        } else {
            ui.showToast('User not found', 'error');
        }
    }

    handleStoryCreation(e) {
        e.preventDefault();
        
        const newStoryData = {
            title: document.getElementById('storyTitle').value,
            genre: document.getElementById('storyGenre').value,
            description: document.getElementById('storyDescription').value,
            createdBy: this.app.currentUser.id,
            accessLevel: document.getElementById('accessLevel').value,
            requireExamples: document.getElementById('requireExamples').checked,
            author: this.app.currentUser.username,
            firstParagraph: document.getElementById('firstParagraph').value
        };

        const newStory = api.createStory(newStoryData);
        ui.showToast('Story created successfully!');
        ui.showStoryReading(newStory);
        
        document.getElementById('storyCreationForm').reset();
    }

    submitWritingSample() {
        const content = document.getElementById('writingSample').value.trim();
        if (!content) {
            ui.showToast('Please provide a writing sample', 'error');
            return;
        }

        const sampleData = {
            userId: this.app.currentUser.id,
            storyId: this.app.currentStory.id,
            content: content
        };

        api.addWritingSample(sampleData);
        ui.showToast('Writing sample submitted for review');
        
        setTimeout(() => {
            api.updateWritingSample(this.app.currentUser.id, this.app.currentStory.id, { status: 'approved' });
            if (!this.app.currentStory.approvedContributors.includes(this.app.currentUser.id)) {
                this.app.currentStory.approvedContributors.push(this.app.currentUser.id);
            }
            ui.showToast('Your writing sample has been approved!');
            ui.renderWritingInterface();
        }, 2000);
    }

    submitParagraph() {
        const content = document.getElementById('newParagraph').value.trim();
        if (!content) {
            ui.showToast('Please write a paragraph', 'error');
            return;
        }

        const paragraphData = {
            author: this.app.currentUser.username,
            content: content
        };

        api.addParagraph(this.app.currentStory.id, paragraphData);
        ui.showToast('Paragraph added successfully!');
        ui.showStoryReading(this.app.currentStory);
        
        this.app.currentUser.contributions++;
        
        document.getElementById('newParagraph').value = '';
    }

    toggleBlockUser(userId) {
        const index = this.app.currentStory.blockedUsers.indexOf(userId);
        if (index > -1) {
            this.app.currentStory.blockedUsers.splice(index, 1);
            ui.showToast('User unblocked');
        } else {
            this.app.currentStory.blockedUsers.push(userId);
            ui.showToast('User blocked');
        }
        ui.renderContributorsManagement();
    }

    approveSample(userId, storyId) {
        api.updateWritingSample(userId, storyId, { status: 'approved' });
        if (!this.app.currentStory.approvedContributors.includes(parseInt(userId))) {
            this.app.currentStory.approvedContributors.push(parseInt(userId));
        }
        ui.showToast('Writing sample approved');
        ui.renderWritingSamplesManagement();
    }

    rejectSample(userId, storyId) {
        api.updateWritingSample(userId, storyId, { status: 'rejected' });
        ui.showToast('Writing sample rejected');
        ui.renderWritingSamplesManagement();
    }

    updateStorySettings() {
        const accessLevel = document.getElementById('editAccessLevel').value;
        const requireExamples = document.getElementById('editRequireExamples').checked;
        
        api.updateStory(this.app.currentStory.id, { accessLevel, requireExamples });
        ui.showToast('Settings updated');
    }

    switchTab(e) {
        const tabName = e.target.dataset.tab;
        const isManagementTab = e.target.closest('.management-tabs');
        
        if (isManagementTab) {
            document.querySelectorAll('.management-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            document.querySelectorAll('#storyManagementView .tab-panel').forEach(panel => panel.classList.add('hidden'));
            
            if (tabName === 'contributors') {
                document.getElementById('contributorsTab').classList.remove('hidden');
            } else if (tabName === 'writingSamples') {
                document.getElementById('writingSamplesTab').classList.remove('hidden');
            } else if (tabName === 'settings') {
                document.getElementById('settingsTab').classList.remove('hidden');
            }
        } else {
            document.querySelectorAll('.dashboard-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            document.querySelectorAll('#dashboardView .tab-panel').forEach(panel => panel.classList.add('hidden'));
            
            if (tabName === 'myStories') {
                document.getElementById('myStoriesTab').classList.remove('hidden');
            } else if (tabName === 'myContributions') {
                document.getElementById('myContributionsTab').classList.remove('hidden');
            } else if (tabName === 'managementPanel') {
                document.getElementById('managementPanelTab').classList.remove('hidden');
            }
        }
    }
}

export const events = new Events();