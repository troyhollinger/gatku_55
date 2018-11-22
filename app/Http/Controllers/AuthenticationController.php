<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Auth;
use Gatku\Model\HomeSetting;

class AuthenticationController extends BaseController {


    /**
     * @param HomeSetting $homeSetting
     * @return mixed
     */
	public function index(HomeSetting $homeSetting) {
		return View::make('pages.login')->with('homeSetting', $homeSetting);
	}

    /**
     * @return mixed
     */
	public function authenticate()
    {
		$email = \Request::get('email');
		$password = \Request::get('password');

		if(Auth::attempt(['email' => $email, 'password' => $password], true)) {
			if (Auth::user()->admin) {
				return \Redirect::route('admin.index');
			} else {
				return \Redirect::route('admin.index');
			}
		} else {
			return \Redirect::route('login.index');
		}
	}

    /**
     * @return mixed
     */
	public function logout() {
		Auth::logout();
		return \Redirect::route('home');
	}
}