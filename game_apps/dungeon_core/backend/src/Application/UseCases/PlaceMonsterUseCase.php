<?php

namespace DungeonCore\Application\UseCases;

use DungeonCore\Domain\Repositories\GameRepositoryInterface;
use DungeonCore\Domain\Repositories\DungeonRepositoryInterface;

class PlaceMonsterUseCase
{
    public function __construct(
        private GameRepositoryInterface $gameRepo,
        private DungeonRepositoryInterface $dungeonRepo
    ) {}

    public function execute(string $sessionId, int $roomId, string $monsterType, int $cost): array
    {
        $game = $this->gameRepo->findBySessionId($sessionId);
        if (!$game) {
            return ['success' => false, 'error' => 'Game not found'];
        }

        // Check room capacity
        $capacity = $this->dungeonRepo->getRoomCapacity($roomId);
        $currentCount = $this->dungeonRepo->getMonsterCount($roomId);
        
        if ($currentCount >= $capacity) {
            return ['success' => false, 'error' => 'Room is full'];
        }

        // Check mana cost
        if (!$game->spendMana($cost)) {
            return ['success' => false, 'error' => 'Insufficient mana'];
        }

        // Place monster
        $hp = $this->getMonsterHp($monsterType);
        $monster = $this->dungeonRepo->placeMonster($roomId, $monsterType, $hp, $hp, false);
        
        // Save game state
        $this->gameRepo->save($game);

        return [
            'success' => true,
            'monster' => [
                'id' => $monster->getId(),
                'type' => $monster->getType(),
                'hp' => $monster->getHp()
            ]
        ];
    }

    private function getMonsterHp(string $monsterType): int
    {
        // Basic monster stats - could be moved to a service
        $stats = [
            'Goblin' => 25,
            'Orc' => 40,
            'Slime' => 20,
            'False Chest' => 30
        ];
        
        return $stats[$monsterType] ?? 20;
    }
}