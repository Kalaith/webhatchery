import React, { useState } from 'react';
import type { User, Role } from '../../types/admin';

interface RoleAssignmentModalProps {
  user: User;
  roles: Role[];
  onRoleAction: (userId: number, roleName: string, action: 'assign' | 'remove') => Promise<void>;
  onClose: () => void;
}

/**
 * Role Assignment Modal Component
 * Modal for managing user roles
 */
const RoleAssignmentModal: React.FC<RoleAssignmentModalProps> = ({
  user,
  roles,
  onRoleAction,
  onClose
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle role assignment/removal
   */
  const handleRoleAction = async (roleName: string, action: 'assign' | 'remove') => {
    setLoading(roleName);
    setError(null);

    try {
      await onRoleAction(user.id, roleName, action);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Role operation failed');
    } finally {
      setLoading(null);
    }
  };

  /**
   * Check if user has a specific role
   */
  const userHasRole = (roleName: string): boolean => {
    return user.roles.includes(roleName);
  };

  /**
   * Handle modal backdrop click
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Get role description with user count
   */
  const getRoleDescription = (role: Role): string => {
    const baseDescription = role.description || `${role.display_name} role`;
    return `${baseDescription} (${role.user_count} users)`;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage User Roles</h2>
            <p className="text-sm text-gray-600 mt-1">
              Managing roles for <strong>{user.username}</strong> ({user.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Roles */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Roles</h3>
            {user.roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.roles.map(roleName => (
                  <span
                    key={roleName}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {roleName}
                    <span className="ml-1">✓</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No roles assigned</p>
            )}
          </div>

          {/* Available Roles */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Available Roles</h3>
            <div className="space-y-3">
              {roles.filter(role => role.is_active).map(role => {
                const hasRole = userHasRole(role.name);
                const isLoading = loading === role.name;

                return (
                  <div
                    key={role.id}
                    className={`border rounded-lg p-4 ${
                      hasRole ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-gray-900">
                            {role.display_name}
                          </h4>
                          {hasRole && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                              Assigned
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {getRoleDescription(role)}
                        </p>
                      </div>
                      
                      <div className="ml-4">
                        {hasRole ? (
                          <button
                            onClick={() => handleRoleAction(role.name, 'remove')}
                            disabled={isLoading}
                            className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <span className="flex items-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                                Removing...
                              </span>
                            ) : (
                              'Remove'
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleAction(role.name, 'assign')}
                            disabled={isLoading}
                            className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <span className="flex items-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                                Assigning...
                              </span>
                            ) : (
                              'Assign'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignmentModal;
