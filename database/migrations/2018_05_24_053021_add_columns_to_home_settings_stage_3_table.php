<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsToHomeSettingsStage3Table extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('home_settings', function(Blueprint $table)
        {
            $table->string('contact_title');
            $table->string('contact_message');
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
            $table->dropColumn('contact_title');
            $table->dropColumn('contact_message');
        });
    }

}
