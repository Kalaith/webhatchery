import React from 'react';
import { Card } from '../ui/Card';

interface VolumeControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  label,
  value,
  onChange,
  className = ''
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  const handleMute = () => {
    onChange(value > 0 ? 0 : 0.7);
  };

  const percentage = Math.round(value * 100);

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 min-w-[3ch]">
            {percentage}%
          </span>
          <button
            onClick={handleMute}
            className={`p-1 rounded text-xs transition-colors ${
              value === 0
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
            title={value === 0 ? 'Unmute' : 'Mute'}
          >
            {value === 0 ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
        />
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </Card>
  );
};
