import { Utils } from './utils.js';

// UI and event management functionality
export class UIManager {
    constructor(state, imageManager, textManager, templateManager, exportManager) {
        this.state = state;
        this.imageManager = imageManager;
        this.textManager = textManager;
        this.templateManager = templateManager;
        this.exportManager = exportManager;
        
        this.eventListeners = new Map();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.setupStateSubscription();
    }    setupEventListeners() {        // Image upload controls
        this.addEventListeners([            {
                id: 'uploadImageBtn',
                event: 'click',
                handler: () => this.triggerFileUpload()
            },
            {
                id: 'uploadImageBtn2',
                event: 'click',
                handler: () => this.triggerFileUpload()
            },
            {
                id: 'hiddenImageInput',
                event: 'change',
                handler: (e) => this.handleImageUpload(e)
            }        ]);

        // Text controls
        this.addEventListeners([
            {
                id: 'addTextBtn',
                event: 'click',
                handler: () => this.textManager.addTextOverlay()
            },
            {
                id: 'textInput',
                event: 'input',
                handler: Utils.debounce(() => this.textManager.updateSelectedText(), 300)
            },
            {
                id: 'fontSelect',
                event: 'change',
                handler: () => this.textManager.updateSelectedText()
            },
            {
                id: 'fontSizeSlider',
                event: 'input',
                handler: Utils.throttle(() => this.textManager.updateFontSize(), 100)
            },
            {
                id: 'textColor',
                event: 'change',
                handler: () => this.textManager.updateSelectedText()
            },
            {
                id: 'textColor',
                event: 'input',
                handler: Utils.throttle(() => this.textManager.updateSelectedText(), 100)
            },
            {
                id: 'deleteTextBtn',
                event: 'click',
                handler: () => this.textManager.deleteSelectedText()
            }
        ]);

        // Action buttons
        this.addEventListeners([
            {
                id: 'clearAllBtn',
                event: 'click',
                handler: () => this.handleClearAll()
            },
            {
                id: 'resetBtn',
                event: 'click',
                handler: () => this.handleReset()
            },
            {
                id: 'exportBtn',
                event: 'click',
                handler: () => this.handleExport()
            },
            {
                id: 'downloadBtn',
                event: 'click',
                handler: () => this.handleDownload()
            }
        ]);        // Container click for deselection
        const imageContainer = Utils.getElementById('imageContainer');
        if (imageContainer) {
            imageContainer.addEventListener('click', (e) => this.handleContainerClick(e));
        }

        // File drop functionality
        this.setupFileDrop();
    }

    addEventListeners(listeners) {
        listeners.forEach(({ id, event, handler }) => {
            const element = Utils.getElementById(id);
            if (element) {
                element.addEventListener(event, handler);
                
                // Store for cleanup
                const key = `${id}_${event}`;
                this.eventListeners.set(key, { element, event, handler });
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }            switch (e.key) {
                case 'Delete':
                case 'Backspace':
                    if (this.textManager.hasSelectedOverlay()) {
                        Utils.preventDefault(e);
                        this.textManager.deleteSelectedText();
                    }
                    break;
                case 'Escape':
                    this.textManager.deselectAll();
                    break;
                case 't':
                    if (e.ctrlKey || e.metaKey) {
                        Utils.preventDefault(e);
                        this.textManager.addTextOverlay();
                    }
                    break;
                case 'r':
                    if (e.ctrlKey || e.metaKey) {
                        Utils.preventDefault(e);
                        this.handleReset();
                    }
                    break;
            }
        });
    }    setupFileDrop() {
        const imageContainer = Utils.getElementById('imageContainer');
        if (!imageContainer) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            imageContainer.addEventListener(eventName, Utils.preventDefault);
            imageContainer.addEventListener(eventName, Utils.stopPropagation);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            imageContainer.addEventListener(eventName, () => {
                Utils.addClass(imageContainer, 'drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            imageContainer.addEventListener(eventName, () => {
                Utils.removeClass(imageContainer, 'drag-over');
            });
        });

