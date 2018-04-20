<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnIncludeInPackageToAddonsTable extends Migration {

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
			$table->boolean('include_in_package')->default(false);
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
			$table->dropColumn('include_in_package');
		});
	}

}
