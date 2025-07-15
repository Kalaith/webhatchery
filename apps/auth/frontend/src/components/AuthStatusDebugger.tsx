import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../utils/AuthContext';

/**
 * AuthStatusDebugger Component
 * 
 * This component displays detailed authentication information for debugging purposes.
 * It helps identify issues with Auth0 integration, particularly with social logins
 * and email mismatches between Auth0 accounts and database records.
 */
const AuthStatusDebugger: React.FC = () => {
  const auth0 = useAuth0();
  const { isAuthenticated, user, isLoading, error } = auth0;
  const { userInfo, debugInfo, checkingUserStatus } = useAuth();

  // Extract social login info from the debug data
  const isSocialLogin = debugInfo.isSocialLogin;
  const provider = debugInfo.auth0Provider;

  return (
    <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h2 className="text-lg font-bold mb-4">Authentication Status Debugger</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Auth0 Status:</h3>
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
              <span className="font-semibold">Error:</span>{' '}
              <span className={error ? 'text-red-600' : 'text-green-600'}>
                {error ? error.message : 'None'}
              </span>
            </li>
          </ul>
        </div>
        {/* Social Login Info */}
        {isAuthenticated && isSocialLogin && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-medium mb-2 text-blue-800">Social Login Detected</h3>
            <p className="text-sm text-blue-700 mb-2">
              You're signed in with <strong>{provider}</strong>. Social logins may not always provide an email address.
            </p>
            {!debugInfo.auth0Email && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <p className="font-semibold">⚠️ No email from {provider}</p>
                <p>
                  Your social login didn't provide an email address, which is needed to link to your account.
                  Consider using a different login method or contact support.
                </p>
              </div>
            )}
          </div>
        )}
        {user && (
          <div>
            <h3 className="font-medium mb-2">Auth0 User Info:</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>
                <span className="font-semibold">Email:</span>{' '}
                <span className={!user.email ? 'text-amber-600 font-bold' : ''}>
                  {user.email || '⚠️ Not provided by social login'}
                </span>
              </li>
              <li>
                <span className="font-semibold">Name:</span> {user.name || 'Not provided'}
              </li>
              <li>
                <span className="font-semibold">Sub:</span> {user.sub || 'Not provided'}
              </li>
            </ul>
          </div>
        )}
        <div>
          <h3 className="font-medium mb-2">User Verification:</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <span className="font-semibold">Status:</span>{' '}
              <span className={checkingUserStatus ? 'text-amber-600' : 'text-green-600'}>
                {checkingUserStatus ? 'Checking...' : 'Completed'}
              </span>
            </li>
            <li>
              <span className="font-semibold">State:</span>{' '}
              <span 
                className={
                  debugInfo.verificationState === 'user_exists' 
                    ? 'text-green-600' 
                    : debugInfo.verificationState === 'verification_error'
                      ? 'text-red-600'
                      : 'text-amber-600'
                }
              >
                {debugInfo.verificationState}
              </span>
            </li>
            {debugInfo.lastError && (
              <li>
                <span className="font-semibold">Error:</span>{' '}
                <span className="text-red-600">{debugInfo.lastError}</span>
              </li>
            )}
          </ul>
        </div>
        {userInfo && (
          <div>
            <h3 className="font-medium mb-2">Database User Info:</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>
                <span className="font-semibold">ID:</span> {userInfo.id}
              </li>
              <li>
                <span className="font-semibold">Email:</span> {userInfo.email}
              </li>
              <li>
                <span className="font-semibold">Name:</span> {userInfo.firstName} {userInfo.lastName}
              </li>
              <li>
                <span className="font-semibold">Membership:</span> {userInfo.membershipType}
              </li>
            </ul>
          </div>
        )}
        {debugInfo.auth0Email && debugInfo.databaseEmail && (
          <div>
            <h3 className="font-medium mb-2">Email Comparison:</h3>
            <div className="p-3 rounded text-sm">
              <div className="mb-2">
                <span className="font-semibold">Auth0 Email:</span> {debugInfo.auth0Email}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Database Email:</span> {debugInfo.databaseEmail}
              </div>
              <div className={debugInfo.emailsMatch ? 'text-green-600' : 'text-red-600 font-bold'}>
                {debugInfo.emailsMatch 
                  ? '✓ Emails match exactly' 
                  : '✗ Email mismatch detected - this could be the source of your problem!'}
              </div>
              {!debugInfo.emailsMatch && (
                <div className="mt-2 text-gray-600">
                  <p>
                    The emails may differ in case (uppercase/lowercase) or have extra spaces.
                    Check your database to ensure the email matches exactly what Auth0 returns.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Social Login Recommendations */}
        {isAuthenticated && isSocialLogin && !userInfo && (
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded">
            <h3 className="font-medium mb-2 text-indigo-800">Recommendations</h3>
            <ul className="list-disc pl-6 text-sm text-indigo-700 space-y-2">
              <li>
                Complete the signup form to create an account in our system that will be linked to your 
                {' '}{provider} login.
              </li>
              {!debugInfo.auth0Email && (
                <li>
                  Consider linking an email-based login method to your account for more reliable access.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthStatusDebugger;
