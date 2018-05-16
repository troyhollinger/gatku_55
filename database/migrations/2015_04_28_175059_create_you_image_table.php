<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateYouImageTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('you_images', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('image');
			$table->integer('productId')->unsigned()->nullable();
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
		Schema::drop('you_images');
	}

}
