<?php

namespace Database\Factories;

use App\Models\Quote;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuoteFactory extends Factory
{
    protected $model = Quote::class;

    public function definition()
    {
        return [
            'author' => $this->faker->name,
            'title' => $this->faker->word,
            'phrase' => $this->faker->sentence,
            'date' => $this->faker->date(),
        ];
    }
}
