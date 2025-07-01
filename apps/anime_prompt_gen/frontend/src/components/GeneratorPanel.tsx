import React from 'react';
import { speciesData } from '../utils/speciesData';

interface GeneratorPanelProps {
  species: string;
  promptCount: number;
  setSpecies: React.Dispatch<React.SetStateAction<string>>;
  setPromptCount: React.Dispatch<React.SetStateAction<number>>;
  onGenerate: () => void;
}

const GeneratorPanel: React.FC<GeneratorPanelProps> = ({
  species,
  promptCount,
  setSpecies,
  setPromptCount,
  onGenerate,
}) => {
  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Generator Panel</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="species">
          Species
        </label>
        <select
          id="species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {Object.keys(speciesData).map((key) => (
            <option key={key} value={key}>
              {`${key} - ${speciesData[key as keyof typeof speciesData].breed.charAt(0).toUpperCase() + speciesData[key as keyof typeof speciesData].breed.slice(1)}`}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="promptCount">
          Prompt Count
        </label>
        <input
          id="promptCount"
          type="number"
          value={promptCount}
          onChange={(e) => setPromptCount(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={onGenerate}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Generate
      </button>
    </div>
  );
};

export default GeneratorPanel;
