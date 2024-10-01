<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quote; 
use Carbon\Carbon;

class QuoteController extends Controller
{
    public function show($id)
    {
        // Usar el método find() directamente
        $quote = Quote::find($id);
    
        if ($quote) {
            return view('quote', ['quote' => $quote]);
        }
    
        return response()->json(["message" => "Quote not found"], 404);
    }

    public function index()
{
    $quotes = Quote::all();

    // Formatea las fechas solo si están presentes
    $formattedQuotes = $quotes->map(function ($quote) {
        return [
            'id' => $quote->id,
            'phrase' => $quote->phrase,
            'author' => $quote->author,
            'title' => $quote->title,
            // Solo formatea la fecha si está presente
            'date' => $quote->date ? Carbon::parse($quote->date)->toISOString() : null,
        ];
    });

    return response()->json($formattedQuotes);
}


    
    // Crear una nueva cita
    public function store(Request $request)
    {
        $request->validate([
            'author' => 'required|string',
            'title' => 'nullable|string',
            'phrase' => 'required|string', // Asegúrate de que la frase sea obligatoria
        ]);
    
        $quote = new Quote;
        $quote->author = $request->author;
        $quote->title = $request->title;
        $quote->phrase = $request->phrase;
    
        // Asignar automáticamente la fecha actual
        $quote->date = now(); // o Carbon::now();
    
        $quote->save(); // Laravel manejará created_at y updated_at automáticamente
    
        return response()->json(["result" => "Quote created"], 201);
    }
    

// Actualizar una cita existente
public function update(Request $request, $id)
{
    // Usar el método find() directamente
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

// Eliminar una cita existente
public function destroy($id)
{
    // Usar el método find() directamente
    $quote = Quote::find($id);

    if ($quote) {
        $quote->delete();

        return response()->json(["result" => "Quote deleted"], 200);
    }

    return response()->json(["message" => "Quote not found"], 404);
}

}

