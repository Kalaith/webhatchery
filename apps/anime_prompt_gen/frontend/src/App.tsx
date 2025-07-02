import './styles/globals.css';
import React, { useState } from 'react';
import Header from './components/Header';
import GeneratorPanel from './components/GeneratorPanel';
import OutputPanel from './components/OutputPanel';

const App: React.FC = () => {
  const [generatedJSON, setGeneratedJSON] = useState<string>('');
  const [prompts, setPrompts] = useState<any[]>([]);

  const updatePrompts = (prompts: { image_prompts: { id: number; title: string; description: string; negative_prompt: string; tags: string[]; }[]; }) => {
    setPrompts(prompts.image_prompts);
    setGeneratedJSON(JSON.stringify(prompts.image_prompts, null, 2));
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800">
      <Header />
      <main className="main-content">
        <GeneratorPanel updatePrompts={updatePrompts} />
        <OutputPanel generatedJSON={generatedJSON} />
      </main>
    </div>
  );
};

export default App;