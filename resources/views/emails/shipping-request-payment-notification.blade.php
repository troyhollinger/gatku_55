@extends('layouts.email')


@section('content')

<h2>Shipping Request Paid</h2>
<br>
<p>{{ $request['order']['customer']['fullName'] }} has payed the shipping cost of ${{ $request['price'] / 100 }} for order <span>{{ $request['order']['number'] }}</span></p>


@stop