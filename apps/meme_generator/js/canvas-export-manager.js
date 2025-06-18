// Canvas Export Manager for rendering memes to downloadable images
import { Utils } from './utils.js';

export class CanvasExportManager {
    constructor(state, imageManager, textManager) {
        this.state = state;
        this.imageManager = imageManager;
        this.textManager = textManager;
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }

    init() {
        this.createCanvas();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set default canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    async exportMeme(format = 'png', quality = 0.9) {
        try {
            const imageElement = Utils.getElementById('imagePlayer');
            const textOverlays = this.state.getTextOverlays();

            if (!imageElement || !imageElement.src) {
                throw new Error('No image loaded. Please upload an image first.');
            }            // Set canvas size to match the image
            this.canvas.width = imageElement.naturalWidth || 800;
            this.canvas.height = imageElement.naturalHeight || 600;

            // Debug logging for exported image dimensions
            console.log('Export image dimensions debug:', {
                imageElementSrc: imageElement.src,
                naturalWidth: imageElement.naturalWidth,
                naturalHeight: imageElement.naturalHeight,
                offsetWidth: imageElement.offsetWidth,
                offsetHeight: imageElement.offsetHeight,
                canvasWidth: this.canvas.width,
                canvasHeight: this.canvas.height,
                textOverlaysCount: textOverlays.length
            });

            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw background image
            await this.drawBackgroundImage(imageElement);

            // Draw text overlays
            this.drawTextOverlays(textOverlays);

            // Export canvas to desired format
            return this.downloadCanvas(format, quality);

        } catch (error) {
            Utils.logError(error, 'CanvasExportManager exportMeme');
            throw error;
        }
    }

    async drawBackgroundImage(imageElement) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                try {
                    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => {
                reject(new Error('Failed to load background image'));
            };
            
            img.src = imageElement.src;
        });
    }

    drawTextOverlays(textOverlays) {
        textOverlays.forEach(overlay => {
            this.drawTextOverlay(overlay);
        });
    }    drawTextOverlay(overlay) {
        // overlay is the DOM element directly, not an object with element property
        const element = overlay;
        if (!element || !element.offsetParent) return;

        const imageElement = Utils.getElementById('imagePlayer');
          // Get the percentage position directly from the CSS properties
        const leftPercent = parseFloat(element.style.left) || 0;
        const topPercent = parseFloat(element.style.top) || 0;
        
        // The text percentages are now relative to the actual image bounds
        // Convert percentage to actual canvas coordinates directly
        const x = (leftPercent / 100) * this.canvas.width;
        const y = (topPercent / 100) * this.canvas.height;          
        // Debug logging
        console.log('Text positioning debug:', {
            leftPercent,
            topPercent,
            canvasWidth: this.canvas.width,
            canvasHeight: this.canvas.height,
            x,
            y,
            text: element.textContent
        });
        
        // Get computed styles
        const computedStyle = window.getComputedStyle(element);
        
        // Calculate font scaling based on the scale ratio from displayed to actual image
        const displayedImageWidth = imageElement.offsetWidth;
        const displayedImageHeight = imageElement.offsetHeight;
        const scaleX = this.canvas.width / displayedImageWidth;
        const scaleY = this.canvas.height / displayedImageHeight;
        
        const baseFontSize = parseInt(computedStyle.fontSize);
        const averageScale = (scaleX + scaleY) / 2;
        const fontSize = baseFontSize * averageScale;
          console.log('Font scaling debug:', {
            baseFontSize,
            averageScale,
            fontSize
        });
        
        const fontFamily = computedStyle.fontFamily;
        const color = computedStyle.color;
        const fontWeight = computedStyle.fontWeight;          // Set text properties
        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const text = element.textContent || element.innerText || '';        // Draw black outline to match the CSS styling
        // Use middle thickness value for better balance
        const strokeWidth = Math.max(2, fontSize / 18); // Middle thickness
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = strokeWidth;
        
        // Draw multiple strokes for outline (simulating CSS text-shadow)
        const offsets = [
            [strokeWidth, strokeWidth], [-strokeWidth, -strokeWidth], 
            [strokeWidth, -strokeWidth], [-strokeWidth, strokeWidth],
            [0, strokeWidth], [0, -strokeWidth], 
            [strokeWidth, 0], [-strokeWidth, 0]
        ];
        
        // Draw black outline strokes
        offsets.forEach(([dx, dy]) => {
            this.ctx.strokeText(text, x + dx, y + dy);
        });
        
        // Draw main stroke for webkit-text-stroke effect (middle thickness)
        this.ctx.lineWidth = strokeWidth * 1.8;
        this.ctx.strokeText(text, x, y);
        
        // Finally draw the main text
        this.ctx.fillText(text, x, y);
    }

    getContrastColor(color) {
        // Simple contrast color calculation
        if (color.includes('rgb')) {
            const matches = color.match(/\d+/g);
            if (matches && matches.length >= 3) {
                const r = parseInt(matches[0]);
                const g = parseInt(matches[1]);
                const b = parseInt(matches[2]);
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                return brightness > 128 ? '#000000' : '#FFFFFF';
            }
        }
        
        // Default to black stroke for light text, white for dark
        return color === '#ffffff' || color === 'white' ? '#000000' : '#FFFFFF';
    }

    downloadCanvas(format, quality) {
        try {
            let mimeType;
            let fileName;
            
            switch (format.toLowerCase()) {
                case 'jpg':
                case 'jpeg':
                    mimeType = 'image/jpeg';
                    fileName = `meme_${Date.now()}.jpg`;
                    break;
                case 'png':
                    mimeType = 'image/png';
                    fileName = `meme_${Date.now()}.png`;
                    break;
                case 'webp':
                    mimeType = 'image/webp';
                    fileName = `meme_${Date.now()}.webp`;
                    break;
                default:
                    mimeType = 'image/png';
                    fileName = `meme_${Date.now()}.png`;
            }            // Convert canvas to blob
            this.canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error('Failed to generate image');
                }

                // Debug logging for final exported image
                console.log('Final exported image debug:', {
                    blobSize: blob.size,
                    blobType: blob.type,
                    canvasWidth: this.canvas.width,
                    canvasHeight: this.canvas.height,
                    fileName: fileName,
                    format: format,
                    quality: quality
                });

                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up
                URL.revokeObjectURL(url);
                
                Utils.dispatchEvent('app:notification', {
                    message: `Meme downloaded as ${fileName}`,
                    type: 'success'
                });

            }, mimeType, quality);

            return {
                format: format,
                fileName: fileName,
                width: this.canvas.width,
                height: this.canvas.height
            };

        } catch (error) {
            Utils.logError(error, 'CanvasExportManager downloadCanvas');
            throw error;
        }
    }

    // Preview functionality
    getPreviewDataURL(format = 'png', quality = 0.9) {
        try {
            let mimeType;
            
            switch (format.toLowerCase()) {
                case 'jpg':
                case 'jpeg':
                    mimeType = 'image/jpeg';
                    break;
                case 'png':
                    mimeType = 'image/png';
                    break;
                case 'webp':
                    mimeType = 'image/webp';
                    break;
                default:
                    mimeType = 'image/png';
            }

            return this.canvas.toDataURL(mimeType, quality);
            
        } catch (error) {
            Utils.logError(error, 'CanvasExportManager getPreviewDataURL');
            return null;
        }
    }

    // Get canvas dimensions
    getCanvasDimensions() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    // Cleanup
    destroy() {
        if (this.canvas) {
            this.canvas = null;
            this.ctx = null;
        }
    }
}
