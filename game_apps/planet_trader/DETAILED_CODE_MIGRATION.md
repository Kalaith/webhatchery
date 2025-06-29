# Planet Trader: Detailed Code Migration Mapping

## Core Functions Migration

### 1. Random Utilities Migration

**Frontend TypeScript:**
```typescript
// src/game/useGame.ts
export const randomItem = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)];
```

**Backend PHP:**
```php
// src/Utils/RandomUtils.php
<?php
namespace App\Utils;

class RandomUtils {
    public static function randomItem(array $arr): mixed {
        if (empty($arr)) {
            throw new \InvalidArgumentException('Array cannot be empty');
        }
        return $arr[array_rand($arr)];
    }
    
    public static function randomFloat(float $min = 0.0, float $max = 1.0): float {
        return $min + mt_rand() / mt_getrandmax() * ($max - $min);
    }
    
    public static function randomRange(float $base, float $variance): float {
        return $base + (self::randomFloat() - 0.5) * $variance;
    }
}
?>
```

### 2. Planet Generation Migration

**Frontend TypeScript:**
```typescript
// src/game/useGame.ts
function createPlanet(type: PlanetType, name: string): Planet {
  return {
    id: `planet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    name,
    temperature: type.baseTemp + (Math.random() - 0.5) * 20,
    atmosphere: Math.max(0, type.baseAtmo + (Math.random() - 0.5) * 0.4),
    water: Math.max(0, Math.min(1, type.baseWater + (Math.random() - 0.5) * 0.3)),
    gravity: Math.max(0.1, type.baseGrav + (Math.random() - 0.5) * 0.4),
    radiation: Math.max(0, type.baseRad + (Math.random() - 0.5) * 0.3),
    purchasePrice: Math.floor(1000 + Math.random() * 2000),
    color: type.color
  };
}
```

**Backend PHP:**
```php
// src/Services/PlanetGeneratorService.php
<?php
namespace App\Services;

use App\Models\Planet;
use App\Models\PlanetType;
use App\Utils\RandomUtils;

class PlanetGeneratorService {
    
    public function createPlanet(PlanetType $type, string $name): Planet {
        $planet = new Planet();
        $planet->id = $this->generatePlanetId();
        $planet->type = $type;
        $planet->name = $name;
        $planet->temperature = RandomUtils::randomRange($type->baseTemp, 20);
        $planet->atmosphere = max(0, RandomUtils::randomRange($type->baseAtmo, 0.4));
        $planet->water = max(0, min(1, RandomUtils::randomRange($type->baseWater, 0.3)));
        $planet->gravity = max(0.1, RandomUtils::randomRange($type->baseGrav, 0.4));
        $planet->radiation = max(0, RandomUtils::randomRange($type->baseRad, 0.3));
        $planet->purchasePrice = (int) floor(1000 + RandomUtils::randomFloat() * 2000);
        $planet->color = $type->color;
        $planet->createdAt = new \DateTime();
        
        return $planet;
    }
    
    private function generatePlanetId(): string {
        return 'planet_' . time() . '_' . bin2hex(random_bytes(4));
    }
}
?>
```

### 3. Planet Name Generation Migration

**Frontend TypeScript:**
```typescript
// src/game/useGame.ts
function getRandomPlanetName(planetNames: string[], usedPlanetNames: Set<string>): string {
  if (planetNames && planetNames.length > 0 && usedPlanetNames.size < planetNames.length) {
    let name;
    do {
      name = randomItem(planetNames);
    } while (usedPlanetNames.has(name));
    usedPlanetNames.add(name);
    return name;
  }
  // Procedural generation logic...
  const starPrefixes = ["HD", "Kepler", "Gliese", "Epsilon", "Tau", "TYC", "Alpha", "Delta", "Theta", "Zeta", "Xeno", "Vesmir", "PX", "LV", "LX"];
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  // ... rest of logic
}
```

**Backend PHP:**
```php
// src/Services/PlanetNameService.php
<?php
namespace App\Services;

use App\Utils\RandomUtils;

class PlanetNameService {
    private array $usedNames = [];
    private array $planetNames = [];
    
    private const STAR_PREFIXES = [
        "HD", "Kepler", "Gliese", "Epsilon", "Tau", "TYC", 
        "Alpha", "Delta", "Theta", "Zeta", "Xeno", "Vesmir", 
        "PX", "LV", "LX"
    ];
    
    private const ROMAN_NUMERALS = [
        "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"
    ];
    
    public function __construct(array $planetNames = []) {
        $this->planetNames = $planetNames;
    }
    
