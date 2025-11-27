<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StudentAuthController extends Controller
{
    /**
     * Muestra el formulario de login de estudiante.
     */
    public function showLoginForm()
    {
        // Si ya hay una sesión activa, redirigir al panel
        if (Session::has('student')) {
            return redirect()->route('students.dashboard');
        }

        return Inertia::render('Students/Login');
    }

    /**
     * Procesa el login de estudiante.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|string',
            'password'   => 'required|string',
        ]);

        $student = Student::where('student_id', $validated['student_id'])->first();

        if (!$student) {
            return back()->withErrors([
                'student_id' => 'No existe ningún estudiante con esa matrícula.',
            ])->withInput();
        }

        if (!Hash::check($validated['password'], $student->password)) {
            return back()->withErrors([
                'password' => 'Contraseña incorrecta.',
            ])->withInput();
        }

        Session::put('student', $student);

        return redirect()->route('students.dashboard')
            ->with('success', 'Inicio de sesión exitoso.');
    }


    /**
     * Panel del estudiante (protegido).
     */
    public function panel()
    {
        $student = Session::get('student');

        // ❌ Si no hay sesión activa
        if (!$student) {
            return redirect()
                ->route('student.login')
                ->withErrors(['auth' => 'Debes iniciar sesión primero.']);
        }

        // ✅ Renderizar panel del estudiante
        return Inertia::render('Students/Dashboard', [
            'student' => [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'name' => $student->name,
                'first_surname' => $student->first_surname,
                'second_surname' => $student->second_surname,
                'major' => $student->major,
                'group_name' => $student->group_name,
                'email' => $student->email,
                'phone' => $student->phone,
            ],
        ]);
    }

    /**
     * Cerrar sesión del estudiante.
     */
    public function logout()
    {
        Session::forget('student');
        return redirect('/')
            ->with('success', 'Sesión cerrada correctamente.');
    }
}
