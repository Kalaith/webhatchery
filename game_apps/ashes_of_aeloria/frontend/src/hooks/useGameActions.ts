/**
 * Custom hook for game actions and business logic
 * Separates business logic from UI components following clean code principles
 */

import { useCallback } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { GAME_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import type { CommanderClass, Race } from '../types/game';

export const useGameActions = () => {
  // Store selectors
  const {
    selectedNode,
    selectedCommander,
    nodes,
    commanders,
    resources,
    phase,
    // Actions
    addCommander,
    assignCommanderToNode,
    unassignCommander,
    attackNode,
    upgradeNode,
    endTurn,
    resetGame,
    selectNode,
    selectCommander,
    canAttackNode,
    canUpgradeNode,
    getUpgradeCost,
    getNodeCommanderInfo
  } = useGameStore();

  // Commander Management
  const recruitCommander = useCallback((className: CommanderClass, race: Race): { success: boolean; message: string } => {
    const success = addCommander(className, race);
    return {
      success,
      message: success ? SUCCESS_MESSAGES.COMMANDER_RECRUITED : ERROR_MESSAGES.INSUFFICIENT_RESOURCES
    };
  }, [addCommander]);

  const assignCommander = useCallback((commanderId: number, nodeId: number): { success: boolean; message: string } => {
    const success = assignCommanderToNode(commanderId, nodeId);
    return {
      success,
      message: success ? SUCCESS_MESSAGES.COMMANDER_ASSIGNED : ERROR_MESSAGES.NODE_AT_CAPACITY
    };
  }, [assignCommanderToNode]);

  const unassignCommanderAction = useCallback((commanderId: number) => {
    unassignCommander(commanderId);
  }, [unassignCommander]);

  // Node Management
  const selectNodeAction = useCallback((nodeId: number | null) => {
    selectNode(nodeId);
  }, [selectNode]);

  const selectCommanderAction = useCallback((commanderId: number | null) => {
    selectCommander(commanderId);
  }, [selectCommander]);

  // Combat Actions
  const initiateAttack = useCallback((defenderNodeId: number): { success: boolean; message: string } => {
    if (selectedNode === null) {
      return { success: false, message: ERROR_MESSAGES.NO_NODE_SELECTED };
    }
    
    if (!canAttackNode(defenderNodeId)) {
      return { success: false, message: ERROR_MESSAGES.INVALID_ATTACK_TARGET };
    }

    // Note: attackNode currently returns void, will be enhanced in Phase 2
    attackNode(defenderNodeId);
    return {
      success: true, // Placeholder - will be based on actual battle result in Phase 2
      message: 'Attack initiated!' // Placeholder message
    };
  }, [selectedNode, canAttackNode, attackNode]);

  // Node Upgrades
  const upgradeSelectedNode = useCallback((): { success: boolean; message: string; cost?: any } => {
    if (selectedNode === null) {
      return { success: false, message: ERROR_MESSAGES.NO_NODE_SELECTED };
    }

    const cost = getUpgradeCost(selectedNode);
    const canUpgrade = canUpgradeNode(selectedNode);
    
    if (!canUpgrade) {
      return { 
        success: false, 
        message: ERROR_MESSAGES.INSUFFICIENT_RESOURCES,
        cost 
      };
    }

    const success = upgradeNode(selectedNode);
    return {
      success,
      message: success ? SUCCESS_MESSAGES.NODE_UPGRADED : ERROR_MESSAGES.INSUFFICIENT_RESOURCES,
      cost
    };
  }, [selectedNode, getUpgradeCost, canUpgradeNode, upgradeNode]);

  // Turn Management
  const completeTurn = useCallback(() => {
    endTurn();
    return { success: true, message: SUCCESS_MESSAGES.TURN_COMPLETED };
  }, [endTurn]);

  const restartGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Game State Queries
  const getSelectedNodeInfo = useCallback(() => {
    if (selectedNode === null) return null;
    
    const node = nodes.find(n => n.id === selectedNode);
    if (!node) return null;

    const commanderInfo = getNodeCommanderInfo(selectedNode);
    const upgradeInfo = {
      canUpgrade: canUpgradeNode(selectedNode),
      cost: getUpgradeCost(selectedNode)
    };

    return {
      node,
      commanderInfo,
      upgradeInfo,
      attackableNodes: getAttackableNodes(node)
    };
  }, [selectedNode, nodes, getNodeCommanderInfo, canUpgradeNode, getUpgradeCost]);

  const getSelectedCommanderInfo = useCallback(() => {
    if (selectedCommander === null) return null;
    return commanders.find(c => c.id === selectedCommander) || null;
  }, [selectedCommander, commanders]);

  const getAvailableCommanders = useCallback(() => {
    return commanders.filter(c => c.assignedNode === null);
  }, [commanders]);

  const getAttackableNodes = useCallback((node: any) => {
    if (!node || node.owner !== 'player') return [];
    return node.connections
      .map((id: number) => nodes.find(n => n.id === id))
      .filter((n: any) => n && n.owner !== 'player');
  }, [nodes]);

  // Game State Validation
  const canPerformPlayerActions = useCallback(() => {
    return phase === 'player';
  }, [phase]);

  return {
    // State
    selectedNode,
    selectedCommander,
    resources,
    phase,
    canPerformActions: canPerformPlayerActions(),
    
    // Actions
    recruitCommander,
    assignCommander,
    unassignCommanderAction,
    selectNodeAction,
    selectCommanderAction,
    initiateAttack,
    upgradeSelectedNode,
    completeTurn,
    restartGame,
    
    // Queries
    getSelectedNodeInfo,
    getSelectedCommanderInfo,
    getAvailableCommanders,
    
    // Utils
    canAttackNode,
    canUpgradeNode
  };
};
