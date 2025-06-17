// Progression Page Script
import { initProgression } from '../progression.js';

document.addEventListener('DOMContentLoaded', () => {
    // Ensure Chart.js is loaded before initializing
    if (typeof Chart !== 'undefined') {
        initProgression();
    } else {
        console.error('Chart.js is not loaded. Please ensure it is included in the HTML.');
    }
});
