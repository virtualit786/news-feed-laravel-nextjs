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

class ScrapeNewsAPIJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    private const SOURCES_ENDPOINT = 'https://newsapi.org/v2/top-headlines/sources';
    private const HEADLINES_ENDPOINT = 'https://newsapi.org/v2/top-headlines';

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {
        Log::info('ScrapeNewsAPIJob::handle started');

        $apiKey = config('services.newsapi.key');
        if (empty($apiKey)) {
            Log::error('NewsAPI key is missing.');
            return;
        }

        // Run both API calls concurrently using Http::pool()
        $responses = Http::pool(function ($pool) use ($apiKey) {
            return [
                'sources'   => $pool->get(self::SOURCES_ENDPOINT, [
                    'country' => 'us',
                    'apiKey'  => $apiKey,
                ]),
                'headlines' => $pool->get(self::HEADLINES_ENDPOINT, [
                    'country' => 'us',
                    'apiKey'  => $apiKey,
                ]),
            ];
        });

        // Sometimes, the pool may return a numerically indexed array.
        // To ensure we have both responses, we check for both keyed and indexed access.
        $sourcesResponse = $responses['sources'] ?? ($responses[0] ?? null);
        $headlinesResponse = $responses['headlines'] ?? ($responses[1] ?? null);

        if (!$sourcesResponse || !$headlinesResponse) {
            Log::error('Missing one or more responses from Http::pool()', ['responses' => $responses]);
            return;
        }

        $sourceCategories = $this->buildSourceCategoryMapping($sourcesResponse);
        $articlesData = $this->getArticles($headlinesResponse);

        foreach ($articlesData as $articleData) {
            $this->processArticle($articleData, $sourceCategories);
        }

        Log::info('ScrapeNewsAPIJob finished.');
    }

    /**
     * Build a mapping of source IDs to their category.
     *
     * @param \Illuminate\Http\Client\Response $response
     * @return array
     */
    protected function buildSourceCategoryMapping($response): array
    {
        $mapping = [];
        if (!$response->successful()) {
            Log::error("Error fetching sources: " . $response->body());
            return $mapping;
        }

        $sources = $response->json()['sources'] ?? [];
        foreach ($sources as $source) {
            if (!empty($source['id'])) {
                $mapping[$source['id']] = $source['category'] ?? null;
            }
        }

        Log::info('Fetched source categories', ['mapping' => $mapping]);
        return $mapping;
    }

    /**
     * Retrieve articles from the headlines response.
     *
     * @param \Illuminate\Http\Client\Response $response
     * @return array
     */
    protected function getArticles($response): array
    {
        if (!$response->successful()) {
            Log::error("Error fetching top headlines: " . $response->body());
            return [];
        }
        $articles = $response->json()['articles'] ?? [];
        if (empty($articles)) {
            Log::error('No articles fetched from top headlines.');
        }
        return $articles;
    }

    /**
     * Process an individual article and store it in the database.
     *
     * @param array $articleData
     * @param array $sourceCategories
     * @return void
     */
    protected function processArticle(array $articleData, array $sourceCategories): void
    {
        // Determine category from the source's category mapping.
        $sourceId = $articleData['source']['id'] ?? null;
        $categoryName = ($sourceId && isset($sourceCategories[$sourceId]))
            ? strtoupper($sourceCategories[$sourceId])
            : null;
        $category = $categoryName ? Category::firstOrCreate(['name' => $categoryName]) : null;

        // Retrieve or create source model.
        $sourceName = $articleData['source']['name'] ?? 'NewsAPI';
        $source = Source::firstOrCreate(['name' => $sourceName]);

        // Retrieve or create author model.
        $authorName = $articleData['author'] ?? 'Unknown';
        $author = Author::firstOrCreate(['name' => $authorName]);

        // Parse publication date.
        $publishedAt = isset($articleData['publishedAt'])
            ? Carbon::parse($articleData['publishedAt'])
            : Carbon::now();

        // Determine article content. Fall back to description if content is missing.
        $content = $articleData['content'] ?? ($articleData['description'] ?? 'NO CONTENT');

        Log::info('Processing article', ['article' => $articleData]);

        // Update or create the article record.
        Article::updateOrCreate(
            ['url' => $articleData['url']],
            [
                'title'        => $articleData['title'] ?? 'No Title',
                'description'  => $articleData['description'] ?? null,
                'url'          => $articleData['url'],
                'published_at' => $publishedAt,
                'content'      => $content,
                'data_source'  => 'newsapi',
                'source'       => $sourceName,
                'source_id'    => $source->id,
                'category'     => $categoryName,
                'category_id'  => $category ? $category->id : null,
                'author_id'    => $author->id,
            ]
        );
    }
}