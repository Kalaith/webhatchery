<?php
// index.php - Main entry point for Auth API
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/auth-middleware.php';
require_once __DIR__ . '/database.php';

// Enable CORS for frontend development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove trailing slashes and normalize path
$path = rtrim($path, '/');

log_debug("API Request", ['method' => $method, 'path' => $path]);

switch (true) {
    case $method === 'GET' && $path === '/api/auth/me':
        // Get current authenticated user profile
        $authUser = require_auth();
        log_debug("Authenticated user from token", ['sub' => $authUser->sub, 'email' => $authUser->email ?? 'no-email']);
        
        // Try to find user in our "database" by Auth0 sub first, then by email
        $dbUser = MockDatabase::findUserByAuth0Sub($authUser->sub);
        
        if (!$dbUser && isset($authUser->email)) {
            $dbUser = MockDatabase::findUserByEmail($authUser->email);
            
            // If found by email but no Auth0 sub, update the record
            if ($dbUser && !$dbUser['auth0_sub']) {
                log_debug("Found user by email, linking Auth0 sub");
                // In a real app, you'd update the database here
            }
        }
        
        if (!$dbUser) {
            // User authenticated with Auth0 but not in our database
            send_json([
                'error' => 'User not found in database',
                'message' => 'Please complete your registration',
                'auth0_user' => [
                    'sub' => $authUser->sub,
                    'email' => $authUser->email ?? null,
                    'name' => $authUser->name ?? null
                ]
            ], 401);
        }
        
        send_json(['data' => $dbUser], 200);
        break;
        
    case $method === 'POST' && $path === '/api/auth/register':
        // Register a new user
        $authUser = require_auth();
        $requestBody = json_decode(file_get_contents('php://input'), true);
        
        if (!$requestBody) {
            send_json(['error' => 'Invalid request body'], 400);
        }
        
        // Check if user already exists
        $existingUser = MockDatabase::findUserByAuth0Sub($authUser->sub);
        if ($existingUser) {
            send_json(['error' => 'User already registered'], 409);
        }
        
        // Create new user
        $newUser = MockDatabase::createUser([
            'email' => $authUser->email ?? $requestBody['email'],
            'firstName' => $requestBody['firstName'] ?? '',
            'lastName' => $requestBody['lastName'] ?? '',
            'membershipType' => $requestBody['membershipType'] ?? 'member',
            'auth0_sub' => $authUser->sub
        ]);
        
        send_json(['data' => $newUser, 'message' => 'User registered successfully'], 201);
        break;
        
    case $method === 'POST' && $path === '/api/auth/login':
        // Auth0 handles login via frontend, so just return error
        send_json(['error' => 'Login handled by Auth0 Universal Login'], 400);
        break;
        
    case $method === 'POST' && $path === '/api/auth/logout':
        // Logout is handled by frontend/Auth0, but you can clear cookies here if needed
        send_json(['message' => 'Logout successful'], 200);
        break;
        
    case $method === 'GET' && $path === '/api/auth/profile':
        // Legacy endpoint - redirect to /me
        $user = require_auth();
        send_json(['user' => $user], 200);
        break;
        
    case $method === 'GET' && $path === '/api/users':
        // Get all users (admin only in real app)
        $authUser = require_auth();
        $users = MockDatabase::getAllUsers();
        send_json(['data' => $users], 200);
        break;
        
    case $method === 'GET' && $path === '/api/health':
        // Health check endpoint
        send_json([
            'status' => 'healthy', 
            'timestamp' => date('c'),
            'version' => '1.0.0',
            'environment' => $_ENV['APP_ENV'] ?? 'production'
        ], 200);
        break;
        
    default:
        send_json([
            'error' => 'Endpoint not found', 
            'path' => $path, 
            'method' => $method,
            'available_endpoints' => [
                'GET /api/auth/me',
                'POST /api/auth/register', 
                'GET /api/users',
                'GET /api/health'
            ]
        ], 404);
}
