<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ManagerDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\RegisterUsersController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentAuthController;
use App\Http\Controllers\StudentPanelController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\MaterialTypeController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\Auth\StudentPasswordResetLinkController;
use App\Http\Controllers\SecurityQuestionController;
use App\Http\Controllers\StudentPasswordController;
use App\Http\Controllers\UserSecurityQuestionController;



use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Menú principal
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    // Redirigir estudiantes logueados
    if (session()->has('student')) {
        return redirect()->route('students.dashboard');
    }

    // Redirigir admin/manager logueado (Laravel Breeze auth)
    if (auth()->check()) {
        $roleId = auth()->user()->role_id;
        if ($roleId === 1) return redirect()->route('admin.dashboard');
        if ($roleId === 2) return redirect()->route('manager.dashboard');
    }

    return Inertia::render('MainMenu/MainMenu');
})->middleware('no-cache');


/*
|--------------------------------------------------------------------------
| Recuperación de contraseña usando pregunta de seguridad para ESTUDIANTES
|--------------------------------------------------------------------------
*/

Route::middleware('web')->group(function () {

// Paso 1: formulario para escribir email y respuesta
Route::get('/student/forgot-password-security', 
    [SecurityQuestionController::class, 'forgotForm'])
    ->name('student.security-question.form');

// Paso 1: Validar email
Route::post('/student/forgot-password-security-check',
    [SecurityQuestionController::class, 'checkEmail'])
    ->name('student.security-question.check');


    // Paso 2: mostrar formulario para restablecer contraseña + nueva pregunta
Route::get('/student/reset-password-security/{student}',
    [SecurityQuestionController::class, 'resetForm'])
    ->name('student.security-question.resetForm');



// Paso 2: update final
Route::post('/student/reset-password-security/{student}',
    [SecurityQuestionController::class, 'resetPassword'])
    ->name('student.security-question.reset');

});
  /*
|--------------------------------------------------------------------------
| Recuperación de contraseña usando pregunta de seguridad para USERS
|--------------------------------------------------------------------------
*/  


// Crea Pregunta de seguridad para USERS
Route::middleware(['auth'])->group(function () {
    Route::get('/user/security-question', [UserSecurityQuestionController::class, 'index'])
        ->name('user.security-question');

    Route::post('/user/security-question/store', [UserSecurityQuestionController::class, 'store'])
        ->name('user.security-question.store');

// PASO 1: escribir email
Route::get('/forgot-password-security', [UserSecurityQuestionController::class, 'forgotForm'])
    ->name('user.security.step1');

// Validar email
Route::post('/forgot-password-security', [UserSecurityQuestionController::class, 'checkEmail'])
    ->name('user.security.check');

// PASO 2 y 3: mostrar pregunta y luego cambio de contraseña
Route::get('/forgot-password-security/{user}', [UserSecurityQuestionController::class, 'resetForm'])
    ->name('user.security.resetForm');


// Procesar pasos 2 y 3
Route::post('/forgot-password-security/{user}', [UserSecurityQuestionController::class, 'resetPassword'])
    ->name('user.security.reset');


});





/*
|--------------------------------------------------------------------------
| Login Admin (Laravel Breeze)
|--------------------------------------------------------------------------
*/
Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->middleware(['guest','redirect_if_authenticated', 'no-cache'])
    ->name('login');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified','no-cache'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Perfil de usuario (Laravel Breeze)
|--------------------------------------------------------------------------
*/
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
Route::middleware(['auth', 'role:1', 'no-cache', 'check.user.security'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
        ->name('admin.dashboard');

    Route::get('/students', [StudentController::class, 'index'])->name('students.index');

    Route::prefix('admin')->group(function () {
        // Gestión de usuarios
        Route::get('/users', [RegisterUsersController::class, 'create'])->name('admin.users.create');
        Route::post('/users', [RegisterUsersController::class, 'store'])->name('admin.users.store');

        // Gestión de préstamos
        Route::get('/loans', [LoanController::class, 'index'])->name('loans.index');
    });

});

