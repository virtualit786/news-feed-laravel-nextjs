<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SourceController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\UserPreferenceController;
use App\Http\Controllers\JobTestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
|
*/

// Public Routes
Route::prefix('public')->group(function () {
    // Simple health-check or demo endpoint.
    Route::get('/hello', function () {
        return response()->json([
            'message' => 'Hello, world!',
            'status'  => 'success',
        ]);
    });

    // Test endpoint (if needed)
    Route::post('/test', function () {
        return response()->json(['message' => 'Test route works!']);
    });

    // Authentication Routes (Public)
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login',    [AuthController::class, 'login'])->name('auth.login');

    // Public lookup endpoints for categories, sources, and authors.
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/sources',    [SourceController::class, 'index'])->name('sources.index');
    Route::get('/authors',    [AuthorController::class, 'index'])->name('authors.index');
});

// Protected Routes (require authentication via Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // User Account Routes
    Route::get('/user',   [AuthController::class, 'user'])->name('auth.user');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');

    // Articles Endpoints
    Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/search', [ArticleController::class, 'search'])->name('articles.search');

    // User Preferences CRUD
    Route::prefix('preferences')->group(function () {
        Route::get('/',    [UserPreferenceController::class, 'index'])->name('preferences.index');
        Route::post('/',   [UserPreferenceController::class, 'store'])->name('preferences.store');
        Route::put('/',    [UserPreferenceController::class, 'update'])->name('preferences.update');
        Route::delete('/', [UserPreferenceController::class, 'destroy'])->name('preferences.destroy');
    });

    // Job Testing Route (for dispatching a sample job)
    Route::get('/newsapi', [JobTestController::class, 'dispatchNewsApiJob'])
        ->name('jobs.newsapi');
});
