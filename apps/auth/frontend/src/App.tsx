import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './utils/AuthContext';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AuthDebugPage from './pages/AuthDebugPage';
import ProtectedRoute from './components/features/ProtectedRoute';
import './App.css';

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN!;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;

// Debug environment variables
console.log('Auth0 Config:', {
  domain: auth0Domain,
  clientId: auth0ClientId,
  redirectUri: `${window.location.origin}/auth_portal/`,
  currentUrl: window.location.href
});

const App: React.FC = () => (
  <Auth0Provider
    domain={auth0Domain}
    clientId={auth0ClientId}
    authorizationParams={{
      redirect_uri: `${window.location.origin}/auth_portal/`,
    }}
  >
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/auth-debug" element={<AuthDebugPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  </Auth0Provider>
);

export default App;