app.factory('CartService', ['$rootScope', '$http', 'ipCookie', 'AlertService', '$window', function(
	$rootScope,
	$http,
	ipCookie,
	AlertService,
	$window
) {
	const gatkuCartItemsStorageKey = 'gatkuCartItemsStorageKey';

	var Cookie = ipCookie;
	var CartService = {};
	var LocalStorage = $window.localStorage;

	//Discount
	CartService.getDiscount = function() {
		return Cookie('discount') || '';
	};

	CartService.setDiscount = function(discount) {
		Cookie('discount', discount, { path : '/' });
	};

	CartService.removeDiscount = function() {
		Cookie.remove('discount', { path : '/' });
		CartService.update();
	};
	//Discount end

	//Cart Items
	CartService.getItems = function() {
		var storedValue = JSON.parse(LocalStorage.getItem(gatkuCartItemsStorageKey)) || [];
		return storedValue;
	};

	CartService.setItems = function(cart) {
		LocalStorage.setItem(gatkuCartItemsStorageKey,  JSON.stringify(cart));
		CartService.update();
	};

	/**
	 * This method defines what pieces of data 
	 * you want to use in all of the CartController logic.
	 *
	 */
	CartService.addItem = function(data) {
		var cart = CartService.getItems();
		var item = {};

		item.id = data.id;
		item.name = data.name;
		item.shortName = data.shortName;
		item.length = data.length;
		item.price = data.price;
		item.thumb = data.thumb;
		item.slug = data.slug;
		item.type = {};
		item.type.shippingPrice = data.type.shippingPrice;
		item.type.slug = data.type.slug;
		item.sizeable = data.sizeable;
		item.sizeId = data.sizeId;
		item.addons = [];
		item.quantity = 1;

		// Grab selected addons from the user action,
		// dump them in the item.addons array
		for(var i = 0; i < data.addons.length; i++) {
			var addon = data.addons[i];
			var addonToCart = {};

			if (addon.checked) {
				addonToCart.id = addon.product.id;
				addonToCart.price = addon.product.price;
				addonToCart.name = addon.product.name;
				addonToCart.sizeable = addon.product.sizeable;
                addonToCart.include_in_package = addon.include_in_package;
                addonToCart.price_zero = addon.price_zero;
				addonToCart.type = {};
				addonToCart.type.slug = addon.product.type.slug;
				if (addon.product.sizeId) {
					addonToCart.sizeId = addon.product.sizeId;
				}
				addonToCart.quantity = 1;
				
				item.addons.push(addonToCart);
			}
		}

		cart.push(item);
		CartService.setItems(cart);

		//Additional broadcast
		$rootScope.$broadcast('itemAdded');
	};

	CartService.removeItem = function(index) {
		var cart = CartService.getItems();

		if (!cart.length) return false;
		cart.splice(index,1);
		LocalStorage.removeItem(gatkuCartItemsStorageKey);

		CartService.update();
	};

    CartService.count = function() {
		var items = CartService.getItems();
		var count = 0;

		for(var i = 0; i < items.length; i++) {
			//If statement here is to avoid count packages as a number of elements in Cart
			if (items[i].type.slug != 'package') {
                count+= (1 * items[i].quantity);
			}

			for(var ii = 0; ii < items[i].addons.length; ii++) {
				count+= (1 * items[i].addons[ii].quantity);
			}
		}

		return count;
	};

	CartService.increaseItemQuantity = function(itemIndex) {
		var cart = CartService.getItems();

		cart[itemIndex].quantity++;

		//update included in package addons
		angular.forEach(cart[itemIndex].addons, function(addon, idx) {
			if (addon.include_in_package) {
                cart[itemIndex].addons[idx].quantity = cart[itemIndex].quantity;
			}
		});

		CartService.setItems(cart);
	};

	CartService.decreaseItemQuantity = function(itemIndex) {
		var cart = CartService.getItems();

		cart[itemIndex].quantity--;

        //update included in package addons
        angular.forEach(cart[itemIndex].addons, function(addon, idx) {
            if (addon.include_in_package) {
                cart[itemIndex].addons[idx].quantity = cart[itemIndex].quantity;
            }
        });

		if (cart[itemIndex].quantity == 0) {
			cart.splice(itemIndex, 1);
		}
		CartService.setItems(cart);
	};

	CartService.increaseAddonQuantity = function(itemIndex, addonIndex) {
		var cart = CartService.getItems();
		cart[itemIndex].addons[addonIndex].quantity++;
		CartService.setItems(cart);
	};

	CartService.decreaseAddonQuantity = function(itemIndex, addonIndex) {
		var cart = CartService.getItems();

		cart[itemIndex].addons[addonIndex].quantity--;
		if (cart[itemIndex].addons[addonIndex].quantity == 0) {
			cart[itemIndex].addons.splice(addonIndex, 1);
		}

		CartService.setItems(cart);
	};

	CartService.update = function() {
		$rootScope.$broadcast('update');
	};

	CartService.empty = function() {
	    LocalStorage.removeItem(gatkuCartItemsStorageKey);
		CartService.update();
	};

	CartService.show = function() {
		$rootScope.$broadcast('show');
	};

	CartService.hide = function() {
		$rootScope.$broadcast('hide');
	};

	CartService.productInCart = function(productId) {
		var cookies = CartService.getItems();

		if (cookies.length) {
			for(var i = 0; i < cookies.length; i++) {
				if (cookies[i].id === productId) return true;
			}
		}
		return false;
	};
	
	return CartService;
}]);
