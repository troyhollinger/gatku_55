//Bugsnag Error Handler for AngularJS - See: https://docs.bugsnag.com/platforms/browsers/angular/#legacy-angular-support
//Remember to register for AngularJS applications.

//This function allow to avoid exceptions in some cases
function checkIfExceptionShouldBeSent(exception) {
	var notyfy = true;

	//Check if one of below options to avoid send exception to Bugsnag
	switch(exception) {
		case 'Possibly unhandled rejection: close':
			notyfy = false;
			break;
	}

	return notyfy;
}

//Bugsnag javascript setup
angular
    .module('exceptionOverride', [])
    .factory('$exceptionHandler', function () {
        return function (exception, cause) {
        	if (checkIfExceptionShouldBeSent(exception)) {
                bugsnagClient.notify(exception, {
                    beforeSend: function (report) {
                        report.updateMetaData('angular', { cause: cause })
                    }
                })
			}

			//This is code responsible for reporting error in console when dev environment
            if (['production', 'qa', 'QA'].indexOf(CONFIG.environment) === -1) {
                console.error(exception);
            }
        }
    });
//Bugsnag configuration end.

var app = angular.module('gatku', [
	'angularFileUpload',
	'ipCookie',
    'ngAnimate',
    'ngRoute',
	'angular-stripe',
	'ngTouch',
    'ui.bootstrap',
	'credit-cards',
	'checklist-model',
	'angularUtils.directives.dirPagination',
	'exceptionOverride' //register 'Bugsnag Error Handler' for AngularJS Gatku App. See code above.
]);

app.config(function(stripeProvider, $locationProvider) {

    //Need to use following line to avoid conflict with jQuery
	//In this case use href="#path" instead of href="#!path"
	//This hack works for: $routeProvider
    $locationProvider.hashPrefix('');

    //@TODO this keys should not be hardcoded here. This is bad practice. Refactor code to use .env variable.
	if (CONFIG.environment === 'production') {
		stripeProvider.setPublishableKey('pk_live_5MrQVqT1OSrL1lyeYe54NWgs');
	} else {
		stripeProvider.setPublishableKey('pk_test_iTOIZYCF15Qmpq7CYOqltHCJ');
	}
});
