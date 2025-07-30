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
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Campos para nombre dividido
            $table->string('first_name');             // Nombres
            $table->string('first_surname', 50);
            $table->string('second_surname', 50);     // Apellido materno

            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password');

            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

