import React from 'react';
import type { PersonNameResult } from '../types';

interface ResultsGridProps {
  results: PersonNameResult[];
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results }) => {
  if (!results.length) return <div className="text-center text-gray-400">No results yet.</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {results.map((person, idx) => (
        <div key={idx} className="p-4 bg-white dark:bg-gray-700 rounded shadow">
          <div className="font-bold text-lg">{person.name}</div>
          {/* More details can go here later */}
        </div>
      ))}
    </div>
  );
};

export default ResultsGrid; 