/*
|--------------------------------------------------------------------------
| ENCARGADO (role_id = 2)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:2', 'no-cache', 'check.user.security'])->group(function () {
    Route::get('/manager/dashboard', [ManagerDashboardController::class, 'index'])
        ->name('manager.dashboard');
});

/*
|--------------------------------------------------------------------------
| FUNCIONALIDADES COMPARTIDAS ENTRE ADMINISTRADOR (1) Y ENCARGADO (2)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:1,2', 'no-cache'])->group(function () {

    // Tipos de materiales
    Route::get('/material-types', [MaterialTypeController::class, 'index'])
        ->name('material-type.index');

    // Registrar materiales
    Route::get('admin/materials/create', [MaterialController::class, 'create'])->name('material.create');
    Route::post('admin/materials', [MaterialController::class, 'store'])->name('material.store');

    // Registrar préstamos
    Route::get('/loans/create', [LoanController::class, 'create'])->name('loans.create');
    Route::post('/loans', [LoanController::class, 'store'])->name('loans.store');

    // Devolución de préstamos
    Route::get('/loans/return-materials', function () {
        return Inertia::render('Loans/ReturnMaterials');
    })->name('loans.return-materials');

    // Panel admin: solicitudes
    Route::get('request/adminrequest', function () {
        return Inertia::render('Request/AdminRequest');
    })->name('admin.requests');

    // Historial de préstamos
    Route::get('/loans/history', [LoanController::class, 'historyAdmin'])
        ->name('admin.loans.history');


    Route::get('/loans/my-history', [LoanController::class, 'historyStudent'])
    ->name('loans.myHistory');

    
});

Route::middleware(['auth', 'no-cache'])->group(function () {
    Route::post('/requests/{id}/cancel', [RequestController::class, 'cancel'])->name('requests.cancel');
});




/*
|--------------------------------------------------------------------------
| ESTUDIANTES
|--------------------------------------------------------------------------
*/
Route::get('/register-student', [StudentController::class, 'create'])->name('students.create');
Route::post('/register-student', [StudentController::class, 'store'])->name('students.store');

/*
|--------------------------------------------------------------------------
| Rutas de manager material protegidas
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/admin/managermaterial', function () {
        return Inertia::render('Admin/ManagerMaterial');
    })->name('manager-material.index');
});

/*
|--------------------------------------------------------------------------
| Login y panel de estudiantes
|--------------------------------------------------------------------------
*/



Route::get('/login/student', [StudentAuthController::class, 'showLoginForm'])
    ->middleware(['guest', 'no-cache'])
    ->name('student.login');

Route::post('/login/student', [StudentAuthController::class, 'login'])->name('student.login.submit');
Route::post('/logout/student', [StudentAuthController::class, 'logout'])->name('student.logout');

Route::middleware('student.auth', 'no-cache','check.student.security')->group(function () {
    Route::get('/students/dashboard', [StudentAuthController::class, 'panel'])
        ->name('students.dashboard');
});

Route::middleware('student.auth', 'web')->group(function () {
    Route::post('requests', [RequestController::class, 'store'])->name('student.requests.store');
    Route::get('requests/pending', [RequestController::class, 'pendingRequests']);
    Route::get('requests/{id}', [RequestController::class, 'show']);

    Route::get('/solicitudes', function () { return Inertia::render('Students/Requests'); })->name('solicitudes.index');;

});



Route::middleware(['auth', 'no-cache'])->group(function () {
    Route::get('/student/requests', [RequestController::class, 'studentRequests'])->name('student.requests');
    Route::get('/students/requests/create', [RequestController::class, 'create'])
->name('student.requests.create');
});

Route::middleware('student.auth')->group(function () {

    /*Route::get('/ForgotPassword/security-question/create', function () {
        return inertia('ForgotPassword/SecurityQuestionForm');
    })->name('student.security-question.create');

    */
    
    Route::post('/security-question/store', [SecurityQuestionController::class, 'store'])
        ->name('student.security-question.store');

    Route::get('/student/change-password', [StudentPasswordController::class, 'edit'])
    ->name('student.password.edit');

    Route::post('/student/change-password', [StudentPasswordController::class, 'update'])
    ->name('student.password.update');

    Route::get('/security-question/create', [SecurityQuestionController::class, 'create'])
    ->name('student.security-question.create');


});




/*
|--------------------------------------------------------------------------
| Breeze auth
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';
