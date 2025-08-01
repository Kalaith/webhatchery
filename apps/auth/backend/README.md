# JWT PHP Backend for Auth Portal

This backend provides JWT authentication and user management endpoints for the Auth Portal frontend.

## Setup

1. **Install Dependencies**:
   ```bash
   composer install
   ```

2. **Configure Environment**:
   - Update the JWT settings in `.env`:
     - `JWT_SECRET`: Your JWT secret key for signing tokens
     - `JWT_EXPIRATION`: Token expiration time in seconds (default: 86400 = 24 hours)
     - `APP_ENV`: Set to `development` for debug info
     - `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`: Database configuration

3. **Start the Server**:
   ```bash
   php -S localhost:8000 index.php
   ```

## Endpoints

- **POST /api/auth/login** — Login with email/password, returns JWT token
- **POST /api/auth/register** — Register a new user
- **GET /api/auth/me** — Get current user profile (requires JWT token)
- **GET /api/admin/users** — Get all users (requires admin JWT token)
- **GET /api/health** — Health check endpoint
- **POST /api/auth/logout** — Logout (client-side token removal)

## Setup

1. Install dependencies:

   ```sh
   composer install
   ```

2. Set environment variables (in your web server or `.env`):
   - `JWT_SECRET`
   - `JWT_EXPIRATION`
   - `DB_HOST`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASS`

3. Deploy to a PHP-capable server (Apache, Nginx, etc).

## Security
- All protected endpoints require a valid JWT token in the `Authorization: Bearer ...` header.
- JWT tokens are signed with a secret key for signature verification.

## Extending
- Add more endpoints as needed for your app.
- See `auth-middleware.php` for JWT validation logic.
