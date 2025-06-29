import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import StoryReadingPage from './pages/StoryReadingPage';
import DashboardPage from './pages/DashboardPage';
import CreateStoryPage from './pages/CreateStoryPage';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';
import WritingPage from './pages/WritingPage'; // New import
import StoryManagementPage from './pages/StoryManagementPage'; // New import

const AppContent: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

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
          <Route path="/write/:id" element={<WritingPage showToast={showAppToast} />} /> {/* New Route */}
          <Route path="/manage-story/:id" element={<StoryManagementPage showToast={showAppToast} />} /> {/* New Route */}
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