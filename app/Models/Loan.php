<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'student_id', 'manager_id', 'accessories', 'subject',
        'status', 'loan_date',  'return_date'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function loanDetails()
    {
        return $this->hasMany(LoanDetail::class);
    }
}
