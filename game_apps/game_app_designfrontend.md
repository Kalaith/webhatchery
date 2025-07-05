### Expanded Frontend Design: Game Apps

Here's a more detailed breakdown of the frontend implementation for each game, focusing on API structure, React Hooks, and TypeScript types.

---

### Adventurer Guild

*   **API Interaction**:
    *   `GET /api/adventurers`: Fetches a list of all adventurers.
    *   `POST /api/adventurers`: Creates a new adventurer.
    *   `GET /api/quests`: Fetches available quests.
    *   `POST /api/quests/:questId/assign`: Assigns an adventurer to a quest.
    *   `GET /api/guild`: Fetches guild status, including resources.

*   **React Hooks**:
    *   `useState`: To manage form inputs for creating adventurers and assigning quests.
    *   `useEffect`: To fetch initial data for adventurers, quests, and guild status.
    *   `useReducer` or `useContext`: To manage global state, such as guild resources and adventurer roster.

*   **TypeScript Types**:
    ```typescript
    interface Adventurer {
      id: string;
      name: string;
      level: number;
      class: 'Warrior' | 'Mage' | 'Rogue';
    }

    interface Quest {
      id: string;
      title: string;
      description: string;
      reward: number;
    }

    interface Guild {
      name: string;
      resources: {
        gold: number;
        wood: number;
        mana: number;
      };
    }
    ```

---

### Dragons Den

*   **API Interaction**:
    *   `GET /api/dragons`: Fetches all dragons.
    *   `POST /api/dragons/breed`: Creates a new dragon from two parents.
    *   `GET /api/habitats`: Fetches all dragon habitats.
    *   `POST /api/habitats`: Creates a new habitat.

*   **React Hooks**:
    *   `useState`: To manage the state of individual dragons and habitats.
    *   `useEffect`: To fetch initial dragon and habitat data.
    *   `useCallback`: To memoize functions for breeding and training dragons.

*   **TypeScript Types**:
    ```typescript
    interface Dragon {
      id: string;
      name: string;
      element: 'Fire' | 'Water' | 'Earth' | 'Air';
      level: number;
    }

    interface Habitat {
      id: string;
      type: 'Mountain' | 'Forest' | 'Volcano';
      capacity: number;
      dragons: string[]; // Array of dragon IDs
    }
    ```

---

### Dungeon Core

*   **API Interaction**:
    *   `GET /api/dungeon`: Fetches the current dungeon layout.
    *   `POST /api/dungeon/tile`: Adds or modifies a tile in the dungeon.
    *   `GET /api/battle/simulate`: Simulates a battle and returns the log.

*   **React Hooks**:
    *   `useState`: To manage the state of the dungeon grid and selected tiles.
    *   `useEffect`: To trigger battle simulations and update the UI with results.
    *   `useReducer`: To manage complex state changes in the dungeon layout.

*   **TypeScript Types**:
    ```typescript
    interface DungeonTile {
      id: string;
      type: 'Floor' | 'Wall' | 'Trap' | 'SpawnPoint';
      x: number;
      y: number;
    }

    interface Trap extends DungeonTile {
      damage: number;
      trigger: 'PressurePlate' | 'Magic';
    }

    interface BattleLog {
      timestamp: number;
      message: string;
    }
    ```

---

### Dungeon Master

*   **API Interaction**:
    *   `GET /api/scenarios`: Fetches all available scenarios.
    *   `POST /api/scenarios/:scenarioId/start`: Starts a new game session.
    *   `GET /api/npcs`: Fetches all non-player characters.
    *   `POST /api/player/action`: Submits a player action and gets the result.

*   **React Hooks**:
    *   `useState`: To manage the current state of the story, including text and choices.
    *   `useEffect`: To fetch scenario data and update the story based on player actions.
    *   `useContext`: To provide global access to player stats and inventory.

*   **TypeScript Types**:
    ```typescript
    interface Scenario {
      id: string;
      title: string;
      startingScene: string; // Scene ID
    }

    interface NPC {
      id: string;
      name: string;
      dialogue: string[];
    }

    interface PlayerAction {
      type: 'Move' | 'Talk' | 'Attack';
      target?: string; // ID of NPC or object
    }
    ```

---

### Hive Mind

*   **API Interaction**:
    *   `GET /api/hive`: Fetches the current state of the hive.
    *   `POST /api/hive/produce`: Produces a new unit.
    *   `POST /api/hive/evolve`: Unlocks a new evolution.

*   **React Hooks**:
    *   `useState`: To manage hive resources and unit counts.
    *   `useEffect`: To implement the main game loop for idle resource generation.
    *   `useReducer`: For managing the complex state of the evolution tree.

*   **TypeScript Types**:
    ```typescript
    interface Hive {
      resources: {
        biomass: number;
        crystal: number;
      };
      units: Record<string, number>; // e.g., { drone: 10, warrior: 5 }
    }

    interface Unit {
      id: string;
      name: string;
      cost: { biomass: number; crystal: number };
    }

    interface Evolution {
      id: string;
      name: string;
      description: string;
      cost: number; // Cost in a special resource, e.g., evolution points
    }
    ```

---

### Kemo Sim

*   **API Interaction**:
    *   `GET /api/kemonomimi`: Fetches all kemonomimi characters.
    *   `POST /api/kemonomimi/breed`: Breeds two kemonomimi to create a new one.
    *   `GET /api/genetics/traits`: Fetches all available genetic traits.

