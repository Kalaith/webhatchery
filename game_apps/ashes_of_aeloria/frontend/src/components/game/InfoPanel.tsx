import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGameStore } from '../../stores/useGameStore';
import { GAME_DATA } from '../../data/gameData';

export const InfoPanel: React.FC = () => {
  const selectedNode = useGameStore(state => state.selectedNode);
  const selectedCommander = useGameStore(state => state.selectedCommander);
  const nodes = useGameStore(state => state.nodes);
  const commanders = useGameStore(state => state.commanders);
  const attackNode = useGameStore(state => state.attackNode);
  const canAttackNode = useGameStore(state => state.canAttackNode);
  const assignCommanderToNode = useGameStore(state => state.assignCommanderToNode);
  const unassignCommander = useGameStore(state => state.unassignCommander);
  const getNodeCommanderInfo = useGameStore(state => state.getNodeCommanderInfo);
  const upgradeNode = useGameStore(state => state.upgradeNode);
  const getUpgradeCost = useGameStore(state => state.getUpgradeCost);
  const canUpgradeNode = useGameStore(state => state.canUpgradeNode);
  const resources = useGameStore(state => state.resources);

  const node = selectedNode !== null ? nodes.find(n => n.id === selectedNode) : null;
  const commander = selectedCommander !== null ? commanders.find(c => c.id === selectedCommander) : null;

  const handleAttack = (defenderNodeId: number) => {
    if (selectedNode !== null) {
      attackNode(defenderNodeId);
    }
  };

  const handleUpgrade = () => {
    if (selectedNode !== null) {
      upgradeNode(selectedNode);
    }
  };

  const getAttackableNodes = () => {
    if (!node || node.owner !== 'player') return [];
    return node.connections
      .map(id => nodes.find(n => n.id === id))
      .filter(n => n && n.owner !== 'player') as typeof nodes;
  };

  const getAssignedCommander = (nodeId: number) => {
    return commanders.find(c => c.assignedNode === nodeId);
  };

  const getAvailableCommanders = () => {
    return commanders.filter(c => c.assignedNode === null);
  };

  const handleAssignCommander = (commanderId: number, nodeId: number) => {
    assignCommanderToNode(commanderId, nodeId);
  };

  const handleUnassignCommander = (commanderId: number) => {
    unassignCommander(commanderId);
  };

  return (
    <Card className="p-3 lg:p-4">
      <h3 className="text-base lg:text-lg font-bold mb-3 lg:mb-4 text-gray-800">Information</h3>
      <div id="selectionInfo">
        {node ? (
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg">
              <span className="text-xl lg:text-2xl">{GAME_DATA.nodeTypes[node.type].icon}</span>
              <span className="text-base lg:text-lg font-semibold text-gray-800">{GAME_DATA.nodeTypes[node.type].name}</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Owner:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  node.owner === 'player' ? 'bg-green-100 text-green-800' :
                  node.owner === 'enemy' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {node.owner}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs lg:text-sm text-gray-600">Star Level:</span>
                <span className="text-xs lg:text-sm font-medium">{node.starLevel}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs lg:text-sm text-gray-600">Garrison:</span>
                <span className="text-xs lg:text-sm font-medium">{node.garrison}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs lg:text-sm text-gray-600">Gold/Turn:</span>
                <span className="text-xs lg:text-sm font-medium text-yellow-600">{GAME_DATA.nodeTypes[node.type].goldGeneration}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs lg:text-sm text-gray-600">Supplies/Turn:</span>
                <span className="text-xs lg:text-sm font-medium text-green-600">{GAME_DATA.nodeTypes[node.type].suppliesGeneration}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs lg:text-sm text-gray-600">Mana/Turn:</span>
                <span className="text-xs lg:text-sm font-medium text-purple-600">{GAME_DATA.nodeTypes[node.type].manaGeneration}</span>
              </div>
            </div>
            <p className="text-xs lg:text-sm text-gray-500 bg-gray-50 p-2 lg:p-3 rounded-lg">{GAME_DATA.nodeTypes[node.type].description}</p>
            
            {/* Commander Assignment Section - Only for player-owned nodes */}
            {node.owner === 'player' && (
              <div className="space-y-2 lg:space-y-3 pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm lg:text-md font-semibold text-gray-800">Commanders:</h4>
                  <span className="text-xs text-gray-500">
                    {(() => {
                      const info = getNodeCommanderInfo(node.id);
                      return `${info.current}/${info.max}`;
                    })()}
                  </span>
                </div>
                {(() => {
                  const commanderInfo = getNodeCommanderInfo(node.id);
                  const availableCommanders = getAvailableCommanders();
                  
                  return (
                    <div className="space-y-2">
                      {/* Show assigned commanders */}
                      {commanderInfo.commanders.length > 0 && (
                        <div className="space-y-1">
                          {commanderInfo.commanders.map(assignedCommander => (
                            <div key={assignedCommander.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                              <span className="text-lg">
                                {assignedCommander.class === 'knight' && '⚔️'}
                                {assignedCommander.class === 'mage' && '🔮'}
                                {assignedCommander.class === 'ranger' && '🏹'}
                                {assignedCommander.class === 'warlord' && '👑'}
                              </span>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-green-800">{assignedCommander.name}</div>
                                <div className="text-xs text-green-600">Level {assignedCommander.level} • Stationed here</div>
                              </div>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="text-xs px-2 py-1"
                                onClick={() => handleUnassignCommander(assignedCommander.id)}
                              >
                                🔄
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Show assignment options if not at capacity */}
                      {commanderInfo.current < commanderInfo.max && availableCommanders.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600 mb-2">
                            Assign commander to this {GAME_DATA.nodeTypes[node.type].name.toLowerCase()}:
                          </div>
                          {availableCommanders.slice(0, 3).map(availableCommander => (
                            <Button
                              key={availableCommander.id}
                              variant="primary"
                              size="sm"
                              className="w-full justify-start text-xs"
                              onClick={() => handleAssignCommander(availableCommander.id, node.id)}
                            >
                              <span className="mr-2">
                                {availableCommander.class === 'knight' && '⚔️'}
                                {availableCommander.class === 'mage' && '🔮'}
                                {availableCommander.class === 'ranger' && '🏹'}
                                {availableCommander.class === 'warlord' && '👑'}
                              </span>
                              {availableCommander.name}
                            </Button>
                          ))}
                          {availableCommanders.length > 3 && (
                            <div className="text-xs text-gray-500 italic">
                              +{availableCommanders.length - 3} more available
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Show capacity status */}
                      {commanderInfo.current >= commanderInfo.max && (
                        <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
                          {GAME_DATA.nodeTypes[node.type].name} is at maximum commander capacity
                        </div>
                      )}
                      
                      {commanderInfo.current < commanderInfo.max && availableCommanders.length === 0 && (
                        <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
                          No commanders available for assignment
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
            
            {node.owner === 'player' && node.type === 'city' && (
              <div className="space-y-2 lg:space-y-3 pt-2 border-t border-gray-200">
                <h4 className="text-sm lg:text-md font-semibold text-gray-800">Upgrade Options:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Current Level:</span>
                    <span className="text-sm font-medium">
                      {'⭐'.repeat(node.starLevel || 1)} ({node.starLevel || 1}/5)
                    </span>
                  </div>
                  
                  {canUpgradeNode(node.id) ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">Upgrade Cost:</span>
                        <span className="text-sm font-medium text-yellow-600">
                          {getUpgradeCost(node.id)} gold
                        </span>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => upgradeNode(node.id)}
                      >
                        <span className="mr-2">⬆️</span>
                        Upgrade to Level {(node.starLevel || 1) + 1}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
                      {(node.starLevel || 1) >= 5 
                        ? 'City is at maximum level'
                        : `Need ${getUpgradeCost(node.id)} gold to upgrade`
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {node.owner === 'player' && node.type !== 'city' && getAttackableNodes().length > 0 && (
              <div className="space-y-2 lg:space-y-3 pt-2 border-t border-gray-200">
                <h4 className="text-sm lg:text-md font-semibold text-gray-800">Attack Options:</h4>
                <div className="flex flex-col gap-2">
                  {getAttackableNodes().map(targetNode => (
                    <Button
                      key={targetNode.id}
                      variant="attack"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => handleAttack(targetNode.id)}
                    >
                      <span className="mr-2">{GAME_DATA.nodeTypes[targetNode.type].icon}</span>
                      Attack {GAME_DATA.nodeTypes[targetNode.type].name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : commander ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">
                {GAME_DATA.commanderClasses[commander.class].icon}
              </span>
              <span className="text-lg font-semibold text-gray-800">{commander.name}</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Class:</span>
                <span className="text-sm font-medium">{GAME_DATA.commanderClasses[commander.class].name}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Race:</span>
                <span className="text-sm font-medium">{GAME_DATA.races[commander.race].name}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Level:</span>
                <span className="text-sm font-medium">{commander.level}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Health:</span>
                <span className="text-sm font-medium text-red-600">{commander.health}/{commander.maxHealth}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Attack:</span>
                <span className="text-sm font-medium text-orange-600">{commander.attack}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Defense:</span>
                <span className="text-sm font-medium text-blue-600">{commander.defense}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">Assignment:</span>
                {commander.assignedNode ? (
                  <span className="text-sm font-medium text-green-600">
                    📍 City (ID: {commander.assignedNode})
                  </span>
                ) : (
                  <span className="text-sm font-medium text-gray-500">
                    ⚪ Available
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">{GAME_DATA.commanderClasses[commander.class].description}</p>
              <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                <span className="font-medium text-blue-800">Special:</span> {GAME_DATA.commanderClasses[commander.class].specialAbility}
              </p>
            </div>
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-800">Army Composition:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span>🛡️</span>
                  <span className="text-sm">Soldiers: {commander.army.soldiers}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span>🏹</span>
                  <span className="text-sm">Archers: {commander.army.archers}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span>🐎</span>
                  <span className="text-sm">Cavalry: {commander.army.cavalry}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span>🔥</span>
                  <span className="text-sm">Mages: {commander.army.mages}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Select a node or commander for details</p>
          </div>
        )}
      </div>
    </Card>
  );
};
