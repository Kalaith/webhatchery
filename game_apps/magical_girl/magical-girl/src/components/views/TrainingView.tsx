// Training Center main view - Clean Architecture with component composition

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Users, 
  BookOpen,
  AlertCircle,
  Star
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TrainingCard } from '../Training/TrainingCard';
import { TrainingStats } from '../Training/TrainingStats';
import { TrainingFilters } from '../Training/TrainingFilters';
import { ActiveTraining } from '../Training/ActiveTraining';
import { useTraining } from '../../hooks/useTraining';

export const TrainingView: React.FC = () => {
  const {
    filteredTrainingSessions,
    trainingStats,
    availableMagicalGirls,
    activeSessions,
    filters,
    handleStartTraining,
    canAffordTraining,
    completeActiveSession,
    setSearchTerm,
    setSelectedType,
    setSelectedDifficulty,
    setSelectedCategory,
    setShowOnlyUnlocked
  } = useTraining();

  const [selectedGirlId, setSelectedGirlId] = useState<string | null>(
    availableMagicalGirls.length > 0 ? availableMagicalGirls[0].id : null
  );

  const handleTrainingStart = (trainingId: string) => {
    if (!selectedGirlId) {
      // Handle no girl selected
      return;
    }

    const success = handleStartTraining(trainingId, selectedGirlId);
    if (!success) {
      // Error handling is done in the hook/store
    }
  };

  const unlockedSessions = filteredTrainingSessions.filter(s => s.isUnlocked);
  const lockedSessions = filteredTrainingSessions.filter(s => !s.isUnlocked);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Dumbbell className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gradient">
            Training Center
          </h1>
        </div>
        <p className="text-gray-600">
          Enhance your magical girls' abilities through focused training sessions
        </p>
      </div>

      {/* Quick Info */}
      {availableMagicalGirls.length === 0 && (
        <Card className="p-4 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-medium text-amber-800">No Available Magical Girls</h3>
              <p className="text-sm text-amber-700">
                You need to unlock at least one magical girl to start training.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Magical Girl Selection */}
      {availableMagicalGirls.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Users className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Magical Girl for Training:
              </label>
              <select
                value={selectedGirlId || ''}
                onChange={(e) => setSelectedGirlId(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {availableMagicalGirls.map(girl => (
                  <option key={girl.id} value={girl.id}>
                    {girl.name} (Level {girl.level}) - {girl.element}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}      {/* Training Statistics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Training Progress</h2>
        </div>
        <TrainingStats {...trainingStats} />
      </div>

      {/* Active Training Sessions */}
      <ActiveTraining 
        activeSessions={activeSessions}
        onComplete={completeActiveSession}
      />

      {/* Filters */}
      <TrainingFilters
        searchTerm={filters.searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={filters.selectedType}
        onTypeChange={setSelectedType}
        selectedDifficulty={filters.selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        selectedCategory={filters.selectedCategory}
        onCategoryChange={setSelectedCategory}
        showOnlyUnlocked={filters.showOnlyUnlocked}
        onShowOnlyUnlockedChange={setShowOnlyUnlocked}
      />

      {/* Available Training Sessions */}
      {unlockedSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-green-600" />
            Available Training ({unlockedSessions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedSessions.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                onStart={handleTrainingStart}
                disabled={!selectedGirlId || !canAffordTraining(training.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Training Sessions */}
      {lockedSessions.length > 0 && !filters.showOnlyUnlocked && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-500 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Locked Training ({lockedSessions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedSessions.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                onStart={handleTrainingStart}
                disabled={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTrainingSessions.length === 0 && (
        <Card className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Training Sessions Found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters.
          </p>          <Button 
            variant="secondary" 
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedDifficulty('all');
              setSelectedCategory('all');
              setShowOnlyUnlocked(false);
            }}
          >
            Clear All Filters
          </Button>
        </Card>
      )}
    </motion.div>
  );
};
