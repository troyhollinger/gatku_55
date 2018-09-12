<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTableEmailSettings extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('email_settings', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('email_main_logo_url');
            $table->string('email_small_logo_url');
            $table->string('customer_order_email_title');
            $table->string('customer_order_notify_email_1');
            $table->string('customer_order_notify_name_1');
            $table->string('customer_order_notify_email_2');
            $table->string('customer_order_notify_name_2');
            $table->string('customer_order_notify_email_3');
            $table->string('customer_order_notify_name_3');
            $table->string('customer_order_notify_email_4');
            $table->string('customer_order_notify_name_4');
            $table->string('customer_order_notify_email_5');
            $table->string('customer_order_notify_name_5');
            $table->string('admin_order_email_title');
            $table->string('admin_order_notify_email_1');
            $table->string('admin_order_notify_name_1');
            $table->string('admin_order_notify_email_2');
            $table->string('admin_order_notify_name_2');
            $table->string('admin_order_notify_email_3');
            $table->string('admin_order_notify_name_3');
            $table->string('admin_order_notify_email_4');
            $table->string('admin_order_notify_name_4');
            $table->string('admin_order_notify_email_5');
            $table->string('admin_order_notify_name_5');
            $table->string('email_footer_color');
            $table->string('contact_email_address_displayed_in_email');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('email_settings');
    }

}