    public function getRandomPlanetName(): string {
        // Try to use predefined names first
        if (!empty($this->planetNames) && count($this->usedNames) < count($this->planetNames)) {
            do {
                $name = RandomUtils::randomItem($this->planetNames);
            } while (in_array($name, $this->usedNames));
            
            $this->usedNames[] = $name;
            return $name;
        }
        
        // Generate procedural name
        return $this->generateProceduralName();
    }
    
    private function generateProceduralName(): string {
        $prefix = RandomUtils::randomItem(self::STAR_PREFIXES);
        $code = rand(100, 9999);
        $suffix = rand(0, 1) ? chr(97 + rand(0, 2)) : '';
        $roman = rand(0, 2) === 0 ? ' ' . RandomUtils::randomItem(self::ROMAN_NUMERALS) : '';
        
        $name = trim("{$prefix}-{$code}{$suffix}{$roman}");
        
        // Ensure uniqueness
        $tries = 0;
        while (in_array($name, $this->usedNames) && $tries < 10) {
            $code = rand(100, 9999);
            $name = trim("{$prefix}-{$code}{$suffix}{$roman}");
            $tries++;
        }
        
        $this->usedNames[] = $name;
        return $name;
    }
}
?>
```

### 4. Species Generation Migration

**Frontend TypeScript:**
```typescript
// src/game/useGame.ts
function generateRandomSpecies(types: Species[], count: number): Species[] {
  if (types.length === 0) return [];
  
  if (count >= types.length) {
    return [...types];
  }
  
  const shuffled = [...types];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}
```

**Backend PHP:**
```php
// src/Services/SpeciesGeneratorService.php
<?php
namespace App\Services;

use App\Models\Species;

class SpeciesGeneratorService {
    
    public function generateRandomSpecies(array $types, int $count): array {
        if (empty($types)) {
            return [];
        }
        
        if ($count >= count($types)) {
            return $types;
        }
        
        // Shuffle array
        $shuffled = $types;
        shuffle($shuffled);
        
        return array_slice($shuffled, 0, $count);
    }
    
    public function generateAlienBuyers(array $speciesTypes, int $count = 4): array {
        $uniqueSpecies = $this->generateRandomSpecies($speciesTypes, $count);
        $buyers = [];
        
        foreach ($uniqueSpecies as $index => $species) {
            $buyer = clone $species;
            $buyer->id = time() + $index;
            $buyer->currentPrice = $species->basePrice + rand(-250, 250);
            $buyers[] = $buyer;
        }
        
        return $buyers;
    }
}
?>
```

### 5. Color Utility Migration

**Frontend TypeScript:**
```typescript
// src/utils/colorUtils.ts
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};
```

**Backend PHP:**
```php
// src/Utils/ColorUtils.php
<?php
namespace App\Utils;

class ColorUtils {
    
    public static function hexToRgb(string $hex): array {
        $hex = ltrim($hex, '#');
        
        if (strlen($hex) === 6) {
            return [
                'r' => hexdec(substr($hex, 0, 2)),
                'g' => hexdec(substr($hex, 2, 2)),
                'b' => hexdec(substr($hex, 4, 2))
            ];
        }
        
        return ['r' => 0, 'g' => 0, 'b' => 0];
    }
    
    public static function rgbToHsl(int $r, int $g, int $b): array {
        $r /= 255;
        $g /= 255;
        $b /= 255;
        
        $max = max($r, $g, $b);
        $min = min($r, $g, $b);
        $diff = $max - $min;
        
        $l = ($max + $min) / 2;
        
        if ($diff === 0) {
            $h = $s = 0;
        } else {
            $s = $l > 0.5 ? $diff / (2 - $max - $min) : $diff / ($max + $min);
            
            switch ($max) {
                case $r:
                    $h = (($g - $b) / $diff) + ($g < $b ? 6 : 0);
                    break;
                case $g:
                    $h = ($b - $r) / $diff + 2;
                    break;
                case $b:
                    $h = ($r - $g) / $diff + 4;
                    break;
                default:
                    $h = 0;
            }
            $h /= 6;
        }
        
        return [
            'h' => $h * 360,
            's' => $s,
            'l' => $l
        ];
    }
    
    public static function hslToRgb(float $h, float $s, float $l): array {
        $h /= 360;
        
        if ($s === 0) {
            $r = $g = $b = $l;
        } else {
            $hue2rgb = function($p, $q, $t) {
                if ($t < 0) $t += 1;
                if ($t > 1) $t -= 1;
                if ($t < 1/6) return $p + ($q - $p) * 6 * $t;
                if ($t < 1/2) return $q;
                if ($t < 2/3) return $p + ($q - $p) * (2/3 - $t) * 6;
                return $p;
            };
            
            $q = $l < 0.5 ? $l * (1 + $s) : $l + $s - $l * $s;
            $p = 2 * $l - $q;
            
            $r = $hue2rgb($p, $q, $h + 1/3);
            $g = $hue2rgb($p, $q, $h);
            $b = $hue2rgb($p, $q, $h - 1/3);
        }
        
        return [
            'r' => $r,
            'g' => $g,
            'b' => $b
        ];
    }
    
