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


Route::get('/materials', [ManagerMaterialController::class, 'index']);
Route::post('/materials', [ManagerMaterialController::class, 'store']);
Route::put('/materials/{id}', [ManagerMaterialController::class, 'update']);
Route::delete('/materials/{id}', [ManagerMaterialController::class, 'destroy']);

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
Route::get('/material-types', [MaterialTypeController::class, 'index']);
