<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCssSetups2ForNameToTableProducts extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table) {
            $table->string('name_extension_font_style');
            $table->string('name_extension_font_weight');

            $table->string('length_font_style');
            $table->string('length_font_weight');
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
            $table->dropColumn('name_extension_font_style');
            $table->dropColumn('name_extension_font_weight');

            $table->dropColumn('length_font_style');
            $table->dropColumn('length_font_weight');
        });
    }
}
