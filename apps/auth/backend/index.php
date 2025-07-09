<?php
// index.php - Main entry point for Auth API
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/auth-middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch (true) {
    case $method === 'POST' && $path === '/api/auth/login':
        // Auth0 handles login via frontend, so just return error
        send_json(['error' => 'Login handled by Auth0 Universal Login'], 400);
        break;
    case $method === 'POST' && $path === '/api/auth/logout':
        // Logout is handled by frontend/Auth0, but you can clear cookies here if needed
        send_json(['message' => 'Logout successful'], 200);
        break;
    case $method === 'GET' && $path === '/api/auth/profile':
        $user = require_auth();
        send_json(['user' => $user], 200);
        break;
    default:
        send_json(['error' => 'Not found'], 404);
}
