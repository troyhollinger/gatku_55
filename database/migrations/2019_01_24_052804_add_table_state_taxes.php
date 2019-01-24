<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTableStateTaxes extends Migration {

    /**
     * Run the migrations.
     *
     * @return void || Exception
     */
    public function up()
    {
        $nowTime = new \DateTime();

        Schema::create('state_taxes', function(Blueprint $table) {
            $table->string('state')->unique();
            $table->float('tax');
            $table->timestamps();
            $table->primary('state');
        });

        // Insert default data to table: 'state_taxes'
        DB::table('state_taxes')->insert(
            [
                [
                    'state' => '-- Out of US',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Alabama',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Alaska',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Arizona',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Arkansas',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'California',
                    'tax' => 8.25,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Colorado',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Connecticut',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Delaware',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Florida',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Georgia',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Hawaii',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Idaho',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Illinois',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Indiana',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Iowa',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Kansas',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Kentucky',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Louisiana',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Maine',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Maryland',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Massachusetts',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Michigan',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Minnesota',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Mississippi',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Missouri',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Montana',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Nebraska',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Nevada',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'New Hampshire',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'New Jersey',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'New Mexico',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'New York',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'North Carolina',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'North Dakota',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Ohio',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Oklahoma',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Oregon',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Pennsylvania',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Rhode Island',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'South Carolina',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'South Dakota',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Tennessee',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Texas',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Utah',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Vermont',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Virginia',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Washington',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'West Virginia',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Wisconsin',
                    'tax' => 0,
                    'created_at' => $nowTime
                ],
                [
                    'state' => 'Wyoming',
                    'tax' => 0,
                    'created_at' => $nowTime
                ]
            ]

        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('state_taxes');
    }
}
