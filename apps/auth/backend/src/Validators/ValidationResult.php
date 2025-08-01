<?php

namespace App\Validators;

/**
 * Container for validation results
 */
class ValidationResult
{
    public function __construct(
        public readonly bool $isValid,
        public readonly array $errors = [],
        public readonly array $sanitizedData = []
    ) {}

    /**
     * Check if validation passed
     */
    public function isValid(): bool
    {
        return $this->isValid;
    }

    /**
     * Get validation errors
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * Get sanitized data
     */
    public function getSanitizedData(): array
    {
        return $this->sanitizedData;
    }

    /**
     * Get first error message
     */
    public function getFirstError(): ?string
    {
        if (empty($this->errors)) {
            return null;
        }

        $firstField = array_key_first($this->errors);
        $firstFieldErrors = $this->errors[$firstField];
        
        return is_array($firstFieldErrors) ? $firstFieldErrors[0] : $firstFieldErrors;
    }
}
