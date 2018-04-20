<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		//Eloquent::unguard(); //this was used before
		Model::unguard();

		$this->call('AvailabilityTypesTableSeeder');
		$this->call('ProductTypesTableSeeder');
		$this->call('ProductsTableSeeder');
		$this->call('SizesTableSeeder');
		$this->call('AddonsTableSeeder');
	}
}
