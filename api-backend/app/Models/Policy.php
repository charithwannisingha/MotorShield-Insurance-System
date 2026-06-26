<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    use HasFactory;

    protected $fillable = [
        'customerId',
        'vehicleId',
        'policyNumber',
        'coverageType',
        'premiumAmount',
        'startDate',
        'endDate',
        'status',
        'renewedAt'
    ];

    // අකුරු විදිහට ආවොත් ඉලක්කම් කරන්න මේක දානවා
    protected $casts = [
        'customerId' => 'integer',
        'vehicleId' => 'integer',
    ];
}