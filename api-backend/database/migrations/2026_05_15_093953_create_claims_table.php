<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            $table->string('claimNumber')->nullable();
            $table->integer('policyId')->nullable();
            $table->string('policyNumber')->nullable();
            $table->integer('customerId')->nullable();
            $table->string('customerName')->nullable();
            $table->integer('vehicleId')->nullable();
            $table->string('vehicleRegNo')->nullable();
            $table->string('vehicleMake')->nullable();
            $table->string('vehicleModel')->nullable();
            $table->string('claimType')->nullable();
            $table->string('incidentDate')->nullable();
            $table->string('incidentLocation')->nullable();
            $table->text('incidentDescription')->nullable();
            $table->double('estimatedDamage')->default(0);
            $table->double('approvedAmount')->nullable();
            $table->text('documents')->nullable(); 
            $table->string('status')->default('submitted');
            $table->text('reviewNotes')->nullable();
            $table->string('assignedTo')->nullable();
            $table->string('reviewedAt')->nullable();
            $table->string('settledAt')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};