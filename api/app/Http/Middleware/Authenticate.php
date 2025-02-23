<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }
    protected function unauthenticated($request, \Illuminate\Auth\AuthenticationException $exception)
{
    // If the request expects JSON (like for your API routes)...
    if ($request->expectsJson()) {
        return response()->json(['message1' => $exception->getMessage()], 401);
    }

    // Otherwise, redirect to a login route (or any other fallback)
    return redirect()->guest(route('login'));
}
}
