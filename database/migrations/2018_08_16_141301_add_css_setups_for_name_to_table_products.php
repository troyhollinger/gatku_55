<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCssSetupsForNameToTableProducts extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table) {
            $table->string('name_text_align');
            $table->string('name_font_style');
            $table->string('name_font_weight');
        });

        Schema::table('products', function(Blueprint $table)
        {
            $table->dropColumn('name_alignment');
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
            $table->dropColumn('name_text_align');
            $table->dropColumn('name_font_style');
            $table->dropColumn('name_font_weight');
        });

        Schema::table('products', function(Blueprint $table)
        {
            $table->string('name_alignment');
        });
    }
}
