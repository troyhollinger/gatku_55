<?php

namespace App\Providers;

use Gatku\Model\HomeSetting;
use Illuminate\Support\ServiceProvider;

class HomeSettingsServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(HomeSetting::class, function ($app) {

            //@TODO Replace below line by call Repository method to load proper record.
            $homeSetting = HomeSetting::orderBy('id', 'desc')->first();

            //This is code to display proper thumb image in og tag og:image
            if (!config(['ogimage'])) {
                config(['ogimage' => $homeSetting['ogimage']]);

                //If no $homeSetting['ogimage'] then use mobile_image instead
                if (!$homeSetting['ogimage']) {
                    config(['ogimage' => $homeSetting['mobile_image']]);
                }
            }

            return $homeSetting;
        });
    }
}
