<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    /**
     * Return a list of all authors.
     */
    public function index(Request $request)
    {
        $authors = Author::all();

        return response()->json($authors);
    }
}