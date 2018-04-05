<?php namespace Austen\Repositories;

use User;
use Hash;

class UserRepository {

	public function all() {

		$users = User::all();

		return $users;

	}

	public function store($input) {

		try {
			
			$user = new User;
			$user->firstName = $input['firstName'];
			$user->lastName = $input['lastName'];
			$user->fullName = $input['firstName'] . ' ' . $input['lastName'];
			$user->email = $input['email'];
			$user->password = Hash::make($input['password']);
			if (isset($input['customerId'])) $user->customerId = $input['customerId'];
			$user->save();

		} catch (Exception $e) {
			
			Log::error($e);

			return false;

		}

		return $user;

	}

}