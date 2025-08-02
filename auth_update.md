# WebHatchery Auth Portal Integration Guide (React Frontend + PHP Backend)

## Overview
This comprehensive guide documents the steps and code patterns required to enable centralized authentication using the WebHatchery Auth Portal for any React frontend and PHP backend application. It is based on successful integrations with Mytherra and Planet Trader, and includes all lessons learned and common pitfalls.

**What this guide covers:**
- Complete backend PHP integration with JWT validation
- Complete frontend React integration with authentication context
- Common issues and troubleshooting
- Step-by-step implementation for beginners
- Testing and verification steps

---

## Prerequisites

### Required Software
- PHP 8.1 or higher
- Composer (PHP package manager)
- Node.js and npm (for frontend)
- MySQL database
- Web server (Apache/Nginx with mod_rewrite)

### Required Knowledge
- Basic PHP programming
- Basic React/TypeScript programming
- Understanding of JWT tokens
- Basic MySQL/database concepts

---

## Backend (PHP) Implementation

### Step 1: Install Required Dependencies

Add Firebase JWT library to your `composer.json`:
```json
{
    "require": {
        "firebase/php-jwt": "^6.0"
    }
}
```

Run composer install:
```bash
composer install
```

### Step 2: Environment Variables Configuration
- **CRITICAL**: All environment variables must match exactly between Auth Portal and your app
- Required in `.env`, `.env.preview`, etc.:
  ```bash
  # Auth Portal Integration - MUST MATCH AUTH PORTAL EXACTLY
  AUTH_PORTAL_JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
  AUTH_PORTAL_BASE_URL=http://127.0.0.1/auth
  AUTH_PORTAL_API_URL=http://127.0.0.1/auth/api
  AUTH_PORTAL_REDIRECT_URL=http://127.0.0.1/auth/callback
  ```

**⚠️ Common Mistake**: Using different JWT secrets between Auth Portal and your app will cause all token validation to fail.

### Step 3: Create AuthPortalService
### Step 3: Create AuthPortalService

Create file: `src/Services/AuthPortalService.php`

```php
<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthPortalService
{
    private string $jwtSecret;
    
    public function __construct()
    {
        $this->jwtSecret = $_ENV['AUTH_PORTAL_JWT_SECRET'] ?? 'default_secret';
    }
    
    /**
     * Validates a JWT token
     * @param string $token
     * @return array|null Decoded JWT payload, or null if invalid
     */
    public function validateToken(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            return (array) $decoded;
        } catch (\Exception $e) {
            error_log('JWT validation failed: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Extracts user information from JWT token
     * @param string $token
     * @return array|null User info with standardized fields
     */
    public function getUserFromToken(string $token): ?array
    {
        $decoded = $this->validateToken($token);
        if (!$decoded) return null;
        
        $roles = $decoded['roles'] ?? ['user'];
        $primaryRole = is_array($roles) ? ($roles[0] ?? 'user') : $roles;
        
        return [
            'user_id' => isset($decoded['sub']) ? (int)$decoded['sub'] : (isset($decoded['user_id']) ? (int)$decoded['user_id'] : null),
            'email' => $decoded['email'] ?? null,
            'username' => $decoded['username'] ?? null,
            'role' => $primaryRole,
            'roles' => $roles,
            'exp' => isset($decoded['exp']) ? (int)$decoded['exp'] : null,
            'iat' => isset($decoded['iat']) ? (int)$decoded['iat'] : null
        ];
    }
}
```

### Step 4: Create JWT Middleware

Create file: `src/Middleware/JwtAuthMiddleware.php`

```php
<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Server\MiddlewareInterface;
use App\Services\AuthPortalService;

class JwtAuthMiddleware implements MiddlewareInterface
{
    private AuthPortalService $authPortalService;

    public function __construct(AuthPortalService $authPortalService)
    {
        $this->authPortalService = $authPortalService;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $authHeader = $request->getHeaderLine('Authorization');
        if (empty($authHeader)) {
            return $this->unauthorizedResponse();
        }
        
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $this->unauthorizedResponse();
        }
        
        $token = $matches[1];
        $authUser = $this->authPortalService->getUserFromToken($token);
        
        if (!$authUser || !is_int($authUser['user_id'])) {
            return $this->unauthorizedResponse();
        }
        
        if (isset($authUser['exp']) && $authUser['exp'] < time()) {
            return $this->unauthorizedResponse('Token expired');
        }
        
        // Add user info to request for use in controllers
        $request = $request->withAttribute('auth_user', $authUser);
        return $handler->handle($request);
    }

    private function unauthorizedResponse(string $message = 'Unauthorized'): ResponseInterface
    {
        $response = new \Slim\Psr7\Response();
        $response->getBody()->write(json_encode(['success' => false, 'message' => $message]));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(401);
    }
}
```

