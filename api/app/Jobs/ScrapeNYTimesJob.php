<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Article;
use App\Models\Source;
use App\Models\Category;
use App\Models\Author;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Bus\Batchable;
use Illuminate\Queue\InteractsWithQueue;

class ScrapeNYTimesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    /**
     * The NYTimes top stories API URL.
     *
     * @var string
     */
    protected string $apiUrl = 'https://api.nytimes.com/svc/topstories/v2/home.json';

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {
        Log::info('ScrapeNYTimesJob::handle started');

        $apiKey = $this->getApiKey();
        if (empty($apiKey)) {
            Log::error('NYTimes API key is missing.');
            return;
        }
        Log::info('NYTimes API Key retrieved');

        $articlesData = $this->fetchArticles($apiKey);
        if (empty($articlesData)) {
            Log::error('No articles fetched from The New York Times');
            return;
        }

        $this->processArticles($articlesData);

        Log::info('ScrapeNYTimesJob finished.');
    }

    /**
     * Retrieve the NYTimes API key from configuration.
     *
     * @return string
     */
    protected function getApiKey(): string
    {
        return config('services.nytimes.key');
    }

    /**
     * Fetch articles from the NYTimes top stories endpoint.
     *
     * @param string $apiKey
     * @return array
     */
    protected function fetchArticles(string $apiKey): array
    {
        $response = Http::get($this->apiUrl, [
            'api-key' => $apiKey,
        ]);

        if (!$response->successful()) {
            Log::error("Error fetching from The New York Times: " . $response->body());
            return [];
        }

        return $response->json()['results'] ?? [];
    }

    /**
     * Process each article returned from the API.
     *
     * @param array $articlesData
     * @return void
     */
    protected function processArticles(array $articlesData): void
    {
        foreach ($articlesData as $articleData) {
            Log::info('Processing article', ['title' => $articleData['title'] ?? 'No Title']);
            $this->saveArticle($articleData);
        }
    }

    /**
     * Get or create related models (Source, Category, Author) for an article.
     *
     * @param array $articleData
     * @return array
     */
    protected function getRelatedModels(array $articleData): array
    {
        // Set up source and category names
        $sourceName   = 'NYTimes';
        $categoryName = isset($articleData['section'])
            ? strtoupper($articleData['section'])
            : null;

        // Clean up byline to extract author name
        $rawAuthor = $articleData['byline'] ?? null;
        $authorName = $rawAuthor ? trim(str_replace('By ', '', $rawAuthor)) : 'Unknown';

        // Fetch or create related models
        $source   = Source::firstOrCreate(['name' => $sourceName]);
        $category = $categoryName ? Category::firstOrCreate(['name' => $categoryName]) : null;
        $author   = Author::firstOrCreate(['name' => $authorName]);

        return [
            'source'   => $source,
            'category' => $category,
            'author'   => $author,
        ];
    }

    /**
     * Save or update an article in the database.
     *
     * @param array $articleData
     * @return void
     */
    protected function saveArticle(array $articleData): void
    {
        // Get related models
        $models = $this->getRelatedModels($articleData);
        $source   = $models['source'];
        $category = $models['category'];
        $author   = $models['author'];

        // Parse publication date
        $publishedAt = isset($articleData['published_date'])
            ? Carbon::parse($articleData['published_date'])
            : Carbon::now();

        // Determine article content (fallback to abstract if content is missing)
        $content = $articleData['content'] ?? ($articleData['abstract'] ?? 'NO CONTENT');

        Article::updateOrCreate(
            ['url' => $articleData['url']],
            [
                'title'        => $articleData['title'] ?? 'No Title',
                'description'  => $articleData['abstract'] ?? null,
                'url'          => $articleData['url'],
                'published_at' => $publishedAt,
                'content'      => $content,
                'category'     => isset($category) ? strtoupper($category->name) : null,
                'data_source'  => 'nytimes',
                'source'       => $source->name,
                'source_id'    => $source->id,
                'category_id'  => $category ? $category->id : null,
                'author_id'    => $author->id,
            ]
        );
    }
}