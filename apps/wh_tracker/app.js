// Application Data
const projectsData = {
  "projects": [
    {
      "group_key": "fiction",
      "group_name": "Fiction Projects",
      "title": "Stories",
      "description": "Collection of interactive stories and creative writing projects with immersive web presentations.",
      "path": "stories/",
      "deployment_type": "Static"
    },
    {
      "group_key": "fiction",
      "group_name": "Fiction Projects",
      "title": "Stories Explicit",
      "description": "Story collection that may contain explicit language.",
      "path": "storiesx/",
      "deployment_type": "Static"
    },
    {
      "group_key": "fiction",
      "group_name": "Fiction Projects",
      "title": "Anime Hub",
      "description": "Character analysis and development charts for popular anime series including Dragon Ball and Granblue Fantasy.",
      "path": "anime/",
      "deployment_type": "Static"
    },
    {
      "group_key": "apps",
      "group_name": "Web Applications",
      "title": "Is It Done Yet?",
      "description": "A full-stack web application for project tracking and status monitoring with real-time updates.",
      "path": "apps/isitdoneyet/",
      "deployment_type": "FullStack"
    },
    {
      "group_key": "apps",
      "group_name": "Web Applications",
      "title": "Meme Generator",
      "description": "Interactive tool for creating custom memes with various templates and text customization options.",
      "path": "apps/meme_generator/frontend/",
      "deployment_type": "React"
    },
    {
      "group_key": "apps",
      "group_name": "Web Applications",
      "title": "Project Management",
      "description": "Comprehensive project management dashboard with stakeholder tracking and report generation features.",
      "path": "apps/project_management/",
      "deployment_type": "Static"
    },
    {
      "group_key": "apps",
      "group_name": "Web Applications",
      "title": "LitRPG Studio",
      "description": "A specialized writing tool designed for LitRPG authors to create and manage game mechanics in their stories.",
      "path": "apps/litrpg_studio/frontend/",
      "deployment_type": "React"
    },
    {
      "group_key": "apps",
      "group_name": "Web Applications",
      "title": "Monster Maker",
      "description": "D&D monster creation tool with challenge rating calculator and stat progression charts.",
      "path": "apps/monster_maker/",
      "deployment_type": "Static"
    },
    {
      "group_key": "apps",
      "group_name": "Web Applications",
      "title": "Name Generator API",
      "description": "Comprehensive name generation tool with multiple algorithms for creating people, place, event, and title names using Markov chains, phonetic patterns, and cultural linguistics.",
      "path": "apps/name_generator/",
      "deployment_type": "Static"
    },
    {
      "group_key": "games",
      "group_name": "Games & Game Design",
      "title": "Dragons Den",
      "description": "Fantasy dragon management game with breeding and exploration mechanics.",
      "path": "game_apps/dragons_den/frontend/",
      "deployment_type": "React"
    },
    {
      "group_key": "games",
      "group_name": "Games & Game Design",
      "title": "Magical Girl",
      "description": "Magical girl transformation and adventure game with character progression.",
      "path": "game_apps/magical_girl/frontend/",
      "deployment_type": "React"
    },
    {
      "group_key": "games",
      "group_name": "Games & Game Design",
      "title": "Xenomorph Park",
      "description": "Xenomorph Park is a sci-fi park management and survival game built with React. Manage alien creatures, containment systems, and visitor safety in a modern, interactive web app.",
      "path": "game_apps/xenomorph_park/frontend/",
      "deployment_type": "React"
    },
    {
      "group_key": "games",
      "group_name": "Games & Game Design",
      "title": "Dungeon Core",
      "description": "Dungeon management game with a React frontend, detailed JSON-based monster evolution trees, trait system, unlock conditions, and a comprehensive GDD. Features persistent adventurer parties, mana/trap economy, room themes, monster breeds/evolution, and advanced UI/gameplay systems. All monster, trait, and unlock data is modular and up-to-date.",
      "path": "game_apps/dungeon_core/frontend/",
      "deployment_type": "React"
    },
    {
      "group_key": "game_design",
      "group_name": "Game Design",
      "title": "Kaiju Simulator",
      "description": "Game Design Document for a Kaiju breeding and battle simulator featuring detailed progression systems, combat mechanics, and creature management concepts.",
      "path": "gdd/kaiju_simulator/",
      "deployment_type": "Static"
    },
    {
      "group_key": "game_design",
      "group_name": "Game Design",
      "title": "Echo of the Many",
      "description": "Fantasy strategy game where players control a mage who creates magical clones to infiltrate and influence a medieval city's political landscape. Features comprehensive React implementation plan with mobile-first PWA design.",
      "path": "gdd/echo_of_the_many/",
      "deployment_type": "Static"
    },
    {
      "group_key": "game_design",
      "group_name": "Game Design",
      "title": "Settlement Builder",
      "description": "Medieval settlement building and management game design document featuring city planning, resource management, and citizen happiness mechanics.",
      "path": "gdd/settlement/",
      "deployment_type": "Static"
    },
    {
      "group_key": "game_design",
      "group_name": "Game Design",
      "title": "Space Colony Simulator",
      "description": "Space colony management simulator with resource management and exploration systems.",
      "path": "gdd/space_sim/",
      "deployment_type": "Static"
    },
    {
      "group_key": "game_design",
      "group_name": "Game Design",
      "title": "Tactics Game",
      "description": "Turn-based tactical combat game with grid-based movement, character classes, and strategic battle mechanics.",
      "path": "gdd/tactics_game/",
      "deployment_type": "Static"
    },
    {
      "group_key": "tools",
      "group_name": "AI & Development Tools",
      "title": "ComfyUI Integration",
      "description": "AI image generation tool with web interface and downloadable PowerShell scripts for batch processing.",
      "path": "utils/comfyui/",
      "deployment_type": "Static"
    }
  ]
};

