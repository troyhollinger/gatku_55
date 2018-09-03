<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveColumnProductFontMultiplySizeFromHomeSettings extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('home_settings', function(Blueprint $table) {
            $table->dropColumn('product_font_multiply_size');
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
            $table->float('product_font_multiply_size');
        });
    }
}
