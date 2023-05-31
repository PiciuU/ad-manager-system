<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';
    protected $dates = ['created_at', 'updated_at'];
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'is_seen',
        'date'
    ];
    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}