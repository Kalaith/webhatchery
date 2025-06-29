import { api } from './api.js';

class UI {
    constructor() {
        this.app = null; // Will be set by the app
    }

    init(app) {
        this.app = app;
    }

    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
        this.app.currentView = viewId;
    }

    showHomepage() {
        this.showView('homepageView');
        this.renderStories();
    }

    showStoryReading(story) {
        this.app.currentStory = story;
        this.showView('storyReadingView');
        this.renderStoryDetails();
        this.update();
    }

    showStoryCreation() {
        if (!this.app.currentUser) {
            this.showToast('Please sign in to create stories', 'error');
            return;
        }
        this.showView('storyCreationView');
    }

    showWritingInterface() {
        if (!this.app.currentUser) {
            this.showToast('Please sign in to contribute', 'error');
            return;
        }

        if (!this.app.canUserContribute(this.app.currentUser.id, this.app.currentStory)) {
            this.showToast('You cannot contribute to this story', 'error');
            return;
        }

        this.showView('writingView');
        this.renderWritingInterface();
    }

    showDashboard() {
        if (!this.app.currentUser) {
            this.showToast('Please sign in to access dashboard', 'error');
            return;
        }
        this.showView('dashboardView');
        this.renderDashboard();
        
        const dashboardTabs = document.querySelectorAll('.dashboard-tabs .tab-btn');
        const dashboardPanels = document.querySelectorAll('#dashboardView .tab-panel');
        
        dashboardTabs.forEach(btn => btn.classList.remove('active'));
        dashboardPanels.forEach(panel => panel.classList.add('hidden'));
        
        const firstTab = document.querySelector('.dashboard-tabs .tab-btn[data-tab="myStories"]');
        const firstPanel = document.getElementById('myStoriesTab');
        
        if (firstTab) firstTab.classList.add('active');
        if (firstPanel) firstPanel.classList.remove('hidden');
    }

    showStoryManagement() {
        if (!this.app.currentUser || this.app.currentStory.createdBy !== this.app.currentUser.id) {
            this.showToast('Access denied', 'error');
            return;
        }
        this.showView('storyManagementView');
        this.renderStoryManagement();
        
        const managementTabs = document.querySelectorAll('.management-tabs .tab-btn');
        const managementPanels = document.querySelectorAll('#storyManagementView .tab-panel');
        
        managementTabs.forEach(btn => btn.classList.remove('active'));
        managementPanels.forEach(panel => panel.classList.add('hidden'));
        
        const firstTab = document.querySelector('.management-tabs .tab-btn[data-tab="contributors"]');
        const firstPanel = document.getElementById('contributorsTab');
        
        if (firstTab) firstTab.classList.add('active');
        if (firstPanel) firstPanel.classList.remove('hidden');
    }

    update() {
        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');
        const createStoryBtn = document.getElementById('createStoryBtn');
        const currentUserName = document.getElementById('currentUserName');

        if (this.app.currentUser) {
            if (loginBtn) loginBtn.classList.add('hidden');
            if (userProfile) userProfile.classList.remove('hidden');
            if (currentUserName) currentUserName.textContent = this.app.currentUser.username;
            if (createStoryBtn) createStoryBtn.classList.remove('hidden');
        } else {
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (userProfile) userProfile.classList.add('hidden');
            if (createStoryBtn) createStoryBtn.classList.add('hidden');
        }

        const contributeBtn = document.getElementById('contributeBtn');
        if (this.app.currentView === 'storyReadingView' && this.app.currentStory && contributeBtn) {
            if (this.app.currentUser && this.app.canUserContribute(this.app.currentUser.id, this.app.currentStory)) {
                contributeBtn.classList.remove('hidden');
            } else {
                contributeBtn.classList.add('hidden');
            }
        }
    }

    populateGenres() {
        const genreSelects = [
            document.getElementById('genreFilter'),
            document.getElementById('storyGenre')
        ];

        genreSelects.forEach(select => {
            if (select) {
                while (select.children.length > 1) {
                    select.removeChild(select.lastChild);
                }
                
                api.getGenres().forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre;
                    option.textContent = genre;
                    select.appendChild(option);
                });
            }
        });
    }

    renderStories() {
        const grid = document.getElementById('storiesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';

        let filteredStories = api.getStories();
        
        const searchInput = document.getElementById('searchInput');
        const genreFilter = document.getElementById('genreFilter');
        const accessFilter = document.getElementById('accessFilter');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const genreFilterValue = genreFilter ? genreFilter.value : '';
        const accessFilterValue = accessFilter ? accessFilter.value : '';

        if (searchTerm) {
            filteredStories = filteredStories.filter(story => 
                story.title.toLowerCase().includes(searchTerm) ||
                story.description.toLowerCase().includes(searchTerm)
            );
        }

        if (genreFilterValue) {
            filteredStories = filteredStories.filter(story => story.genre === genreFilterValue);
        }

        if (accessFilterValue) {
            filteredStories = filteredStories.filter(story => story.accessLevel === accessFilterValue);
        }

        filteredStories.forEach(story => {
            const card = this.createStoryCard(story);
            grid.appendChild(card);
        });

        if (filteredStories.length === 0) {
            grid.innerHTML = '<div class="empty-state"><h3>No stories found</h3><p>Try adjusting your filters or create a new story.</p></div>';
        }
    }

    createStoryCard(story) {
        const author = api.getUser(story.createdBy);
        const card = document.createElement('div');
        card.className = 'story-card';
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => this.showStoryReading(story));

        const accessLevelClass = {
            'anyone': 'access-level-badge--anyone',
            'approved_only': 'access-level-badge--approved',
            'specific_users': 'access-level-badge--specific'
        }[story.accessLevel];

        const accessLevelText = {
            'anyone': 'Open',
            'approved_only': 'Approval Required',
            'specific_users': 'Restricted'
        }[story.accessLevel];

        card.innerHTML = `
            <div class="story-card__header">
                <h3 class="story-card__title">${story.title}</h3>
                <div class="story-card__meta">
                    <span class="story-card__genre">${story.genre}</span>
                    <span class="story-card__author">by ${author ? author.username : 'Unknown'}</span>
                    <span class="access-level-badge ${accessLevelClass}">${accessLevelText}</span>
                </div>
            </div>
            <p class="story-card__description">${story.description}</p>
            <div class="story-card__footer">
                <div class="story-card__stats">
                    <span>${story.paragraphs.length} paragraphs</span>
                    <span>${new Set(story.paragraphs.map(p => p.author)).size} contributors</span>
                </div>
            </div>
        `;

        return card;
    }

    renderStoryDetails() {
        if (!this.app.currentStory) return;

        const author = api.getUser(this.app.currentStory.createdBy);
        
        document.getElementById('currentStoryTitle').textContent = this.app.currentStory.title;
        document.getElementById('currentStoryGenre').textContent = this.app.currentStory.genre;
        document.getElementById('currentStoryAuthor').textContent = author ? author.username : 'Unknown';
        document.getElementById('currentStoryDescription').textContent = this.app.currentStory.description;

        const accessBadge = document.getElementById('currentAccessLevel');
        const accessLevelClass = {
            'anyone': 'access-level-badge--anyone',
            'approved_only': 'access-level-badge--approved',
            'specific_users': 'access-level-badge--specific'
        }[this.app.currentStory.accessLevel];

        const accessLevelText = {
            'anyone': 'Open to Anyone',
            'approved_only': 'Approval Required',
            'specific_users': 'Restricted Access'
        }[this.app.currentStory.accessLevel];

        accessBadge.className = `access-level-badge ${accessLevelClass}`;
        accessBadge.textContent = accessLevelText;

        const manageBtn = document.getElementById('manageStoryBtn');
        if (this.app.currentUser && this.app.currentStory.createdBy === this.app.currentUser.id) {
            manageBtn.classList.remove('hidden');
        } else {
            manageBtn.classList.add('hidden');
        }

        this.renderParagraphs();
    }

    renderParagraphs() {
        const container = document.getElementById('paragraphsContainer');
        if (!container) return;
        
        container.innerHTML = '';

        this.app.currentStory.paragraphs.forEach(paragraph => {
            const div = document.createElement('div');
            div.className = 'paragraph';
            
            const date = new Date(paragraph.timestamp).toLocaleDateString();
            div.innerHTML = `
                <div class="paragraph__content">${paragraph.content}</div>
                <div class="paragraph__meta">
                    <span class="paragraph__author">by ${paragraph.author}</span>
                    <span class="paragraph__date">${date}</span>
                </div>
            `;
            
            container.appendChild(div);
        });
    }

    renderWritingInterface() {
        document.getElementById('writingStoryTitle').textContent = this.app.currentStory.title;

        const contextContainer = document.getElementById('contextParagraphs');
        const lastParagraphs = this.app.currentStory.paragraphs.slice(-2);
        
        contextContainer.innerHTML = '';
        lastParagraphs.forEach(paragraph => {
            const div = document.createElement('div');
            div.className = 'paragraph';
            div.innerHTML = `
                <div class="paragraph__content">${paragraph.content}</div>
                <div class="paragraph__meta">
                    <span class="paragraph__author">by ${paragraph.author}</span>
                </div>
            `;
            contextContainer.appendChild(div);
        });

        const sampleSection = document.getElementById('writingSampleSection');
        const paragraphSection = document.getElementById('paragraphWriting');

        if (this.app.currentStory.requireExamples && !this.app.hasApprovedSample(this.app.currentUser.id, this.app.currentStory.id)) {
            sampleSection.classList.remove('hidden');
            paragraphSection.classList.add('hidden');
        } else {
            sampleSection.classList.add('hidden');
            paragraphSection.classList.remove('hidden');
        }
    }

    renderDashboard() {
        this.renderUserStories();
        this.renderUserContributions();
        this.renderManagementPanel();
    }

    renderUserStories() {
        const container = document.getElementById('userStoriesGrid');
        if (!container) return;
        
        const userStories = api.getStories().filter(story => story.createdBy === this.app.currentUser.id);
        
        container.innerHTML = '';
        if (userStories.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No stories yet</h3><p>Create your first collaborative story!</p></div>';
            return;
        }

        userStories.forEach(story => {
            const card = this.createStoryCard(story);
            container.appendChild(card);
        });
    }

    renderUserContributions() {
        const container = document.getElementById('userContributionsGrid');
        if (!container) return;
        
        const contributions = [];
        
        api.getStories().forEach(story => {
            story.paragraphs.forEach(paragraph => {
                if (paragraph.author === this.app.currentUser.username) {
                    contributions.push({story, paragraph});
                }
            });
        });

        container.innerHTML = '';
        if (contributions.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No contributions yet</h3><p>Start contributing to stories!</p></div>';
            return;
        }

        contributions.forEach(({story, paragraph}) => {
            const div = document.createElement('div');
            div.className = 'card';
            div.style.cursor = 'pointer';
            div.innerHTML = `
                <div class="card__body">
                    <h4>${story.title}</h4>
                    <p class="paragraph__content">${paragraph.content}</p>
                    <small class="paragraph__date">${new Date(paragraph.timestamp).toLocaleDateString()}</small>
                </div>
            `;
            div.addEventListener('click', () => this.showStoryReading(story));
            container.appendChild(div);
        });
    }

    renderManagementPanel() {
        const container = document.getElementById('storyManagementPanel');
        if (!container) return;
        
        const userStories = api.getStories().filter(story => story.createdBy === this.app.currentUser.id);
        
        container.innerHTML = '';
        if (userStories.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No stories to manage</h3></div>';
            return;
        }

        userStories.forEach(story => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <div class="card__body">
                    <h4>${story.title}</h4>
                    <p>${story.paragraphs.length} paragraphs, ${new Set(story.paragraphs.map(p => p.author)).size} contributors</p>
                    <div class="form-actions">
                        <button class="btn btn--primary btn--sm manage-story-btn" data-story-id="${story.id}">Manage</button>
                    </div>
                </div>
            `;
            
            const manageBtn = div.querySelector('.manage-story-btn');
            manageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.app.currentStory = story;
                this.showStoryManagement();
            });
            
            container.appendChild(div);
        });
    }

    renderStoryManagement() {
        document.getElementById('managementStoryTitle').textContent = this.app.currentStory.title;
        this.renderContributorsManagement();
        this.renderWritingSamplesManagement();
        this.renderStorySettings();
    }

    renderContributorsManagement() {
        const container = document.getElementById('contributorsManagement');
        const contributors = new Set(this.app.currentStory.paragraphs.map(p => p.author));
        
        container.innerHTML = '<h3>Contributors</h3>';
        
        if (contributors.size === 0) {
            container.innerHTML += '<div class="empty-state"><p>No contributors yet</p></div>';
            return;
        }

        contributors.forEach(username => {
            const user = api.getUserByUsername(username);
            if (!user) return;

            const contributionCount = this.app.currentStory.paragraphs.filter(p => p.author === username).length;
            const isBlocked = this.app.currentStory.blockedUsers.includes(user.id);
            
            const div = document.createElement('div');
            div.className = 'contributor-item';
            div.innerHTML = `
                <div class="contributor-info">
                    <div class="contributor-name">${username}</div>
                    <div class="contributor-stats">${contributionCount} contributions</div>
                </div>
                <div class="contributor-actions">
                    <button class="btn btn--outline btn--sm block-user-btn" data-user-id="${user.id}">
                        ${isBlocked ? 'Unblock' : 'Block'}
                    </button>
                </div>
            `;
            
            const blockBtn = div.querySelector('.block-user-btn');
            blockBtn.addEventListener('click', () => this.app.events.toggleBlockUser(user.id));
            
            container.appendChild(div);
        });
    }

    renderWritingSamplesManagement() {
        const container = document.getElementById('writingSamplesManagement');
        const samples = api.getWritingSamples(this.app.currentStory.id);
        
        container.innerHTML = '<h3>Writing Samples</h3>';
        
        if (samples.length === 0) {
            container.innerHTML += '<div class="empty-state"><p>No writing samples submitted</p></div>';
            return;
        }

        samples.forEach(sample => {
            const user = api.getUser(sample.userId);
            const div = document.createElement('div');
            div.className = 'writing-sample-item';
            div.innerHTML = `
                <div class="sample-header">
                    <span class="sample-author">${user ? user.username : 'Unknown'}</span>
                    <span class="status ${sample.status}">${sample.status}</span>
                </div>
                <div class="sample-content">${sample.content}</div>
                <div class="sample-actions">
                    ${sample.status === 'pending' ? `
                        <button class="btn btn--outline btn--sm reject-sample-btn" data-user-id="${sample.userId}" data-story-id="${sample.storyId}">Reject</button>
                        <button class="btn btn--primary btn--sm approve-sample-btn" data-user-id="${sample.userId}" data-story-id="${sample.storyId}">Approve</button>
                    ` : ''}
                </div>
            `;
            
            const rejectBtn = div.querySelector('.reject-sample-btn');
            const approveBtn = div.querySelector('.approve-sample-btn');
            
            if (rejectBtn) {
                rejectBtn.addEventListener('click', () => this.app.events.rejectSample(sample.userId, sample.storyId));
            }
            if (approveBtn) {
                approveBtn.addEventListener('click', () => this.app.events.approveSample(sample.userId, sample.storyId));
            }
            
            container.appendChild(div);
        });
    }

    renderStorySettings() {
        const container = document.getElementById('storySettingsPanel');
        container.innerHTML = `
            <h3>Story Settings</h3>
            <div class="form-group">
                <label class="form-label">Access Level</label>
                <select class="form-control" id="editAccessLevel">
                    <option value="anyone" ${this.app.currentStory.accessLevel === 'anyone' ? 'selected' : ''}>Anyone can contribute</option>
                    <option value="approved_only" ${this.app.currentStory.accessLevel === 'approved_only' ? 'selected' : ''}>Require approval</option>
                    <option value="specific_users" ${this.app.currentStory.accessLevel === 'specific_users' ? 'selected' : ''}>Specific users only</option>
                </select>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="editRequireExamples" ${this.app.currentStory.requireExamples ? 'checked' : ''}>
                    Require writing examples
                </label>
            </div>
            <div class="form-actions">
                <button class="btn btn--primary" id="saveSettingsBtn">Save Settings</button>
            </div>
        `;
        
        const saveBtn = document.getElementById('saveSettingsBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.app.events.updateStorySettings());
        }
    }

    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
            const form = document.getElementById('loginForm');
            if (form) {
                form.reset();
            }
        }
    }

    hideLoginModal() {
        console.log('Attempting to hide login modal...');
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('hidden');
            console.log('Login modal hidden class added.', modal);
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.remove('hidden');
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
    }
}

export const ui = new UI();