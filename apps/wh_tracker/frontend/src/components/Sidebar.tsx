import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProjectsContext } from '../App';

const Sidebar: React.FC = () => {
  const projectsData = useContext(ProjectsContext);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800 p-6 overflow-y-auto scrollbar-thin hidden lg:block">
      <nav className="space-y-8">
        <div className="space-y-2">
          <button            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              location.pathname === '/' 
                ? 'bg-[rgb(var(--color-primary))] text-white' 
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => navigate('/')}
          >
            <span className="text-lg">📊</span>
            Dashboard
          </button>
          <button            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              location.pathname === '/suggestions' 
                ? 'bg-[rgb(var(--color-primary))] text-white' 
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => navigate('/suggestions')}
          >
            <span className="text-lg">💡</span>
            Project Suggestions
          </button>
        </div>
        
        <div className="space-y-4">          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Project Groups
          </h3>
          <div className="space-y-1">
            {projectsData && projectsData.groups &&
              Object.entries(projectsData.groups).map(([groupKey, group]) => (
                <div key={groupKey} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-gray-100 border-l-2 border-[rgb(var(--color-primary))]">
                    {group.name}
                  </div>
                  {group.projects && group.projects.map((project) => (
                    <a
                      key={project.path}
                      href={`#/project/${encodeURIComponent(project.path)}`}
                      className="block px-3 py-2 ml-4 text-sm text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-md transition-colors"
                    >
                      {project.title}
                    </a>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
