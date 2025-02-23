<?php

namespace App\Http\Controllers;

use App\Models\Source;
use Illuminate\Http\Request;

class SourceController extends Controller
{
    /**
     * Return a list of all sources.
     */
    public function index(Request $request)
    {
        $sources = Source::all();

        return response()->json($sources);
    }
}