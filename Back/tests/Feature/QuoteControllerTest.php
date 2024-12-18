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
        // Datos para la nueva cita
        $quoteData = [
            'author' => 'Bécquer',
            'title' => 'Poemas',
            'phrase' => 'Volverán las oscuras golondrinas',
            'date' => now(),  // Utiliza la fecha y hora actual
        ];

        // Realiza una solicitud para crear la cita
        $response = $this->postJson(route('quote.store'), $quoteData);

        // Verifica que la respuesta sea exitosa (201 Created)
        $response->assertStatus(201);

        // Verifica que el registro se haya creado en la base de datos
        $this->assertTrue(
            DB::connection('mongodb_testing')->collection('quotes')->where('author', 'Bécquer')->exists()
        );

        // Verifica que el campo 'date' esté cerca del valor actual
        $this->assertTrue(
            DB::connection('mongodb_testing')->collection('quotes')->where('date', '>=', now()->subMinutes(1)->toDateTimeString())->exists()
        );
    }
}


