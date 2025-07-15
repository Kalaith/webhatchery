
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../utils/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { loginWithRedirect, logout, user } = useAuth0();
  const { isAuthenticated } = useAuth();

  const handleLogin = () => loginWithRedirect();
  const handleLogout = () => logout();

  return (
    <header className="w-full bg-white shadow p-4 flex items-center justify-between" role="banner">
      <h1 className="text-xl font-bold text-gray-800">
        <Link to="/">Auth0 Demo App</Link>
      </h1>
      <nav aria-label="Main navigation" className="flex items-center gap-4">
        <Link to="/" className="text-gray-700 hover:text-blue-700 focus:outline-none focus:underline">
          Home
        </Link>
          <Link to="/auth-debug" className="text-gray-700 hover:text-purple-700 focus:outline-none focus:underline">
              Auth Debug
            </Link>
        {isAuthenticated && (
          <>
            <Link to="/profile" className="text-gray-700 hover:text-blue-700 focus:outline-none focus:underline">
              Profile
            </Link>

          </>
        )}
        {isAuthenticated ? (
          <Button aria-label="Log out" onClick={handleLogout}>
            Log Out
          </Button>
        ) : (
          <Button aria-label="Log in" onClick={handleLogin}>
            Log In
          </Button>
        )}
        {isAuthenticated && user?.picture && (
          <img
            src={user.picture}
            alt={user.name || 'User avatar'}
            className="w-8 h-8 rounded-full border ml-2"
          />
        )}
      </nav>
    </header>
  );
};

export default React.memo(Header);
