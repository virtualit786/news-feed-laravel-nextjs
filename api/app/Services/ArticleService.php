<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Models\Article;

class ArticleService
{
    /**
     * Build an article query with eager-loaded relationships and filtering.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function buildArticleQuery(Request $request)
    {
        $query = Article::with(['category', 'author', 'source']);

        if ($keyword = $request->input('keyword')) {
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category_id', $category);
        }

        if ($author = $request->input('author')) {
            $query->where('author_id', $author);
        }

        if ($source = $request->input('source')) {
            $query->where('source_id', $source);
        }

        if ($date = $request->input('date')) {
            $query->whereDate('published_at', $date);
        }

        if ($dataSource = $request->input('dataSource')) {
            $query->where('data_source', $dataSource);
        }

        return $query;
    }
}