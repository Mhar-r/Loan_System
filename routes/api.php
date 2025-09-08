<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\MaterialTypeController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RequestController;




/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



Route::get('/roles', [RoleController::class, 'index']);


Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

Route::get('/labs', [LaboratoryController::class, 'index']);
Route::get('/students/search/{matricula}', [StudentController::class, 'searchByMatricula']);
Route::get('/materials/by-lab/{lab_id}', [MaterialController::class, 'getByLab']);
Route::get('/laboratories/{id}/materials', [MaterialController::class, 'getByLaboratory']);

Route::get('/material-types/by-lab/{lab_id}', [MaterialTypeController::class, 'getByLab']);
Route::get('/materials/search-by-type', [MaterialController::class, 'searchByType']);

//Devolucion de prestamos
Route::get('/loans', [LoanController::class, 'index']);
Route::post('/loans/return/{detail_id}', [LoanController::class, 'returnDetail']);


Route::get('/loans/active', [LoanController::class, 'getActiveLoans']);


//Solicitudes Alumnos
Route::get('/requests', [RequestController::class, 'index']); // listar solicitudes
Route::post('/requests', [RequestController::class, 'store']); // crear solicitud
Route::get('/requests/{id}', [RequestController::class, 'show']); // ver solicitud
Route::put('/requests/{id}', [RequestController::class, 'update']); // actualizar solicitud
Route::delete('/requests/{id}', [RequestController::class, 'destroy']); // eliminar solicitud

//Aporbar solicitudes
Route::put('/requests/{id}/approve', [RequestController::class, 'approve']);
Route::put('/requests/{id}/reject', [RequestController::class, 'reject']);



// Listar solicitudes pendientes (opcional filtro por lab o tipo material)
Route::get('/requests/pending', [RequestController::class, 'pending']);

// Aprobar solicitud y crear préstamo
Route::post('/requests/{id}/approve', [RequestController::class, 'approve']);

// Listar laboratorios
Route::get('/labs', [LaboratoryController::class, 'index']);

// Listar materiales de un laboratorio específico
Route::get('/materials/by-lab/{lab_id}', [MaterialController::class, 'getByLab']);


Route::get('/requests/pending', [RequestController::class, 'pendingRequests']);
Route::post('/requests/{id}/approve', [RequestController::class, 'approve']);
Route::post('/requests', [RequestController::class, 'store']);