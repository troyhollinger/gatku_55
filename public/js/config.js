var app = angular.module('gatku', ['angularFileUpload', 'ipCookie', 'ngAnimate', 'angular-stripe', 'ngTouch', 'credit-cards', 'checklist-model','angularUtils.directives.dirPagination']);

app.config(function(stripeProvider) {

	if (CONFIG.environment === 'production') {
	
		stripeProvider.setPublishableKey('pk_live_5MrQVqT1OSrL1lyeYe54NWgs');

	} else {

		stripeProvider.setPublishableKey('pk_test_iTOIZYCF15Qmpq7CYOqltHCJ');		

	}

});