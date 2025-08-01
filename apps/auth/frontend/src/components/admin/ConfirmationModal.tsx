import React from 'react';
import type { User } from '../../types/admin';

interface ConfirmationModalProps {
  action: 'delete' | 'deactivate' | 'resetPassword';
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation Modal Component
 * Modal for confirming destructive actions
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  action,
  user,
  onConfirm,
  onCancel
}) => {
  /**
   * Get action-specific content
   */
  const getActionContent = () => {
    switch (action) {
      case 'delete':
        return {
          title: 'Delete User',
          icon: '🗑️',
          iconColor: 'text-red-500',
          message: `Are you sure you want to delete the user "${user.username}"?`,
          description: 'This action cannot be undone. All user data will be permanently removed.',
          confirmText: 'Delete User',
          confirmClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      
      case 'deactivate':
        return {
          title: 'Deactivate User',
          icon: '⏸️',
          iconColor: 'text-yellow-500',
          message: `Are you sure you want to deactivate the user "${user.username}"?`,
          description: 'The user will no longer be able to log in, but their data will be preserved.',
          confirmText: 'Deactivate User',
          confirmClass: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
      
      case 'resetPassword':
        return {
          title: 'Reset Password',
          icon: '🔑',
          iconColor: 'text-orange-500',
          message: `Are you sure you want to reset the password for "${user.username}"?`,
          description: 'A temporary password will be generated and the user will need to change it on next login.',
          confirmText: 'Reset Password',
          confirmClass: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
        };
      
      default:
        return {
          title: 'Confirm Action',
          icon: '⚠️',
          iconColor: 'text-gray-500',
          message: 'Are you sure you want to perform this action?',
          description: 'Please confirm that you want to proceed.',
          confirmText: 'Confirm',
          confirmClass: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
        };
    }
  };

  /**
   * Handle modal backdrop click
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  /**
   * Handle keyboard events
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter') {
      onConfirm();
    }
  };

  const content = getActionContent();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="p-6 text-center">
          <div className={`text-6xl mb-4 ${content.iconColor}`}>
            {content.icon}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {content.title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                {user.avatar_url ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.avatar_url}
                    alt={`${user.username} avatar`}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user.username
                  }
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <div className="text-xs text-gray-400">@{user.username}</div>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-900 mb-3 text-center">
            {content.message}
          </p>
          
          {/* Description */}
          <p className="text-sm text-gray-600 mb-6 text-center">
            {content.description}
          </p>

          {/* Special warnings */}
          {action === 'delete' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex">
                <div className="text-red-400 mr-2">⚠️</div>
                <div>
                  <h4 className="text-sm font-medium text-red-800">
                    This action is irreversible
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    All user data, including login history and associated records, will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          )}

          {action === 'resetPassword' && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-4">
              <div className="flex">
                <div className="text-orange-400 mr-2">🔐</div>
                <div>
                  <h4 className="text-sm font-medium text-orange-800">
                    Password Reset Process
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    A temporary password will be generated and displayed. Make sure to securely share it with the user.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 ${content.confirmClass}`}
            >
              {content.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
