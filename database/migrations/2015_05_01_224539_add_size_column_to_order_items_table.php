<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSizeColumnToOrderItemsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('order_items', function(Blueprint $table) {

			$table->integer('sizeId')->unsigned()->nullable();
			$table->foreign('sizeId')->references('id')->on('sizes');
			
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('order_items', function(Blueprint $table) {
			
			$table->dropForeign('order_items_sizeid_foreign');
			$table->dropColumn('sizeId');

		});
	}

}
