<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSizeColumnToOrderItemAddonsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('order_item_addons', function(Blueprint $table) {
			
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
		Schema::table('order_item_addons', function(Blueprint $table) {
			
			$table->dropForeign('order_item_addons_sizeid_foreign');
			$table->dropColumn('sizeId');

		});
	}

}
