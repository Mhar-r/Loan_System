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
        return Inertia::render('Auth/RegisterStudent');
    }

    /**
     * Registrar un nuevo estudiante.
     */
    public function store(Request $request)
    {
        $request->validate([
            'student_id'   => 'required|string|max:20|unique:students,student_id',
            'name'   => 'required|string|max:100',
            'first_surname'    => 'required|string|max:50',
            'second_surname'  => 'required|string|max:50',
            'major'        => 'required|in:Systems,Electronics,Mechatronics,Industrial,Other',
            'group_name'   => 'nullable|string|max:20',
            'email'        => 'required|email|unique:students,email',
            'phone'        => 'nullable|string|max:15',

            
        ]);

        Student::create([
            'student_id'   => $request->student_id,
            'name'   => $request->name,
            'first_surname'    => $request->first_surname,
            'second_surname'  => $request->second_surname,
            'major'        => $request->major,
            'group_name'   => $request->group_name,
            'email'        => $request->email,
            'phone'        => $request->phone,
        ]);

        return redirect()->route('solicitudes.index')->with('success', 'Registro exitoso. Ahora puedes hacer tu solicitud.');

    }
}
