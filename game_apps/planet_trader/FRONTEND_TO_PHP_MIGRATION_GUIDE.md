# Planet Trader: Frontend to PHP Backend Migration Guide

## Overview
This guide outlines the migration of Planet Trader game logic from TypeScript frontend to PHP backend, following the patterns established in the Mytherra project.

## Current Architecture Analysis

### Frontend Components to Migrate
- **Game State Management** (`useGame.ts`) - Core game logic
- **Data Fetching** (`fetchGameData.ts`) - Static data loading
- **Game Entities** (Types/Interfaces) - Data structures
- **Business Logic** - Planet generation, pricing, trading

### Frontend Components to Keep
- **UI Components** - React components for display
- **User Interactions** - Button clicks, form handling
- **Client State** - UI-specific state (modals, selections)

## PHP Backend Structure

### Directory Structure
```
planet_trader_backend/
├── composer.json
├── public/
│   └── index.php
├── src/
│   ├── Actions/
│   │   ├── GameActions/
│   │   ├── PlanetActions/
│   │   ├── TradingActions/
│   │   └── PlayerActions/
│   ├── Controllers/
│   │   ├── GameController.php
│   │   ├── PlanetController.php
│   │   ├── TradingController.php
│   │   └── PlayerController.php
│   ├── Models/
│   │   ├── Planet.php
│   │   ├── PlanetType.php
│   │   ├── Species.php
│   │   ├── Tool.php
│   │   ├── Player.php
│   │   └── GameSession.php
│   ├── Services/
│   │   ├── PlanetGeneratorService.php
│   │   ├── TradingService.php
│   │   ├── PricingService.php
│   │   └── RandomGeneratorService.php
│   ├── Database/
│   │   ├── Connection.php
│   │   └── migrations/
│   ├── Utils/
│   │   ├── ColorUtils.php
│   │   ├── RandomUtils.php
│   │   └── ValidationUtils.php
│   └── Routes/
│       └── routes.php
└── storage/
    └── logs/
```

## Migration Steps

### Phase 1: Setup PHP Backend Infrastructure

#### 1.1 Initialize Composer Project
```bash
cd e:\WebHatchery\game_apps\planet_trader\
mkdir backend
cd backend
composer init
```

#### 1.2 Install Dependencies
```bash
composer require slim/slim:"4.*"
composer require slim/psr7
composer require monolog/monolog
composer require --dev phpunit/phpunit
```

#### 1.3 Database Setup
- SQLite for development (similar to Mytherra pattern)
- MySQL/PostgreSQL for production

### Phase 2: Entity Migration

#### 2.1 TypeScript to PHP Entity Mapping

**TypeScript Planet Interface → PHP Planet Model**
```typescript
// Frontend: src/types/entities.ts
interface Planet {
  id: string;
  type: PlanetType;
  name: string;
  temperature: number;
  atmosphere: number;
  water: number;
  gravity: number;
  radiation: number;
  purchasePrice: number;
  color: string;
}
```

**PHP Planet Model**
```php
// Backend: src/Models/Planet.php
class Planet {
    public string $id;
    public PlanetType $type;
    public string $name;
    public float $temperature;
    public float $atmosphere;
    public float $water;
    public float $gravity;
    public float $radiation;
    public int $purchasePrice;
    public string $color;
    public string $ownerId;
    public \DateTime $createdAt;
    public ?\DateTime $soldAt;
}
```

#### 2.2 Database Schema

```sql
-- planets table
CREATE TABLE planets (
    id VARCHAR(255) PRIMARY KEY,
    type_id INTEGER,
    name VARCHAR(255) NOT NULL,
    temperature DECIMAL(5,2),
    atmosphere DECIMAL(3,2),
    water DECIMAL(3,2),
    gravity DECIMAL(3,2),
    radiation DECIMAL(3,2),
    purchase_price INTEGER,
    color VARCHAR(7),
    owner_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sold_at TIMESTAMP NULL,
    FOREIGN KEY (type_id) REFERENCES planet_types(id)
);

-- planet_types table
CREATE TABLE planet_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    base_temp DECIMAL(5,2),
    base_atmo DECIMAL(3,2),
    base_water DECIMAL(3,2),
    base_grav DECIMAL(3,2),
    base_rad DECIMAL(3,2),
    color VARCHAR(7)
);

-- species table
CREATE TABLE species (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    temp_min DECIMAL(5,2),
    temp_max DECIMAL(5,2),
    atmo_min DECIMAL(3,2),
    atmo_max DECIMAL(3,2),
    water_min DECIMAL(3,2),
    water_max DECIMAL(3,2),
    grav_min DECIMAL(3,2),
    grav_max DECIMAL(3,2),
    rad_min DECIMAL(3,2),
    rad_max DECIMAL(3,2),
    base_price INTEGER,
    color VARCHAR(7)
);

-- tools table
CREATE TABLE tools (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost INTEGER,
    category VARCHAR(100),
    description TEXT,
    tier INTEGER DEFAULT 1,
    unlocked BOOLEAN DEFAULT TRUE,
    upgrade_required VARCHAR(255),
    effects JSON,
    side_effects JSON
);

-- players table
CREATE TABLE players (
    id VARCHAR(255) PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE,
    credits INTEGER DEFAULT 10000,
    current_planet_id VARCHAR(255),
    game_started BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (current_planet_id) REFERENCES planets(id)
);

-- game_sessions table
CREATE TABLE game_sessions (
    id VARCHAR(255) PRIMARY KEY,
    player_id VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    final_credits INTEGER,
    planets_traded INTEGER DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id)
);
```

