<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            // Primero eliminamos la clave foránea si existe
            $table->dropForeign(['manager_id']);
            
            // Luego cambiamos la columna a nullable
            $table->unsignedBigInteger('manager_id')->nullable()->change();
            
            // Finalmente, agregamos la clave foránea correcta
            $table->foreign('manager_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            // Eliminamos la clave foránea
            $table->dropForeign(['manager_id']);
            
            // Volvemos a no nullable si se revierte
            $table->unsignedBigInteger('manager_id')->nullable(false)->change();
            
            // Restauramos la clave foránea original (si quieres)
            $table->foreign('manager_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
