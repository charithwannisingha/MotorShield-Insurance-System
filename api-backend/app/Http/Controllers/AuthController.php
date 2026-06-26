<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // 1. Register (අලුත් ගිණුමක් හැදීම)
    public function register(Request $request)
    {
        // එවන දත්ත නිවැරදිදැයි පරීක්ෂා කිරීම
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'nic' => 'required|string|max:12|unique:users',
            'phone' => 'required|string|max:15',
        ]);

        // දත්ත සමුදායේ (Database) අලුත් පරිශීලකයෙක් සෑදීම
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // පාස්වර්ඩ් එක ආරක්ෂිතව හංගලා සේව් කරන්නේ මෙතනින්
            'nic' => $request->nic,
            'phone' => $request->phone,
            'role' => 'customer', // අලුතින් හැදෙන හැමෝම සාමාන්‍ය පාරිභෝගිකයන් වේ
        ]);

        // ලොගින් වීමට අවශ්‍ය Token එක සෑදීම
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    // 2. Login (ලොග් වීම)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // ඊමේල් එක හෝ පාස්වර්ඩ් එක වැරදි නම්
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // නිවැරදි නම් අලුත් Token එකක් ලබා දීම
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    // 3. Logout (ලොග් අවුට් වීම)
    public function logout(Request $request)
    {
        // පාවිච්චි කරපු Token එක මකා දැමීම
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}