### Step 5: Add Authentication Endpoint

In your main `index.php` or router, add the `/me` endpoint:

```php
// Check multiple sources for Authorization header (common issue fix)
$authHeader = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
} elseif (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    }
}

if ($route === 'me') {
    if (empty($authHeader)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authorization header required']);
        exit;
    }
    
    if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid Authorization header format']);
        exit;
    }
    
    $token = $matches[1];
    $authUser = $authPortalService->getUserFromToken($token);
    
    if (!$authUser || !is_int($authUser['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
        exit;
    }
    
    // Return user info
    echo json_encode([
        'success' => true,
        'data' => $authUser
    ]);
}
```

### Step 6: Database Considerations

**⚠️ CRITICAL MySQL vs SQLite Issue**: 
- Ensure all database table creation uses MySQL syntax: `INT AUTO_INCREMENT PRIMARY KEY`
- **NOT** SQLite syntax: `INTEGER PRIMARY KEY AUTOINCREMENT`
- This was a major issue in Planet Trader that caused SQL errors

If you have auto-initialization of tables, ensure they use proper MySQL syntax:
```php
// CORRECT for MySQL
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL
)

// WRONG (SQLite syntax)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth_user_id INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL
)
```

### Step 7: URL Routing Configuration

**⚠️ CRITICAL Routing Issue**: The .htaccess configuration must properly route API calls.

Create or update `.htaccess` in your project root:
```apache
RewriteEngine On

# Set the base path
RewriteBase /your_app_name/

# Route API requests to backend
RewriteCond %{REQUEST_URI} ^/your_app_name/api/
RewriteRule ^api/(.*)$ backend/public/index.php [QSA,L]

# Handle client-side routing for React app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/your_app_name/backend/
RewriteRule . index.html [L]
```

**Key Points:**
- Replace `your_app_name` with your actual app directory name (e.g., `planet_trader`, `mytherra`)
- API calls to `/your_app_name/api/me` should route to `backend/public/index.php`
- Frontend routes should go to `index.html`

### Step 8: User Model Integration
    auth_user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL
)

// WRONG (SQLite syntax)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth_user_id INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL
)
```
- Local user table should include:
  - `auth_user_id` (int, foreign key to Auth Portal user)
  - `auth_email` (string)
  - `auth_username` (string)
  - `role` (string)
  - `roles` (string[], optional)
- Example Eloquent model:
  ```php
  class User extends Model {
      protected $fillable = [
          'auth_user_id', // int
          'auth_email',   // string
          'auth_username',// string
          'role',         // string
          'roles'         // json array
          // ...other game-specific fields...
      ];
      // ...existing code...
  }
  ```

### 5. Route Protection
- Apply JWT middleware to all protected routes.
- Example:
  ```php
  $app->group('/api', function ($group) {
      $group->get('/me', ...);
      // ...other routes...
  })->add(new JwtAuthMiddleware(new AuthPortalService()));
  ```

### 6. Error Handling
- Return clear 401/403 errors for invalid or expired tokens.
- Log all JWT validation failures for debugging.

### 7. User Creation/Sync
- On first login, create a local user record using Auth Portal data.
- On subsequent logins, update local user info if changed.

---

## Frontend (React/TypeScript) Implementation

### Step 1: Environment Configuration

Create environment files for your frontend:

**`.env.preview`**:
```bash
# Frontend - Preview Environment
VITE_API_BASE_URL=http://127.0.0.1/your_app_name/api
VITE_AUTH_PORTAL_URL=http://127.0.0.1/auth
VITE_BASE_PATH=/your_app_name/
```

**`.env.production`**:
```bash
# Frontend - Production Environment
VITE_API_BASE_URL=/your_app_name/api
VITE_AUTH_PORTAL_URL=/auth
VITE_BASE_PATH=/your_app_name/
```

### Step 2: Vite Configuration

Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: mode === 'production' ? '/your_app_name/' : '/your_app_name/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/your_app_name/api')
      }
    }
  }
}))
```

