@extends('layouts.master')

@section('title')
	{{ config('page_title') }}
@stop

@section('description')
Producing the highest quality polespears, heads, and accessories. Locally built in San Diego, used and loved worldwide.
@stop

@section('content')

<div class="hero gatku-home-banner">

	<!-- Background video section -->
	@if ($homeSetting['display_video'])
		<div class="video_contain">
			<video autoplay muted loop playsinline>
				<source src="/videos/default_site_video.mp4" type="video/mp4">
			</video>
		</div>
	@else
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
	@endif
	<!-- Background video section - end -->

	<div class="slideshow">
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

	<div class="home-image-info">
		<p class="live-till">{!! $homeSetting['image_info'] !!}</p>
		<p class="photo-credit">{!! $homeSetting['image_credit'] !!}</p>
	</div>

</div>

<div class="store-section home-section" id="store" ng-cloak>

	<div class="home-container">

		@include('partials.store')

	</div>

</div>

@include('partials.contact')

@stop