<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;

class ManagerDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Manager/Dashboard'); // Va a React en resources/js/Pages/Manager/Dashboard.jsx
    }
}
