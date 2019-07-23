<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProductTemplateColumnToTableProducts extends Migration {

    /**
     * Run the migrations.
     *
     * @return void || Exception
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table) {
            $table->string('template')->default('template_1');
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
            $table->dropColumn('template');
        });
    }
}
