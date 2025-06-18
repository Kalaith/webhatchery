import { Utils } from './utils.js';

// Text overlay management functionality
export class TextManager {
    constructor(state) {
        this.state = state;
        this.textOverlaysContainer = null;
        this.dragHandlers = {
            mouse: {
                move: null,
                up: null
            },
            touch: {
                move: null,
                end: null
            }
        };
        
        this.init();
    }

    init() {
        this.textOverlaysContainer = Utils.getElementById('textOverlays');
        this.setupDragHandlers();
    }

    setupDragHandlers() {
        // Pre-bind handlers for better performance
        this.dragHandlers.mouse.move = this.handleMouseDrag.bind(this);
        this.dragHandlers.mouse.up = this.handleMouseDragEnd.bind(this);
        this.dragHandlers.touch.move = this.handleTouchDrag.bind(this);
        this.dragHandlers.touch.end = this.handleTouchDragEnd.bind(this);
    }    addTextOverlay(text = null, position = null) {
        try {
            const state = this.state.getState();
            const textContent = text || `Text ${state.textCounter + 1}`;
            
            if (!this.textOverlaysContainer) {
                throw new Error('Text overlays container not found');
            }

            const textOverlay = this.createTextOverlayElement(textContent, position);
            this.textOverlaysContainer.appendChild(textOverlay);
            
            // Add to state
            this.state.addTextOverlay(textOverlay);
            
            // Hide demo background when first text is added
            if (this.getTextOverlayCount() === 1) {
                this.hideDemoBackground();
            }
            
            // Auto-select the new overlay
            this.selectTextOverlay(textOverlay);
            
            this.showMessage(`Text overlay "${textContent}" added`);
            
            return textOverlay;
            
        } catch (error) {
            this.handleError(error, 'adding text overlay');
            return null;
        }
    }

    createTextOverlayElement(textContent, position) {
        const textOverlay = Utils.createElement('div', 'text-overlay');
        textOverlay.textContent = textContent;
        textOverlay.setAttribute('data-text-id', Date.now().toString());
        
        // Set position
        const pos = position || Utils.getRandomPosition();
        this.setOverlayPosition(textOverlay, pos);
        
        // Add event listeners
        this.addOverlayEventListeners(textOverlay);
        
        return textOverlay;
    }

    setOverlayPosition(overlay, position) {
        overlay.style.left = position.x + '%';
        overlay.style.top = position.y + '%';
        overlay.style.transform = 'translate(-50%, -50%)';
    }

    addOverlayEventListeners(overlay) {
        // Mouse events
        overlay.addEventListener('mousedown', (e) => this.startDrag(e, overlay));
        overlay.addEventListener('click', (e) => this.handleOverlayClick(e, overlay));
        
        // Touch events
        overlay.addEventListener('touchstart', (e) => this.startDragTouch(e, overlay), { passive: false });
    }

    handleOverlayClick(e, overlay) {
        Utils.stopPropagation(e);
        this.selectTextOverlay(overlay);
    }

    selectTextOverlay(overlay) {
        try {
            // Deselect all others
            const textOverlays = this.state.getTextOverlays();
            textOverlays.forEach(text => Utils.removeClass(text, 'selected'));
            
            // Select this one
            Utils.addClass(overlay, 'selected');
            this.state.selectTextOverlay(overlay);
            
            // Update controls
            this.updateTextControls(overlay);
            
        } catch (error) {
            this.handleError(error, 'selecting text overlay');
        }
    }

    deselectAll() {
        const textOverlays = this.state.getTextOverlays();
        textOverlays.forEach(text => Utils.removeClass(text, 'selected'));
        this.state.selectTextOverlay(null);
    }

    updateTextControls(overlay) {
        if (!overlay) return;

        try {
            const textInput = Utils.getElementById('textInput');
            const fontSelect = Utils.getElementById('fontSelect');
            const fontSizeSlider = Utils.getElementById('fontSizeSlider');
            const textColor = Utils.getElementById('textColor');

            if (textInput) {
                textInput.value = overlay.textContent;
            }

            // Get computed styles
            const styles = window.getComputedStyle(overlay);

            if (fontSelect) {
                this.updateFontSelect(fontSelect, styles.fontFamily);
            }

            if (fontSizeSlider) {
                const fontSize = parseInt(styles.fontSize);
                fontSizeSlider.value = fontSize;
                this.updateFontSizeDisplay(fontSize);
            }

            if (textColor) {
                this.updateColorInput(textColor, styles.color);
            }
            
        } catch (error) {
            this.handleError(error, 'updating text controls');
        }
    }

