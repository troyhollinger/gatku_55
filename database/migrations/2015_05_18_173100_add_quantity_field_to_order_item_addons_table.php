<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddQuantityFieldToOrderItemAddonsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('order_item_addons', function(Blueprint $table)
		{
			
			$table->integer('quantity')->unsigned()->default(1);

		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('order_item_addons', function(Blueprint $table)
		{
			
			$table->dropColumn('quantity');

		});
	}

}
