<?php
// init-database.php - Initialize Auth Portal database

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use Dotenv\Dotenv;
use App\Models\User;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Database setup
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => $_ENV['DB_HOST'],
    'port' => $_ENV['DB_PORT'],
    'database' => $_ENV['DB_DATABASE'],
    'username' => $_ENV['DB_USERNAME'],
    'password' => $_ENV['DB_PASSWORD'],
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

echo "🚀 Initializing Auth Portal Database...\n\n";

try {
    // Create users table
    User::createTable();
    
    echo "\n✅ Database initialization completed successfully!\n";
    echo "📊 You can now start using the Auth Portal API.\n";
    
} catch (Exception $e) {
    echo "\n❌ Database initialization failed: " . $e->getMessage() . "\n";
    exit(1);
}
