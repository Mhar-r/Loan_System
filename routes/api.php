<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\MaterialTypeController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\ManagerMaterialController;

use App\Http\Controllers\LoanController;

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


// Labs
Route::get('/labs', [LaboratoryController::class, 'index']);

// Material types
// Rutas API para MaterialType
Route::get('/material-types', [MaterialTypeController::class, 'list']);
    Route::post('/material-types', [MaterialTypeController::class, 'store']);
    //Route::put('/material-types/{id}', [MaterialTypeController::class, 'update']);
    //Route::delete('/material-types/{id}', [MaterialTypeController::class, 'destroy']);

    // Material types (para host sin PUT/DELETE) ➤ usamos POST
    Route::post('/material-types/update/{id}', [MaterialTypeController::class, 'update']);

    Route::post('/material-types/delete/{id}', [MaterialTypeController::class, 'destroy']);

//Route::get('/material-types', [MaterialTypeController::class, 'index']);
Route::get('/material-types/by-lab/{lab_id}', [MaterialTypeController::class, 'getByLab']);

//Filtro de Material Types (SIN DUPLICADOS)
Route::get('/material-types/filter', [MaterialTypeController::class, 'filtered']);





// Materials
Route::get('/materials', [ManagerMaterialController::class, 'index']);
Route::post('/materials', [ManagerMaterialController::class, 'store']);
//Route::put('/materials/{id}', [ManagerMaterialController::class, 'update']);
//Route::delete('/materials/{id}', [ManagerMaterialController::class, 'destroy']);
Route::post('/materials/update/{id}', [ManagerMaterialController::class, 'update']);
Route::post('/materials/delete/{id}', [ManagerMaterialController::class, 'destroy']);

Route::get('/materials/by-lab/{lab_id}', [MaterialController::class, 'getByLab']);
Route::get('/materials/search-by-type', [MaterialController::class, 'searchByType']);
Route::get('/laboratories/{id}/materials', [MaterialController::class, 'getByLaboratory']);

// Users
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
//Route::put('/users/{id}', [UserController::class, 'update']);
//Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::post('/users/update/{id}', [UserController::class, 'update']);
Route::post('/users/delete/{id}', [UserController::class, 'destroy']);



// Roles
Route::get('/roles', [RoleController::class, 'index']);

// Students
Route::get('/students/search/{matricula}', [StudentController::class, 'searchByMatricula']);

// Loans
Route::get('/loans', [LoanController::class, 'index']);
Route::get('/loans/active', [LoanController::class, 'getActiveLoans']);
Route::post('/loans/return/{loan_id}', [LoanController::class, 'returnLoan']);


// Requests (pendientes y aprobación)
Route::middleware('auth:sanctum')->group(function () {
Route::get('/requests/pending', [RequestController::class, 'pendingRequests']);
Route::post('/requests/{id}/approve', [RequestController::class, 'approve']);
Route::post('/requests/{id}/reject', [RequestController::class, 'reject']);
//Route::patch('/requests/{request}/cancel', [RequestController::class, 'cancel']);
});

// Requests
/*Route::get('/requests', [RequestController::class, 'index']);
//Route::post('/requests', [RequestController::class, 'store']);
Route::get('/requests/{id}', [RequestController::class, 'show']);
Route::put('/requests/{id}', [RequestController::class, 'update']);
Route::delete('/requests/{id}', [RequestController::class, 'destroy']);
*/
