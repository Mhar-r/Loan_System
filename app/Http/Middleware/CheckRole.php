<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @param  mixed  ...$roles  Roles permitidos
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Obtener usuario actual
        $user = Auth::user(); // usar guard por defecto (web)

        if (!$user) {
            abort(403, 'No autenticado');
        }

        // Convertir a int los roles permitidos
        $roles = array_map('intval', $roles);

        if (!in_array($user->role_id, $roles)) {
            abort(403, 'Acceso denegado');
        }

        return $next($request);
    }
}
