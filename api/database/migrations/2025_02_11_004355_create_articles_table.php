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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('source');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('url')->unique();
            $table->timestamp('published_at')->nullable();
            $table->text('content')->nullable();
            $table->string('category')->nullable();
            $table->string('data_source')->nullable(); // e.g., 'newsapi', 'guardian', or 'nytimes'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
