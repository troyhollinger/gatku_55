module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    hostname : 'gatku.dev',

    files: [
    	'js/vendor/jquery-1.10.2.min.js',
    	'bower_components/angular/angular.min.js',
    	'bower_components/skippr/js/jquery.skippr.js',
    	'bower_components/nanobar/nanobar.js',
    	'bower_components/angular-cookie/angular-cookie.js',
    	'bower_components/angular-animate/angular-animate.js',
    	'bower_components/angular-stripe/release/angular-stripe.js',
    	'bower_components/angular-touch/angular-touch.js',
    	'bower_components/angular-credit-cards/release/angular-credit-cards.js',
    	'js/**/*.js',
    	'js/*.js',
		
    ]
  });
};