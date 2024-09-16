<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function index()
    {
        // Prueba para ver si puedes insertar un documento
        $test = Test::create(['message' => 'Hello, MongoDB!']);
        return response()->json($test);
    }
}
