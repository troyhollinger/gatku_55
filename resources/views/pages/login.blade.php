@extends('layouts.master')


@section('content')


	<div class="login-form">

		{{ Form::open(['route' => 'login.authenticate']) }}

			{{ Form::label('email', 'Email') }}
			{{ Form::text('email') }}

			{{ Form::label('password', 'Password') }}
			{{ Form::password('password') }}

			{{ Form::submit('Sign in', ['class' => 'button success-bg',]) }}

		{{ Form::close() }}

	</div>


@stop