<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Mostrar el formulario de registro de estudiante.
     */
    public function create(): Response
    {
        return Inertia::render('Students/RegisterStudent');
    }

    /**
     * Registrar un nuevo estudiante.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id'   => 'required|string|max:20|unique:students,student_id',
            'name'         => 'required|string|max:100',
            'first_surname'=> 'required|string|max:50',
            'second_surname'=> 'required|string|max:50',
            'major'        => 'required|in:Software,Electronics,Mechatronics,Industrial,Other',
            'group_name'   => 'nullable|string|max:20',
            'email'        => 'required|email|unique:students,email',
            'phone'        => 'nullable|string|max:15',
            'password' => [
                'required',
                'string',
                'min:8', // mínimo 8 caracteres
                'confirmed',
                'regex:/[a-z]/',      // al menos una minúscula
                'regex:/[A-Z]/',      // al menos una mayúscula
                'regex:/[0-9]/',      // al menos un número
            ],

        ], [
            'password.regex' => 'La contraseña debe tener al menos una mayúscula, una minúscula y un número.',
        ], [
            'student_id' => 'matrícula',
            'name' => 'nombre',
            'first_surname' => 'primer apellido',
            'second_surname' => 'segundo apellido',
            'major' => 'carrera',
            'email' => 'correo electrónico',
            'password' => 'contraseña',
        ]);

        Student::create([
            'student_id'   => $validated['student_id'],
            'name'         => $validated['name'],
            'first_surname'=> $validated['first_surname'],
            'second_surname'=> $validated['second_surname'],
            'major'        => $validated['major'],
            'group_name'   => $validated['group_name'] ?? null,
            'email'        => $validated['email'],
            'phone'        => $validated['phone'] ?? null,
            'password'     => Hash::make($validated['password']),
        ]);

        // Devuelve éxito a Inertia, no redirect
        return redirect()->route('student.login')->with('success', 'Registro exitoso.');
    }


    public function searchByMatricula($matricula)
    {
        $student = Student::where('student_id', $matricula)->first();

        if ($student) {
            return response()->json([
                'success' => true,
                'student' => $student,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Estudiante no encontrado',
        ], 404);
    }

    public function index(Request $request)
    {
        $query = Student::query();

        // 🔎 Filtro por carrera (major)
        if ($request->has('major') && $request->major != '') {
            $query->where('major', $request->major);
        }

        // 🔎 Filtro por grupo
        if ($request->has('group_name') && $request->group_name != '') {
            $query->where('group_name', $request->group_name);
        }

        // 🔎 Búsqueda por nombre o matrícula
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('first_surname', 'like', "%$search%")
                  ->orWhere('second_surname', 'like', "%$search%")
                  ->orWhere('student_id', 'like', "%$search%");
            });
        }

        $students = $query->orderBy('first_surname')->paginate(10);

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters'  => $request->only(['major', 'group_name', 'search']),
        ]);
    }


}
