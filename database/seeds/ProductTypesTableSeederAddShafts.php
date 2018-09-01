<?php

use Illuminate\Database\Seeder;
use Gatku\Model\ProductType;

class ProductTypesTableSeederAddShafts extends Seeder {

	public function run() {
		ProductType::create(['name' => 'Shafts', 'slug' => 'shafts', 'shippingPrice' => 1000]);
	}
}
