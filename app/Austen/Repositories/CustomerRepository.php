<?php namespace Austen\Repositories;


use Customer;

class CustomerRepository {

	/**
	 *
	 * @todo figure out what the hell stripeId is supposed to be
	 *
	 */
	public function store($input) {

		$customer = new Customer;
		$customer->firstName = $input['firstName'];
		$customer->lastName = $input['lastName'];
		$customer->fullName = $input['firstName'] . ' ' . $input['lastName'];
		$customer->email = $input['email'];
		$customer->phone = $input['phone'];
		$customer->address = $input['address'];
		$customer->city = $input['city'];
		$customer->state = $input['state'];
		$customer->zip = $input['zip'];
		$customer->country = $input['country'];
		$customer->stripeId = 1;
		$customer->save();

		return $customer;

	}


}
