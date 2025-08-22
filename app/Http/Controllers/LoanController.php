<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\LoanDetail;


class LoanController extends Controller


{
    public function index()
    {
        // Retornar todos los préstamos activos con su detalle
         $loans = Loan::with(['loanDetails.material', 'student'])->get();
        return response()->json($loans);

    }


    public function create()
    {
        return Inertia::render('Loans/Create');
    }

    public function store(Request $request)
{
    $request->validate([
        'student_id' => 'required|exists:students,id',
        'manager_id' => 'required|exists:users,id',
        'laboratory_id' => 'required|exists:laboratories,id',
        'accessories' => 'nullable|string',
        'subject' => 'required|string|max:255',
        'return_date' => 'nullable|date',
        'materials' => 'required|array|min:1',
        'materials.*.id' => 'required|exists:materials,id',
        'materials.*.accessories' => 'nullable|string',
    ]);

    try {
        DB::transaction(function () use ($request) {
            // Crear préstamo
            $loan = Loan::create([
                'student_id' => $request->student_id,
                'manager_id' => $request->manager_id,
                'laboratory_id' => $request->laboratory_id,
                'accessories' => $request->accessories,
                'subject' => $request->subject,
                'status' => 'Active',
                'loan_date' => now(),
            ]);

            foreach ($request->materials as $materialData) {
                $material = Material::findOrFail($materialData['id']);

                // Validar disponibilidad
                if ($material->status !== 'Available') {
                    throw new \Exception("El material '{$material->brand} - {$material->inventory_number}' no está disponible para préstamo.");
                }

                // Crear detalle
                $loan->loanDetails()->create([
                    'material_id' => $material->id,
                    'accessories' => $materialData['accessories'] ?? null,
                ]);

                // Cambiar estado
                $material->update(['status' => 'Loaned']);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Préstamo registrado correctamente.'
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 400);
    }
}


    /**
 * Devolver un material específico de un préstamo (por detalle)
 */
public function returnDetail(Request $request, $detail_id)
{
    $request->validate([
        'item_condition' => 'required|string|max:255',
    ]);

    $detail = LoanDetail::with('material', 'loan')->findOrFail($detail_id);

    DB::transaction(function () use ($detail, $request) {
        // Guardar condición de devolución y cambiar status
        $detail->update([
            'status' => 'returned', // <-- cambia de on_loan a returned
            'return_condition' => $request->item_condition,
            'returned_at' => now(),
        ]);
        $detail->loan->update([
            'return_date' => now(),
        ]);

        // Cambiar material a disponible
        $detail->material->update(['status' => 'Available']);

        // Si todos los detalles del préstamo ya están devueltos → marcar préstamo como "Returned"
        $loan = $detail->loan;
        if ($loan->loanDetails()->where('status', 'on_loan')->count() === 0) {
            $loan->update(['status' => 'Returned']);
        }
    });

    return response()->json(['success' => true, 'message' => 'Material devuelto correctamente.']);
}





public function getActiveLoans(Request $request)
{
    $query = Loan::with(['loanDetails.material', 'student'])
        ->whereHas('loanDetails', function ($q) {
            $q->where('status', 'on_loan');
        });

    if ($request->lab_id) {
        $query->where('laboratory_id', $request->lab_id);
    }

    if ($request->matricula) {
        $query->whereHas('student', function ($q) use ($request) {
            $q->where('student_id', 'like', "%{$request->matricula}%");
        });
    }

    return response()->json($query->get());
}



}
