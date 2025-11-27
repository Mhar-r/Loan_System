<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\LoanDetail;
use App\Models\MaterialType;




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
        'manager_id' => 'nullable|exists:users,id',
        'laboratory_id' => 'required|exists:laboratories,id',
        'accessories' => 'nullable|string',
        'subject' => 'required|string|max:255',
        'return_date' => 'nullable|date',
        'materials' => 'required|array|min:1',
        'materials.*.id' => 'required|exists:materials,id',
        'materials.*.accessories' => 'nullable|string',
        'request_id' => 'nullable|exists:requests,id',
    ]);

    try {
        DB::transaction(function () use ($request) {
            // Crear préstamo
            $loan = Loan::create([
                'student_id' => $request->student_id,
                'manager_id' => $request->manager_id ?? null,
                'laboratory_id' => $request->laboratory_id,
                'accessories' => $request->accessories,
                'subject' => $request->subject,
                'status' => 'Active',
                'loan_date' => now(),
                'request_id' => $request->request_id ?? null,
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
public function returnLoan(Request $request, $loan_id)
{
    $request->validate([
        'materials' => 'required|array|min:1',
        'materials.*.item_condition' => 'required|string|max:255',
    ]);

    $loan = Loan::with('loanDetails.material')->findOrFail($loan_id);

    DB::transaction(function () use ($loan, $request) {
        foreach ($request->materials as $detailInput) {
            $detail = $loan->loanDetails()->findOrFail($detailInput['id']);
            $detail->update([
                'status' => 'returned',
                'return_condition' => $detailInput['item_condition'],
                'returned_at' => now(),
            ]);
            $detail->material->update(['status' => 'Available']);
        }

        $loan->update(['status' => 'Returned', 'return_date' => now()]);
    });

    return response()->json(['success' => true, 'message' => 'Préstamo devuelto correctamente.']);
}






public function getActiveLoans(Request $request)
{
    $query = Loan::with(['loanDetails.material.type', 'student'])
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

/// 🔹 Función para historial de préstamos con paginación
public function historyAdmin(Request $request)
{
    $query = Loan::with([
        'student',
        'laboratory',
        'manager',  
        'loanDetails.material.type'
    ]);

    // Filtro por laboratorio
    if ($request->filled('laboratory_id')) {
        $query->where('laboratory_id', $request->laboratory_id);
    }

    // Filtro por tipo de material
    if ($request->filled('material_type_id')) {
        $query->whereHas('loanDetails.material', function ($q) use ($request) {
            $q->where('material_type_id', $request->material_type_id);
        });
    }

    // Paginación (10 elementos por página)
    $loans = $query
        ->orderBy('loan_date', 'desc')
        ->paginate(10) // samos paginate()
        ->withQueryString(); //  Mantiene filtros al cambiar de página

    return Inertia::render('Loans/History', [
        'loans' => $loans,
        'labs' => \App\Models\Laboratory::all(),
        'types' => MaterialType::query()
            ->select('material_types.id', 'material_types.name')
            ->join('materials', 'materials.material_type_id', '=', 'material_types.id')
            ->when($request->filled('laboratory_id'), function ($query) use ($request) {
                $query->where('materials.laboratory_id', $request->laboratory_id);
            })
            ->distinct()
            ->orderBy('material_types.name', 'asc')
            ->get(),

        'filters' => $request->only(['laboratory_id', 'material_type_id']),
    ]);
}

public function historyStudent(Request $request)
{
    $user = auth()->user();

    // Traer solo préstamos hechos POR este usuario
    $query = Loan::with([
        'student',
        'laboratory',
        'loanDetails.material.type',
        'manager'
    ])->where('manager_id', $user->id);  // ← AQUÍ CAMBIÓ TODO

    // Filtro por laboratorio
    if ($request->filled('laboratory_id')) {
        $query->where('laboratory_id', $request->laboratory_id);
    }

    // Filtro por tipo de material
    if ($request->filled('material_type_id')) {
        $query->whereHas('loanDetails.material', function ($q) use ($request) {
            $q->where('material_type_id', $request->material_type_id);
        });
    }

    $loans = $query
        ->orderBy('loan_date', 'desc')
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('Loans/MyHistory', [
        'loans' => $loans,
        'labs' => \App\Models\Laboratory::all(),
        'types' => MaterialType::query()
            ->select('material_types.id', 'material_types.name')
            ->join('materials', 'materials.material_type_id', '=', 'material_types.id')
            ->when($request->filled('laboratory_id'), function ($query) use ($request) {
                $query->where('materials.laboratory_id', $request->laboratory_id);
            })
            ->distinct()
            ->orderBy('material_types.name', 'asc')
            ->get(),


        'filters' => $request->only(['laboratory_id', 'material_type_id']),
    ]);
}



}







