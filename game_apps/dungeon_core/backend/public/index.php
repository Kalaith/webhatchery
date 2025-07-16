<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use DungeonCore\Controllers\GameController;
use DungeonCore\Controllers\DungeonController;
use DungeonCore\Application\UseCases\GetGameStateUseCase;
use DungeonCore\Application\UseCases\PlaceMonsterUseCase;
use DungeonCore\Application\UseCases\AddRoomUseCase;
use DungeonCore\Infrastructure\Database\MySQL\MySQLGameRepository;
use DungeonCore\Infrastructure\Database\MySQL\MySQLDungeonRepository;
use DungeonCore\Domain\Services\GameLogic;

// Database connection
$config = require __DIR__ . '/../config/database.php';
$dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";
$pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);

// Repositories
$gameRepo = new MySQLGameRepository($pdo);
$dungeonRepo = new MySQLDungeonRepository($pdo);

// Services
$gameLogic = new GameLogic();

// Use Cases
$getGameStateUseCase = new GetGameStateUseCase($gameRepo, $dungeonRepo);
$placeMonsterUseCase = new PlaceMonsterUseCase($gameRepo, $dungeonRepo);
$addRoomUseCase = new AddRoomUseCase($gameRepo, $dungeonRepo);

// Controllers
$gameController = new GameController($getGameStateUseCase, $placeMonsterUseCase);
$dungeonController = new DungeonController($addRoomUseCase);

// Create Slim app
$app = AppFactory::create();

// Add CORS middleware
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization, X-Session-ID')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

// Routes
$app->get('/api/game/state', [$gameController, 'getState']);
$app->post('/api/game/place-monster', [$gameController, 'placeMonster']);
$app->post('/api/dungeon/add-room', [$dungeonController, 'addRoom']);

// Handle preflight requests
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->run();