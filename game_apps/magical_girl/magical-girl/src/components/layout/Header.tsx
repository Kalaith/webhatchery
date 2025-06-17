import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Dumbbell, Map, Trophy, Settings } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { VIEWS, type ViewType } from '../../config/gameConfig';

const navigationItems = [
  { id: VIEWS.DASHBOARD, label: 'Dashboard', icon: Star },
  { id: VIEWS.MAGICAL_GIRLS, label: 'Magical Girls', icon: Users },
  { id: VIEWS.TRAINING, label: 'Training', icon: Dumbbell },
  { id: VIEWS.MISSIONS, label: 'Missions', icon: Map },
  { id: VIEWS.ACHIEVEMENTS, label: 'Achievements', icon: Trophy },
];

export const Header: React.FC = () => {
  const { currentView, setCurrentView } = useUIStore();

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">
                Magical Girl Simulator
              </h1>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200
                    flex items-center space-x-2
                    ${isActive 
                      ? 'bg-purple-100 text-purple-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              className="p-2 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};
