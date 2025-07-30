<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
        'user' => Auth::user()->load('role') // Asegúrate de cargar la relación
    ]);
    }
}
