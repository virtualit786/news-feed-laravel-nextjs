<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;

class ArticleController extends Controller
{
    protected ArticleService $articleService;

    // Inject the ArticleService via the constructor
    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    /**
     * List articles with search and filtering.
     *
     * GET /api/articles
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $articles = $this->articleService->buildArticleQuery($request)->paginate(10);
        return response()->json($articles);
    }

    /**
     * Search for articles based on a keyword (q) and additional filters.
     *
     * GET /api/articles/search?q=...
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        // Validate that a search term is provided.
        if (!$request->filled('q')) {
            return response()->json(['message' => 'Please provide a search term'], 400);
        }

        // Merge 'q' into the request as 'keyword' so the shared query logic is reused.
        $request->merge(['keyword' => $request->input('q')]);

        // Build the query using the ArticleService.
        $query = $this->articleService->buildArticleQuery($request);

        // Paginate the search results.
        $articles = $query->paginate(10);

        return response()->json([
            'message'  => 'Search results',
            'articles' => $articles,
        ]);
    }
}
