# Authentication Portal MVP

> A secure, full-stack authentication system for WebHatchery applications

## Overview

The Authentication Portal MVP is a complete authentication solution providing user registration, login, and session management capabilities. Built with modern technologies and security best practices, it serves as the authentication backbone for WebHatchery's ecosystem of applications.

## Features

- ✅ **User Registration** - Secure account creation with validation
- ✅ **User Login** - JWT-based authentication
- ✅ **Session Management** - Persistent login state
- ✅ **Protected Routes** - Route-level authentication guards
- ✅ **Role-Based Access Control** - Flexible role management system
- ✅ **Admin Panel Access** - Administrative user management
- ✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Token Security** - JWT tokens with proper expiration
- ✅ **Input Validation** - Frontend and backend validation
- ✅ **Password Security** - Bcrypt hashing with secure standards

## Technology Stack

### Frontend
- **React 19** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first styling
- **Axios** - HTTP client with interceptors

### Backend
- **PHP 8.1+** - Modern PHP with strong typing
- **Slim Framework v4** - Lightweight PSR-7 compliant framework
- **Eloquent ORM** - Database abstraction and modeling
- **Firebase JWT** - JSON Web Token handling
- **MySQL 8.0+** - Relational database

## Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **PHP** 8.1+ with extensions: pdo, pdo_mysql, mbstring, openssl
- **MySQL** 8.0+ or MariaDB 10.3+
- **Composer** for PHP dependency management

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd apps/auth/backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=auth_portal
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

4. **Initialize database:**
   ```bash
   php scripts/init-database.php
   ```

5. **Start backend server:**
   ```bash
   composer start
   # Or manually: php -S localhost:8000 -t public
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd apps/auth/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your backend URL:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Architecture

### Authentication Flow
```
1. User Registration/Login → Frontend validates input
2. Credentials sent to backend → Server validates against database
3. JWT token generated → Signed with secret key
4. Token stored in localStorage → Frontend persists session
5. Protected routes access → Token sent with requests
6. Middleware validation → Server verifies token
```

### Directory Structure

```
apps/auth/
├── backend/                 # PHP backend API
│   ├── src/
│   │   ├── Controllers/     # HTTP request handlers
│   │   ├── Actions/        # Business logic layer
│   │   ├── Models/         # Eloquent database models
│   │   ├── Middleware/     # JWT authentication middleware
│   │   └── Routes/         # API route definitions
│   ├── public/             # Web server document root
│   ├── scripts/            # Database initialization scripts
│   └── composer.json       # PHP dependencies
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page-level components
│   │   ├── api/           # HTTP client and API calls
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Helper functions
│   ├── public/            # Static assets
│   └── package.json       # Node.js dependencies
└── AUTHENTICATION_SYSTEM.md # Comprehensive system documentation
```

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User authentication |

### Protected Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/auth/me` | Get current user info | ✅ |
| POST | `/api/auth/logout` | User logout | ✅ |

### Admin Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | Get all users | ✅ Admin |
| GET | `/api/admin/roles` | Get all roles | ✅ Admin |
| POST | `/api/admin/users/assign-role` | Assign role to user | ✅ Admin |
| POST | `/api/admin/users/remove-role` | Remove role from user | ✅ Admin |
| PUT | `/api/admin/users/{userId}` | Update user information | ✅ Admin |
| DELETE | `/api/admin/users/{userId}` | Delete user | ✅ Admin |
| POST | `/api/admin/users/{userId}/reset-password` | Reset user password | ✅ Admin |
| POST | `/api/admin/users/{userId}/deactivate` | Deactivate user | ✅ Admin |

## Security Features

### Password Security
- **Bcrypt Hashing** - Industry-standard password hashing
- **Minimum Length** - 8-character minimum requirement
- **No Plain Text Storage** - Passwords never stored in plain text

### JWT Security
- **HS256 Algorithm** - HMAC with SHA-256 signing
- **24-Hour Expiration** - Automatic token expiry
- **Secure Payload** - User ID, email, role, and timestamps
- **Secret Key Protection** - Environment-based secret management

### Request Security
- **CORS Configuration** - Proper cross-origin request handling
- **Authorization Headers** - Bearer token authentication
- **Input Validation** - Server-side request validation
- **SQL Injection Protection** - Eloquent ORM parameterized queries

