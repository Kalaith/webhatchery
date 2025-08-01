<?php

namespace App\Traits;

use Psr\Http\Message\ResponseInterface as Response;

trait ApiResponseTrait
{
    /**
     * Handle API actions with consistent error handling
     */
    protected function handleApiAction(
        Response $response,
        callable $action,
        string $actionDescription,
        string $errorMessage = 'Operation failed',
        int $successCode = 200
    ): Response {
        try {
            $data = $action();
            return $this->successResponse($response, $data, $successCode);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($response, $e->getMessage(), 400);
        } catch (\App\Exceptions\UnauthorizedException $e) {
            return $this->errorResponse($response, $e->getMessage(), 401);
        } catch (\App\Exceptions\ResourceNotFoundException $e) {
            return $this->errorResponse($response, $e->getMessage(), 404);
        } catch (\Exception $e) {
            error_log("Error {$actionDescription}: " . $e->getMessage());
            return $this->errorResponse($response, $errorMessage, 500);
        }
    }

    /**
     * Return successful JSON response
     */
    protected function successResponse(Response $response, $data, int $statusCode = 200): Response
    {
        $payload = json_encode([
            'success' => true,
            'data' => $data
        ]);

        $response->getBody()->write($payload);
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($statusCode);
    }

    /**
     * Return error JSON response
     */
    protected function errorResponse(Response $response, string $message, int $statusCode = 400): Response
    {
        $payload = json_encode([
            'success' => false,
            'error' => [
                'message' => $message,
                'code' => $statusCode
            ]
        ]);

        $response->getBody()->write($payload);
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($statusCode);
    }
}
