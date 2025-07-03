import React, { useState, useEffect } from 'react';
import FormSelectField from './FormSelectField';
import { fetchSelectOptions } from '../utils/api';
import type { Option } from '../types';

interface PeopleFormProps {
  onGenerate: (params: {
    count: number;
    gender: string;
    culture: string;
    method: string;
    type: string;
    period: string;
    excludeReal: boolean;
  }) => void;
  loading?: boolean;
}

const fields = ['gender', 'culture', 'method', 'type', 'period'] as const;
type Field = typeof fields[number];

const PeopleForm: React.FC<PeopleFormProps> = ({ onGenerate, loading }) => {
  const [count, setCount] = useState(5);
  const [gender, setGender] = useState('any');
  const [culture, setCulture] = useState('any');
  const [method, setMethod] = useState('markov_chain');
  const [type, setType] = useState('full_name');
  const [period, setPeriod] = useState('modern');
  const [excludeReal, setExcludeReal] = useState(false);

  const [options, setOptions] = useState<Record<Field, Option[]>>({
    gender: [], culture: [], method: [], type: [], period: []
  });
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoadingOptions(true);
    Promise.all(fields.map(field => fetchSelectOptions(field)))
      .then(results => {
        if (!isMounted) return;
        setOptions({
          gender: results[0],
          culture: results[1],
          method: results[2],
          type: results[3],
          period: results[4],
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
    onGenerate({ count, gender, culture, method, type, period, excludeReal });
  };

  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-2">
      <div className="w-full max-w-2xl mx-auto rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-0 sm:p-0">
        <header className="px-8 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">Generate People Names</h2>
          <p className="text-gray-600 dark:text-gray-300 text-base mb-2">Create unique, culturally-inspired names. Adjust the options below to fit your needs.</p>
        </header>
        <form onSubmit={handleSubmit} aria-labelledby="people-form-title" className="px-8 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex flex-col">
              <label htmlFor="count" className="block text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">Count</label>
              <input
                id="count"
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="input input-bordered w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-lg"
                aria-describedby="count-help"
              />
              <span id="count-help" className="text-xs text-gray-500 mt-1">Choose between 1 and 20 names.</span>
            </div>
            <FormSelectField
              label="Gender"
              name="gender"
              value={gender}
              onChange={setGender}
              options={options.gender}
              className="flex flex-col"
            />
            <FormSelectField
              label="Culture"
              name="culture"
              value={culture}
              onChange={setCulture}
              options={options.culture}
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
            <FormSelectField
              label="Type"
              name="type"
              value={type}
              onChange={setType}
              options={options.type}
              className="flex flex-col"
            />
            <FormSelectField
              label="Period"
              name="period"
              value={period}
              onChange={setPeriod}
              options={options.period}
              className="flex flex-col"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="excludeReal"
                  checked={excludeReal}
                  onChange={e => setExcludeReal(e.target.checked)}
                  className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-describedby="exclude-help"
                />
                <label htmlFor="excludeReal" className="text-sm select-none text-gray-800 dark:text-gray-100 font-medium">Exclude Real Names</label>
                <span id="exclude-help" className="text-xs text-gray-500 ml-2">Check to avoid real-world names in results.</span>
              </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-3 rounded-xl font-bold shadow-xl text-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <div aria-live="polite" className="sr-only">
            {loading && 'Generating names...'}
            {loadingOptions && 'Loading options...'}
          </div>
        </form>
      </div>
    </section>
  );
};

export default PeopleForm; 