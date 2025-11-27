<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $fillable = [
        'student_id',  'accessories', 'status', 'laboratory_id', 'subject'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function materialType()
    {
        return $this->belongsTo(MaterialType::class, 'material_type_id');
    }

    public function laboratory()
    {
        return $this->belongsTo(Laboratory::class);
    }

    public function materials()
{
    return $this->hasMany(\App\Models\RequestMaterial::class, 'request_id');
}


    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

}
