<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->integer('userId')->nullable(); // කාටද මැසේජ් එක යන්නේ
            $table->string('title')->nullable();
            $table->text('message')->nullable();
            $table->string('type')->default('info'); // info, success, warning, danger
            $table->boolean('read')->default(false); // කියවලාද නැද්ද කියලා
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};