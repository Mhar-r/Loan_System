<?php

// app/Http/Controllers/LoanController.php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\LoanDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LoanController extends Controller
{
    public function create()
    {
        // Retorna vista o datos necesarios (opcional)
        return Inertia::render('Loans/Create');
    }

    public function store(Request $request)
{
    $request->validate([
        'student_id' => 'required|exists:students,id',
        'manager_id' => 'required|exists:users,id',
        'accessories' => 'nullable|string',
        'subject' => 'required|string|max:255',  // Validar subject
        'return_date' => 'nullable|date',
        'materials' => 'required|array|min:1',
        'materials.*.id' => 'required|exists:materials,id',  // ahora materials es array de objetos con id y accesorios
        'materials.*.accessories' => 'nullable|string',
    ]);

    DB::transaction(function () use ($request) {
        // Crear préstamo con subject y status 'Active'
        $loan = Loan::create([
            'student_id' => $request->student_id,
            'manager_id' => $request->manager_id,
            'accessories' => $request->accessories,
            'subject' => $request->subject,
            'status' => 'Active',
            'loan_date' => now(),
            'return_date' => $request->expected_return_date,
        ]);

        // Insertar detalles del préstamo con posibles accesorios (si quieres almacenarlos en otra tabla, se puede adaptar)
        foreach ($request->materials as $material) {
            $loan->loanDetails()->create([
                'material_id' => $material['id'],
                // Si quieres guardar accesorios específicos por material en loan_details, agrega el campo aquí (debes modificar la tabla y modelo para soportarlo)
                'accessories' => $material['accessories'] ?? null,
            ]);
        }
    });

    return redirect()->back()->with('success', 'Préstamo registrado correctamente.');
}

}
