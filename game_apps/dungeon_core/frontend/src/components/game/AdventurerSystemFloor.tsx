import { useEffect, useRef } from "react";
import type { AdventurerParty, Adventurer, Room, Monster } from "../../types/game";
import { adventurerClasses, monsterTypes, GAME_CONSTANTS, getFloorScaling } from "../../data/gameData";
import { useGameStore } from "../../stores/gameStore";

export interface AdventurerSystemProps {
  running: boolean;
}

export const AdventurerSystem: React.FC<AdventurerSystemProps> = ({ running }) => {
  const gameStore = useGameStore();
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const movementTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate a random adventurer party with level scaling
  const generateParty = (id: number): AdventurerParty => {
    const partySize = Math.floor(Math.random() * (GAME_CONSTANTS.MAX_PARTY_SIZE - GAME_CONSTANTS.MIN_PARTY_SIZE + 1)) + GAME_CONSTANTS.MIN_PARTY_SIZE;
    const members: Adventurer[] = [];

    // Determine target floor based on party strength
    const maxFloor = Math.max(1, gameStore.totalFloors);
    const targetFloor = Math.min(maxFloor, Math.floor(Math.random() * 2) + 1); // Parties target floors 1-2 mostly
    const floorScaling = getFloorScaling(targetFloor);
    
    for (let i = 0; i < partySize; i++) {
      const classIdx = Math.floor(Math.random() * adventurerClasses.length);
      const advClass = adventurerClasses[classIdx];
      const level = Math.floor(Math.random() * (floorScaling.adventurerLevelRange[1] - floorScaling.adventurerLevelRange[0] + 1)) + floorScaling.adventurerLevelRange[0];
      
      // Scale stats based on level
      const levelMultiplier = 1 + (level - 1) * 0.1; // +10% stats per level
      const scaledStats = {
        hp: Math.floor(advClass.hp * levelMultiplier),
        attack: Math.floor(advClass.attack * levelMultiplier),
        defense: Math.floor(advClass.defense * levelMultiplier)
      };
      
      members.push({
        id: i,
        classIdx,
        name: `${advClass.name} ${i + 1}`,
        level,
        hp: scaledStats.hp,
        maxHp: scaledStats.hp,
        alive: true,
        experience: level * 100,
        gold: Math.floor(Math.random() * 50) + 10,
        equipment: {
          weapon: "Iron Sword",
          armor: "Leather Armor", 
          accessory: "Silver Ring"
        },
        conditions: [],
        scaledStats
      });
    }

    return {
      id,
      members,
      currentFloor: 1,
      currentRoom: 0, // Start at entrance
      retreating: false,
      casualties: 0,
      loot: 0,
      entryTime: Date.now(),
      targetFloor
    };
  };

  // Combat resolution between party and monsters in a room
  const resolveCombat = (party: AdventurerParty, room: Room): { partyDamage: number, monsterDeaths: Monster[], loot: number, partyWins: boolean } => {
    let partyDamage = 0;
    const monsterDeaths: Monster[] = [];
    let loot = 0;

    const aliveAdventurers = party.members.filter(a => a.alive);
    const aliveMonsters = room.monsters.filter(m => m.alive);

    if (aliveMonsters.length === 0) return { partyDamage: 0, monsterDeaths: [], loot: 0, partyWins: true };
    if (aliveAdventurers.length === 0) return { partyDamage: 0, monsterDeaths: [], loot: 0, partyWins: false };

    // Combat rounds
    for (let round = 0; round < 5 && aliveAdventurers.some(a => a.alive) && aliveMonsters.some(m => m.alive); round++) {
      // Adventurers attack first
      aliveAdventurers.filter(a => a.alive).forEach(adventurer => {
        const targets = aliveMonsters.filter(m => m.alive);
        if (targets.length === 0) return;
        
        const target = targets[Math.floor(Math.random() * targets.length)];
        const damage = Math.max(1, adventurer.scaledStats.attack - (target.scaledStats?.defense || 0) + Math.floor(Math.random() * 3) - 1);
        target.hp -= damage;
        
        if (target.hp <= 0) {
          target.alive = false;
          monsterDeaths.push(target);
          
          // Loot calculation
          const monsterType = monsterTypes[target.type];
          let baseLoot = Math.floor(monsterType.baseCost * 0.8);
          
          // Boss room bonus
          if (room.type === 'boss') {
            baseLoot *= GAME_CONSTANTS.BOSS_ROOM_LOOT_MULTIPLIER;
          }
          
          loot += baseLoot;
        }
      });

      // Monsters attack back
      aliveMonsters.filter(m => m.alive).forEach(monster => {
        const targets = aliveAdventurers.filter(a => a.alive);
        if (targets.length === 0) return;
        
        const target = targets[Math.floor(Math.random() * targets.length)];
        const damage = Math.max(1, (monster.scaledStats?.attack || 0) - target.scaledStats.defense + Math.floor(Math.random() * 3) - 1);
        target.hp -= damage;
        partyDamage += damage;
        
        if (target.hp <= 0) {
          target.alive = false;
          party.casualties++;
        }
      });

      // Boss abilities
      aliveMonsters.filter(m => m.alive && m.isBoss).forEach(boss => {
        const monsterType = monsterTypes[boss.type];
        if (monsterType.bossAbility) {
          // Simple boss ability implementation
          if (monsterType.name === "Troll" && boss.hp < boss.maxHp) {
            boss.hp = Math.min(boss.maxHp, boss.hp + 10); // Regeneration
          }
        }
      });
    }

    const partyWins = aliveMonsters.filter(m => m.alive).length === 0;
    return { partyDamage, monsterDeaths, loot, partyWins };
  };

  // Check if party should retreat
  const shouldRetreat = (party: AdventurerParty): boolean => {
    const casualtyRate = party.casualties / party.members.length;
    const floorDifference = party.currentFloor - party.targetFloor;
    
    // Higher retreat chance if underleveled for the floor
    const underleveled = floorDifference > 0;
    const retreatChance = casualtyRate >= GAME_CONSTANTS.RETREAT_THRESHOLD || 
                         (underleveled && Math.random() < GAME_CONSTANTS.RETREAT_CHANCE_UNDERLEVELED);
    
    return retreatChance;
  };

  // Move party through dungeon and handle encounters
  const updateParties = () => {
    gameStore.adventurerParties.forEach(party => {
      const currentFloor = gameStore.floors.find(f => f.number === party.currentFloor);
      if (!currentFloor) {
        gameStore.removeAdventurerParty(party.id);
        return;
      }

      const currentRoom = currentFloor.rooms.find(r => r.position === party.currentRoom);
      if (!currentRoom) {
        gameStore.removeAdventurerParty(party.id);
        return;
      }

      // Check if party should retreat
      if (shouldRetreat(party) && !party.retreating) {
        party.retreating = true;
        gameStore.updateAdventurerParty(party.id, { retreating: true });
        gameStore.addLog({
          message: `Party ${party.id} is retreating from floor ${party.currentFloor}!`,
          type: "adventurer"
        });
        return;
      }

      // Handle retreat movement
      if (party.retreating) {
        if (party.currentRoom > 0) {
          gameStore.updateAdventurerParty(party.id, { currentRoom: party.currentRoom - 1 });
        } else if (party.currentFloor > 1) {
          // Move to previous floor's last room
          const prevFloor = gameStore.floors.find(f => f.number === party.currentFloor - 1);
          if (prevFloor) {
            const lastRoom = Math.max(...prevFloor.rooms.map(r => r.position));
            gameStore.updateAdventurerParty(party.id, { 
              currentFloor: party.currentFloor - 1,
              currentRoom: lastRoom
            });
          }
        } else {
          // Escaped!
          gameStore.removeAdventurerParty(party.id);
          gameStore.addLog({
            message: `Party ${party.id} escaped with ${party.loot} gold!`,
            type: "adventurer"
          });
        }
        return;
      }

      // Combat in current room (skip entrance and core rooms)
      if (currentRoom.type !== 'entrance' && currentRoom.type !== 'core' && currentRoom.monsters.length > 0) {
        const combat = resolveCombat(party, currentRoom);
        
        if (combat.monsterDeaths.length > 0) {
          // Update room to remove dead monsters
          const updatedFloors = gameStore.floors.map(floor => {
            if (floor.number === party.currentFloor) {
              return {
                ...floor,
                rooms: floor.rooms.map(room => {
                  if (room.position === party.currentRoom) {
                    return {
                      ...room,
                      monsters: room.monsters.filter(m => m.alive)
                    };
                  }
                  return room;
                })
              };
            }
            return floor;
          });

          gameStore.setFloors(updatedFloors);
          
          gameStore.addLog({
            message: `Party ${party.id} defeated ${combat.monsterDeaths.length} monsters on floor ${party.currentFloor}, room ${party.currentRoom}!`,
            type: "combat"
          });
        }

        party.loot += combat.loot;
        gameStore.updateAdventurerParty(party.id, { loot: party.loot });

        // Check for boss room soul reward
        if (currentRoom.type === 'boss' && combat.partyWins) {
          gameStore.gainSouls(5);
          gameStore.addLog({
            message: `Boss defeated! Gained 5 souls!`,
            type: "combat"
          });
        }

        // Remove party if all members dead
        const aliveMembers = party.members.filter(m => m.alive);
        if (aliveMembers.length === 0) {
          gameStore.removeAdventurerParty(party.id);
          gameStore.gainGold(Math.floor(party.loot * 0.5)); // Dungeon core gets some loot
          gameStore.addLog({
            message: `Party ${party.id} was completely wiped out! Gained ${Math.floor(party.loot * 0.5)} gold.`,
            type: "combat"
          });
          return;
        }

        // If combat was lost, force retreat
        if (!combat.partyWins) {
          party.retreating = true;
          gameStore.updateAdventurerParty(party.id, { retreating: true });
          return;
        }
      }

      // Move to next room/floor
      const maxRoomInFloor = Math.max(...currentFloor.rooms.map(r => r.position));
      if (party.currentRoom < maxRoomInFloor) {
        // Move to next room in current floor
        gameStore.updateAdventurerParty(party.id, { currentRoom: party.currentRoom + 1 });
      } else {
        // Try to move to next floor
        const nextFloor = gameStore.floors.find(f => f.number === party.currentFloor + 1);
        if (nextFloor && party.currentFloor < party.targetFloor) {
          gameStore.updateAdventurerParty(party.id, { 
            currentFloor: party.currentFloor + 1,
            currentRoom: 0 // Start at entrance of next floor
          });
          
          // Full heal before boss floor
          if (nextFloor.rooms.some(r => r.type === 'boss')) {
            const healedMembers = party.members.map(member => ({
              ...member,
              hp: member.alive ? member.maxHp : member.hp
            }));
            gameStore.updateAdventurerParty(party.id, { members: healedMembers });
            gameStore.addLog({
              message: `Party ${party.id} rested and healed before the boss floor!`,
              type: "adventurer"
            });
          }
        } else {
          // Reached target or no more floors - exit successfully
          gameStore.removeAdventurerParty(party.id);
          gameStore.addLog({
            message: `Party ${party.id} completed their adventure and left with ${party.loot} gold!`,
            type: "adventurer"
          });
        }
      }
    });
  };

  // Spawn new parties during open hours
  useEffect(() => {
    if (!running || gameStore.status !== 'Open') {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
      return;
    }

    spawnTimerRef.current = setInterval(() => {
      if (gameStore.status === 'Open' && Math.random() < GAME_CONSTANTS.ADVENTURER_SPAWN_CHANCE) {
        const newParty = generateParty(Date.now());
        gameStore.addAdventurerParty(newParty);
        gameStore.addLog({
          message: `New adventurer party (${newParty.members.length} level ${newParty.members[0].level} adventurers) entered the dungeon!`,
          type: "adventurer"
        });
      }
    }, GAME_CONSTANTS.TIME_ADVANCE_INTERVAL);

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [running, gameStore.status]);

  // Move parties and handle combat
  useEffect(() => {
    if (!running) {
      if (movementTimerRef.current) {
        clearInterval(movementTimerRef.current);
        movementTimerRef.current = null;
      }
      return;
    }

    movementTimerRef.current = setInterval(() => {
      updateParties();
    }, 2000 / gameStore.speed); // Movement speed based on game speed

    return () => {
      if (movementTimerRef.current) {
        clearInterval(movementTimerRef.current);
      }
    };
  }, [running, gameStore.speed, gameStore.adventurerParties]);

  // Respawn monsters when dungeon is empty during maintenance
  useEffect(() => {
    if (gameStore.status === 'Maintenance' && gameStore.adventurerParties.length === 0) {
      gameStore.respawnMonsters();
    }
  }, [gameStore.status, gameStore.adventurerParties.length]);

  return null; // This is a system component, no visual rendering
};
