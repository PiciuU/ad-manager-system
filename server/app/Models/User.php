<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $table = 'users';
    protected $casts = [
        'is_banned' => 'boolean',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'activated_at',
    ];

    protected $fillable = [
        'name',
        'login',
        'password',
        'email',
        'activation_key',
        'nip',
        'address',
        'postal_code',
        'country',
        'company_email',
        'company_phone',
        'representative',
        'representative_phone',
        'notes',
        'activated_at',
        'user_role_id'
    ];

    protected $hidden = [
        'password',
        'updated_at',
        'created_at'
    ];

    public function isAdmin()
    {
        return $this->userRole->name === 'Administrator';
    }

    public function hasAdminPrivileges()
    {
        return $this->tokenCan('admin') && $this->userRole->name === 'Administrator';
    }


    public function userRole()
    {
        return $this->belongsTo(UserRole::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function ads()
    {
        return $this->hasMany(Ad::class);
    }

    public function logs()
    {
        return $this->hasMany(Log::class);
    }
}
