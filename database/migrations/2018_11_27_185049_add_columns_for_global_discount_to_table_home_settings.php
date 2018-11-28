<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsForGlobalDiscountToTableHomeSettings extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('home_settings', function(Blueprint $table) {
            //Remove column
            $table->dropColumn('black_friday');

            //Add columns
            $table->integer('global_discount_switch');
            $table->integer('global_discount_percentage');
            $table->string('global_discount_name');
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
            //Remove columns
            $table->dropColumn('global_discount_switch');
            $table->dropColumn('global_discount_percentage');
            $table->dropColumn('global_discount_name');

            //Bring back removed column
            $table->integer('black_friday');
        });
    }
}
