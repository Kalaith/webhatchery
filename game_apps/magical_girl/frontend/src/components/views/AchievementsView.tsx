// Achievements main view - Clean Architecture with component composition
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Filter, 
  Star,
  Award,
  Target
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AchievementCard } from '../Achievement/AchievementCard';
import { AchievementStats } from '../Achievement/AchievementStats';
import { AchievementFilters } from '../Achievement/AchievementFilters';
import { ActiveAchievements } from '../Achievement/ActiveAchievements';
import { useAchievements } from '../../hooks/useAchievements';
import { achievementCategories } from '../../data/achievements';

export const AchievementsView: React.FC = () => {
  const {
    filteredAchievements,
    achievementStats,
    achievementFilters,
    achievementsByCategory,
    achievementsByStatus,
    handleSearchChange,
    handleCategoryChange,
    handleRarityChange,
    handleStatusChange,
    handleShowHiddenChange,
    clearAllFilters,
    getNextAchievement,
    getRecentAchievements,
    getNearCompletionAchievements,
    getTotalPoints  } = useAchievements();

  const [showFilters, setShowFilters] = useState(false);

  const nextAchievement = getNextAchievement();
  const recentUnlocks = getRecentAchievements();
  const nearCompletion = getNearCompletionAchievements();

  // Group achievements by category with sorting
  const categoryOrder = ['training', 'missions', 'collection', 'progression', 'social', 'exploration', 'combat', 'special'];
  const sortedCategories = Object.keys(achievementsByCategory).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });
  const handleAchievementClick = (achievementId: string) => {
    // TODO: Implement achievement modal or details view
    console.log('Achievement clicked:', achievementId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
          Achievement Gallery
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Track your progress, unlock rewards, and showcase your accomplishments in your magical journey.
        </p>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{getTotalPoints()} Points</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-purple-500" />
            <span className="font-medium">{achievementStats.unlockedAchievements} Unlocked</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{Math.round(achievementStats.completionRate)}% Complete</span>
          </div>
        </div>
      </div>      {/* Achievement Statistics */}
      <div className="px-2 sm:px-0">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Trophy className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg sm:text-xl font-semibold">Achievement Progress</h2>
        </div>
        <AchievementStats {...achievementStats} />
      </div>

      {/* Active Achievements Section */}
      <div className="px-2 sm:px-0">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Star className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg sm:text-xl font-semibold">Active Progress</h2>
        </div>
        <ActiveAchievements
          recentUnlocks={recentUnlocks}
          nearCompletion={nearCompletion}
          nextAchievement={nextAchievement}
        />
      </div>

      {/* Filters */}
      <div className="px-2 sm:px-0">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">All Achievements</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 min-h-[44px]"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            <span className="sm:hidden">{showFilters ? 'Hide' : 'Filters'}</span>
          </Button>
        </div>
        
        {showFilters && (
          <AchievementFilters
            searchTerm={achievementFilters.search}
            onSearchChange={handleSearchChange}
            selectedCategory={achievementFilters.category}
            onCategoryChange={handleCategoryChange}
            selectedRarity={achievementFilters.rarity}
            onRarityChange={handleRarityChange}
            selectedStatus={achievementFilters.status}
            onStatusChange={handleStatusChange}
            showHidden={achievementFilters.showHidden}
            onShowHiddenChange={handleShowHiddenChange}
            onClearFilters={clearAllFilters}
          />
        )}
      </div>      {/* Achievement Grid */}
      {sortedCategories.length > 0 ? (
        <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
          {sortedCategories.map((category) => {
            const categoryConfig = achievementCategories[category as keyof typeof achievementCategories];
            const categoryAchievements = achievementsByCategory[category];
            
            if (!categoryAchievements || categoryAchievements.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{categoryConfig?.icon}</span>
                  {categoryConfig?.name} ({categoryAchievements.length})
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {categoryAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onClick={() => handleAchievementClick(achievement.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-6 sm:p-8 text-center mx-2 sm:mx-0">
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No Achievements Found</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Try adjusting your search criteria or filters.
          </p>
          <Button 
            variant="secondary" 
            onClick={clearAllFilters}
            className="min-h-[44px]"
          >
            Clear All Filters
          </Button>
        </Card>
      )}      {/* Achievement Summary */}
      {filteredAchievements.length > 0 && (
        <Card className="p-4 sm:p-6 mx-2 sm:mx-0">
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-semibold mb-3">Achievement Summary</h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {achievementsByStatus.unlocked.length}
                </div>
                <div className="text-green-700">Unlocked</div>
              </div>
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">
                  {achievementsByStatus.inProgress.length}
                </div>
                <div className="text-blue-700">In Progress</div>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-gray-600">
                  {achievementsByStatus.locked.length}
                </div>
                <div className="text-gray-700">Locked</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};
