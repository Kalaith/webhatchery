# Auth0 PHP Backend for SES Auth Portal

This backend provides minimal Auth0 JWT validation and user profile endpoint for the SES Auth Portal frontend.

## Endpoints

- `POST /api/auth/login` — Not implemented (handled by Auth0 Universal Login)
- `POST /api/auth/logout` — Returns success (logout handled by frontend/Auth0)
- `GET /api/auth/profile` — Returns user info from JWT (requires Bearer token)

## Setup

1. Install dependencies:

   ```sh
   composer install
   ```

2. Set environment variables (in your web server or `.env`):
   - `AUTH0_DOMAIN`
   - `AUTH0_CLIENT_ID`
   - `AUTH0_CLIENT_SECRET`
   - `AUTH0_AUDIENCE`

3. Deploy to a PHP-capable server (Apache, Nginx, etc).

## Security
- All protected endpoints require a valid Auth0 JWT in the `Authorization: Bearer ...` header.
- JWKS is fetched from your Auth0 domain for signature verification.

## Extending
- Add more endpoints as needed for your app.
- See `auth-middleware.php` for JWT validation logic.
