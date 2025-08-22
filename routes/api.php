<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\MaterialTypeController;
use App\Http\Controllers\LoanController;



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