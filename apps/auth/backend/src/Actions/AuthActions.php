<?php

namespace App\Actions;

use App\External\UserRepository;
use App\Exceptions\UnauthorizedException;
use App\Exceptions\ResourceNotFoundException;
use App\Constants\SecurityConstants;
use App\Validators\UserValidator;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthActions
{
    public function __construct(
        private UserRepository $userRepository,
        private UserValidator $validator = new UserValidator()
    ) {}

    /**
     * Register a new user
     */
    public function registerUser(array $userData): array
    {
        // Validate input data
        $validationResult = $this->validator->validateRegistration($userData);
        
        if (!$validationResult->isValid()) {
            $firstError = $validationResult->getFirstError() ?? 'Validation failed';
            throw new \InvalidArgumentException($firstError);
        }

        // Use sanitized data
        $sanitizedData = $validationResult->getSanitizedData();

        // Check if user already exists (repository now handles this)
        $user = $this->userRepository->createUser($sanitizedData);

        // Generate JWT token
        $token = $this->generateJwtToken($user);

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
        // Validate login credentials
        $validationResult = $this->validator->validateLogin($credentials);
        
        if (!$validationResult->isValid()) {
            $firstError = $validationResult->getFirstError() ?? 'Invalid credentials';
            throw new UnauthorizedException($firstError);
        }

        $sanitizedCredentials = $validationResult->getSanitizedData();
        $user = $this->userRepository->findByEmail($sanitizedCredentials['email']);
        
        if (!$user || !password_verify($sanitizedCredentials['password'], $user->password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!$user->is_active) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Update last login
        $this->userRepository->updateLastLogin($user->id);

        // Generate JWT token
        $token = $this->generateJwtToken($user);

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
     * Generate JWT token with enhanced security
     */
    private function generateJwtToken(User $user): string
    {
        $jwtSecret = $this->getJwtSecret();
        $currentTime = time();
        
        $payload = [
            'sub' => (string) $user->id,  // Standard 'subject' claim
            'email' => $user->email,
            'roles' => $user->getRoleNames(),
            'iat' => $currentTime,
            'exp' => $currentTime + SecurityConstants::JWT_EXPIRY_SECONDS,
            'nbf' => $currentTime,  // Not before
            'iss' => $_ENV['JWT_ISSUER'] ?? 'webhatchery',
            'aud' => $_ENV['APP_URL'] ?? 'localhost',  // Audience
            'jti' => bin2hex(random_bytes(16))  // Unique JWT ID for revocation
        ];

        return JWT::encode($payload, $jwtSecret, SecurityConstants::JWT_ALGORITHM);
    }

    /**
     * Get and validate JWT secret
     */
    private function getJwtSecret(): string
    {
        $secret = $_ENV['JWT_SECRET'] ?? null;
        if (!$secret || strlen($secret) < SecurityConstants::JWT_MIN_SECRET_LENGTH) {
            throw new \RuntimeException('JWT_SECRET must be at least ' . SecurityConstants::JWT_MIN_SECRET_LENGTH . ' characters long');
        }
        return $secret;
    }

    /**
     * Validate JWT token with enhanced security
     */
    public function validateToken(string $token): ?object
    {
        try {
            $jwtSecret = $this->getJwtSecret();
            
            $decoded = JWT::decode($token, new Key($jwtSecret, SecurityConstants::JWT_ALGORITHM));
            
            // Verify user still exists and is active using the 'sub' claim
            $userId = $decoded->sub ?? $decoded->user_id ?? null; // Support both new and old token formats
            if (!$userId) {
                return null;
            }
            
            $user = $this->userRepository->findById($userId);
            if (!$user) {
                return null;
            }
            
            if (!$user->is_active) {
                return null;
            }
            
            // Verify audience if present
            if (isset($decoded->aud)) {
                $expectedAudience = $_ENV['APP_URL'] ?? 'localhost';
                if ($decoded->aud !== $expectedAudience) {
                    return null;
                }
            }
            
            return $decoded;
        } catch (\Exception $e) {
            // Log the error for debugging but don't expose details
            error_log('JWT validation failed: ' . $e->getMessage());
            return null;
        }
    }
}
