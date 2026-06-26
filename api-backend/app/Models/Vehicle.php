<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'customerId',
        'registrationNumber',
        'make',
        'model',
        'year',
        'chassisNumber',
        'engineNumber',
        'color',
        'fuelType',
        'vehicleType',
        'engineCapacity',
        'seatingCapacity',
        'isActive'
    ];

    protected $casts = [
        'customerId' => 'integer',
    ];
}