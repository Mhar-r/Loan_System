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
        $table->string('first_name', 100);
        $table->string('first surname', 50);
        $table->string('second surname', 50);
        $table->string('middle_name', 50)->nullable();
        $table->enum('major', ['Systems', 'Electronics', 'Mechatronics', 'Industrial', 'Other']);
        $table->string('group_name', 20)->nullable();
        $table->string('email', 100)->unique();
        $table->string('phone', 15)->nullable();
        $table->timestamp('created_at')->useCurrent();
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
