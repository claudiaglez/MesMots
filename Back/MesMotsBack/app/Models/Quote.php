<?php

namespace App\Models;

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $connection = 'mongodb'; 

    protected $collection = 'quotes'; 

   
    protected $fillable = ['author', 'title', 'phrase', 'date'];
    
    public $timestamps = true;


    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}

