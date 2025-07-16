<?php

namespace DungeonCore\Application\UseCases;

use DungeonCore\Domain\Repositories\GameRepositoryInterface;
use DungeonCore\Domain\Repositories\DungeonRepositoryInterface;

class GetGameStateUseCase
{
    public function __construct(
        private GameRepositoryInterface $gameRepo,
        private DungeonRepositoryInterface $dungeonRepo
    ) {}

    public function execute(string $sessionId): array
    {
        $game = $this->gameRepo->findBySessionId($sessionId);
        
        if (!$game) {
            // Create new game for session
            $game = $this->gameRepo->create($sessionId);
        }

        $monsters = $this->dungeonRepo->getMonsters($game->getId());

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
            'monsters' => array_map(fn($monster) => [
                'id' => $monster->getId(),
                'roomId' => $monster->getRoomId(),
                'type' => $monster->getType(),
                'hp' => $monster->getHp(),
                'maxHp' => $monster->getMaxHp(),
                'alive' => $monster->isAlive(),
                'isBoss' => $monster->isBoss()
            ], $monsters)
        ];
    }
}