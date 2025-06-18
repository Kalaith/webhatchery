// Utility functions for common operations
export class Utils {
    // DOM utilities
    static getElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    }

    static createElement(tag, className = '', textContent = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }

    // Time formatting
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Color utilities
    static isLightColor(color) {
        let r, g, b;
        
        if (color.startsWith('#')) {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);
        } else {
            const rgb = color.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                r = parseInt(rgb[0]);
                g = parseInt(rgb[1]);
                b = parseInt(rgb[2]);
            } else {
                return false;
            }
        }
        
        // Calculate brightness (YIQ formula)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128;
    }

    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static rgbToHex(r, g, b) {
        return '#' + 
            parseInt(r).toString(16).padStart(2, '0') +
            parseInt(g).toString(16).padStart(2, '0') +
            parseInt(b).toString(16).padStart(2, '0');
    }

    // Position utilities
    static constrainPosition(x, y, containerRect) {
        const boundedX = Math.max(0, Math.min(100, x));
        const boundedY = Math.max(0, Math.min(100, y));
        return { x: boundedX, y: boundedY };
    }

    static getPercentagePosition(clientX, clientY, containerRect, offset = { x: 0, y: 0 }) {
        const x = clientX - containerRect.left - offset.x;
        const y = clientY - containerRect.top - offset.y;
        
        const percentX = (x / containerRect.width) * 100;
        const percentY = (y / containerRect.height) * 100;
        
        return { x: percentX, y: percentY };
    }

    // Random utilities
    static getRandomPosition() {
        return {
            x: Math.random() * 60 + 20, // 20-80% of width
            y: Math.random() * 60 + 20  // 20-80% of height
        };
    }    // File utilities
    static isVideoFile(file) {
        return file && file.type.startsWith('video/');
    }

    static isImageFile(file) {
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
    }

    static createObjectURL(file) {
        return URL.createObjectURL(file);
    }

    static revokeObjectURL(url) {
        URL.revokeObjectURL(url);
    }

    // Debounce utility
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle utility
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // CSS class utilities
    static addClass(element, className) {
        if (element && className) {
            element.classList.add(className);
        }
    }

    static removeClass(element, className) {
        if (element && className) {
            element.classList.remove(className);
        }
    }

    static toggleClass(element, className) {
        if (element && className) {
            element.classList.toggle(className);
        }
    }

    static hasClass(element, className) {
        return element && className && element.classList.contains(className);
    }

    // Event utilities
    static preventDefault(event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    static stopPropagation(event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
    }

    // Validation utilities
    static isValidString(str) {
        return typeof str === 'string' && str.trim().length > 0;
    }

    static isValidNumber(num) {
        return typeof num === 'number' && !isNaN(num) && isFinite(num);
    }

    // Animation utilities
    static fadeIn(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress.toString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        if (!element) return;
        
        const start = performance.now();
        const startOpacity = parseFloat(element.style.opacity) || 1;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = (startOpacity * (1 - progress)).toString();
            
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Error handling utilities
    static logError(error, context = '') {
        console.error(`Error ${context}:`, error);
    }

    static createErrorMessage(message, details = '') {        return {
            message,
            details,
            timestamp: new Date().toISOString()
        };
    }

    // Event dispatch utility
    static dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}
