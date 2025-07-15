<?php
// auth-middleware.php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Firebase\JWT\Key;

function verify_jwt($token, $config) {
    try {
        $jwksUri = "https://{$config['auth0']['domain']}/.well-known/jwks.json";
        
        // Cache JWKS for better performance (in production, consider proper caching)
        $jwks = json_decode(file_get_contents($jwksUri), true);
        
        if (!$jwks) {
            throw new Exception('Unable to fetch JWKS from Auth0');
        }
        
        // Parse the JWKS and decode the token
        $keySet = JWK::parseKeySet($jwks);
        $decoded = JWT::decode($token, $keySet);
        
        // Verify audience if configured
        if (isset($config['auth0']['audience']) && $config['auth0']['audience']) {
            if (!isset($decoded->aud) || $decoded->aud !== $config['auth0']['audience']) {
                throw new Exception('Invalid audience');
            }
        }
        
        // Verify issuer
        $expectedIssuer = "https://{$config['auth0']['domain']}/";
        if (!isset($decoded->iss) || $decoded->iss !== $expectedIssuer) {
            throw new Exception('Invalid issuer');
        }
        
        return $decoded;
    } catch (Exception $e) {
        error_log("JWT verification failed: " . $e->getMessage());
        throw $e;
    }
}

function require_auth() {
    $config = require __DIR__ . '/config.php';
    $token = getBearerToken();
    
    if (!$token) {
        send_json([
            'error' => 'Authentication required', 
            'message' => 'No bearer token provided in Authorization header'
        ], 401);
    }
    
    try {
        $user = verify_jwt($token, $config);
        return $user;
    } catch (Exception $e) {
        $errorMessage = $e->getMessage();
        $statusCode = 401;
        
        // Provide more specific error messages for debugging
        if (strpos($errorMessage, 'Expired token') !== false) {
            $message = 'Token has expired, please log in again';
        } elseif (strpos($errorMessage, 'Invalid audience') !== false) {
            $message = 'Token audience mismatch';
        } elseif (strpos($errorMessage, 'Invalid issuer') !== false) {
            $message = 'Token issuer mismatch';
        } else {
            $message = 'Invalid or malformed token';
        }
        
        send_json([
            'error' => 'Authentication failed',
            'message' => $message,
            'details' => $errorMessage
        ], $statusCode);
    }
}
