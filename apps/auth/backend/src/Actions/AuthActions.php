<?php

namespace App\Actions;

use App\External\UserRepository;
use App\Exceptions\UnauthorizedException;
use App\Exceptions\ResourceNotFoundException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthActions
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    /**
     * Register a new user
     */
    public function registerUser(array $userData): array
    {
        // Validate required fields
        $requiredFields = ['email', 'username', 'password', 'first_name', 'last_name'];
        foreach ($requiredFields as $field) {
            if (!isset($userData[$field]) || empty($userData[$field])) {
                throw new \InvalidArgumentException("Missing required field: {$field}");
            }
        }

        // Check if user already exists
        if ($this->userRepository->findByEmail($userData['email'])) {
            throw new \InvalidArgumentException('User with this email already exists');
        }

        if ($this->userRepository->findByUsername($userData['username'])) {
            throw new \InvalidArgumentException('User with this username already exists');
        }

        // Create user
        $user = $this->userRepository->createUser($userData);

        // Generate JWT token
        $token = $this->generateJwtToken($user);
        
        // Log token generation for debugging
        error_log('JWT Token generated for new user ' . $user->id . ': ' . substr($token, 0, 50) . '...');

        return [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'username' => $user->username,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'roles' => $user->getRoleNames()
            ],
            'token' => $token
        ];
    }

    /**
     * Login user
     */
    public function loginUser(array $credentials): array
    {
        if (!isset($credentials['email']) || !isset($credentials['password'])) {
            throw new \InvalidArgumentException('Email and password are required');
        }

        $user = $this->userRepository->findByEmail($credentials['email']);
        
        if (!$user || !password_verify($credentials['password'], $user->password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!$user->is_active) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Update last login
        $this->userRepository->updateLastLogin($user->id);

        // Generate JWT token
        $token = $this->generateJwtToken($user);
        
        // Log token generation for debugging
        error_log('JWT Token generated for login user ' . $user->id . ': ' . substr($token, 0, 50) . '...');

        return [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'username' => $user->username,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'roles' => $user->getRoleNames()
            ],
            'token' => $token
        ];
    }

    /**
     * Get current user information
     */
    public function getCurrentUser(string|int $userId): array
    {
        $user = $this->userRepository->findById($userId);
        
        if (!$user) {
            throw new ResourceNotFoundException('User not found');
        }

        return [
            'id' => $user->id,
            'email' => $user->email,
            'username' => $user->username,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'roles' => $user->getRoleNames(),
            'is_active' => $user->is_active,
            'last_login_at' => $user->last_login_at,
            'created_at' => $user->created_at
        ];
    }

    /**
     * Generate JWT token
     */
    private function generateJwtToken($user): string
    {
        $jwtSecret = $_ENV['JWT_SECRET'] ?? 'your_jwt_secret_key_here';
        
        // Get roles from the new role system
        $roles = $user->getRoleNames();
        $primaryRole = !empty($roles) ? $roles[0] : 'user'; // Default to 'user' if no roles assigned
        
        $payload = [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $primaryRole, // Primary role for backward compatibility
            'roles' => $roles, // All roles for new system
            'iat' => time(), // issued at
            'exp' => time() + (24 * 60 * 60) // expires in 24 hours
        ];

        return JWT::encode($payload, $jwtSecret, 'HS256');
    }

    /**
     * Validate JWT token
     */
    public function validateToken(string $token): ?object
    {
        try {
            $jwtSecret = $_ENV['JWT_SECRET'] ?? 'your_jwt_secret_key_here';
            error_log('Validating token with secret: ' . substr($jwtSecret, 0, 10) . '...');
            
            $decoded = JWT::decode($token, new Key($jwtSecret, 'HS256'));
            error_log('Token decoded successfully. User ID: ' . $decoded->user_id);
            
            // Verify user still exists and is active
            $user = $this->userRepository->findById($decoded->user_id);
            if (!$user) {
                error_log('User not found in database: ' . $decoded->user_id);
                return null;
            }
            
            if (!$user->is_active) {
                error_log('User is not active: ' . $decoded->user_id);
                return null;
            }
            
            error_log('Token validation successful for user: ' . $user->id);
            return $decoded;
        } catch (\Exception $e) {
            error_log('Token validation error: ' . $e->getMessage());
            error_log('Token validation error class: ' . get_class($e));
            error_log('Token validation error trace: ' . $e->getTraceAsString());
            return null;
        }
    }
}
