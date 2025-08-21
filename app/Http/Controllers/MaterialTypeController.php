<?php

namespace App\Http\Controllers;

use App\Models\Laboratory;
use App\Models\MaterialType; // ✅ Importar el modelo
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaterialTypeController extends Controller
{
    public function index()
{
    return response()->json(MaterialType::all());
}

    public function create(): Response
    {
        
        $laboratories = Laboratory::all();
    return Inertia::render('Materials/CreateMaterialType', [
        'laboratories' => $laboratories,
    ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'max:255',
                // Validación única dentro del laboratorio
                function ($attribute, $value, $fail) use ($request) {
                    $exists = MaterialType::where('name', $value)
                        ->where('laboratory_id', $request->laboratory_id)
                        ->exists();
                    if ($exists) {
                        $fail("El $attribute ya existe en este laboratorio.");
                    }
                },
            ],
            'laboratory_id' => 'required|exists:laboratories,id',
        ]);

        $materialType = MaterialType::create([
            'name' => $request->name,
            'laboratory_id' => $request->laboratory_id,
        ]);

        return redirect()->back()->with('success', '¡Material registrado exitosamente!');
    }


    public function getByLab($lab_id)
    {
        // Relaciona los tipos de material con laboratorio según tu modelo
        $types = MaterialType::where('laboratory_id', $lab_id)->get();
        return response()->json($types);
    }
}
