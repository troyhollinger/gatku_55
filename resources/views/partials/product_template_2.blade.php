
<script tyle="javascript">
	var images = [];
	var key = 0;

	@if ($product->attachedImage)
		addElementToArray('{!! $product->attachedImage !!}');
	@endif

	@if ($product->detachedImage)
		addElementToArray('{!! $product->detachedImage !!}');
	@endif

	@if ($product->image_no_3)
		addElementToArray('{!! $product->image_no_3 !!}');
	@endif

	@if ($product->image_no_4)
		addElementToArray('{!! $product->image_no_4 !!}');
	@endif

	@if ($product->image_no_5)
		addElementToArray('{!! $product->image_no_5 !!}');
	@endif

	@if ($product->image_no_6)
		addElementToArray('{!! $product->image_no_6 !!}');
	@endif

	@if ($product->image_no_7)
		addElementToArray('{!! $product->image_no_7 !!}');
	@endif

	@if ($product->image_no_8)
		addElementToArray('{!! $product->image_no_8 !!}');
	@endif

	@if ($product->image_no_9)
		addElementToArray('{!! $product->image_no_9 !!}');
	@endif

	function addElementToArray(url) {
		var imageInfo = {
			key: key,
			url: url,
			id: 'template-2-big-image-' + key
		};

		key = images.push(imageInfo);
	}
</script>

