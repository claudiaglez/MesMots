<?php

namespace Tests\Feature;

use App\Models\Quote;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class QuoteControllerTest extends TestCase
{
    use RefreshDatabase;

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

    public function test_it_edits_a_quote()
{
    // Crear una cita original
    $quote = Quote::create([
        'author' => 'Original Author',
        'title' => 'Original Title',
        'phrase' => 'Original phrase.',
        'date' => now(),
    ]);

    // Verificar que el ID de la cita se haya generado y no sea nulo
    $this->assertNotNull($quote->id);
    echo $quote->id;

    // Verificar que la cita existe en la base de datos usando el modelo
    $foundQuote = Quote::find($quote->id);
    $this->assertNotNull($foundQuote, 'The quote was not found in the database.');

    // Datos actualizados para la cita
    $data = [
        'author' => 'Updated Author',
        'title' => 'Updated Title',
        'phrase' => 'Updated phrase',
    ];

    // Realizar una solicitud PUT para editar la cita
    $response = $this->putJson(route('quote.update', ['id' => $quote->id]), $data);

    // Verificar que la respuesta sea exitosa (200 OK)
    $response->assertStatus(200);

    // Verificar que el mensaje de respuesta sea correcto
    $response->assertJson([
        'result' => 'Quote updated',
    ]);

    // Refrescar la cita para obtener los datos actualizados
    $quote->refresh();

    // Verificar que los datos se hayan actualizado correctamente
    $this->assertEquals('Updated Author', $quote->author);
    $this->assertEquals('Updated Title', $quote->title);
    $this->assertEquals('Updated phrase', $quote->phrase);

    // Verificar que el registro sigue existiendo en la base de datos
    $updatedQuote = Quote::find($quote->id);
    $this->assertEquals('Updated Author', $updatedQuote->author);
    $this->assertEquals('Updated Title', $updatedQuote->title);
    $this->assertEquals('Updated phrase', $updatedQuote->phrase);
}

public function test_it_deletes_a_quote()
{
    // Crear una cita en la base de datos
    $quote = Quote::create([
        'author' => 'Author to delete',
        'title' => 'Title to delete',
        'phrase' => 'Phrase to delete.',
        'date' => now(),
    ]);

    // Verificar que la cita fue creada correctamente
    $this->assertNotNull($quote->id);
    $foundQuote = Quote::find($quote->id);
    $this->assertNotNull($foundQuote, 'The quote was not found in the database.');

    // Realizar una solicitud DELETE para eliminar la cita
    $response = $this->deleteJson(route('quote.destroy', ['id' => $quote->id]));

    // Verificar que la respuesta sea exitosa (200 OK)
    $response->assertStatus(200);

    // Verificar que el mensaje de respuesta sea correcto
    $response->assertJson([
        'result' => 'Quote deleted',
    ]);

    // Verificar que la cita ya no exista en la base de datos
    $deletedQuote = Quote::find($quote->id);
    $this->assertNull($deletedQuote, 'The quote was not deleted from the database.');
}

public function test_it_validates_required_fields_on_create()
{
    $data = []; // Sin datos

    $response = $this->postJson(route('quote.store'), $data);

    $response->assertStatus(422); // Código para errores de validación
    $response->assertJsonValidationErrors(['author', 'phrase']);
}

public function test_store_creates_quote_without_title()
{
    // Datos de prueba sin título
    $data = [
        'author' => 'Jane Austen',
        'phrase' => 'It is a truth universally acknowledged.',
    ];

    // Realizar la solicitud POST para crear la cita
    $response = $this->postJson(route('quote.store'), $data);

    // Verificar que la respuesta tenga un código 201 (creado)
    $response->assertStatus(201);

    // Buscar el registro en la base de datos usando el modelo
    $quote = Quote::where('author', $data['author'])
                  ->where('phrase', $data['phrase'])
                  ->first();

    // Verificar que el registro existe
    $this->assertNotNull($quote, 'The quote should exist in the database.');

    // Asegurarse de que el título es null
    $this->assertNull($quote->title, 'The title field should be null.');
}

public function test_index_returns_quotes_in_correct_format()
{
    Quote::factory()->create([
        'author' => 'Mark Twain',
        'phrase' => 'The secret of getting ahead is getting started.',
        'title' => 'Motivation',
        'date' => now(),
    ]);

    $response = $this->getJson(route('quote.index'));

    $response->assertStatus(200)
        ->assertJsonStructure([
            '*' => ['id', 'author', 'phrase', 'title', 'date'],
        ]);
}

public function test_get_authors_returns_unique_authors()
{
    // Verificar cuántos documentos hay antes de la prueba
    $countBefore = \App\Models\Quote::count();
    Log::info('Quotes count before test: ' . $countBefore);

    // Limpiar la colección de citas antes de la prueba
    \App\Models\Quote::query()->delete();

    // Insertar los datos de prueba
    Quote::create([
        'author' => 'Author 1',
        'phrase' => 'Phrase 1',
        'title' => 'Title 1',
    ]);
    Quote::create([
        'author' => 'Author 2',
        'phrase' => 'Phrase 2',
        'title' => 'Title 2',
    ]);
    Quote::create([
        'author' => 'Author 1',
        'phrase' => 'Phrase 3',
        'title' => 'Title 3',
    ]);

    // Realizamos la solicitud GET
    $response = $this->getJson(route('quote.authors'));

    // Verificamos el estado de la respuesta
    $response->assertStatus(200);

    // Obtener autores de la respuesta
    $authors = $response->json();

    // Verificar cuántos documentos hay después de la inserción
    $countAfter = \App\Models\Quote::count();
    Log::info('Quotes count after test: ' . $countAfter);

    // Verificar que haya solo 2 autores únicos
    $this->assertCount(2, $authors);
    $this->assertEquals(['Author 1', 'Author 2'], $authors);
}

public function test_store_assigns_date_automatically()
{
    // Datos de prueba sin incluir la fecha
    $data = [
        'author' => 'Albert Einstein',
        'phrase' => 'Imagination is more important than knowledge.',
        'title' => 'Science',
    ];

    // Realizar la solicitud POST para crear la cita
    $response = $this->postJson(route('quote.store'), $data);

    // Verificar que la respuesta tenga un código 201 (creado)
    $response->assertStatus(201);

    // Obtener el registro de la base de datos
    $quote = Quote::where('author', $data['author'])->first();

    // Verificar que el registro exista
    $this->assertNotNull($quote, 'The quote should exist in the database.');

    // Asegurarse de que la fecha no sea nula y esté en el formato esperado
    $this->assertNotNull($quote->date, 'The date field should not be null.');
    $this->assertTrue(
        Carbon::hasFormat($quote->date, 'Y-m-d H:i:s'),
        'The date field does not match the expected format.'
    );
}


}
