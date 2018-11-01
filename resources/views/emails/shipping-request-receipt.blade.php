<!-- Keep this php code in first line -->
<?php $homeSetting = \Gatku\Model\HomeSetting::orderBy('id', 'desc')->first(); ?>

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
<p>{{ $homeSetting['page_title'] }}</p>


@stop