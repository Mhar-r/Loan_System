<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  int       $roleId
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $roleId)
    {
        if (! Auth::check() || Auth::user()->role_id != $roleId) {
            abort(403);
        }
        return $next($request);
    }
}

