<?php
// config.php

// Load environment variables from .env file
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // Skip comments
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
        putenv(trim($key) . '=' . trim($value));
    }
}

return [
    'auth0' => [
        'domain' => getenv('AUTH0_DOMAIN') ?: $_ENV['AUTH0_DOMAIN'] ?? null,
        'client_id' => getenv('AUTH0_CLIENT_ID') ?: $_ENV['AUTH0_CLIENT_ID'] ?? null,
        'client_secret' => getenv('AUTH0_CLIENT_SECRET') ?: $_ENV['AUTH0_CLIENT_SECRET'] ?? null,
        'audience' => getenv('AUTH0_AUDIENCE') ?: $_ENV['AUTH0_AUDIENCE'] ?? null,
    ],
    'app' => [
        'environment' => getenv('APP_ENV') ?: $_ENV['APP_ENV'] ?? 'production',
    ]
];
