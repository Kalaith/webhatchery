import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User } from '../types';
import { apiService } from '../services/apiService';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};