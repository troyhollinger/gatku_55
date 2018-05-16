@extends('layouts.master')

<?php 

    /**
     * Create media asset grid from template
     *
     * @param associated array of uri values pointing to images.
     */
    function GridGenerator($array) {

        $build = '<div class="asset-arrangement-row top-row">
            <a href="' . asset($array['1']) . '" download><div class="media-square media-square-large" style="background-image:url(' . asset($array['1']) . ')"></div></a>
            <a href="' . asset($array['Th']) . '" download><div class="media-square media-square-thumb" style="background-image:url(' . asset($array['Th']) . ')"></div></a>
            <a href="' . asset($array['Thr']) . '" download><div class="media-rectangle media-rectangle-thumb" style="background-image:url(' . asset($array['Thr']) . ')"></div></a>
            <a href="' . asset($array['1r']) . '" download><div class="media-rectangle media-rectangle-large" style="background-image:url(' . asset($array['1r']) . ')"></div></a>
        </div>

        <div class="asset-arrangement-row bottom-row">
            <a href="' . asset($array['2r']) . '" download><div class="media-rectangle media-rectangle-large" style="background-image:url(' . asset($array['2r']) . ')"></div></a>
            <a href="' . asset($array['2']) . '" download><div class="media-square media-square-large" style="background-image:url(' . asset($array['2']) . ')"></div></a> 
        </div>';
        return $build;
    };

;?>


