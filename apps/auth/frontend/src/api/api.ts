// API and Auth0 integration logic for the auth portal
// Adapted from SES project
import { useAuth0 } from '@auth0/auth0-react';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/';

let auth0Instance: ReturnType<typeof useAuth0> | null = null;

export const setAuth0Instance = (instance: ReturnType<typeof useAuth0>): void => {
  auth0Instance = instance;
};

export async function getCurrentUser(): Promise<any | null> {
  if (!auth0Instance || !auth0Instance.isAuthenticated) return null;
  const idTokenClaims = await auth0Instance.getIdTokenClaims();
  const idToken = idTokenClaims?.__raw;
  if (!idToken) return null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`
  };
  const response = await fetch(`${API_URL}auth/me`, { method: 'GET', headers });
  if (!response.ok) return null;
  const responseData = await response.json();
  return responseData.data || responseData;
}

export async function verifyAuth0User(): Promise<{ exists: boolean; user?: any; needsSignup: boolean; message: string; debug?: any }> {
  if (!auth0Instance) return { exists: false, needsSignup: true, message: 'Auth0 instance not available' };
  const userEmail = auth0Instance.user?.email;
  if (!userEmail) return { exists: false, needsSignup: true, message: 'No email available from Auth0 user' };
  try {
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.id) {
      return {
        exists: true,
        user: currentUser,
        needsSignup: false,
        message: 'User found in database'
      };
    }
  } catch (error) {
    return { exists: false, needsSignup: true, message: 'User not found in database - signup required' };
  }
  return { exists: false, needsSignup: true, message: 'User not found in database - signup required' };
}
