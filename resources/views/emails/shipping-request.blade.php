@extends('layouts.email')

@section('content')


<h3>You have received a request for additional internation shipping funds for your recent purchase from 
GATKU Polespears</h3>

<br>

<h3>GATKU is requesting an additional ${{ $request['price'] / 100 }} for shipping</h3>

<br>

<p>Please visit the following link to pay the requested amount.</p>

<br>
<a href="{{ route('shipping-request.show', [$request['token']]) }}">Click Here</a>


@stop