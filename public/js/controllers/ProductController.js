app.controller('ProductController', ['$scope', 'Product', 'CartService', 'Size', 'AlertService', '$timeout', function($scope, Product, CartService, Size, AlertService, $timeout) {
	$scope.fullSize = true;
	$scope.loaded = false;
	$scope.productAdded = false;
	$scope.productAddedText = "Add to Cart";
	$scope.product = {};

	if (layoutType === 'pole' || layoutType === 'extra') {
		$scope.attached = true;
	} else {
		$scope.attached = false;
	}

	$scope.init = function() {
		$scope.getProduct();
	}

	$scope.getProduct = function() {
		Product.get(productId).success(function(response) {
			$scope.product = response.data;
			parseSizeableAddons();
			$scope.loaded = true;
		}).error(function(response) {
			AlertService.broadcast('Sorry, there is an error. Your page may have not rendered correctly.', 'error');
		});
	}

	$scope.addToCart = function() {
		//console.log("Attempting to add to cart");
		if ($scope.product.sizeable !== "0" && $scope.product.sizeable) {
			var sizes = verifySizeIsChecked();
			console.log("Product is sizeable");
			if (sizes.length) {
				console.log("there are sizes");
				for(var i = 0; i < sizes.length; i++) {
				 	var sizedProduct = angular.copy($scope.product);

					sizedProduct.name = sizes[i].name;
					sizedProduct.price = sizes[i].price;
					sizedProduct.shortName = sizes[i].shortName;
					sizedProduct.sizeId = sizes[i].id;

					CartService.addItem(sizedProduct);
				}
			} else {
				return false;
			}

		} else {
			//console.log("about to add item");
			CartService.addItem($scope.product);
			//console.log("added item");
		}
		$scope.productAddedTextChange();

		reset();
	}

	$scope.openCart = function() {
		CartService.show();
	}

	$scope.scrollAcross = function() {
		if ($scope.product.slug === 'g-string' || $scope.product.slug === 'black g-string') {
			PoleScroll.center();
		} else {
			PoleScroll.scrollAcross();
		}
	}

	$scope.poleScrollInit = function() {
		PoleScroll.init();
	}

	$scope.goFullSize = function() {
		setTimeout(function() {
			PoleScroll.init();
		}, 20);
	}

	function verifySizeIsChecked() {
		var checkedSizes = [];

		for(var i = 0; i < $scope.product.sizes.length; i++) {
			if ($scope.product.sizes[i].checked) {
				checkedSizes.push($scope.product.sizes[i]);
			}
		}
		return checkedSizes;
	}


	/**
	 * Currently, this method only works when one addon is
	 * sizeable. At the moment (5.22.15), the only sizeable addon
	 * is the bands. This could change in the future
	 */
	function parseSizeableAddons() {
		for(var i = 0; i < $scope.product.addons.length; i++) {
			var addon = $scope.product.addons[i];

			//Make price zero if price_zero true for packege included addons
			if (addon.price_zero) {
                addon.product.price = 0;
			}

			if (addon.product.sizeable) {

				if (addon.product.slug === 'bands') {
					var slug = $scope.product.slug + '-band';
				} else if (addon.product.slug === 'hardcore-bands') {
					var slug = $scope.product.slug + '-hardcore';
				}

				if (typeof slug !== 'undefined') {
					Size.getBySlug(slug).success(function(response) {
						addon.product.price = response.data.price;
						addon.product.sizeId = response.data.id;
					}).error(function(response) {
						$scope.product.addons.splice(i, 1);
					});	
				}

				break;
			}
		}
	}

	function reset() {
		if ($scope.product.sizeable !== "0" && $scope.product.sizeable) {
			for(var i = 0; i < $scope.product.sizes.length; i++) {
				$scope.product.sizes[i].checked = false;
			}
		} else {
			for(var i = 0; i < $scope.product.addons.length; i++) {

				//uncheck only addons if not included in package
				if (!$scope.product.addons[i].include_in_package) {
                    $scope.product.addons[i].checked = false;
				}
			}
		}
	}
	$scope.productAddedTextChange = function() {

		$scope.productAddedText = "Item Added!";

		$timeout(function() {

			$scope.productAddedText = "Add to Cart";

		}, 4000);

	}

	function productAddedAnimation() {

		$scope.productAdded = true;

		$timeout(function() {

			$scope.productAdded = false;

		}, 3000);

	}


	$scope.$on('itemAdded', function() {

		// productAddedAnimation();
		$scope.productAdded = true;

	});

	$scope.init();

}]);