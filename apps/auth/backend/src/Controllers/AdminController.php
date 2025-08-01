<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\User;
use App\Models\Role;
use App\Models\UserRole;

/**
 * Admin Controller
 * Handles administrative functions like user management
 */
class AdminController
{
    /**
     * Get all users (admin only)
     */
    public function getAllUsers(Request $request, Response $response): Response
    {
        try {
            // Check if current user is admin
            $currentUserId = $request->getAttribute('user_id');
            $currentUser = User::find($currentUserId);
            
            if (!$currentUser || !$currentUser->isAdmin()) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.',
                    'error' => [
                        'code' => 'INSUFFICIENT_PRIVILEGES',
                        'message' => 'Only administrators can view all users'
                    ]
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Get all users with their roles
            $users = User::with('roles')->where('is_active', true)->get();
            
            $userData = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'email' => $user->email,
                    'username' => $user->username,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'roles' => $user->getRoleNames(), // New roles system
                    'is_active' => $user->is_active,
                    'last_login_at' => $user->last_login_at?->toISOString(),
                    'email_verified_at' => $user->email_verified_at?->toISOString(),
                    'created_at' => $user->created_at->toISOString(),
                    'updated_at' => $user->updated_at->toISOString()
                ];
            });

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'users' => $userData,
                    'total_count' => $userData->count()
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to retrieve users',
                'error' => [
                    'code' => 'USER_RETRIEVAL_ERROR',
                    'message' => $e->getMessage()
                ]
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Get all available roles (admin only)
     */
    public function getAllRoles(Request $request, Response $response): Response
    {
        try {
            // Check if current user is admin
            $currentUserId = $request->getAttribute('user_id');
            $currentUser = User::find($currentUserId);
            
            if (!$currentUser || !$currentUser->isAdmin()) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.',
                    'error' => [
                        'code' => 'INSUFFICIENT_PRIVILEGES',
                        'message' => 'Only administrators can view roles'
                    ]
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            $roles = Role::where('is_active', true)->get();
            
            $rolesData = $roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'display_name' => $role->display_name,
                    'description' => $role->description,
                    'is_active' => $role->is_active,
                    'user_count' => $role->users()->count(),
                    'created_at' => $role->created_at->toISOString(),
                    'updated_at' => $role->updated_at->toISOString()
                ];
            });

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'roles' => $rolesData
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to retrieve roles',
                'error' => [
                    'code' => 'ROLE_RETRIEVAL_ERROR',
                    'message' => $e->getMessage()
                ]
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Assign role to user (admin only)
     */
    public function assignUserRole(Request $request, Response $response): Response
    {
        try {
            // Check if current user is admin
            $currentUserId = $request->getAttribute('user_id');
            $currentUser = User::find($currentUserId);
            
            if (!$currentUser || !$currentUser->isAdmin()) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.',
                    'error' => [
                        'code' => 'INSUFFICIENT_PRIVILEGES',
                        'message' => 'Only administrators can assign roles'
                    ]
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!isset($data['user_id']) || !isset($data['role_name'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Missing required fields: user_id and role_name',
                    'error' => [
                        'code' => 'VALIDATION_ERROR',
                        'message' => 'Both user_id and role_name are required'
                    ]
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $targetUser = User::find($data['user_id']);
            if (!$targetUser) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found',
                    'error' => [
                        'code' => 'USER_NOT_FOUND',
                        'message' => 'The specified user does not exist'
                    ]
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $role = Role::getByName($data['role_name']);
            if (!$role) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Role not found',
                    'error' => [
                        'code' => 'ROLE_NOT_FOUND',
                        'message' => 'The specified role does not exist'
                    ]
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $success = $targetUser->assignRole($data['role_name'], $currentUserId);
            
            if ($success) {
                $response->getBody()->write(json_encode([
                    'success' => true,
                    'message' => "Role '{$role->display_name}' assigned to user '{$targetUser->username}' successfully"
                ]));
                return $response->withHeader('Content-Type', 'application/json');
            } else {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Failed to assign role',
                    'error' => [
                        'code' => 'ROLE_ASSIGNMENT_FAILED',
                        'message' => 'Role assignment could not be completed'
                    ]
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to assign role',
                'error' => [
                    'code' => 'ROLE_ASSIGNMENT_ERROR',
                    'message' => $e->getMessage()
                ]
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Remove role from user (admin only)
     */
    public function removeUserRole(Request $request, Response $response): Response
    {
        try {
            // Check if current user is admin
            $currentUserId = $request->getAttribute('user_id');
            $currentUser = User::find($currentUserId);
            
            if (!$currentUser || !$currentUser->isAdmin()) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.',
                    'error' => [
                        'code' => 'INSUFFICIENT_PRIVILEGES',
                        'message' => 'Only administrators can remove roles'
                    ]
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!isset($data['user_id']) || !isset($data['role_name'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Missing required fields: user_id and role_name',
                    'error' => [
                        'code' => 'VALIDATION_ERROR',
                        'message' => 'Both user_id and role_name are required'
                    ]
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $targetUser = User::find($data['user_id']);
            if (!$targetUser) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found',
                    'error' => [
                        'code' => 'USER_NOT_FOUND',
                        'message' => 'The specified user does not exist'
                    ]
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $role = Role::getByName($data['role_name']);
            if (!$role) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Role not found',
                    'error' => [
                        'code' => 'ROLE_NOT_FOUND',
                        'message' => 'The specified role does not exist'
                    ]
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $success = $targetUser->removeRole($data['role_name']);
            
            if ($success) {
                $response->getBody()->write(json_encode([
                    'success' => true,
                    'message' => "Role '{$role->display_name}' removed from user '{$targetUser->username}' successfully"
                ]));
                return $response->withHeader('Content-Type', 'application/json');
            } else {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Failed to remove role',
                    'error' => [
                        'code' => 'ROLE_REMOVAL_FAILED',
                        'message' => 'Role removal could not be completed'
                    ]
                ]));
                return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
            }

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to remove role',
                'error' => [
                    'code' => 'ROLE_REMOVAL_ERROR',
                    'message' => $e->getMessage()
                ]
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Update user information (admin only)
     */
    public function updateUser(Request $request, Response $response): Response
    {
        try {
            // Check if current user is admin
            $currentUserId = $request->getAttribute('user_id');
            $currentUser = User::find($currentUserId);
            
            if (!$currentUser || !$currentUser->isAdmin()) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.',
                    'error' => [
                        'code' => 'INSUFFICIENT_PRIVILEGES',
                        'message' => 'Only administrators can update users'
                    ]
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Get user ID from route
            $userId = $request->getAttribute('userId');
            $targetUser = User::find($userId);
            
            if (!$targetUser) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found',
                    'error' => [
                        'code' => 'USER_NOT_FOUND',
                        'message' => 'The specified user does not exist'
                    ]
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $data = json_decode($request->getBody()->getContents(), true);
            
            // Validate and update allowed fields
            $allowedFields = ['email', 'username', 'first_name', 'last_name', 'is_active'];
            $updateData = [];
            
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateData[$field] = $data[$field];
                }
            }

            if (empty($updateData)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'No valid fields to update',
                    'error' => [
                        'code' => 'VALIDATION_ERROR',
                        'message' => 'At least one valid field must be provided'
                    ]
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Update user
            $targetUser->update($updateData);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => [
                    'user' => [
                        'id' => $targetUser->id,
                        'email' => $targetUser->email,
                        'username' => $targetUser->username,
                        'first_name' => $targetUser->first_name,
                        'last_name' => $targetUser->last_name,
                        'is_active' => $targetUser->is_active,
                        'roles' => $targetUser->getRoleNames()
                    ]
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => [
                    'code' => 'USER_UPDATE_ERROR',
                    'message' => $e->getMessage()
                ]
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete user (admin only)
     */
    public function deleteUser(Request $request, Response $response): Response
    {
        try {
            // Check if current user is admin
            $currentUserId = $request->getAttribute('user_id');
            $currentUser = User::find($currentUserId);
            
            if (!$currentUser || !$currentUser->isAdmin()) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.',
                    'error' => [
                        'code' => 'INSUFFICIENT_PRIVILEGES',
                        'message' => 'Only administrators can delete users'
                    ]
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Get user ID from route
            $userId = $request->getAttribute('userId');
            
            // Prevent self-deletion
            if ($userId == $currentUserId) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Cannot delete your own account',
                    'error' => [
                        'code' => 'SELF_DELETION_FORBIDDEN',
                        'message' => 'You cannot delete your own user account'
                    ]
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $targetUser = User::find($userId);
            
            if (!$targetUser) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found',
                    'error' => [
                        'code' => 'USER_NOT_FOUND',
                        'message' => 'The specified user does not exist'
                    ]
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Delete user (cascading deletes will handle role assignments)
            $targetUser->delete();

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => "User '{$targetUser->username}' deleted successfully"
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => [
                    'code' => 'USER_DELETION_ERROR',
                    'message' => $e->getMessage()
                ]
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Reset user password (admin only)
     */
    public function resetUserPassword(Request $request, Response $response): Response
    {
        try {
            // Check if current user is admin
            $currentUserId = $request->getAttribute('user_id');
            $currentUser = User::find($currentUserId);
            
            if (!$currentUser || !$currentUser->isAdmin()) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.',
                    'error' => [
                        'code' => 'INSUFFICIENT_PRIVILEGES',
                        'message' => 'Only administrators can reset passwords'
                    ]
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Get user ID from route
            $userId = $request->getAttribute('userId');
            
            // Prevent self password reset (use regular password change)
            if ($userId == $currentUserId) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Cannot reset your own password',
                    'error' => [
                        'code' => 'SELF_RESET_FORBIDDEN',
                        'message' => 'Use the regular password change feature for your own account'
                    ]
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $targetUser = User::find($userId);
            
            if (!$targetUser) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found',
                    'error' => [
                        'code' => 'USER_NOT_FOUND',
                        'message' => 'The specified user does not exist'
                    ]
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Generate temporary password
            $temporaryPassword = bin2hex(random_bytes(8));
            
            // Update user password
            $targetUser->password = password_hash($temporaryPassword, PASSWORD_DEFAULT);
            $targetUser->save();

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => "Password reset for user '{$targetUser->username}'",
                'data' => [
                    'temporary_password' => $temporaryPassword,
                    'instructions' => 'Share this temporary password securely with the user. They will need to change it on next login.'
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to reset password',
                'error' => [
                    'code' => 'PASSWORD_RESET_ERROR',
                    'message' => $e->getMessage()
                ]
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Deactivate user (admin only)
     */
    public function deactivateUser(Request $request, Response $response): Response
    {
        try {
            // Check if current user is admin
            $currentUserId = $request->getAttribute('user_id');
            $currentUser = User::find($currentUserId);
            
            if (!$currentUser || !$currentUser->isAdmin()) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.',
                    'error' => [
                        'code' => 'INSUFFICIENT_PRIVILEGES',
                        'message' => 'Only administrators can deactivate users'
                    ]
                ]));
                return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
            }

            // Get user ID from route
            $userId = $request->getAttribute('userId');
            
            // Prevent self-deactivation
            if ($userId == $currentUserId) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Cannot deactivate your own account',
                    'error' => [
                        'code' => 'SELF_DEACTIVATION_FORBIDDEN',
                        'message' => 'You cannot deactivate your own user account'
                    ]
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $targetUser = User::find($userId);
            
            if (!$targetUser) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'User not found',
                    'error' => [
                        'code' => 'USER_NOT_FOUND',
                        'message' => 'The specified user does not exist'
                    ]
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Deactivate user
            $targetUser->is_active = false;
            $targetUser->save();

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => "User '{$targetUser->username}' deactivated successfully"
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Failed to deactivate user',
                'error' => [
                    'code' => 'USER_DEACTIVATION_ERROR',
                    'message' => $e->getMessage()
                ]
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
