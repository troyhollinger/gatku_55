@extends('layouts.email')


@section('content')

<h2>Shipping Request Paid</h2>
<br>
<p>Amount Paid : ${{ $request['price'] / 100 }}</p>
<br>
<p>Your order will be on its way shortly!</p>
<br>
<p>Thanks, </p>
<br>
<p>GATKU Polespears</p>


@stop