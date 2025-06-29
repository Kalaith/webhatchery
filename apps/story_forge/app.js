// StoryForge - Collaborative Storytelling Portal
class StoryForge {
    constructor() {
        this.currentUser = null;
        this.currentView = 'homepage';
        this.currentStory = null;
        this.data = {
            users: [
                {id: 1, username: "storyteller_jane", email: "jane@example.com", joinDate: "2024-01-15", storiesCreated: 3, contributions: 12},
                {id: 2, username: "creative_alex", email: "alex@example.com", joinDate: "2024-02-10", storiesCreated: 1, contributions: 8},
                {id: 3, username: "narrative_sam", email: "sam@example.com", joinDate: "2024-03-05", storiesCreated: 2, contributions: 15}
            ],
            stories: [
                {
                    id: 1,
                    title: "The Last Library",
                    genre: "Science Fiction",
                    description: "In a post-apocalyptic world, a mysterious library holds the key to humanity's future.",
                    createdBy: 1,
                    createdDate: "2024-06-01",
                    accessLevel: "anyone",
                    requireExamples: false,
                    blockedUsers: [],
                    approvedContributors: [],
                    paragraphs: [
                        {id: 1, author: "storyteller_jane", content: "The dust settled on the cracked pavement as Maya approached the imposing structure. After months of wandering through the wasteland, she had finally found it—the Last Library. Its towering spires pierced the grey sky like fingers reaching for hope itself.", timestamp: "2024-06-01T10:00:00Z"},
                        {id: 2, author: "creative_alex", content: "The massive doors stood slightly ajar, revealing a warm golden glow from within. Maya hesitated for a moment, her hand trembling as she reached for the ancient brass handle. She had heard whispers of this place in the settlements—some called it salvation, others called it a trap.", timestamp: "2024-06-01T14:30:00Z"},
                        {id: 3, author: "narrative_sam", content: "As the door creaked open, the musty scent of old paper and leather bindings washed over her. Inside, impossible towers of books stretched toward a vaulted ceiling that seemed to disappear into darkness. But what stopped Maya in her tracks wasn't the vastness of the collection—it was the soft sound of pages turning, though she could see no one else in the vast hall.", timestamp: "2024-06-02T09:15:00Z"}
                    ]
                },
                {
                    id: 2,
                    title: "Moonlight Confessions",
                    genre: "Romance",
                    description: "A chance encounter under the full moon changes everything for two strangers.",
                    createdBy: 2,
                    createdDate: "2024-06-10",
                    accessLevel: "approved_only",
                    requireExamples: true,
                    blockedUsers: [],
                    approvedContributors: [1, 3],
                    paragraphs: [
                        {id: 1, author: "creative_alex", content: "The coffee shop's neon sign flickered against the midnight darkness as Elena fumbled for her keys. She hadn't planned to work this late, but the deadline for her novel wouldn't wait. The empty street stretched before her, illuminated only by the ethereal glow of the full moon overhead.", timestamp: "2024-06-10T11:00:00Z"},
                        {id: 2, author: "storyteller_jane", content: "A soft melody drifted from the park across the street—someone was playing guitar. Despite her exhaustion, Elena found herself drawn to the music. There, sitting on a bench bathed in moonlight, was a figure she didn't recognize. The haunting melody seemed to speak directly to her writer's soul.", timestamp: "2024-06-10T16:45:00Z"}
                    ]
                },
                {
                    id: 3,
                    title: "The Midnight Detective",
                    genre: "Mystery",
                    description: "Detective Walsh investigates a series of crimes that only happen at the stroke of midnight.",
                    createdBy: 3,
                    createdDate: "2024-06-15",
                    accessLevel: "specific_users",
                    requireExamples: false,
                    blockedUsers: [2],
                    approvedContributors: [1],
                    paragraphs: [
                        {id: 1, author: "narrative_sam", content: "Detective Walsh checked her watch for the third time in five minutes. 11:58 PM. The precinct was eerily quiet, but she knew that would change in exactly two minutes. For three weeks now, every crime in the city had occurred at precisely midnight—no exceptions, no deviations.", timestamp: "2024-06-15T08:00:00Z"}
                    ]
                }
            ],
            genres: ["Science Fiction", "Romance", "Mystery", "Fantasy", "Horror", "Adventure", "Drama", "Comedy"],
            writingSamples: [
                {userId: 2, storyId: 2, content: "The rain pelted against the window as Sarah opened the letter that would change her life forever. Her hands trembled as she read the elegant script, each word more shocking than the last.", status: "approved", submittedDate: "2024-06-09"},
                {userId: 1, storyId: 3, content: "The old clock tower chimed thirteen times, an impossibility that sent chills down Marcus's spine. In all his years living in this town, he had never heard such a thing.", status: "approved", submittedDate: "2024-06-14"}
            ]
        };

        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('StoryForge initializing...');
        this.bindEvents();
        this.populateGenres();
        this.renderStories();
        this.updateUI();
        console.log('StoryForge initialized successfully');
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Navigation
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Login button clicked');
                this.showLoginModal();
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.logout();
            });
        }

        const dashboardBtn = document.getElementById('dashboardBtn');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showDashboard();
            });
        }

        const createStoryBtn = document.getElementById('createStoryBtn');
        if (createStoryBtn) {
            createStoryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showStoryCreation();
            });
        }

        const backToHomeBtn = document.getElementById('backToHomeBtn');
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showHomepage();
            });
        }

        const backToDashboardBtn = document.getElementById('backToDashboardBtn');
        if (backToDashboardBtn) {
            backToDashboardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showDashboard();
            });
        }

        // Login modal
        const closeLoginModal = document.getElementById('closeLoginModal');
        if (closeLoginModal) {
            closeLoginModal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.hideLoginModal();
            });
        }

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Login form submitted');
                this.handleLogin(e);
            });
        }

        // Story creation
        const cancelStoryCreation = document.getElementById('cancelStoryCreation');
        if (cancelStoryCreation) {
            cancelStoryCreation.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showHomepage();
            });
        }

        const storyCreationForm = document.getElementById('storyCreationForm');
        if (storyCreationForm) {
            storyCreationForm.addEventListener('submit', (e) => this.handleStoryCreation(e));
        }

        // Search and filters
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterStories());
        }

        const genreFilter = document.getElementById('genreFilter');
        if (genreFilter) {
            genreFilter.addEventListener('change', () => this.filterStories());
        }

        const accessFilter = document.getElementById('accessFilter');
        if (accessFilter) {
            accessFilter.addEventListener('change', () => this.filterStories());
        }

        // Writing interface
        const contributeBtn = document.getElementById('contributeBtn');
        if (contributeBtn) {
            contributeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showWritingInterface();
            });
        }

        const cancelWriting = document.getElementById('cancelWriting');
        if (cancelWriting) {
            cancelWriting.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showStoryReading(this.currentStory);
            });
        }

        const submitSampleBtn = document.getElementById('submitSampleBtn');
        if (submitSampleBtn) {
            submitSampleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.submitWritingSample();
            });
        }

        const submitParagraph = document.getElementById('submitParagraph');
        if (submitParagraph) {
            submitParagraph.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.submitParagraph();
            });
        }

        // Story management
        const manageStoryBtn = document.getElementById('manageStoryBtn');
        if (manageStoryBtn) {
            manageStoryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showStoryManagement();
            });
        }

        // Dashboard tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.switchTab(e);
            });
        });

        // Modal click outside to close
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target.id === 'loginModal') {
                    this.hideLoginModal();
                }
            });
        }

        console.log('Events bound successfully');
    }

    // Authentication
    showLoginModal() {
        console.log('Showing login modal');
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
            // Reset form
            const form = document.getElementById('loginForm');
            if (form) {
                form.reset();
            }
        }
    }

    hideLoginModal() {
        console.log('Hiding login modal');
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    handleLogin(e) {
        console.log('Handling login...');
        const usernameSelect = document.getElementById('username');
        if (!usernameSelect) {
            console.error('Username select not found');
            return;
        }

        const username = usernameSelect.value;
        console.log('Selected username:', username);
        
        if (!username) {
            this.showToast('Please select a user', 'error');
            return;
        }
        
        const user = this.data.users.find(u => u.username === username);
        console.log('Found user:', user);
        
        if (user) {
            this.currentUser = user;
            console.log('User logged in:', this.currentUser);
            
            // Force hide modal
            this.hideLoginModal();
            
            // Update UI
            this.updateUI();
            
            // Show success message
            this.showToast(`Welcome back, ${user.username}!`);
        } else {
            console.error('User not found for username:', username);
            this.showToast('User not found', 'error');
        }
    }

    logout() {
        console.log('Logging out user');
        this.currentUser = null;
        this.updateUI();
        this.showHomepage();
        this.showToast('Signed out successfully');
    }

    // UI Updates
    updateUI() {
        console.log('Updating UI, current user:', this.currentUser);
        
        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');
        const createStoryBtn = document.getElementById('createStoryBtn');
        const currentUserName = document.getElementById('currentUserName');

        if (this.currentUser) {
            console.log('Showing user profile, hiding login button');
            if (loginBtn) loginBtn.classList.add('hidden');
            if (userProfile) userProfile.classList.remove('hidden');
            if (currentUserName) currentUserName.textContent = this.currentUser.username;
            if (createStoryBtn) createStoryBtn.classList.remove('hidden');
        } else {
            console.log('Showing login button, hiding user profile');
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (userProfile) userProfile.classList.add('hidden');
            if (createStoryBtn) createStoryBtn.classList.add('hidden');
        }

        // Update contribute button visibility in story view
        const contributeBtn = document.getElementById('contributeBtn');
        if (this.currentView === 'storyReadingView' && this.currentStory && contributeBtn) {
            if (this.currentUser && this.canUserContribute(this.currentUser.id, this.currentStory)) {
                contributeBtn.classList.remove('hidden');
            } else {
                contributeBtn.classList.add('hidden');
            }
        }
    }

    // View Management
    showView(viewId) {
        console.log('Showing view:', viewId);
        document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
        this.currentView = viewId;
    }

    showHomepage() {
        this.showView('homepageView');
        this.renderStories();
    }

    showStoryReading(story) {
        console.log('Showing story reading for:', story.title);
        this.currentStory = story;
        this.showView('storyReadingView');
        this.renderStoryDetails();
        this.updateUI(); // Update UI to show/hide contribute button
    }

    showStoryCreation() {
        if (!this.currentUser) {
            this.showToast('Please sign in to create stories', 'error');
            return;
        }
        this.showView('storyCreationView');
    }

    showWritingInterface() {
        if (!this.currentUser) {
            this.showToast('Please sign in to contribute', 'error');
            return;
        }

        if (!this.canUserContribute(this.currentUser.id, this.currentStory)) {
            this.showToast('You cannot contribute to this story', 'error');
            return;
        }

        this.showView('writingView');
        this.renderWritingInterface();
    }

    showDashboard() {
        if (!this.currentUser) {
            this.showToast('Please sign in to access dashboard', 'error');
            return;
        }
        this.showView('dashboardView');
        this.renderDashboard();
        
        // Ensure the first tab is active
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
        if (!this.currentUser || this.currentStory.createdBy !== this.currentUser.id) {
            this.showToast('Access denied', 'error');
            return;
        }
        this.showView('storyManagementView');
        this.renderStoryManagement();
        
        // Ensure the first tab is active
        const managementTabs = document.querySelectorAll('.management-tabs .tab-btn');
        const managementPanels = document.querySelectorAll('#storyManagementView .tab-panel');
        
        managementTabs.forEach(btn => btn.classList.remove('active'));
        managementPanels.forEach(panel => panel.classList.add('hidden'));
        
        const firstTab = document.querySelector('.management-tabs .tab-btn[data-tab="contributors"]');
        const firstPanel = document.getElementById('contributorsTab');
        
        if (firstTab) firstTab.classList.add('active');
        if (firstPanel) firstPanel.classList.remove('hidden');
    }

    // Story Management
    populateGenres() {
        const genreSelects = [
            document.getElementById('genreFilter'),
            document.getElementById('storyGenre')
        ];

        genreSelects.forEach(select => {
            if (select) {
                // Clear existing options except the first one
                while (select.children.length > 1) {
                    select.removeChild(select.lastChild);
                }
                
                this.data.genres.forEach(genre => {
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

        let filteredStories = [...this.data.stories];
        
        // Apply filters
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
        const author = this.data.users.find(u => u.id === story.createdBy);
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
        if (!this.currentStory) return;

        const author = this.data.users.find(u => u.id === this.currentStory.createdBy);
        
        document.getElementById('currentStoryTitle').textContent = this.currentStory.title;
        document.getElementById('currentStoryGenre').textContent = this.currentStory.genre;
        document.getElementById('currentStoryAuthor').textContent = author ? author.username : 'Unknown';
        document.getElementById('currentStoryDescription').textContent = this.currentStory.description;

        // Access level badge
        const accessBadge = document.getElementById('currentAccessLevel');
        const accessLevelClass = {
            'anyone': 'access-level-badge--anyone',
            'approved_only': 'access-level-badge--approved',
            'specific_users': 'access-level-badge--specific'
        }[this.currentStory.accessLevel];

        const accessLevelText = {
            'anyone': 'Open to Anyone',
            'approved_only': 'Approval Required',
            'specific_users': 'Restricted Access'
        }[this.currentStory.accessLevel];

        accessBadge.className = `access-level-badge ${accessLevelClass}`;
        accessBadge.textContent = accessLevelText;

        // Show manage button if user owns the story
        const manageBtn = document.getElementById('manageStoryBtn');
        if (this.currentUser && this.currentStory.createdBy === this.currentUser.id) {
            manageBtn.classList.remove('hidden');
        } else {
            manageBtn.classList.add('hidden');
        }

        // Render paragraphs
        this.renderParagraphs();
    }

    renderParagraphs() {
        const container = document.getElementById('paragraphsContainer');
        if (!container) return;
        
        container.innerHTML = '';

        this.currentStory.paragraphs.forEach(paragraph => {
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
        document.getElementById('writingStoryTitle').textContent = this.currentStory.title;

        // Show last few paragraphs for context
        const contextContainer = document.getElementById('contextParagraphs');
        const lastParagraphs = this.currentStory.paragraphs.slice(-2);
        
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

        // Check if writing sample is required
        const sampleSection = document.getElementById('writingSampleSection');
        const paragraphSection = document.getElementById('paragraphWriting');

        if (this.currentStory.requireExamples && !this.hasApprovedSample(this.currentUser.id, this.currentStory.id)) {
            sampleSection.classList.remove('hidden');
            paragraphSection.classList.add('hidden');
        } else {
            sampleSection.classList.add('hidden');
            paragraphSection.classList.remove('hidden');
        }
    }

    // Story Creation
    handleStoryCreation(e) {
        e.preventDefault();
        
        const newStory = {
            id: this.data.stories.length + 1,
            title: document.getElementById('storyTitle').value,
            genre: document.getElementById('storyGenre').value,
            description: document.getElementById('storyDescription').value,
            createdBy: this.currentUser.id,
            createdDate: new Date().toISOString().split('T')[0],
            accessLevel: document.getElementById('accessLevel').value,
            requireExamples: document.getElementById('requireExamples').checked,
            blockedUsers: [],
            approvedContributors: [],
            paragraphs: [{
                id: 1,
                author: this.currentUser.username,
                content: document.getElementById('firstParagraph').value,
                timestamp: new Date().toISOString()
            }]
        };

        this.data.stories.push(newStory);
        this.showToast('Story created successfully!');
        this.showStoryReading(newStory);
        
        // Clear form
        document.getElementById('storyCreationForm').reset();
    }

    // Writing System
    submitWritingSample() {
        const content = document.getElementById('writingSample').value.trim();
        if (!content) {
            this.showToast('Please provide a writing sample', 'error');
            return;
        }

        const sample = {
            userId: this.currentUser.id,
            storyId: this.currentStory.id,
            content: content,
            status: 'pending',
            submittedDate: new Date().toISOString().split('T')[0]
        };

        this.data.writingSamples.push(sample);
        this.showToast('Writing sample submitted for review');
        
        // For demo purposes, auto-approve after a short delay
        setTimeout(() => {
            sample.status = 'approved';
            if (!this.currentStory.approvedContributors.includes(this.currentUser.id)) {
                this.currentStory.approvedContributors.push(this.currentUser.id);
            }
            this.showToast('Your writing sample has been approved!');
            this.renderWritingInterface();
        }, 2000);
    }

    submitParagraph() {
        const content = document.getElementById('newParagraph').value.trim();
        if (!content) {
            this.showToast('Please write a paragraph', 'error');
            return;
        }

        const newParagraph = {
            id: this.currentStory.paragraphs.length + 1,
            author: this.currentUser.username,
            content: content,
            timestamp: new Date().toISOString()
        };

        this.currentStory.paragraphs.push(newParagraph);
        this.showToast('Paragraph added successfully!');
        this.showStoryReading(this.currentStory);
        
        // Update user contribution count
        this.currentUser.contributions++;
        
        // Clear the textarea
        document.getElementById('newParagraph').value = '';
    }

    // Access Control
    canUserContribute(userId, story) {
        if (story.blockedUsers.includes(userId)) {
            return false;
        }

        switch (story.accessLevel) {
            case 'anyone':
                return true;
            case 'approved_only':
                return story.approvedContributors.includes(userId) || 
                       this.hasApprovedSample(userId, story.id);
            case 'specific_users':
                return story.approvedContributors.includes(userId);
            default:
                return false;
        }
    }

    hasApprovedSample(userId, storyId) {
        return this.data.writingSamples.some(sample => 
            sample.userId === userId && 
            sample.storyId === storyId && 
            sample.status === 'approved'
        );
    }

    // Dashboard
    renderDashboard() {
        this.renderUserStories();
        this.renderUserContributions();
        this.renderManagementPanel();
    }

    renderUserStories() {
        const container = document.getElementById('userStoriesGrid');
        if (!container) return;
        
        const userStories = this.data.stories.filter(story => story.createdBy === this.currentUser.id);
        
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
        
        this.data.stories.forEach(story => {
            story.paragraphs.forEach(paragraph => {
                if (paragraph.author === this.currentUser.username) {
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
        
        const userStories = this.data.stories.filter(story => story.createdBy === this.currentUser.id);
        
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
            
            // Add event listener to the manage button
            const manageBtn = div.querySelector('.manage-story-btn');
            manageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.currentStory = story;
                this.showStoryManagement();
            });
            
            container.appendChild(div);
        });
    }

    // Story Management Interface
    renderStoryManagement() {
        document.getElementById('managementStoryTitle').textContent = this.currentStory.title;
        this.renderContributorsManagement();
        this.renderWritingSamplesManagement();
        this.renderStorySettings();
    }

    renderContributorsManagement() {
        const container = document.getElementById('contributorsManagement');
        const contributors = new Set(this.currentStory.paragraphs.map(p => p.author));
        
        container.innerHTML = '<h3>Contributors</h3>';
        
        if (contributors.size === 0) {
            container.innerHTML += '<div class="empty-state"><p>No contributors yet</p></div>';
            return;
        }

        contributors.forEach(username => {
            const user = this.data.users.find(u => u.username === username);
            if (!user) return;

            const contributionCount = this.currentStory.paragraphs.filter(p => p.author === username).length;
            const isBlocked = this.currentStory.blockedUsers.includes(user.id);
            
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
            
            // Add event listener to block button
            const blockBtn = div.querySelector('.block-user-btn');
            blockBtn.addEventListener('click', () => this.toggleBlockUser(user.id));
            
            container.appendChild(div);
        });
    }

    renderWritingSamplesManagement() {
        const container = document.getElementById('writingSamplesManagement');
        const samples = this.data.writingSamples.filter(sample => sample.storyId === this.currentStory.id);
        
        container.innerHTML = '<h3>Writing Samples</h3>';
        
        if (samples.length === 0) {
            container.innerHTML += '<div class="empty-state"><p>No writing samples submitted</p></div>';
            return;
        }

        samples.forEach(sample => {
            const user = this.data.users.find(u => u.id === sample.userId);
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
            
            // Add event listeners
            const rejectBtn = div.querySelector('.reject-sample-btn');
            const approveBtn = div.querySelector('.approve-sample-btn');
            
            if (rejectBtn) {
                rejectBtn.addEventListener('click', () => this.rejectSample(sample.userId, sample.storyId));
            }
            if (approveBtn) {
                approveBtn.addEventListener('click', () => this.approveSample(sample.userId, sample.storyId));
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
                    <option value="anyone" ${this.currentStory.accessLevel === 'anyone' ? 'selected' : ''}>Anyone can contribute</option>
                    <option value="approved_only" ${this.currentStory.accessLevel === 'approved_only' ? 'selected' : ''}>Require approval</option>
                    <option value="specific_users" ${this.currentStory.accessLevel === 'specific_users' ? 'selected' : ''}>Specific users only</option>
                </select>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="editRequireExamples" ${this.currentStory.requireExamples ? 'checked' : ''}>
                    Require writing examples
                </label>
            </div>
            <div class="form-actions">
                <button class="btn btn--primary" id="saveSettingsBtn">Save Settings</button>
            </div>
        `;
        
        // Add event listener to save button
        const saveBtn = document.getElementById('saveSettingsBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.updateStorySettings());
        }
    }

    // Management Actions
    toggleBlockUser(userId) {
        const index = this.currentStory.blockedUsers.indexOf(userId);
        if (index > -1) {
            this.currentStory.blockedUsers.splice(index, 1);
            this.showToast('User unblocked');
        } else {
            this.currentStory.blockedUsers.push(userId);
            this.showToast('User blocked');
        }
        this.renderContributorsManagement();
    }

    approveSample(userId, storyId) {
        const sample = this.data.writingSamples.find(s => s.userId == userId && s.storyId == storyId);
        if (sample) {
            sample.status = 'approved';
            if (!this.currentStory.approvedContributors.includes(parseInt(userId))) {
                this.currentStory.approvedContributors.push(parseInt(userId));
            }
            this.showToast('Writing sample approved');
            this.renderWritingSamplesManagement();
        }
    }

    rejectSample(userId, storyId) {
        const sample = this.data.writingSamples.find(s => s.userId == userId && s.storyId == storyId);
        if (sample) {
            sample.status = 'rejected';
            this.showToast('Writing sample rejected');
            this.renderWritingSamplesManagement();
        }
    }

    updateStorySettings() {
        const accessLevel = document.getElementById('editAccessLevel');
        const requireExamples = document.getElementById('editRequireExamples');
        
        if (accessLevel && requireExamples) {
            this.currentStory.accessLevel = accessLevel.value;
            this.currentStory.requireExamples = requireExamples.checked;
            this.showToast('Settings updated');
        }
    }

    // Utility Functions
    filterStories() {
        this.renderStories();
    }

    switchTab(e) {
        const tabName = e.target.dataset.tab;
        
        // Get the parent container to determine which tab system we're in
        const isManagementTab = e.target.closest('.management-tabs');
        
        if (isManagementTab) {
            // Management tabs
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
            // Dashboard tabs
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

// Initialize the application
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new StoryForge();
    });
} else {
    app = new StoryForge();
}