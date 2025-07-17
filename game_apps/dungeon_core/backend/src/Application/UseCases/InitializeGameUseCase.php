<?php

namespace DungeonCore\Application\UseCases;

use DungeonCore\Domain\Repositories\GameRepositoryInterface;
use DungeonCore\Domain\Repositories\DungeonRepositoryInterface;

class InitializeGameUseCase
{
    public function __construct(
        private GameRepositoryInterface $gameRepo,
        private DungeonRepositoryInterface $dungeonRepo
    ) {}

    public function execute(string $sessionId): array
    {
        $game = $this->gameRepo->findBySessionId($sessionId);
        
        if (!$game) {
            // Create new game with initial state
            $game = $this->gameRepo->create($sessionId);
            
            // Create initial dungeon structure
            $entranceRoomId = $this->dungeonRepo->addRoom($game->getId(), 1, 'entrance', 0);
            $coreRoomId = $this->dungeonRepo->addRoom($game->getId(), 1, 'core', 1);
        }

        return [
            'game' => [
                'id' => $game->getId(),
                'mana' => $game->getMana(),
                'maxMana' => $game->getMaxMana(),
                'gold' => $game->getGold(),
                'souls' => $game->getSouls(),
                'day' => $game->getDay(),
                'hour' => $game->getHour(),
                'status' => $game->getStatus()
            ],
            'initialData' => [
                'unlockedMonsterSpecies' => ['Mimetic'],
                'totalFloors' => 1,
                'deepCoreBonus' => 0,
                'log' => [
                    [
                        'message' => 'Welcome to Dungeon Core Simulator v1.2!',
                        'type' => 'system',
                        'timestamp' => time() * 1000
                    ],
                    [
                        'message' => 'Your dungeon starts with an entrance and core room. Add more rooms to expand!',
                        'type' => 'system', 
                        'timestamp' => time() * 1000
                    ]
                ]
            ],
            'monsters' => $this->dungeonRepo->getMonsters($game->getId())
        ];
    }
}