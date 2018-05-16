@if (Route::currentRouteName() === 'home' || Route::currentRouteName() === 'thespear')
<div class="mast">
@else
<div class="mast below-fold">
@endif

	<div class="container navigation-container">
	@if (Route::currentRouteName() === 'thespear')
	<style>
		.mast ul.navigation li, .mast ul.navigation li a{
			color: {{$thespear['button_color']}};
		}
		.mast.below-fold ul.navigation li, .mast.below-fold ul.navigation li a{
			color: #ffffff;
		}
	</style>
	@endif

	@if (Route::currentRouteName() === 'home')
	<style>
		.mast ul.navigation li, .mast ul.navigation li a{
			color: {{$homeSetting['button_color']}};
		}
		.mast.below-fold ul.navigation li, .mast.below-fold ul.navigation li a{
			color: #ffffff;
		}
	</style>
		@if (count($homeSetting) === 1)
		   
		   <a href="{{ route('home') }}"><img id="logo-above" src="{{$homeSetting['logo']}}"></a>


		@else
		    <a href="{{ route('home') }}"><img id="logo-above" src="{{ asset('img/logo-white.png') }}"></a>

		@endif
	 @else
	 	 <a href="{{ route('home') }}"><img id="logo-above" src="{{ asset('img/logo-white.png') }}"></a>
	@endif
		
		<a href="{{ route('home') }}"><img id="logo-below" src="{{ asset('img/logo-white-bg.png') }}"></a>

		<ul class="navigation">
			@if(Route::currentRouteName() === 'thespear')
				<li><a href="{{ route('home') }}#store">Store</a></li>
			@else
				<li><a href="#store">Store</a></li>
			@endif
			@if(Route::currentRouteName() === 'thespear')
				<li><a href="{{ route('home') }}#contact">Contact</a></li>
			@else
				<li><a href="#contact">Contact</a></li>
			@endif
			<li ng-controller="CartCountController" ng-click="showCart()" ng-cloak>Cart <div class="cart-amount-indicator" ng-show="count > 0"><span>@{{ count }}</span></div> </li>
		</ul>

		<div class="clear"></div>

	</div>

</div>

<hamburger></hamburger>

<div class="mobile-mast">
	
	<cart-icon></cart-icon>

	<div class="clear"></div>

</div>

<div class="mobile-navigation" ng-controller="MobileNavigationController" ng-class="{ 'open' : open }">

	<ul>
		<li><a href="{{ route('home') }}" @if(Route::currentRouteName() === 'home') class="faded" @endif>Home</a></li>
		<li><smooth-link text="Store" destination="store"></smooth-link></li>
		<li><smooth-link text="Contact" destination="contact"></smooth-link></li>
		<li><a href="{{ route('quote') }}">Int'l Shipping?</a></li>
	</ul>

</div>








