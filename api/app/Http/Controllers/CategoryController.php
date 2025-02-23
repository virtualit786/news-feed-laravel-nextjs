<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Return a list of all categories.
     */
    public function index(Request $request)
    {
        $categories = Category::all();

        return response()->json($categories);
    }
}