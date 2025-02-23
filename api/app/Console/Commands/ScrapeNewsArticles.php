<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;
use Throwable;
use App\Jobs\ScrapeNewsAPIJob;
use App\Jobs\ScrapeGuardianJob;
use App\Jobs\ScrapeNYTimesJob;
use Illuminate\Support\Facades\Log;

class ScrapeNewsArticles extends Command
{
    protected $signature = 'news:scrape';
    protected $description = 'Scrape news articles from multiple sources concurrently';

    public function handle()
    {
        $this->info("Dispatching news scraping jobs...");

        $jobs = [
            new ScrapeNewsAPIJob(),
            new ScrapeGuardianJob(),
            new ScrapeNYTimesJob(),
        ];

        Bus::batch($jobs)
            ->then(static function (Batch $batch) {
                Log::info("All scraping jobs completed successfully.");
            })
            ->catch(static function (Batch $batch, Throwable $e) {
                Log::error("One or more scraping jobs failed: " . $e->getMessage());
            })
            ->finally(static function (Batch $batch) {
                Log::info("Scraping jobs finished processing.");
            })
            ->dispatch();

        $this->info("Scraping jobs dispatched.");
    }
}