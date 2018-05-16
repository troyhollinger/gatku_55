<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWishlistItemsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('wishlist_items', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('wishlistId')->unsigned();
			$table->foreign('wishlistId')->references('id')->on('wishlists')->onDelete('cascade');
			$table->integer('productId')->unsigned();
			$table->foreign('productId')->references('id')->on('products')->onDelete('cascade');
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
		Schema::drop('wishlist_items');
	}

}
