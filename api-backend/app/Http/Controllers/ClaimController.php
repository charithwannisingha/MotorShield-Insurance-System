<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use Illuminate\Http\Request;

class ClaimController extends Controller
{
    public function index()
    {
        return response()->json(Claim::all());
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            
            // React එකෙන් claimNumber එකක් එවුවේ නැත්නම් ඉබේම එකක් හදනවා
            if (empty($data['claimNumber'])) {
                $data['claimNumber'] = 'CLM-' . rand(100000, 999999);
            }

            $claim = Claim::create($data);
            return response()->json($claim, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $claim = Claim::findOrFail($id);
            $claim->update($request->all());
            return response()->json($claim);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}