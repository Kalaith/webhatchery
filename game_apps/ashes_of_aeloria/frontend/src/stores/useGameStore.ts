import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState, Resources, CommanderClass, Race } from '../types/game';
import { createCommander, canAffordCommander, generateInitialMap, calculateIncome } from '../utils/gameLogic';
import { GAME_DATA, GAME_CONSTANTS } from '../data/gameData';

// Initial game state with proper typing
const getInitialState = (): GameState => {
  // Create some initial enemy commanders
  const initialEnemyCommanders = [
    createCommander(1000, 'knight', 'orc'),
    createCommander(1001, 'mage', 'orc')
  ];
  
  // Assign them to enemy nodes
  initialEnemyCommanders[0].assignedNode = 7; // Enemy city
  initialEnemyCommanders[1].assignedNode = 8; // Enemy fortress
  
  return {
    turn: 1,
    phase: 'player',
    resources: {
      gold: 500,
      supplies: 100,
      mana: 50
    },
    commanders: initialEnemyCommanders,
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
};

interface GameStore extends GameState {
  // Actions
  selectCommander: (id: number | null) => void;
  selectNode: (id: number | null) => void;
  addCommander: (className: CommanderClass, race: Race) => boolean;
  assignCommanderToNode: (commanderId: number, nodeId: number) => boolean;
  unassignCommander: (commanderId: number) => void;
  getNodeCommanderInfo: (nodeId: number) => { current: number; max: number; commanders: any[] };
  upgradeNode: (nodeId: number) => boolean;
  getUpgradeCost: (nodeId: number) => number;
  canUpgradeNode: (nodeId: number) => boolean;
  updateResources: (resources: Partial<Resources>) => void;
  nextTurn: () => void;
  endTurn: () => void;
  processEnemyTurn: () => void;
  collectResources: () => void;
  resetGame: () => void;
  repairMapConnections: () => void;
  attackNode: (nodeId: number) => void;
  canAttackNode: (nodeId: number) => boolean;
  addBattleLogEntry: (type: 'info' | 'combat' | 'victory' | 'defeat' | 'recruitment', message: string) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state - will be overridden by persisted data if available
      ...getInitialState(),
      
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
      assignCommanderToNode: (commanderId, nodeId) => {
        const state = get();
        const commander = state.commanders.find(c => c.id === commanderId);
        const node = state.nodes.find(n => n.id === nodeId);
        
        if (!commander || !node) return false;
        if (node.owner !== 'player') return false;
        
        // Check commander capacity for this node type
        const maxCapacity = GAME_CONSTANTS.COMMANDER_CAPACITIES[node.type];
        const currentCommanders = state.commanders.filter(c => c.assignedNode === nodeId).length;
        
        if (currentCommanders >= maxCapacity) {
          // Add a message to battle log about capacity limit
          set((state) => ({
            battleLog: [...state.battleLog, {
              timestamp: Date.now(),
              type: 'info',
              message: `Cannot assign ${commander.name}: ${GAME_DATA.nodeTypes[node.type].name} is at capacity (${maxCapacity} commanders)`
            }]
          }));
          return false;
        }
        
        set((state) => ({
          commanders: state.commanders.map(c => 
            c.id === commanderId 
              ? { ...c, assignedNode: nodeId }
              : c
          ),
          battleLog: [...state.battleLog, {
            timestamp: Date.now(),
            type: 'info',
            message: `${commander.name} assigned to defend the ${GAME_DATA.nodeTypes[node.type].name}`
          }]
        }));
        
        return true;
      },
      unassignCommander: (commanderId) => {
        const state = get();
        const commander = state.commanders.find(c => c.id === commanderId);
        
        if (!commander || !commander.assignedNode) return;
        
        set((state) => ({
          commanders: state.commanders.map(c => 
            c.id === commanderId 
              ? { ...c, assignedNode: null }
              : c
          ),
          battleLog: [...state.battleLog, {
            timestamp: Date.now(),
            type: 'info',
            message: `${commander.name} recalled from duty`
          }]
        }));
      },
      getNodeCommanderInfo: (nodeId) => {
        const state = get();
        const node = state.nodes.find(n => n.id === nodeId);
        if (!node) return { current: 0, max: 0, commanders: [] };
        
        const assignedCommanders = state.commanders.filter(c => c.assignedNode === nodeId);
        const maxCapacity = GAME_CONSTANTS.COMMANDER_CAPACITIES[node.type];
        
        return {
          current: assignedCommanders.length,
          max: maxCapacity,
          commanders: assignedCommanders
        };
      },
      getUpgradeCost: (nodeId) => {
        const state = get();
        const node = state.nodes.find(n => n.id === nodeId);
        if (!node) return 0;
        
        // Base cost formula: 200 * starLevel * multiplier based on node type
        const baseMultiplier = {
          city: 1.5,
          fortress: 2.0,
          stronghold: 2.5,
          resource: 1.0,
          shrine: 1.8
        };
        
        return Math.floor(200 * node.starLevel * baseMultiplier[node.type]);
      },
      canUpgradeNode: (nodeId) => {
        const state = get();
        const node = state.nodes.find(n => n.id === nodeId);
        if (!node) return false;
        if (node.owner !== 'player') return false;
        if (node.starLevel >= 5) return false; // Max star level
        
        const upgradeCost = get().getUpgradeCost(nodeId);
        return state.resources.gold >= upgradeCost;
      },
      upgradeNode: (nodeId) => {
        const state = get();
        const node = state.nodes.find(n => n.id === nodeId);
        
        if (!get().canUpgradeNode(nodeId) || !node) return false;
        
        const upgradeCost = get().getUpgradeCost(nodeId);
        
        set((state) => ({
          nodes: state.nodes.map(n => 
            n.id === nodeId 
              ? { 
                  ...n, 
                  starLevel: n.starLevel + 1,
                  garrison: n.garrison + 25 // Increase garrison with upgrade
                }
              : n
          ),
          resources: { 
            ...state.resources, 
            gold: state.resources.gold - upgradeCost 
          },
          battleLog: [...state.battleLog, {
            timestamp: Date.now(),
            type: 'info',
            message: `${GAME_DATA.nodeTypes[node.type].name} upgraded to ${node.starLevel + 1} stars for ${upgradeCost} gold!`
          }]
        }));
        
        return true;
      },
      updateResources: (newResources) => set((state) => ({ 
        resources: { ...state.resources, ...newResources } 
      })),
      nextTurn: () => set((state) => ({ 
        turn: state.turn + 1,
        phase: 'player' as const
      })),
      endTurn: () => {
        set({ phase: 'enemy' as const });
        // Process enemy turn after a short delay for better UX
        setTimeout(() => {
          get().processEnemyTurn();
        }, 500);
      },
      processEnemyTurn: () => {
        const state = get();
        
        // 1. Enemy resource collection
        const enemyNodes = state.nodes.filter(n => n.owner === 'enemy');
        let enemyResources = { gold: 0, supplies: 0, mana: 0 };
        
        enemyNodes.forEach(node => {
          const nodeType = GAME_DATA.nodeTypes[node.type];
          enemyResources.gold += nodeType.goldGeneration;
          enemyResources.supplies += nodeType.suppliesGeneration;
          enemyResources.mana += nodeType.manaGeneration;
        });
        
        get().addBattleLogEntry('info', `Enemy collected ${enemyResources.gold} gold, ${enemyResources.supplies} supplies, ${enemyResources.mana} mana`);
        
        // 2. Enemy commander recruitment (if they have few commanders)
        const enemyCommanders = state.commanders.filter(c => c.race === 'orc'); // Enemies are orcs
        if (enemyCommanders.length < 3 && enemyResources.gold >= 150) {
          const commanderClasses: CommanderClass[] = ['knight', 'mage', 'ranger', 'warlord'];
          const randomClass = commanderClasses[Math.floor(Math.random() * commanderClasses.length)];
          
          const newId = Math.max(0, ...state.commanders.map(c => c.id)) + 1;
          const enemyCommander = createCommander(newId, randomClass, 'orc');
          
          set((state) => ({
            commanders: [...state.commanders, enemyCommander]
          }));
          
          get().addBattleLogEntry('recruitment', `Enemy recruited ${enemyCommander.name}`);
        }
        
        // 3. Enemy attacks - find potential targets
        const playerNodes = state.nodes.filter(n => n.owner === 'player');
        const attackableTargets = [];
        
        for (const enemyNode of enemyNodes) {
          for (const connectionId of enemyNode.connections) {
            const targetNode = state.nodes.find(n => n.id === connectionId);
            if (targetNode && (targetNode.owner === 'player' || targetNode.owner === 'neutral')) {
              attackableTargets.push({
                attacker: enemyNode,
                target: targetNode,
                priority: targetNode.owner === 'player' ? 2 : 1 // Prefer player nodes
              });
            }
          }
        }
        
        // Sort by priority and attack strength
        attackableTargets.sort((a, b) => {
          const priorityDiff = b.priority - a.priority;
          if (priorityDiff !== 0) return priorityDiff;
          return b.attacker.garrison - a.attacker.garrison;
        });
        
        // 4. Execute enemy attacks
        let attacksExecuted = 0;
        const maxAttacks = Math.min(2, attackableTargets.length); // Limit attacks per turn
        
        for (let i = 0; i < maxAttacks; i++) {
          const attack = attackableTargets[i];
          const attackerStrength = attack.attacker.garrison + (attack.attacker.starLevel * 20);
          const defenderStrength = attack.target.garrison + (attack.target.starLevel * 15);
          
          // Enemy has slight advantage in calculation
          const victory = (attackerStrength * 1.1) > defenderStrength;
          
          if (victory) {
            // Enemy wins - capture the node
            set((state) => ({
              nodes: state.nodes.map(n => 
                n.id === attack.target.id 
                  ? { 
                      ...n, 
                      owner: 'enemy',
                      garrison: Math.floor(attack.attacker.garrison * 0.7) // Reduced garrison after attack
                    }
                  : n.id === attack.attacker.id
                  ? {
                      ...n,
                      garrison: Math.floor(n.garrison * 0.8) // Attacker also loses some garrison
                    }
                  : n
              )
            }));
            
            get().addBattleLogEntry('defeat', `Enemy captured ${GAME_DATA.nodeTypes[attack.target.type].name} from ${attack.target.owner === 'player' ? 'player' : 'neutral'} forces!`);
          } else {
            // Enemy loses - reduce both garrisons
            set((state) => ({
              nodes: state.nodes.map(n => 
                n.id === attack.target.id 
                  ? { ...n, garrison: Math.floor(n.garrison * 0.9) }
                  : n.id === attack.attacker.id
                  ? { ...n, garrison: Math.floor(n.garrison * 0.7) }
                  : n
              )
            }));
            
            get().addBattleLogEntry('victory', `Player forces successfully defended ${GAME_DATA.nodeTypes[attack.target.type].name} from enemy attack!`);
          }
          
          attacksExecuted++;
        }
        
        if (attacksExecuted === 0) {
          get().addBattleLogEntry('info', 'Enemy consolidated their forces this turn');
        }
        
        // 5. Enemy upgrades (simple AI - upgrade if they have resources)
        const upgradeableEnemyNodes = enemyNodes.filter(n => n.starLevel < 5);
        if (upgradeableEnemyNodes.length > 0 && enemyResources.gold >= 400) {
          const nodeToUpgrade = upgradeableEnemyNodes[0]; // Upgrade first available
          set((state) => ({
            nodes: state.nodes.map(n => 
              n.id === nodeToUpgrade.id 
                ? { 
                    ...n, 
                    starLevel: n.starLevel + 1,
                    garrison: n.garrison + 30
                  }
                : n
            )
          }));
          
          get().addBattleLogEntry('info', `Enemy upgraded their ${GAME_DATA.nodeTypes[nodeToUpgrade.type].name} to ${nodeToUpgrade.starLevel + 1} stars`);
        }
        
        // 6. End enemy turn and start player turn
        setTimeout(() => {
          get().collectResources();
          get().nextTurn();
        }, 1000);
      },
      collectResources: () => {
        const state = get();
        const income = calculateIncome(state.nodes);
        
        set((state) => ({
          resources: {
            gold: state.resources.gold + income.gold,
            supplies: state.resources.supplies + income.supplies,
            mana: state.resources.mana + income.mana
          }
        }));
        
        get().addBattleLogEntry('info', `Turn ${state.turn + 1}: Collected ${income.gold} gold, ${income.supplies} supplies, ${income.mana} mana`);
      },
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
      resetGame: () => {
        const initialState = getInitialState();
        set(() => ({ 
          ...initialState,
          battleLog: [
            ...initialState.battleLog,
            {
              timestamp: Date.now(),
              type: 'info',
              message: 'Game reset! Welcome to Ashes of Aeloria! Begin your conquest by recruiting commanders and expanding your territory.'
            }
          ]
        }));
      },
      repairMapConnections: () => {
        const state = get();
        const originalMap = generateInitialMap();
        
        set((state) => ({
          nodes: state.nodes.map(node => {
            const originalNode = originalMap.find(n => n.id === node.id);
            if (originalNode) {
              return {
                ...node,
                connections: originalNode.connections // Restore original connections
              };
            }
            return node;
          }),
          battleLog: [...state.battleLog, {
            timestamp: Date.now(),
            type: 'info',
            message: 'Map connections repaired!'
          }]
        }));
      }
    }),
    {
      name: 'ashes-of-aeloria-game-state',
      version: 1, // Increment this when making breaking changes to the state structure
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        turn: state.turn,
        phase: state.phase,
        resources: state.resources,
        commanders: state.commanders,
        nodes: state.nodes,
        gameOver: state.gameOver,
        winner: state.winner,
        battleLog: state.battleLog.slice(-20) // Only keep last 20 battle log entries
      }),
      migrate: (persistedState: any, version: number) => {
        // Handle migration between versions if needed
        if (version === 0) {
          // Migrate from version 0 to 1 - regenerate map connections if corrupted
          if (persistedState.nodes && Array.isArray(persistedState.nodes)) {
            const validMap = generateInitialMap();
            // Preserve node ownership and garrison changes but restore connections
            persistedState.nodes = persistedState.nodes.map((node: any) => {
              const originalNode = validMap.find((n: any) => n.id === node.id);
              return originalNode ? {
                ...originalNode,
                owner: node.owner || originalNode.owner,
                garrison: node.garrison || originalNode.garrison,
                starLevel: node.starLevel || originalNode.starLevel
              } : node;
            });
          }
        }
        return persistedState;
      },
      onRehydrateStorage: () => {
        return (state, error) => {
          if (!error && state) {
            // Check if connections are broken and auto-repair
            const originalMap = generateInitialMap();
            let needsRepair = false;
            
            if (state.nodes) {
              for (const node of state.nodes) {
                const originalNode = originalMap.find(n => n.id === node.id);
                if (originalNode && JSON.stringify(node.connections) !== JSON.stringify(originalNode.connections)) {
                  needsRepair = true;
                  break;
                }
              }
              
              if (needsRepair) {
                // Auto-repair connections
                state.nodes = state.nodes.map(node => {
                  const originalNode = originalMap.find(n => n.id === node.id);
                  return originalNode ? {
                    ...node,
                    connections: originalNode.connections
                  } : node;
                });
                
                // Add a log entry about the repair
                state.battleLog = [
                  ...(state.battleLog || []),
                  {
                    timestamp: Date.now(),
                    type: 'info' as const,
                    message: 'Map connections automatically repaired after loading saved game.'
                  }
                ];
                
                console.log('🔧 Auto-repaired map connections after loading from localStorage');
              } else {
                console.log('✅ Map connections are valid');
              }
            }
          }
        };
      },
    }
  )
);
