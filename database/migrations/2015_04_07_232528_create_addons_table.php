<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAddonsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('addons', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('parentId')->unsigned();
			$table->foreign('parentId')->references('id')->on('products')->onDelete('cascade');
			$table->integer('childId')->unsigned();
			$table->foreign('childId')->references('id')->on('products')->onDelete('cascade');
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
		Schema::drop('addons');
	}

}
