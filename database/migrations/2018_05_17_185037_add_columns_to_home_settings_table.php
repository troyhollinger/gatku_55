<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsToHomeSettingsTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('home_settings', function(Blueprint $table)
        {
            $table->string('facebook_url');
            $table->string('twitter_url');
            $table->string('instagram_url');
            $table->string('youtube_url');
            $table->string('address_us');
            $table->string('address_au');
            $table->string('email_html');
            $table->string('phone_html');
            $table->string('desktop_copyright_html');
            $table->string('mobile_copyright_html');
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
            $table->dropColumn('facebook_url');
            $table->dropColumn('twitter_url');
            $table->dropColumn('instagram_url');
            $table->dropColumn('youtube_url');
            $table->dropColumn('address_us');
            $table->dropColumn('address_au');
            $table->dropColumn('email_html');
            $table->dropColumn('phone_html');
            $table->dropColumn('desktop_copyright_html');
            $table->dropColumn('mobile_copyright_html');
        });
    }

}
