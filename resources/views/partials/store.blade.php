<?php
	$shelves = '
		<div ng-repeat="shelf in shelves" ng-cloak>

			<div class="product-on-shelf-row product-row">
				<div 	class="{{getThumbClass(product)}}"
						ng-repeat="product in products"
						ng-if="product.shelf_id == shelf.id">
					<a href="' . route('product.show', ['']) . '/{{ product.slug }}">
						<img 	ng-src="{{ product.thumb }}"
								ng-class="{ \'knife-thumb\' : product.slug == \'budk\',
											\'bands-thumb\' : product.slug == \'bands\' || product.slug == \'hardcore-bands\' || product.slug == \'offshore-striker\',
											\'monty-thumb\' : product.slug == \'full-monty\',
											\'big-game-thumb\' : product.slug == \'big-game\',
											\'cable-w-tip-thumb\' : product.slug == \'cable-w-tip\' || product.slug == \'cable\' || product.slug == \'tips\',
											\'flashers-thumb\' : product.slug == \'fin-flashers\',
											\'bands-thumb-large\' : product.slug == \'Blue-Water\' || product.slug == \'lionfish\' || product.slug == \'dinner-getter\' ||  product.slug == \'Bahamas-Basics\'
											}">
					</a>
				</div>
				<div class="clear"></div>
			</div>

			<div class="product-on-shelf-links" class="default-product-name">
				<div ng-repeat="product in products"
				     class="{{getLinkClass(product)}}"
					 ng-if="product.shelf_id == shelf.id">
					<a href="' . route('product.show', ['']) . '/{{ product.slug }}">

					    <!-- Regular Page Size Product Name -->
                        <div class="default-product-name"
				             style="text-align: {{  product.name_text_align_for_shelf }};
				                    font-size: {{  product.name_font_size_for_shelf }}px;">
                            <span style="font-weight: {{  product.name_font_weight_for_shelf }};
                                         font-style: {{  product.name_font_style_for_shelf }};
                                         font-size: {{  product.name_font_size_for_shelf }}px;">
                                {{  (product.shortName) ? product.shortName : product.name }}
                            </span>
                            <span style="font-weight: {{  product.name_extension_font_weight_for_shelf }};
                                         font-style: {{  product.name_extension_font_style_for_shelf }};
                                         font-size: {{  product.name_extension_font_size_for_shelf }}px;">
                                {{  product.short_name_extension }}
                            </span>
                            <span style="font-weight: {{  product.length_font_weight_for_shelf }};
                                         font-style: {{  product.length_font_style_for_shelf }};
                                         font-size: {{  product.length_font_size_for_shelf }}px;">
                                {{  product.length }}
                            </span>
                        </div>

                        <!-- Mobile Page Size Product Name -->
                        <div class="mobile-product-name"
                             style="text-align: {{  product.mobile_name_text_align }};
                                    font-weight: {{  product.mobile_name_font_weight }};
                                    font-style: {{  product.mobile_name_font_style }};
                                    font-size: {{  product.mobile_name_font_size }}px;">
                            {{  product.mobile_name }}
                        </div>
					</a>
				</div>

				<div class="clear"></div>
			</div>

            <!-- Desktop Shelf Name -->
			<div class="default-product-name"
			      style="text-align: {{shelf.name_text_align}};
			             font-weight: {{shelf.name_font_weight}};
			             font-style: {{shelf.name_font_style}};
			             font-size: {{shelf.desktop_shelf_font_size}}px;
			             margin-bottom: ' . $homeSetting['shelves_between_space'] . 'px;">
				{{ shelf.name }}
			</div>
			<!-- Desktop Shelf Name - end -->

            <!-- Mobile Shelf Name -->
			<div class="mobile-product-name"
			      style="text-align: {{shelf.name_text_align}};
			             font-weight: {{shelf.name_font_weight}};
			             font-style: {{shelf.name_font_style}};
			             font-size: {{shelf.mobile_shelf_font_size}}px;
			             margin-bottom: ' . $homeSetting['shelves_between_space'] . 'px;">
				{{ shelf.name }}
			</div>
			<!-- Mobile Shelf Name - end -->

		</div>
	';
 ?>

<div class="store-container" ng-controller="StoreController">

    <!-- This is hack how to pass shelf number to StoreController for picked product to set shelves order. -->
    @if(!empty($product))
        <script type="application/javascript">
            var shelfIdForProduct = '{!! $product->shelf_id !!}';
        </script>
    @else
        <script type="application/javascript">
            var shelfIdForProduct = '';
        </script>
    @endif

    {!! $shelves !!}

</div>
