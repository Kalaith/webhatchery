<?php

namespace DungeonCore\Domain\Services;

class GameLogic
{
    public function calculateMonsterCost(string $monsterType, int $floorNumber, bool $isBossRoom = false): int
    {
        $baseCosts = [
            'Goblin' => 10,
            'Orc' => 20,
            'Slime' => 8,
            'False Chest' => 15
        ];
        
        $baseCost = $baseCosts[$monsterType] ?? 10;
        $floorMultiplier = 1 + ($floorNumber - 1) * 0.5; // 50% increase per floor
        $bossMultiplier = $isBossRoom ? 2.0 : 1.0;
        
        return (int) ceil($baseCost * $floorMultiplier * $bossMultiplier);
    }

    public function calculateRoomCost(int $totalRooms, string $roomType): int
    {
        $baseCost = 20;
        $linearIncrease = $totalRooms * 5;
        $totalCost = $baseCost + $linearIncrease;
        
        if ($roomType === 'boss') {
            $totalCost += 30;
        }
        
        return max(5, (int) (ceil($totalCost / 5) * 5)); // Round to nearest 5
    }

    public function calculateRoomCapacity(int $roomPosition, int $monsterTier): int
    {
        $baseCapacity = $roomPosition * 2;
        return (int) floor($baseCapacity / $monsterTier);
    }

    public function getMonsterStats(string $monsterType): array
    {
        $stats = [
            'Goblin' => ['hp' => 25, 'attack' => 8, 'defense' => 3, 'tier' => 1],
            'Orc' => ['hp' => 40, 'attack' => 12, 'defense' => 6, 'tier' => 2],
            'Slime' => ['hp' => 20, 'attack' => 5, 'defense' => 2, 'tier' => 1],
            'False Chest' => ['hp' => 30, 'attack' => 10, 'defense' => 4, 'tier' => 1]
        ];
        
        return $stats[$monsterType] ?? ['hp' => 20, 'attack' => 5, 'defense' => 2, 'tier' => 1];
    }
}