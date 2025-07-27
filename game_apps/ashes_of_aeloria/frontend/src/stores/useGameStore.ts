import { create } from 'zustand';
import type { GameState, Resources, CommanderClass, Race } from '../types/game';
import { createCommander, canAffordCommander, generateInitialMap } from '../utils/gameLogic';
import { GAME_DATA } from '../data/gameData';

// Initial game state with proper typing
const initialState: GameState = {
  turn: 1,
  phase: 'player',
  resources: {
    gold: 500,
    supplies: 100,
    mana: 50
  },
  commanders: [],
  nodes: generateInitialMap(),
  selectedNode: null,
  selectedCommander: null,
  gameOver: false,
  winner: null,
  battleLog: [
    {
      timestamp: Date.now(),
      type: 'info',
      message: 'Welcome to Ashes of Aeloria! Begin your conquest by recruiting commanders and expanding your territory.'
    }
  ]
};

interface GameStore extends GameState {
  // Actions
  selectCommander: (id: number | null) => void;
  selectNode: (id: number | null) => void;
  addCommander: (className: CommanderClass, race: Race) => boolean;
  updateResources: (resources: Partial<Resources>) => void;
  nextTurn: () => void;
  endTurn: () => void;
  resetGame: () => void;
  attackNode: (nodeId: number) => void;
  canAttackNode: (nodeId: number) => boolean;
  addBattleLogEntry: (type: 'info' | 'combat' | 'victory' | 'defeat' | 'recruitment', message: string) => void;
}

export const useGameStore = create<GameStore>()((set, get) => ({
  ...initialState,
  
  // Actions
  selectCommander: (id) => set({ selectedCommander: id }),
  selectNode: (id) => set({ selectedNode: id }),
  addCommander: (className, race) => {
    const state = get();
    if (canAffordCommander(state.resources, className)) {
      const newId = Math.max(0, ...state.commanders.map(c => c.id)) + 1;
      const commander = createCommander(newId, className, race);
      const cost = GAME_DATA.commanderClasses[className].cost;
      
      set((state) => ({
        commanders: [...state.commanders, commander],
        resources: { ...state.resources, gold: state.resources.gold - cost },
        battleLog: [...state.battleLog, {
          timestamp: Date.now(),
          type: 'recruitment',
          message: `Recruited ${commander.name} for ${cost} gold`
        }]
      }));
      
      return true;
    }
    return false;
  },
  updateResources: (newResources) => set((state) => ({ 
    resources: { ...state.resources, ...newResources } 
  })),
  nextTurn: () => set((state) => ({ 
    turn: state.turn + 1,
    phase: 'player' as const
  })),
  endTurn: () => set((state) => ({ 
    phase: 'enemy' as const
  })),
  attackNode: (nodeId) => {
    // Placeholder implementation - will be implemented later
    console.log('Attacking node:', nodeId);
  },
  canAttackNode: (nodeId) => {
    // Placeholder implementation - will be implemented later
    const state = get();
    return state.selectedCommander !== null && state.nodes.some(n => n.id === nodeId);
  },
  addBattleLogEntry: (type, message) => {
    set((state) => ({
      battleLog: [...state.battleLog, {
        timestamp: Date.now(),
        type,
        message
      }]
    }));
  },
  resetGame: () => set(() => ({ ...initialState }))
}));
