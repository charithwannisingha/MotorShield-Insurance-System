<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'userId', 'title', 'message', 'type', 'read'
    ];

    protected $casts = [
        'userId' => 'integer',
        'read' => 'boolean',
    ];
}