// Application State
let appState = {
  currentView: 'dashboard',
  currentProject: null,
  featureRequests: [],
  projectSuggestions: [],
  nextRequestId: 1,
  nextSuggestionId: 1,
  userVotes: new Set(),
  searchTerm: '',
  currentSort: 'votes',
  currentStatusFilter: 'all'
};

// Sample data
function initializeSampleData() {
  // Add some sample feature requests
  appState.featureRequests = [
    {
      id: 1,
      projectTitle: "Meme Generator",
      title: "Add Favicon to Meme Generator",
      description: "The meme generator needs a proper favicon to improve branding and user experience.",
      category: "Enhancement",
      priority: "Medium",
      status: "open",
      votes: 15,
      tags: ["ui", "branding"],
      createdAt: new Date('2025-06-20'),
      comments: []
    },
    {
      id: 2,
      projectTitle: "Dungeon Core",
      title: "Add More Monster Types",
      description: "Expand the monster variety with new creature types including elementals, undead variants, and mythical beasts.",
      category: "New Feature",
      priority: "High",
      status: "in-progress",
      votes: 23,
      tags: ["gameplay", "content"],
      createdAt: new Date('2025-06-18'),
      comments: []
    },
    {
      id: 3,
      projectTitle: "LitRPG Studio",
      title: "Character Sheet Templates",
      description: "Add pre-built character sheet templates for different RPG systems.",
      category: "New Feature",
      priority: "Low",
      status: "open",
      votes: 8,
      tags: ["templates", "rpg"],
      createdAt: new Date('2025-06-22'),
      comments: []
    }
  ];

  appState.projectSuggestions = [
    {
      id: 1,
      title: "Virtual Pet Simulator",
      description: "A web-based virtual pet game with feeding, training, and social features.",
      suggestedGroup: "games",
      rationale: "Would complement the existing game portfolio and appeal to casual gamers.",
      votes: 12,
      createdAt: new Date('2025-06-19')
    }
  ];

  appState.nextRequestId = 4;
  appState.nextSuggestionId = 2;
}

// Utility Functions
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function getProjectGroups() {
  const groups = {};
  projectsData.projects.forEach(project => {
    if (!groups[project.group_key]) {
      groups[project.group_key] = {
        key: project.group_key,
        name: project.group_name,
        projects: []
      };
    }
    groups[project.group_key].projects.push(project);
  });
  return groups;
}

function getRequestsForProject(projectTitle) {
  return appState.featureRequests.filter(request => request.projectTitle === projectTitle);
}

