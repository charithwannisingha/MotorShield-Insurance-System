<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        try {
            // Database එකේ අනිවාර්යයෙන් තියෙන දත්ත ටික විතරක් අරගන්නවා (Address/DOB නිසා එන Error එක මේකෙන් නැතිවෙනවා)
            $data = $request->only(['name', 'email', 'password', 'nic', 'phone', 'role', 'isActive']);
            
            // Password එක Hash කරනවා
            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                $data['password'] = Hash::make('12345678');
            }

            $data['role'] = $data['role'] ?? 'customer';
            
            // Boolean අගයක් විදිහට සකස් කරනවා
            $data['isActive'] = filter_var($request->isActive, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;

            $user = User::create($data);
            return response()->json($user, 201);
            
        } catch (\Exception $e) {
            // Error එකක් ආවොත් ඒක මොකක්ද කියලා React එකට යවනවා
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            $data = $request->only(['name', 'email', 'nic', 'phone', 'role', 'isActive']);
            
            if (!empty($request->password)) {
                $data['password'] = Hash::make($request->password);
            }

            if (isset($request->isActive)) {
                $data['isActive'] = filter_var($request->isActive, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            }

            $user->update($data);
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}