import React from 'react';

interface ResultsGridProps {
  results: any[];
  type: 'people' | 'places' | 'events' | 'titles';
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results, type }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No results yet</h3>
        <p className="text-gray-500 dark:text-gray-500">Click Generate to see your results here</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'people':
        return '👤';
      case 'places':
        return '🏰';
      case 'events':
        return '⚡';
      case 'titles':
        return '👑';
      default:
        return '📝';
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">{getIcon(type)}</span>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 capitalize">
          Generated {type}
        </h3>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item, idx) => {
          switch (type) {
            case 'people':
              // Backend returns array of strings only
              return (
                <div key={idx} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-102 transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {item.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white truncate">{item}</h4>
                    </div>
                  </div>
                </div>
              );
            case 'places':
            case 'events':
            case 'titles':
              return (
                <div key={idx} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-102 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xl">
                      {getIcon(type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{item}</h4>
                    </div>
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default ResultsGrid; 