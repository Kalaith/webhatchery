import { data } from './data.js';

class API {
    constructor() {
        this.data = data;
    }

    getUsers() {
        return this.data.users;
    }

    getUser(id) {
        return this.data.users.find(u => u.id === id);
    }

    getUserByUsername(username) {
        return this.data.users.find(u => u.username === username);
    }

    getStories() {
        return this.data.stories;
    }

    getStory(id) {
        return this.data.stories.find(s => s.id === id);
    }

    getGenres() {
        return this.data.genres;
    }

    getWritingSamples(storyId) {
        return this.data.writingSamples.filter(s => s.storyId === storyId);
    }

    createStory(storyData) {
        const newStory = {
            ...storyData,
            id: this.data.stories.length + 1,
            createdDate: new Date().toISOString().split('T')[0],
            blockedUsers: [],
            approvedContributors: [],
            paragraphs: [{
                id: 1,
                author: storyData.author,
                content: storyData.firstParagraph,
                timestamp: new Date().toISOString()
            }]
        };
        this.data.stories.push(newStory);
        return newStory;
    }

    addParagraph(storyId, paragraphData) {
        const story = this.getStory(storyId);
        if (story) {
            const newParagraph = {
                ...paragraphData,
                id: story.paragraphs.length + 1,
                timestamp: new Date().toISOString()
            };
            story.paragraphs.push(newParagraph);
            return newParagraph;
        }
        return null;
    }

    addWritingSample(sampleData) {
        const newSample = {
            ...sampleData,
            status: 'pending',
            submittedDate: new Date().toISOString().split('T')[0]
        };
        this.data.writingSamples.push(newSample);
        return newSample;
    }

    updateStory(storyId, updates) {
        const story = this.getStory(storyId);
        if (story) {
            Object.assign(story, updates);
            return story;
        }
        return null;
    }

    updateWritingSample(userId, storyId, updates) {
        const sample = this.data.writingSamples.find(s => s.userId === userId && s.storyId === storyId);
        if (sample) {
            Object.assign(sample, updates);
            return sample;
        }
        return null;
    }
}

export const api = new API();