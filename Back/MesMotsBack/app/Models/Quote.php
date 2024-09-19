<?php

namespace App\Models;

use MongoDB\Client;
use Carbon\Carbon;

class Quote
{
    protected $collection;

    public function __construct()
    {
        $this->collection = (new Client(env('MONGODB_URI')))
            ->selectCollection('mesMots', 'quotes');
    }

    public function createQuote($data)
    {
        $quote = [
            'text' => $data['text'],
            'author' => $data['author'],
            'created_at' => Carbon::now(),
        ];

        return $this->collection->insertOne($quote);
    }

    public function getAllQuotes()
    {
        return iterator_to_array($this->collection->find());
    }
}

