<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAdditionalColumnsToTableHomeSettings extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('home_settings', function(Blueprint $table) {
            $table->float('product_font_multiply_size');
            $table->integer('shelves_between_space');
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
            $table->dropColumn('product_font_multiply_size');
            $table->dropColumn('shelves_between_space');
        });
    }
}
