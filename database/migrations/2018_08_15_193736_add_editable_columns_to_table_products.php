<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB as DB;
use Gatku\Product;

class AddEditableColumnsToTableProducts extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table)
        {
            $table->string('editable_1_label');
            $table->string('editable_1');
            $table->string('editable_1_image');
            $table->string('editable_2_label');
            $table->string('editable_2');
            $table->string('editable_2_image');
            $table->string('editable_3_label');
            $table->string('editable_3');
            $table->string('editable_3_image');
            $table->string('editable_4_label');
            $table->string('editable_4');
            $table->string('editable_4_image');
        });

        Product::where('id', '>', 0)->update([
            "editable_1" => DB::raw("`maneuverability`"),
            "editable_2" => DB::raw("`trajectory`"),
            "editable_3" => DB::raw("`balance`"),
            "editable_4" => DB::raw("`stealth`"),
        ]);

        Schema::table('products', function(Blueprint $table)
        {
            $table->dropColumn('maneuverability');
            $table->dropColumn('trajectory');
            $table->dropColumn('balance');
            $table->dropColumn('stealth');
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
            $table->dropColumn('editable_1_label');
            $table->dropColumn('editable_1');
            $table->dropColumn('editable_1_image');
            $table->dropColumn('editable_2_label');
            $table->dropColumn('editable_2');
            $table->dropColumn('editable_2_image');
            $table->dropColumn('editable_3_label');
            $table->dropColumn('editable_3');
            $table->dropColumn('editable_3_image');
            $table->dropColumn('editable_4_label');
            $table->dropColumn('editable_4');
            $table->dropColumn('editable_4_image');
        });
    }
}
