import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectView from './components/ProjectView';
import SuggestionsView from './components/SuggestionsView';
import Modal from './components/Modal';
import { fetchProjects } from './api/projects';
import type { ProjectsData } from './api/projects';

export const ProjectsContext = createContext<ProjectsData | null>(null);

const App: React.FC = () => {
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects()
      .then(data => {
        setProjectsData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load project data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading projects...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <ProjectsContext.Provider value={projectsData}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/project/:projectId" element={<ProjectView />} />
                <Route path="/suggestions" element={<SuggestionsView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          <Modal />
        </div>
      </Router>
    </ProjectsContext.Provider>
  );
};

export default App;
