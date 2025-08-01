import React, { useState } from 'react';
import { testHealthEndpoints } from '../services/authApi';

const HomePage: React.FC = () => {
  const [healthResults, setHealthResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runHealthChecks = async () => {
    setIsLoading(true);
    try {
      const results = await testHealthEndpoints();
      setHealthResults(results);
    } catch (error) {
      setHealthResults({ error: 'Failed to run health checks' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-2xl py-8">
      <h2 className="text-2xl font-semibold mb-4">Welcome to WebHatchery Auth Portal</h2>
      <p className="mb-4">This is the home page. Use the navigation to log in or view your profile.</p>
      
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Backend Health Check</h3>
        <button
          onClick={runHealthChecks}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Backend Routes'}
        </button>
        
        {healthResults && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Results:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(healthResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomePage;
