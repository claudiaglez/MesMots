<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    protected $quoteModel;

    public function __construct()
    {
        $this->quoteModel = new Quote();
    }

    public function store(Request $request)
    {
        $result = $this->quoteModel->createQuote($request->all());
        return response()->json(['id' => $result->getInsertedId()]);
    }

    public function index()
    {
        $quotes = $this->quoteModel->getAllQuotes();
        return response()->json($quotes);
    }
}
