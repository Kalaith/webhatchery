// Active achievements component - Single Responsibility Principle
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Achievement } from '../../types/achievements';
import { achievementRarities } from '../../data/achievements';

interface ActiveAchievementsProps {
  recentUnlocks: Achievement[];
  nearCompletion: Achievement[];
  nextAchievement: Achievement | null;
}

export const ActiveAchievements: React.FC<ActiveAchievementsProps> = ({
  recentUnlocks,
  nearCompletion,
  nextAchievement
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Unlocks */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold">Recent Unlocks</h3>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence>
            {recentUnlocks.length > 0 ? (
              recentUnlocks.slice(0, 3).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg"
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {achievement.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {achievement.unlockedAt && 
                        new Date(achievement.unlockedAt).toLocaleDateString()
                      }
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      {achievementRarities[achievement.rarity]?.points || 10}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recent achievements unlocked.
              </p>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Near Completion */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Near Completion</h3>
        </div>
        
        <div className="space-y-3">
          {nearCompletion.length > 0 ? (
            nearCompletion.slice(0, 3).map((achievement, index) => {
              const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{achievement.icon}</span>
                      <span className="font-medium text-gray-900 text-sm truncate">
                        {achievement.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    {achievement.progress}/{achievement.maxProgress}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">
              No achievements near completion.
            </p>
          )}
        </div>
      </Card>

      {/* Next Achievement */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Next Up</h3>
        </div>
        
        {nextAchievement ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{nextAchievement.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">
                  {nextAchievement.name}
                </div>
                <div 
                  className="text-xs font-medium px-2 py-1 rounded-full inline-block mt-1"
                  style={{ 
                    backgroundColor: `${achievementRarities[nextAchievement.rarity].color}20`,
                    color: achievementRarities[nextAchievement.rarity].color 
                  }}
                >
                  {achievementRarities[nextAchievement.rarity].name}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              {nextAchievement.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">
                  {nextAchievement.progress}/{nextAchievement.maxProgress}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(nextAchievement.progress / nextAchievement.maxProgress) * 100}%` 
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              
              <div className="text-xs text-gray-500">
                {nextAchievement.maxProgress - nextAchievement.progress} more to unlock
              </div>
            </div>
          </motion.div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No achievements in progress.
          </p>
        )}
      </Card>
    </div>
  );
};