### Phase 3: Business Logic Migration

#### 3.1 Game State Management

**Frontend useGame Hook → PHP GameSession Service**

```typescript
// Frontend: Current state management
const [credits, setCredits] = useState(10000);
const [planets, setPlanets] = useState<Planet[]>([]);
const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
```

**PHP GameSession Service**
```php
// Backend: src/Services/GameSessionService.php
class GameSessionService {
    public function getPlayerState(string $sessionId): array;
    public function updateCredits(string $sessionId, int $amount): bool;
    public function getCurrentPlanet(string $sessionId): ?Planet;
    public function setCurrentPlanet(string $sessionId, string $planetId): bool;
}
```

#### 3.2 Planet Generation Logic

**Frontend createPlanet Function → PHP PlanetGeneratorService**

```typescript
// Frontend: Planet creation
function createPlanet(type: PlanetType, name: string): Planet {
  return {
    id: `planet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    name,
    temperature: type.baseTemp + (Math.random() - 0.5) * 20,
    // ... other properties
  };
}
```

**PHP PlanetGeneratorService**
```php
// Backend: src/Services/PlanetGeneratorService.php
class PlanetGeneratorService {
    public function generatePlanet(PlanetType $type, string $name): Planet;
    public function generatePlanetOptions(int $count = 3): array;
    public function generateRandomName(array $usedNames = []): string;
}
```

### Phase 4: API Endpoint Design

#### 4.1 RESTful API Endpoints

```php
// Game Management
GET    /api/game/status              - Get current game state
POST   /api/game/start               - Start new game
POST   /api/game/end                 - End current game

// Player Management  
GET    /api/player/profile           - Get player profile
PUT    /api/player/credits           - Update player credits
GET    /api/player/planets           - Get owned planets

// Planet Management
GET    /api/planets                  - Get available planets for purchase
POST   /api/planets                  - Generate new planet options
GET    /api/planets/{id}             - Get specific planet details
POST   /api/planets/{id}/purchase    - Purchase a planet
DELETE /api/planets/{id}/sell        - Sell a planet

// Trading
GET    /api/trading/buyers           - Get current alien buyers
POST   /api/trading/sell             - Sell planet to buyer
GET    /api/trading/market           - Get market prices

// Tools & Terraforming
GET    /api/tools                    - Get available tools
POST   /api/tools/{id}/use           - Use a terraforming tool
POST   /api/tools/{id}/unlock        - Unlock a tool via research

// Static Data
GET    /api/data/planet-types        - Get planet types
GET    /api/data/species             - Get alien species
GET    /api/data/tools               - Get tool definitions
```

#### 4.2 Controller Implementation Examples

```php
// Backend: src/Controllers/PlanetController.php
class PlanetController {
    
    public function getAvailablePlanets(Request $request, Response $response): Response {
        $sessionId = $this->getSessionId($request);
        $planets = $this->planetGeneratorService->generatePlanetOptions();
        
        return $this->jsonResponse($response, [
            'success' => true,
            'data' => $planets
        ]);
    }
    
    public function purchasePlanet(Request $request, Response $response, array $args): Response {
        $sessionId = $this->getSessionId($request);
        $planetId = $args['id'];
        
        $result = $this->tradingService->purchasePlanet($sessionId, $planetId);
        
        return $this->jsonResponse($response, $result);
    }
}
```

### Phase 5: Data Migration Strategy

#### 5.1 Static Data Migration

**Frontend JSON Files → PHP Database Seeding**

```typescript
// Frontend: Static JSON files
/mocks/planet_types.json
/mocks/alien_species.json
/mocks/terraforming_tools.json
/mocks/planet_names.json
```

**PHP Database Seeding**
```php
// Backend: src/Database/Seeders/GameDataSeeder.php
class GameDataSeeder {
    public function seedPlanetTypes(): void;
    public function seedSpecies(): void;
    public function seedTools(): void;
    public function seedPlanetNames(): void;
}
```

#### 5.2 Session Migration

**Frontend localStorage → PHP Sessions/Database**

```typescript
// Frontend: Browser storage
localStorage.setItem('gameState', JSON.stringify(state));
```

**PHP Session Management**
```php
// Backend: Database-backed sessions
class SessionManager {
    public function createSession(string $sessionId): string;
    public function getSession(string $sessionId): ?array;
    public function updateSession(string $sessionId, array $data): bool;
    public function destroySession(string $sessionId): bool;
}
```

### Phase 6: Frontend Refactoring

#### 6.1 API Service Layer

**Replace fetchGameData with API calls**

```typescript
// Frontend: New API service
// src/api/gameApi.ts
export class GameApi {
    private baseUrl = process.env.VITE_API_URL || '/api';
    
