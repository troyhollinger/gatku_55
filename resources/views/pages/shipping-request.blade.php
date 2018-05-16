@extends('layouts.master')


@section('content')


<div class="shipping-payment-panel" ng-controller="ShippingRequestPaymentController">

	<h2 ng-show="success === false">Hello {{ $request->order->customer->firstName }}, please fill out the form below to pay <span class="success">${{ $request->price / 100 }}</span> for International Shipping</h2>

	<form ng-if="success === false">
		<label for="card-number">Card Number</label>
		<input type="text" name="card-number" id="card-number" ng-model="card.number" placeholder="xxxx xxxx xxxx xxxx" cc-number cc-format>

		<span class="left">
			<label for="card-expiry-month">Expires</label>
			<input type="text" class="native" name="card-expiry-month" size="3" id="expire-month" ng-model="card.expiryMonth" placeholder="MM" cc-exp-month>
			<input type="text" class="native" name="card-expiry-year" size="5" id="expire-year" ng-model="card.expiryYear" placeholder="YYYY" cc-exp-year full-year>
		</span>
		
		<span class="left" style="margin-left:15px">
			<label for="card-security-code">CVC</label>
			<input type="text" class="native" size="5" name="card-security-code" id="card-secutiry-code" ng-model="card.securityCode" placeholder="000" cc-cvc>
		</span>
		
		<div class="clear"></div>

		<br>

		<div class="button success-bg" ng-click="pay()">Pay ${{ $request->price / 100 }} Shipping</div>

	</form>

	<div class="shipping-payment-success" ng-if="success" ng-cloak>

		<i class="fa fa-check-circle-o success"></i>

		<h3>Payment successful!</h3>
		<p>Your order will be on its say soon.</p>

	</div>

</div>




@stop