<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'customerId', 'policyId', 'paymentNumber', 'amount', 'paymentMethod', 'paymentDate', 'status'
    ];

    protected $casts = [
        'customerId' => 'integer',
        'policyId' => 'integer',
    ];
}