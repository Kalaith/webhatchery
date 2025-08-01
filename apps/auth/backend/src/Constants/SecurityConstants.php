<?php

namespace App\Constants;

/**
 * Security-related constants for the application
 */
class SecurityConstants
{
    // JWT Configuration
    public const JWT_EXPIRY_HOURS = 24;
    public const JWT_EXPIRY_SECONDS = self::JWT_EXPIRY_HOURS * 3600;
    public const JWT_ALGORITHM = 'HS256';
    public const JWT_MIN_SECRET_LENGTH = 32;
    
    // Authentication
    public const MAX_LOGIN_ATTEMPTS = 5;
    public const LOCKOUT_DURATION = 900; // 15 minutes in seconds
    public const PASSWORD_MIN_LENGTH = 8;
    
    // Password Requirements
    public const PASSWORD_REQUIRE_UPPERCASE = true;
    public const PASSWORD_REQUIRE_LOWERCASE = true;
    public const PASSWORD_REQUIRE_NUMBERS = true;
    public const PASSWORD_REQUIRE_SPECIAL_CHARS = true;
    
    // User Validation
    public const USERNAME_MIN_LENGTH = 3;
    public const USERNAME_MAX_LENGTH = 50;
    public const NAME_MAX_LENGTH = 50;
    public const EMAIL_MAX_LENGTH = 255;
    
    // Default Role
    public const DEFAULT_USER_ROLE = 'user';
}
