<?php

namespace App\Models;

use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;

class Student extends Authenticatable implements CanResetPassword
{
    use Notifiable, CanResetPasswordTrait;

    protected $fillable = [
        'student_id', 'name', 'first_surname', 'second_surname',
        'major', 'group_name', 'email', 'phone', 'password', 'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function requests()
    {
        return $this->hasMany(Request::class);
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }
}
