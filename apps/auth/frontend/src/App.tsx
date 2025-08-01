import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import './App.css';

const App: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  
  // Get base path from environment or default to /auth/
  const basename = import.meta.env.VITE_BASE_PATH || '/auth/';

  return (
    <AuthProvider>
      <Router basename={basename}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/login" 
                element={
                  <div className="w-full max-w-md">
                    {showRegister ? (
                      <RegisterForm 
                        onSuccess={() => window.location.href = `${basename}profile`}
                        onLoginClick={() => setShowRegister(false)}
                      />
                    ) : (
                      <LoginForm 
                        onSuccess={() => window.location.href = `${basename}profile`}
                        onRegisterClick={() => setShowRegister(true)}
                      />
                    )}
                  </div>
                } 
              />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              {/* Redirect auth-debug to profile for now */}
              <Route path="/auth-debug" element={<Navigate to="/profile" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;