<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCssSetups4ForNameToTableProducts extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table) {
            $table->string('mobile_name_text_align');
            $table->string('mobile_name_font_style');
            $table->string('mobile_name_font_weight');
            $table->integer('mobile_name_font_size');
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
            $table->dropColumn('mobile_name_text_align');
            $table->dropColumn('mobile_name_font_style');
            $table->dropColumn('mobile_name_font_weight');
            $table->dropColumn('mobile_name_font_size');
        });
    }
}
