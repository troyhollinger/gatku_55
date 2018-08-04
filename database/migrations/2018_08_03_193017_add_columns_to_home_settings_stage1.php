<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsToHomeSettingsStage1 extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('home_settings', function(Blueprint $table)
        {
            $table->string('page_title');
            $table->string('top_stripe_background_image_url');
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
            $table->dropColumn('page_title');
            $table->dropColumn('top_stripe_background_image_url');
        });
    }

}
