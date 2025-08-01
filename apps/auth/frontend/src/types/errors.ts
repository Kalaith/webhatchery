/**
 * Error types and utilities for consistent error handling
 */

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  timestamp?: number;
  request_id?: string;
}

export interface ApiSuccess<T = any> {
  success: true;
  message: string;
  data: T;
  timestamp?: number;
  request_id?: string;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

export class AuthenticationError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, string>;

  constructor(
    code: string,
    message: string,
    details?: Record<string, string>
  ) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends Error {
  public readonly errors: Record<string, string[]>;

  constructor(
    errors: Record<string, string[]>,
    message: string = 'Validation failed'
  ) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class NetworkError extends Error {
  public readonly status?: number;

  constructor(
    message: string = 'Network error occurred',
    status?: number
  ) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

/**
 * Parse API error from response
 */
export function parseApiError(error: any): AuthenticationError | ValidationError | NetworkError {
  // Network error
  if (!error.response) {
    return new NetworkError('Network connection failed');
  }

  const { response } = error;
  
  // Handle different status codes
  if (response.status >= 500) {
    return new NetworkError('Server error occurred', response.status);
  }

  // Parse API error response
  const apiError = response.data as ApiError;
  
  if (apiError?.error) {
    const { code, message, details } = apiError.error;
    
    // Validation errors
    if (code === 'VALIDATION_ERROR' && details) {
      // Convert details to errors format
      const errors: Record<string, string[]> = {};
      Object.entries(details).forEach(([field, error]) => {
        errors[field] = Array.isArray(error) ? error : [error as string];
      });
      return new ValidationError(errors, message);
    }
    
    // Authentication errors
    if (code === 'UNAUTHORIZED' || code === 'INVALID_CREDENTIALS') {
      return new AuthenticationError(code, message, details);
    }
    
    // Generic API error
    return new AuthenticationError(code, message, details);
  }

  // Fallback error
  return new NetworkError('An unexpected error occurred', response.status);
}

/**
 * Error codes that should clear user session
 */
export const SESSION_INVALIDATING_CODES = [
  'UNAUTHORIZED',
  'TOKEN_EXPIRED',
  'TOKEN_INVALID',
  'SESSION_EXPIRED'
];

/**
 * Check if error should invalidate session
 */
export function shouldInvalidateSession(error: AuthenticationError): boolean {
  return SESSION_INVALIDATING_CODES.includes(error.code);
}
