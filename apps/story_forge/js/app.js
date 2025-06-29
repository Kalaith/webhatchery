import { api } from './api.js';
import { ui } from './ui.js';
import { events } from './events.js';

class StoryForge {
    constructor() {
        this.currentUser = null;
        this.currentView = 'homepage';
        this.currentStory = null;

        this.api = api;
        this.ui = ui;
        this.events = events;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.ui.init(this);
        this.events.init(this);

        this.ui.populateGenres();
        this.ui.renderStories();
        this.ui.update();
    }

    logout() {
        this.currentUser = null;
        this.ui.update();
        this.ui.showHomepage();
        this.ui.showToast('Signed out successfully');
    }

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
        return this.api.getWritingSamples(storyId).some(sample => 
            sample.userId === userId && 
            sample.status === 'approved'
        );
    }
}

const app = new StoryForge();