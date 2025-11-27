<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class StudentNewPasswordController extends Controller
{
    /**
     * Mostrar formulario para escribir nueva contraseña.
     */
    public function create($token)
    {
        return Inertia::render('ForgotPassword/ResetPasswordStudent', [
            'token' => $token,
        ]);
    }

    /**
     * Guardar nueva contraseña del estudiante.
     */
    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:students,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::broker('students')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($student) use ($request) {
                $student->password = Hash::make($request->password);
                $student->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return redirect()->route('student.login')->with('success', 'Contraseña restablecida correctamente.');
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
