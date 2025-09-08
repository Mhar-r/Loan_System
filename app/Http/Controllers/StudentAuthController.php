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
        return Inertia::render('Students/Login');
    }

    /**
     * Procesa el login de estudiante.
     */
    public function login(Request $request)
{
    $request->validate([
        'student_id' => 'required|string',
        'password'   => 'required|string',
    ]);

    $student = Student::where('student_id', $request->student_id)->first();

    if (!$student || !Hash::check($request->password, $student->password)) {
        return back()->withErrors([
            'login' => 'Matrícula o contraseña incorrectos.',
        ]);
    }

    Session::put('student', $student);

    return redirect()->route('students.dashboard');
}


    /**
     * Panel del estudiante (protegido).
     */
    public function panel()
{
    $student = Session::get('student'); // <--- agregar esta línea

    // Si no está logueado, redirigir
    if (!$student) {
        return redirect()->route('student.login')->withErrors([
            'auth' => 'Debes iniciar sesión primero.',
        ]);
    }

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
        return redirect()->route('student.login');
    }
}
