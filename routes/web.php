<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ManagerDashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\RegisterUsersController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentAuthController;

use App\Http\Controllers\StudentPanelController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\MaterialTypeController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\LoanController;

// Menú principal
Route::get('/', function () {
    return Inertia::render('MainMenu/MainMenu');
});

// Login Admin (Laravel Breeze por defecto)
Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->middleware(['guest', NoCache::class])
    ->name('login');
// Dashboard genérico (Laravel Breeze por defecto)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Perfil de usuario (Laravel Breeze)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| ADMINISTRADOR (role_id = 1)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:1', 'no-cache'])->group(function () {
    // Dashboard de Administrador
    Route::get('/admin/dashboard',  [AdminDashboardController::class, 'index'])
        ->name('admin.dashboard');

    // Gestión de Usuarios
    Route::prefix('admin')->group(function () {
        Route::get('/users', [RegisterUsersController::class, 'create'])->name('admin.users.create');
        Route::post('/users', [RegisterUsersController::class, 'store'])->name('admin.users.store');

        
        
        // Gestión de Préstamos
        Route::get('/loans', [LoanController::class, 'index'])->name('loans.index');
    });
});

/*
|--------------------------------------------------------------------------
| ENCARGADO (role_id = 2)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:2', 'no-cache'])->group(function () {
    // Dashboard de Encargado
    Route::get('/manager/dashboard', [ManagerDashboardController::class, 'index'])
        ->name('manager.dashboard');

    
});

/*
|--------------------------------------------------------------------------
| FUNCIONALIDADES COMPARTIDAS ENTRE ADMINISTRADOR (1) Y ENCARGADO (2)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:1,2'])->group(function () {
    // Insertar Tipos de materiales (generadores, fuentes)
    Route::get('/materials/creatematerialtype', [MaterialTypeController::class, 'create'])->name('materialtype.create');
    Route::post('/materials/creatematerialtype', [MaterialTypeController::class, 'store'])->name('materialtype.store');

    // Registrar Materiales
    Route::get('admin/materials/create', [MaterialController::class, 'create'])->name('material.create');
    Route::post('admin/materials', [MaterialController::class, 'store'])->name('material.store');

    // Registrar Préstamos
    Route::get('/loans/create', [LoanController::class, 'create'])->name('loans.create');
    Route::post('/loans', [LoanController::class, 'store'])->name('loans.store');

    // Devolución de Préstamos
    Route::get('/loans/return-materials', function () {
        return Inertia::render('Loans/ReturnMaterials');
    })->name('loans.return-materials');


    // Panel de admin: página principal de solicitudes
    Route::get('request/adminrequest', function () {
        return Inertia::render('Request/AdminRequest'); // componente React
    })->name('admin.requests');
});




/*
|--------------------------------------------------------------------------
| ESTUDIANTES
|--------------------------------------------------------------------------
*/
Route::get('/register-student', [StudentController::class, 'create'])->name('students.create');
Route::post('/register-student', [StudentController::class, 'store'])->name('students.store');



// Login Estudiante
Route::get('/login/student', [StudentAuthController::class, 'showLoginForm'])
    ->middleware('guest', 'no-cache') // middleware que acabamos de crear
    ->name('student.login');
Route::post('/login/student', [StudentAuthController::class, 'login'])->name('student.login.submit');
Route::post('/logout/student', [StudentAuthController::class, 'logout'])->name('student.logout');

Route::middleware('student.auth')->group(function () {
    Route::get('/students/dashboard', [StudentAuthController::class, 'panel'])
        ->name('students.dashboard');
});

// Breeze auth
require __DIR__ . '/auth.php';
