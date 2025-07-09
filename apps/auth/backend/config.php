<?php
// config.php
return [
    'auth0' => [
        'domain' => getenv('AUTH0_DOMAIN'),
        'client_id' => getenv('AUTH0_CLIENT_ID'),
        'client_secret' => getenv('AUTH0_CLIENT_SECRET'),
        'audience' => getenv('AUTH0_AUDIENCE'),
    ],
];
