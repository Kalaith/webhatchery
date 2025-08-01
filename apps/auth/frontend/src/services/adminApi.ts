import axios from 'axios';
import { api } from '../api/api'; // Import the configured axios instance
import type { 
  AdminApiResponse, 
  UsersResponse, 
  RolesResponse, 
  User, 
  UserUpdateData,
  PasswordResetResponse 
} from '../types/admin';

/**
 * Admin API client for user management operations
 */
class AdminApiClient {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<AdminApiResponse<UsersResponse>> {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to fetch users');
      }
      throw new Error('Network error while fetching users');
    }
  }

  /**
   * Get all roles (admin only)
   */
  async getAllRoles(): Promise<AdminApiResponse<RolesResponse>> {
    try {
      const response = await api.get('/admin/roles');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to fetch roles');
      }
      throw new Error('Network error while fetching roles');
    }
  }

  /**
   * Assign role to user (admin only)
   */
  async assignRole(userId: number, roleName: string): Promise<AdminApiResponse<null>> {
    try {
      const response = await api.post('/admin/users/assign-role', {
        user_id: userId,
        role_name: roleName
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to assign role');
      }
      throw new Error('Network error while assigning role');
    }
  }

  /**
   * Remove role from user (admin only)
   */
  async removeRole(userId: number, roleName: string): Promise<AdminApiResponse<null>> {
    try {
      const response = await api.post('/admin/users/remove-role', {
        user_id: userId,
        role_name: roleName
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to remove role');
      }
      throw new Error('Network error while removing role');
    }
  }

  /**
   * Update user information (admin only)
   */
  async updateUser(userId: number, userData: UserUpdateData): Promise<AdminApiResponse<User>> {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to update user');
      }
      throw new Error('Network error while updating user');
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: number): Promise<AdminApiResponse<null>> {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to delete user');
      }
      throw new Error('Network error while deleting user');
    }
  }

  /**
   * Deactivate user (admin only)
   */
  async deactivateUser(userId: number): Promise<AdminApiResponse<null>> {
    try {
      const response = await api.post(`/admin/users/${userId}/deactivate`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to deactivate user');
      }
      throw new Error('Network error while deactivating user');
    }
  }

  /**
   * Reset user password (admin only)
   */
  async resetUserPassword(userId: number): Promise<AdminApiResponse<PasswordResetResponse>> {
    try {
      const response = await api.post(`/admin/users/${userId}/reset-password`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to reset password');
      }
      throw new Error('Network error while resetting password');
    }
  }

  /**
   * Activate user (admin only)
   */
  async activateUser(userId: number): Promise<AdminApiResponse<null>> {
    try {
      const response = await api.post(`/admin/users/${userId}/activate`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || 'Failed to activate user');
      }
      throw new Error('Network error while activating user');
    }
  }
}

// Export singleton instance
export const adminApi = new AdminApiClient();
