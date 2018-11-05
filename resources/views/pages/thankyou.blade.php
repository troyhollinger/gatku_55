@extends('layouts.master')

@section('title')
Thank You For Your Purchase!
@stop

@section('content')


	<div class="thank-you-section" ng-controller="ThankYouPageController">
		<div class="thank-you-section-message">
			<h1>Thank You for Purchase!</h1>
			<h2>You will receive a confirmation email shortly.</h2>

			<br>
			<br>

			<uib-progressbar value="progress"></uib-progressbar>

		</div>

	</div>

{{--<div class="home-container product-store-section" id="store">--}}

	{{--@include('partials.store')--}}

{{--</div>--}}

{{--@include('partials.contact');--}}

@stop