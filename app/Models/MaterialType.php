<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialType extends Model
{
    protected $fillable = ['name','laboratory_id'];

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function requests()
    {
        return $this->hasMany(Request::class);
    }

    public function laboratory()
    {
        return $this->belongsTo(Laboratory::class);
    }
}
