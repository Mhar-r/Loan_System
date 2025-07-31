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
    Schema::create('students', function (Blueprint $table) {
        $table->id();
        $table->string('student_id', 20)->unique();
        $table->string('name', 100);
        $table->string('first_surname', 50);
        $table->string('second_surname', 50);
        $table->enum('major', ['Systems', 'Electronics', 'Mechatronics', 'Industrial', 'Other']);
        $table->string('group_name', 20)->nullable();
        $table->string('email', 100)->unique();
        $table->string('phone', 15)->nullable();
        
        $table->timestamps();

    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
