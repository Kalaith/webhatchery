import { useEffect, useRef } from "react";
import type { AdventurerParty, Adventurer, DungeonFloor, Room, Monster } from "../../types/game";
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
import { useGameStore } from "../../stores/gameStore";

export interface AdventurerSystemProps {
  running: boolean;
}

export const AdventurerSystem: React.FC<AdventurerSystemProps> = ({ running }) => {
  const gameStore = useGameStore();
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const movementTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Pathfinding - simple A* or straight line for now
  const findPath = (_grid: GridCell[][], start: { x: number; y: number }, end: { x: number; y: number }) => {
    const path: { x: number; y: number }[] = [];
    let current = { ...start };
    
    while (current.x !== end.x || current.y !== end.y) {
      path.push({ ...current });
      
      if (current.x < end.x) current.x++;
      else if (current.x > end.x) current.x--;
      else if (current.y < end.y) current.y++;
      else if (current.y > end.y) current.y--;
    }
    
    path.push({ ...end });
    return path;
  };

  // Generate a random adventurer party
  const generateParty = (id: number): AdventurerParty => {
    const partySize = Math.floor(Math.random() * (GAME_CONSTANTS.MAX_PARTY_SIZE - GAME_CONSTANTS.MIN_PARTY_SIZE + 1)) + GAME_CONSTANTS.MIN_PARTY_SIZE;
    const members: Adventurer[] = [];

    for (let i = 0; i < partySize; i++) {
      const classIdx = Math.floor(Math.random() * adventurerClasses.length);
      const advClass = adventurerClasses[classIdx];
      
      members.push({
        id: i,
        classIdx,
        x: 0,
        y: 0,
        hp: advClass.hp,
        maxHp: advClass.hp,
        alive: true,
        experience: Math.floor(Math.random() * 100),
        level: 1,
        gold: Math.floor(Math.random() * 50) + 10,
        equipment: {
          weapon: "Rusty Sword",
          armor: "Cloth Robe", 
          accessory: "Worn Ring"
        },
        conditions: []
      });
    }

    // Find entrance and exit
    let entrance = { x: 0, y: 0 };
    let exit = { x: GAME_CONSTANTS.GRID_SIZE - 1, y: GAME_CONSTANTS.GRID_SIZE - 1 };
    
    for (let row of gameStore.grid) {
      for (let cell of row) {
        if (cell.isEntrance) entrance = { x: cell.x, y: cell.y };
        if (cell.isExit) exit = { x: cell.x, y: cell.y };
      }
    }

    const path = findPath(gameStore.grid, entrance, exit);

    return {
      id,
      members,
      currentX: entrance.x,
      currentY: entrance.y,
      pathIndex: 0,
      path,
      retreating: false,
      casualties: 0,
      loot: 0,
      entryTime: Date.now()
    };
  };

  // Combat resolution
  const resolveCombat = (party: AdventurerParty, monsters: Monster[], cell: GridCell): { partyDamage: number, monsterDeaths: Monster[], loot: number } => {
    let partyDamage = 0;
    const monsterDeaths: Monster[] = [];
    let loot = 0;

    const aliveAdventurers = party.members.filter(a => a.alive);
    const aliveMonsters = monsters.filter(m => m.alive);

    if (aliveMonsters.length === 0) return { partyDamage: 0, monsterDeaths: [], loot: 0 };

    // Each round of combat
    for (let round = 0; round < 3 && aliveAdventurers.length > 0 && aliveMonsters.length > 0; round++) {
      // Adventurers attack
      aliveAdventurers.forEach(adventurer => {
        if (aliveMonsters.length === 0) return;
        
        const target = aliveMonsters[Math.floor(Math.random() * aliveMonsters.length)];
        const advClass = adventurerClasses[adventurer.classIdx];
        const monsterType = monsterTypes[target.type];
        
        const damage = Math.max(1, advClass.attack - monsterType.defense + Math.floor(Math.random() * 3) - 1);
        target.hp -= damage;
        
        if (target.hp <= 0) {
          target.alive = false;
          monsterDeaths.push(target);
          loot += Math.floor(monsterType.baseCost * 0.5); // Half mana cost in gold
          
          // Remove dead monster from alive list
          const index = aliveMonsters.indexOf(target);
          if (index > -1) aliveMonsters.splice(index, 1);
        }
      });

      // Monsters attack back
      aliveMonsters.forEach(monster => {
        if (aliveAdventurers.length === 0) return;
        
        const target = aliveAdventurers[Math.floor(Math.random() * aliveAdventurers.length)];
        const monsterType = monsterTypes[monster.type];
        const advClass = adventurerClasses[target.classIdx];
        
        const damage = Math.max(1, monsterType.attack - advClass.defense + Math.floor(Math.random() * 3) - 1);
        target.hp -= damage;
        partyDamage += damage;
        
        if (target.hp <= 0) {
          target.alive = false;
          party.casualties++;
        }
      });
    }

    // Apply room-specific effects
    if (cell.roomType === 2) { // Trap Hallway
      const trapDamage = 7;
      aliveAdventurers.forEach(adv => {
        adv.hp -= trapDamage;
        partyDamage += trapDamage;
        if (adv.hp <= 0) {
          adv.alive = false;
          party.casualties++;
        }
      });
    }

    // Treasure room bonus
    if (cell.roomType === 3) { // Treasure Room
      loot *= GAME_CONSTANTS.TREASURE_ROOM_MULTIPLIER;
    }

    return { partyDamage, monsterDeaths, loot };
  };

  // Check if party should retreat
  const shouldRetreat = (party: AdventurerParty): boolean => {
    const casualtyRate = party.casualties / party.members.length;
    return casualtyRate >= GAME_CONSTANTS.RETREAT_THRESHOLD;
  };

  // Move party and handle encounters
  const updateParties = () => {
    gameStore.adventurerParties.forEach(party => {
      if (party.pathIndex >= party.path.length) {
        // Party reached exit
        gameStore.removeAdventurerParty(party.id);
        gameStore.gainGold(party.loot);
        gameStore.addLog({
          message: `Adventurer party ${party.id} completed the dungeon and looted ${party.loot} gold!`,
          type: "adventurer"
        });
        return;
      }

      // Check if party should retreat
      if (shouldRetreat(party) && !party.retreating) {
        party.retreating = true;
        gameStore.addLog({
          message: `Adventurer party ${party.id} is retreating due to heavy casualties!`,
          type: "adventurer"
        });
      }

      // Move to next position
      const nextPos = party.path[party.pathIndex];
      const cell = gameStore.grid[nextPos.y][nextPos.x];
      
      // Update party position
      gameStore.updateAdventurerParty(party.id, {
        currentX: nextPos.x,
        currentY: nextPos.y,
        pathIndex: party.pathIndex + 1
      });

      // Handle encounters
      if (cell.monsters.length > 0) {
        const combat = resolveCombat(party, cell.monsters, cell);
        
        if (combat.monsterDeaths.length > 0) {
          // Update grid to remove dead monsters
          gameStore.updateCell(nextPos.x, nextPos.y, {
            monsters: cell.monsters.filter(m => m.alive)
          });
          
          gameStore.addLog({
            message: `Party ${party.id} defeated ${combat.monsterDeaths.length} monsters and gained ${combat.loot} gold!`,
            type: "combat"
          });
        }

        party.loot += combat.loot;

        // Check for boss room soul reward
        if (cell.roomType === 4 && combat.monsterDeaths.length > 0) { // Boss Chamber
          gameStore.gainSouls(GAME_CONSTANTS.BOSS_ROOM_SOUL_REWARD);
          gameStore.addLog({
            message: `Boss defeated! Gained ${GAME_CONSTANTS.BOSS_ROOM_SOUL_REWARD} souls!`,
            type: "combat"
          });
        }
      }

      // Remove party if all members dead
      const aliveMembers = party.members.filter(m => m.alive);
      if (aliveMembers.length === 0) {
        gameStore.removeAdventurerParty(party.id);
        gameStore.addLog({
          message: `Adventurer party ${party.id} was completely wiped out!`,
          type: "combat"
        });
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
          message: `New adventurer party (${newParty.members.length} members) has entered the dungeon!`,
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
    }, 1000 / gameStore.speed); // Movement speed based on game speed

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
