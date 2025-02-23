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

class ScrapeGuardianJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    /**
     * Guardian API endpoint URL.
     */
    protected const GUARDIAN_API_URL = 'https://content.guardianapis.com/search';

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {
        Log::info('ScrapeGuardianJob started.');

        $apiKey = $this->getApiKey();
        if (empty($apiKey)) {
            Log::error('Guardian API key is missing.');
            return;
        }

        Log::info('Guardian API Key: ' . $apiKey);

        $articlesData = $this->fetchArticles($apiKey);
        if (empty($articlesData)) {
            Log::error("No articles fetched from The Guardian.");
            return;
        }

        $this->processArticles($articlesData);

        Log::info('ScrapeGuardianJob finished.');
    }

    /**
     * Retrieve the Guardian API key from configuration.
     *
     * @return string
     */
    protected function getApiKey(): string
    {
        return config('services.guardian.key', '');
    }

    /**
     * Fetch articles from the Guardian API.
     *
     * @param  string  $apiKey
     * @return array
     */
    protected function fetchArticles(string $apiKey): array
    {
        $response = Http::get(self::GUARDIAN_API_URL, [
            'api-key'     => $apiKey,
            'show-fields' => 'headline,bodyText,byline,short-url',
            'page-size'   => 20,
        ]);

        if (!$response->successful()) {
            Log::error("Error fetching from The Guardian: " . $response->body());
            return [];
        }

        return $response->json()['response']['results'] ?? [];
    }

    /**
     * Process and store each fetched article.
     *
     * @param  array  $articlesData
     * @return void
     */
    protected function processArticles(array $articlesData): void
    {
        foreach ($articlesData as $articleData) {
            $this->storeArticle($articleData);
        }
    }

    /**
     * Save or update an article in the database.
     *
     * @param  array  $articleData
     * @return void
     */
    protected function storeArticle(array $articleData): void
    {
        // Normalize values from the API response.
        $sourceName   = 'The Guardian';
        $categoryName = isset($articleData['sectionName'])
            ? strtoupper($articleData['sectionName'])
            : null;
        $authorName   = $articleData['fields']['byline'] ?? 'Unknown';

        // Retrieve or create related models.
        $source   = $this->getOrCreateSource($sourceName);
        $category = $categoryName ? $this->getOrCreateCategory($categoryName) : null;
        $author   = $this->getOrCreateAuthor($authorName);

        // Parse the publication date.
        $publishedAt = isset($articleData['webPublicationDate'])
            ? Carbon::parse($articleData['webPublicationDate'])
            : Carbon::now();

        // Update or create the article record.
        Article::updateOrCreate(
            ['url' => $articleData['webUrl']],
            [
                'title'        => $articleData['webTitle'] ?? 'No Title',
                'description'  => $articleData['fields']['bodyText'] ?? null,
                'published_at' => $publishedAt,
                'content'      => $articleData['fields']['bodyText'] ?? null,
                'data_source'  => 'guardian',
                'source'       => $sourceName,
                'source_id'    => $source->id,
                'category'     => $categoryName,
                'category_id'  => $category ? $category->id : null,
                'author_id'    => $author->id,
            ]
        );
    }

    /**
     * Retrieve or create a Source model.
     *
     * @param  string  $name
     * @return \App\Models\Source
     */
    protected function getOrCreateSource(string $name): Source
    {
        return Source::firstOrCreate(['name' => $name]);
    }

    /**
     * Retrieve or create a Category model.
     *
     * @param  string  $name
     * @return \App\Models\Category
     */
    protected function getOrCreateCategory(string $name): Category
    {
        return Category::firstOrCreate(['name' => $name]);
    }

    /**
     * Retrieve or create an Author model.
     *
     * @param  string  $name
     * @return \App\Models\Author
     */
    protected function getOrCreateAuthor(string $name): Author
    {
        return Author::firstOrCreate(['name' => $name]);
    }
}