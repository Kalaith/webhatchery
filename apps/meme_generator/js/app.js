// Main application class that orchestrates all components
import memeState from './state.js';
import { ImageManager } from './image-manager.js';
import { TextManager } from './text-manager.js';
import { TemplateManager } from './template-manager.js';
import { UIManager } from './ui-manager.js';
import { CanvasExportManager } from './canvas-export-manager.js';
import notificationManager from './notification-manager.js';

export class MemeGenerator {
    constructor() {
        this.state = memeState;
        this.managers = {};
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            console.log('Initializing Meme Generator...');            // Initialize managers in dependency order
            this.managers.image = new ImageManager(this.state);
            this.managers.text = new TextManager(this.state);
            this.managers.template = new TemplateManager(this.managers.text);
            this.managers.export = new CanvasExportManager(
                this.state,
                this.managers.image,
                this.managers.text
            );
            this.managers.ui = new UIManager(
                this.state,
                this.managers.image,
                this.managers.text,
                this.managers.template,
                this.managers.export
            );

            // Setup global error handling
            this.setupErrorHandling();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            this.isInitialized = true;
            
            console.log('Meme Generator initialized successfully');
            notificationManager.success('Meme Generator ready!');
            
        } catch (error) {
            console.error('Failed to initialize Meme Generator:', error);
            notificationManager.error('Failed to initialize application');
            throw error;
        }
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            notificationManager.error('An unexpected error occurred');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            notificationManager.error('An unexpected error occurred');
        });
    }

    setupPerformanceMonitoring() {
        // Monitor performance for text overlay operations
        this.state.subscribe('perf-monitor', (newState, prevState) => {
            if (newState.textOverlays.length !== prevState.textOverlays.length) {
                this.logPerformance('text-overlay-change', newState.textOverlays.length);
            }
        });
    }

    logPerformance(operation, value) {
        if (performance.mark) {
            performance.mark(`meme-generator-${operation}-${value}`);
        }
    }

    // Public API methods
    addText(text, position) {
        if (!this.isInitialized) {
            throw new Error('MemeGenerator not initialized');
        }
        return this.managers.text.addTextOverlay(text, position);
    }

    clearText() {
        if (!this.isInitialized) {
            throw new Error('MemeGenerator not initialized');
        }
        this.managers.text.clearAllText();
    }    loadImage(file) {
        if (!this.isInitialized) {
            throw new Error('MemeGenerator not initialized');
        }
        return this.managers.image.loadImage(file);
    }

    applyTemplate(templateName) {
        if (!this.isInitialized) {
            throw new Error('MemeGenerator not initialized');
        }
        
        const template = this.managers.template.getTemplateByName(templateName);
        if (!template) {
            throw new Error(`Template "${templateName}" not found`);
        }
        
        this.managers.text.applyTemplate(template);
    }

    getState() {
        return this.state.getState();
    }

    getTextOverlays() {
        return this.state.getTextOverlays();
    }

    getImage() {
        return this.state.getImage();
    }

    isImageLoaded() {
        const image = this.state.getImage();
        return image && image.src;
    }    reset() {
        if (!this.isInitialized) {
            throw new Error('MemeGenerator not initialized');
        }
        
        this.managers.text.clearAllText();
        this.managers.image.reset();
    }

    // Export functionality (placeholder)
    async exportMeme(options = {}) {
        if (!this.isInitialized) {
            throw new Error('MemeGenerator not initialized');
        }

        const {
            format = 'png',
            quality = 'high'
        } = options;

        try {
            notificationManager.info('Starting export...');
            
            // Placeholder for actual export logic
            await this.simulateExport();
            
            notificationManager.success(`Meme exported as ${format}`);
            
            return {
                format,
                quality,
                textOverlays: this.getTextOverlays().length
            };
            
        } catch (error) {
            notificationManager.error('Export failed');
            throw error;
        }
    }

    async simulateExport() {
        // Simulate export processing time
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    }    // Analytics and debugging
    getAnalytics() {
        return {
            textOverlayCount: this.state.getTextOverlays().length,
            hasImage: this.isImageLoaded(),
            templateCount: this.managers.template.getTemplateCount(),
            customTemplateCount: this.managers.template.getCustomTemplateCount()
        };
    }

    // Development helpers
    debug() {
        return {
            state: this.state.getState(),
            managers: Object.keys(this.managers),
            isInitialized: this.isInitialized,
            analytics: this.getAnalytics()
        };
    }

    // Cleanup
    destroy() {
        try {
            // Cleanup managers
            Object.values(this.managers).forEach(manager => {
                if (manager.destroy) {
                    manager.destroy();
                }
            });

            // Clear state
            this.state.clearAllTextOverlays();
            
            // Cleanup notification manager
            notificationManager.destroy();
            
            this.isInitialized = false;
            
            console.log('MemeGenerator destroyed');
            
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Meme Generator...');
    
    try {        window.memeGenerator = new MemeGenerator();
        
        // Add to global scope for debugging
        window.debugMeme = () => window.memeGenerator.debug();
        
    } catch (error) {
        console.error('Failed to initialize MemeGenerator:', error);
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.memeGenerator) {
        window.memeGenerator.destroy();
    }
});
