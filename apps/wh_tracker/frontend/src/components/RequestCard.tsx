import React from 'react';
import styles from './RequestCard.module.css';

const RequestCard: React.FC = () => (
  <div className={styles['request-card']}>
    <div className={styles['request-card__header']}>
      <h3 className={styles['request-card__title']}>Request Title</h3>
      <div className={styles['request-card__votes']}>
        <button className={styles['vote-btn']}>▲</button>
        <span className={styles['vote-count']}>15</span>
        <button className={styles['vote-btn']}>▼</button>
      </div>
    </div>
    <p className={styles['request-card__description']}>Request description goes here.</p>
    <div className={styles['request-card__meta']}>
      <span className="status status--info">Open</span>
      <span className={`${styles['request-card__tag']} ${styles['priority-medium']}`}>Medium Priority</span>
      <span className={styles['request-card__tag']}>Enhancement</span>
      <span className={styles['request-card__tag']}>ui</span>
      <span className="ml-auto text-secondary">Jun 20, 2025</span>
    </div>
  </div>
);

export default RequestCard;
