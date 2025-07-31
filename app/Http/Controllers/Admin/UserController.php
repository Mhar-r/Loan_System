<?php

// app/Http/Controllers/Admin/UserController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('role')->get(); // si tienes relación con roles
        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }
}
