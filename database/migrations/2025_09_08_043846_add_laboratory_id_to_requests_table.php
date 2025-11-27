<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->unsignedBigInteger('laboratory_id')->after('student_id');
            $table->foreign('laboratory_id')
                ->references('id')
                ->on('laboratories')
                ->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    
    public function down()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->dropForeign(['laboratory_id']);
            $table->dropColumn('laboratory_id');
        });
    }

};
