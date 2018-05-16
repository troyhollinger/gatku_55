<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnPriceZeroToAddonsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//
		Schema::table('addons', function(Blueprint $table)
		{
			$table->boolean('price_zero')->default(false);
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
		Schema::table('addons', function(Blueprint $table)
		{
			//
			$table->dropColumn('price_zero');
		});
	}

}
