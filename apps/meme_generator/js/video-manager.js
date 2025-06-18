import { Utils } from './utils.js';

// Video management functionality
export class VideoManager {
    constructor(state) {
        this.state = state;
        this.videoPlayer = null;
        this.demoBackground = null;
        this.mockVideo = null;
        
        this.init();
    }

    init() {
        this.videoPlayer = Utils.getElementById('videoPlayer');
        this.demoBackground = Utils.getElementById('demoBackground');
        
        this.setupVideoPlayer();
        this.initializeDemoBackground();
    }

    setupVideoPlayer() {
        if (!this.videoPlayer) return;

        this.videoPlayer.addEventListener('loadedmetadata', () => {
            this.onVideoLoaded();
        });

        this.videoPlayer.addEventListener('timeupdate', () => {
            this.onTimeUpdate();
        });

        this.videoPlayer.addEventListener('play', () => {
            this.onPlayStateChange(false);
        });

        this.videoPlayer.addEventListener('pause', () => {
            this.onPlayStateChange(true);
        });

        this.videoPlayer.addEventListener('ended', () => {
            this.onVideoEnded();
        });

        this.videoPlayer.addEventListener('error', (e) => {
            this.onVideoError(e);
        });
    }

    initializeDemoBackground() {
        // Create mock video object for demo mode
        this.mockVideo = {
            duration: 30,
            currentTime: 0,
            paused: true,
            muted: false,
            volume: 1,
            play: () => this.playMockVideo(),
            pause: () => this.pauseMockVideo(),
            addEventListener: () => {},
            removeEventListener: () => {}
        };

        this.state.setVideo(this.mockVideo);
        this.showDemoBackground();
    }

    showDemoBackground() {
        if (this.demoBackground) {
            this.demoBackground.style.display = 'flex';
        }
        if (this.videoPlayer) {
            this.videoPlayer.style.display = 'none';
        }
    }

    hideDemoBackground() {
        if (this.demoBackground) {
            this.demoBackground.style.display = 'none';
        }
        if (this.videoPlayer) {
            this.videoPlayer.style.display = 'block';
        }
    }

    async loadVideo(file) {
        try {
            this.state.setLoading(true);
            this.state.clearError();

            if (!Utils.isVideoFile(file)) {
                throw new Error('Please select a valid video file');
            }

            const videoUrl = Utils.createObjectURL(file);
            
            // Hide demo background and show video player
            this.hideDemoBackground();
            
            this.videoPlayer.src = videoUrl;
            this.videoPlayer.style.background = 'none';
            
            // Set real video as current video
            this.state.setVideo(this.videoPlayer);
            
            // Clean up mock video interval if it exists
            this.clearMockInterval();
            
            this.showMessage(`Video "${file.name}" loaded successfully`);
            
        } catch (error) {
            this.handleError(error, 'loading video');
            this.state.setError(Utils.createErrorMessage('Failed to load video', error.message));
        } finally {
            this.state.setLoading(false);
        }
    }

    playMockVideo() {
        this.mockVideo.paused = false;
        this.clearMockInterval();
        
        const interval = setInterval(() => {
            this.mockVideo.currentTime = (this.mockVideo.currentTime + 0.1) % this.mockVideo.duration;
            this.onTimeUpdate();
        }, 100);
        
        this.state.setPlayInterval(interval);
        this.onPlayStateChange(false);
    }

    pauseMockVideo() {
        this.mockVideo.paused = true;
        this.clearMockInterval();
        this.onPlayStateChange(true);
    }

    clearMockInterval() {
        const currentInterval = this.state.getState().playInterval;
        if (currentInterval) {
            clearInterval(currentInterval);
            this.state.setPlayInterval(null);
        }
    }

    togglePlayPause() {
        const video = this.state.getVideo();
        if (!video) return;

        try {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        } catch (error) {
            this.handleError(error, 'playing/pausing video');
        }
    }

    seekTo(percentage) {
        const video = this.state.getVideo();
        if (!video) return;

        try {
            const time = (percentage / 100) * (video.duration || 30);
            video.currentTime = time;
        } catch (error) {
            this.handleError(error, 'seeking video');
        }
    }

