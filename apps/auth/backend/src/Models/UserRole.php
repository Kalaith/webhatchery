<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * UserRole Model
 * Junction table for User-Role many-to-many relationship
 */
class UserRole extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'user_roles';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'role_id',
        'assigned_by',
        'assigned_at'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'assigned_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the user associated with this role assignment
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the role associated with this assignment
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the user who assigned this role
     */
    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /**
     * Create the user_roles table
     */
    public static function createTable(): void
    {
        $schema = \Illuminate\Database\Capsule\Manager::schema();
        
        if (!$schema->hasTable('user_roles')) {
            $schema->create('user_roles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
                $table->foreignId('assigned_by')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamp('assigned_at')->useCurrent();
                $table->timestamps();
                
                // Unique constraint to prevent duplicate role assignments
                $table->unique(['user_id', 'role_id']);
                
                // Indexes
                $table->index(['user_id']);
                $table->index(['role_id']);
                $table->index(['assigned_by']);
            });
            
            echo "✅ Created 'user_roles' table\n";
            
            // Assign default user role to existing users
            self::assignDefaultRoles();
        } else {
            echo "ℹ️  'user_roles' table already exists\n";
        }
    }

    /**
     * Assign default 'user' role to all existing users who don't have roles
     */
    private static function assignDefaultRoles(): void
    {
        try {
            $userRole = Role::getByName('user');
            if (!$userRole) {
                echo "⚠️  Default 'user' role not found, skipping role assignment\n";
                return;
            }

            // Get all users that don't have any roles assigned
            $usersWithoutRoles = User::leftJoin('user_roles', 'users.id', '=', 'user_roles.user_id')
                                    ->whereNull('user_roles.user_id')
                                    ->select('users.*')
                                    ->get();
            
            foreach ($usersWithoutRoles as $user) {
                self::create([
                    'user_id' => $user->id,
                    'role_id' => $userRole->id,
                    'assigned_by' => null, // System assignment
                    'assigned_at' => date('Y-m-d H:i:s')
                ]);
            }

            if ($usersWithoutRoles->count() > 0) {
                echo "✅ Assigned default 'user' role to {$usersWithoutRoles->count()} existing users\n";
            } else {
                echo "ℹ️  No existing users found to assign default roles\n";
            }
        } catch (\Exception $e) {
            echo "⚠️  Skipping default role assignment: " . $e->getMessage() . "\n";
        }
    }

    /**
     * Check if a user has a specific role
     */
    public static function userHasRole(int $userId, string $roleName): bool
    {
        return self::join('roles', 'user_roles.role_id', '=', 'roles.id')
                   ->where('user_roles.user_id', $userId)
                   ->where('roles.name', $roleName)
                   ->where('roles.is_active', true)
                   ->exists();
    }

    /**
     * Get all roles for a user
     */
    public static function getUserRoles(int $userId): array
    {
        return self::join('roles', 'user_roles.role_id', '=', 'roles.id')
                   ->where('user_roles.user_id', $userId)
                   ->where('roles.is_active', true)
                   ->pluck('roles.name')
                   ->toArray();
    }

    /**
     * Assign a role to a user
     */
    public static function assignRole(int $userId, string $roleName, ?int $assignedBy = null): bool
    {
        $role = Role::getByName($roleName);
        if (!$role) {
            return false;
        }

        // Check if already assigned
        if (self::userHasRole($userId, $roleName)) {
            return true; // Already has role
        }

        self::create([
            'user_id' => $userId,
            'role_id' => $role->id,
            'assigned_by' => $assignedBy,
            'assigned_at' => date('Y-m-d H:i:s')
        ]);

        return true;
    }

    /**
     * Remove a role from a user
     */
    public static function removeRole(int $userId, string $roleName): bool
    {
        $role = Role::getByName($roleName);
        if (!$role) {
            return false;
        }

        return self::where('user_id', $userId)
                   ->where('role_id', $role->id)
                   ->delete() > 0;
    }
}
