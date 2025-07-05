import React, { useEffect, useState } from 'react';
import { fetchGoals } from '../../api/goalsApi';
import type { Goal } from '../../types/Goal';

const GoalsPanel: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const loadGoals = async () => {
      const goalsData = await fetchGoals();
      setGoals(goalsData);
    };

    loadGoals();
  }, []);

  return (
    <div className="goals-panel p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Goals</h2>
      <div className="goals-list space-y-4" id="goals-list">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="goal-item p-4 bg-white rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{goal.description}</h3>
            <ul className="requirements-list text-sm text-gray-600 mb-2">
              {Object.entries(goal.requirements).map(([key, value]) => (
                <li key={key} className="requirement-item">
                  {key}: {value}
                </li>
              ))}
            </ul>
            <ul className="rewards-list text-sm text-gray-600">
              {Object.entries(goal.rewards).map(([key, value]) => (
                <li key={key} className="reward-item">
                  {key}: {value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsPanel;