        imageContainer.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (Utils.isImageFile(file)) {
                    this.handleImageFile(file);
                } else {
                    this.showMessage('Please drop a valid image file', 'error');
                }
            }
        });
    }

    setupStateSubscription() {
        this.state.subscribe('ui-manager', (newState, prevState) => {
            this.handleStateChange(newState, prevState);
        });
    }

    handleStateChange(newState, prevState) {
        // Update UI based on state changes
        if (newState.isLoading !== prevState.isLoading) {
            this.updateLoadingState(newState.isLoading);
        }

        if (newState.error !== prevState.error) {
            this.handleErrorState(newState.error);
        }

        if (newState.selectedTextOverlay !== prevState.selectedTextOverlay) {
            this.updateTextControlsVisibility(!!newState.selectedTextOverlay);
        }
    }

    updateLoadingState(isLoading) {
        const uploadBtn = Utils.getElementById('uploadVideoBtn');
        if (uploadBtn) {
            uploadBtn.disabled = isLoading;
            uploadBtn.textContent = isLoading ? 'Loading...' : 'Upload Video';
        }
    }

    updateTextControlsVisibility(hasSelection) {
        const textControls = Utils.getElementById('textControls');
        if (textControls) {
            textControls.style.opacity = hasSelection ? '1' : '0.5';
        }

        const deleteBtn = Utils.getElementById('deleteTextBtn');
        if (deleteBtn) {
            deleteBtn.disabled = !hasSelection;
        }
    }

    handleErrorState(error) {
        if (error) {
            this.showMessage(error.message, 'error');
        }
    }    // Event handlers
    triggerFileUpload() {
        const hiddenInput = Utils.getElementById('hiddenImageInput');
        if (hiddenInput) {
            hiddenInput.click();
        }    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.handleImageFile(file);
        }
    }

    handleImageFile(file) {
        if (!Utils.isImageFile(file)) {
            this.showMessage('Please select a valid image file (JPG, PNG, GIF, WebP)', 'error');
            return;
        }

        // Check file size (limit to 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            this.showMessage('File size too large. Please select an image under 50MB', 'error');
            return;
        }

        this.imageManager.loadImage(file);
    }    handleContainerClick(e) {
        // Only deselect if clicking directly on the container or image elements
        const targetIds = ['imageContainer', 'imagePlayer', 'demoBackground'];
        if (targetIds.includes(e.target.id)) {
            this.textManager.deselectAll();
        }
    }

    handleClearAll() {
        if (this.textManager.getTextOverlayCount() === 0) {
            this.showMessage('No text overlays to clear', 'info');
            return;
        }

        if (confirm('Are you sure you want to clear all text overlays?')) {
            this.textManager.clearAllText();
        }
    }    handleReset() {
        if (confirm('Are you sure you want to reset the meme? This will clear all text and reset the image.')) {
            this.textManager.clearAllText();
            this.imageManager.reset();
            this.showMessage('Meme reset to initial state');
        }
    }    handleExport() {
        this.handleDownload();
    }

    async handleDownload() {
        try {
            const format = Utils.getElementById('exportFormat');
            const selectedFormat = format ? format.value : 'png';
            
            if (!this.exportManager) {
                this.showMessage('Export functionality not available', 'error');
                return;
            }

            const imageElement = Utils.getElementById('imagePlayer');
            if (!imageElement || !imageElement.src) {
                this.showMessage('Please upload an image first', 'error');
                return;
            }

            this.showMessage('Preparing download...', 'info');
            
            await this.exportManager.exportMeme(selectedFormat, 0.9);
            
        } catch (error) {
            Utils.logError(error, 'UIManager handleDownload');
            this.showMessage(`Export failed: ${error.message}`, 'error');
        }
    }

    // Drag and drop visual feedback
    updateDragFeedback(isDragging) {
        const body = document.body;
        if (isDragging) {
            Utils.addClass(body, 'is-dragging');
        } else {
            Utils.removeClass(body, 'is-dragging');
        }
    }

    // Loading states
    showLoadingSpinner(show = true) {
        let spinner = Utils.getElementById('loading-spinner');
        
        if (show && !spinner) {
            spinner = Utils.createElement('div', 'loading-spinner');
            spinner.id = 'loading-spinner';
            spinner.innerHTML = `
                <div class="spinner"></div>
                <p>Processing...</p>
            `;
            document.body.appendChild(spinner);
        } else if (!show && spinner) {
            spinner.remove();
        }
    }

    // Utility methods
    showMessage(text, type = 'info') {
        const event = new CustomEvent('app:notification', {
            detail: { message: text, type }
        });
        document.dispatchEvent(event);
    }

    // Public API
    enableElement(id) {
        const element = Utils.getElementById(id);
        if (element) {
            element.disabled = false;
        }
    }

    disableElement(id) {
        const element = Utils.getElementById(id);
        if (element) {
            element.disabled = true;
        }
    }

    showElement(id) {
        const element = Utils.getElementById(id);
        if (element) {
            element.style.display = '';
        }
    }

    hideElement(id) {
        const element = Utils.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }

    updateElementText(id, text) {
        const element = Utils.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    // Cleanup
    destroy() {
        // Remove all event listeners
        for (const [key, { element, event, handler }] of this.eventListeners) {
            element.removeEventListener(event, handler);
        }
        this.eventListeners.clear();

        // Remove loading spinner if present
        this.showLoadingSpinner(false);
    }
}
