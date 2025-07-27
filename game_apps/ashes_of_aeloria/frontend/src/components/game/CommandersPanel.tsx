import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGameStore } from '../../stores/useGameStore';
import { GAME_DATA } from '../../data/gameData';
import type { Commander } from '../../types/game';

interface CommandersPanelProps {
  onRecruitClick: () => void;
}

export const CommandersPanel: React.FC<CommandersPanelProps> = ({ onRecruitClick }) => {
  const [activeTab, setActiveTab] = useState<'player' | 'enemy'>('player');
  const commanders = useGameStore(state => state.commanders);
  const selectedCommander = useGameStore(state => state.selectedCommander);
  const selectCommander = useGameStore(state => state.selectCommander);
  const nodes = useGameStore(state => state.nodes);
  const assignCommanderToNode = useGameStore(state => state.assignCommanderToNode);
  const unassignCommander = useGameStore(state => state.unassignCommander);
  const getNodeCommanderInfo = useGameStore(state => state.getNodeCommanderInfo);

  // Filter commanders based on active tab
  const filteredCommanders = commanders.filter(commander => {
    if (activeTab === 'player') {
      return commander.owner === 'player'; // Player commanders
    } else {
      return commander.owner === 'enemy'; // Enemy commanders
    }
  });

  const handleCommanderClick = (commander: Commander) => {
    selectCommander(selectedCommander === commander.id ? null : commander.id);
  };

  const getPlayerNodes = () => {
    return nodes.filter(node => node.owner === 'player');
  };

  const getAssignedNodeName = (nodeId: number | null) => {
    if (!nodeId) return null;
    const node = nodes.find(n => n.id === nodeId);
    return node ? `${GAME_DATA.nodeTypes[node.type].name} (${node.id})` : 'Unknown';
  };

  const handleAssignCommander = (commanderId: number, nodeId: number) => {
    assignCommanderToNode(commanderId, nodeId);
  };

  const handleUnassignCommander = (commanderId: number) => {
    unassignCommander(commanderId);
  };

  return (
    <Card className="p-3 lg:p-4">
      <h3 className="text-base lg:text-lg font-bold mb-3 lg:mb-4 text-gray-800">Commanders</h3>
      
      {/* Tab Navigation */}
      <div className="flex mb-3 border-b border-gray-200">
        <button
          className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
            activeTab === 'player'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('player')}
        >
          👤 Player ({commanders.filter(c => c.race !== 'orc').length})
        </button>
        <button
          className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
            activeTab === 'enemy'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('enemy')}
        >
          👹 Enemy ({commanders.filter(c => c.owner === 'enemy').length})
        </button>
      </div>
      <div className="flex flex-col gap-2 max-h-40 lg:max-h-48 overflow-y-auto mb-3 lg:mb-4">
        {filteredCommanders.length === 0 ? (
          <p className="text-gray-500 text-center py-3 lg:py-4 text-sm lg:text-base">
            {activeTab === 'player' ? 'No commanders recruited' : 'No enemy commanders visible'}
          </p>
        ) : (
          filteredCommanders.map((commander: Commander) => (
            <div 
              key={commander.id}
              className={`border rounded-md transition-all duration-200 ${
                selectedCommander === commander.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div 
                className={`flex items-center gap-2 lg:gap-3 p-2 lg:p-3 cursor-pointer ${
                  selectedCommander === commander.id 
                    ? 'text-blue-800' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleCommanderClick(commander)}
              >
                <div className="text-lg lg:text-xl w-5 lg:w-6 text-center flex-shrink-0">
                  {/* Get the icon from the commander's class */}
                  {commander.class === 'knight' && '⚔️'}
                  {commander.class === 'mage' && '🔮'}
                  {commander.class === 'ranger' && '🏹'}
                  {commander.class === 'warlord' && '👑'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs lg:text-sm truncate">{commander.name}</div>
                  <div className="text-xs mt-1 opacity-80 text-gray-600">
                    Level {commander.level} • HP: {commander.health}/{commander.maxHealth}
                  </div>
                  {commander.assignedNode && (
                    <div className="text-xs mt-1 text-green-600 font-medium">
                      📍 Stationed at {getAssignedNodeName(commander.assignedNode)}
                    </div>
                  )}
                  {!commander.assignedNode && (
                    <div className="text-xs mt-1 text-gray-500">
                      ⚪ Available for assignment
                    </div>
                  )}
                </div>
              </div>
              
              {/* Assignment controls - only show for selected player commander */}
              {selectedCommander === commander.id && activeTab === 'player' && (
                <div className="px-2 lg:px-3 pb-2 lg:pb-3 border-t border-gray-200 bg-gray-50">
                  <div className="mt-2">
                    {commander.assignedNode ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => handleUnassignCommander(commander.id)}
                      >
                        🔄 Recall from Duty
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-700 mb-1">Assign to Node:</div>
                        {getPlayerNodes().length === 0 ? (
                          <div className="text-xs text-gray-500 italic">No nodes available</div>
                        ) : (
                          getPlayerNodes().map(node => {
                            const commanderInfo = getNodeCommanderInfo(node.id);
                            const isAtCapacity = commanderInfo.current >= commanderInfo.max;
                            return (
                              <Button
                                key={node.id}
                                variant={isAtCapacity ? "secondary" : "primary"}
                                size="sm"
                                className="w-full text-xs justify-start"
                                onClick={() => handleAssignCommander(commander.id, node.id)}
                                disabled={isAtCapacity}
                              >
                                {GAME_DATA.nodeTypes[node.type].icon} {GAME_DATA.nodeTypes[node.type].name} ({node.id})
                                <span className="ml-auto text-xs opacity-70">
                                  {commanderInfo.current}/{commanderInfo.max}
                                </span>
                              </Button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Enemy commander info - read-only */}
              {selectedCommander === commander.id && activeTab === 'enemy' && (
                <div className="px-2 lg:px-3 pb-2 lg:pb-3 border-t border-gray-200 bg-red-50">
                  <div className="mt-2 text-xs text-red-700">
                    <div className="font-medium mb-1">🛡️ Enemy Intelligence:</div>
                    <div>Class: {GAME_DATA.commanderClasses[commander.class].name}</div>
                    <div>Attack: {commander.attack} • Defense: {commander.defense}</div>
                    {commander.assignedNode && (
                      <div className="mt-1 text-red-600 font-medium">
                        🏴 Defending: {getAssignedNodeName(commander.assignedNode)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {activeTab === 'player' && (
        <Button 
          variant="primary" 
          fullWidth 
          onClick={onRecruitClick}
          size="sm"
          className="w-full text-sm lg:text-base"
        >
          Recruit Commander
        </Button>
      )}
      {activeTab === 'enemy' && (
        <div className="text-xs text-gray-500 italic text-center py-2">
          Enemy forces are managed by AI
        </div>
      )}
    </Card>
  );
};
