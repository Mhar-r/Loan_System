<?php

namespace App\Http\Controllers;

use App\Models\Laboratory;
use App\Models\MaterialType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaterialTypeController extends Controller
{
    // Vista principal (Inertia)
    public function index(): Response
    {
        $materialTypes = MaterialType::with('laboratory')->get();
        $laboratories = Laboratory::all();

        return Inertia::render('MaterialType/ManagerMaterialType', [
            'materialTypes' => $materialTypes,
            'laboratories' => $laboratories,
        ]);
    }

    // API: Listar tipos (para refrescar datos si se quiere)
    public function list()
    {
        $types = MaterialType::with('laboratory')->get();
        return response()->json($types);
    }

    // Crear tipo
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|max:255',
            'laboratory_id' => 'required|exists:laboratories,id',
        ]);

        $type = MaterialType::create($request->only('name', 'laboratory_id'));

        return response()->json([
            'materialType' => $type->load('laboratory')
        ], 201);
    }

    // Actualizar tipo
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|max:255',
            'laboratory_id' => 'required|exists:laboratories,id',
        ]);

        $type = MaterialType::findOrFail($id);
        $type->update($request->only('name', 'laboratory_id'));

        return response()->json([
            'materialType' => $type->load('laboratory')
        ]);
    }

    // Eliminar tipo
    public function destroy($id)
    {
        $type = MaterialType::findOrFail($id);
        $type->delete();

        return response()->json(['message' => 'Tipo eliminado correctamente']);
    }


    public function getByLab($lab_id)
    {
        // Relaciona los tipos de material con laboratorio según tu modelo
        $types = MaterialType::where('laboratory_id', $lab_id)->get();
        return response()->json($types);
    }

    public function filtered(Request $request)
    {
        $labId = $request->lab_id;
        $typeId = $request->type_id;

        // Caso 1: ambos filtros
        if ($labId && $typeId) {
            return MaterialType::where('id', $typeId)
                ->whereHas('materials', function ($q) use ($labId) {
                    $q->where('laboratory_id', $labId);
                })
                ->distinct()
                ->get();
        }

        // Caso 2: solo laboratorio
        if ($labId) {
            return MaterialType::whereHas('materials', function ($q) use ($labId) {
                $q->where('laboratory_id', $labId);
            })
            ->distinct()
            ->get();
        }

        // Caso 3: solo tipo
        if ($typeId) {
            return MaterialType::where('id', $typeId)->get();
        }

        // Caso 4: nada seleccionado
        return MaterialType::distinct()->get();
    }

}
