// Active mission display component - Single Responsibility Principle

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Target, 
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Mission } from '../../types/missions';

interface ActiveMissionProps {
  mission: Mission | null;
  timeRemaining?: number;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const ActiveMission: React.FC<ActiveMissionProps> = ({ 
  mission, 
  timeRemaining,
  onComplete,
  onCancel 
}) => {
  if (!mission) {
    return null;
  }

  const formatTime = (seconds?: number): string => {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const completedObjectives = mission.objectives.filter(obj => obj.isCompleted).length;
  const totalObjectives = mission.objectives.length;
  const progressPercentage = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="p-6 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {mission.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{mission.location.name}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-blue-900">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-blue-600">
              {timeRemaining ? 'remaining' : 'unlimited'}
            </div>
          </div>
        </div>

        {/* Mission Description */}
        <p className="text-gray-700 mb-4">
          {mission.description}
        </p>

        {/* Objectives Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Objectives ({completedObjectives}/{totalObjectives})
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Objectives List */}
          <div className="space-y-2">
            {mission.objectives.map((objective) => (
              <div 
                key={objective.id}
                className={`flex items-center gap-2 text-sm p-2 rounded ${
                  objective.isCompleted 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {objective.isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                )}
                <span className={objective.isCompleted ? 'line-through' : ''}>
                  {objective.name}
                </span>
                {!objective.isCompleted && objective.progress !== undefined && (
                  <span className="text-xs ml-auto">
                    {objective.progress}/{objective.maxProgress}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Team Assignment (if applicable) */}
        {mission.requirements.some(req => req.type === 'team_size') && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Team mission in progress</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onComplete && progressPercentage === 100 && (
            <Button
              variant="primary"
              className="flex-1"
              onClick={onComplete}
            >
              Complete Mission
            </Button>
          )}
          
          {onCancel && (
            <Button
              variant="secondary"
              className={progressPercentage === 100 ? 'flex-1' : 'w-full'}
              onClick={onCancel}
            >
              {progressPercentage === 100 ? 'Return Later' : 'Cancel Mission'}
            </Button>
          )}
        </div>

        {/* Mission Status */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Status: Active</span>
            <span>Attempts: {mission.attempts}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
