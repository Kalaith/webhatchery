import React from 'react';
import styles from './StatsGrid.module.css';

interface StatsGridProps {
  totalProjects: number;
  totalRequests: number;
  openRequests: number;
  completedRequests: number;
}

const StatsGrid: React.FC<StatsGridProps> = ({
  totalProjects,
  totalRequests,
  openRequests,
  completedRequests,
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-8">
    <div className={`stat-card bg-surface border rounded p-6 text-center ${styles['stat-card']}`}>
      <div className={`stat-card__value text-3xl font-bold text-primary ${styles['stat-card__value']}`}>{totalProjects}</div>
      <div className="stat-card__label text-secondary">Total Projects</div>
    </div>
    <div className={`stat-card bg-surface border rounded p-6 text-center ${styles['stat-card']}`}>
      <div className={`stat-card__value text-3xl font-bold text-primary ${styles['stat-card__value']}`}>{totalRequests}</div>
      <div className="stat-card__label text-secondary">Feature Requests</div>
    </div>
    <div className={`stat-card bg-surface border rounded p-6 text-center ${styles['stat-card']}`}>
      <div className={`stat-card__value text-3xl font-bold text-primary ${styles['stat-card__value']}`}>{openRequests}</div>
      <div className="stat-card__label text-secondary">Open Requests</div>
    </div>
    <div className={`stat-card bg-surface border rounded p-6 text-center ${styles['stat-card']}`}>
      <div className={`stat-card__value text-3xl font-bold text-primary ${styles['stat-card__value']}`}>{completedRequests}</div>
      <div className="stat-card__label text-secondary">Completed</div>
    </div>
  </div>
);

export default StatsGrid;
