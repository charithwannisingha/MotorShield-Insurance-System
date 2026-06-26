<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('policies', function (Blueprint $table) {
            $table->id();
            $table->integer('customerId')->nullable(); // අයිතිකාරයාගේ ID එක
            $table->integer('vehicleId')->nullable();  // වාහනේ ID එක
            $table->string('policyNumber')->nullable();
            $table->string('coverageType')->nullable(); // Third Party ද, Full Insurance ද කියලා
            $table->string('premiumAmount')->nullable(); // ගාන
            $table->string('startDate')->nullable();
            $table->string('endDate')->nullable(); // කල් ඉකුත් වෙන දවස
            $table->string('status')->default('active'); // active ද expired ද කියලා
            $table->string('renewedAt')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('policies');
    }
};