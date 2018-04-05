@extends('layouts.master')

@section('title')
GATKU Polespears
@stop

@section('description')
Producing the highest quality polespears, heads, and accessories. Locally built in San Diego, used and loved worldwide.
@stop

@section('content')

<div class="hero gatku-home-banner">
<style>
	@media only screen and (max-width: 480px) {
		.gatku-home-banner{
			position: relative;
			background-image:url({{$homeSetting['mobile_image']}});
		}
	}
	@media only screen and (min-width: 480px) {
	.gatku-home-banner{
			background-image:url({{$homeSetting['image']}});
		}
	}

</style>
	<div class="slideshow">
		<div><p class="hero-blurb">The Highest Quality Polespears, Heads, and Accessories in the World.</p></div>
		<div><p class="hero-blurb">Designed and Made in CA, USA</p></div>
		<div><p class="hero-blurb">Used and Loved Worldwide.</p></div>
	</div>
	<div class="home-image-info">
		<p class="live-till">{{$homeSetting['image_info']}}</p>
		<p class="photo-credit">{{$homeSetting['image_credit']}}</p>
	</div>

</div>

<div class="store-section home-section" id="store" ng-cloak>

	<div class="home-container">

		@include('partials.store')

	</div>

</div>

@include('partials.contact')

@stop