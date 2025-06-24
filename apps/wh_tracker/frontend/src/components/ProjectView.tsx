import React from 'react';
import styles from './ProjectView.module.css';
import RequestCard from './RequestCard';
import FeatureRequestForm from './FeatureRequestForm';

const ProjectView: React.FC = () => (
  <div>
    <div className={styles['project-header']}>
      <div className={styles['project-header__info']}>
        <h2 className="text-xl font-bold">Project Title</h2>
        <p className="text-secondary">Project description goes here.</p>
        <div className={styles['project-header__meta']}>
          <span className="status status--info">Static</span>
          <span>3 feature requests</span>
        </div>
      </div>
      <button className="btn btn-primary mt-4">New Feature Request</button>
    </div>
    <div className={styles['project-filters']}>
      <div className={styles['filter-group']}>
        <label className="form-label">Sort by:</label>
        <select className="form-control w-40">
          <option>Most Votes</option>
          <option>Most Recent</option>
          <option>Priority</option>
          <option>Status</option>
        </select>
      </div>
      <div className={styles['filter-group']}>
        <label className="form-label">Status:</label>
        <select className="form-control w-40">
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>
    </div>
    <div className={styles['requests-list']}>
      <RequestCard />
    </div>
    <FeatureRequestForm />
  </div>
);

export default ProjectView;
