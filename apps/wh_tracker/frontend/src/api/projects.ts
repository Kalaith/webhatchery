// API utility for loading projects.json
export interface ProjectGroup {
  name: string;
  projects: Project[];
}

export interface Project {
  title: string;
  path: string;
  description: string;
  deployment?: any;
  repository?: any;
}

export interface ProjectsData {
  version: string;
  description: string;
  groups: Record<string, ProjectGroup>;
}

const PROJECTS_URL =
  import.meta.env.MODE === 'production'
    ? 'https://webhatchery.au/projects.json'
    : '/projects.json';

console.log('[projects.ts] PROJECTS_URL:', PROJECTS_URL);

export async function fetchProjects(): Promise<ProjectsData> {
  console.log('[projects.ts] Fetching projects from:', PROJECTS_URL);
  try {
    const response = await fetch(PROJECTS_URL);
    console.log('[projects.ts] Response status:', response.status);
    if (!response.ok) {
      console.error('[projects.ts] Failed to fetch projects.json:', response.statusText);
      throw new Error('Failed to load projects.json');
    }
    const data = await response.json();
    console.log('[projects.ts] Loaded projects.json:', data);
    return data;
  } catch (err) {
    console.error('[projects.ts] Error fetching projects.json:', err);
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      console.warn('[projects.ts] This may be a CORS issue.');
    }
    throw err;
  }
}
