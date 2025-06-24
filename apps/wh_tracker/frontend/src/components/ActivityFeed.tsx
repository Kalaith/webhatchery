import React from 'react';

const ActivityFeed: React.FC = () => (
  <div className="space-y-4">
    {/* TODO: Map recent activity */}
    <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <div className="w-2 h-2 rounded-full bg-[rgb(var(--color-primary))] mt-2"></div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-gray-100">Added new feature request</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jun 22, 2025</div>
      </div>
    </div>
    <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-gray-100">Completed feature implementation</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jun 21, 2025</div>
      </div>
    </div>
    <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-gray-100">Started working on bug fix</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jun 20, 2025</div>
      </div>
    </div>
  </div>
);

export default ActivityFeed;
