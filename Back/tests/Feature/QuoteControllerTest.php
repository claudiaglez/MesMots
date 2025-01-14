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

        $databaseName = DB::connection('mongodb_testing')->getDatabaseName();
        Log::info('Using database for tests:', [$databaseName]);

        $database = DB::connection('mongodb_testing')->getMongoDB();
        $collections = $database->listCollections(['name' => 'quotes']);

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
        $data = [
            'author' => 'Test Author',
            'title' => 'Test Title',
            'phrase' => 'This is a test phrase.',
        ];

        $response = $this->postJson(route('quote.store'), $data);

        $response->assertStatus(201);

        $response->assertJson([
            "result" => "Quote created",
        ]);

        $quote = \App\Models\Quote::where('author', 'Test Author')->where('phrase', 'This is a test phrase.')->first();

        $this->assertNotNull($quote, 'Quote not found in the database');
        $this->assertEquals('Test Author', $quote->author);
        $this->assertEquals('This is a test phrase.', $quote->phrase);
    }

    public function test_it_edits_a_quote()
{
    $quote = Quote::create([
        'author' => 'Original Author',
        'title' => 'Original Title',
        'phrase' => 'Original phrase.',
        'date' => now(),
    ]);

    $this->assertNotNull($quote->id);

    $foundQuote = Quote::find($quote->id);
    $this->assertNotNull($foundQuote, 'The quote was not found in the database.');

    $data = [
        'author' => 'Updated Author',
        'title' => 'Updated Title',
        'phrase' => 'Updated phrase',
    ];

    $response = $this->putJson(route('quote.update', ['id' => $quote->id]), $data);

    $response->assertStatus(200);

    $response->assertJson([
        'result' => 'Quote updated',
    ]);

    $quote->refresh();

    $this->assertEquals('Updated Author', $quote->author);
    $this->assertEquals('Updated Title', $quote->title);
    $this->assertEquals('Updated phrase', $quote->phrase);

    $updatedQuote = Quote::find($quote->id);
    $this->assertEquals('Updated Author', $updatedQuote->author);
    $this->assertEquals('Updated Title', $updatedQuote->title);
    $this->assertEquals('Updated phrase', $updatedQuote->phrase);
}

public function test_it_deletes_a_quote()
{
    $quote = Quote::create([
        'author' => 'Author to delete',
        'title' => 'Title to delete',
        'phrase' => 'Phrase to delete.',
        'date' => now(),
    ]);

    $this->assertNotNull($quote->id);
    $foundQuote = Quote::find($quote->id);
    $this->assertNotNull($foundQuote, 'The quote was not found in the database.');

    $response = $this->deleteJson(route('quote.destroy', ['id' => $quote->id]));

    $response->assertStatus(200);

    $response->assertJson([
        'result' => 'Quote deleted',
    ]);

    $deletedQuote = Quote::find($quote->id);
    $this->assertNull($deletedQuote, 'The quote was not deleted from the database.');
}

public function test_it_validates_required_fields_on_create()
{
    $data = []; 

    $response = $this->postJson(route('quote.store'), $data);

    $response->assertStatus(422); 
    $response->assertJsonValidationErrors(['author', 'phrase']);
}

public function test_store_creates_quote_without_title()
{
    $data = [
        'author' => 'Jane Austen',
        'phrase' => 'It is a truth universally acknowledged.',
    ];

    $response = $this->postJson(route('quote.store'), $data);

    $response->assertStatus(201);

    $quote = Quote::where('author', $data['author'])
                  ->where('phrase', $data['phrase'])
                  ->first();

    $this->assertNotNull($quote, 'The quote should exist in the database.');

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
    $countBefore = \App\Models\Quote::count();
    Log::info('Quotes count before test: ' . $countBefore);

    \App\Models\Quote::query()->delete();

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

    $response = $this->getJson(route('quote.authors'));

    $response->assertStatus(200);

    $authors = $response->json();

    $countAfter = \App\Models\Quote::count();
    Log::info('Quotes count after test: ' . $countAfter);

    $this->assertCount(2, $authors);
    $this->assertEquals(['Author 1', 'Author 2'], $authors);
}

