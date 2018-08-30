<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddShelfFontSizeToShelvesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shelves', function(Blueprint $table)
        {
            $table->integer('desktop_shelf_font_size');
            $table->integer('mobile_shelf_font_size');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::table('products', function(Blueprint $table)
        {
            $table->dropColumn('desktop_shelf_font_size');
            $table->dropColumn('mobile_shelf_font_size');
        });
    }
}
