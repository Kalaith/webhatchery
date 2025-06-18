// Reusable training session card component - Single Responsibility Principle

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Zap, 
  Target, 
  Award,
  Lock
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { TrainingSession } from '../../types/training';

interface TrainingCardProps {
  training: TrainingSession;
  onStart: (trainingId: string) => void;
  disabled?: boolean;
}

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800',
  Novice: 'bg-blue-100 text-blue-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-orange-100 text-orange-800',
  Expert: 'bg-red-100 text-red-800',
  Master: 'bg-purple-100 text-purple-800',
  Legendary: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
} as const;

const typeColors = {
  Basic: 'text-gray-600',
  Combat: 'text-red-600',
  Magic: 'text-purple-600',
  Physical: 'text-orange-600',
  Mental: 'text-blue-600',
  Spiritual: 'text-indigo-600',
  Elemental: 'text-green-600',
  Team: 'text-pink-600',
  Special: 'text-yellow-600',
  Advanced: 'text-violet-600'
} as const;

export const TrainingCard: React.FC<TrainingCardProps> = ({ 
  training, 
  onStart, 
  disabled = false 
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds > 0 ? `${remainingSeconds}s` : ''}`.trim();
    }
    return `${seconds}s`;
  };

  const isLocked = !training.isUnlocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-4 h-full ${isLocked ? 'opacity-60' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 leading-tight">
                {training.name}
              </h3>
              {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-medium ${typeColors[training.type]}`}>
                {training.type}
              </span>
              <span className="text-gray-300">•</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColors[training.difficulty]}`}>
                {training.difficulty}
              </span>
            </div>
          </div>
          
          {training.completionCount > 0 && (
            <div className="flex items-center gap-1 text-amber-600">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">{training.completionCount}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {training.description}
        </p>

        {/* Training Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(training.duration)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Zap className="w-4 h-4" />
            <span>{training.cost.magicalEnergy} Magical Energy</span>
          </div>

          {training.effects.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>{training.effects.length} Training Effect{training.effects.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {training.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {training.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
            {training.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                +{training.tags.length - 3}
              </span>
            )}
          </div>
        )}        {/* Action Button */}
        <Button
          variant={isLocked ? "secondary" : "primary"}
          className="w-full"
          onClick={() => onStart(training.id)}
          disabled={disabled || isLocked}
        >
          {isLocked ? 'Locked' : 'Start Training'}
        </Button>
      </Card>
    </motion.div>
  );
};
