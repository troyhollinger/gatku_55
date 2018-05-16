<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShippingTracksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//
		//
		Schema::create('shipping_tracks', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('track_id');
			$table->integer('orderId')->unsigned();
			$table->foreign('orderId')->references('id')->on('orders');
			$table->string('token');
			$table->timestamps();
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
	}

}
