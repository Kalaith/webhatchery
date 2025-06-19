// Active training sessions component - Single Responsibility Principle

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ActiveTrainingSession {
  id: string;
  trainingName: string;
  girlName: string;
  girlId: string;
  startTime: number;
  duration: number; // in seconds
  timeRemaining: number; // in seconds
}

interface ActiveTrainingProps {
  activeSessions: ActiveTrainingSession[];
  onComplete?: (sessionId: string) => void;
}

export const ActiveTraining: React.FC<ActiveTrainingProps> = ({ 
  activeSessions, 
  onComplete 
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = (session: ActiveTrainingSession): number => {
    const elapsed = session.duration - session.timeRemaining;
    return (elapsed / session.duration) * 100;
  };

  if (activeSessions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        Active Training Sessions ({activeSessions.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeSessions.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-blue-900">{session.trainingName}</h4>
                  <div className="flex items-center gap-1 text-sm text-blue-700">
                    <User className="w-3 h-3" />
                    <span>{session.girlName}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-900">
                    {formatTime(session.timeRemaining)}
                  </div>
                  <div className="text-xs text-blue-600">remaining</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgress(session)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-blue-600 mt-1">
                  <span>{Math.round(getProgress(session))}% complete</span>
                  <span>{formatTime(session.duration)} total</span>
                </div>
              </div>

              {/* Complete Button (if training is done) */}
              {session.timeRemaining <= 0 && onComplete && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={() => onComplete(session.id)}
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Training
                </Button>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
