<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'student_id', 'name', 'first_surname', 'second_surname',
        'major', 'group_name', 'email', 'phone', 'role_id',
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
