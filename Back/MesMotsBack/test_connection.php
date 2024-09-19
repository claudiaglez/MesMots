<?php

require 'vendor/autoload.php'; // Incluye el autoload de Composer

use MongoDB\Client;

$uri = 'mongodb+srv://claudiaglezg:naranja07@cluster0.7mbathm.mongodb.net/?retryWrites=true&w=majority';

// Crea un nuevo cliente y conéctate al servidor
$client = new Client($uri);

try {
    // Envía un ping para confirmar una conexión exitosa
    $client->selectDatabase('admin')->command(['ping' => 1]);
    echo "Pinged your deployment. You successfully connected to MongoDB!\n";
} catch (Exception $e) {
    printf($e->getMessage());
}

