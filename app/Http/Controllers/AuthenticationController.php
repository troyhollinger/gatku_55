<?php

namespace App\Http\Controllers;

class AuthenticationController extends BaseController {


	public function index() {
		return View::make('pages.login');
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
				return \Redirect::route('home');
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