    public static function rgbToHex(int $r, int $g, int $b): string {
        return sprintf("#%02x%02x%02x", $r, $g, $b);
    }
    
}
?>
```

### 6. Game State Management Migration

**Frontend TypeScript:**
```typescript
// src/game/useGame.ts
export function useGame() {
  const [credits, setCredits] = useState(10000);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  // ... other state
}
```

**Backend PHP:**
```php
// src/Services/GameStateService.php
<?php
namespace App\Services;

use App\Models\Player;
use App\Models\GameSession;

class GameStateService {
    private DatabaseConnection $db;
    
    public function __construct(DatabaseConnection $db) {
        $this->db = $db;
    }
    
    public function getPlayerState(string $sessionId): array {
        $player = $this->getPlayerBySession($sessionId);
        if (!$player) {
            throw new \Exception('Player not found');
        }
        
        return [
            'credits' => $player->credits,
            'currentPlanet' => $this->getCurrentPlanet($player->id),
            'ownedPlanets' => $this->getOwnedPlanets($player->id),
            'gameStarted' => $player->gameStarted,
            'lastActivity' => $player->lastActivity
        ];
    }
    
    public function updateCredits(string $sessionId, int $amount): bool {
        $player = $this->getPlayerBySession($sessionId);
        if (!$player) {
            return false;
        }
        
        $newCredits = $player->credits + $amount;
        if ($newCredits < 0) {
            return false; // Insufficient credits
        }
        
        $stmt = $this->db->prepare(
            "UPDATE players SET credits = ?, last_activity = CURRENT_TIMESTAMP WHERE id = ?"
        );
        
        return $stmt->execute([$newCredits, $player->id]);
    }
    
    public function startGame(string $sessionId): bool {
        $player = $this->getPlayerBySession($sessionId);
        if (!$player) {
            return false;
        }
        
        $stmt = $this->db->prepare(
            "UPDATE players SET game_started = 1, last_activity = CURRENT_TIMESTAMP WHERE id = ?"
        );
        
        return $stmt->execute([$player->id]);
    }
    
    private function getPlayerBySession(string $sessionId): ?Player {
        $stmt = $this->db->prepare("SELECT * FROM players WHERE session_id = ?");
        $stmt->execute([$sessionId]);
        $data = $stmt->fetch();
        
        return $data ? Player::fromArray($data) : null;
    }
}
?>
```

## API Controller Examples

### Planet Controller

```php
// src/Controllers/PlanetController.php
<?php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\PlanetGeneratorService;
use App\Services\TradingService;

class PlanetController extends BaseController {
    
    private PlanetGeneratorService $planetGenerator;
    private TradingService $tradingService;
    
    public function __construct(
        PlanetGeneratorService $planetGenerator,
        TradingService $tradingService
    ) {
        $this->planetGenerator = $planetGenerator;
        $this->tradingService = $tradingService;
    }
    
    public function generatePlanets(Request $request, Response $response): Response {
        try {
            $sessionId = $this->getSessionId($request);
            $count = $request->getQueryParams()['count'] ?? 3;
            
            $planets = $this->planetGenerator->generatePlanetOptions((int)$count);
            
            return $this->jsonResponse($response, [
                'success' => true,
                'data' => $planets
            ]);
            
        } catch (\Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
    
    public function purchasePlanet(Request $request, Response $response, array $args): Response {
        try {
            $sessionId = $this->getSessionId($request);
            $planetId = $args['id'];
            
            $result = $this->tradingService->purchasePlanet($sessionId, $planetId);
            
            if ($result['success']) {
                return $this->jsonResponse($response, $result);
            } else {
                return $this->errorResponse($response, $result['message'], 400);
            }
            
        } catch (\Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
    
    public function getOwnedPlanets(Request $request, Response $response): Response {
        try {
            $sessionId = $this->getSessionId($request);
            $planets = $this->tradingService->getOwnedPlanets($sessionId);
            
            return $this->jsonResponse($response, [
                'success' => true,
                'data' => $planets
            ]);
            
        } catch (\Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
}
?>
```

This detailed migration mapping provides concrete examples of how each piece of TypeScript code should be converted to PHP, maintaining the same logic while following PHP best practices and the established patterns from the Mytherra project.
