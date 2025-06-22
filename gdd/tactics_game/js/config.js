// Game Configuration and Constants
export const CONFIG = {
    doubleAttackSpeedThreshold: 4,
    criticalHitRate: 5,
    weaponTriangleBonus: 15,
    movementRange: 3,
    expGainBase: 10,
    expGainKill: 30,
    cellSize: 64,
    gridWidth: 8,
    gridHeight: 8
};

export const WEAPON_TRIANGLE = {
    'Sword': { strong: 'Axe', weak: 'Lance' },
    'Axe': { strong: 'Lance', weak: 'Sword' },
    'Lance': { strong: 'Sword', weak: 'Axe' }
};

export const DEFAULT_UNITS = [
    {
        id: "player1", name: "Ren", type: "Swordfighter", faction: "player",
        x: 1, y: 6, hp: 28, maxHp: 28, attack: 12, defense: 6, speed: 11,
        weapon: "Sword", level: 3, exp: 45, color: "#4A90E2", moved: false, acted: false
    },
    {
        id: "player2", name: "Axel", type: "Axe Fighter", faction: "player", 
        x: 2, y: 7, hp: 32, maxHp: 32, attack: 14, defense: 8, speed: 7,
        weapon: "Axe", level: 2, exp: 23, color: "#E74C3C", moved: false, acted: false
    },
    {
        id: "player3", name: "Lance", type: "Lance Knight", faction: "player",
        x: 0, y: 7, hp: 30, maxHp: 30, attack: 13, defense: 9, speed: 8,
        weapon: "Lance", level: 3, exp: 67, color: "#2ECC71", moved: false, acted: false
    },
    {
        id: "enemy1", name: "Bandit", type: "Axe Fighter", faction: "enemy",
        x: 5, y: 1, hp: 26, maxHp: 26, attack: 11, defense: 5, speed: 6,
        weapon: "Axe", level: 2, exp: 0, color: "#8B0000", moved: false, acted: false
    },
    {
        id: "enemy2", name: "Mercenary", type: "Swordfighter", faction: "enemy",
        x: 6, y: 0, hp: 24, maxHp: 24, attack: 10, defense: 4, speed: 9,
        weapon: "Sword", level: 1, exp: 0, color: "#8B0000", moved: false, acted: false
    },
    {
        id: "enemy3", name: "Knight", type: "Lance Knight", faction: "enemy",
        x: 7, y: 1, hp: 28, maxHp: 28, attack: 12, defense: 7, speed: 5,
        weapon: "Lance", level: 2, exp: 0, color: "#8B0000", moved: false, acted: false
    }
];
