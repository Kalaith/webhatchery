import React from 'react';

const RequestCard: React.FC = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-start justify-between">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Request Title</h3>
      <div className="flex flex-col items-center gap-1 min-w-0 text-center">
        <button className="btn-outline px-2 py-1 text-xs hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20">
          ▲
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">15</span>
        <button className="btn-outline px-2 py-1 text-xs hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20">
          ▼
        </button>
      </div>
    </div>
    
    <p className="text-gray-600 dark:text-gray-400 text-sm">
      Request description goes here. This would be a longer description explaining what the feature request is about.
    </p>
    
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="status-badge status-open">Open</span>
      <span className="status-badge priority-medium">Medium Priority</span>
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
        Enhancement
      </span>
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
        UI
      </span>
      <span className="ml-auto text-gray-500 dark:text-gray-400">Jun 20, 2025</span>
    </div>
  </div>
);

export default RequestCard;
