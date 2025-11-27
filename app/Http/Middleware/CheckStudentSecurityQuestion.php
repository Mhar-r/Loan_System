<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\SecurityQuestion;

class CheckStudentSecurityQuestion
{
    public function handle(Request $request, Closure $next)
    {
        $student = $request->session()->get('student');

        if ($student) {
            $security = SecurityQuestion::where('student_id', $student->id)->first();

            if (!$security) {
                // Flash message para Inertia
                \Inertia\Inertia::share('flash.warning', '⚠️ Por seguridad, por favor configura tu pregunta y respuesta de seguridad. Esto te ayudará a recuperar tu contraseña en caso de olvidarla. Puedes hacerlo desde el menú de Opciones en la parte superior derecha.');            }
        }

        return $next($request);
    }
}
