/**
 * Admin-related TypeScript type definitions
 */

export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'moderator'; // Legacy role field
  roles: string[]; // New roles array
  is_active: boolean;
  last_login_at?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  is_active: boolean;
  user_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserUpdateData {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
}

export interface AdminApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

export interface UsersResponse {
  users: User[];
  total_count: number;
}

export interface RolesResponse {
  roles: Role[];
}

export interface RoleAssignmentRequest {
  user_id: number;
  role_name: string;
}

export interface PasswordResetResponse {
  success: boolean;
  temporary_password?: string;
  message: string;
}
