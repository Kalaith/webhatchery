import type { 
  Commander, 
  GameNode, 
  CommanderClass, 
  Race, 
  NodeType, 
  Owner, 
  Resources,
  BattleResult,
  Army 
} from '../types/game';
import { GAME_DATA, GAME_CONSTANTS } from '../data/gameData';

// Pure functions for game logic - no state management

export const createCommander = (
  id: number, 
  className: CommanderClass, 
  race: Race,
  owner: Owner = 'player'
): Commander => {
  const commanderClass = GAME_DATA.commanderClasses[className];
  
  return {
    id,
    name: `${GAME_DATA.races[race].name} ${commanderClass.name}`,
    class: className,
    race: race,
    level: 1,
    experience: 0,
    health: commanderClass.baseHealth,
    maxHealth: commanderClass.baseHealth,
    attack: commanderClass.baseAttack,
    defense: commanderClass.baseDefense,
    assignedNode: null,
    owner,
    army: {
      soldiers: 20,
      archers: 10,
      cavalry: 5,
      mages: 2
    }
  };
};

export const canAffordCommander = (
  resources: Resources, 
  className: CommanderClass
): boolean => {
  return resources.gold >= GAME_DATA.commanderClasses[className].cost;
};

export const calculateIncome = (nodes: GameNode[]): Resources => {
  let income: Resources = { gold: 0, supplies: 0, mana: 0 };
  
  nodes
    .filter(node => node.owner === 'player')
    .forEach(node => {
      const nodeType = GAME_DATA.nodeTypes[node.type];
      income.gold += nodeType.goldGeneration;
      income.supplies += nodeType.suppliesGeneration;
      income.mana += nodeType.manaGeneration;
    });

  return income;
};

export const canAttackNode = (
  nodes: GameNode[], 
  attackerNodeId: number, 
  defenderNodeId: number
): boolean => {
  const attackerNode = nodes.find(n => n.id === attackerNodeId);
  const defenderNode = nodes.find(n => n.id === defenderNodeId);
  
  if (!attackerNode || !defenderNode) return false;
  if (attackerNode.owner !== 'player') return false;
  if (defenderNode.owner === 'player') return false;
  
  return attackerNode.connections.includes(defenderNodeId);
};

export const calculateEffectiveGarrison = (
  node: GameNode, 
  commanders: any[] = []
): { baseGarrison: number; commanderBonus: number; totalPower: number } => {
  const baseGarrison = node.garrison;
  const commanderBonus = calculateCommanderBonus(commanders);
  const totalPower = baseGarrison + commanderBonus.powerLevel;
  
  return {
    baseGarrison,
    commanderBonus: commanderBonus.powerLevel,
    totalPower
  };
};

export const calculateCommanderBonus = (commanders: any[]): { defenseBonus: number; attackBonus: number; powerLevel: number } => {
  let defenseBonus = 0;
  let attackBonus = 0;
  let powerLevel = 0;
  
  commanders.forEach(commander => {
    const commanderPower = commander.attack + commander.defense + (commander.level * 15);
    powerLevel += commanderPower;
    
    // Different commander classes provide different bonuses
    switch (commander.class) {
      case 'knight':
        defenseBonus += commander.defense * 1.5 + (commander.level * 10);
        attackBonus += commander.attack * 1.2 + (commander.level * 8);
        break;
      case 'mage':
        defenseBonus += commander.defense * 1.0 + (commander.level * 6);
        attackBonus += commander.attack * 1.8 + (commander.level * 12);
        break;
      case 'ranger':
        defenseBonus += commander.defense * 1.1 + (commander.level * 7);
        attackBonus += commander.attack * 1.4 + (commander.level * 10);
        break;
      case 'warlord':
        defenseBonus += commander.defense * 1.3 + (commander.level * 12);
        attackBonus += commander.attack * 1.3 + (commander.level * 12);
        break;
      default:
        defenseBonus += commander.defense + (commander.level * 5);
        attackBonus += commander.attack + (commander.level * 5);
    }
  });
  
  return { defenseBonus, attackBonus, powerLevel };
};

