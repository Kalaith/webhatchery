<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Role Model
 * Manages system roles and permissions
 */
class Role extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'roles';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'is_active'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get users with this role
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles')
                    ->withTimestamps();
    }

    /**
     * Create the roles table
     */
    public static function createTable(): void
    {
        $schema = \Illuminate\Database\Capsule\Manager::schema();
        
        if (!$schema->hasTable('roles')) {
            $schema->create('roles', function (Blueprint $table) {
                $table->id();
                $table->string('name', 50)->unique()->comment('Role name (e.g., admin, user, moderator)');
                $table->string('display_name', 100)->comment('Human-readable role name');
                $table->text('description')->nullable()->comment('Role description and permissions');
                $table->boolean('is_active')->default(true)->comment('Whether the role is active');
                $table->timestamps();
                
                // Indexes
                $table->index(['name']);
                $table->index(['is_active']);
            });
            
            echo "✅ Created 'roles' table\n";
            
            // Insert default roles
            self::insertDefaultRoles();
        } else {
            echo "ℹ️  'roles' table already exists\n";
        }
    }

    /**
     * Insert default system roles
     */
    private static function insertDefaultRoles(): void
    {
        $defaultRoles = [
            [
                'name' => 'user',
                'display_name' => 'User',
                'description' => 'Standard user with basic access permissions',
                'is_active' => true
            ],
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Administrator with full system access including user management',
                'is_active' => true
            ],
            [
                'name' => 'moderator',
                'display_name' => 'Moderator',
                'description' => 'Moderator with limited administrative permissions',
                'is_active' => true
            ]
        ];

        foreach ($defaultRoles as $roleData) {
            if (!self::where('name', $roleData['name'])->exists()) {
                self::create($roleData);
                echo "✅ Created default role: {$roleData['display_name']}\n";
            }
        }
    }

    /**
     * Get role by name
     */
    public static function getByName(string $name): ?self
    {
        return self::where('name', $name)->where('is_active', true)->first();
    }
}
