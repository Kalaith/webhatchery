# React TypeScript Frontend Implementation Guide for StoryForge

This document outlines a strategy for migrating the existing StoryForge JavaScript application to a React TypeScript frontend. This transition will enhance maintainability, scalability, and developer experience by leveraging React's component-based architecture and TypeScript's static typing.

## 1. Project Setup

We recommend using Vite for a fast and lightweight development experience, or Create React App for a more opinionated setup.

```bash
# Using Vite
npm create vite@latest story-forge-react -- --template react-ts
cd story-forge-react
npm install

# Using Create React App
npx create-react-app story-forge-react --template typescript
cd story-forge-react
npm install
```

### Recommended Folder Structure:

```
src/
├── components/       # Reusable UI components (e.g., Button, Modal, StoryCard)
├── pages/            # Top-level components representing different views (e.g., HomePage, StoryReadingPage, DashboardPage)
├── services/         # API calls and data fetching logic (replaces js/api.js)
├── hooks/            # Custom React Hooks for reusable logic (e.g., useAuth, useStories)
├── context/          # React Context for global state management (e.g., AuthContext, StoryContext)
├── types/            # TypeScript interfaces and types
├── utils/            # Utility functions (e.g., date formatting, validation)
├── App.tsx           # Main application component
├── main.tsx          # Entry point (ReactDOM.render)
└── index.css         # Global styles or imports for component-specific styles
```

## 2. TypeScript Type Definitions (`src/types/`)

Define interfaces for your data models to ensure type safety throughout the application.

```typescript
// src/types/index.ts

export interface User {
  id: number;
  username: string;
  email: string;
  joinDate: string;
  storiesCreated: number;
  contributions: number;
}

export interface Paragraph {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

export type AccessLevel = "anyone" | "approved_only" | "specific_users";

export interface Story {
  id: number;
  title: string;
  genre: string;
  description: string;
  createdBy: number; // User ID
  createdDate: string;
  accessLevel: AccessLevel;
  requireExamples: boolean;
  blockedUsers: number[]; // User IDs
  approvedContributors: number[]; // User IDs
  paragraphs: Paragraph[];
}

export interface WritingSample {
  userId: number;
  storyId: number;
  content: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}
```

## 3. Data Management (`js/data.js` & `js/api.js` -> `src/services/` & `src/context/`)

### `src/services/apiService.ts`

The `API` class from `js/api.js` should be refactored into a service layer. Initially, it can still use the mock data, but it should be designed to easily switch to actual `fetch` or `axios` calls to a backend API later.

```typescript
// src/services/apiService.ts
import { data } from '../data/mockData'; // Assuming you move data.js content to src/data/mockData.ts
import { Story, User, WritingSample } from '../types';

class ApiService {
  private users: User[] = data.users;
  private stories: Story[] = data.stories;
  private genres: string[] = data.genres;
  private writingSamples: WritingSample[] = data.writingSamples;

  getUsers(): User[] {
    return this.users;
  }

  getUser(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find(u => u.username === username);
  }

  getStories(): Story[] {
    return this.stories;
  }

  getStory(id: number): Story | undefined {
    return this.stories.find(s => s.id === id);
  }

  getGenres(): string[] {
    return this.genres;
  }

  getWritingSamplesForStory(storyId: number): WritingSample[] {
    return this.writingSamples.filter(s => s.storyId === storyId);
  }

  createStory(storyData: Omit<Story, 'id' | 'createdDate' | 'blockedUsers' | 'approvedContributors' | 'paragraphs'> & { author: string; firstParagraph: string }): Story {
    const newStory: Story = {
      ...storyData,
      id: this.stories.length + 1,
      createdDate: new Date().toISOString().split('T')[0],
      blockedUsers: [],
      approvedContributors: [],
      paragraphs: [{
        id: 1,
        author: storyData.author,
        content: storyData.firstParagraph,
        timestamp: new Date().toISOString()
      }]
    };
    this.stories.push(newStory);
    return newStory;
  }

  addParagraph(storyId: number, paragraphData: Omit<Paragraph, 'id' | 'timestamp'>): Paragraph | null {
    const story = this.getStory(storyId);
    if (story) {
      const newParagraph: Paragraph = {
        ...paragraphData,
        id: story.paragraphs.length + 1,
        timestamp: new Date().toISOString()
      };
      story.paragraphs.push(newParagraph);
      return newParagraph;
    }
    return null;
  }

  addWritingSample(sampleData: Omit<WritingSample, 'status' | 'submittedDate'>): WritingSample {
    const newSample: WritingSample = {
      ...sampleData,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    this.writingSamples.push(newSample);
    return newSample;
  }

  updateStory(storyId: number, updates: Partial<Story>): Story | null {
    const story = this.getStory(storyId);
    if (story) {
      Object.assign(story, updates);
      return story;
    }
    return null;
  }

  updateWritingSample(userId: number, storyId: number, updates: Partial<WritingSample>): WritingSample | null {
    const sample = this.writingSamples.find(s => s.userId === userId && s.storyId === storyId);
    if (sample) {
      Object.assign(sample, updates);
      return sample;
    }
    return null;
  }
}

export const apiService = new ApiService();
```

