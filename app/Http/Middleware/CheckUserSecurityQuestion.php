<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\UserSecurityQuestion;
use Illuminate\Support\Facades\Auth;

class CheckUserSecurityQuestion
{
    // En tu middleware
public function handle(Request $request, Closure $next)
{
    $user = Auth::user();

    if ($user) {
        $security = UserSecurityQuestion::where('user_id', $user->id)->first();

        if (!$security) {
            // Compartir con Inertia directamente
            \Inertia\Inertia::share('flash.warning', '⚠️ Por seguridad, por favor configura tu pregunta y respuesta de seguridad. Esto te ayudará a recuperar tu contraseña en caso de olvidarla. Puedes hacerlo desde el menú de Opciones en la parte superior derecha.');
        }
    }

    return $next($request);
}

}
