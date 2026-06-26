<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Claim extends Model
{
    use HasFactory;

    protected $fillable = [
        'claimNumber', 'policyId', 'policyNumber', 'customerId', 'customerName',
        'vehicleId', 'vehicleRegNo', 'vehicleMake', 'vehicleModel', 'claimType',
        'incidentDate', 'incidentLocation', 'incidentDescription', 'estimatedDamage',
        'approvedAmount', 'documents', 'status', 'reviewNotes', 'assignedTo',
        'reviewedAt', 'settledAt'
    ];

    protected $casts = [
        'policyId' => 'integer',
        'customerId' => 'integer',
        'vehicleId' => 'integer',
        'estimatedDamage' => 'double',
        'approvedAmount' => 'double',
        'documents' => 'array', 
    ];
}