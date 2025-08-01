<?php

namespace App\External;

use App\Models\User;
use App\Constants\SecurityConstants;
use App\Validators\UserValidator;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class UserRepository
{
    public function __construct(
        private UserValidator $validator = new UserValidator()
    ) {}

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
     * Create a new user with transaction management
     */
    public function createUser(array $userData): User
    {
        return DB::transaction(function () use ($userData): User {
            $this->validateUserData($userData);
            
            // Hash the password
            $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);
            
            // Set defaults
            $userData['is_active'] = $userData['is_active'] ?? true;
            
            $user = User::create($userData);
            
            // Assign default 'user' role using the new role system
            $user->assignRole(SecurityConstants::DEFAULT_USER_ROLE);
            
            // Create user preferences
            $this->createUserPreferences($user);
            
            return $user;
        });
    }

    /**
     * Validate user data for creation
     */
    private function validateUserData(array $userData): void
    {
        $validationResult = $this->validator->validateRegistration($userData);
        
        if (!$validationResult->isValid()) {
            $firstError = $validationResult->getFirstError() ?? 'Validation failed';
            throw new \InvalidArgumentException($firstError);
        }

        // Check uniqueness
        if ($this->findByEmail($userData['email'])) {
            throw new \InvalidArgumentException('User with this email already exists');
        }

        if ($this->findByUsername($userData['username'])) {
            throw new \InvalidArgumentException('User with this username already exists');
        }
    }

    /**
     * Create default user preferences
     */
    private function createUserPreferences(User $user): void
    {
        // This could be expanded to create user preferences, settings, etc.
        // For now, it's a placeholder for future functionality
    }

    /**
     * Update user's last login timestamp
     */
    public function updateLastLogin(int $userId): void
    {
        User::where('id', $userId)->update([
            'last_login_at' => Carbon::now()
        ]);
    }

    /**
     * Get all users (admin function)
     */
    public function getAllUsers(): Collection
    {
        return User::orderBy('created_at', 'desc')->get();
    }

    /**
     * Update user data with validation
     */
    public function updateUser(int $userId, array $userData): bool
    {
        return DB::transaction(function () use ($userId, $userData): bool {
            // Remove password from update data if empty
            if (isset($userData['password']) && empty($userData['password'])) {
                unset($userData['password']);
            } elseif (isset($userData['password'])) {
                // Validate password if provided
                $passwordErrors = $this->validator->validatePassword($userData['password']);
                if (!empty($passwordErrors)) {
                    throw new \InvalidArgumentException(implode(', ', $passwordErrors));
                }
                $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);
            }

            return User::where('id', $userId)->update($userData) > 0;
        });
    }

    /**
     * Delete user
     */
    public function deleteUser(int $userId): bool
    {
        return DB::transaction(function () use ($userId): bool {
            $user = $this->findById($userId);
            if (!$user) {
                throw new \InvalidArgumentException('User not found');
            }

            // Remove user roles and related data
            $user->roles()->detach();
            
            return $user->delete();
        });
    }
}
