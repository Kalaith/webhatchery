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
            return $this->successResponse($response, $data, 'Operation completed successfully', $successCode);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($response, $e->getMessage(), 'INVALID_ARGUMENT', [], 400);
        } catch (\App\Exceptions\UnauthorizedException $e) {
            return $this->errorResponse($response, $e->getMessage(), 'UNAUTHORIZED', [], 401);
        } catch (\App\Exceptions\ResourceNotFoundException $e) {
            return $this->errorResponse($response, $e->getMessage(), 'NOT_FOUND', [], 404);
        } catch (\Exception $e) {
            error_log("Error {$actionDescription}: " . $e->getMessage());
            return $this->errorResponse($response, $errorMessage, 'INTERNAL_ERROR', [], 500);
        }
    }

    /**
     * Return successful JSON response
     */
    protected function successResponse(
        Response $response, 
        mixed $data = null, 
        string $message = 'Success',
        int $statusCode = 200
    ): Response {
        $payload = [
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => time(),
            'request_id' => uniqid('req_', true)
        ];

        $response->getBody()->write(json_encode($payload, JSON_THROW_ON_ERROR));
        return $response->withHeader('Content-Type', 'application/json')
                       ->withStatus($statusCode);
    }

    /**
     * Return error JSON response
     */
    protected function errorResponse(
        Response $response, 
        string $message, 
        string $code = 'UNKNOWN_ERROR',
        array $details = [],
        int $statusCode = 400
    ): Response {
        $payload = [
            'success' => false,
            'error' => [
                'code' => $code,
                'message' => $message,
                'details' => $details
            ],
            'timestamp' => time(),
            'request_id' => uniqid('req_', true)
        ];

        $response->getBody()->write(json_encode($payload, JSON_THROW_ON_ERROR));
        return $response->withHeader('Content-Type', 'application/json')
                       ->withStatus($statusCode);
    }

    /**
     * Return a validation error response
     */
    protected function validationErrorResponse(
        Response $response,
        array $errors,
        string $message = 'Validation failed'
    ): Response {
        return $this->errorResponse(
            $response,
            $message,
            'VALIDATION_ERROR',
            $errors,
            422
        );
    }
}