public function test_store_assigns_date_automatically()
{
    $data = [
        'author' => 'Albert Einstein',
        'phrase' => 'Imagination is more important than knowledge.',
        'title' => 'Science',
    ];

    $response = $this->postJson(route('quote.store'), $data);

    $response->assertStatus(201);

    $quote = Quote::where('author', $data['author'])->first();

    $this->assertNotNull($quote, 'The quote should exist in the database.');

    $this->assertNotNull($quote->date, 'The date field should not be null.');
    $this->assertTrue(
        Carbon::hasFormat($quote->date, 'Y-m-d H:i:s'),
        'The date field does not match the expected format.'
    );
}

public function test_show_returns_correct_json_format()
{
    $quote = Quote::create([
        'author' => 'Jane Austen',
        'title' => 'Pride and Prejudice',
        'phrase' => 'It is a truth universally acknowledged...',
        'date' => now(), 
    ]);

    $response = $this->getJson(route('quote.show', $quote->id));

    $response->assertStatus(200);

    $responseJson = $response->json();

    if (isset($responseJson[0])) {
        $actualDate = substr($responseJson[0]['date'], 0, 19);  
    } else {
        $actualDate = substr($responseJson['date'], 0, 19);
    }

    $expectedDate = $quote->date->format('Y-m-d\TH:i:s');  

    $this->assertEquals($expectedDate, $actualDate);

    $response->assertJsonFragment([
        'id' => $quote->id,
        'author' => 'Jane Austen',
        'title' => 'Pride and Prejudice',
        'phrase' => 'It is a truth universally acknowledged...',
    ]);
}

public function test_index_returns_empty_array_when_no_quotes()
{
    $response = $this->getJson(route('quote.index'));

    $response->assertStatus(200);

    $response->assertJson([]); 
}

public function test_update_returns_404_if_quote_not_found()
{
     $response = $this->putJson(route('quote.update', ['id' => 99999]), [
        'author' => 'Updated Author',
        'title' => 'Updated Title',
        'phrase' => 'Updated phrase',
    ]);

    $response->assertStatus(404);
    $response->assertJson(['message' => 'Quote not found']);
}

public function test_update_does_not_change_fields_not_provided()
{
    $quote = Quote::create([
        'author' => 'Original Author',
        'title' => 'Original Title',
        'phrase' => 'Original phrase.',
        'date' => now(),
    ]);

    $response = $this->putJson(route('quote.update', ['id' => $quote->id]), [
        'author' => 'Updated Author',
    ]);

    $response->assertStatus(200);
    $response->assertJson([
        'result' => 'Quote updated',
    ]);

    $this->assertDatabaseHas('quotes', [
        '_id' => $quote->id,
        'author' => 'Updated Author',
        'title' => null, 
        'phrase' => null, 
    ]);
}

public function test_destroy_returns_404_if_quote_not_found()
{
    $nonExistentId = '64b6f7a5643b2a0010e53a9c';

    $response = $this->deleteJson(route('quote.destroy', ['id' => $nonExistentId]));

    $response->assertStatus(404);

    $response->assertJson([
        'message' => 'Quote not found',
    ]);
}

public function test_get_authors_returns_empty_array_if_no_quotes()
{
    Quote::query()->delete(); 

    $response = $this->getJson(route('quote.authors'));

    $response->assertStatus(200);
    $response->assertJson([]);
}

public function test_get_titles_returns_empty_array_if_no_quotes()
{
    Quote::query()->delete(); 

    $response = $this->getJson(route('quote.titles'));

    $response->assertStatus(200);
    $response->assertJson([]);
}

public function test_getAuthors_success()
{
    Quote::create(['author' => 'Author 1', 'title' => 'Title 1', 'phrase' => 'Phrase 1']);
    Quote::create(['author' => 'Author 2', 'title' => 'Title 2', 'phrase' => 'Phrase 2']);

    $response = $this->getJson('/api/authors'); 

    $response->assertStatus(200);

    $response->assertJson(['Author 1', 'Author 2']);
}

public function test_GetTitles_success()
{
    Quote::create(['author' => 'Author 1', 'title' => 'Title 1', 'phrase' => 'Phrase 1']);
    Quote::create(['author' => 'Author 2', 'title' => 'Title 2', 'phrase' => 'Phrase 2']);

    $response = $this->getJson('/api/titles'); 

    $response->assertStatus(200);
    
    $response->assertJson(['Title 1', 'Title 2']);
}

}
