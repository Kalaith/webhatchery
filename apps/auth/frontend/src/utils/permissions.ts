/**
 * Permission utility functions
 */

import type { AuthUser } from '../types/auth';

/**
 * Check if user has admin permissions
 * Supports both legacy role field and new roles array
 */
export const isAdmin = (user: AuthUser | null): boolean => {
  if (!user) return false;
  
  // Check legacy role field
  if (user.role === 'admin') return true;
  
  // Check new roles array
  if (user.roles && user.roles.includes('admin')) return true;
  
  return false;
};

/**
 * Check if user has moderator permissions
 * Supports both legacy role field and new roles array
 */
export const isModerator = (user: AuthUser | null): boolean => {
  if (!user) return false;
  
  // Check legacy role field
  if (user.role === 'moderator') return true;
  
  // Check new roles array
  if (user.roles && user.roles.includes('moderator')) return true;
  
  return false;
};

/**
 * Check if user has admin or moderator permissions
 */
export const isAdminOrModerator = (user: AuthUser | null): boolean => {
  return isAdmin(user) || isModerator(user);
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user: AuthUser | null, role: string): boolean => {
  if (!user) return false;
  
  // Check legacy role field
  if (user.role === role) return true;
  
  // Check new roles array
  if (user.roles && user.roles.includes(role)) return true;
  
  return false;
};
