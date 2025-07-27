import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  GameState, 
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

interface GameStore extends GameState {
  // Actions
  initializeGame: () => void;
  endTurn: () => void;
  selectNode: (nodeId: number | null) => void;
  selectCommander: (commanderId: number | null) => void;
  addCommander: (className: CommanderClass, race: Race) => boolean;
  attackNode: (attackerNodeId: number, defenderNodeId: number) => BattleResult | null;
  addBattleLog: (message: string, type?: 'info' | 'victory' | 'defeat') => void;
  resetGame: () => void;
  
  // Battle log
  battleLog: Array<{ message: string; type: 'info' | 'victory' | 'defeat'; timestamp: number }>;
  
  // Computed values
  getNodeById: (id: number) => GameNode | undefined;
  getCommanderById: (id: number) => Commander | undefined;
  calculateIncome: () => Resources;
  checkVictoryCondition: () => boolean;
  canAttackNode: (attackerNodeId: number, defenderNodeId: number) => boolean;
}

const initialNodes: GameNode[] = [
  { id: 0, type: 'city', x: 150, y: 150, owner: 'player', starLevel: 2, garrison: 0, connections: [] },
  { id: 1, type: 'resource', x: 300, y: 100, owner: 'neutral', starLevel: 1, garrison: 0, connections: [] },
  { id: 2, type: 'fortress', x: 200, y: 250, owner: 'neutral', starLevel: 3, garrison: 0, connections: [] },
  { id: 3, type: 'shrine', x: 100, y: 300, owner: 'neutral', starLevel: 2, garrison: 0, connections: [] },
  { id: 4, type: 'city', x: 450, y: 200, owner: 'neutral', starLevel: 2, garrison: 0, connections: [] },
  { id: 5, type: 'resource', x: 350, y: 300, owner: 'neutral', starLevel: 1, garrison: 0, connections: [] },
  { id: 6, type: 'stronghold', x: 600, y: 150, owner: 'enemy', starLevel: 4, garrison: 0, connections: [] },
  { id: 7, type: 'fortress', x: 550, y: 300, owner: 'enemy', starLevel: 3, garrison: 0, connections: [] },
  { id: 8, type: 'city', x: 650, y: 400, owner: 'enemy', starLevel: 2, garrison: 0, connections: [] },
  { id: 9, type: 'resource', x: 400, y: 450, owner: 'neutral', starLevel: 1, garrison: 0, connections: [] },
  { id: 10, type: 'shrine', x: 500, y: 500, owner: 'neutral', starLevel: 2, garrison: 0, connections: [] },
  { id: 11, type: 'fortress', x: 250, y: 400, owner: 'neutral', starLevel: 3, garrison: 0, connections: [] }
];

const calculateGarrison = (type: NodeType, starLevel: number, owner: Owner): number => {
  const baseGarrison = GAME_DATA.nodeTypes[type].defensiveBonus * GAME_CONSTANTS.BASE_GARRISON_MULTIPLIER;
  const starBonus = starLevel * GAME_CONSTANTS.STAR_LEVEL_BONUS;
  const ownerMultiplier = owner === 'enemy' 
    ? GAME_CONSTANTS.ENEMY_GARRISON_MULTIPLIER 
    : owner === 'player' 
    ? GAME_CONSTANTS.PLAYER_GARRISON_MULTIPLIER 
    : 1.0;
  return Math.floor((baseGarrison + starBonus) * ownerMultiplier);
};

const getDistance = (node1: GameNode, node2: GameNode): number => {
  return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
};

const createNodeConnections = (nodes: GameNode[]): GameNode[] => {
  return nodes.map(node => ({
    ...node,
    connections: nodes
      .filter(otherNode => 
        otherNode.id !== node.id && 
        getDistance(node, otherNode) <= GAME_CONSTANTS.CONNECTION_DISTANCE
      )
      .map(otherNode => otherNode.id)
  }));
};

const initializeNodes = (): GameNode[] => {
  const nodesWithGarrison = initialNodes.map(node => ({
    ...node,
    garrison: calculateGarrison(node.type, node.starLevel, node.owner)
  }));
  
  return createNodeConnections(nodesWithGarrison);
};

