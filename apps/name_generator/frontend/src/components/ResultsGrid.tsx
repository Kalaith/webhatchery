import React from 'react';

interface ResultsGridProps {
  results: any[];
  type: 'people' | 'places' | 'events' | 'titles';
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results, type }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <div className="text-2xl mb-2">No results yet</div>
        <div className="text-sm">Click Generate to see results here.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {results.map((item, idx) => {
        switch (type) {
          case 'people':
            return (
              <div key={idx} className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow flex flex-col gap-2">
                <div className="font-bold text-lg">{item.name}</div>
                <div className="text-sm text-gray-500">{item.culture} | {item.gender} | {item.method}</div>
                <div className="text-xs text-gray-400">{item.meaning}</div>
              </div>
            );
          case 'places':
            return (
              <div key={idx} className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow flex flex-col gap-2">
                <div className="font-bold text-lg">{item}</div>
              </div>
            );
          case 'events':
            return (
              <div key={idx} className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow flex flex-col gap-2">
                <div className="font-bold text-lg">{item}</div>
              </div>
            );
          case 'titles':
            return (
              <div key={idx} className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow flex flex-col gap-2">
                <div className="font-bold text-lg">{item}</div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ResultsGrid; 