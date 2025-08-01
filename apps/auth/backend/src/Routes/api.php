<?php

use Slim\Routing\RouteCollectorProxy;
use App\Controllers\AuthController;
use App\Middleware\JwtAuthMiddleware;

// Root health check (for testing routing)
$app->get('/health', function($request, $response) {
    $response->getBody()->write(json_encode([
        'success' => true,
        'status' => 'healthy - root route',
        'timestamp' => date('Y-m-d H:i:s'),
        'base_path' => 'Root health endpoint working'
    ]));
    return $response->withHeader('Content-Type', 'application/json');
});

// Debug route to show routing info
$app->get('/debug', function($request, $response) {
    $uri = $request->getUri();
    $response->getBody()->write(json_encode([
        'success' => true,
        'debug' => [
            'path' => $uri->getPath(),
            'base_path' => $uri->getBasePath(),
            'query' => $uri->getQuery(),
            'full_url' => (string)$uri,
            'method' => $request->getMethod(),
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]));
    return $response->withHeader('Content-Type', 'application/json');
});

// API Routes
$app->group('/api', function (RouteCollectorProxy $group) {
    // Health check endpoint
    $group->get('/health', function($request, $response) {
        $response->getBody()->write(json_encode([
            'success' => true,
            'status' => 'healthy - api route',
            'timestamp' => date('Y-m-d H:i:s')
        ]));
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
    })->add(JwtAuthMiddleware::class);
});
