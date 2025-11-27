<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestMaterial extends Model
{
    use HasFactory;

    protected $fillable = ['request_id', 'material_type_id', 'accessories'];

    public function request()
{
    return $this->belongsTo(\App\Models\MaterialRequest::class, 'request_id');
}


    public function materialType()
    {
        return $this->belongsTo(MaterialType::class); // relación con el tipo de material
    }
}

