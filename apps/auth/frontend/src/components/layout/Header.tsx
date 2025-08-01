
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin } from '../../utils/permissions';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => navigate('/login');
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full bg-white shadow p-4 flex items-center justify-between" role="banner">
      <h1 className="text-xl font-bold text-gray-800">
        <Link to="/">WebHatchery Auth Portal</Link>
      </h1>
      <nav aria-label="Main navigation" className="flex items-center gap-4">
        <Link to="/" className="text-gray-700 hover:text-blue-700 focus:outline-none focus:underline">
          Home
        </Link>
        {isAuthenticated && (
          <Link to="/profile" className="text-gray-700 hover:text-blue-700 focus:outline-none focus:underline">
            Profile
          </Link>
        )}
        {isAuthenticated && user && isAdmin(user) && (
          <Link to="/admin/users" className="text-gray-700 hover:text-blue-700 focus:outline-none focus:underline">
            Admin
          </Link>
        )}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">
                Welcome, {user.first_name}!
              </span>
            )}
            <Button aria-label="Log out" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        ) : (
          <Button aria-label="Log in" onClick={handleLogin}>
            Log In
          </Button>
        )}
      </nav>
    </header>
  );
};

export default React.memo(Header);
