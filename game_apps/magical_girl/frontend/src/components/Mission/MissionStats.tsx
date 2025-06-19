// Mission statistics component - Single Responsibility Principle

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Trophy, 
  Clock, 
  Star,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { Card } from '../ui/Card';

interface MissionStatsProps {
  totalMissions: number;
  completedMissions: number;
  activeMissions: number;
  totalRewardsEarned: number;
  averageSuccessRate: number;
  streakCount: number;
}

export const MissionStats: React.FC<MissionStatsProps> = ({
  totalMissions,
  completedMissions,
  activeMissions,
  averageSuccessRate,
  streakCount
}) => {
  const completionRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

  const stats = [
    {
      icon: Target,
      label: 'Total Missions',
      value: totalMissions.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: `${completedMissions}`,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Clock,
      label: 'Active',
      value: activeMissions.toString(),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Trophy,
      label: 'Success Rate',
      value: `${Math.round(averageSuccessRate)}%`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Star,
      label: 'Completion Rate',
      value: `${Math.round(completionRate)}%`,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: TrendingUp,
      label: 'Win Streak',
      value: streakCount.toString(),
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
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
              <div className={`w-10 h-10 mx-auto mb-2 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <IconComponent className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600">
                {stat.label}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
