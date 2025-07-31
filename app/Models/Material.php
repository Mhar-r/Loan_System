<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'material_type_id', 'brand', 'inventory_number',
        'serial_number', 'condition', 'status', 'laboratory_id'
    ];

    public function type()
    {
        return $this->belongsTo(MaterialType::class, 'material_type_id');
    }

    public function laboratory()
    {
        return $this->belongsTo(Laboratory::class);
    }

    public function loanDetails()
    {
        return $this->hasMany(LoanDetail::class);
    }
}
