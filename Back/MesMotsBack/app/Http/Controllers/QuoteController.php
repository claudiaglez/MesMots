<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Support\Facades\Log;
use MongoDB\Client;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;


class QuoteController extends Controller
{
    protected $quoteModel;

    public function __construct()
    {
        $this->quoteModel = new Quote();
    }

    public function store(Request $request)
    {

        $validatedData = $request->validate([
            'author' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'phrase' => 'required|string',
            'date' => 'required|date',
        ]);

        $newQuote = [
            'id' => (string) Str::uuid(),
            'author' => $validatedData['author'],
            'title' => $validatedData['title'],
            'date' => Carbon::parse($validatedData['date']),
            'phrase' => $validatedData['phrase'],
        ];

        try {

            $collection = (new Client(env('MONGODB_URI')))->mesMots->quotes;
            $result = $collection->insertOne($newQuote);

            return response()->json(['id' => $result->getInsertedId()], 201);
        } catch (\Throwable $e) {
            Log::error('Error al insertar en MongoDB: ' . $e->getMessage());
            return response()->json(['error' => 'Error al insertar en MongoDB'], 500);
        } catch (\Exception $e) {
            Log::error('Error inesperado: ' . $e->getMessage());
            return response()->json(['error' => 'Error inesperado'], 500);
        }
    }

    public function index()
    {
        $quotes = $this->quoteModel->getAllQuotes();
        return response()->json($quotes);
    }
}
