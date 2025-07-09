import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/features/ProtectedRoute';
import './App.css';

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN!;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;

const App: React.FC = () => (
  <Auth0Provider
    domain={auth0Domain}
    clientId={auth0ClientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
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
          </Routes>
        </main>
      </div>
    </Router>
  </Auth0Provider>
);

export default App;