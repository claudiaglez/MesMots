<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quote;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class QuoteController extends Controller
{
    public function show($id)
    {
        $quote = Quote::find($id);

        if (!$quote) {
            return response()->json(['message' => 'Quote not found'], 404);
        }
        return response()->json($quote, 200);
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


    public function getAuthors()
    {
        try {
            $authors = Quote::pluck('author')->unique()->filter()->values(); 
            Log::info('Authors retrieved:', $authors->toArray());
            return response()->json($authors);
        } catch (\Exception $e) {
            Log::error('Error retrieving authors: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function getTitles()
    {
        try {
            $titles = Quote::pluck('title')->unique()->filter()->values(); 
            Log::info('Titles retrieved:', $titles->toArray());
            return response()->json($titles);
        } catch (\Exception $e) {
            Log::error('Error retrieving titles: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
