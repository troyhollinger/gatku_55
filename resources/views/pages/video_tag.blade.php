@extends('layouts.master')

@section('title')
{{ $homeSetting['page_title'] }}
@stop

@section('description')
Producing the highest quality polespears, heads, and accessories. Locally built in San Diego, used and loved worldwide.
@stop

@section('content')


	<style>
		div #myVideo {
			/*position: fixed;*/
			right: 0;
			bottom: 0;
			min-width: 100%;
			min-height: 100%;
			/*z-index: -99;*/
		}
	</style>




{{--<div class="hero" style="z-index: -99;">--}}

	<video autoplay muted loop playsinline controls id="myVideo">
		<source src="/videos/rain.mp4" type="video/mp4">
		Your browser does not support HTML5 video.
	</video>

<style>
	@media only screen and (max-width: 480px) {
		.gatku-home-banner{
			position: relative;
			background-image:url({!! $homeSetting['mobile_image'] !!});
		}
	}
	@media only screen and (min-width: 480px) {
	.gatku-home-banner{
			background-image:url({!! $homeSetting['image'] !!});
		}
	}

</style>

	<div class="slideshow" style="position:absolute; width: 100%; height: 100%; right: 0px; bottom: -200px; text-align: center; z-index: 999;">
		@if ( trim($homeSetting['slideshow_text_1']) )
			<div>
				<p class="hero-blurb hero-blurb-editable">{!! $homeSetting['slideshow_text_1'] !!}</p>
			</div>
		@endif

		@if ( trim($homeSetting['slideshow_text_2']) )
			<div>
				<p class="hero-blurb hero-blurb-editable">{!! $homeSetting['slideshow_text_2'] !!}</p>
			</div>
		@endif

		@if ( trim($homeSetting['slideshow_text_3']) )
			<div>
				<p class="hero-blurb hero-blurb-editable">{!! $homeSetting['slideshow_text_3'] !!}</p>
			</div>
		@endif

		@if ( trim($homeSetting['slideshow_text_4']) )
			<div>
				<p class="hero-blurb hero-blurb-editable">{!! $homeSetting['slideshow_text_4'] !!}</p>
			</div>
		@endif

		@if ( trim($homeSetting['slideshow_text_5']) )
		<div>
			<p class="hero-blurb hero-blurb-editable">{!! $homeSetting['slideshow_text_5'] !!}</p>
		</div>
		@endif
	</div>

	{{--<div class="home-image-info">--}}
		{{--<p class="live-till">{!! $homeSetting['image_info'] !!}</p>--}}
		{{--<p class="photo-credit">{!! $homeSetting['image_credit'] !!}</p>--}}
	{{--</div>--}}

{{--</div>--}}

<div class="store-section home-section" id="store" ng-cloak>

	<div class="home-container">

		@include('partials.store')

	</div>

</div>

@include('partials.contact')

@stop