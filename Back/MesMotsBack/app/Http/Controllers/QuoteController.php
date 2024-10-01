<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quote; 

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
    
    // Crear una nueva cita
    public function store(Request $request)
    {
        $quote = new Quote;

        // Asignar los valores del formulario a los campos
        $quote->author = $request->author;
        $quote->title = $request->title;
        $quote->phrase = $request->phrase;
        // La fecha será manejada automáticamente según lo que mencionaste
        $quote->save();

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
