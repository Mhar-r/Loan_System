<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'question',
        'answer',
    ];

    protected $hidden = ['answer'];
}
