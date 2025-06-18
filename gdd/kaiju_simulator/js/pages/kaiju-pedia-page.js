// Kaiju-pedia Page Script
import { initKaijuPedia } from '../kaiju-pedia.js';

document.addEventListener('DOMContentLoaded', () => {
    // Ensure Chart.js is loaded before initializing
    if (typeof Chart !== 'undefined') {
        initKaijuPedia();
    } else {
        console.error('Chart.js is not loaded. Please ensure it is included in the HTML.');
    }
});
