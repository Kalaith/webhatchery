<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Schema;

class User extends Model
{
    protected $table = 'users';
    
    protected $fillable = [
        'email',
        'username',
        'password',
        'first_name',
        'last_name',
        'avatar_url',
        'is_active',
        'last_login_at',
        'email_verified_at'
    ];
    
    protected $hidden = [
        'password'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
        'email_verified_at' => 'datetime'
    ];

    /**
     * Get the roles associated with the user
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles')
                    ->withTimestamps();
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $roleName): bool
    {
        return UserRole::userHasRole($this->id, $roleName);
    }

    /**
     * Get all role names for this user
     */
    public function getRoleNames(): array
    {
        return UserRole::getUserRoles($this->id);
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is a moderator
     */
    public function isModerator(): bool
    {
        return $this->hasRole('moderator');
    }

    /**
     * Assign a role to this user
     */
    public function assignRole(string $roleName, ?int $assignedBy = null): bool
    {
        return UserRole::assignRole($this->id, $roleName, $assignedBy);
    }

    /**
     * Remove a role from this user
     */
    public function removeRole(string $roleName): bool
    {
        return UserRole::removeRole($this->id, $roleName);
    }

    /**
     * Create the users table
     */
    public static function createTable()
    {
        $schema = \Illuminate\Database\Capsule\Manager::schema();
        
        if (!$schema->hasTable('users')) {
            $schema->create('users', function (Blueprint $table) {
                $table->id();
                $table->string('email')->unique();
                $table->string('username')->unique();
                $table->string('password');
                $table->string('first_name')->nullable();
                $table->string('last_name')->nullable();
                $table->text('avatar_url')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamp('last_login_at')->nullable();
                $table->timestamp('email_verified_at')->nullable();
                $table->timestamps();

                // Indexes
                $table->index('email');
                $table->index('username');
                $table->index('is_active');
            });
            echo "✅ Users table created\n";
        } else {
            echo "ℹ️  Users table already exists\n";
        }
    }
}
