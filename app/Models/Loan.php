<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'student_id', 'manager_id', 'accessories',
        'status', 'loan_date', 'expected_return_date', 'actual_return_date'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function details()
    {
        return $this->hasMany(LoanDetail::class);
    }
}
