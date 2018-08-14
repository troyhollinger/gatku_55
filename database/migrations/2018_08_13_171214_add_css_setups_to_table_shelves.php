<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCssSetupsToTableShelves extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shelves', function(Blueprint $table)
        {
            $table->string('name_text_align');
            $table->string('name_font_style');
            $table->string('name_font_weight');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shelves', function(Blueprint $table)
        {
            $table->dropColumn('name_text_align');
            $table->dropColumn('name_font_style');
            $table->dropColumn('name_font_weight');
        });
    }

}
