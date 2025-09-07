<?php

namespace App\Http\Controllers;
use App\Models\ManagerMaterial;
use Illuminate\Http\Request;

class ManagerMaterialController extends Controller
{
    //
    public function index()
    {
        return response()->json(ManagerMaterial::all(), 200);
    }

    // Crear un nuevo material
    public function store(Request $request)
    {
        $request->validate([
            'material_type_id' => 'required|integer',
            'brand' => 'required|string|max:100',
            'inventory_number' => 'required|string|max:50',
            'serial_number' => 'nullable|string|max:50',
            'condition' => 'required|in:Good,Fair,Poor',
            'status' => 'required|in:Available,Loaned,Under Repair',
            'laboratory_id' => 'required|integer',
        ]);

        $material = ManagerMaterial::create($request->all());
        return response()->json($material, 201);
    }

    // Obtener un material por ID
    public function show($id)
    {
        $material = ManagerMaterial::findOrFail($id);
        return response()->json($material, 200);
    }

    // Actualizar material
    public function update(Request $request, $id)
    {
        $material = ManagerMaterial::findOrFail($id);

        $request->validate([
            'material_type_id' => 'integer',
            'brand' => 'string|max:100',
            'inventory_number' => 'string|max:50',
            'serial_number' => 'nullable|string|max:50',
            'condition' => 'in:Good,Fair,Poor',
            'status' => 'in:Available,Loaned,Under Repair',
            'laboratory_id' => 'integer',
        ]);

        $material->update($request->all());
        return response()->json($material, 200);
    }

    // Eliminar material
    public function destroy($id)
    {
        $material = ManagerMaterial::findOrFail($id);
        $material->delete();

        return response()->json(['message' => 'Material eliminado'], 200);
    }
}