@section('content')


    <div class="container media-container" ng-controller="MediaController">

        <div>
            <div class="button info-bg" ng-click="toBrandPage()">Brand</div>
            <div class="button info-bg" ng-click="toProductPage()">Products</div>
        </div>

    
         <div class="media-module" ng-show="productPage" id="sigpar-media">
            <div class="container">
                <div class="media-column-left">
                    <?php echo GridGenerator([
                        '1' => 'img/downloads/signature-paralyzer-media/Signature_HiRes-1.jpg',
                        '2' => 'img/Square/HeadsCollection_HiRes-2.jpg',
                        '1r' => 'img/downloads/signature-paralyzer-media/Signature-RECT_HiRes-1r.jpg',
                        '2r' => 'img/Rectangle/HeadsCollection-RECT_HiRes-2r.jpg',
                        'Th' => 'img/downloads/signature-paralyzer-media/Signature_HiRes-1-th.jpg',
                        'Thr' => 'img/downloads/signature-paralyzer-media/Signature-RECT_HiRes-1r-th.jpg'
                    ])?>
                </div>

                <div class="media-column-right">
                    <p class="product-title">SIGNATURE <span class="title-subscript">/paralyzer</span></p>
                    <p class="product-description">When you download this it will include a product write up specific to our brand so please do not edit.
                        Also in this download are thumbnails for named product plus 2 hi-res photos both in square &amp; rectangle crops. Make sure you follow MSRP.</p>
                    <p class="fine-print">SMALLER FONT product information will help answer questions with consumer. If you need other assets from us
                        please contact us and we will try to meet your needs. Thank you for representing our product, please do so in a consistent way
                        to the guidelines provided here.</p>

                    <a href="{{ asset('/img/downloads/GATKU_SignatureParalyzer.zip') }}" download><div class="media-download-button success-bg"><p>Download</p></div></a>
                    <p class="media-download-info">Square Full + Thumb / Rectangle Full + Thumbnail / About Product .rtf file</p>

                </div>

                <div class="clear"></div>

            </div>
        </div>

        <div class="media-module" ng-show="productPage" id="barpar-media">
            <div class="container">
                <div class="media-column-left">
                    <?php echo GridGenerator([
                        '1' => 'img/downloads/barbed-paralyzer-media/Barbed_HiRes-1.jpg',
                        '2' => 'img/Square/HeadsCollection_HiRes-2.jpg',
                        '1r' => 'img/downloads/barbed-paralyzer-media/Barbed-RECT_HiRes-1r.jpg',
                        '2r' => 'img/Rectangle/HeadsCollection-RECT_HiRes-2r.jpg',
                        'Th' => 'img/downloads/barbed-paralyzer-media/Barbed_HiRes-1-th.jpg',
                        'Thr' => 'img/downloads/barbed-paralyzer-media/Barbed-RECT_HiRes-1r-th.jpg'
                    ])?>
                </div>

                <div class="media-column-right">
                    <p class="product-title">BARBED <span class="title-subscript">/paralyzer</span></p>
                    <p class="product-description">When you download this it will include a product write up specific to our brand so please do not edit.
                        Also in this download are thumbnails for named product plus 2 hi-res photos both in square &amp; rectangle crops. Make sure you follow MSRP.</p>
                    <p class="fine-print">SMALLER FONT product information will help answer questions with consumer. If you need other assets from us
                        please contact us and we will try to meet your needs. Thank you for representing our product, please do so in a consistent way
                        to the guidelines provided here.</p>

                    <a href="{{ asset('/img/downloads/GATKU_BarbedParalyzer.zip') }}" download><div class="media-download-button success-bg"><p>Download</p></div></a>
                    <p class="media-download-info">Square Full + Thumb / Rectangle Full + Thumbnail / About Product .rtf file</p>

                </div>

                <div class="clear"></div>
            </div>
        </div>

        <div class="media-module" ng-show="productPage" id="flopper-media">
            <div class="container">
                <div class="media-column-left">
                    <?php echo GridGenerator([
                        '1' => 'img/downloads/flopper-media/Flopper_HiRes-1.jpg',
                        '2' => 'img/Square/HeadsCollection_HiRes-2.jpg',
                        '1r' => 'img/downloads/flopper-media/Flopper-RECT_HiRes-1r.jpg',
                        '2r' => 'img/Rectangle/HeadsCollection-RECT_HiRes-2r.jpg',
                        'Th' => 'img/downloads/flopper-media/Flopper_HiRes-1-th.jpg',
                        'Thr' => 'img/downloads/flopper-media/Flopper-RECT_HiRes-1r-th.jpg'
                    ])?>
                </div>

                <div class="media-column-right">
                    <p class="product-title">FLOPPER</p>
                    <p class="product-description">When you download this it will include a product write up specific to our brand so please do not edit.
                        Also in this download are thumbnails for named product plus 2 hi-res photos both in square &amp; rectangle crops. Make sure you follow MSRP.</p>
                    <p class="fine-print">SMALLER FONT product information will help answer questions with consumer. If you need other assets from us
                        please contact us and we will try to meet your needs. Thank you for representing our product, please do so in a consistent way
                        to the guidelines provided here.</p>

                    <a href="{{ asset('/img/downloads/GATKU_Flopper.zip') }}" download><div class="media-download-button success-bg"><p>Download</p></div></a>
                    <p class="media-download-info">Square Full + Thumb / Rectangle Full + Thumbnail / About Product .rtf file</p>

                </div>

                <div class="clear"></div>
            </div>
        </div>

        <div class="media-module" ng-show="productPage" id="sliptip-media">
            <div class="container">
                <div class="media-column-left">
                    <?php echo GridGenerator([
                        '1' => 'img/downloads/slip-tip-media/SlipTip_HiRes-1.jpg',
                        '2' => 'img/Square/HeadsCollection_HiRes-2.jpg',
                        '1r' => 'img/downloads/slip-tip-media/SlipTip-RECT_HiRes-1r.jpg',
                        '2r' => 'img/Rectangle/HeadsCollection-RECT_HiRes-2r.jpg',
                        'Th' => 'img/downloads/slip-tip-media/SlipTip_HiRes-1-th.jpg',
                        'Thr' => 'img/downloads/slip-tip-media/SlipTip-RECT_HiRes-1r-th.jpg'
                    ])?>
                </div>

                <div class="media-column-right">
                    <p class="product-title">SLIPTIP</p>
                    <p class="product-description">When you download this it will include a product write up specific to our brand so please do not edit.
                        Also in this download are thumbnails for named product plus 2 hi-res photos both in square &amp; rectangle crops. Make sure you follow MSRP.</p>
                    <p class="fine-print">SMALLER FONT product information will help answer questions with consumer. If you need other assets from us
                        please contact us and we will try to meet your needs. Thank you for representing our product, please do so in a consistent way
                        to the guidelines provided here.</p>

                    <a href="{{ asset('/img/downloads/GATKU_SlipTip.zip') }}" download><div class="media-download-button success-bg"><p>Download</p></div></a>
                    <p class="media-download-info">Square Full + Thumb / Rectangle Full + Thumbnail / About Product .rtf file</p>

                </div>

                <div class="clear"></div>
            </div>
        </div>

        <div class="media-module" ng-show="productPage" id="inshore-shrinker-media">
            <div class="container">
                <div class="media-column-left">
                    <?php echo GridGenerator([
                        '1' => 'img/downloads/inshore-shrinker-media/InshoreShrinker_HiRes-1.jpg',
                        '2' => '',
                        '1r' => 'img/downloads/inshore-shrinker-media/InshoreShrinker-RECT_HiRes-1r.jpg',
                        '2r' => '',
                        'Th' => 'img/downloads/inshore-shrinker-media/InshoreShrinker_HiRes-1-th.jpg',
                        'Thr' => 'img/downloads/inshore-shrinker-media/InshoreShrinker-RECT_HiRes-1r-th.jpg'
                    ])?>
                </div>

                <div class="media-column-right">
                    <p class="product-title">INSHORE SHRINKER</p>
                    <p class="product-description">When you download this it will include a product write up specific to our brand so please do not edit.
                        Also in this download are thumbnails for named product plus 2 hi-res photos both in square &amp; rectangle crops. Make sure you follow MSRP.</p>
                    <p class="fine-print">SMALLER FONT product information will help answer questions with consumer. If you need other assets from us
                        please contact us and we will try to meet your needs. Thank you for representing our product, please do so in a consistent way
                        to the guidelines provided here.</p>

                    <a href="{{ asset('/img/downloads/GATKU_InshoreShrinker.zip') }}" download><div class="media-download-button success-bg"><p>Download</p></div></a>
                    <p class="media-download-info">Square Full + Thumb / Rectangle Full + Thumbnail / About Product .rtf file</p>

                </div>

                <div class="clear"></div>
            </div>
        </div>


        <div class="media-module" ng-show="productPage" id="polespear-media">
            <div class="container">
                <div class="media-column-left">
                    <?php echo GridGenerator([
                        '1' => 'img/downloads/polespear-media/Pole_HiRes-1.jpg',
                        '2' => 'img/Square/PolesCollection_HiRes-2.jpg',
                        '1r' => 'img/downloads/polespear-media/Pole-RECT_HiRes-1r.jpg',
                        '2r' => 'img/Rectangle/PolesCollection-RECT_HiRes-2r.jpg',
                        'Th' => 'img/downloads/polespear-media/Pole_HiRes-1-th.jpg',
                        'Thr' => 'img/downloads/polespear-media/Pole-RECT_HiRes-1r-th.jpg'
                    ])?>
                </div>

                <div class="media-column-right">
                    <p class="product-title">POLE<span style="font-weight:400;">SPEARS</span></p>
                    <p class="product-description">When you download this it will include a product write up for each of our poles SIX’ER, SEVEN’ER
                        EIGHT’ER, NINE’ER and TEN’ER. Each is specific to our brand so please do not edit. Also in this download is universal thumbnails for poles plus
                        2 hi-res photos both in square &amp; rectangle crops, also universal to all pole sizes. Make sure you follow MSRP.</p>
                    <p class="fine-print">SMALLER FONT product information will help answer questions   with consumer. If you need other assets from us
                        please contact us and we will try to meet your needs. Thank you for representing our product, please do so in a consistent way
                        to the guidelines provided here.</p>

                    <a href="{{ asset('/img/downloads/GATKU_Polespear.zip') }}" download><div class="media-download-button success-bg"><p>Download</p></div></a>
                    <p class="media-download-info">Square Full + Thumb / Rectangle Full + Thumbnail / About Product .rtf file</p>

                </div>

                <div class="clear"></div>
            </div>
        </div>


        <div class="brand-container" ng-show="brandPage">

            <div class="container">

                <div class="brand-logo-description brand-dark brand-left brand-padding-right">
                    <p>USE THIS ON <span class="bold">DARK</span> BACKGROUND &nbsp;-&nbsp; <a href="{{ asset('/img/media-page-assets/GATKU_LogoForDarkBG.png') }}" download>PNG</a> &nbsp;|&nbsp; <a href="{{ asset('/img/media-page-assets/GATKU_LogoForDarkBG.png') }}" download>SVG</a></p>
                </div>
                <div class="brand-logo-container brand-dark brand-left">
                    <img src="{{ asset('/img/media-page-assets/GATKU_LogoForDarkBG.png') }}">
                </div>
                <div class="brand-logo-container brand-light brand-left brand-padding-right">
                    <img src="{{ asset('/img/media-page-assets/GATKU_LogoForLightBG.png') }}">
                </div>
                <div class="brand-logo-description brand-light brand-left">
                    <p>USE THIS ON <span class="bold">LIGHT</span> BACKGROUND &nbsp;-&nbsp; <a href="{{ asset('/img/media-page-assets/GATKU_LogoForLightBG.png') }}" download>PNG</a> &nbsp;|&nbsp; <a href="{{ asset('/img/media-page-assets/GATKU_LogoForLightBG.png') }}" download>SVG</a></p>
                </div>

                <div class="brand-logo-caps brand-dark">
                    <p>ALL CAPS, NO DASH WHEN WRITING OUR NAME PLEASE : <span class="bold">GATKU</span></p>
                </div>
                <div class="brand-font-large brand-light brand-padding-right brand-left">
                    <img src="{{ asset('/img/media-page-assets/font-1.png') }}">
                </div>
                <div class="brand-font-small brand-light brand-left">
                    <img src="{{ asset('/img/media-page-assets/font-2.png') }}">
                </div>

                <div class="brand-color-block brand-dark">
                    <img src="{{ asset('/img/media-page-assets/off-black.png') }}">
                </div>
                <div class="brand-color-block brand-dim">
                    <img src="{{ asset('/img/media-page-assets/mid-gray.png') }}">
                </div>
                <div class="brand-color-block brand-light">
                    <img src="{{ asset('/img/media-page-assets/off-white.png') }}">
                </div>

                <div class="brand-mid-titles brand-dark brand-half-padding-right brand-left">
                    <p>BEST COLORS FOR OUR BRAND ^</p>
                </div>
                <div class="brand-mid-titles brand-dark brand-half-padding-left brand-left">
                    <p>EXAMPLES <sub>v</sub> </p>
                </div>

                <div class="brand-ad-examples brand-light brand-half-padding-right brand-left" style="background-image:url({{ asset('/img/media-page-assets/triumph.jpg') }})"></div>
                <div class="brand-ad-examples brand-light brand-half-padding-left brand-left" style="background-image:url({{ asset('/img/media-page-assets/dive.jpg') }})"></div>

                <div class="brand-logo-caps brand-dark">
                    <p>- mute colors accentuate our trademark red poles - a key brand element -</p>
                </div>

                <div class="brand-abstract-logo-container brand-light brand-left brand-half-padding-right">
                    <img src="{{  asset('/img/media-page-assets/GATKU_AbstractForLightBG.png') }}">
                </div>
                <div class="brand-abstract-logo-description brand-light brand-left brand-half-padding-left">
                    <p>NEW <span class="bold">ABSTRACT</span> SYMBOL &nbsp;-&nbsp; <a href="{{ asset('/img/media-page-assets/GATKU_AbsractForLightBG.png') }}">PNG</a> &nbsp;|&nbsp; <a href="{{ asset('/img/media-page-assets/GATKU_AbsractForLightBG.png') }}">SVG</a></p>
                </div>
                <div class="brand-abstract-logo-container brand-dark brand-right brand-half-padding-left">
                    <img src="{{  asset('/img/media-page-assets/GATKU_AbstractForDarkBG.png') }}">
                </div>
                <div class="brand-abstract-logo-description brand-dark brand-left brand-half-padding-right">
                    <p>NEW <span class="bold">ABSTRACT</span> SYMBOL &nbsp;-&nbsp; <a href="{{ asset('/img/media-page-assets/GATKU_AbsractForDarkBG.png') }}">PNG</a> &nbsp;|&nbsp; <a href="{{ asset('/img/media-page-assets/GATKU_AbsractForDarkBG.png') }}">SVG</a></p>
                </div>

                <div class="brand-slogan brand-light">
                    <img src="{{ asset('/img/media-page-assets/slogan.png') }}">
                </div>

            </div>

        </div>

    </div>

@stop


