export const resolveBattle = (
  attackerNode: GameNode, 
  defenderNode: GameNode,
  attackerCommanders: any[] = [],
  defenderCommanders: any[] = []
): BattleResult => {
  // Calculate base strength
  let attackerStrength = attackerNode.garrison + (attackerNode.starLevel * 20);
  let defenderStrength = defenderNode.garrison + (defenderNode.starLevel * 15);
  
  // Add commander bonuses
  const attackerBonus = calculateCommanderBonus(attackerCommanders);
  const defenderBonus = calculateCommanderBonus(defenderCommanders);
  
  attackerStrength += attackerBonus.attackBonus;
  defenderStrength += defenderBonus.defenseBonus;
  
  // Defender gets defensive bonus
  defenderStrength *= 1.2;
  
  const victory = attackerStrength > defenderStrength;
  const strengthRatio = attackerStrength / Math.max(defenderStrength, 1);

  return {
    victory,
    attackerLosses: { soldiers: 5, archers: 2, cavalry: 1, mages: 0 },
    defenderLosses: { soldiers: 8, archers: 4, cavalry: 2, mages: 1 },
    nodeConquered: victory,
    experienceGained: victory ? Math.floor(50 * strengthRatio) : 25
  };
};

export const updateNodeAfterBattle = (
  node: GameNode, 
  result: BattleResult
): GameNode => {
  if (result.nodeConquered) {
    return {
      ...node,
      owner: 'player',
      garrison: Math.floor(node.garrison * 0.5)
    };
  }
  return node;
};

export const checkVictoryCondition = (nodes: GameNode[]): boolean => {
  const totalNodes = nodes.length;
  const playerNodes = nodes.filter(node => node.owner === 'player').length;
  const playerControlPercentage = playerNodes / totalNodes;
  
  return playerControlPercentage >= GAME_CONSTANTS.VICTORY_CONTROL_PERCENTAGE;
};

export const getNodeById = (nodes: GameNode[], id: number): GameNode | undefined => {
  return nodes.find(node => node.id === id);
};

export const getCommanderById = (commanders: Commander[], id: number): Commander | undefined => {
  return commanders.find(commander => commander.id === id);
};

export const generateInitialMap = (): GameNode[] => {
  const nodes: GameNode[] = [
    // Player starting city
    {
      id: 1,
      type: 'city',
      x: 200,
      y: 300,
      owner: 'player',
      starLevel: 1,
      garrison: 100,
      connections: [2, 3]
    },
    // Neutral resource nodes
    {
      id: 2,
      type: 'resource',
      x: 350,
      y: 200,
      owner: 'neutral',
      starLevel: 1,
      garrison: 50,
      connections: [1, 4, 5]
    },
    {
      id: 3,
      type: 'resource',
      x: 350,
      y: 400,
      owner: 'neutral',
      starLevel: 1,
      garrison: 50,
      connections: [1, 6]
    },
    // Neutral fortress
    {
      id: 4,
      type: 'fortress',
      x: 500,
      y: 150,
      owner: 'neutral',
      starLevel: 2,
      garrison: 150,
      connections: [2, 7]
    },
    // Central shrine
    {
      id: 5,
      type: 'shrine',
      x: 400,
      y: 300,
      owner: 'neutral',
      starLevel: 1,
      garrison: 75,
      connections: [2, 6, 7, 8]
    },
    {
      id: 6,
      type: 'resource',
      x: 350,
      y: 500,
      owner: 'neutral',
      starLevel: 1,
      garrison: 50,
      connections: [3, 5, 9]
    },
    // Enemy territory
    {
      id: 7,
      type: 'city',
      x: 600,
      y: 200,
      owner: 'enemy',
      starLevel: 2,
      garrison: 120,
      connections: [4, 5, 8]
    },
    {
      id: 8,
      type: 'fortress',
      x: 550,
      y: 350,
      owner: 'enemy',
      starLevel: 2,
      garrison: 180,
      connections: [5, 7, 9, 10]
    },
    {
      id: 9,
      type: 'resource',
      x: 500,
      y: 500,
      owner: 'enemy',
      starLevel: 1,
      garrison: 60,
      connections: [6, 8]
    },
    // Enemy stronghold
    {
      id: 10,
      type: 'stronghold',
      x: 700,
      y: 300,
      owner: 'enemy',
      starLevel: 3,
      garrison: 250,
      connections: [8]
    }
  ];
  
  return nodes;
};
