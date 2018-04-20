<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('products', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('typeId')->unsigned();
			$table->foreign('typeId')->references('id')->on('product_types');
			$table->string('attachedImage')->nullable();
			$table->string('detachedImage')->nullable();
			$table->string('thumb');
			$table->string('name');
			$table->string('shortName');
			$table->string('slug');
			$table->integer('price');
			$table->text('description');
			$table->text('maneuverability')->nullable();
			$table->text('trajectory')->nullable();
			$table->text('balance')->nullable();
			$table->text('stealth')->nullable();
			$table->boolean('available')->default(true);
			$table->boolean('sizeable')->default(false);
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
		Schema::drop('products');
	}

}
