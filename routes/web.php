<?php

use Gatku\HomeSetting;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', ['as' => 'home', function() {
    $homeSetting = HomeSetting::orderBy('id', 'desc')->first();
    return View::make('pages.home')->with('homeSetting',  $homeSetting);
}]);

Route::get('au', ['as' => 'australia', function() {
    return View::make('pages.australia');
}]);

Route::post('product/image', ['as' => 'product.image', 'uses' => 'ProductController@upload']);
Route::get('product/types', ['as' => 'product.types', 'uses' => 'ProductController@types']);
Route::get('product/by/type', ['as' => 'product.getByType', 'uses' => 'ProductController@getByType']);
Route::get('product/by/slug/{slug}', ['as' => 'product.getBySlug', 'uses' => 'ProductController@getBySlug']);
Route::get('product/get/{id}', ['as' => 'product.get', 'uses' => 'ProductController@get']); //done
Route::get('product/photos/{id}', ['as' => 'product.customerPhotos', 'uses' => 'ProductController@photos']);
Route::get('size/by/slug/{slug}', ['as' => 'size.bySlug', 'uses' => 'ProductController@getSizeBySlug']);

Route::resource('product', 'ProductController');

Route::resource('user', 'UserController', ['except' => ['create']]);

Route::get('login', ['as' => 'login', 'uses' => 'AuthenticationController@index']);
Route::post('login', ['as' => 'login.authenticate', 'uses' => 'AuthenticationController@authenticate']);
Route::get('logout', ['as' => 'logout', 'uses' => 'AuthenticationController@logout']);

Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/', ['as' => 'admin.index', function() {
        return View::make('pages.admin');
    }]);
});

Route::resource('order', 'OrderController');

Route::get('orderall/{itemsPerPage}/{pagenumber}', ['as' => 'order.orderall', 'uses' => 'OrderController@orderall']);
Route::get('orderall/{itemsPerPage}/{pagenumber}/{startdate}/{enddate}', ['as' => 'order.orderall', 'uses' => 'OrderController@orderall']);
Route::get('orderall/{itemsPerPage}/{pagenumber}/{startdate}', ['as' => 'order.orderall', 'uses' => 'OrderController@orderall']);

Route::resource('you-image', 'YouImageController', ['only' => ['index', 'store', 'update', 'destroy']]);
Route::post('you-image/upload', ['as' => 'you-image.upload', 'uses' => 'YouImageController@upload']);

Route::resource('home-setting', 'HomeSettingController', ['only' => ['index', 'store', 'update', 'destroy']]);

Route::resource('hear-good-stuff', 'HearGoodStuffController');

Route::post('home-image/upload', ['as' => 'home-image.upload', 'uses' => 'HomeSettingController@upload']);

Route::get('thankyou', ['as' => 'thankyou', function() {
    return View::make('pages.thankyou');
}]);

Route::get('thespear', ['as' => 'thespear', function() {
    $homeSettingThespear = HomeSetting::orderBy('id', 'desc')->first();
    return View::make('pages.thespear')->with('thespear',  $homeSettingThespear);;
}]);

Route::get('images', function() {
    // TODO : use this forumula to retrieve images so that
    // new products can choose already-uploaded images as their
    // product images.

    $photos = [];

    chdir(public_path() . '/img/uploads/');

    foreach(glob('*.{jpg,JPG,jpeg,JPEG,png,PNG}', GLOB_BRACE) as $index => $file) {
        $photos[$index] = $file;
    }
    var_dump($photos);
});

Route::get('quote', ['as' => 'quote', 'uses' => 'QuoteController@index']);
Route::post('quote', ['as' => 'quote.post', 'uses' => 'QuoteController@sendEmail']);

Route::get('media', ['as' => 'media', function() {
    return View::make('pages.media');
}]);

Route::get('availability-type', ['as' => 'availabilityType.index', 'uses' => 'AvailabilityController@index']);

Route::post('shipping-request/pay', ['as' => 'shipping-request.pay', 'uses' => 'ShippingRequestController@pay']);
Route::resource('shipping-request', 'ShippingRequestController', ['except' => ['index', 'create', 'edit', 'update']]);
Route::resource('shipping-track', 'ShippingTrackController', ['except' => ['index', 'create', 'edit', 'update']]);


//Discount route
Route::resource('discount', 'DiscountController');
Route::resource('discounts-exists', 'DiscountExistsController'); //Check if in discounts table are any records
