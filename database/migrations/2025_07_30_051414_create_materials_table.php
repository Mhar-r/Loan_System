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
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_type_id')->constrained('material_types');
            $table->string('brand', 100)->nullable();
            $table->string('inventory_number', 50)->unique();
            $table->string('serial_number', 50)->unique();
            $table->enum('condition', ['Good', 'Fair', 'Poor'])->nullable();
            $table->enum('status', ['Available', 'Loaned', 'Under Repair'])->default('Available');
            $table->foreignId('laboratory_id')->nullable()->constrained('laboratories');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
