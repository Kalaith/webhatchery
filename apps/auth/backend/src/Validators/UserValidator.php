<?php

namespace App\Validators;

use App\Constants\SecurityConstants;

/**
 * User data validation
 */
class UserValidator
{
    // Note: ValidationResult class will be created separately

    /**
     * Validate user registration data
     */
    public function validateRegistration(array $data): ValidationResult
    {
        $errors = [];
        $sanitizedData = [];

        // Email validation
        if (empty($data['email'])) {
            $errors['email'][] = 'Email is required';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'][] = 'Invalid email format';
        } elseif (strlen($data['email']) > SecurityConstants::EMAIL_MAX_LENGTH) {
            $errors['email'][] = 'Email must not exceed ' . SecurityConstants::EMAIL_MAX_LENGTH . ' characters';
        } else {
            $sanitizedData['email'] = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
        }

        // Username validation
        if (empty($data['username'])) {
            $errors['username'][] = 'Username is required';
        } elseif (strlen($data['username']) < SecurityConstants::USERNAME_MIN_LENGTH) {
            $errors['username'][] = 'Username must be at least ' . SecurityConstants::USERNAME_MIN_LENGTH . ' characters';
        } elseif (strlen($data['username']) > SecurityConstants::USERNAME_MAX_LENGTH) {
            $errors['username'][] = 'Username must not exceed ' . SecurityConstants::USERNAME_MAX_LENGTH . ' characters';
        } elseif (!preg_match('/^[a-zA-Z0-9_]+$/', $data['username'])) {
            $errors['username'][] = 'Username can only contain letters, numbers, and underscores';
        } else {
            $sanitizedData['username'] = trim($data['username']);
        }

        // Password validation
        if (empty($data['password'])) {
            $errors['password'][] = 'Password is required';
        } else {
            $passwordErrors = $this->validatePasswordPrivate($data['password']);
            if (!empty($passwordErrors)) {
                $errors['password'] = $passwordErrors;
            } else {
                $sanitizedData['password'] = $data['password']; // Don't trim passwords
            }
        }

        // First name validation
        if (empty($data['first_name'])) {
            $errors['first_name'][] = 'First name is required';
        } elseif (strlen($data['first_name']) > SecurityConstants::NAME_MAX_LENGTH) {
            $errors['first_name'][] = 'First name must not exceed ' . SecurityConstants::NAME_MAX_LENGTH . ' characters';
        } elseif (!preg_match('/^[a-zA-Z\s\'-]+$/', $data['first_name'])) {
            $errors['first_name'][] = 'First name contains invalid characters';
        } else {
            $sanitizedData['first_name'] = trim($data['first_name']);
        }

        // Last name validation
        if (empty($data['last_name'])) {
            $errors['last_name'][] = 'Last name is required';
        } elseif (strlen($data['last_name']) > SecurityConstants::NAME_MAX_LENGTH) {
            $errors['last_name'][] = 'Last name must not exceed ' . SecurityConstants::NAME_MAX_LENGTH . ' characters';
        } elseif (!preg_match('/^[a-zA-Z\s\'-]+$/', $data['last_name'])) {
            $errors['last_name'][] = 'Last name contains invalid characters';
        } else {
            $sanitizedData['last_name'] = trim($data['last_name']);
        }

        return new ValidationResult(
            isValid: empty($errors),
            errors: $errors,
            sanitizedData: $sanitizedData
        );
    }

    /**
     * Validate password requirements (public method for external use)
     */
    public function validatePassword(string $password): array
    {
        return $this->validatePasswordPrivate($password);
    }

    /**
     * Validate password requirements (private implementation)
     */
    private function validatePasswordPrivate(string $password): array
    {
        $errors = [];

        if (strlen($password) < SecurityConstants::PASSWORD_MIN_LENGTH) {
            $errors[] = 'Password must be at least ' . SecurityConstants::PASSWORD_MIN_LENGTH . ' characters long';
        }

        if (SecurityConstants::PASSWORD_REQUIRE_UPPERCASE && !preg_match('/[A-Z]/', $password)) {
            $errors[] = 'Password must contain at least one uppercase letter';
        }

        if (SecurityConstants::PASSWORD_REQUIRE_LOWERCASE && !preg_match('/[a-z]/', $password)) {
            $errors[] = 'Password must contain at least one lowercase letter';
        }

        if (SecurityConstants::PASSWORD_REQUIRE_NUMBERS && !preg_match('/\d/', $password)) {
            $errors[] = 'Password must contain at least one number';
        }

        if (SecurityConstants::PASSWORD_REQUIRE_SPECIAL_CHARS && !preg_match('/[@$!%*?&]/', $password)) {
            $errors[] = 'Password must contain at least one special character (@$!%*?&)';
        }

        return $errors;
    }

    /**
     * Validate login credentials
     */
    public function validateLogin(array $data): ValidationResult
    {
        $errors = [];
        $sanitizedData = [];

        if (empty($data['email'])) {
            $errors['email'][] = 'Email is required';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'][] = 'Invalid email format';
        } else {
            $sanitizedData['email'] = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
        }

        if (empty($data['password'])) {
            $errors['password'][] = 'Password is required';
        } else {
            $sanitizedData['password'] = $data['password'];
        }

        return new ValidationResult(
            isValid: empty($errors),
            errors: $errors,
            sanitizedData: $sanitizedData
        );
    }
}
