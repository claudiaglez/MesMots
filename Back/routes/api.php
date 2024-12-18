<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuoteController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/quotes', [QuoteController::class, 'store'])->name('quote.store');
Route::get('/quotes', [QuoteController::class, 'index'])->name('quote.index');
Route::get('/quotes/{id}', [QuoteController::class, 'show'])->name('quote.show');
Route::put('/quotes/{id}', [QuoteController::class, 'update'])->name('quote.update');
Route::delete('/quotes/{id}', [QuoteController::class, 'destroy'])->name('quote.destroy');
Route::get('/authors', [QuoteController::class, 'getAuthors'])->name('quote.authors');
Route::get('/titles', [QuoteController::class, 'getTitles'])->name('quote.titles');


Route::get('/test-db', function () {
    dd(env('MONGODB_URI'));
});



