// Achievement card component - Single Responsibility Principle
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Trophy, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Achievement } from '../../types/achievements';
import { achievementRarities } from '../../data/achievements';

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
  showDetails?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onClick,
  showDetails = true
}) => {
  const rarityConfig = achievementRarities[achievement.rarity];
  const progressPercentage = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
  const isUnlocked = achievement.unlocked;
  const isHidden = achievement.hidden && !isUnlocked;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
      className={`cursor-pointer ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <Card 
        className={`
          relative overflow-hidden transition-all duration-300
          ${isUnlocked ? 'border-2' : 'border'}
          ${isUnlocked ? rarityConfig.glow : 'opacity-75'}
          ${isHidden ? 'opacity-50' : ''}
          hover:shadow-lg
        `}
        style={{
          borderColor: isUnlocked ? rarityConfig.color : '#e5e7eb'
        }}
      >
        {/* Rarity indicator */}
        <div 
          className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-b-[30px] border-l-transparent"
          style={{ borderBottomColor: rarityConfig.color }}
        >
          <Star 
            className="absolute -bottom-6 -right-1 w-3 h-3 text-white transform rotate-45" 
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-full text-2xl
              ${isUnlocked ? 'bg-gradient-to-br from-yellow-100 to-orange-100' : 'bg-gray-100'}
            `}>
              {isHidden ? <Lock className="w-6 h-6 text-gray-400" /> : achievement.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`
                font-semibold text-lg leading-tight
                ${isUnlocked ? 'text-gray-900' : 'text-gray-600'}
                ${isHidden ? 'text-gray-400' : ''}
              `}>
                {isHidden ? '???' : achievement.name}
              </h3>
              
              <div className="flex items-center gap-2 mt-1">
                <span 
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${rarityConfig.color}20`,
                    color: rarityConfig.color 
                  }}
                >
                  {rarityConfig.name}
                </span>
                
                {isUnlocked && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Trophy className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      {rarityConfig.points} pts
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className={`
            text-sm mb-3 leading-relaxed
            ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}
            ${isHidden ? 'text-gray-400' : ''}
          `}>
            {isHidden ? 'This achievement is hidden until unlocked.' : achievement.description}
          </p>

          {showDetails && !isHidden && (
            <>
              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className={`font-medium ${isUnlocked ? 'text-green-600' : 'text-gray-600'}`}>
                    {achievement.maxProgress <= 1 
                      ? (isUnlocked ? 'Complete' : 'Incomplete')
                      : `${achievement.progress}/${achievement.maxProgress}`
                    }
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      isUnlocked 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Tags */}
              {achievement.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {achievement.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {achievement.tags.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      +{achievement.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Unlock timestamp */}
              {isUnlocked && achievement.unlockedAt && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Unlock effect overlay */}
        {isUnlocked && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        )}
      </Card>
    </motion.div>
  );
};
