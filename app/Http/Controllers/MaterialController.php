<?php

// app/Http/Controllers/MaterialController.php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\MaterialType;
use App\Models\Laboratory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function create()
    {
        $materialTypes = MaterialType::all();
        $laboratories = Laboratory::all();

        return Inertia::render('Materials/Create', [
            'materialTypes' => $materialTypes,
            'laboratories' => $laboratories,
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'material_type_id' => 'required|exists:material_types,id',
        'brand' => 'nullable|string|max:100',
        'inventory_number' => 'required|string|max:50|unique:materials',
        'serial_number' => 'required|string|max:50|unique:materials',
        'condition' => 'nullable|in:Good,Fair,Poor',
        'status' => 'required|in:Available,Loaned,Under Repair',
        'laboratory_id' => 'nullable|exists:laboratories,id',
    ]);

    Material::create($request->all());

    return redirect()->back()->with('success', 'Material registrado correctamente.');
}


public function getByLab($lab_id)
    {
        // Ajusta 'lab_id' si tu columna tiene otro nombre
        $materials = Material::where('laboratory_id', $lab_id)->get();

        return response()->json($materials);
    }

    public function getByLaboratory($laboratoryId)
{
    $materials = Material::with('materialType')
        ->where('laboratory_id', $laboratoryId)
        ->where('status', 'available') // si tienes un campo de estado
        ->get();

    return response()->json($materials);
}

public function searchByType(Request $request)
{
    try {
        $request->validate([
            'type_id' => 'required|exists:material_types,id',
            'lab_id' => 'required|exists:laboratories,id',
            'query' => 'nullable|string',
        ]);

        $queryText = $request->input('query'); // <-- aquí usamos input() y no query

        $materials = Material::where('material_type_id', $request->type_id)
                            ->where('laboratory_id', $request->lab_id)
                            ->where('status', 'Available')
                            ->when($queryText, function($q) use ($queryText) {
                                $q->where(function($q2) use ($queryText) {
                                    $q2->where('inventory_number', 'like', "%{$queryText}%")
                                       ->orWhere('serial_number', 'like', "%{$queryText}%");
                                });
                            })
                            ->get();

        return response()->json($materials);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
}






}
