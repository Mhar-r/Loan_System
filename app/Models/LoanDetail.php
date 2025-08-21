<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanDetail extends Model
{
    protected $fillable = ['loan_id', 'material_id', 'accessories'];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
