@extends('layouts.master')

@section('title')
GATKU Australia
@stop

@section('description')
Our Australian shipping rates will now match our U.S. Shipping Rates!
@stop

@section('content')

<div class="hero AustraliaMessageHero" style="background-image:url({{ asset('img/australia.jpg') }})">
    <div class="AustraliaMessage">
        <h1 class="AustraliaMessage-title">Australia!</h1>
        <div class="AustraliaMessage-content">
            <p>Our Australian shipping rates will now match our USA shipping rates!</p>
            <p>$20 for poles, $10 for heads, FREE shipping for orders over $300. <span class="bold">Our Australia Headquarters are now accepting preorders</span> - this is a new feature for us. All orders (first come, first serve)
            will be fulfilled at the beginning of April and thereafter at a much more rapid pace</p>
            <p>All Australian orders, from now on, will ship from Australia. <span class="bold">This will cause dramatic improvement to the $150 shipping rates and long shipping times that once applied.</span> Thank you for bearing with us through this new venture, <span class="bold">our goal is to
            provide you superlative spearfishing products and a supreme shopping experience.</span></p>
            <p class="AustraliaMessage-shop"><a href="#store">Shop Now</a></p>
        </div>
    </div>
</div>

<div class="home-container product-store-section" id="store">
    @include('partials.store')
</div>

@include('partials.contact');

@stop