<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToTableOrders extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function(Blueprint $table) {
            $table->integer('discount_percentage');
            $table->integer('order_sum');
            $table->integer('shipping_cost');
            $table->integer('total_sum');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function(Blueprint $table)
        {
            $table->dropColumn('discount_percentage');
            $table->dropColumn('order_sum');
            $table->dropColumn('shipping_cost');
            $table->dropColumn('total_sum');
        });
    }
}
