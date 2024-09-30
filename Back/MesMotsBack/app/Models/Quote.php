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

    // Definir los campos que pueden ser asignados masivamente
    protected $fillable = ['author', 'title', 'phrase'];

    // (Opcional) Si necesitas hacer casting de algún campo específico, como la fecha:
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}



