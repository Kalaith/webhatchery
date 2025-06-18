// Component Loader Utility
// Loads shared HTML components and injects them into the page

export class ComponentLoader {
    static async loadComponent(componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error loading component:', error);
            return '';
        }
    }

    static async injectHead() {
        const headContent = await this.loadComponent('components/head.html');
        if (headContent) {
            document.head.insertAdjacentHTML('beforeend', headContent);
        }
    }

    static async injectHeader() {
        const headerContent = await this.loadComponent('components/header.html');
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerContent && headerPlaceholder) {
            headerPlaceholder.outerHTML = headerContent;
        }
    }

    static async injectNavigation(activePage = '') {
        const navContent = await this.loadComponent('components/navigation.html');
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navContent && navPlaceholder) {
            navPlaceholder.outerHTML = navContent;
            
            // Set active navigation item
            if (activePage) {
                this.setActiveNavItem(activePage);
            }
        }
    }

    static setActiveNavItem(activePage) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page link
        const activeLink = document.querySelector(`.nav-link[href="${activePage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }    static async initializeComponents(activePage = '') {
        // Load header and navigation components (skip head since it's already in HTML)
        await Promise.all([
            this.injectHeader(),
            this.injectNavigation(activePage)
        ]);
    }
}