    setVolume(volume) {
        const video = this.state.getVideo();
        if (!video) return;

        try {
            video.volume = Math.max(0, Math.min(1, volume / 100));
        } catch (error) {
            this.handleError(error, 'setting volume');
        }
    }

    toggleMute() {
        const video = this.state.getVideo();
        if (!video) return;

        try {
            video.muted = !video.muted;
            this.updateMuteButton(video.muted);
        } catch (error) {
            this.handleError(error, 'toggling mute');
        }
    }

    reset() {
        try {
            this.clearMockInterval();
            
            const video = this.state.getVideo();
            if (video) {
                video.currentTime = 0;
                if (!video.paused) {
                    video.pause();
                }
            }
            
            // Reset to demo mode
            this.initializeDemoBackground();
            
        } catch (error) {
            this.handleError(error, 'resetting video');
        }
    }

    // Event handlers
    onVideoLoaded() {
        this.updateTimeDisplay();
        this.clearMockInterval();
        
        // Dispatch custom event for other components
        this.dispatchVideoEvent('video:loaded');
    }

    onTimeUpdate() {
        this.updateProgress();
        this.updateTimeDisplay();
        
        this.dispatchVideoEvent('video:timeupdate');
    }

    onPlayStateChange(paused) {
        this.updatePlayButton(paused);
        
        this.dispatchVideoEvent(paused ? 'video:paused' : 'video:playing');
    }

    onVideoEnded() {
        this.onPlayStateChange(true);
        this.dispatchVideoEvent('video:ended');
    }

    onVideoError(error) {
        this.handleError(error, 'video playback');
        this.dispatchVideoEvent('video:error', { error });
    }

    // UI Updates
    updatePlayButton(paused = null) {
        const playPauseBtn = Utils.getElementById('playPauseBtn');
        if (!playPauseBtn) return;

        const video = this.state.getVideo();
        const isPaused = paused !== null ? paused : (video ? video.paused : true);

        if (isPaused) {
            playPauseBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5,3 19,12 5,21"/>
                </svg>
                Play
            `;
        } else {
            playPauseBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
                Pause
            `;
        }
    }

    updateProgress() {
        const video = this.state.getVideo();
        if (!video) return;

        const progressBar = Utils.getElementById('progressBar');
        if (progressBar) {
            const progress = (video.currentTime / (video.duration || 30)) * 100;
            progressBar.value = progress;
        }
    }

    updateTimeDisplay() {
        const video = this.state.getVideo();
        if (!video) return;

        const timeDisplay = Utils.getElementById('timeDisplay');
        if (timeDisplay) {
            const current = Utils.formatTime(video.currentTime || 0);
            const duration = Utils.formatTime(video.duration || 30);
            timeDisplay.textContent = `${current} / ${duration}`;
        }
    }

    updateMuteButton(muted) {
        const muteBtn = Utils.getElementById('muteBtn');
        if (!muteBtn) return;

        if (muted) {
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

    // Utility methods
    dispatchVideoEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    handleError(error, context) {
        Utils.logError(error, `VideoManager ${context}`);
        this.showMessage(`Error ${context}: ${error.message}`, 'error');
    }

    showMessage(text, type = 'info') {
        // This will be handled by the NotificationManager
        const event = new CustomEvent('app:notification', {
            detail: { message: text, type }
        });
        document.dispatchEvent(event);
    }

    // Public API
    getCurrentTime() {
        const video = this.state.getVideo();
        return video ? video.currentTime : 0;
    }

    getDuration() {
        const video = this.state.getVideo();
        return video ? (video.duration || 30) : 30;
    }

    isPlaying() {
        const video = this.state.getVideo();
        return video ? !video.paused : false;
    }

    destroy() {
        this.clearMockInterval();
        
        if (this.videoPlayer && this.videoPlayer.src) {
            Utils.revokeObjectURL(this.videoPlayer.src);
        }
    }
}
