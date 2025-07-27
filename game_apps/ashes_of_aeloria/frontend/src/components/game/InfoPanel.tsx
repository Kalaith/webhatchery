import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useGameStore } from '../../stores/useGameStore';
import { GAME_DATA } from '../../data/gameData';

export const InfoPanel: React.FC = () => {
  const { 
    selectedNode, 
    selectedCommander, 
    nodes, 
    commanders,
    attackNode,
    canAttackNode 
  } = useGameStore(state => ({
    selectedNode: state.selectedNode,
    selectedCommander: state.selectedCommander,
    nodes: state.nodes,
    commanders: state.commanders,
    attackNode: state.attackNode,
    canAttackNode: state.canAttackNode
  }));

  const node = selectedNode !== null ? nodes.find(n => n.id === selectedNode) : null;
  const commander = selectedCommander !== null ? commanders.find(c => c.id === selectedCommander) : null;

  const handleAttack = (defenderNodeId: number) => {
    if (selectedNode !== null) {
      attackNode(selectedNode, defenderNodeId);
    }
  };

  const getAttackableNodes = () => {
    if (!node || node.owner !== 'player') return [];
    return node.connections
      .map(id => nodes.find(n => n.id === id))
      .filter(n => n && n.owner !== 'player') as typeof nodes;
  };

  return (
    <Card className="info-panel">
      <h3>Information</h3>
      <div id="selectionInfo">
        {node ? (
          <div className="node-info">
            <div className="node-header">
              <span className="node-icon">{GAME_DATA.nodeTypes[node.type].icon}</span>
              <span className="node-name">{GAME_DATA.nodeTypes[node.type].name}</span>
            </div>
            <div className="node-stats">
              <div className="stat-item">Owner: 
                <span className={`owner-indicator owner-${node.owner}`}>
                  {node.owner}
                </span>
              </div>
              <div className="stat-item">Star Level: {node.starLevel}</div>
              <div className="stat-item">Garrison: {node.garrison}</div>
              <div className="stat-item">Gold/Turn: {GAME_DATA.nodeTypes[node.type].goldGeneration}</div>
              <div className="stat-item">Supplies/Turn: {GAME_DATA.nodeTypes[node.type].suppliesGeneration}</div>
              <div className="stat-item">Mana/Turn: {GAME_DATA.nodeTypes[node.type].manaGeneration}</div>
            </div>
            <p className="text-secondary">{GAME_DATA.nodeTypes[node.type].description}</p>
            
            {node.owner === 'player' && getAttackableNodes().length > 0 && (
              <div className="action-buttons">
                <h4>Attack Options:</h4>
                {getAttackableNodes().map(targetNode => (
                  <Button
                    key={targetNode.id}
                    variant="attack"
                    size="sm"
                    onClick={() => handleAttack(targetNode.id)}
                  >
                    Attack {GAME_DATA.nodeTypes[targetNode.type].name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : commander ? (
          <div className="commander-info-details">
            <div className="commander-header">
              <span className="commander-icon">
                {GAME_DATA.commanderClasses[commander.class].icon}
              </span>
              <span className="commander-name">{commander.name}</span>
            </div>
            <div className="commander-stats">
              <div className="stat-item">Class: {GAME_DATA.commanderClasses[commander.class].name}</div>
              <div className="stat-item">Race: {GAME_DATA.races[commander.race].name}</div>
              <div className="stat-item">Level: {commander.level}</div>
              <div className="stat-item">Health: {commander.health}/{commander.maxHealth}</div>
              <div className="stat-item">Attack: {commander.attack}</div>
              <div className="stat-item">Defense: {commander.defense}</div>
            </div>
            <p className="text-secondary">{GAME_DATA.commanderClasses[commander.class].description}</p>
            <p className="text-secondary"><strong>Special:</strong> {GAME_DATA.commanderClasses[commander.class].specialAbility}</p>
            <div className="army-info">
              <h4>Army Composition:</h4>
              <div className="army-stats">
                <div className="stat-item">🛡️ Soldiers: {commander.army.soldiers}</div>
                <div className="stat-item">🏹 Archers: {commander.army.archers}</div>
                <div className="stat-item">🐎 Cavalry: {commander.army.cavalry}</div>
                <div className="stat-item">🔥 Mages: {commander.army.mages}</div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-secondary">Select a node or commander for details</p>
        )}
      </div>
    </Card>
  );
};
