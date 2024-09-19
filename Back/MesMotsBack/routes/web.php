<?php

use Illuminate\Support\Facades\Route;
use MongoDB\Client;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-db', function () {
    try {
        $collection = (new Client(env('MONGODB_URI')))->selectCollection('mesMots', 'quotes');
        $cursor = $collection->find();
        return iterator_to_array($cursor); 
    } catch (\Exception $e) {
        return $e->getMessage();
    }
});

