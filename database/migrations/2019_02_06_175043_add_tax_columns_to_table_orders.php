<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTaxColumnsToTableOrders extends Migration {

    /**
     * Run the migrations.
     *
     * @return void || Exception
     */
    public function up()
    {
        Schema::table('orders', function(Blueprint $table) {
            $table->float('sales_tax')->default(0);
            $table->integer('tax_amount')->default(0);
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
            //Remove columns
            $table->dropColumn('sales_tax');
            $table->dropColumn('tax_amount');
        });
    }
}
