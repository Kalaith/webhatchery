/**
 * Node Information Display Component
 * Shows detailed information about selected nodes
 */

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/EnhancedButton';
import { GAME_DATA } from '../../data/gameData';
import { calculateEffectiveGarrison } from '../../utils/gameLogic';
import type { GameNode, Resources } from '../../types/game';

interface NodeInfoProps {
  node: GameNode;
  canUpgrade?: boolean;
  upgradeCost?: number;
  onUpgrade?: () => void;
  onAttack?: (nodeId: number) => void;
  attackableNodes?: GameNode[];
  commanderInfo?: {
    current: number;
    max: number;
    commanders: any[];
  };
  className?: string;
}

interface NodeStatProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

const NodeStat: React.FC<NodeStatProps> = ({ label, value, icon, color = 'text-gray-900' }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-sm text-gray-600 flex items-center gap-1">
      {icon && <span>{icon}</span>}
      {label}:
    </span>
    <span className={`text-sm font-medium ${color}`}>
      {value}
    </span>
  </div>
);

const OwnerBadge: React.FC<{ owner: string }> = ({ owner }) => {
  const colorClasses = {
    player: 'bg-green-100 text-green-800',
    enemy: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800'
  }[owner] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses}`}>
      {owner.charAt(0).toUpperCase() + owner.slice(1)}
    </span>
  );
};

export const NodeInfo: React.FC<NodeInfoProps> = ({
  node,
  canUpgrade = false,
  upgradeCost,
  onUpgrade,
  onAttack,
  attackableNodes = [],
  commanderInfo,
  className = ''
}) => {
  const nodeTypeData = GAME_DATA.nodeTypes[node.type];
  
  // Calculate effective garrison with commander bonuses
  const effectiveGarrison = commanderInfo ? 
    calculateEffectiveGarrison(node, commanderInfo.commanders) : 
    { baseGarrison: node.garrison, commanderBonus: 0, totalPower: node.garrison };

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-gray-800">Node Information</h3>
      
      {/* Node Header */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
        <span className="text-2xl">{nodeTypeData.icon}</span>
        <div className="flex-1">
          <div className="font-semibold text-gray-800">{nodeTypeData.name}</div>
          <div className="text-xs text-gray-600">{nodeTypeData.description}</div>
        </div>
        <OwnerBadge owner={node.owner} />
      </div>

      {/* Node Stats */}
      <div className="space-y-1 mb-4">
        <NodeStat label="Star Level" value={node.starLevel} icon="⭐" />
        
        {/* Enhanced Garrison Display */}
        {effectiveGarrison.commanderBonus > 0 ? (
          <div className="flex justify-between items-center py-1">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <span>🛡️</span>
              Garrison:
            </span>
            <div className="text-sm">
              <span className="font-medium text-gray-900">
                {effectiveGarrison.totalPower}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({effectiveGarrison.baseGarrison} + {effectiveGarrison.commanderBonus})
              </span>
            </div>
          </div>
        ) : (
          <NodeStat label="Garrison" value={node.garrison} icon="🛡️" />
        )}
        
        <NodeStat 
          label="Gold/Turn" 
          value={nodeTypeData.goldGeneration} 
          icon="💰" 
          color="text-yellow-600" 
        />
        <NodeStat 
          label="Supplies/Turn" 
          value={nodeTypeData.suppliesGeneration} 
          icon="📦" 
          color="text-green-600" 
        />
        <NodeStat 
          label="Mana/Turn" 
          value={nodeTypeData.manaGeneration} 
          icon="✨" 
          color="text-purple-600" 
        />
      </div>

      {/* Commander Information */}
      {commanderInfo && (
        <div className="mb-4">
          <NodeStat 
            label="Commanders" 
            value={`${commanderInfo.current}/${commanderInfo.max}`} 
            icon="👑" 
          />
          {effectiveGarrison.commanderBonus > 0 && (
            <div className="text-xs text-blue-600 mt-1 ml-5">
              Power Bonus: +{effectiveGarrison.commanderBonus}
            </div>
          )}
        </div>
      )}

      {/* Player Actions */}
      {node.owner === 'player' && (
        <div className="space-y-2">
          {/* Upgrade Button */}
          {canUpgrade && onUpgrade && (
            <div>
              <Button
                variant="success"
                fullWidth
                onClick={onUpgrade}
                leftIcon="⬆️"
              >
                Upgrade Node
              </Button>
              {upgradeCost && (
                <div className="text-xs text-gray-600 mt-1 text-center">
                  Cost: {upgradeCost}💰
                </div>
              )}
            </div>
          )}

          {/* Attack Options */}
          {attackableNodes.length > 0 && onAttack && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Attack Options:
              </div>
              <div className="space-y-1">
                {attackableNodes.map(target => (
                  <Button
                    key={target.id}
                    variant="danger"
                    size="sm"
                    fullWidth
                    onClick={() => onAttack(target.id)}
                    leftIcon="⚔️"
                  >
                    Attack {GAME_DATA.nodeTypes[target.type].name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enemy/Neutral Node Info */}
      {node.owner !== 'player' && (
        <div className="text-center text-sm text-gray-600 italic">
          {node.owner === 'enemy' ? 'Enemy controlled territory' : 'Neutral territory'}
        </div>
      )}
    </Card>
  );
};
