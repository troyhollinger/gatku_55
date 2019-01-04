<?php
//This is hack to display proper thumb image
if (!isset($ogimage) || !$ogimage) {
    $ogimage = $homeSetting['mobile_image'];
}
?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>{!! $homeSetting['page_title'] !!}</title>
        <meta name="description" content="@yield('description')">
        <meta property="og:title" content="{!! $homeSetting['page_title'] !!}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://gatku.com/">
        <meta property="og:image" content="{{ asset( $ogimage ) }}" />
        <meta property="og:description" content="@yield('description')">
        <meta property="og:site_name" content="{!! $homeSetting['page_title'] !!}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!--
        /**
         * @license
         * MyFonts Webfont Build ID 3325386, 2016-12-28T12:39:52-0500
         *
         * The fonts listed in this notice are subject to the End User License
         * Agreement(s) entered into by the website owner. All other parties are
         * explicitly restricted from using the Licensed Webfonts(s).
         *
         * You may obtain a valid license at the URLs below.
         *
         * Webfont: HelveticaLTPro-Black by Linotype
         * URL: http://www.myfonts.com/fonts/linotype/helvetica/pro-black/
         * Copyright: Part of the digitally encoded machine readable outline data for producing
         * the Typefaces provided is copyrighted &#x00A9; 1981 - 2007 Linotype GmbH,
         * www.linotype.com. All rights reserved. This software is the property of Linotype
         * GmbH, and may not be repro
         * Licensed pageviews: 250,000
         *
         *
         * License: http://www.myfonts.com/viewlicense?type=web&buildid=3325386
         *
         * © 2016 MyFonts Inc
        */

        -->

        <script>
            //@TODO Move set this variables somewhere else.
            var currentRoute = '{!! Route::currentRouteName() !!}';
            var layoutType = {!! Route::currentRouteName() === 'product.show' ? "'" . $product->type->slug . "'" : "null;" !!};
            var slug = {!! Route::currentRouteName() === 'product.show' ? "'" . $product->slug . "'" : "null;" !!};
            var CONFIG = {
                base : '{!! URL::to("/") !!}',
                environment : '{!! App::environment() !!}'
            };
            var homeSetting = {!! $homeSetting !!};
        </script>

        <!-- Bugsnag for JavaScript See: https://docs.bugsnag.com/platforms/browsers/js/ -->
        <script src="//d2wy8f7a9ursnm.cloudfront.net/v4/bugsnag.min.js"></script>
        <script>
            window.bugsnagClient = bugsnag({
                apiKey: 'a76deca11eb34ca6b18e6010ec00a39d',
                notifyReleaseStages: ['production', 'qa', 'QA'],
                releaseStage: CONFIG.environment
            });
        </script>
        <!-- Bugsnag configuration - end -->

        <link rel="stylesheet" href="{{ asset('production/app.css?v=' . config('app_version.version') ) }}">
        <script src="{{ asset('js/vendor/modernizr-2.6.2.min.js?v=' . config('app_version.version') ) }}"></script>

        <!-- Load main app.js -->
        <script src="{!! asset('production/app.js?v=' . config('app_version.version')) !!}"></script>

        <!-- FRESHCHAT WIDGET - loading - start -->
        <script src="https://wchat.freshchat.com/js/widget.js"></script>
        <!-- FRESHCHAT WIDGET - loading - end -->

        @if(Route::currentRouteName() === 'product.show')
        <script>
            var productId = '{!! $product->id !!}';
            var productSlug = '{!! $product->slug !!}';
        </script>
        @endif

        @if(Route::currentRouteName() === 'shipping-request.show')
        <script>
            var shippingRequestId = '{!! $request->id !!}';
            var shippingRequestFullName = '{!! $request->order->customer->fullName !!}'
        </script>
        @endif

        <!-- This is css created dynamically based on settings in admin section -->
        <style>
            .hero-blurb-editable {
                @if ( trim($homeSetting['slideshow_text_color_css']) )
                color: {!! $homeSetting['slideshow_text_color_css'] !!};
                @else
                color: #ffffff;
                @endif

                @if ( trim($homeSetting['slideshow_text_shadow_css']) )
                text-shadow: {!! $homeSetting['slideshow_text_shadow_css'] !!};
                @endif
            }

            .below-fold {
                background-image: url( ' {!! $homeSetting["top_stripe_background_image_url"] !!}');
            }
        </style>
        <!-- This is css created dynamically based on settings in admin section - end -->
    </head>
    @if(Route::currentRouteName() === 'product.show')
    <body ng-app="gatku" ng-controller="ProductController" body-freeze>
    @elseif(Route::currentRouteName() === 'admin.index')
    <body ng-app="gatku" class="admin-body" body-freeze>
    @else
    <body ng-app="gatku" body-freeze>
    @endif

        @include('partials.nav')

        <div>
            <!--[if lt IE 8]>
                <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
            <![endif]-->
            @include('partials.cart')
            @yield('content')
        </div>

        <alerter></alerter>

        <script type="text/javascript" src="https://js.stripe.com/v2/"></script>

        @if(App::environment('production'))

            @if ( trim($homeSetting['ga_tracking_id']) )
            <script>
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
              ga('create', '{{ trim($homeSetting['ga_tracking_id']) }}', 'auto');
              ga('send', 'pageview');
            </script>
            @endif

            @if(Route::currentRouteName() !== 'admin.index')
                <!-- FRESHCHAT WIDGET - loading - start -->
                <script>
                    window.fcWidget.init({
                        token: "967edb4c-f6d8-4209-9700-964f03b1fe1d",
                        host: "https://wchat.freshchat.com"
                    });
                </script>
                <!-- FRESHCHAT WIDGET - loading - start -->
            @endif
            
        @endif


    </body>
</html>
