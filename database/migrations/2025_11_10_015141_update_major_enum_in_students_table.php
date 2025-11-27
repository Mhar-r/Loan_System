<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modificar el enum 'major'
        DB::statement("ALTER TABLE students MODIFY COLUMN major ENUM('Software', 'Biomedica', 'Biotecnologia', 'RedesTeleco', 'Mecatronica', 'TIID', 'Other') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir a los valores anteriores
        DB::statement("ALTER TABLE students MODIFY COLUMN major ENUM('Systems', 'Electronics', 'Mechatronics', 'Industrial', 'Other') NOT NULL");
    }
};
