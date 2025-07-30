import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface Resource {
  name: string;
}

interface ResourceGeneratorProps {
  resource: Resource;
  rate: number;
  onGenerate: (resource: Resource, rate: number) => void;
}

// Resource Generator Component
const ResourceGenerator: React.FC<ResourceGeneratorProps> = ({ resource, rate, onGenerate }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      onGenerate(resource, rate);
    }, 1000); // Generate every second
    return () => clearInterval(interval);
  }, [resource, rate, onGenerate]);

  return (
    <div>
      <h3>{resource.name}</h3>
      <p>Rate: {rate}/sec</p>
    </div>
  );
};

interface Resources {
  metal: number;
  food: number;
  water: number;
  [key: string]: number; // Add index signature
}

// Main Game Component
const Game: React.FC = () => {
  const [resources, setResources] = useState<Resources>({
    metal: 0,
    food: 0,
    water: 0,
  });

  const [buildings, setBuildings] = useState<string[]>([]); // List of constructed buildings

  const handleGenerate = (resource: Resource, rate: number) => {
    setResources((prev) => ({
      ...prev,
      [resource.name]: prev[resource.name] + rate,
    }));
  };

  const buildBuilding = (type: string) => {
    if (resources.metal >= 10) { // Example cost
      setResources((prev) => ({
        ...prev,
        metal: prev.metal - 10,
      }));
      setBuildings((prev) => [...prev, type]);
    } else {
      alert("Not enough metal!");
    }
  };

  return (
    <div>
      <h1>Colony Automata</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Resource Counters */}
        {Object.entries(resources).map(([key, value]) => (
          <div key={key}>
            <h2>{key.toUpperCase()}</h2>
            <p>{value}</p>
          </div>
        ))}
      </div>

      <hr />

      {/* Resource Generators */}
      <div>
        {buildings.map((building, index) => (
          <ResourceGenerator
            key={index}
            resource={{ name: building }}
            rate={1}
            onGenerate={handleGenerate}
          />
        ))}
      </div>

      <hr />

      {/* Build Button */}
      <div>
        <button onClick={() => buildBuilding('metal')}>Build Metal Generator (10 Metal)</button>
      </div>
    </div>
  );
};

export default Game;