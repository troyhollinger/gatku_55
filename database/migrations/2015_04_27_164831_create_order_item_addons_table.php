<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrderItemAddonsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('order_item_addons', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('orderItemId')->unsigned();
			$table->foreign('orderItemId')->references('id')->on('order_items')->onDelete('cascade');
			$table->integer('productId')->unsigned();
			$table->foreign('productId')->references('id')->on('products');
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
		Schema::drop('order_item_addons');
	}

}
