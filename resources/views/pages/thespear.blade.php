@extends('layouts.master')

@section('title')
Gatku | Thespear
@stop

@section('content')

	<div class="hero gatku-home-banner">
<style>
	@media only screen and (max-width: 480px) {
		.gatku-home-banner{
			position: relative;
			background-image:url({{$thespear['mobile_image']}});
		}
	}
	@media only screen and (min-width: 480px) {
	.gatku-home-banner{
			background-image:url({{$thespear['image']}});
		}
	}

</style>
<div class="home_banner_text_thespear">
	<img src="img/the_spear.png" alt="GATKU" title="GATKU">
</div>
</div>
@include('partials.thespear')

@stop

