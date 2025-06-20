import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Users, Map, Dumbbell, Trophy } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { magicalGirls, player } = useGameStore();

  const quickStats = [
    {
      label: 'Magical Girls',
      value: magicalGirls.length,
      icon: <Users className="w-6 h-6" />,
      color: 'purple' as const,
    },
    {
      label: 'Missions Completed',
      value: player.statistics.missionsCompleted,
      icon: <Map className="w-6 h-6" />,
      color: 'blue' as const,
    },
    {
      label: 'Training Sessions',
      value: player.statistics.trainingSessionsCompleted,
      icon: <Dumbbell className="w-6 h-6" />,
      color: 'green' as const,
    },
    {
      label: 'Achievements',
      value: player.achievements.filter((a: any) => a.unlockedAt).length,
      icon: <Trophy className="w-6 h-6" />,
      color: 'orange' as const,
    },
  ];
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl lg:text-4xl font-bold text-gradient mb-2">
          Welcome to Magical Girl Academy
        </h1>
        <p className="text-gray-600 text-base lg:text-lg">
          Train your magical girls, complete missions, and become legendary!
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center p-4 lg:p-6 hover:shadow-lg transition-shadow">
              <div className={`
                inline-flex items-center justify-center w-8 h-8 lg:w-12 lg:h-12 rounded-full mb-2 lg:mb-3
                ${stat.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
                ${stat.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                ${stat.color === 'green' ? 'bg-green-100 text-green-600' : ''}
                ${stat.color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
              `}>
                {React.cloneElement(stat.icon, { className: "w-4 h-4 lg:w-6 lg:h-6" })}
              </div>
              <div className="text-lg lg:text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs lg:text-sm text-gray-600">
                {stat.label}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 text-gradient">
            Recent Missions
          </h3>
          <div className="space-y-2 lg:space-y-3">
            {player.statistics.missionsCompleted > 0 ? (
              // Show last few completed missions (simplified - we don't have completed missions list)
              Array.from({ length: Math.min(3, player.statistics.missionsCompleted) }, (_, index) => (
                <div key={index} className="flex items-center justify-between p-2 lg:p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium text-sm lg:text-base">Mission {index + 1}</span>
                  <span className="text-xs lg:text-sm text-green-600">Completed</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-3 lg:py-4 text-sm lg:text-base">
                No missions completed yet. Start your first mission!
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gradient">
            Active Training
          </h3>          <div className="space-y-3">
            {magicalGirls.filter((mg: any) => mg.isTraining).map((girl: any) => (
              <div key={girl.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="font-medium">{girl.name}</span>
                <span className="text-sm text-orange-600">Training...</span>
              </div>
            ))}
            {magicalGirls.filter((mg: any) => mg.isTraining).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No active training sessions.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gradient">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="primary" 
            className="magical-button"
            onClick={() => {/* TODO: Navigate to missions */}}
          >
            Start Mission
          </Button>
          <Button 
            variant="secondary"
            onClick={() => {/* TODO: Navigate to training */}}
          >
            Begin Training
          </Button>
          <Button 
            variant="secondary"
            onClick={() => {/* TODO: Navigate to magical girls */}}
          >
            View Team
          </Button>
          <Button 
            variant="secondary"
            onClick={() => {/* TODO: Navigate to achievements */}}
          >
            Achievements
          </Button>
        </div>
      </Card>
    </div>
  );
};
