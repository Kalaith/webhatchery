import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="mb-4">You must be logged in to view your profile.</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => loginWithRedirect()}
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <section className="w-full max-w-md py-8 flex flex-col items-center">
      <img
        src={user?.picture}
        alt={user?.name}
        className="w-24 h-24 rounded-full mb-4 border"
      />
      <h2 className="text-xl font-semibold mb-2">{user?.name}</h2>
      <p className="mb-2 text-gray-700">{user?.email}</p>
      <button
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        onClick={() => logout()}
      >
        Log Out
      </button>
    </section>
  );
};

export default ProfilePage;
