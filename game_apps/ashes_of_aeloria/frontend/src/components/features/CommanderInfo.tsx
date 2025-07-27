/**
 * Commander Information Display Component
 * Shows detailed information about selected commanders
 */

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/EnhancedButton';
import { GAME_DATA } from '../../data/gameData';
import type { Commander } from '../../types/game';

interface CommanderInfoProps {
  commander: Commander;
  canPerformActions?: boolean;
  onAssign?: (nodeId: number) => void;
  onUnassign?: () => void;
  availableNodes?: Array<{ id: number; type: string; name?: string }>;
  className?: string;
}

interface StatItemProps {
  label: string;
  value: number;
  icon?: string;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, color = 'text-gray-900' }) => (
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

const ArmyComposition: React.FC<{ army: Commander['army'] }> = ({ army }) => (
  <div className="space-y-1">
    <div className="text-sm font-medium text-gray-700 mb-2">Army Composition:</div>
    <StatItem label="Soldiers" value={army.soldiers} icon="⚔️" />
    <StatItem label="Archers" value={army.archers} icon="🏹" />
    <StatItem label="Cavalry" value={army.cavalry} icon="🐎" />
    <StatItem label="Mages" value={army.mages} icon="🔮" />
    <div className="text-xs text-gray-500 mt-2">
      Total: {army.soldiers + army.archers + army.cavalry + army.mages} units
    </div>
  </div>
);

export const CommanderInfo: React.FC<CommanderInfoProps> = ({
  commander,
  canPerformActions = true,
  onAssign,
  onUnassign,
  availableNodes = [],
  className = ''
}) => {
  const commanderClass = GAME_DATA.commanderClasses[commander.class];
  const race = GAME_DATA.races[commander.race];

  const isAssigned = commander.assignedNode !== null;
  const healthPercentage = (commander.health / commander.maxHealth) * 100;

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-gray-800">Commander Information</h3>
      
      {/* Commander Header */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
        <div className="text-2xl">
          {commanderClass.icon}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-800">{commander.name}</div>
          <div className="text-xs text-gray-600">
            Level {commander.level} {race.name} {commanderClass.name}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xs px-2 py-1 rounded ${
            isAssigned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {isAssigned ? 'Assigned' : 'Available'}
          </div>
        </div>
      </div>

      {/* Health Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Health</span>
          <span className="font-medium">{commander.health}/{commander.maxHealth}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              healthPercentage > 60 ? 'bg-green-500' :
              healthPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-1 mb-4">
        <StatItem label="Attack" value={commander.attack} icon="⚔️" color="text-red-600" />
        <StatItem label="Defense" value={commander.defense} icon="🛡️" color="text-blue-600" />
        <StatItem label="Experience" value={commander.experience} icon="⭐" color="text-yellow-600" />
      </div>

      {/* Army Composition */}
      <div className="mb-4">
        <ArmyComposition army={commander.army} />
      </div>

      {/* Special Ability */}
      <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="text-sm font-medium text-purple-800 mb-1">
          Special Ability
        </div>
        <div className="text-xs text-purple-600">
          {commanderClass.specialAbility}
        </div>
      </div>

      {/* Assignment Status */}
      {isAssigned ? (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            Assigned to Node #{commander.assignedNode}
          </div>
          {canPerformActions && onUnassign && (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={onUnassign}
              leftIcon="↩️"
            >
              Unassign Commander
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm text-gray-600 mb-2">
            Commander is available for assignment
          </div>
          {canPerformActions && availableNodes.length > 0 && onAssign && (
            <div className="space-y-1">
              {availableNodes.map(node => (
                <Button
                  key={node.id}
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => onAssign(node.id)}
                  leftIcon="📍"
                >
                  Assign to {node.name || `Node ${node.id}`}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
