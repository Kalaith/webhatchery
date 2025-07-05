import React, { useState, useEffect } from 'react';
import { fetchUnits } from '../../api/unitApi';
import type { Unit } from '../../types/Unit';

const UnitProduction: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const updatedProgress = { ...prev };
        units.forEach((unit) => {
          updatedProgress[unit.id] = (updatedProgress[unit.id] || 0) + 10;
          if (updatedProgress[unit.id] > 100) updatedProgress[unit.id] = 0;
        });
        return updatedProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [units]);

  useEffect(() => {
    const loadUnits = async () => {
      const fetchedUnits = await fetchUnits();
      setUnits(fetchedUnits);
      setProgress(fetchedUnits.reduce((acc, unit) => ({ ...acc, [unit.id]: 0 }), {}));
    };

    loadUnits();
  }, []);

  return (
    <div className="production-panel p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Unit Production</h2>
      <div className="unit-production grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <div
            className="unit-card p-4 bg-white rounded-lg shadow-md border border-gray-200"
            id={unit.id}
            key={unit.id}
          >
            <div className="unit-header flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">{unit.name}</h3>
            </div>
            <p className="unit-description text-sm text-gray-600 mb-2">{unit.description}</p>
            <div className="unit-cost text-sm text-gray-500 mb-2">
              <span>Cost: {unit.cost} Biomass</span>
            </div>
            <div className="unit-production-rate text-sm text-gray-500 mb-2">
              <span>Production Rate: {unit.productionRate}</span>
            </div>
            <button
              className="btn btn--primary produce-btn w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              id={`produce-${unit.id}`}
            >
              Produce {unit.name}
            </button>
            <div className="production-progress mt-2">
              <span className="text-sm text-gray-500">Progress: {progress[unit.id] || 0}%</span>
              <div className="progress-bar h-2 bg-gray-200 rounded mt-1">
                <div
                  className="progress-fill h-2 bg-blue-500 rounded"
                  style={{ width: `${progress[unit.id] || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitProduction;
