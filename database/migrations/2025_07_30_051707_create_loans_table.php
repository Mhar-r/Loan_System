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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students');
            $table->foreignId('manager_id')->constrained('users');
            $table->foreignId('laboratory_id')->nullable()->constrained('laboratories');
            $table->text('accessories')->nullable();
            $table->enum('status', ['Active', 'Returned', 'Overdue'])->default('Active');
            $table->dateTime('loan_date')->useCurrent();
            $table->dateTime('return_date')->nullable();

            $table->string('subject', 100)->nullable();

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
