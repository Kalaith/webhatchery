import React, { useEffect, useState } from 'react';
import { fetchEvolution } from '../../api/evolutionApi';
import type { Evolution } from '../../types/Evolution';

const EvolutionPanel: React.FC = () => {
  const [evolutions, setEvolutions] = useState<string[]>([]);

  useEffect(() => {
    const loadEvolutions = async () => {
      const evolutionData: Evolution[] = await fetchEvolution();
      setEvolutions(evolutionData.map((evolution) => evolution.name));
    };

    loadEvolutions();
  }, []);

  return (
    <div className="evolution-panel p-6 bg-gray-50 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Evolution</h3>
      <div className="evolution-points flex items-center space-x-2 mb-4">
        <span className="evolution-icon text-2xl">🧬</span>
        <span className="text-lg font-semibold text-gray-700">
          Points: <span id="evolution-points" className="text-blue-500">0</span>
        </span>
      </div>
      <div className="evolutions space-y-2" id="evolutions">
        {evolutions.map((evolution, index) => (
          <div
            key={index}
            className="evolution p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-700"
          >
            {evolution}
          </div>
        ))}
      </div>
      <button
        className="btn btn--primary cocoon-btn w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
        id="cocoon-btn"
        disabled
      >
        Enter Cocoon (Requires 50 units)
      </button>
    </div>
  );
};

export default EvolutionPanel;
