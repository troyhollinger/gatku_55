<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProductDimensionsAndWeightToTableProducts extends Migration {

    /**
     * Run the migrations.
     *
     * @return void || Exception
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table) {
            $table->float('prod_length', 10, 4)->default(0);
            $table->float('prod_width', 10, 4)->default(0);
            $table->float('prod_height', 10, 4)->default(0);
            $table->float('prod_weight', 10, 4)->default(0);
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
            $table->dropColumn('prod_length');
            $table->dropColumn('prod_width');
            $table->dropColumn('prod_height');
            $table->dropColumn('prod_weight');
        });
    }
}
