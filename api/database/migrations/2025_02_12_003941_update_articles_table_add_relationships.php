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
        Schema::table('articles', function (Blueprint $table) {
            // Add nullable foreign keys after the primary key (adjust the column order as needed)
            $table->unsignedBigInteger('source_id')->nullable()->after('id');
            $table->unsignedBigInteger('category_id')->nullable()->after('source_id');
            $table->unsignedBigInteger('author_id')->nullable()->after('category_id');

            // Define the foreign key constraints
            $table->foreign('source_id')->references('id')->on('sources')->onDelete('set null');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('author_id')->references('id')->on('authors')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['source_id']);
            $table->dropForeign(['category_id']);
            $table->dropForeign(['author_id']);

            $table->dropColumn(['source_id', 'category_id', 'author_id']);
        });
    }
};
