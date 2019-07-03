
@extends('layouts.master')

@section('title')
	{{ config('page_title') }}
@stop

@section('description')
{!! $product->metaDescription !!}
@stop


@section('content')

@include('partials.' . $product->template )

<div class="home-container product-store-section" id="store">

	@include('partials.store')

</div>

@include('partials.contact')


@stop