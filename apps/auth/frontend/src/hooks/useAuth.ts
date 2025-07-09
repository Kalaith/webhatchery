import { useAuth0 } from '@auth0/auth0-react';

export const useAuth = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0();

  return {
    login: () => loginWithRedirect(),
    logout: () => logout(),
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};
