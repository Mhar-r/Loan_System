<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response|\Illuminate\Http\RedirectResponse
    {
        // 👇 Si ya está autenticado, redirige según el rol
        if (Auth::check()) {
            $user = Auth::user();

            if ($user->role_id === 1) {
                return redirect('/admin/dashboard');
            }

            if ($user->role_id === 2) {
                return redirect('/manager/dashboard');
            }

            return redirect(RouteServiceProvider::HOME);
        }

        // 👇 Si no está autenticado, muestra el login normal
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }


    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        if ($user->role_id === 1) {
            // Redirige a dashboard admin
            return redirect()->intended('/admin/dashboard');
        }

        if ($user->role_id === 2) {
            // Redirige a dashboard encargado
            return redirect()->intended('/manager/dashboard');
        }

        // Si el rol no es 1 ni 2, redirige a la ruta HOME por defecto
        return redirect()->intended(RouteServiceProvider::HOME);
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    
}
