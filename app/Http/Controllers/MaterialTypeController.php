<?php

namespace App\Http\Controllers;

use App\Models\MaterialType; // ✅ Importar el modelo
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaterialTypeController extends Controller
{
public function index()
{
    return response()->json(\App\Models\MaterialType::all());
}


    public function create(): Response
    {
        return Inertia::render('Admin/MaterialType'); // ✅ Respeta mayúsculas según tu carpeta
    }





    public function getByLab($lab_id)
    {
        // Relaciona los tipos de material con laboratorio según tu modelo
        $types = MaterialType::where('laboratory_id', $lab_id)->get();
        return response()->json($types);
    }
}
