import React, { useContext } from 'react';
import styles from './Dashboard.module.css';
import StatsGrid from './StatsGrid';
import RequestCard from './RequestCard';
import ActivityFeed from './ActivityFeed';
import { ProjectsContext } from '../App';

const Dashboard: React.FC = () => {
  const projectsData = useContext(ProjectsContext);

  // Calculate total projects
  let totalProjects = 0;
  if (projectsData && projectsData.groups) {
    totalProjects = Object.values(projectsData.groups)
      .map(group => group.projects.length)
      .reduce((a, b) => a + b, 0);
  }

  // TODO: Replace with real feature request data
  const totalRequests = 0;
  const openRequests = 0;
  const completedRequests = 0;

  return (
    <div>
      <div className={styles.dashboard__header}>
        <h2 className={`text-xl font-semibold ${styles.dashboard__title}`}>Project Overview</h2>
        <p className={styles.dashboard__subtitle}>Track feature requests and manage project development</p>
      </div>
      <div className={styles['stats-grid']}>
        <StatsGrid
          totalProjects={totalProjects}
          totalRequests={totalRequests}
          openRequests={openRequests}
          completedRequests={completedRequests}
        />
      </div>
      <div className={styles.dashboard__content}>
        <div className={`${styles.dashboard__section} ${styles['most-voted-section']}`}>
          <h3>Most Voted Requests</h3>
          <RequestCard />
        </div>
        <div className={styles.dashboard__section}>
          <h3>Recent Activity</h3>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
