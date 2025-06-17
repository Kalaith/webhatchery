// Training statistics component - Single Responsibility Principle

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Target,
  Zap
} from 'lucide-react';
import { Card } from '../ui/Card';

interface TrainingStatsProps {
  totalSessions: number;
  completedSessions: number;
  totalTimeSpent: number; // in seconds
  averageScore?: number;
  magicalEnergySpent: number;
}

export const TrainingStats: React.FC<TrainingStatsProps> = ({
  totalSessions,
  completedSessions,
  totalTimeSpent,
  averageScore,
  magicalEnergySpent
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  const stats = [
    {
      icon: Target,
      label: 'Completion Rate',
      value: `${Math.round(completionRate)}%`,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Award,
      label: 'Sessions Completed',
      value: `${completedSessions}/${totalSessions}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Clock,
      label: 'Time Trained',
      value: formatTime(totalTimeSpent),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Zap,
      label: 'Energy Spent',
      value: magicalEnergySpent.toString(),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  if (averageScore !== undefined) {
    stats.push({
      icon: TrendingUp,
      label: 'Average Score',
      value: `${Math.round(averageScore)}%`,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <IconComponent className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
