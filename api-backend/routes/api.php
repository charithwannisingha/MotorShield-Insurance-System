<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes (ලොගින් වෙන්න කලින් පාවිච්චි කරන්න පුළුවන් ලින්ක්)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected Routes (ලොගින් වුණාට පස්සේ විතරක් පාවිච්චි කරන්න පුළුවන් ලින්ක්)
Route::middleware('auth:sanctum')->group(function () {
    
    // User Profile Route
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // API Resources (මේකෙන් එක පේළියෙන් get, post, put, delete ඔක්කොම හැදෙනවා)
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('policies', PolicyController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('claims', ClaimController::class);
    Route::apiResource('notifications', NotificationController::class);
    
});