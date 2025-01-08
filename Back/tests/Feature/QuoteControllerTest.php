<?php

namespace Tests\Feature;

use App\Models\Quote;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Illuminate\Support\Facades\Log;

class QuoteControllerTest extends TestCase
{
    public function setUp(): void
{
    parent::setUp();

    // Verificar la conexión de base de datos de pruebas
    $databaseName = DB::connection('mongodb_testing')->getDatabaseName();
    Log::info('Using database for tests:', [$databaseName]);

    // Limpia la colección de 'quotes' en MongoDB
    $database = DB::connection('mongodb_testing')->getMongoDB();
    $collections = $database->listCollections(['name' => 'quotes']);
    
    // Convertir el CachingIterator a un arreglo con iterator_to_array
    if (iterator_to_array($collections)) {
        $database->dropCollection('quotes');
    }
}

    

    public function test_it_shows_a_quote_when_exists()
    {
        $quote = Quote::factory()->create();

        $response = $this->get(route('quote.show', $quote->id));

        $response->assertStatus(200);
        $response->assertJson($quote->toArray());
    }

    public function test_it_returns_404_when_quote_not_found()
    {
        $response = $this->get(route('quote.show', 999));

        $response->assertStatus(404);
        $response->assertJson(['message' => 'Quote not found']);
    }

    public function test_it_creates_a_quote()
    {
        // Datos simulados para la solicitud
        $data = [
            'author' => 'Test Author',
            'title' => 'Test Title',
            'phrase' => 'This is a test phrase.',
        ];
    
        // Realizar una solicitud POST al endpoint
        $response = $this->postJson(route('quote.store'), $data);
    
        // Verificar que la respuesta tenga el código 201
        $response->assertStatus(201);
    
        // Verificar el mensaje de la respuesta
        $response->assertJson([
            "result" => "Quote created",
        ]);
    
        // Verificar que los datos se guardaron en la base de datos MongoDB
        $quote = \App\Models\Quote::where('author', 'Test Author')->where('phrase', 'This is a test phrase.')->first();
    
        $this->assertNotNull($quote, 'Quote not found in the database');
        $this->assertEquals('Test Author', $quote->author);
        $this->assertEquals('This is a test phrase.', $quote->phrase);
}

}


