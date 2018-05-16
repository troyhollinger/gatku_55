<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOrderFieldToProductsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//
		Schema::table('products', function(Blueprint $table)
		{
			
			$table->integer('order')->nullable();
			
		});
		
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//
		Schema::table('products', function(Blueprint $table)
		{
			$table->dropColumn('order');
			
		});
	}

}
