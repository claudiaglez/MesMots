<?php

namespace App\Models;

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    // Indica que este modelo se conectará a MongoDB
    protected $connection = 'mongodb'; // Nombre de la conexión a usar (opcional si es la predeterminada)

    // Nombre de la colección en MongoDB
    protected $collection = 'quotes'; // La colección donde se almacenan los documentos

   
    protected $fillable = ['author', 'title', 'phrase', 'date'];
    
    // Habilitar el manejo automático de created_at y updated_at
    public $timestamps = true;


    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}

