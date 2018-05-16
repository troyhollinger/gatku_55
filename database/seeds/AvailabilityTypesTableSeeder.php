<?php

use Illuminate\Database\Seeder;
use Gatku\AvailabilityType;

class AvailabilityTypesTableSeeder extends Seeder {

	public function run() {
		AvailabilityType::create(['name' => 'Available', 'slug' => 'available']);
		AvailabilityType::create(['name' => 'Preorder', 'slug' => 'preorder']);
		AvailabilityType::create(['name' => 'Feedback Only', 'slug' => 'feedback-only']);
		AvailabilityType::create(['name' => 'Unavailable', 'slug' => 'unavailable']);
	}
}
