// Utility functions for Project Manager
class ProjectUtils {
    static showNotification(message, type = 'info') {
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.className = `notification notification--${type} notification--show`;
        
        setTimeout(() => {
            notification.classList.remove('notification--show');
        }, 3000);
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static getFieldLabel(field) {
        const label = field.parentNode.querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : field.name || 'Field';
    }

    static showFieldError(field, message) {
        field.classList.add('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    static clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    static async loadProjectData() {
        try {
            const response = await fetch('./data.json');
            return await response.json();
        } catch (error) {
            console.error('Failed to load project data:', error);
            return null;
        }
    }

    static downloadFile(content, filename, contentType = 'application/octet-stream') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    static handleKeyNavigation(e, manager) {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'Enter':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    manager.nextStep();
                }
                break;
            case 'ArrowLeft':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    manager.prevStep();
                }
                break;
            case 'Escape':
                manager.showView('landing');
                break;
        }
    }
}
