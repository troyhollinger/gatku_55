<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShippingRequestsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('shipping_requests', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('price');
			$table->integer('orderId')->unsigned();
			$table->foreign('orderId')->references('id')->on('orders');
			$table->string('token');
			$table->boolean('paid')->default(false);
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
		Schema::drop('shipping_requests');
	}

}
