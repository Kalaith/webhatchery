import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="mb-4">You must be logged in to view your profile.</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate('/login')}
        >
          Log In
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <section className="w-full max-w-md py-8 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full">
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {user?.first_name} {user?.last_name}
          </h2>
          <p className="text-gray-600">@{user?.username}</p>
          <p className="text-gray-700">{user?.email}</p>
        </div>

        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2">Account Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Role:</span>
                <span className="ml-2 capitalize">{user?.role}</span>
              </div>
              <div>
                <span className="text-gray-500">ID:</span>
                <span className="ml-2 font-mono text-xs">{user?.id}</span>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-6 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition duration-200"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
