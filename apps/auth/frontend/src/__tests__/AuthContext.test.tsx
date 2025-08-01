/**
 * AuthContext component tests
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import authApi from '../services/authApi';
import { AuthenticationError, ValidationError } from '../types/errors';

// Mock the auth API
jest.mock('../services/authApi');
const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;

// Mock user data
const mockUser = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  first_name: 'Test',
  last_name: 'User',
  roles: ['user']
};

// Wrapper component for testing
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'password' };
      mockedAuthApi.login.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act
      await act(async () => {
        await result.current.login(credentials);
      });

      // Assert
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
      expect(mockedAuthApi.login).toHaveBeenCalledWith(credentials);
    });

    it('should handle authentication error', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'wrongpassword' };
      const error = new AuthenticationError('INVALID_CREDENTIALS', 'Invalid credentials');
      mockedAuthApi.login.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act & Assert
      await act(async () => {
        await expect(result.current.login(credentials)).rejects.toThrow(AuthenticationError);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe('Invalid credentials');
    });

    it('should handle account lockout', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'password' };
      const error = new AuthenticationError('ACCOUNT_LOCKED', 'Account is locked');
      mockedAuthApi.login.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Spy on console.warn
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Act
      await act(async () => {
        await expect(result.current.login(credentials)).rejects.toThrow(AuthenticationError);
      });

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Account is locked');
      expect(result.current.error).toBe('Account is locked');

      consoleSpy.mockRestore();
    });

    it('should clear session on session invalidating errors', async () => {
      // Arrange
      localStorage.setItem('token', 'existing-token');
      const credentials = { email: 'test@example.com', password: 'password' };
      const error = new AuthenticationError('TOKEN_EXPIRED', 'Token expired');
      mockedAuthApi.login.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act
      await act(async () => {
        await expect(result.current.login(credentials)).rejects.toThrow(AuthenticationError);
      });

      // Assert
      expect(localStorage.getItem('token')).toBeNull();
      expect(result.current.user).toBeNull();
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        first_name: 'Test',
        last_name: 'User'
      };
      mockedAuthApi.register.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act
      await act(async () => {
        await result.current.register(userData);
      });

      // Assert
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
      expect(mockedAuthApi.register).toHaveBeenCalledWith(userData);
    });

    it('should handle validation errors', async () => {
      // Arrange
      const userData = {
        email: 'invalid-email',
        username: '',
        password: '123',
        first_name: '',
        last_name: ''
      };
      const errors = {
        email: ['Invalid email format'],
        username: ['Username is required'],
        password: ['Password must be at least 8 characters long']
      };
      const error = new ValidationError(errors, 'Validation failed');
      mockedAuthApi.register.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Spy on console.warn
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Act
      await act(async () => {
        await expect(result.current.register(userData)).rejects.toThrow(ValidationError);
      });

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Validation errors:', errors);
      expect(result.current.error).toBe('Validation failed');
      expect(result.current.user).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe('logout', () => {
    it('should logout user successfully', () => {
      // Arrange
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      // Set user first
      act(() => {
        // Simulate logged in state
        result.current.login({ email: 'test@example.com', password: 'password' });
      });

      // Act
      act(() => {
        result.current.logout();
      });

      // Assert
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockedAuthApi.logout).toHaveBeenCalled();
    });
  });

  describe('initialization', () => {
    it('should restore user session from token', async () => {
      // Arrange
      localStorage.setItem('token', 'valid-token');
      mockedAuthApi.getCurrentUser.mockResolvedValue(mockUser);

      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Assert
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should clear invalid token on initialization', async () => {
      // Arrange
      localStorage.setItem('token', 'invalid-token');
      mockedAuthApi.getCurrentUser.mockResolvedValue(null);

      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Assert
      expect(localStorage.getItem('token')).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should clear error when clearError is called', () => {
      // Arrange
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Set an error first
      act(() => {
        // Simulate error state
        result.current.setError?.('Some error');
      });

      // Act
      act(() => {
        result.current.clearError();
      });

      // Assert
      expect(result.current.error).toBeNull();
    });
  });
});
