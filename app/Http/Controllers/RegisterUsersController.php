<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisterUsersController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Users');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'first_surname'    => 'required|string|max:255',
            'second_surname'   => 'required|string|max:255',
            'email'            => 'required|string|email|unique:users',
            'phone'            => 'nullable|string|max:20',
            'password'         => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id'          => 'required|exists:roles,id'
        ]);

        $user = User::create([
            'name'       => $request->name,
            'first_surname'    => $request->first_surname,
            'second_surname'   => $request->second_surname,
            'email'            => $request->email,
            'phone'            => $request->phone,
            'password'         => Hash::make($request->password),
            'role_id'          => $request->role_id,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}