    async getGameStatus(): Promise<GameState> {
        const response = await fetch(`${this.baseUrl}/game/status`);
        return response.json();
    }
    
    async generatePlanets(): Promise<Planet[]> {
        const response = await fetch(`${this.baseUrl}/planets`, { method: 'POST' });
        return response.json();
    }
    
    async purchasePlanet(planetId: string): Promise<PurchaseResult> {
        const response = await fetch(`${this.baseUrl}/planets/${planetId}/purchase`, {
            method: 'POST'
        });
        return response.json();
    }
}
```

#### 6.2 State Management Simplification

**Remove business logic from useGame hook**

```typescript
// Frontend: Simplified useGame hook
export function useGame() {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Remove: Planet generation logic
    // Remove: Price calculations  
    // Remove: Business rules
    // Keep: UI state management
    // Keep: API calls coordination
}
```

### Phase 7: Testing Strategy

#### 7.1 Backend Testing

```php
// Backend: tests/Unit/Services/PlanetGeneratorServiceTest.php
class PlanetGeneratorServiceTest extends TestCase {
    public function testGeneratePlanet(): void;
    public function testGenerateUniqueNames(): void;
    public function testPlanetPricing(): void;
}

// Backend: tests/Integration/Api/PlanetControllerTest.php
class PlanetControllerTest extends TestCase {
    public function testGetAvailablePlanets(): void;
    public function testPurchasePlanet(): void;
    public function testSellPlanet(): void;
}
```

#### 7.2 Frontend Integration Testing

```typescript
// Frontend: src/tests/integration/gameApi.test.ts
describe('Game API Integration', () => {
    test('should fetch game status');
    test('should purchase planet');
    test('should handle errors gracefully');
});
```

## Implementation Timeline

### Week 1: Backend Infrastructure
- [x] Setup PHP project structure
- [x] Configure Slim framework
- [x] Create database schema
- [x] Implement basic models

### Week 2: Core Services
- [x] Planet generation service
- [x] Trading service  
- [x] Session management
- [x] Database seeders

### Week 3: API Controllers
- [x] Game management endpoints
- [x] Planet management endpoints
- [x] Trading endpoints
- [x] Tool/research endpoints

### Week 4: Frontend Integration
- [x] Create API service layer
- [x] Refactor useGame hook
- [x] Update components to use API
- [x] Handle loading/error states

### Week 5: Testing & Polish
- [x] Backend unit tests
- [x] Integration tests
- [x] Frontend API tests
- [x] Performance optimization

## Configuration

### Environment Variables

**Backend (.env)**
```env
DB_CONNECTION=sqlite
DB_DATABASE=storage/database.sqlite
API_SECRET_KEY=your-secret-key
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8080/api
VITE_SESSION_TIMEOUT=3600000
```

## Migration Benefits

1. **Scalability**: Server-side state management supports multiple players
2. **Security**: Business logic validation on backend prevents cheating
3. **Performance**: Reduced client-side computation
4. **Persistence**: Game state survives browser refresh/close
5. **Analytics**: Server-side logging and metrics
6. **Future Features**: Multiplayer support, tournaments, leaderboards

## Risks & Mitigation

### Risk: Increased Latency
**Mitigation**: Implement caching, optimize database queries, use CDN

### Risk: Complex State Synchronization  
**Mitigation**: Clear API design, optimistic UI updates, proper error handling

### Risk: Session Management
**Mitigation**: Database-backed sessions, proper cleanup, timeout handling

## Next Steps

1. **Review this migration guide**
2. **Setup development environment**
3. **Begin Phase 1 implementation**
4. **Test incrementally**
5. **Deploy staging environment**
6. **Plan production migration**

## Additional Considerations

### Security
- Input validation and sanitization
- Rate limiting on API endpoints
- SQL injection prevention
- XSS protection

### Performance
- Database indexing strategy
- Query optimization
- Caching layer (Redis/Memcached)
- API response compression

### Monitoring
- Application logging
- Performance metrics
- Error tracking
- User analytics

This migration will transform Planet Trader from a client-side game into a robust, scalable web application suitable for multiple players and future enhancements.
