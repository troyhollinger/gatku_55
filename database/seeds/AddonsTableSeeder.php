<?php

// Composer: "fzaninotto/faker": "v1.3.0"
use Faker\Factory as Faker;

use Illuminate\Database\Seeder;
use Gatku\Model\Addon;

class AddonsTableSeeder extends Seeder {

	public function run()
	{
		
		Addon::create( [
		'parentId'=>5,
		'childId'=>1,
		] );
					
		Addon::create( [
		'parentId'=>5,
		'childId'=>2,
		] );
					
		Addon::create( [
		'parentId'=>5,
		'childId'=>4,
		] );
					
		Addon::create( [
		'parentId'=>5,
		'childId'=>10,
		] );
					
		Addon::create( [
		'parentId'=>5,
		'childId'=>11,
		] );
							
		Addon::create( [
		'parentId'=>5,
		'childId'=>16,
		] );
					
		Addon::create( [
		'parentId'=>6,
		'childId'=>1,
		] );
					
		Addon::create( [
		'parentId'=>6,
		'childId'=>2,
		] );
					
		Addon::create( [
		'parentId'=>6,
		'childId'=>4,
		] );
					
		Addon::create( [
		'parentId'=>6,
		'childId'=>10,
		] );
					
		Addon::create( [
		'parentId'=>6,
		'childId'=>11,
		] );
								
		Addon::create( [
		'parentId'=>6,
		'childId'=>16,
		] );
					
		Addon::create( [
		'parentId'=>7,
		'childId'=>2,
		] );
					
		Addon::create( [
		'parentId'=>7,
		'childId'=>3,
		] );
					
		Addon::create( [
		'parentId'=>7,
		'childId'=>4,
		] );
					
		Addon::create( [
		'parentId'=>7,
		'childId'=>10,
		] );
											
		Addon::create( [
		'parentId'=>7,
		'childId'=>16,
		] );
					
		Addon::create( [
		'parentId'=>8,
		'childId'=>2,
		] );
					
		Addon::create( [
		'parentId'=>8,
		'childId'=>3,
		] );
					
		Addon::create( [
		'parentId'=>8,
		'childId'=>10,
		] );
					
		Addon::create( [
		'parentId'=>8,
		'childId'=>11,
		] );
											
		Addon::create( [
		'parentId'=>8,
		'childId'=>13,
		] );
					
		Addon::create( [
		'parentId'=>8,
		'childId'=>16,
		] );
					
		Addon::create( [
		'parentId'=>9,
		'childId'=>1,
		] );
					
		Addon::create( [
		'parentId'=>9,
		'childId'=>2,
		] );
					
		Addon::create( [
		'parentId'=>9,
		'childId'=>3,
		] );
					
		Addon::create( [
		'parentId'=>9,
		'childId'=>10,
		] );
					
		Addon::create( [
		'parentId'=>9,
		'childId'=>11,
		] );
									
		Addon::create( [
		'parentId'=>9,
		'childId'=>16,
		] );
					
		Addon::create( [
		'parentId'=>1,
		'childId'=>2,
		] );
					
		Addon::create( [
		'parentId'=>1,
		'childId'=>3,
		] );
					
		Addon::create( [
		'parentId'=>1,
		'childId'=>10,
		] );
					
		Addon::create( [
		'parentId'=>1,
		'childId'=>11,
		] );
											
		Addon::create( [
		'parentId'=>2,
		'childId'=>1,
		] );
					
		Addon::create( [
		'parentId'=>2,
		'childId'=>3,
		] );
					
		Addon::create( [
		'parentId'=>2,
		'childId'=>10,
		] );
					
		Addon::create( [
		'parentId'=>2,
		'childId'=>11,
		] );
												
		Addon::create( [
		'parentId'=>3,
		'childId'=>1,
		] );
					
		Addon::create( [
		'parentId'=>3,
		'childId'=>2,
		] );
					
		Addon::create( [
		'parentId'=>3,
		'childId'=>10,
		] );
					
		Addon::create( [
		'parentId'=>3,
		'childId'=>11,
		] );
							
		Addon::create( [
		'parentId'=>4,
		'childId'=>1,
		] );
					
		Addon::create( [
		'parentId'=>4,
		'childId'=>2,
		] );
					
		Addon::create( [
		'parentId'=>4,
		'childId'=>3,
		] );
					
		Addon::create( [
		'parentId'=>4,
		'childId'=>10,
		] );
					
		Addon::create( [
		'parentId'=>4,
		'childId'=>11,
		] );
										
		Addon::create( [
		'parentId'=>10,
		'childId'=>1,
		] );
					
		Addon::create( [
		'parentId'=>10,
		'childId'=>2,
		] );
					
		Addon::create( [
		'parentId'=>10,
		'childId'=>4,
		] );
					
		Addon::create( [
		'parentId'=>10,
		'childId'=>11,
		] );
										
		Addon::create( [
		'parentId'=>11,
		'childId'=>1,
		] );
					
		Addon::create( [
		'parentId'=>11,
		'childId'=>2,
		] );
					
		Addon::create( [
		'parentId'=>11,
		'childId'=>10,
		] );

	}

}