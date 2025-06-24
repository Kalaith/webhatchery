import React, { useContext } from 'react';
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
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Project Overview</h2>
        <p className="text-gray-400">Track feature requests and manage project development</p>
      </div>
      
      <StatsGrid
        totalProjects={totalProjects}
        totalRequests={totalRequests}
        openRequests={openRequests}
        completedRequests={completedRequests}
      />
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Most Voted Requests</h3>
          <RequestCard />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