function getFilteredAndSortedRequests(projectTitle) {
  let requests = getRequestsForProject(projectTitle);
  
  // Apply status filter
  if (appState.currentStatusFilter !== 'all') {
    requests = requests.filter(request => request.status === appState.currentStatusFilter);
  }
  
  // Apply sorting
  requests.sort((a, b) => {
    switch (appState.currentSort) {
      case 'votes':
        return b.votes - a.votes;
      case 'date':
        return b.createdAt - a.createdAt;
      case 'priority':
        const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return (priorityOrder[b.priority.toLowerCase()] || 0) - (priorityOrder[a.priority.toLowerCase()] || 0);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
  
  return requests;
}

// DOM Manipulation
function showView(viewName) {
  document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
  document.getElementById(viewName + 'View').classList.add('active');
  
  // Update sidebar
  document.querySelectorAll('.sidebar__item').forEach(item => item.classList.remove('active'));
  const activeItem = document.querySelector(`[data-view="${viewName}"]`);
  if (activeItem) activeItem.classList.add('active');
  
  appState.currentView = viewName;
}

function renderProjectGroups() {
  const container = document.getElementById('projectGroups');
  const groups = getProjectGroups();
  
  container.innerHTML = '';
  
  Object.values(groups).forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'group-section';
    
    const groupTitle = document.createElement('h4');
    groupTitle.textContent = group.name;
    groupTitle.className = 'group-title';
    groupDiv.appendChild(groupTitle);
    
    group.projects.forEach(project => {
      const projectLink = document.createElement('a');
      projectLink.href = '#';
      projectLink.className = 'group-item';
      projectLink.textContent = project.title;
      projectLink.addEventListener('click', (e) => {
        e.preventDefault();
        showProject(project);
      });
      groupDiv.appendChild(projectLink);
    });
    
    container.appendChild(groupDiv);
  });
}

function renderDashboard() {
  // Update statistics
  const totalProjects = projectsData.projects.length;
  const totalRequests = appState.featureRequests.length;
  const openRequests = appState.featureRequests.filter(r => r.status === 'open').length;
  const completedRequests = appState.featureRequests.filter(r => r.status === 'completed').length;
  
  document.getElementById('totalProjects').textContent = totalProjects;
  document.getElementById('totalRequests').textContent = totalRequests;
  document.getElementById('openRequests').textContent = openRequests;
  document.getElementById('completedRequests').textContent = completedRequests;
  
  // Render top requests
  const topRequestsContainer = document.getElementById('topRequests');
  const topRequests = [...appState.featureRequests].sort((a, b) => b.votes - a.votes).slice(0, 5);
  
  if (topRequests.length === 0) {
    topRequestsContainer.innerHTML = '<div class="empty-state">No feature requests yet</div>';
  } else {
    topRequestsContainer.innerHTML = topRequests.map(request => `
      <div class="request-card" onclick="showRequestDetails(${request.id})">
        <div class="request-card__header">
          <h4 class="request-card__title">${request.title}</h4>
          <div class="request-card__votes">
            <div class="vote-count">${request.votes}</div>
            <small>votes</small>
          </div>
        </div>
        <p class="request-card__description">${request.description.substring(0, 100)}...</p>
        <div class="request-card__meta">
          <span class="status status--${request.status === 'open' ? 'info' : request.status === 'completed' ? 'success' : 'warning'}">${request.status}</span>
          <span>${request.projectTitle}</span>
        </div>
      </div>
    `).join('');
  }
  
  // Render recent activity
  const recentActivityContainer = document.getElementById('recentActivity');
  const recentRequests = [...appState.featureRequests].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  
  if (recentRequests.length === 0) {
    recentActivityContainer.innerHTML = '<div class="empty-state">No recent activity</div>';
  } else {
    recentActivityContainer.innerHTML = recentRequests.map(request => `
      <div class="activity-item">
        <div class="activity-item__title">New request: ${request.title}</div>
        <div class="activity-item__meta">${request.projectTitle} • ${formatDate(request.createdAt)}</div>
      </div>
    `).join('');
  }
}

function showProject(project) {
  appState.currentProject = project;
  
  // Update project header
  document.getElementById('projectTitle').textContent = project.title;
  document.getElementById('projectDescription').textContent = project.description;
  document.getElementById('projectType').textContent = project.deployment_type;
  document.getElementById('projectType').className = 'status status--info';
  
  const requestCount = getRequestsForProject(project.title).length;
  document.getElementById('requestCount').textContent = `${requestCount} feature request${requestCount !== 1 ? 's' : ''}`;
  
  renderProjectRequests();
  showView('project');
}

function renderProjectRequests() {
  if (!appState.currentProject) return;
  
  const container = document.getElementById('requestsList');
  const requests = getFilteredAndSortedRequests(appState.currentProject.title);
  
  if (requests.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📝</div><p>No feature requests found for this project</p></div>';
    return;
  }
  
  container.innerHTML = requests.map(request => `
    <div class="request-card" onclick="showRequestDetails(${request.id})">
      <div class="request-card__header">
        <h3 class="request-card__title">${request.title}</h3>
        <div class="request-card__votes">
          <button class="vote-btn ${appState.userVotes.has('up-' + request.id) ? 'voted' : ''}" onclick="event.stopPropagation(); vote(${request.id}, 'up')">▲</button>
          <div class="vote-count">${request.votes}</div>
          <button class="vote-btn ${appState.userVotes.has('down-' + request.id) ? 'voted' : ''}" onclick="event.stopPropagation(); vote(${request.id}, 'down')">▼</button>
        </div>
      </div>
      <p class="request-card__description">${request.description}</p>
      <div class="request-card__meta">
        <span class="status status--${request.status === 'open' ? 'info' : request.status === 'completed' ? 'success' : request.status === 'in-progress' ? 'warning' : 'error'}">${request.status.replace('-', ' ')}</span>
        <span class="request-card__tag priority-${request.priority.toLowerCase()}">${request.priority} Priority</span>
        <span class="request-card__tag">${request.category}</span>
        ${request.tags.map(tag => `<span class="request-card__tag">${tag}</span>`).join('')}
        <span style="margin-left: auto; color: var(--color-text-secondary);">${formatDate(request.createdAt)}</span>
      </div>
    </div>
  `).join('');
}

function renderProjectSuggestions() {
  const container = document.getElementById('suggestionsList');
  
  if (appState.projectSuggestions.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">💡</div><p>No project suggestions yet</p></div>';
    return;
  }
  
  const sortedSuggestions = [...appState.projectSuggestions].sort((a, b) => b.votes - a.votes);
  
  container.innerHTML = sortedSuggestions.map(suggestion => `
    <div class="suggestion-card">
      <div class="suggestion-card__header">
        <div>
          <h3 class="suggestion-card__title">${suggestion.title}</h3>
          <div class="suggestion-card__group">${suggestion.suggestedGroup.charAt(0).toUpperCase() + suggestion.suggestedGroup.slice(1)}</div>
        </div>
        <div class="request-card__votes">
          <button class="vote-btn ${appState.userVotes.has('sug-up-' + suggestion.id) ? 'voted' : ''}" onclick="voteSuggestion(${suggestion.id}, 'up')">▲</button>
          <div class="vote-count">${suggestion.votes}</div>
          <button class="vote-btn ${appState.userVotes.has('sug-down-' + suggestion.id) ? 'voted' : ''}" onclick="voteSuggestion(${suggestion.id}, 'down')">▼</button>
        </div>
      </div>
      <p class="request-card__description">${suggestion.description}</p>
      <div class="request-card__meta">
        <strong>Rationale:</strong> ${suggestion.rationale}
        <span style="margin-left: auto; color: var(--color-text-secondary);">${formatDate(suggestion.createdAt)}</span>
      </div>
    </div>
  `).join('');
}

// Modal Functions
function showModal(title, content) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = content;
  document.getElementById('modal').classList.add('active');
}

