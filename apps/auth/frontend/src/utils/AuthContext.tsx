
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { verifyAuth0User, setAuth0Instance } from '../api/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userInfo: any | null;
  checkingUserStatus: boolean;
  error: string | null;
  debugInfo: {
    auth0Email?: string;
    auth0Name?: string;
    auth0Sub?: string;
    auth0Provider?: string;
    databaseEmail?: string;
    emailsMatch?: boolean;
    verificationState: string;
    lastError?: string;
    isSocialLogin?: boolean;
    logMessages: string[];
  };
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userInfo: null,
  checkingUserStatus: true,
  error: null,
  debugInfo: {
    verificationState: 'not_started',
    logMessages: []
  }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth0 = useAuth0();
  const { isAuthenticated, isLoading, user } = auth0;
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [checkingUserStatus, setCheckingUserStatus] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<AuthContextType['debugInfo']>({
    verificationState: 'not_started',
    logMessages: []
  });

  useEffect(() => {
    setAuth0Instance(auth0);
    console.log('Auth0 instance set:', { isAuthenticated, isLoading, user: user?.email });
  }, [auth0, isAuthenticated, isLoading, user]);

  useEffect(() => {
    console.log('AuthContext: Auth state changed', {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      userEmail: user?.email,
      currentUrl: window.location.href
    });
    
    if (isAuthenticated && user && !isLoading) {
      console.log('AuthContext: User authenticated, starting verification');
      setDebugInfo(prev => ({
        ...prev,
        auth0Email: user.email,
        auth0Name: user.name,
        auth0Sub: user.sub,
        isSocialLogin: user.sub?.includes('|') || false,
        auth0Provider: user.sub?.includes('|') ? user.sub.split('|')[0] : 'auth0',
        verificationState: 'verification_started'
      }));
      setCheckingUserStatus(true);
      verifyAuth0User()
        .then(verificationResult => {
          console.log('AuthContext: Verification result', verificationResult);
          setDebugInfo(prev => ({
            ...prev,
            databaseEmail: verificationResult.user?.email,
            emailsMatch: user.email ? verificationResult.user?.email === user.email : false,
            verificationState: verificationResult.exists ? 'user_exists' : 'user_not_found'
          }));
          if (verificationResult.exists && verificationResult.user) {
            setUserInfo(verificationResult.user);
          }
        })
        .catch(err => {
          console.error('AuthContext: Verification error', err);
          setDebugInfo(prev => ({
            ...prev,
            verificationState: 'verification_error',
            lastError: err instanceof Error ? err.message : String(err)
          }));
          setError(err instanceof Error ? err.message : String(err));
        })
        .finally(() => {
          setCheckingUserStatus(false);
        });
    } else if (!isLoading) {
      setDebugInfo(prev => ({
        ...prev,
        verificationState: isAuthenticated ? 'waiting_for_user_data' : 'not_authenticated'
      }));
      setCheckingUserStatus(false);
    }
  }, [isAuthenticated, user, isLoading]);

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading: isLoading || checkingUserStatus,
    userInfo,
    checkingUserStatus,
    error,
    debugInfo
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};