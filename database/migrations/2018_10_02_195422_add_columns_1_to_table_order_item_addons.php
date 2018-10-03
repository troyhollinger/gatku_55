<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumns1ToTableOrderItemAddons extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_item_addons', function(Blueprint $table)
        {
            $table->tinyInteger('include_in_package');
            $table->tinyInteger('price_zero');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('order_item_addons', function(Blueprint $table) {
            $table->dropColumn('include_in_package');
            $table->dropColumn('price_zero');
        });
    }
}
