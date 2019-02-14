<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddShippingColumnToTableProducts extends Migration {

    /**
     * Run the migrations.
     *
     * @return void || Exception
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table) {
            $table->integer('shipping')->default(0);
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
            //Remove columns
            $table->dropColumn('shipping');
        });
    }
}
