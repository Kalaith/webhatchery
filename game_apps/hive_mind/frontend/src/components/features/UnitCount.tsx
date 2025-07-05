import React from 'react';

interface UnitCountProps {
  id: string;
  icon: string;
  label: string;
  value: number;
  isVisible: boolean;
}

const UnitCount: React.FC<UnitCountProps> = ({ id, icon, label, value, isVisible }) => {
  return (
    <div
      className={`unit-count flex items-center space-x-4 p-4 bg-gray-100 rounded shadow-md ${
        isVisible ? 'block' : 'hidden'
      }`}
      id={id}
    >
      <span className="unit-icon text-2xl">{icon}</span>
      <span className="unit-label text-lg font-semibold text-gray-700">{label}</span>
      <span className="unit-value text-lg font-bold text-gray-900">{value}</span>
    </div>
  );
};

export default UnitCount;
