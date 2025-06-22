// User Interface Manager
import { CombatSystem } from './combat.js';

export class UIManager {
    constructor() {
        this.combatForecastElement = null;
        this.setupElements();
    }
    
    setupElements() {
        this.combatForecastElement = document.getElementById('combatForecast');
    }
    
    updatePhaseIndicator(currentPhase, turnCounter) {
        const phaseEl = document.getElementById('phaseIndicator');
        if (phaseEl) {
            phaseEl.textContent = `Turn ${turnCounter} - ${currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase`;
            phaseEl.className = `phase-indicator ${currentPhase === 'enemy' ? 'enemy-phase' : ''}`;
        }
    }
    
    updateActionButtons(selectedUnit, gameMode) {
        const moveBtn = document.getElementById('moveBtn');
        const attackBtn = document.getElementById('attackBtn');
        const waitBtn = document.getElementById('waitBtn');
        
        if (!selectedUnit) {
            [moveBtn, attackBtn, waitBtn].forEach(btn => {
                if (btn) btn.disabled = true;
            });
            return;
        }
        
        if (moveBtn) {
            moveBtn.disabled = selectedUnit.moved;
            moveBtn.classList.toggle('active', gameMode === 'move');
        }
        
        if (attackBtn) {
            attackBtn.disabled = selectedUnit.acted;
            attackBtn.classList.toggle('active', gameMode === 'attack');
        }
        
        if (waitBtn) {
            waitBtn.disabled = selectedUnit.moved && selectedUnit.acted;
        }
    }
    
    updateUnitInfo(unit) {
        const infoEl = document.getElementById('unitInfo');
        if (!infoEl) return;
        
        if (!unit) {
            infoEl.innerHTML = '<p class="text-secondary">Select a unit to view stats</p>';
            return;
        }
        
        const weaponAdvantage = this.getWeaponAdvantageText(unit.weapon);
        let hpClass = '';
        const hpPercent = unit.hp / unit.maxHp;
        
        if (hpPercent <= 0.25) hpClass = 'hp-critical';
        else if (hpPercent <= 0.5) hpClass = 'hp-warning';
        
        infoEl.innerHTML = `
            <div class="unit-details">
                <h3>${unit.name}</h3>
                <p class="unit-type">${unit.type}</p>
                <div class="unit-stats">
                    <div class="stat-row">
                        <span>Level:</span>
                        <span>${unit.level}</span>
                    </div>
                    <div class="stat-row">
                        <span>HP:</span>
                        <span class="${hpClass}">${unit.hp}/${unit.maxHp}</span>
                    </div>
                    <div class="stat-row">
                        <span>Attack:</span>
                        <span>${unit.attack}</span>
                    </div>
                    <div class="stat-row">
                        <span>Defense:</span>
                        <span>${unit.defense}</span>
                    </div>
                    <div class="stat-row">
                        <span>Speed:</span>
                        <span>${unit.speed}</span>
                    </div>
                    <div class="stat-row">
                        <span>Weapon:</span>
                        <span>${unit.weapon}</span>
                    </div>
                    <div class="stat-row">
                        <span>EXP:</span>
                        <span>${unit.exp}/100</span>
                    </div>
                </div>
                ${weaponAdvantage ? `<div class="weapon-triangle-info">${weaponAdvantage}</div>` : ''}
            </div>
        `;
    }
    
    showCombatForecast(attacker, defender) {
        if (!this.combatForecastElement) return;
        
        const attackerDamage = CombatSystem.calculateDamage(attacker, defender);
        const defenderDamage = CombatSystem.calculateDamage(defender, attacker);
        const attackerHit = CombatSystem.calculateHitRate(attacker, defender);
        const defenderHit = CombatSystem.calculateHitRate(defender, attacker);
        const attackerCrit = CombatSystem.calculateCritRate(attacker);
        const defenderCrit = CombatSystem.calculateCritRate(defender);
        const attackerDouble = CombatSystem.canDoubleAttack(attacker, defender);
        const defenderDouble = CombatSystem.canDoubleAttack(defender, attacker);
        
        const weaponAdvantage = CombatSystem.getWeaponAdvantage(attacker.weapon, defender.weapon);
        let advantageText = '';
        let advantageClass = '';
        
        if (weaponAdvantage === 'strong') {
            advantageText = 'Weapon Advantage!';
            advantageClass = 'strong';
        } else if (weaponAdvantage === 'weak') {
            advantageText = 'Weapon Disadvantage';
            advantageClass = 'weak';
        }
        
        this.combatForecastElement.innerHTML = `
            <div class="combat-participants">
                <div class="combat-unit">
                    <div class="combat-unit-name">${attacker.name}</div>
                    <div class="combat-stats">
                        <div>Damage: ${attackerDamage}${attackerDouble ? ' x2' : ''}</div>
                        <div>Hit: ${attackerHit}%</div>
                        <div>Crit: ${attackerCrit}%</div>
                    </div>
                    ${advantageText ? `<div class="weapon-advantage ${advantageClass}">${advantageText}</div>` : ''}
                </div>
                <div class="combat-vs">VS</div>
                <div class="combat-unit">
                    <div class="combat-unit-name">${defender.name}</div>
                    <div class="combat-stats">
                        <div>Damage: ${defenderDamage}${defenderDouble ? ' x2' : ''}</div>
                        <div>Hit: ${defenderHit}%</div>
                        <div>Crit: ${defenderCrit}%</div>
                    </div>
                </div>
            </div>
        `;
        
        this.combatForecastElement.style.display = 'block';
    }
    
    hideCombatForecast() {
        if (this.combatForecastElement) {
            this.combatForecastElement.style.display = 'none';
        }
    }
    
    showGameOverModal(result) {
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        
        const content = document.createElement('div');
        content.className = 'game-over-content';
        content.innerHTML = `
            <h2 class="game-over-title ${result.toLowerCase()}">${result}!</h2>
            <p>The battle has ended.</p>
            <button class="btn btn--primary" onclick="this.parentElement.parentElement.remove(); tacticalCombat.resetGame();">
                Play Again
            </button>
        `;
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);
    }
    
    showLevelUpModal(unit, levelUps) {
        if (levelUps.length === 0) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'level-up-overlay';
        
        const content = document.createElement('div');
        content.className = 'level-up-content';
        
        let levelUpHtml = `<h2>Level Up!</h2><p>${unit.name} reached level ${unit.level}!</p>`;
        
        levelUps.forEach(levelUp => {
            levelUpHtml += `<div class="stat-gains">`;
            Object.keys(levelUp.gains).forEach(stat => {
                if (levelUp.gains[stat] > 0) {
                    levelUpHtml += `<div class="stat-gain">${stat.toUpperCase()}: +${levelUp.gains[stat]}</div>`;
                }
            });
            levelUpHtml += `</div>`;
        });
        
        levelUpHtml += `<button class="btn btn--primary" onclick="this.parentElement.parentElement.remove();">Continue</button>`;
        
        content.innerHTML = levelUpHtml;
        overlay.appendChild(content);
        document.body.appendChild(overlay);
    }
    
    getWeaponAdvantageText(weapon) {
        const advantages = {
            'Sword': 'Strong vs Axe, Weak vs Lance',
            'Axe': 'Strong vs Lance, Weak vs Sword', 
            'Lance': 'Strong vs Sword, Weak vs Axe'
        };
        return advantages[weapon] || '';
    }
}
