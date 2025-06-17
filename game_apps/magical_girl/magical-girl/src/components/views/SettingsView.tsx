import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { VolumeControl } from '../ui/VolumeControl';
import { useSettings } from '../../hooks/useSettings';

export const SettingsView: React.FC = () => {
  const { settings, setMasterVolume, resetSettings } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Customize your game experience
        </p>
      </div>

      {/* Audio Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Audio Settings</h2>
        
        <VolumeControl
          label="Master Volume"
          value={settings.masterVolume}
          onChange={setMasterVolume}
        />
        
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="text-blue-600">🔊</div>
            <div>
              <p className="text-sm font-medium text-blue-800">
                Volume Control Active
              </p>
              <p className="text-xs text-blue-600">
                Current volume: {Math.round(settings.masterVolume * 100)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Other Settings Coming Soon */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Other Settings</h3>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Music Volume</span>
            <span className="text-sm text-gray-400">Coming Soon</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Sound Effects</span>
            <span className="text-sm text-gray-400">Coming Soon</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Animations</span>
            <span className="text-sm text-gray-400">Coming Soon</span>
          </div>
        </div>
      </Card>

      {/* Reset Button */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Reset Settings</h3>
            <p className="text-sm text-gray-600">Reset all settings to default values</p>
          </div>
          <button
            onClick={resetSettings}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </Card>
    </motion.div>
  );
};
