<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StudentPasswordController extends Controller
{
    // Mostrar formulario de cambio de contraseña
    public function edit()
    {
        $student = session('student');

        if (!$student) {
            return redirect()->route('student.login');
        }

        return Inertia::render('Students/ChangePassword', [
            'student' => $student
        ]);
    }


    // Actualizar contraseña
    public function update(Request $request)
    {
        $student = session('student');

        if (!$student) {
            return redirect()->route('student.login');
        }

        $request->validate([
            'current_password' => 'required|string',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
            ],
        ], [
            'password.regex' => 'La contraseña debe tener una mayúscula, una minúscula y un número.',
            'password.confirmed' => 'Las nuevas contraseñas no coinciden.',
        ]);

        // Validar contraseña actual
        if (!Hash::check($request->current_password, $student->password)) {
            return back()->withErrors([
                'current_password' => 'La contraseña actual es incorrecta.'
            ]);
        }

        // Actualizar contraseña
        $student->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Contraseña actualizada correctamente.');
    }
}
