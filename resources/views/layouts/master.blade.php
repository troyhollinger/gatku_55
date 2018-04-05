<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>@yield('title')</title>
        <meta name="description" content="@yield('description')">
        <meta property="og:title" content="GATKU Polespears">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://gatku.com/">
        <meta property="og:image" content="{{ asset('img/fbscreenshot.jpg') }}" />
        <meta property="og:description" content="@yield('description')">
        <meta property="og:site_name" content="GATKU">
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
        <link rel="stylesheet" href="{{ asset('production/app.css') }}">
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
         <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <script>window.jQuery || document.write('<script src="{{ asset('js/vendor/jquery-1.10.2.min.js') }}"><\/script>')</script>
        <script src="{{ asset('bower_components/angular/angular.min.js') }}"></script>
        <script src="{{ asset('js/vendor/modernizr-2.6.2.min.js') }}"></script>
        <script>
            var currentRoute = '{{ Route::currentRouteName() }}';
            var layoutType = {{ Route::currentRouteName() === 'product.show' ? "'" . $product->type->slug . "'" : "null;" }};
            var slug = {{ Route::currentRouteName() === 'product.show' ? "'" . $product->slug . "'" : "null;" }};
            var CONFIG = {

                base : '{{ URL::to("/") }}',
                environment : '{{ App::environment() }}'

            }

        </script>
        @if(Route::currentRouteName() === 'product.show')
        <script>
            var productId = '{{ $product->id }}';
            var productSlug = '{{ $product->slug }}';
        </script>
        @endif

        @if(Route::currentRouteName() === 'shipping-request.show')
        <script>
            var shippingRequestId = '{{ $request->id }}';
            var shippingRequestFullName = '{{ $request->order->customer->fullName }}'
        </script>
        @endif
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
        <script src="{{ asset('bower_components/ng-file-upload/angular-file-upload.js') }}"></script>
        @if(isset($product) && $product->type->slug === 'apparel')
        <script src="{{ asset('bower_components/rollerblade/rollerblade.min.js') }}"></script>
        @endif
        <script src="{{ asset('production/app.js') }}"></script>

        @if(App::environment('production'))
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
          ga('create', 'UA-46881632-1', 'auto');
          ga('send', 'pageview');
        </script>
        @endif
    </body>
</html>
