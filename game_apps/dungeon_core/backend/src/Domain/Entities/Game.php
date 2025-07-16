<?php

namespace DungeonCore\Domain\Entities;

class Game
{
    public function __construct(
        private int $id,
        private int $mana,
        private int $maxMana,
        private int $gold,
        private int $souls,
        private int $day,
        private int $hour,
        private string $status = 'Open'
    ) {}

    public function getId(): int { return $this->id; }
    public function getMana(): int { return $this->mana; }
    public function getMaxMana(): int { return $this->maxMana; }
    public function getGold(): int { return $this->gold; }
    public function getSouls(): int { return $this->souls; }
    public function getDay(): int { return $this->day; }
    public function getHour(): int { return $this->hour; }
    public function getStatus(): string { return $this->status; }

    public function spendMana(int $amount): bool
    {
        if ($this->mana < $amount) {
            return false;
        }
        $this->mana -= $amount;
        return true;
    }

    public function addMana(int $amount): void
    {
        $this->mana = min($this->mana + $amount, $this->maxMana);
    }

    public function spendGold(int $amount): bool
    {
        if ($this->gold < $amount) {
            return false;
        }
        $this->gold -= $amount;
        return true;
    }

    public function addGold(int $amount): void
    {
        $this->gold += $amount;
    }

    public function addSouls(int $amount): void
    {
        $this->souls += $amount;
    }

    public function advanceTime(): void
    {
        $this->hour++;
        if ($this->hour >= 24) {
            $this->hour = 0;
            $this->day++;
        }
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }
}