<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth; 

use App\Models\User;
use App\Models\UserSecurityQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;


class UserSecurityQuestionController extends Controller
{


        // Mostrar formulario
        public function index()
        {
            $user = Auth::user();

            $security = UserSecurityQuestion::where('user_id', $user->id)->first();

            return inertia('Users/ForgotPassword/SecurityQuestionFormUser', [
                'user' => $user,
                'security' => $security
            ]);
        }




        // Guardar pregunta/respuesta
        public function store(Request $request)
        {
            $request->validate([
                'current_password' => 'required',
                'question' => 'required|string|max:255',
                'answer' => 'required|string|max:255',
            ]);

            $user = Auth::user();

            // Verificar contraseña actual
            if (!Hash::check($request->current_password, $user->password)) {
                return back()->with('error', 'La contraseña actual es incorrecta.');
            }

            // Crear o actualizar pregunta secreta
            UserSecurityQuestion::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'question' => $request->question,
                    'answer'   => Hash::make($request->answer),
                ]
            );

            return back()->with('success', 'Pregunta de seguridad guardada correctamente.');
        }

    

    // ============================
    // PASO 1: FORMULARIO EMAIL
    // ============================
    public function forgotForm()
    {
        return Inertia::render('Users/ForgotPassword/ForgotPasswordSecurityStep1');
    }

    // Validar email y pasar a paso 2
    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();
        $question = UserSecurityQuestion::where('user_id', $user->id)->first();

        if (!$question) {
            return back()->withErrors(['email' => 'Este usuario no tiene pregunta secreta registrada.']);
        }

        return redirect()->route('user.security.resetForm', $user->id);
    }

    // ============================
    // PASO 2 Y 3
    // ============================
    public function resetForm(User $user, Request $request)
    {
        $question = UserSecurityQuestion::where('user_id', $user->id)->first();

        if (!$question) {
            return redirect()->route('user.security.step1')
                ->withErrors(['email' => 'Este usuario no tiene pregunta secreta.']);
        }

        // Paso 3 (ya pasó pregunta secreta)
        if ($request->query('step') == 3) {
            return Inertia::render('Users/ForgotPassword/ForgotPasswordSecurityStep3', [
                'user'  => $user,
                'email' => $user->email,
            ]);
        }

        // Paso 2 (mostrar pregunta)
        return Inertia::render('Users/ForgotPassword/ForgotPasswordSecurityStep2', [
            'user'     => $user,
            'email'    => $user->email,
            'question' => $question->question,
        ]);
    }

    // ============================
    // GUARDAR PASO 2 Y 3
    // ============================
    public function resetPassword(Request $request, User $user)
{
    $security = UserSecurityQuestion::where('user_id', $user->id)->first();

    // ------------------------------------
    // PASO 2 → Validar respuesta secreta
    // ------------------------------------
    if ($request->step == 2) {
        $request->validate([
            'answer' => 'required|string',
        ]);

        if (!Hash::check($request->answer, $security->answer)) {
            return back()->withErrors(['answer' => 'Respuesta incorrecta.']);
        }

        return redirect()->route('user.security.resetForm', [
            'user' => $user->id,
            'step' => 3,
        ]);
    }

    // ------------------------------------
    // PASO 3 → VALIDACIÓN Y MANEJO DE ERRORES
    // ------------------------------------
    try {
        $request->validate([
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[a-z]/',  // minúscula
                'regex:/[A-Z]/',  // mayúscula
                'regex:/[0-9]/',  // número
            ],
            'new_question' => 'required|string|max:255',
            'new_answer'   => 'required|string|max:255',
        ]);

    } catch (\Illuminate\Validation\ValidationException $e) {

        // 🔥 La parte más importante:
        // Redirige a Step 3 en lugar de hacer "back()"
        return redirect()
            ->route('user.security.resetForm', [
                'user' => $user->id,
                'step' => 3
            ])
            ->withErrors($e->errors())
            ->withInput();
    }

    // ------------------------------------
    // PASO 3 → Actualizar contraseña + pregunta
    // ------------------------------------
    $user->update([
        'password' => Hash::make($request->password),
    ]);

    $security->update([
        'question' => $request->new_question,
        'answer'   => Hash::make($request->new_answer),
    ]);

    return redirect()->route('login')->with('success', 'Contraseña actualizada correctamente.');
}

}
