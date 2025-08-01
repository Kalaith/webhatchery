/**
 * Authentication API Client
 * Handles all authentication-related API requests
 */
import axios from 'axios';
import type { AuthUser, LoginRequest, RegisterRequest, ApiResponse } from '../types/auth';

// Base API URL from environment variables with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Add auth token to requests if available
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Custom error handler to provide more descriptive error messages
 */
const handleApiError = (error: unknown): never => {
  if (import.meta.env.DEV) {
    console.error('API Error:', error);
  }
  
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
      throw {
        code: 'CONNECTION_ERROR',
        message: 'Unable to connect to the server. Please check your connection or try again later.',
      };
    }
    
    if (error.response?.data?.error) {
      throw error.response.data.error;
    }
    
    switch (error.response?.status) {
      case 401:
        throw {
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials. Please check your email and password.',
        };
      case 403:
        throw {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action.',
        };
      case 404:
        throw {
          code: 'NOT_FOUND',
          message: 'The requested resource was not found.',
        };
      case 422:
        throw {
          code: 'VALIDATION_ERROR',
          message: 'Please check your input and try again.',
        };
      case 500:
        throw {
          code: 'SERVER_ERROR',
          message: 'An internal server error occurred. Please try again later.',
        };
      default:
        throw {
          code: 'UNKNOWN_ERROR',
          message: `Error ${error.response?.status || ''}: Something went wrong.`,
        };
    }
  }
  
  throw {
    code: 'CLIENT_ERROR',
    message: 'An unexpected error occurred. Please try again.',
  };
};

/**
 * Login user with credentials
 */
export const login = async (credentials: LoginRequest): Promise<AuthUser> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthUser>>('/login', credentials);
    
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Register new user
 */
export const register = async (userData: RegisterRequest): Promise<AuthUser> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthUser>>('/register', userData);
    
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get current authenticated user info
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const response = await apiClient.get<ApiResponse<AuthUser>>('/me');
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
      return null;
    }
    
    if (axios.isAxiosError(error) && !error.response) {
      console.warn('Connection issue during auth check:', error.message);
      return null;
    }
    
    return handleApiError(error);
  }
};

/**
 * Check server connectivity
 */
export const checkServerConnectivity = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_URL}/health`, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Test health endpoints for debugging
 */
export const testHealthEndpoints = async (): Promise<any> => {
  const baseUrl = API_URL.replace('/api', ''); // Remove /api from base URL
  const results = {
    rootHealth: null as any,
    debugRoute: null as any,
    apiHealth: null as any,
    errors: [] as string[]
  };

  try {
    const rootHealthResponse = await axios.get(`${baseUrl}/health`, { timeout: 5000 });
    results.rootHealth = rootHealthResponse.data;
  } catch (error: any) {
    results.errors.push(`Root health failed: ${error.message || 'Unknown error'}`);
  }

  try {
    const debugResponse = await axios.get(`${baseUrl}/debug`, { timeout: 5000 });
    results.debugRoute = debugResponse.data;
  } catch (error: any) {
    results.errors.push(`Debug route failed: ${error.message || 'Unknown error'}`);
  }

  try {
    const apiHealthResponse = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    results.apiHealth = apiHealthResponse.data;
  } catch (error: any) {
    results.errors.push(`API health failed: ${error.message || 'Unknown error'}`);
  }

  return results;
};

/**
 * Logout user (client-side only)
 */
export const logout = (): void => {
  localStorage.removeItem('token');
};

export default {
  login,
  register,
  getCurrentUser,
  logout,
  checkServerConnectivity,
  testHealthEndpoints,
};
