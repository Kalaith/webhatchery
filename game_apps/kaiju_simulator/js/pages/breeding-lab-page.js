// Breeding Lab Page Script
import { initBreedingLab } from '../breeding-lab.js';

document.addEventListener('DOMContentLoaded', () => {
    // Ensure Chart.js is loaded before initializing
    if (typeof Chart !== 'undefined') {
        initBreedingLab();
    } else {
        console.error('Chart.js is not loaded. Please ensure it is included in the HTML.');
    }
});
