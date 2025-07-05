---
applyTo: '*.php'
---
# Clean Code Principles - PHP Backend

## Core Principles

- **Single Responsibility** - One purpose per class/function
- **Type Safety** - Use strict types and type hints
- **Separation of Concerns** - Clear separation between controllers, actions, models, and utilities
- **Error Handling** - Comprehensive error handling and logging
- **Consistency** - Follow PSR-12 coding standards
- **Modular Design** - Reusable and testable components

## Architecture

### Folder Structure
```
📁 backend/
├── public/          # Application entry point
├── src/
│   ├── Actions/     # Business logic and database operations
│   ├── Controllers/ # HTTP request/response handling
│   ├── External/    # Third-party integrations
│   ├── Models/      # Data structure and relationships
│   ├── Routes/      # API route definitions
│   └── Utils/       # Common utility functions
├── scripts/         # Initialization and maintenance scripts
├── game_constants.json
├── achievements.json
├── treasures.json
├── upgrades.json
├── upgrade_definitions.json
├── composer.json
└── README.md
```

### Component Responsibilities

- **Controllers**: Handle HTTP requests and responses.
- **Actions**: Contain business logic and database operations.
- **Models**: Define data structure and relationships.
- **External**: Handle third-party integrations.
- **Utils**: Provide common functionality.

## Best Practices

### Code Standards
- Follow PSR-12 coding standards.
- Use strict types and type hints.
- Document all classes and methods.

### Error Handling
- Implement robust error handling and logging.
- Use try-catch blocks for critical operations.
- Log errors to a file or monitoring system.

### Database Operations
- Use prepared statements to prevent SQL injection.
- Centralize database queries in models or actions.
- Ensure proper indexing and schema design.

### API Design
- Use RESTful principles for API endpoints.
- Validate all input data.
- Return consistent and meaningful HTTP responses.

### Testing
- Write PHPUnit tests for all critical functionality.
- Test controllers, actions, and models independently.
- Use mock objects for external dependencies.

### Environment Variables
- Store sensitive data in environment variables.
- Use `.env` files for local development.
- Avoid hardcoding credentials or configuration.

## Missing Elements Added

### Performance
- Optimize database queries and indexing.
- Use caching for frequently accessed data.
- Minimize memory usage in scripts.

### Developer Experience
- Use Composer for dependency management.
- Implement code formatting tools (e.g., PHP-CS-Fixer).
- Use pre-commit hooks for code quality checks.

### Production Ready
- Implement security measures (e.g., input validation, rate limiting).
- Use HTTPS for secure communication.
- Monitor application performance and errors.

### Accessibility
- Ensure API responses are well-documented.
- Provide meaningful error messages.
- Support multiple content types (e.g., JSON, XML).

## Benefits

1. **Maintainability** - Easy to find and modify code
2. **Testability** - Isolated, pure functions
3. **Reusability** - Modular and reusable components
4. **Type Safety** - Prevent runtime errors
5. **Performance** - Optimized database and API operations
6. **Scalability** - Designed for future growth
