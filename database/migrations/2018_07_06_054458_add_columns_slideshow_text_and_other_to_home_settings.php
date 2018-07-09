<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsSlideshowTextAndOtherToHomeSettings extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('home_settings', function(Blueprint $table)
        {
            $table->string('slideshow_text_1');
            $table->string('slideshow_text_2');
            $table->string('slideshow_text_3');
            $table->string('slideshow_text_4');
            $table->string('slideshow_text_5');
            $table->string('slideshow_text_color_css');
            $table->string('slideshow_text_shadow_css');
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
            $table->dropColumn('slideshow_text_1');
            $table->dropColumn('slideshow_text_2');
            $table->dropColumn('slideshow_text_3');
            $table->dropColumn('slideshow_text_4');
            $table->dropColumn('slideshow_text_5');
            $table->dropColumn('slideshow_text_color_css');
            $table->dropColumn('slideshow_text_shadow_css');
        });
    }

}
