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

			<div class="product-on-shelf-links links">
				<div 	class="{{getLinkClass(product)}}"
						ng-repeat="product in products"
						ng-if="product.shelf_id == shelf.id">
					<a href="' . route('product.show', ['']) . '/{{ product.slug }}"
						class="{{product.name_alignment}}">
							{{shelfProductNameToDisplay(product)}}{{shelfProductDisplayLength(product)}}{{shelfProductDisplayLength(product)}}
						<span class="detail"
							ng-if="product.slug === \'signature-paralyzer\' || product.slug === \'barbed-paralyzer\'"> /{{ product.length }}
						</span>

						<span class="mobile-product-name">{{ (product.mobile_name) ? product.mobile_name : "" }}</span>
					</a>
				</div>

				<div class="clear"></div>
			</div>

			<h2 style="text-align: {{shelf.name_text_align}}; font-weight: {{shelf.name_font_weight}}; font-style: {{shelf.name_font_style}};">
				{{ shelf.name }}
			</h2>
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
