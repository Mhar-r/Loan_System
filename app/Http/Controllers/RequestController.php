<?php

namespace App\Http\Controllers;

use App\Models\Request as MaterialRequest;
use App\Models\MaterialType;
use App\Models\Laboratory;
use App\Models\Material;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RequestController extends Controller
{
    public function show($id)
{
    return MaterialRequest::with(['student', 'materialType', 'laboratory'])->findOrFail($id);
}


    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'laboratory_id' => 'required|exists:laboratories,id',
            'material_type_id' => 'required|exists:material_types,id',
            'accessories' => 'nullable|string',
        ]);

        $req = MaterialRequest::create([
            'student_id' => $validated['student_id'],
            'laboratory_id' => $validated['laboratory_id'],
            'material_type_id' => $validated['material_type_id'],
            'accessories' => $validated['accessories'] ?? null,
            'status' => 'Pending',
        ]);

        return response()->json(['success' => true, 'message' => 'Solicitud creada', 'request' => $req]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:Approved,Rejected',
        ]);

        $req = MaterialRequest::findOrFail($id);
        $req->status = $validated['status'];
        $req->save();

        return response()->json(['success' => true, 'message' => 'Solicitud actualizada', 'request' => $req]);
    }

    public function index()
    {
        return MaterialRequest::with(['student', 'materialType', 'laboratory'])->get();
    }

    public function approve(Request $request, $id)
    {
        $req = MaterialRequest::findOrFail($id);

        if ($req->status !== 'Pending') {
            return response()->json(['error' => 'La solicitud ya fue procesada.'], 400);
        }

        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'return_date' => 'required|date',
            'accessories' => 'nullable|string',
        ]);

        DB::transaction(function () use ($req, $validated) {
            $loan = Loan::create([
                'student_id' => $req->student_id,
                'manager_id' => auth()->id(),
                'accessories' => $validated['accessories'] ?? $req->accessories,
                'subject' => 'Préstamo generado desde solicitud',
                'status' => 'Active',
                'loan_date' => now(),
                'return_date' => $validated['return_date'],
            ]);

            $loan->loanDetails()->create([
                'material_id' => $validated['material_id'],
                'accessories' => $validated['accessories'] ?? $req->accessories,
            ]);

            Material::where('id', $validated['material_id'])
                ->update(['status' => 'Loaned']);

            $req->update(['status' => 'Approved']);
        });

        return response()->json(['success' => true, 'message' => 'Solicitud aprobada y préstamo creado']);
    }

    public function pendingRequests(Request $request)
{
    $query = MaterialRequest::with(['student', 'materialType.materials', 'laboratory'])
        ->where('status', 'Pending');

    if ($request->lab_id) {
        $query->where('laboratory_id', $request->lab_id);
    }

    if ($request->material_type_id) {
        $query->where('material_type_id', $request->material_type_id);
    }

    return $query->get();
}


}
