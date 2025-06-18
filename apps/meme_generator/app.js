// Meme Generator Application
class MemeGenerator {
    constructor() {
        this.video = null;
        this.textOverlays = [];
        this.selectedTextOverlay = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.textCounter = 0;
        
        // Initialize the app
        this.init();
    }

    init() {
        console.log('Initializing Meme Generator...');
        this.setupEventListeners();
        this.populateTemplates();
        this.setupVideoControls();
        
        // Initialize with demo background
        this.initializeDemoBackground();
    }

    setupEventListeners() {
        // Video upload
        const uploadVideoBtn = document.getElementById('uploadVideoBtn');
        const hiddenVideoInput = document.getElementById('hiddenVideoInput');
        
        if (uploadVideoBtn && hiddenVideoInput) {
            uploadVideoBtn.addEventListener('click', () => {
                console.log('Upload video button clicked');
                hiddenVideoInput.click();
            });
            
            hiddenVideoInput.addEventListener('change', this.handleVideoUpload.bind(this));
        }
        
        // Text controls
        const addTextBtn = document.getElementById('addTextBtn');
        if (addTextBtn) {
            addTextBtn.addEventListener('click', () => {
                console.log('Add text button clicked');
                this.addTextOverlay();
            });
        }
        
        this.attachTextControlsListeners();
        
        // Template controls
        const clearAllBtn = document.getElementById('clearAllBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                console.log('Clear all button clicked');
                this.clearAllText();
            });
        }
        
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                console.log('Reset button clicked');
                this.resetMeme();
            });
        }
        
        // Export controls
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                console.log('Export button clicked');
                this.exportMeme();
            });
        }
        
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                console.log('Download button clicked');
                this.downloadMeme();
            });
        }

        // Video container click to deselect text
        const videoContainer = document.getElementById('videoContainer');
        if (videoContainer) {
            videoContainer.addEventListener('click', (e) => {
                // Only deselect if clicking directly on the container or video
                if (e.target.id === 'videoContainer' || 
                    e.target.id === 'videoPlayer' || 
                    e.target.id === 'demoBackground') {
                    this.deselectText();
                }
            });
        }
    }
    
    attachTextControlsListeners() {
        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.addEventListener('input', () => {
                this.updateSelectedText();
            });
        }
        
        const fontSelect = document.getElementById('fontSelect');
        if (fontSelect) {
            fontSelect.addEventListener('change', () => {
                this.updateSelectedText();
            });
        }
        
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', () => {
                this.updateFontSize();
            });
        }
        
        const textColor = document.getElementById('textColor');
        if (textColor) {
            textColor.addEventListener('change', () => {
                this.updateSelectedText();
            });
            textColor.addEventListener('input', () => {
                this.updateSelectedText();
            });
        }
        
        const deleteTextBtn = document.getElementById('deleteTextBtn');
        if (deleteTextBtn) {
            deleteTextBtn.addEventListener('click', () => {
                this.deleteSelectedText();
            });
        }
    }

    initializeDemoBackground() {
        // The demo background is already in HTML
        // Set up mock video properties
        const videoPlayer = document.getElementById('videoPlayer');
        
        if (videoPlayer) {
            // Create mock video object
            this.video = {
                duration: 30,
                currentTime: 0,
                paused: true,
                muted: false,
                volume: 1,
                play: () => {
                    this.video.paused = false;
                    console.log('Mock video playing');
                    this.updatePlayButton();
                    
                    // Simulate timeupdate event
                    if (this.playInterval) clearInterval(this.playInterval);
                    this.playInterval = setInterval(() => {
                        this.video.currentTime = (this.video.currentTime + 0.1) % this.video.duration;
                        this.updateProgress();
                        this.updateTimeDisplay();
                    }, 100);
                },
                pause: () => {
                    this.video.paused = true;
                    console.log('Mock video paused');
                    this.updatePlayButton();
                    
                    // Stop simulating timeupdate
                    if (this.playInterval) {
                        clearInterval(this.playInterval);
                        this.playInterval = null;
                    }
                }
            };
            
            this.updateTimeDisplay();
        }
    }

    populateTemplates() {
        const templateGrid = document.getElementById('templateGrid');
        if (!templateGrid) return;
        
        const templates = [
            {
                name: "Drake Pointing",
                description: "Classic Drake template",
                topText: "When you see bugs",
                bottomText: "When code works"
            },
            {
                name: "Distracted Boyfriend", 
                description: "Looking at something new",
                topText: "Me",
                bottomText: "New framework"
            },
            {
                name: "Woman Yelling at Cat",
                description: "Explaining vs confused",
                topText: "Me explaining code",
                bottomText: "My rubber duck"
            },
            {
                name: "This is Fine",
                description: "Everything is fine",
                topText: "This is fine",
                bottomText: "Production is down"
            }
        ];

        templates.forEach(template => {
            const templateItem = document.createElement('div');
            templateItem.className = 'template-item';
            templateItem.innerHTML = `
                <h4>${template.name}</h4>
                <p>${template.description}</p>
            `;
            templateItem.addEventListener('click', () => {
                console.log('Template clicked:', template.name);
                this.applyTemplate(template);
            });
            templateGrid.appendChild(templateItem);
        });
    }

    applyTemplate(template) {
        this.clearAllText();
        
        if (template.topText) {
            this.addTextOverlay(template.topText, { x: 50, y: 25 });
        }
        
        if (template.bottomText) {
            this.addTextOverlay(template.bottomText, { x: 50, y: 75 });
        }
        
        this.showMessage(`Applied "${template.name}" template`);
    }

    handleVideoUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            this.loadVideo(file);
        }
    }

    loadVideo(file) {
        const url = URL.createObjectURL(file);
        const videoPlayer = document.getElementById('videoPlayer');
        const demoBackground = document.getElementById('demoBackground');
        
        if (videoPlayer && demoBackground) {
            videoPlayer.src = url;
            videoPlayer.style.display = 'block';
            videoPlayer.style.background = 'none';
            demoBackground.style.display = 'none';
            
            this.video = videoPlayer;
            
            videoPlayer.addEventListener('loadedmetadata', () => {
                console.log('Video loaded, duration:', videoPlayer.duration);
                this.updateTimeDisplay();
                
                // Reset any existing mock video interval
                if (this.playInterval) {
                    clearInterval(this.playInterval);
                    this.playInterval = null;
                }
            });

            videoPlayer.addEventListener('timeupdate', () => {
                this.updateProgress();
                this.updateTimeDisplay();
            });
            
            this.showMessage(`Video "${file.name}" loaded successfully`);
        }
    }

    setupVideoControls() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const progressBar = document.getElementById('progressBar');
        const muteBtn = document.getElementById('muteBtn');
        const volumeSlider = document.getElementById('volumeSlider');

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', this.togglePlayPause.bind(this));
        }
        if (progressBar) {
            progressBar.addEventListener('input', this.seekVideo.bind(this));
        }
        if (muteBtn) {
            muteBtn.addEventListener('click', this.toggleMute.bind(this));
        }
        if (volumeSlider) {
            volumeSlider.addEventListener('input', this.updateVolume.bind(this));
        }
    }

    togglePlayPause() {
        if (!this.video) return;
        
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    updatePlayButton() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (!playPauseBtn) return;
        
        if (this.video && !this.video.paused) {
            playPauseBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
                Pause
            `;
        } else {
            playPauseBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5,3 19,12 5,21"/>
                </svg>
                Play
            `;
        }
    }

    seekVideo() {
        if (!this.video) return;
        
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const time = (progressBar.value / 100) * (this.video.duration || 30);
            this.video.currentTime = time;
        }
    }

    updateProgress() {
        if (!this.video) return;
        
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const progress = (this.video.currentTime / (this.video.duration || 30)) * 100;
            progressBar.value = progress;
        }
    }

    updateTimeDisplay() {
        if (!this.video) return;
        
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            const current = this.formatTime(this.video.currentTime || 0);
            const duration = this.formatTime(this.video.duration || 30);
            timeDisplay.textContent = `${current} / ${duration}`;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    toggleMute() {
        if (!this.video) return;
        
        this.video.muted = !this.video.muted;
        const muteBtn = document.getElementById('muteBtn');
        
        if (muteBtn) {
            if (this.video.muted) {
                muteBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
                        <line x1="23" y1="9" x2="17" y2="15"/>
                        <line x1="17" y1="9" x2="23" y2="15"/>
                    </svg>
                `;
            } else {
                muteBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                `;
            }
        }
    }

    updateVolume() {
        if (!this.video) return;
        
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            this.video.volume = volumeSlider.value / 100;
        }
    }

    addTextOverlay(text = null, position = null) {
        this.textCounter++;
        const textContent = text || `Text ${this.textCounter}`;
        
        const textOverlaysContainer = document.getElementById('textOverlays');
        if (!textOverlaysContainer) return;
        
        const textOverlay = document.createElement('div');
        textOverlay.className = 'text-overlay';
        textOverlay.textContent = textContent;
        textOverlay.setAttribute('data-text-id', this.textCounter);
        
        // Set position
        const pos = position || { 
            x: Math.random() * 60 + 20, // 20-80% of width
            y: Math.random() * 60 + 20  // 20-80% of height
        };
        
        textOverlay.style.left = pos.x + '%';
        textOverlay.style.top = pos.y + '%';
        textOverlay.style.transform = 'translate(-50%, -50%)';
        
        // Add event listeners for dragging
        textOverlay.addEventListener('mousedown', this.startDrag.bind(this));
        textOverlay.addEventListener('touchstart', this.startDragTouch.bind(this), { passive: false });
        textOverlay.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectTextOverlay(textOverlay);
        });
        
        textOverlaysContainer.appendChild(textOverlay);
        this.textOverlays.push(textOverlay);
        
        // Select the new text overlay
        this.selectTextOverlay(textOverlay);
        
        console.log('Text overlay added:', textContent);
        return textOverlay;
    }

    startDrag(e) {
        e.preventDefault();
        this.isDragging = true;
        this.selectedTextOverlay = e.currentTarget;
        this.selectTextOverlay(this.selectedTextOverlay);
        
        const rect = this.selectedTextOverlay.getBoundingClientRect();
        
        this.dragOffset = {
            x: e.clientX - rect.left - rect.width / 2,
            y: e.clientY - rect.top - rect.height / 2
        };
        
        this.selectedTextOverlay.classList.add('dragging');
        
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
    }
    
    startDragTouch(e) {
        e.preventDefault();
        this.isDragging = true;
        this.selectedTextOverlay = e.currentTarget;
        this.selectTextOverlay(this.selectedTextOverlay);
        
        const rect = this.selectedTextOverlay.getBoundingClientRect();
        const touch = e.touches[0];
        
        this.dragOffset = {
            x: touch.clientX - rect.left - rect.width / 2,
            y: touch.clientY - rect.top - rect.height / 2
        };
        
        this.selectedTextOverlay.classList.add('dragging');
        
        document.addEventListener('touchmove', this.dragTouch.bind(this), { passive: false });
        document.addEventListener('touchend', this.stopDragTouch.bind(this));
    }

    drag(e) {
        if (!this.isDragging || !this.selectedTextOverlay) return;
        
        const containerRect = document.getElementById('videoContainer').getBoundingClientRect();
        const x = e.clientX - containerRect.left - this.dragOffset.x;
        const y = e.clientY - containerRect.top - this.dragOffset.y;
        
        const percentX = (x / containerRect.width) * 100;
        const percentY = (y / containerRect.height) * 100;
        
        // Keep within bounds
        const boundedX = Math.max(0, Math.min(100, percentX));
        const boundedY = Math.max(0, Math.min(100, percentY));
        
        this.selectedTextOverlay.style.left = boundedX + '%';
        this.selectedTextOverlay.style.top = boundedY + '%';
    }
    
    dragTouch(e) {
        e.preventDefault();
        if (!this.isDragging || !this.selectedTextOverlay) return;
        
        const touch = e.touches[0];
        const containerRect = document.getElementById('videoContainer').getBoundingClientRect();
        const x = touch.clientX - containerRect.left - this.dragOffset.x;
        const y = touch.clientY - containerRect.top - this.dragOffset.y;
        
        const percentX = (x / containerRect.width) * 100;
        const percentY = (y / containerRect.height) * 100;
        
        // Keep within bounds
        const boundedX = Math.max(0, Math.min(100, percentX));
        const boundedY = Math.max(0, Math.min(100, percentY));
        
        this.selectedTextOverlay.style.left = boundedX + '%';
        this.selectedTextOverlay.style.top = boundedY + '%';
    }

    stopDrag() {
        if (this.selectedTextOverlay) {
            this.selectedTextOverlay.classList.remove('dragging');
        }
        this.isDragging = false;
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.stopDrag);
    }
    
    stopDragTouch() {
        if (this.selectedTextOverlay) {
            this.selectedTextOverlay.classList.remove('dragging');
        }
        this.isDragging = false;
        document.removeEventListener('touchmove', this.dragTouch);
        document.removeEventListener('touchend', this.stopDragTouch);
    }

    selectTextOverlay(overlay) {
        // Deselect all others
        this.textOverlays.forEach(text => text.classList.remove('selected'));
        
        // Select this one
        overlay.classList.add('selected');
        this.selectedTextOverlay = overlay;
        
        // Update controls to reflect current text properties
        this.updateTextControls();
    }

    updateTextControls() {
        if (!this.selectedTextOverlay) return;
        
        const textInput = document.getElementById('textInput');
        const fontSelect = document.getElementById('fontSelect');
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        const textColor = document.getElementById('textColor');
        
        if (textInput) textInput.value = this.selectedTextOverlay.textContent;
        
        // Get computed styles
        const styles = window.getComputedStyle(this.selectedTextOverlay);
        
        if (fontSelect) {
            // Try to match font family
            const fontFamily = styles.fontFamily;
            for (let i = 0; i < fontSelect.options.length; i++) {
                if (fontSelect.options[i].value.includes(fontFamily.split(',')[0].trim())) {
                    fontSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        const fontSize = parseInt(styles.fontSize);
        if (fontSizeSlider) {
            fontSizeSlider.value = fontSize;
            document.getElementById('fontSizeValue').textContent = fontSize + 'px';
        }
        
        if (textColor) {
            // Get the computed color and convert to hex
            const color = styles.color;
            const rgb = color.match(/\d+/g);
            if (rgb && rgb.length === 3) {
                const hex = '#' + 
                    parseInt(rgb[0]).toString(16).padStart(2, '0') +
                    parseInt(rgb[1]).toString(16).padStart(2, '0') +
                    parseInt(rgb[2]).toString(16).padStart(2, '0');
                textColor.value = hex;
            }
        }
    }

    updateSelectedText() {
        if (!this.selectedTextOverlay) return;
        
        const textInput = document.getElementById('textInput');
        const fontSelect = document.getElementById('fontSelect');
        const textColor = document.getElementById('textColor');
        
        if (textInput) {
            this.selectedTextOverlay.textContent = textInput.value || 'Sample Text';
        }
        
        if (fontSelect) {
            this.selectedTextOverlay.style.fontFamily = fontSelect.value;
        }
        
        if (textColor) {
            this.selectedTextOverlay.style.color = textColor.value;
            // Update text shadow for better visibility
            const color = textColor.value;
            // If light color, use black outline
            if (this.isLightColor(color)) {
                this.selectedTextOverlay.style.textShadow = `2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000`;
                this.selectedTextOverlay.style.webkitTextStroke = '2px #000';
            } else {
                // If dark color, use white outline
                this.selectedTextOverlay.style.textShadow = `2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff`;
                this.selectedTextOverlay.style.webkitTextStroke = '2px #fff';
            }
        }
    }
    
    isLightColor(color) {
        // Convert hex to RGB
        let r, g, b;
        if (color.startsWith('#')) {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);
        } else {
            // Parse rgb() format
            const rgb = color.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                r = parseInt(rgb[0]);
                g = parseInt(rgb[1]);
                b = parseInt(rgb[2]);
            } else {
                // Default to black if parsing fails
                return false;
            }
        }
        
        // Calculate brightness (YIQ formula)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128; // > 128 is light, <= 128 is dark
    }

    updateFontSize() {
        if (!this.selectedTextOverlay) return;
        
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        if (!fontSizeSlider) return;
        
        const fontSize = fontSizeSlider.value + 'px';
        this.selectedTextOverlay.style.fontSize = fontSize;
        
        const fontSizeValue = document.getElementById('fontSizeValue');
        if (fontSizeValue) fontSizeValue.textContent = fontSize;
    }

    deleteSelectedText() {
        if (!this.selectedTextOverlay) return;
        
        const index = this.textOverlays.indexOf(this.selectedTextOverlay);
        if (index > -1) {
            this.textOverlays.splice(index, 1);
        }
        
        this.selectedTextOverlay.remove();
        this.selectedTextOverlay = null;
        
        console.log('Text deleted');
        this.showMessage('Text overlay deleted');
    }

    clearAllText() {
        this.textOverlays.forEach(overlay => overlay.remove());
        this.textOverlays = [];
        this.selectedTextOverlay = null;
        
        console.log('All text cleared');
        this.showMessage('All text overlays cleared');
    }

    deselectText() {
        if (this.selectedTextOverlay) {
            this.selectedTextOverlay.classList.remove('selected');
            this.selectedTextOverlay = null;
        }
    }

    resetMeme() {
        this.clearAllText();
        
        // Reset video to beginning if available
        if (this.video) {
            this.video.currentTime = 0;
            if (!this.video.paused) {
                this.video.pause();
                this.updatePlayButton();
            }
            this.updateProgress();
            this.updateTimeDisplay();
        }
        
        console.log('Meme reset');
        this.showMessage('Meme reset to initial state');
    }

    exportMeme() {
        this.showMessage('Exporting meme... This would render the video with text overlays in a real implementation.');
    }

    downloadMeme() {
        const format = document.getElementById('exportFormat');
        const selectedFormat = format ? format.value : 'mp4-1080p';
        
        this.showMessage(`Downloading as ${selectedFormat}... This would save the file in a real implementation.`);
    }
    
    showMessage(text) {
        // Remove any existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create and show new message
        const message = document.createElement('div');
        message.className = 'message';
        message.textContent = text;
        document.body.appendChild(message);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
}

// Initialize the meme generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded, initializing Meme Generator...');
    window.memeGenerator = new MemeGenerator();
});