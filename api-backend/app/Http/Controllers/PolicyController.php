<?php

namespace App\Http\Controllers;

use App\Models\Policy;
use Illuminate\Http\Request;

class PolicyController extends Controller
{
    public function index()
    {
        return response()->json(Policy::all());
    }

    public function store(Request $request)
    {
        try {
            $data = $request->only([
                'customerId',
                'vehicleId',
                'policyNumber',
                'coverageType',
                'premiumAmount',
                'startDate',
                'endDate',
                'status',
                'renewedAt'
            ]);

            $policy = Policy::create($data);
            return response()->json($policy, 201);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $policy = Policy::findOrFail($id);
            $policy->update($request->all());
            return response()->json($policy);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}