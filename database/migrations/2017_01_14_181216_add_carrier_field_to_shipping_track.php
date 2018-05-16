<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCarrierFieldToShippingTrack extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//
		Schema::table('shipping_tracks', function(Blueprint $table)
		{
			
			$table->string('carrier')->nullable();
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
		Schema::table('shipping_tracks', function(Blueprint $table)
		{
			//
			$table->dropColumn('carrier');
		});
	}

}
