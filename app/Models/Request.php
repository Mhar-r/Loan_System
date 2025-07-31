<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $fillable = [
        'student_id', 'material_type_id', 'accessories', 'status', 'request_date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function materialType()
    {
        return $this->belongsTo(MaterialType::class);
    }
}