### Step 3: Create AuthContext

Create file: `src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthUser {
  user_id: number;
  email: string;
  username?: string;
  role: string;
  roles: string[];
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/backend/api';
    fetch(`${apiBaseUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUser(data.data);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const login = () => {
    const authPortalUrl = import.meta.env.VITE_AUTH_PORTAL_URL || '/auth';
    window.location.href = `${authPortalUrl}/login?redirect=${encodeURIComponent(window.location.href)}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    const authPortalUrl = import.meta.env.VITE_AUTH_PORTAL_URL || '/auth';
    window.location.href = `${authPortalUrl}/logout`;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
```

### Step 4: Create ProtectedRoute Component

Create file: `src/contexts/ProtectedRoute.tsx`

```typescript
import React from 'react';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">Please log in to access this application.</p>
          <button 
            onClick={login}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Login with WebHatchery
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
```

### Step 5: Create UserInfo Display Component

Create file: `src/components/UserInfo.tsx`

```typescript
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserInfo: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated || !user) return null;

  return (
    <div className="user-info flex items-center gap-2 text-xs sm:text-sm text-gray-400">
      <span>Logged in as:</span>
      <span className="font-bold text-blue-300">{user.email}</span>
      {user.username && <span className="font-bold text-green-300">({user.username})</span>}
      <span className="text-gray-500">ID: {user.user_id}</span>
      <button 
        className="ml-2 px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white" 
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default UserInfo;
```

### Step 6: Create AuthService Utility

Create file: `src/services/AuthService.ts`

```typescript
class AuthService {
  private token: string | null = null;
  
  constructor() {
    this.token = localStorage.getItem('token');
  }
  
  getToken(): string | null {
    return this.token;
  }
  
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }
  
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }
  
  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export default new AuthService();
```

### Step 7: Update Main App

Update `src/main.tsx`:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import ProtectedRoute from './contexts/ProtectedRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    </AuthProvider>
  </StrictMode>,
)
```

### Step 8: Display User Info in Your App

In your main component (header, navbar, etc.), add the UserInfo component:

```typescript
import UserInfo from './components/UserInfo';

// In your component JSX:
<header className="app-header">
  <h1>Your App Name</h1>
  <UserInfo />
</header>
```

---

## Testing and Verification

### Step 1: Backend Testing

Test these endpoints manually or with a tool like Postman:

1. **Status Endpoint**: `GET http://127.0.0.1/your_app_name/api/status`
   - Should return: `{"status": "OK", "service": "Your App API", "version": "1.0.0"}`

2. **Auth Endpoint**: `GET http://127.0.0.1/your_app_name/api/me`
   - Headers: `Authorization: Bearer <your_jwt_token>`
   - Should return: `{"success": true, "data": {...user_info...}}`

### Step 2: Frontend Testing

1. **Build and Deploy**: Use your publish script to deploy to preview environment
2. **Access App**: Navigate to `http://127.0.0.1/your_app_name/`
3. **Login Flow**: 
   - Should see login button if not authenticated
   - Click login → redirected to Auth Portal
   - Login → redirected back with token
   - Should see user info in header

### Step 3: End-to-End Testing

1. **Full Flow Test**:
   - Clear localStorage: `localStorage.clear()`
   - Refresh page
   - Should see login screen
   - Login through Auth Portal
   - Should be redirected back and see user info

---

## Common Issues and Troubleshooting

### Issue 1: "Route not found" / 404 Errors

**Problem**: API endpoints return 404
**Cause**: Incorrect .htaccess routing
**Solution**: 
- Verify .htaccess file is in project root
- Check RewriteBase matches your app directory
- Ensure API routes use correct pattern: `/your_app_name/api/endpoint`

### Issue 2: "Authorization header required"

**Problem**: Backend doesn't receive Authorization header
**Cause**: Server configuration not passing headers
**Solution**: 
- Use the multiple header check code provided
- Verify .htaccess includes: `Header always set Access-Control-Allow-Headers "...Authorization..."`

### Issue 3: "JWT validation failed"

**Problem**: Token validation errors
**Causes & Solutions**:
- **Different JWT secrets**: Ensure AUTH_PORTAL_JWT_SECRET matches exactly between Auth Portal and your app
- **Token truncation**: Don't truncate token in logs (security issue we found)
- **Expired tokens**: Check exp field in token

### Issue 4: "SQLSTATE[42000]: Syntax error"

**Problem**: Database SQL syntax errors
**Cause**: Using SQLite syntax on MySQL database
**Solution**: 
- Use `INT AUTO_INCREMENT PRIMARY KEY` not `INTEGER PRIMARY KEY AUTOINCREMENT`
- Check all table creation code

### Issue 5: Environment Variables Not Loading

**Problem**: $_ENV variables are empty
**Cause**: dotenv not loading correctly
**Solution**:
```php
// Ensure this is in your index.php
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();
```

### Issue 6: CORS Errors

**Problem**: Browser blocks API requests
**Solution**: Add proper CORS headers in backend:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
```

### Issue 7: Frontend Build/Environment Issues

**Problem**: Environment variables not working in production
**Cause**: Vite env variables must start with `VITE_`
**Solution**: Use `VITE_API_BASE_URL` not `API_BASE_URL`

---

## Complete Implementation Checklist

### Backend Checklist
- [ ] Firebase JWT dependency installed (`composer require firebase/php-jwt`)
- [ ] Environment variables configured (JWT secret, Auth Portal URLs)
- [ ] AuthPortalService.php created with token validation
- [ ] JwtAuthMiddleware.php created
- [ ] `/api/me` endpoint implemented with multiple header check
- [ ] Database uses MySQL syntax (not SQLite)
- [ ] .htaccess routing configured
- [ ] CORS headers set properly

### Frontend Checklist
- [ ] Environment files created (.env.preview, .env.production)
- [ ] Vite config updated with proxy and base path
- [ ] AuthContext.tsx created
- [ ] ProtectedRoute.tsx created
- [ ] UserInfo.tsx component created
- [ ] AuthService.ts utility created
- [ ] Main app wrapped with AuthProvider and ProtectedRoute
- [ ] UserInfo component added to header/layout

### Testing Checklist
- [ ] Backend `/api/status` endpoint works
- [ ] Backend `/api/me` endpoint works with JWT token
- [ ] Frontend shows login screen when not authenticated
- [ ] Login flow redirects to Auth Portal and back
- [ ] User info displays after successful login
- [ ] Logout clears token and redirects

---

## Deployment Considerations

### Preview Environment
- Uses full URLs: `http://127.0.0.1/your_app_name/api`
- Auth Portal URL: `http://127.0.0.1/auth`
- Base path: `/your_app_name/`

### Production Environment
- Uses relative URLs: `/your_app_name/api`
- Auth Portal URL: `/auth`
- Same base path: `/your_app_name/`

### Security Notes
- Never log full JWT tokens in production
- Always validate token expiration
- Use HTTPS in production
- Keep JWT secrets secure and synchronized
---

## Summary

This comprehensive guide provides everything needed to integrate any React frontend + PHP backend application with the WebHatchery Auth Portal. 

### Key Success Factors:
1. **Exact JWT Secret Match**: The most critical requirement
2. **Proper URL Routing**: Correct .htaccess configuration
3. **MySQL Syntax**: No SQLite syntax in MySQL databases  
4. **Multiple Header Check**: Handle different server configurations
5. **Environment Variables**: Proper VITE_ prefixes and configuration

### Tested Successfully On:
- **Mytherra**: God simulation game (first implementation)
- **Planet Trader**: Trading game (second implementation with lessons learned)

### What You Get:
- **Single Sign-On (SSO)**: Users login once, access all WebHatchery apps
- **Centralized User Management**: All user data managed by Auth Portal
- **Secure JWT Authentication**: Industry-standard token-based auth
- **Seamless User Experience**: Smooth login/logout flow
- **Consistent UI**: User info displayed consistently across apps

### Next Steps:
1. Follow this guide step-by-step
2. Test each component as you build it
3. Use the troubleshooting section for any issues
4. Deploy to preview environment first
5. Test end-to-end before production

**Result**: Any developer, even new to programming, can successfully integrate their React frontend + PHP backend application with the WebHatchery Auth Portal using this guide.
