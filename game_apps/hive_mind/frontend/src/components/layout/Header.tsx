import React, { useEffect, useState } from 'react';
import { fetchResources } from '../../api/resourcesApi';
import type { Resource } from '../../types/Resource';

const Header: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const loadResources = async () => {
      const fetchedResources = await fetchResources();
      setResources(fetchedResources);
    };

    loadResources();
  }, []);

  return (
    <header className="header bg-gray-800 text-white p-4 shadow-md">
      <div className="header-content flex items-center justify-between">
        <h1 className="game-title text-2xl font-bold">🐛 Hive Mind</h1>
        <div className="resources flex space-x-4">
          {resources.map((resource) => (
            <div
              className="resource-item flex items-center space-x-2 bg-gray-700 p-2 rounded-lg shadow-sm"
              key={resource.id}
            >
              <span className="resource-icon text-xl">{resource.icon}</span>
              <span className="resource-label text-sm font-medium">{resource.name}</span>
              <span
                className="resource-value text-lg font-bold"
                id={`${resource.id}-value`}
              >
                {resource.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
