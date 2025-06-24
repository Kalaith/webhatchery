import React from 'react';
import styles from './SuggestionsView.module.css';
import SuggestionCard from './SuggestionCard';
import ProjectSuggestionForm from './ProjectSuggestionForm';

const SuggestionsView: React.FC = () => (
  <div>
    <div className={styles['suggestions-header']}>
      <h2 className="text-xl font-bold">Project Suggestions</h2>
      <p className="text-secondary">Community-suggested projects waiting for consideration</p>
    </div>
    <div className={styles['suggestions-list']}>
      <SuggestionCard />
    </div>
    <ProjectSuggestionForm />
  </div>
);

export default SuggestionsView;
