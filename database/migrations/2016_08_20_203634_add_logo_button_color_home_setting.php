<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLogoButtonColorHomeSetting extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('home_settings', function(Blueprint $table)
		{
			
			$table->string('logo')->nullable();
			$table->string('button_color')->nullable();
			
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
			$table->dropColumn('logo');
			$table->dropColumn('button_color');
		});
	}

}
