<?php
// index.php - Main entry point for Auth Portal API

declare(strict_types=1);

use Slim\Factory\AppFactory;
use DI\Container;
use Illuminate\Database\Capsule\Manager as Capsule;
use Dotenv\Dotenv;
use App\Middleware\CorsMiddleware;
use App\Actions\AuthActions;
use App\External\UserRepository;
use App\Controllers\AuthController;

require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Database setup
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => $_ENV['DB_HOST'],
    'port' => $_ENV['DB_PORT'],
    'database' => $_ENV['DB_DATABASE'],
    'username' => $_ENV['DB_USERNAME'],
    'password' => $_ENV['DB_PASSWORD'],
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

// Container setup
$container = new Container();

// Register dependencies
$container->set(UserRepository::class, function() {
    return new UserRepository();
});

$container->set(AuthActions::class, function($container) {
    return new AuthActions($container->get(UserRepository::class));
});

$container->set(AuthController::class, function($container) {
    return new AuthController($container->get(AuthActions::class));
});

$container->set(\App\Middleware\JwtAuthMiddleware::class, function($container) {
    return new \App\Middleware\JwtAuthMiddleware($container->get(AuthActions::class));
});

AppFactory::setContainer($container);

// Create Slim app
$app = AppFactory::create();

// Set base path for subdirectory deployment
if (isset($_ENV['APP_BASE_PATH'])) {
    $app->setBasePath($_ENV['APP_BASE_PATH']);
} else {
    // Default to /auth for this application
    $app->setBasePath('/auth');
}

// Add middleware
$app->add(new CorsMiddleware());
$app->addRoutingMiddleware();
$app->addBodyParsingMiddleware();

// Error middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorHandler = $errorMiddleware->getDefaultErrorHandler();
$errorHandler->forceContentType('application/json');

// Handle preflight OPTIONS requests
$app->options('/{routes:.*}', function ($request, $response) {
    return $response;
});

// Error handler for JSON responses
$errorMiddleware->setDefaultErrorHandler(function ($request, $exception, $displayErrorDetails) {
    $response = new \Slim\Psr7\Response();
    
    $statusCode = 500;
    if (method_exists($exception, 'getCode') && $exception->getCode() >= 400 && $exception->getCode() < 600) {
        $statusCode = $exception->getCode();
    }
    
    $payload = json_encode([
        'success' => false,
        'error' => [
            'message' => $exception->getMessage(),
            'code' => $statusCode
        ]
    ]);
    
    $response->getBody()->write($payload);
    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($statusCode);
});

// Load routes
require_once __DIR__ . '/../src/Routes/api.php';

$app->run();
