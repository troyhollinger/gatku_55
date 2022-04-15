## GATKU v2
Lead Developer : Austen Payan (austenpayan@gmail.com)

Tech : Laravel 5.5, Homestead, MySQL, Stripe, AngularJS, Bower, Grunt

## Setup
##### Installation
Follow the standard procedure for setting up a homestead vagrant environment, which you can find at the Laravel Documentation [here](https://laravel.com/docs/4.2/installation).

##### Environment Variables
Email me for the specific values for these keys. Below is a running list of what environment variables your local environment should contain.
* stripe_secret
* stripe_publishable
* mailgun_domain
* mailgun_secret
* db_password
* encryption_key
* test_transaction_email

##### Migrations & Seeds
Once your environment is set up, ssh into homestead and locate your gatku directory. Type `php artisan migrate` to run migrations and then `php artisan db:seed` to run the seed files.

##### Front End Tools
Navigate to the public directory and type `npm install`
## Development
##### Grunt/ Bower
When developing, make sure you go to the `/public` directory and run `grunt`, which will run all of our front-end tasks automatically (concatonation, minification, uglification, etc). Also, if/when you add packaged for use on the front end, do it through bower, e.g. `bower install <package> --save`.
##### Repository Pattern
When writing backend PHP code, try to stick to the Repository pattern (if you are familiar). If you are not familiar thats okay.
## Notes
- all monetary references are stored in cents form (no decimals).



Run Gulp to compile front end code:
===================================

$ cd ./gatku_55/public

# to watch:

$ ./node_modules/.bin/gulp watch

# to build all:

$ ./node_modules/.bin/gulp all
