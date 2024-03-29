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
        Schema::create('ads', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 255);
            $table->unsignedBigInteger('user_id');
            $table->enum('status', ['unpaid', 'active', 'inactive', 'expired'])->default('unpaid');
            $table->date('ad_start_date')->nullable();
            $table->date('ad_end_date')->nullable();
            $table->string('file_name', 255)->nullable();
            $table->enum('file_type', ['img', 'video'])->nullable();
            $table->string('url', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};
