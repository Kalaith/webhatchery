import { Utils } from './utils.js';

// Notification system for user feedback
export class NotificationManager {
    constructor() {
        this.notifications = new Map();
        this.container = null;
        this.defaultDuration = 3000;
        
        this.init();
    }

    init() {
        this.createContainer();
        this.setupEventListeners();
    }

    createContainer() {
        this.container = Utils.createElement('div', 'notification-container');
        this.container.id = 'notification-container';
        document.body.appendChild(this.container);
    }

    setupEventListeners() {
        // Listen for notification requests
        document.addEventListener('app:notification', (e) => {
            const { message, type, duration } = e.detail;
            this.show(message, type, duration);
        });
    }    show(message, type = 'info', duration = null) {
        try {
            if (!Utils.isValidString(message)) {
                console.warn('Notification message is required');
                return;
            }

            const notification = this.createNotification(message, type);
            const id = this.addNotification(notification);
            
            // Auto-remove after duration
            const notificationDuration = duration || this.getDefaultDuration(type);
            if (notificationDuration > 0) {
                setTimeout(() => {
                    this.remove(id);
                }, notificationDuration);
            }

            // Failsafe: Always remove after maximum time to prevent stuck notifications
            setTimeout(() => {
                this.remove(id);
            }, Math.max(notificationDuration || this.defaultDuration, 10000));

            return id;
            
        } catch (error) {
            Utils.logError(error, 'NotificationManager show');
        }
    }

    createNotification(message, type) {
        const notification = Utils.createElement('div', `notification notification--${type}`);
        
        const icon = this.getTypeIcon(type);
        const closeBtn = this.createCloseButton();
        
        notification.innerHTML = `
            <div class="notification__icon">${icon}</div>
            <div class="notification__content">
                <div class="notification__message">${message}</div>
            </div>
        `;
        
        notification.appendChild(closeBtn);
        
        return notification;
    }

    createCloseButton() {
        const closeBtn = Utils.createElement('button', 'notification__close');
        closeBtn.innerHTML = '×';
        closeBtn.setAttribute('aria-label', 'Close notification');
        
        closeBtn.addEventListener('click', (e) => {
            const notification = e.target.closest('.notification');
            if (notification) {
                const id = notification.getAttribute('data-id');
                this.remove(id);
            }
        });
        
        return closeBtn;
    }

    addNotification(notification) {
        const id = Date.now().toString();
        notification.setAttribute('data-id', id);
        
        // Add to container
        this.container.appendChild(notification);
        
        // Store reference
        this.notifications.set(id, notification);
        
        // Animate in
        requestAnimationFrame(() => {
            Utils.addClass(notification, 'notification--show');
        });
        
        return id;
    }    remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        // Animate out
        Utils.removeClass(notification, 'notification--show');
        Utils.addClass(notification, 'notification--hide');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 350); // Slightly longer timeout to ensure animation completes
    }

    removeAll() {
        const ids = Array.from(this.notifications.keys());
        ids.forEach(id => this.remove(id));
    }

    getTypeIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        return icons[type] || icons.info;
    }

    getDefaultDuration(type) {
        const durations = {
            info: 3000,
            success: 2000,
            warning: 4000,
            error: 5000
        };
        
        return durations[type] || this.defaultDuration;
    }

    // Public API methods
    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    // Persistent notification (doesn't auto-remove)
    persist(message, type = 'info') {
        return this.show(message, type, 0);
    }

    // Quick methods for common scenarios
    fileUploaded(filename) {
        return this.success(`File "${filename}" uploaded successfully`);
    }

    fileSaved(filename) {
        return this.success(`File "${filename}" saved successfully`);
    }

    actionCompleted(action) {
        return this.success(`${action} completed successfully`);
    }

    validationError(field) {
        return this.error(`Please check the ${field} field`);
    }

    networkError() {
        return this.error('Network error. Please check your connection and try again.');
    }

    // Configuration
    setDefaultDuration(duration) {
        this.defaultDuration = duration;
    }

    getNotificationCount() {
        return this.notifications.size;
    }

    hasNotifications() {
        return this.notifications.size > 0;
    }

    destroy() {
        this.removeAll();
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.notifications.clear();
    }
}

// Create and export singleton instance
const notificationManager = new NotificationManager();
export default notificationManager;
