@extends('layouts.email')

@section('content')

<div style="padding:20px;">

	<h1>Shipping Inquiry</h1>

	<br>

	<h3>Name : {{{ $form['name'] }}}</h3>

	<p>Email : {{{ $form['email'] }}}</p>

	@if(array_key_exists('phone', $form))
	<p>Phone : {{{ $form['phone'] }}}</p>
	@endif

	<p>Address : </p>
	<p>{{{ $form['address'] }}}</p>
	<p>{{{ $form['city'] }}}, {{{ $form['state'] }}} {{{ $form['zip'] }}}</p>
	<p>{{{ $form['country'] }}}</p>
	
	<br>

	<p>How Many Polespears? :</p>
	<p>{{{ $form['amountOfPolespears'] }}}</p>
	<br>
	<p>What is the Longest Polespear?</p>
	<p>{{{ strtoupper($form['longestPole']) }}}</p>
	<br>

	@if(array_key_exists('comments', $form))
	<p>Additional Comments</p>
	<p>{{{ $form['comments'] }}}</p>
	@endif

</div>


@stop