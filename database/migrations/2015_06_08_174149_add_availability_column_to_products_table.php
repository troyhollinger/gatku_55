<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAvailabilityColumnToProductsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('products', function(Blueprint $table) {
			
			$table->integer('availabilityTypeId')->unsigned()->nullable();
			$table->foreign('availabilityTypeId')->references('id')->on('availability_types');

		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('products', function(Blueprint $table)
		{
			
			$table->dropForeign('products_availabilitytypeid_foreign');
			$table->dropColumn('availabilityTypeId');

		});
	}

}
