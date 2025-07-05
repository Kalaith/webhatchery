import React, { useEffect, useState } from 'react';
import HiveCore from './HiveCore';
import UnitCount from './UnitCount';
import { fetchUnits } from '../../api/unitApi';
import type { Unit } from '../../types/Unit';

const HiveVisualization: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    const loadUnits = async () => {
      const unitsData = await fetchUnits();
      setUnits(unitsData);
    };

    loadUnits();
  }, []);

  return (
    <div className="hive-visualization p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">The Hive</h2>
      <HiveCore />
      <div className="unit-counts grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit) => (
          <UnitCount
            key={unit.id}
            id={unit.id}
            icon={unit.icon}
            label={unit.name}
            value={Object.values(unit.production).reduce((acc, val) => acc + (val || 0), 0)}
            isVisible={unit.isVisible}
          />
        ))}
      </div>
    </div>
  );
};

export default HiveVisualization;
