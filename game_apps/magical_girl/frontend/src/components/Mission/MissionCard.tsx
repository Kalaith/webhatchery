// Reusable mission card component - Single Responsibility Principle

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Target, 
  Star,
  Trophy,
  Lock,
  Users,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Mission } from '../../types/missions';

interface MissionCardProps {
  mission: Mission;
  onStart: (missionId: string) => void;
  disabled?: boolean;
}

const difficultyColors = {
  Tutorial: 'bg-green-100 text-green-800',
  Easy: 'bg-blue-100 text-blue-800',
  Normal: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-orange-100 text-orange-800',
  Expert: 'bg-red-100 text-red-800',
  Master: 'bg-purple-100 text-purple-800',
  Nightmare: 'bg-purple-100 text-purple-800',
  Impossible: 'bg-black text-white'
} as const;

const typeColors = {
  Story: 'text-purple-600',
  Daily: 'text-blue-600',
  Weekly: 'text-green-600',
  Event: 'text-pink-600',
  Challenge: 'text-red-600',
  Training: 'text-orange-600',
  Collection: 'text-indigo-600',
  Boss: 'text-red-700',
  Raid: 'text-purple-700',
  Exploration: 'text-teal-600',
  Tutorial: 'text-gray-600'
} as const;

const categoryIcons = {
  Combat: Target,
  Rescue: Users,
  Investigation: Target,
  Protection: Users,
  Collection: Star,
  Social: Users,
  Stealth: Target,
  Puzzle: Target,
  Escort: Users,
  Survival: AlertTriangle,
  Training: Target
} as const;

export const MissionCard: React.FC<MissionCardProps> = ({ 
  mission, 
  onStart, 
  disabled = false
}) => {
  const isLocked = !mission.isUnlocked;
  const isCompleted = mission.isCompleted;
  const isActive = !mission.isAvailable && mission.isUnlocked;
  
  const CategoryIcon = categoryIcons[mission.category] || Target;

  const formatTimeLimit = (seconds?: number): string => {
    if (!seconds) return 'No time limit';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getCardStatus = () => {
    if (isLocked) return 'Locked';
    if (isCompleted) return 'Completed';
    if (isActive) return 'In Progress';
    return 'Available';
  };

  const getCardBorderColor = () => {
    if (isLocked) return 'border-gray-300';
    if (isCompleted) return 'border-green-300';
    if (isActive) return 'border-blue-300';
    return 'border-purple-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-4 h-full ${getCardBorderColor()} ${isLocked ? 'opacity-60' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CategoryIcon className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900 leading-tight">
                {mission.name}
              </h3>
              {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-medium ${typeColors[mission.type]}`}>
                {mission.type}
              </span>
              <span className="text-gray-300">•</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColors[mission.difficulty]}`}>
                {mission.difficulty}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              isCompleted ? 'bg-green-100 text-green-800' :
              isActive ? 'bg-blue-100 text-blue-800' :
              isLocked ? 'bg-gray-100 text-gray-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {getCardStatus()}
            </span>
            
            {mission.attempts > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Trophy className="w-3 h-3" />
                <span>{mission.attempts} attempts</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {mission.description}
        </p>

        {/* Mission Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{mission.location.name}</span>
          </div>
          
          {mission.timeLimit && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTimeLimit(mission.timeLimit)}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>{mission.objectives.length} objective{mission.objectives.length > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Rewards Preview */}
        {mission.rewards.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">Rewards:</div>
            <div className="flex flex-wrap gap-1">
              {mission.rewards.slice(0, 3).map((reward, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full"
                >
                  {reward.quantity} {reward.type}
                </span>
              ))}
              {mission.rewards.length > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  +{mission.rewards.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {mission.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {mission.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
            {mission.tags.length > 2 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                +{mission.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          variant={isLocked ? "secondary" : isCompleted ? "secondary" : "primary"}
          className="w-full"
          onClick={() => onStart(mission.id)}
          disabled={disabled || isLocked || isActive}
        >
          {isLocked ? 'Locked' : 
           isCompleted ? 'Completed' : 
           isActive ? 'In Progress' : 
           'Start Mission'}
        </Button>
      </Card>
    </motion.div>
  );
};
