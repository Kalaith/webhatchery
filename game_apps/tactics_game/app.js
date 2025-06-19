// Main Application Entry Point
import { TacticalCombatGame } from './js/game.js';

// Initialize the game when the page loads
let tacticalCombat;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    
    tacticalCombat = new TacticalCombatGame({
        canvas: canvas,
        onGameEnd: (result) => {
            console.log('Game ended with result:', result);
        }
    });
    
    tacticalCombat.initialize();
});

// Make tacticalCombat available globally for HTML onclick handlers
window.tacticalCombat = tacticalCombat;
