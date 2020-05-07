<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Auth;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function profile(){
        return Auth::user();
    }

    //
}
