import './styles/globals.css';
import React, { useState } from 'react';
import Header from './components/Header';
import GeneratorPanel from './components/GeneratorPanel';
import OutputPanel from './components/OutputPanel';
import { generatePrompts } from './utils/promptGenerator';

const App: React.FC = () => {
  const [species, setSpecies] = useState<string>('random');
  const [promptCount, setPromptCount] = useState<number>(1);
  const [generatedJSON, setGeneratedJSON] = useState<string>('');

  const handleGenerate = () => {
    const prompts = generatePrompts(promptCount, species);
    setGeneratedJSON(JSON.stringify(prompts, null, 2));
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800">
      <Header />
      <main className="main-content">
        <GeneratorPanel
          species={species}
          promptCount={promptCount}
          setSpecies={setSpecies}
          setPromptCount={setPromptCount}
          onGenerate={handleGenerate}
        />
        <OutputPanel generatedJSON={generatedJSON} />
      </main>
    </div>
  );
};

export default App;