function hideModal() {
  document.getElementById('modal').classList.remove('active');
}

function showRequestForm() {
  const content = `
    <form id="requestForm" class="form-grid">
      <div class="form-group">
        <label class="form-label">Title *</label>
        <input type="text" class="form-control" id="requestTitle" required>
      </div>
      <div class="form-group">
        <label class="form-label">Description *</label>
        <textarea class="form-control" id="requestDescription" rows="4" required></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-control" id="requestCategory">
            <option value="Bug Fix">Bug Fix</option>
            <option value="New Feature">New Feature</option>
            <option value="Enhancement">Enhancement</option>
            <option value="UI/UX Improvement">UI/UX Improvement</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-control" id="requestPriority">
            <option value="Low">Low</option>
            <option value="Medium" selected>Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Tags (comma-separated)</label>
        <input type="text" class="form-control" id="requestTags" placeholder="ui, performance, mobile">
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--outline" onclick="hideModal()">Cancel</button>
        <button type="submit" class="btn btn--primary">Submit Request</button>
      </div>
    </form>
  `;
  
  showModal('New Feature Request', content);
  
  document.getElementById('requestForm').addEventListener('submit', handleRequestSubmit);
}

function showProjectSuggestionForm() {
  const content = `
    <form id="suggestionForm" class="form-grid">
      <div class="form-group">
        <label class="form-label">Project Name *</label>
        <input type="text" class="form-control" id="suggestionTitle" required>
      </div>
      <div class="form-group">
        <label class="form-label">Description *</label>
        <textarea class="form-control" id="suggestionDescription" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Suggested Group</label>
        <select class="form-control" id="suggestionGroup">
          <option value="fiction">Fiction Projects</option>
          <option value="apps">Web Applications</option>
          <option value="games">Games & Game Design</option>
          <option value="game_design">Game Design</option>
          <option value="tools">AI & Development Tools</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Rationale *</label>
        <textarea class="form-control" id="suggestionRationale" rows="3" placeholder="Why should this project be added?" required></textarea>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn--outline" onclick="hideModal()">Cancel</button>
        <button type="submit" class="btn btn--primary">Submit Suggestion</button>
      </div>
    </form>
  `;
  
  showModal('Suggest New Project', content);
  
  document.getElementById('suggestionForm').addEventListener('submit', handleSuggestionSubmit);
}

