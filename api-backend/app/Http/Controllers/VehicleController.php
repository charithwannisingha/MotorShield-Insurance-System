<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index()
    {
        return response()->json(Vehicle::all());
    }

    public function store(Request $request)
    {
        try {
            // React එකෙන් එවන ඔක්කොම අලුත් විස්තර ටික බාරගන්නවා
            $data = $request->only([
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
            ]);

            $vehicle = Vehicle::create($data);
            return response()->json($vehicle, 201);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}