<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->integer('customerId')->nullable();
            $table->integer('policyId')->nullable();
            $table->string('paymentNumber')->nullable();
            $table->string('amount')->nullable();
            $table->string('paymentMethod')->nullable(); // Card, Cash, Online
            $table->string('paymentDate')->nullable();
            $table->string('status')->default('paid'); // paid, pending, failed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};