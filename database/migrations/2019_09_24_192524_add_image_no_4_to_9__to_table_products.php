<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddImageNo4To9ToTableProducts extends Migration {

    /**
     * Run the migrations.
     *
     * @return void || Exception
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table) {
            $table->string('image_no_4');
            $table->string('image_no_5');
            $table->string('image_no_6');
            $table->string('image_no_7');
            $table->string('image_no_8');
            $table->string('image_no_9');
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
            $table->dropColumn('image_no_4');
            $table->dropColumn('image_no_5');
            $table->dropColumn('image_no_6');
            $table->dropColumn('image_no_7');
            $table->dropColumn('image_no_8');
            $table->dropColumn('image_no_9');
        });
    }
}
