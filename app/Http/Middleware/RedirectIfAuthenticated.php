<?php

// app/Http/Middleware/RedirectIfAuthenticated.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next, ...$guards)
    {
        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::user();

                if ($user->role_id === 1) return redirect()->route('admin.dashboard');
                if ($user->role_id === 2) return redirect()->route('manager.dashboard');
            }
        }

        return $next($request);
    }
}

