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
        'role',
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
     * Create the users table
     */
    public static function createTable()
    {
        if (!Schema::schema()->hasTable('users')) {
            Schema::schema()->create('users', function (Blueprint $table) {
                $table->id();
                $table->string('email')->unique();
                $table->string('username')->unique();
                $table->string('password');
                $table->string('first_name')->nullable();
                $table->string('last_name')->nullable();
                $table->text('avatar_url')->nullable();
                $table->enum('role', ['user', 'admin', 'moderator'])->default('user');
                $table->boolean('is_active')->default(true);
                $table->timestamp('last_login_at')->nullable();
                $table->timestamp('email_verified_at')->nullable();
                $table->timestamps();

                // Indexes
                $table->index('email');
                $table->index('username');
                $table->index('role');
                $table->index('is_active');
            });
            echo "✅ Users table created\n";
        }
    }
}
