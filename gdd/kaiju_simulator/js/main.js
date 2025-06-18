// Main Application Entry Point
import { setupNavigation } from './navigation.js';
import { initKaijuPedia } from './kaiju-pedia.js';
import { initBreedingLab } from './breeding-lab.js';
import { initCombatSim } from './combat-sim.js';
import { initProgression } from './progression.js';
import { initSystems } from './systems.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    initKaijuPedia();
    initBreedingLab();
    initCombatSim();
    initProgression();
    initSystems();
});
