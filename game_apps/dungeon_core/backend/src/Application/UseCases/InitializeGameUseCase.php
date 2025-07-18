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
                'manaRegen' => $game->getManaRegen(),
                'gold' => $game->getGold(),
                'souls' => $game->getSouls(),
                'day' => $game->getDay(),
                'hour' => $game->getHour(),
                'status' => $game->getStatus(),
                'speed' => 1,
                'selectedRoom' => null,
                'selectedMonster' => null,
                'modalOpen' => true,
                'dungeonLevel' => 1,
                'adventurerParties' => [],
                'nextPartySpawn' => 8, // First party spawns at 8 AM
                'totalFloors' => 1,
                'deepCoreBonus' => 0,
                'unlockedMonsterSpecies' => ['Mimetic'], // Start with Mimetic unlocked
                'monsterExperience' => [], // Empty object for monster experience
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
            'floors' => [
                [
                    'id' => time(),
                    'number' => 1,
                    'rooms' => [
                        [
                            'id' => $entranceRoomId,
                            'type' => 'entrance',
                            'position' => 0,
                            'floorNumber' => 1,
                            'monsters' => [],
                            'roomUpgrade' => null,
                            'explored' => false,
                            'loot' => 0
                        ],
                        [
                            'id' => $coreRoomId,
                            'type' => 'core',
                            'position' => 1,
                            'floorNumber' => 1,
                            'monsters' => [],
                            'roomUpgrade' => null,
                            'explored' => false,
                            'loot' => 0
                        ]
                    ],
                    'isDeepest' => true
                ]
            ],
            'monsters' => $this->dungeonRepo->getMonsters($game->getId())
        ];
    }
}