<?php

namespace App\Http\Controllers;

use App\Models\SecurityQuestion;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SecurityQuestionController extends Controller
{
    public function create()
    {
        $student = session('student');

        if (!$student) {
            return redirect()->route('student.login');
        }

        return Inertia::render('ForgotPassword/SecurityQuestionForm', [
            'student' => $student
        ]);
    }

    // Guardar o actualizar pregunta secreta
    public function store(Request $request)
    {
        $student = session('student');

        if (!$student) {
            return redirect()->route('student.login')
                ->withErrors(['auth' => 'Debes iniciar sesión primero.']);
        }

        $existing = SecurityQuestion::where('student_id', $student->id)->first();

        $rules = [
            'question' => 'required|string|max:255',
            'answer'   => 'required|string|max:255',
        ];

        if ($existing) {
            $rules['current_password'] = 'required|string';
        }

        $request->validate($rules);

        if ($existing && !Hash::check($request->current_password, $student->password)) {
            return redirect()->back()->withErrors([
                'current_password' => 'La contraseña actual no es correcta.'
            ]);
        }

        SecurityQuestion::updateOrCreate(
            ['student_id' => $student->id],
            [
                'question' => $request->question,
                'answer'   => Hash::make($request->answer),
            ]
        );

        return redirect()->back()->with('success', 'Pregunta secreta guardada correctamente.');
    }

    // FORMULARIO PASO 1: email
    public function forgotForm()
    {
        return Inertia::render('ForgotPassword/ForgotPasswordSecurityStep1');
    }

    // VALIDAR EMAIL Y PASAR AL PASO 2
    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:students,email',
        ]);

        $student = Student::where('email', $request->email)->first();
        $security = SecurityQuestion::where('student_id', $student->id)->first();

        if (!$security) {
            // Mostrar error en el mismo paso
            return Inertia::render('ForgotPassword/ForgotPasswordSecurityStep1', [
                'errors' => ['email' => 'Este estudiante no tiene pregunta de seguridad registrada.']
            ]);
        }

        // Pasar directamente al paso 2 enviando el estudiante
        return redirect()->route('student.security-question.resetForm', $student->id);

    }

    // PASO 2 Y PASO 3 (MISMA RUTA, diferenciados por "step")
    public function resetPassword(Request $request, Student $student)
    {
        $security = SecurityQuestion::where('student_id', $student->id)->first();

        // PASO 2 → Validar respuesta secreta
        if ($request->step == 2) {

            $request->validate([
                'answer' => 'required|string'
            ]);

            if (!Hash::check($request->answer, $security->answer)) {
                // Volver a mostrar el mismo paso con error
                return back()->withErrors(['answer' => 'Respuesta incorrecta'])
             ->withInput();

            }

            // Ir al paso 3
            return redirect()
                ->route('student.security-question.resetForm', [
                    'student' => $student->id,
                    'step' => 3
                ]);

        }

        // PASO 3 → Cambiar contraseña + nueva pregunta (validación avanzada)
        $request->validate([
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[a-z]/',   // minúscula
                'regex:/[A-Z]/',   // mayúscula
                'regex:/[0-9]/',   // número
            ],
            'new_question' => 'required|string|max:255',
            'new_answer'   => 'required|string|max:255',
        ], [
            'password.min' => 'La contraseña debe tener mínimo 8 caracteres.',
            'password.regex' => 'La contraseña debe incluir una mayúscula, una minúscula y un número.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ]);


        // Actualizar contraseña
        $student->update([
            'password' => Hash::make($request->password),
        ]);

        // Actualizar pregunta secreta
        SecurityQuestion::updateOrCreate(
            ['student_id' => $student->id],
            [
                'question' => $request->new_question,
                'answer'   => Hash::make($request->new_answer),
            ]
        );

        // Redirigir al login de forma SPA
        return redirect()->route('student.login')
    ->with('success', 'Contraseña actualizada correctamente.');


    }

    public function resetForm(Student $student, Request $request)
{
    $security = SecurityQuestion::where('student_id', $student->id)->first();

    if (!$security) {
        // Si no hay pregunta registrada, regresar al paso 1 con error
        return Inertia::render('ForgotPassword/ForgotPasswordSecurityStep1', [
            'errors' => ['email' => 'Este estudiante no tiene pregunta de seguridad registrada.']
        ]);
    }

    // Si en la query viene ?step=3 mostramos el Step3 (por ejemplo tras validar respuesta vía redirect)
    if ($request->query('step') == 3) {
        return Inertia::render('ForgotPassword/ForgotPasswordSecurityStep3', [
            'student' => $student,
            'email'   => $student->email,
        ]);
    }

    // Por defecto mostramos Step2 (pregunta)
    return Inertia::render('ForgotPassword/ForgotPasswordSecurityStep2', [
        'student'  => $student,
        'email'    => $student->email,
        'question' => $security->question,
    ]);
}
}