    updateFontSelect(fontSelect, fontFamily) {
        const cleanFontFamily = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
        
        for (let i = 0; i < fontSelect.options.length; i++) {
            const optionValue = fontSelect.options[i].value.split(',')[0].trim();
            if (optionValue.toLowerCase().includes(cleanFontFamily.toLowerCase())) {
                fontSelect.selectedIndex = i;
                break;
            }
        }
    }

    updateColorInput(colorInput, computedColor) {
        const rgb = computedColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
            const hex = Utils.rgbToHex(rgb[0], rgb[1], rgb[2]);
            colorInput.value = hex;
        }
    }

    updateFontSizeDisplay(fontSize) {
        const fontSizeValue = Utils.getElementById('fontSizeValue');
        if (fontSizeValue) {
            fontSizeValue.textContent = fontSize + 'px';
        }
    }

    updateSelectedText() {
        const selectedOverlay = this.state.getSelectedTextOverlay();
        if (!selectedOverlay) return;

        try {
            const textInput = Utils.getElementById('textInput');
            const fontSelect = Utils.getElementById('fontSelect');
            const textColor = Utils.getElementById('textColor');

            if (textInput) {
                selectedOverlay.textContent = textInput.value || 'Sample Text';
            }

            if (fontSelect) {
                selectedOverlay.style.fontFamily = fontSelect.value;
            }

            if (textColor) {
                this.updateTextStyle(selectedOverlay, textColor.value);
            }
            
        } catch (error) {
            this.handleError(error, 'updating selected text');
        }
    }

    updateTextStyle(overlay, color) {
        overlay.style.color = color;
        
        // Update text outline for better visibility
        if (Utils.isLightColor(color)) {
            overlay.style.textShadow = '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000';
            overlay.style.webkitTextStroke = '2px #000';
        } else {
            overlay.style.textShadow = '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff';
            overlay.style.webkitTextStroke = '2px #fff';
        }
    }

    updateFontSize() {
        const selectedOverlay = this.state.getSelectedTextOverlay();
        if (!selectedOverlay) return;

        try {
            const fontSizeSlider = Utils.getElementById('fontSizeSlider');
            if (!fontSizeSlider) return;

            const fontSize = fontSizeSlider.value + 'px';
            selectedOverlay.style.fontSize = fontSize;
            this.updateFontSizeDisplay(parseInt(fontSizeSlider.value));
            
        } catch (error) {
            this.handleError(error, 'updating font size');
        }
    }    deleteSelectedText() {
        const selectedOverlay = this.state.getSelectedTextOverlay();
        if (!selectedOverlay) return;

        try {
            selectedOverlay.remove();
            this.state.removeTextOverlay(selectedOverlay);
            
            // Show demo background again if no text overlays remain
            if (this.getTextOverlayCount() === 0) {
                this.showDemoBackground();
            }
            
            this.showMessage('Text overlay deleted');
            
        } catch (error) {
            this.handleError(error, 'deleting text overlay');
        }
    }clearAllText() {
        try {
            const textOverlays = this.state.getTextOverlays();
            textOverlays.forEach(overlay => overlay.remove());
            this.state.clearAllTextOverlays();
            
            // Show demo background again when all text is cleared
            if (this.getTextOverlayCount() === 0) {
                this.showDemoBackground();
            }
            
            this.showMessage('All text overlays cleared');
            
        } catch (error) {
            this.handleError(error, 'clearing all text');
        }
    }

    // Drag functionality
    startDrag(e, overlay) {
        Utils.preventDefault(e);
        
        this.selectTextOverlay(overlay);
        this.initiateDrag(e.clientX, e.clientY, overlay);
        
        // Add mouse event listeners
        document.addEventListener('mousemove', this.dragHandlers.mouse.move);
        document.addEventListener('mouseup', this.dragHandlers.mouse.up);
    }

    startDragTouch(e, overlay) {
        Utils.preventDefault(e);
        
        this.selectTextOverlay(overlay);
        
        const touch = e.touches[0];
        this.initiateDrag(touch.clientX, touch.clientY, overlay);
        
        // Add touch event listeners
        document.addEventListener('touchmove', this.dragHandlers.touch.move, { passive: false });
        document.addEventListener('touchend', this.dragHandlers.touch.end);
    }    initiateDrag(clientX, clientY, overlay) {
        const rect = overlay.getBoundingClientRect();
        
        // Calculate drag offset relative to the center of the overlay element
        const dragOffset = {
            x: clientX - rect.left - rect.width / 2,
            y: clientY - rect.top - rect.height / 2
        };
        
        this.state.setDragging(true, dragOffset);
        Utils.addClass(overlay, 'dragging');
    }

    handleMouseDrag(e) {
        this.performDrag(e.clientX, e.clientY);
    }

    handleTouchDrag(e) {
        Utils.preventDefault(e);
        const touch = e.touches[0];
        this.performDrag(touch.clientX, touch.clientY);
    }    performDrag(clientX, clientY) {
        const { isDragging, dragOffset } = this.state.getState();
        const selectedOverlay = this.state.getSelectedTextOverlay();
        
        if (!isDragging || !selectedOverlay) return;

        // Use the actual image element bounds instead of container bounds for accurate positioning
        const imageElement = Utils.getElementById('imagePlayer');
        if (!imageElement || !imageElement.src) {
            // Fallback to container if no image is loaded
            const containerRect = this.textOverlaysContainer.getBoundingClientRect();
            const position = Utils.getPercentagePosition(clientX, clientY, containerRect, dragOffset);
            const constrainedPosition = Utils.constrainPosition(position.x, position.y, containerRect);
            this.setOverlayPosition(selectedOverlay, constrainedPosition);
            return;
        }

        const imageRect = imageElement.getBoundingClientRect();
        const position = Utils.getPercentagePosition(clientX, clientY, imageRect, dragOffset);
        const constrainedPosition = Utils.constrainPosition(position.x, position.y, imageRect);
        
        this.setOverlayPosition(selectedOverlay, constrainedPosition);
    }

    handleMouseDragEnd() {
        this.endDrag();
        document.removeEventListener('mousemove', this.dragHandlers.mouse.move);
        document.removeEventListener('mouseup', this.dragHandlers.mouse.up);
    }

    handleTouchDragEnd() {
        this.endDrag();
        document.removeEventListener('touchmove', this.dragHandlers.touch.move);
        document.removeEventListener('touchend', this.dragHandlers.touch.end);
    }

    endDrag() {
        const selectedOverlay = this.state.getSelectedTextOverlay();
        if (selectedOverlay) {
            Utils.removeClass(selectedOverlay, 'dragging');
        }
        this.state.setDragging(false);
    }

    // Template functionality
    applyTemplate(template) {
        try {
            this.clearAllText();
            
            if (template.topText) {
                this.addTextOverlay(template.topText, { x: 50, y: 25 });
            }
            
            if (template.bottomText) {
                this.addTextOverlay(template.bottomText, { x: 50, y: 75 });
            }
            
            this.showMessage(`Applied "${template.name}" template`);
            
        } catch (error) {
            this.handleError(error, 'applying template');
        }
    }

    // Utility methods
    handleError(error, context) {
        Utils.logError(error, `TextManager ${context}`);
        this.showMessage(`Error ${context}: ${error.message}`, 'error');
    }

    showMessage(text, type = 'info') {
        const event = new CustomEvent('app:notification', {
            detail: { message: text, type }
        });
        document.dispatchEvent(event);
    }

    // Public API
    getTextOverlayCount() {
        return this.state.getTextOverlays().length;
    }

    getSelectedText() {
        const overlay = this.state.getSelectedTextOverlay();
        return overlay ? overlay.textContent : '';
    }

    hasSelectedOverlay() {
        return this.state.getSelectedTextOverlay() !== null;
    }    destroy() {
        // Clean up event listeners
        this.endDrag();
        
        // Remove all overlays
        this.clearAllText();
    }

    // Helper method to hide demo background
    hideDemoBackground() {
        const demoBackground = Utils.getElementById('demoBackground');
        if (demoBackground) {
            demoBackground.style.display = 'none';
        }
    }

    // Helper method to show demo background
    showDemoBackground() {
        const demoBackground = Utils.getElementById('demoBackground');
        if (demoBackground) {
            demoBackground.style.display = 'flex';
        }
    }
}
