<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsToHomeSettingsStage2Table extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('home_settings', function(Blueprint $table)
        {
            $table->string('contact_image');
            $table->string('contact_desktop_logo_url');
            $table->string('contact_mobile_logo_url');

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
            //
            $table->dropColumn('contact_image');
            $table->dropColumn('contact_desktop_logo_url');
            $table->dropColumn('contact_mobile_logo_url');
        });
    }

}
