<?php

require 'vendor/autoload.php'; // Asegúrate de tener el autoload de Composer

use MongoDB\Client;

$uri = 'mongodb+srv://claudiaglezg:naranja07@cluster0.7mbathm.mongodb.net/?retryWrites=true&w=majority';
$client = new Client($uri);

// Selecciona la base de datos y la colección
$collection = $client->mesMots->quotes;

// Documento que deseas insertar
$newQuote = [
    'author' => 'J.K. Rowling',
    'text' => 'It does not do to dwell on dreams and forget to live.',
    'created_at' => date('Y-m-d H:i:s'), 
];

// Inserta el documento
$result = $collection->insertOne($newQuote);

echo "Inserted document with ID: " . $result->getInsertedId() . "\n";
