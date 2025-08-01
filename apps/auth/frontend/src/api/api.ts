// JWT-based API integration for the auth portal
import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 errors for non-admin routes or if user is truly not authenticated
    if (error.response?.status === 401) {
      const isAdminRequest = error.config?.url?.includes('/admin/');
      
      // For admin requests, the user might be authenticated but not authorized (403 should be used but some APIs return 401)
      // Don't clear token and redirect for admin requests - let the component handle it
      if (!isAdminRequest) {
        localStorage.removeItem('token');
        const basePath = import.meta.env.VITE_BASE_PATH || '/auth/';
        window.location.href = `${basePath}login`;
      }
    }
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export { api };

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  };
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive: boolean;
  roles: string[];
  lastLoginAt?: string;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Login failed');
  }
}

export async function register(userData: RegisterData): Promise<LoginResponse> {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Registration failed');
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await api.get('/auth/me');
    return response.data.user || response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to get current user');
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.warn('Logout API call failed:', error);
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await api.get('/admin/users');
    return response.data.users || response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to get users');
  }
}

export async function updateUser(userId: number, userData: Partial<User>): Promise<User> {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data.user || response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to update user');
  }
}

export async function deleteUser(userId: number): Promise<void> {
  try {
    await api.delete(`/admin/users/${userId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to delete user');
  }
}

export async function assignRole(userId: number, roleName: string): Promise<void> {
  try {
    await api.post(`/admin/users/${userId}/roles`, { roleName });
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to assign role');
  }
}

export async function removeRole(userId: number, roleName: string): Promise<void> {
  try {
    await api.delete(`/admin/users/${userId}/roles/${roleName}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to remove role');
  }
}
