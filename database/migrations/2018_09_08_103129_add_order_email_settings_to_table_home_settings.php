<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOrderEmailSettingsToTableHomeSettings extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('home_settings', function(Blueprint $table) {
            $table->string('order_email_logo_url');
            $table->string('customer_order_email_title');
            $table->string('admin_order_email_title');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('home_settings', function(Blueprint $table)
        {
            $table->dropColumn('order_email_logo_url');
            $table->dropColumn('customer_order_email_title');
            $table->dropColumn('admin_order_email_title');
        });
    }
}
