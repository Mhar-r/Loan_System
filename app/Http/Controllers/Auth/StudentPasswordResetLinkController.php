<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentPasswordResetLinkController extends Controller
{
    /**
     * Mostrar formulario de “Olvidé mi contraseña” para estudiantes
     */
    public function create(): Response
    {
        return Inertia::render('Students/ForgotPasswordStudent', [
            'status' => session('status'),
        ]);
    }

    /**
     * Enviar email de reset de contraseña para estudiantes
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:students,email',
        ]);

        $status = Password::broker('students')->sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
