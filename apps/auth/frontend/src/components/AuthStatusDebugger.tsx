import React from 'react';
import { useAuth } from '../utils/AuthContext';

/**
 * AuthStatusDebugger Component
 * 
 * This component displays detailed authentication information for debugging purposes.
 * It helps identify issues with JWT authentication and user data.
 */
const AuthStatusDebugger: React.FC = () => {
  const { isAuthenticated, isLoading, user, error } = useAuth();

  const token = localStorage.getItem('authToken');

  return (
    <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h2 className="text-lg font-bold mb-4">Authentication Status Debugger</h2>
      <div className="space-y-4">
        
        {/* Authentication Status */}
        <div>
          <h3 className="font-medium mb-2">Authentication Status:</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <span className="font-semibold">Authenticated:</span>{' '}
              <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {isAuthenticated ? 'Yes' : 'No'}
              </span>
            </li>
            <li>
              <span className="font-semibold">Loading:</span>{' '}
              <span className={isLoading ? 'text-amber-600' : 'text-green-600'}>
                {isLoading ? 'Yes' : 'No'}
              </span>
            </li>
            <li>
              <span className="font-semibold">Has Token:</span>{' '}
              <span className={token ? 'text-green-600' : 'text-red-600'}>
                {token ? 'Yes' : 'No'}
              </span>
            </li>
            <li>
              <span className="font-semibold">Error:</span>{' '}
              <span className={error ? 'text-red-600' : 'text-green-600'}>
                {error || 'None'}
              </span>
            </li>
          </ul>
        </div>

        {/* Token Info */}
        {token && (
          <div>
            <h3 className="font-medium mb-2">JWT Token Info:</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>
                <span className="font-semibold">Token (first 20 chars):</span>{' '}
                <code className="bg-gray-200 px-1 rounded text-xs">
                  {token.substring(0, 20)}...
                </code>
              </li>
              <li>
                <span className="font-semibold">Token Length:</span> {token.length} characters
              </li>
            </ul>
          </div>
        )}

        {/* User Info */}
        {user && (
          <div>
            <h3 className="font-medium mb-2">User Information:</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>
                <span className="font-semibold">ID:</span> {user.id}
              </li>
              <li>
                <span className="font-semibold">Email:</span> {user.email}
              </li>
              <li>
                <span className="font-semibold">Username:</span> {user.username}
              </li>
              <li>
                <span className="font-semibold">Name:</span> {user.firstName} {user.lastName}
              </li>
              <li>
                <span className="font-semibold">Active:</span>{' '}
                <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                  {user.isActive ? 'Yes' : 'No'}
                </span>
              </li>
              <li>
                <span className="font-semibold">Roles:</span>{' '}
                <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                  {user.roles.join(', ') || 'None'}
                </span>
              </li>
              {user.avatarUrl && (
                <li>
                  <span className="font-semibold">Avatar:</span>{' '}
                  <img src={user.avatarUrl} alt="User Avatar" className="inline-block w-6 h-6 rounded-full ml-2" />
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Debug Actions */}
        <div>
          <h3 className="font-medium mb-2">Debug Actions:</h3>
          <div className="space-x-2">
            <button
              onClick={() => console.log('Auth State:', { isAuthenticated, isLoading, user, error, token })}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Log Auth State
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                window.location.reload();
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Clear Token & Reload
            </button>
          </div>
        </div>

        {/* JWT Token Details (for development) */}
        {import.meta.env.DEV && token && (
          <div>
            <h3 className="font-medium mb-2">JWT Token Details (Development Only):</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  try {
                    const parts = token.split('.');
                    const header = JSON.parse(atob(parts[0]));
                    const payload = JSON.parse(atob(parts[1]));
                    console.log('JWT Header:', header);
                    console.log('JWT Payload:', payload);
                  } catch (e) {
                    console.error('Failed to decode JWT:', e);
                  }
                }}
                className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
              >
                Decode JWT (Check Console)
              </button>
            </div>
          </div>
        )}

        {/* Raw Data (for development) */}
        {import.meta.env.DEV && (
          <div>
            <h3 className="font-medium mb-2">Raw Data (Development Only):</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify({ isAuthenticated, isLoading, user, error, hasToken: !!token }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthStatusDebugger;