const initialState: GameState = {
  turn: 1,
  phase: 'player',
  resources: {
    gold: 500,
    supplies: 300,
    mana: 100
  },
  commanders: [],
  nodes: initializeNodes(),
  selectedNode: null,
  selectedCommander: null,
  gameOver: false,
  winner: null
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      battleLog: [
        { 
          message: '🎮 Welcome to Ashes of Aeloria! Select nodes to view details or recruit commanders to begin.', 
          type: 'info', 
          timestamp: Date.now() 
        }
      ],

      initializeGame: () => set({
        ...initialState,
        nodes: initializeNodes(),
        battleLog: [
          { 
            message: '🎮 Welcome to Ashes of Aeloria! Select nodes to view details or recruit commanders to begin.', 
            type: 'info', 
            timestamp: Date.now() 
          }
        ]
      }),

      resetGame: () => set({
        ...initialState,
        nodes: initializeNodes(),
        battleLog: [
          { 
            message: '🎮 Game reset! Welcome back to Ashes of Aeloria!', 
            type: 'info', 
            timestamp: Date.now() 
          }
        ]
      }),

      selectNode: (nodeId) => set({ selectedNode: nodeId }),
      
      selectCommander: (commanderId) => set({ selectedCommander: commanderId }),

      addCommander: (className, race) => {
        const state = get();
        const commanderClass = GAME_DATA.commanderClasses[className];
        
        if (state.resources.gold < commanderClass.cost) {
          return false;
        }

        const commander: Commander = {
          id: state.commanders.length,
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
          army: {
            soldiers: 20,
            archers: 10,
            cavalry: 5,
            mages: 2
          }
        };

        set(state => ({
          commanders: [...state.commanders, commander],
          resources: {
            ...state.resources,
            gold: state.resources.gold - commanderClass.cost
          }
        }));

        get().addBattleLog(`✨ Recruited ${commander.name} for ${commanderClass.cost} gold!`, 'info');
        return true;
      },

      attackNode: (attackerNodeId, defenderNodeId) => {
        const state = get();
        const attackerNode = state.nodes.find(n => n.id === attackerNodeId);
        const defenderNode = state.nodes.find(n => n.id === defenderNodeId);
        
        if (!attackerNode || !defenderNode || attackerNode.owner !== 'player') {
          return null;
        }

        // Simple battle resolution
        const attackerStrength = attackerNode.garrison + 50; // Base attack strength
        const defenderStrength = defenderNode.garrison;
        const victory = attackerStrength > defenderStrength;

        const result: BattleResult = {
          victory,
          attackerLosses: { soldiers: 5, archers: 2, cavalry: 1, mages: 0 },
          defenderLosses: { soldiers: 8, archers: 4, cavalry: 2, mages: 1 },
          nodeConquered: victory,
          experienceGained: victory ? 50 : 25
        };

        if (victory) {
          set(state => ({
            nodes: state.nodes.map(node => 
              node.id === defenderNodeId 
                ? { ...node, owner: 'player', garrison: Math.floor(node.garrison * 0.5) }
                : node
            )
          }));
          get().addBattleLog(`⚔️ Victory! Conquered ${GAME_DATA.nodeTypes[defenderNode.type].name}!`, 'victory');
        } else {
          get().addBattleLog(`💀 Defeat! Failed to conquer ${GAME_DATA.nodeTypes[defenderNode.type].name}.`, 'defeat');
        }

        return result;
      },

      addBattleLog: (message, type = 'info') => {
        set(state => ({
          battleLog: [
            { message, type, timestamp: Date.now() },
            ...state.battleLog.slice(0, GAME_CONSTANTS.MAX_BATTLE_LOG_ENTRIES - 1)
          ]
        }));
      },

      endTurn: () => {
        const state = get();
        const income = get().calculateIncome();
        
        set(prevState => ({
          turn: prevState.turn + 1,
          phase: 'enemy',
          resources: {
            gold: prevState.resources.gold + income.gold,
            supplies: prevState.resources.supplies + income.supplies,
            mana: prevState.resources.mana + income.mana
          }
        }));

        get().addBattleLog(`💰 Turn ${state.turn + 1}: Gained ${income.gold} gold, ${income.supplies} supplies, ${income.mana} mana`, 'info');

        // Simple AI turn simulation
        setTimeout(() => {
          set({ phase: 'player' });
          get().addBattleLog('🤖 Enemy turn completed', 'info');
        }, 1000);
      },

      getNodeById: (id) => get().nodes.find(node => node.id === id),
      
      getCommanderById: (id) => get().commanders.find(commander => commander.id === id),

      calculateIncome: () => {
        const state = get();
        let income: Resources = { gold: 0, supplies: 0, mana: 0 };
        
        state.nodes
          .filter(node => node.owner === 'player')
          .forEach(node => {
            const nodeType = GAME_DATA.nodeTypes[node.type];
            income.gold += nodeType.goldGeneration;
            income.supplies += nodeType.suppliesGeneration;
            income.mana += nodeType.manaGeneration;
          });

        return income;
      },

      checkVictoryCondition: () => {
        const state = get();
        if (state.gameOver) return false; // Don't check if game is already over
        
        const totalNodes = state.nodes.length;
        const playerNodes = state.nodes.filter(node => node.owner === 'player').length;
        const playerControlPercentage = playerNodes / totalNodes;
        
        if (playerControlPercentage >= GAME_CONSTANTS.VICTORY_CONTROL_PERCENTAGE) {
          set({ gameOver: true, winner: 'player' });
          // Don't call addBattleLog here to avoid triggering another update
          return true;
        }
        
        return false;
      },

      canAttackNode: (attackerNodeId, defenderNodeId) => {
        const state = get();
        const attackerNode = state.nodes.find(n => n.id === attackerNodeId);
        const defenderNode = state.nodes.find(n => n.id === defenderNodeId);
        
        if (!attackerNode || !defenderNode) return false;
        if (attackerNode.owner !== 'player') return false;
        if (defenderNode.owner === 'player') return false;
        
        return attackerNode.connections.includes(defenderNodeId);
      }
    }),
    {
      name: 'ashes-of-aeloria-game-state',
      partialize: (state) => ({
        turn: state.turn,
        resources: state.resources,
        commanders: state.commanders,
        nodes: state.nodes,
        gameOver: state.gameOver,
        winner: state.winner
      })
    }
  )
);
