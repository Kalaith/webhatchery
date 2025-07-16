<?php

namespace DungeonCore\Infrastructure\Database\MySQL;

use DungeonCore\Domain\Entities\Game;
use DungeonCore\Domain\Repositories\GameRepositoryInterface;
use PDO;

class MySQLGameRepository implements GameRepositoryInterface
{
    public function __construct(private PDO $connection) {}

    public function findBySessionId(string $sessionId): ?Game
    {
        $stmt = $this->connection->prepare(
            'SELECT * FROM players WHERE session_id = ?'
        );
        $stmt->execute([$sessionId]);
        $data = $stmt->fetch();

        return $data ? $this->mapToEntity($data) : null;
    }

    public function save(Game $game): void
    {
        $stmt = $this->connection->prepare(
            'UPDATE players SET mana = ?, gold = ?, souls = ?, day = ?, hour = ?, status = ? WHERE id = ?'
        );
        $stmt->execute([
            $game->getMana(),
            $game->getGold(),
            $game->getSouls(),
            $game->getDay(),
            $game->getHour(),
            $game->getStatus(),
            $game->getId()
        ]);
    }

    public function create(string $sessionId): Game
    {
        $stmt = $this->connection->prepare(
            'INSERT INTO players (session_id, mana, max_mana, gold, souls, day, hour, status) 
             VALUES (?, 50, 100, 100, 0, 1, 6, "Open")'
        );
        $stmt->execute([$sessionId]);
        
        $id = $this->connection->lastInsertId();
        return new Game($id, 50, 100, 100, 0, 1, 6, 'Open');
    }

    private function mapToEntity(array $data): Game
    {
        return new Game(
            $data['id'],
            $data['mana'],
            $data['max_mana'],
            $data['gold'],
            $data['souls'],
            $data['day'],
            $data['hour'],
            $data['status']
        );
    }
}