function showRequestDetails(requestId) {
  const request = appState.featureRequests.find(r => r.id === requestId);
  if (!request) return;
  
  const content = `
    <div class="request-details">
      <div class="request-details__meta">
        <span class="status status--${request.status === 'open' ? 'info' : request.status === 'completed' ? 'success' : request.status === 'in-progress' ? 'warning' : 'error'}">${request.status.replace('-', ' ')}</span>
        <span class="request-card__tag priority-${request.priority.toLowerCase()}">${request.priority} Priority</span>
        <span class="request-card__tag">${request.category}</span>
        <span style="margin-left: auto;">${formatDate(request.createdAt)}</span>
      </div>
      <p style="margin: 16px 0;"><strong>Project:</strong> ${request.projectTitle}</p>
      <div style="margin: 24px 0;">
        <h4>Description</h4>
        <p>${request.description}</p>
      </div>
      ${request.tags.length > 0 ? `
        <div style="margin: 24px 0;">
          <h4>Tags</h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${request.tags.map(tag => `<span class="request-card__tag">${tag}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      <div style="margin: 24px 0;">
        <h4>Voting</h4>
        <div class="request-card__votes" style="flex-direction: row; gap: 16px; align-items: center;">
          <button class="vote-btn ${appState.userVotes.has('up-' + request.id) ? 'voted' : ''}" onclick="vote(${request.id}, 'up'); hideModal();">▲ Upvote</button>
          <span class="vote-count" style="font-size: 18px;">${request.votes} votes</span>
          <button class="vote-btn ${appState.userVotes.has('down-' + request.id) ? 'voted' : ''}" onclick="vote(${request.id}, 'down'); hideModal();">▼ Downvote</button>
        </div>
      </div>
    </div>
  `;
  
  showModal(request.title, content);
}

// Event Handlers
function handleRequestSubmit(e) {
  e.preventDefault();
  
  const newRequest = {
    id: appState.nextRequestId++,
    projectTitle: appState.currentProject.title,
    title: document.getElementById('requestTitle').value,
    description: document.getElementById('requestDescription').value,
    category: document.getElementById('requestCategory').value,
    priority: document.getElementById('requestPriority').value,
    status: 'open',
    votes: 0,
    tags: document.getElementById('requestTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
    createdAt: new Date(),
    comments: []
  };
  
  appState.featureRequests.push(newRequest);
  hideModal();
  renderProjectRequests();
  renderDashboard();
}

function handleSuggestionSubmit(e) {
  e.preventDefault();
  
  const newSuggestion = {
    id: appState.nextSuggestionId++,
    title: document.getElementById('suggestionTitle').value,
    description: document.getElementById('suggestionDescription').value,
    suggestedGroup: document.getElementById('suggestionGroup').value,
    rationale: document.getElementById('suggestionRationale').value,
    votes: 0,
    createdAt: new Date()
  };
  
  appState.projectSuggestions.push(newSuggestion);
  hideModal();
  renderProjectSuggestions();
  renderDashboard();
}

function vote(requestId, direction) {
  const request = appState.featureRequests.find(r => r.id === requestId);
  if (!request) return;
  
  const upKey = 'up-' + requestId;
  const downKey = 'down-' + requestId;
  
  if (direction === 'up') {
    if (appState.userVotes.has(upKey)) {
      appState.userVotes.delete(upKey);
      request.votes--;
    } else {
      if (appState.userVotes.has(downKey)) {
        appState.userVotes.delete(downKey);
        request.votes++;
      }
      appState.userVotes.add(upKey);
      request.votes++;
    }
  } else {
    if (appState.userVotes.has(downKey)) {
      appState.userVotes.delete(downKey);
      request.votes++;
    } else {
      if (appState.userVotes.has(upKey)) {
        appState.userVotes.delete(upKey);
        request.votes--;
      }
      appState.userVotes.add(downKey);
      request.votes--;
    }
  }
  
  renderProjectRequests();
  renderDashboard();
}

function voteSuggestion(suggestionId, direction) {
  const suggestion = appState.projectSuggestions.find(s => s.id === suggestionId);
  if (!suggestion) return;
  
  const upKey = 'sug-up-' + suggestionId;
  const downKey = 'sug-down-' + suggestionId;
  
  if (direction === 'up') {
    if (appState.userVotes.has(upKey)) {
      appState.userVotes.delete(upKey);
      suggestion.votes--;
    } else {
      if (appState.userVotes.has(downKey)) {
        appState.userVotes.delete(downKey);
        suggestion.votes++;
      }
      appState.userVotes.add(upKey);
      suggestion.votes++;
    }
  } else {
    if (appState.userVotes.has(downKey)) {
      appState.userVotes.delete(downKey);
      suggestion.votes++;
    } else {
      if (appState.userVotes.has(upKey)) {
        appState.userVotes.delete(upKey);
        suggestion.votes--;
      }
      appState.userVotes.add(downKey);
      suggestion.votes--;
    }
  }
  
  renderProjectSuggestions();
}

function handleSearch() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  appState.searchTerm = searchTerm;
  
  // Filter project groups
  const groups = getProjectGroups();
  const container = document.getElementById('projectGroups');
  container.innerHTML = '';
  
  Object.values(groups).forEach(group => {
    const filteredProjects = group.projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm)
    );
    
    if (filteredProjects.length > 0) {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'group-section';
      
      const groupTitle = document.createElement('h4');
      groupTitle.textContent = group.name;
      groupTitle.className = 'group-title';
      groupDiv.appendChild(groupTitle);
      
      filteredProjects.forEach(project => {
        const projectLink = document.createElement('a');
        projectLink.href = '#';
        projectLink.className = 'group-item';
        projectLink.textContent = project.title;
        projectLink.addEventListener('click', (e) => {
          e.preventDefault();
          showProject(project);
        });
        groupDiv.appendChild(projectLink);
      });
      
      container.appendChild(groupDiv);
    }
  });
}

