<?php

namespace DungeonCore\Infrastructure\Database\MySQL;

use DungeonCore\Domain\Entities\Monster;
use DungeonCore\Domain\Repositories\DungeonRepositoryInterface;
use PDO;

class MySQLDungeonRepository implements DungeonRepositoryInterface
{
    public function __construct(private PDO $connection) {}

    public function addRoom(int $gameId, int $floorNumber, string $roomType, int $position): int
    {
        // Get or create dungeon
        $dungeonId = $this->getDungeonId($gameId);
        error_log("Got dungeon ID: $dungeonId for game ID: $gameId");
        
        // Get or create floor
        $floorId = $this->getFloorId($dungeonId, $floorNumber);
        error_log("Got floor ID: $floorId for dungeon ID: $dungeonId, floor number: $floorNumber");
        
        // Add room
        $stmt = $this->connection->prepare(
            'INSERT INTO rooms (floor_id, type, position) VALUES (?, ?, ?)'
        );
        $stmt->execute([$floorId, $roomType, $position]);
        
        $roomId = $this->connection->lastInsertId();
        error_log("Created room ID: $roomId with type: $roomType, position: $position");
        
        return $roomId;
    }

    public function getRooms(int $gameId): array
    {
        error_log("Looking for rooms for game ID: $gameId");
        $stmt = $this->connection->prepare(
            'SELECT r.*, f.number as floor_number 
             FROM rooms r 
             JOIN floors f ON r.floor_id = f.id 
             JOIN dungeons d ON f.dungeon_id = d.id 
             WHERE d.player_id = ?
             ORDER BY f.number, r.position'
        );
        $stmt->execute([$gameId]);
        
        $rooms = [];
        while ($data = $stmt->fetch()) {
            error_log("Found room: " . json_encode($data));
            $rooms[] = [
                'id' => $data['id'],
                'type' => $data['type'],
                'position' => $data['position'],
                'floor_number' => $data['floor_number'],
                'explored' => $data['explored'] ?? false,
                'loot' => $data['loot'] ?? 0
            ];
        }
        
        error_log("Total rooms found: " . count($rooms));
        return $rooms;
    }

    public function placeMonster(int $roomId, string $monsterType, int $hp, int $maxHp, bool $isBoss): Monster
    {
        $stmt = $this->connection->prepare(
            'INSERT INTO monsters (room_id, type, hp, max_hp, is_boss) VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([$roomId, $monsterType, $hp, $maxHp, $isBoss]);
        
        $id = $this->connection->lastInsertId();
        return new Monster($id, $roomId, $monsterType, $hp, $maxHp, true, $isBoss);
    }

    public function getMonsters(int $gameId): array
    {
        $stmt = $this->connection->prepare(
            'SELECT m.* FROM monsters m 
             JOIN rooms r ON m.room_id = r.id 
             JOIN floors f ON r.floor_id = f.id 
             JOIN dungeons d ON f.dungeon_id = d.id 
             WHERE d.player_id = ?'
        );
        $stmt->execute([$gameId]);
        
        $monsters = [];
        while ($data = $stmt->fetch()) {
            $monsters[] = new Monster(
                $data['id'],
                $data['room_id'],
                $data['type'],
                $data['hp'],
                $data['max_hp'],
                $data['alive'],
                $data['is_boss']
            );
        }
        
        return $monsters;
    }

    public function respawnMonsters(int $gameId): void
    {
        $stmt = $this->connection->prepare(
            'UPDATE monsters m 
             JOIN rooms r ON m.room_id = r.id 
             JOIN floors f ON r.floor_id = f.id 
             JOIN dungeons d ON f.dungeon_id = d.id 
             SET m.hp = m.max_hp, m.alive = 1 
             WHERE d.player_id = ?'
        );
        $stmt->execute([$gameId]);
    }

    public function getRoomCapacity(int $roomId): int
    {
        $stmt = $this->connection->prepare('SELECT position FROM rooms WHERE id = ?');
        $stmt->execute([$roomId]);
        $position = $stmt->fetchColumn();
        
        return $position * 2; // Room capacity = position * 2
    }

    public function getMonsterCount(int $roomId): int
    {
        $stmt = $this->connection->prepare('SELECT COUNT(*) FROM monsters WHERE room_id = ?');
        $stmt->execute([$roomId]);
        return $stmt->fetchColumn();
    }

    private function getDungeonId(int $gameId): int
    {
        $stmt = $this->connection->prepare('SELECT id FROM dungeons WHERE player_id = ?');
        $stmt->execute([$gameId]);
        $dungeonId = $stmt->fetchColumn();
        
        if (!$dungeonId) {
            $stmt = $this->connection->prepare('INSERT INTO dungeons (player_id) VALUES (?)');
            $stmt->execute([$gameId]);
            $dungeonId = $this->connection->lastInsertId();
        }
        
        return $dungeonId;
    }

    private function getFloorId(int $dungeonId, int $floorNumber): int
    {
        $stmt = $this->connection->prepare('SELECT id FROM floors WHERE dungeon_id = ? AND number = ?');
        $stmt->execute([$dungeonId, $floorNumber]);
        $floorId = $stmt->fetchColumn();
        
        if (!$floorId) {
            $stmt = $this->connection->prepare('INSERT INTO floors (dungeon_id, number) VALUES (?, ?)');
            $stmt->execute([$dungeonId, $floorNumber]);
            $floorId = $this->connection->lastInsertId();
        }
        
        return $floorId;
    }
}