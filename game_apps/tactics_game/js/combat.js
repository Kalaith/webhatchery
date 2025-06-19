// Combat System - Handles battle calculations and resolution
import { CONFIG, WEAPON_TRIANGLE } from './config.js';

export class CombatSystem {
    static calculateDamage(attacker, defender) {
        let baseDamage = attacker.attack - defender.defense;
        baseDamage = Math.max(1, baseDamage); // Minimum 1 damage
        
        // Weapon triangle advantage
        const weaponAdvantage = this.getWeaponAdvantage(attacker.weapon, defender.weapon);
        if (weaponAdvantage === 'strong') {
            baseDamage += CONFIG.weaponTriangleBonus;
        } else if (weaponAdvantage === 'weak') {
            baseDamage -= CONFIG.weaponTriangleBonus;
        }
        
        return Math.max(1, baseDamage);
    }
    
    static calculateHitRate(attacker, defender) {
        const baseHitRate = 85; // Base hit rate percentage
        const hitRate = baseHitRate + (attacker.speed - defender.speed) * 2;
        return Math.max(10, Math.min(100, hitRate)); // Clamp between 10-100%
    }
    
    static calculateCritRate(attacker) {
        return Math.min(50, CONFIG.criticalHitRate + attacker.speed); // Max 50% crit
    }
    
    static canDoubleAttack(attacker, defender) {
        return attacker.speed >= defender.speed + CONFIG.doubleAttackSpeedThreshold;
    }
    
    static getWeaponAdvantage(attackerWeapon, defenderWeapon) {
        const triangle = WEAPON_TRIANGLE[attackerWeapon];
        if (!triangle) return 'neutral';
        
        if (triangle.strong === defenderWeapon) return 'strong';
        if (triangle.weak === defenderWeapon) return 'weak';
        return 'neutral';
    }
    
    static executeCombat(attacker, defender) {
        const combatLog = [];
        
        // First attack
        const damage1 = this.calculateDamage(attacker, defender);
        const hitRate1 = this.calculateHitRate(attacker, defender);
        const critRate1 = this.calculateCritRate(attacker);
        
        const hit1 = Math.random() * 100 < hitRate1;
        const crit1 = hit1 && Math.random() * 100 < critRate1;
        const finalDamage1 = hit1 ? (crit1 ? damage1 * 2 : damage1) : 0;
        
        combatLog.push({
            attacker: attacker.name,
            damage: finalDamage1,
            hit: hit1,
            critical: crit1
        });
        
        defender.hp -= finalDamage1;
        
        // Counter attack if defender survives and can reach attacker
        if (defender.hp > 0) {
            const counterDamage = this.calculateDamage(defender, attacker);
            const counterHitRate = this.calculateHitRate(defender, attacker);
            const counterCritRate = this.calculateCritRate(defender);
            
            const counterHit = Math.random() * 100 < counterHitRate;
            const counterCrit = counterHit && Math.random() * 100 < counterCritRate;
            const finalCounterDamage = counterHit ? (counterCrit ? counterDamage * 2 : counterDamage) : 0;
            
            combatLog.push({
                attacker: defender.name,
                damage: finalCounterDamage,
                hit: counterHit,
                critical: counterCrit
            });
            
            attacker.hp -= finalCounterDamage;
        }
        
        // Double attack if attacker survives and can double
        if (attacker.hp > 0 && defender.hp > 0 && this.canDoubleAttack(attacker, defender)) {
            const damage2 = this.calculateDamage(attacker, defender);
            const hit2 = Math.random() * 100 < hitRate1;
            const crit2 = hit2 && Math.random() * 100 < critRate1;
            const finalDamage2 = hit2 ? (crit2 ? damage2 * 2 : damage2) : 0;
            
            combatLog.push({
                attacker: attacker.name,
                damage: finalDamage2,
                hit: hit2,
                critical: crit2,
                double: true
            });
            
            defender.hp -= finalDamage2;
        }
        
        // Ensure HP doesn't go below 0
        attacker.hp = Math.max(0, attacker.hp);
        defender.hp = Math.max(0, defender.hp);
        
        return {
            log: combatLog,
            attackerDefeated: attacker.hp <= 0,
            defenderDefeated: defender.hp <= 0
        };
    }
    
    static gainExperience(unit, defeated) {
        let expGain = CONFIG.expGainBase;
        if (defeated) {
            expGain += CONFIG.expGainKill;
        }
        
        unit.exp += expGain;
        
        // Level up check
        const levelUps = [];
        while (unit.exp >= 100) {
            unit.exp -= 100;
            unit.level++;
            
            // Stat gains on level up
            const statGains = this.generateStatGains(unit);
            Object.keys(statGains).forEach(stat => {
                unit[stat] += statGains[stat];
            });
            
            levelUps.push({
                level: unit.level,
                gains: statGains
            });
        }
        
        return levelUps;
    }
    
    static generateStatGains(unit) {
        // Random stat gains based on unit type
        const baseGains = {
            hp: Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0,
            attack: Math.random() > 0.4 ? Math.floor(Math.random() * 2) + 1 : 0,
            defense: Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : 0,
            speed: Math.random() > 0.4 ? Math.floor(Math.random() * 2) + 1 : 0
        };
        
        // Update maxHp if hp increased
        if (baseGains.hp > 0) {
            unit.maxHp += baseGains.hp;
        }
        
        return baseGains;
    }
}
