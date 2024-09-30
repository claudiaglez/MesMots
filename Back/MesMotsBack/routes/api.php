<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuoteController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/quotes', [QuoteController::class, 'store']);
Route::get('/quotes', [QuoteController::class, 'index']);
Route::get('/quotes/{id}', [QuoteController::class, 'show']);
Route::put('/quotes/{id}', [QuoteController::class, 'update']);
Route::delete('/quotes/{id}', [QuoteController::class, 'destroy']);

Route::get('/test-db', function () {
    dd(env('MONGODB_URI'));
});