<div style="margin-top: 75px;"  class="container">

	<div class="product-column-left">

		<div class="template-2-images-wrapper">

			<!-- Big image -->
			<div class="template-2-big-div">
				<!-- Here goes images form js, from images array -->
			</div>
			<!-- Big image - end -->

			<div class="tamplate-2-small-images-wrapper">
				<!-- Here goes thumbs form js, from images array -->
			</div>

		</div>

		<div class="product-title-nowrap">
			<!-- This is part responsible for display product name for desktop -->
			<div class="default-product-name" style="text-align: {{ $product->name_text_align }}">
				<span style="font-weight: {{ $product->name_font_weight }};
							 font-style: {{ $product->name_font_style }};
							 font-size: {{ $product->name_font_size }}px;">{{  ($product->shortName) ? $product->shortName : $product->name }}</span><span ng-show="{{ $product->short_name_space }}">&nbsp;&nbsp;</span><span style="font-weight: {{ $product->name_extension_font_weight }};
								 font-style: {{ $product->name_extension_font_style }};
								 font-size: {{ $product->name_extension_font_size }}px;">{{  $product->short_name_extension }}</span><span ng-show="{{ $product->length_space }}">&nbsp;&nbsp;</span><span style="font-weight: {{ $product->length_font_weight }};
								 font-style: {{ $product->length_font_style }};
								 font-size: {{ $product->length_font_size }}px;">{{ $product->length }}</span>
			</div>

			<!-- This is part responsible for display product name for mobile -->
			<div class="mobile-product-name" style="text-align: {{ $product->name_text_align_for_mobile }}">
				<span style="font-weight: {{ $product->name_font_weight_for_mobile }};
							 font-style: {{ $product->name_font_style_for_mobile }};
							 font-size: {{ $product->name_font_size_for_mobile }}px;">{{  ($product->shortName) ? $product->shortName : $product->name }}</span><span ng-show="{{ $product->short_name_space }}">&nbsp;&nbsp;</span><span style="font-weight: {{ $product->name_extension_font_weight_for_mobile }};
						   	 font-style: {{ $product->name_extension_font_style_for_mobile }};
							 font-size: {{ $product->name_extension_font_size_for_mobile }}px;">{{  $product->short_name_extension }}</span><span ng-show="{{ $product->length_space }}">&nbsp;&nbsp;</span><span style="font-weight: {{ $product->length_font_weight_for_mobile }};
							 font-style: {{ $product->length_font_style_for_mobile }};
							 font-size: {{ $product->length_font_size_for_mobile }}px;">{{  $product->length }}</span>
			</div>

		</div>

		<div class="product-description">

			{!! $product->description !!}

		</div>

		<div class="product-performance">

			<!-- Need to count trimmed string to avoid [$parse:lexerr] error -->
			<div ng-show="{{ strlen(trim($product->editable_1)) }}">
				<img class="product-performance-icon" src="{{ $product->editable_1_image }}">
				<h3 class="product-performance-title bold">{{ $product->editable_1_label }}</h3>
				<p class="product-performance-description">{{ $product->editable_1 }}</p>
			</div>

			<!-- Need to count trimmed string to avoid [$parse:lexerr] error -->
			<div ng-show="{{ strlen(trim($product->editable_2)) }}">
				<img class="product-performance-icon" src="{{ $product->editable_2_image }}">
				<h3 class="product-performance-title bold">{{ $product->editable_2_label }}</h3>
				<p class="product-performance-description">{{ $product->editable_2 }}</p>
			</div>

			<!-- Need to count trimmed string to avoid [$parse:lexerr] error -->
			<div ng-show="{{ strlen(trim($product->editable_3)) }}">
				<img class="product-performance-icon" src="{{ $product->editable_3_image }}">
				<h3 class="product-performance-title bold">{{ $product->editable_3_label }}</h3>
				<p class="product-performance-description">{{ $product->editable_3 }}</p>
			</div>

			<!-- Need to count trimmed string to avoid [$parse:lexerr] error -->
			<div ng-show="{{ strlen(trim($product->editable_4)) }}">
				<img class="product-performance-icon" src="{{ $product->editable_4_image }}">
				<h3 class="product-performance-title bold">{{ $product->editable_4_label }}</h3>
				<p class="product-performance-description">{{ $product->editable_4 }}</p>
			</div>

		</div>

		<product-buyers product-id="{{ $product->id }}"
						section-label="{{ $homeSetting['additional_images_label_for_product'] }}">
		</product-buyers>

	</div>

	<div class="product-column-right">

		<br>

		<p class="product-price" ng-cloak>
			<span class="product-price-amount" ng-cloak>${!! $product->price / 100 !!}</span> /
			<span>{!! $product->shipping_description !!}</span>
		</p>
		@if($product->availability->slug === 'available')

			@if($product->type->slug == 'package')
				<p class="addon-title right"><span style="background-color: #000; color: #FFF;">Included in Package</span> + Optional Add Ons</p>
			@else
				<p class="addon-title right">Click to add to order</p>
			@endif


			<div class="clear"></div>

			<div class="addon-container">
		
				@if($product->sizeable)

				<div ng-repeat="size in product.sizes" ng-cloak>
					<input type="checkbox"  name="size-@{{ $index }}" id="size-@{{ $index }}" ng-model="size.checked" ng-disabled="!size.available">
					<label for="size-@{{ $index }}" ng-class="{ 'faded' : !size.available }"><span class="addon-name">@{{ size.shortName }} -</span>  <span class="addon-price">$@{{ size.price | money }}</span></label>
				</div>

				@foreach($product->sizes as $size)
				<div ng-hide="loaded">
					<input type="checkbox">
					<label><span class="addon-name">Loading-</span>  <span class="addon-price">...</span></label>
				</div>
				@endforeach
				@else

				<div ng-repeat="addon in product.addons"
					 ng-class="{'mark-as-included-class': addon.include_in_package, 'disable-input-field': addon.include_in_package}"
					 ng-cloak>
					<input type="checkbox"
						   name="addon-@{{ $index }}"
						   id="addon-@{{ $index }}"
						   ng-model="addon.checked"
						   ng-init="addon.checked = addon.include_in_package == 1 ? true : false">

					<label for="addon-@{{ $index }}">
                        <span class="addon-name">@{{ addon.product.name }} -</span>
                        <span class="addon-price">$@{{ addon.product.price | money }}</span>
                    </label>
				</div>

				@foreach($product->addons as $addon)
				<div ng-hide="loaded">
					<input type="checkbox">
					<label><span class="addon-name">Loading-</span>  <span class="addon-price">...</span></label>
				</div>
				@endforeach
				@endif

			</div>

			<div class="submit-button" ng-click="addToCart();" ng-bind="productAddedText" ng-class="{ 'post-added-state' : productAdded }"></div>
			<div class="checkout-button" ng-click="openCart();" ng-class="{ 'post-added-state' : productAdded }" ng-show="productAdded">Checkout</div>

			<div class="clear"></div>


			<p class="special-message">
				{!! $product->free_shipping_html !!}
{{--				<span class="bold">Free Shipping</span> on orders over <span class="bold">$300</span> <span class="detail bold">{{ $shippingCountries }} ONLY</span>--}}
			</p>

		@endif

		@if($product->availability->slug === 'preorder')

			<preorder-button></preorder-button>

		@endif

	</div>

	<div class="clear"></div>

</div>
