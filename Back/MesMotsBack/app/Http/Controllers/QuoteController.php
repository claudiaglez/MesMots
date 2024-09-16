<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function index()
    {
        $quotes = Quote::all();
        return response()->json($quotes);
    }

    public function store(Request $request)
    {
        $quote = Quote::create($request->all());
        return response()->json($quote, 201);
    }

}

?>