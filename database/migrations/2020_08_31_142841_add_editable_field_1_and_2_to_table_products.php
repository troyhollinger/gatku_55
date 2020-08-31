<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddEditableField1And2ToTableProducts extends Migration {

    /**
     * Run the migrations.
     *
     * @return void || Exception
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table) {
            $table->string('editable_field_1');
            $table->string('editable_field_2');
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
            $table->dropColumn('editable_field_1');
            $table->dropColumn('editable_field_2');
        });
    }
}
