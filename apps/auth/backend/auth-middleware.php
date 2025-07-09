<?php
// auth-middleware.php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;

function verify_jwt($token, $config) {
    $jwksUri = "https://{$config['auth0']['domain']}/.well-known/jwks.json";
    $jwks = json_decode(file_get_contents($jwksUri), true);
    $decoded = JWT::decode($token, JWK::parseKeySet($jwks), ['RS256']);
    return $decoded;
}

function require_auth() {
    $config = require __DIR__ . '/config.php';
    $token = getBearerToken();
    if (!$token) {
        send_json(['error' => 'No token provided'], 401);
    }
    try {
        $user = verify_jwt($token, $config);
        return $user;
    } catch (Exception $e) {
        send_json(['error' => 'Invalid token', 'details' => $e->getMessage()], 401);
    }
}