*   **React Hooks**:
    *   `useState`: To manage the state of individual kemonomimi and breeding pairs.
    *   `useEffect`: To fetch initial data and manage the breeding process timer.
    *   `useContext`: To provide global access to the list of all kemonomimi.

*   **TypeScript Types**:
    ```typescript
    interface Kemonomimi {
      id: string;
      name: string;
      species: 'Cat' | 'Fox' | 'Wolf';
      genes: Gene[];
    }

    interface Gene {
      trait: 'EyeColor' | 'FurPattern' | 'EarShape';
      value: string;
    }

    interface BreedingPair {
      parent1: string; // Kemonomimi ID
      parent2: string; // Kemonomimi ID
    }
    ```

---

### Kingdom Wars

*   **API Interaction**:
    *   `GET /api/kingdom`: Fetches the state of the player's kingdom.
    *   `POST /api/army/recruit`: Recruits new units for the army.
    *   `POST /api/battle/launch`: Launches an attack on another kingdom.

*   **React Hooks**:
    *   `useState`: To manage kingdom resources, army composition, and battle plans.
    *   `useEffect`: To update resources over time and fetch battle reports.
    *   `useReducer`: To manage the complex state of the kingdom and its armies.

*   **TypeScript Types**:
    ```typescript
    interface Kingdom {
      name: string;
      resources: { gold: number; food: number; iron: number };
      armies: Army[];
    }

    interface Army {
      id: string;
      units: Record<string, number>; // e.g., { swordsman: 50, archer: 30 }
    }

    interface BattleReport {
      attacker: string;
      defender: string;
      outcome: 'Victory' | 'Defeat';
      casualties: Record<string, number>;
    }
    ```

---

### Magical Girl

*   **API Interaction**:
    *   `GET /api/magical-girls`: Fetches all magical girl characters.
    *   `POST /api/quests/:questId/complete`: Completes a quest and receives rewards.
    *   `POST /api/abilities/:abilityId/upgrade`: Upgrades a magical ability.

*   **React Hooks**:
    *   `useState`: To manage the state of the selected magical girl and her abilities.
    *   `useEffect`: To fetch quest data and character progression.
    *   `useContext`: To provide global access to the team of magical girls.

*   **TypeScript Types**:
    ```typescript
    interface MagicalGirl {
      id: string;
      name: string;
      level: number;
      abilities: Ability[];
    }

    interface Quest {
      id: string;
      title: string;
      isCompleted: boolean;
    }

    interface Ability {
      id: string;
      name: string;
      level: number;
    }
    ```

---

### MMO Sandbox

*   **API Interaction**:
    *   `GET /api/world`: Fetches the state of the game world.
    *   `POST /api/player/move`: Moves the player to a new location.
    *   `WebSocket /api/realtime`: For real-time communication with other players.

*   **React Hooks**:
    *   `useState`: To manage player position, inventory, and chat messages.
    *   `useEffect`: To establish and manage the WebSocket connection.
    *   `useRef`: To hold a reference to the WebSocket instance.

*   **TypeScript Types**:
    ```typescript
    interface Player {
      id: string;
      name: string;
      position: { x: number; y: number };
      inventory: Item[];
    }

    interface Item {
      id: string;
      name: string;
      quantity: number;
    }

    interface ChatMessage {
      sender: string;
      text: string;
      timestamp: number;
    }
    ```

---

### Planet Trader

*   **API Interaction**:
    *   `GET /api/planets`: Fetches all planets and their resources.
    *   `GET /api/market`: Fetches current market prices for commodities.
    *   `POST /api/trade`: Executes a trade of commodities between the player and a planet.

*   **React Hooks**:
    *   `useState`: To manage player inventory, market data, and trade forms.
    *   `useEffect`: To fetch market data periodically.
    *   `useReducer`: To manage the complex state of the player's assets across multiple planets.

*   **TypeScript Types**:
    ```typescript
    interface Planet {
      id: string;
      name: string;
      commodities: Record<string, { price: number; availability: number }>;
    }

    interface Commodity {
      id: string;
      name: string;
    }

    interface Trade {
      planetId: string;
      commodityId: string;
      quantity: number;
      type: 'Buy' | 'Sell';
    }
    ```

---

### Xenomorph Park

*   **API Interaction**:
    *   `GET /api/xenomorphs`: Fetches all xenomorphs in the park.
    *   `POST /api/habitats`: Creates or modifies a habitat.
    *   `GET /api/park/status`: Fetches the overall status of the park, including safety and revenue.

*   **React Hooks**:
    *   `useState`: To manage the state of individual xenomorphs and habitats.
    *   `useEffect`: To simulate xenomorph behavior and update park status.
    *   `useReducer`: To manage the complex state of the park's finances and containment systems.

*   **TypeScript Types**:
    ```typescript
    interface Xenomorph {
      id: string;
      species: 'Drone' | 'Warrior' | 'Queen';
      isContained: boolean;
      habitatId: string;
    }

    interface Habitat {
      id: string;
      type: 'Hive' | 'Cavern' | 'Lab';
      containmentLevel: number;
    }

    interface ParkStatus {
      revenue: number;
      safetyRating: number;
      activeAlerts: string[];
    }
    ```