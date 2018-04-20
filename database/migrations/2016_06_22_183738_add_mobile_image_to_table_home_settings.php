<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMobileImageToTableHomeSettings extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('home_settings', function(Blueprint $table)
		{
			
			$table->string('mobile_image')->nullable();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('home_settings', function(Blueprint $table)
		{
			//
			$table->dropColumn('mobile_image');
		});
	}

}
