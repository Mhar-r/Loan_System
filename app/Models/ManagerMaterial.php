<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManagerMaterial extends Model
{
    use HasFactory;

    protected $table = 'materials'; // usa tu tabla real

    protected $fillable = [
        'material_type_id',
        'brand',
        'inventory_number',
        'serial_number',
        'condition',
        'status',
        'laboratory_id'
    ];
}
