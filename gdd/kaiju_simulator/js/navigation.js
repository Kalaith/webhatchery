// Navigation Module
import { kaijuData } from '../data/kaiju-data.js';
import { combatPhases } from '../data/combat-data.js';
import { progressionData } from '../data/progression-data.js';
import { trainingData } from '../data/training-data.js';

export function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
}
