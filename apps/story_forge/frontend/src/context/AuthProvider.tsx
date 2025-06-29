import React, { useState, ReactNode } from 'react';
import type { User } from '../types';
import { apiService } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (username: string) => {
    const user = apiService.getUserByUsername(username);
    if (user) {
      setCurrentUser(user);
      // In a real app, you'd handle session storage/cookies here
    } else {
      console.error('User not found');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    // Clear session storage/cookies here
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
