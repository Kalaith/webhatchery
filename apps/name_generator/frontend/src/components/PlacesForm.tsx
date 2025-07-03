import React, { useState, useEffect } from 'react';
import FormSelectField from './FormSelectField';
import { fetchSelectOptions } from '../utils/api';
import type { Option } from '../types';

interface PlacesFormProps {
  onGenerate: (params: {
    count: number;
    type: string;
    style: string;
    method: string;
  }) => void;
  loading?: boolean;
}

const fields = ['type', 'style', 'method'] as const;
type Field = typeof fields[number];

const PlacesForm: React.FC<PlacesFormProps> = ({ onGenerate, loading }) => {
  const [count, setCount] = useState(5);
  const [type, setType] = useState('city');
  const [style, setStyle] = useState('english');
  const [method, setMethod] = useState('traditional_pattern');

  const [options, setOptions] = useState<Record<Field, Option[]>>({
    type: [], style: [], method: []
  });
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoadingOptions(true);
    Promise.all(fields.map(field => fetchSelectOptions(field)))
      .then(results => {
        if (!isMounted) return;
        setOptions({
          type: results[0],
          style: results[1],
          method: results[2],
        });
        setLoadingOptions(false);
      })
      .catch(() => {
        if (isMounted) setLoadingOptions(false);
      });
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ count, type, style, method });
  };

  return (
    <section className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100 dark:border-gray-700">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Generate Place Names</h2>
          <p className="text-gray-600 dark:text-gray-300 text-base">Fill out the options below to generate unique place names. All fields are customizable for your needs.</p>
        </header>
        <form onSubmit={handleSubmit} aria-labelledby="places-form-title" className="space-y-8">
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
                className="input input-bordered w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-green-400 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                aria-describedby="count-help"
              />
              <span id="count-help" className="text-xs text-gray-500 mt-1">Choose between 1 and 20 names.</span>
            </div>
            <FormSelectField
              label="Type"
              name="type"
              value={type}
              onChange={setType}
              options={options.type}
              className="flex flex-col"
            />
            <FormSelectField
              label="Style"
              name="style"
              value={style}
              onChange={setStyle}
              options={options.style}
              className="flex flex-col"
            />
            <FormSelectField
              label="Method"
              name="method"
              value={method}
              onChange={setMethod}
              options={options.method}
              className="flex flex-col"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-2 rounded-lg font-semibold shadow-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
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

export default PlacesForm; 