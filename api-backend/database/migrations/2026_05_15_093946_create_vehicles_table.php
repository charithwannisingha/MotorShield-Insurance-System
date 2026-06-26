<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->integer('customerId')->nullable(); // React ID එකට ගැලපෙන්න Integer කළා
            $table->string('registrationNumber')->nullable();
            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->string('year')->nullable();
            $table->string('chassisNumber')->nullable();
            $table->string('engineNumber')->nullable();
            $table->string('color')->nullable();        // අලුතින් එකතු කළා
            $table->string('fuelType')->nullable();     // අලුතින් එකතු කළා
            $table->string('vehicleType')->nullable();  // අලුතින් එකතු කළා
            $table->string('engineCapacity')->nullable(); // අලුතින් එකතු කළා
            $table->string('seatingCapacity')->nullable(); // අලුතින් එකතු කළා (මිල/වටිනාකම)
            $table->boolean('isActive')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};