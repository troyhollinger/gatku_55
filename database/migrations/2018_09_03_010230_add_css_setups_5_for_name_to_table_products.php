<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCssSetups5ForNameToTableProducts extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function(Blueprint $table) {
            $table->string('name_text_align_for_mobile');
            $table->string('name_font_weight_for_mobile');
            $table->string('name_font_style_for_mobile');
            $table->integer('name_font_size_for_mobile');

            $table->string('name_text_align_for_shelf');
            $table->string('name_font_weight_for_shelf');
            $table->string('name_font_style_for_shelf');
            $table->integer('name_font_size_for_shelf');

            $table->string('name_extension_font_weight_for_mobile');
            $table->string('name_extension_font_style_for_mobile');
            $table->integer('name_extension_font_size_for_mobile');

            $table->string('name_extension_font_weight_for_shelf');
            $table->string('name_extension_font_style_for_shelf');
            $table->integer('name_extension_font_size_for_shelf');

            $table->string('length_font_weight_for_mobile');
            $table->string('length_font_style_for_mobile');
            $table->integer('length_font_size_for_mobile');

            $table->string('length_font_weight_for_shelf');
            $table->string('length_font_style_for_shelf');
            $table->integer('length_font_size_for_shelf');
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
            $table->dropColumn('name_text_align_for_mobile');
            $table->dropColumn('name_font_weight_for_mobile');
            $table->dropColumn('name_font_style_for_mobile');
            $table->dropColumn('name_font_size_for_mobile');

            $table->dropColumn('name_text_align_for_shelf');
            $table->dropColumn('name_font_weight_for_shelf');
            $table->dropColumn('name_font_style_for_shelf');
            $table->dropColumn('name_font_size_for_shelf');

            $table->dropColumn('name_extension_font_weight_for_mobile');
            $table->dropColumn('name_extension_font_style_for_mobile');
            $table->dropColumn('name_extension_font_size_for_mobile');

            $table->dropColumn('name_extension_font_weight_for_shelf');
            $table->dropColumn('name_extension_font_style_for_shelf');
            $table->dropColumn('name_extension_font_size_for_shelf');

            $table->dropColumn('length_font_weight_for_mobile');
            $table->dropColumn('length_font_style_for_mobile');
            $table->dropColumn('length_font_size_for_mobile');

            $table->dropColumn('length_font_weight_for_shelf');
            $table->dropColumn('length_font_style_for_shelf');
            $table->dropColumn('length_font_size_for_shelf');
        });
    }
}
