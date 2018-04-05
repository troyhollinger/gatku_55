<div class="cart-blinder slide" ng-controller="CartBlinderController" ng-show="show" ng-click="hide()" ng-cloak>

	<p>Return To Store</p>

</div>

<div class="cart slide" ng-controller="CartController" ng-show="show" ng-cloak>

	<h2 ng-hide="items.length">Cart</h2>
	<span class="cart-exit" ng-click="hide()">Close<i class="fa fa-close"></i></span>

	<p class="cart-empty-message" ng-hide="items.length">Your cart is empty. Put something in it!</p>

	<div class="cart-stage-1" ng-show="currentStage === 'cart' && items.length">

		<h2>Cart</h2>

		<div class="cart-actions">

			<div class="button success-bg" ng-click="toStage(1)">Checkout</div>
			<div class="button info-bg" ng-click="emptyCart()">Empty Cart</div>

		</div>

		<ul>	
			<li ng-repeat="item in items" class="cart-item" ng-class="{ 'apparel-cart-item' : item.type.slug === 'apparel' }">

				<div class="cart-item-column">

					<h3>@{{ item.name }}</h3>

				</div>

				<div class="cart-quantity-column">
					<span>@{{ item.quantity }} <i class="fa fa-angle-left" ng-click="decreaseItemQuantity($index)"><span ng-if="item.quantity == 1">Remove</span></i> <i class="fa fa-angle-right" ng-click="increaseItemQuantity($index)"></i></span>
				</div>
				
				<div class="cart-price-column">
					<p>$@{{ item.price * item.quantity | money }}</p>
				</div>

				<div class="clear"></div>

				<div class="cart-item-image-container" ng-class="{ 'apparel-cart-item-image-container' : item.type.slug === 'apparel' || item.type.slug === 'glass', 'pole-cart-item-image-container' : item.type.slug === 'pole' || item.slug === 'bands' || item.slug === 'hardcore-bands' }">

					<img ng-src="@{{ item.thumb }}">

				</div>

				<span class="cart-item-addon-title" ng-if="item.addons.length">Addons</span>

				<div class="cart-item-addon-container"
					 ng-repeat="addon in item.addons"
					 ng-if="item.addons.length">

					<div class="cart-item-column">

						<h3>- @{{ addon.name }}</h3>

					</div>

					<div class="cart-quantity-column">
						<span>@{{ addon.quantity }} <i class="fa fa-angle-left" ng-click="decreaseAddonQuantity($parent.$parent.$index, $index)"><span ng-if="addon.quantity == 1">Remove</span></i> <i class="fa fa-angle-right" ng-click="increaseAddonQuantity($parent.$parent.$index, $index)"></i></span>
					</div>

					<div class="cart-price-column">

						<p>$@{{ addon.price * addon.quantity | money }}</p>

					</div>

					<div class="clear"></div>

				</div>

				<div class="cart-item-actions">
					<ul>
						<li><a href="/product/@{{ item.slug }}">View</a></li>
						<li class="cart-item-actions-seperator">&bull;</li>
						<li ng-click="removeItem($index)">Remove</li>
					</ul>
				</div>

			</li>

		</ul>	

		<div class="cart-details">

			<div class="cart-details-row" ng-if="eligibleForDiscount">
				<span class="cart-item-column">Discounts - <span class="smaller faded bold">@{{ discountText }}</span></span>
				<span class="cart-price-column shipping-column success bold" ng-bind="'- $' + (discountAmount | money)"></span>

				<div class="clear"></div>

			</div>

			<div class="cart-details-row">
				<span class="cart-item-column">Subtotal <span class="smaller faded bold" ng-if="subtotal() < 30000 && !blackFriday">- get to $300 for free shipping!</span><span class="smaller faded bold" ng-if="subtotal() >= 30000 && !blackFriday">You get free shipping!</span></span>
				<span class="cart-price-column shipping-column" ng-bind="'$' + (subtotal() | money)"></span>

				<div class="clear"></div>

			</div>

			<div class="cart-details-row">
				<span class="cart-item-column">Shipping <span class="smaller faded bold" ng-if="!blackFriday">Non-U.S.A shipping may vary</span></span>
				<span class="cart-price-column shipping-column" ng-bind="'$' + (shipping() | money)"></span>

				<div class="clear"></div>

			</div>

			<div class="cart-details-row">
				<span class="cart-item-column"><h3>Total</h3></span>
				<span class="cart-price-column" ng-bind="'$' + (total() | money)"></span>

				<div class="clear"></div>

			</div>

		</div>

		<div class="cart-actions">

			<div class="button success-bg" ng-click="toStage(1)">Checkout</div>
			<div class="button info-bg" ng-click="emptyCart()">Empty Cart</div>

		</div>

	</div>


	<div class="cart-stage-2" ng-show="currentStage === 'checkout' && items.length">

		<h2>Checkout</h2> <span class="cart-status-message">@{{ status }}</span>

		<div class="checkout-form">

			<label for="first-name">First Name</label>
			<input type="text" name="first-name" id="first-name" ng-model="form.firstName">

			<label for="last-name">Last Name</label>
			<input type="text" name="last-name" id="last-name" ng-model="form.lastName">

			<label for="email">Email Address</label>
			<input type="text" name="email" id="email" ng-model="form.email">

			<label for="phone">Phone</label>
			<input type="text" name="phone" id="phone" ng-model="form.phone">

			<label for="address">Shipping Address</label>
			<input type="text" name="address" id="address" ng-model="form.address">

			<label for="city">City</label>
			<input type="text" name="city" id="city" ng-model="form.city">

			<label for="state">State / Province</label>
			<input type="text" name="state" id="state" ng-model="form.state">

			<label for="zip">Zip Code</label>
			<input type="text" name="zip" id="zip" ng-model="form.zip">

			<label for="country">Country <span class="faded bold"></span></label>
			<input type="text" name="country" id="country" ng-model="form.country">

			<label>Note to International Orders -</label>
			<p class="cart-note">When shipping outside the USA rates vary. We have found it best to apply rates order specific. Go ahead and place your order now and we will PayPal request the difference in shipping paid on order placed with the actual shipping cost. Thank you.</p>

			<label for="comments">Additional Comments <span class="faded bold">(optional)</span></label>
			<textarea type="text" name="comments" id="comments" ng-model="form.comments"></textarea>

		</div>

		<div class="cart-actions">

			<div class="button success-bg" ng-click="toStage(2)">To Payment</div>
			<div class="button info-bg" ng-click="toStage(0)">Go Back</div>

		</div>

	</div>

	<div class="cart-stage-3" ng-show="currentStage === 'payment' && items.length">

		<h2>Payment</h2>@{{ status }}

		<div class="checkout-form">

			<label for="card-number">Card Number</label>
			<input type="text" name="card-number" id="card-number" ng-model="card.number" placeholder="xxxx xxxx xxxx xxxx" cc-number cc-format>

			<span class="left">
				<label for="card-expiry-month">Expires</label>
				<input type="text" class="native" name="card-expiry-month" size="3" id="expire-month" ng-model="card.expiryMonth" placeholder="MM" cc-exp-month>
				<input type="text" class="native" name="card-expiry-year" size="5" id="expire-year" ng-model="card.expiryYear" placeholder="YYYY" cc-exp-year full-year>
			</span>
			
			<span class="left" style="margin-left:15px">
				<label for="card-security-code">CVC</label>
				<input type="text" class="native" size="5" name="card-security-code" id="card-secutiry-code" ng-model="card.securityCode" placeholder="000" cc-cvc>
			</span>
			
			<div class="clear"></div>

		</div>
		<div class="checkout-form">
			<div class="billing-label">

				<input style="width: 5%; float: left;" id="billing-addr" type="checkbox" name="show-billing" ng-model="card.isBillingSame" value="billing-same"><label>Billing Address same as Shipping Address</label>
			</div>
			<div class="clear"></div>
		</div>
		<div class="checkout-form" ng-show="!card.isBillingSame">

			<label for="billing_address">Billing Address</label>
			<input type="text" name="billing_address" id="billing_address" ng-model="form.billing_address">

			<label for="city">City</label>
			<input type="text" name="billing_city" id="billing_city" ng-model="form.billing_city">

			<label for="state">State / Province</label>
			<input type="text" name="billing_state" id="billing_state" ng-model="form.billing_state">

			<label for="zip">Zip Code</label>
			<input type="text" name="billing_zip" id="billing_zip" ng-model="form.billing_zip">

			<label for="country">Country <span class="faded bold"></span></label>
			<input type="text" name="billing_country" id="country" ng-model="form.billing_country">
			</span>
			
			<div class="clear"></div>

		</div>


		<div class="cart-actions">

			<div class="button success-bg" ng-click="toStage(3)">To Confirmation</div>
			<div class="button info-bg" ng-click="toStage(1)">Go Back</div>

		</div>

	</div>

	<div class="cart-stage-4" ng-show="currentStage === 'confirmation' && items.length">

		<h2>Confirmation</h2>

		<ul>	
			<li ng-repeat="item in items" class="cart-item">

				<div class="cart-item-column">

					<h3>@{{ item.name }}</h3>

				</div>

				<div class="cart-quantity-column">
					<span>@{{ item.quantity }}</span>
				</div>
				
				<div class="cart-price-column">
					<p>$@{{ item.price * item.quantity | money }}</p>
				</div>

				<div class="clear"></div>

				<div class="cart-item-image-container" ng-class="{ 'apparel-cart-item-image-container' : item.type.slug === 'apparel' || item.type.slug === 'glass', 'pole-cart-item-image-container' : item.type.slug === 'pole' || item.slug === 'bands' }">

					<img ng-src="@{{ item.thumb }}">

				</div>

				<span class="cart-item-addon-title" ng-if="item.addons.length">Addons</span>

				<div class="cart-item-addon-container" ng-repeat="addon in item.addons" ng-if="item.addons.length">

					<div class="cart-item-column">

						<h3>- @{{ addon.name }}</h3>

					</div>

					<div class="cart-quantity-column">
						<span>@{{ addon.quantity }}</span>
					</div>

					<div class="cart-price-column">

						<p>$@{{ addon.price * addon.quantity | money }}</p>

					</div>

					<div class="clear"></div>

				</div>

			</li>
		</ul>	

		<div class="cart-details">

			<div class="cart-details-row" ng-if="eligibleForDiscount">
				<span class="cart-item-column">Discounts - <span class="smaller faded bold">@{{ discountText }}</span></span>
				<span class="cart-price-column shipping-column success bold" ng-bind="'- $' + (discountAmount | money)"></span>

				<div class="clear"></div>

			</div>

			<div class="cart-details-row">
				<span class="cart-item-column">Shipping</span>
				<span class="cart-price-column shipping-column" ng-bind="'$' + (shipping() | money)"></span>

				<div class="clear"></div>

			</div>

			<div class="cart-details-row">
				<span class="cart-item-column"><h3>Total</h3></span>
				<span class="cart-price-column" ng-bind="'$' + (total() | money)"></span>

				<div class="clear"></div>

			</div>

			<div class="cart-details-row">

				<h3 class="bold">Ship To :</h3>
				<div ng-if="form.useBillingForShipping">
					
					<p>@{{ form.firstName }} @{{ form.lastName }}</p>
					<p>@{{ form.address }}</p>
					<p>@{{ form.city }}, @{{ form.state }} @{{ form.zip }}</p>
					<p>@{{ form.country }}</p>

				</div>

			</div>	

		</div>

		<p style="margin-bottom:10px;">By Clicking finish, your card will be charged.</p>

		<div class="cart-actions">

			<div class="submit-button" ng-click="submit()">@{{ enabled ? 'Finish' : 'Processing...' }}</div>
			<div class="button info-bg" ng-click="toStage(2)">Go Back</div>

		</div>

	</div>
	

</div>

