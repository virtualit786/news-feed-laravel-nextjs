<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\ScrapeNewsAPIJob;
use Illuminate\Support\Facades\Log;

class JobTestController extends Controller
{
    /**
     * Dispatch a sample ScrapeNewsAPIJob.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function dispatchNewsApiJob(Request $request)
    {
        dispatch(new ScrapeNewsAPIJob());

        Log::info('JobTestController dispatched a ScrapeNewsAPIJob.');

        return response()->json(['message' => 'ScrapeNewsAPIJob dispatched!']);
    }
}
