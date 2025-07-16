# Dungeon Core Backend

Clean Architecture PHP backend for the Dungeon Core game.

## Setup

1. Install dependencies:
```bash
composer install
```

2. Configure database in `config/database.php`

3. Run database migrations:
```bash
mysql -u username -p database_name < migrations/001_create_tables.sql
```

4. Start development server:
```bash
php -S localhost:8000 -t public
```

## API Endpoints

### Game State
- `GET /api/game/state` - Get current game state
- `POST /api/game/place-monster` - Place monster in room

### Dungeon Management  
- `POST /api/dungeon/add-room` - Add room to dungeon

## Architecture

### Domain Layer
- **Entities**: Pure business objects (Game, Monster)
- **Repositories**: Interfaces for data access
- **Services**: Business logic calculations

### Application Layer
- **Use Cases**: Application-specific business rules
- **DTOs**: Data transfer objects

### Infrastructure Layer
- **Database**: MySQL implementations of repositories
- **Migrations**: Database schema

### Controllers
- HTTP request/response handling
- Route to appropriate use cases

## Database Independence

The domain layer has no database dependencies. To switch databases:

1. Create new repository implementations (e.g., `PostgreSQLGameRepository`)
2. Update dependency injection in `public/index.php`
3. Business logic remains unchanged

## Security Features

- Server-side validation of all actions
- Mana/gold spending verification
- Room capacity limits enforced
- Session-based game state