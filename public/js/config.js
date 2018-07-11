//Bugsnag Error Handler for AngularJS - See: https://docs.bugsnag.com/platforms/browsers/angular/#legacy-angular-support
//Remember to register for AngularJS applications.
angular
    .module('exceptionOverride', [])
    .factory('$exceptionHandler', function () {
        return function (exception, cause) {
            bugsnagClient.notify(exception, {
                beforeSend: function (report) {
                    report.updateMetaData('angular', { cause: cause })
                }
            })
        }
    })


var app = angular.module('gatku', [
	'angularFileUpload',
	'ipCookie',
    'ngAnimate',
    'ngRoute',
	'angular-stripe',
	'ngTouch',
	'credit-cards',
	'checklist-model',
	'angularUtils.directives.dirPagination',
	'exceptionOverride' //register 'Bugsnag Error Handler' for AngularJS Gatku App. See code above.
]);

app.config(function(stripeProvider) {
	if (CONFIG.environment === 'production') {
		stripeProvider.setPublishableKey('pk_live_5MrQVqT1OSrL1lyeYe54NWgs');
	} else {
		stripeProvider.setPublishableKey('pk_test_iTOIZYCF15Qmpq7CYOqltHCJ');
	}
});
