<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use MongoDB\Client as MongoDBClient;

class TestMongoConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-mongo-connection';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $uri = env('MONGODB_URI');
        if ($uri) {
            $client = new MongoDBClient($uri);
            // Aquí puedes hacer una consulta simple para verificar la conexión
            $databases = $client->listDatabases();
            $this->info('Connected to MongoDB. Databases: ' . json_encode($databases));
        } else {
            $this->error('MONGODB_URI not set!');
        }
    }
    
}
