import React from 'react';
import styles from './SuggestionCard.module.css';

const SuggestionCard: React.FC = () => (
  <div className={styles['suggestion-card']}>
    <div className={styles['suggestion-card__header']}>
      <div>
        <h3 className={styles['suggestion-card__title']}>Suggestion Title</h3>
        <div className={styles['suggestion-card__group']}>Games</div>
      </div>
      <div className="flex items-center gap-2">
        <button className="vote-btn">▲</button>
        <span className="vote-count">12</span>
        <button className="vote-btn">▼</button>
      </div>
    </div>
    <p className="text-secondary mb-2">Suggestion description goes here.</p>
    <div className="flex gap-2 text-xs items-center">
      <strong>Rationale:</strong> Would complement the existing game portfolio.
      <span className="ml-auto text-secondary">Jun 19, 2025</span>
    </div>
  </div>
);

export default SuggestionCard;
