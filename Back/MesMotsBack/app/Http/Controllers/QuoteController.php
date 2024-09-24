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

    public function index(Request $request)
    {
        $author = $request->query('author');
        $title = $request->query('title');
    
        if ($author && $title) {
            $quotes = $this->quoteModel->filterByAuthorAndTitle($author, $title);
        } elseif ($author) {
            $quotes = $this->quoteModel->filterByAuthor($author);
        } elseif ($title) {
            $quotes = $this->quoteModel->filterByTitle($title);
        } else {
            $quotes = $this->quoteModel->getAllQuotes();
        }
    
        return response()->json($quotes);
    }
    

    public function show($id)
{
    $quote = $this->quoteModel->findQuoteById($id); 
    
    if ($quote) {
        return response()->json($quote);
    }
    
    return response()->json(['error' => 'Cita no encontrada'], 404);
}

public function update(Request $request, $id)
{
    // Validar los datos de entrada
    $validatedData = $request->validate([
        'author' => 'sometimes|required|string|max:255',
        'title' => 'sometimes|required|string|max:255',
        'phrase' => 'sometimes|required|string',
        'date' => 'sometimes|required|date',
    ]);

    try {
        
        $collection = (new Client(env('MONGODB_URI')))->mesMots->quotes;

        
        $result = $collection->updateOne(
            ['id' => $id], 
            ['$set' => array_filter($validatedData)] 
        );

        if ($result->getModifiedCount() === 0) {
            return response()->json(['error' => 'Cita no encontrada o no se realizaron cambios'], 404);
        }

        return response()->json(['message' => 'Cita actualizada correctamente'], 200);
    } catch (\Exception $e) {
        Log::error('Error al actualizar en MongoDB: ' . $e->getMessage());
        return response()->json(['error' => 'Error al actualizar en MongoDB'], 500);
    }
}

public function destroy($id)
{
    try {
        $collection = (new Client(env('MONGODB_URI')))->mesMots->quotes;

        // Intentar eliminar la cita por su ID
        $result = $collection->deleteOne(['id' => $id]);

        if ($result->getDeletedCount() === 0) {
            return response()->json(['error' => 'Cita no encontrada'], 404);
        }

        return response()->json(['message' => 'Cita eliminada correctamente'], 200);
    } catch (\Throwable $e) {
        Log::error('Error al eliminar la cita: ' . $e->getMessage());
        return response()->json(['error' => 'Error al eliminar la cita'], 500);
    } catch (\Exception $e) {
        Log::error('Error inesperado: ' . $e->getMessage());
        return response()->json(['error' => 'Error inesperado'], 500);
    }
}




}
