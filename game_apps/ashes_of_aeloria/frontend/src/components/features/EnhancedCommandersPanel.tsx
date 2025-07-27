/**
 * Enhanced Commanders Panel Component
 * Clean implementation without external dependencies
 */

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/EnhancedButton';
import { useGameActions } from '../../hooks/useGameActions';
import { useGameStore } from '../../stores/useGameStore';
import { GAME_DATA } from '../../data/gameData';
import type { Commander } from '../../types/game';

export const EnhancedCommandersPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'player' | 'enemy'>('player');
  
  const {
    selectCommanderAction,
    assignCommander,
    unassignCommanderAction,
    canPerformActions
  } = useGameActions();

  const {
    commanders,
    selectedCommander,
    nodes
  } = useGameStore();

  // Filter commanders based on active tab
  const filteredCommanders = commanders.filter(commander => {
    if (activeTab === 'player') {
      return commander.owner === 'player'; // Player commanders
    } else {
      return commander.owner === 'enemy'; // Enemy commanders
    }
  });

  const handleCommanderSelect = (commanderId: number) => {
    selectCommanderAction(selectedCommander === commanderId ? null : commanderId);
  };

  const handleAssign = (commanderId: number, nodeId: number) => {
    if (!canPerformActions) return;
    assignCommander(commanderId, nodeId);
  };

  const handleUnassign = (commanderId: number) => {
    if (!canPerformActions) return;
    unassignCommanderAction(commanderId);
  };

  const getPlayerNodes = () => {
    return nodes.filter(node => node.owner === 'player');
  };

  const getAssignedNode = (commander: Commander) => {
    if (!commander.assignedNode) return null;
    return nodes.find(node => node.id === commander.assignedNode);
  };

  const renderCommander = (commander: Commander) => {
    const isSelected = selectedCommander === commander.id;
    const assignedNode = getAssignedNode(commander);
    const commanderClass = GAME_DATA.commanderClasses[commander.class];
    const race = GAME_DATA.races[commander.race];
    const playerNodes = getPlayerNodes();

    return (
      <div 
        key={commander.id}
        className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
        onClick={() => handleCommanderSelect(commander.id)}
      >
        {/* Commander Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{commanderClass.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {commander.name}
            </div>
            <div className="text-xs text-gray-500">
              Level {commander.level} • {race.name} {commanderClass.name}
            </div>
          </div>
          <div className={`text-xs px-2 py-1 rounded ${
            assignedNode ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {assignedNode ? 'Assigned' : 'Available'}
          </div>
        </div>

        {/* Health Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Health</span>
            <span>{commander.health}/{commander.maxHealth}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(commander.health / commander.maxHealth) * 100}%` }}
            />
          </div>
        </div>

        {/* Assignment Info */}
        {assignedNode && (
          <div className="text-xs text-gray-600 mb-2">
            Assigned to {GAME_DATA.nodeTypes[assignedNode.type].name}
          </div>
        )}

        {/* Actions (only for player commanders and when it's player turn) */}
        {activeTab === 'player' && canPerformActions && (
          <div className="space-y-1">
            {assignedNode ? (
              <Button
                variant="secondary"
                size="xs"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnassign(commander.id);
                }}
              >
                Unassign
              </Button>
            ) : playerNodes.length > 0 ? (
              <div className="space-y-1">
                {playerNodes.slice(0, 2).map(node => (
                  <Button
                    key={node.id}
                    variant="primary"
                    size="xs"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssign(commander.id, node.id);
                    }}
                  >
                    → {GAME_DATA.nodeTypes[node.type].name}
                  </Button>
                ))}
                {playerNodes.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{playerNodes.length - 2} more nodes
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center">
                No available nodes
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Commanders</h3>
        <div className="text-sm text-gray-600">
          {filteredCommanders.length} {activeTab}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('player')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'player'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Your Commanders
        </button>
        <button
          onClick={() => setActiveTab('enemy')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'enemy'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Enemy Forces
        </button>
      </div>

      {/* Commanders List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredCommanders.length > 0 ? (
          filteredCommanders.map(renderCommander)
        ) : (
          <div className="text-center py-6 text-gray-500">
            <div className="text-3xl mb-2">
              {activeTab === 'player' ? '👑' : '⚔️'}
            </div>
            <div className="text-sm">
              {activeTab === 'player' 
                ? 'No commanders recruited yet. Recruit your first commander to begin your conquest!'
                : 'No enemy commanders visible. They may be planning their next move...'
              }
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
