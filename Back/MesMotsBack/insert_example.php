<?php

require 'vendor/autoload.php'; // Asegúrate de tener el autoload de Composer

use MongoDB\Client;
use Illuminate\Support\Str;

$uri = 'mongodb+srv://claudiaglezg:naranja07@cluster0.7mbathm.mongodb.net/?retryWrites=true&w=majority';
$client = new Client($uri);
$collection = $client->mesMots->quotes;

$newQuote = [
    'id' => (string) Str::uuid(), // Generar un ID único
    'author' => 'Theodor Kalifatides',
    'title' => 'Timandra',
    'date' => date('Y-m-d H:i:s'),
    'phrase' => 'JAfjaehfklhearbdfjlzabfeh',
];

try {
    $result = $collection->insertOne($newQuote);
    echo "Inserted document with ID: " . $result->getInsertedId() . "\n";
} catch (Exception $e) {
    echo "Error al insertar documento: " . $e->getMessage();
}

