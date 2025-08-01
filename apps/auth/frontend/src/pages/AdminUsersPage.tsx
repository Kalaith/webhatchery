import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/permissions';
import UserTable from '../components/admin/UserTable';
import UserModal from '../components/admin/UserModal';
import RoleAssignmentModal from '../components/admin/RoleAssignmentModal';
import ConfirmationModal from '../components/admin/ConfirmationModal';
import { adminApi } from '../services/adminApi';
import type { User, Role } from '../types/admin';

/**
 * Admin Users Page
 * Comprehensive user management for administrators
 */
const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  
  // Check if user has admin permissions
  if (!isAdmin(currentUser)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-700">You don't have permission to access this page. Admin privileges are required.</p>
        </div>
      </div>
    );
  }
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'deactivate' | 'resetPassword';
    user: User;
  } | null>(null);

  // Check admin access
  useEffect(() => {
    if (!currentUser?.roles?.includes('admin')) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }
    
    loadData();
  }, [currentUser]);

  /**
   * Load users and roles data
   */
  const loadData = async () => {
    try {
      setLoading(true);
      const [usersResponse, rolesResponse] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllRoles()
      ]);
      
      setUsers(usersResponse.data.users);
      setRoles(rolesResponse.data.roles);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user edit
   */
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  /**
   * Handle role management
   */
  const handleManageRoles = (user: User) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  /**
   * Handle user deletion
   */
  const handleDeleteUser = (user: User) => {
    setConfirmAction({ type: 'delete', user });
    setShowConfirmModal(true);
  };

  /**
   * Handle user deactivation
   */
  const handleDeactivateUser = (user: User) => {
    setConfirmAction({ type: 'deactivate', user });
    setShowConfirmModal(true);
  };

  /**
   * Handle password reset
   */
  const handleResetPassword = (user: User) => {
    setConfirmAction({ type: 'resetPassword', user });
    setShowConfirmModal(true);
  };

  /**
   * Execute confirmed action
   */
  const executeConfirmedAction = async () => {
    if (!confirmAction) return;

    try {
      switch (confirmAction.type) {
        case 'delete':
          await adminApi.deleteUser(confirmAction.user.id);
          break;
        case 'deactivate':
          await adminApi.deactivateUser(confirmAction.user.id);
          break;
        case 'resetPassword':
          await adminApi.resetUserPassword(confirmAction.user.id);
          break;
      }
      
      await loadData(); // Refresh data
      setShowConfirmModal(false);
      setConfirmAction(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  /**
   * Handle role assignment
   */
  const handleRoleAssignment = async (userId: number, roleName: string, action: 'assign' | 'remove') => {
    try {
      if (action === 'assign') {
        await adminApi.assignRole(userId, roleName);
      } else {
        await adminApi.removeRole(userId, roleName);
      }
      
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Role operation failed');
    }
  };

  /**
   * Handle user update
   */
  const handleUserUpdate = async (userData: Partial<User>) => {
    if (!selectedUser) return;

    try {
      await adminApi.updateUser(selectedUser.id, userData);
      await loadData(); // Refresh data
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'User update failed');
    }
  };

  // Access denied view
  if (!currentUser?.roles?.includes('admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page. Admin privileges are required.
          </p>
        </div>
      </div>
    );
  }

  // Loading view
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Error view
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">
                  Manage users, roles, and permissions
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {users.length} Users
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {roles.length} Roles
                </span>
                <button
                  onClick={loadData}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 text-sm"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow rounded-lg">
          <UserTable
            users={users}
            roles={roles}
            onEditUser={handleEditUser}
            onManageRoles={handleManageRoles}
            onDeleteUser={handleDeleteUser}
            onDeactivateUser={handleDeactivateUser}
            onResetPassword={handleResetPassword}
            currentUserId={currentUser?.id}
          />
        </div>

        {/* User Edit Modal */}
        {showUserModal && selectedUser && (
          <UserModal
            user={selectedUser}
            onSave={handleUserUpdate}
            onClose={() => {
              setShowUserModal(false);
              setSelectedUser(null);
            }}
          />
        )}

        {/* Role Assignment Modal */}
        {showRoleModal && selectedUser && (
          <RoleAssignmentModal
            user={selectedUser}
            roles={roles}
            onRoleAction={handleRoleAssignment}
            onClose={() => {
              setShowRoleModal(false);
              setSelectedUser(null);
            }}
          />
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && confirmAction && (
          <ConfirmationModal
            action={confirmAction.type}
            user={confirmAction.user}
            onConfirm={executeConfirmedAction}
            onCancel={() => {
              setShowConfirmModal(false);
              setConfirmAction(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
