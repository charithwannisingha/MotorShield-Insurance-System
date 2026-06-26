<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json(Notification::all());
    }

    public function store(Request $request)
    {
        try {
            $notification = Notification::create($request->all());
            return response()->json($notification, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // නිවේදන කියෙව්වාම Read කියලා Update කරන කෑල්ල
    public function update(Request $request, $id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->update($request->only('read'));
            return response()->json($notification);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}