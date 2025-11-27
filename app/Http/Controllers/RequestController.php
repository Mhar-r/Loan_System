<?php

namespace App\Http\Controllers;

use App\Models\Request as MaterialRequest;
use App\Models\MaterialType;
use App\Models\Laboratory;
use App\Models\Material;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;



class RequestController extends Controller

{


    public function create()
    {
        $student = session('student');

                if (!$student) {
                    abort(403, 'No hay estudiante logueado.');
                }

        return inertia('Students/Requests', [
            'student' => $student,
        ]);

    }




    public function show($id)
    {
        return MaterialRequest::with(['student', 'materialType', 'laboratory'])->findOrFail($id);
    }


    public function store(Request $request)
{
    $student = session('student');

    if (!$student) {
        return redirect()->route('student.login')
            ->withErrors(['auth' => 'Debes iniciar sesión primero.']);
    }

    $validated = $request->validate([
        'laboratory_id' => 'required|exists:laboratories,id',
        'subject' => 'required|string',
        'accessories' => 'nullable|string',
        'materials' => 'required|array|min:1',
        'materials.*.material_type_id' => 'required|exists:material_types,id',
        'materials.*.accessories' => 'nullable|string',
    ]);

    DB::transaction(function () use ($validated, $student) {

        $req = MaterialRequest::create([
            'student_id' => $student->id,
            'laboratory_id' => $validated['laboratory_id'],
            'subject' => $validated['subject'],
            'accessories' => $validated['accessories'] ?? null,
            'status' => 'Pending',
        ]);

        foreach ($validated['materials'] as $mat) {
            $req->materials()->create([
                'material_type_id' => $mat['material_type_id'],
                'accessories' => $mat['accessories'] ?? null,
            ]);
        }
    });

    return redirect()->back()->with('success', 'Solicitud creada');
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




    public function approve($id, Request $request)
{
    $requestData = MaterialRequest::with(['materials.materialType'])->findOrFail($id);

    if ($requestData->status !== 'Pending') {
        return response()->json(['success' => false, 'message' => 'La solicitud ya fue procesada.'], 400);
    }

    $validated = $request->validate([
        'materials' => 'required|array|min:1',
        'materials.*.material_id' => 'required|exists:materials,id',
        'materials.*.accessories' => 'nullable|string', // <--- accesorio individual
        'general_accessories' => 'nullable|string', // <--- accesorio general
        
    ]);

    DB::transaction(function () use ($requestData, $validated, $request, $id) {
        // Crear Loan principal

        $loanRequest = MaterialRequest::findOrFail($id);
        $loan = Loan::create([
            'student_id' => $requestData->student_id,
            'manager_id' => $request->manager_id, 
            'laboratory_id' => $requestData->laboratory_id,
            'accessories' => $validated['general_accessories'] ?? null,
            'subject' => $requestData->subject,
            'status' => 'Active',
            'loan_date' => now(),
            'request_id' => $requestData->id,
        ]);

        foreach ($validated['materials'] as $matInput) {
            $material = Material::where('id', $matInput['material_id'])
                                ->where('status', 'Available')
                                ->first();

            if (!$material) {
                throw new \Exception("El material seleccionado no está disponible.");
            }

            // Crear detalle del préstamo
            $loan->loanDetails()->create([
                'material_id' => $material->id,
                'accessories' => $matInput['accessories'] ?? null,
            ]);

            // Marcar material como prestado
            $material->update(['status' => 'Loaned']);
        }

        $requestData->update(['status' => 'Approved']);
    });

    return response()->json(['success' => true, 'message' => 'Solicitud aprobada y préstamo creado']);
}






public function cancel($id)
{
    $requestData = MaterialRequest::findOrFail($id);

    if ($requestData->status !== 'Pending') {
        return redirect()->back()->with('error', 'La solicitud ya fue procesada.');
    }

    $requestData->update([
        'status' => 'Rejected'
    ]);

    return redirect()->back()->with('success', 'Solicitud cancelada');
}




    public function pendingRequests(Request $request)
    {
        $query = MaterialRequest::with(['student', 'laboratory', 'materials.materialType'])

            ->where('status', 'Pending');

        if ($request->lab_id) {
            $query->where('laboratory_id', $request->lab_id);
        }

        if ($request->material_type_id) {
            $query->where('material_type_id', $request->material_type_id);
        }

        return $query->get();
    }


 //mostrar solicutes de alumnos
   
 public function studentRequests()
    {
        $student = session('student');

        if (!$student) {
            abort(403, 'No hay estudiante logueado.');
        }

        $requests = MaterialRequest::with(['laboratory', 'materials.materialType'])
            ->where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return inertia('Students/MyRequest', [
            'requests' => $requests,
            'student'  => $student,
        ]);
    }






}
