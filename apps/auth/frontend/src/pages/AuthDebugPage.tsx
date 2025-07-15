import React from 'react';
import AuthStatusDebugger from '../components/AuthStatusDebugger';

const AuthDebugPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Auth0 Debug Information</h1>
      <p className="text-gray-600 mb-4">
        This page provides detailed information about your authentication status and helps diagnose any issues.
      </p>
      <AuthStatusDebugger />
    </div>
  );
};

export default AuthDebugPage;
