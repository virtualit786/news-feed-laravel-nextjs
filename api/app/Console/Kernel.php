<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        // Example: Log a message every minute for testing
        $schedule->call(function () {
            Log::info('Scheduled task ran at ' . now());
        })->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        // Automatically load all commands in the Commands directory.
        $this->load(__DIR__.'/Commands');

        // Optionally, you can require a file for console routes.
        require base_path('routes/console.php');
    }
}