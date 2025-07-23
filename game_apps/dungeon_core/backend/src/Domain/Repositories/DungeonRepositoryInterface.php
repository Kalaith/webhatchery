<?php

namespace DungeonCore\Domain\Repositories;

use DungeonCore\Domain\Entities\Monster;

interface DungeonRepositoryInterface
{
    public function addRoom(int $gameId, int $floorNumber, string $roomType, int $position): int;
    public function getRooms(int $gameId): array;
    public function placeMonster(int $roomId, string $monsterType, int $hp, int $maxHp, bool $isBoss): Monster;
    public function getMonsters(int $gameId): array;
    public function respawnMonsters(int $gameId): void;
    public function getRoomCapacity(int $roomId): int;
    public function getMonsterCount(int $roomId): int;
}