// Initialize Application
function initializeApp() {
  initializeSampleData();
  renderProjectGroups();
  renderDashboard();
  
  // Event Listeners
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  
  document.querySelectorAll('.sidebar__item[data-view]').forEach(item => {
    item.addEventListener('click', (e) => {
      const view = e.currentTarget.dataset.view;
      showView(view);
      if (view === 'dashboard') renderDashboard();
      if (view === 'suggestions') renderProjectSuggestions();
    });
  });
  
  document.getElementById('newProjectBtn').addEventListener('click', showProjectSuggestionForm);
  document.getElementById('newRequestBtn').addEventListener('click', showRequestForm);
  document.getElementById('suggestProjectBtn').addEventListener('click', showProjectSuggestionForm);
  
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    appState.currentSort = e.target.value;
    renderProjectRequests();
  });
  
  document.getElementById('statusFilter').addEventListener('change', (e) => {
    appState.currentStatusFilter = e.target.value;
    renderProjectRequests();
  });
  
  // Modal event listeners
  document.getElementById('modalClose').addEventListener('click', hideModal);
  document.querySelector('.modal__backdrop').addEventListener('click', hideModal);
  
  // Prevent modal from closing when clicking inside content
  document.querySelector('.modal__content').addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideModal();
    }
  });
}

// Start the application
document.addEventListener('DOMContentLoaded', initializeApp);