### `src/context/AuthContext.tsx` & `src/context/StoryContext.tsx`

Global application state (like `currentUser`, `currentStory`) should be managed using React Context or a state management library.

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/apiService';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (username: string) => {
    const user = apiService.getUserByUsername(username);
    if (user) {
      setCurrentUser(user);
      // In a real app, you'd handle session storage/cookies here
    } else {
      console.error('User not found');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    // Clear session storage/cookies here
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 4. UI Components (`index.html` & `js/ui.js` -> `src/components/` & `src/pages/`)

Break down the HTML structure into smaller, reusable React components. The rendering logic from `ui.js` will be distributed among these components.

### Example: `LoginModal.tsx`

```typescript
// src/components/LoginModal.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [selectedUsername, setSelectedUsername] = useState<string>('');

  const users = apiService.getUsers(); // Get users from API service

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsername) {
      login(selectedUsername);
      onClose(); // Close modal on successful login
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal"> {/* The base modal styling */}
      <div className="modal-content">
        <div className="modal-header">
          <h3>Sign In</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <select
                className="form-control"
                id="username"
                required
                value={selectedUsername}
                onChange={(e) => setSelectedUsername(e.target.value)}
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.username}>{user.username}</option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary btn--full-width">Sign In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
```

### Example: `StoryCard.tsx`

```typescript
// src/components/StoryCard.tsx
import React from 'react';
import { Story } from '../types';
import { apiService } from '../services/apiService';

interface StoryCardProps {
  story: Story;
  onClick: (story: Story) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
  const author = apiService.getUser(story.createdBy);

  const accessLevelClass = {
    'anyone': 'access-level-badge--anyone',
    'approved_only': 'access-level-badge--approved',
    'specific_users': 'access-level-badge--specific'
  }[story.accessLevel];

  const accessLevelText = {
    'anyone': 'Open',
    'approved_only': 'Approval Required',
    'specific_users': 'Restricted'
  }[story.accessLevel];

  return (
    <div className="story-card" onClick={() => onClick(story)}>
      <div className="story-card__header">
        <h3 className="story-card__title">{story.title}</h3>
        <div className="story-card__meta">
          <span className="story-card__genre">{story.genre}</span>
          <span className="story-card__author">by {author ? author.username : 'Unknown'}</span>
          <span className={`access-level-badge ${accessLevelClass}`}>{accessLevelText}</span>
        </div>
      </div>
      <p className="story-card__description">{story.description}</p>
      <div className="story-card__footer">
        <div className="story-card__stats">
          <span>{story.paragraphs.length} paragraphs</span>
          <span>{new Set(story.paragraphs.map(p => p.author)).size} contributors</span>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
```

## 5. Event Handling (`js/events.js`)

Event listeners will be directly attached to JSX elements using React's synthetic event system. The logic from `events.js` will be moved into component event handlers or custom hooks.

```typescript
// Example from LoginModal.tsx:
// <button className="modal-close" onClick={onClose}>&times;</button>
// <form onSubmit={handleSubmit}>
```

## 6. Application Logic (`js/app.js` -> `src/App.tsx` & Custom Hooks)

The main `StoryForge` class logic will be distributed:

*   **Global State**: `currentUser`, `currentStory` will be managed by React Context (e.g., `AuthContext`, `StoryContext`).
*   **Utility Functions**: `canUserContribute`, `hasApprovedSample` can be simple utility functions in `src/utils/` or custom hooks in `src/hooks/`.
*   **Routing**: Implement client-side routing using a library like React Router (`react-router-dom`).

```typescript
// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import StoryReadingPage from './pages/StoryReadingPage';
import DashboardPage from './pages/DashboardPage';
import CreateStoryPage from './pages/CreateStoryPage';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast'; // Assuming you create a Toast component

const AppContent: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  // This would be a global toast function passed down via context or a custom hook
  const showAppToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container flex items-center justify-between">
          <div className="navbar__brand">
            <Link to="/" className="brand-title">StoryForge</Link>
          </div>
          <div className="navbar__actions">
            <button className="btn btn--secondary btn--sm" id="searchBtn">Search</button>
            <div className="user-menu" id="userMenu">
              {!currentUser ? (
                <button className="btn btn--primary btn--sm" onClick={() => setIsLoginModalOpen(true)}>Sign In</button>
              ) : (
                <div className="user-profile">
                  <span className="user-name">{currentUser.username}</span>
                  <Link to="/dashboard" className="btn btn--secondary btn--sm">Dashboard</Link>
                  <button className="btn btn--outline btn--sm" onClick={logout}>Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="main-container">
        <Routes>
          <Route path="/" element={<HomePage showToast={showAppToast} />} />
          <Route path="/story/:id" element={<StoryReadingPage showToast={showAppToast} />} />
          <Route path="/create-story" element={<CreateStoryPage showToast={showAppToast} />} />
          <Route path="/dashboard/*" element={<DashboardPage showToast={showAppToast} />} />
          {/* Add other routes as needed */}
        </Routes>
      </main>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
};

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
```

## 7. Styling

The existing `style.css` can be largely reused. You can import it directly into `src/index.css` or `src/App.tsx`. For component-specific styles, consider:

*   **CSS Modules**: `ComponentName.module.css` for scoped CSS.
*   **Styled Components / Emotion**: CSS-in-JS for dynamic styles.
*   **Tailwind CSS**: Utility-first CSS framework.

Ensure that the `.hidden` class is correctly defined in your CSS to `display: none;` and that it has sufficient specificity to override other display properties when applied.

```css
/* style.css (or index.css) */
/* ... existing styles ... */

/* Ensure .hidden is at the end or has higher specificity */
.hidden {
  display: none;
}

/* For modals, ensure base modal is flex when not hidden */
.modal {
  /* ... other modal styles ... */
  display: flex; /* Default display for the modal when visible */
  align-items: center;
  justify-content: center;
}

/* When hidden, it should override */
.modal.hidden {
  display: none;
}
```

## 8. Migration Steps (High-Level Checklist)

1.  **Initialize New Project**: Use Vite or Create React App with TypeScript.
2.  **Copy Static Assets**: Move `style.css` and any other assets (like fonts) to the new project's `public` or `src` directory.
3.  **Define Types**: Create all necessary TypeScript interfaces in `src/types/`.
4.  **Refactor API Service**: Move `data.js` content to `src/data/mockData.ts` and refactor `js/api.js` into `src/services/apiService.ts`.
5.  **Implement Contexts**: Create `AuthContext` and `StoryContext` (or a single `AppContext`) in `src/context/` to manage global state.
6.  **Break Down UI into Components**:
    *   Start with atomic components (e.g., `Button`, `Input`, `StoryCard`).
    *   Then build larger components and pages (`HomePage`, `LoginModal`, `DashboardPage`).
    *   Distribute the rendering logic from `js/ui.js` into these components.
7.  **Integrate Event Handling**: Replace `js/events.js` logic with direct event handlers in JSX.
8.  **Implement Routing**: Set up `react-router-dom` in `App.tsx` to manage navigation between pages.
9.  **Refactor CSS**: Adapt existing CSS or choose a new styling methodology. Ensure `hidden` class works as expected.
10. **Testing**: Write React Testing Library tests for components and integration tests for pages.

## Conclusion

Migrating StoryForge to React and TypeScript will provide a more robust, scalable, and maintainable codebase. By following a component-based approach, defining clear types, and centralizing state management, future development and feature additions will be significantly streamlined.
