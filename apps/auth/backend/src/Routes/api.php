<?php

use Slim\Routing\RouteCollectorProxy;
use App\Controllers\AuthController;
use App\Middleware\JwtAuthMiddleware;

// API Routes
$app->group('/api', function (RouteCollectorProxy $group) {
    // Health check endpoint
    $group->get('/health', function($request, $response) {
        $response->getBody()->write(json_encode([
            'success' => true,
            'status' => 'healthy',
            'timestamp' => date('Y-m-d H:i:s')
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Public Authentication Routes (No Auth Required)
    $group->post('/auth/register', [AuthController::class, 'register']);
    $group->post('/auth/login', [AuthController::class, 'login']);

    // Protected Routes (JWT Authentication Required)
    $group->group('', function (RouteCollectorProxy $protected) {
        // Authentication Routes (Protected)
        $protected->get('/auth/me', [AuthController::class, 'getCurrentUser']);
        $protected->get('/auth/user', [AuthController::class, 'getCurrentUser']); // Alternative endpoint
        $protected->post('/auth/logout', [AuthController::class, 'logout']);
    })->add(JwtAuthMiddleware::class);
});
