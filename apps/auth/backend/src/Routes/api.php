<?php

use Slim\Routing\RouteCollectorProxy;
use App\Controllers\AuthController;
use App\Controllers\AdminController;
use App\Middleware\JwtAuthMiddleware;

// API Routes
$app->group('/api', function (RouteCollectorProxy $group) {
    // Public Health Check (No Auth Required)
    $group->get('/health', function ($request, $response) {
        $payload = json_encode([
            'success' => true,
            'message' => 'Auth API is running',
            'timestamp' => date('Y-m-d H:i:s'),
            'version' => '1.0.0'
        ]);
        
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Debug JWT endpoint (Development only)
    $group->get('/debug/jwt', function ($request, $response) {
        if ($_ENV['APP_ENV'] !== 'development') {
            $payload = json_encode(['success' => false, 'message' => 'Debug endpoint only available in development']);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type', 'application/json')->withStatus(403);
        }

        $authHeader = $request->getHeaderLine('Authorization');
        $debugInfo = [
            'success' => true,
            'auth_header' => $authHeader,
            'jwt_secret_prefix' => substr($_ENV['JWT_SECRET'] ?? 'default', 0, 10) . '...',
            'environment' => $_ENV['APP_ENV'] ?? 'unknown'
        ];

        if ($authHeader && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
            $debugInfo['token_prefix'] = substr($token, 0, 20) . '...';
            
            try {
                $jwtSecret = $_ENV['JWT_SECRET'] ?? 'your_jwt_secret_key_here';
                $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($jwtSecret, 'HS256'));
                $debugInfo['token_decoded'] = true;
                $debugInfo['token_payload'] = $decoded;
            } catch (\Exception $e) {
                $debugInfo['token_decoded'] = false;
                $debugInfo['decode_error'] = $e->getMessage();
            }
        }

        $payload = json_encode($debugInfo, JSON_PRETTY_PRINT);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Public Authentication Routes (No Auth Required)
    $group->post('/register', [AuthController::class, 'register']);
    $group->post('/login', [AuthController::class, 'login']);

    // Protected Routes (JWT Authentication Required)
    $group->group('', function (RouteCollectorProxy $protected) {
        // Authentication Routes (Protected)
        $protected->get('/me', [AuthController::class, 'getCurrentUser']);
        $protected->get('/user', [AuthController::class, 'getCurrentUser']); // Alternative endpoint
        $protected->post('/logout', [AuthController::class, 'logout']);
        
        // Admin Routes (Protected - Admin access required)
        $protected->get('/admin/users', [AdminController::class, 'getAllUsers']);
        $protected->get('/admin/roles', [AdminController::class, 'getAllRoles']);
        $protected->post('/admin/users/assign-role', [AdminController::class, 'assignUserRole']);
        $protected->post('/admin/users/remove-role', [AdminController::class, 'removeUserRole']);
        $protected->put('/admin/users/{userId}', [AdminController::class, 'updateUser']);
        $protected->delete('/admin/users/{userId}', [AdminController::class, 'deleteUser']);
        $protected->post('/admin/users/{userId}/reset-password', [AdminController::class, 'resetUserPassword']);
        $protected->post('/admin/users/{userId}/deactivate', [AdminController::class, 'deactivateUser']);
    })->add(JwtAuthMiddleware::class);
});
