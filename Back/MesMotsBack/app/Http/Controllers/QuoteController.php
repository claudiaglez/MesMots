<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quote; 
use Carbon\Carbon;

class QuoteController extends Controller
{
    public function show($id)
    {
        $quote = Quote::find($id);
    
        if ($quote) {
            return view('quote', ['quote' => $quote]);
        }
    
        return response()->json(["message" => "Quote not found"], 404);
    }

    public function index()
{
    $quotes = Quote::all();

    $formattedQuotes = $quotes->map(function ($quote) {
        return [
            'id' => $quote->id,
            'phrase' => $quote->phrase,
            'author' => $quote->author,
            'title' => $quote->title,
            'date' => $quote->date ? Carbon::parse($quote->date)->toISOString() : null,
        ];
    });

    return response()->json($formattedQuotes);
}


    public function store(Request $request)
    {
        $request->validate([
            'author' => 'required|string',
            'title' => 'nullable|string',
            'phrase' => 'required|string',
        ]);
    
        $quote = new Quote;
        $quote->author = $request->author;
        $quote->title = $request->title;
        $quote->phrase = $request->phrase;
    
        $quote->date = now(); 
    
        $quote->save();
    
        return response()->json(["result" => "Quote created"], 201);
    }
    

public function update(Request $request, $id)
{
    $quote = Quote::find($id);

    if ($quote) {
        $quote->author = $request->author;
        $quote->title = $request->title;
        $quote->phrase = $request->phrase;
        $quote->save();

        return response()->json(["result" => "Quote updated"], 200);
    }

    return response()->json(["message" => "Quote not found"], 404);
}


public function destroy($id)
{
    $quote = Quote::find($id);

    if ($quote) {
        $quote->delete();

        return response()->json(["result" => "Quote deleted"], 200);
    }

    return response()->json(["message" => "Quote not found"], 404);
}

}

