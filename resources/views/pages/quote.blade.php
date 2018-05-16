@extends('layouts.master')

@section('title')
Shipping Quote | GATKU Polespears
@stop

@section('content')

<div class="container" ng-controller="QuoteFormController">

	<form name="quoteForm" class="quote-form-container" ng-hide="success">
		
		<h1>International Shipping Rate Inquiry</h1>

		<div class="column-left">

			<label for="name">Name</label>
			<input type="text" id="name" name="name" ng-model="form.name" ng-class="{ 'invalid' : quoteForm.name.$invalid && submitAttempted === true }" required>

			<label for="email">Email</label>
			<input type="text" id="email" name="email" ng-model="form.email" ng-class="{ 'invalid' : quoteForm.email.$invalid && submitAttempted === true }" required>

			<label for="phone">Phone Number</label>
			<input type="text" id="phone" name="phone" ng-model="form.phone">

			<label for="address">Address to be shipped to.</label>
			<input type="text" id="address" name="address" ng-model="form.address" ng-class="{ 'invalid' : quoteForm.address.$invalid && submitAttempted === true }" required>

			<label for="city">City</label>
			<input type="text" id="city" name="city" ng-model="form.city" ng-class="{ 'invalid' : quoteForm.city.$invalid && submitAttempted === true }" required>

			<label for="state">State / Province</label>
			<input type="text" id="state" name="state" ng-model="form.state" ng-class="{ 'invalid' : quoteForm.state.$invalid && submitAttempted === true }" required>

			<label for="zip">Zip</label>
			<input type="text" id="zip" name="zip" ng-model="form.zip" ng-class="{ 'invalid' : quoteForm.zip.$invalid && submitAttempted === true }" required>

			<label for="country">Country</label>
			<input type="text" id="country" name="country" ng-model="form.country" ng-class="{ 'invalid' : quoteForm.country.$invalid && submitAttempted === true }" required>

		</div>

		<div class="column-right">

			<label for="amount">How Many Polespears?</label>
			<input type="number" id="amount" name="amount" ng-model="form.amountOfPolespears" ng-class="{ 'invalid' : quoteForm.amount.$invalid && submitAttempted === true }" required>

			<div ng-hide="hidePoleChooser">
				<label for="longest">Choose Longest Pole</label>
				<select id="longest" name="longest" ng-model="form.longestPole" ng-options="pole.name as pole.name for pole in poles"></select>
			</div>
			
			<label for="comments">Additional Comments</label>
			<textarea id="comments" name="comments" ng-model="form.comments"></textarea>

		</div>

		<div class="clear"></div>

		<div class="quote-form-actions">

			<div class="button success-bg" ng-click="submit(quoteForm.$valid)">Submit</div>
			<a href="{{ route('home') }}#store"><div class="button info-bg">Back to Store</div></a>

		</div>

	</form>

	<div class="quote-form-container" ng-show="success" ng-cloak>

		<a href="{{ route('home') }}#store"><div class="big-button success-bg">Back To Store</div></a>

	</div>

</div>

@include('partials.contact')

@stop