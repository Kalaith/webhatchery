<?php

namespace DungeonCore\Controllers;

use DungeonCore\Application\UseCases\GetGameStateUseCase;
use DungeonCore\Application\UseCases\PlaceMonsterUseCase;
use DungeonCore\Application\UseCases\InitializeGameUseCase;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class GameController
{
    public function __construct(
        private GetGameStateUseCase $getGameStateUseCase,
        private PlaceMonsterUseCase $placeMonsterUseCase,
        private InitializeGameUseCase $initializeGameUseCase
    ) {}

    public function initialize(Request $request, Response $response): Response
    {
        $sessionId = $this->getSessionId($request);
        $result = $this->initializeGameUseCase->execute($sessionId);
        
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getState(Request $request, Response $response): Response
    {
        $sessionId = $this->getSessionId($request);
        $result = $this->getGameStateUseCase->execute($sessionId);
        
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function placeMonster(Request $request, Response $response): Response
    {
        $sessionId = $this->getSessionId($request);
        $data = json_decode($request->getBody()->getContents(), true);
        
        $result = $this->placeMonsterUseCase->execute(
            $sessionId,
            $data['roomId'],
            $data['monsterType'],
            $data['cost']
        );
        
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    private function getSessionId(Request $request): string
    {
        // Simple session handling - could be improved with proper session management
        $headers = $request->getHeaders();
        return $headers['X-Session-ID'][0] ?? session_id();
    }
}