## Role System

### Role Architecture
The authentication portal implements a flexible role-based access control (RBAC) system:

- **Roles Table** - Stores role definitions (admin, user, moderator)
- **User Roles Junction Table** - Many-to-many relationship between users and roles
- **Legacy Compatibility** - Maintains existing `users.role` field during transition
- **Default Roles** - Automatically creates standard system roles

### Available Roles
- **User** - Standard user with basic access permissions
- **Admin** - Administrator with full system access including user management
- **Moderator** - Limited administrative permissions

### Role Management Features
- **Multiple Roles per User** - Users can have multiple roles simultaneously
- **Role Assignment Tracking** - Records who assigned roles and when
- **Admin-Only Management** - Role assignments restricted to administrators
- **Automatic Role Assignment** - New users automatically get 'user' role

### Admin Capabilities
Administrators can:
- View all system users and their roles
- Assign roles to users
- Remove roles from users  
- View role statistics and user counts
- Access comprehensive user management interface
- Edit user information (email, username, names, status)
- Delete user accounts (with safety restrictions)
- Reset user passwords (generates temporary passwords)
- Deactivate/activate user accounts
- Filter and search users by various criteria

## Development

### Frontend Development
```bash
cd apps/auth/frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend Development
```bash
cd apps/auth/backend
composer start       # Start development server
composer test        # Run PHPUnit tests
```

### Environment Variables

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

#### Backend (`.env`)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=auth_portal
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Development Settings
API_DEBUG=true
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NULL,
    last_name VARCHAR(255) NULL,
    avatar_url TEXT NULL,
    role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Roles Table
```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL COMMENT 'Role name (e.g., admin, user, moderator)',
    display_name VARCHAR(100) NOT NULL COMMENT 'Human-readable role name',
    description TEXT NULL COMMENT 'Role description and permissions',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Whether the role is active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### User Roles Junction Table
```sql
CREATE TABLE user_roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    assigned_by BIGINT UNSIGNED NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id)
);
```

## Testing

### Frontend Testing
```bash
cd apps/auth/frontend
npm test             # Run Vitest tests
```

### Backend Testing
```bash
cd apps/auth/backend
composer test        # Run PHPUnit tests
```

### Manual Testing
1. **Registration Flow** - Create new user account
2. **Login Flow** - Authenticate with credentials
3. **Protected Routes** - Access authenticated pages
4. **Token Expiry** - Test token expiration handling
5. **Error Handling** - Test various error scenarios

## Deployment

### Production Checklist
- [ ] Update JWT secret to cryptographically secure random key
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Enable error logging
- [ ] Set up monitoring and alerts
- [ ] Configure CORS for production domains
- [ ] Optimize build settings

### Build Commands
```bash
# Frontend production build
cd apps/auth/frontend
npm run build

# Backend optimization
cd apps/auth/backend
composer install --no-dev --optimize-autoloader
```

## Troubleshooting

### Common Issues

**Connection refused**
- Verify backend server is running on correct port
- Check VITE_API_URL configuration

**Authorization header missing**
- Ensure token is stored in localStorage
- Verify axios interceptor configuration

**Invalid token signature**
- Check JWT_SECRET consistency between environments
- Regenerate tokens after secret changes

**Database connection failed**
- Verify database credentials in .env
- Ensure MySQL server is running
- Check database exists and user has permissions

### Debug Tools
- **Browser DevTools** - Network tab for API inspection
- **React DevTools** - Component state debugging
- **jwt.io** - JWT token inspection and validation
- **Backend Logs** - PHP error logs for server issues

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following coding standards
4. Test your changes thoroughly
5. Submit a pull request with detailed description

## License

This project is part of the WebHatchery ecosystem. See the main repository for license information.

## Support

For issues and questions:
1. Check the [AUTHENTICATION_SYSTEM.md](./AUTHENTICATION_SYSTEM.md) for detailed documentation
2. Review troubleshooting section above
3. Create an issue in the main WebHatchery repository

---

**Version:** MVP 1.0  
**Last Updated:** August 2025  
**Status:** Production Ready ✅
