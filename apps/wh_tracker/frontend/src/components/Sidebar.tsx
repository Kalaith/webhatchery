import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { ProjectsContext } from '../App';

const Sidebar: React.FC = () => {
  const projectsData = useContext(ProjectsContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebar__nav}>
        <div className={styles.sidebar__section}>
          <button
            className={`${styles.sidebar__item} ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            <span className={styles.sidebar__icon}>📊</span>
            Dashboard
          </button>
          <button
            className={`${styles.sidebar__item} ${location.pathname === '/suggestions' ? 'active' : ''}`}
            onClick={() => navigate('/suggestions')}
          >
            <span className={styles.sidebar__icon}>💡</span>
            Project Suggestions
          </button>
        </div>
        <div className={styles.sidebar__section}>
          <h3 className={styles.sidebar__heading}>Project Groups</h3>
          <div>
            {projectsData && projectsData.groups &&
              Object.entries(projectsData.groups).map(([groupKey, group]) => (
                <div key={groupKey}>
                  <a href="#" className={`${styles['group-item']} ${styles['group-item-heading']}`}>{group.name}</a>
                  {group.projects && group.projects.map((project, idx) => (
                    <a
                      key={project.path}
                      href={`#/project/${encodeURIComponent(project.path)}`}
                      className={styles['group-item']}
                      style={{ marginLeft: 24 }}
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
