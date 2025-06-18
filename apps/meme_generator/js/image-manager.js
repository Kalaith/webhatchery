// Image management functionality
import { Utils } from './utils.js';

export class ImageManager {
    constructor(state) {
        this.state = state;
        this.imagePlayer = null;
        this.demoBackground = null;
        this.currentImageFile = null;
        
        this.init();
    }    init() {
        this.imagePlayer = Utils.getElementById('imagePlayer');
        this.demoBackground = Utils.getElementById('demoBackground');
        
        this.setupImagePlayer();
    }

    setupImagePlayer() {
        if (!this.imagePlayer) return;

        this.imagePlayer.addEventListener('load', () => {
            this.onImageLoaded();
        });

        this.imagePlayer.addEventListener('error', (e) => {
            this.onImageError(e);
        });
    }

    async loadImage(file) {
        try {
            if (!this.isValidImageFile(file)) {
                throw new Error('Invalid image file. Please select a valid image format (JPG, PNG, GIF, WebP).');
            }

            // Create URL for the image
            const imageUrl = URL.createObjectURL(file);
            
            // Set image source
            this.imagePlayer.src = imageUrl;
            this.currentImageFile = file;
            
            // Update state
            this.state.update({
                currentMedia: {
                    type: 'image',
                    file: file,
                    url: imageUrl,
                    name: file.name
                },
                isPlaying: false
            });

            Utils.dispatchEvent('app:notification', {
                message: `Image "${file.name}" loaded successfully`,
                type: 'success'
            });

        } catch (error) {
            Utils.logError(error, 'ImageManager loadImage');
            Utils.dispatchEvent('app:notification', {
                message: error.message,
                type: 'error'
            });
        }
    }    onImageLoaded() {
        try {
            // Hide demo background and show image
            this.hideDemoBackground();
            this.showImage();
            
            // Resize the image container to match the uploaded image dimensions
            this.resizeContainerToImageSize();
            
            // Update UI state
            this.updateImageControls();
            
            Utils.dispatchEvent('app:notification', {
                message: 'Image ready for meme creation!',
                type: 'success'
            });

        } catch (error) {
            Utils.logError(error, 'ImageManager onImageLoaded');
        }
    }

    onImageError(event) {
        Utils.logError(event.target.error, 'ImageManager onImageError');
        Utils.dispatchEvent('app:notification', {
            message: 'Failed to load image. Please try a different file.',
            type: 'error'
        });
    }

    showImage() {
        if (this.imagePlayer) {
            this.imagePlayer.style.display = 'block';
            
            // Apply responsive styling
            this.imagePlayer.style.width = '100%';
            this.imagePlayer.style.height = 'auto';
            this.imagePlayer.style.maxHeight = '100%';
            this.imagePlayer.style.objectFit = 'contain';
        }
    }

    hideImage() {
        if (this.imagePlayer) {
            this.imagePlayer.style.display = 'none';
            this.imagePlayer.src = '';
        }
    }

    hideDemoBackground() {
        if (this.demoBackground) {
            this.demoBackground.style.display = 'none';
        }
    }    showDemoBackground() {
        if (this.demoBackground) {
            this.demoBackground.style.display = 'flex';
        }
    }    resizeContainerToImageSize() {
        if (!this.imagePlayer || !this.imagePlayer.naturalWidth || !this.imagePlayer.naturalHeight) {
            return;
        }

        const imageContainer = Utils.getElementById('imageContainer');
        if (!imageContainer) {
            return;
        }

        // Get the uploaded image dimensions
        const imageWidth = this.imagePlayer.naturalWidth;
        const imageHeight = this.imagePlayer.naturalHeight;        // Set the container size to match the image size
        imageContainer.style.width = imageWidth + 'px';
        imageContainer.style.height = imageHeight + 'px';
        imageContainer.style.setProperty('min-height', imageHeight + 'px', 'important'); // Force override CSS min-height
        imageContainer.style.setProperty('aspect-ratio', 'unset', 'important'); // Force remove CSS aspect ratio constraint
          console.log('Resized container to match image:', {
            imageWidth,
            imageHeight,
            containerWidth: imageContainer.offsetWidth,
            containerHeight: imageContainer.offsetHeight
        });
        
        // Also ensure the image player shows at actual size
        this.imagePlayer.style.width = imageWidth + 'px';
        this.imagePlayer.style.height = imageHeight + 'px';
        this.imagePlayer.style.objectFit = 'none'; // Don't scale the image
    }

    resetContainerSize() {
        const imageContainer = Utils.getElementById('imageContainer');
        if (!imageContainer) {
            return;
        }        // Reset container to original responsive size
        imageContainer.style.width = '';
        imageContainer.style.height = '';
        imageContainer.style.minHeight = ''; // Reset min-height override
        imageContainer.style.aspectRatio = ''; // Reset aspect ratio override
        
        // Reset image player styling
        if (this.imagePlayer) {
            this.imagePlayer.style.width = '100%';
            this.imagePlayer.style.height = 'auto';
            this.imagePlayer.style.objectFit = 'contain';
        }        console.log('Container size reset to responsive dimensions');
    }

    updateImageControls() {
        // Image is loaded - no additional controls needed for static images
        console.log('Image loaded and ready for text overlays');
    }

    isValidImageFile(file) {
        if (!file) return false;
        
        const validTypes = [
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/gif',
            'image/webp',
            'image/bmp',
            'image/svg+xml'
        ];
        
        return validTypes.includes(file.type.toLowerCase());
    }    reset() {
        try {
            this.hideImage();
            this.showDemoBackground();
            
            // Reset container size to original dimensions
            this.resetContainerSize();
            
            // Clean up URL object if exists
            if (this.currentImageFile && this.imagePlayer.src) {
                URL.revokeObjectURL(this.imagePlayer.src);
            }
            
            this.currentImageFile = null;

            // Update state
            this.state.update({
                currentMedia: null,
                isPlaying: false
            });

        } catch (error) {
            Utils.logError(error, 'ImageManager reset');
        }
    }

    getCurrentImage() {
        return this.currentImageFile;
    }

    getImageDimensions() {
        if (!this.imagePlayer || !this.imagePlayer.src) {
            return null;
        }

        return {
            width: this.imagePlayer.naturalWidth,
            height: this.imagePlayer.naturalHeight,
            displayWidth: this.imagePlayer.offsetWidth,
            displayHeight: this.imagePlayer.offsetHeight
        };
    }

    // Export functionality for images
    getImageDataURL() {
        if (!this.imagePlayer || !this.imagePlayer.src) {
            return null;
        }

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = this.imagePlayer.naturalWidth;
            canvas.height = this.imagePlayer.naturalHeight;
            
            ctx.drawImage(this.imagePlayer, 0, 0);
            
            return canvas.toDataURL('image/png');
        } catch (error) {
            Utils.logError(error, 'ImageManager getImageDataURL');
            return null;
        }
    }

    destroy() {
        if (this.currentImageFile && this.imagePlayer.src) {
            URL.revokeObjectURL(this.imagePlayer.src);
        }
        this.currentImageFile = null;
    }
}
