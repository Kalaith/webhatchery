<?php

namespace App\Controllers;

use App\Services\PlanetGeneratorService;
use App\Services\TradingService;
use App\Services\GameStateServiceEnhanced;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class PlanetController extends BaseController
{
    private PlanetGeneratorService $planetGeneratorService;
    private TradingService $tradingService;
    private GameStateServiceEnhanced $gameStateService;

    public function __construct(
        PlanetGeneratorService $planetGeneratorService,
        TradingService $tradingService,
        GameStateServiceEnhanced $gameStateService
    ) {
        $this->planetGeneratorService = $planetGeneratorService;
        $this->tradingService = $tradingService;
        $this->gameStateService = $gameStateService;
    }

    /**
     * Generate new planet options for purchase
     */
    public function generatePlanets(Request $request, Response $response): Response
    {
        try {
            $sessionId = $this->getSessionId($request);
            $queryParams = $request->getQueryParams();
            $count = max(1, min(10, (int) ($queryParams['count'] ?? 3))); // Between 1-10 planets
            
            // Generate planets using the enhanced service
            $planets = $this->planetGeneratorService->generatePlanetOptions($count);
            
            // Convert to array format for JSON response
            $planetsData = array_map(fn($planet) => $planet->toArray(), $planets);
            
            $this->logAction('planets_generated', [
                'session_id' => $sessionId,
                'count' => $count,
                'planet_ids' => array_column($planetsData, 'id')
            ]);
            
            return $this->successResponse($response, [
                'planets' => $planetsData,
                'count' => count($planetsData)
            ], 'Planet options generated');

        } catch (\Exception $e) {
            $this->logAction('planet_generation_error', ['error' => $e->getMessage()]);
            return $this->errorResponse($response, 'Failed to generate planets: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get specific planet details
     */
    public function getPlanet(Request $request, Response $response, array $args): Response
    {
        try {
            $planetId = $args['id'] ?? '';
            
            if (empty($planetId)) {
                return $this->errorResponse($response, 'Planet ID is required', 400);
            }

            $planet = $this->gameStateService->getPlanetById($planetId);
            
            if (!$planet) {
                return $this->errorResponse($response, 'Planet not found', 404);
            }

            return $this->successResponse($response, [
                'planet' => $planet->toArray()
            ], 'Planet details retrieved');

        } catch (\Exception $e) {
            $this->logAction('planet_get_error', ['error' => $e->getMessage()]);
            return $this->errorResponse($response, 'Failed to get planet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Purchase a planet
     */
    public function purchasePlanet(Request $request, Response $response, array $args): Response
    {
        try {
            $sessionId = $this->getSessionId($request);
            $planetId = $args['id'] ?? '';
            
            if (empty($planetId)) {
                return $this->errorResponse($response, 'Planet ID is required', 400);
            }

            $result = $this->tradingService->purchasePlanet($sessionId, $planetId);
            
            if (!$result['success']) {
                return $this->errorResponse($response, $result['message'], 400);
            }

            $this->logAction('planet_purchased', [
                'session_id' => $sessionId,
                'planet_id' => $planetId,
                'price' => $result['planet']['purchasePrice'] ?? 0
            ]);
            
            return $this->successResponse($response, $result, $result['message']);

        } catch (\Exception $e) {
            $this->logAction('planet_purchase_error', ['error' => $e->getMessage()]);
            return $this->errorResponse($response, 'Failed to purchase planet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get owned planets for the current player
     */
    public function getOwnedPlanets(Request $request, Response $response): Response
    {
        try {
            $sessionId = $this->getSessionId($request);
            [$page, $perPage] = $this->getPaginationParams($request);
            
            $planets = $this->tradingService->getOwnedPlanets($sessionId);
            $paginatedData = $this->paginate($planets, $page, $perPage);
            
            // Convert planets to array format
            $paginatedData['items'] = array_map(fn($planet) => $planet->toArray(), $paginatedData['items']);
            
            return $this->successResponse($response, $paginatedData, 'Owned planets retrieved');

        } catch (\Exception $e) {
            $this->logAction('owned_planets_error', ['error' => $e->getMessage()]);
            return $this->errorResponse($response, 'Failed to get owned planets: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Set current planet for the player
     */
    public function setCurrentPlanet(Request $request, Response $response, array $args): Response
    {
        try {
            $sessionId = $this->getSessionId($request);
            $planetId = $args['id'] ?? '';
            
            if (empty($planetId)) {
                return $this->errorResponse($response, 'Planet ID is required', 400);
            }

            $result = $this->tradingService->setCurrentPlanet($sessionId, $planetId);
            
            if (!$result['success']) {
                return $this->errorResponse($response, $result['message'], 400);
            }

            $this->logAction('current_planet_set', [
                'session_id' => $sessionId,
                'planet_id' => $planetId
            ]);
            
            return $this->successResponse($response, $result, $result['message']);

        } catch (\Exception $e) {
            $this->logAction('set_current_planet_error', ['error' => $e->getMessage()]);
            return $this->errorResponse($response, 'Failed to set current planet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get current planet for the player
     */
    public function getCurrentPlanet(Request $request, Response $response): Response
    {
        try {
            $sessionId = $this->getSessionId($request);
            
            $planet = $this->tradingService->getCurrentPlanet($sessionId);
            
            if (!$planet) {
                return $this->successResponse($response, [
                    'currentPlanet' => null
                ], 'No current planet selected');
            }

            return $this->successResponse($response, [
                'currentPlanet' => $planet->toArray()
            ], 'Current planet retrieved');

        } catch (\Exception $e) {
            $this->logAction('get_current_planet_error', ['error' => $e->getMessage()]);
            return $this->errorResponse($response, 'Failed to get current planet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Calculate planet value and rarity
     */
    public function analyzePlanet(Request $request, Response $response, array $args): Response
    {
        try {
            $planetId = $args['id'] ?? '';
            
            if (empty($planetId)) {
                return $this->errorResponse($response, 'Planet ID is required', 400);
            }

            $planet = $this->gameStateService->getPlanetById($planetId);
            
            if (!$planet) {
                return $this->errorResponse($response, 'Planet not found', 404);
            }

            $value = $this->planetGeneratorService->calculatePlanetValue($planet);
            $rarity = $this->planetGeneratorService->getPlanetRarity($planet);
            
            $analysis = [
                'planet' => $planet->toArray(),
                'estimatedValue' => $value,
                'rarity' => $rarity,
                'profitPotential' => $value - $planet->purchasePrice,
                'characteristics' => [
                    'habitable' => $this->isHabitable($planet),
                    'waterRich' => $planet->water > 0.5,
                    'lowRadiation' => $planet->radiation < 0.2,
                    'earthLikeGravity' => abs($planet->gravity - 1.0) < 0.3,
                    'temperateClimate' => $planet->temperature >= 0 && $planet->temperature <= 30
                ]
            ];
            
            return $this->successResponse($response, $analysis, 'Planet analysis completed');

        } catch (\Exception $e) {
            $this->logAction('planet_analysis_error', ['error' => $e->getMessage()]);
            return $this->errorResponse($response, 'Failed to analyze planet: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Handle CORS preflight requests
     */
    public function options(Request $request, Response $response): Response
    {
        return $this->handleOptions($request, $response);
    }

    /**
     * Check if planet is habitable
     */
    private function isHabitable($planet): bool
    {
        return $planet->temperature >= -10 && $planet->temperature <= 40 &&
               $planet->atmosphere >= 0.5 && $planet->atmosphere <= 2.0 &&
               $planet->water >= 0.1 &&
               $planet->gravity >= 0.5 && $planet->gravity <= 2.0 &&
               $planet->radiation <= 0.5;
    }
}
