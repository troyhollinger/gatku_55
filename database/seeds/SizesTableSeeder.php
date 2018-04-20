<?php

use Illuminate\Database\Seeder;
use Gatku\Size;


class SizesTableSeeder extends Seeder {

	public function run() {
		
		// Size::create(['name' => 'Small', 'slug' => 'small']);
		// Size::create(['name' => 'Medium', 'slug' => 'medium']);
		// Size::create(['name' => 'Large', 'slug' => 'large']);
		// Size::create(['name' => 'X Large', 'slug' => 'xlarge']);
		// Size::create(['name' => 'XX Large', 'slug' => 'xxlarge']);

		Size::create(['name' => 'Small 9\'ER T-Shirt', 'shortName' => 'Small', 'slug' => 'small-niner-tshirt', 'productId' => 13, 'price' => 2500]);
		Size::create(['name' => 'Medium 9\'ER T-Shirt', 'shortName' => 'Medium', 'slug' => 'medium-niner-tshirt', 'productId' => 13, 'price' => 2500]);
		Size::create(['name' => 'Large 9\'ER T-Shirt', 'shortName' => 'Large', 'slug' => 'large-niner-tshirt', 'productId' => 13, 'price' => 2500]);
		Size::create(['name' => 'X Large 9\'ER T-Shirt', 'shortName' => 'X Large', 'slug' => 'xlarge-niner-tshirt', 'productId' => 13, 'price' => 2500]);
		Size::create(['name' => 'XX Large 9\'ER T-Shirt', 'shortName' => 'XX Large', 'slug' => 'xxlarge-niner-tshirt', 'productId' => 13, 'price' => 2500]);

		Size::create(['name' => 'Small SuperHero T-Shirt', 'shortName' => 'Small', 'slug' => 'small-superhero-tshirt', 'productId' => 14, 'price' => 2500]);
		Size::create(['name' => 'Medium SuperHero T-Shirt', 'shortName' => 'Medium', 'slug' => 'medium-superhero-tshirt', 'productId' => 14, 'price' => 2500]);
		Size::create(['name' => 'Large SuperHero T-Shirt', 'shortName' => 'Large', 'slug' => 'large-superhero-tshirt', 'productId' => 14, 'price' => 2500]);
		Size::create(['name' => 'X Large SuperHero T-Shirt', 'shortName' => 'X Large', 'slug' => 'xlarge-superhero-tshirt', 'productId' => 14, 'price' => 2500]);
		Size::create(['name' => 'XX Large SuperHero T-Shirt', 'shortName' => 'XX Large', 'slug' => 'xxlarge-superhero-tshirt', 'productId' => 14, 'price' => 2500]);

		Size::create(['name' => 'Medium Comfort Hoody', 'shortName' => 'Medium', 'slug' => 'medium-comfort-hoodie', 'productId' => 15, 'price' => 4900]);
		Size::create(['name' => 'Large Comfort Hoody', 'shortName' => 'Large', 'slug' => 'large-comfort-hoodie', 'productId' => 15, 'price' => 4900]);
		Size::create(['name' => 'X Large Comfort Hoody', 'shortName' => 'X Large', 'slug' => 'xlarge-comfort-hoodie', 'productId' => 15, 'price' => 4900]);
		Size::create(['name' => 'XX Large Comfort Hoody', 'shortName' => 'XX Large', 'slug' => 'xxlarge-comfort-hoodie', 'productId' => 15, 'price' => 4900]);

		Size::create(['name' => 'SIX\'ER Band', 'shortName' => 'SIX\'ER Band', 'slug' => 'sixer-band', 'productId' => 12, 'price' => 1000]);
		Size::create(['name' => 'SEVEN\'ER Band', 'shortName' => 'SEVEN\'ER Band', 'slug' => 'sevener-band', 'productId' => 12, 'price' => 1200]);
		Size::create(['name' => 'EIGHT\'ER Band', 'shortName' => 'EIGHT\'ER Band', 'slug' => 'eighter-band', 'productId' => 12, 'price' => 1400]);
		Size::create(['name' => 'NINE\'ER Band', 'shortName' => 'NINE\'ER Band', 'slug' => 'niner-band', 'productId' => 12, 'price' => 1600]);
		Size::create(['name' => 'TEN\'ER Band', 'shortName' => 'TEN\'ER Band', 'slug' => 'tener-band', 'productId' => 12, 'price' => 1800]);


	}

}