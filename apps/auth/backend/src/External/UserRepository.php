<?php

namespace App\External;

use App\Models\User;

class UserRepository
{
    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    /**
     * Find user by username
     */
    public function findByUsername(string $username): ?User
    {
        return User::where('username', $username)->first();
    }

    /**
     * Find user by ID
     */
    public function findById(string|int $id): ?User
    {
        return User::find($id);
    }

    /**
     * Create a new user
     */
    public function createUser(array $userData): User
    {
        // Hash the password
        $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);
        
        // Set defaults
        $userData['is_active'] = $userData['is_active'] ?? true;
        $userData['role'] = $userData['role'] ?? 'user';
        
        return User::create($userData);
    }

    /**
     * Update user's last login timestamp
     */
    public function updateLastLogin(int $userId): void
    {
        User::where('id', $userId)->update([
            'last_login_at' => now()
        ]);
    }

    /**
     * Get all users (admin function)
     */
    public function getAllUsers(): array
    {
        return User::orderBy('created_at', 'desc')->get()->toArray();
    }

    /**
     * Update user data
     */
    public function updateUser(int $userId, array $userData): bool
    {
        // Remove password from update data if empty
        if (isset($userData['password']) && empty($userData['password'])) {
            unset($userData['password']);
        } else if (isset($userData['password'])) {
            $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);
        }

        return User::where('id', $userId)->update($userData) > 0;
    }

    /**
     * Delete user
     */
    public function deleteUser(int $userId): bool
    {
        return User::where('id', $userId)->delete() > 0;
    }
}
