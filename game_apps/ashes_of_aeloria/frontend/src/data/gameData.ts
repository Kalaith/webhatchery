import type { GameData } from '../types/game';

export const GAME_DATA: GameData = {
  nodeTypes: {
    city: {
      name: "City",
      color: "#4CAF50",
      icon: "🏰",
      goldGeneration: 100,
      suppliesGeneration: 50,
      manaGeneration: 0,
      defensiveBonus: 1.0,
      description: "Generates gold and supplies, enables troop recruitment"
    },
    resource: {
      name: "Resource Node",
      color: "#FF9800",
      icon: "⛏️",
      goldGeneration: 50,
      suppliesGeneration: 100,
      manaGeneration: 25,
      defensiveBonus: 0.8,
      description: "Provides valuable resources for your empire"
    },
    fortress: {
      name: "Fortress",
      color: "#9E9E9E",
      icon: "🛡️",
      goldGeneration: 25,
      suppliesGeneration: 25,
      manaGeneration: 0,
      defensiveBonus: 2.0,
      description: "Defensive stronghold with high garrison value"
    },
    shrine: {
      name: "Shrine",
      color: "#9C27B0",
      icon: "✨",
      goldGeneration: 0,
      suppliesGeneration: 0,
      manaGeneration: 100,
      defensiveBonus: 1.2,
      description: "Ancient site that provides magical power"
    },
    stronghold: {
      name: "Enemy Stronghold",
      color: "#F44336",
      icon: "💀",
      goldGeneration: 150,
      suppliesGeneration: 75,
      manaGeneration: 50,
      defensiveBonus: 2.5,
      description: "Heavily fortified enemy position"
    }
  },
  commanderClasses: {
    knight: {
      name: "Knight",
      icon: "⚔️",
      description: "Heavily armored tank unit with high defense",
      baseHealth: 120,
      baseAttack: 80,
      baseDefense: 100,
      specialAbility: "Shield Wall - Increases army defense by 50%",
      cost: 200
    },
    mage: {
      name: "Mage",
      icon: "🔮",
      description: "Magical supporter with area-of-effect abilities",
      baseHealth: 80,
      baseAttack: 120,
      baseDefense: 60,
      specialAbility: "Fireball - Deals AOE damage to enemy army",
      cost: 250
    },
    ranger: {
      name: "Ranger",
      icon: "🏹",
      description: "Scout and skirmisher with mobility bonuses",
      baseHealth: 100,
      baseAttack: 100,
      baseDefense: 80,
      specialAbility: "Stealth - Can scout enemy nodes without detection",
      cost: 180
    },
    warlord: {
      name: "Warlord",
      icon: "👑",
      description: "Leader that provides army-wide bonuses",
      baseHealth: 110,
      baseAttack: 90,
      baseDefense: 90,
      specialAbility: "Rally - Increases entire army combat effectiveness",
      cost: 300
    }
  },
  races: {
    human: {
      name: "Human",
      icon: "👤",
      bonus: "Versatile - 10% bonus to all resources",
      color: "#2196F3"
    },
    elf: {
      name: "Elf",
      icon: "🧝",
      bonus: "Magical Affinity - 20% bonus to mana generation",
      color: "#4CAF50"
    },
    orc: {
      name: "Orc",
      icon: "👹",
      bonus: "Brutal Strength - 15% bonus to combat damage",
      color: "#FF5722"
    },
    undead: {
      name: "Undead",
      icon: "💀",
      bonus: "Undying - Commanders revive with 50% health after defeat",
      color: "#9C27B0"
    }
  },
  troopTypes: {
    soldiers: {
      name: "Soldiers",
      icon: "🛡️",
      attack: 10,
      defense: 10,
      cost: 20,
      strongAgainst: ["cavalry"],
      weakAgainst: ["archers"],
      description: "Balanced infantry units"
    },
    archers: {
      name: "Archers",
      icon: "🏹",
      attack: 12,
      defense: 6,
      cost: 25,
      strongAgainst: ["soldiers"],
      weakAgainst: ["cavalry"],
      description: "Ranged units effective against infantry"
    },
    cavalry: {
      name: "Cavalry",
      icon: "🐎",
      attack: 15,
      defense: 8,
      cost: 40,
      strongAgainst: ["archers"],
      weakAgainst: ["soldiers"],
      description: "Fast mounted units"
    },
    mages: {
      name: "Mages",
      icon: "🔥",
      attack: 20,
      defense: 4,
      cost: 60,
      strongAgainst: [],
      weakAgainst: [],
      description: "Magical support units that disrupt enemy formations"
    }
  }
} as const;

export const GAME_CONSTANTS = {
  VICTORY_CONTROL_PERCENTAGE: 0.7,
  CONNECTION_DISTANCE: 150,
  STAR_LEVEL_BONUS: 20,
  ENEMY_GARRISON_MULTIPLIER: 1.5,
  PLAYER_GARRISON_MULTIPLIER: 0.8,
  BASE_GARRISON_MULTIPLIER: 50,
  MAX_BATTLE_LOG_ENTRIES: 20,
  COMMANDER_CAPACITIES: {
    city: 6,
    fortress: 4, 
    stronghold: 5,
    resource: 2,
    shrine: 3
  }
} as const;
