<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ManagerDashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\RegisterUsersController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentPanelController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\MaterialTypeController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\LoanController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:1'])->group(function () {
    // Dashboard de Administrador (role_id = 1)
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
        ->name('admin.dashboard');

});

Route::middleware(['auth', 'role:1,2'])->group(function () {
    // Dashboard de Administrador (role_id = 1)
    //Registrar Materiales
    Route::get('admin/materials/create', [MaterialController::class, 'create'])->name('material.create');
    Route::post('admin/materials', [MaterialController::class, 'store'])->name('material.store');
    //Registrar Prestamos
    Route::get('/loans/create', [LoanController::class, 'create'])->name('loans.create');
    Route::post('/loans', [LoanController::class, 'store'])->name('loans.store');

    //Devolucion de Prestamos
    Route::get('/loans/return-materials', function () {
    return Inertia\Inertia::render('Loans/ReturnMaterials');
})->name('loans.return-materials');


});


Route::middleware(['auth', 'role:2'])->group(function () {
    // Dashboard de Encargado (role_id = 2)
    Route::get('/manager/dashboard', [ManagerDashboardController::class, 'index'])
        ->name('manager.dashboard');

    
});

// Para el administrador
Route::middleware(['auth', 'role:1'])->prefix('admin')->group(function () {
    // Gestión de Usuarios
    // Mostrar formulario de registro (lo que tú quieres en /admin/users)
    Route::get('/users', [RegisterUsersController::class, 'create'])->name('admin.users.create');

    // Registrar usuario
    Route::post('/users', [RegisterUsersController::class, 'store'])->name('admin.users.store');
    //Insertar Tipos de materiales(generadores, fuentes)
    Route::get('/materialtype', [MaterialTypeController::class, 'create'])->name('materialtype.create');
    Route::post('/materialtype', [MaterialTypeController::class, 'store'])->name('materialtype.store');
    

    // Reportes de Préstamos
    Route::get('/loan_reports', [LoanReportController::class, 'index'])->name('loan_reports.index');
    // Historial de Préstamos
    Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
    // Reporte de Inventario
    Route::get('/inventory_reports', [InventoryReportController::class, 'index'])->name('inventory_reports.index');
    // Gestión de Préstamos
    Route::get('/loans', [LoanController::class, 'index'])->name('loans.index');
});

// Para el encargado
Route::middleware(['auth', 'role:2'])->prefix('manager')->group(function () {
    Route::get('/inventory', [InventoryController::class, 'index'])->name('manager.inventory');
    Route::get('/sales', [SalesController::class, 'index'])->name('manager.sales');
    Route::get('/reports', [ReportController::class, 'index'])->name('manager.reports');
});

Route::get('/register-student', [StudentController::class, 'create'])->name('students.create');
Route::post('/register-student', [StudentController::class, 'store'])->name('students.store');

Route::get('/students/requests/create', [StudentRequestController::class, 'create'])->name('student.requests.create');

Route::get('/solicitudes', function () {
    return Inertia::render('Students/Requests');
})->name('solicitudes.index');;

Route::get('/estudiantes/panel', [StudentPanelController::class, 'index'])->name('student.panel');




require __DIR__.'/auth.php';
