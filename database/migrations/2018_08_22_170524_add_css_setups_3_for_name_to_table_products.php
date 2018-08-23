<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCssSetups3ForNameToTableProducts extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table) {
            $table->integer('name_font_size');
            $table->integer('name_extension_font_size');
            $table->integer('length_font_size');
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
            $table->dropColumn('name_font_size');
            $table->dropColumn('name_extension_font_size');
            $table->dropColumn('length_font_size');
        });
    }
}
