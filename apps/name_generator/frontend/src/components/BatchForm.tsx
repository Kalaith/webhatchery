import React, { useState } from 'react';

interface BatchFormProps {
  onGenerate: (params: {
    count: number;
    types: string[];
  }) => void;
  loading?: boolean;
}

const typeOptions = [
  { value: 'people', label: 'People' },
  { value: 'places', label: 'Places' },
  { value: 'events', label: 'Events' },
  { value: 'titles', label: 'Titles' },
];

const BatchForm: React.FC<BatchFormProps> = ({ onGenerate, loading }) => {
  const [count, setCount] = useState(5);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['people']);

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ count, types: selectedTypes });
  };

  return (
    <section className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100 dark:border-gray-700">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Batch Generate Names</h2>
          <p className="text-gray-600 dark:text-gray-300 text-base">Select which types of names to generate in batch. All fields are customizable for your needs.</p>
        </header>
        <form onSubmit={handleSubmit} aria-labelledby="batch-form-title" className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="count" className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Count</label>
              <input
                id="count"
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="input input-bordered w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                aria-describedby="count-help"
              />
              <span id="count-help" className="text-xs text-gray-500 mt-1">Choose between 1 and 20 names per type.</span>
            </div>
            <div className="flex flex-col">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Types</span>
              <div className="flex flex-wrap gap-3">
                {typeOptions.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      value={opt.value}
                      checked={selectedTypes.includes(opt.value)}
                      onChange={() => handleTypeChange(opt.value)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-gray-400 to-blue-400 hover:from-gray-500 hover:to-blue-500 text-white px-8 py-2 rounded-lg font-semibold shadow-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BatchForm; 