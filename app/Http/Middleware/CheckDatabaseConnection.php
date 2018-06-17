<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;
use \Illuminate\Http\Request;
use \PDOException;

class CheckDatabaseConnection
{
    /**
     * This middleware is responsible for check if database connection can be established.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     * @throws \Exception
     */
    public function handle(Request $request, Closure $next)
    {
        if (DB::connection()->getPdo())
        {
            return $next($request);
        }

        //Just in case throw this exception.
        throw new PDOException('No database connection.');
    }
}
