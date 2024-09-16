<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class BookQuote extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'quotes';

    protected $fillable = ['book', 'author', 'quote', 'date'];
}

?>