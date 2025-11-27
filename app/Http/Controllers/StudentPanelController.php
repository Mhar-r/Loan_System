<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class StudentPanelController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Students/Dashboard', [
        'student' => Session::get('student'),
    ]);

    }
}

