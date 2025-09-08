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
    $guards = empty($guards) ? [null] : $guards;

    foreach ($guards as $guard) {
        if (auth()->guard($guard)->check()) {
            if ($guard === 'web') {
                // Usuario admin o manager
                $roleId = auth()->user()->role_id;
                if ($roleId === 1) {
                    return redirect()->route('admin.dashboard');
                } elseif ($roleId === 2) {
                    return redirect()->route('manager.dashboard');
                }
                return redirect()->route('dashboard');
            } elseif ($guard === 'student') {
                return redirect()->route('students.dashboard');
            }
        }
    }

    return $next($request);
}
}
