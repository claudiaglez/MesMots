<?php

namespace App\Models;

use MongoDB\Client;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class Quote
{
    protected $collection;

    public function __construct()
    {
        try {
            $this->collection = (new Client(env('MONGODB_URI')))
                ->mesMots->quotes;
            Log::info('Conexión a MongoDB establecida correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al conectar a MongoDB: ' . $e->getMessage());
        }
    }
    

    public function createQuote($data)
    {
        $quote = [
            'id' => (string) Str::uuid(),
            'author' => $data['author'],
            'title' => $data['title'],
            'date' => Carbon::now(), // Usar Carbon para la fecha actual
            'phrase' => $data['phrase'],
        ];

        try {
            return $this->collection->insertOne($quote);
        } catch (\Exception $e) {
            throw $e; // Lanza la excepción para manejarla en el controlador
        }
    }

    public function getAllQuotes()
    {
        try {
            return iterator_to_array($this->collection->find());
        } catch (\Exception $e) {
            throw $e; // Manejo de excepciones
        }
    }
}
