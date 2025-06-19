// Achievement statistics component - Single Responsibility Principle
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Star,
  Award,
  Clock
} from 'lucide-react';
import { Card } from '../ui/Card';
import type { AchievementStats as AchievementStatsType } from '../../types/achievements';

interface AchievementStatsProps extends AchievementStatsType {
  className?: string;
}

export const AchievementStats: React.FC<AchievementStatsProps> = ({
  totalAchievements,
  unlockedAchievements,
  achievementPoints,
  completionRate,
  recentUnlocks,
  nearCompletion,
  className = ''
}) => {
  const stats = [
    {
      icon: Target,
      label: 'Total Achievements',
      value: totalAchievements.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Trophy,
      label: 'Unlocked',
      value: `${unlockedAchievements}`,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: TrendingUp,
      label: 'Completion Rate',
      value: `${Math.round(completionRate)}%`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Star,
      label: 'Achievement Points',
      value: achievementPoints.toString(),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Award,
      label: 'Near Completion',
      value: nearCompletion.length.toString(),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: Clock,
      label: 'Recent Unlocks',
      value: recentUnlocks.length.toString(),
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  ${stat.bgColor}
                `}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-gray-900 leading-none">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {stat.label}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
